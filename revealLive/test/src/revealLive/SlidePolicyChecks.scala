package revealLive

import live.{Authoring, AuthoringError, Http, LiveServer, LiveServerConfig, StudioSettings}
import live.Authoring.*

/** Content studio with Reveal's slide policy: IDs, appendices, timings and slide templates. */
class SlidePolicyChecks extends munit.FunSuite:
  private val dir = "talk/slides"
  private val first = "---scala\n(id = \"first\", seconds = 30)\n---\n## First"
  private val second = "---scala\n(id = \"second\", seconds = 40)\n---\n## Second"

  final case class Workspace(root: os.Path, slides: os.Path, api: Authoring)

  private val fixture = FunFixture[Workspace](
    setup = _ =>
      val root = os.Path(os.temp.dir(prefix = "slide-editor-").toNIO.toRealPath())
      val slides = root / "talk" / "slides"
      os.makeDir.all(slides)
      os.write(slides / "010 - same.md", first)
      os.write(slides / "020 - same.md", second)
      os.write(slides / "index.md", "# Index")
      Workspace(root, slides, Authoring(root, Seq(SlidePolicy(dir)))),
    teardown = fixture => os.remove.all(fixture.root)
  )

  private def rejects(pattern: String)(operation: => Any): AuthoringError =
    val error = intercept[AuthoringError](operation)
    assert(error.getMessage.contains(pattern), s"Expected '$pattern' in '${error.getMessage}'")
    error
  private def ordered(state: Collection) = state.ordered
  private def stagingLeft(slides: os.Path) = os.list(slides).exists(_.last.startsWith(".reorder-"))

  fixture.test("the policy applies to its directories only") { f =>
    assertEquals(f.api.collection(dir).noun, "slide")
    assertEquals(f.api.collection("talk").noun, "page")
    assert(SlidePolicy.anySlidesDirectory.applies("a/b/slides") && !SlidePolicy.anySlidesDirectory.applies("a/slides/b"))
  }

  fixture.test("keeps main slides before appendices") { f =>
    os.write(f.slides / "030 - appendix.md", "---scala\n(layout = \"appendix\")\n---\n## Appendix")
    val state = f.api.collection(dir)
    rejects("main slides")(f.api.reorder(ReorderRequest(dir, state.revision,
      Some(Seq("030 - appendix.md", "010 - same.md", "020 - same.md")))))
  }

  fixture.test("editor resolves stable slide IDs after reordering and rejects unknown sources") { f =>
    assertEquals(os.Path(f.api.pageSource(dir, Some("first"))), f.slides / "010 - same.md")
    val state = f.api.collection(dir)
    f.api.reorder(ReorderRequest(dir, state.revision, Some(Seq("020 - same.md", "010 - same.md"))))
    assertEquals(os.Path(f.api.pageSource(dir, Some("first"))), f.slides / "020 - same.md")
    assertEquals(rejects("not found")(f.api.pageSource(dir, Some("missing"))).status, 404)
    rejects("Invalid directory")(f.api.pageSource("../", Some("first")))
    rejects("Missing slide ID")(f.api.pageSource(dir, None))
  }

  fixture.test("collection reads titles, IDs, appendix groups and timings; the revision tracks bytes") { f =>
    os.write(f.slides / "030 - rich.md", "```scala\n(id = \"rich\", seconds = 12, layout = \"appendix\")\n```\n---\n\n## A *rich* `title`\n")
    val state = f.api.collection(dir)
    assertEquals((state.noun, state.groups), ("slide", Seq("main", "appendix")))
    assertEquals(state.files.map(_.name), Seq("index.md", "010 - same.md", "020 - same.md", "030 - rich.md"))
    val rich = state.files.last
    assertEquals((rich.id, rich.title, rich.badges, rich.group, rich.number),
      (Some("rich"), "A rich title", Seq("12s"), Some("appendix"), Some(30L)))
    assertEquals(state.files.head.title, "Index")
    assertEquals(state.files.head.number, None)
    os.write.append(f.slides / "030 - rich.md", " ")
    assertNotEquals(f.api.collection(dir).revision, state.revision)
  }

  fixture.test("insert uses the next integer and a slide template without changing existing names or bytes") { f =>
    val state = f.api.collection(dir)
    val result = f.api.insert(InsertRequest(dir, state.revision, Some("first")))
    assert(result.name.matches("^011 - slide-[\\w-]+\\.md$"), result.name)
    assert(result.id.startsWith("slide-"))
    assertEquals(os.read(f.slides / "010 - same.md"), first)
    assertEquals(os.read(f.slides / "020 - same.md"), second)
    val created = os.read(f.slides / result.name)
    assert(created.contains("## Speaker notes") && created.contains(s"id = \"${result.id}\""))
    assertEquals(ordered(result.state).map(_.number.get), Seq(10L, 11L, 20L))
    assertEquals(rejects("No free integer")(f.api.insert(InsertRequest(dir, result.state.revision, Some("first")))).status, 409)
    rejects("Files changed")(f.api.insert(InsertRequest(dir, state.revision, Some("second"))))
  }

  fixture.test("cut/paste moves only the source file and retains its ID and exact contents") { f =>
    val state = f.api.collection(dir)
    val result = f.api.insert(InsertRequest(dir, state.revision, Some("second"), Some("first")))
    assertEquals(result.name, "021 - same.md")
    assertEquals(result.id, "first")
    assertEquals(os.read(f.slides / result.name), first)
    assertEquals(os.read(f.slides / "020 - same.md"), second)
    assert(!os.exists(f.slides / "010 - same.md"))
    val unchanged = f.api.insert(InsertRequest(dir, result.state.revision, Some("second"), Some("first")))
    assertEquals(unchanged.state.revision, result.state.revision)
    rejects("different slide")(f.api.insert(InsertRequest(dir, result.state.revision, Some("first"), Some("first"))))
  }

  fixture.test("duplicate preserves source bytes except the frontmatter ID and inserts directly after the original") { f =>
    val source = "---scala\r\n( id = \"first\", seconds = 37, layout = \"standard\", fontSize = 36 )\r\n---\r\n\r\n## First\r\n\r\n{{stack}}\r\nAn example: id = \"first\"\r\n{{end-stack}}\r\n\r\n## Speaker notes\r\nKeep id = \"first\" here.\r\n"
    os.write.over(f.slides / "010 - same.md", source)
    var state = f.api.collection(dir)
    val originalRevision = state.revision
    for n <- 1 to 3 do
      val result = f.api.duplicate(PageRequest(dir, state.revision, Some("first")))
      assertEquals(result.id, s"first-$n")
      assertEquals(result.name, s"011 - same-$n.md")
      assertEquals(result.shifted, n - 1)
      assertEquals(os.read(f.slides / result.name), source.replaceFirst("id = \"first\"", s"id = \"first-$n\""))
      state = result.state
      assertEquals(ordered(state).map(_.id.get), Seq("first") ++ (n to 1 by -1).map(i => s"first-$i") :+ "second")
    assertEquals(os.read(f.slides / "010 - same.md"), source)
    assertEquals(os.read(f.slides / "020 - same.md"), second)
    rejects("Files changed")(f.api.duplicate(PageRequest(dir, originalRevision, Some("first"))))
    rejects("not found")(f.api.duplicate(PageRequest(dir, state.revision, Some("missing"))))
    rejects("Missing slide ID")(f.api.duplicate(PageRequest(dir, state.revision)))
    assert(!stagingLeft(f.slides))
  }

  fixture.test("duplicate chooses the first suffix free for both ID and filename stem, reusing holes") { f =>
    os.write(f.slides / "030 - same-1.md", "---scala\n(id = \"other\")\n---\n## Name collision")
    os.write(f.slides / "040 - unrelated.md", "---scala\n(id = \"first-2\")\n---\n## ID collision")
    os.write(f.slides / "050 - same-4.md", "---scala\n(id = \"first-4\")\n---\n## Later suffix")
    var state = f.api.collection(dir)
    val result = f.api.duplicate(PageRequest(dir, state.revision, Some("first")))
    assertEquals((result.id, result.name), ("first-3", "011 - same-3.md"))
    os.remove(f.slides / "030 - same-1.md")
    state = f.api.collection(dir)
    val reused = f.api.duplicate(PageRequest(dir, state.revision, Some("first")))
    assertEquals((reused.id, reused.name), ("first-1", "011 - same-1.md"))
    val nested = f.api.duplicate(PageRequest(dir, reused.state.revision, Some(reused.id)))
    assertEquals((nested.id, nested.name), ("first-1-1", "012 - same-1-1.md"))
  }

  fixture.test("duplicate preserves legacy metadata and appendix layout across a crowded boundary") { f =>
    val appendix = "```scala\n(id = \"appendix\", seconds = 0, layout = \"appendix\")\n```\n## Appendix\n"
    os.write(f.slides / "021 - appendix.md", appendix)
    val state = f.api.collection(dir)
    val main = f.api.duplicate(PageRequest(dir, state.revision, Some("second")))
    assertEquals(os.read(f.slides / "021 - same-1.md"), second.replaceFirst("\"second\"", "\"second-1\""))
    assertEquals(os.read(f.slides / "022 - appendix.md"), appendix)
    val copy = f.api.duplicate(PageRequest(dir, main.state.revision, Some("appendix")))
    assertEquals(os.read(f.slides / copy.name), appendix.replaceFirst("\"appendix\"", "\"appendix-1\""))
    assertEquals(ordered(copy.state).map(_.group.get), Seq("main", "main", "main", "appendix", "appendix"))
  }

  fixture.test("duplicate rejects occupied destinations before shifting any files") { f =>
    os.move(f.slides / "020 - same.md", f.slides / "011 - same.md")
    os.makeDir(f.slides / "012 - same.md")
    val state = f.api.collection(dir)
    assertEquals(rejects("destination filename already exists")(
      f.api.duplicate(PageRequest(dir, state.revision, Some("first")))).status, 409)
    assertEquals(f.api.collection(dir).revision, state.revision)
    assertEquals(os.read(f.slides / "010 - same.md"), first)
    assert(!stagingLeft(f.slides))
  }

  fixture.test("appendix insertion inherits layout and moves cannot cross the appendix boundary") { f =>
    os.write(f.slides / "030 - appendix.md", "---scala\n(id = \"appendix\", seconds = 0, layout = \"appendix\")\n---\n## Appendix")
    val state = f.api.collection(dir)
    rejects("own sections")(f.api.insert(InsertRequest(dir, state.revision, Some("first"), Some("appendix"))))
    val result = f.api.insert(InsertRequest(dir, state.revision, Some("appendix")))
    assert(os.read(f.slides / result.name).contains("seconds = 0, layout = \"appendix\""))
  }

  fixture.test("paste makes room through a consecutive run, stops at the first gap, and preserves bytes") { f =>
    val eleven = "---scala\n(id = \"eleven\", seconds = 60)\n---\n## Eleven\nExact contents\n"
    val twelve = "---scala\n(id = \"twelve\", seconds = 60)\n---\n## Twelve\n"
    os.write(f.slides / "011 - same.md", eleven)
    os.write(f.slides / "012 - same.md", twelve)
    val state = f.api.collection(dir)
    val result = f.api.insert(InsertRequest(dir, state.revision, Some("first"), Some("second")))
    assertEquals(result.name, "011 - same.md")
    assertEquals(result.shifted, 2)
    assertEquals(ordered(result.state).map(p => (p.number.get, p.id.get)),
      Seq(10L -> "first", 11L -> "second", 12L -> "eleven", 13L -> "twelve"))
    assertEquals(os.read(f.slides / "011 - same.md"), second)
    assertEquals(os.read(f.slides / "012 - same.md"), eleven)
    assertEquals(os.read(f.slides / "013 - same.md"), twelve)
    assert(!stagingLeft(f.slides))
    // Move forward into another occupied slot: free the old source number first.
    val forward = f.api.insert(InsertRequest(dir, result.state.revision, Some("eleven"), Some("second")))
    assertEquals(ordered(forward.state).map(p => (p.number.get, p.id.get)),
      Seq(10L -> "first", 12L -> "eleven", 13L -> "second", 14L -> "twelve"))
  }

  fixture.test("paste can use the moving slide's old number as the end of the occupied run") { f =>
    os.move(f.slides / "020 - same.md", f.slides / "012 - same.md")
    val middle = "---scala\n(id = \"middle\", seconds = 60)\n---\n## Middle"
    os.write(f.slides / "011 - same.md", middle)
    val untouched = "---scala\n(id = \"later\", seconds = 60)\n---\n## Later"
    os.write(f.slides / "020 - later.md", untouched)
    val state = f.api.collection(dir)
    val result = f.api.insert(InsertRequest(dir, state.revision, Some("first"), Some("second")))
    assertEquals(result.shifted, 1)
    assertEquals(os.read(f.slides / "011 - same.md"), second)
    assertEquals(os.read(f.slides / "012 - same.md"), middle)
    assertEquals(os.read(f.slides / "020 - later.md"), untouched)
  }

  fixture.test("delete keeps a recoverable copy, chooses a neighbor, and rejects stale or final-slide deletion") { f =>
    val state = f.api.collection(dir)
    rejects("Files changed")(f.api.delete(PageRequest(dir, "stale", Some("first"))))
    val result = f.api.delete(PageRequest(dir, state.revision, Some("first")))
    assertEquals(result.nextId, Some("second"))
    assertEquals(os.read(os.Path(result.backup)), first)
    assert(result.backup.endsWith("010 - same.md.bak"))
    assert(!os.exists(f.slides / "010 - same.md"))
    assertEquals(os.read(f.slides / "020 - same.md"), second)
    assertEquals(ordered(result.state).length, 1)
    assertEquals(f.api.tree(dir).children.length, 0, "Backups are hidden from the tree")
    rejects("at least one slide")(f.api.delete(PageRequest(dir, result.state.revision, Some("second"))))
  }

  fixture.test("recalculate restores spacing after moves and insertions without changing order or contents") { f =>
    var state = f.api.collection(dir)
    state = f.api.insert(InsertRequest(dir, state.revision, Some("first"))).state
    state = f.api.insert(InsertRequest(dir, state.revision, Some("second"), Some("first"))).state
    val before = ordered(state)
    rejects("Files changed")(f.api.recalculate(RevisionRequest(dir, "stale")))
    val result = f.api.recalculate(RevisionRequest(dir, state.revision))
    val after = ordered(result)
    assertEquals(after.map(_.number.get), Seq(10L, 20L, 30L))
    assertEquals(after.map(p => (p.id, p.source)), before.map(p => (p.id, p.source)))
    assertEquals(os.read(f.slides / "index.md"), "# Index")
  }

  fixture.test("Edit slide opens the source by slide ID over HTTP; the sidebar's actions use the policy") { f =>
    val opened = scala.collection.mutable.Buffer.empty[os.Path]
    val server = LiveServer.start(LiveServerConfig(f.root / "dist", f.root, f.root, port = 0, siteUrl = "/talk/",
      studio = StudioSettings(dir, Seq(SlidePolicy(dir))), openEditor = file => opened += file, log = _ => ()))
    try
      val origin = server.origin
      val body = ujson.Obj("directory" -> dir, "id" -> "second")
      assertEquals(Http.postJson(origin, "/__author/open", body).status, 200)
      assertEquals(opened.toSeq, Seq(f.slides / "020 - same.md"))
      assertEquals(Http.postJson(origin, "/__author/open", body, Some("https://example.com")).status, 403)
      val state = Http.get(s"$origin/__author/collection?directory=$dir").json
      assertEquals(state("noun").str, "slide")
      val duplicate = Http.postJson(origin, "/__author/duplicate", ujson.Obj("directory" -> dir,
        "revision" -> state("revision"), "id" -> "first"))
      assertEquals((duplicate.status, duplicate.json("id").str), (200, "first-1"))
      val deleted = Http.postJson(origin, "/__author/delete-slide", ujson.Obj("directory" -> dir,
        "revision" -> duplicate.json("state")("revision"), "id" -> "first-1"))
      assertEquals(deleted.status, 200)
      assertEquals(Http.get(s"$origin/__author/config").json, ujson.Obj("siteUrl" -> "/talk/", "directory" -> dir))
    finally server.close()
  }

  test("draft sections are extracted from a deck page, including nested sections") {
    val html = "<div class=\"slides\"><section id=\"a\" class=\"standard\"><p>A</p></section>" +
      "<section id=\"b\"><section id=\"b1\">x</section></section ></div>"
    assertEquals(RevealDrafts.section(html, "a"), Some("<section id=\"a\" class=\"standard\"><p>A</p></section>"))
    assertEquals(RevealDrafts.section(html, "b"), Some("<section id=\"b\"><section id=\"b1\">x</section></section >"))
    assertEquals(RevealDrafts.section(html, "missing"), None)
  }
