// Grade V kinds from "Matematică, clasa a V-a", Mate 2000+ Consolidare (Paralela 45), pp. 184–206, photographed by the
// user on 14 November 2026: chapter 6, "Recapitulare și sistematizare prin teste" (the three tests on ordinary
// fractions, the self-assessment test, the applied problems and the recap tests 1–14), then the problems given at
// school contests (Gazeta Matematică, olympiads). The tests have no stars, so the levels follow the content: the short
// answers (I–IV) are levels 1–2, the full solutions (V) and the B parts of tests 11–14 are level 3. `KINDS` and
// `CONTEST` are registered in `generators.ts`.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

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
/** contest level only: problems from the performance / olympiad / Gazeta pages */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up: 20\,347. */
const nr = (n: number) => {
  const s = String(n)
  return s.replace(/^-/, '').length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')
}
/** A number in the prose: plain below 1 000, in a formula from 1 000 up, so that it gets its thin space. */
const N = (n: number) => (Math.abs(n) >= 1000 ? `$${nr(n)}$` : String(n))
/** A number before a noun in the prose: "19 elevi", "20 de elevi", "$1\,200$ de lei". */
const deN = (n: number) => N(n) + (de(n) === String(n) ? '' : ' de')
/** The word "de" alone, after a formula that ends with the number: "$… = 120$ de pagini". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
/** A count of lei: "1 leu", "5 lei", "20 de lei". */
const lei = (n: number) => (n === 1 ? '1 leu' : `${deN(n)} lei`)
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
/** A decimal number with the Romanian comma, for a formula: 2{,}5 */
const dec = (x: number) => String(Math.round(x * 100) / 100).replace('.', '{,}')
/** c·v, with the coefficient 1 left out: "3b", "b". */
const cv = (c: number, v: string) => (c === 1 ? v : `${c}${v}`)
const close = (x: number, y: number) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let f = 2; f * f <= n; f++) if (n % f === 0) return false
  return true
}
const smallestFactor = (n: number) => {
  for (let f = 2; f * f <= n; f++) if (n % f === 0) return f
  return n
}
const digitSum = (n: number) => sum(String(n).split('').map(Number))

const GIRLS: Record<string, string> = {
  Ana: 'Anei', Maria: 'Mariei', Ioana: 'Ioanei', Elena: 'Elenei', Irina: 'Irinei', Daria: 'Dariei', Ina: 'Inei',
  Sonia: 'Soniei', Cristina: 'Cristinei', Alexandra: 'Alexandrei', Bianca: 'Biancăi', Sara: 'Sarei',
}
const BOYS = ['Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Matei', 'Luca', 'Bogdan', 'Ionuț', 'Claudiu', 'Alex']
const girl = (rng: Rng) => pick(rng, Object.keys(GIRLS))
const boy = (rng: Rng) => pick(rng, BOYS)
/** The genitive (and dative) of a name: "Anei", "lui Mihai". */
const gen = (name: string) => GIRLS[name] ?? `lui ${name}`
/** A part of a whole, as Romanian says it: "jumătate", "o treime", "$\frac{2}{3}$". */
const FR: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'o pătrime', 5: 'o cincime', 6: 'o șesime', 7: 'o șeptime', 8: 'o optime' }
const part = (p: number, q: number) => (p === 1 ? FR[q] : `$\\frac{${p}}{${q}}$`)
/** "două", "trei", … for a small count before a feminine noun ("de două ori"). */
const TIMES = ['', 'o', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă']

// ================= exact fractions =================

type Q = [number, number]
const val = (a: Q) => a[0] / a[1]
const add = (a: Q, b: Q): Q => reduce(a[0] * b[1] + b[0] * a[1], a[1] * b[1])
const sub = (a: Q, b: Q): Q => reduce(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const mul = (a: Q, b: Q): Q => reduce(a[0] * b[0], a[1] * b[1])
const div = (a: Q, b: Q): Q => reduce(a[0] * b[1], a[1] * b[0])
const F = (a: Q) => frac(a[0], a[1])
/** The inverse of a fraction, in LaTeX. */
const inv = (a: Q) => frac(a[1], a[0])
/** A fraction as a mixed number when it is improper: 3\frac{1}{8}. */
const M = (a: Q) => {
  const [p, d] = reduce(a[0], a[1])
  if (d === 1 || p < d) return frac(p, d)
  const w = Math.floor(p / d)
  return `${w}\\frac{${p - w * d}}{${d}}`
}
/** A result: the irreducible fraction, then the mixed number when it is improper. */
const R = (a: Q) => (M(a) === F(a) ? F(a) : `${F(a)} = ${M(a)}`)
/** \frac{n}{d} as written, then simplified when it can be. */
const simp = (n: number, d: number) => {
  const raw = d === 1 ? String(n) : `\\frac{${n}}{${d}}`
  return raw === frac(n, d) ? raw : `${raw} = ${frac(n, d)}`
}
/** A proper irreducible fraction with the denominator from lo to hi. */
const prop = (rng: Rng, lo: number, hi: number): Q => {
  for (;;) {
    const d = int(rng, lo, hi)
    const p = int(rng, 1, d - 1)
    if (gcd(p, d) === 1) return [p, d]
  }
}
/** An improper fraction, not whole, written in the statement as a mixed number: w p/d. */
const mixed = (rng: Rng, lo: number, hi: number, wmax: number): Q => {
  const [p, d] = prop(rng, lo, hi)
  return [int(rng, 1, wmax) * d + p, d]
}
/** A mixed number turned into a fraction, for the solution: 3\frac{1}{8} = \frac{25}{8}. */
const unmix = (a: Q) => `${M(a)} = ${F(a)}`

// ================= fractions: multiplication, division, powers (Testele 1–3, pp. 184–188) =================

/** The fraction k times larger than a/b, and m times smaller than c/d, p. 185, Testul 2, II.2. */
export function fracTimesLarger(rng: Rng): Made {
  const [a, b] = prop(rng, 3, 15)
  const k = int(rng, 2, 9)
  const [c, d] = prop(rng, 2, 12)
  const m = int(rng, 2, 9)
  const big = reduce(a * k, b)
  const small = reduce(c, d * m)
  return {
    text: lines(`a) Aflați fracția ordinară de ${k} ori mai mare decât $\\frac{${a}}{${b}}$.`, `b) Aflați fracția ordinară de ${m} ori mai mică decât $\\frac{${c}}{${d}}$.`),
    solution: lines(
      'a) Înmulțim fracția cu numărul dat:',
      show(`\\frac{${a}}{${b}} \\cdot ${k} = \\frac{${a} \\cdot ${k}}{${b}} = ${R(big)}`),
      'b) Împărțim fracția la numărul dat, adică înmulțim numitorul cu el:',
      show(`\\frac{${c}}{${d}} : ${m} = \\frac{${c}}{${d} \\cdot ${m}} = ${F(small)}`),
    ),
    verify: () => close((a / b) * k, val(big)) && close(c / d / m, val(small)),
  }
}

/** The double (triple), the half (third, quarter) and the square (cube) of fractions, p. 187, Testul 3, IV. */
export function fracDoubleThirdSquare(rng: Rng): Made {
  for (;;) {
    const x = mixed(rng, 2, 9, 2)
    const y: Q = [int(rng, 2, 25), int(rng, 2, 9)]
    if (gcd(y[0], y[1]) !== 1) continue
    const [k, kw] = pick(rng, [[2, 'dublul'], [3, 'triplul']] as const)
    const [p, pw] = pick(rng, [[2, 'jumătatea'], [3, 'treimea'], [4, 'sfertul']] as const)
    const [e, ew] = pick(rng, [[2, 'pătratul'], [3, 'cubul']] as const)
    const z: Q = e === 2 ? mixed(rng, 2, 7, 2) : mixed(rng, 2, 4, 1)
    const r1 = mul(x, [k, 1])
    const r2 = div(y, [p, 1])
    const r3: Q = reduce(z[0] ** e, z[1] ** e)
    return {
      text: lines(
        'Calculați și scrieți rezultatele ca numere mixte, acolo unde este posibil:',
        `a) ${kw} numărului $${F(x)}$;`,
        `b) ${pw} numărului $${F(y)}$;`,
        `c) ${ew} numărului $${F(z)}$.`,
      ),
      solution: lines(
        show(`\\text{a) } ${F(x)} \\cdot ${k} = ${R(r1)}`),
        show(`\\text{b) } ${F(y)} : ${p} = \\frac{${y[0]}}{${y[1]} \\cdot ${p}} = ${R(r2)}`),
        show(`\\text{c) } \\left(${F(z)}\\right)^{${e}} = \\frac{${z[0]}^{${e}}}{${z[1]}^{${e}}} = ${R(r3)}`),
      ),
      verify: () => close(val(x) * k, val(r1)) && close(val(y) / p, val(r2)) && close(val(z) ** e, val(r3)),
    }
  }
}

/** A product and a quotient of two fractions, simplified crosswise first, p. 185, Testul 2, III.3 and I.1. */
export function fracProductQuotient(rng: Rng): Made {
  for (;;) {
    const [x, y, s, t] = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)]
    const [u, v, w, z] = [int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)]
    const [i, j, l, o] = [int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)]
    // a/b · c/d with a, d sharing x and c, b sharing y; e/f : g/h with e, g sharing s and f, h sharing t
    const [a, b, c, d] = [x * u, y * z, y * w, x * v]
    const [e, f, g, h] = [s * i, t * l, s * j, t * o]
    if ([[a, b], [c, d], [e, f], [g, h]].some(([p, q]) => gcd(p, q) !== 1 || q === 1)) continue
    if (a * c === b * d || e * h === f * g) continue
    const r1 = reduce(a * c, b * d)
    const r2 = reduce(e * h, f * g)
    return {
      text: lines(
        'Calculați, simplificând înainte de a efectua înmulțirile:',
        `a) $\\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}}$;`,
        `b) $\\frac{${e}}{${f}} : \\frac{${g}}{${h}}$.`,
      ),
      solution: lines(
        `a) Simplificăm ${a} cu ${d} prin ${x} și ${c} cu ${b} prin ${y}:`,
        show(`\\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}} = \\frac{${u} \\cdot ${w}}{${z} \\cdot ${v}} = ${R(r1)}`),
        `b) Înmulțim cu inversa fracției $\\frac{${g}}{${h}}$, adică cu $\\frac{${h}}{${g}}$, apoi simplificăm ${e} cu ${g} prin ${s} și ${h} cu ${f} prin ${t}:`,
        show(`\\frac{${e}}{${f}} : \\frac{${g}}{${h}} = \\frac{${e}}{${f}} \\cdot \\frac{${h}}{${g}} = \\frac{${i} \\cdot ${o}}{${l} \\cdot ${j}} = ${R(r2)}`),
      ),
      verify: () => close((a / b) * (c / d), val(r1)) && close(e / f / (g / h), val(r2)),
    }
  }
}

/** w p/d · N · 1/b², p. 184, Testul 1, II.2 (and the product of p. 187, Testul 3, II.2). */
export function fracMixedProduct(rng: Rng): Made {
  for (;;) {
    const [p, d] = prop(rng, 2, 9)
    const w = int(rng, 1, 5)
    const A = w * d + p
    const b = pick(rng, [2, 3, 5])
    const n = d * int(rng, 1, 8)
    if (n < 4) continue
    const res = reduce(A * n, d * b * b)
    if (res[1] > 25) continue
    return {
      text: `Calculați: $${w}\\frac{${p}}{${d}} \\cdot ${n} \\cdot \\frac{1}{${b}^2}$.`,
      solution: lines(
        'Transformăm numărul mixt în fracție ordinară:',
        show(`${w}\\frac{${p}}{${d}} = \\frac{${w} \\cdot ${d} + ${p}}{${d}} = \\frac{${A}}{${d}}`),
        show(`\\frac{${A}}{${d}} \\cdot ${n} \\cdot \\frac{1}{${b * b}} = \\frac{${A} \\cdot ${n}}{${d} \\cdot ${b * b}} = ${R(res)}`),
      ),
      verify: () => close(((w + p / d) * n) / b ** 2, val(res)),
    }
  }
}

/** a/b : (c/d + e/f), p. 184, Testul 1, II.3. */
export function fracDivideBySum(rng: Rng): Made {
  for (;;) {
    const [a, b] = prop(rng, 2, 12)
    const [c, d] = prop(rng, 2, 10)
    const [e, f] = prop(rng, 2, 10)
    if (d === f) continue
    const s = add([c, d], [e, f])
    const res = div([a, b], s)
    if (res[1] > 40 || res[0] > 200) continue
    const L = lcm(d, f)
    return {
      text: `Calculați: $\\frac{${a}}{${b}} : \\left(\\frac{${c}}{${d}} + \\frac{${e}}{${f}}\\right)$.`,
      solution: lines(
        `Calculăm întâi suma din paranteză, cu numitorul comun ${L}:`,
        show(`\\frac{${c}}{${d}} + \\frac{${e}}{${f}} = \\frac{${(c * L) / d}}{${L}} + \\frac{${(e * L) / f}}{${L}} = ${simp((c * L) / d + (e * L) / f, L)}`),
        'Împărțim, înmulțind cu inversa rezultatului:',
        show(`\\frac{${a}}{${b}} : ${F(s)} = \\frac{${a}}{${b}} \\cdot ${inv(s)} = ${R(res)}`),
      ),
      verify: () => close(a / b / (c / d + e / f), val(res)),
    }
  }
}

/** (a/b)ⁿ : c/d = e/f: the natural n, p. 185, Testul 1, V.2 b. */
export function fracPowerEquation(rng: Rng): Made {
  const BASES: Q[] = [[2, 5], [3, 4], [2, 3], [1, 2], [3, 5], [4, 5], [1, 3], [3, 2], [5, 4], [2, 7], [5, 3], [4, 3]]
  for (;;) {
    const [a, b] = pick(rng, BASES)
    const n = int(rng, 2, a * b <= 6 ? 5 : 4)
    const [c, d] = prop(rng, 2, 9)
    const rhs = reduce(a ** n * d, b ** n * c)
    if (rhs[0] > 2000 || rhs[1] > 2000) continue
    return {
      text: `Determinați numărul natural $n$ din egalitatea $\\left(\\frac{${a}}{${b}}\\right)^n : \\frac{${c}}{${d}} = ${F(rhs)}$.`,
      solution: lines(
        'Deîmpărțitul este egal cu câtul înmulțit cu împărțitorul:',
        show(`\\left(\\frac{${a}}{${b}}\\right)^n = ${F(rhs)} \\cdot \\frac{${c}}{${d}} = \\frac{${a ** n}}{${b ** n}} = \\left(\\frac{${a}}{${b}}\\right)^{${n}}`),
        `deci $n = ${n}$.`,
      ),
      verify: () => {
        const ok = (k: number) => close((a / b) ** k / (c / d), val(rhs))
        return ok(n) && Array.from({ length: 12 }, (_, k) => k).filter(ok).length === 1
      },
    }
  }
}

