// "Model E.N. generat" (asked for by the user on 23 November 2026): a whole national evaluation test made of the app's
// own exercise kinds, new numbers at every press. First version: the exercises are written out, without the four
// answers to choose from; the key is the worked solution of each one.
import { GENERATORS, type Level } from '../worksheets/generators'
import { figureFor } from '../worksheets/figures'
import { seeded, type Rng } from '../worksheets/tex'
import { BUILTIN, type EnResult } from './store'
import type { EnItem, EnModel } from './types'

/** The 18 places of the test, in the order of the exam: the kinds to choose from and the level. */
export const SLOTS: { gens: string[]; level: Level }[] = [
  // subject I: short computations
  { gens: ['viii-numbers', 'vii-real-numbers'], level: 1 },
  { gens: ['viii-radicals', 'vii-radicals'], level: 1 },
  { gens: ['vi-percent', 'vi-proportion', 'vi-ratios'], level: 1 },
  { gens: ['vii-linear', 'viii-inequality'], level: 1 },
  { gens: ['viii-data'], level: 1 },
  { gens: ['vi-angles', 'vii-pythagoras'], level: 1 },
  // subject II: one step more, algebra and geometry
  { gens: ['viii-expressions', 'viii-factoring'], level: 2 },
  { gens: ['viii-function'], level: 2 },
  { gens: ['vii-thales', 'vii-trig', 'vii-metric'], level: 2 },
  { gens: ['vii-areas', 'vii-quadrilaterals'], level: 2 },
  { gens: ['vii-circle'], level: 2 },
  { gens: ['viii-cuboid', 'viii-prisms', 'viii-pyramids', 'viii-round'], level: 2 },
  // subject III: problems with the whole solution
  { gens: ['viii-problems'], level: 3 },
  { gens: ['viii-system', 'viii-quadratic'], level: 3 },
  { gens: ['viii-expressions', 'viii-function'], level: 3 },
  { gens: ['vii-quadrilaterals', 'vii-areas', 'vii-metric'], level: 3 },
  { gens: ['viii-solids', 'viii-pyramids', 'viii-prisms'], level: 3 },
  { gens: ['viii-space', 'viii-dihedral'], level: 3 },
]

const pickFrom = <T,>(rng: Rng, list: T[]) => list[Math.floor(rng() * list.length)]

/** One exercise of the kind, at the level, from the seed. */
export function makeItem(id: string, level: Level, seed: number): EnItem {
  const g = GENERATORS.find((x) => x.id === id)!
  const rng = seeded(seed)
  const m = g.make(rng, level, Math.floor(rng() * g.forms(level)))
  const fig = m.fig ?? (g.topic === 'Geometrie' ? figureFor(m.text) : undefined)
  return { text: m.text, sol: m.solution, gen: { id, level }, ...(fig ? { fig } : {}) }
}

/** Where the exercises come from (23 November 2026, asked for by the user): the books, half and half, or all new. */
export type GenKind = 'books' | 'mix' | 'new'
export const GEN_KINDS: { id: GenKind; label: string; source: string }[] = [
  { id: 'books', label: 'din cărți', source: 'exercițiile modelelor din cărți' },
  { id: 'mix', label: 'amestec', source: 'exerciții din cărți și exerciții noi' },
  { id: 'new', label: 'doar exerciții noi', source: 'generat de aplicație' },
]

/** The exercise of a book model at this place of the test (0–17), or none: Perianu, Testul 6 has 5 in subject I. */
export function bookItemAt(m: EnModel, pos: number): EnItem | undefined {
  const [s2, s3] = m.starts ?? [6, 12]
  const from = [0, s2, s3]
  const end = [s2, s3, m.items.length]
  const s = pos < 6 ? 0 : pos < 12 ? 1 : 2
  const j = from[s] + pos - 6 * s
  return j < end[s] ? m.items[j] : undefined
}

/** How an exercise of a book model is remembered. */
export const bookKey = (model: string, n: number) => `${model}#${n}`

/**
 * The book exercises a student already had: the models marked as done and the ones generated for this student. A
 * generated model that is deleted no longer counts.
 */
export function seenBy(studentId: number, own: EnModel[], results: EnResult[]): Set<string> {
  const done = new Set(results.filter((r) => r.studentId === studentId).map((r) => r.modelId))
  const seen = new Set<string>()
  for (const m of BUILTIN) if (done.has(m.id)) m.items.forEach((_, j) => seen.add(bookKey(m.id, j + 1)))
  for (const m of own) if (m.studentId === studentId || done.has(m.id)) for (const it of m.items) if (it.book) seen.add(bookKey(it.book.model, it.book.n))
  return seen
}

/**
 * The exercise at this place from a book model chosen at random, not from the one left out and not one already seen
 * (unless all of them were); it remembers where from.
 */
export function bookItem(pos: number, rng: Rng, except?: string, seen?: Set<string>): EnItem {
  const have = BUILTIN.filter((m) => bookItemAt(m, pos))
  const others = have.filter((m) => m.id !== except)
  const fresh = others.filter((m) => !seen?.has(bookKey(m.id, m.items.indexOf(bookItemAt(m, pos)!) + 1)))
  const m = pickFrom(rng, fresh.length ? fresh : others.length ? others : have)
  const j = m.items.indexOf(bookItemAt(m, pos)!)
  return { ...bookItemAt(m, pos)!, book: { model: m.id, n: j + 1, title: m.title } }
}

/** A new model: the same seed gives the same model. */
export function generateModel(seed: number, made = new Date(), n = 1, kind: GenKind = 'new', seen?: Set<string>): EnModel {
  const rng = seeded(seed)
  const items: EnItem[] = SLOTS.map((slot, pos) => {
    if (kind === 'books' || (kind === 'mix' && rng() < 0.5)) return bookItem(pos, rng, undefined, seen)
    const gens = slot.gens.map((id) => GENERATORS.find((g) => g.id === id)).filter((g) => g && g.forms(slot.level) > 0)
    const g = pickFrom(rng, gens)!
    return makeItem(g.id, slot.level, Math.floor(rng() * 1e9))
  })
  const date = made.toLocaleDateString('ro-RO')
  const source = GEN_KINDS.find((k) => k.id === kind)!.source
  return { id: `gen-${seed}`, title: `Model generat ${n}`, source: `${source}, ${date}`, own: true, generated: true, items }
}
