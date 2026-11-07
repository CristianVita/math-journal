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
    } else if (dep.kind === 'combo') {
      const parts = dep.parts.map(([id2, w]) => [point(id2), w] as const)
      if (parts.every(([p]) => p)) r = parts.reduce<Vec>((s, [p, w]) => add(s, mul(p!, w)), { x: 0, y: 0 })
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
      if (o.dep.kind === 'combo') return o.dep.parts.map(([p]) => p)
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
  const groups = new Map<string, string>()
  for (const o of scene.objects) {
    if ((o.type !== 'path' && o.type !== 'point') || !o.group) continue
    if (groups.has(o.group)) link(o.id, groups.get(o.group)!)
    else groups.set(o.group, o.id)
  }
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

/** Smallest convex polygon around the points, counter-clockwise (monotone chain). */
function convexHull(points: Vec[]): Vec[] {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y)
  const turn = (o: Vec, a: Vec, b: Vec) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const half = (list: Vec[]) => {
    const out: Vec[] = []
    for (const p of list) {
      while (out.length > 1 && turn(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop()
      out.push(p)
    }
    out.pop()
    return out
  }
  return [...half(pts), ...half([...pts].reverse())]
}

/** The figure of `id`; for a solid, also whatever is drawn inside it, so that it follows the solid. */
export function figureWithContents(scene: Scene, points: Resolved['points'], id: string): Set<string> {
  const out = figureOf(scene, id)
  const self = scene.objects.find((o) => o.id === id)
  if ((self?.type !== 'path' && self?.type !== 'point') || !self.group) return out
  const edges = scene.objects.flatMap((o) => (o.type === 'path' && o.group === self.group && !o.frame ? o.points : []))
  if (!edges.length) return out
  const cx = edges.reduce((s, p) => s + p[0], 0) / edges.length
  const cy = edges.reduce((s, p) => s + p[1], 0) / edges.length
  // a little wider, for what was drawn right up to an edge
  const hull = convexHull(edges.map(([x, y]) => ({ x: cx + (x - cx) * 1.1, y: cy + (y - cy) * 1.1 })))
  const inside = (p: Vec) => hull.every((a, i) => {
    const b = hull[(i + 1) % hull.length]
    return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= 0
  })
  const seen = new Set(out)
  for (const o of scene.objects) {
    if (seen.has(o.id)) continue
    const part = figureOf(scene, o.id)
    part.forEach((p) => seen.add(p))
    // what a move acts on: everything else in that figure is built on it
    const spots = scene.objects.filter((x) => part.has(x.id)).flatMap((x): Vec[] => {
      if (x.type === 'point' && x.dep.kind === 'free') return [points.get(x.id) ?? { x: x.x, y: x.y }]
      if (x.type === 'path' && !x.frame) return x.points.map(([px, py]) => ({ x: px, y: py }))
      if (x.type === 'text') return [{ x: x.x, y: x.y }]
      return []
    })
    if (spots.length && spots.every(inside)) part.forEach((p) => out.add(p))
  }
  return out
}

/** Ids to remove when deleting `id`: the object plus everything (transitively) built on it. */
export function cascade(scene: Scene, id: string): Set<string> {
  const out = new Set([id])
  const self = scene.objects.find((o) => o.id === id)
  // a solid goes with its corners; one corner on the board can go alone, but on a sheet they are a set
  if ((self?.type === 'path' || (self?.type === 'point' && self.locked)) && self.group) {
    for (const o of scene.objects) if ((o.type === 'path' || o.type === 'point') && o.group === self.group) out.add(o.id)
  }
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

/**
 * Where lines of a solid only seem to cross, being in fact one behind the other: the one behind is broken there.
 * Lines that really meet have the same depth at that spot, so they stay whole. Only edges and segments
 * whose ends have a known depth take part, and only within a solid. Gives the gaps as lengths along each line.
 */
export function solidGaps(scene: Scene, resolved: Resolved, gap: number): Map<string, [number, number][]> {
  const byId = new Map(scene.objects.map((o) => [o.id, o]))
  const lineDepth = (lineId: string, at: Vec, seen: Set<string>) => {
    const o = byId.get(lineId)
    const l = resolved.lines.get(lineId)
    if (!o || !l || !isLinear(o) || o.dep.kind !== 'twoPoints') return null
    const a = depthOf(o.dep.a, new Set(seen))
    const b = depthOf(o.dep.b, new Set(seen))
    if (!a || !b || a.group !== b.group) return null
    const along = sub(l.b, l.a)
    return { group: a.group, depth: a.depth + ((b.depth - a.depth) * dot(sub(at, l.a), along)) / dot(along, along) }
  }
  function depthOf(id: string, seen: Set<string>): { group: string; depth: number } | null {
    if (seen.has(id)) return null
    seen.add(id)
    const o = byId.get(id)
    if (o?.type !== 'point') return null
    if (o.group && o.depth != null) return { group: o.group, depth: o.depth }
    const at = resolved.points.get(id)
    if (!at) return null
    if (o.dep.kind === 'midpoint') {
      const a = depthOf(o.dep.a, new Set(seen))
      const b = depthOf(o.dep.b, new Set(seen))
      return a && b && a.group === b.group ? { group: a.group, depth: (a.depth + b.depth) / 2 } : null
    }
    if (o.dep.kind === 'combo') {
      const parts = o.dep.parts.map(([p, w]) => [depthOf(p, new Set(seen)), w] as const)
      if (!parts.every(([p]) => p && p.group === parts[0][0]?.group)) return null
      return { group: parts[0][0]!.group, depth: parts.reduce((s, [p, w]) => s + p!.depth * w, 0) }
    }
    if (o.dep.kind === 'onLine') return lineDepth(o.dep.line, at, seen)
    if (o.dep.kind === 'intersection') return lineDepth(o.dep.l1, at, seen)
    return null
  }

  type Item = { id: string; pts: [number, number][]; depth: number[]; x0: number; x1: number; y0: number; y1: number }
  const groups = new Map<string, Item[]>()
  const add3d = (group: string, id: string, pts: [number, number][], depth: number[]) => {
    const xs = pts.map((p) => p[0])
    const ys = pts.map((p) => p[1])
    const item = { id, pts, depth, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(item)
  }
  for (const o of scene.objects) {
    if (o.type === 'path' && o.group && o.depth && !o.frame) add3d(o.group, o.id, o.points, o.depth)
    if (o.type === 'segment' && !o.ghost && o.dep.kind === 'twoPoints') {
      const a = depthOf(o.dep.a, new Set())
      const b = depthOf(o.dep.b, new Set())
      const l = resolved.lines.get(o.id)
      if (a && b && l && a.group === b.group) add3d(a.group, o.id, [[l.a.x, l.a.y], [l.b.x, l.b.y]], [a.depth, b.depth])
    }
  }

  const out = new Map<string, [number, number][]>()
  const mark = (id: string, at: number) => {
    if (!out.has(id)) out.set(id, [])
    out.get(id)!.push([at - gap, at + gap])
  }
  for (const items of groups.values()) {
    const all = items.flatMap((i) => i.depth)
    const same = Math.max(1e-6, (Math.max(...all) - Math.min(...all)) * 0.01)
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const A = items[i]
        const B = items[j]
        if (A.x0 > B.x1 || B.x0 > A.x1 || A.y0 > B.y1 || B.y0 > A.y1) continue
        let sa = 0
        for (let p = 0; p + 1 < A.pts.length; p++) {
          const [ax, ay] = A.pts[p]
          const [bx, by] = A.pts[p + 1]
          const la = Math.hypot(bx - ax, by - ay)
          let sb = 0
          for (let q = 0; q + 1 < B.pts.length; q++) {
            const [cx, cy] = B.pts[q]
            const [dx, dy] = B.pts[q + 1]
            const lb = Math.hypot(dx - cx, dy - cy)
            const den = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx)
            if (Math.abs(den) > 1e-12) {
              const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / den
              const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / den
              if (t >= 0 && t < 1 && u >= 0 && u < 1) {
                const za = A.depth[p] + (A.depth[p + 1] - A.depth[p]) * t
                const zb = B.depth[q] + (B.depth[q + 1] - B.depth[q]) * u
                if (Math.abs(za - zb) > same) {
                  if (za < zb) mark(A.id, sa + la * t)
                  else mark(B.id, sb + lb * u)
                }
              }
            }
            sb += lb
          }
          sa += la
        }
      }
    }
  }
  return out
}

/** The parts of a line left once the gaps (lengths along it) are taken out. */
export function withoutGaps(pts: [number, number][], gaps: [number, number][]): [number, number][][] {
  const sorted = [...gaps].sort((a, b) => a[0] - b[0])
  const runs: [number, number][][] = []
  let run: [number, number][] = []
  let along = 0
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i]
    const [bx, by] = pts[i + 1]
    const len = Math.hypot(bx - ax, by - ay)
    const end = along + len
    const at = (s: number): [number, number] => [ax + ((bx - ax) * (s - along)) / len, ay + ((by - ay) * (s - along)) / len]
    let s = along
    while (s < end) {
      const from = s
      const g = sorted.find((x) => x[1] > from)
      if (g && g[0] <= s) {
        if (run.length > 1) runs.push(run)
        run = []
        s = Math.min(end, g[1])
        continue
      }
      const stop = g ? Math.min(end, g[0]) : end
      if (!run.length) run.push(at(s))
      run.push(at(stop))
      s = stop
    }
    along = end
  }
  if (run.length > 1) runs.push(run)
  return runs
}

