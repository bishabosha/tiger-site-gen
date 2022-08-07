package model

import readData.md.Data

object md:

  type Site = model.Site {
    val about: Doc
    val articles: Docs
    val talks: Docs
    val videos: Docs
  }

  type Docs = model.Docs[Doc]

  type Doc = model.Doc {
    val frontMatter: Data {
      val title: String
      val published: String
      val avatar: String
      val links: List[String]
      val name: String
      val event: String
      val url: String
    }
  }