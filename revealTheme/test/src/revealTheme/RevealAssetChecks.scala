package revealTheme

class RevealAssetChecks extends munit.FunSuite:
  private def fixture(body: os.Path => Unit): Unit =
    val root = os.temp.dir(prefix = "reveal-assets-")
    try body(root)
    finally os.remove.all(root)

  test("default resolver uses the consuming site root") {
    fixture { root =>
      val sources = RevealAssets.fromSiteRoot(model.SiteRoot(root))
      assertEquals(sources.themeDirectory, Some(root / "theme"))
      assertEquals(sources.publicDirectory, Some(root / "public"))
      assertEquals(sources.vendor, Nil)
    }
  }

  test("missing vendor sources fail with actionable paths") {
    fixture { root =>
      val missing = RevealAssets(vendor = Seq(RevealAssets.Vendor(root / "external", os.RelPath("vendor/external"))))
      val error = intercept[IllegalArgumentException] {
        DeckAssets.prepare(missing, DeckFonts(), new model.BuildSession).bundle
      }
      assert(error.getMessage.contains((root / "external").toString))
      assert(!os.exists(root / "output"))
    }
  }

  test("reveal.js is bundled on the classpath; PDF.js is not") {
    val loader = getClass
    assert(loader.getResource("/revealTheme/theme.css") != null)
    assert(loader.getResource("/revealTheme/embed.mjs") != null)
    assert(loader.getResource("/revealTheme/vendor/reveal/dist/reveal.js") != null)
    assert(loader.getResource("/revealTheme/vendor/reveal/LICENSE") != null)
    assert(loader.getResource("/revealTheme/vendor/pdfjs/pdf.mjs") == null)
    assert(loader.getResource("/revealTheme/pdf-explorer.mjs") == null)
    val bundle = DeckAssets.prepare(RevealAssets(), DeckFonts(), new model.BuildSession).bundle
    for path <- Seq("vendor/reveal/dist/reveal.js", "vendor/reveal/dist/reveal.mjs", "vendor/reveal/dist/reveal.css",
        "vendor/reveal/dist/plugin/notes.js", "vendor/reveal/dist/plugin/highlight.js") do
      assert(bundle.files.contains(os.RelPath(path)), s"Missing bundled $path")
  }

  private def assetFixture(body: (os.Path, RevealAssets) => Unit): Unit = fixture { root =>
    val pkg = root / "package"
    for path <- Seq(pkg / "LICENSE", pkg / "dist" / "lib.js") do
      os.write(path, "fixture", createFolders = true)
    os.makeDir.all(pkg / "dist" / "images")
    body(root, RevealAssets(Some(root / "public"), Some(root / "theme"),
      Seq(RevealAssets.Vendor(pkg / "dist", os.RelPath("vendor/pkg")), RevealAssets.Vendor(pkg / "LICENSE", os.RelPath("vendor/pkg/LICENSE")))))
  }

  test("vendor files and directories land at their targets; theme and public override bundled files") {
    assetFixture { (root, sources) =>
      os.write(root / "theme" / "theme.css", "overridden", createFolders = true)
      val bundle = DeckAssets.prepare(sources, DeckFonts(), new model.BuildSession).bundle
      assertEquals(new String(bundle.files(os.RelPath("vendor/pkg/lib.js")).bytes), "fixture")
      assert(bundle.files.contains(os.RelPath("vendor/pkg/LICENSE")))
      assertEquals(new String(bundle.files(os.RelPath("theme.css")).bytes), "overridden")
    }
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
      val path = root / "package" / "dist" / "lib.js"
      val first = bundle()
      val hash = first.hash
      val modified = java.nio.file.Files.getLastModifiedTime(path.toNIO)
      os.write.over(path, "changed")
      java.nio.file.Files.setLastModifiedTime(path.toNIO, modified)
      val second = bundle()
      assert(!(second eq first))
      assert(second.hash != hash)
      assertEquals(new String(first.files(os.RelPath("vendor/pkg/lib.js")).bytes), "fixture")
      assertEquals(new String(second.files(os.RelPath("vendor/pkg/lib.js")).bytes), "changed")
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

  test("optional roots and vendor sources are checked on cache hits") {
    assetFixture { (root, sources) =>
      val session = new model.BuildSession
      def bundle() = DeckAssets.prepare(sources, DeckFonts(), session).bundle
      val first = bundle()
      os.write(root / "theme" / "custom.css", "body {}", createFolders = true)
      val added = bundle()
      assert(added.files.contains(os.RelPath("custom.css")))
      os.remove.all(root / "theme")
      assertEquals(bundle().hash, first.hash)
      os.remove(root / "package" / "LICENSE")
      intercept[IllegalArgumentException](bundle())
      os.write(root / "package" / "LICENSE", "fixture")
      assertEquals(bundle().hash, first.hash)
    }
  }
