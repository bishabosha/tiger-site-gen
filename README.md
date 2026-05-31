# Tiger site generator

Static site generator written in Scala (used for [bishabosha.github.io](https://bishabosha.github.io/) and [jamie-thompson-dev.github.io](https://jamie-thompson-dev.github.io/))

The code is not really organised as a library yet.

## Usage

currently, declare a render task in [makeSite.scala](makeSite.scala),
then run from CLI:
```bash
scala run -M example.makeSite .
```

## Inspiration

Originally, following the Chapter 9 from [Hands on Scala Programming](https://www.handsonscala.com/chapter-9-self-contained-scala-scripts.html), the design has evolved separately from there.
