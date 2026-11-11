// Basic figures for the notebook, drawn by dragging from one corner of their box to the opposite one.
import { uid } from '../geometry/engine'
import type { GObj, PointObj } from '../geometry/types'
import { labelMaker } from './solids'
import { linePoints, round } from './useInstruments'

export const SHAPES = [
  { id: 'segment', label: 'Segment' },
  { id: 'triangle', label: 'Triunghi' },
  { id: 'right', label: 'Triunghi dreptunghic' },
  { id: 'equilateral', label: 'Triunghi echilateral' },
  { id: 'square', label: 'Pătrat' },
  { id: 'rectangle', label: 'Dreptunghi' },
  { id: 'parallelogram', label: 'Paralelogram' },
  { id: 'rhombus', label: 'Romb' },
  { id: 'trapezoid', label: 'Trapez' },
  { id: 'rightTrapezoid', label: 'Trapez dreptunghic' },
  { id: 'kite', label: 'Zmeu' },
  { id: 'circle', label: 'Cerc' },
  { id: 'ellipse', label: 'Elipsă' },
] as const

export type ShapeId = (typeof SHAPES)[number]['id']

/** The figure in the box dragged from a to (x, y): its corners in order, or, if it is round, its center and two half-axes. */
function shapeGeometry(shape: ShapeId, a: number[], x: number, y: number) {
  const [ax, ay] = a
  if (shape === 'segment') return { corners: [[ax, ay], [x, y]] }
  let w = x - ax
  let h = y - ay
  // these keep their proportions: the box follows its longer side, in the direction of the drag
  if (shape === 'square' || shape === 'circle') {
    const side = Math.max(Math.abs(w), Math.abs(h))
    w = (w < 0 ? -1 : 1) * side
    h = (h < 0 ? -1 : 1) * side
  }
  if (shape === 'equilateral') h = (h < 0 ? -1 : 1) * (Math.abs(w) * Math.sqrt(3)) / 2
  const l = Math.min(ax, ax + w)
  const r = Math.max(ax, ax + w)
  const t = Math.min(ay, ay + h)
  const b = Math.max(ay, ay + h)
  const mx = (l + r) / 2
  const my = (t + b) / 2
  const k = (r - l) * 0.25

  if (shape === 'circle' || shape === 'ellipse') return { center: [mx, my], rx: (r - l) / 2, ry: (b - t) / 2 }

  const corners: Record<Exclude<ShapeId, 'segment' | 'circle' | 'ellipse'>, number[][]> = {
    triangle: [[mx, t], [r, b], [l, b]],
    equilateral: [[mx, t], [r, b], [l, b]],
    // the right angle follows the drag: the vertical leg stays where the drag started, the other leg goes towards the
    // mouse, to the left or to the right, up or down (asked for on 11 November 2026)
    right: [[ax, ay], [ax, ay + h], [ax + w, ay + h]],
    square: [[l, t], [r, t], [r, b], [l, b]],
    rectangle: [[l, t], [r, t], [r, b], [l, b]],
    parallelogram: [[l + k, t], [r, t], [r - k, b], [l, b]],
    rhombus: [[mx, t], [r, my], [mx, b], [l, my]],
    trapezoid: [[l + k, t], [r - k, t], [r, b], [l, b]],
    // the same for the right trapezoid: its right angles stay on the side where the drag started
    rightTrapezoid: x < ax ? [[r, t], [l + k, t], [l, b], [r, b]] : [[l, t], [r - k, t], [r, b], [l, b]],
    kite: [[mx, t], [r, t + (b - t) * 0.3], [mx, b], [l, t + (b - t) * 0.3]],
  }
  return { corners: corners[shape] }
}

/** Each side is a stroke of its own, so the corners stay sharp. Returns the strokes' points, from corner a to corner (x, y). */
export function shapeStrokes(shape: ShapeId, a: number[], x: number, y: number): number[][][] {
  const g = shapeGeometry(shape, a, x, y)
  if (g.center) {
    const { center: [mx, my], rx, ry } = g
    const n = Math.max(24, Math.ceil((Math.PI * 2 * (rx + ry)) / 2 / 4))
    return [Array.from({ length: n + 1 }, (_, i) => {
      const u = (i / n) * Math.PI * 2
      return [round(mx + rx * Math.cos(u)), round(my + ry * Math.sin(u)), 0.5]
    })]
  }
  const c = g.corners
  if (shape === 'segment') return [linePoints(a, x, y)]
  return c.map((p, i) => {
    const q = c[(i + 1) % c.length]
    return linePoints(p, q[0], q[1])
  })
}

/**
 * Real points on a figure of a page, for the constructions: its corners, with letters, or the center of a round one.
 * The figure itself is ink, so they stay where they are; tools build on them as they do on the corners of a solid.
 * `place` turns a position on the sheet into one on the plane of the constructions.
 */
export function shapePoints(
  shape: ShapeId, a: number[], x: number, y: number, objects: GObj[], place: (p: number[]) => number[],
  extra: { color: string; group: string; locked: boolean },
): PointObj[] {
  const g = shapeGeometry(shape, a, x, y)
  const { primed, letter } = labelMaker(objects)
  const point = (at: number[], label: string, corner: number, more: Partial<PointObj>): PointObj => {
    const [px, py] = place(at)
    return { id: uid(), type: 'point', x: px, y: py, label, dep: { kind: 'free' }, corner, ...extra, ...more }
  }
  if (g.center) {
    const [mx, my] = g.center
    const center = point([mx, my], primed('O'), 0, { joins: [], rim: [1, 2] })
    // asked for on 11 November 2026: the circle has a point A for its radius, the ellipse the ends A and B of an axis
    const left = shape === 'ellipse' ? letter() : ''
    const right = letter()
    return [
      center,
      point([mx + g.rx, my], right, 1, { joins: [] }),
      // not shown: it only gives the second axis
      point([mx, my + g.ry], '', 2, { hidden: true, joins: [] }),
      ...(shape === 'ellipse' ? [point([mx - g.rx, my], left, 3, { joins: [] })] : []),
    ]
  }
  const c = g.corners
  return c.map((p, i) => point(p, letter(), i, {
    joins: c.length === 2 ? [1 - i] : [(i + 1) % c.length, (i + c.length - 1) % c.length],
  }))
}
