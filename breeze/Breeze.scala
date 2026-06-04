package breeze

import model.ctx
import model.TemplateFunction
import model.AnyDocCollection

import model.SiteMapMeta
import model.SiteMapSchema.auto.given

object Breeze extends model.DictionaryTheme:

  val metadata = new {
    val name = "Breeze"
    val layouts = new {
      val article = breeze.articleLayout
      val articles = breeze.articles
    }
  }

  override val templates = new model.TemplateFunctions:
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
  override val siteMapMeta: SiteMapMeta[SiteMap] =
    SiteMapMeta.default.about(_.setAsRoot)

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

  trait Extra(using Context):
    def nav: List[AnyDocCollection] = List(ctx.site.about, ctx.site.articles)
    val extraHead: Seq[scalatags.Text.all.Modifier]
    val extraFoot: Seq[scalatags.Text.all.Modifier]

  def extras(using Context, model.Context.InMakeCtx): Extra = new {
    val extraHead = Seq.empty
    val extraFoot = Seq.empty
  }

  def whoAmI(using Context): String =
    ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright
