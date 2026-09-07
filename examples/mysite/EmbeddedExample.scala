package mysite

import model.{Context, SiteRoot}

/** A runnable host example; serve dist/embedded-example as the web root. */
@main def buildEmbeddedExample(): Unit =
  buildHostExample(MySite, "embedded-example")

/** Same article embeds, with no standalone presentation pages. */
@main def buildEmbeddedOnlyExample(): Unit =
  buildHostExample(EmbeddedOnlySite, "embedded-only-example")

private def buildHostExample(theme: ExampleSite, output: String): Unit =
  val project = SiteRoot.here.root / os.up / os.up
  given SiteRoot = SiteRoot(project)
  val source = project / "examples" / "embedded" / "content"
  val dest = project / "dist" / output
  given theme.Context = Context.fromTheme(source, theme)
  io.util.paths.renderSite(dest, theme, os.walk(source).filter(os.isFile).toSet)
  println(s"Built embedded example at $dest")
