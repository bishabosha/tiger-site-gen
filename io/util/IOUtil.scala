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
import model.sctx
import scala.collection.mutable
import model.Context
import io.util.md.readDate

import scalanotation.Readers
import steps.result.Result.apply as result
import steps.result.Result.eval.{raise, ok}

import upickle.default.*
import steps.result.Result

case class Cache(files: Map[String, String], deps: Map[String, Set[String]]) derives ReadWriter
object Cache:
  def empty: Cache = Cache(Map.empty, Map.empty)
  def readFrom(path: os.Path): Cache =
    try upickle.default.read[Cache](os.read(path))
    catch case NonFatal(_) => empty

object sanatise:
  private val regex = raw"[:/()!?&*^$$#@,']".r

  def md5Hashed(path: os.Path): String =
    val bytes = os.read.bytes(path)
    val md = java.security.MessageDigest.getInstance("MD5")
    val digest = md.digest(bytes)
    digest.map("%02x".format(_)).mkString

  def mdNameToHtml(name: String) =
    mdNameToAnchor(name) + ".html"
  def mdNameToAnchor(name: String) =
    regex.replaceAllIn(name.replaceAll("[ .]", "-"), "").toLowerCase

  def readTime(wordCount: Int): String =
    val raw = wordCount / 200.0 // a "comfortable" speed for reading out loud.
    val time = math.max(math.round(raw), 1).toInt
    s"$time minute read"

