import type { GObj, LineObj, PointObj, Scene } from './types'
import { isLinear } from './types'

export type Vec = { x: number; y: number }

export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y })
export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y })
export const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k })
export const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y
export const cross = (a: Vec, b: Vec) => a.x * b.y - a.y * b.x
export const len = (a: Vec) => Math.hypot(a.x, a.y)
export const dist = (a: Vec, b: Vec) => len(sub(a, b))
export const norm = (a: Vec): Vec => {
  const l = len(a) || 1
  return { x: a.x / l, y: a.y / l }
}
export const rotate = (p: Vec, c: Vec, rad: number): Vec => {
  const d = sub(p, c)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return { x: c.x + d.x * cos - d.y * sin, y: c.y + d.x * sin + d.y * cos }
}

/** Resolved line: origin `p`, direction `d`; for segments/rays `a`/`b` are the defining endpoints. */
export interface ResolvedLine {
  kind: LineObj['type']
  p: Vec
  d: Vec
  a: Vec
  b: Vec
}

export interface Resolved {
  points: Map<string, Vec | null>
  lines: Map<string, ResolvedLine | null>
}

/** Angle at v from ray v→a to ray v→b, counter-clockwise, in [0, 2π). */
export function angleCCW(a: Vec, v: Vec, b: Vec) {
  const t1 = Math.atan2(a.y - v.y, a.x - v.x)
  const t2 = Math.atan2(b.y - v.y, b.x - v.x)
  let r = t2 - t1
  while (r < 0) r += Math.PI * 2
  while (r >= Math.PI * 2) r -= Math.PI * 2
  return r
}

/** Is the direction of q from c on the arc that goes counter-clockwise from t to the direction of `to`? */
export function onArc(q: Vec, c: Vec, t: Vec, to: Vec) {
  return angleCCW(t, c, q) <= angleCCW(t, c, to) + 1e-9
}

/** Where the drawn arc ends: on its circle, in the direction of `to`. */
export function arcEnd(c: Vec, t: Vec, to: Vec) {
  return add(c, mul(norm(sub(to, c)), dist(c, t)))
}

/** The end of an arc from t around c towards q, a whole number of degrees long (0 to 359). */
export function arcWholeDegrees(c: Vec, t: Vec, q: Vec) {
  const deg = Math.min(359, Math.round((angleCCW(t, c, q) * 180) / Math.PI))
  return { deg, pos: rotate(t, c, (deg * Math.PI) / 180) }
}

/** The points that bound an arc: its two ends and whichever of the circle's extremes are on it. */
export function arcBounds(c: Vec, t: Vec, to: Vec) {
  const r = dist(c, t)
  const extremes = [{ x: c.x + r, y: c.y }, { x: c.x, y: c.y + r }, { x: c.x - r, y: c.y }, { x: c.x, y: c.y - r }]
  return [t, arcEnd(c, t, to), ...extremes.filter((q) => onArc(q, c, t, to))]
}

/** Interior (non-reflex) angle at v, in [0, π]. */
export function angleAt(a: Vec, v: Vec, b: Vec) {
  const r = angleCCW(a, v, b)
  return r > Math.PI ? Math.PI * 2 - r : r
}

export function intersectLines(l1: ResolvedLine, l2: ResolvedLine): Vec | null {
  const den = cross(l1.d, l2.d)
  if (Math.abs(den) < 1e-12) return null
  const t = cross(sub(l2.p, l1.p), l2.d) / den
  return add(l1.p, mul(l1.d, t))
}

