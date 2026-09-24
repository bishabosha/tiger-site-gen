package revealLive

import model.SiteRoot
import live.{LiveServer, LiveSite, StudioSettings}

/** A slide's rendered `<section>`, e.g. from an unsaved draft. */
final case class RenderedSlide(id: String, html: String)

/** A single-deck project under a [[SiteRoot]]: [[LiveSite]] with Reveal's defaults. Sources are
 *  in `content/<deck>/`, output in `dist/<deck>/` (live) or `dist-display/<deck>/` (display).
 *
 *  One JVM builds, watches, renders unsaved drafts and serves:
 *  {{{
 *  object MyDeck extends LiveDeck(MySite)(using SiteRoot.here)
 *  @main def deck(args: String*): Unit = MyDeck.main(args)
 *  }}}
 *  `deck dev` (default), `deck build [--display]`, `deck watch [--display]`,
 *  `deck serve [--display] [--port N]`. Content studio opens the deck's `slides/` with the
 *  [[SlidePolicy]]; the display build is served without live features.
 *
 *  @param watched site-root directories whose edits trigger a rebuild, besides the content.
 */
class LiveDeck[D <: String](
    val site: SlideDeck[D],
    contentDirectory: String = "content",
    watched: Seq[String] = Seq("theme", "public")
)(using SiteRoot) extends LiveSite[SlideDeck[D]](site, contentDirectory, RenderMode.Live.outputDirectory, watched):
  def collection: String = site.collection
  /** The deck's slides, relative to the content directory. */
  def slidesDirectory: String = s"$collection/slides"

  def output(mode: RenderMode = RenderMode.selected): os.Path = root.root / mode.outputDirectory
  override def outputRoot: os.Path = output(RenderMode.selected)
  override def editorSources: Seq[String] = Seq(s"${this.contentDirectory}/$collection")
  override def siteUrl: String = s"/$collection/"
  override def studio: StudioSettings = StudioSettings(slidesDirectory, Seq(SlidePolicy(slidesDirectory)))

  /** Serve a mode's output: live with Content studio and drafts, or display files unchanged. */
  def serve(port: Int, mode: RenderMode): LiveServer = serve(port, mode == RenderMode.Live, output(mode))

  override def dev(port: Int): Unit =
    RenderMode.select(RenderMode.Live)
    super.dev(port)

  override protected def selectOptions(args: Seq[String]): Unit =
    if args.contains("--display") then RenderMode.select(RenderMode.Display)
    else if args.contains("--live") then RenderMode.select(RenderMode.Live)
  override protected def serveLive(args: Seq[String]): Boolean =
    RenderMode.selected == RenderMode.Live && !args.contains("--static")

  /** Render `text` in place of the saved slide `file`: its ID and `<section>` in the live deck.
   *  Invalid drafts throw; nothing is written.
   */
  def draftSlide(file: os.Path, text: String): RenderedSlide =
    val id = SlidePolicy.anySlidesDirectory.id(text).getOrElse(throw IllegalArgumentException("Incomplete slide front matter"))
    val deck = drafts.render(file, Map(file -> text)).find(_.route == s"$collection/index.html")
      .getOrElse(throw IllegalArgumentException("Not a slide of this deck"))
    RenderedSlide(id, RevealDrafts.section(deck.html, id).getOrElse(throw IllegalArgumentException(s"No slide $id")))

/** Reveal-specific helpers for draft pages. */
object RevealDrafts:
  /** The top-level `<section id="id">…</section>` of a rendered deck page. */
  def section(html: String, id: String): Option[String] =
    val start = html.indexOf(s"<section id=\"$id\"")
    if start < 0 then None
    else
      val tag = "(?i)<(/?)section\\b".r
      var depth = 0
      tag.findAllMatchIn(html.substring(start)).collectFirst(Function.unlift { m =>
        depth += (if m.group(1).isEmpty then 1 else -1)
        if depth == 0 then Some(html.substring(start, html.indexOf('>', start + m.end) + 1))
        else None
      })
