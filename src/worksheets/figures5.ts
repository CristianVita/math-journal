// Drawings for the generated exercises of the lower grades, which the statement alone cannot give: the number line,
// points on a line, angles with their rays, shaded parts, bar charts and tables. A form draws its figure with these
// and returns it as `fig` (asked for by the user on 15 November 2026: the workbook exercises with drawings matter at
// grade V). Everything is in the drawing's pixels, y down, as `Fig` wants it.
import { onCircle, type Fig, type Pt } from '../models/figure'

/** Numbers as the book writes them under a tick: 2,5 with a comma. */
const num = (x: number) => String(Math.round(x * 1000) / 1000).replace('.', ',')

/**
 * The number line from `from` to `to`, a tick every `step` (at most 24 ticks), the numbers in `labels` written under
 * their ticks (all of them when omitted), and named points above it ("A" at 3,5), with a dot.
 */
export function numberLine(o: { from: number; to: number; step: number; labels?: number[]; points?: { name: string; at: number }[]; w?: number }): Fig {
  const w = o.w ?? 420
  const y = 34
  const x0 = 14, x1 = w - 24
  const n = Math.round((o.to - o.from) / o.step)
  const X = (v: number) => x0 + ((v - o.from) / (o.to - o.from)) * (x1 - x0)
  const ticks: string[] = []
  for (let i = 0; i <= n; i++) {
    const x = X(o.from + i * o.step)
    ticks.push(`M${x.toFixed(1)} ${y - 5} L${x.toFixed(1)} ${y + 5}`)
  }
  const labels = o.labels ?? Array.from({ length: n + 1 }, (_, i) => o.from + i * o.step)
  const p: Record<string, Pt> = {}
  const l: Fig['l'] = {}
  for (const q of o.points ?? []) { p[q.name] = [X(q.at), y]; l[q.name] = 'n' }
  return {
    w, h: 58, p, l,
    dot: Object.keys(p).join(' '),
    path: [
      { d: `M${x0 - 8} ${y} L${w - 4} ${y}` },
      { d: `M${w - 4} ${y} l-8 -4 l0 8 Z`, fill: '#111' },
      { d: ticks.join(' ') },
    ],
    t: labels.map((v) => ({ at: [X(v), y + 20] as Pt, s: num(v), size: 11 })),
  }
}

/**
 * Points on a line, in this order, at these positions (any unit; only the proportions count), with the lengths of
 * the pieces written under them when given ("3 cm"; '' for none). The line goes past the ends unless `segment`.
 */
export function pointsOnLine(names: string[], at: number[], o: { lengths?: string[]; segment?: boolean; w?: number; line?: string } = {}): Fig {
  const w = o.w ?? 380
  const y = 26
  const a = Math.min(...at), b = Math.max(...at)
  const x0 = o.segment ? 14 : 40, x1 = w - (o.segment ? 14 : 40)
  const X = (v: number) => x0 + ((v - a) / (b - a || 1)) * (x1 - x0)
  const p: Record<string, Pt> = Object.fromEntries(names.map((n, i) => [n, [X(at[i]), y] as Pt]))
  const t: NonNullable<Fig['t']> = []
  o.lengths?.forEach((s, i) => { if (s && i + 1 < names.length) t.push({ at: [(X(at[i]) + X(at[i + 1])) / 2, y + 22], s, size: 11 }) })
  if (o.line) t.push({ at: [w - 4, y - 8], s: o.line, anchor: 'end', italic: true, size: 13 })
  return {
    w, h: o.lengths ? 52 : 40, p,
    l: Object.fromEntries(names.map((n) => [n, 'n'])),
    dot: names.join(' '),
    path: [{ d: `M${o.segment ? X(a) : 4} ${y} L${o.segment ? X(b) : w - 4} ${y}` }],
    t,
  }
}

/**
 * Rays from a vertex at these directions in degrees (0 to the right, counterclockwise), each named by the point on
 * it; `arcs` marks angles ("AOB"), `measures` writes a measure inside an angle ({ between: ['A', 'B'], s: '40°' }).
 */
export function rays(vertex: string, dirs: { name: string; deg: number }[], o: { arcs?: string[]; measures?: { between: [string, string]; s: string }[]; w?: number } = {}): Fig {
  const w = o.w ?? 260
  const r = w * 0.4
  // the vertex where every ray fits: from the extremes of the directions
  const ends = dirs.map((d) => onCircle([0, 0], r, d.deg))
  const xs = [0, ...ends.map((e) => e[0])], ys = [0, ...ends.map((e) => e[1])]
  const pad = 18
  const v: Pt = [pad - Math.min(...xs), pad - Math.min(...ys)]
  const width = Math.max(...xs) - Math.min(...xs) + 2 * pad
  const h = Math.ceil(Math.max(...ys) - Math.min(...ys) + 2 * pad)
  const p: Record<string, Pt> = { [vertex]: v }
  for (const d of dirs) p[d.name] = onCircle(v, r, d.deg)
  const deg = Object.fromEntries(dirs.map((d) => [d.name, d.deg]))
  const t = (o.measures ?? []).map((m) => {
    let a = deg[m.between[0]], b = deg[m.between[1]]
    if (Math.abs(a - b) > 180) (a < b ? (a += 360) : (b += 360))
    return { at: onCircle(v, 34, (a + b) / 2), s: m.s, size: 11 }
  })
  return {
    w: Math.ceil(Math.max(width, 40)), h, p,
    s: dirs.map((d) => `${vertex}-${d.name}`).join(' '),
    ang: o.arcs, t,
  }
}

