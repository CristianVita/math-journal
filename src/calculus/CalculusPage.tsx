import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Tex } from '../components/Tex'
import SaveNotesDialog from '../components/SaveNotesDialog'
import MathInput, { type MathInputHandle } from '../components/MathInput'
import { type Node, nice, numericIntegral, parseExpr, roTex, sameFunction, tex, toSympy } from './expr'
import { derivativeOf, type Step } from './derivative'
import { type IntegralResult, integrate, onStatus, warmUp } from './sympyClient'
import { type ExplainedStep, explain } from './integralSteps'

/** Quick-insert buttons: plain text for the text box, LaTeX (with placeholders) for the visual editor. */
const QUICK: { label: string; text: string; latex: string }[] = [
  { label: 'a/b', text: '/', latex: '\\frac{#@}{#?}' },
  { label: 'xⁿ', text: '^', latex: '#@^{#?}' },
  { label: '√', text: 'sqrt()', latex: '\\sqrt{#0}' },
  { label: 'ⁿ√', text: 'nthRoot(, 3)', latex: '\\sqrt[#?]{#0}' },
  { label: 'ln', text: 'ln()', latex: '\\ln\\left(#0\\right)' },
  { label: 'eˣ', text: 'e^()', latex: 'e^{#0}' },
  { label: 'sin', text: 'sin()', latex: '\\sin\\left(#0\\right)' },
  { label: 'cos', text: 'cos()', latex: '\\cos\\left(#0\\right)' },
  { label: 'tg', text: 'tg()', latex: '\\operatorname{tg}\\left(#0\\right)' },
  { label: 'ctg', text: 'ctg()', latex: '\\operatorname{ctg}\\left(#0\\right)' },
  { label: 'sin²', text: 'sin^2()', latex: '\\sin^{2}\\left(#0\\right)' },
  { label: 'cos²', text: 'cos^2()', latex: '\\cos^{2}\\left(#0\\right)' },
  { label: 'tg²', text: 'tg^2()', latex: '\\operatorname{tg}^{2}\\left(#0\\right)' },
  { label: 'arcsin', text: 'arcsin()', latex: '\\arcsin\\left(#0\\right)' },
  { label: 'arctg', text: 'arctg()', latex: '\\operatorname{arctg}\\left(#0\\right)' },
  { label: '|x|', text: 'abs()', latex: '\\left|#0\\right|' },
  { label: 'π', text: 'pi', latex: '\\pi' },
  { label: '( )', text: '()', latex: '\\left(#0\\right)' },
]

/** Text → LaTeX for the visual editor (null when the text does not parse yet). */
const textToLatex = (t: string) => {
  try {
    return tex(parseExpr(t).node)
  } catch {
    return null
  }
}

// visual vs. text input: one setting for every field on the page, remembered between visits
type InputMode = 'visual' | 'text'
const MODE_KEY = 'math-journal:input-mode'
let inputMode: InputMode = (() => {
  try {
    return localStorage.getItem(MODE_KEY) === 'text' ? 'text' : 'visual'
  } catch {
    return 'visual'
  }
})()
const modeListeners = new Set<() => void>()

function useInputMode(): [InputMode, (m: InputMode) => void] {
  const mode = useSyncExternalStore(
    (l) => {
      modeListeners.add(l)
      return () => {
        modeListeners.delete(l)
      }
    },
    () => inputMode,
  )
  const set = (m: InputMode) => {
    inputMode = m
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      /* storage unavailable: keep it for this visit only */
    }
    modeListeners.forEach((l) => l())
  }
  return [mode, set]
}

const DERIV_EXAMPLES = ['x^2*sin(x)', '(x^2+1)/(x-1)', 'e^(x^2)*cos(3x)', 'ln(ln(sin(x)))', 'x^x', 'arctg(1/x)', 'sqrt(1+x^2)/x']
const INT_EXAMPLES = ['x^2*sin(x)', 'x*e^x', 'e^x*sin(x)', '(3x+1)/(x^2-1)', 'x^3/(x^2+1)', 'sqrt(1-x^2)', '1/(x*ln(x))', 'arcsin(x)', 'e^(-x^2)']

