package revealTheme

import model.{Context, Directory, Doc, Docs, Layout, Record, Site, SiteRoot, TemplateFunctions, VarArgDocs}
import model.SiteMapSchema.auto.given
import scala.compiletime.testing.typeCheckErrors
import scalatags.Text.all.*

/** Its field name stays abstract while both selector calls are typechecked. */
trait NamedCollectionTheme[Name <: String: ValueOf] extends model.Theme:
  val metadata: model.Theme.Metadata = new:
    val name = "Typed selection"
  type Group = (
      index: Doc[MountedPage],
      pages: Docs[MountedPage],
      nested: Directory[(entries: VarArgDocs[MountedPage])]
  )
  type SiteMap = NamedTuple.NamedTuple[Name *: EmptyTuple, Directory[Group] *: EmptyTuple]
  type Templates = NamedTuple.Empty
  val templates = TemplateFunctions.Empty
  type Extra = NamedTuple.Empty
  def extras(using SiteContext): Record[Extra] = Record(NamedTuple.Empty)

  def collection(site: Site[SiteMap]): Directory[Group] = site._select[Name]

  private val pageLayout: LayoutOf[MountedPage] = Layout { page =>
    html(body(page.frontMatter.title))
  }
  override val siteMapMeta = defaultSiteMeta._select[Name] { group =>
    group._select["index"](_.setAsRoot.layoutAlways(pageLayout))
      ._select["pages"](_.layoutAlways(pageLayout))
      ._select["nested"](_._select["entries"](_.layoutAlways(pageLayout)))
  }

class TypedSelectionChecks extends munit.FunSuite:
  test("abstract-name selectors retain node types, identity, metadata and dependencies") {
    val root = os.temp.dir(prefix = "typed-selection-")
    try
      given SiteRoot = SiteRoot(root)
      type CollectionName = "select"
      object theme extends NamedCollectionTheme[CollectionName]
      val content = root / "content" / valueOf[CollectionName]
      for (file, title) <- Seq("index.md" -> "Index", "pages/010 - first.md" -> "First",
          "nested/010 - entry.md" -> "Nested") do
        os.write(content / os.RelPath(file), s"""```scala
          |(title = "$title", show = true)
          |```
          |---
          |Body.
          |""".stripMargin, createFolders = true)
      val context = Context.fromTheme(root / "content", theme)
      val group: Directory[theme.Group] = theme.collection(context.site)
      assert(group eq context.site.select)
      val index: Doc[MountedPage] = group._select["index"]
      val pages: Docs[MountedPage] = group._select["pages"]
      val entries: VarArgDocs[MountedPage] = group._select["nested"]._select["entries"]
      assert(index eq group.index)
      assert(pages eq group.pages)
      assert(entries eq group.nested.entries)
      val (_, dependencies) = io.util.Templates.withDependencyCollection {
        index.frontMatter.title + pages(0).frontMatter.title + entries(0).frontMatter.title
      }(using context)
      assert(dependencies.contains((content / "index.md").toString))
      assert(dependencies.contains((content / "pages" / "010 - first.md").toString))
      assert(dependencies.contains((content / "nested" / "010 - entry.md").toString))
      io.util.paths.renderSite(root / "dist", theme, os.walk(root / "content").filter(os.isFile).toSet)(using context, summon[SiteRoot])
      assert(os.read(root / "dist" / "index.html").contains("/select/"))
      assert(os.read(root / "dist" / "select" / "pages" / "first.html").contains("First"))
      assert(os.read(root / "dist" / "select" / "nested" / "entry.html").contains("Nested"))
    finally os.remove.all(root)
  }

  test("Fields determine selector results and reject unknown names and wrong callback types") {
    assertEquals(typeCheckErrors("""
      import model.*
      summon[Record.FieldOf[(count: Int, title: String), "title"] =:= String]
      val site: Site[revealTheme.RevealTheme.SiteMap] = ???
      val deck: revealTheme.RevealTheme.Deck = site._select["deck"]
      val collision: Site[(select: Doc[revealTheme.MountedPage])] = ???
      val literalField: Doc[revealTheme.MountedPage] = collision.select
      val typedField: Doc[revealTheme.MountedPage] = collision._select["select"]
      val collisionMeta: SiteMapMeta[Context, (select: Doc[revealTheme.MountedPage])] = ???
      collisionMeta.select(_.setAsRoot)
      collisionMeta._select["select"](_.setAsRoot)
      val meta: SiteMapMeta[Context, revealTheme.RevealTheme.SiteMap] = ???
      meta._select["deck"](_.index(_.setAsRoot))
    """), Nil)
    assert(typeCheckErrors("""
      val site: model.Site[revealTheme.RevealTheme.SiteMap] = ???
      site._select["missing"]
    """).nonEmpty)
    assert(typeCheckErrors("""
      val meta: model.SiteMapMeta[model.Context, revealTheme.RevealTheme.SiteMap] = ???
      meta._select["missing"]
    """).nonEmpty)
    assert(typeCheckErrors("""
      val site: model.Site[revealTheme.RevealTheme.SiteMap] = ???
      val wrong: model.Doc[revealTheme.DeckMeta] = site._select["deck"]
    """).nonEmpty)
    assert(typeCheckErrors("""
      import model.*
      val meta: SiteMapMeta[Context, revealTheme.RevealTheme.SiteMap] = ???
      meta._select["deck"]((doc: SiteMapMeta.DocData[Context, revealTheme.DeckMeta]) => doc)
    """).nonEmpty)
    assert(typeCheckErrors("""
      val site: model.Site[revealTheme.RevealTheme.SiteMap] = ???
      site._select[String]
    """).nonEmpty)
  }
