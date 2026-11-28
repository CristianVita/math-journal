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
import { seeded } from './tex'
import { BOOK_CHAPTERS } from './bookChapters'
import { GENERATORS, type Level } from './generators'

/** `on`, `off`: what the statement of a generated exercise must, and must not, have to belong to the chapter (some kinds,
 * as the recap tests, are about several things; the user wants a chapter to keep to its subject, 25 November 2026).
 * `skip`: forms of a kind that do not belong to the chapter, as "level/form".
 * `priorityGens`: kinds to cover first when the chapter names specific topics. */
export interface Chapter { id: string; title: string; gens: string[]; priorityGens?: string[]; skip?: Record<string, string[]>; on?: RegExp; off?: RegExp }

export const CHAPTERS: Chapter[] = [
  { id: 'numbers', title: 'Numere: operații, puteri, fracții, divizibilitate', off: /\b(?:cm|km|kg|lei|dm|ml)\b|litr|perimetr|\bari[ae]|medi[ae] (?:aritm|geom)|probabil|unghi|volum|ecuați|cumpăr|plăti|ore\b|elevi|copii|pagini/i, gens: ['v-ops', 'v-powers', 'v-fractions', 'v-decimals', 'vi-fractions', 'vi-integers', 'viii-numbers', 'viii-sets', 'viii-intervals', 'v-division', 'v-divisibility', 'vi-sets', 'vi-gcd-lcm', 'vii-real-numbers', 'v-writing-numbers', 'v-compare-round', 'v-addition', 'v-subtraction', 'v-powers-digits', 'v-bases', 'v-add-sub', 'v-multiplication', 'v-division-exact', 'v-remainder', 'v-ops-brackets', 'v-power-rules', 'v-power-compare', 'v-perfect-squares', 'v-fraction-mult', 'v-fraction-order', 'v-fraction-props', 'v-decimal-writing', 'v-decimal-order', 'v-decimal-add-sub', 'v-decimal-multiply', 'v-decimal-powers', 'v-decimal-periodic', 'v-decimal-division', 'v-decimal-order-ops', 'v-final-naturals', 'v-final-fractions', 'v-final-tests', 'v-final-recap-numbers', 'v-number-line', 'v-fraction-figures'] },
  { id: 'radicals', title: 'Radicali', off: /ecuați|triunghi|\bcm\b/i, gens: ['vii-radicals', 'viii-radicals'] },
  { id: 'percent', title: 'Rapoarte, proporții, procente', off: /probabil/i, gens: ['vi-percent', 'vi-proportion', 'vi-ratios'] },
  { id: 'data', title: 'Date, medii, probabilități', on: /medi[aeiu]|\bnot[ae]\b|notel|tabel|grafic|diagram|probabil|sondaj|temperatur|frecven|vizit|bilete|timp|puncte|precipita|promov/i, gens: ['viii-data', 'v-mean-units', 'v-mean-applied', 'v-statistics'],
    // units of measure, journeys, shopping lists: not data (the user met a coach journey here, 25 November 2026)
    skip: { 'v-mean-units': ['1/1', '1/2', '2/1', '2/2', '3/2'], 'v-statistics': ['1/6', '3/0', '3/2', '3/5', '3/6'], 'viii-data': ['3/3'] } },
  { id: 'algebra', title: 'Calcul algebric: expresii, descompuneri', off: /^Rezolvați|\bcm\b|\blei\b/, gens: ['viii-expressions', 'viii-factoring', 'vii-algebra', 'viii-literal', 'viii-formulas', 'viii-alg-fractions'] },
  { id: 'equations', title: 'Ecuații, inecuații, sisteme', off: /\b(?:cm|km|kg|lei)\b|magazin|triunghi|elevi|copii|bilete/i, gens: ['vii-linear', 'viii-inequality', 'viii-system', 'viii-quadratic', 'v-equations', 'vi-equations', 'vii-equations'] },
  { id: 'problems', title: 'Probleme cu situații reale', off: /^(?:Calculați|Efectuați)[: ]|^(?:Arătați|Demonstrați)|perimetr|triunghi|unghi|\bcub|volum|Descompuneți/, gens: ['viii-problems', 'v-problems', 'v-recap-grade4', 'v-unit-method', 'v-comparison-method', 'v-figurative-method', 'v-backwards-method', 'v-false-hypothesis', 'v-recap-tests', 'v-everyday', 'v-decimal-methods', 'v-final-methods'] },
  { id: 'function', title: 'Funcții. Funcția liniară', gens: ['viii-function', 'viii-functions'] },
  { id: 'triangles', title: 'Unghiuri și triunghiuri: Pitagora, Thales, trigonometrie',
    on: /triunghi|unghi|Pitagora|Thales|trigonometr|\\(?:sphericalangle|angle|widehat|triangle|sin|cos)\b/i,
    off: /paralelipiped|volum|litr|\bcub|piramid|prism|cerc|romb|trapez|paralelogram|pătrat|(?<![a-zăâîșț])dreptunghi(?!c)/i,
    priorityGens: ['vii-pythagoras', 'vii-thales', 'vii-trig'],
    gens: ['vi-angles', 'vii-pythagoras', 'vii-thales', 'vii-trig', 'v-geometry', 'vi-triangle', 'vii-metric', 'v-points-lines', 'v-segment-length', 'v-midpoint-symmetric', 'v-angle-measure', 'v-angle-calc', 'v-symmetry-axis', 'v-final-geometry', 'v-count-figures'] },
  { id: 'quads', title: 'Patrulatere și arii', off: /\bcub|paralelipiped|volum|litr|piramid|prism/i, gens: ['v-rectangle', 'vii-areas', 'vii-quadrilaterals', 'v-length-perimeter', 'v-area-units', 'v-final-recap-figures'] },
  { id: 'circle', title: 'Cercul', on: /cerc|coard|arcul|tangent|\bdisc/i, gens: ['vi-lines-circle', 'vii-circle'] },
  { id: 'solids', title: 'Corpuri: arii și volume', on: /\bcub|paralelipiped|piramid|tetraedr|prism|\bcon\b|\bconul|cilindr|sfer|trunchi|volum|litr|\^3|\bhl|\bml|acvari|piscin|bazin|cutie/i, gens: ['viii-solids', 'viii-cuboid', 'viii-prisms', 'viii-pyramids', 'viii-round', 'viii-frustums', 'viii-elements', 'v-volume-units', 'v-final-measures'] },
  { id: 'space', title: 'Distanțe și unghiuri în spațiu', gens: ['viii-space', 'viii-dihedral'] },
]

