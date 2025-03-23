package model

class FrontMatter(data: Map[String, List[String]]) extends Selectable:

  lazy val isRoot: Boolean = data.contains("isRoot")
  lazy val isIndexOnly: Boolean =
    selectDynamic("isIndexOnly").asInstanceOf[Boolean]
  lazy val layout: String =
    data.get("layout").flatMap(_.headOption).getOrElse("")

  def selectDynamic(name: String): Any = name match
    case s"is$_" =>
      data
        .get(name)
        .flatMap(ls =>
          if ls.isEmpty then Some(true) else ls.head.toBooleanOption
        )
        .getOrElse(false)
    case s"${_}s" => data.get(name).getOrElse(Nil)
    case _        => data.get(name).flatMap(_.headOption).getOrElse("")

  override def toString(): String = data.toString
