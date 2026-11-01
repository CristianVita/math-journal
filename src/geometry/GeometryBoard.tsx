import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import katex from 'katex'
import { compile, type EvalFunction } from 'mathjs'
import type { AngleObj, CircleObj, FunctionObj, GObj, LineObj, PathObj, PointObj, PolygonObj, Scene, TextObj } from './types'
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
  formatNum,
  mul,
  nextLabel,
  norm,
  resolve,
  sub,
  uid,
} from './engine'
import { usePrompt } from '../components/PromptDialog'
import { saveFile } from '../platform'

type Tool =
  | 'move' | 'pan' | 'point' | 'segment' | 'line' | 'ray' | 'circle' | 'polygon' | 'regular'
  | 'angle' | 'construct' | 'midpoint' | 'perpendicular' | 'parallel' | 'bisector'
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
  { id: 'angle', icon: '∠', label: 'Unghi (măsură)', hint: ['Punct pe prima latură', 'Vârful', 'Punct pe a doua latură'] },
  { id: 'construct', icon: '∡', label: 'Construiește unghi de x°', hint: ['Vârful unghiului', 'Punct pe prima latură (apoi introduci măsura)'] },
  { id: 'midpoint', icon: '⋯', label: 'Mijloc', hint: ['Click pe un segment sau pe primul punct', 'Al doilea punct'] },
  { id: 'perpendicular', icon: '⊥', label: 'Perpendiculară', hint: ['Alege dreapta și punctul prin care trece'] },
  { id: 'parallel', icon: '∥', label: 'Paralelă', hint: ['Alege dreapta și punctul prin care trece'] },
  { id: 'bisector', icon: '⦟', label: 'Bisectoare', hint: ['Punct pe prima latură', 'Vârful', 'Punct pe a doua latură'] },
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

type Pick = { kind: 'point' | 'line'; id: string }

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
  const { ask, dialog } = usePrompt()

  const sceneRef = useRef(scene)
  sceneRef.current = scene
  const drag = useRef<
    | { mode: 'pan'; start: Vec; view: Scene['view'] }
    | { mode: 'move'; ids: string[]; start: Vec; orig: Map<string, Vec>; moved: boolean }
    | { mode: 'pen'; id: string }
    | null
  >(null)

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
      } else if (o.type === 'angle') {
        const v = P(o.v)
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
      case 'bisector':
        await needPoints(3, ([a, v, b]) => {
          newLine(objs, 'ray', { kind: 'bisector', a, v, b }, { dashed: true })
          commit(objs)
        })
        break
      case 'construct':
        await needPoints(2, async ([v, a]) => {
          if (v === a) return
          const raw = await ask('Măsura unghiului (grade, pozitiv = trigonometric / invers acelor de ceas)', '60')
          const deg = Number(raw?.replace(',', '.'))
          if (raw == null || !isFinite(deg)) return
          const b = newPoint(objs, { x: 0, y: 0 }, { kind: 'rotate', center: v, from: a, deg })
          newLine(objs, 'ray', { kind: 'twoPoints', a: v, b: a })
          newLine(objs, 'ray', { kind: 'twoPoints', a: v, b: b.id })
          const [x, y] = deg >= 0 ? [a, b.id] : [b.id, a]
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
    const hit = hitTest(s)
    setSelected(hit?.id ?? null)
    if (!hit) {
      drag.current = { mode: 'pan', start: s, view: { ...view } }
      setPanning(true)
      return
    }
    const ids = hit.type === 'text' ? [hit.id] : hit.type === 'path' ? [hit.id] : freePointsOf(hit)
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
    }
  }

  const onPointerUp = () => {
    drag.current = null
    setPanning(false)
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
      case 'angle': {
        const a = P(o.a)
        const v = P(o.v)
        const b = P(o.b)
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
              cursor: panning ? 'grabbing' : spaceHeld || tool === 'pan' ? 'grab' : tool === 'move' ? (hover ? 'pointer' : 'grab') : 'crosshair',
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
          </svg>
          {!readOnly && <div className="board-status">
            <b>{toolInfo.label}:</b> {hint}
            {tool !== 'move' && tool !== 'pan' && <span className="muted">· Esc = cursor · click dreapta + trage = mută tabla</span>}
            {mouse && <span className="coords">({formatNum(mouse.x)}, {formatNum(mouse.y)})</span>}
          </div>}
        </div>

        {sel && !readOnly && <Inspector o={sel} scene={scene} resolvedLen={(id) => {
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

function Inspector({ o, scene, onPatch, onDelete, resolvedLen }: {
  o: GObj
  scene: Scene
  onPatch: (p: Partial<GObj>) => void
  onDelete: () => void
  resolvedLen: (id: string) => number | null
}) {
  const names: Record<GObj['type'], string> = {
    point: 'Punct', segment: 'Segment', line: 'Dreaptă', ray: 'Semidreaptă', circle: 'Cerc',
    polygon: 'Poligon', angle: 'Unghi', text: 'Text', path: 'Desen liber', function: 'Funcție',
  }
  const label = (id: string) => (scene.objects.find((x) => x.id === id) as PointObj | undefined)?.label ?? '?'
  let title = names[o.type]
  if (o.type === 'point') title += ' ' + o.label
  if (isLinear(o) && o.dep.kind === 'twoPoints') title += ` ${label(o.dep.a)}${label(o.dep.b)}`
  if (o.type === 'angle') title += ` ∠${label(o.a)}${label(o.v)}${label(o.b)}`
  if (o.type === 'polygon') title += ' ' + o.points.map(label).join('')

  return (
    <div className="inspector">
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
          {o.dep.kind !== 'free' && <div className="insp-note">Punct construit — se mișcă odată cu punctele de care depinde.</div>}
        </>
      )}
      {isLinear(o) && (
        <>
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
      {o.type === 'angle' && (
        <>
          <label className="insp-row chk"><input type="checkbox" checked={o.showValue} onChange={(e) => onPatch({ showValue: e.target.checked })} /> Arată măsura</label>
          <label className="insp-row chk"><input type="checkbox" checked={o.rightMark} onChange={(e) => onPatch({ rightMark: e.target.checked })} /> Marcaj de unghi drept</label>
        </>
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
