import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import { compile, type EvalFunction } from 'mathjs'
import type { AngleObj, CircleObj, FunctionObj, GObj, LineAngleObj, LineObj, PathObj, PointObj, PolygonObj, Scene, TextObj } from './types'
import { emptyScene, isLinear } from './types'
import {
  type ResolvedLine,
  type Vec,
  add,
  angleAt,
  angleCCW,
  cascade,
  dependsOn,
  dist,
  distToLine,
  figureOf,
  formatNum,
  intersectLines,
  mul,
  nextLabel,
  norm,
  resolve,
  rotate,
  sub,
  uid,
} from './engine'
import { usePrompt } from '../components/PromptDialog'
import { saveFile } from '../platform'
import { type Triangle, solveTriangle, triangleExtras, triangleVertices } from '../trig/trigMath'

/**
 * "3, 4" / "3 4" / "3; 4" → [3, 4]. A comma with no space is a decimal comma ("2,5") unless that
 * leaves too few numbers ("3,4" when two are expected).
 */
export function parseNumbers(src: string, count: number): number[] {
  let parts = src.replace(/,\s+/g, ' ').split(/[;\s]+/).filter(Boolean)
  if (parts.length < count) parts = parts.flatMap((p) => p.split(','))
  return parts.map((p) => Number(p.replace(',', '.')))
}

const TRIANGLE_KINDS: Record<string, string> = {
  right: 'dreptunghic', acute: 'ascuțitunghic', obtuse: 'obtuzunghic', equi: 'echilateral', iso: 'isoscel',
}

