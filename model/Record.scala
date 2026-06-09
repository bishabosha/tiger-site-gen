package model

import scala.NamedTuple.NamedTuple
import scala.NamedTuple.AnyNamedTuple
import scala.NamedTuple.DropNames
import scala.NamedTuple.Names

import steps.result.Result, Result.eval.{raise, ok}
import steps.result.Result.apply as result
import scala.annotation.publicInBinary

class Record[T <: AnyNamedTuple](
    private[model] val live: T
) extends Selectable {
  type Fields = T

  override def toString(): String = live.toString

  def apply(index: Int): Any = {
    live.asInstanceOf[Product].productElement(index)
  }

  def ++[Other <: AnyNamedTuple](other: Other)(using
      ev: Tuple.Disjoint[Names[T], Names[Other]] =:= true
  ): Record[NamedTuple.Concat[T, Other]] =
    type T0 = NamedTuple[Names[T], DropNames[T]]
    type Other0 = NamedTuple[Names[Other], DropNames[Other]]
    val live0: T0 = live.asInstanceOf[T0]
    val other0: Other0 = other.asInstanceOf[Other0]
    Record(live0 ++ other0)

  def ++[Other <: AnyNamedTuple](other: Record[Other])(using
      ev: Tuple.Disjoint[Names[T], Names[Other]] =:= true
  ): Record[NamedTuple.Concat[T, Other]] =
    this ++ other.live

  inline def selectDynamic(name: String): Any =
    apply(
      scala.compiletime
        .constValue[Record.IndexOf[name.type, NamedTuple.Names[T], 0]]
    )
}

object Record:
  trait Lookup[T <: AnyNamedTuple] extends Selectable:
    type Fields <: NamedTuple.Map[T, [_] =>> Int]
    def apply(name: String): Int
    def selectDynamic(name: String): Int = apply(name)

  object Lookup:
    @publicInBinary
    private[Lookup] def fromNames[T <: AnyNamedTuple](names: Names[T]): Lookup[T] =
      val fieldsIt = names.productIterator.asInstanceOf[Iterator[String]]
      new LookupImpl[T](fieldsIt.zipWithIndex.toMap)
    private class LookupImpl[T <: AnyNamedTuple](val fields: Map[String, Int]) extends Lookup[T]:
      type Fields = NamedTuple.Map[T, [_] =>> Int]
      def apply(name: String): Int = fields(name)

    object auto:
      inline given autoderived[T <: AnyNamedTuple]: Lookup[T] =
        derived[T]

    inline def derived[T <: AnyNamedTuple]: Lookup[T] =
      fromNames[T](compiletime.constValueTuple[NamedTuple.Names[T]])

  type ++[X <: AnyNamedTuple, Y <: AnyNamedTuple] <: AnyNamedTuple =
    Tuple.Disjoint[Names[X], Names[Y]] match
      case true  => NamedTuple.Concat[X, Y]
      case false => AnyNamedTuple

  type IsSubPrefix[This <: AnyNamedTuple, Prefix <: AnyNamedTuple] =
    CompatiblePrefix[This, Prefix] =:= Prefix

  type CompatiblePrefix[This <: AnyNamedTuple, Prefix <: AnyNamedTuple] =
    NamedTuple.Take[This, PrefixLength[Names[This], Names[Prefix], 0]]

  type PrefixLength[T <: Tuple, U <: Tuple, Acc <: Int] <: Int = (T, U) match
    case (t *: ts, u *: us) =>
      compiletime.ops.any.==[t, u] match
        case true  => PrefixLength[ts, us, compiletime.ops.int.S[Acc]]
        case false => Acc
    case _ => Acc

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
