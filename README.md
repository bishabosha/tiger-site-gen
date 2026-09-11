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

## Inferring extras from their definition

A theme can extend `model.InferredExtras` to infer `Extra` from a single deferred
definition:

```scala
val extraDefs = defineExtras {
  (presentation = presentation.prepare())
}
```

The abstract `extraDefs` member is a `tracked val` (Scala's experimental
modularity feature). Its inferred `Out` refinement remains visible through
`Extra = extraDefs.Out`, including each mount's distinct `Prepared` type. Keep
the override's inferred type; annotating it as just `ExtraDefinition` would lose
that refinement. The definition stores a recipe: `Context.fromTheme` and
`Context.fromSite` evaluate it once for each fresh context, with that context's
site available and before rendering begins. Prepared values are never cached on
the shared theme object.

Themes with the same sitemap can reuse a definition directly:

```scala
val extraDefs = RevealTheme.extraDefs
```

`InferredExtras.ExtraDefinition` is indexed by its required site context rather
than a theme instance. Reuse preserves the exact `Out` type and shares only the
recipe: each build supplies the receiving theme's current site context, including
its site, theme, build session and output hooks. An incompatible sitemap is
rejected at compilation. No context reset or wrapping function is needed.

Use `defineExtraRecord` when reusing a function that already returns `Record[E]`
or when augmenting the source extras, as BreezeSite does below.
The original `Theme` API still supports explicit `type Extra` and `def extras`.
A concrete parent's fixed schema cannot be replaced by overriding a value;
extend such schemas through composition, as BreezeSite does below.

## Inferring template functions

Mix in `model.InferredTemplates` and define the dictionary once:

```scala
val templateDefs = parent.templates ++ model.TemplateFunctions((
  marker = model.TemplateFunction(_ => "Marker", _ => "Marker")
))
```

The tracked `templateDefs` value carries its schema through
`Templates = templateDefs.Fields`. The final `templates` accessor returns that
same dictionary, so named selection, concatenation and context conformance retain
the precise field types. Keep the overriding value's inferred type instead of
widening it to `TemplateFunctions[?]`. No definition wrapper is needed: the
dictionary already contains its field type. Dictionary construction happens when
the theme is initialized; template rendering still receives the current context.

`Theme.templates` is an abstract method so this mixin can forward to the
initialized value. Existing themes can continue implementing it with a `val` and
an explicit `type Templates`. The `breeze.Breeze` and `breezeSite.BreezeSite`
objects combine `InferredTemplates` with `InferredExtras`; each mixin removes its
corresponding duplicate schema declaration. Breeze supplies
`List[ContentNode]` and `Seq.empty[Modifier]` so inference preserves the element
types expected by layouts and extensions.

A host that gets all its template functions from mounted themes can also mix in
`model.EmptyTemplates`:

```scala
trait DeckHost extends model.InferredExtras, model.EmptyTemplates:
  // Define metadata, SiteMap, mounts and extraDefs.
```

This finalizes both `Templates = NamedTuple.Empty` and
`templates = TemplateFunctions.Empty`. Mounted themes still supply their own
template functions through the normal lookup and rendering paths.

`model.EmptyExtras` finalizes `Extra = NamedTuple.Empty` and supplies an empty
record when a context is built. `home.Homepage` combines `EmptyExtras` with
`EmptyTemplates`, so it needs neither extras nor template definitions:

```scala
object Homepage extends model.EmptyExtras, model.EmptyTemplates:
  // Define metadata, SiteMap and layouts.
```

## Extending Breeze

Breeze is a complete About/Articles theme. It owns the base content schemas,
root selection, indexed articles, default layouts, navigation, and page shell.
`blog/breezeSite` defines `breezeSite.BreezeSite`, which adds projects, talks, videos
and the simulator, replaces the
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

BreezeSite mixes `model.InferredExtras` into its `model.DictionaryTheme` and reuses
the base extras while adding its own values:

```scala
val extraDefs = defineExtraRecord {
  parent.extendExtras(
    extraNav = Seq(sctx.site.projects, sctx.site.talks),
    extraHead = HljsExtra.hljsHead ++ KatexExtra.katexHead ++ AdmonitionExtra.admonitionHead,
    extraFoot = HljsExtra.hljsFoot ++ KatexExtra.katexFoot ++ AdmonitionExtra.admonitionFoot
  )
}
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
val slideTheme = new RevealTheme(assetSources = root =>
  RevealAssets(
    revealJs = root.root / "browser-packages" / "reveal.js",
    pdfJs = root.root / "browser-packages" / "pdfjs-dist",
    publicDirectory = Some(root.root / "public")
  ))
val presentation = mount(slideTheme)(paths => (deck = paths.presentation))
```

The resolver runs in the normal `afterRender` flow with the host's `SiteRoot`,
including embedded-only mounts. Direct use can configure
`new RevealTheme(assetSources = resolver)`. Output asset URLs still derive from
the selected collection, independently of package locations on disk.

The `RevealTheme` class uses `InferredExtras` and `InferredTemplates`, including
its default singleton and instances with custom asset resolvers. `templateDefs`
defines the five built-in template functions; `extraDefs` defers `Slides.render()`
until each context is constructed. Both public schemas are inferred from those
definitions, and composed themes retain the same template and extras types.

A deck is a directory containing an index document, a speaker-notes document,
and a slides collection. See `examples/embedded/content/presentations/` for two
generic decks in the shared `examples/src/mysite/MySite.scala` host example.
Inside a `model.InferredExtras` host:

```scala
type SiteMap = (presentation: RevealTheme.Deck)
val presentation = mount(RevealTheme)(paths => (deck = paths.presentation))

val extraDefs = defineExtras {
  (presentation = presentation.prepare())
}

override val siteMapMeta = presentation.extend(defaultSiteMeta)
  .presentation(_.index(_.setAsRoot))
```

Mounts retain physical source paths and URLs. `extend` finds the exact mount's
prepared value in the host's typed extras, independently of field names. Missing
or duplicate prepared values fail at compilation.

Inside a host theme, `mount(child)` infers the host sitemap and preserves the
child's singleton type. The resulting `ThemeMount` uses its declared projection to
inherit the child's `siteMapMeta`, including a composed extension's overrides:

```scala
val presentation = mount(RevealTheme)(paths =>
  (deck = paths.presentation))

override val siteMapMeta = presentation.extend(defaultSiteMeta)
  .presentation(_.index(_.setAsRoot))
```

The helper registers the child on the receiving host; it also works as
`host.mount(child)(paths => ...)` outside the host definition. The explicit
`ThemeMount` constructor remains available for standalone mounts.

The mapping is declared once: `deck` maps to the host's `presentation`. Nested
selections and aliases follow that same projection automatically. Layout selectors
and indexed-source metadata are inherited before content is loaded; unselected
host nodes are retained. Apply host overrides after `extend`. Root selection
remains a host setting, so multiple mounts can coexist without claiming the root.
An existing host root flag is preserved.

The mount's builder receives typed `SiteProjection.Paths` and returns a named
tuple of selections matching the mounted theme's sitemap. `ThemeMount` captures
that tuple internally as a `SiteProjection[HostMap, MountedMap]` value.
The builder runs once, when the mount is declared. `prepare()` selects real nodes
through the stored paths; `extend()` installs metadata through those same paths.
Neither operation reruns the builder. Document content and collection operations
are unavailable on paths, so content-dependent selections fail at compilation.
Missing or misspelled target fields and incompatible node types also fail at compilation;
overlapping host paths are rejected when the projection is declared. The paths
support `._select[Name]` for abstract string types. Prepared contexts and output
hooks still belong to each mount's `Prepared` value.

An explicit prepared-value lookup is available when it is nested inside another
extra: `presentation.extend(defaultSiteMeta, ctx => ctx.extra.wrapper.prepared)`.
For manual placement of individual layouts, `installLayouts[Context].deck` remains
available; that operation preserves host indexing and unconfigured host layouts.

Reveal uses the generic `ThemeMount` for preparation, metadata, layouts and output
hooks. Render an embedded fragment inside its prepared context:

```scala
ctx.extra.presentation.render {
  DeckLayouts.embedded(linkToStandalone = true)
}
```

`DeckLayouts.embedded` derives asset and content URLs from the selected physical
deck. Pass `contentBaseUrl` to override the content location. Configure asset
sources on the `RevealTheme` instance before mounting it.

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
