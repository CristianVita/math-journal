import { describe, expect, it } from 'vitest'
import { writeFileSync } from 'fs'
import { GENERATORS, type Level } from './generators'
import { seeded } from './tex'
import { drawFigure, statementFigure } from './figures'
import { figureSvg, namesUsed } from '../models/figure'
import { sectionRatio } from './geometry8b'
import { cubeFaceCenter, cylinderAxialDiagonals, rightTrapezoidPerp, trapezoidProjections, trapezoidTriangleSpace } from './geometry8e'
import { coneFrustumPerpDiag, frustumProportional, squarePrismRhombus, squarePrismSine, triPyrCutMin } from './geometry8f'

const geometry = GENERATORS.filter((g) => g.topic === 'Geometrie')

describe('figures of the generated geometry', () => {
  const misses: string[] = []
  let forms = 0, drawn = 0

  for (const g of geometry) {
    it(`${g.id}: every figure is whole, inside its size, and drawn`, () => {
      for (const level of [1, 2, 3] as Level[]) {
        for (let f = 0; f < g.forms(level); f++) {
          let got = 0
          for (let s = 1; s <= 4; s++) {
            const made = g.make(seeded(s * 7919 + f), level, f)
            const { text } = made
            const figures = [statementFigure(made), made.solutionFig].filter((fig) => fig != null)
            if (figures.length) got++
            for (const fig of figures) {
              for (const view of fig.detail ? [fig, fig.detail] : [fig]) {
                for (const n of namesUsed(view)) expect(view.p[n], `${g.id} ${level}/${f}: ${n} — ${text}`).toBeDefined()
                for (const [n, [x, y]] of Object.entries(view.p)) {
                  expect(Number.isFinite(x) && Number.isFinite(y), `${g.id} ${level}/${f}: ${n} — ${text}`).toBe(true)
                  expect(x, `${g.id} ${level}/${f}: ${n}`).toBeGreaterThanOrEqual(-0.5)
                  expect(x, `${g.id} ${level}/${f}: ${n}`).toBeLessThanOrEqual(view.w + 0.5)
                  expect(y, `${g.id} ${level}/${f}: ${n}`).toBeGreaterThanOrEqual(-0.5)
                  expect(y, `${g.id} ${level}/${f}: ${n}`).toBeLessThanOrEqual(view.h + 0.5)
                }
              }
              expect(figureSvg(fig)).toMatch(/^<svg/)
            }
          }
          // the share is counted from grade VII up: grades V–VI have points on a line, angles and parallel lines,
          // which the reader does not draw (14 November 2026)
          if (g.grade < 7) continue
          forms++
          if (got) drawn++
          else misses.push(`${g.id} ${level}/${f}: ${g.make(seeded(7919 + f), level, f).text}`)
        }
      }
    })
  }

  it('most forms of grades VII and up get a figure', () => {
    if (process.env.FIG_MISSES) writeFileSync(process.env.FIG_MISSES, misses.join('\n'))
    expect(drawn / forms, misses.join('\n')).toBeGreaterThan(0.8)
  })
})

