package model

import scalatags.Text.all.ConcreteHtmlTag

type Layout[C <: model.Context, D <: DocPage] = D => C ?=> ConcreteHtmlTag[String]

class Layouts[C <: model.Context, D <: DocPage](data: Map[String, Layout[C, D]]):
  def apply(name: String)(doc: D)(using C): ConcreteHtmlTag[String] = data(name)(doc)

object Layouts:
  def apply[C <: model.Context, D <: DocPage](elems: (String, Layout[C, D])*): Layouts[C, D] = new Layouts(elems.toMap)