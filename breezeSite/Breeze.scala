package breezeSite

import model.ctx

import breeze.Breeze as parent
import io.util.TemplateFunction

object Breeze extends model.Theme:

  val metadata = new:
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts & new:
      val about = breezeSite.about
      val talks = breezeSite.talks
      val projects = breezeSite.projects
      val project = breezeSite.project
      val raw = breezeSite.rawTemplate

  override val templates = parent.templates & new io.util.TemplateFunctions:
    val `match-sim-embed` = TemplateFunction(
      args => args match
        case s"""$size "$query"""" =>
          val height = if size == "S" then "400px" else size
          s"""<iframe src="/match-type-simulator/$query&stamp=${io.util.Templates.stamp}" width="100%" height="$height"></iframe>"""
        case _ =>
          throw new Exception(s"Invalid match-sim-embed template arguments: $args"),
      _ => """<div></div>"""
    )

  type Site = parent.Site & {
    val talks: Docs
    val videos: Docs
    val projects: Docs
    val `match-type-simulator`: Doc
  }

  override type Extra = parent.Extra & breezeSite.Extra
  override def extras(using
      Context,
      model.Context.InMakeCtx
  ): breezeSite.Extra = new {}

  export parent.{FrontMatter, whoAmI}
