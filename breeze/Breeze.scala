package breeze

import scala.language.experimental.modularity

import model.ctx
import model.sctx
import model.Record
import model.TemplateFunction
import model.AnyDocCollection

import model.SiteMapMeta
import model.SiteMapSchema.auto.given
import model.Record.Lookup.auto.given

object Breeze extends model.DictionaryTheme:
  self =>

  override val metadata = new:
    val name = "Breeze"

  val layouts = Record:
    (
      article = articleLayout,
      articles = articles
    )

  type Templates = model.TemplateFunctions {
    val url: TemplateFunction
    val icon: TemplateFunction
  }
  override val templates = new:
    val url = TemplateFunction(
      io.util.paths.resolveStaticAsset,
      _ => "http://example.com"
    )
    val icon = TemplateFunction(
      cls => s"""<i class="fa-regular $cls"></i>""",
      cls => s"""<i class="fa-regular $cls"></i>"""
    )

  type SiteMap = (
      about: DocOf[FrontMatter.About],
      articles: DocsOf[FrontMatter.Articles, FrontMatter.Article]
  )
  override val siteMapMeta = defaultSiteMeta
    .about(_.setAsRoot)
    .articles(
      _.indexLayout(dict((articles = layouts.articles)))
        .pageLayout(dict((article = layouts.article)))
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

  type Extra = (
      nav: List[AnyDocCollection],
      extraHead: Seq[scalatags.Text.all.Modifier],
      extraFoot: Seq[scalatags.Text.all.Modifier]
  )
  def extras(using SiteContext) = Record:
    (
      nav = List(sctx.site.about, sctx.site.articles),
      extraHead = Seq.empty,
      extraFoot = Seq.empty
    )

  def whoAmI(using Context): String =
    ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright
