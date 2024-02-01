package breeze

import model.ctx

object Breeze extends model.Theme:

  val metadata = new {
    val name = "Breeze"
    val layouts = new {
      val article: Layout = breeze.article
      val articles: Layout = breeze.articles
    }
  }

  type Site = model.Site {
    val about: Doc
    val articles: Docs
  }

  type FrontMatter = model.FrontMatter {
    val title: String
    val published: String
    val avatar: String
    val links: List[String]
    val name: String
    val copyright: String
    val event: String
    val url: String
    val description: String
  }

  trait Extra:
    val extraHead: Seq[scalatags.Text.all.Modifier]
    val extraFoot: Seq[scalatags.Text.all.Modifier]

  def extras(using model.Context.InMakeCtx): Extra = new {
    val extraHead = Seq.empty
    val extraFoot = Seq.empty
  }

  def whoAmI(using Context): String = ctx.site.about.page.frontMatter.name
  def copyright(using Context): String = ctx.site.about.page.frontMatter.copyright
