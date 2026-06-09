package model

import NamedTuple.AnyNamedTuple
import Context.Views.{Conforms, View, SiteView}

sealed trait SiteContext:
  type SiteMap <: NamedTuple.AnyNamedTuple
  val theme: Theme // never widen
  val siteRoot: SiteRoot
  val site: model.Site[SiteMap]

object SiteContext:
  type Of[SiteMap0 <: NamedTuple.AnyNamedTuple] = SiteContext {
    type SiteMap = SiteMap0
  }

sealed trait Context extends SiteContext:
  type Extra <: NamedTuple.AnyNamedTuple
  val extra: model.Record[Extra]

object Context:

  type Of[SiteMap0 <: NamedTuple.AnyNamedTuple, Extra0 <: Any] = Context {
    type SiteMap = SiteMap0; type Extra = Extra0
  }

  def fromTheme[T <: Theme](src: os.Path, theme0: T)(using
      root: model.SiteRoot
  ): View[Context.Of[theme0.SiteMap, theme0.Extra]] =
    View(
      new Context { self =>
        override type SiteMap = theme0.SiteMap
        override type Extra = theme0.Extra
        val theme: Theme = theme0
        val siteCtx = SiteView(
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

        override val extra: model.Record[Extra] = {
          given SiteView[SiteContext.Of[theme0.SiteMap]] = siteCtx
          theme0.extras
        }
      }
    )

  object Views {

    trait Conforms[-Child, +Parent]
    object Conforms {
      given subtypeConforms: [Parent, Child <: Parent] => Conforms[Child, Parent]()
    }

    object Theme:
      type SiteMap[T <: Theme] = T match
        case Accessors.Theme__SiteMap[t] => t
      type Extra[T <: Theme] = T match
        case Accessors.Theme__Extra[t] => t

    object Accessors:
      type Theme__SiteMap[T <: NamedTuple.AnyNamedTuple] = Theme {
        type SiteMap = T
      }
      type Theme__Extra[T <: NamedTuple.AnyNamedTuple] = Theme {
        type Extra = T
      }

    opaque type SiteView[+C <: SiteContext] <: C = C
    object SiteView {
      def apply[C <: SiteContext](
          ctx: C
      ): SiteView[C] =
        ctx

      given conformsSiteContextView: [CS <: AnyNamedTuple, PS <: AnyNamedTuple]
        => Conforms[Site[CS], Site[PS]]
          => Conforms[SiteContext.Of[CS], SiteView[SiteContext.Of[PS]]]()

      given narrowChild: [
          Child <: SiteContext,
          Parent <: SiteContext
      ]
        => (childCtx: Child)
        => Conforms[Child, SiteView[Parent]]
        => SiteView[Parent] = SiteView(childCtx.asInstanceOf[Parent])
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

      def apply[C <: model.Context](ctx: C): View[C] =
        ctx

      given conformsContextView: [
          CS <: AnyNamedTuple,
          PS <: AnyNamedTuple,
          CE,
          PE
      ]
        => Conforms[Site[CS], Site[PS]]
        => Conforms[CE, PE] => Conforms[Context.Of[CS, CE], View[Context.Of[PS, PE]]]()

      given narrowChild: [
          Child <: Context,
          Parent <: Context
      ]
        => (childCtx: Child)
        => Conforms[Child, View[Parent]]
        => View[Parent] = View(childCtx.asInstanceOf[Parent])
    }
  }

end Context

inline def ctx(using ctx: Context): ctx.type = ctx
inline def sctx(using sctx: SiteContext): sctx.type = sctx
