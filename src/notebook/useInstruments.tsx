// What the drawing instruments do under the pointer, shared by the notebook and the board. Everything here works in
// "sheet" coordinates; the page converts its pointer to them, shows the layer on top and keeps whatever gets drawn.
import { useRef, useState } from 'react'
import { ToolIcon } from '../components/ToolIcon'
import {
  COMPASS_MAX_R, dockedPose, findDock, findSquareDock, formatDms, hitTest, projectOnEdge, protractorAngle, protractorPoint,
  PROT_R, PX_PER_CM, rulerOnSquareSide, slideDock, slideSquareDock, squareDockedPose, squareOnRulerEnd,
  type Bounds, type Edge, type Hit, type InstId, type Instruments, type Pt,
} from './instruments'

/** What the pointer is doing with an instrument between pointerdown and pointerup. */
type Active = { pointerId: number } & (
  /** held: this instrument came to rest on the other one during this drag, so the other holds still until it is released */
  | { mode: 'move'; id: InstId; dx: number; dy: number; held?: boolean }
  /** turning around `pivot` (sheet point); x0, y0, rot0 = where the instrument was when grabbed */
  | { mode: 'rotate'; id: InstId; pivot: Pt; a0: number; rot0: number; x0: number; y0: number }
  | { mode: 'edge'; id: InstId; edge: Edge; from: Pt; off: number }
  | { mode: 'ray' }
  | { mode: 'radius' }
  /** compass arc: from angle `from`, `sweep` degrees so far (signed, at most a full turn), `last` = pointer angle */
  | { mode: 'arc'; from: number; sweep: number; last: number }
)

export const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d
/** Keep a coordinate on the sheet, which starts at `from` and is `size` long. */
const clampTo = (v: number, from: number, size?: number) => (size ? Math.min(from + size - 10, Math.max(from + 10, v)) : v)

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
export function linePoints(a: number[], x: number, y: number) {
  const n = Math.max(2, Math.ceil(Math.hypot(x - a[0], y - a[1]) / 4))
  return Array.from({ length: n + 1 }, (_, i) => [round(a[0] + ((x - a[0]) * i) / n), round(a[1] + ((y - a[1]) * i) / n), 0.5])
}

/** A small X on the center of a circle or arc, to stay on the sheet after the compass is moved. */
function centerMark(c: Instruments['compass']) {
  const arm = 4
  return [
    { points: linePoints([c.x - arm, c.y - arm], c.x + arm, c.y + arm), thin: true },
    { points: linePoints([c.x - arm, c.y + arm], c.x + arm, c.y - arm), thin: true },
  ]
}

interface Options {
  tools: Instruments
  setTools: (update: (tools: Instruments) => Instruments) => void
  /** the part of the sheet in view */
  bounds?: Bounds
  /** a line or an arc begins at this point */
  onStrokeStart: (first: number[]) => void
  /** the line or arc begun so far, whole */
  onStrokeChange: (points: number[][]) => void
  /** finished figures in one go; thin: a thin mark rather than a line */
  onStrokes: (strokes: { points: number[][]; thin?: boolean }[]) => void
  /** the sheet can be moved, so an instrument out of view can still be reached: no need to hold it in view */
  roams?: boolean
  /** an instrument was just put on the sheet */
  onShown?: () => void
}