/** A rectangle cut into cols × rows equal squares, the given cells (column, row from the top left) hatched. */
export function shadedGrid(cols: number, rows: number, shaded: [number, number][], cell = 28): Fig {
  const w = cols * cell, h = rows * cell
  const lines: string[] = []
  for (let i = 0; i <= cols; i++) lines.push(`M${i * cell} 0 L${i * cell} ${h}`)
  for (let j = 0; j <= rows; j++) lines.push(`M0 ${j * cell} L${w} ${j * cell}`)
  return {
    w, h, p: {},
    path: [
      ...shaded.map(([c, r]) => ({ d: `M${c * cell} ${r * cell} h${cell} v${cell} h${-cell} Z`, hatch: true })),
      { d: lines.join(' ') },
    ],
  }
}

/** A circle cut into n equal sectors, the given ones (counted from the top, clockwise) hatched. */
export function shadedCircle(n: number, shaded: number[], r = 60): Fig {
  const c: Pt = [r, r]
  const at = (k: number) => onCircle(c, r, 90 - (360 * k) / n)
  const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`
  return {
    w: 2 * r, h: 2 * r, p: {},
    c: [{ at: c, r }],
    path: [
      ...shaded.map((k) => ({ d: `M${f(c)} L${f(at(k))} A${r} ${r} 0 0 1 ${f(at(k + 1))} Z`, hatch: true })),
      { d: Array.from({ length: n }, (_, k) => `M${f(c)} L${f(at(k))}`).join(' ') },
    ],
  }
}

/** A bar chart: the categories under the bars, the values on the vertical axis every `step`, with grid lines. */
export function barChart(names: string[], values: number[], step: number, o: { w?: number; title?: string } = {}): Fig {
  const w = o.w ?? Math.max(300, names.length * 58 + 50)
  const top = Math.ceil(Math.max(...values) / step) * step
  const h = 220
  const ox = 40, oy = h - 30, y1 = 14
  const Y = (v: number) => oy - (v / top) * (oy - y1 - 10)
  const bw = Math.min(34, ((w - ox - 10) / names.length) * 0.6)
  const gap = (w - ox - 10) / names.length
  const grid: string[] = []
  const t: NonNullable<Fig['t']> = []
  for (let v = step; v <= top; v += step) {
    grid.push(`M${ox} ${Y(v).toFixed(1)} L${w - 6} ${Y(v).toFixed(1)}`)
    t.push({ at: [ox - 5, Y(v) + 4], s: num(v), anchor: 'end', size: 10 })
  }
  t.push({ at: [ox - 5, oy + 4], s: '0', anchor: 'end', size: 10 })
  names.forEach((n, i) => t.push({ at: [ox + gap * (i + 0.5), oy + 16], s: n, size: 10 }))
  if (o.title) t.push({ at: [w / 2, 10], s: o.title, size: 11 })
  return {
    w, h, p: {},
    path: [
      { d: grid.join(' '), dashed: true },
      ...values.map((v, i) => {
        const x = ox + gap * (i + 0.5) - bw / 2
        return { d: `M${x.toFixed(1)} ${oy} V${Y(v).toFixed(1)} h${bw.toFixed(1)} V${oy} Z`, hatch: true }
      }),
      { d: `M${ox} ${oy} L${w - 4} ${oy} M${ox} ${oy} L${ox} ${y1}` },
      { d: `M${ox} ${y1} l-3.5 7 l7 0 Z`, fill: '#111' },
    ],
    t,
  }
}

/** A table: rows of cells, the first one the header, the first column wider. */
export function table(rows: string[][], o: { cell?: number; first?: number } = {}): Fig {
  const cw = o.cell ?? 52, fw = o.first ?? 110, rh = 26
  const cols = rows[0].length
  const w = fw + (cols - 1) * cw, h = rows.length * rh
  const X = (j: number) => (j === 0 ? 0 : fw + (j - 1) * cw)
  const lines: string[] = []
  for (let j = 0; j <= cols; j++) lines.push(`M${j === cols ? w : X(j)} 0 L${j === cols ? w : X(j)} ${h}`)
  for (let i = 0; i <= rows.length; i++) lines.push(`M0 ${i * rh} L${w} ${i * rh}`)
  const t = rows.flatMap((r, i) => r.map((s, j) => ({ at: [X(j) + (j === 0 ? fw : cw) / 2, i * rh + 17] as Pt, s, size: 11 })))
  return { w, h, p: {}, path: [{ d: lines.join(' ') }], t }
}
