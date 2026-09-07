# Tiger site generator

A static site generator written in Scala, with typed content trees, composable
themes, and incremental builds.

## Content model

```scala
type SiteMap = (
  articles: Directory[(index: Doc[IndexMeta], posts: VarArgDocs[ArticleMeta])],
  projects: Directory[(index: Doc[IndexMeta], builds: VarArgDocs[ProjectMeta])]
)
```

- `Doc[A]` is one document, including metadata, content, source path and URL.
- `Docs[A]` reads numbered Markdown documents from its named subdirectory.
- `VarArgDocs[A]` reads remaining numbered documents beside declared singletons.
- `Directory[Fields]` recursively groups any of these nodes.

Schema derivation permits at most one `VarArgDocs` in each directory.
Separate articles and projects directories are checked independently.

A singleton normally reads `<field>.md`. Its `indexed` metadata option resolves
`<number> - <field>.md`, rejecting missing and duplicate matches. Singleton
sources are excluded from sibling `VarArgDocs`. This preserves `/articles/` and
`/articles/example.html` with distinct schemas and layouts.

Layouts attach with `layoutAlways` or a conditional `layout` selector.
`DictionaryTheme.dict` selects layouts from a dictionary's `layout` field.
Set `setAsRoot` on one singleton to select the site's root redirect.
Conflicting output routes are rejected before pages are written.

## Existing sites

`breeze/` contains shared layouts; `breezeSite/` and `home/` are complete themes.
Their sources remain in `_docs/` and `_home/`. The migrated examples preserve
their public URLs.

Run the entry points in `makeSite.scala` from an IDE with Metals:

- `example.makeSite` builds `_docs/` into `out/`.
- `example.makeHome` builds `_home/` into `out_home/`.
- `example.watchSite` watches and rebuilds the Breeze site.

The simulator source is now `_docs/match-type-simulator/index.md`; its raw HTML
layout and `/match-type-simulator/` URL are unchanged.

## Reusable Reveal theme

`revealTheme/` contains `revealTheme.RevealTheme`, Scala layouts, slide validation, timing
manifest, and browser styles. `public/` contains generic player assets, fonts,
slide fitting, fullscreen controls, and an optional PDF viewer.
There is no presentation-specific content or Node preview server.

Install browser dependencies with `npm ci` (Node 22.13 or newer).
`package.json` is only an asset dependency manifest; it contains no server.
Reveal installs its pinned assets through the `afterRender` hook.

A deck is a directory containing an index document, a speaker-notes document,
and a slides collection. See `examples/embedded/content/presentations/` for two
generic decks in the shared `examples/mysite/MySite.scala` host example.

```scala
type SiteMap = (presentation: RevealTheme.Deck)
val presentation = RevealTheme.mount[SiteMap](_.presentation)

type Extra = (presentation: presentation.Prepared)
def extras(using SiteContext): Record[Extra] =
  Record((presentation = presentation.prepare()))

override val siteMapMeta = defaultSiteMeta.presentation(deck =>
  presentation.installLayouts[Context](deck.index(_.setAsRoot)))
```

Mounts retain physical source paths and URLs. `installLayouts` finds the exact
mount's prepared value in the host's typed extras, independently of field names.
Missing or duplicate values fail at compilation. Extras remain statically
accessible to other layouts.

Run `mysite.buildEmbeddedExample` or `mysite.buildEmbeddedOnlyExample` to build
the two-deck article examples. Serve each output directory with any static
server. See [the embedding guide](examples/embedded/README.md) for details.

## Incremental builds

`Context.fromTheme` loads the source tree and prepares extras.
`paths.renderSite` renders pages, then invokes mounted hooks and the host's own
`afterRender`. Asset installation and deck manifests are part of this flow.

`paths.generateSite` tracks source hashes and page dependencies, including
collection membership. It records output routes to remove obsolete nested pages.
Hook failures prevent publication of the updated dependency cache.

Reuse a `BuildSession` for in-memory work across builds:

```scala
val session = new model.BuildSession
val context = Context.fromTheme(contentRoot, theme, session)
// Or paths.generateSite(..., session = session)
```

The watcher retains a session automatically. Unchanged source documents and hashes
are reused according to file identity, size and high-resolution timestamps.
Reveal caches individual slide fragments, rebuilding timing wrappers when order
or durations change. Each context remains a separate snapshot.
Restart the watcher when Scala code changes.

## Tests

Compile and run through Metals:

- `revealTheme.HierarchyChecks`: recursive schemas, static cardinality, indexed
  filenames, routes, and incremental deletion.
- `revealTheme.MountChecks`: mounts, typed extras lookup, layouts, lifecycle hooks,
  cached slides, dictionary layouts, embedding, and generic builds.
- `checks.ExistingThemes`: full Breeze and Homepage rendering with existing URLs.

The filesystem-watch regression is in `revealTheme.WatchTiming`.

Authoring checks use generated generic slide fixtures and do not depend on a
particular presentation or preview server.

## Inspiration

Originally based on Chapter 9 of
[Hands-on Scala Programming](https://www.handsonscala.com/chapter-9-self-contained-scala-scripts.html),
the design has evolved separately.
