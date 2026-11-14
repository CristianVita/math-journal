// The new kinds of grade V: the same checks as `generators.test.ts` makes on every registered generator.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { KINDS } from './grade5'
import { seeded } from './tex'

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 13)
const LEVELS = [1, 2, 3] as const

/** Every formula in a piece of markdown, $…$ and $$…$$. */
const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])

describe('each kind of grade V, at each level, in each of its forms', () => {
  for (const k of KINDS) {
    for (const level of LEVELS) {
      k.forms[level].forEach((make, form) => {
        it(`${k.id}, nivel ${level}, forma ${form + 1} (${make.name})`, () => {
          const texts = new Set<string>()
          for (const seed of SEEDS) {
            const m = make(seeded(seed))
            const where = `${k.id} ${level}/${form} seed ${seed}`
            expect(m.text.length, where).toBeGreaterThan(10)
            expect(m.solution.length, where).toBeGreaterThan(5)
            // the arithmetic of the exercise holds
            expect(m.verify, where).toBeTypeOf('function')
            expect(m.verify!(), `${where}: ${m.text}`).toBe(true)
            // every formula is valid LaTeX for KaTeX
            for (const f of [...formulas(m.text), ...formulas(m.solution)]) {
              expect(() => katex.renderToString(f, { throwOnError: true }), `${where}: ${f}`).not.toThrow()
            }
            for (const t of [m.text, m.solution]) {
              // no leftovers of the code in what the student reads
              expect(t, where).not.toMatch(/undefined|NaN|Infinity(?!\})|\[object/)
              // a LaTeX command that lost its backslash
              for (const f of formulas(t)) expect(f, where).not.toMatch(/(^|[^\\a-zA-Z])(mathbb|frac|sqrt|cdot|Rightarrow|qquad|circ|pm)\b/)
              // KaTeX cannot draw Romanian letters inside \text{}
              for (const f of formulas(t)) expect(f, where).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
              // "de" glued to the next word
              expect(t, where).not.toMatch(/\bde(cifre|pagini|termeni|lei|ani|picioare|ori)\b/)
              // a formula left open
              expect((t.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2, `${where}: unmatched $`).toBe(0)
            }
            texts.add(m.text)
          }
          // the same seed gives the same exercise
          expect(make(seeded(SEEDS[3])).text).toBe(make(seeded(SEEDS[3])).text)
          expect(make(seeded(SEEDS[3])).solution).toBe(make(seeded(SEEDS[3])).solution)
          // and different seeds give different numbers, most of the time
          expect(texts.size).toBeGreaterThan(5)
        })
      })
    }
  }

  it.each(KINDS.map((k) => k.id))('%s has at least two different forms at every level', (id) => {
    const k = KINDS.find((x) => x.id === id)!
    for (const level of LEVELS) {
      expect(k.forms[level].length, `nivel ${level}`).toBeGreaterThanOrEqual(2)
      // the forms are really different exercises: their statements differ once the numbers are taken out
      const shapes = new Set(k.forms[level].map((make) => make(seeded(5)).text.replace(/-?\d+/g, '#')))
      expect(shapes.size, `nivel ${level}`).toBe(k.forms[level].length)
    }
  })

  it.each(KINDS.map((k) => k.id))('%s has at least 100 different exercises at every level', (id) => {
    const k = KINDS.find((x) => x.id === id)!
    for (const level of LEVELS) {
      const n = k.forms[level].length
      const texts = new Set(Array.from({ length: 2500 }, (_, s) => k.forms[level][s % n](seeded(s * 7919 + 1)).text))
      expect(texts.size, `nivel ${level}`).toBeGreaterThanOrEqual(100)
    }
  })

  it('the ids are unique, start with v- and are in kebab-case, and no form is used twice', () => {
    expect(new Set(KINDS.map((k) => k.id)).size).toBe(KINDS.length)
    for (const k of KINDS) {
      expect(k.id).toMatch(/^v-[a-z]+(-[a-z]+)*$/)
      expect(k.label.length).toBeGreaterThan(5)
      expect(['Algebră', 'Geometrie']).toContain(k.topic)
    }
    const all = KINDS.flatMap((k) => LEVELS.flatMap((l) => k.forms[l]))
    expect(new Set(all).size).toBe(all.length)
  })
})
