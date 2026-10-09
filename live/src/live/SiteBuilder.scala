package live

import model.{Context, DisplayMode, SiteRoot}
import io.util.paths

/** Produces a site's output and returns source → dependency paths for draft previews.
 *  The host publishes build status only after this operation and dependency learning succeed.
 */
trait SiteBuilder:
  def build(output: os.Path, mode: DisplayMode): Map[String, Set[String]]

/** The standard Tiger builder; other builders can be injected into [[LiveSite]]. */
final class ThemeBuilder[T <: model.Theme](
    val theme: T,
    content: os.Path,
    editorSources: Seq[String]
)(using SiteRoot) extends SiteBuilder:
  private val session = new model.BuildSession

  def build(output: os.Path, mode: DisplayMode): Map[String, Set[String]] =
    given theme.Context = Context.fromTheme(content, theme, session, mode)
    val sources = os.walk(content).filter(os.isFile).toSet
    val dependencies = paths.renderSite(output, theme, sources)
    model.EditorManifest.write(theme, editorSources)
    dependencies
