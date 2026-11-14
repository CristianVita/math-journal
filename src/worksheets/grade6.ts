// More kinds for grade VI, after the school syllabus: sets, prime factors with g.c.d. and l.c.m., ratios (rule of
// three, map scale, probabilities), equations and word problems, the triangle (congruence, the 30° angle, the median
// on the hypotenuse), parallel lines, bisectors and the circle. No Pythagoras, no radicals, no similarity.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, paren, pick, poly, reduce, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  id: string
  label: string
  topic: 'Algebră' | 'Geometrie'
  forms: Record<1 | 2 | 3, Form[]>
}

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const asc = (xs: number[]) => [...xs].sort((a, b) => a - b)
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
/** n different whole numbers from lo to hi, in order. */
const sample = (rng: Rng, lo: number, hi: number, n: number) => asc(shuffle(rng, range(lo, hi)).slice(0, n))
/** A set written out: \{1, 2, 3\}, or the empty set. */
const set = (xs: number[]) => (xs.length ? `\\{${xs.join(', ')}\\}` : '\\varnothing')
const card = (s: string) => `\\operatorname{card}${s.length > 1 ? `(${s})` : ` ${s}`}`

/** The prime factors of n with their exponents. */
function factorize(n: number): [number, number][] {
  const out: [number, number][] = []
  for (let p = 2; p * p <= n; p++) {
    let e = 0
    while (n % p === 0) {
      n /= p
      e++
    }
    if (e) out.push([p, e])
  }
  if (n > 1) out.push([n, 1])
  return out
}
const factTex = (n: number) => factorize(n).map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(' \\cdot ')
/** "2^2 \cdot 3 = 12", or just "5" for a prime. */
const factValue = (n: number) => (factTex(n) === String(n) ? String(n) : `${factTex(n)} = ${n}`)
/** p/q as written, then in lowest terms when it can be simplified. */
const fracEq = (p: number, q: number) => `\\frac{${p}}{${q}}${reduce(p, q)[1] !== q ? ` = ${frac(p, q)}` : ''}`
/** "3x = 12 ⇒ x = 12 : 3 = 4"; without the division when the coefficient is 1. */
const divStep = (coef: number, rhs: number) =>
  `${poly([[coef, 'x']])} = ${rhs}` + (coef === 1 ? '' : ` \\Rightarrow x = ${rhs} : ${paren(coef)} = ${frac(rhs, coef)}`)
/** A large number with thin spaces between the groups of three digits. */
const big = (n: number) => (n < 10000 ? String(n) : String(n).replace(/\B(?=(\d{3})+$)/g, '\\,'))
const arc = (s: string) => `\\overset{\\frown}{${s}}`
const NAMES = ['Ana', 'Maria', 'Ioana', 'Elena', 'Daria', 'Sofia', 'Andrei', 'Radu', 'Mihai', 'Vlad', 'Tudor', 'Matei']

// ================= sets =================

/** A ∪ B, A ∩ B, A \ B, B \ A for two sets written out. */
export function setsOperations(rng: Rng): Made {
  for (;;) {
    const A = sample(rng, 1, 15, int(rng, 4, 6))
    const B = sample(rng, 1, 15, int(rng, 4, 6))
    const inter = A.filter((x) => B.includes(x))
    const AmB = A.filter((x) => !B.includes(x))
    const BmA = B.filter((x) => !A.includes(x))
    if (!inter.length || !AmB.length || !BmA.length) continue
    const union = asc([...new Set([...A, ...B])])
    return {
      text: `Fie mulțimile $A = ${set(A)}$ și $B = ${set(B)}$. Determinați $A \\cup B$, $A \\cap B$, $A \\setminus B$ și $B \\setminus A$.`,
      solution: lines(
        'Reuniunea are elementele care sunt în cel puțin una dintre mulțimi, iar intersecția pe cele comune:',
        show(`A \\cup B = ${set(union)}, \\quad A \\cap B = ${set(inter)}`),
        'Diferența $A \\setminus B$ are elementele lui $A$ care nu sunt în $B$:',
        show(`A \\setminus B = ${set(AmB)}, \\quad B \\setminus A = ${set(BmA)}`),
      ),
      verify: () =>
        union.length === A.length + B.length - inter.length &&
        AmB.length + inter.length === A.length &&
        BmA.length + inter.length === B.length &&
        range(1, 15).every((x) => union.includes(x) === (A.includes(x) || B.includes(x))),
    }
  }
}

/** The elements of {x ∈ ℕ | a < x ≤ b} and how many they are. */
export function setsListElements(rng: Rng): Made {
  const a = int(rng, 0, 14)
  const b = a + int(rng, 3, 8)
  const [sl, sr] = [rng() < 0.5, rng() < 0.5]
  const els = range(sl ? a + 1 : a, sr ? b - 1 : b)
  const cond = `${a} ${sl ? '<' : '\\le'} x ${sr ? '<' : '\\le'} ${b}`
  return {
    text: `Scrieți elementele mulțimii $A = \\{x \\in \\mathbb{N} \\mid ${cond}\\}$ și aflați cardinalul ei.`,
    solution: lines(
      `Numerele naturale $x$ cu $${cond}$ sunt:`,
      show(`A = ${set(els)}`),
      'Numărăm elementele:',
      show(`${card('A')} = ${els[els.length - 1]} - ${els[0]} + 1 = ${els.length}`),
    ),
    verify: () => range(0, 40).filter((x) => (sl ? a < x : a <= x) && (sr ? x < b : x <= b)).join() === els.join(),
  }
}

/** card(A ∪ B) = card A + card B − card(A ∩ B), asked either way. */
export function setsCardinalUnion(rng: Rng): Made {
  const c = int(rng, 1, 12)
  const a = c + int(rng, 2, 20)
  const b = c + int(rng, 2, 20)
  const u = a + b - c
  const askUnion = rng() < 0.5
  return {
    text: askUnion
      ? `Mulțimile $A$ și $B$ au $${card('A')} = ${a}$, $${card('B')} = ${b}$ și $${card('A \\cap B')} = ${c}$. Aflați $${card('A \\cup B')}$.`
      : `Mulțimile $A$ și $B$ au $${card('A')} = ${a}$, $${card('B')} = ${b}$ și $${card('A \\cup B')} = ${u}$. Câte elemente comune au cele două mulțimi?`,
    solution: lines(
      'Elementele comune se numără o singură dată:',
      show(`${card('A \\cup B')} = ${card('A')} + ${card('B')} - ${card('A \\cap B')}`),
      askUnion
        ? show(`${card('A \\cup B')} = ${a} + ${b} - ${c} = ${u}`)
        : show(`${u} = ${a} + ${b} - ${card('A \\cap B')} \\Rightarrow ${card('A \\cap B')} = ${a + b} - ${u} = ${c}`),
    ),
    verify: () => u === a - c + (b - c) + c && c < a && c < b,
  }
}

/** The divisors of n and the multiples of k below m: intersection and difference. */
export function setsDivisorsMultiples(rng: Rng): Made {
  for (;;) {
    const n = pick(rng, [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 54, 56, 60, 63, 70, 72, 75, 80, 84, 90, 96])
    const k = int(rng, 2, 7)
    const m = int(rng, 4 * k + 1, 10 * k)
    const A = range(1, n).filter((x) => n % x === 0)
    const B = range(1, m - 1).filter((x) => x % k === 0)
    const inter = A.filter((x) => B.includes(x))
    const diff = A.filter((x) => !B.includes(x))
    if (inter.length < 1 || diff.length < 1) continue
    return {
      text: `Fie $A$ mulțimea divizorilor naturali ai numărului ${n} și $B$ mulțimea multiplilor nenuli ai lui ${k}, mai mici decât ${m}. Determinați $A \\cap B$ și $A \\setminus B$.`,
      solution: lines(
        'Scriem elementele celor două mulțimi:',
        show(`A = ${set(A)}`),
        show(`B = ${set(B)}`),
        'Alegem elementele comune, apoi pe cele din $A$ care nu sunt în $B$:',
        show(`A \\cap B = ${set(inter)}, \\quad A \\setminus B = ${set(diff)}`),
      ),
      verify: () =>
        inter.every((x) => n % x === 0 && x % k === 0 && x < m) &&
        diff.every((x) => n % x === 0 && !(x % k === 0 && x < m)) &&
        inter.length + diff.length === A.length,
    }
  }
}

const ACTIVITIES: [string, string, string][] = [
  ['joacă', 'fotbal', 'baschet'], ['joacă', 'șah', 'tenis'], ['joacă', 'handbal', 'volei'], ['învață', 'engleza', 'germana'],
  ['învață', 'franceza', 'spaniola'], ['practică', 'înotul', 'atletismul'], ['cântă', 'la pian', 'la chitară'],
]

/** A class, two activities, some do both: how many do neither. */
export function setsVennNeither(rng: Rng): Made {
  for (;;) {
    const [verb, X, Y] = pick(rng, ACTIVITIES)
    const n = int(rng, 22, 34)
    const c = int(rng, 2, 8)
    const a = c + int(rng, 3, 12)
    const b = c + int(rng, 3, 12)
    const u = a + b - c
    const r = n - u
    if (r < 2 || a === b) continue
    return {
      text: `Într-o clasă sunt ${de(n)} elevi. Dintre ei, ${a} ${verb} ${X}, ${b} ${verb} ${Y}, iar ${c} ${verb} și ${X}, și ${Y}. Câți elevi nu ${verb} nici ${X}, nici ${Y}?`,
      solution: lines(
        'Adunăm cele două grupe și scădem o dată elevii care sunt în amândouă, fiindcă i-am numărat de două ori. Numărul elevilor care fac cel puțin una dintre cele două activități este:',
        show(`${a} + ${b} - ${c} = ${u}\\text{ elevi}`),
        'Ceilalți elevi ai clasei nu fac niciuna dintre ele:',
        show(`${n} - ${u} = ${r}\\text{ elevi}`),
      ),
      verify: () => a - c + (b - c) + c + r === n,
    }
  }
}

/** {x ∈ ℤ | −a ≤ x < b} and {x ∈ ℤ | |x| ≤ c}. */
export function setsIntegerIntervals(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 7)
    const b = int(rng, 1, 7)
    const c = int(rng, 1, 5)
    const A = range(-a, b - 1)
    const B = range(-c, c)
    const inter = A.filter((x) => B.includes(x))
    const diff = A.filter((x) => !B.includes(x))
    if (!diff.length || inter.length < 2) continue
    return {
      text: `Fie mulțimile $A = \\{x \\in \\mathbb{Z} \\mid -${a} \\le x < ${b}\\}$ și $B = \\{x \\in \\mathbb{Z} \\mid |x| \\le ${c}\\}$. Scrieți elementele celor două mulțimi, apoi determinați $A \\cap B$ și $A \\setminus B$.`,
      solution: lines(
        `Condiția $|x| \\le ${c}$ înseamnă $-${c} \\le x \\le ${c}$:`,
        show(`A = ${set(A)}`),
        show(`B = ${set(B)}`),
        show(`A \\cap B = ${set(inter)}, \\quad A \\setminus B = ${set(diff)}`),
      ),
      verify: () =>
        range(-10, 10).every((x) => {
          const inA = -a <= x && x < b
          const inB = Math.abs(x) <= c
          return inter.includes(x) === (inA && inB) && diff.includes(x) === (inA && !inB)
        }),
    }
  }
}

