package model

import Context.InMakeCtx

sealed trait Context:
  val theme: Theme
  val siteRoot: SiteRoot
  val site: model.Site[theme.SiteMap]
  val extra: theme.Extra

object Context:
  opaque type InMakeCtx = Unit
  private[Context] def InMakeCtx: InMakeCtx = ()

  def fromTheme[T <: Theme](src: os.Path, theme: T)(using
      root: model.SiteRoot
  ): View[ContextForTheme[T]] =
    val theme0 = theme
    View(
      new Context {
        override val theme: theme0.type = theme0
        val siteRoot = summon[model.SiteRoot]
        val site = io.util.paths.buildSiteDb(src, theme0)
        val extra =
          theme0.extras(using this.asInstanceOf[theme0.Context], InMakeCtx)
      }
    )

  final type ContextForTheme[T <: Theme] = model.Context {
    val theme: T
  }

  opaque type View[C <: Context] <: C = C
  object View:
    // FIXME: INFERENCE-0: is this a dotty bug? necessary to have a
    // nonsense structural refinement or else implicits are not found
    // final type ContextOf[E, T <: NamedTuple.AnyNamedTuple] = model.Context {
    //   val site: model.Site[T] {
    //     def __structural__ : Nothing
    //   }
    //   val extra: E
    // }
    // given narrowChild: [CE <: PE, PE, Child <: NamedTuple.AnyNamedTuple, Parent <: NamedTuple.AnyNamedTuple]
    //   => Context.Boxed[ContextOf[CE, Child]]
    //   => Site.IsSubPrefix[Child, Parent]
    //   => Context.Boxed[ContextOf[PE, Parent]] =
    //     summon[Context.Boxed[ContextOf[CE, Child]]].asInstanceOf[Context.Boxed[ContextOf[PE, Parent]]]

    def apply[T <: Theme](ctx: ContextForTheme[T]): View[ContextForTheme[T]] =
      ctx

    object Accessors:
      type Theme__SiteMap[T <: NamedTuple.AnyNamedTuple] = Theme {
        type SiteMap = T
      }

    type SiteOfTheme[T <: Theme] = T match
      case Accessors.Theme__SiteMap[t] => t

    given narrowChild: [Child <: Theme, Parent <: Theme]
      => (childCtx: Context.View[ContextForTheme[Child]])
      => Site.IsSubPrefix[childCtx.theme.SiteMap, SiteOfTheme[Parent]]
      => Context.View[ContextForTheme[Parent]] =
      summon[Context.View[ContextForTheme[Child]]]
        .asInstanceOf[Context.View[ContextForTheme[Parent]]]

end Context

inline def ctx(using ctx: Context): ctx.type = ctx