// ---------- on the body of a solid: measures and constructions that do not depend on how it is seen ----------
export type V3 = [number, number, number]
export const minus3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const len3 = (a: V3) => Math.sqrt(dot3(a, a))
const cross3 = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Where a point is on the body of a solid: a corner or anything worked out from corners; null for the rest. */
export function pos3(objects: GObj[], resolved: Resolved, id: string, seen = new Set<string>()): { group: string; at: V3 } | null {
  if (seen.has(id)) return null
  seen.add(id)
  const o = objects.find((x) => x.id === id)
  if (o?.type !== 'point') return null
  if (o.at3 && o.group) return { group: o.group, at: o.at3 }
  const blend = (parts: [string, number][]) => {
    const found = parts.map(([p, w]) => [pos3(objects, resolved, p, new Set(seen)), w] as const)
    const group = found[0][0]?.group
    if (!group || !found.every(([p]) => p?.group === group)) return null
    const at = found.reduce<V3>((s, [p, w]) => [s[0] + p!.at[0] * w, s[1] + p!.at[1] * w, s[2] + p!.at[2] * w], [0, 0, 0])
    return { group, at }
  }
  const endsOf = (lineId: string) => {
    const l = objects.find((x) => x.id === lineId)
    return l && isLinear(l) && l.dep.kind === 'twoPoints' ? l.dep : null
  }
  if (o.dep.kind === 'midpoint') return blend([[o.dep.a, 0.5], [o.dep.b, 0.5]])
  if (o.dep.kind === 'combo') return blend(o.dep.parts)
  if (o.dep.kind === 'onLine') {
    const e = endsOf(o.dep.line)
    return e && blend([[e.a, 1 - o.dep.t], [e.b, o.dep.t]])
  }
  if (o.dep.kind === 'intersection') {
    const e = endsOf(o.dep.l1)
    const l = resolved.lines.get(o.dep.l1)
    const at = resolved.points.get(id)
    if (!e || !l || !at) return null
    const t = dot(sub(at, l.a), l.d) / dot(l.d, l.d)
    return blend([[e.a, 1 - t], [e.b, t]])
  }
  return null
}