/** A group, two languages, some speak neither: how many speak both, how many only the first. */
export function setsVennBoth(rng: Rng): Made {
  const noun = pick(rng, ['turiști', 'elevi', 'studenți'])
  const [X, Y] = pick(rng, [['engleza', 'franceza'], ['germana', 'spaniola'], ['engleza', 'germana'], ['franceza', 'italiana'], ['engleza', 'spaniola']])
  const both = int(rng, 3, 12)
  const onlyX = int(rng, 4, 20)
  const onlyY = int(rng, 4, 20)
  const c = int(rng, 2, 9)
  const n = both + onlyX + onlyY + c
  const [a, b] = [onlyX + both, onlyY + both]
  return {
    text: `Într-un grup de ${de(n)} ${noun}, ${a} vorbesc ${X}, ${b} vorbesc ${Y}, iar ${c} nu vorbesc niciuna dintre aceste două limbi. Câți ${noun} vorbesc ambele limbi? Câți vorbesc doar ${X}?`,
    solution: lines(
      'Numărul celor care vorbesc cel puțin una dintre cele două limbi este:',
      show(`${n} - ${c} = ${n - c}`),
      `Dacă adunăm pe cei care vorbesc ${X} cu cei care vorbesc ${Y}, cei care vorbesc ambele limbi sunt numărați de două ori. Deci numărul celor care vorbesc ambele limbi este:`,
      show(`${a} + ${b} - ${n - c} = ${both}`),
      `Numărul celor care vorbesc doar ${X} este:`,
      show(`${a} - ${both} = ${onlyX}`),
    ),
    verify: () => a + b - (n - c) === both && a - both === onlyX && onlyX + onlyY + both + c === n,
  }
}

/** A and B from A ∪ B, A ∩ B and A \ B. */
export function setsFromOperations(rng: Rng): Made {
  const all = shuffle(rng, range(1, 14))
  const [ni, nx, ny] = [int(rng, 2, 3), int(rng, 2, 3), int(rng, 2, 3)]
  const inter = asc(all.slice(0, ni))
  const AmB = asc(all.slice(ni, ni + nx))
  const BmA = asc(all.slice(ni + nx, ni + nx + ny))
  const union = asc([...inter, ...AmB, ...BmA])
  const A = asc([...inter, ...AmB])
  const B = asc([...inter, ...BmA])
  return {
    text: `Determinați mulțimile $A$ și $B$, știind că $A \\cup B = ${set(union)}$, $A \\cap B = ${set(inter)}$ și $A \\setminus B = ${set(AmB)}$.`,
    solution: lines(
      'Mulțimea $A$ este formată din elementele care sunt doar în $A$ și din cele comune:',
      show(`A = (A \\setminus B) \\cup (A \\cap B) = ${set(A)}`),
      'Mulțimea $B$ are toate elementele reuniunii care nu sunt doar în $A$:',
      show(`B = (A \\cup B) \\setminus (A \\setminus B) = ${set(B)}`),
    ),
    verify: () =>
      asc([...new Set([...A, ...B])]).join() === union.join() &&
      A.filter((x) => B.includes(x)).join() === inter.join() &&
      A.filter((x) => !B.includes(x)).join() === AmB.join(),
  }
}

/** A = {p, q, kx + c}, B = {q, r, s} and A ∩ B = {q, r}: x, then A ∪ B. */
export function setsParameter(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 1, 3)
    const x = int(rng, 1, 7)
    const c = int(rng, 1, 9)
    const r = k * x + c
    const others = shuffle(rng, range(1, 30).filter((v) => v !== r)).slice(0, 3)
    const [p, q, s] = others
    const term = poly([[k, 'x'], [c, '']])
    const B = shuffle(rng, [q, r, s])
    const union = asc([p, q, r, s])
    return {
      text: `Fie mulțimile $A = \\{${p}, ${q}, ${term}\\}$ și $B = ${set(B)}$, unde $x$ este un număr natural. Știind că $A \\cap B = ${set(asc([q, r]))}$, aflați $x$ și $A \\cup B$.`,
      solution: lines(
        `Numărul ${r} este în $A \\cap B$, deci este element al lui $A$. Cum ${r} nu este nici ${p}, nici ${q}, rămâne:`,
        show(`${term} = ${r} \\Rightarrow ${divStep(k, r - c)}`),
        `Atunci $A = ${set([p, q, r])}$ și:`,
        show(`A \\cup B = ${set(union)}`),
      ),
      verify: () => {
        const A = [p, q, k * x + c]
        return new Set(A).size === 3 && asc(A.filter((v) => B.includes(v))).join() === asc([q, r]).join()
      },
    }
  }
}

// ================= prime factors, g.c.d., l.c.m. =================

/** n written as a product of powers of primes, by dividing in turn. */
export function primeFactorization(rng: Rng): Made {
  for (;;) {
    const exps: [number, number][] = [[2, int(rng, 0, 4)], [3, int(rng, 0, 3)], [5, int(rng, 0, 2)], [7, int(rng, 0, 1)], [11, rng() < 0.15 ? 1 : 0]]
    const used = exps.filter(([, e]) => e > 0)
    const total = used.reduce((t, [, e]) => t + e, 0)
    const n = used.reduce((t, [p, e]) => t * p ** e, 1)
    if (used.length < 2 || total < 3 || total > 7 || n < 30 || n > 3000) continue
    const steps: string[] = []
    let m = n
    for (const [p, e] of used) for (let i = 0; i < e; i++) {
      steps.push(`${m} : ${p} = ${m / p}`)
      m /= p
    }
    const rows: string[] = []
    for (let i = 0; i < steps.length; i += 4) rows.push(show(steps.slice(i, i + 4).join(', \\quad ')))
    return {
      text: `Descompuneți în factori primi numărul ${n}.`,
      solution: lines('Împărțim pe rând la numerele prime 2, 3, 5, 7, …, cât timp împărțirea este exactă:', ...rows, 'Scriem numărul ca produs de puteri de numere prime:', show(`${n} = ${factTex(n)}`)),
      verify: () => factorize(n).reduce((t, [p, e]) => t * p ** e, 1) === n && factorize(n).every(([p]) => range(2, p - 1).every((d) => p % d !== 0)),
    }
  }
}

/** Two coprime numbers from 2 to hi, different. */
function coprimePair(rng: Rng, hi: number): [number, number] {
  for (;;) {
    const [x, y] = [int(rng, 2, hi), int(rng, 2, hi)]
    if (x !== y && gcd(x, y) === 1) return [x, y]
  }
}

/** (a, b) from the prime factors. */
export function gcdTwo(rng: Rng): Made {
  const g = pick(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 36])
  const [x, y] = coprimePair(rng, 9)
  const [a, b] = [g * x, g * y]
  return {
    text: `Calculați cel mai mare divizor comun al numerelor ${a} și ${b}.`,
    solution: lines(
      'Descompunem numerele în factori primi:',
      show(`${a} = ${factTex(a)}, \\quad ${b} = ${factTex(b)}`),
      'C.m.m.d.c. este produsul factorilor primi comuni, luați o singură dată, la puterea cea mai mică:',
      show(`(${a}, ${b}) = ${factValue(g)}`),
    ),
    verify: () => gcd(a, b) === g,
  }
}

/** [a, b] from the prime factors. */
export function lcmTwo(rng: Rng): Made {
  const g = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10, 12, 15])
  const [x, y] = coprimePair(rng, 9)
  const [a, b] = [g * x, g * y]
  const L = g * x * y
  return {
    text: `Calculați cel mai mic multiplu comun al numerelor ${a} și ${b}.`,
    solution: lines(
      'Descompunem numerele în factori primi:',
      show(`${a} = ${factTex(a)}, \\quad ${b} = ${factTex(b)}`),
      'C.m.m.m.c. este produsul factorilor primi comuni și necomuni, luați o singură dată, la puterea cea mai mare:',
      show(`[${a}, ${b}] = ${factValue(L)}`),
    ),
    verify: () => lcm(a, b) === L && L % a === 0 && L % b === 0,
  }
}

/** The g.c.d. and the l.c.m. of three numbers. */
export function gcdLcmThree(rng: Rng): Made {
  for (;;) {
    const g = pick(rng, [2, 3, 4, 5, 6, 8, 10, 12])
    const [x, y, z] = shuffle(rng, range(2, 10)).slice(0, 3)
    if (gcd(gcd(x, y), z) !== 1) continue
    const [a, b, c] = [g * x, g * y, g * z]
    const L = lcm(lcm(a, b), c)
    if (L > 2500) continue
    return {
      text: `Calculați c.m.m.d.c. și c.m.m.m.c. al numerelor ${a}, ${b} și ${c}.`,
      solution: lines(
        'Descompunem numerele în factori primi:',
        show(`${a} = ${factTex(a)}, \\quad ${b} = ${factTex(b)}, \\quad ${c} = ${factTex(c)}`),
        'Pentru c.m.m.d.c. luăm factorii comuni tuturor celor trei numere, la puterea cea mai mică:',
        show(`(${a}, ${b}, ${c}) = ${factValue(g)}`),
        'Pentru c.m.m.m.c. luăm toți factorii, comuni și necomuni, la puterea cea mai mare:',
        show(`[${a}, ${b}, ${c}] = ${factValue(L)}`),
      ),
      verify: () => gcd(gcd(a, b), c) === g && [a, b, c].every((v) => L % v === 0) && range(1, L - 1).every((v) => v % a !== 0 || v % b !== 0 || v % c !== 0),
    }
  }
}

/** How many divisors a number has, from its prime factors. */
export function divisorsCount(rng: Rng): Made {
  for (;;) {
    const primes = shuffle(rng, [2, 3, 5, 7]).slice(0, int(rng, 2, 3)).sort((u, v) => u - v)
    const exps = primes.map(() => int(rng, 1, 4))
    const n = primes.reduce((t, p, i) => t * p ** exps[i], 1)
    if (n < 36 || n > 3000 || exps.every((e) => e === 1)) continue
    const count = exps.reduce((t, e) => t * (e + 1), 1)
    return {
      text: `Descompuneți în factori primi numărul ${n} și aflați câți divizori naturali are.`,
      solution: lines(
        show(`${n} = ${factTex(n)}`),
        'Numărul divizorilor naturali se află mărind fiecare exponent cu 1 și înmulțind rezultatele:',
        show(`${exps.map((e) => `(${e} + 1)`).join(' \\cdot ')} = ${exps.map((e) => e + 1).join(' \\cdot ')} = ${count}`),
        `Numărul ${n} are ${de(count)} divizori naturali.`,
      ),
      verify: () => range(1, n).filter((d) => n % d === 0).length === count,
    }
  }
}

