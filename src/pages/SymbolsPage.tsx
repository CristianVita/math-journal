import { useState } from 'react'
import SymbolPalette from '../symbols/SymbolPalette'
import MathText from '../components/MathText'

/** Symbol reference plus a LaTeX scratchpad to try formulas before using them in a session. */
export default function SymbolsPage() {
  const [text, setText] = useState('$$\\oint_C \\vec F \\cdot d\\vec r = \\iint_S (\\nabla \\times \\vec F) \\cdot d\\vec S$$\n\nÎn $\\triangle ABC$: $\\hat A + \\hat B + \\hat C = 180^\\circ$')
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Simboluri matematice</h1>
          <div className="muted">Alfabetul grecesc, integrale de toate felurile, analiză, trigonometrie, mulțimi, geometrie, matrici. Click pe simbol îl inserează în ciornă.</div>
        </div>
      </div>
      <div className="symbols-layout">
        <SymbolPalette />
        <div className="card">
          <div className="card-title">Ciornă LaTeX</div>
          <textarea data-math rows={8} value={text} onChange={(e) => setText(e.target.value)} />
          <MathText className="notes-preview" text={text} />
        </div>
      </div>
    </div>
  )
}
