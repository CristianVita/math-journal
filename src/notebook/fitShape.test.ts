import { describe, expect, it } from 'vitest'
import { fitCorners, measureShape, SHAPE_FIELDS, solveShape } from './fitShape'
import type { ShapeId } from './shapes'

const DATA: [ShapeId, number[]][] = [
  ['triangle', [5, 4, 3]],
  ['right', [6, 8]],
  ['rectangle', [12, 5]],
  ['parallelogram', [10, 6, 60]],
  ['rhombus', [8, 6]],
  ['kite', [10, 6]],
  ['trapezoid', [6, 14, 4]],
  ['rightTrapezoid', [7, 4, 3]],
  ['trapezoidAny', [5, 12, 6, 8]],
]

describe('a notebook figure fitted to the data', () => {
  it.each(DATA)('%s keeps the lengths it was given, in proportion', (shape, v) => {
    const c = solveShape(shape, v)
    expect(typeof c).not.toBe('string')
    const pts = c as number[][]
    // put where a figure of another size was drawn: the proportions stay
    const old = pts.map(([x, y]) => [300 + 37 * x, 200 + 37 * y])
    const fitted = fitCorners(pts, old)
    const got = measureShape(shape, fitted, 37)
    got.forEach((g, i) => expect(g, `${shape}: ${JSON.stringify(SHAPE_FIELDS[shape]![i])}`).toBeCloseTo(v[i], 0))
  })

  it('keeps each letter near its place when the figure was drawn mirrored', () => {
    const c = solveShape('rightTrapezoid', [7, 4, 3]) as number[][]
    const old = c.map(([x, y]) => [500 - 40 * x, 100 + 40 * y])
    const fitted = fitCorners(c, old)
    fitted.forEach((p, i) => expect(Math.hypot(p[0] - old[i][0], p[1] - old[i][1])).toBeLessThan(1))
  })

  it('the trapezoid stays parallel and where it was', () => {
    const old = [[130, 100], [260, 100], [400, 300], [100, 300]]
    const fitted = fitCorners(solveShape('trapezoidAny', [10, 20, 8, 9]) as number[][], old)
    expect(fitted[0][1]).toBeCloseTo(fitted[1][1])
    expect(fitted[2][1]).toBeCloseTo(fitted[3][1])
    expect(fitted[0][1]).toBeLessThan(fitted[3][1])
  })

  it('says why impossible data make no figure', () => {
    expect(solveShape('triangle', [1, 2, 5])).toMatch(/triunghi/)
    expect(solveShape('trapezoidAny', [5, 12, 2, 2])).toMatch(/trapez/)
    expect(solveShape('trapezoid', [5, 5, 3])).toMatch(/diferite/)
    expect(solveShape('rectangle', [0, 3])).toMatch(/pozitive/)
  })
})
