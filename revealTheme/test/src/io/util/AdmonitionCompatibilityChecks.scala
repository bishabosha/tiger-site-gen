package io.util

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet
import model.{BlockTemplateFunction, Context, Site, SiteRoot, TemplateBody, TemplateFunctions}
import model.SiteMapSchema.auto.given
import scala.jdk.CollectionConverters.*

class AdmonitionCompatibilityChecks extends munit.FunSuite:
  private def identity(args: String, body: TemplateBody): String = body.html
  private def pieces(args: String, body: TemplateBody): String =
    body.children.map(body.render).mkString

  private object theme extends model.InferredTemplates, model.EmptyExtras:
    val metadata: model.Theme.Metadata = new:
      val name = "Admonition compatibility"
    type SiteMap = NamedTuple.Empty
    val templateDefs = TemplateFunctions((
      diagram = BlockTemplateFunction((_, _) => "<p>Diagram</p>", (_, _) => "<p>Diagram</p>"),
      identity = BlockTemplateFunction(identity, identity),
      pieces = BlockTemplateFunction(pieces, pieces)
    ))

  private def render(source: String): String =
    val ast = md.parseDryRun(source, theme)
    HtmlRenderer.builder(ast).build().render(ast)

  /** Identical Markdown options, with only our new parser extension removed. */
  private def baseline(source: String): String =
    val options = new MutableDataSet(md.parseDryRun("", theme))
    options.set(Parser.EXTENSIONS,
      Parser.EXTENSIONS.get(options).asScala.filterNot(_ == BlockTemplates).toList.asJava)
    val ast = Parser.builder(options).build().parse(source)
    HtmlRenderer.builder(ast).build().render(ast)

  private def normalize(html: String): String = html.trim.replaceAll(">\\s+<", "><")

  private def assertUnchanged(source: String, expected: String): Unit =
    val actual = render(source)
    assertEquals(normalize(actual), normalize(baseline(expected)))
    val root = os.temp.dir(prefix = "admonition-compatibility-")
    try
      given SiteRoot = SiteRoot(root)
      given model.Context = Context.fromSite(theme)(Site.read[theme.SiteMap](None, None, Map.empty))
      assertEquals(normalize(md.renderDoc(source)), normalize(actual))
    finally os.remove.all(root)

  private val note = """!!! note "Read this"
    |
    |    **Bold** and [a link](https://example.com).
    |
    |    - First
    |    - Second
    |""".stripMargin

  test("ordinary, collapsed and expanded admonitions match the original plugin output") {
    for marker <- Seq("!!!", "???", "???+") do
      val source = note.replace("!!!", marker)
      assertUnchanged(source, source)
    val nested = """!!! warning "Outer"
      |
      |    Before.
      |
      |    ??? tip "Inner"
      |
      |        A nested detail.
      |
      |After.
      |""".stripMargin
    assertUnchanged(nested, nested)
  }

  test("an admonition inside a block template retains its HTML and SVG icon") {
    assertUnchanged(s":::identity\n\n$note\n:::", note)
  }

  test("a block template inside an admonition respects its indentation and closing fence") {
    val source = """!!! note "Outer"
      |
      |    :::identity
      |
      |    **Inside** the template.
      |
      |    :::
      |
      |After the admonition.
      |""".stripMargin
    val expected = """!!! note "Outer"
      |
      |    **Inside** the template.
      |
      |After the admonition.
      |""".stripMargin
    assertUnchanged(source, expected)
  }

  test("rendering sibling fragments does not duplicate document-level admonition icons") {
    val source = s"$note\n:::pieces\n\n## Heading\n\nParagraph.\n\n- List\n\n:::\n\n$note"
    val expected = s"$note\n## Heading\n\nParagraph.\n\n- List\n\n$note"
    val actual = render(source)
    assertEquals("<symbol id=\"adm-note\"".r.findAllIn(actual).size, 1)
    assertUnchanged(source, expected)
  }

  test("alternating nested templates and admonitions preserve all plugin output") {
    val source = """:::identity
      |
      |!!! note "Outer"
      |
      |    :::identity
      |
      |    ???+ tip "Inner"
      |
      |        **Details**.
      |
      |    :::
      |
      |:::
      |""".stripMargin
    val expected = """!!! note "Outer"
      |
      |    ???+ tip "Inner"
      |
      |        **Details**.
      |""".stripMargin
    assertUnchanged(source, expected)
  }

  test("admonition and template markers in fenced code remain literal") {
    val content = """!!! note
      |
      |    ```markdown
      |    !!! warning
      |    :::unknown
      |    :::
      |    ```
      |""".stripMargin
    assertUnchanged(s":::identity\n\n$content\n:::", content)
  }

  test("retained template source does not leak control headings into page metadata") {
    val ast = md.parseDryRun("## Visible\n\n:::diagram\n\n### Left\n\nBranches\n\n:::\n\nSummary.", theme)
    val (sample, _, headings) = md.ContentSampler.sampleContent(ast)
    assertEquals(headings.map(_._1), List("Visible"))
    assertEquals(sample.trim, "Summary.")
  }
