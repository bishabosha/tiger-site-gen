package breezeSite

import breeze.sidebar
import breeze.utils
import scalatags.Text.all.*

import model.ctx

import Breeze.*

val projects = Layout[FrontMatter.Projects]: doc =>
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
            p("An incomplete list of projects I have worked on for clients."),
            p(
              "Please contact me at ",
              a(
                href := "mailto:jamie.thompson@bath.edu",
                "jamie.thompson@bath.edu"
              ),
              " to discuss potential collaborations."
            ),
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
                    span(
                      s"Start: ${io.util.md.renderMonthYear(project.frontMatter.startDate).get}"
                    ),
                    io.util.md
                      .renderMonthYear(project.frontMatter.endDate)
                      .map: ed =>
                        span(
                          s", End: $ed"
                        )
                  )
                ),
                p(
                  cls := "mb-1",
                  i(b("Summary: "), project.frontMatter.description)
                ),
                Option.when(project.frontMatter.isInProgress)(
                  p(i(b("This project is still in progress...")))
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
end projects
