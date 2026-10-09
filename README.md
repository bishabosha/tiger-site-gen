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
| `live` | `tiger-site-gen-live` | core |
| `revealTheme` | `tiger-site-gen-reveal` | live |
| `breeze` | `tiger-site-gen-breeze` | core |
| `blog.breezeSite` | Not published | breeze |
| `blog.home` | Not published | core |
| `examples` | Not published | Reveal |
| `blog` | Not published | blog.breezeSite, blog.home, live |

Sources live in each module's `src/`; integration tests live in
`examples/test/src/`, blog build tests in `blog/test/src/`, Reveal asset and slide authoring
tests in `revealTheme/test/src/`, and live-server tests in `live/test/src/`.
The VS Code extension for Tiger Markdown is in `tooling/vscode-tiger-templates/`.
Open the repository in Metals, import Mill, and compile/run tests there.

After verification, publish the jars to the local Ivy repository:

```sh
./mill core.publishLocal --doc false
./mill live.publishLocal --doc false
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
//> using dep "io.github.bishabosha::tiger-site-gen-live:0.1.0-SNAPSHOT"          # live editing for any site (included by reveal)
```

## Document sources

Start Markdown documents with a Scala Object Notation value between `---scala`
and a closing `---` on its own line:

```markdown
---scala
(
  layout = "article",
  title = "Hello",
  description = "A typed document",
  published = "01/Jan/2026"
)
---

# Document content
```

The fields come from the document's metadata type. The value is still SON,
including record parentheses, imports, comments and dedented strings; it is not
YAML. The opening delimiter must be on the first line (a UTF-8 BOM is accepted).
The closing delimiter is reserved and ends the metadata block. Both LF and CRLF
line endings work, and the body after the delimiter is passed to Markdown.

Existing sources using a fenced `scala` block followed by `---`, optionally
preceded by another `---`, remain supported.

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
val extraDefs = RevealTheme().extraDefs
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

## Markdown block templates

`TemplateFunction` handles inline calls; `BlockTemplateFunction` handles calls
with a Markdown body. They are separate interfaces. `TemplateFunctions` accepts
either kind and retains each field's precise type, including after composition
and inference. Using the wrong Markdown syntax reports an error during lookup.

Register a block renderer in the same named-tuple dictionary as inline templates:

```scala
import model.{BlockTemplateFunction, TemplateBody, TemplateFunctions}
import scalatags.Text.all.*

def panel(title: String, body: TemplateBody): String =
  tag("aside")(h3(title), raw(body.html)).render

val templateDefs = parent.templates ++ TemplateFunctions((
  panel = BlockTemplateFunction(panel, panel)
))
```

Authors supply the arguments on the opening line and Markdown between the fences:

```markdown
:::panel Related ideas

- **Collections**
  - Flat representation
  - Default `Seq`

:::
```

`TemplateBody.children` exposes the parsed Flexmark nodes for renderers that
interpret structure, such as mind maps or timelines. `render(node)`,
`renderChildren(node)` and `html` use the document's configured Markdown
extensions and reference links. They render HTML for inclusion in the template's
output. Escape arguments as ordinary text, as the ScalaTags example does.

The first function passed to `BlockTemplateFunction` receives the live `Context`;
the second supports initial parsing before extras and mounted contexts exist.
Composition, inferred schemas and default lookup through generic mounts work the
same way as for inline templates. `md.renderDoc` renders against the live context;
`md.parseDryRun` uses the default function. `md.renderRaw` remains inline-only for
raw HTML documents.

Blocks can nest: a standalone `:::` closes the innermost block. Nested templates
render before their parents. Their original Markdown nodes remain available to
extension visitors. Fragment rendering collects only the fragment's HTML, leaving
document-level output, such as Admonition's SVG icons, to the final render.
Fenced and indented code, raw HTML and HTML comments retain literal block syntax;
unclosed blocks and unmatched closing fences report their line number. Inline
`{{…}}` interpolation retains its existing behavior, including inside code fences.

Markdown attributes inside a body retain their usual targets. Attributes attached
to the template container (for example, a separate `{.wide #overview}` paragraph
after its closing fence) decorate a `div` around its output. Without container
attributes, no wrapper is added. Attributes written in the opening arguments are
still interpreted by the template itself.