const BUNDLES: [string, string, string, string][] = [
  ['lalele roșii', 'lalele galbene', 'buchete', 'buchet'], ['caiete', 'creioane', 'pachete', 'pachet'], ['mere', 'pere', 'coșuri', 'coș'],
  ['bomboane', 'ciocolate', 'pungi', 'pungă'], ['portocale', 'banane', 'pachete', 'pachet'], ['garoafe albe', 'garoafe roșii', 'buchete', 'buchet'],
]

/** The largest number of identical bundles from two kinds of things: the g.c.d. */
export function gcdBundles(rng: Rng): Made {
  const [o1, o2, many, one] = pick(rng, BUNDLES)
  const g = int(rng, 6, 24)
  const [x, y] = coprimePair(rng, 7)
  const [a, b] = [g * x, g * y]
  return {
    text: `Avem ${de(a)} ${o1} și ${de(b)} ${o2}. Care este cel mai mare număr de ${many} identice care se pot face, folosindu-le pe toate? Câte ${o1} și câte ${o2} are fiecare ${one}?`,
    solution: lines(
      `Numărul de ${many} trebuie să fie divizor și al lui ${a}, și al lui ${b}. Cel mai mare este c.m.m.d.c. al lor:`,
      show(`${a} = ${factTex(a)}, \\quad ${b} = ${factTex(b)} \\Rightarrow (${a}, ${b}) = ${g}`),
      show(`${a} : ${g} = ${x}, \\quad ${b} : ${g} = ${y}`),
      `Se pot face cel mult ${de(g)} ${many}, fiecare cu ${x} ${o1} și ${y} ${o2}.`,
    ),
    verify: () => gcd(a, b) === g && a / g === x && b / g === y,
  }
}

/** Three vehicles that leave together and come back every a, b, c minutes: when they meet again. */
export function lcmVehicles(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = asc(shuffle(rng, [4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45, 48]).slice(0, 3))
    const L = lcm(lcm(a, b), c)
    if (L < 60 || L > 480 || L === c) continue
    const vehicle = pick(rng, ['autobuze', 'tramvaie', 'troleibuze'])
    const H = int(rng, 5, 9)
    const [h, m] = [Math.floor(L / 60), L % 60]
    const time = `${H + h}:${String(m).padStart(2, '0')}`
    return {
      text: `Trei ${vehicle} pleacă din aceeași stație la ora ${H}:00. Primul revine în stație la fiecare ${de(a)} minute, al doilea la fiecare ${de(b)} minute, iar al treilea la fiecare ${de(c)} minute. La ce oră se întâlnesc din nou toate trei în stație?`,
      solution: lines(
        `Numărul de minute până la următoarea întâlnire este multiplu al numerelor ${a}, ${b} și ${c}. Cel mai mic este c.m.m.m.c. al lor:`,
        show(`${a} = ${factTex(a)}, \\quad ${b} = ${factTex(b)}, \\quad ${c} = ${factTex(c)}`),
        show(`[${a}, ${b}, ${c}] = ${factValue(L)}`),
        `Cum ${de(L)} minute înseamnă ${h} h${m ? ` ${m} min` : ''}, cele trei ${vehicle} se întâlnesc din nou la ora ${time}.`,
      ),
      verify: () => [a, b, c].every((v) => L % v === 0) && range(1, L - 1).every((v) => v % a !== 0 || v % b !== 0 || v % c !== 0) && H * 60 + L === (H + h) * 60 + m,
    }
  }
}

/** A number between two bounds with the same remainder when divided by a, b and c. */
export function lcmSameRemainder(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = asc(shuffle(rng, range(3, 12)).slice(0, 3))
    const L = lcm(lcm(a, b), c)
    if (L < 30 || L > 180 || L === c) continue
    const r = int(rng, 2, a - 1)
    if (r > a - 1) continue
    const pupils = rng() < 0.5
    const k = int(rng, pupils ? Math.ceil(100 / L) : 1, pupils ? Math.max(Math.ceil(100 / L), Math.floor(900 / L)) : 5)
    const n = k * L + r
    const lo = n - int(rng, 2, L - 1)
    const hi = n + int(rng, 2, L - 1)
    return {
      text: pupils
        ? `Dacă elevii unei școli se așază în coloane de câte ${a}, de câte ${b} sau de câte ${c}, de fiecare dată rămân ${r} elevi. Câți elevi are școala, dacă numărul lor este cuprins între ${lo} și ${hi}?`
        : `Un număr natural cuprins între ${lo} și ${hi} dă restul ${r} la împărțirea cu fiecare dintre numerele ${a}, ${b} și ${c}. Aflați numărul.`,
      solution: lines(
        `Notăm numărul căutat cu $n$. Atunci $n - ${r}$ se împarte exact la ${a}, la ${b} și la ${c}, deci este multiplu al c.m.m.m.c. al lor:`,
        show(`[${a}, ${b}, ${c}] = ${factValue(L)}`),
        show(`n - ${r} \\in \\{${L}, ${2 * L}, ${3 * L}, \\ldots\\} \\Rightarrow n \\in \\{${L + r}, ${2 * L + r}, ${3 * L + r}, \\ldots\\}`),
        `Între ${lo} și ${hi} este un singur număr de acest fel:`,
        show(`n = ${k} \\cdot ${L} + ${r} = ${n}`),
      ),
      verify: () => {
        const found = range(lo, hi).filter((v) => v % a === r && v % b === r && v % c === r)
        return found.length === 1 && found[0] === n
      },
    }
  }
}

/** a + b = S and (a, b) = d: a = dx, b = dy with (x, y) = 1. */
export function gcdFromSum(rng: Rng): Made {
  const d = int(rng, 3, 18)
  const s = int(rng, 5, 12)
  const S = d * s
  const pairs = range(1, s - 1).filter((x) => x < s - x && gcd(x, s - x) === 1).map((x) => [x, s - x])
  return {
    text: `Aflați numerele naturale $a$ și $b$, cu $a < b$, știind că $a + b = ${S}$ și $(a, b) = ${d}$.`,
    solution: lines(
      `Cum $(a, b) = ${d}$, scriem $a = ${d}x$ și $b = ${d}y$, cu $x$ și $y$ prime între ele, $x < y$:`,
      show(`${d}x + ${d}y = ${S} \\Rightarrow x + y = ${S} : ${d} = ${s}`),
      `Păstrăm doar perechile cu $x < y$ și $(x, y) = 1$:`,
      show(`(x, y) \\in \\{${pairs.map(([x, y]) => `(${x}, ${y})`).join(', ')}\\}`),
      show(`(a, b) \\in \\{${pairs.map(([x, y]) => `(${d * x}, ${d * y})`).join(', ')}\\}`),
    ),
    verify: () => range(1, S - 1).filter((a) => a < S - a && gcd(a, S - a) === d).join() === pairs.map(([x]) => d * x).join(),
  }
}

// ================= ratios =================

const RATIO_CONTEXTS: { intro: (b: number, f: number) => string; first: string; second: string }[] = [
  { intro: (b, f) => `Într-o clasă sunt ${de(b)} băieți și ${de(f)} fete.`, first: 'numărul fetelor și numărul băieților', second: 'numărul fetelor și numărul elevilor clasei' },
  { intro: (b, f) => `Într-o livadă sunt ${de(b)} meri și ${de(f)} peri.`, first: 'numărul perilor și numărul merilor', second: 'numărul perilor și numărul pomilor din livadă' },
  { intro: (b, f) => `Pe un raft sunt ${de(b)} cărți de povești și ${de(f)} cărți de poezii.`, first: 'numărul cărților de poezii și numărul cărților de povești', second: 'numărul cărților de poezii și numărul tuturor cărților de pe raft' },
  { intro: (b, f) => `Într-o parcare sunt ${de(b)} mașini albe și ${de(f)} mașini negre.`, first: 'numărul mașinilor negre și numărul mașinilor albe', second: 'numărul mașinilor negre și numărul tuturor mașinilor din parcare' },
]

/** Two ratios from two counts, in lowest terms. */
export function ratioSimplify(rng: Rng): Made {
  for (;;) {
    const ctx = pick(rng, RATIO_CONTEXTS)
    const [b, f] = [int(rng, 6, 30), int(rng, 6, 30)]
    if (b === f || gcd(b, f) === 1) continue
    return {
      text: `${ctx.intro(b, f)} Aflați raportul dintre ${ctx.first}, apoi raportul dintre ${ctx.second}.`,
      solution: lines(
        'Scriem fiecare raport ca fracție și simplificăm:',
        show(`\\frac{${f}}{${b}} = ${frac(f, b)}`),
        show(`\\frac{${f}}{${b} + ${f}} = ${fracEq(f, b + f)}`),
      ),
      verify: () => reduce(f, b)[0] * b === reduce(f, b)[1] * f && reduce(f, b + f)[0] * (b + f) === reduce(f, b + f)[1] * f,
    }
  }
}

/** k kg cost c lei: how much do m kg cost. */
export function ruleOfThreeDirect(rng: Rng): Made {
  for (;;) {
    const item = pick(rng, ['mere', 'roșii', 'cartofi', 'portocale', 'cireșe', 'struguri', 'căpșuni', 'prune'])
    const k = int(rng, 2, 9)
    const m = int(rng, 3, 16)
    if (m === k) continue
    const c = (k / gcd(k, m)) * int(rng, 2, 24)
    const x = (m * c) / k
    if (c / k < 1.5 || c / k > 20) continue
    return {
      text: `${k} kg de ${item} costă ${de(c)} lei. Cât costă ${m} kg de ${item} de același fel?`,
      solution: lines(
        'Cantitatea și prețul sunt mărimi direct proporționale. Aplicăm regula de trei simplă:',
        show(`${k}\\text{ kg} \\ldots\\ldots ${c}\\text{ lei}`),
        show(`${m}\\text{ kg} \\ldots\\ldots x\\text{ lei}`),
        show(`x = \\frac{${m} \\cdot ${c}}{${k}} = ${x}\\text{ lei}`),
      ),
      verify: () => Number.isInteger(x) && x * k === m * c,
    }
  }
}

