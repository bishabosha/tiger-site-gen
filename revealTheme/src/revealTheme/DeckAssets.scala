package revealTheme

import model.{SiteContext, StaticAsset, StaticBundle, BuildSession}
import io.util.paths

/** A shared Reveal runtime plus an independent tree of deck-owned assets. */
final class DeckAssets private (load: () => DeckAssets.Prepared):
  private lazy val prepared = load()
  /** The effective asset manifest, retained for dependency and fragment-cache checks. */
  def bundle: StaticBundle = prepared.combined
  def deckBundle: StaticBundle = prepared.deck
  def runtimeBundle: StaticBundle = DeckAssets.runtime
  def runtimeBaseUrl(using SiteContext): String = paths.resolveStaticAsset(runtimeBundle)
  def baseUrl(using SiteContext): String =
    runtimeBaseUrl
    paths.resolveStaticAsset(deckBundle)

  def url(path: String)(using SiteContext): String =
    require(bundle.files.contains(os.RelPath(path)), s"Unknown Reveal asset: $path")
    val prefix = if deckBundle.files.contains(os.RelPath(path)) then baseUrl else runtimeBaseUrl
    prefix + new java.net.URI(null, null, path, null, null).toASCIIString

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

  private[revealTheme] lazy val runtime = StaticBundle("reveal",
    bundledFiles.map(name => os.RelPath(name) -> StaticAsset.resource(s"/revealTheme/$name")).toMap +
      (os.RelPath("fonts.css") -> StaticAsset.text("/reveal/fonts.css", "")))
  private[revealTheme] case class Prepared(combined: StaticBundle, deck: StaticBundle)
  private case class Key(sources: RevealAssets, fonts: DeckFonts, name: String)
  private case class Snapshot(prepared: Prepared, versions: Map[os.Path, Option[io.util.sanatise.FileVersion]]):
    def unchanged: Boolean = versions.forall { (path, previous) =>
      try
        // Without ctime, equal-size edits with restored mtime cannot be detected safely.
        previous.forall(_.changed.nonEmpty) && version(path) == previous
      catch case scala.util.control.NonFatal(_) => false
    }
  private val snapshots = new BuildSession.Cache[Key, Snapshot]

  private def version(path: os.Path): Option[io.util.sanatise.FileVersion] =
    if os.exists(path) then Some(io.util.sanatise.fileVersion(path)) else None

  def prepare(sources: RevealAssets, fonts: DeckFonts, session: BuildSession, name: String = "deck"): DeckAssets =
    new DeckAssets(() => {
      val cache = session.cache(snapshots)
      val key = Key(sources, fonts, name)
      cache.get(key).filter(_.unchanged) match
        case Some(cached) => cached.prepared
        case None =>
          val fresh = snapshot(sources, fonts, session, name)
          cache(key) = fresh
          fresh.prepared
    })

  private def snapshot(sources: RevealAssets, fonts: DeckFonts, session: BuildSession, name: String): Snapshot =
    val versions = scala.collection.mutable.Map.empty[os.Path, Option[io.util.sanatise.FileVersion]]
    // Capture before reading: a concurrent edit invalidates the next snapshot check.
    def observe(path: os.Path): Unit =
      versions.getOrElseUpdate(path, version(path))
      ()
    val files = scala.collection.mutable.Map.empty[os.RelPath, StaticAsset]
    val fontFiles = fonts.faces.map(face => os.RelPath(s"assets/fonts/${face.file}")).toSet
    def unusedFont(target: os.RelPath): Boolean =
      target.toString.startsWith("assets/fonts/") &&
        Set("woff", "woff2", "ttf", "otf")(target.ext.toLowerCase(java.util.Locale.ROOT)) &&
        !fontFiles(target)
    val directories = scala.collection.mutable.LinkedHashSet.empty[os.Path]
    def file(source: os.Path, target: os.RelPath): Unit =
      observe(source)
      if !unusedFont(target) then files(target) = StaticAsset.file(s"/reveal/$target", source, session)
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

    // Only host-owned files enter the deck bundle. Identical bundled overrides are shared too.
    for directory <- sources.themeDirectory.toSeq ++ sources.publicDirectory.toSeq do
      observe(directory) // Also track optional directories that do not exist yet.
      directories += directory // Track creation of a previously absent public/theme directory too.
      if os.exists(directory) then tree(directory, os.RelPath(""))
    for RevealAssets.Vendor(source, target) <- sources.vendor do tree(source, target)
    for face <- fonts.faces do
      require(files.contains(os.RelPath(s"assets/fonts/${face.file}")), s"Missing font file: public/assets/fonts/${face.file}")
    if fonts.faces.nonEmpty then files(os.RelPath("fonts.css")) = StaticAsset.text("/reveal/fonts.css", fonts.stylesheet)
    val local = files.toMap.filterNot((path, asset) => runtime.files.get(path).exists(_.hash == asset.hash))
    // A local override can still import or reference a shared file (for example,
    // theme.css's default fonts). Rewrite only those cross-tree literal references.
    val linked = local.map { (path, asset) =>
      if Set("css", "js", "mjs", "html", "svg")(path.ext.toLowerCase(java.util.Locale.ROOT)) then
        val text = new String(asset.bytes, java.nio.charset.StandardCharsets.UTF_8)
        def resolve(value: String): String =
          try
            val base = java.net.URI(s"https://assets.invalid/$path")
            val uri = base.resolve(value)
            if uri.getAuthority != base.getAuthority || uri.getPath == null || value.startsWith("/") || value.startsWith("#") then value
            else
              val target = os.RelPath(uri.getPath.stripPrefix("/"))
              if runtime.files.contains(target) && !local.contains(target) then
                s"/static/${runtime.outputDirectory}/$target" + Option(uri.getRawQuery).map("?" + _).getOrElse("") +
                  Option(uri.getRawFragment).map("#" + _).getOrElse("")
              else value
          catch case _: IllegalArgumentException => value
        val quoted = "([\"'])([^\"'\\r\\n]*)\\1".r.replaceAllIn(text, matched =>
          java.util.regex.Matcher.quoteReplacement(matched.group(1) + resolve(matched.group(2)) + matched.group(1)))
        val rewritten = "url\\(([^\"'()\\s]+)\\)".r.replaceAllIn(quoted, matched =>
          java.util.regex.Matcher.quoteReplacement(s"url(${resolve(matched.group(1))})"))
        path -> (if rewritten == text then asset else StaticAsset.text(asset.path, rewritten))
      else path -> asset
    }
    val dependencies = versions.keys.toVector
    val deck = StaticBundle(name, linked, dependencies)
    val combined = StaticBundle("reveal", runtime.files ++ linked, dependencies)
    Snapshot(Prepared(combined, deck), versions.toMap)
