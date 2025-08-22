package io.util

import model.Context

object Templates:
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

  private def interpret(expr: String)(using Context): String = expr match
    case s"url $str" => io.util.paths.resolveStaticAsset(str)

  private def interpretDefault(expr: String): String = expr match
    case s"url $_" => "http://example.com"
