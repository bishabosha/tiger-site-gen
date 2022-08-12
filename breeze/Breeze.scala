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
    val event: String
    val url: String
  }

  def whoAmI(using Context): String = ctx.site.about.page.frontMatter.name
