// Measures and constructions on the body of a solid: they must not depend on how the solid is seen.
import { describe, expect, it } from 'vitest'
import { setSolidView, solidObjects } from '../notebook/solids'
import { isSkew, planesThrough, pos3, resolve, solidGaps, trueAngleAt, trueLength, trueLineAngle, withoutGaps } from './engine'
import { emptyScene, type GObj, type LineObj, type PathObj, type PointObj } from './types'

const SIDE = 6
const view = emptyScene().view
const cube = () => solidObjects('cube', 0, 0, SIDE, SIDE, [], { color: '#000', group: 'g' })
const holderOf = (objects: GObj[]) => objects.find((o): o is PathObj => o.type === 'path' && !!o.frame)!
const id = (objects: GObj[], label: string) => objects.find((o): o is PointObj => o.type === 'point' && o.label === label)!.id
const segment = (objects: GObj[], a: string, b: string, name = a + b): LineObj =>
  ({ id: name, type: 'segment', dep: { kind: 'twoPoints', a: id(objects, a), b: id(objects, b) }, color: '#000', width: 2 })
const degrees = (rad: number | null) => (rad === null ? null : (rad * 180) / Math.PI)

/** The side of the cube as drawn: the drag sets its size, not SIDE itself. */
const sideOf = (objects: GObj[]) => trueLength(objects, resolve({ objects, view }), id(objects, 'A'), id(objects, 'B'))!

const VIEWS: [number, number][] = [[-20, 30], [0, 0], [45, -35], [130, 70], [-160, -80], [77, 12]]
const turned = (yaw: number, pitch: number) => {
  const c = cube()
  return setSolidView(c, holderOf(c).id, yaw, pitch)
}

describe('real lengths', () => {
  it.each(VIEWS)('edge, face diagonal and space diagonal of a cube seen at %i°, %i°', (yaw, pitch) => {
    const c = turned(yaw, pitch)
    const r = resolve({ objects: c, view })
    const len = (a: string, b: string) => trueLength(c, r, id(c, a), id(c, b))!
    const side = len('A', 'B')
    expect(side).toBeGreaterThan(0)
    expect(len('B', 'C')).toBeCloseTo(side, 9)
    expect(len('A', 'A′')).toBeCloseTo(side, 9)
    expect(len('A', 'C')).toBeCloseTo(side * Math.SQRT2, 9)
    expect(len('A', 'C′')).toBeCloseTo(side * Math.sqrt(3), 9)
  })

  it('stay the same through every view', () => {
    const sides = VIEWS.map(([y, p]) => sideOf(turned(y, p)))
    for (const s of sides) expect(s).toBeCloseTo(sides[0], 9)
  })

  it('grow with the solid when it is scaled on the board', () => {
    const c = cube()
    const before = sideOf(c)
    // what a scaling by 2 around the origin does: every point, every path and the frame are sent twice as far
    const scaled = c.map((o): GObj =>
      o.type === 'point' ? { ...o, x: o.x * 2, y: o.y * 2 }
        : o.type === 'path' ? { ...o, points: o.points.map(([x, y]) => [x * 2, y * 2] as [number, number]) } : o)
    expect(sideOf(scaled)).toBeCloseTo(before * 2, 9)
  })
})

describe('real angles', () => {
  it.each(VIEWS)('right angles of a cube seen at %i°, %i° read 90°', (yaw, pitch) => {
    const c = turned(yaw, pitch)
    const r = resolve({ objects: c, view })
    const angle = (a: string, v: string, b: string) => degrees(trueAngleAt(c, r, id(c, a), id(c, v), id(c, b)))
    expect(angle('A', 'B', 'C')).toBeCloseTo(90, 9)
    expect(angle('A', 'B', 'B′')).toBeCloseTo(90, 9)
    // between an edge and the space diagonal: arccos(1/√3)
    expect(angle('B', 'A', 'C′')).toBeCloseTo((Math.acos(1 / Math.sqrt(3)) * 180) / Math.PI, 9)
  })

  it('the angle between two skew edges is their real one', () => {
    const c = cube()
    const objects = [...c, segment(c, 'A', 'B'), segment(c, 'C', 'C′', 'CC′')]
    expect(degrees(trueLineAngle(objects, resolve({ objects, view }), 'AB', 1, 'CC′', 1))).toBeCloseTo(90, 9)
  })
})

