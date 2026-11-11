// Freehand notebook: write with the mouse, a pen tablet or a finger, like with a pen on paper.
// Strokes are kept as points and drawn as SVG outlines (perfect-freehand), so they stay sharp and small to store.
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { getStroke } from 'perfect-freehand'
import { saveFile } from '../platform'
import { rasterize, saveDocx, savePdf, svgElementPicture, today } from '../export/exportDoc'
import GeometryBoard, { SHEET_ORIGIN } from '../geometry/GeometryBoard'
import { dist, resolve } from '../geometry/engine'
import { emptyScene, type Scene } from '../geometry/types'
import { usePrompt } from '../components/PromptDialog'
import { readLocal, writeLocal } from '../db'
import { eraseLine } from './erase'
import { defaultInstruments, InstrumentsLayer, PX_PER_CM, type Bounds, type Instruments } from './instruments'
import { SolidIcon, ToolIcon } from '../components/ToolIcon'
import { InstrumentsBar, linePoints, round, useInstruments } from './useInstruments'
import { SHAPES, shapePoints, shapeStrokes, type ShapeId } from './shapes'
import { SOLIDS, solidObjects, solidStrokes, type SolidId } from './solids'

type Tool = 'pen' | 'marker' | 'text' | 'shape' | 'geometry' | 'eraser'
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

/** Typed text; (x, y) is the top left corner of its first line. */
interface Note {
  id: string
  tool: 'text'
  color: string
  size: number
  x: number
  y: number
  text: string
}

type Item = Stroke | Note

interface Notebook {
  paper: Paper
  pages: Item[][]
  /** the constructions on each page, a layer of their own over what is written */
  scenes: Scene[]
  current: number
  tools: Instruments
}

/** What the pointer is doing between pointerdown and pointerup; 'inst' = an instrument has it. */
interface Active { pointerId: number; start: number[]; before: Item[]; mode: 'draw' | 'erase' | 'inst' | 'note' | 'shape'; note?: Note }

/** The text being typed; id is null for a new one. */
interface NoteEdit { page: number; id: string | null; color: string; size: number; x: number; y: number; text: string }

const KEY = 'math-journal:notebook'
const PEN_COLORS = [
  { name: 'negru', value: '#111827' },
  { name: 'albastru', value: '#1d4ed8' },
  { name: 'roșu', value: '#dc2626' },
  { name: 'verde', value: '#15803d' },
]
const COLORS: Record<'pen' | 'marker' | 'text' | 'shape', { name: string; value: string }[]> = {
  pen: PEN_COLORS,
  text: PEN_COLORS,
  shape: PEN_COLORS,
  marker: [
    { name: 'galben', value: '#facc15' },
    { name: 'verde', value: '#4ade80' },
    { name: 'roz', value: '#f472b6' },
    { name: 'albastru', value: '#60a5fa' },
  ],
}
const SIZES: Record<Tool, number[]> = { pen: [2, 3.5, 6], marker: [12, 18, 26], text: [16, 22, 32], shape: [2, 3.5, 6], geometry: [2, 3.5, 6], eraser: [8, 16, 30] }
const SIZE_LABELS = ['Fin', 'Mediu', 'Gros']
const TEXT_SIZE_LABELS = ['Mic', 'Mediu', 'Mare']
// a font every system has: an exported page is drawn as an image, which cannot use the page's own fonts
const NOTE_FONT = 'Arial, Helvetica, sans-serif'
const NOTE_LINE = 1.3
const PAPERS: { id: Paper; label: string }[] = [
  { id: 'grid', label: 'Matematică' },
  { id: 'lines', label: 'Dictando' },
  { id: 'blank', label: 'Albă' },
]

const newScene = (): Scene => {
  const scene = emptyScene()
  // the paper is the grid here, and the plane does not move
  return { ...scene, view: { ...scene.view, grid: false, axes: false } }
}

const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const ZOOM_STEP = 1.1

function load(): Notebook {
  try {
    const raw = readLocal(KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      // a notebook saved before there were constructions has none
      const scenes = saved.pages.map((_: Item[], i: number) => saved.scenes?.[i] ?? newScene())
      return { ...saved, scenes, tools: { ...defaultInstruments(), ...saved.tools } }
    }
  } catch {
    /* storage unavailable: start empty */
  }
  return { paper: 'grid', pages: [[]], scenes: [newScene()], current: 0, tools: defaultInstruments() }
}

const uid = () => Math.random().toString(36).slice(2, 10)

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

let measurer: CanvasRenderingContext2D | null = null

/** Width and height of a text on the sheet. */
function noteBox(text: string, size: number) {
  measurer ??= document.createElement('canvas').getContext('2d')
  const lines = text.split('\n')
  if (measurer) measurer.font = `${size}px ${NOTE_FONT}`
  const w = Math.max(...lines.map((l) => measurer?.measureText(l).width ?? l.length * size * 0.6))
  return { w, h: lines.length * size * NOTE_LINE }
}

