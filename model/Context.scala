package model

final class Context(val siteRoot: SiteRoot, val site: model.Site)

object Context:
  def fromTheme[T <: Theme](src: os.Path, theme: T)(using model.SiteRoot): theme.Context =
    new Context(
      siteRoot = summon[model.SiteRoot],
      site = io.util.paths.buildSiteDb(src)
    ).asInstanceOf[theme.Context]

inline def ctx(using ctx: Context): ctx.type = ctx
