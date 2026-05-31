```sc
(
  layout = "article",
  title = "Making ScalaSql boring again (with interesting new internals)",
  description = "Explaining the motivation for the new SimpleTable feature for the ScalaSql library.",
  published = "31-May-2025"
)
```
---
This blog post summarises why I contributed [SimpleTable](https://github.com/com-lihaoyi/scalasql/pull/81) to the ScalaSql library, which reduces boilerplate by pushing some complexity into the implementation. (For the impatient: case class definitions for tables no longer require higher kinded type parameters, thanks to the new named tuples feature in Scala 3.7.)

## Status Quo

[ScalaSql](https://github.com/com-lihaoyi/scalasql) is one of the newer query libraries for Scala (first public release January 2024). Its design prioritizes ease of use and simple internals (think "boring") over performance. I think it does two things particularly well:
- Type safe queries that look like Scala collections operations, but map 1:1 with the specific SQL dialect in use. (i.e. every method call corresponds to a specific SQL fragment, and some dialects have exclusive operations)
- Using a single data structure as the schema for both table queries and also returning results.

Here is some typical code you might have written in prior versions of ScalaSql, taken from the README:

```scala
import scalasql.H2Dialect.*
import scalasql.*

case class City[T[_]](
    id: T[Int],
    name: T[String],
    countryCode: T[String],
    district: T[String],
    population: T[Long]
)
object City extends Table[City]

type Id[T] = T
def results(db: DbApi): Seq[City[Id]] =
  db.run(
    City.select
        .sortBy(c => c.population).desc
        .drop(5).take(3)
  )
```
Now the cool part, wearing my Scala geek hat, is that the `City` class is reused within the query (`c` is of type `City[scalasql.Expr]`), and after returning from `db.run` (no wrapping in this case). It's also nice that this code compiles in both Scala 3 and 2.13.

The problem, wearing my end-user hat, is that `T[_]` for every field is a lot of boilerplate to write (ignoring LLM enhanced workflows), and also might be awkward to explain such a type parameter to a programming newbie, or perhaps even an experienced Java developer ("actually it's just higher-kinded data 🤡!")

## Introducing SimpleTable

So to address the above problem, the key contribution in ScalaSql 0.1.20 is
an optional maven package `com.lihaoyi::scalasql-namedtuples`, providing the `SimpleTable` class, which the companion object should extend. Now the `T[_]` parameter can be removed:

```diff
 import scalasql.H2Dialect.*
-import scalasql.*
+import scalasql.simple.{*, given}

-case class City[T[_]](
-    id: T[Int],
-    name: T[String],
-    countryCode: T[String],
-    district: T[String],
-    population: T[Long]
-)
-object City extends Table[City]
+case class City(
+    id: Int,
+    name: String,
+    countryCode: String,
+    district: String,
+    population: Long
+)
+object City extends SimpleTable[City]
```

You would also need to delete type arguments to table types wherever they appear.

The update also comes with support for returning named tuples from queries, so the complete example is as follows:

```scala
//> using dep com.lihaoyi::scalasql-namedtuples:0.1.20
import scalasql.H2Dialect.*
import scalasql.simple.{*, given}

case class City(
    id: Int,
    name: String,
    countryCode: String,
    district: String,
    population: Long
)
object City extends SimpleTable[City]

def results(db: DbApi): Seq[(city: City, pop: Long)] =
  db.run(
    City.select
        .sortBy(c => c.population).desc
        .drop(5).take(3)
        .map(c => (city = c, pop = c.population))
  )
```

So that's it? The code is more boring now? No more cool higher-kinded data? Yes it's better this way (depending on taste of course)

> If you're disappointed, or want to scratch an itch, then head to the [design](#development-and-design) section to see the implementation based on structural types and named tuples.

So what else has changed? Within queries the `City` class is no longer used. Instead a new `Record` class handles wrapping the fields of `City`. For example hover on `c` in the `sortBy(c => ...)` operation within an IDE, and observe that it has the type `Record[City, Expr]`. Similarly, if you use an IDE to look for completions on `c`, you would see fields `id: Expr[Int]`, `name: Expr[String]`, etc.

> Where do these fields come from? `Record[C, T]` is a type safe [structural type](https://www.scala-lang.org/api/3.7.0/docs/docs/reference/other-new-features/named-tuples.html#computed-field-names-1). It has a `Fields` member type that is a named tuple, determining the structural fields that are visible. `Fields` is derived from the `C` type parameter with `NamedTuple.From[C]`, making it 1:1 with the class definition and doesnt need macros to create.

For the most part, ScalaSql works mostly through type inference, so users migrating to `SimpleTable` shouldn't need to write these record types explicitly.

Overall I think it is an easier experience to be the consumer of a well-known type that happens to have a higher kinded argument, than to define one yourself. (i.e. it soon becomes a mnemonic that `Record[City, Expr]` means a record with the fields of `City` wrapped in `Expr`).

I invite you to please try out the new `SimpleTable` and named tuple queryable features. Otherwise, read on to learn a bit more about the internals supported by new capabilities provided by the named tuples feature in Scala 3.7.

## Development and Design

In May 2024, a couple of months after ScalaSql debuted, the [named tuples](https://www.scala-lang.org/news/3.7.0/#sip-58-named-tuples) proposal introduced a dedicated compiletime intrinsic to aid with query DSLs: the `NamedTuple.From[C]` type, which converts a case class type `C` into a named tuple with the same fields.

This type is very powerful, because combined with [match types](https://scala-lang.org/files/archive/spec/3.4/03-types.html#match-types) you can further transform the fields of a named tuple type, itself derived from a user defined case class, for example to wrap with `scalasql.Expr`.

I proposed in my [last post](https://bishabosha.github.io/articles/named-tuples.html)
and at [Scalar 2025](https://youtu.be/Qeavi9M65Qw) that the ScalaSql library could and should drop the `T[_]` parameter, using this feature (combined with [programmatic structural types](https://www.scala-lang.org/api/3.7.0/docs/docs/reference/other-new-features/named-tuples.html#computed-field-names-1)). Li Haoyi, the original author of the library, challenged me to actually try if it was possible.

In the end I managed to deliver a feature entirely self-contained and without changing the core ScalaSql library, with some small compromises.

I was determined to avoid complex internals so I restricted any metaprogramming purely to type-directed derivation with `inline`, match types, implicit search, and `scala.compiletime` intrinsics; avoiding the use of any macros (i.e. no quotes, splices, or quoted reflection API).

`SimpleTable[C]` itself extends `Table`, so fits in directly with the existing infrastructure. It needed to provide a type argument compatible with `Table`'s `V[_[_]]` (i.e. typically a higher kinded case class.) This type parameter is used in three ways:
`V[Column]` for insert/update queries, `V[Expr]` for select and delete queries, and `V[Id]` (aka the class `C` itself) for returning rows.

This is the final design:

```scala
class SimpleTable[C](
    using name: sourcecode.Name,
    metadata0: Table.Metadata[[T[_]] =>> SimpleTable.MapOver[C, T]]
) extends Table[[T[_]] =>> SimpleTable.MapOver[C, T]](using name, metadata0)
```

and `MapOver` is itself a match type that checks if `T[_]` is the identity type, in which case return `C` itself, or something that needs to wrap the fields of `C` in which case return `Record[C, T]`.

```scala
object SimpleTable {
  type MapOver[C, T[_]] = T[Internal.Tombstone.type] match {
    case Internal.Tombstone.type => C // T is `Sc`
    case _ => Record[C, T]
  }
}
```

(`Tombstone` is used here to try and introduce a unique type that would never be used for any other purpose, i.e. be disjoint in the eyes of the match type resolver - also so we can convince ourselves that if `T` returns `Tombstone` it is probably the identity and not some accidental collision.)

So now the design of `Record`:
- it should have performance characteristics similar to field selection on a class,
- has to support wrapping fields in an arbitrary type `T[_]`,
- has to support the use case of nested case classes, in which case the field should be exploded into another record.

Concretely, `Record` is a wrapper of an array, with a phantom `C` type parameter representing the case class it derives from, extending `scala.Selectable` with a `Fields` type that can map `T[_]` over the fields. Its `selectDynamic` method is inline, reducing to a random access on an array.

So here is the small compromise - The definition of the nestable class has to opt-in by extending `SimpleTable.Nested`, so the `Fields` match type has a marker to know when to explode the fields again.

```scala
object SimpleTable {

  // needs to be a class so the match type reducer can "prove disjoint" to various other types.
  abstract class Nested

  final class Record[C, T[_]](private val data: IArray[AnyRef]) extends Selectable:
    /**
     * For each field `x: X` of class `C` there exists a field `x` in this record of type
     * `Record[X, T]` if `X` is a case class that represents a table, or `T[X]` otherwise.
     */
    type Fields = NamedTuple.Map[
      NamedTuple.From[C],
      [X] =>> X match {
        case SimpleTable.Nested => Record[X, T]
        case _ => T[X]
      }
    ]

    def apply(i: Int): AnyRef = data(i)

    inline def selectDynamic(name: String): AnyRef =
      apply(
        compiletime.constValue[
          Record.IndexOf[
            name.type,
            Record.Names[C], 0
          ]
        ]
      )
  }
}
```

There is so much more to talk about, such as the various other designs explored, or even the techniques used in the `Table.Metadata` inline derivation.

I have expanded upon these threads in [the pull request](https://github.com/com-lihaoyi/scalasql/pull/81) adding this feature so I suggest you look there. Perhaps I will write more on the subject.

Once again please try out the new `SimpleTable` and named tuple queryable features.
