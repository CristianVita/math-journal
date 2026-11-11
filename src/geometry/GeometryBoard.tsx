import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import { compile, type EvalFunction } from 'mathjs'
import type { AngleObj, ArcObj, CircleObj, FunctionObj, GObj, LineAngleObj, LineObj, PathObj, PointObj, PolygonObj, Scene, TextObj } from './types'
import { emptyScene, isLinear } from './types'
import {
  type Resolved,
  type ResolvedLine,
  type Vec,
  add,
  angleAt,
  angleCCW,
  cascade,
  hiddenOnSolid,
  labelDirection,
  dependsOn,
  dist,
  distToLine,
  projectParam,
  figureWithContents,
  solidGaps,
  withoutGaps,
  dot,
  dot3,
  len,
  isSkew,
  len3,
  line3,
  minus3,
  planesThrough,
  pos3,
  solidScale,
  trueAngleAt,
  trueLength,
  trueLineAngle,
  type Line3,
  type V3,
  formatNum,
  intersectLines,
  mul,
  arcBounds,
  arcEnd,
  arcWholeDegrees,
  centerLabel,
  onArc,
  nextLabel,
  norm,
  resolve,
  rotate,
  sub,
  uid,
} from './engine'
import { usePrompt } from '../components/PromptDialog'
import { SolidIcon, ToolIcon } from '../components/ToolIcon'
import { defaultView, frameIn, setSolidCut, setSolidView, solidLines, solidObjects, SOLIDS, type SolidId } from '../notebook/solids'
import { saveFile } from '../platform'
import { createPortal } from 'react-dom'
import { type Triangle, solveTriangle, triangleExtras, triangleVertices } from '../trig/trigMath'
import { defaultInstruments, InstrumentsLayer, PX_PER_CM, type Instruments } from '../notebook/instruments'
import { InstrumentsBar, useInstruments } from '../notebook/useInstruments'
import { readLocal, writeLocal } from '../db'

const TOOLS_KEY = 'math-journal:board-instruments'

function loadInstruments(): Instruments {
  try {
    const raw = readLocal(TOOLS_KEY)
    if (raw) return { ...defaultInstruments(), ...JSON.parse(raw) }
  } catch {
    /* storage unavailable: start with them put away */
  }
  return defaultInstruments()
}

/**
 * "3, 4" / "3 4" / "3; 4" → [3, 4]. A comma with no space is a decimal comma ("2,5") unless that
 * leaves too few numbers ("3,4" when two are expected).
 */
export function parseNumbers(src: string, count: number): number[] {
  let parts = src.replace(/,\s+/g, ' ').split(/[;\s]+/).filter(Boolean)
  if (parts.length < count) parts = parts.flatMap((p) => p.split(','))
  return parts.map((p) => Number(p.replace(',', '.')))
}

const NUMBER_FORMAT = 'Desparte numerele prin virgulă și spațiu; zecimalele merg cu virgulă sau punct: 2,5, 3.'

const TRIANGLE_KINDS: Record<string, string> = {
  right: 'dreptunghic', acute: 'ascuțitunghic', obtuse: 'obtuzunghic', equi: 'echilateral', iso: 'isoscel',
}

/** Side lengths from the dialog → a solved triangle, or a message explaining what is wrong. */
export function triangleFromInput(kind: string, values: string[]): Triangle | string {
  const need: Record<string, [number, number]> = { right: [1, 2], acute: [2, 3], obtuse: [3, 3], equi: [4, 1], iso: [5, 2] }
  const [field, count] = need[kind]
  const n = parseNumbers(values[field], count)
  if (n.length !== count || n.some((x) => !(x > 0))) return `Scrie ${count === 1 ? 'un număr pozitiv' : `${count} numere pozitive`}. ${NUMBER_FORMAT}`
  if (kind === 'acute' || kind === 'obtuse' || kind === 'iso') {
    const [x, y, z] = (kind === 'iso' ? [n[0], n[1], n[1]] : [...n]).sort((p, q) => p - q)
    if (z >= x + y) {
      return kind === 'iso'
        ? `Cu baza ${n[0]} și laturile egale ${n[1]} nu se poate forma un triunghi: baza trebuie să fie mai mică decât dublul laturii egale, adică decât ${2 * n[1]}.`
        : `Cu laturile ${n.join(', ')} nu se poate forma un triunghi: latura cea mai mare (${z}) trebuie să fie mai mică decât suma celorlalte două (${x} + ${y}).`
    }
  }
  const input =
    kind === 'right' ? { b: n[0], c: n[1], A: 90 }
    : kind === 'equi' ? { a: n[0], b: n[0], c: n[0] }
    : kind === 'iso' ? { a: n[1], b: n[1], c: n[0] } // base AB horizontal, equal sides from C
    : { a: n[0], b: n[1], c: n[2] }
  const res = solveTriangle(input)
  if (!res.solutions.length) return res.error ?? 'Cu aceste lungimi nu se poate forma un triunghi.'
  const t = res.solutions[0]
  if (kind === 'acute' || kind === 'obtuse') {
    const actual = triangleExtras(t).type
    if (actual !== TRIANGLE_KINDS[kind]) {
      const [x, y, z] = [...n].sort((p, q) => p - q)
      const rule = kind === 'acute' ? `${z}² < ${x}² + ${y}²` : `${z}² > ${x}² + ${y}²`
      return `Laturile ${n.join(', ')} formează un triunghi ${actual}, nu ${TRIANGLE_KINDS[kind]}. Pentru ${TRIANGLE_KINDS[kind]} trebuie ca latura cea mai mare să respecte ${rule}.`
    }
  }
  return t
}

type Tool =
  | 'move' | 'pan' | 'point' | 'segment' | 'line' | 'ray' | 'circle' | 'arc' | 'sector' | 'triangle' | 'polygon' | 'regular'
  | 'lineAngle' | 'construct' | 'midpoint' | 'perpendicular' | 'mediatrix' | 'parallel' | 'bisector'
  | 'intersection' | 'text' | 'pen' | 'delete' | 'solid'

const TOOLS: { id: Tool; label: string; hint: string[] }[] = [
  { id: 'move', label: 'Cursor', hint: ['Selectează și trage puncte sau figuri; trage fundalul pentru a muta tabla; rotița = zoom'] },
  { id: 'pan', label: 'Mută tabla', hint: ['Trage oriunde pentru a te deplasa în sistemul xOy; rotița = zoom'] },
  { id: 'point', label: 'Punct', hint: ['Click pentru a plasa un punct'] },
  { id: 'segment', label: 'Segment', hint: ['Primul capăt', 'Al doilea capăt'] },
  { id: 'line', label: 'Dreaptă', hint: ['Primul punct al dreptei', 'Al doilea punct'] },
  { id: 'ray', label: 'Semidreaptă', hint: ['Originea', 'Un punct pe semidreaptă'] },
  { id: 'circle', label: 'Cerc', hint: ['Centrul', 'Un punct de pe cerc'] },
  { id: 'arc', label: 'Arc de cerc', hint: ['Centrul', 'Începutul arcului', 'Sfârșitul arcului (merge în sens trigonometric)'] },
  { id: 'sector', label: 'Sector de cerc', hint: ['Centrul', 'Începutul arcului', 'Sfârșitul arcului (merge în sens trigonometric)'] },
  { id: 'polygon', label: 'Poligon', hint: ['Vârfurile pe rând; click pe primul vârf pentru a închide'] },
  { id: 'regular', label: 'Poligon regulat', hint: ['Primul vârf', 'Al doilea vârf (apoi alegi nr. de laturi)'] },
  { id: 'triangle', label: 'Triunghi (dreptunghic, ascuțitunghic, obtuzunghic…)', hint: ['Click unde vrei primul vârf, apoi alegi tipul și dimensiunile'] },
  { id: 'lineAngle', label: 'Unghi între două linii', hint: ['Click pe prima linie sau muchie de corp (pe porțiunea care formează unghiul)', 'Click pe a doua linie sau muchie'] },
  { id: 'construct', label: 'Construiește unghi', hint: ['Primul punct, pe o latură', 'Al doilea punct: vârful unghiului', 'Al treilea punct, pe cealaltă latură (apoi poți scrie măsura exactă)'] },
  { id: 'midpoint', label: 'Mijloc', hint: ['Click pe un segment, o muchie de corp sau pe primul punct', 'Al doilea punct'] },
  { id: 'perpendicular', label: 'Perpendiculară', hint: ['Click pe punct (sau pe un loc liber, pentru un punct nou), apoi pe dreaptă; merge și invers', 'Acum al doilea element (dreapta sau punctul)'] },
  { id: 'mediatrix', label: 'Mediatoare', hint: ['Click pe segmentul, latura de poligon sau muchia de corp căreia vrei să-i construiești mediatoarea'] },
  { id: 'parallel', label: 'Paralelă', hint: ['Click pe punct (sau pe un loc liber, pentru un punct nou), apoi pe dreaptă; merge și invers', 'Acum al doilea element (dreapta sau punctul)'] },
  { id: 'bisector', label: 'Bisectoare', hint: ['Click pe arcul unghiului, sau pe prima latură (ori pe 3 puncte: latură, vârf, latură)', 'Acum a doua latură (sau vârful, dacă ai început cu un punct)', 'Un punct de pe a doua latură'] },
  { id: 'intersection', label: 'Intersecție', hint: ['Prima linie: dreaptă, segment, latură de poligon sau muchie de corp', 'A doua linie'] },
  { id: 'text', label: 'Text / formulă', hint: ['Click unde vrei textul (LaTeX între $...$)'] },
  { id: 'pen', label: 'Desen liber', hint: ['Desenează liber cu mouse-ul sau stylus-ul'] },
  { id: 'delete', label: 'Șterge', hint: ['Click pe obiectul de șters (se șterge și ce depinde de el)'] },
  { id: 'solid', label: 'Corp geometric', hint: ['Trage cu mouse-ul de la un colț la cel opus'] },
]

/** Tools whose clicks place points (they get the snapping preview). */
const POINT_TOOLS = new Set<string>(['point', 'segment', 'line', 'ray', 'circle', 'arc', 'sector', 'polygon', 'regular', 'construct', 'midpoint'])

/** How close to a line a click counts, once the point of a perpendicular or a parallel is chosen. */
const PICK_LINE_PX = 18

