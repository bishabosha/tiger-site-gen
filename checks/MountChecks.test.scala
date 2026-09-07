//> using test.dep org.scalameta::munit:1.3.3
package revealTheme

import model.{Context, SiteRoot}
import io.util.{Templates, paths}
import mysite.MySite
import scala.compiletime.testing.typeCheckErrors

class MountChecks extends munit.FunSuite:
  private val project = SiteRoot.here.root / os.up

  private def fixture(body: os.Path => Unit): Unit =
    val root = os.temp.dir(prefix = "reveal-mount-")
    try
      os.copy(project / "examples" / "embedded" / "content", root / "content")
      for directory <- Seq("public", "revealTheme", "node_modules") do
        os.symlink(root / directory, project / directory)
      body(root)
    finally os.remove.all(root)

  test("selectors reject absent names and incompatible metadata") {
    assertEquals(typeCheckErrors("""
      import revealTheme.*
      RevealTheme.mount[mysite.MySite.SiteMap](site =>
        site.presentations.conference)
    """), Nil)
    assert(typeCheckErrors("""
      import revealTheme.*
      RevealTheme.mount[mysite.MySite.SiteMap](site =>
        site.presentations.missing)
    """).nonEmpty)
    assert(typeCheckErrors("""
      import revealTheme.*
      RevealTheme.mount[mysite.MySite.SiteMap](site =>
        site.articles)
    """).nonEmpty)
    assert(typeCheckErrors("""
      val other: mysite.MySite.workshop.Prepared = ???
      val wrong: mysite.MySite.conference.Prepared = other
    """).nonEmpty)
  }

  test("automatic layout installation finds the exact mount type in host extras") {
    assertEquals(typeCheckErrors("""
      import model.*
      type Host = Context.Of[mysite.MySite.SiteMap,
        (second: mysite.MySite.workshop.Prepared, label: String, renamed: mysite.MySite.conference.Prepared),
        mysite.MySite.Templates]
      mysite.MySite.conference.installLayouts[Host]
      mysite.MySite.workshop.installLayouts[Host]
    """), Nil)
    assert(typeCheckErrors("""
      import model.*
      type Host = Context.Of[mysite.MySite.SiteMap,
        (other: mysite.MySite.workshop.Prepared), mysite.MySite.Templates]
      mysite.MySite.conference.installLayouts[Host]
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      type Host = Context.Of[mysite.MySite.SiteMap,
        (first: mysite.MySite.conference.Prepared, duplicate: mysite.MySite.conference.Prepared),
        mysite.MySite.Templates]
      mysite.MySite.conference.installLayouts[Host]
    """).nonEmpty)
    fixture { root =>
      import model.SiteMapSchema.auto.given
      given SiteRoot = SiteRoot(root)
      val renamedHost = new model.Theme:
        val metadata = MySite.metadata
        type SiteMap = MySite.SiteMap
        type Templates = MySite.Templates
        val templates = MySite.templates
        type Extra = (
          second: MySite.workshop.Prepared,
          label: String,
          renamed: MySite.conference.Prepared
        )
        def extras(using SiteContext): model.Record[Extra] = model.Record((
          second = MySite.workshop.prepare(),
          label = "Host extras",
          renamed = MySite.conference.prepare()
        ))
        override val siteMapMeta = defaultSiteMeta.articles(_.index(_.indexed)).presentations(_
          .conference(MySite.conference.installLayouts[Context])
          .workshop(MySite.workshop.installLayouts[Context]))
      val one = Context.fromTheme(root / "content", renamedHost)
      val two = Context.fromTheme(root / "content", renamedHost)
      val lookup = summon[Context.ExtraValue[renamedHost.Context, MySite.conference.Prepared]]
      assert(lookup(one) eq one.extra.renamed)
      assert(lookup(two) eq two.extra.renamed)
      assert(!(lookup(one) eq lookup(two)))
      paths.renderSite(root / "dist", renamedHost, os.walk(root / "content").filter(os.isFile).toSet)(
        using one, summon[SiteRoot])
      val conference = os.read(root / "dist" / "presentations" / "conference" / "index.html")
      val workshop = os.read(root / "dist" / "presentations" / "workshop" / "index.html")
      assert(conference.contains("Conference opening") && !conference.contains("Workshop opening"))
      assert(workshop.contains("Workshop opening") && !workshop.contains("Conference opening"))
    }
  }

  test("mounts preserve source identity, isolate extras and reuse prepared content") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val host = Context.fromTheme(root / "content", MySite)
      val conference = host.extra.conference.context
      val workshop = host.extra.workshop.context
      assert(conference.site.deck eq host.site.presentations.conference)
      assert(conference.site.deck.slides eq host.site.presentations.conference.slides)
      assertEquals(conference.site.deck.outputPath.toString, "presentations/conference")
      assertEquals(conference.siteRoot, host.siteRoot)
      assertEquals(conference.site.optStatic, host.site.optStatic)
      assertEquals(host.templates.renderDefault("date"), "today")
      assertEquals(conference.templates.stack.renderDefault(""), "<div class=\"stack \">\n")
      val slides = conference.extra.slides.read()(using conference)
      assert(slides eq conference.extra.slides.read()(using conference))
      assert(!(slides eq workshop.extra.slides.read()(using workshop)))
      assertEquals(slides.head.title, "Conference opening")
      assertEquals(workshop.extra.slides.read()(using workshop).head.title, "Workshop opening")
      val (fragment, deps) = Templates.withDependencyCollection {
        host.extra.conference.embed().render
      }(using host)
      assert(fragment.contains("<reveal-deck"))
      assert(!fragment.contains("<html") && !fragment.contains("<body"))
      assert(fragment.contains("/presentations/conference/embed.mjs"))
      assert(fragment.contains("data-content-base=\"/presentations/conference/\""))
      assert(!fragment.contains("href=\"/presentations/conference/\""))
      assert(fragment.contains("Conference opening"))
      assert(!fragment.contains("Workshop opening"))
      assert(deps.contains((root / "content" / "presentations" / "conference" / "slides" / "010 - opening.md").toString))
      assert(deps.contains((root / "content" / "presentations" / "conference" / "index.md").toString))
      assert(!deps.exists(_.contains("/workshop/slides/")))
    }
  }

  test("embed URLs follow the physical collection through projection and renaming") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      import model.SiteMapSchema.auto.given
      os.move(root / "content" / "presentations" / "conference", root / "content" / "renamed-conference")
      val renamedHost = new model.Theme:
        val metadata: model.Theme.Metadata = new:
          val name = "Renamed"
        type SiteMap = (`renamed-conference`: RevealTheme.Deck)
        type Templates = RevealTheme.Templates
        val templates = RevealTheme.templates
        type Extra = NamedTuple.Empty
        def extras(using SiteContext): model.Record[Extra] = model.Record(NamedTuple.Empty)
      val host = Context.fromTheme(root / "content", renamedHost)
      val renamed = RevealTheme.mount[renamedHost.SiteMap](_.`renamed-conference`)
      val prepared = renamed.prepare()(using host)
      assertEquals(prepared.context.site.deck.url, "/renamed-conference/")
      val fragment = prepared.embed(linkToStandalone = true).render
      assert(fragment.contains("data-content-base=\"/renamed-conference/\""))
      assert(fragment.contains("src=\"/renamed-conference/embed.mjs\""))
      assert(fragment.contains("href=\"/renamed-conference/\""))
      assert(!fragment.contains("href=\"/presentations/conference/\""))
      assert(!fragment.contains("data-deck-url=\"/deck/\""))
      paths.renderSite(root / "dist", renamedHost, Set.empty)(using host, summon[SiteRoot])
      val output = root / "dist" / "renamed-conference"
      assertEquals(output, root / "dist" / "renamed-conference")
      assert(os.isFile(output / "embed.mjs"))
      assert(os.isFile(output / "vendor" / "reveal" / "dist" / "reveal.mjs"))
      assert(!os.exists(output / "index.html"))
      val page = DeckLayouts.index.run(prepared.context.site.deck.index)(using prepared.context).render
      assert(page.contains("/renamed-conference/deck.js"))
    }
  }

  test("host article, standalone pages and notes render through adapted layouts") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val session = new model.BuildSession
      paths.generateSite("content", "dist", MySite, ignoreCache = true, session = session)
      val article = os.read(root / "dist" / "articles" / "presentations.html")
      assertEquals("<reveal-deck".r.findAllIn(article).size, 2)
      assert(article.contains("Conference opening") && article.contains("Workshop opening"))
      assert(article.contains("Host article"))
      assert(os.read(root / "dist" / "index.html").contains("/articles/"))
      val index = os.read(root / "dist" / "presentations" / "conference" / "index.html")
      assert(index.contains("Conference opening") && !index.contains("Workshop opening"))
      assert(index.contains("/presentations/conference/deck.js"))
      assert(os.read(root / "dist" / "presentations" / "conference" / "speaker-notes.html").contains("Conference notes"))
      assert(!os.exists(root / "dist" / "presentations" / "conference" / "slides"))
      assert(!os.exists(root / "dist" / "presentations" / "workshop" / "slides"))
      val workshopBefore = os.stat(root / "dist" / "presentations" / "workshop" / "index.html").mtime
      val slide = root / "content" / "presentations" / "conference" / "slides" / "010 - opening.md"
      os.write.over(slide, os.read(slide).replace("Conference opening", "Updated conference"))
      paths.generateSite("content", "dist", MySite, ignoreCache = false, session = session)
      assert(os.read(root / "dist" / "articles" / "presentations.html").contains("Updated conference"))
      assert(os.read(root / "dist" / "presentations" / "conference" / "index.html").contains("Updated conference"))
      assertEquals(os.stat(root / "dist" / "presentations" / "workshop" / "index.html").mtime, workshopBefore)
      val added = slide / os.up / "030 - added.md"
      os.write(added, os.read(slide).replace("id = \"opening\"", "id = \"added\"")
        .replace("Updated conference", "An added slide"))
      paths.generateSite("content", "dist", MySite, ignoreCache = false, session = session)
      assert(os.read(root / "dist" / "articles" / "presentations.html").contains("An added slide"))
      os.remove(added)
      paths.generateSite("content", "dist", MySite, ignoreCache = false, session = session)
      assert(!os.read(root / "dist" / "articles" / "presentations.html").contains("An added slide"))
      assertEquals(os.stat(root / "dist" / "presentations" / "workshop" / "index.html").mtime, workshopBefore)
    }
  }

  test("DictionaryTheme selects nested singleton and collection layouts from front matter") {
    assertEquals(typeCheckErrors("""
      val layout: mysite.MySite.LayoutOf[mysite.ArticleMeta] = ???
      val selector: model.SiteMapMeta.SelLayout[mysite.MySite.Context, mysite.ArticleMeta] =
        mysite.MySite.dict((article = layout))
    """), Nil)
    assert(typeCheckErrors("""
      val layout: mysite.MySite.LayoutOf[revealTheme.DeckMeta] = ???
      val selector: model.SiteMapMeta.SelLayout[mysite.MySite.Context, mysite.ArticleMeta] =
        mysite.MySite.dict((article = layout))
    """).nonEmpty)
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      def build(): Unit = paths.generateSite("content", "dist", MySite, ignoreCache = false)
      build()
      val index = os.read(root / "dist" / "articles" / "index.html")
      assert(index.contains("href=\"/articles/presentations.html\""))
      assert(!index.contains("<reveal-deck"))
      val source = root / "content" / "articles" / "010 - presentations.md"
      val output = root / "dist" / "articles" / "presentations.html"
      assertEquals("<reveal-deck".r.findAllIn(os.read(output)).size, 2)
      val original = os.read(source)
      os.write.over(source, original.replace("layout = \"article\"", "layout = \"index\""))
      build()
      assert(!os.read(output).contains("<reveal-deck"))
      assert(os.read(output).contains("href=\"/articles/presentations.html\""))
      // DictionaryTheme's existing convention: an unknown key selects no layout.
      os.write.over(source, original.replace("layout = \"article\"", "layout = \"unpublished\""))
      build()
      assert(!os.exists(output))
      os.write.over(source, original)
      build()
      assertEquals("<reveal-deck".r.findAllIn(os.read(output)).size, 2)
    }
  }

  test("watch sessions reuse unchanged source documents and rendered slides") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val session = new model.BuildSession
      def prepare() = Context.fromTheme(root / "content", MySite, session)
      def slides(host: MySite.Context) =
        val mounted = host.extra.conference.context
        mounted.extra.slides.read()(using mounted)
      val first = prepare()
      val initial = slides(first)
      val unchanged = prepare()
      assert(first.site.presentations.conference.slides(0) eq unchanged.site.presentations.conference.slides(0))
      assert(initial.head eq slides(unchanged).head)
      assert(initial(1) eq slides(unchanged)(1))
      val source = root / "content" / "presentations" / "conference" / "slides" / "010 - opening.md"
      val original = os.read(source)
      os.write.over(source, original.replace("Conference opening", "Edited conference opening"))
      val edited = prepare()
      val editedSlides = slides(edited)
      assert(!(initial.head eq editedSlides.head))
      assert(initial(1) eq editedSlides(1))
      assert(first.site.presentations.conference.slides(0) eq edited.site.presentations.conference.slides(0))
      assert(first.site.presentations.workshop.slides(0) eq edited.site.presentations.workshop.slides(0))
      assert(initial.head.title == "Conference opening")
      assert(editedSlides.head.title == "Edited conference opening")

      os.write.over(source, original.replace("seconds = 30", "seconds = 45"))
      val retimed = slides(prepare())
      assertEquals(retimed(1).start, initial(1).start + 15)
      assert(retimed(1).notes.render.contains(Slides.stamp(retimed(1).start)))
      assertEquals(retimed(1).title, initial(1).title)

      val added = source / os.up / "005 - added.md"
      os.write(added, original.replace("id = \"opening\"", "id = \"added\""))
      val expanded = slides(prepare())
      assertEquals(expanded.map(_.id), Vector("added", "opening", "next"))
      assertEquals(expanded(1).start, 30)
      os.remove(added)
      assertEquals(slides(prepare()).map(_.id), Vector("opening", "next"))

      os.write.over(source, original.replace("## Speaker notes", "## Missing notes"))
      intercept[IllegalArgumentException] { prepare() }
      os.write.over(source, original)
      assertEquals(slides(prepare()).head.title, "Conference opening")
      val fresh = Context.fromTheme(root / "content", MySite, new model.BuildSession)
      assert(!(fresh.site.presentations.conference.slides(0) eq first.site.presentations.conference.slides(0)))
    }
  }

  test("standalone Reveal authoring contract") {
    verifyAuthoring()
  }

  test("automatic hooks recurse, deduplicate mounts, and remain local to each context") {
    import model.SiteMapSchema.auto.given
    val events = scala.collection.mutable.ArrayBuffer.empty[String]

    abstract class EmptyTheme(label: String) extends model.Theme:
      val metadata: model.Theme.Metadata = new:
        val name = label
      type SiteMap = NamedTuple.Empty
      type Templates = NamedTuple.Empty
      val templates = model.TemplateFunctions.Empty
      override def afterRender(outputRoot: os.Path)(using Context): Unit =
        events += s"$label:${model.ctx.siteRoot.root.last}"

    val leaf = new EmptyTheme("leaf"):
      type Extra = NamedTuple.Empty
      def extras(using SiteContext): model.Record[Extra] = model.Record(NamedTuple.Empty)

    class Branch(label: String, child: EmptyTheme) extends EmptyTheme(label):
      val mounted = new model.ThemeMount[SiteMap, EmptyTheme](child)(site => site)
      type Extra = (first: mounted.Prepared, second: mounted.Prepared)
      def extras(using SiteContext): model.Record[Extra] =
        model.Record((first = mounted.prepare(), second = mounted.prepare()))

    val inner = new Branch("inner", leaf)
    val outer = new Branch("outer", inner)
    def prepare(name: String): outer.Context =
      Context.fromSite(outer)(model.Site.read[outer.SiteMap](None, None, Map.empty))(
        using SiteRoot(project / name))
    val one = prepare("one")
    val two = prepare("two")
    def render(context: outer.Context): Unit =
      val output = os.temp.dir(prefix = "mount-hooks-")
      try paths.renderSite(output, outer, Set.empty)(using context, context.siteRoot)
      finally os.remove.all(output)
    render(one)
    render(one)
    render(two)
    assertEquals(events.toList, List(
      "leaf:one", "inner:one", "outer:one",
      "leaf:one", "inner:one", "outer:one",
      "leaf:two", "inner:two", "outer:two"
    ))
  }

  test("render hooks run after pages, repair output on unchanged passes, and propagate failures") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      var calls = 0
      var fail = false
      val theme = new mysite.ExampleSite(serveDeckPages = false):
        override def afterRender(outputRoot: os.Path)(using Context): Unit =
          assert(os.isFile(outputRoot / "articles" / "presentations.html"))
          assert(os.isFile(outputRoot / "presentations" / "conference" / "deck.json"))
          assert(os.isFile(outputRoot / "presentations" / "workshop" / "deck.json"))
          calls += 1
          if fail then throw IllegalStateException("output hook failed")

      paths.generateSite("content", "dist", theme, ignoreCache = true)
      assertEquals(calls, 1)
      val output = root / "dist"
      val manifest = output / "presentations" / "conference" / "deck.json"
      val script = output / "presentations" / "conference" / "embed.mjs"
      assert(os.isFile(manifest) && os.isFile(script))
      val data = ujson.read(os.read(manifest))
      assertEquals(data("title").str, "Conference")
      assertEquals(data("slides").arr.size, 2)
      assertEquals(data("slides")(0)("source").str, "content/presentations/conference/slides/010 - opening.md")
      assertEquals(ujson.read(os.read(output / "presentations" / "workshop" / "deck.json"))("title").str, "Workshop")
      assert(!os.exists(output / "presentations" / "conference" / "index.html"))

      os.remove(manifest)
      os.remove(script)
      paths.generateSite("content", "dist", theme, ignoreCache = false)
      assertEquals(calls, 2)
      assert(os.isFile(manifest) && os.isFile(script))

      val cache = os.read(output / ".cache")
      val slide = root / "content" / "presentations" / "conference" / "slides" / "010 - opening.md"
      os.write.over(slide, os.read(slide).replace("seconds = 30", "seconds = 45"))
      fail = true
      intercept[IllegalStateException] {
        paths.generateSite("content", "dist", theme, ignoreCache = false)
      }
      assertEquals(calls, 3)
      assertEquals(os.read(output / ".cache"), cache)
    }
  }

  test("build the reviewable embedded example") {
    mysite.buildEmbeddedExample()
    mysite.buildEmbeddedOnlyExample()
    for
      (directory, hasPages) <- Seq("embedded-example" -> true, "embedded-only-example" -> false)
      collection <- Seq("conference", "workshop")
    do
      val output = project / "dist" / directory / "presentations" / collection
      assert(os.isFile(output / "embed.mjs"))
      assert(os.isFile(output / "theme.css"))
      assertEquals(ujson.read(os.read(output / "deck.json"))("slides").arr.size, 2)
      assertEquals(os.isFile(output / "index.html"), hasPages)
      if hasPages then
        assert(os.read(output / "index.html").contains(s"/presentations/$collection/deck.js"))
        assert(os.read(output / "speaker-notes.html").contains(s"/presentations/$collection/notes.css"))
        assert(os.isFile(output / "vendor" / "reveal" / "dist" / "reveal.js"))
  }

  test("embedded-only hosts serve collection assets without standalone pages") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val theme = mysite.EmbeddedOnlySite
      paths.generateSite("content", "dist", theme, ignoreCache = true)
      val articlePath = root / "dist" / "articles" / "presentations.html"
      val article = os.read(articlePath)
      assertEquals("<reveal-deck".r.findAllIn(article).size, 2)
      assert(article.contains("Conference opening") && article.contains("Workshop opening"))
      assert(article.contains("data-content-base=\"/presentations/conference/\""))
      assert(!article.contains("href=\"/presentations/conference/\""))
      assert(!article.contains("href=\"/presentations/workshop/\""))
      assert(!article.contains("data-deck-url="))
      for collection <- Seq("conference", "workshop") do
        assert(!os.exists(root / "dist" / "presentations" / collection / "index.html"))
        assert(!os.exists(root / "dist" / "presentations" / collection / "speaker-notes.html"))
      val host = Context.fromTheme(root / "content", theme)
      val customAssets = host.extra.conference.embed(contentBaseUrl = "/media/conference/").render
      assert(customAssets.contains("data-content-base=\"/media/conference/\""))
      assert(!customAssets.contains("href=\"/presentations/conference/\""))
      val slide = root / "content" / "presentations" / "conference" / "slides" / "010 - opening.md"
      os.write.over(slide, os.read(slide).replace("Conference opening", "Embedded-only update"))
      paths.generateSite("content", "dist", theme, ignoreCache = false)
      assert(os.read(articlePath).contains("Embedded-only update"))
      assert(!os.exists(root / "dist" / "presentations" / "conference" / "index.html"))
    }
  }
