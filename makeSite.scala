//> using scala "3.1.3"
//> using lib "com.lihaoyi::os-lib:0.8.1"
//> using lib "com.lihaoyi::scalatags:0.11.1"
//> using lib "com.lihaoyi::sourcecode:0.3.0"

package example

import readData.paths.curr

@main def makeSite =
  given model.SiteRoot = model.SiteRoot(root = os.Path(sourcecode.File()) / os.up)

  val articleInfo = readData.articles.all()
  val talkInfo = readData.talks.all()
  val videoInfo = readData.videos.all()
  val aboutInfo = readData.about.first()

  given model.Context = model.Context(
    siteRoot = summon[model.SiteRoot],
    about = model.About(model.md.Doc.fromRaw((for path <- aboutInfo yield readData.md.render(path)).get))
  )

  os.remove.all(curr / "out")
  os.makeDir.all(curr / "out" / "articles")

  println("POSTS:")
  val articles = for (i, path) <- articleInfo yield
    println(s"post $i: $path")
    model.md.Doc.fromRaw(readData.md.render(path))


  def prevNext[A](i: Int, items: IndexedSeq[A]): (Option[A], Option[A]) =
    val prev = if i > 0 then Some(items(i - 1)) else None
    val next = if i < items.length - 1 then Some(items(i + 1)) else None
    (prev, next)

  for (doc, i) <- articles.zipWithIndex do
    val (prev, next) = prevNext(i, articles).swap // articles is in reverse order
    val article = templates.all.article(doc, prev, next)
    os.write(
      curr / "out" / "articles" / templates.sanatise.mdNameToHtml(doc.frontMatter.title),
      article
    )

  println("TALKS:")
  val talks = for (i, path) <- talkInfo yield
    println(s"talk $i: $path")
    val doc = model.md.Doc.fromRaw(readData.md.render(path))
    doc

  println("VIDEOS:")
  val videos = for (i, path) <- videoInfo yield
    println(s"video $i: $path")
    val doc = model.md.Doc.fromRaw(readData.md.render(path))
    doc

  val indexPage = templates.all.index(articles, talks, videos)
  os.write(
    curr / "out" / "index.html",
    indexPage
  )
  val articlesPage = templates.all.articles(articles)
  os.write(
    curr / "out" / "articles" / "index.html",
    articlesPage
  )
  os.copy(
    curr / "_docs" / "static",
    curr / "out" / "static"
  )
end makeSite
