---
layout: article
title: "Scala's New Named Tuples: why you should embrace structural types"
description: Explaining the motivation behind named tuples, how they work, their relationship to structural types, and their practical applications, along with their current limitations.
published: 14-Apr-2025
---

Scala 3.7 stabilises the Named Tuples proposal, giving users new syntax for structural types and values, and makes it simpler to do typelevel programming without macros. Read on for a summary of the key features and benefits of named tuples, and practical examples.

> This article is an abridged version of my talk ["Going Structural with Named Tuples"](https://youtu.be/Qeavi9M65Qw) from Scalar 2025. Please watch for more entertainment value (and even more information!) You can also view more of the examples in the GitHub repo [bishabosha/scalar-2025](https://github.com/bishabosha/scalar-2025).

## Motivation

So why is the feature being introduced?

**Named arguments in pattern matching**

If you are tired of long lists of wildcards when pattern matching on case classes, now you can choose exactly which fields to match on, and ignore the rest:

```scala
// Instead of: case Person(_, age, _, _) => ..., You can:
person match { case Person(age = a) => ... }
```

**Label multiple return values**

With named tuples, you can provide names to each value, where previously a tuple (with unclear meaning) would be used:

```scala
// Instead of: def partition(seq: Seq[T]): (Seq[T], Seq[T]), You can:
def partition(seq: Seq[T]): (matches: Seq[T], others: Seq[T])
```

**Address shortcoming of current structural typing**

Scala has had structural types since 2.6.0 (released in 2007), but named tuples make them easier to use without macros or casting.

**Why use structural types?**

*   **Avoid rigidity:** Only the fields matter, simplifying the usage of data, rather than planning a complex class hierarchy.
*   **Ad-hoc Types:** temporary values in a complex expression (such as method chaining) are well suited for structural types, avoiding the need for boilerplate code.
*   **Narrow Views:** Only track the fields you care about from larger data structures (e.g., JSON APIs) to reduce coupling.
*   **Composition:** Structural values can be combined, preserving the fields of both while preserving type safety.
*   **Schema based derivation:** Derive types from data to validate expressions, or make more flexible programs that compose easily.


**An overview of the status-quo for structural typing in Scala**

To summarise, structural types (opposed to nominal types) let you define types whose type equality is defined by their members (fields and methods) rather than the name of the type.

```scala
// Example: Structural Type
type Person = Record {
  val name: String
  val age: Int
}

def greet(p: Person): Unit = println(s"Hello, ${p.name}!")
```

Typically, you create a structural type by "refining" an arbitrary class like `Record` with some structural members, which don't necessarily correspond to a real existing field.

The idea is that a type could refine `Record` with **as many structural members as you want**, and as long as it has the `name` and `age` fields, it is a subtype of `Person`, which also known as "width subtyping".

**Non-determinism**

The main issue is that with this representation of structural types in Scala, there is no deterministic mapping between fields and their underlying representation in memory, meaning that names must be resolved dynamically at runtime.

To illustrate, here is an example of how to define a class capable of structural typing in scala:

```scala
class Record extends scala.Selectable:
  def selectDynamic(name: String): Any = ???
```

So for the `Person` type, accessing the `name` and `age` fields will delegate to the `selectDynamic` method of the `Record` class. The concrete structural refinements that could exist are completely opaque to the method, so there is not a way to optimise the representation, therefore often you must resort to a hashmap for storage, or use reflection for access if there are real fields.

Named Tuples will address some of these shortcomings, without the need for macros.

## Named Tuples Overview

As mentioned above, Named Tuples are coming in Scala 3.7.0 (after being proposed and refined in SIP-58).

**Syntax**

In definition and use site, they intentionally look like a case class constructor without the leading class name.

```scala
// Named Tuple Type Definition
type Person = (name: String, age: Int)

// Value Syntax
val person: Person = (name = "Alice", age = 30) // Or ("Alice", 30)

// Selecting Fields
assert(person.name == "Alice")
assert(person.age  == 30)
```

**Type Inference**

Types for Named Tuple literals are inferred, meaning that the fields only need to be named once. This is useful for creating "on the fly" object values, such as local variables that aggregate multiple values.

```scala
def makeAccumulator() =
  var acc = 0
  (
    add   = (x: Int) => acc += x,
    reset = () => acc = 0,
    get   = () => acc
  )

val acc = makeAccumulator()
//  acc: (
//    add   : Int => Unit,
//    reset : () => Unit,
//    get   : () => Int
//  )
```

**Pattern Matching**

Deconstruct named tuples by field names in any order, or even ignore fields.
```scala
person match
  case (name = n, age = a) => println(s"Name: $n, Age: $a")
  case (age = a, name = n) => println(s"Name: $n, Age: $a")
  case (name = n)          => println(s"Name: $n")
```

**Implementation**

Under the hood, named tuples are zero-cost wrappers around standard tuples. Their labels only exist at compile time, as illustrated by the following desugaring of the types:

```scala
// three equivalent types
type Person = (name: String, age: Int)
type Person = NamedTuple[("name", "age"), (String, Int)]
type Person = NamedTuple[("name" *: "age" *: EmptyTuple), (String *: Int *: EmptyTuple)]
```

The `NamedTuple` type is a pair of two tuple types: a tuple of labels, and a tuple representing the underlying type of the fields. `NamedTuple` itself is a zero-cost wrapper over its second argument.

With this formulation, named tuple types can be constructed programatically from first class types, without macros. (Conversely to construct a type refinement programatically you must use the [Quotes](https://www.scala-lang.org/api/3.6.4/scala/quoted/Quotes.html) reflection API.) This leads to a simpler design for API's that work with named tuples.

**Generic Operations**

Named tuples support zero-cost conversions to and from tuples, type class derivation (using `Mirror`), and structural operations such as concatenation (`++` operator) with compile-time checks for disjoint names. Finally you can convert a case class type to a named tuple type with equivalent fields:

```scala
// conversions to/from tuple
val alice: Person = ("Alice", 42).withNames[("name", "age")]
assert(alice(1) == alice.age)
summon[Mirror.Of[Person]].fromProduct(alice.toTuple)
```

```scala
// concatenation
val nameT = (name = "Alice")
val ageT  = (age  = 42)
val person: Person = nameT ++ ageT
person(0) == person.name
person(1) == person.age
```

```scala
// type operations: wrap each field
val optPerson: NamedTuple.Map[Person, Option] =
  (name = Some("Alice"), age = None)
```

```scala
// type operations: use case class as a schema
case class City(name: String, population: Int)

val Warsaw: NamedTuple.From[City] =
  (name = "Warsaw", population = 1_800_000)
```

**New and improved structural types**

Now programatic structural types can declare a `Fields` member type, which should be some concrete named tuple type:
```scala
class Expr[Schema] extends Selectable:
  type Fields = NamedTuple.Map[NamedTuple.From[Schema], Expr]
  def selectDynamic(name: String): Any = ???
```

The key improvement is that the definition of the `selectDynamic` method can inspect the `Fields` type, which means you can adjust the implementation based on the expected type, or enhance safety through further validation.

Named Tuples also improve the ergonomics of defining such a type, because the `NamedTuple.From` type (convert case class types to named tuples), and type-level operations such as `Map` make it easy to derive new types from an existing schema.

## Demos & Examples

> Check out the GitHub repository [bishabosha/scalar-2025](https://github.com/bishabosha/scalar-2025) to see and run the following demos.

In preparation for the talk, I wanted to push the boundaries of what's possible with named tuples, here is a short list of what I managed to achieve:

*   **JSON Conversion:** Dynamically generating JSON serializers and deserializers.
    ```scala
    // chatting with Ollama
    val r = sttp.client4.quick.quickRequest
      .post(uri"http://localhost:11434/api/chat")
      .body(
        upickle.default.write(
          (
            model = "gemma3:4b",
            messages = Seq(
              (
                role = "user",
                content = "write me a haiku about Scala"
              )
            ),
            stream = false,
          )
        )
      )
      .send()

    val msg =
      upickle.default.read[(message: (content: String))](r.body)
    println(msg.message.content)
    ```
*   **Chimney-like Transformations:** Converting between different versions of data structures (e.g., to add missing fields).
    ```scala
    // type conversions
    case class UserV1(name: String)
    case class UserV2(name: String, age: Option[Int])

    def convert(u1: UserV1): UserV2 =
      u1.asNamedTuple
        .withField((age = None))
        .as[UserV2]
    ```
*   **Data Frame Operations:** Performing type-safe data analysis operations (similar to Spark).
    ```scala
    val text = "The quick brown fox jumps over the lazy dog"
    val toLower = (_: String).toLowerCase
    val stats = DataFrame
      .column((words = text.split("\\s+")))
      .withComputed((lowerCase = fun(toLower)(col.words)))
      .groupBy(col.lowerCase)
      .agg(group.key ++ (freq = group.size))
      .sort(col.freq, descending = true)

    println(stats.show(Int.MaxValue))
    ```
*   **SQL Queries:** use a case class as a schema for structural selection of columns
    ```scala
    case class City(
       id: Int,
       name: String,
       countryCode: String,
       district: String,
       population: Long
    )
    object City extends Table[City]

    val allCities: Seq[City] = db.run(City.select)

    // Adding up population of all cities in Poland
    val citiesPop: Long = db.run:
      City.select
          .filter(c => c.countryCode === "POL")
          .map(c => c.population)
          .sum
    ```
*   **Full-Stack Web Application:** Building a CRUD application with type-safe endpoints and database interactions.
    ```scala
    type Note =
      (id: String, title: String, content: String)
    type CreateNote =
      (title: String, content: String)

    trait NoteService derives HttpService:
      @post("/api/notes")
      def createNote(@body body: CreateNote): Note

      @get("/api/notes")
      def getAllNotes(): Seq[Note]

      @delete("/api/notes/{id}")
      def deleteNote(@path id: String): Unit

    val schema =
      HttpService.endpoints[NoteService]

    val app = router(schema)

    def routes(db: DB): app.Routes = (
      createNote = p => db.run(
        Note.insert.values(p.body)
      ),
      getAllNotes = _ => db.run(
        Note.select
      ),
      deleteNote = p => db.run(
        Note.delete.filter(_.id == p.id)
      )
    )

    val server = app
      .handle(routes(LogBasedStore()))
      .listen(port = 8080)
    ```

> To get a broader overview and understanding, watch my talk ["Going Structural with Named Tuples"](https://youtu.be/Qeavi9M65Qw) from Scalar 2025. Again inspect and learn from the examples in the GitHub repo [bishabosha/scalar-2025](https://github.com/bishabosha/scalar-2025).
