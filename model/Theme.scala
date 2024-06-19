package model

trait Theme:
  thisTheme =>

  final type Layout = model.Layout[Context, DocPage]

  val metadata: Metadata
  trait Metadata extends Selectable:
    val name: String
    val layouts: model.Layouts

  type Site <: model.Site
  type FrontMatter <: model.FrontMatter

  type Extra

  def extras(using Context, Context.InMakeCtx): Extra

  final type DocCollection = model.DocCollection[DocPage]
  final type Docs = model.Docs[DocPage]
  final type Doc = model.Doc[DocPage]

  final type DocPage = model.DocPage {
    val frontMatter: FrontMatter
  }

  final type Context = model.Context {
    val site: Site
    val extra: Extra
  }
