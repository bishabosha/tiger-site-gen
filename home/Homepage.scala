package home

import model.ctx
import model.SiteMapSchema.auto.given
import model.Doc
import model.Record
import steps.result.Result

object Homepage extends model.Theme:
  val metadata = new:
    val name = "Homepage"

  type Templates = NamedTuple.Empty
  override val templates = model.TemplateFunctions.Empty

  type SiteMap = (about: Doc[FrontMatter.About])

  override val siteMapMeta =
    defaultSiteMeta.about(
      _.setAsRoot.indexLayoutAlways(homeLayout)
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

  type Extra = NamedTuple.Empty
  def extras(using SiteContext) = Record(NamedTuple.Empty)
