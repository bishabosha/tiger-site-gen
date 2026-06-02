package model

import scala.language.experimental.modularity

trait Theme:
  thisTheme =>

  final type LayoutOf[FM <: BuiltinFrontMatter] =
    model.Layout[Context, DocPageOf[FM]]
  object Layout:
    def apply[FM <: BuiltinFrontMatter](
        layout: LayoutOf[FM]
    ): layout.type = layout

  val metadata: Metadata
  trait Metadata extends Selectable:
    val name: String
    val layouts: Layouts

  val templates: TemplateFunctions = TemplateFunctions.Empty

  type Extra

  type SiteMap <: NamedTuple.AnyNamedTuple : SiteMapSchema
  final def siteMap: SiteMapSchema[SiteMap] = summon[SiteMapSchema[SiteMap]]

  def extras(using Context, Context.InMakeCtx): Extra

  type BuiltinFrontMatter = Dictionary {
    val isRoot: Boolean; val layout: String
  }

  final type DocCollectionOf[
      FMI <: BuiltinFrontMatter,
      FM <: BuiltinFrontMatter
  ] =
    model.DocCollection[FMI, FM]
  final type DocsOf[
      FMI <: BuiltinFrontMatter,
      FM <: BuiltinFrontMatter
  ] =
    model.Docs[FMI, FM]
  final type DataOf[
      FM <: BuiltinFrontMatter
  ] =
    model.Docs[BuiltinFrontMatter, FM]
  final type DocOf[FM <: BuiltinFrontMatter] = model.Doc[FM]
  final type DocPageOf[FM <: BuiltinFrontMatter] = model.DocPage[FM]
  final type BaseDocCollection =
    DocCollectionOf[BuiltinFrontMatter, BuiltinFrontMatter]

  final type Context0 = ContextOf[Extra, SiteMap]
  final type Context = model.Context.Boxed[Context0]

  given narrowChild: [CE <: PE, PE, Child <: NamedTuple.AnyNamedTuple, Parent <: NamedTuple.AnyNamedTuple]
    => Context.Boxed[ContextOf[CE, Child]]
    => (Site.CompatiblePrefix[Parent, Child] =:= Parent)
    => Context.Boxed[ContextOf[PE, Parent]] =
      summon[Context.Boxed[ContextOf[CE, Child]]].asInstanceOf[Context.Boxed[ContextOf[PE, Parent]]]

  final type ContextOf[E, T <: NamedTuple.AnyNamedTuple] = model.Context {
    val site: model.Site[T] {
      def allDocs: Iterable[
        BaseDocCollection
      ]
    }
    val extra: E
  }
