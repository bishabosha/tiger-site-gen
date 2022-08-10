package breeze

import scalatags.Text.all.*

import breeze.page.PageCategory
import model.ctx

def articles(doc: Breeze.DocPage)(using Breeze.Context) =
  breeze.page.wrap(PageCategory.Articles, title = s"Articles | ${Breeze.whoAmI}")(
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
                  h2(a(href := s"/articles/${io.util.sanatise.mdNameToHtml(doc.name)}", title)),
                  subtitles.article(doc),
                  p(raw(sample))
                )
              )
          )
        ),
      )
    )
  )
