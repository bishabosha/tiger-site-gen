package live

import model.DisplayMode

/** Site-root-relative destinations, selected separately for every operation. */
final case class OutputDirectories(live: String = "dist", static: String = "dist"):
  def apply(mode: DisplayMode): String = mode match
    case DisplayMode.Live => live
    case DisplayMode.Static => static

/** Paths and authoring policy are data, independent of the host's lifecycle. */
final case class LiveSiteSettings(
    contentDirectory: String = "content",
    output: OutputDirectories = OutputDirectories(),
    watched: Seq[String] = Seq("theme", "public"),
    editorSources: Option[Seq[String]] = None,
    siteUrl: String = "/",
    studio: StudioSettings = StudioSettings(),
    noReload: Seq[String] = Nil,
    displayMode: DisplayMode = DisplayMode.Live
):
  def sources: Seq[String] = editorSources.getOrElse(Seq(contentDirectory))
