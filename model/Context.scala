package model

import Context.InMakeCtx

final class Context(
    val siteRoot: SiteRoot,
    val site: model.Site,
    val theme: Theme
):
  val extra: Any =
    theme.extras(using this.asInstanceOf[theme.Context], InMakeCtx)

object Context:
  opaque type InMakeCtx = Unit
  private[Context] def InMakeCtx: InMakeCtx = ()

  def fromTheme[T <: Theme](src: os.Path, theme: T)(using
      model.SiteRoot
  ): theme.Context =
    new Context(
      siteRoot = summon[model.SiteRoot],
      site = io.util.paths.buildSiteDb(src),
      theme = theme
    ).asInstanceOf[theme.Context]

inline def ctx(using ctx: Context): ctx.type = ctx
