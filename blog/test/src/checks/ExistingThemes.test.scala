package checks

import model.{Context, SiteRoot}
import model.Record.++
import io.util.paths

class ExistingThemes extends munit.FunSuite:
  private val project = blog.BlogPaths.content

  test("BreezeSite keeps existing article, project and about URLs") {
    given SiteRoot = SiteRoot(project)
    val context = Context.fromTheme(project / "_docs", breezeSite.BreezeSite)
    assertEquals(context.site.about.index.url, "/about/")
    assertEquals(context.site.articles.index.url, "/articles/")
    assertEquals(context.site.projects.index.url, "/projects/")
    assertEquals(context.site.talks.index.url, "/talks/")
    assert(context.site.articles.posts.size > 0)
    assert(context.site.projects.posts.size > 0)
    val output = os.temp.dir(prefix = "breeze-render-")
    try
      paths.renderSite(output, breezeSite.BreezeSite, os.walk(project / "_docs").filter(os.isFile).toSet)(
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
    summon[home.Homepage.Templates =:= NamedTuple.Empty]
    summon[home.Homepage.Extra =:= NamedTuple.Empty]
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

  test("Breeze is a complete base and BreezeSite extends its layouts and page dependencies") {
    summon[breeze.Breeze.Templates =:= (url: model.TemplateFunction, icon: model.TemplateFunction)]
    summon[breeze.Breeze.Extra =:= (
      nav: List[model.ContentNode],
      extraHead: Seq[scalatags.Text.Modifier],
      extraFoot: Seq[scalatags.Text.Modifier]
    )]
    summon[breezeSite.BreezeSite.Extra =:= breeze.Breeze.Extra]
    summon[breezeSite.BreezeSite.Templates =:= (breeze.Breeze.Templates ++ (`match-sim-embed`: model.TemplateFunction))]
    summon[Context.Views.Conforms[breezeSite.BreezeSite.Context, breeze.Breeze.Context]]
    given SiteRoot = SiteRoot(project)
    val root = os.temp.dir(prefix = "breeze-base-")
    val output = root / "dist"
    val source = root / "content"
    try
      for directory <- Seq("about", "static") do
        os.copy(project / "_docs" / directory, source / directory, createFolders = true)
      os.copy(project / "_docs" / "articles" / "000 - index.md", source / "articles" / "000 - index.md", createFolders = true)
      os.write(source / "articles" / "010 - hello.md", """```scala
        |(layout = "article", title = "Hello", description = "A plain article", published = "01/Jan/2026")
        |```
        |---
        |A personal homepage using only the base theme.
        |""".stripMargin)
      val base = Context.fromTheme(source, breeze.Breeze)(using SiteRoot(root))
      val specialised = Context.fromTheme(project / "_docs", breezeSite.BreezeSite)
      val identity = {
        given breezeSite.BreezeSite.Context = specialised
        breezeSite.BreezeSite.whoAmI
      }
      assertEquals(identity, {
        given breeze.Breeze.Context = base
        breeze.Breeze.whoAmI
      })
      assertEquals(base.extra.nav.map(_.url), List("/about/", "/articles/"))
      assertEquals(specialised.extra.nav.map(_.url), List("/about/", "/articles/", "/projects/", "/talks/"))
      assert(base.extra.extraHead.isEmpty && base.extra.extraFoot.isEmpty)
      paths.renderSite(output, breeze.Breeze, os.walk(source).filter(os.isFile).toSet)(using base, base.siteRoot)
      assertEquals(os.read(output / "index.html"), paths.rootPage(redirect = "/about/").render)
      val about = os.read(output / "about" / "index.html")
      assert(about.contains("Recent Articles"))
      assert(!about.contains("Special Links"))
      assert(!about.contains("highlight.js"))
      assert(!os.exists(output / "projects"))
      assert(os.isFile(output / "articles" / "index.html"))
      assert(base.site.articles.posts.toIterable.forall(doc => os.isFile(output / doc.outputPath)))

      paths.renderSite(output, breezeSite.BreezeSite, os.walk(project / "_docs").filter(os.isFile).toSet)(
        using specialised, summon[SiteRoot])
      assert(os.read(output / "about" / "index.html").contains("Special Links"))
      val inheritedArticle = os.read(output / specialised.site.articles.posts(0).outputPath)
      val navigation = inheritedArticle.split("<nav", 2)(1).split("</nav>", 2)(0)
      assert(navigation.contains("href=\"/projects/\""))
      assert(navigation.contains("href=\"/talks/\""))
      assert(inheritedArticle.contains("highlight.js"))
      assert(inheritedArticle.contains("katex.min.js"))
      assert(inheritedArticle.contains("admonition_"))
      assertEquals("highlight.js/11.5.1/highlight.min.js".r.findAllIn(inheritedArticle).size, 1)
      // Inheritance never changes the base theme's extras or metadata.
      assert(base.extra.extraHead.isEmpty && base.extra.extraFoot.isEmpty)
    finally os.remove.all(root)
  }

  test("metadata inheritance rejects missing and incompatible base schemas") {
    import scala.compiletime.testing.typeCheckErrors
    assert(typeCheckErrors("""
      val unrelated: model.SiteMapMeta[breeze.Breeze.Context, (other: model.Doc[String])] = ???
      breeze.Breeze.siteMapMeta.extend(unrelated)
    """).nonEmpty)
    assert(typeCheckErrors("""
      type Wrong = (about: model.Doc[String], articles: model.Doc[String])
      val incompatible: model.SiteMapMeta[breeze.Breeze.Context, Wrong] = ???
      breeze.Breeze.siteMapMeta.extend(incompatible)
    """).nonEmpty)
    assert(typeCheckErrors("""
      type MissingTemplates = model.Context.Views.View[model.Context.Of[
        breeze.Breeze.SiteMap, breeze.Breeze.Extra, NamedTuple.Empty]]
      val incomplete: model.SiteMapMeta[MissingTemplates, breeze.Breeze.SiteMap] = ???
      breeze.Breeze.siteMapMeta.extend(incomplete)
    """).nonEmpty)
  }
