import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { GENERATORS } from '../worksheets/generators'
import { bookItem, bookItemAt, bookKey, generateModel, seenBy, SLOTS } from './generated'
import { BUILTIN } from './store'
import { seeded } from '../worksheets/tex'

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

describe('the generated model from the books (23 November 2026)', () => {
  it('each place takes the exercise of the same place of a book model', () => {
    for (const seed of [3, 8, 77]) {
      const m = generateModel(seed, new Date(2026, 10, 23), 1, 'books')
      expect(m.items.length).toBe(18)
      m.items.forEach((it, pos) => {
        const book = BUILTIN.find((b) => b.id === it.book?.model)!
        const { book: _, ...rest } = it
        expect(rest).toEqual(bookItemAt(book, pos))
        expect(book.items[it.book!.n - 1]).toEqual(rest)
        expect(pos < 12 ? it.choices?.length : it.parts?.length).toBeGreaterThan(1)
      })
      expect(generateModel(seed, new Date(2026, 10, 23), 1, 'books')).toEqual(m)
    }
  })

  it('Perianu, Testul 6 (17 exercises) gives its subject II and III at the right places', () => {
    const t6 = BUILTIN.find((b) => b.starts)!
    expect(bookItemAt(t6, 5)).toBeUndefined()
    expect(bookItemAt(t6, 6)).toBe(t6.items[5])
    expect(bookItemAt(t6, 12)).toBe(t6.items[11])
    expect(bookItemAt(t6, 17)).toBe(t6.items[16])
  })

  it('the mix has both, and another from the books comes from another model', () => {
    const kinds = new Set<string>()
    for (let seed = 1; seed < 20; seed++) for (const it of generateModel(seed, new Date(), 1, 'mix').items) kinds.add(it.book ? 'book' : it.gen ? 'new' : '?')
    expect([...kinds].sort()).toEqual(['book', 'new'])
    const first = bookItem(4, seeded(1))
    for (let s = 2; s < 30; s++) expect(bookItem(4, seeded(s), first.book!.model).book!.model).not.toBe(first.book!.model)
  })
})

describe('what a student already had', () => {
  const keys = (m: ReturnType<typeof generateModel>) => m.items.map((it) => bookKey(it.book!.model, it.book!.n))

  it('30 models in a row repeat nothing, the 32nd still has 18 exercises', () => {
    const own: ReturnType<typeof generateModel>[] = []
    for (let k = 1; k <= 32; k++) {
      const seen = seenBy(7, own, [])
      const m = { ...generateModel(k, new Date(), k, 'books', seen), studentId: 7 }
      expect(m.items.length).toBe(18)
      if (k <= 30) for (const x of keys(m)) expect(seen.has(x)).toBe(false)
      own.push(m)
    }
    expect(seenBy(8, own, []).size).toBe(0)
  })

  it('a book model marked as done counts, another student does not', () => {
    const r = [{ id: 'r', studentId: 7, modelId: BUILTIN[0].id, date: '', score: null }]
    expect(seenBy(7, [], r).size).toBe(BUILTIN[0].items.length)
    expect(seenBy(8, [], r).size).toBe(0)
    for (let s = 1; s < 10; s++) for (const it of generateModel(s, new Date(), 1, 'books', seenBy(7, [], r)).items) expect(it.book!.model).not.toBe(BUILTIN[0].id)
  })
})
