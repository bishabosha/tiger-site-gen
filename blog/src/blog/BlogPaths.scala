package blog

import model.SiteRoot

/** Locate the repository independently of the working directory used by Mill or Metals. */
object BlogPaths:
  val root: os.Path = SiteRoot.here.root / os.up / os.up / os.up
  val content: os.Path = root / "blog"
