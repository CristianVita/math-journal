// Selecting handwriting with a rectangle and moving it (asked for by the user on 22 November 2026, after a lesson:
// "select the pen writing with the selection outline, and drag it anywhere"). Shared by the notebook and the board.

export interface Rect { x0: number; y0: number; x1: number; y1: number }

/** The rectangle between two corners, whichever way it was dragged. */
export const rectOf = (a: number[], b: number[]): Rect =>
  ({ x0: Math.min(a[0], b[0]), y0: Math.min(a[1], b[1]), x1: Math.max(a[0], b[0]), y1: Math.max(a[1], b[1]) })

export const inside = (r: Rect, x: number, y: number) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1

/**
 * A line is taken when at least half of its points are inside: a word whose tail crosses the edge comes along,
 * a long line that only passes through the rectangle does not.
 */
export function takesLine(r: Rect, points: number[][]): boolean {
  if (!points.length) return false
  const n = points.filter(([x, y]) => inside(r, x, y)).length
  return n * 2 >= points.length
}

/** A box is taken when its centre is inside. */
export const takesBox = (r: Rect, b: Rect) => inside(r, (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2)

/** The box around some points, or null. */
export function boxOf(points: number[][]): Rect | null {
  if (!points.length) return null
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const [x, y] of points) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
  }
  return { x0, y0, x1, y1 }
}

/** The box around several boxes, widened by pad; null when there are none. */
export function unionOf(boxes: (Rect | null)[], pad = 0): Rect | null {
  const all = boxes.filter((b): b is Rect => !!b)
  if (!all.length) return null
  return {
    x0: Math.min(...all.map((b) => b.x0)) - pad,
    y0: Math.min(...all.map((b) => b.y0)) - pad,
    x1: Math.max(...all.map((b) => b.x1)) + pad,
    y1: Math.max(...all.map((b) => b.y1)) + pad,
  }
}

/** The points moved by (dx, dy); anything after x and y (the pressure) stays. */
export const shifted = (points: number[][], dx: number, dy: number) => points.map(([x, y, ...rest]) => [x + dx, y + dy, ...rest])

/** The two ends of a straight line (every point within `tol` px of the segment between them, at least `min` px
 * long), or null: a line along the ruler, the set square or the protractor, or one drawn with Shift. */
export function straightEnds(points: number[][], min = 15, tol = 1.5): [number[], number[]] | null {
  if (points.length < 2) return null
  const [a, b] = [points[0], points[points.length - 1]]
  const len = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (len < min) return null
  const off = (p: number[]) => {
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / (len * len)))
    return Math.hypot(p[0] - a[0] - t * (b[0] - a[0]), p[1] - a[1] - t * (b[1] - a[1]))
  }
  return points.every((p) => off(p) <= tol) ? [a, b] : null
}
