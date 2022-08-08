package templates

import scalatags.Text.all.*

import templates.page.PageCategory
import model.ctx

def about(doc: model.md.DocPage)(using model.Context) =
  templates.page.wrap(PageCategory.About, title = s"About | ${summon[model.Context].whoAmI}")(
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
