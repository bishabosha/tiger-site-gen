package revealTheme

/** Merge one built presentation into a site without removing another deck's assets. */
object DeckExport:
  def copy(source: os.Path, collection: String, destination: os.Path, pageName: String = ""): Unit =
    require(collection.matches("[a-zA-Z0-9_-]+"), s"Invalid deck collection: $collection")
    require(destination != source && !destination.startsWith(source), "Export destination must be outside the build")
    val page = source / collection / "index.html"
    require(os.isFile(page), s"Missing display deck: $page. Build with --display first.")
    val html = os.read(page)
    val roots = "/static/([a-zA-Z0-9_-]+)/".r.findAllMatchIn(html).map(_.group(1)).toSet
    require(roots.exists(_.startsWith(s"deck_${collection}_")), "Rebuild this deck with split Reveal assets before exporting")
    for name <- roots do require(os.isDir(source / "static" / name), s"Missing deck assets: $name")
    val filename = if pageName.isEmpty then s"$collection.html" else pageName
    require(filename.matches("[a-zA-Z0-9_.-]+\\.html"), s"Invalid page source name: $filename")
    // Copy only assets referenced by this build, not stale bundles from earlier builds.
    for name <- roots do
      val from = source / "static" / name
      for file <- os.walk(from) if os.isFile(file) do
        val to = destination / "static" / name / file.relativeTo(from)
        os.makeDir.all(to / os.up)
        os.copy.over(file, to)
    val pages = destination / "static" / "pageSources"
    os.makeDir.all(pages)
    os.copy.over(page, pages / filename)
    // Collection-scoped cleanup; shared Reveal runtimes and all other decks stay intact.
    val owned = (s"deck_${java.util.regex.Pattern.quote(collection)}_[a-f0-9]{32}").r
    for old <- os.list(destination / "static") if owned.matches(old.last) && !roots(old.last) do os.remove.all(old)
    println(s"Exported $collection to $destination ($filename)")

@main def exportDeck(source: String, collection: String, destination: String, pageName: String = ""): Unit =
  DeckExport.copy(os.Path(source, os.pwd), collection, os.Path(destination, os.pwd), pageName)
