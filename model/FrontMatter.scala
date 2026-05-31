package model

class Dictionary(
    data: Map[String, Boolean | String | List[String] | List[List[String]]]
) extends Selectable {

  override def toString(): String = data.toString

  def selectDynamic(name: String): Any = name match
    case s"is$_" =>
      data
        .get(name)
        .flatMap(ls =>
          ls match
            case true  => Some(true)
            case false => Some(false)
            case _     => None
        )
        .getOrElse(false)
    case s"${_}ss" =>
      data
        .get(name)
        .collect({
          case ls: List[?] if ls.forall(_.isInstanceOf[List[?]]) =>
            ls
        })
        .getOrElse(Nil)
    case s"${_}s" =>
      data
        .get(name)
        .collect({
          case ls: List[?] if ls.forall(_.isInstanceOf[String]) =>
            ls
        })
        .getOrElse(Nil)
    case _ =>
      data
        .get(name)
        .collect({ case s: String =>
          s
        })
        .getOrElse("")
}
