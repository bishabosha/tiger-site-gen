package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all

import model.Context

trait HljsExtra extends breeze.Breeze.Extra:
  val hljsStyle = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css"
  )
  val hljsScript = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js",
    tpe := "text/javascript"
  )
  def hljsScala(using Context) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/hljs-scala3.js"),
    tpe := "text/javascript"
  )
  def hljsAll(using Context) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/hljs.js"),
    tpe := "text/javascript"
  )

  val hljsHead = Seq(hljsStyle)
  def hljsFoot(using Context) = Seq(hljsScript, hljsScala, hljsAll)
