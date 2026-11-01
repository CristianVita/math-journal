import { useState } from 'react'
import { Tex } from '../components/Tex'
import { fmt } from './trigMath'

type Group = 'trig' | 'inv' | 'hyp'

interface FnDef {
  group: Group
  f: (x: number) => number
  tex: string
  period?: number // only the periodic (trigonometric) functions
  domain: string // of the base function, LaTeX
  range: string
  /** has vertical asymptotes / unbounded jumps: keep the y window fixed instead of fitting it */
  jumps?: boolean
  /** reference lines of the base function: asymptotes, the ends of the range… */
  hLines?: { y: number; label: string }[]
  vLines?: { x: number; label: string }[]
}

const PI = Math.PI
const FNS: Record<string, FnDef> = {
  sin: { group: 'trig', f: Math.sin, tex: '\\sin', period: 2 * PI, domain: '\\mathbb{R}', range: '[-1,\\ 1]' },
  cos: { group: 'trig', f: Math.cos, tex: '\\cos', period: 2 * PI, domain: '\\mathbb{R}', range: '[-1,\\ 1]' },
  tg: { group: 'trig', f: Math.tan, tex: '\\operatorname{tg}', period: PI, domain: '\\mathbb{R} \\setminus \\{\\frac{\\pi}{2} + k\\pi\\}', range: '\\mathbb{R}', jumps: true },
  ctg: { group: 'trig', f: (x) => 1 / Math.tan(x), tex: '\\operatorname{ctg}', period: PI, domain: '\\mathbb{R} \\setminus \\{k\\pi\\}', range: '\\mathbb{R}', jumps: true },

  arcsin: {
    group: 'inv', f: Math.asin, tex: '\\arcsin', domain: '[-1,\\ 1]', range: '\\left[-\\frac{\\pi}{2},\\ \\frac{\\pi}{2}\\right]',
    hLines: [{ y: PI / 2, label: 'π/2' }, { y: -PI / 2, label: '−π/2' }], vLines: [{ x: -1, label: '−1' }, { x: 1, label: '1' }],
  },
  arccos: {
    group: 'inv', f: Math.acos, tex: '\\arccos', domain: '[-1,\\ 1]', range: '[0,\\ \\pi]',
    hLines: [{ y: PI, label: 'π' }, { y: PI / 2, label: 'π/2' }], vLines: [{ x: -1, label: '−1' }, { x: 1, label: '1' }],
  },
  arctg: {
    group: 'inv', f: Math.atan, tex: '\\operatorname{arctg}', domain: '\\mathbb{R}', range: '\\left(-\\frac{\\pi}{2},\\ \\frac{\\pi}{2}\\right)',
    hLines: [{ y: PI / 2, label: 'π/2' }, { y: -PI / 2, label: '−π/2' }],
  },
  arcctg: {
    group: 'inv', f: (x) => PI / 2 - Math.atan(x), tex: '\\operatorname{arcctg}', domain: '\\mathbb{R}', range: '(0,\\ \\pi)',
    hLines: [{ y: PI, label: 'π' }, { y: PI / 2, label: 'π/2' }],
  },

  sh: { group: 'hyp', f: Math.sinh, tex: '\\operatorname{sh}', domain: '\\mathbb{R}', range: '\\mathbb{R}' },
  ch: { group: 'hyp', f: Math.cosh, tex: '\\operatorname{ch}', domain: '\\mathbb{R}', range: '[1,\\ \\infty)', hLines: [{ y: 1, label: '1' }] },
  th: { group: 'hyp', f: Math.tanh, tex: '\\operatorname{th}', domain: '\\mathbb{R}', range: '(-1,\\ 1)', hLines: [{ y: 1, label: '1' }, { y: -1, label: '−1' }] },
  cth: {
    group: 'hyp', f: (x) => 1 / Math.tanh(x), tex: '\\operatorname{cth}', domain: '\\mathbb{R}^*', range: '(-\\infty,\\ -1) \\cup (1,\\ \\infty)', jumps: true,
    hLines: [{ y: 1, label: '1' }, { y: -1, label: '−1' }],
  },
}

const GROUPS: { id: Group; title: string; note?: string }[] = [
  { id: 'trig', title: 'Trigonometrice' },
  { id: 'inv', title: 'Trigonometrice inverse' },
  { id: 'hyp', title: 'Hiperbolice', note: 'sh x = (eˣ − e⁻ˣ)/2, ch x = (eˣ + e⁻ˣ)/2, th = sh/ch, cth = ch/sh' },
]

