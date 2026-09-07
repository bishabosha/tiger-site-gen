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
  case class FileVersion(
      size: Long,
      modified: java.nio.file.attribute.FileTime,
      created: java.nio.file.attribute.FileTime,
      fileKey: Any
  )
  def fileVersion(path: os.Path): FileVersion =
    val stat = java.nio.file.Files
      .readAttributes(path.toNIO, classOf[java.nio.file.attribute.BasicFileAttributes])
    FileVersion(stat.size, stat.lastModifiedTime, stat.creationTime, stat.fileKey)

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
  private val fileHashes = new model.BuildSession.Cache[os.Path, (sanatise.FileVersion, String)]

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
    val session = new model.BuildSession
    generateSite(src, out, theme, ignoreCache = false, session = session)
    println(s"watching for changes in root ${curr / src}")
    val watcher = os.watch.watch(
      Seq(curr / src),
      changeSet =>
        println(s"Changes detected in root ${curr / src}")
        // Always use cache; let dependency tracking re-render affected pages
        generateSite(src, out, theme, ignoreCache = false, session = session)
    )
    Thread.sleep(Long.MaxValue)
    sys.addShutdownHook(watcher.close())

  def generateSite[T <: model.Theme](
      src: String,
      out: String,
      theme: T,
      ignoreCache: Boolean,
      session: model.BuildSession = new model.BuildSession
  )(using
      model.SiteRoot
  ): Unit =
    val dest = os.Path(out, curr)
    val cachePath = dest / ".cache"
    val cache =
      if !ignoreCache then Cache.readFrom(cachePath)
      else Cache.empty

    val allFiles = os.walk(os.Path(src, curr)).filter(os.isFile)
    val hashes = session.cache(fileHashes)
    def sourceHash(path: os.Path): String =
      val version = sanatise.fileVersion(path)
      hashes.get(path) match
        case Some((cachedVersion, hash)) if cachedVersion == version => hash
        case _                                                       =>
          val hash = sanatise.md5Hashed(path)
          hashes(path) = (version, hash)
          hash

    val (changed, unchanged) = allFiles.partition(p =>
      val path = p.relativeTo(curr).toString
      val hash = sourceHash(p)
      cache.files.get(path).map(_ != hash).getOrElse(true)
    )

    val deleted =
      cache.files.keySet.map(p => os.Path(p, curr)).filterNot(p => os.exists(p))

    deleted.foreach(hashes.remove)
    if changed.nonEmpty then println(s"Changed: ${changed.mkString("\n  ", "\n  ", "")}")
    if deleted.nonEmpty then println(s"Deleted: ${deleted.mkString("\n  ", "\n  ", "")}")

    // Determine which doc pages depend on any changed inputs (docs or static assets)
    // A directory dependency represents collection membership, including new
    // and deleted sources that cannot be present in the old per-file deps.
    val changedAbsPaths: Set[String] =
      (changed ++ deleted).flatMap(p => Seq(p.toString, (p / os.up).toString)).toSet

    val dependentDocs: Set[os.Path] =
      cache.deps.collect {
        case (docPath, deps) if deps.exists(changedAbsPaths.contains) =>
          os.Path(docPath, curr)
      }.toSet

    if dependentDocs.nonEmpty then
      println(s"Dependent Docs: ${dependentDocs.mkString("\n  ", "\n  ", "")}")

    val changedWithDeps: Set[os.Path] = changed.toSet ++ dependentDocs

    given theme.Context = model.Context.fromTheme(curr / src, theme, session)
    // Render and collect dependencies for pages that were re-rendered
    val depsFromRender: Map[String, Set[String]] = renderSite(
      dest,
      theme,
      changedWithDeps
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
        .map(p => p.relativeTo(curr).toString -> sourceHash(p))
        .toMap,
      deps = mergedDeps
    )
    os.write.over(cachePath, upickle.default.write(newCache))

  def buildSiteDb(
      src: os.Path,
      theme: model.Theme,
      session: model.BuildSession = new model.BuildSession
  )(using model.SiteRoot): model.Site[theme.SiteMap] =
    val seenSources = mutable.Set.empty[os.Path]
    def readDocument[A: scalanotation.Reader](
        index: Int,
        name: String,
        path: os.Path,
        output: os.RelPath
    ): model.Doc[A] =
      seenSources += path
      md.cached[A](index, name, path, output, theme, session)

    def numberedDocument(path: os.Path): Option[(Int, String, os.Path)] =
      path.last match
        case s"$prefix - $slug.md" if prefix.toIntOption.isDefined && slug.nonEmpty =>
          Some((prefix.toInt, slug, path))
        case _ => None

    def readNodes[T <: NamedTuple.AnyNamedTuple](
        directory: os.Path,
        output: os.RelPath,
        schema: model.SiteMapSchema[T],
        metadata: model.SiteMapMeta[theme.Context, T]
    ): model.Site[T] =
      require(os.isDir(directory), s"Expected content directory: $directory")
      schema.entries.keys.foreach { name =>
        require(
          name.nonEmpty && name != "." && name != ".." && !name.exists(c => c == '/' || c == '\\'),
          s"Invalid content field name: $name"
        )
      }
      lazy val numberedSiblings = os.list(directory).filter(os.isFile).flatMap(numberedDocument)
      // Resolve all singleton sources before collecting the remaining documents.
      val singletonSources = schema.entries.collect {
        case (name, _: model.SiteMapSchema.DocSpec[?]) =>
          val spec = metadata._query(name).asInstanceOf[model.SiteMapMeta.DocData[theme.Context, ?]]
          val source =
            if spec.isIndexed then
              val matches = numberedSiblings.filter(_._2 == name).map(_._3)
              require(
                matches.nonEmpty,
                s"Expected indexed singleton '<number> - $name.md' in $directory"
              )
              require(
                matches.size == 1,
                s"Multiple indexed singleton documents for '$name' in $directory: ${matches.mkString(", ")}"
              )
              matches.head
            else directory / s"$name.md"
          require(os.isFile(source), s"Expected singleton document: $source")
          name -> source
      }
      val siblingDocuments = singletonSources.values.toSet
      val nodes = schema.entries.map { (name, spec) =>
        val node: model.ContentNode = spec match
          case doc: model.SiteMapSchema.DocSpec[a] =>
            given scalanotation.Reader[a] = doc.reader
            val source = singletonSources(name)
            readDocument[a](-1, name, source, output / sanatise.mdNameToHtml(name))
          case docs: model.SiteMapSchema.CollectionSpec[a] =>
            given scalanotation.Reader[a] = docs.reader
            val sharesParent = docs.isInstanceOf[model.SiteMapSchema.VarArgDocsSpec[?]]
            val source = if sharesParent then directory else directory / name
            val destination = if sharesParent then output else output / name
            require(os.isDir(source), s"Expected document collection: $source")
            val numbered = os
              .list(source)
              .filter(p => os.isFile(p) && p.ext == "md" && !siblingDocuments.contains(p))
              .map { p =>
                numberedDocument(p).getOrElse(
                  throw IllegalArgumentException(s"Expected '<number> - <name>.md': $p")
                )
              }
            val ordered = numbered.sortBy(x => (-x._1.toLong, x._2))
            val pages = ordered.zipWithIndex.map { case ((_, slug, path), index) =>
              readDocument[a](index, slug, path, destination / sanatise.mdNameToHtml(slug))
            }
            val routes = pages.map(p => sanatise.mdNameToHtml(p.name))
            require(routes.distinct.size == routes.size, s"Duplicate document routes in $source")
            docs match
              case _: model.SiteMapSchema.VarArgDocsSpec[a] =>
                model.VarArgDocs(source, destination, pages)
              case _: model.SiteMapSchema.DocsSpec[a] => model.Docs(source, destination, pages)
          case group: model.SiteMapSchema.DirectorySpec[t] =>
            val source = directory / name
            val childrenMeta = metadata
              ._query(name)
              .asInstanceOf[model.SiteMapMeta.DirectoryData[theme.Context, t]]
              .children
            model.Directory(
              source,
              output / name,
              readNodes(source, output / name, group.schema, childrenMeta)
            )
        name -> node
      }
      model.Site.read(None, None, nodes)
    val loaded = readNodes(src, os.RelPath(""), theme.siteMap, theme.siteMapMeta)
    md.pruneSources(theme, src, seenSources.toSet, session)
    model.Site.read(
      Option(src / "static").filter(os.isDir),
      Option(src / "favicon.ico").filter(os.isFile),
      loaded.nodes
    )

  def renderSite(
      dest: os.Path,
      theme: model.Theme,
      changed: Set[os.Path]
  )(using theme.Context, model.SiteRoot): Map[String, Set[String]] = {
    val deps = mutable.Map[String, Set[String]]()
    val outputs = mutable.Map[String, String]()
    val roots = mutable.ArrayBuffer.empty[String]
    val jobs = mutable.ArrayBuffer.empty[() => Unit]
    val routes = mutable.Set.empty[String]

    def document[A](
        page: model.Doc[A],
        output: os.RelPath,
        url: String,
        selector: Option[model.SiteMapMeta.SelLayout[theme.Context, A]],
        isRoot: Boolean
    ): Unit =
      val (selected, selectorDeps) = Templates.withDependencyCollection {
        selector.map(_(page)).getOrElse(Result.Ok(None)) match
          case Result.Ok(layout) => layout
          case Result.Err(error) => throw error
      }
      require(!isRoot || selected.nonEmpty, s"Root document requires a layout: ${page.path}")
      selected.foreach { layout =>
        val route = output.toString
        require(routes.add(route), s"Duplicate output route: $route")
        val source = page.path.relativeTo(curr).toString
        outputs(source) = route
        if isRoot then roots += url
        jobs += (() =>
          if changed.contains(page.path) || !os.isFile(dest / output) then
            val (rendered, usedDeps) = Templates.withDependencyCollection { layout.run(page) }
            os.write.over(
              dest / output,
              scalatags.Text.all.doctype("html")(rendered),
              createFolders = true
            )
            deps(source) = selectorDeps ++ usedDeps
        )
      }

    def visit[T <: NamedTuple.AnyNamedTuple](
        site: model.Site[T],
        metadata: model.SiteMapMeta[theme.Context, T]
    ): Unit =
      site.nodes.foreach { (name, node) =>
        // Schema derivation gives each node its corresponding metadata type.
        (node, metadata._query(name)) match
          case (single: model.Doc[a], spec: model.SiteMapMeta.DocData[theme.Context, ?]) =>
            val typed = spec.asInstanceOf[model.SiteMapMeta.DocData[theme.Context, a]]
            document(single, single.outputPath, single.url, typed.optLayout, typed.isRoot)
          case (
                many: model.DocumentCollection[a],
                spec: model.SiteMapMeta.DocsData[theme.Context, ?]
              ) =>
            val typed = spec.asInstanceOf[model.SiteMapMeta.DocsData[theme.Context, a]]
            many.foreach { page =>
              document(page, page.outputPath, page.url, typed.optLayout, false)
            }
          case (
                group: model.Directory[t],
                spec: model.SiteMapMeta.DirectoryData[theme.Context, ?]
              ) =>
            visit(group.children, spec.children.asInstanceOf[model.SiteMapMeta[theme.Context, t]])
          case _ => throw IllegalArgumentException(s"Metadata does not match content node: $name")
      }

    visit(ctx.site, theme.siteMapMeta)
    require(roots.size <= 1, "More than one root document")
    require(
      roots.headOption.forall(_ == "/") || !routes.contains("index.html"),
      "Root redirect would overwrite index.html"
    )
    os.makeDir.all(dest)
    // Persist exact routes so deleted nested sources and removed layouts clean up correctly.
    val outputManifest = dest / ".outputs.json"
    val previous =
      if os.isFile(outputManifest) then
        upickle.default.read[Map[String, String]](os.read(outputManifest))
      else Map.empty[String, String]
    val currentRoutes = outputs.values.toSet ++ roots.headOption.map(_ => "index.html")
    (previous.values.toSet -- currentRoutes).foreach { route =>
      val path = dest / os.RelPath(route)
      if os.isFile(path) then os.remove(path)
    }
    jobs.foreach(_())
    roots.headOption.filter(_ != "/").foreach { url =>
      os.write.over(dest / "index.html", rootPage(redirect = url))
    }
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

    model.Context.afterRender(theme, dest)
    val tracked =
      outputs.toMap ++ roots.headOption.filter(_ != "/").map(_ => "@root" -> "index.html")
    os.write.over(outputManifest, upickle.default.write(tracked))
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

  private case class SourceKey(theme: model.Theme, reader: scalanotation.Reader[?], path: os.Path)
  private case class CachedSource(version: sanatise.FileVersion, document: model.Doc[?])
  private val sources = new model.BuildSession.Cache[SourceKey, CachedSource]

  private[util] def pruneSources(
      theme: model.Theme,
      root: os.Path,
      live: Set[os.Path],
      session: model.BuildSession
  ): Unit =
    val cache = session.cache(sources)
    cache.keys
      .filter(key => (key.theme eq theme) && key.path.startsWith(root) && !live(key.path))
      .toVector
      .foreach(cache.remove)

  /** Stat unchanged inputs without opening/decoding them again. Publish only successful parses. */
  def cached[T: scalanotation.Reader](
      index: Int,
      name: String,
      path: os.Path,
      outputPath: os.RelPath,
      theme: model.Theme,
      session: model.BuildSession
  ): model.Doc[T] =
    val version = sanatise.fileVersion(path)
    val key = SourceKey(theme, summon[scalanotation.Reader[T]], path)
    val cache = session.cache(sources)
    cache.get(key) match
      case Some(entry)
          if entry.version == version &&
            entry.document.name == name && entry.document.outputPath == outputPath =>
        entry.document.asInstanceOf[model.Doc[T]].atIndex(index)
      case _ =>
        val document = render[T](index, name, path, outputPath, theme)
        cache(key) = CachedSource(version, document)
        document

  def render[T: scalanotation.Reader](
      index: Int,
      name: String,
      path: os.Path,
      outputPath: os.RelPath,
      theme: model.Theme
  ): model.Doc[T] =
    import org.virtuslab.yaml.*
    def frontMatterError(msg: String): Nothing =
      throw new Exception(s"failed to read front matter of $path:$msg")
    val rawText = os.read(path)
    val (rawSON, rawDoc) =
      val imports = "import language.experimental.dedentedStringLiterals\n"
      rawText.match
        case s"---\n```scala\n$son\n```\n---\n$rest" => (imports + son, rest)
        case s"```scala\n$son\n```\n---\n$rest"      => (imports + son, rest)
        case _                                       => frontMatterError(" no front matter found")

    val documentNoSplices = parseDryRun(rawDoc, theme)
    val data: T = Readers.experimental.readAs[T](rawSON) match
      case Result.Ok(value)  => value
      case Result.Err(error) => frontMatterError(error.format)
    val (sample, wordCount, headings) =
      ContentSampler.sampleContent(documentNoSplices)

    model.Doc(
      name = name,
      path = path,
      outputPath = outputPath,
      frontMatter = data,
      wordCount = wordCount,
      headings = headings,
      htmlPreview = sample,
      rawContent = rawDoc,
      idx = index
    )
