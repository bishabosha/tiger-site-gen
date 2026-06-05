package breezeSite

import scalatags.Text.all.raw

import Breeze.*

val rawTemplate = model.Layout[Breeze.Context, FrontMatter.Raw]: doc =>
  raw(io.util.md.renderRaw(doc.rawContent))