/** [(a/b)²]^k : (w p/b)^m ∓ g/h, the mixed number being a/b, p. 184, Testul 1, IV.3. */
export function fracPowersMixed(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 2, 6)
    const a = int(rng, b + 1, 2 * b + 3)
    if (gcd(a, b) !== 1 || a > 13) continue
    const k = pick(rng, [2, 3])
    const e = pick(rng, [1, 2])
    const m = 2 * k - e
    const v = reduce(a ** e, b ** e)
    const [g, h] = prop(rng, 2, 9)
    const minus = val(v) > g / h
    const res = minus ? sub(v, [g, h]) : add(v, [g, h])
    if (res[1] > 99) continue
    const op = minus ? '-' : '+'
    const base = `\\frac{${a}}{${b}}`
    return {
      text: `Calculați: $\\left[\\left(${base}\\right)^2\\right]^{${k}} : \\left(${M([a, b])}\\right)^{${m}} ${op} \\frac{${g}}{${h}}$.`,
      solution: lines(
        `Observăm că $${unmix([a, b])}$, deci putem lucra cu puteri ale aceleiași fracții:`,
        show(`\\left[\\left(${base}\\right)^2\\right]^{${k}} : \\left(${base}\\right)^{${m}} = \\left(${base}\\right)^{${2 * k}} : \\left(${base}\\right)^{${m}} = ${e === 1 ? base : `\\left(${base}\\right)^{2} = ${F(v)}`}`),
        show(`${F(v)} ${op} \\frac{${g}}{${h}} = ${R(res)}`),
      ),
      verify: () => close((a / b) ** (2 * k) / (a / b) ** m + (minus ? -1 : 1) * (g / h), val(res)),
    }
  }
}

/** 1 : (1 + 1/k) : … : (1 + 1/n), or (1 − 1/k)·…·(1 − 1/n): the fractions cancel in a chain, p. 185, Testul 1, V.2 c. */
export function fracTelescoping(rng: Rng): Made {
  const k = int(rng, 2, 6)
  const n = int(rng, k + 15, 150)
  const division = rng() < 0.5
  if (division) {
    const res = reduce(k, n + 1)
    return {
      text: `Calculați: $1 : \\left(1 + \\frac{1}{${k}}\\right) : \\left(1 + \\frac{1}{${k + 1}}\\right) : \\left(1 + \\frac{1}{${k + 2}}\\right) : \\ldots : \\left(1 + \\frac{1}{${n}}\\right)$.`,
      solution: lines(
        'Fiecare paranteză este o fracție: $1 + \\frac{1}{j} = \\frac{j + 1}{j}$. A împărți la o fracție înseamnă a înmulți cu inversa ei:',
        show(`1 \\cdot \\frac{${k}}{${k + 1}} \\cdot \\frac{${k + 1}}{${k + 2}} \\cdot \\frac{${k + 2}}{${k + 3}} \\cdot \\ldots \\cdot \\frac{${n}}{${n + 1}}`),
        'Numărătorul fiecărei fracții se simplifică cu numitorul fracției dinaintea ei; rămân primul numărător și ultimul numitor:',
        show(`\\frac{${k}}{${n + 1}}${frac(k, n + 1) === `\\frac{${k}}{${n + 1}}` ? '' : ` = ${F(res)}`}`),
      ),
      verify: () => {
        let x = 1
        for (let j = k; j <= n; j++) x /= 1 + 1 / j
        return close(x, val(res))
      },
    }
  }
  const res = reduce(k - 1, n)
  return {
    text: `Calculați: $\\left(1 - \\frac{1}{${k}}\\right) \\cdot \\left(1 - \\frac{1}{${k + 1}}\\right) \\cdot \\left(1 - \\frac{1}{${k + 2}}\\right) \\cdot \\ldots \\cdot \\left(1 - \\frac{1}{${n}}\\right)$.`,
    solution: lines(
      'Fiecare paranteză este o fracție: $1 - \\frac{1}{j} = \\frac{j - 1}{j}$:',
      show(`\\frac{${k - 1}}{${k}} \\cdot \\frac{${k}}{${k + 1}} \\cdot \\frac{${k + 1}}{${k + 2}} \\cdot \\ldots \\cdot \\frac{${n - 1}}{${n}}`),
      'Numărătorul fiecărei fracții se simplifică cu numitorul fracției dinaintea ei; rămân primul numărător și ultimul numitor:',
      show(`\\frac{${k - 1}}{${n}}${frac(k - 1, n) === `\\frac{${k - 1}}{${n}}` ? '' : ` = ${F(res)}`}`),
    ),
    verify: () => {
      let x = 1
      for (let j = k; j <= n; j++) x *= 1 - 1 / j
      return close(x, val(res))
    },
  }
}

/** (A : B − (bⁿ + b^(n+k)) / (b^(n+m) − b^(n−1))) · C, p. 187, Testul 3, V.1 a. */
export function fracPowerQuotient(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 2, 3])
    const k = int(rng, 1, 2)
    const m = int(rng, 1, b === 2 ? 3 : 2)
    const n = int(rng, 20, 150)
    const P = reduce(b * (1 + b ** k), b ** (m + 1) - 1)
    const A = mixed(rng, 2, 9, 6)
    const B = mixed(rng, 2, 9, 4)
    const C = mixed(rng, 2, 9, 2)
    const AB = div(A, B)
    const D = sub(AB, P)
    if (D[0] <= 0) continue
    const res = mul(D, C)
    if (res[1] > 60 || res[0] > 600) continue
    return {
      text: `Calculați: $\\left(${M(A)} : ${M(B)} - \\frac{${b}^{${n}} + ${b}^{${n + k}}}{${b}^{${n + m}} - ${b}^{${n - 1}}}\\right) \\cdot ${M(C)}$.`,
      solution: lines(
        'Dăm factor comun cea mai mică putere, la numărător și la numitor:',
        show(`\\frac{${b}^{${n}} + ${b}^{${n + k}}}{${b}^{${n + m}} - ${b}^{${n - 1}}} = \\frac{${b}^{${n}} \\cdot (1 + ${b}^{${k}})}{${b}^{${n - 1}} \\cdot (${b}^{${m + 1}} - 1)} = \\frac{${b} \\cdot ${1 + b ** k}}{${b ** (m + 1) - 1}} = ${F(P)}`),
        'Transformăm numerele mixte în fracții și efectuăm împărțirea:',
        show(`${M(A)} : ${M(B)} = ${F(A)} \\cdot ${inv(B)} = ${F(AB)}`),
        show(`${F(AB)} - ${F(P)} = ${F(D)}, \\qquad ${F(D)} \\cdot ${F(C)} = ${R(res)}`),
      ),
      verify: () => close((val(A) / val(B) - (b ** n + b ** (n + k)) / (b ** (n + m) - b ** (n - 1))) * val(C), val(res)),
    }
  }
}

/** True or false: X : [(Y : Z) · W] is R, p. 184, Testul 1, III.3 (and p. 185, III.3, p. 187, III.2). */
export function fracTrueFalse(rng: Rng): Made {
  const two = () => int(rng, 2, 9) * int(rng, 1, 9)
  for (;;) {
    const Y = reduce(two(), two())
    const Z = reduce(two(), two())
    const W = reduce(two(), two())
    if ([Y, Z, W].some((q) => q[1] === 1 || q[0] === 1 && q[1] < 3)) continue
    const YZ = div(Y, Z)
    const inner = mul(YZ, W)
    const r: Q = rng() < 0.7 ? [int(rng, 1, 60), 1] : prop(rng, 2, 6)
    const X = mul(r, inner)
    if (X[1] === 1 || X[0] > 400 || X[1] > 400 || inner[0] > 999 || inner[1] > 999) continue
    const truth = rng() < 0.5
    const claim: Q = truth ? r : pick(rng, [mul(r, [2, 1]), add(r, [1, 1]), r[0] === r[1] ? [2, 1] as Q : ([r[1], r[0]] as Q)])
    return {
      text: `Stabiliți dacă afirmația următoare este adevărată sau falsă: „Rezultatul calculului $${F(X)} : \\left[\\left(${F(Y)} : ${F(Z)}\\right) \\cdot ${F(W)}\\right]$ este $${F(claim)}$”.`,
      solution: lines(
        'Calculăm întâi paranteza rotundă, apoi pe cea dreaptă, simplificând de fiecare dată:',
        show(`${F(Y)} : ${F(Z)} = ${F(Y)} \\cdot ${inv(Z)} = ${F(YZ)}`),
        show(`${F(YZ)} \\cdot ${F(W)} = ${F(inner)}`),
        show(`${F(X)} : ${F(inner)} = ${F(X)} \\cdot ${inv(inner)} = ${F(r)}`),
        truth ? 'Afirmația este adevărată.' : `Rezultatul este $${F(r)}$, nu $${F(claim)}$, deci afirmația este falsă.`,
      ),
      verify: () => close(val(X) / ((val(Y) / val(Z)) * val(W)), val(claim)) === truth,
    }
  }
}

// ================= fractions: order of operations, mixed numbers (Testele 1–3) =================

/** w a/b + c/d, the result as a mixed number, p. 185, Testul 2, II.1. */
export function fracMixedPlus(rng: Rng): Made {
  for (;;) {
    const A = mixed(rng, 2, 9, 5)
    const [c, d] = prop(rng, 2, 12)
    const res = add(A, [c, d])
    if (res[1] === 1 || A[1] === d) continue
    const L = lcm(A[1], d)
    return {
      text: `Calculați și scrieți rezultatul ca număr mixt: $${M(A)} + \\frac{${c}}{${d}}$.`,
      solution: lines(
        `Transformăm numărul mixt în fracție, apoi aducem la numitorul comun ${L}:`,
        show(`${M(A)} + \\frac{${c}}{${d}} = \\frac{${A[0]}}{${A[1]}} + \\frac{${c}}{${d}} = \\frac{${(A[0] * L) / A[1]}}{${L}} + \\frac{${(c * L) / d}}{${L}} = ${simp((A[0] * L) / A[1] + (c * L) / d, L)}`),
        show(`${F(res)} = ${M(res)}`),
      ),
      verify: () => close(val(A) + c / d, val(res)) && res[0] > res[1],
    }
  }
}

/** The fraction e/f less (more) than a/b − c/d, p. 184, Testul 1, II.1. */
export function fracLessThanDifference(rng: Rng): Made {
  for (;;) {
    const a: Q = [int(rng, 3, 15), int(rng, 2, 12)]
    if (gcd(a[0], a[1]) !== 1) continue
    const c = prop(rng, 2, 15)
    const e = prop(rng, 2, 12)
    const diff = sub(a, c)
    if (diff[0] <= 0 || a[1] === c[1] || diff[1] > 60) continue
    const less = rng() < 0.6
    const res = less ? sub(diff, e) : add(diff, e)
    if (res[0] <= 0 || res[1] > 60) continue
    const L = lcm(a[1], c[1])
    return {
      text: `Aflați fracția ordinară cu $${F(e)}$ mai ${less ? 'mică' : 'mare'} decât $${F(a)} - ${F(c)}$.`,
      solution: lines(
        `Calculăm diferența, cu numitorul comun ${L}:`,
        show(`${F(a)} - ${F(c)} = \\frac{${(a[0] * L) / a[1]}}{${L}} - \\frac{${(c[0] * L) / c[1]}}{${L}} = ${simp((a[0] * L) / a[1] - (c[0] * L) / c[1], L)}`),
        `Fracția cu $${F(e)}$ mai ${less ? 'mică' : 'mare'} se obține prin ${less ? 'scădere' : 'adunare'}:`,
        show(`${F(diff)} ${less ? '-' : '+'} ${F(e)} = ${R(res)}`),
      ),
      verify: () => close(val(a) - val(c) + (less ? -1 : 1) * val(e), val(res)),
    }
  }
}

/** a/b − (c/d + e/f + g/h), all the denominators dividing one number, p. 186, Testul 3, II.1. */
export function fracSubtractSum(rng: Rng): Made {
  for (;;) {
    const L = pick(rng, [12, 18, 20, 24, 30, 36, 40])
    const divs = Array.from({ length: L - 1 }, (_, i) => i + 2).filter((x) => L % x === 0)
    const ds = shuffle(rng, divs).slice(0, 3)
    const terms: Q[] = ds.map((d) => {
      for (;;) {
        const p = int(rng, 1, d - 1)
        if (gcd(p, d) === 1) return [p, d] as Q
      }
    })
    const s = terms.reduce((x, t) => add(x, t), [0, 1] as Q)
    const b = pick(rng, divs)
    const a = int(rng, 1, 2 * b)
    if (gcd(a, b) !== 1 || a === b) continue
    const res = sub([a, b], s)
    if (res[0] <= 0) continue
    const C = [...ds, b].reduce(lcm, 1)
    const num = terms.map(([p, d]) => (p * C) / d)
    return {
      text: `Calculați: $\\frac{${a}}{${b}} - \\left(${terms.map(F).join(' + ')}\\right)$.`,
      solution: lines(
        `Aducem toate fracțiile la numitorul comun ${C}:`,
        show(`${terms.map(F).join(' + ')} = \\frac{${num.join(' + ')}}{${C}} = ${simp(sum(num), C)}`),
        show(`\\frac{${a}}{${b}} - \\frac{${sum(num)}}{${C}} = \\frac{${(a * C) / b}}{${C}} - \\frac{${sum(num)}}{${C}} = ${simp((a * C) / b - sum(num), C)}`),
      ),
      verify: () => close(a / b - sum(terms.map(val)), val(res)),
    }
  }
}

/** A : B − e/f with mixed numbers, p. 186, Testul 2, V.1 a. */
export function fracMixedDivideMinus(rng: Rng): Made {
  for (;;) {
    const A = mixed(rng, 2, 9, 4)
    const B = mixed(rng, 2, 9, 4)
    const e = prop(rng, 2, 12)
    const AB = div(A, B)
    const res = sub(AB, e)
    if (res[0] <= 0 || AB[1] > 40 || res[1] > 90) continue
    return {
      text: `Efectuați, ținând cont de ordinea efectuării operațiilor: $${M(A)} : ${M(B)} - ${F(e)}$.`,
      solution: lines(
        'Transformăm numerele mixte în fracții; împărțirea se face înaintea scăderii:',
        show(`${M(A)} : ${M(B)} = ${F(A)} : ${F(B)} = ${F(A)} \\cdot ${inv(B)} = ${F(AB)}`),
        show(`${F(AB)} - ${F(e)} = ${R(res)}`),
      ),
      verify: () => close(val(A) / val(B) - val(e), val(res)),
    }
  }
}

/** a/b + c/d · e/f − g/h, p. 186, Testul 2, V.1 c. */
export function fracAddProductSubtract(rng: Rng): Made {
  for (;;) {
    const a = prop(rng, 2, 9)
    const c = prop(rng, 2, 15)
    const e = prop(rng, 2, 9)
    const g = prop(rng, 2, 9)
    const ce = mul(c, e)
    const s = add(a, ce)
    const res = sub(s, g)
    if (res[0] <= 0 || res[1] > 90 || s[1] > 90) continue
    return {
      text: `Efectuați, ținând cont de ordinea efectuării operațiilor: $${F(a)} + ${F(c)} \\cdot ${F(e)} - ${F(g)}$.`,
      solution: lines(
        'Înmulțirea se efectuează înaintea adunării și a scăderii:',
        show(`${F(c)} \\cdot ${F(e)} = ${F(ce)}`),
        show(`${F(a)} + ${F(ce)} - ${F(g)} = ${F(s)} - ${F(g)} = ${R(res)}`),
      ),
      verify: () => close(val(a) + val(c) * val(e) - val(g), val(res)),
    }
  }
}

