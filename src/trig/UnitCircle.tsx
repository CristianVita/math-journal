import { useRef, useState } from 'react'
import { Tex } from '../components/Tex'
import { exactTrig, fmt, quadrantName, radLatex, toRad } from './trigMath'

const SPECIAL = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]

export default function UnitCircle() {
  const [deg, setDeg] = useState(30)
  const [snap, setSnap] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const S = 420
  const R = 150
  const O = S / 2
  const t = toRad(deg)
  const P = { x: O + R * Math.cos(t), y: O - R * Math.sin(t) }
  const sin = Math.sin(t)
  const cos = Math.cos(t)
  const tg = Math.abs(cos) < 1e-12 ? Infinity : sin / cos
  const ctg = Math.abs(sin) < 1e-12 ? Infinity : cos / sin
  const exact = exactTrig(deg)

  const fromPointer = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * S - O
    const y = O - ((e.clientY - r.top) / r.height) * S
    let d = (Math.atan2(y, x) * 180) / Math.PI
    if (d < 0) d += 360
    if (snap) {
      const near = SPECIAL.concat(360).find((s) => Math.abs(s - d) < 4)
      d = near != null ? near % 360 : Math.round(d)
    }
    setDeg(Number(d.toFixed(1)))
  }

  // arc for the angle mark
  const arc = (() => {
    const r = 34
    const sweep = ((deg % 360) + 360) % 360
    if (sweep === 0) return ''
    const end = { x: O + r * Math.cos(t), y: O - r * Math.sin(t) }
    return `M${O + r},${O} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 0 ${end.x},${end.y}`
  })()

  const tgVisible = isFinite(tg) && Math.abs(tg) < 2.6

  return (
    <div className="trig-unit">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${S} ${S}`}
        className="unit-svg"
        onPointerDown={(e) => {
          dragging.current = true
          ;(e.target as Element).setPointerCapture(e.pointerId)
          fromPointer(e)
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        style={{ touchAction: 'none' }}
      >
        <defs>
          <marker id="uarrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
          </marker>
        </defs>
        <rect width={S} height={S} fill="#fff" />
        <line x1={10} y1={O} x2={S - 10} y2={O} className="axis" markerEnd="url(#uarrow)" />
        <line x1={O} y1={S - 10} x2={O} y2={10} className="axis" markerEnd="url(#uarrow)" />
        <text x={S - 20} y={O - 8} className="tick">x</text>
        <text x={O + 8} y={20} className="tick">y</text>
        <circle cx={O} cy={O} r={R} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
        {SPECIAL.map((s) => {
          const a = toRad(s)
          const p = { x: O + R * Math.cos(a), y: O - R * Math.sin(a) }
          const l = { x: O + (R + 22) * Math.cos(a), y: O - (R + 22) * Math.sin(a) }
          return (
            <g key={s} className="special" onPointerDown={(e) => { e.stopPropagation(); setDeg(s) }}>
              <circle cx={p.x} cy={p.y} r={3} fill="#cbd5e1" />
              <text x={l.x} y={l.y + 4} textAnchor="middle" className="tick small">{s}°</text>
            </g>
          )
        })}
        <text x={O + R + 4} y={O + 16} className="tick">1</text>
        <text x={O - R - 16} y={O + 16} className="tick">-1</text>
        {/* tangent axis x = 1 */}
        <line x1={O + R} y1={10} x2={O + R} y2={S - 10} stroke="#e9d5ff" strokeWidth={1} strokeDasharray="4 4" />
        {tgVisible && (
          <>
            <line x1={O} y1={O} x2={O + R} y2={O - R * tg} stroke="#c084fc" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={O + R} y1={O} x2={O + R} y2={O - R * tg} stroke="#9333ea" strokeWidth={3} />
          </>
        )}
        <path d={arc} fill="none" stroke="#f59e0b" strokeWidth={2} />
        {/* projections */}
        <line x1={P.x} y1={P.y} x2={P.x} y2={O} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={P.x} y1={P.y} x2={O} y2={P.y} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={O} y1={O} x2={P.x} y2={O} stroke="#2563eb" strokeWidth={4} strokeLinecap="round" />
        <line x1={O} y1={O} x2={O} y2={P.y} stroke="#dc2626" strokeWidth={4} strokeLinecap="round" />
        <line x1={O} y1={O} x2={P.x} y2={P.y} stroke="#1f2937" strokeWidth={2} />
        <circle cx={P.x} cy={P.y} r={7} fill="#f59e0b" stroke="#fff" strokeWidth={2} style={{ cursor: 'grab' }} />
        <text x={P.x + 10} y={P.y - 10} className="pt-label">M</text>
      </svg>

      <div className="unit-side">
        <div className="field-row">
          <label>Unghi (°)
            <input type="number" value={deg} step={1} onChange={(e) => setDeg(Number(e.target.value))} />
          </label>
          <label className="chk"><input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} /> Aliniere la unghiuri remarcabile</label>
        </div>
        <input type="range" min={0} max={360} step={1} value={((deg % 360) + 360) % 360} onChange={(e) => setDeg(Number(e.target.value))} />
        <div className="unit-values">
          <div><Tex tex={`\\alpha = ${fmt(deg, 2)}^\\circ = ${radLatex(deg)}\\ \\text{rad}`} /></div>
          <div className="muted">{quadrantName(deg)}</div>
          <div className="val sin"><Tex tex={`\\sin\\alpha = ${exact ? exact.sin + ' \\approx ' : ''}${fmt(sin)}`} /></div>
          <div className="val cos"><Tex tex={`\\cos\\alpha = ${exact ? exact.cos + ' \\approx ' : ''}${fmt(cos)}`} /></div>
          <div className="val tg"><Tex tex={`\\operatorname{tg}\\alpha = ${!isFinite(tg) ? '\\nexists' : (exact?.tg ? exact.tg + ' \\approx ' : '') + fmt(tg)}`} /></div>
          <div className="val"><Tex tex={`\\operatorname{ctg}\\alpha = ${!isFinite(ctg) ? '\\nexists' : (exact?.ctg ? exact.ctg + ' \\approx ' : '') + fmt(ctg)}`} /></div>
        </div>
        <div className="legend muted">
          <span style={{ color: '#2563eb' }}>■ cos</span> <span style={{ color: '#dc2626' }}>■ sin</span> <span style={{ color: '#9333ea' }}>■ tg (pe axa tangentelor)</span>
        </div>
        <div className="chips">
          {SPECIAL.map((s) => (
            <button key={s} className={'chip' + (s === deg ? ' active' : '')} onClick={() => setDeg(s)}>{s}°</button>
          ))}
        </div>
      </div>
    </div>
  )
}
