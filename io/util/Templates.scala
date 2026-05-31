package io.util

import model.Context
import model.ctx
import java.time.Instant
import scala.collection.mutable

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

  def selectDynamic(name: String): Any =
    reflect.Selectable.reflectiveSelectable(this).selectDynamic(name)

  private def split(expr: String): (String, String) =
    expr.span(!_.isWhitespace) match
      case (name, args) => (name, args.trim)

  private def templateFunction(name: String, expr: String): TemplateFunction =
    try selectDynamic(name).asInstanceOf[TemplateFunction]
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
      override def selectDynamic(name: String): Any =
        try additions.selectDynamic(name)
        catch case err => outer.selectDynamic(name)
    .asInstanceOf[this.type & additions.type]

object Templates:
  // Thread-local collector to accumulate dependencies during a single page render
  private val depCollector = new java.lang.ThreadLocal[mutable.Set[String]]()

  def withDependencyCollection[A](body: => A)(using Context): (A, Set[String]) =
    val set = mutable.Set.empty[String]
    depCollector.set(set)
    try
      val res = body
      (res, set.toSet)
    finally depCollector.remove()

  private def add(path: os.Path): Unit =
    val current = depCollector.get()
    if current != null then
      // Use absolute path strings to avoid needing contextual givens here
      current += path.toString

  // Single path dependency
  def recordDependency(path: os.Path): Unit = add(path)

  // Multiple path dependency
  def recordMultiDependency(paths: Iterable[os.Path]): Unit =
    val current = depCollector.get()
    if current != null then paths.foreach(p => current += p.toString)

  private def interpolateWith(template: String, f: String => String): String =
    val regex = """\{\{([^}]+)\}\}""".r
    var index = 0
    val buf = StringBuilder()
    regex
      .findAllMatchIn(template)
      .foreach { m =>
        buf ++= template.substring(index, m.start)
        buf ++= f(m.group(1))
        index = m.end
      }
    if index < template.length then buf ++= template.substring(index)
    buf.result()

  def interpolate(template: String)(using Context): String =
    interpolateWith(template, expr => ctx.theme.templates(expr))

  def interpolateDefault(template: String, theme: model.Theme): String =
    interpolateWith(template, theme.templates.renderDefault)

  def stamp = java.lang.Long.toHexString(Instant.now().toEpochMilli())
