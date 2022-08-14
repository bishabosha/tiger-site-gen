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
        cards.stride(
          cards.recentPosts("Articles", ctx.site.articles),
          cards.links("Video Tutorials", ctx.site.videos),
          cards.links("Conference Talks", ctx.site.talks),
        )
      ),
    )
  )
