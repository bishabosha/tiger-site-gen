package home

final case class Link(href: String, text: String)

final case class NavLink(isActive: Boolean, link: Link)

final case class NavBar(brand: String, links: Seq[NavLink])
