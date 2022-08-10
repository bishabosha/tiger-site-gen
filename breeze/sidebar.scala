package breeze

import scalatags.Text.all.*
import model.ctx

object sidebar:

  def ofBio(hideable: Boolean = true)(using Breeze.Context): scalatags.Text.Modifier =
    div(cls := "col-lg-4",
      div(cls := s"jumbotron shadow py-lg-5 py-3",
        div(
          bio(ctx.site.about.page, hideable),
        )
      )
    )