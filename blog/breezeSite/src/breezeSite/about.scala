package breezeSite

import scalatags.Text.all.*

import model.ctx

import BreezeSite.*

import breeze.cards

val about = model.Layout[BreezeSite.Context, FrontMatter.About]: doc =>
  breeze.aboutPage.wrap(doc)(
    div(
      cls := "row",
      div(
        cls := "col-lg",
        cards.wrap(
          "Special Links",
          ul(
            li(
              a(
                href := s"/match-type-simulator/",
                "Match types simulator (Scala Days 2025)"
              )
            ),
            li(
              a(
                href := "https://github.com/bishabosha/scaladays-2025",
                "GitHub repo for demos (Scala Days 2025)"
              )
            )
          )
        )
      )
    ),
    div(
      cls := "row",
      div(
        cls := "col-lg",
        cards.recentPosts("Articles", ctx.site.articles.posts)
      )
    ),
    div(
      cls := "row",
      div(
        cls := "col-lg",
        cardExtensions.projects("Commercial Projects", ctx.site.projects.posts)
      )
    ),
    div(
      cls := "row",
      div(
        cls := "col-lg",
        cards
          .links("Conference Talks and Meetups", "talks", ctx.site.talks.posts, showAll = true)
      )
    ),
    div(
      cls := "row",
      div(
        cls := "col-lg",
        cards.links("Video Tutorials", "videos", ctx.site.videos)
      )
    )
  )
