package model

import NamedTuple.AnyNamedTuple
import NamedTuple.NamedTuple

sealed trait SiteMapMeta[T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[
    T,
    [_] =>> (SiteMapMeta.Data => SiteMapMeta.Data) => SiteMapMeta[T]
  ]
  def update(name: String)(
      in: SiteMapMeta.Data => SiteMapMeta.Data
  ): SiteMapMeta[T]
  def query(name: String): SiteMapMeta.Data
  final def selectDynamic(
      name: String
  ): (SiteMapMeta.Data => SiteMapMeta.Data) => SiteMapMeta[T] =
    update(name)

object SiteMapMeta:
  private class RawMeta[T <: AnyNamedTuple] private[SiteMapMeta] (
      data: Map[String, Data]
  ) extends SiteMapMeta[T]:
    def query(name: String): Data = data.getOrElse(name, emptyData)
    def update(name: String)(in: Data => Data): SiteMapMeta[T] =
      RawMeta(data.updatedWith(name) {
        case Some(d) => Some(in(d))
        case None    => Some(in(emptyData))
      })

  private val Default: SiteMapMeta[AnyNamedTuple] =
    new RawMeta[AnyNamedTuple](Map.empty)

  def default[BaseType, T <: AnyNamedTuple: SiteMapSchema.Of[BaseType]]: SiteMapMeta[T] =
    Default.asInstanceOf[SiteMapMeta[T]]

  private val emptyData: Data = new:
    def isRoot: Boolean = false
    def setAsRoot: Data = rootData

  private val rootData: Data = new:
    def isRoot: Boolean = true
    def setAsRoot: Data = this

  sealed trait Data:
    def isRoot: Boolean
    def setAsRoot: Data

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
