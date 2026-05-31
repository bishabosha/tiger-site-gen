package breeze

import model.ctx
import model.TemplateFunction

object Breeze extends model.Theme:

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

  type Site = model.Site {
    val about: Doc
    val articles: Docs
  }

  type FrontMatter = model.Theme.BuiltinFrontMatter & model.Dictionary {
    val title: String
    val published: String
    val startDate: String
    val endDate: String
    val avatar: String
    val linkss: List[List[String]]
    val name: String
    val copyright: String
    val subtitle: String
    val url: String
    val description: String
    val isInProgress: Boolean
    val ordered: String // a helper to order items
  }

  trait Extra(using Context):
    def nav: List[DocCollection] = List(ctx.site.about, ctx.site.articles)
    val extraHead: Seq[scalatags.Text.all.Modifier]
    val extraFoot: Seq[scalatags.Text.all.Modifier]

  def extras(using Context, model.Context.InMakeCtx): Extra = new {
    val extraHead = Seq.empty
    val extraFoot = Seq.empty
  }

  def whoAmI(using Context): String = ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright
