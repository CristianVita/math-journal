// A figure of the notebook fitted to the data of a problem (26 November 2026, asked for by the user): the lengths
// typed for its sides give its shape; it keeps its place, its size and its letters on the page (only the proportions
// change, so that it always fits the page).
import type { ShapeId } from './shapes'

/** What is asked for a figure: a side (corners i and j), the height, or an angle (at corner `at`, between i and j). */
export type ShapeField =
  | { kind: 'side'; i: number; j: number }
  | { kind: 'height' }
  | { kind: 'angle'; i: number; at: number; j: number }
  | { kind: 'diagonal'; i: number; j: number }

const side = (i: number, j: number): ShapeField => ({ kind: 'side', i, j })
const diagonal = (i: number, j: number): ShapeField => ({ kind: 'diagonal', i, j })

/**
 * The data of each figure, in the order of its corners (as `shapeGeometry` makes them: A first, then clockwise on the
 * page). Square, equilateral triangle, segment, circle and ellipse have no proportions to choose.
 */
export const SHAPE_FIELDS: Partial<Record<ShapeId, ShapeField[]>> = {
  triangle: [side(0, 1), side(1, 2), side(2, 0)],
  right: [side(0, 1), side(1, 2)],
  rectangle: [side(0, 1), side(1, 2)],
  parallelogram: [side(0, 1), side(0, 3), { kind: 'angle', i: 0, at: 3, j: 2 }],
  rhombus: [diagonal(0, 2), diagonal(1, 3)],
  trapezoid: [side(0, 1), side(3, 2), { kind: 'height' }],
  rightTrapezoid: [side(0, 1), side(3, 2), side(0, 3)],
  trapezoidAny: [side(0, 1), side(3, 2), side(0, 3), side(1, 2)],
  kite: [diagonal(0, 2), diagonal(1, 3)],
}

/** How a field is written in the panel, with the figure's letters: „AB”, „înălțimea”, „∡ADC (°)”. */
export function fieldLabel(f: ShapeField, letters: string[]): string {
  if (f.kind === 'height') return 'înălțimea'
  if (f.kind === 'angle') return `∡${letters[f.i]}${letters[f.at]}${letters[f.j]} (°)`
  return letters[f.i] + letters[f.j]
}

/**
 * The corners of the figure with these data, on the page (y down), in any place and size: `fitCorners` puts them
 * where the figure is. A string says why the data cannot make the figure.
 */
export function solveShape(shape: ShapeId, v: number[]): number[][] | string {
  if (v.some((x) => !(x > 0))) return 'Scrie numere pozitive în toate căsuțele.'
  switch (shape) {
    case 'triangle': {
      const [c, a, b] = v // AB, BC, CA
      if (a + b <= c || a + c <= b || b + c <= a) return 'Cu aceste laturi nu se poate face un triunghi (fiecare latură trebuie să fie mai mică decât suma celorlalte două).'
      const x = (b * b + a * a - c * c) / (2 * a)
      return [[x, -Math.sqrt(b * b - x * x)], [a, 0], [0, 0]]
    }
    case 'right': {
      const [ab, bc] = v
      return [[0, 0], [0, ab], [bc, ab]]
    }
    case 'rectangle': {
      const [w, h] = v
      return [[0, 0], [w, 0], [w, h], [0, h]]
    }
    case 'parallelogram': {
      const [ab, ad, deg] = v
      if (deg >= 180) return 'Unghiul unui paralelogram este mai mic de 180°.'
      const u = (deg * Math.PI) / 180
      const a = [ad * Math.cos(u), -ad * Math.sin(u)]
      return [a, [a[0] + ab, a[1]], [ab, 0], [0, 0]]
    }
    case 'rhombus':
    case 'kite': {
      const [p, q] = v // AC (up–down), BD (across)
      const y = shape === 'kite' ? p * 0.3 : p / 2
      return [[0, 0], [q / 2, y], [0, p], [-q / 2, y]]
    }
    case 'trapezoid': {
      const [a, b, h] = v
      if (a === b) return 'Bazele unui trapez sunt diferite.'
      return [[(b - a) / 2, 0], [(b + a) / 2, 0], [b, h], [0, h]]
    }
    case 'rightTrapezoid': {
      const [a, b, h] = v
      if (a === b) return 'Bazele unui trapez sunt diferite.'
      return [[0, 0], [a, 0], [b, h], [0, h]]
    }
    case 'trapezoidAny': {
      const [a, b, p, q] = v // AB (top), DC (bottom), AD, BC
      if (a === b) return 'Bazele unui trapez sunt diferite.'
      // D(0, 0), C(b, 0), A(x, −h), B(x + a, −h): AD = p and BC = q give x, then h
      const d = b - a
      const x = ((p * p - q * q) / d + d) / 2
      const h2 = p * p - x * x
      if (!(h2 > 1e-9)) return 'Cu aceste laturi nu se poate face un trapez (laturile neparalele sunt prea scurte față de diferența bazelor).'
      const h = Math.sqrt(h2)
      return [[x, -h], [x + a, -h], [b, 0], [0, 0]]
    }
    default:
      return 'Figura aceasta nu are date de potrivit.'
  }
}

/**
 * Puts the new corners where the old ones are: the same middle, about the same size, turned over (left–right,
 * up–down) as the figure was drawn, so that each letter stays near its place. No rotation: the figures are drawn
 * with their bases level.
 */
export function fitCorners(next: number[][], old: number[][]): number[][] {
  const mean = (pts: number[][]) => [0, 1].map((k) => pts.reduce((s, p) => s + p[k], 0) / pts.length)
  const [ox, oy] = mean(old)
  const w = old.map(([x, y]) => [x - ox, y - oy])
  let best: { pts: number[][]; err: number } | null = null
  for (const sx of [1, -1]) {
    for (const sy of [1, -1]) {
      const flipped = next.map(([x, y]) => [x * sx, y * sy])
      const [mx, my] = mean(flipped)
      const z = flipped.map(([x, y]) => [x - mx, y - my])
      const zz = z.reduce((s, p) => s + p[0] * p[0] + p[1] * p[1], 0)
      const zw = z.reduce((s, p, i) => s + p[0] * w[i][0] + p[1] * w[i][1], 0)
      if (!(zz > 0) || zw <= 0) continue
      const k = zw / zz
      const pts = z.map(([x, y]) => [ox + x * k, oy + y * k])
      const err = pts.reduce((s, p, i) => s + (p[0] - old[i][0]) ** 2 + (p[1] - old[i][1]) ** 2, 0)
      if (!best || err < best.err) best = { pts, err }
    }
  }
  return best?.pts ?? old
}

/** The lengths and angles of a figure as it is drawn, to fill the panel (rounded to tenths). */
export function measureShape(shape: ShapeId, c: number[][], unit: number): number[] {
  const dist = (i: number, j: number) => Math.hypot(c[i][0] - c[j][0], c[i][1] - c[j][1]) / unit
  const r = (x: number) => Math.round(x * 10) / 10
  return (SHAPE_FIELDS[shape] ?? []).map((f) => {
    if (f.kind === 'side' || f.kind === 'diagonal') return r(dist(f.i, f.j))
    if (f.kind === 'height') return r(Math.abs(c[3][1] - c[0][1]) / unit)
    const u = [c[f.i][0] - c[f.at][0], c[f.i][1] - c[f.at][1]]
    const v = [c[f.j][0] - c[f.at][0], c[f.j][1] - c[f.at][1]]
    return Math.round((Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180) / Math.PI)
  })
}
