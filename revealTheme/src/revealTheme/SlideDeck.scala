package revealTheme

import scala.language.experimental.modularity

/** A presentation website that owns its sources and routes, and mounts a Reveal theme
 *  on its single collection `content/<DeckName>/` (served at `/<DeckName>/`).
 */
trait SlideDeck[DeckName <: String: ValueOf](tracked val slideTheme: model.Theme { type SiteMap = RevealTheme.SiteMap })
extends model.InferredExtras, model.EmptyTemplates:
  val collection: DeckName = valueOf[DeckName]
  val metadata: model.Theme.Metadata = new:
    val name = "Slide Deck " + collection

  val presentation = mount(slideTheme)(paths =>
    (deck = paths._select[DeckName]))

  type SiteMap = NamedTuple.NamedTuple[DeckName *: EmptyTuple, RevealTheme.Deck *: EmptyTuple]

  val extraDefs = defineExtras {
    (presentation = presentation.prepare())
  }

  override val siteMapMeta = presentation.extend(defaultSiteMeta)
    ._select[DeckName](_.index(_.setAsRoot))
