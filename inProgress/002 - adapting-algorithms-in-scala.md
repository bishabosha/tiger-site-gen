---
layout: article
title: Adapting algorithms to Scala, with the help of elves
published: 08-Jan-2024
---

Follow my journey solving the last day of [Advent of Code](https://adventofcode.com) 2023 in Scala 3, the score?
Adapting the [Stoer-Wagner minimum cut algorithm](https://dl.acm.org/doi/pdf/10.1145/263867.263872).
If you were wondering, it finds a minimal set of edges to remove (a cut) to split a graph into two partitions.

> The article you are reading focuses on adapting the Stoer-Wagner algorithm.
> If you want to see it used in a practical problem, I also wrote a [sibling article](https://scalacenter.github.io/scala-advent-of-code/2023/puzzles/day25) on the Scala Center's Advent of Code solutions website which you may also want to read.

Why this article? I think it is useful to see the decision process when adapting "the literature" a.k.a. a high-level specification of an algorithm in mathematical language, to practical code that can run on a computer.

For this specific algorithm, [Scala](https://scala-lang.org) is a particularly suitable programming language.
Its immutable collections are very rooted in mathematical foundations, while the language itself has a highly expressive syntax.

## Introducing the algorithm

The [original paper](https://dl.acm.org/doi/pdf/10.1145/263867.263872) describing the Stoer-Wagner algorithm provides a high level specification as an imperative algorithm, described concisely by the following pseudo code:
```scala
G := {V, E} // 1.

def MinimumCutPhase(G, w, a) =
  A := {a} // 2.
  while A != V do
    A += MostTightlyConnected(G, w, A) // 3.
  cut := CutOfThePhase(G, A) // 4.
  Shrink(G, w, A) // 5.
  return cut

def MinumumCut(G, w, a) =
  min := EmptyCut // 6.
  while V.size > 1 do
    cut := MinimumCutPhase(G, w, a) // 7.
    if Weight(cut) < Weight(min) || IsEmpty(min) then
      min = cut
  return min
```

The algorithm begins in the `MinimumCut` loop, and iteratively shrinks a graph by delegating to the `MinimumCutPhase`, which yields a cut (i.e. edges removed by shrinking). The minimal cut is finally returned. Here is a more detailed overview:

> 1. `G` is a graph, made of the composition of a vertex set `V` and an edge set `E`.
>    There is also a weight function, where `w(e)` gives the weight of an edge `e`.
> 2. Initialise `A` to the set containing `a`, an arbitrary vertex of `V`.
> 3. Until `A` is equal to `V`, keep adding the `most-tightly-connected` vertex of `V`, `z`, to the vertices in `A`. `z` is a vertex in `V` (and not in `A`) where the total weight of edges from `A` to `z` is maximum.
> 4. Make a cut by removing edges from vertex `added-last` to `A` to the rest of `V`.
> 5. Shrink `G` by removing the vertex `added-last` to `A`, Update `E` and `w` by merging the edges of the two `added-last` vertices.
> 6. Initialize `min` to an empty cut, which signals that no cut was found yet.
> 7. Until `G` has a single vertex, run the `MinimumCutPhase`. If the resulting `cut-of-the-phase` is minimal, update `min`.

## The Naive Adaption

Let's try to adapt this by the letter to Scala, and then we will analyse for possible optimisations.

### Framework

```scala
type Vertex = String
type Edge = (Vertex, Vertex)

case class Graph(v: Set[Vertex], e: Set[Edge], w: Map[Edge, Int]) // 1.
case class Cut(edges: Set[Edge], weight: Int) // 2.

def minimumCutPhase(G: Graph, a: Vertex) =
  var A = Set(a)
  var history = List(a) // 3.
  while A != G.v do
    val z = mostTightlyConnected(G, A)
    A += z
    history ::= z // 3.
  val List(t, s, _*) = history: @unchecked // 3.
  val cut = cutOfThePhase(G, t) // 4.
  val g = shrink(G, cut, t, s) // 5.
  (g, cut) // 6.

def minumumCut(G: Graph, a: Vertex) =
  var g = G
  var min = Cut(Set.empty, 0)
  while g.v.size > 1 do
    val (g1, cut) = minimumCutPhase(g, a)
    g = g1
    if cut.weight < min.weight || min.weight == 0 then
      min = cut
  min

def mostTightlyConnected(G: Graph, A: Set[Vertex]): Vertex = ???

def cutOfThePhase(G: Graph, t: Vertex): Cut = ???

def shrink(G: Graph, cut: Cut, t: Vertex, s: Vertex): Graph = ???
```

Let's leave some details out for now, and compare the differences:
> 1. We use an immutable representation for the Graph. Also combine `w` with the graphs and edges.
> 2. Represent the Cut as a pair of edges and their total weight.
> 3. The default `Set` type in Scala does not remember insertion order, so use `history` to record the order by prepending `z` on each iteration.
> 4. We only need `t`, the vertex `added-last` to compute the `cut-of-the-phase`.
> 5. We also only need `t` and `s` the two vertices `added-last` to shrink the graph, which returns a new graph, rather than mutating in place.
> 6. Because graph is immutable, we need to return the shrunk graph alongside the `cut-of-the-phase`.

### Most Tightly Connected

according to the [Stoer-Wagner algorithm](https://dl.acm.org/doi/pdf/10.1145/263867.263872) the "most-tightly-connected" vertex `z` is defined as follows:

> $`z \notin A`$ such that $`w(A, z) = max \{ w(A, y) ~|~ y \notin A\}`$
>
> where $`w(A, y)`$ is the sum of the weights of all the edges between $`A`$ and $`y`$.

This gives the naive implementation in Scala as follows:
```scala
def mostTightlyConnected(G: Graph, A: Set[Vertex]): Vertex =
  val ys = G.v `diff` A
  val frontier = G.e
    .collect:
      case edge @ (a, y) if A(a) && ys(y) => edge
    .groupBy((_, y) => y)
    .view
    .mapValues(_.foldLeft(0)(_ + G.w(_)))
    .toMap
    .withDefaultValue(0)
  ys.maxBy(frontier)
```

!!! danger "Runtime Complexity"
  This current form of `mostTightlyConnected` is much too inefficient, will adapt it later to avoid repeated computation.

### Cut of the phase

To compute the cut of the phase, you must find all the edges from `t`, the vertex `added-last` to `A`. Then compute the total weight as usual.

```scala
def cutOfThePhase(G: Graph, t: Vertex): Cut =
  val edges = G.e.collect:
    case edge @ (t1, _) if t == t1 => edge
  val weight = edges.foldLeft(0)(_ + G.w(_))
  Cut(edges, weight)
```

!!! danger "Runtime Complexity"
  Again, there is more we can do later to avoid repeated computation.

### Shrinking the Graph

The hardest part is to shrink the graph. This involves removing `t` from `G.v`, then any edges from `t` must be removed. Then weights from `t` to another vertex `u` (that isn't `s`) must be merged with the weight of the edge from `s` to `u`. Edges are undirected, so we must consider both directions also.

```scala
def shrink(G: Graph, cut: Cut, t: Vertex, s: Vertex): Graph =
  val edgesFromT = cut.edges
  val removedEdges = edgesFromT ++ edgesFromT.map(_.swap)
  val mergeableLookup = edgesFromT
    .collect({ case e @ (_, u) if u != s => e })
    .groupBy((_, u) => u)
  val mergeableEdges =
    val us = mergeableLookup.view
      .filter((_, ws) => ws.sizeIs == 1)
      .keys
    us.flatMap(u => List(u -> s, s -> u))
  val mergedWeights = mergeableLookup
    .flatMap: (u, ws) =>
      val e = (s, u)
      val w0 = G.w.getOrElse(e, 0)
      val w1 = ws.foldLeft(w0)(_ + G.w(_))
      List(e -> w1, e.swap -> w1)
  val v1 = G.v - t
  val e1 = G.e -- removedEdges ++ mergeableEdges
  val w1 = G.w -- removedEdges ++ mergedWeights
  Graph(v1, e1, w1)
```

### Review

So we have all the pieces, are we done? It turns out that we are inefficient in two ways, representation of the graph, and not factoring out redundant computation. Let's optimise.

## Helper

```scala
def minumumCut(G: Graph, a: Vertex) =
  var g = G
  var i = 0
  var min = (i, Cut(Set.empty, 0))
  while g.v.size > 1 do
    i += 1
    println(s"iteration $i")
    val (g1, cut) = minimumCutPhase(g, a)
    g = g1
    if cut.weight < min(1).weight || min(1).weight == 0 then
      min = (i, cut)
  min

type AList = Seq[(String, Seq[String])]
def parse(input: String): AList =
  val lines = input.linesIterator.map:
    case s"$key: $cons" =>
      key -> cons.split(" ").toIndexedSeq
  lines.toSeq

def readGraph(alist: AList): Graph =
  def idOf(v: String) = asVertex(v)

  def asVertex(v: String) = v match
    case s"$n@$_" => n
    case n => n
  def asWeight(v: String) = v match
    case s"$_@$w" => w.toInt
    case n => 1
  def asEdges(k: String, v: String) =
    val e = (idOf(k), idOf(v))
    List(e, e.swap)
  def asWeights(k: String, v: String) =
    val t = (idOf(k), idOf(v))
    val w = asWeight(v)
    List(t -> w, t.swap -> w)

  val vertices = alist.flatMap((k, vs) => k +: vs).map(asVertex).toSet
  val weights = alist.flatMap((k, vs) => vs.flatMap(v => asWeights(k, v))).toMap
  val edges = alist.flatMap((k, vs) => vs.flatMap(v => asEdges(k, v))).toSet
  Graph(vertices, edges, weights)
```

## Improving

### Graph

To begin let's describe the `Graph`:
```scala
import scala.collection.immutable.BitSet

type Id = Int
type Vertices = BitSet
type Weight = Map[Id, Map[Id, Int]]

case class Graph(v: Vertices, nodes: Map[Id, Vertices], w: Weight)
```

In the problem statement, the vertices are strings. However, comparisons of strings are expensive, so to improve performance, we will represent each vertex as a unique integer.

!!! tip "Keep track of original String vertices"
  Converting string keys to integer IDs is a lossy operation, so for debugging purposes, before you build the graph, it could be useful to store a reverse lookup from an integer ID to its original key, e.g. `0 -> "dpx"`, `1 -> "bkx"`, `2 -> "xzl"`, etc.

the graph has three fields:
- `v` a bitset of vertex IDs,
- `nodes` is particularly useful for the Stoer-Wagner algorithm.
  For any vertex `y` of `v`, it stores the set of vertices that have been merged with `y` (including `y` itself).
- `w` is an adjacency matrix of vertices, and also stores the weight associated with each edge.

Now, consider the problem.
We have to find a minimum cut, it should have weight 3, and we also need to find the resulting partition of the cut (so we can multiply the sizes of each partition).

so we can add the following to the code:
```scala
case class Graph(v: Vertices, nodes: Map[Id, Vertices], w: Weight):
  def cutOfThePhase(t: Id) = Graph.Cut(t = t, edges = w(t)) // 1.

  def partition(cut: Graph.Cut): (Vertices, Vertices) = // 2.
    (nodes(cut.t), (v - cut.t).flatMap(nodes))

object Graph:
  def emptyCut = Cut(t = -1, edges = Map.empty) // 3.

  case class Cut(t: Id, edges: Map[Id, Int]): // 4.
    lazy val weight: Int = edges.values.sum
```

1. `cutOfThePhase` makes a cut from `t`, which is the final "most-tightly-connected" vertex in a phase.
2. `partition` takes a cut, and returns two partitions: the nodes associated with `t`; and the rest.
3. `Graph.emptyCut` is a default value for a cut, it is empty.
4. `Graph.Cut` stores a vertex `t`, and the weights of edges of reachable vertices from `t`.
   a cut also has a `weight` property, which is the total weight of all the edges of the cut.

The last property the graph needs is a way to "shrink" it. We are given `s` and `t`, where `t` will be removed from the graph and its edges merge with `s`.

```scala
// in case class Graph:
  def shrink(s: Id, t: Id): Graph =
    def fetch(x: Id) = // 1.
      w(x).view.filterKeys(y => y != s && y != t) // 1.

    val prunedW = (w - t).view.mapValues(_ - t).toMap // 2.

    val fromS = fetch(s).toMap // 3.
    val fromT = fetch(t).map: (y, w0) => // 3.
      y -> (fromS.getOrElse(y, 0) + w0) // 3.
    val mergedWeights = fromS ++ fromT // 3.

    val reverseMerged = mergedWeights.view.map: (y, w0) => // 4.
      y -> (prunedW(y) + (s -> w0)) // 4.

    val v1 = v - t // 5.
    val w1 = prunedW + (s -> mergedWeights) ++ reverseMerged // 6.
    val nodes1 = nodes - t + (s -> (nodes(s) ++ nodes(t))) // 7.
    Graph(v1, nodes1, w1) // 8.
  end shrink
```

1. `fetch` finds the edges from vertex `x` to any vertex that is not `s` or `t`.
2. remove the edges of `t` from `w` in both directions (from and to).
3. merge the weights of edges from `t` into edges from `s` (ignoring edges from `t` to `s`).
  The result `mergedWeights` is an adjacency list from the merged `s` vertex.
4. To preserve the property of undirected edges, reverse the direction of `mergedWeights`.
5. remove `t` from `v`.
6. update the edges of `s` in both directions.
7. remove `t` from `nodes`, and add a new mapping from `s` to the combined nodes of `s` and `t`
8. return a new graph with the merged vertices, nodes and edges.

### MostConnected

according to the [Stoer-Wagner algorithm](https://dl.acm.org/doi/pdf/10.1145/263867.263872) the "most-tightly-connected" vertex `z` is defined as follows:

> $`z \notin A`$ such that $`w(A, z) = max \{ w(A, y) ~|~ y \notin A\}`$
>
> where $`w(A, y)`$ is the sum of the weights of all the edges between $`A`$ and $`y`$.

An efficient way to compute this is a heap structure, that stores the total weight of all edges from `A` to `v`.
At each step of the `minimumCutPhase` we will remove the top of the heap to get `z`, and then grow the remaining heap by adding connections from the newly added `z` to the rest of `v`.

Here is the implementation:
```scala
import scala.collection.immutable.TreeSet

class MostConnected(
  totalWeights: Map[Id, Int], // 1.
  queue: TreeSet[MostConnected.Entry] // 2.
):

  def pop = // 3.
    val id = queue.head.id
    id -> MostConnected(totalWeights - id, queue.tail)

  def expand(z: Id, explore: Vertices, w: Weight) = // 4.
    val connectedEdges =
      w(z).view.filterKeys(explore)
    var totalWeights0 = totalWeights
    var queue0 = queue
    for (id, w) <- connectedEdges do
      val w1 = totalWeights0.getOrElse(id, 0) + w
      totalWeights0 += id -> w1
      queue0 += MostConnected.Entry(id, w1)
    MostConnected(totalWeights0, queue0)
  end expand

end MostConnected

object MostConnected:
  def empty = MostConnected(Map.empty, TreeSet.empty)
  given Ordering[Entry] = (e1, e2) =>
    val first = e2.weight.compareTo(e1.weight)
    if first == 0 then e2.id.compareTo(e1.id) else first
  class Entry(val id: Id, val weight: Int):
    override def hashCode: Int = id
    override def equals(that: Any): Boolean = that match
      case that: Entry => id == that.id
      case _ => false
```

The `MostConnected` structure is immutable, and stores a heap of entries. Each entry stores a vertex ID and the total weight of edges from `A` to that vertex.

We can describe the structure of `MostConnected` as a composition of two other collections:
1. The `totalWeights` map, which is a fast lookup, storing a mapping from a vertex `y` to the total weights of edges from `A` to `y`.
2. The `queue`, which is a `TreeSet` of entries. A tree set is useful to implement a heap structure because its entries are sorted (using an `Ordering`). Each entry stores the same information as a mapping in `totalWeights`, and will be sorted according to the ordering defined in the companion object of `MostConnected`. At any instant, the entry describing the "most-tightly-connected" vertex is first in the `queue`.

Next, pay attention to the signatures of `pop` and `expand`, which are used in the `minimumCutPhase`:

3. `pop` is used to extract the mostly tightly connected vertex `z`. It returns a tuple of `z`, and the remaining heap (i.e. by removing `z`).
4. After adding some `z` to `A`, then call `expand` to add the new edges from `z` to the vertices of `explore` (the vertices of `v` not in `A`), using the weights of the graph `w`.

### Writing the Algorithm

We now have enough code to implement the Stoer-Wagner algorithm in Scala code, using immutable data structures and local mutability.

> [@bishabosha](https://github.com/bishabosha): _Hopefully you can see that the code is very similar to the [pseudocode](#minumum-cut-algorithm) presented above. I hope that this demonstrates that functional programming principles can be used to create concise and expressive code in Scala._

```scala
def minimumCutPhase(g: Graph) =
  val a = g.v.head // 1.
  var A = a :: Nil // 2.
  var explore = g.v - a // 3.
  var mostConnected =
    MostConnected.empty.expand(a, explore, g.w) // 4.
  while explore.nonEmpty do // 5.
    val (z, rest) = mostConnected.pop // 6.
    A ::= z // 7.
    explore -= z // 7.
    mostConnected = rest.expand(z, explore, g.w) // 8.
  val t :: s :: _ = A: @unchecked // 9.
  (g.shrink(s, t), g.cutOfThePhase(t)) // 10.

def minimumCut(g: Graph) =
  var g0 = g // 11.
  var min = (g, Graph.emptyCut) // 12.
  while g0.v.size > 1 do
    val (g1, cutOfThePhase) = minimumCutPhase(g0) // 13.
    if cutOfThePhase.weight < min(1).weight
      || min(1).weight == 0
    then
      min = (g0, cutOfThePhase)
    g0 = g1 // 14.
  min
```

Here are some footnotes to explain the differences with the [pseudocode](#minumum-cut-algorithm):

#### minimumCutPhase

1. The initial `a` vertex of `minimumCutPhase` can be arbitrary, so use the first vertex of `v` (from graph `g`).
2. Instead of a set, use a list to store `A`, this is so we can later remember the final two nodes added.
  Due to the invariants of the algorithm, all the elements will be unique anyway.
3. For efficient lookup, we define explore as a bitset of vertices in `v` that have not yet been added to `A`.
4. Initialise the `mostConnected` heap with the weights of edges from `a` to the vertices in `explore`.
5. when `explore` is empty, then `A` will equal `v`.
6. `pop` from the `mostConnected` heap, returning a tuple of `z` (the "most-tightly-connected" node), and the remaining heap.
7. update the graph partitions, i.e. add `z` to `A`, and remove `z` from `explore`.
8. update the `rest` of the heap by adding the weights of edges from `z` to `explore` (i.e. this saves computation time because the weights of the edges from other vertices of `A` are already stored).
9. extract `t` and `s`, the two "added-last" nodes of `A`.
10. return a tuple of a shrunk graph, by merging `t` and `s`, and the cut of the phase made by removing `t` from `g`.

#### minimumCut

11. `Graph` is an immutable data structure, but each iteration demands that we shrink the graph (i.e produce a new data structure containing the updated vertices, edges and weights), so `g0` stores the "current" graph being inspected.
12. For our specific problem, we also need to find the partition caused by the minimum cut, so as well as storing the minimum cut, store the graph of the phase that produced the cut. At the end of all iterations we can compute the partition using the minimum cut.
13. The `minimumCutPhase` returns both the shrunk graph, and the cut of the phase.
14. Update `g0` to the newly shrunk graph.

### Parsing

We now need to construct our graph from the input.

#### Reading the input

First, `parse` the input to an adjacency list as follows:
```scala
def parse(input: String): Map[String, Set[String]] =
  input
    .linesIterator
    .map:
      case s"$key: $values" => key -> values.split(" ").toSet
    .toMap
```

here a single line of the input, such as:
```text
bvb: xhk hfx
```
will parse to the following:
```scala
"bvb" -> Set("xhk", "hfx")
```
Then the final `.toMap` will put all the lines together as follows:
```scala
Map(
  "bvb" -> Set("xhk", "hfx"),
  "qnr" -> Set("nvd"),
  //...
)
```

#### Building the graph

The adjacency list we just parsed is not suitable for the Stoer-Wagner algorithm, as its edges are directed.
We will have to do the following processing steps to build a suitable graph representation:
- identify all the vertices, and generate a unique integer ID for each one,
- generate an undirected adjacency matrix of weights. We must duplicate each edge from the original input to make an efficient lookup table. We will initialise each weight to 1 (remember that even though each edge is equal initially, when edges are merged, their weights must be combined).

Here is the code:
```scala
def readGraph(alist: Map[String, Set[String]]): Graph =
  val all = alist.flatMap((k, vs) => vs + k).toSet

  val (_, lookup) =
    // perfect hashing
    val initial = (0, Map.empty[String, Id])
    all.foldLeft(initial): (acc, s) =>
      val (id, seen) = acc
      (id + 1, seen + (s -> id))

  def asEdges(k: String, v: String) =
    val t = (lookup(k), lookup(v))
    t :: t.swap :: Nil

  val v = lookup.values.to(BitSet)
  val nodes = v.unsorted.map(id => id -> BitSet(id)).toMap
  val edges =
    for
      (k, vs) <- alist.toSet
      v <- vs
      e <- asEdges(k, v) // (k -> v) + (v -> k)
    yield
      e

  val w = edges
    .groupBy((v, _) => v)
    .view
    .mapValues: m =>
      m
        .groupBy((_, v) => v)
        .view
        .mapValues(_ => 1)
        .toMap
    .toMap
  Graph(v, nodes, w)
```

### The Solution

Putting everything together, we can now solve the problem!

```scala
def part1(input: String): Int =
  val alist = parse(input) // 1.
  val g = readGraph(alist) // 2.
  val (graph, cut) = minimumCut(g) // 3.
  val (out, in) = graph.partition(cut) // 4.
  in.size * out.size // 5.
```

1. Parse the input into an adjacency list (note. the edges are directed)
2. Convert the adjacency list to the `Graph` structure.
3. Call the `minimumCut` function on the graph, storing the minimum cut,
   and the state of the graph when the cut was made.
4. use the cut on the graph to get the partition of vertices.
5. multiply the sizes of the partitions to get the final answer.
