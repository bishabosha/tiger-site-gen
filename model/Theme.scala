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

  type Layouts <: NamedTuple.AnyNamedTuple: Record.Lookup
  val layouts: Record[Layouts]
  final val layoutsByName: model.LayoutRef[Layouts] = model.LayoutRef(thisTheme.layouts)

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
