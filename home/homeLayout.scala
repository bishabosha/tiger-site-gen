package home

import scalatags.Text.all.*

import model.ctx

import Homepage.*

val homeLayout = Layout[FrontMatter.About]: doc =>
  basicPage(title = s"About | $whoAmI")(
    div(
      cls := "container",
      div(
        cls := "row",
        div(
          cls := "col-lg",
          cards.bio()
        )
      )
    )
  )
