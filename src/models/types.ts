// A national evaluation model (Evaluarea Națională, grade VIII), as in the book: 18 exercises, 6 in each of the
// three subjects. Subjects I and II: 5 points each, four answers to choose from (or true/false). Subject III: two
// parts, 2 and 3 points. 90 points, plus 10 given.
import type { Fig } from './figure'

export interface EnPart {
  /** the points of the part, 2 or 3 */
  pts: number
  text: string
  /** the result, from the answer key (barem) */
  ans?: string
}

export interface EnItem {
  /** the statement, markdown with $…$ */
  text: string
  /** subjects I and II: the answers to choose from, without the letters */
  choices?: string[]
  /** the right choice, 0 for a) */
  ans?: number
  /** subject III: a) and b) */
  parts?: EnPart[]
  /** a generated exercise: its worked solution, the key */
  sol?: string
  /** a generated exercise: its kind and level, so that "Încă unul la fel" puts another of the same kind in its place */
  gen?: { id: string; level: 1 | 2 | 3 | 4 }
  fig?: Fig
}

export interface EnModel {
  id: string
  title: string
  /** where it is from: the book and the pages */
  source: string
  items: EnItem[]
  /** written in the app by the user: the statements only, as pasted */
  own?: boolean
  /** where subjects II and III begin, when not at 6 and 12 (Perianu, Testul 6: the book prints only 5 exercises in
   * subject I) */
  starts?: [number, number]
  /** made by the app from its own kinds (`generated.ts`): written out, the key is the solutions */
  generated?: boolean
  /** where a model of a book comes from, shown under its name: "Perianu, testul 3" */
  origin?: string
}

export const SUBJECTS = [
  { title: 'Subiectul I', hint: 'Încercuiește litera corespunzătoare răspunsului corect.', from: 0 },
  { title: 'Subiectul II', hint: 'Încercuiește litera corespunzătoare răspunsului corect.', from: 6 },
  { title: 'Subiectul III', hint: 'Scrieți rezolvările complete.', from: 12 },
] as const

type Starts = readonly [number, number]
const STARTS: Starts = [6, 12]

/** 0, 1 or 2: the subject of the exercise at this place. */
export const subjectOf = (i: number, starts: Starts = STARTS) => (i < starts[0] ? 0 : i < starts[1] ? 1 : 2)

/** Whether a subject begins at this exercise. */
export const startsSubject = (i: number, starts: Starts = STARTS) => i === 0 || i === starts[0] || i === starts[1]

export const LETTERS = ['a', 'b', 'c', 'd']

/** The choices on one line, as in the book: a) 1   b) −16 … */
export const choicesText = (choices: string[]) => choices.map((c, i) => `${LETTERS[i]}) ${c}`).join('&emsp;&emsp;')

/** The exercise as one text: the statement, the choices, the parts. For a worksheet. */
export function itemText(item: EnItem): string {
  let out = item.text
  if (item.choices) out += '\n\n' + choicesText(item.choices)
  if (item.parts) out += (out ? '\n\n' : '') + item.parts.map((p, i) => `${LETTERS[i]}) ${p.text}`).join('\n\n')
  return out
}

/** The answer from the key, as one text, or '' when the book gives none. */
export function answerText(item: EnItem): string {
  if (item.choices && item.ans != null) return `Răspuns: ${LETTERS[item.ans]}) ${item.choices[item.ans]}`
  if (item.sol) return item.sol
  if (item.parts?.some((p) => p.ans)) return item.parts.map((p, i) => `${LETTERS[i]}) ${p.ans ?? '—'}`).join('\n\n')
  return ''
}
