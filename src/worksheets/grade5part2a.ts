// Grade V kinds from "Matematică, clasa a V-a", Mate 2000+ Consolidare (Paralela 45), partea a II-a, pp. 9–48,
// photographed by the user on 14 November 2026: decimal fractions (writing them, comparing, ordering, approximating),
// the chapter tests, adding, subtracting, multiplying and raising decimals to a power, ordinary fractions turned into
// periodic decimals and the arithmetic mean. Pages 14, 25, 30 (bottom), 33 and 41–44 were not among the photos.
// The levels follow the stars of the sections (Înțelegere * = 1, Aplicare ** = 2, Aprofundare *** = 3); the
// "Supermate ****" digit problems are the contest kind. Every form names its page and exercise.
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
/** contest level only: the "Supermate" digit problems */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const P10 = (k: number) => 10 ** k
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)
const DIGITS = range(0, 9)
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** n / 10^k with the Romanian comma: D(235, 2) = 2{,}35; the zeros at the end are dropped unless `keep`. */
function D(n: number, k: number, keep = false): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  let part = k > 0 ? s.slice(s.length - k) : ''
  if (!keep) part = part.replace(/0+$/, '')
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - k))) + (part ? `{,}${part}` : '')
}
/** The value of a number written by D, read back for the checks. */
const val = (s: string) => Number(s.replace(/\\,/g, '').replace('{,}', '.'))
const close = (x: number, y: number) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))
/** The numerator over 10^k of a decimal from lo to hi with exactly k decimals (the last one not 0). */
function rnd(rng: Rng, lo: number, hi: number, k: number): number {
  for (;;) {
    const n = int(rng, Math.round(lo * P10(k)), Math.round(hi * P10(k)))
    if (k === 0 || n % 10 !== 0) return n
  }
}
/** The names of the decimal places, and their genitive: "zecimi", "cifra zecimilor". */
const ORDG = ['zecimilor', 'sutimilor', 'miimilor', 'zecimilor de miimi']
/** n / 10^k cut to j decimals (prin lipsă), and rounded to j decimals: numerators over 10^j. */
const cut = (n: number, k: number, j: number) => Math.floor(n / P10(k - j))
const rounded = (n: number, k: number, j: number) => (k === j ? n : Math.floor((n + P10(k - j) / 2) / P10(k - j)))
/** A number in the prose: plain below 1 000, in a formula from 1 000 up, so that it gets its thin space. */
const prose = (n: number) => (Math.abs(n) >= 1000 ? `$${nr(n)}$` : String(n))
/** The word "de" alone, after a formula that ends with the number: "$… = 120$ de fracții". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
/** c·v with the coefficient 1 left out. */
const cv = (c: number, v: string) => (c === 1 ? v : `${c}${v}`)
const isFinite10 = (q: number) => {
  while (q % 2 === 0) q /= 2
  while (q % 5 === 0) q /= 5
  return q === 1
}
/** The smallest k with 10^k divisible by q (q has only the factors 2 and 5). */
const tenPower = (q: number) => {
  let k = 0
  while (P10(k) % q !== 0) k++
  return k
}

// ================= 1. Writing decimal fractions (pp. 9–13) =================

/** "w întregi și z zecimi" and the like, written as decimals, p. 10, ex. 2 and p. 12, ex. 13. */
export function decFromWords(rng: Rng): Made {
  const w1 = int(rng, 2, 60), z1 = int(rng, 2, 9)
  const w2 = int(rng, 2, 40), z2 = int(rng, 2, 9), s2 = int(rng, 2, 9)
  const w3 = int(rng, 2, 150), m3 = int(rng, 2, 99)
  const s4 = int(rng, 2, 99)
  const ans = [D(w1 * 10 + z1, 1), D(w2 * 100 + z2 * 10 + s2, 2), D(w3 * 1000 + m3, 3), D(s4, 2)]
  return {
    text: lines(
      'Scrieți sub formă de fracție zecimală:',
      `a) ${de(w1)} întregi și ${z1} zecimi; b) ${de(w2)} întregi, ${z2} zecimi și ${s2} sutimi; c) ${de(w3)} întregi și ${de(m3)} miimi; d) ${de(s4)} sutimi.`,
    ),
    solution: lines(
      'Zecimile se scriu pe primul loc după virgulă, sutimile pe al doilea, miimile pe al treilea (completăm cu zerouri, la nevoie):',
      show(`\\text{a) } ${w1} + \\frac{${z1}}{10} = ${ans[0]} \\qquad \\text{b) } ${w2} + \\frac{${z2}}{10} + \\frac{${s2}}{100} = ${ans[1]}`),
      show(`\\text{c) } ${w3} + \\frac{${m3}}{1000} = ${ans[2]} \\qquad \\text{d) } \\frac{${s4}}{100} = ${ans[3]}`),
    ),
    verify: () => close(val(ans[0]), w1 + z1 / 10) && close(val(ans[1]), w2 + z2 / 10 + s2 / 100) &&
      close(val(ans[2]), w3 + m3 / 1000) && close(val(ans[3]), s4 / 100),
  }
}

/** The whole part, the digit and the number of tenths, hundredths, thousandths, p. 10, ex. 3 and p. 11, ex. 10. */
export function decDigits(rng: Rng): Made {
  const W = int(rng, 100, 99999)
  let f = int(rng, 1, 999)
  if (f % 10 === 0) f += 3
  const n = W * 1000 + f
  const d1 = Math.floor(f / 100), d2 = Math.floor(f / 10) % 10
  const tenths = Math.floor(n / 100), hundredths = Math.floor(n / 10)
  const x = D(n, 3)
  return {
    text: `Pentru fracția zecimală $${x}$ scrieți: a) partea întreagă; b) cifra zecimilor și numărul zecimilor; c) cifra sutimilor și numărul sutimilor; d) numărul miimilor.`,
    solution: lines(
      `a) Partea întreagă este numărul din fața virgulei: $${nr(W)}$.`,
      `b) Cifra zecimilor este prima cifră după virgulă: ${d1}. Numărul zecimilor se citește până la cifra zecimilor, fără virgulă: $${nr(tenths)}$.`,
      `c) Cifra sutimilor este a doua cifră după virgulă: ${d2}. Numărul sutimilor: $${nr(hundredths)}$.`,
      `d) Numărul miimilor: $${nr(n)}$.`,
    ),
    verify: () => {
      const [w, p] = x.replace(/\\,/g, '').split('{,}')
      return Number(w) === W && Number(p[0]) === d1 && Number(p[1]) === d2 &&
        Number(w + p[0]) === tenths && Number(w + p.slice(0, 2)) === hundredths && Number(w + p) === n
    },
  }
}

/** Fractions with the denominator a power of 10, written as decimals, p. 12, ex. 15 and ex. 17 a. */
export function decPowerFraction(rng: Rng): Made {
  const ks = shuffle(rng, [1, 2, 3, 4])
  const items = ks.map((k) => {
    let N = int(rng, 1, 3 * P10(k + 1))
    if (N % 10 === 0) N += 1
    const den = k >= 2 && rng() < 0.5 ? `10^{${k}}` : nr(P10(k))
    return { N, k, den }
  })
  return {
    text: `Scrieți sub formă de fracție zecimală: ${items.map((t, i) => `${'abcd'[i]}) $\\frac{${nr(t.N)}}{${t.den}}$`).join('; ')}.`,
    solution: lines(
      'Numitorul are atâtea zerouri câte zecimale are fracția zecimală: punem virgula înaintea ultimelor cifre ale numărătorului (completând cu zerouri în față, la nevoie).',
      ...items.map((t, i) => show(`\\text{${'abcd'[i]}) } \\frac{${nr(t.N)}}{${t.den}} = ${D(t.N, t.k)}`)),
    ),
    verify: () => items.every((t) => close(val(D(t.N, t.k)), t.N / P10(t.k))),
  }
}

/** Decimals written as irreducible ordinary fractions, p. 12, ex. 16 a and ex. 21. */
export function decToFraction(rng: Rng): Made {
  for (;;) {
    const items = Array.from({ length: 3 }, () => {
      const k = int(rng, 1, 3)
      return { n: rnd(rng, 0.01, 20, k), k }
    })
    if (items.filter((t) => gcd(t.n, P10(t.k)) > 1).length < 2) continue
    if (new Set(items.map((t) => t.n / P10(t.k))).size < 3) continue
    return {
      text: `Scrieți fracțiile zecimale sub formă de fracții ordinare ireductibile: ${items.map((t, i) => `${'abc'[i]}) $${D(t.n, t.k)}$`).join('; ')}.`,
      solution: lines(
        'Scriem la numărător numărul fără virgulă, iar la numitor 1 urmat de atâtea zerouri câte zecimale are numărul; apoi simplificăm:',
        ...items.map((t, i) => {
          const f = frac(t.n, P10(t.k))
          const raw = `\\frac{${nr(t.n)}}{${nr(P10(t.k))}}`
          return show(`\\text{${'abc'[i]}) } ${D(t.n, t.k)} = ${raw}${gcd(t.n, P10(t.k)) > 1 ? ` = ${f}` : ''}`)
        }),
      ),
      verify: () => items.every((t) => {
        const [p, q] = reduce(t.n, P10(t.k))
        return gcd(p, q) === 1 && close(p / q, val(D(t.n, t.k)))
      }),
    }
  }
}

/** Lengths, volumes and masses in two units, written as a decimal in the larger one, p. 12, ex. 14. */
export function decUnits(rng: Rng): Made {
  const A = int(rng, 1, 20), B = int(rng, 1, 99)
  let C = int(rng, 1, 999)
  if (C % 10 === 0) C += 1
  const L = int(rng, 1, 9), E = int(rng, 1, 999)
  const F = int(rng, 1, 9), G = int(rng, 1, 999)
  const ans = [D(A * 100 + B, 2), D(C, 3), D(L * 1000 + E, 3), D(F * 1000 + G, 3)]
  return {
    text: `Scrieți sub formă de fracție zecimală: a) ${A} m și ${B} cm, în metri; b) ${C} mm, în metri; c) ${L} $\\ell$ și ${E} ml, în litri; d) ${F} kg și ${G} g, în kilograme.`,
    solution: lines(
      'Folosim $1 \\text{ cm} = 0{,}01 \\text{ m}$, $1 \\text{ mm} = 0{,}001 \\text{ m}$, $1 \\text{ ml} = 0{,}001 \\ \\ell$, $1 \\text{ g} = 0{,}001 \\text{ kg}$:',
      show(`\\text{a) } ${A} + \\frac{${B}}{100} = ${ans[0]} \\text{ m} \\qquad \\text{b) } \\frac{${C}}{1000} = ${ans[1]} \\text{ m}`),
      show(`\\text{c) } ${L} + \\frac{${E}}{1000} = ${ans[2]} \\ \\ell \\qquad \\text{d) } ${F} + \\frac{${G}}{1000} = ${ans[3]} \\text{ kg}`),
    ),
    verify: () => close(val(ans[0]), (A * 100 + B) / 100) && close(val(ans[1]) * 1000, C) &&
      close(val(ans[2]) * 1000, L * 1000 + E) && close(val(ans[3]) * 1000, F * 1000 + G),
  }
}

/** A decimal written as a sum with the powers of 10: its terms and their value (numerator over 10^k). */
function expansion(n: number, k: number): [string, number] {
  const s = String(n)
  const whole = s.slice(0, s.length - k), part = s.slice(s.length - k)
  const terms: string[] = []
  let value = 0
  whole.split('').forEach((c, i) => {
    const p = whole.length - 1 - i
    if (c === '0') return
    terms.push(p === 0 ? c : p === 1 ? `${c} \\cdot 10` : `${c} \\cdot 10^{${p}}`)
    value += Number(c) * P10(p + k)
  })
  part.split('').forEach((c, i) => {
    if (c === '0') return
    terms.push(i === 0 ? `\\frac{${c}}{10}` : `\\frac{${c}}{10^{${i + 1}}}`)
    value += Number(c) * P10(k - i - 1)
  })
  return [terms.join(' + '), value]
}

/** A decimal as a sum with the powers of 10, p. 10, ex. 5. */
export function decExpand(rng: Rng): Made {
  const nums = [
    { n: rnd(rng, 100, 9999, 3), k: 3 },
    { n: rnd(rng, 10, 999, 2), k: 2 },
  ]
  const ex = nums.map((t) => expansion(t.n, t.k))
  return {
    text: `Scrieți numerele ca sumă, folosind puterile lui 10, după modelul $54{,}12 = 5 \\cdot 10 + 4 + \\frac{1}{10} + \\frac{2}{10^2}$: a) $${D(nums[0].n, 3)}$; b) $${D(nums[1].n, 2)}$.`,
    solution: lines(
      'Fiecare cifră se înmulțește cu valoarea locului ei: unitățile cu 1, zecile cu 10, sutele cu $10^2$, …, zecimile cu $\\frac{1}{10}$, sutimile cu $\\frac{1}{10^2}$, … (cifrele 0 nu se mai scriu):',
      show(`\\text{a) } ${D(nums[0].n, 3)} = ${ex[0][0]}`),
      show(`\\text{b) } ${D(nums[1].n, 2)} = ${ex[1][0]}`),
    ),
    verify: () => nums.every((t, i) => ex[i][1] === t.n),
  }
}

/** The natural n in X = N/10ⁿ, in 12,10 = 121000/10ⁿ and in X = n/10^j, p. 13, ex. 22 and p. 20, Testul 2, I.2. */
export function decFindN(rng: Rng): Made {
  const kA = int(rng, 2, 4)
  const NA = rnd(rng, 1, 99, kA)
  const kB = int(rng, 2, 3)
  let mB = rnd(rng, 1, 99, kB - 1) * 10
  if (mB % 100 === 0) mB += 10
  const e = int(rng, 1, 3)
  const nB = kB + e
  const j = int(rng, 2, 4)
  const kC = int(rng, 1, j)
  const NC = rnd(rng, 1, 99, kC)
  const nC = NC * P10(j - kC)
  return {
    text: `Determinați numărul natural $n$ astfel încât: a) $${D(NA, kA)} = \\frac{${nr(NA)}}{10^n}$; b) $${D(mB, kB, true)} = \\frac{${nr(mB * P10(e))}}{10^n}$; c) $${D(NC, kC)} = \\frac{n}{10^{${j}}}$.`,
    solution: lines(
      `a) Numărul are ${kA} zecimale, deci $${D(NA, kA)} = \\frac{${nr(NA)}}{10^{${kA}}}$ și $n = ${kA}$.`,
      `b) Numărătorul are ${e === 1 ? 'un zero' : `${e} zerouri`} în plus față de $${nr(mB)}$, deci $${D(mB, kB, true)} = \\frac{${nr(mB)}}{10^{${kB}}} = \\frac{${nr(mB * P10(e))}}{10^{${nB}}}$ și $n = ${nB}$.`,
      `c) $n = ${D(NC, kC)} \\cdot 10^{${j}} = ${nr(nC)}$.`,
    ),
    verify: () => close(NA / P10(kA), val(D(NA, kA))) && close((mB * P10(e)) / P10(nB), val(D(mB, kB, true))) &&
      close(nC / P10(j), val(D(NC, kC))),
  }
}

/** Ordinary fractions amplified to a power of 10, written as decimals and ordered, p. 24, Test de autoevaluare, IV. */
export function decAmplify(rng: Rng): Made {
  for (;;) {
    const qs = shuffle(rng, [2, 4, 5, 8, 20, 25, 50, 125]).slice(0, 4)
    const fr = qs.map((q) => {
      let p = int(rng, 1, 3 * q)
      while (gcd(p, q) !== 1) p++
      return { p, q, k: tenPower(q) }
    })
    const values = fr.map((t) => t.p / t.q)
    if (new Set(values).size < 4) continue
    const sorted = [...fr].sort((a, b) => a.p / a.q - b.p / b.q)
    const dec = (t: { p: number; q: number; k: number }) => D((t.p * P10(t.k)) / t.q, t.k)
    return {
      text: lines(
        `Se consideră fracțiile ordinare ${fr.map((t) => `$\\frac{${t.p}}{${t.q}}$`).join(', ')}.`,
        'a) Amplificați fiecare fracție astfel încât numitorul să devină o putere a lui 10 și scrieți-o sub formă de fracție zecimală. b) Ordonați crescător fracțiile zecimale obținute.',
      ),
      solution: lines(
        'a) Amplificăm cu numărul care, înmulțit cu numitorul, dă 10, 100 sau 1000:',
        ...fr.map((t) => {
          const f = P10(t.k) / t.q
          return show(`\\frac{${t.p}}{${t.q}} = \\frac{${t.p} \\cdot ${f}}{${t.q} \\cdot ${f}} = \\frac{${nr(t.p * f)}}{${nr(P10(t.k))}} = ${dec(t)}`)
        }),
        'b) Comparăm întâi părțile întregi, apoi zecimile, sutimile, …:',
        show(sorted.map(dec).join(' < ')),
      ),
      verify: () => fr.every((t) => close(val(dec(t)), t.p / t.q)) &&
        sorted.every((t, i) => i === 0 || val(dec(sorted[i - 1])) < val(dec(t))),
    }
  }
}

/** The sequence 1,0; 2,01; 3,012; …: a term, the sum of the whole parts, the sum of the decimals, p. 13, ex. 23. */
export function decSequence(rng: Rng): Made {
  const t = int(rng, 6, 10)
  const N = int(rng, 20, 100)
  const t2 = int(rng, 6, 10)
  const term = (i: number) => `${i}{,}${range(0, i - 1).join('')}`
  const S = (N * (N + 1)) / 2
  const s2 = (t2 * (t2 - 1)) / 2
  const ordinal = (i: number) => (i === 1 ? 'primul' : `al ${i}-lea`)
  return {
    text: lines(
      'Se consideră șirul de fracții zecimale $1{,}0;\\ 2{,}01;\\ 3{,}012;\\ 4{,}0123;\\ 5{,}01234;\\ \\dots$',
      `a) Scrieți ${ordinal(t)} termen al șirului. b) Calculați suma părților întregi ale primilor ${N} termeni. c) Calculați suma zecimalelor termenului ${ordinal(t2)}.`,
    ),
    solution: lines(
      'Termenul de pe locul $n$ are partea întreagă $n$, iar după virgulă cifrele $0, 1, \\dots, n - 1$.',
      `a) Termenul ${ordinal(t)} este $${term(t)}$.`,
      `b) Părțile întregi sunt $1, 2, \\dots, ${N}$:`,
      show(`1 + 2 + \\dots + ${N} = \\frac{${N} \\cdot ${N + 1}}{2} = ${nr(S)}`),
      `c) Zecimalele termenului ${ordinal(t2)} sunt $0, 1, \\dots, ${t2 - 1}$, cu suma $\\frac{${t2 - 1} \\cdot ${t2}}{2} = ${s2}$.`,
    ),
    verify: () => term(t).split('{,}')[1].length === t && sum(range(1, N)) === S &&
      sum(term(t2).split('{,}')[1].split('').map(Number)) === s2,
  }
}

