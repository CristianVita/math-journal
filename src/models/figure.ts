// The figures of the national evaluation models, drawn as SVG from a short description, as they are in the book:
// thin black lines, dashed hidden edges, italic capital letters at the vertices. The same SVG is shown on the page
// and printed (system fonts only, so that the export draws it as it looks).

export type Pt = [number, number]
type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | 'c'

export interface Fig {
  /** the drawing's size in pixels, as printed */
  w: number
  h: number
  /** the named points; y goes down */
  p: Record<string, Pt>
  /** where the letter goes, when not away from the middle of the figure; '' hides it */
  l?: Partial<Record<string, Dir | ''>>
  /** chains of segments: "A-B-C-A D-E" */
  s?: string
  /** dashed chains, the same way */
  d?: string
  /** small dots at these points: "E O" */
  dot?: string
  /** circles: centre (a point or coordinates), radius */
  c?: { at: string | Pt; r: number; dashed?: boolean }[]
  /** ellipses, for round solids: centre, half-axes; the back half dashed when `back` */
  e?: { at: string | Pt; rx: number; ry: number; back?: boolean; dashed?: boolean }[]
  /** right angles, as "ACB": the mark at C */
  ra?: string[]
  /** angle arcs, as "BAC": an arc at A */
  ang?: string[]
  /** hatched regions, as chains "A-B-C" */
  hatch?: string[]
  /** free paths in the drawing's pixels, for what the rest cannot say (a semicircle, a bar) */
  path?: { d: string; dashed?: boolean; fill?: string; hatch?: boolean }[]
  /** free text: axis names, values */
  t?: { at: Pt; s: string; anchor?: 'start' | 'middle' | 'end'; size?: number; italic?: boolean }[]
  /** coordinate axes with arrows, from the origin's pixel: x from x0 to x1, y from y0 (bottom) to y1 (top) */
  axes?: { o: Pt; x: [number, number]; y: [number, number]; xl?: string; yl?: string }
}

