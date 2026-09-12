package home

import model.ctx
import model.SiteMapSchema.auto.given
import model.Doc
import model.Record
import model.Directory

object Homepage extends model.EmptyExtras, model.EmptyTemplates:
  val metadata = new:
    val name = "Homepage"

  type SiteMap = (about: Directory[(index: Doc[FrontMatter.About])])

  override val siteMapMeta =
    defaultSiteMeta.about(
      _.index(_.setAsRoot.layoutAlways(homeLayout))
    )

  object FrontMatter:
    final type About = Record[
      (
          title: String,
          name: String,
          copyright: String,
          description: String,
          avatar: String,
          linkss: Vector[
            (
                String,
                Option[String],
                String,
                String
            )
          ]
      )
    ]

  def whoAmI(using Context): String = ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright
