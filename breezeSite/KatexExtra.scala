package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all

import model.Context

trait KatexExtra extends breeze.Breeze.Extra:
  val katexStyle = link(
    rel := "stylesheet",
    href := "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css"
  )
  val katexScript = script(
    src := "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js",
    tpe := "text/javascript"
  )
  def katexRender(using Context) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/katex-render.js"),
    tpe := "text/javascript"
  )

  val katexHead = Seq(katexStyle, katexScript)
  def katexFoot(using Context) = Seq(katexRender)
