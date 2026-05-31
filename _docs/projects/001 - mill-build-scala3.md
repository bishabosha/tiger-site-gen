```sc
(
  layout = "project",
  title = "Port Mill build.sc files to Scala 3",
  description = "Enhance the Mill build tool (github.com/com-lihaoyi/mill) by " +
    "enabling users to write build.sc files with Scala 3 syntax and libraries.",
  url = "https://github.com/com-lihaoyi/mill/pull/3369",
  avatar = "https://mill-build.org/_/logo-white.svg",
  startDate = "05-Aug-2024",
  endDate = "19-Oct-2024",
  isInProgress = false
)
```
---
## About the Project

The [Mill build tool](https://mill-build.org) lets users write build pipelines in the Scala programming language.
It provides a DSL that makes it simple for users to build a graph of tasks, and dependencies between them, and Mill provides a command line interface to invoke these tasks.

Before starting the project in August 2024, Mill build definitions were locked to the latest Scala 2.13 version.
This prevents users and plugin authors from benefitting from the latest additions in Scala 3, which first launched in 2021.

The goal of this project is to make it possible to use the latest Scala 3 version (as of writing Scala 3.5.0) to define Mill builds.
This isn't a standard migration effort however, as Mill customises the language in various ways:
- Macros to support the direct-style task DSL. (Macros have a brand new API in Scala 3)
- Macros to reflect the tasks to the CLI resolution mechanism.
- Custom Scala parser to detect special imports such as dependencies or the meta-build.
- Compiler plugins to support script files and Module definitions.
- Bytecode analyzers to detect changes in the build.

## Current Status
My work and open [Pull Request](https://github.com/com-lihaoyi/mill/pull/3369) was transferred to the Mill project maintainers on November 1st 2025, where the PR remained open while the 0.12.0 Mill release was co-ordinated. The PR was merged On February 1st 2025, concluding the project.

Done:
- ✅ Check that bytecode analyzers work with Scala 3
- ✅ Discover macro
- ✅ Applicative macro
- ✅ Caller macro
- ✅ Cross.Factory macro
- ✅ EnclosingClass macro
- ✅ Task macros
- ✅ Cacher macro
- ✅ Moduledefs compiler plugin (override inferrence)
- ✅ All core Mill modules compile with Scala 3.5.0
- ✅ Fix Zinc reporter patch linenumbers of build scripts
- ✅ Fix all library dependencies
- ✅ Identify any possible hidden bugs discovered by testing Scala 3 code.
- ✅ Support new Scala 3 syntax in build.sc files

Further work left open:
- 🚧 Port acyclic plugin to Scala 3

Here is a gif of compiling a Mill project where the build.sc file is compiled with Scala 3.5.0:

![](/static/img/projects/mill-scala3-milestone1.gif){.img-fluid alt="compiling a Mill project where the build itself is compiled with Scala 3.5.0"}

## Progress Diary

Below is a log of the progress made on this project.

### 2024-aug-05

- Setup project, reading build definition
- Asked Haoyi about acyclic plugin
  - Conclusion \- ignore for now, nice to have
  - Remove it from compile deps when scalaversion is 3.x
- Build definition is pretty big \- so i discover the entry points to try and work backwards
  - `mill.runner.MillMain`, `mill.runner.MillServerMain`, and `mill.main.client.MillClientMain`.
- Also look at understanding how the inprocess example test suites are invoked,
  - Starting from command `./mill 'example.basic[1-simple].local'` I see in the build that `example.basic` is a cross module, and inside that the `local` module extends `TestModule`.
  - I show the `discoveredTestClasses` target on `example.basic[1-simple].local` and find that it is running `mill.example.ExampleTestSuite`.
- Understanding how `mill.example.ExampleTestSuite` works.
  - See that in `local` mode it invokes the mill launcher produced by `dev.launcher` repeatedly. (which invokes the `mill.main.client.MillClientMain` class)
  - `mill.runner.MillServerMain` gets started by MillClientMain, before running the main of `mill.runner.MillMain`
- Looking at `MillBuildBootstrap`
  - Found the part where Mill parses build.sc files.
- Try to build the `dev.runner` target by changing `scalaVersion` to `3.5.0-RC6`.
- First update the tasks in the `bridge` cross module to resolve the dotty sbt-bridge module.
- Edits to `main.api` module:
  - Had to fix some extension method problem with Array.map
  - Manually define Mirror for JarManifest (to derive upickle RW) because it isn’t a case class.
  - Agg had some new problems automatically mixing-in collect and zipWithIndex, so they are overridden manually. Also \++ is final so override in Agg is removed
- Edits to `main.util` module:
  - Use 2.13 binary suffix in coursier dep
  - Fix extension method issue with coursier.ResolutionExtensions
- Edits to `main.define` module:
  - Remove `mill-moduledefs` plugin temporarily \- will be necessary later to support `override` insertion.
  - Don’t include `scala-reflect` on classpath
  - Use 2.13 binary suffix in jarjarabrams dep
  - Comment out macros definitions in `Task.scala`

### 2024-aug-06

- Edits to `main.define` module:
  - (identified fastparse usage in `Reflect.scala`)
  - Comment out macros in `Discover.scala`
  - Comment out macros in `Applicative.scala`
  - Copy implementation of `mill.moduledefs.Cacher` for `Module.BaseClass`.
  - Comment out macro of `Caller.scala`
  - Comment out Factory macro in `Cross.scala`
  - Comment out macro of `EnclosingClass.scala`
  - Comment out macro impl in `Task.scala`
- Edits to `main.eval` module:
  - Change syntax of explicit context parameter passing
- Edits to `main.resolve` module:
  - Change syntax of explicit context parameter passing
  - (identified fastparse usage in `ExpandBraces.scala`)
  - (identified fastparse usage in `ParseArgs.scala`)
  - Change syntax of pattern matching for comprehension
- Edits to `main` module
  - Remove scala-reflect from compile classpath
  - Copy implementation of `mill.moduledefs.Scaladoc` for `MainModule.scala`.
  - Make `Target.log` inline (in `main.define`) so that it drops the ctx argument (avoiding compiletimeonly errors)
  - Make `Applyer.ctx()` inline (in `main.define`) so that it drops the ctx argument (avoiding compiletimeonly errors)
  - Make `Applyable.apply()` inline (in `main.define`) so that it drops the handler argument (avoiding compiletimeonly errors)
  - Temporarily remove ctx argument from `ClassLoader.create` in (in `main.api`)
- Edits to `scalalib` module:
  - Use 2.13 binary suffix on `scalafmt-dynamic` dep
  - Temporarily add `@mainargs.main` annotation to `IvyDepsTreeArgs` so compilation continues \- opened [https://github.com/com-lihaoyi/mainargs/issues/143](https://github.com/com-lihaoyi/mainargs/issues/143) to track problem
  - Fix syntax of lambda parameters
  - Reimplement `scala.tools.nsc.io.Streamable.bytes`
  - Generate Mirrors for types in `JsonFormatters.scala`
  - (identified fastparse usage in `VersionParser.scala`)
  - Comment out majority of `PublishModule.scala`
- Now I am seeing that `Task` is pretty much everywhere at this point, and too much to comment away/remove `Ctx` from signatures, so likely not going to progress much without implementing it properly.
  - Remove any `compileTimeOnly` annotations (for now)
  - Restore signatures of `ctx` accessors in `Tasks.scala`, and `Applicative.scala`, and restore `ClassLoader.create`.
  - Restore all code in  `PublishModule.scala`
  - Add import to help derive RW for `PublishData`.
- Edits to `scalalib.worker` module:
  - Change classpath of zinc module and scalap
- Edits to `scalajslib` module:
  - Generate Mirrors for classes and objects in `ScalaJSApi.scala` and `Report.scala`
- Edits to `bsp` module:
  - Generate mirrors for `BspServerResult`
- Edits to `codesig` module
  - Fix syntax and type inference
- Edits to `runner` module
  - Temporarily remove `linenumbers` dependency
  - Fix lambda syntax
  - Fix explicit context bound passing
  - (identified fastparse usage in `Parsers.scala`)
  - Temporarily disable mainarg parsing for `MillCliConfig`. (because of a crash caused by a type mismatch in default parameters)
- Edits to `dev` module:
  - Comment out some contrib deps not necessary to run example.basic test suite,
  - (also some minor fixes to classpath of contrib.bloop, and syntax of contrib.buildInfo)
- Now I can run `example.basic[1-simple].local` but it fails due to all the `???` I added in.
  - Primarily the `MillCliConfig` mainargs parser \- so we can work backwards from this.

### 2024-aug-07

- I cloned a local version of mainargs to try and debug the problem in `MillCliConfig`.
  - First I tried to print the actual types of the arguments that were mismatched, it turned out I got a `Leftover[String]` when `Flag` was expected.
  - Then i printed the parameters of the apply method that was selected, it turned out it was the overloaded “shim” apply method.
  - So I published locally a fix to mainargs to select the apply method where the names of parameters match the class constructor. (in reality perhaps we should invent a new annotation to deterministically declare which method to pick for the class parser?)
  - Also took the opportunity to create a default main annotation if none was found. So i removed main annotations from `MillCliConfig` and from `IvyDepsTreeArgs`
- With the locally published mainargs, i updated the mill build to use it, and could revert any changes made previously and the build worked.
- Now the next unimplemented error in `example.basic[1-simple].local` is the `Discover` macro.
- Edits to the `main.define` module:
  - I implement the `Discover` macro, it seems to be mostly portable exactly as before \- i notice however it does a funny thing \- it imports all the given `TokenReaders` from the `main` module, which is not possible to do in quotes because they must be well typed at definition.
  - When i run the discover macro on `RootModule.Foreign` it crashes because for some reason the typeMembers returned by dotty includes the NoSymbol, so i had to explicitly filter that out \- however that should be a bug in dotty.
  - Next error \- there is an “reference to parameter `b` was used outside its scope in inlining phase”, which is an internal dotty error so i can’t catch it in the macro. By searching for `b:` In both mill and mainargs, i found that `b` is the parameter of a quoted lambda in the `mainargs` library \- because I renamed it to `bSpooky` and the error message changed accordingly.
  - Turns out it was solved by swapping the type arguments of createMainData,
  - Now the problem is that mainargs does not do varargs adaption \- e.g. `MainModule.clean`
  - Implement in mainargs the varargs adaption trick copied from upickle.
  - Next I saw that the default argument parsing for mainargs was again incorrect when there are several overloaded commands. I ignore defaults in mainargs when the method has no defaults by checking for the flag HasDefaults.
  - Now there is one last discovery error: “`invalid new prefix  = JavaModule.this.JavaModuleTests cannot replace (JavaModule.this : mill.scalalib.JavaModule) in type JavaModule.this.JavaModuleTests`” not sure where this comes from, will need investigation. \- The problem was to do with path dependent types \- mainargs isn’t resolving default accessors properly, because it needs a prefix to select from.

### 2024-aug-08

- Edits to the `main.define` module:
  - I filter out synthetic methods in the discover macro, (i found that a superaccessor was being generated as a command \- due to an override)
  -  also switch to only scanning module values in Discover.
  - In lieu of fixing mainargs, i manually created a Discover instance with code gen for `MillBuildBootstrap (MillBuildRootModule.BootstrapModule)` \- which was a pain.
  - I fixed mainargs to select the default getter from the lambda parameter, which means it works for non-static getters. So i deleted the manual discover instance, and could restore any commented out Discover macro callsites.
  - Now all `Discover` macro call sites are building (perhaps implementation is still not 1:1 with scala 2? Needs more testing)
  - Now the next `unimplementedError` problem in the `example.basic[1-simple].local` test is `Caller` macro.

### 2024-aug-09

Trying to implement the caller macro \- it seems not possible to implement correctly in extends clauses \- so i opened [https://github.com/scala/scala3/issues/21358](https://github.com/scala/scala3/issues/21358) \- perhaps we should have 2 subclasses of `Caller` so one is for methods (where enclosing class is correct), and one for extends clauses (where we need to get the class outside the current class) \- waiting on comment from Haoyi

- Based on comment \- i remove the `Caller.generate` macro, instead define an implicit within Module that returns itself \- this will perform the equivalent as the macro
- Now next unimplementedError in `example.basic[1-simple].local` is `Target.apply`

### 2024-aug-12

- Attempting to fix the Target.apply macro \- for now i construct the TargetImpl object with placeholder values \- now Applicative `defaultApplyHandler` (previously compiletimeonly) is being reached, so we do need to implement the `Target.apply` macro to eliminate this.
- Start implementing Task.apply (implicit conversion macro) \- and implement detection of if target owner is private \- but now i need two other macro definitions \- Cacher.impl0 and Applicative.impl0
- Implemented Applicative macro \- needed to manually pass in the caller rather than `c.internal.prefix` \- this isn’t part of quoted api. Also I needed to add more precise types to help with actually typing the inner expression.
- This lead to the `Target.task` macro being next to fail, so I implemented that, followed by `Target.sources` (`sourcesImpl2`), followed by `Target.inputs` and finally `Target.sources` (`sourcesImpl1`).
- Now at this point i get to `MillBuildRootModule.lineNumberPluginClasspath` in the example test, and it tries to evaluate `defaultApplyHandler` \- so either this macro wasnt handled yet, or there is a bug in the macro to not eliminate it. However it seems to just be `Task.apply` (with result input) is not implemented.
- Next `defaultApplyHandler` is from ScalaModule.compile \- which is the unimplemented `T.persistent` macro
- Next was failing the `Target.worker`.
- Then `Target.apply` (of a Task)
- Next only errors were to fix the `???` in coursier module, but now i have a test failure that isn’t to do with unimplementedError \- so will need to debug that. But for now i will focus on restoring compileTimeOnly annotations to be sure rewrites are correct.
- Now implementing all remaining Target macros
- Determined that the fault is due to the default classpath of the mill bootstrap module \- will have to enable more debugging info so i can see exactly what isn’t resolved.

### 2024-aug-13

- Classpath resolution is failing in an opaque manor, because it is just throwing an exception inside a task \- so I added a new `resolveDeps0` method to the `CoursierModule.Resolver` that returns its resolution as a `Result`, this means we can propagate resolution errors correctly to the `ScalaModule.scalaCompilerClasspath` task.
- Identifying the missing dependencies as some compiler plugins so need to remove those temporarily.
- Then ZincWorkerImpl was having issues resolving `scala-library` from the compiler classpath when building the `mill-build` task \- which is correct as the resolution of the `Lib.scalaRuntimeIvyDeps` deps was excluding `scala-library` \- which i discovered by printing the deps before resolution. This exclusion comes from `MillBuildRootModule.resolveDepsExclusions` as it is part of the classpath of mill itself \- so i made an exception to excluding the scala-library for the mill root build \- perhaps there is a better and localised solution?
- Next i discovered in running example test that the generated script file discover macro needed explicit TokenReader imports so added that.
- Now i can actually run many integration tests out of the box \- e.g. `example.tasks[1-task-graph].local`. \- i am still relying on my locally published mainargs however \- so should quickly submit some PR for that to be released.
- With some integration tests passing locally I opened a [PR to Mill](https://github.com/com-lihaoyi/mill/pull/3369)
- Some features which are necessary to pass more integration tests are
  - `mill-moduledefs` compiler plugin to infer override keywords, and insert annotations that record scaladoc comments. (although we can access the scaladoc of a method via macros? \- it seems java reflection resolves this info in the task but maybe we could redesign)
  - `mill-runner-linenumbers` compiler plugin to fix line numbers of trees (is this even allowed in dotty?)
- Got encouragement to open a mainargs PR to add my fixes - so then prepared my changes for a PR \- while adding restoring unit tests for vararg handling, i noted that the parsing at runtime was actually incorrect \- so what was needed is to copy the Scala 2 implementation \- convert the parameter type from `T*` to `Leftover[T]` to create the `ArgSig`. Then at the callsite you still need a vararg value, but the argument will need to be converted from `Leftover[T]` back to `T*`. I will add unit tests for the path dependent type handling of default args, Classparser for classes without `@main`, and the overloaded apply method in companion for classparser.

### 2024-aug-14

- Spent the day adding unit tests to mainargs to prepare for a pull request, [opening it](https://github.com/com-lihaoyi/mainargs/pull/148) at the end of the day.
- Also forked the mill-moduledefs repo, fixed the build.sc to set up cross building both library and compiler plugin for scala 2.13 and 3.5.0.

### 2024-aug-16

- [Mainargs PR](https://github.com/com-lihaoyi/mainargs/pull/148) was merged, released in version 0.7.2. I updated my [Mill PR](https://github.com/com-lihaoyi/mill/pull/3369) to include the new dependency and GitHub actions CI now records several integration tests passing, such as `example.tasks[6-workers].local`

### 2024-aug-20

- Implemented the `EnableScaladocAnnotation` phase in the mill-moduledefs compiler plugin. It’s greatly simplified from scala 2 as dotty makes it easy to access documentation for symbols, and Its easier to create annotations. I had to make some tweaks \- adjust `runsAfter` to be `”posttyper”` rather than `”parser”` (standard plugin must be after typer). Also I had to adjust `build.sc` again to hardcode the artifact name due to the outer module now being a cross module.

### 2024-aug-21

- Implemented the `AutoOverride` phase in mill-moduledefs, now the plugin is finished \- opened a [PR](https://github.com/com-lihaoyi/mill-moduledefs/pull/14) after some cleanups.
- Fixed the `millProjectModule` to have `_3` suffix by default \- now all of example.basic integration tests are passing except `4-builtin-commands` \- for some reason the `showUpdates` command is failing \- upon investigation \- it seems that it is overloaded, and the `Discover` macro picks the wrong one (i.e. the deprecated one with no default arguments) \- will need to fix this.
- Went with the fix of filtering out deprecated methods in the Discover macro, which fixed the test. Now all `example.basic` tests are passing locally. Next for integration tests would be the `Cross` macro.
- Next I discovered that my patch to build scripts to include the empty package prefix was wrong \- multi build roots now mean that there can be nested packages in the prefix \- so I adjusted the code generation there \- now passing all of `example.misc` tests.

### 2024-aug-22

- [mill-moduledefs PR](https://github.com/com-lihaoyi/mill-moduledefs/pull/14) was merged, changes released in 0.11.0-M1. I rebased my Mill PR, which revealed another type inference issue (solved with an explicit type).

### 2024-aug-23

- Began work on `Cross.Factory` macro. I realised I could not proceed without using the experimental methods `Symbol.newClass` and `ClassDef.apply`. Moreover, these methods are not adequate because they do not allow to customise the primary constructor, which was necessary to add the Context parameter. I knew I would have to rely upon compiler internals \- so I decided to implement a Shim interface in the `mill-moduledefs` library, with an implementation provided by the `scalac-mill-moduledefs-plugin` library. I tried this and realised that the plugin library isn’t on the classpath when loading macros, so this didn’t work.
- I asked the Discord channel for advice and Haoyi said it would be permissible to use compiler internals even in the `main.define` module.

### 2024-aug-27

- I implemented the Shims inside `main.define` module and finished the `Cross.Factory` macro

### 2024-sep-04

- Cleaned the code and pushed my changes to implement the `Cross.Factory` macro.

### 2024-sep-06

- Investigated and fixed two problems related to the `Discover` macro:
  - A. not scanning correctly the type argument of a cross module
  - The scala 2 method of an immediately invoked closure (to split bytecode into manageable size) was optimised away, so the large-project integration test was failing \- changing this to an explicit def avoids the optimisation, so the test works again.
- At this point \- it would seem most test failures are now due to misconfiguration of classpath dependencies. I need to investigate the `linenumbers` compiler plugin, before I can attempt to support new scala 3 syntax.

### 2024-sep-09

- Decided to try porting `linenumbers` compiler plugin, or find an alternative.
- Dotty will not allow a plugin to mutate source positions before type checking. Therefore we should modify positions via the reporter.
  - There are two reporters: one in the BSP module, and one in the zinc worker. We need to share where possible the logic to fix positions.
- I copied some logic from the `LineNumberPlugin` to the `ZincWorkerImpl` (identify build files) \- still need to compute the updated positions. There is a bit of help already via the `ManagedLoggedReporter` which accepts a function argument to remap positions.

### 2024-sep-10

- Worked on rendering the correct positions for the reporter in `ZincWorkerImpl`, and also replicating the style of the console error reporter from dotty. (Still remains to share/copy the logic in the BSP module’s reporter)

### 2024-sep-11

- Fixed remaining `integration.failure` tests that check compiler error messages (note: line number, column, and “kind” of error were unchanged, but other elements of messages were compiler specific)
- Moved `integration.failure[things-outside-top-level-module]` to `integration.feature` to account for the fact that top-level definitions are generally allowed in Scala 3 (after approval from Haoyi).
- Moving on, it seems that the CodeSig checker is incorrect (`integration.invalidation[codesig-hello]` fails)
- Fixed compilation issues in the unit tests for codesig `main.codesig.test`. \- Now I can identify that at least 1 method hash test fails, and three call graph tests.
- I analysed the byte code of the failing method hash test, and I see that the failing method fails due to changing the line where `sourcecode.Line` is summoned. So my assumption is that something changed between scala 2 and 3\. I then compared bytecode outputs of the programs when compiled by Scala 2 or 3\. In scala 2 the macro generates `new Line(n)` but in Scala 3 it is `Line.apply(n)`. I then went to the PR for adding CodeSig, and i see a footnote that the “new Line” pattern is special cased \- so that will need to be fixed (either in sourcecode, or in CodeSig)
- Fixing the special casing did help with the methodhash test, but the callgraph tests are still failing. In particular \- for `basic.18-scala-anon-class-lambda`,`complicated.8-linked-list-scala`,`realistic.4-actors`, `realistic.5-parser`,
- The problems with `8-linked-list-scala` and `4-actors` were caused by changes in inference semantics for private fields, and for overridden methods (which i fixed by updating the code of the test, rather than Codesig implementation). The `5-parser` test will be much harder to validate as the internals of fastparse’s macro changed \- I might just have to copy the new result and identify any  regression when fixing other tests.

### 2024-sep-12

- I determined that the problem with `18-scala-anon-class-lambda` is that its bytecode was dependent on how scala 3 does specialisation, so i replaced it and `17-scala-lambda` with a similar SAM that isn’t specialised.
- Then i changed `5-parser` as i assumed, and it was only additions, no changes of other methods, so i believe it is safe. So now all `main.codesig.test` unit tests were passing \- not explaining the problem in the integration tests.
- Then I updated dependencies for scalatags and scalaj-http, to enable invalidation tests to run. By enabling some verbose logging i saw that for `[codesig-hello]` the class was recompiled after changing the implementation. So then I decided to compare the bytecode of compiling the build.mill file in scala 2 vs 3\. It seems scala 3 has a different naming convention for lambda functions, which I will investigate as the cause of not tracking the changes.

### 2024-sep-13

- Investigating the causes for `[codesig-hello]` to fail, I then run the same test on the `main` branch (i.e. with Scala 2 implementation) \- with debugging turned on, i can compare the outputs of the `methodCodeHashSignatures.dest` in the failing part (i.e. changing the body of `foo` had no effect). I saw that in `prettyCallGraph.json` that for some reason there is no call recorded to the no-arg lambda implementation of foo (which gets passed to Cacher), when there was in Scala 2 implementation. Eventually i checked the ignoreCalls filter in `MillBuildBootstrapModule` and it was clear that the lambda function was ignored because it was treated as a “simple target” because it has no-args. This is a consequence of the lambda encoding of scala 3, which uses instance methods, not static ones. So i taught the filter to look for lambda methods and it passes the test. Next was failing `[codesig-scalamodule]`. Originally i could see output was including extra warnings due to indentation changes caused by inserting newlines as part of the test. So i corrected the indentation. The test still failed due to the old version of `sourcecode` being on the classpath when compiling the build.mill file. I fixed this with an explicit dependency on sourcecode in the main.define module \- I should check which module first depends on it. Now all codesig tests were passing.

### 2024-sep-14

- To fix `integration.invalidation[multi-level-editing].local`, i noticed that the meta-build dependency on scalatags was bringing in a conflicting scala 2 version of sourcecode, preventing the build.mill file from compiling. I instead changed to a scala 3 version in the metabuild, and updated the scalatags dependency
- I then re-enabled publishing of test deps for the playlib and scoverage contrib modules, fixing a few more tests
- I toyed around with fixing `integration.feature[plugin-classpath].local`, but this seems harder to fix. Essentially the plugin brings in a conflicting old dependency of mill (i.e. with scala 2 binary version). Either i have to exclude the dependency and hope nothing breaks, or build the metabuild with a suitable scala 2 version. I parked this for now.

### 2024-sep-15

- To fix `integration.ide[gen-idea].local`, I had to fix some xml generation code which relied upon implicit conversions that no longer work in Scala 3\. I also had to update some checkfiles to account for the updated versions.
- I enabled all contrib test module dependencies, fixing necessary compile errors.
- Next, i fixed the `integration.feature[init].local` test by updating the classpath of the Giter8 module in scalalib. I noticed that a dependency resolution error was not being reported so i ensure that it does.
- I also removed the deadcode linenumbers module.

### 2024-sep-16

- Rebased the PR against Main, in which I had to tweak `CodeGen` to account for the new structuring of json formatters and TokenReaders.
- `CodeGen` also had to be tweaked to generate the Discover value in the same wrapper object as the user code. If not, then path dependent types would not match when trying to summon `mainargs.TokenReaders[Foo]` if `Foo` was a custom type. This meant having to merge all the Discover values from child modules (from `package.mill` files), and also substituting `classOf[package_]` for `classOf[package_.type]` in the map.
- ^ it might be possible in `mainargs` to substitute the prefix of the caller when summoning `TokenReaders` which would make this “hack” unnecessary, but it is unverified if it could work.
- I also reimplemented the `contrib.scoverage.api` module to be java based, so it didn’t matter if the scala version was not compatible with the underlying scoverage library API.

### 2024-sep-17

- Skipped the test `integration.feature[plugin-classpath].local` as it depends on a third party Mill plugin, not binary compatible with the scala 3 version of mill

### 2024-sep-19

- Fix classpath resolution problems with contrib twirllib and contrib playlib

### 2024-sep-20

- Fix warnings about `scala.AnyKind` in the `contrib.proguard` tests
- Remove a test source from being compiled in `example.thirdparty[3-mockito].local` because it often failed in the CI (and it isn’t a necessary test to prove mill can substitute as the build tool)
- Fix contrib.scoverage integration test
- Filtered a problematic file from scalafmt checks (due to outdated scalafmt dependency)
- Skipped checking scalafix in scala 3 sources, because the scalafix-interfaces library does not support reflectively loading the scala 3 scalafix library.
- Patched Mima checks to correctly load the previous jar (accounting for platform suffix changes)
- Then skipped the mima checks because there were 1000s of (expected) errors.
- Patched any remaining failures due to not reformatting with scalafmt
- Generated a patch file so that the `ci/test-mill-bootstrap.sh` test passed.
- Managed to pass all tests in the CI on the PR \#3369

### 2024-sep-21

- Created initial `integration.feature[scala-3-syntax]` test, which failed due to fastparse’s “scalaparse” being inadequate.
- Fixed a problem with the new Zinc error formatter which broke ansi escape codes.
- Experimented with reimplementing scalaparse from dotty’s grammar, but it was taking too long.
- Investigated scalameta as a possible parser. Haoyi preferred to reuse dotty’s parser to reduce dependencies, it was also decided to only support the same version as mill is built with.

### 2024-sep-23

- I abstracted the necessary parsing operations `splitScript` and `parseImportHooksWithIndices` into a trait, in a new `runner.worker-api` module. The existing `runner.Parsers` object implements the trait for Scala 2, and the Scala 3 implementation was stubbed in a `runner.worker` module, which an instance for should be loaded via reflection.
- Next I abstracted the `FileImportGraph.parseBuildFiles` method over the new parser trait, which is called in `MillBuildBootstrap` (i.e. before we load `MillBuildRootModule`). This posed a challenge for how to resolve and load the `mill-runner-worker` library reflectively.
- I implemented the steps to load a worker instance are as follows:
  - Resolve in `MillMain` the dependencies `mill-runner-worker` and `scala3-compiler` to a classpath and reflectively load the runner.
  - Pass the worker and resolved classpath to `MillBuildRootModule.BootstrapModule` which then re-uses it in its own `parseBuildFiles` task.
  - The pre-computed worker classpath is then used in `generateScriptSources` to write the classpath to the generated `MillMiscInfo` which can then resolve the worker the next time the class is loaded.

### 2024-sep-24

- I implemented the first part of scriptSplitting \- setting up the compiler to run only the parser phase, and report any errors \- I implemented my own error formatting, as I wasn't sure if I would need to manipulate positions again.
- I also tweaked the SkipScalafix Mill module so it can call the super.fix (by moving scala version from a task to a method)
- I then realised it wasn’t necessary to run the proper compiler pipeline, I could initialise a context with a source file and reporter, then create an outline parser directly. I then traversed the output to extract the top-level packages, and top level statement strings by creating slices of the source file content for the span of each statement, and slices of the whitespace in between.

### 2024-sep-25

- I noticed there was a long delay in loading the standard definitions, so I wanted to see if it was possible to cache the initial context loading. I discovered by re-running split script 10000 times concurrently with futures that parsing had to be synchronized, but it was safe to share the same initial context
- I then discovered that actually the standard definitions did not need to be initialised before parsing, so this saved another initial load time.
- Implement import parsing \- i had to fix a mistake in script splitting, because in dotty comma-separated imports are treated as separate statements. However they are not able to be parsed standalone from text, so I had to pack them all together as one statement
- Implemented top-level object scanning (compatible with scala 2), however i needed to extract more information to be compatible with Scala 3 \- a possible end marker (for renaming `` `package` `` to `package_`), and also the problem with path-dependent types in the discover macro also needed to be applied to when the user provides an explicit top level object. This means i had to extract a suitable position to splice in code within the user code (i.e. within an object), so i extracted the position of the initial statement

### 2024-sep-26

- Back to top-level object scanning, I realised that splicing at the top of user code would require more hacking with positions in the reporter, so I changed to extract the position of the final statement instead.
- Then I rebased against main, and refactored my scala 3 parsing code to remove leftovers from implementing.
- When running the `ci/test-mill-bootstrap.sh` test, it crashed when parsing the build with the new parser \- this was due to not escaping EmptyTree from the outline object parser (if it turns out that it causes more pain then needed, we can revert to the regular parser) \- i fixed the broken `atSpan` method.
- Pushed the scala 3 parser and syntax test to the main PR
- Next, cleanup and refactoring the new `runner.worker` module
- Add `runner.worker.testDep` to `dist0`, making it available to integration test `local` modules
- Recomputed the `ci/mill-bootstrap.patch` file
- Noticed in the CI an error \- mill files should allow expressions at the top-level \- so i adjusted the parser to treat block statements as top-level statements.
- I also noticed a crash caused by stray EmptyTree’s being returned in the parser, so escaped those

### 2024-sep-27

- Noticed another parsing error in the CI \- need to filter out EmptyTree returned by scanning ModuleDef bodies
- Fixed another minor issue (include backticks in package names)
- Then i noticed that parsing mill statements with blockStatSeq prevents access modifiers, so i changed to templateStatSeq, (and skipping self-defs)
- Added some stronger checking of spans on trees to ensure they exist in the source code.
- Fixed parsing of backticked object names
- Fixed the column number of parser error messages emitted by dotty.
- Fixed the `ZincWorkerImpl` reporter to account for user-written code that can appear after spliced `__innerMillDiscover` definitions.
- Escaped more `EmptyTrees`
- Added a prelude to parser errors `s”${file} failed to parse:\n”`
- CI on PR is now green [🎉](https://emojipedia.org/party-popper)
- Validated that the BSP reporter forwards messages from the Zinc reporter, so no adjustment of positions was needed.

### 2024-oct-10

- Rebased the `scala3-build-sc` against `com-lihaoyi:main`.
- Added `case` modifier to objects in `KotlinJSModule` - this was new code, but without the modifier, we would need to generate Mirror objects as we did previously.
- Adapt the `Applicative` macro.
  Caller `this` trees are no longer always an `Applicative.Applyer`, so resolving `traverseCtx` is no longer static.
  I made two reimplementations, first, resolve the method via quoted reflection API, and check the types manually.
  This avoids boilerplate at call site, but maybe less elegant.
  The second implementation passes a lambda that will construct the call to the right `traverseCtx` method, when provided with argument Exprs.
  This second option requires more boilerplate at the call-site, but is more resilient to API changes.
- fixed various type and syntax errors introduced by newer code added in the base branch.
- Re-introduced the `millDiscover` method in `RootModule.SubFolder`, in the scala 3 code gen we need to explicitly generate discover in child modules, and merge in the main module.
  If it is possible to substitute the correct prefix in `mainargs` library, e.g. for custom types, we can revert this change.
- After pushing to CI, there is a new test failure that tests output of inspect command for Modules - new code which might behave differently in Scala 3.

### 2024-oct-12

- Rebased again
- Replaced the manually generated mirrors from `manual_mirror_gen.sc` with a new macro in `mill.api.Mirrors`.
  - User declares a single `Root[Foo]` given, which is generated by a macro.
  - Root stores all possible mirrors for subclasses of `Foo` (including itself).
  - It tries to be conservative in what it generates, so it doesn't generate mirrors for case class / case object.
  - another macro `Mirrors.autoMirror` can provide a given `Mirror.Of[T]`, as long as there is a given `Root[R]`,
    and it can construct a proof that a mirror for `T` is contained in the root.
- The new macro saves a lot of boilerplate - i.e. only 1-2 lines per class hierarchy. (+ 1 line for imports)

### 2024-oct-13

- Haoyi mentioned that the linenumber changes should be propagated to the backend, so I investigated reviving the compiler plugin to edit positions.
- Plugins can only be installed after type checking, so we would need to keep the Zinc reporter changes,
- However I did an initial implementation that followed the same transform as performed by the Zinc reporter.
- Unfortunately, the linenumbers were still incorrect in the bytecode.
- I investigated the Scala 3 compiler backend to see how line numbers are generated.
  I saw that it is by looking at the line number of the offset in the position,
  in the source file of *the current compilation unit*, rather than in the source file of the position.
- This is a problem because when we remap the positions in the plugin, we change both the offset, and the source file, so the computation in backend is incorrect.
- It's still possible to mitigate this without patching the compiler, i.e. we can collapse the position to be zero-length.
  - We have to do a two-stage transform: compute the line of the position in the original file,
  - then lookup the offset of the start of that line in the current source file.
  - this position will compute the right line number in the backend, however the reporter will render completely incorrect code.
    So, the reporter must be patched to re-direct the offset to the right line in the original script file.
- The plugin would also have to patch line numbers computed by the `sourcecode.Line` macro,
  and the name computed by the `sourcecode.FileName` macro,
  due to the difference in how macro expansion positions are computed.

### 2024-oct-14
- The linenumber transform in the plugin is lossy and complex, so I made a patch to the compiler
  so the backend computes the line from the source file of the position.
