package model

import scala.collection.mutable

class FrontMatter(data: mutable.LinkedHashMap[String, List[String]]) extends Selectable:

  lazy val isRoot: Boolean = data.contains("isRoot")
  lazy val layout: String = data.get("layout").flatMap(_.headOption).getOrElse("")

  def selectDynamic(name: String): Any = name match
    case s"is$_" => data.contains(name)
    case s"${_}s" => data.get(name).getOrElse(Nil)
    case _ => data.get(name).flatMap(_.headOption).getOrElse("")

  override def toString(): String = data.toString