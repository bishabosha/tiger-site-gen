package model

import com.vladsch.flexmark.util.ast.Document
import io.util.Templates

final case class DocPage(
    name: String,
    path: os.Path,
    frontMatter: Dictionary,
    wordCount: Int,
    headings: List[(String, String, Int)],
    htmlPreview: String,
    rawContent: String,
    private[model] val idx: Int
)

sealed trait DocCollection[D <: DocPage]:
  def collName: String
  def willRender: Boolean
  def index: D
  def foreach(op: D => Unit): Unit
  def toIterable: Iterable[D]

class Doc[D <: DocPage](val collName: String, _index: D)
    extends DocCollection[D]:
  def willRender: Boolean = true
  def index: D =
    Templates.recordDependency(_index.path)
    _index
  def foreach(op: D => Unit): Unit =
    Templates.recordDependency(_index.path)
    op(_index)
  def toIterable: Iterable[D] = Iterable.empty

class Docs[D <: DocPage](
    val collName: String,
    optIndex: Option[D],
    data: IndexedSeq[D]
) extends DocCollection[D]:
  self =>
  export data.size

  def apply(idx: Int): D =
    Templates.recordDependency(data(idx).path)
    data(idx)

  def willRender: Boolean = optIndex.isDefined

  def index: D = optIndex.get

  def take(n: Int): Docs[D] =
    Templates.recordMultiDependency(data.take(n).map(_.path))
    Docs(collName, optIndex, data.take(n))

  // Intercept map used by for-yield comprehensions to record dependencies
  def map[B](f: D => B): IndexedSeq[B] =
    Templates.recordMultiDependency(data.map(_.path))
    data.map(f)

  def prevNext(doc: D): (Option[D], Option[D]) =
    val prev = if doc.idx > 0 then Some(self(doc.idx - 1)) else None
    val next =
      if doc.idx >= 0 && doc.idx < size - 1 then Some(self(doc.idx + 1))
      else None
    (prev, next)

  def foreach(op: D => Unit): Unit =
    Templates.recordMultiDependency(data.map(_.path))
    data.foreach(op)
  def toIterable: Iterable[D] =
    Templates.recordMultiDependency(data.map(_.path))
    data
