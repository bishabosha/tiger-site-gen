package home

import model.ctx
import model.SiteMapSchema.auto.given
import model.SiteMapMeta
import model.Doc
import model.DocPage
import steps.result.Result

object Homepage extends model.Theme:
  val metadata = new:
    val name = "Homepage"
    val layouts = new model.Layouts:
      val home = homeLayout

  type SiteMap = (about: Doc[FrontMatter.About])

  override val siteMapMeta: SiteMapMeta[SiteMap] =
    SiteMapMeta.default.about(_.setAsRoot)

  object FrontMatter:
    final type About = (
        layout: String,
        title: String,
        name: String,
        copyright: String,
        description: String,
        avatar: String,
        linkss: List[Links]
    )

  trait Extra

  type BaseType = FrontMatter.About

  def extras(using SiteContext): Extra = new {}

  def whoAmI(using Context): String = ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright

  override def layoutFor(
      doc: DocPage.View[BaseType]
  ): Option[LayoutOf[BaseType]] =
    if doc.frontMatter.layout == "home" then
      // also fields of objects aparently dont infer structural refinements,
      // so only resort is selectDynamic and cast, so no typesafe way to tie the knot yet.
      Some(
        metadata.layouts
          .selectDynamic("home")
          .asInstanceOf[LayoutOf[FrontMatter.About]]
      )
    else None

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
