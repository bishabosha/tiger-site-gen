package model

trait TemplateFunction:
  def render(args: String)(using Context): String
  def renderDefault(args: String): String

object TemplateFunction:
  def apply(
      renderFn: Context ?=> String => String,
      defaultFn: String => String
  ): TemplateFunction = new:
    def render(args: String)(using ctx: Context): String =
      renderFn(using ctx)(args)
    def renderDefault(args: String): String = defaultFn(args)

class TemplateFunctions extends Selectable:
  outer =>

  def selectDynamic(name: String): TemplateFunction =
    reflect.Selectable
      .reflectiveSelectable(this)
      .selectDynamic(name)
      .asInstanceOf[TemplateFunction]

  private def split(expr: String): (String, String) =
    expr.span(!_.isWhitespace) match
      case (name, args) => (name, args.trim)

  private def templateFunction(name: String, expr: String): TemplateFunction =
    try selectDynamic(name)
    catch
      case err =>
        throw new Exception(s"Template function not found: `{{${expr}}}`", err)

  def apply(expr: String)(using Context): String =
    val (name, args) = split(expr)
    templateFunction(name, expr).render(args)

  def renderDefault(expr: String): String =
    val (name, args) = split(expr)
    templateFunction(name, expr).renderDefault(args)

  def &(additions: TemplateFunctions): this.type & additions.type =
    new TemplateFunctions:
      override def selectDynamic(name: String): TemplateFunction =
        try additions.selectDynamic(name)
        catch case err => outer.selectDynamic(name)
    .asInstanceOf[this.type & additions.type]

object TemplateFunctions:
  val Empty: TemplateFunctions = new TemplateFunctions()
