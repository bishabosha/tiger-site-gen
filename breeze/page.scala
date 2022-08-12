package breeze

import scalatags.Text.all.*

import model.ctx
import Breeze.*

object page:

  val useUtf8 = meta(charset := "utf-8")
  val viewport = meta(name := "viewport", content := "width=device-width, initial-scale=1")
  val bootstrapCss = link(
    rel := "stylesheet",
    href := "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.css"
  )
  val bootstrapJs = script(
    src := "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    integrity := "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM",
    crossorigin := "anonymous"
  )
  val hljsStyle = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css"
  )
  val hljsScript = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js",
    tpe := "text/javascript"
  )
  val hljsScala = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/languages/scala.min.js",
    tpe := "text/javascript"
  )
  val hljsAll = script(
    src := "/static/js/hljs.js",
    tpe := "text/javascript"
  )
  val siteStyleCss = link(
    rel := "stylesheet",
    href := "/static/css/style.css"
  )
  val fontAwesome = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css",
    crossorigin := "anonymous"
  )

  final case class Link(href: String, text: String)

  final case class NavLink(isActive: Boolean, link: Link)

  final case class NavBar(brand: String, links: Seq[NavLink])

  enum PageCategory(val docs: Context ?=> DocCollection):
    case About extends PageCategory(ctx.site.about)
    case Articles extends PageCategory(ctx.site.articles)

  private def siteNav(category: PageCategory)(using Context) = NavBar(
    brand = whoAmI,
    links = PageCategory.values
      .filter(_.docs.willRender)
      .map(c => NavLink(isActive = c == category, Link(s"/${c.docs.collName}/index.html", c.toString)))
      .toIndexedSeq
  )

  private val (year, today) = io.util.md.renderNow()

  def wrap(category: PageCategory, title: String)(content: scalatags.Text.Modifier*)(using Context) =
    import scalatags.Text.tags2.title as titleTag
    html(
      head(useUtf8, viewport, bootstrapCss, siteStyleCss, hljsStyle, fontAwesome, titleTag(title)),
      body(cls := "d-flex flex-column min-vh-100",
        navbar(siteNav(category)),
        content,
        footer(cls := "mt-auto",
          div(cls := "footer-copyright text-center py-3",
            small(
              s"© $year $whoAmI.",
              span(cls := "text-muted", s" Last published $today")
            )
          ),
        ),
        bootstrapJs,
        hljsScript,
        hljsScala,
        hljsAll
      )
    )
