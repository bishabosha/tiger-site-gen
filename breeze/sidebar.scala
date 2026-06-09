package breeze

import scalatags.Text.all.*
import scalatags.Text.tags2.nav
import model.ctx

import Breeze.*

object sidebar:

  def ofBio(hideable: Boolean = true, collapsable: Boolean = true)(using
      Context
  ): scalatags.Text.Modifier =
    wrap(
      innerBio(top = false, hideable, collapsable)
    )

  def wrap(elems: scalatags.Text.Modifier*)(using
      Context
  ): scalatags.Text.Modifier =
    div(cls := "col-lg-4", elems)

  def innerBio(
      top: Boolean,
      hideable: Boolean = true,
      collapsable: Boolean = true
  )(using Context): scalatags.Text.Modifier =
    div(
      cls := s"bio-box jumbotron sidebar shadow py-lg-4 py-3 ${if top then "bio-box__top" else ""}",
      bio(ctx.site.about.index, hideable, collapsable)
    )

  def toc(doc: DocPageOf[FrontMatter.BaseArticle])(using
      Context
  ): scalatags.Text.Modifier =
    div(
      id := "sidebar-anchor",
      cls := s"sticky-top top-aligned jumbotron sidebar sidebar__mobile shadow py-lg-4 py-3",
      div(
        id := "sidebar-toggler",
        cls := "sidebar_toggle",
        i(cls := "fa-regular fa-square-caret-right")
      ),
      div(
        id := "toc-toggler",
        cls := "toc_toggle",
        i(cls := "fa-regular fa-square-caret-down")
      ),
      nav(
        cls := "toc-nav",
        ol(
          cls := "list-unstyled",
          li(
            cls := s"toc-level-1",
            a(
              href := s"#${io.util.sanatise.mdNameToHtml(doc.frontMatter.title)}",
              doc.frontMatter.title
            )
          ),
          (for (title, anchor, level) <- doc.headings
          yield li(cls := s"toc-level-$level", a(href := s"#$anchor", title)))
        )
      )
    )
