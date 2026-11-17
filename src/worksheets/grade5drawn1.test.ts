// The grade V forms with drawings from the workbook "cu puișorul", pp. 6–42: the checks generators.test.ts applies to
// GENERATORS, and the figure of every form (its points defined, inside the drawing, a clean SVG).
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import type { Made } from './generators'
import { CONTEST, KINDS } from './grade5drawn1'
import { figureSvg, namesUsed } from '../models/figure'
import { seeded, type Rng } from './tex'

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 13)
const LEVELS = [1, 2, 3] as const
const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])
const JOINABLE = [
  'v-writing-numbers', 'v-compare-round', 'v-fraction-order', 'v-fraction-props', 'v-fraction-mult', 'v-decimal-writing',
  'v-decimal-order', 'v-decimal-periodic', 'v-mean-applied', 'v-statistics', 'v-points-lines', 'v-segment-length',
  'v-midpoint-symmetric', 'v-angle-measure', 'v-angle-calc', 'v-symmetry-axis', 'v-length-perimeter', 'v-area-units',
  'v-volume-units', 'v-final-geometry', 'v-final-measures', 'v-final-recap-figures', 'v-recap-grade4', 'v-geometry',
  'v-mean-units', 'v-number-line', 'v-fraction-figures', 'v-count-figures',
]

function checkFig(name: string, seed: number, m: Made) {
  const fig = m.fig
  expect(fig, `${name} seed ${seed}: no figure`).toBeDefined()
  if (!fig) return
  for (const n of namesUsed(fig)) expect(fig.p, `${name} seed ${seed}: point ${n}`).toHaveProperty(n)
  for (const [n, [x, y]] of Object.entries(fig.p)) {
    expect(x, `${name} seed ${seed}: ${n}.x`).toBeGreaterThanOrEqual(-0.5)
    expect(x, `${name} seed ${seed}: ${n}.x`).toBeLessThanOrEqual(fig.w + 0.5)
    expect(y, `${name} seed ${seed}: ${n}.y`).toBeGreaterThanOrEqual(-0.5)
    expect(y, `${name} seed ${seed}: ${n}.y`).toBeLessThanOrEqual(fig.h + 0.5)
  }
  const svg = figureSvg(fig)
  expect(svg, `${name} seed ${seed}`).not.toMatch(/NaN|undefined/)
}

function checkForm(name: string, form: (rng: Rng) => Made) {
  const texts = new Set<string>()
  for (const seed of SEEDS) {
    const m = form(seeded(seed))
    expect(m.text.length, `seed ${seed}`).toBeGreaterThan(10)
    expect(m.solution.length, `seed ${seed}`).toBeGreaterThan(5)
    if (m.verify) expect(m.verify(), `${name} seed ${seed}: ${m.text}`).toBe(true)
    for (const t of [m.text, m.solution]) {
      for (const fm of formulas(t)) {
        expect(() => katex.renderToString(fm, { throwOnError: true }), `${name} seed ${seed}: ${fm}`).not.toThrow()
        expect(fm, name).not.toMatch(/(^|[^\\a-zA-Z])(mathbb|frac|sqrt|cdot|Rightarrow|qquad|circ|pm)\b/)
        expect(fm, name).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
      }
      expect(t, `${name} seed ${seed}`).not.toMatch(/undefined|NaN|Infinity(?!\})|\[object/)
      expect(t, name).not.toMatch(/\bde(cifre|pagini|termeni|lei|ani|picioare|ori)\b/)
      expect((t.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2, `${name}: unmatched $`).toBe(0)
    }
    checkFig(name, seed, m)
    texts.add(m.text)
  }
  expect(form(seeded(SEEDS[3])).text).toBe(form(seeded(SEEDS[3])).text)
  expect(JSON.stringify(form(seeded(SEEDS[3])).fig)).toBe(JSON.stringify(form(seeded(SEEDS[3])).fig))
  expect(texts.size).toBeGreaterThan(5)
}

describe('grade V with drawings, workbook "cu puișorul", pp. 6–42', () => {
  it('ids are unique, start with v-d1- (v-contest-d1- for the contest kinds), and every join is a known kind', () => {
    const ids = [...KINDS.map((k) => k.id), ...CONTEST.map((k) => k.id)]
    expect(new Set(ids).size).toBe(ids.length)
    for (const k of KINDS) expect(k.id).toMatch(/^v-d1-[a-z0-9-]+$/)
    for (const k of CONTEST) expect(k.id).toMatch(/^v-contest-d1-[a-z0-9-]+$/)
    for (const id of ids) expect(JOINABLE, id).not.toContain(id)
    for (const k of KINDS) expect(JOINABLE, k.joins).toContain(k.joins)
  })

  for (const k of KINDS) {
    for (const level of LEVELS) {
      k.forms[level].forEach((form, f) => {
        it(`${k.id}, nivel ${level}, forma ${f + 1} (${form.name})`, () => checkForm(form.name, form))
      })
    }

    it(`${k.id} has at least two different forms at every level it has`, () => {
      for (const level of LEVELS) {
        const forms = k.forms[level]
        if (forms.length === 0) continue
        expect(forms.length, `nivel ${level}`).toBeGreaterThanOrEqual(2)
        const shapes = new Set(forms.map((f) => f(seeded(5)).text.replace(/-?\d+/g, '#')))
        expect(shapes.size, `nivel ${level}`).toBe(forms.length)
      }
    })

    it(`${k.id} has enough different exercises at every level it has`, () => {
      for (const level of LEVELS) {
        const forms = k.forms[level]
        if (forms.length === 0) continue
        const texts = new Set(Array.from({ length: 2500 }, (_, s) => forms[s % forms.length](seeded(s * 7919 + 1)).text))
        expect(texts.size, `nivel ${level}`).toBeGreaterThanOrEqual(30)
      }
    })
  }

  for (const k of CONTEST) {
    k.forms.forEach((form, f) => {
      it(`${k.id}, concurs, forma ${f + 1} (${form.name})`, () => checkForm(form.name, form))
    })
    it(`${k.id} has at least 100 different exercises`, () => {
      const texts = new Set(Array.from({ length: 2500 }, (_, s) => k.forms[s % k.forms.length](seeded(s * 7919 + 1)).text))
      expect(texts.size).toBeGreaterThanOrEqual(100)
    })
  }
})