/** The probability of drawing a ball of one colour. */
export function probabilityBalls(rng: Rng): Made {
  const colours: [string, string][] = shuffle(rng, [['roșii', 'roșie'], ['albe', 'albă'], ['verzi', 'verde'], ['albastre', 'albastră'], ['negre', 'neagră'], ['galbene', 'galbenă']] as [string, string][]).slice(0, 3)
  const counts = [int(rng, 2, 12), int(rng, 2, 12), int(rng, 2, 12)]
  const which = int(rng, 0, 2)
  const total = counts[0] + counts[1] + counts[2]
  return {
    text: `Într-o urnă sunt ${counts[0]} bile ${colours[0][0]}, ${counts[1]} bile ${colours[1][0]} și ${counts[2]} bile ${colours[2][0]}. Se extrage la întâmplare o bilă. Care este probabilitatea ca bila extrasă să fie ${colours[which][1]}?`,
    solution: lines(
      'Probabilitatea este raportul dintre numărul cazurilor favorabile și numărul cazurilor posibile:',
      show(`${counts.join(' + ')} = ${total}\\text{ bile}`),
      show(`p = ${fracEq(counts[which], total)}`),
    ),
    verify: () => counts[which] < total && total === counts.reduce((t, v) => t + v, 0),
  }
}

const SCALES = [20000, 25000, 50000, 100000, 200000, 250000, 400000, 500000, 1000000, 2000000]

/** A map scale: from the map to the land, or back. */
export function mapScale(rng: Rng): Made {
  for (;;) {
    const N = pick(rng, SCALES)
    const d = int(rng, 2, 40)
    const km = (d * N) / 100000
    if (!Number.isInteger(km) || km > 600) continue
    const forward = rng() < 0.5
    return {
      text: forward
        ? `Pe o hartă cu scara $1 : ${big(N)}$, distanța dintre două orașe este de ${d} cm. Care este distanța reală dintre cele două orașe, în kilometri?`
        : `Distanța reală dintre două orașe este de ${km} km. Ce lungime are această distanță pe o hartă cu scara $1 : ${big(N)}$?`,
      solution: forward
        ? lines(
            `Scara $1 : ${big(N)}$ arată că 1 cm de pe hartă înseamnă $${big(N)}$ cm în realitate:`,
            show(`${d} \\cdot ${big(N)} = ${big(d * N)}\\text{ cm}`),
            `Cum 1 km are $100\\,000$ cm:`,
            show(`${big(d * N)} : 100\\,000 = ${km}\\text{ km}`),
          )
        : lines(
            `Transformăm distanța reală în centimetri (1 km are $100\\,000$ cm):`,
            show(`${km} \\cdot 100\\,000 = ${big(km * 100000)}\\text{ cm}`),
            `Scara $1 : ${big(N)}$ arată că distanța de pe hartă este de $${big(N)}$ ori mai mică:`,
            show(`${big(km * 100000)} : ${big(N)} = ${d}\\text{ cm}`),
          ),
      verify: () => d * N === km * 100000,
    }
  }
}

const isPrime = (n: number) => n > 1 && range(2, Math.floor(Math.sqrt(n))).every((d) => n % d !== 0)

/** A number chosen from 1 to N: the probability that it is a multiple, a square, a prime or a divisor. */
export function probabilityNumbers(rng: Rng): Made {
  const N = int(rng, 20, 60)
  const kind = pick(rng, ['mult', 'mult', 'mult', 'square', 'prime', 'divisor'])
  const k = int(rng, 2, 9)
  const all = range(1, N)
  const [prop, good] =
    kind === 'mult' ? [`divizibil cu ${k}`, all.filter((v) => v % k === 0)]
    : kind === 'square' ? ['pătrat perfect', all.filter((v) => Number.isInteger(Math.sqrt(v)))]
    : kind === 'prime' ? ['număr prim', all.filter(isPrime)]
    : [`divizor al lui ${N}`, all.filter((v) => N % v === 0)]
  const list = good.length > 9 && kind === 'mult' ? `${good[0]}, ${good[1]}, ${good[2]}, \\ldots, ${good[good.length - 1]}` : good.join(', ')
  return {
    text: `Se alege la întâmplare un număr natural de la 1 la ${N}. Care este probabilitatea ca numărul ales să fie ${prop}?`,
    solution: lines(
      'Numerele favorabile sunt:',
      show(list),
      `Sunt ${de(good.length)} cazuri favorabile din ${de(N)} cazuri posibile:`,
      show(`p = ${fracEq(good.length, N)}`),
    ),
    verify: () => good.length >= 2 && good.length === (kind === 'mult' ? Math.floor(N / k) : kind === 'square' ? Math.floor(Math.sqrt(N)) : good.length),
  }
}

/** a/p = b/q and ma + nb = S. */
export function equalRatiosCombination(rng: Rng): Made {
  for (;;) {
    const [p, q] = coprimePair(rng, 9)
    const [m, n] = [int(rng, 1, 5), int(rng, 1, 5)]
    if (m === 1 && n === 1) continue
    const k = int(rng, 2, 12)
    const S = (m * p + n * q) * k
    const [a, b] = [p * k, q * k]
    const sum = poly([[m, 'a'], [n, 'b']])
    return {
      text: `Numerele $a$ și $b$ verifică $\\frac{a}{${p}} = \\frac{b}{${q}}$ și $${sum} = ${S}$. Aflați $a$ și $b$.`,
      solution: lines(
        'Notăm cu $k$ valoarea comună a rapoartelor:',
        show(`\\frac{a}{${p}} = \\frac{b}{${q}} = k \\Rightarrow a = ${p}k, \\quad b = ${q}k`),
        'Înlocuim în a doua relație:',
        show(`${m === 1 ? '' : `${m} \\cdot `}${p}k + ${n === 1 ? '' : `${n} \\cdot `}${q}k = ${S} \\Rightarrow ${m * p + n * q}k = ${S} \\Rightarrow k = ${k}`),
        show(`a = ${p} \\cdot ${k} = ${a}, \\quad b = ${q} \\cdot ${k} = ${b}`),
      ),
      verify: () => a * q === b * p && m * a + n * b === S,
    }
  }
}

/** a/b = p/q: the value of (ma + nb)/(ua − vb). */
export function ratioExpression(rng: Rng): Made {
  for (;;) {
    const [p, q] = coprimePair(rng, 9)
    const [m, n, u, v] = [int(rng, 1, 5), int(rng, 1, 5), int(rng, 1, 5), int(rng, 1, 5)]
    const top = m * p + n * q
    const bottom = u * p - v * q
    if (bottom <= 0 || (m === u && n === v)) continue
    const c = (t: number) => (t === 1 ? '' : `${t} \\cdot `)
    return {
      text: `Dacă $\\frac{a}{b} = \\frac{${p}}{${q}}$, calculați valoarea raportului $\\frac{${poly([[m, 'a'], [n, 'b']])}}{${poly([[u, 'a'], [-v, 'b']])}}$.`,
      solution: lines(
        'Din proporție, $a$ și $b$ sunt direct proporționale cu numerele date:',
        show(`\\frac{a}{${p}} = \\frac{b}{${q}} = k \\Rightarrow a = ${p}k, \\quad b = ${q}k, \\quad k \\ne 0`),
        'Înlocuim și simplificăm cu $k$:',
        show(`\\frac{${c(m)}${p}k + ${c(n)}${q}k}{${c(u)}${p}k - ${c(v)}${q}k} = \\frac{${top}k}{${bottom}k} = ${frac(top, bottom)}`),
      ),
      verify: () => Math.abs((m * (p * 3) + n * (q * 3)) / (u * (p * 3) - v * (q * 3)) - top / bottom) < 1e-12,
    }
  }
}

/** A distance read from a map, then the time needed to travel it. */
export function mapScaleTravel(rng: Rng): Made {
  for (;;) {
    const [who, speeds] = pick(rng, [
      ['un biciclist', [12, 15, 18, 20, 24, 25]], ['un autoturism', [50, 60, 70, 75, 80, 90]], ['un tren', [60, 80, 90, 100, 120]], ['un motociclist', [40, 45, 50, 60]],
    ] as [string, number[]][])
    const v = pick(rng, speeds)
    const t = int(rng, 2, 6)
    const km = v * t
    const N = pick(rng, SCALES)
    const d = (km * 100000) / N
    if (!Number.isInteger(d) || d > 60 || d < 2) continue
    return {
      text: `Pe o hartă cu scara $1 : ${big(N)}$, distanța dintre două localități este de ${d} cm. În câte ore parcurge ${who} această distanță, dacă merge cu viteza medie de ${v} km/h?`,
      solution: lines(
        'Aflăm întâi distanța reală:',
        show(`${d} \\cdot ${big(N)} = ${big(d * N)}\\text{ cm} = ${km}\\text{ km}`),
        'Timpul este raportul dintre distanță și viteză:',
        show(`t = ${km} : ${v} = ${t}\\text{ ore}`),
      ),
      verify: () => d * N === km * 100000 && km / v === t,
    }
  }
}

/** r balls of one colour and some of another, with the probability given: how many are the others. */
export function probabilityUnknown(rng: Rng): Made {
  const [p, q] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6], [2, 7], [3, 7], [3, 8], [5, 8], [4, 9]])
  const k = int(rng, 2, 9)
  const [c1, one, c2] = pick(rng, [['roșii', 'roșie', 'albe'], ['negre', 'neagră', 'albe'], ['verzi', 'verde', 'galbene'], ['albastre', 'albastră', 'roșii'], ['albe', 'albă', 'negre']])
  const r = p * k
  const total = q * k
  const x = total - r
  return {
    text: `Într-o urnă sunt ${de(r)} bile ${c1} și câteva bile ${c2}. Probabilitatea de a extrage, la întâmplare, o bilă ${one} este $\\frac{${p}}{${q}}$. Câte bile ${c2} sunt în urnă?`,
    solution: lines(
      `Notăm cu $x$ numărul bilelor ${c2}. În urnă sunt $${r} + x$ bile, dintre care ${r} sunt favorabile:`,
      p === 1
        ? show(`\\frac{${r}}{${r} + x} = \\frac{1}{${q}} \\Rightarrow ${r} + x = ${q} \\cdot ${r} = ${total}`)
        : show(`\\frac{${r}}{${r} + x} = \\frac{${p}}{${q}} \\Rightarrow ${p} \\cdot (${r} + x) = ${q} \\cdot ${r} \\Rightarrow ${r} + x = ${q * r} : ${p} = ${total}`),
      show(`x = ${total} - ${r} = ${x}`),
      `În urnă sunt ${de(x)} bile ${c2}.`,
    ),
    verify: () => r * q === p * (r + x) && x >= 2,
  }
}

// ================= equations =================

/** ax + b = cx + d over the integers. */
export function equationBothSides(rng: Rng): Made {
  for (;;) {
    const [a, c] = [nonZero(rng, -9, 9), nonZero(rng, -9, 9)]
    const x = nonZero(rng, -12, 12)
    const b = nonZero(rng, -20, 20)
    const d = (a - c) * x + b
    if (a === c || d === 0 || Math.abs(d) > 60) continue
    return {
      text: `Rezolvați în $\\mathbb{Z}$ ecuația $${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])}$.`,
      solution: lines(
        'Trecem termenii cu $x$ în membrul stâng și numerele în membrul drept, schimbându-le semnul:',
        show(`${poly([[a, 'x'], [-c, 'x']])} = ${poly([[d, ''], [-b, '']])}`),
        show(divStep(a - c, d - b)),
        show(`S = \\{${x}\\}`),
      ),
      verify: () => a * x + b === c * x + d,
    }
  }
}

