package breezeSite

import scalatags.Text.all.raw

import BreezeSite.*

val rawTemplate = model.Layout[BreezeSite.Context, FrontMatter.Raw]: doc =>
  raw(io.util.md.renderRaw(doc.rawContent))
