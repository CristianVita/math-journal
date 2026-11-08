// The notebook's eraser takes away only what it passes over.
import { describe, expect, it } from 'vitest'
import { eraseLine } from './erase'

const line = (x0: number, x1: number, y = 0): number[][] => [[x0, y, 0.5], [x1, y, 0.5]]

describe('the eraser', () => {
  it('leaves alone a line it does not reach', () => {
    expect(eraseLine(line(0, 100), 2, [50, 30], [60, 30], 8)).toBeNull()
  })

  // a straight line has only its two ends: it must be cut where it was crossed, not kept or lost whole
  it('cuts a straight line in two where it crosses it', () => {
    const pieces = eraseLine(line(0, 100), 2, [50, -20], [50, 20], 8)!
    expect(pieces).toHaveLength(2)
    const [left, right] = pieces
    expect(left[0][0]).toBe(0)
    expect(right[right.length - 1][0]).toBe(100)
    // the gap is about the eraser, plus half the line's width, on each side of x = 50
    expect(left[left.length - 1][0]).toBeGreaterThan(38)
    expect(left[left.length - 1][0]).toBeLessThan(42)
    expect(right[0][0]).toBeGreaterThan(58)
    expect(right[0][0]).toBeLessThan(62)
  })

  it('takes a line away whole when it passes over all of it', () => {
    expect(eraseLine(line(0, 10), 2, [-5, 0], [15, 0], 8)).toEqual([])
  })

  it('shortens a line from its end', () => {
    const pieces = eraseLine(line(0, 100), 2, [100, 0], [100, 0], 8)!
    expect(pieces).toHaveLength(1)
    expect(pieces[0][0][0]).toBe(0)
    expect(pieces[0][pieces[0].length - 1][0]).toBeLessThan(92)
  })

  it('erases along the whole way from the last place, however fast it moved', () => {
    // the eraser jumped from above the line to below it in one step
    const pieces = eraseLine(line(0, 100), 2, [20, -50], [80, 50], 5)!
    expect(pieces).toHaveLength(2)
  })

  it('keeps the points of the line far from the eraser as they were', () => {
    const curve = [[0, 0, 0.3], [10, 5, 0.4], [20, 0, 0.5], [200, 0, 0.6], [210, 5, 0.7]]
    const pieces = eraseLine(curve, 2, [100, -20], [100, 20], 5)!
    expect(pieces[0].slice(0, 3)).toEqual(curve.slice(0, 3))
    expect(pieces[1].slice(-2)).toEqual(curve.slice(-2))
  })

  it('takes away a dot it touches', () => {
    expect(eraseLine([[5, 5, 0.5]], 2, [5, 5], [5, 5], 8)).toEqual([])
  })
})
