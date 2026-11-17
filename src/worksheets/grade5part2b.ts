// Grade V kinds from "Matematică, clasa a V-a", Mate 2000+ Consolidare, partea a II-a (Paralela 45), pp. 51–101,
// photographed by the user on 14 November 2026: the division of decimals, powers and approximations (pp. 51–53),
// periodic decimals turned into ordinary fractions (pp. 55–56), the order of operations with rational numbers
// (pp. 59–60), the recap tests on decimals (pp. 61–66), arithmetic methods with decimals and their tests (pp. 71–78),
// organising data: frequencies, percentages, means (pp. 82–90), and point, line, half-line, segment (pp. 98–101).
// Levels follow the stars: Înțelegere * = 1, Aplicare și exersare ** = 2, Aprofundare și performanță *** = 3; the tests
// without stars by content. The Supermate problems that can be generated are in `CONTEST`.
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
/** contest level only: the Supermate problems that can be generated */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const close = (x: number, y: number) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))
/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up: 20\,347. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** n / 10^p as a decimal in LaTeX, with the Romanian comma and the zeros at the end dropped: D(1250, 2) = 12{,}5. */
function D(n: number, p = 0): string {
  const s = String(Math.abs(n)).padStart(p + 1, '0')
  const f = p ? s.slice(s.length - p).replace(/0+$/, '') : ''
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - p))) + (f ? `{,}${f}` : '')
}
/** Like D, but keeping all the p decimals, as for money: DK(1250, 2) = 12{,}50. */
function DK(n: number, p: number): string {
  const s = String(Math.abs(n)).padStart(p + 1, '0')
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - p))) + (p ? `{,}${s.slice(s.length - p)}` : '')
}
/** A sum of money given in bani: 1800 lei, 12,50 lei. */
const money = (bani: number) => (bani % 100 === 0 ? D(bani, 2) : DK(bani, 2))
/** The value of a decimal written by D, DK or dec: the check reads what the student reads. */
const val = (t: string) => Number(t.replace(/\\,/g, '').replace('{,}', '.').replace(/\(.*\)/, ''))
const p10 = (k: number) => 10 ** k
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
/** a + b + c = s, or only s when there is one term. */
const sumEq = (terms: number[]) => (terms.length > 1 ? `${terms.join(' + ')} = ${sum(terms)}` : String(sum(terms)))
const elevi = (n: number) => (n === 1 ? 'un elev' : `${de(n)} elevi`)

/** p/q (p ≥ 0, q > 0) as a decimal: the whole part, the digits before the period, the period ('' when finite). */
function expand(p: number, q: number): { whole: number; pre: string; rep: string } {
  const whole = Math.floor(p / q)
  let r = p % q
  const seen = new Map<number, number>()
  let digits = ''
  while (r !== 0 && !seen.has(r)) {
    seen.set(r, digits.length)
    r *= 10
    digits += String(Math.floor(r / q))
    r %= q
  }
  if (r === 0) return { whole, pre: digits, rep: '' }
  const at = seen.get(r)!
  return { whole, pre: digits.slice(0, at), rep: digits.slice(at) }
}
type Expansion = ReturnType<typeof expand>
const decTex = (e: Expansion) => nr(e.whole) + (e.pre || e.rep ? '{,}' + e.pre + (e.rep ? `(${e.rep})` : '') : '')
/** p/q as a (possibly periodic) decimal in LaTeX: 3{,}1(6). */
const rat = (p: number, q: number) => decTex(expand(p, q))
/** whole, pre, rep back to an irreducible fraction, by the rule of the textbook. */
function fromPeriodic(whole: number, pre: string, rep: string): [number, number] {
  const m = pre.length
  if (!rep) return reduce(whole * p10(m) + Number(pre || '0'), p10(m))
  const den = (p10(rep.length) - 1) * p10(m)
  return reduce(whole * den + Number(pre + rep) - Number(pre || '0'), den)
}
/** Random digits, as a string. */
const digits = (rng: Rng, n: number, lo = 0) => Array.from({ length: n }, () => String(int(rng, lo, 9))).join('')
/** A period that is not shorter than it looks (not 33, 1212) and not made of nines. */
const goodRep = (rep: string) => !/^9+$/.test(rep) && Number(rep) > 0 && !(rep.length === 2 && rep[0] === rep[1]) && !(rep.length === 4 && rep.slice(0, 2) === rep.slice(2))
/** A random periodic decimal: whole part, pre-period of preLen digits, period of repLen digits, written the shortest way. */
function randomPeriodic(rng: Rng, wholeLo: number, wholeHi: number, preLen: number, repLen: number): Expansion {
  for (;;) {
    const whole = int(rng, wholeLo, wholeHi)
    const pre = digits(rng, preLen)
    const rep = digits(rng, repLen)
    if (!goodRep(rep) || (pre && pre[pre.length - 1] === rep[rep.length - 1])) continue
    return { whole, pre, rep }
  }
}

const GIRLS = ['Ana', 'Maria', 'Ioana', 'Elena', 'Irina', 'Daria', 'Nina', 'Sonia', 'Alexandra', 'Bianca', 'Sara', 'Camelia']
const BOYS = ['Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Matei', 'Luca', 'Bogdan', 'Răzvan', 'Iulian', 'Costin']

// ================= the division of decimals, powers and approximations (pp. 51–53) =================

/** X : 10, X : 100, X : 10³, p. 51, ex. 1. */
export function decDivPowersOfTen(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 3)
    const n = int(rng, 11, 99999)
    if (n % 10 === 0) continue
    const x = D(n, p)
    const by = ['10', pick(rng, ['100', '10^2']), pick(rng, ['1000', '10^3'])]
    const res = [1, 2, 3].map((k) => D(n, p + k))
    return {
      text: `Efectuați împărțirile: a) $${x} : ${by[0]}$; b) $${x} : ${by[1]}$; c) $${x} : ${by[2]}$.`,
      solution: lines(
        'La împărțirea cu 10, 100, 1000 mutăm virgula spre stânga cu una, două, respectiv trei cifre (completând cu zerouri, la nevoie):',
        show(`${x} : ${by[0]} = ${res[0]}, \\quad ${x} : ${by[1]} = ${res[1]}, \\quad ${x} : ${by[2]} = ${res[2]}`),
      ),
      verify: () => [1, 2, 3].every((k, i) => close(val(res[i]) * p10(k), n / p10(p))),
    }
  }
}

/** a : d with two exact decimals, and the check q·d + r = a, p. 51, ex. 2 and 3. */
export function decDivTwoDecimals(rng: Rng): Made {
  for (;;) {
    const natural = rng() < 0.5
    const A = natural ? int(rng, 100, 9999) * 100 : int(rng, 1001, 99999)
    if (!natural && A % 10 === 0) continue
    const d = int(rng, 3, 99)
    const Q = Math.floor(A / d)
    const R = A - Q * d
    if (Q < 10 || d % 10 === 0) continue
    const a = D(A, 2)
    const q = DK(Q, 2)
    return {
      text: `Calculați cu două zecimale exacte câtul împărțirii $${a} : ${d}$ și faceți proba.`,
      solution: lines(
        `Împărțim ca la numerele naturale; după ce coborâm ultima cifră a părții întregi punem virgula la cât și continuăm, adăugând zerouri, până la a doua zecimală:`,
        show(`${a} : ${d} = ${q}${R ? ` \\quad (\\text{rest } ${D(R, 2)})` : ''}`),
        'Proba:',
        show(R ? `${q} \\cdot ${d} + ${D(R, 2)} = ${D(Q * d, 2)} + ${D(R, 2)} = ${a}` : `${q} \\cdot ${d} = ${a}`),
      ),
      verify: () => close(val(q) * d + R / 100, val(a)) && R / 100 < d / 100,
    }
  }
}

/** (b)^m : (b)^n, or (b)^m · (b)^p : (b)^n, as one power, then its value, p. 52, ex. 7 and 8. */
export function decPowerQuotient(rng: Rng): Made {
  const B = pick(rng, [2, 3, 4, 5, 7, 9, 11, 12, 13, 15])
  const k = B > 10 ? int(rng, 1, 3) : int(rng, 2, 3)
  const b = `(${D(B, 1)})`
  const three = rng() < 0.4
  const pp = three ? int(rng, 2, 20) : 0
  const n = int(rng, 4, 120)
  const m = n + k - pp
  if (m < 2) return decPowerQuotient(rng)
  const expr = three ? `${b}^{${m}} \\cdot ${b}^{${pp}} : ${b}^{${n}}` : `${b}^{${m}} : ${b}^{${n}}`
  const value = D(B ** k, k)
  return {
    text: `Efectuați operațiile, scriind mai întâi rezultatul sub formă de putere: $${expr}$.`,
    solution: lines(
      'La înmulțirea puterilor cu aceeași bază exponenții se adună, iar la împărțire se scad:',
      show(`${expr} = ${b}^{${three ? `${m} + ${pp} - ${n}` : `${m} - ${n}`}} = ${b}^{${k}} = ${value}`),
    ),
    verify: () => m + pp - n === k && close(val(value), (B / 10) ** k),
  }
}

/** The number 0,1 (0,01, 0,001) times smaller, or larger, than X, p. 52, ex. 13. */
export function decTimesSmaller(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 0, 3)
    const n = int(rng, 11, 99999)
    if (p > 0 && n % 10 === 0) continue
    const smaller = rng() < 0.6
    const x = D(n, p)
    const res = [1, 2, 3].map((k) => (smaller ? D(n * p10(k), p) : D(n, p + k)))
    const fs = ['0{,}1', '0{,}01', '0{,}001']
    return {
      text: `Calculați numărul de $0{,}1$, de $0{,}01$ și de $0{,}001$ ori mai ${smaller ? 'mic' : 'mare'} decât $${x}$.`,
      solution: lines(
        smaller
          ? `Un număr de $0{,}1$ ori mai mic se obține prin împărțirea la $0{,}1$, adică prin înmulțirea cu 10 (la fel, $: 0{,}01$ înseamnă $\\cdot 100$, iar $: 0{,}001$ înseamnă $\\cdot 1000$):`
          : `Un număr de $0{,}1$ ori mai mare se obține prin înmulțirea cu $0{,}1$, adică prin împărțirea la 10 (la fel, $\\cdot 0{,}01$ înseamnă $: 100$, iar $\\cdot 0{,}001$ înseamnă $: 1000$):`,
        show(fs.map((f, i) => `${x} ${smaller ? ':' : '\\cdot'} ${f} = ${res[i]}`).join(', \\quad ')),
      ),
      verify: () => [1, 2, 3].every((k, i) => close(val(res[i]), (n / p10(p)) * (smaller ? p10(k) : 1 / p10(k)))),
    }
  }
}

/** a : b with b a decimal: both multiplied by 10^k, then the check, p. 51, ex. 4 and 5. */
export function decDivByDecimal(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 1, 2)
    const B = int(rng, 11, k === 1 ? 99 : 499)
    const Q = int(rng, 101, 9999)
    if (B % 10 === 0 || Q % 10 === 0) continue
    const a = D(Q * B, k + 2)
    const b = D(B, k)
    const q = D(Q, 2)
    return {
      text: `Efectuați împărțirea $${a} : ${b}$ și faceți proba.`,
      solution: lines(
        `Înmulțim deîmpărțitul și împărțitorul cu ${p10(k)} (mutăm virgula cu ${k === 1 ? 'o cifră' : 'două cifre'} spre dreapta), ca împărțitorul să devină număr natural; câtul nu se schimbă:`,
        show(`${a} : ${b} = ${D(Q * B, 2)} : ${B} = ${q}`),
        'Proba:',
        show(`${q} \\cdot ${b} = ${a}`),
      ),
      verify: () => close(val(a) / val(b), val(q)),
    }
  }
}

/** a : b to three decimals, then approximated to hundredths by lack and by excess, p. 52, ex. 11. */
export function decApproxHundredths(rng: Rng): Made {
  for (;;) {
    const pa = int(rng, 0, 2)
    const pb = int(rng, 0, 2)
    const A = int(rng, 10, 9999)
    const B = int(rng, 3, pb === 0 ? 60 : 999)
    if ((pa && A % 10 === 0) || (pb && B % 10 === 0)) continue
    const num = A * p10(pb)
    const den = B * p10(pa)
    if ((num * 100) % den === 0 || num / den < 0.5 || num / den > 500) continue
    const t = Math.floor((num * 1000) / den)
    const h = Math.floor((num * 100) / den)
    const a = D(A, pa)
    const b = D(B, pb)
    return {
      text: `Calculați câtul $${a} : ${b}$ și aproximați-l prin lipsă și prin adaos la sutimi.`,
      solution: lines(
        pb ? `Mutăm virgula la ambele numere cu ${pb === 1 ? 'o cifră' : 'două cifre'} spre dreapta, apoi calculăm câtul cu trei zecimale:` : 'Calculăm câtul cu trei zecimale:',
        show(`${a} : ${b} = ${pb ? `${D(A * p10(pb), pa)} : ${B} = ` : ''}${DK(t, 3)}\\ldots`),
        `Aproximarea prin lipsă la sutimi este $${DK(h, 2)}$, iar aproximarea prin adaos la sutimi este $${DK(h + 1, 2)}$.`,
      ),
      verify: () => val(DK(h, 2)) < val(a) / val(b) && val(a) / val(b) < val(DK(h + 1, 2)) && val(DK(h + 1, 2)) - val(DK(h, 2)) < 0.0100001,
    }
  }
}

/** x^m : y^m = (x : y)^m, with x a multiple or the square of y, p. 52, ex. 10. */
export function decSameExponent(rng: Rng): Made {
  for (;;) {
    const Y = int(rng, 11, 25)
    if (Y % 10 === 0) continue
    const square = rng() < 0.5
    const k = int(rng, 2, 5)
    const m = int(rng, 2, square ? 5 : 4)
    const x = square ? D(Y * Y, 2) : D(Y * k, 1)
    const y = D(Y, 1)
    const r = square ? y : String(k)
    const value = square ? D(Y ** m, m) : nr(k ** m)
    return {
      text: `Aplicând regula $x^m : y^m = (x : y)^m$, calculați $(${x})^{${m}} : (${y})^{${m}}$.`,
      solution: lines(
        `Împărțim întâi bazele, apoi ridicăm câtul la puterea ${m}:`,
        show(`(${x})^{${m}} : (${y})^{${m}} = (${x} : ${y})^{${m}} = ${square ? `(${r})` : r}^{${m}} = ${value}`),
      ),
      verify: () => close(val(x) / val(y), val(r)) && close(val(value.replace(/\\,/g, '')), (val(x) / val(y)) ** m),
    }
  }
}

const CRATES = ['pere', 'mere', 'cartofi', 'roșii', 'struguri', 'gutui']
/** N crates weigh W kg: how much do n crates weigh; a factory works T tonnes in D days: how much in d days, p. 52, ex. 15. */
export function decProportional(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const N = pick(rng, [10, 100])
      const p = N === 10 ? 1 : 2
      const W = int(rng, N === 10 ? 150 : 1200, N === 10 ? 999 : 4999)
      const n = int(rng, 3, 99)
      if (W % 10 === 0 || n === N) continue
      const f = pick(rng, CRATES)
      const one = D(W, p)
      const all = D(W * n, p)
      return {
        text: `Știind că ${de(N)} lăzi cu ${f} cântăresc ${nr(W) === String(W) ? W : `$${nr(W)}$`} kg, cât vor cântări ${de(n)} lăzi cu ${f}?`,
        solution: lines(
          'Aflăm întâi cât cântărește o ladă, apoi cât cântăresc lăzile cerute:',
          show(`${nr(W)} : ${N} = ${one}\\text{ kg}, \\qquad ${one} \\cdot ${n} = ${all}\\text{ kg}`),
        ),
        verify: () => close(val(all), (W / N) * n),
      }
    }
    const Dd = pick(rng, [10, 5, 4, 8, 20])
    const T = int(rng, 501, 3999)
    const d = int(rng, 2, 15)
    if (T % 10 === 0 || d === Dd || (T * d * 100) % Dd !== 0) continue
    const one = (T * 100) / Dd
    if (!Number.isInteger(one)) continue
    const all = one * d
    return {
      text: `O fabrică prelucrează în ${de(Dd)} zile $${D(T, 1)}$ tone de materie primă. Câte tone de materie primă va prelucra fabrica în ${de(d)} zile, lucrând în același ritm?`,
      solution: lines(
        'Aflăm întâi cât prelucrează fabrica într-o zi:',
        show(`${D(T, 1)} : ${Dd} = ${D(one, 3)}\\text{ t}, \\qquad ${D(one, 3)} \\cdot ${d} = ${D(all, 3)}\\text{ t}`),
      ),
      verify: () => close(val(D(all, 3)), (T / 10 / Dd) * d),
    }
  }
}

