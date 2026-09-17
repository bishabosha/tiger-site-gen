package revealTheme

import model.{BlockTemplateFunction, EditorManifest, FencedGrammar, TemplateFunction, TemplateFunctions}
import model.SiteMapSchema.auto.given

class EditorManifestChecks extends munit.FunSuite:
  private val grammar = FencedGrammar("trace", "grammars/trace.tmLanguage.json")
  private def block = BlockTemplateFunction((_, body) => body.html, (_, body) => body.html, editor = Seq(grammar))
  private object child extends model.InferredTemplates, model.EmptyExtras:
    val metadata: model.Theme.Metadata = new:
      val name = "Child"
    type SiteMap = NamedTuple.Empty
    val templateDefs = TemplateFunctions((decoder = block, plain = BlockTemplateFunction((_, b) => b.html, (_, b) => b.html)))

  test("registered grammar metadata survives dictionary composition and mounts") {
    object host extends model.EmptyTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val nested = mount(child)(_ => NamedTuple.Empty)
    val result = EditorManifest.json(host, Seq("content"))
    assertEquals(result("version").num.toInt, 1)
    assertEquals(result("blocks").arr.size, 1)
    assertEquals(result("blocks")(0)("name").str, "decoder")
    assertEquals(result("blocks")(0)("fences")(0)("grammar").str, grammar.grammar)
    val combined = RevealTheme.templates ++ child.templates
    assertEquals(combined.decoder.editor, Seq(grammar))
  }
  test("a local inline or unannotated block shadows mounted editor metadata") {
    object inlineHost extends model.InferredTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val nested = mount(child)(_ => NamedTuple.Empty)
      val templateDefs = TemplateFunctions((decoder = TemplateFunction(_ => "", _ => "")))
    object blockHost extends model.InferredTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val nested = mount(child)(_ => NamedTuple.Empty)
      val templateDefs = TemplateFunctions((decoder = BlockTemplateFunction((_, b) => b.html, (_, b) => b.html)))
    assert(EditorManifest.json(inlineHost, Seq("content"))("blocks").arr.isEmpty)
    assert(EditorManifest.json(blockHost, Seq("content"))("blocks").arr.isEmpty)
  }
  test("manifest writes are stable and disappearing registrations are removed") {
    val root = os.temp.dir(prefix = "tiger-editor-")
    try
      given model.SiteRoot = model.SiteRoot(root)
      EditorManifest.write(child, Seq("content"))
      val file = root / ".tiger-editor.json"
      val before = os.stat(file).mtime
      EditorManifest.write(child, Seq("content"))
      assertEquals(os.stat(file).mtime, before)
      EditorManifest.write(RevealTheme, Seq("content"))
      assert(ujson.read(os.read(file))("blocks").arr.isEmpty)
    finally os.remove.all(root)
  }
  test("invalid grammar paths and duplicate fence declarations are rejected") {
    for path <- Seq("../trace.tmLanguage.json", "/trace.tmLanguage.json", "trace.js") do
      intercept[IllegalArgumentException](FencedGrammar("trace", path))
    object duplicate extends model.InferredTemplates, model.EmptyExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      val templateDefs = TemplateFunctions((decoder = BlockTemplateFunction((_, b) => b.html, (_, b) => b.html, editor = Seq(grammar, grammar))))
    intercept[IllegalArgumentException](EditorManifest.json(duplicate, Seq("content")))
  }
