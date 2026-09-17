package model

/** A TextMate JSON grammar for a fenced language inside a registered block. */
final case class FencedGrammar(fence: String, grammar: String):
  require(fence.matches("[A-Za-z][A-Za-z0-9_+.-]*"), "Invalid fenced language name")
  require(grammar.nonEmpty && !grammar.startsWith("/") && !grammar.contains("\\") && !grammar.contains(":") &&
    !grammar.split("/").contains("..") && grammar.endsWith(".tmLanguage.json"),
    "Grammar must be a site-relative .tmLanguage.json path")

/** Export the same local-first, mounted-template lookup used by Markdown rendering. */
object EditorManifest:
  def json(theme: Theme, sources: Seq[String]): ujson.Value =
    require(sources.nonEmpty, "Editor manifest requires at least one source directory")
    require(sources.forall(path => path.nonEmpty && !path.startsWith("/") &&
      !path.contains("\\") && !path.contains(":") && !path.split("/").contains("..")),
      "Editor source directories must stay within the site root")
    val seen = scala.collection.mutable.Set.empty[Theme]
    val entries = scala.collection.mutable.LinkedHashMap.empty[String, TemplateFunction | BlockTemplateFunction]
    def visit(current: Theme): Unit =
      if seen.add(current) then
        current.templates.entries.foreach { (name, function) =>
          if !entries.contains(name) then entries(name) = function
        }
        current.mountedThemes.foreach(visit)
    visit(theme)
    val blocks = entries.toSeq.collect {
      case (name, block: BlockTemplateFunction) if block.editor.nonEmpty =>
        require(block.editor.map(_.fence).distinct.size == block.editor.size,
          s"Duplicate fenced language in editor metadata for $name")
        ujson.Obj("name" -> name, "fences" -> ujson.Arr.from(block.editor.map { grammar =>
          ujson.Obj("fence" -> grammar.fence, "grammar" -> grammar.grammar)
        }))
    }
    ujson.Obj("version" -> 1, "sources" -> ujson.Arr.from(sources), "blocks" -> ujson.Arr.from(blocks))

  /** Call once after a successful site build. No rewrite when metadata is unchanged. */
  def write(theme: Theme, sources: Seq[String])(using SiteRoot): Unit =
    val file = curr / ".tiger-editor.json"
    val text = ujson.write(json(theme, sources), indent = 2) + "\n"
    if !os.isFile(file) || os.read(file) != text then os.write.over(file, text)
