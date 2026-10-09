package revealTheme

import model.{Context, Directory, Doc, Docs, Layout, Record, SiteRoot, TemplateFunctions, VarArgDocs, ctx}
import model.SiteMapSchema.auto.given
import scala.compiletime.testing.typeCheckErrors
import scalatags.Text.all.*
import steps.result.Result

case class MountedPage(title: String, show: Boolean) derives scalanotation.Reader

class MountedContentTheme(prefix: String) extends model.Theme:
  val metadata: model.Theme.Metadata = new:
    val name = "Mounted content"
  type Group = (
      index: Doc[MountedPage],
      pages: Docs[MountedPage],
      nested: Directory[(entries: VarArgDocs[MountedPage])],
      local: Doc[MountedPage]
  )
  type SiteMap = (bundle: Directory[Group], about: Doc[MountedPage], feed: Docs[MountedPage])
  type Templates = NamedTuple.Empty
  val templates = TemplateFunctions.Empty
  type Extra = (label: String)
  def extras(using SiteContext): Record[Extra] = Record((label = prefix))
  private val pageLayout: LayoutOf[MountedPage] = Layout { page =>
    html(body(ctx.extra.label + ": " + page.frontMatter.title))
  }
  override val siteMapMeta = defaultSiteMeta
    .bundle(_
      .index(_.indexed.setAsRoot.layoutAlways(pageLayout))
      .pages(_.layout(page =>
        if page.frontMatter.title == "invalid" then Result.Err(IllegalArgumentException("Rejected page"))
        else Result.Ok(Option.when(page.frontMatter.show)(pageLayout))))
      .nested(_.entries(_.layoutAlways(pageLayout))))
    .about(_.setAsRoot.layoutAlways(pageLayout))
    .feed(_.layoutAlways(pageLayout))

object MountedContentHost extends model.Theme:
  val mainTheme = new MountedContentTheme("primary")
  val otherTheme = new MountedContentTheme("secondary")
  val metadata = mainTheme.metadata
  type SiteMap = (renamed: Directory[mainTheme.Group], note: Doc[MountedPage], feed: Docs[MountedPage])
  type Templates = NamedTuple.Empty
  val templates = TemplateFunctions.Empty
  val main = mount(mainTheme)(site =>
    (bundle = site.renamed, about = site.note, feed = site.feed))
  val other = mount(otherTheme)(site =>
    (bundle = site.renamed, about = site.note, feed = site.feed))
  type Extra = (other: other.Prepared, hostLabel: String, renamedMount: main.Prepared)
  def extras(using SiteContext): Record[Extra] =
    Record((other = other.prepare(), hostLabel = "host", renamedMount = main.prepare()))
  private val hostLayout: LayoutOf[MountedPage] = Layout { page =>
    html(body(ctx.extra.hostLabel + ": " + page.frontMatter.title))
  }
  override val siteMapMeta = defaultSiteMeta
    .renamed(_
      .index(_.setAsRoot)
      .local(_.layoutAlways(hostLayout))
      .pages(_.layoutAlways(hostLayout)))
    .note(_.indexed)
    .renamed(main.installLayouts[Context].bundle)
    .note(main.installLayouts[Context].about)
    .feed(main.installLayouts[Context](_.extra.renamedMount).feed)

class ThemeMountLayoutChecks extends munit.FunSuite:
  private def write(path: os.Path, title: String, show: Boolean = true): Unit =
    os.write.over(path, s"""```scala
      |(title = "$title", show = $show)
      |```
      |---
      |Content.
      |""".stripMargin, createFolders = true)

  test("generic installers adapt nested layouts and preserve host routing and fallback metadata") {
    val root = os.temp.dir(prefix = "generic-layouts-")
    try
      given SiteRoot = SiteRoot(root)
      write(root / "content" / "renamed" / "index.md", "Home")
      write(root / "content" / "renamed" / "local.md", "Local")
      write(root / "content" / "renamed" / "pages" / "010 - shown.md", "Shown")
      write(root / "content" / "renamed" / "pages" / "020 - hidden.md", "Hidden", show = false)
      write(root / "content" / "renamed" / "nested" / "010 - nested.md", "Nested")
      write(root / "content" / "010 - note.md", "Note")
      write(root / "content" / "feed" / "010 - entry.md", "Feed")
      def build(): Unit = io.util.paths.generateSite("content", "dist", MountedContentHost, ignoreCache = true)
      build()
      val output = root / "dist"
      for (path, title) <- Seq(
          "renamed/index.html" -> "Home", "renamed/pages/shown.html" -> "Shown",
          "renamed/nested/nested.html" -> "Nested", "note.html" -> "Note", "feed/entry.html" -> "Feed") do
        val html = os.read(output / os.RelPath(path))
        assert(html.contains(s"primary: $title"), path)
        assert(!html.contains("secondary:"), path)
      assert(os.read(output / "renamed" / "local.html").contains("host: Local"))
      assert(!os.exists(output / "renamed" / "pages" / "hidden.html"))
      assert(os.read(output / "index.html").contains("/renamed/"))
      val context = Context.fromTheme(root / "content", MountedContentHost)
      assertEquals(context.site.note.path.last, "010 - note.md")
      assertEquals(context.site.renamed.index.path.last, "index.md")
      assert(context.extra.renamedMount.context.site.bundle eq context.site.renamed)
      write(root / "content" / "renamed" / "pages" / "010 - shown.md", "invalid")
      val error = intercept[IllegalArgumentException](build())
      assertEquals(error.getMessage, "Rejected page")
    finally os.remove.all(root)
  }

  test("installers check node names, schemas and the exact prepared mount type") {
    assertEquals(typeCheckErrors("""
      import revealTheme.MountedContentHost as Host
      Host.main.installLayouts[Host.Context].bundle
      Host.main.installLayouts[Host.Context].about
      Host.main.installLayouts[Host.Context].feed
    """), Nil)
    assert(typeCheckErrors("""
      import revealTheme.MountedContentHost as Host
      Host.main.installLayouts[Host.Context].missing
    """).nonEmpty)
    assert(typeCheckErrors("""
      import revealTheme.MountedContentHost as Host
      val wrong: model.SiteMapMeta.DocData[Host.Context, String] = ???
      Host.main.installLayouts[Host.Context].about(wrong)
    """).nonEmpty)
    assert(typeCheckErrors("""
      import revealTheme.MountedContentHost as Host
      type Missing = model.Context.Of[Host.SiteMap, (other: Host.other.Prepared), Host.Templates]
      Host.main.installLayouts[Missing].bundle
    """).nonEmpty)
    assert(typeCheckErrors("""
      import revealTheme.MountedContentHost as Host
      type Duplicate = model.Context.Of[Host.SiteMap,
        (one: Host.main.Prepared, two: Host.main.Prepared), Host.Templates]
      Host.main.installLayouts[Duplicate].bundle
    """).nonEmpty)
  }