/** 0,a + 0,b + 0,c, or a,b + b,c + c,a, or a,bc + b,ca + c,ab given: a + b + c, p. 13, ex. 24. */
export function decOverlineSum(rng: Rng): Made {
  for (;;) {
    const v = int(rng, 0, 2)
    const S = int(rng, 3, 27)
    const coef = [1, 11, 111][v], den = [10, 10, 100][v]
    const [p, q] = reduce(coef * S, den)
    if (q === 1) continue
    const lhs = [
      '\\overline{0{,}a} + \\overline{0{,}b} + \\overline{0{,}c}',
      '\\overline{a{,}b} + \\overline{b{,}c} + \\overline{c{,}a}',
      '\\overline{a{,}bc} + \\overline{b{,}ca} + \\overline{c{,}ab}',
    ][v]
    const expand = [
      '\\frac{a + b + c}{10}',
      '(a + b + c) + \\frac{a + b + c}{10} = \\frac{11(a + b + c)}{10}',
      '(a + b + c) + \\frac{a + b + c}{10} + \\frac{a + b + c}{100} = \\frac{111(a + b + c)}{100}',
    ][v]
    return {
      text: `Calculați suma $a + b + c$, știind că $a$, $b$, $c$ sunt cifre și $${lhs} = \\frac{${p}}{${q}}$.`,
      solution: lines(
        'Grupăm întregii, zecimile și sutimile: fiecare cifră apare o dată pe fiecare loc.',
        show(`${lhs} = ${expand}`),
        show(`\\frac{${coef === 1 ? 'a + b + c' : `${coef}(a + b + c)`}}{${den}} = \\frac{${p}}{${q}} \\Rightarrow a + b + c = \\frac{${p} \\cdot ${den}}{${q}${coef === 1 ? '' : ` \\cdot ${coef}`}} = ${S}`),
      ),
      verify: () => close((coef * S) / den, p / q) && S <= 27,
    }
  }
}

/** The digits of 4a3,b1c = d·100 + 7·10 + e + 1/2 + f/100 + 8/1000, p. 22, Testul 3, V.2 c. */
export function decDigitsExpansion(rng: Rng): Made {
  const d = int(rng, 1, 9), a = int(rng, 0, 9), e = int(rng, 0, 9)
  const b = pick(rng, [2, 4, 5, 6, 8]), f = int(rng, 0, 9), c = int(rng, 1, 9)
  const left = `\\overline{${d}a${e}{,}b${f}c}`
  const right = `d \\cdot 100 + ${a} \\cdot 10 + e + ${frac(b, 10)} + \\frac{f}{100} + \\frac{${c}}{1000}`
  return {
    text: lines('Determinați cifrele $a$, $b$, $c$, $d$, $e$ și $f$, știind că:', show(`${left} = ${right}`)),
    solution: lines(
      `Scriem fracția $${frac(b, 10)}$ cu numitorul 10: $${frac(b, 10)} = \\frac{${b}}{10}$. Membrul drept are sute $d$, zeci ${a}, unități $e$, zecimi ${b}, sutimi $f$ și miimi ${c}. Comparăm cifră cu cifră cu numărul din stânga:`,
      show(`d = ${d}, \\quad a = ${a}, \\quad e = ${e}, \\quad b = ${b}, \\quad f = ${f}, \\quad c = ${c}`),
      `Numărul este $${D(d * 100000 + a * 10000 + e * 1000 + b * 100 + f * 10 + c, 3)}$.`,
    ),
    verify: () => {
      const s = D(d * 100000 + a * 10000 + e * 1000 + b * 100 + f * 10 + c, 3).replace(/\\,/g, '')
      return s === `${d}${a}${e}{,}${b}${f}${c}` && close(val(s), d * 100 + a * 10 + e + b / 10 + f / 100 + c / 1000)
    },
  }
}

/** x = a/q and y = p/b with a, b digits: the number ab, p. 19, Testul 1, III.3. */
export function decFracEquality(rng: Rng): Made {
  for (;;) {
    const q = pick(rng, [2, 4, 5, 8]), a = int(rng, 1, 9)
    const b = pick(rng, [2, 4, 5, 8]), p = int(rng, 3, 49)
    if (a % q === 0 || p % b === 0) continue
    const kx = tenPower(q), ky = tenPower(b)
    const x = D((a * P10(kx)) / q, kx), y = D((p * P10(ky)) / b, ky)
    return {
      text: `Dacă $${x} = \\frac{a}{${q}}$ și $${y} = \\frac{${p}}{b}$, unde $a$ și $b$ sunt cifre, calculați numărul $\\overline{ab}$.`,
      solution: lines(
        show(`a = ${x} \\cdot ${q} = ${a}, \\qquad b = ${p} : ${y} = ${b}`),
        `Deci $\\overline{ab} = ${10 * a + b}$.`,
      ),
      verify: () => close(val(x), a / q) && close(val(y), p / b) && Number(`${a}${b}`) === 10 * a + b,
    }
  }
}

// ================= 2. Comparing, ordering, approximating (pp. 15–24) =================

type Num = { n: number; k: number; keep?: boolean }
const tx = (x: Num) => D(x.n, x.k, x.keep)
const at = (x: Num, K: number) => x.n * P10(K - x.k)
/** The sign between two decimals and the reason, as the book says it. */
function compareWhy(x: Num, y: Num): [string, string] {
  const K = Math.max(x.k, y.k)
  const a = at(x, K), b = at(y, K)
  if (a === b) return ['=', 'zerourile de la sfârșitul părții zecimale nu schimbă fracția']
  const s = a < b ? '<' : '>'
  const wa = Math.floor(a / P10(K)), wb = Math.floor(b / P10(K))
  if (wa !== wb) return [s, `părțile întregi sunt diferite: $${nr(wa)} ${s} ${nr(wb)}$`]
  const da = String(a % P10(K)).padStart(K, '0'), db = String(b % P10(K)).padStart(K, '0')
  let i = 0
  while (da[i] === db[i]) i++
  return [s, `părțile întregi sunt egale, iar prima cifră diferită este a ${ORDG[i]}: $${da[i]} ${s} ${db[i]}$`]
}

/** Two decimals compared with <, =, >, p. 15, ex. 1 and p. 16, ex. 4 and ex. 9. */
export function decCompare(rng: Rng): Made {
  const makers: (() => [Num, Num])[] = [
    () => {
      const k = int(rng, 1, 2), e = int(rng, 1, 2)
      const n = rnd(rng, 1, 300, k)
      return [{ n, k }, { n: n * P10(e), k: k + e, keep: true }]
    },
    () => {
      const W = int(rng, 0, 300), t1 = int(rng, 1, 9)
      let t2 = int(rng, 1, 9)
      if (t2 === t1) t2 = t1 === 9 ? 1 : t1 + 1
      return [{ n: W * 1000 + t1 * 100 + rnd(rng, 0.01, 0.99, 2), k: 3 }, { n: W * 10 + t2, k: 1 }]
    },
    () => {
      const k = int(rng, 3, 4)
      const base = int(rng, 10 ** (k - 1), 30 * 10 ** (k - 1))
      const d1 = int(rng, 1, 9)
      let d2 = int(rng, 1, 9)
      if (d2 === d1) d2 = d1 === 9 ? 1 : d1 + 1
      return [{ n: base * 10 + d1, k }, { n: base * 10 + d2, k }]
    },
    () => {
      const W = int(rng, 1, 200)
      return [{ n: (W + 1) * 1000 + int(rng, 1, 9), k: 3 }, { n: W * 10000 + 9990 + int(rng, 1, 9), k: 4 }]
    },
    () => {
      const d = int(rng, 1, 9), e = int(rng, 1, 9)
      return [{ n: d, k: 3 }, rng() < 0.5 ? { n: d * 10 + e, k: 4 } : { n: d * 10 + e, k: 3 }]
    },
  ]
  const pairs = shuffle(rng, makers).slice(0, 4).map((m) => {
    const p = m()
    return rng() < 0.5 ? p : ([p[1], p[0]] as [Num, Num])
  })
  const why = pairs.map(([x, y]) => compareWhy(x, y))
  return {
    text: `Comparați fracțiile zecimale: ${pairs.map(([x, y], i) => `${'abcd'[i]}) $${tx(x)}$ și $${tx(y)}$`).join('; ')}.`,
    solution: lines(
      'Comparăm întâi părțile întregi; dacă sunt egale, comparăm pe rând cifrele zecimilor, sutimilor, miimilor, …',
      ...pairs.map(([x, y], i) => `${'abcd'[i]}) $${tx(x)} ${why[i][0]} ${tx(y)}$, deoarece ${why[i][1]}.`),
    ),
    verify: () => pairs.every(([x, y], i) => {
      const a = val(tx(x)), b = val(tx(y))
      return why[i][0] === (close(a, b) ? '=' : a < b ? '<' : '>')
    }),
  }
}

/** A number with four decimals rounded to units, tenths, hundredths, thousandths, p. 17, ex. 14 and ex. 16. */
export function decRound(rng: Rng): Made {
  const n = rnd(rng, 1, 999, 4)
  const x = D(n, 4, true)
  const res = [0, 1, 2, 3].map((j) => D(rounded(n, 4, j), j, true))
  const next = (j: number) => Math.floor(n / P10(3 - j)) % 10
  const names = ['la unități', 'la zecimi', 'la sutimi', 'la miimi']
  return {
    text: `Se consideră numărul $a = ${x}$. Rotunjiți numărul: a) la cel mai apropiat număr natural; b) la zecimi; c) la sutimi; d) la miimi.`,
    solution: lines(
      'Ne uităm la prima cifră care se taie: dacă este 5 sau mai mare, mărim cu 1 ultima cifră păstrată; altfel o lăsăm așa.',
      ...[0, 1, 2, 3].map((j) => `${'abcd'[j]}) ${names[j]}: cifra următoare este ${next(j)}${next(j) >= 5 ? ' ≥ 5' : ' < 5'}, deci $a \\approx ${res[j]}$.`),
    ),
    verify: () => [0, 1, 2, 3].every((j) => {
      const r = Math.round(val(res[j]) * P10(j)), diff = n - r * P10(4 - j)
      return diff < P10(4 - j) / 2 && -diff <= P10(4 - j) / 2
    }),
  }
}

/** By default and by excess, to the units, tenths and hundredths, p. 17, ex. 15 and ex. 17. */
export function decApproximate(rng: Rng): Made {
  const n = rnd(rng, 1, 999, 4)
  const x = D(n, 4)
  const lo = [0, 1, 2].map((j) => cut(n, 4, j)), hi = lo.map((v) => v + 1)
  return {
    text: `Se consideră numărul $a = ${x}$. a) Aproximați numărul prin lipsă la unități, la zecimi și la sutimi. b) Aproximați numărul prin adaos la unități, la zecimi și la sutimi.`,
    solution: lines(
      'Prin lipsă: tăiem cifrele de după ordinul cerut. Prin adaos: tăiem cifrele și mărim cu 1 ultima cifră păstrată.',
      show(`\\text{a) } ${D(lo[0], 0)}; \\quad ${D(lo[1], 1, true)}; \\quad ${D(lo[2], 2, true)}`),
      show(`\\text{b) } ${D(hi[0], 0)}; \\quad ${D(hi[1], 1, true)}; \\quad ${D(hi[2], 2, true)}`),
      show(`${D(lo[2], 2, true)} < ${x} < ${D(hi[2], 2, true)}`),
    ),
    verify: () => [0, 1, 2].every((j) => lo[j] * P10(4 - j) < n && n < hi[j] * P10(4 - j)),
  }
}

/** Six decimals with the same whole part, in increasing or decreasing order, p. 16, ex. 5 and ex. 7. */
export function decOrder(rng: Rng): Made {
  for (;;) {
    const W = int(rng, 0, 99), t = int(rng, 1, 9)
    const nums: Num[] = Array.from({ length: 6 }, (_, i) => {
      const k = int(rng, 1, 4)
      const tenth = i < 4 ? t : int(rng, 0, 9)
      if (k === 1) return { n: W * 10 + tenth, k }
      return { n: (W * 10 + tenth) * P10(k - 1) + rnd(rng, 0, 0.9, k - 1) * 1, k }
    })
    const v = nums.map((x) => at(x, 4))
    if (new Set(v).size < 6 || nums.some((x) => x.n % 10 === 0)) continue
    const inc = rng() < 0.5
    const sorted = [...nums].sort((a, b) => (inc ? at(a, 4) - at(b, 4) : at(b, 4) - at(a, 4)))
    return {
      text: `Ordonați ${inc ? 'crescător' : 'descrescător'} fracțiile zecimale: ${nums.map((x) => `$${tx(x)}$`).join('; ')}.`,
      solution: lines(
        `Toate au partea întreagă ${W}, deci comparăm cifrele zecimilor, apoi ale sutimilor, ale miimilor și ale zecimilor de miimi (putem completa cu zerouri, ca toate să aibă patru zecimale).`,
        show(sorted.map(tx).join(inc ? ' < ' : ' > ')),
      ),
      verify: () => sorted.every((x, i) => i === 0 || (inc ? val(tx(sorted[i - 1])) < val(tx(x)) : val(tx(sorted[i - 1])) > val(tx(x)))),
    }
  }
}

/** With four digits, once each: all the decimals with a given whole part, ordered, p. 17, ex. 12–13. */
export function decFromDigits(rng: Rng): Made {
  const digits = shuffle(rng, range(1, 9)).slice(0, 4)
  const w = digits[int(rng, 0, 3)]
  const rest = digits.filter((d) => d !== w)
  const perms: number[] = []
  for (const a of rest) for (const b of rest) for (const c of rest) if (a !== b && b !== c && a !== c) perms.push(w * 1000 + a * 100 + b * 10 + c)
  perms.sort((a, b) => a - b)
  return {
    text: `Folosind cifrele ${list(digits)}, fiecare o singură dată, scrieți toate fracțiile zecimale cu partea întreagă ${w} și cu trei zecimale. Ordonați crescător aceste numere.`,
    solution: lines(
      `După virgulă se așază, în toate ordinele posibile, cifrele ${list(rest)}: sunt $3 \\cdot 2 \\cdot 1 = 6$ numere. Le ordonăm după cifra zecimilor, apoi a sutimilor:`,
      show(perms.map((n) => D(n, 3)).join(' < ')),
    ),
    verify: () => perms.length === 6 && new Set(perms).size === 6 && perms.every((n, i) => i === 0 || perms[i - 1] < n) &&
      perms.every((n) => [...String(n)].sort().join('') === [...digits.map(String)].sort().join('')),
  }
}

/** x = P,Qad and y = P,Qaa: the smallest (largest) digit a; and the digits x with L < P,xq, p. 19, II.2, p. 23, I.3. */
export function decUnknownDigit(rng: Rng): Made {
  for (;;) {
    const P = int(rng, 1, 30), Q = int(rng, 0, 9)
    const small = rng() < 0.5
    const d = small ? int(rng, 1, 8) : int(rng, 1, 9)
    const okA = DIGITS.filter((a) => (small ? Q * 100 + a * 10 + d < Q * 100 + a * 11 : Q * 100 + a * 10 + d > Q * 100 + a * 11))
    const aAns = small ? Math.min(...okA) : Math.max(...okA)
    const P2 = int(rng, 1, 30), u = int(rng, 1, 8), v = int(rng, 0, 9), q = int(rng, 0, 9)
    const greater = rng() < 0.5
    const okX = DIGITS.filter((x) => (greater ? 10 * x + q > 10 * u + v : 10 * x + q < 10 * u + v))
    if (okX.length === 0 || okX.length === 10 || !okA.length) continue
    const L = D(P2 * 100 + u * 10 + v, 2, true)
    const ov = `\\overline{${P2}{,}x${q}}`
    return {
      text: lines(
        `a) Se consideră fracțiile zecimale $A = \\overline{${P}{,}${Q}a${d}}$ și $B = \\overline{${P}{,}${Q}aa}$, unde $a$ este o cifră. Aflați ${small ? 'cea mai mică' : 'cea mai mare'} valoare a cifrei $a$ pentru care $A ${small ? '<' : '>'} B$.`,
        `b) Aflați valorile cifrei $x$ pentru care $${greater ? `${L} < ${ov}` : `${ov} < ${L}`}$.`,
      ),
      solution: lines(
        `a) Numerele au aceeași parte întreagă și aceleași cifre ale zecimilor și sutimilor, deci comparăm cifrele miimilor: ${d} și $a$. $A ${small ? '<' : '>'} B$ dacă $${d} ${small ? '<' : '>'} a$, deci $a = ${aAns}$.`,
        `b) Părțile întregi sunt egale; comparăm zecimile ($x$ cu ${u}), iar când sunt egale, sutimile (${q} cu ${v}). ${okX.length === 1 ? `Obținem $x = ${okX[0]}$` : `Obținem $x \\in \\{${okX.join(', ')}\\}$`}.`,
      ),
      verify: () => {
        const A = (a: number) => (P * 1000 + Q * 100 + a * 10 + d), B = (a: number) => (P * 1000 + Q * 100 + a * 11)
        const goodA = DIGITS.filter((a) => (small ? A(a) < B(a) : A(a) > B(a)))
        const X = (x: number) => P2 * 100 + 10 * x + q, Lv = P2 * 100 + u * 10 + v
        const goodX = DIGITS.filter((x) => (greater ? Lv < X(x) : X(x) < Lv))
        return aAns === (small ? goodA[0] : goodA[goodA.length - 1]) && goodX.join() === okX.join()
      },
    }
  }
}