/** ax + b = c with a solution that is a fraction. */
export function equationRational(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -9, 9)
    const b = nonZero(rng, -15, 15)
    const n = nonZero(rng, -30, 30)
    if (Math.abs(a) < 2 || n % a === 0) continue
    const c = n + b
    if (c === 0) continue
    return {
      text: `Rezolvați în $\\mathbb{Q}$ ecuația $${poly([[a, 'x'], [b, '']])} = ${c}$.`,
      solution: lines(
        'Trecem numărul în membrul drept, cu semn schimbat, apoi împărțim la coeficientul lui $x$:',
        show(`${poly([[a, 'x']])} = ${c} ${b < 0 ? '+' : '-'} ${Math.abs(b)} = ${n}`),
        show(`x = ${n} : ${paren(a)} = ${frac(n, a)}`),
        show(`S = \\left\\{${frac(n, a)}\\right\\}`),
      ),
      verify: () => Math.abs(a * (n / a) + b - c) < 1e-9 && !Number.isInteger(n / a),
    }
  }
}

/** "If we add 7 to the triple of a number we get 31." */
export function equationNumberWord(rng: Rng): Made {
  const [word, k] = pick(rng, [['dublul', 2], ['triplul', 3], ['împătritul', 4], ['încincitul', 5]] as [string, number][])
  const up = rng() < 0.5
  const x = nonZero(rng, -15, 40)
  const b = int(rng, 2, 30)
  const c = k * x + (up ? b : -b)
  return {
    text: `Dacă ${up ? 'mărim' : 'micșorăm'} ${word} unui număr întreg cu ${b}, obținem $${c}$. Aflați numărul.`,
    solution: lines(
      'Notăm numărul cu $x$ și scriem ecuația:',
      show(`${k}x ${up ? '+' : '-'} ${b} = ${c} \\Rightarrow ${k}x = ${c} ${up ? '-' : '+'} ${b} = ${c + (up ? -b : b)}`),
      show(`x = ${paren(k * x)} : ${k} = ${x}`),
    ),
    verify: () => k * x + (up ? b : -b) === c,
  }
}

/** a(x + b) − c(x − d) = e over the integers. */
export function equationParentheses(rng: Rng): Made {
  for (;;) {
    const [a, c] = [int(rng, 2, 7), int(rng, 2, 7)]
    const [b, d] = [int(rng, 1, 9), int(rng, 1, 9)]
    const x = nonZero(rng, -12, 12)
    if (a === c) continue
    const e = a * (x + b) - c * (x - d)
    const k = a * b + c * d
    return {
      text: `Rezolvați în $\\mathbb{Z}$ ecuația $${a}(x + ${b}) - ${c}(x - ${d}) = ${e}$.`,
      solution: lines(
        'Desfacem parantezele, cu atenție la semnul din fața celei de-a doua:',
        show(`${poly([[a, 'x'], [a * b, ''], [-c, 'x'], [c * d, '']])} = ${e}`),
        'Reducem termenii asemenea și izolăm necunoscuta:',
        show(`${poly([[a - c, 'x'], [k, '']])} = ${e} \\Rightarrow ${poly([[a - c, 'x']])} = ${e} - ${k}`),
        show(divStep(a - c, e - k)),
        show(`S = \\{${x}\\}`),
      ),
      verify: () => a * (x + b) - c * (x - d) === e && (e - k) / (a - c) === x,
    }
  }
}

/** x/a ± x/b = c, with a whole solution. */
export function equationFractions(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 2, 9), int(rng, 2, 9)]
    if (a === b) continue
    const plus = rng() < 0.5
    const L = lcm(a, b)
    const x = L * nonZero(rng, -4, 4)
    const coef = L / a + (plus ? L / b : -L / b)
    const c = x / a + (plus ? x / b : -x / b)
    return {
      text: `Rezolvați în $\\mathbb{Q}$ ecuația $\\frac{x}{${a}} ${plus ? '+' : '-'} \\frac{x}{${b}} = ${c}$.`,
      solution: lines(
        `Înmulțim ecuația cu numitorul comun, $[${a}, ${b}] = ${L}$:`,
        show(`${poly([[L / a, 'x'], [plus ? L / b : -L / b, 'x']])} = ${paren(c)} \\cdot ${L}`),
        show(divStep(coef, c * L)),
        show(`S = \\{${x}\\}`),
      ),
      verify: () => Math.abs(x / a + (plus ? 1 : -1) * (x / b) - c) < 1e-9 && Number.isInteger(c) && coef * x === c * L,
    }
  }
}

/** Two children have S lei together; one has d more than k times the other. */
export function equationMoneyWord(rng: Rng): Made {
  const [n1, n2] = shuffle(rng, NAMES)
  const [word, k] = pick(rng, [['dublul', 2], ['triplul', 3], ['împătritul', 4]] as [string, number][])
  const y = int(rng, 5, 60)
  const d = int(rng, 2, 30)
  const first = k * y + d
  const S = y + first
  return {
    text: `${n1} și ${n2} au împreună ${de(S)} lei. ${n1} are cu ${de(d)} lei mai mult decât ${word} sumei pe care o are ${n2}. Câți lei are fiecare?`,
    solution: lines(
      `Notăm cu $x$ suma pe care o are ${n2}. Atunci ${n1} are $${k}x + ${d}$ lei:`,
      show(`x + ${k}x + ${d} = ${S} \\Rightarrow ${k + 1}x = ${S} - ${d} = ${S - d} \\Rightarrow x = ${S - d} : ${k + 1} = ${y}`),
      show(`${k} \\cdot ${y} + ${d} = ${first}`),
      `${n2} are ${de(y)} lei, iar ${n1} are ${de(first)} lei.`,
    ),
    verify: () => y + first === S && first - k * y === d,
  }
}

/** (p/q)x + r = (s/t)x + u over the rationals. */
export function equationFractionCoefficients(rng: Rng): Made {
  for (;;) {
    const [q, t] = [int(rng, 2, 6), int(rng, 2, 6)]
    const [p, s] = [int(rng, 1, 7), int(rng, 1, 7)]
    if (gcd(p, q) !== 1 || gcd(s, t) !== 1 || q === t) continue
    const [r, u] = [nonZero(rng, -9, 9), nonZero(rng, -9, 9)]
    const L = lcm(q, t)
    const D = (p * L) / q - (s * L) / t
    const R = L * (u - r)
    if (D === 0 || R === 0) continue
    const [xn, xd] = reduce(R, D)
    if (xd > 12 || Math.abs(xn) > 60) continue
    const side = (a: number, b: number, c: number) => `\\frac{${a}}{${b}}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}`
    return {
      text: `Rezolvați în $\\mathbb{Q}$ ecuația $${side(p, q, r)} = ${side(s, t, u)}$.`,
      solution: lines(
        `Înmulțim ecuația cu numitorul comun, $[${q}, ${t}] = ${L}$, ca să scăpăm de numitori:`,
        show(`${poly([[(p * L) / q, 'x'], [r * L, '']])} = ${poly([[(s * L) / t, 'x'], [u * L, '']])}`),
        'Trecem termenii cu $x$ în stânga și numerele în dreapta:',
        show(`${poly([[(p * L) / q, 'x'], [(-s * L) / t, 'x']])} = ${poly([[u * L, ''], [-r * L, '']])}`),
        show(`${poly([[D, 'x']])} = ${R}${D === 1 ? '' : ` \\Rightarrow x = ${R} : ${paren(D)} = ${frac(R, D)}`}`),
        show(`S = \\left\\{${frac(xn, xd)}\\right\\}`),
      ),
      verify: () => Math.abs((p / q) * (xn / xd) + r - ((s / t) * (xn / xd) + u)) < 1e-9,
    }
  }
}

const PARTS: [number, number][] = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6]]

/** A part of the money on the first day, a part of the rest on the second, and what is left. */
export function equationSpending(rng: Rng): Made {
  const name = pick(rng, NAMES)
  const [p1, a] = pick(rng, PARTS)
  const [p2, b] = pick(rng, PARTS)
  const t = int(rng, 2, 12)
  const x = a * b * t
  const rest1 = (x * (a - p1)) / a
  const R = (rest1 * (b - p2)) / b
  const [kn, kd] = reduce((a - p1) * (b - p2), a * b)
  return {
    text: `${name} cheltuiește în prima zi $\\frac{${p1}}{${a}}$ din suma pe care o are, iar a doua zi $\\frac{${p2}}{${b}}$ din rest. Îi rămân ${de(R)} lei. Ce sumă a avut la început?`,
    solution: lines(
      'Notăm cu $x$ suma de la început. După prima zi rămâne:',
      show(`x - \\frac{${p1}}{${a}}x = ${frac(a - p1, a)}x`),
      `A doua zi cheltuiește $\\frac{${p2}}{${b}}$ din rest, deci îi rămâne $${frac(b - p2, b)}$ din rest:`,
      show(`${frac(b - p2, b)} \\cdot ${frac(a - p1, a)}x = ${frac(kn, kd)}x`),
      show(`${frac(kn, kd)}x = ${R} \\Rightarrow x = ${R} : ${frac(kn, kd)} = ${R} \\cdot ${frac(kd, kn)} = ${x}\\text{ lei}`),
    ),
    verify: () => {
      const afterFirst = x - (x * p1) / a
      return Number.isInteger(afterFirst) && afterFirst - (afterFirst * p2) / b === R && R >= 2
    },
  }
}

const FAMILY: { old: string; young: string; oldG: string; youngG: string; gap: [number, number]; ks: number[] }[] = [
  { old: 'Tatăl', young: 'fiul său', oldG: 'tatălui', youngG: 'fiului', gap: [24, 36], ks: [2, 3] },
  { old: 'Mama', young: 'fiica sa', oldG: 'mamei', youngG: 'fiicei', gap: [22, 34], ks: [2, 3] },
  { old: 'Bunicul', young: 'nepotul său', oldG: 'bunicului', youngG: 'nepotului', gap: [48, 62], ks: [3, 4, 5] },
  { old: 'Bunica', young: 'nepoata sa', oldG: 'bunicii', youngG: 'nepoatei', gap: [46, 60], ks: [3, 4, 5] },
]

