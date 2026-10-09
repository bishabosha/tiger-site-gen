package checks

import live.{BuildStatus, LiveSite}
import model.SiteRoot

/** Live editing is not Reveal-specific: the Breeze blog builds, previews drafts and serves. */
class LiveBlogChecks extends munit.FunSuite:
  test("a Breeze article draft renders its page and the articles index, without writing") {
    val root = os.temp.dir(prefix = "live-blog-")
    try
      os.copy(blog.BlogPaths.content / "_docs", root / "content")
      val site = LiveSite(breezeSite.BreezeSite, live.LiveSiteSettings(watched = Nil))(using SiteRoot(root))
      assert(site.build().ok)
      assert(BuildStatus.read(root / "dist").exists(_.ok))
      val file = root / "content" / "articles" / "001 - the-beginning.md"
      val original = os.read(file)
      val draft = original.replace("I decided to write my own website generator", "I drafted a live preview")
        .replace("Part 1\"", "Part 1 (draft)\"")
      val pages = site.drafts.render(file, Map(file -> draft))
      val routes = pages.map(_.route).toSet
      assert(routes.contains("articles/the-beginning.html"), routes.toString)
      assert(routes.contains("articles/index.html"), routes.toString)
      assert(pages.find(_.route == "articles/the-beginning.html").get.html.contains("I drafted a live preview"))
      assert(pages.find(_.route == "articles/index.html").get.html.contains("Part 1 (draft)"))
      assertEquals(os.read(file), original)
      assert(!os.read(root / "dist" / "articles" / "the-beginning.html").contains("I drafted a live preview"))
      val server = site.serve(0)
      try
        val page = live.Http.get(s"${server.origin}/articles/the-beginning.html").body
        assert(page.contains("/static/live/client_"))
        val studio = live.Http.get(s"${server.origin}/__author/collection?directory=articles").json
        assertEquals(studio("noun").str, "page")
        assert(studio("files").arr.exists(_("name").str == "001 - the-beginning.md"))
      finally server.close()
    finally os.remove.all(root)
  }
