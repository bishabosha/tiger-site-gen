package model

import scala.NamedTuple.AnyNamedTuple

import steps.result.Result, Result.eval.{raise, ok}
import steps.result.Result.apply as result

class Record[T <: AnyNamedTuple](
    live: T
) extends Selectable {
  type Fields = T

  override def toString(): String = live.toString

  def apply(index: Int): Any = {
    live.asInstanceOf[Product].productElement(index)
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
    => IsSubPrefix[NamedTuple.From[T], Prefix] => DocPage.Conforms[Record[T], Record[Prefix]] {
    def toBase(doc: DocPage[Record[T]]): DocPage.View[Record[Prefix]] =
      DocPage.View(doc.asInstanceOf[DocPage[Record[Prefix]]])
  }

  type IndexOf[FieldName <: String, Names <: Tuple, Acc <: Int] <: Int =
    Names match
      case FieldName *: tail => Acc
      case _ *: tail         =>
        IndexOf[FieldName, tail, scala.compiletime.ops.int.S[Acc]]
      case EmptyTuple => -1

  inline given derivedAuto[T <: AnyNamedTuple: deriving.Mirror.Of]
      : scalanotation.Reader[Record[T]] =
    given scalanotation.Configured[T] = scalanotation.Configured.skippable
    scalanotation.Reader.configured.derived[T].map(Record(_))
