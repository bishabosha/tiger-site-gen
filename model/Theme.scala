package model

import scala.language.experimental.modularity

trait Theme:
  thisTheme =>
  final type LayoutOf[Data] =
    model.Layout[Context, model.DocPage[Data]]
  // object Layout:
  //   def apply[Data](layout: LayoutOf[Data]): layout.type = layout
  // def makeLayout[Data](layout: LayoutOf[Data]): layout.type = layout

  val metadata: Metadata
  trait Metadata extends Selectable:
    val name: String
    val layouts: Layouts

  val templates: TemplateFunctions = TemplateFunctions.Empty

  type Extra

  type SiteMap <: NamedTuple.AnyNamedTuple: SiteMapSchema.Of[BaseType]

  final def siteMap: SiteMapSchema[BaseType, SiteMap] =
    summon[SiteMapSchema[BaseType, SiteMap]]
  def siteMapMeta: SiteMapMeta[SiteMap] = SiteMapMeta.default

  def extras(using SiteContext): Extra

  type BaseType

  def layoutFor(doc: model.DocPage.View[BaseType]): Option[LayoutOf[BaseType]]

  final type Context =
    model.Context.Views.View[model.Context.ContextForTheme[this.type]]
  final type SiteContext =
    model.Context.Views.SiteView[model.Context.SiteContextForTheme[this.type]]
