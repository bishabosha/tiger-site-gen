package model

import scala.NamedTuple.AnyNamedTuple

import steps.result.Result, Result.eval.{raise, ok}
import steps.result.Result.apply as result

class Record[T](
    val live: T,
    val raw: scalanotation.Expr
) extends Selectable {
  type Fields = NamedTuple.Map[NamedTuple.From[T], Record]

  override def toString(): String = raw.toString

  def apply(index: Int): Any = {
    val inner = live.asInstanceOf[Product].productElement(index)
    val expr =
      raw.asInstanceOf[scalanotation.Expr.NamedTupleExpr].elements(index).value
    Record(inner, expr)
  }

  inline def selectDynamic(name: String): Any =
    apply(
      scala.compiletime
        .constValue[Record.IndexOf[name.type, NamedTuple.Names[
          NamedTuple.From[T]
        ], 0]]
    )
}

object Record:
  type IsSubPrefix[This <: AnyNamedTuple, Prefix <: AnyNamedTuple] =
    model.Site.IsSubPrefix[This, Prefix]

  inline given [T <: AnyNamedTuple, Prefix <: AnyNamedTuple]
    => IsSubPrefix[NamedTuple.From[T], Prefix]
    => (
        vo: ValueOf[model.Site.PrefixLength[NamedTuple.Names[
          T
        ], NamedTuple.Names[Prefix], 0]]
  ) => DocPage.Conforms[Record[T], Record[Prefix]] {
    def toBase(doc: DocPage[Record[T]]): DocPage.View[Record[Prefix]] =
      val live = doc.frontMatter.live
        .asInstanceOf[Tuple]
        .toIArray
        .take(
          vo.value
        )
      val live0 = NamedTuple(Tuple.fromIArray(live)).asInstanceOf[Prefix]
      DocPage.View(doc.copy(frontMatter = Record(live0, doc.frontMatter.raw)))
  }

  type IndexOf[FieldName <: String, Names <: Tuple, Acc <: Int] <: Int =
    Names match
      case FieldName *: tail => Acc
      case _ *: tail         =>
        IndexOf[FieldName, tail, scala.compiletime.ops.int.S[Acc]]
      case EmptyTuple => -1

  inline given derivedAuto[T: deriving.Mirror.Of]
      : scalanotation.Reader[Record[T]] =
    summon[scalanotation.Reader[scalanotation.Expr]].mapResult({ raw =>
      given scalanotation.Configured[T] = scalanotation.Configured.skippable
      given scalanotation.Reader[T] = scalanotation.Reader.configured.derived[T]
      raw.decodeAs[T].map(live => Record(live, raw))
    })
