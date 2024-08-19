package breezeSite

import breezeSite.Breeze.*
import breeze.cards

import scalatags.Text.all.*

object cardExtensions:

  def projects(title: String, projects: Docs): scalatags.Text.Modifier =
    cards.wrap(
      title,
      table(
        cls := "table table-sm table-borderless table-fixed",
        tbody(
          for project <- projects.take(5) yield
            val startDate = project.frontMatter.startDate
            val title = project.frontMatter.title
            tr(
              td(
                cls := "narrow-col",
                small(
                  cls := "text-muted",
                  io.util.md.renderMonthYear(startDate).getOrElse("No Date")
                )
              ),
              td(
                a(
                  href := s"/${projects.collName}/${io.util.sanatise
                      .mdNameToHtml(project.name)}",
                  img(
                    src := project.frontMatter.avatar,
                    alt := "Project 1 Icon",
                    cls := "mr-2 bg-dark p-1 img-icon-pico"
                  ),
                  title
                )
              )
            )
        )
      ),
      p(
        a(
          href := s"/projects/",
          strong(s"View all projects")
        )
      )
    )
