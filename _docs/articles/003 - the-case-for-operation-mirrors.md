---
layout: article
title: The case for operation mirrors in type class derivation
published: 23-Mar-2024
---

Recently I spoke at [Scalar 2024](https://scalar-conf.com) conference in Warsaw about type class derivation, why it should be used with operations, and a new kind of Mirror in Scala to support that.

> All the code and demos in this article can be found at [bishabosha/ops-mirror](https://github.com/bishabosha/ops-mirror), and also you can see the slides for my talk ["Mirrors for operations, not data"](https://speakerdeck.com/bishabosha/mirrors-for-operations-not-data-3e9bd880-ef29-4937-ba17-d96a27bafba0).

## A motivating example

What's the key idea? In practice, Scala developers have taken to modelling HTTP endpoints as pure data (see Tapir, endpoints4s, zio-http). This is amazing because from a single source of truth you can derive servers, clients, and static documentation. My issue is that these solutions are less readable than the old days of declaring very simple code like the following:

```scala
@fail[HttpError]
trait GreetService derives HttpService:
  @get("/greet/{name}")
  def greet(@path name: String): String

  @post("/greet/{name}")
  def setGreeting(@path name: String, @body greeting: String): Unit
```

So why don't we do just that? That's right, from this very simple trait declaration, let's derive `HttpService`, a pure data model of the service, that is the single source of truth to base both servers and clients on top of. What's more we can delegate tangential concerns such as effect-tracking, transport layer, and data format to downstream interpreters of that model.

And shortcutting to the end a bit, here is what the final code looks like (try it out at [ops-mirror](https://github.com/bishabosha/ops-mirror/blob/main/examples/HelloService.scala)).

```scala
@main def server =
  val e = Endpoints.of[GreetService]

  val greetings = concurrent.TrieMap.empty[String, String]

  val server = ServerBuilder()
    .addEndpoint:
      e.greet.handle: name =>
        Right(s"${greetings.getOrElse(name, "Hello")}, $name")
    .addEndpoint:
      e.setGreeting.handle: (name, greeting) =>
        Right(greetings(name) = greeting)
    .create(port = 8080)
```

```scala
@main def client(who: String, newGreeting: String) =
  val e = Endpoints.of[GreetService]
  val baseUrl = "http://localhost:8080"

  val greetRequest = PartialRequest(e.greet, baseUrl)
    .prepare(who)

  val setGreetingRequest = PartialRequest(e.setGreeting, baseUrl)
    .prepare(who, newGreeting)

  val greetRequest2 = PartialRequest(e.greet, baseUrl)
    .prepare(who)

  for
    init    <- greetRequest.send()
    _       <- setGreetingRequest.send()
    updated <- greetRequest2.send()
  do
    println(s"greeting for $who was: $init, now is: $updated")
```

## The pure data model

So what is `HttpService` that we are going to derive?

essentially, a structure that can associate names to server routes:

```scala
trait HttpService[T]:
  val routes: Map[String, Route]

case class Route(route: model.method, inputs: Seq[Input])
case class Input(label: String, source: model.source)

object model:
  enum method:
    case get(route: String) // GET method
    case post(route: String) // POST method

  enum source:
    case path() // from a URL path segment
    case body() // from the request/response body
```

But how do we generate this structure from `GreetService`? This is where the main initiative of my talk starts. Following the [type class derivation](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html) documentation, we know that `derives HttpService` will desugar to a call to `HttpService.derived` in the companion of `GreetService`, so we know that `HttpService` needs to have a function like the following:

```scala
object HttpService:
  def derived[T]: HttpService[T]
```

But how would we implement this? With the current signature, this is basically not possible to implement, as we know nothing about `T` from the definition.

To provide a satisfactory implementation, we need some evidence of the structure of `T`, describing the various methods, annotations, inputs/outputs etc. If `T` was a case class or an enum, we could ask for a context parameter of `scala.deriving.Mirror.Of[T]`, however this would not work for `GreetService`, as it is neither.

`GreetService` is really a different category, as it isn't data like case classes and enums, it's a service with operations. However, it is very possible to model the signatures of the operations in a service with pure data, which I propose to do with a new mirror for operations (implemented so far as `mirrorops.OpsMirror`).

Given the availability of an operations mirror, a useful definition of `derived` can have this signature:

```scala
object HttpService:
  inline def derived[T](using OpsMirror.Of[T]): HttpService[T]
```

notice the use of `inline`, which will help us inspect the structure of the OpsMirror evidence at compile time.

## The typed endpoint layer

Assuming that `HttpService` can now be derived is not enough however, as the various `Route` do not capture any type information, only metadata for describing an HTTP exchange.

We need something else to capture the type information so that we can get a handle on individual routes, and provide type-safe handlers (in the case of a server) and arguments (in the case of a client).

So we introduce `Endpoints` on top, which is a [structural type](https://docs.scala-lang.org/scala3/reference/changed-features/structural-types.html) extending `Selectable`.

expanding a bit from the [example](#a-motivating-example), here is how it looks:
```scala
val e: Endpoints {
  val greet: Endpoint[EmptyTuple, HttpError, String]
  val setGreeting: Endpoint[(String, String), HttpError, Unit]
} = Endpoints.of[GreetService]
```

i.e. each method from `GreetService` has been reified as an `Endpoint` (a thin wrapper over `Route`), selectable from the `e` value.

> How does `Endpoint` look?
>
> ```scala
> opaque type Endpoint[I <: Tuple, E, O] = Route
> ```
> `I` is a tuple of argument types, `E` is the error type that the endpoint may fail with, and `O` is the
> expected result type.

Again, to implement `Endpoints.of[GreetService]` we will use `OpsMirror`:
```scala
object Endpoints:
  transparent inline def of[T](using OpsMirror.Of[T]): Endpoints
```

this time the method is `transparent inline` because it will add refinements to `Endpoints`. If [SIP-58 Named Tuples](https://github.com/scala/improvement-proposals/pull/72) becomes reality, we could instead use ordinary inline with match types.

## Interpreting as Server or Client

Now we can build a server by adding handlers for each endpoint as such:
```scala
val server = ServerBuilder()
  .addEndpoint:
    e.greet.handle: name =>
      Right(s"${greetings.getOrElse(name, "Hello")}, $name")
  .addEndpoint:
    e.setGreeting.handle: (name, greeting) =>
      Right(greetings(name) = greeting)
  .create(port = 8080)
```

Each handler uses direct style, based on Java's virtual threads.

`handle` is an extension method added to `Endpoint` that requires a correctly typed lambda for each endpoint, e.g.
- `String => Either[HttpError, String]` for `greet`,
- `(String, String) => Either[HttpError, Unit]` for `setGreeting`.
