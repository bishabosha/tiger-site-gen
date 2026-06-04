package model

trait DictionaryTheme extends Theme:
  thisTheme =>

  final def layoutFor(
      doc: model.DocPage.View[BaseType]
  ): Option[LayoutOf[BaseType]] =
    // TODO: Layout factory could capture a conforms, or we get rid of all this and
    // set the layout on the collection directly
    Some(doc.frontMatter.layout)
      .filter(_.nonEmpty)
      .map(layoutKey =>
        metadata.layouts
          .selectDynamic(layoutKey)
          .asInstanceOf[LayoutOf[BaseType]]
      )

  type BuiltinFrontMatter = Dictionary {
    val layout: String
  }

  type BaseType = BuiltinFrontMatter

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
