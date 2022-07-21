//> using lib "com.vladsch.flexmark:flexmark-all:0.64.0"

package readData

import com.vladsch.flexmark.util.ast.Node
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet

import scala.jdk.CollectionConverters.given
import paths.curr
import com.vladsch.flexmark.ext.yaml.front.matter.YamlFrontMatterExtension
import com.vladsch.flexmark.ext.yaml.front.matter.AbstractYamlFrontMatterVisitor
import com.vladsch.flexmark.ext.attributes.AttributesExtension
import java.time.format.DateTimeFormatter
import java.time.LocalDate
import scala.util.control.NonFatal.apply
import scala.util.control.NonFatal
import com.vladsch.flexmark.util.ast.NodeVisitor
import com.vladsch.flexmark.util.ast.VisitHandler
import com.vladsch.flexmark.util.ast.Document
import com.vladsch.flexmark.ast.Paragraph
import com.vladsch.flexmark.ast.Text
import com.vladsch.flexmark.ast.Code

object paths:
  def curr(using model.SiteRoot) = summon[model.SiteRoot].root

  private[readData] def fetchDir(name: String)(using model.SiteRoot): IndexedSeq[os.Path] =
    os.list(curr / "_docs" / name)

  private[readData] def sortedDir(name: String)(using model.SiteRoot): IndexedSeq[(String, os.Path)] =
    fetchDir(name).map( p =>
      val s"$prefix - $suffix.md" = p.last
      (prefix, p)
    )
    .sortBy(_(0).toInt)(using Ordering.Int.reverse)

  private[readData] def singleton(name: String)(using model.SiteRoot): Option[os.Path] =
    fetchDir(name)
      .take(1)
      .headOption

object about:
  def first()(using model.SiteRoot) = paths.singleton("about")

object articles:
  def all()(using model.SiteRoot) = paths.sortedDir("articles")

object talks:
  def all()(using model.SiteRoot) = paths.sortedDir("talks")

object videos:
  def all()(using model.SiteRoot) = paths.sortedDir("videos")

object md:

  private val dateParser = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
  private val dateFormatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
  private val shortDateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
  private val yearFormatter = DateTimeFormatter.ofPattern("yyyy");

  private val (parser, renderer) =
    val options = MutableDataSet()
    val exts = List(
      AttributesExtension.create(),
      YamlFrontMatterExtension.create()
    )
    options.set(Parser.EXTENSIONS, exts.asJava)
    // uncomment to convert soft-breaks to hard breaks
    //options.set(HtmlRenderer.SOFT_BREAK, "<br />\n");
    val parser = Parser.builder(options).build()
    val renderer = HtmlRenderer.builder(options).build()
    (parser, renderer)

  def renderNow(): (String, String) =
    val now = LocalDate.now
    yearFormatter.format(now) -> shortDateFormatter.format(now)

  def renderDate(date: String): Option[String] =
    try Some(LocalDate.parse(date, dateParser).format(dateFormatter))
    catch case NonFatal(_) => None

  def renderShortDate(date: String): Option[String] =
    try Some(LocalDate.parse(date, dateParser).format(shortDateFormatter))
    catch case NonFatal(_) => None

  class Data(data: scala.collection.mutable.LinkedHashMap[String, List[String]]) extends Selectable:
    def selectDynamic(name: String): Any = name match
      case s"is$_" => data.contains(name)
      case s"${_}s" => data.get(name).getOrElse(Nil)
      case _ => data.get(name).flatMap(_.headOption).getOrElse("")

    override def toString(): String = data.toString


  object ContentSampler:

    def sampleContent(document: Document): (String, Int) =
      val sampler = Visitor()
      sampler.visitor.visit(document)
      val sample = sampler.sample
      (if sample == null then "" else sample, sampler.wordCount)

    private class Visitor:
      var wordCount = 0
      var sample: String | Null = null

      // example of visitor for a node or nodes, just add VisitHandlers<> to the list
      // any node type not handled by the visitor will default to visiting its children
      val visitor = NodeVisitor(
        VisitHandler(classOf[Text], visit(_)),
        VisitHandler(classOf[Paragraph], visit(_)),
      )

      def addCount(nextText: String) = wordCount += nextText.split("\\s+").length
      def read(node: Node) = node.getChars().unescape()

      def visit(text: Paragraph): Unit =
        val localSample = sample
        val nextText = read(text)
        if localSample == null then
          sample = nextText
        addCount(nextText)

      def visit(text: Text): Unit =
        addCount(read(text))
    end Visitor
  end ContentSampler

  def render(path: os.Path): model.Doc =
    val document = parser.parse(os.read(path))
    val data =
      val fmVisitor = AbstractYamlFrontMatterVisitor()
      fmVisitor.visit(document)
      Data(
        fmVisitor
          .getData()
          .asScala
          .to(scala.collection.mutable.LinkedHashMap)
          .map((k, vs) => k -> vs.asScala.toList)
      )

    val html = renderer.render(document)
    val (sample, wordCount) = ContentSampler.sampleContent(document)

    model.Doc(
      frontMatter = data,
      wordCount = wordCount,
      htmlPreview = sample,
      htmlContent = html
    )
