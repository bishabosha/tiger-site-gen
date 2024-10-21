package breezeSite

import model.ctx
import model.Layouts

import breeze.Breeze as parent

object Breeze extends model.Theme:

  val metadata = new:
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts ++ Layouts(
      about = breezeSite.about,
      talks = breezeSite.talks,
      projects = breezeSite.projects,
      project = breezeSite.project
    )

  type Site = parent.Site & {
    val talks: Docs
    val videos: Docs
    val projects: Docs
  }

  override type Extra = parent.Extra & breezeSite.Extra
  override def extras(using
      Context,
      model.Context.InMakeCtx
  ): breezeSite.Extra = new {}

  export parent.{FrontMatter, whoAmI}