/** (a − 1/b)² + (c − 1/d)² − (w 1/e)², p. 186, Testul 2, IV.1. */
export function fracSquaresOfDifferences(rng: Rng): Made {
  for (;;) {
    const [a, b, c, d, e] = [int(rng, 2, 4), int(rng, 2, 5), int(rng, 2, 4), int(rng, 2, 5), int(rng, 2, 4)]
    if (a === c && b === d) continue
    const x: Q = reduce(a * b - 1, b)
    const y: Q = reduce(c * d - 1, d)
    const z: Q = reduce(e + 1, e)
    const [x2, y2, z2] = [mul(x, x), mul(y, y), mul(z, z)]
    const res = sub(add(x2, y2), z2)
    if (res[0] <= 0 || res[1] > 200) continue
    return {
      text: `Calculați: $\\left(${a} - \\frac{1}{${b}}\\right)^2 + \\left(${c} - \\frac{1}{${d}}\\right)^2 - \\left(1\\frac{1}{${e}}\\right)^2$.`,
      solution: lines(
        'Calculăm întâi parantezele:',
        show(`${a} - \\frac{1}{${b}} = ${F(x)}, \\qquad ${c} - \\frac{1}{${d}} = ${F(y)}, \\qquad 1\\frac{1}{${e}} = ${F(z)}`),
        'Apoi puterile și, la sfârșit, adunarea și scăderea:',
        show(`${F(x2)} + ${F(y2)} - ${F(z2)} = ${R(res)}`),
      ),
      verify: () => close((a - 1 / b) ** 2 + (c - 1 / d) ** 2 - (1 + 1 / e) ** 2, val(res)),
    }
  }
}

/** [(A : B) : c + d · (e + g)] : H, p. 188, ex. 2 a. */
export function fracBigBracket(rng: Rng): Made {
  for (;;) {
    const A = mixed(rng, 2, 6, 4)
    const B = mixed(rng, 2, 6, 3)
    const c = prop(rng, 2, 6)
    const d = prop(rng, 2, 6)
    const e = prop(rng, 2, 8)
    const g = prop(rng, 2, 24)
    const H = mixed(rng, 2, 9, 3)
    if (e[1] === g[1]) continue
    const s1 = div(A, B)
    const s2 = div(s1, c)
    const s3 = add(e, g)
    const s4 = mul(d, s3)
    const s5 = add(s2, s4)
    const res = div(s5, H)
    if (res[1] > 99 || res[0] > 999 || s5[1] > 200) continue
    return {
      text: `Scrieți rezultatul sub formă de fracție ireductibilă: $\\left[\\left(${M(A)} : ${M(B)}\\right) : ${F(c)} + ${F(d)} \\cdot \\left(${F(e)} + ${F(g)}\\right)\\right] : ${M(H)}$.`,
      solution: lines(
        'Transformăm numerele mixte în fracții și lucrăm din interior spre exterior:',
        show(`${M(A)} : ${M(B)} = ${F(A)} \\cdot ${inv(B)} = ${F(s1)}, \\qquad ${F(s1)} : ${F(c)} = ${F(s1)} \\cdot ${inv(c)} = ${F(s2)}`),
        show(`${F(e)} + ${F(g)} = ${F(s3)}, \\qquad ${F(d)} \\cdot ${F(s3)} = ${F(s4)}`),
        show(`${F(s2)} + ${F(s4)} = ${F(s5)}, \\qquad ${F(s5)} : ${F(H)} = ${F(s5)} \\cdot ${inv(H)} = ${F(res)}`),
      ),
      verify: () => close(((val(A) / val(B)) / val(c) + val(d) * (val(e) + val(g))) / val(H), val(res)),
    }
  }
}

/** [A : B : C − (p/q)³ · D] · E, p. 187, Testul 3, V.1 b. */
export function fracChainCube(rng: Rng): Made {
  for (;;) {
    const A = mixed(rng, 2, 15, 3)
    const B = mixed(rng, 2, 10, 2)
    const C = mixed(rng, 2, 9, 1)
    const pq = pick(rng, [[2, 3], [1, 2], [3, 4], [2, 5], [1, 3], [3, 2]] as Q[])
    const D = mixed(rng, 2, 32, 1)
    const E = mixed(rng, 2, 5, 2)
    const s1 = div(div(A, B), C)
    const cube: Q = [pq[0] ** 3, pq[1] ** 3]
    const s2 = mul(cube, D)
    const s3 = sub(s1, s2)
    if (s3[0] <= 0) continue
    const res = mul(s3, E)
    if (res[1] > 60 || res[0] > 600 || s1[1] > 200) continue
    return {
      text: `Calculați: $\\left[${M(A)} : ${M(B)} : ${M(C)} - \\left(${F(pq)}\\right)^3 \\cdot ${M(D)}\\right] \\cdot ${M(E)}$.`,
      solution: lines(
        'Transformăm numerele mixte în fracții. În paranteză: întâi puterea, apoi împărțirile și înmulțirea (de la stânga la dreapta), la sfârșit scăderea:',
        show(`${F(A)} : ${F(B)} : ${F(C)} = ${F(A)} \\cdot ${inv(B)} \\cdot ${inv(C)} = ${F(s1)}`),
        show(`\\left(${F(pq)}\\right)^3 \\cdot ${F(D)} = ${F(cube)} \\cdot ${F(D)} = ${F(s2)}`),
        show(`\\left[${F(s1)} - ${F(s2)}\\right] \\cdot ${F(E)} = ${F(s3)} \\cdot ${F(E)} = ${R(res)}`),
      ),
      verify: () => close((val(A) / val(B) / val(C) - val(pq) ** 3 * val(D)) * val(E), val(res)),
    }
  }
}

/** x, y, z given by computations with fractions; three expressions in x, y, z, p. 186, Testul 2, V.2. */
export function fracLettersXYZ(rng: Rng): Made {
  for (;;) {
    // x = w a/b + c/b, a whole number
    const b = int(rng, 3, 9)
    const a = int(rng, 1, b - 1)
    if (gcd(a, b) !== 1 || gcd(b - a, b) !== 1) continue
    const w = int(rng, 1, 3)
    const x = w + 1
    // y = U · V
    const U = mixed(rng, 2, 9, 2)
    const V = mixed(rng, 2, 9, 1)
    const y = mul(U, V)
    if (y[1] > 12) continue
    // z = [k + (p/q)²] : Mz · m = D·t, with Mz = Tn / D
    const k = int(rng, 1, 3)
    const [p, q] = pick(rng, [[3, 2], [5, 2], [1, 2], [2, 3], [4, 3], [5, 3], [1, 3]] as Q[])
    const Tn = k * q * q + p * p
    const Td = q * q
    const D = int(rng, 2, 9)
    if (gcd(Tn, D) !== 1 || D >= Tn) continue
    const t = int(rng, 1, 2)
    const m = Td * t
    const z = D * t
    const Mz: Q = [Tn, D]
    const n = pick(rng, [2, 3, 4, 5, 6].filter((d) => z % d === 0).concat([z]))
    const ea = sub(add([x, 1], y), [z, n])
    const c = int(rng, 2, 4)
    const eb = add(mul([c * x, 1], y), [z, 1])
    const ec = sub(sub(mul([x * z, 1], y), mul([x, 1], y)), mul(y, [z, 1]))
    if (ea[0] <= 0 || ec[0] <= 0) continue
    const zn = z / n === 1 ? '1' : String(z / n)
    return {
      text: lines(
        `Se consideră numerele $x = ${w}\\frac{${a}}{${b}} + \\frac{${b - a}}{${b}}$, $y = ${M(U)} \\cdot ${M(V)}$ și $z = \\left[${k} + \\left(\\frac{${p}}{${q}}\\right)^2\\right] : ${M(Mz)} \\cdot ${m}$. Calculați:`,
        `a) $x + y - z : ${n}$;`,
        `b) $${c} \\cdot x \\cdot y + z$;`,
        'c) $x \\cdot y \\cdot z - x \\cdot y - y \\cdot z$.',
      ),
      solution: lines(
        'Calculăm întâi numerele:',
        show(`x = \\frac{${w * b + a}}{${b}} + \\frac{${b - a}}{${b}} = \\frac{${x * b}}{${b}} = ${x}, \\qquad y = ${F(U)} \\cdot ${F(V)} = ${F(y)}`),
        show(`z = \\left[${k} + \\frac{${p * p}}{${q * q}}\\right] \\cdot \\frac{${D}}{${Tn}} \\cdot ${m} = \\frac{${Tn}}{${Td}} \\cdot \\frac{${D}}{${Tn}} \\cdot ${m} = ${z}`),
        show(`\\text{a) } ${x} + ${F(y)} - ${zn} = ${R(ea)}`),
        show(`\\text{b) } ${c} \\cdot ${x} \\cdot ${F(y)} + ${z} = ${R(eb)}`),
        'c) Dăm factor comun pe $y$:',
        show(`y \\cdot (x \\cdot z - x - z) = ${F(y)} \\cdot (${x * z} - ${x} - ${z}) = ${F(y)} \\cdot ${x * z - x - z} = ${R(ec)}`),
      ),
      verify: () => {
        const X = w + a / b + (b - a) / b
        const Y = val(U) * val(V)
        const Z = (k + (p / q) ** 2) / (Tn / D) * m
        return close(X + Y - Z / n, val(ea)) && close(c * X * Y + Z, val(eb)) && close(X * Y * Z - X * Y - Y * Z, val(ec))
      },
    }
  }
}

// ================= fractions: words, equivalence, comparing, parts (Test de autoevaluare, pp. 189–190) =================

const UNITS_F = ['', 'una', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă']
const TEENS = ['zece', 'unsprezece', 'douăsprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece']
const TENS = ['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci']
/** 2 … 99 in words, feminine: "două", "paisprezece", "douăzeci și două". */
const words = (n: number) => (n < 10 ? UNITS_F[n] : n < 20 ? TEENS[n - 10] : TENS[Math.floor(n / 10)] + (n % 10 ? ` și ${UNITS_F[n % 10]}` : ''))
const PARTS: Record<number, string> = { 10: 'zecimi', 100: 'sutimi', 1000: 'miimi' }

/** "Paisprezece sutimi" as an irreducible fraction, p. 189, Test de autoevaluare, I.1. */
export function fracFromWords(rng: Rng): Made {
  const one = (D: number): [number, string] => {
    for (;;) {
      const n = int(rng, 2, D === 10 ? 9 : 99)
      if (gcd(n, D) === 1 || (n > 20 && n % 10 === 1)) continue
      return [n, `${words(n)}${n >= 20 ? ' de' : ''} ${PARTS[D]}`]
    }
  }
  const D1 = pick(rng, [10, 100])
  const D2 = D1 === 10 ? pick(rng, [100, 1000]) : 1000
  const [n1, w1] = one(D1)
  const [n2, w2] = one(D2)
  return {
    text: lines('Scrieți ca fracții ordinare ireductibile:', `a) ${w1};`, `b) ${w2}.`),
    solution: lines(
      `a) ${w1[0].toUpperCase() + w1.slice(1)} înseamnă $\\frac{${n1}}{${D1}}$; simplificăm prin ${gcd(n1, D1)}:`,
      show(`\\frac{${n1}}{${D1}} = ${frac(n1, D1)}`),
      `b) ${w2[0].toUpperCase() + w2.slice(1)} înseamnă $\\frac{${n2}}{${nr(D2)}}$; simplificăm prin ${gcd(n2, D2)}:`,
      show(`\\frac{${n2}}{${nr(D2)}} = ${frac(n2, D2)}`),
    ),
    verify: () => reduce(n1, D1)[1] < D1 && reduce(n2, D2)[1] < D2,
  }
}

/** The fraction equivalent to a/b with a given denominator, or with a given numerator, p. 189, I.4. */
export function fracEquivalentGiven(rng: Rng): Made {
  for (;;) {
    const [a, b] = prop(rng, 3, 12)
    const k = int(rng, 2, 9)
    const [c, d] = [int(rng, 2, 9), int(rng, 2, 15)]
    const m = int(rng, 2, 9)
    if (gcd(c, d) !== 1 || c === d) continue
    return {
      text: lines(
        'Completați:',
        `a) Fracția care are numitorul ${b * k} și este echivalentă cu fracția $\\frac{${a}}{${b}}$ are numărătorul egal cu …`,
        `b) Fracția care are numărătorul ${c * m} și este echivalentă cu fracția $\\frac{${c}}{${d}}$ are numitorul egal cu …`,
      ),
      solution: lines(
        `a) Cum $${b * k} = ${b} \\cdot ${k}$, amplificăm fracția cu ${k}:`,
        show(`\\frac{${a}}{${b}} = \\frac{${a} \\cdot ${k}}{${b} \\cdot ${k}} = \\frac{${a * k}}{${b * k}}`),
        `deci numărătorul este ${a * k}.`,
        `b) Cum $${c * m} = ${c} \\cdot ${m}$, amplificăm fracția cu ${m}:`,
        show(`\\frac{${c}}{${d}} = \\frac{${c} \\cdot ${m}}{${d} \\cdot ${m}} = \\frac{${c * m}}{${d * m}}`),
        `deci numitorul este ${d * m}.`,
      ),
      verify: () => a * (b * k) === b * (a * k) && c * (d * m) === d * (c * m),
    }
  }
}

/** The price after a discount and after a rise of p%, p. 189, I.2. */
export function fracDiscount(rng: Rng): Made {
  for (;;) {
    const P = 10 * int(rng, 5, 90)
    const p = pick(rng, [5, 10, 15, 20, 25, 30, 40, 50])
    const Q2 = 10 * int(rng, 5, 90)
    const q = pick(rng, [5, 10, 15, 20, 25, 30, 50])
    if ((P * p) % 100 || (Q2 * q) % 100 || P === Q2) continue
    const d1 = (P * p) / 100
    const d2 = (Q2 * q) / 100
    return {
      text: lines(
        `a) Un produs costă ${deN(P)} lei. Cât va costa produsul după o ieftinire cu ${p}%?`,
        `b) Un alt produs costă ${deN(Q2)} lei. Cât va costa după o scumpire cu ${q}%?`,
      ),
      solution: lines(
        show(`\\text{a) } ${p}\\% \\text{ din } ${P} = \\frac{${p}}{100} \\cdot ${P} = ${d1}, \\qquad ${P} - ${d1} = ${P - d1} \\text{ lei}`),
        show(`\\text{b) } ${q}\\% \\text{ din } ${Q2} = \\frac{${q}}{100} \\cdot ${Q2} = ${d2}, \\qquad ${Q2} + ${d2} = ${Q2 + d2} \\text{ lei}`),
      ),
      verify: () => close(P * (1 - p / 100), P - d1) && close(Q2 * (1 + q / 100), Q2 + d2),
    }
  }
}

/** a/b of (c/d of N kg), and p% of (q% of M kg), p. 189, III. */
export function fracPartOfPart(rng: Rng): Made {
  for (;;) {
    const [a, b] = prop(rng, 2, 9)
    const [c, d] = prop(rng, 2, 9)
    const n = d * b * int(rng, 1, 8)
    if (n > 500) continue
    const inner = (c * n) / d
    const outer = (a * inner) / b
    const p = pick(rng, [10, 20, 25, 50, 75, 40, 60])
    const q = pick(rng, [10, 20, 25, 50, 30])
    const m = 20 * int(rng, 5, 50)
    const i2 = (q * m) / 100
    const o2 = (p * i2) / 100
    if (!Number.isInteger(i2) || !Number.isInteger(o2) || !Number.isInteger(outer)) continue
    return {
      text: lines('Calculați:', `a) $\\frac{${a}}{${b}}$ din ($\\frac{${c}}{${d}}$ din ${n} kg);`, `b) ${p}% din (${q}% din ${m} kg).`),
      solution: lines(
        show(`\\text{a) } \\frac{${c}}{${d}} \\cdot ${n} = ${inner} \\text{ kg}, \\qquad \\frac{${a}}{${b}} \\cdot ${inner} = ${outer} \\text{ kg}`),
        show(`\\text{b) } \\frac{${q}}{100} \\cdot ${m} = ${i2} \\text{ kg}, \\qquad \\frac{${p}}{100} \\cdot ${i2} = ${o2} \\text{ kg}`),
      ),
      verify: () => close((a / b) * (c / d) * n, outer) && close((p / 100) * (q / 100) * m, o2),
    }
  }
}

/** (a + 2a + … + na) / (b + 2b + … + nb) = a/b, p. 189, I.3. */
export function fracProgressionQuotient(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 9)
    const b = int(rng, 2, 9)
    const n = int(rng, 10, 60)
    if (gcd(a, b) !== 1) continue
    const G = (n * (n + 1)) / 2
    return {
      text: `Simplificați fracția $\\frac{${a} + ${2 * a} + ${3 * a} + \\ldots + ${nr(n * a)}}{${b} + ${2 * b} + ${3 * b} + \\ldots + ${nr(n * b)}}$ până la o fracție ireductibilă.`,
      solution: lines(
        `Dăm factor comun ${a} la numărător și ${b} la numitor:`,
        show(`\\frac{${a} \\cdot (1 + 2 + 3 + \\ldots + ${n})}{${b} \\cdot (1 + 2 + 3 + \\ldots + ${n})} = \\frac{${a} \\cdot ${nr(G)}}{${b} \\cdot ${nr(G)}} = \\frac{${a}}{${b}}`),
      ),
      verify: () => {
        let s1 = 0
        let s2 = 0
        for (let i = 1; i <= n; i++) {
          s1 += i * a
          s2 += i * b
        }
        const [x, y] = reduce(s1, s2)
        return x === a && y === b
      },
    }
  }
}

