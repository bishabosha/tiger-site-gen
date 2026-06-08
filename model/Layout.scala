package model

import scalatags.Text.all.ConcreteHtmlTag
import scalatags.Text.RawFrag

type Layout[C <: model.Context, D <: DocPage[?]] =
  D => C ?=> ConcreteHtmlTag[String] | RawFrag

object Layout:
  def apply[Ctx <: Context, Data](
      layout: Layout[Ctx, model.DocPage[Data]]
  ): layout.type = layout

class LayoutRef[Inner <: NamedTuple.AnyNamedTuple: {Record.Lookup as ref}](layouts: Record[Inner]):
  outer =>

  def lookup(name: String): Any =
    ref(name) match
      case i if i > 0 => layouts(i)
      case _          => throw Exception(s"Layout not found: `$name`")

  def apply[
      C <: model.Context,
      DC <: DocCollection[?, ?]
  ](
      name: String
  )(doc: DocPage[?])(using
      C,
      DC
  ): ConcreteHtmlTag[String] | RawFrag =
    val layout =
      try lookup(name).asInstanceOf[Layout[C, DocPage[?]]]
      catch
        case err =>
          throw new Exception(
            s"Layout not found: `$name` for doc ${summon[DC].collName}.${doc.name}"
          )
    layout(doc)

  // def &(additions: Layouts): this.type & additions.type = new Layouts {
  //   override def selectDynamic(name: String): Any =
  //     try additions.selectDynamic(name)
  //     catch case err => outer.selectDynamic(name)
  // }.asInstanceOf[this.type & additions.type]
