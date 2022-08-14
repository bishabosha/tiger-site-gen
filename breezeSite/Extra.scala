package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all

trait ExtraHljsScala extends breeze.Breeze.Extra:
  val hljsStyle = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css"
  )
  val hljsScript = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js",
    tpe := "text/javascript"
  )
  val hljsScala = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/languages/scala.min.js",
    tpe := "text/javascript"
  )
  val hljsAll = script(
    src := "/static/js/hljs.js",
    tpe := "text/javascript"
  )

  val hljsHead = Seq(hljsStyle)
  val hljsFoot = Seq(hljsScript, hljsScala, hljsAll)

object Extra extends ExtraHljsScala:
  val extraHead = hljsHead
  val extraFoot = hljsFoot
