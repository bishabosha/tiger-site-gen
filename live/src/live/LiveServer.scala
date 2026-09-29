package live

import java.nio.charset.StandardCharsets.UTF_8
import java.nio.file.{Files, NoSuchFileException}
import java.util.concurrent.{CompletableFuture, ConcurrentHashMap, TimeUnit}
import scala.concurrent.duration.*
import ox.{never, supervised, useInScope}
import ox.channels.{Channel, ChannelClosed}
import ox.flow.Flow
import sttp.capabilities.WebSockets
import sttp.model.{Header, HeaderNames, Method, StatusCode}
import sttp.model.sse.ServerSentEvent
import sttp.shared.Identity
import sttp.tapir.*
import sttp.tapir.generic.auto.*
import sttp.tapir.json.upickle.*
import sttp.tapir.model.ServerRequest
import sttp.tapir.server.ServerEndpoint
import sttp.tapir.server.model.ValuedEndpointOutput
import sttp.tapir.server.model.EndpointExtensions.*
import sttp.tapir.server.netty.NettyConfig
import io.netty.channel.socket.nio.NioServerSocketChannel
import sttp.tapir.server.netty.sync.{NettySyncServer, NettySyncServerOptions, OxStreams, serverSentEventsBody}
import upickle.default.ReadWriter

/** Content studio (`/__author/`) settings.
 *
 *  @param directory the content-relative collection opened first ("" shows the hierarchy).
 *  @param policies rules for particular collections, e.g. Reveal's slides; others are plain pages.
 */
final case class StudioSettings(directory: String = "", policies: Seq[CollectionPolicy] = Nil)

/** Settings for [[LiveServer]].
 *
 *  @param outputRoot the built site (e.g. `dist/`), served as static files. Builds announce
 *    completion with its [[BuildStatus]] marker (`.tiger-build.json`).
 *  @param contentRoot the site's Markdown sources: Content studio's root and where drafts may come from.
 *  @param project the site root: `.live-preview.json` announces the draft endpoint to editors here,
 *    and `.outputs.json` source paths are relative to it.
 *  @param live adds the reload client, Content studio and unsaved-draft previews; when false the
 *    server only serves the built files, unchanged.
 *  @param siteUrl the page announced on start, e.g. `/my-talk/`.
 *  @param drafts renders unsaved documents; `None` answers draft requests with 503.
 *  @param noReload output-relative globs (e.g. `assets/viewer.html`) of HTML pages that never get the
 *    reload client. Only generated pages (listed in `.outputs.json`) get it anyway, and a page can
 *    opt out itself with `data-live="off"` on any element.
 *  @param openEditor opens a source file for the studio's and pages' "open in editor" actions;
 *    by default through the Tiger Markdown Templates VS Code extension (see [[EditorOpener]]).
 */
final case class LiveServerConfig(
    outputRoot: os.Path,
    contentRoot: os.Path,
    project: os.Path,
    live: Boolean = true,
    host: String = "127.0.0.1",
    port: Int = 8123,
    siteUrl: String = "/",
    drafts: Option[DraftRenderer] = None,
    studio: StudioSettings = StudioSettings(),
    noReload: Seq[String] = Nil,
    openEditor: EditorOpener = EditorOpener.default,
    pollInterval: FiniteDuration = 50.millis,
    log: String => Unit = println
):
  require(port >= 0 && port <= 65535, "Invalid port")
  require(siteUrl.startsWith("/") && !siteUrl.startsWith("//"), s"Expected a site-absolute URL: $siteUrl")

/** A running preview server; see [[LiveServer.start]]. */
final class LiveServer private (val port: Int, preview: LiveServer.Preview, thread: Thread) extends AutoCloseable:
  def origin: String = s"http://127.0.0.1:$port"
  /** The announced entry page. */
  def siteUrl: String = origin + preview.config.siteUrl
  /** The latest completed build, if any. */
  def status: Option[BuildStatus] = preview.status
  /** Check the build marker now instead of waiting for the next poll. */
  def checkBuild(): Unit = preview.checkBuild()
  /** Announce a completed build directly (an in-process builder); the marker is still honoured. */
  def published(status: BuildStatus): Unit = preview.announce(status)
  def close(): Unit =
    preview.close()
    thread.interrupt()
    thread.join(5000)

