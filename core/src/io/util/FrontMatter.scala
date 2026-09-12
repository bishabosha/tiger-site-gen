package io.util

/** Separate document metadata from Markdown without interpreting the SON value. */
private[util] object FrontMatter:
  private val compact = """(?ms)\A\uFEFF?---scala[ \t]*\r?\n(.*?)^---[ \t]*\r?(?:\n|\z)(.*)\z""".r
  private val legacy = """(?ms)\A\uFEFF?(?:---[ \t]*\r?\n)?```scala[ \t]*\r?\n(.*?)^```[ \t]*\r?\n---[ \t]*\r?(?:\n|\z)(.*)\z""".r

  def split(source: String): (String, String) = source match
    case compact(son, body) => (son, body)
    case legacy(son, body) => (son, body)
    case _ if source.stripPrefix("\uFEFF").startsWith("---scala") =>
      throw IllegalArgumentException("unclosed ---scala front matter; expected closing --- on its own line")
    case _ =>
      throw IllegalArgumentException("no front matter found; expected ---scala followed by a SON value and closing ---")
