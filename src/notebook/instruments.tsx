// Drawing instruments for the notebook: a ruler, a protractor, a set square and a compass. Each one can be moved
// and rotated on the sheet; a stroke started next to one of its edges follows that edge, like a pen along a real
// ruler, and the compass draws arcs around its needle.
export type InstId = 'ruler' | 'protractor' | 'square' | 'compass'
type EdgedId = Exclude<InstId, 'compass'>
export type Pt = [number, number]

export interface Inst {
  visible: boolean
  /** pivot on the sheet: the ruler's middle, the protractor's center, the set square's right-angle corner, the compass needle */
  x: number
  y: number
  /** degrees, clockwise */
  rot: number
}

export interface Instruments {
  ruler: Inst
  protractor: Inst
  square: Inst & { shape: '45' | '60' }
  /** rot points from the needle to the pencil; r is the opening */
  compass: Inst & { r: number }
}

/** The math paper's squares are 20 px = 5 mm, so 1 cm on the instruments is 40 px. */
export const PX_PER_CM = 40
const RULER_L = 16 * PX_PER_CM
const RULER_H = 64
export const PROT_R = 180
/** legs along the sheet's x and y: 45° (isosceles) or 30°/60° (tan 60° ≈ 360 / 208) */
const SQUARE_LEGS = { '45': [320, 320], '60': [360, 208] } as const
const KNOB_R = 13
/** how close to an edge (inside or outside the instrument) a stroke must start to follow it */
const EDGE_BAND = 18

export const defaultInstruments = (): Instruments => ({
  ruler: { visible: false, x: 420, y: 300, rot: 0 },
  protractor: { visible: false, x: 400, y: 520, rot: 0 },
  square: { visible: false, x: 200, y: 560, rot: 0, shape: '45' },
  compass: { visible: false, x: 300, y: 400, rot: 0, r: 3 * PX_PER_CM },
})

const COMPASS_LEG = 150
export const COMPASS_MAX_R = 16 * PX_PER_CM
/** the hinge of the compass, seen from above, in its own coordinates (needle at 0,0 and pencil at r,0) */
const hingeOf = (r: number): Pt => [r / 2, -Math.max(30, Math.sqrt(Math.max(0, COMPASS_LEG ** 2 - (r / 2) ** 2)))]
/** length of the grip on top of the hinge, the part you hold to draw */
const GRIP_LEN = 34
/** the handle that opens and turns the compass, just past the pencil */
const radiusHandleOf = (r: number): Pt => [r + 24, 0]

const rad = (deg: number) => (deg * Math.PI) / 180

export function toLocal(i: Inst, x: number, y: number): Pt {
  const a = rad(-i.rot), dx = x - i.x, dy = y - i.y
  return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)]
}

export function toSheet(i: Inst, lx: number, ly: number): Pt {
  const a = rad(i.rot)
  return [i.x + lx * Math.cos(a) - ly * Math.sin(a), i.y + lx * Math.sin(a) + ly * Math.cos(a)]
}

/** A straight edge in the instrument's own coordinates, with its outward unit normal. */
export interface Edge { a: Pt; b: Pt; n: Pt }

interface Shape {
  edges: Edge[]
  inside: (lx: number, ly: number) => boolean
  /** rotate handles */
  knobs: Pt[]
}

function shapeOf(id: EdgedId, tools: Instruments): Shape {
  if (id === 'ruler') {
    const l = RULER_L / 2, h = RULER_H / 2
    return {
      edges: [
        { a: [-l, -h], b: [l, -h], n: [0, -1] },
        { a: [-l, h], b: [l, h], n: [0, 1] },
      ],
      inside: (x, y) => Math.abs(x) <= l && Math.abs(y) <= h,
      // one at each end, so the ruler can be turned from whichever side is handy
      knobs: [[l + 24, 0], [-l - 24, 0]],
    }
  }
  if (id === 'protractor') {
    return {
      edges: [{ a: [-PROT_R, 0], b: [PROT_R, 0], n: [0, 1] }],
      inside: (x, y) => y <= 0 && Math.hypot(x, y) <= PROT_R,
      knobs: [[0, -PROT_R - 24]],
    }
  }
  const [w, h] = SQUARE_LEGS[tools.square.shape]
  const len = Math.hypot(w, h)
  const n: Pt = [h / len, -w / len]
  return {
    edges: [
      { a: [0, 0], b: [w, 0], n: [0, 1] },
      { a: [0, 0], b: [0, -h], n: [-1, 0] },
      { a: [w, 0], b: [0, -h], n },
    ],
    inside: (x, y) => x >= 0 && y <= 0 && x / w - y / h <= 1,
    knobs: [[w / 2 + n[0] * 26, -h / 2 + n[1] * 26]],
  }
}

