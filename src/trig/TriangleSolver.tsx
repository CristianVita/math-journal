import { useState } from 'react'
import { Tex } from '../components/Tex'
import type { Scene } from '../geometry/types'
import { emptyScene } from '../geometry/types'
import { uid } from '../geometry/engine'
import { type Triangle, type TriangleInput, fmt, solveTriangle, triangleExtras, triangleVertices } from './trigMath'

const KEYS = ['a', 'b', 'c', 'A', 'B', 'C'] as const

export function triangleScene(t: Triangle): Scene {
  const v = triangleVertices(t)
  const scene = emptyScene()
  // centre the figure around the origin
  const cx = (v.A.x + v.B.x + v.C.x) / 3
  const cy = (v.A.y + v.B.y + v.C.y) / 3
  const pts = (['A', 'B', 'C'] as const).map((k) => ({
    id: uid(), type: 'point' as const, x: v[k].x - cx, y: v[k].y - cy, label: k, color: '#1f2937', dep: { kind: 'free' as const },
  }))
  const [A, B, C] = pts
  scene.objects.push(...pts)
  scene.objects.push({ id: uid(), type: 'polygon', points: [A.id, B.id, C.id], color: '#2563eb', fill: '#2563eb18', width: 2 })
  for (const [p, q] of [[A, B], [B, C], [C, A]]) {
    scene.objects.push({ id: uid(), type: 'segment', dep: { kind: 'twoPoints', a: p.id, b: q.id }, color: '#2563eb', width: 2, showLength: true })
  }
  scene.objects.push({ id: uid(), type: 'angle', a: B.id, v: A.id, b: C.id, color: '#dc2626', showValue: true, rightMark: true })
  scene.objects.push({ id: uid(), type: 'angle', a: C.id, v: B.id, b: A.id, color: '#16a34a', showValue: true, rightMark: true })
  scene.objects.push({ id: uid(), type: 'angle', a: A.id, v: C.id, b: B.id, color: '#9333ea', showValue: true, rightMark: true })
  const size = Math.max(t.a, t.b, t.c)
  scene.view.scale = Math.max(8, Math.min(120, 320 / size))
  scene.view.snap = false
  return scene
}

export default function TriangleSolver({ onOpenInBoard }: { onOpenInBoard?: (s: Scene) => void }) {
  const [inp, setInp] = useState<Record<string, string>>({ a: '', b: '4', c: '5', A: '60', B: '', C: '' })
  const parsed: TriangleInput = Object.fromEntries(
    KEYS.map((k) => [k, inp[k].trim() === '' ? undefined : Number(inp[k].replace(',', '.'))]),
  )
  const res = solveTriangle(parsed)

  return (
    <div className="tri-solver">
      <div className="tri-inputs">
        <p className="muted">
          Completează exact 3 elemente (cel puțin o latură). Latura <i>a</i> se opune unghiului <i>A</i> etc. Unghiurile în grade.
        </p>
        <div className="tri-grid">
          {KEYS.map((k) => (
            <label key={k}>
              {k === k.toUpperCase() ? <Tex tex={`\\hat{${k}}`} /> : <i>{k}</i>}
              <input type="text" inputMode="decimal" value={inp[k]} onChange={(e) => setInp({ ...inp, [k]: e.target.value })} />
            </label>
          ))}
        </div>
        <button className="btn small" onClick={() => setInp({ a: '', b: '', c: '', A: '', B: '', C: '' })}>Golește</button>
        <div className="muted" style={{ marginTop: 8 }}>{res.method}</div>
        {res.error && <div className="error">{res.error}</div>}
      </div>
      <div className="tri-results">
        {res.solutions.map((t, i) => {
          const x = triangleExtras(t)
          return (
            <div key={i} className="card">
              {res.solutions.length > 1 && <div className="card-title">Soluția {i + 1}</div>}
              <TriangleSketch t={t} />
              <div className="tri-values">
                <Tex tex={`a = ${fmt(t.a)},\\ b = ${fmt(t.b)},\\ c = ${fmt(t.c)}`} />
                <Tex tex={`\\hat A = ${fmt(t.A, 2)}^\\circ,\\ \\hat B = ${fmt(t.B, 2)}^\\circ,\\ \\hat C = ${fmt(t.C, 2)}^\\circ`} />
                <Tex tex={`\\mathcal{P} = ${fmt(x.perimeter)},\\quad \\mathcal{A} = ${fmt(x.area)}`} />
                <Tex tex={`R = ${fmt(x.R)},\\quad r = ${fmt(x.r)}`} />
                <Tex tex={`h_a = ${fmt(x.ha)},\\ h_b = ${fmt(x.hb)},\\ h_c = ${fmt(x.hc)}`} />
                <div className="muted">Triunghi {x.type}, {x.sidesType}.</div>
              </div>
              {onOpenInBoard && <button className="btn small" onClick={() => onOpenInBoard(triangleScene(t))}>Deschide pe tablă</button>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TriangleSketch({ t }: { t: Triangle }) {
  const v = triangleVertices(t)
  const xs = [v.A.x, v.B.x, v.C.x]
  const ys = [v.A.y, v.B.y, v.C.y]
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const W = 300
  const H = 200
  const k = Math.min((W - 60) / (maxX - minX || 1), (H - 50) / (maxY - minY || 1))
  const p = (q: { x: number; y: number }) => ({ x: 30 + (q.x - minX) * k, y: H - 25 - (q.y - minY) * k })
  const A = p(v.A)
  const B = p(v.B)
  const C = p(v.C)
  const lbl = (q: { x: number; y: number }, name: string) => {
    const cx = (A.x + B.x + C.x) / 3
    const cy = (A.y + B.y + C.y) / 3
    const d = Math.hypot(q.x - cx, q.y - cy) || 1
    return <text x={q.x + ((q.x - cx) / d) * 14} y={q.y + ((q.y - cy) / d) * 14 + 4} textAnchor="middle" className="pt-label">{name}</text>
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="tri-sketch">
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#2563eb18" stroke="#2563eb" strokeWidth={2} />
      {lbl(A, 'A')}
      {lbl(B, 'B')}
      {lbl(C, 'C')}
    </svg>
  )
}
