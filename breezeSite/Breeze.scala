package breezeSite

import model.ctx

import breeze.Breeze as parent

object Breeze extends model.Theme:

  val metadata = new:
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts & new:
      val about: Layout = breezeSite.about
      val talks: Layout = breezeSite.talks

  type Site = parent.Site & {
    val talks: Docs
    // val meetups: Docs
    val videos: Docs
  }

  export parent.Extra
  def extras(using Context, model.Context.InMakeCtx): Extra =
    new breezeSite.Extra {}

  type FrontMatter = parent.FrontMatter
  export parent.whoAmI
