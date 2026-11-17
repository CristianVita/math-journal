// The grade V kinds from the Consolidare workbook, part II, pp. 201–220 (final recap and final tests): the same checks
// generators.test.ts applies to GENERATORS.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import type { Made } from './generators'
import { CONTEST, KINDS } from './grade5part2f'
import { seeded, type Rng } from './tex'

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 13)
const LEVELS = [1, 2, 3] as const
const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])
const TAKEN = [
  'v-ops', 'v-powers', 'v-fractions', 'v-decimals', 'v-rectangle', 'v-division', 'v-divisibility', 'v-equations', 'v-problems',
  'v-mean-units', 'v-geometry', 'v-recap-grade4', 'v-writing-numbers', 'v-compare-round', 'v-addition', 'v-subtraction',
  'v-add-sub', 'v-multiplication', 'v-division-exact', 'v-remainder', 'v-ops-brackets', 'v-power-rules', 'v-power-compare',
  'v-perfect-squares', 'v-powers-digits', 'v-bases', 'v-unit-method', 'v-comparison-method', 'v-figurative-method',
  'v-backwards-method', 'v-false-hypothesis', 'v-fraction-mult', 'v-fraction-order', 'v-fraction-props', 'v-recap-tests',
  'v-everyday', 'v-contest-numbers', 'v-contest-reasoning', 'v-contest-olympiad', 'v-contest-school-digits',
  'v-contest-school-problems', 'v-decimal-writing', 'v-decimal-order', 'v-decimal-add-sub', 'v-decimal-multiply',
  'v-decimal-powers', 'v-decimal-periodic', 'v-periodic-decimals', 'v-mean-applied', 'v-contest-decimal-digits',
  'v-decimal-division', 'v-decimal-order-ops', 'v-decimal-methods', 'v-statistics', 'v-points-lines', 'v-contest-decimals',
  'v-lines-through-points', 'v-segment-length', 'v-midpoint-symmetric', 'v-angle-measure', 'v-angle-calc', 'v-symmetry-axis',
  'v-contest-lines-angles',
]

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
    texts.add(m.text)
  }
  expect(form(seeded(SEEDS[3])).text).toBe(form(seeded(SEEDS[3])).text)
  expect(texts.size).toBeGreaterThan(5)
}

describe('grade V, Consolidare workbook part II, pp. 201–220', () => {
  it('ids are unique, start with v- (v-contest- for the contest kinds) and are new', () => {
    const ids = [...KINDS.map((k) => k.id), ...CONTEST.map((k) => k.id)]
    expect(new Set(ids).size).toBe(ids.length)
    for (const k of KINDS) expect(k.id).toMatch(/^v-[a-z0-9-]+$/)
    for (const k of CONTEST) expect(k.id).toMatch(/^v-contest-[a-z0-9-]+$/)
    for (const id of ids) expect(TAKEN, id).not.toContain(id)
  })

  for (const k of KINDS) {
    for (const level of LEVELS) {
      k.forms[level].forEach((form, f) => {
        it(`${k.id}, nivel ${level}, forma ${f + 1} (${form.name})`, () => checkForm(form.name, form))
      })
    }

    it(`${k.id} has at least two different forms at every level`, () => {
      for (const level of LEVELS) {
        const forms = k.forms[level]
        expect(forms.length, `nivel ${level}`).toBeGreaterThanOrEqual(2)
        const shapes = new Set(forms.map((f) => f(seeded(5)).text.replace(/-?\d+/g, '#')))
        expect(shapes.size, `nivel ${level}`).toBe(forms.length)
      }
    })

    it(`${k.id} has at least 100 different exercises at every level`, () => {
      for (const level of LEVELS) {
        const forms = k.forms[level]
        const texts = new Set(Array.from({ length: 2500 }, (_, s) => forms[s % forms.length](seeded(s * 7919 + 1)).text))
        expect(texts.size, `nivel ${level}`).toBeGreaterThanOrEqual(100)
      }
    })
  }

  for (const k of CONTEST) {
    k.forms.forEach((form, f) => {
      it(`${k.id}, concurs, forma ${f + 1} (${form.name})`, () => checkForm(form.name, form))
    })

    it(`${k.id} has at least two different forms`, () => {
      expect(k.forms.length).toBeGreaterThanOrEqual(2)
      const shapes = new Set(k.forms.map((f) => f(seeded(5)).text.replace(/-?\d+/g, '#')))
      expect(shapes.size).toBe(k.forms.length)
    })

    it(`${k.id} has at least 100 different exercises`, () => {
      const texts = new Set(Array.from({ length: 2500 }, (_, s) => k.forms[s % k.forms.length](seeded(s * 7919 + 1)).text))
      expect(texts.size).toBeGreaterThanOrEqual(100)
    })
  }
})