/** a + b and b + c known: k(a + b) + m(b + c), p. 189, II.2. */
export function fracPairSums(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 2, 12)
    const p = int(rng, 1, 30)
    const r = int(rng, 1, 30)
    if (gcd(p, d) !== 1 || gcd(r, d) !== 1 || p === r) continue
    const k = int(rng, 1, 3)
    const m = int(rng, 1, 3)
    const res = reduce(k * p + m * r, d)
    const expr = `${cv(k, 'a')} + ${cv(k + m, 'b')} + ${cv(m, 'c')}`
    const kx = (c: number, s: string) => (c === 1 ? s : `${c} \\cdot ${s}`)
    return {
      text: `Dacă $a + b = \\frac{${p}}{${d}}$ și $b + c = \\frac{${r}}{${d}}$, calculați $${expr}$.`,
      solution: lines(
        'Grupăm termenii astfel încât să apară sumele cunoscute:',
        show(`${expr} = ${kx(k, '(a + b)')} + ${kx(m, '(b + c)')} = ${kx(k, `\\frac{${p}}{${d}}`)} + ${kx(m, `\\frac{${r}}{${d}}`)} = ${simp(k * p + m * r, d)}`),
      ),
      verify: () => {
        const b = 1 / 7
        const a = p / d - b
        const c = r / d - b
        return close(k * a + (k + m) * b + m * c, val(res))
      },
    }
  }
}

/** Three fractions in increasing order, p. 189, II.4. */
export function fracOrderThree(rng: Rng): Made {
  for (;;) {
    const fs: Q[] = [0, 1, 2].map(() => [int(rng, 1, 14), int(rng, 2, 9)] as Q)
    if (fs.some(([p, q]) => gcd(p, q) !== 1 || q === 1)) continue
    const vs = fs.map(val)
    if (new Set(vs).size < 3) continue
    const L = fs.reduce((l, [, q]) => lcm(l, q), 1)
    if (L > 120) continue
    const names = ['x', 'y', 'z']
    const order = [0, 1, 2].sort((i, j) => vs[i] - vs[j])
    return {
      text: `Scrieți în ordine crescătoare numerele $x = ${F(fs[0])}$, $y = ${F(fs[1])}$ și $z = ${F(fs[2])}$.`,
      solution: lines(
        `Aducem fracțiile la numitorul comun ${L}:`,
        show(fs.map(([p, q], i) => `${names[i]} = \\frac{${(p * L) / q}}{${L}}`).join(', \\quad ')),
        'Dintre fracțiile cu același numitor, mai mare este cea cu numărătorul mai mare:',
        show(order.map((i) => names[i]).join(' < ')),
      ),
      verify: () => vs[order[0]] < vs[order[1]] && vs[order[1]] < vs[order[2]],
    }
  }
}

/** The sum of all the proper fractions n/d: subunitary, equal to 1 or greater, p. 189, II.1. */
export function fracSubunitarySum(rng: Rng): Made {
  const d = int(rng, 2, 40)
  const res = reduce(d - 1, 2)
  const kind = d === 2 ? 'subunitară' : d === 3 ? 'echiunitară' : 'supraunitară'
  return {
    text: `Calculați suma tuturor fracțiilor subunitare de forma $\\frac{n}{${d}}$, unde $n \\in \\mathbb{N}^*$, și precizați dacă rezultatul este o fracție subunitară, echiunitară sau supraunitară.`,
    solution: lines(
      `Fracția $\\frac{n}{${d}}$ este subunitară când $n < ${d}$, deci $n$ ia valorile de la 1 la ${d - 1}:`,
      show(d === 2 ? '\\frac{1}{2}' : `\\frac{1}{${d}} + \\frac{2}{${d}} + \\ldots + \\frac{${d - 1}}{${d}} = \\frac{1 + 2 + \\ldots + ${d - 1}}{${d}} = \\frac{${((d - 1) * d) / 2}}{${d}} = ${F(res)}`),
      `Rezultatul este o fracție ${kind}.`,
    ),
    verify: () => {
      let s = 0
      for (let n = 1; n < d; n++) s += n / d
      return close(s, val(res)) && (s < 1) === (d === 2) && (Math.abs(s - 1) < 1e-9) === (d === 3)
    },
  }
}

/** a/b and (x + p)/(y − q) equivalent: the smallest natural x and y, p. 199, Testul 11, A.5. */
export function fracEquivalentSmallest(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 1, 9), int(rng, 2, 9)]
    if (gcd(a, b) !== 1 || a === b) continue
    const p = int(rng, 1, 12)
    const q = int(rng, 1, 9)
    const k = Math.max(1, Math.ceil(p / a))
    const x = a * k - p
    const y = b * k + q
    return {
      text: `Dacă fracțiile $\\frac{${a}}{${b}}$ și $\\frac{x + ${p}}{y - ${q}}$ sunt echivalente, aflați cele mai mici valori naturale ale numerelor $x$ și $y$.`,
      solution: lines(
        `Fracția $\\frac{${a}}{${b}}$ este ireductibilă, deci orice fracție echivalentă cu ea se obține prin amplificare: $x + ${p} = ${a}k$ și $y - ${q} = ${b}k$, cu $k \\in \\mathbb{N}^*$.`,
        `Ca $x$ să fie natural, trebuie $${a}k \\ge ${p}$, deci cea mai mică valoare este $k = ${k}$:`,
        show(`x = ${a * k} - ${p} = ${x}, \\qquad y = ${b * k} + ${q} = ${y}`),
      ),
      verify: () => {
        for (let xx = 0; xx < x; xx++) for (let yy = q + 1; yy < 200; yy++) if ((xx + p) * b === a * (yy - q)) return false
        for (let yy = q + 1; yy < y; yy++) if ((x + p) * b === a * (yy - q)) return false
        return (x + p) * b === a * (y - q)
      },
    }
  }
}

/** (an + b)/(cn + d) = k + r/(cn + d): the whole part, for one n and for all large n, p. 190, IV. */
export function fracExtractWholes(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 2, 3)
    const k = int(rng, 2, 5)
    const d = int(rng, 1, 5)
    const r = int(rng, 7, 25)
    const a = k * c
    const b = k * d + r
    // the smallest n with cn + d > r
    const m = Math.floor((r - d) / c) + 1
    if (m < 3 || gcd(r, c) === r) continue
    const n0 = int(rng, 1, m - 1)
    const v = reduce(a * n0 + b, c * n0 + d)
    if (v[1] === 1) continue
    const den = `${c}n + ${d}`
    const num = `${a}n + ${b}`
    return {
      text: lines(
        `Fie fracția ordinară $\\frac{${num}}{${den}}$, unde $n$ este un număr natural. Scoateți întregii din fracție:`,
        `a) dacă $n = ${n0}$;`,
        `b) dacă $n \\ge ${m}$.`,
      ),
      solution: lines(
        show(`\\text{a) } \\frac{${a} \\cdot ${n0} + ${b}}{${c} \\cdot ${n0} + ${d}} = \\frac{${a * n0 + b}}{${c * n0 + d}} = ${M(v)}`),
        'b) Scriem numărătorul cu ajutorul numitorului:',
        show(`\\frac{${num}}{${den}} = \\frac{${k} \\cdot (${den}) + ${r}}{${den}} = ${k} + \\frac{${r}}{${den}}`),
        `Pentru $n \\ge ${m}$ avem $${den} \\ge ${c * m + d} > ${r}$, deci $\\frac{${r}}{${den}}$ este subunitară, iar fracția are ${k} întregi:`,
        show(`\\frac{${num}}{${den}} = ${k}\\frac{${r}}{${den}}`),
      ),
      verify: () => close((a * n0 + b) / (c * n0 + d), val(v)) && c * m + d > r && c * (m - 1) + d <= r && a * 7 + b === k * (c * 7 + d) + r,
    }
  }
}

/** k, ab/m and abc/(10m) in increasing order, for any three-digit abc, p. 190, V. */
export function fracOrderOverlines(rng: Rng): Made {
  const m = int(rng, 2, 9)
  const k = int(rng, 1, Math.ceil(10 / m) - 1)
  const items = shuffle(rng, [`${k}`, `\\frac{\\overline{ab}}{${m}}`, `\\frac{\\overline{abc}}{${10 * m}}`])
  return {
    text: `Fie un număr natural oarecare de trei cifre $\\overline{abc}$. Scrieți în ordine crescătoare numerele: $${items[0]}$, $${items[1]}$, $${items[2]}$.`,
    solution: lines(
      `Cum $\\overline{ab} \\ge 10$, avem $\\frac{\\overline{ab}}{${m}} \\ge \\frac{10}{${m}} > ${k}$.`,
      show(`\\frac{\\overline{abc}}{${10 * m}} = \\frac{10 \\cdot \\overline{ab} + c}{${10 * m}} = \\frac{\\overline{ab}}{${m}} + \\frac{c}{${10 * m}} \\ge \\frac{\\overline{ab}}{${m}}`),
      'Ordinea crescătoare este:',
      show(`${k} < \\frac{\\overline{ab}}{${m}} \\le \\frac{\\overline{abc}}{${10 * m}}`),
      'cu egalitate doar când $c = 0$.',
    ),
    verify: () => {
      for (let n = 100; n <= 999; n++) {
        const ab = Math.floor(n / 10)
        if (!(k < ab / m && ab * 10 <= n)) return false
      }
      return true
    },
  }
}

/** a/x > x/b > c/d: the natural x, p. 201, Testul 13, A.3. */
export function fracDoubleInequality(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 5, 30)
    const b = int(rng, 3, 12)
    const [c, d] = prop(rng, 2, 20)
    const xs: number[] = []
    for (let x = 1; x * x < a * b; x++) if (x * d > b * c) xs.push(x)
    if (xs.length < 2 || xs.length > 6 || (b * c) % d === 0) continue
    const s = Math.floor(Math.sqrt(a * b - 1))
    return {
      text: `Determinați numerele naturale nenule $x$ pentru care $\\frac{${a}}{x} > \\frac{x}{${b}} > \\frac{${c}}{${d}}$.`,
      solution: lines(
        'Comparăm câte două fracții, prin produsul „pe diagonală”:',
        show(`\\frac{${a}}{x} > \\frac{x}{${b}} \\Rightarrow x \\cdot x < ${a} \\cdot ${b} = ${a * b} \\Rightarrow x \\le ${s}`),
        show(`\\frac{x}{${b}} > \\frac{${c}}{${d}} \\Rightarrow ${d}x > ${b * c} \\Rightarrow x > ${F([b * c, d])}`),
        show(`x \\in \\{${xs.join(', ')}\\}`),
      ),
      verify: () => {
        const ok = (x: number) => a * b > x * x && x * d > b * c
        return xs.every(ok) && !ok(xs[0] - 1) && !ok(xs[xs.length - 1] + 1) && xs.length === xs[xs.length - 1] - xs[0] + 1
      },
    }
  }
}

// ================= recap tests with natural numbers (Testele recapitulative 1–14, pp. 194–202) =================

/** N pupils, each knows at least one of two languages (or plays one of two sports): both, only one, Testul 10, ex. 11. */
export function recapTwoSets(rng: Rng): Made {
  const T = pick(rng, [
    { all: 'știe cel puțin o limbă străină, engleza sau franceza', A: 'știu limba engleză', B: 'știu limba franceză', both: 'știu ambele limbi', onlyA: 'știu numai limba engleză', onlyB: 'știu numai limba franceză' },
    { all: 'știe cel puțin o limbă străină, engleza sau germana', A: 'știu limba engleză', B: 'știu limba germană', both: 'știu ambele limbi', onlyA: 'știu numai limba engleză', onlyB: 'știu numai limba germană' },
    { all: 'practică cel puțin unul dintre sporturile fotbal și înot', A: 'practică fotbalul', B: 'practică înotul', both: 'practică ambele sporturi', onlyA: 'practică numai fotbalul', onlyB: 'practică numai înotul' },
    { all: 'participă la cel puțin unul dintre cercurile de matematică și de șah', A: 'participă la cercul de matematică', B: 'participă la cercul de șah', both: 'participă la ambele cercuri', onlyA: 'participă numai la cercul de matematică', onlyB: 'participă numai la cercul de șah' },
  ])
  for (;;) {
    const n = int(rng, 18, 32)
    const a = int(rng, 8, n - 2)
    const b = int(rng, 8, n - 2)
    const both = a + b - n
    if (both < 1) continue
    return {
      text: lines(
        `Fiecare dintre cei ${deN(n)} elevi ai unei clase ${T.all}. Știind că ${deN(a)} elevi ${T.A} și ${deN(b)} elevi ${T.B}, calculați:`,
        `a) câți elevi ${T.both};`,
        `b) câți elevi ${T.onlyA};`,
        `c) câți elevi ${T.onlyB}.`,
      ),
      solution: lines(
        `a) Adunând ${a} cu ${b}, elevii din ambele grupe sunt numărați de două ori:`,
        show(`${a} + ${b} - ${n} = ${both} \\text{ elevi}`),
        show(`\\text{b) } ${a} - ${both} = ${a - both} \\text{ elevi}, \\qquad \\text{c) } ${b} - ${both} = ${b - both} \\text{ elevi}`),
      ),
      verify: () => both + (a - both) + (b - both) === n,
    }
  }
}

