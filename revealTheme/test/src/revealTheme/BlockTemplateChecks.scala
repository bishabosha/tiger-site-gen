package revealTheme

import com.vladsch.flexmark.ast.Heading
import com.vladsch.flexmark.html.HtmlRenderer
import io.util.md
import model.{BlockTemplateFunction, Context, Site, SiteRoot, TemplateFunction, TemplateFunctions}
import model.Record.++
import model.SiteMapSchema.auto.given
import scala.jdk.CollectionConverters.*
import scalatags.Text.all.*

class BlockTemplateChecks extends munit.FunSuite:
  private object child extends model.InferredTemplates, model.EmptyExtras:
    val metadata: model.Theme.Metadata = new:
      val name = "Live context"
    type SiteMap = NamedTuple.Empty
    val templateDefs = TemplateFunctions((
      panel = BlockTemplateFunction(
        (args, body) => tag("aside")(attr("data-title") := args,
          attr("data-context") := model.ctx.metadata.name, raw(body.html)).render,
        (args, body) => tag("aside")(attr("data-title") := args, raw(body.html)).render
      ),
      shape = BlockTemplateFunction(
        (_, body) => body.children.map(_.getClass.getSimpleName).mkString(","),
        (_, body) => body.children.map(_.getClass.getSimpleName).mkString(",")
      ),
      inline = TemplateFunction(_ => "inline value", _ => "inline value")
    ))

  private def render(source: String, theme: model.Theme = child): String =
    val ast = md.parseDryRun(source, theme)
    HtmlRenderer.builder(ast).build().render(ast)

  test("mixed dictionaries retain distinct interfaces and reject unsupported entries") {
    summon[child.Templates =:= (
      panel: BlockTemplateFunction, shape: BlockTemplateFunction, inline: TemplateFunction
    )]
    val block: BlockTemplateFunction = child.templates.panel
    val inline: TemplateFunction = child.templates.inline
    val combined = RevealTheme.templates ++ child.templates
    summon[combined.Fields =:= (RevealTheme.Templates ++ child.Templates)]
    assert(combined.panel eq block)
    assert(combined.inline eq inline)
    import scala.compiletime.testing.typeCheckErrors
    assert(typeCheckErrors("model.TemplateFunctions((invalid = 42))").nonEmpty)
    assert(typeCheckErrors("""
      val block = model.BlockTemplateFunction((_, body) => body.html, (_, body) => body.html)
      val inline: model.TemplateFunction = block
    """).nonEmpty)
    assert(typeCheckErrors("""
      val block = model.BlockTemplateFunction((_, body) => body.html, (_, body) => body.html)
      block.renderDefault("missing body")
    """).nonEmpty)
    assert(typeCheckErrors("""
      def misuse(inline: model.TemplateFunction, body: model.TemplateBody) =
        inline.renderDefault("unexpected body", body)
    """).nonEmpty)
  }

  test("wrong-kind calls fail in live dictionaries and local names still shadow mounts") {
    object host extends model.InferredTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val nested = mount(child)(_ => NamedTuple.Empty)
      val templateDefs = TemplateFunctions((
        panel = TemplateFunction(_ => "local inline", _ => "local inline"),
        inline = BlockTemplateFunction((_, body) => body.html, (_, body) => body.html)
      ))
    assertEquals(host.renderTemplateDefault("panel"), "local inline")
    val inlineError = intercept[IllegalArgumentException](render("{{inline}}", host))
    assert(inlineError.getMessage.contains("Block template used inline"))
    val blockError = intercept[IllegalArgumentException](render(":::panel\n\nBody\n\n:::", host))
    assert(blockError.getMessage.contains("Inline template used as a block"))
    val root = os.temp.dir(prefix = "template-kinds-")
    try
      given SiteRoot = SiteRoot(root)
      given model.Context = Context.fromSite(child)(Site.read[child.SiteMap](None, None, Map.empty))
      for (source, message) <- Seq(
        "{{panel}}" -> "Block template used inline",
        ":::inline\n\nBody\n\n:::" -> "Inline template used as a block",
        ":::unknown\n\nBody\n\n:::" -> "Block template not found"
      ) do
        val error = intercept[IllegalArgumentException](md.renderDoc(source))
        assert(error.getMessage.contains(message), error.getMessage)
    finally os.remove.all(root)
  }

  test("block templates receive parsed Markdown and resolve through generic mounts") {
    object host extends model.EmptyTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val nested = mount(child)(_ => NamedTuple.Empty)
    val source = ":::panel <root>\n\n### Heading\n\n- **Bold**\n  - `Child`\n\n:::"
    val html = render(source, host)
    assert(html.contains("data-title=\"&lt;root&gt;\""))
    assert(html.contains("<strong>Bold</strong>"))
    assert(html.contains("<code>Child</code>"))
    assertEquals(render(":::shape\n\n### Heading\n\n- Branch\n\n::: ").trim, "Heading,BulletList")
    val ast = md.parseDryRun("## Slide\n\n" + source, host)
    assertEquals(ast.getChildren.asScala.count(_.isInstanceOf[Heading]), 1)
  }

  test("block rendering receives the current context and retains dependency collection") {
    val root = os.temp.dir(prefix = "block-templates-")
    try
      given SiteRoot = SiteRoot(root)
      val site = Site.read[child.SiteMap](None, None, Map.empty)
      given model.Context = Context.fromSite(child)(site)
      val html = md.renderDoc(":::panel Live\n\n{{inline}}\n\n:::")
      assert(html.contains("data-context=\"Live context\""))
      assert(html.contains("inline value"))
      val dependency = root / "data.txt"
      object dependent extends model.InferredTemplates, model.EmptyExtras:
        val metadata = child.metadata
        type SiteMap = NamedTuple.Empty
        val templateDefs = TemplateFunctions((
          include = BlockTemplateFunction(
            (_, body) =>
              io.util.Templates.recordDependency(dependency)
              body.html,
            (_, body) => body.html
          )
        ))
      val context = Context.fromSite(dependent)(site)
      val (output, deps) = io.util.Templates.withDependencyCollection {
        md.renderDoc(":::include\n\nContent\n\n:::")(using context)
      }(using context)
      assert(output.contains("Content"))
      assert(deps.contains(dependency.toString))
    finally os.remove.all(root)
  }

  test("nested blocks render inside out while fenced and indented code stay literal") {
    val source = """:::panel Outer
      |
      |:::panel Inner
      |
      |**Nested**
      |
      |:::
      |
      |```markdown
      |:::not-a-template
      |:::
      |```
      |
      |    :::also-literal
      |
      |:::
      |""".stripMargin
    val html = render(source)
    assertEquals("<aside".r.findAllIn(html).size, 2)
    assert(html.indexOf("Outer") < html.indexOf("Inner"))
    assert(html.contains("<strong>Nested</strong>"))
    assert(html.contains(":::not-a-template"))
    assert(html.contains(":::also-literal"))
    assertEquals(render("```markdown\n:::unknown\n:::\n```").count(_ == ':'), 6)
    assert(render("> :::panel Quote\n>\n> Content\n>\n> :::").contains("<aside"))
  }

  test("block bodies keep document reference links and existing layout templates") {
    object extended extends model.InferredTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val templateDefs = RevealTheme.templates ++ child.templates
    val html = render("{{stack}}\n\n:::panel Links\n\n[Link][target]\n\n:::\n\n{{end-stack}}\n\n[target]: https://example.com", extended)
    assert(html.contains("class=\"stack \""))
    assert(html.contains("href=\"https://example.com\""), html)
  }

  test("malformed blocks and using inline templates as blocks report useful errors") {
    for (source, message) <- Seq(
      ":::panel Open\n\nContent" -> "Unclosed :::panel Open at line 1",
      ":::" -> "Unexpected closing ::: at line 1",
      ":::unknown\n\nContent\n\n:::" -> "Block template not found",
      ":::inline\n\nContent\n\n:::" -> "Inline template used as a block",
      "{{panel}}" -> "Block template used inline",
      ":::panel Outer\n\n:::panel Inner\n\nContent\n\n:::" -> "Unclosed :::panel Outer"
    ) do
      val error = intercept[IllegalArgumentException](render(source))
      assert(error.getMessage.contains(message), error.getMessage)
  }
