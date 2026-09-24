package revealLive

import model.SiteMapSchema.auto.given
import revealTheme.{DeckFonts, RevealAssets, RevealTheme}
import scala.NamedTuple.AnyNamedTuple

/** Reveal with live/display page layouts, the bundled slide authoring UI and incremental asset installs.
 *
 *  `templates` must start with Reveal's own ({{stack}}, {{columns}}, ...), usually extended with
 *  the host's:
 *  {{{
 *  class TalkTheme extends LiveRevealTheme(
 *    RevealTheme.templates ++ MyTemplates.templates,
 *    page = LivePage(stylesheets = Seq("assets/style.css")))
 *  }}}
 *  Use `LiveRevealTheme()` for Reveal's templates only.
 */
class LiveRevealTheme[T <: AnyNamedTuple](
    templates: model.TemplateFunctions[T],
    fonts: DeckFonts = DeckFonts(),
    val assetSources: RevealAssets.Resolver = RevealAssets.fromNpm,
    val page: LivePage = LivePage()
)(using model.Record.IsSubPrefix[T, LiveRevealTheme.RevealTemplates]) extends model.InferredExtras, model.InferredTemplates:
  protected final val reveal: RevealTheme = new RevealTheme(assetSources, fonts)
  private val installedAssets = scala.collection.mutable.Map.empty[os.Path, Seq[(os.Path, Long, String)]]
  val metadata: model.Theme.Metadata = reveal.metadata

  val templateDefs: model.TemplateFunctions[T] = templates

  type SiteMap = RevealTheme.SiteMap

  val extraDefs = reveal.extraDefs

  override val siteMapMeta = reveal.siteMapMeta
    .deck(_.index(_.layoutAlways(LiveLayouts.selected(page))))
    .extend(defaultSiteMeta)

  /** The deck's rendered slides, in a context of this theme (e.g. for draft previews). */
  def renderedSlides(using Context): Vector[revealTheme.Slides.Rendered] = model.ctx.extra.slides.read()

  override def afterRender(outputRoot: os.Path)(using Context): Unit = synchronized {
    val sources = assetSources(model.ctx.siteRoot)
    val dest = outputRoot / model.ctx.site.deck.outputPath
    val mode = RenderMode.selected
    // Markdown edits do not change the large Reveal/PDF.js/font bundles. Keep
    // their installation across builds, but invalidate for authored asset edits.
    // Dependency installations are picked up when the watcher restarts.
    val inputs = (sources.themeDirectory.toSeq ++ sources.publicDirectory.toSeq).flatMap { directory =>
      if os.exists(directory) then os.walk(directory).filter(os.isFile) else Seq.empty
    }.sortBy(_.toString).map { path =>
      val stat = os.stat(path)
      (path, stat.size, stat.mtime.toString)
    } :+ ((dest / "authoring", 0L, mode.label))
    val complete = Seq("deck.json", "theme.css", "fonts.css", "vendor/reveal/dist/reveal.js", "vendor/pdfjs/pdf.mjs")
      .forall(name => os.isFile(dest / os.RelPath(name)))
    if !complete || !installedAssets.get(dest).contains(inputs) then
      val authoring = dest / "authoring"
      if mode == RenderMode.Live then RevealLiveResources.installAuthoring(authoring)
      else if os.exists(authoring) then os.remove.all(authoring)
      reveal.afterRender(outputRoot)
      installedAssets(dest) = inputs
    else
      // The upstream hook combines asset installation with manifest generation.
      // Refresh just its manifest on content-only builds.
      val meta = model.ctx.site.deck.index.frontMatter
      val slides = model.ctx.extra.slides.read()
      val root = model.ctx.siteRoot.root
      val manifest = ujson.Obj(
        "title" -> meta.title, "author" -> meta.author, "event" -> meta.event,
        "mainSlides" -> slides.count(!_.appendix), "totalSeconds" -> slides.map(_.seconds).sum,
        "slides" -> ujson.Arr.from(slides.map(s => ujson.Obj(
          "id" -> s.id, "title" -> s.title, "seconds" -> s.seconds,
          "startSeconds" -> s.start, "appendix" -> s.appendix,
          "source" -> s.source.relativeTo(root).toString)))
      )
      os.write.over(dest / "deck.json", ujson.write(manifest, indent = 2))
  }

object LiveRevealTheme:
  type RevealTemplates = RevealTheme.Templates

  /** Reveal's templates only. */
  def apply(fonts: DeckFonts = DeckFonts(), assetSources: RevealAssets.Resolver = RevealAssets.fromNpm,
      page: LivePage = LivePage()): LiveRevealTheme[RevealTemplates] =
    new LiveRevealTheme(RevealTheme.templates, fonts, assetSources, page)
