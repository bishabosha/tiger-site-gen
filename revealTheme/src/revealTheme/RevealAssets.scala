package revealTheme

import model.SiteRoot

/** Host-owned third-party packages and optional local overrides of bundled theme assets. */
final case class RevealAssets(
    revealJs: os.Path,
    pdfJs: os.Path,
    publicDirectory: Option[os.Path] = None,
    themeDirectory: Option[os.Path] = None
)

object RevealAssets:
  type Resolver = SiteRoot => RevealAssets

  /** Resolve at render time so each host and mounted context uses its own site root. */
  val fromNpm: Resolver = root => RevealAssets(
    revealJs = root.root / "node_modules" / "reveal.js",
    pdfJs = root.root / "node_modules" / "pdfjs-dist",
    publicDirectory = Some(root.root / "public").filter(os.isDir),
    themeDirectory = Some(root.root / "theme").filter(os.isDir)
  )