export function useInstruments({ tools, setTools, bounds, onStrokeStart, onStrokeChange, onStrokes, onShown, roams }: Options) {
  const keep = roams ? (v: number, _from: number, _size?: number) => v : clampTo
  // live readout next to the pointer: a length along the ruler, an angle on the protractor
  const [hint, setHint] = useState<{ x: number; y: number; text: string } | null>(null)
  const [hover, setHover] = useState<Hit['kind'] | null>(null)
  const active = useRef<Active | null>(null)

  const setInst = (id: InstId, patch: Partial<Instruments[InstId]>) =>
    setTools((current) => {
      const next: Instruments = { ...current, [id]: { ...current[id], ...patch } }
      const { dock } = next.ruler
      const squareDock = next.square.dock
      if ((id === 'ruler' || id === 'square') && ('visible' in patch || 'shape' in patch)) {
        // hidden, or the square's sides changed: both stay where they are, no longer resting on each other
        next.ruler = { ...next.ruler, dock: undefined }
        next.square = { ...next.square, dock: undefined }
      } else if (dock && id === 'square') {
        // the ruler resting on the set square goes with it
        next.ruler = { ...next.ruler, ...dockedPose(next, dock) }
      } else if (squareDock && id === 'ruler') {
        // and the other way round
        next.square = { ...next.square, ...squareDockedPose(next, squareDock) }
      }
      return next
    })

  /** Drag the square: it rests on the ruler when it comes close, slides along its edge, and comes off when pulled away. */
  const moveSquare = (a: { dx: number; dy: number; held?: boolean }, px: number, py: number) => {
    const x = px - a.dx, y = py - a.dy
    const was = tools.square.dock
    const { ruler } = tools
    // a ruler already resting on the square at the start of the drag simply goes with it
    if (a.held || (!was && !ruler.dock)) {
      const moved = { ...tools, square: { ...tools.square, x, y } }
      const end = a.held && ruler.dock ? slideDock(moved, ruler.dock, ruler.x, ruler.y) : findDock(moved, ruler.x, ruler.y)
      if (end) {
        const pose = squareOnRulerEnd(tools, end)
        if (!a.held) {
          a.dx = px - pose.x
          a.dy = py - pose.y
          a.held = true
        }
        setInst('ruler', { dock: end })
        setInst('square', pose)
        return setHint({ x: px + 16, y: py - 12, text: '⟂ pe riglă' })
      }
      if (a.held) {
        a.held = false
        setInst('ruler', { dock: undefined })
      }
    }
    const dock = was ? slideSquareDock(tools, was, x, y) : findSquareDock(tools, x, y)
    if (!dock) {
      setInst('square', { x: round(keep(x, bounds?.x0 ?? 0, bounds?.w)), y: round(keep(y, bounds?.y0 ?? 0, bounds?.h)), dock: undefined })
      return setHint(null)
    }
    const pose = squareDockedPose(tools, dock)
    if (!was) {
      // it jumped into place: from here on the drag is measured from where it landed
      a.dx = px - pose.x
      a.dy = py - pose.y
    }
    setInst('square', { ...pose, dock })
    setHint({ x: px + 16, y: py - 12, text: '∥ pe riglă' })
  }

  /** Drag the ruler: it rests on the set square when it comes close, slides along the side, and comes off when pulled away. */
  const moveRuler = (a: { dx: number; dy: number; held?: boolean }, px: number, py: number) => {
    const x = px - a.dx, y = py - a.dy
    const was = tools.ruler.dock
    const { square } = tools
    const dock = was ? slideDock(tools, was, x, y) : a.held ? null : findDock(tools, x, y)
    // not on a side with a short end: maybe a long edge on a side. A square already resting on the ruler simply goes with it.
    if (!dock && (a.held || (!was && !square.dock))) {
      const moved = { ...tools, ruler: { ...tools.ruler, x, y } }
      const edge = a.held && square.dock ? slideSquareDock(moved, square.dock, square.x, square.y) : findSquareDock(moved, square.x, square.y)
      if (edge) {
        const pose = rulerOnSquareSide(tools, edge)
        if (!a.held) {
          a.dx = px - pose.x
          a.dy = py - pose.y
          a.held = true
        }
        setInst('square', { dock: edge })
        setInst('ruler', pose)
        return setHint({ x: px + 16, y: py - 12, text: '∥ pe echer' })
      }
      if (a.held) {
        a.held = false
        setInst('square', { dock: undefined })
      }
    }
    if (!dock) {
      setInst('ruler', { x: round(keep(x, bounds?.x0 ?? 0, bounds?.w)), y: round(keep(y, bounds?.y0 ?? 0, bounds?.h)), dock: undefined })
      return setHint(null)
    }
    const pose = dockedPose(tools, dock)
    if (!was) {
      // it jumped into place: from here on the drag is measured from where it landed
      a.dx = px - pose.x
      a.dy = py - pose.y
    }
    setInst('ruler', { ...pose, dock })
    setHint({ x: px + 16, y: py - 12, text: '⟂ pe echer' })
  }

  /**
   * The pointer went down at `p`. True when an instrument took it. draw: it can draw (false: only move the instruments);
   * off: how far from an edge a line runs, half its width.
   */
  const down = (pointerId: number, p: number[], draw: boolean | 'compass', off: number) => {
    const hit = hitTest(tools, p[0], p[1], draw, bounds)
    if (!hit) return false
    const base = { pointerId }
    if (hit.kind === 'radius') {
      active.current = { ...base, mode: 'radius' }
    } else if (hit.kind === 'pencil') {
      const c = tools.compass
      // the turn is measured from where it was grabbed (grip or pencil), around the needle
      const grabbed = (Math.atan2(p[1] - c.y, p[0] - c.x) * 180) / Math.PI
      active.current = { ...base, mode: 'arc', from: c.rot, sweep: 0, last: grabbed }
      onStrokeStart(compassPoint(c, c.rot))
    } else if (hit.kind === 'knob') {
      const i = tools[hit.id]
      const [qx, qy] = hit.pivot
      active.current = { ...base, mode: 'rotate', id: hit.id, pivot: hit.pivot, a0: Math.atan2(p[1] - qy, p[0] - qx), rot0: i.rot, x0: i.x, y0: i.y }
      // turning the ruler or the square lifts it off the other; on release it rests there again if it is still close
      if (hit.id === 'ruler' || hit.id === 'square') setInst(hit.id, { dock: undefined })
    } else if (hit.kind === 'body') {
      const i = tools[hit.id]
      active.current = { ...base, mode: 'move', id: hit.id, dx: p[0] - i.x, dy: p[1] - i.y }
    } else if (hit.kind === 'edge') {
      const from = projectOnEdge(tools[hit.id], hit.edge, p[0], p[1], off)
      active.current = { ...base, mode: 'edge', id: hit.id, edge: hit.edge, from, off }
      onStrokeStart([...from, 0.5])
    } else {
      const c = tools.protractor
      active.current = { ...base, mode: 'ray' }
      onStrokeStart([c.x, c.y, 0.5])
    }
    return true
  }

  /** The pointer moved while an instrument has it. */
  const move = (pointerId: number, px: number, py: number, shiftKey: boolean) => {
    const a = active.current
    if (!a || a.pointerId !== pointerId) return
    if (a.mode === 'move' && a.id === 'ruler') return moveRuler(a, px, py)
    if (a.mode === 'move' && a.id === 'square') return moveSquare(a, px, py)
    // the pivot stays on the sheet, so an instrument can't be dragged away out of reach
    if (a.mode === 'move') return setInst(a.id, { x: round(keep(px - a.dx, bounds?.x0 ?? 0, bounds?.w)), y: round(keep(py - a.dy, bounds?.y0 ?? 0, bounds?.h)) })
    if (a.mode === 'radius') {
      const c = tools.compass
      // opening to the millimetre (4 px), pointing where the handle is dragged
      const r = Math.min(COMPASS_MAX_R, Math.max(8, Math.round((Math.hypot(px - c.x, py - c.y) - 24) / 4) * 4))
      setInst('compass', { r, rot: round((Math.atan2(py - c.y, px - c.x) * 180) / Math.PI) })
      return setHint({ x: px + 16, y: py - 12, text: 'r = ' + (r / PX_PER_CM).toFixed(1).replace('.', ',') + ' cm' })
    }
    if (a.mode === 'arc') {
      const c = tools.compass
      const angle = (Math.atan2(py - c.y, px - c.x) * 180) / Math.PI
      // follow the pointer around the needle; the turn is unwrapped so a whole circle can be drawn
      const step = ((angle - a.last + 540) % 360) - 180
      a.sweep = Math.max(-360, Math.min(360, a.sweep + step))
      a.last = angle
      setInst('compass', { rot: round((((a.from + a.sweep) % 360) + 360) % 360) })
      onStrokeChange(arcPoints(c, a.from, a.sweep))
      return setHint({ x: px + 16, y: py - 12, text: formatDms(Math.round(Math.abs(a.sweep))) })
    }
    if (a.mode === 'rotate') {
      const [qx, qy] = a.pivot
      let rot = a.rot0 + ((Math.atan2(py - qy, px - qx) - a.a0) * 180) / Math.PI
      rot = ((rot % 360) + 360) % 360
      // stick to multiples of 15° (0°, 45°, 90°…) when close, unless Shift is held
      const snap = Math.round(rot / 15) * 15
      if (!shiftKey && Math.abs(rot - snap) < 2) rot = snap % 360
      // turn the instrument's position around the pivot by the same angle, so the pivot stays put
      const t = ((rot - a.rot0) * Math.PI) / 180
      const dx = a.x0 - qx, dy = a.y0 - qy
      setInst(a.id, { rot: round(rot), x: round(qx + dx * Math.cos(t) - dy * Math.sin(t), 2), y: round(qy + dx * Math.sin(t) + dy * Math.cos(t), 2) })
      return setHint({ x: px + 16, y: py - 12, text: formatDms(round(rot)) })
    }
    if (a.mode === 'edge') {
      const to = projectOnEdge(tools[a.id], a.edge, px, py, a.off)
      onStrokeChange(linePoints(a.from, to[0], to[1]))
      const cm = Math.hypot(to[0] - a.from[0], to[1] - a.from[1]) / PX_PER_CM
      return setHint({ x: px + 16, y: py - 12, text: cm.toFixed(1).replace('.', ',') + ' cm' })
    }
    const c = tools.protractor
    const { deg, r } = protractorAngle(c, px, py)
    // whole degrees; Shift = free angle (to the minute)
    const shown = shiftKey ? Math.round(deg * 60) / 60 : Math.round(deg)
    const [x, y] = protractorPoint(c, shown, r)
    onStrokeChange(linePoints([c.x, c.y], x, y))
    setHint({ x: px + 16, y: py - 12, text: formatDms(shown) })
  }

  /**
   * The pointer went up: an instrument just turned may come to rest on the other one. Returns what goes on the sheet
   * together with the line or arc just finished, to be undone as one with it.
   */
  const up = (pointerId: number): { points: number[][]; thin?: boolean }[] => {
    const a = active.current
    if (!a || a.pointerId !== pointerId) return []
    active.current = null
    setHint(null)
    if (a.mode === 'rotate' && a.id === 'ruler') {
      const dock = findDock(tools, tools.ruler.x, tools.ruler.y)
      const edge = !dock && !tools.square.dock && findSquareDock(tools, tools.square.x, tools.square.y)
      if (dock) setInst('ruler', { ...dockedPose(tools, dock), dock })
      else if (edge) {
        setInst('square', { dock: edge })
        setInst('ruler', rulerOnSquareSide(tools, edge))
      }
    }
    if (a.mode === 'rotate' && a.id === 'square') {
      const dock = findSquareDock(tools, tools.square.x, tools.square.y)
      const end = !dock && !tools.ruler.dock && findDock(tools, tools.ruler.x, tools.ruler.y)
      if (dock) setInst('square', { ...squareDockedPose(tools, dock), dock })
      else if (end) {
        setInst('ruler', { dock: end })
        setInst('square', squareOnRulerEnd(tools, end))
      }
    }
    return a.mode === 'arc' && a.sweep !== 0 ? centerMark(tools.compass) : []
  }

  /** What the pointer is over, for its cursor. */
  const hoverAt = (px: number, py: number, draw: boolean | 'compass') => setHover(hitTest(tools, px, py, draw, bounds)?.kind ?? null)

  /** Show or hide an instrument; it appears in the visible part of the sheet. */
  const toggle = (id: InstId) => {
    const i = tools[id]
    if (i.visible) return setInst(id, { visible: false })
    const { x0 = 0, y0 = 0, w = 800, h = 600 } = bounds ?? {}
    // ruler at the top, set square bottom left, protractor bottom right, so all three can be out at once
    const at = {
      ruler: [x0 + w / 2, y0 + h * 0.25],
      square: [x0 + Math.max(40, w * 0.06), y0 + h * 0.88],
      protractor: [x0 + w * 0.7, y0 + h * 0.8],
      compass: [x0 + w * 0.4, y0 + h * 0.55],
    }[id]
    setInst(id, { visible: true, x: round(at[0]), y: round(at[1]) })
    onShown?.()
  }

  /** A whole circle with the compass as it is set now. */
  const drawCircle = () => {
    const c = tools.compass
    onStrokes([{ points: arcPoints(c, c.rot, 360) }, ...centerMark(c)])
  }

  /** Draw the angle typed in degrees, minutes and seconds from the protractor's center: two rays and an arc. */
  const drawAngle = (deg: number) => {
    if (!(deg > 0 && deg <= 360)) return
    const c = tools.protractor
    const len = PROT_R + 40
    const ray = (a: number) => {
      const [x, y] = protractorPoint(c, a, len)
      return { points: linePoints([c.x, c.y], x, y) }
    }
    const steps = Math.max(8, Math.ceil(deg / 3))
    const arc = Array.from({ length: steps + 1 }, (_, k) => [...protractorPoint(c, (deg * k) / steps, 36).map((v) => round(v)), 0.5])
    onStrokes([ray(0), ray(deg), { points: arc, thin: true }])
    setHint({ x: c.x + 44, y: c.y - 40, text: formatDms(deg) })
    setTimeout(() => setHint(null), 2500)
  }

  return { tools, hint, hover, setHover, down, move, up, hoverAt, setInst, toggle, drawCircle, drawAngle }
}

