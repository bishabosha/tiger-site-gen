package revealLive

import model.{Layout, ctx}
import revealTheme.{DeckAssets, DeckLayouts, DeckMeta, RevealTheme}
import scalatags.Text.all.*

/** Deck-relative extras a host adds to both render modes, such as its own styles and modules.
 *
 *  @param stylesheets loaded after the Reveal theme, e.g. `assets/presentation-style.css`.
 *  @param moduleScripts ES modules loaded after the deck scripts. The live client reloads the
 *    page when one of them changes, instead of patching slides in place.
 */
final case class LivePage(stylesheets: Seq[String] = Nil, moduleScripts: Seq[String] = Nil):
  for path <- stylesheets ++ moduleScripts do
    require(path.nonEmpty && !path.startsWith("/") && !path.exists(c => c.isWhitespace || "\"'<>&\\".contains(c)) &&
      !path.split('/').contains(".."), s"Expected a deck-relative asset path: $path")

object LiveLayouts:
  /** Reveal's page plus the authoring toolbar, sidebar and preview frame (from `authoring/`). */
  def live(page: LivePage): RevealTheme.LayoutOf[DeckMeta] = Layout { doc =>
    val assets = DeckAssets(ctx.site.deck.url)
    val original = DeckLayouts.index.run(doc).render
    val styles = page.stylesheets.map(file => s"<link rel=\"stylesheet\" href=\"${assets.url(file)}\">").mkString
    val modules = (page.moduleScripts :+ "authoring/live.js")
      .map(file => s"<script type=\"module\" src=\"${assets.url(file)}\"></script>").mkString
    val previewCode = if page.moduleScripts.isEmpty then "" else s"data-preview-code=\"${page.moduleScripts.mkString(" ")}\" "
    raw(original.replace("<body ", s"<body data-render-mode=\"live\" $previewCode")
      .replace("</head>", s"$styles</head>")
      // The preview frame installs its own Present control.
      .replace(s"<script type=\"module\" src=\"${assets.url("fullscreen.mjs")}\"></script>", "")
      .replace("</body>", s"$modules</body>"))
  }

  /** A maximized Reveal canvas with navigation only: no authoring toolbar or editor scripts. */
  def display(page: LivePage): RevealTheme.LayoutOf[DeckMeta] = Layout { doc =>
    val assets = DeckAssets(ctx.site.deck.url)
    html(lang := "en")(
      head(
        meta(charset := "utf-8"),
        meta(name := "viewport", content := "width=device-width, initial-scale=1"),
        meta(name := "description", content := doc.frontMatter.description),
        scalatags.Text.tags2.title(doc.frontMatter.title),
        (Seq("vendor/reveal/dist/reset.css", "vendor/reveal/dist/reveal.css", "theme.css", "fonts.css") ++ page.stylesheets)
          .map(file => link(rel := "stylesheet", href := assets.url(file)))
      ),
      body(cls := "reveal-standalone", attr("data-render-mode") := "display")(
        DeckLayouts.slidesFragment(),
        Seq("vendor/reveal/dist/reveal.js", "vendor/reveal/dist/plugin/notes.js", "vendor/reveal/dist/plugin/highlight.js", "deck.js")
          .map(file => script(src := assets.url(file))),
        page.moduleScripts.map(file => script(`type` := "module", src := assets.url(file)))
      )
    )
  }

  /** Chooses the layout for [[RenderMode.selected]] each time a page renders. */
  def selected(page: LivePage): RevealTheme.LayoutOf[DeckMeta] =
    val liveLayout = live(page)
    val displayLayout = display(page)
    Layout { doc =>
      if RenderMode.selected == RenderMode.Live then liveLayout.run(doc) else displayLayout.run(doc)
    }
