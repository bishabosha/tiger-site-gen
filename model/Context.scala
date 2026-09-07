package model

import NamedTuple.AnyNamedTuple
import Context.Views.{Conforms, View, SiteView}

sealed trait SiteContext:
  type SiteMap <: NamedTuple.AnyNamedTuple
  val metadata: Theme.Metadata
  val siteRoot: SiteRoot
  val buildSession: BuildSession
  val site: model.Site[SiteMap]
  private[model] val renderHooks: Context.RenderHooks

object SiteContext:
  type Of[SiteMap0 <: NamedTuple.AnyNamedTuple] = SiteContext {
    type SiteMap = SiteMap0
  }

sealed trait Context extends SiteContext:
  type Extra <: NamedTuple.AnyNamedTuple
  type Templates <: NamedTuple.AnyNamedTuple
  val extra: model.Record[Extra]
  val templates: TemplateFunctions[Templates]

object Context:
  type HasExtra[E <: AnyNamedTuple] = Context { type Extra = E }
  type ExtraOf[C <: Context] <: AnyNamedTuple = C match
    case HasExtra[e] => e

  /** Evidence that a host's extras contain exactly one value of the requested type. */
  @scala.annotation.implicitNotFound("The extras of ${C} must contain exactly one field of type ${A}.")
  trait ExtraValue[C <: Context, A]:
    def apply(context: C): A

  object ExtraValue:
    given [C <: Context, A](using select: Record.SelectByType[ExtraOf[C], A]): ExtraValue[C, A] with
      def apply(context: C): A =
        select(context.extra.asInstanceOf[Record[ExtraOf[C]]])


  /** Registration belongs to a prepared context, never to a shared theme object. */
  private[model] final class RenderHooks:
    private val hooks = scala.collection.mutable.LinkedHashMap.empty[AnyRef, os.Path => Unit]
    def register(owner: AnyRef)(hook: os.Path => Unit): Unit = hooks.update(owner, hook)
    def run(outputRoot: os.Path): Unit = hooks.valuesIterator.toVector.foreach(_(outputRoot))

  /** Mounted output completes before the host's own final output hook. */
  def afterRender(theme: Theme, outputRoot: os.Path)(using context: theme.Context): Unit =
    context.renderHooks.run(outputRoot)
    theme.afterRender(outputRoot)

  type Of[
      SiteMap0 <: NamedTuple.AnyNamedTuple,
      Extra0 <: Any,
      Templates0 <: NamedTuple.AnyNamedTuple
  ] = Context {
    type SiteMap = SiteMap0; type Extra = Extra0; type Templates = Templates0
  }

  def fromTheme[T <: Theme](src: os.Path, theme0: T, session: BuildSession = new BuildSession)(using
      root: model.SiteRoot
  ): View[Context.Of[theme0.SiteMap, theme0.Extra, theme0.Templates]] =
    session.synchronized {
      fromSite(theme0)(io.util.paths.buildSiteDb(src, theme0, session), session)
    }

  /** Build a fresh context over existing collections, including projected aliases.
    * Extras are evaluated once and share the same Site as the layouts.
    */
  def fromSite[T <: Theme](theme0: T)(site0: model.Site[theme0.SiteMap], session: BuildSession = new BuildSession)(using
      root: model.SiteRoot
  ): View[Context.Of[theme0.SiteMap, theme0.Extra, theme0.Templates]] =
    View(
      new Context { self =>
        override type SiteMap = theme0.SiteMap
        override type Extra = theme0.Extra
        override type Templates = theme0.Templates
        val buildSession = session
        val metadata: Theme.Metadata = theme0.metadata
        private[model] val renderHooks = new RenderHooks
        val siteCtx = SiteView(
          new SiteContext {
            override type SiteMap = theme0.SiteMap
            val buildSession = session
            val metadata: Theme.Metadata = theme0.metadata
            private[model] val renderHooks = self.renderHooks
            override val siteRoot: SiteRoot = root
            override val site: model.Site[theme0.SiteMap] =
              site0
          }
        )
        override val siteRoot: SiteRoot = root
        override val site: model.Site[theme0.SiteMap] =
          site0

        override val extra: model.Record[Extra] = {
          given SiteView[SiteContext.Of[theme0.SiteMap]] = siteCtx
          theme0.extras
        }
        override val templates: TemplateFunctions[Templates] = theme0.templates
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
      type Templates[T <: Theme] = T match
        case Accessors.Theme__Templates[t] => t

    object Accessors:
      type Theme__SiteMap[T <: NamedTuple.AnyNamedTuple] = Theme {
        type SiteMap = T
      }
      type Theme__Extra[T <: NamedTuple.AnyNamedTuple] = Theme {
        type Extra = T
      }
      type Theme__Templates[T <: NamedTuple.AnyNamedTuple] = Theme {
        type Templates = T
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
      //   => Record.IsSubPrefix[Child, Parent]
      //   => Context.Boxed[ContextOf[PE, Parent]] =
      //     summon[Context.Boxed[ContextOf[CE, Child]]].asInstanceOf[Context.Boxed[ContextOf[PE, Parent]]]

      def apply[C <: model.Context](ctx: C): View[C] =
        ctx

      given conformsContextView: [
          CS <: AnyNamedTuple,
          PS <: AnyNamedTuple,
          CE,
          PE,
          CT <: AnyNamedTuple,
          PT <: AnyNamedTuple
      ]
        => Conforms[Site[CS], Site[PS]]
        => Conforms[CE, PE]
        => Conforms[TemplateFunctions[CT], TemplateFunctions[PT]]
        => Conforms[Context.Of[CS, CE, CT], View[Context.Of[PS, PE, PT]]]()

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
