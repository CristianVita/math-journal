import { useRef, useState } from 'react'
import SymbolPalette from '../symbols/SymbolPalette'
import MathText from '../components/MathText'
import MathInput from '../components/MathInput'

const sameLatex = (t: string) => t

/** Symbol reference plus a LaTeX scratchpad to try formulas before using them in a session. */
export default function SymbolsPage() {
  const [text, setText] = useState('$$\\oint_C \\vec F \\cdot d\\vec r = \\iint_S (\\nabla \\times \\vec F) \\cdot d\\vec S$$\n\nÎn $\\triangle ABC$: $\\hat A + \\hat B + \\hat C = 180^\\circ$')
  const [formula, setFormula] = useState('')
  const [toast, setToast] = useState('')
  const draftRef = useRef<HTMLTextAreaElement>(null)

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const copy = async () => {
    await navigator.clipboard?.writeText(formula)
    flash('Copiat în clipboard')
  }

  // put the formula at the draft's caret (the textarea keeps its selection after losing focus)
  const toDraft = (display: boolean) => {
    const el = draftRef.current
    const start = el?.selectionStart ?? text.length
    const end = el?.selectionEnd ?? start
    const snippet = display ? `\n$$${formula}$$\n` : `$${formula}$`
    setText(text.slice(0, start) + snippet + text.slice(end))
    flash('Inserat în ciornă')
  }

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
          <textarea ref={draftRef} data-math rows={8} value={text} onChange={(e) => setText(e.target.value)} />
          <MathText className="notes-preview" text={text} />

          <div className="card-title formula-to-latex-title">Scrie formula → LaTeX</div>
          <MathInput text={formula} toLatex={sameLatex} onChange={setFormula} format="latex" placeholder="\text{Scrie formula aici: / face fracție, ^ exponent, sqrt radical}" />
          <code className="latex-out">{formula || 'Codul LaTeX apare aici.'}</code>
          <div className="latex-actions">
            <button className="btn small" disabled={!formula} onClick={copy}>Copiază</button>
            <button className="btn small" disabled={!formula} onClick={() => toDraft(false)}>În ciornă ($…$)</button>
            <button className="btn small" disabled={!formula} onClick={() => toDraft(true)}>Pe rând separat ($$…$$)</button>
            <span className="muted">{toast}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