/** In how many years will the father be k times as old as the son. */
export function equationAges(rng: Rng): Made {
  for (;;) {
    const f = pick(rng, FAMILY)
    const k = pick(rng, f.ks)
    const m = int(rng, 6, 40)
    const gap = (k - 1) * m
    if (gap < f.gap[0] || gap > f.gap[1]) continue
    const x = int(rng, 2, 12)
    const F = m - x
    const T = k * m - x
    if (F < 2) continue
    return {
      text: `${f.old} are ${de(T)} ani, iar ${f.young} are ${de(F)} ani. Peste câți ani vârsta ${f.oldG} va fi de ${k} ori mai mare decât vârsta ${f.youngG}?`,
      solution: lines(
        `Notăm cu $x$ numărul de ani căutat. Atunci vârstele vor fi $${T} + x$ și $${F} + x$:`,
        show(`${T} + x = ${k}(${F} + x) \\Rightarrow ${T} + x = ${k * F} + ${k}x`),
        show(`${T} - ${k * F} = ${k}x - x \\Rightarrow ${k === 2 ? '' : `${k - 1}x = ${T - k * F} \\Rightarrow `}x = ${x}`),
        `Peste ${de(x)} ani: $${T + x} = ${k} \\cdot ${F + x}$.`,
      ),
      verify: () => T + x === k * (F + x) && x > 0,
    }
  }
}

// ================= the triangle =================

/** An isosceles triangle from its perimeter and its base. */
export function trianglePerimeterIsosceles(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 4, 30)
    const a = int(rng, 5, 40)
    if (2 * a <= b || a === b) continue
    const P = 2 * a + b
    return {
      text: `Triunghiul isoscel $ABC$ cu $AB = AC$ are perimetrul de ${P} cm și baza $BC = ${b}$ cm. Aflați lungimea laturii $AB$.`,
      solution: lines(
        'Perimetrul este suma laturilor, iar $AB = AC$:',
        show(`2 \\cdot AB + ${b} = ${P} \\Rightarrow 2 \\cdot AB = ${P - b} \\Rightarrow AB = ${a}\\text{ cm}`),
      ),
      verify: () => a + a + b === P && a + a > b,
    }
  }
}

/** The other acute angle of a right triangle. */
export function triangleRightAcute(rng: Rng): Made {
  const b = int(rng, 10, 80)
  const [X, Y] = rng() < 0.5 ? ['B', 'C'] : ['C', 'B']
  return {
    text: `În triunghiul $ABC$ dreptunghic în $A$, $\\angle ${X} = ${b}^\\circ$. Aflați măsura unghiului $${Y}$.`,
    solution: lines(
      'Unghiurile ascuțite ale unui triunghi dreptunghic sunt complementare:',
      show(`\\angle ${Y} = 90^\\circ - ${b}^\\circ = ${90 - b}^\\circ`),
    ),
    verify: () => 90 + b + (90 - b) === 180 && 90 - b > 0,
  }
}

/** Two sides known, the third a whole number: its smallest and largest value, from the triangle inequality. */
export function triangleInequality(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 3, 30), int(rng, 3, 30)]
    if (a === b) continue
    const [lo, hi] = [Math.abs(a - b) + 1, a + b - 1]
    const [big, small] = [Math.max(a, b), Math.min(a, b)]
    return {
      text: `În triunghiul $ABC$, $AB = ${a}$ cm și $AC = ${b}$ cm, iar lungimea laturii $BC$, măsurată în centimetri, este un număr natural. Aflați cea mai mică și cea mai mare valoare pe care o poate avea $BC$.`,
      solution: lines(
        'Într-un triunghi, fiecare latură este mai mică decât suma celorlalte două:',
        show(`BC < AB + AC = ${a} + ${b} = ${a + b}`),
        show(`${big} < BC + ${small} \\Rightarrow BC > ${big} - ${small} = ${big - small}`),
        `Deci $${big - small} < BC < ${a + b}$: cea mai mică valoare este ${lo} cm, iar cea mai mare este ${hi} cm.`,
      ),
      verify: () => {
        const ok = range(1, 100).filter((c) => c < a + b && a < b + c && b < a + c)
        return ok[0] === lo && ok[ok.length - 1] === hi
      },
    }
  }
}

/** The leg opposite the 30° angle is half the hypotenuse, either way. */
export function triangleThirty(rng: Rng): Made {
  const k = int(rng, 2, 45)
  const fromHyp = rng() < 0.5
  return {
    text: fromHyp
      ? `În triunghiul $ABC$ dreptunghic în $A$, $\\angle C = 30^\\circ$ și $BC = ${2 * k}$ cm. Aflați lungimea laturii $AB$ și măsura unghiului $B$.`
      : `În triunghiul $ABC$ dreptunghic în $A$, $\\angle C = 30^\\circ$ și $AB = ${k}$ cm. Aflați lungimea ipotenuzei $BC$ și măsura unghiului $B$.`,
    solution: lines(
      'Într-un triunghi dreptunghic, cateta opusă unghiului de $30^\\circ$ este jumătate din ipotenuză. Cateta opusă unghiului $C$ este $AB$:',
      fromHyp ? show(`AB = \\frac{BC}{2} = \\frac{${2 * k}}{2} = ${k}\\text{ cm}`) : show(`BC = 2 \\cdot AB = 2 \\cdot ${k} = ${2 * k}\\text{ cm}`),
      show(`\\angle B = 90^\\circ - 30^\\circ = 60^\\circ`),
    ),
    verify: () => Math.abs(2 * k * Math.sin(Math.PI / 6) - k) < 1e-9,
  }
}

/** The median on the hypotenuse is half of it, and it makes two isosceles triangles. */
export function triangleMedianHypotenuse(rng: Rng): Made {
  const n = 2 * int(rng, 3, 40)
  const b = int(rng, 20, 70)
  return {
    text: `În triunghiul $ABC$ dreptunghic în $A$, punctul $M$ este mijlocul lui $BC$, $BC = ${n}$ cm și $\\angle B = ${b}^\\circ$. Aflați lungimea medianei $AM$ și măsura unghiului $AMB$.`,
    solution: lines(
      'Într-un triunghi dreptunghic, mediana corespunzătoare ipotenuzei este jumătate din ipotenuză:',
      show(`AM = \\frac{BC}{2} = \\frac{${n}}{2} = ${n / 2}\\text{ cm}`),
      `Cum $AM = MB = ${n / 2}$ cm, triunghiul $AMB$ este isoscel, cu unghiurile de la baza $AB$ egale:`,
      show(`\\angle MAB = \\angle B = ${b}^\\circ \\Rightarrow \\angle AMB = 180^\\circ - 2 \\cdot ${b}^\\circ = ${180 - 2 * b}^\\circ`),
    ),
    verify: () => {
      // in coordinates: A(0, 0), B(c, 0), C(0, d), with the angle B given
      const c = n * Math.cos((b * Math.PI) / 180)
      const d = n * Math.sin((b * Math.PI) / 180)
      const M = [c / 2, d / 2]
      const AM = Math.hypot(M[0], M[1])
      const cos = (-M[0] * (c - M[0]) + -M[1] * (0 - M[1])) / (AM * Math.hypot(c - M[0], M[1]))
      return Math.abs(AM - n / 2) < 1e-9 && Math.abs((Math.acos(cos) * 180) / Math.PI - (180 - 2 * b)) < 1e-6
    },
  }
}

/** Two congruent triangles: the perimeter and an angle of the second from the data of both. */
export function triangleCongruent(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 30, 100)
    const B = int(rng, 25, 110)
    const C = 180 - A - B
    if (C < 25 || A === B || B === C || A === C) continue
    const s1 = int(rng, 4, 15)
    const s2 = s1 + int(rng, 1, 6)
    const s3 = s2 + int(rng, 1, 5)
    if (s1 + s2 <= s3) continue
    // the larger side lies opposite the larger angle: BC opposite A, AC opposite B, AB opposite C
    const order = [A, B, C].map((v) => [A, B, C].filter((w) => w < v).length)
    const [bc, ac, ab] = order.map((i) => [s1, s2, s3][i])
    const P = ab + bc + ac
    return {
      text: `Triunghiurile $ABC$ și $MNP$ sunt congruente, $\\triangle ABC \\equiv \\triangle MNP$. Se știe că $AB = ${ab}$ cm, $BC = ${bc}$ cm, $MP = ${ac}$ cm, $\\angle A = ${A}^\\circ$ și $\\angle N = ${B}^\\circ$. Aflați perimetrul triunghiului $MNP$ și măsura unghiului $P$.`,
      solution: lines(
        'În triunghiuri congruente, laturile și unghiurile care își corespund sunt congruente, în ordinea în care sunt scrise vârfurile:',
        show(`MN = AB = ${ab}\\text{ cm}, \\quad NP = BC = ${bc}\\text{ cm}, \\quad \\angle M = \\angle A = ${A}^\\circ`),
        show(`P_{MNP} = MN + NP + MP = ${ab} + ${bc} + ${ac} = ${P}\\text{ cm}`),
        show(`\\angle P = 180^\\circ - \\angle M - \\angle N = 180^\\circ - ${A}^\\circ - ${B}^\\circ = ${C}^\\circ`),
      ),
      verify: () => A + B + C === 180 && ab + bc > ac && ab + ac > bc && bc + ac > ab && (A > B) === (bc > ac) && (B > C) === (ac > ab),
    }
  }
}

/** An isosceles triangle with an angle of 120°: the base angles are 30°, the height is half the leg. */
export function triangleIsosceles120(rng: Rng): Made {
  const k = int(rng, 2, 45)
  return {
    text: `În triunghiul isoscel $ABC$ cu $AB = AC = ${2 * k}$ cm și $\\angle A = 120^\\circ$, se duce $AD \\perp BC$, cu $D \\in BC$. Aflați măsura unghiului $B$ și lungimea înălțimii $AD$.`,
    solution: lines(
      'Unghiurile de la bază sunt egale:',
      show(`\\angle B = \\angle C = \\frac{180^\\circ - 120^\\circ}{2} = 30^\\circ`),
      'În triunghiul $ABD$, dreptunghic în $D$, cateta $AD$ este opusă unghiului de $30^\\circ$, deci este jumătate din ipotenuza $AB$:',
      show(`AD = \\frac{AB}{2} = \\frac{${2 * k}}{2} = ${k}\\text{ cm}`),
    ),
    verify: () => Math.abs(2 * k * Math.cos(Math.PI / 3) - k) < 1e-9,
  }
}

/** The angle between the bisectors of B and C. */
export function triangleBisectors(rng: Rng): Made {
  for (;;) {
    const [u, v] = [int(rng, 10, 40), int(rng, 10, 40)]
    const A = 180 - 2 * u - 2 * v
    if (A < 20 || u === v) continue
    return {
      text: `În triunghiul $ABC$, $\\angle A = ${A}^\\circ$ și $\\angle B = ${2 * u}^\\circ$. Bisectoarele unghiurilor $B$ și $C$ se intersectează în punctul $I$. Aflați măsura unghiului $BIC$.`,
      solution: lines(
        'Aflăm întâi unghiul $C$:',
        show(`\\angle C = 180^\\circ - ${A}^\\circ - ${2 * u}^\\circ = ${2 * v}^\\circ`),
        'Bisectoarele împart unghiurile în jumătăți:',
        show(`\\angle IBC = ${2 * u}^\\circ : 2 = ${u}^\\circ, \\quad \\angle ICB = ${2 * v}^\\circ : 2 = ${v}^\\circ`),
        'În triunghiul $BIC$:',
        show(`\\angle BIC = 180^\\circ - ${u}^\\circ - ${v}^\\circ = ${180 - u - v}^\\circ`),
      ),
      verify: () => 180 - u - v === 90 + A / 2,
    }
  }
}

