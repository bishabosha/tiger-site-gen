package blog

import io.util.paths.{generateSite, generateSiteWatch}
import model.SiteRoot

given SiteRoot = SiteRoot(BlogPaths.root)

@main def makeSite(): Unit =
  generateSite("blog/_docs", "dist/breeze", theme = breezeSite.BreezeSite, ignoreCache = true)

@main def makeHome(): Unit =
  generateSite("blog/_home", "dist/home", theme = home.Homepage, ignoreCache = true)

@main def watchSite(): Unit =
  generateSiteWatch("blog/_docs", "dist/breeze", theme = breezeSite.BreezeSite)

/** Live editing for the Breeze blog (any Tiger site works the same way): builds `blog/_docs`
 *  into `dist/breeze`, rebuilds on save, previews unsaved VS Code drafts of any article and
 *  serves with automatic refresh at http://127.0.0.1:8123/ (Content studio at `/__author/`).
 */
val breezeLiveSite = live.LiveSite(breezeSite.BreezeSite, live.LiveSiteSettings(
  contentDirectory = "blog/_docs",
  output = live.OutputDirectories("dist/breeze", "dist/breeze"),
  watched = Nil,
  siteUrl = "/articles/",
  studio = live.StudioSettings(directory = "articles")
))

/** `dev` (default), `build`, `watch`, `serve [--static] [--port N]`. */
@main def liveBlog(args: String*): Unit = breezeLiveSite.main(args)
