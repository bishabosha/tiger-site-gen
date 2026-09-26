package live

import java.util.concurrent.TimeUnit

class PreviewServerChecks extends munit.FunSuite:
  private def start(root: os.Path, live: Boolean = true, noReload: Seq[String] = Nil): LiveServer =
    LiveServer.start(LiveServerConfig(root / "dist", root / "content", root, live = live, port = 0,
      noReload = noReload, log = _ => ()))

  private def completeBuild(root: os.Path, status: BuildStatus = BuildStatus.succeeded()): BuildStatus =
    BuildStatus.write(root / "dist", status)
    status

  test("static server serves the built page unchanged and has no live routes") {
    val root = os.temp.dir(prefix = "static-preview-")
    val html = "<html><body><main>Page</main></body></html>"
    os.write(root / "dist" / "index.html", html, createFolders = true)
    os.write(root / "dist" / ".outputs.json", "{\"content/index.md\":\"index.html\"}")
    os.makeDir.all(root / "content")
    completeBuild(root)
    val server = start(root, live = false)
    try
      assertEquals(Http.get(s"${server.origin}/").body, html)
      assertEquals(Http.get(s"${server.origin}/__author/collection").status, 404)
      assertEquals(Http.get(s"${server.origin}/__author/").status, 404)
      assertEquals(Http.get(s"${server.origin}/__preview/client.js").status, 404)
      assertEquals(Http.post(s"${server.origin}/__preview/draft", "{}").status, 405)
      assert(!os.exists(root / ".live-preview.json"), "Static serving must not announce draft previews")
    finally
      server.close()
      os.remove.all(root)
  }

  test("static files: traversal, dot files, redirects, content types, HEAD and missing files") {
    val root = os.temp.dir(prefix = "files-preview-")
    val site = root / "dist" / "site"
    os.write(site / "index.html", "<html><body>Site</body></html>", createFolders = true)
    os.write(root / "secret.txt", "outside")
    os.write(site / "notes.md", "# Notes")
    os.symlink(site / "escape.txt", root / "secret.txt")
    completeBuild(root)
    val server = start(root)
    try
      val redirect = Http.get(s"${server.origin}/site?x=1")
      assertEquals(redirect.status, 302)
      assertEquals(redirect.header("location"), Some("/site/?x=1"))
      assertEquals(Http.get(s"${server.origin}/site/notes.md").header("content-type"), Some("text/plain; charset=utf-8"))
      assertEquals(Http.get(s"${server.origin}/site/notes.md").header("cache-control"), Some("no-cache"))
      assertEquals(Http.get(s"${server.origin}/site/missing.html").status, 404)
      assertEquals(Http.get(s"${server.origin}/site/escape.txt").status, 404, "Symlinks must not escape the output")
      assertEquals(Http.get(s"${server.origin}/.tiger-build.json").status, 404, "Build bookkeeping is not served")
      assertEquals(Http.raw(server.port, "GET /../secret.txt HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n"), 403)
      assertEquals(Http.raw(server.port, "GET /site/%2e%2e/%2e%2e/secret.txt HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n"), 403)
      assertEquals(Http.post(s"${server.origin}/site/", "x").status, 405)
      assertEquals(Http.get(s"${server.origin}/").status, 404)
    finally
      server.close()
      os.remove.all(root)
  }

  test("the reload client goes into generated pages only, with opt-outs, and follows build markers") {
    val root = os.temp.dir(prefix = "live-preview-")
    val dist = root / "dist"
    val originalHtml = "<html><body><h1>Original page</h1></body></html>"
    os.write(dist / "blog" / "index.html", originalHtml, createFolders = true)
    os.write(dist / "blog" / "post.html", originalHtml)
    os.write(dist / "blog" / "quiet.html", "<html><body data-live=\"off\">Quiet</body></html>")
    os.write(dist / "blog" / "embed.html", originalHtml)
    val viewerHtml = "<!doctype html><html><body><main>Standalone viewer</main></body></html>"
    os.write(dist / "assets" / "sheets" / "viewer.html", viewerHtml, createFolders = true)
    os.write(dist / ".outputs.json", ujson.write(ujson.Obj("content/blog/index.md" -> "blog/index.html",
      "content/blog/010 - post.md" -> "blog/post.html", "content/blog/quiet.md" -> "blog/quiet.html",
      "content/blog/embed.md" -> "blog/embed.html")))
    os.write(dist / "document.pdf", "%PDF-1.7\n")
    os.write(dist / "decoder.wasm", Array[Byte](0, 97, 115, 109))
    val first = completeBuild(root)
    val server = start(root, noReload = Seq("blog/embed.html"))
    val stream = new Http.EventStream(s"${server.origin}/__preview/events")
    try
      val response = Http.get(s"${server.origin}/blog/")
      assert(response.body.contains("src=\"/__preview/client.js\" data-tiger-live"))
      val servedRevision = "data-revision=\"([^\"]+)\"".r.findFirstMatchIn(response.body).get.group(1)
      assertEquals(servedRevision, first.revision)
      assertEquals(os.read(dist / "blog" / "index.html"), originalHtml)
      assert(Http.get(s"${server.origin}/blog/post.html").body.contains("__preview/client.js"))
      assert(!Http.get(s"${server.origin}/blog/quiet.html").body.contains("__preview/client.js"), "data-live=off opts out")
      assertEquals(Http.get(s"${server.origin}/blog/embed.html").body, originalHtml, "noReload opts out")
      val viewerUrl = s"${server.origin}/assets/sheets/viewer.html"
      assertEquals(Http.get(viewerUrl).body, viewerHtml, "Copied HTML assets are not generated pages")
      val client = Http.get(s"${server.origin}/__preview/client.js")
      assertEquals(client.status, 200)
      assert(client.body.contains("tigerLivePlugins"))
      assertEquals(Http.get(s"${server.origin}/document.pdf").header("content-type"), Some("application/pdf"))
      assertEquals(Http.get(s"${server.origin}/decoder.wasm").header("content-type"), Some("application/wasm"))
      val head = Http.head(s"${server.origin}/blog/")
      assertEquals(head.header("content-length"), Some(response.body.getBytes("UTF-8").length.toString))
      assertEquals(head.body, "")

      assertEquals(ujson.read(stream.next()._2), first.json)
      assert(stream.contentType.exists(_.startsWith("text/event-stream")))
      // Writing output alone does not announce a completed build.
      os.write.over(dist / "blog" / "index.html", "<html><body>Updated page</body></html>")
      Thread.sleep(650)
      assert(stream.events.isEmpty)
      val second = completeBuild(root)
      assertEquals(ujson.read(stream.next()._2)("revision").str, second.revision)
      assert(Http.get(s"${server.origin}/blog/").body.contains("Updated page"))
      assertEquals(Http.get(viewerUrl).body, viewerHtml, "Builds leave the standalone viewer unchanged")

      // A failed build keeps the output and reports its message; the next success clears it.
      val failed = completeBuild(root, BuildStatus.failed(IllegalStateException("Broken <source>")))
      val failure = ujson.read(stream.next()._2)
      assertEquals((failure("ok").bool, failure("message").str), (false, "Broken <source>"))
      assert(failure("trace").str.contains("IllegalStateException"))
      assert(Http.get(s"${server.origin}/blog/").body.contains("Updated page"))
      val unbuilt = Http.get(s"${server.origin}/blog/new.html")
      assertEquals(unbuilt.status, 503)
      assert(unbuilt.body.contains("data-tiger-live-placeholder") && unbuilt.body.contains("/__preview/client.js"))
      assertEquals(Http.get(s"${server.origin}/blog/missing.png").status, 404)
      val late = new Http.EventStream(s"${server.origin}/__preview/events")
      try assertEquals(ujson.read(late.next()._2)("revision").str, failed.revision, "New pages learn about the failure")
      finally late.close()
      val recovered = completeBuild(root)
      assertEquals(ujson.read(stream.next()._2)("ok").bool, true)
      server.published(recovered)
      Thread.sleep(650)
      assert(stream.events.isEmpty, "A repeated revision caused a reload loop")
      val direct = BuildStatus.succeeded()
      server.published(direct)
      assertEquals(ujson.read(stream.next()._2)("revision").str, direct.revision, "In-process builders notify directly")
    finally
      stream.close()
      server.close()
      os.remove.all(root)
  }

  test("a rewrite that keeps mtime still notifies through ctime") {
    val root = os.temp.dir(prefix = "ctime-preview-")
    val status = completeBuild(root)
    val marker = BuildStatus.marker(root / "dist")
    val mtime = os.mtime(marker)
    val server = start(root)
    val stream = new Http.EventStream(s"${server.origin}/__preview/events")
    try
      assertEquals(ujson.read(stream.next()._2)("revision").str, status.revision)
      Thread.sleep(20)
      val next = completeBuild(root)
      os.mtime.set(marker, mtime)
      assertEquals(ujson.read(stream.next()._2)("revision").str, next.revision)
    finally
      stream.close()
      server.close()
      os.remove.all(root)
  }

  test("a stopped server releases its port and discovery file") {
    val root = os.temp.dir(prefix = "stop-preview-")
    val server = start(root)
    val discovery = ujson.read(os.read(root / ".live-preview.json"))
    assertEquals(discovery("port").num.toInt, server.port)
    assertEquals(discovery("project").str, root.toString)
    val stream = new Http.EventStream(s"${server.origin}/__preview/events")
    try
      stream.next()
      val started = System.nanoTime()
      server.close()
      assert(TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - started) < 5000)
      assert(!os.exists(root / ".live-preview.json"))
      intercept[java.io.IOException](Http.get(s"${server.origin}/"))
    finally
      stream.close()
      os.remove.all(root)
  }

  test("navigation is scoped, replayed on reconnect and protected like authoring") {
    val root = os.temp.dir(prefix = "navigation-preview-")
    os.write(root / "dist" / "deck" / "index.html", "<html>deck</html>", createFolders = true)
    os.write(root / "dist" / "other" / "index.html", "<html>other</html>", createFolders = true)
    completeBuild(root)
    val server = start(root)
    val chrome = new Http.EventStream(s"${server.origin}/__preview/events?route=/deck/")
    val editor = new Http.EventStream(s"${server.origin}/__preview/events?route=/deck/index.html")
    val other = new Http.EventStream(s"${server.origin}/__preview/events?route=/other/")
    try
      chrome.next(); editor.next(); other.next()
      val move = ujson.Obj("route" -> "/deck/", "target" -> "stable-slide-id", "step" -> 2, "client" -> "chrome")
      val response = Http.postJson(server.origin, "/__author/navigate", move)
      assertEquals(response.status, 200)
      assertEquals(response.json("route").str, "/deck/index.html")
      for stream <- Seq(chrome, editor) do
        val (kind, data) = stream.next()
        assertEquals(kind, "navigation")
        assertEquals(ujson.read(data), response.json)
      assert(other.events.poll(100, TimeUnit.MILLISECONDS) == null)
      val late = new Http.EventStream(s"${server.origin}/__preview/events?route=/deck/")
      try
        late.next()
        assertEquals(ujson.read(late.next()._2), response.json)
      finally late.close()
      assertEquals(Http.postJson(server.origin, "/__author/navigate", move, Some("https://example.com")).status, 403)
      move("route") = "/../deck/index.html"
      assertEquals(Http.postJson(server.origin, "/__author/navigate", move).status, 400)
      move("route") = "/missing.html"
      assertEquals(Http.postJson(server.origin, "/__author/navigate", move).status, 404)
    finally
      chrome.close(); editor.close(); other.close(); server.close()
      os.remove.all(root)
  }
