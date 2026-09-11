package revealTheme

import model.{Context, Record, Site, SiteRoot, TemplateFunctions}
import model.SiteMapSchema.auto.given

class InferredExtrasChecks extends munit.FunSuite:
  test("definitions retain mount types and prepare fresh extras and hooks for each context") {
    var preparations = 0
    var childPreparations = 0
    val rendered = scala.collection.mutable.ArrayBuffer.empty[Int]
    object child extends model.Theme:
      val metadata: model.Theme.Metadata = new:
        val name = "Tracked child"
      type SiteMap = NamedTuple.Empty
      type Templates = NamedTuple.Empty
      val templates = TemplateFunctions.Empty
      type Extra = (serial: Int)
      def extras(using SiteContext): Record[Extra] =
        childPreparations += 1
        Record((serial = childPreparations))
      override def afterRender(outputRoot: os.Path)(using context: Context): Unit =
        rendered += context.extra.serial

    object host extends model.InferredExtras:
      val metadata = child.metadata
      type SiteMap = NamedTuple.Empty
      type Templates = NamedTuple.Empty
      val templates = TemplateFunctions.Empty
      val first = mount(child)(_ => EmptyTuple)
      val second = mount(child)(_ => EmptyTuple)
      val extraDefs = defineExtras {
        preparations += 1
        (first = first.prepare(), second = second.prepare(), generation = preparations)
      }
      override val siteMapMeta = second.extend(first.extend(defaultSiteMeta))

    summon[host.Extra =:= (first: host.first.Prepared, second: host.second.Prepared, generation: Int)]
    assertEquals(host.metadata.name, "Tracked child")
    assertEquals(preparations, 0)
    assertEquals(childPreparations, 0)
    val root = os.temp.dir(prefix = "planned-extras-")
    given SiteRoot = SiteRoot(root)
    try
      val site = Site.read[host.SiteMap](None, None, Map.empty)
      val session = new model.BuildSession
      val first = Context.fromSite(host)(site, session)
      val second = Context.fromSite(host)(site, session)
      assertEquals(preparations, 2)
      assertEquals(childPreparations, 4)
      assertEquals(first.extra.generation, 1)
      assertEquals(second.extra.generation, 2)
      assert(!(first.extra.first eq second.extra.first))
      assertEquals(first.extra.first.context.extra.serial, 1)
      assertEquals(first.extra.second.context.extra.serial, 2)
      assertEquals(second.extra.first.context.extra.serial, 3)
      assertEquals(second.extra.second.context.extra.serial, 4)
      Context.afterRender(host, root)(using first)
      Context.afterRender(host, root)(using second)
      Context.afterRender(host, root)(using first)
      assertEquals(rendered.toList, List(1, 2, 3, 4, 1, 2))
      assertEquals(preparations, 2)
    finally os.remove.all(root)
  }

  test("extras failures occur when constructing a context, before rendering") {
    var attempts = 0
    object failing extends model.InferredExtras:
      val metadata: model.Theme.Metadata = new:
        val name = "Failing extras"
      type SiteMap = NamedTuple.Empty
      type Templates = NamedTuple.Empty
      val templates = TemplateFunctions.Empty
      val extraDefs = defineExtras {
        attempts += 1
        require(false, "invalid extras")
        (value = 42)
      }
    assertEquals(failing.metadata.name, "Failing extras")
    assertEquals(attempts, 0)
    val root = os.temp.dir(prefix = "planned-extras-failure-")
    given SiteRoot = SiteRoot(root)
    try
      val failure = intercept[IllegalArgumentException] {
        Context.fromSite(failing)(Site.read[failing.SiteMap](None, None, Map.empty))
      }
      assert(failure.getMessage.contains("invalid extras"))
      assertEquals(attempts, 1)
    finally os.remove.all(root)
  }
