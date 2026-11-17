// Grade V forms from the second grade V workbook (the one "cu puișorul"), photographed by the user on 14 November 2026,
// files 1–28 of `clasa5\culegere puisor sem1+2`: pp. 6–33 (initial tests; natural numbers: writing, comparing,
// addition and subtraction, multiplication and the common factor, division, the division with remainder, powers,
// perfect squares, comparing powers, bases, the order of operations; the arithmetic methods up to p. 33, the
// chapter goes on in the next photos). The levels follow the stars of the sections (* = 1, ** = 2, *** = 3);
// unmarked items (tests, the methods) are placed by their content. Almost every kind joins an existing grade V kind
// (`joins`), with patterns that kind does not have yet. Every form names its page and exercise.
import type { Made } from './generators'
import { de, gcd, int, pick, poly, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  /** 'v-…', unique */
  id: string
  /** Romanian, shown in the interface (ignored when joining) */
  label: string
  topic: 'Algebră' | 'Geometrie'
  /** an existing kind the forms are appended to */
  joins?: string
  /** level 1 easy, 2 medium, 3 hard */
  forms: Record<1 | 2 | 3, Form[]>
}
/** contest level only */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** The word "de" alone, when the number before a noun needs it: "24 de" but "19". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
/** A number in a formula, then "de" if Romanian needs it before the noun: "$14\,638$ de". */
const deN = (n: number) => `$${nr(n)}$` + (de(n) === String(n) ? '' : ' de')
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const NAMES = ['Ana', 'Mihai', 'Ioana', 'Andrei', 'Maria', 'Radu', 'Elena', 'Vlad', 'Daniela', 'Răzvan', 'Carmen', 'Bogdan']
const two = (rng: Rng) => shuffle(rng, NAMES).slice(0, 2)
/** The genitive and dative of a first name: "Anei", "lui Radu", "lui Carmen". */
const gen = (name: string) => (name.endsWith('a') ? name.slice(0, -1) + 'ei' : `lui ${name}`)
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n))
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const MULT: Record<number, string> = { 2: 'dublul', 3: 'triplul', 4: 'cvadruplul' }
const PART: Record<number, string> = { 2: 'jumătatea', 3: 'treimea', 4: 'sfertul', 5: 'cincimea' }
const APART: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'un sfert', 5: 'o cincime' }

// ================= initial tests, pp. 6–7 (joins v-recap-grade4) =================

/** Two children's ages now: in how many years their sum is S (p. 6, Testul 1, I.1). */
export function initAgesSum(rng: Rng): Made {
  const a = int(rng, 4, 10)
  const b = a + int(rng, 1, 5)
  const y = int(rng, 2, 20)
  const S = a + b + 2 * y
  const [n1, n2] = two(rng)
  return {
    text: `${n1} are ${de(a)} ani, iar ${n2} are ${de(b)} ani. Peste câți ani suma vârstelor lor va fi de ${de(S)} ani?`,
    solution: lines(
      `Acum suma vârstelor este $${a} + ${b} = ${a + b}$. În fiecare an, fiecare copil crește cu un an, deci suma vârstelor crește cu 2 ani.`,
      'Suma mai are de crescut cu:',
      show(`${S} - ${a + b} = ${S - a - b}`),
      'iar numărul de ani este:',
      show(`${S - a - b} : 2 = ${y}`),
      `Răspuns: peste ${de(y)} ani (atunci vor avea $${a + y}$ și $${b + y}$ ani: $${a + y} + ${b + y} = ${S}$).`,
    ),
    verify: () => a + y + (b + y) === S && y > 0,
  }
}

/** Posts around a closed fence, or trees along a straight alley (p. 6, Testul 1, II.4 c). */
export function initFence(rng: Rng): Made {
  const d = int(rng, 2, 9)
  if (rng() < 0.5) {
    const n = int(rng, 12, 60)
    const L = n * d
    return {
      text: `O curte este împrejmuită cu un gard sprijinit pe ${de(n)} stâlpi așezați la distanțe egale. Dacă distanța dintre doi stâlpi vecini este de ${de(d)} metri, ce lungime are gardul?`,
      solution: lines(
        `Gardul este închis: după ultimul stâlp, gardul se întoarce la primul. Între oricare doi stâlpi vecini este o bucată de gard, deci sunt tot atâtea bucăți câți stâlpi: ${n}.`,
        show(`${n} \\cdot ${d} = ${L}`),
        `Gardul are ${de(L)} metri.`,
      ),
      verify: () => L / d === n,
    }
  }
  const k = int(rng, 6, 40)
  const L = k * d
  return {
    text: `De-a lungul unei alei drepte, lungi de ${de(L)} metri, se plantează copaci la câte ${de(d)} metri unul de altul: primul la începutul aleii, ultimul la capătul ei. Câți copaci se plantează?`,
    solution: lines(
      'Numărul de spații dintre copaci:',
      show(`${L} : ${d} = ${k}`),
      'Pe o linie deschisă, copacii sunt cu unul mai mulți decât spațiile dintre ei (primul copac nu are spațiu în fața lui):',
      show(`${k} + 1 = ${k + 1}`),
      `Se plantează ${de(k + 1)} copaci.`,
    ),
    verify: () => (k + 1 - 1) * d === L,
  }
}

/** The product and one factor given as a sum or a difference: the other factor (p. 7, Testul 3, I.2). */
export function initFactorFromSum(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 2, 15)
    const y = int(rng, 2, 9)
    const add = rng() < 0.5
    const f1 = add ? x + y : x - y
    if (f1 < 2) continue
    const f2 = int(rng, 3, 40)
    const P = f1 * f2
    return {
      text: `Produsul a două numere naturale este ${P}, iar unul dintre factori este egal cu ${add ? 'suma' : 'diferența'} numerelor ${x} și ${y}. Aflați celălalt factor.`,
      solution: lines(
        'Factorul cunoscut:',
        show(`${x} ${add ? '+' : '-'} ${y} = ${f1}`),
        'Celălalt factor se află împărțind produsul la factorul cunoscut:',
        show(`${P} : ${f1} = ${f2}`),
        `Verificare: $${f1} \\cdot ${f2} = ${P}$.`,
      ),
      verify: () => f1 * f2 === P && (add ? x + y : x - y) === P / f2,
    }
  }
}

const PLANTS: [string, string][] = [['lalele', 'Câte'], ['trandafiri', 'Câți'], ['brazi', 'Câți'], ['răsaduri', 'Câte']]

/** While one plants p, the other plants q; the total: each one's share (p. 6, Testul 2, II.6). */
export function initPlantingRatio(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 9)
    const q = int(rng, 2, 9)
    if (p === q) continue
    const k = int(rng, 3, 12)
    const T = k * (p + q)
    const [n1, n2] = two(rng)
    const [plant, how] = pick(rng, PLANTS)
    return {
      text: `${n1} și ${n2} au plantat ${plant}. În timp ce ${n1} plantează ${p} ${plant}, ${n2} plantează ${q} ${plant}. ${how} ${plant} a plantat fiecare, dacă împreună au plantat ${de(T)} ${plant}?`,
      solution: lines(
        `În același timp, cei doi plantează împreună $${p} + ${q} = ${p + q}$ ${plant}. Această „tură” se repetă de:`,
        show(`${T} : ${p + q} = ${k} \\text{ ori}`),
        `${n1} a plantat $${p} \\cdot ${k} = ${p * k}$ ${deW(p * k)}${plant}, iar ${n2} a plantat $${q} \\cdot ${k} = ${q * k}$ ${deW(q * k)}${plant}.`,
        `Verificare: $${p * k} + ${q * k} = ${T}$.`,
      ),
      verify: () => p * k + q * k === T && (p * k) / p === (q * k) / q,
    }
  }
}

/** The same number of boxes of two kinds, c1 and c2 in a box, T in all (p. 7, Testul 4, II.6). */
export function initEqualBoxes(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 2, 12)
    const c1 = int(rng, 10, 30)
    const c2 = int(rng, 10, 30)
    if (c1 === c2) continue
    const T = n * (c1 + c2)
    return {
      text: `O persoană cumpără un număr egal de cutii cu bomboane și de cutii cu napolitane. Bomboanele sunt câte ${c1} într-o cutie, iar napolitanele câte ${c2} într-o cutie. Câte bomboane și câte napolitane a cumpărat persoana, dacă a luat în total ${de(T)} dulciuri?`,
      solution: lines(
        `O cutie cu bomboane și o cutie cu napolitane au împreună $${c1} + ${c2} = ${c1 + c2}$ ${deW(c1 + c2)}dulciuri. Numărul de cutii din fiecare fel:`,
        show(`${T} : ${c1 + c2} = ${n}`),
        `Bomboane: $${n} \\cdot ${c1} = ${n * c1}$; napolitane: $${n} \\cdot ${c2} = ${n * c2}$.`,
      ),
      verify: () => n * c1 + n * c2 === T,
    }
  }
}

/** Tomatoes and potatoes: the potatoes' cost, 1 kg of tomatoes costs as k kg of potatoes: the total (p. 7, Testul 3, II.6). */
export function initPriceInKg(rng: Rng): Made {
  const a = int(rng, 5, 20)
  const b = int(rng, 4, 15)
  const p = int(rng, 2, 6)
  const k = int(rng, 2, 4)
  const P = b * p
  const total = a * k * p + P
  const [n1] = two(rng)
  return {
    text: `${n1} a cumpărat ${de(a)} kg de roșii și ${de(b)} kg de cartofi. Cartofii au costat ${de(P)} lei. Dacă un kilogram de roșii costă cât ${k} kg de cartofi, ce sumă a plătit ${n1} în total?`,
    solution: lines(
      'Un kilogram de cartofi costă:',
      show(`${P} : ${b} = ${p} \\text{ lei}`),
      'Un kilogram de roșii costă:',
      show(`${k} \\cdot ${p} = ${k * p} \\text{ lei}`),
      'Roșiile au costat:',
      show(`${a} \\cdot ${k * p} = ${a * k * p} \\text{ lei}`),
      'În total:',
      show(`${a * k * p} + ${P} = ${total} \\text{ lei}`),
    ),
    verify: () => total === a * (P / b) * k + P,
  }
}

/** m times a number plus c; the k-th part of the result is r: the number (p. 6, Testul 1, II.6). */
export function initTripleQuarter(rng: Rng): Made {
  for (;;) {
    const m = int(rng, 2, 4)
    const k = int(rng, 2, 5)
    const x = int(rng, 3, 50)
    const c = int(rng, 1, 40)
    if ((m * x + c) % k !== 0 || m === k) continue
    const r = (m * x + c) / k
    return {
      text: `${cap(MULT[m])} unui număr natural se adună cu ${c}. Dacă ${PART[k]} rezultatului este ${r}, aflați numărul.`,
      solution: lines(
        'Mergem invers, de la sfârșit. Rezultatul adunării este:',
        show(`${r} \\cdot ${k} = ${r * k}`),
        `${cap(MULT[m])} numărului este:`,
        show(`${r * k} - ${c} = ${m * x}`),
        'Numărul este:',
        show(`${m * x} : ${m} = ${x}`),
        `Verificare: $(${m} \\cdot ${x} + ${c}) : ${k} = ${r}$.`,
      ),
      verify: () => (m * x + c) / k === r,
    }
  }
}

/** A square with the perimeter of a given rectangle: order the sides, compare the areas (p. 6, Testul 1, II.8). */
export function initSquareRectangle(rng: Rng): Made {
  const l = int(rng, 3, 20)
  const t = int(rng, 1, 10)
  const L = l + 2 * t
  const side = (L + l) / 2
  return {
    text: `Un pătrat are perimetrul egal cu perimetrul unui dreptunghi cu lungimea de ${de(L)} cm și lățimea de ${de(l)} cm. Ordonați crescător latura pătratului, lungimea și lățimea dreptunghiului. Care dintre cele două figuri are aria mai mare?`,
    solution: lines(
      'Perimetrul dreptunghiului:',
      show(`2 \\cdot (${L} + ${l}) = ${2 * (L + l)} \\text{ cm}`),
      'Latura pătratului:',
      show(`${2 * (L + l)} : 4 = ${side} \\text{ cm}`),
      'Ordinea crescătoare: lățimea, latura pătratului, lungimea:',
      show(`${l} < ${side} < ${L}`),
      `Ariile: pătratul are $${side} \\cdot ${side} = ${side * side}\\text{ cm}^2$, iar dreptunghiul $${L} \\cdot ${l} = ${L * l}\\text{ cm}^2$. Pătratul are aria mai mare.`,
    ),
    verify: () => 4 * side === 2 * (L + l) && l < side && side < L && side * side > L * l,
  }
}

// ================= writing and comparing natural numbers, pp. 8–9 (joins v-writing-numbers) =================