/** The digit x when P,Qx rounds to tenths to R, and P,QSx rounds to hundredths to R', p. 20, I.3 and p. 21, I.3. */
export function decRoundingDigit(rng: Rng): Made {
  const P = int(rng, 1, 40), Q = int(rng, 0, 8), S = int(rng, 0, 8)
  const up1 = rng() < 0.5, up2 = rng() < 0.5
  const R1 = P * 10 + Q + (up1 ? 1 : 0), R2 = P * 100 + Q * 10 + S + (up2 ? 1 : 0)
  const xs1 = DIGITS.filter((x) => rounded(P * 100 + Q * 10 + x, 2, 1) === R1)
  const xs2 = DIGITS.filter((x) => rounded(P * 1000 + Q * 100 + S * 10 + x, 3, 2) === R2)
  return {
    text: `Aflați valorile cifrei $x$ în fiecare caz: a) rotunjirea la zecimi a fracției $\\overline{${P}{,}${Q}x}$ este $${D(R1, 1, true)}$; b) rotunjirea la sutimi a fracției $\\overline{${P}{,}${Q}${S}x}$ este $${D(R2, 2, true)}$.`,
    solution: lines(
      `a) ${up1 ? 'Cifra zecimilor a crescut cu 1, deci cifra tăiată este cel puțin 5' : 'Cifra zecimilor a rămas aceeași, deci cifra tăiată este mai mică decât 5'}: $x \\in \\{${xs1.join(', ')}\\}$.`,
      `b) ${up2 ? 'Cifra sutimilor a crescut cu 1, deci cifra tăiată este cel puțin 5' : 'Cifra sutimilor a rămas aceeași, deci cifra tăiată este mai mică decât 5'}: $x \\in \\{${xs2.join(', ')}\\}$.`,
    ),
    verify: () => xs1.join() === (up1 ? '5,6,7,8,9' : '0,1,2,3,4') && xs2.join() === (up2 ? '5,6,7,8,9' : '0,1,2,3,4'),
  }
}

/** Decimals framed between consecutive naturals, tenths and hundredths, p. 17, ex. 21 and p. 21, IV. */
export function decBracket(rng: Rng): Made {
  const nums = Array.from({ length: 3 }, () => rnd(rng, 0.1, 200, 3))
  const rows = nums.map((n) => [0, 1, 2].map((j) => {
    const lo = cut(n, 3, j)
    return `${D(lo, j, true)} < ${D(n, 3)} < ${D(lo + 1, j, true)}`
  }))
  return {
    text: `Încadrați fracțiile zecimale ${nums.map((n) => `$${D(n, 3)}$`).join('; ')} între: a) două numere naturale consecutive; b) două fracții zecimale consecutive cu o zecimală; c) două fracții zecimale consecutive cu două zecimale.`,
    solution: lines(
      'Numărul din stânga este aproximarea prin lipsă, cel din dreapta aproximarea prin adaos, la unități, la zecimi, respectiv la sutimi.',
      ...['a', 'b', 'c'].map((l, j) => show(`\\text{${l}) } ${rows.map((r) => r[j]).join(', \\quad ')}`)),
    ),
    verify: () => nums.every((n) => [0, 1, 2].every((j) => cut(n, 3, j) * P10(3 - j) < n && n < (cut(n, 3, j) + 1) * P10(3 - j))),
  }
}

/** All a,bcd between P,QR and P,Q(R+1); the naturals n with A < n/100 < B; the naturals between X and Y,
 * p. 19, ex. 34, p. 19, Testul 1, III.2 and p. 21, Testul 2, III.3. */
export function decCountBetween(rng: Rng): Made {
  const base = rnd(rng, 1, 9.89, 2)
  const fixedBase = base % 10 === 9 ? base - 1 : base
  const A = rnd(rng, 5, 30, 1), B = A * 10 + int(rng, 100, 900) + 1
  const lo = A * 10, hi = B
  const count = range(1, 5000).filter((n) => lo < n && n < hi).length
  const X = rnd(rng, 0.1, 9, 1)
  let Y = X + int(rng, 15, 90)
  if (Y % 10 === 0) Y += 3
  const between = range(0, 20).filter((m) => X < m * 10 && m * 10 < Y)
  const list3 = range(1, 9).map((d) => D(fixedBase * 10 + d, 3))
  return {
    text: lines(
      `a) Știind că $a$, $b$, $c$, $d$ sunt cifre, determinați fracțiile zecimale $\\overline{a{,}bcd}$ pentru care $${D(fixedBase, 2)} < \\overline{a{,}bcd} < ${D(fixedBase + 1, 2)}$.`,
      `b) Câte numere naturale $n$ verifică $${D(A, 1)} < \\frac{n}{100} < ${D(B, 2)}$?`,
      `c) Câte numere naturale sunt cuprinse între $${D(X, 1)}$ și $${D(Y, 1)}$?`,
    ),
    solution: lines(
      `a) Numerele cu trei zecimale dintre $${D(fixedBase * 10, 3, true)}$ și $${D(fixedBase * 10 + 10, 3, true)}$: $${list3.join(';\\ ')}$.`,
      `b) Înmulțim cu 100: $${nr(lo)} < n < ${nr(hi)}$, deci $n \\in \\{${nr(lo + 1)}, \\dots, ${nr(hi - 1)}\\}$, adică $${nr(hi - 1)} - ${nr(lo)} = ${count}$ ${deW(count)}numere.`,
      `c) Numerele naturale de la ${between[0]} la ${between[between.length - 1]}: ${between.length === 1 ? 'un număr' : `${de(between.length)} numere`}.`,
    ),
    verify: () => count === hi - lo - 1 && between.length === Math.floor(Y / 10) - Math.floor(X / 10) &&
      list3.every((s) => fixedBase / 100 < val(s) && val(s) < (fixedBase + 1) / 100),
  }
}

/** The first five decimals x,ab with whole part W and a + b = s, increasing (or the last five), p. 20, Testul 1, V.1 b. */
export function decDigitSum(rng: Rng): Made {
  const W = int(rng, 1, 30), s = int(rng, 10, 14)
  const first = rng() < 0.5
  const all = range(s - 9, 9).map((a) => W * 100 + a * 10 + (s - a))
  const five = first ? all.slice(0, 5) : all.slice(-5).reverse()
  return {
    text: `Scrieți în ordine ${first ? 'crescătoare primele cinci' : 'descrescătoare ultimele cinci'} fracții zecimale de forma $\\overline{x{,}ab}$ care au partea întreagă ${W} și suma celor două zecimale egală cu ${s}.`,
    solution: lines(
      `Avem $x = ${W}$ și $a + b = ${s}$, cu $a$ și $b$ cifre, deci $a \\ge ${s - 9}$. Numerele cresc odată cu cifra zecimilor $a$:`,
      show(all.map((n) => D(n, 2)).join(' < ')),
      `Răspunsul: $${five.map((n) => D(n, 2)).join(';\\ ')}$.`,
    ),
    verify: () => five.length === 5 && five.every((n) => Math.floor(n / 100) === W && Math.floor(n / 10) % 10 + (n % 10) === s) &&
      five.every((n, i) => i === 0 || (first ? five[i - 1] < n : five[i - 1] > n)),
  }
}

/** How many x,y with x, y nonzero digits lie between A and B, p. 22, Testul 3, V.1 c. */
export function decCountXY(rng: Rng): Made {
  for (;;) {
    const A = rnd(rng, 1, 6, 2), B = A + int(rng, 60, 300)
    if (B % 10 === 0) continue
    const groups = range(1, 9).map((x) => ({ x, ys: range(1, 9).filter((y) => A < 10 * (10 * x + y) && 10 * (10 * x + y) < B) })).filter((g) => g.ys.length)
    const count = sum(groups.map((g) => g.ys.length))
    if (count < 5) continue
    return {
      text: `Câte fracții zecimale de forma $\\overline{x{,}y}$, cu $x$ și $y$ cifre nenule, verifică $${D(A, 2)} < \\overline{x{,}y} < ${D(B, 2)}$?`,
      solution: lines(
        'Le numărăm după partea întreagă $x$:',
        ...groups.map((g) => `$x = ${g.x}$: $y \\in \\{${g.ys.join(', ')}\\}$, adică ${g.ys.length === 1 ? 'o fracție' : `${g.ys.length} fracții`};`),
        `În total: $${groups.map((g) => g.ys.length).join(' + ')} = ${count}$ ${deW(count)}fracții.`,
      ),
      verify: () => {
        let c = 0
        for (let x = 1; x <= 9; x++) for (let y = 1; y <= 9; y++) if (A / 100 < x + y / 10 && x + y / 10 < B / 100) c++
        return c === count
      },
    }
  }
}

// ================= 3. Adding and subtracting (pp. 26–30) =================

/** A + B, C + D + E and N + F, p. 26, ex. 2–5. */
export function decAdd(rng: Rng): Made {
  const kA = int(rng, 1, 3), kB = 1 + ((kA + int(rng, 0, 1)) % 3)
  const A = rnd(rng, 1, 999, kA), B = rnd(rng, 1, 999, kB)
  const t = [1, 2, 3].map((k) => ({ n: rnd(rng, 0.1, 99, k), k }))
  const N = int(rng, 10, 999), kF = int(rng, 2, 3), F = rnd(rng, 0.1, 99, kF)
  const r1 = A * P10(3 - kA) + B * P10(3 - kB)
  const r2 = sum(t.map((u) => u.n * P10(3 - u.k)))
  const r3 = N * 1000 + F * P10(3 - kF)
  return {
    text: `Calculați: a) $${D(A, kA)} + ${D(B, kB)}$; b) $${t.map((u) => D(u.n, u.k)).join(' + ')}$; c) $${N} + ${D(F, kF)}$.`,
    solution: lines(
      'Așezăm numerele unul sub altul, cu virgula sub virgulă (completând cu zerouri la dreapta), și adunăm ca la numerele naturale; virgula rezultatului stă sub virgule.',
      show(`\\text{a) } ${D(A, kA)} + ${D(B, kB)} = ${D(r1, 3)}`),
      show(`\\text{b) } ${t.map((u) => D(u.n, u.k)).join(' + ')} = ${D(r2, 3)}`),
      show(`\\text{c) } ${N} + ${D(F, kF)} = ${D(r3, 3)}`),
    ),
    verify: () => close(val(D(r1, 3)), A / P10(kA) + B / P10(kB)) && close(val(D(r2, 3)), sum(t.map((u) => u.n / P10(u.k)))) &&
      close(val(D(r3, 3)), N + F / P10(kF)),
  }
}

/** A − B, N − C with N natural, and D − E where E has more decimals, p. 28, ex. 1–3. */
export function decSubtract(rng: Rng): Made {
  const A = rnd(rng, 50, 999, 2), B = rnd(rng, 1, 49, 1)
  const N = int(rng, 20, 500), C = rnd(rng, 1, N - 1, 2)
  const Dn = rnd(rng, 5, 99, 1), E = rnd(rng, 0.1, 4.9, 3)
  const r = [A - B * 10, N * 100 - C, Dn * 100 - E]
  return {
    text: `Efectuați: a) $${D(A, 2)} - ${D(B, 1)}$; b) $${N} - ${D(C, 2)}$; c) $${D(Dn, 1)} - ${D(E, 3)}$.`,
    solution: lines(
      'Completăm cu zerouri, ca numerele să aibă același număr de zecimale, apoi scădem cu virgula sub virgulă:',
      show(`\\text{a) } ${D(A, 2)} - ${D(B * 10, 2, true)} = ${D(r[0], 2)}`),
      show(`\\text{b) } ${D(N * 100, 2, true)} - ${D(C, 2)} = ${D(r[1], 2)}`),
      show(`\\text{c) } ${D(Dn * 100, 3, true)} - ${D(E, 3)} = ${D(r[2], 3)}`),
    ),
    verify: () => close(val(D(r[0], 2)), A / 100 - B / 10) && close(val(D(r[1], 2)), N - C / 100) && close(val(D(r[2], 3)), Dn / 10 - E / 1000),
  }
}

const FRUITS = ['portocale', 'mere', 'banane', 'lămâi', 'pere', 'struguri']
const VEG = ['cartofi', 'ceapă', 'morcovi', 'varză', 'roșii', 'ardei']

/** Fruit brought to a shop, vegetables to a canteen, water taken from a vessel, p. 26, ex. 10–11 and p. 29, ex. 11. */
export function decWordAddSub(rng: Rng): Made {
  const v = int(rng, 0, 2)
  if (v === 0) {
    const f = pick(rng, FRUITS), A = rnd(rng, 50, 300, 2), B = rnd(rng, 10, 99, 2)
    return {
      text: `La un magazin erau $${D(A, 2)}$ kg de ${f} și s-au mai adus $${D(B, 2)}$ kg de ${f}. Ce cantitate de ${f} este acum în magazin?`,
      solution: show(`${D(A, 2)} + ${D(B, 2)} = ${D(A + B, 2)} \\text{ kg}`),
      verify: () => close(val(D(A + B, 2)), A / 100 + B / 100),
    }
  }
  if (v === 1) {
    const [a, b, c] = shuffle(rng, VEG).slice(0, 3)
    const A = rnd(rng, 50, 200, 2), B = rnd(rng, 2, 20, 2), C = int(rng, 10, 60)
    return {
      text: `La o cantină s-au adus $${D(A, 2)}$ kg de ${a}, $${D(B, 2)}$ kg de ${b} și ${C} kg de ${c}. Ce cantitate de legume s-a adus la cantină?`,
      solution: show(`${D(A, 2)} + ${D(B, 2)} + ${C} = ${D(A + B + C * 100, 2)} \\text{ kg}`),
      verify: () => close(val(D(A + B + C * 100, 2)), A / 100 + B / 100 + C),
    }
  }
  const A = rnd(rng, 5, 20, 2), B = rnd(rng, 1, 4.9, 2)
  return {
    text: `Într-un vas sunt $${D(A, 2)} \\ \\ell$ de apă. Se scot din vas $${D(B, 2)} \\ \\ell$ de apă. Ce cantitate de apă a rămas în vas?`,
    solution: show(`${D(A, 2)} - ${D(B, 2)} = ${D(A - B, 2)} \\ \\ell`),
    verify: () => close(val(D(A - B, 2)), A / 100 - B / 100),
  }
}

/** a + (b − c) − d and a − (b − c) + (d − e), p. 29, ex. 7–8. */
export function decBrackets(rng: Rng): Made {
  for (;;) {
    const v = rng() < 0.5
    const a = rnd(rng, 100, 999, 2), b = rnd(rng, 20, 500, 3), c = rnd(rng, 1, 19, 2) * 10
    const d = rnd(rng, 10, 99, 1) * 100, e = rnd(rng, 0.1, 9, 3)
    if (b <= c) continue
    const r1 = b - c
    if (v) {
      const r2 = a * 10 + r1, r3 = r2 - d
      if (r3 <= 0) continue
      return {
        text: `Calculați: $${D(a, 2)} + (${D(b, 3)} - ${D(c, 3)}) - ${D(d, 3)}$.`,
        solution: lines(
          'Calculăm întâi paranteza, apoi de la stânga la dreapta:',
          show(`${D(b, 3)} - ${D(c, 3)} = ${D(r1, 3)}`),
          show(`${D(a, 2)} + ${D(r1, 3)} = ${D(r2, 3)}`),
          show(`${D(r2, 3)} - ${D(d, 3)} = ${D(r3, 3)}`),
        ),
        verify: () => close(val(D(r3, 3)), a / 100 + (b / 1000 - c / 1000) - d / 1000),
      }
    }
    const r2 = d - e, r3 = a * 10 - r1
    if (r3 <= 0 || r2 <= 0) continue
    const r4 = r3 + r2
    return {
      text: `Calculați: $${D(a, 2)} - (${D(b, 3)} - ${D(c, 3)}) + (${D(d, 3)} - ${D(e, 3)})$.`,
      solution: lines(
        'Calculăm parantezele, apoi de la stânga la dreapta:',
        show(`${D(b, 3)} - ${D(c, 3)} = ${D(r1, 3)}, \\qquad ${D(d, 3)} - ${D(e, 3)} = ${D(r2, 3)}`),
        show(`${D(a, 2)} - ${D(r1, 3)} + ${D(r2, 3)} = ${D(r3, 3)} + ${D(r2, 3)} = ${D(r4, 3)}`),
      ),
      verify: () => close(val(D(r4, 3)), a / 100 - (b / 1000 - c / 1000) + (d / 1000 - e / 1000)),
    }
  }
}

/** A sum, then its approximations by default and by excess to hundredths and its rounding, p. 26, ex. 7–9. */
export function decApproxSum(rng: Rng): Made {
  for (;;) {
    const t = [rnd(rng, 1, 99, 3), rnd(rng, 1, 99, 2), rnd(rng, 0.1, 50, 1)]
    const S = t[0] + t[1] * 10 + t[2] * 100
    if (S % 10 === 0) continue
    const lo = cut(S, 3, 2), r = rounded(S, 3, 2)
    return {
      text: `Calculați suma $${D(t[0], 3)} + ${D(t[1], 2)} + ${D(t[2], 1)}$, apoi scrieți aproximările prin lipsă și prin adaos la sutimi ale rezultatului și rotunjirea lui la sutimi.`,
      solution: lines(
        show(`${D(t[0], 3)} + ${D(t[1], 2)} + ${D(t[2], 1)} = ${D(S, 3)}`),
        show(`${D(lo, 2, true)} < ${D(S, 3)} < ${D(lo + 1, 2, true)}`),
        `Prin lipsă: $${D(lo, 2, true)}$; prin adaos: $${D(lo + 1, 2, true)}$. Cifra miimilor este ${S % 10}, deci rotunjirea la sutimi este $${D(r, 2, true)}$.`,
      ),
      verify: () => close(val(D(S, 3)), t[0] / 1000 + t[1] / 100 + t[2] / 10) && lo * 10 < S && S < (lo + 1) * 10 && Math.abs(r * 10 - S) <= 5,
    }
  }
}

