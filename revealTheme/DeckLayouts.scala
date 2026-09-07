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

  private def pdfButton(action: String, label: String, symbol: String) =
    button(tpe := "button", attr("data-pdf-action") := action,
      attr("aria-label") := label, title := label, symbol)

  val index: RevealTheme.LayoutOf[DeckMeta] = Layout { page =>
    val assets = DeckAssets(ctx.site.deck.url)
    val data = page.frontMatter
    html(lang := "en")(
      head(
        meta(charset := "utf-8"),
        meta(name := "viewport", content := "width=device-width, initial-scale=1"),
        meta(name := "description", content := data.description),
        scalatags.Text.tags2.title(data.title),
        link(rel := "stylesheet", href := assets.url("vendor/reveal/dist/reset.css")),
        link(rel := "stylesheet", href := assets.url("vendor/reveal/dist/reveal.css")),
        link(rel := "stylesheet", href := assets.url("theme.css")),
        link(rel := "stylesheet", href := assets.url("vendor/pdfjs/pdf_viewer.css")),
        link(rel := "stylesheet", href := assets.url("pdf-explorer.css"))
      ),
      body(cls := "reveal-standalone")(
        slidesFragment(fullscreen = true),
        tag("dialog")(id := "pdf-tour", cls := "pdf-tour", attr("aria-label") := "PDF viewer")(
          div(cls := "pdf-controls")(
            div(id := "pdf-toolbar", cls := "pdf-toolbar")(
              pdfButton("close", "Back to slides (Esc)", "×"),
              pdfButton("fit", "Fit page", "Fit"),
              pdfButton("out", "Zoom out (−)", "−"),
              button(tpe := "button", id := "pdf-zoom", attr("data-pdf-action") := "actual",
                attr("aria-label") := "Reset zoom to 100%", title := "Reset zoom to 100%", "—"),
              pdfButton("in", "Zoom in (+)", "+"),
              a(id := "pdf-original", target := "_blank", rel := "noopener",
                attr("aria-label") := "Open original PDF", title := "Open original PDF", "↗"),
              fullscreenControl(compact = true)
            ),
            button(tpe := "button", cls := "pdf-controls-toggle", attr("data-pdf-action") := "controls",
              attr("aria-controls") := "pdf-toolbar", attr("aria-expanded") := "true",
              attr("aria-label") := "Hide controls", attr("aria-keyshortcuts") := "h",
              title := "Hide controls (H)", "⋯")
          ),
          div(cls := "pdf-stage")(
            div(id := "pdf-scroll", cls := "pdf-scroll", tabindex := "0", attr("role") := "region",
              attr("aria-label") := "PDF document: scroll or drag to explore")(
              div(id := "pdf-pages", cls := "pdfViewer")
            ),
            p(id := "pdf-status", cls := "pdf-status", attr("role") := "status")
          )
        ),
        script(src := assets.url("vendor/reveal/dist/reveal.js")),
        script(src := assets.url("vendor/reveal/dist/plugin/notes.js")),
        script(src := assets.url("vendor/reveal/dist/plugin/highlight.js")),
        script(src := assets.url("deck.js")),
        script(tpe := "module", src := assets.url("fullscreen.mjs")),
        script(tpe := "module", src := assets.url("pdf-explorer.mjs"))
      )
    )
  }

  val notes: RevealTheme.LayoutOf[NotesMeta] = Layout { page =>
    val assets = DeckAssets(ctx.site.deck.url)
    val indexPage = ctx.site.deck.index
    val data = indexPage.frontMatter
    val slides = ctx.extra.slides.read()
    html(lang := "en")(
      head(
        meta(charset := "utf-8"),
        meta(name := "viewport", content := "width=device-width, initial-scale=1"),
        scalatags.Text.tags2.title(s"${page.frontMatter.title}: ${data.title}"),
        link(rel := "stylesheet", href := assets.url("notes.css"))
      ),
      body(
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
    div(cls := "reveal")(
      div(cls := "slides")(slides.map(_.slide)),
      if fullscreen then div(cls := "presentation-tools")(fullscreenControl()) else frag()
    )

  def embedded(assets: DeckAssets, linkToStandalone: Boolean, contentBaseUrl: String)(using RevealTheme.Context): Frag =
    require(assets.baseUrl.nonEmpty, "Embedded decks need an absolute asset location")
    require(contentBaseUrl.startsWith("/") && !contentBaseUrl.startsWith("//") && contentBaseUrl.endsWith("/"),
      "Embedded content needs a site-absolute asset directory ending in /")
    val title = ctx.site.deck.index.frontMatter.title
    frag(
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
