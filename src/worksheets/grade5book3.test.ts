// The grade V kinds from the Consolidare workbook, pp. 83–116: the same checks generators.test.ts applies to GENERATORS.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { KINDS } from './grade5book3'
import { seeded } from './tex'

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 13)
const LEVELS = [1, 2, 3] as const
const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])

describe('grade V, Consolidare workbook pp. 83–116', () => {
  it('ids are unique and start with v-', () => {
    expect(new Set(KINDS.map((k) => k.id)).size).toBe(KINDS.length)
    for (const k of KINDS) expect(k.id).toMatch(/^v-[a-z0-9-]+$/)
  })

  for (const k of KINDS) {
    for (const level of LEVELS) {
      k.forms[level].forEach((form, f) => {
        it(`${k.id}, nivel ${level}, forma ${f + 1} (${form.name})`, () => {
          const texts = new Set<string>()
          for (const seed of SEEDS) {
            const m = form(seeded(seed))
            expect(m.text.length, `seed ${seed}`).toBeGreaterThan(10)
            expect(m.solution.length, `seed ${seed}`).toBeGreaterThan(5)
            if (m.verify) expect(m.verify(), `${form.name} seed ${seed}: ${m.text}`).toBe(true)
            for (const t of [m.text, m.solution]) {
              for (const fm of formulas(t)) {
                expect(() => katex.renderToString(fm, { throwOnError: true }), `${form.name} seed ${seed}: ${fm}`).not.toThrow()
                expect(fm, form.name).not.toMatch(/(^|[^\\a-zA-Z])(mathbb|frac|sqrt|cdot|Rightarrow|qquad|circ|pm)\b/)
                expect(fm, form.name).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
              }
              expect(t, `${form.name} seed ${seed}`).not.toMatch(/undefined|NaN|Infinity(?!\})|\[object/)
              expect(t, form.name).not.toMatch(/\bde(cifre|pagini|termeni|lei|ani|picioare|ori)\b/)
              expect((t.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2, `${form.name}: unmatched $`).toBe(0)
            }
            texts.add(m.text)
          }
          expect(form(seeded(SEEDS[3])).text).toBe(form(seeded(SEEDS[3])).text)
          expect(texts.size).toBeGreaterThan(5)
        })
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
})
