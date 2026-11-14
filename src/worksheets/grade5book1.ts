// Grade V exercises after the workbook "Matematică, clasa a V-a, partea I" (Mate 2000+ Consolidare, Paralela 45),
// pages 5–43 as photographed on 13 November 2026: the review of grade IV, writing and reading natural numbers (with
// Roman numerals), the number line, comparing and rounding, addition and subtraction with their properties. The book
// marks its sections with stars (Înțelegere *, Aplicare și exersare **, Aprofundare și performanță ***, Supermate ****);
// the levels follow them, with Supermate at level 3. Each form takes a seeded random source and returns the statement,
// the worked solution in Romanian and a check of its arithmetic. `KINDS` is registered in `generators.ts`.
import type { Made } from './generators'
import { de, gcd, int, pick, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  /** 'v-…', unique */
  id: string
  /** Romanian, shown in the interface */
  label: string
  topic: 'Algebră' | 'Geometrie'
  /** level 1 easy, 2 medium, 3 hard */
  forms: Record<1 | 2 | 3, Form[]>
}

const lines = (...l: string[]) => l.filter(Boolean).join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** A number as the book writes it, with a thin space between the groups of three digits: 20\,347. */
const N = (x: number) => (Math.abs(x) >= 1000 ? String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(x))
/** The word "de" alone, for a number written inside a formula: "$120$ de lei". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
/** "$1\,278$ de lei", "$19$ lei" */
const qty = (n: number, noun: string) => `$${N(n)}$ ${deW(n)}${noun}`
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const ov = (s: string) => `\\overline{${s}}`
const range = (lo: number, hi: number) => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i)
const digitsOf = (n: number) => String(n).split('').map(Number)
const distinct = (n: number) => new Set(String(n)).size === String(n).length
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
/** c·v as the book writes it: "v", "3 \cdot v" */
const times = (c: number, v: string) => (c === 1 ? v : `${c} \\cdot ${v}`)
const GIRLS = ['Ana', 'Maria', 'Ioana', 'Elena', 'Irina', 'Daria', 'Sara', 'Bianca', 'Alexandra', 'Mihaela']
const BOYS = ['Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Matei', 'Luca', 'Costin', 'Paul']

// ---------- Roman numerals ----------

const ROMAN: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
function toRoman(n: number): string {
  let out = ''
  for (const [v, r] of ROMAN) while (n >= v) {
    out += r
    n -= v
  }
  return out
}
function fromRoman(s: string): number {
  const v: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let t = 0
  for (let i = 0; i < s.length; i++) t += v[s[i]] < (v[s[i + 1]] ?? 0) ? -v[s[i]] : v[s[i]]
  return t
}
/** One group per decimal place: 1957 → [1000, M], [900, CM], [50, L], [7, VII]. */
const romanParts = (n: number) => [1000, 100, 10, 1].map((p) => (Math.floor(n / p) % 10) * p).filter((v) => v > 0).map((v) => [v, toRoman(v)] as const)

// ================= the review of grade IV (pp. 5–14) =================

/** The unknown term after two operations, as in p. 6, ex. 18 c, d. */
export function recapUnknownTerm(rng: Rng): Made {
  const kind = int(rng, 0, 2)
  if (kind === 0) {
    const a = int(rng, 300, 999)
    const b = int(rng, 1000, 4999)
    const s = a + b
    const x = int(rng, 100, s - 100)
    const c = s - x
    return {
      text: `Determinați numărul natural $x$ din egalitatea $${N(a)} + ${N(b)} - x = ${N(c)}$.`,
      solution: lines(
        'Efectuăm întâi adunarea:',
        show(`${N(s)} - x = ${N(c)}`),
        'Scăzătorul este egal cu descăzutul minus diferența:',
        show(`x = ${N(s)} - ${N(c)} = ${N(x)}`),
      ),
      verify: () => a + b - x === c && x >= 0,
    }
  }
  if (kind === 1) {
    const a = int(rng, 100, 999)
    const b = int(rng, 1000, 4999)
    const c = int(rng, 50, 999)
    const x = c + b + a
    return {
      text: `Determinați numărul natural $x$ din egalitatea $x - ${N(a)} - ${N(b)} = ${N(c)}$.`,
      solution: lines(
        'Descăzutul este egal cu scăzătorul plus diferența; aplicăm regula de două ori:',
        show(`x - ${N(a)} = ${N(c)} + ${N(b)} = ${N(c + b)}`),
        show(`x = ${N(c + b)} + ${N(a)} = ${N(x)}`),
      ),
      verify: () => x - a - b === c,
    }
  }
  const a = int(rng, 1500, 9999)
  const b = int(rng, 100, a - 300)
  const s = a - b
  const x = int(rng, 50, s - 50)
  const c = s - x
  return {
    text: `Determinați numărul natural $x$ din egalitatea $${N(a)} - ${N(b)} - x = ${N(c)}$.`,
    solution: lines(
      'Efectuăm întâi prima scădere:',
      show(`${N(s)} - x = ${N(c)}`),
      'Scăzătorul este egal cu descăzutul minus diferența:',
      show(`x = ${N(s)} - ${N(c)} = ${N(x)}`),
    ),
    verify: () => a - b - x === c && x >= 0,
  }
}

/** The value of an expression with letters, as in p. 9, ex. 60. */
export function recapLetters(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 6, 20)
    const b = int(rng, 2, a - 1)
    const p = int(rng, 2, 5)
    const q = int(rng, 2, 5)
    const k = int(rng, 1, 9)
    const t = int(rng, 0, 2)
    const value = (x: number, y: number) => (t === 0 ? (p * x + q * y) * (x - y) : t === 1 ? (p * x - y) * (q * x + y) : (x + y) * (p * x + k - q * y))
    let expr: string
    let steps: string
    if (t === 0) {
      expr = `(${p} \\cdot a + ${q} \\cdot b) \\cdot (a - b)`
      steps = `(${p} \\cdot ${a} + ${q} \\cdot ${b}) \\cdot (${a} - ${b}) = (${p * a} + ${q * b}) \\cdot ${a - b} = ${p * a + q * b} \\cdot ${a - b} = ${N(value(a, b))}`
    } else if (t === 1) {
      expr = `(${p} \\cdot a - b) \\cdot (${q} \\cdot a + b)`
      steps = `(${p} \\cdot ${a} - ${b}) \\cdot (${q} \\cdot ${a} + ${b}) = (${p * a} - ${b}) \\cdot (${q * a} + ${b}) = ${p * a - b} \\cdot ${q * a + b} = ${N(value(a, b))}`
    } else {
      const m = p * a + k - q * b
      if (m < 2) continue
      expr = `(a + b) \\cdot (${p} \\cdot a + ${k} - ${q} \\cdot b)`
      steps = `(${a} + ${b}) \\cdot (${p} \\cdot ${a} + ${k} - ${q} \\cdot ${b}) = ${a + b} \\cdot (${p * a} + ${k} - ${q * b}) = ${a + b} \\cdot ${m} = ${N(value(a, b))}`
    }
    const r = value(a, b)
    return {
      text: `Știind că $a = ${a}$ și $b = ${b}$, calculați $${expr}$.`,
      solution: lines('Înlocuim literele cu valorile lor și respectăm ordinea efectuării operațiilor: întâi parantezele, în ele înmulțirile, apoi adunările și scăderile.', show(steps)),
      verify: () => r > 0 && Number.isInteger(r) && steps.endsWith(N(r)),
    }
  }
}

interface Special { text: string; len: 3 | 4; ok: (n: number) => boolean; max: boolean }
const same = (n: number) => new Set(String(n)).size === 1
const allDigits = (n: number, f: (d: number) => boolean) => digitsOf(n).every(f)
const SPECIAL: Special[] = [
  { text: 'cel mai mare număr de trei cifre distincte', len: 3, ok: distinct, max: true },
  { text: 'cel mai mic număr de trei cifre distincte', len: 3, ok: distinct, max: false },
  { text: 'cel mai mic număr impar de trei cifre identice', len: 3, ok: (n) => same(n) && n % 2 === 1, max: false },
  { text: 'cel mai mare număr par de trei cifre identice', len: 3, ok: (n) => same(n) && n % 2 === 0, max: true },
  { text: 'cel mai mic număr par de trei cifre distincte', len: 3, ok: (n) => distinct(n) && n % 2 === 0, max: false },
  { text: 'cel mai mare număr impar de trei cifre distincte', len: 3, ok: (n) => distinct(n) && n % 2 === 1, max: true },
  { text: 'cel mai mic număr de trei cifre impare distincte', len: 3, ok: (n) => distinct(n) && allDigits(n, (d) => d % 2 === 1), max: false },
  { text: 'cel mai mare număr de trei cifre pare distincte', len: 3, ok: (n) => distinct(n) && allDigits(n, (d) => d % 2 === 0), max: true },
  { text: 'cel mai mic număr de patru cifre distincte', len: 4, ok: distinct, max: false },
  { text: 'cel mai mare număr de patru cifre distincte', len: 4, ok: distinct, max: true },
  { text: 'cel mai mic număr par de patru cifre distincte', len: 4, ok: (n) => distinct(n) && n % 2 === 0, max: false },
  { text: 'cel mai mare număr impar de patru cifre distincte', len: 4, ok: (n) => distinct(n) && n % 2 === 1, max: true },
  { text: 'cel mai mic număr de patru cifre identice', len: 4, ok: same, max: false },
  { text: 'cel mai mare număr de patru cifre pare distincte', len: 4, ok: (n) => distinct(n) && allDigits(n, (d) => d % 2 === 0), max: true },
]
const extreme = (s: Special) => {
  const all = range(10 ** (s.len - 1), 10 ** s.len - 1).filter(s.ok)
  return s.max ? all[all.length - 1] : all[0]
}

/** The difference (or the sum) of two numbers described by their digits, as in p. 6, ex. 10. */
export function recapSpecialNumbers(rng: Rng): Made {
  for (;;) {
    const [s1, s2] = shuffle(rng, SPECIAL).slice(0, 2)
    let [v1, v2] = [extreme(s1), extreme(s2)]
    if (v1 === v2) continue
    let [d1, d2] = [s1, s2]
    if (v1 < v2) {
      ;[v1, v2] = [v2, v1]
      ;[d1, d2] = [d2, d1]
    }
    const add = rng() < 0.35
    const r = add ? v1 + v2 : v1 - v2
    return {
      text: `Calculați ${add ? 'suma' : 'diferența'} dintre ${d1.text} și ${d2.text}.`,
      solution: lines(
        `${cap(d1.text)} este $${N(v1)}$, iar ${d2.text} este $${N(v2)}$.`,
        show(`${N(v1)} ${add ? '+' : '-'} ${N(v2)} = ${N(r)}`),
      ),
      verify: () => d1.ok(v1) && d2.ok(v2) && r === (add ? v1 + v2 : v1 - v2) && (d1.max ? !range(v1 + 1, 10 ** d1.len - 1).some(d1.ok) : !range(10 ** (d1.len - 1), v1 - 1).some(d1.ok)),
    }
  }
}

/** The sum of two numbers after one is decreased and the other increased, as in p. 7, ex. 29. */
export function recapSumChange(rng: Rng): Made {
  const S = 10 * int(rng, 20, 300)
  const p = int(rng, 11, 99)
  const q = int(rng, 11, 99)
  const up1 = rng() < 0.4
  const up2 = rng() < 0.6
  const r = S + (up1 ? p : -p) + (up2 ? q : -q)
  const act1 = `${up1 ? 'mărim' : 'micșorăm'} primul număr cu ${p}`
  const act2 = `pe al doilea îl ${up2 ? 'mărim' : 'micșorăm'} cu ${q}`
  const s1 = up1 ? '+' : '-'
  const s2 = up2 ? '+' : '-'
  return {
    text: `Suma a două numere naturale este $${N(S)}$. Dacă ${act1}, iar ${act2}, calculați noua sumă.`,
    solution: lines(
      'Notăm numerele cu $a$ și $b$, deci $a + b = ' + N(S) + '$. Folosim asociativitatea și comutativitatea adunării:',
      show(`(a ${s1} ${p}) + (b ${s2} ${q}) = (a + b) ${s1} ${p} ${s2} ${q} = ${N(S)} ${s1} ${p} ${s2} ${q} = ${N(r)}`),
    ),
    verify: () => {
      const a = Math.floor(S / 2) + 7
      const b = S - a
      return (up1 ? a + p : a - p) + (up2 ? b + q : b - q) === r
    },
  }
}

/** Three children, the total and the sums of two pairs, as in p. 9, ex. 67. */
export function recapPairSums(rng: Rng): Made {
  const [A, B] = shuffle(rng, GIRLS).slice(0, 2)
  const C = pick(rng, BOYS)
  const a = int(rng, 10, 90)
  const b = int(rng, 10, 90)
  const c = int(rng, 10, 90)
  const T = a + b + c
  const p = a + b
  const q = b + c
  return {
    text: `${A}, ${B} și ${C} au împreună ${qty(T, 'lei')}. ${A} și ${B} au împreună ${qty(p, 'lei')}, iar ${B} și ${C} au împreună ${qty(q, 'lei')}. Câți lei are fiecare?`,
    solution: lines(
      `Din suma tuturor scădem ce au ${A} și ${B} împreună și aflăm ce are ${C}:`,
      show(`${T} - ${p} = ${c}\\text{ lei}`),
      `Din suma tuturor scădem ce au ${B} și ${C} împreună și aflăm ce are ${A}:`,
      show(`${T} - ${q} = ${a}\\text{ lei}`),
      `Atunci ${B} are $${p} - ${a} = ${b}$ ${deW(b)}lei.`,
      `Verificare: $${a} + ${b} + ${c} = ${T}$.`,
    ),
    verify: () => T - p === c && T - q === a && p - a === b && a + b + c === T,
  }
}

/** If one gives the other k lei they have the same amount, as in p. 8, ex. 44. */
export function recapGiveEqual(rng: Rng): Made {
  const G = pick(rng, GIRLS)
  const Bo = pick(rng, BOYS)
  const H = int(rng, 15, 250)
  const k = int(rng, 2, Math.floor(H / 2))
  const T = 2 * H
  const g = H - k
  const b = H + k
  return {
    text: `${G} și ${Bo} au economisit împreună ${qty(T, 'lei')}. Numărându-i, ${Bo} constată că, dacă i-ar da colegei sale ${G} ${qty(k, 'lei')}, cei doi ar avea sume egale. Ce sumă are fiecare?`,
    solution: lines(
      `După ce ${Bo} dă cei ${qty(k, 'lei')}, suma totală rămâne aceeași și se împarte în două părți egale:`,
      show(`${T} : 2 = ${H}\\text{ lei}`),
      `Înainte, ${G} avea cu ${qty(k, 'lei')} mai puțin, iar ${Bo} cu ${qty(k, 'lei')} mai mult:`,
      show(`${H} - ${k} = ${g}\\text{ lei}, \\qquad ${H} + ${k} = ${b}\\text{ lei}`),
      `Verificare: $${g} + ${b} = ${T}$ și $${b} - ${k} = ${g} + ${k} = ${H}$.`,
    ),
    verify: () => g + b === T && b - k === g + k && g > 0,
  }
}

/** The divisor, the quotient as a fraction of it and the remainder: the dividend minus the divisor, as in p. 8, ex. 54. */
export function recapDivisionRemainder(rng: Rng): Made {
  for (;;) {
    const [num, den] = pick(rng, [[2, 3], [1, 3], [3, 4], [1, 2], [2, 5], [3, 5], [1, 4]] as const)
    const d = den * int(rng, 2, 20)
    if (d < 12 || d > 90) continue
    const q = (d / den) * num
    const kind = int(rng, 0, 2)
    const r = kind === 0 ? 9 : kind === 1 ? 8 : d - 1
    const rText = kind === 0 ? 'cel mai mare număr de o cifră' : kind === 1 ? 'cel mai mare număr par de o cifră' : 'cel mai mare rest posibil'
    const D = d * q + r
    return {
      text: `Calculați diferența dintre deîmpărțit și împărțitor, știind că împărțitorul este ${d}, câtul reprezintă $\\frac{${num}}{${den}}$ din împărțitor, iar restul este ${rText}.`,
      solution: lines(
        'Câtul este:',
        show(num === 1 ? `${d} : ${den} = ${q}` : `${d} : ${den} \\cdot ${num} = ${d / den} \\cdot ${num} = ${q}`),
        kind === 2 ? `Restul este mai mic decât împărțitorul, deci cel mai mare rest posibil este $${d} - 1 = ${r}$.` : `Restul este ${r}, mai mic decât împărțitorul.`,
        'Din teorema împărțirii cu rest:',
        show(`D = ${d} \\cdot ${q} + ${r} = ${N(d * q)} + ${r} = ${N(D)}`),
        show(`D - ${d} = ${N(D)} - ${d} = ${N(D - d)}`),
      ),
      verify: () => Math.floor(D / d) === q && D % d === r && q * den === d * num,
    }
  }
}

const WORKS: [string, string, string][] = [
  ['muncitori', 'muncitor', 'sapă un șanț'],
  ['zugravi', 'zugrav', 'zugrăvește o școală'],
  ['muncitori', 'muncitor', 'repară o porțiune de drum'],
  ['grădinari', 'grădinar', 'plantează pomii unei livezi'],
  ['culegători', 'culegător', 'culege strugurii unei vii'],
]

/** Fewer or more workers, the same work: reducing to one worker, as in p. 8, ex. 43. */
export function recapWorkers(rng: Rng): Made {
  for (;;) {
    const [many, one, verb] = pick(rng, WORKS)
    const n1 = int(rng, 2, 12)
    const d1 = int(rng, 4, 30)
    const W = n1 * d1
    const options = range(2, 30).filter((n) => n !== n1 && W % n === 0 && W / n >= 2 && W / n !== d1)
    if (!options.length) continue
    const n2 = pick(rng, options)
    const d2 = W / n2
    return {
      text: `O echipă de ${de(n1)} ${many} ${verb} în ${de(d1)} zile. În câte zile ar face aceeași lucrare o echipă de ${de(n2)} ${many}, dacă fiecare lucrează la fel de repede?`,
      solution: lines(
        `Un singur ${one} ar face toată lucrarea de ${n1} ori mai încet:`,
        show(`${n1} \\cdot ${d1} = ${W}\\text{ zile}`),
        `${cap(de(n2))} ${many} o fac de ${n2} ori mai repede:`,
        show(`${W} : ${n2} = ${d2}\\text{ zile}`),
      ),
      verify: () => n1 * d1 === n2 * d2 && Number.isInteger(d2),
    }
  }
}

const FRUITS: [string, string][] = [['cireșe', 'caise'], ['mere', 'pere'], ['roșii', 'ardei'], ['prune', 'piersici'], ['nuci', 'alune'], ['căpșuni', 'banane']]

/** Two purchases whose quantities differ by one of each: their sum and their difference, as in the self test, p. 14, IV. */
export function recapTwoPrices(rng: Rng): Made {
  const [X, Y] = pick(rng, FRUITS)
  const r = int(rng, 2, 4)
  const s = int(rng, 2, 5)
  const [p, q] = [r + 1, s + 1]
  const c = int(rng, 4, 25)
  const f = int(rng, 4, 25)
  const P1 = p * c + q * f
  const P2 = r * c + s * f
  const who = pick(rng, ['bunica', 'mama', 'tata', 'bunicul'])
  return {
    text: lines(
      `Pentru ${p} kilograme de ${X} și ${q} kilograme de ${Y}, ${who} a plătit ${qty(P1, 'lei')}, iar pentru ${r} kilograme de ${X} și ${s} kilograme de ${Y} a plătit ${qty(P2, 'lei')}. Calculați cât costă:`,
      `a) ${p + r} kilograme de ${X} împreună cu ${q + s} kilograme de ${Y};`,
      `b) un kilogram de ${X} împreună cu un kilogram de ${Y}.`,
    ),
    solution: lines(
      'a) Punem cele două cumpărături la un loc:',
      show(`${p} + ${r} = ${p + r}\\text{ kg}, \\quad ${q} + ${s} = ${q + s}\\text{ kg}, \\quad ${P1} + ${P2} = ${P1 + P2}\\text{ lei}`),
      `b) Prima cumpărătură are cu un kilogram de ${X} și un kilogram de ${Y} mai mult decât a doua, deci acestea costă:`,
      show(`${P1} - ${P2} = ${P1 - P2}\\text{ lei}`),
    ),
    verify: () => (p + r) * c + (q + s) * f === P1 + P2 && c + f === P1 - P2,
  }
}

const SHELVES = [
  { place: 'Pe trei rafturi ale unei biblioteci', thing: 'cărți', one: 'raft', taken: 'luat', from: 'de pe', ask: 'Câte cărți erau la început pe fiecare raft?', left: 'pe cele trei rafturi a rămas același număr de cărți' },
  { place: 'În trei depozite', thing: 'saci de făină', one: 'depozit', taken: 'vândut', from: 'din', ask: 'Câți saci erau la început în fiecare depozit?', left: 'în cele trei depozite a rămas același număr de saci' },
  { place: 'În trei livezi', thing: 'pomi', one: 'livadă', taken: 'tăiat', from: 'din', ask: 'Câți pomi erau la început în fiecare livadă?', left: 'în cele trei livezi a rămas același număr de pomi' },
]

/** Three shelves, a different number taken from each, the same number left, as in the self test, p. 14, V. */
export function recapShelves(rng: Rng): Made {
  const ctx = pick(rng, SHELVES)
  const rem = int(rng, 100, 600)
  const [x1, x2, x3] = shuffle(rng, range(1, 40)).slice(0, 3).map((x) => 10 * x)
  const T = 3 * rem + x1 + x2 + x3
  const fem = ctx.one === 'livadă'
  const ord = fem ? ['prima', 'a doua', 'a treia'] : ['primul', 'al doilea', 'al treilea']
  const where = (i: number) => `${ctx.from} ${ord[i]} ${ctx.one}`
  return {
    text: `${ctx.place} sunt ${qty(T, ctx.thing)}. După ce s-au ${ctx.taken} ${x1} ${where(0)}, ${x2} ${where(1)} și ${x3} ${where(2)}, ${ctx.left}. ${ctx.ask}`,
    solution: lines(
      `În total s-au ${ctx.taken}:`,
      show(`${x1} + ${x2} + ${x3} = ${x1 + x2 + x3}`),
      'Au rămas:',
      show(`${N(T)} - ${x1 + x2 + x3} = ${N(T - x1 - x2 - x3)}`),
      `adică ${qty(rem, ctx.thing)} în fiecare, pentru că $${N(T - x1 - x2 - x3)} : 3 = ${rem}$. La început erau:`,
      show(`${rem} + ${x1} = ${rem + x1}, \\quad ${rem} + ${x2} = ${rem + x2}, \\quad ${rem} + ${x3} = ${rem + x3}`),
    ),
    verify: () => rem + x1 + rem + x2 + rem + x3 === T,
  }
}

/** Reading a part of the book, then a part of the rest, three times: backwards from the pages left, as in p. 9, ex. 68 and p. 8, ex. 48. */
export function recapReadingBackwards(rng: Rng): Made {
  for (;;) {
    const [k1, k2, k3] = [int(rng, 2, 5), int(rng, 2, 5), int(rng, 2, 5)]
    const P = k1 * k2 * k3
    const m = int(rng, 1, Math.floor(900 / P))
    const total = m * P
    const r1 = total - total / k1
    const r2 = r1 - r1 / k2
    const R = r2 - r2 / k3
    if (total < 60 || R < 2) continue
    const G = pick(rng, GIRLS)
    /** the whole from what is left: left : (k − 1) · k, or left · 2 for a half */
    const back = (left: number, k: number, whole: number) => (k === 2 ? `${left} \\cdot 2 = ${whole}\\text{ pagini}` : `${left} : ${k - 1} \\cdot ${k} = ${whole}\\text{ pagini}`)
    return {
      text: `${G} citește o carte. În prima zi citește $\\frac{1}{${k1}}$ din carte, a doua zi $\\frac{1}{${k2}}$ din ce i-a rămas, iar a treia zi $\\frac{1}{${k3}}$ din noul rest. După aceea mai are de citit ${qty(R, 'pagini')}. Câte pagini are cartea?`,
      solution: lines(
        'Mergem de la sfârșit spre început (metoda mersului invers).',
        `Înainte de a treia zi, restul avea ${k3} părți egale; ${G} a citit o parte, iar cele ${qty(R, 'pagini')} ${k3 === 2 ? 'sunt cealaltă parte' : `sunt celelalte ${k3 - 1}`}:`,
        show(back(R, k3, r2)),
        `Înainte de a doua zi, la fel, cele ${qty(r2, 'pagini')} reprezintă ${k2 - 1} din ${k2} părți egale:`,
        show(back(r2, k2, r1)),
        `Iar din cartea întreagă, cele ${qty(r1, 'pagini')} reprezintă ${k1 - 1} din ${k1} părți egale:`,
        show(back(r1, k1, total)),
      ),
      verify: () => {
        let left = total
        for (const k of [k1, k2, k3]) {
          if (left % k !== 0) return false
          left -= left / k
        }
        return left === R
      },
    }
  }
}

/** Three numbers: the first k times smaller than the second and m times larger than the third, as in p. 7, ex. 42. */
export function recapThreeRatio(rng: Rng): Made {
  const x = int(rng, 10, 900)
  const k1 = int(rng, 2, 5)
  const k2 = int(rng, 2, 5)
  const parts = 1 + k2 + k1 * k2
  const S = x * parts
  return {
    text: `Suma a trei numere naturale este $${N(S)}$. Primul număr este de ${k1} ori mai mic decât al doilea și de ${k2} ori mai mare decât al treilea. Aflați cele trei numere.`,
    solution: lines(
      `Reprezentăm al treilea număr printr-o parte. Primul este de ${k2} ori mai mare, deci are ${k2} părți, iar al doilea este de ${k1} ori mai mare decât primul, deci are $${k1} \\cdot ${k2} = ${k1 * k2}$ ${deW(k1 * k2)}părți. În total sunt $1 + ${k2} + ${k1 * k2} = ${parts}$ ${deW(parts)}părți egale.`,
      'O parte, adică al treilea număr, este:',
      show(`${N(S)} : ${parts} = ${x}`),
      'Primul și al doilea număr sunt:',
      show(`${k2} \\cdot ${x} = ${N(k2 * x)}, \\qquad ${k1} \\cdot ${N(k2 * x)} = ${N(k1 * k2 * x)}`),
    ),
    verify: () => x + k2 * x + k1 * k2 * x === S && (k1 * k2 * x) / k1 === k2 * x && (k2 * x) / k2 === x,
  }
}

// ================= writing and reading natural numbers (pp. 16–21) =================

const ORD_GEN = ['unităților', 'zecilor', 'sutelor', 'miilor', 'zecilor de mii', 'sutelor de mii']
const ORD_PL = ['unități', 'zeci', 'sute', 'mii', 'zeci de mii', 'sute de mii']

/** The digit of an order and how many units of that order a number has, as in p. 5, ex. 2 and p. 29, V.1. */
export function placeValue(rng: Rng): Made {
  const n = int(rng, 10000, 999999)
  const [k1, k2] = shuffle(rng, [1, 2, 3, 4]).slice(0, 2).sort((u, v) => u - v)
  const part = (k: number, tag: string) => {
    const p = 10 ** k
    const q = Math.floor(n / p)
    return {
      ask: `${tag}) Care este cifra ${ORD_GEN[k]} și câte ${ORD_PL[k]} are numărul?`,
      sol: lines(
        `${tag}) Cifra ${ORD_GEN[k]} este ${q % 10}. Numărul are ${qty(q, ORD_PL[k])}, pentru că:`,
        show(`${N(n)} = ${N(q)} \\cdot ${N(p)} + ${N(n % p)}`),
      ),
      ok: Math.floor(n / p) * p + (n % p) === n && Number(String(n).padStart(7, '0')[6 - k]) === q % 10,
    }
  }
  const [a, b] = [part(k1, 'a'), part(k2, 'b')]
  return {
    text: lines(`Se consideră numărul $${N(n)}$.`, a.ask, b.ask),
    solution: lines(a.sol, b.sol),
    verify: () => a.ok && b.ok,
  }
}

/** Arabic to Roman numerals, place by place, as in p. 19, ex. 12 and 15. */
export function toRomanNumerals(rng: Rng): Made {
  const ns = [int(rng, 14, 99), int(rng, 101, 999), int(rng, 1001, 3999)]
  const sol = ns.map((n) => {
    const parts = romanParts(n)
    return lines(
      show(`${N(n)} = ${parts.map(([v]) => N(v)).join(' + ')}, \\quad ${parts.map(([v, r]) => `${N(v)} = \\mathrm{${r}}`).join(', \\; ')}`),
      `deci $${N(n)} = \\mathrm{${toRoman(n)}}$.`,
    )
  })
  return {
    text: `Scrieți cu cifre romane numerele: ${ns[0]}, ${ns[1]} și $${N(ns[2])}$.`,
    solution: lines('Descompunem fiecare număr în mii, sute, zeci și unități și scriem fiecare parte cu cifre romane:', ...sol),
    verify: () => ns.every((n) => fromRoman(toRoman(n)) === n && romanParts(n).map(([, r]) => r).join('') === toRoman(n)),
  }
}

/** Roman to Arabic numerals, group by group, as in p. 19, ex. 13 and 16. */
export function fromRomanNumerals(rng: Rng): Made {
  const ns = shuffle(rng, [int(rng, 14, 99), int(rng, 101, 999), int(rng, 1001, 3999)])
  const sol = ns.map((n) => {
    const parts = romanParts(n)
    return show(`\\mathrm{${toRoman(n)}} = ${parts.map(([, r]) => `\\mathrm{${r}}`).join(' + ')} = ${parts.map(([v]) => N(v)).join(' + ')} = ${N(n)}`)
  })
  return {
    text: `Scrieți cu cifre arabe numerele: ${ns.map((n) => `$\\mathrm{${toRoman(n)}}$`).join('; ')}.`,
    solution: lines('Despărțim fiecare număr în grupuri pentru mii, sute, zeci și unități (o cifră mai mică scrisă în stânga uneia mai mari se scade din ea):', ...sol),
    verify: () => ns.every((n) => fromRoman(toRoman(n)) === n),
  }
}

const PATTERNS = ['abc', 'aab', 'abcd', 'a0b', 'ab0cd', 'aaaa', 'aab0c0', 'a0bb', 'abab', 'a00b']

/** A number and a number written with letters, decomposed in base 10, as in p. 19, ex. 6 and 7. */
export function decompose(rng: Rng): Made {
  const digits = [int(rng, 1, 9), ...Array.from({ length: 4 }, () => (rng() < 0.25 ? 0 : int(rng, 1, 9)))]
  const n = Number(digits.join(''))
  const pat = pick(rng, PATTERNS)
  const L = pat.length
  const termsA = digits.map((d, i) => [d, 10 ** (4 - i)] as const).filter(([d]) => d > 0).map(([d, p]) => (p === 1 ? `${d}` : `${d} \\cdot ${N(p)}`))
  const termsB = [...pat].map((ch, i) => [ch, 10 ** (L - 1 - i)] as const).filter(([ch]) => ch !== '0').map(([ch, p]) => (p === 1 ? ch : `${ch} \\cdot ${N(p)}`))
  const coef = new Map<string, number>()
  ;[...pat].forEach((ch, i) => {
    if (ch !== '0') coef.set(ch, (coef.get(ch) ?? 0) + 10 ** (L - 1 - i))
  })
  const combined = [...coef].map(([ch, c]) => (c === 1 ? ch : `${N(c)}${ch}`)).join(' + ')
  const repeated = [...pat].filter((ch) => ch !== '0').length > coef.size
  return {
    text: `Scrieți descompus în baza 10: a) numărul $${N(n)}$; b) numărul $${ov(pat)}$, unde literele reprezintă cifre.`,
    solution: lines(
      'Fiecare cifră se înmulțește cu valoarea locului pe care stă (unități, zeci, sute, …):',
      show(`\\text{a) } ${N(n)} = ${termsA.join(' + ')}`),
      show(`\\text{b) } ${ov(pat)} = ${termsB.join(' + ')}${repeated || termsB.length > 1 ? ` = ${combined}` : ''}`),
    ),
    verify: () => {
      const okA = digits.reduce((s, d, i) => s + d * 10 ** (4 - i), 0) === n
      const vals: Record<string, number> = { a: 7, b: 3, c: 5, d: 2 }
      const asNumber = Number([...pat].map((ch) => (ch === '0' ? '0' : vals[ch])).join(''))
      return okA && [...coef].reduce((s, [ch, c]) => s + c * vals[ch], 0) === asNumber
    },
  }
}

/** A digit from an equality with overlined numbers, as in p. 20, ex. 28–30. */
export function overlineEquation(rng: Rng): Made {
  const t = int(rng, 0, 4)
  const a = int(rng, 1, 9)
  if (t <= 2) {
    const [lhs, coefTex, k] = t === 0
      ? [`${ov('aa')} + a`, '11a + a', 12]
      : t === 1 ? [`${ov('aaa')} + ${ov('aa')} + a`, '111a + 11a + a', 123] : [`${ov('aaa')} - ${ov('aa')}`, '111a - 11a', 100]
    const R = k * a
    return {
      text: `Aflați cifra $a$, știind că $${lhs} = ${R}$.`,
      solution: lines(
        `Scriem numerele descompus: $${ov('aa')} = 10a + a = 11a$${t > 0 ? ` și $${ov('aaa')} = 100a + 10a + a = 111a$` : ''}. Egalitatea devine:`,
        show(`${coefTex} = ${R} \\Rightarrow ${k}a = ${R} \\Rightarrow a = ${R} : ${k} = ${a}`),
      ),
      verify: () => (t === 0 ? 11 * a + a : t === 1 ? 111 * a + 11 * a + a : 111 * a - 11 * a) === R,
    }
  }
  const p = int(rng, 1, 9)
  const q = int(rng, 0, 9)
  const x = int(rng, 0, 9)
  const val = 100 * p + 10 * x + q
  const form = ov(`${p}x${q}`)
  if (t === 3) {
    const K = int(rng, 100, 999)
    const R = val + K
    return {
      text: `Aflați cifra $x$, știind că $${form} + ${K} = ${N(R)}$.`,
      solution: lines(
        'Termenul necunoscut este egal cu suma minus termenul cunoscut:',
        show(`${form} = ${N(R)} - ${K} = ${val}`),
        `deci $x = ${x}$.`,
      ),
      verify: () => R - K === val && Math.floor(val / 10) % 10 === x,
    }
  }
  const k = int(rng, 2, 9)
  const R = val * k
  return {
    text: `Aflați cifra $x$, știind că $${form} \\cdot ${k} = ${N(R)}$.`,
    solution: lines(
      'Factorul necunoscut este egal cu produsul împărțit la factorul cunoscut:',
      show(`${form} = ${N(R)} : ${k} = ${val}`),
      `deci $x = ${x}$.`,
    ),
    verify: () => R / k === val && Math.floor(val / 10) % 10 === x,
  }
}

const PLACE_NAMES: Record<number, string[]> = { 3: ['sutelor', 'zecilor', 'unităților'], 4: ['miilor', 'sutelor', 'zecilor', 'unităților'] }

/** The smallest and the largest number with (distinct) digits and a given digit in a given place, as in p. 18, ex. 4. */
export function digitsSmallestLargest(rng: Rng): Made {
  for (;;) {
    const L = pick(rng, [3, 4] as const)
    const pos = int(rng, 0, L - 1)
    const d = int(rng, pos === 0 ? 1 : 0, 9)
    const dist = rng() < 0.7
    const greedy = (max: boolean) => {
      const used = new Set<number>(dist ? [d] : [])
      const out: number[] = []
      for (let i = 0; i < L; i++) {
        if (i === pos) {
          out.push(d)
          continue
        }
        const choices = range(i === 0 ? 1 : 0, 9).filter((c) => !used.has(c))
        const c = max ? choices[choices.length - 1] : choices[0]
        out.push(c)
        if (dist) used.add(c)
      }
      return Number(out.join(''))
    }
    const lo = greedy(false)
    const hi = greedy(true)
    if (lo === hi) continue
    const ok = (n: number) => String(n)[pos] === String(d) && (!dist || distinct(n))
    return {
      text: `Care este cel mai mic și care este cel mai mare număr natural de ${L === 3 ? 'trei' : 'patru'} cifre${dist ? ' distincte' : ''} care are cifra ${PLACE_NAMES[L][pos]} egală cu ${d}?`,
      solution: lines(
        `Pentru cel mai mic număr punem pe celelalte locuri, de la stânga la dreapta, cele mai mici cifre posibile (prima cifră nu poate fi 0${dist ? `, iar cifrele nu se repetă, deci nici ${d} nu mai poate fi folosită` : ''}):`,
        show(`${N(lo)}`),
        'Pentru cel mai mare număr punem pe celelalte locuri cele mai mari cifre posibile:',
        show(`${N(hi)}`),
      ),
      verify: () => {
        const all = range(10 ** (L - 1), 10 ** L - 1).filter(ok)
        return all[0] === lo && all[all.length - 1] === hi
      },
    }
  }
}

/** A pattern: digits and letters at random places. */
function makePattern(rng: Rng, letters: string[], L: number): string {
  const pos = shuffle(rng, range(0, L - 1)).slice(0, letters.length).sort((u, v) => u - v)
  const chars = Array.from({ length: L }, (_, i) => String(i === 0 ? int(rng, 1, 9) : int(rng, 0, 9)))
  pos.forEach((p, j) => {
    chars[p] = letters[j]
  })
  return chars.join('')
}
/** The numbers of a pattern like "1a7": letters are any digits (none 0 in front), the same letter the same digit. */
function matches(pat: string): number[] {
  const out: number[] = []
  for (let n = 10 ** (pat.length - 1); n < 10 ** pat.length; n++) {
    const s = String(n)
    const seen: Record<string, string> = {}
    let ok = true
    for (let i = 0; i < pat.length && ok; i++) {
      const ch = pat[i]
      if (/\d/.test(ch)) ok = s[i] === ch
      else if (seen[ch] !== undefined) ok = seen[ch] === s[i]
      else seen[ch] = s[i]
    }
    if (ok) out.push(n)
  }
  return out
}

/** How many numbers of a form with one letter, then with two letters, as in p. 20, ex. 37 and p. 31, II.3. */
export function countForms(rng: Rng): Made {
  const p1 = makePattern(rng, ['a'], int(rng, 3, 4))
  const p2 = makePattern(rng, ['a', 'b'], int(rng, 3, 4))
  const values = (pat: string, ch: string) => (pat[0] === ch ? 9 : 10)
  const range1 = (pat: string, ch: string) => (pat[0] === ch ? 'de la 1 la 9, fiind prima cifră' : 'de la 0 la 9')
  const c1 = values(p1, 'a')
  const [va, vb] = [values(p2, 'a'), values(p2, 'b')]
  const c2 = va * vb
  return {
    text: `Câte numere naturale de forma $${ov(p1)}$ există? Dar de forma $${ov(p2)}$?`,
    solution: lines(
      `Pentru $${ov(p1)}$: cifra $a$ poate lua ${c1} valori (${range1(p1, 'a')}), deci există ${qty(c1, 'numere')}.`,
      `Pentru $${ov(p2)}$: cifra $a$ poate lua ${va} valori (${range1(p2, 'a')}), iar cifra $b$ poate lua ${vb} valori (${range1(p2, 'b')}); cifrele $a$ și $b$ pot fi și egale. Fiecare valoare a lui $a$ se poate combina cu fiecare valoare a lui $b$:`,
      show(`${va} \\cdot ${vb} = ${c2}\\text{ numere}`),
    ),
    verify: () => matches(p1).length === c1 && matches(p2).length === c2,
  }
}

/** All the numbers of a form with two letters whose sum (or the sum of all the digits) is given, as in p. 21, ex. 43, 44. */
export function digitSumList(rng: Rng): Made {
  for (;;) {
    const start = int(rng, 0, 2)
    const chars = range(0, 3).map((i) => String(i === 0 ? int(rng, 1, 9) : int(rng, 0, 9)))
    chars[start] = 'a'
    chars[start + 1] = 'b'
    const pat = chars.join('')
    const fixed = chars.filter((c) => /\d/.test(c)).map(Number)
    const s = int(rng, 2, 16)
    const total = rng() < 0.5
    const T = s + sum(fixed)
    const found = matches(pat).filter((n) => sum(digitsOf(n)) === T)
    if (found.length < 2 || found.length > 9) continue
    const pairs = found.map((n) => `(${String(n)[start]}, ${String(n)[start + 1]})`)
    return {
      text: `Determinați toate numerele naturale de forma $${ov(pat)}$, astfel încât ${total ? `suma cifrelor să fie ${T}` : `$a + b = ${s}$`}.`,
      solution: lines(
        total ? `Suma cifrelor este $a + b + ${fixed.join(' + ')} = ${T}$, deci $a + b = ${s}$.` : `Căutăm cifrele $a$ și $b$ cu suma ${s}.`,
        `${start === 0 ? 'Cum $a \\ne 0$ (este prima cifră), p' : 'P'}erechile $(a, b)$ sunt: ${list(pairs)}. Numerele sunt:`,
        show(`${found.map(N).join(', \\; ')}`),
      ),
      verify: () => found.every((n) => sum(digitsOf(n)) - sum(fixed) === s) && found.length === matches(pat).filter((n) => sum(digitsOf(n)) === T).length,
    }
  }
}

/** ab = k(a + b) or ab = pa + qb: (10 − p)a = (q − 1)b, as in p. 20, ex. 23 and 32. */
export function abLinear(rng: Rng): Made {
  for (;;) {
    const useK = rng() < 0.5
    const p = useK ? int(rng, 2, 9) : int(rng, 1, 9)
    const q = useK ? p : int(rng, 2, 9)
    const u0 = 10 - p
    const v0 = q - 1
    const g = gcd(u0, v0)
    const [u, v] = [u0 / g, v0 / g]
    const sols = range(1, 9).filter((t) => v * t <= 9 && u * t <= 9).map((t) => 10 * v * t + u * t)
    if (!sols.length || sols.length > 6) continue
    const rhs = useK ? `${p} \\cdot (a + b)` : `${p === 1 ? '' : p}a + ${q}b`
    return {
      text: `Determinați numerele naturale de forma $${ov('ab')}$ pentru care $${ov('ab')} = ${rhs}$.`,
      solution: lines(
        'Scriem numărul descompus și aducem termenii asemenea în același membru:',
        show(`10a + b = ${p === 1 ? '' : p}a + ${q}b \\Rightarrow ${u0}a = ${v0}b`),
        g > 1 ? `Împărțim prin ${g}: $${u === 1 ? '' : u}a = ${v === 1 ? '' : v}b$.` : '',
        `Deci $a = ${v === 1 ? '' : v}t$ și $b = ${u === 1 ? '' : u}t$, cu $t$ natural nenul${v === 1 && u === 1 ? '' : ', iar $a$ și $b$ sunt cifre'}:`,
        show(`${ov('ab')} \\in \\{${sols.join(', ')}\\}`),
      ),
      verify: () => sols.every((n) => n === p * Math.floor(n / 10) + q * (n % 10)) && range(10, 99).filter((n) => n === p * Math.floor(n / 10) + q * (n % 10)).length === sols.length,
    }
  }
}

/** Consecutive numbers ab and ac (and ad) with a given sum, as in p. 20, ex. 31. */
export function consecutiveOverline(rng: Rng): Made {
  const three = rng() < 0.4
  const a = int(rng, 1, 9)
  const b = int(rng, 0, three ? 7 : 8)
  const ab = 10 * a + b
  const S = three ? 3 * ab + 3 : 2 * ab + 1
  const nums = three ? [ab, ab + 1, ab + 2] : [ab, ab + 1]
  return {
    text: three
      ? `Determinați numerele naturale consecutive $${ov('ab')}$, $${ov('ac')}$ și $${ov('ad')}$ pentru care $${ov('ab')} + ${ov('ac')} + ${ov('ad')} = ${S}$.`
      : `Determinați numerele naturale consecutive $${ov('ab')}$ și $${ov('ac')}$ pentru care $${ov('ab')} + ${ov('ac')} = ${S}$.`,
    solution: lines(
      three ? `Numerele fiind consecutive, $${ov('ac')} = ${ov('ab')} + 1$ și $${ov('ad')} = ${ov('ab')} + 2$:` : `Numerele fiind consecutive, $${ov('ac')} = ${ov('ab')} + 1$:`,
      three
        ? show(`3 \\cdot ${ov('ab')} + 3 = ${S} \\Rightarrow 3 \\cdot ${ov('ab')} = ${S - 3} \\Rightarrow ${ov('ab')} = ${ab}`)
        : show(`2 \\cdot ${ov('ab')} + 1 = ${S} \\Rightarrow 2 \\cdot ${ov('ab')} = ${S - 1} \\Rightarrow ${ov('ab')} = ${ab}`),
      `Numerele sunt ${list(nums)}.`,
    ),
    verify: () => sum(nums) === S && nums.every((n) => Math.floor(n / 10) === a),
  }
}

/** All the numbers whose digits satisfy conditions, as in p. 20, ex. 39–41. */
export function digitCondList(rng: Rng): Made {
  const t = int(rng, 0, 2)
  if (t === 0) {
    const m = int(rng, 3, 6)
    const found = range(100, 999).filter((n) => {
      const [x, y, z] = digitsOf(n)
      return distinct(n) && x + z === y && y <= m
    })
    const groups = range(1, m).map((y) => [y, found.filter((n) => digitsOf(n)[1] === y)] as const).filter(([, l]) => l.length)
    return {
      text: `Scrieți toate numerele naturale de forma $${ov('xyz')}$ cu $x$, $y$, $z$ cifre distincte, pentru care $x + z = y$ și $y \\le ${m}$.`,
      solution: lines(
        'Pentru fiecare valoare a lui $y$ căutăm $x \\ne 0$ și $z$ cu $x + z = y$, toate trei diferite (deci $x \\ne y$, adică $z \\ne 0$, și $x \\ne z$):',
        ...groups.map(([y, l]) => `$y = ${y}$: ${list(l)};`),
        `În total sunt ${qty(found.length, 'numere')}.`,
      ),
      verify: () => found.every((n) => digitsOf(n)[0] + digitsOf(n)[2] === digitsOf(n)[1]) && found.length === sum(groups.map(([, l]) => l.length)),
    }
  }
  if (t === 1) {
    const k = int(rng, 3, 6)
    const found = range(1000, 9999).filter((n) => {
      const [x, y, z, w] = digitsOf(n)
      return distinct(n) && x + y === k && z + w === k
    })
    const pairs = range(0, k).filter((x) => x !== k - x && x <= 9 && k - x <= 9).map((x) => `(${x}, ${k - x})`)
    return {
      text: `Scrieți toate numerele naturale de forma $${ov('xyzt')}$ pentru care $x + y = z + t = ${k}$, iar $x$, $y$, $z$, $t$ sunt cifre distincte.`,
      solution: lines(
        `Perechile ordonate de cifre diferite cu suma ${k} sunt: ${list(pairs)}. Pentru $(x, y)$ alegem o pereche cu $x \\ne 0$, iar pentru $(z, t)$ o pereche formată din alte două cifre:`,
        show(`${found.map(N).join(', \\; ')}`),
        `În total sunt ${qty(found.length, 'numere')}.`,
      ),
      verify: () => found.length > 0 && found.every((n) => distinct(n) && digitsOf(n)[0] + digitsOf(n)[1] === k),
    }
  }
  const m = int(rng, 6, 7)
  const found = range(1000, 9999).filter((n) => {
    const [x, y, z, w] = digitsOf(n)
    return distinct(n) && !String(n).includes('0') && x + y + z === w && w <= m
  })
  return {
    text: `Scrieți toate numerele naturale de forma $${ov('xyzt')}$ pentru care $x + y + z = t$, iar $x$, $y$, $z$, $t$ sunt cifre distincte, nenule, cu $t < ${m + 1}$.`,
    solution: lines(
      'Trei cifre nenule distincte au suma cel puțin $1 + 2 + 3 = 6$, deci $t \\ge 6$.',
      m === 6
        ? 'Rămâne $t = 6$, cu cifrele $x$, $y$, $z$ egale cu 1, 2, 3 în orice ordine:'
        : 'Pentru $t = 6$, cifrele $x$, $y$, $z$ sunt 1, 2, 3, iar pentru $t = 7$ sunt 1, 2, 4, în orice ordine:',
      show(`${found.map(N).join(', \\; ')}`),
      `În total sunt ${qty(found.length, 'numere')}.`,
    ),
    verify: () => found.length === (m === 6 ? 6 : 12),
  }
}

// ================= the number line, comparing, rounding (pp. 21–32) =================

const ROUND_TASKS = [
  { name: 'aproximarea prin lipsă la zeci', u: 10, how: 'down' },
  { name: 'aproximarea prin adaos la zeci', u: 10, how: 'up' },
  { name: 'rotunjirea la zeci', u: 10, how: 'round' },
  { name: 'aproximarea prin lipsă la sute', u: 100, how: 'down' },
  { name: 'aproximarea prin adaos la sute', u: 100, how: 'up' },
  { name: 'rotunjirea la sute', u: 100, how: 'round' },
  { name: 'aproximarea prin lipsă la mii', u: 1000, how: 'down' },
  { name: 'aproximarea prin adaos la mii', u: 1000, how: 'up' },
  { name: 'rotunjirea la mii', u: 1000, how: 'round' },
] as const
const UNIT_WORD: Record<number, [string, string]> = { 10: ['zeci', 'unităților'], 100: ['sute', 'zecilor'], 1000: ['mii', 'sutelor'] }
const approx = (n: number, u: number, how: 'down' | 'up' | 'round') =>
  how === 'down' ? Math.floor(n / u) * u : how === 'up' ? Math.ceil(n / u) * u : Math.floor((n + u / 2) / u) * u

/** Approximations by default and by excess, and roundings, of one number, as in p. 24, ex. 10. */
export function roundings(rng: Rng): Made {
  let n: number
  do n = int(rng, 10000, 99999)
  while (n % 10 === 0)
  const tasks = shuffle(rng, [...ROUND_TASKS]).slice(0, 3)
  const sols = tasks.map((t, i) => {
    const v = approx(n, t.u, t.how)
    const [w, below] = UNIT_WORD[t.u]
    const digit = Math.floor(n / (t.u / 10)) % 10
    const why = t.how === 'down'
      ? `cel mai mare număr format numai din ${w}, mai mic sau egal cu $${N(n)}$`
      : t.how === 'up'
        ? `cel mai mic număr format numai din ${w}, mai mare sau egal cu $${N(n)}$`
        : `cifra ${below} este ${digit}, deci ${digit >= 5 ? 'rotunjim prin adaos' : 'rotunjim prin lipsă'}`
    return { line: `${'abc'[i]}) ${cap(t.name)} este $${N(v)}$: ${why}.`, ok: v === approx(n, t.u, t.how) && v % t.u === 0 }
  })
  return {
    text: `Pentru numărul $${N(n)}$ scrieți: a) ${tasks[0].name}; b) ${tasks[1].name}; c) ${tasks[2].name}.`,
    solution: lines(...sols.map((s) => s.line)),
    verify: () => sols.every((s) => s.ok) && tasks.every((t) => {
      const v = approx(n, t.u, t.how)
      return t.how === 'down' ? v <= n && n - v < t.u : t.how === 'up' ? v >= n && v - n < t.u : Math.abs(v - n) <= t.u / 2
    }),
  }
}

/** The lengths of segments on the number line, and an expression with them, as in p. 25, ex. 36. */
export function axisLengths(rng: Rng): Made {
  for (;;) {
    const cs = shuffle(rng, range(1, 30)).slice(0, 4).sort((u, v) => u - v)
    const [m, n, p, q] = cs
    const MN = n - m
    const MP = p - m
    const NQ = q - n
    const MQ = q - m
    const NP = p - n
    const k = int(rng, 2, 3)
    const E = MQ + NP - k * MN
    if (E < 0) continue
    return {
      text: lines(
        `Pe o axă a numerelor, cu unitatea de măsură de 1 cm, se consideră punctele $M$, $N$, $P$, $Q$ de coordonate ${m}, ${n}, ${p}, respectiv ${q}.`,
        'a) Determinați lungimile segmentelor $MN$, $MP$, $NQ$ și $MQ$.',
        `b) Calculați $MQ + NP - ${k} \\cdot MN$.`,
      ),
      solution: lines(
        'a) Lungimea unui segment de pe axă este diferența dintre coordonata mai mare și cea mai mică a capetelor lui:',
        show(`MN = ${n} - ${m} = ${MN}\\text{ cm}, \\quad MP = ${p} - ${m} = ${MP}\\text{ cm}, \\quad NQ = ${q} - ${n} = ${NQ}\\text{ cm}, \\quad MQ = ${q} - ${m} = ${MQ}\\text{ cm}`),
        `b) $NP = ${p} - ${n} = ${NP}$ cm, deci:`,
        show(`MQ + NP - ${k} \\cdot MN = ${MQ} + ${NP} - ${k} \\cdot ${MN} = ${MQ + NP} - ${k * MN} = ${E}\\text{ cm}`),
      ),
      verify: () => MN + NP + (q - p) === MQ && E === MQ + NP - k * MN,
    }
  }
}

/** All three-digit numbers with distinct digits from three given digits, in order, as in p. 19, ex. 17 and p. 6, ex. 7. */
export function distinctDigitsOrder(rng: Rng): Made {
  const withZero = rng() < 0.35
  const ds = withZero ? [0, ...shuffle(rng, range(1, 9)).slice(0, 2)] : shuffle(rng, range(1, 9)).slice(0, 3)
  const shown = shuffle(rng, ds)
  const up = rng() < 0.5
  const all: number[] = []
  for (const a of ds) for (const b of ds) for (const c of ds) if (a !== 0 && a !== b && b !== c && a !== c) all.push(100 * a + 10 * b + c)
  all.sort((u, v) => (up ? u - v : v - u))
  return {
    text: `Scrieți toate numerele naturale de trei cifre distincte care se pot forma cu cifrele ${list(shown)}, apoi ordonați-le ${up ? 'crescător' : 'descrescător'}.`,
    solution: lines(
      withZero
        ? `Prima cifră nu poate fi 0, deci poate fi doar una dintre celelalte două cifre; pentru fiecare alegere, celelalte două cifre se pot așeza în 2 feluri. Obținem $2 \\cdot 2 = 4$ numere:`
        : 'Prima cifră se poate alege în 3 feluri, a doua în 2 feluri, iar a treia este cifra rămasă. Obținem $3 \\cdot 2 = 6$ numere:',
      show(all.join(up ? ' < ' : ' > ')),
    ),
    verify: () => all.length === (withZero ? 4 : 6) && all.every((n) => distinct(n) && digitsOf(n).every((d) => ds.includes(d))),
  }
}

/** How many numbers in an interval round to a given value, the smallest and the largest, as in p. 24, ex. 12. */
export function roundingRange(rng: Rng): Made {
  const u = pick(rng, [10, 100, 1000])
  const T = u * int(rng, Math.ceil(2000 / u), Math.floor(98000 / u))
  const L = T - int(rng, Math.ceil(u / 5), u - 1)
  const R = T + int(rng, Math.ceil(u / 5), u - 1)
  const lo = Math.max(L + 1, T - u / 2)
  const hi = Math.min(R - 1, T + u / 2 - 1)
  const cnt = hi - lo + 1
  const [w, below] = UNIT_WORD[u]
  return {
    text: `Câte numere naturale cuprinse între $${N(L)}$ și $${N(R)}$ au rotunjirea la ${w} egală cu $${N(T)}$? Scrieți cel mai mic și cel mai mare dintre ele.`,
    solution: lines(
      `Rotunjirea la ${w} este $${N(T)}$ pentru numerele de la $${N(T - u / 2)}$ (cifra ${below} 5, rotunjim prin adaos) până la $${N(T + u / 2 - 1)}$ (cifra ${below} 4, rotunjim prin lipsă).`,
      `Dintre acestea, sunt cuprinse între $${N(L)}$ și $${N(R)}$ numerele de la $${N(lo)}$ la $${N(hi)}$. Câte sunt:`,
      show(`${N(hi)} - ${N(lo)} + 1 = ${cnt}`),
      `Cel mai mic este $${N(lo)}$, iar cel mai mare este $${N(hi)}$.`,
    ),
    verify: () => {
      const ok = range(L + 1, R - 1).filter((n) => approx(n, u, 'round') === T)
      return ok.length === cnt && ok[0] === lo && ok[ok.length - 1] === hi
    },
  }
}

/** Where C can be on the number line, from where it lies among A and B, as in p. 25, ex. 38. */
export function axisBetween(rng: Rng): Made {
  const a = int(rng, 3, 9)
  const b = a + int(rng, 3, 8)
  const x1 = range(a + 1, b - 1)
  const x2 = range(0, a - 1)
  return {
    text: lines(
      `Punctele $A$, $B$ și $C$, reprezentate pe axa numerelor, corespund numerelor naturale ${a}, ${b}, respectiv $x$. Aflați valorile posibile ale lui $x$ dacă:`,
      'a) punctul $C$ este între $A$ și $B$;',
      'b) punctul $A$ este între $C$ și $B$.',
    ),
    solution: lines(
      `a) Pe axă, numerele mai mari sunt la dreapta. $C$ este între $A$ și $B$ dacă $${a} < x < ${b}$:`,
      show(`x \\in \\{${x1.join(', ')}\\}`),
      `b) $A$ este între $C$ și $B$, iar $B$ este la dreapta lui $A$, deci $C$ este la stânga lui $A$: $x < ${a}$, cu $x$ natural:`,
      show(`x \\in \\{${x2.join(', ')}\\}`),
    ),
    verify: () => x1.every((x) => a < x && x < b) && x2.every((x) => x < a && x >= 0) && x1.length === b - a - 1 && x2.length === a,
  }
}

/** The digits needed to number the pages of a book, as in p. 27, II.1. */
export function pagesDigits(rng: Rng): Made {
  const n = int(rng, 100, 999)
  const D = 9 + 180 + 3 * (n - 99)
  return {
    text: `Câte cifre se folosesc pentru numerotarea paginilor unei cărți cu ${qty(n, 'pagini')}?`,
    solution: lines(
      'Paginile de la 1 la 9 au câte o cifră: 9 cifre.',
      'Paginile de la 10 la 99 sunt $99 - 10 + 1 = 90$ de pagini, cu câte două cifre: $90 \\cdot 2 = 180$ de cifre.',
      `Paginile de la 100 la ${n} sunt $${n} - 100 + 1 = ${n - 99}$ ${deW(n - 99)}pagini, cu câte trei cifre: $${n - 99} \\cdot 3 = ${N(3 * (n - 99))}$ ${deW(3 * (n - 99))}cifre.`,
      show(`9 + 180 + ${N(3 * (n - 99))} = ${N(D)}\\text{ cifre}`),
    ),
    verify: () => range(1, n).map(String).join('').length === D,
  }
}

/** Five letters ordered from four inequalities, as in p. 24, ex. 13. */
export function orderLetters(rng: Rng): Made {
  const P = shuffle(rng, ['a', 'b', 'c', 'd', 'e'])
  const rels = shuffle(rng, range(0, 3).map((i) => (rng() < 0.5 ? `${P[i]} < ${P[i + 1]}` : `${P[i + 1]} > ${P[i]}`)))
  return {
    text: `Ordonați crescător numerele naturale $a$, $b$, $c$, $d$ și $e$, știind că ${list(rels.map((r) => `$${r}$`))}.`,
    solution: lines(
      'Scriem fiecare relație cu semnul „<” și le punem cap la cap, fiecare număr mai mic în stânga celui mai mare:',
      show(P.join(' < ')),
    ),
    verify: () => rels.every((r) => {
      const [u, op, v] = r.split(' ')
      return op === '<' ? P.indexOf(u) < P.indexOf(v) : P.indexOf(u) > P.indexOf(v)
    }),
  }
}

/** All the numbers from 1 to n written in a row: how many digits, which digit at a place, as in p. 26, ex. 41. */
export function digitPosition(rng: Rng): Made {
  const n = int(rng, 100, 400)
  const total = 9 + 180 + 3 * (n - 99)
  const k = int(rng, 10, total)
  const who = pick(rng, BOYS)
  let explain: string
  let digit: number
  if (k <= 189) {
    const m = k - 9
    const q = Math.floor(m / 2)
    const r = m % 2
    digit = r === 0 ? (9 + q) % 10 : Math.floor((10 + q) / 10)
    explain = lines(
      `Numerele de o cifră ocupă primele 9 locuri. Rămân $${k} - 9 = ${m}$ ${deW(m)}locuri printre numerele de două cifre, care au câte 2 cifre:`,
      show(`${m} = 2 \\cdot ${q} + ${r}`),
      r === 0
        ? `deci locul ${k} este ocupat de ultima cifră a numărului ${9 + q}: cifra ${digit}.`
        : q === 0 ? `deci locul ${k} este ocupat de prima cifră a numărului 10: cifra ${digit}.`
          : `Numerele de la 10 la ${9 + q} ocupă ${2 * q} dintre aceste locuri, iar locul ${k} este prima cifră a numărului ${10 + q}: cifra ${digit}.`,
    )
  } else {
    const m = k - 189
    const q = Math.floor(m / 3)
    const r = m % 3
    const num = r === 0 ? 99 + q : 100 + q
    digit = r === 0 ? num % 10 : Number(String(num)[r - 1])
    explain = lines(
      `Numerele de o cifră și de două cifre ocupă $9 + 180 = 189$ de locuri. Rămân $${k} - 189 = ${m}$ ${deW(m)}locuri printre numerele de trei cifre, care au câte 3 cifre:`,
      show(`${m} = 3 \\cdot ${q} + ${r}`),
      r === 0
        ? `deci locul ${k} este ocupat de ultima cifră a numărului ${num}: cifra ${digit}.`
        : `${q > 0 ? `Numerele de la 100 la ${99 + q} ocupă ${3 * q} dintre aceste locuri, iar l` : 'L'}ocul ${k} este ${r === 1 ? 'prima' : 'a doua'} cifră a numărului ${num}: cifra ${digit}.`,
    )
  }
  return {
    text: lines(
      `${who} scrie pe tablă, unul după altul, toate numerele naturale de la 1 la ${n}: $123456789101112\\ldots$`,
      'a) Câte cifre a scris?',
      `b) Ce cifră se află pe locul ${k}?`,
    ),
    solution: lines(
      `a) De la 1 la 9 sunt 9 cifre, de la 10 la 99 sunt $90 \\cdot 2 = 180$ de cifre, iar de la 100 la ${n} sunt $${n - 99} \\cdot 3 = ${N(3 * (n - 99))}$ ${deW(3 * (n - 99))}cifre. În total:`,
      show(`9 + 180 + ${N(3 * (n - 99))} = ${N(total)}\\text{ cifre}`),
      `b) ${explain}`,
    ),
    verify: () => {
      const s = range(1, n).map(String).join('')
      return s.length === total && Number(s[k - 1]) === digit
    },
  }
}

/** Put a digit between two digits of a number: the largest and the smallest, as in p. 25, ex. 35 and p. 24, ex. 18. */
export function insertDigit(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 100000, 999999)
    const d = int(rng, 0, 9)
    const s = String(n)
    const options = [...new Set(range(1, s.length - 1).map((i) => Number(s.slice(0, i) + d + s.slice(i))))]
    const hi = Math.max(...options)
    const lo = Math.min(...options)
    if (hi === lo || new Set(options).size < 4) continue
    return {
      text: lines(`Fie numărul $${N(n)}$. Plasați cifra ${d} între două cifre ale numărului pentru a obține:`, 'a) cel mai mare număr posibil;', 'b) cel mai mic număr posibil.'),
      solution: lines(
        `Cifra ${d} se poate pune în ${s.length - 1} locuri (între prima și a doua cifră, între a doua și a treia etc.). Obținem numerele${options.length < s.length - 1 ? ' (unele locuri dau același număr)' : ''}:`,
        show(options.map(N).join(', \\; ')),
        'Toate au același număr de cifre, deci le comparăm cifră cu cifră, de la stânga la dreapta.',
        `a) Cel mai mare este $${N(hi)}$.`,
        `b) Cel mai mic este $${N(lo)}$.`,
      ),
      verify: () => options.every((o) => o <= hi && o >= lo) && options.includes(hi) && options.includes(lo) && String(hi).length === 7,
    }
  }
}

/** The best digits to keep, in order, choosing each from a window (greedy). */
function keepDigits(ds: number[], keep: number, max: boolean): number {
  const out: number[] = []
  let start = 0
  for (let i = 0; i < keep; i++) {
    const end = ds.length - (keep - i)
    let best = -1
    for (let j = start; j <= end; j++) {
      if (!max && i === 0 && ds[j] === 0) continue
      if (best < 0 || (max ? ds[j] > ds[best] : ds[j] < ds[best])) best = j
    }
    out.push(ds[best])
    start = best + 1
  }
  return Number(out.join(''))
}

/** Delete two digits of an eight-digit number: the smallest and the largest number left, as in p. 26, ex. 44. */
export function deleteDigits(rng: Rng): Made {
  for (;;) {
    const ds = shuffle(rng, range(0, 9)).slice(0, 8)
    if (ds[0] === 0) continue
    const n = Number(ds.join(''))
    const hi = keepDigits(ds, 6, true)
    const lo = keepDigits(ds, 6, false)
    const gone = (m: number) => ds.filter((d) => !String(m).includes(String(d)))
    return {
      text: lines(`Ștergeți două cifre din numărul $${N(n)}$, astfel încât numărul care rămâne să fie:`, 'a) cel mai mic posibil;', 'b) cel mai mare posibil.'),
      solution: lines(
        'Rămân 6 cifre, în ordinea în care erau. Primul loc contează cel mai mult: prima cifră se alege dintre primele 3 cifre (după ea trebuie să mai rămână 5), apoi continuăm la fel cu locurile următoare.',
        `a) Alegem de fiecare dată cifra cea mai mică posibilă (prima nu poate fi 0): ștergem cifrele ${list(gone(lo))} și rămâne $${N(lo)}$.`,
        `b) Alegem de fiecare dată cifra cea mai mare posibilă: ștergem cifrele ${list(gone(hi))} și rămâne $${N(hi)}$.`,
      ),
      verify: () => {
        const s = String(n)
        const all: number[] = []
        for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
          const t = s.slice(0, i) + s.slice(i + 1, j) + s.slice(j + 1)
          if (t[0] !== '0') all.push(Number(t))
        }
        return Math.max(...all) === hi && Math.min(...all) === lo && gone(lo).length === 2 && gone(hi).length === 2
      },
    }
  }
}

/** Points between M and N on the number line, from lengths: coordinates and other lengths, as in p. 25, ex. 37. */
export function axisSegments(rng: Rng): Made {
  const m = int(rng, 1, 6)
  const p = int(rng, 1, 5)
  const q = int(rng, 2, 6)
  const g = int(rng, 1, 5)
  const r = int(rng, 1, 5)
  const A = m + p
  const B = A + q
  const C = B + g
  const n = C + r
  return {
    text: lines(
      `Pe o axă a numerelor cu originea $O$ și unitatea de măsură de 1 cm se consideră punctele $M$ și $N$, astfel încât $ON = ${n}$ cm, iar coordonata punctului $M$ este ${m}.`,
      `a) Determinați coordonatele punctelor $A$, $B$ și $C$, situate între $M$ și $N$ în această ordine, astfel încât $MA = ${p}$ cm, $AB = ${q}$ cm și $CN = ${r}$ cm.`,
      'b) Calculați lungimile segmentelor $MB$, $BC$, $AN$ și $MN$.',
    ),
    solution: lines(
      `a) $N$ este la ${n} cm de origine, deci are coordonata ${n}. Mergând spre dreapta de la $M$:`,
      show(`x_A = ${m} + ${p} = ${A}, \\quad x_B = ${A} + ${q} = ${B}, \\quad x_C = ${n} - ${r} = ${C}`),
      'b) Scădem coordonatele capetelor:',
      show(`MB = ${B} - ${m} = ${B - m}\\text{ cm}, \\quad BC = ${C} - ${B} = ${C - B}\\text{ cm}, \\quad AN = ${n} - ${A} = ${n - A}\\text{ cm}, \\quad MN = ${n} - ${m} = ${n - m}\\text{ cm}`),
    ),
    verify: () => m < A && A < B && B < C && C < n && (B - m) + (n - B) === n - m,
  }
}

// ================= addition and its properties (pp. 34–39) =================

/** Four or five terms, two pairs of which make round numbers, as in p. 37, ex. 4 and 10. */
export function addGrouping(rng: Rng): Made {
  const pair = (unit: number, maxK: number) => {
    const t = unit * int(rng, 1, maxK)
    let x: number
    do x = int(rng, 11, t - 11)
    while (x % 10 === 0)
    return [x, t - x, t] as const
  }
  const [x1, y1, t1] = pair(100, 5)
  const [x2, y2, t2] = pair(1000, 4)
  const extra = rng() < 0.4 ? int(rng, 11, 999) : 0
  const order = pick(rng, [[x1, x2, y1, y2], [x1, x2, y2, y1], [x2, x1, y1, y2], [x2, x1, y2, y1], [x1, y2, x2, y1]])
  const terms = extra ? [...order.slice(0, 2), extra, ...order.slice(2)] : order
  const total = t1 + t2 + extra
  return {
    text: `Calculați, folosind proprietățile adunării: $${terms.map(N).join(' + ')}$.`,
    solution: lines(
      'Schimbăm ordinea termenilor (comutativitatea) și îi grupăm (asociativitatea) astfel încât să obținem numere rotunde:',
      show(`(${x1} + ${y1}) + (${N(x2)} + ${N(y2)})${extra ? ` + ${extra}` : ''} = ${t1} + ${N(t2)}${extra ? ` + ${extra}` : ''} = ${N(total)}`),
    ),
    verify: () => sum(terms) === total && t1 % 100 === 0 && t2 % 1000 === 0,
  }
}

/** 1 + 2 + … + n, Gauss's sum, as in p. 38, ex. 15 a. */
export function gaussSum(rng: Rng): Made {
  const n = int(rng, 20, 300)
  const S = (n * (n + 1)) / 2
  return {
    text: `Calculați suma $S = 1 + 2 + 3 + \\ldots + ${n}$.`,
    solution: lines(
      'Folosim suma lui Gauss, $1 + 2 + \\ldots + n = [n \\cdot (n + 1)] : 2$:',
      show(`S = [${n} \\cdot (${n} + 1)] : 2 = (${n} \\cdot ${n + 1}) : 2 = ${N(n * (n + 1))} : 2 = ${N(S)}`),
    ),
    verify: () => sum(range(1, n)) === S,
  }
}

/** From a + b, sums of a and b each increased, as in p. 36, Problema 2 a and p. 38, ex. 20. */
export function sumShift(rng: Rng): Made {
  const S = int(rng, 15, 300)
  const [p, q, r, s, t] = [int(rng, 1, 30), int(rng, 1, 30), int(rng, 1, 30), int(rng, 1, 30), int(rng, 2, 40)]
  const x = S + p + q
  const y = S + r + s + t
  return {
    text: lines(`Numerele naturale $a$ și $b$ verifică relația $a + b = ${S}$. Calculați:`, `a) $x = (a + ${p}) + (b + ${q})$;`, `b) $y = (b + ${r}) + (${s} + a) + ${t}$.`),
    solution: lines(
      'Folosim proprietățile adunării ca să grupăm $a$ cu $b$:',
      show(`\\text{a) } x = (a + b) + (${p} + ${q}) = ${S} + ${p + q} = ${x}`),
      show(`\\text{b) } y = (a + b) + (${r} + ${s} + ${t}) = ${S} + ${r + s + t} = ${y}`),
    ),
    verify: () => {
      const a = Math.floor(S / 3)
      const b = S - a
      return a + p + (b + q) === x && b + r + (s + a) + t === y
    },
  }
}

/** a + (a + r) + … + L with a < r: count the terms, then Gauss, as in p. 38, ex. 15 d. */
export function stepSum(rng: Rng): Made {
  const r = int(rng, 3, 9)
  const a = int(rng, 1, r - 1)
  const n = int(rng, 10, 60)
  const L = a + (n - 1) * r
  const S = ((a + L) * n) / 2
  return {
    text: `Calculați suma $S = ${a} + ${a + r} + ${a + 2 * r} + ${a + 3 * r} + \\ldots + ${L}$.`,
    solution: lines(
      `Termenii cresc din ${r} în ${r}. Numărul termenilor este:`,
      show(`(${L} - ${a}) : ${r} + 1 = ${L - a} : ${r} + 1 = ${n}`),
      'Ca la suma lui Gauss, scriem suma și invers și adunăm termen cu termen: fiecare pereche are suma egală cu primul plus ultimul termen:',
      show(`2S = ${n} \\cdot (${a} + ${L}) \\Rightarrow S = ${n} \\cdot ${a + L} : 2 = ${N(S)}`),
    ),
    verify: () => sum(range(0, n - 1).map((i) => a + i * r)) === S,
  }
}

/** k + 2k + … + nk: k as a common factor, then Gauss, as in p. 38, ex. 16 a–d. */
export function multiplesSum(rng: Rng): Made {
  const k = int(rng, 3, 9)
  const n = int(rng, 20, 300)
  const G = (n * (n + 1)) / 2
  const S = k * G
  return {
    text: `Calculați suma $S = ${k} + ${2 * k} + ${3 * k} + \\ldots + ${N(k * n)}$.`,
    solution: lines(
      `Toți termenii sunt multipli de ${k}; dăm factor comun pe ${k}:`,
      show(`S = ${k} \\cdot (1 + 2 + 3 + \\ldots + ${n}) = ${k} \\cdot [${n} \\cdot ${n + 1} : 2] = ${k} \\cdot ${N(G)} = ${N(S)}`),
    ),
    verify: () => sum(range(1, n).map((i) => i * k)) === S,
  }
}

/** a + b and b + c known: αa + (α + γ)b + γc, as in p. 9, ex. 65. */
export function combineSums(rng: Rng): Made {
  const p = int(rng, 10, 99)
  const q = int(rng, 10, 99)
  const al = int(rng, 1, 7)
  let ga: number
  do ga = int(rng, 2, 7)
  while (ga === al)
  const r = al * p + ga * q
  const expr = `${times(al, 'a')} + ${times(al + ga, 'b')} + ${times(ga, 'c')}`
  return {
    text: `Știind că $a + b = ${p}$ și $b + c = ${q}$, calculați $${expr}$.`,
    solution: lines(
      `Despărțim termenul cu $b$: $${times(al + ga, 'b')} = ${times(al, 'b')} + ${times(ga, 'b')}$, apoi dăm factor comun:`,
      show(`${expr} = ${al === 1 ? '(a + b)' : `${al} \\cdot (a + b)`} + ${ga} \\cdot (b + c) = ${al === 1 ? p : `${al} \\cdot ${p}`} + ${ga} \\cdot ${q} = ${al * p} + ${ga * q} = ${r}`),
    ),
    verify: () => {
      const b = Math.floor(Math.min(p, q) / 2)
      const [a, c] = [p - b, q - b]
      return al * a + (al + ga) * b + ga * c === r
    },
  }
}

/** a + b and a + kb known: their sum, then a and b, as in p. 36, Problema 2 b. */
export function addEqualities(rng: Rng): Made {
  const a = int(rng, 5, 60)
  const b = int(rng, 3, 40)
  const k = int(rng, 2, 4)
  const p = a + b
  const q = a + k * b
  return {
    text: lines(
      `Numerele naturale $a$ și $b$ verifică relațiile $a + b = ${p}$ și $a + ${k} \\cdot b = ${q}$.`,
      `a) Calculați $2 \\cdot a + ${k + 1} \\cdot b$.`,
      'b) Aflați numerele $a$ și $b$.',
    ),
    solution: lines(
      'a) Adunăm membru cu membru cele două egalități:',
      show(`(a + b) + (a + ${k} \\cdot b) = ${p} + ${q} \\Rightarrow 2 \\cdot a + ${k + 1} \\cdot b = ${p + q}`),
      `b) A doua sumă are în plus ${k === 2 ? 'încă un $b$' : `$${k - 1} \\cdot b$`} față de prima:`,
      show(`${k === 2 ? 'b' : `${k - 1} \\cdot b`} = ${q} - ${p} = ${q - p}${k === 2 ? '' : ` \\Rightarrow b = ${q - p} : ${k - 1} = ${b}`}, \\qquad a = ${p} - ${b} = ${a}`),
    ),
    verify: () => 2 * a + (k + 1) * b === p + q && (q - p) / (k - 1) === b,
  }
}

/** The term at a place and the place of a term, in a sequence growing by r, as in p. 21, ex. 46 and 48. */
export function sequenceRank(rng: Rng): Made {
  const a = int(rng, 1, 9)
  const r = int(rng, 3, 9)
  const m = int(rng, 15, 120)
  const t = int(rng, 150, 2000)
  const T = a + (t - 1) * r
  const am = a + (m - 1) * r
  return {
    text: lines(
      `Se consideră șirul de numere naturale ${a}, ${a + r}, ${a + 2 * r}, ${a + 3 * r}, …`,
      `a) Determinați termenul de pe locul ${m}.`,
      `b) Al câtelea termen al șirului este numărul $${N(T)}$?`,
    ),
    solution: lines(
      `Fiecare termen se obține din precedentul adunând ${r}. Termenul de pe locul $n$ este ${a} plus de $(n - 1)$ ori ${r}.`,
      show(`\\text{a) } ${a} + (${m} - 1) \\cdot ${r} = ${a} + ${(m - 1) * r} = ${N(am)}`),
      show(`\\text{b) } (${N(T)} - ${a}) : ${r} + 1 = ${N(T - a)} : ${r} + 1 = ${N(t - 1)} + 1 = ${N(t)}`),
      `deci $${N(T)}$ este al ${t}-lea termen.`,
    ),
    verify: () => (T - a) % r === 0 && (T - a) / r + 1 === t && am === a + (m - 1) * r,
  }
}

/** A sequence growing by r: the next terms, a term far away and the sum of the first n, as in p. 39, ex. 23. */
export function sequenceSumFirst(rng: Rng): Made {
  const a = int(rng, 1, 9)
  const r = int(rng, 3, 9)
  const m = int(rng, 20, 99)
  const n = int(rng, 10, 40)
  const next = [a + 4 * r, a + 5 * r, a + 6 * r]
  const am = a + (m - 1) * r
  const an = a + (n - 1) * r
  const S = ((a + an) * n) / 2
  return {
    text: lines(
      `Fie șirul de numere ${a}, ${a + r}, ${a + 2 * r}, ${a + 3 * r}, …`,
      'a) Completați șirul cu încă trei termeni.',
      `b) Aflați termenul de pe locul ${m}.`,
      `c) Calculați suma primilor ${de(n)} termeni.`,
    ),
    solution: lines(
      `a) Termenii cresc din ${r} în ${r}: ${list(next)}.`,
      `b) Până la locul ${m} adunăm de ${de(m - 1)} ori numărul ${r}:`,
      show(`${a} + ${m - 1} \\cdot ${r} = ${a} + ${(m - 1) * r} = ${am}`),
      `c) Termenul de pe locul ${n} este $${a} + ${n - 1} \\cdot ${r} = ${an}$. Adunând suma cu ea însăși scrisă invers, fiecare pereche dă $${a} + ${an} = ${a + an}$:`,
      show(`S = ${n} \\cdot ${a + an} : 2 = ${N(S)}`),
    ),
    verify: () => sum(range(0, n - 1).map((i) => a + i * r)) === S && am === a + (m - 1) * r,
  }
}

/** m + (m + 1) + … + n as a difference of two Gauss sums, as in p. 35, Problema 3 b and p. 38, ex. 16 e, f. */
export function rangeSum(rng: Rng): Made {
  const m = int(rng, 21, 600)
  const n = m + int(rng, 20, 600)
  const G1 = (n * (n + 1)) / 2
  const G0 = ((m - 1) * m) / 2
  const S = G1 - G0
  return {
    text: `Calculați suma $S = ${m} + ${m + 1} + ${m + 2} + \\ldots + ${N(n)}$.`,
    solution: lines(
      `Din suma tuturor numerelor de la 1 la ${N(n)} scădem suma celor de la 1 la ${m - 1}:`,
      show(`S = (1 + 2 + \\ldots + ${N(n)}) - (1 + 2 + \\ldots + ${m - 1}) = ${N(n)} \\cdot ${N(n + 1)} : 2 - ${m - 1} \\cdot ${m} : 2`),
      show(`S = ${N(G1)} - ${N(G0)} = ${N(S)}`),
    ),
    verify: () => sum(range(m, n)) === S,
  }
}

/** An odd number of consecutive numbers with a given middle: the first, the last, the sum, as in p. 39, ex. 26. */
export function consecutiveMiddle(rng: Rng): Made {
  const h = int(rng, 50, 1500)
  const c = 2 * h + 1
  const M = int(rng, h, h + 3000)
  return {
    text: `Avem un șir de ${qty(c, 'numere')} naturale consecutive. Știind că numărul din mijloc este $${N(M)}$, calculați primul număr, ultimul număr și suma termenilor șirului.`,
    solution: lines(
      'De o parte și de alta a numărului din mijloc se află câte:',
      show(`(${N(c)} - 1) : 2 = ${N(h)}\\text{ numere}`),
      show(`\\text{primul: } ${N(M)} - ${N(h)} = ${N(M - h)}, \\qquad \\text{ultimul: } ${N(M)} + ${N(h)} = ${N(M + h)}`),
      `Termenii egal depărtați de mijloc au suma $2 \\cdot ${N(M)}$; grupându-i câte doi, suma este ca și cum toți cei ${qty(c, 'termeni')} ar fi egali cu $${N(M)}$:`,
      show(`S = ${N(c)} \\cdot ${N(M)} = ${N(c * M)}`),
    ),
    verify: () => sum(range(M - h, M + h)) === c * M,
  }
}

/** True or false: the sum of k even (odd) numbers is even (odd), as in p. 38, ex. 21. */
export function parityTruth(rng: Rng): Made {
  const ks = shuffle(rng, range(3, 15)).slice(0, 3)
  const st = ks.map((k) => ({ k, odd: rng() < 0.7, claimOdd: rng() < 0.5 }))
  const sumOdd = (s: { k: number; odd: boolean }) => s.odd && s.k % 2 === 1
  const names = ['p', 'q', 'r']
  return {
    text: lines('Stabiliți valoarea de adevăr a propozițiilor:', ...st.map((s, i) => `$${names[i]}$: „Suma a ${s.k} numere ${s.odd ? 'impare' : 'pare'} este un număr ${s.claimOdd ? 'impar' : 'par'}.”`)),
    solution: lines(
      'Suma a două numere de aceeași paritate este pară, deci numerele impare se pot grupa câte două în perechi cu suma pară.',
      ...st.map((s, i) => {
        const truth = s.claimOdd === sumOdd(s)
        const why = !s.odd
          ? 'suma oricâtor numere pare este pară'
          : s.k % 2 === 0
            ? `cele ${s.k} numere impare formează ${s.k / 2} perechi, deci suma este pară`
            : `cele ${s.k} numere impare formează ${(s.k - 1) / 2} perechi și rămâne un număr impar, deci suma este impară`
        return `$${names[i]}$: ${why}; propoziția este ${truth ? 'adevărată' : 'falsă'}.`
      }),
    ),
    verify: () => st.every((s) => (sum(range(1, s.k).map(() => (s.odd ? 1 : 2))) % 2 === 1) === sumOdd(s)),
  }
}

// ================= subtraction (pp. 39–42) =================

/** The subtrahend from the minuend and the difference, and the minuend from the other two, as in p. 41, ex. 5. */
export function subtractFindTerm(rng: Rng): Made {
  const D = int(rng, 3000, 99999)
  const d = int(rng, 100, D - 100)
  const s = D - d
  const s2 = int(rng, 1000, 50000)
  const d2 = int(rng, 1000, 50000)
  const D2 = s2 + d2
  return {
    text: lines(
      `a) Descăzutul este $${N(D)}$, iar diferența este $${N(d)}$. Care este scăzătorul?`,
      `b) Scăzătorul este $${N(s2)}$, iar diferența este $${N(d2)}$. Care este descăzutul?`,
    ),
    solution: lines(
      'a) Scăzătorul este egal cu descăzutul minus diferența:',
      show(`${N(D)} - ${N(d)} = ${N(s)}`),
      'b) Descăzutul este egal cu scăzătorul plus diferența:',
      show(`${N(s2)} + ${N(d2)} = ${N(D2)}`),
    ),
    verify: () => D - s === d && D2 - s2 === d2,
  }
}

/** True or false: how brackets are removed after a plus or a minus, as in p. 41, ex. 3. */
export function bracketTruth(rng: Rng): Made {
  const kinds = shuffle(rng, [0, 1, 2])
  const st = kinds.map((k) => {
    const a = int(rng, 800, 999)
    const b = int(rng, 100, 399)
    const c = int(rng, 10, b - 10)
    const right = rng() < 0.5
    const lhs = k === 0 ? `${a} + (${b} - ${c})` : k === 1 ? `${a} - (${b} + ${c})` : `${a} - (${b} - ${c})`
    const vl = k === 0 ? a + (b - c) : k === 1 ? a - (b + c) : a - (b - c)
    const signs = k === 0 ? (right ? ['+', '-'] : ['+', '+']) : k === 1 ? (right ? ['-', '-'] : ['-', '+']) : right ? ['-', '+'] : ['-', '-']
    const rhs = `${a} ${signs[0]} ${b} ${signs[1]} ${c}`
    const vr = (signs[0] === '+' ? a + b : a - b) + (signs[1] === '+' ? c : -c)
    return { lhs, rhs, vl, vr, right }
  })
  const names = ['p', 'q', 'r']
  return {
    text: lines('Aflați valoarea de adevăr a fiecăreia dintre următoarele propoziții:', ...st.map((s, i) => `$${names[i]}$: „$${s.lhs} = ${s.rhs}$.”`)),
    solution: lines(
      'O paranteză precedată de „+” se poate scoate fără să schimbăm semnele din ea; una precedată de „−” se scoate schimbând semnele din ea. Verificăm și prin calcul:',
      ...st.map((s, i) => `$${names[i]}$: $${s.lhs} = ${N(s.vl)}$, iar $${s.rhs} = ${N(s.vr)}$; propoziția este ${s.vl === s.vr ? 'adevărată' : 'falsă'}.`),
    ),
    verify: () => st.every((s) => (s.vl === s.vr) === s.right),
  }
}

/** Compare two expressions with the same numbers and different brackets, as in p. 41, ex. 7 and 8. */
export function compareExpressions(rng: Rng): Made {
  const A = int(rng, 400, 999)
  const B = int(rng, 100, A - 60)
  const C = int(rng, 10, Math.min(B - 10, A - B - 10))
  const types = shuffle(rng, [0, 1, 2, 3]).slice(0, 2)
  const ex = (t: number) =>
    t === 0
      ? { tex: `${A} - (${B} - ${C})`, step: `${A} - ${B - C}`, v: A - (B - C) }
      : t === 1 ? { tex: `(${A} - ${B}) - ${C}`, step: `${A - B} - ${C}`, v: A - B - C }
        : t === 2 ? { tex: `${A} - (${B} + ${C})`, step: `${A} - ${B + C}`, v: A - (B + C) } : { tex: `(${A} - ${B}) + ${C}`, step: `${A - B} + ${C}`, v: A - B + C }
  const [x, y] = types.map(ex)
  const rel = x.v < y.v ? '<' : x.v > y.v ? '>' : '='
  return {
    text: `Comparați numerele $x$ și $y$, unde $x = ${x.tex}$ și $y = ${y.tex}$.`,
    solution: lines(
      'Efectuăm întâi calculele din paranteze:',
      show(`x = ${x.tex} = ${x.step} = ${x.v}, \\qquad y = ${y.tex} = ${y.step} = ${y.v}`),
      `deci $x ${rel} y$.`,
    ),
    verify: () => [x, y].every((e) => e.v >= 0) && (rel === '=' ? x.v === y.v : rel === '<' ? x.v < y.v : x.v > y.v),
  }
}

/** a + c and b + d known: a + b + c + d and a − b + c − d, as in p. 41, ex. 10. */
export function sumsCombine(rng: Rng): Made {
  const p = int(rng, 300, 999)
  const q = int(rng, 100, p - 50)
  return {
    text: lines(`Se știe că $a + c = ${p}$ și $b + d = ${q}$. Calculați:`, 'a) $a + b + c + d$;', 'b) $a - b + c - d$.'),
    solution: lines(
      'Grupăm termenii după relațiile cunoscute:',
      show(`\\text{a) } a + b + c + d = (a + c) + (b + d) = ${p} + ${q} = ${N(p + q)}`),
      show(`\\text{b) } a - b + c - d = (a + c) - (b + d) = ${p} - ${q} = ${p - q}`),
    ),
    verify: () => {
      const [a, b] = [Math.floor(p / 2), Math.floor(q / 2)]
      const [c, d] = [p - a, q - b]
      return a + b + c + d === p + q && a - b + c - d === p - q
    },
  }
}

const ROUTES: [string, string, string][] = [
  ['București', 'Onești', 'Deva'], ['Cluj-Napoca', 'Brașov', 'Constanța'], ['Iași', 'Bacău', 'Ploiești'],
  ['Timișoara', 'Arad', 'Oradea'], ['Craiova', 'Pitești', 'Sibiu'], ['Suceava', 'Piatra Neamț', 'Galați'],
]

