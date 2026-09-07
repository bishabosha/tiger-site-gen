package model

import io.util.Templates
import scala.annotation.unchecked.uncheckedVariance

/** One document, whether selected directly or through a collection.
  * Content reads retain dependency tracking even when a document is held in extras.
  */
final class Doc[+Data] private (
    private val nameValue: String,
    private val pathValue: os.Path,
    private val outputPathValue: os.RelPath,
    private val frontMatterValue: Data,
    private val wordCountValue: Int,
    private val headingsValue: List[(String, String, Int)],
    private val htmlPreviewValue: String,
    private val rawContentValue: String,
    private[model] val idx: Int
) extends ContentNode:
  def atIndex(index: Int): Doc[Data] =
    if index == idx then this
    else new Doc(nameValue, pathValue, outputPathValue, frontMatterValue,
      wordCountValue, headingsValue, htmlPreviewValue, rawContentValue, index)

  private def read[A](value: A): A =
    Templates.recordDependency(pathValue)
    value
  def name: String = read(nameValue)
  def path: os.Path = read(pathValue)
  def sourcePath: os.Path = path
  def outputPath: os.RelPath = read(outputPathValue)
  def frontMatter: Data = read(frontMatterValue)
  def wordCount: Int = read(wordCountValue)
  def headings: List[(String, String, Int)] = read(headingsValue)
  def htmlPreview: String = read(htmlPreviewValue)
  def rawContent: String = read(rawContentValue)
  def url: String =
    if outputPath.last == "index.html" then
      "/" + outputPath.segments.dropRight(1).mkString("/") + (if outputPath.segments.size > 1 then "/" else "")
    else "/" + outputPath.toString

object Doc:
  def apply[A](
      name: String,
      path: os.Path,
      outputPath: os.RelPath,
      frontMatter: A,
      wordCount: Int,
      headings: List[(String, String, Int)],
      htmlPreview: String,
      rawContent: String,
      idx: Int
  ): Doc[A] =
    new Doc(name, path, outputPath, frontMatter, wordCount, headings, htmlPreview, rawContent, idx)

  opaque type View[D] <: Doc[D] = Doc[D]
  object View:
    def apply[D](doc: Doc[D]): View[D] = doc

  trait Conforms[Data, BaseType]:
    def toBase(doc: Doc[Data]): View[BaseType]
  object Conforms:
    given [Data, BaseType](using ev: Data <:< BaseType): Conforms[
      Data,
      BaseType
    ] with {
      def toBase(doc: Doc[Data]): View[BaseType] = View(
        ev.liftCo(doc)
      )
    }
  trait ConformsAll[Layouts <: Tuple, BaseType]
  object ConformsAll:
    given [BaseType]: ConformsAll[EmptyTuple, BaseType]()
    given [H, T <: Tuple, BaseType](using
        evH: Conforms[H, BaseType],
        ev: ConformsAll[T, BaseType]
    ): ConformsAll[
      H *: T,
      BaseType
    ]()


/** A physical source node; projections preserve its source and output paths. */
sealed trait ContentNode:
  def sourcePath: os.Path
  def outputPath: os.RelPath
  def url: String

class Directory[T <: NamedTuple.AnyNamedTuple](
    val sourcePath: os.Path,
    val outputPath: os.RelPath,
    val children: Site[T]
) extends ContentNode, Selectable:
  type Fields = T
  def selectDynamic(name: String): ContentNode = children.selectDynamic(name)
  def url: String = if outputPath.segments.isEmpty then "/" else "/" + outputPath.toString + "/"

sealed abstract class DocumentCollection[+D](
    val sourcePath: os.Path,
    val outputPath: os.RelPath,
    data: IndexedSeq[Doc[D]]
) extends ContentNode:
  self =>
  def url: String = if outputPath.segments.isEmpty then "/" else "/" + outputPath.toString + "/"
  private def record(taken: Int = -1, idx: Int = -1): Unit =
    Templates.recordDependency(sourcePath)
    if idx >= 0 then Templates.recordDependency(data(idx).path)
    else
      val data0 = if taken >= 0 then data.take(taken) else data
      Templates.recordMultiDependency(data0.map(_.path))
  def size: Int =
    record()
    data.size
  def apply(idx: Int): Doc[D] =
    record(idx = idx)
    data(idx)
  protected def takeData(n: Int): IndexedSeq[Doc[D]] =
    record(taken = n)
    data.take(n)
  def take(n: Int): DocumentCollection[D]
  def map[B](f: Doc[D] => B): IndexedSeq[B] =
    record()
    data.map(f)
  def prevNext(doc: Doc[D @uncheckedVariance]): (Option[Doc[D]], Option[Doc[D]]) =
    val prev = if doc.idx > 0 then Some(self(doc.idx - 1)) else None
    val next = if doc.idx >= 0 && doc.idx < size - 1 then Some(self(doc.idx + 1)) else None
    (prev, next)
  def foreach(op: Doc[D] => Unit): Unit =
    record()
    data.foreach(op)
  def toIterable: Iterable[Doc[D]] =
    record()
    data


/** A homogeneous collection in its own named subdirectory. */
final class Docs[+D](source: os.Path, output: os.RelPath, data: IndexedSeq[Doc[D]])
    extends DocumentCollection[D](source, output, data):
  def take(n: Int): Docs[D] = Docs(sourcePath, outputPath, takeData(n))

/** Remaining numbered documents beside the directory's declared singleton documents. */
final class VarArgDocs[+D](source: os.Path, output: os.RelPath, data: IndexedSeq[Doc[D]])
    extends DocumentCollection[D](source, output, data):
  def take(n: Int): VarArgDocs[D] = VarArgDocs(sourcePath, outputPath, takeData(n))
