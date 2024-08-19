package breeze

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import scala.util.Try

object utils:
  // local date parser for 08-06-2024
  private val datePattern = DateTimeFormatter.ofPattern("dd-MM-yyyy")

  enum Ordered:
    case ByDate(date: LocalDate)

  object Ordered:
    def read(s: String): Option[Ordered] = s match
      case s"date:$date" =>
        Try(LocalDate.parse(date, datePattern)).toOption.map(ByDate(_))
      case _ => sys.error(s"Invalid Ordered: ${s.toList}")

    given Ordering[Ordered] with
      def compare(x: Ordered, y: Ordered): Int = (x, y) match
        case (ByDate(x), ByDate(y)) => y.compareTo(x) // reverse order for dates
