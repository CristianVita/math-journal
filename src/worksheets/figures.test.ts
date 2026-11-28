import { describe, expect, it } from 'vitest'
import { writeFileSync } from 'fs'
import { GENERATORS, type Level } from './generators'
import { seeded } from './tex'
import { drawFigure, statementFigure } from './figures'
import { figureSvg, foot, namesUsed, type Pt } from '../models/figure'
import { sectionRatio } from './geometry8b'
import { similarArea } from './forms'
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

describe('parallel segments in a triangle', () => {
  it('draws the Thales segment parallel to the base when only AD and AB are given', () => {
    const variants = Array.from({ length: 25 }, (_, i) => {
      const { text } = similarArea(seeded(i + 1))
      const [, ad, ab] = text.match(/AD = (\d+).*AB = (\d+)/)!
      return { text, ratio: Number(ad) / Number(ab) }
    })
    variants.push({
      text: String.raw`În triunghiul $ABC$, $D\in BA$ și $E\in [AC]$, cu $BC\parallel ED$, $EC = 18$ cm și $AC = 24$ cm.`,
      ratio: 0.25,
    })
    for (const { text, ratio } of variants) {
      const { p: { A, B, C, D, E }, s } = drawFigure(text)!
      const left = (D[1] - A[1]) / (B[1] - A[1])
      const right = (E[1] - A[1]) / (C[1] - A[1])
      expect(left).toBeCloseTo(ratio)
      expect(left).toBeCloseTo(right)
      expect(D[0]).toBeCloseTo(A[0] + left * (B[0] - A[0]))
      expect(E[0]).toBeCloseTo(A[0] + right * (C[0] - A[0]))
      expect(s).toMatch(/D-E|E-D/)
    }
  })
})

describe('measurements in inferred figures', () => {
  const degrees = ([ax, ay]: Pt, [bx, by]: Pt, [cx, cy]: Pt) => {
    const u = [ax - bx, ay - by], v = [cx - bx, cy - by]
    return Math.atan2(Math.abs(u[0] * v[1] - u[1] * v[0]), u[0] * v[0] + u[1] * v[1]) * 180 / Math.PI
  }

  it.each([
    [String.raw`În triunghiul $ABC$ dreptunghic în $A$, $\angle B = 63^\circ$ și $BC = 20$ cm.`, 'ABC', 63],
    [String.raw`În triunghiul $ABC$, $\angle A = 42^\circ$ și $\angle B = 104^\circ$.`, 'BAC', 42],
    [String.raw`În triunghiul isoscel $ABC$, $AB = AC$ și $\angle A = 120^\circ$.`, 'BAC', 120],
    [String.raw`Dreptunghiul $ABCD$ are centrul $O$ și $\angle AOB = 48^\circ$.`, 'AOB', 48],
    [String.raw`În rombul $ABCD$, $\angle BAC = 24^\circ$.`, 'BAC', 24],
    [String.raw`Punctele $A$ și $B$ sunt pe cercul de centru $O$, iar $\angle AOB = 50^\circ$.`, 'AOB', 50],
    [String.raw`Din punctul $P$, exterior cercului de centru $O$ și rază 8 cm, se duc tangentele $PA$ și $PB$. $\angle APB = 120^\circ$.`, 'APB', 120],
    [String.raw`Pe un cerc de centru $O$, arcul mic $AB$ are măsura de $50^\circ$, iar $C$ se află pe arcul mare $AB$.`, 'ACB', 25],
  ])('draws the prescribed angle for %s', (text, name, expected) => {
    const { p } = drawFigure(text)!
    expect(degrees(p[name[0]], p[name[1]], p[name[2]])).toBeCloseTo(expected)
  })

  it('draws the exterior angle using an extension of the side', () => {
    const { p, ang } = drawFigure(String.raw`În triunghiul $ABC$, $\angle A = 52^\circ$ și $\angle B = 37^\circ$. Aflați măsura unghiului exterior din vârful $C$.`)!
    expect(ang).toEqual(['ACx'])
    expect(degrees(p.B, p.C, p.x)).toBeCloseTo(180)
    expect(degrees(p.A, p.C, p.x)).toBeCloseTo(89)
  })

  it('shows both arms of the angle at the centre of a rectangle', () => {
    const { s } = drawFigure(String.raw`Dreptunghiul $ABCD$ are centrul $O$ și $\angle AOB = 48^\circ$.`)!
    expect(s?.split(' ')).toEqual(expect.arrayContaining(['A-O', 'O-B']))
  })

  it('uses the leg and its projection to place the altitude foot', () => {
    const { p } = drawFigure(String.raw`În triunghiul $ABC$, dreptunghic în $A$, $AD \perp BC$, $D \in BC$, $AB = 135$ cm și $BD = 75$ cm.`)!
    expect((p.D[0] - p.B[0]) / (p.C[0] - p.B[0])).toBeCloseTo(75 ** 2 / 135 ** 2)
  })

  it('draws the axial circle tangent to the sides of the circumscribed frustum', () => {
    const { p, c } = drawFigure('Un trunchi de con circular drept este circumscris unei sfere și are razele bazelor de 4 cm și 9 cm.')!
    const { at, r } = c![0]
    const centre = at as Pt
    const tangent = foot(centre, p.A, p["A'"])
    expect(Math.hypot(centre[0] - tangent[0], centre[1] - tangent[1])).toBeCloseTo(r)
    expect(p.O[1] - centre[1]).toBeCloseTo(r)
    expect(centre[1] - p["O'"][1]).toBeCloseTo(r)
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
