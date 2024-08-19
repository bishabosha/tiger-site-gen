package breeze

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import scala.util.Try

object utils:

  enum Ordered:
    case ByDate(date: LocalDate)

  object Ordered:
    def read(s: String): Option[Ordered] = s match
      case s"date:$date" => io.util.md.readDate(date).map(ByDate(_))
      case _             => sys.error(s"Invalid Ordered: ${s.toList}")

    given Ordering[Ordered] with
      def compare(x: Ordered, y: Ordered): Int = (x, y) match
        case (ByDate(x), ByDate(y)) => y.compareTo(x) // reverse order for dates
