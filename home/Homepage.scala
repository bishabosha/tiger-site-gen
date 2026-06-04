package home

import model.ctx
import model.Context.InMakeCtx
import model.SiteMapSchema.auto.given
import model.SiteMapMeta

val m = Homepage.siteMap

object Homepage extends model.DictionaryTheme:
  val metadata = new:
    val name = "Homepage"
    val layouts = new:
      val home = homeLayout

  type SiteMap = (about: DocOf[FrontMatter.About])

  override val siteMapMeta: SiteMapMeta[SiteMap] =
    SiteMapMeta.default.about(_.setAsRoot)

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
