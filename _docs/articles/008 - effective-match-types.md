---
layout: article
title: "Effective Match Types in Scala 3"
description: What are Scala 3 match types for and how do they work.
published: 28-Aug-2025
---

Scala 3 introduced [match types](https://www.scala-lang.org/api/3.7.2/docs/new-types/match-types.html), a powerful feature enabling to perform computations with types at compile time. How do they work, and what kinds of programs can you write with them?

> This post mirrors my talk from ScalaDays 2025. Explore code examples in the [demo repo](https://github.com/bishabosha/scaladays-2025). Also try out the [interactive demo](/match-type-simulator/).

## Expressive vs Safe (Pick Two)

There's a long-running debate in programming language design: can a language be both **expressive** and **safe**?

- **Expressive** being a vague term but meaning that code reads naturally and feels intuitive to write.
- **Safe** meaning that the language tries to prevent certain errors before program even runs.

The subject of runtime safety is a hot topic, for example:
- The U.S. government's [2024 ONCD report](https://bidenwhitehouse.archives.gov/oncd/briefing-room/2024/02/26/press-release-technical-report/) points out the real-world cost of memory safety bugs, and recommends to adopt a memory-safe programming language such as Rust.
- Jane Street's 2008 paper *Caml trading – experiences with functional programming on Wall Street* popularized the phrase *"make illegal states unrepresentable"* ([Minsky & Weeks, 2008](https://doi.org/10.1017/S095679680800676X)).
- Alexis King's 2019 blog post [*Parse, don't validate*](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) argued for pushing validation into the type system.

The common theme: **prevent runtime errors by lifting more information into types**.

But critics of static typing often complain about verbosity, or "fighting the typechecker." Meanwhile, dynamic languages like Ruby or Elixir feel wonderfully expressive, but fragile.

So where does Scala fit?

---

> Match type simulator is **better viewed wide** (click on {{icon fa-square-caret-down}} in sidebar to collapse it)

{{match-sim-embed S "?embed=true&tab=match-types&example=Last+Tuple+Element"}}
{{match-sim-embed 500px "?embed=true&tab=match-types&example=Element+Type&showDependentMethod=true&hideTimeline=true"}}

## Scala is Expressive and Safe

Scala's type system is unusually powerful. It lets us write APIs that *feel* dynamic, but are still statically checked.

**Match types** are one of the key tools that make this possible. They let us compute types from values, so we can design APIs that are both expressive and safe.

---

## Example 1: Type-Safe Routing

Let's compare a simple HTTP route in Ruby's Sinatra with a Scala version.

**Ruby (dynamic):**

```ruby
get '/hello/:name' do
  "Hello #{params['name']}!"
end
```

This is expressive, but not safe. The `params` dictionary is dynamic — if you mistype `"name"`, you'll only find out at runtime.

**Scala (with match types):**

```scala
http.get("/hello/:name").in:
  s"Hello ${params.name}!"
```

Here, the `params` object is **type-safe**. The compiler knows that `params` has a `name: String` field, because the route pattern `"/hello/:name"` is parsed at the type level. If you mistype `params.nam`, the compiler will catch it.

👉 In the [demo repo](https://github.com/bishabosha/scaladays-2025/blob/main/sinatra/sinatra-demo.scala), you can see how this works:
- The route string is captured as a **singleton type**.
- A **match type** (`ParamsOf`) parses the string and extracts parameter names.
- The result is a **structural type** like `(name: String)`.

This is a great example of how match types let you write APIs that are both expressive and safe.

---

## What Are Match Types?

A match type is like a type-level `match` expression:

```scala
type Elem[X] = X match
  case String   => Char
  case Array[t] => t
```

Here, `Elem[String]` reduces to `Char`, and `Elem[Array[Int]]` reduces to `Int`.

They're a way of **pattern matching on types** and producing new types. This makes them a natural fit for generic programming, type-level parsing, and enforcing invariants.

---

## Built-in Compile-Time Operations

Scala 3 comes with a set of **compile-time operations** implemented as match types:

```scala
import scala.compiletime.ops.int.*
import scala.compiletime.ops.string.*

val n: 23 match { case S[x] => x } = 22
val eq: (64 == 128) = false
val s: "sca" + "la" = "scala"
val sub: Substring["scala", 3, 5] = "la"
```

These are efficient, compiler-supported match types for numbers, strings, booleans, and tuples. They're the building blocks for more advanced type-level programming.

---

## Example 2: Refined Types

Another use case is **refined types** — types that enforce constraints at compile time.

From the repo:

```scala
infix opaque type Refined[A, F[_ <: A] <: Boolean] <: A = A

type Positive[A <: Int] <: Boolean = A match
  case S[?] => true
  case _    => false

val one: Int Refined Positive = 1
val small: String Refined MaxChars[8] = "123456789" // compile error
```

Here, `Positive` is a match type that checks whether an integer is greater than zero. If you try to assign a negative number, the compiler rejects it. Similarly, `MaxChars[8]` enforces a maximum string length.

This is a lightweight way to get the benefits of libraries like [refined](https://github.com/fthomas/refined), but with just a few lines of code.

---

## Example 3: Type-Safe Regex

Regexes are notoriously unsafe — you often get back an `Option[Match]` and have to remember which group is which. With match types, you can do better.

From the repo:

```scala
import regsafe.*

val rational = Regex("""(\d+)(?:\.(\d+))?""")

rational.unapply("3.1415").get ==> ("3",  Some("1415"))
rational.unapply("23").get     ==> ("23", None)
```

The type of `rational.unapply` is:

```scala
Option[(String, Option[String])]
```

That's inferred **statically** from the regex pattern. The compiler knows that the second group is optional, so you can't accidentally forget to handle it.

---

## Example 4: Database Queries (ScalaSQL)

In [ScalaSQL](https://github.com/com-lihaoyi/scalasql), match types are used to represent rows as structural records.

```scala
case class City(
  id: Int,
  name: String,
  countryCode: String,
  district: String,
  population: Long
)
object City extends SimpleTable[City]

val fewLargestCities: Seq[City] = db.run(
  City.select
      .sortBy(c => c.population).desc
      .drop(5).take(3)
)
```

Inside a query, `City` is represented as a `Record[City, Expr]`, where each field is wrapped in an `Expr`. For example:

```scala
c.population: Expr[Long]
c.name: Expr[String]
```

This is powered by a match type that maps over the fields of the case class, wrapping each one in `Expr`.

---

## Example 5: DataFrames

Finally, the repo shows a **DataFrame** API with structurally typed columns:

```scala
val stats = DataFrame
  .column((words = text.split("\\s+")))
  .withComputed(
    (lowerCase = fun(_.toLowerCase)(col.words))
  )
  .groupBy(col.lowerCase)
  .aggregate(
    group.key ++ (freq = group.size)
  )
  .sort(col.freq, descending = true)
```

The type of the resulting DataFrame is:

```scala
DataFrame[(lowerCase: String, freq: Int)]
```

That means the compiler knows exactly which columns exist after each transformation. No more runtime "column not found" errors.

---

## Tips and Pitfalls

Match types are powerful, but they come with some caveats:

1. **Dependent typing mode**: If your function's return type isn't directly a match type, the compiler may keep it abstract. Make sure your return type is shaped correctly.
2. **Unchecked patterns**: Due to type erasure, some runtime matches won't work. Use `inline match` to resolve them at compile time.
3. **Compiler stack space**: Large recursive match types (e.g. on 200-element tuples) can blow the compiler's stack. You may need to tune `-Xss`.

The [repo](https://github.com/bishabosha/scaladays-2025) has examples of these pitfalls and how to work around them.

---

## Conclusion

Match types are one of the most exciting features in Scala 3. They let us:

- Write APIs that feel as expressive as dynamic languages.
- Encode invariants in the type system.
- Push runtime checks into compile-time guarantees.

From type-safe routing, to refined types, to database queries and DataFrames, match types open up a whole new design space for Scala libraries.

If you want to dive deeper, check out the [ScalaDays 2025 demo repo](https://github.com/bishabosha/scaladays-2025), or explore libraries like [regsafe](https://github.com/nvilla/regsafe) and [ScalaSQL](https://github.com/com-lihaoyi/scalasql).
