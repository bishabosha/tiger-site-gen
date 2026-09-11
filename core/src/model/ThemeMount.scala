package model

import NamedTuple.AnyNamedTuple

/** An explicit boundary between a host's collections and a theme's vocabulary.
  * Keep Prepared values in the host's extras: they belong to one build, not to
  * the long-lived theme definition. Each mount has its own Prepared type.
  */
final class ThemeMount[HostMap <: AnyNamedTuple, T <: Theme](val theme: T)(
    project: Site[HostMap] => Site[theme.SiteMap]
)(using mounts: Theme.Mounts = new Theme.Mounts):
  mounts.register(theme)

  final class Prepared private[ThemeMount] (val context: theme.Context):
    def render[A](body: theme.Context ?=> A): A = body(using context)

    private[ThemeMount] def afterRender(outputRoot: os.Path): Unit =
      Context.afterRender(theme, outputRoot)(using context)

  def prepare()(using host: SiteContext.Of[HostMap]): Prepared =
    given SiteRoot = host.siteRoot
    val prepared = new Prepared(Context.fromSite(theme)(project(host.site), host.buildSession))
    host.renderHooks.register(this)(prepared.afterRender)
    prepared

  def layout[C <: Context, D <: Doc[?]](layout: Layout[theme.Context, D])(
      prepared: C => Prepared
  ): Layout[C, D] =
    layout.contramapContext(host => prepared(host).context)

  /** Typed modifiers for the mounted theme's nodes, e.g. `.installLayouts[C].deck`.
    * Selects this mount's Prepared value from the host extras automatically.
    */
  def installLayouts[C <: Context](using selected: Context.ExtraValue[C, Prepared])
      : SiteMapMeta.LayoutInstallers[C, theme.SiteMap] =
    installLayouts[C](selected.apply)

  /** Explicit preparation lookup for hosts that store a mount inside another value. */
  def installLayouts[C <: Context](prepared: C => Prepared)
      : SiteMapMeta.LayoutInstallers[C, theme.SiteMap] =
    new SiteMapMeta.LayoutInstallers(
      theme.siteMapMeta.entries.map { (name, data) =>
        name -> SiteMapMeta.adapt(data, (host: C) => prepared(host).context)
      }
    )
