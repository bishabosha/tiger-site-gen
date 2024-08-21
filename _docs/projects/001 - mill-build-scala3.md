---
title: Port Mill build.sc files to Scala 3
description: Enhance the Mill build tool (github.com/com-lihaoyi/mill) by enabling users to write build.sc files with Scala 3 syntax and libraries.
layout: project
url: https://github.com/com-lihaoyi/mill/pull/3369
avatar: /static/img/mill-logo-white.svg
startDate: 05-Aug-2024
isInProgress: true
---

## About the Project

The [Mill build tool](https://mill-build.org) lets users write build pipelines in the Scala programming language.
It provides a DSL that makes it simple for users to build a graph of tasks, and dependencies between them, and Mill provides a command line interface to invoke these tasks.

As of August 2024, Mill build definitions are locked to the latest Scala 2.13 version.
This prevents users and plugin authors from benefitting from the latest additions in Scala 3, which first launched in 2021.

The goal of this project is to make it possible to use the latest Scala 3 version (as of writing Scala 3.5.0) to define Mill builds.
This isn't a standard migration effort however, as Mill customises the language in various ways:
- Macros to support the direct-style task DSL. (Macros have a brand new API in Scala 3)
- Macros to reflect the tasks to the CLI resolution mechanism.
- Custom Scala parser to detect special imports such as dependencies or the meta-build.
- Compiler plugins to support script files and Module definitions.
- Bytecode analyzers to detect changes in the build.

## Current Status
As of August 21st 2024, the project is in progress, but most macros are ported, meaning that we can compile all of core Mill, and even compile some builds.
Override inferrence is now implemented (See [mill-moduledefs PR](https://github.com/com-lihaoyi/mill-moduledefs/pull/14)).

The next step would be to port the cross-module macros, which should pass all existing integration tests.

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
