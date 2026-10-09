package revealTheme

import model.{Layout, ctx}
import io.util.Templates
import scalatags.Text.all.*
import scalatags.Text.tags2.{article, nav}

/** Full HTML pages belong to the deck collection; slides remain reusable fragments. */
object DeckLayouts:
  private def fullscreenControl(compact: Boolean = false) = div(cls := "fullscreen-control")(
    button(tpe := "button", attr("data-fullscreen") := "", attr("aria-keyshortcuts") := "f",
      attr("aria-label") := "Fullscreen", title := "Fullscreen (F)")(
      if compact then span(attr("aria-hidden") := "true", "⛶")
      else span(attr("data-fullscreen-label") := "", "Fullscreen")
    ),
    span(cls := "fullscreen-status", attr("role") := "status", hidden := true)
  )

  val index: RevealTheme.LayoutOf[DeckMeta] = standalone(DeckPage())

  def standalone(config: DeckPage): RevealTheme.LayoutOf[DeckMeta] = Layout { page =>
    val assets = ctx.extra.assets
    val data = page.frontMatter
    val live = ctx.displayMode == model.DisplayMode.Live
    html(lang := "en")(
      head(
        meta(charset := "utf-8"),
        meta(name := "viewport", content := "width=device-width, initial-scale=1"),
        meta(name := "description", content := data.description),
        scalatags.Text.tags2.title(data.title),
        link(rel := "stylesheet", href := assets.url("vendor/reveal/dist/reset.css")),
        link(rel := "stylesheet", href := assets.url("vendor/reveal/dist/reveal.css")),
        link(rel := "stylesheet", href := assets.url("theme.css")),
        link(rel := "stylesheet", href := assets.url("fonts.css")),
        config.stylesheets.map(file => link(rel := "stylesheet", href := assets.url(file))),
        if live then AuthoringAssets.head else frag()
      ),
      body(cls := "reveal-standalone", style := ctx.extra.fonts.cssVariables,
        attr("data-render-mode") := (if live then "live" else "static"),
        attr("data-deck-assets") := assets.baseUrl,
        attr("data-preview-code") := config.moduleScripts.mkString(" "))(
        slidesFragment(fullscreen = true),
        script(src := assets.url("vendor/reveal/dist/reveal.js")),
        script(src := assets.url("vendor/reveal/dist/plugin/notes.js")),
        script(src := assets.url("vendor/reveal/dist/plugin/highlight.js")),
        script(src := assets.url("deck.js")),
        if !live then script(tpe := "module", src := assets.url("fullscreen.mjs")) else frag(),
        config.moduleScripts.map(file => script(tpe := "module", src := assets.url(file))),
        if live then script(tpe := "module", src := AuthoringAssets.scriptUrl) else frag()
      )
    )
  }

  val notes: RevealTheme.LayoutOf[NotesMeta] = Layout { page =>
    val assets = ctx.extra.assets
    val indexPage = ctx.site.deck.index
    val data = indexPage.frontMatter
    val slides = ctx.extra.slides.read()
    html(lang := "en")(
      head(
        meta(charset := "utf-8"),
        meta(name := "viewport", content := "width=device-width, initial-scale=1"),
        scalatags.Text.tags2.title(s"${page.frontMatter.title}: ${data.title}"),
        link(rel := "stylesheet", href := assets.url("notes.css")),
        link(rel := "stylesheet", href := assets.url("fonts.css"))
      ),
      body(style := ctx.extra.fonts.cssVariables)(
        h1(data.title),
        p(s"${data.author}. ${data.event}. ${Slides.stamp(slides.map(_.seconds).sum)} total."),
        p(a(href := "index.html", "Open slides")),
        nav(slides.zipWithIndex.map((s, i) => a(href := s"#${s.id}", s"${i + 1}. ${s.title}"))),
        slides.map(s => article(id := s.id)(
          h2(a(href := s"index.html#/${s.id}", s.title)), s.notes))
      )
    )
  }

  /** Shared by the standalone page and each embedded player. */
  def slidesFragment(fullscreen: Boolean = false)(using RevealTheme.Context): ConcreteHtmlTag[String] =
    val slides = ctx.extra.slides.read()
    div(cls := "reveal", style := ctx.extra.fonts.cssVariables)(
      div(cls := "slides")(slides.map(_.slide)),
      if fullscreen then div(cls := "presentation-tools")(fullscreenControl()) else frag()
    )

  /** Render a fragment in a prepared deck context; URLs follow its physical collection. */
  def embedded(using context: RevealTheme.Context)(
      linkToStandalone: Boolean = false,
      contentBaseUrl: String = context.site.deck.url
  ): Frag =
    val assets = context.extra.assets
    require(assets.baseUrl.nonEmpty, "Embedded decks need an absolute asset location")
    require(contentBaseUrl.startsWith("/") && !contentBaseUrl.startsWith("//") && contentBaseUrl.endsWith("/"),
      "Embedded content needs a site-absolute asset directory ending in /")
    val title = ctx.site.deck.index.frontMatter.title
    frag(
      // Font faces belong to the document's font set, outside the player's shadow root.
      link(rel := "stylesheet", href := assets.url("fonts.css")),
      tag("reveal-deck")(
        attr("data-assets") := assets.baseUrl,
        attr("data-content-base") := contentBaseUrl,
        attr("aria-label") := title
      )(
        tag("template")(
          link(rel := "stylesheet", href := assets.url("vendor/reveal/dist/reset.css")),
          link(rel := "stylesheet", href := assets.url("vendor/reveal/dist/reveal.css")),
          link(rel := "stylesheet", href := assets.url("theme.css")),
          link(rel := "stylesheet", href := assets.url("embed.css")),
          slidesFragment()
        ),
        if linkToStandalone then a(href := ctx.site.deck.url, s"Open presentation: $title")
        else p(s"Interactive presentation: $title. Enable JavaScript to view the slides.")
      ),
      script(tpe := "module", src := assets.url("embed.mjs"))
    )
