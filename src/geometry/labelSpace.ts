// Where the writing goes on the board (12 November 2026): lengths, angle measures, letters of points, equations and
// vectors. Each label has a few places it may go, the preferred one first; it takes the first that touches no other
// writing, no point and no line, or else the one that touches least. Asked for by the user, after the lengths of the
// two diagonals of a parallelogram were written on top of each other where the diagonals cross.
// Everything here is on the screen, in pixels, with y pointing down.
import type { Vec } from './engine'

export interface Box { x0: number; y0: number; x1: number; y1: number }
/** A drawn point on the screen; `id` is the point, so that its letter can ignore it. */
export interface ScreenDot { id: string; p: Vec }
/** A drawn line on the screen; `id` is the object it belongs to, so that a label can ignore its own line. */
export interface ScreenLine { id: string; a: Vec; b: Vec }

/** The box of a piece of writing of size w × h centred at c. */
export const boxAt = (c: Vec, w: number, h: number): Box => ({ x0: c.x - w / 2, y0: c.y - h / 2, x1: c.x + w / 2, y1: c.y + h / 2 })

const overlap = (a: Box, b: Box, gap: number) => {
  const w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) + gap
  const h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) + gap
  return w > 0 && h > 0 ? w * h : 0
}

/** Does the segment from a to b pass through the box? (Liang–Barsky) */
export function crosses(a: Vec, b: Vec, box: Box): boolean {
  let t0 = 0
  let t1 = 1
  const dx = b.x - a.x
  const dy = b.y - a.y
  for (const [p, q] of [[-dx, a.x - box.x0], [dx, box.x1 - a.x], [-dy, a.y - box.y0], [dy, box.y1 - a.y]]) {
    if (Math.abs(p) < 1e-12) {
      if (q < 0) return false
      continue
    }
    const r = q / p
    if (p < 0) t0 = Math.max(t0, r)
    else t1 = Math.min(t1, r)
    if (t0 > t1) return false
  }
  return true
}

export class LabelSpace {
  readonly taken: Box[] = []
  constructor(
    readonly lines: ScreenLine[],
    readonly dots: ScreenDot[],
    /** the visible board: a label outside it cannot be read */
    readonly bounds?: Box,
  ) {}

  /** How bad a place is: other writing worst, then points, then lines, then leaving the board. 0 is a free place. */
  cost(box: Box, own: readonly string[] = []): number {
    let c = 0
    for (const t of this.taken) {
      const o = overlap(box, t, 3)
      if (o > 0) c += 400 + o * 4
    }
    for (const { id, p: d } of this.dots) if (!own.includes(id) && d.x > box.x0 - 3 && d.x < box.x1 + 3 && d.y > box.y0 - 3 && d.y < box.y1 + 3) c += 300
    for (const l of this.lines) if (!own.includes(l.id) && crosses(l.a, l.b, box)) c += 60
    const B = this.bounds
    if (B && (box.x0 < B.x0 || box.y0 < B.y0 || box.x1 > B.x1 || box.y1 > B.y1)) c += 150
    return c
  }

  /**
   * The best of the candidate centres for a label of size w × h, which it then holds. A free place is taken at once,
   * in the order given; otherwise the least bad one, the earlier ones slightly preferred.
   */
  place(candidates: Vec[], w: number, h: number, own: readonly string[] = []): Vec {
    let best = candidates[0]
    let bestCost = Infinity
    for (let i = 0; i < candidates.length; i++) {
      const cost = this.cost(boxAt(candidates[i], w, h), own)
      if (cost === 0) {
        best = candidates[i]
        break
      }
      if (cost + i * 2 < bestCost) {
        bestCost = cost + i * 2
        best = candidates[i]
      }
    }
    this.hold(boxAt(best, w, h))
    return best
  }

  /** A piece of writing whose place is fixed (the tip of a brace, a formula): the others keep away from it. */
  hold(box: Box) {
    this.taken.push(box)
  }
}

/** The 8 directions around a point, nearest in angle to `first` first. */
export function directionsFrom(first: Vec): Vec[] {
  const dirs: Vec[] = []
  for (let i = 0; i < 8; i++) {
    const t = (i * Math.PI) / 4
    dirs.push({ x: Math.cos(t), y: Math.sin(t) })
  }
  const a0 = Math.atan2(first.y, first.x)
  const gap = (d: Vec) => {
    const g = Math.abs(Math.atan2(d.y, d.x) - a0) % (2 * Math.PI)
    return g > Math.PI ? 2 * Math.PI - g : g
  }
  const l = Math.hypot(first.x, first.y) || 1
  return [{ x: first.x / l, y: first.y / l }, ...dirs.sort((p, q) => gap(p) - gap(q))]
}

/** Where the centre of the letter of a point goes, for a direction d from the point: just clear of the dot, or further. */
export const besidePoint = (s: Vec, d: Vec, w: number, h: number, further = 0): Vec => ({
  x: s.x + d.x * (w / 2 + 6 + further),
  y: s.y + d.y * (h / 2 + 6 + further),
})

/** The places for the letter of a point: all around it, the preferred side first, then the same further out. */
export const aroundPoint = (s: Vec, first: Vec, w: number, h: number): Vec[] =>
  [0, 8, 18].flatMap((further) => directionsFrom(first).map((d) => besidePoint(s, d, w, h, further)))

/**
 * How far from a line, along its normal n, the centre of writing of size w × h must be for the writing not to touch
 * it: long writing beside a slanted line needs more room than a short number.
 */
export const clearance = (n: Vec, w: number, h: number, least: number) => Math.max(least, Math.abs(n.x) * w / 2 + Math.abs(n.y) * h / 2 + 4)

/** Places along a segment from a to b (screen), on the side n first, then the other: centres at distance k. */
export function alongSegment(a: Vec, b: Vec, n: Vec, k: number, ts = [0.5, 0.38, 0.62, 0.27, 0.73]): Vec[] {
  const out: Vec[] = []
  for (const side of [1, -1]) {
    for (const t of ts) out.push({ x: a.x + (b.x - a.x) * t + n.x * k * side, y: a.y + (b.y - a.y) * t + n.y * k * side })
  }
  return out
}
