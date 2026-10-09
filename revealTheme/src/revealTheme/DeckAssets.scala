package revealTheme

import model.{SiteContext, StaticAsset, StaticBundle, BuildSession}
import io.util.paths

/** One prepared Reveal asset tree. Its content hash includes public assets and local overrides. */
final class DeckAssets private (load: () => StaticBundle):
  lazy val bundle: StaticBundle = load()
  def baseUrl(using SiteContext): String = paths.resolveStaticAsset(bundle)

  def url(path: String)(using SiteContext): String =
    require(bundle.files.contains(os.RelPath(path)), s"Unknown Reveal asset: $path")
    baseUrl + new java.net.URI(null, null, path, null, null).toASCIIString

  /** Resolve a URL at its point of creation, before Markdown or a layout emits HTML. */
  def resolve(value: String, collectionUrl: String)(using SiteContext): String =
    val base = new java.net.URI(s"https://tiger.invalid$collectionUrl")
    if value.isEmpty || value.startsWith("#") then value
    else try
      val uri = base.resolve(new java.net.URI(value.replace(" ", "%20")))
      if uri.getAuthority != base.getAuthority || !uri.getPath.startsWith(base.getPath) then value
      else
        val relative = uri.getPath.stripPrefix(base.getPath)
        if !bundle.files.contains(os.RelPath(relative)) then value
        else url(relative) + Option(uri.getRawQuery).map("?" + _).getOrElse("") +
          Option(uri.getRawFragment).map("#" + _).getOrElse("")
    catch case _: IllegalArgumentException | _: java.net.URISyntaxException => value

object DeckAssets:
  private[revealTheme] lazy val bundledFiles: Vector[String] =
    val asset = StaticAsset.resource("/revealTheme/assets.txt")
    new String(asset.bytes, java.nio.charset.StandardCharsets.UTF_8).linesIterator.toVector

  private case class Key(sources: RevealAssets, fonts: DeckFonts)
  private case class Snapshot(bundle: StaticBundle, versions: Map[os.Path, Option[io.util.sanatise.FileVersion]]):
    def unchanged: Boolean = versions.forall { (path, previous) =>
      try
        // Without ctime, equal-size edits with restored mtime cannot be detected safely.
        previous.forall(_.changed.nonEmpty) && version(path) == previous
      catch case scala.util.control.NonFatal(_) => false
    }
  private val snapshots = new BuildSession.Cache[Key, Snapshot]

  private def version(path: os.Path): Option[io.util.sanatise.FileVersion] =
    if os.exists(path) then Some(io.util.sanatise.fileVersion(path)) else None

  def prepare(sources: RevealAssets, fonts: DeckFonts, session: BuildSession): DeckAssets =
    new DeckAssets(() => {
      val cache = session.cache(snapshots)
      val key = Key(sources, fonts)
      cache.get(key).filter(_.unchanged) match
        case Some(cached) => cached.bundle
        case None =>
          val fresh = snapshot(sources, fonts, session)
          cache(key) = fresh
          fresh.bundle
    })

  private def snapshot(sources: RevealAssets, fonts: DeckFonts, session: BuildSession): Snapshot =
    val versions = scala.collection.mutable.Map.empty[os.Path, Option[io.util.sanatise.FileVersion]]
    // Capture before reading: a concurrent edit invalidates the next snapshot check.
    def observe(path: os.Path): Unit =
      versions.getOrElseUpdate(path, version(path))
      ()
    val files = scala.collection.mutable.Map.empty[os.RelPath, StaticAsset]
    val directories = scala.collection.mutable.LinkedHashSet.empty[os.Path]
    def file(source: os.Path, target: os.RelPath): Unit =
      observe(source)
      files(target) = StaticAsset.file(s"/reveal/$target", source, session)
    def tree(source: os.Path, target: os.RelPath): Unit =
      observe(source)
      require(os.exists(source), s"Missing presentation asset: $source")
      if os.isFile(source) then file(source, target)
      else
        directories += source
        def visit(directory: os.Path): Unit =
          // Observe each directory before listing it so concurrent additions cannot
          // be mistaken for an unchanged snapshot on the next render.
          observe(directory)
          for path <- os.list(directory) do
            observe(path)
            if os.isFile(path) then file(path, target / path.relativeTo(source))
            else if os.isDir(path) && !os.isLink(path) then visit(path)
        visit(source)

    for source <- Seq(sources.revealJs, sources.pdfJs) do
      observe(source / "package.json")
      require(os.isFile(source / "package.json"),
        s"Missing presentation package at $source. Run npm ci or configure RevealTheme(assetSources = ...).")
    for name <- bundledFiles do files(os.RelPath(name)) = StaticAsset.resource(s"/revealTheme/$name")
    for directory <- sources.themeDirectory.toSeq ++ sources.publicDirectory.toSeq do
      observe(directory) // Also track optional directories that do not exist yet.
      directories += directory // Track creation of a previously absent public/theme directory too.
      if os.exists(directory) then tree(directory, os.RelPath(""))
    tree(sources.revealJs / "LICENSE", os.RelPath("vendor/reveal/LICENSE"))
    tree(sources.revealJs / "dist", os.RelPath("vendor/reveal/dist"))
    val pdfAssets = Seq(
      "build/pdf.min.mjs" -> "pdf.mjs", "build/pdf.worker.min.mjs" -> "pdf.worker.mjs",
      "web/pdf_viewer.mjs" -> "pdf_viewer.mjs", "web/pdf_viewer.css" -> "pdf_viewer.css", "web/images" -> "images"
    ) ++ Seq("cmaps", "standard_fonts", "wasm", "iccs", "LICENSE").map(name => name -> name)
    for (source, target) <- pdfAssets do tree(sources.pdfJs / os.RelPath(source), os.RelPath(s"vendor/pdfjs/$target"))
    for face <- fonts.faces do
      require(files.contains(os.RelPath(s"assets/fonts/${face.file}")), s"Missing font file: public/assets/fonts/${face.file}")
    files(os.RelPath("fonts.css")) = StaticAsset.text("/reveal/fonts.css", fonts.stylesheet)
    Snapshot(StaticBundle("reveal", files.toMap, directories.toVector), versions.toMap)
