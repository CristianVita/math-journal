import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { GENERATORS } from '../worksheets/generators'
import { generateModel, SLOTS } from './generated'

const formulas = (md: string) => [...md.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2])

describe('the generated national evaluation model', () => {
  it('every place has kinds that exist at its level', () => {
    expect(SLOTS.length).toBe(18)
    for (const s of SLOTS) for (const id of s.gens) expect(GENERATORS.find((g) => g.id === id)?.forms(s.level), id).toBeGreaterThan(0)
  })

  it('18 exercises with their solutions, valid formulas, the same for the same seed', () => {
    for (const seed of [1, 7, 42, 1234, 99999]) {
      const m = generateModel(seed, new Date(2026, 10, 23))
      expect(m.items.length).toBe(18)
      expect(m.generated).toBe(true)
      for (const it of m.items) {
        expect(it.text.length).toBeGreaterThan(10)
        expect(it.sol?.length).toBeGreaterThan(3)
        for (const f of [...formulas(it.text), ...formulas(it.sol!)]) expect(() => katex.renderToString(f, { throwOnError: true }), f).not.toThrow()
      }
      expect(generateModel(seed, new Date(2026, 10, 23))).toEqual(m)
    }
    expect(generateModel(1).items[0].text).not.toBe(generateModel(2).items[0].text)
  })
})
