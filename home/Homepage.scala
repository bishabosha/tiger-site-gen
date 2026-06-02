package home

import model.Theme
import model.ctx
import model.Context.InMakeCtx
import model.SiteMapSchema.auto.given

val m = Homepage.siteMap

object Homepage extends Theme:
  val metadata = new:
    val name = "Homepage"
    val layouts = new:
      val home = homeLayout

  type SiteMap = (about: DocOf[FrontMatter.About])

  object FrontMatter:
    final type About = BuiltinFrontMatter {
      val avatar: String
      val linkss: List[List[String]]
      val name: String
      val copyright: String
    }

  trait Extra

  def extras(using Context, InMakeCtx): Extra = new {}

  def whoAmI(using Context): String = ctx.site.about.index.frontMatter.name
  def copyright(using Context): String =
    ctx.site.about.index.frontMatter.copyright
