package revealTheme

/** Deck-relative extras a host adds to the presentation, such as its own styles and modules.
 *
 *  @param stylesheets loaded after the Reveal theme, e.g. `assets/presentation-style.css`.
 *  @param moduleScripts ES modules loaded after the deck scripts. Preview clients can reload the
 *    page when one of them changes, instead of patching slides in place.
 */
final case class DeckPage(stylesheets: Seq[String] = Nil, moduleScripts: Seq[String] = Nil):
  for path <- stylesheets ++ moduleScripts do
    require(path.nonEmpty && !path.startsWith("/") && !path.exists(c => c.isWhitespace || "\"'<>&\\".contains(c)) &&
      !path.split('/').contains(".."), s"Expected a deck-relative asset path: $path")

