package breezeSite

import model.sctx
import scalatags.Text.all.*

import breeze.Breeze as parent
import model.TemplateFunction
import model.Record
import model.Record.++
import model.SiteMapSchema.auto.given

object Breeze extends model.DictionaryTheme:

  val metadata = new:
    val name = parent.metadata.name

  val layouts = Record:
    (
      about = breezeSite.about,
      talks = breezeSite.talks,
      projects = breezeSite.projects,
      project = breezeSite.project,
      raw = breezeSite.rawTemplate
    )

  type Templates = parent.Templates ++ (
      `match-sim-embed`: TemplateFunction
  )
  override val templates = parent.templates ++ model.TemplateFunctions:
    (
      `match-sim-embed` = TemplateFunction(
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
    )

  type SiteMap = parent.SiteMap ++ (
      talks: model.Directory[
        (index: DocOf[FrontMatter.Talks], posts: VarArgDocsOf[FrontMatter.Talk])
      ],
      videos: DocsOf[FrontMatter.Video],
      projects: model.Directory[
        (index: DocOf[FrontMatter.Projects], posts: VarArgDocsOf[FrontMatter.Project])
      ],
      `match-type-simulator`: model.Directory[(index: DocOf[FrontMatter.Raw])]
  )

  override val siteMapMeta = parent.siteMapMeta
    .extend(defaultSiteMeta)
    .about(_.index(_.layout(dict((about = layouts.about)))))
    .talks(_.index(_.indexed.layout(dict((talks = layouts.talks)))))
    .projects(
      _.index(_.indexed.layout(dict((projects = layouts.projects))))
        .posts(_.layout(dict((project = layouts.project))))
    )
    .`match-type-simulator`(_.index(_.layout(dict((raw = layouts.raw)))))

  type Extra = parent.Extra
  def extras(using SiteContext): Record[Extra] = parent.extendExtras(
    extraNav = Seq(sctx.site.projects, sctx.site.talks),
    extraHead = Seq(meta(name := "twitter:site", content := "@bishabosha")) ++
      HljsExtra.hljsHead ++ KatexExtra.katexHead ++ AdmonitionExtra.admonitionHead,
    extraFoot = HljsExtra.hljsFoot ++ KatexExtra.katexFoot ++ AdmonitionExtra.admonitionFoot
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
