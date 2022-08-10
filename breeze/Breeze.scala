package breeze

import model.ctx

object Breeze extends model.Theme:

  val name = "Breeze"

  val layouts = model.Layouts(
    "about" -> about,
    "article" -> article,
    "articles" -> articles,
  )

  type Site = model.Site {
    val about: Doc
    val articles: Docs
    val talks: Docs
    val videos: Docs
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