```sc
(
  layout = "article",
  title = "Understanding Match Types in Scala 3",
  description = "What are Scala 3 match types for and how do they work.",
  published = "30-Aug-2025"
)
```
---
Scala 3 introduced [match types](https://www.scala-lang.org/api/3.7.2/docs/new-types/match-types.html), a powerful feature enabling to perform computations with types at compile time, a technique known as type-level programming. This post gives an overview of how they work, and what kinds of use cases they can be applied to.

> This post mirrors my talk from ScalaDays 2025. Explore code examples in the [demo repo](https://github.com/bishabosha/scaladays-2025). Also try out the [interactive demo](/match-type-simulator/).

## What are Match Types?

A match type allows you to compare a type to various patterns and produce a result type based on the matching pattern.

Here is the syntax: `T match { case P[x] => U }`, where `T` is the scrutinee type, `P[x]` is a pattern with a type parameter `x`, and `U` is the result type.

You can use a match type on the right-hand side of a type alias, or type lambda, making them like a function at the type level.

Let's begin with the identity match type: `type Id[T] = T match { case T => T }`:

{{match-sim-embed 275px "?embed=true&tab=match-types&example=Identity"}}

Try to run the simulation with various Scala types as arguments (e.g. `String`, `List[Int]`, etc.)

> To assist with my presentation at ScalaDays 2025, I developed a [match type simulator](/match-type-simulator/) to explain the rules of match types in a visual way, which you see above.

Observe that whatever argument you pass to the match type, the result type is the same as the argument type, which makes sense as the only pattern `case T => T` is to match directly on the scrutinee itself.

---

## Example Use Cases

There are a lot more examples in my [slides](https://speakerdeck.com/bishabosha/effective-match-types-scala-days-2025), but I will just highlight three use cases that demonstrate different domains of expressive power.

### Type-Safe Routing

If you didn't already know, literal values in Scala such as strings, numbers and booleans have an equivalent literal type. So for example: a literal string value representing a HTTP route can be lifted to a type, and computed on by match type to compute a typed dictionary of parameters.

```scala
http get "/hello/:name" in:
  s"Hello ${params.name}!"
http get "/posts/?:title&:author" in:
  search(title = params.title, author = params.author)
```

> Check out the full example in the [demo repo](https://github.com/bishabosha/scaladays-2025/blob/main/sinatra/sinatra-demo.scala).

So above behind the scenes there is a match type that converts `"/hello/:name"` to the structural type `(name: String)`, and `"/posts/?:title&:author"` to `(title: Seq[String], author: Seq[String])`. The structural type is then used as the type of `params`, providing type safety because retrieved parameters can not be misspelled.

### Refined types

```scala
val one: Int Refined AtLeast[0] = 1 // ok
val fail: String Refined MaxChars[8] = "123456789" // error
```

> Check out the full example in the [demo repo](https://github.com/bishabosha/scaladays-2025/blob/main/refined-types/refined-demo.scala).

The `Refined` type provides an implicit conversion for literal values, if it can prove that a match type predicate such as `AtLeast[0]` reduces to the the literal type `true` when applied to the literal type of the argument (e.g. `1`). This is useful for example to require constant strings that have a length limit.

### Lenses for Form Data

```scala
case class Form(name: String, city: String)

val formVar = VarLenses(Form("", ""))

def cityField = p(
  label("City: "),
  input(
    placeholder("Lausanne"),
    controlled(
      value <-- formVar.city.view,
      onInput.mapToValue --> formVar.city.updater
    )
  )
)
```

> Check out the full example in the [demo repo](https://github.com/bishabosha/scaladays-2025/blob/main/laminar-form/demo.scala).

For use with [Laminar](https://laminar.dev),
the `VarLenses` class reads the structure of any case class (using `NamedTuple.From` to convert to a structural type), and then a match type converts the type of each field to a pair of `view` and `updater`. This is useful because multiple reactive fields can be controlled from a single place.

---

## The Rules

### Subtype Checking

The match type reducer works by checking if the scrutinee type (`T`) is a subtype of any of the pattern cases. If it is, then the case will match, and any wildcard type arguments will be instantiated before reducing to the right-hand side of the case.

{{match-sim-embed 330px "?embed=true&tab=match-types&example=Tuple+Unpack"}}

In the example above, the `Tag[x]` and `Tag[y]` patterns will match both `ITag.type` and `STag.type` because they are both subtypes of the `Tag` class, and in the bindings you will see that the type argument `x` is instantiated to `Int` for `ITag.type` and `y` to `String` for `STag.type`.

---
### Disjointness Checking

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
### Dependent Methods

Why is the disjointness check important? It's because when a match type is used as the result type of a method, the typechecker uses a special dependent-typing mode, for example:

{{match-sim-embed 350px "?embed=true&tab=match-types&custom=true&name=Custom%20Match%20Type&invocation=Elem%5BFuture%5BInt%5D%5D&cases=case%20String%20%3D%3E%20Char%0Acase%20Seq%5Bx%5D%20%3D%3E%20x%0Acase%20Option%5Bx%5D%20%3D%3E%20x&th=86e712d2&showDependentMethod=true&hideTimeline=true"}}

The rule for this mode is so rigid that the method can be mechanically generated from the match type's definition (try interacting with the pattern cases and see yourself 🤓).

The method must take the shape of a pattern match, where each case is a **typed pattern** (i.e. where each pattern is identical to the corresponding pattern in the match type).

What is special is that within the body of a case, the typechecker expects the same type as the body of the corresponding case in the match type.

In order for dependent methods to be sound, match types must reduce in a way that is **consistent with the runtime type checking**.

Therefore if you consider the method `elem`, if the parameter `t` is some value of a hypothetical class `FutureSeq[T]` extending both `Future` and `Seq`, then it would match the `Seq` case.

For this exact reason, match types are conservative, and if disjointness can not be proved, the match type remains unreduced. (This is not always an error, only if the use site requires a more precise type).

---

### More Disjointness Examples

According to the [Scala 3 language specification](https://scala-lang.org/files/archive/spec/3.4/03-types.html#match-types), provable disjointness can be intuitively understood by knowing the following properties of Scala's type system:

> - Single inheritance of classes
> - Final classes cannot be extended
> - Sealed traits have a known set of direct children
> - Constant types with distinct values are nonintersecting
> - Singleton paths to distinct enum case values are nonintersecting

Here are some examples that demonstrate these properties:

> Hint: try changing the types in any of the examples.

{{match-sim-embed 180px "?embed=true&tab=disjointness&example=Abstract+Type+vs+Concrete"}}
{{match-sim-embed 200px "?embed=true&tab=disjointness&example=Two+Traits"}}
{{match-sim-embed 215px "?embed=true&tab=disjointness&example=Trait+vs+Class"}}
{{match-sim-embed 200px "?embed=true&tab=disjointness&example=Trait+vs+Final+Class"}}
{{match-sim-embed 180px "?embed=true&tab=disjointness&example=Trait+vs+Object"}}
{{match-sim-embed 200px "?embed=true&tab=disjointness&example=Sealed+Trait+vs+Class"}}
{{match-sim-embed 180px "?embed=true&tab=disjointness&example=Two+Unrelated+Classes"}}

> Hint: try changing the types in any of the examples above.

---

### Recursive Match Types

A last demonstration of the capabilities of match types is the ability to express recursive types.
With recursion, you can compute true algorithms over types. For example, we can compute the last element of a tuple:

{{match-sim-embed 360px "?embed=true&tab=match-types&example=Last+Tuple+Element"}}

Recursion is the key to most useful match types - for example it is used in the [Type Safe Routing](#type-safe-routing) example to traverse each character of a path string.

---

## Built-in Compile-Time Operations

Scala 3 comes with a set intrinsic match types known as **compile-time operations**, living in the `scala.compiletime.ops` package.

```scala
import scala.compiletime.ops.any.*
import scala.compiletime.ops.string.*
import scala.compiletime.ops.int.*
import scala.compiletime.ops.boolean.*

(23 match {case S[n] => n}) =:= 22
(64 == 128)                 =:= false
("sca" + "la")              =:= "scala"
Substring["scala", 3, 5]    =:= "la"
CharAt["scala", 1]          =:= 'c'
Length["scala"]             =:= 5
```

These are particularly efficient for implementing match types that compute over **literal types**,
with operations for:
- Numerics
- Bit Manipulation
- Boolean logic
- String parsing
- Equality checking

To use these in a match type, typically you would call one as the scrutinee of a match type, and match on the result. The following snippet is taken from the [Type Safe Routing](#type-safe-routing) example:

```scala
type SearchChar[
    C <: Char,
    Str <: String,
    Idx <: Int
] <: Option[Int] =
  (Length[Str] == Idx) match
    case true  =>
      None.type
    case false =>
      (CharAt[Str, Idx] == C) match
        case true => Some[Idx]
        case false => SearchChar[C, Str, S[Idx]]

// usage: search for ':' in "/hello/:user"
SearchChar[':', "/hello/:user", 0] =:= Some[7]
// usage: search for '?' in "/hello/:user"
SearchChar['?', "/hello/:user", 0] =:= None.type
```

---

Also particularly useful is the `NamedTuple.From` intrinsic type, which converts a case class type into a named tuple type:

```scala
case class Person(name: String, age: Int)

NamedTuple.From[Person] =:= (name: String, age: Int)
```

These can be further modified with tuple match types from the standard library, such as `NamedTuple.Map`.

---

## Summary and Remarks

I hope this article was useful for you to get a better understanding for how match types work in Scala 3.

Again you can look at the demo repository [here](https://github.com/bishabosha/scaladays-2025), which contains full examples of match types, and also a benchmark comparing the performance with implicits.