/** How many numbers give, at the division by d, a quotient from q1 to q2; the smallest and the largest, Testul 1, ex. 11 a. */
export function recapQuotientRange(rng: Rng): Made {
  const d = int(rng, 3, 12)
  const q1 = int(rng, 1, 9)
  const q2 = q1 + int(rng, 2, 8)
  const count = (q2 - q1 + 1) * d
  return {
    text: `Câte numere naturale împărțite la ${d} dau câtul cel puțin ${q1} și cel mult ${q2}? Care este cel mai mic și care este cel mai mare dintre ele?`,
    solution: lines(
      `Numerele sunt de forma $${d} \\cdot c + r$, cu câtul $c$ de la ${q1} la ${q2} (adică ${q2 - q1 + 1} valori) și restul $r$ de la 0 la ${d - 1} (adică ${d} valori):`,
      show(`${q2 - q1 + 1} \\cdot ${d} = ${count} \\text{ numere}`),
      show(`\\text{cel mai mic: } ${d} \\cdot ${q1} + 0 = ${d * q1}, \\qquad \\text{cel mai mare: } ${d} \\cdot ${q2} + ${d - 1} = ${d * q2 + d - 1}`),
    ),
    verify: () => {
      const ns: number[] = []
      for (let x = 0; x < d * (q2 + 2); x++) {
        const c = Math.floor(x / d)
        if (c >= q1 && c <= q2) ns.push(x)
      }
      return ns.length === count && ns[0] === d * q1 && ns[ns.length - 1] === d * q2 + d - 1
    },
  }
}

/** a : x + b : x = Q and a + b = S (or with minus): x, Testul 8, ex. 8. */
export function recapCommonDivisor(rng: Rng): Made {
  const x = int(rng, 2, 15)
  const plus = rng() < 0.5
  const u = int(rng, 3, 30)
  const v = plus ? int(rng, 3, 30) : int(rng, 1, u - 1)
  const Qv = plus ? u + v : u - v
  const S = Qv * x
  const op = plus ? '+' : '-'
  return {
    text: `Știind că $a : x ${op} b : x = ${Qv}$ și $a ${op} b = ${S}$, aflați numărul natural nenul $x$.`,
    solution: lines(
      `Împărțirea este distributivă față de ${plus ? 'adunare' : 'scădere'}:`,
      show(`a : x ${op} b : x = (a ${op} b) : x = ${S} : x = ${Qv} \\Rightarrow x = ${S} : ${Qv} = ${x}`),
    ),
    verify: () => {
      const [a, b] = [u * x, v * x]
      return (plus ? a / x + b / x : a / x - b / x) === Qv && (plus ? a + b : a - b) === S
    },
  }
}

/** A book read in d days, each day k pages fewer (more) than the day before: the first day, Testul 5, ex. 10. */
export function recapReadingDays(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 3, 6)
    const k = int(rng, 2, 15)
    const fewer = rng() < 0.6
    const f = int(rng, 15, 90)
    const pages = Array.from({ length: d }, (_, i) => f + (fewer ? -1 : 1) * k * i)
    if (pages[d - 1] <= 0) continue
    const total = sum(pages)
    const T = (k * (d - 1) * d) / 2
    const name = pick(rng, [...BOYS, ...Object.keys(GIRLS)])
    const days = ['', '', 'două', 'trei', 'patru', 'cinci', 'șase'][d]
    return {
      text: `${name} își propune să citească o carte care are ${deN(total)} pagini. Dacă în fiecare zi ar citi cu ${deN(k)} pagini mai ${fewer ? 'puțin' : 'mult'} decât în ziua precedentă, ar termina de citit cartea în ${days} zile. Câte pagini trebuie să citească în prima zi?`,
      solution: lines(
        `Notăm cu $x$ numărul paginilor citite în prima zi. În zilele următoare citește ${pages.slice(1).map((_, i) => `$x ${fewer ? '-' : '+'} ${k * (i + 1)}$`).join(', ')} pagini:`,
        show(`${d}x ${fewer ? '-' : '+'} (${pages.slice(1).map((_, i) => k * (i + 1)).join(' + ')}) = ${total} \\Rightarrow ${d}x ${fewer ? '-' : '+'} ${T} = ${total}`),
        show(`${d}x = ${fewer ? total + T : total - T} \\Rightarrow x = ${f} \\text{ pagini}`),
      ),
      verify: () => d * f + (fewer ? -T : T) === total,
    }
  }
}

/** Two children with T stamps, one has m more than k times the other's; how many to give for a ratio 1/r, Testul 9, ex. 10. */
export function recapStampsTransfer(rng: Rng): Made {
  const [obj, objGen] = pick(rng, [['timbre', 'timbrelor'], ['ilustrate', 'ilustratelor'], ['abțibilduri', 'abțibildurilor']] as const)
  for (;;) {
    const k = int(rng, 2, 3)
    const A = int(rng, 15, 60)
    const m = int(rng, 1, 15)
    const I = k * A + m
    const T = A + I
    const r = int(rng, 2, 4)
    if (T % (r + 1)) continue
    const after = T / (r + 1)
    const x = A - after
    if (x <= 0) continue
    const X = girl(rng)
    let Y = girl(rng)
    if (Y === X) Y = boy(rng)
    const kw = k === 2 ? 'dublul' : 'triplul'
    return {
      text: lines(
        `${X} și ${Y} au împreună ${deN(T)} ${obj}. ${X} are cu ${deN(m)} ${obj} mai mult decât ${kw} numărului ${objGen} ${gen(Y)}.`,
        `a) Câte ${obj} are ${X}?`,
        `b) Câte ${obj} are ${Y}?`,
        `c) Câte ${obj} trebuie să-i dea ${Y} ${gen(X)}, pentru ca ${Y} să aibă ${part(1, r)} din numărul ${objGen} pe care le va avea atunci ${X}?`,
      ),
      solution: lines(
        `Dacă ${Y} are o parte, ${X} are ${k} astfel de părți și încă ${m}:`,
        show(`${k + 1} \\text{ parti} = ${T} - ${m} = ${T - m} \\Rightarrow 1 \\text{ parte} = ${T - m} : ${k + 1} = ${A}`),
        `a) ${X} are $${k} \\cdot ${A} + ${m} = ${I}$ ${deW(I)}${obj}. b) ${Y} are ${deN(A)} ${obj}.`,
        `c) Totalul rămâne ${T}; la final ${Y} are o parte, iar ${X} are ${r} părți:`,
        show(`${T} : ${r + 1} = ${after}, \\qquad ${A} - ${after} = ${x}`),
        `${Y} trebuie să-i dea ${gen(X)} ${deN(x)} ${obj}.`,
      ),
      verify: () => A + I === T && I === k * A + m && (I + x) === r * (A - x),
    }
  }
}

/** The sum of all the numbers of a form like 2x5 divisible by 3 (or 9), Testul 2, ex. 1. */
export function recapSumOfForm(rng: Rng): Made {
  for (;;) {
    const pos = int(rng, 0, 2)
    const u = int(rng, 1, 9)
    const v = int(rng, 0, 9)
    const dv = pick(rng, [3, 3, 9])
    const digitsOf = (x: number) => (pos === 0 ? [x, u, v] : pos === 1 ? [u, x, v] : [u, v, x])
    const pattern = (pos === 0 ? ['x', u, v] : pos === 1 ? [u, 'x', v] : [u, v, 'x']).join('')
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => !(pos === 0 && x === 0) && sum(digitsOf(x)) % dv === 0)
    if (xs.length < 2) continue
    const ns = xs.map((x) => Number(digitsOf(x).join('')))
    const known = u + v
    return {
      text: `Aflați suma tuturor numerelor naturale de forma $\\overline{${pattern}}$ divizibile cu ${dv}.`,
      solution: lines(
        `Un număr se divide cu ${dv} dacă suma cifrelor lui se divide cu ${dv}: $${known} + x$ trebuie să fie multiplu de ${dv}${pos === 0 ? ', iar $x \\ne 0$' : ''}.`,
        show(`x \\in \\{${xs.join(', ')}\\}`),
        show(`${ns.join(' + ')} = ${nr(sum(ns))}`),
      ),
      verify: () => {
        let s = 0
        for (let n = 100; n <= 999; n++) {
          const ds = String(n).split('').map(Number)
          const ok = ds.every((dg, i) => i === pos || dg === [u, v][i < pos ? i : i - 1])
          if (ok && n % dv === 0) s += n
        }
        return s === sum(ns)
      },
    }
  }
}

/** x − y = D (a power of z) and z known: (x − y)^p : z^q, xz − yz, x : z^e − y : z^e, Testul 8, ex. 11. */
export function recapDifferenceExpressions(rng: Rng): Made {
  const z = pick(rng, [2, 3, 5, 7])
  const a = z === 7 ? 2 : int(rng, 2, 3)
  const D = z ** a
  const p = int(rng, 3, 6)
  const q = a * p - int(rng, 1, 2)
  const e = int(rng, 1, a)
  const ze = e === 1 ? 'z' : `z^{${e}}`
  const r1 = z ** (a * p - q)
  return {
    text: lines(`Dacă $x - y = ${D}$ și $z = ${z}$, calculați:`, `a) $(x - y)^{${p}} : z^{${q}}$;`, 'b) $x \\cdot z - y \\cdot z$;', `c) $x : ${ze} - y : ${ze}$.`),
    solution: lines(
      `a) Scriem $${D} = ${z}^{${a}}$:`,
      show(`(x - y)^{${p}} : z^{${q}} = \\left(${z}^{${a}}\\right)^{${p}} : ${z}^{${q}} = ${z}^{${a * p}} : ${z}^{${q}} = ${a * p - q === 1 ? z : `${z}^{${a * p - q}} = ${r1}`}`),
      'b) Dăm factor comun pe $z$:',
      show(`x \\cdot z - y \\cdot z = (x - y) \\cdot z = ${D} \\cdot ${z} = ${D * z}`),
      'c) Împărțirea este distributivă față de scădere:',
      show(`x : ${ze} - y : ${ze} = (x - y) : ${ze} = ${D} : ${z ** e} = ${D / z ** e}`),
    ),
    verify: () => {
      const y = 1000 * z ** e
      const x = y + D
      return D ** p / z ** q === r1 && x * z - y * z === D * z && x / z ** e - y / z ** e === D / z ** e
    },
  }
}

/** Two siblings: the sum of their ages, t years ago one was 1/k of the other; when was it p/q? Testul 3, ex. 11. */
export function recapAgesTwoMoments(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3])
    const unit = int(rng, 3, 12)
    const t = int(rng, 3, 12)
    const Y = unit + t
    const O = k * unit + t
    const S = Y + O
    if (S > 80) continue
    const [p, q] = pick(rng, [[1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [4, 7], [5, 7], [5, 6]] as const)
    const num = q * Y - p * O
    if (num <= 0 || num % (q - p)) continue
    const t2 = num / (q - p)
    if (t2 <= 0 || t2 >= Y || t2 === t || p * k === q) continue
    const young = rng() < 0.5 ? girl(rng) : boy(rng)
    let old = rng() < 0.5 ? girl(rng) : boy(rng)
    if (old === young) old = young in GIRLS ? boy(rng) : girl(rng)
    const d = O - Y
    const Y2 = Y - t2
    return {
      text: lines(
        `${young} și ${old} sunt frați. Suma vârstelor lor este de ${deN(S)} ani. În urmă cu ${deN(t)} ani, vârsta ${gen(young)} era ${part(1, k)} din vârsta ${gen(old)}.`,
        `a) Ce vârstă are ${young} acum?`,
        `b) În urmă cu câți ani vârsta ${gen(young)} era ${part(p, q)} din vârsta ${gen(old)}?`,
      ),
      solution: lines(
        `a) În urmă cu ${t} ani, ${young} avea o parte, iar ${old} ${k} părți; atunci suma vârstelor era $${S} - 2 \\cdot ${t} = ${S - 2 * t}$:`,
        show(`${k + 1} \\text{ parti} = ${S - 2 * t} \\Rightarrow 1 \\text{ parte} = ${unit}`),
        `Deci ${young} are acum $${unit} + ${t} = ${Y}$ ${deW(Y)}ani, iar ${old} are $${S} - ${Y} = ${O}$ ${deW(O)}ani.`,
        `b) Diferența de vârstă rămâne de ${deN(d)} ani. Când vârsta ${gen(young)} este ${part(p, q)} din vârsta ${gen(old)}, diferența reprezintă ${part(q - p, q)} din vârsta ${gen(old)}:`,
        show(`${q - p === 1 ? `${d} \\cdot ${q}` : `${d} : ${q - p} \\cdot ${q}`} = ${(d / (q - p)) * q}, \\qquad ${(d / (q - p)) * q} - ${d} = ${Y2}`),
        `Atunci ${young} avea ${deN(Y2)} ani, adică în urmă cu $${Y} - ${Y2} = ${t2}$ ${deW(t2)}ani.`,
      ),
      verify: () => Y + O === S && k * (Y - t) === O - t && q * (Y - t2) === p * (O - t2),
    }
  }
}

/** a = (p²)ⁿ·b^(2n+1) − p^(2n)·(b²)ⁿ = (pb)^(2n)·(b − 1): as a product, and is c·a a perfect square? Testul 9, ex. 11. */
export function recapPowerProductSquare(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, [2, 3, 5])
    const b = pick(rng, [3, 4, 6, 7, 8, 11])
    if (p === b) continue
    const yes = rng() < 0.5
    const c = yes ? b - 1 : pick(rng, [2, 3, 5, 6, 7])
    const isSq = (n: number) => Number.isInteger(Math.sqrt(n))
    if (isSq(c * (b - 1)) !== yes) continue
    const ca = c === 1 ? 'a' : `${c}a`
    return {
      text: lines(
        `Fie numărul $a = ${p * p}^{n} \\cdot ${b}^{2n+1} - ${p}^{2n} \\cdot ${b * b}^{n}$, unde $n \\in \\mathbb{N}$.`,
        'a) Scrieți-l pe $a$ sub formă de produs.',
        `b) Verificați dacă $${ca}$ este pătrat perfect.`,
      ),
      solution: lines(
        `a) Scriem $${p * p}^{n} = ${p}^{2n}$, $${b * b}^{n} = ${b}^{2n}$ și $${b}^{2n+1} = ${b}^{2n} \\cdot ${b}$, apoi dăm factor comun:`,
        show(`a = ${p}^{2n} \\cdot ${b}^{2n} \\cdot ${b} - ${p}^{2n} \\cdot ${b}^{2n} = ${p}^{2n} \\cdot ${b}^{2n} \\cdot (${b} - 1) = ${p * b}^{2n} \\cdot ${b - 1}`),
        show(`\\text{b) } ${c} \\cdot a = \\left(${p * b}^{n}\\right)^2 \\cdot ${c * (b - 1)}`),
        yes
          ? `Cum $${c * (b - 1)} = ${Math.sqrt(c * (b - 1))}^2$, obținem $${ca} = \\left(${Math.sqrt(c * (b - 1))} \\cdot ${p * b}^{n}\\right)^2$, deci este pătrat perfect.`
          : `${c * (b - 1)} nu este pătrat perfect, iar $\\left(${p * b}^{n}\\right)^2$ este, deci $${ca}$ nu este pătrat perfect (pentru $n = 0$, de exemplu, $${ca} = ${c * (b - 1)}$).`,
      ),
      verify: () => {
        for (const n of [0, 1, 2]) {
          const A = BigInt(p * p) ** BigInt(n) * BigInt(b) ** BigInt(2 * n + 1) - BigInt(p) ** BigInt(2 * n) * BigInt(b * b) ** BigInt(n)
          if (A !== BigInt(p * b) ** BigInt(2 * n) * BigInt(b - 1)) return false
          const v = Number(A) * c
          if (Number.isInteger(Math.sqrt(v)) !== yes) return false
        }
        return true
      },
    }
  }
}

