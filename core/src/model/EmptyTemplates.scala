package model

/** Finalize an empty local template dictionary. Mounted templates remain available. */
trait EmptyTemplates extends Theme:
  final type Templates = NamedTuple.Empty
  final val templates: TemplateFunctions[Templates] = TemplateFunctions.Empty
