---
layout: article
title: Enhanced Simple Parsing for Scala
description: Describes a new string interpolator for Scala that can be used for simple parsing of structured data.
published: 01-Feb-2024
---

I developed a new String interpolator for Advent of Code to help with parsing - it turns out that I didn't need anything else for solving all this years problems.

## An Example Problem

[Advent of Code](https://www.adventofcode.com) is a yearly challenge, giving a small programming puzzle each day through December. Typically you need to read some text input into a suitable data structure for processing. The twist being that each day has some brand new unique format (not anything typical such as CSV, JSON, etc).

Take this example, similar to Day 2 of 2023:

```text
Game 1: 1 gold, 2 pink, 6 aqua; 9 aqua, 5 gold; 2 pink
Game 2: 1 aqua, 2 pink; 1 pink, 1 aqua; 9 pink, 5 aqua, 1 gold
Game 3: 5 aqua, 5 gold, 21 pink; 8 pink, 6 aqua, 22 gold; 5 pink, 1 gold
```

What you can see is that each row is quite regular, following the following format:

```text
Game %d: %{%{%d %s}...(, )}...(; )
```

i.e. each row starts with `"Game %d: "`, where `%d` is a placeholder for an integer,
followed by a sequence of substrings. Each substring is separated by `"; "`, e.g. for Game 1 we have the sequence `"1 gold, 2 pink, 6 aqua"`, `"9 aqua, 5 gold"`, `"2 pink"`.

Each substring, such as `"9 aqua, 5 gold"` is described by the nested format string:

```text
%{%d %s}...(, )
```

i.e. another sequence of substrings, each separated by `", "`, e.g. `"9 aqua"`, `"5 gold"`. Each of those nested substrings, such as `"9 aqua"`, is then described by the format

```text
%d %s
```
where again `%d` is an integer (e.g. `9`) and `%s` is an arbitrary string (e.g. `"aqua"`).

## Parsing it with Scala

The reason why I used such a specific format to describe the text input, is that I made my own String interpolator that understands the same format. It's called `r`, and is based on the existing `s` pattern interpolator, (see implementation [here](https://index.scala-lang.org/bishabosha/enhanced-string-interpolator)).

I gave it enhancements so that you can to apply a format to each globbed element, and extract a typed value matching that format.
It can even match sequences of strings (arbitrarily nested) that share the same format.

### Show me the use case!

Using `r`, one line of input from the above problem can be parsed with the following snippet of code:

```scala
val r"Game $id%d: ${r"${r"$countss%d $namess"}...(, )"}...(; )" = line
```

Let's break down what's happening here:

if we assume `line` is the String

```text
Game 1: 1 gold, 2 pink, 6 aqua; 9 aqua, 5 gold; 2 pink
```

then we will be left with the following extracted values:

```scala
val id: Int = 1
val countss: Seq[Seq[Int]] = Seq(Seq(1, 2, 6), Seq(9, 5), Seq(2))
val namess: Seq[Seq[String]] = Seq(Seq("gold", "pink", "aqua"), Seq("aqua", "gold"), Seq("pink"))
```

Now we should probably pack these into a sensible data structure, e.g.

```scala
case class Game(id: Int, hands: Seq[Seq[(Int, String)]])

Game(id, countss.zip(namess).map(_.zip(_)))

// Game(1,Seq(Seq((1,gold), (2,pink), (6,aqua)), Seq((9,aqua), (5,gold)), Seq((2,pink))))
```

This is the structure I used to finish [solving Day 2](https://github.com/bishabosha/advent-of-code-2023/blob/main/2023-day02.scala).

**Bonus round**

In fact, instead of parsing line by line, the whole input can be captured in a single extractor:

```scala
val r"${r"Game $ids%d: ${r"${r"$countsss%d $namesss"}...(, )"}...(; )"}...(\n)" = line
```

however this requires one more level of zipping which I think obscures the code too much.

You can see more usages of the interpolator in my Advent of Code solutions:
- [Day 04](https://github.com/bishabosha/advent-of-code-2023/blob/main/2023-day04.scala)
- [Day 05](https://github.com/bishabosha/advent-of-code-2023/blob/main/2023-day05.scala)
- [Day 06](https://github.com/bishabosha/advent-of-code-2023/blob/main/2023-day06.scala)
- [Day 19](https://github.com/bishabosha/advent-of-code-2023/blob/main/2023-day19.scala)

## What else can you do?

| Format                     | Binding            | Note                  |
|----------------------------|--------------------|-----------------------|
| `$foo`                     | `foo: String`      |                       |
| `$foo%d`                   | `foo: Int`         |                       |
| `$foo%L`                   | `foo: Long`        |                       |
| `$foo%f`                   | `foo: Float`       |                       |
| `$foo%g`                   | `foo: Double`      |                       |
| `$foo...(<regex>)`         | `foo: Seq[String]` | split by regex        |
| `$foo..!(<regex>)`         | `foo: Seq[String]` | drops first if empty  |
| `${r"$foo%d"}...(<regex>)` | `foo: Seq[Int]`    | match on each element |
| `${r"$foo%L"}...(<regex>)` | `foo: Seq[Long]`   | match on each element |
| `${r"$foo%f"}...(<regex>)` | `foo: Seq[Float]`  | match on each element |
| `${r"$foo%g"}...(<regex>)` | `foo: Seq[Double]` | match on each element |

> _The above table gives an enumeration of all the possible format suffixes._

In essence, the behavior of the extractor can be interpreted by the following rewrites:

**1. simple format string**

```scala
"23 * 2" match
  case r"$x%d * $y%d" => assert(x * y == 46)
```

is converted to

```scala
"23" match
  case s"$x * $y" => (x.toIntOption, y.toIntOption) match
    case (Some(x), Some(y)) => assert(x * y == 46)
```

**2. split format**

```scala
"2,3,4" match
  case r"${r"$xs%d"}...(,)" => assert(xs.product == 24)
```

is converted to

```scala
"2,3,4" match
  case s"$sub" =>
    sub.split(",").toIndexedSeq match
      case r"$xs%d" => assert(xs.product == 24)
```

which is further converted to

```scala
"2,3,4" match
  case s"$sub" =>
    val xs: Seq[Int] = sub.split(",").toIndexedSeq.map:
      case r"$x%d" => x
    assert(xs.product == 24)
```

which (by **rule 1**) is finally converted to

```scala
"2,3,4" match
  case s"$sub" =>
    val xs: Seq[Int] = sub.split(",").toIndexedSeq.map:
      case s"$x" => x.toIntOption match
        case Some(x) => x
    assert(xs.product == 24)
```

> it's a bit simplified for reading but the real thing is well behaved such that patterns that do not match return an empty value from the unapply method (rather than throwing MatchError).

## What's next?

> ~~I'm thinking of polishing the extractor a bit more before publishing as a library.~~ As of 11th February 2024, there is now a [published library](https://index.scala-lang.org/bishabosha/enhanced-string-interpolator) for the interpolator.

I'd like to propose it for the Scala standard library, or perhaps [Scala Toolkit](https://github.com/scala/toolkit), accepting any feedback or simplifications suggested.

But the purpose is to continue to be a lightweight parsing solution, to compliment the `s` interpolator by adding a bit more convenience, enough for typical problems in interview-style questions. However serious parsing problems will need an even more powerful solution, such as a parser combinator library.
