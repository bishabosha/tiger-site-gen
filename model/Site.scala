package model

final class Site private (
    val optStatic: Option[os.Path],
    val optFavicon: Option[os.Path],
    data: Map[String, DocCollection[?, ?]]
) extends Selectable:
  def selectDynamic(name: String): DocCollection[?, ?] = data(name)
  def allDocs: Iterable[DocCollection[?, ?]] = data.values

object Site:
  def read[S <: Site](
      optStatic: Option[os.Path],
      optFavicon: Option[os.Path],
      data: Map[String, DocCollection[?, ?]]
  ): S =
    Site(optStatic, optFavicon, data).asInstanceOf[S]