GitLab `>>>` fences retain their existing rule: the next `>>>` closes the quote.
Close any templates inside the quote before that marker; use ordinary `>` Markdown
quotes when nesting quotes through templates.

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
There is no presentation-specific content; the preview server lives in `live`.

Slide routes retain their front-matter IDs (`#/toolkit`). Rendered heading anchors
are scoped by slide (`heading:scope:toolkit`), with a separate `notes-heading:`
namespace for speaker notes. Local Markdown links such as `#toolkit` follow the
scoped heading; `#/toolkit` always addresses the slide. IDs and local links are
prepared in the Markdown AST before block templates render, without parsing or
rewriting generated HTML. The build rejects duplicate slide IDs and duplicate
heading IDs within each slide or its notes. Raw HTML passes through unchanged;
its author is responsible for any manually assigned IDs.

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
val slideTheme = RevealTheme(assetSources = root =>
  RevealAssets(
    revealJs = root.root / "browser-packages" / "reveal.js",
    pdfJs = root.root / "browser-packages" / "pdfjs-dist",
    publicDirectory = Some(root.root / "public")
  ))
val presentation = mount(slideTheme)(paths => (deck = paths.presentation))
```

The resolver runs in the normal `afterRender` flow with the host's `SiteRoot`,
including embedded-only mounts. Direct use can configure
`RevealTheme(assetSources = resolver)`. Output asset URLs still derive from
the selected collection, independently of package locations on disk.

`RevealTheme` is final and uses `InferredExtras` and `InferredTemplates`.
`RevealTheme(...)` creates a fresh instance with the built-in templates;
`RevealTheme.withTemplates(dictionary, ...)` accepts a composed dictionary that
retains the built-in fields. Both factories accept asset sources, fonts, slide layouts
and page settings. The companion holds `defaultTemplates` and shared schema types;
it is not itself a theme. `templateDefs` preserves the supplied dictionary's exact
schema, and `extraDefs` defers `Slides.render()` until each context is constructed.

A deck is a directory containing an index document, a speaker-notes document,
and a slides collection. Slide metadata requires `id` and `layout`; `seconds` is
optional and defaults to 5. Main-slide durations must be positive, while appendix
slides do not contribute to the running time. A slide's `## Speaker notes`
section may be empty or omitted. New slides leave timings and notes for the author. See `examples/embedded/content/presentations/` for two
generic decks in the shared `examples/src/mysite/MySite.scala` host example.
Inside a `model.InferredExtras` host:

```scala
type SiteMap = (presentation: RevealTheme.Deck)
val presentation = mount(RevealTheme())(paths => (deck = paths.presentation))

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
val presentation = mount(RevealTheme())(paths =>
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

## Live editing: preview server, Content studio and drafts

`tiger-site-gen-live` (`live/`, depends on core only) turns any Tiger site into a
local authoring environment. One JVM builds the site, watches its sources, renders
unsaved VS Code buffers and serves the output with automatic refresh; no Node server
is involved.

```scala
import live.{LiveSite, LiveSiteSettings}

val blogSite = LiveSite(MyTheme, LiveSiteSettings(
  contentDirectory = "content", watched = Seq("theme", "public")))(using SiteRoot.here)
