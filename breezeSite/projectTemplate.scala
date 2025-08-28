package breezeSite

import breeze.sidebar

import scalatags.Text.all.*
import scalatags.Text.tags2.article

import model.ctx

import Breeze.*

val project = Layout: doc =>
  val (prev, next) =
    ctx.site.projects.prevNext(doc).swap // projects are in reverse order
  val projectNav = (
    Option.when(prev.orElse(next).isDefined)(
      div(
        cls := "container mb-2",
        div(
          cls := "row",
          div(
            cls := "col d-flex",
            (for pdoc <- prev
            yield small(
              a(
                href := s"/projects/${io.util.sanatise.mdNameToHtml(pdoc.name)}",
                i(cls := "fa-solid fa-angle-left"),
                s" ${pdoc.frontMatter.title}"
              )
            ))
          ),
          div(
            cls := "col d-flex flex-row-reverse",
            (for ndoc <- next
            yield small(
              cls := "float-end",
              a(
                href := s"/projects/${io.util.sanatise.mdNameToHtml(ndoc.name)}",
                s"${ndoc.frontMatter.title} ",
                i(cls := "fa-solid fa-angle-right")
              )
            ))
          )
        )
      )
    )
  )

  breeze.page.wrap(
    doc,
    ctx.site.projects,
    title = s"${doc.frontMatter.title} | ${whoAmI}"
  )(
    div(
      cls := "container",
      div(
        cls := "row",
        sidebar.wrap(
          sidebar.innerBio(top = true),
          sidebar.toc(doc)
        ),
        div(
          cls := "col-lg-8 main-content",
          div(
            cls := "jumbotron bg-light py-lg-5 py-3",
            article(
              h1(
                id := io.util.sanatise.mdNameToHtml(doc.frontMatter.title),
                cls := "display-5 anchor-link__source",
                img(
                  src := doc.frontMatter.avatar,
                  alt := "Project 1 Icon",
                  cls := "mr-2 bg-dark p-1 img-icon"
                ),
                doc.frontMatter.title
              ),
              subtitleExtensions.project(
                doc,
                small(
                  a(
                    href := "/projects/",
                    i(cls := "fa-solid fa-angle-up"),
                    " all projects"
                  )
                )
              ),
              hr(),
              projectNav,
              blockquote(
                p(
                  a(
                    href := doc.frontMatter.url,
                    target := "_blank",
                    small(
                      i(cls := "fa-solid fa-arrow-up-right-from-square")
                    ),
                    " ",
                    "Project URL"
                  ),
                  b(
                    if doc.frontMatter.isInProgress then
                      " this project is still in progress..."
                    else " this project is completed."
                  )
                ),
                p(i(b("Summary: "), doc.frontMatter.description))
              ),
              div(raw(io.util.md.renderDoc(doc.rawContent))),
              projectNav
            )
          )
        )
      )
    )
  )
end project
