package model

final case class Context(siteRoot: SiteRoot, site: model.md.Site):
  def whoAmI: String = site.about.frontMatter.name

inline def ctx(using ctx: Context): ctx.type = ctx