/** How many natural numbers from a to b, and how many even and odd (p. 8, ex. 13–15). */
export function countRange(rng: Rng): Made {
  const a = int(rng, 5, 300)
  const b = a + int(rng, 15, 400)
  const N = b - a + 1
  const fe = a % 2 ? a + 1 : a
  const le = b % 2 ? b - 1 : b
  const E = (le - fe) / 2 + 1
  return {
    text: `Câte numere naturale sunt de la ${a} la ${b}, inclusiv? Câte dintre ele sunt pare și câte sunt impare?`,
    solution: lines(
      `Numerele de la ${a} la ${b} sunt cu 1 mai multe decât diferența lor (se numără și ${a}):`,
      show(`${b} - ${a} + 1 = ${N}`),
      `Cel mai mic număr par dintre ele este ${fe}, iar cel mai mare este ${le}. Numerele pare merg din 2 în 2:`,
      show(`(${le} - ${fe}) : 2 + 1 = ${E}`),
      'Numere impare:',
      show(`${N} - ${E} = ${N - E}`),
    ),
    verify: () => {
      const all = range(a, b)
      return all.length === N && all.filter((n) => n % 2 === 0).length === E
    },
  }
}

/** How many numbers of two or three digits contain, begin or end with a digit (p. 9, ex. 17). */
export function digitCount(rng: Rng): Made {
  const d = int(rng, 1, 9)
  const v = int(rng, 0, 3)
  const e = int(rng, 0, 9)
  const text = [
    `Câte numere naturale de două cifre folosesc în scrierea lor cifra ${d}?`,
    `Câte numere naturale de trei cifre încep cu cifra ${d}?`,
    `Câte numere naturale de trei cifre se termină cu cifra ${d}?`,
    `Câte numere naturale de trei cifre au cifra zecilor ${d} și cifra unităților ${e}?`,
  ][v]
  const answer = [18, 100, 90, 9][v]
  const test = [
    (n: number) => n >= 10 && n <= 99 && String(n).includes(String(d)),
    (n: number) => n >= 100 && n <= 999 && String(n)[0] === String(d),
    (n: number) => n >= 100 && n <= 999 && n % 10 === d,
    (n: number) => n >= 100 && n <= 999 && Math.floor(n / 10) % 10 === d && n % 10 === e,
  ][v]
  const solution = [
    lines(
      `Cu cifra zecilor ${d}: $${d}0, ${d}1, \\ldots, ${d}9$, adică 10 numere.`,
      `Cu cifra unităților ${d}, dar cu cifra zecilor diferită de ${d}: cifra zecilor poate fi oricare dintre 1, 2, …, 9, în afară de ${d}, adică 8 numere (numărul $${d}${d}$ a fost deja numărat).`,
      show('10 + 8 = 18'),
    ),
    lines(`Numerele sunt $\\overline{${d}bc}$, de la $${d}00$ la $${d}99$: cifrele $b$ și $c$ pot fi oricare dintre cele 10 cifre.`, show('10 \\cdot 10 = 100')),
    lines(`Numerele sunt $\\overline{ab${d}}$: cifra $a$ poate fi 1, 2, …, 9 (9 variante), iar $b$ oricare dintre cele 10 cifre.`, show('9 \\cdot 10 = 90')),
    lines(`Numerele sunt $\\overline{a${d}${e}}$: doar cifra sutelor se poate alege, oricare dintre 1, 2, …, 9.`, show('9 \\text{ numere}')),
  ][v]
  return {
    text,
    solution: lines(solution, `Răspuns: ${answer} ${deW(answer)}numere.`),
    verify: () => range(1, 999).filter(test).length === answer,
  }
}

const DIGITS3 = (rng: Rng) => shuffle(rng, range(1, 9)).slice(0, 3).sort((x, y) => x - y)

/** How many numbers can be made from given digits, with or without repeating, with 0 among them (p. 9, ex. 18). */
export function countFromDigits(rng: Rng): Made {
  const [a, b, c] = DIGITS3(rng)
  const v = int(rng, 0, 3)
  const digits = v < 2 ? [a, b, c] : [0, a, b, c]
  const len = v < 2 ? 3 : 4
  const distinct = v % 2 === 1
  const list = range(10 ** (len - 1), 10 ** len - 1).filter((n) => {
    const s = String(n).split('').map(Number)
    return s.every((x) => digits.includes(x)) && (!distinct || new Set(s).size === s.length)
  })
  const answer = [27, 6, 192, 18][v]
  const text = [
    `Câte numere de trei cifre se pot forma cu cifrele ${a}, ${b} și ${c}, dacă o cifră se poate folosi de mai multe ori?`,
    `Câte numere de trei cifre distincte se pot forma cu cifrele ${a}, ${b} și ${c}? Scrieți-le în ordine crescătoare.`,
    `Câte numere de patru cifre se pot forma cu cifrele 0, ${a}, ${b} și ${c}, dacă o cifră se poate folosi de mai multe ori?`,
    `Câte numere de patru cifre distincte se pot forma cu cifrele 0, ${a}, ${b} și ${c}?`,
  ][v]
  const solution = [
    lines('Fiecare dintre cele trei locuri (sute, zeci, unități) poate primi oricare dintre cele 3 cifre:', show('3 \\cdot 3 \\cdot 3 = 27')),
    lines(
      'Prima cifră se alege în 3 feluri, a doua în 2 feluri (fără cea folosită), ultima într-un singur fel:',
      show('3 \\cdot 2 \\cdot 1 = 6'),
      show(list.join(' < ')),
    ),
    lines('Prima cifră nu poate fi 0, deci are 3 variante; fiecare dintre celelalte trei locuri are 4 variante:', show('3 \\cdot 4 \\cdot 4 \\cdot 4 = 192')),
    lines(
      'Prima cifră nu poate fi 0: 3 variante. A doua: oricare dintre cele 3 cifre rămase (acum și 0), a treia: 2, ultima: 1.',
      show('3 \\cdot 3 \\cdot 2 \\cdot 1 = 18'),
    ),
  ][v]
  return { text, solution: lines(solution, `Răspuns: ${answer} ${deW(answer)}numere.`), verify: () => list.length === answer }
}

/** A sum (difference) between two numbers, one term known: the possible values of the other (p. 9, ex. 6–8). */
export function estimateTerm(rng: Rng): Made {
  const A = int(rng, 30, 250)
  const B = A + int(rng, 3, 8)
  const v = int(rng, 0, 2)
  let text: string
  let lo: number
  let what: string
  let check: (x: number) => boolean
  if (v === 0) {
    const t = int(rng, 10, A - 5)
    lo = A - t + 1
    text = `Suma a două numere naturale este mai mare decât ${A} și mai mică decât ${B}. Dacă unul dintre termeni este ${t}, care sunt valorile posibile ale celuilalt termen?`
    what = `$${A} < ${t} + x < ${B}$, deci $${A} - ${t} < x < ${B} - ${t}$, adică $${A - t} < x < ${B - t}$`
    check = (x) => A < t + x && t + x < B
  } else if (v === 1) {
    const M = B + int(rng, 10, 400)
    lo = M - B + 1
    text = `Diferența a două numere naturale este mai mare decât ${A} și mai mică decât ${B}. Descăzutul este ${M}. Care sunt valorile posibile ale scăzătorului?`
    what = `$${A} < ${M} - x < ${B}$. Cu cât scăzătorul $x$ este mai mare, cu atât diferența e mai mică, deci $${M} - ${B} < x < ${M} - ${A}$, adică $${M - B} < x < ${M - A}$`
    check = (x) => A < M - x && M - x < B
  } else {
    const s = int(rng, 10, 300)
    lo = A + s + 1
    text = `Diferența a două numere naturale este mai mare decât ${A} și mai mică decât ${B}. Scăzătorul este ${s}. Care sunt valorile posibile ale descăzutului?`
    what = `$${A} < x - ${s} < ${B}$, deci $${A} + ${s} < x < ${B} + ${s}$, adică $${A + s} < x < ${B + s}$`
    check = (x) => A < x - s && x - s < B
  }
  const vals = range(lo, lo + B - A - 2)
  return {
    text,
    solution: lines(`Notăm cu $x$ numărul căutat: ${what}.`, 'Valorile posibile:', show(`x \\in \\{${vals.join(', ')}\\}`)),
    verify: () => vals.every(check) && !check(lo - 1) && !check(lo + B - A - 1),
  }
}

/** The three-digit numbers whose digits make a given product, in order (p. 9, ex. 9). */
export function digitProductList(rng: Rng): Made {
  for (;;) {
    const P = int(rng, 4, 90)
    const triples: number[][] = []
    for (let x = 1; x <= 9; x++) for (let y = x; y <= 9; y++) for (let z = y; z <= 9; z++) if (x * y * z === P) triples.push([x, y, z])
    const list: number[] = []
    for (const [x, y, z] of triples) {
      for (const [p, q, r] of [[x, y, z], [x, z, y], [y, x, z], [y, z, x], [z, x, y], [z, y, x]]) {
        const n = 100 * p + 10 * q + r
        if (!list.includes(n)) list.push(n)
      }
    }
    list.sort((u, w) => u - w)
    if (list.length < 3 || list.length > 15 || triples.length < 2) continue
    return {
      text: `Găsiți toate numerele de forma $\\overline{abc}$ care au produsul cifrelor egal cu ${P} și ordonați-le crescător.`,
      solution: lines(
        `Nicio cifră nu poate fi 0 (produsul ar fi 0). Scriem ${P} ca produs de trei cifre, în toate felurile: ${triples.map((t) => `$${t.join(' \\cdot ')}$`).join(', ')}.`,
        'Schimbăm ordinea cifrelor în fiecare caz (cifrele egale dau mai puține numere) și ordonăm:',
        show(list.join(' < ')),
        `Sunt ${list.length} numere.`,
      ),
      verify: () => {
        const brute = range(100, 999).filter((n) => String(n).split('').reduce((s, ch) => s * Number(ch), 1) === P)
        return brute.length === list.length && brute.every((n, i) => n === list[i])
      },
    }
  }
}

/** The largest and the smallest number of the form 7ab (a7b, ab7) with a given product of the digits (p. 9, ex. 12 a). */
export function extremeFormProduct(rng: Rng): Made {
  for (;;) {
    const f = int(rng, 2, 9)
    const pos = int(rng, 0, 2)
    const m = int(rng, 4, 72)
    const pairs: [number, number][] = []
    for (let x = 1; x <= 9; x++) for (let y = x; y <= 9; y++) if (x * y === m) pairs.push([x, y])
    if (pairs.length < 2) continue
    const P = f * m
    const fits = (n: number) => {
      const s = String(n).split('').map(Number)
      return s[pos] === f && s[0] * s[1] * s[2] === P && n >= 100
    }
    const all = range(100, 999).filter(fits)
    const hi = all[all.length - 1]
    const lo = all[0]
    const pat = ['\\overline{' + f + 'ab}', '\\overline{a' + f + 'b}', '\\overline{ab' + f + '}'][pos]
    return {
      text: `Aflați cel mai mare și cel mai mic număr natural de forma $${pat}$ care are produsul cifrelor egal cu ${P}.`,
      solution: lines(
        'Produsul cifrelor $a$ și $b$:',
        show(`a \\cdot b = ${P} : ${f} = ${m}`),
        `Perechile de cifre cu produsul ${m}: ${pairs.map(([x, y]) => `$${x} \\cdot ${y}$`).join(', ')}.`,
        'Pentru cel mai mare număr punem cifra cea mai mare pe locul cel mai din stânga liber; pentru cel mai mic, cifra cea mai mică.',
        `Cel mai mare număr este ${hi}, iar cel mai mic este ${lo}.`,
      ),
      verify: () => fits(hi) && fits(lo) && !range(hi + 1, 999).some(fits) && !range(100, lo - 1).some(fits),
    }
  }
}

// ================= addition and subtraction, pp. 10–12, 18 (joins v-add-sub) =================

/** Signs + or − between four numbers to get a result (p. 11, ex. 15). */
export function signsPlacement(rng: Rng): Made {
  for (;;) {
    const n = [int(rng, 5, 40), int(rng, 2, 30), int(rng, 2, 30), int(rng, 2, 30)]
    const combos = range(0, 7).map((m) => [1, m & 4 ? -1 : 1, m & 2 ? -1 : 1, m & 1 ? -1 : 1])
    const value = (s: number[]) => sum(s.map((x, i) => x * n[i]))
    const m = int(rng, 1, 7)
    const R = value(combos[m])
    if (R < 0 || combos.filter((s) => value(s) === R).length !== 1) continue
    const T = sum(n)
    const minus = n.filter((_, i) => combos[m][i] < 0)
    const eq = n.map((x, i) => (i === 0 ? String(x) : (combos[m][i] < 0 ? ' - ' : ' + ') + x)).join('')
    return {
      text: lines(
        'Puneți între numerele de mai jos semnele „+” sau „−” astfel încât egalitatea să fie adevărată:',
        show(`${n.join(' \\;\\square\\; ')} = ${R}`),
      ),
      solution: lines(
        `Dacă toate semnele ar fi „+”, am obține $${n.join(' + ')} = ${T}$. Fiecare număr cu „−” în față micșorează suma cu dublul lui, deci numerele cu „−” au suma:`,
        show(`(${T} - ${R}) : 2 = ${(T - R) / 2}`),
        `Singura alegere bună: semnul „−” în fața ${minus.length === 1 ? 'numărului' : 'numerelor'} ${minus.join(' și ')}.`,
        show(`${eq} = ${R}`),
      ),
      verify: () => value(combos[m]) === R && sum(minus) === (T - R) / 2,
    }
  }
}

