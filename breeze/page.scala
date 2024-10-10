package breeze

import scalatags.Text.all.*

import model.ctx
import Breeze.*

object page:

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
  def navTocJs(using Context) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/nav-toc.js"),
    tpe := "text/javascript"
  )
  def sidebarMobileJs(using Context) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/sidebar-mobile.js"),
    tpe := "text/javascript"
  )

  def siteStyleCss(using Context) = link(
    rel := "stylesheet",
    href := io.util.paths.resolveStaticAsset("/static/css/style.css")
  )
  val fontAwesome = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css",
    crossorigin := "anonymous"
  )

  final case class Link(href: String, text: String)

  final case class NavLink(isActive: Boolean, link: Link)

  final case class NavBar(brand: String, links: Seq[NavLink])

  private def siteNav(col: DocCollection)(using Context) = NavBar(
    brand = s"$whoAmI",
    links = ctx.extra.nav
      .filter(_.willRender)
      .map(c =>
        NavLink(
          isActive = c.collName == col.collName,
          Link(s"/${c.collName}/", c.collName.capitalize)
        )
      )
      .toIndexedSeq
  )

  private val (year, today) = io.util.md.renderNow()

  def wrap(using Context)(page: DocPage, col: DocCollection, title: String)(
      pageContent: scalatags.Text.Modifier*
  ) =
    import scalatags.Text.tags2.title as titleTag

    val metaDescription = Seq(
      meta(name := "description", content := page.frontMatter.description),
      meta(name := "twitter:card", content := "summary"),
      meta(name := "twitter:title", content := title),
      meta(name := "twitter:site", content := "@bishabosha"),
      meta(
        name := "twitter:description",
        content := page.frontMatter.description
      ),
      meta(name := "og:title", content := title),
      meta(
        name := "og:description",
        content := page.frontMatter.description
      )
    )

    html(
      head(
        httpMeta,
        bootstrapCss,
        siteStyleCss,
        fontAwesome,
        titleTag(title),
        metaDescription,
        ctx.extra.extraHead
      ),
      body(
        cls := "d-flex flex-column min-vh-100",
        navbar(siteNav(col)),
        pageContent,
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
        bootstrapJs,
        navTocJs,
        sidebarMobileJs,
        ctx.extra.extraFoot
      )
    )
