package model

final class Context(val siteRoot: SiteRoot, val theme: model.Theme, val site: theme.Site)

object Context:
  def fromTheme[T <: Theme](theme: T)(using model.SiteRoot): Context =
    new Context(
      siteRoot = summon[model.SiteRoot],
      theme = theme,
      site = io.util.paths.buildSiteDb
    )

inline def ctx(using ctx: Context): ctx.type = ctx