object paths:

  def hashPath(path: os.Path): os.Path =
    val hashedSuffix = sanatise.md5Hashed(path)
    val hashedName = s"${path.baseName}_$hashedSuffix.${path.ext}"
    (path / os.up / hashedName)

  def resolveStaticAsset(relURL: String)(using model.SiteContext): String =
    relURL match
      case s"/static/$rest" =>
        sctx.site.optStatic match
          case Some(static) =>
            val path = os.Path(rest, static)
            // Record dependency on this static asset for the current page render, if enabled
            Templates.recordDependency(path)
            if os.exists(path) then
              val hashedPath = hashPath(path).relativeTo(static).toString
              s"/static/$hashedPath"
            else throw Exception(s"Static asset not found: $path")
          case None => throw Exception("No static directory found")
      case _ => throw Exception(s"Invalid static asset path: $relURL")

  def generateSiteWatch[T <: model.Theme](src: String, out: String, theme: T)(using
      model.SiteRoot
  ): Unit =
    // Use cache in watch mode; dependency tracking ensures selective re-render
    generateSite(src, out, theme, ignoreCache = false)
    println(s"watching for changes in root ${curr / src}")
    val watcher = os.watch.watch(
      Seq(curr / src),
      changeSet =>
        println(s"Changes detected in root ${curr / src}")
        // Always use cache; let dependency tracking re-render affected pages
        generateSite(src, out, theme, ignoreCache = false)
    )
    Thread.sleep(Long.MaxValue)
    sys.addShutdownHook(watcher.close())

  def generateSite[T <: model.Theme](
      src: String,
      out: String,
      theme: T,
      ignoreCache: Boolean
  )(using
      model.SiteRoot
  ): Unit =
    val dest = curr / out
    val cachePath = dest / ".cache"
    val cache =
      if !ignoreCache then Cache.readFrom(cachePath)
      else Cache.empty

    val allFiles = os.walk(curr / src).filter(os.isFile)

    val (changed, unchanged) = allFiles.partition(p =>
      val path = p.relativeTo(curr).toString
      val hash = sanatise.md5Hashed(p)
      cache.files.get(path).map(_ != hash).getOrElse(true)
    )

    val deleted =
      cache.files.keySet.map(p => os.Path(p, curr)).filterNot(p => os.exists(p))

    if changed.nonEmpty then println(s"Changed: ${changed.mkString("\n  ", "\n  ", "")}")
    if deleted.nonEmpty then println(s"Deleted: ${deleted.mkString("\n  ", "\n  ", "")}")

    // Determine which doc pages depend on any changed inputs (docs or static assets)
    val changedAbsPaths: Set[String] = changed.map(_.toString).toSet

    val dependentDocs: Set[os.Path] =
      cache.deps.collect {
        case (docPath, deps) if deps.exists(changedAbsPaths.contains) =>
          os.Path(docPath, curr)
      }.toSet

    if dependentDocs.nonEmpty then
      println(s"Dependent Docs: ${dependentDocs.mkString("\n  ", "\n  ", "")}")

    val changedWithDeps: Set[os.Path] = changed.toSet ++ dependentDocs

    given theme.Context = model.Context.fromTheme(curr / src, theme)
    // Render and collect dependencies for pages that were re-rendered
    val depsFromRender: Map[String, Set[String]] = renderSite(
      dest,
      theme,
      changedWithDeps,
      deleted.map(_.relativeTo(curr).toString)
    )

    // Merge dependency maps: keep previous except for deleted or re-rendered pages
    val replacedKeys: Set[String] = depsFromRender.keySet
    val deletedKeys: Set[String] =
      deleted.map(_.relativeTo(curr).toString).toSet
    val prevDepsKept: Map[String, Set[String]] =
      cache.deps -- deletedKeys -- replacedKeys
    val mergedDeps: Map[String, Set[String]] = prevDepsKept ++ depsFromRender

    val newCache = Cache(
      files = (changed ++ unchanged)
        .map(p => p.relativeTo(curr).toString -> sanatise.md5Hashed(p))
        .toMap,
      deps = mergedDeps
    )
    os.write.over(cachePath, upickle.default.write(newCache))

  def buildSiteDb(
      src: os.Path,
      theme: model.Theme
  )(using model.SiteRoot): model.Site[theme.SiteMap] =
    val (roots, files) = os.list(src).partition(os.isDir)
    val optFavicon = files.find(_.last == "favicon.ico")
    val (statics, colls) = roots.partition(_.baseName == "static")
    val data: Map[String, model.DocCollection[?, ?]] =
      colls
        .flatMap(r =>
          val paths =
            os.list(r)
              .filter(os.isFile)
              .filter(p => p.ext == "md" || p.ext == "html")
          val name = r.baseName
          theme.siteMap.get(name) match
            case Some(doc: model.SiteMapSchema.DocsSpec[i, t]) =>
              given scalanotation.Reader[i] = doc.evI
              given scalanotation.Reader[t] = doc.evA
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
                .map { case ((n, p), i) =>
                  md.render[t](i, n, p, theme)
                }
              val indexOpt =
                indexes.headOption.map { case (_, n, p) =>
                  md.render[i](-1, n, p, theme)
                }
              Some(name -> model.Docs[i, t](name, indexOpt, rendered))
            case Some(doc: model.SiteMapSchema.DocSpec[t]) =>
              given scalanotation.Reader[t] = doc.ev
              val path = paths.head
              val pName = path.baseName
              Some(
                name -> model
                  .Doc[t](
                    name,
                    md.render[t](-1, pName, paths.head, theme)
                  )
              )
            case _ => None
        )
        .toMap
    model.Site.read(statics.headOption, optFavicon, data)

  def renderSite(
      dest: os.Path,
      theme: model.Theme,
      changed: Set[os.Path],
      deleted: Set[String]
  )(using theme.Context, model.SiteRoot): Map[String, Set[String]] = {
    val deps = mutable.Map[String, Set[String]]()

    deleted.foreach { p =>
      val path = os.Path(p, curr)
      if path.ext == "md" then
        val collection = path.segments.toSeq.dropRight(1).last
        val htmlFile = sanatise.mdNameToHtml(path.baseName)
        os.remove(dest / collection / htmlFile)
    }

    val activeCols = ctx.site.allDocs.collect {
      case col if col.willRender => col
    }
    var optRoots = Set.empty[model.AnyDocCollection]
    for col <- activeCols do
      given model.AnyDocCollection = col
      os.makeDir.all(dest / col.collName)
      val colMeta = theme.siteMapMeta._query(col.collName)
      if colMeta.isRoot then optRoots += col
      colMeta match
        case spec: model.SiteMapMeta.DocsData[theme.Context, i0, d0] =>
          spec.optPageLayout match
            case Some(fn) =>
              for doc <- col do
                val d0 = doc.asInstanceOf[model.DocPage[d0]]
                fn(d0) match
                  case Result.Ok(Some(layout)) if changed.contains(doc.path) =>
                    val (subPage, usedDeps) = Templates.withDependencyCollection {
                      layout.run(d0)
                    }
                    os.write.over(
                      dest / col.collName / sanatise.mdNameToHtml(doc.name),
                      scalatags.Text.all.doctype("html")(subPage)
                    )
                    deps += (doc.path.relativeTo(curr).toString -> usedDeps)
                  case Result.Ok(_)  => // skip unchanged pages or those without a layout
                  case Result.Err(e) => throw e
              end for
            case _ => // skip docs without a layout
          spec.optIndexLayout match
            case Some(fn) =>
              if changed.contains(col.index.path) then
                val i0 = col.index.asInstanceOf[model.DocPage[i0]]
                val ilayout =
                  fn(i0) match
                    case Result.Ok(Some(layout)) => layout
                    case Result.Ok(None)         =>
                      throw AssertionError(
                        s"index page ${col.index.path} must have a layout"
                      )
                    case Result.Err(e) => throw e
                val (indexPage, usedDeps) = Templates.withDependencyCollection {
                  ilayout.run(i0)
                }
                os.write.over(
                  dest / col.collName / "index.html",
                  scalatags.Text.all.doctype("html")(indexPage)
                )
                deps += (col.index.path.relativeTo(curr).toString -> usedDeps)
              end if
            case _ => // skip docs without a layout
      end match
    end for
    assert(optRoots.sizeIs <= 1, "more than one root")
    for rootCol <- optRoots.headOption do
      os.write.over(
        dest / "index.html",
        io.util.paths.rootPage(redirect = s"/${rootCol.collName}/")
      )
    for static <- ctx.site.optStatic do
      os.makeDir.all(dest / "static")
      os.walk.stream(static).foreach { p =>
        val rel = p.relativeTo(static)
        val destStatic = dest / "static"
        val destPath = destStatic / rel
        if os.isDir(p) then os.makeDir.all(destPath)
        else {
          if p.ext == "css" || p.ext == "js" then
            val hashedDest = destStatic / hashPath(p).relativeTo(static)
            os.copy.over(p, hashedDest)
          else os.copy.over(p, destPath)
        }

      }
    for favicon <- ctx.site.optFavicon do
      os.copy.over(
        favicon,
        dest / "favicon.ico"
      )

    deps.toMap
  }

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
    options.set(HtmlRenderer.GENERATE_HEADER_ID, true)
    options.set(Parser.EXTENSIONS, exts.asJava)
    options.set(AnchorLinkExtension.ANCHORLINKS_WRAP_TEXT, false)
    options.set(AnchorLinkExtension.ANCHORLINKS_SET_ID, true)
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
        val title = heading.getText().unescape()
        val anchor = sanatise.mdNameToAnchor(title)
        headings += ((title, anchor, heading.getLevel()))

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

  def parseDryRun(document: String, theme: model.Theme): Document =
    parser.parse(Templates.interpolateDefault(document, theme))

  def render[T: scalanotation.Reader](
      index: Int,
      name: String,
      path: os.Path,
      theme: model.Theme
  ): model.DocPage[T] =
    import org.virtuslab.yaml.*
    def frontMatterError(msg: String): Nothing =
      throw new Exception(s"failed to read front matter of $path:$msg")
    val rawText = os.read(path)
    val (rawSON, rawDoc) =
      rawText.match
        case s"---\n```scala\n$son\n```\n---\n$rest" => (son, rest)
        case s"```scala\n$son\n```\n---\n$rest"      => (son, rest)
        case _                                       => frontMatterError(" no front matter found")

    val documentNoSplices = parseDryRun(rawDoc, theme)
    val data: T = Readers.readAs[T](rawSON) match
      case Result.Ok(value)  => value
      case Result.Err(error) => frontMatterError(error.format)
    val (sample, wordCount, headings) =
      ContentSampler.sampleContent(documentNoSplices)

    model.DocPage(
      name = name,
      path = path,
      frontMatter = data,
      wordCount = wordCount,
      headings = headings,
      htmlPreview = sample,
      rawContent = rawDoc,
      idx = index
    )
