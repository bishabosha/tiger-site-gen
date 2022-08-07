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

  for doc <- ctx.site.articles do
    val article = templates.all.article(doc)
    os.write(
      curr / "out" / "articles" / templates.sanatise.mdNameToHtml(doc.frontMatter.title),
      article
    )
  val articlesPage = templates.all.articles(ctx.site.articles.index)
  os.write(
    curr / "out" / "articles" / "index.html",
    articlesPage
  )

  val indexPage = templates.all.index(ctx.site.about.index)
  os.write(
    curr / "out" / "index.html",
    indexPage
  )
  os.copy(
    curr / "_docs" / "static",
    curr / "out" / "static"
  )
end makeSite