/** The decimal K more (less) than A, B and N/10^k, p. 26, ex. 13 and p. 29, ex. 14. */
export function decMoreLess(rng: Rng): Made {
  const more = rng() < 0.5
  const K = rnd(rng, 10, 60, 2)
  const lo = more ? 0.1 : 61
  const A = rnd(rng, lo, lo + 300, 2), B = rnd(rng, lo, lo + 2000, 3)
  const k = int(rng, 2, 3), N = rnd(rng, lo * P10(k), (lo + 900) * P10(k), 0)
  const den = rng() < 0.5 ? `10^{${k}}` : nr(P10(k))
  const s = more ? 1 : -1
  const r = [A * 10 + s * K * 10, B + s * K * 10, N * P10(3 - k) + s * K * 10]
  const op = more ? '+' : '-'
  return {
    text: `Determinați fracția zecimală cu $${D(K, 2)}$ mai ${more ? 'mare' : 'mică'} decât: a) $${D(A, 2)}$; b) $${D(B, 3)}$; c) $\\frac{${nr(N)}}{${den}}$.`,
    solution: lines(
      `${more ? 'Adunăm' : 'Scădem'} $${D(K, 2)}$:`,
      show(`\\text{a) } ${D(A, 2)} ${op} ${D(K, 2)} = ${D(r[0], 3)} \\qquad \\text{b) } ${D(B, 3)} ${op} ${D(K, 2)} = ${D(r[1], 3)}`),
      show(`\\text{c) } \\frac{${nr(N)}}{${den}} = ${D(N, k)}, \\qquad ${D(N, k)} ${op} ${D(K, 2)} = ${D(r[2], 3)}`),
    ),
    verify: () => r.every((x) => x > 0) && close(val(D(r[0], 3)), A / 100 + s * K / 100) && close(val(D(r[1], 3)), B / 1000 + s * K / 100) &&
      close(val(D(r[2], 3)), N / P10(k) + s * K / 100),
  }
}

/** A car in three hours, a walker in three days, p. 29, ex. 12–13. */
export function decJourney(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const T = rnd(rng, 150, 300, 2), d1 = rnd(rng, 50, 90, 2), x = rnd(rng, 1, 9.9, 1) * 10
      const d2 = d1 - x, d3 = T - d1 - d2
      if (d3 < 2000) continue
      return {
        text: `Un automobil are de parcurs, în trei ore, distanța de $${D(T, 2)}$ km. În prima oră a parcurs $${D(d1, 2)}$ km, iar în a doua oră cu $${D(x, 2)}$ km mai puțin. Ce distanță a parcurs în a treia oră?`,
        solution: lines(
          'În a doua oră:', show(`${D(d1, 2)} - ${D(x, 2)} = ${D(d2, 2)} \\text{ km}`),
          'În a treia oră:', show(`${D(T, 2)} - (${D(d1, 2)} + ${D(d2, 2)}) = ${D(T, 2)} - ${D(d1 + d2, 2)} = ${D(d3, 2)} \\text{ km}`),
        ),
        verify: () => close(val(D(d3, 2)) + val(D(d2, 2)) + d1 / 100, T / 100),
      }
    }
    const d1 = rnd(rng, 3, 9, 2), x = rnd(rng, 0.5, 2.5, 2), y = rnd(rng, 1, 5, 2)
    const d2 = d1 - x, d3 = d1 + d2 - y
    if (d2 < 100 || d3 < 100) continue
    const T = d1 + d2 + d3
    return {
      text: `Un pieton parcurge în prima zi $${D(d1, 2)}$ km. A doua zi parcurge cu $${D(x, 2)}$ km mai puțin, iar a treia zi cu $${D(y, 2)}$ km mai puțin decât în primele două zile la un loc. Ce distanță a parcurs pietonul în cele trei zile?`,
      solution: lines(
        'A doua zi:', show(`${D(d1, 2)} - ${D(x, 2)} = ${D(d2, 2)} \\text{ km}`),
        'A treia zi:', show(`${D(d1, 2)} + ${D(d2, 2)} - ${D(y, 2)} = ${D(d3, 2)} \\text{ km}`),
        'În total:', show(`${D(d1, 2)} + ${D(d2, 2)} + ${D(d3, 2)} = ${D(T, 2)} \\text{ km}`),
      ),
      verify: () => close(val(D(T, 2)), d1 / 100 + (d1 - x) / 100 + (2 * d1 - x - y) / 100),
    }
  }
}

/** x,y + y,x = S; x,x + xx,x = S; x,0y + 0,xy = S; x,y + 1x,y = S: the digits, p. 26, ex. 12. */
export function decOverlineEquation(rng: Rng): Made {
  const v = int(rng, 0, 3)
  if (v === 0) {
    const s = int(rng, 3, 17)
    const pairs = range(1, 9).filter((x) => s - x >= 1 && s - x <= 9).map((x) => [x, s - x])
    return {
      text: `Determinați cifrele nenule $x$ și $y$ pentru care $\\overline{x{,}y} + \\overline{y{,}x} = ${D(11 * s, 1)}$.`,
      solution: lines(
        show(`\\overline{x{,}y} + \\overline{y{,}x} = (x + y) + \\frac{x + y}{10} = \\frac{11(x + y)}{10} = ${D(11 * s, 1)} \\Rightarrow x + y = ${s}`),
        `Perechile $(x, y)$: ${pairs.map(([x, y]) => `$(${x}, ${y})$`).join(', ')}.`,
      ),
      verify: () => {
        const good = range(1, 9).flatMap((x) => range(1, 9).map((y) => [x, y])).filter(([x, y]) => close(x + y / 10 + y + x / 10, (11 * s) / 10))
        return good.length === pairs.length
      },
    }
  }
  const x = int(rng, 1, 9), y = int(rng, 1, 9)
  const F: { lhs: string; k: number; f: (a: number, b: number) => number; steps: string; eq: string }[] = [
    { lhs: '\\overline{x{,}x} + \\overline{xx{,}x}', k: 1, f: (a) => 122 * a, steps: 'x + \\frac{x}{10} + 11x + \\frac{x}{10} = \\frac{122x}{10}', eq: '122x' },
    { lhs: '\\overline{x{,}0y} + \\overline{0{,}xy}', k: 2, f: (a, b) => 110 * a + 2 * b, steps: 'x + \\frac{y}{100} + \\frac{10x + y}{100} = \\frac{110x + 2y}{100}', eq: '110x + 2y' },
    { lhs: '\\overline{x{,}y} + \\overline{1x{,}y}', k: 1, f: (a, b) => 100 + 20 * a + 2 * b, steps: 'x + \\frac{y}{10} + 10 + x + \\frac{y}{10} = \\frac{100 + 20x + 2y}{10}', eq: '100 + 20x + 2y' },
  ]
  const g = F[v - 1]
  const V = g.f(x, y)
  const two = v !== 1
  const tail = v === 1
    ? `Deci $x = ${V} : 122 = ${x}$.`
    : v === 2
      ? `Cum $2y \\le 18 < 110$, $x$ este câtul împărțirii lui ${V} la 110: $x = ${x}$; apoi $2y = ${V} - ${110 * x} = ${2 * y}$, deci $y = ${y}$.`
      : `Rezultă $20x + 2y = ${V - 100}$. Cum $2y \\le 18 < 20$, $x$ este câtul împărțirii lui ${V - 100} la 20: $x = ${x}$; apoi $2y = ${2 * y}$, deci $y = ${y}$.`
  return {
    text: `Determinați ${two ? 'cifrele nenule $x$ și $y$' : 'cifra nenulă $x$'} pentru care $${g.lhs} = ${D(V, g.k)}$.`,
    solution: lines(
      show(`${g.lhs} = ${g.steps}`),
      show(`${g.eq} = ${V}`),
      tail,
    ),
    verify: () => {
      const sols = range(1, 9).flatMap((a) => (two ? range(1, 9) : [y]).map((b) => [a, b])).filter(([a, b]) => g.f(a, b) === V)
      return sols.length === 1 && sols[0][0] === x && (!two || sols[0][1] === y) && close(val(D(V, g.k)), [0, x + x / 10 + 11 * x + x / 10, x + y / 100 + (10 * x + y) / 100, x + y / 10 + 10 + x + y / 10][v])
    },
  }
}

/** The difference of two decimals is d; the minuend and the subtrahend change: the new difference, p. 29, ex. 16. */
export function decChangeDifference(rng: Rng): Made {
  for (;;) {
    const d = rnd(rng, 10, 99, 1) * 10, p = rnd(rng, 50, 300, 2), q = rnd(rng, 50, 300, 2)
    const v = int(rng, 0, 2)
    const r = [d + p - q, d + p + q, d - p - q][v]
    if (r <= 0) continue
    const what = [
      [`Mărind descăzutul cu $${D(p, 2)}$ și scăzătorul cu $${D(q, 2)}$`, `(a + ${D(p, 2)}) - (b + ${D(q, 2)}) = (a - b) + ${D(p, 2)} - ${D(q, 2)}`],
      [`Mărind descăzutul cu $${D(p, 2)}$ și micșorând scăzătorul cu $${D(q, 2)}$`, `(a + ${D(p, 2)}) - (b - ${D(q, 2)}) = (a - b) + ${D(p, 2)} + ${D(q, 2)}`],
      [`Micșorând descăzutul cu $${D(p, 2)}$ și mărind scăzătorul cu $${D(q, 2)}$`, `(a - ${D(p, 2)}) - (b + ${D(q, 2)}) = (a - b) - ${D(p, 2)} - ${D(q, 2)}`],
    ][v]
    return {
      text: `Diferența a două fracții zecimale este $${D(d, 2)}$. ${what[0]}, obținem alte două fracții zecimale. Calculați diferența acestora.`,
      solution: lines(
        `Fie $a - b = ${D(d, 2)}$. Atunci:`,
        show(`${what[1]} = ${D(r, 2)}`),
      ),
      verify: () => close(val(D(r, 2)), [d + p - q, d + p + q, d - p - q][v] / 100),
    }
  }
}

/** 0,m + … + 0,n (hundredths), and 0,9 + 0,99 + … + 0,99…9, p. 27, ex. 14 c–d. */
export function decSeriesSum(rng: Rng): Made {
  if (rng() < 0.5) {
    const m = int(rng, 1, 40), n = int(rng, m + 6, Math.min(99, m + 50))
    const T = ((m + n) * (n - m + 1)) / 2
    return {
      text: `Calculați: $${D(m, 2, true)} + ${D(m + 1, 2, true)} + ${D(m + 2, 2, true)} + \\dots + ${D(n, 2, true)}$.`,
      solution: lines(
        `Termenii sunt ${m}, ${m + 1}, …, ${n} sutimi. Adunăm numerele de sutimi (suma Gauss):`,
        show(`${m} + ${m + 1} + \\dots + ${n} = \\frac{(${m} + ${n}) \\cdot ${n - m + 1}}{2} = ${nr(T)}`),
        `Deci suma este ${prose(T)} ${deW(T)}sutimi, adică $${D(T, 2)}$.`,
      ),
      verify: () => close(val(D(T, 2)), sum(range(m, n)) / 100),
    }
  }
  const N = int(rng, 4, 12)
  const result = `${N - 1}{,}${'8'.repeat(N - 1)}9`
  const exact = N * P10(N) - (P10(N) - 1) / 9
  return {
    text: `Calculați: $0{,}9 + 0{,}99 + 0{,}999 + \\dots + 0{,}\\underbrace{99\\ldots9}_{${N}}$ (ultimul termen are ${N} zecimale, toate egale cu 9).`,
    solution: lines(
      `Fiecare termen este 1 minus o zecime, o sutime, o miime, …: $0{,}9 = 1 - 0{,}1$, $0{,}99 = 1 - 0{,}01$, … Sunt ${N} termeni:`,
      show(`S = ${N} - (0{,}1 + 0{,}01 + \\dots + 0{,}\\underbrace{0\\ldots0}_{${N - 1}}1) = ${N} - 0{,}\\underbrace{11\\ldots1}_{${N}} = ${result}`),
    ),
    verify: () => {
      let s = 0
      for (let i = 1; i <= N; i++) s += (P10(i) - 1) * P10(N - i)
      return s === exact && Number(result.replace('{,}', '')) === exact
    },
  }
}

/** 2x + 4y + 6z and 2x + y known (or 5x + 4y + 3z and 2x + y): x + y + z, p. 27, ex. 17 and p. 30, ex. 19. */
export function decLinearCombo(rng: Rng): Made {
  const [x, y, z] = [rnd(rng, 0.1, 9.9, 1), rnd(rng, 0.1, 9.9, 1), rnd(rng, 0.1, 9.9, 1)]
  const v = rng() < 0.5
  const A = v ? 2 * x + 4 * y + 6 * z : 5 * x + 4 * y + 3 * z, B = 2 * x + y
  const S = x + y + z
  return {
    text: `Știind că $${v ? '2x + 4y + 6z' : '5x + 4y + 3z'} = ${D(A, 1)}$ și $2x + y = ${D(B, 1)}$, calculați suma $x + y + z$.`,
    solution: v
      ? lines(
        'Adunăm prima egalitate cu dublul celei de-a doua:',
        show(`(2x + 4y + 6z) + 2(2x + y) = 6x + 6y + 6z = ${D(A, 1)} + ${D(2 * B, 1)} = ${D(A + 2 * B, 1)}`),
        show(`x + y + z = ${D(A + 2 * B, 1)} : 6 = ${D(S, 1)}`),
      )
      : lines(
        'Scădem a doua egalitate din prima:',
        show(`(5x + 4y + 3z) - (2x + y) = 3x + 3y + 3z = ${D(A, 1)} - ${D(B, 1)} = ${D(A - B, 1)}`),
        show(`x + y + z = ${D(A - B, 1)} : 3 = ${D(S, 1)}`),
      ),
    verify: () => (v ? A + 2 * B === 6 * S : A - B === 3 * S),
  }
}

// ================= 4. Multiplying (pp. 31–32) =================

/** X·10, X·100, Y·1000, Z·0,1, Z·0,01, p. 31, ex. 1–2. */
export function decTimesPower10(rng: Rng): Made {
  const kx = int(rng, 2, 3), X = rnd(rng, 0.1, 99, kx)
  const ky = int(rng, 1, 3), Y = rnd(rng, 0.1, 9, ky)
  const kz = int(rng, 0, 2), Z = rnd(rng, 1, 999, kz)
  const r = [D(X * 10, kx), D(X * 100, kx), D(Y * 1000, ky), D(Z, kz + 1), D(Z, kz + 2)]
  return {
    text: `Calculați: a) $${D(X, kx)} \\cdot 10$; b) $${D(X, kx)} \\cdot 100$; c) $${D(Y, ky)} \\cdot 1000$; d) $${D(Z, kz)} \\cdot 0{,}1$; e) $${D(Z, kz)} \\cdot 0{,}01$.`,
    solution: lines(
      'La înmulțirea cu 10, 100, 1000 mutăm virgula spre dreapta peste 1, 2, 3 cifre; la înmulțirea cu 0,1 sau 0,01 o mutăm spre stânga peste 1, respectiv 2 cifre (completând cu zerouri, la nevoie).',
      show(`\\text{a) } ${r[0]} \\qquad \\text{b) } ${r[1]} \\qquad \\text{c) } ${r[2]} \\qquad \\text{d) } ${r[3]} \\qquad \\text{e) } ${r[4]}`),
    ),
    verify: () => close(val(r[0]), (X / P10(kx)) * 10) && close(val(r[1]), (X / P10(kx)) * 100) && close(val(r[2]), (Y / P10(ky)) * 1000) &&
      close(val(r[3]), Z / P10(kz) / 10) && close(val(r[4]), Z / P10(kz) / 100),
  }
}

/** A·B, C·n and D·0,0e, p. 32, ex. 4 and ex. 8. */
export function decMultiply(rng: Rng): Made {
  const ka = int(rng, 1, 2), kb = int(rng, 1, 2)
  const A = rnd(rng, 0.1, 30, ka), B = rnd(rng, 0.1, 20, kb)
  const C = rnd(rng, 0.1, 99, 2), n = int(rng, 2, 99)
  const Dd = rnd(rng, 1, 99, 1), ke = int(rng, 2, 3), E = int(rng, 1, 9)
  const r = [[A * B, ka + kb], [C * n, 2], [Dd * E, 1 + ke]] as const
  return {
    text: `Efectuați: a) $${D(A, ka)} \\cdot ${D(B, kb)}$; b) $${D(C, 2)} \\cdot ${n}$; c) $${D(Dd, 1)} \\cdot ${D(E, ke)}$.`,
    solution: lines(
      'Înmulțim numerele ca pe numere naturale (fără virgulă), apoi despărțim la produs atâtea zecimale câte au factorii împreună:',
      show(`\\text{a) } ${nr(A)} \\cdot ${nr(B)} = ${nr(A * B)} \\Rightarrow ${D(A, ka)} \\cdot ${D(B, kb)} = ${D(...r[0])} \\quad (${ka + kb} \\text{ zecimale})`),
      show(`\\text{b) } ${D(C, 2)} \\cdot ${n} = ${D(...r[1])} \\qquad \\text{c) } ${D(Dd, 1)} \\cdot ${D(E, ke)} = ${D(...r[2])}`),
    ),
    verify: () => close(val(D(...r[0])), (A / P10(ka)) * (B / P10(kb))) && close(val(D(...r[1])), (C / 100) * n) &&
      close(val(D(...r[2])), (Dd / 10) * (E / P10(ke))),
  }
}

