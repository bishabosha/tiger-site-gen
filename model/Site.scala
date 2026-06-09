package model

import NamedTuple.AnyNamedTuple
import NamedTuple.NamedTuple
import steps.result.Result
import model.SiteMapMeta.RawMeta

sealed trait SiteMapMeta[C <: model.Context, T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[
    T,
    [X] =>> (
        SiteMapMeta.DocColToMetaOf[C, X] => SiteMapMeta.DocColToMetaOf[C, X]
    ) => SiteMapMeta[C, T]
  ]
  def _update(name: String)(
      in: SiteMapMeta.Data[C] => SiteMapMeta.Data[C]
  ): SiteMapMeta[C, T]
  def _query(name: String): SiteMapMeta.Data[C]
  final def selectDynamic(
      name: String
  ): (
      SiteMapMeta.Data[C] => SiteMapMeta.Data[C]
  ) => SiteMapMeta[C, T] =
    _update(name)

  def _mergeFrom[C0 <: model.Context, T0 <: AnyNamedTuple](
      that: SiteMapMeta[C0, T0]
  )(using
      sub: Record.IsSubPrefix[T0, T],
      conformsCtx: model.Context.Views.Conforms[C0, C]
  ): SiteMapMeta[C0, T0] =
    (this, that) match
      case (thisRaw: RawMeta[c, t], thatRaw: RawMeta[c0, t0]) =>
        thatRaw.mergeInner(thisRaw.asInstanceOf[RawMeta[c0, t0]])

object SiteMapMeta:
  type Of[C <: model.Context] = [T <: AnyNamedTuple] =>> SiteMapMeta[C, T]
  type DocColToMeta[C <: model.Context] = [T] =>> DocColToMetaOf[C, T]

  type DocColToMetaOf[C <: model.Context, T] <: Data[C] = T match
    case model.Doc[a]     => DocData[C, a]
    case model.Docs[i, a] => DocsData[C, i, a]

  private class RawMeta[C <: model.Context, T <: AnyNamedTuple] private[SiteMapMeta] (
      private val data: Map[String, Data[C]]
  ) extends SiteMapMeta[C, T]:
    def _query(name: String): Data[C] = data.getOrElse(name, emptyDataOf)
    def _update(
        name: String
    )(in: Data[C] => Data[C]): SiteMapMeta[C, T] =
      RawMeta(data.updatedWith(name) {
        case Some(d) => Some(in(d))
        case None    => Some(in(emptyDataOf))
      })
    def mergeInner(that: RawMeta[C, T]): RawMeta[C, T] =
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

  private val Default: SiteMapMeta[model.Context, AnyNamedTuple] =
    new RawMeta[model.Context, AnyNamedTuple](Map.empty)

  def default[C <: model.Context, T <: AnyNamedTuple: SiteMapSchema]: SiteMapMeta[C, T] =
    Default.asInstanceOf[SiteMapMeta[C, T]]

  private val emptyData: DefaultData = DefaultData(false, None, None)
  private def emptyDataOf[C <: model.Context]: Data[C] =
    emptyData.asInstanceOf[Data[C]]

  private case class DefaultData(
      isRoot: Boolean,
      optIndexLayout: Option[SelLayout[model.Context, Any]],
      optPageLayout: Option[SelLayout[model.Context, Any]]
  ) extends DocsData[model.Context, Any, Any]:
    def setAsRoot = copy(isRoot = true)
    def indexLayout(fn: SelLayout[model.Context, Any]) = copy(optIndexLayout = Some(fn))
    def pageLayout(fn: SelLayout[model.Context, Any]) = copy(optPageLayout = Some(fn))

  sealed trait Data[C <: model.Context]:
    def isRoot: Boolean
    def setAsRoot: Data[C]

  type SelLayout[C <: model.Context, A] =
    model.DocPage[A] => Result[Option[model.Layout[C, model.DocPage[A]]], Exception]
  type LayoutAlways[C <: model.Context, A] =
    model.Layout[C, model.DocPage[A]]

  sealed trait DocData[C <: model.Context, I] extends Data[C]:
    override def setAsRoot: DocData[C, I]
    def optIndexLayout: Option[SelLayout[C, I]]
    def indexLayout(fn: SelLayout[C, I]): DocData[C, I]
    def indexLayoutAlways(layout: LayoutAlways[C, I]): DocData[C, I] =
      indexLayout(Function.const(Result.Ok(Some(layout))))
  sealed trait DocsData[C <: model.Context, I, A] extends DocData[C, I]:
    override def setAsRoot: DocsData[C, I, A]
    override def indexLayout(fn: SelLayout[C, I]): DocsData[C, I, A]
    def optPageLayout: Option[SelLayout[C, A]]
    def pageLayout(fn: SelLayout[C, A]): DocsData[C, I, A]
    def pageLayoutAlways(layout: LayoutAlways[C, A]): DocsData[C, I, A] =
      pageLayout(Function.const(Result.Ok(Some(layout))))

sealed trait SiteMapSchema[T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[T, SiteMapSchema.DocColToSchema]
  def get(name: String): Option[SiteMapSchema.CollectionSpec]
  def apply(name: String): SiteMapSchema.CollectionSpec
  final def selectDynamic(
      name: String
  ): SiteMapSchema.CollectionSpec =
    apply(name)

object SiteMapSchema:
  type IsAll[T] = [U <: Tuple] =>> Tuple.Union[U] <:< T

  type DocColToSchema[T] <: CollectionSpec = T match
    case model.Doc[a]     => SiteMapSchema.DocSpec[a]
    case model.Docs[i, a] => SiteMapSchema.DocsSpec[i, a]

  inline def derived[N <: Tuple, V <: Tuple: IsAll[
    model.DocCollection[?, ?]
  ]]: SiteMapSchema[NamedTuple[N, V]] =
    val nt: NamedTuple[N, Tuple.Map[V, DocColToSchema]] =
      NamedTuple(compiletime.summonAll[Tuple.Map[V, DocColToSchema]])
    apply(nt)

  object auto:
    inline given autoDerived[BaseType, N <: Tuple, V <: Tuple: IsAll[
      model.DocCollection[?, ?]
    ]]: SiteMapSchema[NamedTuple[N, V]] = derived[N, V]

  inline def apply[BaseType, N <: Tuple, V <: Tuple: IsAll[
    model.DocCollection[?, ?]
  ]](
      data: NamedTuple[N, Tuple.Map[V, DocColToSchema]]
  ): SiteMapSchema[NamedTuple[N, V]] = make(data.toSeqMap)

  def make[BaseType, N <: Tuple, V <: Tuple: IsAll[model.DocCollection[?, ?]]](
      data: Map[String, Tuple.Union[Tuple.Map[V, DocColToSchema]]]
  ): SiteMapSchema[NamedTuple[N, V]] =
    new SiteMapSchema[NamedTuple[N, V]] {
      private val data0: Map[String, CollectionSpec] =
        data.asInstanceOf[Map[String, CollectionSpec]]
      def get(name: String): Option[CollectionSpec] = data0.get(name)
      def apply(name: String): CollectionSpec = data0(name)
    }

  type IndexOf[A, T <: Tuple, Acc <: Int] <: Int = T match
    case EmptyTuple => -1
    case A *: _     => Acc
    case _ *: xs    => IndexOf[A, xs, compiletime.ops.int.S[Acc]]

  sealed trait CollectionSpec

  final class DocSpec[A](using
      val ev: scalanotation.Reader[A]
  ) extends CollectionSpec
  final class DocsSpec[I, A](using
      val evI: scalanotation.Reader[I],
      val evA: scalanotation.Reader[A]
  ) extends CollectionSpec

  object CollectionSpec:
    given [A]
      => scalanotation.Reader[A]
      => DocSpec[A] =
      DocSpec()
    given [I, A]
      => (scalanotation.Reader[I], scalanotation.Reader[A])
      => DocsSpec[I, A] = DocsSpec()

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
  given [C <: AnyNamedTuple, P <: AnyNamedTuple]
    => Record.IsSubPrefix[C, P] => Context.Views.Conforms[Site[C], Site[P]]()

  def read[T <: AnyNamedTuple](
      optStatic: Option[os.Path],
      optFavicon: Option[os.Path],
      data: Map[String, DocCollection[?, ?]]
  ): Site[T] =
    Site(optStatic, optFavicon, data)
