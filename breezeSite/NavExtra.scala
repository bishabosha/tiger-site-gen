package breezeSite

import breezeSite.Breeze.SiteContext
import model.sctx
import model.AnyDocCollection

trait NavExtra(using SiteContext) extends breeze.Breeze.Extra:

  override def nav: List[AnyDocCollection] =
    List(
      sctx.site.about,
      sctx.site.articles,
      sctx.site.projects,
      sctx.site.talks
    )
