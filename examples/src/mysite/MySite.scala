package mysite

/* DEMO SITE for testing embedding of presentations within articles */

import revealTheme.{RevealTheme, RevealAssets}
import model.{Layout, Record, TemplateFunction, TemplateFunctions, ctx}
import model.SiteMapSchema.auto.given
import scalatags.Text.all.*

type ArticleMeta = model.Dictionary {
  val layout: String
  val title: String
}

/** The host owns naming, root placement, assets and the lifetime of prepared mounts. */
class ExampleSite(serveDeckPages: Boolean, assets: RevealAssets.Resolver = RevealAssets.fromNpm) extends model.DictionaryTheme:
  val metadata: model.Theme.Metadata = new:
    val name = "A website with articles and two presentations"

  type Templates = (date: TemplateFunction)
  val templates: TemplateFunctions[Templates] = TemplateFunctions(
    (date = TemplateFunction(_ => java.time.LocalDate.now.toString, _ => "today"))
  )

  type SiteMap = (
      articles: model.Directory[(index: DocOf[ArticleMeta], posts: VarArgDocsOf[ArticleMeta])],
      presentations: model.Directory[(conference: RevealTheme.Deck, workshop: RevealTheme.Deck)]
  )

  val conference = RevealTheme.mount[SiteMap](_.presentations.conference, assets)
  val workshop = RevealTheme.mount[SiteMap](_.presentations.workshop, assets)

  type Extra = (conference: conference.Prepared, workshop: workshop.Prepared)
  def extras(using SiteContext): Record[Extra] =
    Record((conference = conference.prepare(), workshop = workshop.prepare()))

  private val article: LayoutOf[ArticleMeta] = Layout { page =>
    html(lang := "en")(
      head(meta(charset := "utf-8"),
        meta(name := "viewport", content := "width=device-width, initial-scale=1"),
        scalatags.Text.tags2.title(page.frontMatter.title)),
      body(
        scalatags.Text.tags2.article(
          h1(page.frontMatter.title),
          raw(io.util.md.renderDoc(page.rawContent)),
          ctx.extra.conference.embed(linkToStandalone = serveDeckPages),
          h2("Workshop"),
          ctx.extra.workshop.embed(linkToStandalone = serveDeckPages)
        )
      )
    )
  }

  private val articleIndex: LayoutOf[ArticleMeta] = Layout { page =>
    html(lang := "en")(
      head(meta(charset := "utf-8"),
        scalatags.Text.tags2.title(page.frontMatter.title)),
      body(
        h1(page.frontMatter.title),
        raw(io.util.md.renderDoc(page.rawContent)),
        ul(ctx.site.articles.posts.map(post => li(a(href := post.url)(post.frontMatter.title))))
      )
    )
  }

  private val articleLayouts: model.SiteMapMeta.SelLayout[Context, ArticleMeta] =
    dict((index = articleIndex, article = article))

  override val siteMapMeta =
    val host = defaultSiteMeta
      .articles(_.index(_.setAsRoot.layout(articleLayouts).indexed).posts(_.layout(articleLayouts)))
    if serveDeckPages then
      host.presentations(_
        .conference(conference.installLayouts[Context])
        .workshop(workshop.installLayouts[Context])
      )
    else host

object MySite extends ExampleSite(serveDeckPages = true):
  def build(source: os.Path, output: os.Path)(using model.SiteRoot): Unit =
    given Context = model.Context.fromTheme(source, this)
    io.util.paths.renderSite(output, this, os.walk(source).filter(os.isFile).toSet)

/** Same source collections, but only the host's articles have page layouts. */
object EmbeddedOnlySite extends ExampleSite(serveDeckPages = false)
