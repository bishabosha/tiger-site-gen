package model

sealed trait SiteContext:
  type SiteMap <: NamedTuple.AnyNamedTuple
  val theme: Theme // never widen
  val siteRoot: SiteRoot
  val site: model.Site[SiteMap]

sealed trait Context extends SiteContext:
  type Extra
  val extra: Extra

object Context:

  def fromTheme[T <: Theme](src: os.Path, theme0: T)(using
      root: model.SiteRoot
  ): View[ContextForTheme[theme0.type]] =
    View[theme0.type](
      new Context { self =>
        override type SiteMap = theme0.SiteMap
        override type Extra = theme0.Extra
        val theme: Theme = theme0
        val siteCtx = SiteView[theme0.type](
          new SiteContext {
            override type SiteMap = theme0.SiteMap
            val theme: Theme = theme0
            override val siteRoot: SiteRoot = root
            override val site: model.Site[theme0.SiteMap] =
              io.util.paths.buildSiteDb(src, theme0)
          }
        )
        override val siteRoot: SiteRoot = root
        override val site: model.Site[theme0.SiteMap] =
          io.util.paths.buildSiteDb(src, theme0)

        override val extra: theme0.Extra = {
          given SiteView[SiteContextForTheme[theme0.type]] = siteCtx
          theme0.extras
        }
      }
    )

  final type ContextForTheme[T <: Theme] = Context {
    type SiteMap = Views.Theme.SiteMap[T]
    type Extra = Views.Theme.Extra[T]
  }
  final type SiteContextForTheme[T <: Theme] = SiteContext {
    type SiteMap = Views.Theme.SiteMap[T]
  }

  export Views.*

  object Views {

    object Theme:
      type SiteMap[T <: Theme] = T match
        case Accessors.Theme__SiteMap[t] => t
      type Extra[T <: Theme] = T match
        case Accessors.Theme__Extra[t] => t

    // object Context:
    //   type Extra[T <: Theme] = T match
    //     case Accessors.Context__Extra[t] => t

    object Accessors:
      type Theme__SiteMap[T <: NamedTuple.AnyNamedTuple] = Theme {
        type SiteMap = T
      }
      type Theme__Extra[T] = Theme {
        type Extra = T
      }
      type Theme__BaseType[T] = Theme {
        type BaseType = T
      }

    opaque type SiteView[+C <: SiteContext] <: C = C
    object SiteView {
      def apply[T <: Theme](
          ctx: SiteContextForTheme[T]
      ): SiteView[SiteContextForTheme[T]] =
        ctx

      given narrowChild: [Child <: Theme, Parent <: Theme]
        => (childCtx: SiteView[SiteContextForTheme[Child]])
        => Site.IsSubPrefix[childCtx.SiteMap, Views.Theme.SiteMap[Parent]]
        => SiteView[SiteContextForTheme[Parent]] =
        summon[SiteView[SiteContextForTheme[Child]]]
          .asInstanceOf[SiteView[SiteContextForTheme[Parent]]]
    }

    opaque type View[+C <: Context] <: C = C
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

      type ExtraConforms[Child <: Theme, Parent <: Theme] = Child match
        case Accessors.Theme__Extra[ce] =>
          Parent match
            case Accessors.Theme__Extra[pe] => ce <:< pe
            case _                          => Nothing
        case _ => Nothing

      given narrowChild: [Child <: Theme, Parent <: Theme]
        => (childCtx: View[ContextForTheme[Child]])
        => Site.IsSubPrefix[childCtx.SiteMap, Views.Theme.SiteMap[Parent]]
        => ExtraConforms[Child, Parent]
        => View[ContextForTheme[Parent]] =
        childCtx.asInstanceOf[View[ContextForTheme[Parent]]]
    }
  }

end Context

inline def ctx(using ctx: Context): ctx.type = ctx
inline def sctx(using sctx: SiteContext): sctx.type = sctx
