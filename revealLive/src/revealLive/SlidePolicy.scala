package revealLive

import java.util.regex.Pattern
import live.{Authoring, CollectionPolicy}

/** Content studio rules for Reveal slides (`slides/010 - name.md`).
 *
 *  Slides are identified by their front matter `id`, grouped as main slides then appendices
 *  (`layout = "appendix"`), show their `seconds`, and a deck keeps at least one. New slides
 *  get a fresh ID, notes and the neighbor's layout; duplicates change only the ID.
 *
 *  @param governs which content-relative directories hold slides.
 */
final class SlidePolicy(governs: String => Boolean) extends CollectionPolicy:
  import SlidePolicy.*
  def applies(directory: String): Boolean = governs(directory)
  override def noun = "slide"
  override def id(source: String): Option[String] = find(idField, Authoring.metadata(source))
  override def groups: Seq[String] = Seq("main", "appendix")
  override def group(source: String): Option[String] =
    Some(if appendixLayout.matcher(Authoring.metadata(source)).find() then "appendix" else "main")
  override def badges(source: String): Seq[String] =
    if group(source).contains("appendix") then Seq.empty
    else Seq(s"${seconds(source).getOrElse(revealTheme.SlideMeta.defaultSeconds.toLong)}s")
  override def minimumPages = 1
  override def groupOrderError = "Keep main slides before appendices"
  override def crossGroupError = "Keep main slides and appendices in their own sections"
  override def minimumError = "Keep at least one slide in the deck"
  override def freshId(): Option[String] = Some(s"slide-${java.util.UUID.randomUUID()}")

  override def newPage(after: Authoring.Page, id: Option[String]): String =
    val appendix = after.group.contains("appendix")
    val layout = if appendix then "appendix" else "standard"
    s"---scala\n(id = \"${id.getOrElse("")}\", layout = \"$layout\")\n---\n\n## New slide\n\nAdd your content here.\n\n## Speaker notes\n"

  // Only the metadata ID changes; keep content, notes and formatting intact.
  override def duplicate(source: String, id: Option[String]): String =
    val metadata = Authoring.frontMatterOf(source)
    if id.isEmpty || metadata.isEmpty then source
    else
      val field = idReplacement.matcher(metadata)
      if field.find() then
        metadata.substring(0, field.start()) + field.group(1) + id.get + "\"" +
          metadata.substring(field.end()) + source.substring(metadata.length)
      else source

object SlidePolicy:
  /** Slides in exactly these content-relative directories, e.g. `my-talk/slides`. */
  def apply(directories: String*): SlidePolicy = new SlidePolicy(directories.toSet)

  private val idField = Pattern.compile("\\bid\\s*=\\s*\"([^\"\\n]+)\"")
  private val idReplacement = Pattern.compile("(\\bid\\s*=\\s*\")[^\"\\n]+\"")
  private val appendixLayout = Pattern.compile("\\blayout\\s*=\\s*\"appendix\"")
  private val secondsField = Pattern.compile("\\bseconds\\s*=\\s*(\\d+)")
  private def find(pattern: Pattern, text: String): Option[String] =
    val matcher = pattern.matcher(text)
    if matcher.find() then Some(matcher.group(1)) else None
  def seconds(source: String): Option[Long] = find(secondsField, Authoring.metadata(source)).flatMap(_.toLongOption)
