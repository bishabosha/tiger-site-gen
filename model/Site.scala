package model

final class Site private (data: Map[String, Docs[?] | Doc]) extends Selectable:
  def selectDynamic(name: String): Docs[?] | Doc = data(name)

object Site:
  def read[S <: Site](data: Map[String, Doc | Docs[?]]): S = Site(data).asInstanceOf[S]

class Docs[D <: Doc](data: IndexedSeq[D]):
  export data.{apply, size, zipWithIndex, map, take}