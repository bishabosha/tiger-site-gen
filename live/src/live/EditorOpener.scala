package live

import java.nio.charset.StandardCharsets.UTF_8

/** Opens a source file for the studio's and pages' "open in editor" actions. */
trait EditorOpener:
  def open(file: os.Path): Unit

object EditorOpener:
  /** The Tiger Markdown Templates extension (`tooling/vscode-tiger-templates`). */
  val TigerTemplatesExtension = "bishabosha.tiger-templates"

  /** Through the Tiger Markdown Templates extension: opens the source beside the browser's editor
   *  group and keeps focus there. `extension` is the `<publisher>.<name>` of the installed build.
   */
  def vscodeExtension(extension: String = TigerTemplatesExtension): EditorOpener =
    require(extension.matches("[A-Za-z0-9][A-Za-z0-9-]*\\.[A-Za-z0-9][A-Za-z0-9-]*"),
      s"Expected a VS Code extension id <publisher>.<name>: $extension")
    file => openUri(s"vscode://$extension/open?file=${encode(file.toString)}")

  /** VS Code's built-in file handler: needs no extension, but opens in the active editor group. */
  val vscodeFile: EditorOpener =
    file => openUri(s"vscode://file${file.toNIO.toUri.getRawPath}")

  /** Run `command` followed by the file path, e.g. `Seq("idea")` or `Seq("code", "--reuse-window")`. */
  def command(command: Seq[String]): EditorOpener =
    require(command.nonEmpty, "Expected an editor command")
    file => os.proc(command :+ file.toString).call(stdout = os.Pipe, stderr = os.Pipe)

  val default: EditorOpener = vscodeExtension()

  private def encode(value: String): String =
    java.net.URLEncoder.encode(value, UTF_8).replace("+", "%20")

  /** Hand the URI to whichever application registered its scheme (VS Code, Insiders, VSCodium…). */
  private def openUri(uri: String): Unit =
    val os_ = System.getProperty("os.name").toLowerCase(java.util.Locale.ROOT)
    val launcher =
      if os_.contains("mac") then Seq("/usr/bin/open", uri)
      else if os_.contains("win") then Seq("rundll32", "url.dll,FileProtocolHandler", uri)
      else Seq("xdg-open", uri)
    os.proc(launcher).call(stdout = os.Pipe, stderr = os.Pipe)
