package io.util

/** Separate document metadata from Markdown without interpreting the SON value. */
object FrontMatter:
  private val compact = """(?ms)\A\uFEFF?---scala[ \t]*\r?\n(.*?)^---[ \t]*\r?(?:\n|\z)(.*)\z""".r
  private val legacy = """(?ms)\A\uFEFF?(?:---[ \t]*\r?\n)?```scala[ \t]*\r?\n(.*?)^```[ \t]*\r?\n---[ \t]*\r?(?:\n|\z)(.*)\z""".r

  /** Optional recognition for authoring tools, which also accept plain Markdown. */
  def unapply(source: String): Option[(String, String)] = source match
    case compact(son, body) => Some((son, body))
    case legacy(son, body) => Some((son, body))
    case _ => None

  def split(source: String): (String, String) = unapply(source).getOrElse {
    if source.stripPrefix("\uFEFF").startsWith("---scala") then
      throw IllegalArgumentException("unclosed ---scala front matter; expected closing --- on its own line")
    else
      throw IllegalArgumentException("no front matter found; expected ---scala followed by a SON value and closing ---")
  }
