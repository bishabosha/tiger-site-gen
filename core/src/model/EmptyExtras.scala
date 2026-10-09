package model

/** Finalize an empty extras schema and its context-local record. */
trait EmptyExtras extends Theme:
  final type Extra = NamedTuple.Empty
  final def extras(using SiteContext): Record[Extra] = Record(NamedTuple.Empty)