/** Alternating sums by grouping: n − (n−1) + …, evens minus odds, groups of four or three (p. 12, ex. 25, 26; p. 15, ex. 20). */
export function alternatingSum(rng: Rng): Made {
  const v = int(rng, 0, 3)
  let expr: string
  let steps: string[]
  let result: number
  let brute: () => number
  if (v === 0) {
    const n = 2 * int(rng, 10, 150)
    expr = `${n} - ${n - 1} + ${n - 2} - ${n - 3} + \\ldots + 2 - 1`
    result = n / 2
    steps = [`Grupăm termenii câte doi: $(${n} - ${n - 1}) + (${n - 2} - ${n - 3}) + \\ldots + (2 - 1)$. Fiecare paranteză este 1, iar parantezele sunt $${n} : 2 = ${n / 2}$.`]
    brute = () => sum(range(1, n).map((k) => (k % 2 === 0 ? k : -k)))
  } else if (v === 1) {
    const m = int(rng, 10, 80)
    expr = `2 + 4 + 6 + \\ldots + ${2 * m} - 1 - 3 - 5 - \\ldots - ${2 * m - 1}`
    result = m
    steps = [`Sunt ${m} numere pare și ${m} numere impare. Le grupăm: $(2 - 1) + (4 - 3) + \\ldots + (${2 * m} - ${2 * m - 1})$, adică ${m} paranteze egale cu 1.`]
    brute = () => sum(range(1, 2 * m).map((k) => (k % 2 === 0 ? k : -k)))
  } else if (v === 2) {
    const n = 4 * int(rng, 10, 80)
    expr = `${n} + ${n - 1} - ${n - 2} - ${n - 3} + ${n - 4} + ${n - 5} - \\ldots + 4 + 3 - 2 - 1`
    result = n
    steps = [`Grupăm termenii câte patru: $(${n} + ${n - 1} - ${n - 2} - ${n - 3}) + \\ldots + (4 + 3 - 2 - 1)$. Fiecare grupă este $4$ (de exemplu $4 + 3 - 2 - 1 = 4$), iar grupele sunt $${n} : 4 = ${n / 4}$.`, show(`${n / 4} \\cdot 4 = ${n}`)]
    brute = () => sum(range(1, n).map((k) => (k % 4 === 0 || k % 4 === 3 ? k : -k)))
  } else {
    const m = int(rng, 10, 40)
    expr = `1 + 2 - 3 + 4 + 5 - 6 + \\ldots + ${3 * m - 2} + ${3 * m - 1} - ${3 * m}`
    result = (3 * m * (m - 1)) / 2
    steps = [
      `Grupăm termenii câte trei: $(1 + 2 - 3) + (4 + 5 - 6) + \\ldots + (${3 * m - 2} + ${3 * m - 1} - ${3 * m})$. Grupele dau $0, 3, 6, \\ldots, ${3 * m - 3}$ (fiecare cu 3 mai mult decât cea dinainte).`,
      show(`3 \\cdot (0 + 1 + 2 + \\ldots + ${m - 1}) = 3 \\cdot ${m - 1} \\cdot ${m} : 2 = ${result}`),
    ]
    brute = () => sum(range(1, 3 * m).map((k) => (k % 3 === 0 ? -k : k)))
  }
  return {
    text: lines('Calculați:', show(expr)),
    solution: lines(...steps, `Rezultatul este ${result}.`),
    verify: () => brute() === result,
  }
}

/** Small and large notebooks in packs of P with at least m small ones: the dearest, the cheapest, a given price (p. 11, ex. 21). */
export function notebookPackages(rng: Rng): Made {
  const s = int(rng, 2, 4)
  const L = s + int(rng, 2, 5)
  const P = int(rng, 8, 12)
  const m = int(rng, 2, 4)
  const k = int(rng, m + 1, P - 1)
  const C = k * s + (P - k) * L
  const max = m * s + (P - m) * L
  return {
    text: `Un caiet mic costă ${s} lei, iar un caiet mare costă ${L} lei. O vânzătoare face pachete de câte ${P} caiete, fiecare cu cel puțin ${m} caiete mici. a) Cât costă cel mai scump pachet? b) Dar cel mai ieftin? c) Câte caiete mici are un pachet care costă ${de(C)} lei?`,
    solution: lines(
      `a) Cel mai scump pachet are cât mai multe caiete mari: ${m} mici și ${P - m} mari.`,
      show(`${m} \\cdot ${s} + ${P - m} \\cdot ${L} = ${m * s} + ${(P - m) * L} = ${max} \\text{ lei}`),
      `b) Cel mai ieftin pachet are numai caiete mici:`,
      show(`${P} \\cdot ${s} = ${P * s} \\text{ lei}`),
      `c) Dacă toate cele ${P} caiete ar fi mari, pachetul ar costa $${P} \\cdot ${L} = ${P * L}$ lei, cu $${P * L} - ${C} = ${P * L - C}$ lei mai mult. Fiecare caiet mic pus în locul unuia mare scade prețul cu $${L} - ${s} = ${L - s}$ lei:`,
      show(`${P * L - C} : ${L - s} = ${k}`),
      `Pachetul are ${k} caiete mici.`,
    ),
    verify: () => k * s + (P - k) * L === C && k >= m && max === m * s + (P - m) * L,
  }
}

/** Three people (depots) get (lose) the same amount and then have x, y, z: what they had (p. 18, ex. 25, 26). */
export function threeSameChange(rng: Rng): Made {
  const a = [int(rng, 1000, 40000), int(rng, 1000, 40000), int(rng, 1000, 40000)]
  const s = int(rng, 500, 900) * 10 + int(rng, 0, 9)
  const plus = rng() < 0.5
  const now = a.map((x) => (plus ? x + s : x - s))
  const T = sum(a)
  if (!plus && now.some((x) => x <= 0)) return threeSameChange(rng)
  const N = sum(now)
  const text = plus
    ? `Trei persoane au împreună ${deN(T)} lei. Dacă fiecare primește aceeași sumă, ele vor avea ${deN(now[0])} lei, ${deN(now[1])} lei și, respectiv, ${deN(now[2])} lei. Ce sume aveau persoanele la început?`
    : `În trei depozite se aflau în total $${nr(T)}$ kg de cereale. După ce din fiecare depozit s-a scos aceeași cantitate, au rămas $${nr(now[0])}$ kg, $${nr(now[1])}$ kg și, respectiv, $${nr(now[2])}$ kg. Ce cantități erau la început în fiecare depozit?`
  return {
    text,
    solution: lines(
      `Acum ${plus ? 'au' : 'sunt'} în total:`,
      show(`${nr(now[0])} + ${nr(now[1])} + ${nr(now[2])} = ${nr(N)}`),
      `Diferența față de total este de trei ori cantitatea ${plus ? 'primită' : 'scoasă'} de fiecare:`,
      show(plus ? `${nr(N)} - ${nr(T)} = ${nr(3 * s)}` : `${nr(T)} - ${nr(N)} = ${nr(3 * s)}`),
      show(`${nr(3 * s)} : 3 = ${nr(s)}`),
      `La început: ${now.map((x, i) => `$${nr(x)} ${plus ? '-' : '+'} ${nr(s)} = ${nr(a[i])}$`).join('; ')}.`,
    ),
    verify: () => sum(now) === N && Math.abs(N - T) === 3 * s && now.every((x, i) => (plus ? x - s : x + s) === a[i]),
  }
}

// ================= multiplication, the common factor, pp. 12–15 (joins v-multiplication) =================

/** Like terms: pa + qa − ra, and px + q(x + c) − d (p. 13, ex. 14). */
export function likeTerms(rng: Rng): Made {
  for (;;) {
    const v = pick(rng, ['a', 'b', 'x', 'y'])
    const p = int(rng, 2, 15)
    const q = int(rng, 2, 15)
    const r = int(rng, 1, 15)
    if (r >= p + q) continue
    const P = int(rng, 2, 9)
    const Q = int(rng, 2, 9)
    const c = int(rng, 1, 9)
    const d = int(rng, 1, 30)
    if (d >= Q * c) continue
    const A = poly([[p + q - r, v]])
    const B = poly([[P + Q, 'x'], [Q * c - d, '']])
    return {
      text: `Reduceți termenii asemenea: a) $${p}${v} + ${q}${v} - ${r === 1 ? '' : r}${v}$; b) $${P}x + ${Q}(x + ${c}) - ${d}$.`,
      solution: lines(
        'a) Scoatem factorul comun:',
        show(`${p}${v} + ${q}${v} - ${r === 1 ? '' : r}${v} = (${p} + ${q} - ${r}) \\cdot ${v} = ${A}`),
        'b) Desfacem paranteza, apoi adunăm termenii cu $x$ și numerele:',
        show(`${P}x + ${Q}x + ${Q * c} - ${d} = ${B}`),
      ),
      verify: () => range(0, 5).every((t) => p * t + q * t - r * t === (p + q - r) * t && P * t + Q * (t + c) - d === (P + Q) * t + Q * c - d),
    }
  }
}

/** What the product becomes when the factors are made a times larger or smaller (p. 13, ex. 19). */
export function productChange(rng: Rng): Made {
  const a = int(rng, 2, 9)
  const b = int(rng, 2, 9)
  const v = int(rng, 0, 2)
  const f1 = (v === 2 ? a : 1) * int(rng, 2, 15)
  const f2 = (v >= 1 ? b : 1) * int(rng, 2, 15)
  const P = f1 * f2
  const g1 = v === 2 ? f1 / a : f1 * a
  const g2 = v === 0 ? f2 * b : f2 / b
  const R = g1 * g2
  const how = [
    `primul factor se mărește de ${a} ori, iar al doilea se mărește de ${b} ori`,
    `primul factor se mărește de ${a} ori, iar al doilea se micșorează de ${b} ori`,
    `primul factor se micșorează de ${a} ori, iar al doilea se micșorează de ${b} ori`,
  ][v]
  const calc = [`${P} \\cdot ${a} \\cdot ${b} = ${R}`, `${P} \\cdot ${a} : ${b} = ${R}`, `${P} : ${a} : ${b} = ${R}`][v]
  const form = [`(m \\cdot ${a}) \\cdot (n \\cdot ${b}) = (m \\cdot n) \\cdot ${a} \\cdot ${b}`, `(m \\cdot ${a}) \\cdot (n : ${b}) = (m \\cdot n) \\cdot ${a} : ${b}`, `(m : ${a}) \\cdot (n : ${b}) = (m \\cdot n) : ${a} : ${b}`][v]
  return {
    text: `Produsul a două numere naturale este ${P}. Ce devine produsul dacă ${how}?`,
    solution: lines(`Fie factorii $m$ și $n$, cu $m \\cdot n = ${P}$. Noul produs este:`, show(form), show(calc), `(De exemplu, pentru $${f1} \\cdot ${f2}$: $${g1} \\cdot ${g2} = ${R}$.)`),
    verify: () => g1 * g2 === R && f1 * f2 === P,
  }
}

/** a·b − a·c ± g·e with b − c = g: the common factor twice (p. 14, ex. 3). */
export function factorTwoGroups(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 11, 60)
    const g = int(rng, 11, 60)
    if (a === g) continue
    const c = int(rng, 10, 99)
    const b = c + g
    const e = int(rng, 2, 19)
    const plus = rng() < 0.5
    if (!plus && e >= a) continue
    const R = g * (plus ? a + e : a - e)
    return {
      text: `Calculați, scoțând factorul comun: $${a} \\cdot ${b} - ${a} \\cdot ${c} ${plus ? '+' : '-'} ${g} \\cdot ${e}$.`,
      solution: lines(
        'Mai întâi primii doi termeni:',
        show(`${a} \\cdot ${b} - ${a} \\cdot ${c} = ${a} \\cdot (${b} - ${c}) = ${a} \\cdot ${g}`),
        `Acum ${g} este factor comun:`,
        show(`${a} \\cdot ${g} ${plus ? '+' : '-'} ${g} \\cdot ${e} = ${g} \\cdot (${a} ${plus ? '+' : '-'} ${e}) = ${g} \\cdot ${plus ? a + e : a - e} = ${R}`),
      ),
      verify: () => a * b - a * c + (plus ? 1 : -1) * g * e === R,
    }
  }
}