const OFF: Record<Exclude<Dir, 'c'>, Pt> = {
  n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [0.75, -0.75], nw: [-0.75, -0.75], se: [0.75, 0.75], sw: [-0.75, 0.75],
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** "A'" is written A′, as in the book. */
const letter = (name: string) => esc(name.replace(/''/g, '″').replace(/'/g, '′'))

function chains(spec: string | undefined, fig: Fig): Pt[][] {
  if (!spec) return []
  return spec.trim().split(/\s+/).map((chain) => chain.split('-').map((n) => {
    const q = fig.p[n]
    if (!q) throw new Error(`Figura nu are punctul ${n}`)
    return q
  }))
}

const at = (fig: Fig, a: string | Pt): Pt => (typeof a === 'string' ? fig.p[a] : a)

/** Every point name a figure uses, so that a test can check they are all defined. */
export function namesUsed(fig: Fig): string[] {
  const out: string[] = []
  for (const spec of [fig.s, fig.d, fig.dot, ...(fig.hatch ?? [])]) if (spec) out.push(...spec.trim().split(/[\s-]+/))
  for (const a of [...(fig.ra ?? []), ...(fig.ang ?? [])]) out.push(...splitAngle(a))
  for (const c of [...(fig.c ?? []), ...(fig.e ?? [])]) if (typeof c.at === 'string') out.push(c.at)
  return out.filter(Boolean)
}

/** "ACB" or "A'C'B" into its three point names (a name is a letter with its primes or digits). */
function splitAngle(a: string): string[] {
  return a.match(/[A-Za-z][′'0-9]*/g) ?? []
}

const fmt = (n: number) => Number(n.toFixed(1))
const line = (pts: Pt[]) => pts.map((q, i) => `${i ? 'L' : 'M'}${fmt(q[0])} ${fmt(q[1])}`).join(' ')

export function figureSvg(fig: Fig): string {
  const parts: string[] = []
  const stroke = 'stroke="#111" stroke-width="1.3" fill="none" stroke-linejoin="round"'
  const dash = 'stroke-dasharray="5 4"'
  let hatchUsed = false

  for (const h of fig.hatch ?? []) {
    for (const pts of chains(h, fig)) parts.push(`<path d="${line(pts)} Z" fill="url(#hatch)" stroke="none"/>`)
    hatchUsed = true
  }
  for (const p of fig.path ?? []) {
    if (p.hatch) hatchUsed = true
    const fill = p.hatch ? 'url(#hatch)' : p.fill ?? 'none'
    parts.push(`<path d="${p.d}" stroke="#111" stroke-width="1.3" fill="${fill}" fill-rule="evenodd" ${p.dashed ? dash : ''}/>`)
  }
  if (fig.axes) {
    const { o, x, y } = fig.axes
    parts.push(`<path d="M${x[0]} ${o[1]} L${x[1]} ${o[1]} M${o[0]} ${y[0]} L${o[0]} ${y[1]}" stroke="#111" stroke-width="1" fill="none"/>`)
    parts.push(`<path d="M${x[1]} ${o[1]} l-7 -3.5 l0 7 Z M${o[0]} ${y[1]} l-3.5 7 l7 0 Z" fill="#111"/>`)
    if (fig.axes.xl) parts.push(`<text x="${x[1] - 2}" y="${o[1] + 15}" text-anchor="end" font-style="italic" font-size="13">${esc(fig.axes.xl)}</text>`)
    if (fig.axes.yl) parts.push(`<text x="${o[0] + 7}" y="${y[1] + 9}" font-style="italic" font-size="13">${esc(fig.axes.yl)}</text>`)
  }
  for (const pts of chains(fig.s, fig)) parts.push(`<path d="${line(pts)}" ${stroke}/>`)
  for (const pts of chains(fig.d, fig)) parts.push(`<path d="${line(pts)}" ${stroke} ${dash}/>`)
  for (const c of fig.c ?? []) {
    const [cx, cy] = at(fig, c.at)
    parts.push(`<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${c.r}" ${stroke} ${c.dashed ? dash : ''}/>`)
  }
  for (const e of fig.e ?? []) {
    const [cx, cy] = at(fig, e.at)
    if (e.back) {
      parts.push(`<path d="M${fmt(cx - e.rx)} ${fmt(cy)} A${e.rx} ${e.ry} 0 0 0 ${fmt(cx + e.rx)} ${fmt(cy)}" ${stroke}/>`)
      parts.push(`<path d="M${fmt(cx - e.rx)} ${fmt(cy)} A${e.rx} ${e.ry} 0 0 1 ${fmt(cx + e.rx)} ${fmt(cy)}" ${stroke} ${dash}/>`)
    } else parts.push(`<ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="${e.rx}" ry="${e.ry}" ${stroke} ${e.dashed ? dash : ""}/>`)
  }
  for (const a of fig.ra ?? []) {
    const [p1, v, p2] = splitAngle(a).map((n) => fig.p[n])
    const u = unit(p1, v)
    const w = unit(p2, v)
    const k = 8
    const q1: Pt = [v[0] + u[0] * k, v[1] + u[1] * k]
    const q2: Pt = [v[0] + w[0] * k, v[1] + w[1] * k]
    const q: Pt = [q1[0] + w[0] * k, q1[1] + w[1] * k]
    parts.push(`<path d="${line([q1, q, q2])}" stroke="#111" stroke-width="1" fill="none"/>`)
  }
  for (const a of fig.ang ?? []) {
    const [p1, v, p2] = splitAngle(a).map((n) => fig.p[n])
    const r = 14
    const u = unit(p1, v)
    const w = unit(p2, v)
    const a1: Pt = [v[0] + u[0] * r, v[1] + u[1] * r]
    const a2: Pt = [v[0] + w[0] * r, v[1] + w[1] * r]
    const sweep = u[0] * w[1] - u[1] * w[0] > 0 ? 1 : 0
    parts.push(`<path d="M${fmt(a1[0])} ${fmt(a1[1])} A${r} ${r} 0 0 ${sweep} ${fmt(a2[0])} ${fmt(a2[1])}" stroke="#111" stroke-width="1" fill="none"/>`)
  }
  for (const name of (fig.dot ?? '').split(/\s+/).filter(Boolean)) {
    const [x, y] = fig.p[name]
    parts.push(`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="2" fill="#111"/>`)
  }

  // the letters: away from the middle of the figure, unless told where
  const names = Object.keys(fig.p)
  const mid: Pt = names.length ? [names.reduce((s, n) => s + fig.p[n][0], 0) / names.length, names.reduce((s, n) => s + fig.p[n][1], 0) / names.length] : [0, 0]
  for (const name of names) {
    const want = fig.l?.[name]
    if (want === '') continue
    const [x, y] = fig.p[name]
    let off: Pt
    if (want === 'c') off = [0, 0]
    else if (want) off = OFF[want]
    else {
      const dx = x - mid[0]
      const dy = y - mid[1]
      const len = Math.hypot(dx, dy) || 1
      off = [dx / len, dy / len]
    }
    const lx = x + off[0] * 10
    const ly = y + off[1] * 10 + 5
    parts.push(`<text x="${fmt(lx)}" y="${fmt(ly)}" text-anchor="middle" font-style="italic" font-size="14">${letter(name)}</text>`)
  }
  for (const t of fig.t ?? []) {
    parts.push(`<text x="${t.at[0]}" y="${t.at[1]}" text-anchor="${t.anchor ?? 'middle'}" font-size="${t.size ?? 12}"${t.italic ? ' font-style="italic"' : ''}>${esc(t.s)}</text>`)
  }

  const defs = hatchUsed
    ? '<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#111" stroke-width="0.9"/></pattern></defs>'
    : ''
  // a margin all round, so that a letter by the edge is never cut
  const pad = 10
  return `<svg xmlns="http://www.w3.org/2000/svg" class="en-fig" width="${fig.w + 2 * pad}" height="${fig.h + 2 * pad}" viewBox="${-pad} ${-pad} ${fig.w + 2 * pad} ${fig.h + 2 * pad}" font-family="'Times New Roman', Times, serif" fill="#111">${defs}${parts.join('')}</svg>`
}

// ---------- helpers for writing the figures ----------
/** The point at `t` of the way from a to b. */
export const along = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
export const mid = (a: Pt, b: Pt): Pt => along(a, b, 0.5)
/** The point on a circle at `deg` degrees, counted as in mathematics (up is 90°). */
export const onCircle = (c: Pt, r: number, deg: number): Pt => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] - r * Math.sin((deg * Math.PI) / 180)]
/** Where line ab meets line cd. */
export function meet(a: Pt, b: Pt, c: Pt, d: Pt): Pt {
  const den = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0])
  const t = ((a[0] - c[0]) * (c[1] - d[1]) - (a[1] - c[1]) * (c[0] - d[0])) / den
  return along(a, b, t)
}
/** The foot of the perpendicular from p to line ab. */
export function foot(p: Pt, a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  return along(a, b, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))
}

