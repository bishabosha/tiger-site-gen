package model

final case class DocPage(
  name: String,
  frontMatter: FrontMatter,
  wordCount: Int,
  htmlPreview: String,
  htmlContent: String,
  private[model] val idx: Int,
)

sealed trait DocCollection[D <: DocPage]:
  def collName: String
  def willRender: Boolean
  def index: D
  def foreach(op: D => Unit): Unit

class Doc[D <: DocPage](val collName: String, isIndex: Boolean, data: D) extends DocCollection[D]:
  export data.*
  def willRender: Boolean = isIndex
  def index: D = if isIndex then data else throw new NoSuchElementException()
  def page: D = data
  def foreach(op: D => Unit): Unit = if isIndex then () else op(data)


class Docs[D <: DocPage](val collName: String, optIndex: Option[D], data: IndexedSeq[D]) extends DocCollection[D]:
  export data.{apply as page, size, map, take}

  def willRender: Boolean = optIndex.isDefined

  def index: D = optIndex.get

  def prevNext(doc: D): (Option[D], Option[D]) =
    val prev = if doc.idx > 0 then Some(page(doc.idx - 1)) else None
    val next = if doc.idx >= 0 && doc.idx < size - 1 then Some(page(doc.idx + 1)) else None
    (prev, next)

  def foreach(op: D => Unit): Unit = data.foreach(op)
