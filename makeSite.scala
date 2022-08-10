//> using scala "3.1.3"
//> using lib "com.lihaoyi::os-lib:0.8.1"
//> using lib "com.lihaoyi::scalatags:0.11.1"
//> using lib "com.lihaoyi::sourcecode:0.3.0"

package example

import io.util.paths.generateSite

@main def makeSite =
  given model.SiteRoot = model.SiteRoot.here
  generateSite("out", theme = breeze.Breeze)
