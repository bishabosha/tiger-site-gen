package io.util

case class FrontMatterMeta(title: String, count: Int) derives scalanotation.Reader

class FrontMatterChecks extends munit.FunSuite:
  private val son = """(title = "Example", count = 42)"""
  private val body = "\n# Heading\n\nText.\n\n---\n\n```scala\nval x = 1\n```\n"
  private val compact = s"---scala\n$son\n---\n$body"
  private val legacy = s"```scala\n$son\n```\n---\n$body"

  private def document(source: String): model.Doc[FrontMatterMeta] =
    val root = os.temp.dir(prefix = "son-frontmatter-")
    try
      val file = root / "example.md"
      os.write(file, source)
      md.render[FrontMatterMeta](0, "example", file, os.RelPath("example.html"), revealTheme.RevealTheme)
    finally os.remove.all(root)

  test("compact and both legacy forms read the same typed metadata and Markdown") {
    val expected = document(legacy)
    for source <- Seq(compact, legacy, "---\n" + legacy) do
      val actual = document(source)
      assertEquals(actual.frontMatter, FrontMatterMeta("Example", 42))
      assertEquals(actual.rawContent, body)
      assertEquals(actual.headings, expected.headings)
      assertEquals(actual.wordCount, expected.wordCount)
      assertEquals(actual.htmlPreview, expected.htmlPreview)
  }

  test("CRLF, a BOM, trailing delimiter spaces and an empty body are supported") {
    val windows = compact.replace("\n", "\r\n")
    assertEquals(document("\uFEFF" + windows).rawContent, body.replace("\n", "\r\n"))
    assertEquals(document(s"---scala \t\n$son\n--- \t").rawContent, "")
    assertEquals(document(s"---scala\n$son\n---\n").rawContent, "")
  }

  test("SON imports and dedented strings still use the existing reader") {
    val source = """---scala
      |(
      |  // A SON string, not a YAML mapping.
      |  title = '''
      |    First line
      |    Second line
      |    ''',
      |  count = 42
      |)
      |---
      |# Heading
      |""".stripMargin
    val actual = document(source)
    assert(actual.frontMatter.title.contains("First line\nSecond line"))
    assertEquals(actual.frontMatter.count, 42)
    assertEquals(actual.rawContent, "# Heading\n")
  }

  test("a later horizontal rule cannot start front matter") {
    interceptMessage[IllegalArgumentException]("no front matter found; expected ---scala followed by a SON value and closing ---") {
      FrontMatter.split("# Body\n\n" + compact)
    }
  }

  test("missing delimiters and malformed SON report the source path") {
    for (source, diagnostic) <- Seq(
      s"---scala\n$son\n" -> "unclosed ---scala",
      "---scala\n(title = )\n---\nBody" -> "failed to read front matter",
      "# No metadata" -> "no front matter found"
    ) do
      val error = intercept[Exception](document(source))
      assert(error.getMessage.contains("example.md"), error.getMessage)
      assert(error.getMessage.contains(diagnostic), error.getMessage)
  }
