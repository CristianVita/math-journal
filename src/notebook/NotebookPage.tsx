// Freehand notebook: write with the mouse, a pen tablet or a finger, like with a pen on paper.
// Strokes are kept as points and drawn as SVG outlines (perfect-freehand), so they stay sharp and small to store.
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { getStroke } from 'perfect-freehand'
import { saveFile } from '../platform'
import { rasterize, saveDocx, savePdf, today } from '../export/exportDoc'
import { usePrompt } from '../components/PromptDialog'
import { defaultInstruments, InstrumentsLayer, type Bounds, type Instruments } from './instruments'
import { InstrumentsBar, linePoints, round, useInstruments } from './useInstruments'

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

/** What the pointer is doing between pointerdown and pointerup; 'inst' = an instrument has it. */
interface Active { pointerId: number; start: number[]; before: Stroke[]; mode: 'draw' | 'erase' | 'inst' }

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

function touches(s: Stroke, x: number, y: number, r: number) {
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
  const newStroke = (points: number[][], pressure: boolean): Stroke =>
    ({ id: uid(), tool: tool as Stroke['tool'], color: colors[tool as Stroke['tool']], size, points, pressure })

  const inst = useInstruments({
    tools: nb.tools,
    setTools: (update) => setNb((n) => ({ ...n, tools: update(n.tools) })),
    bounds,
    onStrokeStart: (first) => setDrawing(newStroke([first], true)),
    onStrokeChange: (points) => setDrawing((d) => d && { ...d, points }),
    onStrokes: (list) => {
      remember(nb.current, strokes)
      setPage(nb.current, [...strokes, ...list.map(({ points, thin }): Stroke =>
        ({ id: uid(), tool: 'pen', color: colors.pen, size: thin ? 1.5 : SIZES.pen[sizeIdx.pen], points, pressure: true }))])
    },
  })

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
    if (inst.down(e.pointerId, p, tool !== 'eraser', size / 2 + 1)) {
      active.current = { ...base, mode: 'inst' }
    } else if (tool === 'eraser') {
      active.current = { ...base, mode: 'erase' }
      eraseAt(p[0], p[1])
    } else {
      active.current = { ...base, mode: 'draw' }
      setDrawing(newStroke([p], e.pointerType === 'pen'))
    }
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const [px, py] = pointAt(e)
    const a = active.current
    if (!a) inst.hoverAt(px, py, tool !== 'eraser')
    // over an instrument the eraser moves it, so it does not show the eraser circle
    if (tool === 'eraser') setCursor(!a && inst.hover ? null : { x: px, y: py })
    if (!a || a.pointerId !== e.pointerId) return
    if (a.mode === 'inst') return inst.move(e.pointerId, px, py, e.shiftKey)

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
    inst.up(e.pointerId)
    // the pointer may have left the instrument during the drag: don't keep its cursor until the next move
    const [ux, uy] = pointAt(e)
    inst.hoverAt(ux, uy, tool !== 'eraser')
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

        <InstrumentsBar inst={inst} />

        <svg
          ref={svgRef}
          className={'notebook-sheet tool-' + tool + (inst.hover ? ' over-' + inst.hover : '')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={() => { setCursor(null); inst.setHover(null) }}
        >
          <PaperBackground paper={nb.paper} />
          {strokes.map((s) => <StrokePath key={s.id} s={s} />)}
          <InstrumentsLayer tools={nb.tools} bounds={bounds} />
          {drawing && <StrokePath s={drawing} />}
          {inst.hint && <text className="nb-hint" x={inst.hint.x} y={inst.hint.y}>{inst.hint.text}</text>}
          {tool === 'eraser' && cursor && (
            <circle className="eraser-cursor" cx={cursor.x} cy={cursor.y} r={size} fill="rgba(255,255,255,.6)" stroke="#6b7280" strokeDasharray="3 3" />
          )}
        </svg>
      </div>
      {dialog}
    </div>
  )
}
