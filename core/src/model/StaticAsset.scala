package model

/** An immutable snapshot resolved through the site's /static pipeline. */
final class StaticAsset private (val path: String, load: () => Array[Byte], val source: Option[os.Path]):
  lazy val bytes: Array[Byte] = load()
  lazy val hash: String = io.util.sanatise.md5Hashed(bytes)

object StaticAsset:
  private val files = new BuildSession.Cache[os.Path, (io.util.sanatise.FileVersion, Array[Byte])]

  private def validate(path: String): Unit =
    require(path.startsWith("/") && !path.startsWith("//") && !path.split("/").contains(".."),
      s"Expected an absolute static resource path: $path")

  def resource(path: String): StaticAsset =
    validate(path)
    new StaticAsset(path, () =>
      val stream = Option(getClass.getResourceAsStream(path))
        .getOrElse(throw IllegalArgumentException(s"Missing static resource: $path"))
      try stream.readAllBytes()
      finally stream.close()
    , None)

  def text(path: String, text: String): StaticAsset =
    validate(path)
    new StaticAsset(path, () => text.getBytes(java.nio.charset.StandardCharsets.UTF_8), None)

  /** File versions include ctime, so equal-size edits with restored mtime still invalidate. */
  def file(path: String, source: os.Path, session: BuildSession): StaticAsset =
    validate(path)
    val version = io.util.sanatise.fileVersion(source)
    val cache = session.cache(files)
    val bytes = cache.get(source).filter(entry => version.changed.nonEmpty && entry._1 == version).map(_._2).getOrElse {
      val result = os.read.bytes(source)
      cache(source) = (version, result)
      result
    }
    new StaticAsset(path, () => bytes, Some(source))

/** A content-addressed tree keeps CSS URLs, module imports and nested HTML links relative.
 *  File names and bytes both contribute to the hash; insertion, removal and rename invalidate it.
 */
final class StaticBundle(val name: String, val files: Map[os.RelPath, StaticAsset], val directories: Seq[os.Path] = Nil):
  require(name.matches("[a-zA-Z0-9_-]+"), s"Invalid static bundle name: $name")
  lazy val hash: String = io.util.sanatise.md5Hashed(files.toVector.sortBy(_._1.toString)
    .map((path, asset) => s"$path\u0000${asset.hash}\n").mkString.getBytes(java.nio.charset.StandardCharsets.UTF_8))
  def outputDirectory: String = s"${name}_$hash"
  def dependencies: Seq[os.Path] = directories ++ files.values.flatMap(_.source)

/** Shared by a host context and its mounted themes, never by separate builds. */
final class StaticAssets:
  private val assets = scala.collection.mutable.LinkedHashMap.empty[String, StaticAsset]
  private val trees = scala.collection.mutable.LinkedHashMap.empty[String, StaticBundle]
  def register(asset: StaticAsset): Unit =
    assets.get(asset.path).foreach { previous =>
      require(previous.hash == asset.hash, s"Conflicting static asset: ${asset.path}")
    }
    assets(asset.path) = asset
  def register(bundle: StaticBundle): Unit = trees(bundle.outputDirectory) = bundle
  def get(path: String): Option[StaticAsset] = assets.get(path)
  def resources: Seq[StaticAsset] = assets.values.toVector
  def bundles: Seq[StaticBundle] = trees.values.toVector
