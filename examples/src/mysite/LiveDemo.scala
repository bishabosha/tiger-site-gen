package mysite

/* DEMO SITE for live editing a Reveal deck: preview server, Content studio and draft previews */

import scala.language.experimental.modularity
import model.SiteMapSchema.auto.autoDerived
import revealLive.{LiveDeck, LivePage, LiveRevealTheme, SlideDeck}
import model.{SiteRoot, TemplateFunction, TemplateFunctions}
import revealTheme.{RevealAssets, RevealTheme}
import scalatags.Text.all.*

/** Host templates extend Reveal's; host styles and modules join both render modes. */
object DemoTheme extends LiveRevealTheme(
  RevealTheme.templates ++ TemplateFunctions((
    badge = { val render = (label: String) => span(cls := "badge", label).render; TemplateFunction(render, render) }
  )),
  // npm packages are installed once, at the repository root.
  assetSources = root =>
    val npm = if os.isDir(root.root / "node_modules") then root.root else example.ExamplePaths.root
    RevealAssets.fromNpm(root).copy(revealJs = npm / "node_modules" / "reveal.js", pdfJs = npm / "node_modules" / "pdfjs-dist"),
  page = LivePage(stylesheets = Seq("assets/demo.css"))
)

object DemoSite extends SlideDeck["demo-deck"](DemoTheme)

/** The example project is `examples/live/`, its own site root (content/, public/, dist/). */
def demoDeck(root: os.Path = example.ExamplePaths.root / "examples" / "live"): LiveDeck["demo-deck"] =
  LiveDeck(DemoSite)(using SiteRoot(root))

/** `dev` (default), `build [--display]`, `watch`, `serve [--display] [--port N]`. */
@main def liveDemo(args: String*): Unit = demoDeck().main(args)
