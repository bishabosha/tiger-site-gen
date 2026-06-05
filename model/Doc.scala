package model

import com.vladsch.flexmark.util.ast.Document
import io.util.Templates
import scala.annotation.unchecked.uncheckedVariance

final case class DocPage[+Data](
    name: String,
    path: os.Path,
    frontMatter: Data,
    wordCount: Int,
    headings: List[(String, String, Int)],
    htmlPreview: String,
    rawContent: String,
    private[model] val idx: Int
)

object DocPage:
  opaque type View[D] <: DocPage[D] = DocPage[D]
  object View:
    def apply[D](doc: DocPage[D]): View[D] = doc

  trait Conforms[Data, BaseType]:
    def toBase(doc: DocPage[Data]): View[BaseType]
  object Conforms:
    given [Data, BaseType](using ev: Data <:< BaseType): Conforms[
      Data,
      BaseType
    ] with {
      def toBase(doc: DocPage[Data]): View[BaseType] = View(
        ev.liftCo(doc)
      )
    }

sealed trait AnyDocCollection:
  def collName: String
  def willRender: Boolean

sealed trait DocCollection[+DI, +D] extends AnyDocCollection:
  def index: DocPage[DI]
  def foreach(op: DocPage[D] => Unit): Unit
  def toIterable: Iterable[DocPage[D]]

class Doc[+D](val collName: String, _index: DocPage[D])
    extends DocCollection[D, D]:
  def willRender: Boolean = true
  override def index: DocPage[D] =
    Templates.recordDependency(_index.path)
    _index
  def foreach(op: DocPage[D] => Unit): Unit =
    Templates.recordDependency(_index.path)
    op(_index)
  def toIterable: Iterable[DocPage[D]] = Iterable.empty

class Docs[+DI, +D](
    val collName: String,
    optIndex: Option[DocPage[DI]],
    data: IndexedSeq[DocPage[D]]
) extends DocCollection[DI, D]:
  self =>
  export data.size

  def apply(idx: Int): DocPage[D] =
    Templates.recordDependency(data(idx).path)
    data(idx)

  def willRender: Boolean = optIndex.isDefined

  override def index: DocPage[DI] = optIndex.get

  def take(n: Int): Docs[DI, D] =
    Templates.recordMultiDependency(data.take(n).map(_.path))
    Docs(collName, optIndex, data.take(n))

  // Intercept map used by for-yield comprehensions to record dependencies
  def map[B](f: DocPage[D] => B): IndexedSeq[B] =
    Templates.recordMultiDependency(data.map(_.path))
    data.map(f)

  def prevNext(
      doc: DocPage[D @uncheckedVariance]
  ): (Option[DocPage[D]], Option[DocPage[D]]) =
    val prev = if doc.idx > 0 then Some(self(doc.idx - 1)) else None
    val next =
      if doc.idx >= 0 && doc.idx < size - 1 then Some(self(doc.idx + 1))
      else None
    (prev, next)

  def foreach(op: DocPage[D] => Unit): Unit =
    Templates.recordMultiDependency(data.map(_.path))
    data.foreach(op)
  def toIterable: Iterable[DocPage[D]] =
    Templates.recordMultiDependency(data.map(_.path))
    data
