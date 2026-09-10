package revealTheme

import model.{Context, Doc, Layout, Site, SiteContext, ThemeMount}
import scalatags.Text.all.*
import model.SiteMapMeta
import revealTheme.RevealTheme.Deck
import model.SiteMapMeta.DirectoryData

/** A deck mounted under host-owned collection names and URLs. */
final class RevealMount[HostMap <: NamedTuple.AnyNamedTuple](
    collections: Site[HostMap] => RevealTheme.Deck,
    assets: RevealAssets.Resolver = RevealAssets.fromNpm
)(using mounts: model.Theme.Mounts = new model.Theme.Mounts):
  private val theme = new RevealTheme(assets)
  private val mounted = new ThemeMount[HostMap, RevealTheme](theme)(site =>
    Site.project(site, (deck = collections(site)))
  )(using mounts)

  final class Prepared private[RevealMount] (private val value: mounted.Prepared):
    val context: RevealTheme.Context = value.context
    private val assets = DeckAssets(context.site.deck.url)

    /** Self-contained fragment. Each occurrence gets an isolated Reveal instance. */
    def embed(
        linkToStandalone: Boolean = false,
        contentBaseUrl: String = assets.baseUrl
    ): Frag = value.render {
      DeckLayouts.embedded(assets, linkToStandalone, contentBaseUrl)
    }

  def prepare()(using SiteContext.Of[HostMap]): Prepared =
    new Prepared(mounted.prepare())

  type ModifyDeck[C <: Context] =
    DirectoryData[C, RevealTheme.DeckSources] => DirectoryData[C, RevealTheme.DeckSources]

  def installLayouts[C <: Context](using sel: Context.ExtraValue[C, Prepared]): ModifyDeck[C] = _
    .index(_.layoutAlways(index(sel.apply)))
    .`speaker-notes`(_.layoutAlways(notes(sel.apply)))

  def index[C <: Context](prepared: C => Prepared): Layout[C, Doc[DeckMeta]] =
    DeckLayouts.index.contramapContext(host => prepared(host).context)

  def notes[C <: Context](prepared: C => Prepared): Layout[C, Doc[NotesMeta]] =
    DeckLayouts.notes.contramapContext(host => prepared(host).context)
