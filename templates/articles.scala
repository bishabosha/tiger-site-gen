package templates

import scalatags.Text.all.*

import templates.all.PageCategory
import model.ctx

def articles(doc: model.md.DocPage)(using model.Context) =
  templates.all.basic(PageCategory.Articles, title = s"Articles | ${summon[model.Context].whoAmI}")(
    div(cls := "container",
      div(cls := "row",
        sidebar.ofBio(),
        div(cls := "col-lg-8",
          div(cls := "jumbotron bg-light py-lg-5 py-3",
            h1(cls := "display-4", "Articles"),
            hr(),
            for doc <- ctx.site.articles yield
              val published = doc.frontMatter.published
              val title = doc.frontMatter.title
              val sample = doc.htmlPreview
              div(cls := "row",
                div(cls := "col-lg-12",
                  h2(a(href := s"/articles/${sanatise.mdNameToHtml(title)}", title)),
                  subtitles.article(doc),
                  p(sample)
                )
              )
          )
        ),
      )
    )
  )
