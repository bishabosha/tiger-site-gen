package example

import io.util.paths.{generateSite, generateSiteWatch}
import model.SiteRoot

given SiteRoot = SiteRoot(ExamplePaths.root)

@main def makeSite =
  generateSite("_docs", "dist/breeze", theme = breezeSite.Breeze, ignoreCache = true)

@main def makeHome =
  generateSite("_home", "dist/home", theme = home.Homepage, ignoreCache = true)

@main def watchSite =
  generateSiteWatch("_docs", "dist/breeze", theme = breezeSite.Breeze)