/** Side lengths from the dialog → a solved triangle, or a message explaining what is wrong. */
export function triangleFromInput(kind: string, values: string[]): Triangle | string {
  const need: Record<string, [number, number]> = { right: [1, 2], acute: [2, 3], obtuse: [3, 3], equi: [4, 1], iso: [5, 2] }
  const [field, count] = need[kind]
  const n = parseNumbers(values[field], count)
  if (n.length !== count || n.some((x) => !(x > 0))) return `Scrie ${count === 1 ? 'un număr pozitiv' : `${count} numere pozitive, separate prin virgulă`}.`
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
  | 'move' | 'pan' | 'point' | 'segment' | 'line' | 'ray' | 'circle' | 'triangle' | 'polygon' | 'regular'
  | 'angle' | 'lineAngle' | 'construct' | 'midpoint' | 'perpendicular' | 'parallel' | 'bisector'
  | 'intersection' | 'text' | 'pen' | 'delete'

const TOOLS: { id: Tool; icon: string; label: string; hint: string[] }[] = [
  { id: 'move', icon: '↖', label: 'Cursor', hint: ['Selectează și trage puncte sau figuri; trage fundalul pentru a muta tabla; rotița = zoom'] },
  { id: 'pan', icon: '✋', label: 'Mută tabla', hint: ['Trage oriunde pentru a te deplasa în sistemul xOy; rotița = zoom'] },
  { id: 'point', icon: '•', label: 'Punct', hint: ['Click pentru a plasa un punct'] },
  { id: 'segment', icon: '⟋', label: 'Segment', hint: ['Primul capăt', 'Al doilea capăt'] },
  { id: 'line', icon: '⟷', label: 'Dreaptă', hint: ['Primul punct al dreptei', 'Al doilea punct'] },
  { id: 'ray', icon: '⟶', label: 'Semidreaptă', hint: ['Originea', 'Un punct pe semidreaptă'] },
  { id: 'circle', icon: '◯', label: 'Cerc', hint: ['Centrul', 'Un punct de pe cerc'] },
  { id: 'polygon', icon: '⬠', label: 'Poligon', hint: ['Vârfurile pe rând; click pe primul vârf pentru a închide'] },
  { id: 'regular', icon: '⬡', label: 'Poligon regulat', hint: ['Primul vârf', 'Al doilea vârf (apoi alegi nr. de laturi)'] },
  { id: 'triangle', icon: '△', label: 'Triunghi (dreptunghic, ascuțitunghic, obtuzunghic…)', hint: ['Click unde vrei primul vârf, apoi alegi tipul și dimensiunile'] },
  { id: 'angle', icon: '∠', label: 'Unghi (măsură)', hint: ['Punct pe prima latură', 'Vârful', 'Punct pe a doua latură'] },
  { id: 'lineAngle', icon: '∢', label: 'Unghi între două linii', hint: ['Click pe prima dreaptă / segment / semidreaptă (pe porțiunea care formează unghiul)', 'Click pe a doua linie'] },
  { id: 'construct', icon: '∡', label: 'Construiește unghi de x°', hint: ['Vârful unghiului', 'Direcția primei laturi (apoi introduci măsura și lungimile laturilor)'] },
  { id: 'midpoint', icon: '⋯', label: 'Mijloc', hint: ['Click pe un segment sau pe primul punct', 'Al doilea punct'] },
  { id: 'perpendicular', icon: '⊥', label: 'Perpendiculară', hint: ['Alege dreapta și punctul prin care trece'] },
  { id: 'parallel', icon: '∥', label: 'Paralelă', hint: ['Alege dreapta și punctul prin care trece'] },
  { id: 'bisector', icon: '⦟', label: 'Bisectoare', hint: ['Punct pe prima latură', 'Vârful', 'Punct pe a doua latură (apoi alegi până unde merge bisectoarea)'] },
  { id: 'intersection', icon: '✕', label: 'Intersecție', hint: ['Prima dreaptă / segment', 'A doua dreaptă / segment'] },
  { id: 'text', icon: 'T', label: 'Text / formulă', hint: ['Click unde vrei textul (LaTeX între $...$)'] },
  { id: 'pen', icon: '✎', label: 'Desen liber', hint: ['Desenează liber cu mouse-ul sau stylus-ul'] },
  { id: 'delete', icon: '⌫', label: 'Șterge', hint: ['Click pe obiectul de șters (se șterge și ce depinde de el)'] },
]

const COLORS = ['#1f2937', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#db2777']

interface Props {
  scene: Scene
  onChange: (s: Scene) => void
  height?: number | string
  readOnly?: boolean // thumbnail mode: no toolbar, no interaction, view fitted to the figure
}

/** Positions (and fixed lengths) of a figure when a scale / rotate gesture starts. */
type XformBase = { pts: Map<string, Vec>; paths: Map<string, [number, number][]>; dists: Map<string, number> }

// `at`: where on the line the user clicked (the angle-between-lines tool uses it to pick a side)
type Pick = { kind: 'point' | 'line'; id: string; at?: Vec }

export default function GeometryBoard({ scene, onChange, height = 560, readOnly = false }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 800, h: 500 })
  const [tool, setTool] = useState<Tool>('move')
  const [color, setColor] = useState(COLORS[0])
  const [pending, setPending] = useState<Pick[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [mouse, setMouse] = useState<Vec | null>(null)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [panning, setPanning] = useState(false)

  // hold Space to drag the plane, whatever tool is active (like in drawing programs)
  useEffect(() => {
    if (readOnly) return
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
  }, [readOnly])
  const [past, setPast] = useState<Scene[]>([])
  const [future, setFuture] = useState<Scene[]>([])
  const { ask, askForm, dialog } = usePrompt()

  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const drag = useRef<
    | { mode: 'pan'; start: Vec; view: Scene['view'] }
    | { mode: 'move'; ids: string[]; start: Vec; orig: Map<string, Vec>; moved: boolean }
    | { mode: 'pen'; id: string }
    | { mode: 'xform'; kind: 'scale' | 'rotate'; pivot: Vec; start: Vec; base: XformBase; moved: boolean }
    | null
  >(null)
  const [xformLabel, setXformLabel] = useState<string | null>(null)
  const [hoverHandle, setHoverHandle] = useState<'scale' | 'rotate' | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const resolved = useMemo(() => resolve(scene), [scene])
  const view = useMemo(() => (readOnly ? fitView(scene, resolved.points, size) : scene.view), [readOnly, scene, resolved, size])
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
    const ids = figureOf(scene, selObj.id)
    const objs = scene.objects.filter((o) => ids.has(o.id))
    // a transformation moves the free points (everything else is built on them), freehand paths and texts
    const movable = new Set(
      objs.filter((o) => (o.type === 'point' && o.dep.kind === 'free') || o.type === 'path' || o.type === 'text').map((o) => o.id),
    )
    if (!movable.size) return null
    const pts: Vec[] = []
    for (const o of objs) {
      if (o.type === 'point') {
        const p = resolved.points.get(o.id)
        if (p) pts.push(p)
      } else if (o.type === 'path') o.points.forEach(([x, y]) => pts.push({ x, y }))
      else if (o.type === 'text') pts.push({ x: o.x, y: o.y })
      else if (o.type === 'circle') {
        const c = resolved.points.get(o.center)
        const t = resolved.points.get(o.through)
        if (c && t) {
          const r = dist(c, t)
          pts.push({ x: c.x - r, y: c.y - r }, { x: c.x + r, y: c.y + r })
        }
      }
    }
    if (!pts.length) return null
    const vertices = objs.filter((o): o is PointObj => o.type === 'point' && !o.hidden && !!resolved.points.get(o.id))
    const avg = (list: Vec[]) => mul(list.reduce((s, p) => add(s, p), { x: 0, y: 0 }), 1 / list.length)
    const centroid = avg(vertices.length ? vertices.map((o) => resolved.points.get(o.id)!) : pts)
    return { ids, movable, pts, vertices, centroid }
  }, [scene, selObj, resolved])
  const [pivotId, setPivotId] = useState('center')
  useEffect(() => setPivotId('center'), [selected])
  const pivot = figure ? (pivotId !== 'center' && resolved.points.get(pivotId)) || figure.centroid : null

  const xformBase = (movable: Set<string>, ids: Set<string>): XformBase => {
    const base: XformBase = { pts: new Map(), paths: new Map(), dists: new Map() }
    for (const o of sceneRef.current.objects) {
      if (movable.has(o.id) && (o.type === 'point' || o.type === 'text')) base.pts.set(o.id, { x: o.x, y: o.y })
      if (movable.has(o.id) && o.type === 'path') base.paths.set(o.id, o.points)
      // sides of a fixed length (constructed angle, bisector) must grow with the figure
      if (ids.has(o.id) && o.type === 'point' && (o.dep.kind === 'polar' || o.dep.kind === 'bisectorPoint')) base.dists.set(o.id, o.dep.dist)
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
      if (o.type === 'point' && base.dists.has(o.id) && (o.dep.kind === 'polar' || o.dep.kind === 'bisectorPoint'))
        return { ...o, dep: { ...o.dep, dist: base.dists.get(o.id)! * k } }
      return o
    })
  const rotateFigure = (deg: number) => {
    if (!figure || !pivot) return
    const a = (deg * Math.PI) / 180
    commit(applyXform(xformBase(figure.movable, figure.ids), (p) => rotate(p, pivot, a), 1))
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
    return { x0, x1, y0, y1, corners: [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }], rot: { x: (x0 + x1) / 2, y: y0 - 30 } }
  }
  const handleAt = (s: Vec): 'scale' | 'rotate' | null => {
    const box = selectionBox()
    if (!box) return null
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

  // ---------- history ----------
  const commit = (objects: GObj[], v = sceneRef.current.view) => {
    setPast((p) => [...p.slice(-80), sceneRef.current])
    setFuture([])
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
    setFuture((f) => [sceneRef.current, ...f])
    const prev = past[past.length - 1]
    setPast((p) => p.slice(0, -1))
    onChange({ ...prev, view: sceneRef.current.view })
  }
  const redo = () => {
    if (!future.length) return
    setPast((p) => [...p, sceneRef.current])
    const [n, ...rest] = future
    setFuture(rest)
    onChange({ ...n, view: sceneRef.current.view })
  }

  // ---------- hit testing (screen pixels) ----------
  const hitTest = (s: Vec, only?: (o: GObj) => boolean): GObj | null => {
    const w = toWorld(s)
    const objs = scene.objects.filter((o) => !only || only(o))
    let best: { o: GObj; d: number } | null = null
    const consider = (o: GObj, d: number, tol: number) => {
      if (d <= tol && (!best || d < best.d)) best = { o, d }
    }
    for (const o of objs) {
      if (o.type === 'point' && !o.hidden) {
        const p = P(o.id)
        if (p) consider(o, dist(toScreen(p), s) - 4, 8)
      }
    }
    if (best) return (best as { o: GObj }).o
    for (const o of objs) {
      if (isLinear(o)) {
        const l = L(o.id)
        if (l) consider(o, distToLine(w, l) * view.scale, 6)
      } else if (o.type === 'circle') {
        const c = P(o.center)
        const t = P(o.through)
        if (c && t) consider(o, Math.abs(dist(c, w) - dist(c, t)) * view.scale, 6)
      } else if (o.type === 'text') {
        const p = toScreen(o)
        if (s.x >= p.x - 4 && s.x <= p.x + Math.max(40, o.text.length * o.size * 0.55) && s.y >= p.y - o.size - 4 && s.y <= p.y + 6)
          consider(o, 0, 1)
      } else if (o.type === 'angle' || o.type === 'lineAngle') {
        const v = o.type === 'angle' ? P(o.v) : lineAngleGeo(o)?.v
        if (v) consider(o, Math.abs(dist(toScreen(v), s) - 28), 8)
      } else if (o.type === 'path') {
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

  // ---------- tool clicks ----------
  const onToolClick = async (s: Vec) => {
    const w = toWorld(s)
    const objs = [...sceneRef.current.objects]
    const hit = hitTest(s)
    const pointAt = (): string => {
      if (hit?.type === 'point') return hit.id
      return newPoint(objs, snap(w)).id
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
      case 'midpoint':
        if (!pending.length && hit && hit.type === 'segment' && hit.dep.kind === 'twoPoints') {
          const m = newPoint(objs, { x: 0, y: 0 }, { kind: 'midpoint', a: hit.dep.a, b: hit.dep.b })
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
          { label: 'Catetele', value: '3, 4', showIf: { field: 0, value: 'right' }, hint: 'Unghiul drept este în vârful pe care ai dat click.' },
          { label: 'Laturile', value: '5, 6, 7', showIf: { field: 0, value: 'acute' }, hint: 'Trei lungimi; cea mai mare la pătrat < suma pătratelor celorlalte.' },
          { label: 'Laturile', value: '3, 4, 6', showIf: { field: 0, value: 'obtuse' }, hint: 'Trei lungimi; cea mai mare la pătrat > suma pătratelor celorlalte.' },
          { label: 'Latura', value: '4', showIf: { field: 0, value: 'equi' } },
          { label: 'Baza, apoi laturile egale', value: '4, 5', showIf: { field: 0, value: 'iso' } },
        ])
        if (!vals) break
        const t = triangleFromInput(vals[0], vals)
        if (typeof t === 'string') {
          await ask(t, '', true)
          break
        }
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
          const n = Number(await ask('Număr de laturi', '6'))
          if (!Number.isInteger(n) || n < 3 || n > 40) return
          const interior = ((n - 2) * 180) / n
          const ids = [a, b]
          for (let k = 2; k < n; k++)
            ids.push(newPoint(objs, { x: 0, y: 0 }, { kind: 'rotate', center: ids[k - 1], from: ids[k - 2], deg: -interior }).id)
          objs.push({ id: uid(), type: 'polygon', points: ids, color, fill: color + '22', width: 2 } satisfies PolygonObj)
          commit(objs)
        })
        break
      case 'angle':
        await needPoints(3, ([a, v, b]) => {
          objs.push({ id: uid(), type: 'angle', a, v, b, color, showValue: true, rightMark: true } satisfies AngleObj)
          commit(objs)
        })
        break
      case 'lineAngle': {
        const lineHit = hitTest(s, isLinear)
        if (!lineHit) break
        const next = [...pending, { kind: 'line' as const, id: lineHit.id, at: w }]
        if (next.length < 2) {
          setPending(next)
          break
        }
        setPending([])
        const [p1, p2] = next
        if (p1.id === p2.id) break
        const l1 = L(p1.id)
        const l2 = L(p2.id)
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
      case 'bisector':
        await needPoints(3, async ([a, v, b]) => {
          if (a === v || b === v || a === b) return
          const vals = await askForm('Bisectoarea unghiului', [
            {
              label: 'Până unde merge bisectoarea',
              value: 'side',
              options: [
                { value: 'side', label: 'până la latura opusă (bisectoarea din triunghi)' },
                { value: 'length', label: 'o lungime aleasă de mine' },
                { value: 'ray', label: 'semidreaptă (infinită)' },
              ],
              hint: 'Latura opusă = segmentul dintre primul și al treilea punct ales.',
            },
            { label: 'Lungimea bisectoarei', placeholder: 'ex: 4', showIf: { field: 0, value: 'length' } },
          ])
          if (!vals) return
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
        })
        break
      case 'construct':
        await needPoints(2, async ([v, a]) => {
          if (v === a) return
          const vals = await askForm('Construiește un unghi', [
            { label: 'Măsura unghiului (grade)', value: '60', hint: 'Pozitiv = sens trigonometric (invers acelor de ceasornic).' },
            { label: 'Lungimea primei laturi', placeholder: 'gol = semidreaptă (infinită)', hint: 'Prima latură merge spre punctul pe care ai dat click.' },
            { label: 'Lungimea celei de-a doua laturi', placeholder: 'gol = la fel ca prima' },
          ])
          if (!vals) return
          const deg = Number(vals[0].replace(',', '.'))
          // null = not given (infinite side), NaN = invalid
          const len = (t: string) => {
            const s = t.trim().replace(',', '.')
            if (!s) return null
            const n = Number(s)
            return isFinite(n) && n > 0 ? n : NaN
          }
          const l1 = len(vals[1])
          const l2 = vals[2].trim() ? len(vals[2]) : l1
          if (!isFinite(deg) || Number.isNaN(l1) || Number.isNaN(l2)) {
            await ask('Măsura și lungimile trebuie să fie numere (lungimile pozitive).', '', true)
            return
          }
          let sideA = a
          if (l1 !== null) {
            const at = resolve({ objects: objs, view }).points
            const pv = at.get(v)
            const pa = at.get(a)
            const clicked = objs.find((o) => o.id === a)
            const isNew = !sceneRef.current.objects.some((o) => o.id === a)
            if (pv && pa && clicked?.type === 'point' && clicked.dep.kind === 'free' && isNew) {
              // the point just placed becomes the end of the first side, at the exact length (still draggable)
              const end = add(pv, mul(norm(sub(pa, pv)), l1))
              objs[objs.indexOf(clicked)] = { ...clicked, x: end.x, y: end.y }
            } else {
              // an existing point only gives the direction: put the end of the side on it at that length
              sideA = newPoint(objs, { x: 0, y: 0 }, { kind: 'polar', center: v, toward: a, deg: 0, dist: l1 }).id
            }
          }
          const b =
            l2 !== null
              ? newPoint(objs, { x: 0, y: 0 }, { kind: 'polar', center: v, toward: a, deg, dist: l2 })
              : newPoint(objs, { x: 0, y: 0 }, { kind: 'rotate', center: v, from: a, deg })
          newLine(objs, l1 !== null ? 'segment' : 'ray', { kind: 'twoPoints', a: v, b: sideA }, { showLength: l1 !== null })
          newLine(objs, l2 !== null ? 'segment' : 'ray', { kind: 'twoPoints', a: v, b: b.id }, { showLength: l2 !== null })
          const [x, y] = deg >= 0 ? [sideA, b.id] : [b.id, sideA]
          objs.push({ id: uid(), type: 'angle', a: x, v, b: y, color, showValue: true, rightMark: true } satisfies AngleObj)
          commit(objs)
        })
        break
      case 'perpendicular':
      case 'parallel': {
        const lineHit = hitTest(s, (o) => isLinear(o) && o.type !== undefined)
        const next = [...pending]
        if (hit?.type !== 'point' && lineHit && isLinear(lineHit)) next.push({ kind: 'line', id: lineHit.id })
        else next.push({ kind: 'point', id: pointAt() })
        const ln = next.find((p) => p.kind === 'line')
        const pt = [...next].reverse().find((p) => p.kind === 'point')
        if (ln && pt) {
          newLine(objs, 'line', { kind: tool, through: pt.id, ref: ln.id }, { dashed: true })
          setPending([])
          commit(objs)
        } else {
          setPending(next)
          if (objs.length !== sceneRef.current.objects.length) commit(objs)
        }
        break
      }
      case 'intersection': {
        const lineHit = hitTest(s, isLinear)
        if (!lineHit) break
        const next = [...pending, { kind: 'line' as const, id: lineHit.id }]
        if (next.length === 2) {
          if (next[0].id !== next[1].id) {
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
        if (hit) {
          const gone = cascade(sceneRef.current, hit.id)
          commit(objs.filter((o) => !gone.has(o.id)))
          if (selected && gone.has(selected)) setSelected(null)
        }
        break
    }
  }

  // ---------- pointer handling ----------
  const screenPos = (e: React.PointerEvent | React.WheelEvent): Vec => {
    const r = svgRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
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
    const panGesture = tool === 'pan' || spaceHeld || (e.pointerType === 'mouse' && (e.button === 1 || e.button === 2))
    if (!panGesture && e.button !== 0 && e.pointerType === 'mouse') return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    if (panGesture) {
      e.preventDefault()
      drag.current = { mode: 'pan', start: s, view: { ...view } }
      setPanning(true)
      return
    }
    if (tool === 'pen') {
      const w = toWorld(s)
      const p: PathObj = { id: uid(), type: 'path', points: [[w.x, w.y]], color, width: 2.5 }
      commit([...sceneRef.current.objects, p])
      drag.current = { mode: 'pen', id: p.id }
      return
    }
    if (tool !== 'move') {
      void onToolClick(s)
      return
    }
    // the handles of the selected figure come first: they sit on its edge
    const handle = figure && pivot ? handleAt(s) : null
    if (handle && figure && pivot) {
      drag.current = { mode: 'xform', kind: handle, pivot, start: toWorld(s), base: xformBase(figure.movable, figure.ids), moved: false }
      return
    }
    const hit = hitTest(s)
    setSelected(hit?.id ?? null)
    if (!hit) {
      drag.current = { mode: 'pan', start: s, view: { ...view } }
      setPanning(true)
      return
    }
    // a vertex moves alone (reshaping the figure); grabbing any other part moves the whole figure
    let ids: string[]
    if (hit.type === 'point') ids = freePointsOf(hit)
    else if (hit.type === 'text' || hit.type === 'path') ids = [hit.id]
    else {
      const fig = figureOf(sceneRef.current, hit.id)
      ids = sceneRef.current.objects
        .filter((o) => fig.has(o.id) && ((o.type === 'point' && o.dep.kind === 'free') || o.type === 'path' || o.type === 'text'))
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
      const h = hitTest(s)
      setHover(h?.id ?? null)
      setHoverHandle(tool === 'move' && figure ? handleAt(s) : null)
      return
    }
    if (d.mode === 'pan') {
      setView({ cx: d.view.cx - (s.x - d.start.x) / view.scale, cy: d.view.cy + (s.y - d.start.y) / view.scale })
    } else if (d.mode === 'pen') {
      onChange({
        ...sceneRef.current,
        objects: sceneRef.current.objects.map((o) =>
          o.id === d.id && o.type === 'path' ? { ...o, points: [...o.points, [w.x, w.y]] } : o,
        ),
      })
    } else if (d.mode === 'move') {
      if (!d.moved) {
        setPast((p) => [...p.slice(-80), sceneRef.current])
        setFuture([])
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
    } else if (d.mode === 'xform') {
      if (!d.moved) {
        setPast((p) => [...p.slice(-80), sceneRef.current])
        setFuture([])
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

  const onPointerUp = () => {
    drag.current = null
    setPanning(false)
    setXformLabel(null)
  }

  const onWheel = (e: React.WheelEvent) => {
    const s = screenPos(e)
    const before = toWorld(s)
    const scale = Math.min(400, Math.max(5, view.scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12)))
    // keep the world point under the cursor fixed
    setView({ scale, cx: before.x - (s.x - size.w / 2) / scale, cy: before.y + (s.y - size.h / 2) / scale })
  }

  useEffect(() => {
    if (readOnly) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (!wrapRef.current?.closest('.board')?.contains(document.activeElement) && document.activeElement !== document.body) return
      // Esc: drop the half-finished construction and go back to the cursor
      if (e.key === 'Escape') {
        setPending([])
        setTool('move')
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) {
        const gone = cascade(sceneRef.current, selected)
        commit(sceneRef.current.objects.filter((o) => !gone.has(o.id)))
        setSelected(null)
      }
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

  const renderObj = (o: GObj): JSX.Element | null => {
    const hl = isSel(o.id)
    switch (o.type) {
      case 'segment':
      case 'line':
      case 'ray': {
        const l = L(o.id)
        if (!l) return null
        const [a, b] = lineEnds(l).map(toScreen)
        const mid = toScreen(mul(add(l.a, l.b), 0.5))
        const n = norm({ x: -(b.y - a.y), y: b.x - a.x })
        return (
          <g key={o.id}>
            {hl && <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="halo" />}
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={o.color} strokeWidth={o.width} strokeDasharray={o.dashed ? '6 5' : undefined} strokeLinecap="round" />
            {o.type === 'segment' && o.showLength && (
              <text x={mid.x + n.x * 14} y={mid.y + n.y * 14} className="measure" fill={o.color} textAnchor="middle">
                {formatNum(dist(l.a, l.b))}
              </text>
            )}
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
        const value = angleAt(a, v, b)
        const sv = toScreen(v)
        const R = 28
        const isRight = o.rightMark && Math.abs(value - Math.PI / 2) < 1e-4
        const mid = t0 + sweep / 2
        const label = { x: sv.x + Math.cos(mid) * (R + 20), y: sv.y - Math.sin(mid) * (R + 20) }
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
        const d = o.points.map(([x, y], i) => {
          const p = toScreen({ x, y })
          return `${i ? 'L' : 'M'}${p.x},${p.y}`
        }).join(' ')
        return (
          <g key={o.id}>
            {hl && <path d={d} className="halo" fill="none" />}
            <path d={d} stroke={o.color} strokeWidth={o.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )
      }
      case 'function':
        return <FunctionPlot key={o.id} o={o} hl={hl} toScreen={toScreen} toWorld={toWorld} W={W} H={H} />
      default:
        return null
    }
  }

  const renderPoint = (o: PointObj) => {
    if (o.hidden) return null
    const p = P(o.id)
    if (!p) return null
    const s = toScreen(p)
    const free = o.dep.kind === 'free'
    return (
      <g key={o.id}>
        {isSel(o.id) && <circle cx={s.x} cy={s.y} r={9} className="halo-pt" />}
        <circle cx={s.x} cy={s.y} r={free ? 4.5 : 3.5} fill={free ? o.color : '#fff'} stroke={o.color} strokeWidth={free ? 1 : 2} />
        <text x={s.x + 7} y={s.y - 8} className="pt-label" fill={o.color}>{o.label}</text>
      </g>
    )
  }

  const preview = () => {
    if (!mouse || !pending.length) return null
    const last = pending[pending.length - 1]
    if (last.kind !== 'point') return null
    const a = P(last.id)
    if (!a) return null
    const sa = toScreen(a)
    const sm = toScreen(snap(mouse))
    if (tool === 'circle')
      return <circle data-ui cx={sa.x} cy={sa.y} r={dist(sa, sm)} className="preview" fill="none" />
    return <line data-ui x1={sa.x} y1={sa.y} x2={sm.x} y2={sm.y} className="preview" />
  }

  const sel = scene.objects.find((o) => o.id === selected)
  const toolInfo = TOOLS.find((t) => t.id === tool)!
  const hint = toolInfo.hint[Math.min(pending.length, toolInfo.hint.length - 1)]

  return (
    <div className={'board' + (readOnly ? ' readonly' : '')} tabIndex={-1}>
      {!readOnly && <div className="board-toolbar">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={'tool' + (tool === t.id ? ' active' : '') + (t.id === 'move' || t.id === 'pan' ? ' wide labeled' : '')}
            title={t.id === 'move' ? 'Cursor (Esc)' : t.id === 'pan' ? 'Mută tabla (sau: click dreapta / Space + trage)' : t.label}
            onClick={() => changeTool(t.id)}
          >
            {t.icon}
            {(t.id === 'move' || t.id === 'pan') && <span>{t.label}</span>}
          </button>
        ))}
        <button className="tool" title="Graficul unei funcții f(x)" onClick={addFunction}>ƒ</button>
        <span className="sep" />
        {COLORS.map((c) => (
          <button key={c} className={'swatch' + (color === c ? ' active' : '')} style={{ background: c }} title="Culoare" onClick={() => setColor(c)} />
        ))}
        <span className="sep" />
        <button className="tool" title="Anulează (Ctrl+Z)" onClick={undo} disabled={!past.length}>↶</button>
        <button className="tool" title="Refă (Ctrl+Y)" onClick={redo} disabled={!future.length}>↷</button>
        <span className="sep" />
        <label className="chk"><input type="checkbox" checked={view.grid} onChange={(e) => setView({ grid: e.target.checked })} /> Grilă</label>
        <label className="chk"><input type="checkbox" checked={view.axes} onChange={(e) => setView({ axes: e.target.checked })} /> Axe</label>
        <label className="chk"><input type="checkbox" checked={view.snap} onChange={(e) => setView({ snap: e.target.checked })} /> Aliniere</label>
        <select value={view.angleUnit} onChange={(e) => setView({ angleUnit: e.target.value as 'deg' | 'rad' })} title="Unitatea unghiurilor">
          <option value="deg">grade</option>
          <option value="rad">radiani</option>
        </select>
        <span className="sep" />
        <button className="tool wide" onClick={() => setView({ cx: 0, cy: 0, scale: 40 })} title="Centrează">⌖</button>
        <button className="tool wide" onClick={exportPng} title="Exportă PNG">PNG</button>
        <button className="tool wide" onClick={exportSvg} title="Exportă SVG">SVG</button>
        <button className="tool wide danger" title="Golește tabla" onClick={() => scene.objects.length && commit(emptyScene().objects)}>Golește</button>
      </div>}

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
            onPointerLeave={() => setMouse(null)}
            onWheel={readOnly ? undefined : onWheel}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              cursor: panning ? 'grabbing'
                : spaceHeld || tool === 'pan' ? 'grab'
                : tool === 'move' ? (hoverHandle === 'scale' ? 'nwse-resize' : hoverHandle === 'rotate' ? 'alias' : hover ? 'move' : 'grab')
                : 'crosshair',
              touchAction: 'none',
            }}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
              </marker>
            </defs>
            <rect width={W} height={H} fill="#fff" />
            {gridEls()}
            {scene.objects.filter((o) => o.type === 'polygon').map(renderObj)}
            {scene.objects.filter((o) => o.type !== 'polygon' && o.type !== 'point').map(renderObj)}
            {preview()}
            {scene.objects.filter((o): o is PointObj => o.type === 'point').map(renderPoint)}
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
                  {xformLabel && <text x={box.rot.x + 14} y={box.rot.y + 4} className="measure sel-label">{xformLabel}</text>}
                </g>
              )
            })()}
          </svg>
          {!readOnly && <div className="board-status">
            <b>{toolInfo.label}:</b> {hint}
            {tool !== 'move' && tool !== 'pan' && <span className="muted">· Esc = cursor · click dreapta + trage = mută tabla</span>}
            {mouse && <span className="coords">({formatNum(mouse.x)}, {formatNum(mouse.y)})</span>}
          </div>}
        </div>

        {sel && !readOnly && <Inspector o={sel} scene={scene} figureTools={figure && pivot ? {
          pivots: [{ id: 'center', label: 'centrul figurii' }, ...figure.vertices.map((p) => ({ id: p.id, label: `vârful ${p.label}` }))],
          pivot: pivotId,
          setPivot: setPivotId,
          rotate: rotateFigure,
          scale: scaleFigure,
        } : undefined} resolvedLen={(id) => {
          const l = L(id)
          return l ? dist(l.a, l.b) : null
        }} onPatch={(p) => updateObj(sel.id, p)} onDelete={() => {
          const gone = cascade(sceneRef.current, sel.id)
          commit(sceneRef.current.objects.filter((o) => !gone.has(o.id)))
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
    else if (o.type === 'path') for (const [x, y] of o.points) push(x, y)
    else if (o.type === 'circle') {
      const c = points.get(o.center)
      const t = points.get(o.through)
      if (c && t) {
        const r = dist(c, t)
        push(c.x - r, c.y - r)
        push(c.x + r, c.y + r)
      }
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
    </div>
  )
}

function Inspector({ o, scene, onPatch, onDelete, resolvedLen, figureTools }: {
  o: GObj
  scene: Scene
  onPatch: (p: Partial<GObj>) => void
  onDelete: () => void
  resolvedLen: (id: string) => number | null
  figureTools?: FigureTools
}) {
  const names: Record<GObj['type'], string> = {
    point: 'Punct', segment: 'Segment', line: 'Dreaptă', ray: 'Semidreaptă', circle: 'Cerc',
    polygon: 'Poligon', angle: 'Unghi', lineAngle: 'Unghi între linii', text: 'Text', path: 'Desen liber', function: 'Funcție',
  }
  const label = (id: string) => (scene.objects.find((x) => x.id === id) as PointObj | undefined)?.label ?? '?'
  let title = names[o.type]
  if (o.type === 'point') title += ' ' + o.label
  if (isLinear(o) && o.dep.kind === 'twoPoints') title += ` ${label(o.dep.a)}${label(o.dep.b)}`
  if (o.type === 'angle') title += ` ∠${label(o.a)}${label(o.v)}${label(o.b)}`
  if (o.type === 'polygon') title += ' ' + o.points.map(label).join('')

  return (
    <div className="inspector">
      {figureTools && <FigurePanel t={figureTools} />}
      <div className="insp-title">{title}</div>
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
          {o.dep.kind !== 'free' && <div className="insp-note">Punct construit — se mișcă odată cu punctele de care depinde.</div>}
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
          <label className="insp-row chk"><input type="checkbox" checked={!!o.dashed} onChange={(e) => onPatch({ dashed: e.target.checked })} /> Punctat</label>
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