describe('figures for the grade VIII workbook', () => {
  it('draws the short base of the right trapezoid and raises E above A', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const { p, s } = trapezoidTriangleSpace(seeded(seed)).solutionFig!
      expect(p.E[0]).toBeCloseTo(p.A[0])
      expect(p.E[1]).toBeLessThan(p.A[1])
      expect(p.B[0] - p.A[0]).toBeLessThan(p.C[0] - p.D[0])
      expect(s).toContain('A-E-B')
    }
  })

  it('projects B and C vertically onto E and F and draws both trapezoids', () => {
    const made = trapezoidProjections(seeded(25))
    expect(statementFigure(made)).toBeUndefined()
    const { p, s, d } = made.solutionFig!
    expect(p.B[0]).toBeCloseTo(p.E[0])
    expect(p.C[0]).toBeCloseTo(p.F[0])
    expect(p.B[1]).toBeLessThan(p.E[1])
    expect(p.C[1]).toBeLessThan(p.F[1])
    expect(s).toContain('A-E-F-D')
    expect(d).toBe('B-E C-F')
  })

  it('shows E inside BC, on its extension or at B as appropriate', () => {
    const made = rightTrapezoidPerp(seeded(186))
    expect(statementFigure(made)).toBeUndefined()
    const inside = made.solutionFig!
    expect(inside.p.E[1]).toBeGreaterThan(inside.p.B[1])
    expect(inside.p.E[1]).toBeLessThan(inside.p.C[1])
    const outside = rightTrapezoidPerp(seeded(27)).solutionFig!
    expect(outside.p.E[1]).toBeLessThan(outside.p.B[1])
    expect(outside.d).toContain('B-E')
    const atB = rightTrapezoidPerp(seeded(1)).solutionFig!
    expect(atB.p.E).toEqual(atB.p.B)
    expect(figureSvg(atB)).toContain('>B = E</text>')
  })

  it('keeps labelled points on their own edges, sections and diagonals', () => {
    const between = (fig: NonNullable<ReturnType<typeof drawFigure>>, name: string, a: string, b: string, t: number) => {
      for (const axis of [0, 1]) expect(fig.p[name][axis]).toBeCloseTo(fig.p[a][axis] * (1 - t) + fig.p[b][axis] * t)
    }
    for (let seed = 1; seed <= 25; seed++) {
      const cube = cubeFaceCenter(seeded(seed)).fig!
      between(cube, 'Q', "B'", 'C', 0.5)
      between(cube, 'Q', 'B', "C'", 0.5)
      const prism = squarePrismRhombus(seeded(seed)).solutionFig!
      between(prism, 'M', 'B', "B'", 0.5)
      between(prism, 'N', 'D', "D'", 0.5)
      expect(prism.h).toBeLessThanOrEqual(195)
      const base = squarePrismSine(seeded(seed))
      expect(statementFigure(base)?.detail).toBeUndefined()
      expect(Object.keys(base.solutionFig!.detail!.p)).toEqual(expect.arrayContaining(['M', 'N', 'P', 'Q', 'R']))
      const section = sectionRatio(seeded(seed)).solutionFig!
      const t = (section.p.E[1] - section.p.V[1]) / (section.p.B[1] - section.p.V[1])
      expect(t).toBeGreaterThan(0)
      expect(t).toBeLessThan(1)
      between(section, 'E', 'V', 'B', t)
      between(section, 'F', 'V', 'A', t)
      between(section, 'G', 'V', 'C', t)
    }
  })

  it('renders the pyramid section beside the full solid', () => {
    const pyramid = triPyrCutMin(seeded(17)).solutionFig!
    expect(pyramid.p.N).toBeUndefined()
    expect(pyramid.detail?.ra).toContain('MNB')
    expect(figureSvg(pyramid)).toMatch(/<g transform="translate\([1-9]\d+ [^"]+\)">[\s\S]*>N<\/text>/)
  })

  it('uses M for the crossing of the cylinder diagonals and draws the right angle on the frustum', () => {
    const cylinder = cylinderAxialDiagonals(seeded(7))
    const { p } = cylinder.solutionFig!
    expect(cylinder.solution).toContain('punctul $M$')
    expect(p.M[1]).toBeCloseTo((p.A[1] + p["B'"][1]) / 2)
    expect(p.O[1]).toBeCloseTo(p.A[1])
    const frustum = coneFrustumPerpDiag(seeded(7)).solutionFig!
    const [a, b, corner] = [frustum.p.A, frustum.p.B, frustum.p["B'"]]
    expect((a[0] - corner[0]) * (b[0] - corner[0]) + (a[1] - corner[1]) * (b[1] - corner[1])).toBeCloseTo(0)
    expect(frustum.ra).toContain("AB'B")
    expect(frustum.d).toContain("A-B'")
    const joined = frustumProportional(seeded(7)).solutionFig!
    expect(joined.p.M[0]).toBeCloseTo(joined.p.O[0])
    expect(joined.p.M[1]).toBeGreaterThan(joined.p["O'"][1])
    expect(joined.p.M[1]).toBeLessThan(joined.p.O[1])
  })

  it('reads lengths inside perpendicular formulas and keeps the labels of named axial sections', () => {
    const raised = drawFigure('Pe planul pătratului $ABCD$, cu $AB = 27$ cm, se ridică perpendiculara $AP = 36$ cm.')!
    expect(raised.p.P[0]).toBeCloseTo(raised.p.A[0])
    expect(raised.p.P[1]).toBeLessThan(raised.p.A[1])
    const frustum = drawFigure('Un trunchi de con are diametrele $AB = 8$ cm și $CD = 4$ cm. Calculați aria trapezului $ACDB$.')!
    expect(frustum.s).toContain('A-C B-D')
  })
})
