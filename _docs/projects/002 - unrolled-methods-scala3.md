---
layout: project
title: Add method unrolling to Scala 3
description: Enhance the Scala language to support binary compatible addition of parameters.
url: https://github.com/scala/scala3/pull/21693
avatar: https://dotty.epfl.ch/project-logo/logo_dark.svg
startDate: 01-Oct-2024
endDate: 27-Jan-2025
isInProgress: false
---

## About the Project

Implement the specification of [SIP-61](https://docs.scala-lang.org/sips/unroll-default-arguments.html),
which specifies code generation of forwarder methods that match the signature of a method, before a parameter was added.

## Current Status
The [PR](https://github.com/scala/scala3/pull/21693) was approved by the SIP committee and Scala 3 maintainers, merging on January 27th 2025. It will be available as an experimental feature in Scala 3.7.0.

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

Final changes:
- ✅ based on feedback, added more tests, and redesigned the test suite to integrate better - including source file splitting depending on target platform.
