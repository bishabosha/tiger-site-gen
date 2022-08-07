package model

import readData.md.Data

import templates.{index, article, articles}

object md:

  val templates = model.Templates(
    "index" -> index,
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