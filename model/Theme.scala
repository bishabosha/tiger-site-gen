package model

import scala.language.experimental.modularity

trait Theme:
  thisTheme =>

  val metadata: Metadata
  trait Metadata extends reflect.Selectable:
    val name: String

  final type LayoutOf[Data] =
    model.Layout[Context, model.DocPage[Data]]
  final type LayoutOf0[Context <: model.Context, Data] =
    model.Layout[Context, model.DocPage[Data]]

  val templates: TemplateFunctions = TemplateFunctions.Empty

  type SiteMap <: NamedTuple.AnyNamedTuple: SiteMapSchema.Of[BaseType]

  final def siteMap: SiteMapSchema[BaseType, SiteMap] =
    summon[SiteMapSchema[BaseType, SiteMap]]
  def siteMapMeta: SiteMapMeta[Context, BaseType, SiteMap] = defaultSiteMeta
  def defaultSiteMeta: SiteMapMeta[Context, BaseType, SiteMap] = SiteMapMeta.default

  type Extra
  def extras(using SiteContext): Extra = ().asInstanceOf[Extra]

  type BaseType

  final type Context =
    model.Context.Views.View[model.Context.ContextForTheme[this.type]]
  final type SiteContext =
    model.Context.Views.SiteView[model.Context.SiteContextForTheme[this.type]]
