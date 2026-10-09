package live

import model.{DisplayMode, SiteRoot}

object LiveSite:
  /** Assemble the standard Tiger builder and draft renderer for any theme. */
  def apply[T <: model.Theme](theme: T, settings: LiveSiteSettings = LiveSiteSettings())(using root: SiteRoot): LiveSite =
    val content = root.root / os.RelPath(settings.contentDirectory)
    new LiveSite(ThemeBuilder(theme, content, settings.sources), SiteDrafts(theme, content), settings)

/** Build, watch and serve a site using injected components.
 *  A failed build keeps previous output and publishes an error marker for the browser.
 *  Theme-specific behavior belongs in the builder, draft renderer and settings.
 */
final class LiveSite(
    val builder: SiteBuilder,
    val drafts: DraftRenderer,
    val settings: LiveSiteSettings = LiveSiteSettings()
)(using val root: SiteRoot):
  @volatile private var last: Option[BuildStatus] = None

  def contentRoot: os.Path = root.root / os.RelPath(settings.contentDirectory)
  def displayMode: DisplayMode = settings.displayMode
  def output(mode: DisplayMode): os.Path = root.root / os.RelPath(settings.output(mode))
  def outputRoot: os.Path = output(displayMode)
  def status: Option[BuildStatus] = last

  /** Build once. Failures publish a failed marker and are rethrown to the caller. */
  def build(mode: DisplayMode = displayMode): BuildStatus = synchronized {
    val started = System.nanoTime()
    val status =
      try
        drafts.learn(builder.build(output(mode), mode))
        val succeeded = BuildStatus.succeeded()
        BuildStatus.write(output(mode), succeeded)
        println(s"Rebuild: ${(System.nanoTime() - started) / 1000000} ms")
        succeeded
      catch case scala.util.control.NonFatal(error) =>
        val failed = BuildStatus.failed(error)
        try BuildStatus.write(output(mode), failed)
        catch case scala.util.control.NonFatal(markerError) => error.addSuppressed(markerError)
        last = Some(failed)
        throw error
    last = Some(status)
    status
  }

  /** Build, reporting rather than throwing failures. */
  def rebuild(mode: DisplayMode = displayMode): BuildStatus =
    try build(mode)
    catch case scala.util.control.NonFatal(error) =>
      System.err.println(s"Build failed: ${error.getMessage}")
      last.get

  /** A watcher captures its mode; other operations cannot change where it builds. */
  def watch(afterBuild: BuildStatus => Unit = _ => (), mode: DisplayMode = displayMode): AutoCloseable =
    val directories = (contentRoot +: settings.watched.map(name => root.root / os.RelPath(name))).filter(os.isDir)
      .map(directory => os.Path(directory.toNIO.toRealPath()))
    os.watch.watch(directories, changes =>
      if changes.exists(_.ext == "scala") then
        println("Scala theme changed: restart to recompile it.")
      else afterBuild(rebuild(mode))
    )

  /** Serve an output directory, optionally with live transport and Content studio. */
  def serve(port: Int, live: Boolean = displayMode == DisplayMode.Live, output: os.Path = outputRoot): LiveServer =
    LiveServer.start(LiveServerConfig(output, contentRoot, root.root, live = live, port = port,
      siteUrl = settings.siteUrl, drafts = if live then Some(drafts) else None,
      studio = settings.studio, noReload = settings.noReload))

  /** Serve the selected mode's output, with editing enabled only for live rendering. */
  def serve(port: Int, mode: DisplayMode): LiveServer = serve(port, mode == DisplayMode.Live, output(mode))

  /** Build, watch and serve in live mode until the process exits. */
  def dev(port: Int): Unit =
    rebuild(DisplayMode.Live)
    val server = serve(port, DisplayMode.Live)
    val watcher = watch(status => server.published(status), DisplayMode.Live)
    sys.addShutdownHook { watcher.close(); server.close() }
    awaitChanges()

  private def awaitChanges(): Unit =
    println(s"Watching ${(settings.contentDirectory +: settings.watched).mkString(", ")}.")
    new java.util.concurrent.CountDownLatch(1).await()

  /** `dev` (default), `build`, `watch`, or `serve`; mode and port are local to this invocation. */
  def main(args: Seq[String]): Unit =
    val options = LiveSiteOptions.parse(args, displayMode, sys.env)
    options.command match
      case "build" => build(options.mode)
      case "watch" =>
        rebuild(options.mode)
        val watcher = watch(mode = options.mode)
        sys.addShutdownHook(watcher.close())
        awaitChanges()
      case "serve" =>
        val server = serve(options.port, options.live, output(options.mode))
        sys.addShutdownHook(server.close())
        new java.util.concurrent.CountDownLatch(1).await()
      case "dev" => dev(options.port)
      case other => throw IllegalArgumentException(s"Unknown command: $other (expected dev, build, watch or serve)")
