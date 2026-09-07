package model

trait DictionaryTheme extends Theme:
  thisTheme =>

  inline final def dict[A <: BaseType, N <: Tuple, V <: Tuple](
      t: NamedTuple.NamedTuple[N, V]
  )(using
      conformsLayouts: model.Doc.ConformsAll[Tuple.Map[V, Layout.DataOfLayout], A]
  ): SiteMapMeta.SelLayout[Context, A] =
    dictImpl(t.toSeqMap)

  final def dictImpl[A <: BaseType, V <: Tuple](
      lookup: Map[String, Tuple.Union[V]]
  )(using
      conformsLayouts: model.Doc.ConformsAll[Tuple.Map[V, Layout.DataOfLayout], A]
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

  final type VarArgDocsOf[FM <: BuiltinFrontMatter] = model.VarArgDocs[FM]
  final type DocsOf[FM <: BuiltinFrontMatter] = model.Docs[FM]
  final type DataOf[FM <: BuiltinFrontMatter] = model.Docs[FM]
  final type DocOf[FM <: BuiltinFrontMatter] = model.Doc[FM]
