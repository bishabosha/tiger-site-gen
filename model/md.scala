package model

import io.util.md.Data

import templates.{about, article, articles}

object md:

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

  type Docs = model.Docs[DocPage]
  type Doc = model.Doc[DocPage]

  type DocPage = model.DocPage {
    val frontMatter: FrontMatter
  }

  type FrontMatter = Data {
    val title: String
    val published: String
    val avatar: String
    val links: List[String]
    val name: String
    val event: String
    val url: String
  }