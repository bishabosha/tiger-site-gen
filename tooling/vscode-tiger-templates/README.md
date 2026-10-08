# Tiger Markdown Templates

Adds syntax highlighting to ordinary Markdown files for:

- SON frontmatter between `---scala` and `---`, using the Scala grammar.
- `{{columns aligned top}}`, `{{stack}}`, and other template calls.
- Closing calls such as `{{end-columns}}` and `{{end-stack}}`.
- Block templates such as `:::mindmap Collections {.blue}` and closing `:::`.
- Attributes such as `{.footer}`, `{#summary}`, and `{style="font-size:0.5em"}`.

Function names are generic; new theme functions need no grammar changes. Colors
come from your existing editor theme. Files keep the Markdown language mode,
including normal Markdown highlighting and existing fenced-language support.
Template syntax inside code examples is left alone.

## SON frontmatter

```markdown
---scala
(
  title = "Scope",
  seconds = 75,
  fontSize = 44
)
---

## Slide heading
```

The block must start on the first line. Its contents remain a Scala Object
Notation value, including the surrounding parentheses for a record. The extension
uses the **Scala Syntax (official)** grammar (`scala-lang.scala`), installed as a
dependency, and also recognizes SON's dedented `'''` strings. The embedded region
is identified as Scala for editing features. Plain YAML frontmatter and Scala
code fences retain their existing handling.

The extension also handles the live server's **open in editor** actions
(`vscode://bishabosha.tiger-templates/open?file=...`; the older `edit-slide` path
is an alias): Content studio's **Edit** buttons, a Reveal deck's **Edit slide**, and
Alt+Shift+E on any live page. It opens the Markdown source in the nearest other
editor group, creating a split when necessary, and keeps focus on the browser. Only
Markdown files inside the open workspace are accepted. Highlighting does not validate
template function names or match container endings.

## Live preview of unsaved drafts

While a site's live server runs (`LiveSite#dev` or `serve` from `tiger-site-gen-live`,
including Reveal decks configured with `RevealLive.settings`) in a trusted workspace, edits to the site's
Markdown documents appear in the browser before you save. Eligible documents are
Markdown files under the `sources` listed in the workspace folder's
`.tiger-editor.json`, which every build writes (see below); the server then checks
that the file is a document of the site and renders only the pages that show it: an
article's own page and, for example, the index that lists it, or the deck that
contains a slide. The extension sends edits immediately, keeping one request in flight and coalescing
queued edits to the latest text. It sends
the unsaved buffer to the server, which renders it in-process with the site's real
theme and templates. Drafts stay in memory: source files and build output are
unchanged. Invalid or incomplete edits keep the last valid preview, and
closing/reverting a document restores saved content. The extension reconnects when
the server restarts.

The server announces itself in `.live-preview.json` at the workspace root (ignore it
in Git): `{port, token, project}`. Drafts are POSTed to `/__preview/draft` with the
per-run bearer token over loopback. No external service receives draft text.
Connection issues appear in the **Tiger live preview** output channel.

## Install locally

With Node.js 22 or newer and the `code` command on your PATH:

```sh
cd tooling/vscode-tiger-templates
npm ci
npm run install:local
```

Alternatively, run `npm run package`, then use **Extensions: Install from VSIX…**
and select `tiger-templates.vsix`. No Marketplace publication is needed. If an
already-open file does not update, run **Developer: Reload Window**.

Earlier builds were published as `jamie-local.tiger-templates`; uninstall that one
(`code --uninstall-extension jamie-local.tiger-templates`) so the two do not both
highlight and preview the same files.

## Check highlighting

Run `npm test`. Tests use VS Code's actual Markdown grammar and the TextMate
tokenizer, including the installed Scala grammar. They also tokenize the example
slides in this repository; set `TIGER_SLIDES_DIR=/path/to/content/<deck>/slides`
to check a real deck. The live-preview and URI-handler tests use a fake VS Code API. Set `VSCODE_APP_ROOT` to VS Code's `resources/app` directory
and `SCALA_GRAMMAR_PATH` to `Scala.tmLanguage.json` when testing other installations.

