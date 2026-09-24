package live

import java.util.concurrent.{CountDownLatch, TimeUnit}
import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.*

class DraftPreviewChecks extends munit.FunSuite:
  private def notes(project: os.Path): os.Path =
    val dir = project / "content" / "notes"
    os.makeDir.all(dir)
    dir

  /** A renderer that blocks on "slow", rejects "invalid" and refuses files outside `notes/`. */
  final class FakeRenderer(project: os.Path) extends DraftRenderer:
    val started = new CountDownLatch(1)
    val release = new CountDownLatch(1)
    @volatile var seen = Map.empty[os.Path, String]
    def render(file: os.Path, drafts: Map[os.Path, String]): Seq[DraftPage] =
      if !file.startsWith(notes(project)) then throw DraftRejected("Not a document of this site")
      seen = drafts
      val text = drafts(file)
      if text == "slow" then
        started.countDown()
        release.await(10, TimeUnit.SECONDS)
      if text == "invalid" then throw IllegalArgumentException("Incomplete source")
      Seq(DraftPage("notes/title.html", "/notes/title.html", s"<main>$text</main>"),
        DraftPage("index.html", "/", s"<ul>${drafts.values.toSeq.sorted.mkString}</ul>"))

  test("draft bridge rejects unauthorized files, drops stale renders, preserves last valid pages and clears saved drafts") {
    val project = os.Path(os.temp.dir(prefix = "draft-bridge-").toNIO.toRealPath())
    val file = notes(project) / "010 - title.md"
    val other = notes(project) / "020 - other.md"
    os.write(file, "saved")
    os.write(other, "other saved")
    val renderer = FakeRenderer(project)
    val events = scala.collection.mutable.Buffer.empty[(String, ujson.Value)]
    val bridge = DraftPreview(project, Some(renderer), (event, data) => events.synchronized(events += event -> data))
    def post(sequence: Int, fields: (String, ujson.Value)*): (Int, ujson.Value) = postFor(file, sequence, fields*)
    def postFor(target: os.Path, sequence: Int, fields: (String, ujson.Value)*): (Int, ujson.Value) =
      bridge.handle(ujson.write(ujson.Obj.from(Seq("file" -> ujson.Str(target.toString), "session" -> ujson.Str("test"),
        "sequence" -> ujson.Num(sequence)) ++ fields)).getBytes("UTF-8"))
    try
      bridge.announce(1234)
      val discovery = ujson.read(os.read(project / ".live-preview.json"))
      assertEquals(discovery("token").str, bridge.token)
      assertEquals(os.perms(project / ".live-preview.json").toString, "rw-------")
      assert(!bridge.authorized("POST", Some("Bearer wrong")))
      assert(!bridge.authorized("GET", Some(s"Bearer ${bridge.token}")))
      assert(bridge.authorized("POST", Some(s"Bearer ${bridge.token}")))

      val slow = Future(post(1, "text" -> "slow"))
      assert(renderer.started.await(5, TimeUnit.SECONDS))
      assertEquals(post(2, "text" -> "newest")._1, 200)
      renderer.release.countDown()
      assertEquals(Await.result(slow, 5.seconds)._2("stale").bool, true)
      assertEquals(events.count(_._1 == "draft"), 1)
      val pages = events.head._2("pages").arr
      assertEquals(pages.map(_("route").str).toSeq, Seq("notes/title.html", "index.html"))
      assertEquals(pages.head("html").str, "<main>newest</main>")
      assertEquals(post(2, "text" -> "repeat")._2("stale").bool, true, "Older or equal sequences are stale")
      val invalid = post(3, "text" -> "invalid")
      assertEquals(invalid._1, 422)
      assertEquals(events.last._1, "draft-error")
      assertEquals(events.last._2("error").str, "Incomplete source")
      assert(ujson.write(bridge.replay()).contains("newest"), "The last valid draft is kept")
      // Every render reads all current drafts; clearing one re-renders the others.
      assertEquals(postFor(other, 1, "text" -> "second draft")._1, 200)
      assertEquals(renderer.seen, Map(file -> "newest", other -> "second draft"))
      assertEquals(events.last._2("pages").arr.last("html").str, "<ul>newestsecond draft</ul>")
      assertEquals(postFor(other, 2, "clear" -> true)._2("cleared").bool, true)
      assertEquals(events.last._2("pages").arr.last("html").str, "<ul>newest</ul>", "Remaining drafts re-render")
      assertEquals(os.read(file), "saved")
      post(4, "text" -> "saved")
      bridge.saved()
      assert(events.exists(event => event._2.obj.get("saved").exists(_.bool)))
      assertEquals(bridge.replay(), Nil)
      val outside = postFor(project / ".live-preview.json", 5, "text" -> "outside")
      assertEquals(outside, (404, ujson.Obj("error" -> "Not a document of this site")))
      assertEquals(postFor(project / "missing.md", 5, "text" -> "x")._1, 404)
      assertEquals(post(6, "sequence" -> ujson.Num(1.5))._1, 400, "Sequences must be integers")
      post(6, "text" -> "again")
      assertEquals(post(7, "clear" -> true)._2("cleared").bool, true)
      assertEquals(events.last._2("clear").bool, true)
      assertEquals(bridge.replay(), Nil)
      assertEquals(DraftPreview(project, None, (_, _) => ()).handle(ujson.write(ujson.Obj("file" -> file.toString,
        "session" -> "s", "sequence" -> 1, "text" -> "x")).getBytes("UTF-8"))._1, 503)
    finally
      bridge.close()
      assert(!os.exists(project / ".live-preview.json"))
      os.remove.all(project)
  }

  test("the preview server relays drafts to connected browsers and replays them to new ones") {
    val project = os.Path(os.temp.dir(prefix = "draft-server-").toNIO.toRealPath())
    val file = notes(project) / "010 - title.md"
    os.write(file, "saved")
    BuildStatus.write(project / "dist", BuildStatus.succeeded())
    val renderer = FakeRenderer(project)
    val server = LiveServer.start(LiveServerConfig(project / "dist", project / "content", project, port = 0,
      drafts = Some(renderer), log = _ => ()))
    val stream = new Http.EventStream(s"${server.origin}/__preview/events")
    try
      val revision = stream.next()._2
      val token = ujson.read(os.read(project / ".live-preview.json"))("token").str
      def draft(sequence: Int, text: String, auth: String = token) =
        Http.post(s"${server.origin}/__preview/draft", ujson.write(ujson.Obj("file" -> file.toString,
          "session" -> "s", "sequence" -> sequence, "text" -> text)), "Authorization" -> s"Bearer $auth")
      assertEquals(draft(1, "draft", "wrong").status, 403)
      assertEquals(Http.get(s"${server.origin}/__preview/draft").status, 403)
      assertEquals(draft(1, "draft").json("rendered"), ujson.True)
      val (event, data) = stream.next()
      assertEquals(event, "draft")
      assertEquals(ujson.read(data)("file").str, file.toString)
      assertEquals(ujson.read(data)("pages")(0), ujson.Obj("route" -> "notes/title.html", "url" -> "/notes/title.html",
        "html" -> "<main>draft</main>"))
      assertEquals(draft(2, "invalid").status, 422)
      assertEquals(stream.next()._1, "draft-error")
      val late = new Http.EventStream(s"${server.origin}/__preview/events")
      try
        assertEquals(late.next()._2, revision)
        assertEquals(late.next(), ("draft", data), "New browsers receive current drafts")
      finally late.close()
      // A page subscribes with its route and receives only its own page's HTML.
      for (query, expected) <- Seq("%2F" -> Seq("index.html"), "%2Fnotes%2Ftitle.html" -> Seq("notes/title.html"),
          "%2Felsewhere.html" -> Nil) do
        val page = new Http.EventStream(s"${server.origin}/__preview/events?route=$query")
        try
          page.next()
          val (event, replayed) = page.next()
          assertEquals(event, "draft")
          assertEquals(ujson.read(replayed)("pages").arr.map(_("route").str).toSeq, expected, query)
        finally page.close()
      // Saving the draft text and completing a build clears it before the new revision.
      os.write.over(file, "draft")
      BuildStatus.write(project / "dist", BuildStatus.succeeded())
      val cleared = stream.next()
      assertEquals(cleared._1, "draft")
      assertEquals(ujson.read(cleared._2)("saved").bool, true)
      assertNotEquals(stream.next()._2, revision)
      assertEquals(Http.post(s"${server.origin}/__preview/draft", "x" * (DraftPreview.MaxDraftBytes.toInt + 1),
        "Authorization" -> s"Bearer $token").status, 413)
    finally
      stream.close()
      server.close()
      os.remove.all(project)
  }
