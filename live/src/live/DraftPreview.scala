package live

import java.nio.charset.StandardCharsets.UTF_8

/** Relays unsaved editor buffers (from the VS Code extension) to a [[DraftRenderer]] and the browser.
 *
 *  Protocol: the server announces `{port, token, project}` in `<project>/.live-preview.json`;
 *  the editor POSTs `{file, session, sequence, text | clear}` to `/__preview/draft` with
 *  `Authorization: Bearer <token>`. Rendered drafts are published as `draft` server-sent events,
 *  `{file, pages: [{route, url, html}]}` (or `{file, clear: true}`), and failures as `draft-error`;
 *  current drafts are replayed to new clients. Each render reads all current drafts, so a page
 *  shows every unsaved edit that affects it.
 *
 *  Replies: 200, 422 (invalid draft, last valid preview kept), 404 (not a document of the site),
 *  400 (malformed request) and 503 (no renderer).
 *
 *  @param lock guards the draft state together with the caller's event subscriptions, so a
 *    new subscriber sees each draft exactly once (replay, then live events).
 */
final class DraftPreview(
    project: os.Path,
    render: Option[DraftRenderer],
    publish: (String, ujson.Value) => Unit,
    lock: AnyRef = new Object
):
  import DraftPreview.*
  val token: String = java.util.UUID.randomUUID().toString
  val discovery: os.Path = project / ".live-preview.json"
  private val drafts = scala.collection.mutable.LinkedHashMap.empty[os.Path, Draft]
  private val latest = scala.collection.mutable.Map.empty[os.Path, Request]
  private var serial = 0L

  def authorized(method: String, authorization: Option[String]): Boolean =
    method == "POST" && authorization.contains(s"Bearer $token")

  private def texts: Map[os.Path, String] = lock.synchronized(drafts.view.mapValues(_.text).toMap)

  /** Handle an authorized draft request body; returns the HTTP status and JSON reply. */
  def handle(body: Array[Byte]): (Int, ujson.Value) =
    def error(status: Int, message: String) = (status, ujson.Obj("error" -> message))
    try
      val input = ujson.read(new String(body, UTF_8))
      val file =
        try os.Path(os.Path(input("file").str).toNIO.toRealPath())
        catch case _: java.io.IOException => throw DraftRejected("Not a document of this site")
      val sequence = input.obj.get("sequence").collect {
        case ujson.Num(n) if n.isWhole && math.abs(n) <= MaxSafeInteger => n.toLong
      }
      val session = input.obj.get("session").collect { case ujson.Str(s) => s }
      if sequence.isEmpty || session.isEmpty then throw IllegalArgumentException("Invalid draft sequence")
      val request = lock.synchronized {
        latest.get(file) match
          case Some(prior) if prior.session == session.get && prior.sequence >= sequence.get => None
          case _ =>
            serial += 1
            val request = Request(session.get, sequence.get, serial)
            latest(file) = request
            Some(request)
      }
      request match
        case None => (200, ujson.Obj("stale" -> true))
        case Some(request) if input.obj.get("clear").exists(_.boolOpt.contains(true)) =>
          val removed = lock.synchronized {
            val removed = drafts.remove(file)
            publish("draft", ujson.Obj("file" -> file.toString, "clear" -> true))
            removed
          }
          if removed.nonEmpty then refresh()
          (200, ujson.Obj("cleared" -> true))
        case Some(request) =>
          val text = input.obj.get("text").collect { case ujson.Str(s) => s }
            .getOrElse(throw IllegalArgumentException("Missing draft text"))
          val renderer = render.getOrElse(throw IllegalStateException("No draft renderer is running"))
          val result =
            try Right(renderer.render(file, texts + (file -> text)))
            catch
              case rejected: DraftRejected => throw rejected
              case scala.util.control.NonFatal(error) => Left(Option(error.getMessage).getOrElse("Incomplete document"))
          lock.synchronized {
            if !latest.get(file).exists(_ eq request) then (200, ujson.Obj("stale" -> true))
            else result match
              case Left(message) =>
                publish("draft-error", ujson.Obj("file" -> file.toString, "error" -> message))
                (422, ujson.Obj("error" -> message))
              case Right(pages) =>
                val draft = Draft(file, text, pages)
                drafts(file) = draft
                publish("draft", draft.event)
                (200, ujson.Obj("rendered" -> true, "pages" -> ujson.Arr.from(pages.map(_.route))))
          }
    catch
      case rejected: DraftRejected => error(404, rejected.getMessage)
      case missing: IllegalStateException => error(503, missing.getMessage)
      case scala.util.control.NonFatal(problem) => error(400, Option(problem.getMessage).getOrElse(problem.toString))

  /** Current drafts, as `draft` events for a newly connected browser. Call while holding `lock`. */
  def replay(): Seq[ujson.Value] = lock.synchronized(drafts.values.map(_.event).toSeq)

  /** After a completed build: drop drafts whose text now matches the saved file.
   *  Call [[refresh]] afterwards to re-render the rest against the new saved state.
   */
  def saved(): Unit = lock.synchronized {
    for (file, draft) <- drafts.toSeq do
      val current = try Some(os.read(file)) catch case scala.util.control.NonFatal(_) => None
      if current.forall(_ == draft.text) then
        drafts.remove(file)
        publish("draft", ujson.Obj("file" -> file.toString, "clear" -> true, "saved" -> true))
  }

  /** Re-render the remaining drafts (after another draft cleared or a build completed). */
  def refresh(): Unit =
    for renderer <- render; draft <- lock.synchronized(drafts.values.toVector) do
      try
        val pages = renderer.render(draft.file, texts)
        lock.synchronized {
          if drafts.get(draft.file).exists(_ eq draft) then
            val updated = draft.copy(pages = pages)
            drafts(draft.file) = updated
            publish("draft", updated.event)
        }
      catch case scala.util.control.NonFatal(_) => () // Keep its last valid pages.

  def announce(port: Int): Unit =
    os.write.over(discovery, ujson.write(ujson.Obj("port" -> port, "token" -> token, "project" -> project.toString)),
      perms = "rw-------")

  def close(): Unit =
    try if ujson.read(os.read(discovery))("token").str == token then os.remove(discovery)
    catch case scala.util.control.NonFatal(_) => ()

object DraftPreview:
  /** Unsaved buffers larger than this are refused. */
  val MaxDraftBytes: Long = 2L * 1024 * 1024
  private val MaxSafeInteger = 9007199254740991L
  private final case class Request(session: String, sequence: Long, serial: Long)
  private final case class Draft(file: os.Path, text: String, pages: Seq[DraftPage]):
    def event: ujson.Value = ujson.Obj("file" -> file.toString,
      "pages" -> ujson.Arr.from(pages.map(page => upickle.default.writeJs(page))))