/** a = px + q against b = r(x + s) + tx with p = r + t: the same x terms, compare the numbers (p. 13, ex. 15). */
export function compareExprX(rng: Rng): Made {
  for (;;) {
    const r = int(rng, 2, 6)
    const t = int(rng, 1, 6)
    const s = int(rng, 1, 9)
    const p = r + t
    const q = r * s + int(rng, -9, 9)
    if (q <= 0 || q === r * s) continue
    const bigger = r * s > q ? 'b' : 'a'
    const diff = Math.abs(r * s - q)
    return {
      text: `Fie $x$ un număr natural. Care dintre numerele $a = ${p}x + ${q}$ și $b = ${r}(x + ${s}) + ${t === 1 ? '' : t}x$ este mai mare și cu cât?`,
      solution: lines(
        'Desfacem paranteza în $b$:',
        show(`b = ${r}x + ${r * s} + ${t === 1 ? '' : t}x = ${p}x + ${r * s}`),
        `Ambele numere conțin $${p}x$; comparăm ce rămâne: $${q}$ și $${r * s}$.`,
        `Deci $${bigger}$ este mai mare, cu ${diff}, oricare ar fi $x$.`,
      ),
      verify: () => range(0, 10).every((x) => (r * (x + s) + t * x) - (p * x + q) === r * s - q),
    }
  }
}

/** g·(ua + vb) (+ c) = N known: h·(ua + vb) (p. 15, ex. 7 and 18). */
export function scaleCombination(rng: Rng): Made {
  for (;;) {
    const u = int(rng, 1, 5)
    const v = int(rng, 1, 5)
    const g = int(rng, 2, 6)
    const h = int(rng, 2, 7)
    if (gcd(u, v) !== 1 || g === h) continue
    const a = int(rng, 1, 12)
    const b = int(rng, 1, 12)
    const S = u * a + v * b
    const c0 = rng() < 0.5 ? 0 : int(rng, 1, 20)
    const N = g * S + c0
    const L = poly([[g * u, 'a'], [g * v, 'b']])
    const R = poly([[h * u, 'a'], [h * v, 'b']])
    const base = poly([[u, 'a'], [v, 'b']])
    return {
      text: `Știind că $${L}${c0 ? ` + ${c0}` : ''} = ${N}$, calculați $${R}$.`,
      solution: lines(
        c0 ? `Scădem ${c0}: $${L} = ${N} - ${c0} = ${N - c0}$.` : '',
        `Scoatem factorul comun ${g}:`,
        show(`${g}(${base}) = ${N - c0}, \\text{ deci } ${base} = ${N - c0} : ${g} = ${S}`),
        'Atunci:',
        show(`${R} = ${h}(${base}) = ${h} \\cdot ${S} = ${h * S}`),
      ),
      verify: () => g * u * a + g * v * b + c0 === N && h * u * a + h * v * b === h * S,
    }
  }
}

/** ua − vb = D known; x from x + c = ku·a − kv·b, or m·x + c = … (p. 15, ex. 16). */
export function relationToX(rng: Rng): Made {
  for (;;) {
    const u = int(rng, 2, 6)
    const v = int(rng, 2, 6)
    const a = int(rng, 1, 12)
    const b = int(rng, 1, 12)
    const D = u * a - v * b
    if (D < 1 || D > 10 || u === v) continue
    const k = int(rng, 2, 6)
    const K = k * D
    const m = rng() < 0.5 ? 1 : int(rng, 2, 5)
    const c = int(rng, 1, K - 1)
    if ((K - c) % m !== 0) continue
    const x = (K - c) / m
    const lhs = `${m === 1 ? '' : m}x + ${c}`
    return {
      text: `Știind că $${u}a - ${v}b = ${D}$, aflați numărul natural $x$ din egalitatea $${lhs} = ${k * u}a - ${k * v}b$.`,
      solution: lines(
        `Scoatem factorul comun ${k} în membrul drept:`,
        show(`${k * u}a - ${k * v}b = ${k}(${u}a - ${v}b) = ${k} \\cdot ${D} = ${K}`),
        show(`${lhs} = ${K} \\Rightarrow ${m === 1 ? 'x' : `${m}x`} = ${K} - ${c} = ${K - c}${m === 1 ? '' : ` \\Rightarrow x = ${K - c} : ${m} = ${x}`}`),
      ),
      verify: () => m * x + c === k * u * a - k * v * b,
    }
  }
}

// ================= the division with remainder, pp. 18–20 (joins v-remainder) =================

/** All the numbers with the quotient equal to the remainder at d, maybe below a bound (p. 18, ex. 4, 5). */
export function equalQR(rng: Rng): Made {
  const small = rng() < 0.5
  const d = small ? int(rng, 3, 9) : int(rng, 20, 40)
  const B = small ? 0 : (d + 1) * int(rng, 3, d - 2) + int(rng, 1, d)
  const list = range(1, d - 1).map((c) => c * (d + 1)).filter((n) => small || n < B)
  return {
    text: small
      ? `Determinați toate numerele naturale nenule care, împărțite la ${d}, dau câtul egal cu restul.`
      : `Aflați toate numerele naturale nenule mai mici decât ${B} care, împărțite la ${d}, dau câtul egal cu restul.`,
    solution: lines(
      `Fie $c$ câtul și restul. Teorema împărțirii cu rest: $n = ${d} \\cdot c + c = ${d + 1} \\cdot c$, cu $c < ${d}$ (restul e mai mic decât împărțitorul) și $c \\neq 0$.`,
      small ? `Deci $c \\in \\{${range(1, d - 1).join(', ')}\\}$:` :`Cum $${d + 1} \\cdot c < ${B}$, $c$ poate fi cel mult ${list.length}:`,
      show(`n \\in \\{${list.join(', ')}\\}`),
    ),
    verify: () => {
      const brute = range(1, small ? d * d : B - 1).filter((n) => Math.floor(n / d) === n % d)
      return brute.length === list.length && brute.every((n, i) => n === list[i])
    },
  }
}

/** The smallest and the largest number giving the quotient q at d (p. 20, Test, 5). */
export function largestWithQuotient(rng: Rng): Made {
  const d = int(rng, 3, 30)
  const q = int(rng, 2, 40)
  const lo = d * q
  const hi = d * q + d - 1
  return {
    text: `Aflați cel mai mic și cel mai mare număr natural care, împărțit la ${d}, dă câtul ${q}.`,
    solution: lines(
      `Numărul este $n = ${d} \\cdot ${q} + r = ${d * q} + r$, unde restul $r$ poate fi $0, 1, \\ldots, ${d - 1}$.`,
      `Cel mai mic: pentru $r = 0$, $n = ${lo}$. Cel mai mare: pentru restul cel mai mare, $r = ${d - 1}$:`,
      show(`n = ${d * q} + ${d - 1} = ${hi}`),
    ),
    verify: () => Math.floor(lo / d) === q && Math.floor(hi / d) === q && Math.floor((lo - 1) / d) !== q && Math.floor((hi + 1) / d) !== q,
  }
}

/** The quotient k times the remainder, the remainder k times the quotient, or c more (p. 19, ex. 14–17). */
export function remainderTimesQuotient(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 4, 9)
    const k = int(rng, 2, 4)
    const c = int(rng, 1, d - 2)
    const v = int(rng, 0, 2)
    const phrase = [`câtul de ${k} ori mai mare decât restul`, `restul de ${k} ori mai mare decât câtul`, `restul cu ${c} mai mare decât câtul`][v]
    const pairs: [number, number][] = []
    if (v === 0) for (let r = 1; r < d; r++) pairs.push([k * r, r])
    else if (v === 1) for (let q = 1; k * q < d; q++) pairs.push([q, k * q])
    else for (let q = 0; q + c < d; q++) pairs.push([q, q + c])
    if (pairs.length < 2) continue
    const list = pairs.map(([q, r]) => d * q + r)
    const rule = [`c = ${k}r`, `r = ${k}c`, `r = c + ${c}`][v]
    return {
      text: `Determinați toate numerele naturale nenule care, împărțite la ${d}, dau ${phrase}.`,
      solution: lines(
        `Fie $c$ câtul și $r$ restul: $n = ${d}c + r$, cu $r < ${d}$, iar aici $${rule}$.`,
        `Perechile posibile (câtul, restul): ${pairs.map(([q, r]) => `$(${q}, ${r})$`).join(', ')}.`,
        show(`n \\in \\{${list.join(', ')}\\}`),
      ),
      verify: () => {
        const ok = (n: number) => {
          const q = Math.floor(n / d)
          const r = n % d
          return [q === k * r, r === k * q, r === q + c][v]
        }
        const brute = range(1, d * d * k + d).filter(ok)
        return brute.length === list.length && brute.every((n, i) => n === list[i])
      },
    }
  }
}

/** Two numbers: their sum (difference), and the quotient and remainder of the larger by the smaller (p. 19, ex. 18, 19). */
export function sumAndDivision(rng: Rng): Made {
  const s = int(rng, 5, 60)
  const q = int(rng, 2, 6)
  const r = int(rng, 1, s - 1)
  const big = q * s + r
  const add = rng() < 0.5
  const S = add ? big + s : big - s
  return {
    text: `Aflați două numere naturale știind că ${add ? 'suma' : 'diferența'} lor este ${S}, iar dacă împărțim numărul mai mare la cel mai mic obținem câtul ${q} și restul ${r}.`,
    solution: lines(
      `Fie $m$ numărul mic. Numărul mare este $${q}m + ${r}$.`,
      add
        ? show(`m + ${q}m + ${r} = ${S} \\Rightarrow ${q + 1}m = ${S - r} \\Rightarrow m = ${S - r} : ${q + 1} = ${s}`)
        : show(`${q}m + ${r} - m = ${S} \\Rightarrow ${q - 1 === 1 ? '' : q - 1}m = ${S - r}${q - 1 === 1 ? '' : ` \\Rightarrow m = ${S - r} : ${q - 1}`} = ${s}`),
      `Numărul mare: $${q} \\cdot ${s} + ${r} = ${big}$. Restul ${r} este mai mic decât ${s}, deci împărțirea e corectă.`,
    ),
    verify: () => Math.floor(big / s) === q && big % s === r && (add ? big + s : big - s) === S,
  }
}

/** Children on benches: k a bench leaves s standing, k + 1 a bench leaves e benches empty (p. 20, ex. 33). */
export function benchesChildren(rng: Rng): Made {
  const k = int(rng, 2, 4)
  const s = int(rng, 1, k - 1)
  const e = int(rng, 1, 3)
  const B = s + (k + 1) * e
  const n = k * B + s
  return {
    text: `Într-o sală sunt câțiva copii și câteva bănci. Dacă stau câte ${k} copii într-o bancă, ${s === 1 ? 'un copil rămâne' : `${s} copii rămân`} în picioare. Dacă stau câte ${k + 1} copii într-o bancă, ${e === 1 ? 'rămâne o bancă liberă' : `rămân ${e} bănci libere`}. Câte bănci și câți copii sunt în sală?`,
    solution: lines(
      `La a doua așezare, copiii din ${e === 1 ? 'banca rămasă liberă' : `cele ${e} bănci rămase libere`} ($${k} \\cdot ${e} = ${k * e}$) și ${s === 1 ? 'copilul care stătea' : `cei ${s} care stăteau`} în picioare s-au mutat câte unul în fiecare dintre băncile ocupate. Deci băncile ocupate sunt:`,
      show(`${k * e} + ${s} = ${k * e + s}`),
      'Toate băncile:',
      show(`${k * e + s} + ${e} = ${B}`),
      'Copiii:',
      show(`${k} \\cdot ${B} + ${s} = ${n}`),
      `Verificare: $${k + 1} \\cdot ${B - e} = ${(k + 1) * (B - e)}$.`,
    ),
    verify: () => n === (k + 1) * (B - e) && n === k * B + s,
  }
}

/** The smallest number over M whose remainder at d is one of a list (only one of them is below d) (p. 19, ex. 23). */
export function remainderFromList(rng: Rng): Made {
  const d = int(rng, 12, 40)
  const r = int(rng, 1, d - 1)
  const M = int(rng, 100, 500)
  const others = [d, d + int(rng, 1, 20), d + int(rng, 21, 60)]
  const list = shuffle(rng, [r, ...others])
  let n = M + 1
  while (n % d !== r) n++
  const c = (n - r) / d
  return {
    text: `Aflați cel mai mic număr natural mai mare decât ${M} care, împărțit la ${d}, dă ca rest unul dintre numerele ${list.join(', ')}.`,
    solution: lines(
      `Restul trebuie să fie mai mic decât împărțitorul ${d}, deci singurul rest posibil este ${r}. Numărul are forma $${d}c + ${r}$.`,
      `Căutăm cel mai mic $c$ cu $${d}c + ${r} > ${M}$: $c = ${c}$ dă $${d} \\cdot ${c} + ${r} = ${n}$, iar $c = ${c - 1}$ dă $${d * (c - 1) + r}$, prea puțin.`,
      `Numărul este ${n}.`,
    ),
    verify: () => n > M && n % d === r && (n - d <= M) && list.filter((x) => x < d).length === 1,
  }
}

