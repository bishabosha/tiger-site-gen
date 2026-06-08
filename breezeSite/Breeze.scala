package breezeSite

import model.ctx
import model.sctx

import breeze.Breeze as parent
import model.TemplateFunction
import model.Record
import model.Record.Lookup.auto.given
import model.SiteMapSchema.auto.given
import model.SiteMapSchema.&++
import model.SiteMapMeta

object Breeze extends model.DictionaryTheme:

  val metadata = new:
    val name = parent.metadata.name

  val layouts = parent.layouts ++
    (
      about = breezeSite.about,
      talks = breezeSite.talks,
      projects = breezeSite.projects,
      project = breezeSite.project,
      raw = breezeSite.rawTemplate
    )

  override val templates = parent.templates & new model.TemplateFunctions:
    val `match-sim-embed` = TemplateFunction(
      args =>
        args match
          case s"""$size "$query"""" =>
            val height = if size == "S" then "400px" else size
            s"""<iframe src="/match-type-simulator/$query&stamp=${io.util.Templates.stamp}" width="100%" height="$height"></iframe>"""
          case _ =>
            throw new Exception(
              s"Invalid match-sim-embed template arguments: $args"
            ),
      _ => """<div></div>"""
    )

  type SiteMap = parent.SiteMap &++ (
      talks: DocsOf[FrontMatter.Talks, FrontMatter.Talk],
      videos: DocsOf[FrontMatter.Videos, FrontMatter.Video],
      projects: DocsOf[FrontMatter.Projects, FrontMatter.Project],
      `match-type-simulator`: DocOf[FrontMatter.Raw]
  )

  override val siteMapMeta = parent.siteMapMeta
    ._mergeFrom(defaultSiteMeta)
    .about(_.indexLayout(dict((about = layouts.about))))
    .talks(_.indexLayout(dict((talks = layouts.talks))))
    .projects(
      _.indexLayout(dict((projects = layouts.projects)))
        .pageLayout(dict((project = layouts.project)))
    )
    .`match-type-simulator`(_.indexLayout(dict((raw = layouts.raw))))

  override type Extra = parent.Extra
  override def extras(using SiteContext): Extra = Record:
    val p = parent.extras
    (
      nav = p.nav :+ sctx.site.projects :+ sctx.site.talks,
      extraHead =
        p.extraHead ++ HljsExtra.hljsHead ++ KatexExtra.katexHead ++ AdmonitionExtra.admonitionHead,
      extraFoot =
        p.extraFoot ++ HljsExtra.hljsFoot ++ KatexExtra.katexFoot ++ AdmonitionExtra.admonitionFoot
    )

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
