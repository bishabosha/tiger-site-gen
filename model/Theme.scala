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

  type SiteMap <: NamedTuple.AnyNamedTuple: SiteMapSchema

  final def siteMap: SiteMapSchema[SiteMap] = summon[SiteMapSchema[SiteMap]]
  def siteMapMeta: SiteMapMeta[SiteMap] = SiteMapMeta.default

  def extras(using SiteContext): Extra

  def layoutFor[T](doc: model.DocPage[T]): Option[LayoutOf[T]]

  final type Context =
    model.Context.View[model.Context.ContextForTheme[this.type]]
  final type SiteContext =
    model.Context.SiteView[model.Context.SiteContextForTheme[this.type]]