/** A right triangle with 60°, and the height on the hypotenuse: the 30° theorem twice. */
export function triangleHeightThirty(rng: Rng): Made {
  const k = int(rng, 2, 40)
  const fromBD = rng() < 0.5
  return {
    text: fromBD
      ? `În triunghiul $ABC$ dreptunghic în $A$, $\\angle B = 60^\\circ$, $AD \\perp BC$, cu $D \\in BC$, și $BD = ${k}$ cm. Aflați lungimile segmentelor $AB$, $BC$ și $CD$.`
      : `În triunghiul $ABC$ dreptunghic în $A$, $\\angle B = 60^\\circ$, $AD \\perp BC$, cu $D \\in BC$, și $BC = ${4 * k}$ cm. Aflați lungimile segmentelor $AB$, $BD$ și $CD$.`,
    solution: fromBD
      ? lines(
          'În triunghiul $ABD$, dreptunghic în $D$, $\\angle BAD = 90^\\circ - 60^\\circ = 30^\\circ$, deci cateta $BD$ este jumătate din ipotenuza $AB$:',
          show(`AB = 2 \\cdot BD = 2 \\cdot ${k} = ${2 * k}\\text{ cm}`),
          'În triunghiul $ABC$, $\\angle C = 90^\\circ - 60^\\circ = 30^\\circ$, deci cateta $AB$ este jumătate din ipotenuza $BC$:',
          show(`BC = 2 \\cdot AB = ${4 * k}\\text{ cm}`),
          show(`CD = BC - BD = ${4 * k} - ${k} = ${3 * k}\\text{ cm}`),
        )
      : lines(
          'În triunghiul $ABC$, $\\angle C = 90^\\circ - 60^\\circ = 30^\\circ$, deci cateta $AB$ este jumătate din ipotenuza $BC$:',
          show(`AB = \\frac{BC}{2} = ${2 * k}\\text{ cm}`),
          'În triunghiul $ABD$, dreptunghic în $D$, $\\angle BAD = 90^\\circ - 60^\\circ = 30^\\circ$, deci cateta $BD$ este jumătate din ipotenuza $AB$:',
          show(`BD = \\frac{AB}{2} = ${k}\\text{ cm}`),
          show(`CD = BC - BD = ${4 * k} - ${k} = ${3 * k}\\text{ cm}`),
        ),
    verify: () => {
      const AB = 4 * k * Math.cos(Math.PI / 3)
      const BD = AB * Math.cos(Math.PI / 3)
      return Math.abs(AB - 2 * k) < 1e-9 && Math.abs(BD - k) < 1e-9
    },
  }
}

/** An isosceles triangle with two sides known: one or two perimeters. */
export function triangleIsoscelesTwoSides(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 3, 20)
    const both = rng() < 0.5
    const b = both ? int(rng, a + 1, 2 * a - 1) : int(rng, 2 * a, 2 * a + 12)
    if (b <= a) continue
    const [x, y] = rng() < 0.5 ? [a, b] : [b, a]
    return {
      text: `Un triunghi isoscel are două laturi cu lungimile de ${x} cm și ${y} cm. Aflați perimetrul triunghiului, analizând toate cazurile.`,
      solution: lines(
        `Cazul 1: laturile egale au câte ${b} cm. Laturile sunt ${b} cm, ${b} cm și ${a} cm, iar $${b} < ${b} + ${a}$, deci triunghiul există:`,
        show(`P = ${b} + ${b} + ${a} = ${2 * b + a}\\text{ cm}`),
        `Cazul 2: laturile egale au câte ${a} cm. Laturile sunt ${a} cm, ${a} cm și ${b} cm.`,
        both
          ? lines(`Cum $${b} < ${a} + ${a} = ${2 * a}$, triunghiul există:`, show(`P = ${a} + ${a} + ${b} = ${2 * a + b}\\text{ cm}`), `Perimetrul este de ${2 * b + a} cm sau de ${2 * a + b} cm.`)
          : lines(`Cum $${a} + ${a} = ${2 * a} ${2 * a === b ? '=' : '<'} ${b}$, un astfel de triunghi nu există.`, `Perimetrul este de ${2 * b + a} cm.`),
      ),
      verify: () => (a + a > b) === both && b + b > a,
    }
  }
}

// ================= parallel lines, bisectors, the circle =================

const PAIRS: { given: string; rel: string; rule: string; equal: boolean }[] = [
  { given: 'interne', rel: 'altern intern', rule: 'Unghiurile alterne interne formate de două drepte paralele cu o secantă sunt congruente', equal: true },
  { given: 'interne', rel: 'corespondent', rule: 'Unghiurile corespondente formate de două drepte paralele cu o secantă sunt congruente', equal: true },
  { given: 'interne', rel: 'intern de aceeași parte a secantei', rule: 'Unghiurile interne de aceeași parte a secantei, formate de două drepte paralele cu o secantă, sunt suplementare', equal: false },
  { given: 'externe', rel: 'altern extern', rule: 'Unghiurile alterne externe formate de două drepte paralele cu o secantă sunt congruente', equal: true },
  { given: 'externe', rel: 'corespondent', rule: 'Unghiurile corespondente formate de două drepte paralele cu o secantă sunt congruente', equal: true },
  { given: 'externe', rel: 'extern de aceeași parte a secantei', rule: 'Unghiurile externe de aceeași parte a secantei, formate de două drepte paralele cu o secantă, sunt suplementare', equal: false },
]

/** Two parallel lines and a secant: the angle paired with a given one. */
export function parallelAngles(rng: Rng): Made {
  const pair = pick(rng, PAIRS)
  const x = int(rng, 20, 160)
  const r = pair.equal ? x : 180 - x
  return {
    text: `Dreptele paralele $a$ și $b$ sunt tăiate de secanta $d$. Unul dintre unghiurile ${pair.given} formate are măsura de $${x}^\\circ$. Aflați măsura unghiului ${pair.rel} cu acesta.`,
    solution: pair.equal
      ? `${pair.rule}, deci unghiul căutat are tot $${x}^\\circ$.`
      : lines(`${pair.rule}:`, show(`180^\\circ - ${x}^\\circ = ${r}^\\circ`)),
    verify: () => (pair.equal ? r === x : r + x === 180) && r > 0,
  }
}

/** A chord and two radii: the diameter and the perimeter of AOB. */
export function circleChordTriangle(rng: Rng): Made {
  const r = int(rng, 3, 30)
  const c = int(rng, 2, 2 * r - 1)
  return {
    // without the word for the triangle: the figure reader would draw a triangle ABC for it
    text: `Punctele $A$ și $B$ sunt pe cercul de centru $O$ și rază ${r} cm, iar coarda $AB$ are ${c} cm. Aflați diametrul cercului și suma lungimilor segmentelor $OA$, $OB$ și $AB$.`,
    solution: lines(
      'Diametrul este dublul razei:',
      show(`d = 2 \\cdot ${r} = ${2 * r}\\text{ cm}`),
      'Segmentele $OA$ și $OB$ sunt raze:',
      show(`OA + OB + AB = ${r} + ${r} + ${c} = ${2 * r + c}\\text{ cm}`),
    ),
    verify: () => c < 2 * r && r + r + c === 2 * r + c,
  }
}

/** A bisector: the whole angle and its supplement. */
export function bisectorSupplement(rng: Rng): Made {
  const a = int(rng, 12, 85)
  return {
    text: `Semidreapta $OM$ este bisectoarea unghiului $AOB$, iar $\\angle AOM = ${a}^\\circ$. Aflați măsura unghiului $AOB$ și măsura suplementului său.`,
    solution: lines(
      'Bisectoarea împarte unghiul în două unghiuri congruente:',
      show(`\\angle AOB = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ`),
      show(`180^\\circ - ${2 * a}^\\circ = ${180 - 2 * a}^\\circ`),
    ),
    verify: () => 2 * a < 180,
  }
}

/** A central angle: the two arcs and the angle at the base of the isosceles triangle. */
export function circleCentralAngle(rng: Rng): Made {
  const a = 2 * int(rng, 10, 85)
  return {
    text: `Punctele $A$ și $B$ sunt pe cercul de centru $O$, iar $\\angle AOB = ${a}^\\circ$. Aflați măsura arcului mic $AB$, măsura arcului mare $AB$ și măsura unghiului $OAB$.`,
    solution: lines(
      'Arcul mic are măsura unghiului la centru corespunzător, iar cele două arce au împreună $360^\\circ$:',
      show(`${arc('AB')} = ${a}^\\circ, \\quad 360^\\circ - ${a}^\\circ = ${360 - a}^\\circ`),
      'Cum $OA = OB$ (raze), triunghiul $AOB$ este isoscel:',
      show(`\\angle OAB = \\angle OBA = \\frac{180^\\circ - ${a}^\\circ}{2} = ${(180 - a) / 2}^\\circ`),
    ),
    verify: () => a + 2 * ((180 - a) / 2) === 180 && Number.isInteger((180 - a) / 2) && a < 180,
  }
}

/** The perpendicular bisector of BC meets AC in D: DB = DC, so the perimeter of ABD is AB + AC. */
export function perpendicularBisector(rng: Rng): Made {
  for (;;) {
    const ab = int(rng, 4, 30)
    const ac = ab + int(rng, 1, 15)
    const bc = int(rng, 4, 40)
    if (bc <= ac - ab || bc >= ac + ab) continue
    return {
      text: `În triunghiul $ABC$, $AB = ${ab}$ cm, $AC = ${ac}$ cm și $BC = ${bc}$ cm. Mediatoarea laturii $BC$ intersectează latura $AC$ în punctul $D$. Aflați perimetrul triunghiului $ABD$.`,
      solution: lines(
        'Orice punct de pe mediatoarea unui segment este egal depărtat de capetele segmentului. Cum $D$ este pe mediatoarea lui $BC$:',
        show(`DB = DC`),
        'Atunci, fiindcă $D$ este pe latura $AC$:',
        show(`P_{ABD} = AB + BD + DA = AB + DC + DA = AB + AC = ${ab} + ${ac} = ${ab + ac}\\text{ cm}`),
      ),
      verify: () => {
        // in coordinates: B(0, 0), C(bc, 0), D on AC with x = bc / 2
        const x = (ab * ab - ac * ac + bc * bc) / (2 * bc)
        const y = Math.sqrt(ab * ab - x * x)
        const t = (bc / 2 - x) / (bc - x)
        const D = [bc / 2, y * (1 - t)]
        const per = ab + Math.hypot(D[0], D[1]) + Math.hypot(D[0] - x, D[1] - y)
        return t > 0 && t < 1 && Math.abs(per - (ab + ac)) < 1e-9
      },
    }
  }
}

