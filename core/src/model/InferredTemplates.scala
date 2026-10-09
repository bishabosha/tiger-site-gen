package model

import scala.language.experimental.modularity

/** Infer the template schema from a dictionary, including composed dictionaries. */
trait InferredTemplates extends Theme:
  tracked val templateDefs: TemplateFunctions[?]
  final type Templates = templateDefs.Fields

  /** Forward after initialization, avoiding an eager read of the overriding val. */
  final def templates: TemplateFunctions[Templates] = templateDefs
