// Analytic geometry on the board: what the user types, and how equations are written back.
import { describe, expect, it } from 'vitest'
import { resolve } from './engine'
import { emptyScene, type GObj, type PointObj } from './types'
import { circleEquation, explicitForm, generalForm, lengthText, lineThrough, niceLine, numText, parseTyped, signedArea, slope, vectorText } from './analytic'

describe('typed points, lines and circles', () => {
  it('points, with or without a name, with the Romanian decimal comma after ";"', () => {
    expect(parseTyped('A(2, -3)')).toEqual({ kind: 'point', label: 'A', x: 2, y: -3 })
    expect(parseTyped('(1/2, sqrt(4))')).toEqual({ kind: 'point', label: undefined, x: 0.5, y: 2 })
    expect(parseTyped('B(2,5; −1)')).toEqual({ kind: 'point', label: 'B', x: 2.5, y: -1 })
    expect(parseTyped('A(1, 2, 3)').kind).toBe('error')
  })

  it('lines in any form, made whole and without a common factor', () => {
    expect(parseTyped('2x - 3y + 6 = 0')).toEqual({ kind: 'line', co: [2, -3, 6] })
    expect(parseTyped('y = 2x + 1')).toEqual({ kind: 'line', co: [2, -1, 1] })
    expect(parseTyped('y = x/2 - 1')).toEqual({ kind: 'line', co: [1, -2, -2] })
    expect(parseTyped('x = 3')).toEqual({ kind: 'line', co: [1, 0, -3] })
    expect(parseTyped('4x + 6y = 2')).toEqual({ kind: 'line', co: [2, 3, -1] })
    expect(parseTyped('y = 0,5x')).toEqual({ kind: 'line', co: [1, -2, 0] })
  })

  it('circles, with the center and the radius', () => {
    const c = parseTyped('(x - 1)^2 + (y + 2)^2 = 9')
    expect(c).toEqual({ kind: 'circle', c: { x: 1, y: -2 }, r: 3 })
    const d = parseTyped('x² + y² - 4x = 0')
    expect(d.kind === 'circle' && d.c.x).toBeCloseTo(2)
    expect(d.kind === 'circle' && d.r).toBeCloseTo(2)
    expect(parseTyped('x^2 + y^2 = -4').kind).toBe('error')
  })

  it('what it cannot draw gets an explanation, not a wrong figure', () => {
    for (const s of ['x^2 + 2y^2 = 4', 'y = x^2', '3 = 3', 'x + = 2', '', 'x = 1 = 2']) {
      const r = parseTyped(s)
      expect(r.kind, s).toBe('error')
      if (r.kind === 'error') expect(r.message.length, s).toBeGreaterThan(5)
    }
  })
})

describe('vectors built on the board', () => {
  // the board makes the tip of a sum, a multiple or a moved vector as a weighted sum of points (`combo`)
  const pt = (id: string, x: number, y: number, dep: PointObj['dep'] = { kind: 'free' }): PointObj => ({ id, type: 'point', x, y, label: id, color: '#000', dep })
  const at = (objects: GObj[], id: string) => resolve({ objects, view: emptyScene().view }).points.get(id)
  const base = [pt('A', 1, 1), pt('B', 4, 3), pt('C', -2, 0), pt('D', 0, -5), pt('P', 7, 7)]

  it('AB + CD and AB − CD, from A, by the triangle rule', () => {
    expect(at([...base, pt('S', 0, 0, { kind: 'combo', parts: [['B', 1], ['D', 1], ['C', -1]] })], 'S')).toEqual({ x: 6, y: -2 })
    expect(at([...base, pt('S', 0, 0, { kind: 'combo', parts: [['B', 1], ['D', -1], ['C', 1]] })], 'S')).toEqual({ x: 2, y: 8 })
  })

  it('k·AB from A, and AB moved to P', () => {
    const k = -1.5
    expect(at([...base, pt('S', 0, 0, { kind: 'combo', parts: [['A', 1 - k], ['B', k]] })], 'S')).toEqual({ x: 1 + k * 3, y: 1 + k * 2 })
    expect(at([...base, pt('S', 0, 0, { kind: 'combo', parts: [['P', 1], ['B', 1], ['A', -1]] })], 'S')).toEqual({ x: 10, y: 9 })
  })

  it('the centroid of a triangle', () => {
    const g = at([...base, pt('G', 0, 0, { kind: 'combo', parts: [['A', 1 / 3], ['B', 1 / 3], ['C', 1 / 3]] })], 'G')!
    expect(g.x).toBeCloseTo(1)
    expect(g.y).toBeCloseTo(4 / 3)
  })
})

describe('equations written as in a textbook', () => {
  it('the line through two points', () => {
    expect(generalForm(lineThrough({ x: 0, y: 2 }, { x: 3, y: 4 }))).toBe('2x − 3y + 6 = 0')
    expect(generalForm(lineThrough({ x: 1, y: 1 }, { x: 1, y: 5 }))).toBe('x − 1 = 0')
    expect(generalForm(lineThrough({ x: 0, y: 0 }, { x: 2, y: 2 }))).toBe('x − y = 0')
    expect(generalForm(lineThrough({ x: 0.5, y: 0 }, { x: 0, y: 1.5 }))).toBe('6x + 2y − 3 = 0')
  })

  it('the explicit form and the slope', () => {
    expect(explicitForm([2, -3, 6])).toBe('y = 2/3·x + 2')
    expect(explicitForm([2, -1, 1])).toBe('y = 2x + 1')
    expect(explicitForm([1, 0, -3])).toBe('x = 3')
    expect(slope([2, -3, 6])).toBeCloseTo(2 / 3)
    expect(slope([1, 0, -3])).toBeNull()
  })

  it('circles, vectors, lengths, numbers', () => {
    expect(circleEquation({ x: 1, y: -2 }, 3)).toBe('(x − 1)² + (y + 2)² = 9')
    expect(circleEquation({ x: 0, y: 0 }, Math.sqrt(5))).toBe('x² + y² = 5')
    expect(vectorText({ x: 3, y: -2 })).toBe('3i − 2j')
    expect(vectorText({ x: 0, y: 1 })).toBe('j')
    expect(vectorText({ x: -1, y: 0 })).toBe('−i')
    expect(lengthText(Math.sqrt(13))).toBe('√13')
    expect(lengthText(Math.sqrt(12))).toBe('2√3')
    expect(lengthText(5)).toBe('5')
    expect(numText(-0.5)).toBe('−1/2')
    expect(numText(Math.PI)).toBe('3.14')
    expect(niceLine(0.1, 0.2, 0.3)).toEqual([1, 2, 3])
    // a common irrational factor, as from two points √13 apart
    const k = Math.sqrt(13) / 7
    expect(niceLine(2 * k, -3 * k, 6 * k)).toEqual([2, -3, 6])
  })

  it('the area from the coordinates', () => {
    expect(signedArea([{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }])).toBe(6)
    expect(signedArea([{ x: 0, y: 0 }, { x: 0, y: 3 }, { x: 4, y: 0 }])).toBe(-6)
  })
})
