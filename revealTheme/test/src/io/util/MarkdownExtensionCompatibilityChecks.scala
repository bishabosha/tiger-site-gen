package io.util

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet
import model.{BlockTemplateFunction, Context, Site, SiteRoot, TemplateBody, TemplateFunctions}
import model.SiteMapSchema.auto.given
import scala.jdk.CollectionConverters.*

class MarkdownExtensionCompatibilityChecks extends munit.FunSuite:
  private def identity(args: String, body: TemplateBody): String = body.html
  private def pieces(args: String, body: TemplateBody): String = body.children.map(body.render).mkString

  private object theme extends model.InferredTemplates, model.EmptyExtras:
    val metadata: model.Theme.Metadata = new:
      val name = "Markdown extension compatibility"
    type SiteMap = NamedTuple.Empty
    val templateDefs = TemplateFunctions((
      identity = BlockTemplateFunction(identity, identity),
      pieces = BlockTemplateFunction(pieces, pieces)
    ))

  private def render(source: String): String =
    val ast = md.parseDryRun(source, theme)
    HtmlRenderer.builder(ast).build().render(ast)

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
    val root = os.temp.dir(prefix = "markdown-extension-compatibility-")
    try
      given SiteRoot = SiteRoot(root)
      given Context = Context.fromSite(theme)(Site.read[theme.SiteMap](None, None, Map.empty))
      assertEquals(normalize(md.renderDoc(source)), normalize(actual))
    finally os.remove.all(root)

  private val samples = Seq(
    "attributes" -> """## Heading {#custom .heading}
      |
      |Paragraph with *emphasis*{.emphasis} and [link](https://example.com){.link}. {.paragraph}
      |
      |- First
      |- Second
      |
      |{.list}
      |
      |```scala {.sample}
      |val n = 1
      |```
      |""".stripMargin,
    "tables, superscript and strikethrough" -> """| Feature | Value |
      || :--- | ---: |
      || Superscript | x^2^ |
      || Strikethrough | ~~old~~ |
      || Link | [reference][target] |
      |
      |{.custom-table}
      |
      |[target]: https://example.com
      |""".stripMargin,
    "GitLab inline syntax, math, Mermaid and video" -> """{+added+} and {-removed-}, $`x^2`$.
      |
      |![Video](movie.mp4)
      |
      |![Reference video][movie]
      |
      |```math
      |x^2
      |:::unknown
      |:::
      |```
      |
      |```mermaid
      |graph LR
      |A --> B
      |:::unknown
      |:::
      |```
      |
      |[movie]: movie.mp4
      |""".stripMargin,
    "GitLab block quotes" -> ">>>\n\n**Quoted** [link](https://example.com).\n\n>>>\n"
  )

  for (name, sample) <- samples do
    test(s"$name are unchanged outside templates and in whole or fragmented bodies") {
      assertUnchanged(sample, sample)
      for template <- Seq("identity", "pieces") do
        assertUnchanged(s":::$template\n\n$sample\n:::\n", sample)
    }

  test("heading anchors remain unique across nested templates and sibling fragments") {
    val source = """## Repeated
      |
      |:::pieces
      |
      |## Repeated
      |
      |:::identity
      |
      |## Repeated
      |
      |## Explicit {#chosen}
      |
      |:::
      |
      |## Repeated
      |
      |:::
      |
      |## Repeated
      |""".stripMargin
    val expected = source.linesIterator.filterNot(_.startsWith(":::")).mkString("\n")
    assertUnchanged(source, expected)
    val html = render(source)
    for id <- Seq("repeated", "repeated-1", "repeated-2", "repeated-3", "repeated-4", "chosen") do
      assert(html.contains(s"href=\"#$id\""), html)
  }

  test("attributes on neighboring Markdown stay on their intended elements") {
    val source = """Before. {.before}
      |
      |:::identity
      |
      |Inside. {.inside}
      |
      |:::
      |
      |After. {.after}
      |""".stripMargin
    assertUnchanged(source, "Before. {.before}\n\nInside. {.inside}\n\nAfter. {.after}")
  }

  test("templates inside GitLab block quotes respect both closing markers") {
    val source = ">>>\n\n:::identity\n\n**Inside**.\n\n:::\n\n>>>\n\nAfter."
    assertUnchanged(source, ">>>\n\n**Inside**.\n\n>>>\n\nAfter.")
  }

  test("GitLab closing fences cannot cross an unclosed template") {
    // The stock plugin treats the next >>> as a closer, not a nested opener.
    // Confirm that behavior independently before checking our diagnostic.
    assertEquals(normalize(baseline(">>>\n\n>>>\n\n**Outside**.")),
      "<blockquote></blockquote><p><strong>Outside</strong>.</p>")
    val error = intercept[IllegalArgumentException] {
      render(">>>\n\n:::identity\n\n>>>\n\n**Outside**.")
    }
    assert(error.getMessage.contains("Unclosed :::identity at line 3"), error.getMessage)
  }

  test("standard block quotes support alternating template and quote nesting") {
    val source = "> :::identity\n>\n> > **Inside**.\n>\n> :::\n\nAfter."
    assertUnchanged(source, "> > **Inside**.\n\nAfter.")
  }

  test("attributes attached to template containers decorate their output") {
    val expected = "<div class=\"panel\" id=\"example\">\n<p>Inside.</p>\n</div>"
    for source <- Seq(
      ":::identity\n\nInside.\n\n:::\n\n{.panel #example}",
      ":::identity\n\n{.panel #example}\n\nInside.\n\n:::"
    ) do assertUnchanged(source, expected)
  }

  test("template markers in raw HTML and comments remain literal") {
    for raw <- Seq("<!--\n:::unknown\n:::\n-->", "<pre>\n:::unknown\n:::\n</pre>", "<div>\n:::unknown\n:::\n</div>") do
      assertUnchanged(raw, raw)
      assertUnchanged(s":::identity\n\n$raw\n\n:::\n", raw)
  }

  test("HTML end tags followed immediately by a closing template fence remain valid") {
    for raw <- Seq("<!--\n:::unknown\n:::\n-->", "<pre>\n:::unknown\n:::\n</pre>") do
      assertUnchanged(s":::identity\n\n$raw\n:::\n", raw)
  }