@main def blog(args: String*): Unit = blogSite.main(args)
```

| Command | Effect |
| --- | --- |
| `blog dev [--port N]` | build, watch, render drafts and serve with live features at 8123 (default command) |
| `blog build` | one build |
| `blog watch` | build, then rebuild on save |
| `blog serve [--static] [--port N]` | serve the output: live (8123), or unchanged with `--static` (8127) |

`PORT` also selects the port. Scala changes need a restart. `LiveSiteSettings`
configures output directories, `siteUrl` (the page announced on start), `studio`
(Content studio's first collection and policies), `noReload` and `editorSources`.
The Breeze blog is a runnable example: `./mill blog.runMain blog.liveBlog`
(see `blog/src/blog/makeSite.scala`).

`LiveSite` is final. Its constructor takes a `SiteBuilder`, a `DraftRenderer` and
`LiveSiteSettings`; the factory above assembles `ThemeBuilder` and `SiteDrafts` for
a Tiger theme. Custom components use the same host and HTTP server:

```scala
val site = new LiveSite(builder = myBuilder, drafts = myDraftRenderer, settings = mySettings)
```

The builder returns page dependencies, which the host passes to `DraftRenderer.learn`
before publishing a successful build. Draft renderers that do not track dependencies
can keep the default no-op. `OutputDirectories(live = "dist", static = "dist-display")`
selects separate destinations; `build(mode)`, `watch(mode = mode)` and `serve(port, mode)`
select a mode for each operation. CLI options never mutate the host or an existing watcher.

**Builds.** `ThemeBuilder` prepares a context, runs `renderSite` (including every
`afterRender` hook) and writes `.tiger-editor.json`. `LiveSite` then writes the build marker
`<output>/.tiger-build.json`: a `BuildStatus` with a unique revision, `ok`, and a
failure's message and stack trace. A failed build keeps the previous output. In `dev`
the builder also hands the status to the server directly; a server in another process
(`watch` plus `serve`) polls the marker.

**Browser client** (`/static/live/client_<hash>.js`). The server injects it into generated
pages only: HTML routes listed in the build's `.outputs.json`, so copied HTML assets
(standalone viewers, embeds) are untouched. A page opts out with `data-live="off"`
on any element, and `LiveSiteSettings.noReload` lists output-relative globs to skip. Static
serving (`serve --static`) never injects it. On each completed build the client
refetches the page, swaps changed stylesheets after the replacement has loaded (no
flash), morphs `<body>` in place (keeping scroll position and unchanged DOM), refreshes
same-origin images when nothing else changed, and reloads when scripts change (the
page's script list, or the content of any same-origin script). A failed build shows a
red overlay with the message and trace (isolated in a shadow root); the next success
removes it. Pages the failed build could not produce are served as a placeholder (503)
that reloads on recovery. Alt+Shift+E opens the page's source in the editor.

Site scripts can take over patching with a plugin:

```js
(window.tigerLivePlugins ||= []).push({
  name: 'my-widget', base: new URL('.', import.meta.url),
  codePaths: ['widget.mjs'],             // extra code whose change forces a reload
  async beforeUpdate() {},               // e.g. wait for pending UI actions
  async update({ previous, next, draft, stylesChanged, morph, refreshImages }) {
    return false;                        // true: handled; false: generic body morph; 'reload'
  }
});
```

After every update the client dispatches `tiger-live:updated` on `document`
(`detail: {revision, draft, stylesChanged, handledBy}`); `window.tigerLive` exposes
`register`, `openSource`, `morph` and `reload`.

**Drafts.** `SiteDrafts` renders any Markdown document of the site from unsaved text
with the site's real theme, without writing sources or output. It loads the site with
in-memory overrides (`paths.buildSiteDb(..., overrides)`), plans pages with
`paths.planSite`, and renders the document's own page plus every page whose last
render depended on it (an index listing an article, a deck containing a slide). A
`draft` event carries `{file, pages: [{route, url, html}]}`; each browser applies only
the page it shows. Every render includes all current drafts; clearing one re-renders
the rest, and drafts whose text was saved clear after the next build.

**Server** (`LiveServer`, tapir 1.13 on the sync Netty server, JSON via upickle):

- Static files from the output root: path escapes, symlinks leaving it and dot files
  (`.outputs.json`, `.tiger-build.json`, `.cache`) are refused, directories redirect
  to a trailing slash, `Cache-Control: no-cache`, known content types (including PDF
  and WebAssembly), `HEAD` keeps `Content-Length`.
- `/__preview/events`: server-sent events (an ox `Flow`). Unnamed events carry the
  `BuildStatus` JSON; the current status and drafts are replayed to new clients.
  Named `navigation` events carry the latest `{route, target, step, client}` for the
  subscribed page, replayed when reconnecting.
- `/__preview/draft`: unsaved buffers from the VS Code extension, which discovers the
  server through `.live-preview.json` (`{port, token, project}`, mode 0600, removed on
  exit). Requests need `POST` and the per-run bearer token and stay under 2 MiB.
  Out-of-order renders are dropped by `(session, sequence)`; invalid drafts answer 422
  and publish `draft-error` (the last valid preview stays); files that are not documents
  of the site answer 404.
- `/__author/`: **Content studio** and its JSON API (`config`, `tree`, `collection`,
  `reorder`, `insert`, `duplicate`, `delete`, `recalculate`, `open`, `navigate`). It browses the
  content hierarchy and orders numbered collections (`010 - name.md`). `open` takes a
  content-relative `file`, a collection `directory` and page `id`, or a page `route`
  (resolved through `.outputs.json`). Requests must use `Host: 127.0.0.1:<port>` or
  `localhost:<port>`; writes also need a matching `Origin` and `Content-Type:
  application/json` and stay under 1 MiB. Renames are staged in a temporary directory
  with rollback, stale revisions and concurrent saves get 409, traversal and symlinked
  directories are refused, and deleted pages move to a recoverable `.deleted-*/` backup.
  "Open in editor" goes through `LiveServerConfig.openEditor`, an `EditorOpener`. The default,
  `EditorOpener.vscodeExtension()`, hands `vscode://bishabosha.tiger-templates/open?file=…` to
  whichever application registered `vscode://`; pass another extension id for a differently
  published build. `EditorOpener.vscodeFile` needs no extension (VS Code's built-in file handler,
  opening in the active group), and `EditorOpener.command(Seq("idea"))` runs any editor command.

