package model

import scala.language.experimental.modularity
import scala.NamedTuple.AnyNamedTuple

/** Infer Extra from a deferred definition. Each context evaluates it once. */
trait InferredExtras extends Theme:
  trait ExtraDefinition:
    type Out <: AnyNamedTuple
    def build(using SiteContext): Record[Out]

  /** Keep the overriding definition's Out refinement available through Theme.Extra. */
  tracked val extraDefs: ExtraDefinition
  final type Extra = extraDefs.Out
  final def extras(using SiteContext): Record[Extra] = extraDefs.build

  /** Defer an existing extras record, retaining its exact schema. */
  protected final def defineExtraRecord[E <: AnyNamedTuple](body: SiteContext ?=> Record[E])
      : ExtraDefinition { type Out = E } = new ExtraDefinition:
    type Out = E
    def build(using SiteContext): Record[E] = body

  /** Defer a named tuple and infer its schema, including path-dependent mount types. */
  protected final def defineExtras[E <: AnyNamedTuple](body: SiteContext ?=> E)
      : ExtraDefinition { type Out = E } = defineExtraRecord(Record(body))
