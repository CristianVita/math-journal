// "Model E.N. generat" (asked for by the user on 23 November 2026): a whole national evaluation test made of the app's
// own exercise kinds, new numbers at every press. First version: the exercises are written out, without the four
// answers to choose from; the key is the worked solution of each one.
import { GENERATORS, type Level } from '../worksheets/generators'
import { figureFor } from '../worksheets/figures'
import { seeded, type Rng } from '../worksheets/tex'
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

/** A new model: the same seed gives the same model. */
export function generateModel(seed: number, made = new Date(), n = 1): EnModel {
  const rng = seeded(seed)
  const items: EnItem[] = SLOTS.map((slot) => {
    const gens = slot.gens.map((id) => GENERATORS.find((g) => g.id === id)).filter((g) => g && g.forms(slot.level) > 0)
    const g = pickFrom(rng, gens)!
    return makeItem(g.id, slot.level, Math.floor(rng() * 1e9))
  })
  const date = made.toLocaleDateString('ro-RO')
  return { id: `gen-${seed}`, title: `Model generat ${n}`, source: `generat de aplicație, ${date}`, own: true, generated: true, items }
}
