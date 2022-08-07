package templates

import scalatags.Text.all.*
import scalatags.Text.tags2.article as tArticle

import templates.all.PageCategory

def article(doc: model.md.Doc, prev: Option[model.md.Doc], next: Option[model.md.Doc])(using model.Context) =
  val articleNav = (
    Option.when(prev.orElse(next).isDefined)(
      div(cls := "container mb-2",
        div(cls := "row",
          div(cls := "col d-flex",
            (for pdoc <- prev yield
              small(
                a(href := s"/articles/${templates.sanatise.mdNameToHtml(pdoc.frontMatter.title)}",
                  i(cls := "fa-solid fa-angle-left"),
                  s" ${pdoc.frontMatter.title}",
                )
              )
            )
          ),
          div(cls := "col d-flex flex-row-reverse",
            (for ndoc <- next yield
              small(cls := "float-end",
                a(href := s"/articles/${templates.sanatise.mdNameToHtml(ndoc.frontMatter.title)}",
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

  templates.all.basic(PageCategory.Articles, title = s"${doc.frontMatter.title} | ${summon[model.Context].whoAmI}")(
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