export function resolve(scene: Scene): Resolved {
  const byId = new Map<string, GObj>(scene.objects.map((o) => [o.id, o]))
  const points = new Map<string, Vec | null>()
  const lines = new Map<string, ResolvedLine | null>()
  const visiting = new Set<string>()

  const point = (id: string): Vec | null => {
    if (points.has(id)) return points.get(id)!
    const o = byId.get(id) as PointObj | undefined
    if (!o || o.type !== 'point' || visiting.has(id)) return null
    visiting.add(id)
    let r: Vec | null = null
    const dep = o.dep
    if (dep.kind === 'free') r = { x: o.x, y: o.y }
    else if (dep.kind === 'midpoint') {
      const a = point(dep.a)
      const b = point(dep.b)
      r = a && b ? mul(add(a, b), 0.5) : null
    } else if (dep.kind === 'rotate') {
      const c = point(dep.center)
      const f = point(dep.from)
      r = c && f ? rotate(f, c, (dep.deg * Math.PI) / 180) : null
    } else if (dep.kind === 'intersection') {
      const l1 = line(dep.l1)
      const l2 = line(dep.l2)
      r = l1 && l2 ? intersectLines(l1, l2) : null
    } else if (dep.kind === 'bisectorPoint' || dep.kind === 'bisectorFoot') {
      const a = point(dep.a)
      const v = point(dep.v)
      const b = point(dep.b)
      if (a && v && b && dist(a, v) > 1e-9 && dist(b, v) > 1e-9) {
        if (dep.kind === 'bisectorFoot') {
          // bisector theorem: the foot D on [ab] satisfies aD / Db = va / vb
          r = add(a, mul(sub(b, a), dist(v, a) / (dist(v, a) + dist(v, b))))
        } else {
          const u = add(norm(sub(a, v)), norm(sub(b, v)))
          // a straight angle (180°) has no sum direction: take the perpendicular to va
          const dir = len(u) < 1e-9 ? { x: -(a.y - v.y), y: a.x - v.x } : u
          r = add(v, mul(norm(dir), dep.dist))
        }
      }
    } else if (dep.kind === 'onLine') {
      const l = line(dep.line)
      if (l) r = add(l.p, mul(l.d, dep.t))
    } else if (dep.kind === 'onCircle') {
      const c = byId.get(dep.circle)
      if (c?.type === 'circle' || c?.type === 'arc') {
        const center = point(c.center)
        const through = point(c.through)
        if (center && through) r = add(center, mul({ x: Math.cos(dep.angle), y: Math.sin(dep.angle) }, dist(center, through)))
      }
    } else if (dep.kind === 'along') {
      const q = point(dep.through)
      const l = line(dep.ref)
      if (q && l) r = add(q, mul(norm(dep.perp ? { x: -l.d.y, y: l.d.x } : l.d), dep.dist))
    } else if (dep.kind === 'foot') {
      const q = point(dep.point)
      const l = line(dep.line)
      if (q && l) r = add(l.p, mul(l.d, dot(sub(q, l.p), l.d) / dot(l.d, l.d)))
    } else if (dep.kind === 'polar') {
      const c = point(dep.center)
      const t = point(dep.toward)
      if (c && t && dist(c, t) > 1e-9) r = add(c, mul(rotate(norm(sub(t, c)), { x: 0, y: 0 }, (dep.deg * Math.PI) / 180), dep.dist))
    }
    visiting.delete(id)
    points.set(id, r)
    return r
  }

  const line = (id: string): ResolvedLine | null => {
    if (lines.has(id)) return lines.get(id)!
    const o = byId.get(id)
    if (!o || !isLinear(o) || visiting.has(id)) return null
    visiting.add(id)
    let r: ResolvedLine | null = null
    const dep = o.dep
    if (dep.kind === 'twoPoints') {
      const a = point(dep.a)
      const b = point(dep.b)
      if (a && b && dist(a, b) > 1e-9) r = { kind: o.type, p: a, d: sub(b, a), a, b }
    } else if (dep.kind === 'perpendicular' || dep.kind === 'parallel') {
      const t = point(dep.through)
      const ref = line(dep.ref)
      if (t && ref) {
        const d = dep.kind === 'parallel' ? ref.d : { x: -ref.d.y, y: ref.d.x }
        r = { kind: o.type, p: t, d, a: t, b: add(t, d) }
      }
    } else if (dep.kind === 'bisector') {
      const a = point(dep.a)
      const v = point(dep.v)
      const b = point(dep.b)
      if (a && v && b) {
        const d = add(norm(sub(a, v)), norm(sub(b, v)))
        const dir = len(d) < 1e-9 ? { x: -(a.y - v.y), y: a.x - v.x } : d
        r = { kind: o.type, p: v, d: dir, a: v, b: add(v, norm(dir)) }
      }
    }
    visiting.delete(id)
    lines.set(id, r)
    return r
  }

  for (const o of scene.objects) {
    if (o.type === 'point') point(o.id)
    else if (isLinear(o)) line(o.id)
  }
  return { points, lines }
}

/** Parameter t of the point of l closest to q (p + t·d), kept on the drawn part of segments and rays. */
export function projectParam(q: Vec, l: ResolvedLine): number {
  let t = dot(sub(q, l.p), l.d) / dot(l.d, l.d)
  if (l.kind === 'segment') t = Math.max(0, Math.min(1, t))
  if (l.kind === 'ray') t = Math.max(0, t)
  return t
}

