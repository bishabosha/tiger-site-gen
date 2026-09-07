package revealTheme

import model.{Context, SiteRoot}
import io.util.paths
import java.util.concurrent.{LinkedBlockingQueue, TimeUnit}
import java.util.concurrent.atomic.AtomicLong

class WatchTiming extends munit.FunSuite:
  test("measure save-to-watcher and watcher-to-output latency") {
    val project = example.ExamplePaths.root
    val root = os.Path(os.temp.dir(prefix = "deck-watch-timing-").toNIO.toRealPath())
    given SiteRoot = SiteRoot(root)
    val session = new model.BuildSession
    var watcher: Option[AutoCloseable] = None
    try
      os.copy(project / "examples" / "embedded" / "content", root / "content")
      for directory <- Seq("node_modules") do
        os.symlink(root / directory, project / directory)
      val source = root / "content" / "presentations" / "conference" / "slides" / "010 - opening.md"
      def build(): Unit =
        val context = Context.fromTheme(root / "content", mysite.MySite, session)
        paths.renderSite(root / "dist", mysite.MySite, os.walk(root / "content").filter(os.isFile).toSet)(
          using context, summon[SiteRoot])
      build()
      val started = new AtomicLong()
      val completed = new LinkedBlockingQueue[Either[Throwable, (Long, Long)]]()
      watcher = Some(os.watch.watch(Seq(root / "content"), changes =>
        if changes.exists(_.last == source.last) then
          val received = System.nanoTime()
          try
            build()
            completed.offer(Right(((received - started.get()) / 1000000,
              (System.nanoTime() - received) / 1000000)))
          catch case scala.util.control.NonFatal(error) => completed.offer(Left(error))
      ))
      started.set(System.nanoTime())
      os.write.append(source, "\nWatcher latency check.\n")
      Option(completed.poll(15, TimeUnit.SECONDS)) match
        case Some(Right((notification, rebuild))) =>
          println(s"Save-to-output: notification=${notification}ms rebuild=${rebuild}ms total=${notification + rebuild}ms")
          assert(os.read(root / "dist" / "presentations" / "conference" / "speaker-notes.html").contains("Watcher latency check."))
        case Some(Left(error)) => throw error
        case None => fail("No completed rebuild within 15 seconds of saving a slide")
    finally
      watcher.foreach(_.close())
      os.remove.all(root)
  }
