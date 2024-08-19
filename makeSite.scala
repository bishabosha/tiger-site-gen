//> using scala "3.5.0"
//> using dep com.lihaoyi::os-lib::0.10.3
//> using dep com.lihaoyi::scalatags::0.13.1
//> using dep com.lihaoyi::sourcecode::0.4.2
//> using dep com.vladsch.flexmark:flexmark-all:0.64.8
//> using dep "org.virtuslab::scala-yaml:0.3.0"
//> using jvm "17"

package example

import io.util.paths.generateSite
import model.SiteRoot

given SiteRoot = SiteRoot.here

@main def makeSite =
  generateSite("_docs", "out", theme = breezeSite.Breeze)
