// The exercises made by the app: right arithmetic, valid formulas, and the same exercise for the same seed.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { GENERATORS, type Level } from './generators'
import { addExact, de, exact, exactTex, exactValue, frac, radians, root, rootParts, seeded, surd } from './tex'

const SEEDS = Array.from({ length: 40 }, (_, i) => i * 7919 + 13)
const LEVELS: Level[] = [1, 2, 3, 4]

/** Every formula in a piece of markdown, $…$ and $$…$$. */
const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])

describe('each generator, at each level, in each of its forms', () => {
  for (const g of GENERATORS) {
    for (const level of LEVELS) {
      for (let form = 0; form < g.forms(level); form++) {
        it(`${g.id} (clasa a ${['V', 'VI', 'VII', 'VIII'][g.grade - 5]}-a), nivel ${level}, forma ${form + 1}`, () => {
          const texts = new Set<string>()
          for (const seed of SEEDS) {
            const m = g.make(seeded(seed), level, form)
            expect(m.text.length, `seed ${seed}`).toBeGreaterThan(10)
            expect(m.solution.length, `seed ${seed}`).toBeGreaterThan(5)
            // the arithmetic of the exercise holds
            if (m.verify) expect(m.verify(), `${g.id} ${level}/${form} seed ${seed}: ${m.text}`).toBe(true)
            // every formula is valid LaTeX for KaTeX
            for (const f of [...formulas(m.text), ...formulas(m.solution)]) {
              expect(() => katex.renderToString(f, { throwOnError: true }), `${g.id} ${level}/${form} seed ${seed}: ${f}`).not.toThrow()
            }
            // no leftovers of the code in what the student reads
            for (const t of [m.text, m.solution]) expect(t, `${g.id} seed ${seed}`).not.toMatch(/undefined|NaN|Infinity(?!\})|\[object/)
            // a LaTeX command that lost its backslash, or a formula left open
            for (const t of [m.text, m.solution]) {
              for (const f of formulas(t)) expect(f, `${g.id} ${level}/${form}`).not.toMatch(/(^|[^\\a-zA-Z])(mathbb|frac|sqrt|cdot|Rightarrow|qquad|circ|pm)\b/)
              // KaTeX cannot draw Romanian letters inside \text{}: they come out broken (ı ˆ, a ˘)
              for (const f of formulas(t)) expect(f, `${g.id} ${level}/${form}`).not.toMatch(/\\text\{[^}]*[ăâîșțĂÂÎȘȚ]/)
              // "de" glued to the next word
              expect(t, `${g.id} ${level}/${form}`).not.toMatch(/\bde(cifre|pagini|termeni|lei|ani|picioare|ori)\b/)
              expect((t.replace(/\$\$[\s\S]+?\$\$/g, '').match(/\$/g) ?? []).length % 2, `${g.id} ${level}/${form}: unmatched $`).toBe(0)
            }
            texts.add(m.text)
          }
          // the same seed gives the same exercise
          expect(g.make(seeded(SEEDS[3]), level, form).text).toBe(g.make(seeded(SEEDS[3]), level, form).text)
          // and different seeds give different numbers, most of the time
          expect(texts.size).toBeGreaterThan(5)
        })
      }
    }
  }

  // the complaint of 8 November 2026: a sheet of one kind was the same exercise with other numbers
  it.each(GENERATORS.map((g) => g.id))('%s has at least two different forms at every level it has', (id) => {
    const g = GENERATORS.find((x) => x.id === id)!
    // the usual kinds have levels 1–3, the contest kinds only level 4
    expect(LEVELS.filter((l) => g.forms(l) > 0)).toEqual(g.forms(4) > 0 ? [4] : [1, 2, 3])
    for (const level of LEVELS.filter((l) => g.forms(l) > 0)) {
      expect(g.forms(level), `nivel ${level}`).toBeGreaterThanOrEqual(2)
      // the forms are really different exercises: their statements differ once the numbers are taken out
      const shapes = new Set(Array.from({ length: g.forms(level) }, (_, f) => g.make(seeded(5), level, f).text.replace(/-?\d+/g, '#')))
      expect(shapes.size, `nivel ${level}`).toBe(g.forms(level))
    }
  })

  // asked for on 10 November 2026: a sheet of 100 exercises of one kind, none of them twice
  it.each(GENERATORS.map((g) => g.id))('%s has at least 100 different exercises at every level it has', (id) => {
    const g = GENERATORS.find((x) => x.id === id)!
    for (const level of LEVELS.filter((l) => g.forms(l) > 0)) {
      const n = g.forms(level)
      const texts = new Set(Array.from({ length: 2500 }, (_, s) => g.make(seeded(s * 7919 + 1), level, s % n).text))
      expect(texts.size, `nivel ${level}`).toBeGreaterThanOrEqual(100)
    }
  })

  it('the contest level has at least two kinds in every grade', () => {
    for (const grade of [5, 6, 7, 8]) expect(GENERATORS.filter((g) => g.grade === grade && g.forms(4) > 0).length, `clasa ${grade}`).toBeGreaterThanOrEqual(2)
  })

  it('there are generators for every grade from V to VIII', () => {
    expect(new Set(GENERATORS.map((g) => g.grade))).toEqual(new Set([5, 6, 7, 8]))
    expect(new Set(GENERATORS.map((g) => g.id)).size).toBe(GENERATORS.length)
  })
})

