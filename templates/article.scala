package templates

import scalatags.Text.all.*
import scalatags.Text.tags2.article as tArticle

import templates.page.PageCategory
import model.ctx

def article(doc: model.md.DocPage)(using model.Context) =
  val (prev, next) = ctx.site.articles.prevNext(doc).swap // articles is in reverse order
  val articleNav = (
    Option.when(prev.orElse(next).isDefined)(
      div(cls := "container mb-2",
        div(cls := "row",
          div(cls := "col d-flex",
            (for pdoc <- prev yield
              small(
                a(href := s"/articles/${templates.sanatise.mdNameToHtml(pdoc.name)}",
                  i(cls := "fa-solid fa-angle-left"),
                  s" ${pdoc.frontMatter.title}",
                )
              )
            )
          ),
          div(cls := "col d-flex flex-row-reverse",
            (for ndoc <- next yield
              small(cls := "float-end",
                a(href := s"/articles/${templates.sanatise.mdNameToHtml(ndoc.name)}",
                  s"${ndoc.frontMatter.title} ",
                  i(cls := "fa-solid fa-angle-right"),
                )
              )
            )
          )
        )
      )
    )
  )

  templates.page.wrap(PageCategory.Articles, title = s"${doc.frontMatter.title} | ${summon[model.Context].whoAmI}")(
    div(cls := "container",
      div(cls := "row",
        sidebar.ofBio(),
        div(cls := "col-lg-8",
          div(cls := "jumbotron bg-light py-lg-5 py-3",
            tArticle(
              h1(cls := "display-4", doc.frontMatter.title),
              subtitles.article(doc, small(
                a(href := "/articles/",
                  i(cls := "fa-solid fa-angle-up"),
                  " all articles"
                )
              )),
              hr(),
              articleNav,
              div(raw(doc.htmlContent)),
              articleNav,
            ),
          )
        ),
      )
    )
  )
