package revealTheme

/** Internal URL helper; mounts derive the base from their selected collection. */
final case class DeckAssets(baseUrl: String):
  require(baseUrl.isEmpty ||
    (baseUrl.startsWith("/") && !baseUrl.startsWith("//") && baseUrl.endsWith("/")),
    "Asset URL must be empty (standalone) or a site-absolute directory ending in /")
  def url(path: String): String = baseUrl + path

object DeckAssets:
  /** Install a bundle in the collection directory selected by a prepared mount. */
  def install(root: os.Path, dest: os.Path): Unit =
    val pdfjs = root / "node_modules" / "pdfjs-dist"
    val reveal = root / "node_modules" / "reveal.js"
    require(os.isFile(pdfjs / "package.json") && os.isFile(reveal / "package.json"),
      "Presentation dependencies are missing. Run npm ci before building.")
    for source <- os.list(root / "public") do
      os.copy.over(source, dest / source.last, createFolders = true, replaceExisting = true)
    for file <- Seq("theme.css", "deck.js", "notes.css") do
      os.copy.over(root / "revealTheme" / file, dest / file, createFolders = true)
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
