package model

/** A block template invoked with :::name arguments, a Markdown body and closing :::. */
trait BlockTemplateFunction:
  /** Optional editor support for fenced DSLs in this block. Paths are site-root relative. */
  def editor: Seq[FencedGrammar] = Seq.empty
  def render(args: String, body: TemplateBody)(using Context): String
  def renderDefault(args: String, body: TemplateBody): String

object BlockTemplateFunction:
  // Keep the original factory signature for already compiled themes.
  def apply(
      renderFn: Context ?=> (String, TemplateBody) => String,
      defaultFn: (String, TemplateBody) => String
  ): BlockTemplateFunction = apply(renderFn, defaultFn, Seq.empty)

  def apply(
      renderFn: Context ?=> (String, TemplateBody) => String,
      defaultFn: (String, TemplateBody) => String,
      editor: Seq[FencedGrammar]
  ): BlockTemplateFunction =
    val grammars = editor
    new:
      override val editor: Seq[FencedGrammar] = grammars
      def render(args: String, body: TemplateBody)(using ctx: Context): String =
        renderFn(using ctx)(args, body)
      def renderDefault(args: String, body: TemplateBody): String = defaultFn(args, body)
