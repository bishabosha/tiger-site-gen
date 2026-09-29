package live

import java.nio.file.{Files, LinkOption, Path, StandardCopyOption, StandardOpenOption}
import java.nio.charset.StandardCharsets.UTF_8
import java.util.concurrent.atomic.AtomicBoolean
import java.util.regex.Pattern
import upickle.default.ReadWriter
import io.util.FrontMatter

/** A failed authoring request, reported to the browser as `{"error": message}` with `status`. */
final class AuthoringError(message: String, val status: Int = 400) extends Exception(message)

object Authoring:
  /** One Markdown file in a content directory. Numbered files (`010 - name.md`) are ordered.
   *
   *  @param id the page's identity in requests: its [[CollectionPolicy]] ID (such as a slide's
   *    front matter `id`), else the filename.
   *  @param group its ordering group (e.g. `appendix`), when the policy has groups.
   *  @param badges short facts the policy shows on the page's card (e.g. `30s`).
   */
  final case class Page(name: String, ordered: Boolean, number: Option[Long], title: String, id: Option[String],
      group: Option[String], badges: Seq[String], digest: String, source: String) derives ReadWriter
  /** A directory listing; `revision` changes whenever a name or byte changes.
   *  `noun`, `plural` and `groups` come from the directory's [[CollectionPolicy]].
   */
  final case class Collection(directory: String, revision: String, noun: String, plural: String,
      groups: Seq[String], files: Seq[Page]) derives ReadWriter:
    def ordered: Seq[Page] = files.filter(_.ordered)
  final case class Tree(name: String, path: String, pages: Int, children: Seq[Tree]) derives ReadWriter
  final case class Inserted(id: String, name: String, shifted: Int, state: Collection) derives ReadWriter
  final case class Deleted(nextId: Option[String], name: String, backup: String, state: Collection) derives ReadWriter

  final case class ReorderRequest(directory: String = "", revision: String = "", order: Option[Seq[String]] = None)
      derives ReadWriter
  final case class InsertRequest(directory: String = "", revision: String = "", afterId: Option[String] = None,
      moveId: Option[String] = None) derives ReadWriter
  /** Identifies one page of a collection by its [[Page.id]]. */
  final case class PageRequest(directory: String = "", revision: String = "", id: Option[String] = None)
      derives ReadWriter
  final case class RevisionRequest(directory: String = "", revision: String = "") derives ReadWriter

  private val numbered = Pattern.compile("^(\\d+) - (.+)\\.md$")
  private val heading = Pattern.compile("^#{1,2}\\s+(.+)$", Pattern.MULTILINE | Pattern.UNIX_LINES)
  private val MaxSafeInteger = 9007199254740991L
  private val collator = java.text.Collator.getInstance(java.util.Locale.ROOT)

  /** The front matter's SON contents, or "" without front matter. */
  def metadata(source: String): String = FrontMatter.unapply(source).map(_._1).getOrElse("")
  /** The complete front matter block of `source`, including delimiters, or "". */
  def frontMatterOf(source: String): String =
    FrontMatter.unapply(source).map((_, body) => source.dropRight(body.length)).getOrElse("")

  private def fail(message: String, status: Int = 400): Nothing = throw AuthoringError(message, status)
  private[live] def group(pattern: Pattern, text: String, index: Int = 1): Option[String] =
    val matcher = pattern.matcher(text)
    if matcher.find() then Some(matcher.group(index)) else None
  private def parts(name: String): Option[(String, String)] =
    val matcher = numbered.matcher(name)
    if matcher.matches() then Some((matcher.group(1), matcher.group(2))) else None
  private def pad(number: Long, width: Int): String =
    val digits = number.toString
    "0" * (width - digits.length) + digits
  private def sha256(text: String): String =
    java.security.MessageDigest.getInstance("SHA-256").digest(text.getBytes(UTF_8)).map("%02x".format(_)).mkString
  private def rename(from: Path, to: Path): Unit =
    // rename(2): atomic within a directory, like Node's fs.rename.
    Files.move(from, to, StandardCopyOption.ATOMIC_MOVE)

/** Reorder, insert, duplicate and delete numbered Markdown pages under `contentRoot`.
 *
 *  Renames are staged through a temporary directory and rolled back on failure; stale
 *  revisions, traversal outside the content root, symlinks and concurrent saves are refused.
 *  Each directory's rules (identity, grouping, new-page text) come from the first
 *  [[CollectionPolicy]] that applies to it, else [[CollectionPolicy.Pages]].
 */
