package revealTheme

import com.vladsch.flexmark.ast.Heading
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.util.ast.TextCollectingVisitor
import scala.jdk.CollectionConverters.*
import model.sctx
import io.util.md
import io.util.Templates
import scalatags.Text.all.*
import scalatags.Text.tags2.aside

/** Validate slide sources and render fragments for the deck and notes layouts. */
object Slides:
  private val notesHeading = "## Speaker notes"
  private val layouts = Set("standard", "dark-slide", "appendix")
  private val directive = raw"\{\{([^}]+)\}\}".r

  /** Validate authoring markers without treating fenced code examples as syntax. */
  private[revealTheme] def splitAndValidate(content: String, file: String): (String, String) =
    val body = StringBuilder()
    val notes = StringBuilder()
    var inNotes = false
    var fence: Option[(Char, Int)] = None
    var stack = List.empty[String]
    for line <- content.linesIterator do
      val trimmed = line.trim
      val run = trimmed.takeWhile(c => c == '`' || c == '~')
      if run.length >= 3 && run.forall(_ == run.head) then
        fence match
          case None => fence = Some(run.head -> run.length)
          case Some((ch, length)) if run.head == ch && run.length >= length && trimmed.drop(run.length).isBlank =>
            fence = None
          case _ => ()
      else if fence.isEmpty then
        if trimmed == notesHeading then
          require(!inNotes, s"$file: duplicate Speaker notes heading")
          require(stack.isEmpty, s"$file: unclosed layout before notes: ${stack.mkString(", ")}")
          inNotes = true
        else
          for m <- directive.findAllMatchIn(line) do
            val name = m.group(1).takeWhile(!_.isWhitespace)
            require(!Set("stack", "columns", "end-stack", "end-columns")(name) || trimmed == m.matched,
              s"$file: layout markers must be on their own line")
            if name == "br" || name.startsWith("end-") then
              require(m.group(1).trim == name, s"$file: {{$name}} takes no arguments")
            name match
              case "columns" | "stack" =>
                stack = name :: stack
              case "end-columns" | "end-stack" =>
                val expected = name.stripPrefix("end-")
                require(stack.headOption.contains(expected), s"$file: mismatched {{$name}}")
                stack = stack.tail
              case "br" => ()
              case _ => () // The active theme resolves extension templates during Markdown parsing.
      if trimmed != notesHeading || fence.nonEmpty then
        (if inNotes then notes else body).append(line).append('\n')
    require(fence.isEmpty, s"$file: unclosed code fence")
    require(stack.isEmpty, s"$file: unclosed layout: ${stack.mkString(", ")}")
    require(inNotes && notes.toString.trim.nonEmpty, s"$file: missing Speaker notes")
    (body.toString.trim, notes.toString.trim)

  def stamp(seconds: Int): String = f"${seconds / 60}%d:${seconds % 60}%02d"

  case class Rendered(id: String, title: String, seconds: Int, appendix: Boolean,
      start: Int, slide: ConcreteHtmlTag[String], notes: Frag, source: os.Path)

  private case class Parsed(title: String, audienceHtml: String, notesHtml: String)
  private case class Cached(theme: model.Theme, meta: SlideMeta, raw: String, parsed: Parsed, rendered: Rendered)
  private val fragments = new model.BuildSession.Cache[os.Path, Cached]

  class Deck(content: Vector[Rendered], sourceDirectory: os.Path):
    def read()(using RevealTheme.Context): Vector[Rendered] =
      // Membership matters too: a new slide was not among the previous sources.
      Templates.recordDependency(sourceDirectory)
      Templates.recordMultiDependency(content.map(_.source))
      content

  def render()(using RevealTheme.SiteContext): Deck =
    val collection = sctx.site.deck.slides
    val theme = sctx.theme
    // Tiger orders articles newest first; a presentation reads forward.
    val pages = collection.toIterable.toVector.reverse
    require(pages.nonEmpty, "The deck has no slides")
    require(pages.map(_.path.last.takeWhile(_.isDigit).toInt).distinct.size == pages.size,
      "Slide filename numbers must be unique")
    require(pages.map(_.frontMatter.id).distinct.size == pages.size, "Duplicate slide ids")
    val cache = sctx.buildSession.cache(fragments)
    val livePaths = pages.map(_.path).toSet
    cache.keys.filter(path => path / os.up == collection.sourcePath && !livePaths(path)).toVector.foreach(cache.remove)
    var elapsed = 0
    var reachedAppendix = false
    val content = pages.map { page =>
      val m = page.frontMatter
      require(m.id.matches("[a-z][a-z0-9-]*"), s"${page.path}: invalid id ${m.id}")
      require(layouts(m.layout), s"${page.path}: unknown layout ${m.layout}")
      val appendix = m.layout == "appendix"
      require(if appendix then m.seconds == 0 else m.seconds > 0, s"${page.path}: invalid timing")
      require(!reachedAppendix || appendix, "Appendices must follow the main slides")
      reachedAppendix ||= appendix
      val cached = cache.get(page.path).filter(entry => (entry.theme eq theme) && entry.meta == m && entry.raw == page.rawContent)
      val parsed = cached.map(_.parsed).getOrElse {
        val (content, notes) = splitAndValidate(page.rawContent, page.path.toString)
        val ast = md.parseDryRun(content, theme)
        val headings = ast.getChildren.asScala.collect { case h: Heading if h.getLevel <= 2 => h }.toVector
        require(headings.size == 1, s"${page.path}: expected exactly one H1/H2 slide title")
        val title = TextCollectingVisitor().collectAndGetText(headings.head).replaceAll("\\s+", " ").trim
        // Reveal uses the same static template function for normal and default expansion.
        // Reuse Tiger's configured AST directly; no full Context is needed for rendering.
        val renderer = HtmlRenderer.builder(ast).build()
        val audienceHtml = renderer.render(ast)
        val notesHtml = renderer.render(md.parseDryRun(notes, theme))
        Parsed(title, audienceHtml, notesHtml)
      }
      val result = cached.filter(_.rendered.start == elapsed).map(_.rendered).getOrElse {
        val Parsed(title, audienceHtml, notesHtml) = parsed
        val time = if appendix then "Appendix" else s"${stamp(elapsed)}-${stamp(elapsed + m.seconds)}"
        val notesWithTiming = frag(p(cls := "time", strong(time)), raw(notesHtml))
        val sectionTag = tag("section")(
          id := m.id,
          cls := m.layout,
          attr("data-timing") := m.seconds,
          if appendix then attr("data-visibility") := "uncounted" else frag(),
          if m.layout == "dark-slide" then attr("data-background-color") := "#19242a" else frag()
        )(
          div(cls := "slide-body", raw(audienceHtml)),
          aside(cls := "notes", notesWithTiming)
        )
        Rendered(m.id, title, m.seconds, appendix, elapsed, sectionTag,
          notesWithTiming, page.path)
      }
      cache(page.path) = Cached(theme, m, page.rawContent, parsed, result)
      elapsed += m.seconds
      result
    }
    Deck(content, pages.head.path / os.up)
