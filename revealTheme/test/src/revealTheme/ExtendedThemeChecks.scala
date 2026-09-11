package revealTheme

import model.{Context, Record, SiteRoot, TemplateFunction, TemplateFunctions}
import model.Record.++
import model.SiteMapSchema.auto.given

class ExtendedThemeChecks extends munit.FunSuite:
  private class ExtendedReveal(label: String) extends model.Theme:
    val metadata = RevealTheme.metadata
    type SiteMap = RevealTheme.SiteMap
    type Templates = RevealTheme.Templates ++ (marker: TemplateFunction)
    val templates = RevealTheme.templates ++ TemplateFunctions((
      marker = TemplateFunction(_ => label, _ => label)
    ))
    type Extra = RevealTheme.Extra
    def extras(using SiteContext): Record[Extra] = RevealTheme.extras
    override val siteMapMeta = RevealTheme.siteMapMeta.extend(defaultSiteMeta)

  private def fixture(body: os.Path => Unit): Unit =
    val root = os.temp.dir(prefix = "extended-reveal-")
    val deck = root / "content" / "deck"
    os.write(deck / "index.md", """```scala
      |(title = "Extended", author = "Test", event = "Test", description = "Test")
      |```
      |---
      |Deck.
      |""".stripMargin, createFolders = true)
    os.write(deck / "speaker-notes.md", """```scala
      |(title = "Notes")
      |```
      |---
      |Notes.
      |""".stripMargin)
    os.write(deck / "slides" / "010 - sample.md", """```scala
      |(id = "sample", seconds = 30, layout = "standard")
      |```
      |---
      |## Sample
      |
      |{{stack}}
      |
      |Value {{marker}}
      |
      |{{end-stack}}
      |
      |## Speaker notes
      |
      |Notes {{marker}}
      |""".stripMargin, createFolders = true)
    try body(root)
    finally os.remove.all(root)

  test("record-composed templates survive a generic mount and inherited extras") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val extension = new ExtendedReveal("extended")
      object host extends model.Theme:
        val metadata = extension.metadata
        type SiteMap = RevealTheme.SiteMap
        type Templates = NamedTuple.Empty
        val templates = TemplateFunctions.Empty
        val presentation = mount(extension)(site =>
          (deck = site.deck))
        type Extra = (presentation: presentation.Prepared)
        def extras(using SiteContext): Record[Extra] =
          Record((presentation = presentation.prepare()))
        override val siteMapMeta = presentation.extend(defaultSiteMeta)
      assertEquals(host.renderTemplateDefault("marker"), "extended")
      val context = Context.fromTheme(root / "content", host)
      val mounted = context.extra.presentation.context
      assert(mounted.theme eq extension)
      val slides = context.extra.presentation.render { model.ctx.extra.slides.read() }
      assert(slides.head.slide.render.contains("Value extended"))
      assert(slides.head.slide.render.contains("class=\"stack \""))
      assert(slides.head.notes.render.contains("Notes extended"))
      assert(mounted.site.deck eq context.site.deck)
      io.util.paths.renderSite(root / "dist", host, os.walk(root / "content").filter(os.isFile).toSet)(using context, summon[SiteRoot])
      assert(os.read(root / "dist" / "deck" / "index.html").contains("Value extended"))
      assert(os.read(root / "dist" / "deck" / "speaker-notes.html").contains("Notes extended"))
      assert(!os.exists(root / "dist" / "deck" / "slides"))
    }
  }

  test("a shared build session does not reuse slides from another template dictionary") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val session = new model.BuildSession
      val firstTheme = new ExtendedReveal("first")
      val secondTheme = new ExtendedReveal("second")
      val first = Context.fromTheme(root / "content", firstTheme, session)
      val before = {
        given firstTheme.Context = first
        first.extra.slides.read()
      }
      val second = Context.fromTheme(root / "content", secondTheme, session)
      val after = {
        given secondTheme.Context = second
        second.extra.slides.read()
      }
      assert(before.head.slide.render.contains("Value first"))
      assert(after.head.slide.render.contains("Value second"))
      assert(!after.head.slide.render.contains("Value first"))
      assert(before.head.notes.render.contains("Notes first"))
      assert(after.head.notes.render.contains("Notes second"))
    }
  }

  test("extensions retain built-in nesting validation and unknown-name errors") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val theme = new ExtendedReveal("extended")
      val file = root / "content" / "deck" / "slides" / "010 - sample.md"
      val original = os.read(file)
      os.write.over(file, original.replace("{{end-stack}}", "{{end-columns}}"))
      val nesting = intercept[IllegalArgumentException](Context.fromTheme(root / "content", theme))
      assert(nesting.getMessage.contains("mismatched"))
      os.write.over(file, original.replace("{{marker}}", "{{not-registered}}"))
      intercept[Exception](Context.fromTheme(root / "content", theme))
    }
  }
