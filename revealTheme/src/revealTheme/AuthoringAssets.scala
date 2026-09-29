package revealTheme

import io.util.paths.resolveStaticAsset
import model.{SiteContext, StaticAsset}
import scalatags.Text.all.*

/** Layout-owned assets use the site's hashed static resolver, including module imports. */
private[revealTheme] object AuthoringAssets:
  private val modules = Seq("live", "patch", "navigation", "sidebar", "frame").map { name =>
    name -> StaticAsset.resource(s"/revealTheme/authoring/$name.js")
  }
  private val stylesheet = StaticAsset.resource("/revealTheme/authoring/sidebar.css")

  def head(using SiteContext): Frag =
    val imports = ujson.Obj.from(modules.map { (name, asset) =>
      s"tiger/reveal/$name" -> ujson.Str(resolveStaticAsset(asset))
    })
    frag(
      link(rel := "stylesheet", href := resolveStaticAsset(stylesheet), attr("data-preview-styles") := "true"),
      script(tpe := "importmap", raw(ujson.write(ujson.Obj("imports" -> imports))))
    )

  def scriptUrl(using SiteContext): String = resolveStaticAsset(modules.head._2)
