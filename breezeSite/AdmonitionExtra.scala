package breezeSite

import scalatags.Text.all.*
import scalatags.Text.all
import model.SiteContext

trait AdmonitionExtra extends breeze.Breeze.Extra:
  def admonitionStyle(using SiteContext) = link(
    rel := "stylesheet",
    href := io.util.paths.resolveStaticAsset("/static/css/admonition.css")
  )
  def admonitionScript(using SiteContext) = script(
    src := io.util.paths.resolveStaticAsset("/static/js/admonition.js"),
    tpe := "text/javascript"
  )

  def admonitionHead(using SiteContext) = Seq(admonitionStyle)
  def admonitionFoot(using SiteContext) = Seq(admonitionScript)
