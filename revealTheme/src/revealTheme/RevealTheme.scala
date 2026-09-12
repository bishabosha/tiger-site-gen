package revealTheme

import model.{TemplateFunction, TemplateFunctions}
import model.SiteMapSchema.auto.given

case class DeckMeta(title: String, author: String, event: String, description: String)
    derives scalanotation.Reader

case class SlideMeta(id: String, seconds: Int, layout: String, fontSize: Option[Int] = None)

object SlideMeta:
  given scalanotation.Configured[SlideMeta] = scalanotation.Configured.skippable
  given scalanotation.Reader[SlideMeta] = scalanotation.Reader.configured.derived[SlideMeta]

case class NotesMeta(title: String) derives scalanotation.Reader

/** Reveal layouts expressed through Tiger's existing Markdown template system. */
object RevealTheme extends RevealTheme(RevealAssets.fromNpm)

class RevealTheme(val assetSources: RevealAssets.Resolver = RevealAssets.fromNpm)
    extends model.InferredExtras, model.InferredTemplates:
  val metadata: model.Theme.Metadata = new:
    val name = "Reveal"

  private def classes(value: String): String =
    require(value.matches("[a-zA-Z0-9 _-]*"), s"Invalid layout classes: $value")
    value.trim

  private def template(render: String => String): TemplateFunction =
    TemplateFunction(render, render)

  val templateDefs = TemplateFunctions(
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

  type DeckSources = (
      index: model.Doc[DeckMeta],
      `speaker-notes`: model.Doc[NotesMeta],
      slides: model.Docs[SlideMeta]
  )
  type Deck = model.Directory[DeckSources]
  type SiteMap = (deck: Deck)

  override val siteMapMeta = defaultSiteMeta
    .deck(_.index(_.setAsRoot.layoutAlways(DeckLayouts.index))
      .`speaker-notes`(_.layoutAlways(DeckLayouts.notes)))

  val extraDefs = defineExtras {
    (slides = Slides.render())
  }

  override def afterRender(outputRoot: os.Path)(using Context): Unit =
    DeckOutput.write(outputRoot, assetSources(model.ctx.siteRoot))
