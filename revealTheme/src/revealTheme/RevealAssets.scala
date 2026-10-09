package revealTheme

import model.SiteRoot

/** Host-owned assets layered over the theme's bundled ones (which include reveal.js).
 *
 *  @param publicDirectory files served next to the deck, e.g. `public/assets/style.css`.
 *  @param themeDirectory local overrides of bundled theme files, by the same relative path.
 *  @param vendor further files or directories copied into the deck's asset bundle, each to its
 *    own deck-relative target: typically parts of an npm package a host's deck pages load.
 */
final case class RevealAssets(
    publicDirectory: Option[os.Path] = None,
    themeDirectory: Option[os.Path] = None,
    vendor: Seq[RevealAssets.Vendor] = Nil
)

object RevealAssets:
  type Resolver = SiteRoot => RevealAssets

  /** `source` (a file or directory) is served at the deck-relative `target`. */
  final case class Vendor(source: os.Path, target: os.RelPath)

  /** `public/` and `theme/` in the site root. Resolved at render time so each host and mounted
   *  context uses its own site root.
   */
  val fromSiteRoot: Resolver = root => RevealAssets(
    publicDirectory = Some(root.root / "public"),
    themeDirectory = Some(root.root / "theme")
  )
