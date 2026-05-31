package breezeSite

import model.ctx

import breeze.Breeze as parent
import model.TemplateFunction

object Breeze extends model.Theme:

  val metadata = new:
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts & new:
      val about = breezeSite.about
      val talks = breezeSite.talks
      val projects = breezeSite.projects
      val project = breezeSite.project
      val raw = breezeSite.rawTemplate

  override val templates = parent.templates & new model.TemplateFunctions:
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
    val talks: DocsOf[FrontMatter.Talks, FrontMatter.Talk]
    val videos: DocsOf[FrontMatter.Videos, FrontMatter.Video]
    val projects: DocsOf[FrontMatter.Projects, FrontMatter.Project]
    val `match-type-simulator`: DocOf[FrontMatter.Raw]
  }

  override type Extra = parent.Extra & breezeSite.Extra
  override def extras(using
      Context,
      model.Context.InMakeCtx
  ): breezeSite.Extra = new {}

  object FrontMatter:
    export parent.FrontMatter.*
    type Talks = BasePage
    type Talk = Link {
      val ordered: String
    }
    type Raw = BuiltinFrontMatter
    type Videos = BuiltinFrontMatter
    type Video = Link
    type Projects = BasePage
    type Project = BaseArticle {
      val avatar: String
      val startDate: String
      val endDate: String
      val isInProgress: Boolean
      val url: String
    }

  export parent.whoAmI
