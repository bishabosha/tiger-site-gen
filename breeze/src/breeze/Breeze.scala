package breeze

import model.ctx
import model.sctx
import model.Record
import model.TemplateFunction
import model.ContentNode

import model.SiteMapSchema.auto.given

object Breeze extends model.DictionaryTheme:

  override val metadata = new:
    val name = "Breeze"

  val layouts = Record:
    (
      about = about,
      article = articleLayout,
      articles = articles
    )

  type Templates = (
      url: TemplateFunction,
      icon: TemplateFunction
  )
  override val templates = model.TemplateFunctions:
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
      about: model.Directory[(index: DocOf[FrontMatter.About])],
      articles: model.Directory[
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

  type Extra = (
      nav: List[ContentNode],
      extraHead: Seq[scalatags.Text.all.Modifier],
      extraFoot: Seq[scalatags.Text.all.Modifier]
  )
  def extras(using SiteContext) = Record:
    (
      nav = List(sctx.site.about, sctx.site.articles),
      extraHead = Seq.empty,
      extraFoot = Seq.empty
    )

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
