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

/** The ruler resting on a side of the set square: square edge index, which short end touches it, how far along the edge. */
export interface RulerDock {
  edge: number
  end: 1 | -1
  t: number
}

/** The set square resting on the ruler: which long edge of the ruler, which side of the square, the side's middle along the ruler. */
export interface SquareDock {
  edge: number
  side: number
  t: number
}

export interface Instruments {
  /** only one of the two rests on the other at a time */
  ruler: Inst & { dock?: RulerDock }
  protractor: Inst
  square: Inst & { shape: '45' | '60'; dock?: SquareDock }
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
const RULER_RIM = 3

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

/** The visible part of the sheet, starting at (x0, y0) if not at its corner; handles are kept inside it so they can always be grabbed. */
export interface Bounds { w: number; h: number; x0?: number; y0?: number }
const HANDLE_MARGIN = KNOB_R + 4

/**
 * Where a handle is shown: at its place on the instrument, or, when that is off the sheet (an end of the
 * ruler pushed past the edge), slid towards the instrument's pivot until it is back on the sheet.
 */
function handleAt(i: Inst, at: Pt, b?: Bounds): Pt {
  if (!b) return at
  const { x0 = 0, y0 = 0 } = b
  const on = ([x, y]: Pt) => x >= x0 + HANDLE_MARGIN && y >= y0 + HANDLE_MARGIN && x <= x0 + b.w - HANDLE_MARGIN && y <= y0 + b.h - HANDLE_MARGIN
  for (let s = 1; s >= 0; s -= 0.01) {
    const p: Pt = [at[0] * s, at[1] * s]
    if (on(toSheet(i, ...p))) return p
  }
  return at
}

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
  /** for each handle, the point that stays put while turning it */
  pivots: Pt[]
}

function shapeOf(id: EdgedId, tools: Instruments): Shape {
  if (id === 'ruler') {
    const l = RULER_L / 2, h = RULER_H / 2
    const dockEnd = tools.ruler.dock?.end
    return {
      edges: [
        { a: [-l, -h], b: [l, -h], n: [0, -1] },
        { a: [-l, h], b: [l, h], n: [0, 1] },
      ],
      inside: (x, y) => Math.abs(x) <= l && Math.abs(y) <= h,
      // one at each end; turning one end keeps the other end where it is, like holding it down with a finger.
      // The end resting on the set square has none: it would sit under the square, out of reach.
      knobs: dockEnd === 1 ? [[-l - 24, 0]] : dockEnd === -1 ? [[l + 24, 0]] : [[l + 24, 0], [-l - 24, 0]],
      pivots: dockEnd === 1 ? [[l, 0]] : dockEnd === -1 ? [[-l, 0]] : [[-l, 0], [l, 0]],
    }
  }
  if (id === 'protractor') {
    return {
      edges: [{ a: [-PROT_R, 0], b: [PROT_R, 0], n: [0, 1] }],
      inside: (x, y) => y <= 0 && Math.hypot(x, y) <= PROT_R,
      knobs: [[0, -PROT_R - 24]],
      pivots: [[0, 0]],
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
    pivots: [[0, 0]],
  }
}

/** how close a short end of the ruler must come to a side of the set square to rest on it */
const DOCK_SNAP = 20
/** how far the ruler must be pulled away from the side to come off it */
const DOCK_RELEASE = 44
/** how far from perpendicular to the side the ruler may be when it comes close */
const DOCK_MAX_TILT = 12

/** The point of an edge at distance t from its start, in the instrument's coordinates, plus the edge's length and direction. */
function along(e: Edge, t: number) {
  const len = Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1])
  const dir: Pt = [(e.b[0] - e.a[0]) / len, (e.b[1] - e.a[1]) / len]
  return { len, dir, at: [e.a[0] + dir[0] * t, e.a[1] + dir[1] * t] as Pt }
}

/** Where the ruler lies when resting on the square: its short end flat on the side, its length going straight out of it. */
export function dockedPose(tools: Instruments, dock: RulerDock) {
  const square = tools.square
  const e = shapeOf('square', tools).edges[dock.edge]
  const { at } = along(e, dock.t)
  const [x, y] = toSheet(square, at[0] + e.n[0] * (RULER_L / 2), at[1] + e.n[1] * (RULER_L / 2))
  const out = (Math.atan2(e.n[1], e.n[0]) * 180) / Math.PI + square.rot
  // the ruler's +x axis points at its end +1, so that end touching the side means +x points back into the square
  return { x, y, rot: (((dock.end === 1 ? out + 180 : out) % 360) + 360) % 360 }
}

/** The same contact seen from the other side: the ruler holds still and the square comes to rest on its short end. */
export function squareOnRulerEnd(tools: Instruments, dock: RulerDock) {
  const e = shapeOf('square', tools).edges[dock.edge]
  const { at } = along(e, dock.t)
  const rot = (((tools.ruler.rot - (dock.end === 1 ? 180 : 0) - (Math.atan2(e.n[1], e.n[0]) * 180) / Math.PI) % 360) + 360) % 360
  const [px, py] = toSheet(tools.ruler, dock.end * (RULER_L / 2), 0)
  const [ax, ay] = toSheet({ visible: true, x: 0, y: 0, rot }, at[0], at[1])
  return { x: px - ax, y: py - ay, rot }
}

/** Where a short end would be, and where along and how far from an edge of the square, for the ruler centered at (x, y). */
function endOnEdge(tools: Instruments, e: Edge, end: 1 | -1, x: number, y: number) {
  const a = rad(tools.ruler.rot)
  const [lx, ly] = toLocal(tools.square, x + end * (RULER_L / 2) * Math.cos(a), y + end * (RULER_L / 2) * Math.sin(a))
  const { len, dir } = along(e, 0)
  const px = lx - e.a[0], py = ly - e.a[1]
  // the whole end stays on the side, so one of the ruler's long edges can reach the side's corner
  return { t: px * dir[0] + py * dir[1], d: px * e.n[0] + py * e.n[1], min: RULER_H / 2, max: len - RULER_H / 2 }
}

/** The side of the square the ruler centered at (x, y) would rest on, if it is close and nearly perpendicular to one. */
export function findDock(tools: Instruments, x: number, y: number): RulerDock | null {
  if (!tools.ruler.visible || !tools.square.visible || tools.square.dock) return null
  const edges = shapeOf('square', tools).edges
  const rel = rad(tools.ruler.rot - tools.square.rot)
  let best: (RulerDock & { d: number }) | null = null
  edges.forEach((e, edge) => {
    for (const end of [1, -1] as const) {
      // the ruler must go outwards from the side, not lie across the square
      const facing = -end * (Math.cos(rel) * e.n[0] + Math.sin(rel) * e.n[1])
      if (facing < Math.cos(rad(DOCK_MAX_TILT))) continue
      const { t, d, min, max } = endOnEdge(tools, e, end, x, y)
      // d < 0 is the end lying over the square: it is natural to drag one onto the other
      if (d > DOCK_SNAP || d < -RULER_H || t < min - DOCK_SNAP || t > max + DOCK_SNAP) continue
      if (!best || Math.abs(d) < Math.abs(best.d)) best = { edge, end, t: Math.max(min, Math.min(max, t)), d }
    }
  })
  if (!best) return null
  const { edge, end, t } = best as RulerDock & { d: number }
  return { edge, end, t }
}

/** The ruler is dragged to (x, y) while resting on the square: it slides along the side, or null once it is pulled off. */
export function slideDock(tools: Instruments, dock: RulerDock, x: number, y: number): RulerDock | null {
  const e = shapeOf('square', tools).edges[dock.edge]
  const { t, d, min, max } = endOnEdge(tools, e, dock.end, x, y)
  if (Math.abs(d) > DOCK_RELEASE || t < min - DOCK_RELEASE || t > max + DOCK_RELEASE) return null
  return { ...dock, t: Math.max(min, Math.min(max, t)) }
}

