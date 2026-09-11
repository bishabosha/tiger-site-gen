package revealTheme

/** Internal URL helper; mounts derive the base from their selected collection. */
final case class DeckAssets(baseUrl: String):
  require(baseUrl.isEmpty ||
    (baseUrl.startsWith("/") && !baseUrl.startsWith("//") && baseUrl.endsWith("/")),
    "Asset URL must be empty (standalone) or a site-absolute directory ending in /")
  def url(path: String): String = baseUrl + path

object DeckAssets:
  /** Install a bundle in the collection directory selected by a prepared mount. */
  def install(sources: RevealAssets, dest: os.Path): Unit =
    val pdfjs = sources.pdfJs
    val reveal = sources.revealJs
    for source <- Seq(reveal, pdfjs) do
      require(os.isFile(source / "package.json"),
        s"Missing presentation package at $source. Run npm ci or configure new RevealTheme(assetSources = ...).")
    for directory <- sources.themeDirectory.toSeq ++ sources.publicDirectory.toSeq do
      require(os.isDir(directory), s"Missing presentation asset directory: $directory")

    def resource(name: String): Array[Byte] =
      val stream = Option(getClass.getResourceAsStream(s"/revealTheme/$name"))
        .getOrElse(throw IllegalStateException(s"Missing bundled Reveal asset: $name"))
      try stream.readAllBytes()
      finally stream.close()

    for name <- new String(resource("assets.txt"), java.nio.charset.StandardCharsets.UTF_8).linesIterator do
      os.write.over(dest / os.RelPath(name), resource(name), createFolders = true)
    for directory <- sources.themeDirectory.toSeq ++ sources.publicDirectory.toSeq do
      for source <- os.walk(directory).filter(os.isFile) do
        os.copy.over(source, dest / source.relativeTo(directory), createFolders = true)
    os.copy.over(reveal / "LICENSE", dest / "vendor" / "reveal" / "LICENSE", createFolders = true)
    os.copy.over(reveal / "dist", dest / "vendor" / "reveal" / "dist",
      createFolders = true, replaceExisting = true)
    val pdfAssets = Seq(
      "build/pdf.min.mjs" -> "pdf.mjs",
      "build/pdf.worker.min.mjs" -> "pdf.worker.mjs",
      "web/pdf_viewer.mjs" -> "pdf_viewer.mjs",
      "web/pdf_viewer.css" -> "pdf_viewer.css",
      "web/images" -> "images"
    ) ++ Seq("cmaps", "standard_fonts", "wasm", "iccs", "LICENSE").map(name => name -> name)
    for (source, target) <- pdfAssets do
      os.copy.over(pdfjs / os.RelPath(source), dest / "vendor" / "pdfjs" / target,
        createFolders = true, replaceExisting = true)
