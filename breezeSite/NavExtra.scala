package breezeSite

import breezeSite.Breeze.Context
import breezeSite.Breeze.DocCollection
import model.ctx

trait NavExtra(using Context) extends breeze.Breeze.Extra:

  override def nav: List[DocCollection] =
    List(ctx.site.about, ctx.site.articles, ctx.site.projects, ctx.site.talks)
