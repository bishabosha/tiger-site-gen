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

trait ExtraKatexScala extends breeze.Breeze.Extra:
  val katexStyle = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
  )
  val katexScript = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js",
    tpe := "text/javascript"
  )
  val katexRender = script(
    src := "/static/js/katex-render.js",
    tpe := "text/javascript"
  )

  val katexHead = Seq(katexStyle, katexScript)
  val katexFoot = Seq(katexRender)

object Extra extends ExtraHljsScala with ExtraKatexScala:
  val extraHead = hljsHead ++ katexHead
  val extraFoot = hljsFoot ++ katexFoot
