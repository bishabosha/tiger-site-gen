package model

import scalatags.Text.all.ConcreteHtmlTag

type Layout[D <: DocPage] = D => model.Context ?=> ConcreteHtmlTag[String]

class Layouts[D <: DocPage](data: Map[String, Layout[D]]):
  def apply(name: String)(using model.Context): Layout[D] = data(name)

object Layouts:
  def apply[D <: DocPage](elems: (String, Layout[D])*): Layouts[D] = new Layouts(elems.toMap)