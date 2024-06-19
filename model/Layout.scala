package model

import scalatags.Text.all.ConcreteHtmlTag

type Layout[C <: model.Context, D <: DocPage] =
  D => C ?=> ConcreteHtmlTag[String]

class Layouts extends Selectable:
  outer =>

  def selectDynamic(name: String): Any =
    reflect.Selectable.reflectiveSelectable(this).selectDynamic(name)

  def apply[C <: model.Context, D <: DocPage](name: String)(doc: D)(using
      C
  ): ConcreteHtmlTag[String] =
    val layout =
      try selectDynamic(name).asInstanceOf[Layout[C, D]]
      catch
        case err =>
          throw new Exception(s"Layout not found: `$name` for doc $doc")
    layout(doc)

  def &(additions: Layouts): this.type & additions.type = new Layouts {
    override def selectDynamic(name: String): Any =
      try additions.selectDynamic(name)
      catch case err => outer.selectDynamic(name)
  }.asInstanceOf[this.type & additions.type]
