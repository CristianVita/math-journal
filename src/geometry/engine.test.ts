// Plane geometry on the board: what goes when something is deleted, and where the letter of a vertex goes.
import { describe, expect, it } from 'vitest'
import { cascade, labelDirection } from './engine'
import { emptyScene, type GObj, type LineObj, type PointObj, type PolygonObj } from './types'

const point = (id: string, x: number, y: number): PointObj => ({ id, type: 'point', x, y, label: id, color: '#000', dep: { kind: 'free' } })
const segment = (id: string, a: string, b: string, extra: Partial<LineObj> = {}): LineObj =>
  ({ id, type: 'segment', dep: { kind: 'twoPoints', a, b }, color: '#000', width: 2, ...extra })
const scene = (objects: GObj[]) => ({ ...emptyScene(), objects })

describe('deleting a polygon', () => {
  const square: PolygonObj = { id: 'P', type: 'polygon', points: ['A', 'B', 'C', 'D'], color: '#000', fill: '', width: 2 }
  const corners = [point('A', 0, 0), point('B', 1, 0), point('C', 1, 1), point('D', 0, 1)]

  // the known problem of November 2026: the segment made from a side stayed on the board
  it('takes the segments made from its sides, and what is built on them', () => {
    const foot: PointObj = { ...point('F', 0, 0), dep: { kind: 'foot', point: 'X', line: 'AB' } }
    const objects = [...corners, square, segment('AB', 'A', 'B', { side: 'P' }), point('X', 0.5, 2), foot]
    const gone = cascade(scene(objects), 'P')
    expect([...gone].sort()).toEqual(['AB', 'F', 'P'])
  })

  it('leaves a segment drawn by hand over a side, and the corners', () => {
    // the Segment tool shows the length
    const objects = [...corners, square, segment('AB', 'A', 'B', { showLength: true })]
    expect([...cascade(scene(objects), 'P')]).toEqual(['P'])
  })

  // segments made from sides before 8 November 2026 do not say which polygon they came from
  it('takes an old side segment too, told apart by how it was made', () => {
    const objects = [...corners, square, segment('AB', 'A', 'B'), segment('BC', 'B', 'C', { showLength: true }), segment('AC', 'A', 'C'), segment('CD', 'C', 'D', { color: '#f00' })]
    expect([...cascade(scene(objects), 'P')].sort()).toEqual(['AB', 'P'])
  })

  it('leaves a segment that was there before the polygon', () => {
    const objects = [...corners, segment('AB', 'A', 'B'), square]
    expect([...cascade(scene(objects), 'P')]).toEqual(['P'])
  })

  it('a side segment can be deleted alone, leaving the polygon', () => {
    const objects = [...corners, square, segment('AB', 'A', 'B', { side: 'P' })]
    expect([...cascade(scene(objects), 'AB')]).toEqual(['AB'])
  })
})

describe('the letter of a vertex', () => {
  const v = { x: 0, y: 0 }
  const turn = (deg: number) => ({ x: Math.cos((deg * Math.PI) / 180), y: Math.sin((deg * Math.PI) / 180) })
  const degreesOf = (d: { x: number; y: number } | null) => ((Math.atan2(d!.y, d!.x) * 180) / Math.PI + 360) % 360

  it('with one angle, goes opposite to the middle of the opening', () => {
    expect(degreesOf(labelDirection(v, [turn(0), turn(60)]))).toBeCloseTo(210, 9)
  })

  it('with a reflex angle drawn the other way, still goes outside the opening of the two sides', () => {
    expect(degreesOf(labelDirection(v, [turn(60), turn(0)]))).toBeCloseTo(210, 9)
  })

  // the known problem of November 2026: with two angles at one vertex, the letter followed the first
  it('with two angles side by side, goes outside both', () => {
    const d = degreesOf(labelDirection(v, [turn(0), turn(60), turn(60), turn(150)]))
    expect(d).toBeCloseTo(255, 9)
  })

  it('with two angles on either side of a line, goes in the widest opening left', () => {
    // 0°–40° and 180°–200°: the free openings are 40°–180° (140°) and 200°–360° (160°)
    expect(degreesOf(labelDirection(v, [turn(0), turn(40), turn(180), turn(200)]))).toBeCloseTo(280, 9)
  })

  it('with an angle of 0°, goes opposite to its side', () => {
    expect(degreesOf(labelDirection(v, [turn(30), turn(30)]))).toBeCloseTo(210, 9)
  })

  it('without sides, has no place of its own', () => {
    expect(labelDirection(v, [v])).toBeNull()
  })
})
