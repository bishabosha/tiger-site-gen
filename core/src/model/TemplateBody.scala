package model

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.html.renderer.{NodeRenderer, NodeRendererContext, NodeRenderingHandler}
import com.vladsch.flexmark.util.ast.{Document, Node}
import scala.jdk.CollectionConverters.*

/** Parsed Markdown supplied to a block template. Nested template output is already resolved. */
final class TemplateBody(node: Node):
  val children: Vector[Node] = node.getChildren.asScala.toVector
  private val document = node.getDocument

  // Initialize extensions through Document, but collect only the selected fragment.
  // Document-level output (such as Admonition's SVG symbols) belongs to the final render.
  private def renderWith(fragment: NodeRendererContext => Unit): String =
    var result = ""
    val renderer = HtmlRenderer.builder(document).nodeRendererFactory { _ =>
      new NodeRenderer:
        def getNodeRenderingHandlers: java.util.Set[NodeRenderingHandler[?]] =
          java.util.Set.of(new NodeRenderingHandler(classOf[Document],
            (_, context, html) =>
              // Flexmark's subcontext resolves attributes against the main context's
              // current node. Use that context and capture only the fragment's lines.
              html.line()
              val startLine = html.getLineCountWithPending
              fragment(context)
              val options = context.getHtmlOptions
              val output = new java.lang.StringBuilder
              html.appendTo(output, true, options.maxBlankLines, options.maxTrailingBlankLines,
                startLine, Int.MaxValue)
              result = output.toString
          ))
    }.build()
    renderer.render(document)
    result

  /** Render a node using the document's configured Markdown extensions. */
  def render(node: Node): String = renderWith(_.render(node))
  def renderChildren(node: Node): String = renderWith(_.renderChildren(node))
  def html: String = renderChildren(node)