/** a : b approximated by lack to a unit, to 0,1 and to 0,01, each with its remainder, p. 52, ex. 12. */
export function decApproxRemainders(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 10001, 99999)
    const B = int(rng, 101, 999)
    if (A % 10 === 0 || B % 10 === 0 || A < 30 * B) continue
    const a = D(A, 3)
    const b = D(B, 2)
    const rows = [0, 1, 2].map((k) => {
      const Q = Math.floor((A * p10(k)) / (10 * B))
      const R = A * 100 - Q * B * p10(3 - k)
      return { k, q: D(Q, k), r: D(R, 5), R }
    })
    const name = ['cu o unitate', 'cu $0{,}1$', 'cu $0{,}01$']
    return {
      text: `Împărțiți numărul $${a}$ la $${b}$. Aproximați câtul prin lipsă ${name[0]}, ${name[1]} și ${name[2]} și determinați de fiecare dată restul. Faceți proba.`,
      solution: lines(
        `Înmulțim cu 100 ambele numere: $${a} : ${b} = ${D(A, 1)} : ${B}$. Câtul aproximat prin lipsă se înmulțește cu împărțitorul, iar restul este ce rămâne până la deîmpărțit:`,
        rows.map((w) => `Prin lipsă ${name[w.k]}: câtul $${w.q}$, restul $${w.r}$.`).join('\n'),
        'Proba:',
        show(rows.map((w) => `${b} \\cdot ${w.q} + ${w.r} = ${a}`).join(' \\\\ ')),
      ),
      verify: () => rows.every((w) => close(val(b) * val(w.q) + val(w.r), val(a)) && w.R >= 0 && val(w.r) < val(b) / p10(w.k)),
    }
  }
}

/** A rectangle with the length L and the width k times smaller: perimeter and area, p. 52, ex. 16. */
export function decRectangle(rng: Rng): Made {
  for (;;) {
    const W = int(rng, 101, 4999)
    const k = int(rng, 2, 5)
    if (W % 10 === 0) continue
    const L = W * k
    const P = 2 * (L + W)
    const Ar = L * W
    return {
      text: `Un dreptunghi are lungimea de $${D(L, 2)}$ m. Lățimea dreptunghiului este de ${k} ori mai mică. Calculați perimetrul și aria dreptunghiului.`,
      solution: lines(
        show(`\\ell = ${D(L, 2)} : ${k} = ${D(W, 2)}\\text{ m}`),
        show(`P = 2 \\cdot (${D(L, 2)} + ${D(W, 2)}) = 2 \\cdot ${D(L + W, 2)} = ${D(P, 2)}\\text{ m}`),
        show(`\\mathcal{A} = L \\cdot \\ell = ${D(L, 2)} \\cdot ${D(W, 2)} = ${D(Ar, 4)}\\text{ m}^2`),
      ),
      verify: () => close(val(D(P, 2)), 2 * (val(D(L, 2)) + val(D(L, 2)) / k)) && close(val(D(Ar, 4)), (val(D(L, 2)) ** 2) / k),
    }
  }
}

/** a · b : c, approximated to hundredths by lack and by excess, p. 52, ex. 14. */
export function decApproxExpression(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 101, 9999)
    const B = int(rng, 2, 99)
    const pc = int(rng, 1, 2)
    const C = int(rng, 2, pc === 1 ? 99 : 999)
    if (A % 10 === 0 || B % 10 === 0 || C % 10 === 0) continue
    const num = A * B * p10(pc)
    const den = 1000 * C
    if ((num * 100) % den === 0 || num / den < 1 || num / den > 999) continue
    const h = Math.floor((num * 100) / den)
    const t = Math.floor((num * 1000) / den)
    const a = D(A, 2)
    const b = D(B, 1)
    const c = D(C, pc)
    return {
      text: `Scrieți aproximările prin lipsă și prin adaos la sutimi ale rezultatului operațiilor $${a} \\cdot ${b} : ${c}$.`,
      solution: lines(
        'Efectuăm operațiile în ordine, de la stânga la dreapta; câtul îl calculăm cu trei zecimale:',
        show(`${a} \\cdot ${b} = ${D(A * B, 3)}, \\qquad ${D(A * B, 3)} : ${c} = ${DK(t, 3)}\\ldots`),
        `Prin lipsă la sutimi: $${DK(h, 2)}$; prin adaos la sutimi: $${DK(h + 1, 2)}$.`,
      ),
      verify: () => {
        const v = (val(a) * val(b)) / val(c)
        return val(DK(h, 2)) < v && v < val(DK(h + 1, 2))
      },
    }
  }
}

const GOODS = ['legume', 'fructe', 'cartofi', 'mere', 'brânză']
/** The price of one kilogram from the quantity and the sum paid; the daily distance of a traveller, p. 53, ex. 17 and 18. */
export function decUnitPrice(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.6) {
      const Q = int(rng, 251, 2999)
      const P = int(rng, 24, 198) * 5
      if (Q % 10 === 0 || (Q * P) % 100 !== 0) continue
      const T = (Q * P) / 100
      const g = pick(rng, GOODS)
      const who = pick(rng, ['O gospodină', 'Bunica', 'Mama lui ' + pick(rng, BOYS), 'Un bucătar'])
      return {
        text: `${who} a cumpărat $${D(Q, 2)}$ kg de ${g}, pentru care a plătit $${money(T)}$ lei. Aflați cât a costat un kilogram de ${g}.`,
        solution: lines(
          'Împărțim suma plătită la numărul de kilograme; înmulțim întâi ambele numere cu 100, ca împărțitorul să devină natural:',
          show(`${money(T)} : ${D(Q, 2)} = ${D(T * 100, 2)} : ${nr(Q)} = ${DK(P, 2)}\\text{ lei}`),
        ),
        verify: () => close(val(money(T)) / val(D(Q, 2)), P / 100),
      }
    }
    const n = int(rng, 3, 7)
    const d = int(rng, 1001, 4999)
    if (d % 10 === 0) continue
    return {
      text: `Un călător parcurge în ${n} zile $${D(d * n, 2)}$ km. Dacă în fiecare zi distanța parcursă este aceeași, aflați câți kilometri parcurge pe zi călătorul.`,
      solution: show(`${D(d * n, 2)} : ${n} = ${D(d, 2)}\\text{ km}`),
      verify: () => close(val(D(d * n, 2)) / n, d / 100),
    }
  }
}

// ================= periodic decimals and ordinary fractions (pp. 55–56) =================

const FINITE_DEN = [2, 4, 5, 8, 16, 20, 25, 40, 50, 80, 125, 200, 250]
const SIMPLE_DEN = [3, 7, 9, 11, 27, 33, 37, 99]
const MIXED_DEN = [6, 12, 15, 18, 22, 24, 30, 36, 45, 60, 66, 75]
/** An irreducible fraction p/q, not whole, with p < 4q. */
const fracOver = (rng: Rng, q: number) => {
  for (;;) {
    const p = int(rng, 1, 4 * q)
    if (gcd(p, q) === 1 && p % q !== 0) return p
  }
}

/** a/b with the denominator 2^i·5^j, as a finite decimal, p. 55, ex. 1. */
export function perFracToFinite(rng: Rng): Made {
  const q = pick(rng, FINITE_DEN)
  const p = fracOver(rng, q)
  let k = 1
  while (p10(k) % q !== 0) k++
  const m = p10(k) / q
  const r = D(p * m, k)
  return {
    text: `Transformați fracția ordinară $\\frac{${p}}{${q}}$ în fracție zecimală.`,
    solution: lines(
      `Numitorul ${q} are ca factori primi doar pe 2 și pe 5, deci fracția se poate amplifica${m > 1 ? ` cu ${m}` : ''} până la numitorul ${p10(k)}:`,
      show(`\\frac{${p}}{${q}} = \\frac{${nr(p * m)}}{${nr(p10(k))}} = ${r}`),
    ),
    verify: () => close(val(r), p / q),
  }
}

/** a/b as a simple or mixed periodic decimal, by division, p. 55, ex. 2 and 3. */
export function perFracToPeriodic(rng: Rng): Made {
  const q = pick(rng, [...SIMPLE_DEN.filter((d) => d < 50), ...MIXED_DEN])
  const p = fracOver(rng, q)
  const e = expand(p, q)
  const simple = !e.pre
  return {
    text: `Transformați fracția ordinară $\\frac{${p}}{${q}}$ în fracție zecimală periodică.`,
    solution: lines(
      `Împărțim ${p} la ${q}; după un timp resturile se repetă, deci se repetă și cifrele câtului.`,
      show(`\\frac{${p}}{${q}} = ${p} : ${q} = ${decTex(e)}`),
      simple
        ? `Numitorul nu se divide cu 2 și nici cu 5, deci obținem o fracție zecimală periodică simplă, cu perioada ${e.rep}.`
        : `Numitorul se divide cu 2 sau cu 5 și are și alți factori primi, deci obținem o fracție zecimală periodică mixtă, cu partea neperiodică ${e.pre} și perioada ${e.rep}.`,
    ),
    verify: () => {
      const [a, b] = fromPeriodic(e.whole, e.pre, e.rep)
      const [c, d] = reduce(p, q)
      return a === c && b === d && e.rep !== '' && simple === (q % 2 !== 0 && q % 5 !== 0)
    },
  }
}

/** A finite decimal as an irreducible ordinary fraction, p. 55, ex. 4. */
export function perFiniteToFrac(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 1, 4)
    const n = int(rng, 3, k === 4 ? 99999 : 9999)
    if (n % 10 === 0) continue
    const [a, b] = reduce(n, p10(k))
    const x = D(n, k)
    return {
      text: `Transformați fracția zecimală $${x}$ în fracție ordinară ireductibilă.`,
      solution: lines(
        `Numărătorul este numărul fără virgulă, iar numitorul este 1 urmat de atâtea zerouri câte zecimale are numărul (${k}); apoi simplificăm${a !== n ? ` cu ${n / a}` : ''}:`,
        show(`${x} = \\frac{${nr(n)}}{${nr(p10(k))}}${a !== n ? ` = \\frac{${nr(a)}}{${nr(b)}}` : ''}`),
      ),
      verify: () => close(a / b, val(x)) && gcd(a, b) === 1,
    }
  }
}

/** 432,745 = 4·100 + 3·10 + 2 + 7/10 + 4/100 + 5/1000, p. 55, ex. 7. */
export function perDecompose(rng: Rng): Made {
  for (;;) {
    const w = int(rng, 100, 9999)
    const k = int(rng, 2, 3)
    const f = digits(rng, k)
    if (f.endsWith('0')) continue
    const x = `${nr(w)}{,}${f}`
    const ws = String(w)
    const terms: string[] = []
    ws.split('').forEach((c, i) => {
      const e = ws.length - 1 - i
      if (c === '0') return
      terms.push(e === 0 ? c : `${c} \\cdot ${nr(p10(e))}`)
    })
    f.split('').forEach((c, i) => {
      if (c !== '0') terms.push(`\\frac{${c}}{${nr(p10(i + 1))}}`)
    })
    const total = sum(ws.split('').map((c, i) => Number(c) * p10(ws.length - 1 - i))) + sum(f.split('').map((c, i) => Number(c) / p10(i + 1)))
    return {
      text: `Scrieți numărul $${x}$ ca sumă de produse dintre cifrele sale și puteri ale lui 10, după modelul $23{,}4 = 2 \\cdot 10 + 3 + \\frac{4}{10}$.`,
      solution: lines('Fiecare cifră se înmulțește cu valoarea locului ei: mii, sute, zeci, unități, zecimi, sutimi, miimi.', show(`${x} = ${terms.join(' + ')}`)),
      verify: () => close(total, val(x)),
    }
  }
}

/** A periodic decimal (simple or mixed) as an ordinary fraction, p. 55, ex. 5 and 6. */
export function perToFraction(rng: Rng): Made {
  const preLen = int(rng, 0, 2)
  const e = randomPeriodic(rng, 0, 12, preLen, preLen === 2 ? 1 : int(rng, 1, 2))
  const x = decTex(e)
  const m = e.pre.length
  const n = e.rep.length
  const top = Number(e.pre + e.rep) - Number(e.pre || '0')
  const den = (p10(n) - 1) * p10(m)
  const [a, b] = reduce(top, den)
  const [tot, totD] = reduce(e.whole * b + a, b)
  const nines = '9'.repeat(n) + '0'.repeat(m)
  const head = e.whole ? `${e.whole}` : ''
  const step1 = m ? `${head}\\frac{${e.pre}${e.rep} - ${e.pre}}{${nines}}` : `${head}\\frac{${e.rep}}{${nines}}`
  const step2 = a !== top ? ` = ${head}\\frac{${a}}{${b}}` : ''
  return {
    text: `Transformați fracția zecimală periodică $${x}$ în fracție ordinară.`,
    solution: lines(
      m
        ? `Fracția este periodică mixtă: la numărător scriem numărul format din partea neperiodică și perioadă, minus partea neperiodică, iar la numitor atâția de 9 câte cifre are perioada, urmați de atâtea zerouri câte cifre are partea neperiodică:`
        : 'Fracția este periodică simplă: la numărător scriem perioada, iar la numitor atâția de 9 câte cifre are perioada:',
      show(`${x} = ${step1}${m ? ` = ${head}\\frac{${top}}{${nines}}` : ''}${step2}${e.whole ? ` = ${frac(tot, totD)}` : ''}`),
    ),
    verify: () => {
      const back = expand(tot, totD)
      return decTex(back) === x
    },
  }
}

/** Which of six fractions give finite, simple periodic and mixed periodic decimals, without dividing, p. 56, ex. 9. */
export function perClassify(rng: Rng): Made {
  const pools = [FINITE_DEN, SIMPLE_DEN, MIXED_DEN]
  const fr: [number, number][] = []
  for (const pool of pools) {
    const qs = shuffle(rng, pool).slice(0, 2)
    for (const q of qs) fr.push([fracOver(rng, q), q])
  }
  const all = shuffle(rng, fr)
  const kindOf = (q: number) => (q % 2 !== 0 && q % 5 !== 0 ? 1 : 1000000 % q === 0 ? 0 : 2)
  const tex = ([p, q]: [number, number]) => `\\frac{${p}}{${q}}`
  const group = (k: number) => all.filter(([, q]) => kindOf(q) === k).map(tex)
  return {
    text: `Se consideră fracțiile ordinare $${all.map(tex).join(', \\; ')}$. Fără să le transformați în fracții zecimale, stabiliți care dintre ele se scriu ca: a) fracții zecimale finite; b) fracții zecimale periodice simple; c) fracții zecimale periodice mixte.`,
    solution: lines(
      'Fracțiile sunt ireductibile, așa că ne uităm doar la factorii primi ai numitorului: numai 2 și 5 dau o fracție finită; fără 2 și fără 5, una periodică simplă; 2 sau 5 împreună cu alți factori, una periodică mixtă.',
      `a) $${group(0).join(', \\; ')}$; b) $${group(1).join(', \\; ')}$; c) $${group(2).join(', \\; ')}$.`,
    ),
    verify: () =>
      all.every(([p, q]) => {
        const e = expand(p, q)
        const k = e.rep === '' ? 0 : e.pre === '' ? 1 : 2
        return k === kindOf(q)
      }),
  }
}

/** The k-th and the K-th decimal of a,b(cde), p. 56, ex. 12 and p. 63, Testul 3, II.2. */
export function perNthDecimal(rng: Rng): Made {
  const e = randomPeriodic(rng, 1, 9, int(rng, 0, 2), int(rng, 2, 4))
  const k1 = int(rng, 8, 15)
  const k2 = int(rng, 2000, 2099)
  const m = e.pre.length
  const L = e.rep.length
  const at = (k: number) => (k <= m ? e.pre[k - 1] : e.rep[(k - m - 1) % L])
  const why = (k: number) => {
    if (k <= m) return `a ${k}-a zecimală face parte din partea neperiodică: ${at(k)}`
    const r = (k - m) % L
    return `$${k}${m ? ` - ${m}` : ''} = ${L} \\cdot ${Math.floor((k - m) / L)} + ${r}$, deci a ${k}-a zecimală este ${r === 0 ? 'ultima cifră a perioadei' : r === 1 ? 'prima cifră a perioadei' : `a ${r}-a cifră a perioadei`}: ${at(k)}`
  }
  return {
    text: `Se consideră fracția zecimală $${decTex(e)}$. Care este a ${k1}-a zecimală a ei? Dar a ${k2}-a zecimală?`,
    solution: lines(
      m ? `${m === 1 ? 'Prima zecimală este neperiodică' : `Primele ${m} zecimale sunt neperiodice`}; apoi perioada ${e.rep}, de ${L} cifre, se repetă.` : `Perioada ${e.rep}, de ${L} cifre, se repetă de la prima zecimală.`,
      `Pentru a ${k1}-a zecimală: ${why(k1)}.`,
      `Pentru a ${k2}-a zecimală: ${why(k2)}.`,
    ),
    verify: () => {
      let s = e.pre
      while (s.length < k2) s += e.rep
      return s[k1 - 1] === at(k1) && s[k2 - 1] === at(k2)
    },
  }
}

