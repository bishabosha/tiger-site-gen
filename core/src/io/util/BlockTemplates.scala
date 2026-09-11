package io.util

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.html.renderer.{AttributablePart, NodeRenderer, NodeRenderingHandler}
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.parser.block.*
import com.vladsch.flexmark.util.ast.{Block, Document, Node}
import com.vladsch.flexmark.util.data.{DataHolder, MutableDataHolder}
import com.vladsch.flexmark.util.sequence.BasedSequence
import model.TemplateBody
import scala.jdk.CollectionConverters.*

/** Fenced containers parsed by Markdown, so code examples and nesting keep their meaning. */
private[util] object BlockTemplates extends Parser.ParserExtension, HtmlRenderer.HtmlRendererExtension:
  def parserOptions(options: MutableDataHolder): Unit = ()
  def extend(builder: Parser.Builder): Unit =
    builder.customBlockParserFactory(new Factory)

  def rendererOptions(options: MutableDataHolder): Unit = ()
  def extend(builder: HtmlRenderer.Builder, rendererType: String): Unit =
    if builder.isRendererType("HTML") then
      builder.nodeRendererFactory { _ =>
        new NodeRenderer:
          def getNodeRenderingHandlers: java.util.Set[NodeRenderingHandler[?]] =
            java.util.Set.of(new NodeRenderingHandler(classOf[TemplateBlock],
              (node, context, html) =>
                val attributes = context.extendRenderingNodeAttributes(node, AttributablePart.NODE, null)
                html.line()
                // A template may return several roots, so container attributes need
                // their own element. Leave ordinary template output unwrapped.
                if !attributes.isEmpty then html.withAttr().tag("div").line()
                html.rawPre(node.rendered + "\n")
                if !attributes.isEmpty then html.tag("/div").line()
                ()
            ))
      }

  private[util] class TemplateBlock(val expression: String, val line: Int, val opening: BasedSequence)
      extends Block(opening):
    var closing: BasedSequence = BasedSequence.NULL
    var rendered: String = ""
    def getSegments: Array[BasedSequence] = Array(opening, closing)

  private class Container(val block: TemplateBlock) extends AbstractBlockParser:
    private var closed = false
    def getBlock: Block = block
    override def isContainer: Boolean = true
    override def canContain(state: ParserState, parser: BlockParser, child: Block): Boolean = true

    def tryContinue(state: ParserState): BlockContinue =
      if closed then BlockContinue.none() else BlockContinue.atIndex(state.getIndex)

    def closeFence(state: ParserState): Unit =
      closed = true
      block.closing = state.getLineWithEOL

    def closeBlock(state: ParserState): Unit =
      require(closed, s"Unclosed :::${block.expression} at line ${block.line}; expected closing :::")
      block.setChars(block.opening.baseSubSequence(block.opening.getStartOffset, block.closing.getEndOffset))

  private class Factory extends CustomBlockParserFactory:
    def getAfterDependents: java.util.Set[Class[?]] = null
    def getBeforeDependents: java.util.Set[Class[?]] = null
    def affectsGlobalScope: Boolean = false
    def apply(options: DataHolder): BlockParserFactory = new AbstractBlockParserFactory(options):
      def tryStart(state: ParserState, matched: MatchedBlockParser): BlockStart =
        val line = state.getLine.subSequence(state.getNextNonSpaceIndex).toString.trim
        if state.getIndent >= 4 then BlockStart.none()
        else if line == ":::" then
          // Let Markdown decide whether this line is syntax or literal raw content.
          // The factory runs only after code/HTML parsers have had their turn.
          val container = Iterator.iterate(matched.getBlockParser.getBlock: Node)(_.getParent)
            .takeWhile(_ != null).collectFirst { case block: TemplateBlock => block }
          container match
            case Some(block) =>
              state.getActiveBlockParser(block).asInstanceOf[Container].closeFence(state)
              BlockStart.of(new ClosingFence(state.getLineWithEOL)).atIndex(state.getLineEndIndex)
            case None =>
              throw new IllegalArgumentException(s"Unexpected closing ::: at line ${state.getLineNumber + 1}")
        else if line.matches(":::[A-Za-z][A-Za-z0-9_-]*(?:\\s+.*)?") then
          val block = new TemplateBlock(line.drop(3), state.getLineNumber + 1, state.getLineWithEOL)
          BlockStart.of(new Container(block)).atIndex(state.getLineEndIndex)
        else BlockStart.none()

  /** Consume the closing line without adding a node to the template's body. */
  private class ClosingFence(chars: BasedSequence) extends AbstractBlockParser:
    private val block = new Block(chars):
      def getSegments: Array[BasedSequence] = Array(getChars)
    def getBlock: Block = block
    def tryContinue(state: ParserState): BlockContinue = BlockContinue.none()
    def closeBlock(state: ParserState): Unit = block.unlink()

  /** Resolve children first, retaining the AST for document-level extension visitors. */
  def expand(document: Document, render: (String, TemplateBody) => String): Document =
    def visit(parent: Node): Unit =
      for node <- parent.getChildren.asScala.toVector do
        visit(node)
        node match
          case block: TemplateBlock =>
            val html = try render(block.expression, new TemplateBody(block))
              catch case error: IllegalArgumentException =>
                throw new IllegalArgumentException(s":::${block.expression} at line ${block.line}: ${error.getMessage}", error)
            block.rendered = html
          case _ => ()
    visit(document)
    document
