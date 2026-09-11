package model

import NamedTuple.{AnyNamedTuple, NamedTuple}
import scala.NamedTuple.Names

class TemplateFunctions[T <: AnyNamedTuple] private[model] (
    private val functions: Record[T]
)(using lookup: Record.Lookup[T])
    extends Selectable:
  type Fields = T

  inline def selectDynamic(name: String): Any =
    functions.selectDynamic(name)

  private[model] def get(name: String): Option[TemplateFunction | BlockTemplateFunction] =
    val index = try Some(lookup(name))
      catch case _: NoSuchElementException => None
    index.map(i => functions(i).asInstanceOf[TemplateFunction | BlockTemplateFunction])

  private def split(expr: String): (String, String) =
    expr.span(!_.isWhitespace) match
      case (name, args) => (name, args.trim)

  def apply(expr: String)(using Context): String =
    val (name, args) = split(expr)
    TemplateFunctions.inlineFunction(expr, get(name)).render(args)

  def renderDefault(expr: String): String =
    val (name, args) = split(expr)
    TemplateFunctions.inlineFunction(expr, get(name)).renderDefault(args)

  def apply(expr: String, body: TemplateBody)(using Context): String =
    val (name, args) = split(expr)
    TemplateFunctions.blockFunction(expr, get(name)).render(args, body)

  def renderDefault(expr: String, body: TemplateBody): String =
    val (name, args) = split(expr)
    TemplateFunctions.blockFunction(expr, get(name)).renderDefault(args, body)

  inline def ++[Additions <: AnyNamedTuple](
      additions: TemplateFunctions[Additions]
  )(using
      Tuple.Disjoint[Names[T], Names[Additions]] =:= true
  ): TemplateFunctions[NamedTuple.Concat[T, Additions]] =
    given Record.Lookup[NamedTuple.Concat[T, Additions]] =
      Record.Lookup.derived
    TemplateFunctions.fromRecord(functions ++ additions.functions)

object TemplateFunctions:
  /** Check the selected entry after lookup, preserving local-first name shadowing. */
  private[model] def inlineFunction(
      expression: String, entry: Option[TemplateFunction | BlockTemplateFunction]
  ): TemplateFunction = entry match
    case Some(function: TemplateFunction) => function
    case Some(_: BlockTemplateFunction) =>
      throw new IllegalArgumentException(s"Block template used inline: {{$expression}}; use :::$expression with a body and closing :::")
    case None =>
      throw new IllegalArgumentException(s"Template function not found: `{{$expression}}`")

  private[model] def blockFunction(
      expression: String, entry: Option[TemplateFunction | BlockTemplateFunction]
  ): BlockTemplateFunction = entry match
    case Some(function: BlockTemplateFunction) => function
    case Some(_: TemplateFunction) =>
      throw new IllegalArgumentException(s"Inline template used as a block: :::$expression; use {{$expression}}")
    case None =>
      throw new IllegalArgumentException(s"Block template not found: :::$expression")

  type IsAll[T] = [U <: Tuple] =>> Tuple.Union[U] <:< T

  inline def apply[N <: Tuple, V <: Tuple: IsAll[
    TemplateFunction | BlockTemplateFunction
  ]](
      functions: NamedTuple[N, V]
  ): TemplateFunctions[NamedTuple[N, V]] =
    given Record.Lookup[NamedTuple[N, V]] = Record.Lookup.derived
    fromRecord(Record(functions))

  private[model] def fromRecord[T <: AnyNamedTuple](
      functions: Record[T]
  )(using Record.Lookup[T]): TemplateFunctions[T] =
    new TemplateFunctions(functions)

  val Empty: TemplateFunctions[NamedTuple.Empty] =
    TemplateFunctions(NamedTuple.Empty)

  given [C <: AnyNamedTuple, P <: AnyNamedTuple]
    => Record.IsSubPrefix[C, P]
      => Context.Views.Conforms[TemplateFunctions[C], TemplateFunctions[P]]()
