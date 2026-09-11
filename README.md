# Tiger site generator

A static site generator written in Scala, with typed content trees, composable
themes, and incremental builds.

## Modules and versions

The Mill build is pinned by `.mill-version`; `version` is the shared artifact
version (currently `0.1.0-SNAPSHOT`). All published artifacts use organization
`io.github.bishabosha` and Scala 3's `_3` suffix.

| Mill module | Artifact | Module dependencies |
| --- | --- | --- |
| `core` | `tiger-site-gen-core` | — |
| `revealTheme` | `tiger-site-gen-reveal` | core |
| `breeze` | `tiger-site-gen-breeze` | core |
| `blog.breezeSite` | Not published | breeze |
| `blog.home` | Not published | core |
| `examples` | Not published | Reveal |
| `blog` | Not published | blog.breezeSite, blog.home |

Sources live in each module's `src/`; integration tests live in
`examples/test/src/`, blog build tests in `blog/test/src/`, and Reveal asset
tests in `revealTheme/test/src/`.
Open the repository in Metals, import Mill, and compile/run tests there.

After verification, publish the core and Reveal jars to the local Ivy repository:

```sh
./mill core.publishLocal --doc false
./mill revealTheme.publishLocal --doc false
```

`publishLocal` includes sources and dependency metadata. Omit `--doc false` to
also generate Scaladoc. Update `version` for a new release; keep the consumer's
pinned version in sync. Snapshot versions are for local development.

A Scala CLI consumer uses:

```scala
//> using scala "3.8.3"
//> using options -experimental -preview
//> using repository ivy2local
//> using dep "io.github.bishabosha::tiger-site-gen-core:0.1.0-SNAPSHOT"
//> using dep "io.github.bishabosha::tiger-site-gen-reveal:0.1.0-SNAPSHOT"
```

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

`breeze/` contains shared layouts; `blog/breezeSite/` and `blog/home/` are
blog-specific themes. `blog/package.mill` defines the blog module and its two
non-published theme submodules.
Their sources live in `blog/_docs/` and `blog/_home/`. The blog module preserves
their public URLs.

Run the entry points in `blog/src/blog/makeSite.scala` from an IDE with Metals:

- `blog.makeSite` builds `blog/_docs/` into `dist/breeze/`.
- `blog.makeHome` builds `blog/_home/` into `dist/home/`.
- `blog.watchSite` watches and rebuilds the Breeze site.

From the repository root, the corresponding Mill entry points are:

```sh
./mill blog.run
./mill blog.runMain blog.makeHome
./mill blog.runMain blog.watchSite
```

The simulator source is now `blog/_docs/match-type-simulator/index.md`; its raw HTML
layout and `/match-type-simulator/` URL are unchanged.

## Selecting a field by string type

`Site`, `Directory`, `SiteMapMeta` and `SiteMapMeta.DirectoryData` expose
`_select[Name]` for code whose field name is a type parameter:

```scala
trait DeckHost[DeckName <: String: ValueOf] extends model.Theme:
  type SiteMap = NamedTuple.NamedTuple[
    DeckName *: EmptyTuple, revealTheme.RevealTheme.Deck *: EmptyTuple]

  def deck(site: model.Site[SiteMap]): revealTheme.RevealTheme.Deck =
    site._select[DeckName]

  override val siteMapMeta = defaultSiteMeta._select[DeckName] { deck =>
    deck.index(_.setAsRoot)
  }
  // Supply metadata, templates and extras as usual.
```

The value comes from `ValueOf[Name]`; the result type is
`Record.FieldOf[Fields, Name]`, computed through the named-tuple match types.
On content this selects the precise node type. On metadata it selects the typed
modifier function, so its callback receives the correct document, collection or
directory metadata. A compile-time membership check rejects unknown field names.
The existing literal dot syntax continues to work.

## Extending Breeze

Breeze is a complete About/Articles theme. It owns the base content schemas,
root selection, indexed articles, default layouts, navigation, and page shell.
`blog/breezeSite` adds projects, talks, videos and the simulator, replaces the
About page content, and adds navigation and syntax/math/admonition dependencies.
The reusable `breeze` module has no dependency on these specialisations.

A derived theme extends the base named-tuple schemas and template functions,
then inherits its metadata before applying overrides:

```scala
import breeze.Breeze as parent
import model.Record.++

type SiteMap = parent.SiteMap ++ (
  projects: model.Directory[(
    index: DocOf[FrontMatter.Projects], posts: VarArgDocsOf[FrontMatter.Project]
  )]
)
// Define Templates, Extra and layouts as usual.
override val siteMapMeta = parent.siteMapMeta.extend(defaultSiteMeta)
  .about(_.index(_.layout(dict((about = layouts.about)))))
  .projects(_.index(_.indexed.layout(dict((projects = layouts.projects))))
    .posts(_.layout(dict((project = layouts.project)))))
```

`SiteMapMeta.extend` checks that the original schema is an exact prefix and the
host context conforms to the base context. It recursively retains layouts,
indexed-source flags and root selection. Inherited layouts use the host's
context, including its extended navigation and page dependencies. No base
metadata is mutated. `extendWithContext` supports an explicit context adapter.

BreezeSite reuses the base extras while adding its own values:

```scala
type Extra = parent.Extra
def extras(using SiteContext): Record[Extra] = parent.extendExtras(
  nav = Seq(sctx.site.projects, sctx.site.talks),
  head = HljsExtra.hljsHead ++ KatexExtra.katexHead ++ AdmonitionExtra.admonitionHead,
  foot = HljsExtra.hljsFoot ++ KatexExtra.katexFoot ++ AdmonitionExtra.admonitionFoot
)
```

`breeze.aboutPage.wrap` supplies the shared homepage structure, biography,
navigation and page dependencies while the host supplies its own content cards.
Shared article links follow their documents' and collections' URLs.

## Reusable Reveal theme

`revealTheme/src/revealTheme/` contains `revealTheme.RevealTheme`, Scala layouts, slide validation, timing
manifest, and browser styles. `revealTheme/resources/revealTheme/` contains generic player assets, fonts,
slide fitting, fullscreen controls, and an optional PDF viewer.
There is no presentation-specific content or Node preview server.

Install browser dependencies with `npm ci` (Node 22.13 or newer).
`package.json` is only an asset dependency manifest; it contains no server.
Reveal installs its pinned assets through the `afterRender` hook.

The jar bundles Tiger's player code, CSS and licensed fonts. It does **not**
include Reveal.js or PDF.js. The consumer owns those packages and their versions.
`RevealAssets.fromNpm` looks in the current `SiteRoot`'s `node_modules`; optional
`theme/` and `public/` directories overlay bundled assets file by file.
This works from a published jar without a checkout of the theme sources.

Supply a resolver to locate packages elsewhere (including per-mount locations):

```scala
val presentation = RevealTheme.mount[SiteMap](_.presentation, assets = root =>
  RevealAssets(
    revealJs = root.root / "browser-packages" / "reveal.js",
    pdfJs = root.root / "browser-packages" / "pdfjs-dist",
    publicDirectory = Some(root.root / "public")
  ))
```

The resolver runs in the normal `afterRender` flow with the host's `SiteRoot`,
including embedded-only mounts. Direct use can configure
`new RevealTheme(assetSources = resolver)`. Output asset URLs still derive from
the selected collection, independently of package locations on disk.

A deck is a directory containing an index document, a speaker-notes document,
and a slides collection. See `examples/embedded/content/presentations/` for two
generic decks in the shared `examples/src/mysite/MySite.scala` host example.

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

Generic `ThemeMount` instances install layouts from the mounted theme's own
`siteMapMeta`, including metadata inherited or overridden by a composed extension:

```scala
val presentation = new ThemeMount[SiteMap, RevealTheme.type](RevealTheme)(site =>
  Site.project(site, (deck = site.presentation)))

override val siteMapMeta = defaultSiteMeta.presentation(deck =>
  presentation.installLayouts[Context].deck(deck.index(_.setAsRoot)))
```

The selected name (`deck`) belongs to the mounted theme; the host can use a
different collection name. Each installer is a typed modifier for a document,
collection or directory. Directories install their layouts recursively, including
nested directories and `VarArgDocs`. Configured selectors retain their conditional
results and errors. Host root/indexing settings and layouts on nodes the theme
leaves unconfigured are preserved; subsequent host edits can override installed
layouts. `RevealMount.installLayouts` delegates to this same generic mechanism.

For a prepared mount stored inside another value, use the explicit lookup overload:
`presentation.installLayouts[Context](ctx => ctx.extra.wrapper.prepared).deck`.

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