const COLORS = ['#1f2937', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#db2777']

interface Props {
  scene: Scene
  onChange: (s: Scene) => void
  height?: number | string
  readOnly?: boolean // thumbnail mode: no toolbar, no interaction, view fitted to the figure
  instruments?: boolean // offer the ruler, set square, protractor and compass
  /** the board as a transparent layer on a notebook page, which owns the undo history and does not pan or zoom */
  sheet?: {
    /** where the tools go; null: only the figure is wanted (export) */
    toolbar: HTMLElement | null
    /** it has the pointer; otherwise the page under it does */
    active: boolean
    page: number
    onActivate: () => void
    onRemember: (before: Scene) => void
    /** how much larger the page is shown: the pointer comes in screen pixels */
    zoom?: number
    /** whether there is ink on the page next to this point of the sheet (pixels): the edges of the solids drawn as ink */
    inkNear?: (x: number, y: number) => boolean
  }
}

/** On a notebook page the plane does not move: where its origin is on the sheet, in pixels. */
export const SHEET_ORIGIN = { x: 400, y: 300 }

/** Positions (and fixed lengths) of a figure when a scale / rotate gesture starts. */
type XformBase = {
  pts: Map<string, Vec>
  paths: Map<string, [number, number][]>
  dists: Map<string, number>
  /** points glued to a circle or arc, with its center: where they are stays right when the figure turns */
  glued: Map<string, { p: Vec; c: Vec }>
}

// `at`: where on the line the user clicked (the angle-between-lines tool uses it to pick a side)
/** `side`: the segment of a side or an edge picked while the construction is not done yet; it joins the board only when it is. */
type Pick = { kind: 'point' | 'line'; id: string; at?: Vec; side?: LineObj }

export default function GeometryBoard({ scene, onChange, height = 560, readOnly = false, instruments = false, sheet }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 800, h: 500 })
  const [tool, setTool] = useState<Tool>('move')
  const [color, setColor] = useState(COLORS[0])
  const [pending, setPending] = useState<Pick[]>([])
  const [solid, setSolid] = useState<SolidId>('cube')
  const [solidDrag, setSolidDrag] = useState<{ from: Vec; to: Vec } | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [mouse, setMouse] = useState<Vec | null>(null)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [panning, setPanning] = useState(false)

  // hold Space to drag the plane, whatever tool is active (like in drawing programs)
  useEffect(() => {
    if (readOnly || sheet) return
    const typing = (e: KeyboardEvent) => ['INPUT', 'TEXTAREA', 'SELECT', 'MATH-FIELD'].includes((e.target as HTMLElement).tagName)
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !typing(e)) {
        e.preventDefault() // no page scroll
        setSpaceHeld(true)
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [readOnly, !sheet])
  const [past, setPast] = useState<Scene[]>([])
  const [future, setFuture] = useState<Scene[]>([])
  const { ask, askForm, dialog } = usePrompt()

  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const drag = useRef<
    | { mode: 'pan'; start: Vec; view: Scene['view'] }
    | { mode: 'move'; ids: string[]; start: Vec; orig: Map<string, Vec>; moved: boolean }
    | { mode: 'pen'; id: string }
    | { mode: 'solid' }
    | { mode: 'slide'; id: string; moved: boolean }
    | { mode: 'xform'; kind: 'scale' | 'rotate'; pivot: Vec; start: Vec; base: XformBase; moved: boolean }
    | { mode: 'orbit'; holder: string; start: Vec; yaw: number; pitch: number; moved: boolean }
    | { mode: 'inst' }
    | null
  >(null)
  const [xformLabel, setXformLabel] = useState<string | null>(null)
  // where a perpendicular or a parallel half chosen would go
  const [throughGhost, setThroughGhost] = useState<{ from: Vec; foot: Vec; a: Vec; b: Vec; along: number; shown: [Vec, Vec] | null } | null>(null)
  const [hoverHandle, setHoverHandle] = useState<'scale' | 'rotate' | 'orbit' | null>(null)
  // where the next point would land (shown before the click)
  // deg: how long the arc being drawn is, shown next to the pointer
  const [ghost, setGhost] = useState<{ pos: Vec; existing?: string; on?: string[]; deg?: number } | null>(null)
  // a short message in the status bar (e.g. "click on a line") instead of silently doing nothing
  const [flashMsg, setFlashMsg] = useState<string | null>(null)
  const flashTimer = useRef<number>()
  const flash = (msg: string) => {
    setFlashMsg(msg)
    clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlashMsg(null), 2500)
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const resolved = useMemo(() => resolve(scene), [scene])
  const onSheet = !!sheet
  const view = useMemo(() => {
    if (readOnly) return fitView(scene, resolved.points, size)
    if (!onSheet) return scene.view
    return { ...scene.view, scale: PX_PER_CM, cx: (size.w / 2 - SHEET_ORIGIN.x) / PX_PER_CM, cy: (SHEET_ORIGIN.y - size.h / 2) / PX_PER_CM }
  }, [readOnly, onSheet, scene, resolved, size])
  // half of each break in a line of a solid, a few pixels whatever the zoom
  const inkNear = sheet?.inkNear
  const gaps = useMemo(() => solidGaps(scene, resolved, 5 / view.scale, inkNear && ((at) => inkNear(SHEET_ORIGIN.x + at.x * PX_PER_CM, SHEET_ORIGIN.y - at.y * PX_PER_CM))), [scene, resolved, view.scale, inkNear])
  // segments on a solid that it hides: inside it, or on a face turned away; they are drawn dashed, also after a turn
  const outOfSight = useMemo(() => {
    const out = new Map<string, boolean>()
    for (const o of scene.objects) {
      if (o.type !== 'segment' || o.ghost) continue
      const h = hiddenOnSolid(scene.objects, resolved, o.id)
      if (h !== null) out.set(o.id, h)
    }
    return out
  }, [scene, resolved])
  const P = (id: string) => resolved.points.get(id) ?? null
  const L = (id: string) => resolved.lines.get(id) ?? null
  /** Vertex and one point on each side for the angle between two lines (null if they are parallel). */
  const lineAngleGeo = (o: LineAngleObj) => {
    const l1 = L(o.l1)
    const l2 = L(o.l2)
    const v = l1 && l2 ? intersectLines(l1, l2) : null
    if (!l1 || !l2 || !v) return null
    return { v, a: add(v, mul(norm(l1.d), o.s1)), b: add(v, mul(norm(l2.d), o.s2)) }
  }

  // ---------- the selected figure: move it, scale it, rotate it ----------
  const selObj = selected ? scene.objects.find((o) => o.id === selected) : undefined
  const figure = useMemo(() => {
    if (!selObj || selObj.type === 'point' || selObj.type === 'function') return null
    const ids = figureWithContents(scene, resolved.points, selObj.id)
    const objs = scene.objects.filter((o) => ids.has(o.id))
    // a transformation moves the free points (everything else is built on them), freehand paths and texts
    const movable = new Set(
      objs.filter((o) => (o.type === 'point' && o.dep.kind === 'free' && !o.locked) || o.type === 'path' || o.type === 'text').map((o) => o.id),
    )
    if (!movable.size) return null
    const pts: Vec[] = []
    for (const o of objs) {
      if (o.type === 'point') {
        const p = resolved.points.get(o.id)
        if (p) pts.push(p)
      } else if (o.type === 'path') {
        if (!o.frame) o.points.forEach(([x, y]) => pts.push({ x, y }))
      } else if (o.type === 'text') pts.push({ x: o.x, y: o.y })
      else if (o.type === 'circle') {
        const c = resolved.points.get(o.center)
        const t = resolved.points.get(o.through)
        if (c && t) {
          const r = dist(c, t)
          pts.push({ x: c.x - r, y: c.y - r }, { x: c.x + r, y: c.y + r })
        }
      } else if (o.type === 'arc') {
        const c = resolved.points.get(o.center)
        const t = resolved.points.get(o.through)
        const to = resolved.points.get(o.to)
        if (c && t && to) pts.push(...arcBounds(c, t, to))
      }
    }
    if (!pts.length) return null
    const vertices = objs.filter((o): o is PointObj => o.type === 'point' && !o.hidden && !!resolved.points.get(o.id))
    const avg = (list: Vec[]) => mul(list.reduce((s, p) => add(s, p), { x: 0, y: 0 }), 1 / list.length)
    const centroid = avg(vertices.length ? vertices.map((o) => resolved.points.get(o.id)!) : pts)
    return { ids, movable, pts, vertices, centroid, holder: frameIn(objs, ids) }
  }, [scene, selObj, resolved])
  const [pivotId, setPivotId] = useState('center')
  useEffect(() => setPivotId('center'), [selected])
  const pivot = figure ? (pivotId !== 'center' && resolved.points.get(pivotId)) || figure.centroid : null

  const xformBase = (movable: Set<string>, ids: Set<string>): XformBase => {
    const base: XformBase = { pts: new Map(), paths: new Map(), dists: new Map(), glued: new Map() }
    for (const o of sceneRef.current.objects) {
      if (movable.has(o.id) && (o.type === 'point' || o.type === 'text')) base.pts.set(o.id, { x: o.x, y: o.y })
      if (movable.has(o.id) && o.type === 'path') base.paths.set(o.id, o.points)
      // sides of a fixed length (constructed angle, bisector) must grow with the figure
      if (ids.has(o.id) && o.type === 'point' && (o.dep.kind === 'polar' || o.dep.kind === 'bisectorPoint' || o.dep.kind === 'along')) base.dists.set(o.id, o.dep.dist)
      if (ids.has(o.id) && o.type === 'point' && o.dep.kind === 'onCircle') {
        const { circle } = o.dep
        const on = sceneRef.current.objects.find((x) => x.id === circle)
        const c = on?.type === 'circle' || on?.type === 'arc' ? P(on.center) : null
        const p = P(o.id)
        if (c && p) base.glued.set(o.id, { p, c })
      }
    }
    return base
  }
  /** Objects with every movable part of the figure sent through f; k scales the fixed lengths. */
  const applyXform = (base: XformBase, f: (p: Vec) => Vec, k: number): GObj[] =>
    sceneRef.current.objects.map((o) => {
      if ((o.type === 'point' || o.type === 'text') && base.pts.has(o.id)) {
        const p = f(base.pts.get(o.id)!)
        return { ...o, x: p.x, y: p.y }
      }
      if (o.type === 'path' && base.paths.has(o.id))
        return { ...o, points: base.paths.get(o.id)!.map(([x, y]) => { const p = f({ x, y }); return [p.x, p.y] as [number, number] }) }
      if (o.type === 'point' && base.dists.has(o.id) && (o.dep.kind === 'polar' || o.dep.kind === 'bisectorPoint' || o.dep.kind === 'along'))
        return { ...o, dep: { ...o.dep, dist: base.dists.get(o.id)! * k } }
      if (o.type === 'point' && o.dep.kind === 'onCircle' && base.glued.has(o.id)) {
        const { p, c } = base.glued.get(o.id)!
        const a = sub(f(p), f(c))
        return { ...o, dep: { ...o.dep, angle: Math.atan2(a.y, a.x) } }
      }
      return o
    })
  const rotateFigure = (deg: number) => {
    if (!figure || !pivot) return
    const a = (deg * Math.PI) / 180
    commit(applyXform(xformBase(figure.movable, figure.ids), (p) => rotate(p, pivot, a), 1))
  }
  /** Turns the selected solid in space. A curved body can end up with fewer edges: the selection moves to one that is left. */
  const orbitSolid = (holder: string, yaw: number, pitch: number) => {
    const objects = setSolidView(sceneRef.current.objects, holder, yaw, pitch)
    const next = { ...sceneRef.current, objects }
    sceneRef.current = next
    onChange(next)
    if (selected && !objects.some((o) => o.id === selected)) {
      const group = objects.find((o) => o.id === holder)
      setSelected(objects.find((o) => o.type === 'path' && !o.frame && group?.type === 'path' && o.group === group.group)?.id ?? null)
    }
  }
  /** Cuts the selected solid with a plane parallel to its base, moves the plane, or takes it away (null). */
  const cutSolid = (holder: string, cut: number | null) => {
    const objects = setSolidCut(sceneRef.current.objects, holder, cut)
    const next = { ...sceneRef.current, objects }
    sceneRef.current = next
    onChange(next)
    if (selected && !objects.some((o) => o.id === selected)) {
      const group = objects.find((o) => o.id === holder)
      setSelected(objects.find((o) => o.type === 'path' && !o.frame && group?.type === 'path' && o.group === group.group)?.id ?? null)
    }
  }
  const scaleFigure = (k: number) => {
    if (!figure || !pivot || !(k > 0)) return
    commit(applyXform(xformBase(figure.movable, figure.ids), (p) => add(pivot, mul(sub(p, pivot), k)), k))
  }

  /** Screen-space box around the selected figure, with its handles. */
  const selectionBox = () => {
    if (!figure) return null
    const s = figure.pts.map(toScreen)
    const pad = 12
    const x0 = Math.min(...s.map((p) => p.x)) - pad
    const x1 = Math.max(...s.map((p) => p.x)) + pad
    const y0 = Math.min(...s.map((p) => p.y)) - pad
    const y1 = Math.max(...s.map((p) => p.y)) + pad
    return { x0, x1, y0, y1, corners: [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }], rot: { x: (x0 + x1) / 2, y: y0 - 30 }, orbit: { x: (x0 + x1) / 2, y: y1 + 30 } }
  }
  const handleAt = (s: Vec): 'scale' | 'rotate' | 'orbit' | null => {
    const box = selectionBox()
    if (!box) return null
    if (figure?.holder && dist(s, box.orbit) <= 12) return 'orbit'
    if (dist(s, box.rot) <= 11) return 'rotate'
    if (box.corners.some((c) => Math.abs(c.x - s.x) <= 8 && Math.abs(c.y - s.y) <= 8)) return 'scale'
    return null
  }

  const toScreen = useCallback(
    (p: Vec): Vec => ({ x: size.w / 2 + (p.x - view.cx) * view.scale, y: size.h / 2 - (p.y - view.cy) * view.scale }),
    [size, view],
  )
  const toWorld = useCallback(
    (s: Vec): Vec => ({ x: view.cx + (s.x - size.w / 2) / view.scale, y: view.cy - (s.y - size.h / 2) / view.scale }),
    [size, view],
  )
  const snap = (w: Vec): Vec => {
    if (!view.snap) return w
    const step = view.scale >= 30 ? 0.5 : 1
    return { x: Math.round(w.x / step) * step, y: Math.round(w.y / step) * step }
  }

  // ---------- instruments ----------
  // They lie on the plane, so they pan and zoom with it and measure in its units: 1 cm on the ruler is 1 unit.
  // Their own coordinates are the plane's, at PX_PER_CM to the unit, with y pointing down like on a sheet.
  const instScale = view.scale / PX_PER_CM
  const toPlane = (s: Vec): [number, number] => [view.cx * PX_PER_CM + (s.x - size.w / 2) / instScale, -view.cy * PX_PER_CM + (s.y - size.h / 2) / instScale]
  const planeToWorld = ([x, y]: number[]): [number, number] => [x / PX_PER_CM, -y / PX_PER_CM]
  const [instTools, setInstTools] = useState<Instruments>(() => (instruments ? loadInstruments() : defaultInstruments()))
  useEffect(() => {
    if (instruments) writeLocal(TOOLS_KEY, JSON.stringify(instTools))
  }, [instruments, instTools])
  const [planeX, planeY] = toPlane({ x: 0, y: 0 })
  const instPath = useRef<string>()
  const instPathObj = ({ points, thin }: { points: number[][]; thin?: boolean }): PathObj =>
    ({ id: uid(), type: 'path', points: points.map(planeToWorld), color, width: thin ? 1.5 : 2.5 })
  /**
   * A straight line drawn along the ruler, the set square or the protractor becomes a real segment, for the tools
   * to build on; its ends are hidden points, as a ruler leaves no dots. Arcs stay drawings.
   */
  const asSegment = (p: PathObj): GObj[] => {
    const pts = p.points
    if (pts.length < 2) return [p]
    const [[ax, ay], [bx, by]] = [pts[0], pts[pts.length - 1]]
    const length = Math.hypot(bx - ax, by - ay)
    if (length < 1e-6 || !pts.every(([x, y]) => Math.abs((x - ax) * (by - ay) - (y - ay) * (bx - ax)) / length < 1e-6 * Math.max(1, length))) return [p]
    const end = (x: number, y: number): PointObj => ({ id: uid(), type: 'point', x, y, label: '', color: p.color, dep: { kind: 'free' }, hidden: true })
    const [a, b] = [end(ax, ay), end(bx, by)]
    return [a, b, { id: p.id, type: 'segment', dep: { kind: 'twoPoints', a: a.id, b: b.id }, color: p.color, width: p.width >= 2 ? 2 : p.width, showLength: false }]
  }
  const inst = useInstruments({
    tools: instTools,
    setTools: setInstTools,
    bounds: { x0: planeX, y0: planeY, w: size.w / instScale, h: size.h / instScale },
    onStrokeStart: (first) => {
      const p: PathObj = { id: uid(), type: 'path', points: [planeToWorld(first)], color, width: 2.5 }
      instPath.current = p.id
      commit([...sceneRef.current.objects, p])
    },
    onStrokeChange: (points) => {
      const world = points.map(planeToWorld)
      onChange({
        ...sceneRef.current,
        objects: sceneRef.current.objects.map((o) => (o.id === instPath.current && o.type === 'path' ? { ...o, points: world } : o)),
      })
    },
    onStrokes: (list) => commit([...sceneRef.current.objects, ...list.flatMap((s) => (s.thin ? [instPathObj(s)] : asSegment(instPathObj(s))))]),
    // drawing along an instrument is what the pen does
    onShown: () => changeTool('pen'),
    roams: true,
  })
  // with the other tools the clicks go through to the board, to place points under a ruler
  const instOn = instruments && !readOnly && !spaceHeld && (tool === 'pen' || tool === 'move')

  // ---------- history ----------
  // History updaters run later, during React's render, when sceneRef may already hold the new
  // scene: always capture the scene to remember *before* changing it.
  const remember = () => {
    const before = sceneRef.current
    if (sheet) return sheet.onRemember(before)
    setPast((p) => [...p.slice(-80), before])
    setFuture([])
  }
  const commit = (objects: GObj[], v = sceneRef.current.view) => {
    remember()
    const next = { objects, view: v }
    sceneRef.current = next
    onChange(next)
  }
  const setView = (v: Partial<Scene['view']>) => {
    const next = { ...sceneRef.current, view: { ...sceneRef.current.view, ...v } }
    sceneRef.current = next
    onChange(next)
  }
  const undo = () => {
    if (!past.length) return
    const current = sceneRef.current
    setFuture((f) => [current, ...f])
    const prev = { ...past[past.length - 1], view: current.view }
    setPast((p) => p.slice(0, -1))
    sceneRef.current = prev
    onChange(prev)
  }
  const redo = () => {
    if (!future.length) return
    const current = sceneRef.current
    setPast((p) => [...p, current])
    const [n, ...rest] = future
    setFuture(rest)
    const next = { ...n, view: current.view }
    sceneRef.current = next
    onChange(next)
  }

  // ---------- hit testing (screen pixels) ----------
  /** Object under screen point s; `lineTol` (px) is how close a click must be to a line. */
  const hitTest = (s: Vec, only?: (o: GObj) => boolean, lineTol = 6): GObj | null => {
    const w = toWorld(s)
    const objs = scene.objects.filter((o) => !only || only(o))
    let best: { o: GObj; d: number } | null = null
    const consider = (o: GObj, d: number, tol: number) => {
      if (d <= tol && (!best || d < best.d)) best = { o, d }
    }
    for (const o of objs) {
      if (o.type === 'point' && !o.hidden && (!o.quiet || tool === 'move')) {
        const p = P(o.id)
        if (p) consider(o, dist(toScreen(p), s) - 4, 8)
      }
    }
    if (best) return (best as { o: GObj }).o
    for (const o of objs) {
      if (isLinear(o)) {
        const l = L(o.id)
        if (l && !o.ghost) consider(o, distToLine(w, l) * view.scale, lineTol)
      } else if (o.type === 'circle') {
        const c = P(o.center)
        const t = P(o.through)
        if (c && t) consider(o, Math.abs(dist(c, w) - dist(c, t)) * view.scale, 6)
      } else if (o.type === 'arc') {
        const c = P(o.center)
        const t = P(o.through)
        const to = P(o.to)
        if (c && t && to && onArc(w, c, t, to)) {
          consider(o, Math.abs(dist(c, w) - dist(c, t)) * view.scale, 6)
          if (o.filled && dist(c, w) < dist(c, t)) consider(o, 5, 6)
        }
      } else if (o.type === 'text') {
        const p = toScreen(o)
        if (s.x >= p.x - 4 && s.x <= p.x + Math.max(40, o.text.length * o.size * 0.55) && s.y >= p.y - o.size - 4 && s.y <= p.y + 6)
          consider(o, 0, 1)
      } else if (o.type === 'angle' || o.type === 'lineAngle') {
        const v = o.type === 'angle' ? P(o.v) : lineAngleGeo(o)?.v
        if (v) consider(o, Math.abs(dist(toScreen(v), s) - 28), 8)
      } else if (o.type === 'path') {
        if (o.frame) continue
        for (const pt of o.points) consider(o, dist(toScreen({ x: pt[0], y: pt[1] }), s), 6)
      } else if (o.type === 'polygon') {
        const pts = o.points.map(P)
        if (pts.every(Boolean) && insidePolygon(w, pts as Vec[])) consider(o, 5, 6)
      } else if (o.type === 'function') {
        try {
          const f = compile(o.expr)
          const y = f.evaluate({ x: w.x })
          if (typeof y === 'number' && isFinite(y)) consider(o, Math.abs(y - w.y) * view.scale, 6)
        } catch {
          /* invalid expression: not hittable */
        }
      }
    }
    return best ? (best as { o: GObj }).o : null
  }

  // ---------- object factories ----------
  const newPoint = (objs: GObj[], w: Vec, dep: PointObj['dep'] = { kind: 'free' }): PointObj => {
    const p: PointObj = { id: uid(), type: 'point', x: w.x, y: w.y, label: nextLabel({ objects: objs, view }), color, dep }
    objs.push(p)
    return p
  }
  const newLine = (objs: GObj[], type: LineObj['type'], dep: LineObj['dep'], extra: Partial<LineObj> = {}) => {
    const l: LineObj = { id: uid(), type, dep, color, width: 2, showLength: false, ...extra }
    objs.push(l)
    return l
  }

  // ---------- where a new point goes: glued to what is under the cursor ----------
  type Target = { pos: Vec; dep: PointObj['dep']; existing?: string; on?: string[]; edge?: { a: string; b: string; t: number } }
  const SNAP_PX = 10

  /** The edge of a solid next to the cursor: its corners, how far along it, and how close it is (px). */
  const solidEdgeNear = (s: Vec) => {
    const w = toWorld(s)
    let best: { a: string; b: string; t: number; pos: Vec; d: number } | null = null
    for (const o of scene.objects) {
      if (o.type !== 'point' || !o.group || !o.joins) continue
      const pa = P(o.id)
      for (const other of o.joins) {
        if (other < o.corner!) continue
        const q = scene.objects.find((x) => x.type === 'point' && x.group === o.group && x.corner === other)
        const pb = q && P(q.id)
        if (!q || !pa || !pb) continue
        const l: ResolvedLine = { kind: 'segment', p: pa, d: sub(pb, pa), a: pa, b: pb }
        const d = distToLine(w, l) * view.scale
        if (d <= SNAP_PX && (!best || d < best.d)) {
          const t = projectParam(w, l)
          best = { a: o.id, b: q.id, t, pos: add(pa, mul(l.d, t)), d }
        }
      }
    }
    return best
  }

  /** A circle of a solid next to the cursor; drawn flat it is an ellipse, so the closest of many points is looked for. */
  const solidRimNear = (s: Vec): Target | null => {
    let best: Target | null = null
    let bestD = SNAP_PX
    for (const o of scene.objects) {
      if (o.type !== 'point' || !o.rim) continue
      const [a, b] = o.rim.map((c) => scene.objects.find((x) => x.type === 'point' && x.group === o.group && x.corner === c))
      const c0 = P(o.id)
      const pa = a && P(a.id)
      const pb = b && P(b.id)
      if (!a || !b || !c0 || !pa || !pb) continue
      for (let i = 0; i < 360; i++) {
        const [cos, sin] = [Math.cos((i * Math.PI) / 180), Math.sin((i * Math.PI) / 180)]
        const pos = add(c0, add(mul(sub(pa, c0), cos), mul(sub(pb, c0), sin)))
        const d = dist(toScreen(pos), s)
        if (d < bestD) {
          bestD = d
          best = { pos, dep: { kind: 'combo', parts: [[o.id, 1 - cos - sin], [a.id, cos], [b.id, sin]] } }
        }
      }
    }
    return best
  }

  /**
   * The outline of a sphere next to the cursor. It is not a line fixed on the body, but each of its points is a real
   * point of the sphere: worked out from the three axes as drawn, it stays at the radius, and turns with the sphere.
   */
  const sphereOutlineNear = (s: Vec): Target | null => {
    const w = toWorld(s)
    for (const o of scene.objects) {
      if (o.type !== 'point' || !o.ball) continue
      const center = P(o.id)
      const ends = o.ball.map((c) => scene.objects.find((x) => x.type === 'point' && x.group === o.group && x.corner === c))
      const seen = ends.map((e) => (e ? P(e.id) : null))
      if (!center || !seen.every(Boolean)) continue
      const axes = seen.map((p) => sub(p!, center))
      // seen in parallel projection, the axes satisfy: x² + y² + z² on the plane, in each direction, is the radius squared
      const radius = Math.sqrt(axes.reduce((t, a) => t + dot(a, a), 0) / 2)
      const out = sub(w, center)
      const from = len(out)
      // a click outside a sphere is hardly meant for the grid: this is more generous than for a line
      if (from < 1e-9 || Math.abs(from - radius) * view.scale > SNAP_PX * 1.6) continue
      const on = mul(out, radius / from)
      const k = axes.map((a) => dot(a, on) / (radius * radius))
      return {
        pos: add(center, on),
        dep: { kind: 'combo', parts: [[o.id, 1 - k[0] - k[1] - k[2]], ...ends.map((e, i): [string, number] => [e!.id, k[i]])] },
      }
    }
    return null
  }

  /** Existing point > intersection of two lines > on a line / edge of a solid / circle > grid. */
  const snapTarget = (s: Vec): Target => {
    const w = toWorld(s)
    const pt = hitTest(s, (o) => o.type === 'point')
    if (pt?.type === 'point') return { pos: P(pt.id) ?? w, dep: pt.dep, existing: pt.id }
    const near: { id: string; l: ResolvedLine; d: number }[] = []
    for (const o of scene.objects) {
      if (!isLinear(o) || o.ghost) continue
      const l = L(o.id)
      if (!l) continue
      const d = distToLine(w, l) * view.scale
      if (d <= SNAP_PX) near.push({ id: o.id, l, d })
    }
    near.sort((a, b) => a.d - b.d)
    // two lines next to the cursor: their intersection, if it is on both drawn parts and under the cursor
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const x = intersectLines(near[i].l, near[j].l)
        if (x && dist(toScreen(x), s) <= SNAP_PX + 4 && distToLine(x, near[i].l) < 1e-6 && distToLine(x, near[j].l) < 1e-6)
          return { pos: x, dep: { kind: 'intersection', l1: near[i].id, l2: near[j].id }, on: [near[i].id, near[j].id] }
      }
    }
    const edge = solidEdgeNear(s)
    if (near.length && (!edge || near[0].d <= edge.d)) {
      const { id, l } = near[0]
      const t = projectParam(w, l)
      return { pos: add(l.p, mul(l.d, t)), dep: { kind: 'onLine', line: id, t }, on: [id] }
    }
    // the line it will be glued to is made only when the point is placed
    if (edge) return { pos: edge.pos, dep: { kind: 'free' }, edge: { a: edge.a, b: edge.b, t: edge.t } }
    const rim = solidRimNear(s) ?? sphereOutlineNear(s)
    if (rim) return rim
    for (const o of scene.objects) {
      if (o.type !== 'circle' && o.type !== 'arc') continue
      const c = P(o.center)
      const th = P(o.through)
      if (!c || !th) continue
      if (o.type === 'arc') {
        const to = P(o.to)
        if (!to || !onArc(w, c, th, to)) continue
      }
      const r = dist(c, th)
      if (Math.abs(dist(c, w) - r) * view.scale <= SNAP_PX && dist(c, w) > 1e-9) {
        const angle = Math.atan2(w.y - c.y, w.x - c.x)
        return { pos: add(c, mul({ x: Math.cos(angle), y: Math.sin(angle) }, r)), dep: { kind: 'onCircle', circle: o.id, angle }, on: [o.id] }
      }
    }
    return { pos: snap(w), dep: { kind: 'free' } }
  }

  /** Where an arc from t around c ends for this pointer position: on its circle, in steps of one degree. */
  const arcEndAt = (s: Vec, c: Vec, t: Vec) => {
    const target = snapTarget(s)
    const at = target.existing ? P(target.existing) : null
    // pointing at an existing point is exact: it is the end if it is on the circle, otherwise it gives the direction
    const { pos, deg } = at
      ? { pos: arcEnd(c, t, at), deg: (angleCCW(t, c, at) * 180) / Math.PI }
      : arcWholeDegrees(c, t, toWorld(s))
    return {
      pos,
      deg,
      angle: Math.atan2(pos.y - c.y, pos.x - c.x),
      existing: at && Math.abs(dist(at, c) - dist(t, c)) < 1e-6 ? target.existing : undefined,
    }
  }

  // ---------- lines through a point: infinite, or a segment of a chosen length ----------
  type Extent = { mode: 'line' } | { mode: 'centered' | 'from'; length: number }

  const askExtent = async (title: string): Promise<Extent | null> => {
    const vals = await askForm(title, [
      {
        label: 'Cât de lungă',
        value: 'line',
        options: [
          { value: 'line', label: 'dreaptă (infinită)' },
          { value: 'centered', label: 'segment, cu punctul la mijloc' },
          { value: 'from', label: 'segment, pornind din punct' },
        ],
      },
      { label: 'Lungimea segmentului', value: '4', showIf: { field: 0, value: ['centered', 'from'] } },
    ])
    if (!vals) return null
    if (vals[0] === 'line') return { mode: 'line' }
    const length = Number(vals[1].replace(',', '.'))
    if (!(length > 0)) {
      await ask('Lungimea trebuie să fie un număr pozitiv.', '', true)
      return null
    }
    return { mode: vals[0] as 'centered' | 'from', length }
  }

  /** Parallel / perpendicular to `ref` through `through`; returns the id of the drawn line or segment. */
  const drawThrough = (objs: GObj[], kind: 'parallel' | 'perpendicular', through: string, ref: string, ext: Extent): string => {
    if (ext.mode === 'line') return newLine(objs, 'line', { kind, through, ref }, { dashed: true }).id
    const perp = kind === 'perpendicular'
    // the ends are construction points: hidden, and they follow the point and the line
    const end = (d: number) => {
      const p = newPoint(objs, { x: 0, y: 0 }, { kind: 'along', through, ref, perp, dist: d })
      p.hidden = true
      return p.id
    }
    const a = ext.mode === 'centered' ? end(-ext.length / 2) : through
    const b = end(ext.mode === 'centered' ? ext.length / 2 : ext.length)
    return newLine(objs, 'segment', { kind: 'twoPoints', a, b }, { dashed: true, showLength: true }).id
  }

  const rightMark = (objs: GObj[], l1: string, l2: string) =>
    objs.push({ id: uid(), type: 'lineAngle', l1, l2, s1: 1, s2: 1, color, showValue: false, rightMark: true } satisfies LineAngleObj)

  const segmentBetween = (objs: GObj[], a: string, b: string, extra: Partial<LineObj>): LineObj => {
    const same = objs.find((o): o is LineObj => o.type === 'segment' && o.dep.kind === 'twoPoints'
      && ((o.dep.a === a && o.dep.b === b) || (o.dep.a === b && o.dep.b === a)))
    return same ?? newLine(objs, 'segment', { kind: 'twoPoints', a, b }, extra)
  }

  /**
   * Polygons keep only their vertices and solids only their corners: the side or edge under the cursor becomes
   * a real segment, so that tools can build on it. An edge's segment is not drawn: the solid already shows the
   * edge, solid or dashed according to how it is seen.
   */
  const sideAt = (objs: GObj[], s: Vec, tolerance = 10): LineObj | null => {
    const side = sideNear(objs, s, tolerance)
    return side && segmentBetween(objs, side.a, side.b, side.extra)
  }

  /**
   * The line under the cursor, for a construction that needs more clicks: a side or an edge that has no segment
   * yet comes back as `side`, kept apart, so that nothing is left on the board if the construction is given up.
   */
  /**
   * Deletes `id` with everything built on it. A solid also takes what is drawn wholly inside it (as when it is
   * moved); the status bar says how much went with it, since Ctrl+Z is the way back.
   */
  const removeObj = (id: string) => {
    const now = sceneRef.current
    const gone = cascade(now, id)
    const self = now.objects.find((o) => o.id === id)
    const solid = (self?.type === 'path' || self?.type === 'point') && self.group
      && now.objects.some((o) => o.type === 'path' && o.group === self.group && o.depth)
    let inside = 0
    if (solid) {
      for (const c of figureWithContents(now, resolve(now).points, id)) {
        if (gone.has(c)) continue
        for (const g of cascade(now, c)) {
          if (gone.has(g)) continue
          gone.add(g)
          const o = now.objects.find((x) => x.id === g)
          // what the user would count: not the hidden helpers
          if (o && !(o.type === 'point' && o.hidden) && !(isLinear(o) && o.ghost)) inside++
        }
      }
    }
    commit(now.objects.filter((o) => !gone.has(o.id)))
    if (selected && gone.has(selected)) setSelected(null)
    if (inside) flash(`Am șters corpul și ${inside === 1 ? 'un obiect desenat' : `${inside} obiecte desenate`} în interiorul lui. Ctrl+Z le aduce înapoi.`)
  }

  const pickLine = (objs: GObj[], s: Vec, lineTol = 6, sideTol = 10): { id: string; side?: LineObj } | null => {
    const hit = hitTest(s, isLinear, lineTol)
    if (hit) return { id: hit.id }
    const kept = pending.flatMap((p) => (p.side ? [p.side] : []))
    const draft = [...objs, ...kept]
    const seg = sideAt(draft, s, sideTol)
    if (!seg) return null
    return draft.length > objs.length + kept.length || kept.includes(seg) ? { id: seg.id, side: seg } : { id: seg.id }
  }

  /** The construction is done: the sides picked for it join the board. */
  const addSides = (objs: GObj[], picks: Pick[]) => {
    for (const p of picks) if (p.side && !objs.some((o) => o.id === p.side!.id)) objs.push(p.side)
  }

  const sideNear = (objs: GObj[], s: Vec, tolerance: number) => {
    const w = toWorld(s)
    let best: { a: string; b: string; d: number; extra: Partial<LineObj> } | null = null
    const consider = (a: string, b: string, extra: Partial<LineObj>) => {
      const pa = P(a)
      const pb = P(b)
      if (!pa || !pb) return
      const d = distToLine(w, { kind: 'segment', p: pa, d: { x: pb.x - pa.x, y: pb.y - pa.y }, a: pa, b: pb }) * view.scale
      if (d <= tolerance && (!best || d < best.d)) best = { a, b, d, extra }
    }
    for (const o of objs) {
      if (o.type === 'polygon') {
        o.points.forEach((a, i) => consider(a, o.points[(i + 1) % o.points.length], { color: o.color, width: o.width, side: o.id }))
      } else if (o.type === 'point' && o.group && o.joins) {
        for (const other of o.joins) {
          if (other < o.corner!) continue
          const q = objs.find((x) => x.type === 'point' && x.group === o.group && x.corner === other)
          if (q) consider(o.id, q.id, { color: o.color, ghost: true })
        }
      }
    }
    return best as { a: string; b: string; d: number; extra: Partial<LineObj> } | null
  }

  /** How far along [a, b] the foot of the perpendicular from p falls: on the body, if all three are on one solid. */
  const footAlong = (objs: GObj[], res: Resolved, p: string | Vec, a: string, b: string): number | null => {
    if (typeof p === 'string') {
      const [q, u, v] = [p, a, b].map((id) => pos3(objs, res, id))
      if (q && u && v && q.group === u.group && v.group === u.group) {
        const d = minus3(v.at, u.at)
        return dot3(minus3(q.at, u.at), d) / dot3(d, d)
      }
    }
    const [at, u, v] = [typeof p === 'string' ? res.points.get(p) : p, res.points.get(a), res.points.get(b)]
    if (!at || !u || !v) return null
    const d = sub(v, u)
    return dot(sub(at, u), d) / dot(d, d)
  }

  /**
   * What ends a perpendicular from a point to a line: the right-angle mark, and, when the foot falls beyond
   * the ends of a segment, the dashed line that takes the segment there.
   */
  const finishFoot = (objs: GObj[], foot: string, seg: string, ln: string, t: number) => {
    const line = objs.find((o) => o.id === ln)
    const outside = t < -1e-9 || t > 1 + 1e-9
    if (outside && line?.type === 'segment' && line.dep.kind === 'twoPoints') {
      newLine(objs, 'segment', { kind: 'twoPoints', a: t < 0 ? line.dep.a : line.dep.b, b: foot }, { dashed: true })
    }
    // the mark goes towards the part of the line that is there
    objs.push({ id: uid(), type: 'lineAngle', l1: seg, l2: ln, s1: -1, s2: t > 1 - 1e-6 ? -1 : 1, color, showValue: false, rightMark: true } satisfies LineAngleObj)
  }

  /** While a perpendicular or a parallel is half chosen: the point, the line, and where the foot would be, for this pointer position. */
  const throughPreview = (s: Vec) => {
    const objs = scene.objects
    const point = pending.find((p) => p.kind === 'point')
    const chosen = pending.find((p) => p.kind === 'line')
    let from: Vec | null
    let t: number | null = null
    let a: Vec | null = null
    let b: Vec | null = null
    let shown: [Vec, Vec] | null = null
    if (point) {
      from = P(point.id)
      const real = hitTest(s, isLinear, PICK_LINE_PX)
      const l = real && L(real.id)
      if (l && real && isLinear(real)) {
        a = l.a
        b = l.b
        shown = lineEnds(l)
        if (real.dep.kind === 'twoPoints') t = footAlong(objs, resolved, point.id, real.dep.a, real.dep.b)
      } else {
        const side = sideNear(objs, s, PICK_LINE_PX)
        if (side) {
          a = P(side.a)
          b = P(side.b)
          shown = a && b && [a, b]
          t = footAlong(objs, resolved, point.id, side.a, side.b)
        }
      }
    } else if (chosen) {
      const target = snapTarget(s)
      from = target.pos
      const line = objs.find((o) => o.id === chosen.id) ?? chosen.side
      if (chosen.side?.dep.kind === 'twoPoints') {
        // a side not yet on the board: shown with a halo of its own
        a = P(chosen.side.dep.a)
        b = P(chosen.side.dep.b)
        shown = a && b && [a, b]
        t = footAlong(objs, resolved, target.existing ?? target.pos, chosen.side.dep.a, chosen.side.dep.b)
      }
      const l = L(chosen.id)
      if (l && line && isLinear(line)) {
        a = l.a
        b = l.b
        if (line.dep.kind === 'twoPoints') t = footAlong(objs, resolved, target.existing ?? target.pos, line.dep.a, line.dep.b)
      }
    } else return null
    if (!from || !a || !b) return null
    const d = sub(b, a)
    // a line that is not defined by two points of its own: the foot on the plane
    const along = t ?? dot(sub(from, a), d) / dot(d, d)
    return { from, foot: add(a, mul(d, along)), a, b, along, shown }
  }

  /**
   * On a solid: a line through a point, in a direction given as a sum of its points (dirLen long, in units of the body).
   * Its ends are worked out from the corners, so that it stays right whichever way the solid is seen.
   */
  const drawOnSolid = (objs: GObj[], group: string, through: string, dir: [string, number][], dirLen: number, ext: Extent): string => {
    const scale = solidScale(objs, group)
    const end = (length: number) => {
      const k = length / (scale * dirLen)
      const p = newPoint(objs, { x: 0, y: 0 }, { kind: 'combo', parts: [[through, 1], ...dir.map(([id, w]): [string, number] => [id, w * k])] })
      p.hidden = true
      return p.id
    }
    if (ext.mode === 'line') return newLine(objs, 'line', { kind: 'twoPoints', a: through, b: end(1) }, { dashed: true }).id
    const a = ext.mode === 'centered' ? end(-ext.length / 2) : through
    const b = end(ext.mode === 'centered' ? ext.length / 2 : ext.length)
    return newLine(objs, 'segment', { kind: 'twoPoints', a, b }, { dashed: true, showLength: true }).id
  }

  /** On a solid: the perpendicular to a line, through a point of it. The body has many: asks in which plane. */
  const perpendicularOnSolid = async (objs: GObj[], through: string, l: Line3, title: string): Promise<string | null> => {
    const planes = planesThrough(objs, l.group, l.a, l.b)
    if (!planes.length) return null
    let plane = planes[0]
    if (planes.length > 1) {
      const vals = await askForm(title, [{ label: 'În ce plan', value: '0', options: planes.map((p, i) => ({ value: String(i), label: p.name })) }])
      if (!vals) return null
      plane = planes[Number(vals[0])]
    }
    const ext = await askExtent(title)
    if (!ext) return null
    const now = resolve({ objects: objs, view })
    const c = pos3(objs, now, plane.third)
    if (!c) return null
    const d = minus3(l.b, l.a)
    const e = minus3(c.at, l.a)
    const k = dot3(e, d) / dot3(d, d)
    const w: V3 = [e[0] - k * d[0], e[1] - k * d[1], e[2] - k * d[2]]
    return drawOnSolid(objs, l.group, through, [[plane.third, 1], [l.ids[0], k - 1], [l.ids[1], -k]], len3(w), ext)
  }

  // ---------- tool clicks ----------
  const onToolClick = async (s: Vec) => {
    const w = toWorld(s)
    const objs = [...sceneRef.current.objects]
    const hit = hitTest(s)
    const pointAt = (): string => {
      const target = snapTarget(s)
      if (target.existing) return target.existing
      // asked before the point exists: it may itself get the next free letter
      const center = (tool === 'circle' || tool === 'arc' || tool === 'sector') && !pts.length ? centerLabel(objs) : null
      let dep = target.dep
      if (target.edge) {
        // glued to the edge: it stays on it when the solid is moved or turned, and can slide along it
        const { a, b, t } = target.edge
        const first = objs.find((o) => o.id === a)
        const edgeLine = segmentBetween(objs, a, b, { color: first?.type === 'point' ? first.color : color, ghost: true })
        dep = { kind: 'onLine', line: edgeLine.id, t: edgeLine.dep.kind === 'twoPoints' && edgeLine.dep.a === a ? t : 1 - t }
      }
      const p = newPoint(objs, target.pos, dep)
      if (center) p.label = center
      return p.id
    }
    const pts = pending.filter((p) => p.kind === 'point').map((p) => p.id)
    const needPoints = (n: number, done: (ids: string[]) => void | Promise<void>) => {
      const id = pointAt()
      const ids = [...pts, id]
      if (ids.length < n) {
        setPending(ids.map((i) => ({ kind: 'point', id: i })))
        if (objs.length !== sceneRef.current.objects.length) commit(objs)
        return
      }
      setPending([])
      return done(ids)
    }

    /** Bisector of angle a-v-b: asks how far it goes. "To the opposite side" is offered (and preselected) only
     *  when that side is on the board (a segment / line through a and b, or a polygon side): a triangle, not a
     *  lone angle, where it would stop halfway at a side nobody drew. */
    const drawBisector = async (objs: GObj[], a: string, v: string, b: string) => {
      const joins = (p: string, q: string) => (p === a && q === b) || (p === b && q === a)
      const drawnSide = objs.some((o) =>
        isLinear(o) ? o.dep.kind === 'twoPoints' && joins(o.dep.a, o.dep.b)
          : o.type === 'polygon' && o.points.some((p, i) => joins(p, o.points[(i + 1) % o.points.length])))
      if (a === v || b === v || a === b) return
      const now = resolve({ objects: objs, view })
      const [pa, pv, pb] = [a, v, b].map((id) => pos3(objs, now, id))
      const onSolid = pa && pv && pb && pa.group === pv.group && pb.group === pv.group ? { a: pa.at, v: pv.at, b: pb.at, group: pv.group } : null
      const edge = (p: string, q: string) => {
        const o = objs.find((x) => x.id === p)
        const other = objs.find((x) => x.id === q)
        return o?.type === 'point' && other?.type === 'point' && o.group === other.group && other.corner != null && !!o.joins?.includes(other.corner)
      }
      const toSide = drawnSide || edge(a, b)
      const vals = await askForm('Bisectoarea unghiului', [
        {
          label: 'Până unde merge bisectoarea',
          value: toSide ? 'side' : 'ray',
          options: [
            ...(toSide ? [{ value: 'side', label: 'până la latura opusă (bisectoarea din triunghi)' }] : []),
            { value: 'length', label: 'o lungime aleasă de mine' },
            { value: 'ray', label: 'semidreaptă (infinită)' },
          ],
          hint: toSide ? 'Latura opusă = segmentul care unește capetele celor două laturi ale unghiului.' : undefined,
        },
        { label: 'Lungimea bisectoarei', placeholder: 'ex: 4', showIf: { field: 0, value: 'length' } },
      ])
      if (!vals) return
      if (onSolid) {
        // on the body: worked out from the three points, so that it stays right whichever way the solid is seen
        const la = len3(minus3(onSolid.a, onSolid.v))
        const lb = len3(minus3(onSolid.b, onSolid.v))
        const scale = solidScale(objs, onSolid.group)
        const along = (length: number): [string, number][] => {
          const sum: V3 = [0, 1, 2].map((i) => (onSolid.a[i] - onSolid.v[i]) / la + (onSolid.b[i] - onSolid.v[i]) / lb) as V3
          // a straight angle has no sum direction
          if (len3(sum) < 1e-9) return []
          const k = length / (scale * len3(sum))
          return [[v, 1 - k / la - k / lb], [a, k / la], [b, k / lb]]
        }
        let parts: [string, number][]
        if (vals[0] === 'side') {
          const t = la / (la + lb)
          parts = [[a, 1 - t], [b, t]]
        } else {
          const length = vals[0] === 'ray' ? 1 : Number(vals[1].replace(',', '.'))
          if (!(length > 0)) {
            await ask('Lungimea trebuie să fie un număr pozitiv.', '', true)
            return
          }
          parts = along(length)
          if (!parts.length) {
            flash('Laturile sunt în prelungire: unghiul de 180° are o infinitate de bisectoare în corp.')
            return
          }
        }
        const end3 = newPoint(objs, { x: 0, y: 0 }, { kind: 'combo', parts })
        if (vals[0] === 'ray') end3.hidden = true
        newLine(objs, vals[0] === 'ray' ? 'ray' : 'segment', { kind: 'twoPoints', a: v, b: end3.id }, { dashed: true, showLength: vals[0] !== 'ray' })
        commit(objs)
        return
      }
      if (vals[0] === 'ray') {
        newLine(objs, 'ray', { kind: 'bisector', a, v, b }, { dashed: true })
        commit(objs)
        return
      }
      let end: PointObj
      if (vals[0] === 'side') end = newPoint(objs, { x: 0, y: 0 }, { kind: 'bisectorFoot', a, v, b })
      else {
        const length = Number(vals[1].replace(',', '.'))
        if (!(length > 0)) {
          await ask('Lungimea trebuie să fie un număr pozitiv.', '', true)
          return
        }
        end = newPoint(objs, { x: 0, y: 0 }, { kind: 'bisectorPoint', a, v, b, dist: length })
      }
      newLine(objs, 'segment', { kind: 'twoPoints', a: v, b: end.id }, { dashed: true, showLength: true })
      commit(objs)
    }

    switch (tool) {
      case 'point':
        pointAt()
        commit(objs)
        break
      case 'segment':
      case 'line':
      case 'ray':
        await needPoints(2, ([a, b]) => {
          if (a === b) return
          newLine(objs, tool, { kind: 'twoPoints', a, b }, { showLength: tool === 'segment' })
          commit(objs)
        })
        break
      case 'circle':
        await needPoints(2, ([c, t]) => {
          if (c === t) return
          objs.push({ id: uid(), type: 'circle', center: c, through: t, color, width: 2 } satisfies CircleObj)
          commit(objs)
        })
        break
      case 'arc':
      case 'sector': {
        if (pts.length < 2) {
          if (snapTarget(s).existing !== pts[0] || !pts.length) await needPoints(3, () => {})
          break
        }
        const [cId, tId] = pts
        const c = P(cId)
        const t = P(tId)
        if (!c || !t) {
          setPending([])
          break
        }
        const end = arcEndAt(s, c, t)
        // no arc yet: its two ends are in the same place
        if (dist(end.pos, t) < 1e-6) break
        const id = uid()
        const to = end.existing ?? newPoint(objs, end.pos, { kind: 'onCircle', circle: id, angle: end.angle }).id
        objs.push({ id, type: 'arc', center: cId, through: tId, to, color, width: 2, sector: tool === 'sector' } satisfies ArcObj)
        if (tool === 'sector') {
          newLine(objs, 'segment', { kind: 'twoPoints', a: cId, b: tId })
          newLine(objs, 'segment', { kind: 'twoPoints', a: cId, b: to })
        }
        setPending([])
        commit(objs)
        break
      }
      case 'midpoint':
        const midOf = pending.length || hit?.type === 'point' ? null : hit?.type === 'segment' ? hit : sideAt(objs, s)
        if (midOf && midOf.type === 'segment' && midOf.dep.kind === 'twoPoints') {
          const m = newPoint(objs, { x: 0, y: 0 }, { kind: 'midpoint', a: midOf.dep.a, b: midOf.dep.b })
          m.label = 'M'
          commit(objs)
          break
        }
        await needPoints(2, ([a, b]) => {
          newPoint(objs, { x: 0, y: 0 }, { kind: 'midpoint', a, b })
          commit(objs)
        })
        break
      case 'polygon': {
        const id = pointAt()
        if (pts.length >= 3 && id === pts[0]) {
          objs.push({ id: uid(), type: 'polygon', points: pts, color, fill: color + '22', width: 2 } satisfies PolygonObj)
          setPending([])
          commit(objs)
        } else {
          setPending([...pending, { kind: 'point', id }])
          if (objs.length !== sceneRef.current.objects.length) commit(objs)
        }
        break
      }
      case 'triangle': {
        const at = snap(w)
        const vals = await askForm('Triunghi', [
          {
            label: 'Tipul triunghiului',
            value: 'right',
            options: Object.entries(TRIANGLE_KINDS).map(([value, label]) => ({ value, label })),
          },
          { label: 'Catetele', value: '3, 4', showIf: { field: 0, value: 'right' }, hint: `Două numere pozitive, oricare. Unghiul drept este în vârful pe care ai dat click. ${NUMBER_FORMAT}` },
          { label: 'Laturile', value: '5, 6, 7', showIf: { field: 0, value: 'acute' }, hint: `Trei numere pozitive. Pătratul laturii celei mai mari trebuie să fie mai mic decât suma pătratelor celorlalte două. Exemplu: 5, 6, 7, pentru că 7² = 49 < 5² + 6² = 61. ${NUMBER_FORMAT}` },
          { label: 'Laturile', value: '3, 4, 6', showIf: { field: 0, value: 'obtuse' }, hint: `Trei numere pozitive. Latura cea mai mare trebuie să fie mai mică decât suma celorlalte două, iar pătratul ei mai mare decât suma pătratelor lor. Exemplu: 3, 4, 6, pentru că 6 < 3 + 4 și 6² = 36 > 3² + 4² = 25. ${NUMBER_FORMAT}` },
          { label: 'Latura', value: '4', showIf: { field: 0, value: 'equi' }, hint: `Un număr pozitiv, oricare. ${NUMBER_FORMAT}` },
          { label: 'Baza, apoi laturile egale', value: '4, 5', showIf: { field: 0, value: 'iso' }, hint: `Două numere pozitive. Baza trebuie să fie mai mică decât dublul laturii egale. Exemplu: 4, 5, pentru că 4 < 2 · 5. ${NUMBER_FORMAT}` },
        ], (values) => {
          // a wrong triangle is explained in the dialog itself, which keeps what was typed
          const checked = triangleFromInput(values[0], values)
          return typeof checked === 'string' ? checked : null
        })
        if (!vals) break
        const t = triangleFromInput(vals[0], vals)
        if (typeof t === 'string') break
        // first vertex where the user clicked, first side along the x axis, third vertex above it
        const v = triangleVertices(t)
        const ids = [v.A, v.B, v.C].map((p) => newPoint(objs, { x: at.x + p.x, y: at.y + p.y }).id)
        const [A, B, C] = ids
        objs.push({ id: uid(), type: 'polygon', points: ids, color, fill: color + '18', width: 2 } satisfies PolygonObj)
        for (const [p, q] of [[A, B], [B, C], [C, A]]) newLine(objs, 'segment', { kind: 'twoPoints', a: p, b: q }, { showLength: true })
        for (const [p, vx, q] of [[B, A, C], [C, B, A], [A, C, B]])
          objs.push({ id: uid(), type: 'angle', a: p, v: vx, b: q, color, showValue: true, rightMark: true } satisfies AngleObj)
        commit(objs)
        break
      }
      case 'regular':
        await needPoints(2, async ([a, b]) => {
          const vals = await askForm('Poligon regulat', [
            { label: 'Număr de laturi', value: '6', hint: 'Între 3 și 40.' },
            { label: 'Aria', placeholder: 'gol = mărimea dintre cele două clicuri', hint: 'În cm², de exemplu 12,5. Un cm este o unitate pe axe sau pe riglă. Poligonul pornește din primul click, spre al doilea.' },
          ], ([sides, size]) => {
            const count = Number(sides)
            if (!Number.isInteger(count) || count < 3 || count > 40) return 'Numărul de laturi trebuie să fie un număr întreg între 3 și 40.'
            if (size.trim() && !(Number(size.trim().replace(',', '.')) > 0)) return 'Aria trebuie să fie un număr pozitiv, de exemplu 12,5.'
            return null
          })
          if (!vals) return
          const n = Number(vals[0])
          const area = vals[1].trim() ? Number(vals[1].trim().replace(',', '.')) : null
          const interior = ((n - 2) * 180) / n
          let second = b
          const pa = objs.find((o): o is PointObj => o.id === a && o.type === 'point')
          const pb = objs.find((o): o is PointObj => o.id === b && o.type === 'point')
          const from = P(a) ?? (pa && { x: pa.x, y: pa.y })
          const toward = P(b) ?? (pb && { x: pb.x, y: pb.y })
          if (area !== null && from && toward) {
            // the side that gives this area: A = n·l² / (4·tan(π/n))
            const side = Math.sqrt((4 * area * Math.tan(Math.PI / n)) / n)
            const end = add(from, mul(norm(sub(toward, from)), side))
            const isNew = !sceneRef.current.objects.some((o) => o.id === b)
            // a point placed by this click moves there; one that was already on the board stays where it is
            if (isNew && pb) Object.assign(pb, { x: end.x, y: end.y, dep: { kind: 'free' } })
            else second = newPoint(objs, end).id
          }
          const ids = [a, second]
          for (let k = 2; k < n; k++)
            ids.push(newPoint(objs, { x: 0, y: 0 }, { kind: 'rotate', center: ids[k - 1], from: ids[k - 2], deg: -interior }).id)
          objs.push({ id: uid(), type: 'polygon', points: ids, color, fill: color + '22', width: 2 } satisfies PolygonObj)
          commit(objs)
        })
        break
      case 'lineAngle': {
        const lineHit = pickLine(objs, s)
        if (!lineHit) break
        const next = [...pending, { kind: 'line' as const, id: lineHit.id, at: w, side: lineHit.side }]
        if (next.length < 2) {
          setPending(next)
          break
        }
        setPending([])
        addSides(objs, next)
        const [p1, p2] = next
        if (p1.id === p2.id) break
        const now = resolve({ objects: objs, view })
        const l1 = now.lines.get(p1.id)
        const l2 = now.lines.get(p2.id)
        const v = l1 && l2 ? intersectLines(l1, l2) : null
        if (!l1 || !l2 || !v) {
          await ask('Liniile sunt paralele: unghiul dintre ele este 0°.', '', true)
          break
        }
        // measure the angle between the parts that were clicked (a click right at the vertex counts as +)
        const side = (l: ResolvedLine, at: Vec) => ((at.x - v.x) * l.d.x + (at.y - v.y) * l.d.y >= -1e-9 ? 1 : -1)
        objs.push({
          id: uid(), type: 'lineAngle', l1: p1.id, l2: p2.id, s1: side(l1, p1.at!), s2: side(l2, p2.at!), color, showValue: true, rightMark: true,
        } satisfies LineAngleObj)
        commit(objs)
        break
      }
      case 'bisector': {
        // The angle can be chosen three ways: click its arc, click its two sides, or click three existing
        // points (side, vertex, side). Clicks on empty paper don't add points: that only got in the way.
        const target = snapTarget(s)
        const existing = !pending.some((p) => p.kind === 'line') ? target.existing : undefined
        if (existing) {
          const ids = [...pts, existing]
          if (ids.length < 3) {
            setPending(ids.map((id) => ({ kind: 'point', id })))
            break
          }
          setPending([])
          await drawBisector(objs, ids[0], ids[1], ids[2])
          break
        }
        if (!pending.length) {
          const arc = hitTest(s, (o) => o.type === 'angle')
          if (arc?.type === 'angle') {
            await drawBisector(objs, arc.a, arc.v, arc.b)
            break
          }
        }
        if (pts.length) break // three points were started: wait for another existing point
        const lineHit = pickLine(objs, s)
        if (!lineHit) break
        const next = [...pending, { kind: 'line' as const, id: lineHit.id, at: w, side: lineHit.side }]
        if (next.length < 2) {
          setPending(next)
          break
        }
        setPending([])
        addSides(objs, next)
        const [p1, p2] = next
        if (p1.id === p2.id) break
        const now = resolve({ objects: objs, view })
        if (isSkew(objs, now, p1.id, p2.id)) {
          flash('Liniile nu sunt în același plan, deci nu formează un unghi cu vârf.')
          break
        }
        const l1 = now.lines.get(p1.id)
        const l2 = now.lines.get(p2.id)
        const x = l1 && l2 ? intersectLines(l1, l2) : null
        if (!l1 || !l2 || !x) {
          await ask('Liniile sunt paralele, deci nu formează un unghi.', '', true)
          break
        }
        // two sides of a figure meeting at a common point (a triangle's sides): the angle between them, and
        // its opposite side joins their other ends. Otherwise: the angle on the parts that were clicked.
        const ends = (id: string) => {
          const o = objs.find((g) => g.id === id)
          return o && isLinear(o) && o.dep.kind === 'twoPoints' ? [o.dep.a, o.dep.b] : []
        }
        const e1 = ends(p1.id)
        const e2 = ends(p2.id)
        const shared = e1.find((id) => e2.includes(id))
        if (shared) {
          await drawBisector(objs, e1.find((id) => id !== shared)!, shared, e2.find((id) => id !== shared)!)
          break
        }
        const hidden = (at: Vec, dep: PointObj['dep']) => {
          const p = newPoint(objs, at, dep)
          p.hidden = true
          return p.id
        }
        const v = hidden(x, { kind: 'intersection', l1: p1.id, l2: p2.id })
        const a = hidden(p1.at!, { kind: 'onLine', line: p1.id, t: projectParam(p1.at!, l1) })
        const b = hidden(p2.at!, { kind: 'onLine', line: p2.id, t: projectParam(p2.at!, l2) })
        await drawBisector(objs, a, v, b)
        break
      }
      case 'construct':
        await needPoints(3, async ([a, v, b]) => {
          // the third point may be the first one again: both sides coincide, an angle of 0°
          if (a === v || b === v) {
            flash('Vârful trebuie să fie diferit de celelalte două puncte.')
            return
          }
          const at = resolve({ objects: objs, view }).points
          const pa = at.get(a)
          const pv = at.get(v)
          const pb = at.get(b)
          if (!pa || !pv || !pb) return
          const third = objs.find((o) => o.id === b)
          // only a point placed by this click can move to the exact measure; an existing one stays where it is
          if (third?.type === 'point' && third.dep.kind === 'free' && !sceneRef.current.objects.some((o) => o.id === b)) {
            const round2 = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',')
            const measured = round2(angleAt(pa, pv, pb) * 180 / Math.PI)
            const first = objs.find((o): o is PointObj => o.id === a && o.type === 'point')
            // the first side can be made longer or shorter only if its end is a free point that nothing else uses
            const firstFree = !!first && first.dep.kind === 'free' && !first.locked && !first.group
              && !objs.some((o) => o.id !== a && dependsOn(o).includes(a))
            const name = (id: string) => (objs.find((o) => o.id === id) as PointObj | undefined)?.label ?? ''
            const lengthA = round2(dist(pv, pa))
            const lengthB = round2(dist(pv, pb))
            const num = (s: string) => Number(s.trim().replace(',', '.'))
            const fields = [
              { label: 'Măsura unghiului (grade)', value: measured, hint: 'Lasă valorile ca să păstrezi punctele alese sau scrie altele. Măsura este între 0 și 180.' },
              { label: `Lungimea laturii ${name(v)}${name(b)}`, value: lengthB, hint: `Al treilea punct, ${name(b)}, se mută pentru măsura și lungimea exacte.` },
              ...(firstFree ? [{ label: `Lungimea laturii ${name(v)}${name(a)}`, value: lengthA, hint: `Punctul ${name(a)} se mută pe aceeași direcție.` }] : []),
            ]
            const vals = await askForm('Construiește un unghi', fields, (values) => {
              if (!(num(values[0]) > 0 && num(values[0]) <= 180)) return 'Măsura trebuie să fie un număr mai mare ca 0, cel mult 180.'
              if (values.slice(1).some((x) => !(num(x) > 0))) return 'Lungimile trebuie să fie numere pozitive, de exemplu 4 sau 2,5.'
              return null
            })
            if (!vals) return
            if (firstFree && vals[2].trim() !== lengthA) {
              const to = add(pv, mul(norm(sub(pa, pv)), num(vals[2])))
              objs[objs.indexOf(first!)] = { ...first!, x: to.x, y: to.y }
            }
            if (vals[0].trim() !== measured || vals[1].trim() !== lengthB) {
              // keeps the side of the first side on which the third point was clicked
              const deg = num(vals[0])
              const signed = angleCCW(pa, pv, pb) > Math.PI ? -deg : deg
              objs[objs.indexOf(third)] = { ...third, dep: { kind: 'polar', center: v, toward: a, deg: signed, dist: num(vals[1]) } }
            }
          }
          const hasSide = (p: string) => objs.some((o) => o.type === 'segment' && o.dep.kind === 'twoPoints'
            && ((o.dep.a === v && o.dep.b === p) || (o.dep.a === p && o.dep.b === v)))
          for (const p of [a, b]) if (!hasSide(p)) newLine(objs, 'segment', { kind: 'twoPoints', a: v, b: p })
          objs.push({ id: uid(), type: 'angle', a, v, b, color, showValue: true, rightMark: true } satisfies AngleObj)
          commit(objs)
        })
        break
      case 'perpendicular':
      case 'parallel': {
        // either order: the line and the point. A click on a free spot, at the start, is the point.
        const haveLine = pending.find((p) => p.kind === 'line')
        const havePoint = pending.find((p) => p.kind === 'point')
        // once the point is there, only a line can be meant: it can be missed by a little more
        const reach = havePoint ? PICK_LINE_PX : 10
        const lineHit = haveLine ? null : pickLine(objs, s, reach, reach)
        let pick: Pick | null = null
        if (!haveLine && !havePoint) {
          // first click: an existing point if one was hit, otherwise a line
          if (hit?.type === 'point') pick = { kind: 'point', id: hit.id }
          else if (lineHit) pick = { kind: 'line', id: lineHit.id, side: lineHit.side }
          else pick = { kind: 'point', id: pointAt() }
        } else if (!haveLine) {
          // waiting for the line: look at lines only, even next to a vertex
          if (lineHit) pick = { kind: 'line', id: lineHit.id, side: lineHit.side }
        } else {
          // waiting for the point: an existing one, or a new one where the user clicked
          pick = { kind: 'point', id: pointAt() }
        }
        if (!pick) {
          flash(haveLine ? 'Alege punctul.' : 'Click pe o dreaptă, un segment, o semidreaptă, latura unui poligon sau muchia unui corp. Liniile desenate liber nu se pot folosi.')
          break
        }
        const next = [...pending, pick]
        const ln = next.find((p) => p.kind === 'line')
        const pt = next.find((p) => p.kind === 'point')
        if (!ln || !pt) {
          setPending(next)
          if (objs.length !== sceneRef.current.objects.length) commit(objs)
          break
        }
        setPending([])
        addSides(objs, next)
        const now = resolve({ objects: objs, view })
        const ref = now.lines.get(ln.id)
        const at = now.points.get(pt.id)
        const onLine = ref && at ? distToLine(at, { ...ref, kind: 'line' }) < 1e-9 : false
        // the point and the line on the body of one solid: the plane would give the wrong right angle
        const body = line3(objs, now, ln.id)
        const spot = pos3(objs, now, pt.id)
        if (body && spot && body.group === spot.group) {
          const d = minus3(body.b, body.a)
          if (tool === 'parallel') {
            const ext = await askExtent('Paralela')
            if (!ext) break
            drawOnSolid(objs, body.group, pt.id, [[body.ids[1], 1], [body.ids[0], -1]], len3(d), ext)
            commit(objs)
            break
          }
          const t = dot3(minus3(spot.at, body.a), d) / dot3(d, d)
          const foot3: V3 = [body.a[0] + t * d[0], body.a[1] + t * d[1], body.a[2] + t * d[2]]
          if (len3(minus3(spot.at, foot3)) < 1e-6) {
            const drawn = await perpendicularOnSolid(objs, pt.id, body, 'Perpendiculara în punctul de pe muchie')
            if (!drawn) break
            rightMark(objs, drawn, ln.id)
            commit(objs)
            break
          }
          // the foot may be one of the ends: no second point on top of it
          const foot = Math.abs(t) < 1e-6 ? body.ids[0] : Math.abs(t - 1) < 1e-6 ? body.ids[1]
            : newPoint(objs, { x: 0, y: 0 }, { kind: 'combo', parts: [[body.ids[0], 1 - t], [body.ids[1], t]] }).id
          const seg = newLine(objs, 'segment', { kind: 'twoPoints', a: pt.id, b: foot }, { dashed: true, showLength: true })
          finishFoot(objs, foot, seg.id, ln.id, t)
          commit(objs)
          break
        }
        if (tool === 'parallel' || onLine) {
          // a parallel has no foot; a perpendicular at a point of the line goes both ways from it
          const ext = await askExtent(tool === 'parallel' ? 'Paralela' : 'Perpendiculara în punctul de pe dreaptă')
          if (!ext) break
          const drawn = drawThrough(objs, tool, pt.id, ln.id, ext)
          if (tool === 'perpendicular') rightMark(objs, drawn, ln.id)
          commit(objs)
          break
        }
        // perpendicular from a point to a line: the segment to its foot, as drawn in class
        const foot = newPoint(objs, { x: 0, y: 0 }, { kind: 'foot', point: pt.id, line: ln.id })
        const seg = newLine(objs, 'segment', { kind: 'twoPoints', a: pt.id, b: foot.id }, { dashed: true, showLength: true })
        // right-angle mark at the foot, between the new segment (towards the point) and the line
        finishFoot(objs, foot.id, seg.id, ln.id, ref && at ? dot(sub(at, ref.a), ref.d) / dot(ref.d, ref.d) : 0)
        commit(objs)
        break
      }
      case 'mediatrix': {
        // perpendicular bisector: through the midpoint of a segment, perpendicular to it
        const segHit = hitTest(s, (o) => o.type === 'segment', 10) ?? sideAt(objs, s)
        if (!segHit || segHit.type !== 'segment' || segHit.dep.kind !== 'twoPoints') {
          flash('Click pe un segment, pe latura unui poligon sau pe muchia unui corp. Liniile desenate liber nu se pot folosi.')
          break
        }
        const onBody = line3(objs, resolve({ objects: objs, view }), segHit.id)
        if (onBody) {
          const middle = newPoint(objs, { x: 0, y: 0 }, { kind: 'midpoint', a: segHit.dep.a, b: segHit.dep.b })
          const drawn = await perpendicularOnSolid(objs, middle.id, onBody, 'Mediatoarea muchiei')
          if (!drawn) break
          rightMark(objs, drawn, segHit.id)
          commit(objs)
          break
        }
        const ext = await askExtent('Mediatoarea segmentului')
        if (!ext) break
        const m = newPoint(objs, { x: 0, y: 0 }, { kind: 'midpoint', a: segHit.dep.a, b: segHit.dep.b })
        const drawn = drawThrough(objs, 'perpendicular', m.id, segHit.id, ext)
        rightMark(objs, drawn, segHit.id)
        commit(objs)
        break
      }
      case 'intersection': {
        // also the sides of polygons and the edges of solids: their segments join the board with the point
        const lineHit = pickLine(objs, s)
        if (!lineHit) {
          flash('Click pe o dreaptă, un segment, o semidreaptă, latura unui poligon sau muchia unui corp.')
          break
        }
        const next = [...pending, { kind: 'line' as const, id: lineHit.id, side: lineHit.side }]
        if (next.length === 2) {
          addSides(objs, next)
          const now = resolve({ objects: objs, view })
          const [o1, o2] = next.map((p) => objs.find((o) => o.id === p.id))
          const ends = (o?: GObj) => (o && isLinear(o) && o.dep.kind === 'twoPoints' ? [o.dep.a, o.dep.b] : [])
          const shared = ends(o1).find((p) => ends(o2).includes(p))
          const [r1, r2] = next.map((p) => now.lines.get(p.id))
          if (isSkew(objs, now, next[0].id, next[1].id)) flash('Liniile nu sunt în același plan: doar par să se taie.')
          else if (shared && next[0].id !== next[1].id) {
            // two sides or edges from one corner: the point is already there
            flash(`Liniile se întâlnesc în ${(objs.find((o) => o.id === shared) as PointObj | undefined)?.label || 'capătul lor comun'}, care există deja.`)
          } else if (r1 && r2 && !intersectLines(r1, r2)) flash('Liniile sunt paralele: nu se intersectează.')
          else if (next[0].id !== next[1].id) {
            newPoint(objs, { x: 0, y: 0 }, { kind: 'intersection', l1: next[0].id, l2: next[1].id })
            commit(objs)
          }
          setPending([])
        } else setPending(next)
        break
      }
      case 'text': {
        const t = await ask('Text (formule LaTeX între $...$, ex: $\\alpha = 30^\\circ$)', '')
        if (!t) break
        objs.push({ id: uid(), type: 'text', x: w.x, y: w.y, text: t, color, size: 18 } satisfies TextObj)
        commit(objs)
        break
      }
      case 'delete':
        if (hit) removeObj(hit.id)
        break
    }
  }

  // ---------- pointer handling ----------
  const screenPos = (e: React.PointerEvent | React.WheelEvent): Vec => {
    const r = svgRef.current!.getBoundingClientRect()
    const k = sheet?.zoom ?? 1
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }
  }

  const freePointsOf = (o: GObj): string[] => {
    if (o.type === 'point') return o.dep.kind === 'free' ? [o.id] : []
    return dependsOn(o).filter((id) => {
      const p = scene.objects.find((x) => x.id === id)
      return p?.type === 'point' && p.dep.kind === 'free'
    })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const s = screenPos(e)
    // the plane can be dragged from any tool: right or middle button, Space held, or the hand tool
    const panGesture = !sheet && (tool === 'pan' || spaceHeld || (e.pointerType === 'mouse' && (e.button === 1 || e.button === 2)))
    if (!panGesture && e.button !== 0 && e.pointerType === 'mouse') return
    try {
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
    } catch {
      /* pointer already gone: carry on without capture */
    }
    if (panGesture) {
      e.preventDefault()
      drag.current = { mode: 'pan', start: s, view: { ...view } }
      setPanning(true)
      return
    }
    // a line along an edge runs half its width (2.5 px on screen) plus a pixel away from it
    if (instOn && inst.down(e.pointerId, [...toPlane(s), 0.5], tool === 'pen', 2.25 / instScale)) {
      drag.current = { mode: 'inst' }
      return
    }
    if (tool === 'pen') {
      const w = toWorld(s)
      const p: PathObj = { id: uid(), type: 'path', points: [[w.x, w.y]], color, width: 2.5 }
      commit([...sceneRef.current.objects, p])
      drag.current = { mode: 'pen', id: p.id }
      return
    }
    if (tool === 'solid') {
      const from = snap(toWorld(s))
      setSolidDrag({ from, to: from })
      drag.current = { mode: 'solid' }
      return
    }
    if (tool !== 'move') {
      void onToolClick(s)
      return
    }
    // the handles of the selected figure come first: they sit on its edge
    const handle = figure && pivot ? handleAt(s) : null
    if (handle === 'orbit' && figure?.holder?.frame) {
      const { yaw, pitch } = figure.holder.frame
      drag.current = { mode: 'orbit', holder: figure.holder.id, start: s, yaw, pitch, moved: false }
      return
    }
    if (handle && handle !== 'orbit' && figure && pivot) {
      drag.current = { mode: 'xform', kind: handle, pivot, start: toWorld(s), base: xformBase(figure.movable, figure.ids), moved: false }
      return
    }
    const hit = hitTest(s)
    setSelected(hit?.id ?? null)
    if (!hit) {
      if (sheet) return
      drag.current = { mode: 'pan', start: s, view: { ...view } }
      setPanning(true)
      return
    }
    // a vertex moves alone (reshaping the figure); grabbing any other part moves the whole figure
    let ids: string[]
    if (hit.type === 'point' && (hit.dep.kind === 'onLine' || hit.dep.kind === 'onCircle')) {
      // a point glued to a line or circle slides along it
      drag.current = { mode: 'slide', id: hit.id, moved: false }
      return
    }
    // the corner of a solid is not a vertex to reshape: it moves the solid
    if (hit.type === 'point' && !hit.group) ids = freePointsOf(hit)
    else if (hit.type === 'text' || (hit.type === 'path' && !hit.group)) ids = [hit.id]
    else {
      const fig = figureWithContents(sceneRef.current, resolved.points, hit.id)
      ids = sceneRef.current.objects
        .filter((o) => fig.has(o.id) && ((o.type === 'point' && o.dep.kind === 'free' && !o.locked) || o.type === 'path' || o.type === 'text'))
        .map((o) => o.id)
    }
    if (!ids.length) return
    const orig = new Map<string, Vec>()
    for (const o of scene.objects) {
      if (!ids.includes(o.id)) continue
      if (o.type === 'point' || o.type === 'text') orig.set(o.id, { x: o.x, y: o.y })
      if (o.type === 'path') orig.set(o.id, { x: 0, y: 0 })
    }
    drag.current = { mode: 'move', ids, start: toWorld(s), orig, moved: false }
  }

  const pathOrig = useRef<Map<string, [number, number][]>>(new Map())

  const onPointerMove = (e: React.PointerEvent) => {
    const s = screenPos(e)
    const w = toWorld(s)
    setMouse(w)
    const d = drag.current
    if (!d) {
      if (instOn) inst.hoverAt(...toPlane(s), tool === 'pen')
      else inst.setHover(null)
      const h = hitTest(s)
      setHover(h?.id ?? null)
      setHoverHandle(tool === 'move' && figure ? handleAt(s) : null)
      // perpendicular / parallel place a point only once the line is chosen
      const placesPoint = POINT_TOOLS.has(tool) || ((tool === 'perpendicular' || tool === 'parallel') && pending.some((p) => p.kind === 'line'))
      // the bisector only picks points that are already there: show the ghost just on those
      if ((tool === 'arc' || tool === 'sector') && pending.length === 2) {
        const [c, t] = pending.map((p) => P(p.id))
        if (c && t) return setGhost(arcEndAt(s, c, t))
      }
      const target = placesPoint || tool === 'bisector' ? snapTarget(s) : null
      setGhost(placesPoint || target?.existing ? target : null)
      setThroughGhost((tool === 'perpendicular' || tool === 'parallel') && pending.length ? throughPreview(s) : null)
      return
    }
    if (d.mode === 'inst') {
      inst.move(e.pointerId, ...toPlane(s), e.shiftKey)
    } else if (d.mode === 'pan') {
      setView({ cx: d.view.cx - (s.x - d.start.x) / view.scale, cy: d.view.cy + (s.y - d.start.y) / view.scale })
    } else if (d.mode === 'slide') {
      const o = sceneRef.current.objects.find((x) => x.id === d.id)
      if (o?.type !== 'point') return
      let dep: PointObj['dep'] | null = null
      if (o.dep.kind === 'onLine') {
        const l = L(o.dep.line)
        if (l) dep = { ...o.dep, t: projectParam(w, l) }
      } else if (o.dep.kind === 'onCircle') {
        const c = sceneRef.current.objects.find((x) => x.id === (o.dep as { circle: string }).circle)
        const center = c?.type === 'circle' || c?.type === 'arc' ? P(c.center) : null
        const t = c?.type === 'arc' ? P(c.through) : null
        if (c?.type === 'arc' && c.to !== d.id) {
          // a point on the arc stops at its ends; only the arc's own end changes how long it is
          const to = P(c.to)
          if (!center || !t || !to || !onArc(w, center, t, to)) return
        }
        if (c?.type === 'arc' && c.to === d.id && center && t) {
          // the arc's end moves one degree at a time, and never closes the arc
          const end = arcWholeDegrees(center, t, w)
          if (end.deg) {
            dep = { ...o.dep, angle: Math.atan2(end.pos.y - center.y, end.pos.x - center.x) }
            setGhost({ pos: end.pos, deg: end.deg })
          }
        } else if (center && dist(center, w) > 1e-9) dep = { ...o.dep, angle: Math.atan2(w.y - center.y, w.x - center.x) }
      }
      if (!dep) return
      if (!d.moved) {
        remember()
        d.moved = true
      }
      const next = { ...sceneRef.current, objects: sceneRef.current.objects.map((x) => (x.id === d.id ? { ...o, dep } : x)) }
      sceneRef.current = next
      onChange(next)
    } else if (d.mode === 'pen') {
      onChange({
        ...sceneRef.current,
        objects: sceneRef.current.objects.map((o) =>
          o.id === d.id && o.type === 'path' ? { ...o, points: [...o.points, [w.x, w.y]] } : o,
        ),
      })
    } else if (d.mode === 'solid') {
      setSolidDrag((sd) => sd && { ...sd, to: snap(w) })
    } else if (d.mode === 'move') {
      if (!d.moved) {
        remember()
        d.moved = true
        pathOrig.current = new Map(
          sceneRef.current.objects.filter((o): o is PathObj => o.type === 'path').map((o) => [o.id, o.points]),
        )
      }
      let delta = sub(w, d.start)
      // Snap the first dragged point to the grid; everything else follows by the same delta.
      const first = d.orig.get(d.ids[0])
      const firstObj = sceneRef.current.objects.find((o) => o.id === d.ids[0])
      if (first && firstObj?.type === 'point') delta = sub(snap(add(first, delta)), first)
      const next = { ...sceneRef.current, objects: sceneRef.current.objects.map((o) => {
        if (!d.ids.includes(o.id)) return o
        const og = d.orig.get(o.id)!
        if (o.type === 'point' || o.type === 'text') return { ...o, x: og.x + delta.x, y: og.y + delta.y }
        if (o.type === 'path')
          return { ...o, points: pathOrig.current.get(o.id)!.map(([x, y]) => [x + delta.x, y + delta.y] as [number, number]) }
        return o
      }) }
      sceneRef.current = next
      onChange(next)
    } else if (d.mode === 'orbit') {
      if (!d.moved) {
        remember()
        d.moved = true
      }
      // half a degree per pixel: the front of the body follows the pointer
      const yaw = ((Math.round(d.yaw + (s.x - d.start.x) / 2) + 540) % 360) - 180
      const pitch = Math.max(-90, Math.min(90, Math.round(d.pitch + (s.y - d.start.y) / 2)))
      setXformLabel(`${yaw}°, ${pitch}°`)
      orbitSolid(d.holder, yaw, pitch)
    } else if (d.mode === 'xform') {
      if (!d.moved) {
        remember()
        d.moved = true
      }
      let f: (p: Vec) => Vec
      let k = 1
      if (d.kind === 'rotate') {
        let deg = ((Math.atan2(w.y - d.pivot.y, w.x - d.pivot.x) - Math.atan2(d.start.y - d.pivot.y, d.start.x - d.pivot.x)) * 180) / Math.PI
        deg = ((deg + 540) % 360) - 180
        // whole degrees; Shift snaps to 15°
        deg = e.shiftKey ? Math.round(deg / 15) * 15 : Math.round(deg)
        const a = (deg * Math.PI) / 180
        f = (p) => rotate(p, d.pivot, a)
        setXformLabel(`${deg > 0 ? '+' : ''}${deg}°`)
      } else {
        k = dist(w, d.pivot) / Math.max(1e-9, dist(d.start, d.pivot))
        k = Math.max(0.05, Math.round(k * 100) / 100)
        f = (p) => add(d.pivot, mul(sub(p, d.pivot), k))
        setXformLabel(`×${formatNum(k)}`)
      }
      const next = { ...sceneRef.current, objects: applyXform(d.base, f, k) }
      sceneRef.current = next
      onChange(next)
    }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current?.mode === 'inst') {
      const marks = inst.up(e.pointerId)
      // the line just drawn along an instrument: a segment, if it is straight
      const live = sceneRef.current.objects.find((o): o is PathObj => o.id === instPath.current && o.type === 'path')
      instPath.current = undefined
      const objects = live ? sceneRef.current.objects.flatMap((o) => (o === live ? asSegment(live) : [o])) : sceneRef.current.objects
      // no commit: the undo step taken when the line or arc began covers these too
      if (marks.length || objects !== sceneRef.current.objects) {
        const next = { ...sceneRef.current, objects: [...objects, ...marks.map(instPathObj)] }
        sceneRef.current = next
        onChange(next)
      }
      inst.hoverAt(...toPlane(screenPos(e)), tool === 'pen')
    }
    if (drag.current?.mode === 'solid') {
      // a click without a drag leaves nothing behind
      if (solidDrag && dist(solidDrag.from, solidDrag.to) > 0) {
        const group = uid()
        const { from, to } = solidDrag
        const objects = sceneRef.current.objects
        commit([...objects, ...solidObjects(solid, from.x, from.y, to.x, to.y, objects, { color, group })])
      }
      setSolidDrag(null)
    }
    drag.current = null
    setPanning(false)
    setXformLabel(null)
    if (ghost?.deg != null) setGhost(null)
  }

  const onWheel = (e: React.WheelEvent) => {
    if (sheet) return // on a page the wheel zooms the page
    const s = screenPos(e)
    const before = toWorld(s)
    const scale = Math.min(400, Math.max(5, view.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12)))
    // keep the world point under the cursor fixed
    setView({ scale, cx: before.x - (s.x - size.w / 2) / scale, cy: before.y + (s.y - size.h / 2) / scale })
  }

  // on a page: what was begun or selected ends when the page takes the pointer back, or another page opens
  const sheetActive = sheet?.active
  const sheetPage = sheet?.page
  useEffect(() => {
    if (!onSheet) return
    setPending([])
    setGhost(null)
    setSelected(null)
  }, [onSheet, sheetActive, sheetPage])

  useEffect(() => {
    if (readOnly || (sheet && !sheet.active)) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (!sheet && !wrapRef.current?.closest('.board')?.contains(document.activeElement) && document.activeElement !== document.body) return
      // Esc: drop the half-finished construction and go back to the cursor
      if (e.key === 'Escape') {
        setPending([])
        setTool('move')
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        removeObj(selected)
        setSelected(null)
      }
      if (sheet) return // undo is the page's
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const changeTool = (t: Tool) => {
    setTool(t)
    setPending([])
    setGhost(null)
  }

  const addFunction = async () => {
    const expr = await ask('Funcția f(x) — ex: sin(x), 2*cos(3x), tan(x), x^2 - 1', 'sin(x)')
    if (!expr) return
    try {
      compile(expr).evaluate({ x: 1 })
    } catch {
      await ask('Expresie invalidă: ' + expr, '', true)
      return
    }
    commit([...sceneRef.current.objects, { id: uid(), type: 'function', expr, color, width: 2 } satisfies FunctionObj])
  }

  const updateObj = (id: string, patch: Partial<GObj>) =>
    commit(sceneRef.current.objects.map((o) => (o.id === id ? ({ ...o, ...patch } as GObj) : o)))

  // ---------- export ----------
  const svgText = () => {
    const clone = svgRef.current!.cloneNode(true) as SVGSVGElement
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.querySelectorAll('[data-ui]').forEach((n) => n.remove())
    return new XMLSerializer().serializeToString(clone)
  }
  const exportSvg = () => saveFile('figura.svg', new Blob([svgText()], { type: 'image/svg+xml' }))
  const exportPng = () => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = size.w * 2
      c.height = size.h * 2
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      try {
        c.toBlob((blob) => (blob ? saveFile('figura.png', blob) : exportSvg()), 'image/png')
      } catch {
        exportSvg() // canvas tainted by embedded formulas: fall back to SVG
      }
    }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText())
  }

  // ---------- rendering ----------
  const W = size.w
  const H = size.h
  const far = (W + H) / view.scale

  const lineEnds = (l: ResolvedLine): [Vec, Vec] => {
    const u = norm(l.d)
    if (l.kind === 'segment') return [l.a, l.b]
    const centre = toWorld({ x: W / 2, y: H / 2 })
    // project the view centre onto the line so the drawn piece always covers the viewport
    const t0 = (centre.x - l.p.x) * u.x + (centre.y - l.p.y) * u.y
    if (l.kind === 'ray') return [l.p, add(l.p, mul(u, Math.max(0, t0) + far * 2))]
    const m = add(l.p, mul(u, t0))
    return [add(m, mul(u, -far * 2)), add(m, mul(u, far * 2))]
  }

  const fmtAngle = (rad: number) =>
    view.angleUnit === 'deg' ? `${formatNum((rad * 180) / Math.PI, 1)}°` : `${formatNum(rad / Math.PI, 3)}π`

  const gridEls = () => {
    const els: JSX.Element[] = []
    const tl = toWorld({ x: 0, y: 0 })
    const br = toWorld({ x: W, y: H })
    const step = view.scale >= 25 ? 1 : view.scale >= 10 ? 5 : 10
    if (view.grid) {
      for (let x = Math.ceil(tl.x / step) * step; x <= br.x; x += step) {
        const sx = toScreen({ x, y: 0 }).x
        els.push(<line key={'gx' + x} x1={sx} y1={0} x2={sx} y2={H} className="grid-line" />)
      }
      for (let y = Math.ceil(br.y / step) * step; y <= tl.y; y += step) {
        const sy = toScreen({ x: 0, y }).y
        els.push(<line key={'gy' + y} x1={0} y1={sy} x2={W} y2={sy} className="grid-line" />)
      }
    }
    if (view.axes) {
      const o = toScreen({ x: 0, y: 0 })
      els.push(<line key="ax" x1={0} y1={o.y} x2={W} y2={o.y} className="axis" markerEnd="url(#arrow)" />)
      els.push(<line key="ay" x1={o.x} y1={H} x2={o.x} y2={0} className="axis" markerEnd="url(#arrow)" />)
      const lstep = step * (view.scale < 35 && step === 1 ? 2 : 1)
      for (let x = Math.ceil(tl.x / lstep) * lstep; x <= br.x; x += lstep) {
        if (x === 0) continue
        const sx = toScreen({ x, y: 0 }).x
        els.push(<text key={'lx' + x} x={sx} y={o.y + 14} className="tick">{x}</text>)
      }
      for (let y = Math.ceil(br.y / lstep) * lstep; y <= tl.y; y += lstep) {
        if (y === 0) continue
        const sy = toScreen({ x: 0, y }).y
        els.push(<text key={'ly' + y} x={o.x - 6} y={sy + 4} className="tick" textAnchor="end">{y}</text>)
      }
      els.push(<text key="o" x={o.x - 6} y={o.y + 14} className="tick" textAnchor="end">O</text>)
      els.push(<text key="xl" x={W - 12} y={o.y - 8} className="tick">x</text>)
      els.push(<text key="yl" x={o.x + 8} y={12} className="tick">y</text>)
    }
    return els
  }

  const isSel = (id: string) => id === selected || id === hover || pending.some((p) => p.id === id)

  /** Dashed by choice, or because the solid it is on hides it (unless that was turned off for it). */
  const dashedNow = (o: LineObj) => !!o.dashed || (o.autoDash !== false && outOfSight.get(o.id) === true)

  /** The solid or figure whose corner or edge `o` is, and whether its corners are hidden. */
  const cornersOf = (o: GObj): { group: string; quiet: boolean } | null => {
    if ((o.type !== 'point' || o.corner == null) && (o.type !== 'path' || o.frame)) return null
    const group = o.group
    if (!group) return null
    const corners = scene.objects.filter((x): x is PointObj => x.type === 'point' && x.group === group && x.corner != null && !x.hidden)
    return corners.length ? { group, quiet: corners.every((x) => x.quiet) } : null
  }

  /** Between two corners of a solid: the real length, not the one seen on the plane. */
  const segmentLength = (id: string) => {
    const o = scene.objects.find((x) => x.id === id)
    return o && isLinear(o) && o.dep.kind === 'twoPoints' ? trueLength(scene.objects, resolved, o.dep.a, o.dep.b) : null
  }
  const brokenPath = (points: [number, number][], breaks: [number, number][]) =>
    (breaks.length ? withoutGaps(points, breaks) : [points]).map((run) => run.map(([x, y], i) => {
      const p = toScreen({ x, y })
      return `${i ? 'L' : 'M'}${p.x},${p.y}`
    }).join(' ')).join(' ')

  // where the measures of angles have gone so far, in this drawing of the board
  const angleLabels: Vec[] = []

  /**
   * A segment split into parts that show their lengths too (BD and DC on BC, after a perpendicular): as on paper, its
   * own length goes at the tip of a brace drawn over the whole of it, and the lengths of the parts sit between the
   * segment and the brace. Both on the side away from the rest of the figure. Asked for on 11 November 2026, when the
   * lengths fell on one another.
   */
  const measureSides = (() => {
    const brace = new Map<string, Vec>()
    const side = new Map<string, Vec>()
    const shown = scene.objects.flatMap((o) => {
      if (o.type !== 'segment' || !o.showLength || o.ghost || o.dep.kind !== 'twoPoints') return []
      const l = L(o.id)
      return l ? [{ o, l, ends: [o.dep.a, o.dep.b] }] : []
    })
    const along = (p: Vec, a: Vec, b: Vec) => {
      const ab = sub(b, a)
      const n2 = dot(ab, ab)
      if (n2 < 1e-12) return false
      const t = dot(sub(p, a), ab) / n2
      const off = Math.abs(ab.x * (p.y - a.y) - ab.y * (p.x - a.x)) / Math.sqrt(n2)
      return t > -1e-6 && t < 1 + 1e-6 && off < 1e-6 * Math.sqrt(n2) + 1e-9
    }
    for (const s of shown) {
      const parts = shown.filter((t) => t.o.id !== s.o.id && along(t.l.a, s.l.a, s.l.b) && along(t.l.b, s.l.a, s.l.b) && dist(t.l.a, t.l.b) < dist(s.l.a, s.l.b) - 1e-9)
      if (!parts.length) continue
      const [a, b] = [toScreen(s.l.a), toScreen(s.l.b)]
      let n = norm({ x: -(b.y - a.y), y: b.x - a.x })
      // the rest of the figure: points joined by a line to the segment or to its parts, off the segment
      const ends = new Set([...s.ends, ...parts.flatMap((t) => t.ends)])
      const others: Vec[] = []
      for (const o of scene.objects) {
        if (!isLinear(o) || o.dep.kind !== 'twoPoints') continue
        const [p, q] = [o.dep.a, o.dep.b]
        for (const [x, y] of [[p, q], [q, p]]) {
          const at = ends.has(x) ? P(y) : null
          if (at && !along(at, s.l.a, s.l.b)) others.push(toScreen(at))
        }
      }
      if (others.length) {
        const c = mul(others.reduce((m, v) => add(m, v), { x: 0, y: 0 }), 1 / others.length)
        if (dot(n, sub(c, a)) > 0) n = mul(n, -1)
      }
      brace.set(s.o.id, n)
      for (const t of parts) side.set(t.o.id, n)
    }
    return { brace, side }
  })()

  /** A curly brace over the segment from a to b (on the screen), on the side n; its tip is where the length goes. */
  const bracePath = (a: Vec, b: Vec, n: Vec, from: number, depth: number) => {
    const t = norm(sub(b, a))
    const q = depth / 2
    const m = mul(add(a, b), 0.5)
    const at = (p: Vec, up: number, on: number) => add(add(p, mul(n, from + up)), mul(t, on))
    const pt = (v: Vec) => `${v.x},${v.y}`
    return [
      `M${pt(at(a, 0, 0))}`,
      `Q${pt(at(a, q, 0))} ${pt(at(a, q, q))}`,
      `L${pt(at(m, q, -q))}`,
      `Q${pt(at(m, q, 0))} ${pt(at(m, depth, 0))}`,
      `Q${pt(at(m, q, 0))} ${pt(at(m, q, q))}`,
      `L${pt(at(b, q, -q))}`,
      `Q${pt(at(b, q, 0))} ${pt(at(b, 0, 0))}`,
    ].join(' ')
  }

  const renderObj = (o: GObj): JSX.Element | null => {
    const hl = isSel(o.id)
    switch (o.type) {
      case 'segment':
      case 'line':
      case 'ray': {
        const l = L(o.id)
        if (!l) return null
        const [a, b] = lineEnds(l).map(toScreen)
        if (o.ghost) return hl ? <line key={o.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="halo" /> : null
        const mid = toScreen(mul(add(l.a, l.b), 0.5))
        const n = norm({ x: -(b.y - a.y), y: b.x - a.x })
        return (
          <g key={o.id}>
            {hl && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="halo" />}
            {gaps.has(o.id)
              ? <path d={brokenPath([[l.a.x, l.a.y], [l.b.x, l.b.y]], gaps.get(o.id)!)} stroke={o.color} strokeWidth={o.width} fill="none" strokeDasharray={dashedNow(o) ? '6 5' : undefined} strokeLinecap="round" />
              : <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={o.color} strokeWidth={o.width} strokeDasharray={dashedNow(o) ? '6 5' : undefined} strokeLinecap="round" />}
            {o.type === 'segment' && o.showLength && (() => {
              const value = formatNum(segmentLength(o.id) ?? dist(l.a, l.b))
              const up = measureSides.brace.get(o.id)
              // a brace needs room: on a very short segment the length just goes further out
              if (up && dist(a, b) > 30) {
                const tip = add(mid, mul(up, 26 + 10 + 13))
                return (
                  <>
                    <path d={bracePath(a, b, up, 26, 10)} stroke={o.color} strokeWidth={1.2} fill="none" />
                    <text x={tip.x} y={tip.y + 4} className="measure" fill={o.color} textAnchor="middle">{value}</text>
                  </>
                )
              }
              const side = up ?? measureSides.side.get(o.id) ?? n
              const k = up ? 40 : 14
              return <text x={mid.x + side.x * k} y={mid.y + side.y * k + (measureSides.side.has(o.id) ? 4 : 0)} className="measure" fill={o.color} textAnchor="middle">{value}</text>
            })()}
          </g>
        )
      }
      case 'circle': {
        const c = P(o.center)
        const t = P(o.through)
        if (!c || !t) return null
        const sc = toScreen(c)
        const r = dist(c, t) * view.scale
        return (
          <g key={o.id}>
            {hl && <circle cx={sc.x} cy={sc.y} r={r} className="halo" fill="none" />}
            <circle cx={sc.x} cy={sc.y} r={r} stroke={o.color} strokeWidth={o.width} fill="none" />
            {o.showRadius && (
              <text x={sc.x + 6} y={sc.y - r - 6} className="measure" fill={o.color}>r = {formatNum(dist(c, t))}</text>
            )}
          </g>
        )
      }
      case 'arc': {
        const c = P(o.center)
        const t = P(o.through)
        const to = P(o.to)
        if (!c || !t || !to) return null
        const d = arcPath(c, t, to)
        const sc = toScreen(c)
        const sweep = angleCCW(t, c, to)
        const mid = toScreen(rotate(t, c, sweep / 2))
        // the measure of the arc: inside, on the line from the center to the middle of the arc
        const r = dist(sc, mid)
        const along = r > 0 ? Math.min(Math.max(26, r * 0.45), Math.max(r - 12, r / 2)) / r : 0
        const deg = { x: sc.x + (mid.x - sc.x) * along, y: sc.y + (mid.y - sc.y) * along }
        return (
          <g key={o.id}>
            {o.filled && <path d={`M ${sc.x} ${sc.y} L ${d.slice(2)} Z`} fill={o.color + '22'} stroke="none" />}
            {hl && <path d={d} className="halo" fill="none" />}
            <path d={d} stroke={o.color} strokeWidth={o.width} fill="none" />
            {o.showRadius && <text x={mid.x + 6} y={mid.y - 6} className="measure" fill={o.color}>r = {formatNum(dist(c, t))}</text>}
            {o.showMeasure && <text x={deg.x} y={deg.y + 4} textAnchor="middle" className="measure arc-degrees" fill={o.color}>{fmtAngle(sweep)}</text>}
          </g>
        )
      }
      case 'polygon': {
        const pts = o.points.map(P)
        if (!pts.every(Boolean)) return null
        const d = (pts as Vec[]).map(toScreen).map((p) => `${p.x},${p.y}`).join(' ')
        return (
          <g key={o.id}>
            {hl && <polygon points={d} className="halo" fill="none" />}
            <polygon points={d} stroke={o.color} strokeWidth={o.width} fill={o.fill} strokeLinejoin="round" />
          </g>
        )
      }
      case 'angle':
      case 'lineAngle': {
        const g = o.type === 'angle' ? { a: P(o.a), v: P(o.v), b: P(o.b) } : lineAngleGeo(o)
        if (!g) return null
        const { a, v, b } = g
        if (!a || !v || !b) return null
        let from = a
        let sweep = angleCCW(a, v, b)
        if (sweep > Math.PI) {
          from = b
          sweep = Math.PI * 2 - sweep
        }
        const t0 = Math.atan2(from.y - v.y, from.x - v.x)
        // on a solid: the real angle, not the one seen on the plane
        const value = (o.type === 'angle' ? trueAngleAt(scene.objects, resolved, o.a, o.v, o.b) : trueLineAngle(scene.objects, resolved, o.l1, o.s1, o.l2, o.s2)) ?? angleAt(a, v, b)
        const sv = toScreen(v)
        const R = 28
        const isRight = o.rightMark && Math.abs(value - Math.PI / 2) < 1e-4
        const mid = t0 + sweep / 2
        let label = { x: sv.x + Math.cos(mid) * (R + 20), y: sv.y - Math.sin(mid) * (R + 20) }
        // too narrow to hold its measure: it goes next to the side, not over it
        if (sweep < Math.PI / 12) {
          const side = t0 + sweep
          let n = { x: -Math.sin(side), y: -Math.cos(side) }
          if (sweep < 1e-6 && n.y > 0) n = mul(n, -1)
          const gap = 12 + 8 * Math.abs(n.x)
          label = {
            x: sv.x + Math.cos(side) * (R + 10) + n.x * gap,
            y: sv.y - Math.sin(side) * (R + 10) + n.y * gap,
          }
        }
        if (o.showValue) {
          // measures that would land on one another: the later one moves away from the vertex, along its own direction
          const away = norm(sub(label, sv))
          const taken = (at: Vec) => angleLabels.some((q) => Math.abs(q.x - at.x) < 46 && Math.abs(q.y - at.y) < 17)
          for (let i = 0; i < 12 && taken(label); i++) label = add(label, mul(away, 16))
          angleLabels.push(label)
        }
        let shape: JSX.Element
        if (isRight) {
          const r = R * 0.6
          const u1 = { x: Math.cos(t0), y: -Math.sin(t0) }
          const u2 = { x: Math.cos(t0 + sweep), y: -Math.sin(t0 + sweep) }
          const p1 = add(sv, mul(u1, r))
          const p3 = add(sv, mul(u2, r))
          const p2 = add(p1, mul(u2, r))
          shape = <path d={`M${p1.x},${p1.y} L${p2.x},${p2.y} L${p3.x},${p3.y}`} stroke={o.color} fill="none" strokeWidth={1.6} />
        } else {
          const steps = 32
          let d = `M${sv.x},${sv.y}`
          for (let i = 0; i <= steps; i++) {
            const t = t0 + (sweep * i) / steps
            d += ` L${sv.x + Math.cos(t) * R},${sv.y - Math.sin(t) * R}`
          }
          shape = <path d={d + ' Z'} stroke={o.color} fill={o.color + '26'} strokeWidth={1.6} />
        }
        return (
          <g key={o.id}>
            {hl && <circle cx={sv.x} cy={sv.y} r={R} className="halo" fill="none" />}
            {shape}
            {o.showValue && (
              <text x={label.x} y={label.y + 4} className="measure" fill={o.color} textAnchor="middle">{fmtAngle(value)}</text>
            )}
          </g>
        )
      }
      case 'text': {
        const p = toScreen(o)
        return (
          <g key={o.id}>
            {hl && <rect x={p.x - 4} y={p.y - o.size - 4} width={Math.max(40, o.text.length * o.size * 0.55)} height={o.size + 10} className="halo-box" />}
            <foreignObject x={p.x} y={p.y - o.size - 2} width={Math.max(60, o.text.length * o.size)} height={o.size * 2.4}>
              <div className="board-text" style={{ color: o.color, fontSize: o.size }} dangerouslySetInnerHTML={{ __html: inlineMath(o.text) }} />
            </foreignObject>
          </g>
        )
      }
      case 'path': {
        if (o.frame) return null
        const d = brokenPath(o.points, [])
        return (
          <g key={o.id}>
            {hl && <path d={d} className="halo" fill="none" />}
            <path d={gaps.has(o.id) ? brokenPath(o.points, gaps.get(o.id)!) : d} stroke={o.color} strokeWidth={o.width} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={o.dashed ? '6 5' : undefined} />
          </g>
        )
      }
      case 'function':
        return <FunctionPlot key={o.id} o={o} hl={hl} toScreen={toScreen} toWorld={toWorld} W={W} H={H} />
      default:
        return null
    }
  }

  /** The corners in the lower half of a solid or a figure have their letter under them; the others keep the usual place. */
  const inLowerHalf = (o: PointObj, p: Vec) => {
    const ys = scene.objects.flatMap((x) => (x.type === 'point' && x.group === o.group && !x.hidden ? [P(x.id)?.y ?? x.y] : []))
    return p.y < (Math.min(...ys) + Math.max(...ys)) / 2 - 1e-9
  }

  /** A corner on the left edge of its figure or solid, below its top: a letter up and to the right would sit on a side. */
  const onLeftEdge = (o: PointObj, p: Vec) => {
    const pts = scene.objects.flatMap((x) => (x.type === 'point' && x.group === o.group && !x.hidden ? [P(x.id) ?? x] : []))
    const xs = pts.map((q) => q.x)
    const ys = pts.map((q) => q.y)
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    return x1 - x0 > 1e-9 && p.x < x0 + 0.2 * (x1 - x0) && p.y <= y1 - 0.2 * (y1 - y0) + 1e-9
  }

  const renderPoint = (o: PointObj) => {
    if (o.hidden) return null
    // a hidden corner shows, faintly, only under the cursor or when chosen, and never in an export
    const quiet = !!o.quiet
    if (quiet && !isSel(o.id)) return null
    const p = P(o.id)
    if (!p) return null
    const s = toScreen(p)
    // filled = can be dragged (free, or sliding on a line / circle); hollow = fully determined by the construction
    const free = o.dep.kind === 'free' || o.dep.kind === 'onLine' || o.dep.kind === 'onCircle'
    // the vertex of angles has its letter outside all of them, in the widest opening left between their sides
    const rays = scene.objects.flatMap((x) => (x.type === 'angle' && x.v === o.id ? [P(x.a), P(x.b)] : []))
      .filter((r): r is Vec => !!r)
    const away = rays.length ? labelDirection(p, rays) : null
    let out: Vec | null = null
    // on the screen, y points down
    if (away) out = { x: away.x, y: -away.y }
    else if (o.group && o.corner != null && inLowerHalf(o, p)) out = { x: 0, y: 1 }
    else if (o.group && o.corner != null && !o.rim && !o.ball && onLeftEdge(o, p)) out = { x: -1.1, y: 0 }
    return (
      <g key={o.id} {...(quiet ? { 'data-ui': true, opacity: 0.45 } : {})}>
        {isSel(o.id) && <circle cx={s.x} cy={s.y} r={9} className="halo-pt" />}
        <circle cx={s.x} cy={s.y} r={free ? 4.5 : 3.5} fill={free ? o.color : '#fff'} stroke={o.color} strokeWidth={free ? 1 : 2} />
        {out
          ? <text x={s.x + out.x * 15} y={s.y + out.y * 15 + 5} textAnchor="middle" className="pt-label" fill={o.color}>{o.label}</text>
          : <text x={s.x + 7} y={s.y - 8} className="pt-label" fill={o.color}>{o.label}</text>}
      </g>
    )
  }

  /** SVG path of an arc, starting with "M x y". On screen y points down, but so does the turn: counter-clockwise stays so. */
  const arcPath = (c: Vec, t: Vec, to: Vec) => {
    const s = toScreen(t)
    const e = toScreen(arcEnd(c, t, to))
    const r = dist(c, t) * view.scale
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${angleCCW(t, c, to) > Math.PI ? 1 : 0} 0 ${e.x} ${e.y}`
  }

  const preview = () => {
    if (!mouse || !pending.length) return null
    // the point is not joined to the cursor: the perpendicular has a preview of its own, the parallel needs none
    if (tool === 'perpendicular' || tool === 'parallel') return null
    const last = pending[pending.length - 1]
    if (last.kind !== 'point') return null
    const a = P(last.id)
    if (!a) return null
    const sa = toScreen(a)
    const sm = toScreen(ghost?.pos ?? snap(mouse))
    if ((tool === 'arc' || tool === 'sector') && pending.length === 2) {
      const c = P(pending[0].id)
      if (!c || !ghost) return null
      const d = arcPath(c, a, ghost.pos)
      const sc = toScreen(c)
      return <path data-ui d={tool === 'sector' ? `M ${sc.x} ${sc.y} L ${d.slice(2)} Z` : d} className="preview" fill="none" />
    }
    if (tool === 'circle' || tool === 'arc' || tool === 'sector')
      return <circle data-ui cx={sa.x} cy={sa.y} r={dist(sa, sm)} className="preview" fill="none" />
    return <line data-ui x1={sa.x} y1={sa.y} x2={sm.x} y2={sm.y} className="preview" />
  }

  /** The point-to-be: a soft dot where it will land, and the line / circle it will stick to. */
  const ghostEls = () => {
    if (!ghost || !mouse) return null
    const g = toScreen(ghost.pos)
    return (
      <g data-ui className="ghost">
        {(ghost.on ?? []).map((id) => {
          const l = L(id)
          if (l) {
            const [a, b] = lineEnds(l).map(toScreen)
            return <line key={id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="snap-halo" />
          }
          const c = scene.objects.find((o) => o.id === id)
          if (c?.type === 'circle') {
            const cc = P(c.center)
            const t = P(c.through)
            if (cc && t) return <circle key={id} cx={toScreen(cc).x} cy={toScreen(cc).y} r={dist(cc, t) * view.scale} className="snap-halo" fill="none" />
          }
          if (c?.type === 'arc') {
            const cc = P(c.center)
            const t = P(c.through)
            const to = P(c.to)
            if (cc && t && to) return <path key={id} d={arcPath(cc, t, to)} className="snap-halo" fill="none" />
          }
          return null
        })}
        <circle cx={g.x} cy={g.y} r={ghost.existing ? 9 : 5} className={ghost.existing ? 'ghost-existing' : 'ghost-pt'} />
        {ghost.deg != null && <text x={g.x + 12} y={g.y - 12} className="measure arc-degrees">{formatNum(ghost.deg, 1)}°</text>}
      </g>
    )
  }

  const sel = scene.objects.find((o) => o.id === selected)
  const toolInfo = TOOLS.find((t) => t.id === tool)!
  const hint = toolInfo.hint[Math.min(pending.length, toolInfo.hint.length - 1)]

  const toolbar = !readOnly && (
      <div className="board-toolbar">
        {sheet && <span className="muted">Construcții:</span>}
        {TOOLS.filter((t) => t.id !== 'solid' && (!sheet || t.id !== 'pan')).map((t) => (
          <button
            key={t.id}
            className={'tool' + (tool === t.id && (!sheet || sheet.active) ? ' active' : '') + (t.id === 'move' || t.id === 'pan' ? ' wide labeled' : '')}
            title={t.id === 'move' ? 'Cursor (Esc)' : t.id === 'pan' ? 'Mută tabla (sau: click dreapta / Space + trage)' : t.label}
            onClick={() => { changeTool(t.id); sheet?.onActivate() }}
          >
            <ToolIcon name={t.id} />
            {(t.id === 'move' || t.id === 'pan') && <span>{t.label}</span>}
          </button>
        ))}
        <button className="tool" title="Graficul unei funcții f(x)" onClick={() => { sheet?.onActivate(); addFunction() }}><ToolIcon name="function" /></button>
        <span className="sep" />
        {COLORS.map((c) => (
          <button key={c} className={'swatch' + (color === c ? ' active' : '')} style={{ background: c }} title="Culoare" onClick={() => setColor(c)} />
        ))}
        <span className="sep" />
        {!sheet && <>
          <button className="tool" title="Anulează (Ctrl+Z)" onClick={undo} disabled={!past.length}>↶</button>
          <button className="tool" title="Refă (Ctrl+Y)" onClick={redo} disabled={!future.length}>↷</button>
          <span className="sep" />
          <label className="chk"><input type="checkbox" checked={view.grid} onChange={(e) => setView({ grid: e.target.checked })} /> Grilă</label>
        </>}
        <label className="chk"><input type="checkbox" checked={view.axes} onChange={(e) => setView({ axes: e.target.checked })} /> Axe</label>
        <label className="chk"><input type="checkbox" checked={view.snap} onChange={(e) => setView({ snap: e.target.checked })} /> Aliniere</label>
        <select value={view.angleUnit} onChange={(e) => setView({ angleUnit: e.target.value as 'deg' | 'rad' })} title="Unitatea unghiurilor">
          <option value="deg">grade</option>
          <option value="rad">radiani</option>
        </select>
        {!sheet && <>
          <span className="sep" />
          <button className="tool wide" onClick={() => setView({ cx: 0, cy: 0, scale: 40 })} title="Centrează">⌖</button>
          <button className="tool wide" onClick={exportPng} title="Exportă PNG">PNG</button>
          <button className="tool wide" onClick={exportSvg} title="Exportă SVG">SVG</button>
          <button className="tool wide danger" title="Golește tabla" onClick={() => scene.objects.length && commit(emptyScene().objects)}>Golește</button>
        </>}
      </div>
  )

  return (
    <div className={'board' + (readOnly ? ' readonly' : '') + (sheet ? ' sheet' : '')} tabIndex={-1}>
      {sheet ? sheet.toolbar && createPortal(toolbar, sheet.toolbar) : toolbar}
      {!readOnly && !sheet && (
        <div className="board-toolbar notebook-toolbar shapes-bar">
          <span className="muted">Corpuri:</span>
          {SOLIDS.map((f) => (
            <button
              key={f.id}
              className={'btn small icon' + (tool === 'solid' && solid === f.id ? ' active' : '')}
              title={f.label + ': trage cu mouse-ul de la un colț la cel opus'}
              aria-label={f.label}
              onClick={() => { setSolid(f.id); changeTool('solid') }}
            >
              <SolidIcon solid={f.id} />
            </button>
          ))}
        </div>
      )}
      {instruments && !readOnly && <InstrumentsBar inst={inst} />}

      <div className="board-body">
        <div className="board-canvas" ref={wrapRef} style={{ height }}>
          <svg
            ref={svgRef}
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            onPointerDown={readOnly ? undefined : onPointerDown}
            onPointerMove={readOnly ? undefined : onPointerMove}
            onPointerUp={readOnly ? undefined : onPointerUp}
            onPointerLeave={() => { setMouse(null); inst.setHover(null) }}
            onWheel={readOnly || sheet ? undefined : onWheel}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              cursor: panning ? 'grabbing'
                : spaceHeld || tool === 'pan' ? 'grab'
                : inst.hover === 'body' ? 'move'
                : inst.hover === 'knob' || inst.hover === 'radius' || inst.hover === 'pencil' ? 'grab'
                : tool === 'move' ? (hoverHandle === 'scale' ? 'nwse-resize' : hoverHandle === 'rotate' ? 'alias' : hoverHandle === 'orbit' ? 'grab' : hover ? 'move' : sheet ? 'default' : 'grab')
                : 'crosshair',
              touchAction: 'none',
            }}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
              </marker>
            </defs>
            {!sheet && <rect width={W} height={H} fill="#fff" />}
            {gridEls()}
            {scene.objects.filter((o) => o.type === 'polygon').map(renderObj)}
            {scene.objects.filter((o) => o.type !== 'polygon' && o.type !== 'point').map(renderObj)}
            {preview()}
            {solidDrag && solidLines(solid, solidDrag.from.x, solidDrag.from.y, solidDrag.to.x, solidDrag.to.y, true).map((l, i) => (
              <polyline
                key={i}
                points={l.points.map(([x, y]) => { const p = toScreen({ x, y }); return p.x + ',' + p.y }).join(' ')}
                stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l.hidden ? '6 5' : undefined}
              />
            ))}
            {ghostEls()}
            {tool !== 'perpendicular' && tool !== 'parallel' && pending.map((p) => {
              // a side picked but not yet on the board: it is lit up all the same
              if (p.side?.dep.kind !== 'twoPoints') return null
              const [a, b] = [P(p.side.dep.a), P(p.side.dep.b)]
              if (!a || !b) return null
              const [sa, sb] = [toScreen(a), toScreen(b)]
              return <line key={p.side.id} data-ui pointerEvents="none" x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y} className="halo" />
            })}
            {throughGhost && (tool === 'perpendicular' || tool === 'parallel') && pending.length > 0 && (() => {
              const g = throughGhost
              const shown = g.shown?.map(toScreen)
              const halo = shown && <line x1={shown[0].x} y1={shown[0].y} x2={shown[1].x} y2={shown[1].y} className="halo" />
              const dashes = { stroke: color, strokeDasharray: '6 5', opacity: 0.6 }
              if (tool === 'parallel') {
                // it would be a line, unless a length is asked for: shown across the whole board
                const u = mul(norm(sub(g.b, g.a)), far)
                const [p, q] = [add(g.from, u), sub(g.from, u)].map(toScreen)
                return (
                  <g data-ui pointerEvents="none">
                    {halo}
                    <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} strokeWidth={2} {...dashes} />
                  </g>
                )
              }
              const [from, foot] = [g.from, g.foot].map(toScreen)
              const end = toScreen(g.along > 1 ? g.b : g.a)
              return (
                <g data-ui pointerEvents="none">
                  {halo}
                  {(g.along < 0 || g.along > 1) && <line x1={end.x} y1={end.y} x2={foot.x} y2={foot.y} strokeWidth={1.5} {...dashes} />}
                  <line x1={from.x} y1={from.y} x2={foot.x} y2={foot.y} strokeWidth={2} {...dashes} />
                  <circle cx={foot.x} cy={foot.y} r={5} className="ghost-pt" />
                </g>
              )
            })()}
            {scene.objects.filter((o): o is PointObj => o.type === 'point').map(renderPoint)}
            {instruments && !readOnly && (
              <g data-ui transform={`translate(${size.w / 2 - view.cx * PX_PER_CM * instScale} ${size.h / 2 + view.cy * PX_PER_CM * instScale}) scale(${instScale})`}>
                <InstrumentsLayer tools={instTools} bounds={{ x0: planeX, y0: planeY, w: size.w / instScale, h: size.h / instScale }} />
                {inst.hint && <text className="nb-hint" x={inst.hint.x} y={inst.hint.y}>{inst.hint.text}</text>}
              </g>
            )}
            {!readOnly && tool === 'move' && figure && pivot && (() => {
              const box = selectionBox()!
              const pv = toScreen(pivot)
              return (
                <g data-ui className="selection">
                  <rect x={box.x0} y={box.y0} width={box.x1 - box.x0} height={box.y1 - box.y0} className="sel-box" />
                  <line x1={box.rot.x} y1={box.rot.y + 6} x2={box.rot.x} y2={box.y0} className="sel-box" />
                  <circle cx={box.rot.x} cy={box.rot.y} r={7} className="sel-rotate"><title>Trage pentru a roti (Shift = pași de 15°)</title></circle>
                  {box.corners.map((c, i) => (
                    <rect key={i} x={c.x - 5} y={c.y - 5} width={10} height={10} className="sel-scale"><title>Trage pentru a mări / micșora</title></rect>
                  ))}
                  <g className="sel-pivot">
                    <circle cx={pv.x} cy={pv.y} r={6} />
                    <line x1={pv.x - 10} y1={pv.y} x2={pv.x + 10} y2={pv.y} />
                    <line x1={pv.x} y1={pv.y - 10} x2={pv.x} y2={pv.y + 10} />
                  </g>
                  {figure.holder && (
                    <>
                      <line x1={box.orbit.x} y1={box.y1} x2={box.orbit.x} y2={box.orbit.y - 11} className="sel-box" />
                      <circle cx={box.orbit.x} cy={box.orbit.y} r={11} className="sel-rotate"><title>Trage pentru a roti corpul în spațiu</title></circle>
                      <text x={box.orbit.x} y={box.orbit.y + 4} textAnchor="middle" className="measure sel-label" style={{ pointerEvents: 'none' }}>3D</text>
                    </>
                  )}
                  {xformLabel && <text x={box.rot.x + 14} y={box.rot.y + 4} className="measure sel-label">{xformLabel}</text>}
                </g>
              )
            })()}
          </svg>
          {!readOnly && (!sheet || sheet.active) && <div className="board-status">
            <b>{toolInfo.label}:</b> {flashMsg ? <span className="flash">{flashMsg}</span> : hint}
            {tool !== 'move' && tool !== 'pan' && <span className="muted">· Esc = cursor{!sheet && ' · click dreapta + trage = mută tabla'}</span>}
            {mouse && (!sheet || view.axes) && <span className="coords">({formatNum(mouse.x)}, {formatNum(mouse.y)})</span>}
          </div>}
        </div>

        {sel && !readOnly && <Inspector o={sel} scene={scene} figureTools={figure && pivot ? {
          pivots: [{ id: 'center', label: 'centrul figurii' }, ...figure.vertices.map((p) => ({ id: p.id, label: `vârful ${p.label}` }))],
          pivot: pivotId,
          setPivot: setPivotId,
          rotate: rotateFigure,
          scale: scaleFigure,
          solid: figure.holder?.frame && {
            yaw: figure.holder.frame.yaw,
            pitch: figure.holder.frame.pitch,
            begin: remember,
            turn: (yaw, pitch) => orbitSolid(figure.holder!.id, yaw, pitch),
            reset: () => {
              remember()
              orbitSolid(figure.holder!.id, ...defaultView(figure.holder!.frame!.solid))
            },
            cut: figure.holder.frame.cut,
            setCut: (cut) => cutSolid(figure.holder!.id, cut),
          },
        } : undefined} resolvedLen={(id) => {
          const l = L(id)
          return l ? segmentLength(id) ?? dist(l.a, l.b) : null
        }} onSolid={outOfSight.get(sel.id)} corners={cornersOf(sel) && {
          solid: !!sceneRef.current.objects.find((x) => x.type === 'point' && x.group === cornersOf(sel)!.group && x.at3),
          quiet: cornersOf(sel)!.quiet,
          set: (quiet) => commit(sceneRef.current.objects.map((x) =>
            x.type === 'point' && x.group === cornersOf(sel)!.group && x.corner != null && !x.hidden ? { ...x, quiet: quiet || undefined } : x)),
        }} onPatch={(p) => updateObj(sel.id, p)} onDelete={() => {
          removeObj(sel.id)
          setSelected(null)
        }} />}
      </div>
      {dialog}
    </div>
  )
}

/** Zoom/pan so every point and text fits the canvas (used for thumbnails). */
function fitView(scene: Scene, points: Map<string, Vec | null>, size: { w: number; h: number }): Scene['view'] {
  const xs: number[] = []
  const ys: number[] = []
  const push = (x: number, y: number) => {
    xs.push(x)
    ys.push(y)
  }
  for (const o of scene.objects) {
    if (o.type === 'point') {
      const p = points.get(o.id)
      if (p) push(p.x, p.y)
    } else if (o.type === 'text') push(o.x, o.y)
    else if (o.type === 'path') { if (!o.frame) for (const [x, y] of o.points) push(x, y) }
    else if (o.type === 'circle') {
      const c = points.get(o.center)
      const t = points.get(o.through)
      if (c && t) {
        const r = dist(c, t)
        push(c.x - r, c.y - r)
        push(c.x + r, c.y + r)
      }
    } else if (o.type === 'arc') {
      const c = points.get(o.center)
      const t = points.get(o.through)
      const to = points.get(o.to)
      if (c && t && to) for (const q of arcBounds(c, t, to)) push(q.x, q.y)
    }
  }
  if (!xs.length) return { ...scene.view, scale: Math.min(scene.view.scale, 20) }
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const scale = Math.min(80, (size.w - 40) / Math.max(maxX - minX, 1), (size.h - 40) / Math.max(maxY - minY, 1))
  return { ...scene.view, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, scale }
}

function insidePolygon(p: Vec, pts: Vec[]) {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i]
    const b = pts[j]
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}

/** Render text with $...$ segments as KaTeX, the rest escaped. */
export function inlineMath(text: string) {
  return text
    .split(/(\$[^$]+\$)/g)
    .map((part) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        try {
          return katex.renderToString(part.slice(1, -1), { throwOnError: false })
        } catch {
          return part
        }
      }
      return part.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)
    })
    .join('')
}

function FunctionPlot({ o, hl, toScreen, toWorld, W, H }: {
  o: FunctionObj
  hl: boolean
  toScreen: (p: Vec) => Vec
  toWorld: (s: Vec) => Vec
  W: number
  H: number
}) {
  const d = useMemo(() => {
    let f: EvalFunction
    try {
      f = compile(o.expr)
    } catch {
      return ''
    }
    let path = ''
    let prev: Vec | null = null
    for (let sx = 0; sx <= W; sx += 2) {
      const x = toWorld({ x: sx, y: 0 }).x
      let y: unknown
      try {
        y = f.evaluate({ x })
      } catch {
        y = NaN
      }
      if (typeof y !== 'number' || !isFinite(y)) {
        prev = null
        continue
      }
      const s = toScreen({ x, y })
      // break the curve at asymptotes (e.g. tan) instead of drawing a vertical line
      if (prev && Math.abs(s.y - prev.y) < H * 2 && !(Math.abs(s.y - prev.y) > H && Math.sign(s.y - H / 2) !== Math.sign(prev.y - H / 2)))
        path += ` L${sx},${s.y}`
      else path += ` M${sx},${s.y}`
      prev = s
    }
    return path
  }, [o.expr, toScreen, toWorld, W, H])
  const lbl = toScreen({ x: toWorld({ x: W - 90, y: 0 }).x, y: 0 })
  return (
    <g>
      {hl && <path d={d} className="halo" fill="none" />}
      <path d={d} stroke={o.color} strokeWidth={o.width} fill="none" />
      <text x={lbl.x} y={18} className="measure" fill={o.color}>f(x) = {o.expr}</text>
    </g>
  )
}

interface FigureTools {
  pivots: { id: string; label: string }[]
  pivot: string
  setPivot: (id: string) => void
  rotate: (deg: number) => void
  scale: (k: number) => void
  /** only for a solid: how it is seen */
  solid?: {
    yaw: number; pitch: number; begin: () => void; turn: (yaw: number, pitch: number) => void; reset: () => void
    /** the plane parallel to the base, from 0 (base) to 1 (top), if the body is cut */
    cut?: number
    setCut: (cut: number | null) => void
  }
}

/** Exact rotation / scaling of the whole selected figure, around the chosen pivot. */
function FigurePanel({ t }: { t: FigureTools }) {
  const [deg, setDeg] = useState('90')
  const [k, setK] = useState('2')
  const num = (s: string) => Number(s.replace(',', '.'))
  return (
    <div className="insp-figure">
      <div className="insp-sub">Toată figura</div>
      <div className="insp-note">Trage de interior sau de o latură ca s-o muți; colțurile chenarului o măresc, cercul de sus o rotește.</div>
      <label className="insp-row">În jurul
        <select value={t.pivot} onChange={(e) => t.setPivot(e.target.value)}>
          {t.pivots.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </label>
      <div className="insp-row">
        <input type="text" inputMode="decimal" value={deg} onChange={(e) => setDeg(e.target.value)} style={{ width: 56 }} />°
        <button className="btn small" onClick={() => isFinite(num(deg)) && t.rotate(num(deg))} title="Rotește în sens trigonometric (invers acelor de ceasornic)">↺ Rotește</button>
        <button className="btn small" onClick={() => isFinite(num(deg)) && t.rotate(-num(deg))} title="Rotește în sensul acelor de ceasornic">↻</button>
      </div>
      <div className="insp-row">
        ×<input type="text" inputMode="decimal" value={k} onChange={(e) => setK(e.target.value)} style={{ width: 56 }} />
        <button className="btn small" onClick={() => num(k) > 0 && t.scale(num(k))}>Scalează</button>
      </div>
      {t.solid && (
        <>
          <div className="insp-sub">Rotire în spațiu</div>
          <label className="insp-row">Orizontal {t.solid.yaw}°
            <input type="range" min={-180} max={180} value={t.solid.yaw} onPointerDown={t.solid.begin} onChange={(e) => t.solid!.turn(Number(e.target.value), t.solid!.pitch)} />
          </label>
          <label className="insp-row">Vertical {t.solid.pitch}°
            <input type="range" min={-90} max={90} value={t.solid.pitch} onPointerDown={t.solid.begin} onChange={(e) => t.solid!.turn(t.solid!.yaw, Number(e.target.value))} />
          </label>
          <button className="btn small" onClick={t.solid.reset}>Vederea inițială</button>
          <div className="insp-sub">Secțiune paralelă cu baza</div>
          {t.solid.cut == null
            ? <button className="btn small" onClick={() => { t.solid!.begin(); t.solid!.setCut(0.5) }} title="Taie corpul cu un plan paralel cu baza; colțurile secțiunii primesc litere">Secționează</button>
            : <>
              <label className="insp-row">La {Math.round(t.solid.cut * 100)}% din înălțime, de la bază
                <input type="range" min={1} max={99} value={Math.round(t.solid.cut * 100)} onPointerDown={t.solid.begin} onChange={(e) => t.solid!.setCut(Number(e.target.value) / 100)} />
              </label>
              <div className="insp-row">
                {[[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]].map(([p, q]) => (
                  <button key={p + '/' + q} className="btn small" onClick={() => { t.solid!.begin(); t.solid!.setCut(p / q) }} title={`La ${p}/${q} din înălțime, de la bază`}>{p}/{q}</button>
                ))}
              </div>
              <button className="btn small" onClick={() => { t.solid!.begin(); t.solid!.setCut(null) }} title="Scoate secțiunea, cu punctele ei și ce e construit pe ele">Scoate secțiunea</button>
            </>}
        </>
      )}
    </div>
  )
}

function Inspector({ o, scene, onPatch, onDelete, resolvedLen, figureTools, corners, onSolid }: {
  /** for a segment on a solid: whether the solid hides it now; undefined elsewhere */
  onSolid?: boolean
  o: GObj
  scene: Scene
  onPatch: (p: Partial<GObj>) => void
  onDelete: () => void
  resolvedLen: (id: string) => number | null
  figureTools?: FigureTools
  /** the corners of the solid or figure that `o` belongs to: shown, or hidden for a drawing that is only an illustration */
  corners?: { solid: boolean; quiet: boolean; set: (quiet: boolean) => void } | null
}) {
  const names: Record<GObj['type'], string> = {
    point: 'Punct', segment: 'Segment', line: 'Dreaptă', ray: 'Semidreaptă', circle: 'Cerc', arc: 'Arc de cerc',
    polygon: 'Poligon', angle: 'Unghi', lineAngle: 'Unghi între linii', text: 'Text', path: 'Desen liber', function: 'Funcție',
  }
  const label = (id: string) => (scene.objects.find((x) => x.id === id) as PointObj | undefined)?.label ?? '?'
  let title = names[o.type]
  if (o.type === 'path' && o.group) title = 'Muchie de corp'
  if (o.type === 'point') title += ' ' + o.label
  if (isLinear(o) && o.dep.kind === 'twoPoints') title += ` ${label(o.dep.a)}${label(o.dep.b)}`
  if (o.type === 'angle') title += ` ∠${label(o.a)}${label(o.v)}${label(o.b)}`
  if (o.type === 'polygon') title += ' ' + o.points.map(label).join('')
  if (o.type === 'arc') title = `${o.sector ? 'Sector de cerc' : 'Arc de cerc'}, centrul ${label(o.center)}`

  return (
    <div className="inspector">
      {figureTools && <FigurePanel t={figureTools} />}
      <div className="insp-title">{title}</div>
      {corners && (
        <label className="insp-row chk" title="Pentru un desen făcut doar ca ilustrație. Punctele ascunse se văd din nou sub cursor, ca să poți debifa.">
          <input type="checkbox" checked={corners.quiet} onChange={(e) => corners.set(e.target.checked)} />
          Ascunde punctele și literele {corners.solid ? 'corpului' : 'figurii'}
        </label>
      )}
      <div className="insp-row">
        <span>Culoare</span>
        <div className="insp-colors">
          {COLORS.map((c) => (
            <button key={c} className={'swatch' + (('color' in o && o.color === c) ? ' active' : '')} style={{ background: c }}
              onClick={() => onPatch(o.type === 'polygon' ? { color: c, fill: c + '22' } : { color: c })} />
          ))}
        </div>
      </div>
      {o.type === 'point' && (
        <>
          <label className="insp-row">Etichetă <input value={o.label} onChange={(e) => onPatch({ label: e.target.value })} /></label>
          {o.dep.kind === 'free' && (
            <div className="insp-row">
              <span>Coordonate</span>
              <input type="number" step="0.5" value={o.x} onChange={(e) => onPatch({ x: Number(e.target.value) })} />
              <input type="number" step="0.5" value={o.y} onChange={(e) => onPatch({ y: Number(e.target.value) })} />
            </div>
          )}
          {o.dep.kind === 'rotate' && (
            <label className="insp-row">Unghi (°)
              <input type="number" value={o.dep.deg} onChange={(e) => onPatch({ dep: { ...o.dep, deg: Number(e.target.value) } as PointObj['dep'] })} />
            </label>
          )}
          {o.dep.kind === 'bisectorPoint' && (
            <label className="insp-row">Lungimea bisectoarei
              <input type="number" min={0} step={0.5} value={o.dep.dist} onChange={(e) => Number(e.target.value) > 0 && onPatch({ dep: { ...o.dep, dist: Number(e.target.value) } as PointObj['dep'] })} />
            </label>
          )}
          {o.dep.kind === 'bisectorFoot' && <div className="insp-note">Piciorul bisectoarei pe latura opusă.</div>}
          {o.dep.kind === 'polar' && (
            <>
              <label className="insp-row">Distanța de la vârf
                <input type="number" min={0} step={0.5} value={o.dep.dist} onChange={(e) => Number(e.target.value) > 0 && onPatch({ dep: { ...o.dep, dist: Number(e.target.value) } as PointObj['dep'] })} />
              </label>
              <label className="insp-row">Unghi (°)
                <input type="number" value={o.dep.deg} onChange={(e) => onPatch({ dep: { ...o.dep, deg: Number(e.target.value) } as PointObj['dep'] })} />
              </label>
            </>
          )}
          {(o.dep.kind === 'onLine' || o.dep.kind === 'onCircle') && (
            <div className="insp-note">Punct lipit de {o.dep.kind === 'onLine' ? 'dreaptă' : 'cerc sau arc'}: îl poți trage doar de-a lungul ei; se mută odată cu ea.</div>
          )}
          {o.dep.kind !== 'free' && o.dep.kind !== 'onLine' && o.dep.kind !== 'onCircle' && (
            <div className="insp-note">Punct construit — se mișcă odată cu punctele de care depinde.</div>
          )}
        </>
      )}
      {isLinear(o) && (
        <>
          {o.dep.kind === 'twoPoints' && (
            <label className="insp-row">Tip
              <select value={o.type} onChange={(e) => onPatch({ type: e.target.value as LineObj['type'], showLength: e.target.value === 'segment' ? o.showLength ?? true : o.showLength })}>
                <option value="segment">segment (lungime finită)</option>
                <option value="ray">semidreaptă</option>
                <option value="line">dreaptă</option>
              </select>
            </label>
          )}
          {o.type === 'segment' && (
            <label className="insp-row chk"><input type="checkbox" checked={!!o.showLength} onChange={(e) => onPatch({ showLength: e.target.checked })} /> Arată lungimea
              {resolvedLen(o.id) != null && <b> ({formatNum(resolvedLen(o.id)!, 3)})</b>}</label>
          )}
          {onSolid !== undefined && o.type === 'segment' && (
            <label className="insp-row chk" title="Punctat cât timp trece prin interiorul corpului sau stă pe o față din spate; se schimbă la rotire.">
              <input type="checkbox" checked={o.autoDash !== false} onChange={(e) => onPatch({ autoDash: e.target.checked ? undefined : false })} />
              Punctat automat{o.autoDash !== false ? (onSolid ? ' (acum ascuns)' : ' (acum la vedere)') : ''}
            </label>
          )}
          <label className="insp-row chk"><input type="checkbox" checked={!!o.dashed} onChange={(e) => onPatch({ dashed: e.target.checked })} /> {onSolid !== undefined && o.type === 'segment' ? 'Mereu punctat' : 'Punctat'}</label>
          <label className="insp-row">Grosime <input type="range" min={1} max={6} step={0.5} value={o.width} onChange={(e) => onPatch({ width: Number(e.target.value) })} /></label>
        </>
      )}
      {o.type === 'arc' && (
        <>
          {o.sector && <label className="insp-row chk"><input type="checkbox" checked={!!o.filled} onChange={(e) => onPatch({ filled: e.target.checked })} /> Colorează interiorul</label>}
          <label className="insp-row chk"><input type="checkbox" checked={!!o.showRadius} onChange={(e) => onPatch({ showRadius: e.target.checked })} /> Arată raza</label>
          <label className="insp-row chk"><input type="checkbox" checked={!!o.showMeasure} onChange={(e) => onPatch({ showMeasure: e.target.checked })} /> Arată măsura</label>
          <label className="insp-row">Grosime <input type="range" min={1} max={6} step={0.5} value={o.width} onChange={(e) => onPatch({ width: Number(e.target.value) })} /></label>
        </>
      )}
      {o.type === 'circle' && (
        <label className="insp-row chk"><input type="checkbox" checked={!!o.showRadius} onChange={(e) => onPatch({ showRadius: e.target.checked })} /> Arată raza</label>
      )}
      {(o.type === 'angle' || o.type === 'lineAngle') && (
        <>
          <label className="insp-row chk"><input type="checkbox" checked={o.showValue} onChange={(e) => onPatch({ showValue: e.target.checked })} /> Arată măsura</label>
          <label className="insp-row chk"><input type="checkbox" checked={o.rightMark} onChange={(e) => onPatch({ rightMark: e.target.checked })} /> Marcaj de unghi drept</label>
        </>
      )}
      {o.type === 'lineAngle' && (
        <button className="btn small" onClick={() => onPatch({ s2: o.s2 === 1 ? -1 : 1 })} title="Comută între unghi și suplementul lui (180° − unghi)">
          Unghiul suplementar
        </button>
      )}
      {o.type === 'text' && (
        <>
          <label className="insp-row">Text <input value={o.text} onChange={(e) => onPatch({ text: e.target.value })} /></label>
          <label className="insp-row">Mărime <input type="range" min={10} max={48} value={o.size} onChange={(e) => onPatch({ size: Number(e.target.value) })} /></label>
        </>
      )}
      {o.type === 'function' && (
        <label className="insp-row">f(x) = <input value={o.expr} onChange={(e) => onPatch({ expr: e.target.value })} /></label>
      )}
      <button className="btn danger small" onClick={onDelete}>Șterge</button>
    </div>
  )
}