/** The divisor and the quotient (both not 1) from the dividend and the remainder (p. 19, ex. 9–11). */
export function divisorPairs(rng: Rng): Made {
  for (;;) {
    const r = int(rng, 1, 6)
    const K = int(rng, 20, 120)
    const D = K + r
    const pairs = range(2, K).filter((i) => K % i === 0 && i > r && K / i >= 2).map((i) => [i, K / i])
    if (pairs.length < 2 || pairs.length > 6) continue
    return {
      text: `Determinați împărțitorul și câtul unei împărțiri, ambele diferite de 1, știind că deîmpărțitul este ${D} și restul este ${r}.`,
      solution: lines(
        `Din $${D} = i \\cdot c + ${r}$ obținem $i \\cdot c = ${D} - ${r} = ${K}$, cu împărțitorul $i > ${r}$ (mai mare decât restul).`,
        `Scriem ${K} ca produs de doi factori diferiți de 1, cu primul mai mare decât ${r}: ${pairs.map(([i, c]) => `$${i} \\cdot ${c}$`).join(', ')}.`,
        `Perechile (împărțitor, cât): ${pairs.map(([i, c]) => `$(${i}, ${c})$`).join(', ')}.`,
      ),
      verify: () => {
        const brute = range(2, D).filter((i) => D % i === r && Math.floor(D / i) >= 2)
        return brute.length === pairs.length && brute.every((i, j) => i === pairs[j][0])
      },
    }
  }
}

/** D divided by n gives the quotient q and the largest possible remainder: n (p. 19, ex. 26). */
export function divisorMaxRemainder(rng: Rng): Made {
  const n = int(rng, 5, 30)
  const q = int(rng, 2, 9)
  const D = q * n + n - 1
  return {
    text: `Aflați numărul natural $n$ știind că ${D} împărțit la $n$ dă câtul ${q} și cel mai mare rest posibil.`,
    solution: lines(
      'Cel mai mare rest la împărțirea la $n$ este $n - 1$. Atunci:',
      show(`${D} = ${q}n + n - 1 \\Rightarrow ${D} + 1 = ${q + 1}n \\Rightarrow n = ${D + 1} : ${q + 1} = ${n}`),
      `Verificare: $${D} = ${q} \\cdot ${n} + ${n - 1}$, iar ${n - 1} este cel mai mare rest la împărțirea la ${n}.`,
    ),
    verify: () => Math.floor(D / n) === q && D % n === n - 1,
  }
}

/** The sum of all the remainders (quotients) of a run of numbers divided by d (p. 19, ex. 27, 28). */
export function sumOfRemainders(rng: Rng): Made {
  const d = int(rng, 4, 12)
  const t = int(rng, 2, 10)
  const a = d * t
  const k = int(rng, 2, 6)
  const rem = rng() < 0.6
  const e = rem ? int(rng, 0, d - 1) : 0
  const b = a + k * d + e - 1
  const result = rem ? (k * d * (d - 1)) / 2 + (e * (e - 1)) / 2 : d * sum(range(t, t + k - 1))
  return {
    text: `Aflați suma tuturor ${rem ? 'resturilor' : 'câturilor'} obținute prin împărțirea numerelor $${a}; ${a + 1}; ${a + 2}; \\ldots; ${b}$ la ${d}.`,
    solution: rem
      ? lines(
          `${a} se împarte exact la ${d}, deci resturile sunt, pe rând, $0, 1, \\ldots, ${d - 1}$, apoi din nou $0, 1, \\ldots$. Sunt $${b} - ${a} + 1 = ${b - a + 1}$ numere${e ? `, adică ${k} grupe complete de câte ${d} și încă ${e}` : `, adică ${k} grupe complete de câte ${d}`}.`,
          `O grupă completă are suma resturilor $0 + 1 + \\ldots + ${d - 1} = ${(d * (d - 1)) / 2}$.`,
          e > 1 ? `Ultimele ${e} numere au resturile $0, \\ldots, ${e - 1}$, cu suma ${(e * (e - 1)) / 2}.` : '',
          show(`${k} \\cdot ${(d * (d - 1)) / 2}${e > 1 ? ` + ${(e * (e - 1)) / 2}` : ''} = ${result}`),
        )
      : lines(
          `Câtul este ${t} pentru numerele de la ${a} la ${a + d - 1} (${d} numere), ${t + 1} pentru următoarele ${d} și tot așa, până la ${t + k - 1} pentru ultimele ${d}.`,
          show(`${d} \\cdot (${range(t, t + k - 1).join(' + ')}) = ${d} \\cdot ${sum(range(t, t + k - 1))} = ${result}`),
        ),
    verify: () => sum(range(a, b).map((n) => (rem ? n % d : Math.floor(n / d)))) === result,
  }
}

// ================= powers, pp. 21–24, 29–30 (joins v-power-rules) =================

/** Fill in the blanks: 2³·… = 2⁸, …:3¹⁵ = 3⁹, (5⁸)^… = 5⁵⁶, 2¹² = (…)⁶ (p. 22, ex. 14). */
export function fillBlank(rng: Rng): Made {
  const kinds = shuffle(rng, [0, 1, 2, 3, 4]).slice(0, 3)
  const items = kinds.map((t) => {
    const b = int(rng, 2, 9)
    const p = int(rng, 2, 12)
    const q = int(rng, 2, 9)
    switch (t) {
      case 0: return { q: `${b}^{${p}} \\cdot \\ldots = ${b}^{${p + q}}`, a: `${b}^{${q}}`, why: `${p + q} - ${p} = ${q}`, ok: p + q - p === q }
      case 1: return { q: `${b}^{${p + q}} : \\ldots = ${b}^{${p}}`, a: `${b}^{${q}}`, why: `${p + q} - ${p} = ${q}`, ok: p + q - p === q }
      case 2: return { q: `(${b}^{${p}})^{\\ldots} = ${b}^{${p * q}}`, a: `${q}`, why: `${p * q} : ${p} = ${q}`, ok: (p * q) / p === q }
      case 3: return { q: `${b}^{${p * q}} = (\\ldots)^{${q}}`, a: `${b}^{${p}}`, why: `${p * q} : ${q} = ${p}`, ok: (p * q) / q === p }
      default: return { q: `\\ldots : ${b}^{${p}} = ${b}^{${q}}`, a: `${b}^{${p + q}}`, why: `${q} + ${p} = ${p + q}`, ok: q + p === p + q }
    }
  })
  return {
    text: `Completați spațiile libere: ${items.map((it, i) => `${'abc'[i]}) $${it.q}$`).join('; ')}.`,
    solution: lines(
      'La înmulțirea puterilor cu aceeași bază exponenții se adună, la împărțire se scad, iar la ridicarea unei puteri la putere se înmulțesc.',
      ...items.map((it, i) => `${'abc'[i]}) $${it.why}$, deci lipsește $${it.a}$.`),
    ),
    verify: () => items.every((it) => it.ok),
  }
}

/** a; a·r; a·r²; …: three more terms and the n-th term as a power (p. 21, ex. 6). */
export function powerSequenceTerm(rng: Rng): Made {
  const r = int(rng, 2, 5)
  const a = pick(rng, [1, 1, 2, 3, r])
  const n = int(rng, 8, 20)
  const terms = range(0, 6).map((i) => a * r ** i)
  const nth = a === 1 ? `${r}^{${n - 1}}` : a === r ? `${r}^{${n}}` : `${a} \\cdot ${r}^{${n - 1}}`
  return {
    text: `Completați șirul $${terms.slice(0, 4).join('; ')}; \\ldots$ cu încă trei termeni și scrieți al ${n}-lea termen sub formă de putere.`,
    solution: lines(
      `Fiecare termen este de ${r} ori mai mare decât cel dinainte:`,
      show(terms.join('; ')),
      `Termenul de pe locul $k$ este $${a === 1 ? '' : `${a} \\cdot `}${r}^{k-1}$, deci al ${n}-lea termen este $${nth}$.`,
    ),
    verify: () => {
      let t = a
      for (let i = 1; i < n; i++) t *= r
      return t === a * r ** (n - 1) && (a !== r || t === r ** n)
    },
  }
}

/** b^T : (b^m + b^m + … ) with b^j equal terms (p. 29, Testul 3, 4). */
export function repeatedPowerSum(rng: Rng): Made {
  const [b, j] = pick(rng, [[2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [4, 1], [5, 1]] as [number, number][])
  const k = b ** j
  const m = int(rng, 5, 20)
  const w = int(rng, 1, b === 2 ? 6 : 3)
  const T = m + j + w
  const R = b ** w
  return {
    text: `Calculați $${b}^{${T}} : (${Array(k).fill(`${b}^{${m}}`).join(' + ')})$.`,
    solution: lines(
      `În paranteză sunt ${k} termeni egali cu $${b}^{${m}}$:`,
      show(`${Array(k).fill(`${b}^{${m}}`).join(' + ')} = ${k} \\cdot ${b}^{${m}} = ${j === 1 ? '' : `${b}^{${j}} \\cdot ${b}^{${m}} = `}${b}^{${m + j}}`),
      show(`${b}^{${T}} : ${b}^{${m + j}} = ${b}^{${w}} = ${R}`),
    ),
    verify: () => {
      const big = BigInt(b) ** BigInt(T)
      return big / (BigInt(k) * BigInt(b) ** BigInt(m)) === BigInt(R) && big % (BigInt(k) * BigInt(b) ** BigInt(m)) === 0n
    },
  }
}

/** A book read p pages the first day, then k times more each day: the pages, or the days (p. 21, ex. 3). */
export function readingPages(rng: Rng): Made {
  const k = rng() < 0.6 ? 2 : 3
  const n = k === 2 ? int(rng, 5, 9) : int(rng, 4, 6)
  const p = int(rng, 1, 5)
  const terms = range(0, n - 1).map((i) => p * k ** i)
  const N = sum(terms)
  const ask = rng() < 0.5
  const name = pick(rng, NAMES)
  const first = p === 1 ? 'o pagină' : `${p} pagini`
  const times = k === 2 ? 'de două ori' : 'de trei ori'
  const G = (k ** n - 1) / (k - 1)
  return {
    text: ask
      ? `${name} a citit o carte astfel: în prima zi ${first}, iar apoi, în fiecare zi, ${times} mai multe pagini decât în ziua precedentă. Cartea are ${de(N)} pagini. În câte zile a citit-o?`
      : `${name} a citit o carte astfel: în prima zi ${first}, iar apoi, în fiecare zi, ${times} mai multe pagini decât în ziua precedentă. Câte pagini are cartea, dacă ${name} a terminat-o de citit în ${n} zile?`,
    solution: lines(
      `Paginile citite în fiecare zi: $${terms.join('; ')}$, adică $${p === 1 ? '' : `${p} \\cdot `}${k}^0, ${p === 1 ? '' : `${p} \\cdot `}${k}^1, \\ldots$`,
      ask
        ? lines(
            `Dacă a citit $n$ zile, numărul de pagini este $${p === 1 ? '' : `${p} \\cdot `}S$, cu $S = 1 + ${k} + \\ldots + ${k}^{n-1}$. Din $${k}S - S = ${k}^n - 1$ rezultă $S = ${k === 2 ? `${k}^n - 1` : `(${k}^n - 1) : 2`}$.`,
            show(`S = ${p === 1 ? '' : `${N} : ${p} = `}${G} \\Rightarrow ${k}^n = ${G}${k === 2 ? '' : ' \\cdot 2'} + 1 = ${k ** n} = ${k}^{${n}}`),
            `Cartea a fost citită în ${n} zile.`,
          )
        : lines(
            `Suma $S = 1 + ${k} + ${k}^2 + \\ldots + ${k}^{${n - 1}}$ se află din $${k}S - S = ${k}^{${n}} - 1$:`,
            show(`S = ${k === 2 ? '' : '('}${k}^{${n}} - 1${k === 2 ? '' : ') : 2'} = ${G}`),
            p === 1 ? `Cartea are ${de(N)} pagini.` : `Cartea are $${p} \\cdot ${G} = ${N}$ ${deW(N)}pagini.`,
          ),
    ),
    verify: () => sum(terms) === N && p * G === N && (!ask || sum(terms.slice(0, n - 1)) < N),
  }
}

/** b^x + b^(x+1) (+ b^(x+2)) ≤ N: the common factor, then the powers (p. 26, ex. 9). */
export function factorInequality(rng: Rng): Made {
  const b = pick(rng, [2, 2, 3])
  const three = rng() < 0.4
  const c = three ? 1 + b + b * b : 1 + b
  const t = int(rng, 2, b === 2 ? 8 : 5)
  const M = int(rng, b ** t, b ** (t + 1) - 1)
  const N = c * M
  const lhs = three ? `${b}^x + ${b}^{x+1} + ${b}^{x+2}` : `${b}^x + ${b}^{x+1}`
  const fac = three ? `(1 + ${b} + ${b * b})` : `(1 + ${b})`
  const sols = range(0, t)
  return {
    text: `Determinați numerele naturale $x$ pentru care $${lhs} \\le ${N}$.`,
    solution: lines(
      `Scoatem factorul comun $${b}^x$:`,
      show(`${b}^x \\cdot ${fac} = ${c} \\cdot ${b}^x \\le ${N} \\Rightarrow ${b}^x \\le ${N} : ${c} = ${M}`),
      `Cum $${b}^{${t}} = ${b ** t} \\le ${M} < ${b ** (t + 1)} = ${b}^{${t + 1}}$, exponentul poate fi cel mult ${t}:`,
      show(`x \\in \\{${sols.join(', ')}\\}`),
    ),
    verify: () => {
      const ok = (x: number) => sum(range(0, three ? 2 : 1).map((i) => b ** (x + i))) <= N
      return sols.every(ok) && !ok(t + 1)
    },
  }
}

/** b·b²·b³·…·bⁿ = b^(cx) or (b^g)^x: the exponents add up to Gauss's sum (p. 24, ex. 43). */
export function chainExponentEq(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 3, 5])
    const n = int(rng, 5, 30)
    const S = (n * (n + 1)) / 2
    const g = pick(rng, [2, 3])
    const asPower = rng() < 0.5 && b ** g <= 125
    const c = asPower ? g : int(rng, 2, 9)
    if (S % c !== 0) continue
    const x = S / c
    const rhs = asPower ? `${b ** g}^x` : `${b}^{${c}x}`
    return {
      text: `Aflați numărul natural $x$ pentru care $${b} \\cdot ${b}^2 \\cdot ${b}^3 \\cdot \\ldots \\cdot ${b}^{${n}} = ${rhs}$.`,
      solution: lines(
        'La înmulțirea puterilor cu aceeași bază exponenții se adună:',
        show(`${b}^{1 + 2 + \\ldots + ${n}} = ${b}^{${n} \\cdot ${n + 1} : 2} = ${b}^{${S}}`),
        asPower ? show(`${b ** g}^x = (${b}^{${g}})^x = ${b}^{${g}x}`) : '',
        show(`${c}x = ${S} \\Rightarrow x = ${S} : ${c} = ${x}`),
      ),
      verify: () => sum(range(1, n)) === c * x,
    }
  }
}

