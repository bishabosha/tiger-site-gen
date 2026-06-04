package breezeSite

import model.ctx

import breeze.Breeze as parent
import model.TemplateFunction
import model.SiteMapSchema.auto.given
import model.SiteMapSchema.&++
import model.SiteMapMeta

object Breeze extends model.DictionaryTheme:

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

  type SiteMap = parent.SiteMap &++ (
    talks: DocsOf[FrontMatter.Talks, FrontMatter.Talk],
    videos: DocsOf[FrontMatter.Videos, FrontMatter.Video],
    projects: DocsOf[FrontMatter.Projects, FrontMatter.Project],
    `match-type-simulator`: DocOf[FrontMatter.Raw]
  )
  // todo: copy from parent
  override val siteMapMeta: SiteMapMeta[SiteMap] =
    SiteMapMeta.default.about(_.setAsRoot)

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
