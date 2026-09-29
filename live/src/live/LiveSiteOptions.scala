package live

import model.DisplayMode

/** Command selection does not mutate the live host or an existing watcher. */
private[live] final case class LiveSiteOptions(command: String, mode: DisplayMode, live: Boolean, port: Int)

private[live] object LiveSiteOptions:
  def parse(args: Seq[String], defaultMode: DisplayMode, env: Map[String, String]): LiveSiteOptions =
    var mode = defaultMode
    var explicitMode = false
    var command: Option[String] = None
    var port: Option[Int] = None
    var staticServing = false
    val remaining = args.iterator
    while remaining.hasNext do remaining.next() match
      case "--live" => mode = DisplayMode.Live; explicitMode = true
      case "--display" => mode = DisplayMode.Static; explicitMode = true
      case "--static" => staticServing = true
      case "--port" =>
        require(remaining.hasNext, "--port requires a port number")
        port = Some(remaining.next().toInt)
      case option if option.startsWith("--") => throw IllegalArgumentException(s"Unknown option: $option")
      case name =>
        require(command.isEmpty, s"Unexpected argument: $name")
        command = Some(name)
    if !explicitMode then mode = env.get("TIGER_RENDER_MODE") match
      case Some("display") => DisplayMode.Static
      case Some("live") => DisplayMode.Live
      case None => defaultMode
      case Some(other) => throw IllegalArgumentException(s"Unknown render mode: $other")
    val live = mode == DisplayMode.Live && !staticServing
    val name = command.getOrElse("dev")
    require(name != "dev" || live, "dev is live-only; use serve for static output")
    val selectedPort = port.orElse(env.get("PORT").map(_.toInt)).getOrElse(if live then 8123 else 8127)
    require(selectedPort >= 0 && selectedPort <= 65535, "Invalid port")
    LiveSiteOptions(name, mode, live, selectedPort)
