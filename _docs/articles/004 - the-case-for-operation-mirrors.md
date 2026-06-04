```scala
(
  layout = "article",
  title = "Just declare your services: Introducing operation mirrors",
  description = "ops-mirror is a new micro-library that helps reflect traits at compile time, " +
    "for use with type-class derivation.",
  published = "24-Jun-2024",
)
```
---

Scala 3 makes it even easier to write expressive code that feels like it belongs in a dynamic language, but stays aggressively type-safe, improving your productivity. Towards this style, I'm introducing [ops-mirror](https://github.com/bishabosha/ops-mirror), a micro-library for reflection of method signatures, for example to generate schemas for HTTP endpoints from trait definitions.

> As of publishing, version 0.1.2 is available for Scala 3.3 LTS on JVM, JS, and Native.
> ```scala
> //> using dep io.github.bishabosha::ops-mirror::0.1.2
>
> import mirrorops.OpsMirror
> ```


One of Scala 3's greatest strengths is the new metaprogramming system.
Even though it is very powerful, you don't need to be a genius to get started with it. In my talk ["Mirrors for operations, not data"](https://www.youtube.com/watch?v=zYl117VzSGA), from Scalar 2024, I explained how to get started using the new [automatic type-class derivation](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html) mechanism in Scala 3. I noted a limitation however, which is that the compiler only provides reflection support (via the [Mirror](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html#mirror-1) typeclass) for sum/product types. I believe that we can extend this reflection support to interface types, which is provided by the [ops-mirror](https://github.com/bishabosha/ops-mirror) micro-library. It seems to be a natural extension - so far inpiring other libraries to be released such as [smithy4s-deriving](https://github.com/neandertech/smithy4s-deriving).

## A motivating example

It can be hard to keep track of API changes in web services, and to ensure that servers and clients don't fall out of sync.

A common solution to this problem is to describe the API as a set of endpoints, using pure data. A single endpoint is a schema of the expected input/output data, and any metadata necessary to describe the endpoint (such as the HTTP method, path, and query parameters).

