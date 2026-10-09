package revealTheme

/** Reveal's output hook, shared by direct themes and every mounted presentation. */
private[revealTheme] object DeckOutput:
  def write(outputRoot: os.Path)(using context: RevealTheme.Context): Unit =
    val dest = outputRoot / context.site.deck.outputPath
    val meta = context.site.deck.index.frontMatter
    val slides = context.extra.slides.read()
    val mainCount = slides.count(!_.appendix)
    val totalSeconds = slides.map(_.seconds).sum
    val manifest = ujson.Obj(
      "title" -> meta.title,
      "author" -> meta.author,
      "event" -> meta.event,
      "mainSlides" -> mainCount,
      "totalSeconds" -> totalSeconds,
      "slides" -> ujson.Arr.from(slides.map(s => ujson.Obj(
        "id" -> s.id, "title" -> s.title, "seconds" -> s.seconds,
        "startSeconds" -> s.start, "appendix" -> s.appendix, "source" -> s.source.relativeTo(context.siteRoot.root).toString)))
    )
    os.write.over(dest / "deck.json", ujson.write(manifest, indent = 2), createFolders = true)
    println(s"Built ${slides.size} slides ($mainCount main), ${Slides.stamp(totalSeconds)} with Tiger collection layouts.")
