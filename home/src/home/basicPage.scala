package home

import scalatags.Text.all.*

import Homepage.{Context, copyright, whoAmI}
import scalatags.Text.TypedTag

object basicPage:

  val httpMeta = Seq(
    meta(charset := "utf-8"),
    meta(name := "Content-Type", content := "text/html; charset=utf-8"),
    meta(name := "viewport", content := "width=device-width, initial-scale=1")
  )

  val bootstrapCss = link(
    rel := "stylesheet",
    href := "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.css"
  )
  val bootstrapJs = script(
    src := "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    integrity := "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM",
    crossorigin := "anonymous"
  )
  val fontAwesome = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css",
    crossorigin := "anonymous"
  )
  def siteStyleCss(using Context) = link(
    rel := "stylesheet",
    href := io.util.paths.resolveStaticAsset("/static/css/style.css")
  )

  def apply(title: String)(content: Frag)(using Context): TypedTag[String] =
    val (year, today) = io.util.md.renderNow()
    html(
      head(
        httpMeta,
        bootstrapCss,
        siteStyleCss,
        fontAwesome
      ),
      body(
        navbar(NavBar(whoAmI, Seq.empty)),
        content,
        footer(
          cls := "mt-auto",
          div(
            cls := "footer-copyright text-center py-3",
            small(
              s"© $year $copyright.",
              span(cls := "text-muted", s" Last published $today")
            )
          )
        ),
        bootstrapJs
      )
    )
