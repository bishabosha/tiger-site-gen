package live

import model.{Context, SiteRoot, curr}
import io.util.paths
import upickle.default.ReadWriter

/** One page rendered with unsaved drafts in place of their saved sources.
 *  `route` is the output path (e.g. `articles/post.html`) and `url` the page's site URL.
 */
final case class DraftPage(route: String, url: String, html: String) derives ReadWriter

/** Not a document the renderer can preview (outside the site, or shown on no page).
 *  The draft endpoint answers 404 and publishes nothing.
 */
final class DraftRejected(message: String) extends Exception(message)

/** Renders unsaved editor buffers for [[DraftPreview]]. */
trait DraftRenderer:
  /** Render every page that shows `file`, reading `drafts` (which include `file`'s text)
   *  instead of the saved sources. Throws [[DraftRejected]] for files that are not documents
   *  of the site; any other exception means the draft is invalid (e.g. incomplete front matter).
   */
  def render(file: os.Path, drafts: Map[os.Path, String]): Seq[DraftPage]

  /** Prepare caches before the first keystroke arrives. */
  def warm(): Unit = ()

/** Drafts for any Tiger site: a persistent, read-only renderer using the site's real
 *  theme, templates and layouts. Sources and build output are never written.
 *
 *  The pages shown for a draft are the source's own page plus every page whose last
 *  render depended on it (for example a deck that includes the edited slide, or an
 *  index listing the edited article). Dependencies come from [[learn]] (completed
 *  builds), [[warm]], or rendering pages this session has not seen yet.
 */
class SiteDrafts(theme: model.Theme, content: os.Path)(using SiteRoot) extends DraftRenderer:
  private val session = new model.BuildSession
  @volatile private var dependencies = Map.empty[os.Path, Set[String]]

  /** Drafts are identified by real paths; the site reads `content` as given. */
  private def sitePath(file: os.Path): os.Path =
    val real =
      try os.Path(file.toNIO.toRealPath())
      catch case _: java.io.IOException => throw DraftRejected("Not a document of this site")
    val root = os.Path(content.toNIO.toRealPath())
    if !real.startsWith(root) || real == root || real.ext != "md" then throw DraftRejected("Not a document of this site")
    content / real.relativeTo(root)

  /** Record page dependencies from a build (`renderSite`'s result: site-root-relative source → paths). */
  def learn(built: Map[String, Set[String]]): Unit = synchronized {
    dependencies = dependencies ++ built.map((source, deps) => os.Path(source, curr) -> deps)
  }

  def render(file: os.Path, drafts: Map[os.Path, String]): Seq[DraftPage] = synchronized {
    val target = sitePath(file)
    val overrides = drafts.flatMap((path, text) =>
      try Some(sitePath(path) -> text) catch case _: DraftRejected => None) + (target -> drafts.getOrElse(file, ""))
    val site = paths.buildSiteDb(content, theme, session, overrides)
    if !paths.siteDocuments(site).exists(_.sourcePath == target) then throw DraftRejected("Not a document of this site")
    given theme.Context = Context.fromSite(theme)(site, session)
    val known = dependencies
    def shows(source: os.Path, deps: Set[String]) = source == target || deps.contains(target.toString)
    // Pages never rendered in this session are rendered to learn whether they show the draft.
    val rendered = paths.planSite(theme).pages.flatMap { page =>
      known.get(page.source) match
        case Some(deps) if !shows(page.source, deps) => None
        case _ => Some(page.render())
    }
    dependencies = known ++ rendered.map(page => page.source -> page.dependencies)
    val affected = rendered.filter(page => shows(page.source, page.dependencies))
    if affected.isEmpty then throw DraftRejected("No page shows this document")
    affected.map(page => DraftPage(page.route, page.url, page.html))
  }

  /** Render every page once (without writing) to warm caches and learn dependencies. */
  override def warm(): Unit = synchronized {
    if dependencies.isEmpty then try
      given theme.Context = Context.fromSite(theme)(paths.buildSiteDb(content, theme, session), session)
      val rendered = paths.planSite(theme).pages.map(_.render())
      dependencies = dependencies ++ rendered.map(page => page.source -> page.dependencies)
    catch case scala.util.control.NonFatal(_) => () // Invalid saved input is reported per request.
  }
