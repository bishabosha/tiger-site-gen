package breezeSite

import scalatags.Text.all.*

import breeze.page.PageCategory
import model.ctx

import Breeze.*

import breeze.{cards, sidebar}

def about(doc: DocPage)(using Context) =
  breeze.page.wrap(PageCategory.About, title = s"About | $whoAmI")(
    div(cls := "container",
      div(cls := "row",
        sidebar.ofBio(hideable = false),
        div(cls := "col-lg",
          div(cls := "row",
            div(cls := "col-lg",
              cards.recentPosts("Articles", ctx.site.articles)
            ),
          ),
          div(cls := "row",
            cards.stride(
              cards.links("Meetups", ctx.site.meetups),
              cards.links("Video Tutorials", ctx.site.videos),
              cards.links("Conference Talks", ctx.site.talks),
            )
          )
        )
      ),
    )
  )
