package model

/** A block template invoked with :::name arguments, a Markdown body and closing :::. */
trait BlockTemplateFunction:
  def render(args: String, body: TemplateBody)(using Context): String
  def renderDefault(args: String, body: TemplateBody): String

object BlockTemplateFunction:
  def apply(
      renderFn: Context ?=> (String, TemplateBody) => String,
      defaultFn: (String, TemplateBody) => String
  ): BlockTemplateFunction = new:
    def render(args: String, body: TemplateBody)(using ctx: Context): String =
      renderFn(using ctx)(args, body)
    def renderDefault(args: String, body: TemplateBody): String = defaultFn(args, body)
