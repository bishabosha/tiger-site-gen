package example

import model.SiteRoot

/** Example data is kept in the repository, outside the published modules. */
object ExamplePaths:
  val root: os.Path = SiteRoot.here.root / os.up / os.up / os.up
