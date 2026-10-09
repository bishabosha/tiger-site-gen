package breeze

import model.ctx
import model.sctx
import model.Record
import model.Directory
import model.TemplateFunction
import model.ContentNode
import scalatags.Text.Modifier

import model.SiteMapSchema.auto.given

object Breeze extends model.DictionaryTheme, model.InferredExtras, model.InferredTemplates:

  override val metadata = new:
    val name = "Breeze"

  val layouts = Record:
    (
      about = about,
      article = articleLayout,
      articles = articles
    )

  val templateDefs = model.TemplateFunctions:
    (
      url = TemplateFunction(
        io.util.paths.resolveStaticAsset,
        _ => "http://example.com"
      ),
      icon = TemplateFunction(
        cls => s"""<i class="fa-regular $cls"></i>""",
        cls => s"""<i class="fa-regular $cls"></i>"""
      )
    )

  type SiteMap = (
      about: Directory[(index: DocOf[FrontMatter.About])],
      articles: Directory[
        (index: DocOf[FrontMatter.Articles], posts: VarArgDocsOf[FrontMatter.Article])
      ]
  )
  override val siteMapMeta = defaultSiteMeta
    .about(_.index(_.setAsRoot.layout(dict((about = layouts.about)))))
    .articles(
      _.index(_.indexed.layout(dict((articles = layouts.articles))))
        .posts(_.layout(dict((article = layouts.article))))
    )

  object FrontMatter:
    final type BasePage = BuiltinFrontMatter {
      val description: String
    }
    final type About = BasePage {
      val avatar: String
      val linkss: List[List[String]]
      val name: String
      val copyright: String
    }
    type Link = BuiltinFrontMatter {
      val title: String
      val subtitle: String
      val url: String
    }
    final type BaseArticle = BasePage {
      val title: String
    }
    final type Articles = BasePage
    final type Article = BaseArticle {
      val published: String
    }

  val extraDefs = defineExtras {
    (
      nav = List[ContentNode](sctx.site.about, sctx.site.articles),
      extraHead = Seq.empty[Modifier],
      extraFoot = Seq.empty[Modifier]
    )
  }

  /** Add host navigation and page dependencies without rebuilding the base extras record. */
  def extendExtras(
      extraNav: Seq[ContentNode] = Seq.empty,
      extraHead: Seq[scalatags.Text.Modifier] = Seq.empty,
      extraFoot: Seq[scalatags.Text.Modifier] = Seq.empty
  )(using SiteContext): Record[Extra] =
    val base = extras
    Record(
      (
        nav = base.nav ++ extraNav,
        extraHead = base.extraHead ++ extraHead,
        extraFoot = base.extraFoot ++ extraFoot
      )
    )

  def whoAmI(using Context): String =
    ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright
