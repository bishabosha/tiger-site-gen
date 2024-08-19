package breezeSite

import breeze.sidebar
import breeze.utils
import scalatags.Text.all.*

import model.ctx

import Breeze.*

def projects(doc: DocPage)(using Context) =
  breeze.page.wrap(
    doc,
    ctx.site.projects,
    title = s"Commercial Projects | $whoAmI"
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
            h1(cls := "mb-4", "Commercial Projects"),
            div(
              cls := "list-group",
              for project <- ctx.site.projects
              yield div(
                cls := "list-group-item",
                div(
                  cls := "d-flex w-100 justify-content-between",
                  h5(
                    cls := "mb-1",
                    img(
                      src := project.frontMatter.avatar,
                      alt := "Project 1 Icon",
                      cls := "mr-2 bg-dark p-1 img-icon"
                    ),
                    project.frontMatter.title
                  ),
                  small(
                    s"Start: ${io.util.md.renderMonthYear(project.frontMatter.startDate).get}"
                  )
                ),
                p(
                  cls := "mb-1",
                  i(b("Summary: "), project.frontMatter.description)
                ),
                a(
                  href := s"/projects/${io.util.sanatise.mdNameToHtml(project.name)}",
                  cls := "stretched-link",
                  "Learn more"
                )
              )
            )
          )
        )
      )
    )
  )
