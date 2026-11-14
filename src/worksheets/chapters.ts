// The chapters of the national evaluation (grades V–VIII), for a worksheet on one of them with exercises from every
// source: the generated kinds and the book's own (the E.N. models and tests, the recap exercises). Asked for by the
// user on 13 November 2026. A generated kind belongs to its chapter by its id; a book exercise by the kind most like
// it (`similar.ts`), or by its words when no kind is alike.
import { BUILTIN } from '../models/store'
import { RECAP8 } from '../models/data/recap8'
import { answerText, itemText } from '../models/types'
import { recapAnswer, recapText } from '../models/recap'
import type { Fig } from '../models/figure'
import { similarForms } from './similar'

export interface Chapter { id: string; title: string; gens: string[] }

export const CHAPTERS: Chapter[] = [
  { id: 'numbers', title: 'Numere: operații, puteri, fracții, divizibilitate', gens: ['v-ops', 'v-powers', 'v-fractions', 'v-decimals', 'vi-fractions', 'vi-integers', 'viii-numbers', 'v-division', 'v-divisibility', 'vi-sets', 'vi-gcd-lcm', 'vii-real-numbers', 'v-writing-numbers', 'v-compare-round', 'v-addition', 'v-subtraction', 'v-powers-digits', 'v-bases', 'v-add-sub', 'v-multiplication', 'v-division-exact', 'v-remainder', 'v-ops-brackets', 'v-power-rules', 'v-power-compare', 'v-perfect-squares'] },
  { id: 'radicals', title: 'Radicali', gens: ['vii-radicals', 'viii-radicals'] },
  { id: 'percent', title: 'Rapoarte, proporții, procente', gens: ['vi-percent', 'vi-proportion', 'vi-ratios'] },
  { id: 'data', title: 'Date, medii, probabilități', gens: ['viii-data', 'v-mean-units'] },
  { id: 'algebra', title: 'Calcul algebric: expresii, descompuneri', gens: ['viii-expressions', 'viii-factoring', 'vii-algebra'] },
  { id: 'equations', title: 'Ecuații, inecuații, sisteme', gens: ['vii-linear', 'viii-inequality', 'viii-system', 'viii-quadratic', 'v-equations', 'vi-equations', 'vii-equations'] },
  { id: 'problems', title: 'Probleme cu text', gens: ['viii-problems', 'v-problems', 'v-recap-grade4', 'v-unit-method', 'v-comparison-method', 'v-figurative-method', 'v-backwards-method', 'v-false-hypothesis'] },
  { id: 'function', title: 'Funcția liniară', gens: ['viii-function'] },
  { id: 'triangles', title: 'Unghiuri și triunghiuri: Pitagora, Thales, trigonometrie', gens: ['vi-angles', 'vii-pythagoras', 'vii-thales', 'vii-trig', 'v-geometry', 'vi-triangle', 'vii-metric'] },
  { id: 'quads', title: 'Patrulatere și arii', gens: ['v-rectangle', 'vii-areas', 'vii-quadrilaterals'] },
  { id: 'circle', title: 'Cercul', gens: ['vi-lines-circle', 'vii-circle'] },
  { id: 'solids', title: 'Corpuri: arii și volume', gens: ['viii-solids', 'viii-cuboid', 'viii-prisms', 'viii-pyramids', 'viii-round', 'viii-frustums', 'viii-elements'] },
  { id: 'space', title: 'Distanțe și unghiuri în spațiu', gens: ['viii-space', 'viii-dihedral'] },
]

const byGen = new Map(CHAPTERS.flatMap((c) => c.gens.map((g) => [g, c.id] as const)))

/** The chapters of a statement from a book: usually one, two for a solid asked about both volume and angles. */
export function chaptersOf(text: string): string[] {
  const t = text.replace(/\$[^$]*\$/g, ' ').toLowerCase()
  const solid = /\bcub|paralelipiped|piramid|tetraedr|prism|\bcon(?:ul|ului)?\b|cilindr|\bsfer|trunchi/.test(t)
  if (solid) {
    const out: string[] = []
    if (/aria|volum|capacitat|litri|\bl\b|desfășura|muchi/.test(t)) out.push('solids')
    if (/distanț|unghi|diedr|perpendicular|paralel|planul|planele|proiecți/.test(t)) out.push('space')
    return out.length ? out : ['solids']
  }
  if (/\bcerc|\barc/.test(t)) return ['circle']
  if (/probabilit|media (?:aritmetică )?a (?:notelor|elevului)|tabel/.test(t) && !/patru elevi au calculat/.test(t)) return ['data']
  const m = similarForms(text, 1)[0]
  if (m && byGen.has(m.gen)) return [byGen.get(m.gen)!]
  if (/secant|drepte(?:le)? paralele|unghi|triunghi|simetric|coliniar|segment/.test(t) || /\\sphericalangle|\\triangle/.test(text)) return ['triangles']
  if (/paralelogram|dreptunghi(?!c)|pătrat|romb|trapez/.test(t)) return ['quads']
  // the short ones, which no kind is like: by what they ask
  if (/\\sqrt/.test(text)) return ['radicals']
  if (/soluția ecuației|ecuați/.test(t) || /\$[^$]*x[^$]*=[^$]*\$/.test(text)) return ['equations']
  if (/minute|\bora\b|lei|km/.test(t)) return ['problems']
  return ['numbers']
}

export const chapterOfGen = (genId: string) => byGen.get(genId)

export interface BookExercise {
  /** where it is from, to keep it from coming twice: the model or recap chapter and the number */
  source: { model: string; n: number }
  where: string
  text: string
  solution: string
  fig?: Fig
  chapters: string[]
}

let book: BookExercise[] | null = null

/** Every exercise of the books in the app, with its chapters. */
export function bookExercises(): BookExercise[] {
  if (book) return book
  book = []
  for (const m of BUILTIN) {
    m.items.forEach((it, i) => {
      const text = itemText(it)
      book!.push({ source: { model: m.id, n: i + 1 }, where: `${m.title}, ex. ${i + 1}`, text, solution: answerText(it), fig: it.fig, chapters: chaptersOf(text) })
    })
  }
  for (const s of RECAP8.sections) {
    s.items.forEach((it, i) => {
      const text = recapText(it)
      book!.push({ source: { model: `${RECAP8.id}-${s.id}`, n: i + 1 }, where: `Recapitulare, ${s.title}, ex. ${i + 1}`, text, solution: recapAnswer(it), fig: it.fig, chapters: chaptersOf(text) })
    })
  }
  return book
}
