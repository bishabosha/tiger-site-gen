package revealTheme

class FontFaceChecks extends munit.FunSuite:
  test("heading weights override individual levels without changing natural metrics") {
    val fonts = DeckFonts(headings = "Display, sans-serif", headingWeights = Map(1 -> 600, 2 -> 500, 3 -> 400))
    assert(fonts.cssVariables.endsWith(";--r-h1-font-weight:600;--r-h2-font-weight:500;--r-h3-font-weight:400"))
    assert(fonts.cssVariables.contains("--r-heading-font-weight:normal"))
    assert(!fonts.cssVariables.contains("line-height"))
    assert(!DeckFonts().cssVariables.contains("--r-h1-font-weight"))
    for invalid <- Seq(Map(0 -> 400), Map(7 -> 400), Map(1 -> 0), Map(1 -> 1001)) do
      intercept[IllegalArgumentException](DeckFonts(headingWeights = invalid))
  }

  test("focus fonts are independent and custom families keep their natural metrics") {
    for fonts <- Seq(DeckFonts(focus = "Display, sans-serif"), DeckFonts(body = "Custom, sans-serif")) do
      assert(fonts.cssVariables.contains("--r-focus-font-weight:normal"))
      assert(fonts.cssVariables.contains("--r-focus-letter-spacing:normal"))
      assert(fonts.cssVariables.contains("--r-focus-line-height:normal"))
    val custom = DeckFonts(focus = "Display, sans-serif")
    assert(custom.cssVariables.contains("--r-focus-font:Display, sans-serif"))
    assert(!custom.cssVariables.contains("--r-heading-font-weight:"))
    for fonts <- Seq(DeckFonts(), DeckFonts(headings = "Heading, serif"), DeckFonts(code = "Code, monospace")) do
      assert(!fonts.cssVariables.contains("--r-focus-font-weight:"))
    intercept[IllegalArgumentException](DeckFonts(focus = ""))
  }

  test("custom heading families use natural metrics, including inherited body families") {
    for fonts <- Seq(DeckFonts(headings = "Custom, sans-serif"), DeckFonts(body = "Custom, sans-serif")) do
      assert(fonts.cssVariables.contains("--r-heading-font-weight:normal"))
      assert(fonts.cssVariables.contains("--r-heading-letter-spacing:normal"))
      assert(!fonts.cssVariables.contains("--r-heading-line-height:"))
    for fonts <- Seq(DeckFonts(), DeckFonts(code = "Custom Mono, monospace")) do
      assert(!fonts.cssVariables.contains("--r-heading-font-weight:"))
      assert(!fonts.cssVariables.contains("--r-heading-letter-spacing:"))
      assert(!fonts.cssVariables.contains("--r-heading-line-height:"))
  }

  test("font faces escape names and paths and support weight/style variants") {
    val face = FontFace("A \"quoted\" font", "My Font #1.woff2", weight = "100 900", style = "italic")
    assert(face.css.contains("font-family: \"A \\\"quoted\\\" font\";"))
    assert(face.css.contains("url(\"assets/fonts/My%20Font%20%231.woff2\") format(\"woff2\")"))
    assert(face.css.contains("font-weight: 100 900;"))
    assert(face.css.contains("font-style: italic;"))
    for (extension, format) <- Seq("woff" -> "woff", "ttf" -> "truetype", "otf" -> "opentype") do
      assert(FontFace("Test", s"font.$extension").css.contains(s"format(\"$format\")"))
    for file <- Seq("../font.woff2", "/font.woff2", "a/../font.woff2", "font.svg") do
      intercept[IllegalArgumentException](FontFace("Test", file))
    for weight <- Seq("0", "1001", "900 100", "400; color:red") do
      intercept[IllegalArgumentException](FontFace("Test", "font.woff2", weight))
    intercept[IllegalArgumentException](FontFace("Test", "font.woff2", style = "italic; color:red"))
  }

  test("font stylesheet checks bundled files and clears removed declarations") {
    val root = os.temp.dir(prefix = "deck-fonts-")
    try
      val fonts = DeckFonts(faces = Seq(FontFace("Test", "Regular.woff2"), FontFace("Test", "Bold.woff2", weight = "700")))
      val error = intercept[IllegalArgumentException](fonts.write(root))
      assert(error.getMessage.contains("public/assets/fonts/"))
      for face <- fonts.faces do
        os.write(root / "assets" / "fonts" / face.file, "test fixture", createFolders = true)
      fonts.write(root)
      val css = os.read(root / "fonts.css")
      assertEquals("@font-face".r.findAllIn(css).size, 2)
      assert(css.contains("font-weight: 400;"))
      assert(css.contains("font-weight: 700;"))
      DeckFonts().write(root)
      assertEquals(os.read(root / "fonts.css"), "")
    finally os.remove.all(root)
  }
