// The new kinds of grade VII: the same checks as for the registered generators (generators.test.ts).
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { KINDS } from './grade7'
import { seeded } from './tex'

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 13)
const LEVELS = [1, 2, 3] as const

/** Every formula in a piece of markdown, $…$ and $$…$$. */
const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])

describe('grade VII: each kind, at each level, in each of its forms', () => {
  for (const k of KINDS) {
    for (const level of LEVELS) {
      k.forms[level].forEach((make, form) => {
        it(`${k.id}, nivel ${level}, forma ${form + 1}`, () => {
          const texts = new Set<string>()
          for (const seed of SEEDS) {
            const m = make(seeded(seed))
            expect(m.text.length, `seed ${seed}`).toBeGreaterThan(10)
            expect(m.solution.length, `seed ${seed}`).toBeGreaterThan(5)
            expect(m.verify, `${k.id} ${level}/${form}`).toBeTypeOf('function')
            expect(m.verify!(), `${k.id} ${level}/${form} seed ${seed}: ${m.text}`).toBe(true)
            for (const f of [...formulas(m.text), ...formulas(m.solution)]) {
              expect(() => katex.renderToString(f, { throwOnError: true }), `${k.id} ${level}/${form} seed ${seed}: ${f}`).not.toThrow()
            }
            for (const t of [m.text, m.solution]) expect(t, `${k.id} seed ${seed}`).not.toMatch(/undefined|NaN|Infinity(?!\})|\[object/)
            for (const t of [m.text, m.solution]) {
              for (const f of formulas(t)) expect(f, `${k.id} ${level}/${form}`).not.toMatch(/(^|[^\\a-zA-Z])(mathbb|frac|sqrt|cdot|Rightarrow|qquad|circ|pm)\b/)
              for (const f of formulas(t)) expect(f, `${k.id} ${level}/${form}`).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
              expect(t, `${k.id} ${level}/${form}`).not.toMatch(/\bde(cifre|pagini|termeni|lei|ani|picioare|ori)\b/)
              expect((t.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2, `${k.id} ${level}/${form}: unmatched $`).toBe(0)
            }
            texts.add(m.text)
          }
          // the same seed gives the same exercise
          const [once, again] = [make(seeded(SEEDS[3])), make(seeded(SEEDS[3]))]
          expect(once.text).toBe(again.text)
          expect(once.solution).toBe(again.solution)
          // and different seeds give different numbers, most of the time
          expect(texts.size).toBeGreaterThan(5)
        })
      })
    }
  }

  it.each(KINDS.map((k) => k.id))('%s has at least two different forms at every level', (id) => {
    const k = KINDS.find((x) => x.id === id)!
    for (const level of LEVELS) {
      const forms = k.forms[level]
      expect(forms.length, `nivel ${level}`).toBeGreaterThanOrEqual(2)
      const shapes = new Set(forms.map((make) => make(seeded(5)).text.replace(/-?\d+/g, '#')))
      expect(shapes.size, `nivel ${level}`).toBe(forms.length)
    }
  })

  it.each(KINDS.map((k) => k.id))('%s has at least 100 different exercises at every level', (id) => {
    const k = KINDS.find((x) => x.id === id)!
    for (const level of LEVELS) {
      const forms = k.forms[level]
      const texts = new Set(Array.from({ length: 2500 }, (_, s) => forms[s % forms.length](seeded(s * 7919 + 1)).text))
      expect(texts.size, `nivel ${level}`).toBeGreaterThanOrEqual(100)
    }
  })

  it('the ids are unique and belong to grade VII, the topics and labels are filled in', () => {
    expect(new Set(KINDS.map((k) => k.id)).size).toBe(KINDS.length)
    for (const k of KINDS) {
      expect(k.id).toMatch(/^vii-[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(k.label.length).toBeGreaterThan(5)
      expect(['Algebră', 'Geometrie']).toContain(k.topic)
    }
    // no form is used twice
    const all = KINDS.flatMap((k) => LEVELS.flatMap((l) => k.forms[l]))
    expect(new Set(all).size).toBe(all.length)
  })
})
