package model

import scalatags.Text.all.ConcreteHtmlTag

type Layout[C <: model.Context, D <: DocPage] = D => C ?=> ConcreteHtmlTag[String]

class Layouts extends reflect.Selectable:
  def apply[C <: model.Context, D <: DocPage](name: String)(doc: D)(using C): ConcreteHtmlTag[String] =
    selectDynamic(name).asInstanceOf[Layout[C, D]](doc)