describe('lines in space', () => {
  const c = cube()
  const objects = [...c, segment(c, 'A', 'B'), segment(c, 'C', 'C′', 'CC′'), segment(c, 'C', 'D'), segment(c, 'A', 'C'), segment(c, 'B', 'D')]
  const r = resolve({ objects, view })

  it('an edge and an edge it never meets are skew', () => expect(isSkew(objects, r, 'AB', 'CC′')).toBe(true))
  it('two parallel edges are not skew', () => expect(isSkew(objects, r, 'AB', 'CD')).toBe(false))
  it('the diagonals of a face are not skew: they meet', () => expect(isSkew(objects, r, 'AC', 'BD')).toBe(false))

  it('an edge lies in two faces: a perpendicular there asks which one', () => {
    const a = pos3(objects, r, id(c, 'A'))!
    const b = pos3(objects, r, id(c, 'B'))!
    const names = planesThrough(objects, 'g', a.at, b.at).map((p) => [...p.name.replace(/′/g, "'")].sort().join(''))
    expect(names.sort()).toEqual(["''AABB", 'ABCD'])
  })
})

describe('points worked out on the body', () => {
  it.each(VIEWS)('the center of a cube seen at %i°, %i° is half a space diagonal from each corner', (yaw, pitch) => {
    const c = turned(yaw, pitch)
    const center: PointObj = {
      id: 'M', type: 'point', x: 0, y: 0, label: 'M', color: '#000',
      dep: { kind: 'combo', parts: [[id(c, 'A'), 0.5], [id(c, 'C′'), 0.5]] },
    }
    const objects = [...c, center]
    const r = resolve({ objects, view })
    const side = trueLength(objects, r, id(c, 'A'), id(c, 'B'))!
    for (const corner of ['A', 'B', 'C', 'D', 'A′', 'B′', 'C′', 'D′']) {
      expect(trueLength(objects, r, 'M', id(c, corner))).toBeCloseTo((side * Math.sqrt(3)) / 2, 9)
    }
    // and on the screen, it is the middle of the two corners
    const [p, a, c2] = ['M', id(c, 'A'), id(c, 'C′')].map((k) => r.points.get(k)!)
    expect(p.x).toBeCloseTo((a.x + c2.x) / 2, 9)
    expect(p.y).toBeCloseTo((a.y + c2.y) / 2, 9)
  })

  it('a point a quarter of the way along an edge stays there', () => {
    const c = cube()
    const ab = segment(c, 'A', 'B')
    const p: PointObj = { id: 'P', type: 'point', x: 0, y: 0, label: 'P', color: '#000', dep: { kind: 'onLine', line: 'AB', t: 0.25 } }
    const objects = [...c, ab, p]
    const r = resolve({ objects, view })
    expect(trueLength(objects, r, id(c, 'A'), 'P')! / sideOf(objects)).toBeCloseTo(0.25, 9)
  })
})

describe('lines that only seem to cross', () => {
  it('the diagonals of a face meet for real: neither is broken where they cross', () => {
    const c = cube()
    const objects = [...c, segment(c, 'A', 'C'), segment(c, 'B', 'D')]
    const r = resolve({ objects, view })
    const gaps = solidGaps({ objects, view }, r, 0.1)
    for (const name of ['AC', 'BD']) {
      const l = r.lines.get(name)!
      const half = Math.hypot(l.b.x - l.a.x, l.b.y - l.a.y) / 2
      for (const [from, to] of gaps.get(name) ?? []) expect(from > half || to < half, `${name} broken at its middle`).toBe(true)
    }
  })

  it('a diagonal of the body passes behind or in front of edges, and one of the two is broken', () => {
    const c = turned(30, 25)
    const objects = [...c, segment(c, 'A', 'C′')]
    const gaps = solidGaps({ objects, view }, resolve({ objects, view }), 0.1)
    expect(gaps.size).toBeGreaterThan(0)
  })
})

describe('breaking a line', () => {
  const line: [number, number][] = [[0, 0], [10, 0]]
  it('a gap in the middle leaves two pieces', () => {
    expect(withoutGaps(line, [[4, 6]])).toEqual([[[0, 0], [4, 0]], [[6, 0], [10, 0]]])
  })
  it('a gap at an end leaves one piece', () => {
    expect(withoutGaps(line, [[-1, 2]])).toEqual([[[2, 0], [10, 0]]])
  })
  it('gaps that overlap break it once', () => {
    expect(withoutGaps(line, [[3, 5], [4, 7]])).toEqual([[[0, 0], [3, 0]], [[7, 0], [10, 0]]])
  })
  it('a line with several pieces keeps its corners', () => {
    expect(withoutGaps([[0, 0], [5, 0], [5, 5]], [[1, 2]])).toEqual([[[0, 0], [1, 0]], [[2, 0], [5, 0], [5, 5]]])
  })
})
