// "Încă unul la fel": for an exercise from a book (a national evaluation model, a recap exercise), the generated kind
// and form that is most like it, so that a new exercise of the same sort can go on the sheet (asked for by the user
// on 13 November 2026). The likeness is that of the words: each form is described by a few of its statements, the
// words weighted by how rare they are (tf-idf), and compared by the cosine.
import { GENERATORS, LEVELS, type Level } from './generators'
import { seeded } from './tex'

/** Words that say nothing about the kind of exercise. */
const STOP = new Set(('care este sunt unei unui unor celor acestei acesta aceasta astfel încât dacă atunci știind că din pentru prin cele cel ale lui lor sau iar fie dintre după între numărul numerele număr egal egală egale cu de la în pe și se să nu are au fost este ' +
  'calculați aflați determinați arătați demonstrați figura alăturată reprezentat reprezentată valoarea rezultatul măsura lungimea').split(' '))

type Vec = Map<string, number>

function words(text: string): string[] {
  const out: string[] = []
  // the commands of the formulas say much: \sqrt, \frac, \perp, \cap, x^2
  for (const m of text.matchAll(/\\(sqrt|frac|perp|parallel|cap|cup|in|sphericalangle|angle|pi|sin|cos|operatorname|cases|le|ge|mid|overset)\b/g)) out.push('\\' + m[1])
  if (/\^2/.test(text)) out.push('^2')
  if (/\^3/.test(text)) out.push('^3')
  const plain = text.replace(/\$[^$]*\$/g, ' ').toLowerCase()
  for (const w of plain.match(/[a-zăâîșțţş]{3,}/g) ?? []) {
    if (STOP.has(w)) continue
    out.push(w.slice(0, 7)) // a rough stem: piramida, piramidei, piramidă → piramid
  }
  return out
}

/** The figures an exercise is about: a likeness of words alone would send a circle to the cylinders. */
const SOLIDS: [string, RegExp][] = [
  ['cub', /\bcub(?:ul|ului)?\b/], ['paralelipiped', /paralelipiped/], ['piramidă', /piramid/], ['tetraedru', /tetraedr/], ['prismă', /prism/],
  ['con', /\bcon(?:ul|ului)?\b/], ['cilindru', /cilindr/], ['sferă', /\bsfer/], ['trunchi', /trunchi/],
]
const FLAT: [string, RegExp][] = [
  ['cerc', /\bcerc/], ['triunghi', /triunghi/], ['trapez', /trapez/], ['romb', /\bromb/], ['paralelogram', /paralelogram/],
  ['dreptunghi', /dreptunghi(?!c)/], ['pătrat', /pătrat(?!ul unui număr)/], ['secantă', /secant/], ['unghi', /\bunghi/],
]
function shapes(text: string): { solid: Set<string>; flat: Set<string>; space: boolean } {
  const t = text.replace(/\$[^$]*\$/g, ' ').toLowerCase()
  const solid = new Set(SOLIDS.filter(([, r]) => r.test(t)).map(([k]) => k))
  // in space: a solid, or a plane figure with a perpendicular raised on its plane
  const space = solid.size > 0 || /\bplan(?:ul|ului|ele|e)\b|se ridică|exterior planului/.test(t)
  return { solid, flat: new Set(FLAT.filter(([, r]) => r.test(t)).map(([k]) => k)), space }
}
/** A form fits when it is in space exactly when the exercise is, and shares one of its figures. */
function fits(q: ReturnType<typeof shapes>, e: ReturnType<typeof shapes>): boolean {
  if (q.space !== e.space) return false
  if (q.solid.size) return [...q.solid].some((k) => e.solid.has(k))
  if (q.flat.size) return [...q.flat].some((k) => e.flat.has(k))
  return true
}

interface Entry { gen: string; level: Level; form: number; label: string; vec: Vec; shapes: ReturnType<typeof shapes> }
let index: { entries: Entry[]; idf: Map<string, number> } | null = null

function build() {
  const raw: { gen: string; level: Level; form: number; label: string; tf: Map<string, number>; shapes: ReturnType<typeof shapes> }[] = []
  for (const g of GENERATORS.filter((x) => x.grade >= 5 && x.grade <= 8)) {
    for (const level of [1, 2, 3] as Level[]) {
      for (let form = 0; form < g.forms(level); form++) {
        const tf = new Map<string, number>()
        const texts = [11, 23, 37].map((s) => g.make(seeded(s * 101 + form), level, form).text)
        for (const t of texts) for (const w of words(t)) tf.set(w, (tf.get(w) ?? 0) + 1)
        // the name of the kind counts too
        for (const w of words(g.label)) tf.set(w, (tf.get(w) ?? 0) + 2)
        raw.push({ gen: g.id, level, form, label: g.label, tf, shapes: shapes(texts.join(' ')) })
      }
    }
  }
  const df = new Map<string, number>()
  for (const r of raw) for (const w of r.tf.keys()) df.set(w, (df.get(w) ?? 0) + 1)
  const idf = new Map([...df].map(([w, n]) => [w, Math.log(raw.length / n)]))
  const entries = raw.map((r) => ({ ...r, vec: norm(new Map([...r.tf].map(([w, n]) => [w, (1 + Math.log(n)) * (idf.get(w) ?? 0)]))) }))
  return { entries, idf }
}

function norm(v: Vec): Vec {
  const len = Math.sqrt([...v.values()].reduce((s, x) => s + x * x, 0)) || 1
  return new Map([...v].map(([w, x]) => [w, x / len]))
}

export interface Match { gen: string; level: Level; form: number; label: string; score: number }

/** The generated forms most like this statement, best first (none when nothing is alike enough). */
export function similarForms(text: string, n = 3): Match[] {
  index ??= build()
  const tf = new Map<string, number>()
  for (const w of words(text)) tf.set(w, (tf.get(w) ?? 0) + 1)
  const q = norm(new Map([...tf].filter(([w]) => index!.idf.has(w)).map(([w, k]) => [w, (1 + Math.log(k)) * index!.idf.get(w)!])))
  const own = shapes(text)
  const scored = index.entries.filter((e) => fits(own, e.shapes)).map((e) => {
    let s = 0
    for (const [w, x] of q) s += x * (e.vec.get(w) ?? 0)
    return { gen: e.gen, level: e.level, form: e.form, label: e.label, score: s }
  })
  return scored.filter((m) => m.score >= 0.2).sort((a, b) => b.score - a.score).slice(0, n)
}

/** "Piramide regulate și tetraedru, nivelul mediu" */
export const matchName = (m: Match) => `${m.label}, nivelul ${LEVELS[m.level]}`