// ================= perfect squares and last digits, pp. 23–25 (joins v-perfect-squares) =================

/** The perfect squares (cubes) between two numbers (p. 24, ex. 3; p. 25, ex. 8 a). */
export function squaresBetween(rng: Rng): Made {
  const cube = rng() < 0.4
  const A = cube ? int(rng, 2, 100) : int(rng, 20, 300)
  const B = A + (cube ? int(rng, 100, 900) : int(rng, 60, 250))
  const e = cube ? 3 : 2
  const list = range(1, 40).map((k) => k ** e).filter((v) => v > A && v < B)
  const ks = range(1, 40).filter((k) => k ** e > A && k ** e < B)
  return {
    text: `Scrieți ${cube ? 'cuburile perfecte' : 'pătratele perfecte'} mai mari decât ${A} și mai mici decât ${B}.`,
    solution: lines(
      `Căutăm numerele $k^${e}$ între ${A} și ${B}: $${ks[0] - 1}^${e} = ${(ks[0] - 1) ** e}$ este prea mic, iar $${ks[ks.length - 1] + 1}^${e} = ${(ks[ks.length - 1] + 1) ** e}$ este prea mare.`,
      show(ks.map((k) => `${k}^${e} = ${k ** e}`).join(';\\; ')),
      `Sunt ${list.length} ${cube ? 'cuburi perfecte' : 'pătrate perfecte'}.`,
    ),
    verify: () => list.length >= 1 && range(A + 1, B - 1).filter((v) => Number.isInteger(Math.round(v ** (1 / e))) && Math.round(v ** (1 / e)) ** e === v).length === list.length,
  }
}

/** x² = m·n² + c, x³ = p² + q: compute, then take the root (p. 25, ex. 7). */
export function squareRootEq(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 2, 6)
    const m = int(rng, 2, 9)
    const k = int(rng, 4, 20)
    const c = k * k - m * n * n
    if (c < 1 || c > 99) continue
    const t = int(rng, 2, 6)
    const p = int(rng, 2, Math.floor(Math.sqrt(t ** 3 - 1)))
    const q = t ** 3 - p * p
    if (q < 1) continue
    return {
      text: `Determinați numărul natural $x$ dacă: a) $x^2 = ${m} \\cdot ${n}^2 + ${c}$; b) $x^3 = ${p}^2 + ${q}$.`,
      solution: lines(
        'a)',
        show(`x^2 = ${m} \\cdot ${n * n} + ${c} = ${m * n * n} + ${c} = ${k * k} = ${k}^2 \\Rightarrow x = ${k}`),
        'b)',
        show(`x^3 = ${p * p} + ${q} = ${t ** 3} = ${t}^3 \\Rightarrow x = ${t}`),
      ),
      verify: () => k * k === m * n * n + c && t ** 3 === p * p + q,
    }
  }
}

/** N as a sum of two different non-zero perfect squares, in every way (p. 25, ex. 6). */
export function sumTwoSquares(rng: Rng): Made {
  for (;;) {
    const N = int(rng, 20, 250)
    const ways = range(1, 15).filter((a) => 2 * a * a < N && isSquare(N - a * a)).map((a) => [a, Math.sqrt(N - a * a)])
    if (ways.length < 1) continue
    return {
      text: `Scrieți numărul ${N} ca sumă de două pătrate perfecte nenule diferite, în toate felurile posibile.`,
      solution: lines(
        `Pătratul mai mic, $a^2$, este mai mic decât jumătatea lui ${N}. Îl luăm pe rând și verificăm dacă $${N} - a^2$ este pătrat perfect:`,
        show(ways.map(([a, b]) => `${N} = ${a * a} + ${b * b} = ${a}^2 + ${b}^2`).join(';\\quad ')),
        ways.length === 1 ? 'Este un singur fel.' : `Sunt ${ways.length} feluri.`,
      ),
      verify: () => {
        const brute: number[][] = []
        for (let a = 1; a * a < N; a++) for (let b = a + 1; a * a + b * b <= N; b++) if (a * a + b * b === N) brute.push([a, b])
        return brute.length === ways.length && brute.every(([a, b], i) => ways[i][0] === a && ways[i][1] === b)
      },
    }
  }
}

const SQUAREFREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]

/** The digits x, y with m·xy a perfect square (p. 25, ex. 14). */
export function squareTimesTwoDigit(rng: Rng): Made {
  const m = pick(rng, SQUAREFREE)
  const list = range(1, 9).map((j) => m * j * j).filter((v) => v >= 10 && v <= 99)
  return {
    text: `Aflați cifrele $x$ și $y$ astfel încât numărul $${m} \\cdot \\overline{xy}$ să fie pătrat perfect.`,
    solution: lines(
      `În ${m} fiecare factor prim apare o singură dată, deci $\\overline{xy}$ trebuie să conțină încă o dată acești factori: $\\overline{xy} = ${m} \\cdot k^2$.`,
      `Numerele de două cifre de această formă: ${list.map((v) => `$${v} = ${m} \\cdot ${Math.sqrt(v / m)}^2$`).join(', ')}.`,
      `Deci $\\overline{xy} \\in \\{${list.join(', ')}\\}$.`,
    ),
    verify: () => {
      const brute = range(10, 99).filter((v) => isSquare(m * v))
      return brute.length === list.length && brute.every((v, i) => v === list[i]) && list.length >= 1
    },
  }
}

/** The last digit of b + b² + … + bⁿ (or 1 + b + … + bⁿ), by whole cycles of the last digits (p. 23, ex. 25, 26). */
export function lastDigitGeometric(rng: Rng): Made {
  const b = pick(rng, [2, 3, 7, 8, 4, 9])
  const n = int(rng, 20, 200)
  const one = rng() < 0.35
  const cyc: number[] = []
  let u = b % 10
  do {
    cyc.push(u)
    u = (u * b) % 10
  } while (u !== b % 10)
  const L = cyc.length
  const g = Math.floor(n / L)
  const e = n % L
  const rest = sum(cyc.slice(0, e))
  const digit = (rest + (one ? 1 : 0)) % 10
  return {
    text: `Aflați ultima cifră a numărului $${one ? '1 + ' : ''}${b} + ${b}^2 + ${b}^3 + \\ldots + ${b}^{${n}}$.`,
    solution: lines(
      `Ultimele cifre ale puterilor lui ${b} se repetă din ${L} în ${L}: $${cyc.join(', ')}$, cu suma ${sum(cyc)}, care se termină în 0.`,
      `Puterile $${b}^1, \\ldots, ${b}^{${n}}$ sunt ${n}: $${n} = ${L} \\cdot ${g}${e ? ` + ${e}` : ''}$, deci ${g} grupe complete${e ? ` și încă ${e} ${e === 1 ? 'putere' : 'puteri'}, cu ultimele cifre $${cyc.slice(0, e).join(', ')}$` : ''}.`,
      `Grupele complete dau ultima cifră 0${e ? `; puterile rămase au suma ultimelor cifre ${rest}` : ''}${one ? ', iar termenul 1 adaugă 1' : ''}.`,
      `Ultima cifră este ${digit}.`,
    ),
    verify: () => {
      let s = one ? 1 : 0
      let p = 1
      for (let i = 1; i <= n; i++) {
        p = (p * b) % 10
        s = (s + p) % 10
      }
      return s === digit
    },
  }
}

/** The digits a < b with ab + cba + m a perfect square: a factor 11 (p. 25, ex. 16). */
export function reverseSumSquare(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 1, 9)
    const j = int(rng, 0, 4)
    const m = ((11 - ((100 * c) % 11)) % 11) + 11 * j
    if (m === 0) continue
    const t = (100 * c + m) / 11
    const target = [1, 4, 9, 16].map((s) => 11 * s - t).find((v) => v >= 3 && v <= 17)
    if (target === undefined) continue
    const pairs = range(1, 9).filter((a) => target - a > a && target - a <= 9).map((a) => [a, target - a])
    if (pairs.length < 1) continue
    const K = (target + t) / 11
    return {
      text: `Aflați cifrele $a$ și $b$, cu $a < b$, astfel încât numărul $\\overline{ab} + \\overline{${c}ba} + ${m}$ să fie pătrat perfect.`,
      solution: lines(
        'Scriem numerele în baza 10:',
        show(`10a + b + ${100 * c} + 10b + a + ${m} = 11a + 11b + ${100 * c + m} = 11(a + b + ${t})`),
        `Ca să fie pătrat perfect, $a + b + ${t}$ trebuie să fie de forma $11 \\cdot k^2$. Cum $3 \\le a + b \\le 17$, singura posibilitate este $a + b + ${t} = ${11 * K}$, adică $a + b = ${target}$.`,
        `Cu $a < b$: ${pairs.map(([a, b]) => `$a = ${a}, b = ${b}$`).join('; ')}.`,
      ),
      verify: () => {
        const brute: number[][] = []
        for (let a = 1; a <= 9; a++) for (let b = a + 1; b <= 9; b++) if (isSquare(10 * a + b + 100 * c + 10 * b + a + m)) brute.push([a, b])
        return brute.length === pairs.length && brute.every(([a, b], i) => pairs[i][0] === a && pairs[i][1] === b)
      },
    }
  }
}

// ================= the arithmetic methods, pp. 30–33 (joins the method kinds) =================