/** Distance from point q to the drawn part of a line/segment/ray. */
export function distToLine(q: Vec, l: ResolvedLine) {
  const d2 = dot(l.d, l.d)
  let t = dot(sub(q, l.p), l.d) / d2
  if (l.kind === 'segment') t = Math.max(0, Math.min(1, t))
  if (l.kind === 'ray') t = Math.max(0, t)
  return dist(q, add(l.p, mul(l.d, t)))
}

/** Every point id an object depends on (directly). Used for cascade delete. */
export function dependsOn(o: GObj): string[] {
  switch (o.type) {
    case 'point':
      if (o.dep.kind === 'midpoint') return [o.dep.a, o.dep.b]
      if (o.dep.kind === 'rotate') return [o.dep.center, o.dep.from]
      if (o.dep.kind === 'polar') return [o.dep.center, o.dep.toward]
      if (o.dep.kind === 'foot') return [o.dep.point, o.dep.line]
      if (o.dep.kind === 'along') return [o.dep.through, o.dep.ref]
      if (o.dep.kind === 'onLine') return [o.dep.line]
      if (o.dep.kind === 'onCircle') return [o.dep.circle]
      if (o.dep.kind === 'bisectorPoint' || o.dep.kind === 'bisectorFoot') return [o.dep.a, o.dep.v, o.dep.b]
      if (o.dep.kind === 'intersection') return [o.dep.l1, o.dep.l2]
      return []
    case 'segment':
    case 'line':
    case 'ray':
      if (o.dep.kind === 'twoPoints') return [o.dep.a, o.dep.b]
      if (o.dep.kind === 'bisector') return [o.dep.a, o.dep.v, o.dep.b]
      return [o.dep.through, o.dep.ref]
    case 'circle':
      return [o.center, o.through]
    case 'arc':
      return [o.center, o.through, o.to]
    case 'polygon':
      return o.points
    case 'angle':
      return [o.a, o.v, o.b]
    case 'lineAngle':
      return [o.l1, o.l2]
    default:
      return []
  }
}

/**
 * The whole figure `id` belongs to: every object connected to it through shared points or lines,
 * in either direction (a triangle's sides, vertices, angles, bisectors…).
 */
export function figureOf(scene: Scene, id: string): Set<string> {
  const links = new Map<string, Set<string>>()
  const link = (a: string, b: string) => {
    if (!links.has(a)) links.set(a, new Set())
    if (!links.has(b)) links.set(b, new Set())
    links.get(a)!.add(b)
    links.get(b)!.add(a)
  }
  for (const o of scene.objects) for (const d of dependsOn(o)) link(o.id, d)
  const out = new Set([id])
  const queue = [id]
  while (queue.length) {
    for (const next of links.get(queue.pop()!) ?? []) {
      if (!out.has(next)) {
        out.add(next)
        queue.push(next)
      }
    }
  }
  return out
}

/** Ids to remove when deleting `id`: the object plus everything (transitively) built on it. */
export function cascade(scene: Scene, id: string): Set<string> {
  const out = new Set([id])
  let changed = true
  while (changed) {
    changed = false
    for (const o of scene.objects) {
      if (!out.has(o.id) && dependsOn(o).some((d) => out.has(d))) {
        out.add(o.id)
        changed = true
      }
    }
  }
  return out
}

export function nextLabel(scene: Scene): string {
  const used = new Set(scene.objects.filter((o) => o.type === 'point').map((o) => (o as PointObj).label))
  for (let n = 0; ; n++) {
    for (let c = 0; c < 26; c++) {
      const l = String.fromCharCode(65 + c) + (n ? String(n) : '')
      if (!used.has(l)) return l
    }
  }
}

/** The center of a circle is called O; when that is taken, O′, O′′ and so on. A typed O' counts as taken too. */
export function centerLabel(objects: GObj[]): string {
  const used = new Set(objects.flatMap((o) => (o.type === 'point' ? [o.label.replace(/'/g, '′')] : [])))
  let l = 'O'
  while (used.has(l)) l += '′'
  return l
}

export const uid = () => Math.random().toString(36).slice(2, 10)

export function formatNum(v: number, digits = 2) {
  const r = Math.round(v * 10 ** digits) / 10 ** digits
  return Object.is(r, -0) ? '0' : String(r)
}