/** Whether a generated statement keeps to the subject of the chapter. */
export const fitsChapter = (c: Chapter, text: string) => !(c.on && !c.on.test(text)) && !c.off?.test(text)

/** Whether a generated form keeps to the subject of the chapter, told from a few of its statements. */
const keeps = (c: Chapter, gen: string, level: Level, form: number) => {
  if (!c.on && !c.off) return true
  const g = GENERATORS.find((x) => x.id === gen)!
  return [11, 2357, 40009].every((seed) => fitsChapter(c, g.make(seeded(seed), level, form).text))
}

/** The generated forms of a chapter at a level. */
export function chapterForms(c: Chapter, level: Level) {
  const generators = GENERATORS.filter((g) => c.gens.includes(g.id))
  const priority = c.priorityGens ?? []
  const ordered = [...priority.flatMap((id) => generators.filter((g) => g.id === id)), ...generators.filter((g) => !priority.includes(g.id))]
  return ordered.flatMap((g) => Array.from({ length: g.forms(level) }, (_, form) => form)
    .filter((f) => !c.skip?.[g.id]?.includes(`${level}/${f}`) && keeps(c, g.id, level, f))
    .map((form) => ({ gen: g.id, form })))
}

const byGen = new Map(CHAPTERS.flatMap((c) => c.gens.map((g) => [g, c.id] as const)))

