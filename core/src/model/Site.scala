package model

import NamedTuple.{AnyNamedTuple, NamedTuple}
import steps.result.Result

sealed trait SiteMapMeta[C <: Context, T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[T, [X] =>> (SiteMapMeta.MetaOf[C, X] => SiteMapMeta.MetaOf[C, X]) => SiteMapMeta[C, T]]
  private[model] def entries: Map[String, SiteMapMeta.Data[C]]

  /** Inherit this prefix's metadata when the host context conforms to the base context.
    * The host may then customise inherited fields or configure its additional fields.
    */
  final def extend[Host <: Context, U <: AnyNamedTuple](defaults: SiteMapMeta[Host, U])(using
      Record.IsSubPrefix[U, T], Context.Views.Conforms[Host, C]
  ): SiteMapMeta[Host, U] =
    // The same structural-view proof used by Context.Views.View.narrowChild.
    extendWithContext(defaults)(_.asInstanceOf[C])

  final def extendWithContext[Host <: Context, U <: AnyNamedTuple](defaults: SiteMapMeta[Host, U])(
      project: Host => C
  )(using Record.IsSubPrefix[U, T]): SiteMapMeta[Host, U] =
    entries.foldLeft(defaults) { case (metadata, (name, data)) =>
      metadata._update(name)(_ => SiteMapMeta.adapt(data, project))
    }

  def _query(name: String): SiteMapMeta.Data[C]
  def _update(name: String)(f: SiteMapMeta.Data[C] => SiteMapMeta.Data[C]): SiteMapMeta[C, T]
  final def selectDynamic(name: String): (SiteMapMeta.Data[C] => SiteMapMeta.Data[C]) => SiteMapMeta[C, T] =
    _update(name)

  /** Select a typed metadata modifier using a string type parameter. */
  final def _select[Name <: String: ValueOf](using Name <:< Tuple.Union[NamedTuple.Names[Fields]])
      : Record.FieldOf[Fields, Name] =
    selectDynamic(valueOf[Name]).asInstanceOf[Record.FieldOf[Fields, Name]]

object SiteMapMeta:
  type Of[C <: Context] = [T <: AnyNamedTuple] =>> SiteMapMeta[C, T]
  type MetaOf[C <: Context, T] <: Data[C] = T match
    case Doc[a] => DocData[C, a]
    case Docs[a] => DocsData[C, a]
    case VarArgDocs[a] => DocsData[C, a]
    case Directory[t] => DirectoryData[C, t]

  sealed trait Data[C <: Context]
  type SelLayout[C <: Context, A] =
    Doc[A] => Result[Option[Layout[C, Doc[A]]], Exception]
  type LayoutAlways[C <: Context, A] = Layout[C, Doc[A]]

  final case class DocData[C <: Context, A](
      isRoot: Boolean = false,
      optLayout: Option[SelLayout[C, A]] = None,
      isIndexed: Boolean = false
  ) extends Data[C]:
    /** Resolve `$number - $field.md` in the containing directory. */
    def indexed: DocData[C, A] = copy(isIndexed = true)
    def setAsRoot: DocData[C, A] = copy(isRoot = true)
    def layout(fn: SelLayout[C, A]): DocData[C, A] = copy(optLayout = Some(fn))
    def layoutAlways(value: LayoutAlways[C, A]): DocData[C, A] =
      layout(Function.const(Result.Ok(Some(value))))

  final case class DocsData[C <: Context, A](
      optLayout: Option[SelLayout[C, A]] = None
  ) extends Data[C]:
    def layout(fn: SelLayout[C, A]): DocsData[C, A] = copy(optLayout = Some(fn))
    def layoutAlways(value: LayoutAlways[C, A]): DocsData[C, A] =
      layout(Function.const(Result.Ok(Some(value))))

  final class DirectoryData[C <: Context, T <: AnyNamedTuple](val children: SiteMapMeta[C, T])
      extends Data[C], Selectable:
    type Fields = NamedTuple.Map[T, [X] =>> (MetaOf[C, X] => MetaOf[C, X]) => DirectoryData[C, T]]
    def selectDynamic(name: String): (Data[C] => Data[C]) => DirectoryData[C, T] =
      f => DirectoryData(children._update(name)(f))

    def _select[Name <: String: ValueOf](using Name <:< Tuple.Union[NamedTuple.Names[Fields]])
        : Record.FieldOf[Fields, Name] =
      selectDynamic(valueOf[Name]).asInstanceOf[Record.FieldOf[Fields, Name]]

  /** Layout-only modifiers preserve host root/indexed flags and unconfigured layouts. */
  final class LayoutInstallers[C <: Context, T <: AnyNamedTuple] private[model] (
      source: Map[String, Data[C]]
  ) extends Selectable:
    type Fields = NamedTuple.Map[T, [X] =>> MetaOf[C, X] => MetaOf[C, X]]
    def selectDynamic(name: String): Data[C] => Data[C] =
      target => installLayouts(source(name), target)

  private def installLayouts[C <: Context](source: Data[C], target: Data[C]): Data[C] =
    source match
      case doc: DocData[C, a] =>
        val host = target.asInstanceOf[DocData[C, a]]
        host.copy(optLayout = doc.optLayout.orElse(host.optLayout))
      case docs: DocsData[C, a] =>
        val host = target.asInstanceOf[DocsData[C, a]]
        host.copy(optLayout = docs.optLayout.orElse(host.optLayout))
      case directory: DirectoryData[C, t] =>
        val host = target.asInstanceOf[DirectoryData[C, t]]
        DirectoryData(directory.children.entries.foldLeft(host.children) {
          case (children, (name, child)) =>
            children._update(name)(installLayouts(child, _))
        })

  private class RawMeta[C <: Context, T <: AnyNamedTuple](val entries: Map[String, Data[C]])
      extends SiteMapMeta[C, T]:
    def _query(name: String): Data[C] = entries(name)
    def _update(name: String)(f: Data[C] => Data[C]): SiteMapMeta[C, T] =
      RawMeta(entries.updated(name, f(entries(name))))

  private[model] def adapt[C <: Context, Host <: Context](data: Data[C], project: Host => C): Data[Host] =
    data match
      case doc: DocData[C, a] =>
        DocData[Host, a](
          isRoot = doc.isRoot,
          optLayout = doc.optLayout.map(selector => page =>
            selector(page).map(_.map(_.contramapContext(project)))),
          isIndexed = doc.isIndexed
        )
      case docs: DocsData[C, a] =>
        DocsData[Host, a](docs.optLayout.map(selector => page =>
          selector(page).map(_.map(_.contramapContext(project)))))
      case directory: DirectoryData[C, t] =>
        DirectoryData(new RawMeta[Host, t](directory.children.entries.map { (name, child) =>
          name -> adapt(child, project)
        }))

  def default[C <: Context, T <: AnyNamedTuple](using schema: SiteMapSchema[T]): SiteMapMeta[C, T] =
    fromSchema(schema)

  private def fromSchema[C <: Context, T <: AnyNamedTuple](schema: SiteMapSchema[T]): SiteMapMeta[C, T] =
    RawMeta(schema.entries.map { (name, spec) =>
      val value: Data[C] = spec match
        case _: SiteMapSchema.DocSpec[a] => DocData[C, a]()
        case _: SiteMapSchema.CollectionSpec[a] => DocsData[C, a]()
        case d: SiteMapSchema.DirectorySpec[t] => DirectoryData(fromSchema[C, t](d.schema))
      name -> value
    }.toMap)

sealed trait SiteMapSchema[T <: AnyNamedTuple] extends Selectable:
  type Fields = NamedTuple.Map[T, SiteMapSchema.NodeToSchema]
  def entries: Map[String, SiteMapSchema.NodeSpec]
  def get(name: String): Option[SiteMapSchema.NodeSpec] = entries.get(name)
  def apply(name: String): SiteMapSchema.NodeSpec = entries(name)
  final def selectDynamic(name: String): SiteMapSchema.NodeSpec = apply(name)

object SiteMapSchema:
  /** Count only immediate children; each nested Directory derives its own schema. */
  type VarArgCount[V <: Tuple] <: Int = V match
    case EmptyTuple => 0
    case VarArgDocs[a] *: tail => scala.compiletime.ops.int.S[VarArgCount[tail]]
    case head *: tail => VarArgCount[tail]
  type AtMostOneVarArg[V <: Tuple] =
    scala.compiletime.ops.int.<=[VarArgCount[V], 1] =:= true

  type IsAll[T] = [U <: Tuple] =>> Tuple.Union[U] <:< T
  type NodeToSchema[T] <: NodeSpec = T match
    case Doc[a] => DocSpec[a]
    case Docs[a] => DocsSpec[a]
    case VarArgDocs[a] => VarArgDocsSpec[a]
    case Directory[t] => DirectorySpec[t]

  inline def derived[N <: Tuple, V <: Tuple: IsAll[ContentNode]: AtMostOneVarArg]: SiteMapSchema[NamedTuple[N, V]] =
    val nt: NamedTuple[N, Tuple.Map[V, NodeToSchema]] =
      NamedTuple(compiletime.summonAll[Tuple.Map[V, NodeToSchema]])
    apply(nt)

  object auto:
    inline given autoDerived[N <: Tuple, V <: Tuple: IsAll[ContentNode]: AtMostOneVarArg]: SiteMapSchema[NamedTuple[N, V]] =
      derived[N, V]

  inline def apply[N <: Tuple, V <: Tuple: IsAll[ContentNode]: AtMostOneVarArg](
      data: NamedTuple[N, Tuple.Map[V, NodeToSchema]]
  ): SiteMapSchema[NamedTuple[N, V]] = make(data.toSeqMap)

  def make[N <: Tuple, V <: Tuple: IsAll[ContentNode]: AtMostOneVarArg](
      data: Map[String, Tuple.Union[Tuple.Map[V, NodeToSchema]]]
  ): SiteMapSchema[NamedTuple[N, V]] =
    new SiteMapSchema[NamedTuple[N, V]]:
      val entries = data.asInstanceOf[Map[String, NodeSpec]]

  sealed trait NodeSpec
  final class DocSpec[A](using val reader: scalanotation.Reader[A]) extends NodeSpec
  sealed abstract class CollectionSpec[A](using val reader: scalanotation.Reader[A]) extends NodeSpec
  final class DocsSpec[A](using scalanotation.Reader[A]) extends CollectionSpec[A]
  final class VarArgDocsSpec[A](using scalanotation.Reader[A]) extends CollectionSpec[A]
  final class DirectorySpec[T <: AnyNamedTuple](using val schema: SiteMapSchema[T]) extends NodeSpec
  object NodeSpec:
    given [A: scalanotation.Reader]: DocSpec[A] = DocSpec()
    given [A: scalanotation.Reader]: DocsSpec[A] = DocsSpec()
    given [A: scalanotation.Reader]: VarArgDocsSpec[A] = VarArgDocsSpec()
    given [T <: AnyNamedTuple: SiteMapSchema]: DirectorySpec[T] = DirectorySpec()

final class Site[T <: AnyNamedTuple] private (
    val optStatic: Option[os.Path],
    val optFavicon: Option[os.Path],
    val nodes: Map[String, ContentNode]
) extends Selectable:
  type Fields = T
  def selectDynamic(name: String): ContentNode = nodes(name)

  /** Select the field's precise content-node type without requiring a literal name. */
  def _select[Name <: String: ValueOf](using Name <:< Tuple.Union[NamedTuple.Names[Fields]])
      : Record.FieldOf[Fields, Name] =
    selectDynamic(valueOf[Name]).asInstanceOf[Record.FieldOf[Fields, Name]]

object Site:
  /** Alias nodes without changing their physical paths or documents. */
  inline def project[N <: Tuple, V <: Tuple: SiteMapSchema.IsAll[ContentNode]: SiteMapSchema.AtMostOneVarArg](
      source: Site[?],
      nodes: NamedTuple[N, V]
  ): Site[NamedTuple[N, V]] =
    val names = compiletime.constValueTuple[N].toList.map(_.toString)
    val values = nodes.toTuple.toList.map(_.asInstanceOf[ContentNode])
    read(source.optStatic, source.optFavicon, names.zip(values).toMap)

  given [C <: AnyNamedTuple, P <: AnyNamedTuple]
    => Record.IsSubPrefix[C, P] => Context.Views.Conforms[Site[C], Site[P]]()

  def read[T <: AnyNamedTuple](
      optStatic: Option[os.Path],
      optFavicon: Option[os.Path],
      data: Map[String, ContentNode]
  ): Site[T] = Site(optStatic, optFavicon, data)