/** The number F times larger than three numbers, F a decimal, p. 32, ex. 7 and ex. 9. */
export function decTimesLarger(rng: Rng): Made {
  const F = rnd(rng, 1.1, 30, 1)
  const items = [{ n: int(rng, 2, 999), k: 0 }, { n: rnd(rng, 0.1, 99, 2), k: 2 }, { n: rnd(rng, 0.1, 999, 1), k: 1 }]
  const res = items.map((t) => D(t.n * F, t.k + 1))
  return {
    text: `Calculați numărul de $${D(F, 1)}$ ori mai mare decât: a) ${items[0].n}; b) $${D(items[1].n, 2)}$; c) $${D(items[2].n, 1)}$.`,
    solution: lines(
      `Un număr de $${D(F, 1)}$ ori mai mare se obține înmulțind cu $${D(F, 1)}$:`,
      ...items.map((t, i) => show(`\\text{${'abc'[i]}) } ${D(t.n, t.k)} \\cdot ${D(F, 1)} = ${res[i]}`)),
    ),
    verify: () => items.every((t, i) => close(val(res[i]), (t.n / P10(t.k)) * (F / 10))),
  }
}

/** A product of three factors rounded to tenths; a product approximated by default to tenths, p. 32, ex. 5 and ex. 12. */
export function decRoundProduct(rng: Rng): Made {
  const A = rnd(rng, 0.1, 20, 1), B = rnd(rng, 0.1, 20, 2), n = int(rng, 2, 15)
  const C = rnd(rng, 0.1, 20, 2), E = rnd(rng, 0.1, 20, 3)
  const p1 = A * B * n, p2 = C * E
  const r1 = rounded(p1, 3, 1), r2 = cut(p2, 5, 1)
  return {
    text: `a) Rotunjiți la zecimi produsul $${D(A, 1)} \\cdot ${D(B, 2)} \\cdot ${n}$. b) Efectuați înmulțirea $${D(C, 2)} \\cdot ${D(E, 3)}$ și aproximați rezultatul prin lipsă la zecimi.`,
    solution: lines(
      show(`\\text{a) } ${D(A, 1)} \\cdot ${D(B, 2)} \\cdot ${n} = ${D(A * B, 3)} \\cdot ${n} = ${D(p1, 3)} \\approx ${D(r1, 1, true)}`),
      `(cifra sutimilor este ${Math.floor(p1 / 10) % 10}, deci ${Math.floor(p1 / 10) % 10 >= 5 ? 'mărim cifra zecimilor cu 1' : 'cifra zecimilor rămâne'}).`,
      show(`\\text{b) } ${D(C, 2)} \\cdot ${D(E, 3)} = ${D(p2, 5)}`),
      `Aproximarea prin lipsă la zecimi este $${D(r2, 1, true)}$.`,
    ),
    verify: () => Math.abs(r1 * 100 - p1) <= 50 && r2 * 10000 <= p2 && p2 < (r2 + 1) * 10000 &&
      close(val(D(p1, 3)), (A / 10) * (B / 100) * n),
  }
}

/** 4·A·25, 5·B·2, 0,2·C·0,5·10, 0,25·D·0,4·100, 1,25·E·8, the simplest way, p. 32, ex. 11. */
export function decAssociate(rng: Rng): Made {
  const all = [
    { a: '4', b: '25', group: '4 \\cdot 25 = 100', m: 100, kExtra: 0 },
    { a: '5', b: '2', group: '5 \\cdot 2 = 10', m: 10, kExtra: 0 },
    { a: '0{,}2', b: '0{,}5 \\cdot 10', group: '0{,}2 \\cdot 0{,}5 \\cdot 10 = 1', m: 1, kExtra: 0 },
    { a: '0{,}25', b: '0{,}4 \\cdot 100', group: '0{,}25 \\cdot 0{,}4 \\cdot 100 = 10', m: 10, kExtra: 0 },
    { a: '1{,}25', b: '8', group: '1{,}25 \\cdot 8 = 10', m: 10, kExtra: 0 },
  ]
  const items = shuffle(rng, all).slice(0, 3).map((t) => ({ ...t, k: int(rng, 2, 3), n: 0 }))
  items.forEach((t) => { t.n = rnd(rng, 0.1, 99, t.k) })
  return {
    text: `Folosind asociativitatea și comutativitatea înmulțirii, calculați cât mai simplu: ${items.map((t, i) => `${'abc'[i]}) $${t.a} \\cdot ${D(t.n, t.k)} \\cdot ${t.b}$`).join('; ')}.`,
    solution: lines(
      'Grupăm factorii al căror produs este 1, 10 sau 100:',
      ...items.map((t, i) => show(`\\text{${'abc'[i]}) } ${t.group}, \\qquad ${D(t.n, t.k)} \\cdot ${t.m} = ${D(t.n * t.m, t.k)}`)),
    ),
    verify: () => items.every((t) => {
      const f = { '4': 4, '5': 5, '0{,}2': 0.2, '0{,}25': 0.25, '1{,}25': 1.25 }[t.a]!
      const g = { '25': 25, '2': 2, '0{,}5 \\cdot 10': 5, '0{,}4 \\cdot 100': 40, '8': 8 }[t.b]!
      return close(f * g * (t.n / P10(t.k)), val(D(t.n * t.m, t.k)))
    }),
  }
}

/** x + y and y + z known: αx + (α+β)y + βz, p. 32, ex. 13 and p. 38, Testul 3, III.3. */
export function decCombineSums(rng: Rng): Made {
  const P = rnd(rng, 0.1, 9.9, 1), Q = rnd(rng, 0.1, 9.9, 1)
  const pairs = shuffle(rng, [[3, 1], [3, 3], [5, 2], [2, 5], [4, 1], [1, 4], [2, 3], [3, 2]]).slice(0, 2)
  const expr = ([a, b]: number[]) => `${cv(a, 'x')} + ${cv(a + b, 'y')} + ${cv(b, 'z')}`
  return {
    text: `Dacă $x + y = ${D(P, 1)}$ și $y + z = ${D(Q, 1)}$, calculați: a) $${expr(pairs[0])}$; b) $${expr(pairs[1])}$.`,
    solution: lines(
      'Despărțim termenul cu $y$ în două, ca să apară sumele cunoscute:',
      ...pairs.map(([a, b], i) => show(`\\text{${'ab'[i]}) } ${expr([a, b])} = ${a === 1 ? '' : a}(x + y) + ${b === 1 ? '' : b}(y + z) = ${a === 1 ? '' : `${a} \\cdot `}${D(P, 1)} + ${b === 1 ? '' : `${b} \\cdot `}${D(Q, 1)} = ${D(a * P + b * Q, 1)}`)),
    ),
    verify: () => pairs.every(([a, b]) => {
      const x = 0.3, y = P / 10 - x, z = Q / 10 - y
      return close(a * x + (a + b) * y + b * z, val(D(a * P + b * Q, 1)))
    }),
  }
}

/** Bread, apples and pears, cloth: a decimal times a number, p. 36, III.2 and p. 37, III.3. */
export function decWordMultiply(rng: Rng): Made {
  const v = int(rng, 0, 2)
  if (v === 0) {
    const A = rnd(rng, 0.25, 0.95, 2), n = int(rng, 10, 40)
    return {
      text: `O pâine cântărește $${D(A, 2)}$ kg. Cât cântăresc ${de(n)} pâini de același fel?`,
      solution: show(`${D(A, 2)} \\cdot ${n} = ${D(A * n, 2)} \\text{ kg}`),
      verify: () => close(val(D(A * n, 2)), (A / 100) * n),
    }
  }
  if (v === 1) {
    const a = rnd(rng, 0.15, 0.35, 2), b = rnd(rng, 0.15, 0.35, 2), m = int(rng, 5, 15), n = int(rng, 3, 12)
    return {
      text: `Un măr cântărește $${D(a, 2)}$ kg, iar o pară $${D(b, 2)}$ kg. Cât cântăresc ${m} mere și ${n} pere de același fel?`,
      solution: show(`${D(a, 2)} \\cdot ${m} + ${D(b, 2)} \\cdot ${n} = ${D(a * m, 2)} + ${D(b * n, 2)} = ${D(a * m + b * n, 2)} \\text{ kg}`),
      verify: () => close(val(D(a * m + b * n, 2)), (a / 100) * m + (b / 100) * n),
    }
  }
  const p = rnd(rng, 15, 60, 1), q = rnd(rng, 1.1, 9.9, 1)
  return {
    text: `Un metru de stofă costă $${D(p, 1)}$ lei. Cât costă $${D(q, 1)}$ m de stofă?`,
    solution: show(`${D(p, 1)} \\cdot ${D(q, 1)} = ${D(p * q, 2)} \\text{ lei}`),
    verify: () => close(val(D(p * q, 2)), (p / 10) * (q / 10)),
  }
}

/** x + y = P, y + z = Q: (x + 3y + 2z)(z − x), p. 32, ex. 14. */
export function decFactorExpression(rng: Rng): Made {
  const P = rnd(rng, 0.5, 10, 1), Q = P + rnd(rng, 0.5, 10, 1)
  const a = P + 2 * Q, b = Q - P
  return {
    text: `Dacă $x + y = ${D(P, 1)}$ și $y + z = ${D(Q, 1)}$, calculați $(x + 3y + 2z) \\cdot (z - x)$.`,
    solution: lines(
      show(`x + 3y + 2z = (x + y) + 2(y + z) = ${D(P, 1)} + 2 \\cdot ${D(Q, 1)} = ${D(a, 1)}`),
      show(`z - x = (y + z) - (x + y) = ${D(Q, 1)} - ${D(P, 1)} = ${D(b, 1)}`),
      show(`(x + 3y + 2z) \\cdot (z - x) = ${D(a, 1)} \\cdot ${D(b, 1)} = ${D(a * b, 2)}`),
    ),
    verify: () => {
      const x = 0.2, y = P / 10 - x, z = Q / 10 - y
      return close((x + 3 * y + 2 * z) * (z - x), val(D(a * b, 2)))
    },
  }
}

/** x(y − z) = A and x(z + t) = B: x·k·(y + t), p. 32, ex. 15. */
export function decDistributive(rng: Rng): Made {
  const A = rnd(rng, 0.1, 9.9, 1), B = rnd(rng, 0.1, 9.9, 1), k = rnd(rng, 1.1, 9.9, 1)
  return {
    text: `Dacă $x \\cdot (y - z) = ${D(A, 1)}$ și $x \\cdot (z + t) = ${D(B, 1)}$, calculați $x \\cdot ${D(k, 1)} \\cdot (y + t)$.`,
    solution: lines(
      'Adunăm egalitățile și dăm factor comun pe $x$:',
      show(`x(y - z) + x(z + t) = x(y - z + z + t) = x(y + t) = ${D(A, 1)} + ${D(B, 1)} = ${D(A + B, 1)}`),
      show(`x \\cdot ${D(k, 1)} \\cdot (y + t) = ${D(k, 1)} \\cdot ${D(A + B, 1)} = ${D(k * (A + B), 2)}`),
    ),
    verify: () => {
      const x = 2, z = 0.5, y = A / 10 / x + z, t = B / 10 / x - z
      return close(x * (k / 10) * (y + t), val(D(k * (A + B), 2)))
    },
  }
}

/** One kilogram more costs Q instead of P: the price of N kg; a·b = P, (a + 1)·b = Q: Q·b, p. 32, ex. 16–17. */
export function decOneMore(rng: Rng): Made {
  if (rng() < 0.5) {
    const c = rnd(rng, 2, 9.9, 2), m = int(rng, 2, 7), N = pick(rng, [10, 100])
    const P = c * m, Q = P + c
    return {
      text: `Pentru o cantitate de legume s-au plătit $${D(P, 2)}$ lei. Dacă s-ar fi cumpărat cu un kilogram mai mult, s-ar fi plătit $${D(Q, 2)}$ lei. Cât se plătește pentru ${N} kg de legume?`,
      solution: lines(
        'Diferența de preț este prețul unui kilogram:',
        show(`${D(Q, 2)} - ${D(P, 2)} = ${D(c, 2)} \\text{ lei}`),
        show(`${D(c, 2)} \\cdot ${N} = ${D(c * N, 2)} \\text{ lei}`),
      ),
      verify: () => close(val(D(Q - P, 2)) * N, val(D(c * N, 2))),
    }
  }
  const a = rnd(rng, 1.1, 9.9, 1), b = rnd(rng, 1.1, 9.9, 1)
  const P = a * b, Q = (a + 10) * b
  return {
    text: `Produsul a două numere $a$ și $b$ este $${D(P, 2)}$. Mărind numărul $a$ cu 1, produsul devine $${D(Q, 2)}$. Calculați produsul $${D(Q, 2)} \\cdot b$.`,
    solution: lines(
      show(`(a + 1) \\cdot b - a \\cdot b = b = ${D(Q, 2)} - ${D(P, 2)} = ${D(b, 1)}`),
      show(`${D(Q, 2)} \\cdot ${D(b, 1)} = ${D(Q * b, 3)}`),
    ),
    verify: () => close(val(D(Q - P, 2)), b / 10) && close(val(D(Q * b, 3)), (Q / 100) * (b / 10)),
  }
}

/** (a,a + b,b)·b = R: the digits, p. 32, ex. 18 (Gazeta Matematică, supliment 3/2012). */
export function decOverlineProduct(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 9), b = int(rng, 1, 9)
    const R = 11 * (a + b) * b
    const sols = range(0, 9).flatMap((x) => range(1, 9).map((y) => [x, y])).filter(([x, y]) => 11 * (x + y) * y === R)
    if (sols.length !== 1) continue
    return {
      text: `Determinați cifrele $a$ și $b$ care verifică relația $(\\overline{a{,}a} + \\overline{b{,}b}) \\cdot b = ${D(R, 1)}$.`,
      solution: lines(
        show(`\\overline{a{,}a} + \\overline{b{,}b} = ${D(11, 1)}a + ${D(11, 1)}b = ${D(11, 1)}(a + b)`),
        show(`${D(11, 1)}(a + b) \\cdot b = ${D(R, 1)} \\Rightarrow (a + b) \\cdot b = ${D(R, 1)} : ${D(11, 1)} = ${(a + b) * b}`),
        `Căutăm cifra $b$ care îl divide pe ${(a + b) * b} și pentru care $a = ${(a + b) * b} : b - b$ este o cifră: singura posibilitate este $b = ${b}$, $a = ${a}$.`,
      ),
      verify: () => sols[0][0] === a && sols[0][1] === b && close((a + a / 10 + b + b / 10) * b, R / 10),
    }
  }
}

// ================= 5. Powers (pp. 34–35) =================

const BASES: [number, number][] = [[2, 1], [3, 1], [5, 1], [7, 1], [12, 1], [25, 1], [15, 1], [9, 1], [11, 1], [4, 1]]
const bt = ([n, k]: [number, number]) => `(${D(n, k)})`

/** (0,a)², (b,c)², (0,d)³, (e,f)³, p. 34, ex. 1 and p. 39, I.4. */
export function decSquaresCubes(rng: Rng): Made {
  const items: [number, number, number][] = [
    [int(rng, 1, 9), 1, 2], [rnd(rng, 1.1, 9.9, 1), 1, 2], [int(rng, 1, 9), 1, 3], [rnd(rng, 1.1, 2.9, 1), 1, 3],
  ]
  const res = items.map(([n, k, p]) => D(n ** p, k * p))
  return {
    text: `Calculați: ${items.map(([n, k, p], i) => `${'abcd'[i]}) $(${D(n, k)})^${p}$`).join('; ')}.`,
    solution: lines(
      'Ridicăm la putere numărul fără virgulă; rezultatul are de 2 (respectiv 3) ori mai multe zecimale decât baza:',
      ...items.map(([n, k, p], i) => show(`\\text{${'abcd'[i]}) } (${D(n, k)})^${p} = ${Array(p).fill(D(n, k)).join(' \\cdot ')} = ${res[i]}`)),
    ),
    verify: () => items.every(([n, k, p], i) => close(val(res[i]), (n / P10(k)) ** p)),
  }
}

/** Products of powers with the same base, as one power, p. 34, ex. 2 and ex. 5. */
export function decSameBase(rng: Rng): Made {
  const [b1, b2, b3] = shuffle(rng, BASES).slice(0, 3)
  const m = int(rng, 2, 9), n = int(rng, 2, 9), m2 = int(rng, 2, 12), e = [int(rng, 2, 7), int(rng, 2, 7), int(rng, 2, 7)]
  const r = [m + n, m2 + 1, sum(e)]
  return {
    text: `Efectuați, scriind rezultatul sub formă de putere: a) $${bt(b1)}^{${m}} \\cdot ${bt(b1)}^{${n}}$; b) $${bt(b2)}^{${m2}} \\cdot ${bt(b2)}^0 \\cdot ${D(...b2)}$; c) $${bt(b3)}^{${e[0]}} \\cdot ${bt(b3)}^{${e[1]}} \\cdot ${bt(b3)}^{${e[2]}}$.`,
    solution: lines(
      'La înmulțirea puterilor cu aceeași bază păstrăm baza și adunăm exponenții ($x^m \\cdot x^n = x^{m + n}$, $x^0 = 1$, $x = x^1$):',
      show(`\\text{a) } ${bt(b1)}^{${m} + ${n}} = ${bt(b1)}^{${r[0]}} \\qquad \\text{b) } ${bt(b2)}^{${m2} + 0 + 1} = ${bt(b2)}^{${r[1]}}`),
      show(`\\text{c) } ${bt(b3)}^{${e.join(' + ')}} = ${bt(b3)}^{${r[2]}}`),
    ),
    verify: () => close(Math.log((b1[0] / 10) ** m * (b1[0] / 10) ** n), r[0] * Math.log(b1[0] / 10)) && r[1] === m2 + 0 + 1 && r[2] === e[0] + e[1] + e[2],
  }
}