Use **Developer: Inspect Editor Tokens and Scopes** to see the scopes at the
cursor. Template scopes end in `.tiger`.

## Site-provided fenced grammars

Registered Tiger block functions can describe the fenced languages they own:

```scala
val templates = TemplateFunctions((
  decoder = BlockTemplateFunction(
    DecoderTrace.render,
    DecoderTrace.render,
    editor = Seq(FencedGrammar("trace", "grammars/decoder-trace.tmLanguage.json"))
  )
))
```

After a successful site build, export the editor manifest:

```scala
model.EditorManifest.write(MySite, Seq("content"))
```

This writes `.tiger-editor.json` in the `SiteRoot`. The extension discovers that
file at each VS Code workspace folder root. The manifest includes a version,
source directories, and block/fence/grammar associations. All paths are relative
to the workspace root. The exporter traverses registered themes and mounts with
the same local-first name precedence as rendering; an unannotated override also
hides a mounted grammar. The generated manifest can be ignored by Git; run a
site build after a fresh checkout. No preview server is required once it exists.

The extension loads self-contained JSON TextMate grammars (repositories and
`$self` includes are supported). External grammar includes and native VS Code
language services are not supplied by this bridge. Only matching fences directly
inside their owning Tiger block receive semantic tokens. Markdown examples,
frontmatter, comments, ordinary code fences and other block functions keep their
existing highlighting. Nested blocks use the innermost block's registration.

Grammar files and the manifest reload automatically. Editing the Scala
registration requires rebuilding the site. Files must remain in a trusted
workspace; absolute paths, parent traversal and symlinks outside it are rejected.
Invalid/deleted manifests clear their semantic tokens and report details in the
**Tiger site grammars** output channel. Source files remain in Markdown mode.

Common TextMate scopes map to standard semantic token types: keywords, operators,
types, functions, parameters, properties, variables, namespaces, strings, numbers
and comments. The editor theme supplies the colors. This extension enables
semantic highlighting for Markdown by default; an explicit user/workspace
`editor.semanticHighlighting.enabled` setting takes precedence. Use **Developer:
Inspect Editor Tokens and Scopes** to inspect these semantic types. This provides
coloring, not completion, validation or embedded-language bracket/comment rules.

## Site-provided Markdown body grammars

Since 0.6.3, a block can also highlight directive syntax in its Markdown body.
Keep authored registrations in `.tiger-grammars.json` at the workspace root:

```json
{
  "version": 1,
  "blocks": [
    { "name": "walkthrough", "body": "grammars/walkthrough.tmLanguage.json" }
  ]
}
```

This sidecar supplements the generated `.tiger-editor.json`; it is not overwritten
by site builds and should be committed with its grammar. The generated manifest
still determines eligible source directories. The grammar applies to inline
Markdown inside the named block, including nested list items. Code fences retain
their own language highlighting, and nested blocks use their own registration.
TextMate patterns should match only the directive syntax, leaving captions and
prose without additional scopes. For example, a grammar can color `[note ...]`
while leaving the explanation after `]` as ordinary Markdown.

Body registrations use the same scope mapping, automatic reload and workspace
path checks as fenced grammars. Closing or deleting the sidecar removes only its
registrations; existing generated fenced grammars remain available. Incomplete
rules stop at the end of each Markdown paragraph.

## Opening sources alongside a browser

The live server's Open/Edit slide action preserves visible browsers in every editor
split, regardless of which split was last focused (including clicks from Chrome).
It reuses a source already open in a safe split, otherwise the active code split or
the nearest available split. If every split shows a browser, it creates a new one.
Focus is preserved. Native integrated-browser tabs currently have no typed input in
VS Code's tab API, so opaque tabs and webviews are conservatively protected too.
