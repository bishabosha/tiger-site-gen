package breeze

import scalatags.Text.all.*
import model.ctx
import Breeze.*

/** Default personal homepage, with a slot for specialised host content. */
object aboutPage:
  def wrap(doc: DocOf[FrontMatter.About])(content: Modifier*)(using Context) =
    page.wrap(doc, ctx.site.about, title = s"About | $whoAmI")(
      div(cls := "container")(
        div(cls := "row")(
          sidebar.ofBio(hideable = false, collapsable = false),
          div(cls := "col-lg")(content)
        )
      )
    )

val about = model.Layout[Breeze.Context, FrontMatter.About]: doc =>
  aboutPage.wrap(doc)(cards.recentPosts("Articles", ctx.site.articles.posts))
