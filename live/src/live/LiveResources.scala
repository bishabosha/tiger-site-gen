package live

/** Browser assets bundled with this module: the reload client and Content studio. */
object LiveResources:
  def bytes(name: String): Array[Byte] =
    val stream = Option(getClass.getResourceAsStream(s"/live/$name"))
      .getOrElse(throw IllegalStateException(s"Missing bundled live asset: $name"))
    try stream.readAllBytes()
    finally stream.close()

  /** Served as `/__preview/client.js` and injected into generated pages. */
  lazy val client: Array[Byte] = bytes("client.js")

  /** Content studio, served as `/__author/`. */
  lazy val studio: Array[Byte] = bytes("studio/index.html")
