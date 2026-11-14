// The formulas of the "Formule și tabel" page: valid for KaTeX, and true, checked in numbers for many values.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { IDENTITIES } from './formulas'

const tex = (line: string) => (line.includes('$') ? [...line.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]) : [line])

describe('the formulas page', () => {
  it('every formula is valid LaTeX for KaTeX, without Romanian letters inside \\text{}', () => {
    for (const [title, lines] of IDENTITIES) {
      for (const line of lines) {
        for (const f of tex(line)) {
          expect(() => katex.renderToString(f, { throwOnError: true, strict: 'ignore' }), `${title}: ${f}`).not.toThrow()
          expect(f, title).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
        }
        // a text line has its formulas closed
        if (line.includes('$')) expect((line.match(/\$/g) ?? []).length % 2, `${title}: ${line}`).toBe(0)
      }
    }
  })

  it('has every group the user may look for', () => {
    const titles = IDENTITIES.map(([t]) => t)
    for (const t of ['Fundamentale', 'Reducere la primul cadran', 'Sume și diferențe', 'Unghiul dublu', 'Unghiul pe jumătate',
      'Transformarea sumelor în produse', 'Transformarea produselor în sume', 'Funcțiile trigonometrice inverse',
      'Ecuații trigonometrice', 'Inecuații trigonometrice', 'Triunghi', 'Derivate', 'Primitive']) expect(titles).toContain(t)
    expect(new Set(titles).size).toBe(titles.length)
  })
})

// the identities added on 12 November 2026, each as a function that must be 0 for any value
const { sin, cos, tan, asin, acos, atan, sqrt, PI } = Math
const cot = (x: number) => 1 / tan(x)
const acot = (x: number) => PI / 2 - atan(x)
const IDS: [string, (a: number, b: number, c: number) => number][] = [
  ['ctg(a+b)', (a, b) => cot(a + b) - (cot(a) * cot(b) - 1) / (cot(b) + cot(a))],
  ['ctg(a-b)', (a, b) => cot(a - b) - (cot(a) * cot(b) + 1) / (cot(b) - cot(a))],
  ['sin(a+b)sin(a-b)', (a, b) => sin(a + b) * sin(a - b) - (sin(a) ** 2 - sin(b) ** 2)],
  ['cos(a+b)cos(a-b)', (a, b) => cos(a + b) * cos(a - b) - (cos(a) ** 2 - sin(b) ** 2)],
  ['sin(a+b+c)', (a, b, c) => sin(a + b + c) - (sin(a) * cos(b) * cos(c) + cos(a) * sin(b) * cos(c) + cos(a) * cos(b) * sin(c) - sin(a) * sin(b) * sin(c))],
  ['cos(a+b+c)', (a, b, c) => cos(a + b + c) - (cos(a) * cos(b) * cos(c) - sin(a) * sin(b) * cos(c) - sin(a) * cos(b) * sin(c) - cos(a) * sin(b) * sin(c))],
  ['tg(a+b+c)', (a, b, c) => tan(a + b + c) - (tan(a) + tan(b) + tan(c) - tan(a) * tan(b) * tan(c)) / (1 - tan(a) * tan(b) - tan(b) * tan(c) - tan(c) * tan(a))],
  ['sin 2x by tg', (x) => sin(2 * x) - (2 * tan(x)) / (1 + tan(x) ** 2)],
  ['cos 2x by tg', (x) => cos(2 * x) - (1 - tan(x) ** 2) / (1 + tan(x) ** 2)],
  ['ctg 2x', (x) => cot(2 * x) - (cot(x) ** 2 - 1) / (2 * cot(x))],
  ['tg x/2 = sin/(1+cos)', (x) => tan(x / 2) - sin(x) / (1 + cos(x))],
  ['tg x/2 = (1-cos)/sin', (x) => tan(x / 2) - (1 - cos(x)) / sin(x)],
  ['tg² x/2', (x) => tan(x / 2) ** 2 - (1 - cos(x)) / (1 + cos(x))],
  ['sin 3x', (x) => sin(3 * x) - (3 * sin(x) - 4 * sin(x) ** 3)],
  ['cos 3x', (x) => cos(3 * x) - (4 * cos(x) ** 3 - 3 * cos(x))],
  ['tg 3x', (x) => tan(3 * x) - (3 * tan(x) - tan(x) ** 3) / (1 - 3 * tan(x) ** 2)],
  ['universal sin', (x) => sin(x) - (2 * tan(x / 2)) / (1 + tan(x / 2) ** 2)],
  ['universal cos', (x) => cos(x) - (1 - tan(x / 2) ** 2) / (1 + tan(x / 2) ** 2)],
  ['universal tg', (x) => tan(x) - (2 * tan(x / 2)) / (1 - tan(x / 2) ** 2)],
  ['sin³', (x) => sin(x) ** 3 - (3 * sin(x) - sin(3 * x)) / 4],
  ['cos³', (x) => cos(x) ** 3 - (3 * cos(x) + cos(3 * x)) / 4],
  ['sin² by cos 2x', (x) => sin(x) ** 2 - (1 - cos(2 * x)) / 2],
  ['tg a + tg b', (a, b) => tan(a) + tan(b) - sin(a + b) / (cos(a) * cos(b))],
  ['tg a - tg b', (a, b) => tan(a) - tan(b) - sin(a - b) / (cos(a) * cos(b))],
  ['ctg a + ctg b', (a, b) => cot(a) + cot(b) - sin(b + a) / (sin(a) * sin(b))],
  ['ctg a - ctg b', (a, b) => cot(a) - cot(b) - sin(b - a) / (sin(a) * sin(b))],
  ['sin x + cos x', (x) => sin(x) + cos(x) - sqrt(2) * sin(x + PI / 4)],
  ['sin x - cos x', (x) => sin(x) - cos(x) - sqrt(2) * sin(x - PI / 4)],
  ['1 + sin x', (x) => 1 + sin(x) - 2 * cos(PI / 4 - x / 2) ** 2],
  ['1 - sin x', (x) => 1 - sin(x) - 2 * sin(PI / 4 - x / 2) ** 2],
  ['sin a cos b', (a, b) => sin(a) * cos(b) - (sin(a + b) + sin(a - b)) / 2],
  ['cos a cos b', (a, b) => cos(a) * cos(b) - (cos(a + b) + cos(a - b)) / 2],
  ['sin a sin b', (a, b) => sin(a) * sin(b) - (cos(a - b) - cos(a + b)) / 2],
  ['tg(π/2 + x)', (x) => tan(PI / 2 + x) + cot(x)],
  ['sin(3π/2 − x)', (x) => sin((3 * PI) / 2 - x) + cos(x)],
  ['cos(3π/2 − x)', (x) => cos((3 * PI) / 2 - x) + sin(x)],
  ['sin(3π/2 + x)', (x) => sin((3 * PI) / 2 + x) + cos(x)],
  ['cos(3π/2 + x)', (x) => cos((3 * PI) / 2 + x) - sin(x)],
  ['sin² from tg', (x) => sin(x) ** 2 - tan(x) ** 2 / (1 + tan(x) ** 2)],
  ['1 + ctg²', (x) => 1 + cot(x) ** 2 - 1 / sin(x) ** 2],
]