export interface Line3 { group: string; a: V3; b: V3; ids: [string, string] }

/** A line whose two points are both on the body of the same solid. */
export function line3(objects: GObj[], resolved: Resolved, id: string): Line3 | null {
  const l = objects.find((x) => x.id === id)
  if (!l || !isLinear(l) || l.dep.kind !== 'twoPoints') return null
  const a = pos3(objects, resolved, l.dep.a)
  const b = pos3(objects, resolved, l.dep.b)
  return a && b && a.group === b.group ? { group: a.group, a: a.at, b: b.at, ids: [l.dep.a, l.dep.b] } : null
}

/** How many units of the plane one unit of the body is: it changes when the solid is scaled. */
export function solidScale(objects: GObj[], group: string) {
  const holder = objects.find((o) => o.type === 'path' && o.group === group && !!o.frame)
  if (holder?.type !== 'path') return 1
  const [[ox, oy], [ex, ey]] = holder.points
  return Math.hypot(ex - ox, ey - oy)
}

/** The real length between two points of a solid, whichever way it is seen. */
export function trueLength(objects: GObj[], resolved: Resolved, a: string, b: string): number | null {
  const p = pos3(objects, resolved, a)
  const q = pos3(objects, resolved, b)
  return p && q && p.group === q.group ? len3(minus3(p.at, q.at)) * solidScale(objects, p.group) : null
}

