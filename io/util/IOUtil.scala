package io.util

import com.vladsch.flexmark.util.ast.Node
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.data.MutableDataSet

import scala.compiletime.asMatchable

import scala.jdk.CollectionConverters.given
import com.vladsch.flexmark.ext.attributes.AttributesExtension

import com.vladsch.flexmark.ext.gitlab.GitLabExtension
import com.vladsch.flexmark.ext.anchorlink.AnchorLinkExtension
import com.vladsch.flexmark.ext.admonition.AdmonitionExtension
import com.vladsch.flexmark.ext.superscript.SuperscriptExtension
import com.vladsch.flexmark.ext.tables.TablesExtension
import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension

import java.time.format.DateTimeFormatter
import java.time.LocalDate
import scala.util.control.NonFatal.apply
import scala.util.control.NonFatal
import com.vladsch.flexmark.util.ast.NodeVisitor
import com.vladsch.flexmark.util.ast.VisitHandler
import com.vladsch.flexmark.util.ast.Document
import com.vladsch.flexmark.ast.Paragraph
import com.vladsch.flexmark.ast.Text
import com.vladsch.flexmark.ast.Heading

import model.curr
import model.ctx
import scala.collection.mutable
import model.Context

object sanatise:
  private val regex = raw"[!?&*^$$#@,]".r

  def md5Hashed(path: os.Path): String =
    val bytes = os.read.bytes(path)
    val md = java.security.MessageDigest.getInstance("MD5")
    val digest = md.digest(bytes)
    digest.map("%02x".format(_)).mkString

  def mdNameToHtml(name: String) =
    regex.replaceAllIn(name.replaceAll("[ .]", "-"), "").toLowerCase + ".html"

  def readTime(wordCount: Int): String =
    val raw = wordCount / 200.0 // a "comfortable" speed for reading out loud.
    val time = math.max(math.round(raw), 1).toInt
    s"$time minute read"

object paths:

  def hashPath(path: os.Path): os.Path =
    val hashedSuffix = sanatise.md5Hashed(path)
    val hashedName = s"${path.baseName}_$hashedSuffix.${path.ext}"
    (path / os.up / hashedName)

  def resolveStaticAsset(relURL: String)(using model.Context): String =
    relURL match
      case s"/static/$rest" =>
        ctx.site.optStatic match
          case Some(static) =>
            val path = os.Path(rest, static)
            if os.exists(path) then
              val hashedPath = hashPath(path).relativeTo(static).toString
              s"/static/$hashedPath"
            else throw Exception(s"Static asset not found: $path")
          case None => throw Exception("No static directory found")
      case _ => throw Exception(s"Invalid static asset path: $relURL")

  def generateSite[T <: model.Theme](src: String, out: String, theme: T)(using
      model.SiteRoot
  ): Unit =
    given theme.Context = model.Context.fromTheme(curr / src, theme)
    renderSite(curr / out, theme)

  def buildSiteDb[S <: model.Site](src: os.Path)(using model.SiteRoot): S =
    val (roots, files) = os.list(src).partition(os.isDir)
    val optFavicon = files.find(_.last == "favicon.ico")
    val (statics, colls) = roots.partition(_.baseName == "static")
    val data: Map[String, model.Doc[?] | model.Docs[?]] = colls
      .map(r =>
        val paths =
          os.list(r)
            .filter(os.isFile)
            .filter(p => p.ext == "md" || p.ext == "html")
        val name = r.baseName
        if name.endsWith("s") then
          val triples = paths.map(p =>
            val s"$prefix - $suffix.md" = p.last: @unchecked
            (prefix.toInt, suffix, p)
          )
          val (indexes, docs) = triples.partition((_, n, _) => n == "index")
          assert(indexes.sizeIs <= 1, "more than 1 index file")
          val ordered = docs
            .sortBy((i, _, _) => i)(using Ordering.Int.reverse)
            .map(_.tail)
          val rendered = ordered.zipWithIndex
            .map { case ((n, p), i) => md.render(i, n, p) }
          val indexOpt =
            indexes.headOption.map { case (_, n, p) => md.render(-1, n, p) }
          name -> model.Docs(name, indexOpt, rendered)
        else
          val path = paths.head
          val pName = path.baseName
          name -> model
            .Doc(name, pName == "index", md.render(-1, pName, paths.head))
      )
      .toMap
    model.Site.read(statics.headOption, optFavicon, data)

  def renderSite(dest: os.Path, theme: model.Theme)(using theme.Context): Unit =
    os.remove.all(dest)
    val activeCols = ctx.site.allDocs.collect {
      case col: theme.DocCollection @unchecked if col.willRender => col
    }
    var optRoots = Set.empty[theme.DocCollection]
    for col <- activeCols do
      given theme.DocCollection = col
      os.makeDir.all(dest / col.collName)
      if col.index.frontMatter.isRoot then optRoots += col
      if !col.index.frontMatter.isIndexOnly then
        for doc <- col do
          val subPage = theme.metadata.layouts(doc.frontMatter.layout)(doc)
          os.write(
            dest / col.collName / sanatise.mdNameToHtml(doc.name),
            scalatags.Text.all.doctype("html")(subPage)
          )
        end for
      val indexPage =
        theme.metadata.layouts(col.index.frontMatter.layout)(col.index)
      os.write(
        dest / col.collName / "index.html",
        scalatags.Text.all.doctype("html")(indexPage)
      )
    end for
    assert(optRoots.sizeIs <= 1, "more than one root")
    for rootCol <- optRoots.headOption do
      os.write(
        dest / "index.html",
        io.util.paths.rootPage(redirect = s"/${rootCol.collName}/")
      )
    for static <- ctx.site.optStatic do
      os.makeDir(dest / "static")
      os.walk.stream(static).foreach { p =>
        val rel = p.relativeTo(static)
        val destStatic = dest / "static"
        val destPath = destStatic / rel
        if os.isDir(p) then os.makeDir(destPath)
        else {
          if p.ext == "css" || p.ext == "js" then
            val hashedDest = destStatic / hashPath(p).relativeTo(static)
            os.copy(p, hashedDest)
          else os.copy(p, destPath)
        }
      }
    for favicon <- ctx.site.optFavicon do
      os.copy(
        favicon,
        dest / "favicon.ico"
      )
  end renderSite

  def rootPage(redirect: String): scalatags.Text.all.doctype =
    import scalatags.Text.all.*
    doctype("html")(
      html(
        head(
          meta(httpEquiv := "refresh", content := s"0; URL=$redirect")
        )
      )
    )