// the inverse functions, for u in (−1, 1) and any t
const INVERSE: [string, (u: number, t: number) => number][] = [
  ['cos(arcsin u)', (u) => cos(asin(u)) - sqrt(1 - u * u)],
  ['tg(arcsin u)', (u) => tan(asin(u)) - u / sqrt(1 - u * u)],
  ['sin(arccos u)', (u) => sin(acos(u)) - sqrt(1 - u * u)],
  ['sin(arctg t)', (_, t) => sin(atan(t)) - t / sqrt(1 + t * t)],
  ['cos(arctg t)', (_, t) => cos(atan(t)) - 1 / sqrt(1 + t * t)],
  ['arccos(−u)', (u) => acos(-u) - (PI - acos(u))],
  ['arcctg(−t)', (_, t) => acot(-t) - (PI - acot(t))],
  ['arcsin + arccos', (u) => asin(u) + acos(u) - PI / 2],
  ['arctg t + arctg 1/t', (_, t) => atan(t) + atan(1 / t) - Math.sign(t) * PI / 2],
]

// the triangle, for many triangles: angles A, B, C and sides a, b, c with R = 1
const TRIANGLE: [string, (A: number, B: number, C: number, a: number, b: number, c: number) => number][] = [
  ['sin A + sin B + sin C', (A, B, C) => sin(A) + sin(B) + sin(C) - 4 * cos(A / 2) * cos(B / 2) * cos(C / 2)],
  ['cos A + cos B + cos C', (A, B, C) => cos(A) + cos(B) + cos(C) - (1 + 4 * sin(A / 2) * sin(B / 2) * sin(C / 2))],
  ['tg sum = tg product', (A, B, C) => tan(A) + tan(B) + tan(C) - tan(A) * tan(B) * tan(C)],
  ['sin² sum', (A, B, C) => sin(A) ** 2 + sin(B) ** 2 + sin(C) ** 2 - (2 + 2 * cos(A) * cos(B) * cos(C))],
  ['cos² sum', (A, B, C) => cos(A) ** 2 + cos(B) ** 2 + cos(C) ** 2 - (1 - 2 * cos(A) * cos(B) * cos(C))],
  ['projections', (_A, B, C, a, b, c) => a - (b * cos(C) + c * cos(B))],
  ['law of tangents', (A, B, _C, a, b) => (a - b) / (a + b) - tan((A - B) / 2) / tan((A + B) / 2)],
  ['sin A/2', (A, _B, _C, a, b, c) => { const p = (a + b + c) / 2; return sin(A / 2) - sqrt(((p - b) * (p - c)) / (b * c)) }],
  ['cos A/2', (A, _B, _C, a, b, c) => { const p = (a + b + c) / 2; return cos(A / 2) - sqrt((p * (p - a)) / (b * c)) }],
  ['tg A/2', (A, _B, _C, a, b, c) => { const p = (a + b + c) / 2; return tan(A / 2) - sqrt(((p - b) * (p - c)) / (p * (p - a))) }],
  ['area = 2R² sin sin sin', (A, B, C, a, b, c) => { const p = (a + b + c) / 2; return sqrt(p * (p - a) * (p - b) * (p - c)) - 2 * sin(A) * sin(B) * sin(C) }],
  ['r = 4R sin sin sin', (A, B, C, a, b, c) => { const p = (a + b + c) / 2; const S = sqrt(p * (p - a) * (p - b) * (p - c)); return S / p - 4 * sin(A / 2) * sin(B / 2) * sin(C / 2) }],
  ['r = (p − a) tg A/2', (A, _B, _C, a, b, c) => { const p = (a + b + c) / 2; const S = sqrt(p * (p - a) * (p - b) * (p - c)); return S / p - (p - a) * tan(A / 2) }],
  ['1 + r/R', (A, B, C, a, b, c) => { const p = (a + b + c) / 2; const S = sqrt(p * (p - a) * (p - b) * (p - c)); return cos(A) + cos(B) + cos(C) - (1 + S / p) }],
]

describe('the identities are true', () => {
  const values = Array.from({ length: 60 }, (_, i) => 0.137 + i * 0.211)
  it.each(IDS.map(([n, f]) => [n, f] as const))('%s', (_, f) => {
    for (let i = 0; i < values.length; i++) {
      const [a, b, c] = [values[i], values[(i * 7 + 3) % values.length] * 0.9, values[(i * 13 + 5) % values.length] * 1.1]
      const v = f(a, b, c)
      // near a pole (tg of π/2, ctg of 0) the value is huge or not a number: those points are skipped
      if (!Number.isFinite(v) || [a, b, c, a / 2, a + b, a - b, a + b + c, 2 * a, 3 * a].some((x) => Math.abs(Math.cos(x)) < 0.05 || Math.abs(Math.sin(x)) < 0.05)) continue
      expect(Math.abs(v), `a=${a} b=${b} c=${c}`).toBeLessThan(1e-7)
    }
  })

  it.each(INVERSE.map(([n, f]) => [n, f] as const))('%s', (_, f) => {
    for (let i = 1; i < 40; i++) {
      const u = -0.97 + i * 0.049
      // never 0: the formula with 1/t is written for t ≠ 0
      const t = -9.7 + i * 0.5
      expect(Math.abs(f(u, t)), `u=${u} t=${t}`).toBeLessThan(1e-9)
    }
  })

  it.each(TRIANGLE.map(([n, f]) => [n, f] as const))('%s', (_, f) => {
    for (let i = 1; i < 30; i++) {
      const A = 0.2 + i * 0.05
      const B = 0.15 + ((i * 7) % 29) * 0.06
      const C = PI - A - B
      if (C <= 0.05 || [A, B, C].some((x) => Math.abs(x - PI / 2) < 1e-3)) continue
      // with R = 1: a = 2 sin A
      expect(Math.abs(f(A, B, C, 2 * sin(A), 2 * sin(B), 2 * sin(C))), `A=${A} B=${B}`).toBeLessThan(1e-9)
    }
  })

  it('the other remarkable values', () => {
    const d = (x: number) => (x * PI) / 180
    const pairs: [number, number][] = [
      [sin(d(15)), (sqrt(6) - sqrt(2)) / 4], [cos(d(15)), (sqrt(6) + sqrt(2)) / 4], [tan(d(15)), 2 - sqrt(3)], [tan(d(75)), 2 + sqrt(3)],
      [sin(d(22.5)), sqrt(2 - sqrt(2)) / 2], [cos(d(22.5)), sqrt(2 + sqrt(2)) / 2], [tan(d(22.5)), sqrt(2) - 1], [tan(d(67.5)), sqrt(2) + 1],
      [sin(d(18)), (sqrt(5) - 1) / 4], [cos(d(18)), sqrt(10 + 2 * sqrt(5)) / 4], [cos(d(36)), (sqrt(5) + 1) / 4], [sin(d(36)), sqrt(10 - 2 * sqrt(5)) / 4],
    ]
    for (const [x, y] of pairs) expect(x).toBeCloseTo(y, 12)
    // 1 rad ≈ 57°17′45″
    expect(180 / PI).toBeCloseTo(57 + 17 / 60 + 45 / 3600, 3)
  })
})
