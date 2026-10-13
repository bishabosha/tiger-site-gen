(
  name = "Scala Days · monthly spending",
  cells = Vector(
    (id = "intro", kind = (Text = null), source = "What do I spend each month?\nSynthetic transactions → typed projection → category filter → monthly totals → chart.\nRun a cell with Cmd/Ctrl+Enter. Click a value to inspect its inferred type and table.", managedBy = null, widget = null, registeredUnder = null),
    (id = "setup", kind = (Code = null), source = "import java.time.{LocalDate, YearMonth}\nimport ntdataframe.DataFrame\nimport ntdataframe.DataFrame.{col, fun, group, sum, map}\nimport notebook.kernel.Widgets", managedBy = null, widget = null, registeredUnder = null),
    (id = "data", kind = (Code = null), source = "case class Tx(date: LocalDate, category: String, amount: BigDecimal)\ndef tx(date: String, category: String, amount: String): Tx =\n  Tx(LocalDate.parse(date), category, BigDecimal(amount))\n\nval transactions = Vector(\n  tx(\"2026-01-03\", \"Food\", \"12.50\"),\n  tx(\"2026-01-08\", \"Travel\", \"31.00\"),\n  tx(\"2026-01-15\", \"Food\", \"7.25\"),\n  tx(\"2026-01-20\", \"Rent\", \"900.00\"),\n  tx(\"2026-02-01\", \"Food\", \"20.00\"),\n  tx(\"2026-02-09\", \"Travel\", \"64.30\"),\n  tx(\"2026-02-14\", \"Rent\", \"900.00\"),\n  tx(\"2026-03-04\", \"Food\", \"15.75\"),\n  tx(\"2026-03-11\", \"Travel\", \"8.90\"),\n  tx(\"2026-03-18\", \"Rent\", \"900.00\"),\n  tx(\"2026-03-29\", \"Food\", \"22.10\")\n)\nval frame = DataFrame.from(transactions)\nframe", managedBy = null, widget = null, registeredUnder = null),
    (id = "projection", kind = (Code = null), source = "val spending = frame.select((\n  month = col.date.map(YearMonth.from),\n  category = col.category,\n  amount = col.amount\n))\nspending", managedBy = null, widget = null, registeredUnder = null),
    (id = "controls", kind = (Code = null), source = "Widgets.select(\n  \"category\", Seq(\"All\", \"Food\", \"Travel\", \"Rent\"),\n  default = \"All\"\n)", managedBy = null, widget = null, registeredUnder = null),
    (id = "filtered", kind = (Code = null), source = "val chosen = spending.filter(\n  fun((c: String) =>\n    category == \"All\" || c == category\n  )(col.category)\n)\nchosen", managedBy = null, widget = null, registeredUnder = null),
    (id = "monthly", kind = (Code = null), source = "val monthly = chosen\n  .groupBy(col.month, col.category)\n  .agg(group.key ++ (total = sum(col.amount)))\nmonthly", managedBy = null, widget = null, registeredUnder = null),
    (id = "chart", kind = (Code = null), source = "val chartData = monthly.select((\n  month = col.month.map(_.toString),\n  category = col.category,\n  total = col.total\n))\nval chart = chartData.plot\n  .titled(\"Monthly spending\").sized(400, 240)\nchart.bar(\n  x = col.month, y = col.total,\n  series = col.category\n)", managedBy = null, widget = null, registeredUnder = null),
    (id = "schema", kind = (Code = null), source = "val projected: DataFrame[(\n  month: YearMonth,\n  category: String,\n  amount: BigDecimal\n)] = spending\n\nval grouped: DataFrame[(\n  month: YearMonth,\n  category: String,\n  total: BigDecimal\n)] = monthly\ngrouped", managedBy = null, widget = null, registeredUnder = null)
  ),
  edges = Vector(),
  layouts = (
    notebook = Vector("intro", "setup", "data", "projection", "controls", "filtered", "monthly", "chart", "schema"),
    graph = Vector(
      (id = "intro", x = 40.0, y = 40.0),
      (id = "setup", x = 360.0, y = 40.0),
      (id = "data", x = 680.0, y = 40.0),
      (id = "projection", x = 40.0, y = 240.0),
      (id = "controls", x = 360.0, y = 240.0),
      (id = "filtered", x = 680.0, y = 240.0),
      (id = "monthly", x = 40.0, y = 440.0),
      (id = "chart", x = 360.0, y = 440.0),
      (id = "schema", x = 680.0, y = 440.0)
    )
  )
)