/**
 * A flat figure from its points as in mathematics (y up, any unit), scaled to `w` pixels wide with room for the
 * letters. Circle radii and text positions in `more` are in the same units and are scaled with it.
 */
export function plane(pts: Record<string, Pt>, w: number, more: Omit<Fig, 'w' | 'h' | 'p'> = {}): Fig {
  const m = 10
  const all = [...Object.values(pts), ...(more.c ?? []).flatMap((c) => {
    const [x, y] = typeof c.at === 'string' ? pts[c.at] : c.at
    return [[x - c.r, y - c.r], [x + c.r, y + c.r]] as Pt[]
  })]
  const xs = all.map((q) => q[0])
  const ys = all.map((q) => q[1])
  const x0 = Math.min(...xs)
  const top = Math.max(...ys)
  const k = (w - 2 * m) / (Math.max(...xs) - x0)
  const map = (q: Pt): Pt => [m + (q[0] - x0) * k, m + (top - q[1]) * k]
  const h = Math.ceil((top - Math.min(...ys)) * k + 2 * m)
  return {
    ...more, w, h,
    p: Object.fromEntries(Object.entries(pts).map(([n, q]) => [n, map(q)])),
    c: more.c?.map((c) => ({ ...c, at: typeof c.at === 'string' ? c.at : map(c.at), r: c.r * k })),
    t: more.t?.map((t) => ({ ...t, at: map(t.at) })),
  }
}

