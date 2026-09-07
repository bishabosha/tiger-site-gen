package model

import scala.language.experimental.modularity
import Theme.Metadata

object Theme:
  trait Metadata:
    val name: String

trait Theme:
  thisTheme =>

  val metadata: Metadata

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
