package model

import scalatags.Text.all.ConcreteHtmlTag
import scalatags.Text.RawFrag

class Layout[C <: model.Context, D <: DocPage[?]](
    val run: D => C ?=> ConcreteHtmlTag[String] | RawFrag
)

object Layout:
  type Fn[C <: model.Context, D <: DocPage[?]] = D => C ?=> ConcreteHtmlTag[String] | RawFrag

  type DataOfLayout[L] = L match
    case Layout[?, doc] =>
      doc match
        case DocPage[d] => d

  def apply[Ctx <: Context, Data](
      layout: Layout.Fn[Ctx, model.DocPage[Data]]
  ): Layout[Ctx, model.DocPage[Data]] = new Layout(layout)
