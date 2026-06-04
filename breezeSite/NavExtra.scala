package breezeSite

import breezeSite.Breeze.Context
import model.ctx
import model.AnyDocCollection

trait NavExtra(using Context) extends breeze.Breeze.Extra:

  override def nav: List[AnyDocCollection] =
    List(ctx.site.about, ctx.site.articles, ctx.site.projects, ctx.site.talks)
