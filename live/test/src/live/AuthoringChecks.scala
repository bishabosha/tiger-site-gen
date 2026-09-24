package live

import live.Authoring.*

/** Content studio on a plain numbered collection (no policy: filenames identify pages). */
class AuthoringChecks extends munit.FunSuite:
  private val dir = "blog/posts"
  private val first = "---scala\n(title = \"First\", published = \"01-Jan-2026\")\n---\n# First\n\nHello."
  private val second = "---scala\n(title = \"Second\", published = \"02-Jan-2026\")\n---\n# Second"

  final case class Workspace(root: os.Path, posts: os.Path, api: Authoring)

  private val fixture = FunFixture[Workspace](
    setup = _ =>
      val root = os.Path(os.temp.dir(prefix = "content-studio-").toNIO.toRealPath())
      val posts = root / "blog" / "posts"
      os.makeDir.all(posts)
      os.write(posts / "010 - same.md", first)
      os.write(posts / "020 - same.md", second)
      os.write(posts / "index.md", "# Index")
      Workspace(root, posts, Authoring(root)),
    teardown = fixture => os.remove.all(fixture.root)
  )

  private def rejects(pattern: String)(operation: => Any): AuthoringError =
    val error = intercept[AuthoringError](operation)
    assert(error.getMessage.contains(pattern), s"Expected '$pattern' in '${error.getMessage}'")
    error
  private def stagingLeft(posts: os.Path) = os.list(posts).exists(_.last.startsWith(".reorder-"))

  fixture.test("reorders colliding names without changing contents or fixed documents") { f =>
    val initial = f.api.collection(dir)
    assertEquals((initial.noun, initial.plural, initial.groups), ("page", "pages", Nil))
    val saved = f.api.reorder(ReorderRequest(dir, initial.revision, Some(Seq("020 - same.md", "010 - same.md"))))
    assertEquals(os.read(f.posts / "010 - same.md"), second)
    assertEquals(os.read(f.posts / "020 - same.md"), first)
    assertEquals(os.read(f.posts / "index.md"), "# Index")
    assertNotEquals(saved.revision, initial.revision)
    assertEquals(os.list(f.posts).size, 3)
    assertEquals(f.api.tree().children.head.children.head.pages, 3)
  }

  fixture.test("rejects stale saves, incomplete orders, traversal and symlinks") { f =>
    val initial = f.api.collection(dir)
    val request = ReorderRequest(dir, initial.revision, Some(Seq("020 - same.md", "010 - same.md")))
    rejects("exactly once")(f.api.reorder(request.copy(order = Some(Seq("010 - same.md", "010 - same.md")))))
    rejects("exactly once")(f.api.reorder(request.copy(order = Some(Seq("010 - same.md")))))
    rejects("exactly once")(f.api.reorder(request.copy(order = None)))
    os.write.over(f.posts / "010 - same.md", "Changed in editor")
    assertEquals(rejects("changed on disk")(f.api.reorder(request)).status, 409)
    rejects("Invalid directory")(f.api.collection("../"))
    rejects("Invalid directory")(f.api.collection("/etc"))
    os.symlink(f.root / "linked", f.posts)
    assertEquals(rejects("Symlinks")(f.api.collection("linked")).status, 403)
    assertEquals(rejects("Symlinks")(f.api.source("linked/010 - same.md")).status, 403)
    rejects("Invalid directory")(f.api.source("../outside.md"))
    rejects("Markdown")(f.api.source("blog/posts"))
    assertEquals(os.read(f.posts / "010 - same.md"), "Changed in editor")
  }

  fixture.test("collection reads titles and filename identities; the revision tracks bytes") { f =>
    val state = f.api.collection(dir)
    assertEquals(state.files.map(_.name), Seq("index.md", "010 - same.md", "020 - same.md"))
    assertEquals(state.files.map(_.id), state.files.map(file => Some(file.name)))
    assertEquals(state.files.map(_.title), Seq("Index", "First", "Second"))
    assertEquals(state.files.map(_.group), Seq(None, None, None))
    assertEquals(state.files.head.number, None)
    os.write.append(f.posts / "020 - same.md", " ")
    assertNotEquals(f.api.collection(dir).revision, state.revision)
    assertEquals(os.Path(f.api.pageSource(dir, Some("020 - same.md"))), f.posts / "020 - same.md")
    assertEquals(rejects("not found")(f.api.pageSource(dir, Some("missing.md"))).status, 404)
  }

  fixture.test("insert copies the neighbor's front matter into the next free number") { f =>
    val state = f.api.collection(dir)
    val result = f.api.insert(InsertRequest(dir, state.revision, Some("010 - same.md")))
    assertEquals(result.name, "011 - new-page.md")
    assertEquals(result.id, result.name)
    assertEquals(os.read(f.posts / result.name),
      "---scala\n(title = \"First\", published = \"01-Jan-2026\")\n---\n\n# New page\n\nAdd your content here.\n")
    assertEquals(os.read(f.posts / "010 - same.md"), first)
    assertEquals(result.state.ordered.map(_.number.get), Seq(10L, 11L, 20L))
    assertEquals(rejects("No free integer")(f.api.insert(InsertRequest(dir, result.state.revision, Some("010 - same.md")))).status, 409)
    val next = f.api.insert(InsertRequest(dir, result.state.revision, Some("020 - same.md")))
    assertEquals(next.name, "021 - new-page-2.md")
    rejects("Files changed")(f.api.insert(InsertRequest(dir, state.revision, Some("020 - same.md"))))
  }

  fixture.test("cut/paste moves only the source file; duplicate copies bytes exactly under a free stem") { f =>
    val state = f.api.collection(dir)
    val moved = f.api.insert(InsertRequest(dir, state.revision, Some("020 - same.md"), Some("010 - same.md")))
    assertEquals(moved.name, "021 - same.md")
    assertEquals(os.read(f.posts / moved.name), first)
    assert(!os.exists(f.posts / "010 - same.md"))
    rejects("different page")(f.api.insert(InsertRequest(dir, moved.state.revision, Some("021 - same.md"), Some("021 - same.md"))))
    val copy = f.api.duplicate(PageRequest(dir, moved.state.revision, Some("020 - same.md")))
    assertEquals((copy.id, copy.name, copy.shifted), ("021 - same-1.md", "021 - same-1.md", 1))
    assertEquals(os.read(f.posts / copy.name), second)
    assertEquals(os.read(f.posts / "022 - same.md"), first)
    assert(!stagingLeft(f.posts))
  }

  fixture.test("delete keeps a recoverable copy; plain collections may become empty") { f =>
    var state = f.api.collection(dir)
    rejects("Files changed")(f.api.delete(PageRequest(dir, "stale", Some("010 - same.md"))))
    val result = f.api.delete(PageRequest(dir, state.revision, Some("010 - same.md")))
    assertEquals(result.nextId, Some("020 - same.md"))
    assertEquals(os.read(os.Path(result.backup)), first)
    assertEquals(f.api.tree(dir).children.length, 0, "Backups are hidden from the tree")
    val last = f.api.delete(PageRequest(dir, result.state.revision, Some("020 - same.md")))
    assertEquals(last.state.ordered, Nil)
  }

  fixture.test("policies group pages and name the collection") { f =>
    object Chapters extends CollectionPolicy:
      def applies(directory: String) = directory == dir
      override def noun = "chapter"
      override def groups = Seq("body", "extra")
      override def group(source: String) = Some(if source.contains("Second") then "extra" else "body")
      override def badges(source: String) = Seq(s"${source.length} bytes")
    val api = Authoring(f.root, Seq(Chapters))
    val state = api.collection(dir)
    assertEquals((state.noun, state.plural, state.groups), ("chapter", "chapters", Seq("body", "extra")))
    assertEquals(state.ordered.map(_.group), Seq(Some("body"), Some("extra")))
    assertEquals(state.ordered.head.badges, Seq(s"${first.length} bytes"))
    rejects("grouped as body, then extra")(api.reorder(ReorderRequest(dir, state.revision, Some(Seq("020 - same.md", "010 - same.md")))))
    assertEquals(api.collection("blog").noun, "page", "Other directories keep the default policy")
  }

  fixture.test("recalculate restores spacing without changing order or contents") { f =>
    var state = f.api.collection(dir)
    state = f.api.insert(InsertRequest(dir, state.revision, Some("010 - same.md"))).state
    val before = state.ordered
    val result = f.api.recalculate(RevisionRequest(dir, state.revision))
    assertEquals(result.ordered.map(_.number.get), Seq(10L, 20L, 30L))
    assertEquals(result.ordered.map(_.source), before.map(_.source))
    assertEquals(os.read(f.posts / "index.md"), "# Index")
  }

  // -- HTTP ------------------------------------------------------------------------------

  private def serve(f: Workspace, opened: scala.collection.mutable.Buffer[os.Path] = scala.collection.mutable.Buffer.empty): LiveServer =
    os.write.over(f.root / "dist" / ".outputs.json", ujson.write(ujson.Obj(
      "blog/posts/010 - same.md" -> "posts/same.html", "blog/posts/index.md" -> "posts/index.html",
      "@root" -> "index.html")), createFolders = true)
    LiveServer.start(LiveServerConfig(f.root / "dist", f.root, f.root, port = 0, siteUrl = "/posts/",
      studio = StudioSettings(dir), openEditor = file => opened += file, log = _ => ()))

  fixture.test("open endpoint resolves sources by file, collection ID or page route, and rejects cross-origin requests") { f =>
    val opened = scala.collection.mutable.Buffer.empty[os.Path]
    val server = serve(f, opened)
    try
      val origin = server.origin
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("directory" -> dir, "id" -> "020 - same.md")).status, 200)
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("file" -> s"$dir/index.md")).status, 200)
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("route" -> "/posts/same.html?x#y")).status, 200)
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("route" -> "/posts/")).status, 200)
      assertEquals(Http.postJson(origin, "/__author/open-slide", ujson.Obj("directory" -> dir, "id" -> "010 - same.md")).status, 200)
      assertEquals(opened.toSeq, Seq(f.posts / "020 - same.md", f.posts / "index.md", f.posts / "010 - same.md",
        f.posts / "index.md", f.posts / "010 - same.md"))
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("route" -> "/")).status, 404, "The root redirect has no source")
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("file" -> "../secret.md")).status, 400)
      assertEquals(Http.postJson(origin, "/__author/open", ujson.Obj("file" -> s"$dir/index.md"), Some("https://example.com")).status, 403)
      assertEquals(opened.length, 5)
      val state = Http.get(s"$origin/__author/collection?directory=$dir").json
      val inserted = Http.postJson(origin, "/__author/insert",
        ujson.Obj("directory" -> dir, "revision" -> state("revision"), "afterId" -> "010 - same.md"))
      assertEquals(inserted.status, 200)
      assertEquals(inserted.json("name").str, "011 - new-page.md")
      val studio = Http.get(s"$origin/__author/")
      assertEquals(studio.status, 200)
      assert(studio.body.contains("Content studio"))
      assertEquals(Http.get(s"$origin/__author/config").json, ujson.Obj("siteUrl" -> "/posts/", "directory" -> dir))
    finally server.close()
  }

  fixture.test("HTTP authoring endpoints require the local host and same-origin JSON, and persist a valid reorder") { f =>
    val server = serve(f)
    try
      val origin = server.origin
      val initial = Http.get(s"$origin/__author/collection?directory=$dir")
      assertEquals(initial.header("cache-control"), Some("no-store"))
      assertEquals(initial.header("x-content-type-options"), Some("nosniff"))
      val body = ujson.Obj("directory" -> dir, "revision" -> initial.json("revision"),
        "order" -> ujson.Arr("020 - same.md", "010 - same.md"))
      assertEquals(Http.postJson(origin, "/__author/reorder", body, Some("https://other.example")).status, 403)
      assertEquals(Http.post(s"$origin/__author/reorder", ujson.write(body), "Content-Type" -> "text/plain", "Origin" -> origin).status, 403)
      assertEquals(Http.raw(server.port, s"GET /__author/tree HTTP/1.1\r\nHost: attacker.example:${server.port}\r\nConnection: close\r\n\r\n"), 403)
      assertEquals(Http.raw(server.port, s"GET /__author/tree HTTP/1.1\r\nHost: localhost:${server.port}\r\nConnection: close\r\n\r\n"), 200)
      val response = Http.postJson(origin, "/__author/reorder", body)
      assertEquals(response.status, 200)
      assertEquals(response.json("files").arr.find(_("ordered").bool).get("title").str, "Second")
      val missing = Http.get(s"$origin/__author/nothing")
      assertEquals((missing.status, missing.json("error").str), (404, "Not found"))
      assertEquals(Http.postJson(origin, "/__author/nothing", ujson.Obj()).status, 404)
      assertEquals(Http.postJson(origin, "/__author/nothing", ujson.Obj(), Some("https://other.example")).status, 403)
      val stale = Http.postJson(origin, "/__author/reorder", body)
      assertEquals((stale.status, stale.json("error").str), (409, "Files changed on disk. Reload before saving."))
      assertEquals(Http.postJson(origin, "/__author/reorder", ujson.Str("x" * (1024 * 1024 + 1))).status, 413)
      assertEquals(Http.post(s"$origin/__author/tree", "{}", "Content-Type" -> "application/json", "Origin" -> origin).status, 404)
      val state = Http.get(s"$origin/__author/collection?directory=$dir").json
      val deleted = Http.postJson(origin, "/__author/delete",
        ujson.Obj("directory" -> dir, "revision" -> state("revision"), "id" -> "010 - same.md"))
      assertEquals(deleted.status, 200)
      assertEquals(os.list(f.posts).count(_.ext == "md"), 2)
    finally server.close()
  }
