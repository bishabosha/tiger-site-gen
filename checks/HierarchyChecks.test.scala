//> using test.dep org.scalameta::munit:1.3.3
package revealTheme

import model.{Context, Doc, Docs, VarArgDocs, Directory, Layout, Record, SiteRoot, ctx}
import model.SiteMapSchema.auto.given
import io.util.paths
import scala.compiletime.testing.typeCheckErrors
import scalatags.Text.all.*

case class LandingMeta(title: String) derives scalanotation.Reader
case class ProfileMeta(name: String) derives scalanotation.Reader
case class EntryMeta(label: String) derives scalanotation.Reader
case class EventMeta(year: Int) derives scalanotation.Reader

object HierarchyTheme extends model.Theme:
  val metadata: model.Theme.Metadata = new:
    val name = "Hierarchy"
  type Templates = NamedTuple.Empty
  val templates = model.TemplateFunctions.Empty
  type Extra = NamedTuple.Empty
  def extras(using SiteContext): Record[Extra] = Record(NamedTuple.Empty)
  type SiteMap = (
      index: Doc[LandingMeta],
      about: Doc[ProfileMeta],
      library: Directory[(
        essays: Docs[EntryMeta],
        archive: Directory[(events: Docs[EventMeta])]
      )]
  )
  private val landing: LayoutOf[LandingMeta] = Layout { page =>
    html(body(h1(page.frontMatter.title),
      ctx.site.library.essays.map(entry => p(entry.frontMatter.label))))
  }
  override val siteMapMeta = defaultSiteMeta
    .index(_.setAsRoot.layoutAlways(landing))
    .about(_.layoutAlways(Layout(page => html(body(page.frontMatter.name)))))
    .library(_
      .essays(_.layoutAlways(Layout(page => html(body(page.frontMatter.label)))))
      .archive(_.events(_.layoutAlways(Layout(page => html(body(page.frontMatter.year.toString)))))))

