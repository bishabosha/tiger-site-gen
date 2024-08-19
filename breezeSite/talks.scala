package breezeSite

import breeze.sidebar
import breeze.utils
import scalatags.Text.all.*

import model.ctx

import Breeze.*

def talks(doc: DocPage)(using Context) =
  val siteTalks = ctx.site.talks
  val orderedTalks =
    siteTalks.toIterable.toSeq.sortBy(page =>
      utils.Ordered
        .read(page.frontMatter.ordered)
        .getOrElse(sys.error(s"Missing order for ${page.name}"))
    )
  breeze.page.wrap(
    doc,
    ctx.site.talks,
    title = s"Conference Talks and Meetups | $whoAmI"
  )(
    div(
      cls := "container",
      div(
        cls := "row",
        sidebar.ofBio(collapsable = false),
        div(
          cls := "col-lg-8",
          div(
            cls := "jumbotron bg-light py-lg-5 py-3",
            h1(cls := "display-5", "Conference Talks and Meetups"),
            hr(),
            for link <- orderedTalks
            yield div(
              cls := "row",
              div(
                cls := "col-lg-12",
                div(
                  a(
                    href := link.frontMatter.url,
                    target := "_blank",
                    small(
                      i(cls := "fa-solid fa-arrow-up-right-from-square")
                    ),
                    " ",
                    link.frontMatter.title
                  ),
                  p(
                    small(
                      em(cls := "text-muted", link.frontMatter.event),
                      (if link.htmlPreview.nonEmpty then
                         Seq(": ": Frag, raw(link.htmlPreview))
                       else Seq.empty[Frag])
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
