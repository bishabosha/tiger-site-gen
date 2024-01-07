package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all

trait AdmonitionExtra extends breeze.Breeze.Extra:
  val admonitionStyle = link(
    rel := "stylesheet",
    href := "/static/css/admonition.css"
  )
  val admonitionScript = script(
    src := "/static/js/admonition.js",
    tpe := "text/javascript"
  )

  val admonitionHead = Seq(admonitionStyle)
  val admonitionFoot = Seq(admonitionScript)