// ================= applied problems (pp. 192–193) =================

/** "If I had k times my money and m lei more, I could buy the ball": k·x + m = P, p. 192, ex. 3. */
export function lifeBallMoney(rng: Rng): Made {
  const [obj, objA] = pick(rng, [['o minge', 'mingea'], ['o carte', 'cartea'], ['un joc', 'jocul'], ['o pereche de patine', 'patinele']] as const)
  const k = int(rng, 2, 5)
  const x = int(rng, 10, 90)
  const m = int(rng, 3, 40)
  const P = k * x + m
  const A = boy(rng)
  let B = boy(rng)
  if (B === A) B = girl(rng)
  const kw = TIMES[k]
  return {
    text: lines(
      `${A} are o sumă de bani. ${B} îl întreabă:`,
      `— Ai ${deN(P)} lei pentru a cumpăra ${obj}?`,
      `— Dacă aș avea de ${kw} ori suma pe care o am și încă ${deN(m)} lei, aș putea cumpăra ${objA}.`,
      `Calculați ce sumă de bani are ${A}.`,
    ),
    solution: lines(
      `Notăm cu $x$ suma lui ${A}. Atunci:`,
      show(`${k} \\cdot x + ${m} = ${P} \\Rightarrow ${k} \\cdot x = ${P - m} \\Rightarrow x = ${P - m} : ${k} = ${x} \\text{ lei}`),
    ),
    verify: () => k * x + m === P,
  }
}

/** The semester mean: the mean of the marks m_p, then m_s = (3·m_p + T) : 4, p. 193, ex. 9. */
export function lifeSemesterMean(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 6)
    const marks = Array.from({ length: n }, () => int(rng, 5, 10))
    const T = int(rng, 5, 10)
    const s = sum(marks)
    if ((100 * s) % n || ((300 * s) / n + 100 * T) % 4) continue
    const mp = s / n
    const ms = (3 * mp + T) / 4
    const name = pick(rng, [...BOYS, ...Object.keys(GIRLS)])
    const subj = pick(rng, ['matematică', 'limba română', 'istorie', 'geografie'])
    return {
      text: lines(
        `Media semestrială la o disciplină cu teză se calculează după formula $m_s = (3 \\cdot m_p + T) : 4$, unde $m_p$ este media notelor din catalog (media la evaluarea periodică), iar $T$ este nota obținută la teză.`,
        `Pe semestrul întâi, ${name} a obținut la ${subj} notele ${list(marks)}, iar la teză nota ${T}. Calculați:`,
        'a) media la evaluarea periodică;',
        'b) media semestrială.',
      ),
      solution: lines(
        show(`\\text{a) } m_p = \\frac{${marks.join(' + ')}}{${n}} = \\frac{${s}}{${n}} = ${dec(mp)}`),
        show(`\\text{b) } m_s = (3 \\cdot ${dec(mp)} + ${T}) : 4 = (${dec(3 * mp)} + ${T}) : 4 = ${dec(3 * mp + T)} : 4 = ${dec(ms)}`),
      ),
      verify: () => close((3 * (s / n) + T) / 4, ms),
    }
  }
}

/** N stairs; if he climbed k more, there would be m times more left than climbed: on which stair is he, p. 192, ex. 6. */
export function lifeStairs(rng: Rng): Made {
  for (;;) {
    const m = int(rng, 2, 4)
    const up = int(rng, 20, 100)
    const N2 = up * (m + 1)
    const k = int(rng, 2, 9)
    const x = up - k
    if (N2 > 500 || x <= 0) continue
    const A = boy(rng)
    return {
      text: `${A} și bunicul său și-au propus să urce cele ${deN(N2)} trepte ale unui deal. La un moment dat, ${A} se oprește să se odihnească, iar bunicul îi spune că, dacă ar mai urca încă ${k} trepte, ar mai avea de urcat de ${TIMES[m]} ori mai multe trepte decât a urcat până atunci. Pe ce treaptă se afla ${A}?`,
      solution: lines(
        `După încă ${k} trepte, treptele urcate ar fi o parte, iar cele rămase ${m} părți:`,
        show(`${m + 1} \\text{ parti} = ${N2} \\Rightarrow 1 \\text{ parte} = ${N2} : ${m + 1} = ${up}`),
        show(`${up} - ${k} = ${x}`),
        `${A} se afla pe treapta ${x}.`,
      ),
      verify: () => N2 - (x + k) === m * (x + k),
    }
  }
}

/** S fruits: a of one kind for each child, one of the other kind for every b children: how many children, p. 192, ex. 1. */
export function lifeFruitBowl(rng: Rng): Made {
  const [small, smallPl, big] = pick(rng, [['caise', 'caise', 'un strugure'], ['prune', 'prune', 'o pară'], ['mandarine', 'mandarine', 'o portocală'], ['nuci', 'nuci', 'un măr']] as const)
  const bigPl = { 'un strugure': 'struguri', 'o pară': 'pere', 'o portocală': 'portocale', 'un măr': 'mere' }[big]
  const a = int(rng, 2, 3)
  const b = int(rng, 2, 4)
  const g = int(rng, 3, 9)
  const S = g * (a * b + 1)
  const name = girl(rng)
  const kids = ['', '', 'doi', 'trei', 'patru'][b]
  return {
    text: `La masa festivă organizată de ziua ${gen(name)} s-au așezat în fructieră ${deN(S)} fructe: ${smallPl} și ${bigPl}. S-au socotit câte ${TIMES[a]} ${small} de copil și câte ${big} la ${kids} copii. Câți copii au participat la aniversare?`,
    solution: lines(
      `Pentru fiecare grup de ${b} copii se folosesc $${b} \\cdot ${a} = ${a * b}$ ${small} și ${big}, adică ${a * b + 1} fructe.`,
      show(`${S} : ${a * b + 1} = ${g} \\text{ grupuri}, \\qquad ${g} \\cdot ${b} = ${g * b} \\text{ copii}`),
    ),
    verify: () => (g * b) * a + (g * b) / b === S,
  }
}

/** Square tiles of side s on an L × W floor: along each side, in all, and the boxes, p. 192, ex. 8 a, b. */
export function lifeTiles(rng: Rng): Made {
  for (;;) {
    const L = 10 * int(rng, 25, 50)
    const W = 10 * int(rng, 18, 40)
    const s = pick(rng, [15, 20, 25, 30, 40, 50])
    const k = int(rng, 4, 10)
    if (W >= L || (L % s === 0 && W % s === 0)) continue
    const n1 = Math.ceil(L / s)
    const n2 = Math.ceil(W / s)
    const total = n1 * n2
    const boxes = Math.ceil(total / k)
    const along = (len: number, n: number) =>
      len % s === 0 ? `$${len} : ${s} = ${n}$ ${deW(n)}plăci` : `$${len} : ${s} = ${Math.floor(len / s)}$ rest ${len % s}, deci ${deN(n)} plăci (ultima tăiată)`
    return {
      text: lines(
        `Un faianțar trebuie să placheze cu plăci pătrate de gresie, cu latura de ${s} cm, pardoseala dreptunghiulară a unei bucătării, cu lungimea de ${L} cm și lățimea de ${W} cm. Plăcile se vând în cutii de câte ${k} plăci.`,
        'a) Câte plăci sunt necesare pe lungimea pardoselii? Dar pe lățimea ei?',
        'b) Câte plăci sunt necesare pentru toată pardoseala?',
        'c) Câte cutii trebuie cumpărate?',
      ),
      solution: lines(
        `a) Pe lungime: ${along(L, n1)}. Pe lățime: ${along(W, n2)}.`,
        show(`\\text{b) } ${n1} \\cdot ${n2} = ${total} \\text{ placi}`),
        total % k === 0
          ? `c) $${total} : ${k} = ${boxes}$ ${deW(boxes)}cutii.`
          : `c) $${total} : ${k} = ${Math.floor(total / k)}$ rest ${total % k}, deci sunt necesare ${deN(boxes)} cutii.`,
      ),
      verify: () => n1 * s >= L && (n1 - 1) * s < L && n2 * s >= W && (n2 - 1) * s < W && boxes * k >= total && (boxes - 1) * k < total,
    }
  }
}

/** Three children eat a pizza in t1, t2, t3 minutes: N pizzas together, p. 203, ex. 5. */
export function lifePizza(rng: Rng): Made {
  for (;;) {
    const T = pick(rng, [24, 30, 36, 40, 60])
    const divs = Array.from({ length: T }, (_, i) => i + 1).filter((d) => T % d === 0 && d >= 4)
    const ts = shuffle(rng, divs).slice(0, 3)
    if (ts.length < 3) continue
    const per = sum(ts.map((t) => T / t))
    const j = int(rng, 1, 4)
    const n = per * j
    if (n > 40) continue
    const names = shuffle(rng, BOYS).slice(0, 3)
    const time = T * j
    return {
      text: `${names[0]} poate mânca o pizza în ${deN(ts[0])} minute, ${names[1]} în ${deN(ts[1])} minute, iar ${names[2]} în ${deN(ts[2])} minute. În cât timp pot mânca cei trei băieți împreună ${n === 1 ? 'o pizza' : `${deN(n)} pizze`}?`,
      solution: lines(
        `În ${T} de minute, ${names[0]} mănâncă $${T} : ${ts[0]} = ${T / ts[0]}$, ${names[1]} mănâncă $${T} : ${ts[1]} = ${T / ts[1]}$, iar ${names[2]} mănâncă $${T} : ${ts[2]} = ${T / ts[2]}$ pizze.`,
        show(`${T / ts[0]} + ${T / ts[1]} + ${T / ts[2]} = ${per} \\text{ pizze in } ${T} \\text{ minute}`),
        show(`${n} : ${per} = ${j}, \\qquad ${j} \\cdot ${T} = ${time} \\text{ minute}`),
      ),
      verify: () => close(time * (1 / ts[0] + 1 / ts[1] + 1 / ts[2]), n),
    }
  }
}

/** The largest square tile (side between lo and hi cm) that covers an L × W floor exactly; the boxes, p. 193, ex. 8 c. */
export function lifeTilesLargest(rng: Rng): Made {
  for (;;) {
    const L = 10 * int(rng, 20, 60)
    const W = 10 * int(rng, 15, 45)
    const lo = 5
    const hi = pick(rng, [25, 30, 35, 40])
    const k = int(rng, 4, 10)
    if (W >= L) continue
    const g = gcd(L, W)
    const cands = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((s) => L % s === 0 && W % s === 0)
    if (!cands.length) continue
    const s = cands[cands.length - 1]
    if (s === 10) continue
    const total = (L / s) * (W / s)
    const boxes = Math.ceil(total / k)
    const divs = Array.from({ length: g }, (_, i) => i + 1).filter((d) => g % d === 0)
    return {
      text: `Un faianțar caută plăci pătrate de gresie care să acopere exact, fără tăieturi, o pardoseală dreptunghiulară cu lungimea de ${L} cm și lățimea de ${W} cm. Latura plăcii trebuie să fie un număr natural de centimetri, cuprins între ${lo} cm și ${hi} cm, cât mai mare posibil. Care este latura plăcii? Câte cutii de câte ${k} plăci sunt necesare?`,
      solution: lines(
        `Latura plăcii trebuie să dividă și ${L}, și ${W}, deci să fie un divizor comun al lor. Divizorii comuni sunt divizorii lui ${g}:`,
        show(`${divs.join(', ')}`),
        `Cel mai mare dintre ei cuprins între ${lo} și ${hi} este ${s}, deci latura plăcii este de ${s} cm.`,
        show(`(${L} : ${s}) \\cdot (${W} : ${s}) = ${L / s} \\cdot ${W / s} = ${total} \\text{ placi}`),
        total % k === 0 ? `Sunt necesare $${total} : ${k} = ${boxes}$ ${deW(boxes)}cutii.` : `$${total} : ${k} = ${Math.floor(total / k)}$ rest ${total % k}, deci sunt necesare ${deN(boxes)} cutii.`,
      ),
      verify: () => L % s === 0 && W % s === 0 && !cands.some((c) => c > s) && boxes * k >= total && (boxes - 1) * k < total,
    }
  }
}

/** Creangă's two travellers: a and b loaves eaten equally by three, the third pays M lei: the fair split, p. 193, ex. 10. */
export function lifeCreangaBread(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 3, 9)
    const b = int(rng, 2, a - 1)
    if (2 * b <= a) continue
    const u = int(rng, 1, 4)
    const M2 = (a + b) * u
    const first = (2 * a - b) * u
    const second = (2 * b - a) * u
    const each: Q = reduce(a + b, 3)
    return {
      text: `Doi călători se opresc lângă un izvor să mănânce. Unul avea în desagă ${a} pâini, iar celălalt ${b} pâini. Sosește un al treilea drumeț, flămând, iar primii doi îl poftesc să mănânce împreună cu ei. Cei trei mănâncă toate pâinile, în mod egal, iar la plecare al treilea drumeț le dă celor doi ${deN(M2)} lei. Cum trebuie împărțiți banii, în mod echitabil, după cantitatea de pâine cu care a contribuit fiecare?`,
      solution: lines(
        `Fiecare drumeț a mâncat $${a + b} : 3 = ${F(each)}$ pâini. Al treilea a primit pâine de la amândoi:`,
        show(`${a} - ${F(each)} = ${F(sub([a, 1], each))} \\text{ (de la primul)}, \\qquad ${b} - ${F(each)} = ${F(sub([b, 1], each))} \\text{ (de la al doilea)}`),
        `Cei doi au dat pâine în raportul ${2 * a - b} : ${2 * b - a}, deci banii se împart în ${a + b} părți egale:`,
        show(`${M2} : ${a + b} = ${u}, \\qquad ${2 * a - b} \\cdot ${u} = ${first}, \\qquad ${2 * b - a} \\cdot ${u} = ${second}`),
        `Primul drumeț primește ${lei(first)}, iar al doilea ${lei(second)}.`,
      ),
      verify: () => first + second === M2 && close(first / second, (a - (a + b) / 3) / (b - (a + b) / 3)),
    }
  }
}

