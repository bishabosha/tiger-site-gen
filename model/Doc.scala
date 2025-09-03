package model

import com.vladsch.flexmark.util.ast.Document
import io.util.Templates

final case class DocPage(
    name: String,
    path: os.Path,
    frontMatter: FrontMatter,
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

class Doc[D <: DocPage](val collName: String, isIndex: Boolean, data: D)
    extends DocCollection[D]:
  export data.*
  def willRender: Boolean = isIndex
  def index: D = if isIndex then data else throw new NoSuchElementException()
  def page: D = data
  def foreach(op: D => Unit): Unit =
    if isIndex then ()
    else
      Templates.recordDocDependency(data.path)
      op(data)
  def toIterable: Iterable[D] =
    if isIndex then Iterable.empty
    else
      Templates.recordDocDependency(data.path)
      Option.when(!isIndex)(data)

class Docs[D <: DocPage](
    val collName: String,
    optIndex: Option[D],
    data: IndexedSeq[D]
) extends DocCollection[D]:
  export data.{apply as page, size}

  def willRender: Boolean = optIndex.isDefined

  def index: D = optIndex.get

  def take(n: Int): Docs[D] =
    Templates.recordDocsDependency(data.take(n).map(_.path))
    Docs(collName, optIndex, data.take(n))

  // Intercept map used by for-yield comprehensions to record dependencies
  def map[B](f: D => B): IndexedSeq[B] =
    Templates.recordDocsDependency(data.map(_.path))
    data.map(f)

  def prevNext(doc: D): (Option[D], Option[D]) =
    val prev = if doc.idx > 0 then Some(page(doc.idx - 1)) else None
    val next =
      if doc.idx >= 0 && doc.idx < size - 1 then Some(page(doc.idx + 1))
      else None
    (prev, next)

  def foreach(op: D => Unit): Unit =
    Templates.recordDocsDependency(data.map(_.path))
    data.foreach(op)
  def toIterable: Iterable[D] =
    Templates.recordDocsDependency(data.map(_.path))
    data
