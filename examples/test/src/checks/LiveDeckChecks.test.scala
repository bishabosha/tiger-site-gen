package checks

import live.{BuildStatus, DraftRejected}
import revealLive.{RenderMode, RevealLiveResources}

/** The Reveal live layer against a real deck: builds in both modes, drafts, asset caching and the dev loop. */
class LiveDeckChecks extends munit.FunSuite:
  private val example = mysite.demoDeck()

  /** A copy of the example project; npm packages still come from the repository root. */
  private def project(): os.Path =
    // Deliberately unresolved: on macOS the temporary directory is behind a symlink.
    val root = os.temp.dir(prefix = "live-deck-")
    os.copy(example.root.root / "content", root / "content")
    os.copy(example.root.root / "public", root / "public")
    root

  override def afterEach(context: AfterEach): Unit = RenderMode.select(RenderMode.Live)

  test("live and display builds differ only in authoring controls") {
    val root = project()
    try
      val deck = mysite.demoDeck(root)
      RenderMode.select(RenderMode.Live)
      assert(deck.build().ok)
      val live = os.read(root / "dist" / "demo-deck" / "index.html")
      assert(live.contains("data-render-mode=\"live\""))
      assert(live.contains("/demo-deck/authoring/live.js"))
      assert(live.contains("/demo-deck/assets/demo.css"))
      assert(!live.contains("fullscreen.mjs"), "The preview frame provides its own Present control")
      for file <- RevealLiveResources.authoringFiles do
        assert(os.isFile(root / "dist" / "demo-deck" / "authoring" / file), file)
      assert(os.read(root / ".tiger-editor.json").contains("content/demo-deck"))
      assert(BuildStatus.read(root / "dist").exists(_.ok))
      RenderMode.select(RenderMode.Display)
      deck.build()
      val display = os.read(root / "dist-display" / "demo-deck" / "index.html")
      assert(display.contains("data-render-mode=\"display\""))
      assert(display.contains("/demo-deck/assets/demo.css"))
      assert(!display.contains("authoring") && !display.contains("presentation-tools"))
      assert(!os.exists(root / "dist-display" / "demo-deck" / "authoring"))
      assertEquals(ujson.read(os.read(root / "dist-display" / "demo-deck" / "deck.json"))("mainSlides").num, 2.0)
    finally os.remove.all(root)
  }

  test("failed builds keep the last deck and report through the build marker, also on a first build") {
    val root = project()
    val empty = os.temp.dir(prefix = "failed-first-")
    try
      val deck = mysite.demoDeck(root)
      deck.build()
      val built = os.read(root / "dist" / "demo-deck" / "index.html")
      os.write.over(root / "content" / "demo-deck" / "slides" / "020 - studio.md", "---scala\n(id = \"opening\")\n---\n## Duplicate")
      intercept[Exception](deck.build())
      val failed = BuildStatus.read(root / "dist").get
      assert(!failed.ok && failed.message.nonEmpty && failed.trace.nonEmpty)
      assertEquals(os.read(root / "dist" / "demo-deck" / "index.html"), built)
      intercept[Exception](mysite.demoDeck(empty).build())
      assert(!BuildStatus.read(empty / "dist").get.ok)
      assert(!os.exists(empty / "dist" / "demo-deck" / "index.html"))
    finally
      os.remove.all(root)
      os.remove.all(empty)
  }

  test("drafts use real templates without writing source or output; invalid drafts recover") {
    val root = project()
    try
      val deck = mysite.demoDeck(root)
      val file = root / "content" / "demo-deck" / "slides" / "010 - opening.md"
      val original = os.read(file)
      val text = original.replace("## Live preview", "## A live draft")
      val draft = deck.draftSlide(file, text)
      assertEquals(draft.id, "opening")
      assert(draft.html.startsWith("<section id=\"opening\"") && draft.html.endsWith("</section>"))
      assert(draft.html.contains("A live draft") && draft.html.contains("class=\"badge\""))
      val pages = deck.drafts.render(file, Map(file -> text))
      assertEquals(pages.map(_.route).toSet, Set("demo-deck/index.html", "demo-deck/speaker-notes.html"))
      assertEquals(pages.find(_.route == "demo-deck/index.html").get.url, "/demo-deck/")
      assertEquals(os.read(file), original)
      assert(!os.exists(root / "dist"))
      intercept[IllegalArgumentException](deck.draftSlide(file, "---scala\n(id ="))
      intercept[IllegalArgumentException](deck.draftSlide(file, original + "\n```scala\n"))
      intercept[DraftRejected](deck.draftSlide(root / "outside.md", original))
      assert(!deck.draftSlide(file, original).html.contains("A live draft"))
    finally os.remove.all(root)
  }

  test("content edits keep installed assets; asset edits and cleared output reinstall them") {
    val root = project()
    try
      val deck = mysite.demoDeck(root)
      deck.build()
      val output = root / "dist" / "demo-deck"
      val vendor = output / "vendor" / "pdfjs" / "pdf.worker.mjs"
      val installedAt = os.stat(vendor).mtime
      val manifest = ujson.read(os.read(output / "deck.json"))
      os.write.append(root / "content" / "demo-deck" / "slides" / "010 - opening.md", "\nMore notes.\n")
      deck.build()
      assertEquals(os.stat(vendor).mtime, installedAt, "Content edits must not reinstall vendor assets")
      assertEquals(ujson.read(os.read(output / "deck.json")), manifest, "Incremental and full manifests must agree")
      assert(os.read(output / "speaker-notes.html").contains("More notes."))
      os.write.append(root / "public" / "assets" / "demo.css", "\n/* Asset invalidation check */\n")
      deck.build()
      assert(os.read(output / "assets" / "demo.css").contains("Asset invalidation check"))
      os.remove.all(root / "dist")
      deck.build()
      assert(os.isFile(vendor), "Cleared output must reinstall the full bundle")
      assertEquals(ujson.read(os.read(output / "deck.json")), manifest)
    finally os.remove.all(root)
  }

  test("dev loop: a saved slide rebuilds and notifies browsers; drafts name the deck page") {
    val root = project()
    val deck = mysite.demoDeck(root)
    deck.rebuild()
    val server = deck.serve(0, RenderMode.Live)
    val watcher = deck.watch(status => server.published(status))
    val stream = new live.Http.EventStream(s"${server.origin}/__preview/events")
    try
      val first = ujson.read(stream.next()._2)("revision").str
      val page = live.Http.get(server.siteUrl).body
      assert(page.contains("/__preview/client.js") && page.contains(first))
      assert(!live.Http.get(s"${server.origin}/demo-deck/assets/demo.css").body.contains("__preview"))
      os.write.append(root / "content" / "demo-deck" / "slides" / "020 - studio.md", "\nWatcher latency check.\n")
      val second = ujson.read(stream.next(15000)._2)("revision").str
      assertNotEquals(second, first, "No completed rebuild within 15 seconds of saving a slide")
      assert(os.read(root / "dist" / "demo-deck" / "speaker-notes.html").contains("Watcher latency check."))
      val file = root / "content" / "demo-deck" / "slides" / "010 - opening.md"
      val token = ujson.read(os.read(root / ".live-preview.json"))("token").str
      val response = live.Http.post(s"${server.origin}/__preview/draft", ujson.write(ujson.Obj("file" -> file.toString,
        "session" -> "s", "sequence" -> 1, "text" -> os.read(file).replace("## Live preview", "## Typed"))),
        "Authorization" -> s"Bearer $token")
      assertEquals(response.status, 200)
      var (event, data) = stream.next()
      while event != "draft" do
        val next = stream.next()
        event = next._1
        data = next._2
      val deckPage = ujson.read(data)("pages").arr.find(_("route").str == "demo-deck/index.html").get
      assert(deckPage("html").str.contains("## Typed".drop(3)))
      val studio = live.Http.get(s"${server.origin}/__author/collection?directory=demo-deck/slides").json
      assertEquals(studio("noun").str, "slide")
      assertEquals(studio("files").arr.filter(_("ordered").bool).map(_("id").str).toSeq, Seq("opening", "studio", "appendix"))
    finally
      stream.close()
      watcher.close()
      server.close()
      os.remove.all(root)
  }