// ---------- solids, from their points in space ----------
export type P3 = [number, number, number]
export const mid3 = (a: P3, b: P3): P3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
export const along3 = (a: P3, b: P3, t: number): P3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
/** The foot of the perpendicular from p to line ab, in space. */
export function foot3(p: P3, a: P3, b: P3): P3 {
  const d = sub(b, a)
  return along3(a, b, dot(sub(p, a), d) / dot(d, d))
}
const sub = (a: P3, b: P3): P3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: P3, b: P3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: P3, b: P3): P3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/**
 * A convex solid drawn as in the book (cabinet projection: x to the right, y into the page at 45°, halved, z up),
 * `w` pixels wide. `faces` are its faces as chains "A-B-C-D A-B-B'-A'"; an edge is dashed when both its faces turn
 * away from the eye. The points that are not vertices (midpoints, feet) are placed too; their segments go in `s`/`d`.
 */
export function solid(p3: Record<string, P3>, faces: string, w: number, opt: Omit<Fig, 'w' | 'h' | 'p'> & { seg?: string } = {}, depth = 0.5): Fig {
  const { seg, ...more } = opt
  const c = Math.cos(Math.PI / 4) * depth
  const flat = (q: P3): Pt => [q[0] + q[1] * c, q[2] + q[1] * c]
  const view: P3 = [-c, 1, -c] // the direction that the projection flattens, into the page
  const fs = faces.trim().split(/\s+/).map((f) => f.split('-'))
  const verts = [...new Set(fs.flat())]
  const centre = verts.reduce<P3>((m, n) => [m[0] + p3[n][0] / verts.length, m[1] + p3[n][1] / verts.length, m[2] + p3[n][2] / verts.length], [0, 0, 0])
  const seen = new Map<string, boolean>()
  const shown: { n: P3; at: P3 }[] = []
  for (const f of fs) {
    let n = cross(sub(p3[f[1]], p3[f[0]]), sub(p3[f[2]], p3[f[0]]))
    if (dot(n, sub(p3[f[0]], centre)) < 0) n = [-n[0], -n[1], -n[2]]
    const visible = dot(n, view) < -1e-9
    if (visible) shown.push({ n, at: p3[f[0]] })
    f.forEach((a, i) => {
      const b = f[(i + 1) % f.length]
      const key = [a, b].sort().join('-')
      seen.set(key, (seen.get(key) ?? false) || visible)
    })
  }
  const flatPts = Object.fromEntries(Object.entries(p3).map(([k, q]) => [k, flat(q)]))
  const xs = Object.values(flatPts).map((q) => q[0])
  const ys = Object.values(flatPts).map((q) => q[1])
  const m = 8 // room for the letters by the edge
  const k = (w - 2 * m) / (Math.max(...xs) - Math.min(...xs))
  const x0 = Math.min(...xs)
  const top = Math.max(...ys)
  const p = Object.fromEntries(Object.entries(flatPts).map(([n, q]) => [n, [m + (q[0] - x0) * k, m + (top - q[1]) * k] as Pt]))
  const h = Math.ceil((top - Math.min(...ys)) * k + 2 * m)
  const edges = (vis: boolean) => [...seen].filter(([, v]) => v === vis).map(([e]) => e).join(' ')
  // the other segments: seen when both ends lie on one face that the eye sees, dashed otherwise (inside, or behind)
  const onFace = (q: P3, f: { n: P3; at: P3 }) => Math.abs(dot(f.n, sub(q, f.at))) <= 1e-6 * Math.sqrt(dot(f.n, f.n)) * (1 + Math.sqrt(dot(q, q)))
  const segs = (seg ?? '').trim().split(/\s+/).filter(Boolean)
  const segSeen = (sg: string) => {
    const [a, b] = sg.split('-').map((n) => p3[n])
    return shown.some((f) => onFace(a, f) && onFace(b, f))
  }
  const join = (...xs: (string | undefined)[]) => xs.filter(Boolean).join(' ')
  return {
    ...more, w, h, p,
    s: join(edges(true), segs.filter(segSeen).join(' '), more.s),
    d: join(edges(false), segs.filter((sg) => !segSeen(sg)).join(' '), more.d),
  }
}

function unit(p: Pt, v: Pt): Pt {
  const dx = p[0] - v[0]
  const dy = p[1] - v[1]
  const len = Math.hypot(dx, dy) || 1
  return [dx / len, dy / len]
}
