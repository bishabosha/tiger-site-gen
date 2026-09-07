package blog

import io.util.paths.{generateSite, generateSiteWatch}
import model.SiteRoot

given SiteRoot = SiteRoot(BlogPaths.root)

@main def makeSite(): Unit =
  generateSite("blog/_docs", "dist/breeze", theme = breezeSite.Breeze, ignoreCache = true)

@main def makeHome(): Unit =
  generateSite("blog/_home", "dist/home", theme = home.Homepage, ignoreCache = true)

@main def watchSite(): Unit =
  generateSiteWatch("blog/_docs", "dist/breeze", theme = breezeSite.Breeze)
