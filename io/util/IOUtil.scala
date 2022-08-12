//> using lib "com.vladsch.flexmark:flexmark-all:0.64.0"

package io.util

import com.vladsch.flexmark.util.ast.Node
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet

import scala.jdk.CollectionConverters.given
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

import model.curr
import model.ctx
import scala.collection.mutable

object sanatise:
  private val regex = raw"[!?&*^$$#@]".r

  def mdNameToHtml(name: String) =
    regex.replaceAllIn(name.replace(" ", "-"), "").toLowerCase + ".html"

  def readTime(wordCount: Int): String =
    val raw = wordCount / 200.0 // a "comfortable" speed for reading out loud.
    val time = math.max(math.round(raw), 1).toInt
    s"$time minute read"

object paths:

  def generateSite[T <: model.Theme](src: String, out: String, theme: T)(using model.SiteRoot): Unit =
    given theme.Context = model.Context.fromTheme(curr / src, theme)
    renderSite(curr / out, theme)

  def buildSiteDb[S <: model.Site](src: os.Path)(using model.SiteRoot): S =
    val roots = os.list(src).filter(os.isDir)
    val (statics, colls) = roots.partition(_.baseName == "static")
    val data: Map[String, model.Doc[?] | model.Docs[?]] = colls.map(r =>
      val paths = os.list(r).filter(os.isFile).filter(_.ext == "md")
      val name = r.baseName
      if name.endsWith("s") then
        val triples = paths.map(p =>
          val s"$prefix - $suffix.md" = p.last
          (prefix.toInt, suffix, p)
        )
        val (indexes, docs) = triples.partition((_, n, _) => n == "index")
        assert(indexes.sizeIs <= 1, "more than 1 index file")
        val ordered = docs
          .sortBy((i, _, _) => i)(using Ordering.Int.reverse)
          .map(_.tail)
        val rendered = ordered
          .zipWithIndex
          .map { case ((n, p), i) => md.render(i, n, p) }
        val indexOpt = indexes.headOption.map { case (_, n, p) => md.render(-1, n, p) }
        name -> model.Docs(name, indexOpt, rendered)
      else
        val path = paths.head
        val pName = path.baseName
        name -> model.Doc(name, pName == "index", md.render(-1, pName, paths.head))
    ).toMap
    model.Site.read(statics.headOption, data)

  def renderSite(dest: os.Path, theme: model.Theme)(using theme.Context): Unit =
    os.remove.all(dest)
    val activeCols = ctx.site.allDocs.collect {
      case col: theme.DocCollection @unchecked if col.willRender => col
    }
    var optRoots = Set.empty[theme.DocCollection]
    for col <- activeCols do
      os.makeDir.all(dest / col.collName)
      if col.index.frontMatter.isRoot then
        optRoots += col
      for doc <- col do
        val subPage = theme.metadata.layouts(doc.frontMatter.layout)(doc)
        os.write(
          dest / col.collName / sanatise.mdNameToHtml(doc.name),
          scalatags.Text.all.doctype("html")(subPage)
        )
      val indexPage = theme.metadata.layouts(col.index.frontMatter.layout)(col.index)
      os.write(
        dest / col.collName / "index.html",
        scalatags.Text.all.doctype("html")(indexPage)
      )
    end for
    assert(optRoots.sizeIs <= 1, "more than one root")
    for rootCol <- optRoots.headOption do
      os.write(
        dest / "index.html",
        io.util.paths.rootPage(redirect = s"${rootCol.collName}/index.html")
      )
    for static <- ctx.site.optStatic do
      os.copy(
        static,
        dest / "static"
      )
  end renderSite

  def rootPage(redirect: String): scalatags.Text.all.doctype =
    import scalatags.Text.all.*
    doctype("html")(
      html(
        head(
          meta(httpEquiv := "refresh", content := s"0; URL=$redirect"),
        )
      )
    )

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
          val md = parser.parse(nextText)
          val text = new mutable.StringBuilder()
          val pvisitor = NodeVisitor(
            VisitHandler(classOf[Paragraph], p => p.getChildren().forEach(c => text ++= renderer.render(c))),
          )
          pvisitor.visit(md)
          sample = text.toString
        addCount(nextText)

      def visit(text: Text): Unit =
        addCount(read(text))
    end Visitor
  end ContentSampler

  def render(index: Int, name: String, path: os.Path): model.DocPage =
    val document = parser.parse(os.read(path))
    val data =
      val fmVisitor = AbstractYamlFrontMatterVisitor()
      fmVisitor.visit(document)
      val entries =
        fmVisitor
          .getData()
          .asScala
          .to(scala.collection.mutable.LinkedHashMap)
          .map((k, vs) => k -> vs.asScala.toList)
      model.FrontMatter(entries)

    val html = renderer.render(document)
    val (sample, wordCount) = ContentSampler.sampleContent(document)

    model.DocPage(
      name = name,
      frontMatter = data,
      wordCount = wordCount,
      htmlPreview = sample,
      htmlContent = html,
      idx = index,
    )
