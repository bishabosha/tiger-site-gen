---
layout: article
title: "Intro to Match Types in Scala 3"
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

The idea is that **static types help prevent runtime errors** by carrying around certain invariants in the code. For example, defensive null-checks become unnecessary if the value has a type that is not nullable.

Ok, so is there any problem with type systems? Critics often complain that type annotations are too verbose, and that type-checkers are too strict for the kind of code they want to write, leading to using escape hatches (such as unsafe casts). Such critics are often fans of dynamically typed languages, such as Ruby, Elixir or Clojure.

I want to argue here that **Scala 3's match types bring the expressiveness of a dynamic language, but with the safety of a static type system**.

---

## What are Match Types?

To illustrate, here is how to express an identity match type:

> Match type simulator may be better with a wider display (click on {{icon fa-square-caret-down}} in sidebar to collapse it)
{{match-sim-embed 275px "?embed=true&tab=match-types&example=Identity"}}

The `Id[T]` type is the simplest form of match type. By form, they look very similar to a pattern match on values,
except the pattern scrutinee is a type, and each case pattern and body are types.

Try to run the simulation with various Scala types as arguments (e.g. `String`, `List[Int]`, etc.) Observe that whatever argument you pass to the match type, the result type is the same as the argument type, which makes sense as the only pattern `case T => T` is to match directly on the scrutinee itself.

---
##### Subtype Checking

The match type reducer works by checking if the scrutinee type (`T`) is a subtype of any of the pattern cases. If it is, then the case will match, and any wildcard type arguments will be instantiated before reducing to the right-hand side of the case.

{{match-sim-embed 330px "?embed=true&tab=match-types&example=Tuple+Unpack"}}

In the example above, the `Tag[x]` and `Tag[y]` patterns will match both `ITag.type` and `STag.type` because they are both subtypes of the `Tag` class, and in the bindings you will see that the type argument `x` is instantiated to `Int` for `ITag.type` and `y` to `String` for `STag.type`.

---
##### Disjointness Checking

Ok, how about multiple patterns? The match type reducer attempts to check the scrutinee type against each pattern case **in sequence**. If the first pattern is **not** a subtype of the scrutinee, then the reducer will check the next pattern, and so on.

{{match-sim-embed 335px "?embed=true&tab=match-types&custom=true&name=Custom%20Match%20Type&invocation=Elem%5BFuture%5BInt%5D%5D&cases=case%20String%20%3D%3E%20Char%0Acase%20Seq%5Bx%5D%20%3D%3E%20x%0Acase%20Option%5Bx%5D%20%3D%3E%20x&th=86e712d2&showDisjointnessSteps=true"}}

Working through the `Elem[Future[Int]]` example:
1. First check that `Future[Int]` is a subtype of `String`.
2. This fails, so the type checker will try to move on to the next pattern. However it must first check that it is safe to do so by checking for **"provable disjointness"** between the pattern and the scrutinee type.
3.  `Future[Int]` is definitely disjoint from `String` because `String` is a final class, therefore there is no risk that some possible instantiation of `Future[Int]` is also a `String`.
4. Check that `Future[Int]` is a subtype of `Seq[x]`.
5. This fails, so check that `Future[Int]` is **provably disjoint** from `Seq[x]`.
6. Disjointness check fails => stop reduction.

Disjointness ensures that even though the pattern does not match, there could be **no chance** that a value of the same static type as the scrutinee has a more precise dynamic type that would actually match the pattern.

Why is `Future[Int]` not disjoint from `Seq[x]`? because both `Future` and `Seq` are traits, meaning that there could be a hypothetical class `FutureSeq[T]` that extends both `Future` and `Seq` 🤯.

> Hint: try `Elem[List[Int]]` or `Elem[Some[String]]` and observe how it changes the behavior.

---
##### Dependent Methods

Why is the disjointness check important? It's because when a match type is used as the result type of a method, the typechecker uses a special dependent-typing mode, for example:

{{match-sim-embed 350px "?embed=true&tab=match-types&custom=true&name=Custom%20Match%20Type&invocation=Elem%5BFuture%5BInt%5D%5D&cases=case%20String%20%3D%3E%20Char%0Acase%20Seq%5Bx%5D%20%3D%3E%20x%0Acase%20Option%5Bx%5D%20%3D%3E%20x&th=86e712d2&showDependentMethod=true&hideTimeline=true"}}

The rule for this mode is so rigid that the method can be mechanically generated from the match type's definition (try interacting with the pattern cases and see yourself 🤓).

The method must take the shape of a pattern match, where each case is a **typed pattern** (i.e. where each pattern is identical to the corresponding pattern in the match type).

What is special is that within the body of a case, the typechecker expects the same type as the corresponding pattern in the match type.

In order for dependent methods to be sound, match types must reduce in a way that is **consistent with the runtime type checking**.

Therefore if you consider the method `elem`, if the parameter `t` is some value of a hypothetical class `FutureSeq[T]` extending both `Future` and `Seq`, then it would match the `Seq` case.

For this exact reason, match types are conservative, and if disjointness can not be proved, the match type remains unreduced. (This is not always an error, only if the use site requires a more precise type).

---

##### More Disjointness Examples

{{match-sim-embed 205px "?embed=true&tab=disjointness&example=Abstract+Type+vs+Concrete"}}
{{match-sim-embed 220px "?embed=true&tab=disjointness&example=Two+Traits"}}
{{match-sim-embed 240px "?embed=true&tab=disjointness&example=Trait+vs+Class"}}
{{match-sim-embed 220px "?embed=true&tab=disjointness&example=Trait+vs+Final+Class"}}
{{match-sim-embed 210px "?embed=true&tab=disjointness&example=Trait+vs+Object"}}

---

##### Recursive Match Types

A last demonstration of the capabilities of match types is the ability to express recursive types.
With recursion, you can compute true algorithms over types. For example, we can compute the last element of a tuple:

{{match-sim-embed 360px "?embed=true&tab=match-types&example=Last+Tuple+Element"}}

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

## What Are Match Types? (old)

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
