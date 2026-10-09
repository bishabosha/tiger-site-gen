package model

import NamedTuple.{AnyNamedTuple, NamedTuple}
import SiteMapMeta.{Data, DirectoryData, DocData}

/** A structural projection stored as target field names and typed host paths. */
final class SiteProjection[HostMap <: AnyNamedTuple, MountedMap <: AnyNamedTuple] private[model] (
    private val bindings: Map[String, List[String]]
):
  private val destinations = bindings.values.toVector
  for
    i <- destinations.indices
    j <- 0 until i
  do
    val a = destinations(i)
    val b = destinations(j)
    require(!a.startsWith(b) && !b.startsWith(a),
      s"SiteProjection: overlapping host paths ${a.mkString(".")} and ${b.mkString(".")}")

  /** Select the original nodes; physical paths and document identity are retained. */
  def apply(site: Site[HostMap]): Site[MountedMap] =
    def select(nodes: Map[String, ContentNode], path: List[String]): ContentNode =
      val node = nodes(path.head)
      if path.tail.isEmpty then node
      else select(node.asInstanceOf[Directory[?]].children.nodes, path.tail)
    Site.read(site.optStatic, site.optFavicon, bindings.map { (name, path) =>
      name -> select(site.nodes, path)
    })

  private[model] def extend[C <: Context, M <: Context](
      defaults: SiteMapMeta[C, HostMap], metadata: SiteMapMeta[M, MountedMap], context: C => M
  ): SiteMapMeta[C, HostMap] =
    def inherit(source: Data[C], target: Data[C]): Data[C] = source match
      // Root selection belongs to the host, including within a mapped directory.
      case doc: DocData[C, a] => doc.copy(isRoot = target.asInstanceOf[DocData[C, a]].isRoot)
      case directory: DirectoryData[C, t] =>
        val host = target.asInstanceOf[DirectoryData[C, t]]
        DirectoryData(directory.children.entries.foldLeft(host.children) { case (children, (name, data)) =>
          children._update(name)(inherit(data, _))
        })
      case other => other

    def update[T <: AnyNamedTuple](meta: SiteMapMeta[C, T], path: List[String], value: Data[C]): SiteMapMeta[C, T] =
      meta._update(path.head) { target =>
        if path.tail.isEmpty then inherit(value, target)
        else
          val directory = target.asInstanceOf[DirectoryData[C, AnyNamedTuple]]
          DirectoryData(update(directory.children, path.tail, value))
      }
    bindings.foldLeft(defaults) { case (meta, (name, path)) =>
      update(meta, path, SiteMapMeta.adapt(metadata.entries(name), context))
    }

object SiteProjection:
  type Children[N] <: AnyNamedTuple = N match
    case Directory[t] => t
    case _ => NamedTuple.Empty

  type Mapping[H <: AnyNamedTuple, M <: AnyNamedTuple] = NamedTuple.Map[M, [N] =>> Path[H, N]]

  /** Capture labels at the mount declaration, where the mounted sitemap is known. */
  final class Labels[M <: AnyNamedTuple](val values: List[String])
  object Labels:
    inline given derived[M <: AnyNamedTuple]: Labels[M] =
      new Labels(compiletime.constValueTuple[NamedTuple.Names[M]].toList.map(_.toString))

  /** Selectable paths have the site's field types, but expose no document contents. */
  sealed class Paths[HostMap <: AnyNamedTuple, T <: AnyNamedTuple] private[model] (
      private[model] val _steps: List[String]
  ) extends Selectable:
    type Fields = Mapping[HostMap, T]
    def selectDynamic(name: String): Any = new Path[HostMap, Nothing](_steps :+ name)
    def _select[Name <: String: ValueOf](using Name <:< Tuple.Union[NamedTuple.Names[Fields]])
        : Record.FieldOf[Fields, Name] =
      selectDynamic(valueOf[Name]).asInstanceOf[Record.FieldOf[Fields, Name]]

  final class Path[HostMap <: AnyNamedTuple, N] private[model] (steps: List[String])
      extends Paths[HostMap, Children[N]](steps)

  private[model] def capture[H <: AnyNamedTuple, M <: AnyNamedTuple](fields: Mapping[H, M])(using
      labels: Labels[M]
  ): SiteProjection[H, M] =
    val paths = fields.asInstanceOf[Product].productIterator.map(_.asInstanceOf[Path[H, ?]]._steps).toList
    new SiteProjection(labels.values.zip(paths).toMap)

  private[model] def root[H <: AnyNamedTuple]: Paths[H, H] = new Paths(Nil)
