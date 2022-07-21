package model

final case class Context(siteRoot: SiteRoot, about: About):
  def whoAmI: String = about.me.frontMatter.name

final case class About(me: md.Doc)