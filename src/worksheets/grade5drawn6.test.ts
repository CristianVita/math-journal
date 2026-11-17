// The grade V forms with drawings from Mate 2000+ Consolidare, part II, pp. 152–220: the checks of generators.test.ts,
// and the figure of every form (its points defined and inside the drawing, a clean SVG).
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import type { Made } from './generators'
import { CONTEST, KINDS } from './grade5drawn6'
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

function checkForm(name: string, form: (rng: Rng) => Made) {
  const texts = new Set<string>()
  for (const seed of SEEDS) {
    const m = form(seeded(seed))
    expect(m.text.length, `seed ${seed}`).toBeGreaterThan(10)
    expect(m.solution.length, `seed ${seed}`).toBeGreaterThan(5)
    expect(m.verify, name).toBeTruthy()
    expect(m.verify!(), `${name} seed ${seed}: ${m.text}`).toBe(true)
    for (const t of [m.text, m.solution]) {
      for (const fm of formulas(t)) {
        expect(() => katex.renderToString(fm, { throwOnError: true }), `${name} seed ${seed}: ${fm}`).not.toThrow()
        expect(fm, name).not.toMatch(/(^|[^\\a-zA-Z])(mathbb|frac|sqrt|cdot|Rightarrow|qquad|circ|pm)\b/)
        expect(fm, name).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
        expect(fm, name).not.toMatch(/\d\.\d/)
      }
      expect(t, `${name} seed ${seed}`).not.toMatch(/undefined|NaN|Infinity(?!\})|\[object/)
      expect(t, name).not.toMatch(/\bde(cifre|pagini|termeni|lei|ani|picioare|ori|elevi|puncte)\b/)
      expect((t.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2, `${name}: unmatched $`).toBe(0)
    }
    // the figure
    const f = m.fig
    expect(f, `${name}: no figure`).toBeTruthy()
    for (const n of namesUsed(f!)) expect(f!.p[n], `${name} seed ${seed}: point ${n}`).toBeTruthy()
    for (const [n, [x, y]] of Object.entries(f!.p)) {
      expect(x, `${name} ${n}.x`).toBeGreaterThanOrEqual(-0.5)
      expect(x, `${name} ${n}.x`).toBeLessThanOrEqual(f!.w + 0.5)
      expect(y, `${name} ${n}.y`).toBeGreaterThanOrEqual(-0.5)
      expect(y, `${name} ${n}.y`).toBeLessThanOrEqual(f!.h + 0.5)
    }
    expect(f!.w, name).toBeLessThanOrEqual(440)
    expect(figureSvg(f!), `${name} seed ${seed}`).not.toMatch(/NaN|undefined/)
    texts.add(m.text)
  }
  expect(form(seeded(SEEDS[3])).text).toBe(form(seeded(SEEDS[3])).text)
  expect(figureSvg(form(seeded(SEEDS[3])).fig!)).toBe(figureSvg(form(seeded(SEEDS[3])).fig!))
  expect(texts.size).toBeGreaterThan(5)
}

describe('grade V with drawings, Mate 2000+ Consolidare part II, pp. 152–220 (d6)', () => {
  it('ids are unique, start with v-d6- (v-contest-d6- for the contest kinds), and every kind joins a known kind', () => {
    const ids = [...KINDS.map((k) => k.id), ...CONTEST.map((k) => k.id)]
    expect(new Set(ids).size).toBe(ids.length)
    for (const k of KINDS) expect(k.id).toMatch(/^v-d6-[a-z0-9-]+$/)
    for (const k of CONTEST) expect(k.id).toMatch(/^v-contest-d6-[a-z0-9-]+$/)
    for (const id of ids) expect(JOINABLE, id).not.toContain(id)
    for (const k of KINDS) expect(JOINABLE, k.id).toContain(k.joins)
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
