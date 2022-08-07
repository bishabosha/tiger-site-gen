package templates

import scalatags.Text.all.*

object subtitles:

  def article(doc: model.md.DocPage, extras: scalatags.Text.Modifier*): scalatags.Text.Modifier =
    ul(cls := "list-inline mb-2",
      li(cls := "list-inline-item",
        small(
          span(cls := "text-muted",
            readData.md.renderDate(doc.frontMatter.published).getOrElse("unknown publish date"),
          ),
        ),
      ),
      li(cls := "list-inline-item",
        small(
          i(cls := "fa-solid fa-hourglass-start"),
          " ",
          sanatise.readTime(doc.wordCount)
        ),
      ),
      for extra <- extras yield
        li(cls := "list-inline-item", extra)
    )