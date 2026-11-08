// Solids, shared by the notebook and the board: real 3D bodies, seen in parallel projection.
// Model axes: x to the right, y up, z towards the viewer, with the origin in the middle of the body.
// What stays behind is worked out from the faces, so that it stays right whichever way the body is turned.

import { uid } from '../geometry/engine'
import type { GObj, PathObj, PointObj, SolidFrame } from '../geometry/types'

export const SOLIDS = [
  { id: 'cube', label: 'Cub' },
  { id: 'cuboid', label: 'Paralelipiped dreptunghic' },
  { id: 'prism3', label: 'Prismă triunghiulară' },
  { id: 'prism4', label: 'Prismă patrulateră' },
  { id: 'prism6', label: 'Prismă hexagonală' },
  { id: 'cylinder', label: 'Cilindru' },
  { id: 'cone', label: 'Con' },
  { id: 'sphere', label: 'Sferă' },
  { id: 'tetrahedron', label: 'Tetraedru regulat' },
  { id: 'pyramid3', label: 'Piramidă triunghiulară' },
  { id: 'pyramid4', label: 'Piramidă patrulateră' },
  { id: 'pyramid6', label: 'Piramidă hexagonală' },
] as const

export type SolidId = (typeof SOLIDS)[number]['id']
type Pt = [number, number]
type V3 = [number, number, number]
/** `depth` grows towards the viewer, one value for each point. */
export interface SolidLine { points: Pt[]; hidden: boolean; depth: number[] }

/**
 * How each solid is first seen (yaw, pitch), chosen so that no corner falls next to an edge it is not on.
 * The corner at the back of a pyramid stays inside the outline, so that its edges show as hidden.
 * For the cube and the square prism, a diagonal must not seem to run through a corner it does not reach.
 */
const VIEWS: Record<SolidId, [number, number]> = {
  cube: [-20, 30],
  cuboid: [-35, 25],
  prism3: [-5, 30],
  prism4: [-20, 30],
  prism6: [-10, 20],
  cylinder: [-20, 20],
  cone: [-20, 20],
  sphere: [-20, 20],
  tetrahedron: [-10, 16],
  pyramid3: [-10, 16],
  pyramid4: [-25, 20],
  pyramid6: [-10, 20],
}
export const defaultView = (id: SolidId) => VIEWS[id]

/** The body turned around its vertical axis, then tipped towards the viewer: x, y on the plane, z = depth. */
function viewOf(yaw: number, pitch: number) {
  const [sy, cy] = [Math.sin((yaw * Math.PI) / 180), Math.cos((yaw * Math.PI) / 180)]
  const [sp, cp] = [Math.sin((pitch * Math.PI) / 180), Math.cos((pitch * Math.PI) / 180)]
  return ([x, y, z]: V3): V3 => {
    const front = -x * sy + z * cy
    return [x * cy + z * sy, y * cp - front * sp, y * sp + front * cp]
  }
}