/** A number k times itself is d more, or plus d is k times it (p. 31, ex. 21, 25, 26). */
export function figTimesMore(rng: Rng): Made {
  const k = int(rng, 2, 4)
  const x = int(rng, 2, 40)
  const d = (k - 1) * x
  const v = int(rng, 0, 2)
  const text = [
    `Aflați numărul natural care, înmulțit cu ${k}, este cu ${d} mai mare decât el însuși.`,
    `Aflați un număr natural știind că, dacă îl adunăm cu ${d}, obținem ${MULT[k]} său.`,
    `Aflați un număr natural știind că, dacă îl înmulțim cu ${k}, obținem același rezultat ca atunci când îl adunăm cu ${d}.`,
  ][v]
  return {
    text,
    solution: lines(
      `Reprezentăm numărul printr-un segment. ${cap(MULT[k])} lui înseamnă ${k} segmente egale, iar numărul adunat cu ${d} înseamnă un segment și încă ${d}.`,
      k === 2 ? `Deci un segment este egal cu ${d}.` : `Deci ${k - 1} segmente sunt egale cu ${d}:`,
      k === 2 ? '' : show(`${d} : ${k - 1} = ${x}`),
      `Numărul este ${x}. Verificare: $${k} \\cdot ${x} = ${k * x} = ${x} + ${d}$.`,
    ),
    verify: () => k * x === x + d,
  }
}

const THINGS = ['bomboane', 'mere', 'nuci', 'timbre']

/** One has k times as many; giving g (or eating e and the other getting f) makes them equal (p. 32, ex. 32, 33). */
export function figGiveRatio(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 6)
    const x = int(rng, 2, 20)
    const thing = pick(rng, THINGS)
    const [n1, n2] = two(rng)
    if (rng() < 0.5) {
      if (((k - 1) * x) % 2) continue
      const g = ((k - 1) * x) / 2
      return {
        text: `${n1} are de ${k} ori mai multe ${thing} decât ${n2}. Dacă ${n1} îi dă ${gen(n2)} ${de(g)} ${thing}, vor avea un număr egal de ${thing}. Câte ${thing} are fiecare?`,
        solution: lines(
          `Partea ${gen(n2)}: un segment; partea ${gen(n1)}: ${k} segmente. Diferența este de ${k === 2 ? 'un segment' : `${k - 1} segmente`}.`,
          `După ce ${n1} dă ${g}, diferența dispare: ${n1} pierde ${g}, iar ${n2} câștigă ${g}, deci diferența era $2 \\cdot ${g} = ${2 * g}$.`,
          k === 2 ? '' : show(`${2 * g} : ${k - 1} = ${x}`),
          `${n2} are ${de(x)} ${thing}, iar ${n1} are $${k} \\cdot ${x} = ${k * x}$.`,
        ),
        verify: () => k * x - g === x + g,
      }
    }
    if ((k - 1) * x < 4) continue
    const e = int(rng, 2, (k - 1) * x - 2)
    const f = (k - 1) * x - e
    return {
      text: `${n1} are de ${k} ori mai multe ${thing} decât ${n2}. Dacă ${n1} pierde ${de(e)} ${thing}, iar ${n2} primește ${de(f)} ${thing}, vor avea același număr de ${thing}. Câte ${thing} are fiecare?`,
      solution: lines(
        `Partea ${gen(n2)}: un segment; partea ${gen(n1)}: ${k} segmente. Diferența de ${k - 1} segmente este acoperită de cele ${e} pierdute și cele ${f} primite:`,
        show(`(${e} + ${f}) : ${k - 1} = ${e + f} : ${k - 1} = ${x}`),
        `${n2} are ${de(x)} ${thing}, iar ${n1} are $${k} \\cdot ${x} = ${k * x}$.`,
      ),
      verify: () => k * x - e === x + f,
    }
  }
}

const FAMILY: [string, string, string, string][] = [
  ['Un tată', 'fiul său', 'tatălui', 'fiului'],
  ['O mamă', 'fiica sa', 'mamei', 'fiicei'],
]

/** The parent d years older; in n years k times as old; or the sum of the ages and when twice (p. 32, ex. 31, 43). */
export function figAgeTimes(rng: Rng): Made {
  for (;;) {
    const [P, C, Pg, Cg] = pick(rng, FAMILY)
    if (rng() < 0.55) {
      const k = int(rng, 2, 4)
      const sf = int(rng, 6, 20)
      const n = int(rng, 2, 9)
      const s = sf - n
      const d = (k - 1) * sf
      if (s < 1 || d < 18) continue
      return {
        text: `${P} este cu ${de(d)} ani mai în vârstă decât ${C}. Peste ${de(n)} ani, vârsta ${Pg} va fi de ${k} ori mai mare decât vârsta ${Cg}. Aflați vârstele lor de acum.`,
        solution: lines(
          `Diferența de vârstă rămâne mereu de ${de(d)} ani. Peste ${de(n)} ani, vârsta ${Cg} este un segment, iar a ${Pg} ${k} segmente; diferența, de ${k - 1} segmente, este de ${de(d)} ani:`,
          show(`${d} : ${k - 1} = ${sf}`),
          `Peste ${de(n)} ani, copilul va avea ${de(sf)} ani, iar părintele $${sf} + ${d} = ${sf + d}$ de ani. Acum copilul are $${sf} - ${n} = ${s}$ ${deW(s)}ani, iar părintele $${s + d}$ de ani.`,
        ),
        verify: () => s + d + n === k * (s + n),
      }
    }
    const s = int(rng, 4, 20)
    const d = int(rng, 20, 35)
    const S = 2 * s + d
    if (d - s <= 0) continue
    return {
      text: `${P} și ${C} au împreună ${de(S)} ani. ${P === 'Un tată' ? 'Tatăl' : 'Mama'} este mai în vârstă cu ${de(d)} ani. Peste câți ani vârsta ${Pg} va fi de două ori mai mare decât vârsta ${Cg}?`,
      solution: lines(
        `Vârsta copilului: $(${S} - ${d}) : 2 = ${s}$ ${deW(s)}ani; a părintelui: $${s} + ${d} = ${s + d}$ de ani.`,
        `Când părintele are de două ori vârsta copilului, diferența de ${de(d)} ani este egală cu vârsta copilului. Deci copilul va avea ${de(d)} ani, adică peste:`,
        show(`${d} - ${s} = ${d - s} \\text{ ani}`),
      ),
      verify: () => s + d + (d - s) === 2 * (s + (d - s)) && (S - d) / 2 === s,
    }
  }
}

/** One works p a day, the other a more a day but e days fewer, the same homework (p. 32, ex. 45). */
export function figHomeworkDays(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 4, 12)
    const a = int(rng, 2, 6)
    const e = int(rng, 2, 6)
    if ((p * e) % a !== 0) continue
    const D2 = (p * e) / a
    if (D2 < 2 || D2 > 30) continue
    const D1 = D2 + e
    const T = p * D1
    return {
      text: `Un elev rezolvă ${de(p)} exerciții pe zi, iar altul cu ${a} exerciții mai mult pe zi, dar a lucrat cu ${e} zile mai puțin decât primul. Amândoi au avut aceeași temă pentru vacanță și au terminat-o. Câte zile a lucrat fiecare și câte exerciții a avut tema?`,
      solution: lines(
        `În zilele în care au lucrat amândoi, al doilea rezolvă zilnic cu ${a} exerciții mai mult. Acest plus acoperă exact ce face primul în cele ${e} zile în plus: $${p} \\cdot ${e} = ${p * e}$ ${deW(p * e)}exerciții.`,
        show(`${p * e} : ${a} = ${D2} \\text{ zile}`),
        `Primul a lucrat $${D2} + ${e} = ${D1}$ zile. Tema: $${p} \\cdot ${D1} = ${T}$ ${deW(T)}exerciții (verificare: $${p + a} \\cdot ${D2} = ${(p + a) * D2}$).`,
      ),
      verify: () => p * D1 === (p + a) * D2 && T === p * D1,
    }
  }
}

/** Roses k times the freesias, carnations d fewer than both together, T flowers (p. 33, ex. 47). */
export function figFlowers(rng: Rng): Made {
  const k = int(rng, 2, 5)
  const f = int(rng, 8, 40)
  const d = int(rng, 2, 15)
  const T = 2 * (k + 1) * f - d
  return {
    text: `La o florărie s-au adus ${de(T)} flori: trandafiri, frezii și garoafe. Au fost aduși de ${k} ori mai mulți trandafiri decât frezii, iar garoafe cu ${d} fire mai puține decât trandafiri și frezii la un loc. Câte flori de fiecare fel s-au adus?`,
    solution: lines(
      `Frezii: un segment; trandafiri: ${k} segmente; garoafe: ${k + 1} segmente fără ${d}. În total: $${2 * (k + 1)}$ segmente fără ${d}.`,
      show(`(${T} + ${d}) : ${2 * (k + 1)} = ${T + d} : ${2 * (k + 1)} = ${f}`),
      `Frezii: ${f}; trandafiri: $${k} \\cdot ${f} = ${k * f}$; garoafe: $${k * f} + ${f} - ${d} = ${(k + 1) * f - d}$.`,
    ),
    verify: () => f + k * f + (k + 1) * f - d === T,
  }
}

/** One number divided by the other gives q rest r; taking m from the first and adding n to the second makes them equal (p. 32, ex. 29). */
export function figTwoOpsEqual(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 6, 40)
    const q = int(rng, 2, 6)
    const r = int(rng, 1, s - 1)
    const big = q * s + r
    const m = int(rng, 2, Math.min(60, big - 1))
    const n = (q - 1) * s + r - m
    if (n < 2) continue
    return {
      text: `Aflați două numere naturale știind că, împărțind primul la al doilea, obținem câtul ${q} și restul ${r}, iar dacă scădem din primul ${m} și adăugăm la al doilea ${n}, numerele devin egale.`,
      solution: lines(
        `Al doilea număr: un segment; primul: ${q} segmente și încă ${r}. După schimbări sunt egale, deci diferența lor era $${m} + ${n} = ${m + n}$.`,
        `Diferența este și ${q - 1 === 1 ? 'un segment' : `${q - 1} segmente`} și încă ${r}:`,
        show(q === 2 ? `${m + n} - ${r} = ${s}` : `(${m + n} - ${r}) : ${q - 1} = ${s}`),
        `Numerele: ${big} și ${s}. Verificare: $${big} - ${m} = ${big - m} = ${s} + ${n}$.`,
      ),
      verify: () => big - m === s + n && Math.floor(big / s) === q && big % s === r,
    }
  }
}

/** Three numbers with the sum S; the second and the third divided by the first give quotients and remainders (p. 32, ex. 34, 38). */
export function figThreeDivision(rng: Rng): Made {
  for (;;) {
    const f = int(rng, 5, 30)
    const q1 = int(rng, 2, 7)
    const q2 = int(rng, 2, 7)
    const r1 = int(rng, 0, f - 1)
    const r2 = int(rng, 1, f - 1)
    if (q1 === q2) continue
    const b = q1 * f + r1
    const c = q2 * f + r2
    const S = f + b + c
    return {
      text: `Suma a trei numere naturale este ${S}. Al doilea împărțit la primul dă câtul ${q1} și restul ${r1}, iar al treilea împărțit la primul dă câtul ${q2} și restul ${r2}. Aflați numerele.`,
      solution: lines(
        `Primul număr: un segment. Al doilea: ${q1} segmente${r1 ? ` și încă ${r1}` : ''}; al treilea: ${q2} segmente și încă ${r2}. În total $${1 + q1 + q2}$ segmente și încă $${r1 + r2}$:`,
        show(`(${S} - ${r1 + r2}) : ${1 + q1 + q2} = ${f}`),
        `Numerele: ${f}, $${q1} \\cdot ${f} + ${r1} = ${b}$ și $${q2} \\cdot ${f} + ${r2} = ${c}$ (resturile sunt mai mici decât ${f}).`,
      ),
      verify: () => f + b + c === S && Math.floor(b / f) === q1 && b % f === r1 && Math.floor(c / f) === q2 && c % f === r2,
    }
  }
}

/** Three shelves (classes): after moving, the parts become equal or in a ratio (p. 33, ex. 48, 49). */
export function figThreeEqualize(rng: Rng): Made {
  if (rng() < 0.5) {
    const x = int(rng, 15, 60)
    const m = int(rng, 3, x - 2)
    const T = 4 * x
    return {
      text: `Pe trei rafturi sunt ${de(T)} cărți. Dacă ${de(m)} cărți din primul raft se mută pe al doilea raft, atunci primele două rafturi ar avea același număr de cărți, care ar fi jumătate din numărul de cărți de pe raftul al treilea. Câte cărți erau la început pe fiecare raft?`,
      solution: lines(
        'După mutare: primul și al doilea raft au câte un segment, iar al treilea 2 segmente; mutarea nu schimbă totalul. În total 4 segmente:',
        show(`${T} : 4 = ${x}`),
        `La început: primul raft $${x} + ${m} = ${x + m}$, al doilea $${x} - ${m} = ${x - m}$, al treilea $2 \\cdot ${x} = ${2 * x}$.`,
      ),
      verify: () => x + m - m === x - m + m && x + m + (x - m) + 2 * x === T,
    }
  }
  const y = int(rng, 20, 32)
  const a = int(rng, 2, 8)
  const b = int(rng, 2, 8)
  const N = 3 * y + a - b
  return {
    text: `În trei clase sunt ${de(N)} elevi. Dacă din prima clasă ar pleca ${a} elevi, iar în a treia ar veni ${b} elevi, atunci în fiecare clasă ar fi același număr de elevi. Câți elevi erau la început în fiecare clasă?`,
    solution: lines(
      `După schimbări, în cele trei clase ar fi $${N} - ${a} + ${b} = ${N - a + b}$ elevi, același număr în fiecare:`,
      show(`${N - a + b} : 3 = ${y}`),
      `La început: prima clasă $${y} + ${a} = ${y + a}$, a doua ${y}, a treia $${y} - ${b} = ${y - b}$.`,
    ),
    verify: () => y + a + y + (y - b) === N,
  }
}