describe('how numbers are written', () => {
  it('fractions in lowest terms, with the sign in front', () => {
    expect(frac(6, 8)).toBe('\\frac{3}{4}')
    expect(frac(-3, 6)).toBe('-\\frac{1}{2}')
    expect(frac(3, -6)).toBe('-\\frac{1}{2}')
    expect(frac(8, 4)).toBe('2')
  })

  it('radicals with the squares taken out', () => {
    expect(rootParts(72)).toEqual([6, 2])
    expect(root(8)).toBe('2\\sqrt{2}')
    expect(root(49)).toBe('7')
    expect(root(7)).toBe('\\sqrt{7}')
    expect(surd(1, 2, 3)).toBe('\\frac{\\sqrt{3}}{2}')
    expect(surd(-3, 4, 2)).toBe('-\\frac{3\\sqrt{2}}{4}')
  })

  it('exact values of the special angles add up', () => {
    // 2·sin 30° + cos 60° = 2·1/2 + 1/2 = 3/2
    const v = addExact(addExact(new Map(), exact(1, 2), 2), exact(1, 2))
    expect(exactTex(v)).toBe('\\frac{3}{2}')
    // sin 60° + tg 30° = √3/2 + √3/3 = 5√3/6
    const w = addExact(exact(1, 2, 3), exact(1, 3, 3))
    expect(exactTex(w)).toBe('\\frac{5\\sqrt{3}}{6}')
    expect(exactValue(w)).toBeCloseTo(Math.sqrt(3) / 2 + Math.sqrt(3) / 3, 12)
    // 1 - √2/2
    expect(exactTex(addExact(exact(1, 1), exact(1, 2, 2), -1))).toBe('1 - \\frac{\\sqrt{2}}{2}')
  })

  it('"de" before a noun only where Romanian puts it', () => {
    expect(de(19)).toBe('19')
    expect(de(20)).toBe('20 de')
    expect(de(105)).toBe('105')
    expect(de(120)).toBe('120 de')
    expect(de(200)).toBe('200 de')
    expect(de(1)).toBe('1')
  })

  it('angles in radians', () => {
    expect(radians(30)).toBe('\\frac{\\pi}{6}')
    expect(radians(-120)).toBe('-\\frac{2\\pi}{3}')
    expect(radians(180)).toBe('\\pi')
    expect(radians(0)).toBe('0')
  })
})
