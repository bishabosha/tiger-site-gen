package example

import io.util.paths.generateSite
import model.SiteRoot

given SiteRoot = SiteRoot.here

@main def makeSite =
  generateSite("_docs", "out", theme = breezeSite.Breeze)

@main def makeHome =
  generateSite("_home", "out_home", theme = home.Homepage)