// ================= school contests (pp. 203–206) =================

/** The two-digit numbers that divided by d give a one-digit quotient and the remainder r, p. 203, ex. 1 a. */
export function contestQuotientDigit(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 4, 12)
    const r = int(rng, 0, d - 1)
    const qs = Array.from({ length: 10 }, (_, q) => q).filter((q) => d * q + r >= 10 && d * q + r <= 99)
    if (qs.length < 2) continue
    const ns = qs.map((q) => d * q + r)
    return {
      text: `Aflați numerele de două cifre care, împărțite la ${d}, dau câtul de o cifră și restul ${r}.`,
      solution: lines(
        `Numerele sunt de forma $n = ${d} \\cdot c + ${r}$, cu câtul $c \\in \\{0, 1, \\ldots, 9\\}$ și $10 \\le n \\le 99$, deci $c \\in \\{${qs.join(', ')}\\}$:`,
        show(`n \\in \\{${ns.join(', ')}\\}`),
      ),
      verify: () => {
        const all: number[] = []
        for (let n = 10; n <= 99; n++) if (n % d === r && Math.floor(n / d) <= 9) all.push(n)
        return all.join() === ns.join()
      },
    }
  }
}

/** The numbers ab whose remainder at the division by d is a perfect square (cube), p. 205, ex. 29. */
export function contestRemainderSquare(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 20, 45)
    const cube = rng() < 0.3
    const special = (cube ? [0, 1, 8, 27] : [0, 1, 4, 9, 16, 25, 36]).filter((x) => x < d)
    const ns: number[] = []
    for (let n = 10; n <= 99; n++) if (special.includes(n % d)) ns.push(n)
    if (ns.length < 3 || ns.length > 20) continue
    const byQ = new Map<number, number[]>()
    for (const n of ns) byQ.set(Math.floor(n / d), [...(byQ.get(Math.floor(n / d)) ?? []), n])
    return {
      text: `Aflați numerele naturale de forma $\\overline{ab}$ care, împărțite la ${d}, dau restul un ${cube ? 'cub perfect' : 'pătrat perfect'}.`,
      solution: lines(
        `Restul este mai mic decât ${d}, deci poate fi ${list(special)}. Numerele sunt de forma $${d} \\cdot c + r$; le scriem pe rând, după cât:`,
        ...[...byQ].map(([q, l]) => `câtul ${q}: ${l.join(', ')};`),
        `În total: ${ns.join(', ')}.`,
      ),
      verify: () => ns.every((n) => n >= 10 && n <= 99 && special.includes(n % d)) && ns.length === Array.from({ length: 90 }, (_, i) => i + 10).filter((n) => special.includes(n % d)).length,
    }
  }
}

/** The digit sum of abc is s: the possible digit sums of abc + k, p. 205, ex. 26. */
export function contestDigitSumAfterAdding(rng: Rng): Made {
  const s = int(rng, 19, 26)
  const k = int(rng, 1, 5)
  const all: number[] = []
  for (let n = 100; n <= 999; n++) if (digitSum(n) === s) all.push(n)
  const cases: [string, number, number][] = []
  const ex = (f: (n: number) => boolean) => all.find(f)
  const c0 = ex((n) => n % 10 + k <= 9)
  if (c0 !== undefined) cases.push([`Dacă $c + ${k} \\le 9$, nu apare trecere peste ordin: suma cifrelor devine $${s} + ${k} = ${s + k}$`, s + k, c0])
  const c1 = ex((n) => n % 10 + k >= 10 && Math.floor(n / 10) % 10 <= 8)
  if (c1 !== undefined) cases.push([`Dacă $c + ${k} \\ge 10$ și $b \\le 8$, cifra unităților devine $c + ${k} - 10$, iar $b$ crește cu 1: suma devine $${s} + ${k} - 10 + 1 = ${s + k - 9}$`, s + k - 9, c1])
  const c2 = ex((n) => n % 10 + k >= 10 && Math.floor(n / 10) % 10 === 9 && n < 900)
  if (c2 !== undefined) cases.push([`Dacă $c + ${k} \\ge 10$, $b = 9$ și $a \\le 8$, cifra zecilor devine 0, iar $a$ crește cu 1: suma devine $${s} + ${k} - 10 - 9 + 1 = ${s + k - 18}$`, s + k - 18, c2])
  const c3 = ex((n) => n % 10 + k >= 10 && Math.floor(n / 10) === 99)
  if (c3 !== undefined) cases.push([`Dacă $c + ${k} \\ge 10$ și $a = b = 9$, se obține un număr de patru cifre, $\\overline{100u}$, cu $u = c + ${k} - 10$: suma devine $${s} + ${k} - 10 - 9 - 9 + 1 = ${s + k - 27}$`, s + k - 27, c3])
  const answers = [...new Set(cases.map((c) => c[1]))]
  return {
    text: `Suma cifrelor numărului $\\overline{abc}$ este ${s}. Calculați suma cifrelor numărului $\\overline{abc} + ${k}$.`,
    solution: lines(
      ...cases.map(([t, , n]) => `${t} (de exemplu, $${n} + ${k} = ${n + k}$).`),
      answers.length === 1 ? `Suma cifrelor este ${answers[0]}.` : `Suma cifrelor poate fi ${list(answers)}.`,
    ),
    verify: () => {
      const got = new Set(all.map((n) => digitSum(n + k)))
      return got.size === answers.length && answers.every((a) => got.has(a))
    },
  }
}

/** The powers of b written with c digits, p. 205, ex. 28 a. */
export function contestPowersWithDigits(rng: Rng): Made {
  const b = int(rng, 2, 9)
  const c = int(rng, 3, 6)
  const ks: number[] = []
  for (let e = 1; b ** e < 10 ** c; e++) if (b ** e >= 10 ** (c - 1)) ks.push(e)
  const prev = ks[0] - 1
  const next = ks[ks.length - 1] + 1
  return {
    text: `Care puteri ale numărului ${b} se scriu cu ${c} cifre (în baza 10)?`,
    solution: lines(
      'Calculăm puterile pe rând, în jurul numerelor cu ' + c + ' cifre:',
      show(`${b}^{${prev}} = ${nr(b ** prev)}, \\quad ${ks.map((e) => `${b}^{${e}} = ${nr(b ** e)}`).join(', \\quad ')}, \\quad ${b}^{${next}} = ${nr(b ** next)}`),
      `Au ${c} cifre: $${ks.map((e) => `${b}^{${e}}`).join(', ')}$.`,
    ),
    verify: () => ks.every((e) => String(b ** e).length === c) && String(b ** prev).length < c && String(b ** next).length > c,
  }
}

/** The pairs (aₙ, bₙ) = (p(n + r), q(n − 1)): the first pairs, a far pair, and the missing number of a pair, p. 205, ex. 38. */
export function contestPairSequence(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 5)
    const q = int(rng, 2, 5)
    const r = int(rng, 1, 3)
    if (p === q) continue
    const Nn = int(rng, 2000, 2030)
    const n1 = int(rng, 50, 400)
    const n2 = int(rng, 50, 400)
    const Y = q * (n1 - 1)
    const x = p * (n1 + r)
    const X = p * (n2 + r)
    const y = q * (n2 - 1)
    const pair = (n: number) => `(${nr(p * (n + r))}, ${nr(q * (n - 1))})`
    return {
      text: lines(
        `Se consideră perechile de numere naturale $(a_n, b_n)$, unde $a_n = ${p} \\cdot (n + ${r})$ și $b_n = ${q} \\cdot (n - 1)$, pentru $n \\ge 2$.`,
        'a) Scrieți perechile $(a_2, b_2)$, $(a_3, b_3)$, $(a_4, b_4)$.',
        `b) Scrieți perechea $(a_{${Nn}}, b_{${Nn}})$.`,
        `c) Determinați: 1) $x$, dacă perechea $(x, ${nr(Y)})$ face parte din șir; 2) $y$, dacă perechea $(${nr(X)}, y)$ face parte din șir.`,
      ),
      solution: lines(
        `a) $${pair(2)}$, $${pair(3)}$, $${pair(4)}$.`,
        `b) $(a_{${Nn}}, b_{${Nn}}) = ${pair(Nn)}$.`,
        show(`\\text{c) 1) } ${q} \\cdot (n - 1) = ${nr(Y)} \\Rightarrow n = ${n1} \\Rightarrow x = ${p} \\cdot ${n1 + r} = ${nr(x)}`),
        show(`\\text{2) } ${p} \\cdot (n + ${r}) = ${nr(X)} \\Rightarrow n = ${n2} \\Rightarrow y = ${q} \\cdot ${n2 - 1} = ${nr(y)}`),
      ),
      verify: () => Y === q * (n1 - 1) && x === p * (n1 + r) && X / p - r === n2 && y === q * (n2 - 1),
    }
  }
}

/** a = B^(n+2) − (B² − 1)·Bⁿ = Bⁿ and b = (C + 1)·C^(m+2) − C^(m+3) = C^(m+2) at given places among 0, 1, 2, …, p. 206, ex. 39. */
export function contestPowerPosition(rng: Rng): Made {
  for (;;) {
    const B = pick(rng, [2, 3, 4])
    const C = pick(rng, [2, 3, 5])
    const n = int(rng, 3, B === 2 ? 14 : 8)
    const m = int(rng, 1, C === 2 ? 12 : 5)
    const va = B ** n
    const vb = C ** (m + 2)
    if (va === vb || vb > 1e6) continue
    const c1 = B * B - 1
    return {
      text: `Se dau numerele $a = ${B}^{n+2} - ${c1} \\cdot ${B}^{n}$ și $b = ${C + 1} \\cdot ${C}^{m+2} - ${C}^{m+3}$. Determinați numerele naturale $n$ și $m$, astfel încât numerele $a$ și $b$ să ocupe locurile ${N(va + 1)}, respectiv ${N(vb + 1)}, în șirul numerelor naturale $0, 1, 2, 3, \\ldots$`,
      solution: lines(
        'Dăm factor comun cea mai mică putere:',
        show(`a = ${B}^{n} \\cdot (${B * B} - ${c1}) = ${B}^{n}, \\qquad b = ${C}^{m+2} \\cdot (${C + 1} - ${C}) = ${C}^{m+2}`),
        'Pe locul $k$ al șirului $0, 1, 2, \\ldots$ se află numărul $k - 1$:',
        show(`${B}^{n} = ${nr(va)} = ${B}^{${n}} \\Rightarrow n = ${n}, \\qquad ${C}^{m+2} = ${nr(vb)} = ${C}^{${m + 2}} \\Rightarrow m = ${m}`),
      ),
      verify: () => B ** (n + 2) - c1 * B ** n === va && (C + 1) * C ** (m + 2) - C ** (m + 3) === vb,
    }
  }
}

/** The three-digit numbers that become k times smaller when the middle digit is erased, p. 206, ex. 40. */
export function contestEraseMiddle(rng: Rng): Made {
  const k = pick(rng, [6, 7, 9, 12, 13, 14, 15, 16, 17, 18, 19])
  const sols: number[] = []
  for (let n = 100; n <= 999; n++) {
    const a = Math.floor(n / 100)
    const c = n % 10
    if (n === k * (10 * a + c)) sols.push(n)
  }
  const A = 100 - 10 * k
  const eq = A >= 0 ? `${A}a + 10b = ${k - 1}c` : `10b = ${-A}a + ${k - 1}c`
  return {
    text: `Aflați numerele de trei cifre care se micșorează de ${k} ori dacă li se șterge cifra din mijloc.`,
    solution: lines(
      `Căutăm $\\overline{abc}$ cu $\\overline{abc} = ${k} \\cdot \\overline{ac}$:`,
      show(`100a + 10b + c = ${k} \\cdot (10a + c) \\Rightarrow ${eq}`),
      `Încercând valorile cifrelor (cu $a \\ne 0$), egalitatea are loc doar pentru: ${sols.map((n) => `$${n} = ${k} \\cdot ${Math.floor(n / 100) * 10 + (n % 10)}$`).join(', ')}.`,
    ),
    verify: () => sols.length > 0 && sols.every((n) => (100 - 10 * k) * Math.floor(n / 100) + 10 * (Math.floor(n / 10) % 10) === (k - 1) * (n % 10)),
  }
}

/** The largest prime abcd with c + d = a and a + b + c + d = S, p. 205, ex. 31. */
export function contestLargestPrime(rng: Rng): Made {
  for (;;) {
    const S = int(rng, 4, 14)
    const cands: number[] = []
    for (let n = 1000; n <= 9999; n++) {
      const [a, b, c, d] = String(n).split('').map(Number)
      if (c + d === a && a + b + c + d === S) cands.push(n)
    }
    cands.sort((x, y) => y - x)
    const i = cands.findIndex(isPrime)
    if (i < 0 || i > 10) continue
    const best = cands[i]
    const rejected = cands.slice(0, i).map((n) => `$${nr(n)} = ${smallestFactor(n)} \\cdot ${nr(n / smallestFactor(n))}$`)
    return {
      text: `Aflați cel mai mare număr prim de forma $\\overline{abcd}$, știind că $c + d = a$ și $a + b + c + d = ${S}$.`,
      solution: lines(
        `Din $c + d = a$ rezultă $2a + b = ${S}$. Scriem numerele care îndeplinesc condițiile, de la cel mai mare, până la primul număr prim.`,
        rejected.length ? `Nu sunt prime: ${rejected.join(', ')}.` : 'Cel mai mare număr care îndeplinește condițiile este chiar prim.',
        `Numărul $${nr(best)}$ nu se divide cu niciun număr prim până la $${Math.floor(Math.sqrt(best))}$, deci este prim. Răspuns: $${nr(best)}$.`,
      ),
      verify: () => isPrime(best) && !cands.some((n) => n > best && isPrime(n)),
    }
  }
}

/** A family of four: the boy was born when the father was F, the girl when the mother was M and the boy g; the sum of ages, p. 204, ex. 16. */
export function contestFamilyAges(rng: Rng): Made {
  for (;;) {
    const bAge = int(rng, 8, 18)
    const g = int(rng, 2, 6)
    const F0 = int(rng, 22, 35)
    const M0 = int(rng, 20, 33)
    const girlAge = bAge - g
    if (girlAge < 1) continue
    const father = bAge + F0
    const mother = girlAge + M0
    const S = father + mother + bAge + girlAge
    return {
      text: `Într-o familie de 4 persoane, suma vârstelor este de ${deN(S)} ani. Băiatul s-a născut când tatăl avea ${deN(F0)} ani, iar fata s-a născut când mama avea ${deN(M0)} ani și fratele său ${g} ani. Puteți afla ce vârstă are fiecare acum?`,
      solution: lines(
        'Notăm cu $x$ vârsta băiatului. Atunci fata are $x - ' + g + '$ ani, tatăl $x + ' + F0 + '$ ani, iar mama $(x - ' + g + ') + ' + M0 + ' = x + ' + (M0 - g) + '$ ani.',
        show(`x + (x - ${g}) + (x + ${F0}) + (x + ${M0 - g}) = ${S} \\Rightarrow 4x + ${F0 + M0 - 2 * g} = ${S} \\Rightarrow x = ${bAge}`),
        `Băiatul are ${bAge} ani, fata ${girlAge} ani, tatăl ${father} de ani, iar mama ${mother} de ani.`,
      ),
      verify: () => father - bAge === F0 && mother - girlAge === M0 && bAge - girlAge === g && 4 * bAge + F0 + M0 - 2 * g === S,
    }
  }
}