function segDist(px: number, py: number, [ax, ay]: Pt, [bx, by]: Pt) {
  const dx = bx - ax, dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}

export type Hit =
  | { id: InstId; kind: 'knob' | 'center' | 'body' | 'pencil' | 'radius' }
  | { id: InstId; kind: 'edge'; edge: Edge }

/** The compass: its pencil tip draws, the handle past it opens and turns it, the legs move it. */
function hitCompass(c: Instruments['compass'], x: number, y: number, draw: boolean): Hit | null {
  const [lx, ly] = toLocal(c, x, y)
  const [rx, ry] = radiusHandleOf(c.r)
  if (Math.hypot(lx - rx, ly - ry) <= KNOB_R + 3) return { id: 'compass', kind: 'radius' }
  const hinge = hingeOf(c.r)
  // like a real compass, it draws when turned by the grip on top (or by the pencil itself)
  const onGrip = Math.hypot(lx - hinge[0], ly - hinge[1]) <= 16 || segDist(lx, ly, [hinge[0], hinge[1] - 10], [hinge[0], hinge[1] - GRIP_LEN]) <= 10
  if (draw && (onGrip || Math.hypot(lx - c.r, ly) <= 12)) return { id: 'compass', kind: 'pencil' }
  if (onGrip || segDist(lx, ly, [0, 0], hinge) <= 8 || segDist(lx, ly, [c.r, 0], hinge) <= 8)
    return { id: 'compass', kind: 'body' }
  return null
}

/** What is under the pointer, topmost instrument first. With draw=false (eraser) edges and the center are ignored. */
export function hitTest(tools: Instruments, x: number, y: number, draw: boolean): Hit | null {
  if (tools.compass.visible) {
    const hit = hitCompass(tools.compass, x, y, draw)
    if (hit) return hit
  }
  for (const id of ['square', 'protractor', 'ruler'] as const) {
    const inst = tools[id]
    if (!inst.visible) continue
    const s = shapeOf(id, tools)
    const [lx, ly] = toLocal(inst, x, y)
    if (s.knobs.some(([kx, ky]) => Math.hypot(lx - kx, ly - ky) <= KNOB_R + 3)) return { id, kind: 'knob' }
    if (draw) {
      if (id === 'protractor' && Math.hypot(lx, ly) <= 14) return { id, kind: 'center' }
      let best: { edge: Edge; d: number } | null = null
      for (const edge of s.edges) {
        const d = segDist(lx, ly, edge.a, edge.b)
        if (d <= EDGE_BAND && (!best || d < best.d)) best = { edge, d }
      }
      if (best) return { id, kind: 'edge', edge: best.edge }
    }
    if (s.inside(lx, ly)) return { id, kind: 'body' }
  }
  return null
}

/** The point on the edge nearest to (x, y), moved `off` px outside it so the line runs along the edge. */
export function projectOnEdge(i: Inst, e: Edge, x: number, y: number, off: number): Pt {
  const [lx, ly] = toLocal(i, x, y)
  const dx = e.b[0] - e.a[0], dy = e.b[1] - e.a[1]
  const t = Math.max(0, Math.min(1, ((lx - e.a[0]) * dx + (ly - e.a[1]) * dy) / (dx * dx + dy * dy)))
  return toSheet(i, e.a[0] + t * dx + e.n[0] * off, e.a[1] + t * dy + e.n[1] * off)
}

/** Angle of a point seen from the protractor's center, in degrees from its right-hand baseline, counterclockwise. */
export function protractorAngle(i: Inst, x: number, y: number) {
  const [lx, ly] = toLocal(i, x, y)
  return { deg: (Math.atan2(-ly, lx) * 180) / Math.PI, r: Math.hypot(lx, ly) }
}

/** Point at `deg` (counterclockwise from the right baseline) and distance r from the protractor's center. */
export const protractorPoint = (i: Inst, deg: number, r: number) => toSheet(i, r * Math.cos(rad(deg)), -r * Math.sin(rad(deg)))

