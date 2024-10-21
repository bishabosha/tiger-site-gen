package breeze

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import scala.util.Try
import scala.NamedTuple.NamedTuple

object utils:

  inline def reify[Ns <: Tuple, Vs <: Tuple](
      ls: NamedTuple[Ns, Vs]
  ): Map[String, Tuple.Union[Vs]] =
    val keys = compiletime.constValueTuple[Ns]
    val keysIt = keys.productIterator.asInstanceOf[Iterator[String]]
    val valsIt =
      ls.toTuple.productIterator.asInstanceOf[Iterator[Tuple.Union[Vs]]]
    Map.from(keysIt.zip(valsIt))

  enum Ordered:
    case ByDate(date: LocalDate)

  object Ordered:
    def read(s: String): Option[Ordered] = s match
      case s"date:$date" => io.util.md.readDate(date).map(ByDate(_))
      case _             => sys.error(s"Invalid Ordered: ${s.toList}")

    given Ordering[Ordered] with
      def compare(x: Ordered, y: Ordered): Int = (x, y) match
        case (ByDate(x), ByDate(y)) => y.compareTo(x) // reverse order for dates
