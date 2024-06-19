package breezeJournal

import scalatags.Text.all.*

// import breeze.page.PageCategory
import model.ctx

import Breeze.*

import breeze.{cards, sidebar}

def about(doc: DocPage)(using Context) =
  breeze.page.wrap(doc, ctx.site.about, title = s"About | $whoAmI")(
    div(
      cls := "container",
      div(
        cls := "row",
        sidebar.ofBio(hideable = false),
        cards.stride(
          cards.recentPosts("Articles", ctx.site.articles)
        )
      )
    )
  )
