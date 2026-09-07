package model

import steps.result.Result, Result.eval.{raise, ok}
import steps.result.Result.apply as result

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

object Dictionary:
  import scalanotation.Expr as e
  import scalanotation.DecodeError

  given [D <: Dictionary]: scalanotation.Reader[D] =
    UniversalDictionaryReader.asInstanceOf[scalanotation.Reader[D]]

  val UniversalDictionaryReader: scalanotation.Reader[Dictionary] = summon[
    scalanotation.Reader[scalanotation.Expr]
  ].mapResult({
    case m: e.NamedTupleExpr =>
      def exprAsString(innerpath: String)(
          x: scalanotation.Expr
      ): Result[String, DecodeError] = result:
        x match
          case e.StringConstant(value)                                => value
          case e.BooleanConstant(value)                               => value.toString()
          case e.IntConstant(value)                                   => value.toString()
          case e.LongConstant(value)                                  => value.toString()
          case e.FloatConstant(value)                                 => value.toString()
          case e.DoubleConstant(value)                                => value.toString()
          case e.CharConstant(value)                                  => value.toString()
          case e.NullConstant                                         => ""
          case _: e.NamedTupleExpr | _: e.VectorExpr | _: e.TupleExpr =>
            raise(
              DecodeError.Custom(
                s"at path $innerpath, expected scalar, got ${x.render}"
              )
            )

      result:
        model.Dictionary(m.elements.map { case (name = k, value = vs) =>
          if k.startsWith("is") then
            k -> (vs.match {
              case e.BooleanConstant(bool) => bool
              case _                       =>
                raise(
                  DecodeError.Custom(s" at path .$k, expected boolean, got $vs")
                )
            }: Boolean)
          else if k.endsWith("ss") then
            k -> (vs.match {
              case vs1: e.VectorExpr =>
                vs1.elements.zipWithIndex.toList.map({
                  case (vss1: e.VectorExpr, index) =>
                    vss1.elements.zipWithIndex.toList.map({ case (e, index2) =>
                      exprAsString(s".$k[$index][$index2]")(e).ok
                    })
                  case (_, index) =>
                    raise(
                      DecodeError.Custom(
                        s" at path .$k[$index], expected vector, got ${vs.render}"
                      )
                    )
                })
              case _ =>
                raise(
                  DecodeError.Custom(
                    s" at path .$k, expected vector, got ${vs.render}"
                  )
                )
            }: List[List[String]])
          else if k.endsWith("s") then
            k -> (vs.match {
              case vs1: e.VectorExpr =>
                vs1.elements.zipWithIndex.toList.map({ case (e, index) =>
                  exprAsString(s".$k[$index]")(e).ok
                })
              case _ =>
                raise(
                  DecodeError.Custom(
                    s" at path .$k, expected vector, got ${vs.render}"
                  )
                )
            }: List[String])
          else k -> exprAsString(s".$k")(vs).ok
        }.toMap)
    case data =>
      Result.Err(DecodeError.Custom(s" Invalid front matter ${data.render}"))
  })