/** The chapters of a statement from a book: usually one, two for a solid asked about both volume and angles. */
export function chaptersOf(text: string): string[] {
  const t = text.replace(/\$[^$]*\$/g, ' ').toLowerCase()
  const solid = /\bcub|paralelipiped|piramid|tetraedr|prism|\bcon(?:ul|ului)?\b|cilindr|\bsfer|trunchi/.test(t)
  if (solid) {
    const out: string[] = []
    if (/aria|volum|capacitat|litri|\bl\b|desfășura|muchi/.test(t)) out.push('solids')
    if (/distanț|(?<!tri|drept)unghi|diedr|perpendicular|paralel(?!ipiped)|planul|planele|proiecți/.test(t) || /\\sphericalangle/.test(text)) out.push('space')
    return out.length ? out : ['solids']
  }
  if (/\bcerc|\barc/.test(t)) return ['circle']
  if (/imaginii funcției|tabelul de valori/.test(t)) return ['function']
  if (/valoarea raportului/.test(t) && /\\sqrt/.test(text)) return ['radicals']
  // two temperatures compared are integers, not data
  if (/temperatur/.test(t) && !/medi[aei]|tabel|grafic|figur|diagram|temperaturi/.test(t)) return [/raportul/.test(t) ? 'percent' : 'numbers']
  if (/probabilit|media (?:aritmetică )?a (?:notelor|elevului)|tabel/.test(t) && !/patru elevi au calculat/.test(t)) return ['data']
  const m = similarForms(text, 1)[0]
  // a kind of the circle (or of functions) is near to angles and distances too: that chapter only when the statement
  // has a circle (or a function)
  const near = m && byGen.get(m.gen)
  if (near && (near !== 'data' || /medi|\bnot[ae]\b|notel|tabel|grafic|diagram|probabil/.test(t)) && (near !== 'circle' || /coard|tangent|\bdisc|înscris/.test(t)) && (near !== 'function' || /funcți|reper|axe|grafic/.test(t))) return [near]
  if (/secant|drepte(?:le)? paralele|unghi|triunghi|simetric|coliniar|segment/.test(t) || /\\sphericalangle|\\triangle/.test(text)) return ['triangles']
  if (/paralelogram|dreptunghi(?!c)|pătrat|romb|trapez/.test(t)) return ['quads']
  // the short ones, which no kind is like: by what they ask
  if (/\\sqrt/.test(text)) return ['radicals']
  if (/soluția ecuației|ecuați/.test(t) || /\$[^$]*x[^$]*=[^$]*\$/.test(text)) return ['equations']
  if (/minute|\bora\b|lei|km|probleme/.test(t)) return ['problems']
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

/** Read one by one where the rules below go wrong (`bookChapters.ts`), else by the statement. */
const own = (model: string, n: number, text: string) => (BOOK_CHAPTERS[`${model}#${n}`] ? [BOOK_CHAPTERS[`${model}#${n}`]] : chaptersOf(text))

let book: BookExercise[] | null = null

/** Every exercise of the books in the app, with its chapters. */
export function bookExercises(): BookExercise[] {
  if (book) return book
  book = []
  for (const m of BUILTIN) {
    m.items.forEach((it, i) => {
      const text = itemText(it)
      book!.push({ source: { model: m.id, n: i + 1 }, where: `${m.title}, ex. ${i + 1}`, text, solution: answerText(it), fig: it.fig, chapters: own(m.id, i + 1, text) })
    })
  }
  for (const s of RECAP8.sections) {
    s.items.forEach((it, i) => {
      const text = recapText(it)
      book!.push({ source: { model: `${RECAP8.id}-${s.id}`, n: i + 1 }, where: `Recapitulare, ${s.title}, ex. ${i + 1}`, text, solution: recapAnswer(it), fig: it.fig, chapters: own(`${RECAP8.id}-${s.id}`, i + 1, text) })
    })
  }
  return book
}

export function chapterBookExercises(c: Chapter): BookExercise[] {
  return bookExercises().filter((b) => b.chapters.includes(c.id) && (c.id !== 'triangles' || fitsChapter(c, b.text)))
}
