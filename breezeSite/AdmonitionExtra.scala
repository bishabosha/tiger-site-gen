package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all
import model.Context

trait AdmonitionExtra extends breeze.Breeze.Extra:
  def admonitionStyle(using Context) = link(
    rel := "stylesheet",
    href := io.util.paths.resolveStaticAsset("/static/css/admonition.css")
  )
  def admonitionScript(using Context) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/admonition.js"),
    tpe := "text/javascript"
  )

  def admonitionHead(using Context) = Seq(admonitionStyle)
  def admonitionFoot(using Context) = Seq(admonitionScript)
