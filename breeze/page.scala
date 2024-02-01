package breeze

import scalatags.Text.all.*
import scalatags.Text.all.content as attrContent

import model.ctx
import Breeze.*

object page:

  val httpMeta = Seq(
    meta(charset := "utf-8"),
    meta(name := "Content-Type", attrContent := "text/html; charset=utf-8"),
    meta(name := "viewport", content := "width=device-width, initial-scale=1"),
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
  val navTocJs = script(
    src := "/static/js/nav-toc.js",
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
    brand = s"$whoAmI",
    links = PageCategory.values
      .filter(_.docs.willRender)
      .map(c => NavLink(isActive = c == category, Link(s"/${c.docs.collName}/index.html", c.toString)))
      .toIndexedSeq
  )

  private val (year, today) = io.util.md.renderNow()

  def wrap(using Context)(page: DocPage, category: PageCategory, title: String)(content: scalatags.Text.Modifier*) =
    import scalatags.Text.tags2.title as titleTag

    val metaDescription = Seq(
      meta(name := "description", attrContent := page.frontMatter.description),
      meta(name := "twitter:card", attrContent := "summary"),
      meta(name := "og:title", attrContent := title),
      meta(name := "og:description", attrContent := page.frontMatter.description),
    )

    html(
      head(httpMeta, bootstrapCss, siteStyleCss, fontAwesome, titleTag(title), metaDescription, ctx.extra.extraHead),
      body(cls := "d-flex flex-column min-vh-100",
        navbar(siteNav(category)),
        content,
        footer(cls := "mt-auto",
          div(cls := "footer-copyright text-center py-3",
            small(
              s"© $year $copyright.",
              span(cls := "text-muted", s" Last published $today")
            )
          ),
        ),
        bootstrapJs,
        navTocJs,
        ctx.extra.extraFoot,
      )
    )