/** The corners worth building on: `top[i]` lies above `base[i]`. */
interface Corners {
  base: V3[]; top?: V3[]; apex?: V3; center?: V3; topCenter?: V3
  /** not shown: they only complete the axes of a circle */
  aux?: V3[]
}
interface Model {
  corners: Corners
  /** enough points for the size of the drawing, whichever way it is seen */
  outline: V3[]
  /** which corners are joined by an edge */
  cornerEdges: [number, number][]
  /** the circles of the body: their center and the ends of two axes, all corners */
  rims?: [number, number, number][]
  /** the sphere's center and the ends of its three axes, all corners */
  ball?: [number, number, number, number]
  /** the edges, as seen from the direction `v` (in model coordinates) */
  edges: (v: V3) => { points: V3[]; hidden: boolean }[]
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const minus = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A convex body with flat faces: an edge stays behind when both its faces look away. */
function polyhedron(verts: V3[], faces: number[][], corners: Corners): Model {
  const mid = verts.reduce<V3>((s, p) => [s[0] + p[0] / verts.length, s[1] + p[1] / verts.length, s[2] + p[2] / verts.length], [0, 0, 0])
  const normals = faces.map((f) => {
    const n = cross(minus(verts[f[1]], verts[f[0]]), minus(verts[f[2]], verts[f[0]]))
    return dot(n, minus(verts[f[0]], mid)) < 0 ? ([-n[0], -n[1], -n[2]] as V3) : n
  })
  const owners = new Map<string, { a: number; b: number; faces: number[] }>()
  faces.forEach((f, k) => f.forEach((a, i) => {
    const b = f[(i + 1) % f.length]
    const key = Math.min(a, b) + ':' + Math.max(a, b)
    if (!owners.has(key)) owners.set(key, { a, b, faces: [] })
    owners.get(key)!.faces.push(k)
  }))
  return {
    corners,
    outline: verts,
    // the corners start with the vertices, in the same order
    cornerEdges: [...owners.values()].map(({ a, b }): [number, number] => [a, b]),
    edges: (v) => [...owners.values()].map(({ a, b, faces: own }) => ({
      points: [verts[a], verts[b]],
      hidden: !own.some((k) => dot(normals[k], v) > 1e-9),
    })),
  }
}

function prismOf(base: Pt[], w: number, h: number, d: number): Model {
  const at = (y: number) => base.map(([x, z]): V3 => [x * w, y, z * d])
  const bottom = at(-h / 2)
  const top = at(h / 2)
  const n = base.length
  const faces = [bottom.map((_, i) => i), top.map((_, i) => n + i), ...base.map((_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])]
  return polyhedron([...bottom, ...top], faces, { base: bottom, top })
}

function pyramidOf(base: Pt[], w: number, h: number, d: number): Model {
  const bottom = base.map(([x, z]): V3 => [x * w, -h / 2, z * d])
  const center = bottom.reduce<V3>((s, p) => [s[0] + p[0] / bottom.length, -h / 2, s[2] + p[2] / bottom.length], [0, 0, 0])
  const apex: V3 = [center[0], h / 2, center[2]]
  const n = base.length
  const faces = [bottom.map((_, i) => i), ...base.map((_, i) => [i, (i + 1) % n, n])]
  return polyhedron([...bottom, apex], faces, { base: bottom, apex, center })
}

const RIM = 72
const circle = (r: number, y: number, t: number): V3 => [r * Math.cos(t), y, r * Math.sin(t)]
const rimAngles = Array.from({ length: RIM + 1 }, (_, i) => (i * 2 * Math.PI) / RIM)

/** A circle cut where it goes behind the body. */
function rimLines(r: number, y: number, seen: (t: number) => boolean) {
  const out: { points: V3[]; hidden: boolean }[] = []
  rimAngles.forEach((t, i) => {
    const hidden = !seen(t)
    const last = out[out.length - 1]
    if (last && last.hidden === hidden) last.points.push(circle(r, y, t))
    else out.push({ points: i ? [circle(r, y, rimAngles[i - 1]), circle(r, y, t)] : [circle(r, y, t)], hidden })
  })
  return out
}

function cylinderOf(r: number, h: number): Model {
  const rims = [...rimAngles.map((t) => circle(r, -h / 2, t)), ...rimAngles.map((t) => circle(r, h / 2, t))]
  return {
    corners: {
      base: [[-r, -h / 2, 0], [r, -h / 2, 0]],
      top: [[-r, h / 2, 0], [r, h / 2, 0]],
      center: [0, -h / 2, 0],
      topCenter: [0, h / 2, 0],
      aux: [[0, -h / 2, r], [0, h / 2, r]],
    },
    rims: [[4, 0, 6], [5, 2, 7]],
    outline: rims,
    cornerEdges: [[0, 2], [1, 3]],
    edges: (v) => {
      const side = (t: number) => Math.cos(t) * v[0] + Math.sin(t) * v[2] > 1e-9
      const lines = [...rimLines(r, -h / 2, (t) => v[1] < -1e-9 || side(t)), ...rimLines(r, h / 2, (t) => v[1] > 1e-9 || side(t))]
      // the two lines where the side turns away; seen straight from above there are none
      if (Math.hypot(v[0], v[2]) > 1e-6) {
        const t0 = Math.atan2(-v[0], v[2])
        for (const t of [t0, t0 + Math.PI]) lines.push({ points: [circle(r, -h / 2, t), circle(r, h / 2, t)], hidden: false })
      }
      return lines
    },
  }
}

function coneOf(r: number, h: number): Model {
  const apex: V3 = [0, h / 2, 0]
  return {
    corners: { base: [[-r, -h / 2, 0], [r, -h / 2, 0]], apex, center: [0, -h / 2, 0], aux: [[0, -h / 2, r]] },
    rims: [[3, 0, 4]],
    outline: [apex, ...rimAngles.map((t) => circle(r, -h / 2, t))],
    cornerEdges: [[2, 0], [2, 1]],
    edges: (v) => {
      const side = (t: number) => h * (Math.cos(t) * v[0] + Math.sin(t) * v[2]) + r * v[1] > 1e-9
      const lines = rimLines(r, -h / 2, (t) => v[1] < -1e-9 || side(t))
      // the two lines where the side turns away; seen from close above the apex there are none
      const m = Math.hypot(v[0], v[2])
      const c = m > 1e-6 ? (-r * v[1]) / (h * m) : 2
      if (Math.abs(c) <= 1) {
        const phi = Math.atan2(v[2], v[0])
        for (const t of [phi + Math.acos(c), phi - Math.acos(c)]) lines.push({ points: [apex, circle(r, -h / 2, t)], hidden: false })
      }
      return lines
    },
  }
}

/** A sphere: its outline is always a full circle, whichever way it is seen; the equator goes behind it. */
function sphereOf(r: number): Model {
  /** The great circle that faces the viewer: what is seen as the outline. */
  const outlineSeenFrom = (v: V3) => {
    const side = cross(v, [0, 1, 0])
    const a: V3 = Math.hypot(...side) < 1e-6 ? [1, 0, 0] : (side.map((c) => c / Math.hypot(...side)) as V3)
    const b = cross(v, a)
    return rimAngles.map((t): V3 => [0, 1, 2].map((i) => r * (a[i] * Math.cos(t) + b[i] * Math.sin(t))) as V3)
  }
  return {
    corners: { base: [[-r, 0, 0], [r, 0, 0]], center: [0, 0, 0], aux: [[0, 0, r], [0, r, 0]] },
    outline: outlineSeenFrom(viewerOf(...VIEWS.sphere)),
    cornerEdges: [],
    rims: [[2, 0, 3]],
    ball: [2, 1, 4, 3],
    edges: (v) => [
      { points: outlineSeenFrom(v), hidden: false },
      ...rimLines(r, 0, (t) => dot(circle(r, 0, t), v) > 1e-9),
    ],
  }
}

// counter-clockwise seen from above, from the front left, so that the letters go around the base as they do in class
const SQUARE: Pt[] = [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
const TRIANGLE: Pt[] = [[-0.5, Math.sqrt(3) / 6], [0.5, Math.sqrt(3) / 6], [0, -Math.sqrt(3) / 3]]
const HEXAGON = [120, 60, 0, -60, -120, 180].map((a): Pt => [0.5 * Math.cos((a * Math.PI) / 180), 0.5 * Math.sin((a * Math.PI) / 180)])

/** w is the width of the body, h its height. */
const MODELS: Record<SolidId, (w: number, h: number) => Model> = {
  cube: (w, h) => prismOf(SQUARE, w, h, w),
  cuboid: (w, h) => prismOf(SQUARE, w, h, w * 0.6),
  prism3: (w, h) => prismOf(TRIANGLE, w, h, w),
  prism4: (w, h) => prismOf(SQUARE, w, h, w),
  prism6: (w, h) => prismOf(HEXAGON, w, h, w),
  cylinder: (w, h) => cylinderOf(w / 2, h),
  cone: (w, h) => coneOf(w / 2, h),
  sphere: (w) => sphereOf(w / 2),
  tetrahedron: (w, h) => pyramidOf(TRIANGLE, w, h, w),
  pyramid3: (w, h) => pyramidOf(TRIANGLE, w, h, w),
  pyramid4: (w, h) => pyramidOf(SQUARE, w, h, w),
  pyramid6: (w, h) => pyramidOf(HEXAGON, w, h, w),
}

/** These keep their proportions: the height follows from the width. */
const FIXED: Partial<Record<SolidId, number>> = { cube: 1, sphere: 1, tetrahedron: Math.sqrt(2 / 3) }

function boundsOf(id: SolidId, w: number, h: number) {
  const seen = MODELS[id](w, h).outline.map(viewOf(...VIEWS[id]))
  const xs = seen.map((p) => p[0])
  const ys = seen.map((p) => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  return { w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }
}

/** The size of a body that fills the box dragged from (ax, ay) to (x, y), and the middle of that box. */
function fit(id: SolidId, ax: number, ay: number, x: number, y: number) {
  const bw = Math.abs(x - ax)
  const bh = Math.abs(y - ay)
  const ratio = FIXED[id]
  if (ratio) {
    const unit = boundsOf(id, 1, ratio)
    const s = Math.max(bw / unit.w, bh / unit.h, 1e-6)
    // the box follows the longer side, in the direction of the drag
    return {
      w: s,
      h: s * ratio,
      cx: ax + ((x < ax ? -1 : 1) * s * unit.w) / 2,
      cy: ay + ((y < ay ? -1 : 1) * s * unit.h) / 2,
    }
  }
  const w = Math.max(bw / boundsOf(id, 1, 1).w, 1e-6)
  // the drawn height grows in step with the height of the body
  const low = boundsOf(id, w, w).h
  const slope = (boundsOf(id, w, 2 * w).h - low) / w
  const h = Math.max(w * 0.25, w + (bh - low) / slope)
  return { w, h, cx: (ax + x) / 2, cy: (ay + y) / 2 }
}

const allCorners = ({ base, top, apex, center, topCenter, aux }: Corners): V3[] =>
  [...base, ...(top ?? []), ...(apex ? [apex] : []), ...(center ? [center] : []), ...(topCenter ? [topCenter] : []), ...(aux ?? [])]

/** Direction of the viewer, in model coordinates. */
function viewerOf(yaw: number, pitch: number): V3 {
  const [sy, cy] = [Math.sin((yaw * Math.PI) / 180), Math.cos((yaw * Math.PI) / 180)]
  const [sp, cp] = [Math.sin((pitch * Math.PI) / 180), Math.cos((pitch * Math.PI) / 180)]
  return [-sy * cp, sp, cy * cp]
}

/** The solid in the box dragged from (ax, ay) to (x, y). With `yUp` the y axis points up, as on the board. */
export function solidLines(id: SolidId, ax: number, ay: number, x: number, y: number, yUp = false): SolidLine[] {
  const { w, h, cx, cy } = fit(id, ax, ay, x, y)
  const b = boundsOf(id, w, h)
  const view = viewOf(...VIEWS[id])
  return MODELS[id](w, h).edges(viewerOf(...VIEWS[id])).map((l) => {
    const seen = l.points.map(view)
    return {
      hidden: l.hidden,
      points: seen.map(([u, v]): Pt => [cx + u - b.cx, cy + (yUp ? 1 : -1) * (v - b.cy)]),
      depth: seen.map((p) => p[2]),
    }
  })
}

/** Letters not yet used in `objects`; with `primes`, also free with a prime after them. O and V are kept for centers and apexes. */
export function labelMaker(objects: GObj[], primes = false) {
  const used = new Set(objects.flatMap((o) => (o.type === 'point' ? [o.label.replace(/'/g, '′')] : [])))
  const primed = (name: string) => {
    let l = name
    while (used.has(l)) l += '′'
    used.add(l)
    return l
  }
  const letter = () => {
    for (let n = 0; ; n++) {
      for (const c of 'ABCDEFGHIJKLMNPQRSTUWXYZ') {
        const l = c + (n ? String(n) : '')
        if (used.has(l) || (primes && used.has(l + '′'))) continue
        used.add(l)
        return l
      }
    }
  }
  return { primed, letter }
}

/**
 * Real points on the corners of a solid, to build on: A, B, C… on the base, A′, B′, C′… above them,
 * V at the apex, O and O′ at the centers. `place` puts a point of the view on the plane; letters already in `objects` are skipped.
 */
function cornerPoints(
  model: Model, seen: (p: V3) => V3, place: (u: number, v: number) => Pt, objects: GObj[],
  extra: { color: string; group: string; locked?: boolean },
): PointObj[] {
  const { corners, cornerEdges, rims, ball } = model
  const { base, top, apex, center, topCenter } = corners
  const { primed, letter } = labelMaker(objects, !!top)
  const labels = base.map(letter)
  const names = [
    ...labels,
    ...(top ?? []).map((_, i) => primed(labels[i] + '′')),
    ...(apex ? [primed('V')] : []),
    ...(center ? [primed('O')] : []),
    ...(topCenter ? [primed('O')] : []),
  ]
  const shown = names.length
  return allCorners(corners).map((c, i) => {
    const [u, v, depth] = seen(c)
    const [px, py] = place(u, v)
    return { id: uid(), type: 'point', x: px, y: py, label: names[i] ?? '', hidden: i >= shown, dep: { kind: 'free' }, corner: i, depth, at3: c, joins: cornerEdges.flatMap(([a, b]) => (a === i ? [b] : b === i ? [a] : [])), rim: rims?.find((r) => r[0] === i)?.slice(1) as [number, number] | undefined, ball: ball?.[0] === i ? [ball[1], ball[2], ball[3]] : undefined, ...extra }
  })
}

/** Only the corners, on a sheet where the solid itself is ink. The box is in plane coordinates, y up. */
export function solidPoints(
  id: SolidId, ax: number, ay: number, x: number, y: number, objects: GObj[],
  extra: { color: string; group: string; locked?: boolean },
): PointObj[] {
  const { w, h, cx, cy } = fit(id, ax, ay, x, y)
  const b = boundsOf(id, w, h)
  return cornerPoints(MODELS[id](w, h), viewOf(...VIEWS[id]), (u, v) => [cx + u - b.cx, cy + v - b.cy], objects, extra)
}

/** From a view of the body to the plane: the frame's three points are moved like any other drawing. */
function framePlace(points: [number, number][]) {
  const [[ox, oy], [ex, ey], [fx, fy]] = points
  return (u: number, v: number): Pt => [ox + u * (ex - ox) + v * (fx - ox), oy + u * (ey - oy) + v * (fy - oy)]
}

function edgeObjects(frame: SolidFrame, points: [number, number][], old: PathObj[], color: string, group: string): PathObj[] {
  const place = framePlace(points)
  const seen = viewOf(frame.yaw, frame.pitch)
  const model = MODELS[frame.solid](frame.w, frame.h)
  return model.edges(viewerOf(frame.yaw, frame.pitch)).map((l, i) => {
    const dense = resample(l.points.map((p) => {
      const [u, v, depth] = seen(p)
      return [...place(u, v), depth]
    }), 0.1)
    const was = old[i] ?? old[0]
    return {
      id: old[i]?.id ?? uid(),
      type: 'path',
      points: dense.map((p): Pt => [p[0], p[1]]),
      depth: dense.map((p) => p[2]),
      color: was?.color ?? color,
      width: was?.width ?? 2,
      dashed: l.hidden,
      group,
    }
  })
}

/** Everything a solid is made of on the board: its frame, its edges, its corners. The box is in plane coordinates, y up. */
export function solidObjects(id: SolidId, ax: number, ay: number, x: number, y: number, objects: GObj[], extra: { color: string; group: string }): GObj[] {
  const { w, h, cx, cy } = fit(id, ax, ay, x, y)
  const b = boundsOf(id, w, h)
  const [ox, oy] = [cx - b.cx, cy - b.cy]
  const [yaw, pitch] = VIEWS[id]
  const frame: SolidFrame = { solid: id, w, h, yaw, pitch }
  const points: [number, number][] = [[ox, oy], [ox + 1, oy], [ox, oy + 1]]
  const holder: PathObj = { id: uid(), type: 'path', points, color: extra.color, width: 0, group: extra.group, frame }
  const edges = edgeObjects(frame, points, [], extra.color, extra.group)
  const place = framePlace(points)
  return [holder, ...edges, ...cornerPoints(MODELS[id](w, h), viewOf(frame.yaw, frame.pitch), place, [...objects, ...edges], extra)]
}

/** The holder of the frame of the solid that `ids` belong to, if there is one. */
export function frameIn(objects: GObj[], ids: Set<string>): PathObj | undefined {
  return objects.find((o): o is PathObj => o.type === 'path' && !!o.frame && ids.has(o.id))
}

/** Turns a solid in space: its edges are drawn anew, its corners follow, and whatever is built on them with these. */
export function setSolidView(objects: GObj[], holderId: string, yaw: number, pitch: number): GObj[] {
  const holder = objects.find((o) => o.id === holderId)
  if (holder?.type !== 'path' || !holder.frame) return objects
  const frame: SolidFrame = { ...holder.frame, yaw, pitch }
  const group = holder.group!
  const old = objects.filter((o): o is PathObj => o.type === 'path' && o.group === group && !o.frame)
  const edges = edgeObjects(frame, holder.points, old, holder.color, group)
  const corners = allCorners(MODELS[frame.solid](frame.w, frame.h).corners)
  const seen = viewOf(yaw, pitch)
  const place = framePlace(holder.points)
  return objects.flatMap((o): GObj[] => {
    if (o.id === holderId) return [{ ...holder, frame }, ...edges]
    if (o.type === 'path' && o.group === group) return []
    if (o.type === 'point' && o.group === group && o.corner != null) {
      const [u, v, depth] = seen(corners[o.corner])
      const [x, y] = place(u, v)
      return [{ ...o, x, y, depth }]
    }
    return [o]
  })
}

/** Points along a line, at most `step` apart; its corners stay. Any other coordinates are spread along with x and y. */
export function resample(points: number[][], step: number): number[][] {
  const out: number[][] = [points[0]]
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let k = 1; k <= n; k++) out.push(a.map((c, j) => c + ((b[j] - c) * k) / n))
  }
  return out
}

/** The strokes of a solid on a sheet (x, y, pressure): a hidden edge becomes a stroke for each dash. */
export function solidStrokes(id: SolidId, ax: number, ay: number, x: number, y: number): number[][][] {
  const zoom = Math.min(1, Math.hypot(x - ax, y - ay) / 120)
  const dash = Math.max(1.5, 8 * zoom)
  const gap = Math.max(1.2, 6 * zoom)
  const step = Math.min(4, dash / 3)
  const point = ([px, py]: number[]) => [Math.round(px * 10) / 10, Math.round(py * 10) / 10, 0.5]
  return solidLines(id, ax, ay, x, y).flatMap((l) => {
    const pts = resample(l.points, step)
    if (!l.hidden) return [pts.map(point)]
    const out: number[][][] = []
    let run: number[][] = []
    let along = 0
    pts.forEach((p, i) => {
      if (i) along += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
      if (along % (dash + gap) < dash) run.push(point(p))
      else if (run.length) {
        out.push(run)
        run = []
      }
    })
    if (run.length > 1) out.push(run)
    return out
  })
}
