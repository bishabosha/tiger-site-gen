package revealTheme

import com.vladsch.flexmark.ast.Heading
import com.vladsch.flexmark.ext.attributes.{AttributeNode, AttributesExtension}
import com.vladsch.flexmark.html.{HtmlRenderer, LinkResolver, LinkResolverFactory}
import com.vladsch.flexmark.html.renderer.{HeaderIdGenerator, LinkResolverBasicContext, ResolvedLink}
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.ast.{Document, Node}
import com.vladsch.flexmark.util.data.MutableDataHolder
import scala.jdk.CollectionConverters.*

/** Assign heading IDs in the Markdown AST before any template or page rendering. */
private[revealTheme] object SlideAnchors:
  def install(document: Document, slideId: String, notes: Boolean = false): Unit =
    // Colons are forbidden in slide IDs, making these namespaces disjoint from slide routes.
    val prefix = s"${if notes then "notes-heading" else "heading"}:$slideId:"
    new HeaderIdGenerator(document).generateIds(document)
    val headings = document.getDescendants.asScala.collect { case h: Heading => h }.toVector
    val duplicates = headings.groupBy(_.getAnchorRefId).collect { case (id, nodes) if nodes.size > 1 => id }.toVector.sorted
    require(duplicates.isEmpty, s"Slide '$slideId' ${if notes then "notes " else ""}has duplicate heading IDs: ${duplicates.mkString(", ")}")
    val targets = headings.map(h => h.getAnchorRefId -> (prefix + h.getAnchorRefId)).toMap
    for heading <- headings do
      heading.setAnchorRefId(targets(heading.getAnchorRefId))
      // Flexmark has already copied explicit IDs onto the heading. Remove the source
      // attribute so {id=...} cannot emit a second ID on the heading and its permalink.
      Option(AttributesExtension.NODE_ATTRIBUTES.get(document).get(heading)).foreach { groups =>
        for group <- groups.asScala; attribute <- group.getChildren.asScala.toVector do
          attribute match
            case id: AttributeNode if id.isId => id.unlink()
            case _ => ()
      }
    val extension = new HtmlRenderer.HtmlRendererExtension:
      def rendererOptions(options: MutableDataHolder): Unit = ()
      def extend(builder: HtmlRenderer.Builder, rendererType: String): Unit =
        builder.linkResolverFactory(new LinkResolverFactory:
          def getAfterDependents: java.util.Set[Class[?]] = null
          def getBeforeDependents: java.util.Set[Class[?]] = null
          def affectsGlobalScope: Boolean = false
          def apply(context: LinkResolverBasicContext): LinkResolver = new LinkResolver:
            def resolveLink(node: Node, context: LinkResolverBasicContext, link: ResolvedLink): ResolvedLink =
              val url = link.getUrl
              // #/… is a slide route; local heading references also work inside templates.
              if url.startsWith("#") && !url.startsWith("#/") then
                targets.get(url.drop(1)).fold(link)(id => link.withUrl(s"#$id"))
              else link
        )
        ()
    document.set(Parser.EXTENSIONS, (Parser.EXTENSIONS.get(document).asScala.toVector :+ extension).asJava)
