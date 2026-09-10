# Mounting Reveal inside another theme

`examples/src/mysite/MySite.scala` is a complete host with an `articles` collection and two
independent presentations. Neither the order nor the names of the host's
collections need to match Reveal's schema.

## Dictionary-based host layouts

`ExampleSite` extends `DictionaryTheme`, so both `MySite` and
`EmbeddedOnlySite` exercise dictionary layout selection in a nested content tree.
The host's article schema is a structural dictionary:

```scala
type ArticleMeta = model.Dictionary {
  val layout: String
  val title: String
}
```

The article singleton and collection use `DocOf[ArticleMeta]` and
`VarArgDocsOf[ArticleMeta]`. Their layout selector is shared:

```scala
private val articleLayouts: model.SiteMapMeta.SelLayout[Context, ArticleMeta] =
  dict((index = articleIndex, article = article))

override val siteMapMeta = defaultSiteMeta
  .articles(_.index(_.indexed.setAsRoot.layout(articleLayouts))
    .posts(_.layout(articleLayouts)))
```

`articles/000 - index.md` selects `layout = "index"` to list the articles with their
document URLs. A post selects `layout = "article"` to render its body and embedded
decks. An empty or unknown key selects no layout; the root document must select
a layout. The mounted Reveal directories retain their case-class metadata and
explicit adapted layouts, demonstrating that a dictionary host can contain
content with other schemas.

The `VarArgDocs[A]` schema node preserves a flat published URL structure while
keeping the index and members independently typed:

```text
content/articles/000 - index.md               → /articles/
content/articles/010 - presentations.md → /articles/presentations.html
```

The Scala accessors remain `site.articles.index` and `site.articles.posts`.
The `posts` field is a logical name; it adds no source or output path segment.
Declared sibling documents are excluded from the collection. Schema derivation
rejects more than one `VarArgDocs` in the same directory. This restriction is
local: `articles` and `projects` may each have their own `VarArgDocs`.
Ordinary `Docs` can coexist in named subdirectories. Conflicting rendered routes
fail before pages are written.

## Define the mounts

The host groups two independent decks under one directory:

```scala
type SiteMap = (
  articles: Directory[(index: Doc[ArticleMeta], posts: VarArgDocs[ArticleMeta])],
  presentations: Directory[(conference: RevealTheme.Deck, workshop: RevealTheme.Deck)]
)
```

A typed selector mounts one existing directory:

```scala
val conference = RevealTheme.mount[SiteMap](_.presentations.conference)
```

The selected directory must have Reveal's `Deck` type. Missing fields, wrong
metadata types, and invalid collection selections fail at compilation. The
projection preserves each collection's real name and its original document
objects and source paths. It also preserves the host's site root and static
asset directory. It does not change `Context.Views.Conforms`.

A mount does not require a standalone presentation page. Its collections can
supply only metadata and slide content for host articles. Publication is a
separate choice, made by attaching the mount's page layouts to the host schema.

Asset URLs and their installation directory are derived from the selected deck
directory. The nested `presentations.conference` deck uses
`/presentations/conference/theme.css`, `/presentations/conference/embed.mjs`, and so on. The convention is the same for public and
embedded-only decks: an asset directory does not require an `index.html`.
Renaming or selecting a different collection updates both the URLs and output
location without an explicit `DeckAssets` value.

Embedded relative image/link URLs default to the same directory. For content
stored elsewhere, use `embed(contentBaseUrl = "/media/conference/")`.

If a host publishes standalone pages, `embed(linkToStandalone = true)` adds a
fallback link derived from the selected collection's `url`. There is no explicit
deck URL to synchronize. Content asset resolution stays independent of that link.

Mounts created inside a theme automatically register with that host. Initial
Markdown parsing discovers their template functions before any mount is prepared,
so the host does not need to compose `RevealTheme.templates` into its dictionary.
Local templates take precedence, followed by mounted themes in declaration order
(including nested mounts). Rendering uses the prepared mount's own context and
typed template dictionary. For mounts defined outside the host, override
`mountedThemes` to expose their themes explicitly.

## Prepare once per build

Store the prepared mount in the host's extras:

```scala
type Extra = (conference: conference.Prepared)
def extras(using SiteContext): Record[Extra] =
  Record((conference = conference.prepare()))
```

Preparation creates a Reveal context over the projected site and evaluates its
extras once. This validates and renders the slide sources before any pages are
written. Each build gets a fresh prepared snapshot. A shared `BuildSession` can reuse
unchanged source documents and slide fragments without a global mount cache. Each
mount's `Prepared` type is distinct, so one deck's prepared state cannot be
supplied to another deck's layout.

## Render a page or embed a fragment

For optional standalone pages, attach the adapted layouts to the host collection:

```scala
override val siteMapMeta = defaultSiteMeta
  .presentations(_.conference(conference.installLayouts[Context]))
```

Omit those deck layout registrations for an embedded-only site. The host still
registers its article layouts and chooses the site root; mounts never set a root.

Inside a host article layout, use the prepared value directly:

```scala
article(
  raw(io.util.md.renderDoc(page.rawContent)),
  ctx.extra.conference.embed()
)
```

