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
    case 'polygon':
      return o.points
    case 'angle':
      return [o.a, o.v, o.b]
    default:
      return []
  }
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

export const uid = () => Math.random().toString(36).slice(2, 10)

export function formatNum(v: number, digits = 2) {
  const r = Math.round(v * 10 ** digits) / 10 ** digits
  return Object.is(r, -0) ? '0' : String(r)
}