Content studio shows rendered thumbnails for Reveal slide collections, using the deck's
fonts, syntax highlighting and annotations. Checkboxes select individual slides;
Shift-click adds a range, so several separate runs can be selected together. Choose
**Cut selected**, then **Paste before** or **Paste after** on a destination card (or
paste at the start/end). The selection becomes one continuous run in its original
deck order. Dragging a selected card also moves the entire selection. A group move
is one undo step; **Save order** persists the whole order in one atomic operation.
Main slides must still precede appendices. Escape cancels a pending cut.

A `CollectionPolicy` describes what a collection's files mean: identity (default: the
filename), ordering groups, card badges, the minimum page count, and the text of new
and duplicated pages (default: the neighbor's front matter with a placeholder body, and
exact copies). Themes supply policies for their collections; everything else is plain
pages.

### Reveal decks

`tiger-site-gen-reveal` (`revealTheme/`, depends on live) also adds what live editing
needs that is specific to slides:

```scala
import scala.language.experimental.modularity
import model.SiteMapSchema.auto.autoDerived
import live.LiveSite
import revealTheme.{DeckPage, RevealTheme, SlideDeck}

val talkTheme = RevealTheme.withTemplates(
  RevealTheme.defaultTemplates ++ MyTemplates.templates,     // must start with Reveal's templates
  fonts = MyFonts,
  page = DeckPage(stylesheets = Seq("assets/style.css"), moduleScripts = Seq("assets/extras.mjs")))

object TalkSite extends SlideDeck["my-talk"](talkTheme)      // content/my-talk/ → /my-talk/

val talk = LiveSite(TalkSite, RevealTheme.liveSettings(TalkSite.collection))(using SiteRoot.here)
@main def deck(args: String*): Unit = talk.main(args)
```

| Command | Effect |
| --- | --- |
| `deck dev [--port N]` | build, watch, render drafts and serve `dist/` at 8123 (default command) |
| `deck build [--display]` | one build into `dist/` or `dist-display/` |
| `deck watch [--display]` | build, then rebuild on save |
| `deck serve [--display] [--port N]` | serve `dist/` (live, 8123) or `dist-display/` (static, 8127) |

`TIGER_RENDER_MODE=live|display` selects the CLI's default mode; `--live` and
`--display` take precedence. Programmatic callers use an explicit mode or the
`displayMode` in their settings. `RevealTheme.liveSettings(collection)` supplies ordinary
`LiveSiteSettings`: mode-specific output directories, the deck's site URL, editor
sources, and a `SlidePolicy` in the studio settings. There is no Reveal-specific
host subclass. The same components can be configured directly or customised with
`settings.copy(...)`.

`SlidePolicy` identifies slides by their front matter `id`, keeps main slides before
appendices (`layout = "appendix"`), shows timings, keeps at least one slide, gives new
slides a fresh ID and notes, and changes only the ID when duplicating. The studio
labels the collection as slides. Drafts use the ordinary `SiteDrafts` renderer:
`talk.drafts.render(file, Map(file -> text))` renders the deck and notes through
their standard layouts with unsaved source overrides. Page dependencies select
which pages need updating; the Reveal browser plugin patches their slide elements.

