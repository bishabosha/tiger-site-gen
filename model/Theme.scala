package model

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

  type Site <: model.Site

  type Extra

  def extras(using Context, Context.InMakeCtx): Extra

  type BuiltinFrontMatter = Dictionary {
    val isRoot: Boolean; val layout: String
  }

  final type DocCollectionOf[
      FMI <: BuiltinFrontMatter,
      FM <: BuiltinFrontMatter
  ] =
    model.DocCollection[DocPageOf[FMI], DocPageOf[FM]]
  final type DocsOf[
      FMI <: BuiltinFrontMatter,
      FM <: BuiltinFrontMatter
  ] =
    model.Docs[DocPageOf[FMI], DocPageOf[FM]]
  final type DataOf[
      FM <: BuiltinFrontMatter
  ] =
    model.Docs[DocPageOf[BuiltinFrontMatter], DocPageOf[FM]]
  final type DocOf[FM <: BuiltinFrontMatter] = model.Doc[DocPageOf[FM]]
  final type DocPageOf[FM <: BuiltinFrontMatter] = model.DocPage {
    val frontMatter: FM
  }
  final type BaseDocCollection =
    DocCollectionOf[BuiltinFrontMatter, BuiltinFrontMatter]

  final type Context = model.Context {
    val site: Site {
      def allDocs: Iterable[
        BaseDocCollection
      ]
    }
    val extra: Extra
  }
