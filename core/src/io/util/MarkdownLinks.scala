package io.util

import com.vladsch.flexmark.html.{HtmlRenderer, LinkResolver, LinkResolverFactory}
import com.vladsch.flexmark.html.renderer.{ResolvedLink, LinkResolverBasicContext}
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.ast.{Document, Node}
import com.vladsch.flexmark.util.data.MutableDataHolder
import scala.jdk.CollectionConverters.*

/** The normal Markdown rendering hook also applies inside block-template bodies. */
private[util] object MarkdownLinks:
  def install(document: Document, resolve: String => String): Unit =
    val extension = new HtmlRenderer.HtmlRendererExtension:
      def rendererOptions(options: MutableDataHolder): Unit = ()
      def extend(builder: HtmlRenderer.Builder, rendererType: String): Unit =
        builder.linkResolverFactory(new LinkResolverFactory:
          def getAfterDependents: java.util.Set[Class[?]] = null
          def getBeforeDependents: java.util.Set[Class[?]] = null
          def affectsGlobalScope: Boolean = false
          def apply(context: LinkResolverBasicContext): LinkResolver = new LinkResolver:
            def resolveLink(node: Node, context: LinkResolverBasicContext, link: ResolvedLink): ResolvedLink =
              link.withUrl(resolve(link.getUrl))
        )
        ()
    document.set(Parser.EXTENSIONS, (Parser.EXTENSIONS.get(document).asScala.toVector :+ extension).asJava)
