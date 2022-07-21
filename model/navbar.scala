package model

final case class Link(href: String, text: String)

final case class NavLink(isActive: Boolean, link: Link)

final case class Navbar(brand: String, links: Seq[NavLink])