package breezeSite

import Breeze.DocCollection
import Breeze.Context
import model.ctx

trait Extra(using Context)
    extends HljsExtra
    with KatexExtra
    with AdmonitionExtra
    with NavExtra:
  val extraHead = hljsHead ++ katexHead ++ admonitionHead
  val extraFoot = hljsFoot ++ katexFoot ++ admonitionFoot
