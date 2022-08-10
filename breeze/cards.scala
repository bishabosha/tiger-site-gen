package breeze

import scalatags.Text.all.*

object cards:

  def wrap(title: String, content: scalatags.Text.Modifier*): scalatags.Text.Modifier =
    div(cls := "jumbotron bg-light shadow py-lg-5 py-3",
      h4(title),
      hr(),
      content
    )

  def stride(content: scalatags.Text.Modifier*): scalatags.Text.Modifier =
    val (col1, col2) = content.zipWithIndex.partitionMap((t, i) => if i % 2 == 0 then Left(t) else Right(t))
    def column(col: Seq[scalatags.Text.Modifier]): Option[scalatags.Text.Modifier] =
      if col.isEmpty then None
      else if col.sizeIs == 1 then Some(col.head)
      else Some(
        for r <- col yield
          div(cls := "row",
            div(cls := "col", r)
          )
      )
    Seq(col1, col2).map(col =>
      div(cls := "col-lg-4",
        column(col),
      )
    )

  def recentPosts(kind: String, posts: Breeze.Docs): scalatags.Text.Modifier =
    wrap(s"Recent $kind",
      table(cls := "table table-sm table-borderless",
        tbody(
          for post <- posts.take(5) yield
            val published = post.frontMatter.published
            val title = post.frontMatter.title
            tr(
              td(
                small(cls := "text-muted",
                  io.util.md.renderShortDate(published).getOrElse("No Date")
                )
              ),
              td(a(href := s"/${kind.toLowerCase}/${io.util.sanatise.mdNameToHtml(post.name)}", title)),
            )
        )
      ),
      p(
        a(href := s"/${kind.toLowerCase}/", s"View all ${kind.toLowerCase}")
      )
    )

  def links(title: String, links: Breeze.Docs): scalatags.Text.Modifier =
    wrap(title,
      (for link <- links yield
        div(
          a(href := link.frontMatter.url, target := "_blank",
            small(i(cls := "fa-solid fa-arrow-up-right-from-square")),
            " ",
            link.frontMatter.title
          ),
          p(
            small(
              em(cls := "text-muted",
                link.frontMatter.event
              ),
              ( if link.htmlPreview.nonEmpty then Seq(": ", link.htmlPreview)
                else Seq.empty[Frag]
              )
            )
          ),
        )
      )
    )