object md:

  private val dateParser = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
  private val dateFormatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
  private val shortDateFormatter = DateTimeFormatter.ofPattern("dd/MMM/yyyy");
  private val yearFormatter = DateTimeFormatter.ofPattern("yyyy");
  private val monthYearFormatter = DateTimeFormatter.ofPattern("MMM/yyyy");

  private val (parser, renderer) =
    val options = MutableDataSet()
    val exts = List(
      AttributesExtension.create(),
      GitLabExtension.create(),
      AnchorLinkExtension.create(),
      AdmonitionExtension.create(),
      SuperscriptExtension.create(),
      TablesExtension.create(),
      StrikethroughExtension.create()
    )
    options.set(Parser.EXTENSIONS, exts.asJava)
    options.set(AnchorLinkExtension.ANCHORLINKS_WRAP_TEXT, false)
    options.set(
      AnchorLinkExtension.ANCHORLINKS_TEXT_SUFFIX,
      """<i class="fa-solid fa-link"></i>"""
    )
    options.set(
      AnchorLinkExtension.ANCHORLINKS_ANCHOR_CLASS,
      """anchor-link anchor-link__source"""
    )
    options.set(TablesExtension.COLUMN_SPANS, false)
    options.set(TablesExtension.APPEND_MISSING_COLUMNS, true)
    options.set(TablesExtension.DISCARD_EXTRA_COLUMNS, true)
    options.set(TablesExtension.HEADER_SEPARATOR_COLUMN_MATCH, true)
    options.set(TablesExtension.CLASS_NAME, "article-table")
    // uncomment to convert soft-breaks to hard breaks
    // options.set(HtmlRenderer.SOFT_BREAK, "<br />\n");
    val parser = Parser.builder(options).build()
    val renderer = HtmlRenderer.builder(options).build()
    (parser, renderer)

  def renderNow(): (String, String) =
    val now = LocalDate.now
    yearFormatter.format(now) -> shortDateFormatter.format(now)

  def readDate(date: String): Option[LocalDate] =
    try Some(LocalDate.parse(date, dateParser))
    catch case NonFatal(_) => None

  def renderDate(date: String): Option[String] =
    readDate(date).map(_.format(dateFormatter))

  def renderShortDate(date: String): Option[String] =
    readDate(date).map(_.format(shortDateFormatter))

  def renderMonthYear(date: String): Option[String] =
    readDate(date).map(_.format(monthYearFormatter))

  object ContentSampler:

    def sampleContent(
        document: Document
    ): (String, Int, List[(String, String, Int)]) =
      val sampler = Visitor()
      sampler.visitor.visit(document)
      val sample = sampler.sample
      (
        if sample == null then "" else sample,
        sampler.wordCount,
        sampler.headings.result()
      )

    private class Visitor:
      var wordCount = 0
      var sample: String | Null = null
      var headings = List.newBuilder[(String, String, Int)]

      // example of visitor for a node or nodes, just add VisitHandlers<> to the list
      // any node type not handled by the visitor will default to visiting its children
      val visitor = NodeVisitor(
        VisitHandler(classOf[Text], visit(_)),
        VisitHandler(classOf[Paragraph], visit(_)),
        VisitHandler(classOf[Heading], visit(_))
      )

      def addCount(nextText: String) =
        wordCount += nextText.split("\\s+").length
      def read(node: Node) = node.getChars().unescape()

      def visit(heading: Heading): Unit =
        headings += ((
          heading.getText().unescape(),
          heading.getAnchorRefId(),
          heading.getLevel()
        ))

      def visit(text: Paragraph): Unit =
        val localSample = sample
        val nextText = read(text)
        if localSample == null then
          val md = parser.parse(nextText)
          val innerHTML = new java.lang.StringBuilder()
          val pvisitor = NodeVisitor(
            VisitHandler(
              classOf[Paragraph],
              p =>
                p.getChildren()
                  .forEach(c => innerHTML.append(renderer.render(c)))
            )
          )
          pvisitor.visit(md)
          sample = innerHTML.toString()
        addCount(nextText)

      def visit(text: Text): Unit =
        addCount(read(text))
    end Visitor
  end ContentSampler

  def renderDoc(document: String)(using Context): String =
    renderer.render(parser.parse(renderRaw(document)))
  def renderRaw(document: String)(using Context): String =
    Templates.interpolate(document)

  def parseDryRun(document: String): Document =
    parser.parse(Templates.interpolateDefault(document))

  def render(index: Int, name: String, path: os.Path): model.DocPage =
    import org.virtuslab.yaml.*
    val rawText = os.read(path)
    val (rawYaml, rawDoc) =
      rawText.split("---", 3) match
        case Array("", yaml, doc) => (yaml, doc)
        case Array(yaml, doc)     => (yaml, doc)
        case _                    => ("", rawText)
    val documentNoSplices = parseDryRun(rawDoc)
    val yaml = rawYaml.as[Any]
    // TODO: ugly rewrapping as List of strings - todo: rework representation of front matter.
    // changed to virtuslab scala-yaml due to a superior parser.
    val data: model.FrontMatter = yaml match
      case Left(error) =>
        throw error
      case Right(data) =>
        data.asMatchable match
          case m: Map[k, vs] =>
            val allStrKeys = m.keys.forall({
              case _: String => true
              case _         => false
            })
            val allListableVals = m.values.forall({
              case vs: List[t] =>
                vs.forall({
                  case _: String  => true
                  case _: Boolean => true
                  case _          => false
                })
              case _: String  => true
              case None       => true
              case _: Boolean => true
              case _          => false
            })
            if allStrKeys && allListableVals then
              model.FrontMatter(m.view.map { case (k, vs) =>
                k.asInstanceOf[String] -> (vs.match {
                  case vs1: List[t] => vs1.map(_.toString())
                  case v: String    => v :: Nil
                  case None         => Nil
                  case v: Boolean   => v.toString() :: Nil
                })
              }.toMap)
            else throw new Exception(s"Invalid front matter $m")
          case _ => throw new Exception(s"Invalid front matter $data")

    val (sample, wordCount, headings) =
      ContentSampler.sampleContent(documentNoSplices)

    model.DocPage(
      name = name,
      frontMatter = data,
      wordCount = wordCount,
      headings = headings,
      htmlPreview = sample,
      rawContent = rawDoc,
      idx = index
    )
