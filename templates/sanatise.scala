package templates

object sanatise:
  def mdNameToHtml(name: String) =
    name.replace(" ", "-").replaceAll("[!?]", "").toLowerCase + ".html"

  def readTime(wordCount: Int): String =
    val raw = wordCount / 200.0 // a "comfortable" speed for reading out loud.
    val time = math.max(math.round(raw), 1).toInt
    s"$time minute read"