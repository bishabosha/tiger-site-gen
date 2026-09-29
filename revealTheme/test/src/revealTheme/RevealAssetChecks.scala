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