/** 5·10³ + 7·10² + 10 + 2·1/10 + 3·1/10² + 11·1/10³ as a decimal, p. 56, ex. 8. */
export function perCompose(rng: Rng): Made {
  for (;;) {
    const exps = [3, 2, 1, 0, -1, -2, -3, -4].filter((x) => x >= -int(rng, 2, 4) && x <= int(rng, 1, 3))
    const coef = exps.map(() => (rng() < 0.25 ? 0 : int(rng, 1, 9)))
    if (rng() < 0.5) coef[coef.length - 1 - int(rng, 0, 1)] = int(rng, 10, 15)
    if (coef[0] === 0 || coef[coef.length - 1] === 0) continue
    const terms = exps.map((x, i) => {
      if (coef[i] === 0) return ''
      const c = coef[i]
      if (x === 0) return String(c)
      if (x > 0) return `${c} \\cdot 10${x > 1 ? `^${x}` : ''}`
      return `${c} \\cdot \\frac{1}{10${x < -1 ? `^${-x}` : ''}}`
    }).filter(Boolean)
    const low = Math.min(...exps)
    const total = sum(exps.map((x, i) => coef[i] * p10(x - low)))
    const r = D(total, -low)
    const parts = exps.map((x, i) => (coef[i] === 0 ? '' : D(coef[i] * p10(Math.max(x, 0)), Math.max(-x, 0)))).filter(Boolean)
    return {
      text: `Scrieți sub formă de fracție zecimală: $${terms.join(' + ')}$.`,
      solution: lines('Calculăm fiecare termen ($\\frac{1}{10} = 0{,}1$, $\\frac{1}{10^2} = 0{,}01$, …), apoi adunăm:', show(`${parts.join(' + ')} = ${r}`)),
      verify: () => close(val(r), sum(exps.map((x, i) => coef[i] * 10 ** x))),
    }
  }
}

/** The sum of the first n decimals of a,b(cd), p. 62, Testul 2, II.2. */
export function perSumOfDecimals(rng: Rng): Made {
  const e = randomPeriodic(rng, 1, 9, int(rng, 0, 2), int(rng, 1, 3))
  const n = pick(rng, [20, 25, 30, 40, 50, 60, 75, 100, 120, 150, 200])
  const m = e.pre.length
  const L = e.rep.length
  const full = Math.floor((n - m) / L)
  const rest = (n - m) % L
  const ds = (s: string) => sum(s.split('').map(Number))
  const S = ds(e.pre) + full * ds(e.rep) + ds(e.rep.slice(0, rest))
  return {
    text: `Se dă fracția zecimală $${decTex(e)}$. Calculați suma primelor ${n} de zecimale ale acesteia.`,
    solution: lines(
      `${m ? `${m === 1 ? `Prima zecimală (${e.pre}) este neperiodică` : `Primele ${m} zecimale (${e.pre.split('').join(', ')}) sunt neperiodice`}; rămân ${de(n - m)} zecimale. ` : ''}Perioada ${e.rep} are ${L} ${L === 1 ? 'cifră' : 'cifre'}, cu suma ${ds(e.rep)}: $${n - m} = ${L} \\cdot ${full} + ${rest}$, deci perioada apare de ${de(full)} ori${rest ? `, apoi încă ${rest === 1 ? 'o cifră' : `${rest} cifre`} (${e.rep.slice(0, rest).split('').join(', ')})` : ''}.`,
      show(`S = ${m ? `${ds(e.pre)} + ` : ''}${full} \\cdot ${ds(e.rep)}${rest ? ` + ${ds(e.rep.slice(0, rest))}` : ''} = ${S}`),
    ),
    verify: () => {
      let s = e.pre
      while (s.length < n) s += e.rep
      return ds(s.slice(0, n)) === S
    },
  }
}

/** The natural n for which two fractions with n represent the same rational number, p. 62, Testul 1, V.1. */
export function perEquivalentN(rng: Rng): Made {
  const t = int(rng, 0, 2)
  let A: string, B: string, n: number, sol: string, ok: () => boolean
  if (t === 0) {
    const q = pick(rng, [2, 3, 4, 5, 6])
    const [p] = [fracOver(rng, q) % q || 1]
    const c = q * int(rng, 2, 6)
    const a = int(rng, 1, 9)
    n = (c * p) / q - a
    if (n < 0 || gcd(p, q) !== 1) return perEquivalentN(rng)
    A = `\\frac{n + ${a}}{${c}}`
    B = `\\frac{${p}}{${q}}`
    sol = show(`\\frac{n + ${a}}{${c}} = \\frac{${p}}{${q}} \\Rightarrow (n + ${a}) \\cdot ${q} = ${c} \\cdot ${p} \\Rightarrow n + ${a} = ${(c * p) / q} \\Rightarrow n = ${n}`)
    ok = () => (n + a) * q === c * p
  } else if (t === 1) {
    n = int(rng, 3, 30)
    const divs: number[] = []
    for (let d = 2; d < n; d++) if ((n * n) % d === 0) divs.push(d)
    if (!divs.length) return perEquivalentN(rng)
    const a = pick(rng, divs)
    const b = (n * n) / a
    A = `\\frac{n}{${a}}`
    B = `\\frac{${b}}{n}`
    sol = show(`\\frac{n}{${a}} = \\frac{${b}}{n} \\Rightarrow n \\cdot n = ${a} \\cdot ${b} \\Rightarrow n^2 = ${n * n} = ${n}^2 \\Rightarrow n = ${n}`)
    ok = () => n * n === a * b
  } else {
    const q = int(rng, 2, 9)
    const p = int(rng, 1, 3 * q)
    if (gcd(p, q) !== 1) return perEquivalentN(rng)
    const k = int(rng, 2, 7)
    const s = int(rng, 1, 20)
    n = q * k - s
    if (n < 0) return perEquivalentN(rng)
    A = `\\frac{${p}}{${q}}`
    B = `\\frac{${p * k}}{n + ${s}}`
    sol = show(`\\frac{${p}}{${q}} = \\frac{${p * k}}{n + ${s}} \\Rightarrow ${p} \\cdot (n + ${s}) = ${q} \\cdot ${p * k} \\Rightarrow n + ${s} = ${q * k} \\Rightarrow n = ${n}`)
    ok = () => p * (n + s) === q * p * k
  }
  return {
    text: `Determinați numărul natural $n$ pentru care fracțiile $${A}$ și $${B}$ reprezintă același număr rațional.`,
    solution: lines('Două fracții reprezintă același număr rațional dacă sunt echivalente, adică produsele „în cruce” sunt egale:', sol),
    verify: ok,
  }
}

/** The mean of a,(b) and x is c,(d): x, p. 63, Testul 3, II.3. */
export function perMeanPeriodic(rng: Rng): Made {
  for (;;) {
    const [a, b, c, d] = [int(rng, 1, 9), int(rng, 1, 8), int(rng, 1, 9), int(rng, 1, 8)]
    const xs = 2 * (9 * c + d) - (9 * a + b)
    if (xs <= 0 || xs % 9 === 0 || b === d) continue
    const u = `${a}{,}(${b})`
    const m = `${c}{,}(${d})`
    return {
      text: `Media aritmetică a numerelor $${u}$ și $x$ este egală cu $${m}$. Aflați numărul $x$.`,
      solution: lines(
        'Suma celor două numere este dublul mediei. Transformăm fracțiile periodice în fracții ordinare:',
        show(`${u} = ${a}\\frac{${b}}{9} = \\frac{${9 * a + b}}{9}, \\qquad ${m} = ${c}\\frac{${d}}{9} = \\frac{${9 * c + d}}{9}`),
        show(`x = 2 \\cdot \\frac{${9 * c + d}}{9} - \\frac{${9 * a + b}}{9} = \\frac{${2 * (9 * c + d)} - ${9 * a + b}}{9} = ${frac(xs, 9)} = ${rat(xs, 9)}`),
      ),
      verify: () => close((xs / 9 + (9 * a + b) / 9) / 2, (9 * c + d) / 9),
    }
  }
}

/** a,(b) + c,d(e) as an irreducible fraction and as a decimal. */
export function perSumTwo(rng: Rng): Made {
  for (;;) {
    const e1 = randomPeriodic(rng, 0, 9, 0, int(rng, 1, 2))
    const e2 = randomPeriodic(rng, 0, 9, 1, 1)
    const [p1, q1] = fromPeriodic(e1.whole, e1.pre, e1.rep)
    const [p2, q2] = fromPeriodic(e2.whole, e2.pre, e2.rep)
    const [p, q] = reduce(p1 * q2 + p2 * q1, q1 * q2)
    if (q === 1) continue
    const x1 = decTex(e1)
    const x2 = decTex(e2)
    return {
      text: `Calculați $${x1} + ${x2}$ și scrieți rezultatul ca fracție ordinară ireductibilă și ca fracție zecimală.`,
      solution: lines(
        'Transformăm fiecare fracție periodică în fracție ordinară, apoi adunăm:',
        show(`${x1} = ${frac(p1, q1)}, \\qquad ${x2} = ${frac(p2, q2)}`),
        show(`${frac(p1, q1)} + ${frac(p2, q2)} = ${frac(p, q)} = ${rat(p, q)}`),
      ),
      verify: () => {
        const back = expand(p, q)
        const [a, b] = fromPeriodic(back.whole, back.pre, back.rep)
        // the sum of the two decimals read digit by digit, to 12 places
        const digitsOf = (e: Expansion) => {
          let s = e.pre
          while (s.length < 14) s += e.rep
          return e.whole + Number('0.' + s.slice(0, 12))
        }
        return a === p && b === q && Math.abs(digitsOf(e1) + digitsOf(e2) - p / q) < 1e-9
      },
    }
  }
}

// ================= the order of operations with decimals (pp. 59–66) =================

/** a · 10^k ± b · c, p. 59, ex. 2 and p. 60, ex. 4. */
export function opsPow10Product(rng: Rng): Made {
  for (;;) {
    const pa = int(rng, 2, 3)
    const A = int(rng, 11, 9999)
    const k = int(rng, 1, 3)
    const pb = int(rng, 1, 2)
    const B = int(rng, 11, 999)
    const c = int(rng, 2, 9)
    if (A % 10 === 0 || B % 10 === 0) continue
    const X = A * p10(4 - pa + k)
    const Y = B * c * p10(4 - pb)
    const plus = rng() < 0.5
    if (!plus && X <= Y) continue
    const R = plus ? X + Y : X - Y
    const ten = k === 1 ? '10' : pick(rng, [nr(p10(k)), `10^${k}`])
    const expr = `${D(A, pa)} \\cdot ${ten} ${plus ? '+' : '-'} ${D(B, pb)} \\cdot ${c}`
    return {
      text: `Calculați, ținând cont de ordinea efectuării operațiilor: $${expr}$.`,
      solution: lines('Întâi înmulțirile, apoi adunarea sau scăderea:', show(`${expr} = ${D(X, 4)} ${plus ? '+' : '-'} ${D(Y, 4)} = ${D(R, 4)}`)),
      verify: () => close(val(D(R, 4)), (A / p10(pa)) * p10(k) + (plus ? 1 : -1) * (B / p10(pb)) * c),
    }
  }
}

/** a : 10^k ± b : 10^m, p. 60, ex. 5. */
export function opsPow10Quotient(rng: Rng): Made {
  for (;;) {
    const pa = int(rng, 0, 2)
    const pb = int(rng, 0, 2)
    const A = int(rng, 11, 99999)
    const B = int(rng, 11, 9999)
    const k = int(rng, 1, 3)
    const m = int(rng, 1, 4)
    if ((pa && A % 10 === 0) || (pb && B % 10 === 0)) continue
    const X = A * p10(8 - pa - k)
    const Y = B * p10(8 - pb - m)
    const plus = rng() < 0.5
    if (!plus && X <= Y) continue
    const R = plus ? X + Y : X - Y
    const t = (j: number) => (j === 1 || rng() < 0.5 ? nr(p10(j)) : `10^${j}`)
    const expr = `${D(A, pa)} : ${t(k)} ${plus ? '+' : '-'} ${D(B, pb)} : ${t(m)}`
    return {
      text: `Efectuați: $${expr}$.`,
      solution: lines('Întâi împărțirile (mutăm virgula spre stânga), apoi adunarea sau scăderea:', show(`${expr} = ${D(X, 8)} ${plus ? '+' : '-'} ${D(Y, 8)} = ${D(R, 8)}`)),
      verify: () => close(val(D(R, 8)), A / p10(pa + k) + (plus ? 1 : -1) * (B / p10(pb + m))),
    }
  }
}

/** f · [a + (b − c) : 0,1], p. 59, ex. 3 a. */
export function opsBracketTenth(rng: Rng): Made {
  for (;;) {
    const [A, B, C] = [int(rng, 1, 999), int(rng, 101, 9999), int(rng, 1, 9999)]
    if (B <= C) continue
    const j = int(rng, 1, 2)
    const f = pick(rng, [10, 100, 2, 5])
    const inner = (B - C) * p10(j)
    const s = A + inner
    const R = s * f
    const by = j === 1 ? '0{,}1' : '0{,}01'
    const expr = `${f} \\cdot [${D(A, 2)} + (${D(B, 2)} - ${D(C, 2)}) : ${by}]`
    return {
      text: `Calculați: $${expr}$.`,
      solution: lines(
        'Întâi paranteza rotundă, apoi împărțirea și adunarea din paranteza dreaptă, la final înmulțirea:',
        show(`${expr} = ${f} \\cdot [${D(A, 2)} + ${D(B - C, 2)} : ${by}] = ${f} \\cdot [${D(A, 2)} + ${D(inner, 2)}] = ${f} \\cdot ${D(s, 2)} = ${D(R, 2)}`),
      ),
      verify: () => close(val(D(R, 2)), f * (A / 100 + (B - C) / 100 / (j === 1 ? 0.1 : 0.01))),
    }
  }
}

/** (a − b) · (c + d), p. 60, ex. 8. */
export function opsBracketProduct(rng: Rng): Made {
  for (;;) {
    const [A, B] = [int(rng, 101, 9999), int(rng, 11, 9999)]
    const [C, Dd] = [int(rng, 1, 199), int(rng, 1, 99)]
    if (A <= B || (A - B) % 10 === 0) continue
    const R = (A - B) * (C + Dd)
    const expr = `(${D(A, 2)} - ${D(B, 2)}) \\cdot (${D(C, 1)} + ${D(Dd, 1)})`
    return {
      text: `Calculați, respectând ordinea efectuării operațiilor: $${expr}$.`,
      solution: lines('Întâi parantezele, apoi înmulțirea:', show(`${expr} = ${D(A - B, 2)} \\cdot ${D(C + Dd, 1)} = ${D(R, 3)}`)),
      verify: () => close(val(D(R, 3)), (A / 100 - B / 100) * (C / 10 + Dd / 10)),
    }
  }
}

/** 1·2 + 2·3 + … compared with 0,1·0,2 + 0,2·0,3 + … and 0,1·2 + 0,2·3 + …, p. 60, ex. 7. */
export function opsCompareSums(rng: Rng): Made {
  const n = int(rng, 3, 7)
  const d = int(rng, 1, 2)
  const ks = Array.from({ length: n }, (_, i) => i + 1)
  const S0 = sum(ks.map((k) => k * (k + d)))
  const types = shuffle(rng, [0, 1, 2, 3]).slice(0, 3).sort()
  const scale = [0, 2, 1, 1]
  const term = (t: number, k: number) => {
    const u = t === 1 || t === 2 ? D(k, 1) : String(k)
    const v = t === 1 || t === 3 ? D(k + d, 1) : String(k + d)
    return `${u} \\cdot ${v}`
  }
  const expr = (t: number) => ks.map((k) => term(t, k)).join(' + ')
  const res = types.map((t) => D(S0, scale[t]))
  const letters = ['a', 'b', 'c']
  return {
    text: lines('Calculați și comparați rezultatele:', ...types.map((t, i) => `${letters[i]}) $${expr(t)}$${i === 2 ? '.' : ';'}`)),
    solution: lines(
      ...types.map((t, i) => show(`${letters[i]})\\; ${expr(t)} = ${res[i]}`)),
      `Factorii au aceleași cifre; fiecare zecimală la un factor face produsul de 10 ori mai mic. ${types.includes(0) ? `Suma cu numere naturale este ${S0}, iar celelalte sunt de 10 sau de 100 de ori mai mici.` : 'De aceea sumele diferă doar prin poziția virgulei.'}`,
    ),
    verify: () => types.every((t, i) => close(val(res[i]), sum(ks.map((k) => val(term(t, k).split(' \\cdot ')[0]) * val(term(t, k).split(' \\cdot ')[1]))))),
  }
}

