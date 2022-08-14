package breezeSite

import model.ctx

import breeze.Breeze as parent

object Breeze extends model.Theme:

  val metadata = new {
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts & new {
      val about: Layout = breezeSite.about
    }
  }

  type Site = parent.Site & {
    val talks: Docs
    val videos: Docs
  }

  export parent.Extra
  def extras(using model.Context.InMakeCtx): Extra = breezeSite.Extra

  type FrontMatter = parent.FrontMatter
  export parent.whoAmI
