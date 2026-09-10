package model

import scala.language.experimental.modularity
import Theme.Metadata

object Theme:
  /** A definition-time registry, separate from per-build Prepared contexts. */
  final class Mounts:
    private val themes = scala.collection.mutable.ArrayBuffer.empty[Theme]
    private[model] def register(theme: Theme): Unit = themes += theme
    def mountedThemes: Seq[Theme] = themes.toVector

  trait Metadata:
    val name: String

trait Theme:
  thisTheme =>

  val metadata: Metadata

  /** Mount constructors inherit this registry from their enclosing host theme. */
  protected given themeMounts: Theme.Mounts = new Theme.Mounts

  /** Local templates take precedence, then mounts in declaration order.
    * Override to expose mounts owned outside this theme definition.
    */
  def mountedThemes: Seq[Theme] = themeMounts.mountedThemes

  private[model] final def defaultTemplate(name: String): Option[TemplateFunction] =
    def find(theme: Theme, visited: Set[Theme]): Option[TemplateFunction] =
      if visited.contains(theme) then None
      else theme.templates.get(name).orElse {
        theme.mountedThemes.iterator
          .flatMap(mounted => find(mounted, visited + theme)).nextOption()
      }
    find(this, Set.empty)

  /** Initial Markdown parsing runs before mounted contexts can be prepared. */
  final def renderTemplateDefault(expr: String): String =
    val (name, args) = expr.span(!_.isWhitespace)
    defaultTemplate(name).getOrElse {
      throw new Exception(s"Template function not found: `{{${expr}}}`")
    }.renderDefault(args.trim)

  type Templates <: NamedTuple.AnyNamedTuple
  val templates: TemplateFunctions[Templates]

  final type LayoutOf[Data] =
    model.Layout[Context, model.Doc[Data]]
  final type LayoutOf0[Context <: model.Context, Data] =
    model.Layout[Context, model.Doc[Data]]

  type SiteMap <: NamedTuple.AnyNamedTuple: SiteMapSchema

  final lazy val siteMap: SiteMapSchema[SiteMap] = summon[SiteMapSchema[SiteMap]]
  def siteMapMeta: SiteMapMeta[Context, SiteMap] = defaultSiteMeta
  def defaultSiteMeta: SiteMapMeta[Context, SiteMap] = SiteMapMeta.default

  type Extra <: NamedTuple.AnyNamedTuple
  def extras(using SiteContext): model.Record[Extra]

  /** Complete theme-owned output after pages, static files and mounted hooks.
    * Called once per successful renderSite pass, including incremental passes
    * with no changed pages. Prepared mounts are wired automatically; overrides
    * need not forward to mounts or call super. Failures prevent cache publication.
    */
  def afterRender(outputRoot: os.Path)(using Context): Unit = ()

  final type Context =
    model.Context.Views.View[model.Context.Of[SiteMap, Extra, Templates]]
  final type SiteContext =
    model.Context.Views.SiteView[model.SiteContext.Of[SiteMap]]