// ---------- shared input ----------

function useParsed(src: string) {
  return useMemo(() => {
    if (!src.trim()) return { node: null as Node | null, error: '' }
    try {
      return { node: parseExpr(src).node, error: '' }
    } catch (e) {
      return { node: null, error: (e as Error).message }
    }
  }, [src])
}

function ExprInput({ label, value, onChange, prefix, placeholder, examples }: {
  label: string
  value: string
  onChange: (v: string) => void
  prefix?: string
  placeholder?: string
  examples?: string[]
}) {
  const ref = useRef<HTMLInputElement>(null)
  const mathRef = useRef<MathInputHandle>(null)
  const [mode, setMode] = useInputMode()
  const { node, error } = useParsed(value)
  const insertText = (snippet: string) => {
    const el = ref.current!
    const start = el.selectionStart ?? value.length
    const end = el.selectionEnd ?? start
    const next = value.slice(0, start) + snippet + value.slice(end)
    onChange(next)
    // put the caret inside the parentheses of "sqrt()" etc.
    const caret = start + (snippet.endsWith('()') ? snippet.length - 1 : snippet.length)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }
  return (
    <div className="expr-input">
      <div className="field">
        <div className="field-label-row">
          <span>{label}</span>
          <div className="seg small">
            <button type="button" className={mode === 'visual' ? 'active' : ''} onClick={() => setMode('visual')} title="Editor de formule: / face linie de fracție, ^ urcă în exponent">Formulă</button>
            <button type="button" className={mode === 'text' ? 'active' : ''} onClick={() => setMode('text')} title="Scriere ca text: (x^2+1)/(x-1)">Text</button>
          </div>
        </div>
        {mode === 'visual' ? (
          <MathInput ref={mathRef} text={value} toLatex={textToLatex} onChange={onChange} placeholder={placeholder} />
        ) : (
          <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} spellCheck={false} autoComplete="off" />
        )}
      </div>
      <div className="quick">
        {QUICK.map((q) => (
          <button
            key={q.label}
            type="button"
            className="chip"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => (mode === 'visual' ? mathRef.current?.insert(q.latex) : insertText(q.text))}
          >
            {q.label}
          </button>
        ))}
      </div>
      {mode === 'visual' && <div className="muted small">Tastează <b>/</b> pentru linie de fracție, <b>^</b> pentru exponent, săgețile pentru a ieși din fracție sau exponent.</div>}
      <div className="expr-preview">
        {error ? <span className="error">{error}</span> : node ? <Tex tex={(prefix ?? '') + tex(node)} display /> : <span className="muted">Cum înțelege aplicația formula apare aici.</span>}
      </div>
      {examples && (
        <div className="examples muted">
          Exemple:{' '}
          {examples.map((x) => (
            <button key={x} type="button" className="link" onClick={() => onChange(x)}>{x}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function CheckAnswer({ label, onCheck }: { label: string; onCheck: (n: Node) => { ok: boolean; detail: string } }) {
  const [src, setSrc] = useState('')
  const [mode] = useInputMode()
  const { node, error } = useParsed(src)
  const verdict = node ? onCheck(node) : null
  return (
    <div className="card check">
      <div className="card-title">{label}</div>
      {mode === 'visual' ? (
        <MathInput text={src} toLatex={textToLatex} onChange={setSrc} placeholder="Răspunsul elevului…" />
      ) : (
        <input value={src} onChange={(e) => setSrc(e.target.value)} placeholder="Scrie răspunsul elevului…" spellCheck={false} />
      )}
      {error && <div className="error">{error}</div>}
      {node && <Tex tex={tex(node)} display />}
      {verdict && <div className={'verdict ' + (verdict.ok ? 'ok' : 'bad')}>{verdict.ok ? '✓ ' : '✗ '}{verdict.detail}</div>}
    </div>
  )
}

// ---------- derivative tab ----------

function DerivStepView({ step, depth = 0 }: { step: Step; depth?: number }) {
  const [open, setOpen] = useState(depth < 2)
  return (
    <div className="step" style={{ marginLeft: depth ? 14 : 0 }}>
      <button className="step-head" onClick={() => setOpen(!open)}>
        <span className="caret">{step.children.length ? (open ? '▾' : '▸') : '•'}</span>
        <span className="step-title">{step.title}</span>
      </button>
      <div className="step-body">
        {step.formula && <div className="step-formula"><Tex tex={step.formula} /></div>}
        <Tex tex={`\\left(${step.expr}\\right)' = ${step.raw ? step.raw + ' = ' : ''}${step.result}`} display />
      </div>
      {open && step.children.map((c, i) => <DerivStepView key={i} step={c} depth={depth + 1} />)}
    </div>
  )
}

function derivMarkdown(f: string, primes: string, result: string, steps: Step[]) {
  const lines = [`**Derivata** lui $f(x) = ${f}$:`, '', `$$f${primes}(x) = ${result}$$`, '', 'Pași:']
  const walk = (s: Step, d: number) => {
    lines.push(`${'  '.repeat(d)}- ${s.title}: $\\left(${s.expr}\\right)' = ${s.result}$`)
    s.children.forEach((c) => walk(c, d + 1))
  }
  steps.forEach((s) => walk(s, 0))
  return lines.join('\n')
}

function DerivativeTab() {
  const [src, setSrc] = useState('x^2*sin(x)')
  const [v, setV] = useState('x')
  const [order, setOrder] = useState(1)
  const [saving, setSaving] = useState(false)
  const { node } = useParsed(src)
  const primes = order <= 3 ? "'".repeat(order) : `^{(${order})}`

  const out = useMemo(() => {
    if (!node) return null
    try {
      return { ...derivativeOf(node, v, order), error: '' }
    } catch (e) {
      return { result: null, steps: [], error: (e as Error).message }
    }
  }, [node, v, order])

  return (
    <div className="calc-grid">
      <div className="calc-input">
        <ExprInput label="Funcția f(x)" value={src} onChange={setSrc} prefix="f(x) = " placeholder="ex: x^2*sin(x), (x+1)/(x-1), e^(2x)*ln x" examples={DERIV_EXAMPLES} />
        <div className="field-row">
          <label>Variabila <input value={v} onChange={(e) => setV(e.target.value.trim() || 'x')} style={{ width: 60 }} /></label>
          <label>Ordinul derivatei
            <select value={order} onChange={(e) => setOrder(Number(e.target.value))}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 1 ? "f'" : n === 2 ? "f''" : n === 3 ? "f'''" : 'f⁽⁴⁾'}</option>)}
            </select>
          </label>
        </div>
        <div className="muted small">Alte litere (a, b, m…) sunt tratate ca parametri constanți. Funcții: sin, cos, tg, ctg, arcsin, arccos, arctg, arcctg, ln, lg, log(x, b), sqrt, e^x, |x| = abs(x).</div>
      </div>
      <div className="calc-output">
        {out?.error && <div className="error">{out.error}</div>}
        {out?.result && node && (
          <>
            <div className="card result">
              <Tex tex={`f${primes}(${v}) = ${tex(out.result)}`} display />
              <div className="actions">
                <button className="btn small" onClick={() => setSaving(true)}>Adaugă în ședință</button>
              </div>
            </div>
            <CheckAnswer
              label="Verifică rezultatul elevului"
              onCheck={(ans) => {
                const r = sameFunction(out.result!, ans, v)
                if (r.ok) return { ok: true, detail: 'Corect (coincide cu derivata în toate punctele verificate).' }
                if (r.counterexample !== undefined) return { ok: false, detail: `Greșit: diferă de derivată, de exemplu în ${v} = ${r.counterexample}.` }
                return { ok: false, detail: 'Nu am putut compara (prea puține puncte în domeniu).' }
              }}
            />
            <div className="steps">
              <h3>Pași</h3>
              {out.steps.map((s, i) => (
                <div key={i}>
                  {out.steps.length > 1 && <div className="muted small">Derivata de ordin {i + 1}</div>}
                  <DerivStepView step={s} />
                </div>
              ))}
            </div>
            {saving && <SaveNotesDialog markdown={derivMarkdown(tex(node), primes, tex(out.result), out.steps)} onClose={() => setSaving(false)} />}
          </>
        )}
      </div>
    </div>
  )
}

// ---------- integral tab ----------

function IntStepView({ step, label, depth = 0 }: { step: ExplainedStep; label?: string; depth?: number }) {
  const [open, setOpen] = useState(depth < 3)
  return (
    <div className="step" style={{ marginLeft: depth ? 14 : 0 }}>
      {label && <div className="step-label">{label}</div>}
      <button className="step-head" onClick={() => setOpen(!open)}>
        <span className="caret">{step.children.length ? (open ? '▾' : '▸') : '•'}</span>
        <span className="step-title">{step.title}</span>
      </button>
      <div className="step-body">
        {step.formula && <div className="step-formula"><Tex tex={step.formula} /></div>}
        {step.note && <div className="muted small">{step.note}</div>}
        {step.lines.map((l, i) => <div key={i}><Tex tex={l} /></div>)}
        <Tex tex={step.integral} display />
      </div>
      {open && step.children.map((c, i) => <IntStepView key={i} step={c.step} label={c.label} depth={depth + 1} />)}
    </div>
  )
}

/** 10 significant digits, without trailing zeros. */
const fmtNum = (s: string) => String(parseFloat(Number(s).toPrecision(10)))

/** " ≈ 1.7724538509" after an exact value, unless the exact value already is that number. */
function approx(numeric: string | null | undefined, exact: string) {
  if (!numeric) return ''
  const n = fmtNum(numeric)
  return n === exact.trim() ? '' : ` \\approx ${n}`
}

function intMarkdown(r: IntegralResult, v: string, steps: ExplainedStep | null) {
  const lines = [`**Integrala** $\\int ${roTex(r.integrand)}\\,d${v}$:`, '']
  if (r.antiderivative) lines.push(`$$\\int ${roTex(r.integrand)}\\,d${v} = ${roTex(r.antiderivative)} + C$$`)
  if (r.definite) lines.push(`$$\\int_{${r.a}}^{${r.b}} ${roTex(r.integrand)}\\,d${v} = ${roTex(r.definite)}$$`)
  if (steps) {
    lines.push('', 'Pași:')
    const walk = (s: ExplainedStep, d: number) => {
      lines.push(`${'  '.repeat(d)}- ${s.title}: $${s.integral}$`)
      s.children.forEach((c) => walk(c.step, d + 1))
    }
    walk(steps, 0)
  }
  return lines.join('\n')
}

function IntegralTab() {
  const [src, setSrc] = useState('x^2*sin(x)')
  const [v, setV] = useState('x')
  const [definite, setDefinite] = useState(false)
  const [a, setA] = useState('0')
  const [b, setB] = useState('pi')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<IntegralResult | null>(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const { node } = useParsed(src)

  useEffect(() => {
    warmUp()
    return onStatus((s, r) => {
      setStatus(s)
      setReady(r)
    })
  }, [])

  /** A limit as SymPy source: ±∞ / ±inf become ±oo, anything else goes through the normal parser. */
  const limitSrc = (t: string) => {
    const m = /^\s*([+-]?)\s*(∞|inf|infinity|oo)\s*$/i.exec(t)
    if (m) return `${m[1] === '-' ? '-' : ''}oo`
    return toSympy(parseExpr(t).node)
  }

  const run = async () => {
    if (!node) return
    setBusy(true)
    setError('')
    setRes(null)
    try {
      const [aS, bS] = definite ? [limitSrc(a), limitSrc(b)] : [undefined, undefined]
      setRes(await integrate(toSympy(node), v, aS, bS))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const steps = useMemo(() => (res ? explain(res.steps) : null), [res])

  // offline numeric cross-check for finite limits (independent of SymPy)
  const numericCheck = useMemo(() => {
    if (!definite || !node || !res) return null
    try {
      const an = parseExpr(a).node.evaluate()
      const bn = parseExpr(b).node.evaluate()
      if (typeof an !== 'number' || typeof bn !== 'number' || !isFinite(an) || !isFinite(bn)) return null
      const val = numericIntegral(node, v, an, bn)
      return isFinite(val) ? val : null
    } catch {
      return null
    }
  }, [definite, node, res, a, b, v])

  return (
    <div className="calc-grid">
      <div className="calc-input">
        <ExprInput label="Funcția de integrat f(x)" value={src} onChange={setSrc} prefix="\int " placeholder="ex: x*e^x, 1/(x^2-1), sqrt(1-x^2)" examples={INT_EXAMPLES} />
        <div className="field-row">
          <label>Variabila <input value={v} onChange={(e) => setV(e.target.value.trim() || 'x')} style={{ width: 60 }} /></label>
          <label className="chk"><input type="checkbox" checked={definite} onChange={(e) => setDefinite(e.target.checked)} /> Integrală definită</label>
        </div>
        {definite && (
          <div className="field-row">
            <label>de la a = <input value={a} onChange={(e) => setA(e.target.value)} style={{ width: 90 }} /></label>
            <label>până la b = <input value={b} onChange={(e) => setB(e.target.value)} style={{ width: 90 }} /></label>
            <span className="muted small">(poți scrie pi, e, sqrt(2), inf, -inf)</span>
          </div>
        )}
        <button className="btn primary" onClick={run} disabled={!node || busy}>{busy ? 'Se calculează…' : 'Calculează integrala'}</button>
        <div className="muted small">
          {status || (ready ? 'Motorul de calcul (SymPy) e pregătit.' : 'Motorul de calcul se pregătește…')}
          {' '}Prima încărcare descarcă ~15–20 MB; apoi rămâne în cache.
        </div>
      </div>
      <div className="calc-output">
        {error && <div className="error">{error}</div>}
        {res && (
          <>
            <div className="card result">
              {res.antiderivative ? (
                <Tex tex={`\\int ${roTex(res.integrand)}\\,d${v} = ${roTex(res.antiderivative)} + C`} display />
              ) : (
                <div>
                  <Tex tex={`\\int ${roTex(res.integrand)}\\,d${v}`} display />
                  <div className="note warn">
                    {res.nonElementary
                      ? 'Această primitivă nu se poate exprima prin funcții elementare (demonstrat cu algoritmul Risch).'
                      : 'Nu am găsit o primitivă în formă închisă.'}
                  </div>
                </div>
              )}
              {res.definite !== undefined && (
                <div className="definite">
                  {res.definite ? (
                    <Tex tex={`\\int_{${roTex(res.a!)}}^{${roTex(res.b!)}} ${roTex(res.integrand)}\\,d${v} = ${roTex(res.definite)}${approx(res.numeric, res.definite)}`} display />
                  ) : (
                    res.numeric && <Tex tex={`\\int_{${roTex(res.a!)}}^{${roTex(res.b!)}} ${roTex(res.integrand)}\\,d${v} \\approx ${fmtNum(res.numeric)}`} display />
                  )}
                  {res.improperUnknown && (
                    <div className="note warn">
                      Integrală improprie: funcția nu e definită în <Tex tex={`${v} = ${(res.singular ?? []).map(roTex).join(',\\ ')}`} />.
                      Nu am putut stabili dacă e convergentă, deci nu afișez o valoare (o aproximare numerică ar putea fi greșită).
                    </div>
                  )}
                  {res.divergent && (
                    <div className="note warn">
                      Integrala este divergentă.
                      {res.singular?.length ? (
                        <> Funcția nu e definită (tinde la infinit) în <Tex tex={`${v} = ${res.singular.map(roTex).join(',\\ ')}`} />, care e în intervalul de integrare.</>
                      ) : null}
                    </div>
                  )}
                  {numericCheck != null && res.numeric && !res.divergent && (
                    <div className={'muted small'}>
                      Verificare numerică independentă (metoda Simpson): ≈ {fmtNum(String(numericCheck))}
                      {Math.abs(numericCheck - Number(res.numeric)) < 1e-6 * Math.max(1, Math.abs(numericCheck)) ? ' ✓' : ' — diferă, posibilă discontinuitate pe interval'}
                    </div>
                  )}
                </div>
              )}
              <div className="badges">
                {res.verified && <span className="badge ok">✓ verificat prin derivare</span>}
                {res.special && <span className="badge warn">funcție specială (nu e elementară)</span>}
                {res.antiderivative && !res.completeSteps && <span className="badge warn">rezultat fără pași complet explicați</span>}
              </div>
              <div className="actions">
                <button className="btn small" onClick={() => setSaving(true)}>Adaugă în ședință</button>
              </div>
            </div>
            {node && (
              <CheckAnswer
                label="Verifică primitiva găsită de elev"
                onCheck={(F) => {
                  // F is right iff F' = f; constants of integration do not matter
                  let dF: Node
                  try {
                    dF = nice(derivativeOf(F, v).result, v)
                  } catch (e) {
                    return { ok: false, detail: (e as Error).message }
                  }
                  const r = sameFunction(dF, node, v)
                  if (r.ok) return { ok: true, detail: 'Corect: derivata ei este chiar f (constanta de integrare nu contează).' }
                  if (r.counterexample !== undefined) return { ok: false, detail: `Greșit: derivata ei nu este f (diferă, de exemplu, în ${v} = ${r.counterexample}).` }
                  return { ok: false, detail: 'Nu am putut compara (prea puține puncte în domeniu).' }
                }}
              />
            )}
            {steps && (
              <div className="steps">
                <h3>Pași</h3>
                {!res.completeSteps && (
                  <div className="note warn">SymPy nu a găsit o rezolvare „de manual” completă; rezultatul de mai sus vine din algoritmi generali (Risch / heuristici), fără pași.</div>
                )}
                <IntStepView step={steps} />
              </div>
            )}
            {saving && <SaveNotesDialog markdown={intMarkdown(res, v, res.completeSteps ? steps : null)} onClose={() => setSaving(false)} />}
          </>
        )}
      </div>
    </div>
  )
}

// ---------- page ----------

export default function CalculusPage() {
  const [tab, setTab] = useState<'deriv' | 'int'>('deriv')
  // the integral tab starts downloading SymPy, so mount it only once it has been opened
  const [intOpened, setIntOpened] = useState(false)
  useEffect(() => {
    if (tab === 'int') setIntOpened(true)
  }, [tab])
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Calculator</h1>
          <div className="muted">Derivate și integrale pas cu pas, plus verificarea rezolvării elevului.</div>
        </div>
      </div>
      <div className="tabs">
        <button className={'tab' + (tab === 'deriv' ? ' active' : '')} onClick={() => setTab('deriv')}>Derivate</button>
        <button className={'tab' + (tab === 'int' ? ' active' : '')} onClick={() => setTab('int')}>Integrale</button>
      </div>
      {/* keep both mounted so switching tabs does not lose what was typed */}
      <div hidden={tab !== 'deriv'}><DerivativeTab /></div>
      <div hidden={tab !== 'int'}>{intOpened && <IntegralTab />}</div>
    </div>
  )
}
