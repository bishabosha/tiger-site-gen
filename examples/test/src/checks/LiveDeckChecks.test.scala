package checks

import live.{BuildStatus, DraftRejected}
import model.DisplayMode

/** The Reveal live layer against a real deck: builds in both modes, drafts, asset caching and the dev loop. */
class LiveDeckChecks extends munit.FunSuite:
  private val example = mysite.demoDeck()
  private def assetBase(html: String): String =
    "data-deck-assets=\"([^\"]+)\"".r.findFirstMatchIn(html).get.group(1)
  private def assets(root: os.Path): os.Path =
    root / "dist" / os.RelPath(assetBase(os.read(root / "dist" / "demo-deck" / "index.html")).stripPrefix("/"))

  /** A copy of the example project; npm packages still come from the repository root. */
  private def project(): os.Path =
    // Deliberately unresolved: on macOS the temporary directory is behind a symlink.
    val root = os.temp.dir(prefix = "live-deck-")
    os.copy(example.root.root / "content", root / "content")
    os.copy(example.root.root / "public", root / "public")
    root


  test("one layout selects live controls and hashed static assets from the rendering context") {
    val root = project()
    try
      val deck = mysite.demoDeck(root)
      assert(deck.build().ok)
      val built = os.read(root / "dist" / "demo-deck" / "index.html")
      assert(built.contains("data-render-mode=\"live\"") && built.contains("/static/revealTheme/authoring/live_"))
      assert(built.contains(assetBase(built) + "assets/demo.css"))
      assert(!built.contains("fullscreen.mjs") && built.contains("pdf-explorer.mjs"))
      val editorAssets = "/static/revealTheme/authoring/[a-z]+_[a-f0-9]{32}\\.(?:js|css)".r
        .findAllIn(built).toSet
      assertEquals(editorAssets.size, 6)
      for url <- editorAssets do
        val asset = root / "dist" / os.RelPath(url.stripPrefix("/"))
        assert(os.isFile(asset))
        assert(url.contains(io.util.sanatise.md5Hashed(asset)), s"Asset URL must hash its actual bytes: $url")
      assert(!os.exists(root / "dist" / "demo-deck" / "authoring"))
      assert(os.read(root / ".tiger-editor.json").contains("content/demo-deck"))
      val preview = deck.serve(0, DisplayMode.Live)
      try
        val served = live.Http.get(preview.siteUrl).body
        assert(served.contains("data-render-mode=\"live\""))
        assert(served.contains("/static/revealTheme/authoring/live_"))
        assert(!served.contains("fullscreen.mjs"), "The editor frame provides Present")
        assert(served.contains("pdf-explorer.mjs"))
        for url <- editorAssets do
          assertEquals(live.Http.get(s"${preview.origin}$url").status, 200)
        assertEquals(live.Http.get(s"${preview.origin}/demo-deck/authoring/live.js").status, 404)
        assert(!live.Http.get(s"${preview.origin}/demo-deck/speaker-notes.html").body.contains("/static/revealTheme/authoring/live_"))
        assertEquals(os.read(root / "dist" / "demo-deck" / "index.html"), built)
      finally preview.close()
      deck.build(DisplayMode.Static)
      val display = os.read(root / "dist-display" / "demo-deck" / "index.html")
      assert(display.contains("data-render-mode=\"static\""))
      assert(display.contains("fullscreen.mjs") && display.contains("pdf-explorer.mjs"))
      assert(display.contains("assets/demo.css"))
      assert(!display.contains("/static/revealTheme/authoring/live_"))
      assert(!os.exists(root / "dist-display" / "static" / "revealTheme" / "authoring"))
      assertEquals(os.read(root / "dist-display" / "demo-deck" / "deck.json"), os.read(root / "dist" / "demo-deck" / "deck.json"))
      val static = deck.serve(0, DisplayMode.Static)
      try
        assertEquals(live.Http.get(static.siteUrl).body, display)
        for url <- editorAssets do assertEquals(live.Http.get(s"${static.origin}$url").status, 404)
      finally static.close()
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
      val pages = deck.drafts.render(file, Map(file -> text))
      assertEquals(pages.map(_.route).toSet, Set("demo-deck/index.html", "demo-deck/speaker-notes.html"))
      val draft = pages.find(_.route == "demo-deck/index.html").get
      assertEquals(draft.url, "/demo-deck/")
      assert(draft.html.contains("<section id=\"opening\"") && draft.html.contains("A live draft"))
      assert(draft.html.contains("class=\"badge\""))
      assert(pages.find(_.route == "demo-deck/speaker-notes.html").get.html.contains("A live draft"))
      assertEquals(os.read(file), original)
      assert(!os.exists(root / "dist"))
      intercept[Exception](deck.drafts.render(file, Map(file -> "---scala\n(id =")))
      intercept[IllegalArgumentException](deck.drafts.render(file, Map(file -> (original + "\n```scala\n"))))
      val outside = root / "outside.md"
      intercept[DraftRejected](deck.drafts.render(outside, Map(outside -> original)))
      val restored = deck.drafts.render(file, Map(file -> original))
      assert(restored.forall(page => !page.html.contains("A live draft")))
    finally os.remove.all(root)
  }

  test("content edits keep installed assets; asset edits and cleared output reinstall them") {
    val root = project()
    try
      val deck = mysite.demoDeck(root)
      deck.build()
      val output = root / "dist" / "demo-deck"
      val vendor = assets(root) / "vendor" / "pdfjs" / "pdf.worker.mjs"
      val installedAt = os.stat(vendor).mtime
      val manifest = ujson.read(os.read(output / "deck.json"))
      os.write.append(root / "content" / "demo-deck" / "slides" / "010 - opening.md", "\nMore notes.\n")
      deck.build()
      assertEquals(os.stat(vendor).mtime, installedAt, "Content edits must not reinstall vendor assets")
      assertEquals(ujson.read(os.read(output / "deck.json")), manifest, "Incremental and full manifests must agree")
      assert(os.read(output / "speaker-notes.html").contains("More notes."))
      os.write.append(root / "public" / "assets" / "demo.css", "\n/* Asset invalidation check */\n")
      deck.build()
      assert(os.read(assets(root) / "assets" / "demo.css").contains("Asset invalidation check"))
      os.remove.all(root / "dist")
      deck.build()
      assert(os.isFile(assets(root) / "vendor" / "pdfjs" / "pdf.worker.mjs"), "Cleared output must reinstall the full bundle")
      assertEquals(ujson.read(os.read(output / "deck.json")), manifest)
    finally os.remove.all(root)
  }

  test("dev loop: a saved slide rebuilds and notifies browsers; drafts name the deck page") {
    val root = project()
    val deck = mysite.demoDeck(root)
    deck.rebuild()
    val server = deck.serve(0, DisplayMode.Live)
    val watcher = deck.watch(status => server.published(status))
    val stream = new live.Http.EventStream(s"${server.origin}/__preview/events")
    try
      val first = ujson.read(stream.next()._2)("revision").str
      val page = live.Http.get(server.siteUrl).body
      assert(page.contains("/static/live/client_") && page.contains(first))
      assert(!live.Http.get(s"${server.origin}${assetBase(page)}assets/demo.css").body.contains("__preview"))
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
      assert(deckPage("html").str.contains("/static/revealTheme/authoring/live_"), "Drafts must render with the same live context as saved pages")
      assert(!deckPage("html").str.contains("fullscreen.mjs"))
      val studio = live.Http.get(s"${server.origin}/__author/collection?directory=demo-deck/slides").json
      assertEquals(studio("noun").str, "slide")
      assertEquals(studio("files").arr.filter(_("ordered").bool).map(_("id").str).toSeq, Seq("opening", "studio", "appendix"))
    finally
      stream.close()
      watcher.close()
      server.close()
      os.remove.all(root)
  }
