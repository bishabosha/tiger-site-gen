package home

import model.ctx
import model.SiteMapSchema.auto.given
import model.SiteMapMeta
import model.Doc
import model.DocPage
import model.Record
import model.Record.Lookup.auto.given
import steps.result.Result

object Homepage extends model.Theme:
  val metadata = new:
    val name = "Homepage"

  type SiteMap = (about: Doc[FrontMatter.About])

  override val siteMapMeta =
    defaultSiteMeta.about(
      _.setAsRoot.indexLayout(Function.const(Result.Ok(Some(homeLayout))))
    )

  object FrontMatter:
    final type About = Record[
      (
          title: String,
          name: String,
          copyright: String,
          description: String,
          avatar: String,
          linkss: List[Links]
      )
    ]

  def whoAmI(using Context): String = ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright

  case class Links(
      text: String,
      kind: Option[String],
      iconCls: String,
      link: String
  )
  given scalanotation.Reader[Links] =
    summon[scalanotation.Reader[Vector[Option[String]]]].mapResult { vec =>
      // TODO: it would be nicer to support tuple syntax directly
      vec match
        case Vector(Some(text), kind, Some(iconCls), Some(link)) =>
          Result.Ok(Links(text, kind, iconCls, link))
        case _ =>
          Result.Err(
            scalanotation.DecodeError.Custom(
              s"Expected a list of 4 items: text, optional kind, icon class, and link"
            )
          )
    }