/** Distances from three readings of a car's odometer, as in p. 42, ex. 19. */
export function odometer(rng: Rng): Made {
  const [X, Y, Z] = pick(rng, ROUTES)
  const who = pick(rng, BOYS)
  const K0 = int(rng, 10000, 90000)
  const K1 = K0 + int(rng, 80, 450)
  const K2 = K1 + int(rng, 80, 450)
  return {
    text: `La plecarea din ${X}, kilometrajul mașinii lui ${who} indica $${N(K0)}$ km, iar la sosirea în ${Y}, $${N(K1)}$ km. ${who} pleacă apoi spre ${Z}, iar la sosire kilometrajul indică $${N(K2)}$ km. Calculați distanțele ${X} – ${Y}, ${Y} – ${Z} și distanța totală parcursă de ${who}.`,
    solution: lines(
      'O distanță este diferența dintre indicația de la sosire și cea de la plecare:',
      show(`${N(K1)} - ${N(K0)} = ${K1 - K0}\\text{ km}, \\qquad ${N(K2)} - ${N(K1)} = ${K2 - K1}\\text{ km}`),
      show(`${N(K2)} - ${N(K0)} = ${K2 - K0}\\text{ km}`),
      `Verificare: $${K1 - K0} + ${K2 - K1} = ${K2 - K0}$.`,
    ),
    verify: () => K1 - K0 + (K2 - K1) === K2 - K0,
  }
}

/** Two-digit numbers and their reversals: difference, sum, or digit sum and difference, as in p. 42, ex. 12, 16, 20. */
export function reverseDiffList(rng: Rng): Made {
  const t = int(rng, 0, 2)
  if (t === 0) {
    const k = int(rng, 1, 8)
    const D = 9 * k
    const sols = range(1, 9 - k).map((b) => 10 * (b + k) + b)
    return {
      text: `Aflați numerele naturale de forma $${ov('ab')}$ care sunt cu ${D} mai mari decât răsturnatele lor, $${ov('ba')}$.`,
      solution: lines(
        show(`${ov('ab')} - ${ov('ba')} = (10a + b) - (10b + a) = 9a - 9b = 9 \\cdot (a - b) = ${D} \\Rightarrow a - b = ${k}`),
        `Cum $${ov('ba')}$ are două cifre, $b \\ne 0$. Numerele sunt:`,
        show(sols.join(', \\; ')),
      ),
      verify: () => sols.every((n) => n - (10 * (n % 10) + Math.floor(n / 10)) === D) && sols.length === range(10, 99).filter((n) => n % 10 > 0 && n - (10 * (n % 10) + Math.floor(n / 10)) === D).length,
    }
  }
  if (t === 1) {
    const s = int(rng, 2, 18)
    const S = 11 * s
    const sols = range(Math.max(1, s - 9), Math.min(9, s - 1)).map((a) => 10 * a + (s - a))
    return {
      text: `Aflați numerele naturale de forma $${ov('ab')}$ pentru care $${ov('ab')} + ${ov('ba')} = ${S}$.`,
      solution: lines(
        show(`${ov('ab')} + ${ov('ba')} = (10a + b) + (10b + a) = 11a + 11b = 11 \\cdot (a + b) = ${S} \\Rightarrow a + b = ${s}`),
        'Ambele numere au două cifre, deci $a \\ne 0$ și $b \\ne 0$. Numerele sunt:',
        show(sols.join(', \\; ')),
      ),
      verify: () => sols.length > 0 && sols.every((n) => n + 10 * (n % 10) + Math.floor(n / 10) === S && n % 10 > 0),
    }
  }
  for (;;) {
    const b = int(rng, 1, 8)
    const k = int(rng, 1, 9 - b)
    const a = b + k
    const s = a + b
    if (s > 17) continue
    const D = 9 * k
    return {
      text: `Determinați numărul natural de forma $${ov('xy')}$, știind că suma cifrelor sale este ${s}, iar răsturnatul său este cu ${D} mai mic decât el.`,
      solution: lines(
        show(`${ov('xy')} - ${ov('yx')} = (10x + y) - (10y + x) = 9 \\cdot (x - y) = ${D} \\Rightarrow x - y = ${k}`),
        `Știm și că $x + y = ${s}$. Suma și diferența cifrelor dau (metoda figurativă):`,
        show(`y = (${s} - ${k}) : 2 = ${b}, \\qquad x = ${b} + ${k} = ${a}`),
        `Numărul este ${10 * a + b}.`,
      ),
      verify: () => a + b === s && 10 * a + b - (10 * b + a) === D,
    }
  }
}

/** The difference of two numbers and the larger one: the smaller one minus another number, as in p. 42, ex. 13 and 18. */
export function diffShift(rng: Rng): Made {
  const d = int(rng, 1000, 50000)
  const small = int(rng, 1000, 50000)
  const M = small + d
  const N0 = int(rng, 100, small - 100)
  return {
    text: `Diferența a două numere naturale este $${N(d)}$, iar cel mai mare dintre ele este $${N(M)}$. Care este diferența dintre numărul mic și $${N(N0)}$?`,
    solution: lines(
      'Numărul mic este scăzătorul: descăzutul minus diferența.',
      show(`${N(M)} - ${N(d)} = ${N(small)}`),
      show(`${N(small)} - ${N(N0)} = ${N(small - N0)}`),
    ),
    verify: () => M - small === d && small - N0 > 0,
  }
}

/** Brackets in a − b − c − d to get zero, as in p. 41, ex. 11. */
export function parensZero(rng: Rng): Made {
  if (rng() < 0.5) {
    const c = int(rng, 300, 9999)
    const d = int(rng, 100, c - 100)
    const b = int(rng, 100, 9999)
    const a = b + (c - d)
    return {
      text: `Puneți paranteze în expresia $${N(a)} - ${N(b)} - ${N(c)} - ${N(d)}$ astfel încât rezultatul să fie zero.`,
      solution: lines(
        'Observăm că primele două numere și ultimele două au aceeași diferență:',
        show(`(${N(a)} - ${N(b)}) - (${N(c)} - ${N(d)}) = ${N(a - b)} - ${N(c - d)} = 0`),
      ),
      verify: () => a - b - (c - d) === 0,
    }
  }
  const b = int(rng, 2000, 40000)
  const c = int(rng, 1000, b - 500)
  const d = int(rng, 500, Math.min(9999, c - 100))
  const a = b - c + d
  return {
    text: `Puneți paranteze în expresia $${N(a)} - ${N(b)} - ${N(c)} - ${N(d)}$ astfel încât rezultatul să fie zero.`,
    solution: lines(
      `Primul număr este mai mic decât al doilea, deci punem în paranteză diferența $${N(b)} - ${N(c)}$:`,
      show(`${N(a)} - (${N(b)} - ${N(c)}) - ${N(d)} = ${N(a)} - ${N(b - c)} - ${N(d)} = ${N(a - (b - c))} - ${N(d)} = 0`),
    ),
    verify: () => a - (b - c) - d === 0 && a < b,
  }
}

/** Are there natural a, b, c with a + b, b − c and a − c given? Parity decides, as in p. 42, ex. 24. */
export function existenceSystem(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 100, 2000)
    const c = int(rng, 50, a - 1)
    const b = c + int(rng, 100, 2000)
    const yes = rng() < 0.45
    const p = a + b
    const q = b - c
    const r = yes ? a - c : a - c + 2 * int(rng, 0, 49) + 1
    const X = p - q + r
    if (!yes && r > p - q) continue
    const A = X / 2
    return {
      text: `Stabiliți dacă există numere naturale $a$, $b$, $c$ care verifică simultan egalitățile $a + b = ${N(p)}$, $b - c = ${N(q)}$ și $a - c = ${N(r)}$.`,
      solution: lines(
        'Scădem a doua egalitate din prima:',
        show(`(a + b) - (b - c) = a + c = ${N(p)} - ${N(q)} = ${N(p - q)}`),
        'Adunăm rezultatul cu a treia egalitate:',
        show(`(a + c) + (a - c) = 2 \\cdot a = ${N(p - q)} + ${N(r)} = ${N(X)}`),
        yes
          ? lines(`Atunci $a = ${N(X)} : 2 = ${N(A)}$, $c = ${N(A)} - ${N(r)} = ${N(A - r)}$ și $b = ${N(p)} - ${N(A)} = ${N(p - A)}$. Verificăm: $${N(p - A)} - ${N(A - r)} = ${N(q)}$. Da, astfel de numere există.`)
          : `Numărul $${N(X)}$ este impar, deci nu se împarte exact la 2: $a$ nu poate fi număr natural. Nu există astfel de numere.`,
      ),
      verify: () => yes ? Number.isInteger(A) && A - r >= 0 && p - A - (A - r) === q : X % 2 === 1,
    }
  }
}

/** a k b minus its reversal is 99(a − b): all the digits a, b, as in p. 42, ex. 23. */
export function threeDigitReverse(rng: Rng): Made {
  const k = int(rng, 0, 9)
  const t = int(rng, 1, 8)
  const D = 99 * t
  const pairs = range(1, 9 - t).map((b) => [b + t, b] as const)
  return {
    text: `Determinați cifrele $a$ și $b$ ($a > b$), astfel încât diferența dintre numărul $${ov(`a${k}b`)}$ și răsturnatul său să fie ${D}.`,
    solution: lines(
      show(`${ov(`a${k}b`)} - ${ov(`b${k}a`)} = (100a + ${10 * k} + b) - (100b + ${10 * k} + a) = 99a - 99b = 99 \\cdot (a - b)`),
      show(`99 \\cdot (a - b) = ${D} \\Rightarrow a - b = ${t}`),
      `Răsturnatul are tot trei cifre, deci $b \\ne 0$. Perechile $(a, b)$ sunt: ${list(pairs.map(([a, b]) => `(${a}, ${b})`))}; numerele sunt ${list(pairs.map(([a, b]) => `${a}${k}${b}`))}.`,
    ),
    verify: () => pairs.every(([a, b]) => 100 * a + 10 * k + b - (100 * b + 10 * k + a) === D) && pairs.length === 9 - t,
  }
}

/** a + x and b − x known: a + b, and so the parity of a − b, as in p. 42, ex. 22. */
export function parityDifference(rng: Rng): Made {
  const P = int(rng, 1000, 9999)
  const Q = int(rng, 1000, 9999)
  const S = P + Q
  const even = S % 2 === 0
  return {
    text: lines(
      `Fie $a$ și $b$ două numere naturale astfel încât $a + x = ${N(P)}$ și $b - x = ${N(Q)}$, unde $x$ este un număr natural. Stabiliți valoarea de adevăr a propozițiilor:`,
      '$p$: „Diferența numerelor $a$ și $b$ este număr par.”',
      '$q$: „Diferența numerelor $a$ și $b$ este număr impar.”',
    ),
    solution: lines(
      'Adunăm cele două egalități; $x$ se adună și se scade, deci dispare:',
      show(`(a + x) + (b - x) = a + b = ${N(P)} + ${N(Q)} = ${N(S)}`),
      `Numerele $a + b$ și diferența lor $a - b$ (sau $b - a$) diferă prin dublul unuia dintre ele, care este par, deci au aceeași paritate. Cum $${N(S)}$ este ${even ? 'par' : 'impar'}, diferența este ${even ? 'pară' : 'impară'}: $p$ este ${even ? 'adevărată' : 'falsă'}, iar $q$ este ${even ? 'falsă' : 'adevărată'}.`,
    ),
    verify: () => [0, 7, 500].every((x) => Math.abs(P - x - (Q + x)) % 2 === S % 2),
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-recap-grade4', label: 'Recapitulare: operații și probleme din clasa a IV-a', topic: 'Algebră',
    forms: {
      1: [recapUnknownTerm, recapLetters, recapSpecialNumbers, recapSumChange],
      2: [recapPairSums, recapGiveEqual, recapDivisionRemainder, recapWorkers],
      3: [recapTwoPrices, recapShelves, recapReadingBackwards, recapThreeRatio],
    },
  },
  {
    id: 'v-writing-numbers', label: 'Scrierea și citirea numerelor naturale; cifre romane', topic: 'Algebră',
    forms: {
      1: [placeValue, toRomanNumerals, fromRomanNumerals, decompose],
      2: [overlineEquation, digitsSmallestLargest, countForms, digitSumList],
      3: [abLinear, consecutiveOverline, digitCondList],
    },
  },
  {
    id: 'v-compare-round', label: 'Axa numerelor, compararea, ordonarea și rotunjirea numerelor naturale', topic: 'Algebră',
    forms: {
      1: [roundings, axisLengths, distinctDigitsOrder],
      2: [roundingRange, axisBetween, pagesDigits, orderLetters],
      3: [digitPosition, insertDigit, deleteDigits, axisSegments],
    },
  },
  {
    id: 'v-addition', label: 'Adunarea numerelor naturale: proprietăți, suma lui Gauss, șiruri', topic: 'Algebră',
    forms: {
      1: [addGrouping, gaussSum, sumShift],
      2: [stepSum, multiplesSum, combineSums, addEqualities, sequenceRank],
      3: [sequenceSumFirst, rangeSum, consecutiveMiddle, parityTruth],
    },
  },
  {
    id: 'v-subtraction', label: 'Scăderea numerelor naturale: proprietăți și probleme', topic: 'Algebră',
    forms: {
      1: [subtractFindTerm, bracketTruth, compareExpressions],
      2: [sumsCombine, odometer, reverseDiffList, diffShift, parensZero],
      3: [existenceSystem, threeDigitReverse, parityDifference],
    },
  },
]
