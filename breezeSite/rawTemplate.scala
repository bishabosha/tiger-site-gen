package breezeSite

import scalatags.Text.all.raw

import Breeze.*

val rawTemplate = Layout[FrontMatter.Raw]: doc =>
  raw(io.util.md.renderRaw(doc.rawContent))
