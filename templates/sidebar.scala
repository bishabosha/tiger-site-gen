package templates

import scalatags.Text.all.*

object sidebar:

  def ofBio(hideable: Boolean = true)(using model.Context): scalatags.Text.Modifier =
    div(cls := "col-lg-4",
      div(cls := s"jumbotron shadow py-lg-5 py-3",
        div(
          bio(summon[model.Context].about.me, hideable),
        )
      )
    )