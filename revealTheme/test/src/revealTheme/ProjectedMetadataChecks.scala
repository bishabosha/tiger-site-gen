package revealTheme

import model.{Context, Directory, Doc, Docs, Layout, SiteRoot, TemplateFunctions, ThemeMount}
import model.SiteMapSchema.auto.given
import scalatags.Text.all.*
import scala.compiletime.testing.typeCheckErrors

/** The source theme's three fields live at different depths and names in the host. */
object ProjectedMetadataHost extends model.InferredExtras:
  val contentTheme = new MountedContentTheme("projected")
  val metadata = contentTheme.metadata
  type SiteMap = (
      outside: Doc[MountedPage],
      shelf: Directory[(
        library: Directory[contentTheme.Group],
        note: Doc[MountedPage],
        feed: Docs[MountedPage]
      )]
  )
  type Templates = NamedTuple.Empty
  val templates = TemplateFunctions.Empty
  var mappingCalls = 0
  val content = mount(contentTheme)(site =>
    mappingCalls += 1
    (bundle = site.shelf.library, about = site.shelf.note, feed = site.shelf.feed))
  val extraDefs = defineExtras {
    (preparedContent = content.prepare())
  }
  private val local: LayoutOf[MountedPage] = Layout(page => html(body("host: " + page.frontMatter.title)))
  override val siteMapMeta = content.extend(defaultSiteMeta.outside(_.layoutAlways(local)))
    .shelf(_
      .library(_.index(_.setAsRoot).local(_.layoutAlways(local)))
      .note(_.indexed))

class ProjectedMetadataChecks extends munit.FunSuite:
  private def write(path: os.Path, title: String, show: Boolean = true): Unit =
    os.write.over(path, s"""```scala
      |(title = "$title", show = $show)
      |```
      |---
      |Content.
      |""".stripMargin, createFolders = true)

  test("one projection installs nested metadata before loading indexed sources and leaves the root to the host") {
    val root = os.temp.dir(prefix = "projected-metadata-")
    try
      given SiteRoot = SiteRoot(root)
      val shelf = root / "content" / "shelf"
      write(root / "content" / "outside.md", "Outside")
      write(shelf / "library" / "010 - index.md", "Home")
      write(shelf / "library" / "local.md", "Local")
      write(shelf / "library" / "pages" / "010 - shown.md", "Shown")
      write(shelf / "library" / "pages" / "020 - hidden.md", "Hidden", show = false)
      write(shelf / "library" / "nested" / "010 - entry.md", "Nested")
      write(shelf / "010 - note.md", "Note")
      write(shelf / "feed" / "010 - entry.md", "Feed")
      def build(): Unit = io.util.paths.generateSite("content", "dist", ProjectedMetadataHost, ignoreCache = false)
      build()
      val output = root / "dist"
      for (file, title) <- Seq("shelf/library/index.html" -> "Home", "shelf/library/pages/shown.html" -> "Shown",
          "shelf/library/nested/entry.html" -> "Nested", "shelf/note.html" -> "Note", "shelf/feed/entry.html" -> "Feed") do
        assert(os.read(output / os.RelPath(file)).contains(s"projected: $title"), file)
      assert(os.read(output / "outside.html").contains("host: Outside"))
      assert(os.read(output / "shelf" / "library" / "local.html").contains("host: Local"))
      assert(!os.exists(output / "shelf" / "library" / "pages" / "hidden.html"))
      assert(os.read(output / "index.html").contains("/shelf/library/"))
      val context = Context.fromTheme(root / "content", ProjectedMetadataHost)
      assertEquals(context.site.shelf.library.index.path.last, "010 - index.md")
      assert(context.extra.preparedContent.context.site.bundle eq context.site.shelf.library)
      assert(context.extra.preparedContent.context.site.about eq context.site.shelf.note)
      write(shelf / "library" / "pages" / "010 - shown.md", "Updated")
      build()
      assert(os.read(output / "shelf" / "library" / "pages" / "shown.html").contains("projected: Updated"))
      assertEquals(ProjectedMetadataHost.mappingCalls, 1)
    finally os.remove.all(root)
  }

  test("overlapping paths are rejected when the projection is declared") {
    val theme = new MountedContentTheme("test")
    val overlap = intercept[IllegalArgumentException] {
      new ThemeMount[theme.SiteMap, theme.type](theme)(site =>
        (bundle = site.bundle, about = site.bundle.index, feed = site.feed))
    }
    assert(overlap.getMessage.contains("overlapping host paths"))
  }

  test("metadata extension uses stored paths without running the builder or preparing a context") {
    val theme = new MountedContentTheme("test")
    var calls = 0
    val mount = new ThemeMount[theme.SiteMap, theme.type](theme)(site =>
      calls += 1
      (bundle = site.bundle, about = site.about, feed = site.feed))
    def extend() = mount.extend(theme.defaultSiteMeta, _ =>
      throw AssertionError("Metadata must not prepare a context"))
    extend()
    extend()
    assertEquals(calls, 1)
  }

  test("Theme.mount retains singleton types and registers on the receiving host") {
    val host = new MountedContentTheme("host")
    val child = new MountedContentTheme("child")
    given unrelated: model.Theme.Mounts = new model.Theme.Mounts
    val inferred = host.mount(child)(paths =>
      (bundle = paths.bundle, about = paths.about, feed = paths.feed))
    val exact: ThemeMount[host.SiteMap, child.type] = inferred
    val exactTheme: child.type = inferred.theme
    assert(exact.theme eq exactTheme)
    assertEquals(host.mountedThemes.toList, List(child))
    assertEquals(unrelated.mountedThemes.toList, Nil)

    // The inherited helper also coexists with Reveal's specialized mount overload.
    assertEquals(typeCheckErrors("""
      import model.*
      import revealTheme.*
      val child = new RevealTheme()
      val inferred: ThemeMount[RevealTheme.SiteMap, child.type] =
        RevealTheme.mount(child)(paths => (deck = paths.deck))
    """), Nil)
  }

  test("paths reject content reads, copied nodes, unknown names and incompatible mappings at compilation") {
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        site.bundle.index.frontMatter
        (bundle = site.bundle, about = site.about, feed = site.feed))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        site.bundle.pages.size
        (bundle = site.bundle, about = site.about, feed = site.feed))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        (bundle = site.bundle, about = site.about.atIndex(1), feed = site.feed))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        (bundle = site.bundle, about = site.missing, feed = site.feed))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        (bundle = site.bundle, about = site.feed, feed = site.about))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        (bundle = site.bundle, typo = site.about, feed = site.feed))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        (bundle = site.bundle, feed = site.feed))
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val theme = new revealTheme.MountedContentTheme("test")
      theme.mount(theme)(site =>
        (bundle = site.bundle, about = site.about, feed = site.feed, extra = site.about))
    """).nonEmpty)
  }
