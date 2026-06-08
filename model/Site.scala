package model

import NamedTuple.AnyNamedTuple
import NamedTuple.NamedTuple
import steps.result.Result
import model.SiteMapMeta.RawMeta

sealed trait SiteMapMeta[C <: model.Context, BaseType, T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[
    T,
    [X] =>> (
        SiteMapMeta.DocColToMetaOf[C, BaseType, X] => SiteMapMeta.DocColToMetaOf[C, BaseType, X]
    ) => SiteMapMeta[C, BaseType, T]
  ]
  def update(name: String)(
      in: SiteMapMeta.Data[C, BaseType] => SiteMapMeta.Data[C, BaseType]
  ): SiteMapMeta[C, BaseType, T]
  def query(name: String): SiteMapMeta.Data[C, BaseType]
  final def selectDynamic(
      name: String
  ): (
      SiteMapMeta.Data[C, BaseType] => SiteMapMeta.Data[C, BaseType]
  ) => SiteMapMeta[C, BaseType, T] =
    update(name)

  def merge[C0 <: model.Context, BaseType0, T0 <: AnyNamedTuple](
      that: SiteMapMeta[C0, BaseType0, T0]
  )(using
      conformsBase: model.DocPage.Conforms[BaseType0, BaseType],
      sub: Site.IsSubPrefix[T0, T],
      conformsCtx: model.Context.Views.Conforms[C0, C]
  ): SiteMapMeta[C0, BaseType0, T0] =
    (this, that) match
      case (thisRaw: RawMeta[c, b, t], thatRaw: RawMeta[c0, b0, t0]) =>
        thatRaw.mergeInner(thisRaw.asInstanceOf[RawMeta[c0, b0, t0]])

object SiteMapMeta:
  type Of[C <: model.Context, BaseType] = [T <: AnyNamedTuple] =>> SiteMapMeta[C, BaseType, T]
  type DocColToMeta[C <: model.Context, BaseType] = [T] =>> DocColToMetaOf[C, BaseType, T]

  type DocColToMetaOf[C <: model.Context, BaseType, T] <: Data[C, BaseType] = T match
    case model.Doc[a]     => DocData[C, BaseType, a]
    case model.Docs[i, a] => DocsData[C, BaseType, i, a]

  private class RawMeta[C <: model.Context, BaseType, T <: AnyNamedTuple] private[SiteMapMeta] (
      private val data: Map[String, Data[C, BaseType]]
  ) extends SiteMapMeta[C, BaseType, T]:
    def query(name: String): Data[C, BaseType] = data.getOrElse(name, emptyDataOf)
    def update(
        name: String
    )(in: Data[C, BaseType] => Data[C, BaseType]): SiteMapMeta[C, BaseType, T] =
      RawMeta(data.updatedWith(name) {
        case Some(d) => Some(in(d))
        case None    => Some(in(emptyDataOf))
      })
    def mergeInner(that: RawMeta[C, BaseType, T]): RawMeta[C, BaseType, T] =
      var folded = this.data
      that.data.foreach((name, d) =>
        folded = folded.updatedWith(name) {
          case Some(existing) =>
            (existing, d) match
              case (existing0: DefaultData, d0: DefaultData) =>
                Some(
                  DefaultData(
                    isRoot = existing0.isRoot || d0.isRoot,
                    optIndexLayout = existing0.optIndexLayout.orElse(d0.optIndexLayout),
                    optPageLayout = existing0.optPageLayout.orElse(d0.optPageLayout)
                  )
                )

          case None => Some(d)
        }
      )
      RawMeta(folded)

  private val Default: SiteMapMeta[model.Context, Any, AnyNamedTuple] =
    new RawMeta[model.Context, Any, AnyNamedTuple](Map.empty)

  def default[C <: model.Context, BaseType, T <: AnyNamedTuple: SiteMapSchema.Of[BaseType]]
      : SiteMapMeta[C, BaseType, T] =
    Default.asInstanceOf[SiteMapMeta[C, BaseType, T]]

  private val emptyData: DefaultData = DefaultData(false, None, None)
  private def emptyDataOf[C <: model.Context, BaseType]: Data[C, BaseType] =
    emptyData.asInstanceOf[Data[C, BaseType]]

  private case class DefaultData(
      isRoot: Boolean,
      optIndexLayout: Option[SelLayout[model.Context, Any]],
      optPageLayout: Option[SelLayout[model.Context, Any]]
  ) extends DocsData[model.Context, Any, Any, Any]:
    def setAsRoot = copy(isRoot = true)
    def indexLayout(fn: SelLayout[model.Context, Any]) = copy(optIndexLayout = Some(fn))
    def pageLayout(fn: SelLayout[model.Context, Any]) = copy(optPageLayout = Some(fn))

  sealed trait Data[C <: model.Context, BaseType]:
    def isRoot: Boolean
    def setAsRoot: Data[C, BaseType]

  type SelLayout[C <: model.Context, A] =
    model.DocPage[A] => Result[Option[model.Layout[C, model.DocPage[A]]], Exception]

  sealed trait DocData[C <: model.Context, BaseType, I] extends Data[C, BaseType]:
    override def setAsRoot: DocData[C, BaseType, I]
    def optIndexLayout: Option[SelLayout[C, I]]
    def indexLayout(fn: SelLayout[C, I]): DocData[C, BaseType, I]
  sealed trait DocsData[C <: model.Context, BaseType, I, A] extends DocData[C, BaseType, I]:
    override def setAsRoot: DocsData[C, BaseType, I, A]
    override def indexLayout(fn: SelLayout[C, I]): DocsData[C, BaseType, I, A]
    def pageLayout(fn: SelLayout[C, A]): DocsData[C, BaseType, I, A]
    def optPageLayout: Option[SelLayout[C, A]]

sealed trait SiteMapSchema[BaseType, T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[T, SiteMapSchema.DocColToSchema[BaseType]]
  def get(name: String): Option[SiteMapSchema.CollectionSpec[BaseType]]
  def apply(name: String): SiteMapSchema.CollectionSpec[BaseType]
  final def selectDynamic(
      name: String
  ): SiteMapSchema.CollectionSpec[BaseType] =
    apply(name)

object SiteMapSchema:
  type Of[BaseType] = [T <: AnyNamedTuple] =>> SiteMapSchema[BaseType, T]
  type IsAll[T] = [U <: Tuple] =>> Tuple.Union[U] <:< T

  type DocColToSchema[BaseType] = [T] =>> DocColToSchemaOf[BaseType, T]

  type DocColToSchemaOf[BaseType, T] <: CollectionSpec[BaseType] = T match
    case model.Doc[a]     => SiteMapSchema.DocSpec[BaseType, a]
    case model.Docs[i, a] => SiteMapSchema.DocsSpec[BaseType, i, a]

  type &++[X <: AnyNamedTuple, Y <: AnyNamedTuple] <: AnyNamedTuple =
    Tuple.Disjoint[NamedTuple.Names[X], NamedTuple.Names[Y]] match
      case true  => NamedTuple.Concat[X, Y]
      case false => AnyNamedTuple

  inline def derived[BaseType, N <: Tuple, V <: Tuple: IsAll[
    model.DocCollection[?, ?]
  ]]: SiteMapSchema[BaseType, NamedTuple[N, V]] =
    val nt: NamedTuple[N, Tuple.Map[V, DocColToSchema[BaseType]]] =
      NamedTuple(compiletime.summonAll[Tuple.Map[V, DocColToSchema[BaseType]]])
    apply(nt)

  object auto:
    inline given autoDerived[BaseType, N <: Tuple, V <: Tuple: IsAll[
      model.DocCollection[?, ?]
    ]]: SiteMapSchema[BaseType, NamedTuple[N, V]] = derived[BaseType, N, V]

  inline def apply[BaseType, N <: Tuple, V <: Tuple: IsAll[
    model.DocCollection[?, ?]
  ]](
      data: NamedTuple[N, Tuple.Map[V, DocColToSchema[BaseType]]]
  ): SiteMapSchema[BaseType, NamedTuple[N, V]] = make(data.toSeqMap)

  def make[BaseType, N <: Tuple, V <: Tuple: IsAll[model.DocCollection[?, ?]]](
      data: Map[String, Tuple.Union[Tuple.Map[V, DocColToSchema[BaseType]]]]
  ): SiteMapSchema[BaseType, NamedTuple[N, V]] =
    new SiteMapSchema[BaseType, NamedTuple[N, V]] {
      private val data0: Map[String, CollectionSpec[BaseType]] =
        data.asInstanceOf[Map[String, CollectionSpec[BaseType]]]
      def get(name: String): Option[CollectionSpec[BaseType]] = data0.get(name)
      def apply(name: String): CollectionSpec[BaseType] = data0(name)
    }

  type IndexOf[A, T <: Tuple, Acc <: Int] <: Int = T match
    case EmptyTuple => -1
    case A *: _     => Acc
    case _ *: xs    => IndexOf[A, xs, compiletime.ops.int.S[Acc]]

  sealed trait CollectionSpec[BaseType]

  sealed trait DocsConforms[BaseType, I, A] extends CollectionSpec[BaseType]:
    def conformsI: DocPage.Conforms[I, BaseType]
    def conformsA: DocPage.Conforms[A, BaseType]

  final class DocSpec[BaseType, A](using
      val ev: scalanotation.Reader[A],
      val conformsA: DocPage.Conforms[A, BaseType]
  ) extends CollectionSpec[BaseType]
      with DocsConforms[BaseType, A, A] {
    def conformsI: DocPage.Conforms[A, BaseType] = conformsA
  }
  final class DocsSpec[BaseType, I, A](using
      val evI: scalanotation.Reader[I],
      val evA: scalanotation.Reader[A],
      val conformsI: DocPage.Conforms[I, BaseType],
      val conformsA: DocPage.Conforms[A, BaseType]
  ) extends CollectionSpec[BaseType]
      with DocsConforms[BaseType, I, A]

  object CollectionSpec:
    given [BaseType, A]
      => DocPage.Conforms[A, BaseType]
      => scalanotation.Reader[A]
      => DocSpec[BaseType, A] =
      DocSpec()
    given [BaseType, I, A]
      => (DocPage.Conforms[I, BaseType], DocPage.Conforms[A, BaseType])
      => (
          scalanotation.Reader[I],
          scalanotation.Reader[A]
    )
      => DocsSpec[BaseType, I, A] = DocsSpec()

final class Site[T <: AnyNamedTuple] private (
    val optStatic: Option[os.Path],
    val optFavicon: Option[os.Path],
    data: Map[String, DocCollection[?, ?]]
) extends Selectable:
  type Fields = T
  def selectDynamic(name: String): DocCollection[?, ?] = data(
    name
  )
  def allDocs: Iterable[DocCollection[?, ?]] = data.values

object Site:
  type IsSubPrefix[This <: AnyNamedTuple, That <: AnyNamedTuple] =
    CompatiblePrefix[This, That] =:= That
  type CompatiblePrefix[This <: AnyNamedTuple, That <: AnyNamedTuple] =
    NamedTuple.Take[This, PrefixLength[NamedTuple.Names[This], NamedTuple.Names[
      That
    ], 0]]

  type PrefixLength[T <: Tuple, U <: Tuple, Acc <: Int] <: Int = (T, U) match
    case (t *: ts, u *: us) =>
      compiletime.ops.any.==[t, u] match
        case true  => PrefixLength[ts, us, compiletime.ops.int.S[Acc]]
        case false => Acc
    case _ => Acc

  given [C <: AnyNamedTuple, P <: AnyNamedTuple]
    => IsSubPrefix[C, P] => Context.Views.Conforms[Site[C], Site[P]]()

  def read[T <: AnyNamedTuple](
      optStatic: Option[os.Path],
      optFavicon: Option[os.Path],
      data: Map[String, DocCollection[?, ?]]
  ): Site[T] =
    Site(optStatic, optFavicon, data)
