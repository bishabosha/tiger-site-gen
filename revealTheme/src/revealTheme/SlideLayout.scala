package revealTheme

/** Whole-slide styling selected by the source's `layout` metadata.
 *  Classes belong on the section; heading and content styling stays in CSS.
 */
case class SlideLayout(classes: String, backgroundColor: Option[String] = None):
  require(classes.matches("[a-zA-Z0-9_-]+(?: +[a-zA-Z0-9_-]+)*"),
    s"Invalid slide layout classes: $classes")

object SlideLayout:
  val defaults: Map[String, SlideLayout] = Map(
    "standard" -> SlideLayout("standard"),
    "dark-slide" -> SlideLayout("dark-slide", Some("#19242a")),
    "appendix" -> SlideLayout("appendix")
  )
