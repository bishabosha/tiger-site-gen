package revealTheme

import model.{TemplateFunction, TemplateFunctions, Directory}
import model.SiteMapSchema.auto.given

case class DeckMeta(title: String, author: String, event: String, description: String)
    derives scalanotation.Reader

case class SlideMeta(id: String, seconds: Int, layout: String, fontSize: Option[Int] = None)

object SlideMeta:
  given scalanotation.Configured[SlideMeta] = scalanotation.Configured.skippable
  given scalanotation.Reader[SlideMeta] = scalanotation.Reader.configured.derived[SlideMeta]

case class NotesMeta(title: String) derives scalanotation.Reader

/** Factories and shared schema for the final Reveal theme. */
object RevealTheme:
  private def classes(value: String): String =
    require(value.matches("[a-zA-Z0-9 _-]*"), s"Invalid layout classes: $value")
    value.trim

  private def template(render: String => String): TemplateFunction =
    TemplateFunction(render, render)

  val defaultTemplates = TemplateFunctions(
    (
      stack = template(args => s"<div class=\"stack ${classes(args)}\">\n"),
      `end-stack` = template(_ => "</div>\n"),
      columns = template(args => s"<div class=\"columns ${classes(args)}\">\n"),
      `end-columns` = template(_ => "</div>\n"),
      br = template(_ => "<br>"),
      spacer = template { args =>
        require(args.isEmpty, "{{spacer}} takes no arguments")
        "<span class=\"inline-spacer\" aria-hidden=\"true\"></span>"
      }
    )
  )

  type Templates = defaultTemplates.Fields

  type DeckSources = (
      index: model.Doc[DeckMeta],
      `speaker-notes`: model.Doc[NotesMeta],
      slides: model.Docs[SlideMeta]
  )
  type Deck = Directory[DeckSources]
  type SiteMap = (deck: Deck)
  type Extra = (slides: Slides.Deck, fonts: DeckFonts, assets: DeckAssets)
  type Context = model.Context.Views.View[model.Context.Of[SiteMap, Extra, Templates]]
  type SiteContext = model.Context.Views.SiteView[model.SiteContext.Of[SiteMap]]
  type LayoutOf[A] = model.Layout[Context, model.Doc[A]]

  /** A fresh theme with the built-in template dictionary. */
  def apply(
      assetSources: RevealAssets.Resolver = RevealAssets.fromNpm,
      fonts: DeckFonts = DeckFonts(),
      slideLayouts: Map[String, SlideLayout] = Map.empty,
      page: DeckPage = DeckPage()
  ): RevealTheme[Templates] =
    withTemplates(defaultTemplates, assetSources, fonts, slideLayouts, page)

  /** A fresh theme with a composed dictionary that retains the built-in template fields. */
  def withTemplates[T <: scala.NamedTuple.AnyNamedTuple](
      templates: TemplateFunctions[T],
      assetSources: RevealAssets.Resolver = RevealAssets.fromNpm,
      fonts: DeckFonts = DeckFonts(),
      slideLayouts: Map[String, SlideLayout] = Map.empty,
      page: DeckPage = DeckPage()
  )(using model.Record.IsSubPrefix[T, Templates]): RevealTheme[T] =
    new RevealTheme(templates, assetSources, fonts, slideLayouts, page)

/** One Reveal theme; callers may supply a dictionary extending the companion's defaults. */
final class RevealTheme[T <: scala.NamedTuple.AnyNamedTuple](
    templates: TemplateFunctions[T],
    val assetSources: RevealAssets.Resolver = RevealAssets.fromNpm,
    val fonts: DeckFonts = DeckFonts(),
    val slideLayouts: Map[String, SlideLayout] = Map.empty,
    val page: DeckPage = DeckPage()
)(using model.Record.IsSubPrefix[T, RevealTheme.Templates])
    extends model.InferredExtras, model.InferredTemplates:
  val metadata: model.Theme.Metadata = new:
    val name = "Reveal"

  val templateDefs: TemplateFunctions[T] = templates

  type SiteMap = RevealTheme.SiteMap

  private def adapt[A](layout: RevealTheme.LayoutOf[A]): LayoutOf[A] =
    layout.contramapContext[Context] { host =>
      given Context = host
      summon[RevealTheme.Context]
    }

  override val siteMapMeta = defaultSiteMeta
    .deck(_.index(_.setAsRoot.layoutAlways(adapt(DeckLayouts.standalone(page))))
      .`speaker-notes`(_.layoutAlways(adapt(DeckLayouts.notes))))

  val extraDefs: ExtraDefinition { type Out = RevealTheme.Extra } = defineExtras {
    (slides = Slides.render(SlideLayout.defaults ++ slideLayouts), fonts = RevealTheme.this.fonts,
      assets = DeckAssets.prepare(assetSources(model.sctx.siteRoot), RevealTheme.this.fonts, model.sctx.buildSession))
  }

  override def resolveAsset(url: String)(using Context): String =
    if url.startsWith("/static/") then super.resolveAsset(url)
    else model.ctx.extra.assets.resolve(url, model.ctx.site.deck.url)

  override def afterRender(outputRoot: os.Path)(using Context): Unit =
    DeckOutput.write(outputRoot)
