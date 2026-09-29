package revealTheme

import model.{Context, SiteRoot, TemplateFunction, TemplateFunctions}
import model.Record.++
import model.SiteMapSchema.auto.given

class ExtendedThemeChecks extends munit.FunSuite:
  private def extendedReveal(label: String, fonts: DeckFonts = DeckFonts(),
      layouts: Map[String, SlideLayout] = Map.empty) =
    val npm = SiteRoot.here.root / os.up / os.up / os.up / os.up / "node_modules"
    RevealTheme.withTemplates(
      RevealTheme.defaultTemplates ++ TemplateFunctions((
        marker = TemplateFunction(_ => label, _ => label)
      )),
      assetSources = root => RevealAssets.fromNpm(root).copy(
        revealJs = npm / "reveal.js", pdfJs = npm / "pdfjs-dist"),
      fonts = fonts,
      slideLayouts = layouts
    )

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
    summon[RevealTheme.Templates =:= (
      stack: TemplateFunction, `end-stack`: TemplateFunction,
      columns: TemplateFunction, `end-columns`: TemplateFunction, br: TemplateFunction, spacer: TemplateFunction
    )]
    summon[RevealTheme.Extra =:= (slides: Slides.Deck, fonts: DeckFonts, assets: DeckAssets)]
    assert(RevealTheme.defaultTemplates.renderDefault("spacer").contains("aria-hidden=\"true\""))
    intercept[IllegalArgumentException](RevealTheme.defaultTemplates.renderDefault("spacer unexpected"))
    val configured = RevealTheme()
    summon[configured.Templates =:= RevealTheme.Templates]
    summon[configured.Extra =:= RevealTheme.Extra]
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val fonts = DeckFonts(body = "Georgia, serif", headings = "Arial, sans-serif", code = "Courier New, monospace")
      val extension = extendedReveal("extended", fonts)
      summon[extension.Templates =:= (RevealTheme.Templates ++ (marker: TemplateFunction))]
      assert(extension.templates eq extension.templateDefs)
      assertEquals(extension.templates.marker.renderDefault(""), "extended")
      object host extends model.InferredExtras, model.EmptyTemplates:
        val metadata = extension.metadata
        type SiteMap = RevealTheme.SiteMap
        val presentation = mount(extension)(site =>
          (deck = site.deck))
        val extraDefs = defineExtras {
          (presentation = presentation.prepare())
        }
        override val siteMapMeta = presentation.extend(defaultSiteMeta)
      assertEquals(host.renderTemplateDefault("marker"), "extended")
      val context = Context.fromTheme(root / "content", host)
      val mounted = context.extra.presentation.context
      assert(mounted.theme eq extension)
      val slides = context.extra.presentation.render { model.ctx.extra.slides.read() }
      assert(slides.head.slide.render.contains("Value extended"))
      assert(slides.head.slide.render.contains("class=\"stack \""))
      assert(slides.head.notes.render.contains("Notes extended"))
      val embedded = context.extra.presentation.render { DeckLayouts.embedded().render }
      assert(embedded.contains("<reveal-deck"))
      assert(embedded.contains("Value extended"))
      assert(embedded.contains(fonts.cssVariables))
      assert(embedded.indexOf("/fonts.css") < embedded.indexOf("<reveal-deck"))
      assertEquals(mounted.extra.fonts, fonts)
      assert(mounted.site.deck eq context.site.deck)
      io.util.paths.renderSite(root / "dist", host, os.walk(root / "content").filter(os.isFile).toSet)(using context, summon[SiteRoot])
      assert(os.read(root / "dist" / "deck" / "index.html").contains("Value extended"))
      assert(os.read(root / "dist" / "deck" / "speaker-notes.html").contains("Notes extended"))
      for page <- Seq("index.html", "speaker-notes.html") do
        val html = os.read(root / "dist" / "deck" / page)
        assert(html.contains(fonts.cssVariables))
        assert(html.contains("/fonts.css"))
      assert(!os.exists(root / "dist" / "deck" / "slides"))
    }
  }

  test("a shared build session does not reuse slides from another template dictionary") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val session = new model.BuildSession
      val firstTheme = extendedReveal("first")
      val secondTheme = extendedReveal("second")
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
      val theme = extendedReveal("extended")
      val file = root / "content" / "deck" / "slides" / "010 - sample.md"
      val original = os.read(file)
      os.write.over(file, original.replace("{{end-stack}}", "{{end-columns}}"))
      val nesting = intercept[IllegalArgumentException](Context.fromTheme(root / "content", theme))
      assert(nesting.getMessage.contains("mismatched"))
      os.write.over(file, original.replace("{{marker}}", "{{not-registered}}"))
      intercept[Exception](Context.fromTheme(root / "content", theme))
    }
  }

  test("font sizes are optional, fixed when supplied, and validated on edits") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val theme = extendedReveal("font test")
      val session = new model.BuildSession
      val file = root / "content" / "deck" / "slides" / "010 - sample.md"
      val original = os.read(file)
      def rendered(): String =
        val context = Context.fromTheme(root / "content", theme, session)
        given theme.Context = context
        context.extra.slides.read().head.slide.render
      assert(!rendered().contains("data-font-size"))
      for size <- Seq(40, 32) do
        os.write.over(file, original.replace("layout = \"standard\"", s"layout = \"standard\", fontSize = $size"))
        val html = rendered()
        assert(html.contains(s"data-font-size=\"$size\""), html)
        assert(html.contains(s"--slide-font-size:${size}px"), html)
      for size <- Seq(0, -1) do
        os.write.over(file, original.replace("layout = \"standard\"", s"layout = \"standard\", fontSize = $size"))
        val error = intercept[IllegalArgumentException](rendered())
        assert(error.getMessage.contains("fontSize must be a positive pixel size"))
      os.write.over(file, original)
      assert(!rendered().contains("data-font-size"))
    }
  }

  test("custom slide layouts style sections and preserve dark backgrounds and timing") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val theme = extendedReveal("layout test", layouts = Map(
        "chapter" -> SlideLayout("dark-slide chapter-slide", Some("#19242a")),
        "sunburst" -> SlideLayout("sunburst-slide")
      ))
      val file = root / "content" / "deck" / "slides" / "010 - sample.md"
      val original = os.read(file)
      val session = new model.BuildSession
      def render(layout: String): Slides.Rendered =
        os.write.over(file, original.replace("layout = \"standard\"", s"layout = \"$layout\""))
        val context = Context.fromTheme(root / "content", theme, session)
        given theme.Context = context
        context.extra.slides.read().head
      val chapter = render("chapter")
      assert(chapter.slide.render.contains("class=\"dark-slide chapter-slide\""))
      assert(chapter.slide.render.contains("data-background-color=\"#19242a\""))
      assertEquals(chapter.seconds, 30)
      assert(!chapter.appendix)
      assertEquals(chapter.title, "Sample")
      val sunburst = render("sunburst").slide.render
      assert(sunburst.contains("class=\"sunburst-slide\""))
      assert(!sunburst.contains("data-background-color"))
      assert(render("standard").slide.render.contains("class=\"standard\""))
      assert(render("dark-slide").slide.render.contains("data-background-color=\"#19242a\""))
      val error = intercept[IllegalArgumentException](render("missing"))
      assert(error.getMessage.contains("unknown layout missing"))
    }
  }

  test("display mode belongs to each context and propagates through mounts without leaking through caches") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val extension = extendedReveal("mode")
      object host extends model.InferredExtras, model.EmptyTemplates:
        val metadata = extension.metadata
        type SiteMap = RevealTheme.SiteMap
        val presentation = mount(extension)(site => (deck = site.deck))
        val extraDefs = defineExtras { (presentation = presentation.prepare()) }
        override val siteMapMeta = presentation.extend(defaultSiteMeta)
      val session = new model.BuildSession
      val static = Context.fromTheme(root / "content", host, session)
      val live = Context.fromTheme(root / "content", host, session, model.DisplayMode.Live)
      assertEquals(static.displayMode, model.DisplayMode.Static)
      assertEquals(live.extra.presentation.context.displayMode, model.DisplayMode.Live)
      assertEquals(static.extra.presentation.context.displayMode, model.DisplayMode.Static)
      val liveHtml = live.extra.presentation.render { DeckLayouts.index.run(model.ctx.site.deck.index).render }
      val staticHtml = static.extra.presentation.render { DeckLayouts.index.run(model.ctx.site.deck.index).render }
      assert(liveHtml.contains("/static/revealTheme/authoring/live_") && !liveHtml.contains("fullscreen.mjs"))
      assert(!staticHtml.contains("/static/revealTheme/authoring/live_") && staticHtml.contains("fullscreen.mjs"))
      assert(live.staticAssets eq live.extra.presentation.context.staticAssets)
      assertEquals(live.staticAssets.resources.size, 6)
      assert(static.staticAssets.resources.isEmpty)
      // Resources work without a content/static directory and are emitted by the host's static pipeline.
      assert(live.site.optStatic.isEmpty)
      io.util.paths.renderSite(root / "dist", host, os.walk(root / "content").filter(os.isFile).toSet)(using live, summon[SiteRoot])
      val urls = "/static/revealTheme/authoring/[a-z]+_[a-f0-9]{32}\\.(?:js|css)".r.findAllIn(liveHtml).toSet
      assertEquals(urls.size, 6)
      for url <- urls do assert(os.isFile(root / "dist" / os.RelPath(url.stripPrefix("/"))))
      val again = Context.fromTheme(root / "content", host, session)
      assertEquals(again.extra.presentation.context.displayMode, model.DisplayMode.Static)
    }
  }

  test("public content hashes drive both resolved URLs and copying, including incremental edits") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val theme = extendedReveal("assets")
      val session = new model.BuildSession
      val file = root / "content" / "deck" / "slides" / "010 - sample.md"
      os.write.over(file, os.read(file).replace("Value {{marker}}", """Value {{marker}}
        |
        |![Image](assets/picture.svg)
        |
        |[Viewer](assets/viewer/index.html?mode=full#page-2)
        |
        |[External](https://example.com/assets/picture.svg)
        |
        |`assets/picture.svg`
        |""".stripMargin).replace("Notes {{marker}}", "Notes [image](assets/picture.svg)"))
      val public = root / "public"
      val picture = public / "assets" / "picture.svg"
      os.write(picture, "<svg>red</svg>", createFolders = true)
      os.write(public / "assets" / "viewer" / "index.html", "<script type=module src=./view.mjs></script>", createFolders = true)
      os.write(public / "assets" / "viewer" / "view.mjs", "import './helper.mjs';")
      os.write(public / "assets" / "viewer" / "helper.mjs", "export const version = 1;")
      os.write(public / "assets" / "style.css", "body { background: url(picture.svg) }")
      def build(): String =
        io.util.paths.generateSite("content", "dist", theme, ignoreCache = false, session = session)
        os.read(root / "dist" / "deck" / "index.html")
      def base(html: String): String =
        "data-deck-assets=\"([^\"]+)\"".r.findFirstMatchIn(html).get.group(1)
      def output(url: String): os.Path = root / "dist" / os.RelPath(url.stripPrefix("/"))
      val first = build()
      val firstBase = base(first)
      assert(firstBase.matches("/static/reveal_[a-f0-9]{32}/"))
      assert(first.contains(s"src=\"${firstBase}assets/picture.svg\""))
      assert(first.contains(s"href=\"${firstBase}assets/viewer/index.html?mode=full#page-2\""))
      assert(first.contains("https://example.com/assets/picture.svg"))
      assert(first.contains("<code>assets/picture.svg</code>"))
      assert(os.read(root / "dist" / "deck" / "speaker-notes.html").contains(firstBase + "assets/picture.svg"))
      for source <- os.walk(public).filter(os.isFile) do
        assertEquals(os.read.bytes(output(firstBase) / source.relativeTo(public)).toSeq, os.read.bytes(source).toSeq)
      assert(!os.exists(root / "dist" / "deck" / "assets"))
      val unchangedTime = os.stat(root / "dist" / "deck" / "index.html").mtime
      assertEquals(build(), first)
      assertEquals(os.stat(root / "dist" / "deck" / "index.html").mtime, unchangedTime)
      val time = java.nio.file.Files.getLastModifiedTime(picture.toNIO)
      os.write.over(picture, "<svg>tan</svg>") // Same byte count, with the original modification time restored.
      java.nio.file.Files.setLastModifiedTime(picture.toNIO, time)
      val second = build()
      val secondBase = base(second)
      assertNotEquals(secondBase, firstBase)
      assert(second.contains(secondBase + "assets/picture.svg"))
      assertEquals(os.read(output(secondBase + "assets/picture.svg")), "<svg>tan</svg>")
      assertEquals(os.read(output(firstBase + "assets/picture.svg")), "<svg>red</svg>")
      val added = public / "assets" / "new" / "nested" / "file.txt"
      os.write(added, "added", createFolders = true)
      val thirdBase = base(build())
      assertNotEquals(thirdBase, secondBase)
      assertEquals(os.read(output(thirdBase + "assets/new/nested/file.txt")), "added")
      os.remove(added)
      assertEquals(base(build()), secondBase)
      os.remove(output(secondBase + "assets/picture.svg"))
      build()
      assertEquals(os.read(output(secondBase + "assets/picture.svg")), "<svg>tan</svg>")
    }
  }
