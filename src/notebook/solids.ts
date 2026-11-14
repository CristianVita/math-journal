// Solids, shared by the notebook and the board: real 3D bodies, seen in parallel projection.
// Model axes: x to the right, y up, z towards the viewer, with the origin in the middle of the body.
// What stays behind is worked out from the faces, so that it stays right whichever way the body is turned.

import { uid } from '../geometry/engine'
import type { GObj, PathObj, PointObj, SolidFrame, SolidPart } from '../geometry/types'

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
  { id: 'frustum3', label: 'Trunchi de piramidă triunghiulară' },
  { id: 'frustum4', label: 'Trunchi de piramidă patrulateră' },
  { id: 'frustum6', label: 'Trunchi de piramidă hexagonală' },
  { id: 'frustumCone', label: 'Trunchi de con' },
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
  cylinder: [0, 20],
  cone: [0, 20],
  sphere: [-20, 20],
  tetrahedron: [-10, 16],
  pyramid3: [-10, 16],
  pyramid4: [-25, 20],
  pyramid6: [-10, 20],
  frustum3: [-10, 20],
  frustum4: [-25, 20],
  frustum6: [-10, 20],
  frustumCone: [0, 20],
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
  /** where the body cuts the plane at height `y`, parallel to the base, as seen from `v` */
  section: (y: number, v: V3) => { points: V3[]; hidden: boolean }[]
  /** a body with flat faces: its vertices and faces, with the outward normals, to glue it to another */
  poly?: { verts: V3[]; faces: number[][]; normals: V3[] }
  /** a round body around the y axis: its side goes from radius r0 at y0 to radius r1 at y1 */
  surface?: { y0: number; y1: number; r0: number; r1: number }
  /** the flat round faces of a body made of round parts, to glue another to them */
  disks?: { y: number; r: number; up: boolean }[]
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const minus = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]

