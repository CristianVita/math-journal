// Scene model for the geometry board. Coordinates are world units with y pointing up.
// Objects reference points by id, so dragging a point updates everything built on it.

export type PointDep =
  | { kind: 'free' }
  | { kind: 'midpoint'; a: string; b: string }
  | { kind: 'intersection'; l1: string; l2: string }
  // point obtained by rotating `from` around `center` by `deg` degrees (counter-clockwise)
  | { kind: 'rotate'; center: string; from: string; deg: number }

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

export type GObj = PointObj | LineObj | CircleObj | PolygonObj | AngleObj | TextObj | PathObj | FunctionObj

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
