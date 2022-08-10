package model

final case class SiteRoot(root: os.Path)
object SiteRoot:
  inline def here(using sourcecode.File): SiteRoot =
    SiteRoot(root = os.Path(sourcecode.File()) / os.up)

def curr(using model.SiteRoot) = summon[model.SiteRoot].root