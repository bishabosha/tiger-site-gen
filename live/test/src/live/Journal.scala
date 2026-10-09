package live

import model.{Doc, Docs, Layout, Record, SiteRoot, TemplateFunctions, ctx}
import model.SiteMapSchema.auto.given
import scalatags.Text.all.*

final case class Entry(title: String) derives scalanotation.Reader

/** A small non-Reveal site: an index listing numbered notes, each with its own page.
 *  `public/style.css` is copied next to the pages.
 */
object Journal extends model.Theme:
  val metadata: model.Theme.Metadata = new:
    val name = "Journal"
  type SiteMap = (index: Doc[Entry], notes: Docs[Entry])
  type Templates = NamedTuple.Empty
  val templates = TemplateFunctions.Empty
  type Extra = NamedTuple.Empty
  def extras(using SiteContext): Record[Extra] = Record(NamedTuple.Empty)

  private def page(heading: String)(content: Modifier*) =
    html(lang := "en")(
      head(scalatags.Text.tags2.title(heading), link(rel := "stylesheet", href := "/style.css")),
      body(h1(heading), content)
    )
  private val note: LayoutOf[Entry] = Layout { doc =>
    page(doc.frontMatter.title)(raw(io.util.md.renderDoc(doc.rawContent)))
  }
  private val listing: LayoutOf[Entry] = Layout { doc =>
    page(doc.frontMatter.title)(ul(ctx.site.notes.map(n => li(a(href := n.url, n.frontMatter.title)))))
  }
  override val siteMapMeta = defaultSiteMeta.index(_.setAsRoot.layoutAlways(listing)).notes(_.layoutAlways(note))

  override def afterRender(outputRoot: os.Path)(using Context): Unit =
    val style = ctx.siteRoot.root / "public" / "style.css"
    if os.isFile(style) then os.copy.over(style, outputRoot / "style.css")

  def entry(title: String, body: String = "Some text."): String = s"---scala\n(title = \"$title\")\n---\n\n$body\n"

  /** A fresh project: content/index.md, content/notes/010 - first.md, 020 - second.md, public/style.css. */
  def project(): os.Path =
    // Deliberately unresolved: on macOS the temporary directory is behind a symlink.
    val root = os.temp.dir(prefix = "journal-")
    os.write(root / "content" / "index.md", entry("Journal"), createFolders = true)
    os.write(root / "content" / "notes" / "010 - first.md", entry("First note", "The first body."), createFolders = true)
    os.write(root / "content" / "notes" / "020 - second.md", entry("Second note", "The second body."))
    os.write(root / "public" / "style.css", "body { color: black; }", createFolders = true)
    root

  def site(root: os.Path): LiveSite =
    LiveSite(Journal, LiveSiteSettings(watched = Seq("public")))(using SiteRoot(root))