function onNote(n: Note, x: number, y: number, r: number) {
  const { w, h } = noteBox(n.text, n.size)
  return x >= n.x - r && x <= n.x + w + r && y >= n.y - r && y <= n.y + h + r
}

/** The text at this point, the one on top if they overlap. */
function noteAt(page: Item[], x: number, y: number) {
  for (let i = page.length - 1; i >= 0; i--) {
    const it = page[i]
    if (it.tool === 'text' && onNote(it, x, y, 2)) return it
  }
  return null
}

const NoteText = memo(function NoteText({ n }: { n: Note }) {
  return (
    <text fontFamily={NOTE_FONT} fontSize={n.size} fill={n.color} style={{ whiteSpace: 'pre' }}>
      {n.text.split('\n').map((line, i) => (
        <tspan key={i} x={n.x} y={round(n.y + n.size + i * n.size * NOTE_LINE)}>{line}</tspan>
      ))}
    </text>
  )
})

/** A figure as a small picture for its button. */
function ShapeIcon({ shape }: { shape: ShapeId }) {
  const sides = shapeStrokes(shape, shape === 'segment' ? [2, 14] : [2, 3], 14, shape === 'segment' ? 2 : 13)
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      {sides.map((p, i) => <polyline key={i} points={p.map(([x, y]) => x + ',' + y).join(' ')} />)}
    </svg>
  )
}

const PageItem = ({ s }: { s: Item }) => (s.tool === 'text' ? <NoteText n={s} /> : <StrokePath s={s} />)

function touches(s: Item, x: number, y: number, r: number) {
  if (s.tool === 'text') return onNote(s, x, y, r)
  const reach = r + s.size / 2
  const p = s.points
  if (p.length === 1) return Math.hypot(p[0][0] - x, p[0][1] - y) <= reach
  for (let i = 1; i < p.length; i++) if (segDist(x, y, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]) <= reach) return true
  return false
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
// what is only there while editing a construction, as on the board's own export
const EDIT_ONLY = '[data-ui], .halo, .halo-pt, .halo-box, .snap-halo, .ghost, .preview'

/** How far down the sheet a page's constructions go, in pixels. */
function sceneBottom(scene: Scene) {
  const { points } = resolve(scene)
  const toSheet = (y: number) => 300 - y * 40
  let bottom = 0
  const see = (y: number) => { bottom = Math.max(bottom, toSheet(y)) }
  for (const o of scene.objects) {
    if (o.type === 'point') { const p = points.get(o.id); if (p) see(p.y) }
    else if (o.type === 'text') see(o.y)
    else if (o.type === 'path') o.points.forEach(([, y]) => see(y))
    else if (o.type === 'circle' || o.type === 'arc') {
      const c = points.get(o.center)
      const t = points.get(o.through)
      if (c && t) see(c.y - dist(c, t))
    }
  }
  return bottom
}

/** Paint a page's constructions over its picture: they are drawn by the board itself, off-screen, formulas included. */
async function paintScene(ctx: CanvasRenderingContext2D, scene: Scene, width: number, height: number) {
  const { createRoot } = await import('react-dom/client')
  const host = document.createElement('div')
  Object.assign(host.style, { position: 'fixed', left: '-10000px', top: '0', width: width + 'px', height: height + 'px' })
  document.body.appendChild(host)
  const root = createRoot(host)
  try {
    root.render(<GeometryBoard scene={scene} onChange={() => {}} height={height} sheet={{ toolbar: null, active: false, page: 0, onActivate: () => {}, onRemember: () => {} }} />)
    let svg: SVGSVGElement | null = null
    // until it has measured itself
    for (let i = 0; i < 40 && Math.round(svg?.getBoundingClientRect().width ?? 0) !== Math.round(width); i++) {
      await new Promise((r) => setTimeout(r, 25))
      svg = host.querySelector('svg')
    }
    if (!svg) return
    const pic = await svgElementPicture(svg, EDIT_ONLY, '', true)
    const img = new Image()
    await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = pic.dataUrl })
    ctx.drawImage(img, 0, 0, width, height)
  } finally {
    root.unmount()
    host.remove()
  }
}

async function pagePicture(strokes: Item[], scene: Scene, paper: Paper, width: number, minHeight: number, title: string) {
  const { renderToStaticMarkup } = await import('react-dom/server')
  let bottom = 0
  for (const s of strokes) {
    if (s.tool === 'text') bottom = Math.max(bottom, s.y + noteBox(s.text, s.size).h)
    else for (const p of s.points) bottom = Math.max(bottom, p[1] + s.size)
  }
  const height = Math.max(minHeight, Math.ceil(Math.max(bottom, sceneBottom(scene)) + 40))
  const markup = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <PaperBackground paper={paper} />
      {strokes.map((s) => <PageItem key={s.id} s={s} />)}
    </svg>,
  )
  return rasterize(markup, width, height, title, scene.objects.length ? (ctx) => paintScene(ctx, scene, width, height) : undefined)
}

