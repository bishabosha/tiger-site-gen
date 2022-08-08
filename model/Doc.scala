package model

final case class DocPage(
  name: String,
  frontMatter: io.util.md.Data,
  wordCount: Int,
  htmlPreview: String,
  htmlContent: String,
  private[model] val idx: Int,
)

sealed trait DocCollection[D <: DocPage]:
  def willRender: Boolean
  def index: D

class Doc[D <: DocPage](isIndex: Boolean, data: D) extends DocCollection[D]:
  export data.*
  def willRender: Boolean = isIndex
  def index: D = if isIndex then data else throw new NoSuchElementException()
  def page: D = data


class Docs[D <: DocPage](optIndex: Option[D], data: IndexedSeq[D]) extends DocCollection[D]:
  export data.{apply as page, size, map, foreach, take}

  def willRender: Boolean = optIndex.isDefined

  def index: D = optIndex.get

  def prevNext(doc: D): (Option[D], Option[D]) =
    val prev = if doc.idx > 0 then Some(page(doc.idx - 1)) else None
    val next = if doc.idx > 0 && doc.idx < size - 1 then Some(page(doc.idx + 1)) else None
    (prev, next)