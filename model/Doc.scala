package model

final case class Doc(
  frontMatter: readData.md.Data,
  wordCount: Int,
  htmlPreview: String,
  htmlContent: String,
  index: Int,
)

class Docs[D <: Doc](data: IndexedSeq[D]):
  export data.{apply, size, map, foreach, take}

  def prevNext(doc: D): (Option[D], Option[D]) =
    val prev = if doc.index > 0 then Some(apply(doc.index - 1)) else None
    val next = if doc.index > 0 && doc.index < size - 1 then Some(apply(doc.index + 1)) else None
    (prev, next)