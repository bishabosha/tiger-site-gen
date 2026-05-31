package io.util

import model.Context
import model.ctx
import java.time.Instant
import scala.collection.mutable

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
