package breeze

import scalatags.Text.all.*
import scalatags.Text.tags2.article

import model.ctx
import model.Layout

import Breeze.*

val articleLayout = model.Layout[Breeze.Context, FrontMatter.Article]: doc =>
  val (prev, next) =
    ctx.site.articles.posts.prevNext(doc).swap // articles is in reverse order
  val articleNav = (
    Option.when(prev.orElse(next).isDefined)(
      div(
        cls := "container mb-2",
        div(
          cls := "row",
          div(
            cls := "col d-flex",
            (for pdoc <- prev
            yield small(
              a(
                href := pdoc.url,
                i(cls := "fa-solid fa-angle-left"),
                s" ${pdoc.frontMatter.title}"
              )
            ))
          ),
          div(
            cls := "col d-flex flex-row-reverse",
            (for ndoc <- next
            yield small(
              cls := "float-end",
              a(
                href := ndoc.url,
                s"${ndoc.frontMatter.title} ",
                i(cls := "fa-solid fa-angle-right")
              )
            ))
          )
        )
      )
    )
  )

  breeze.page.wrap(
    doc,
    ctx.site.articles,
    title = s"${doc.frontMatter.title} | ${whoAmI}"
  )(
    div(
      cls := "container",
      div(
        cls := "row",
        sidebar.wrap(
          sidebar.innerBio(top = true),
          sidebar.toc(doc)
        ),
        div(
          cls := "col-lg-8 main-content",
          div(
            cls := "jumbotron bg-light py-lg-5 py-3",
            article(
              h1(
                id := io.util.sanatise.mdNameToHtml(doc.frontMatter.title),
                cls := "display-5 anchor-link__source",
                doc.frontMatter.title
              ),
              subtitles.article(
                doc,
                small(
                  a(
                    href := ctx.site.articles.url,
                    i(cls := "fa-solid fa-angle-up"),
                    " all articles"
                  )
                )
              ),
              hr(),
              articleNav,
              div(raw(io.util.md.renderDoc(doc.rawContent))),
              articleNav
            )
          )
        )
      )
    )
  )
end articleLayout
