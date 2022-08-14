package model

final class Context(val siteRoot: SiteRoot, val site: model.Site, val extra: Any)

object Context:
  opaque type InMakeCtx = Unit

  def fromTheme[T <: Theme](src: os.Path, theme: T)(using model.SiteRoot): theme.Context =
    new Context(
      siteRoot = summon[model.SiteRoot],
      site = io.util.paths.buildSiteDb(src),
      extra = theme.extras(using ())
    ).asInstanceOf[theme.Context]

inline def ctx(using ctx: Context): ctx.type = ctx
