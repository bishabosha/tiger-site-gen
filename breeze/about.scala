package breeze

import scalatags.Text.all.*

import breeze.page.PageCategory
import model.ctx

def about(doc: Breeze.DocPage)(using Breeze.Context) =
  breeze.page.wrap(PageCategory.About, title = s"About | ${Breeze.whoAmI}")(
    div(cls := "container",
      div(cls := "row",
        sidebar.ofBio(hideable = false),
        cards.stride(
          cards.recentPosts("Articles", ctx.site.articles),
          cards.links("Conference Talks", ctx.site.talks),
          cards.links("Video Tutorials", ctx.site.videos),
        )
      ),
    )
  )