const between = (u: V3, v: V3) => Math.acos(Math.max(-1, Math.min(1, dot3(u, v) / (len3(u) * len3(v) || 1))))

/** The real angle at v between points of a solid. */
export function trueAngleAt(objects: GObj[], resolved: Resolved, a: string, v: string, b: string): number | null {
  const [pa, pv, pb] = [a, v, b].map((id) => pos3(objects, resolved, id))
  if (!pa || !pv || !pb || pa.group !== pv.group || pb.group !== pv.group) return null
  return between(minus3(pa.at, pv.at), minus3(pb.at, pv.at))
}

/** The real angle between two lines of a solid; s1, s2 pick which of their parts. */
export function trueLineAngle(objects: GObj[], resolved: Resolved, l1: string, s1: number, l2: string, s2: number): number | null {
  const a = line3(objects, resolved, l1)
  const b = line3(objects, resolved, l2)
  if (!a || !b || a.group !== b.group) return null
  const d = minus3(a.b, a.a).map((c) => c * s1) as V3
  const e = minus3(b.b, b.a).map((c) => c * s2) as V3
  return between(d, e)
}

/** Two lines of a solid that only seem to meet on the plane: they do not lie in one plane. */
export function isSkew(objects: GObj[], resolved: Resolved, l1: string, l2: string) {
  const a = line3(objects, resolved, l1)
  const b = line3(objects, resolved, l2)
  if (!a || !b || a.group !== b.group) return false
  const n = cross3(minus3(a.b, a.a), minus3(b.b, b.a))
  return len3(n) > 1e-9 && Math.abs(dot3(minus3(b.a, a.a), n)) / len3(n) > 1e-6
}

/**
 * The planes through a line of a solid in which a perpendicular can be drawn, each with a corner that fixes it.
 * The faces, when the line lies on any; otherwise every plane through it and another corner.
 */
export function planesThrough(objects: GObj[], group: string, a: V3, b: V3): { third: string; name: string }[] {
  const corners = objects.filter((o): o is PointObj => o.type === 'point' && o.group === group && !!o.at3)
  const d = minus3(b, a)
  const found: { third: string; n: V3; onIt: PointObj[]; face: boolean }[] = []
  for (const c of corners) {
    const n = cross3(d, minus3(c.at3!, a))
    if (len3(n) < 1e-9) continue
    const unit = n.map((x) => x / len3(n)) as V3
    if (found.some((f) => Math.abs(Math.abs(dot3(f.n, unit)) - 1) < 1e-9)) continue
    const side = corners.map((p) => dot3(unit, minus3(p.at3!, a)))
    found.push({
      third: c.id,
      n: unit,
      onIt: corners.filter((_, i) => Math.abs(side[i]) < 1e-9),
      face: side.every((x) => x > -1e-9) || side.every((x) => x < 1e-9),
    })
  }
  const faces = found.filter((f) => f.face)
  return (faces.length ? faces : found).map((f) => {
    // a center is not one of the letters a face is called by, unless there is nothing else (a sphere)
    const edged = f.onIt.filter((p) => p.joins?.length)
    return { third: f.third, name: (edged.length ? edged : f.onIt.filter((p) => !p.hidden)).map((p) => p.label).join('') }
  })
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
