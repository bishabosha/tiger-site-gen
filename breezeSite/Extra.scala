package breezeSite

import Breeze.SiteContext
import model.sctx

trait Extra(using SiteContext)
    extends HljsExtra
    with KatexExtra
    with AdmonitionExtra
    with NavExtra:
  // val trap: Nothing =
  //   println(
  //     "loop"
  //   )
  //   ctx.extra.trap
  val extraHead = hljsHead ++ katexHead ++ admonitionHead
  val extraFoot = hljsFoot ++ katexFoot ++ admonitionFoot
