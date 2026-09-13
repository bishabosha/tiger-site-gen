package revealTheme

/** CSS font-family stacks shared by the deck, embedded players and speaker notes.
  * Faces refer to files in the host's public/assets/fonts directory.
  */
final case class DeckFonts(
    body: String = "Source Sans, Arial, sans-serif",
    headings: String = "var(--r-main-font)",
    code: String = "Menlo, Consolas, monospace",
    faces: Seq[FontFace] = Seq.empty,
    focus: String = "var(--r-main-font)",
    headingWeights: Map[Int, Int] = Map.empty
):
  for (name, value) <- Seq("body" -> body, "headings" -> headings, "code" -> code, "focus" -> focus) do
    require(value.trim.nonEmpty && !value.exists(";{}<>\r\n".contains(_)),
      s"Invalid $name font-family stack: $value")

  for (level, weight) <- headingWeights do
    require(level >= 1 && level <= 6, s"Invalid heading level: $level")
    require(weight >= 1 && weight <= 1000, s"Invalid h$level font weight: $weight")

  private[revealTheme] def cssVariables: String =
    val customHeadings = headings != "var(--r-main-font)" || body != "Source Sans, Arial, sans-serif"
    val headingStyles = if customHeadings then
      ";--r-heading-font-weight:normal;--r-heading-letter-spacing:normal"
    else ""
    val customFocus = focus != "var(--r-main-font)" || body != "Source Sans, Arial, sans-serif"
    val focusStyles = if customFocus then
      ";--r-focus-font-weight:normal;--r-focus-letter-spacing:normal;--r-focus-line-height:normal"
    else ""
    val weights = headingWeights.toSeq.sortBy(_._1)
      .map((level, weight) => s";--r-h$level-font-weight:$weight").mkString
    s"--r-main-font:$body;--r-heading-font:$headings;--r-code-font:$code;--r-focus-font:$focus$headingStyles$focusStyles$weights"

  /** Always overwrite the stylesheet, including when all custom faces are removed. */
  private[revealTheme] def write(directory: os.Path): Unit =
    for face <- faces do
      val path = directory / "assets" / "fonts" / os.RelPath(face.file)
      require(os.isFile(path), s"Missing font file: $path. Put ${face.file} in public/assets/fonts/.")
    os.write.over(directory / "fonts.css", faces.map(_.css).mkString("\n"), createFolders = true)
