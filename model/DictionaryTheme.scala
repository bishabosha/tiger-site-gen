package model

trait DictionaryTheme extends Theme:
  thisTheme =>

  final def layoutFor[T](doc: model.DocPage[T]): Option[LayoutOf[T]] =
    doc.frontMatter match
      case d: model.Dictionary =>
        Some(d.asInstanceOf[BuiltinFrontMatter].layout)
          .filter(_.nonEmpty)
          .map(layoutKey =>
            metadata.layouts.selectDynamic(layoutKey).asInstanceOf[LayoutOf[T]]
          )
      case _ => None

  type BuiltinFrontMatter = Dictionary {
    val layout: String
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
