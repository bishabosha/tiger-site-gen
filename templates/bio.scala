package templates

import scalatags.Text.all.*

def bio(me: model.md.Doc, hideable: Boolean)(using model.Context) = Seq(
  p(img(src := me.frontMatter.avatar, alt := s"photo of ${me.frontMatter.name}", cls := "img-avatar")),
  ul(cls := "list-inline",
    (for s"$linkText|$iconCls|$link" <- me.frontMatter.links yield
      li(cls := "list-inline-item",
        p(cls := "text-center mb-1",
          a(href := link,
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
    raw(me.htmlContent),
  )
)
