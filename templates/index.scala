package templates

import scalatags.Text.all.*

import templates.all.PageCategory

def index(articles: Seq[model.md.Doc], talks: Seq[model.md.Doc], videos: Seq[model.md.Doc])(using model.Context) =
  templates.all.basic(PageCategory.About, title = s"About | ${summon[model.Context].whoAmI}")(
    div(cls := "container",
      div(cls := "row",
        sidebar.ofBio(hideable = false),
        cards.stride(
          cards.recentPosts("Articles", articles*),
          cards.links("Conference Talks", talks*),
          cards.links("Video Tutorials", videos*),
        )
      ),
    )
  )
