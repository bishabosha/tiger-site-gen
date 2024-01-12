//> using scala "3.4.0-RC1"
//> using dep com.lihaoyi::os-lib:0.9.3
//> using dep com.lihaoyi::scalatags:0.12.0
//> using dep com.lihaoyi::sourcecode:0.3.1
//> using dep com.vladsch.flexmark:flexmark-all:0.64.8
//> using jvm "17"

package example

import io.util.paths.generateSite
import model.SiteRoot

given SiteRoot = SiteRoot.here

@main def makeSite =
  generateSite("_docs", "out", theme = breezeSite.Breeze)

@main def makeJournal =
  generateSite("_journal", "out", theme = breezeJournal.Breeze)

@main def makePitch =
  generateSite("_pitch", "out", theme = breezePitch.Breeze)
