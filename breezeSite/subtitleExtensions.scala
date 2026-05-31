package breezeSite

import scalatags.Text.all.*

import Breeze.*

object subtitleExtensions:

  def project(
      doc: DocPageOf[FrontMatter.Project],
      extras: scalatags.Text.Modifier*
  ): scalatags.Text.Modifier =
    ul(
      cls := "list-inline mb-2",
      li(
        cls := "list-inline-item",
        small(
          span(
            cls := "text-muted",
            "Start: ",
            io.util.md
              .renderMonthYear(doc.frontMatter.startDate)
              .getOrElse("unknown start date"),
            io.util.md
              .renderMonthYear(doc.frontMatter.endDate)
              .map: ed =>
                (
                  s", End: $ed"
                )
              .getOrElse("")
          )
        )
      ),
      li(
        cls := "list-inline-item",
        small(
          i(cls := "fa-solid fa-hourglass-start"),
          " ",
          io.util.sanatise.readTime(doc.wordCount)
        )
      ),
      for extra <- extras yield li(cls := "list-inline-item", extra)
    )
