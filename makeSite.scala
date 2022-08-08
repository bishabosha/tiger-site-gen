//> using scala "3.1.3"
//> using lib "com.lihaoyi::os-lib:0.8.1"
//> using lib "com.lihaoyi::scalatags:0.11.1"
//> using lib "com.lihaoyi::sourcecode:0.3.0"

package example

import model.curr
import model.ctx

import scalatags.Text.all.doctype

@main def makeSite =
  given model.SiteRoot = model.SiteRoot(root = os.Path(sourcecode.File()) / os.up)

  given model.Context = model.Context(
    siteRoot = summon[model.SiteRoot],
    site = io.util.paths.buildSiteDb[model.md.Site]
  )

  os.remove.all(curr / "out")
  os.makeDir.all(curr / "out" / "articles")
  os.makeDir.all(curr / "out" / "about")

  for doc <- ctx.site.articles do
    val article = model.md.layouts(doc.frontMatter.layout)(doc)
    os.write(
      curr / "out" / "articles" / templates.sanatise.mdNameToHtml(doc.name),
       doctype("html")(article)
    )
  val articlesPage = model.md.layouts(ctx.site.articles.index.frontMatter.layout)(ctx.site.articles.index)
  os.write(
    curr / "out" / "articles" / "index.html",
    doctype("html")(articlesPage)
  )

  val aboutPage = model.md.layouts(ctx.site.about.index.frontMatter.layout)(ctx.site.about.index)
  os.write(
    curr / "out" / "about" / "index.html",
    doctype("html")(aboutPage)
  )

  if ctx.site.about.index.frontMatter.isRoot then
    os.write(
      curr / "out" / "index.html",
      io.util.paths.rootPage(redirect = "about/index.html")
    )
  os.copy(
    curr / "_docs" / "static",
    curr / "out" / "static"
  )
end makeSite
