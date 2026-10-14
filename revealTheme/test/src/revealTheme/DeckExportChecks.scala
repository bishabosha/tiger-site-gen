package revealTheme

class DeckExportChecks extends munit.FunSuite:
  test("interleaved exports preserve the other deck and share the runtime") {
    val root = os.temp.dir(prefix = "deck-export-")
    try
      val output = root / "blog"
      val shared = "reveal_" + "0" * 32
      def build(collection: String, hash: Char): (os.Path, String) =
        val source = root / s"$collection-$hash"
        val deck = s"deck_${collection}_" + hash.toString * 32
        os.write(source / collection / "index.html", s"<body data-deck-assets=\"/static/$deck/\" data-reveal-assets=\"/static/$shared/\"></body>", createFolders = true)
        os.write(source / "static" / shared / "deck.js", "shared", createFolders = true)
        os.write(source / "static" / deck / "slide.svg", collection, createFolders = true)
        os.write(source / "static" / "reveal_stale" / "unused.js", "stale", createFolders = true)
        (source, deck)
      val (talk, oldTalk) = build("talk", '1')
      val (lab, labAssets) = build("lab", '2')
      DeckExport.copy(talk, "talk", output)
      DeckExport.copy(lab, "lab", output, "lab.index.html")
      val (newTalk, newTalkAssets) = build("talk", '3')
      DeckExport.copy(newTalk, "talk", output)
      assert(!os.exists(output / "static" / oldTalk))
      assert(os.isFile(output / "static" / newTalkAssets / "slide.svg"))
      assertEquals(os.read(output / "static" / labAssets / "slide.svg"), "lab")
      assert(os.isFile(output / "static" / "pageSources" / "lab.index.html"))
      assertEquals(os.list(output / "static").count(_.last.startsWith("reveal_")), 1)
    finally os.remove.all(root)
  }