/** A convex body with flat faces: an edge stays behind when both its faces look away. */
function polyhedron(verts: V3[], faces: number[][], corners: Corners, given?: V3[]): Model {
  const mid = verts.reduce<V3>((s, p) => [s[0] + p[0] / verts.length, s[1] + p[1] / verts.length, s[2] + p[2] / verts.length], [0, 0, 0])
  // a body glued from several brings the normals of its parts: it need not be convex
  const normals = given ?? faces.map((f) => {
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
    poly: { verts, faces, normals },
    // the corners start with the vertices, in the same order
    cornerEdges: [...owners.values()].map(({ a, b }): [number, number] => [a, b]),
    edges: (v) => [...owners.values()].map(({ a, b, faces: own }) => ({
      points: [verts[a], verts[b]],
      hidden: !own.some((k) => dot(normals[k], v) > 1e-9),
    })),
    // each face crossed by the plane gives one side of the section, seen when the face is
    section: (y, v) => faces.flatMap((f, k) => {
      const cut: V3[] = []
      f.forEach((a, i) => {
        const [p, q] = [verts[a], verts[f[(i + 1) % f.length]]]
        if ((p[1] - y) * (q[1] - y) < 0) {
          const t = (y - p[1]) / (q[1] - p[1])
          cut.push([p[0] + t * (q[0] - p[0]), y, p[2] + t * (q[2] - p[2])])
        }
      })
      return cut.length === 2 ? [{ points: cut, hidden: dot(normals[k], v) <= 1e-9 }] : []
    }),
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

/** A frustum of a pyramid: the top is the base made `k` times smaller, right above its center. */
function frustumOf(base: Pt[], w: number, h: number, d: number, k: number): Model {
  const bottom = base.map(([x, z]): V3 => [x * w, -h / 2, z * d])
  const top = base.map(([x, z]): V3 => [x * w * k, h / 2, z * d * k])
  const n = base.length
  const faces = [bottom.map((_, i) => i), top.map((_, i) => n + i), ...base.map((_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])]
  return polyhedron([...bottom, ...top], faces, { base: bottom, top, center: [0, -h / 2, 0], topCenter: [0, h / 2, 0] })
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
  // the circle starts at angle 0: a part that runs across it is one line, not two
  if (out.length > 2 && out[0].hidden === out[out.length - 1].hidden) {
    const last = out.pop()!
    out[0] = { ...out[0], points: [...last.points, ...out[0].points.slice(1)] }
  }
  return out
}

/** A circle of the side of a round body, cut where the side turns away. */
const sideCircle = (r: number, y: number, seen: (t: number) => boolean) => (r > 1e-9 ? rimLines(r, y, seen) : [])

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
    surface: { y0: -h / 2, y1: h / 2, r0: r, r1: r },
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
    section: (y, v) => sideCircle(r, y, (t) => Math.cos(t) * v[0] + Math.sin(t) * v[2] > 1e-9),
  }
}

/** A frustum of a cone, with the radius R below and r above. */
function coneFrustumOf(R: number, r: number, h: number): Model {
  const rims = [...rimAngles.map((t) => circle(R, -h / 2, t)), ...rimAngles.map((t) => circle(r, h / 2, t))]
  const side = (v: V3) => (t: number) => h * (Math.cos(t) * v[0] + Math.sin(t) * v[2]) + (R - r) * v[1] > 1e-9
  const at = (y: number) => R + ((r - R) * (y + h / 2)) / h
  return {
    corners: {
      base: [[-R, -h / 2, 0], [R, -h / 2, 0]],
      top: [[-r, h / 2, 0], [r, h / 2, 0]],
      center: [0, -h / 2, 0],
      topCenter: [0, h / 2, 0],
      aux: [[0, -h / 2, R], [0, h / 2, r]],
    },
    rims: [[4, 0, 6], [5, 2, 7]],
    outline: rims,
    surface: { y0: -h / 2, y1: h / 2, r0: R, r1: r },
    cornerEdges: [[0, 2], [1, 3]],
    edges: (v) => {
      const lines = [...rimLines(R, -h / 2, (t) => v[1] < -1e-9 || side(v)(t)), ...rimLines(r, h / 2, (t) => v[1] > 1e-9 || side(v)(t))]
      // the two generatrices where the side turns away, as for the cone
      const m = Math.hypot(v[0], v[2])
      const c = m > 1e-6 ? (-(R - r) * v[1]) / (h * m) : 2
      if (Math.abs(c) <= 1) {
        const phi = Math.atan2(v[2], v[0])
        for (const t of [phi + Math.acos(c), phi - Math.acos(c)]) lines.push({ points: [circle(R, -h / 2, t), circle(r, h / 2, t)], hidden: false })
      }
      return lines
    },
    section: (y, v) => sideCircle(at(y), y, side(v)),
  }
}

function coneOf(r: number, h: number): Model {
  const apex: V3 = [0, h / 2, 0]
  return {
    corners: { base: [[-r, -h / 2, 0], [r, -h / 2, 0]], apex, center: [0, -h / 2, 0], aux: [[0, -h / 2, r]] },
    rims: [[3, 0, 4]],
    outline: [apex, ...rimAngles.map((t) => circle(r, -h / 2, t))],
    surface: { y0: -h / 2, y1: h / 2, r0: r, r1: 0 },
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
    section: (y, v) => sideCircle((r * (h / 2 - y)) / h, y, (t) => h * (Math.cos(t) * v[0] + Math.sin(t) * v[2]) + r * v[1] > 1e-9),
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
    section: (y, v) => {
      const s = Math.sqrt(Math.max(0, r * r - y * y))
      return sideCircle(s, y, (t) => dot(circle(s, y, t), v) > 1e-9)
    },
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
  frustum3: (w, h) => frustumOf(TRIANGLE, w, h, w, 0.5),
  frustum4: (w, h) => frustumOf(SQUARE, w, h, w, 0.5),
  frustum6: (w, h) => frustumOf(HEXAGON, w, h, w, 0.5),
  frustumCone: (w, h) => coneFrustumOf(w / 2, w / 4, h),
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
  const model = modelOf(frame)
  const v = viewerOf(frame.yaw, frame.pitch)
  const lines = [...model.edges(v), ...(frame.cut != null ? model.section(heightOf(model, frame.cut), v) : [])]
  return lines.map((l, i) => {
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

/** The height in the model of the plane that cuts the body at `cut` (0 at the base, 1 at the top). */
function heightOf(model: Model, cut: number) {
  const ys = model.outline.map((p) => p[1])
  const [lo, hi] = [Math.min(...ys), Math.max(...ys)]
  return lo + cut * (hi - lo)
}

/**
 * The corners of the section at `cut`: where it crosses the edges between corners, and its center on the axis.
 * Each is a weighted sum of two corners (`a`, `b`, with the weight `s` on `b`), so it follows the body when it turns.
 */
function sectionCorners(model: Model, cut: number) {
  const corners = allCorners(model.corners)
  const y = heightOf(model, cut)
  const out: { key: string; a: number; b: number; s: number; named: number | 'center' }[] = []
  for (const [i, j] of model.cornerEdges) {
    const [a, b] = corners[i][1] <= corners[j][1] ? [i, j] : [j, i]
    const [ya, yb] = [corners[a][1], corners[b][1]]
    if (ya < y && y < yb) out.push({ key: a + ':' + b, a, b, s: (y - ya) / (yb - ya), named: a })
  }
  const { center, topCenter, apex, base, top, aux } = model.corners
  if (center) {
    const c = base.length + (top?.length ?? 0) + (apex ? 1 : 0)
    // the other end of the axis: the top center, the apex, or for the sphere its upper pole
    const upper = topCenter ? c + 1 : apex ? c - 1 : aux?.findIndex((p) => p[1] > center[1] + 1e-9)
    if (upper != null && upper >= 0) {
      const u = topCenter || apex ? upper : c + 1 + upper
      const [y0, y1] = [corners[c][1], corners[u][1]]
      out.push({ key: 'axis', a: c, b: u, s: (y - y0) / (y1 - y0), named: 'center' })
    }
  }
  return out
}

/**
 * Cuts a solid with a plane parallel to its base at `cut` (0 at the base, 1 at the top), or takes the cut away with null.
 * The section is drawn on the body, and its corners become points with letters: A′, B′… under the letters of the base
 * (or A″… when those are taken), and O′ or O″ in the middle. Moving the plane moves the same points, so what was built
 * on them stays; taking the cut away removes them and whatever was built on them.
 */
export function setSolidCut(objects: GObj[], holderId: string, cut: number | null): GObj[] {
  const holder = objects.find((o) => o.id === holderId)
  if (holder?.type !== 'path' || !holder.frame) return objects
  const frame: SolidFrame = { ...holder.frame, cut: cut ?? undefined }
  const group = holder.group!
  const model = modelOf(frame)
  const old = objects.filter((o): o is PathObj => o.type === 'path' && o.group === group && !o.frame)
  const edges = edgeObjects(frame, holder.points, old, holder.color, group)
  const byCorner = new Map(objects.flatMap((o) => (o.type === 'point' && o.group === group && o.corner != null ? [[o.corner, o] as const] : [])))
  const wanted = cut == null ? [] : sectionCorners(model, cut)
  const keep = new Set(wanted.map((w) => w.key))
  // points of an earlier cut that the new one no longer has go, with what was built on them
  const gone = new Set(objects.filter((o) => o.type === 'point' && o.cutOf === holderId && !keep.has(o.cutKey ?? '')).map((o) => o.id))
  let grew = true
  while (grew) {
    grew = false
    for (const o of objects) if (!gone.has(o.id) && dependsOn(o).some((id) => gone.has(id))) { gone.add(o.id); grew = true }
  }
  const corners = allCorners(model.corners)
  const seen = viewOf(frame.yaw, frame.pitch)
  const place = framePlace(holder.points)
  const { primed } = labelMaker(objects.filter((o) => !gone.has(o.id)))
  const made = new Map<string, PointObj>()
  for (const w of wanted) {
    const pa = byCorner.get(w.a)
    const pb = byCorner.get(w.b)
    if (!pa || !pb) continue
    const p3 = corners[w.a].map((c, k) => c + w.s * (corners[w.b][k] - c)) as V3
    const [u, v, depth] = seen(p3)
    const [x, y] = place(u, v)
    const dep = { kind: 'combo' as const, parts: [[pa.id, 1 - w.s], [pb.id, w.s]] as [string, number][] }
    const was = objects.find((o): o is PointObj => o.type === 'point' && o.cutOf === holderId && o.cutKey === w.key)
    made.set(w.key, was
      ? { ...was, x, y, depth, dep }
      : { id: uid(), type: 'point', x, y, depth, dep, color: holder.color, cutOf: holderId, cutKey: w.key, label: primed((w.named === 'center' ? 'O' : byCorner.get(w.named)?.label ?? 'M').replace(/′+$/, '') + '′') })
  }
  const fresh = [...made.values()].filter((p) => !objects.some((o) => o.id === p.id))
  return objects.flatMap((o): GObj[] => {
    if (gone.has(o.id)) return []
    if (o.id === holderId) return [{ ...holder, frame }, ...edges, ...fresh]
    if (o.type === 'path' && o.group === group) return []
    if (o.type === 'point' && o.cutOf === holderId) return [made.get(o.cutKey ?? '') ?? o]
    return [o]
  })
}

/** The ids an object is built on. */
function dependsOn(o: GObj): string[] {
  if (o.type === 'point') {
    const d = o.dep as Record<string, unknown> & { kind: string }
    if (d.kind === 'combo') return (d.parts as [string, number][]).map(([p]) => p)
    return Object.values(d).filter((x): x is string => typeof x === 'string' && x !== d.kind)
  }
  if ('dep' in o && o.dep && typeof o.dep === 'object') return Object.values(o.dep as Record<string, unknown>).filter((x): x is string => typeof x === 'string')
  return Object.values(o).filter((x): x is string => typeof x === 'string' && x.length > 6 && x !== o.id)
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
  const corners = allCorners(modelOf(frame).corners)
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

// ================= bodies made of several (asked for on 11 November 2026) =================
// A pyramid glued on a prism, two cubes side by side, a sphere inside a cube: the other bodies are parts of the first
// one's frame, placed in its model coordinates, so they turn, move and go away together with it. Glued bodies with flat
// faces become one body: the faces they share go, and what is behind is worked out for the whole of it. Round bodies
// glued along their axis share their circle, seen where either side is. A body inside is seen through the other.

type M3 = number[]
const ID: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1]
const mulM = (m: M3, p: V3): V3 => [m[0] * p[0] + m[1] * p[1] + m[2] * p[2], m[3] * p[0] + m[4] * p[1] + m[5] * p[2], m[6] * p[0] + m[7] * p[1] + m[8] * p[2]]
const add3 = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const times3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k]
const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2])
const unit3 = (a: V3): V3 => times3(a, 1 / (len3(a) || 1))
const lastOf = <T,>(a: T[]) => a[a.length - 1]

interface Placed { model: Model; rot: M3; at: V3; inside: boolean }
function placedParts(frame: SolidFrame): Placed[] {
  return [
    { model: MODELS[frame.solid](frame.w, frame.h), rot: ID, at: [0, 0, 0], inside: false },
    ...(frame.parts ?? []).map((p) => ({ model: MODELS[p.solid](p.w, p.h), rot: p.rot, at: p.at as V3, inside: !!p.inside })),
  ]
}
const put = (pl: Placed, p: V3) => add3(mulM(pl.rot, p), pl.at)
/** The direction of the viewer in a part's own coordinates: the inverse of a rotation is its transpose. */
const viewIn = (pl: Placed, v: V3): V3 => {
  const m = pl.rot
  return [m[0] * v[0] + m[3] * v[1] + m[6] * v[2], m[1] * v[0] + m[4] * v[1] + m[7] * v[2], m[2] * v[0] + m[5] * v[1] + m[8] * v[2]]
}
const drawn = (pl: Placed, lines: { points: V3[]; hidden: boolean }[]) => lines.map((l) => ({ ...l, points: l.points.map((p) => put(pl, p)) }))

type CornerKind = 'base' | 'top' | 'apex' | 'center' | 'topCenter' | 'aux'
function cornerKinds({ base, top, apex, center, topCenter, aux }: Corners): { p: V3; kind: CornerKind; i: number }[] {
  return [
    ...base.map((p, i) => ({ p, kind: 'base' as const, i })),
    ...(top ?? []).map((p, i) => ({ p, kind: 'top' as const, i })),
    ...(apex ? [{ p: apex, kind: 'apex' as const, i: 0 }] : []),
    ...(center ? [{ p: center, kind: 'center' as const, i: 0 }] : []),
    ...(topCenter ? [{ p: topCenter, kind: 'topCenter' as const, i: 0 }] : []),
    ...(aux ?? []).map((p, i) => ({ p, kind: 'aux' as const, i })),
  ]
}

/**
 * All the corners of a body and its parts, in one list: first those of the body itself, in their usual order (so the
 * points already on it keep their place), then the new ones of each part. A corner that falls on one already there is
 * the same corner.
 */
function flatCorners(frame: SolidFrame) {
  const parts = placedParts(frame)
  const eps = 1e-6 * (frame.w + frame.h)
  const corners: { p: V3; kind: CornerKind; i: number; part: number }[] = []
  const maps: number[][] = []
  parts.forEach((pl, k) => {
    maps.push(cornerKinds(pl.model.corners).map((c) => {
      const p = put(pl, c.p)
      // the hidden ends of axes stay apart: they belong to their own circle
      const same = c.kind === 'aux' ? -1 : corners.findIndex((x) => x.kind !== 'aux' && len3(minus(x.p, p)) < eps)
      if (same >= 0) return same
      corners.push({ p, kind: c.kind, i: c.i, part: k })
      return corners.length - 1
    }))
  })
  const key = new Set<string>()
  const edges: [number, number][] = []
  parts.forEach((pl, k) => {
    for (const [a, b] of pl.model.cornerEdges) {
      const [x, y] = [maps[k][a], maps[k][b]]
      const id = Math.min(x, y) + ':' + Math.max(x, y)
      if (x !== y && !key.has(id)) {
        key.add(id)
        edges.push([x, y])
      }
    }
  })
  const rims = parts.flatMap((pl, k) => (pl.model.rims ?? []).map((t) => t.map((i) => maps[k][i]) as [number, number, number]))
  const ball = parts.map((pl, k) => pl.model.ball?.map((i) => maps[k][i]) as [number, number, number, number] | undefined).find(Boolean)
  return { corners, maps, edges, rims, ball, parts, eps }
}

/** The rounds of a stack of round bodies on one axis, each from (y0, r0) up to (y1, r1), from the bottom up. */
function roundStack(glued: Placed[]) {
  return glued.map((pl) => {
    const { y0, y1, r0, r1 } = pl.model.surface!
    const a = { y: pl.at[1] + pl.rot[4] * y0, r: r0 }
    const b = { y: pl.at[1] + pl.rot[4] * y1, r: r1 }
    return a.y <= b.y ? { y0: a.y, r0: a.r, y1: b.y, r1: b.r } : { y0: b.y, r0: b.r, y1: a.y, r1: a.r }
  }).sort((p, q) => p.y0 - q.y0)
}

/** The model of a body with its parts; for a body alone, its own model. */
export function modelOf(frame: SolidFrame): Model {
  if (!frame.parts?.length) return MODELS[frame.solid](frame.w, frame.h)
  const flat = flatCorners(frame)
  const glued = flat.parts.filter((p) => !p.inside)
  const inside = flat.parts.filter((p) => p.inside)
  const outline = flat.parts.flatMap((pl) => pl.model.outline.map((p) => put(pl, p)))
  let body: Pick<Model, 'edges' | 'section' | 'poly' | 'disks'>
  if (glued.every((p) => p.model.poly)) {
    // one body with flat faces: vertices that meet are one, and the faces two parts share are inside it
    const verts: V3[] = []
    const at = (p: V3) => {
      const i = verts.findIndex((q) => len3(minus(q, p)) < flat.eps)
      if (i >= 0) return i
      verts.push(p)
      return verts.length - 1
    }
    const faces: number[][] = []
    const normals: V3[] = []
    for (const pl of glued) {
      const poly = pl.model.poly!
      poly.faces.forEach((f, k) => {
        faces.push(f.map((i) => at(put(pl, poly.verts[i]))))
        normals.push(mulM(pl.rot, poly.normals[k]))
      })
    }
    const sig = faces.map((f) => [...f].sort((a, b) => a - b).join(','))
    const keep = faces.map((_, k) => sig.filter((x) => x === sig[k]).length === 1)
    const m = polyhedron(verts, faces.filter((_, k) => keep[k]), { base: verts }, normals.filter((_, k) => keep[k]))
    body = { edges: m.edges, section: m.section, poly: m.poly }
  } else if (glued.every((p) => p.model.surface)) {
    const stack = roundStack(glued)
    const side = (s: (typeof stack)[number], v: V3) => (t: number) => (s.y1 - s.y0) * (Math.cos(t) * v[0] + Math.sin(t) * v[2]) + (s.r0 - s.r1) * v[1] > 1e-9
    const top = lastOf(stack)
    body = {
      edges: (v) => {
        const lines: { points: V3[]; hidden: boolean }[] = []
        stack.forEach((s, k) => {
          // the circle at the bottom of this round: seen from below, or where a side next to it is seen
          const below = stack[k - 1]
          if (s.r0 > 1e-9) lines.push(...rimLines(s.r0, s.y0, (t) => (below ? side(below, v)(t) : v[1] < -1e-9) || side(s, v)(t)))
          const m = Math.hypot(v[0], v[2])
          const c = m > 1e-6 ? (-(s.r0 - s.r1) * v[1]) / ((s.y1 - s.y0) * m) : 2
          if (Math.abs(c) <= 1) {
            const phi = Math.atan2(v[2], v[0])
            for (const t of [phi + Math.acos(c), phi - Math.acos(c)]) lines.push({ points: [circle(s.r0, s.y0, t), circle(s.r1, s.y1, t)], hidden: false })
          }
        })
        if (top.r1 > 1e-9) lines.push(...rimLines(top.r1, top.y1, (t) => v[1] > 1e-9 || side(top, v)(t)))
        return lines
      },
      section: (y, v) => {
        const s = stack.find((x) => x.y0 <= y && y <= x.y1)
        return s ? sideCircle(s.r0 + ((s.r1 - s.r0) * (y - s.y0)) / (s.y1 - s.y0), y, side(s, v)) : []
      },
      disks: [
        ...(stack[0].r0 > 1e-9 ? [{ y: stack[0].y0, r: stack[0].r0, up: false }] : []),
        ...(top.r1 > 1e-9 ? [{ y: top.y1, r: top.r1, up: true }] : []),
      ],
    }
  } else {
    // parts we do not know how to join: each is drawn on its own
    body = {
      edges: (v) => glued.flatMap((pl) => drawn(pl, pl.model.edges(viewIn(pl, v)))),
      section: () => [],
    }
  }
  return {
    corners: { base: flat.corners.map((c) => c.p) },
    outline,
    cornerEdges: flat.edges,
    rims: flat.rims,
    ball: flat.ball,
    edges: (v) => [...body.edges(v), ...inside.flatMap((pl) => drawn(pl, pl.model.edges(viewIn(pl, v))))],
    section: body.section,
    poly: body.poly,
    disks: body.disks,
  }
}

/** The flat faces a body can be glued on: regular polygons (n sides) and circles, with their center and outward normal. */
function glueFaces(model: Model) {
  const out: { center: V3; normal: V3; kind: number | 'circle'; size: number; v0: V3 }[] = []
  if (model.poly) {
    const { verts, faces, normals } = model.poly
    faces.forEach((f, k) => {
      const ps = f.map((i) => verts[i])
      const center = times3(ps.reduce<V3>((s, p) => add3(s, p), [0, 0, 0]), 1 / ps.length)
      const sides = ps.map((p, i) => len3(minus(ps[(i + 1) % ps.length], p)))
      const radii = ps.map((p) => len3(minus(p, center)))
      // regular: equal sides and every corner as far from the middle
      const regular = sides.every((x) => Math.abs(x - sides[0]) < 1e-6 * sides[0]) && radii.every((x) => Math.abs(x - radii[0]) < 1e-6 * radii[0])
      if (regular) out.push({ center, normal: unit3(normals[k]), kind: ps.length, size: sides[0], v0: ps[0] })
    })
  }
  const s = model.surface
  const disks = model.disks ?? (s
    ? [...(s.r0 > 1e-9 ? [{ y: s.y0, r: s.r0, up: false }] : []), ...(s.r1 > 1e-9 ? [{ y: s.y1, r: s.r1, up: true }] : [])]
    : [])
  for (const d of disks) out.push({ center: [0, d.y, 0], normal: [0, d.up ? 1 : -1, 0], kind: 'circle', size: d.r, v0: [d.r, d.y, 0] })
  return out
}

/** The rotation that takes the pair (f, u) to (g, w): both are perpendicular unit vectors. */
function rotationTaking(f: V3, u: V3, g: V3, w: V3): M3 {
  const a = [f, u, cross(f, u)]
  const b = [g, w, cross(g, w)]
  // R = B · Aᵀ, with the vectors as columns
  const m: M3 = []
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) m.push(b[0][i] * a[0][j] + b[1][i] * a[1][j] + b[2][i] * a[2][j])
  return m
}

/** A unit vector at right angles to n. */
const across = (n: V3): V3 => unit3(Math.abs(n[1]) < 0.9 ? cross(n, [0, 1, 0]) : cross(n, [1, 0, 0]))

/**
 * Rebuilds a body after its parts changed: its edges, and its corners. Each point already on it, or brought by a body
 * glued to it (`adopt`, with its place in this body's coordinates), keeps its letter if its corner is still there;
 * two points on the same corner become one, the first; points left without a corner go, with what is built on them.
 * New corners get new points: letters for the corners of a base, the same with a prime for those above them, V for an
 * apex, O for a center.
 */
function rebuild(objects: GObj[], holderId: string, frame: SolidFrame, adopt: { point: PointObj; at: V3 }[] = []): GObj[] {
  const holder = objects.find((o): o is PathObj => o.id === holderId && o.type === 'path')!
  const group = holder.group!
  const flat = flatCorners(frame)
  const old = objects.filter((o): o is PathObj => o.type === 'path' && o.group === group && !o.frame)
  const edges = edgeObjects(frame, holder.points, old, holder.color, group)
  const seen = viewOf(frame.yaw, frame.pitch)
  const place = framePlace(holder.points)
  const adopted = new Map(adopt.map((a) => [a.point.id, a.at]))
  const mine = [
    ...objects.filter((o): o is PointObj => o.type === 'point' && o.group === group && o.corner != null && !!o.at3),
    ...adopt.map((a) => a.point),
  ]
  const owner = new Map<number, PointObj>()
  const gone = new Set<string>()
  for (const p of mine) {
    const at = adopted.get(p.id) ?? (p.at3 as V3)
    const j = flat.corners.findIndex((c, i) => !owner.has(i) && (c.kind === 'aux') === !!p.hidden && len3(minus(c.p, at)) < flat.eps)
    if (j < 0) gone.add(p.id)
    else owner.set(j, p)
  }
  let grew = true
  while (grew) {
    grew = false
    for (const o of objects) if (!gone.has(o.id) && dependsOn(o).some((id) => gone.has(id))) { gone.add(o.id); grew = true }
  }
  const { primed, letter } = labelMaker([...objects.filter((o) => !gone.has(o.id) && !adopted.has(o.id)), ...adopt.map((a) => a.point)])
  const baseLabel = new Map<string, string>()
  flat.corners.forEach((c, j) => {
    if (c.kind === 'base' && owner.has(j)) baseLabel.set(c.part + ':' + c.i, owner.get(j)!.label)
  })
  const made = flat.corners.map((c, j): PointObj => {
    const [u, v, depth] = seen(c.p)
    const [x, y] = place(u, v)
    const more = {
      x, y, depth, at3: c.p, corner: j, group,
      joins: flat.edges.flatMap(([a, b]) => (a === j ? [b] : b === j ? [a] : [])),
      rim: flat.rims.find((t) => t[0] === j)?.slice(1) as [number, number] | undefined,
      ball: flat.ball?.[0] === j ? ([flat.ball[1], flat.ball[2], flat.ball[3]] as [number, number, number]) : undefined,
    }
    const had = owner.get(j)
    if (had) return { ...had, ...more, dep: { kind: 'free' } }
    let label = ''
    if (c.kind === 'base') {
      label = letter()
      baseLabel.set(c.part + ':' + c.i, label)
    } else if (c.kind === 'top') label = primed((baseLabel.get(c.part + ':' + c.i) ?? letter()) + '′')
    else if (c.kind === 'apex') label = primed('V')
    else if (c.kind === 'center' || c.kind === 'topCenter') label = primed('O')
    return { id: uid(), type: 'point', label, hidden: c.kind === 'aux', dep: { kind: 'free' }, color: holder.color, ...more }
  })
  const byId = new Map(made.map((p) => [p.id, p]))
  const fresh = made.filter((p) => !objects.some((o) => o.id === p.id) || adopted.has(p.id))
  return objects.flatMap((o): GObj[] => {
    if (gone.has(o.id) || adopted.has(o.id)) return []
    if (o.id === holderId) return [{ ...holder, frame }, ...edges, ...fresh]
    if (o.type === 'path' && o.group === group) return []
    return [byId.get(o.id) ?? o]
  })
}

/**
 * Glues the body `draggedId` to a face of the body `targetId`, if one of its two flat ends (the base, or the top) was
 * dropped close to a face of the same shape: a regular polygon with as many sides, or a circle. It is made the size of
 * that face, turned to lie on it, and becomes a part of the target. Returns null when no face is close enough;
 * `gap` says how close the two were, to choose among several bodies.
 */
export function glueSolid(objects: GObj[], targetId: string, draggedId: string): { objects: GObj[]; gap: number } | null {
  const target = objects.find((o) => o.id === targetId)
  const dragged = objects.find((o) => o.id === draggedId)
  if (target?.type !== 'path' || !target.frame || dragged?.type !== 'path' || !dragged.frame || dragged.frame.parts?.length) return null
  if (target.frame.parts?.some((p) => p.inside)) return null
  const ft = target.frame
  const fd = dragged.frame
  const onPlane = (holder: PathObj, f: SolidFrame) => {
    const seen = viewOf(f.yaw, f.pitch)
    const place = framePlace(holder.points)
    return (p: V3) => {
      const [u, v] = seen(p)
      return place(u, v)
    }
  }
  const pt = onPlane(target, ft)
  const pd = onPlane(dragged, fd)
  // only the two ends of the dragged body: its base and its top
  const ends = glueFaces(MODELS[fd.solid](fd.w, fd.h)).filter((f) => Math.abs(Math.abs(f.normal[1]) - 1) < 1e-9)
  type Face = ReturnType<typeof glueFaces>[number]
  let best: { t: Face; d: Face; gap: number } | null = null
  for (const t of glueFaces(modelOf(ft))) {
    const [cx, cy] = pt(t.center)
    const [ex, ey] = pt(t.v0)
    const reach = Math.max(Math.hypot(ex - cx, ey - cy), 1e-9)
    for (const d of ends) {
      if (d.kind !== t.kind) continue
      const [dx, dy] = pd(d.center)
      const gap = Math.hypot(dx - cx, dy - cy) / reach
      if (gap < 0.6 && (!best || gap < best.gap)) best = { t, d, gap }
    }
  }
  if (!best) return null
  const { t, d } = best
  const k = t.size / d.size
  const [w, h] = [fd.w * k, fd.h * k]
  const dc = times3(d.center, k)
  const u: V3 = d.kind === 'circle' ? [1, 0, 0] : unit3(minus(times3(d.v0, k), dc))
  const wT = t.kind === 'circle' ? across(t.normal) : unit3(minus(t.v0, t.center))
  const rot = rotationTaking(d.normal, u, times3(t.normal, -1), wT)
  const at = minus(t.center, mulM(rot, dc))
  const part: SolidPart = { solid: fd.solid, w, h, rot, at }
  const frame: SolidFrame = { ...ft, cut: undefined, parts: [...(ft.parts ?? []), part] }
  const placed: Placed = { model: MODELS[fd.solid](w, h), rot, at, inside: false }
  // the corners of the dragged body come along, in this body's coordinates
  const adopt = objects.flatMap((o) => (o.type === 'point' && o.group === dragged.group && o.at3 && o.corner != null
    ? [{ point: { ...o, group: target.group }, at: put(placed, times3(o.at3 as V3, k)) }]
    : []))
  const without = objects.filter((o) => !(o.type === 'path' && o.group === dragged.group))
  const cleared = ft.cut != null ? setSolidCut(without, targetId, null) : without
  return { objects: rebuild(cleared, targetId, frame, adopt), gap: best.gap }
}

/** Takes the part `index` away from a body: its corners go, unless another part shares them. */
export function removeSolidPart(objects: GObj[], holderId: string, index: number): GObj[] {
  const holder = objects.find((o) => o.id === holderId)
  if (holder?.type !== 'path' || !holder.frame?.parts) return objects
  const parts = holder.frame.parts.filter((_, i) => i !== index)
  return rebuild(objects, holderId, { ...holder.frame, cut: undefined, parts: parts.length ? parts : undefined })
}

export const INSIDE = [
  { id: 'inSphere', label: 'Sfera înscrisă' },
  { id: 'outSphere', label: 'Sfera circumscrisă' },
  { id: 'cone', label: 'Con cu aceeași bază' },
  { id: 'pyramid', label: 'Piramidă cu aceeași bază' },
  { id: 'cylinder', label: 'Cilindru înscris' },
  { id: 'prism', label: 'Prismă patrulateră înscrisă' },
] as const
export type InsideId = (typeof INSIDE)[number]['id']

const PYRAMID_OF: Partial<Record<SolidId, SolidId>> = { prism3: 'pyramid3', prism4: 'pyramid4', cube: 'pyramid4', prism6: 'pyramid6' }
const PYRAMIDS: SolidId[] = ['pyramid3', 'pyramid4', 'pyramid6', 'tetrahedron']

/**
 * The body that fits inside `frame` in the way asked, or a message saying why it does not. The sphere touching all the
 * faces needs a body that has one: a cube, a cylinder as tall as it is wide, a cone, a regular pyramid, a frustum of a
 * cone with h² = 4Rr. The sphere through all the corners needs corners on one sphere.
 */
export function insidePart(frame: SolidFrame, what: InsideId): SolidPart | string {
  const { solid, w, h } = frame
  const model = MODELS[solid](w, h)
  const sphere = (r: number, y: number): SolidPart => ({ solid: 'sphere', w: 2 * r, h: 2 * r, rot: ID, at: [0, y, 0], inside: true })
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a), Math.abs(b))
  const s = model.surface
  if (what === 'inSphere') {
    if (solid === 'cube') return sphere(w / 2, 0)
    if (solid === 'sphere') return 'O sferă nu are o sferă înscrisă diferită de ea.'
    if (solid === 'cylinder') return near(h, w) ? sphere(w / 2, 0) : 'Sfera înscrisă cere un cilindru echilateral (înălțimea egală cu diametrul). Desenează-l cu Shift sau ajustează-l.'
    if (solid === 'cone' && s) {
      const r = (s.r0 * h) / (s.r0 + Math.hypot(s.r0, h))
      return sphere(r, -h / 2 + r)
    }
    if (solid === 'frustumCone' && s) {
      return near(h * h, 4 * s.r0 * s.r1) ? sphere(h / 2, 0) : 'Sfera înscrisă într-un trunchi de con cere h² = 4Rr, iar trunchiul desenat nu are aceste proporții.'
    }
    if (PYRAMIDS.includes(solid)) {
      // the center is on the height, as far from the base as from a lateral face
      const [a, b] = model.corners.base
      const ab = Math.hypot((a[0] + b[0]) / 2, (a[2] + b[2]) / 2)
      const r = (ab * h) / (ab + Math.hypot(ab, h))
      return sphere(r, -h / 2 + r)
    }
    return 'Acest corp nu are o sferă tangentă la toate fețele.'
  }
  if (what === 'outSphere') {
    if (solid === 'sphere') return 'O sferă nu are o sferă circumscrisă diferită de ea.'
    const c = model.corners
    // the radius of the circle the corners stand on, at the bottom and at the top
    let lo: number
    let hi: number
    if (s) {
      lo = s.r0
      hi = s.r1
    } else {
      const down = c.base.map((p) => Math.hypot(p[0], p[2]))
      const up = (c.top ?? []).map((p) => Math.hypot(p[0], p[2]))
      if (![...down, ...up].every((x, i, all) => i < down.length ? Math.abs(x - down[0]) < 1e-6 * w : Math.abs(x - all[down.length]) < 1e-6 * w)) {
        return 'Vârfurile acestui corp nu sunt pe aceeași sferă.'
      }
      lo = down[0]
      hi = up.length ? up[0] : 0
    }
    // (y + h/2)² + lo² = (y − h/2)² + hi²  →  y = (hi² − lo²) / (2h)
    const y = (hi * hi - lo * lo) / (2 * h)
    return sphere(Math.hypot(y + h / 2, lo), y)
  }
  if (what === 'cone') {
    if (solid !== 'cylinder') return 'Conul cu aceeași bază se pune într-un cilindru.'
    return { solid: 'cone', w, h, rot: ID, at: [0, 0, 0], inside: true }
  }
  if (what === 'pyramid') {
    const p = PYRAMID_OF[solid]
    if (!p) return 'Piramida cu aceeași bază se pune într-o prismă regulată sau într-un cub.'
    return { solid: p, w, h, rot: ID, at: [0, 0, 0], inside: true }
  }
  if (what === 'cylinder') {
    if (solid !== 'cube' && solid !== 'prism4') return 'Cilindrul înscris se pune într-un cub sau într-o prismă patrulateră regulată.'
    return { solid: 'cylinder', w, h, rot: ID, at: [0, 0, 0], inside: true }
  }
  if (solid !== 'cylinder') return 'Prisma înscrisă se pune într-un cilindru.'
  // a square in the circle: its corners on the circle, its sides at 45°
  const q = Math.SQRT1_2
  return { solid: 'prism4', w: w / Math.SQRT2, h, rot: [q, 0, -q, 0, 1, 0, q, 0, q], at: [0, 0, 0], inside: true }
}

/** Puts a body inside another, as `insidePart` says. Returns a message instead when it does not fit. */
export function addInside(objects: GObj[], holderId: string, what: InsideId): GObj[] | string {
  const holder = objects.find((o) => o.id === holderId)
  if (holder?.type !== 'path' || !holder.frame) return objects
  if (holder.frame.parts?.some((p) => !p.inside)) return 'Un corp se pune în interiorul unui corp simplu, nu al unuia lipit din mai multe.'
  const part = insidePart(holder.frame, what)
  if (typeof part === 'string') return part
  const cleared = holder.frame.cut != null ? setSolidCut(objects, holderId, null) : objects
  const now = cleared.find((o): o is PathObj => o.id === holderId && o.type === 'path')!
  return rebuild(cleared, holderId, { ...now.frame!, parts: [...(now.frame!.parts ?? []), part] })
}