The article retains its own context and template functions. The embed enters
the prepared deck's context only while rendering the fragment. You can embed
several decks, or the same deck more than once. Standalone pages and embeds use
the same `DeckLayouts.slidesFragment` renderer and the same prepared slides.

Each fragment includes its own asset references and a progressively enhanced
`<reveal-deck>` element. Its shadow root isolates CSS and duplicate slide IDs
from the article and other players. Each player uses a separate Reveal instance;
keyboard navigation applies only to the focused player, and navigation leaves
the article URL unchanged. Without JavaScript, a notice explains that the player
needs JavaScript, or the optional standalone link opens the published deck.

The embedded player supplies slide navigation and highlighting. Speaker windows,
the PDF explorer, and the full-page presentation controls belong to the standalone
page. Markdown placement can be implemented by a host-specific rendering layer;
this example deliberately uses the typed Scala layout API.

Slide edits, additions and deletions invalidate consuming articles and the deck's
pages. A different mount's standalone pages are not invalidated by those edits.

## Assets and example output

Run `npm ci` to install the pinned Reveal and PDF.js distributions. Calling
`mount.prepare()` while constructing host extras automatically registers the
mounted theme's output hook on that host context. No forwarding `afterRender`
override is needed.

After pages, static files and the favicon are written, Tiger runs registered
mount hooks in preparation order, then the host's own `afterRender` hook.
Nested mounts follow the same rule. Preparing the same mount more than once in
one context replaces its registration rather than duplicating it. Registrations
belong to each context, so later builds cannot change an earlier build's hooks.

Reveal installs assets under the selected collection and writes `deck.json`
last, using the same prepared slides as its layouts. This works for both
standalone and embedded-only decks. A host can still override `afterRender` for
its own output without forwarding to mounts or calling `super`.
The build entry point only needs to call `paths.renderSite` or `paths.generateSite`.

Hooks run on every successful render pass, including incremental passes without
changed pages. A thrown error propagates to the caller and prevents the generator
from publishing its updated dependency cache. Already written files are not
rolled back. The prepared context's `SiteRoot` locates asset sources and supplies
the base for source paths in the manifest.

Run the `mysite.buildEmbeddedExample` main class through the IDE. It writes
`dist/embedded-example`. Serve that directory as the web root, for example:

```sh
python3 -m http.server 8125 --directory dist/embedded-example
```

Visit `/articles/presentations.html`, `/presentations/conference/`, or
`/presentations/workshop/`.

`mysite.buildEmbeddedOnlyExample` writes `dist/embedded-only-example` using the
same sources and mounts. Serve that directory as the web root to see the articles
with embedded decks and no standalone presentation or notes pages.
`EmbeddedOnlySite` and `MySite` share the `ExampleSite` implementation in
`examples/src/mysite/MySite.scala`; the difference is whether it registers the deck layouts.

The MUnit suite `revealTheme.MountChecks` can be run through Metals. It covers typed
selectors, mount isolation, projected source identity, standalone and article
rendering, incremental changes, the original authoring contract, and generation
of the example output.

## Tiger primitives

- `Site.project(source, namedNodes)` constructs typed content-node aliases.
- `Context.fromSite(theme)(site)` constructs fresh extras over an existing site.
- `Layout.contramapContext` adapts a layout using an explicit context conversion.
- `Theme.afterRender` completes theme-owned output in the normal render flow.
- `ThemeMount` combines projection, preparation, layout adaptation, and automatic hook registration for any
  Tiger theme. `RevealMount` adds Reveal's fragment and asset conventions.


For existing numbered singleton sources, opt into `indexed` metadata:

```scala
defaultSiteMeta.articles(_
  .index(_.indexed.setAsRoot.layout(indexSelector))
  .posts(_.layout(articleSelector)))
```

An indexed `index` field scans its containing directory for
`<number> - index.md`, such as `000 - index.md`. This works for any `Doc`
field (for example, `about` can load `010 - about.md`), with exact suffix
matching. Zero matches or multiple matches are errors. Without `indexed`,
the field still loads `<field>.md`. Resolved singleton files are excluded from
sibling `VarArgDocs`; their numeric prefixes never affect public URLs.


`installLayouts[Context]` retrieves the prepared mount from the host's typed
extras automatically. It requires exactly one field whose type is that mount's
path-dependent `Prepared` type. Field names and ordering are arbitrary; another
mount's prepared value is a different type. Missing or duplicate matches fail
at compilation. Extras remain directly accessible as `ctx.extra.conference`,
and the lookup always uses the current host context's value.

This uses `Context.ExtraValue[C, A]`, derived through `Record.SelectByType`.
No additional runtime registry or preparation is involved. Explicit
`index` and `notes` adapters remain available when a custom selector is needed.

## Aligning column content

Columns are vertically centered by default. Use `{{columns top}}` to align all
columns in that row to the top. To top-align just one column, wrap its contents
in `{{stack top}}` … `{{end-stack}}` inside a columns group. Other columns retain
their normal alignment.

For several aligned rows grouped centrally, put the row-by-row `{{columns top}}`
groups inside one outer `{{stack}}`. The outer stack centers the group with
compact spacing, while each row aligns its cells at their top edges.