/** αa + βb = N, a·c = P, b·c = Q: a and b are in the ratio P : Q, p. 203, ex. 3. */
export function contestRatioProducts(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 7)
    const q = int(rng, 2, 7)
    if (gcd(p, q) !== 1 || p === q) continue
    const t = int(rng, 1, 6)
    const c = int(rng, 2, 15)
    const al = int(rng, 2, 7)
    const be = int(rng, 2, 7)
    const [a, b] = [p * t, q * t]
    const Nv = al * a + be * b
    const [P, Qv] = [a * c, b * c]
    return {
      text: `Determinați numerele naturale $a$, $b$, $c$, știind că $${al}a + ${be}b = ${Nv}$, $a \\cdot c = ${P}$, iar $b \\cdot c = ${Qv}$.`,
      solution: lines(
        'Împărțind cele două produse, $c$ se simplifică:',
        show(`\\frac{a}{b} = \\frac{a \\cdot c}{b \\cdot c} = \\frac{${P}}{${Qv}} = \\frac{${p}}{${q}} \\Rightarrow a = ${cv(p, 'k')}, \\; b = ${q}k`),
        show(`${al} \\cdot ${cv(p, 'k')} + ${be} \\cdot ${q}k = ${Nv} \\Rightarrow ${al * p + be * q}k = ${Nv} \\Rightarrow k = ${t}`),
        show(`a = ${a}, \\quad b = ${b}, \\quad c = ${P} : ${a} = ${c}`),
      ),
      verify: () => al * a + be * b === Nv && a * c === P && b * c === Qv && Nv % (al * p + be * q) === 0,
    }
  }
}

/** a + b + c = S and a + βb − 2c = T: 3a + (β + 2)b = 2S + T, then the solution with the smallest b, p. 204, ex. 19. */
export function contestSmallestB(rng: Rng): Made {
  for (;;) {
    const be = pick(rng, [2, 3, 5])
    const [a0, b0, c0] = [int(rng, 5, 60), int(rng, 1, 20), int(rng, 1, 30)]
    const S = a0 + b0 + c0
    const T = a0 + be * b0 - 2 * c0
    if (T <= 0) continue
    const R2 = 2 * S + T
    let best: [number, number, number] | undefined
    for (let b = 0; b <= S && !best; b++) {
      const r = R2 - (be + 2) * b
      if (r < 0 || r % 3) continue
      const a = r / 3
      const c = S - a - b
      if (c >= 0) best = [a, b, c]
    }
    if (!best) continue
    const [a, b, c] = best
    const bs: number[] = []
    for (let x = 0; x <= b; x++) if ((R2 - (be + 2) * x) % 3 === 0) bs.push(x)
    return {
      text: lines(
        `Numerele naturale $a$, $b$, $c$ îndeplinesc simultan condițiile $a + b + c = ${S}$ și $a + ${be}b - 2c = ${T}$.`,
        `a) Arătați că $3a + ${be + 2}b = ${R2}$.`,
        'b) Determinați numerele $a$, $b$, $c$, știind că $b$ are cea mai mică valoare posibilă.',
      ),
      solution: lines(
        'a) Înmulțim prima egalitate cu 2 și o adunăm cu a doua, ca să dispară $c$:',
        show(`2a + 2b + 2c + a + ${be}b - 2c = ${2 * S} + ${T} \\Rightarrow 3a + ${be + 2}b = ${R2}`),
        `b) Din $3a = ${R2} - ${be + 2}b$, numărul $${R2} - ${be + 2}b$ trebuie să se dividă cu 3. Încercăm valorile lui $b$ de la 0: cea mai mică pentru care $${R2} - ${be + 2}b$ se divide cu 3, iar $c = ${S} - a - b$ iese natural, este $b = ${b}$:`,
        show(`3a = ${R2} - ${(be + 2) * b} = ${R2 - (be + 2) * b} \\Rightarrow a = ${a}, \\qquad c = ${S} - ${a} - ${b} = ${c}`),
      ),
      verify: () => a + b + c === S && a + be * b - 2 * c === T && bs.includes(b),
    }
  }
}

/** 1, 2, …, n on a board: two are replaced by their sum (the total stays), or by their difference (the parity stays), p. 205, ex. 33. */
export function contestBoardInvariant(rng: Rng): Made {
  const n = int(rng, 15, 60)
  const total = (n * (n + 1)) / 2
  if (rng() < 0.5) {
    let other = total + pick(rng, [-1, 1]) * int(rng, 1, 99)
    if (other === total) other++
    const [x, y] = rng() < 0.5 ? [total, other] : [other, total]
    const ans = (v: number) => (v === total ? 'da: suma rămâne mereu aceeași, deci este ' + nr(total) + ' la orice moment' : `nu, pentru că suma este mereu ${nr(total)}`)
    return {
      text: `Pe o tablă sunt scrise numerele de la 1 la ${n}. Se șterg două numere și se scrie pe tablă suma lor. Este posibil ca, prin repetarea acestui procedeu, la un moment dat suma numerelor de pe tablă să fie ${N(x)}? Dar ${N(y)}? Justificați.`,
      solution: lines(
        'Când ștergem $a$ și $b$ și scriem $a + b$, suma tuturor numerelor de pe tablă nu se schimbă. La început ea este:',
        show(`1 + 2 + \\ldots + ${n} = \\frac{${n} \\cdot ${n + 1}}{2} = ${nr(total)}`),
        `Pentru ${N(x)}: ${ans(x)}. Pentru ${N(y)}: ${ans(y)}.`,
      ),
      verify: () => (x === total) !== (y === total),
    }
  }
  const X = 2 * int(rng, 1, 40) + (total % 2 === 0 ? 1 : 0)
  return {
    text: `Pe o tablă sunt scrise numerele de la 1 la ${n}. Se șterg două numere și se scrie pe tablă diferența lor (cel mai mare minus cel mai mic). Se repetă procedeul până rămâne un singur număr. Poate fi acesta ${X}? Justificați.`,
    solution: lines(
      'Când ștergem $a$ și $b$ ($a \\ge b$) și scriem $a - b$, suma de pe tablă scade cu $2b$, un număr par, deci paritatea sumei nu se schimbă. La început suma este:',
      show(`1 + 2 + \\ldots + ${n} = \\frac{${n} \\cdot ${n + 1}}{2} = ${nr(total)}`),
      `Suma este ${total % 2 === 0 ? 'pară' : 'impară'}, deci ultimul număr rămas este ${total % 2 === 0 ? 'par' : 'impar'}. Nu poate fi ${X}, care este ${X % 2 === 0 ? 'par' : 'impar'}.`,
    ),
    verify: () => X % 2 !== total % 2,
  }
}

/** R rooms, P people, each room used, no two rooms with the same number of people: possible when P ≥ 1 + 2 + … + R, p. 204, ex. 15. */
export function contestDistinctRooms(rng: Rng): Made {
  const R2 = int(rng, 8, 25)
  const min = (R2 * (R2 + 1)) / 2
  const P = min + int(rng, -15, 15)
  const ok = P >= min
  return {
    text: `Într-un hotel sunt ${deN(R2)} camere. Cu ocazia unui simpozion de matematică sosesc ${deN(P)} participanți. Precizați dacă este posibil ca aceștia să fie cazați în toate cele ${deN(R2)} camere, astfel încât să nu existe două camere cu același număr de persoane. Justificați răspunsul.`,
    solution: lines(
      `Dacă numerele de persoane din camere sunt diferite și fiecare este cel puțin 1, atunci, ordonate crescător, ele sunt cel puțin $1, 2, 3, \\ldots, ${R2}$, deci în total sunt cel puțin`,
      show(`1 + 2 + \\ldots + ${R2} = \\frac{${R2} \\cdot ${R2 + 1}}{2} = ${min} \\text{ persoane}`),
      ok
        ? `Cum $${P} \\ge ${min}$, este posibil: de exemplu, câte $1, 2, \\ldots, ${R2 - 1}$ persoane în primele ${deN(R2 - 1)} camere și ${R2 + P - min} în ultima.`
        : `Cum $${P} < ${min}$, nu este posibil.`,
    ),
    verify: () => ok === (P >= min) && (!ok || (R2 - 1) * R2 / 2 + (R2 + P - min) === P),
  }
}

/** n⁴ − n³ − n² equals the sum of the largest remainders at the division by D, d₂ and d₃: n, p. 203, ex. 9 b. */
export function contestLargestRemainders(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 9)
    const V = n * n * (n * n - n - 1)
    const [d2, d3] = shuffle(rng, [2, 3, 5, 7, 9, 10, 11]).slice(0, 2)
    const D = V - (d2 - 1) - (d3 - 1) + 1
    if (D <= Math.max(d2, d3)) continue
    const val4 = (x: number) => x ** 4 - x ** 3 - x ** 2
    return {
      text: `Determinați numărul natural nenul $n$, știind că $n^4 - n^3 - n^2$ este egal cu suma celor mai mari resturi posibile la împărțirea cu ${N(D)}, cu ${d2} și, respectiv, cu ${d3}.`,
      solution: lines(
        'Cel mai mare rest posibil la împărțirea cu $d$ este $d - 1$:',
        show(`n^4 - n^3 - n^2 = ${nr(D - 1)} + ${d2 - 1} + ${d3 - 1} = ${nr(V)}`),
        show(`n^2 \\cdot (n^2 - n - 1) = ${nr(V)}`),
        `Expresia crește odată cu $n$ (pentru $n \\ge 2$): ${[n - 1, n, n + 1].map((x) => `pentru $n = ${x}$ obținem $${nr(val4(x))}$`).join(', ')}. Deci $n = ${n}$.`,
      ),
      verify: () => val4(n) === V && D - 1 + d2 - 1 + d3 - 1 === V && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((x) => val4(x) === V).length === 1,
    }
  }
}

/** a gives the remainder r at p, b the remainder s at q: the remainder of αb + βa at M, p. 205, ex. 34. */
export function contestRemainderCombination(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, [4, 5, 6, 8, 9, 10, 12])
    const q = pick(rng, [4, 5, 6, 8, 9, 10, 12])
    if (p === q) continue
    const Mv = lcm(p, q)
    if (Mv > 60) continue
    const r = int(rng, 1, p - 1)
    const s = int(rng, 1, q - 1)
    const [i1, j1, i2, j2] = [int(rng, 1, 3), int(rng, 1, 3), int(rng, 1, 3), int(rng, 1, 3)]
    const al1 = (Mv / q) * i1
    const be1 = (Mv / p) * j1
    const al2 = (Mv / q) * i2
    const be2 = (Mv / p) * j2
    if (al1 === al2 && be1 === be2) continue
    const rem = (al: number, be: number) => (al * s + be * r) % Mv
    const step = (al: number, be: number, part: string) => {
      const c = al * s + be * r
      return lines(
        show(`\\text{${part}) } ${cv(al, 'b')} + ${cv(be, 'a')} = ${cv(al * q, 'v')} + ${al * s} + ${cv(be * p, 'u')} + ${be * r} = ${Mv} \\cdot (${cv((al * q) / Mv, 'v')} + ${cv((be * p) / Mv, 'u')}) + ${c}`),
        c >= Mv ? `Cum $${c} = ${Mv} \\cdot ${Math.floor(c / Mv)} + ${c % Mv}$, restul este ${c % Mv}.` : `Restul este ${c}.`,
      )
    }
    return {
      text: lines(
        `Restul împărțirii numărului natural $a$ la ${p} este ${r}, iar restul împărțirii numărului natural $b$ la ${q} este ${s}.`,
        `a) Calculați restul împărțirii numărului $${cv(al1, 'b')} + ${cv(be1, 'a')}$ la ${Mv}.`,
        `b) Calculați restul împărțirii numărului $${cv(al2, 'b')} + ${cv(be2, 'a')}$ la ${Mv}.`,
      ),
      solution: lines(`Scriem $a = ${p}u + ${r}$ și $b = ${q}v + ${s}$, cu $u, v$ naturale.`, step(al1, be1, 'a'), step(al2, be2, 'b')),
      verify: () => {
        for (const [u, v] of [[0, 0], [3, 7], [11, 2]]) {
          const a = p * u + r
          const b = q * v + s
          if ((al1 * b + be1 * a) % Mv !== rem(al1, be1) || (al2 * b + be2 * a) % Mv !== rem(al2, be2)) return false
        }
        return true
      },
    }
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-fraction-mult', label: 'Fracții ordinare: înmulțirea, împărțirea și puterea', topic: 'Algebră',
    forms: {
      1: [fracTimesLarger, fracDoubleThirdSquare, fracProductQuotient],
      2: [fracMixedProduct, fracDivideBySum, fracPowerEquation, fracPowersMixed],
      3: [fracTelescoping, fracPowerQuotient, fracTrueFalse],
    },
  },
  {
    id: 'v-fraction-order', label: 'Fracții ordinare: ordinea operațiilor și numere mixte', topic: 'Algebră',
    forms: {
      1: [fracMixedPlus, fracLessThanDifference, fracSubtractSum],
      2: [fracMixedDivideMinus, fracAddProductSubtract, fracSquaresOfDifferences],
      3: [fracBigBracket, fracChainCube, fracLettersXYZ],
    },
  },
  {
    id: 'v-fraction-props', label: 'Fracții: scriere, echivalență, comparare, părți dintr-un număr', topic: 'Algebră',
    forms: {
      1: [fracFromWords, fracEquivalentGiven, fracDiscount, fracPartOfPart],
      2: [fracProgressionQuotient, fracPairSums, fracOrderThree, fracSubunitarySum, fracEquivalentSmallest],
      3: [fracExtractWholes, fracOrderOverlines, fracDoubleInequality],
    },
  },
  {
    id: 'v-recap-tests', label: 'Teste recapitulative: probleme cu numere naturale', topic: 'Algebră',
    forms: {
      1: [recapTwoSets, recapQuotientRange, recapCommonDivisor],
      2: [recapReadingDays, recapStampsTransfer, recapSumOfForm, recapDifferenceExpressions],
      3: [recapAgesTwoMoments, recapPowerProductSquare],
    },
  },
  {
    id: 'v-everyday', label: 'Probleme de matematică aplicată în viața cotidiană', topic: 'Algebră',
    forms: {
      1: [lifeBallMoney, lifeSemesterMean, lifeStairs],
      2: [lifeFruitBowl, lifeTiles, lifePizza],
      3: [lifeTilesLargest, lifeCreangaBread],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-school-digits', label: 'Concursuri școlare: cifre, resturi, puteri și șiruri',
    forms: [contestQuotientDigit, contestRemainderSquare, contestDigitSumAfterAdding, contestPowersWithDigits, contestPairSequence, contestPowerPosition, contestEraseMiddle, contestLargestPrime],
  },
  {
    id: 'v-contest-school-problems', label: 'Concursuri școlare: vârste, egalități, invarianți',
    forms: [contestFamilyAges, contestRatioProducts, contestSmallestB, contestBoardInvariant, contestDistinctRooms, contestLargestRemainders, contestRemainderCombination],
  },
]
