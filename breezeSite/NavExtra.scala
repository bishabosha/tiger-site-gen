package breezeSite

import breezeSite.Breeze.SiteContext
import model.sctx
import model.AnyDocCollection

object NavExtra:

  def nav(using SiteContext): List[AnyDocCollection] =
    List(
      sctx.site.about,
      sctx.site.articles,
      sctx.site.projects,
      sctx.site.talks
    )
