package breezeSite

import scalatags.Text.all.raw

import BreezeSite.*

/** The document's HTML as it is. A leading doctype is dropped: every page gets one already, and
 *  built pages such as a deck start with their own.
 */
val rawTemplate = model.Layout[BreezeSite.Context, FrontMatter.Raw]: doc =>
  raw(io.util.md.renderRaw(doc.rawContent).replaceFirst("(?is)^\\s*<!doctype html>", ""))
