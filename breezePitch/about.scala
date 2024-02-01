package breezePitch

import scalatags.Text.all.*

import breeze.page.PageCategory
import model.ctx

import Breeze.*

import breeze.{cards, sidebar}

def about(doc: DocPage)(using Context) =
  breeze.page.wrap(doc, PageCategory.About, title = s"About | $whoAmI")(
    div(cls := "container",
      div(cls := "row",
        sidebar.ofBio(hideable = false),
        div(cls := "col-lg-8",
          div(cls := "row",
            div(cls := "col",
              div(cls := "hero-box",
                h1(cls := "hero-title", doc.frontMatter.title)
              )
            )
          ),
          div(cls := "row",
            cards.stride(
              cards.recentPosts("Articles", ctx.site.articles),
            )
          )
        ),
      ),
    )
  )