/** 37.2541 → 37°15′15″ */
export function formatDms(deg: number) {
  const sign = deg < 0 ? '−' : ''
  let total = Math.round(Math.abs(deg) * 3600)
  const d = Math.floor(total / 3600)
  total -= d * 3600
  const m = Math.floor(total / 60)
  const s = total - m * 60
  return sign + d + '°' + (m || s ? m + '′' : '') + (s ? s + '″' : '')
}

const BODY = { fill: 'rgba(226, 232, 240, 0.3)', stroke: '#64748b', strokeWidth: 1 }
const TICK = { stroke: '#334155', strokeWidth: 1 }
const LABEL = { fontSize: 11, fill: '#334155', textAnchor: 'middle' as const }

function Knob({ at }: { at: Pt }) {
  return (
    <g className="inst-knob">
      <circle cx={at[0]} cy={at[1]} r={KNOB_R} fill="#fff" stroke="#4f46e5" strokeWidth={1.5} />
      <text x={at[0]} y={at[1] + 5} fontSize={15} fill="#4f46e5" textAnchor="middle">↻</text>
    </g>
  )
}

function Ruler() {
  const l = RULER_L / 2, h = RULER_H / 2
  const ticks = []
  for (let mm = 0; mm <= RULER_L / 4; mm++) {
    const x = -l + mm * 4
    const len = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 11 : 6
    ticks.push(<line key={mm} x1={x} y1={-h} x2={x} y2={-h + len} {...TICK} />)
    if (mm % 10 === 0) ticks.push(<text key={'t' + mm} x={x} y={-h + 28} {...LABEL}>{mm / 10}</text>)
  }
  return (
    <>
      <rect x={-l} y={-h} width={RULER_L} height={RULER_H} rx={4} {...BODY} />
      {ticks}
      <text x={l - 8} y={h - 8} {...LABEL} textAnchor="end" fontSize={10} fill="#64748b">cm</text>
    </>
  )
}

function Protractor() {
  const marks = []
  for (let d = 0; d <= 180; d++) {
    const len = d % 10 === 0 ? 16 : d % 5 === 0 ? 11 : 6
    const c = Math.cos(rad(d)), s = -Math.sin(rad(d))
    marks.push(<line key={d} x1={PROT_R * c} y1={PROT_R * s} x2={(PROT_R - len) * c} y2={(PROT_R - len) * s} {...TICK} />)
    if (d % 10 === 0) {
      marks.push(<text key={'o' + d} x={(PROT_R - 27) * c} y={(PROT_R - 27) * s + 4} {...LABEL}>{d}</text>)
      marks.push(<text key={'i' + d} x={(PROT_R - 44) * c} y={(PROT_R - 44) * s + 4} {...LABEL} fontSize={9} fill="#64748b">{180 - d}</text>)
    }
  }
  return (
    <>
      <path d={`M ${-PROT_R} 0 A ${PROT_R} ${PROT_R} 0 0 1 ${PROT_R} 0 Z`} {...BODY} />
      <path d={`M ${-(PROT_R - 60)} 0 A ${PROT_R - 60} ${PROT_R - 60} 0 0 1 ${PROT_R - 60} 0`} fill="none" stroke="#cbd5e1" />
      {marks}
      <line x1={0} y1={0} x2={0} y2={-(PROT_R - 60)} stroke="#cbd5e1" />
      <circle cx={0} cy={0} r={4} fill="none" stroke="#dc2626" strokeWidth={1.5} />
      <line x1={-8} y1={0} x2={8} y2={0} stroke="#dc2626" strokeWidth={1.5} />
    </>
  )
}

