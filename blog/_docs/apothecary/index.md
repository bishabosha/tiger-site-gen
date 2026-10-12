---scala
(
  layout = "raw"
)
---
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="description" content="A 2-hour hands-on lab: reactive UI in Scala.js with Laminar" /><title>The Apothecary: a Laminar lab</title><link rel="stylesheet" href="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/vendor/reveal/dist/reset.css" /><link rel="stylesheet" href="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/vendor/reveal/dist/reveal.css" /><link rel="stylesheet" href="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/theme.css" /><link rel="stylesheet" href="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/fonts.css" /><link rel="stylesheet" href="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/assets/apothecary.css" /></head><body class="reveal-standalone" style="--r-main-font:Source Sans, Arial, sans-serif;--r-heading-font:var(--r-main-font);--r-code-font:Menlo, Consolas, monospace;--r-focus-font:var(--r-main-font)" data-render-mode="static" data-deck-assets="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/" data-preview-code="assets/demos.mjs"><div class="reveal" style="--r-main-font:Source Sans, Arial, sans-serif;--r-heading-font:var(--r-main-font);--r-code-font:Menlo, Consolas, monospace;--r-focus-font:var(--r-main-font)"><div class="slides"><section id="title" class="title-slide" data-timing="60" data-background-color="#2b1d3a"><div class="slide-body"><h1><a href="#heading:title:the-apothecary" id="heading:title:the-apothecary" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>The <em>Apothecary</em></h1>
<p>A hands-on Laminar lab</p>
<p>Jamie Thompson · ScalaDays 2026</p>
</div><aside class="notes"><p class="time"><strong>0:00-1:00</strong></p><p>Welcome everyone. Two hours, mostly hands-on. Laptops open, Wi-Fi on.</p>
</aside></section><section id="welcome" class="standard" data-timing="90"><div class="slide-body"><h2><a href="#heading:welcome:welcome-apprentice" id="heading:welcome:welcome-apprentice" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Welcome, apprentice</h2>
<div class="columns top">
<div class="stack ">
<ul>
<li>Two years building business apps in Laminar</li>
<li>Forms, validation and async: the boring parts that matter</li>
<li>Today: the same skills, with <em>potions</em></li>
</ul>
</div>
<div class="stack ">
<p><strong>You will build</strong></p>
<ul>
<li>a cauldron mixer</li>
<li>a potion registration form</li>
<li>an ingredient search &amp; inventory</li>
<li>a widget for <strong>notebook.sc</strong></li>
</ul>
</div>
</div>
</div><aside class="notes"><p class="time"><strong>1:00-2:30</strong></p><p>Introduce myself briefly. Emphasise: this is a lab, I'll talk ~35% of the time.</p>
</aside></section><section id="agenda" class="standard" data-timing="60"><div class="slide-body"><h2><a href="#heading:agenda:the-recipe" id="heading:agenda:the-recipe" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>The recipe</h2>
<table class="article-table">
<thead>
<tr><th>Time</th><th>Module</th></tr>
</thead>
<tbody>
<tr><td>0:10</td><td>1 · Reactive basics</td></tr>
<tr><td>0:30</td><td>2 · Forms &amp; validation</td></tr>
<tr><td>0:55</td><td>3 · Async &amp; the backend</td></tr>
<tr><td>1:15</td><td>4 · Organisation &amp; interop</td></tr>
<tr><td>1:25</td><td>Capstone · notebook.sc widgets</td></tr>
<tr><td>1:55</td><td>Wrap-up</td></tr>
</tbody>
</table>
</div><aside class="notes"><p class="time"><strong>2:30-3:30</strong></p><p>Times are elapsed from the start. If we run behind, module 4 shrinks first.</p>
</aside></section><section id="setup" class="exercise-slide" data-timing="240"><div class="slide-body"><h2><a href="#heading:setup:setup-step-by-step" id="heading:setup:setup-step-by-step" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Setup, step by step</h2>
<p><span class="exercise-tag">exercises/00-setup</span></p>
<ol>
<li>Install <a href="https://scala-cli.virtuslab.org/install">Scala CLI</a> and <a href="https://nodejs.org/en/download">Node.js</a></li>
<li><code>git clone --recurse-submodules git@github.com:bishabosha/scaladays-2026-laminar-lab.git</code> then <code>cd scaladays-2026-laminar-lab</code></li>
<li><code>./sake check</code>, until it says <strong>Ready, apprentice</strong></li>
<li>In a <strong>second terminal</strong>: <code>./sake prepare</code>, and leave it running</li>
<li><code>./sake ex 00-setup</code>, open <a href="http://127.0.0.1:8000/?ex=00-setup">http://127.0.0.1:8000/?ex=00-setup</a>, say hello</li>
</ol>
<p>Every step, for every OS: <strong>github.com/bishabosha/scaladays-2026-laminar-lab</strong> · Windows: <code>sake</code> instead of <code>./sake</code></p>
</div><aside class="notes"><p class="time"><strong>3:30-7:30</strong></p><p>Put this slide up while people arrive. The first <code>./sake check</code> downloads Scala, Scala.js, Laminar, Mill and a JVM:
several minutes on conference Wi-Fi. Everyone must see the hello page before exercise 1.
<code>./sake prepare</code> builds the remaining exercises, widgets and notebook.sc in the background; it only needs to finish before the capstone.
No SSH key (&quot;Permission denied (publickey)&quot;): clone the https URL without --recurse-submodules, then <code>./sake fetch-https</code>.</p>
</aside></section><section id="workflow" class="standard" data-timing="60"><div class="slide-body"><h2><a href="#heading:workflow:how-the-exercises-work" id="heading:workflow:how-the-exercises-work" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>How the exercises work</h2>
<table class="article-table">
<thead>
<tr><th> </th><th> </th></tr>
</thead>
<tbody>
<tr><td>Work on one</td><td><code>./sake ex 01-cauldron</code>: edit <code>exercises/01-cauldron/start/</code>, the page reloads</td></tr>
<tr><td>Peek at the answer</td><td><code>./sake ex-solution 01-cauldron</code></td></tr>
<tr><td>Start over</td><td><code>./sake reset-ex 01-cauldron</code></td></tr>
<tr><td>Every command</td><td><code>./sake</code></td></tr>
</tbody>
</table>
<p>Stuck? Raise your hand: helpers are walking around.</p>
</div><aside class="notes"><p class="time"><strong>7:30-8:30</strong></p><p>Resets: <code>reset-ex &lt;ex&gt;</code>, <code>reset-widget &lt;name&gt;</code>; <code>reset-all</code> (rehearsal clean-up) discards everything.
Answers come from the <code>solutions</code> branch, fetched on demand.</p>
</aside></section><section id="the-shop" class="standard" data-timing="90"><div class="slide-body"><h2><a href="#heading:the-shop:the-shop" id="heading:the-shop:the-shop" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>The shop</h2>
<div class="columns ">
<div class="stack ">
<p>Grimsby &amp; Daughters, purveyors of fine potions since 1642, are going digital.</p>
<ul>
<li>brew potions in a <strong>cauldron</strong></li>
<li><strong>register</strong> new recipes (with the Guild's many rules)</li>
<li><strong>search</strong> the ingredient cellar, manage stock</li>
<li>a grumpy <strong>oracle</strong> for a backend</li>
</ul>
</div>
<div class="laminar-demo-frame"><div class="laminar-demo" data-kind="potions/mixer" data-value="{&quot;r&quot;:120,&quot;g&quot;:60,&quot;b&quot;:190}"><p class="demo-pending">demo: potions/mixer</p></div><output class="demo-value"></output></div>
</div>
</div><aside class="notes"><p class="time"><strong>8:30-10:00</strong></p><p>Play with the mixer live. Point out: this is Laminar running inside the slide.</p>
</aside></section><section id="basics" class="dark-slide chapter-slide" data-timing="15" data-background-color="#2b1d3a"><div class="slide-body"><h2><a href="#heading:basics:1--reactive-basics" id="heading:basics:1--reactive-basics" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>1 · Reactive <em>basics</em></h2>
<p>Vars, signals, streams, and who owns them</p>
</div><aside class="notes"><p class="time"><strong>10:00-10:15</strong></p></aside></section><section id="var-signal-stream" class="standard" data-timing="180"><div class="slide-body"><h2><a href="#heading:var-signal-stream:three-ingredients" id="heading:var-signal-stream:three-ingredients" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Three ingredients</h2>
<div class="columns top">
<div class="stack ">
<pre><code class="language-scala">val heat: Var[Int] = Var(40)

val colour: Signal[String] =
  heat.signal.map(h =&gt;
    if h &gt; 80 then &quot;crimson&quot; else &quot;violet&quot;)

val bubbles: EventStream[Unit] =
  EventStream.periodic(500).mapToUnit
</code></pre>
</div>
<div class="stack ">
<ul>
<li><strong><code>Var</code></strong>: state you own, <code>set</code> / <code>update</code></li>
<li><strong><code>Signal</code></strong>: always has a <em>current</em> value</li>
<li><strong><code>EventStream</code></strong>: things that <em>happen</em></li>
<li><code>map</code>, <code>combineWith</code>, <code>changes</code>, <code>startWith</code></li>
</ul>
</div>
</div>
</div><aside class="notes"><p class="time"><strong>10:15-13:15</strong></p><p>Signal = value over time, EventStream = discrete events. Signals dedupe with ==.</p>
</aside></section><section id="arrows" class="standard" data-timing="150"><div class="slide-body"><h2><a href="#heading:arrows:pointing-the-arrows" id="heading:arrows:pointing-the-arrows" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Pointing the arrows</h2>
<pre><code class="language-scala">def cauldron(heat: Var[Int]): HtmlElement =
  div(
    cls := &quot;cauldron&quot;,
    backgroundColor &lt;-- heat.signal.map(colourFor), // data → DOM
    input(
      typ := &quot;range&quot;, minAttr := &quot;0&quot;, maxAttr := &quot;100&quot;,
      controlled(
        value &lt;-- heat.signal.map(_.toString),
        onInput.mapToValue.map(_.toInt) --&gt; heat     // DOM → data
      )
    ),
    child.text &lt;-- heat.signal.map(h =&gt; s&quot;$h°&quot;),
    button(&quot;Stir&quot;, onClick --&gt; (_ =&gt; heat.update(_ + 5)))
  )
</code></pre>
<p><code>&lt;--</code> reads <em>into</em> the element · <code>--&gt;</code> writes <em>out</em> of it</p>
</div><aside class="notes"><p class="time"><strong>13:15-15:45</strong></p><p>Most Laminar code is these two arrows. Note <code>--&gt; heat</code>: a Var is an Observer.</p>
</aside></section><section id="ownership" class="standard" data-timing="120"><div class="slide-body"><h2><a href="#heading:ownership:who-owns-the-bubbles" id="heading:ownership:who-owns-the-bubbles" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Who owns the bubbles?</h2>
<div class="stack ">
<ul>
<li>Every <code>&lt;--</code> / <code>--&gt;</code> is a <strong>subscription owned by its element</strong></li>
<li>Mounted → active · unmounted → <em>killed</em>. No leaks, no <code>dispose()</code></li>
<li>Laziness: an unobserved signal does no work</li>
</ul>
<pre><code class="language-scala">div(
  EventStream.periodic(1000) --&gt; (_ =&gt; println(&quot;bubble&quot;)), // stops on unmount
  onMountCallback(ctx =&gt; println(&quot;lit the fire&quot;))
)
</code></pre>
</div>
</div><aside class="notes"><p class="time"><strong>15:45-17:45</strong></p><p>This is the Laminar superpower vs. manual React-style cleanup. Mention <code>.now()</code> should be rare.</p>
</aside></section><section id="exercise-cauldron" class="exercise-slide demo-slide" data-timing="600"><div class="slide-body"><h2><a href="#heading:exercise-cauldron:exercise-1--the-cauldron" id="heading:exercise-cauldron:exercise-1--the-cauldron" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Exercise 1 · The cauldron</h2>
<p><span class="exercise-tag">exercises/01-cauldron</span></p>
<div class="stack ">
<ol>
<li>Three sliders: <strong>moonwater</strong>, <strong>nightshade</strong>, <strong>fire salt</strong></li>
<li>The cauldron's colour mixes from all three</li>
<li>Show <em>&quot;It's going to blow!&quot;</em> when fire salt &gt; 80</li>
<li>★ A <strong>Stir</strong> button that adds a little of everything</li>
</ol>
<p><code>./sake ex 01-cauldron</code></p>
</div>
<div class="laminar-demo-frame"><div class="laminar-demo" data-kind="01-cauldron/app" style="--demo-zoom:1.2"><p class="demo-pending">demo: 01-cauldron/app</p></div><output class="demo-value"></output></div>
</div><aside class="notes"><p class="time"><strong>17:45-27:45</strong></p><p>10 minutes. Hint for 2: <code>Signal.combine(a, b, c)</code> or <code>a.combineWith(b, c)</code>.</p>
</aside></section><section id="forms" class="dark-slide chapter-slide" data-timing="15" data-background-color="#2b1d3a"><div class="slide-body"><h2><a href="#heading:forms:2--forms--validation" id="heading:forms:2--forms--validation" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>2 · <em>Forms</em> &amp; validation</h2>
<p>The Guild of Apothecaries has <em>rules</em></p>
</div><aside class="notes"><p class="time"><strong>27:45-28:00</strong></p></aside></section><section id="controlled" class="standard" data-timing="150"><div class="slide-body"><h2><a href="#heading:controlled:controlled-inputs" id="heading:controlled:controlled-inputs" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Controlled inputs</h2>
<pre><code class="language-scala">case class Potion(name: String, doses: Int, drinkable: Boolean, explosive: Boolean)

val potion = Var(Potion(&quot;&quot;, 1, drinkable = true, explosive = false))

input(
  controlled(
    value &lt;-- potion.signal.map(_.name),
    onInput.mapToValue --&gt; potion.updater[String]((p, n) =&gt; p.copy(name = n))
  )
)
</code></pre>
<ul>
<li><code>controlled</code> makes the <code>Var</code> the <strong>single source of truth</strong></li>
<li>Filter input <em>before</em> it lands: <code>onInput.mapToValue.filter(_.forall(_.isDigit))</code></li>
</ul>
</div><aside class="notes"><p class="time"><strong>28:00-30:30</strong></p><p>Without <code>controlled</code>, typing and the signal can fight. Show filter dropping letters live.</p>
</aside></section><section id="lenses" class="standard" data-timing="150"><div class="slide-body"><h2><a href="#heading:lenses:less-copy-more-potion" id="heading:lenses:less-copy-more-potion" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Less <code>copy</code>, more potion</h2>
<p>From last year's ScalaDays: a <code>Selectable</code> lens over a case-class <code>Var</code></p>
<pre><code class="language-scala">val form = VarLenses(Potion(&quot;&quot;, 1, drinkable = true, explosive = false))

input(controlled(
  value &lt;-- form.name.view,
  onInput.mapToValue --&gt; form.name.updater
))
</code></pre>
<ul>
<li><code>form.name</code> is typed <code>(updater: Observer[String], view: Signal[String])</code></li>
<li>Named tuples + <code>Mirror.ProductOf</code>, ~50 lines: <code>lenses.scala</code> in the exercise</li>
</ul>
</div><aside class="notes"><p class="time"><strong>30:30-33:00</strong></p><p>Don't go deep into the macro-free implementation; it's in the repo for the curious.</p>
</aside></section><section id="validation" class="standard" data-timing="180"><div class="slide-body"><h2><a href="#heading:validation:validation-is-just-a-signal" id="heading:validation:validation-is-just-a-signal" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Validation is just a <code>Signal</code></h2>
<pre><code class="language-scala">case class Problem(field: String, message: String)

def validate(p: Potion): List[Problem] =
  List(
    Option.when(p.name.isBlank)(Problem(&quot;name&quot;, &quot;Every potion needs a name&quot;)),
    Option.when(p.doses &gt; 12)(Problem(&quot;doses&quot;, &quot;At most 12 doses per batch&quot;)),
    Option.when(p.drinkable &amp;&amp; p.explosive)(
      Problem(&quot;explosive&quot;, &quot;A potion may not be both drinkable and explosive&quot;))
  ).flatten

val problems: Signal[List[Problem]] = potion.signal.map(validate)
</code></pre>
<p>A pure function: <strong>test it without a browser</strong></p>
</div><aside class="notes"><p class="time"><strong>33:00-36:00</strong></p><p>Key message: keep validation out of the view. Cross-field rules are trivial this way.</p>
</aside></section><section id="touched" class="standard" data-timing="150"><div class="slide-body"><h2><a href="#heading:touched:dont-shout-before-theyve-typed" id="heading:touched:dont-shout-before-theyve-typed" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Don't shout before they've typed</h2>
<pre><code class="language-scala">val touched = Var(Set.empty[String])
val submitted = Var(false)

def errorsFor(field: String): Signal[List[Problem]] =
  problems
    .combineWith(touched.signal, submitted.signal)
    .map((ps, t, s) =&gt; if s || t(field) then ps.filter(_.field == field) else Nil)

input(onBlur --&gt; (_ =&gt; touched.update(_ + &quot;name&quot;)), /* ... */)

form(onSubmit.preventDefault --&gt; { _ =&gt;
  submitted.set(true)
  if validate(potion.now()).isEmpty then save(potion.now())
})
</code></pre>
</div><aside class="notes"><p class="time"><strong>36:00-38:30</strong></p><p><code>.now()</code> in an event handler is fine; avoid it in rendering. Mention <code>disabled &lt;-- problems.map(_.nonEmpty)</code>.</p>
</aside></section><section id="exercise-form" class="exercise-slide demo-slide" data-timing="900"><div class="slide-body"><h2><a href="#heading:exercise-form:exercise-2--register-a-potion" id="heading:exercise-form:exercise-2--register-a-potion" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Exercise 2 · Register a potion</h2>
<p><span class="exercise-tag">exercises/02-potion-form</span></p>
<div class="stack ">
<ol>
<li>Name, doses, ingredients, two checkboxes</li>
<li>Errors appear after <strong>blur</strong> or <strong>submit</strong></li>
<li>Not both <em>drinkable</em> and <em>explosive</em></li>
<li><strong>Dragon's breath</strong> needs a licence no.</li>
<li>★ A problem summary</li>
</ol>
<p>Done when <code>./sake test 02-potion-form</code> passes</p>
</div>
<div class="laminar-demo-frame"><div class="laminar-demo" data-kind="02-potion-form/app" style="--demo-zoom:0.75"><p class="demo-pending">demo: 02-potion-form/app</p></div><output class="demo-value"></output></div>
</div><aside class="notes"><p class="time"><strong>38:30-53:30</strong></p><p>15 minutes. Rule 4 makes a field appear conditionally: <code>child.maybe &lt;--</code>.
Tests for <code>validate</code> are provided: <code>./sake test 02-potion-form</code>. Run with <code>./sake ex 02-potion-form</code>.
The ★ also disables the button while the oracle is thinking (disabling while invalid would hide submit errors).</p>
</aside></section><section id="async" class="dark-slide chapter-slide" data-timing="15" data-background-color="#2b1d3a"><div class="slide-body"><h2><a href="#heading:async:3--async--the-backend" id="heading:async:3--async--the-backend" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>3 · <em>Async</em> &amp; the backend</h2>
<p>Consulting the oracle (who is slow, and sometimes rude)</p>
</div><aside class="notes"><p class="time"><strong>53:30-53:45</strong></p></aside></section><section id="the-oracle" class="standard" data-timing="120"><div class="slide-body"><h2><a href="#heading:the-oracle:the-oracle" id="heading:the-oracle:the-oracle" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>The oracle</h2>
<pre><code class="language-scala">trait Oracle:
  def searchIngredients(query: String): Future[List[Ingredient]]
  def inventory(): Future[List[Stock]]
  def save(stock: Stock): Future[Stock]
  def delete(id: StockId): Future[Unit]
  def register(potion: Potion): Future[String]
</code></pre>
<ul>
<li>Runs in your browser: <strong>random latency</strong> (100–1500 ms)</li>
<li><strong>10 % of calls fail</strong> with a rude message. On purpose.</li>
<li>Change its mood live with the 🔮 panel on every exercise page</li>
</ul>
</div><aside class="notes"><p class="time"><strong>53:45-55:45</strong></p><p>The fake backend means no server setup and no conference Wi-Fi dependency.
The latency is what makes ordering bugs visible.</p>
</aside></section><section id="switch" class="standard" data-timing="180"><div class="slide-body"><h2><a href="#heading:switch:typing-faster-than-the-oracle" id="heading:switch:typing-faster-than-the-oracle" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Typing faster than the oracle</h2>
<pre><code class="language-scala">val query = Var(&quot;&quot;)

val results: EventStream[List[Ingredient]] =
  query.signal.changes
    .debounce(300)                                       // wait for a pause
    .flatMapSwitch(q =&gt;                                  // drop stale answers
      EventStream.fromFuture(oracle.searchIngredients(q)))
</code></pre>
<ul>
<li><code>flatMapMerge</code> would show <em>whichever answer arrives last</em> 😱</li>
<li><code>flatMapSwitch</code> only listens to the <strong>latest</strong> request</li>
</ul>
</div><aside class="notes"><p class="time"><strong>55:45-58:45</strong></p><p>Demo the bug with flatMapMerge first: type &quot;newt&quot;, then &quot;nettle&quot;; the newt answer arrives late.</p>
</aside></section><section id="remote-state" class="standard" data-timing="150"><div class="slide-body"><h2><a href="#heading:remote-state:loading-ready-or-rude" id="heading:remote-state:loading-ready-or-rude" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Loading, ready, or rude</h2>
<pre><code class="language-scala">enum Remote[+A]:
  case Loading
  case Ready(value: A)
  case Failed(reason: String)

def consult[A](f: =&gt; Future[A]): Signal[Remote[A]] =
  EventStream
    .fromFuture(f.map(Remote.Ready(_)).recover(e =&gt; Remote.Failed(e.getMessage)))
    .startWith(Remote.Loading)

child &lt;-- consult(oracle.inventory()).map {
  case Remote.Loading       =&gt; p(cls := &quot;bubbling&quot;, &quot;The oracle is thinking…&quot;)
  case Remote.Ready(items)  =&gt; ul(items.map(i =&gt; li(i.name)))
  case Remote.Failed(why)   =&gt; p(cls := &quot;rude&quot;, why, button(&quot;Ask again&quot;, onClick --&gt; retry))
}
</code></pre>
</div><aside class="notes"><p class="time"><strong>58:45-61:15</strong></p><p>Errors are values, rendered like anything else. Retry is just another event into the same stream.</p>
</aside></section><section id="split" class="standard" data-timing="180"><div class="slide-body"><h2><a href="#heading:split:touch-only-what-changed" id="heading:split:touch-only-what-changed" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Touch only what changed</h2>
<pre><code class="language-scala">val stock: Var[List[Stock]] = Var(Nil)

ul(
  children &lt;-- stock.signal.split(_.id) { (id, initial, item: Signal[Stock]) =&gt;
    li(
      child.text &lt;-- item.map(_.name),
      child.text &lt;-- item.map(s =&gt; s&quot; × ${s.quantity}&quot;),
      button(&quot;−&quot;, onClick --&gt; (_ =&gt; adjust(id, -1)))
    )
  }
)
</code></pre>
<ul>
<li>One element <strong>per id</strong>, created once, then fed an updated <code>Signal</code></li>
<li>Focus, scroll and CSS transitions survive updates</li>
</ul>
</div><aside class="notes"><p class="time"><strong>61:15-64:15</strong></p><p>Contrast with <code>children &lt;-- stock.signal.map(_.map(render))</code>: re-creates every row, loses focus.</p>
</aside></section><section id="exercise-cellar" class="exercise-slide demo-slide" data-timing="720"><div class="slide-body"><h2><a href="#heading:exercise-cellar:exercise-3--the-cellar" id="heading:exercise-cellar:exercise-3--the-cellar" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Exercise 3 · The cellar</h2>
<p><span class="exercise-tag">exercises/03-cellar</span></p>
<div class="stack ">
<ol>
<li>Ingredient search: debounce + <code>flatMapSwitch</code></li>
<li>Loading / failed / ready, with <strong>retry</strong></li>
<li>Shelves with <code>split</code>, plus delete</li>
<li>Optimistic: change now, undo on refusal</li>
<li>★ Dim just the row being saved</li>
</ol>
</div>
<div class="laminar-demo-frame"><div class="laminar-demo" data-kind="03-cellar/app" style="--demo-zoom:0.8"><p class="demo-pending">demo: 03-cellar/app</p></div><output class="demo-value"></output></div>
</div><aside class="notes"><p class="time"><strong>64:15-76:15</strong></p><p>12 minutes. <code>./sake ex 03-cellar</code>. Tell them to turn the oracle's &quot;slowest&quot; slider up first to see the race.
Step 4 is the hard one: keep the previous shelf to restore on failure.</p>
</aside></section><section id="organisation" class="dark-slide chapter-slide" data-timing="15" data-background-color="#2b1d3a"><div class="slide-body"><h2><a href="#heading:organisation:4--organisation--interop" id="heading:organisation:4--organisation--interop" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>4 · <em>Organisation</em> &amp; interop</h2>
<p>Keeping the spaghetti out of the cauldron</p>
</div><aside class="notes"><p class="time"><strong>76:15-76:30</strong></p></aside></section><section id="components" class="standard" data-timing="150"><div class="slide-body"><h2><a href="#heading:components:a-component-is-a-function" id="heading:components:a-component-is-a-function" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>A component is a function</h2>
<pre><code class="language-scala">object DoseInput:
  def apply(value: Signal[Int], onChange: Observer[Int], max: Int = 12): HtmlElement =
    div(
      cls := &quot;dose-input&quot;,
      button(&quot;−&quot;, onClick(_.sample(value).map(v =&gt; (v - 1) max 1)) --&gt; onChange),
      child.text &lt;-- value,
      button(&quot;+&quot;, onClick(_.sample(value).map(v =&gt; (v + 1) min max)) --&gt; onChange)
    )
</code></pre>
<ul>
<li><strong>In:</strong> <code>Signal</code>s. <strong>Out:</strong> <code>Observer</code>s. <strong>Return:</strong> an element</li>
<li>State lives with whoever <em>needs</em> it, usually the page, not the widget</li>
<li>Needs to expose more? Return a small class: <code>.element</code> plus extra signals</li>
</ul>
</div><aside class="notes"><p class="time"><strong>76:30-79:00</strong></p><p><code>onClick(_.sample(value))</code>: the event-processor syntax, no <code>.now()</code> needed.
Business apps: one object per page, components below it, no global state.</p>
</aside></section><section id="errors" class="standard" data-timing="90"><div class="slide-body"><h2><a href="#heading:errors:errors-you-can-see" id="heading:errors:errors-you-can-see" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Errors you can see</h2>
<div class="stack ">
<ul>
<li>Model failures as <strong>values</strong>: <code>Remote.Failed</code>, <code>Problem</code>; render them</li>
<li>One <code>EventBus[Notice]</code> per page for toasts, fed from anywhere</li>
<li>Never let an exception escape an observer: the stream logs it and carries on, <em>silently</em></li>
</ul>
<pre><code class="language-scala">AirstreamError.registerUnhandledErrorCallback(e =&gt; notices.emit(Notice.Bug(e)))
</code></pre>
</div>
</div><aside class="notes"><p class="time"><strong>79:00-80:30</strong></p><p>The unhandled error callback is the safety net, not the plan.</p>
</aside></section><section id="interop" class="standard" data-timing="120"><div class="slide-body"><h2><a href="#heading:interop:borrowing-from-javascript" id="heading:interop:borrowing-from-javascript" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Borrowing from JavaScript</h2>
<pre><code class="language-scala">object Confetti:
  @js.native @JSImport(&quot;https://esm.sh/canvas-confetti@1.9.3&quot;, JSImport.Default)
  def fire(options: js.Object): js.Promise[Unit] = js.native

button(
  &quot;Brew!&quot;,
  onClick --&gt; (_ =&gt; Confetti.fire(js.Dynamic.literal(particleCount = 150, spread = 70)))
)
</code></pre>
<p>Widgets that own DOM: hand them a node on mount, clean up on unmount</p>
<pre><code class="language-scala">div(onMountUnmountCallback(
  mount = ctx =&gt; chart = Chart(ctx.thisNode.ref, config),
  unmount = _ =&gt; chart.destroy()
))
</code></pre>
</div><aside class="notes"><p class="time"><strong>80:30-82:30</strong></p><p>Same pattern applies to jQuery widgets: <code>$(ctx.thisNode.ref).datepicker()</code> in mount, <code>destroy</code> in unmount.</p>
</aside></section><section id="exercise-brew" class="exercise-slide" data-timing="300"><div class="slide-body"><h2><a href="#heading:exercise-brew:exercise-4--celebrate-a-brew" id="heading:exercise-brew:exercise-4--celebrate-a-brew" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Exercise 4 · Celebrate a brew</h2>
<p><span class="exercise-tag">exercises/04-brew</span></p>
<ol>
<li>Extract <code>DoseInput</code> and use it in your potion form</li>
<li>Write a facade for <strong>canvas-confetti</strong> and fire it on a successful save</li>
<li>★ Explosive potions get red confetti and a screen shake</li>
</ol>
</div><aside class="notes"><p class="time"><strong>82:30-87:30</strong></p><p>5 minutes; fine to skip if behind schedule. <code>./sake ex 04-brew</code>: starts from the exercise 2 solution.
Confetti loads from esm.sh, so this one needs the network.</p>
</aside></section><section id="capstone" class="dark-slide chapter-slide" data-timing="15" data-background-color="#2b1d3a"><div class="slide-body"><h2><a href="#heading:capstone:capstone--notebooksc-widgets" id="heading:capstone:capstone--notebooksc-widgets" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Capstone · <em>notebook.sc</em> widgets</h2>
<p>Your Laminar code, inside someone else's app</p>
</div><aside class="notes"><p class="time"><strong>87:30-87:45</strong></p></aside></section><section id="notebook-tour" class="standard" data-timing="180"><div class="slide-body"><h2><a href="#heading:notebook-tour:notebooksc-in-3-minutes" id="heading:notebook-tour:notebooksc-in-3-minutes" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>notebook.sc in 3 minutes</h2>
<div class="columns top">
<div class="stack ">
<ul>
<li>Scala cells form a <strong>dependency graph</strong>: run one, its dependents re-run</li>
<li>The UI is Laminar (of course)</li>
<li>Built-in widgets: <code>slider</code>, <code>select</code>, <code>text</code>, <code>form</code></li>
<li>A widget's value becomes a cell: <code>val heat: Int = 42</code></li>
</ul>
</div>
<div class="stack ">
<pre><code class="language-scala">// cell: the fire
val heatH =
  Widgets.slider(&quot;heat&quot;, 0, 100, 40)

// cell: re-runs when heat moves
if heat &gt; 80 then &quot;💥&quot; else &quot;🫧&quot;
</code></pre>
</div>
</div>
</div><aside class="notes"><p class="time"><strong>87:45-90:45</strong></p><p>Live demo in the notebook: move the slider, the downstream cell updates.
The slider's value lives in a managed cell <code>val heat: Int = 40</code>; the handle (<code>heatH</code>) is for writes.</p>
</aside></section><section id="plugin-contract" class="standard" data-timing="180"><div class="slide-body"><h2><a href="#heading:plugin-contract:the-plugin-contract" id="heading:plugin-contract:the-plugin-contract" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>The plugin contract</h2>
<pre><code class="language-scala">case class Rgb(r: Int, g: Int, b: Int) derives Json.ReadWriter   // upickle

object Main extends LaminarPlugin:                                // notebook-plugin-api
  def view(payload: Signal[String], ctx: PluginContext): HtmlElement =
    val widget = ctx.widgetOpt.get.as[Rgb](Rgb(0, 0, 0))          // value, set, signal
    val colour = Var(widget.value)
    div(widget.signal --&gt; colour, sliders(colour, onChange = widget.writer))
</code></pre>
<div class="columns top">
<pre><code class="language-scala">// a notebook cell
case class Rgb(r: Int, g: Int, b: Int)
  derives ConfiguredJsonValueCodec
val mixH = Widgets.custom[Rgb](
  &quot;mix&quot;, &quot;potions/mixer&quot;,
  config = &quot;{}&quot;, Rgb(180, 40, 120))
</code></pre>
<div class="stack ">
<ul>
<li>Separate bundles: <strong>only JSON crosses</strong>, a case class each side</li>
<li>Unknown plugin? The notebook shows a fallback</li>
<li>The same bundle drives this deck's demos</li>
</ul>
</div>
</div>
</div><aside class="notes"><p class="time"><strong>90:45-93:45</strong></p><p>Kinds are <code>&lt;pluginId&gt;/&lt;name&gt;</code>: one bundle at <code>/plugins/&lt;pluginId&gt;/main.js</code> serves several names via <code>ctx.name</code>.
Full example: <code>modules/notebook.sc/demo/plugins-src/potions/Main.scala</code>.</p>
</aside></section><section id="capstone-options" class="standard" data-timing="120"><div class="slide-body"><h2><a href="#heading:capstone-options:choose-your-potion" id="heading:capstone-options:choose-your-potion" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Choose your potion</h2>
<table class="article-table">
<thead>
<tr><th> </th><th>Widget</th><th>Start in</th><th>Module</th></tr>
</thead>
<tbody>
<tr><td>🧪</td><td><strong>Mixer</strong>: sliders → an <code>Rgb</code></td><td><code>new-widget</code></td><td>1</td></tr>
<tr><td>📜</td><td><strong>Recipe</strong>: a form → a <code>Potion</code></td><td><code>widgets/recipe</code></td><td>2</td></tr>
<tr><td>🔮</td><td><strong>Oracle</strong>: search → <code>List[String]</code></td><td><code>widgets/oracle</code></td><td>3</td></tr>
<tr><td>📈</td><td><strong>Chart</strong>: plots a cell over time</td><td><code>widgets/chart</code></td><td>4</td></tr>
</tbody>
</table>
<p><code>./sake widget recipe WATCH=1</code> · <code>./sake notebook</code></p>
</div><aside class="notes"><p class="time"><strong>93:45-95:45</strong></p><p>Everything lives in widgets/<name>/; see widgets/README.md. The same build shows up in the deck with the demo template.
The lab notebook (notebooks/apothecary.notebook.sc) already has a section wired up for each option.
Mixer: <code>./sake new-widget mixer</code>, the answer is widgets/potions. Others: <code>./sake widget-solution &lt;name&gt;</code> builds the answer.
Remind them: <code>./sake notebook</code> rebuilds every widget first; refresh the browser after a rebuild.</p>
</aside></section><section id="capstone-build" class="exercise-slide" data-timing="1260"><div class="slide-body"><h2><a href="#heading:capstone-build:brewing-time" id="heading:capstone-build:brewing-time" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Brewing time</h2>
<div class="columns ">
<div class="stack ">
<ul>
<li>20 minutes: pair up if you like</li>
<li>Share your notebook: we'll demo 2 or 3 at the end</li>
<li>Finished early? Make two of your widgets <strong>talk</strong> via cells</li>
</ul>
</div>
<div class="laminar-demo-frame"><div class="laminar-demo" data-kind="potions/mixer" data-value="{&quot;r&quot;:120,&quot;g&quot;:60,&quot;b&quot;:190}"><p class="demo-pending">demo: potions/mixer</p></div><output class="demo-value"></output></div>
</div>
</div><aside class="notes"><p class="time"><strong>95:45-116:45</strong></p><p>Walk the room. At 1:50 call time and pick volunteers to show their widgets.</p>
</aside></section><section id="recap" class="standard" data-timing="135"><div class="slide-body"><h2><a href="#heading:recap:what-we-brewed" id="heading:recap:what-we-brewed" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>What we brewed</h2>
<div class="columns top">
<div class="stack ">
<ul>
<li><code>Var</code> / <code>Signal</code> / <code>EventStream</code>, and two arrows</li>
<li>Ownership: subscriptions die with their elements</li>
<li>Validation as a pure function → <code>Signal</code></li>
<li><code>debounce</code> + <code>flatMapSwitch</code> for async</li>
<li><code>split</code> for targeted updates</li>
</ul>
</div>
<div class="stack ">
<ul>
<li>Components: signals in, observers out</li>
<li>Errors are values you render</li>
<li>JS interop with facades and mount hooks</li>
<li>Plugins: Laminar inside <em>another</em> app</li>
</ul>
</div>
</div>
</div><aside class="notes"><p class="time"><strong>116:45-119:00</strong></p></aside></section><section id="thanks" class="title-slide" data-timing="60" data-background-color="#2b1d3a"><div class="slide-body"><h1><a href="#heading:thanks:thank-you" id="heading:thanks:thank-you" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Thank <em>you</em></h1>
<p>laminar.dev · github.com/bishabosha/scaladays-2026-laminar-lab</p>
<p>Now go and brew something</p>
</div><aside class="notes"><p class="time"><strong>119:00-120:00</strong></p></aside></section><section id="appendix-real-server" class="appendix" data-timing="0" data-visibility="uncounted"><div class="slide-body"><h2><a href="#heading:appendix-real-server:appendix--a-real-oracle" id="heading:appendix-real-server:appendix--a-real-oracle" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Appendix · A real oracle</h2>
<pre><code class="language-scala">class HttpOracle(base: String) extends Oracle:
  def searchIngredients(query: String) =
    dom.fetch(s&quot;$base/ingredients?q=${js.URIUtils.encodeURIComponent(query)}&quot;).toFuture
      .flatMap(_.text().toFuture)
      .map(read[List[Ingredient]](_))
</code></pre>
<p>The exercises only depend on <code>Oracle</code>, so this slots in without touching the views</p>
</div><aside class="notes"><p class="time"><strong>Appendix</strong></p></aside></section><section id="appendix-cheatsheet" class="appendix" data-timing="0" data-visibility="uncounted"><div class="slide-body"><h2><a href="#heading:appendix-cheatsheet:appendix--cheat-sheet" id="heading:appendix-cheatsheet:appendix--cheat-sheet" class="anchor-link anchor-link__source"><i class="fa-solid fa-link"></i></a>Appendix · Cheat sheet</h2>
<table class="article-table">
<thead>
<tr><th>I want to…</th><th>Laminar</th></tr>
</thead>
<tbody>
<tr><td>show a value</td><td><code>text &lt;-- signal</code></td></tr>
<tr><td>show a maybe-element</td><td><code>child.maybe &lt;-- signal</code></td></tr>
<tr><td>show a list, keyed</td><td><code>children &lt;-- signal.split(_.id)(…)</code></td></tr>
<tr><td>react to an event</td><td><code>onClick --&gt; observer</code></td></tr>
<tr><td>read state in a handler</td><td><code>onClick(_.sample(signal)) --&gt; …</code></td></tr>
<tr><td>run on mount / unmount</td><td><code>onMountUnmountCallback(…)</code></td></tr>
<tr><td>drop stale async results</td><td><code>flatMapSwitch</code></td></tr>
</tbody>
</table>
</div><aside class="notes"><p class="time"><strong>Appendix</strong></p></aside></section></div><div class="presentation-tools"><div class="fullscreen-control"><button type="button" data-fullscreen="" aria-keyshortcuts="f" aria-label="Fullscreen" title="Fullscreen (F)"><span data-fullscreen-label="">Fullscreen</span></button><span class="fullscreen-status" role="status" hidden="true"></span></div></div></div><script src="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/vendor/reveal/dist/reveal.js"></script><script src="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/vendor/reveal/dist/plugin/notes.js"></script><script src="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/vendor/reveal/dist/plugin/highlight.js"></script><script src="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/deck.js"></script><script type="module" src="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/fullscreen.mjs"></script><script type="module" src="/static/reveal_2f65dbab819cf4a87232b0ede86c0903/assets/demos.mjs"></script></body></html>