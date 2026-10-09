package model

/** An inline template invoked with {{name arguments}}. */
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
