---
title: Add method unrolling to Scala 3
description: Enhance the Scala language to support binary compatible addition of parameters.
layout: project
url: https://github.com/scala/scala3/pull/21693
avatar: https://dotty.epfl.ch/project-logo/logo_dark.svg
startDate: 01-Oct-2024
isInProgress: true
---

## About the Project

Implement the specification of [SIP-61](https://docs.scala-lang.org/sips/unroll-default-arguments.html),
which specifies code generation of forwarder methods that match the signature of a method, before a parameter was added.

## Current Status
The [PR](https://github.com/scala/scala3/pull/21693) is open, tracking the current progress.

The feature is implemented, and passing the automated tests. The PR is currently under review from the SIP committee and Scala 3 maintainers.

Done:
- ✅ New annotation `@scala.annotation.unroll` to enable the feature.
- ✅ New phase after typechecking, before pickling, to generate forwarder methods.
- ✅ Detect correct usage of the annotation in prior "posttyper" phase.
- ✅ Lazy transform - only run transform where the annotation is used.
- ✅ Documentation page
- ✅ Report errors with incorrect usage.
- ✅ Detect problematic cases with transparent inline (where forwarders are not yet visible).
- ✅ Test edge cases such as incremental compilation.
- ✅ Test usage on `case class`, `enum`, `class`, `trait` and `object`.

Still to do:
- 🚧 Potentially change implementation based on feedback.