/** p·x + q·y, with x = a : b + c · 10 and y = (e)² · 10² − f, p. 60, ex. 10. */
export function opsLetters(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 5)
    const Q = int(rng, 1, 19) * 5
    const B = int(rng, 2, 15)
    const t = int(rng, 2, 20)
    const C = int(rng, 1, 99)
    const E = int(rng, 2, 9)
    const f = int(rng, 1, E * E - 1)
    if (B % 10 === 0 || C % 10 === 0) continue
    const a = D(t * B, 1)
    const b = D(B, 1)
    const c = D(C, 2)
    const x10 = 10 * t + C
    const y = E * E - f
    const R = p * x10 * 100 + Q * y * 10
    return {
      text: `Calculați $${p}x + ${D(Q, 2)}y$, unde $x = ${a} : ${b} + ${c} \\cdot 10$ și $y = (${D(E, 1)})^2 \\cdot 10^2 - ${f}$.`,
      solution: lines(
        show(`x = ${a} : ${b} + ${c} \\cdot 10 = ${t} + ${D(C, 1)} = ${D(x10, 1)}`),
        show(`y = ${D(E * E, 2)} \\cdot 100 - ${f} = ${E * E} - ${f} = ${y}`),
        show(`${p}x + ${D(Q, 2)}y = ${p} \\cdot ${D(x10, 1)} + ${D(Q, 2)} \\cdot ${y} = ${D(p * x10, 1)} + ${D(Q * y, 2)} = ${D(R, 3)}`),
      ),
      verify: () => close(val(D(R, 3)), p * (val(a) / val(b) + val(c) * 10) + (Q / 100) * ((E / 10) ** 2 * 100 - f)),
    }
  }
}

/** [factor, decimals] pairs whose product is 1, 0,1 or 0,01. */
const PAIRS: [number, number, number, number][] = [
  [25, 1, 4, 1], [125, 2, 8, 1], [25, 2, 4, 0], [125, 3, 8, 0], [5, 1, 2, 0], [2, 1, 5, 0], [25, 2, 4, 1], [125, 2, 8, 2],
  [5, 1, 2, 1], [25, 1, 4, 2], [125, 3, 8, 2], [25, 2, 4, 2], [75, 2, 4, 0], [15, 1, 2, 0], [35, 1, 2, 1],
]
/** 2,5 · 0,125 · 0,4 · 0,008 · 10 regrouped, p. 63, Testul 2, V.1. */
export function opsFastProduct(rng: Rng): Made {
  const [i, j] = shuffle(rng, PAIRS.map((_, k) => k)).slice(0, 2)
  const extra = pick(rng, [3, 7, 9, 11, 13, 17, 10, 100, 1000])
  const fs: [number, number][] = [[PAIRS[i][0], PAIRS[i][1]], [PAIRS[i][2], PAIRS[i][3]], [PAIRS[j][0], PAIRS[j][1]], [PAIRS[j][2], PAIRS[j][3]]]
  const order = shuffle(rng, [0, 1, 2, 3, 4])
  const tex = (k: number) => (k === 4 ? nr(extra) : D(fs[k][0], fs[k][1]))
  const prod = (a: [number, number], b: [number, number]): [number, number] => [a[0] * b[0], a[1] + b[1]]
  const p1 = prod(fs[0], fs[1])
  const p2 = prod(fs[2], fs[3])
  const all = prod(prod(p1, p2), [extra, 0])
  const R = D(all[0], all[1])
  return {
    text: `Calculați cât mai rapid, folosind proprietățile înmulțirii: $${order.map(tex).join(' \\cdot ')}$.`,
    solution: lines(
      'Înmulțirea este comutativă și asociativă, așa că grupăm factorii care dau un rezultat simplu:',
      show(`(${tex(0)} \\cdot ${tex(1)}) \\cdot (${tex(2)} \\cdot ${tex(3)}) \\cdot ${tex(4)} = ${D(p1[0], p1[1])} \\cdot ${D(p2[0], p2[1])} \\cdot ${nr(extra)} = ${R}`),
    ),
    verify: () => close(val(R), order.map((k) => (k === 4 ? extra : fs[k][0] / p10(fs[k][1]))).reduce((s, x) => s * x, 1)),
  }
}

/** a · b + c : d − e², p. 65, Test de autoevaluare, V. */
export function opsWithSquare(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 2, 99)
    const B = int(rng, 2, 99)
    const [Dn, Dp] = pick(rng, [[5, 1], [2, 1], [25, 2], [4, 1], [15, 1], [25, 1], [12, 1]] as [number, number][])
    const t = int(rng, 2, 40)
    const E = pick(rng, [11, 12, 9, 5, 15, 3, 13, 7])
    if (A % 10 === 0 || B % 10 === 0) continue
    const R = A * B + t * 100 - E * E
    if (R < 0) continue
    const c = D(Dn * t, Dp)
    const expr = `${D(A, 1)} \\cdot ${D(B, 1)} + ${c} : ${D(Dn, Dp)} - ${D(E, 1)}^2`
    return {
      text: `Efectuați calculele: $${expr}$.`,
      solution: lines(
        'Întâi puterea, apoi înmulțirea și împărțirea, la final adunarea și scăderea:',
        show(`${expr} = ${D(A * B, 2)} + ${t} - ${D(E * E, 2)} = ${D(R, 2)}`),
      ),
      verify: () => close(val(D(R, 2)), (A / 10) * (B / 10) + val(c) / (Dn / p10(Dp)) - (E / 10) ** 2),
    }
  }
}

/** x = u : v + w, y = g² + h: x and y, then x² − y² and (x − y)(x + y), p. 60, ex. 15. */
export function opsSquaresIdentity(rng: Rng): Made {
  for (;;) {
    const V = int(rng, 2, 25)
    const s = int(rng, 2, 9)
    const W = int(rng, 1, 99)
    const G = int(rng, 2, 9)
    const H = int(rng, 1, 49)
    if (V % 10 === 0 || W % 10 === 0) continue
    const x = s * 10 + W // tenths
    const y = G * G + H // hundredths
    const X = x * 10 // hundredths
    if (X <= y) continue
    const dif = X * X - y * y // 1e-4
    const u = D(V * s, 1)
    return {
      text: `Se consideră numerele $x = ${u} : ${D(V, 1)} + ${D(W, 1)}$ și $y = (${D(G, 1)})^2 + ${D(H, 2)}$. a) Calculați $x$ și $y$. b) Calculați $x^2 - y^2$ și $(x - y) \\cdot (x + y)$. Ce observați?`,
      solution: lines(
        show(`x = ${s} + ${D(W, 1)} = ${D(x, 1)}, \\qquad y = ${D(G * G, 2)} + ${D(H, 2)} = ${D(y, 2)}`),
        show(`x^2 - y^2 = ${D(X * X, 4)} - ${D(y * y, 4)} = ${D(dif, 4)}`),
        show(`(x - y) \\cdot (x + y) = ${D(X - y, 2)} \\cdot ${D(X + y, 2)} = ${D((X - y) * (X + y), 4)}`),
        'Cele două rezultate sunt egale: $x^2 - y^2 = (x - y)(x + y)$ pentru orice numere $x \\ge y$.',
      ),
      verify: () => close(val(D(dif, 4)), (val(u) / (V / 10) + W / 10) ** 2 - ((G / 10) ** 2 + H / 100) ** 2) && dif === (X - y) * (X + y),
    }
  }
}

/** a + [b − c · (x + d)] = e, or [g + (h + x : k) + m] : 2 = n: x worked backwards, p. 74, Testul 1, IV and p. 77, III. */
export function opsEquation(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const X = int(rng, 1, 99)
      const Cc = int(rng, 11, 39)
      const dd = int(rng, 1, 9)
      if (Cc % 10 === 0 || X % 10 === 0) continue
      const inner = Cc * (X + 10 * dd) // hundredths
      const bH = (Math.ceil(inner / 10) + int(rng, 5, 300)) * 10
      const A = int(rng, 11, 999)
      if (A % 10 === 0) continue
      const eH = A * 10 + bH - inner
      const [a, b, c, e] = [D(A, 1), D(bH, 2), D(Cc, 1), D(eH, 2)]
      return {
        text: `Determinați numărul $x$ din egalitatea: $${a} + [${b} - ${c} \\cdot (x + ${dd})] = ${e}$.`,
        solution: lines(
          'Aflăm pe rând termenii necunoscuți, din exterior spre interior (mersul invers):',
          show(`${b} - ${c} \\cdot (x + ${dd}) = ${e} - ${a} = ${D(bH - inner, 2)}`),
          show(`${c} \\cdot (x + ${dd}) = ${b} - ${D(bH - inner, 2)} = ${D(inner, 2)}`),
          show(`x + ${dd} = ${D(inner, 2)} : ${c} = ${D(X + 10 * dd, 1)} \\Rightarrow x = ${D(X, 1)}`),
        ),
        verify: () => close(val(a) + val(b) - val(c) * (X / 10 + dd), val(e)),
      }
    }
    const k = int(rng, 2, 6)
    const T = int(rng, 2, 99) // x : k in tenths
    const [G, Hh, M] = [int(rng, 1, 99), int(rng, 1, 99), int(rng, 1, 199)]
    if (T % 10 === 0 || G % 10 === 0) continue
    const inside = G + Hh + T + M // tenths
    if (inside % 2 !== 0) continue
    const nT = inside / 2
    const x = D(T * k, 1)
    const [g, h, m, n] = [D(G, 1), D(Hh, 1), D(M, 1), D(nT, 1)]
    return {
      text: `Determinați numărul $x$ din egalitatea: $[${g} + (${h} + x : ${k}) + ${m}] : 2 = ${n}$.`,
      solution: lines(
        'Aflăm pe rând termenii necunoscuți (mersul invers):',
        show(`${g} + (${h} + x : ${k}) + ${m} = ${n} \\cdot 2 = ${D(inside, 1)}`),
        show(`${h} + x : ${k} = ${D(inside, 1)} - ${g} - ${m} = ${D(Hh + T, 1)}`),
        show(`x : ${k} = ${D(Hh + T, 1)} - ${h} = ${D(T, 1)} \\Rightarrow x = ${D(T, 1)} \\cdot ${k} = ${x}`),
      ),
      verify: () => close((val(g) + (val(h) + val(x) / k) + val(m)) / 2, val(n)),
    }
  }
}

/** a : b + c rounded to hundredths, a : b periodic, p. 63, Testul 2, V.2 c. */
export function opsRoundResult(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 11, 999)
    const B = pick(rng, [3, 6, 7, 9, 11, 12, 13, 15])
    const C = int(rng, 1, 999)
    if (A % 10 === 0 || (10 * A) % B === 0) continue
    const num = 10 * A + B * C
    const den = 100 * B
    if ((num * 10) % B === 0) continue
    const h = Math.floor(num / B)
    const third = Math.floor((10 * num) / B) - 10 * h
    const r = h + (third >= 5 ? 1 : 0)
    const [a, c] = [D(A, 1), D(C, 2)]
    return {
      text: `Rotunjiți la sutimi rezultatul calculului: $${a} : ${B} + ${c}$.`,
      solution: lines(
        show(`${a} : ${B} = ${rat(A, 10 * B)}`),
        show(`${a} : ${B} + ${c} = ${rat(num, den)}`),
        `A treia zecimală este ${third}, ${third >= 5 ? 'deci mărim cu 1 cifra sutimilor' : 'deci cifra sutimilor rămâne aceeași'}: rezultatul rotunjit la sutimi este $${DK(r, 2)}$.`,
      ),
      verify: () => Math.abs(val(DK(r, 2)) - (val(a) / B + val(c))) <= 0.005 + 1e-9,
    }
  }
}

/** a − b · (c − d) : e, p. 61, Testul 1, IV.1. */
export function opsLongChain(rng: Rng): Made {
  for (;;) {
    const Bb = pick(rng, [96, 48, 24, 125, 64, 32, 25, 75, 12, 36, 72])
    const C = int(rng, 11, 99) * 100
    const Dd = int(rng, 1, 999)
    const S = C - Dd // thousandths
    const E = int(rng, 2, 40)
    if (S <= 0 || Dd % 10 === 0 || E % 10 === 0) continue
    const P = Bb * S // 1e-5
    if ((P * 10) % E !== 0) continue
    const q = (P * 10) / E // 1e-5
    if (q % 100 !== 0) continue
    const A = Math.ceil(q / 10000) + int(rng, 0, 30) // tenths
    const R = A * 10000 - q // 1e-5
    if (R < 0) continue
    const expr = `${D(A, 1)} - ${D(Bb, 2)} \\cdot (${D(C, 3)} - ${D(Dd, 3)}) : ${D(E, 1)}`
    return {
      text: `Calculați: $${expr}$.`,
      solution: lines(
        'Întâi paranteza, apoi înmulțirea și împărțirea în ordinea în care apar, la final scăderea:',
        show(`${expr} = ${D(A, 1)} - ${D(Bb, 2)} \\cdot ${D(S, 3)} : ${D(E, 1)} = ${D(A, 1)} - ${D(P, 5)} : ${D(E, 1)} = ${D(A, 1)} - ${D(q, 5)} = ${D(R, 5)}`),
      ),
      verify: () => close(val(D(R, 5)), A / 10 - ((Bb / 100) * (C / 1000 - Dd / 1000)) / (E / 10)),
    }
  }
}

// ================= problems with decimals: the arithmetic methods (pp. 71–78) =================

const YIELDS = [
  { from: 'kg de semințe de floarea-soarelui', to: 'litri de ulei', ask: 'câți litri de ulei', unit: 'l' },
  { from: 'litri de lapte', to: 'kg de brânză', ask: 'câte kilograme de brânză', unit: 'kg' },
  { from: 'kg de mere', to: 'litri de suc', ask: 'câți litri de suc', unit: 'l' },
  { from: 'kg de grâu', to: 'kg de făină', ask: 'câte kilograme de făină', unit: 'kg' },
]
/** "20 kg de mere", but "20 de litri de lapte". */
const amount = (n: number, what: string) => (what.startsWith('kg') ? `${n} ${what}` : `${de(n)} ${what}`)
/** From A kg of seeds one gets B litres of oil: how much from C kg, p. 71, ex. 1. */
export function probYield(rng: Rng): Made {
  for (;;) {
    const y = pick(rng, YIELDS)
    const A = pick(rng, [4, 5, 8, 10, 20, 25, 100])
    const B = int(rng, 11, A * 8)
    const C = int(rng, 2, 60)
    if (B % 10 === 0 || C === A || (B * C * 10) % A !== 0) continue
    const one = (B * 100) / A
    if (!Number.isInteger(one)) continue
    const R = (B * C * 10) / A // hundredths
    return {
      text: `Din ${amount(A, y.from)} se obțin $${D(B, 1)}$ ${y.to}. Calculați ${y.ask} se obțin din ${amount(C, y.from)}.`,
      solution: lines(
        'Prin metoda reducerii la unitate, aflăm întâi cât se obține dintr-o unitate:',
        show(`${D(B, 1)} : ${A} = ${D(one, 3)}\\text{ ${y.unit}}, \\qquad ${D(one, 3)} \\cdot ${C} = ${D(R, 2)}\\text{ ${y.unit}}`),
      ),
      verify: () => close(val(D(R, 2)), ((B / 10) * C) / A),
    }
  }
}

/** E euros changed for L lei: how many euros for M lei, p. 71, ex. 3. */
export function probExchange(rng: Rng): Made {
  const R = int(rng, 455, 520)
  const E = int(rng, 50, 400)
  const k = int(rng, 100, 900)
  const name = pick(rng, GIRLS)
  if (k === E) return probExchange(rng)
  return {
    text: `${name} a schimbat la bancă ${E} euro și a primit $${money(E * R)}$ lei. Calculați câți euro poate cumpăra ${name} cu suma de $${money(k * R)}$ lei.`,
    solution: lines(
      'Aflăm întâi câți lei costă un euro, apoi câți euro se pot cumpăra:',
      show(`${money(E * R)} : ${E} = ${DK(R, 2)}\\text{ lei}, \\qquad ${money(k * R)} : ${DK(R, 2)} = ${k}\\text{ euro}`),
    ),
    verify: () => close(val(money(k * R)) / (val(money(E * R)) / E), k),
  }
}

