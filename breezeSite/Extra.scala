package breezeSite

object Extra extends HljsExtra with KatexExtra with AdmonitionExtra:
  val extraHead = hljsHead ++ katexHead ++ admonitionHead
  val extraFoot = hljsFoot ++ katexFoot ++ admonitionFoot