function SetSquare({ shape }: { shape: '45' | '60' }) {
  const [w, h] = SQUARE_LEGS[shape]
  const ticks = []
  for (let mm = 0; mm * 4 <= w - 30; mm++) {
    const len = mm % 10 === 0 ? 14 : mm % 5 === 0 ? 9 : 5
    ticks.push(<line key={'x' + mm} x1={mm * 4} y1={0} x2={mm * 4} y2={-len} {...TICK} />)
    if (mm % 10 === 0 && mm) ticks.push(<text key={'xt' + mm} x={mm * 4} y={-20} {...LABEL} fontSize={10}>{mm / 10}</text>)
  }
  for (let mm = 1; mm * 4 <= h - 30; mm++) {
    const len = mm % 10 === 0 ? 14 : mm % 5 === 0 ? 9 : 5
    ticks.push(<line key={'y' + mm} x1={0} y1={-mm * 4} x2={len} y2={-mm * 4} {...TICK} />)
    if (mm % 10 === 0) ticks.push(<text key={'yt' + mm} x={24} y={-mm * 4 + 4} {...LABEL} fontSize={10}>{mm / 10}</text>)
  }
  return (
    <>
      <path d={`M 0 0 L ${w} 0 L 0 ${-h} Z`} {...BODY} />
      {/* a real set square's hole, which also shows the paper underneath */}
      <path d={`M ${w * 0.22} ${-h * 0.22} L ${w * 0.5} ${-h * 0.22} L ${w * 0.22} ${-h * 0.5} Z`} fill="rgba(255,255,255,.6)" stroke="#94a3b8" />
      {ticks}
      <path d="M 22 0 V -22 H 0" fill="none" stroke="#dc2626" strokeWidth={1.5} />
      <text x={w * 0.3} y={-h * 0.3} {...LABEL} fontSize={10} fill="#64748b">{shape === '45' ? '45°–45°' : '30°–60°'}</text>
    </>
  )
}

function Compass({ r, rot }: { r: number; rot: number }) {
  const [hx, hy] = hingeOf(r)
  const [kx, ky] = radiusHandleOf(r)
  const leg = { stroke: '#475569', strokeWidth: 6, strokeLinecap: 'round' as const }
  const legInner = { stroke: '#cbd5e1', strokeWidth: 2, strokeLinecap: 'round' as const }
  return (
    <>
      <line x1={0} y1={0} x2={r} y2={0} stroke="#94a3b8" strokeDasharray="4 4" />
      {/* the label stays upright whatever way the compass is turned */}
      <text x={r / 2} y={16} {...LABEL} fill="#4f46e5" transform={`rotate(${-rot} ${r / 2} 12)`}>
        r = {(r / PX_PER_CM).toFixed(1).replace('.', ',')} cm
      </text>
      <line x1={0} y1={0} x2={hx} y2={hy} {...leg} />
      <line x1={0} y1={0} x2={hx} y2={hy} {...legInner} />
      <line x1={r} y1={0} x2={hx} y2={hy} {...leg} stroke="#64748b" />
      <line x1={r - (r - hx) * 0.22} y1={hy * 0.22} x2={r - (r - hx) * 0.08} y2={hy * 0.08} stroke="#facc15" strokeWidth={8} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={10} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
      <g className="compass-grip">
        <line x1={hx} y1={hy - 10} x2={hx} y2={hy - GRIP_LEN} stroke="#4f46e5" strokeWidth={9} strokeLinecap="round" />
        {[16, 22, 28].map((d) => <line key={d} x1={hx - 3} y1={hy - d} x2={hx + 3} y2={hy - d} stroke="#c7d2fe" strokeWidth={1.5} />)}
      </g>
      <circle cx={0} cy={0} r={3.5} fill="#dc2626" />
      <circle cx={r} cy={0} r={4.5} fill="#111827" stroke="#fff" strokeWidth={1.5} />
      <g className="inst-knob">
        <circle cx={kx} cy={ky} r={KNOB_R} fill="#fff" stroke="#4f46e5" strokeWidth={1.5} />
        <text x={kx} y={ky + 5} fontSize={14} fill="#4f46e5" textAnchor="middle">⟷</text>
      </g>
    </>
  )
}

export function InstrumentsLayer({ tools }: { tools: Instruments }) {
  const place = (i: Inst) => `translate(${i.x} ${i.y}) rotate(${i.rot})`
  const knob = (id: EdgedId) => shapeOf(id, tools).knobs.map((at, k) => <Knob key={k} at={at} />)
  return (
    <g className="instruments">
      {tools.ruler.visible && <g transform={place(tools.ruler)}><Ruler />{knob('ruler')}</g>}
      {tools.protractor.visible && <g transform={place(tools.protractor)}><Protractor />{knob('protractor')}</g>}
      {tools.square.visible && <g transform={place(tools.square)}><SetSquare shape={tools.square.shape} />{knob('square')}</g>}
      {tools.compass.visible && <g transform={place(tools.compass)}><Compass r={tools.compass.r} rot={tools.compass.rot} /></g>}
    </g>
  )
}