/** [(a)·(b)]ⁿ computed, and cⁿ·dⁿ = (cd)ⁿ, p. 34, ex. 4 and ex. 9. */
export function decPowerOfProduct(rng: Rng): Made {
  const a = int(rng, 1, 9), b = int(rng, 1, 9), n = int(rng, 2, 3)
  const [c, d, cd] = pick(rng, [['0{,}5', '0{,}2', [1, 1]], ['0{,}4', '0{,}5', [2, 1]], ['2{,}5', '0{,}4', [1, 0]], ['1{,}25', '0{,}8', [1, 0]], ['0{,}25', '0{,}4', [1, 1]], ['0{,}5', '0{,}6', [3, 1]]] as [string, string, [number, number]][])
  const m = int(rng, 3, 6)
  const r1 = D((a * b) ** n, 2 * n), r2 = D(cd[0] ** m, cd[1] * m)
  return {
    text: `Calculați: a) $[(0{,}${a}) \\cdot (0{,}${b})]^{${n}}$; b) $(${c})^{${m}} \\cdot (${d})^{${m}}$.`,
    solution: lines(
      'Folosim $(x \\cdot y)^m = x^m \\cdot y^m$, în ambele sensuri:',
      show(`\\text{a) } [(0{,}${a}) \\cdot (0{,}${b})]^{${n}} = (${D(a * b, 2)})^{${n}} = ${r1}`),
      show(`\\text{b) } (${c})^{${m}} \\cdot (${d})^{${m}} = (${c} \\cdot ${d})^{${m}} = (${D(...cd)})^{${m}} = ${r2}`),
    ),
    verify: () => close(val(r1), ((a / 10) * (b / 10)) ** n) && close(val(r2), (val(c) * val(d)) ** m),
  }
}

/** [(a)^m]^n, {[(b)^m]^n}^p and {[(c)^m]^n}^0, p. 34, ex. 3 and ex. 7. */
export function decPowerOfPower(rng: Rng): Made {
  const [b1, b2, b3] = shuffle(rng, BASES).slice(0, 3)
  const [m1, n1, m2, n2, p2, m3, n3] = [int(rng, 2, 9), int(rng, 2, 12), int(rng, 2, 5), int(rng, 2, 5), int(rng, 2, 6), int(rng, 2, 9), int(rng, 2, 9)]
  return {
    text: `Efectuați, scriind rezultatul sub formă de putere: a) $[${bt(b1)}^{${m1}}]^{${n1}}$; b) $\\{[${bt(b2)}^{${m2}}]^{${n2}}\\}^{${p2}}$; c) $\\{[${bt(b3)}^{${m3}}]^{${n3}}\\}^0$.`,
    solution: lines(
      'La ridicarea unei puteri la altă putere înmulțim exponenții ($(x^m)^n = x^{m \\cdot n}$), iar orice număr nenul la puterea 0 este 1:',
      show(`\\text{a) } ${bt(b1)}^{${m1} \\cdot ${n1}} = ${bt(b1)}^{${m1 * n1}} \\qquad \\text{b) } ${bt(b2)}^{${m2} \\cdot ${n2} \\cdot ${p2}} = ${bt(b2)}^{${m2 * n2 * p2}}`),
      show(`\\text{c) } ${bt(b3)}^{${m3 * n3} \\cdot 0} = ${bt(b3)}^0 = 1`),
    ),
    verify: () => m1 * n1 === n1 * m1 && m2 * n2 * p2 === p2 * n2 * m2 && (b3[0] / 10) ** 0 === 1,
  }
}

/** (a + b)² against a² + b², or (a − b)(a + b) against a² − b², p. 35, ex. 11–13. */
export function decSquareCompare(rng: Rng): Made {
  for (;;) {
    const a = rnd(rng, 1.1, 5.9, 1), b = rnd(rng, 1.1, 5.9, 1)
    if (a <= b) continue
    const sum2 = (a + b) ** 2, sq = a * a + b * b
    if (rng() < 0.5) {
      return {
        text: `Calculați și comparați numerele $A = (${D(a, 1)} + ${D(b, 1)})^2$ și $B = ${D(a, 1)}^2 + ${D(b, 1)}^2$. Este adevărată egalitatea $(x + y)^2 = x^2 + y^2$?`,
        solution: lines(
          show(`A = ${D(a + b, 1)}^2 = ${D(sum2, 2)}, \\qquad B = ${D(a * a, 2)} + ${D(b * b, 2)} = ${D(sq, 2)}`),
          `Deci $A > B$; egalitatea $(x + y)^2 = x^2 + y^2$ este falsă. Diferența este $2 \\cdot ${D(a, 1)} \\cdot ${D(b, 1)} = ${D(2 * a * b, 2)}$: corect este $(x + y)^2 = x^2 + 2xy + y^2$.`,
        ),
        verify: () => sum2 - sq === 2 * a * b && sum2 > sq,
      }
    }
    const pr = (a - b) * (a + b)
    return {
      text: `Calculați și comparați numerele $A = (${D(a, 1)} - ${D(b, 1)}) \\cdot (${D(a, 1)} + ${D(b, 1)})$ și $B = ${D(a, 1)}^2 - ${D(b, 1)}^2$.`,
      solution: lines(
        show(`A = ${D(a - b, 1)} \\cdot ${D(a + b, 1)} = ${D(pr, 2)}, \\qquad B = ${D(a * a, 2)} - ${D(b * b, 2)} = ${D(a * a - b * b, 2)}`),
        'Deci $A = B$.',
      ),
      verify: () => pr === a * a - b * b,
    }
  }
}

/** s², then the perimeter of the square with area s², p. 35, ex. 14. */
export function decSquareArea(rng: Rng): Made {
  const s = rnd(rng, 1.1, 19.9, 1)
  return {
    text: `a) Calculați $${D(s, 1)}^2$. b) Un pătrat are aria egală cu $${D(s * s, 2)} \\text{ cm}^2$. Calculați perimetrul pătratului.`,
    solution: lines(
      show(`\\text{a) } ${D(s, 1)}^2 = ${D(s, 1)} \\cdot ${D(s, 1)} = ${D(s * s, 2)}`),
      `b) Aria pătratului este $l^2 = ${D(s * s, 2)}$, deci, după a), latura este $l = ${D(s, 1)}$ cm.`,
      show(`P = 4 \\cdot l = 4 \\cdot ${D(s, 1)} = ${D(4 * s, 1)} \\text{ cm}`),
    ),
    verify: () => close(Math.sqrt(val(D(s * s, 2))) * 4, val(D(4 * s, 1))),
  }
}

/** [(b)^m]^n = b^(x − c) and b^x·b^c = [(b)^m]^n: the natural x, p. 36, Testul 1, V.1 c. */
export function decExponentEquation(rng: Rng): Made {
  const [b1, b2] = shuffle(rng, [['3{,}14', 0], ['1{,}5', 0], ['0{,}7', 0], ['2{,}3', 0], ['1{,}06', 0], ['0{,}45', 0]]).slice(0, 2).map((t) => t[0] as string)
  const m = int(rng, 2, 6), n = int(rng, 2, 6), c = int(rng, 1, 9)
  const m2 = int(rng, 2, 6), n2 = int(rng, 2, 6), c2 = int(rng, 1, m2 * n2 - 1)
  const x1 = m * n + c, x2 = m2 * n2 - c2
  return {
    text: `Aflați numărul natural $x$ în fiecare caz: a) $[(${b1})^{${m}}]^{${n}} = ${b1}^{x - ${c}}$; b) $${b2}^{x} \\cdot ${b2}^{${c2}} = [(${b2})^{${m2}}]^{${n2}}$.`,
    solution: lines(
      'Scriem ambii membri ca puteri ale aceleiași baze și egalăm exponenții:',
      show(`\\text{a) } ${b1}^{${m * n}} = ${b1}^{x - ${c}} \\Rightarrow x - ${c} = ${m * n} \\Rightarrow x = ${x1}`),
      show(`\\text{b) } ${b2}^{x + ${c2}} = ${b2}^{${m2 * n2}} \\Rightarrow x + ${c2} = ${m2 * n2} \\Rightarrow x = ${x2}`),
    ),
    verify: () => x1 - c === m * n && x2 + c2 === m2 * n2 && x2 >= 1,
  }
}

/** b·b²·…·bⁿ, b²·b⁴·…·b²ⁿ, b·b³·…·b^(2n−1) as one power, p. 35, ex. 10. */
export function decProductExponents(rng: Rng): Made {
  const b = pick(rng, ['1{,}4', '2{,}5', '2{,}25', '0{,}3', '1{,}7', '0{,}6'])
  const n = int(rng, 10, 60)
  const v = int(rng, 0, 2)
  const [first, last, total, why] = [
    [`${b} \\cdot ${b}^2 \\cdot ${b}^3`, `${b}^{${n}}`, (n * (n + 1)) / 2, `1 + 2 + \\dots + ${n} = \\frac{${n} \\cdot ${n + 1}}{2}`],
    [`${b}^2 \\cdot ${b}^4 \\cdot ${b}^6`, `${b}^{${2 * n}}`, n * (n + 1), `2 + 4 + \\dots + ${2 * n} = 2(1 + 2 + \\dots + ${n}) = ${n} \\cdot ${n + 1}`],
    [`${b} \\cdot ${b}^3 \\cdot ${b}^5`, `${b}^{${2 * n - 1}}`, n * n, `1 + 3 + \\dots + ${2 * n - 1} = ${n}^2`],
  ][v] as [string, string, number, string]
  const check = [sum(range(1, n)), sum(range(1, n).map((i) => 2 * i)), sum(range(1, n).map((i) => 2 * i - 1))][v]
  return {
    text: `Scrieți sub forma unei singure puteri: $${first} \\cdot \\ldots \\cdot ${last}$.`,
    solution: lines(
      `Adunăm exponenții (sunt ${n} termeni):`,
      show(`${why} = ${nr(total)}`),
      show(`${first} \\cdot \\ldots \\cdot ${last} = ${b}^{${total}}`),
    ),
    verify: () => check === total,
  }
}

/** bⁿ + bⁿ⁺¹ + c·bⁿ = V·T: the natural n, p. 35, ex. 16. */
export function decExponentFactor(rng: Rng): Made {
  const b = pick(rng, [2, 5, 1, 3, 4])
  const c = rnd(rng, 0.1, 2.9, 1)
  const T = 10 + b + c
  const m = int(rng, 2, 4)
  const V = D(b ** m, m)
  const bs = `0{,}${b}`
  return {
    text: `Aflați $n \\in \\mathbb{N}$, știind că $(${bs})^n + (${bs})^{n + 1} + ${D(c, 1)} \\cdot (${bs})^n = ${V} \\cdot ${D(T, 1)}$.`,
    solution: lines(
      `Dăm factor comun pe $(${bs})^n$, folosind $(${bs})^{n + 1} = (${bs})^n \\cdot ${bs}$:`,
      show(`(${bs})^n \\cdot (1 + ${bs} + ${D(c, 1)}) = (${bs})^n \\cdot ${D(T, 1)} = ${V} \\cdot ${D(T, 1)}`),
      show(`(${bs})^n = ${V} = (${bs})^{${m}} \\Rightarrow n = ${m}`),
    ),
    verify: () => close((b / 10) ** m + (b / 10) ** (m + 1) + (c / 10) * (b / 10) ** m, val(V) * (T / 10)) &&
      range(0, 8).filter((k) => close((b / 10) ** k * (T / 10), val(V) * (T / 10))).join() === String(m),
  }
}

/** How many decimals a product of powers of 0,1 (0,2; 0,5) has, p. 35, ex. 15. */
export function decDecimalsOfProduct(rng: Rng): Made {
  const n = int(rng, 8, 60)
  if (rng() < 0.4) {
    const e = n * n
    return {
      text: `Se notează $a = (0{,}1)^1 \\cdot (0{,}1)^3 \\cdot (0{,}1)^5 \\cdot \\ldots \\cdot (0{,}1)^{${2 * n - 1}}$. a) Câte zecimale are fracția $a$? b) Câte zerouri are $a$ după virgulă?`,
      solution: lines(
        `Exponenții sunt primele ${de(n)} numere impare: $1 + 3 + \\dots + ${2 * n - 1} = ${n}^2 = ${nr(e)}$, deci $a = (0{,}1)^{${e}}$.`,
        `a) $a$ are ${de(e)} zecimale: $a = 0{,}00\\ldots01$, cu cifra 1 pe locul ${e}. b) După virgulă sunt $${e} - 1 = ${nr(e - 1)}$ ${deW(e - 1)}zerouri.`,
      ),
      verify: () => sum(range(1, n).map((i) => 2 * i - 1)) === e,
    }
  }
  const b = pick(rng, [2, 5])
  const e = (n * (n + 1)) / 2
  const last = b === 5 ? 5 : [6, 2, 4, 8][e % 4]
  return {
    text: `Se notează $a = (0{,}${b})^1 \\cdot (0{,}${b})^2 \\cdot (0{,}${b})^3 \\cdot \\ldots \\cdot (0{,}${b})^{${n}}$. a) Câte zecimale are fracția $a$? b) Care este ultima cifră a fracției $a$?`,
    solution: lines(
      show(`a = (0{,}${b})^{1 + 2 + \\dots + ${n}} = (0{,}${b})^{${nr(e)}} = \\frac{${b}^{${e}}}{10^{${e}}}`),
      `a) Puterile lui ${b} nu se termină cu 0, deci $a$ are ${de(e)} zecimale. b) Ultima cifră a lui $${b}^{${e}}$ este ${last}${b === 2 ? ` (ultimele cifre ale puterilor lui 2 se repetă din 4 în 4: 2, 4, 8, 6, iar $${e} = 4 \\cdot ${Math.floor(e / 4)} + ${e % 4}$)` : ''}.`,
    ),
    verify: () => {
      let d = 1
      for (let i = 0; i < e; i++) d = (d * b) % 10
      return d === last && d !== 0 && e === sum(range(1, n))
    },
  }
}

// ================= 6. Periodic decimals (pp. 45–46) =================

/** p/q by long division: the whole part, the digits before the period and the period. */
function expandFrac(p: number, q: number): { whole: number; pre: string; period: string } {
  const whole = Math.floor(p / q)
  let r = p % q
  const seen = new Map<number, number>()
  let digits = ''
  while (r !== 0 && !seen.has(r)) {
    seen.set(r, digits.length)
    r *= 10
    digits += Math.floor(r / q)
    r %= q
  }
  if (r === 0) return { whole, pre: digits, period: '' }
  const i = seen.get(r)!
  return { whole, pre: digits.slice(0, i), period: digits.slice(i) }
}
const perTex = (e: { whole: number; pre: string; period: string }) => `${nr(e.whole)}{,}${e.pre}${e.period ? `(${e.period})` : ''}`
/** The k-th decimal of p/q, by dividing again. */
const decimalAt = (p: number, q: number, k: number) => {
  let r = p % q
  let d = 0
  for (let i = 0; i < k; i++) {
    r *= 10
    d = Math.floor(r / q)
    r %= q
  }
  return d
}
const kindOf = (p: number, q: number) => {
  const [, d] = reduce(p, q)
  if (d === 1) return 'întreg'
  if (isFinite10(d)) return 'finită'
  return d % 2 === 0 || d % 5 === 0 ? 'periodică mixtă' : 'periodică simplă'
}
const approxVal = (e: { whole: number; pre: string; period: string }) => Number(`${e.whole}.${e.pre}${e.period.repeat(8)}`)

/** a : b with a finite decimal quotient, p. 45, ex. 1–2. */
export function perDivision(rng: Rng): Made {
  const items = shuffle(rng, [2, 4, 5, 8, 20, 25, 40, 50, 16]).slice(0, 3).map((b) => {
    let a = int(rng, 5, 9999)
    if (a % b === 0) a += 1
    return [a, b] as [number, number]
  })
  const res = items.map(([a, b]) => perTex(expandFrac(a, b)))
  return {
    text: `Efectuați împărțirile: ${items.map(([a, b], i) => `${'abc'[i]}) $${nr(a)} : ${b}$`).join('; ')}.`,
    solution: lines(
      'Când restul nu mai este 0, punem virgula la cât și continuăm împărțirea, coborând câte un zero:',
      ...items.map(([a, b], i) => show(`\\text{${'abc'[i]}) } ${nr(a)} : ${b} = ${res[i]}`)),
    ),
    verify: () => items.every(([a, b], i) => close(val(res[i]), a / b)),
  }
}

/** Ordinary fractions whose denominator has no 2 and no 5: simple periodic decimals, p. 45, ex. 3. */
export function perSimple(rng: Rng): Made {
  const items = shuffle(rng, [3, 9, 11, 27, 33, 37, 99, 7, 13]).slice(0, 3).map((q) => {
    let p = int(rng, 1, 6 * q)
    while (gcd(p, q) !== 1) p++
    return [p, q] as [number, number]
  })
  const ex = items.map(([p, q]) => expandFrac(p, q))
  return {
    text: `Transformați fracțiile ordinare în fracții zecimale periodice simple: ${items.map(([p, q], i) => `${'abc'[i]}) $\\frac{${p}}{${q}}$`).join('; ')}.`,
    solution: lines(
      'Împărțim numărătorul la numitor până când restul se repetă; cifrele care se repetă formează perioada, scrisă între paranteze.',
      ...items.map(([p, q], i) => show(`\\text{${'abc'[i]}) } \\frac{${p}}{${q}} = ${p} : ${q} = ${perTex(ex[i])}`)),
    ),
    verify: () => items.every(([p, q], i) => ex[i].pre === '' && ex[i].period !== '' && Math.abs(approxVal(ex[i]) - p / q) < 1e-6),
  }
}

/** Ordinary fractions whose denominator has 2 or 5 and another factor: mixed periodic decimals, p. 45, ex. 4. */
export function perMixed(rng: Rng): Made {
  const items = shuffle(rng, [6, 12, 15, 18, 22, 24, 30, 36, 45, 55, 14, 75]).slice(0, 3).map((q) => {
    let p = int(rng, 1, 6 * q)
    while (gcd(p, q) !== 1) p++
    return [p, q] as [number, number]
  })
  const ex = items.map(([p, q]) => expandFrac(p, q))
  return {
    text: `Transformați fracțiile ordinare în fracții zecimale periodice mixte: ${items.map(([p, q], i) => `${'abc'[i]}) $\\frac{${p}}{${q}}$`).join('; ')}.`,
    solution: lines(
      'Numitorul are factorul 2 sau 5 și încă un factor, deci după virgulă apar întâi cifre care nu se repetă, apoi perioada:',
      ...items.map(([p, q], i) => show(`\\text{${'abc'[i]}) } \\frac{${p}}{${q}} = ${p} : ${q} = ${perTex(ex[i])}`)),
    ),
    verify: () => items.every(([p, q], i) => ex[i].pre !== '' && ex[i].period !== '' && Math.abs(approxVal(ex[i]) - p / q) < 1e-6),
  }
}

