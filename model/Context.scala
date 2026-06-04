package model

sealed trait SiteContext:
  val theme: Theme
  val siteRoot: SiteRoot
  val site: model.Site[theme.SiteMap]

sealed trait Context extends SiteContext:
  val extra: theme.Extra

object Context:

  def fromTheme[T <: Theme](src: os.Path, theme: T)(using
      root: model.SiteRoot
  ): View[ContextForTheme[T]] =
    val theme0 = theme
    View(
      new Context { self =>
        override val theme: theme0.type = theme0
        val siteCtx = SiteView[theme0.type](
          new SiteContext {
            override val theme: theme0.type = theme0
            override val siteRoot: SiteRoot = root
            override val site: model.Site[theme0.SiteMap] =
              io.util.paths.buildSiteDb(src, theme0)
          }
        )
        export siteCtx.{siteRoot, site}

        val extra = {
          given SiteView[SiteContextForTheme[theme0.type]] = siteCtx
          self.theme.extras
        }
      }
    )

  final type ContextForTheme[T <: Theme] = Context {
    val theme: T
  }
  final type SiteContextForTheme[T <: Theme] = SiteContext {
    val theme: T
  }

  export Views.*

  object Views {

    opaque type SiteView[C <: SiteContext] <: C = C
    object SiteView {
      def apply[T <: Theme](
          ctx: SiteContextForTheme[T]
      ): SiteView[SiteContextForTheme[T]] =
        ctx

      given narrowChild: [Child <: Theme, Parent <: Theme]
        => (childCtx: SiteView[SiteContextForTheme[Child]])
        => Site.IsSubPrefix[childCtx.theme.SiteMap, View.SiteOfTheme[Parent]]
        => SiteView[SiteContextForTheme[Parent]] =
        summon[SiteView[SiteContextForTheme[Child]]]
          .asInstanceOf[SiteView[SiteContextForTheme[Parent]]]
    }

    opaque type View[C <: Context] <: C = C
    object View {
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
        => (childCtx: View[ContextForTheme[Child]])
        => Site.IsSubPrefix[childCtx.theme.SiteMap, SiteOfTheme[Parent]]
        => View[ContextForTheme[Parent]] =
        summon[View[ContextForTheme[Child]]]
          .asInstanceOf[View[ContextForTheme[Parent]]]
    }
  }

end Context

inline def ctx(using ctx: Context): ctx.type = ctx
inline def sctx(using sctx: SiteContext): sctx.type = sctx