/** Where the set square lies when resting on the ruler: one side flat on a long edge, the square on the outside of it. */
export function squareDockedPose(tools: Instruments, dock: SquareDock) {
  const e = shapeOf('ruler', tools).edges[dock.edge]
  const s = shapeOf('square', tools).edges[dock.side]
  const deg = ([x, y]: Pt) => (Math.atan2(y, x) * 180) / Math.PI
  // the side's outward normal points straight at the ruler
  const rot = (((deg(e.n) + tools.ruler.rot + 180 - deg(s.n)) % 360) + 360) % 360
  const [px, py] = toSheet(tools.ruler, dock.t, e.a[1])
  const [mx, my] = toSheet({ visible: true, x: 0, y: 0, rot }, (s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2)
  return { x: px - mx, y: py - my, rot }
}

/** The same contact seen from the other side: the square holds still and the ruler's long edge comes to rest on its side. */
export function rulerOnSquareSide(tools: Instruments, dock: SquareDock) {
  const e = shapeOf('ruler', tools).edges[dock.edge]
  const s = shapeOf('square', tools).edges[dock.side]
  const deg = ([x, y]: Pt) => (Math.atan2(y, x) * 180) / Math.PI
  const rot = (((deg(s.n) + tools.square.rot + 180 - deg(e.n)) % 360) + 360) % 360
  const [px, py] = toSheet(tools.square, (s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2)
  const [ax, ay] = toSheet({ visible: true, x: 0, y: 0, rot }, dock.t, e.a[1])
  return { x: px - ax, y: py - ay, rot }
}

/** Where a side of the square centered at (x, y) is, seen from an edge of the ruler. */
function sideOnEdge(tools: Instruments, e: Edge, s: Edge, x: number, y: number) {
  const [lx, ly] = toLocal(tools.ruler, ...toSheet({ ...tools.square, x, y }, (s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2))
  // the side can slide until only a little of it is still on the ruler
  const limit = RULER_L / 2 + along(s, 0).len / 2 - 40
  return { t: lx, d: (ly - e.a[1]) * e.n[1], limit }
}

/** The ruler's edge the square at (x, y) would rest on, if one of its sides is close, nearly parallel and over or next to it. */
export function findSquareDock(tools: Instruments, x: number, y: number): SquareDock | null {
  if (!tools.ruler.visible || !tools.square.visible || tools.ruler.dock) return null
  const sides = shapeOf('square', tools).edges
  const rel = rad(tools.square.rot - tools.ruler.rot)
  let best: (SquareDock & { d: number }) | null = null
  shapeOf('ruler', tools).edges.forEach((e, edge) => {
    sides.forEach((s, side) => {
      const facing = -((s.n[0] * Math.cos(rel) - s.n[1] * Math.sin(rel)) * e.n[0] + (s.n[0] * Math.sin(rel) + s.n[1] * Math.cos(rel)) * e.n[1])
      if (facing < Math.cos(rad(DOCK_MAX_TILT))) return
      const { t, d, limit } = sideOnEdge(tools, e, s, x, y)
      // d < 0 is the side lying over the ruler: it is natural to drag the square onto it
      if (d > DOCK_SNAP || d < -RULER_H || Math.abs(t) > limit + DOCK_SNAP) return
      if (!best || Math.abs(d) < Math.abs(best.d)) best = { edge, side, t: Math.max(-limit, Math.min(limit, t)), d }
    })
  })
  if (!best) return null
  const { edge, side, t } = best as SquareDock & { d: number }
  return { edge, side, t }
}

/** The square is dragged to (x, y) while resting on the ruler: it slides along the edge, or null once it is pulled off. */
export function slideSquareDock(tools: Instruments, dock: SquareDock, x: number, y: number): SquareDock | null {
  const { t, d, limit } = sideOnEdge(tools, shapeOf('ruler', tools).edges[dock.edge], shapeOf('square', tools).edges[dock.side], x, y)
  if (Math.abs(d) > DOCK_RELEASE || Math.abs(t) > limit + DOCK_RELEASE) return null
  return { ...dock, t: Math.max(-limit, Math.min(limit, t)) }
}

function segDist(px: number, py: number, [ax, ay]: Pt, [bx, by]: Pt) {
  const dx = bx - ax, dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}

export type Hit =
  | { id: InstId; kind: 'center' | 'body' | 'pencil' | 'radius' }
  /** a rotate handle; `pivot` (on the sheet) stays fixed while it turns */
  | { id: InstId; kind: 'knob'; pivot: Pt }
  | { id: InstId; kind: 'edge'; edge: Edge }

/** The compass: its pencil tip draws, the handle past it opens and turns it, the legs move it. */
function hitCompass(c: Instruments['compass'], x: number, y: number, draw: boolean, b?: Bounds): Hit | null {
  const [lx, ly] = toLocal(c, x, y)
  const [rx, ry] = handleAt(c, radiusHandleOf(c.r), b)
  if (Math.hypot(lx - rx, ly - ry) <= KNOB_R + 3) return { id: 'compass', kind: 'radius' }
  const hinge = hingeOf(c.r)
  // like a real compass, it draws when turned by the grip on top (or by the pencil itself)
  const onGrip = Math.hypot(lx - hinge[0], ly - hinge[1]) <= 16 || segDist(lx, ly, [hinge[0], hinge[1] - 10], [hinge[0], hinge[1] - GRIP_LEN]) <= 10
  if (draw && (onGrip || Math.hypot(lx - c.r, ly) <= 12)) return { id: 'compass', kind: 'pencil' }
  if (onGrip || segDist(lx, ly, [0, 0], hinge) <= 8 || segDist(lx, ly, [c.r, 0], hinge) <= 8)
    return { id: 'compass', kind: 'body' }
  return null
}

/**
 * What is under the pointer, topmost instrument first. With draw=false (eraser) edges and the center are ignored;
 * with 'compass' only the compass draws: its handles can't be mistaken for the start of a figure or a text.
 */
export function hitTest(tools: Instruments, x: number, y: number, draw: boolean | 'compass', b?: Bounds): Hit | null {
  if (tools.compass.visible) {
    const hit = hitCompass(tools.compass, x, y, !!draw, b)
    if (hit) return hit
  }
  for (const id of ['square', 'protractor', 'ruler'] as const) {
    const inst = tools[id]
    if (!inst.visible) continue
    const s = shapeOf(id, tools)
    const [lx, ly] = toLocal(inst, x, y)
    const k = s.knobs.findIndex((at) => {
      const [kx, ky] = handleAt(inst, at, b)
      return Math.hypot(lx - kx, ly - ky) <= KNOB_R + 3
    })
    if (k >= 0) return { id, kind: 'knob', pivot: toSheet(inst, ...s.pivots[k]) }
    // the ruler's surface moves it, up to a thin rim on its edge; a line along it starts on that rim or just outside
    const onRuler = id === 'ruler' && Math.abs(lx) <= RULER_L / 2 && Math.abs(ly) <= RULER_H / 2 - RULER_RIM
    if (draw === true && !onRuler) {
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

function Ruler({ dockEnd }: { dockEnd?: 1 | -1 }) {
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
      {dockEnd && <line x1={dockEnd * l} y1={-h} x2={dockEnd * l} y2={h} stroke="#16a34a" strokeWidth={3} />}
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

function SetSquare({ shape, dockSide }: { shape: '45' | '60'; dockSide?: Edge }) {
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
      {dockSide && <line x1={dockSide.a[0]} y1={dockSide.a[1]} x2={dockSide.b[0]} y2={dockSide.b[1]} stroke="#16a34a" strokeWidth={3} />}
    </>
  )
}

function Compass({ c, b }: { c: Instruments['compass']; b?: Bounds }) {
  const { r, rot } = c
  const [hx, hy] = hingeOf(r)
  const [kx, ky] = handleAt(c, radiusHandleOf(r), b)
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

export function InstrumentsLayer({ tools, bounds }: { tools: Instruments; bounds?: Bounds }) {
  const place = (i: Inst) => `translate(${i.x} ${i.y}) rotate(${i.rot})`
  const knob = (id: EdgedId) => shapeOf(id, tools).knobs.map((at, k) => <Knob key={k} at={handleAt(tools[id], at, bounds)} />)
  return (
    <g className="instruments">
      {tools.ruler.visible && <g transform={place(tools.ruler)}><Ruler dockEnd={tools.ruler.dock?.end} />{knob('ruler')}</g>}
      {tools.protractor.visible && <g transform={place(tools.protractor)}><Protractor />{knob('protractor')}</g>}
      {tools.square.visible && <g transform={place(tools.square)}><SetSquare shape={tools.square.shape} dockSide={tools.square.dock && shapeOf('square', tools).edges[tools.square.dock.side]} />{knob('square')}</g>}
      {tools.compass.visible && <g transform={place(tools.compass)}><Compass c={tools.compass} b={bounds} /></g>}
    </g>
  )
}
