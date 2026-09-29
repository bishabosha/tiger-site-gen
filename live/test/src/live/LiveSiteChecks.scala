package live

/** LiveSite with a plain (non-Reveal) theme: builds, markers, drafts and the dev loop. */
class LiveSiteChecks extends munit.FunSuite:
  test("injected components and settings control builds, drafts, serving and per-call output modes") {
    val root = os.temp.dir(prefix = "composed-live-")
    given model.SiteRoot = model.SiteRoot(root)
    val file = root / "sources" / "note.md"
    os.write(file, "Saved source", createFolders = true)
    val calls = scala.collection.mutable.ArrayBuffer.empty[(os.Path, model.DisplayMode)]
    val dependencies = Map("sources/note.md" -> Set(file.toString))
    val builder = new SiteBuilder:
      def build(output: os.Path, mode: model.DisplayMode): Map[String, Set[String]] =
        calls += output -> mode
        os.write.over(output / "custom" / "index.html", s"<html><body>$mode</body></html>", createFolders = true)
        os.write.over(output / ".outputs.json", "{\"sources/note.md\":\"custom/index.html\"}")
        dependencies
    var learned = Map.empty[String, Set[String]]
    val drafts = new DraftRenderer:
      override def learn(built: Map[String, Set[String]]): Unit = learned = built
      def render(file: os.Path, drafts: Map[os.Path, String]): Seq[DraftPage] =
        Seq(DraftPage("custom/index.html", "/custom/", s"<html><body>Injected: ${drafts(file)}</body></html>"))
    val settings = LiveSiteSettings(contentDirectory = "sources", output = OutputDirectories("preview", "published"),
      watched = Nil, siteUrl = "/custom/", noReload = Seq("custom/index.html"))
    val site = new LiveSite(builder, drafts, settings)
    try
      site.main(Seq("build", "--display"))
      assertEquals(calls.toSeq, Seq(root / "published" -> model.DisplayMode.Static))
      assert(BuildStatus.read(root / "published").exists(_.ok))
      assertEquals(site.displayMode, model.DisplayMode.Live, "CLI options must not mutate the host")
      site.build()
      assertEquals(calls.last, root / "preview" -> model.DisplayMode.Live)
      assertEquals(learned, dependencies)
      val static = site.serve(0, model.DisplayMode.Static)
      try assertEquals(Http.get(static.siteUrl).body, "<html><body>Static</body></html>")
      finally static.close()
      val server = site.serve(0, model.DisplayMode.Live)
      val stream = new Http.EventStream(s"${server.origin}/__preview/events")
      try
        stream.next()
        assertEquals(server.siteUrl, s"${server.origin}/custom/")
        assertEquals(Http.get(server.siteUrl).body, "<html><body>Live</body></html>", "Injected noReload settings apply")
        val token = ujson.read(os.read(root / ".live-preview.json"))("token").str
        val reply = Http.post(s"${server.origin}/__preview/draft", ujson.write(ujson.Obj("file" -> file.toString,
          "session" -> "custom", "sequence" -> 1, "text" -> "Unsaved")), "Authorization" -> s"Bearer $token")
        assertEquals(reply.status, 200)
        val (event, data) = stream.next()
        assertEquals(event, "draft")
        assert(ujson.read(data)("pages").arr.exists(_("html").str.contains("Injected: Unsaved")))
      finally
        stream.close()
        server.close()
    finally os.remove.all(root)
  }

  test("CLI mode, transport and port selection is generic and invocation-local") {
    val env = Map("TIGER_RENDER_MODE" -> "display", "PORT" -> "9137")
    assertEquals(LiveSiteOptions.parse(Seq("build"), model.DisplayMode.Live, env),
      LiveSiteOptions("build", model.DisplayMode.Static, false, 9137))
    assertEquals(LiveSiteOptions.parse(Seq("serve", "--live", "--static", "--port", "9011"), model.DisplayMode.Static, env),
      LiveSiteOptions("serve", model.DisplayMode.Live, false, 9011))
    assertEquals(LiveSiteOptions.parse(Nil, model.DisplayMode.Live, Map.empty),
      LiveSiteOptions("dev", model.DisplayMode.Live, true, 8123))
    for args <- Seq(Seq("dev", "--display"), Seq("serve", "--port"), Seq("build", "--unknown")) do
      intercept[IllegalArgumentException](LiveSiteOptions.parse(args, model.DisplayMode.Live, Map.empty))
  }

  test("builds write pages, the editor manifest and a success marker; failures keep output and report") {
    val root = Journal.project()
    try
      val site = Journal.site(root)
      val status = site.build()
      assert(status.ok)
      assertEquals(BuildStatus.read(root / "dist"), Some(status))
      assert(os.read(root / "dist" / "notes" / "first.html").contains("The first body."))
      assert(os.read(root / "dist" / "index.html").contains("Second note"))
      assertEquals(os.read(root / "dist" / "style.css"), "body { color: black; }")
      assertEquals(ujson.read(os.read(root / ".tiger-editor.json"))("sources"), ujson.Arr("content"))
      os.write.over(root / "content" / "notes" / "020 - second.md", "---scala\n(title = \n---\nBroken")
      intercept[Exception](site.build())
      val failed = BuildStatus.read(root / "dist").get
      assert(!failed.ok && failed.message.exists(_.contains("front matter")), failed.toString)
      assert(os.read(root / "dist" / "index.html").contains("Second note"), "The last good output stays")
      os.write.over(root / "content" / "notes" / "020 - second.md", Journal.entry("Second again"))
      assert(site.rebuild().ok)
      assert(os.read(root / "dist" / "index.html").contains("Second again"))
    finally os.remove.all(root)
  }

  test("drafts render the document's page and pages that depend on it, without writing") {
    val root = Journal.project()
    try
      val site = Journal.site(root)
      val file = root / "content" / "notes" / "010 - first.md"
      val original = os.read(file)
      val draft = Journal.entry("Draft title", "A draft body.")
      // Before any build, dependencies come from warming.
      site.drafts.warm()
      val pages = site.drafts.render(file, Map(file -> draft))
      assertEquals(pages.map(_.route).toSet, Set("notes/first.html", "index.html"))
      assert(pages.find(_.route == "notes/first.html").get.html.contains("A draft body."))
      assertEquals(pages.find(_.route == "index.html").get.url, "/")
      assert(pages.find(_.route == "index.html").get.html.contains("Draft title"))
      assertEquals(os.read(file), original)
      assert(!os.exists(root / "dist"))
      // Several drafts render together.
      val other = root / "content" / "notes" / "020 - second.md"
      val both = site.drafts.render(other, Map(file -> draft, other -> Journal.entry("Other draft")))
      val index = both.find(_.route == "index.html").get.html
      assert(index.contains("Draft title") && index.contains("Other draft"))
      intercept[Exception](site.drafts.render(file, Map(file -> "---scala\n(title =")))
      intercept[DraftRejected](site.drafts.render(root / "outside.md", Map(root / "outside.md" -> draft)))
      os.write(root / "content" / "README.md", "Not part of the site")
      intercept[DraftRejected](site.drafts.render(root / "content" / "README.md", Map(root / "content" / "README.md" -> "x")))
      assert(site.drafts.render(file, Map(file -> original)).find(_.route == "notes/first.html").get.html.contains("The first body."))
    finally os.remove.all(root)
  }

  test("dev loop: saves rebuild and notify, drafts reach browsers, studio and error overlay work") {
    val root = Journal.project()
    val site = Journal.site(root)
    site.rebuild()
    val server = site.serve(0)
    val watcher = site.watch(status => server.published(status))
    val stream = new Http.EventStream(s"${server.origin}/__preview/events")
    /** The next build status matching `accept`, skipping draft events and repeated builds. */
    def status(accept: ujson.Value => Boolean): ujson.Value =
      var found: Option[ujson.Value] = None
      while found.isEmpty do
        val (event, data) = stream.next(15000)
        if event == "message" && accept(ujson.read(data)) then found = Some(ujson.read(data))
      found.get
    try
      val first = ujson.read(stream.next()._2)
      assert(first("ok").bool)
      val page = Http.get(s"${server.origin}/notes/first.html").body
      assert(page.contains("/static/live/client_") && page.contains(first("revision").str))
      assert(!Http.get(s"${server.origin}/style.css").body.contains("__preview"))

      val file = root / "content" / "notes" / "010 - first.md"
      os.write.over(file, Journal.entry("First note", "Saved from the editor."))
      status(_("revision") != first("revision"))
      assert(Http.get(s"${server.origin}/notes/first.html").body.contains("Saved from the editor."))

      val token = ujson.read(os.read(root / ".live-preview.json"))("token").str
      val response = Http.post(s"${server.origin}/__preview/draft", ujson.write(ujson.Obj("file" -> file.toString,
        "session" -> "s", "sequence" -> 1, "text" -> Journal.entry("First note", "Typing a draft."))),
        "Authorization" -> s"Bearer $token")
      assertEquals(response.status, 200)
      var (event, data) = stream.next()
      while event != "draft" do
        val next = stream.next()
        event = next._1
        data = next._2
      val routes = ujson.read(data)("pages").arr.map(_("route").str).toSet
      assertEquals(routes, Set("notes/first.html", "index.html"))
      assert(ujson.read(data)("pages").arr.exists(_("html").str.contains("Typing a draft.")))
      assertEquals(Http.post(s"${server.origin}/__preview/draft", ujson.write(ujson.Obj("file" -> (root / "public" / "style.css").toString,
        "session" -> "s", "sequence" -> 1, "text" -> "x")), "Authorization" -> s"Bearer $token").status, 404)

      val collection = Http.get(s"${server.origin}/__author/collection?directory=notes").json
      assertEquals(collection("files").arr.map(_("name").str).toSeq, Seq("010 - first.md", "020 - second.md"))

      os.write.over(root / "content" / "notes" / "020 - second.md", "---scala\n(title = \n---\nBroken")
      val failure = status(!_("ok").bool)
      assert(failure("message").str.contains("front matter"))
      assert(Http.get(s"${server.origin}/notes/second.html").body.contains("Second note"), "The last good page stays")
      os.write.over(root / "content" / "notes" / "020 - second.md", Journal.entry("Second note", "Fixed."))
      status(_("ok").bool)
      assert(Http.get(s"${server.origin}/notes/second.html").body.contains("Fixed."))
    finally
      stream.close()
      watcher.close()
      server.close()
      os.remove.all(root)
  }