const LIQUIDS = ['apă', 'suc', 'lapte', 'ulei', 'vin']
/** p/q of the liquid taken out, R litres left: how much was there, p. 71, ex. 4. */
export function probPartLeft(rng: Rng): Made {
  for (;;) {
    const q = int(rng, 2, 8)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const u = int(rng, 2, 60)
    const R = (q - p) * u // tenths
    const T = q * u
    const liq = pick(rng, LIQUIDS)
    return {
      text: `Dintr-un vas s-au scos $\\frac{${p}}{${q}}$ din cantitatea de ${liq} și au mai rămas $${D(R, 1)}$ litri. Calculați câți litri de ${liq} erau în vas.`,
      solution: lines(
        `În vas au rămas $1 - \\frac{${p}}{${q}} = \\frac{${q - p}}{${q}}$ din cantitate, adică $${D(R, 1)}$ litri:`,
        show(`${D(R, 1)} : \\frac{${q - p}}{${q}} = ${D(R, 1)} \\cdot \\frac{${q}}{${q - p}} = ${D(T, 1)}\\text{ l}`),
      ),
      verify: () => close((T / 10) * (1 - p / q), R / 10),
    }
  }
}

const FRUITS = ['mere', 'pere', 'prune', 'cireșe', 'caise', 'gutui']
/** Two crates with S kg, the first d kg less (more) than the second, p. 71, ex. 5. */
export function probSumDifference(rng: Rng): Made {
  const a = int(rng, 30, 400) // tenths
  const d = int(rng, 1, 99)
  const b = a + d
  const less = rng() < 0.5
  const fr = pick(rng, FRUITS)
  const [first, second] = less ? [a, b] : [b, a]
  return {
    text: `În două lădițe se află $${D(a + b, 1)}$ kg de ${fr}. În prima lădiță se află cu $${D(d, 1)}$ kg ${less ? 'mai puțin' : 'mai mult'} decât în a doua lădiță. Calculați cantitatea de ${fr} din fiecare lădiță.`,
    solution: lines(
      'Prin metoda figurativă: dacă scădem diferența din sumă, rămân două cantități egale cu cea mai mică.',
      show(`(${D(a + b, 1)} - ${D(d, 1)}) : 2 = ${D(2 * a, 1)} : 2 = ${D(a, 1)}\\text{ kg}, \\qquad ${D(a, 1)} + ${D(d, 1)} = ${D(b, 1)}\\text{ kg}`),
      `În prima lădiță sunt $${D(first, 1)}$ kg, iar în a doua $${D(second, 1)}$ kg.`,
    ),
    verify: () => first + second === a + b && Math.abs(first - second) === d && (less ? first < second : first > second),
  }
}

/** A segment of L cm in two parts, the first p/q of the second, p. 71, ex. 6. */
export function probSegmentParts(rng: Rng): Made {
  for (;;) {
    const q = int(rng, 2, 9)
    const p = int(rng, 1, 2 * q)
    if (gcd(p, q) !== 1 || p === q) continue
    const u = int(rng, 3, 40)
    const L = (p + q) * u
    return {
      text: `Un segment cu lungimea de ${L} cm se împarte în două părți. Calculați lungimea fiecărei părți, știind că lungimea primei părți reprezintă $\\frac{${p}}{${q}}$ din lungimea celei de-a doua părți.`,
      solution: lines(
        `Dacă a doua parte are ${q} părți egale, prima are ${p} astfel de părți; în total ${p + q} părți egale.`,
        show(`${L} : ${p + q} = ${u}\\text{ cm}, \\qquad ${u} \\cdot ${q} = ${u * q}\\text{ cm}, \\qquad ${u} \\cdot ${p} = ${u * p}\\text{ cm}`),
        `Prima parte are ${u * p} cm, iar a doua ${u * q} cm.`,
      ),
      verify: () => u * p + u * q === L && u * p * q === u * q * p,
    }
  }
}

/** I add a, divide by k, add b, multiply by c and get R: the number, backwards, p. 72, ex. 10. */
export function probThinkNumber(rng: Rng): Made {
  for (;;) {
    const X = int(rng, 10, 300) // tenths
    const A = int(rng, 1, 199)
    const k = int(rng, 2, 8)
    const B = int(rng, 1, 99)
    const C = pick(rng, [250, 150, 50, 400, 120, 200, 125, 75])
    const s1 = X + A
    if ((s1 * 10) % k !== 0 || A % 10 === 0) continue
    const s2 = (s1 * 10) / k // hundredths
    const s3 = s2 + B * 10
    const R = s3 * C // 1e-4
    if (R % 100 !== 0) continue
    const [a, b, c, r] = [D(A, 1), D(B, 1), D(C, 2), D(R, 4)]
    return {
      text: `Mă gândesc la un număr. Îl măresc cu $${a}$, apoi îl micșorez de ${k} ori, rezultatul îl măresc cu $${b}$, după care îl măresc de $${c}$ ori și obțin $${r}$. Determinați numărul la care m-am gândit.`,
      solution: lines(
        'Prin metoda mersului invers, facem operațiile inverse, de la sfârșit spre început:',
        show(`${r} : ${c} = ${D(s3, 2)}, \\quad ${D(s3, 2)} - ${b} = ${D(s2, 2)}, \\quad ${D(s2, 2)} \\cdot ${k} = ${D(s1, 1)}, \\quad ${D(s1, 1)} - ${a} = ${D(X, 1)}`),
        `Numărul este $${D(X, 1)}$.`,
      ),
      verify: () => close(((X / 10 + val(a)) / k + val(b)) * val(c), val(r)),
    }
  }
}

/** a kg of cherries and b kg of sour cherries cost T1; 2a kg and c kg cost T2, p. 72, ex. 21. */
export function probComparison(rng: Rng): Made {
  for (;;) {
    const a1 = int(rng, 2, 4)
    const b1 = int(rng, 2, 5)
    const b2 = int(rng, 1, 2 * b1 - 1)
    const P1 = int(rng, 20, 60) * 25
    const P2 = int(rng, 16, 50) * 25
    if (P1 === P2) continue
    const T1 = a1 * P1 + b1 * P2
    const T2 = 2 * a1 * P1 + b2 * P2
    const [x, y] = pick(rng, [['cireșe', 'vișine'], ['mere', 'pere'], ['roșii', 'ardei'], ['prune', 'caise']])
    return {
      text: `${a1} kg de ${x} și ${b1} kg de ${y} costă $${money(T1)}$ lei. ${2 * a1} kg de ${x} și ${b2} kg de ${y} costă $${money(T2)}$ lei. Aflați cât costă un kilogram de ${x} și cât costă un kilogram de ${y}.`,
      solution: lines(
        `Prin metoda comparației: dublăm prima cumpărătură, ca să avem aceeași cantitate de ${x} în ambele.`,
        show(`${2 * a1}\\text{ kg} + ${2 * b1}\\text{ kg} \\ldots ${money(2 * T1)}\\text{ lei}, \\qquad ${2 * a1}\\text{ kg} + ${b2}\\text{ kg} \\ldots ${money(T2)}\\text{ lei}`),
        `Diferența provine din ${2 * b1 - b2 === 1 ? 'cel 1 kg' : `cele ${2 * b1 - b2} kg`} de ${y}:`,
        show(`(${money(2 * T1)} - ${money(T2)}) : ${2 * b1 - b2} = ${money((2 * b1 - b2) * P2)} : ${2 * b1 - b2} = ${money(P2)}\\text{ lei}`),
        show(`(${money(T1)} - ${b1} \\cdot ${money(P2)}) : ${a1} = ${money(a1 * P1)} : ${a1} = ${money(P1)}\\text{ lei}`),
        `Un kilogram de ${x} costă $${money(P1)}$ lei, iar un kilogram de ${y} costă $${money(P2)}$ lei.`,
      ),
      verify: () => close(a1 * val(DK(P1, 2)) + b1 * val(DK(P2, 2)), val(money(T1))) && close(2 * a1 * val(DK(P1, 2)) + b2 * val(DK(P2, 2)), val(money(T2))),
    }
  }
}

/** N tickets at p1 and p2 lei, T lei in all: how many of each, false hypothesis, p. 72, ex. 14 and 16. */
export function probTickets(rng: Rng): Made {
  for (;;) {
    const N = int(rng, 10, 40) * 10
    const P1 = int(rng, 10, 30) * 50
    const P2 = P1 + int(rng, 2, 40) * 50
    const n1 = int(rng, 10, N - 10)
    const T = n1 * P1 + (N - n1) * P2
    const euro = rng() < 0.4
    const cur = euro ? 'euro' : 'lei'
    const place = euro ? 'La un concert' : 'La un cinematograf'
    return {
      text: `${place} s-au vândut ${de(N)} bilete, unele de $${money(P1)}$ ${cur} și altele de $${money(P2)}$ ${cur}. Știind că s-au încasat $${money(T)}$ ${cur}, calculați câte bilete au fost de fiecare fel.`,
      solution: lines(
        `Prin metoda falsei ipoteze: presupunem că toate biletele au fost de $${money(P2)}$ ${cur}.`,
        show(`${N} \\cdot ${money(P2)} = ${money(N * P2)}, \\qquad ${money(N * P2)} - ${money(T)} = ${money(N * P2 - T)}`),
        `Fiecare bilet ieftin a fost socotit cu $${money(P2)} - ${money(P1)} = ${money(P2 - P1)}$ ${cur} în plus:`,
        show(`${money(N * P2 - T)} : ${money(P2 - P1)} = ${n1}, \\qquad ${N} - ${n1} = ${N - n1}`),
        `Au fost ${de(n1)} bilete de $${money(P1)}$ ${cur} și ${de(N - n1)} bilete de $${money(P2)}$ ${cur}.`,
      ),
      verify: () => close(n1 * val(money(P1)) + (N - n1) * val(money(P2)), val(money(T))),
    }
  }
}

/** d1 km in t1 hours: how long for d2 km at the same pace, p. 72, ex. 17. */
export function probPace(rng: Rng): Made {
  for (;;) {
    const V = int(rng, 30, 80) // tenths of km per hour
    const T1 = int(rng, 2, 25)
    const T2 = int(rng, 2, 30)
    if (T1 % 10 === 0 || T1 === T2) continue
    const [d1, d2, t1] = [D(V * T1, 2), D(V * T2, 2), D(T1, 1)]
    const min = T2 * 6
    const hm = min >= 60 ? `${Math.floor(min / 60)} ${Math.floor(min / 60) === 1 ? 'oră' : 'ore'}${min % 60 ? ` și ${de(min % 60)} minute` : ''}` : `${de(min)} minute`
    return {
      text: `${pick(rng, BOYS)} parcurge distanța de $${d1}$ km în $${t1}$ ore. Dacă păstrează același ritm de mers, calculați de cât timp are nevoie pentru a parcurge distanța de $${d2}$ km.`,
      solution: lines(
        'Aflăm întâi câți kilometri parcurge într-o oră, apoi câte ore îi trebuie:',
        show(`${d1} : ${t1} = ${D(V, 1)}\\text{ km}, \\qquad ${d2} : ${D(V, 1)} = ${D(T2, 1)}\\text{ ore}`),
        `$${D(T2, 1)}$ ore $= ${D(T2, 1)} \\cdot 60 = ${min}$ minute, adică ${hm}.`,
      ),
      verify: () => close((val(d2) / val(d1)) * val(t1) * 60, min),
    }
  }
}

/** The sum of two numbers is S; one divided by the other gives the quotient q and the remainder r, p. 72, ex. 18. */
export function probQuotientRemainder(rng: Rng): Made {
  for (;;) {
    const B = int(rng, 201, 3000) // hundredths
    const q = int(rng, 2, 7)
    const r = int(rng, 1, 9)
    if (B % 10 === 0 || r * 100 >= B) continue
    const A = q * B + r * 100
    const S = A + B
    return {
      text: `Suma a două numere este $${D(S, 2)}$. Aflați numerele, știind că, dacă împărțim un număr la celălalt, obținem câtul ${q} și restul ${r}.`,
      solution: lines(
        `Dacă $b$ este împărțitorul, deîmpărțitul este $a = ${q} \\cdot b + ${r}$, iar suma este $a + b = ${q + 1} \\cdot b + ${r}$.`,
        show(`${q + 1} \\cdot b = ${D(S, 2)} - ${r} = ${D(S - r * 100, 2)} \\Rightarrow b = ${D(S - r * 100, 2)} : ${q + 1} = ${D(B, 2)}`),
        show(`a = ${q} \\cdot ${D(B, 2)} + ${r} = ${D(A, 2)}`),
      ),
      verify: () => close(val(D(A, 2)) + val(D(B, 2)), val(D(S, 2))) && close(val(D(A, 2)) - q * val(D(B, 2)), r) && r < B / 100,
    }
  }
}

/** [p, q, how it is written] */
const PARTS: [number, number, string][] = [[1, 3, '0{,}(3)'], [1, 4, '0{,}25'], [2, 5, '0{,}4'], [1, 5, '0{,}2'], [1, 6, '0{,}1(6)'], [2, 3, '0{,}(6)'], [3, 4, '0{,}75'], [3, 5, '0{,}6']]
/** Day 1 f1 of the route, day 2 f2 of the rest, day 3 the rest of R km: the route, p. 73, ex. 23. */
export function probThreeDays(rng: Rng): Made {
  for (;;) {
    const [p1, q1, f1] = pick(rng, PARTS)
    const [p2, q2, f2] = pick(rng, PARTS)
    const u = int(rng, 1, 30)
    const T = q1 * q2 * u // tenths
    const r1 = (T * (q1 - p1)) / q1
    const R = (r1 * (q2 - p2)) / q2
    if (T < 60 || T > 3000) continue
    const name = pick(rng, [...BOYS, ...GIRLS])
    return {
      text: `${name} a parcurs un traseu în trei zile astfel: în prima zi a parcurs $${f1}$ din lungimea traseului, a doua zi a parcurs $${f2}$ din rest, iar a treia zi a parcurs restul, adică $${D(R, 1)}$ km. Calculați lungimea traseului.`,
      solution: lines(
        show(`${f1} = \\frac{${p1}}{${q1}}, \\qquad ${f2} = \\frac{${p2}}{${q2}}`),
        `A treia zi a parcurs $1 - \\frac{${p2}}{${q2}} = \\frac{${q2 - p2}}{${q2}}$ din restul rămas după prima zi:`,
        show(`\\text{restul} = ${D(R, 1)} : \\frac{${q2 - p2}}{${q2}} = ${D(r1, 1)}\\text{ km}`),
        `Restul reprezintă $1 - \\frac{${p1}}{${q1}} = \\frac{${q1 - p1}}{${q1}}$ din traseu:`,
        show(`\\text{traseul} = ${D(r1, 1)} : \\frac{${q1 - p1}}{${q1}} = ${D(T, 1)}\\text{ km}`),
      ),
      verify: () => close((T / 10) * (1 - p1 / q1) * (1 - p2 / q2), R / 10),
    }
  }
}

/** p1% of a + p2% of b = P, p2% of a + p1% of b = Q: a + b, a − b, a and b, p. 73, ex. 25. */
export function probPercentSystem(rng: Rng): Made {
  for (;;) {
    const [p1, p2] = pick(rng, [[25, 50], [20, 40], [10, 30], [30, 50], [20, 30], [10, 40]])
    const A = int(rng, 20, 600) // tenths
    const B = int(rng, 10, A - 1)
    const P = p1 * A + p2 * B // thousandths
    const Q = p2 * A + p1 * B
    if (P % 10 !== 0 || Q % 10 !== 0) continue
    const [Pt, Qt] = [D(P, 3), D(Q, 3)]
    return {
      text: `Suma dintre ${p1}% din numărul $a$ și ${p2}% din numărul $b$ este $${Pt}$. Suma dintre ${p2}% din $a$ și ${p1}% din $b$ este $${Qt}$. Aflați: a) suma numerelor $a$ și $b$; b) diferența numerelor $a$ și $b$; c) numerele $a$ și $b$.`,
      solution: lines(
        `a) Adunând, obținem ${p1 + p2}% din $a$ și ${p1 + p2}% din $b$, adică ${p1 + p2}% din $a + b$:`,
        show(`\\frac{${p1 + p2}}{100} \\cdot (a + b) = ${Pt} + ${Qt} = ${D(P + Q, 3)} \\Rightarrow a + b = ${D(P + Q, 3)} \\cdot 100 : ${p1 + p2} = ${D(A + B, 1)}`),
        `b) Scăzând, obținem ${p2 - p1}% din $a - b$:`,
        show(`\\frac{${p2 - p1}}{100} \\cdot (a - b) = ${Qt} - ${Pt} = ${D(Q - P, 3)} \\Rightarrow a - b = ${D(Q - P, 3)} \\cdot 100 : ${p2 - p1} = ${D(A - B, 1)}`),
        show(`\\text{c) } a = (${D(A + B, 1)} + ${D(A - B, 1)}) : 2 = ${D(A, 1)}, \\qquad b = ${D(A + B, 1)} - ${D(A, 1)} = ${D(B, 1)}`),
      ),
      verify: () => close((p1 / 100) * (A / 10) + (p2 / 100) * (B / 10), val(Pt)) && close((p2 / 100) * (A / 10) + (p1 / 100) * (B / 10), val(Qt)),
    }
  }
}

