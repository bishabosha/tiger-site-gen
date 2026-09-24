package live

import model.{Context, SiteRoot}
import io.util.paths

/** Live editing for any Tiger site: build, watch, preview unsaved drafts and serve with
 *  automatic refresh, in one JVM.
 *  {{{
 *  object Blog extends LiveSite(MyTheme, contentDirectory = "content", outputDirectory = "dist")(using SiteRoot.here)
 *  @main def blog(args: String*): Unit = Blog.main(args)
 *  }}}
 *  `blog dev [--port N]` (default), `blog build`, `blog watch`, `blog serve [--static] [--port N]`.
 *
 *  Each build writes a [[BuildStatus]] marker (`<output>/.tiger-build.json`) last: success,
 *  or the failure's message and trace for the browser's error overlay. A failed build keeps
 *  the previous output.
 *
 *  @param contentDirectory the Markdown sources, relative to the site root.
 *  @param outputDirectory the built site, relative to the site root.
 *  @param watched site-root directories whose edits trigger a rebuild, besides the content.
 */
class LiveSite[T <: model.Theme](
    val theme: T,
    val contentDirectory: String = "content",
    val outputDirectory: String = "dist",
    val watched: Seq[String] = Seq("theme", "public")
)(using val root: SiteRoot):
  private val session = new model.BuildSession
  @volatile private var last: Option[BuildStatus] = None

  def contentRoot: os.Path = root.root / os.RelPath(contentDirectory)
  def outputRoot: os.Path = root.root / os.RelPath(outputDirectory)
  /** Site-root-relative source directories listed in `.tiger-editor.json` for editors. */
  def editorSources: Seq[String] = Seq(contentDirectory)
  /** The page announced when serving. */
  def siteUrl: String = "/"
  def studio: StudioSettings = StudioSettings()
  /** Output-relative globs of generated HTML pages that never get the reload client. */
  def noReload: Seq[String] = Nil
  /** The last build's outcome in this process. */
  def status: Option[BuildStatus] = last

  /** Renders unsaved documents with the site's theme; learns page dependencies from builds. */
  lazy val drafts: SiteDrafts = SiteDrafts(theme, contentRoot)

  /** Build once. A failure writes a failed [[BuildStatus]] (keeping the previous output), then rethrows. */
  def build(): BuildStatus = synchronized {
    val status =
      try buildOnce()
      catch case scala.util.control.NonFatal(error) =>
        val failed = BuildStatus.failed(error)
        try BuildStatus.write(outputRoot, failed)
        catch case scala.util.control.NonFatal(markerError) => error.addSuppressed(markerError)
        last = Some(failed)
        throw error
    last = Some(status)
    status
  }

  private def buildOnce(): BuildStatus =
    val started = System.nanoTime()
    given theme.Context = Context.fromTheme(contentRoot, theme, session)
    val prepared = System.nanoTime()
    val sources = os.walk(contentRoot).filter(os.isFile).toSet
    // Mounted themes' afterRender hooks complete their output inside renderSite.
    val dependencies = paths.renderSite(outputRoot, theme, sources)
    model.EditorManifest.write(theme, editorSources)
    drafts.learn(dependencies)
    val status = BuildStatus.succeeded()
    BuildStatus.write(outputRoot, status)
    val completed = System.nanoTime()
    println(s"Rebuild: ${(completed - started) / 1000000} ms (prepare ${(prepared - started) / 1000000} ms, output ${(completed - prepared) / 1000000} ms)")
    status

  /** Build, reporting (not throwing) failures: browsers show them from the marker. */
  def rebuild(): BuildStatus =
    try build()
    catch case scala.util.control.NonFatal(error) =>
      System.err.println(s"Build failed: ${error.getMessage}")
      last.get

  /** Rebuild on edits to the content and `watched` directories; Scala changes need a restart. */
  def watch(afterBuild: BuildStatus => Unit = _ => ()): AutoCloseable =
    // File-system events report resolved paths (e.g. /private/var on macOS).
    val directories = (contentRoot +: watched.map(name => root.root / os.RelPath(name))).filter(os.isDir)
      .map(directory => os.Path(directory.toNIO.toRealPath()))
    os.watch.watch(directories, changes =>
      if changes.exists(_.ext == "scala") then
        println("Scala theme changed: restart to recompile it.")
      else
        afterBuild(rebuild())
    )

  /** Serve `output`. Live serving adds the reload client, Content studio and draft previews. */
  def serve(port: Int, live: Boolean = true, output: os.Path = outputRoot): LiveServer =
    LiveServer.start(LiveServerConfig(output, contentRoot, root.root, live = live, port = port, siteUrl = siteUrl,
      drafts = if live then Some(drafts) else None, studio = studio, noReload = noReload))

  /** Build, watch, render drafts and serve with automatic refresh, until the process exits. */
  def dev(port: Int): Unit =
    rebuild()
    val server = serve(port, live = true)
    // In-process builds notify the server directly; the marker covers other processes.
    val watcher = watch(status => server.published(status))
    sys.addShutdownHook { watcher.close(); server.close() }
    println(s"Watching ${(contentDirectory +: watched).mkString(", ")}.")
    new java.util.concurrent.CountDownLatch(1).await()

  /** Apply command-line options before running a command (e.g. a render mode). */
  protected def selectOptions(args: Seq[String]): Unit = ()
  /** Whether `serve` is live for these options. */
  protected def serveLive(args: Seq[String]): Boolean = !args.contains("--static")
  protected def defaultPort(live: Boolean): Int = if live then 8123 else 8127

  /** Command-line entry point: `dev` (default), `build`, `watch`, `serve [--static]`, with `--port N` or `PORT`. */
  def main(args: Seq[String]): Unit =
    selectOptions(args)
    val port = args.indexOf("--port") match
      case -1 => sys.env.get("PORT").map(_.toInt)
      case index => args.lift(index + 1).map(_.toInt)
    args.filterNot(_.startsWith("--")).filterNot(arg => port.exists(_.toString == arg)).headOption.getOrElse("dev") match
      case "build" => build()
      case "watch" =>
        rebuild()
        val watcher = watch()
        sys.addShutdownHook(watcher.close())
        println(s"Watching ${(contentDirectory +: watched).mkString(", ")}.")
        new java.util.concurrent.CountDownLatch(1).await()
      case "serve" =>
        val live = serveLive(args)
        val server = serve(port.getOrElse(defaultPort(live)), live)
        sys.addShutdownHook(server.close())
        new java.util.concurrent.CountDownLatch(1).await()
      case "dev" =>
        if !serveLive(args) then throw IllegalArgumentException("dev is live-only; use serve for static output")
        dev(port.getOrElse(defaultPort(true)))
      case other =>
        throw IllegalArgumentException(s"Unknown command: $other (expected dev, build, watch or serve)")
