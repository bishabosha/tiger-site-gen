package model

import NamedTuple.{AnyNamedTuple, NamedTuple}
import scala.NamedTuple.Names

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

class TemplateFunctions[T <: AnyNamedTuple] private[model] (
    private val functions: Record[T]
)(using lookup: Record.Lookup[T])
    extends Selectable:
  type Fields = T

  inline def selectDynamic(name: String): Any =
    functions.selectDynamic(name)

  private def split(expr: String): (String, String) =
    expr.span(!_.isWhitespace) match
      case (name, args) => (name, args.trim)

  private def templateFunction(name: String, expr: String): TemplateFunction =
    try functions(lookup(name)).asInstanceOf[TemplateFunction]
    catch
      case err =>
        throw new Exception(s"Template function not found: `{{${expr}}}`", err)

  def apply(expr: String)(using Context): String =
    val (name, args) = split(expr)
    templateFunction(name, expr).render(args)

  def renderDefault(expr: String): String =
    val (name, args) = split(expr)
    templateFunction(name, expr).renderDefault(args)

  inline def ++[Additions <: AnyNamedTuple](
      additions: TemplateFunctions[Additions]
  )(using
      Tuple.Disjoint[Names[T], Names[Additions]] =:= true
  ): TemplateFunctions[NamedTuple.Concat[T, Additions]] =
    given Record.Lookup[NamedTuple.Concat[T, Additions]] =
      Record.Lookup.derived
    TemplateFunctions.fromRecord(functions ++ additions.functions)

object TemplateFunctions:
  type IsAll[T] = [U <: Tuple] =>> Tuple.Union[U] <:< T

  type &++[X <: AnyNamedTuple, Y <: AnyNamedTuple] =
    SiteMapSchema.&++[X, Y]

  inline def apply[N <: Tuple, V <: Tuple: IsAll[
    TemplateFunction
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
    => Site.IsSubPrefix[C, P]
      => Context.Views.Conforms[TemplateFunctions[C], TemplateFunctions[P]]()
