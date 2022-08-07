package model

final class Site private (data: Map[String, Docs[?] | Doc]) extends Selectable:
  def selectDynamic(name: String): Docs[?] | Doc = data(name)

object Site:
  def read[S <: Site](data: Map[String, Doc | Docs[?]]): S = Site(data).asInstanceOf[S]