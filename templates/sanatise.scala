package templates

object sanatise:
  private val regex = raw"[!?&*^$$#@]".r

  def mdNameToHtml(name: String) =
    regex.replaceAllIn(name.replace(" ", "-"), "").toLowerCase + ".html"

  def readTime(wordCount: Int): String =
    val raw = wordCount / 200.0 // a "comfortable" speed for reading out loud.
    val time = math.max(math.round(raw), 1).toInt
    s"$time minute read"