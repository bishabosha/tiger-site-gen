package model

final case class SiteRoot(root: os.Path)

def curr(using model.SiteRoot) = summon[model.SiteRoot].root