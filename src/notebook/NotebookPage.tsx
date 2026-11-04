// Freehand notebook: write with the mouse, a pen tablet or a finger, like with a pen on paper.
// Strokes are kept as points and drawn as SVG outlines (perfect-freehand), so they stay sharp and small to store.
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { getStroke } from 'perfect-freehand'
import { saveFile } from '../platform'
import { rasterize, saveDocx, savePdf, today } from '../export/exportDoc'
import { usePrompt } from '../components/PromptDialog'
import {
  COMPASS_MAX_R, defaultInstruments, dockedPose, findDock, formatDms, hitTest, InstrumentsLayer, projectOnEdge, protractorAngle,
  protractorPoint, PROT_R, PX_PER_CM, slideDock, type Bounds, type Edge, type Hit, type InstId, type Instruments, type Pt,
} from './instruments'

type Tool = 'pen' | 'marker' | 'eraser'
type Paper = 'grid' | 'lines' | 'blank'

interface Stroke {
  id: string
  tool: 'pen' | 'marker'
  color: string
  size: number
  /** [x, y, pressure] */
  points: number[][]
  /** pressure is real (pen tablet, straight line); otherwise it is simulated from the speed */
  pressure: boolean
}

interface Notebook {
  paper: Paper
  pages: Stroke[][]
  current: number
  tools: Instruments
}

/** What the pointer is doing between pointerdown and pointerup. */
type Active = { pointerId: number; start: number[]; before: Stroke[] } & (
  | { mode: 'draw' | 'erase' }
  | { mode: 'move'; id: InstId; dx: number; dy: number }
  /** turning around `pivot` (sheet point); x0, y0, rot0 = where the instrument was when grabbed */
  | { mode: 'rotate'; id: InstId; pivot: Pt; a0: number; rot0: number; x0: number; y0: number }
  | { mode: 'edge'; id: InstId; edge: Edge; from: Pt }
  | { mode: 'ray' }
  | { mode: 'radius' }
  /** compass arc: from angle `from`, `sweep` degrees so far (signed, at most a full turn), `last` = pointer angle */
  | { mode: 'arc'; from: number; sweep: number; last: number }
)

const KEY = 'math-journal:notebook'
const COLORS: Record<'pen' | 'marker', { name: string; value: string }[]> = {
  pen: [
    { name: 'negru', value: '#111827' },
    { name: 'albastru', value: '#1d4ed8' },
    { name: 'roșu', value: '#dc2626' },
    { name: 'verde', value: '#15803d' },
  ],
  marker: [
    { name: 'galben', value: '#facc15' },
    { name: 'verde', value: '#4ade80' },
    { name: 'roz', value: '#f472b6' },
    { name: 'albastru', value: '#60a5fa' },
  ],
}
const SIZES: Record<Tool, number[]> = { pen: [2, 3.5, 6], marker: [12, 18, 26], eraser: [8, 16, 30] }
const SIZE_LABELS = ['Fin', 'Mediu', 'Gros']
const PAPERS: { id: Paper; label: string }[] = [
  { id: 'grid', label: 'Matematică' },
  { id: 'lines', label: 'Dictando' },
  { id: 'blank', label: 'Albă' },
]

function load(): Notebook {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      return { ...saved, tools: { ...defaultInstruments(), ...saved.tools } }
    }
  } catch {
    /* storage unavailable: start empty */
  }
  return { paper: 'grid', pages: [[]], current: 0, tools: defaultInstruments() }
}

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d
const uid = () => Math.random().toString(36).slice(2, 10)
const clampTo = (v: number, max?: number) => (max ? Math.min(max - 10, Math.max(10, v)) : v)

/** perfect-freehand outline → SVG path (quadratic curves through the midpoints). */
function outlinePath(s: Stroke) {
  const pts = getStroke(s.points, {
    size: s.size,
    thinning: s.tool === 'marker' ? 0 : 0.6,
    smoothing: 0.5,
    streamline: 0.45,
    simulatePressure: !s.pressure,
    last: true,
  })
  if (!pts.length) return ''
  const d: (string | number)[] = ['M', round(pts[0][0]), round(pts[0][1]), 'Q']
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length]
    d.push(round(x0), round(y0), round((x0 + x1) / 2), round((y0 + y1) / 2))
  })
  d.push('Z')
  return d.join(' ')
}

const StrokePath = memo(function StrokePath({ s }: { s: Stroke }) {
  const d = useMemo(() => outlinePath(s), [s])
  return <path d={d} fill={s.color} opacity={s.tool === 'marker' ? 0.4 : 1} />
})

/** Distance from point p to segment ab. */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay
  const len = dx * dx + dy * dy
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}

function touches(s: Stroke, x: number, y: number, r: number) {
  const reach = r + s.size / 2
  const p = s.points
  if (p.length === 1) return Math.hypot(p[0][0] - x, p[0][1] - y) <= reach
  for (let i = 1; i < p.length; i++) if (segDist(x, y, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]) <= reach) return true
  return false
}

/** The compass pencil's position when the compass points at `deg` (clockwise on screen). */
const compassPoint = (c: Instruments['compass'], deg: number) => {
  const a = (deg * Math.PI) / 180
  return [round(c.x + c.r * Math.cos(a)), round(c.y + c.r * Math.sin(a)), 0.5]
}

/** An arc around the compass needle, from angle `from`, `sweep` degrees long; even width like a line. */
function arcPoints(c: Instruments['compass'], from: number, sweep: number) {
  const n = Math.max(2, Math.ceil((Math.abs(sweep) * Math.PI * c.r) / 180 / 4))
  return Array.from({ length: n + 1 }, (_, k) => compassPoint(c, from + (sweep * k) / n))
}

/** Points of a straight line, with constant pressure so it has an even width. */
function linePoints(a: number[], x: number, y: number) {
  const n = Math.max(2, Math.ceil(Math.hypot(x - a[0], y - a[1]) / 4))
  return Array.from({ length: n + 1 }, (_, i) => [round(a[0] + ((x - a[0]) * i) / n), round(a[1] + ((y - a[1]) * i) / n), 0.5])
}

function PaperBackground({ paper }: { paper: Paper }) {
  return (
    <>
      <defs>
        <pattern id="paper-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#fff" />
          <path d="M20 0V20H0" fill="none" stroke="#c7d7ee" strokeWidth="1" />
        </pattern>
        <pattern id="paper-lines" width="20" height="32" patternUnits="userSpaceOnUse">
          <rect width="20" height="32" fill="#fff" />
          <path d="M0 31.5H20" stroke="#b9cbe6" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={paper === 'blank' ? '#fff' : `url(#paper-${paper})`} />
      {paper !== 'blank' && <line x1="60" y1="0" x2="60" y2="100%" stroke="#f3a3a3" strokeWidth="1.5" />}
    </>
  )
}

/**
 * One page as a picture for export: the paper and the strokes, without the instruments. It is as wide as the
 * sheet on screen and tall enough for everything written on it (pages may have been written on a taller window).
 */
async function pagePicture(strokes: Stroke[], paper: Paper, width: number, minHeight: number, title: string) {
  const { renderToStaticMarkup } = await import('react-dom/server')
  let bottom = 0
  for (const s of strokes) for (const p of s.points) bottom = Math.max(bottom, p[1] + s.size)
  const height = Math.max(minHeight, Math.ceil(bottom + 40))
  const markup = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <PaperBackground paper={paper} />
      {strokes.map((s) => <StrokePath key={s.id} s={s} />)}
    </svg>,
  )
  return rasterize(markup, width, height, title)
}

export default function NotebookPage() {
  const [nb, setNb] = useState<Notebook>(load)
  const [tool, setTool] = useState<Tool>('pen')
  const [colors, setColors] = useState({ pen: COLORS.pen[0].value, marker: COLORS.marker[0].value })
  const [sizeIdx, setSizeIdx] = useState<Record<Tool, number>>({ pen: 1, marker: 1, eraser: 1 })
  const [drawing, setDrawing] = useState<Stroke | null>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  // undo / redo: snapshots of one page's strokes (strokes are never mutated, so this is cheap)
  const [past, setPast] = useState<{ page: number; strokes: Stroke[] }[]>([])
  const [future, setFuture] = useState<{ page: number; strokes: Stroke[] }[]>([])
  // live readout next to the pointer: a length along the ruler, an angle on the protractor
  const [hint, setHint] = useState<{ x: number; y: number; text: string } | null>(null)
  const [hover, setHover] = useState<Hit['kind'] | null>(null)
  const [angle, setAngle] = useState({ d: '60', m: '', s: '' })
  const [busy, setBusy] = useState(false)
  // in-app dialog: window.confirm may return at once without showing anything inside the app's webview
  const { ask, confirm: confirmDialog, dialog } = usePrompt()
  const svgRef = useRef<SVGSVGElement>(null)
  // size of the sheet on screen, so the instruments' handles stay where they can be grabbed
  const [bounds, setBounds] = useState<Bounds>()
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const ro = new ResizeObserver(([e]) => setBounds({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(svg)
    return () => ro.disconnect()
  }, [])
  const active = useRef<Active | null>(null)

  const strokes = nb.pages[nb.current]
  const size = SIZES[tool][sizeIdx[tool]]

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(nb))
      } catch {
        /* ignore quota / private mode */
      }
    }, 400)
    return () => clearTimeout(t)
  }, [nb])

  const setPage = (page: number, next: Stroke[]) =>
    setNb((n) => ({ ...n, pages: n.pages.map((p, i) => (i === page ? next : p)) }))

  /** Record the page as it was, before a change, so it can be undone. */
  const remember = (page: number, before: Stroke[]) => {
    setPast((p) => [...p.slice(-99), { page, strokes: before }])
    setFuture([])
  }

  const undo = () => {
    const last = past[past.length - 1]
    if (!last) return
    setPast(past.slice(0, -1))
    setFuture((f) => [...f, { page: last.page, strokes: nb.pages[last.page] }])
    setNb((n) => ({ ...n, current: last.page, pages: n.pages.map((p, i) => (i === last.page ? last.strokes : p)) }))
  }

  const redo = () => {
    const next = future[future.length - 1]
    if (!next) return
    setFuture(future.slice(0, -1))
    setPast((p) => [...p, { page: next.page, strokes: nb.pages[next.page] }])
    setNb((n) => ({ ...n, current: next.page, pages: n.pages.map((p, i) => (i === next.page ? next.strokes : p)) }))
  }

  const clearPage = () => {
    if (!strokes.length) return
    remember(nb.current, strokes)
    setPage(nb.current, [])
  }

  const addPage = () => setNb((n) => ({ ...n, pages: [...n.pages, []], current: n.pages.length }))

  const clearAll = async () => {
    if (!(await confirmDialog('Golești tot caietul? Se șterg toate paginile și nu se mai poate anula.', 'Golește tot'))) return
    setPast([])
    setFuture([])
    setNb((n) => ({ ...n, pages: [[]], current: 0 }))
  }

  const deletePage = async () => {
    if (nb.pages.length < 2) return clearPage()
    if (strokes.length && !(await confirmDialog('Ștergi pagina cu tot ce e scris pe ea?', 'Șterge pagina'))) return
    // page numbers in the undo history would point to the wrong pages after this
    setPast([])
    setFuture([])
    setNb((n) => ({ ...n, pages: n.pages.filter((_, i) => i !== n.current), current: Math.max(0, n.current - 1) }))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'MATH-FIELD'].includes((e.target as HTMLElement).tagName)) return
      const k = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo() }
      else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo() }
      else if (e.ctrlKey || e.metaKey || e.altKey) return
      else if (k === 'p') setTool('pen')
      else if (k === 'm') setTool('marker')
      else if (k === 'e') setTool('eraser')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pointAt = (e: { clientX: number; clientY: number; pressure: number; pointerType: string }) => {
    const r = svgRef.current!.getBoundingClientRect()
    return [round(e.clientX - r.left), round(e.clientY - r.top), e.pointerType === 'pen' ? round(e.pressure || 0.5, 2) : 0.5]
  }

  const eraseAt = (x: number, y: number) =>
    setNb((n) => {
      const page = n.pages[n.current]
      const kept = page.filter((s) => !touches(s, x, y, size))
      return kept.length === page.length ? n : { ...n, pages: n.pages.map((p, i) => (i === n.current ? kept : p)) }
    })

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (active.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    try {
      // keep receiving moves when the pen leaves the sheet mid-stroke
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer already gone: draw without capture */
    }
    const p = pointAt(e)
    const base = { pointerId: e.pointerId, start: p, before: strokes }
    const hit = hitTest(nb.tools, p[0], p[1], tool !== 'eraser', bounds)
    const newStroke = (points: number[][], pressure: boolean): Stroke =>
      ({ id: uid(), tool: tool as Stroke['tool'], color: colors[tool as Stroke['tool']], size, points, pressure })
    if (hit?.kind === 'radius') {
      active.current = { ...base, mode: 'radius' }
    } else if (hit?.kind === 'pencil') {
      const c = nb.tools.compass
      // the turn is measured from where it was grabbed (grip or pencil), around the needle
      const grabbed = (Math.atan2(p[1] - c.y, p[0] - c.x) * 180) / Math.PI
      active.current = { ...base, mode: 'arc', from: c.rot, sweep: 0, last: grabbed }
      setDrawing(newStroke([compassPoint(c, c.rot)], true))
    } else if (hit?.kind === 'knob') {
      const i = nb.tools[hit.id]
      const [qx, qy] = hit.pivot
      active.current = { ...base, mode: 'rotate', id: hit.id, pivot: hit.pivot, a0: Math.atan2(p[1] - qy, p[0] - qx), rot0: i.rot, x0: i.x, y0: i.y }
      // turning the ruler lifts it off the set square; on release it rests there again if it is still close
      if (hit.id === 'ruler') setInst('ruler', { dock: undefined })
    } else if (hit?.kind === 'body') {
      const i = nb.tools[hit.id]
      active.current = { ...base, mode: 'move', id: hit.id, dx: p[0] - i.x, dy: p[1] - i.y }
    } else if (hit?.kind === 'edge') {
      const from = projectOnEdge(nb.tools[hit.id], hit.edge, p[0], p[1], size / 2 + 1)
      active.current = { ...base, mode: 'edge', id: hit.id, edge: hit.edge, from }
      setDrawing(newStroke([[...from, 0.5]], true))
    } else if (hit?.kind === 'center') {
      const c = nb.tools.protractor
      active.current = { ...base, mode: 'ray' }
      setDrawing(newStroke([[c.x, c.y, 0.5]], true))
    } else if (tool === 'eraser') {
      active.current = { ...base, mode: 'erase' }
      eraseAt(p[0], p[1])
    } else {
      active.current = { ...base, mode: 'draw' }
      setDrawing(newStroke([p], e.pointerType === 'pen'))
    }
  }

  const setInst = (id: InstId, patch: Partial<Instruments[InstId]>) =>
    setNb((n) => {
      const tools: Instruments = { ...n.tools, [id]: { ...n.tools[id], ...patch } }
      const dock = tools.ruler.dock
      if (dock && (id === 'ruler' || id === 'square') && ('visible' in patch || 'shape' in patch)) {
        // hidden, or the square's sides changed: the ruler stays where it is, no longer resting on the square
        tools.ruler = { ...tools.ruler, dock: undefined }
      } else if (dock && id === 'square') {
        // the ruler resting on the set square goes with it
        tools.ruler = { ...tools.ruler, ...dockedPose(tools, dock) }
      }
      return { ...n, tools }
    })

  /** Drag the ruler: it rests on the set square when it comes close, slides along the side, and comes off when pulled away. */
  const moveRuler = (a: { dx: number; dy: number }, px: number, py: number) => {
    const x = px - a.dx, y = py - a.dy
    const was = nb.tools.ruler.dock
    const dock = was ? slideDock(nb.tools, was, x, y) : findDock(nb.tools, x, y)
    if (!dock) {
      setInst('ruler', { x: round(clampTo(x, bounds?.w)), y: round(clampTo(y, bounds?.h)), dock: undefined })
      return setHint(null)
    }
    const pose = dockedPose(nb.tools, dock)
    if (!was) {
      // it jumped into place: from here on the drag is measured from where it landed
      a.dx = px - pose.x
      a.dy = py - pose.y
    }
    setInst('ruler', { ...pose, dock })
    setHint({ x: px + 16, y: py - 12, text: '⟂ pe echer' })
  }

  /** Show or hide an instrument; it appears in the middle of the visible sheet. */
  const toggleInst = (id: InstId) => {
    const i = nb.tools[id]
    if (i.visible) return setInst(id, { visible: false })
    const r = svgRef.current!.getBoundingClientRect()
    // ruler at the top, set square bottom left, protractor bottom right, so all three can be out at once
    const at = {
      ruler: [r.width / 2, r.height * 0.25],
      square: [Math.max(40, r.width * 0.06), r.height * 0.88],
      protractor: [r.width * 0.7, r.height * 0.8],
      compass: [r.width * 0.4, r.height * 0.55],
    }[id]
    setInst(id, { visible: true, x: round(at[0]), y: round(at[1]) })
  }

  /** A whole circle with the compass as it is set now. */
  const drawCircle = () => {
    const c = nb.tools.compass
    const circle: Stroke = { id: uid(), tool: 'pen', color: colors.pen, size: SIZES.pen[sizeIdx.pen], points: arcPoints(c, c.rot, 360), pressure: true }
    remember(nb.current, strokes)
    setPage(nb.current, [...strokes, circle])
  }

  /** Draw the angle typed in degrees, minutes and seconds from the protractor's center: two rays and an arc. */
  const drawAngle = () => {
    const deg = (Number(angle.d) || 0) + (Number(angle.m) || 0) / 60 + (Number(angle.s) || 0) / 3600
    if (!(deg > 0 && deg <= 360)) return
    const c = nb.tools.protractor
    const len = PROT_R + 40
    const ray = (a: number) => {
      const [x, y] = protractorPoint(c, a, len)
      return { id: uid(), tool: 'pen' as const, color: colors.pen, size: SIZES.pen[sizeIdx.pen], points: linePoints([c.x, c.y], x, y), pressure: true }
    }
    const steps = Math.max(8, Math.ceil(deg / 3))
    const arc = Array.from({ length: steps + 1 }, (_, k) => [...protractorPoint(c, (deg * k) / steps, 36).map((v) => round(v)), 0.5])
    remember(nb.current, strokes)
    setPage(nb.current, [...strokes, ray(0), ray(deg), { ...ray(0), id: uid(), size: 1.5, points: arc }])
    setHint({ x: c.x + 44, y: c.y - 40, text: formatDms(deg) })
    setTimeout(() => setHint(null), 2500)
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const [px, py] = pointAt(e)
    const a = active.current
    if (!a) setHover(hitTest(nb.tools, px, py, tool !== 'eraser', bounds)?.kind ?? null)
    // over an instrument the eraser moves it, so it does not show the eraser circle
    if (tool === 'eraser') setCursor(!a && hover ? null : { x: px, y: py })
    if (!a || a.pointerId !== e.pointerId) return

    if (a.mode === 'move' && a.id === 'ruler') return moveRuler(a, px, py)
    // the pivot stays on the sheet, so an instrument can't be dragged away out of reach
    if (a.mode === 'move') return setInst(a.id, { x: round(clampTo(px - a.dx, bounds?.w)), y: round(clampTo(py - a.dy, bounds?.h)) })
    if (a.mode === 'radius') {
      const c = nb.tools.compass
      // opening to the millimetre (4 px), pointing where the handle is dragged
      const r = Math.min(COMPASS_MAX_R, Math.max(8, Math.round((Math.hypot(px - c.x, py - c.y) - 24) / 4) * 4))
      setInst('compass', { r, rot: round((Math.atan2(py - c.y, px - c.x) * 180) / Math.PI) })
      return setHint({ x: px + 16, y: py - 12, text: 'r = ' + (r / PX_PER_CM).toFixed(1).replace('.', ',') + ' cm' })
    }
    if (a.mode === 'arc') {
      const c = nb.tools.compass
      const angle = (Math.atan2(py - c.y, px - c.x) * 180) / Math.PI
      // follow the pointer around the needle; the turn is unwrapped so a whole circle can be drawn
      const step = ((angle - a.last + 540) % 360) - 180
      a.sweep = Math.max(-360, Math.min(360, a.sweep + step))
      a.last = angle
      setInst('compass', { rot: round((((a.from + a.sweep) % 360) + 360) % 360) })
      setDrawing((d) => d && { ...d, points: arcPoints(c, a.from, a.sweep) })
      return setHint({ x: px + 16, y: py - 12, text: formatDms(Math.round(Math.abs(a.sweep))) })
    }
    if (a.mode === 'rotate') {
      const [qx, qy] = a.pivot
      let rot = a.rot0 + ((Math.atan2(py - qy, px - qx) - a.a0) * 180) / Math.PI
      rot = ((rot % 360) + 360) % 360
      // stick to multiples of 15° (0°, 45°, 90°…) when close, unless Shift is held
      const snap = Math.round(rot / 15) * 15
      if (!e.shiftKey && Math.abs(rot - snap) < 2) rot = snap % 360
      // turn the instrument's position around the pivot by the same angle, so the pivot stays put
      const t = ((rot - a.rot0) * Math.PI) / 180
      const dx = a.x0 - qx, dy = a.y0 - qy
      setInst(a.id, { rot: round(rot), x: round(qx + dx * Math.cos(t) - dy * Math.sin(t), 2), y: round(qy + dx * Math.sin(t) + dy * Math.cos(t), 2) })
      return setHint({ x: px + 16, y: py - 12, text: formatDms(round(rot)) })
    }
    if (a.mode === 'edge') {
      const to = projectOnEdge(nb.tools[a.id], a.edge, px, py, size / 2 + 1)
      setDrawing((d) => d && { ...d, points: linePoints(a.from, to[0], to[1]) })
      const cm = Math.hypot(to[0] - a.from[0], to[1] - a.from[1]) / PX_PER_CM
      return setHint({ x: px + 16, y: py - 12, text: cm.toFixed(1).replace('.', ',') + ' cm' })
    }
    if (a.mode === 'ray') {
      const c = nb.tools.protractor
      const { deg, r } = protractorAngle(c, px, py)
      // whole degrees; Shift = free angle (to the minute)
      const shown = e.shiftKey ? Math.round(deg * 60) / 60 : Math.round(deg)
      const [x, y] = protractorPoint(c, shown, r)
      setDrawing((d) => d && { ...d, points: linePoints([c.x, c.y], x, y) })
      return setHint({ x: px + 16, y: py - 12, text: formatDms(shown) })
    }

    // coalesced events: all the positions the mouse passed through since the last frame, for smooth curves
    const events = e.nativeEvent.getCoalescedEvents?.() ?? []
    const pts = (events.length ? events : [e.nativeEvent]).map(pointAt)
    if (a.mode === 'erase') return pts.forEach(([x, y]) => eraseAt(x, y))
    setDrawing((d) => {
      if (!d) return d
      const [x, y] = pts[pts.length - 1]
      // Shift held: a straight line from where the stroke started
      if (e.shiftKey) return { ...d, points: linePoints(a.start, x, y), pressure: true }
      return { ...d, points: [...d.points, ...pts] }
    })
  }

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const a = active.current
    if (!a || a.pointerId !== e.pointerId) return
    active.current = null
    setHint(null)
    if (a.mode === 'rotate' && a.id === 'ruler') {
      const dock = findDock(nb.tools, nb.tools.ruler.x, nb.tools.ruler.y)
      if (dock) setInst('ruler', { ...dockedPose(nb.tools, dock), dock })
    }
    if (a.mode === 'move' || a.mode === 'rotate' || a.mode === 'radius') return
    if (a.mode === 'erase') {
      if (nb.pages[nb.current] !== a.before) remember(nb.current, a.before)
      return
    }
    if (drawing) {
      remember(nb.current, a.before)
      setPage(nb.current, [...a.before, drawing])
    }
    setDrawing(null)
  }

  const exportAs = async (kind: 'pdf' | 'docx' | 'png') => {
    const { width, height } = svgRef.current!.getBoundingClientRect()
    const pages = kind === 'png' ? [nb.current] : nb.pages.map((_, i) => i).filter((i) => nb.pages[i].length)
    setBusy(true)
    try {
      const pictures = []
      for (const i of pages) pictures.push(await pagePicture(nb.pages[i], nb.paper, width, height, `Pagina ${i + 1}`))
      const name = `caiet-${today()}`
      if (kind === 'png') await saveFile(`${name}-pagina-${nb.current + 1}.png`, pictures[0].blob)
      else if (kind === 'pdf') await savePdf(pictures, name + '.pdf')
      else await saveDocx(pictures, name + '.docx', `Caiet – ${new Date().toLocaleDateString('ro-RO')}`)
    } catch (err) {
      await ask('Exportul nu a reușit: ' + (err as Error).message, '', true)
    } finally {
      setBusy(false)
    }
  }

  const empty = nb.pages.every((p) => !p.length)

  return (
    <div className="page notebook-page">
      <div className="page-head">
        <div>
          <h1>Caiet</h1>
          <div className="muted">Scrie liber cu mouse-ul, cu creionul tabletei sau cu degetul. Shift ținut apăsat = linie dreaptă.</div>
        </div>
        <div className="actions">
          <span className="muted">{busy ? 'Se exportă…' : 'Exportă:'}</span>
          <button className="btn" onClick={() => exportAs('pdf')} disabled={empty || busy} title="Toate paginile scrise, câte una pe o foaie A4">📄 PDF</button>
          <button className="btn" onClick={() => exportAs('docx')} disabled={empty || busy} title="Document Word cu toate paginile scrise">📝 Word</button>
          <button className="btn" onClick={() => exportAs('png')} disabled={!strokes.length || busy} title="Pagina curentă ca imagine PNG">🖼️ Imagine</button>
        </div>
      </div>

      <div className="notebook">
        <div className="board-toolbar notebook-toolbar">
          <div className="seg">
            <button className={tool === 'pen' ? 'active' : ''} onClick={() => setTool('pen')} title="Pix (P)">✒️ Pix</button>
            <button className={tool === 'marker' ? 'active' : ''} onClick={() => setTool('marker')} title="Evidențiator (M)">🖍️ Evidențiator</button>
            <button className={tool === 'eraser' ? 'active' : ''} onClick={() => setTool('eraser')} title="Radieră (E): șterge trăsăturile atinse">🧽 Radieră</button>
          </div>
          {tool !== 'eraser' && (
            <div className="swatches">
              {COLORS[tool].map((c) => (
                <button
                  key={c.value}
                  className={'swatch' + (colors[tool] === c.value ? ' active' : '')}
                  style={{ background: c.value }}
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => setColors({ ...colors, [tool]: c.value })}
                />
              ))}
            </div>
          )}
          <div className="seg">
            {SIZE_LABELS.map((l, i) => (
              <button key={l} className={sizeIdx[tool] === i ? 'active' : ''} onClick={() => setSizeIdx({ ...sizeIdx, [tool]: i })}>{l}</button>
            ))}
          </div>
          <span className="toolbar-sep" />
          <button className="btn small" onClick={undo} disabled={!past.length} title="Anulează (Ctrl+Z)">↶ Anulează</button>
          <button className="btn small" onClick={redo} disabled={!future.length} title="Refă (Ctrl+Y)">↷ Refă</button>
          <button className="btn small" onClick={clearPage} disabled={!strokes.length} title="Șterge tot de pe pagina curentă (se poate anula)">🧹 Golește pagina</button>
          <button className="btn small danger" onClick={clearAll} disabled={empty && nb.pages.length === 1} title="Șterge toate paginile caietului">Golește tot caietul</button>
          <span className="toolbar-sep" />
          <select value={nb.paper} onChange={(e) => setNb({ ...nb, paper: e.target.value as Paper })} title="Tipul foii">
            {PAPERS.map((p) => <option key={p.id} value={p.id}>Foaie: {p.label}</option>)}
          </select>
          <span className="notebook-pages">
            <button className="btn small" disabled={nb.current === 0} onClick={() => setNb({ ...nb, current: nb.current - 1 })} title="Pagina anterioară">◀</button>
            <span>Pagina {nb.current + 1} / {nb.pages.length}</span>
            <button className="btn small" disabled={nb.current === nb.pages.length - 1} onClick={() => setNb({ ...nb, current: nb.current + 1 })} title="Pagina următoare">▶</button>
            <button className="btn small" onClick={addPage}>+ Pagină</button>
            <button className="btn small danger" onClick={deletePage} title="Șterge pagina">🗑</button>
          </span>
        </div>

        <div className="board-toolbar notebook-toolbar instruments-bar">
          <span className="muted">Instrumente:</span>
          <button className={'btn small' + (nb.tools.ruler.visible ? ' active' : '')} onClick={() => toggleInst('ruler')}>📏 Riglă</button>
          <button className={'btn small' + (nb.tools.square.visible ? ' active' : '')} onClick={() => toggleInst('square')}>📐 Echer</button>
          {nb.tools.square.visible && (
            <select value={nb.tools.square.shape} onChange={(e) => setInst('square', { shape: e.target.value as '45' | '60' })} title="Tipul echerului">
              <option value="45">45° – 45°</option>
              <option value="60">30° – 60°</option>
            </select>
          )}
          <button className={'btn small' + (nb.tools.protractor.visible ? ' active' : '')} onClick={() => toggleInst('protractor')}>◠ Raportor</button>
          {nb.tools.protractor.visible && (
            <span className="angle-input" title="Desenează din centrul raportorului un unghi de exact atâtea grade, minute și secunde">
              <input type="number" min={0} max={360} value={angle.d} onChange={(e) => setAngle({ ...angle, d: e.target.value })} aria-label="grade" />°
              <input type="number" min={0} max={59} value={angle.m} onChange={(e) => setAngle({ ...angle, m: e.target.value })} aria-label="minute" placeholder="0" />′
              <input type="number" min={0} max={59} value={angle.s} onChange={(e) => setAngle({ ...angle, s: e.target.value })} aria-label="secunde" placeholder="0" />″
              <button className="btn small" onClick={drawAngle}>Desenează unghiul</button>
            </span>
          )}
          <button className={'btn small' + (nb.tools.compass.visible ? ' active' : '')} onClick={() => toggleInst('compass')}>🧭 Compas</button>
          {nb.tools.compass.visible && (
            <span className="angle-input" title="Deschiderea compasului">
              r =
              <input
                type="number" min={0.2} max={COMPASS_MAX_R / PX_PER_CM} step={0.1} aria-label="raza în cm"
                value={round(nb.tools.compass.r / PX_PER_CM)}
                onChange={(e) => {
                  const cm = Number(e.target.value)
                  if (cm > 0) setInst('compass', { r: Math.min(COMPASS_MAX_R, cm * PX_PER_CM) })
                }}
              />
              cm
              <button className="btn small" onClick={drawCircle}>◯ Cerc complet</button>
            </span>
          )}
          {(nb.tools.ruler.visible || nb.tools.square.visible || nb.tools.protractor.visible || nb.tools.compass.visible) && (
            <span className="muted instruments-help">
              Trage de instrument ca să-l muți, de ↻ ca să-l rotești. Scrie lângă o margine = linie dreaptă
              {nb.tools.ruler.visible && nb.tools.square.visible && '; apropie un capăt mic al riglei de o latură a echerului și se lipește perpendicular: glisează rigla pe latură și liniile trase pe ea sunt paralele, trage-o mai departe ca s-o desprinzi'}
              {nb.tools.protractor.visible && '; din centrul raportorului = rază la unghiul afișat'}
              {nb.tools.compass.visible && '; compasul: trage de ⟷ ca să-l deschizi, apoi ține de mânerul de sus (mov) și rotește-l ca să desenezi arcul'}.
            </span>
          )}
        </div>

        <svg
          ref={svgRef}
          className={'notebook-sheet tool-' + tool + (hover ? ' over-' + hover : '')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => setCursor(null)}
        >
          <PaperBackground paper={nb.paper} />
          {strokes.map((s) => <StrokePath key={s.id} s={s} />)}
          <InstrumentsLayer tools={nb.tools} bounds={bounds} />
          {drawing && <StrokePath s={drawing} />}
          {hint && <text className="nb-hint" x={hint.x} y={hint.y}>{hint.text}</text>}
          {tool === 'eraser' && cursor && (
            <circle className="eraser-cursor" cx={cursor.x} cy={cursor.y} r={size} fill="rgba(255,255,255,.6)" stroke="#6b7280" strokeDasharray="3 3" />
          )}
        </svg>
      </div>
      {dialog}
    </div>
  )
}