/** Without dividing: which fractions give finite, simple or mixed periodic decimals, p. 45, ex. 5. */
export function perClassify(rng: Rng): Made {
  for (;;) {
    const dens = [pick(rng, [2, 4, 5, 8, 10, 20, 25]), pick(rng, [3, 9, 7, 11, 33, 21]), pick(rng, [6, 12, 15, 30, 14, 35]), pick(rng, [9, 27, 13, 37]), pick(rng, [18, 45, 22, 24]), pick(rng, [15, 6, 12, 35])]
    const fr = dens.map((q) => [int(rng, 1, 9 * q), q] as [number, number])
    if (fr.some(([p, q]) => p % q === 0)) continue
    if (!fr.some(([p, q]) => gcd(p, q) > 1)) continue
    const order = shuffle(rng, fr)
    const groups = ['finită', 'periodică simplă', 'periodică mixtă'].map((k) => order.filter(([p, q]) => kindOf(p, q) === k))
    if (groups.some((g) => g.length === 0)) continue
    const red = ([p, q]: [number, number]) => {
      const [a, b] = reduce(p, q)
      return gcd(p, q) > 1 ? `\\frac{${p}}{${q}} = \\frac{${a}}{${b}}` : `\\frac{${p}}{${q}}`
    }
    return {
      text: `Fără a efectua împărțirile, stabiliți care dintre fracțiile ${order.map(([p, q]) => `$\\frac{${p}}{${q}}$`).join(', ')} se transformă în: a) fracții zecimale finite; b) fracții zecimale periodice simple; c) fracții zecimale periodice mixte.`,
      solution: lines(
        'Simplificăm fracțiile, apoi descompunem numitorul: doar factorii 2 și 5 dau o fracție finită; fără 2 și 5, periodică simplă; 2 sau 5 împreună cu alt factor, periodică mixtă.',
        `a) $${groups[0].map(red).join(';\\ ')}$`,
        `b) $${groups[1].map(red).join(';\\ ')}$`,
        `c) $${groups[2].map(red).join(';\\ ')}$`,
      ),
      verify: () => order.every(([p, q]) => {
        const e = expandFrac(p, q)
        const k = e.period === '' ? 'finită' : e.pre === '' ? 'periodică simplă' : 'periodică mixtă'
        return k === kindOf(p, q)
      }),
    }
  }
}

/** A fraction as a periodic decimal, then approximated by default, by excess and rounded to hundredths, p. 45, ex. 7–9. */
export function perApproximate(rng: Rng): Made {
  for (;;) {
    const q = pick(rng, [11, 35, 18, 33, 28, 12, 21, 13, 14, 7, 6, 15])
    const p = int(rng, 1, 8 * q)
    if (gcd(p, q) !== 1 || isFinite10(q)) continue
    const e = expandFrac(p, q)
    if ((e.pre + e.period).length > 8) continue
    const h = Math.floor((100 * p) / q), third = decimalAt(p, q, 3)
    const r = third >= 5 ? h + 1 : h
    return {
      text: `Transformați fracția $\\frac{${p}}{${q}}$ în fracție zecimală, apoi scrieți aproximările ei prin lipsă și prin adaos la sutimi și rotunjirea ei la sutimi.`,
      solution: lines(
        show(`\\frac{${p}}{${q}} = ${perTex(e)} = ${D(h, 2, true)}${decimalAt(p, q, 3)}${decimalAt(p, q, 4)}\\ldots`),
        `Prin lipsă la sutimi: $${D(h, 2, true)}$; prin adaos: $${D(h + 1, 2, true)}$. A treia zecimală este ${third}, deci rotunjirea la sutimi este $${D(r, 2, true)}$.`,
      ),
      verify: () => h / 100 < p / q && p / q < (h + 1) / 100 && Math.abs(r / 100 - p / q) <= 0.005 + 1e-12,
    }
  }
}

/** The k-th decimal of a periodic fraction and the sum of the first N decimals, p. 46, ex. 12 and ex. 16. */
export function perDigitAt(rng: Rng): Made {
  for (;;) {
    const q = pick(rng, [11, 198, 7, 37, 27, 33, 22, 6, 12, 13, 74, 55])
    const p = int(rng, 1, 3 * q)
    if (gcd(p, q) !== 1) continue
    const e = expandFrac(p, q)
    if (!e.period || e.period.length < 2 || e.period.length > 6) continue
    const k = int(rng, 100, 2100), N = int(rng, 20, 100)
    const L = e.period.length, s = e.pre.length
    const pos = ((k - s - 1) % L) + 1
    const digit = Number(e.period[pos - 1])
    const full = Math.floor((N - s) / L), rest = (N - s) % L
    const S = sum(e.pre.split('').map(Number)) + full * sum(e.period.split('').map(Number)) + sum(e.period.slice(0, rest).split('').map(Number))
    return {
      text: `Scrieți fracția $\\frac{${p}}{${q}}$ sub formă de fracție zecimală și aflați: a) a ${k}-a zecimală; b) suma primelor ${N} zecimale.`,
      solution: lines(
        show(`\\frac{${p}}{${q}} = ${perTex(e)}`),
        `${s ? `După virgulă ${s === 1 ? 'este o cifră' : `sunt ${s} cifre`} care nu se repetă, apoi perioada` : 'Perioada'} ${e.period}, de ${L} cifre.`,
        `a) Pe locul ${k}: ${s ? `$${k} - ${s} = ${k - s}$, iar ` : ''}$${k - s} = ${L} \\cdot ${Math.floor((k - s - 1) / L)} + ${pos}$, deci este cifra de pe locul ${pos} din perioadă: ${digit}.`,
        `b) ${s ? `${s === 1 ? 'Prima zecimală este' : `Primele ${s} zecimale au suma`} ${sum(e.pre.split('').map(Number))}; urmează ` : ''}$${N - s} = ${L} \\cdot ${full} + ${rest}$: ${de(full)} perioade întregi (suma unei perioade este ${sum(e.period.split('').map(Number))})${rest ? ` și încă ${rest === 1 ? 'o cifră' : `${rest} cifre`}` : ''}. Suma este ${S}.`,
      ),
      verify: () => decimalAt(p, q, k) === digit && sum(range(1, N).map((i) => decimalAt(p, q, i))) === S,
    }
  }
}

/** The smallest n for which a/(n + c) gives a finite, a simple or a mixed periodic decimal, p. 46, ex. 11. */
export function perSmallestN(rng: Rng): Made {
  const a = pick(rng, [3, 7, 9, 11, 13, 17]), c = int(rng, 2, 9)
  const first = (k: string) => range(0, 200).find((n) => kindOf(a, n + c) === k)!
  const ns = ['finită', 'periodică simplă', 'periodică mixtă'].map(first)
  const shown = (n: number) => {
    const [p, q] = reduce(a, n + c)
    return `$n = ${n}$: $\\frac{${a}}{${n + c}}${q !== n + c ? ` = \\frac{${p}}{${q}}` : ''} = ${perTex(expandFrac(a, n + c))}$`
  }
  return {
    text: `Aflați cel mai mic număr natural $n$ pentru care fracția $\\frac{${a}}{n + ${c}}$ se transformă în: a) fracție zecimală finită; b) fracție zecimală periodică simplă; c) fracție zecimală periodică mixtă.`,
    solution: lines(
      `Dăm lui $n$ valorile $0, 1, 2, \\dots$ și privim numitorul fracției simplificate: doar 2 și 5 (finită), fără 2 și 5 (simplă), 2 sau 5 și alt factor (mixtă).`,
      `a) ${shown(ns[0])}; b) ${shown(ns[1])}; c) ${shown(ns[2])}.`,
    ),
    verify: () => ns.every((n, i) => {
      const e = expandFrac(a, n + c)
      return [e.period === '', e.period !== '' && e.pre === '', e.period !== '' && e.pre !== ''][i] &&
        range(0, n - 1).every((m) => kindOf(a, m + c) !== ['finită', 'periodică simplă', 'periodică mixtă'][i])
    }),
  }
}

/** (10n + a)/(10n + b) is always simple periodic, (6n + 6k − 1)/(6n + 6k) always mixed, p. 46, ex. 13–14. */
export function perFamily(rng: Rng): Made {
  for (;;) {
    const simple = rng() < 0.5
    const b = pick(rng, [1, 3, 7, 9]), a = int(rng, 1, b + 5), k = int(rng, 1, 3)
    const num = (n: number) => (simple ? 10 * n + a : 6 * n + 6 * k - 1)
    const den = (n: number) => (simple ? 10 * n + b : 6 * n + 6 * k)
    if (simple && (a === b || den(0) === 1)) continue
    const ns = shuffle(rng, range(0, 5)).slice(0, 2).sort((u, v) => u - v)
    const ex = ns.map((n) => expandFrac(num(n), den(n)))
    if (ex.some((e) => e.period.length > 6 || e.period === '')) continue
    if (!range(0, 40).every((n) => kindOf(num(n), den(n)) === (simple ? 'periodică simplă' : 'periodică mixtă'))) continue
    const fr = simple ? `\\frac{10n + ${a}}{10n + ${b}}` : `\\frac{6n + ${6 * k - 1}}{6n + ${6 * k}}`
    return {
      text: `Pentru numărul natural $n$ se consideră fracția $${fr}$. a) Scrieți fracția sub formă de fracție zecimală pentru $n = ${ns[0]}$ și pentru $n = ${ns[1]}$. b) Arătați că, pentru orice $n \\in \\mathbb{N}$, fracția zecimală obținută este periodică ${simple ? 'simplă' : 'mixtă'}.`,
      solution: lines(
        show(`\\text{a) } ${ns.map((n, i) => `\\frac{${num(n)}}{${den(n)}} = ${perTex(ex[i])}`).join(', \\qquad ')}`),
        simple
          ? `b) Numitorul $10n + ${b}$ are ultima cifră ${b}, deci nu se divide cu 2 și nici cu 5; un divizor comun al numărătorului și numitorului divide diferența lor, ${Math.abs(b - a)}, deci după simplificare numitorul rămâne fără factorii 2 și 5 (și diferit de 1). Fracția este periodică simplă.`
          : `b) Numitorul este $6(n + ${k})$, iar numărătorul $6n + ${6 * k - 1}$ diferă de el cu 1, deci fracția este ireductibilă. Numitorul conține factorul 2 și factorul 3, deci fracția este periodică mixtă.`,
      ),
      verify: () => range(0, 40).every((n) => {
        const e = expandFrac(num(n), den(n))
        return e.period !== '' && (simple ? e.pre === '' : e.pre !== '')
      }) && ns.every((n, i) => Math.abs(approxVal(ex[i]) - num(n) / den(n)) < 1e-6),
    }
  }
}

// ================= 7. The arithmetic mean (pp. 46–48) =================

/** The mean of a and x is m (or of two numbers, one known): the other number, p. 47, ex. 3 and ex. 6. */
export function meanOther(rng: Rng): Made {
  const m = int(rng, 10, 300), a = int(rng, 1, 2 * m - 1)
  const x = 2 * m - a
  const v = rng() < 0.5
  return {
    text: v ? `Media aritmetică a numerelor ${a} și $x$ este ${m}. Calculați $x$.` : `Media aritmetică a două numere este ${m}. Unul dintre ele este ${a}. Calculați celălalt număr.`,
    solution: lines(
      'Suma celor două numere este dublul mediei:',
      show(`${m} \\cdot 2 = ${2 * m}, \\qquad ${2 * m} - ${a} = ${x}`),
      `Verificare: $(${a} + ${x}) : 2 = ${m}$.`,
    ),
    verify: () => (a + x) / 2 === m,
  }
}

/** The mean of n numbers is m (a decimal): their sum; the mean of two numbers given, p. 47, ex. 1 and ex. 7. */
export function meanSum(rng: Rng): Made {
  const n = int(rng, 3, 9), m = rnd(rng, 5, 99, 1)
  const a = int(rng, 10, 999), b = int(rng, 10, 999)
  const s2 = a + b
  return {
    text: `a) Media aritmetică a ${n} numere este $${D(m, 1)}$. Calculați suma numerelor. b) Calculați media aritmetică a numerelor ${a} și ${b}.`,
    solution: lines(
      show(`\\text{a) } S = ${D(m, 1)} \\cdot ${n} = ${D(m * n, 1)}`),
      show(`\\text{b) } m_a = (${a} + ${b}) : 2 = ${nr(s2)} : 2 = ${D(s2 * 5, 1)}`),
    ),
    verify: () => close(val(D(m * n, 1)) / n, m / 10) && close(val(D(s2 * 5, 1)), (a + b) / 2),
  }
}

const NAMES = ['Maria', 'Ana', 'Ioana', 'Mihai', 'Andrei', 'Elena', 'Radu', 'Sara']

/** The mean temperature of a few days, often a decimal, p. 47, ex. 5. */
export function meanTemperatures(rng: Rng): Made {
  const n = pick(rng, [4, 5, 8])
  const t = Array.from({ length: n }, () => int(rng, 8, 30))
  const S = sum(t)
  const k = n === 4 || n === 5 ? 2 : 3
  const m = (S * P10(k)) / n
  const who = pick(rng, NAMES)
  return {
    text: `Timp de ${n} zile la rând, ${who} a măsurat la prânz temperaturile: ${t.map((x) => `$${x}^{\\circ}\\text{C}$`).join(', ')}. Calculați media temperaturilor din cele ${n} zile.`,
    solution: show(`m_a = (${t.join(' + ')}) : ${n} = ${S} : ${n} = ${D(m, k)}^{\\circ}\\text{C}`),
    verify: () => Number.isInteger(m) && close(val(D(m, k)), S / n),
  }
}

/** The mean of two numbers is m and their ratio k: the numbers, p. 48, ex. 15. */
export function meanRatio(rng: Rng): Made {
  const b = int(rng, 2, 60), k = int(rng, 2, 9)
  const a = k * b, S = a + b
  return {
    text: `Media aritmetică a două numere este $${D(S * 5, 1)}$. Calculați numerele, știind că raportul lor este ${k}.`,
    solution: lines(
      `Suma numerelor este $${D(S * 5, 1)} \\cdot 2 = ${S}$. Numărul mai mare este de ${k} ori mai mare decât celălalt, deci suma are $${k} + 1 = ${k + 1}$ părți egale:`,
      show(`${S} : ${k + 1} = ${b}, \\qquad ${b} \\cdot ${k} = ${a}`),
      `Numerele sunt ${b} și ${a}.`,
    ),
    verify: () => a / b === k && (a + b) / 2 === (S * 5) / 10,
  }
}

/** The mean of px, qx, rx; the mean of x, c and dx is m: x, p. 48, ex. 11–12. */
export function meanLetters(rng: Rng): Made {
  for (;;) {
    const [p, q, r] = [int(rng, 2, 20), int(rng, 2, 30), int(rng, 2, 40)]
    if ((p + q + r) % 3 !== 0 || new Set([p, q, r]).size < 3) continue
    const c = int(rng, 1, 9), d = int(rng, 2, 6), x = int(rng, 2, 20)
    const m3 = x + c + d * x
    if (m3 % 3 !== 0) continue
    const m = m3 / 3
    return {
      text: `a) Calculați media aritmetică a numerelor $${p}x$, $${q}x$ și $${r}x$. b) Media aritmetică a numerelor $x$, ${c} și $${d}x$ este ${m}. Calculați $x$.`,
      solution: lines(
        show(`\\text{a) } (${p}x + ${q}x + ${r}x) : 3 = ${p + q + r}x : 3 = ${cv((p + q + r) / 3, 'x')}`),
        show(`\\text{b) } x + ${c} + ${d}x = ${m} \\cdot 3 = ${m3} \\Rightarrow ${d + 1}x = ${m3 - c} \\Rightarrow x = ${x}`),
      ),
      verify: () => (x + c + d * x) / 3 === m && (p + q + r) % 3 === 0,
    }
  }
}

/** The mean of three numbers is m and the fourth is p: the mean of the four, p. 48, ex. 10. */
export function meanFourth(rng: Rng): Made {
  const m = int(rng, 5, 99), p = int(rng, 1, 150)
  const S = 3 * m + p
  return {
    text: `Media aritmetică a trei numere este ${m}, iar al patrulea număr este ${p}. Calculați media aritmetică a celor patru numere.`,
    solution: lines(
      show(`\\text{suma primelor trei: } ${m} \\cdot 3 = ${3 * m}, \\qquad \\text{suma celor patru: } ${3 * m} + ${p} = ${S}`),
      show(`m_a = ${S} : 4 = ${D(S * 25, 2)}`),
    ),
    verify: () => close(val(D(S * 25, 2)), (3 * m + p) / 4),
  }
}

/** The mean of three numbers, the mean of the first two, the third k less than double the first, p. 48, ex. 16. */
export function meanConditions(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 5, 60), k = int(rng, 1, 15)
    const c = 2 * a - k, b = int(rng, 5, 80)
    if ((a + b) % 2 !== 0 || (a + b + c) % 3 !== 0 || c < 1) continue
    const m2 = (a + b) / 2, m = (a + b + c) / 3
    return {
      text: `Media aritmetică a trei numere este ${m}, iar media aritmetică a primelor două numere este ${m2}. Calculați numerele, știind că al treilea număr este cu ${k} mai mic decât dublul primului număr.`,
      solution: lines(
        show(`a + b + c = ${m} \\cdot 3 = ${3 * m}, \\qquad a + b = ${m2} \\cdot 2 = ${2 * m2}, \\qquad c = ${3 * m} - ${2 * m2} = ${c}`),
        show(`2a - ${k} = ${c} \\Rightarrow 2a = ${c + k} \\Rightarrow a = ${a}, \\qquad b = ${2 * m2} - ${a} = ${b}`),
      ),
      verify: () => (a + b + c) / 3 === m && (a + b) / 2 === m2 && c === 2 * a - k,
    }
  }
}

