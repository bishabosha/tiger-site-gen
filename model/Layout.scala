package model

import scalatags.Text.all.ConcreteHtmlTag
import NamedTuple.{NamedTuple, AnyNamedTuple, Names, DropNames}

type Layout[C <: model.Context, D <: DocPage] =
  D => C ?=> ConcreteHtmlTag[String]

sealed trait Layouts extends Selectable:
  outer =>
  type Fields <: AnyNamedTuple

  def selectDynamic(name: String): Any

  final def apply[C <: model.Context, D <: DocPage, DC <: DocCollection[D]](
      name: String
  )(doc: D)(using
      C,
      DC
  ): ConcreteHtmlTag[String] =
    val layout =
      try selectDynamic(name).asInstanceOf[Layout[C, D]]
      catch
        case err =>
          throw new Exception(
            s"Layout not found: `$name` for doc ${summon[DC].collName}.${doc.name}"
          )
    layout(doc)

  def ++(additions: Layouts)(using
      Layouts.Disjoint[Fields, additions.Fields] =:= true
  ): Layouts {
    type Fields = NamedTuple.Concat[outer.Fields, additions.Fields]
  } = {
    val self = this.asInstanceOf[Reified[Names[Fields], DropNames[Fields]]]
    val other = additions.asInstanceOf[Reified[Names[
      additions.Fields
    ], DropNames[additions.Fields]]]
    Reified(self.record ++ other.record).asInstanceOf[
      Layouts {
        type Fields = NamedTuple.Concat[Fields, additions.Fields]
      }
    ]
  }

object Layouts:
  type Disjoint[X <: AnyNamedTuple, Y <: AnyNamedTuple] =
    Tuple.Disjoint[Names[X], Names[Y]]

  type Of[Ns <: Tuple, Vs <: Tuple] = Layouts {
    type Fields = NamedTuple[Ns, Vs]
  }

  class Reified[Ns <: Tuple, Vs <: Tuple](record: Map[String, Any])
      extends Layouts:
    type Fields = NamedTuple[Ns, Vs]
    def selectDynamic(name: String): Any =
      record(name)

  inline def apply[Ns <: Tuple, Vs <: Tuple](
      ls: NamedTuple[Ns, Vs]
  ): Layouts.Of[Ns, Vs] =
    Reified(utils.reify(ls))

// class Layouts extends Selectable:
//   outer =>

// type Fields <: AnyNamedTuple

// def selectDynamic(name: String): Any =
//   reflect.Selectable.reflectiveSelectable(this).selectDynamic(name)

// def apply[C <: model.Context, D <: DocPage, DC <: DocCollection[D]](
//     name: String
// )(doc: D)(using
//     C,
//     DC
// ): ConcreteHtmlTag[String] =
//   val layout =
//     try selectDynamic(name).asInstanceOf[Layout[C, D]]
//     catch
//       case err =>
//         throw new Exception(
//           s"Layout not found: `$name` for doc ${summon[DC].collName}.${doc.name}"
//         )
//   layout(doc)

// def &(additions: Layouts): this.type & additions.type = new Layouts {
//   override def selectDynamic(name: String): Any =
//     try additions.selectDynamic(name)
//     catch case err => outer.selectDynamic(name)
// }.asInstanceOf[this.type & additions.type]
