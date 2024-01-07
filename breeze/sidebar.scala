package breeze

import scalatags.Text.all.*
import scalatags.Text.tags2.nav
import model.ctx

import Breeze.*

object sidebar:

  def ofBio(hideable: Boolean = true)(using Context): scalatags.Text.Modifier =
    wrap(
      innerBio(hideable),
    )

  def wrap(elems: scalatags.Text.Modifier*)(using Context): scalatags.Text.Modifier =
    div(cls := "col-lg-4",
      elems
    )

  def innerBio(hideable: Boolean = true)(using Context): scalatags.Text.Modifier =
    div(cls := s"bio-box jumbotron shadow py-lg-4 py-3",
      bio(ctx.site.about.page, hideable),
    )

  def toc(doc: DocPage)(using Context): scalatags.Text.Modifier =
    div(cls := s"sticky-top top-aligned jumbotron shadow py-lg-5 py-3",
      nav(cls := "toc-nav",
        ol(cls := "list-unstyled",
          (for (title, anchor, level) <- doc.headings yield
            li(cls := s"toc-level-$level",
              a(href := s"#$anchor", title)
            )
          )
        ),
      )
    )
