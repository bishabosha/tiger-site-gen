package breeze

import scalatags.Text.all.*

import Breeze.*

def bio(me: DocPage, hideable: Boolean)(using Context) =
  div(cls := "bio-main",
    p(img(src := me.frontMatter.avatar, alt := s"photo of ${me.frontMatter.name}", cls := "img-avatar")),
    ul(cls := "list-inline",
      (for case s"$linkText|$kind|$iconCls|$link" <- me.frontMatter.links yield
        li(cls := "list-inline-item",
          p(cls := "text-center mb-1",
            a(href := link, cls := "bio-link", Option.when(kind == "social")(rel := "me"),
              i(cls := s"${iconCls} fa-lg"),
              br(),
              linkText
            )
          )
        )
      )
    ),
    div(Option.when(hideable)(cls := "d-none d-sm-none d-lg-block"),
      hr(),
      div(cls := "bio-body",
        raw(me.htmlContent),
      )
    )
  )
