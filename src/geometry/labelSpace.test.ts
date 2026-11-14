// Where the writing goes: never on other writing when there is room, nor on a point or a line.
import { describe, expect, it } from 'vitest'
import { LabelSpace, alongSegment, besidePoint, boxAt, crosses, directionsFrom } from './labelSpace'

describe('placing labels', () => {
  it('a segment through a box, or beside it', () => {
    const box = { x0: 0, y0: 0, x1: 10, y1: 10 }
    expect(crosses({ x: -5, y: 5 }, { x: 15, y: 5 }, box)).toBe(true)
    expect(crosses({ x: -5, y: 12 }, { x: 15, y: 12 }, box)).toBe(false)
    expect(crosses({ x: 2, y: 2 }, { x: 3, y: 3 }, box)).toBe(true)
    expect(crosses({ x: 20, y: -5 }, { x: 25, y: 30 }, box)).toBe(false)
  })

  // the user's picture: the diagonals of a parallelogram cross at their midpoints, where both lengths went
  it('the lengths of two diagonals that cross at their middles go to different places', () => {
    const [A, B, C, D] = [{ x: 140, y: 40 }, { x: 540, y: 40 }, { x: 400, y: 240 }, { x: 0, y: 240 }]
    const space = new LabelSpace([
      { id: 'AC', a: A, b: C }, { id: 'BD', a: B, b: D },
      { id: 'AB', a: A, b: B }, { id: 'BC', a: B, b: C }, { id: 'CD', a: C, b: D }, { id: 'DA', a: D, b: A },
    ], [A, B, C, D].map((p, i) => ({ id: 'ABCD'[i], p })))
    const norm = (p: { x: number; y: number }, q: { x: number; y: number }) => {
      const l = Math.hypot(q.x - p.x, q.y - p.y)
      return { x: -(q.y - p.y) / l, y: (q.x - p.x) / l }
    }
    const one = space.place(alongSegment(A, C, norm(A, C), 14), 30, 11, ['AC'])
    const two = space.place(alongSegment(B, D, norm(D, B), 14), 30, 11, ['BD'])
    const [b1, b2] = [boxAt(one, 30, 11), boxAt(two, 30, 11)]
    const apart = b1.x1 + 3 <= b2.x0 || b2.x1 + 3 <= b1.x0 || b1.y1 + 3 <= b2.y0 || b2.y1 + 3 <= b1.y0
    expect(apart).toBe(true)
    // and neither is on the other diagonal
    expect(crosses(B, D, b1)).toBe(false)
    expect(crosses(A, C, b2)).toBe(false)
  })

  it('the preferred place when it is free, the next one when it is not', () => {
    const space = new LabelSpace([], [])
    const first = space.place([{ x: 50, y: 50 }, { x: 50, y: 80 }], 20, 10)
    expect(first).toEqual({ x: 50, y: 50 })
    const second = space.place([{ x: 52, y: 51 }, { x: 50, y: 80 }], 20, 10)
    expect(second).toEqual({ x: 50, y: 80 })
  })

  it('keeps off points, and off the board only when it must', () => {
    const space = new LabelSpace([], [{ id: 'P', p: { x: 50, y: 50 } }], { x0: 0, y0: 0, x1: 100, y1: 100 })
    expect(space.place([{ x: 50, y: 50 }, { x: 50, y: 70 }], 20, 10)).toEqual({ x: 50, y: 70 })
    expect(space.place([{ x: 120, y: 50 }, { x: 80, y: 20 }], 20, 10)).toEqual({ x: 80, y: 20 })
  })

  it('the letter of a point goes around it, the preferred side first', () => {
    const dirs = directionsFrom({ x: 1, y: -1 })
    expect(dirs[0].x).toBeCloseTo(Math.SQRT1_2)
    expect(dirs).toHaveLength(9)
    const c = besidePoint({ x: 0, y: 0 }, { x: 0, y: -1 }, 10, 12)
    expect(c).toEqual({ x: 0, y: -12 })
  })
})