const POULTRY_PARTS: [number, number, string][] = [[2, 15, '0{,}1(3)'], [1, 3, '0{,}(3)'], [1, 6, '0{,}1(6)'], [2, 3, '0{,}(6)'], [5, 6, '0{,}8(3)'], [4, 15, '0{,}2(6)'], [7, 15, '0{,}4(6)'], [1, 15, '0{,}0(6)']]
/** H hens, d fewer ducks; the hens are 0,1(3) of the chicks: ducks, chicks, all the birds, p. 74, Testul 1, V.1. */
export function probFarm(rng: Rng): Made {
  for (;;) {
    const [p, q, f] = pick(rng, POULTRY_PARTS)
    const H = p * int(rng, 10, 300 / p)
    const d = int(rng, 1, H - 10)
    if (H < 40 || H > 900 || d % 5 !== 0) continue
    const ducks = H - d
    const chicks = (H * q) / p
    return {
      text: `Într-o fermă sunt ${de(H)} găini și cu ${d} mai puține rațe. Numărul găinilor reprezintă $${f}$ din numărul puilor. Determinați numărul: a) rațelor; b) puilor; c) păsărilor din fermă.`,
      solution: lines(
        `a) Rațe: $${H} - ${d} = ${ducks}$.`,
        `b) $${f} = \\frac{${p}}{${q}}$, deci $\\frac{${p}}{${q}}$ din numărul puilor este ${H}:`,
        show(`${H} : \\frac{${p}}{${q}} = ${H} \\cdot \\frac{${q}}{${p}} = ${chicks}`),
        `Sunt ${de(chicks)} pui.`,
        `c) Păsări: $${H} + ${ducks} + ${nr(chicks)} = ${nr(H + ducks + chicks)}$.`,
      ),
      verify: () => Number.isInteger(chicks) && close((chicks * p) / q, H) && ducks > 0,
    }
  }
}

/** [p, q, written] for day 1; day 2 is 0,(3) of day 1. */
const DAY1: [number, number, string][] = [[3, 10, '0{,}3'], [6, 10, '0{,}6'], [45, 100, '0{,}45'], [15, 100, '0{,}15'], [24, 100, '0{,}24'], [12, 100, '0{,}12'], [36, 100, '0{,}36'], [9, 20, '0{,}45']]
/** Day 1: 0,3 of the route, day 2: 0,(3) of day 1, day 3: the rest R km: is day 2 P% of the route? the route, p. 73, ex. 31. */
export function probExcursion(rng: Rng): Made {
  for (;;) {
    const [p, q, f] = pick(rng, DAY1)
    const T = int(rng, 3, 90) * 10
    const day1 = (T * p) / q
    const day2 = day1 / 3
    const R = T - day1 - day2
    if (!Number.isInteger(day1) || !Number.isInteger(day2) || R <= 0) continue
    const truePct = (100 * p) / (3 * q)
    const P = rng() < 0.5 ? truePct : pick(rng, [5, 10, 15, 20, 25, 30].filter((x) => x !== truePct))
    return {
      text: `Un excursionist a parcurs un traseu în trei zile. În prima zi a parcurs $${f}$ din lungimea traseului, a doua zi a parcurs $0{,}(3)$ din distanța parcursă în prima zi, iar în a treia zi a parcurs restul de ${R} km. a) Este posibil ca distanța parcursă în a doua zi să reprezinte ${P}% din lungimea întregului traseu? Justificați. b) Determinați lungimea traseului.`,
      solution: lines(
        `a) $0{,}(3) = \\frac{1}{3}$, deci a doua zi a parcurs $\\frac{1}{3}$ din $${f}$, adică $\\frac{1}{3} \\cdot \\frac{${p}}{${q}} = ${frac(p, 3 * q)}$ din traseu, adică ${truePct}%. ${P === truePct ? 'Da, este posibil.' : `Nu, ${truePct}% $\\neq$ ${P}%.`}`,
        `b) În primele două zile a parcurs $${frac(p, q)} + ${frac(p, 3 * q)} = ${frac(4 * p, 3 * q)}$ din traseu, deci restul de ${R} km reprezintă $${frac(3 * q - 4 * p, 3 * q)}$ din traseu:`,
        show(`${R} : ${frac(3 * q - 4 * p, 3 * q)} = ${T}\\text{ km}`),
      ),
      verify: () => close(T - (T * p) / q - (T * p) / q / 3, R) && close(truePct, (day2 * 100) / T),
    }
  }
}

const PART_WORD: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'un sfert', 5: 'o cincime' }
/** The width is 1/k of the length; both grow by c m and the area grows by A: the rectangle, p. 73, ex. 32. */
export function probRectangleGrow(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 5)
    const Wt = int(rng, 11, 299) // tenths
    const c = int(rng, 1, 4)
    if (Wt % 10 === 0) continue
    const Lt = k * Wt
    const At = c * (k + 1) * Wt + 10 * c * c // tenths
    return {
      text: `Lățimea unui dreptunghi reprezintă ${PART_WORD[k]} din lungimea acestuia. Dacă mărim atât lungimea, cât și lățimea dreptunghiului cu ${c} m, atunci aria dreptunghiului se mărește cu $${D(At, 1)}\\text{ m}^2$. Determinați lungimea și lățimea dreptunghiului inițial.`,
      solution: lines(
        `Noul dreptunghi se împarte în dreptunghiul inițial, două fâșii de lățime ${c} m (una cât lungimea, una cât lățimea) și un pătrat cu latura ${c} m:`,
        show(`${c} \\cdot (L + \\ell) + ${c * c} = ${D(At, 1)} \\Rightarrow L + \\ell = (${D(At, 1)} - ${c * c}) : ${c} = ${D((k + 1) * Wt, 1)}\\text{ m}`),
        `Lungimea are ${k} părți cât lățimea, deci suma are ${k + 1} părți:`,
        show(`\\ell = ${D((k + 1) * Wt, 1)} : ${k + 1} = ${D(Wt, 1)}\\text{ m}, \\qquad L = ${k} \\cdot ${D(Wt, 1)} = ${D(Lt, 1)}\\text{ m}`),
      ),
      verify: () => close((Lt / 10 + c) * (Wt / 10 + c) - (Lt / 10) * (Wt / 10), At / 10),
    }
  }
}

// ================= organising data: frequencies, percentages, means (pp. 82–90) =================

const DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']
const PLACES = [
  { what: 'un muzeu', verb: 'a fost vizitat', who: 'vizitatori' },
  { what: 'o grădină botanică', verb: 'a fost vizitată', who: 'vizitatori' },
  { what: 'o expoziție de pictură', verb: 'a fost vizitată', who: 'vizitatori' },
  { what: 'un parc de aventură', verb: 'a fost vizitat', who: 'vizitatori' },
]
/** The mean number of visitors in a few days, p. 82, ex. 2. */
export function statMeanDays(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 7)
    const s = int(rng, 0, 7 - n)
    const v = Array.from({ length: n }, () => int(rng, 120, 900))
    const r = sum(v) % n
    v[n - 1] += r ? n - r : 0
    const m = sum(v) / n
    if (new Set(v).size < n) continue
    const pl = pick(rng, PLACES)
    const days = DAYS.slice(s, s + n)
    return {
      text: `Într-o săptămână, ${pl.what} ${pl.verb} astfel: ${list(days.map((d, i) => `${d} – ${de(v[i])} ${pl.who}`))}. Calculați numărul mediu de ${pl.who} pe zi în aceste ${n} zile.`,
      solution: lines('Media este suma valorilor împărțită la numărul lor:', show(`m_a = (${v.join(' + ')}) : ${n} = ${nr(sum(v))} : ${n} = ${m}`)),
      verify: () => m * n === sum(v) && Number.isInteger(m),
    }
  }
}

const ACTIVITIES = ['înot', 'film', 'pictură', 'muzică', 'dans', 'teatru', 'șah', 'fotbal', 'lectură']
/** A survey of the favourite activity: the total, the most frequent, a percentage, p. 84, Testul 1. */
export function statSurvey(rng: Rng): Made {
  for (;;) {
    const N = pick(rng, [20, 25, 50])
    const acts = shuffle(rng, ACTIVITIES).slice(0, 5)
    const c = Array.from({ length: 4 }, () => int(rng, 1, Math.floor(N / 3)))
    c.push(N - sum(c))
    const mx = Math.max(...c)
    if (c[4] < 1 || c.filter((x) => x === mx).length > 1) continue
    const top = acts[c.indexOf(mx)]
    const j = int(rng, 0, 4)
    const pct = (c[j] * 100) / N
    return {
      text: `Elevii unei clase au răspuns la un sondaj despre activitatea preferată (fiecare a ales una singură): ${list(acts.map((a, i) => `${a} – ${elevi(c[i])}`))}. a) Câți elevi au participat la sondaj? b) Care activitate are cea mai mare frecvență? c) Care este frecvența procentuală a activității „${acts[j]}”?`,
      solution: lines(
        show(`\\text{a) } ${c.join(' + ')} = ${N}\\text{ elevi}`),
        `b) Cea mai mare frecvență, ${mx}, o are activitatea „${top}”.`,
        show(`\\text{c) } \\frac{${c[j]}}{${N}} = \\frac{${pct}}{100} = ${pct}\\%`),
      ),
      verify: () => sum(c) === N && Number.isInteger(pct) && c.every((x) => x <= mx),
    }
  }
}

/** Marks 4 to 10 with their counts: how many have at least t, how many less than s, the class, p. 83, ex. 9. */
export function statMarksCount(rng: Rng): Made {
  for (;;) {
    const marks = [4, 5, 6, 7, 8, 9, 10]
    const c = marks.map(() => int(rng, 0, 7))
    const N = sum(c)
    const t = int(rng, 6, 9)
    const s = int(rng, 5, 7)
    if (N < 15 || N > 32 || c.filter((x) => x > 0).length < 5) continue
    const ge = sum(c.filter((_, i) => marks[i] >= t))
    const lt = sum(c.filter((_, i) => marks[i] < s))
    const shown = marks.map((m, i) => `nota ${m} – ${c[i] === 0 ? 'niciun elev' : elevi(c[i])}`)
    return {
      text: `La un test de biologie, notele elevilor unei clase au fost: ${list(shown)}. a) Câți elevi au note mai mari sau egale cu ${t}? b) Câți elevi au note mai mici decât ${s}? c) Câți elevi au dat testul?`,
      solution: lines(
        show(`\\text{a) } ${sumEq(c.filter((x, i) => marks[i] >= t && x > 0))}`),
        show(`\\text{b) } ${sumEq(c.filter((x, i) => marks[i] < s && x > 0))}`),
        show(`\\text{c) } ${sumEq(c.filter((x) => x > 0))}`),
      ),
      verify: () => {
        const all = marks.flatMap((m, i) => Array.from({ length: c[i] }, () => m))
        return all.length === N && all.filter((m) => m >= t).length === ge && all.filter((m) => m < s).length === lt
      },
    }
  }
}

/** The percentage frequency of each mark, p. 83, ex. 8 b. */
export function statPercentTable(rng: Rng): Made {
  for (;;) {
    const N = pick(rng, [20, 25, 50])
    const marks = [5, 6, 7, 8, 9, 10]
    const c = marks.slice(0, 5).map(() => int(rng, 1, Math.floor(N / 4)))
    c.push(N - sum(c))
    if (c[5] < 1) continue
    const pct = c.map((x) => (x * 100) / N)
    return {
      text: `Într-o clasă de ${elevi(N)}, notele obținute la un test au fost: ${list(marks.map((m, i) => `nota ${m} – ${elevi(c[i])}`))}. Calculați frecvența procentuală a fiecărei note și verificați că suma frecvențelor procentuale este 100%.`,
      solution: lines(
        `Frecvența procentuală a unei note este numărul elevilor care au luat-o, împărțit la ${N}, scris ca procent:`,
        show(marks.map((m, i) => `${m}: \\frac{${c[i]}}{${N}} = ${pct[i]}\\%`).join(', \\quad ')),
        show(`${pct.join('\\% + ')}\\% = 100\\%`),
      ),
      verify: () => sum(pct) === 100 && pct.every(Number.isInteger),
    }
  }
}

const WEEK = ['I', 'a II-a', 'a III-a', 'a IV-a']
/** A pie chart of four weeks; one week's quantity known: the rest, p. 85, Testul 2. */
export function statPieChart(rng: Rng): Made {
  for (;;) {
    const pc = [int(rng, 2, 8) * 5, int(rng, 2, 8) * 5, int(rng, 2, 8) * 5]
    pc.push(100 - sum(pc))
    if (pc[3] < 10) continue
    const T = int(rng, 10, 60) * 20
    const q = pc.map((p) => (T * p) / 100)
    const j = int(rng, 0, 2)
    return {
      text: `Cantitatea de marfă vândută de un magazin în patru săptămâni este redată într-o diagramă circulară: săptămâna I – ${pc[0]}%, săptămâna a II-a – ${pc[1]}%, săptămâna a III-a – ${pc[2]}%, săptămâna a IV-a – restul. În săptămâna ${WEEK[j]} s-au vândut ${q[j]} kg de marfă. Aflați: a) ce procent din marfă s-a vândut în săptămâna a IV-a; b) cantitatea totală de marfă vândută; c) cantitatea vândută în fiecare dintre celelalte săptămâni.`,
      solution: lines(
        show(`\\text{a) } 100\\% - ${pc[0]}\\% - ${pc[1]}\\% - ${pc[2]}\\% = ${pc[3]}\\%`),
        show(`\\text{b) } ${q[j]} : \\frac{${pc[j]}}{100} = ${q[j]} \\cdot 100 : ${pc[j]} = ${nr(T)}\\text{ kg}`),
        show(`\\text{c) } ${[0, 1, 2, 3].filter((i) => i !== j).map((i) => `\\frac{${pc[i]}}{100} \\cdot ${nr(T)} = ${q[i]}\\text{ kg}`).join(', \\quad ')}`),
      ),
      verify: () => sum(q) === T && q.every(Number.isInteger) && q[j] === (T * pc[j]) / 100,
    }
  }
}

/** The mean of a few numbers, some of them periodic decimals, p. 89, Test de autoevaluare, III. */
export function statMeanSet(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 3, 4)
    const nums: [number, number][] = Array.from({ length: n }, () => {
      const t = int(rng, 0, 2)
      if (t === 0) return [int(rng, 2, 59), 10] as [number, number]
      if (t === 1) return [int(rng, 1, 9), 1] as [number, number]
      const b = int(rng, 1, 8)
      return [9 * int(rng, 0, 5) + b, 9] as [number, number]
    })
    const [s, sd] = nums.reduce(([a, b], [c, d]) => reduce(a * d + c * b, b * d), [0, 1])
    const [m, md] = reduce(s, sd * n)
    const e = expand(m, md)
    if (e.pre.length + e.rep.length > 3 || !nums.some(([, d]) => d === 9)) continue
    const shown = nums.map(([p, q]) => rat(p, q))
    return {
      text: `Calculați media aritmetică a numerelor: $${shown.join('; \\; ')}$.`,
      solution: lines(
        'Scriem numerele ca fracții ordinare, le adunăm, apoi împărțim suma la numărul lor:',
        show(nums.map(([p, q], i) => (q === 1 ? '' : `${shown[i]} = ${frac(p, q)}`)).filter(Boolean).join(', \\quad ')),
        show(`m_a = \\left(${nums.map(([p, q]) => frac(p, q)).join(' + ')}\\right) : ${n} = ${frac(s, sd)} : ${n} = ${frac(m, md)} = ${decTex(e)}`),
      ),
      verify: () => close(sum(nums.map(([p, q]) => p / q)) / n, m / md),
    }
  }
}

/** The mean of two numbers is m and one is k times the other, p. 83, ex. 4. */
export function statTwoNumbersMean(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 6)
    const M = int(rng, 11, 999)
    if (M % 10 === 0 || (2 * M * 10) % (k + 1) !== 0) continue
    const small = (2 * M * 10) / (k + 1) // hundredths
    return {
      text: `Media aritmetică a două numere este $${D(M, 1)}$. Calculați cele două numere, știind că unul dintre ele este de ${k} ori mai mare decât celălalt.`,
      solution: lines(
        show(`\\text{suma} = 2 \\cdot ${D(M, 1)} = ${D(2 * M, 1)}`),
        `Numărul mai mare are ${k} părți cât cel mic, deci suma are ${k + 1} părți egale:`,
        show(`${D(2 * M, 1)} : ${k + 1} = ${D(small, 2)}, \\qquad ${k} \\cdot ${D(small, 2)} = ${D(k * small, 2)}`),
      ),
      verify: () => close((val(D(small, 2)) + val(D(k * small, 2))) / 2, M / 10),
    }
  }
}

