package model

import scalatags.Text.all.doctype

type Template[D <: DocPage] = D => doctype

class Templates[D <: DocPage](data: Map[String, model.Context ?=> Template[D]]):
  def apply(name: String): model.Context ?=> Template[D] = data(name)

object Templates:
  def apply[D <: DocPage](elems: (String, model.Context ?=> Template[D])*): Templates[D] = new Templates(elems.toMap)