/** The angle between the bisectors of two adjacent angles. */
export function bisectorsAdjacent(rng: Rng): Made {
  for (;;) {
    const [a, b] = [2 * int(rng, 8, 70), 2 * int(rng, 8, 70)]
    if (a + b > 180 || a === b) continue
    return {
      text: `Unghiurile $AOB$ și $BOC$ sunt adiacente, cu $\\angle AOB = ${a}^\\circ$ și $\\angle BOC = ${b}^\\circ$. Semidreapta $OM$ este bisectoarea unghiului $AOB$, iar semidreapta $ON$ este bisectoarea unghiului $BOC$. Aflați măsura unghiului $MON$.`,
      solution: lines(
        'Fiecare bisectoare împarte unghiul său în două unghiuri congruente:',
        show(`\\angle MOB = ${a}^\\circ : 2 = ${a / 2}^\\circ, \\quad \\angle BON = ${b}^\\circ : 2 = ${b / 2}^\\circ`),
        'Semidreapta $OB$ este între $OM$ și $ON$:',
        show(`\\angle MON = ${a / 2}^\\circ + ${b / 2}^\\circ = ${(a + b) / 2}^\\circ`),
      ),
      verify: () => a / 2 + b / 2 === (a + b) / 2 && (a + b) / 2 <= 90,
    }
  }
}

/** The distance from a point on a side of a 30° angle to the other side. */
export function distanceThirty(rng: Rng): Made {
  const k = int(rng, 2, 60)
  return {
    text: `Punctul $A$ este pe una dintre laturile unui unghi cu vârful $O$ și măsura de $30^\\circ$, iar $OA = ${2 * k}$ cm. Aflați distanța de la punctul $A$ la cealaltă latură a unghiului.`,
    solution: lines(
      'Distanța este lungimea perpendicularei $AB$ duse din $A$ pe cealaltă latură, cu $B$ pe acea latură. Triunghiul $OAB$ este dreptunghic în $B$, iar cateta $AB$ este opusă unghiului de $30^\\circ$, deci este jumătate din ipotenuza $OA$:',
      show(`AB = \\frac{OA}{2} = \\frac{${2 * k}}{2} = ${k}\\text{ cm}`),
    ),
    verify: () => Math.abs(2 * k * Math.sin(Math.PI / 6) - k) < 1e-9,
  }
}

/** Two angles made by parallel lines and a secant, written with x: supplementary or equal. */
export function parallelAnglesEquation(rng: Rng): Made {
  for (;;) {
    const equal = rng() < 0.4
    const [p, r] = [int(rng, 1, 6), int(rng, 1, 6)]
    const x = int(rng, 5, 30)
    const first = int(rng, 30, 150)
    const second = equal ? first : 180 - first
    const q = first - p * x
    const s = second - r * x
    if (q === 0 || s === 0 || Math.abs(q) > 60 || Math.abs(s) > 60) continue
    if (equal && p <= r) continue
    const e1 = poly([[p, 'x'], [q, '']])
    const e2 = poly([[r, 'x'], [s, '']])
    const value = (k: number, c: number, v: number) => `${k === 1 ? '' : `${k} \\cdot `}${x} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${v}^\\circ`
    return {
      text: `Dreptele paralele $a$ și $b$ sunt tăiate de secanta $d$. Două unghiuri ${equal ? 'alterne interne' : 'interne de aceeași parte a secantei'} au măsurile $(${e1})^\\circ$ și $(${e2})^\\circ$. Aflați $x$ și măsurile celor două unghiuri.`,
      solution: lines(
        equal ? 'Unghiurile alterne interne formate de drepte paralele cu o secantă sunt congruente:' : 'Unghiurile interne de aceeași parte a secantei, formate de drepte paralele, sunt suplementare:',
        equal
          ? show(`${e1} = ${e2} \\Rightarrow ${poly([[p, 'x'], [-r, 'x']])} = ${poly([[s, ''], [-q, '']])} \\Rightarrow ${divStep(p - r, s - q)}`)
          : show(`(${e1}) + (${e2}) = 180 \\Rightarrow ${poly([[p + r, 'x'], [q + s, '']])} = 180 \\Rightarrow ${divStep(p + r, 180 - q - s)}`),
        'Măsurile unghiurilor sunt:',
        show(`${value(p, q, first)}, \\quad ${value(r, s, second)}`),
      ),
      verify: () => p * x + q === first && r * x + s === second && (equal ? first === second : first + second === 180),
    }
  }
}

/** A bisector and a parallel in a triangle make an isosceles triangle. */
export function parallelBisectorTriangle(rng: Rng): Made {
  const b = int(rng, 10, 70)
  const n = int(rng, 3, 30)
  return {
    text: `În triunghiul $ABC$, $\\angle ABC = ${2 * b}^\\circ$. Fie $D \\in AC$ astfel încât $BD$ este bisectoarea unghiului $ABC$ și $E \\in AB$ astfel încât $DE \\parallel BC$. Știind că $BE = ${n}$ cm, aflați măsurile unghiurilor triunghiului $BDE$ și lungimea segmentului $DE$.`,
    solution: lines(
      'Cum $BD$ este bisectoare:',
      show(`\\angle EBD = \\angle DBC = ${2 * b}^\\circ : 2 = ${b}^\\circ`),
      'Dreptele $DE$ și $BC$ sunt paralele, iar $BD$ este secantă, deci unghiurile alterne interne sunt congruente:',
      show(`\\angle EDB = \\angle DBC = ${b}^\\circ`),
      show(`\\angle BED = 180^\\circ - ${b}^\\circ - ${b}^\\circ = ${180 - 2 * b}^\\circ`),
      'Triunghiul $BDE$ are două unghiuri congruente, deci este isoscel, cu baza $BD$:',
      show(`DE = BE = ${n}\\text{ cm}`),
    ),
    verify: () => b + b + (180 - 2 * b) === 180 && 180 - 2 * b > 0,
  }
}

/** Triples p, q, r for three arcs: their sum divides 360, and the first arc is even and below 180°. */
const ARCS: [number, number, number][] = []
for (const p of range(1, 11)) for (const q of range(1, 11)) for (const r of range(1, 11)) {
  const s = p + q + r
  if (360 % s !== 0 || gcd(gcd(p, q), r) !== 1 || (p === q && q === r)) continue
  const first = (360 / s) * p
  if (first < 180 && first % 2 === 0) ARCS.push([p, q, r])
}

/** Three points cut a circle into arcs proportional to three numbers. */
export function circleArcsProportional(rng: Rng): Made {
  const [p, q, r] = pick(rng, ARCS)
  const s = p + q + r
  const k = 360 / s
  const [x, y, z] = [p * k, q * k, r * k]
  return {
    text: `Punctele $A$, $B$ și $C$ împart un cerc de centru $O$ în trei arce, $${arc('AB')}$, $${arc('BC')}$ și $${arc('CA')}$, cu măsurile direct proporționale cu numerele ${p}, ${q} și ${r}. Aflați măsurile celor trei arce și măsura unghiului $OAB$.`,
    solution: lines(
      'Cele trei arce au împreună $360^\\circ$:',
      show(`${arc('AB')} = ${p === 1 ? '' : p}k, \\quad ${arc('BC')} = ${q === 1 ? '' : q}k, \\quad ${arc('CA')} = ${r === 1 ? '' : r}k \\Rightarrow ${s}k = 360^\\circ \\Rightarrow k = ${k}^\\circ`),
      show(`${arc('AB')} = ${x}^\\circ, \\quad ${arc('BC')} = ${y}^\\circ, \\quad ${arc('CA')} = ${z}^\\circ`),
      `Unghiul la centru $AOB$ are măsura arcului $AB$, adică $${x}^\\circ$. Cum $OA = OB$ (raze), triunghiul $AOB$ este isoscel:`,
      show(`\\angle OAB = \\frac{180^\\circ - ${x}^\\circ}{2} = ${(180 - x) / 2}^\\circ`),
    ),
    verify: () => x + y + z === 360 && x * q === y * p && y * r === z * q && x < 180 && Number.isInteger((180 - x) / 2),
  }
}

// ================= the kinds =================

export const KINDS: GradeKind[] = [
  {
    id: 'vi-sets', label: 'Mulțimi: operații, cardinal, probleme', topic: 'Algebră',
    forms: {
      1: [setsOperations, setsListElements, setsCardinalUnion],
      2: [setsDivisorsMultiples, setsVennNeither, setsIntegerIntervals],
      3: [setsVennBoth, setsFromOperations, setsParameter],
    },
  },
  {
    id: 'vi-gcd-lcm', label: 'Factori primi, c.m.m.d.c. și c.m.m.m.c.', topic: 'Algebră',
    forms: {
      1: [primeFactorization, gcdTwo, lcmTwo],
      2: [gcdLcmThree, divisorsCount, gcdBundles],
      3: [lcmVehicles, lcmSameRemainder, gcdFromSum],
    },
  },
  {
    id: 'vi-ratios', label: 'Rapoarte, regula de trei simplă, scara hărții, probabilități', topic: 'Algebră',
    forms: {
      1: [ratioSimplify, ruleOfThreeDirect, probabilityBalls],
      2: [mapScale, probabilityNumbers, equalRatiosCombination],
      3: [ratioExpression, mapScaleTravel, probabilityUnknown],
    },
  },
  {
    id: 'vi-equations', label: 'Ecuații și probleme rezolvate cu ecuații', topic: 'Algebră',
    forms: {
      1: [equationBothSides, equationRational, equationNumberWord],
      2: [equationParentheses, equationFractions, equationMoneyWord],
      3: [equationFractionCoefficients, equationSpending, equationAges],
    },
  },
  {
    id: 'vi-triangle', label: 'Triunghiul: laturi, congruență, triunghiul dreptunghic', topic: 'Geometrie',
    forms: {
      1: [trianglePerimeterIsosceles, triangleRightAcute, triangleInequality],
      2: [triangleThirty, triangleMedianHypotenuse, triangleCongruent, triangleIsosceles120],
      3: [triangleBisectors, triangleHeightThirty, triangleIsoscelesTwoSides],
    },
  },
  {
    id: 'vi-lines-circle', label: 'Drepte paralele, bisectoare, mediatoare, cercul', topic: 'Geometrie',
    forms: {
      1: [parallelAngles, circleChordTriangle, bisectorSupplement],
      2: [circleCentralAngle, perpendicularBisector, bisectorsAdjacent, distanceThirty],
      3: [parallelAnglesEquation, parallelBisectorTriangle, circleArcsProportional],
    },
  },
]
