//> using scala "3.1.3"
//> using lib "com.lihaoyi::os-lib:0.8.1"
//> using lib "com.lihaoyi::scalatags:0.11.1"
//> using lib "com.lihaoyi::sourcecode:0.3.0"

package example

import readData.paths.curr
import model.ctx

@main def makeSite =
  given model.SiteRoot = model.SiteRoot(root = os.Path(sourcecode.File()) / os.up)

  given model.Context = model.Context(
    siteRoot = summon[model.SiteRoot],
    site = readData.paths.buildSiteDb[model.md.Site]
  )

  os.remove.all(curr / "out")
  os.makeDir.all(curr / "out" / "articles")


  def prevNext[A <: model.Doc](i: Int, items: model.Docs[A]): (Option[A], Option[A]) =
    val prev = if i > 0 then Some(items(i - 1)) else None
    val next = if i < items.size - 1 then Some(items(i + 1)) else None
    (prev, next)

  for (doc, i) <- ctx.site.articles.zipWithIndex do
    val (prev, next) = prevNext(i, ctx.site.articles).swap // articles is in reverse order
    val article = templates.all.article(doc, prev, next)
    os.write(
      curr / "out" / "articles" / templates.sanatise.mdNameToHtml(doc.frontMatter.title),
      article
    )

  val indexPage = templates.all.index
  os.write(
    curr / "out" / "index.html",
    indexPage
  )
  val articlesPage = templates.all.articles
  os.write(
    curr / "out" / "articles" / "index.html",
    articlesPage
  )
  os.copy(
    curr / "_docs" / "static",
    curr / "out" / "static"
  )
end makeSite
