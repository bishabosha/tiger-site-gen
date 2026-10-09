package mysite

/* DEMO SITE for live editing a Reveal deck: preview server, Content studio and draft previews */

import scala.language.experimental.modularity
import model.SiteMapSchema.auto.autoDerived
import revealLive.{RevealLive, SlideDeck}
import live.LiveSite
import model.{SiteRoot, TemplateFunction, TemplateFunctions}
import revealTheme.{DeckPage, RevealAssets, RevealTheme}
import scalatags.Text.all.*

/** Host templates extend Reveal's; host styles and modules join both render modes. */
val demoTheme = RevealTheme.withTemplates(
  RevealTheme.defaultTemplates ++ TemplateFunctions((
    badge = { val render = (label: String) => span(cls := "badge", label).render; TemplateFunction(render, render) }
  )),
  // npm packages are installed once, at the repository root.
  assetSources = root =>
    val npm = if os.isDir(root.root / "node_modules") then root.root else example.ExamplePaths.root
    RevealAssets.fromNpm(root).copy(revealJs = npm / "node_modules" / "reveal.js", pdfJs = npm / "node_modules" / "pdfjs-dist"),
  page = DeckPage(stylesheets = Seq("assets/demo.css"))
)

object DemoSite extends SlideDeck["demo-deck"](demoTheme)

/** The example project is `examples/live/`, its own site root (content/, public/, dist/). */
def demoDeck(root: os.Path = example.ExamplePaths.root / "examples" / "live"): LiveSite =
  LiveSite(DemoSite, RevealLive.settings(DemoSite.collection))(using SiteRoot(root))

/** `dev` (default), `build [--display]`, `watch`, `serve [--display] [--port N]`. */
@main def liveDemo(args: String*): Unit = demoDeck().main(args)
