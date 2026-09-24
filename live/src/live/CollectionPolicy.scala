package live

/** Content studio's rules for one kind of numbered collection.
 *
 *  Numbered Markdown files (`010 - name.md`) of any directory can be reordered,
 *  inserted, duplicated and deleted. A policy adds what the files mean: a stable
 *  identity, ordering groups, facts to show and the text of new pages. Themes
 *  supply policies for their collections (the Reveal layer's slide policy, for
 *  example); every other directory uses [[CollectionPolicy.Pages]].
 */
trait CollectionPolicy:
  /** Whether this policy governs the content-relative directory (e.g. `my-talk/slides`). */
  def applies(directory: String): Boolean

  /** Singular noun for UI copy and messages, e.g. `slide`. */
  def noun: String = "page"
  def plural: String = noun + "s"
  final def Noun: String = noun.capitalize

  /** A stable identity read from the source (such as front matter `id`); `None` uses the filename. */
  def id(source: String): Option[String] = None
  /** Ordering groups; pages must stay grouped in this order (e.g. main slides before appendices). */
  def groups: Seq[String] = Nil
  /** The page's group, one of [[groups]]. */
  def group(source: String): Option[String] = None
  /** Short facts shown on the page's card, e.g. a timing. */
  def badges(source: String): Seq[String] = Nil
  /** Deletion keeps at least this many numbered pages. */
  def minimumPages: Int = 0

  def groupOrderError: String = s"Keep ${plural} grouped as ${groups.mkString(", then ")}"
  def crossGroupError: String = s"Keep each group of ${plural} in its own section"
  def minimumError: String = s"Keep at least $minimumPages $plural in this collection"

  /** A new page's identity; `None` names the file `new-<noun>.md` and identifies it by filename. */
  def freshId(): Option[String] = None
  /** The source of a new page inserted after `after`, identified by `id` (see [[freshId]]).
   *  By default: the neighbor's front matter, so its schema still reads, and a placeholder body.
   */
  def newPage(after: Authoring.Page, id: Option[String]): String =
    val front = Authoring.frontMatterOf(after.source)
    s"${if front.isEmpty || front.endsWith("\n") then front else front + "\n"}\n# New $noun\n\nAdd your content here.\n"
  /** A copy of `source` for its duplicate, identified by `id` (derived from [[id]] when it has one). */
  def duplicate(source: String, id: Option[String]): String = source

object CollectionPolicy:
  /** Plain numbered pages: filenames identify them; duplicates are exact copies. */
  object Pages extends CollectionPolicy:
    def applies(directory: String): Boolean = true
