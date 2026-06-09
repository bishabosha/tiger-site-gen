package model

import scala.language.experimental.modularity
import Theme.Metadata

object Theme:
  trait Metadata:
    val name: String

trait Theme:
  thisTheme =>

  val metadata: Metadata

  type Templates <: TemplateFunctions
  val templates: Templates

  final type LayoutOf[Data] =
    model.Layout[Context, model.DocPage[Data]]
  final type LayoutOf0[Context <: model.Context, Data] =
    model.Layout[Context, model.DocPage[Data]]

  type SiteMap <: NamedTuple.AnyNamedTuple: SiteMapSchema

  final def siteMap: SiteMapSchema[SiteMap] = summon[SiteMapSchema[SiteMap]]
  def siteMapMeta: SiteMapMeta[Context, SiteMap] = defaultSiteMeta
  def defaultSiteMeta: SiteMapMeta[Context, SiteMap] = SiteMapMeta.default

  type Extra <: NamedTuple.AnyNamedTuple
  def extras(using SiteContext): model.Record[Extra]

  final type Context =
    model.Context.Views.View[model.Context.Of[SiteMap, Extra, Templates]]
  final type SiteContext =
    model.Context.Views.SiteView[model.SiteContext.Of[SiteMap]]
