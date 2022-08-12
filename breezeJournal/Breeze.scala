package breezeJournal

import model.ctx

import breeze.Breeze as parent

object Breeze extends model.Theme:

  val metadata = new {
    val name = parent.metadata.name
    val layouts = parent.metadata.layouts & new {
      val about: Layout = breezeJournal.about
    }
  }

  type FrontMatter = parent.FrontMatter
  export parent.{whoAmI, Site}