/** a₁…a_p with mean M1, a_(p+1)…a_n with mean M2: the mean of all, p. 48, ex. 23. */
export function meanGroups(rng: Rng): Made {
  for (;;) {
    const n = pick(rng, [10, 20, 40, 50, 100, 80, 25])
    const p = int(rng, 2, n - 2)
    const M1 = int(rng, 10, 900), M2 = int(rng, 10, 900)
    const S = p * M1 + (n - p) * M2
    const k = [10, 20, 40, 50, 80].includes(n) ? 3 : 2
    const m = (S * P10(k)) / n
    if (!Number.isInteger(m) || M1 === M2) continue
    return {
      text: `Știind că media aritmetică a numerelor $a_1, a_2, \\dots, a_{${p}}$ este ${M1}, iar media aritmetică a numerelor $a_{${p + 1}}, a_{${p + 2}}, \\dots, a_{${n}}$ este ${M2}, calculați media aritmetică a numerelor $a_1, a_2, \\dots, a_{${n}}$.`,
      solution: lines(
        show(`a_1 + \\dots + a_{${p}} = ${M1} \\cdot ${p} = ${nr(p * M1)}, \\qquad a_{${p + 1}} + \\dots + a_{${n}} = ${M2} \\cdot ${n - p} = ${nr((n - p) * M2)}`),
        show(`m_a = (${nr(p * M1)} + ${nr((n - p) * M2)}) : ${n} = ${nr(S)} : ${n} = ${D(m, k)}`),
      ),
      verify: () => close(val(D(m, k)), (p * M1 + (n - p) * M2) / n),
    }
  }
}

/** Three numbers whose means two by two are given, p. 48, ex. 24. */
export function meanPairwise(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = [int(rng, 1, 99), int(rng, 1, 99), int(rng, 1, 99)]
    if ((a + b) % 2 || (b + c) % 2 || new Set([a, b, c]).size < 3) continue
    const ms = [(a + b) / 2, (b + c) / 2, (a + c) / 2]
    if (new Set(ms).size < 3) continue
    const T = a + b + c
    return {
      text: `Aflați trei numere naturale, știind că două câte două au mediile aritmetice ${list(ms)}.`,
      solution: lines(
        'Sumele perechilor sunt dublul mediilor:',
        show(`a + b = ${2 * ms[0]}, \\qquad b + c = ${2 * ms[1]}, \\qquad a + c = ${2 * ms[2]}`),
        'Adunându-le, fiecare număr apare de două ori:',
        show(`2(a + b + c) = ${2 * T} \\Rightarrow a + b + c = ${T}`),
        show(`c = ${T} - ${2 * ms[0]} = ${c}, \\qquad a = ${T} - ${2 * ms[1]} = ${a}, \\qquad b = ${T} - ${2 * ms[2]} = ${b}`),
        `Numerele sunt ${a}, ${b} și ${c}.`,
      ),
      verify: () => (a + b) / 2 === ms[0] && (b + c) / 2 === ms[1] && (a + c) / 2 === ms[2],
    }
  }
}

/** n distinct naturals (or nonzero naturals) with mean m: the largest one possible, p. 48, ex. 18 and ex. 21. */
export function meanLargest(rng: Rng): Made {
  const n = int(rng, 3, 9), m = int(rng, n + 2, 60)
  const nonzero = rng() < 0.5
  const others = nonzero ? range(1, n - 1) : range(0, n - 2)
  const max = n * m - sum(others)
  return {
    text: `Media aritmetică a ${n} numere naturale ${nonzero ? 'nenule ' : ''}distincte este ${m}. Care este cea mai mare valoare pe care o poate lua unul dintre numere?`,
    solution: lines(
      `Suma numerelor este $${m} \\cdot ${n} = ${n * m}$. Un număr este cât mai mare când celelalte ${n - 1} sunt cât mai mici: $${others.join(', ')}$.`,
      show(`${n * m} - (${others.join(' + ')}) = ${n * m} - ${sum(others)} = ${max}`),
    ),
    verify: () => (sum(others) + max) / n === m && new Set([...others, max]).size === n,
  }
}

/** The mean of n numbers is m and the first is a: the mean of the others, p. 48, ex. 22. */
export function meanOfRest(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 12), m = int(rng, 10, 99), a = int(rng, 1, n * m - 1)
    if ((n * m - a) % (n - 1) !== 0) continue
    const r = (n * m - a) / (n - 1)
    if (r === m) continue
    return {
      text: `Media aritmetică a ${n} numere naturale este ${m}. Știind că primul număr este ${a}, calculați media aritmetică a celorlalte ${n - 1} numere.`,
      solution: show(`${m} \\cdot ${n} = ${n * m}, \\qquad (${n * m} - ${a}) : ${n - 1} = ${n * m - a} : ${n - 1} = ${r}`),
      verify: () => (a + r * (n - 1)) / n === m,
    }
  }
}

/** The mean of bⁿ, bⁿ⁺¹ and c·bⁿ⁺², p. 48, ex. 20. */
export function meanPowers(rng: Rng): Made {
  const b = pick(rng, [2, 5, 8]), c = pick(rng, [3, 6]), n = int(rng, 10, 40)
  const K = (1 + b + c * b * b) / 3
  return {
    text: `Calculați media aritmetică a numerelor $${b}^{${n}}$, $${b}^{${n + 1}}$ și $${c} \\cdot ${b}^{${n + 2}}$.`,
    solution: lines(
      `Dăm factor comun pe $${b}^{${n}}$:`,
      show(`${b}^{${n}} + ${b}^{${n + 1}} + ${c} \\cdot ${b}^{${n + 2}} = ${b}^{${n}}(1 + ${b} + ${c} \\cdot ${b * b}) = ${b}^{${n}} \\cdot ${1 + b + c * b * b}`),
      show(`m_a = ${b}^{${n}} \\cdot ${1 + b + c * b * b} : 3 = ${K} \\cdot ${b}^{${n}}`),
    ),
    verify: () => Number.isInteger(K) && close(b ** n * (1 + b + c * b * b) / 3, K * b ** n),
  }
}

// ================= contest: digits of decimals ("Supermate") =================

/** 0,ab + 0,ba = s: the digits a and b, p. 27, ex. 15. */
export function contestSwapSum(rng: Rng): Made {
  const s = int(rng, 3, 17)
  const pairs = range(1, 9).filter((a) => s - a >= 1 && s - a <= 9).map((a) => [a, s - a])
  return {
    text: `a) Arătați că, dacă $a$ și $b$ sunt cifre nenule și $\\overline{0{,}ab} + \\overline{0{,}ba} = s$, atunci numărul natural $100 \\cdot s$ este divizibil cu 11. b) Aflați cifrele $a$ și $b$ în cazul în care $s = ${D(11 * s, 2)}$.`,
    solution: lines(
      show(`\\text{a) } \\overline{0{,}ab} + \\overline{0{,}ba} = \\frac{10a + b + 10b + a}{100} = \\frac{11(a + b)}{100} \\Rightarrow 100s = 11(a + b) \\ \\vdots \\ 11`),
      show(`\\text{b) } 11(a + b) = ${11 * s} \\Rightarrow a + b = ${s}`),
      `Perechile $(a, b)$: ${pairs.map(([a, b]) => `$(${a}, ${b})$`).join(', ')}.`,
    ),
    verify: () => {
      let c = 0
      for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (11 * (a + b) === 11 * s) c++
      return c === pairs.length
    },
  }
}

/** a,b − b,a = d: the digits, p. 29, ex. 17. */
export function contestSwapDifference(rng: Rng): Made {
  const t = int(rng, 1, 8)
  const pairs = range(1, 9).filter((b) => b + t <= 9).map((b) => [b + t, b])
  return {
    text: `a) Arătați că, dacă $a$ și $b$ sunt cifre nenule astfel încât $\\overline{a{,}b} - \\overline{b{,}a} = d$, atunci numărul natural $10 \\cdot d$ este divizibil cu 9. b) Aflați cifrele $a$ și $b$ în cazul în care $d = ${D(9 * t, 1)}$.`,
    solution: lines(
      show(`\\text{a) } \\overline{a{,}b} - \\overline{b{,}a} = \\frac{10a + b - 10b - a}{10} = \\frac{9(a - b)}{10} \\Rightarrow 10d = 9(a - b) \\ \\vdots \\ 9`),
      show(`\\text{b) } 9(a - b) = ${9 * t} \\Rightarrow a - b = ${t}`),
      `Perechile $(a, b)$: ${pairs.map(([a, b]) => `$(${a}, ${b})$`).join(', ')}.`,
    ),
    verify: () => pairs.every(([a, b]) => close(a + b / 10 - (b + a / 10), (9 * t) / 10)) && pairs.length === 9 - t,
  }
}

/** 0,abc + 0,0bc = R: the nonzero digits, p. 27, ex. 16. */
export function contestAbcSum(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 9), b = int(rng, 1, 9), c = int(rng, 1, 9)
    const R = 100 * a + 20 * b + 2 * c
    const sols = range(1, 9).flatMap((x) => range(1, 9).flatMap((y) => range(1, 9).map((z) => [x, y, z]))).filter(([x, y, z]) => 100 * x + 20 * y + 2 * z === R)
    if (sols.length !== 1 || R >= 1000) continue
    return {
      text: `Aflați cifrele nenule $a$, $b$ și $c$, știind că $\\overline{0{,}abc} + \\overline{0{,}0bc} = ${D(R, 3)}$.`,
      solution: lines(
        show(`\\frac{100a + 10b + c}{1000} + \\frac{10b + c}{1000} = \\frac{100a + 20b + 2c}{1000} = \\frac{${R}}{1000}`),
        show(`100a + 20b + 2c = ${R}`),
        `Cum $20b + 2c \\le 198$, încercăm valorile lui $a$: singura soluție cu cifre nenule este $a = ${a}$, $b = ${b}$, $c = ${c}$ (verificare: $${D(100 * a + 10 * b + c, 3)} + ${D(10 * b + c, 3)} = ${D(R, 3)}$).`,
      ),
      verify: () => sols[0].join() === [a, b, c].join(),
    }
  }
}

/** a,b − K = 0,bc: the digits a and c, and b free, p. 30, ex. 18. */
export function contestMinusDecimal(rng: Rng): Made {
  const a = int(rng, 1, 9), c = int(rng, 1, 9)
  const K = 100 * a - c
  const b = int(rng, 0, 9)
  return {
    text: `Știind că $a$, $b$ și $c$ sunt cifre, $a \\ne 0$, și $\\overline{a{,}b} - ${D(K, 2)} = \\overline{0{,}bc}$, aflați cifrele $a$ și $c$. Ce valori poate lua cifra $b$?`,
    solution: lines(
      'Înmulțim egalitatea cu 100, ca să lucrăm cu numere naturale:',
      show(`10 \\cdot \\overline{ab} - ${K} = \\overline{bc} \\Rightarrow 100a + 10b - ${K} = 10b + c \\Rightarrow 100a - c = ${K}`),
      `Cum $0 \\le c \\le 9$, numărul $100a$ este cuprins între ${K} și ${K + 9}, deci $a = ${a}$ și $c = ${100 * a - K}$.`,
      `Termenul $10b$ s-a redus, deci $b$ poate fi orice cifră. De exemplu, pentru $b = ${b}$: $${D(10 * a + b, 1, true)} - ${D(K, 2)} = ${D(10 * b + c, 2, true)}$.`,
    ),
    verify: () => {
      const ac = range(1, 9).flatMap((x) => range(0, 9).map((z) => [x, z])).filter(([x, z]) => 100 * x - z === K)
      return ac.length === 1 && ac[0][0] === a && ac[0][1] === c &&
        DIGITS.every((y) => close((10 * a + y) / 10 - K / 100, (10 * y + c) / 100))
    },
  }
}

/** k/(a + b) = 0,0b + 0,a: the digits, p. 27, ex. 18. */
export function contestFractionDigits(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 9), b = int(rng, 1, 9)
    const P = (a + b) * (10 * a + b)
    if (P % 10 !== 0) continue
    const sols = range(1, 9).flatMap((x) => range(1, 9).map((y) => [x, y])).filter(([x, y]) => (x + y) * (10 * x + y) === P)
    if (sols.length !== 1) continue
    const k = D(P, 2)
    return {
      text: `Aflați cifrele nenule $a$ și $b$, știind că $${k} \\cdot \\frac{1}{a + b} = \\overline{0{,}0b} + \\overline{0{,}a}$.`,
      solution: lines(
        show(`\\overline{0{,}0b} + \\overline{0{,}a} = \\frac{b}{100} + \\frac{10a}{100} = \\frac{\\overline{ab}}{100}`),
        show(`\\frac{${k}}{a + b} = \\frac{\\overline{ab}}{100} \\Rightarrow (a + b) \\cdot \\overline{ab} = ${P}`),
        `Căutăm un număr de două cifre $\\overline{ab}$ care, înmulțit cu suma cifrelor lui, dă ${P}: doar $\\overline{ab} = ${10 * a + b}$ ($${a + b} \\cdot ${10 * a + b} = ${P}$). Deci $a = ${a}$, $b = ${b}$.`,
      ),
      verify: () => sols[0].join() === [a, b].join() && close(val(k) / (a + b), b / 100 + a / 10),
    }
  }
}

/** a,b + b,c + c,a (or a,bc + …) given, with distinct digits: a² + b² + c², p. 13, ex. 25. */
export function contestSquaresOfDigits(rng: Rng): Made {
  const S = pick(rng, [3, 4, 23, 24])
  const v = int(rng, 0, 2)
  const set = { 3: [0, 1, 2], 4: [0, 1, 3], 23: [6, 8, 9], 24: [7, 8, 9] }[S]!
  const coef = [1, 11, 111][v], den = [10, 10, 100][v]
  const [p, q] = reduce(coef * S, den)
  const lhs = ['\\overline{0{,}a} + \\overline{0{,}b} + \\overline{0{,}c}', '\\overline{a{,}b} + \\overline{b{,}c} + \\overline{c{,}a}', '\\overline{a{,}bc} + \\overline{b{,}ca} + \\overline{c{,}ab}'][v]
  const sq = sum(set.map((d) => d * d))
  return {
    text: `Calculați suma $a^2 + b^2 + c^2$, știind că $a$, $b$, $c$ sunt cifre distincte și $${lhs} = ${q === 1 ? p : `\\frac{${p}}{${q}}`}$.`,
    solution: lines(
      show(`${lhs} = \\frac{${coef === 1 ? 'a + b + c' : `${coef}(a + b + c)`}}{${den}} \\Rightarrow a + b + c = ${S}`),
      `${S < 10 ? 'Cea mai mică sumă a trei cifre distincte este $0 + 1 + 2 = 3$' : 'Cea mai mare sumă a trei cifre distincte este $7 + 8 + 9 = 24$'}, deci suma ${S} se obține doar cu cifrele ${list(set)}, în orice ordine:`,
      show(`a^2 + b^2 + c^2 = ${set.map((d) => `${d}^2`).join(' + ')} = ${sq}`),
    ),
    verify: () => {
      const triples: number[][] = []
      for (let a = 0; a <= 9; a++) for (let b = a + 1; b <= 9; b++) for (let c = b + 1; c <= 9; c++) if (a + b + c === S) triples.push([a, b, c])
      return triples.length === 1 && triples[0].join() === set.join() && close((coef * S) / den, p / q)
    },
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-decimal-writing', label: 'Fracții zecimale: scriere, cifre, transformări', topic: 'Algebră',
    forms: {
      1: [decFromWords, decDigits, decPowerFraction, decToFraction],
      2: [decUnits, decExpand, decFindN, decAmplify],
      3: [decSequence, decOverlineSum, decDigitsExpansion, decFracEquality],
    },
  },
  {
    id: 'v-decimal-order', label: 'Compararea, ordonarea și aproximarea fracțiilor zecimale', topic: 'Algebră',
    forms: {
      1: [decCompare, decRound, decApproximate],
      2: [decOrder, decFromDigits, decUnknownDigit, decRoundingDigit, decBracket],
      3: [decCountBetween, decDigitSum, decCountXY],
    },
  },
  {
    id: 'v-decimal-add-sub', label: 'Adunarea și scăderea fracțiilor zecimale', topic: 'Algebră',
    forms: {
      1: [decAdd, decSubtract, decWordAddSub],
      2: [decBrackets, decApproxSum, decMoreLess, decJourney],
      3: [decOverlineEquation, decChangeDifference, decSeriesSum, decLinearCombo],
    },
  },
  {
    id: 'v-decimal-multiply', label: 'Înmulțirea fracțiilor zecimale', topic: 'Algebră',
    forms: {
      1: [decTimesPower10, decMultiply, decTimesLarger],
      2: [decRoundProduct, decAssociate, decCombineSums, decWordMultiply],
      3: [decFactorExpression, decDistributive, decOneMore, decOverlineProduct],
    },
  },
  {
    id: 'v-decimal-powers', label: 'Puteri ale fracțiilor zecimale', topic: 'Algebră',
    forms: {
      1: [decSquaresCubes, decSameBase, decPowerOfProduct],
      2: [decPowerOfPower, decSquareCompare, decSquareArea, decExponentEquation],
      3: [decProductExponents, decExponentFactor, decDecimalsOfProduct],
    },
  },
  {
    id: 'v-decimal-periodic', label: 'Fracții zecimale periodice', topic: 'Algebră',
    forms: {
      1: [perDivision, perSimple, perMixed],
      2: [perClassify, perApproximate],
      3: [perDigitAt, perSmallestN, perFamily],
    },
  },
  {
    id: 'v-mean-applied', label: 'Media aritmetică: probleme', topic: 'Algebră',
    forms: {
      1: [meanOther, meanSum, meanTemperatures],
      2: [meanRatio, meanLetters, meanFourth, meanConditions],
      3: [meanGroups, meanPairwise, meanLargest, meanOfRest, meanPowers],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-decimal-digits', label: 'Fracții zecimale cu cifre necunoscute',
    forms: [contestSwapSum, contestSwapDifference, contestAbcSum, contestMinusDecimal, contestFractionDigits, contestSquaresOfDigits],
  },
]
