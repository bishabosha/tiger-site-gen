package model

import scalatags.Text.all.ConcreteHtmlTag
import scalatags.Text.RawFrag

class Layout[C <: model.Context, D <: Doc[?]](
    val run: D => C ?=> ConcreteHtmlTag[String] | RawFrag
):
  /** Adapt a layout explicitly; no structural conformance or context cast is needed. */
  def contramapContext[Host <: model.Context](project: Host => C): Layout[Host, D] =
    new Layout[Host, D](page => (host: Host) ?=> run(page)(using project(host)))

object Layout:
  type Fn[C <: model.Context, D <: Doc[?]] = D => C ?=> ConcreteHtmlTag[String] | RawFrag

  type DataOfLayout[L] = L match
    case Layout[?, doc] =>
      doc match
        case Doc[d] => d

  def apply[Ctx <: Context, Data](
      layout: Layout.Fn[Ctx, model.Doc[Data]]
  ): Layout[Ctx, model.Doc[Data]] = new Layout(layout)
