package revealTheme

/** One face of a family. `file` is relative to public/assets/fonts/.
  * Use one entry per weight/style, or a weight range such as "100 900" for a variable font.
  */
final case class FontFace(
    family: String,
    file: String,
    weight: String = "400",
    style: String = "normal"
):
  require(family.trim.nonEmpty && !family.exists(_.isControl), "Font family must be a nonempty name")
  require(file.nonEmpty && !file.contains('\\') && !file.exists(_.isControl) &&
    file.split("/", -1).forall(part => part.nonEmpty && part != "." && part != ".."),
    s"Font file must be relative to assets/fonts/: $file")
  private val format = file.split('.').last.toLowerCase(java.util.Locale.ROOT) match
    case "woff2" => "woff2"
    case "woff" => "woff"
    case "ttf" => "truetype"
    case "otf" => "opentype"
    case _ => throw IllegalArgumentException(s"Unsupported font file: $file (use woff2, woff, ttf or otf)")
  private val weights = weight.split(" ", -1).toSeq.map(_.toIntOption)
  require(Set("normal", "bold")(weight) ||
    (weights.nonEmpty && weights.size <= 2 && weights.forall(_.exists(n => n >= 1 && n <= 1000)) &&
      weights.flatten == weights.flatten.sorted), s"Invalid font weight: $weight")
  require(Set("normal", "italic", "oblique")(style), s"Invalid font style: $style")

  private def quoted(value: String): String =
    "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\""

  private[revealTheme] def css: String =
    val url = new java.net.URI(null, null, s"assets/fonts/$file", null, null).toASCIIString
    s"""@font-face {
       |  font-family: ${quoted(family)};
       |  src: url(${quoted(url)}) format("$format");
       |  font-weight: $weight;
       |  font-style: $style;
       |  font-display: swap;
       |}
       |""".stripMargin
