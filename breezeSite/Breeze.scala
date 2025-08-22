package breezeSite

import model.ctx

import breeze.Breeze as parent

object Breeze extends model.Theme:

  val metadata = new:
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts & new:
      val about = breezeSite.about
      val talks = breezeSite.talks
      val projects = breezeSite.projects
      val project = breezeSite.project
      val raw = breezeSite.rawTemplate

  type Site = parent.Site & {
    val talks: Docs
    val videos: Docs
    val projects: Docs
    val `match-type-simulator`: Doc
  }

  override type Extra = parent.Extra & breezeSite.Extra
  override def extras(using
      Context,
      model.Context.InMakeCtx
  ): breezeSite.Extra = new {}

  export parent.{FrontMatter, whoAmI}
