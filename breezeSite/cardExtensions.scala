package breezeSite

import breezeSite.Breeze.*
import breeze.cards

object cardExtensions:

  def projects(title: String, docs: Docs) =
    cards.links(title, "projects", docs)
