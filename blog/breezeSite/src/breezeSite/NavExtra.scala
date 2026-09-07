package breezeSite

import breezeSite.Breeze.SiteContext
import model.sctx
import model.ContentNode

object NavExtra:

  def nav(using SiteContext): List[ContentNode] =
    List(
      sctx.site.about,
      sctx.site.articles,
      sctx.site.projects,
      sctx.site.talks
    )