const hens = (n: number) => (n === 1 ? 'o găină' : `${n} găini`)
const ducks = (n: number) => (n === 1 ? 'o rață' : `${n} rațe`)

/** Hens and ducks eat W; after buying g2 hens and a duck they eat W2: each one's food (p. 31, ex. 18). */
export function compareAfterBuying(rng: Rng): Made {
  for (;;) {
    const h = 10 * int(rng, 8, 20)
    const u = 10 * int(rng, 10, 30)
    const g = int(rng, 5, 12)
    const d = int(rng, 2, 6)
    const g2 = int(rng, 1, 3)
    if (g <= d * g2 || h === u) continue
    const W = g * h + d * u
    const W2 = W + g2 * h + u
    const X = W2 - W
    return {
      text: `${cap(hens(g))} și ${ducks(d)} mănâncă împreună ${de(W)} grame de grăunțe pe zi. După ce fermierul mai cumpără ${hens(g2)} și o rață, păsările primesc ${de(W2)} grame de grăunțe pe zi. Cât mănâncă o găină și cât mănâncă o rață pe zi?`,
      solution: lines(
        `${cap(hens(g2))} și o rață mănâncă $${W2} - ${W} = ${X}$ ${deW(X)}grame pe zi.`,
        `Înmulțim cu ${d}: ${hens(d * g2)} și ${ducks(d)} mănâncă $${X} \\cdot ${d} = ${X * d}$ ${deW(X * d)}grame. Comparăm cu prima situație, unde sunt tot ${ducks(d)}: diferența vine doar de la găini, deci ${hens(g - d * g2)} mănâncă $${W} - ${X * d} = ${W - X * d}$ ${deW(W - X * d)}grame.`,
        `O găină: $${W - X * d} : ${g - d * g2} = ${h}$ g; o rață: $${X} - ${g2 === 1 ? '' : `${g2} \\cdot `}${h} = ${u}$ g.`,
      ),
      verify: () => g * h + d * u === W && (g + g2) * h + (d + 1) * u === W2,
    }
  }
}

/** a1 x + b1 y = N1 and a2 x + y = N2: multiply the second by b1 (p. 31, ex. 19, 20). */
export function compareOneScaled(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 2, 9)
    const y = int(rng, 2, 9)
    const a1 = int(rng, 2, 4)
    const b1 = int(rng, 2, 5)
    const a2 = int(rng, 2, 5)
    if (a2 * b1 <= a1 || x === y) continue
    const N1 = a1 * x + b1 * y
    const N2 = a2 * x + y
    const water = rng() < 0.5
    const text = water
      ? `În ${a1} sticle și ${b1} bidoane încap în total ${de(N1)} litri de apă, iar în ${a2} sticle și un bidon încap ${de(N2)} litri. Ce capacitate are o sticlă și ce capacitate are un bidon?`
      : `Ai cumpărat ${a1} covrigi și ${b1} sticle cu apă și ai plătit ${de(N1)} lei. Colega ta a cumpărat ${a2} covrigi și o sticlă cu apă și a plătit ${de(N2)} lei. Cât costă un covrig și cât costă o sticlă cu apă?`
    const [X, Y, unit] = water ? ['sticle', 'bidoane', 'l'] : ['covrigi', 'sticle', 'lei']
    return {
      text,
      solution: lines(
        `Înmulțim a doua situație cu ${b1}, ca să avem tot ${b1} ${Y}: ${a2 * b1} ${X} și ${b1} ${Y} → $${N2} \\cdot ${b1} = ${N2 * b1}$ ${unit}.`,
        `Comparăm cu prima situație: diferența de $${a2 * b1} - ${a1} = ${a2 * b1 - a1}$ ${X} face $${N2 * b1} - ${N1} = ${N2 * b1 - N1}$ ${unit}.`,
        show(`${N2 * b1 - N1} : ${a2 * b1 - a1} = ${x}`),
        `${water ? 'O sticlă' : 'Un covrig'}: ${x} ${unit}; ${water ? 'un bidon' : 'o sticlă'}: $${N2} - ${a2} \\cdot ${x} = ${y}$ ${unit}.`,
      ),
      verify: () => a1 * x + b1 * y === N1 && a2 * x + y === N2,
    }
  }
}

/** Tickets: the first day a part of all and a more, the second day b; S sold: how many are left (p. 33, ex. 64). */
export function backTicketsLeft(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 5)
    const p = int(rng, 20, 150)
    const a = int(rng, 5, 30)
    const b = int(rng, 20, 200)
    const T = k * p
    const S = p + a + b
    if (T <= S) continue
    return {
      text: `La o serbare școlară s-a vândut în prima zi ${APART[k]} din numărul total de bilete și încă ${de(a)} bilete. A doua zi s-au mai vândut ${de(b)} bilete. În cele două zile s-au vândut ${de(S)} bilete. Câte bilete au mai rămas?`,
      solution: lines(
        `În prima zi s-au vândut $${S} - ${b} = ${S - b}$ ${deW(S - b)}bilete, deci ${APART[k]} din total este $${S - b} - ${a} = ${p}$.`,
        `În total au fost $${p} \\cdot ${k} = ${T}$ ${deW(T)}bilete, deci au mai rămas:`,
        show(`${T} - ${S} = ${T - S} \\text{ bilete}`),
      ),
      verify: () => T / k + a + b === S && T - S > 0,
    }
  }
}

const APARTC: Record<number, string> = { 2: 'Jumătate', 3: 'O treime', 4: 'Un sfert' }

/** A part of the pupils go to contests; a part of those and a more go to the olympiad: the pupils (p. 33, ex. 62). */
export function backContests(rng: Rng): Made {
  const k1 = int(rng, 2, 3)
  const k2 = int(rng, 2, 4)
  const a = int(rng, 2, 12)
  const y = int(rng, 2, 20)
  const F = y + a
  const N = k1 * k2 * y
  return {
    text: `${APARTC[k1]} dintre elevii claselor a V-a ale unei școli merg la concursuri școlare. ${APARTC[k2]} dintre cei care merg la concursuri și încă ${de(a)} elevi merg la olimpiada de matematică. Câți elevi sunt în clasele a V-a, dacă la olimpiadă merg ${de(F)} elevi?`,
    solution: lines(
      'Mergem invers. Fără cei ' + a + ` elevi, la olimpiadă merg $${F} - ${a} = ${y}$ elevi, adică ${APART[k2]} dintre cei de la concursuri.`,
      `La concursuri merg $${y} \\cdot ${k2} = ${y * k2}$ ${deW(y * k2)}elevi, iar în clasele a V-a sunt:`,
      show(`${y * k2} \\cdot ${k1} = ${N} \\text{ elevi}`),
    ),
    verify: () => N / k1 / k2 + a === F,
  }
}

/** One number is d more than another; a part of the larger minus m is R: the smaller (p. 33, ex. 61). */
export function backPartOfBigger(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 5)
    const R = int(rng, 5, 40)
    const m = int(rng, 2, 20)
    const big = k * (R + m)
    const d = int(rng, 3, 40)
    if (big - d < 1) continue
    return {
      text: `Un număr natural este cu ${d} mai mare decât alt număr. Dacă din ${PART[k]} numărului mai mare se scade ${m}, se obține ${R}. Care este numărul mai mic?`,
      solution: lines(
        `Mergem invers: ${PART[k]} numărului mai mare este $${R} + ${m} = ${R + m}$, deci numărul mai mare este $${R + m} \\cdot ${k} = ${big}$.`,
        show(`${big} - ${d} = ${big - d}`),
        `Numărul mai mic este ${big - d}.`,
      ),
      verify: () => big / k - m === R && big - (big - d) === d,
    }
  }
}

/** m times a number plus a, times b, plus c; N divided by the result gives q: the number (p. 33, ex. 65). */
export function backDivideInto(rng: Rng): Made {
  const m = int(rng, 2, 4)
  const x = int(rng, 2, 20)
  const a = int(rng, 1, 9)
  const b = int(rng, 2, 6)
  const c = int(rng, 1, 9)
  const R = (m * x + a) * b + c
  const q = int(rng, 2, 5)
  const N = q * R
  return {
    text: `${cap(MULT[m])} unui număr a fost mărit cu ${a}, rezultatul a fost înmulțit cu ${b}, apoi s-a adunat ${c}. Împărțind ${N} la numărul obținut, se obține câtul ${q} și restul 0. Aflați numărul.`,
    solution: lines(
      'Mergem invers, de la sfârșit:',
      show(`${N} : ${q} = ${R};\\quad ${R} - ${c} = ${R - c};\\quad ${R - c} : ${b} = ${m * x + a};\\quad ${m * x + a} - ${a} = ${m * x};\\quad ${m * x} : ${m} = ${x}`),
      `Numărul este ${x}.`,
    ),
    verify: () => N / ((m * x + a) * b + c) === q,
  }
}

// ================= the kinds =================

export const KINDS: GradeKind[] = [
  {
    id: 'v-p1-initial-tests', label: 'Teste de evaluare inițială', topic: 'Algebră', joins: 'v-recap-grade4',
    forms: {
      1: [initAgesSum, initFence, initFactorFromSum],
      2: [initPlantingRatio, initEqualBoxes, initPriceInKg],
      3: [initTripleQuarter, initSquareRectangle],
    },
  },
  {
    id: 'v-p1-numbers', label: 'Scrierea, numărarea și estimarea numerelor naturale', topic: 'Algebră', joins: 'v-writing-numbers',
    forms: {
      1: [countRange, digitCount],
      2: [countFromDigits, estimateTerm],
      3: [digitProductList, extremeFormProduct],
    },
  },
  {
    id: 'v-p1-add-sub', label: 'Adunarea și scăderea: semne, grupări, probleme', topic: 'Algebră', joins: 'v-add-sub',
    forms: { 1: [], 2: [signsPlacement, alternatingSum], 3: [notebookPackages, threeSameChange] },
  },
  {
    id: 'v-p1-multiplication', label: 'Înmulțirea: termeni asemenea, factor comun, relații', topic: 'Algebră', joins: 'v-multiplication',
    forms: { 1: [likeTerms, productChange], 2: [factorTwoGroups, compareExprX], 3: [scaleCombination, relationToX] },
  },
  {
    id: 'v-p1-remainder', label: 'Împărțirea cu rest: probleme', topic: 'Algebră', joins: 'v-remainder',
    forms: {
      1: [equalQR, largestWithQuotient],
      2: [remainderTimesQuotient, sumAndDivision, benchesChildren, remainderFromList],
      3: [divisorPairs, divisorMaxRemainder, sumOfRemainders],
    },
  },
  {
    id: 'v-p1-powers', label: 'Puteri: completări, șiruri, ecuații, inecuații', topic: 'Algebră', joins: 'v-power-rules',
    forms: { 1: [fillBlank, powerSequenceTerm], 2: [repeatedPowerSum, readingPages], 3: [factorInequality, chainExponentEq] },
  },
  {
    id: 'v-p1-squares', label: 'Pătrate și cuburi perfecte; ultima cifră', topic: 'Algebră', joins: 'v-perfect-squares',
    forms: { 1: [squaresBetween, squareRootEq], 2: [sumTwoSquares, squareTimesTwoDigit], 3: [lastDigitGeometric, reverseSumSquare] },
  },
  {
    id: 'v-p1-figurative', label: 'Metoda figurativă', topic: 'Algebră', joins: 'v-figurative-method',
    forms: {
      1: [figTimesMore, figGiveRatio],
      2: [figAgeTimes, figHomeworkDays, figFlowers],
      3: [figTwoOpsEqual, figThreeDivision, figThreeEqualize],
    },
  },
  {
    id: 'v-p1-comparison', label: 'Metoda comparației', topic: 'Algebră', joins: 'v-comparison-method',
    forms: { 1: [], 2: [compareAfterBuying, compareOneScaled], 3: [] },
  },
  {
    id: 'v-p1-backwards', label: 'Metoda mersului invers', topic: 'Algebră', joins: 'v-backwards-method',
    forms: { 1: [], 2: [backTicketsLeft, backContests], 3: [backPartOfBigger, backDivideInto] },
  },
]

export const CONTEST: ContestKind[] = []
