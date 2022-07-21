package model

import readData.md.Data

object md:

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

  object Doc:

    def fromRaw(raw: model.Doc): Doc = raw.asInstanceOf[Doc]