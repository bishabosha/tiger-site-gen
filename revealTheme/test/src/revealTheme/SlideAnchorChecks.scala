package revealTheme

import com.vladsch.flexmark.html.HtmlRenderer
import io.util.md
import model.{BlockTemplateFunction, TemplateFunctions}
import model.Record.++
import model.SiteMapSchema.auto.given
import org.jsoup.Jsoup
import scala.jdk.CollectionConverters.*

class SlideAnchorChecks extends munit.FunSuite:
  private object theme extends model.InferredTemplates, model.EmptyExtras:
    val metadata: model.Theme.Metadata = new:
      val name = "Anchors"
    type SiteMap = NamedTuple.Empty
    val templateDefs = RevealTheme.defaultTemplates ++ TemplateFunctions((
      panel = BlockTemplateFunction((_, body) => body.html, (_, body) => body.html)
    ))

  private def render(markdown: String, slide: String, notes: Boolean = false): String =
    val ast = md.parseDryRun(markdown, theme, SlideAnchors.install(_, slide, notes))
    HtmlRenderer.builder(ast).build().render(ast)

  test("heading namespaces cannot collide with slide routes or headings on other slides") {
    val markdown = "## Toolkit\n\n### Questions\n\n[Heading](#questions) [Slide](#/questions)"
    val scope = render(markdown, "scope")
    val toolkit = render(markdown, "toolkit")
    val notes = render(markdown, "scope", notes = true)
    assertUnique(Seq(
      "030 - scope.md" -> s"<section id=scope>$scope<aside>$notes</aside></section>",
      "280 - toolkit.md" -> s"<section id=toolkit>$toolkit</section>"
    ))
    assert(scope.contains("id=\"heading:scope:toolkit\""), scope)
    assert(scope.contains("href=\"#heading:scope:questions\">Heading"), scope)
    assert(scope.contains("href=\"#/questions\">Slide"), scope)
    assert(notes.contains("id=\"notes-heading:scope:toolkit\""), notes)
  }

  test("nested templates, repeated headings and explicit heading IDs retain working permalinks") {
    val html = render("""## Title
      |
      |:::panel
      |
      |### Toolkit
      |
      |:::panel
      |
      |### Toolkit
      |
      |:::
      |
      |:::
      |
      |### Custom {#chosen}
      |
      |[Custom link](#chosen)
      |""".stripMargin, "scope")
    assertUnique(Seq("scope" -> html))
    val doc = Jsoup.parseBodyFragment(html)
    val ids = doc.select("[id]").asScala.map(_.id()).toVector
    assertEquals(ids.size, 4)
    assert(ids.forall(_.startsWith("heading:scope:")), html)
    for anchor <- doc.select("a.anchor-link[id]").asScala do
      assertEquals(anchor.attr("href"), "#" + anchor.id())
    assertEquals(doc.select("a").asScala.find(_.text() == "Custom link").get.attr("href"), "#heading:scope:chosen")
  }

  test("IDs are assigned before templates render and repeated rendering is stable") {
    val ast = md.parseDryRun("## Title\n\n:::panel\n\n### Toolkit\n\n[Forward link](#later)\n\n:::\n\n### Later",
      theme, SlideAnchors.install(_, "scope"))
    val renderer = HtmlRenderer.builder(ast).build()
    val first = renderer.render(ast)
    assert(first.contains("id=\"heading:scope:toolkit\""), first)
    assert(first.contains("href=\"#heading:scope:later\">Forward link"), first)
    assertEquals(renderer.render(ast), first)
    assertUnique(Seq("scope" -> first))
  }

  test("explicit IDs support both attribute forms and duplicate IDs fail before rendering") {
    val html = render("## Title\n\n### Named {id=chosen}\n\n[Named][target]\n\n[target]: #chosen", "scope")
    assertUnique(Seq("scope" -> html))
    assert(html.contains("id=\"heading:scope:chosen\""), html)
    assert(html.contains("href=\"#heading:scope:chosen\">Named"), html)
    val error = intercept[IllegalArgumentException] {
      render("## First {#duplicate}\n\n### Second {#duplicate}", "scope")
    }
    assert(error.getMessage.contains("Slide 'scope' has duplicate heading IDs: duplicate"), error.getMessage)
  }

  test("raw HTML passes through without parsing or serialization") {
    val raw = "<div data-spelling='&copy;' class = 'custom'><span>  Original  </span></div>"
    val html = render("## Title\n\n" + raw, "scope")
    assert(html.contains(raw), html)
  }

  // HTML inspection is test-only: the renderer never reparses its own output.
  private def assertUnique(fragments: Seq[(String, String)]): Unit =
    val ids = fragments.flatMap((_, html) => Jsoup.parseBodyFragment(html).select("[id]").asScala.map(_.id()))
    assertEquals(ids.distinct.size, ids.size)
