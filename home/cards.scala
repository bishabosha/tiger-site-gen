package home

import scalatags.Text.all.*
import model.ctx

import Homepage.*

object cards:

  def wrap(
      title: Option[String],
      light: Boolean = false,
      content: scalatags.Text.Modifier*
  ): scalatags.Text.Modifier =
    div(
      cls := "jumbotron shadow py-lg-4 py-3" + (if light then " bg-light"
                                                else ""),
      title.map(t => Seq(h4(t), hr())).toList.flatten,
      content
    )

  def simple(
      content: scalatags.Text.Modifier*
  ): scalatags.Text.Modifier =
    wrap(title = None, light = false, content*)

  def basic(
      title: String,
      content: scalatags.Text.Modifier*
  ): scalatags.Text.Modifier =
    wrap(title = Some(title), light = true, content*)

  def bio()(using Context): scalatags.Text.Modifier =
    simple(
      home.bio(ctx.site.about.index, hideable = false, collapsable = false)
    )
