import { useState } from 'react'
import { Tex } from '../components/Tex'
import { fmt } from './trigMath'

type Fn = 'sin' | 'cos' | 'tg' | 'ctg'
const FNS: Record<Fn, { f: (x: number) => number; tex: string; period: number }> = {
  sin: { f: Math.sin, tex: '\\sin', period: 2 * Math.PI },
  cos: { f: Math.cos, tex: '\\cos', period: 2 * Math.PI },
  tg: { f: Math.tan, tex: '\\operatorname{tg}', period: Math.PI },
  ctg: { f: (x) => 1 / Math.tan(x), tex: '\\operatorname{ctg}', period: Math.PI },
}

const piLabel = (k: number) => {
  // k = multiple of π/2
  if (k === 0) return '0'
  const sign = k < 0 ? '−' : ''
  const a = Math.abs(k)
  if (a % 2 === 0) return `${sign}${a / 2 === 1 ? '' : a / 2}π`
  return `${sign}${a === 1 ? '' : a}π/2`
}

export default function TrigPlotter() {
  const [fn, setFn] = useState<Fn>('sin')
  const [A, setA] = useState(1)
  const [B, setB] = useState(1)
  const [C, setC] = useState(0)
  const [D, setD] = useState(0)
  const [showBase, setShowBase] = useState(true)
  const [halfPeriods, setHalfPeriods] = useState(4) // x range = ±halfPeriods·π/2·2

  const W = 760
  const H = 360
  const xMax = halfPeriods * Math.PI
  const yMax = Math.max(2, Math.ceil(Math.abs(A) + Math.abs(D) + 0.5))
  const sx = (x: number) => W / 2 + (x / xMax) * (W / 2 - 20)
  const sy = (y: number) => H / 2 - (y / yMax) * (H / 2 - 20)

  const path = (g: (x: number) => number) => {
    let d = ''
    let prevY: number | null = null
    for (let px = 20; px <= W - 20; px += 1.5) {
      const x = ((px - W / 2) / (W / 2 - 20)) * xMax
      const y = g(x)
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

  const base = FNS[fn]
  const g = (x: number) => A * base.f(B * x + C) + D
  const curve = path(g)
  const baseCurve = path(base.f)

  const ticks = []
  for (let k = -halfPeriods * 2; k <= halfPeriods * 2; k++) ticks.push(k)

  const period = base.period / Math.abs(B || 1)
  const shift = B ? -C / B : 0
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
        <div className="chips">
          {(Object.keys(FNS) as Fn[]).map((k) => (
            <button key={k} className={'chip' + (k === fn ? ' active' : '')} onClick={() => setFn(k)}>{k}</button>
          ))}
        </div>
        <div className="formula"><Tex tex={formula} display /></div>
        {slider('A (amplitudine)', A, setA, -4, 4, 0.25)}
        {slider('B (frecvență)', B, setB, -4, 4, 0.25)}
        {slider('C (fază)', C, setC, -Math.PI * 2, Math.PI * 2, Math.PI / 12)}
        {slider('D (deplasare verticală)', D, setD, -3, 3, 0.25)}
        {slider('Lățimea ferestrei (π)', halfPeriods, setHalfPeriods, 1, 8, 1)}
        <label className="chk"><input type="checkbox" checked={showBase} onChange={(e) => setShowBase(e.target.checked)} /> Arată funcția de bază</label>
        <div className="muted">
          Perioada: <Tex tex={`T = \\frac{${fn === 'sin' || fn === 'cos' ? '2\\pi' : '\\pi'}}{|B|} \\approx ${fmt(period, 3)}`} />
          <br />Defazaj: <Tex tex={`-\\frac{C}{B} \\approx ${fmt(shift, 3)}`} />
          {(fn === 'sin' || fn === 'cos') && (
            <>
              <br />Imagine: <Tex tex={`[${fmt(D - Math.abs(A), 3)},\\ ${fmt(D + Math.abs(A), 3)}]`} />
            </>
          )}
        </div>
        <button className="btn small" onClick={() => { setA(1); setB(1); setC(0); setD(0) }}>Resetează</button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg">
        <rect width={W} height={H} fill="#fff" />
        {ticks.map((k) => (
          <g key={k}>
            <line x1={sx((k * Math.PI) / 2)} y1={10} x2={sx((k * Math.PI) / 2)} y2={H - 10} className="grid-line" />
            {k !== 0 && <text x={sx((k * Math.PI) / 2)} y={H / 2 + 16} className="tick small" textAnchor="middle">{piLabel(k)}</text>}
          </g>
        ))}
        {Array.from({ length: yMax * 2 + 1 }, (_, i) => i - yMax).map((y) => (
          <g key={'y' + y}>
            <line x1={20} y1={sy(y)} x2={W - 20} y2={sy(y)} className="grid-line" />
            {y !== 0 && <text x={W / 2 - 6} y={sy(y) + 4} className="tick small" textAnchor="end">{y}</text>}
          </g>
        ))}
        <line x1={10} y1={H / 2} x2={W - 10} y2={H / 2} className="axis" />
        <line x1={W / 2} y1={10} x2={W / 2} y2={H - 10} className="axis" />
        {showBase && <path d={baseCurve} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" fill="none" />}
        <path d={curve} stroke="#2563eb" strokeWidth={2.5} fill="none" />
      </svg>
    </div>
  )
}
