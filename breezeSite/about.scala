package breezeSite

import scalatags.Text.all.*

import model.ctx

import Breeze.*

import breeze.{cards, sidebar}

val about = Layout: doc =>
  breeze.page.wrap(doc, ctx.site.about, title = s"About | $whoAmI")(
    div(
      cls := "container",
      div(
        cls := "row",
        sidebar.ofBio(hideable = false, collapsable = false),
        div(
          cls := "col-lg",
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
              cards.recentPosts("Articles", ctx.site.articles)
            )
          ),
          div(
            cls := "row",
            div(
              cls := "col-lg",
              cardExtensions.projects("Commercial Projects", ctx.site.projects)
            )
          ),
          div(
            cls := "row",
            div(
              cls := "col-lg",
              cards
                .links("Conference Talks and Meetups", "talks", ctx.site.talks)
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
      )
    )
  )
