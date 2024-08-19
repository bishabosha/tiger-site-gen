package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all
import model.Context

trait AdmonitionExtra extends breeze.Breeze.Extra:
  def admonitionStyle(using Context) = link(
    rel := "stylesheet",
    href := io.util.paths.resolveStaticAsset("/static/css/admonition.css")
  )
  val admonitionScript = script(
    src := "/static/js/admonition.js",
    tpe := "text/javascript"
  )

  def admonitionHead(using Context) = Seq(admonitionStyle)
  val admonitionFoot = Seq(admonitionScript)
