// The eraser of the notebook: it takes away only the part of a line it passes over, like a real one.

/** Distance from (x, y) to the segment from (ax, ay) to (bx, by). */
export function segDist(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  const l2 = dx * dx + dy * dy
  const t = l2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)) : 0
  return Math.hypot(ax + t * dx - x, ay + t * dy - y)
}

/**
 * What is left of a line (points [x, y, pressure], drawn `size` wide) after the eraser, `r` in radius, went from
 * `a` to `b`: null when it was not touched, otherwise its pieces, none if all of it went. Near the eraser the
 * line gets points every little while, so that a long straight stretch is cut where it was crossed, and not
 * kept or lost whole; elsewhere its points stay as they were, so that its shape does not change.
 */
export function eraseLine(points: number[][], size: number, a: number[], b: number[], r: number): number[][][] | null {
  const reach = r + size / 2
  const gone = (p: number[]) => segDist(p[0], p[1], a[0], a[1], b[0], b[1]) <= reach
  if (points.length === 1) return gone(points[0]) ? [] : null
  const [x0, x1] = [Math.min(a[0], b[0]) - reach, Math.max(a[0], b[0]) + reach]
  const [y0, y1] = [Math.min(a[1], b[1]) - reach, Math.max(a[1], b[1]) + reach]
  const step = Math.max(0.5, r / 4)
  const dense: number[][] = [points[0]]
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1]
    const q = points[i]
    const near = Math.max(p[0], q[0]) >= x0 && Math.min(p[0], q[0]) <= x1 && Math.max(p[1], q[1]) >= y0 && Math.min(p[1], q[1]) <= y1
    const n = near ? Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / step) : 1
    for (let k = 1; k < n; k++) dense.push(p.map((c, j) => Math.round((c + ((q[j] - c) * k) / n) * 100) / 100))
    dense.push(q)
  }
  if (!dense.some(gone)) return null
  const pieces: number[][][] = []
  let run: number[][] = []
  for (const p of dense) {
    if (gone(p)) {
      if (run.length > 1) pieces.push(run)
      run = []
    } else run.push(p)
  }
  if (run.length > 1) pieces.push(run)
  return pieces
}