/** The percentage of the maximum score each contestant got, p. 83, ex. 6. */
export function statContestPercent(rng: Rng): Made {
  for (;;) {
    const M = pick(rng, [40, 50, 60, 80, 110, 120, 150, 70, 90])
    const step = 100 / gcd(M, 100)
    const names = shuffle(rng, [...GIRLS, ...BOYS]).slice(0, int(rng, 4, 5))
    const pc = names.map(() => step * int(rng, Math.ceil(30 / step), Math.floor(100 / step)))
    const pts = pc.map((p) => (M * p) / 100)
    if (new Set(pts).size < names.length) continue
    return {
      text: `La un concurs, punctajul maxim a fost de ${M} de puncte. Concurenții au obținut: ${list(names.map((n, i) => `${n} – ${de(pts[i])} puncte`))}. Calculați ce procent din punctajul maxim a obținut fiecare concurent.`,
      solution: lines(
        `Procentul este $\\frac{\\text{punctaj}}{${M}} \\cdot 100$:`,
        show(names.map((_, i) => `\\frac{${pts[i]}}{${M}} \\cdot 100 = ${pc[i]}\\%`).join(', \\quad ')),
        `${list(names.map((n, i) => `${n} – ${pc[i]}%`))}.`,
      ),
      verify: () => pts.every((p, i) => Number.isInteger(p) && (p * 100) / M === pc[i]),
    }
  }
}

const VEGETABLES = ['roșii', 'vinete', 'ceapă', 'ardei', 'morcovi', 'castraveți']
/** Four vegetables, kilograms and prices: the total weight, the cost, the mean price, p. 90, V. */
export function statVegetables(rng: Rng): Made {
  for (;;) {
    const veg = shuffle(rng, VEGETABLES).slice(0, 4)
    const kg = veg.map(() => int(rng, 2, 9))
    const pr = veg.map(() => int(rng, 3, 18) * 50)
    const K = sum(kg)
    const C = sum(kg.map((k, i) => k * pr[i]))
    if (C % K !== 0) continue
    return {
      text: `Bunica a cumpărat pentru zacuscă: ${list(veg.map((v, i) => `${kg[i]} kg de ${v} cu $${money(pr[i])}$ lei kilogramul`))}. Calculați: a) câte kilograme de legume a cumpărat în total; b) cât au costat toate legumele; c) prețul mediu al unui kilogram de legume.`,
      solution: lines(
        show(`\\text{a) } ${kg.join(' + ')} = ${K}\\text{ kg}`),
        show(`\\text{b) } ${kg.map((k, i) => `${k} \\cdot ${money(pr[i])}`).join(' + ')} = ${kg.map((k, i) => money(k * pr[i])).join(' + ')} = ${money(C)}\\text{ lei}`),
        'c) Prețul mediu este media ponderată a prețurilor: costul total împărțit la numărul de kilograme.',
        show(`${money(C)} : ${K} = ${money(C / K)}\\text{ lei}`),
      ),
      verify: () => close(sum(kg.map((k, i) => k * (pr[i] / 100))) / K, C / K / 100),
    }
  }
}

/** Tickets sold each day of a week: total, the percentage of one day, the daily mean, p. 84, ex. 10. */
export function statTicketsWeek(rng: Rng): Made {
  for (;;) {
    const w = int(rng, 10, 30)
    const T = 140 * w
    const pct = pick(rng, [10, 15, 20, 25])
    const j = int(rng, 0, 6)
    const cj = (T * pct) / 100
    const c = DAYS.map(() => 0)
    c[j] = cj
    const others = [0, 1, 2, 3, 4, 5, 6].filter((i) => i !== j)
    let left = T - cj
    for (const i of others.slice(0, 5)) {
      c[i] = int(rng, 10, 60) * 10
      left -= c[i]
    }
    c[others[5]] = left
    if (left < 50 || left > 900) continue
    return {
      text: `La un cinematograf s-au vândut într-o săptămână bilete astfel: ${list(DAYS.map((d, i) => `${d} – ${c[i]}`))}. a) Calculați numărul total de bilete vândute. b) Calculați ce procent din numărul total de bilete s-a vândut ${DAYS[j]}. c) Calculați numărul mediu de bilete vândute într-o zi.`,
      solution: lines(
        show(`\\text{a) } ${c.join(' + ')} = ${nr(T)}`),
        show(`\\text{b) } \\frac{${cj}}{${nr(T)}} \\cdot 100 = ${pct}\\%`),
        show(`\\text{c) } ${nr(T)} : 7 = ${T / 7}`),
      ),
      verify: () => sum(c) === T && (cj * 100) / T === pct && Number.isInteger(T / 7) && c.every((x) => x > 0),
    }
  }
}

/** The decimals d0/10, d1/10, …, d9/10 (or over 100), and their mean, p. 90, IV. */
export function statFractionsMean(rng: Rng): Made {
  const d = int(rng, 1, 9)
  const den = pick(rng, [10, 100])
  const kind = int(rng, 0, 2)
  const seconds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((u) => kind === 0 || u % 2 === (kind === 1 ? 0 : 1))
  const nums = seconds.map((u) => 10 * d + u)
  const p = den === 10 ? 1 : 2
  const decs = nums.map((x) => D(x, p))
  const S = sum(nums)
  const n = nums.length
  const mean = D((S * 10) / n, p + 1)
  const cond = kind === 0 ? '' : kind === 1 ? ' și a doua cifră pară' : ' și a doua cifră impară'
  return {
    text: `Considerăm fracțiile zecimale obținute din fracțiile ordinare cu numitorul ${den} și cu numărătorii numere naturale de două cifre, cu prima cifră egală cu ${d}${cond}. a) Scrieți aceste fracții zecimale. b) Calculați media lor aritmetică.`,
    solution: lines(
      `a) Numărătorii sunt ${list(nums)}, deci fracțiile zecimale sunt $${decs.join('; \\; ')}$.`,
      show(`\\text{b) } m_a = (${decs.join(' + ')}) : ${n} = ${D(S, p)} : ${n} = ${mean}`),
    ),
    verify: () => close(val(mean), sum(decs.map(val)) / n),
  }
}

/** A class mean truncated to two decimals, the most frequent mark, at most 7, at least 8, p. 89, II. */
export function statClassMean(rng: Rng): Made {
  for (;;) {
    const marks = [3, 4, 5, 6, 7, 8, 9, 10]
    const c = marks.map(() => int(rng, 0, 9))
    const N = sum(c)
    const S = sum(c.map((x, i) => x * marks[i]))
    const mx = Math.max(...c)
    if (N < 20 || N > 32 || c.filter((x) => x === mx).length > 1 || (S * 100) % N === 0) continue
    const top = marks[c.indexOf(mx)]
    const le7 = sum(c.filter((_, i) => marks[i] <= 7))
    const ge8 = N - le7
    const tr = Math.floor((S * 100) / N)
    const present = marks.map((m, i) => [m, c[i]]).filter(([, x]) => x > 0)
    return {
      text: `La un test, elevii unei clase au obținut următoarele note: ${list(present.map(([m, x]) => `${elevi(x)} – nota ${m}`))}. a) Ce notă are cea mai mare frecvență? b) Câți elevi au note mai mici sau egale cu 7? c) Câți elevi au luat cel puțin nota 8? d) Calculați media clasei cu două zecimale exacte.`,
      solution: lines(
        `a) Nota ${top}, obținută de ${elevi(mx)}.`,
        show(`\\text{b) } ${sumEq(present.filter(([m]) => m <= 7).map(([, x]) => x))} \\qquad \\text{c) } ${sumEq(present.filter(([m]) => m >= 8).map(([, x]) => x))}`),
        'd) Media clasei este media ponderată a notelor, cu ponderile egale cu numărul elevilor:',
        show(`m_p = \\frac{${present.map(([m, x]) => `${m} \\cdot ${x}`).join(' + ')}}{${N}} = \\frac{${S}}{${N}} = ${DK(tr, 2)}\\ldots`),
      ),
      verify: () => tr / 100 <= S / N && S / N < (tr + 1) / 100 && le7 + ge8 === N,
    }
  }
}

// ================= point, line, half-line, segment (pp. 98–101) =================

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T']
const names = (rng: Rng, n: number) => {
  const start = int(rng, 0, LETTERS.length - n)
  return rng() < 0.6 ? LETTERS.slice(start, start + n) : shuffle(rng, LETTERS).slice(0, n).sort()
}
const C2 = (n: number) => (n * (n - 1)) / 2
const pairsOf = (ps: string[]) => ps.flatMap((a, i) => ps.slice(i + 1).map((b) => a + b))

/** n points, no three collinear: all the lines through two of them, p. 101, ex. 1. */
export function geoLinesThroughPairs(rng: Rng): Made {
  const n = int(rng, 3, 6)
  const ps = names(rng, n)
  const ls = pairsOf(ps)
  return {
    text: `Se consideră ${n} puncte, $${ps.join(', ')}$, oricare trei necoliniare. Scrieți toate dreptele determinate de câte două dintre aceste puncte. Câte drepte sunt?`,
    solution: lines(
      'Prin două puncte distincte trece o dreaptă și numai una, deci fiecare pereche de puncte determină o dreaptă:',
      show(ls.join(', \\; ')),
      `Fiecare punct formează câte o pereche cu celelalte ${n - 1}, iar fiecare pereche se numără de două ori: $${n} \\cdot ${n - 1} : 2 = ${C2(n)}$ drepte.`,
    ),
    verify: () => ls.length === C2(n) && new Set(ls).size === ls.length,
  }
}

/** k lines through O: how many half-lines with the origin O, p. 98, ex. 13. */
export function geoHalfLinesAtPoint(rng: Rng): Made {
  const k = int(rng, 2, 12)
  const O = pick(rng, ['O', 'A', 'M', 'P', 'S'])
  const ds = k <= 4 ? Array.from({ length: k }, (_, i) => `d_${i + 1}`).join(', ') : `d_1, d_2, \\ldots, d_{${k}}`
  return {
    text: `Dreptele distincte $${ds}$ trec toate prin punctul $${O}$. Câte semidrepte cu originea în punctul $${O}$ se formează?`,
    solution: lines(
      `Punctul $${O}$ împarte fiecare dreaptă în două semidrepte opuse, cu originea în $${O}$:`,
      show(`${k} \\cdot 2 = ${2 * k}\\text{ semidrepte}`),
    ),
    verify: () => 2 * k === Array.from({ length: k }, () => 2).reduce((s, x) => s + x, 0),
  }
}

/** n points on a line: all the segments they determine, p. 99, ex. 14 a. */
export function geoSegmentsOnLine(rng: Rng): Made {
  const n = int(rng, 3, 6)
  const ps = names(rng, n)
  const segs = pairsOf(ps)
  return {
    text: `Pe dreapta $d$ se află, în această ordine, punctele $${ps.join(', ')}$. Scrieți toate segmentele determinate de aceste puncte. Câte sunt?`,
    solution: lines(
      'Oricare două puncte distincte sunt capetele unui segment:',
      show(segs.map((s) => `[${s}]`).join(', \\; ')),
      `În total $${n} \\cdot ${n - 1} : 2 = ${C2(n)}$ segmente.`,
    ),
    verify: () => segs.length === C2(n),
  }
}

/** n points on a line: half-lines with the origin in one of them, the opposite pairs, those named with two points, p. 99, ex. 16. */
export function geoHalfLinesOnLine(rng: Rng): Made {
  const n = int(rng, 2, 7)
  const ps = names(rng, n)
  const named = ps.flatMap((p, i) => [...(i < n - 1 ? [`[${p}${ps[i + 1]}`] : []), ...(i > 0 ? [`[${p}${ps[i - 1]}`] : [])])
  return {
    text: `Pe o dreaptă $d$ se fixează, în această ordine, punctele $${ps.join(', ')}$. a) Câte semidrepte cu originea în unul dintre aceste puncte se formează pe dreapta $d$? b) Câte perechi de semidrepte opuse sunt printre ele? c) Câte dintre aceste semidrepte se pot nota cu două dintre punctele date?`,
    solution: lines(
      `a) Fiecare punct determină două semidrepte opuse: $${n} \\cdot 2 = ${2 * n}$ semidrepte.`,
      `b) Câte o pereche de semidrepte opuse în fiecare punct: ${n} perechi.`,
      `c) Semidreapta se notează cu originea și încă un punct al ei. Punctele de la capete, $${ps[0]}$ și $${ps[n - 1]}$, au câte o semidreaptă pe care nu se află alt punct dat, deci rămân $${2 * n} - 2 = ${2 * n - 2}$ semidrepte: $${named.join(', \\; ')}$.`,
    ),
    verify: () => named.length === 2 * n - 2,
  }
}

/** Points in order on a line: the segments that contain [XY], p. 99, ex. 14 b. */
export function geoSegmentsContaining(rng: Rng): Made {
  const n = int(rng, 4, 7)
  const ps = names(rng, n)
  const i = int(rng, 0, n - 2)
  const j = int(rng, i + 1, n - 1)
  const segs: string[] = []
  for (let a = 0; a <= i; a++) for (let b = j; b < n; b++) segs.push(`[${ps[a]}${ps[b]}]`)
  return {
    text: `Pe o dreaptă se află, în această ordine, punctele $${ps.join(', ')}$. Scrieți toate segmentele determinate de aceste puncte care conțin segmentul $[${ps[i]}${ps[j]}]$. Câte sunt?`,
    solution: lines(
      `Un astfel de segment are un capăt în stânga lui $${ps[i]}$ sau chiar în $${ps[i]}$ (${i + 1} ${i === 0 ? 'posibilitate' : 'posibilități'}) și celălalt în dreapta lui $${ps[j]}$ sau chiar în $${ps[j]}$ (${n - j} ${n - j === 1 ? 'posibilitate' : 'posibilități'}):`,
      show(segs.join(', \\; ')),
      `În total $${i + 1} \\cdot ${n - j} = ${segs.length}$ segmente.`,
    ),
    verify: () => segs.length === (i + 1) * (n - j),
  }
}

/** n points, exactly k of them collinear: how many lines, p. 99, ex. 20. */
export function geoCollinearLines(rng: Rng): Made {
  const n = int(rng, 5, 12)
  const k = int(rng, 3, n - 1)
  const L = C2(n) - C2(k) + 1
  return {
    text: `Se consideră ${n} puncte distincte, dintre care exact ${k} sunt coliniare, iar în afară de acestea nu există alte trei puncte coliniare. Câte drepte determină aceste puncte?`,
    solution: lines(
      `Dacă oricare trei puncte ar fi necoliniare, ar fi $${n} \\cdot ${n - 1} : 2 = ${C2(n)}$ drepte.`,
      `Cele ${k} puncte coliniare dau însă o singură dreaptă, nu $${k} \\cdot ${k - 1} : 2 = ${C2(k)}$:`,
      show(`${C2(n)} - ${C2(k)} + 1 = ${L}\\text{ drepte}`),
    ),
    verify: () => {
      // count the lines directly: pairs with both points among the k collinear ones count once
      let c = 0
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (!(a < k && b < k)) c++
      return c + 1 === L
    },
  }
}

/** k lines through O: the half-lines, the opposite pairs, the pairs that are not opposite. */
export function geoHalfLinePairs(rng: Rng): Made {
  const k = int(rng, 2, 9)
  const O = pick(rng, ['O', 'A', 'M', 'P'])
  const all = C2(2 * k)
  return {
    text: `Prin punctul $${O}$ trec ${k} drepte distincte. a) Câte semidrepte cu originea în $${O}$ se formează? b) Câte perechi de semidrepte opuse sunt? c) Câte perechi de semidrepte cu originea în $${O}$ nu sunt opuse?`,
    solution: lines(
      `a) Fiecare dreaptă dă două semidrepte opuse: $${k} \\cdot 2 = ${2 * k}$.`,
      `b) Câte o pereche pe fiecare dreaptă: ${k} perechi.`,
      `c) Din ${2 * k} semidrepte se pot forma $${2 * k} \\cdot ${2 * k - 1} : 2 = ${all}$ perechi; scădem perechile de semidrepte opuse: $${all} - ${k} = ${all - k}$.`,
    ),
    verify: () => all - k === 2 * k * (k - 1),
  }
}

