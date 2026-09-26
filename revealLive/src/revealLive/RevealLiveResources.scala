package revealLive

/** The slide authoring UI bundled with this module, installed next to live decks as `authoring/`:
 *  the Reveal plugin for the live client (`patch.js`), the toolbar's Edit slide action (`live.js`),
 *  the thumbnail sidebar and the 16:9 presentation frame.
 */
object RevealLiveResources:
  val authoringFiles: Seq[String] = Seq("live.js", "patch.js", "sidebar.js", "sidebar.css", "frame.js", "navigation.js")

  def authoring(name: String): Array[Byte] =
    val stream = Option(getClass.getResourceAsStream(s"/revealLive/authoring/$name"))
      .getOrElse(throw IllegalStateException(s"Missing bundled authoring asset: $name"))
    try stream.readAllBytes()
    finally stream.close()

  def installAuthoring(destination: os.Path): Unit =
    for name <- authoringFiles do
      os.write.over(destination / name, authoring(name), createFolders = true)