**Slide layouts.** `RevealTheme` accepts a `slideLayouts` map
that extends the built-in `standard`, `dark-slide` and `appendix` layouts:

```scala
slideLayouts = Map(
  "title" -> revealTheme.SlideLayout("title-slide"),
  "chapter" -> revealTheme.SlideLayout("dark-slide chapter-slide", Some("#19242a")),
  "sunburst" -> revealTheme.SlideLayout("sunburst-slide")
)
```

Select one with `layout = "chapter"` in slide front matter. The renderer applies
its CSS classes to the section and its optional background colour to Reveal's
background layer. Theme CSS styles ordinary Markdown headings and content;
whole-slide treatments do not need template calls or heading classes. Unknown
layout names are rejected. Appendix counting and zero-duration rules still follow
the reserved `appendix` metadata value.

**Display mode belongs to the rendering context.** `ctx.displayMode` is
`model.DisplayMode.Live` or `Static`. Ordinary `Context.fromTheme`/`fromSite`
rendering defaults to `Static`; `LiveSite` builds and draft previews use `Live`.
The mode is inherited by mounted contexts and is independent of the shared theme
and build caches. `site.build(DisplayMode.Static)` explicitly requests static
rendering; the Reveal CLI's `--display` selects static rendering in `dist-display/`.
There is no global mutable render mode.

The same Reveal layout chooses the editor scripts and controls directly from the
context. In live mode it includes `authoring/live.js` instead of the standalone
fullscreen controller. Editor scripts and styles go through the existing
hashed `/static` resolver. `StaticAsset.resource` supplies classpath resources;
`paths.resolveStaticAsset` registers them in the context and returns a content-hashed
URL. The host's normal static output pass writes them, including assets registered
by mounted themes. An import map links the editor modules to their hashed URLs.
Static rendering does not request these assets; custom page assets, fonts and the PDF
viewer work in both modes. There is no HTML-rewriting adapter or virtual editor
asset route. The generic preview server supplies its reload client through the
same hashed static pipeline and retains its draft/event transport.

Reveal's bundled files, npm dependencies, public files, local overrides and generated
font CSS form a `StaticBundle`. Its hash covers every relative filename and file's
contents. URLs have the form `/static/reveal_<hash>/assets/image.png`; changing a
public file changes the hash. The resolver registers this immutable bundle, and
`paths.writeStaticAssets` copies those same bytes to those same paths. Relative CSS
URLs, JavaScript imports and links inside copied HTML keep their directory structure.

Layouts use `ctx.extra.assets.url(path)` for known Reveal files. Markdown images and
links use the normal renderer's `Theme.resolveAsset` hook, exposed to templates as
`ctx.resolveAsset(path)`. Templates that produce HTML attributes call this resolver
when creating the tag. No generated HTML is parsed or rewritten to discover assets.
Slide rendering uses the prepared context, so template output and Markdown share
its resolver. Public/theme directories are dependencies even when initially absent.

Other layouts can branch on `ctx.displayMode` in the same way and use their
normal static asset handling. Content-addressed assets are reused across content
edits; fresh static output includes no editor assets.

**Slide client.** `authoring/live.js` registers a plugin with the live client
(`authoring/patch.js`): builds and drafts patch only the changed `<section>`s, keeping
their identity, so Reveal, the preview frame, the thumbnail sidebar and presentation
mode stay mounted. Insertions, removals and reordering update navigation, timings and
slide numbers; slides are re-fitted and re-highlighted and the slide picker is rebuilt
when titles change. `deck.js`, the authoring scripts, `slide-fit.mjs`, `slide-picker.mjs`
and every `moduleScripts` entry count as code: a change reloads the page.
Because Reveal assets share a bundle hash, any public or theme asset change also
changes these script URLs and reloads the page. Content-only changes still patch slides. The toolbar's
**Edit slide** opens the current slide's source by ID; the thumbnail sidebar inserts,
duplicates, cuts/pastes, deletes and respaces slides through the Content studio API.

