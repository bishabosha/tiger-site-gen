package revealTheme

import model.{Context, SiteRoot}
import io.util.Templates

import mysite.MySite

/** Exercise the authoring contract through Tiger, including a changed slide count. */
@main def verifyAuthoring(): Unit =
  val source = example.ExamplePaths.root
  val root = os.temp.dir(prefix = "reveal-authoring-")
  def expectFailure(label: String)(operation: => Unit): Unit =
    val error = try
      operation
      None
    catch case scala.util.control.NonFatal(e) => Some(e)
    assert(error.nonEmpty, s"Expected failure: $label")

  def slide(id: String, seconds: Int, body: String, layout: String = "standard"): String =
    s"""```scala
      |(id = "$id", seconds = $seconds, layout = "$layout")
      |```
      |---
      |
      |## $id
      |
      |$body
      |
      |## Speaker notes
      |
      |The source is [here](https://example.org/evidence).
      |""".stripMargin

  try
    os.symlink(root / "node_modules", source / "node_modules")
    os.makeDir.all(root / "public")
    os.copy(source / "examples" / "embedded" / "content", root / "content")
    val content = root / "content" / "presentations" / "conference" / "slides"
    os.remove.all(content)
    os.makeDir.all(content)
    val richContent = """An introduction.
                        |{.focus}
                        |
                        |{{columns}}
                        |
                        |{{stack}}
                        |
                        |```scala
                        |val x = 1 < 2
                        |```
                        |
                        |{{end-stack}}
                        |
                        |{{stack}}
                        |
                        || API | State |
                        || --- | --- |
                        || `IArray` | Merged |
                        |
                        |
                        |{{end-stack}}
                        |
                        |{{end-columns}}""".stripMargin
    // Creation order deliberately differs from presentation order.
    os.write(content / "020 - second.md", slide("second", 45, "Some text."))
    os.write(content / "010 - first.md", slide("first", 30, richContent))
    os.write(content / "030 - appendix.md", slide("appendix", 0, "Reference.", "appendix"))
    val siteRoot = SiteRoot(root)
    locally {
      given SiteRoot = siteRoot
      MySite.build(root / "content", root / "dist")
    }
    val output = root / "dist" / "presentations" / "conference"
    val manifest = ujson.read(os.read(output / "deck.json"))
    assert(manifest("mainSlides").num == 2)
    assert(manifest("totalSeconds").num == 75)
    assert(manifest("slides").arr.map(_("id").str).toList == List("first", "second", "appendix"))
    val html = os.read(output / "index.html")
    assert(!os.exists(content / "000 - index.md"), "Slides must be indexless")
    assert(!os.exists(root / "dist" / "presentations" / "conference" / "slides"), "Slides were emitted as standalone pages")
    assert(os.read(root / "dist" / "index.html").contains("/articles/"), "Missing Tiger root redirect")
    assert(html.contains("<p class=\"focus\">An introduction.</p>"))
    assert(html.contains("class=\"columns \""))
    assert(html.contains("class=\"stack \""))
    assert(html.contains("language-scala") && html.contains("val x = 1 &lt; 2"))
    assert(html.contains("article-table"))
    assert(html.contains("data-visibility=\"uncounted\""))
    assert(!html.contains("{{") && !html.contains("{.focus}"))
    val notes = os.read(output / "speaker-notes.html")
    assert(notes.contains("0:00-0:30") && notes.contains("0:30-1:15"))
    assert(notes.contains("https://example.org/evidence"))

    val fencedHeading = "## Title\n\n```text\n## Speaker notes\n```\n\n## Speaker notes\n\nNotes."
    assert(Slides.splitAndValidate(fencedHeading, "fixture")._1.contains("## Speaker notes"))
    expectFailure("unbalanced layout") {
      Slides.splitAndValidate("## Title\n{{columns}}\n## Speaker notes\nNotes", "fixture")
    }
    expectFailure("missing notes") { Slides.splitAndValidate("## Title", "fixture") }

    given SiteRoot = SiteRoot(root)
    val context = Context.fromTheme(root / "content", MySite)
    val mounted = context.extra.conference.context
    assert(mounted.site.deck eq context.site.presentations.conference, "Mount replaced the host's deck collection")
    val shared = mounted.extra.slides.read()(using mounted)
    val (_, indexDependencies) = Templates.withDependencyCollection {
      MySite.conference.index[MySite.Context](_.extra.conference)
        .run(context.site.presentations.conference.index)(using context)
    }(using context)
    val (_, notesDependencies) = Templates.withDependencyCollection {
      MySite.conference.notes[MySite.Context](_.extra.conference)
        .run(context.site.presentations.conference.`speaker-notes`)(using context)
    }(using context)
    assert(shared eq mounted.extra.slides.read()(using mounted), "The rendered slides were recomputed")
    val slidePaths = os.list(content).map(_.toString).toSet
    assert(slidePaths.subsetOf(indexDependencies), "The deck lost its slide dependencies")
    assert(slidePaths.subsetOf(notesDependencies), "The notes page lost its slide dependencies")

    // Exercise Tiger's incremental generator with a populated dependency cache.
    io.util.paths.generateSite("content", "dist", MySite, ignoreCache = false)
    val edited = slide("first", 30, richContent + "\n\nUpdated only the slide.")
      .replace("The source is", "Updated slide notes. The source is")
    os.write.over(content / "010 - first.md", edited)
    io.util.paths.generateSite("content", "dist", MySite, ignoreCache = false)
    val updatedHtml = os.read(output / "index.html")
    assert(updatedHtml.contains("Updated only the slide."))
    assert(os.read(output / "speaker-notes.html").contains("Updated slide notes."))
    assert(!os.exists(root / "dist" / "presentations" / "conference" / "slides"))
    val freshContext = Context.fromTheme(root / "content", MySite)
    val freshMount = freshContext.extra.conference.context
    val refreshed = freshMount.extra.slides.read()(using freshMount)
    assert(refreshed.head.slide.render.contains("Updated only the slide."))
    assert(!shared.head.slide.render.contains("Updated only the slide."), "Prepared content leaked across builds")

    os.write.over(content / "020 - second.md", slide("first", 45, "Duplicate ID."))
    expectFailure("extras validate eagerly") { Context.fromTheme(root / "content", MySite) }
    expectFailure("duplicate ID") {
      given SiteRoot = siteRoot
      MySite.build(root / "content", root / "dist")
    }
    assert(os.read(output / "index.html") == updatedHtml, "An invalid edit replaced the last good build")
    println("Authoring checks passed: eager slide extras, dependencies, fresh builds, Tiger layouts, ordering, timings and notes.")
  finally os.remove.all(root)
