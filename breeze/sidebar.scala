package breeze

import scalatags.Text.all.*
import model.ctx

import Breeze.*

object sidebar:

  def ofBio(hideable: Boolean = true)(using Context): scalatags.Text.Modifier =
    div(cls := "col-lg-4",
      div(cls := s"jumbotron shadow py-lg-5 py-3",
        div(
          bio(ctx.site.about.page, hideable),
        )
      )
    )