class HierarchyChecks extends munit.FunSuite:
  private def fixture(body: os.Path => Unit): Unit =
    val root = os.temp.dir(prefix = "tiger-hierarchy-")
    try
      write(root / "content" / "index.md", """(title = "Home")""")
      write(root / "content" / "about.md", """(name = "Author")""")
      os.makeDir.all(root / "content" / "library" / "essays")
      os.makeDir.all(root / "content" / "library" / "archive" / "events")
      body(root)
    finally os.remove.all(root)

  private def write(path: os.Path, metadata: String): Unit =
    os.write.over(path, s"---\n```scala\n$metadata\n```\n---\nBody.\n", createFolders = true)

  test("nested metadata retains schema and cardinality checks") {
    assertEquals(typeCheckErrors("""
      val site: model.Site[revealTheme.HierarchyTheme.SiteMap] = ???
      val year: Int = site.library.archive.events(0).frontMatter.year
      val title: String = site.index.frontMatter.title
    """), Nil)
    assert(typeCheckErrors("""
      val site: model.Site[revealTheme.HierarchyTheme.SiteMap] = ???
      site.library.archive.missing
    """).nonEmpty)
    assert(typeCheckErrors("""
      val layout: revealTheme.HierarchyTheme.LayoutOf[revealTheme.ProfileMeta] = ???
      revealTheme.HierarchyTheme.defaultSiteMeta.library(_.essays(_.layoutAlways(layout)))
    """).nonEmpty)
    assert(typeCheckErrors("""
      revealTheme.HierarchyTheme.defaultSiteMeta.library(_.essays(_.setAsRoot))
    """).nonEmpty)
  }

  test("schema derivation permits at most one VarArgDocs in each directory") {
    assertEquals(typeCheckErrors("""
      import model.*
      import model.SiteMapSchema.auto.given
      type Group = (index: Doc[revealTheme.LandingMeta], posts: VarArgDocs[revealTheme.EntryMeta], archive: Docs[revealTheme.EntryMeta])
      summon[SiteMapSchema[(articles: Directory[Group], projects: Directory[Group])]]
    """), Nil)
    assert(typeCheckErrors("""
      import model.*
      import model.SiteMapSchema.auto.given
      summon[SiteMapSchema[(articles: VarArgDocs[revealTheme.EntryMeta], projects: VarArgDocs[revealTheme.EventMeta])]]
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      import model.SiteMapSchema.auto.given
      type Invalid = (first: VarArgDocs[revealTheme.EntryMeta], second: VarArgDocs[revealTheme.EntryMeta])
      summon[SiteMapSchema[(nested: Directory[Invalid])]]
    """).nonEmpty)
    assert(typeCheckErrors("""
      val shared: model.VarArgDocs[revealTheme.EntryMeta] = ???
      val subdirectory: model.Docs[revealTheme.EntryMeta] = shared
    """).nonEmpty)
    assertEquals(typeCheckErrors("""
      val shared: model.VarArgDocs[revealTheme.EntryMeta] = ???
      val subset: model.VarArgDocs[revealTheme.EntryMeta] = shared.take(2)
    """), Nil)
  }

  test("independent schemas render at every depth; collection membership and deleted routes stay correct") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      def build(): Unit = paths.generateSite("content", "dist", HierarchyTheme, ignoreCache = false)
      val essays = root / "content" / "library" / "essays"
      val events = root / "content" / "library" / "archive" / "events"
      build()
      val site = Context.fromTheme(root / "content", HierarchyTheme).site
      assertEquals(site.index.url, "/")
      assertEquals(site.about.url, "/about.html")
      assertEquals(site.library.archive.events.url, "/library/archive/events/")
      assertEquals(site.library.essays.size, 0)
      assert(os.read(root / "dist" / "index.html").contains("Home"))
      assert(os.read(root / "dist" / "about.html").contains("Author"))
      write(essays / "010 - first.md", """(label = "First essay")""")
      write(events / "010 - first.md", "(year = 2026)")
      build()
      assert(os.read(root / "dist" / "index.html").contains("First essay"))
      assert(os.read(root / "dist" / "library" / "essays" / "first.html").contains("First essay"))
      assert(os.read(root / "dist" / "library" / "archive" / "events" / "first.html").contains("2026"))
      assert(!os.exists(root / "dist" / "library" / "essays" / "index.html"))
      os.remove(essays / "010 - first.md")
      build()
      assert(!os.read(root / "dist" / "index.html").contains("First essay"))
      assert(!os.exists(root / "dist" / "library" / "essays" / "first.html"))
      assert(os.exists(root / "dist" / "library" / "archive" / "events" / "first.html"))
      // "index" is an ordinary member of the homogeneous schema.
      write(essays / "020 - index.md", """(label = "Collection index")""")
      build()
      assert(os.read(root / "dist" / "library" / "essays" / "index.html").contains("Collection index"))
    }
  }

  test("singletons and collection members are documents with routes and tracked content") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      val source = root / "content" / "library" / "essays" / "010 - first.md"
      write(source, """(label = "First essay")""")
      val context = Context.fromTheme(root / "content", HierarchyTheme)
      val singleton: Doc[LandingMeta] = context.site.index
      val member: Doc[EntryMeta] = context.site.library.essays(0)
      assert(member eq context.site.library.essays.toIterable.head)
      assertEquals(member.outputPath.toString, "library/essays/first.html")
      assertEquals(member.url, "/library/essays/first.html")
      assertEquals(member.sourcePath, source)
      // Resolve the documents before collecting dependencies, as host extras can.
      val (content, deps) = io.util.Templates.withDependencyCollection {
        singleton.frontMatter.title + member.rawContent
      }(using context)
      assert(content.contains("Home") && content.contains("Body."))
      assertEquals(deps, Set(source.toString, (root / "content" / "index.md").toString))
    }
  }

  test("indexed singletons share a directory with plain documents and VarArgDocs") {
    val root = os.temp.dir(prefix = "tiger-shared-")
    try
      given SiteRoot = SiteRoot(root)
      val theme = new model.Theme:
        val metadata: model.Theme.Metadata = new:
          val name = "Shared directory"
        type Templates = NamedTuple.Empty
        val templates = model.TemplateFunctions.Empty
        type Extra = NamedTuple.Empty
        def extras(using SiteContext): Record[Extra] = Record(NamedTuple.Empty)
        type SiteMap = (
          index: Doc[LandingMeta],
          about: Doc[ProfileMeta],
          contact: Doc[ProfileMeta],
          posts: VarArgDocs[EntryMeta]
        )
        override val siteMapMeta = defaultSiteMeta
          .index(_.indexed.setAsRoot.layoutAlways(Layout(page => html(body(page.frontMatter.title)))))
          .about(_.indexed.layoutAlways(Layout(page => html(body(page.frontMatter.name)))))
          .contact(_.layoutAlways(Layout(page => html(body(page.frontMatter.name)))))
          .posts(_.layoutAlways(Layout(page => html(body(page.frontMatter.label)))))
      val content = root / "content"
      write(content / "000 - index.md", """(title = "Home")""")
      write(content / "005 - about.md", """(name = "Author")""")
      write(content / "contact.md", """(name = "Contact")""")
      write(content / "010 - first.md", """(label = "Entry")""")
      val context = Context.fromTheme(content, theme)
      assertEquals(context.site.index.sourcePath, content / "000 - index.md")
      assertEquals(context.site.about.sourcePath, content / "005 - about.md")
      assertEquals(context.site.contact.sourcePath, content / "contact.md")
      assertEquals(context.site.posts.size, 1)
      assertEquals(context.site.posts.sourcePath, content)
      assertEquals(context.site.posts.url, "/")
      assertEquals(context.site.posts(0).url, "/first.html")
      assertEquals(context.site.index.frontMatter.title, "Home")
      assertEquals(context.site.about.frontMatter.name, "Author")
      paths.generateSite("content", "dist", theme, ignoreCache = true)
      assert(os.isFile(root / "dist" / "index.html"))
      assert(os.isFile(root / "dist" / "about.html"))
      assert(os.isFile(root / "dist" / "first.html"))
      assert(!os.exists(root / "dist" / "posts"))
      os.remove(content / "010 - first.md")
      paths.generateSite("content", "dist", theme, ignoreCache = false)
      assert(!os.exists(root / "dist" / "first.html"))
      assert(os.isFile(root / "dist" / "index.html"))
      // Renumbering changes the physical source, not the public URL.
      os.move(content / "005 - about.md", content / "900 - about.md")
      paths.generateSite("content", "dist", theme, ignoreCache = false)
      assertEquals(Context.fromTheme(content, theme).site.about.url, "/about.html")
      assert(os.read(root / "dist" / "about.html").contains("Author"))
      val duplicate = content / "100 - index.md"
      write(duplicate, """(title = "Duplicate")""")
      val goodIndex = os.read(root / "dist" / "index.html")
      val error = intercept[IllegalArgumentException] {
        paths.generateSite("content", "dist", theme, ignoreCache = false)
      }
      assert(error.getMessage.contains("Multiple indexed singleton documents"))
      assert(error.getMessage.contains("000 - index.md") && error.getMessage.contains("100 - index.md"))
      assertEquals(os.read(root / "dist" / "index.html"), goodIndex)
      os.remove(duplicate)
      os.remove(content / "000 - index.md")
      // Indexed lookup requires a numbered source; an unnumbered file is not a fallback.
      write(content / "index.md", """(title = "Plain")""")
      assert(intercept[IllegalArgumentException] {
        Context.fromTheme(content, theme)
      }.getMessage.contains("Expected indexed singleton"))
      os.remove(content / "index.md")
      write(content / "000 - index.md", """(title = "Home")""")
      // A member cannot overwrite a sibling's output page.
      write(content / "020 - ABOUT.md", """(label = "Collision")""")
      val before = os.read(root / "dist" / "index.html")
      assert(intercept[IllegalArgumentException] {
        paths.generateSite("content", "dist", theme, ignoreCache = false)
      }.getMessage.contains("Duplicate output route"))
      assertEquals(os.read(root / "dist" / "index.html"), before)
    finally os.remove.all(root)
  }

  test("articles and projects each share their own directory with an index") {
    val root = os.temp.dir(prefix = "tiger-articles-projects-")
    try
      given SiteRoot = SiteRoot(root)
      val indexRenders = scala.collection.mutable.ArrayBuffer.empty[String]
      type ProjectMeta = model.Dictionary { val layout: String; val title: String; val software: String }
      val theme = new model.DictionaryTheme:
        val metadata: model.Theme.Metadata = new:
          val name = "Articles and software projects"
        type Templates = NamedTuple.Empty
        val templates = model.TemplateFunctions.Empty
        type Extra = NamedTuple.Empty
        def extras(using SiteContext): Record[Extra] = Record(NamedTuple.Empty)
        type SiteMap = (
          articles: Directory[(index: Doc[mysite.ArticleMeta], posts: VarArgDocs[mysite.ArticleMeta])],
          projects: Directory[(index: Doc[mysite.ArticleMeta], builds: VarArgDocs[ProjectMeta])]
        )
        private val articlesIndex: LayoutOf[mysite.ArticleMeta] = Layout { page =>
          indexRenders += "articles"
          html(body(h1(page.frontMatter.title),
            ctx.site.articles.posts.map(post => a(href := post.url)(post.frontMatter.title))))
        }
        private val projectsIndex: LayoutOf[mysite.ArticleMeta] = Layout { page =>
          indexRenders += "projects"
          html(body(h1(page.frontMatter.title),
            ctx.site.projects.builds.map(project => a(href := project.url)(project.frontMatter.title))))
        }
        private val article: LayoutOf[mysite.ArticleMeta] =
          Layout(page => html(body(page.frontMatter.title)))
        private val project: LayoutOf[ProjectMeta] =
          Layout(page => html(body(page.frontMatter.title, page.frontMatter.software)))
        override val siteMapMeta = defaultSiteMeta
          .articles(_.index(_.indexed.setAsRoot.layout(dict((index = articlesIndex))))
            .posts(_.layout(dict((article = article)))))
          .projects(_.index(_.indexed.layout(dict((index = projectsIndex))))
            .builds(_.layout(dict((project = project)))))
      val content = root / "content"
      val output = root / "dist"
      write(content / "articles" / "000 - index.md", """(layout = "index", title = "Articles")""")
      write(content / "projects" / "000 - index.md", """(layout = "index", title = "Projects")""")
      // Identical filenames belong to separate collections with different schemas.
      val article = content / "articles" / "010 - first.md"
      val project = content / "projects" / "010 - first.md"
      write(article, """(layout = "article", title = "First article")""")
      write(project, """(layout = "project", title = "First project", software = "Scala")""")
      def build(): Unit = paths.generateSite("content", "dist", theme, ignoreCache = false)
      build()
      val site = Context.fromTheme(content, theme).site
      assertEquals(site.articles.posts.size, 1)
      assertEquals(site.projects.builds.size, 1)
      assertEquals(site.articles.index.url, "/articles/")
      assertEquals(site.projects.index.url, "/projects/")
      assertEquals(site.articles.posts(0).url, "/articles/first.html")
      assertEquals(site.projects.builds(0).url, "/projects/first.html")
      assertEquals(site.projects.builds(0).frontMatter.software, "Scala")
      for name <- Seq("articles", "projects") do
        assert(os.isFile(output / name / "index.html"))
        assert(os.isFile(output / name / "first.html"))
      assert(!os.exists(output / "articles" / "posts"))
      assert(!os.exists(output / "projects" / "builds"))
      assert(!os.read(output / "articles" / "index.html").contains("First project"))
      assert(!os.read(output / "projects" / "index.html").contains("First article"))

      indexRenders.clear()
      write(article, """(layout = "article", title = "Updated article")""")
      build()
      assertEquals(indexRenders.toList, List("articles"))
      assert(os.read(output / "articles" / "index.html").contains("Updated article"))

      indexRenders.clear()
      val added = content / "projects" / "020 - second.md"
      write(added, """(layout = "project", title = "Second project", software = "Java")""")
      build()
      assertEquals(indexRenders.toList, List("projects"))
      assert(os.read(output / "projects" / "index.html").contains("/projects/second.html"))

      indexRenders.clear()
      os.remove(project)
      build()
      assertEquals(indexRenders.toList, List("projects"))
      assert(!os.exists(output / "projects" / "first.html"))
      assert(!os.read(output / "projects" / "index.html").contains("First project"))
      assert(os.isFile(output / "articles" / "first.html"))
      assert(os.isFile(output / "projects" / "index.html"))
    finally os.remove.all(root)
  }

  test("missing singleton and duplicate collection routes fail before rendering") {
    fixture { root =>
      given SiteRoot = SiteRoot(root)
      os.remove(root / "content" / "about.md")
      assert(intercept[IllegalArgumentException] {
        Context.fromTheme(root / "content", HierarchyTheme)
      }.getMessage.contains("Expected singleton document"))
      write(root / "content" / "about.md", """(name = "Author")""")
      val essays = root / "content" / "library" / "essays"
      write(essays / "010 - same.md", """(label = "One")""")
      write(essays / "020 - Same.md", """(label = "Two")""")
      assert(intercept[IllegalArgumentException] {
        Context.fromTheme(root / "content", HierarchyTheme)
      }.getMessage.contains("Duplicate document routes"))
    }
  }