final class Authoring(contentRoot: os.Path, policies: Seq[CollectionPolicy] = Nil):
  import Authoring.*
  private val saving = new AtomicBoolean(false)

  def policy(relative: String): CollectionPolicy =
    policies.find(_.applies(relative)).getOrElse(CollectionPolicy.Pages)

  private def exclusive[A](body: => A): A =
    if !saving.compareAndSet(false, true) then fail("Another save is in progress. Try again.", 409)
    try body finally saving.set(false)

  def directory(relative: String): Path =
    if relative.split("[\\\\/]").contains("..") || relative.startsWith("/") then fail("Invalid directory")
    val root = contentRoot.toNIO.toRealPath()
    val target = root.resolve(relative).normalize().toRealPath()
    if target != root && !target.startsWith(root) then fail("Outside content directory", 403)
    // Do not expose symlinked directories, even when their target is inside content.
    var current = root
    for part <- relative.split('/') if part.nonEmpty do
      current = current.resolve(part)
      if Files.isSymbolicLink(current) then fail("Symlinks are not editable", 403)
    target

  /** A Markdown source by content-relative path: a regular file, not reached through symlinks. */
  def source(relative: String): Path =
    val parts = relative.split('/').toSeq
    if relative.isEmpty || !relative.endsWith(".md") || parts.last.isEmpty then fail("Expected a Markdown file")
    val file = directory(parts.init.mkString("/")).resolve(parts.last)
    if !Files.isRegularFile(file, LinkOption.NOFOLLOW_LINKS) then fail("Source not found", 404)
    file

  private def entries(dir: Path): Vector[Path] =
    val stream = Files.list(dir)
    try stream.toArray.toVector.map(_.asInstanceOf[Path])
    finally stream.close()

  def collection(relative: String): Collection =
    val dir = directory(relative)
    val rules = policy(relative)
    val files = entries(dir).filter { entry =>
      Files.isRegularFile(entry, LinkOption.NOFOLLOW_LINKS) && entry.getFileName.toString.endsWith(".md")
    }.map { entry =>
      val name = entry.getFileName.toString
      val source = new String(Files.readAllBytes(entry), UTF_8)
      val number = parts(name).map(_._1)
      val body = FrontMatter.unapply(source).map(_._2).getOrElse(source)
      Page(name = name, ordered = number.nonEmpty, number = number.map(n => BigDecimal(n).toLong),
        title = group(heading, body).getOrElse(name.stripSuffix(".md")).replaceAll("[*_`]", ""),
        id = rules.id(source).orElse(Some(name)),
        group = rules.group(source),
        badges = rules.badges(source),
        digest = sha256(source), source = source)
    }.sortWith { (a, b) =>
      val byNumber = a.number.getOrElse(-1L).compareTo(b.number.getOrElse(-1L))
      if byNumber != 0 then byNumber < 0 else collator.compare(a.name, b.name) < 0
    }
    val revision = sha256(ujson.write(ujson.Arr.from(files.map(f => ujson.Arr(f.name, f.digest)))))
    Collection(relative, revision, rules.noun, rules.plural, rules.groups, files)

  def tree(relative: String = ""): Tree =
    val dir = directory(relative)
    val all = entries(dir).sortWith((a, b) => collator.compare(a.getFileName.toString, b.getFileName.toString) < 0)
    val children = all.collect {
      case entry if !entry.getFileName.toString.startsWith(".") && Files.isDirectory(entry, LinkOption.NOFOLLOW_LINKS) =>
        tree(Seq(relative, entry.getFileName.toString).filter(_.nonEmpty).mkString("/"))
    }
    val pages = all.count(e => Files.isRegularFile(e, LinkOption.NOFOLLOW_LINKS) && e.getFileName.toString.endsWith(".md"))
    Tree(dir.getFileName.toString, relative, pages, children)

  private def groupIndex(rules: CollectionPolicy, page: Page): Int =
    page.group.map(rules.groups.indexOf).filter(_ >= 0).getOrElse(0)

  def reorder(request: ReorderRequest): Collection = exclusive(reorderUnlocked(request))

  private def reorderUnlocked(request: ReorderRequest): Collection =
    val relative = request.directory
    val state = collection(relative)
    val rules = policy(relative)
    if state.revision != request.revision then fail("Files changed on disk. Reload before saving.", 409)
    val files = state.ordered
    val order = request.order.getOrElse(Nil)
    if request.order.isEmpty || order.length != files.length || order.distinct.length != files.length ||
      order.exists(n => !files.exists(_.name == n)) then fail(s"Order must contain every numbered ${rules.noun} exactly once")
    // Groups keep their declared order (e.g. Reveal places appendices after the main talk).
    val indices = order.map(name => groupIndex(rules, files.find(_.name == name).get))
    if indices.zip(indices.drop(1)).exists(_ > _) then fail(rules.groupOrderError)
    val width = math.max(3, (order.length * 10).toString.length)
    val changes = order.zipWithIndex.map((from, index) => (from, s"${pad((index + 1) * 10L, width)} - ${parts(from).get._2}.md"))
    val dir = directory(relative)
    val names = entries(dir).map(_.getFileName.toString)
    if changes.exists((_, to) => names.contains(to) && !order.contains(to)) then
      fail("A destination filename already exists", 409)
    var staging: Option[Path] = Some(Files.createTempDirectory(dir, ".reorder-"))
    try
      final case class Move(from: String, to: String, temporary: Path, var installed: Boolean = false)
      val moved = scala.collection.mutable.ArrayBuffer.empty[Move]
      try
        for ((from, to), index) <- changes.zipWithIndex do
          val temporary = staging.get.resolve(index.toString)
          rename(dir.resolve(from), temporary)
          moved += Move(from, to, temporary)
        for change <- moved do
          rename(change.temporary, dir.resolve(change.to))
          change.installed = true
      catch case error: Throwable =>
        for change <- moved if change.installed do rename(dir.resolve(change.to), change.temporary)
        for change <- moved do rename(change.temporary, dir.resolve(change.from))
        throw error
      Files.delete(staging.get)
      staging = None
      collection(relative)
    finally staging.foreach(path => try Files.delete(path) catch case scala.util.control.NonFatal(_) => ())

  /** The source file of the uniquely identified numbered page. */
  def pageSource(relative: String, id: Option[String]): Path =
    val rules = policy(relative)
    if id.forall(_.isEmpty) then fail(s"Missing ${rules.noun} ID")
    val matches = collection(relative).files.filter(file => file.ordered && file.id == id)
    if matches.length != 1 then fail(s"${rules.Noun} source not found or ambiguous", 404)
    directory(relative).resolve(matches.head.name)

  /** Create a page after `afterId`, or move `moveId` there, shifting a consecutive run to make room. */
  def insert(request: InsertRequest): Inserted = exclusive(insertUnlocked(request, duplicate = false))

  private def insertUnlocked(request: InsertRequest, duplicate: Boolean): Inserted =
    val relative = request.directory
    val rules = policy(relative)
    val noun = rules.noun
    val state = collection(relative)
    if request.revision != state.revision then fail("Files changed on disk. Refresh and try again.", 409)
    val files = state.ordered
    def unique(id: Option[String]): Page =
      val matches = files.filter(_.id == id)
      if matches.length != 1 then fail(s"${rules.Noun} not found or ambiguous", 404)
      matches.head
    val after = unique(request.afterId)
    val moving = request.moveId.map(id => unique(Some(id)))
    if moving.exists(_ eq after) then fail(s"Choose a different $noun to paste after")
    if moving.exists(_.group != after.group) then fail(rules.crossGroupError)
    val afterIndex = files.indexWhere(_ eq after)
    moving match
      case Some(page) if files.lift(afterIndex + 1).exists(_ eq page) =>
        return Inserted(page.id.getOrElse(page.name), page.name, 0, state)
      case _ => ()
    val remaining = files.filterNot(file => moving.exists(_ eq file))
    if remaining.map(_.number).distinct.length != remaining.length then
      fail(s"Duplicate $noun numbers must be resolved before inserting", 409)
    val position = remaining.indexWhere(_ eq after)
    val number = after.number.get + 1
    val next = remaining.lift(position + 1)
    if number > MaxSafeInteger then fail(s"${rules.Noun} number exceeds the supported integer range", 409)
    if moving.isEmpty && !duplicate && next.exists(n => number >= n.number.get) then
      fail(s"No free integer after this $noun. Move a neighboring $noun or use Content studio to space the numbers again. No files were changed.", 409)
    val shifted = scala.collection.mutable.ArrayBuffer.empty[(String, String)]
    if moving.nonEmpty || duplicate then
      var slot = number
      val following = remaining.drop(position + 1).iterator
      var continue = true
      while continue && following.hasNext do
        val file = following.next()
        if file.number.get != slot then continue = false
        else
          if slot + 1 > MaxSafeInteger then fail(s"${rules.Noun} number exceeds the supported integer range", 409)
          val (prefix, suffix) = parts(file.name).get
          shifted += ((file.name, s"${pad(slot + 1, prefix.length)} - $suffix.md"))
          slot += 1
    val dir = directory(relative)
    val names = entries(dir).map(_.getFileName.toString)
    // Ignore ordering prefixes: a renamed/reordered copy still reserves its name.
    val stems = names.map(name => parts(name).map(_._2).getOrElse(name.stripSuffix(".md")).toLowerCase).toSet
    val ids = state.files.flatMap(_.id).toSet
    var id: Option[String] = moving.flatMap(_.id)
    var suffix = moving.map(page => parts(page.name).get._2).getOrElse("")
    var source = ""
    if duplicate then
      val stem = parts(after.name).get._2
      val base = rules.id(after.source)
      var n = 1
      while base.exists(b => ids.contains(s"$b-$n")) || stems.contains(s"$stem-$n".toLowerCase) do n += 1
      id = base.map(b => s"$b-$n")
      suffix = s"$stem-$n"
      source = rules.duplicate(after.source, id)
    else if moving.isEmpty then
      id = rules.freshId()
      suffix = id.getOrElse {
        val base = s"new-$noun"
        var candidate = base
        var n = 2
        while stems.contains(candidate.toLowerCase) do
          candidate = s"$base-$n"
          n += 1
        candidate
      }
      source = rules.newPage(after, id)
    val width = math.max(3, parts(after.name).get._1.length)
    val name = s"${pad(number, width)} - $suffix.md"
    val destination = dir.resolve(name)
    if moving.nonEmpty || shifted.nonEmpty then
      val changes = moving.map(page => (page.name, name)).toSeq ++ shifted
      val sources = changes.map(_._1).toSet
      if moving.isEmpty && names.contains(name) then fail("A destination filename already exists", 409)
      if changes.exists((_, to) => names.contains(to) && !sources.contains(to)) then
        fail("A destination filename already exists", 409)
      val staging = Files.createTempDirectory(dir, ".reorder-")
      final case class Staged(from: Option[String], to: String, temporary: Path)
      val staged = scala.collection.mutable.ArrayBuffer.empty[Staged]
      val installed = scala.collection.mutable.ArrayBuffer.empty[Staged]
      // Keep originals in staging until every destination is installed.
      // Hard links create destinations exclusively, including during rollback.
      try
        if moving.isEmpty then
          val temporary = staging.resolve("new")
          Files.writeString(temporary, source, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE)
          staged += Staged(None, name, temporary)
        for ((from, to), index) <- changes.zipWithIndex do
          val temporary = staging.resolve(index.toString)
          rename(dir.resolve(from), temporary)
          staged += Staged(Some(from), to, temporary)
        for change <- staged do
          Files.createLink(dir.resolve(change.to), change.temporary)
          installed += change
      catch case error: Throwable =>
        for change <- installed do Files.delete(dir.resolve(change.to))
        for change <- staged do
          change.from.foreach(from => Files.createLink(dir.resolve(from), change.temporary))
          Files.delete(change.temporary)
        Files.delete(staging)
        throw error
      for change <- staged do Files.delete(change.temporary)
      Files.delete(staging)
    else
      Files.writeString(destination, source, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE)
    Inserted(id.getOrElse(name), name, shifted.length, collection(relative))

  /** Copy a page directly after itself; only its policy ID (if any) changes. */
  def duplicate(request: PageRequest): Inserted =
    if request.id.forall(_.isEmpty) then fail(s"Missing ${policy(request.directory).noun} ID")
    exclusive(insertUnlocked(InsertRequest(request.directory, request.revision, afterId = request.id), duplicate = true))

  /** Move a page into a recoverable `.deleted-*` backup and choose a neighbor to show next. */
  def delete(request: PageRequest): Deleted = exclusive {
    val relative = request.directory
    val rules = policy(relative)
    val state = collection(relative)
    if request.revision != state.revision then fail("Files changed on disk. Refresh and try again.", 409)
    val files = state.ordered
    val matches = files.filter(file => file.id == request.id)
    if request.id.forall(_.isEmpty) || matches.length != 1 then fail(s"${rules.Noun} not found or ambiguous", 404)
    if files.length <= rules.minimumPages then fail(rules.minimumError)
    val file = matches.head
    val index = files.indexWhere(_ eq file)
    val nextId = files.lift(index + 1).orElse(files.lift(index - 1)).flatMap(_.id)
    val dir = directory(relative)
    val trash = Files.createTempDirectory(dir, ".deleted-")
    val backup = trash.resolve(file.name + ".bak")
    try rename(dir.resolve(file.name), backup)
    catch case error: Throwable =>
      Files.delete(trash)
      throw error
    Deleted(nextId, file.name, backup.toString, collection(relative))
  }

  /** Respace numbered pages as 010, 020, 030... keeping their order and contents. */
  def recalculate(request: RevisionRequest): Collection =
    val state = collection(request.directory)
    reorder(ReorderRequest(request.directory, request.revision, Some(state.ordered.map(_.name))))
