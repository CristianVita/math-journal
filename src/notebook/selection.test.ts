import { describe, expect, it } from 'vitest'
import { boxOf, rectOf, shifted, straightEnds, takesBox, takesLine, unionOf } from './selection'

describe('selecting handwriting with a rectangle', () => {
  const r = rectOf([100, 100], [0, 0])

  it('the rectangle is the same whichever way it is dragged', () => {
    expect(r).toEqual({ x0: 0, y0: 0, x1: 100, y1: 100 })
  })

  it('takes a word mostly inside, not a line that only crosses it', () => {
    expect(takesLine(r, [[10, 10], [20, 20], [30, 30], [120, 30]])).toBe(true)
    expect(takesLine(r, [[-50, 50], [-20, 50], [50, 50], [150, 50], [200, 50]])).toBe(false)
    expect(takesLine(r, [])).toBe(false)
  })

  it('takes a text box by its centre', () => {
    expect(takesBox(r, { x0: 80, y0: 10, x1: 110, y1: 30 })).toBe(true)
    expect(takesBox(r, { x0: 90, y0: 10, x1: 150, y1: 30 })).toBe(false)
  })

  it('moves points and keeps the pressure', () => {
    expect(shifted([[1, 2, 0.5]], 10, -1)).toEqual([[11, 1, 0.5]])
  })

  it('boxes around points and around boxes', () => {
    expect(boxOf([[5, 7], [1, 9]])).toEqual({ x0: 1, y0: 7, x1: 5, y1: 9 })
    expect(unionOf([boxOf([[0, 0]]), null, boxOf([[10, 4]])], 2)).toEqual({ x0: -2, y0: -2, x1: 12, y1: 6 })
    expect(unionOf([])).toBeNull()
  })
})

describe('the straight lines of the instruments', () => {
  it('a line along the ruler gives its two ends', () => {
    const line = Array.from({ length: 20 }, (_, i) => [10 + i * 5, 20 + i * 2.5, 0.5])
    expect(straightEnds(line)).toEqual([line[0], line[19]])
  })
  it('a ray of the protractor at 60 degrees', () => {
    const ray = Array.from({ length: 30 }, (_, i) => [400 + i * 5 * Math.cos(Math.PI / 3), 300 - i * 5 * Math.sin(Math.PI / 3)])
    expect(straightEnds(ray)).not.toBeNull()
  })
  it('not a curve, an arc or a dot', () => {
    const arc = Array.from({ length: 20 }, (_, i) => [100 + 36 * Math.cos(i / 10), 100 - 36 * Math.sin(i / 10)])
    expect(straightEnds(arc)).toBeNull()
    expect(straightEnds([[0, 0], [5, 3]])).toBeNull()
    expect(straightEnds([[0, 0]])).toBeNull()
  })
  it('a hand-drawn line that wobbles is not a construction line', () => {
    expect(straightEnds([[0, 0], [50, 4], [100, 0]])).toBeNull()
  })
})
