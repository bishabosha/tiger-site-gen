package checks

import model.{Context, SiteRoot}
import io.util.paths

class ExistingThemes extends munit.FunSuite:
  private val project = blog.BlogPaths.content

  test("Breeze keeps existing article, project and about URLs") {
    given SiteRoot = SiteRoot(project)
    val context = Context.fromTheme(project / "_docs", breezeSite.Breeze)
    assertEquals(context.site.about.index.url, "/about/")
    assertEquals(context.site.articles.index.url, "/articles/")
    assertEquals(context.site.projects.index.url, "/projects/")
    assertEquals(context.site.talks.index.url, "/talks/")
    assert(context.site.articles.posts.size > 0)
    assert(context.site.projects.posts.size > 0)
    val output = os.temp.dir(prefix = "breeze-render-")
    try
      paths.renderSite(output, breezeSite.Breeze, os.walk(project / "_docs").filter(os.isFile).toSet)(
        using context, summon[SiteRoot])
      assertEquals(os.read(output / "index.html"), paths.rootPage(redirect = "/about/").render)
      assert(os.isFile(output / "about" / "index.html"))
      assert(os.isFile(output / "articles" / "index.html"))
      assert(os.isFile(output / "projects" / "index.html"))
      assert(os.isFile(output / "talks" / "index.html"))
      assert(os.isFile(output / "match-type-simulator" / "index.html"))
      for doc <- context.site.articles.posts do assert(os.isFile(output / doc.outputPath))
      for doc <- context.site.projects.posts do assert(os.isFile(output / doc.outputPath))
      assert(!os.exists(output / "articles" / "posts"))
    finally os.remove.all(output)
  }

  test("Homepage renders with its existing about URL") {
    given SiteRoot = SiteRoot(project)
    val context = Context.fromTheme(project / "_home", home.Homepage)
    val output = os.temp.dir(prefix = "homepage-render-")
    try
      paths.renderSite(output, home.Homepage, os.walk(project / "_home").filter(os.isFile).toSet)(
        using context, summon[SiteRoot])
      assert(os.isFile(output / "about" / "index.html"))
      assert(os.read(output / "index.html").contains("/about/"))
    finally os.remove.all(output)
  }

  test("blog entry points build both sites from relocated content") {
    blog.makeSite()
    blog.makeHome()
    for site <- Seq("breeze", "home") do
      val output = blog.BlogPaths.root / "dist" / site
      assert(os.isFile(output / "about" / "index.html"))
      assertEquals(os.read(output / "index.html"), paths.rootPage(redirect = "/about/").render)
  }
