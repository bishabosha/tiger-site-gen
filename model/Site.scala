package model

final class Site private (val optStatic: Option[os.Path], val optFavicon: Option[os.Path], data: Map[String, Docs[?] | Doc[?]]) extends Selectable:
  def selectDynamic(name: String): Docs[?] | Doc[?] = data(name)
  def allDocs: Iterable[DocCollection[?]] = data.values

object Site:
  def read[S <: Site](optStatic: Option[os.Path], optFavicon: Option[os.Path], data: Map[String, Doc[?] | Docs[?]]): S =
    Site(optStatic, optFavicon, data).asInstanceOf[S]