const piLabel = (k: number) => {
  // k = multiple of π/2
  if (k === 0) return '0'
  const sign = k < 0 ? '−' : ''
  const a = Math.abs(k)
  if (a % 2 === 0) return `${sign}${a / 2 === 1 ? '' : a / 2}π`
  return `${sign}${a === 1 ? '' : a}π/2`
}

const niceStep = (span: number) => (span <= 3 ? 0.5 : span <= 6 ? 1 : span <= 12 ? 2 : 5)

export default function TrigPlotter() {
  const [fn, setFn] = useState('sin')
  const [A, setA] = useState(1)
  const [B, setB] = useState(1)
  const [C, setC] = useState(0)
  const [D, setD] = useState(0)
  const [showBase, setShowBase] = useState(true)
  const [halfPeriods, setHalfPeriods] = useState(4) // trig: x ∈ [−k·π, k·π]
  const [numWin, setNumWin] = useState(3) // other functions: x ∈ [−w, w]

  const base = FNS[fn]
  const periodic = base.group === 'trig'
  const g = (x: number) => A * base.f(B * x + C) + D

  const W = 760
  const H = 360
  const xMax = periodic ? halfPeriods * PI : numWin
  const sx = (x: number) => W / 2 + (x / xMax) * (W / 2 - 20)
  const xAt = (px: number) => ((px - W / 2) / (W / 2 - 20)) * xMax

  // y window: fixed for functions with asymptotes, otherwise fitted to what is drawn
  let yMax: number
  if (base.jumps) yMax = Math.max(2, Math.ceil(Math.abs(A) + Math.abs(D) + 0.5))
  else {
    let m = 1
    for (let px = 20; px <= W - 20; px += 4) {
      for (const y of [g(xAt(px)), showBase ? base.f(xAt(px)) : 0]) if (isFinite(y)) m = Math.max(m, Math.abs(y))
    }
    for (const l of base.hLines ?? []) m = Math.max(m, Math.abs(l.y))
    yMax = Math.min(30, Math.max(2, Math.ceil(m * 1.15)))
  }
  const sy = (y: number) => H / 2 - (y / yMax) * (H / 2 - 20)

  const path = (h: (x: number) => number) => {
    let d = ''
    let prevY: number | null = null
    for (let px = 20; px <= W - 20; px += 1.5) {
      const y = h(xAt(px))
      if (!isFinite(y) || Math.abs(y) > yMax * 4) {
        prevY = null
        continue
      }
      const jump = prevY != null && Math.abs(y - prevY) > yMax * 1.5
      d += `${prevY == null || jump ? 'M' : 'L'}${px.toFixed(1)},${sy(y).toFixed(1)} `
      prevY = y
    }
    return d
  }
  const curve = path(g)
  const baseCurve = path(base.f)

  // grid
  const xTicks: { x: number; label: string }[] = []
  if (periodic) for (let k = -halfPeriods * 2; k <= halfPeriods * 2; k++) xTicks.push({ x: (k * PI) / 2, label: piLabel(k) })
  else {
    const st = niceStep(xMax)
    for (let x = -Math.floor(xMax / st) * st; x <= xMax + 1e-9; x += st) xTicks.push({ x, label: fmt(x, 2) })
  }
  const ySt = yMax <= 6 ? 1 : yMax <= 12 ? 2 : 5
  const yTicks: number[] = []
  for (let y = -Math.floor(yMax / ySt) * ySt; y <= yMax + 1e-9; y += ySt) yTicks.push(Number(y.toFixed(6)))

  const sgn = (v: number) => (v < 0 ? ' - ' : ' + ')
  const formula = `f(x) = ${A === 1 ? '' : A === -1 ? '-' : fmt(A, 3)}${base.tex}\\left(${B === 1 ? '' : B === -1 ? '-' : fmt(B, 3)}x${C ? sgn(C) + fmt(Math.abs(C), 3) : ''}\\right)${D ? sgn(D) + fmt(Math.abs(D), 3) : ''}`

  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number, step: number) => (
    <label className="slider">
      <span>{label} = <b>{fmt(v, 3)}</b></span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )

  return (
    <div className="trig-plot">
      <div className="plot-controls">
        {GROUPS.map((gr) => (
          <div key={gr.id} className="fn-group">
            <div className="muted small">{gr.title}</div>
            <div className="chips">
              {Object.keys(FNS).filter((k) => FNS[k].group === gr.id).map((k) => (
                <button key={k} className={'chip' + (k === fn ? ' active' : '')} onClick={() => setFn(k)}>{k}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="formula"><Tex tex={formula} display /></div>
        {slider('A (amplitudine / factor vertical)', A, setA, -4, 4, 0.25)}
        {slider('B (frecvență / factor orizontal)', B, setB, -4, 4, 0.25)}
        {periodic ? slider('C (fază)', C, setC, -PI * 2, PI * 2, PI / 12) : slider('C (deplasare în argument)', C, setC, -4, 4, 0.25)}
        {slider('D (deplasare verticală)', D, setD, -3, 3, 0.25)}
        {periodic
          ? slider('Lățimea ferestrei (π)', halfPeriods, setHalfPeriods, 1, 8, 1)
          : slider('Lățimea ferestrei', numWin, setNumWin, 1, 10, 0.5)}
        <label className="chk"><input type="checkbox" checked={showBase} onChange={(e) => setShowBase(e.target.checked)} /> Arată funcția de bază</label>
        <div className="muted">
          {periodic ? (
            <>
              Perioada: <Tex tex={`T = \\frac{${base.period === 2 * PI ? '2\\pi' : '\\pi'}}{|B|} \\approx ${fmt(base.period! / Math.abs(B || 1), 3)}`} />
              <br />Defazaj: <Tex tex={`-\\frac{C}{B} \\approx ${fmt(B ? -C / B : 0, 3)}`} />
              {(fn === 'sin' || fn === 'cos') && (
                <>
                  <br />Imagine: <Tex tex={`[${fmt(D - Math.abs(A), 3)},\\ ${fmt(D + Math.abs(A), 3)}]`} />
                </>
              )}
            </>
          ) : (
            <>
              Funcția de bază <Tex tex={`${base.tex}\\,x`} />:
              <br />Domeniu: <Tex tex={base.domain} />
              <br />Imagine: <Tex tex={base.range} />
              {(C !== 0 || B !== 1) && (
                <>
                  <br />Deplasare orizontală: <Tex tex={`-\\frac{C}{B} \\approx ${fmt(B ? -C / B : 0, 3)}`} />
                </>
              )}
            </>
          )}
          {GROUPS.find((x) => x.id === base.group)?.note && <div className="small" style={{ marginTop: 6 }}>{GROUPS.find((x) => x.id === base.group)!.note}</div>}
        </div>
        <button className="btn small" onClick={() => { setA(1); setB(1); setC(0); setD(0) }}>Resetează</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        <rect width={W} height={H} fill="#fff" />
        {xTicks.map((t) => (
          <g key={'x' + t.x}>
            <line x1={sx(t.x)} y1={10} x2={sx(t.x)} y2={H - 10} className="grid-line" />
            {Math.abs(t.x) > 1e-9 && <text x={sx(t.x)} y={H / 2 + 16} className="tick small" textAnchor="middle">{t.label}</text>}
          </g>
        ))}
        {yTicks.map((y) => (
          <g key={'y' + y}>
            <line x1={20} y1={sy(y)} x2={W - 20} y2={sy(y)} className="grid-line" />
            {y !== 0 && <text x={W / 2 - 6} y={sy(y) + 4} className="tick small" textAnchor="end">{fmt(y, 2)}</text>}
          </g>
        ))}
        <line x1={10} y1={H / 2} x2={W - 10} y2={H / 2} className="axis" />
        <line x1={W / 2} y1={10} x2={W / 2} y2={H - 10} className="axis" />
        {/* reference lines of the base function (asymptotes, ends of the range, domain bounds) */}
        {showBase && (base.hLines ?? []).map((l) => (
          <g key={'h' + l.label}>
            <line x1={20} y1={sy(l.y)} x2={W - 20} y2={sy(l.y)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="6 4" />
            <text x={W - 24} y={sy(l.y) - 4} className="tick small" textAnchor="end" fill="#b45309">{l.label}</text>
          </g>
        ))}
        {showBase && (base.vLines ?? []).map((l) => (
          <line key={'v' + l.label} x1={sx(l.x)} y1={10} x2={sx(l.x)} y2={H - 10} stroke="#f59e0b" strokeWidth={1} strokeDasharray="6 4" />
        ))}
        {showBase && <path d={baseCurve} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" fill="none" />}
        <path d={curve} stroke="#2563eb" strokeWidth={2.5} fill="none" />
      </svg>
    </div>
  )
}
