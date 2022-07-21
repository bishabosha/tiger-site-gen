package model

final case class Doc(
  frontMatter: readData.md.Data,
  wordCount: Int,
  htmlPreview: String,
  htmlContent: String
)