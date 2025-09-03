package io.util

import model.Context
import java.time.Instant
import scala.collection.mutable

object Templates:
  // Thread-local collector to accumulate static dependencies during a single page render
  private val depCollector = new java.lang.ThreadLocal[mutable.Set[String]]()

  def withDependencyCollection[A](body: => A)(using Context): (A, Set[String]) =
    val set = mutable.Set.empty[String]
    depCollector.set(set)
    try
      val res = body
      (res, set.toSet)
    finally depCollector.remove()

  def recordStaticDependency(path: os.Path)(using ctx: Context): Unit =
    val current = depCollector.get()
    if current != null then
      // Store paths relative to the project root to match cache keys
      current += path.relativeTo(ctx.siteRoot.root).toString

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
    interpolateWith(template, interpret)

  def interpolateDefault(template: String): String =
    interpolateWith(template, interpretDefault)

  def stamp = java.lang.Long.toHexString(Instant.now().toEpochMilli())

  private def interpret(expr: String)(using Context): String = expr match
    case s"url $str" => io.util.paths.resolveStaticAsset(str)
    case s"""match-sim-embed $size "$query"""" =>
      val height = if size == "S" then "400px" else size
      s"""<iframe src="/match-type-simulator/$query&stamp=$stamp" width="100%" height="$height"></iframe>"""
    case s"""icon $cls""" => s"""<i class="fa-regular $cls"></i>"""

  private def interpretDefault(expr: String): String = expr match
    case s"url $_"                             => "http://example.com"
    case s"""match-sim-embed $size "$query"""" => """<div></div>"""
    case s"""icon $cls""" => s"""<i class="fa-regular $cls"></i>"""
