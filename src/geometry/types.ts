// Scene model for the geometry board. Coordinates are world units with y pointing up.
// Objects reference points by id, so dragging a point updates everything built on it.

export type PointDep =
  | { kind: 'free' }
  | { kind: 'midpoint'; a: string; b: string }
  | { kind: 'intersection'; l1: string; l2: string }
  // point obtained by rotating `from` around `center` by `deg` degrees (counter-clockwise)
  | { kind: 'rotate'; center: string; from: string; deg: number }
  // point at distance `dist` from `center`, in the direction center→toward turned by `deg` degrees
  | { kind: 'polar'; center: string; toward: string; deg: number; dist: number }
  // on the bisector of angle a-v-b, at distance `dist` from the vertex v
  | { kind: 'bisectorPoint'; a: string; v: string; b: string; dist: number }
  // where the bisector from v meets the opposite side [ab] (it divides it in the ratio va : vb)
  | { kind: 'bisectorFoot'; a: string; v: string; b: string }
  // foot of the perpendicular from `point` to `line` (orthogonal projection)
  | { kind: 'foot'; point: string; line: string }
  // at signed distance `dist` from `through`, along `ref` (or perpendicular to it): ends of finite parallels
  | { kind: 'along'; through: string; ref: string; perp: boolean; dist: number }
  // glued to a line / segment / ray: p + t·d of the resolved line (t = 0 at its first point, 1 at the second)
  | { kind: 'onLine'; line: string; t: number }
  // glued to a circle or an arc, at `angle` radians from the centre
  | { kind: 'onCircle'; circle: string; angle: number }

export interface PointObj {
  id: string
  type: 'point'
  x: number
  y: number
  label: string
  color: string
  dep: PointDep
  hidden?: boolean
}

export type LineKind = 'segment' | 'line' | 'ray'

export type LineDep =
  | { kind: 'twoPoints'; a: string; b: string }
  | { kind: 'perpendicular'; through: string; ref: string }
  | { kind: 'parallel'; through: string; ref: string }
  | { kind: 'bisector'; a: string; v: string; b: string }

export interface LineObj {
  id: string
  type: LineKind
  dep: LineDep
  color: string
  width: number
  dashed?: boolean
  showLength?: boolean
  label?: string
}

export interface CircleObj {
  id: string
  type: 'circle'
  center: string
  through: string
  color: string
  width: number
  showRadius?: boolean
}

/** Arc from `through` counter-clockwise to the direction of `to`, on the circle of center `center` through `through`. */
export interface ArcObj {
  id: string
  type: 'arc'
  center: string
  through: string
  to: string
  color: string
  width: number
  /** a circular sector: its two radii are segments of their own, this only adds the color inside */
  sector?: boolean
  filled?: boolean
  showRadius?: boolean
}

export interface PolygonObj {
  id: string
  type: 'polygon'
  points: string[]
  color: string
  fill: string
  width: number
}

export interface AngleObj {
  id: string
  type: 'angle'
  a: string
  v: string
  b: string
  color: string
  showValue: boolean
  // mark the angle as a right angle (square) when it is ~90°
  rightMark: boolean
}

/**
 * Angle between two lines already on the board. The vertex is their intersection; s1 / s2 (±1)
 * pick which of the four angles is shown: the one between the parts the user clicked.
 */
export interface LineAngleObj {
  id: string
  type: 'lineAngle'
  l1: string
  l2: string
  s1: 1 | -1
  s2: 1 | -1
  color: string
  showValue: boolean
  rightMark: boolean
}

export interface TextObj {
  id: string
  type: 'text'
  x: number
  y: number
  text: string // LaTeX allowed between $...$
  color: string
  size: number
}

export interface PathObj {
  id: string
  type: 'path'
  points: [number, number][]
  color: string
  width: number
}

export interface FunctionObj {
  id: string
  type: 'function'
  expr: string // in x, ex: "2*sin(x) + 1"
  color: string
  width: number
}

export type GObj = PointObj | LineObj | CircleObj | ArcObj | PolygonObj | AngleObj | LineAngleObj | TextObj | PathObj | FunctionObj

export interface View {
  cx: number // world coordinates at the canvas centre
  cy: number
  scale: number // pixels per unit
  grid: boolean
  axes: boolean
  snap: boolean
  angleUnit: 'deg' | 'rad'
}

export interface Scene {
  objects: GObj[]
  view: View
}

export const emptyScene = (): Scene => ({
  objects: [],
  view: { cx: 0, cy: 0, scale: 40, grid: true, axes: true, snap: true, angleUnit: 'deg' },
})

export const isLinear = (o: GObj): o is LineObj => o.type === 'segment' || o.type === 'line' || o.type === 'ray'
