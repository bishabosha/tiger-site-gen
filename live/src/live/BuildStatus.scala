package live

import upickle.default.ReadWriter

/** The outcome of one completed build, announced to browsers by [[LiveServer]].
 *
 *  A builder writes it last, as `<output>/.tiger-build.json`, after pages and every
 *  `afterRender` hook have completed; a server in another process polls for it. An
 *  in-process builder can also hand it to [[LiveServer.published]] directly.
 *
 *  @param revision unique per build; browsers refresh when it changes.
 *  @param ok false when the build failed; the previous output is left in place.
 *  @param message the failure's message (shown in the browser's error overlay).
 *  @param trace the failure's stack trace.
 */
final case class BuildStatus(revision: String, ok: Boolean, message: Option[String] = None,
    trace: Option[String] = None) derives ReadWriter:
  def json: ujson.Value = upickle.default.writeJs(this)

object BuildStatus:
  /** The marker's name inside an output directory. */
  val MarkerName = ".tiger-build.json"

  private val instance = java.util.UUID.randomUUID().toString.take(8)
  private val counter = java.util.concurrent.atomic.AtomicLong()

  /** A revision that is unique across builds of this process and across restarts. */
  def nextRevision(): String = s"$instance-${counter.incrementAndGet()}-${System.currentTimeMillis()}"

  def succeeded(): BuildStatus = BuildStatus(nextRevision(), ok = true)

  def failed(error: Throwable): BuildStatus =
    val trace = new java.io.StringWriter
    error.printStackTrace(new java.io.PrintWriter(trace))
    BuildStatus(nextRevision(), ok = false, Some(Option(error.getMessage).getOrElse(error.toString)), Some(trace.toString))

  def marker(outputRoot: os.Path): os.Path = outputRoot / MarkerName

  /** Write the marker; call only after all other output of the build is complete. */
  def write(outputRoot: os.Path, status: BuildStatus): Unit =
    os.write.over(marker(outputRoot), upickle.default.write(status), createFolders = true)

  def read(outputRoot: os.Path): Option[BuildStatus] =
    val file = marker(outputRoot)
    if !os.isFile(file) then None
    else Some(upickle.default.read[BuildStatus](os.read(file)))