In Scala, there are many libraries that help you do this. For example, via an embedded DSL (see [tapir](https://tapir.softwaremill.com/en/latest/), [endpoints4s](https://endpoints4s.github.io), [zio-http](https://github.com/zio/zio-http)).
Other solutions use code generation from another source language, such as [Smithy4s](https://disneystreaming.github.io/smithy4s/).

There are some downsides to these solutions: e.g. a DSL may be less straightforward for beginners; and code generation requires extra support from a build tool, which might not be practical.

As a hopefully simpler solution, I propose to avoid all the ceremony and bring back _plain traits + annotations_, and with the help of ops-mirror generate endpoints from this source of truth.

So here is a simple definition of a service to greet people with a custom message ([try it out](https://github.com/bishabosha/ops-mirror/blob/main/examples/GreetService.scala)):

```scala
@failsWith[HttpError]
trait GreetService derives HttpService:

  @get("/greet/{name}")
  def greet(@path name: String): String

  @post("/greet/{name}")
  def setGreeting(@path name: String, @body greeting: String): Unit

end GreetService
```

It looks highly readable, and should be familiar to a beginner. A **method** is 1:1 with an endpoint, with **inputs** and **outputs**. A trait collects several endpoints into a a **service**. Annotations describe the metadata associated with either a whole service, an individual endpoint, or an input of that endpoint.

Here is what a like to define server handlers and create a simple client, sticking to a [Lean Scala](https://odersky.github.io/blog/2024-04-11-post.html) style (again [try it out](https://github.com/bishabosha/ops-mirror/blob/main/examples/GreetService.scala)):

```scala
val e = HttpService.endpoints[GreetService]

@main def server =
  val greetings = concurrent.TrieMap.empty[String, String]

  val server = ServerBuilder()
    .addEndpoint:
        e.greet.handle: name =>
            Right(s"${greetings.getOrElse(name, "Hello")}, $name"))
    .addEndpoint:
        e.setGreeting.handle: (name, greeting) =>
            Right(greetings(name) = greeting)
    .create(port = 8080)

  sys.addShutdownHook(server.close())
end server

@main def client(who: String, newGreeting: String) =
  val baseUrl = "http://localhost:8080"

  val greetRequest = PartialRequest(e.greet, baseUrl)
    .prepare(who)

  val setGreetingRequest = PartialRequest(e.setGreeting, baseUrl)
    .prepare(who, newGreeting)

  either:
      val init = greetRequest.send().?
      setGreetingRequest.send().?
      val updated = greetRequest.send().?
      println(s"greeting for $who was: $init, now is: $updated")
end client
```

> It should be noted that the code above, while works, is optimised for demo-purposes, and is not production-ready. I would recommend for example to instead generate [tapir](https://tapir.softwaremill.com/en/latest/) endpoints (_help wanted!_), and let that do the heavy lifting for you.

## The need for ops-mirror

Now you have seen the end-result, naturally you may ask how do we get to this point?

In the example above `HttpService` is a typeclass that provides a `Route` schema for each method of `GreetService`.

```scala
trait HttpService[T]:
  val routes: Map[String, Route]
```

Each `Route` schema describes the metadata of an endpoint, such as the HTTP method, path, and the source of each parameter.

in the companion of `HttpService` we have the `derived` method as follows:

```scala
import mirrorops.OpsMirror

object HttpService:
  inline def derived[T](using OpsMirror.Of[T]): HttpService[T] = ???
```

With this signature, for any trait type `T`, a value of type `OpsMirror.Of[T]` will be synthesized, providing a data structure that reflects the metadata and signature of each method of `T`.

This is the information we want from `GreetService` in order to generate `routes`:

> `GreetService` is a trait where:
>
> - each method may error with `HttpError`
> - method `greet` returns `String`,
>   - with annotation `@get("/greet/{name}")`
>   - with param `name` of type `String`
>     - with annotation `@path`
> - method `setGreeting` returns `Unit`,
>   - with annotation `@post("/greet/{name}")`
>   - with param `name` of type `String`
>     - with annotation `@path`
>   - with param `greeting` of type `String`
>     - with annotation `@body`

The `OpsMirror` provides this information via type members:

```scala
val Mirror_GreetService: OpsMirror {
  type MirroredType = GreetService;
  type MirroredLabel = "GreetService";
  type MirroredOperationLabels = ("greet", "setGreeting");
  type MirroredOperations = (
    Operation {
      type InputLabels = ("name" *: EmptyTuple);
      type InputTypes = (String *: EmptyTuple);
      type InputMetadatas = (
        ((Meta @path) *: EmptyTuple) *: EmptyTuple
      );
      type ErrorType = HttpError;
      type OutputType = String;
      type Metadata = (
        (Meta @get("/greet/{name}")) *: EmptyTuple
      );
    },
    Operation {
      type InputLabels = ("name", "greeting");
      type InputTypes = (String, String);
      type InputMetadatas = (
        ((Meta @path) *: EmptyTuple),
        ((Meta @body) *: EmptyTuple)
      );
      type ErrorType = HttpError;
      type OutputType = Unit;
      type Metadata = (
        (Meta @post("/greet/{name}")) *: EmptyTuple
      );
    }
  );
} = summon[OpsMirror.Of[GreetService]]
```

Following the techniques shown in the [Scala 3 documentation](https://docs.scala-lang.org/scala3/reference/contextual/derivation-macro.html), you can use quotes and splices to extract whichever information you need. The implementation for `HttpService.derived` can be found [here](https://github.com/bishabosha/ops-mirror/blob/f65246115e54a514892123d6d951d41800d4f9da/examples/serverlib/ServerMacros.scala#L47-L92).

> Annotations are not themselves types, so to encode them at the type-level, the `Meta` type is used as a target placeholder, which helps to extract the annotation later.

## Type-safe endpoints using ops-mirror

The `HttpService` type class is type-erased, but to implement server logic, we need to provide functions with the correct types. This is where `Endpoint` comes in:

```scala
trait HttpService[T]:
  // the routes map has no per-route type information.
  val routes: Map[String, Route]
```

`Endpoints` wraps the `HttpService` type with [structural refinements](https://docs.scala-lang.org/scala3/reference/changed-features/structural-types.html) to give a more type-safe API:

```scala
val e: Endpoints[GreetService] {
  val greet: Endpoint[(String *: EmptyTuple), HttpError, String];
  val setGreeting: Endpoint[(String, String), HttpError, Unit]
} = HttpService.endpoints[GreetService]
```

The `HttpService.endpoints` method again uses the `OpsMirror` to extract the necessary information.

`Endpoint` itself is an opaque type wrapper of `Route`, i.e. it only adds static type information:

```scala
opaque type Endpoint[I <: Tuple, E, O] <: Route = Route
```

`I` is a tuple of argument types to the endpoint, `E` is possible error type of the endpoint, and `O` is the result type of the endpoint.

I won't go into details, but for the purpose of this article it is enough to state that both `Route` and `Endpoint` together contain a reification of all the metadata necessary for both `ServerBuilder` and `PartialRequest` to build upon.

## Other uses for ops-mirror

I think that the operation mirror is a general enough concept to take seriously. For example, it is also suitable for describing most RPC services, such as Language Server Protocol:

```scala
@error[ResponseError]
trait LSP derives JsonRpcService {

  @method("$/progress")
  def progress(params: ProgressParams): Unit

  @method("textDocument/completion")
  def completion(
    params: CompletionParams
  ): Array[CompletionItem]

  ...
}
```

The idea being that `JsonRpcService` would also use `OpsMirror` as a helper in its `derived` method.

## What about Effect tracking?

You might notice that all the examples so far have used no so-called "effect" types (such as `IO`, `Future`, etc.)

This is deliberate. The idea being that the endpoint description should only contain the necessary detail to model the inputs/outputs of the service. Other concerns, such as execution model, error handling model, and others should be delegated to interpreters.

e.g. in the HTTP example - the `ServerBuilder` provides an interpreter in direct-style via its `handle` extension method, which expects handlers as such:

- for `greet`, a function of type `String => Either[HttpError, String]`,
- for `setGreeting`, a function of type `(String, String) => Either[HttpError, Unit]`.

If instead you prefer a purely functional style, then perhaps you would use an alternative server builder, that is specialized to an effect type.

> Another choice is to drop effect-polymorphism, and instead extract a concrete effect type from the result of each method. This is the approach of [smithy4s-deriving](https://github.com/neandertech/smithy4s-deriving). Arguably this is more in alignment with the user's expectation - but makes interpretation less flexible.

## A Call to Action

At Scalar 2024 after my talk there was a lot of interest in this concept.

If you are interested in developing the idea for operation mirrors, I invite you to participate at [bishabosha/ops-mirror](https://github.com/bishabosha/ops-mirror) where we can develop more examples that push the boundaries of what is possible, discover the optimal API representation, and identify any shortcomings.

One big decision is how to represent the metadata, should annotations be kept as-is, or perhaps converted to a more simple type-level representation?

My view is that we should stay opinionated. e.g. the built-in `scala.deriving.Mirror` type-classes only work for a small subset of data structures. This makes them predicatable and overall a simpler programming model. So correspondingly I think a small subset of trait "shapes" should be supported, rather than a kitchen sink.

Let's find out together.