export default function NotebookPage() {
  const [nb, setNb] = useState<Notebook>(load)
  const [tool, setTool] = useState<Tool>('pen')
  const [colors, setColors] = useState({ pen: COLORS.pen[0].value, marker: COLORS.marker[0].value, text: COLORS.text[0].value, shape: COLORS.shape[0].value })
  const [sizeIdx, setSizeIdx] = useState<Record<Tool, number>>({ pen: 1, marker: 1, text: 1, shape: 1, geometry: 1, eraser: 1 })
  const [drawing, setDrawing] = useState<Stroke | null>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  // undo / redo: snapshots of one page's strokes (strokes are never mutated, so this is cheap)
  const [past, setPast] = useState<{ page: number; strokes: Item[]; scene: Scene }[]>([])
  const [future, setFuture] = useState<{ page: number; strokes: Item[]; scene: Scene }[]>([])
  // the row the construction tools go in
  const [geometryBar, setGeometryBar] = useState<HTMLElement | null>(null)
  const [shape, setShape] = useState<ShapeId | SolidId>('rectangle')
  const [draft, setDraft] = useState<Stroke[]>([])
  // the Segment figure also goes with two clicks, as Segment does on the board: where the first click was
  const segFrom = useRef<number[] | null>(null)
  useEffect(() => {
    // another tool or figure: a segment begun with one click is dropped
    segFrom.current = null
    setDraft([])
  }, [tool, shape])
  const [editing, setEditing] = useState<NoteEdit | null>(null)
  const [overNote, setOverNote] = useState(false)
  const noteInput = useRef<HTMLTextAreaElement>(null)
  // opened on click, not on press: on a touch screen the events after the press would take the focus away again
  const toOpen = useRef<NoteEdit | null>(null)
  const dropEdit = useRef(false)
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

  // zoom: the sheet keeps its own coordinates and is only shown larger or smaller, so nothing drawn or exported changes
  const [zoom, setZoom] = useState(1)
  const zoomNow = useRef(1)
  const wrapRef = useRef<HTMLDivElement>(null)
  // the size the sheet has at 100%: that of its frame, with or without scrollbars
  const [frame, setFrame] = useState<{ w: number; h: number } | null>(null)
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(() => setFrame({ w: wrap.offsetWidth, h: wrap.offsetHeight }))
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])
  /**
   * The new zoom, keeping in place the point under the pointer (without one, the middle of what is visible).
   * It is set on the page right away, without drawing anything anew: the sheet is only scaled. React, and with it
   * the constructions, learns of it once the wheel stops (`settleZoom`), so that a turn of the wheel stays light.
   */
  const applyZoom = (next: number, clientX?: number, clientY?: number) => {
    const wrap = wrapRef.current
    const sizer = wrap?.firstElementChild as HTMLElement | null | undefined
    const page = sizer?.firstElementChild as HTMLElement | null | undefined
    const z = Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next)) * 1000) / 1000
    if (!wrap || !sizer || !page || !frame || z === zoomNow.current) return false
    const r = wrap.getBoundingClientRect()
    const ax = clientX === undefined ? wrap.clientWidth / 2 : clientX - r.left
    const ay = clientY === undefined ? wrap.clientHeight / 2 : clientY - r.top
    const k = z / zoomNow.current
    const x = (wrap.scrollLeft + ax) * k - ax
    const y = (wrap.scrollTop + ay) * k - ay
    sizer.style.width = frame.w * z + 'px'
    sizer.style.height = frame.h * z + 'px'
    page.style.transform = `scale(${z})`
    wrap.scrollLeft = x
    wrap.scrollTop = y
    zoomNow.current = z
    syncFloating()
    return true
  }
  const settleTimer = useRef(0)
  const settleZoom = () => {
    window.clearTimeout(settleTimer.current)
    settleTimer.current = 0
    wrapRef.current?.classList.remove('zooming')
    setZoom(zoomNow.current)
  }
  const zoomTo = (next: number, clientX?: number, clientY?: number) => {
    if (applyZoom(next, clientX, clientY)) settleZoom()
  }
  // the turns of the wheel that came since the last frame, added up
  const wheel = useRef<{ dy: number; x: number; y: number; frame: number } | null>(null)
  // what floats above the sheet (the status of the tools, the inspector) stays in the visible part, at its usual size
  const syncFloating = () => {
    const wrap = wrapRef.current
    const page = wrap?.firstElementChild?.firstElementChild as HTMLElement | null | undefined
    if (!wrap || !page) return
    const z = zoomNow.current
    page.style.setProperty('--sheet-zoom', String(z))
    page.style.setProperty('--sheet-left', wrap.scrollLeft / z + 'px')
    page.style.setProperty('--sheet-top', wrap.scrollTop / z + 'px')
    page.style.setProperty('--sheet-right', Math.min(0, (wrap.scrollLeft + wrap.clientWidth) / z - page.offsetWidth) + 'px')
  }
  useLayoutEffect(() => syncFloating(), [zoom, frame])
  // the latest functions, for the listeners added once
  const zoomFns = useRef({ applyZoom, settleZoom })
  zoomFns.current = { applyZoom, settleZoom }
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const onWheel = (e: WheelEvent) => {
      // not passive: it must not scroll the page, nor zoom the whole window with Ctrl
      e.preventDefault()
      // a notch of a mouse wheel is about 100 (3 lines); a touchpad sends many small ones
      const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * 300 : e.deltaY
      if (wheel.current) {
        wheel.current.dy += dy
        wheel.current.x = e.clientX
        wheel.current.y = e.clientY
        return
      }
      wrap.classList.add('zooming')
      wheel.current = {
        dy, x: e.clientX, y: e.clientY,
        // all the turns of one frame make a single change
        frame: requestAnimationFrame(() => {
          const w = wheel.current!
          wheel.current = null
          // one notch: the old 10%, a touchpad: in proportion; never more than three notches at once
          const step = Math.max(-300, Math.min(300, w.dy))
          zoomFns.current.applyZoom(zoomNow.current * Math.pow(ZOOM_STEP, -step / 100), w.x, w.y)
          window.clearTimeout(settleTimer.current)
          settleTimer.current = window.setTimeout(() => zoomFns.current.settleZoom(), 180)
        }),
      }
    }
    // a click or a stroke during the wheel: everything learns the zoom first
    const onDown = () => {
      if (settleTimer.current) flushSync(() => zoomFns.current.settleZoom())
    }
    wrap.addEventListener('wheel', onWheel, { passive: false })
    wrap.addEventListener('pointerdown', onDown, { capture: true })
    return () => {
      wrap.removeEventListener('wheel', onWheel)
      wrap.removeEventListener('pointerdown', onDown, { capture: true })
      if (wheel.current) cancelAnimationFrame(wheel.current.frame)
      window.clearTimeout(settleTimer.current)
    }
  }, [])

  const strokes = nb.pages[nb.current]
  const scene = nb.scenes[nb.current]
  const blankPage = !strokes.length && !scene.objects.length
  // the edge of a solid drawn as ink breaks the lines behind it only where it was not rubbed out;
  // 7 px reaches over the gap between two dashes of a hidden edge
  const inkNear = useMemo(() => (x: number, y: number) => strokes.some((s) => s.tool !== 'text'
    && s.points.some((p, i) => i > 0 ? segDist(x, y, s.points[i - 1][0], s.points[i - 1][1], p[0], p[1]) <= 7 : Math.hypot(p[0] - x, p[1] - y) <= 7)), [strokes])
  const size = SIZES[tool][sizeIdx[tool]]
  const drawsOn = tool === 'pen' || tool === 'marker'
  // with a figure or the text tool the compass still draws; the eraser only moves the instruments
  const instDraw = drawsOn || (tool === 'eraser' ? false : 'compass')
  const newStroke = (points: number[][], pressure: boolean): Stroke =>
    ({ id: uid(), tool: tool as Stroke['tool'], color: colors[tool as Stroke['tool']], size, points, pressure })

  const instStroke = ({ points, thin }: { points: number[][]; thin?: boolean }): Stroke =>
    ({ id: uid(), tool: 'pen', color: colors.pen, size: thin ? 1.5 : SIZES.pen[sizeIdx.pen], points, pressure: true })

  const inst = useInstruments({
    tools: nb.tools,
    setTools: (update) => setNb((n) => ({ ...n, tools: update(n.tools) })),
    bounds,
    onStrokeStart: (first) => setDrawing(drawsOn ? newStroke([first], true) : instStroke({ points: [first] })),
    onStrokeChange: (points) => setDrawing((d) => d && { ...d, points }),
    onStrokes: (list) => {
      remember(nb.current, strokes)
      setPage(nb.current, [...strokes, ...list.map(instStroke)])
    },
    // an instrument just taken out is meant for drawing, as on the board
    onShown: () => { if (!drawsOn) setTool('pen') },
  })

  const saveNotebook = (data: Notebook) => writeLocal(KEY, JSON.stringify(data))

  useEffect(() => {
    const t = setTimeout(() => saveNotebook(nb), 400)
    return () => clearTimeout(t)
  }, [nb])

  // leaving the page before that delay is over must not lose the last change
  const latest = useRef(nb)
  latest.current = nb
  useEffect(() => () => saveNotebook(latest.current), [])

  const typing = editing !== null
  useEffect(() => {
    const el = noteInput.current
    if (!typing || !el) return
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [typing])

  const setPage = (page: number, next: Item[]) =>
    setNb((n) => ({ ...n, pages: n.pages.map((p, i) => (i === page ? next : p)) }))

  /** Record the page as it was, before a change, so it can be undone. */
  const remember = (page: number, before: Item[], sceneBefore = nb.scenes[page]) => {
    setPast((p) => [...p.slice(-99), { page, strokes: before, scene: sceneBefore }])
    setFuture([])
  }

  /** The text box lost the focus: keep what was typed, unless Esc was pressed. */
  const finishEdit = () => {
    const ed = editing
    setEditing(null)
    if (!ed || dropEdit.current) {
      dropEdit.current = false
      return
    }
    const text = ed.text.trimEnd()
    const page = nb.pages[ed.page]
    const old = page.find((s): s is Note => s.tool === 'text' && s.id === ed.id)
    if (old ? old.text === text : !text.trim()) return
    remember(ed.page, page)
    if (!text.trim()) return setPage(ed.page, page.filter((s) => s !== old))
    const note: Note = { id: ed.id ?? uid(), tool: 'text', color: ed.color, size: ed.size, x: ed.x, y: ed.y, text }
    setPage(ed.page, old ? page.map((s) => (s === old ? note : s)) : [...page, note])
  }

  const undo = () => {
    const last = past[past.length - 1]
    if (!last) return
    setPast(past.slice(0, -1))
    setFuture((f) => [...f, { page: last.page, strokes: nb.pages[last.page], scene: nb.scenes[last.page] }])
    setNb((n) => ({
      ...n,
      current: last.page,
      pages: n.pages.map((p, i) => (i === last.page ? last.strokes : p)),
      scenes: n.scenes.map((s, i) => (i === last.page ? last.scene : s)),
    }))
  }

  const redo = () => {
    const next = future[future.length - 1]
    if (!next) return
    setFuture(future.slice(0, -1))
    setPast((p) => [...p, { page: next.page, strokes: nb.pages[next.page], scene: nb.scenes[next.page] }])
    setNb((n) => ({
      ...n,
      current: next.page,
      pages: n.pages.map((p, i) => (i === next.page ? next.strokes : p)),
      scenes: n.scenes.map((s, i) => (i === next.page ? next.scene : s)),
    }))
  }

  const clearPage = () => {
    if (blankPage) return
    remember(nb.current, strokes)
    setNb((n) => ({
      ...n,
      pages: n.pages.map((p, i) => (i === n.current ? [] : p)),
      scenes: n.scenes.map((s, i) => (i === n.current ? newScene() : s)),
    }))
  }

  const addPage = () => setNb((n) => ({ ...n, pages: [...n.pages, []], scenes: [...n.scenes, newScene()], current: n.pages.length }))

  const clearAll = async () => {
    if (!(await confirmDialog('Golești tot caietul? Se șterg toate paginile și nu se mai poate anula.', 'Golește tot'))) return
    setPast([])
    setFuture([])
    setNb((n) => ({ ...n, pages: [[]], scenes: [newScene()], current: 0 }))
  }

  const deletePage = async () => {
    if (nb.pages.length < 2) return clearPage()
    if (!blankPage && !(await confirmDialog('Ștergi pagina cu tot ce e scris pe ea?', 'Șterge pagina'))) return
    // page numbers in the undo history would point to the wrong pages after this
    setPast([])
    setFuture([])
    setNb((n) => ({
      ...n,
      pages: n.pages.filter((_, i) => i !== n.current),
      scenes: n.scenes.filter((_, i) => i !== n.current),
      current: Math.max(0, n.current - 1),
    }))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // also while typing: otherwise Ctrl with + or - would zoom the whole window
      if (e.ctrlKey || e.metaKey) {
        const change = e.key === '+' || e.key === '=' ? ZOOM_STEP : e.key === '-' ? 1 / ZOOM_STEP : e.key === '0' ? 0 : null
        if (change !== null) {
          e.preventDefault()
          zoomTo(change ? zoomNow.current * change : 1)
          return
        }
      }
      if (['INPUT', 'TEXTAREA', 'SELECT', 'MATH-FIELD'].includes((e.target as HTMLElement).tagName)) return
      const k = e.key.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo() }
      else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo() }
      else if (e.ctrlKey || e.metaKey || e.altKey) return
      else if (k === 'p') setTool('pen')
      else if (k === 'm') setTool('marker')
      else if (k === 't') setTool('text')
      else if (k === 'f') setTool('shape')
      else if (k === 'e') setTool('eraser')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pointAt = (e: { clientX: number; clientY: number; pressure: number; pointerType: string }) => {
    const r = svgRef.current!.getBoundingClientRect()
    return [round((e.clientX - r.left) / zoomNow.current), round((e.clientY - r.top) / zoomNow.current), e.pointerType === 'pen' ? round(e.pressure || 0.5, 2) : 0.5]
  }

  // where the eraser was at the last event: it erases along the way from there, however fast it moves
  const eraserWas = useRef<number[] | null>(null)
  /** The eraser takes away only what it passes over: a line is cut there, a text goes whole. */
  const eraseAt = (x: number, y: number) => {
    const from = eraserWas.current ?? [x, y]
    eraserWas.current = [x, y]
    setNb((n) => {
      const page = n.pages[n.current]
      let changed = false
      const kept = page.flatMap((s): Item[] => {
        if (s.tool === 'text') {
          if (!touches(s, x, y, size)) return [s]
          changed = true
          return []
        }
        const pieces = eraseLine(s.points, s.size, from, [x, y], size)
        if (!pieces) return [s]
        changed = true
        return pieces.map((points, i) => ({ ...s, id: i ? uid() : s.id + '-' + uid(), points }))
      })
      return changed ? { ...n, pages: n.pages.map((p, i) => (i === n.current ? kept : p)) } : n
    })
  }

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    toOpen.current = null
    // a press outside the text box only ends the typing: the box loses the focus right after this
    if (typing || active.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    try {
      // keep receiving moves when the pen leaves the sheet mid-stroke
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer already gone: draw without capture */
    }
    const p = pointAt(e)
    const base = { pointerId: e.pointerId, start: p, before: strokes }
    if (inst.down(e.pointerId, p, instDraw, size / 2 + 1)) {
      active.current = { ...base, mode: 'inst' }
    } else if (tool === 'text') {
      active.current = { ...base, mode: 'note', note: noteAt(strokes, p[0], p[1]) ?? undefined }
    } else if (tool === 'shape') {
      // the second click of a segment: it ends where this press lets go
      active.current = { ...base, start: (shape === 'segment' && segFrom.current) || p, mode: 'shape' }
      segFrom.current = null
    } else if (tool === 'eraser') {
      active.current = { ...base, mode: 'erase' }
      eraserWas.current = null
      eraseAt(p[0], p[1])
    } else {
      active.current = { ...base, mode: 'draw' }
      setDrawing(newStroke([p], e.pointerType === 'pen'))
    }
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const [px, py] = pointAt(e)
    const a = active.current
    if (!a) inst.hoverAt(px, py, instDraw)
    if (!a && segFrom.current && tool === 'shape' && shape === 'segment') {
      return setDraft(shapeStrokes('segment', segFrom.current, px, py).map((points) =>
        ({ id: uid(), tool: 'pen', color: colors.shape, size, points, pressure: true })))
    }
    if (tool === 'text') setOverNote(!!noteAt(strokes, px, py))
    // over an instrument the eraser moves it, so it does not show the eraser circle
    if (tool === 'eraser') setCursor(!a && inst.hover ? null : { x: px, y: py })
    if (!a || a.pointerId !== e.pointerId) return
    if (a.mode === 'inst') return inst.move(e.pointerId, px, py, e.shiftKey)
    if (a.mode === 'shape') {
      const solid = SOLIDS.find((f) => f.id === shape)
      const strokes = solid ? solidStrokes(solid.id, a.start[0], a.start[1], px, py) : shapeStrokes(shape as ShapeId, a.start, px, py)
      return setDraft(strokes.map((points) =>
        ({ id: uid(), tool: 'pen', color: colors.shape, size, points, pressure: true })))
    }
    if (a.mode === 'note') {
      const n = a.note
      // a slip of the hand while clicking is not a move
      if (!n || (nb.pages[nb.current] === a.before && Math.hypot(px - a.start[0], py - a.start[1]) < 4)) return
      const moved = { ...n, x: round(Math.max(0, n.x + px - a.start[0])), y: round(Math.max(0, n.y + py - a.start[1])) }
      return setPage(nb.current, a.before.map((s) => (s === n ? moved : s)))
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
    const marks = inst.up(e.pointerId)
    // the pointer may have left the instrument during the drag: don't keep its cursor until the next move
    const [ux, uy] = pointAt(e)
    inst.hoverAt(ux, uy, instDraw)
    if (a.mode === 'shape') {
      // a click without a drag on Segment is its first point: the segment follows the mouse until the next click
      if (shape === 'segment' && e.type === 'pointerup' && Math.hypot(ux - a.start[0], uy - a.start[1]) < 4) {
        segFrom.current = a.start
        return
      }
      setDraft([])
      // a click without a drag leaves nothing behind
      if (e.type === 'pointerup' && Math.hypot(ux - a.start[0], uy - a.start[1]) >= 4) {
        remember(nb.current, a.before)
        const wx = (px: number) => (px - SHEET_ORIGIN.x) / PX_PER_CM
        const wy = (py: number) => (SHEET_ORIGIN.y - py) / PX_PER_CM
        const solid = SOLIDS.find((f) => f.id === shape)
        // a solid is not ink: it lives on the constructions layer, as on the board, so that it can be turned in
        // space, its hidden edges stay right, and lines behind it are broken; Șterge takes it away, not the eraser
        const added = solid
          ? solidObjects(solid.id, wx(a.start[0]), wy(a.start[1]), wx(ux), wy(uy), scene.objects, { color: colors.shape, group: uid() })
          // a figure is ink; its corners go on the constructions layer, to build on with Construcții
          : shapePoints(shape as ShapeId, a.start, ux, uy, scene.objects, ([px, py]) => [wx(px), wy(py)], { color: colors.shape, group: uid(), locked: true })
        // drawn to where the pointer let go, not to where the last move left the preview
        if (!solid) setPage(nb.current, [...a.before, ...shapeStrokes(shape as ShapeId, a.start, ux, uy).map((points): Stroke =>
          ({ id: uid(), tool: 'pen', color: colors.shape, size, points, pressure: true }))])
        setNb((n) => ({ ...n, scenes: n.scenes.map((s, i) => (i === n.current ? { ...s, objects: [...s.objects, ...added] } : s)) }))
      }
      return
    }
    if (a.mode === 'note') {
      if (nb.pages[nb.current] !== a.before) remember(nb.current, a.before)
      else if (e.type === 'pointerup') {
        const n = a.note
        toOpen.current = n
          ? { page: nb.current, id: n.id, color: n.color, size: n.size, x: n.x, y: n.y, text: n.text }
          : { page: nb.current, id: null, color: colors.text, size, x: ux, y: round(Math.max(0, uy - size * NOTE_LINE / 2)), text: '' }
      }
      return
    }
    if (a.mode === 'erase') {
      if (nb.pages[nb.current] !== a.before) remember(nb.current, a.before)
      return
    }
    if (drawing) {
      remember(nb.current, a.before)
      setPage(nb.current, [...a.before, drawing, ...marks.map(instStroke)])
    }
    setDrawing(null)
  }

  const exportAs = async (kind: 'pdf' | 'docx' | 'png') => {
    // the size of the sheet, whatever the zoom
    if (!bounds) return
    const { w: width, h: height } = bounds
    const pages = kind === 'png' ? [nb.current] : nb.pages.map((_, i) => i).filter((i) => nb.pages[i].length || nb.scenes[i].objects.length)
    setBusy(true)
    try {
      const pictures = []
      for (const i of pages) pictures.push(await pagePicture(nb.pages[i], nb.scenes[i], nb.paper, width, height, `Pagina ${i + 1}`))
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

  const empty = nb.pages.every((p, i) => !p.length && !nb.scenes[i].objects.length)
  const editBox = editing && noteBox(editing.text, editing.size)

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
          <button className="btn" onClick={() => exportAs('png')} disabled={blankPage || busy} title="Pagina curentă ca imagine PNG">🖼️ Imagine</button>
        </div>
      </div>

      <div className="notebook">
        <div className="board-toolbar notebook-toolbar">
          <div className="seg">
            <button className={tool === 'pen' ? 'active' : ''} onClick={() => setTool('pen')} title="Pix (P)"><ToolIcon name="pen" />Pix</button>
            <button className={tool === 'marker' ? 'active' : ''} onClick={() => setTool('marker')} title="Evidențiator (M)"><ToolIcon name="marker" />Evidențiator</button>
            <button className={tool === 'text' ? 'active' : ''} onClick={() => setTool('text')} title="Text (T): clic pe foaie și scrii; clic pe un text ca să-l modifici, trage de el ca să-l muți"><ToolIcon name="text" />Text</button>
            <button className={tool === 'eraser' ? 'active' : ''} onClick={() => setTool('eraser')} title="Radieră (E): șterge doar porțiunea pe care treci; un text atins se șterge tot"><ToolIcon name="eraser" />Radieră</button>
          </div>
          {tool !== 'eraser' && tool !== 'geometry' && (
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
          {tool !== 'geometry' && <div className="seg">
            {(tool === 'text' ? TEXT_SIZE_LABELS : SIZE_LABELS).map((l, i) => (
              <button key={l} className={sizeIdx[tool] === i ? 'active' : ''} onClick={() => setSizeIdx({ ...sizeIdx, [tool]: i })}>{l}</button>
            ))}
          </div>}
          <span className="toolbar-sep" />
          <button className="btn small" onClick={undo} disabled={!past.length} title="Anulează (Ctrl+Z)">↶ Anulează</button>
          <button className="btn small" onClick={redo} disabled={!future.length} title="Refă (Ctrl+Y)">↷ Refă</button>
          <button className="btn small" onClick={clearPage} disabled={blankPage} title="Șterge tot de pe pagina curentă (se poate anula)">🧹 Golește pagina</button>
          <button className="btn small danger" onClick={clearAll} disabled={empty && nb.pages.length === 1} title="Șterge toate paginile caietului">Golește tot caietul</button>
          <span className="toolbar-sep" />
          <select value={nb.paper} onChange={(e) => setNb({ ...nb, paper: e.target.value as Paper })} title="Tipul foii">
            {PAPERS.map((p) => <option key={p.id} value={p.id}>Foaie: {p.label}</option>)}
          </select>
          <span className="notebook-zoom-ctl">
            <button className="btn small" disabled={zoom <= ZOOM_MIN} onClick={() => zoomTo(zoom / ZOOM_STEP)} title="Micșorează (Ctrl și -, sau rotița mouse-ului)" aria-label="Micșorează">−</button>
            <button className="btn small" onClick={() => zoomTo(1)} title="Înapoi la 100% (Ctrl+0)">{Math.round(zoom * 100)}%</button>
            <button className="btn small" disabled={zoom >= ZOOM_MAX} onClick={() => zoomTo(zoom * ZOOM_STEP)} title="Mărește (Ctrl și +, sau rotița mouse-ului)" aria-label="Mărește">+</button>
          </span>
          <span className="notebook-pages">
            <button className="btn small" disabled={nb.current === 0} onClick={() => setNb({ ...nb, current: nb.current - 1 })} title="Pagina anterioară">◀</button>
            <span>Pagina {nb.current + 1} / {nb.pages.length}</span>
            <button className="btn small" disabled={nb.current === nb.pages.length - 1} onClick={() => setNb({ ...nb, current: nb.current + 1 })} title="Pagina următoare">▶</button>
            <button className="btn small" onClick={addPage}>+ Pagină</button>
            <button className="btn small danger" onClick={deletePage} title="Șterge pagina">🗑</button>
          </span>
        </div>

        <div className="board-toolbar notebook-toolbar shapes-bar">
          <span className="muted">Figuri:</span>
          {SHAPES.map((f) => (
            <button
              key={f.id}
              className={'btn small icon' + (tool === 'shape' && shape === f.id ? ' active' : '')}
              title={f.label + ': trage cu mouse-ul de la un colț la cel opus'}
              aria-label={f.label}
              onClick={() => { setShape(f.id); setTool('shape') }}
            >
              <ShapeIcon shape={f.id} />
            </button>
          ))}
        </div>

        <div className="board-toolbar notebook-toolbar shapes-bar">
          <span className="muted">Corpuri:</span>
          {SOLIDS.map((f) => (
            <button
              key={f.id}
              className={'btn small icon' + (tool === 'shape' && shape === f.id ? ' active' : '')}
              title={f.label + ': trage cu mouse-ul de la un colț la cel opus'}
              aria-label={f.label}
              onClick={() => { setShape(f.id); setTool('shape') }}
            >
              <SolidIcon solid={f.id} />
            </button>
          ))}
        </div>

        <div ref={setGeometryBar} />

        <InstrumentsBar inst={inst} />

        <div className="notebook-sheet-wrap" ref={wrapRef} onScroll={syncFloating}>
        <div style={frame ? { width: frame.w * zoom, height: frame.h * zoom } : { height: '100%' }}>
        <div className="notebook-page" style={frame ? { width: frame.w, height: frame.h, transform: `scale(${zoom})` } : { height: '100%' }}>
        <svg
          ref={svgRef}
          className={'notebook-sheet tool-' + tool + (tool === 'text' && overNote ? ' over-note' : '') + (inst.hover ? ' over-' + inst.hover : '')}
          onClick={() => {
            if (toOpen.current) setEditing(toOpen.current)
            toOpen.current = null
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => { setCursor(null); inst.setHover(null) }}
        >
          <PaperBackground paper={nb.paper} />
          {strokes.map((s) => s.id !== editing?.id && <PageItem key={s.id} s={s} />)}
          {drawing && <StrokePath s={drawing} />}
          {draft.map((d) => <StrokePath key={d.id} s={d} />)}
          {tool === 'eraser' && cursor && (
            <circle className="eraser-cursor" cx={cursor.x} cy={cursor.y} r={size} fill="rgba(255,255,255,.6)" stroke="#6b7280" strokeDasharray="3 3" />
          )}
        </svg>
        <div className={'sheet-constructions' + (tool === 'geometry' ? ' active' : '')}>
          <GeometryBoard
            scene={scene}
            height="100%"
            onChange={(next) => setNb((n) => ({ ...n, scenes: n.scenes.map((s, i) => (i === n.current ? next : s)) }))}
            sheet={{
              toolbar: geometryBar,
              active: tool === 'geometry',
              page: nb.current,
              onActivate: () => setTool('geometry'),
              onRemember: (before) => remember(nb.current, strokes, before),
              zoom,
              inkNear,
            }}
          />
        </div>
        {/* the instruments lie over the constructions too, as they would over the page; they are reached by where the pointer is, not through this layer */}
        <svg className="sheet-instruments" aria-hidden>
          <InstrumentsLayer tools={nb.tools} bounds={bounds} />
          {inst.hint && <text className="nb-hint" x={inst.hint.x} y={inst.hint.y}>{inst.hint.text}</text>}
        </svg>
        {editing && editBox && (
          <textarea
            ref={noteInput}
            className="nb-note-input"
            wrap="off"
            spellCheck={false}
            placeholder="Scrie aici…"
            value={editing.text}
            style={{
              left: editing.x,
              top: editing.y,
              color: editing.color,
              fontFamily: NOTE_FONT,
              fontSize: editing.size,
              lineHeight: NOTE_LINE,
              width: Math.max(editBox.w, editing.size * 6) + editing.size,
              height: Math.max(editBox.h, editing.size * NOTE_LINE),
            }}
            onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            onBlur={finishEdit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') dropEdit.current = true
              if (e.key === 'Escape' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) e.currentTarget.blur()
            }}
          />
        )}
        </div>
        </div>
        </div>
      </div>
      {dialog}
    </div>
  )
}
