package breezeSite

import scalatags.Text.all.raw

import Breeze.Layout

val rawTemplate = Layout: doc =>
  raw(io.util.md.renderRaw(doc.rawContent))