/** The row of buttons that shows the instruments and sets them up. */
export function InstrumentsBar({ inst }: { inst: ReturnType<typeof useInstruments> }) {
  const { tools, toggle, setInst, drawAngle, drawCircle } = inst
  const [angle, setAngle] = useState({ d: '60', m: '', s: '' })
  return (
    <div className="board-toolbar notebook-toolbar instruments-bar">
      <span className="muted">Instrumente:</span>
      <button className={'btn small' + (tools.ruler.visible ? ' active' : '')} onClick={() => toggle('ruler')}><ToolIcon name="ruler" />Riglă</button>
      <button className={'btn small' + (tools.square.visible ? ' active' : '')} onClick={() => toggle('square')}><ToolIcon name="square" />Echer</button>
      {tools.square.visible && (
        <select value={tools.square.shape} onChange={(e) => setInst('square', { shape: e.target.value as '45' | '60' })} title="Tipul echerului">
          <option value="45">45° – 45°</option>
          <option value="60">30° – 60°</option>
        </select>
      )}
      <button className={'btn small' + (tools.protractor.visible ? ' active' : '')} onClick={() => toggle('protractor')}><ToolIcon name="protractor" />Raportor</button>
      {tools.protractor.visible && (
        <span className="angle-input" title="Desenează din centrul raportorului un unghi de exact atâtea grade, minute și secunde">
          <input type="number" min={0} max={360} value={angle.d} onChange={(e) => setAngle({ ...angle, d: e.target.value })} aria-label="grade" />°
          <input type="number" min={0} max={59} value={angle.m} onChange={(e) => setAngle({ ...angle, m: e.target.value })} aria-label="minute" placeholder="0" />′
          <input type="number" min={0} max={59} value={angle.s} onChange={(e) => setAngle({ ...angle, s: e.target.value })} aria-label="secunde" placeholder="0" />″
          <button className="btn small" onClick={() => drawAngle((Number(angle.d) || 0) + (Number(angle.m) || 0) / 60 + (Number(angle.s) || 0) / 3600)}>Desenează unghiul</button>
        </span>
      )}
      <button className={'btn small' + (tools.compass.visible ? ' active' : '')} onClick={() => toggle('compass')}><ToolIcon name="compass" />Compas</button>
      {tools.compass.visible && (
        <span className="angle-input" title="Deschiderea compasului">
          r =
          <input
            type="number" min={0.2} max={COMPASS_MAX_R / PX_PER_CM} step={0.1} aria-label="raza în cm"
            value={round(tools.compass.r / PX_PER_CM)}
            onChange={(e) => {
              const cm = Number(e.target.value)
              if (cm > 0) setInst('compass', { r: Math.min(COMPASS_MAX_R, cm * PX_PER_CM) })
            }}
          />
          cm
          <button className="btn small" onClick={drawCircle}>◯ Cerc complet</button>
        </span>
      )}
      {(tools.ruler.visible || tools.square.visible || tools.protractor.visible || tools.compass.visible) && (
        <span className="muted instruments-help">
          Trage de instrument ca să-l muți, de ↻ ca să-l rotești. Scrie lângă o margine = linie dreaptă
          {tools.ruler.visible && tools.square.visible && '; apropie un capăt mic al riglei de o latură a echerului, trăgând de oricare din ele, și se lipesc perpendicular: glisează rigla pe latură și liniile trase pe ea sunt paralele, trage-o mai departe ca s-o desprinzi; la fel, o latură a echerului se lipește de marginea lungă a riglei, trăgând de oricare din ele, și echerul alunecă pe ea'}
          {tools.protractor.visible && '; din centrul raportorului = rază la unghiul afișat'}
          {tools.compass.visible && '; compasul: trage de ⟷ ca să-l deschizi, apoi ține de mânerul de sus (mov) și rotește-l ca să desenezi arcul'}.
        </span>
      )}
    </div>
  )
}
