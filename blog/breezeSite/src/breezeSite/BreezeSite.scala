package breezeSite

import model.sctx
import scalatags.Text.all.*

import breeze.Breeze

import model.TemplateFunction
import model.Record
import model.Directory
import model.Record.++
import model.SiteMapSchema.auto.given

object BreezeSite extends model.DictionaryTheme, model.InferredExtras, model.InferredTemplates:

  val metadata = new:
    val name = Breeze.metadata.name

  val templateDefs = Breeze.templates ++ model.TemplateFunctions:
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

  type SiteMap = Breeze.SiteMap ++ (
      talks: Directory[
        (index: DocOf[FrontMatter.Talks], posts: VarArgDocsOf[FrontMatter.Talk])
      ],
      videos: DocsOf[FrontMatter.Video],
      projects: Directory[
        (index: DocOf[FrontMatter.Projects], posts: VarArgDocsOf[FrontMatter.Project])
      ],
      `match-type-simulator`: Directory[(index: DocOf[FrontMatter.Raw])]
  )

  override val siteMapMeta = Breeze.siteMapMeta
    .extend(defaultSiteMeta)
    .about(_.index(_.layout(dict((about = breezeSite.about)))))
    .talks(_.index(_.indexed.layout(dict((talks = breezeSite.talks)))))
    .projects(
      _.index(_.indexed.layout(dict((projects = breezeSite.projects))))
        .posts(_.layout(dict((project = breezeSite.project))))
    )
    .`match-type-simulator`(_.index(_.layout(dict((raw = breezeSite.rawTemplate)))))

  val extraDefs = defineExtraRecord {
    Breeze.extendExtras(
      extraNav = Seq(sctx.site.projects, sctx.site.talks),
      extraHead = Seq(meta(name := "twitter:site", content := "@bishabosha")) ++
        HljsExtra.hljsHead ++ KatexExtra.katexHead ++ AdmonitionExtra.admonitionHead,
      extraFoot = HljsExtra.hljsFoot ++ KatexExtra.katexFoot ++ AdmonitionExtra.admonitionFoot
    )
  }

  object FrontMatter:
    export Breeze.FrontMatter.*
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

  export Breeze.whoAmI
