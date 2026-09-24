package live

/** LiveSite with a plain (non-Reveal) theme: builds, markers, drafts and the dev loop. */
class LiveSiteChecks extends munit.FunSuite:
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
      assert(page.contains("/__preview/client.js") && page.contains(first("revision").str))
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
