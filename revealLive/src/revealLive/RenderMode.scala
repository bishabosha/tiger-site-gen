package revealLive

/** Live builds carry authoring controls; display builds are plain, static presentations. */
enum RenderMode(val outputDirectory: String, val label: String):
  case Live extends RenderMode("dist", "live")
  case Display extends RenderMode("dist-display", "display")

object RenderMode:
  @volatile private var chosen: Option[RenderMode] = None

  def parse(value: String): RenderMode = value match
    case "live" => Live
    case "display" => Display
    case other => throw IllegalArgumentException(s"Unknown render mode: $other (expected live or display)")

  /** The mode used by layouts rendered in this process: an explicit choice, else
   *  `TIGER_RENDER_MODE` (live or display), else live.
   */
  def selected: RenderMode = chosen.getOrElse(sys.env.get("TIGER_RENDER_MODE").map(parse).getOrElse(Live))

  /** Choose the mode for this process, before building. Entry points call this for `--display`. */
  def select(mode: RenderMode): Unit = chosen = Some(mode)
