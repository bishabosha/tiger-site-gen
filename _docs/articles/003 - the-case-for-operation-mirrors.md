---
layout: article
title: The case for type class derivation of services
published: 23-Mar-2024
---

Recently I spoke at [Scalar 2024](https://scalar-conf.com) conference in Warsaw about type class derivation, why it should be used with services as well as data, and a new kind of Mirror in Scala to support that.

> All the code and demos in this article can be found at [bishabosha/ops-mirror](https://github.com/bishabosha/ops-mirror), and also you can see the slides for my talk ["Mirrors for operations, not data"](https://speakerdeck.com/bishabosha/mirrors-for-operations-not-data-3e9bd880-ef29-4937-ba17-d96a27bafba0).

## A motivating example

It can be hard to keep track of API changes in web services, and to ensure that servers and clients don't fall out of sync.

In practice, to solve this issue, Scala developers have taken to modelling HTTP endpoints as pure data (see Tapir, endpoints4s, zio-http).
Other solutions use code generation, such as Smithy.
The important part is that a single source of truth allows static validation that your servers, clients, and static documentation are in sync, because they will all be checked against it.

I think using a pure data model is great, but I think the way to create that model idiomatically should be through [type class derivation](https://docs.scala-lang.org/scala3/reference/contextual/derivation.html). Imagine (or not, [try it out](https://github.com/bishabosha/ops-mirror/blob/main/examples/GreetService.scala)) the following, simple, definition of a service to set custom user greetings:

```scala
@fail[HttpError]
trait GreetService derives HttpService:
  @get("/greet/{name}")
  def greet(@path name: String): String

  @post("/greet/{name}")
  def setGreeting(@path name: String, @body greeting: String): Unit
```

It looks highly readable, and should be familiar to a beginner ("oh endpoints are like methods!").
Here is what a like to define server handlers and create a simple client:

```scala
@main def server =
  val e = HttpService.endpoints[GreetService]

  val greetings = concurrent.TrieMap.empty[String, String]

  ServerBuilder()
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
  val e = HttpService.endpoints[GreetService]
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
```

## A type class for HTTP services

The `HttpService` type class is going to be a holder for the pure data model:

```scala
trait HttpService[T]:
  val routes: Map[String, Route]
```

What is a `Route`? it holds metadata for a route, such as the URI template, and a description of the parts of the request.

We also have endpoints, which reify the `routes` map as static types that can be statically selected:

```scala
val e: Endpoints {
  val greet: Endpoint[(String *: EmptyTuple), HttpError, String];
  val setGreeting: Endpoint[(String, String), HttpError, Unit]
} = HttpService.endpoints[GreetService]
```

`Endpoint` itself is an opaque type wrapper of `Route`, i.e. it only adds static type information:

```scala
opaque type Endpoint[I <: Tuple, E, O] <: Route = Route
```

I won't go into details, but for the purpose of this article it is enough to state that both `Route` and `Endpoint` together contain a reification of all the metadata necessary for both `ServerBuilder` and `PartialRequest` to build upon.

## Proposal for a new kind of Mirror

But how do we create these data structures from `GreetService`?

We need to inspect the trait, and its methods, for any metadata useful for describing endpoints. This is the information we want to extract:

> `GreetService` is a trait where:
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

I hope you can see that this information is enough to describe each endpoint.

Extracting this information is possible using the built-in reflection API's of Scala 3, but it is tedious and error-prone. So I propose to provide this automatically in a data structure (Call it an operation mirror).

Here is how it would look for `GreetService`:

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

i.e. a single value, with type refinements that encode all the necessary details about `GreetService` that we described above.

!!! info "You may notice some strange syntax"
`Meta @foo`: it is not possible for a type to be a standalone annotation, so the throwaway type `Meta` acts as a target for the annotation `@foo`.

## Deriving the HttpService

Coming back to the original thesis, the goal was to use the type class derivation mechanism to compute `HttpService`, (and the underlying `Route` metadata) for `GreetService` exactly once.

Following the documentation for [type class derivation with macros](https://docs.scala-lang.org/scala3/reference/contextual/derivation-macro.html), we will need to implement the `derived` function in the companion object, and here I would propose to use `OpsMirror` as a contextual argument:

```scala
object HttpService:
  inline def derived[T](using OpsMirror.Of[T]): HttpService[T]
```

being an `inline` method, you can extract all the type refinements such as `MirroredOperations` at compile time, and use them to derive code as described in the linked documentation.

Then to get the endpoints, we can reuse the base `HttpService` that has already been derived, and also requesting again the `OpsMirror` to access the static types:

```scala
object HttpService:
  ...
  transparent inline def endpoints[T](using HttpService[T], OpsMirror.Of[T]): Endpoints
```

Notice that we use `transparent inline`, which will allow us to refine the result at call-site, as shown above.

To see the code that does this, [look at ServerMacros.scala](https://github.com/bishabosha/ops-mirror/blob/main/examples/serverlib/ServerMacros.scala).

## Other examples

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

## A Call to Action

At Scalar conference after the talk there was a lot of interest in this concept.

If you are interested in developing the idea for operation mirrors, I invite you to participate at [bishabosha/ops-mirror](https://github.com/bishabosha/ops-mirror) where we can develop more examples that push the boundaries of what is possible, discover the optimal API representation, and identify any shortcomings.

My aim overall would be to publish a small prototype, then propose possibly for inclusion in the language itself.

My view is that we should stay opinionated. e.g. the built-in `scala.deriving.Mirror` type-classes only work for a small subset of data structures. This makes them predicatable and overall a simpler programming model.

So correspondingly I think a small subset of trait "shaped" should be supported, rather than a kitchen sink.

Let's find out together.