Live viewers of the same deck on the same server share slide and fragment navigation,
including Chrome and VS Code's browser. The most recent navigation wins; newly opened
or reconnected viewers follow the server's current position. Different deck routes stay
independent. This uses the existing server-sent event stream and same-origin navigation
POSTs, with no extra WebSocket connection. It does not open sources in other viewers or
synchronize fullscreen, and is absent from Display builds. The thumbnail strip follows
the selected slide and reveals it when returning from presentation mode.

Sidebar thumbnails run no scripts. Deck modules can prepare them by listening for
`slide-thumbnail:source` (`detail.slide`, before cloning) and
`slide-thumbnail:copy` (`detail.copy`, the static copy) on `document`.

Run `mysite.liveDemo` for a runnable deck (`examples/live/`, see its README). Ignore
`dist-display/`, `.live-preview.json` and `.tiger-editor.json` in Git.

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

Pages can also be rendered without writing anything. `paths.planSite(theme)` selects
each document's layout and output route (validating routes and the root document, as
`renderSite` does, which shares this plan); each `PlannedPage` renders to a
`RenderedPage(source, route, url, html, dependencies)`. `paths.renderSource(theme, file)`
renders one document's page and `paths.renderPages(theme)(select)` a selection.
`paths.buildSiteDb(src, theme, session, overrides)` loads the site with in-memory
source text for some paths (bypassing the session's source cache for them), e.g. unsaved
editor buffers; `paths.siteDocuments(site)` lists every loaded document.

```scala
val site = paths.buildSiteDb(contentRoot, theme, session, Map(file -> unsavedText))
given theme.Context = Context.fromSite(theme)(site, session)
val page = paths.renderSource(theme, file)   // Option[RenderedPage]
```

## Tests

Compile and run through Metals:

- `revealTheme.HierarchyChecks`: recursive schemas, static cardinality, indexed
  filenames, routes, and incremental deletion.
- `revealTheme.MountChecks`: mounts, typed extras lookup, layouts, lifecycle hooks,
  cached slides, dictionary layouts, embedding, and generic builds.
- `checks.ExistingThemes`: full Breeze and Homepage rendering with existing URLs.

The filesystem-watch regression is in `revealTheme.WatchTiming`.

`./mill live.test` covers the generic live server with a small non-Reveal site
(`live.Journal`): static files, reload-client injection and opt-outs, build markers,
the error status, Content studio filesystem operations and security checks on plain
numbered collections, draft relaying, `SiteDrafts` and the `LiveSite` dev loop.
`revealTheme.SlidePolicyChecks` covers the slide policy (IDs, appendices, templates);
`checks.LiveDeckChecks` builds the example live deck in both modes, renders slide
drafts and runs the watch/serve loop; `checks.LiveBlogChecks` previews a Breeze
article draft. Browser-side checks run with `npm run test:js`, the VS Code
extension's with `npm run test:vscode` (after `npm ci` in `tooling/vscode-tiger-templates`).

Authoring checks use generated generic slide fixtures and do not depend on a
particular presentation or preview server.

## Inspiration

Originally based on Chapter 9 of
[Hands-on Scala Programming](https://www.handsonscala.com/chapter-9-self-contained-scala-scripts.html),
the design has evolved separately.

### Editor grammars for block templates

A block can associate fenced DSLs with self-contained TextMate JSON grammars:

```scala
decoder = BlockTemplateFunction(
  DecoderTrace.render,
  DecoderTrace.render,
  editor = Seq(FencedGrammar("trace", "grammars/decoder-trace.tmLanguage.json"))
)
```

After rendering, call `model.EditorManifest.write(siteTheme, Seq("content"))`
with the site's `SiteRoot` in scope. It writes `.tiger-editor.json` at that root,
collecting registered blocks through theme mounts with local-first precedence.
An overriding function without editor metadata suppresses a mounted grammar.
Unchanged metadata does not rewrite the file. Grammar and source paths are
relative to the site root; grammar files use the `.tmLanguage.json` extension.

The manifest is an editor integration contract, independent of any renderer:
version `1`, `sources` (source-directory paths), and `blocks` (each with `name`
and `fences`, whose entries have `fence` and `grammar`). Editors can watch the
manifest and grammar files, apply grammars only to matching fences inside their
owning block, and keep ordinary Markdown highlighting intact. The manifest is
build output; regenerate it after changing registrations or mounting themes.
