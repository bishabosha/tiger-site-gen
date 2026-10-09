package revealLive

import live.{LiveSiteSettings, OutputDirectories, StudioSettings}

/** Reveal's defaults are ordinary settings for the final, generic live host. */
object RevealLive:
  def settings(collection: String, contentDirectory: String = "content"): LiveSiteSettings =
    val slides = s"$collection/slides"
    LiveSiteSettings(
      contentDirectory = contentDirectory,
      output = OutputDirectories(live = "dist", static = "dist-display"),
      editorSources = Some(Seq(s"$contentDirectory/$collection")),
      siteUrl = s"/$collection/",
      studio = StudioSettings(slides, Seq(SlidePolicy(slides)))
    )
