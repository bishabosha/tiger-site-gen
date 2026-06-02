package model

import NamedTuple.AnyNamedTuple
import NamedTuple.NamedTuple

sealed trait SiteMapSchema[T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[T, SiteMapSchema.DocColToSchema]
  def get(name: String): Option[SiteMapSchema.CollectionSpec]
  def apply(name: String): SiteMapSchema.CollectionSpec
  final def selectDynamic(name: String): SiteMapSchema.CollectionSpec =
    apply(name)

object SiteMapSchema:
  type IsAll[T] = [U <: Tuple] =>> Tuple.Union[U] <:< T

  type DocColToSchema[T] <: CollectionSpec = T match
    case model.Doc[a] => SiteMapSchema.DocSpec[a]
    case model.Docs[i, a] => SiteMapSchema.DocsSpec[i, a]

  type &++[X <: AnyNamedTuple, Y <: AnyNamedTuple] <: AnyNamedTuple =
    Tuple.Disjoint[NamedTuple.Names[X], NamedTuple.Names[Y]] match
      case true => NamedTuple.Concat[X, Y]
      case false => AnyNamedTuple

  inline def derived[N <: Tuple, V <: Tuple: IsAll[model.DocCollection[?, ?]]]
      : SiteMapSchema[NamedTuple[N, V]] =
    val nt: NamedTuple[N, Tuple.Map[V, DocColToSchema]] =
      NamedTuple(compiletime.summonAll[Tuple.Map[V, DocColToSchema]])
    apply(nt)

  object auto:
    inline given autoDerived[N <: Tuple, V <: Tuple: IsAll[model.DocCollection[?, ?]]]
        : SiteMapSchema[NamedTuple[N, V]] = derived[N, V]

  inline def apply[N <: Tuple, V <: Tuple: IsAll[model.DocCollection[?, ?]]](
      data: NamedTuple[N, Tuple.Map[V, DocColToSchema]]
  ): SiteMapSchema[NamedTuple[N, V]] = make(data.toSeqMap)

  def make[N <: Tuple, V <: Tuple: IsAll[model.DocCollection[?, ?]]](
      data: Map[String, Tuple.Union[Tuple.Map[V, DocColToSchema]]]
  ): SiteMapSchema[NamedTuple[N, V]] =
    new SiteMapSchema[NamedTuple[N, V]] {
      private val data0: Map[String, CollectionSpec] = data.asInstanceOf[Map[String, CollectionSpec]]
      def get(name: String): Option[CollectionSpec] = data0.get(name)
      def apply(name: String): CollectionSpec = data0(name)
    }

  type IndexOf[A, T <: Tuple, Acc <: Int] <: Int = T match
    case EmptyTuple => -1
    case A *: _     => Acc
    case _ *: xs    => IndexOf[A, xs, compiletime.ops.int.S[Acc]]

  sealed trait CollectionSpec
  final class DocSpec[A](using val ev: scalanotation.Reader[A])
      extends CollectionSpec
  final class DocsSpec[I, A](using
      val evI: scalanotation.Reader[I],
      val evA: scalanotation.Reader[A]
  ) extends CollectionSpec

  object CollectionSpec:
    given [A] => scalanotation.Reader[A] => DocSpec[A] = DocSpec()
    given [I, A] => (evI: scalanotation.Reader[I], evA: scalanotation.Reader[A]) => DocsSpec[I, A] = DocsSpec()

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
  type CompatiblePrefix[T <: AnyNamedTuple, U <: AnyNamedTuple] =
    NamedTuple.Take[T, ToTake[NamedTuple.Names[T], NamedTuple.Names[U], 0]]

  type ToTake[T <: Tuple, U <: Tuple, Acc <: Int] <: Int = (T, U) match
    case (t *: ts, u *: us) => compiletime.ops.any.==[t, u] match
      case true => ToTake[ts, us, compiletime.ops.int.S[Acc]]
      case false => Acc
    case _ => Acc

  def read[T <: AnyNamedTuple](
      optStatic: Option[os.Path],
      optFavicon: Option[os.Path],
      data: Map[String, DocCollection[?, ?]]
  ): Site[T] =
    Site(optStatic, optFavicon, data)
