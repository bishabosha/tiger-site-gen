package model

trait DictionaryTheme extends Theme:
  thisTheme =>

  inline final def dict[A <: BaseType, N <: Tuple, V <: Tuple](
      t: NamedTuple.NamedTuple[N, V]
  )(using
      conformsLayouts: model.DocPage.ConformsAll[Tuple.Map[V, Layout.DataOfLayout], A]
  ): SiteMapMeta.SelLayout[Context, A] =
    dictImpl(t.toSeqMap)

  final def dictImpl[A <: BaseType, V <: Tuple](
      lookup: Map[String, Tuple.Union[V]]
  )(using
      conformsLayouts: model.DocPage.ConformsAll[Tuple.Map[V, Layout.DataOfLayout], A]
  ): SiteMapMeta.SelLayout[Context, A] =
    doc =>
      val found = Some(doc.frontMatter.layout)
        .filter(_.nonEmpty)
        .flatMap(layoutKey => lookup.get(layoutKey).map(_.asInstanceOf[LayoutOf[A]]))
      steps.result.Result.Ok(found)

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