/** The local preview server for any Tiger site: static files with in-place reload notifications
 *  (server-sent events), the Content studio authoring API, and unsaved-draft previews, built on
 *  tapir's sync Netty server.
 */
object LiveServer:
  // Browsers reset open event streams when a tab closes; that is not worth a stack trace.
  // Held strongly: java.util.logging only keeps weak references to configured loggers.
  private val unhandledLog = java.util.logging.Logger.getLogger("sttp.tapir.server.netty.internal.UnhandledExceptionHandler")
  unhandledLog.setFilter(record => !record.getThrown.isInstanceOf[java.io.IOException])

  /** Bind (port 0 picks a free port) and serve until closed. */
  def start(config: LiveServerConfig): LiveServer =
    val preview = new Preview(config)
    val bound = new CompletableFuture[Int]()
    val thread = new Thread(() =>
      try
        supervised {
          val server = NettySyncServer(NettySyncServerOptions.customiseInterceptors
              .defaultHandlers(message => ValuedEndpointOutput(jsonBody[ErrorBody], ErrorBody(message)))
              .options,
            NettyConfig.default.host(config.host).port(config.port).noGracefulShutdown
              // Server-sent event streams stay open without traffic between builds.
              .copy(idleTimeout = None)
              .eventLoopConfig(NettyConfig.EventLoopConfig(() => QuickShutdownGroup(), classOf[NioServerSocketChannel])))
            .addEndpoints(preview.endpoints)
          val binding = useInScope(server.start())(_.stop())
          bound.complete(binding.port)
          never
        }
      catch
        case _: InterruptedException => ()
        case error: Throwable => if !bound.completeExceptionally(error) then throw error
    , "tiger-live-server")
    thread.setDaemon(true)
    thread.start()
    val port =
      try bound.get(30, TimeUnit.SECONDS)
      catch case error: java.util.concurrent.ExecutionException =>
        preview.close()
        throw error.getCause
    preview.started(port)
    new LiveServer(port, preview, thread)

  /** A local dev server has no in-flight work worth Netty's default 2 s quiet period on exit. */
  private final class QuickShutdownGroup extends io.netty.channel.nio.NioEventLoopGroup():
    override def shutdownGracefully(): io.netty.util.concurrent.Future[?] = shutdownGracefully(0, 1, TimeUnit.SECONDS)

  final case class ErrorBody(error: String) derives ReadWriter
  final case class StudioConfig(siteUrl: String, directory: String) derives ReadWriter
  final case class Opened(opened: Boolean, file: String) derives ReadWriter
  /** Open a source by content-relative `file`, by collection `directory` and page `id`, or by page `route`. */
  final case class OpenRequest(directory: String = "", id: Option[String] = None, file: Option[String] = None,
      route: Option[String] = None) derives ReadWriter

  /** Ephemeral navigation within a page; target is a stable element ID, step an optional reveal step. */
  final case class Navigation(route: String, target: String, client: String, step: Int = -1) derives ReadWriter

  private val contentTypes = Map(
    "html" -> "text/html; charset=utf-8", "css" -> "text/css; charset=utf-8",
    "js" -> "text/javascript; charset=utf-8", "mjs" -> "text/javascript; charset=utf-8",
    "png" -> "image/png", "jpg" -> "image/jpeg", "jpeg" -> "image/jpeg", "gif" -> "image/gif",
    "svg" -> "image/svg+xml", "webp" -> "image/webp", "ico" -> "image/x-icon",
    "woff" -> "font/woff", "woff2" -> "font/woff2",
    "ttf" -> "font/ttf", "otf" -> "font/otf", "md" -> "text/plain; charset=utf-8", "txt" -> "text/plain; charset=utf-8",
    "json" -> "application/json", "pdf" -> "application/pdf", "wasm" -> "application/wasm")

  /** Status, headers and bytes; used where the reply is computed from files on disk. */
  private type Reply = (StatusCode, List[Header], Array[Byte])
  private val reply = statusCode.and(headers).and(byteArrayBody)
  private def empty(status: StatusCode, body: String = ""): Reply = (status, Nil, body.getBytes(UTF_8))

  private type Error = (StatusCode, ErrorBody)
  private type Endpoint = ServerEndpoint[OxStreams & WebSockets, Identity]

  private def escape(text: String): String =
    text.flatMap {
      case '<' => "&lt;"
      case '>' => "&gt;"
      case '&' => "&amp;"
      case '"' => "&quot;"
      case c => c.toString
    }

  private[live] final class Preview(val config: LiveServerConfig):
    private val lock = new Object
    @volatile private var current = BuildStatus("pending", ok = true)
    @volatile private var markerStamp = ""
    @volatile private var closed = false
    @volatile private var boundPort = -1
    /** Subscribers and the page each one shows (`None`: every page), so drafts carry only that page's HTML. */
    private val clients = new ConcurrentHashMap[Channel[ServerSentEvent], Option[String]]()
    private val navigation = scala.collection.mutable.Map.empty[String, Navigation]
    private val root = config.outputRoot
    @volatile private var outputs: (String, Map[String, String]) = ("", Map.empty)
    private val drafts = new DraftPreview(config.project, config.drafts, publish, lock)
    private val authoring = new Authoring(config.contentRoot, config.studio.policies)
    private val noReload = config.noReload.map(glob => java.nio.file.FileSystems.getDefault.getPathMatcher(s"glob:$glob"))
    private val poller = new Thread(() =>
      while !closed do
        checkBuild()
        try Thread.sleep(config.pollInterval.toMillis) catch case _: InterruptedException => ()
    , "tiger-live-build-poller")
    poller.setDaemon(true)
    checkBuild()

    def status: Option[BuildStatus] = Some(current).filter(_.revision != "pending")

    def started(port: Int): Unit =
      boundPort = port
      poller.start()
      if config.live then
        drafts.announce(port)
        config.drafts.foreach(renderer => Thread.ofVirtual().start(() => renderer.warm()))
      val kind = if config.live then "live, automatic refresh enabled" else "static"
      config.log(s"Site: http://127.0.0.1:$port${config.siteUrl} ($kind)")
      if config.live then config.log(s"Content studio: http://127.0.0.1:$port/__author/")

    def close(): Unit =
      closed = true
      poller.interrupt()
      if config.live then drafts.close()
      clients.keySet.forEach(_.doneOrClosed())

    // -- Build notifications ------------------------------------------------------------

    private def publish(event: String, data: ujson.Value): Unit = lock.synchronized {
      clients.forEach((channel, route) => channel.sendOrClosed(draftEvent(event, data, route)))
    }

    private def broadcast(event: ServerSentEvent): Unit = lock.synchronized {
      clients.keySet.forEach(_.sendOrClosed(event))
    }

    /** A draft renders every page that shows the edited source (on a blog, every page whose
     *  navigation lists it); a subscriber only needs the page it shows.
     */
    private def draftEvent(event: String, data: ujson.Value, route: Option[String]): ServerSentEvent =
      val filtered = (route, data) match
        case (Some(route), ujson.Obj(fields)) if fields.contains("pages") =>
          ujson.Obj.from(fields.map((key, value) =>
            if key == "pages" then key -> ujson.Arr.from(value.arr.filter(page => pageRoute(page("route").str) == route))
            else key -> value))
        case _ => data
      ServerSentEvent(data = Some(ujson.write(filtered)), eventType = Some(event))

    /** `/articles/`, `/articles/index.html` and `articles/index.html` name the same page. */
    private def pageRoute(route: String): String =
      val path = "/" + decodePath(route.takeWhile(c => c != '?' && c != '#')).stripPrefix("/")
      if path.endsWith("/") then path + "index.html" else path

    private def stamp(file: os.Path): String =
      // ctime changes even when a rewrite leaves mtime and contents unchanged.
      val times = Files.readAttributes(file.toNIO, "unix:lastModifiedTime,ctime,size")
      def nanos(name: String) = times.get(name).asInstanceOf[java.nio.file.attribute.FileTime].to(TimeUnit.NANOSECONDS)
      s"${nanos("lastModifiedTime")}:${nanos("ctime")}:${times.get("size")}"

    /** Builders write the marker last, after pages, assets and every afterRender hook. */
    def checkBuild(): Unit = synchronized {
      try
        val marker = BuildStatus.marker(root)
        val next = stamp(marker)
        if next != markerStamp then
          markerStamp = next
          announce(upickle.default.read[BuildStatus](os.read(marker)))
      catch
        case _: NoSuchFileException => ()
        case scala.util.control.NonFatal(error) => System.err.println(s"Cannot read build status: ${error.getMessage}")
    }

    def announce(status: BuildStatus): Unit = synchronized {
      if status.revision != current.revision then
        if config.live && status.ok then drafts.saved()
        lock.synchronized {
          current = status
          broadcast(ServerSentEvent(data = Some(ujson.write(status.json))))
        }
        if config.live && status.ok then drafts.refresh()
    }

    private def events(route: Option[String]): Flow[ServerSentEvent] = Flow.usingEmit { emit =>
      val channel = Channel.unlimited[ServerSentEvent]
      val page = route.map(pageRoute)
      lock.synchronized {
        channel.send(ServerSentEvent(data = Some(ujson.write(current.json))))
        if config.live then drafts.replay().foreach(draft => channel.send(draftEvent("draft", draft, page)))
        page.flatMap(navigation.get).foreach(value => channel.send(navigationEvent(value)))
        if closed then channel.done() else clients.put(channel, page)
      }
      try
        var open = true
        while open do
          channel.receiveOrClosed() match
            case _: ChannelClosed => open = false
            case event: ServerSentEvent @unchecked => emit(event)
      finally clients.remove(channel)
    }

    private def navigationEvent(value: Navigation): ServerSentEvent =
      ServerSentEvent(data = Some(upickle.default.write(value)), eventType = Some("navigation"))

    private def navigate(value: Navigation): Navigation = lock.synchronized {
      if !value.route.startsWith("/") || value.route.startsWith("//") || value.route.length > 2048 ||
          value.target.isEmpty || value.target.length > 512 || value.client.isEmpty || value.client.length > 128 ||
          value.step < -1 || value.step > 100000 then throw AuthoringError("Invalid navigation", 400)
      val normalized = value.copy(route = pageRoute(value.route))
      // Only built HTML pages can acquire shared state; no arbitrary room names or URLs.
      if normalized.route.split('/').exists(_.startsWith(".")) then throw AuthoringError("Invalid page route", 400)
      val path = root / os.RelPath(normalized.route.stripPrefix("/"))
      if !normalized.route.endsWith(".html") || !os.isFile(path) || !path.toNIO.toRealPath().startsWith(root.toNIO.toRealPath()) then throw AuthoringError("Page not found", 404)
      navigation(normalized.route) = normalized
      val event = navigationEvent(normalized)
      clients.forEach((channel, route) => if route.contains(normalized.route) then channel.sendOrClosed(event))
      normalized
    }

    // -- Static files -------------------------------------------------------------------


    /** `.outputs.json` from the last build: site-root-relative source → output route. */
    private def generated(): Option[Map[String, String]] =
      val manifest = root / ".outputs.json"
      try
        val key = stamp(manifest)
        if outputs._1 != key then outputs = (key, upickle.default.read[Map[String, String]](os.read(manifest)))
        Some(outputs._2)
      catch case scala.util.control.NonFatal(_) => None

    private val clientAssets = new _root_.model.StaticAssets
    private val clientUrl =
      if config.live then Some(io.util.paths.resolveStaticAsset(LiveResources.client, clientAssets))
      else None

    private def clientTag(servedRevision: String): String =
      io.util.paths.writeStaticAssets(root, clientAssets)
      s"<script src=\"${clientUrl.get}\" data-tiger-live data-revision=\"${escape(servedRevision)}\" defer></script>"

    private def reloadable(relative: String, html: String): Boolean =
      config.live &&
        !noReload.exists(_.matches(java.nio.file.Path.of(relative))) &&
        generated().forall(_.valuesIterator.contains(relative)) &&
        !html.contains("data-live=\"off\"")

    private def withReloadClient(html: String, servedRevision: String): String =
      val end = html.toLowerCase(java.util.Locale.ROOT).lastIndexOf("</body>")
      val script = clientTag(servedRevision)
      if end < 0 then html + script else html.substring(0, end) + script + html.substring(end)

    /** Shown for pages the last (failed) build could not produce; the overlay explains why. */
    private def unbuiltPage(servedRevision: String): Array[Byte] =
      s"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Build failed</title></head>
         |<body data-tiger-live-placeholder><p>This page has not been built: the last build failed.</p>
         |${clientTag(servedRevision)}</body></html>""".stripMargin.getBytes(UTF_8)

    private def decodePath(raw: String): String =
      // decodeURIComponent: '+' stays literal; malformed escapes are rejected.
      java.net.URLDecoder.decode(raw.replace("+", "%2B"), UTF_8)

    private def htmlHeaders = List(
      Header.contentType(sttp.model.MediaType.unsafeParse(contentTypes("html"))), Header(HeaderNames.CacheControl, "no-cache"))

    private def serveStatic(request: ServerRequest): Reply =
      val method = request.method
      if method != Method.GET && method != Method.HEAD then return empty(StatusCode.MethodNotAllowed)
      val servedRevision = current.revision
      val target = request.showShort.drop(method.method.length + 1)
      val (pathname, search) = target.indexOf('?') match
        case -1 => (target, "")
        case index => (target.take(index), target.drop(index))
      def missing: Reply =
        val wantsPage = pathname.endsWith("/") || pathname.endsWith(".html")
        if config.live && !current.ok && wantsPage then (StatusCode.ServiceUnavailable, htmlHeaders, unbuiltPage(servedRevision))
        else empty(StatusCode.NotFound, "Not found")
      try
        val requested = decodePath(pathname)
        val base = root.toNIO.toAbsolutePath.normalize()
        val candidate = base.resolve("." + (if requested == "/" then "/index.html" else requested)).normalize()
        if !candidate.startsWith(base) || candidate == base then return empty(StatusCode.Forbidden)
        // Build bookkeeping (.outputs.json, .tiger-build.json, .cache) is not part of the site.
        if base.relativize(candidate).iterator().asScala.exists(_.toString.startsWith(".")) then return empty(StatusCode.NotFound)
        val realRoot = base.toRealPath()
        var resolved = candidate.toRealPath()
        if Files.isDirectory(resolved) then
          if !pathname.endsWith("/") then
            return (StatusCode.Found, List(Header.location(pathname + "/" + search)), Array.emptyByteArray)
          resolved = resolved.resolve("index.html").toRealPath()
        if !resolved.startsWith(realRoot) || resolved == realRoot || !Files.isRegularFile(resolved) then
          return missing
        val fileBytes = Files.readAllBytes(resolved)
        val name = resolved.getFileName.toString
        val extension = name.lastIndexOf('.') match
          case -1 => ""
          case index => name.drop(index + 1)
        val relative = realRoot.relativize(resolved).iterator().asScala.mkString("/")
        val bytes =
          if extension != "html" || !config.live then fileBytes
          else
            val html = new String(fileBytes, UTF_8)
            if reloadable(relative, html) then
              withReloadClient(html, servedRevision).getBytes(UTF_8)
            else fileBytes
        (StatusCode.Ok, List(
          Header.contentType(sttp.model.MediaType.unsafeParse(contentTypes.getOrElse(extension, "application/octet-stream"))),
          Header(HeaderNames.CacheControl, "no-cache")), bytes)
      catch
        case _: NoSuchFileException => missing
        case scala.util.control.NonFatal(_) => empty(StatusCode.NotFound, "Not found")

    // -- Authoring ----------------------------------------------------------------------

    private def fail(message: String, status: StatusCode): Error = (status, ErrorBody(message))

    private def checkHost(host: Option[String]): Either[Error, Unit] =
      if host.contains(s"127.0.0.1:$boundPort") || host.contains(s"localhost:$boundPort") then Right(())
      else Left(fail("Invalid host", StatusCode.Forbidden))

    private def checkPost(host: Option[String], origin: Option[String], contentType: Option[String]): Either[Error, Unit] =
      checkHost(host).flatMap { _ =>
        if origin.isEmpty || origin != host.map("http://" + _) || !contentType.contains("application/json") then
          Left(fail("Same-origin JSON required", StatusCode.Forbidden))
        else Right(())
      }

    private def run[A](body: => A): Either[Error, A] =
      try Right(body)
      catch
        case error: AuthoringError => Left(fail(error.getMessage, StatusCode(error.status)))
        case scala.util.control.NonFatal(error) =>
          Left(fail(Option(error.getMessage).getOrElse(error.toString), StatusCode.InternalServerError))

    /** The source shown at a page route (a URL path such as `/articles/post.html` or `/about/`). */
    private def sourceForRoute(route: String): java.nio.file.Path =
      val path = decodePath(route.takeWhile(c => c != '?' && c != '#')).stripPrefix("/")
      val page = if path.isEmpty || path.endsWith("/") then path + "index.html" else path
      val source = generated().getOrElse(throw AuthoringError("No build output yet", 404)).collectFirst {
        case (source, output) if output == page && source != "@root" => source
      }.getOrElse(throw AuthoringError("No source for this page", 404))
      val file = config.project / os.RelPath(source)
      if !file.startsWith(config.contentRoot) then throw AuthoringError("Source outside content directory", 403)
      authoring.source(file.relativeTo(config.contentRoot).toString)

    private def open(request: OpenRequest): Opened =
      val file = (request.file, request.route) match
        case (Some(file), _) => authoring.source(file)
        case (None, Some(route)) => sourceForRoute(route)
        case _ => authoring.pageSource(request.directory, request.id)
      config.openEditor.open(os.Path(file))
      Opened(true, file.toString)

    private val authorHeaders = header(HeaderNames.CacheControl, "no-store").and(header("X-Content-Type-Options", "nosniff"))
    private val authorBase = endpoint.in("__author").out(authorHeaders)
      .errorOut(statusCode.and(jsonBody[ErrorBody]).and(authorHeaders))
    private val hostHeader = header[Option[String]](HeaderNames.Host)
    private val authorGet = authorBase.securityIn(hostHeader).handleSecurity(checkHost)
    private val authorPost = authorBase.post.maxRequestBodyLength(1024 * 1024)
      .securityIn(hostHeader.and(header[Option[String]](HeaderNames.Origin)).and(header[Option[String]](HeaderNames.ContentType)))
      .handleSecurity(checkPost)

    /** GET and HEAD variants; Netty omits HEAD bodies but keeps their Content-Length. */
    private def getOrHead(build: Method => Endpoint): List[Endpoint] = List(build(Method.GET), build(Method.HEAD))

    private def authoringEndpoints: List[Endpoint] =
      getOrHead(method => authorGet.method(method).out(header(HeaderNames.ContentType, "text/html; charset=utf-8"))
          .out(byteArrayBody).handleSuccess(_ => _ => LiveResources.studio)) ++
        getOrHead(method => authorGet.method(method).in("config").out(jsonBody[StudioConfig])
          .handleSuccess(_ => _ => StudioConfig(config.siteUrl, config.studio.directory))) ++
        getOrHead(method => authorGet.method(method).in("tree").out(jsonBody[Authoring.Tree])
          .handle(_ => _ => run(authoring.tree()))) ++
        getOrHead(method => authorGet.method(method).in("collection").in(query[Option[String]]("directory"))
          .out(jsonBody[Authoring.Collection])
          .handle(_ => directory => run(authoring.collection(directory.getOrElse(""))))) ++
        List(
          authorPost.in("navigate").in(jsonBody[Navigation]).out(jsonBody[Navigation])
            .handle(_ => request => run(navigate(request))),
          authorPost.in("reorder").in(jsonBody[Authoring.ReorderRequest]).out(jsonBody[Authoring.Collection])
            .handle(_ => request => run(authoring.reorder(request))),
          authorPost.in("insert").in(jsonBody[Authoring.InsertRequest]).out(jsonBody[Authoring.Inserted])
            .handle(_ => request => run(authoring.insert(request))),
          authorPost.in("duplicate").in(jsonBody[Authoring.PageRequest]).out(jsonBody[Authoring.Inserted])
            .handle(_ => request => run(authoring.duplicate(request))),
          authorPost.in("recalculate").in(jsonBody[Authoring.RevisionRequest]).out(jsonBody[Authoring.Collection])
            .handle(_ => request => run(authoring.recalculate(request))),
          authorPost.in("delete").in(jsonBody[Authoring.PageRequest]).out(jsonBody[Authoring.Deleted])
            .handle(_ => request => run(authoring.delete(request))),
          authorPost.in("open").in(jsonBody[OpenRequest]).out(jsonBody[Opened])
            .handle(_ => request => run(open(request)))
        ) :+
        // Anything else under /__author/: same host/origin checks, then 404 or 405.
        authorBase.in(paths)
          .securityIn(extractFromRequest(_.method).and(hostHeader)
            .and(header[Option[String]](HeaderNames.Origin)).and(header[Option[String]](HeaderNames.ContentType)))
          .handleSecurity((method, host, origin, contentType) =>
            if method == Method.POST then checkPost(host, origin, contentType).flatMap(_ => Left(fail("Not found", StatusCode.NotFound)))
            else checkHost(host).flatMap { _ =>
              if method == Method.GET || method == Method.HEAD then Left(fail("Not found", StatusCode.NotFound))
              else Left(fail("Method not allowed", StatusCode.MethodNotAllowed))
            })
          .handleSuccess(_ => _ => ())

    // -- Drafts -------------------------------------------------------------------------

    private def draftEndpoint: Endpoint =
      endpoint.in("__preview" / "draft").maxRequestBodyLength(DraftPreview.MaxDraftBytes)
        .securityIn(extractFromRequest(_.method).and(header[Option[String]](HeaderNames.Authorization)))
        .errorOut(statusCode.and(jsonBody[ErrorBody]))
        .in(byteArrayBody)
        .out(statusCode.and(jsonBody[ujson.Value]))
        .handleSecurity((method, authorization) =>
          if drafts.authorized(method.method, authorization) then Right(())
          else Left((StatusCode.Forbidden, ErrorBody("Unauthorized draft request"))))
        .handleSuccess(_ => body =>
          val (status, value) = drafts.handle(body)
          (StatusCode(status), value))

    // -- Routes -------------------------------------------------------------------------

    val endpoints: List[Endpoint] =
      val stream = getOrHead(method => endpoint.method(method).in("__preview" / "events").in(query[Option[String]]("route"))
        .out(header(HeaderNames.CacheControl, "no-store")).out(header(HeaderNames.Connection, "keep-alive"))
        .out(serverSentEventsBody)
        .handleSuccess(route => if method == Method.HEAD then Flow.empty else events(route)))
      val static: Endpoint = endpoint.in(extractFromRequest(identity)).out(reply).handleSuccess(serveStatic)
      (if config.live then stream ++ (draftEndpoint :: authoringEndpoints) else Nil) :+ static

  private given Schema[ujson.Value] = Schema.any[ujson.Value]
  // Recursive: derivation would need a lazy self-reference; no documentation is generated.
  private given Schema[Authoring.Tree] = Schema.any[Authoring.Tree]
  extension [A](iterator: java.util.Iterator[A]) private def asScala: Iterator[A] =
    scala.jdk.CollectionConverters.IteratorHasAsScala(iterator).asScala
