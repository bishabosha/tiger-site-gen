package mysite

/* DEMO SITE for live editing a Reveal deck: preview server, Content studio and draft previews */

import scala.language.experimental.modularity
import model.SiteMapSchema.auto.autoDerived
import live.LiveSite
import model.{SiteRoot, TemplateFunction, TemplateFunctions}
import revealTheme.{DeckPage, RevealTheme, SlideDeck}
import scalatags.Text.all.*

/** Host templates extend Reveal's; host styles and modules join both render modes. */
val demoTheme = RevealTheme.withTemplates(
  RevealTheme.defaultTemplates ++ TemplateFunctions((
    badge = { val render = (label: String) => span(cls := "badge", label).render; TemplateFunction(render, render) }
  )),
  page = DeckPage(stylesheets = Seq("assets/demo.css"))
)

object DemoSite extends SlideDeck["demo-deck"](demoTheme)

/** The example project is `examples/live/`, its own site root (content/, public/, dist/). */
def demoDeck(root: os.Path = example.ExamplePaths.root / "examples" / "live"): LiveSite =
  LiveSite(DemoSite, RevealTheme.liveSettings(DemoSite.collection))(using SiteRoot(root))

/** `dev` (default), `build [--display]`, `watch`, `serve [--display] [--port N]`. */
@main def liveDemo(args: String*): Unit = demoDeck().main(args)
