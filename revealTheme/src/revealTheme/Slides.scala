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
  private case class Cached(theme: model.Theme, assetHash: String, mode: model.DisplayMode, meta: SlideMeta, raw: String, parsed: Parsed, rendered: Rendered)
  private val fragments = new model.BuildSession.Cache[os.Path, Cached]

  /** Wraps the deferred render so `Deck`'s constructor never names `RevealTheme.Context`:
   *  `RevealTheme.Extra` mentions `Deck`, and Scaladoc cannot unpickle a field type that loops back
   *  through it. Methods mentioning the context are fine, since their signatures are read lazily. */
  @FunctionalInterface
  trait RenderContent:
    def apply(context: RevealTheme.Context): Vector[Rendered]

  final class Deck(renderContent: RenderContent, sourceDirectory: os.Path):
    private var rendered: Option[Vector[Rendered]] = None
    def read()(using RevealTheme.Context): Vector[Rendered] =
      val content = rendered.getOrElse {
        val result = renderContent(summon[RevealTheme.Context])
        rendered = Some(result)
        result
      }
      model.ctx.extra.assets.baseUrl // Register dependencies even when fragments were cached.
      // Membership matters too: a new slide was not among the previous sources.
      Templates.recordDependency(sourceDirectory)
      Templates.recordMultiDependency(content.map(_.source))
      content

  def render(layouts: Map[String, SlideLayout] = SlideLayout.defaults)(using RevealTheme.SiteContext): Deck =
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
    var reachedAppendix = false
    val prepared = pages.map { page =>
      val m = page.frontMatter
      require(m.id.matches("[a-z][a-z0-9-]*"), s"${page.path}: invalid id ${m.id}")
      val layout = layouts.getOrElse(m.layout,
        throw IllegalArgumentException(s"${page.path}: unknown layout ${m.layout}"))
      require(m.fontSize.forall(_ > 0), s"${page.path}: fontSize must be a positive pixel size")
      val appendix = m.layout == "appendix"
      require(if appendix then m.seconds == 0 else m.seconds > 0, s"${page.path}: invalid timing")
      require(!reachedAppendix || appendix, "Appendices must follow the main slides")
      reachedAppendix ||= appendix
      val (body, notes) = splitAndValidate(page.rawContent, page.path.toString)
      (page, layout, body, notes)
    }
    def renderContent(using RevealTheme.Context): Vector[Rendered] =
      val assetHash = model.ctx.extra.assets.bundle.hash
      var elapsed = 0
      prepared.map { (page, layout, body, notes) =>
        val m = page.frontMatter
        val appendix = m.layout == "appendix"
        val cached = cache.get(page.path).filter(entry => (entry.theme eq theme) && entry.assetHash == assetHash && entry.mode == model.ctx.displayMode && entry.meta == m && entry.raw == page.rawContent)
        val parsed = cached.map(_.parsed).getOrElse {
          val ast = md.parseDoc(body, SlideAnchors.install(_, m.id))
          val headings = ast.getChildren.asScala.collect { case h: Heading if h.getLevel <= 2 => h }.toVector
          require(headings.size == 1, s"${page.path}: expected exactly one H1/H2 slide title")
          val title = TextCollectingVisitor().collectAndGetText(headings.head).replaceAll("\\s+", " ").trim
          val renderer = HtmlRenderer.builder(ast).build()
          val audienceHtml = renderer.render(ast)
          val notesAst = md.parseDoc(notes, SlideAnchors.install(_, m.id, notes = true))
          val notesHtml = HtmlRenderer.builder(notesAst).build().render(notesAst)
          Parsed(title, audienceHtml, notesHtml)
        }
        val result = cached.filter(_.rendered.start == elapsed).map(_.rendered).getOrElse {
          val Parsed(title, audienceHtml, notesHtml) = parsed
          val time = if appendix then "Appendix" else s"${stamp(elapsed)}-${stamp(elapsed + m.seconds)}"
          val notesWithTiming = frag(p(cls := "time", strong(time)), raw(notesHtml))
          val sectionTag = tag("section")(
            id := m.id,
            cls := layout.classes,
            attr("data-timing") := m.seconds,
            if appendix then attr("data-visibility") := "uncounted" else frag(),
            layout.backgroundColor.map(color => attr("data-background-color") := color)
          )(
            div(
              cls := "slide-body",
              m.fontSize.map(size => attr("data-font-size") := size),
              m.fontSize.map(size => style := s"--slide-font-size:${size}px"),
              raw(audienceHtml)
            ),
            aside(cls := "notes", notesWithTiming)
          )
          Rendered(m.id, title, m.seconds, appendix, elapsed, sectionTag,
            notesWithTiming, page.path)
        }
        cache(page.path) = Cached(theme, assetHash, model.ctx.displayMode, m, page.rawContent, parsed, result)
        elapsed += m.seconds
        result
      }
    Deck(context => renderContent(using context), pages.head.path / os.up)
