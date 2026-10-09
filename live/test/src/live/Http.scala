package live

import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}
import java.nio.charset.StandardCharsets.UTF_8
import java.util.concurrent.{LinkedBlockingQueue, TimeUnit}

/** Small HTTP helpers for server checks (java.net.http, plus raw sockets for forged Host headers). */
object Http:
  private val client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build()

  final case class Response(status: Int, headers: Map[String, String], body: String):
    def json: ujson.Value = ujson.read(body)
    def header(name: String): Option[String] = headers.get(name.toLowerCase)

  private def send(request: HttpRequest): Response =
    val response = client.send(request, HttpResponse.BodyHandlers.ofString(UTF_8))
    val headers = response.headers().map().entrySet().toArray.toSeq.map(_.asInstanceOf[java.util.Map.Entry[String, java.util.List[String]]])
      .map(entry => entry.getKey.toLowerCase -> entry.getValue.get(0)).toMap
    Response(response.statusCode(), headers, response.body())

  def get(url: String, headers: (String, String)*): Response =
    send(headers.foldLeft(HttpRequest.newBuilder(URI.create(url)).GET())((b, h) => b.header(h._1, h._2)).build())

  def head(url: String): Response =
    send(HttpRequest.newBuilder(URI.create(url)).method("HEAD", HttpRequest.BodyPublishers.noBody()).build())

  def post(url: String, body: String, headers: (String, String)*): Response =
    send(headers.foldLeft(HttpRequest.newBuilder(URI.create(url)).POST(HttpRequest.BodyPublishers.ofString(body)))(
      (b, h) => b.header(h._1, h._2)).build())

  /** Same-origin JSON, as the studio and sidebar send it. */
  def postJson(origin: String, path: String, body: ujson.Value, originHeader: Option[String] = None): Response =
    post(origin + path, ujson.write(body), "Content-Type" -> "application/json", "Origin" -> originHeader.getOrElse(origin))

  /** A request with an arbitrary Host header, which java.net.http does not allow. */
  def raw(port: Int, request: String): Int =
    val socket = new java.net.Socket("127.0.0.1", port)
    try
      socket.getOutputStream.write(request.getBytes(UTF_8))
      socket.getOutputStream.flush()
      val status = new java.io.BufferedReader(new java.io.InputStreamReader(socket.getInputStream, UTF_8)).readLine()
      status.split(' ')(1).toInt
    finally socket.close()

  /** Collects server-sent events as (event type, data) pairs until closed. */
  final class EventStream(url: String) extends AutoCloseable:
    val events = new LinkedBlockingQueue[(String, String)]()
    @volatile var contentType: Option[String] = None
    @volatile private var body: Option[java.util.stream.Stream[String]] = None
    private val response = client.sendAsync(HttpRequest.newBuilder(URI.create(url)).GET().build(),
      HttpResponse.BodyHandlers.ofLines())
    private val reader = new Thread(() =>
      try
        val lines = response.get(10, TimeUnit.SECONDS)
        contentType = Option(lines.headers().firstValue("content-type").orElse(null))
        body = Some(lines.body())
        var event = "message"
        var data = List.empty[String]
        lines.body().forEach { line =>
          if line.isEmpty then
            if data.nonEmpty then events.put((event, data.reverse.mkString("\n")))
            event = "message"
            data = Nil
          else if line.startsWith("data: ") then data = line.drop(6) :: data
          else if line.startsWith("event: ") then event = line.drop(7)
        }
      catch case _: Throwable => ()
    )
    reader.setDaemon(true)
    reader.start()

    def next(timeoutMillis: Long = 5000): (String, String) =
      Option(events.poll(timeoutMillis, TimeUnit.MILLISECONDS)).getOrElse(throw AssertionError("Timed out waiting for an event"))
    def close(): Unit =
      response.cancel(true)
      body.foreach(_.close())
      reader.interrupt()
