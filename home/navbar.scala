package home

import scalatags.Text.all.*
import scalatags.Text.tags2.nav

def navbar(from: NavBar) =
  nav(
    cls := "navbar navbar-expand-md navbar-light fixed-top bg-light",
    div(
      cls := "container-fluid",
      a(cls := "navbar-brand navbar-slash", href := "/", from.brand),
      button(
        cls := "navbar-toggler",
        tpe := "button",
        data("bs-toggle") := "collapse",
        data("bs-target") := "#navbarSupportedContent",
        aria.controls := "navbarSupportedContent",
        aria.expanded := "false",
        aria.label := "Toggle navigation",
        span(cls := "navbar-toggler-icon")
      ),
      div(
        cls := "collapse navbar-collapse",
        id := "navbarSupportedContent",
        ul(
          cls := "navbar-nav me-auto",
          (for NavLink(active, link) <- from.links yield
            val linkCls = if active then "nav-link active" else "nav-link"
            val isCurrent =
              if active then Seq(attr("aria-current") := "page") else Seq.empty
            li(
              cls := "nav-item",
              a(cls := linkCls, isCurrent, href := link.href, link.text)
            )
          )
        )
      )
    )
  )
