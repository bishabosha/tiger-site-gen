package revealTheme

class RevealAssetChecks extends munit.FunSuite:
  private def fixture(body: os.Path => Unit): Unit =
    val root = os.temp.dir(prefix = "reveal-assets-")
    try body(root)
    finally os.remove.all(root)

  test("default resolver uses the consuming site root") {
    fixture { root =>
      val sources = RevealAssets.fromNpm(model.SiteRoot(root))
      assertEquals(sources.revealJs, root / "node_modules" / "reveal.js")
      assertEquals(sources.pdfJs, root / "node_modules" / "pdfjs-dist")
      assertEquals(sources.themeDirectory, Some(root / "theme"))
      assertEquals(sources.publicDirectory, Some(root / "public"))
    }
  }

  test("missing external packages fail with actionable paths") {
    fixture { root =>
      val error = intercept[IllegalArgumentException] {
        DeckAssets.prepare(RevealAssets(root / "external-reveal", root / "external-pdfjs"), DeckFonts(), new model.BuildSession).bundle
      }
      assert(error.getMessage.contains((root / "external-reveal").toString))
      assert(error.getMessage.contains("assetSources ="))
      assert(!os.exists(root / "output"))
    }
  }

  test("bundled player assets load from the classpath without third-party JavaScript") {
    val loader = getClass
    assert(loader.getResource("/revealTheme/theme.css") != null)
    assert(loader.getResource("/revealTheme/embed.mjs") != null)
    assert(loader.getResource("/revealTheme/vendor/reveal/dist/reveal.js") == null)
    assert(loader.getResource("/revealTheme/vendor/pdfjs/pdf.mjs") == null)
  }

  private def assetFixture(body: (os.Path, RevealAssets) => Unit): Unit = fixture { root =>
    val reveal = root / "reveal"
    val pdf = root / "pdf"
    for path <- Seq(reveal / "package.json", reveal / "LICENSE", reveal / "dist" / "reveal.js",
        pdf / "package.json", pdf / "LICENSE", pdf / "build" / "pdf.min.mjs",
        pdf / "build" / "pdf.worker.min.mjs", pdf / "web" / "pdf_viewer.mjs", pdf / "web" / "pdf_viewer.css") do
      os.write(path, "fixture", createFolders = true)
    for name <- Seq("web/images", "cmaps", "standard_fonts", "wasm", "iccs") do
      os.makeDir.all(pdf / os.RelPath(name))
    body(root, RevealAssets(reveal, pdf, Some(root / "public"), Some(root / "theme")))
  }

  test("unchanged sources reuse the bundle across renders, isolated by session and configuration") {
    assetFixture { (root, sources) =>
      val session = new model.BuildSession
      def bundle(fonts: DeckFonts = DeckFonts()) = DeckAssets.prepare(sources, fonts, session).bundle
      val first = bundle()
      val hash = first.hash
      os.write(root / "slide.md", "changed slide")
      assert(bundle() eq first)
      assertEquals(bundle().hash, hash)
      assert(!(DeckAssets.prepare(sources, DeckFonts(), new model.BuildSession).bundle eq first))
      val changedFonts = bundle(DeckFonts(faces = Seq.empty, body = "Arial"))
      assert(!(changedFonts eq first))
      assert(bundle() eq first)
    }
  }

  test("asset edits invalidate even with equal size and restored mtime, preserving old snapshots") {
    assetFixture { (root, sources) =>
      val session = new model.BuildSession
      def bundle() = DeckAssets.prepare(sources, DeckFonts(), session).bundle
      val path = sources.revealJs / "dist" / "reveal.js"
      val first = bundle()
      val hash = first.hash
      val modified = java.nio.file.Files.getLastModifiedTime(path.toNIO)
      os.write.over(path, "changed")
      java.nio.file.Files.setLastModifiedTime(path.toNIO, modified)
      val second = bundle()
      assert(!(second eq first))
      assert(second.hash != hash)
      assertEquals(new String(first.files(os.RelPath("vendor/reveal/dist/reveal.js")).bytes), "fixture")
      assertEquals(new String(second.files(os.RelPath("vendor/reveal/dist/reveal.js")).bytes), "changed")
      assert(bundle() eq second)
    }
  }

  test("nested additions, renames and removals invalidate bundle membership") {
    assetFixture { (root, sources) =>
      val nested = root / "public" / "nested" / "empty"
      os.makeDir.all(nested)
      val session = new model.BuildSession
      def bundle() = DeckAssets.prepare(sources, DeckFonts(), session).bundle
      val first = bundle()
      os.write(nested / "added.txt", "added")
      val added = bundle()
      assert(!(added eq first))
      assert(added.files.contains(os.RelPath("nested/empty/added.txt")))
      os.move(nested / "added.txt", nested / "renamed.txt")
      val renamed = bundle()
      assert(renamed.hash != added.hash)
      assert(!renamed.files.contains(os.RelPath("nested/empty/added.txt")))
      assert(renamed.files.contains(os.RelPath("nested/empty/renamed.txt")))
      os.remove(nested / "renamed.txt")
      val removed = bundle()
      assertEquals(removed.hash, first.hash)
      assert(bundle() eq removed)
    }
  }

  test("optional roots and package manifests are checked on cache hits") {
    assetFixture { (root, sources) =>
      val session = new model.BuildSession
      def bundle() = DeckAssets.prepare(sources, DeckFonts(), session).bundle
      val first = bundle()
      os.write(root / "theme" / "custom.css", "body {}", createFolders = true)
      val added = bundle()
      assert(added.files.contains(os.RelPath("custom.css")))
      os.remove.all(root / "theme")
      assertEquals(bundle().hash, first.hash)
      os.remove(sources.pdfJs / "package.json")
      intercept[IllegalArgumentException](bundle())
      os.write(sources.pdfJs / "package.json", "restored")
      assertEquals(bundle().hash, first.hash)
    }
  }
