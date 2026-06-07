package home

import scalatags.Text.all.*

import Homepage.*
import model.DocPage

def bio(
    me: DocPage[FrontMatter.About],
    hideable: Boolean,
    collapsable: Boolean
)(using
    Context
) =
  div(
    cls := "bio-main",
    table(
      tr(
        td(
          cls := "bio-left",
          div(
            cls := "bio-photo",
            img(
              src := me.frontMatter.avatar,
              alt := s"photo of ${me.frontMatter.name}",
              cls := "img-avatar"
            )
          )
        ),
        td(
          cls := "bio-right",
          p(span(cls := "bio-name", me.frontMatter.copyright))
        )
      )
    ),
    // p(
    //   img(src := me.frontMatter.avatar, alt := s"photo of ${me.frontMatter.name}", cls := "img-avatar"),
    //   span(cls := "bio-name", me.frontMatter.copyright),
    // ),
    ul(
      cls := "list-inline",
      (for case Links(linkText, kind, iconCls, link) <-
          me.frontMatter.linkss
      yield li(
        cls := "list-inline-item",
        p(
          cls := "text-center mb-1",
          small(
            a(
              href := link,
              cls := "bio-link",
              Option.when(kind.contains("social"))(rel := "me"),
              i(cls := s"${iconCls} fa-lg"),
              br(),
              linkText
            )
          )
        )
      ))
    ),
    div(
      Option.when(hideable)(cls := "d-none d-sm-none d-lg-block"),
      hr(),
      div(
        (if !collapsable then cls := "bio-body"
         else Seq(cls := "bio-body bio-expand", tabindex := "0")),
        raw(io.util.md.renderDoc(me.rawContent))
      )
    )
  )
