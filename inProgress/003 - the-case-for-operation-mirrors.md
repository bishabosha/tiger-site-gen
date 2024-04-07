---
layout: article
title: PART 2: The case for type class derivation for services
published: 23-Mar-2024
---

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
>
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