/** k points on the line d and m points outside it: segments, lines, the lines through a point of d. */
export function geoTwoGroups(rng: Rng): Made {
  const k = int(rng, 3, 7)
  const m = int(rng, 2, 6)
  const n = k + m
  const L = C2(n) - C2(k) + 1
  const ps = names(rng, k)
  return {
    text: `Pe dreapta $d$ se află punctele $${ps.join(', ')}$, iar în afara ei se află alte ${m} puncte, astfel încât în afară de punctele de pe $d$ nu există trei puncte coliniare. a) Câte segmente au capetele în două dintre aceste ${n} puncte? b) Câte drepte determină punctele? c) Câte dintre aceste drepte trec prin punctul $${ps[0]}$?`,
    solution: lines(
      show(`\\text{a) } ${n} \\cdot ${n - 1} : 2 = ${C2(n)}\\text{ segmente}`),
      `b) Perechile de puncte de pe $d$ (${C2(k)}) dau toate aceeași dreaptă $d$: $${C2(n)} - ${C2(k)} + 1 = ${L}$ drepte.`,
      `c) Prin $${ps[0]}$ trec dreapta $d$ și câte o dreaptă spre fiecare dintre cele ${m} puncte din afara ei: $1 + ${m} = ${m + 1}$ drepte.`,
    ),
    verify: () => L === k * m + C2(m) + 1,
  }
}

/** n points determine L lines (or S segments on a line): n, p. 101, reversed. */
export function geoHowManyPoints(rng: Rng): Made {
  const n = int(rng, 4, 30)
  const onLine = rng() < 0.5
  const L = C2(n)
  return {
    text: onLine
      ? `Pe o dreaptă se află mai multe puncte distincte, care determină ${de(L)} segmente. Câte puncte sunt pe dreaptă?`
      : `Mai multe puncte, oricare trei necoliniare, determină ${de(L)} drepte. Câte puncte sunt?`,
    solution: lines(
      `Cu $n$ puncte se formează $n \\cdot (n - 1) : 2$ perechi de puncte, adică $n \\cdot (n - 1) : 2$ ${onLine ? 'segmente' : 'drepte'}.`,
      show(`n \\cdot (n - 1) : 2 = ${L} \\Rightarrow n \\cdot (n - 1) = ${2 * L} = ${n} \\cdot ${n - 1} \\Rightarrow n = ${n}`),
    ),
    verify: () => n * (n - 1) === 2 * L,
  }
}

// ================= Supermate (pp. 53, 56, 73) =================

/** x,(ab) + a,(bx) + b,(xa) = x + a + b + s: the digit x, p. 56, ex. 16. */
export function supPeriodicDigits(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 1, 2)
    const a = int(rng, 1, 9)
    const b = int(rng, 1, 9)
    const x = 9 * s - a - b
    if (x < 1 || x > 9) continue
    const lhs = `\\overline{x{,}(${a}${b})} + \\overline{${a}{,}(${b}x)} + \\overline{${b}{,}(x${a})}`
    return {
      text: `Determinați cifra $x$, știind că $${lhs} = x + ${a + b + s}$.`,
      solution: lines(
        'Fiecare număr este partea întreagă plus o fracție cu numitorul 99:',
        show(`x + ${a} + ${b} + \\frac{\\overline{${a}${b}} + \\overline{${b}x} + \\overline{x${a}}}{99} = x + ${a + b + s}`),
        show(`\\overline{${a}${b}} + \\overline{${b}x} + \\overline{x${a}} = ${10 * a + b} + ${10 * b} + x + 10x + ${a} = 11 \\cdot (x + ${a + b})`),
        show(`\\frac{11 \\cdot (x + ${a + b})}{99} = ${s} \\Rightarrow x + ${a + b} = ${9 * s} \\Rightarrow x = ${x}`),
      ),
      verify: () => {
        const v = (w: number, d1: number, d2: number) => w + (10 * d1 + d2) / 99
        return close(v(x, a, b) + v(a, b, x) + v(b, x, a), x + a + b + s)
      },
    }
  }
}

const isPrime = (n: number) => {
  if (n < 2) return false
  for (let f = 2; f * f <= n; f++) if (n % f === 0) return false
  return true
}
/** The primes xy with 0,x(y) − 0,y(x) = 0,0(1) · 8d, p. 56, ex. 15. */
export function supPrimesPeriodic(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 1, 8)
    const swap = rng() < 0.5
    const primes: number[] = []
    for (let x = 1; x <= 9; x++) for (let y = 0; y <= 9; y++) if ((swap ? y - x : x - y) === d && isPrime(10 * x + y)) primes.push(10 * x + y)
    if (!primes.length) continue
    const lhs = swap ? '\\overline{0{,}y(x)} - \\overline{0{,}x(y)}' : '\\overline{0{,}x(y)} - \\overline{0{,}y(x)}'
    const big = swap ? 'y' : 'x'
    const small = swap ? 'x' : 'y'
    return {
      text: `Determinați toate numerele prime $\\overline{xy}$ care verifică relația $${lhs} = 0{,}0(1) \\cdot ${8 * d}$.`,
      solution: lines(
        show(`\\overline{0{,}${big}(${small})} = \\frac{\\overline{${big}${small}} - ${big}}{90} = \\frac{9${big} + ${small}}{90}, \\qquad 0{,}0(1) = \\frac{1}{90}`),
        show(`\\frac{9${big} + ${small} - 9${small} - ${big}}{90} = \\frac{${8 * d}}{90} \\Rightarrow 8 \\cdot (${big} - ${small}) = ${8 * d} \\Rightarrow ${big} - ${small} = ${d}`),
        `Numerele de două cifre cu ${swap ? 'cifra unităților mai mare cu' : 'cifra zecilor mai mare cu'} ${d} ${swap ? 'decât cifra zecilor' : 'decât cifra unităților'} care sunt prime: ${list(primes)}.`,
      ),
      verify: () => primes.every((p) => {
        const [x, y] = [Math.floor(p / 10), p % 10]
        const f = (u: number, v: number) => (9 * u + v) / 90
        return close(swap ? f(y, x) - f(x, y) : f(x, y) - f(y, x), (8 * d) / 90)
      }),
    }
  }
}

/** The last two decimals of k · (m : 2^n), or of k · (m : 5^n), p. 53, ex. 20. */
export function supLastDecimals(rng: Rng): Made {
  for (;;) {
    const two = rng() < 0.5
    const k = int(rng, 3, 19)
    const m = int(rng, 3, 39)
    const n = int(rng, 2000, 2030)
    const km = k * m
    if (km % 2 === 0 || km % 5 === 0) continue
    // the last two digits of km · 5^n (or km · 2^n)
    let t = km % 100
    for (let i = 0; i < n; i++) t = (t * (two ? 5 : 2)) % 100
    const last = String(t).padStart(2, '0')
    const base = two ? 2 : 5
    const other = two ? 5 : 2
    return {
      text: `Rezultatul calculului $${k} \\cdot (${m} : ${base}^{${n}})$ este o fracție zecimală. Aflați ultimele două zecimale ale acesteia.`,
      solution: lines(
        `Amplificăm cu $${other}^{${n}}$, ca numitorul să devină $10^{${n}}$:`,
        show(`${k} \\cdot \\frac{${m}}{${base}^{${n}}} = \\frac{${km} \\cdot ${other}^{${n}}}{10^{${n}}}`),
        two
          ? `Ultimele două cifre ale lui $5^{${n}}$ sunt 25 (pentru exponent cel puțin 2), iar $${km} \\cdot 25$ se termină în ${last}. Împărțirea la $10^{${n}}$ mută virgula, deci ultimele două zecimale sunt ${last[0]} și ${last[1]}.`
          : `Ultimele două cifre ale puterilor lui 2 se repetă din 20 în 20 (de la $2^2$ încolo): $${n} = 20 \\cdot ${Math.floor((n - 2) / 20)} + ${((n - 2) % 20) + 2}$, deci $2^{${n}}$ se termină ca $2^{${((n - 2) % 20) + 2}}$, în ${String(2 ** (((n - 2) % 20) + 2) % 100).padStart(2, '0')}. Înmulțind cu ${km}, numărul se termină în ${last}, deci ultimele două zecimale sunt ${last[0]} și ${last[1]}.`,
      ),
      verify: () => {
        let u = 1
        for (let i = 0; i < n; i++) u = (u * other) % 100
        return (km * u) % 100 === t && (two || 2 ** (((n - 2) % 20) + 2) % 100 === u)
      },
    }
  }
}

/** A cube of a³ small cubes weighs W: a cube of b³ small cubes of the same material, p. 73, ex. 29 and 30. */
export function supCubeWeight(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 4)
    const b = int(rng, 2, 6)
    if (a === b) continue
    // the edge of a small cube and the range of its weight in grams (wood to metal)
    const [small, lo, hi] = pick(rng, [['1 cm', 2, 20], ['2 cm', 10, 80], ['5 cm', 100, 900], ['1 dm', 500, 5000]] as [string, number, number][])
    const one = int(rng, lo, hi)
    const W = one * a ** 3
    const R = one * b ** 3
    const kg = (g: number) => (g >= 1000 ? `$${D(g, 3)}$ kg` : `${g} g`)
    return {
      text: a === 1
        ? `Un cub cu muchia de ${small} cântărește ${kg(W)}. Cât cântărește un cub din același material, cu muchia de ${b} ori mai mare?`
        : `Un cub este format din ${de(a ** 3)} cuburi cu muchia de ${small} și cântărește ${kg(W)}. Cât cântărește un alt cub, din același material, format din ${de(b ** 3)} cuburi cu muchia de ${small}?`,
      solution: lines(
        a === 1
          ? `Cubul mare se poate împărți în $${b} \\cdot ${b} \\cdot ${b} = ${b ** 3}$ cuburi cât cel mic, fiecare de ${kg(one)}.`
          : 'Aflăm întâi cât cântărește un cub mic (în grame):',
        a === 1 ? '' : show(`${nr(W)} : ${a ** 3} = ${nr(one)}\\text{ g}`),
        show(`${b ** 3} \\cdot ${nr(one)} = ${nr(R)}\\text{ g}`),
        `Cubul cântărește ${kg(R)}.`,
      ).replace(/\n\n\n\n/g, '\n\n'),
      verify: () => R / W === b ** 3 / a ** 3,
    }
  }
}

/** Three Sundays of a month fall on even dates: the weekday of the date d, p. 73, ex. 28. */
export function supEvenSundays(rng: Rng): Made {
  const wd = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']
  const plural = ['Zilele de luni', 'Zilele de marți', 'Zilele de miercuri', 'Zilele de joi', 'Zilele de vineri', 'Sâmbetele', 'Duminicile']
  const thePl = ['trei zile de luni', 'trei zile de marți', 'trei zile de miercuri', 'trei zile de joi', 'trei zile de vineri', 'trei sâmbete', 'trei duminici']
  const w = int(rng, 0, 6)
  const d = int(rng, 1, 31)
  const ans = wd[(w + (((d - 2) % 7) + 7)) % 7]
  return {
    text: `Într-o lună, ${thePl[w]} sunt zile cu dată pară. Ce zi a săptămânii este data de ${d} a acelei luni?`,
    solution: lines(
      `${plural[w]} sunt din 7 în 7, deci datele lor sunt alternativ pare și impare. Trei date pare se obțin doar dacă sunt cinci astfel de zile în lună, prima pe o dată pară: 2, 9, 16, 23, 30 (dacă prima ar fi pe 4, a cincea ar fi pe 32).`,
      `Așadar data de 2 este ${wd[w]}. ${d === 2 ? '' : `Între 2 și ${d} sunt ${Math.abs(d - 2)} zile, iar $${Math.abs(d - 2)} = 7 \\cdot ${Math.floor(Math.abs(d - 2) / 7)} + ${Math.abs(d - 2) % 7}$.`} Data de ${d} este ${ans}.`,
    ),
    verify: () => [2, 16, 30].every((x) => (x - 2) % 7 === 0) && wd[((w + d - 2) % 7 + 7) % 7] === ans,
  }
}

/** The digits m, n, p grow by t: q,(rs) − m,(np) = t,(t), p. 56, ex. 19. */
export function supDigitsGrow(rng: Rng): Made {
  const t = int(rng, 1, 3)
  const v = int(rng, 0, 2)
  const [m, n, p] = [int(rng, 1, 9 - t), int(rng, 0, 9 - t), int(rng, 0, 9 - t)]
  const exprs: [string, string][] = [
    ['\\overline{q{,}(rs)} - \\overline{m{,}(np)}', `${t}{,}(${t})`],
    ['\\overline{qr{,}(s)} - \\overline{mn{,}(p)}', `${11 * t}{,}(${t})`],
    ['\\overline{0{,}(qrs)} - \\overline{0{,}(mnp)}', `0{,}(${t})`],
  ]
  const [e, r] = exprs[v]
  const value = (q: number, rr: number, s: number) =>
    v === 0 ? q + (10 * rr + s) / 99 : v === 1 ? 10 * q + rr + s / 9 : (100 * q + 10 * rr + s) / 999
  return {
    text: `Mărind fiecare dintre cifrele $m$, $n$ și $p$ cu ${t}, se obțin cifrele $q$, $r$ și $s$. Arătați că $${e}$ nu depinde de cifrele $m$, $n$, $p$ și calculați această diferență.`,
    solution: lines(
      `Avem $q = m + ${t}$, $r = n + ${t}$, $s = p + ${t}$. Transformăm în fracții ordinare și scădem:`,
      v === 0
        ? show(`(q - m) + \\frac{\\overline{rs} - \\overline{np}}{99} = ${t} + \\frac{${11 * t}}{99} = ${t} + \\frac{${t}}{9} = ${r}`)
        : v === 1
          ? show(`(\\overline{qr} - \\overline{mn}) + \\frac{s - p}{9} = ${11 * t} + \\frac{${t}}{9} = ${r}`)
          : show(`\\frac{\\overline{qrs} - \\overline{mnp}}{999} = \\frac{${111 * t}}{999} = \\frac{${t}}{9} = ${r}`),
      `De exemplu, pentru $m = ${m}$, $n = ${n}$, $p = ${p}$ se obține tot $${r}$.`,
    ),
    // val drops the period, so t,(t) reads t: the period adds t/9
    verify: () => close(value(m + t, n + t, p + t) - value(m, n, p), val(r) + t / 9),
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-decimal-division', label: 'Fracții zecimale: împărțirea, puteri și aproximări', topic: 'Algebră',
    forms: {
      1: [decDivPowersOfTen, decDivTwoDecimals, decPowerQuotient, decTimesSmaller],
      2: [decDivByDecimal, decApproxHundredths, decSameExponent, decProportional],
      3: [decApproxRemainders, decRectangle, decApproxExpression, decUnitPrice],
    },
  },
  {
    id: 'v-periodic-decimals', label: 'Fracții zecimale periodice și fracții ordinare', topic: 'Algebră',
    forms: {
      1: [perFracToFinite, perFracToPeriodic, perFiniteToFrac, perDecompose],
      2: [perToFraction, perClassify, perNthDecimal, perCompose],
      3: [perSumOfDecimals, perEquivalentN, perMeanPeriodic, perSumTwo],
    },
  },
  {
    id: 'v-decimal-order-ops', label: 'Fracții zecimale: ordinea efectuării operațiilor', topic: 'Algebră',
    forms: {
      1: [opsPow10Product, opsPow10Quotient, opsBracketTenth],
      2: [opsBracketProduct, opsCompareSums, opsLetters, opsFastProduct, opsWithSquare],
      3: [opsSquaresIdentity, opsEquation, opsRoundResult, opsLongChain],
    },
  },
  {
    id: 'v-decimal-methods', label: 'Probleme cu fracții zecimale: metode aritmetice', topic: 'Algebră',
    forms: {
      1: [probYield, probExchange, probPartLeft, probSumDifference, probSegmentParts],
      2: [probThinkNumber, probComparison, probTickets, probPace, probQuotientRemainder],
      3: [probThreeDays, probPercentSystem, probFarm, probExcursion, probRectangleGrow],
    },
  },
  {
    id: 'v-statistics', label: 'Organizarea datelor: frecvențe, procente și medii', topic: 'Algebră',
    forms: {
      1: [statMeanDays, statSurvey, statMarksCount],
      2: [statPercentTable, statPieChart, statMeanSet, statTwoNumbersMean, statContestPercent],
      3: [statVegetables, statTicketsWeek, statFractionsMean, statClassMean],
    },
  },
  {
    id: 'v-points-lines', label: 'Punct, dreaptă, semidreaptă, segment', topic: 'Geometrie',
    forms: {
      1: [geoLinesThroughPairs, geoHalfLinesAtPoint, geoSegmentsOnLine],
      2: [geoHalfLinesOnLine, geoSegmentsContaining, geoCollinearLines],
      3: [geoHalfLinePairs, geoTwoGroups, geoHowManyPoints],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-decimals', label: 'Supermate: fracții zecimale și periodice, cuburi, calendar',
    forms: [supPeriodicDigits, supPrimesPeriodic, supLastDecimals, supCubeWeight, supEvenSundays, supDigitsGrow],
  },
]
