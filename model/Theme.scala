package model

trait Theme:
  thisTheme =>

  def name: String

  def layouts: model.Layouts[Context, DocPage]
  type Site <: model.Site
  type FrontMatter <: model.FrontMatter

  final type DocCollection = model.DocCollection[DocPage]
  final type Docs = model.Docs[DocPage]
  final type Doc = model.Doc[DocPage]

  final type DocPage = model.DocPage {
    val frontMatter: FrontMatter
  }

  final type Context = model.Context {
    val site: Site
  }