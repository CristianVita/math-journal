// Grade V kinds from "Matematică, clasa a V-a, partea I", Mate 2000+ Consolidare (Paralela 45), pp. 83–116, photographed
// by the user on 13 November 2026: powers (order of operations, last digit, zeros, sums of powers), writing in base 10
// and in base 2, and the arithmetic methods of Unit 4 (reduction to the unit, comparison, figurative, backwards, false
// hypothesis). The book marks its sections with stars: Înțelegere * → level 1, Aplicare și exersare ** → level 2,
// Aprofundare și performanță *** and Supermate **** → level 3. `KINDS` is registered in `generators.ts`.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, poly, reduce, shuffle, type Rng } from './tex'

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

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up: 20\,347. */
const nr = (n: number | bigint) => {
  const s = String(n)
  return s.replace(/^-/, '').length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')
}
/** A number in the prose: plain below 1 000, in a formula from 1 000 up, so that it gets its thin space. */
const N = (n: number) => (Math.abs(n) >= 1000 ? `$${nr(n)}$` : String(n))
/** A number before a noun in the prose: "19 elevi", "20 de elevi", "$1\,200$ de lei". */
const deN = (n: number) => N(n) + (de(n) === String(n) ? '' : ' de')
/** The word "de" alone, after a formula that ends with the number: "$… = 120$ de pagini". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
const SYMBOLS = new Set(['g', 'kg', 'km', 'ha', 'cm', 'm'])
/** A quantity: symbols take no "de" ("1 050 g"), words do ("20 de lei"). */
const qty = (n: number, unit: string) => (SYMBOLS.has(unit) ? `${N(n)} ${unit}` : `${deN(n)} ${unit}`)
const dayQ = (n: number) => (n === 1 ? 'o zi' : qty(n, 'zile'))
const hourQ = (n: number) => (n === 1 ? 'o oră' : qty(n, 'ore'))
/** A decimal number with the Romanian comma, for a formula: 2{,}5 */
const dec = (x: number) => String(Math.round(x * 10000) / 10000).replace('.', '{,}')
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
/** b^e in LaTeX, with the exponent 1 left out. */
const pw = (b: number | string, e: number | string) => (String(e) === '1' ? String(b) : `${b}^{${e}}`)
/** c·p, with the coefficient 1 left out. */
const term = (c: number, p: string) => (c === 1 ? p : `${c} \\cdot ${p}`)
const big = (n: number) => BigInt(n)
const powMod = (b: number, n: number, m: number) => {
  let r = 1n
  let x = big(b) % big(m)
  let e = n
  while (e > 0) {
    if (e & 1) r = (r * x) % big(m)
    x = (x * x) % big(m)
    e >>= 1
  }
  return Number(r)
}
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n))
const GIRLS = ['Ana', 'Maria', 'Ioana', 'Elena', 'Irina', 'Daria', 'Sara', 'Bianca', 'Sonia', 'Camelia']
const BOYS = ['Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Matei', 'Luca', 'Sergiu', 'Costin']
/** A part of a whole, as Romanian says it: "jumătate", "o treime". */
const FR: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'o pătrime', 5: 'o cincime', 6: 'o șesime', 7: 'o șeptime', 8: 'o optime', 9: 'o noime', 10: 'o zecime' }
/** p/q of something in the prose: "o treime", "$\frac{2}{3}$". */
const part = (p: number, q: number) => (p === 1 ? FR[q] : `$\\frac{${p}}{${q}}$`)
/** What is left after taking 1/d: "cealaltă jumătate", "2 părți din 3 părți egale". */
const leftOf = (d: number) => (d === 2 ? 'cealaltă jumătate' : `${d - 1} ${d - 1 === 1 ? 'parte' : 'părți'} din ${d} părți egale`)
/** Undo "take 1/d": the rest r was (d − 1)/d of the whole. */
const undo = (r: number, d: number) => (d === 2 ? `${nr(r)} \\cdot 2 = ${nr(2 * r)}` : `${nr(r)} : ${d - 1} \\cdot ${d} = ${nr((r / (d - 1)) * d)}`)

// ================= powers (pp. 83–85, tests pp. 90–94) =================

/** The last digit of base^n, explained by the cycle of the last digit. */
function unitsOfPower(base: number, n: number): [string, number] {
  const d = base % 10
  const cyc = [1, 2, 3, 4].map((e) => d ** e % 10)
  const r = ((n - 1) % 4) + 1
  const u = cyc[r - 1]
  const B = pw(nr(base), nr(n))
  const head = base === d ? '' : `Ultima cifră a lui $${B}$ este aceeași cu ultima cifră a lui $${pw(d, nr(n))}$. `
  if (new Set(cyc).size === 1) return [`${head}Orice putere a lui ${d} cu exponent nenul se termină cu cifra ${d}, deci $U(${B}) = ${d}$.`, d]
  return [`${head}Ultimele cifre ale puterilor lui ${d} sunt, pe rând, ${cyc.join(', ')} și se repetă din 4 în 4. Cum $${nr(n)} = 4 \\cdot ${nr((n - r) / 4)} + ${r}$, avem $U(${B}) = U(${pw(d, r)}) = ${u}$.`, u]
}

/** [a·(b − c·d) : e]² + g⁰·h − 1ⁿ, p. 83 ex. 5. */
export function powersOrder(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 2, 6)
    const d = int(rng, 2, 6)
    const t = int(rng, 1, 8)
    const b = c * d + t
    const e = pick(rng, [2, 3, 4, 5, 6])
    const q = int(rng, 2, 9)
    if ((q * e) % t !== 0) continue
    const a = (q * e) / t
    if (a < 2 || a > 40) continue
    const g = int(rng, 2, 9)
    const h = int(rng, 2, 30)
    const n = int(rng, 2000, 2030)
    const r = q * q + h - 1
    return {
      text: `Calculați: $\\left[${a} \\cdot (${b} - ${c} \\cdot ${d}) : ${e}\\right]^2 + ${g}^0 \\cdot ${h} - 1^{${nr(n)}}$.`,
      solution: lines(
        'Efectuăm întâi calculele din paranteza rotundă, apoi pe cele din paranteza dreaptă:',
        show(`${a} \\cdot (${b} - ${c * d}) : ${e} = ${a} \\cdot ${t} : ${e} = ${a * t} : ${e} = ${q}`),
        `Urmează puterile: $${q}^2 = ${q * q}$, $${g}^0 = 1$ și $1^{${nr(n)}} = 1$ (orice putere a lui 1 este 1). La final, înmulțirea, apoi adunarea și scăderea:`,
        show(`${q * q} + 1 \\cdot ${h} - 1 = ${q * q} + ${h} - 1 = ${r}`),
      ),
      verify: () => (a * (b - c * d)) % e === 0 && ((a * (b - c * d)) / e) ** 2 + g ** 0 * h - 1 ** n === r,
    }
  }
}

/** Powers with powers as exponents, B^b and S^s close to each other: a^(B^b) : a^(S^s) · m, p. 83 ex. 1 e. */
const TOWERS: [number, number, number, number][] = [[3, 2, 2, 3], [3, 3, 5, 2], [2, 7, 5, 3], [6, 2, 2, 5], [5, 3, 11, 2], [2, 5, 3, 3], [3, 2, 2, 2], [2, 3, 2, 2], [2, 3, 4, 1]]
export function powersTower(rng: Rng): Made {
  for (;;) {
    const [B, b, S, s] = pick(rng, TOWERS.filter((t) => t[3] > 1))
    const X = B ** b
    const Y = S ** s
    const k = X - Y
    const a = pick(rng, [2, 3, 4, 5, 6, 7, 10])
    if (a ** k > 2000) continue
    const m = int(rng, 2, 9)
    const r = a ** k * m
    const chain = [`${a}^{${X}} : ${a}^{${Y}} \\cdot ${m}`, `${pw(a, k)} \\cdot ${m}`, `${a ** k} \\cdot ${m}`, nr(r)].filter((x, i, l) => i === 0 || x !== l[i - 1])
    return {
      text: `Calculați: $${a}^{${B}^{${b}}} : ${a}^{${S}^{${s}}} \\cdot ${m}$.`,
      solution: lines(
        'Calculăm întâi exponenții, care sunt tot puteri:',
        show(`${B}^{${b}} = ${X}, \\quad ${S}^{${s}} = ${Y}`),
        'La împărțirea puterilor cu aceeași bază, exponenții se scad:',
        show(chain.join(' = ')),
      ),
      verify: () => (big(a) ** big(X) / big(a) ** big(Y)) * big(m) === big(r),
    }
  }
}

/** How many zeros N = 2ᵖ·5^q·… ends with, the powers written with 4, 8, 25, 125, 10, p. 84 ex. 14–15. */
export function powersZeros(rng: Rng): Made {
  const two = pick(rng, [2, 4, 8])
  const five = pick(rng, [5, 25, 125])
  const L2 = ({ 2: 1, 4: 2, 8: 3 } as Record<number, number>)[two]
  const L5 = ({ 5: 1, 25: 2, 125: 3 } as Record<number, number>)[five]
  const p = int(rng, 2, 12)
  const q = int(rng, 2, 12)
  const ten = rng() < 0.5 ? int(rng, 1, 6) : 0
  const o = pick(rng, [3, 7, 11])
  const c = int(rng, 1, 9)
  const e2 = L2 * p + ten
  const e5 = L5 * q + ten
  const z = Math.min(e2, e5)
  const factors = shuffle(rng, [pw(two, p), pw(five, q), pw(o, c), ...(ten ? [pw(10, ten)] : [])])
  const rewrite = [
    ...(two !== 2 ? [`${pw(two, p)} = (2^${L2})^{${p}} = ${pw(2, L2 * p)}`] : []),
    ...(five !== 5 ? [`${pw(five, q)} = (5^${L5})^{${q}} = ${pw(5, L5 * q)}`] : []),
    ...(ten ? [`${pw(10, ten)} = ${pw(2, ten)} \\cdot ${pw(5, ten)}`] : []),
  ]
  const rest = e2 > e5 ? `${pw(2, e2 - z)} \\cdot ${pw(o, c)}` : e5 > e2 ? `${pw(5, e5 - z)} \\cdot ${pw(o, c)}` : pw(o, c)
  return {
    text: `Cu câte zerouri se termină numărul $N = ${factors.join(' \\cdot ')}$?`,
    solution: lines(
      'Un zero la sfârșitul numărului provine din fiecare produs $2 \\cdot 5 = 10$. Scriem toți factorii ca puteri ale lui 2, 5 și ' + o + ':',
      ...(rewrite.length ? [show(rewrite.join(', \\quad '))] : []),
      show(`N = ${pw(2, e2)} \\cdot ${pw(5, e5)} \\cdot ${pw(o, c)} = ${pw(10, z)} \\cdot ${rest}`),
      `Numărul $${rest}$ nu are ca factori și pe 2, și pe 5, deci nu se termină cu 0. Numărul $N$ se termină cu ${deN(z)} zerouri.`,
    ),
    verify: () => {
      const s = ((big(2) ** big(e2)) * big(5) ** big(e5) * big(o) ** big(c)).toString()
      const actual = (big(two) ** big(p)) * big(five) ** big(q) * big(o) ** big(c) * (ten ? big(10) ** big(ten) : 1n)
      return actual.toString() === s && s.length - s.replace(/0+$/, '').length === z
    },
  }
}

/** The last digit of aᵐ · Yᵏ, a year to a small power, Testul 2, I.3. */
export function powersLastDigitProduct(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [2, 3, 4, 7, 8, 9])
    const m = int(rng, 100, 2100)
    const Y = int(rng, 2021, 2039)
    const y = Y % 10
    if ([0, 5].includes(y)) continue
    const k = int(rng, 2, 4)
    const [la, ua] = unitsOfPower(a, m)
    const uy = y ** k % 10
    const digit = (ua * uy) % 10
    return {
      text: `Aflați ultima cifră a numărului $N = ${pw(a, nr(m))} \\cdot ${pw(nr(Y), k)}$.`,
      solution: lines(
        'Notăm cu $U(x)$ ultima cifră a numărului $x$. Ultima cifră a unui produs este ultima cifră a produsului ultimelor cifre ale factorilor.',
        la,
        `Ultima cifră a lui $${pw(nr(Y), k)}$ este ultima cifră a lui $${y}^${k} = ${y ** k}$, adică ${uy}.`,
        show(`U(N) = U(${ua} \\cdot ${uy}) = U(${ua * uy}) = ${digit}`),
      ),
      verify: () => (powMod(a, m, 10) * powMod(Y, k, 10)) % 10 === digit,
    }
  }
}

/** The last digit of a sum of powers of consecutive years, p. 85 ex. 22 a, c and ex. 24 b. */
export function powersLastDigitSum(rng: Rng): Made {
  const Y = int(rng, 2015, 2035)
  const t = int(rng, 2, 4)
  const same = rng() < 0.5
  const n = int(rng, 100, 2100)
  const bases = Array.from({ length: t }, (_, i) => Y + i)
  const exps = bases.map((b) => (same ? n : b))
  const steps = bases.map((b, i) => unitsOfPower(b, exps[i]))
  const us = steps.map((s) => s[1])
  const s = sum(us)
  const digit = s % 10
  return {
    text: `Determinați ultima cifră a numărului $x = ${bases.map((b, i) => pw(nr(b), nr(exps[i]))).join(' + ')}$.`,
    solution: lines(
      'Notăm cu $U(x)$ ultima cifră a numărului $x$. Aflăm ultima cifră a fiecărui termen:',
      ...steps.map((st) => st[0]),
      'Ultima cifră a sumei este ultima cifră a sumei ultimelor cifre:',
      show(`U(x) = U(${us.join(' + ')}) = U(${s}) = ${digit}`),
    ),
    verify: () => bases.reduce((acc, b, i) => acc + powMod(b, exps[i], 10), 0) % 10 === digit,
  }
}

/** 2ˣ · 5ʸ = N: the zeros at the end give the common exponent, p. 85 ex. 33 a. */
export function powersTwoFive(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 1, 9)
    const y = int(rng, 1, 9)
    if (x === y) continue
    const n = 2 ** x * 5 ** y
    if (n > 5000000) continue
    const m = Math.min(x, y)
    const rest = n / 10 ** m
    return {
      text: `Determinați $x + y$, știind că $x$ și $y$ sunt numere naturale și $2^x \\cdot 5^y = ${nr(n)}$.`,
      solution: lines(
        'Desprindem zerourile de la sfârșitul numărului, apoi scriem totul cu puteri ale lui 2 și 5:',
        show(`${nr(n)} = ${nr(rest)} \\cdot ${pw(10, m)} = ${pw(x > y ? 2 : 5, Math.abs(x - y))} \\cdot ${pw(2, m)} \\cdot ${pw(5, m)} = ${pw(2, x)} \\cdot ${pw(5, y)}`),
        `Deci $x = ${x}$ și $y = ${y}$, iar $x + y = ${x + y}$.`,
      ),
      verify: () => 2 ** x * 5 ** y === n,
    }
  }
}

/** n² − n − (n − 1) = (n − 1)², or n² + n + (n + 1) = (n + 1)², Testul 2, V.1 a. */
export function powersSquareCheck(rng: Rng): Made {
  const n = int(rng, 1000, 2999)
  const plus = rng() < 0.5
  const m = plus ? n + 1 : n - 1
  const op = plus ? '+' : '-'
  return {
    text: `Arătați că numărul $a = ${nr(n)}^2 ${op} ${nr(n)} ${op} ${nr(m)}$ este pătrat perfect.`,
    solution: lines(
      'Dăm factor comun în primii doi termeni:',
      show(`${nr(n)}^2 ${op} ${nr(n)} = ${nr(n)} \\cdot ${nr(n)} ${op} ${nr(n)} \\cdot 1 = ${nr(n)} \\cdot (${nr(n)} ${op} 1) = ${nr(n)} \\cdot ${nr(m)}`),
      `Apoi dăm factor comun pe ${N(m)}:`,
      show(`a = ${nr(n)} \\cdot ${nr(m)} ${op} ${nr(m)} = ${nr(m)} \\cdot (${nr(n)} ${op} 1) = ${nr(m)} \\cdot ${nr(m)} = ${nr(m)}^2`),
      'deci $a$ este pătrat perfect.',
    ),
    verify: () => big(n) * big(n) + (plus ? 1n : -1n) * (big(n) + big(m)) === big(m) * big(m),
  }
}

/** c₁·b^(n+1) + c₂·bⁿ − c₃·b^(n−1) = b^E. */
function powerCombo(rng: Rng, b: number, E: number) {
  for (;;) {
    const j = int(rng, 1, 2)
    const c1 = int(rng, 1, 4)
    const c2 = int(rng, 0, 4)
    const c3 = c1 * b * b + c2 * b - b ** j
    if (c3 <= 0) continue
    const n = E - j + 1
    const tex = `${term(c1, pw(b, n + 1))}${c2 ? ` + ${term(c2, pw(b, n))}` : ''} - ${term(c3, pw(b, n - 1))}`
    const inner = `${term(c1, `${b}^2`)}${c2 ? ` + ${term(c2, String(b))}` : ''} - ${c3}`
    const innerV = `${c1 * b * b}${c2 ? ` + ${c2 * b}` : ''} - ${c3}`
    const steps = `${pw(b, n - 1)} \\cdot (${inner}) = ${pw(b, n - 1)} \\cdot (${innerV}) = ${pw(b, n - 1)} \\cdot ${pw(b, j)} = ${pw(b, E)}`
    const value = big(c1) * big(b) ** big(n + 1) + big(c2) * big(b) ** big(n) - big(c3) * big(b) ** big(n - 1)
    return { tex, steps, value }
  }
}

/** Two expressions that are 2^(3t) and 3^(2t) (or 2^(5t) and 5^(2t), 3^(3t) and 5^(2t)), Testul 1, V.1 a. */
export function powersCompare(rng: Rng): Made {
  const [b1, e1, b2, e2] = pick(rng, [[2, 3, 3, 2], [2, 5, 5, 2], [3, 3, 5, 2]] as const)
  const t = int(rng, 5, 20)
  const A = powerCombo(rng, b1, e1 * t)
  const B = powerCombo(rng, b2, e2 * t)
  const swap = rng() < 0.5
  const [X, Y] = swap ? [B, A] : [A, B]
  const [xb, xe, yb, ye] = swap ? [b2, e2, b1, e1] : [b1, e1, b2, e2]
  const rel = xb ** xe < yb ** ye ? '<' : '>'
  return {
    text: `Comparați numerele $a = ${X.tex}$ și $b = ${Y.tex}$.`,
    solution: lines(
      'În fiecare număr dăm factor comun puterea cu exponentul cel mai mic:',
      show(`a = ${X.steps}`),
      show(`b = ${Y.steps}`),
      'Scriem cele două puteri cu același exponent:',
      show(`a = ${pw(xb, xe * t)} = (${xb}^${xe})^{${t}} = ${xb ** xe}^{${t}}, \\quad b = ${pw(yb, ye * t)} = (${yb}^${ye})^{${t}} = ${yb ** ye}^{${t}}`),
      `Cum $${xb ** xe} ${rel} ${yb ** ye}$, rezultă $a ${rel} b$.`,
    ),
    verify: () => X.value === big(xb) ** big(xe * t) && Y.value === big(yb) ** big(ye * t) && (rel === '<' ? X.value < Y.value : X.value > Y.value),
  }
}

/** b + b² + … + b^N is divisible by 1 + b + … + b^(g−1) when g divides N, p. 84 ex. 19. */
export function powersGroupedSum(rng: Rng): Made {
  const [b, g] = pick(rng, [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [7, 3]] as const)
  const D = (b ** g - 1) / (b - 1)
  const m = int(rng, 8, 50)
  const n = g * m
  const group = (s: number) => '(' + Array.from({ length: g }, (_, i) => pw(b, s + i)).join(' + ') + ')'
  const inner = Array.from({ length: g }, (_, i) => (i === 0 ? '1' : pw(b, i))).join(' + ')
  const tail = `${b} + ${pw(b, 1 + g)} + \\ldots + ${pw(b, n - g + 1)}`
  return {
    text: `Arătați că numărul $S = ${b} + ${b}^2 + ${b}^3 + \\ldots + ${b}^{${n}}$ se divide cu ${D}.`,
    solution: lines(
      `Suma are ${deN(n)} termeni, iar $${n} = ${g} \\cdot ${m}$, deci îi putem grupa câte ${g}:`,
      show(`S = ${group(1)} + ${group(1 + g)} + \\ldots + ${group(n - g + 1)}`),
      'Din fiecare grupă dăm factor comun prima ei putere:',
      show(`S = ${b} \\cdot (${inner}) + ${pw(b, 1 + g)} \\cdot (${inner}) + \\ldots + ${pw(b, n - g + 1)} \\cdot (${inner})`),
      `Cum $${inner} = ${D}$, obținem:`,
      show(`S = ${D} \\cdot (${tail})`),
      `deci $S$ se divide cu ${D}.`,
    ),
    verify: () => {
      let s = 0n
      for (let i = 1; i <= n; i++) s += big(b) ** big(i)
      return s % big(D) === 0n && sum(Array.from({ length: g }, (_, i) => b ** i)) === D
    },
  }
}

/** 2 + 2² + … + 2ⁿ = 2^K − 2 (and two relatives): find n, p. 84 ex. 20 a and Testul 2, V.2 a. */
export function powersFindN(rng: Rng): Made {
  const v = int(rng, 0, 2)
  const K = int(rng, 10, 90)
  const n = K - 1
  const [lhs, rhs, steps] = ([
    [`2 + 2^2 + 2^3 + \\ldots + 2^n`, `2^{${K}} - 2`, [
      'Notăm $S = 2 + 2^2 + \\ldots + 2^n$ și îl înmulțim cu 2:',
      show('2S = 2^2 + 2^3 + \\ldots + 2^n + 2^{n+1}'),
      'Scădem cele două egalități; termenii comuni se reduc:',
      show('2S - S = 2^{n+1} - 2 \\Rightarrow S = 2^{n+1} - 2'),
      show(`2^{n+1} - 2 = 2^{${K}} - 2 \\Rightarrow 2^{n+1} = 2^{${K}} \\Rightarrow n + 1 = ${K} \\Rightarrow n = ${n}`),
    ]],
    [`1 + 2 + 2^2 + \\ldots + 2^n`, `2^{${K}} - 1`, [
      'Notăm $S = 1 + 2 + 2^2 + \\ldots + 2^n$ și îl înmulțim cu 2:',
      show('2S = 2 + 2^2 + \\ldots + 2^n + 2^{n+1}'),
      'Scădem cele două egalități; termenii comuni se reduc:',
      show('2S - S = 2^{n+1} - 1 \\Rightarrow S = 2^{n+1} - 1'),
      show(`2^{n+1} - 1 = 2^{${K}} - 1 \\Rightarrow 2^{n+1} = 2^{${K}} \\Rightarrow n + 1 = ${K} \\Rightarrow n = ${n}`),
    ]],
    [`2 \\cdot (3 + 3^2 + \\ldots + 3^n)`, `3^{${K}} - 3`, [
      'Notăm $S = 3 + 3^2 + \\ldots + 3^n$ și îl înmulțim cu 3:',
      show('3S = 3^2 + 3^3 + \\ldots + 3^n + 3^{n+1}'),
      'Scădem cele două egalități; termenii comuni se reduc:',
      show('3S - S = 3^{n+1} - 3 \\Rightarrow 2S = 3^{n+1} - 3'),
      show(`3^{n+1} - 3 = 3^{${K}} - 3 \\Rightarrow 3^{n+1} = 3^{${K}} \\Rightarrow n + 1 = ${K} \\Rightarrow n = ${n}`),
    ]],
  ] as [string, string, string[]][])[v]
  return {
    text: `Aflați numărul natural $n$ care verifică egalitatea $${lhs} = ${rhs}$.`,
    solution: lines(...steps),
    verify: () => {
      let s = 0n
      if (v === 2) {
        for (let i = 1; i <= n; i++) s += 3n ** big(i)
        return 2n * s === 3n ** big(K) - 3n
      }
      for (let i = v === 1 ? 0 : 1; i <= n; i++) s += 2n ** big(i)
      return s === 2n ** big(K) - (v === 1 ? 1n : 2n)
    },
  }
}

/** The remainder of c + bⁿ + b^(n+1) (+ b^(n+2)) divided by 1 + b (+ b²), for any n, p. 85 ex. 33 b. */
export function powersRemainder(rng: Rng): Made {
  const three = rng() < 0.4
  const b = int(rng, 2, three ? 6 : 9)
  const D = three ? 1 + b + b * b : 1 + b
  const c = int(rng, 1, D - 1)
  const terms = `${b}^n + ${b}^{n+1}${three ? ` + ${b}^{n+2}` : ''}`
  const inner = `1 + ${b}${three ? ` + ${b}^2` : ''}`
  return {
    text: `Aflați restul împărțirii numărului $N = ${c} + ${terms}$ la ${D}, oricare ar fi numărul natural $n$.`,
    solution: lines(
      `Dăm factor comun $${b}^n$ în ultimii termeni:`,
      show(`N = ${c} + ${b}^n \\cdot (${inner}) = ${c} + ${b}^n \\cdot ${D}`),
      `Termenul $${b}^n \\cdot ${D}$ se divide cu ${D}, iar $${c} < ${D}$, deci restul împărțirii lui $N$ la ${D} este ${c}.`,
    ),
    verify: () => [0, 1, 2, 3, 5, 8].every((n) => (big(c) + big(b) ** big(n) + big(b) ** big(n + 1) + (three ? big(b) ** big(n + 2) : 0n)) % big(D) === big(c)),
  }
}

// ================= base 10 and base 2 (pp. 86–89) =================

const valueIn = (s: string, b: number) => [...s].reduce((v, d) => v * b + Number(d), 0)
/** abc in base b written out: 2·5² + 3·5 + 4. */
const expandIn = (s: string, b: number) =>
  [...s].map((d, i) => {
    const k = s.length - 1 - i
    return k === 0 ? d : `${d} \\cdot ${pw(b, k)}`
  }).join(' + ')

/** A number from base 2 to base 10, p. 89 ex. 7. */
export function baseBinToDec(rng: Rng): Made {
  const len = int(rng, 4, 7)
  const bits = '1' + Array.from({ length: len - 1 }, () => (rng() < 0.5 ? '1' : '0')).join('')
  const terms = [...bits].map((d, i) => `${d} \\cdot 2^{${len - 1 - i}}`)
  const vals = [...bits].map((d, i) => (d === '1' ? 2 ** (len - 1 - i) : 0)).filter((x) => x > 0)
  const v = sum(vals)
  return {
    text: `Scrieți în baza 10 numărul $${bits}_{(2)}$.`,
    solution: lines(
      'Fiecare cifră se înmulțește cu puterea lui 2 corespunzătoare poziției ei, numărând de la dreapta, de la 0:',
      show(`${bits}_{(2)} = ${terms.join(' + ')} = ${vals.length > 1 ? `${vals.join(' + ')} = ` : ''}${v}`),
      `Deci $${bits}_{(2)} = ${v}_{(10)}$.`,
    ),
    verify: () => parseInt(bits, 2) === v,
  }
}

/** A number from base 10 to base 2 by successive divisions, p. 88 ex. 6. */
export function baseDecToBin(rng: Rng): Made {
  const n = int(rng, 20, 250)
  const rows: string[] = []
  const rems: number[] = []
  for (let c = n; c > 0; c = Math.floor(c / 2)) {
    rows.push(`${c} &= 2 \\cdot ${Math.floor(c / 2)} + ${c % 2}`)
    rems.push(c % 2)
  }
  const bits = rems.reverse().join('')
  const powers = [...bits].map((d, i) => (d === '1' ? 2 ** (bits.length - 1 - i) : 0)).filter((x) => x > 0)
  return {
    text: `Scrieți numărul ${n} în baza 2.`,
    solution: lines(
      'Împărțim succesiv la 2, până obținem câtul 0, și reținem resturile:',
      show(`\\begin{aligned} ${rows.join(' \\\\ ')} \\end{aligned}`),
      `Citim resturile de la ultimul la primul: $${n}_{(10)} = ${bits}_{(2)}$.`,
      `Verificare: $${powers.join(' + ')} = ${n}$.`,
    ),
    verify: () => n.toString(2) === bits && sum(powers) === n,
  }
}

/** a·10⁵ + b·10³ + c·10 + d written positionally, with missing powers, p. 88 ex. 5. */
export function baseExpanded(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 3, 6)
    const d = Array.from({ length: t + 1 }, (_, k) => (k === t ? int(rng, 1, 9) : rng() < 0.4 ? 0 : int(rng, 1, 9)))
    const missing = d.map((x, k) => (x === 0 ? k : -1)).filter((k) => k >= 0)
    if (!missing.some((k) => k > 0 && k < t)) continue
    const terms: string[] = []
    for (let k = t; k >= 0; k--) if (d[k]) terms.push(k === 0 ? String(d[k]) : `${d[k]} \\cdot ${k === 1 ? '10' : `10^{${k}}`}`)
    const n = d.reduce((s, x, k) => s + x * 10 ** k, 0)
    const ms = missing.sort((u, v) => v - u).map((k) => `$10^{${k}}$`)
    return {
      text: `Scrieți pozițional, în baza 10, numărul $${terms.join(' + ')}$.`,
      solution: lines(
        'Cifra care înmulțește $10^k$ este cifra de pe poziția $k$, numărând de la dreapta, de la 0 (cifra unităților).',
        missing.length === 1 ? `Puterea ${ms[0]} nu apare, deci cifra de pe poziția ei este 0:` : `Puterile ${list(ms)} nu apar, deci cifrele de pe pozițiile lor sunt 0:`,
        show(`${terms.join(' + ')} = ${nr(n)}`),
      ),
      verify: () => Number(d.slice().reverse().join('')) === n,
    }
  }
}

/** The base x in which abc₍ₓ₎ = N, by trying the bases, p. 89 ex. 9 and ex. 12. */
export function baseFind(rng: Rng): Made {
  const x = int(rng, 3, 9)
  const d2 = int(rng, 1, x - 1)
  const d1 = int(rng, 0, x - 1)
  const d0 = int(rng, 0, x - 1)
  const s = `${d2}${d1}${d0}`
  const n = valueIn(s, x)
  const start = Math.max(2, Math.max(d2, d1, d0) + 1)
  const p = poly([[d2, 'x^2'], [d1, 'x'], [d0, '']])
  const rows = Array.from({ length: x - start + 1 }, (_, i) => start + i).map((b) => `${b} & ${valueIn(s, b)}`)
  return {
    text: `Determinați baza de numerație $x$ pentru care $${s}_{(x)} = ${n}_{(10)}$.`,
    solution: lines(
      `Scriem numărul în baza 10: $${s}_{(x)} = ${p}$. Cifrele unui număr scris în baza $x$ sunt mai mici decât $x$, deci $x \\ge ${start}$.`,
      'Când baza crește, valoarea crește; încercăm bazele pe rând:',
      show(`\\begin{array}{c|c} x & ${p} \\\\ \\hline ${rows.join(' \\\\ ')} \\end{array}`),
      `Deci $x = ${x}$. Verificare: $${expandIn(s, x)} = ${n}$.`,
    ),
    verify: () => {
      const ok = Array.from({ length: 30 }, (_, i) => i + 2).filter((b) => b > Math.max(d2, d1, d0) && valueIn(s, b) === n)
      return ok.length === 1 && ok[0] === x
    },
  }
}

/** A sum of numbers written in different bases, p. 89 ex. 19. */
export function baseSum(rng: Rng): Made {
  const binary = rng() < 0.3
  const bases = binary ? [2, 2, 2] : shuffle(rng, [3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
  const nums = bases.map((b) => (binary ? '1' + Array.from({ length: int(rng, 2, 3) }, () => (rng() < 0.5 ? '1' : '0')).join('') : `${int(rng, 1, b - 1)}${int(rng, 0, b - 1)}`))
  const vals = nums.map((s, i) => valueIn(s, bases[i]))
  const total = sum(vals)
  return {
    text: `Calculați, în baza 10: $${nums.map((s, i) => `${s}_{(${bases[i]})}`).join(' + ')}$.`,
    solution: lines(
      'Transformăm fiecare număr în baza 10:',
      show(nums.map((s, i) => `${s}_{(${bases[i]})} = ${expandIn(s, bases[i])} = ${vals[i]}`).join(', \\quad ')),
      show(`${vals.join(' + ')} = ${total}`),
    ),
    verify: () => nums.reduce((acc, s, i) => acc + parseInt(s, bases[i]), 0) === total,
  }
}

/** Three numbers in three bases, in increasing order, p. 89 ex. 8. */
export function baseOrder(rng: Rng): Made {
  for (;;) {
    const bases = shuffle(rng, [3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
    const nums = bases.map((b) => `${int(rng, 1, b - 1)}${int(rng, 0, b - 1)}${int(rng, 0, b - 1)}`)
    const vals = nums.map((s, i) => valueIn(s, bases[i]))
    if (new Set(vals).size < 3) continue
    const order = [0, 1, 2].sort((i, j) => vals[i] - vals[j])
    const tex = (i: number) => `${nums[i]}_{(${bases[i]})}`
    return {
      text: `Ordonați crescător numerele: $${tex(0)}$, $${tex(1)}$ și $${tex(2)}$.`,
      solution: lines(
        'Le transformăm în baza 10:',
        ...nums.map((s, i) => show(`${tex(i)} = ${expandIn(s, bases[i])} = ${vals[i]}`)),
        'Deci ordinea crescătoare este:',
        show(order.map(tex).join(' < ')),
      ),
      verify: () => order.every((i, k) => k === 0 || parseInt(nums[order[k - 1]], bases[order[k - 1]]) < parseInt(nums[i], bases[i])),
    }
  }
}

/** A digit x in a number with a bar: ‾(2x3) + m = S or ‾(1x7) · m = P, p. 89 ex. 18. */
export function baseDigitEquation(rng: Rng): Made {
  const pos = int(rng, 0, 2)
  const digits = [int(rng, 1, 9), int(rng, 0, 9), int(rng, 0, 9)]
  const x = digits[pos]
  const v = digits[0] * 100 + digits[1] * 10 + digits[2]
  const pattern = digits.map((d, i) => (i === pos ? 'x' : String(d))).join('')
  const product = rng() < 0.5
  const m = product ? int(rng, 3, 60) : int(rng, 10, 900)
  const r = product ? v * m : v + m
  const eq = product ? `\\overline{${pattern}} \\cdot ${m} = ${nr(r)}` : `\\overline{${pattern}} + ${m} = ${nr(r)}`
  const step = product ? `\\overline{${pattern}} = ${nr(r)} : ${m} = ${v}` : `\\overline{${pattern}} = ${nr(r)} - ${m} = ${v}`
  return {
    text: `Determinați cifra $x$, știind că $${eq}$.`,
    solution: lines(
      product ? 'Factorul necunoscut se află împărțind produsul la celălalt factor:' : 'Termenul necunoscut se află scăzând din sumă celălalt termen:',
      show(step),
      `Comparând $\\overline{${pattern}}$ cu ${v}, obținem $x = ${x}$.`,
    ),
    verify: () => {
      const ok = Array.from({ length: 10 }, (_, d) => d).filter((d) => {
        const ds = digits.map((y, i) => (i === pos ? d : y))
        const w = ds[0] * 100 + ds[1] * 10 + ds[2]
        return ds[0] > 0 && (product ? w * m : w + m) === r
      })
      return ok.length === 1 && ok[0] === x
    },
  }
}

/** ‾ab + ‾ba = 11(a + b) or ‾ab − ‾ba = 9(a − b): all the numbers ‾ab, Testul 2, V.2 b. */
export function baseAbBa(rng: Rng): Made {
  const minus = rng() < 0.4
  const k = minus ? int(rng, 1, 8) : int(rng, 3, 17)
  const n = minus ? 9 * k : 11 * k
  const nums: number[] = []
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (minus ? a - b === k : a + b === k) nums.push(10 * a + b)
  return {
    text: `Determinați numerele naturale de forma $\\overline{ab}$, cu $a \\ne 0$ și $b \\ne 0$, pentru care $\\overline{ab} ${minus ? '-' : '+'} \\overline{ba} = ${n}$.`,
    solution: lines(
      'Scriem numerele descompuse în baza 10:',
      minus
        ? show(`\\overline{ab} - \\overline{ba} = 10a + b - (10b + a) = 9a - 9b = 9 \\cdot (a - b)`)
        : show(`\\overline{ab} + \\overline{ba} = 10a + b + 10b + a = 11a + 11b = 11 \\cdot (a + b)`),
      minus ? show(`9 \\cdot (a - b) = ${n} \\Rightarrow a - b = ${k}`) : show(`11 \\cdot (a + b) = ${n} \\Rightarrow a + b = ${k}`),
      `Cu cifrele $a$ și $b$ nenule, ${nums.length === 1 ? 'singurul număr este' : 'numerele sunt'} ${list(nums)}.`,
    ),
    verify: () => {
      const all: number[] = []
      for (let v = 11; v <= 99; v++) {
        const a = Math.floor(v / 10)
        const b = v % 10
        if (b !== 0 && (minus ? v - (10 * b + a) : v + 10 * b + a) === n) all.push(v)
      }
      return all.join() === nums.join() && nums.length >= 1
    },
  }
}

/** ‾ab₍ₓ₎ + ‾cd₍ₓ₎ (+ …) = N: a linear equation in the base, p. 89 ex. 13 and ex. 24. */
export function baseFindSum(rng: Rng): Made {
  const x = int(rng, 3, 9)
  const k = int(rng, 2, 3)
  const nums = Array.from({ length: k }, () => `${int(rng, 1, x - 1)}${int(rng, 0, x - 1)}`)
  const A = sum(nums.map((s) => Number(s[0])))
  const B = sum(nums.map((s) => Number(s[1])))
  const n = A * x + B
  const maxD = Math.max(...nums.flatMap((s) => [...s].map(Number)))
  return {
    text: `În ce bază de numerație $x$ are loc egalitatea $${nums.map((s) => `${s}_{(x)}`).join(' + ')} = ${n}_{(10)}$?`,
    solution: lines(
      'Scriem fiecare număr în baza 10:',
      show(`${nums.map((s) => `(${poly([[Number(s[0]), 'x'], [Number(s[1]), '']])})`).join(' + ')} = ${n}`),
      show(`${A}x + ${B} = ${n} \\Rightarrow ${A}x = ${n - B} \\Rightarrow x = ${n - B} : ${A} = ${x}`),
      `Toate cifrele sunt mai mici decât ${x}, deci baza căutată este $x = ${x}$.`,
    ),
    verify: () => (n - B) / A === x && maxD < x && nums.reduce((acc, s) => acc + parseInt(s, x), 0) === n,
  }
}

/** A = a·10^(n+k) + b·10ⁿ − 1: its digits and how many of each, p. 84 ex. 16, 18 and p. 89 ex. 11. */
export function baseDigitsOf(rng: Rng): Made {
  const a = int(rng, 1, 9)
  const b = int(rng, 2, 9)
  const k = int(rng, 2, 5)
  const z = k - 1
  const counts = new Map<number, string>()
  const add = (d: number, c: number) => counts.set(d, String(Number(counts.get(d) ?? 0) + c))
  add(a, 1)
  add(0, z)
  add(b - 1, 1)
  const times = (c: string) => (c === '1' ? 'o dată' : `de ${c} ori`)
  const items = [...counts.entries()].sort((u, v) => u[0] - v[0]).map(([d, c]) => `cifra ${d} apare ${times(c)}`)
  const nines = a === 9 ? 'cifra 9 apare de $n + 1$ ori' : 'cifra 9 apare de $n$ ori'
  const all = [...items.filter((s) => !s.startsWith('cifra 9')), nines]
  const zeros = z === 1 ? '0' : `\\underbrace{0\\ldots0}_{${z}}`
  return {
    text: `Fie numărul $A = ${a === 1 ? '' : `${a} \\cdot `}10^{n+${k}} + ${b} \\cdot 10^{n} - 1$, unde $n$ este un număr natural nenul. Determinați cifrele numărului $A$ și precizați de câte ori apare fiecare.`,
    solution: lines(
      `Numărul $${a === 1 ? '' : `${a} \\cdot `}10^{n+${k}}$ se scrie cu cifra ${a} urmată de $n + ${k}$ zerouri, iar $${b} \\cdot 10^n$ cu cifra ${b} urmată de $n$ zerouri. Suma lor se scrie: cifra ${a}, ${z === 1 ? 'un zero' : `${z} zerouri`}, cifra ${b} și $n$ zerouri.`,
      `Scăzând 1, cele $n$ zerouri de la sfârșit devin cifre de 9, iar cifra ${b} devine ${b - 1}:`,
      show(`A = ${a}${zeros}${b - 1}\\underbrace{9\\ldots9}_{n}`),
      `Deci ${list(all)}.`,
    ),
    verify: () => [1, 3, 6].every((n) => {
      const s = (big(a) * 10n ** big(n + k) + big(b) * 10n ** big(n) - 1n).toString()
      const cnt = (d: number) => [...s].filter((c) => c === String(d)).length
      return [...counts.entries()].every(([d, c]) => d === 9 || cnt(d) === Number(c)) && cnt(9) === n + (a === 9 ? 1 : 0) && s.length === n + k + 1
    }),
  }
}

/** ‾abc + ‾bca + ‾cab = 111(a + b + c), never a perfect square, p. 89 ex. 14 and ex. 21. */
export function baseRotations(rng: Rng): Made {
  const s = int(rng, 3, 27)
  const v = 111 * s
  return {
    text: `Cifrele nenule $a$, $b$, $c$ au suma ${s}. a) Calculați $N = \\overline{abc} + \\overline{bca} + \\overline{cab}$. b) Arătați că $N$ nu este pătrat perfect.`,
    solution: lines(
      'a) Descompunem fiecare număr în baza 10:',
      show('N = (100a + 10b + c) + (100b + 10c + a) + (100c + 10a + b) = 111a + 111b + 111c = 111 \\cdot (a + b + c)'),
      show(`N = 111 \\cdot ${s} = ${nr(v)}`),
      `b) $111 = 3 \\cdot 37$, deci $N = 3 \\cdot 37 \\cdot ${s}$. Ca $N$ să fie pătrat perfect, factorul prim 37 ar trebui să apară de un număr par de ori, deci ${s} ar trebui să se dividă cu 37. Acest lucru nu se poate, deoarece $0 < ${s} < 37$.`,
    ),
    verify: () => {
      const a = Math.min(9, s - 2)
      const rest = s - a
      const b = Math.min(9, rest - 1)
      const c = rest - b
      const w = (100 * a + 10 * b + c) + (100 * b + 10 * c + a) + (100 * c + 10 * a + b)
      return c >= 1 && w === v && !isSquare(v)
    },
  }
}

/** Compare 2^a + 2^b with 2^c + 2^d + 2^e by their writing in base 2, p. 89 ex. 15. */
export function baseBinaryCompare(rng: Rng): Made {
  for (;;) {
    const A = shuffle(rng, Array.from({ length: 56 }, (_, i) => i + 5)).slice(0, 2).sort((u, v) => v - u)
    let B = shuffle(rng, Array.from({ length: 56 }, (_, i) => i + 5)).slice(0, 3).sort((u, v) => v - u)
    if (rng() < 0.5 && !B.slice(1).includes(A[0])) B = [A[0], ...B.slice(1)].sort((u, v) => v - u)
    if (new Set(B).size < 3) continue
    let i = 0
    while (i < 2 && A[i] === B[i]) i++
    const aBig = i < 2 && A[i] > B[i]
    const rel = aBig ? '>' : '<'
    const texA = A.map((e) => `2^{${e}}`).join(' + ')
    const texB = B.map((e) => `2^{${e}}`).join(' + ')
    const why = i === 0
      ? `Cea mai mare putere din $a$ este $2^{${A[0]}}$, iar din $b$ este $2^{${B[0]}}$. Cum $${A[0]} ${A[0] > B[0] ? '>' : '<'} ${B[0]}$, numărul ${A[0] > B[0] ? '$a$' : '$b$'} are mai multe cifre în baza 2.`
      : i === 1
        ? `Ambele numere conțin $2^{${A[0]}}$; comparăm următoarele puteri: $2^{${A[1]}}$ în $a$ și $2^{${B[1]}}$ în $b$. Cum $${A[1]} ${A[1] > B[1] ? '>' : '<'} ${B[1]}$, prima cifră diferită este 1 în ${A[1] > B[1] ? '$a$' : '$b$'}.`
        : `Ambele numere conțin $2^{${A[0]}} + 2^{${A[1]}}$, iar $b$ mai are în plus $2^{${B[2]}}$.`
    return {
      text: `Comparați numerele $a = ${texA}$ și $b = ${texB}$.`,
      solution: lines(
        'Scrise în baza 2, ambele numere au doar cifre de 0 și 1: cifra 1 apare pe pozițiile egale cu exponenții. O putere $2^k$ este mai mare decât suma tuturor puterilor mai mici ale lui 2, pentru că $1 + 2 + \\ldots + 2^{k-1} = 2^k - 1$.',
        why,
        `Deci $a ${rel} b$.`,
      ),
      verify: () => {
        const v = (l: number[]) => l.reduce((s, e) => s + 2n ** big(e), 0n)
        return v(A) !== v(B) && (aBig ? v(A) > v(B) : v(A) < v(B))
      },
    }
  }
}

// ================= the method of reduction to the unit (pp. 96–98) =================

const UNIT_ITEMS = [
  { pl: 'eșarfe', one: 'o eșarfă', verb: 'costă', verb1: 'costă', unit: 'lei', lo: 12, hi: 60, step: 1 },
  { pl: 'bilete de tramvai', one: 'un bilet de tramvai', verb: 'costă', verb1: 'costă', unit: 'lei', lo: 3, hi: 9, step: 1 },
  { pl: 'pâini de același fel', one: 'o pâine', verb: 'cântăresc', verb1: 'cântărește', unit: 'g', lo: 30, hi: 80, step: 10 },
  { pl: 'saci cu făină', one: 'un sac cu făină', verb: 'cântăresc', verb1: 'cântărește', unit: 'kg', lo: 20, hi: 50, step: 1 },
  { pl: 'metri de dantelă', one: 'un metru de dantelă', verb: 'costă', verb1: 'costă', unit: 'lei', lo: 8, hi: 45, step: 1 },
  { pl: 'cutii cu biscuiți', one: 'o cutie cu biscuiți', verb: 'cântăresc', verb1: 'cântărește', unit: 'g', lo: 8, hi: 30, step: 25 },
]

/** k things cost P: what do m of them cost? p. 96 ex. 1, p. 97 ex. 4, 5, 9. */
export function unitDirect(rng: Rng): Made {
  const c = pick(rng, UNIT_ITEMS)
  const k = int(rng, 2, 9)
  const u = int(rng, c.lo, c.hi) * c.step
  let m = int(rng, 2, 15)
  if (m === k) m = k + 1
  const P = k * u
  return {
    text: `Știind că ${k} ${c.pl} ${c.verb} ${qty(P, c.unit)}, calculați cât ${c.verb} ${deN(m)} ${c.pl}.`,
    solution: lines(
      `Aflăm întâi cât ${c.verb1} ${c.one}:`,
      show(`${nr(P)} : ${k} = ${nr(u)}`),
      `Apoi cât ${c.verb} ${deN(m)} ${c.pl}:`,
      show(`${m} \\cdot ${nr(u)} = ${nr(m * u)}`),
      `Deci ${deN(m)} ${c.pl} ${c.verb} ${qty(m * u, c.unit)}.`,
    ),
    verify: () => (P / k) * m === m * u && Number.isInteger(P / k),
  }
}

const INVERSE = [
  { pl: 'muncitori', plain: 'muncitori', one: 'muncitor', task: 'termină o lucrare', same: 'termină aceeași lucrare', unit: 'ore' },
  { pl: 'muncitori', plain: 'muncitori', one: 'muncitor', task: 'termină o lucrare', same: 'termină aceeași lucrare', unit: 'zile' },
  { pl: 'robinete cu același debit', plain: 'robinete', one: 'robinet', task: 'umplu un bazin', same: 'umplu același bazin', unit: 'ore' },
  { pl: 'tractoare de același fel', plain: 'tractoare', one: 'tractor', task: 'ară un teren', same: 'ară același teren', unit: 'zile' },
]

/** n workers need t hours: how long do m workers need? p. 96 ex. 3, p. 97 ex. 6, 8. */
export function unitInverse(rng: Rng): Made {
  for (;;) {
    const c = pick(rng, INVERSE)
    const n = int(rng, 2, 12)
    const t = int(rng, 2, 24)
    const m = int(rng, 2, 12)
    const r = (n * t) / m
    if (m === n || !Number.isInteger(r) || r < 2) continue
    return {
      text: `${n} ${c.pl} ${c.task} în ${qty(t, c.unit)}. În câte ${c.unit} ${c.same} ${m} ${c.plain}, lucrând în același ritm?`,
      solution: lines(
        `Un singur ${c.one} ar avea nevoie de un timp de ${n} ori mai mare:`,
        show(`${n} \\cdot ${t} = ${n * t}`),
        `${m} ${c.plain} au nevoie de un timp de ${m} ori mai mic:`,
        show(`${n * t} : ${m} = ${r}`),
        `Deci ${m} ${c.plain} ${c.same} în ${qty(r, c.unit)}.`,
      ),
      verify: () => n * t === m * r,
    }
  }
}

/** d km in t minutes: the time for another distance, or the distance in another time, p. 97 ex. 7. */
export function unitSpeed(rng: Rng): Made {
  const walker = rng() < 0.4
  const who = walker ? 'pieton' : 'biciclist'
  const p = walker ? int(rng, 10, 14) : int(rng, 2, 5)
  const d = int(rng, 2, walker ? 6 : 15)
  let d2 = int(rng, 2, walker ? 9 : 20)
  if (d2 === d) d2 = d + 1
  const askTime = rng() < 0.6
  return {
    text: askTime
      ? `Un ${who} parcurge ${d} km în ${qty(d * p, 'minute')}. În câte minute parcurge ${d2} km, mergând cu aceeași viteză?`
      : `Un ${who} parcurge ${d} km în ${qty(d * p, 'minute')}. Câți kilometri parcurge în ${qty(d2 * p, 'minute')}, mergând cu aceeași viteză?`,
    solution: lines(
      'Aflăm în câte minute parcurge un kilometru:',
      show(`${d * p} : ${d} = ${p}`),
      askTime ? `Pentru ${d2} km îi trebuie de ${d2} ori mai mult:` : `În ${qty(d2 * p, 'minute')} parcurge atâția kilometri de câte ori se cuprinde ${p} în ${d2 * p}:`,
      askTime ? show(`${d2} \\cdot ${p} = ${d2 * p}`) : show(`${d2 * p} : ${p} = ${d2}`),
      askTime ? `${cap(`${who}ul`)} parcurge ${d2} km în ${qty(d2 * p, 'minute')}.` : `${cap(`${who}ul`)} parcurge ${d2} km.`,
    ),
    verify: () => (d * p) / d === p && d2 * p / p === d2,
  }
}

/** N problems: in how many days at p a day, and how many a day to finish in d days, p. 97 ex. 12. */
export function unitTwoQuestions(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 3, 12)
    const a = int(rng, 4, 15)
    const n = p * a
    const ds: number[] = []
    for (let d = 3; d <= 30; d++) if (n % d === 0 && d !== a && d !== p) ds.push(d)
    if (!ds.length) continue
    const d = pick(rng, ds)
    const q = n / d
    const name = pick(rng, [...GIRLS, ...BOYS])
    const c = pick(rng, [
      { what: 'probleme', from: 'dintr-o culegere', verb: 'rezolve', verb3: 'rezolvă' },
      { what: 'pagini', from: 'ale unei cărți', verb: 'citească', verb3: 'citește' },
      { what: 'exerciții', from: 'dintr-un caiet de vacanță', verb: 'rezolve', verb3: 'rezolvă' },
    ])
    return {
      text: lines(
        `${name} își propune să ${c.verb} cele ${deN(n)} ${c.what} ${c.from}.`,
        `a) Dacă ${c.verb3} câte ${deN(p)} ${c.what} pe zi, în câte zile termină?`,
        `b) Dacă vrea să termine în ${dayQ(d)}, câte ${c.what} trebuie să ${c.verb} pe zi?`,
      ),
      solution: lines(
        `a) Aflăm de câte ori se cuprinde ${p} în ${n}: $${n} : ${p} = ${a}$, deci termină în ${dayQ(a)}.`,
        `b) Împărțim cele ${deN(n)} ${c.what} în mod egal la ${d} zile: $${n} : ${d} = ${q}$, deci câte ${deN(q)} ${c.what} pe zi.`,
      ),
      verify: () => n / p === a && n / d === q && Number.isInteger(q),
    }
  }
}

/** Q kg in n crates, an empty crate weighs w g: the weight of m full crates, p. 97 ex. 14. */
export function unitCrates(rng: Rng): Made {
  const fruit = pick(rng, ['mere', 'pere', 'prune', 'gutui', 'cartofi'])
  const c = int(rng, 5, 20)
  const n = int(rng, 8, 40)
  const Q = c * n
  const w = 50 * int(rng, 5, 18)
  let m = int(rng, 2, 12)
  if (m === n) m++
  const one = c * 1000 + w
  const total = m * one
  return {
    text: `Cantitatea de ${N(Q)} kg de ${fruit} a fost depozitată în ${deN(n)} lădițe de același fel, la fel de pline. Calculați cât cântăresc ${m} lădițe pline, știind că o lădiță goală cântărește ${w} g.`,
    solution: lines(
      `Într-o lădiță sunt $${nr(Q)} : ${n} = ${c}$ kg de ${fruit}, adică ${N(c * 1000)} g.`,
      `O lădiță plină cântărește $${nr(c * 1000)} + ${w} = ${nr(one)}$ g, iar ${m} lădițe pline:`,
      show(`${m} \\cdot ${nr(one)} = ${nr(total)} \\text{ g} = ${dec(total / 1000)} \\text{ kg}`),
    ),
    verify: () => (Q / n) * 1000 === c * 1000 && m * ((Q / n) * 1000 + w) === total,
  }
}

/** A team of n finishes in d days: if k more come, if k leave, p. 97 ex. 17. */
export function unitTeamChange(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 12)
    const d = int(rng, 6, 40)
    const k = int(rng, 1, 3)
    if (n - k < 2 || (n * d) % (n + k) || (n * d) % (n - k)) continue
    const more = (n * d) / (n + k)
    const less = (n * d) / (n - k)
    const who = k === 1 ? 'un muncitor' : `${k} muncitori`
    return {
      text: lines(
        `O echipă formată din ${n} muncitori termină o lucrare în ${dayQ(d)}. În câte zile se termină lucrarea dacă (toți muncitorii lucrează în același ritm):`,
        `a) mai ${k === 1 ? 'vine' : 'vin'} ${who};`,
        `b) ${k === 1 ? 'pleacă' : 'pleacă'} ${who}?`,
      ),
      solution: lines(
        `Un singur muncitor ar termina lucrarea în $${n} \\cdot ${d} = ${n * d}$ ${deW(n * d)}zile.`,
        `a) Echipa are $${n} + ${k} = ${n + k}$ muncitori, care termină de ${n + k} ori mai repede: $${n * d} : ${n + k} = ${more}$, adică în ${dayQ(more)}.`,
        `b) Echipa are $${n} - ${k} = ${n - k}$ muncitori: $${n * d} : ${n - k} = ${less}$, adică în ${dayQ(less)}.`,
      ),
      verify: () => (n + k) * more === n * d && (n - k) * less === n * d,
    }
  }
}

/** From V litres of sea water, V·s g of salt: how much water for S kg? p. 97 ex. 10. */
export function unitSalt(rng: Rng): Made {
  for (;;) {
    const s = pick(rng, [20, 25, 30, 35, 40, 50])
    const V = int(rng, 4, 30)
    const L = int(rng, 20, 400)
    if ((L * s) % 500 || L === V) continue
    const S = (L * s) / 1000
    if (S < 1) continue
    return {
      text: `Prin fierbere, din ${qty(V, 'litri')} de apă de mare se obțin ${N(V * s)} g de sare. De câți litri de apă de mare, cu aceeași concentrație, este nevoie pentru a obține $${dec(S)}$ kg de sare?`,
      solution: lines(
        `Dintr-un litru de apă de mare se obțin $${nr(V * s)} : ${V} = ${s}$ g de sare.`,
        `Transformăm: $${dec(S)} \\text{ kg} = ${nr(S * 1000)} \\text{ g}$. Numărul de litri este de câte ori se cuprinde ${s} în ${N(S * 1000)}:`,
        show(`${nr(S * 1000)} : ${s} = ${L}`),
        `Este nevoie de ${qty(L, 'litri')} de apă de mare.`,
      ),
      verify: () => (V * s) / V === s && L * s === Math.round(S * 1000),
    }
  }
}

/** A ha with T tractors in D days: A₂ ha with T₂ tractors, p. 98 ex. 20. */
export function unitTwoFactors(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 2, 6)
    const A = int(rng, 4, 20)
    const T = int(rng, 2, 6)
    const A2 = int(rng, 4, 40)
    const T2 = int(rng, 2, 12)
    if ((A * c) % T || (A2 * c) % T2 || A2 === A) continue
    const D = (A * c) / T
    const D2 = (A2 * c) / T2
    if (D < 2 || D2 < 2) continue
    return {
      text: `Pentru a ara o suprafață de ${A} ha de teren arabil, ${T} tractoare lucrează ${dayQ(D)}. Câte zile sunt necesare pentru a ara o suprafață de ${A2} ha folosind ${T2} tractoare care au aceeași normă?`,
      solution: lines(
        `Un singur tractor ar ara cele ${A} ha în $${T} \\cdot ${D} = ${T * D}$ ${deW(T * D)}zile.`,
        `Pentru 1 ha, un tractor are nevoie de $${T * D} : ${A} = ${c}$ zile.`,
        `Pentru ${A2} ha, un tractor ar avea nevoie de $${c} \\cdot ${A2} = ${c * A2}$ ${deW(c * A2)}zile, iar ${T2} tractoare de ${T2} ori mai puțin:`,
        show(`${c * A2} : ${T2} = ${D2}`),
        `Sunt necesare ${dayQ(D2)}.`,
      ),
      verify: () => (T * D) / A === c && (c * A2) / T2 === D2 && T2 * D2 * A === T * D * A2,
    }
  }
}

/** n taps fill a tank in h hours; after t hours k are closed: the rest of the time, p. 98 ex. 21. */
export function unitTapsClosed(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 5, 12)
    const h = int(rng, 3, 10)
    const t = int(rng, 1, h - 1)
    const k = int(rng, 1, n - 2)
    const r = (n * (h - t)) / (n - k)
    if (!Number.isInteger(r) || r < 2) continue
    return {
      text: `${n} robinete cu același debit umplu un rezervor în ${hourQ(h)}. După ${hourQ(t)} se închid ${k === 1 ? 'un robinet' : `${k} robinete`}. În câte ore umplu rezervorul robinetele rămase deschise? Cât a durat, în total, umplerea rezervorului?`,
      solution: lines(
        `Un singur robinet ar umple rezervorul în $${n} \\cdot ${h} = ${n * h}$ ${deW(n * h)}ore.`,
        `${t === 1 ? 'Într-o oră' : `În ${hourQ(t)}`}, cele ${n} robinete au umplut cât umple un singur robinet în $${n} \\cdot ${t} = ${n * t}$ ${deW(n * t)}ore. A mai rămas de umplut cât umple un robinet în $${n * h} - ${n * t} = ${n * (h - t)}$ ${deW(n * (h - t))}ore.`,
        `Rămân deschise $${n} - ${k} = ${n - k}$ robinete, care umplu restul de ${n - k} ori mai repede:`,
        show(`${n * (h - t)} : ${n - k} = ${r}`),
        `Robinetele rămase deschise mai lucrează ${hourQ(r)}, iar umplerea a durat în total $${t} + ${r} = ${t + r}$ ${deW(t + r)}ore.`,
      ),
      verify: () => n * t + (n - k) * r === n * h,
    }
  }
}

/** Two teams: p₁ days and q₁ days finish the work, and so do p₂ and q₂: each team alone, p. 98 ex. 22. */
export function unitTwoTeams(rng: Rng): Made {
  for (;;) {
    const dA = int(rng, 4, 20)
    const dB = int(rng, 4, 24)
    const m = pick(rng, [2, 3])
    const p2 = int(rng, 1, Math.max(1, Math.floor((dA - 1) / m)))
    const p1 = m * p2
    if (p1 >= dA || dA === dB) continue
    if ((dB * (dA - p1)) % dA || (dB * (dA - p2)) % dA) continue
    const q1 = (dB * (dA - p1)) / dA
    const q2 = (dB * (dA - p2)) / dA
    if (q1 < 1) continue
    const [rp, rq] = reduce(dB - q1, dB)
    return {
      text: `Două echipe de muncitori au de efectuat o lucrare. Dacă prima echipă lucrează ${dayQ(p1)}, iar a doua ${dayQ(q1)}, lucrarea se termină. Lucrarea se termină și dacă prima echipă lucrează ${dayQ(p2)}, iar a doua ${dayQ(q2)}. În câte zile termină lucrarea fiecare echipă, lucrând singură?`,
      solution: lines(
        `${m === 2 ? 'Dublăm' : 'Triplăm'} a doua situație: dacă prima echipă lucrează $${m} \\cdot ${p2} = ${p1}$ zile, iar a doua $${m} \\cdot ${q2} = ${m * q2}$ ${deW(m * q2)}zile, se fac ${m === 2 ? 'două' : 'trei'} lucrări.`,
        `Comparăm cu prima situație: prima echipă lucrează tot ${dayQ(p1)}, iar a doua lucrează cu $${m * q2} - ${q1} = ${m * q2 - q1}$ ${deW(m * q2 - q1)}zile mai mult și face în plus ${m === 2 ? 'o lucrare' : 'două lucrări'}.`,
        m === 2 ? `Deci a doua echipă face singură lucrarea în ${dayQ(dB)}.` : `Deci a doua echipă face singură o lucrare în $${m * q2 - q1} : 2 = ${dB}$ ${deW(dB)}zile.`,
        `În prima situație, a doua echipă lucrează ${dayQ(q1)}, adică face $${frac(q1, dB)}$ din lucrare. Prima echipă face restul, $${frac(dB - q1, dB)}$ din lucrare, în ${dayQ(p1)}, deci toată lucrarea o face în:`,
        show(rp === 1 ? `${p1} \\cdot ${rq} = ${dA}` : `${p1} \\cdot ${rq} : ${rp} = ${dA}`),
        `Prima echipă termină singură lucrarea în ${dayQ(dA)}, iar a doua în ${dayQ(dB)}.`,
      ),
      verify: () => Math.abs(p1 / dA + q1 / dB - 1) < 1e-9 && Math.abs(p2 / dA + q2 / dB - 1) < 1e-9 && (p1 * rq) / rp === dA,
    }
  }
}

// ================= the method of comparison (pp. 98–101) =================

/** p·a + q·b = N, so k·p·a + k·q·b = k·N (or the other way), p. 100 ex. 9 a, b. */
export function compareMultiple(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 6)
    const q = int(rng, 1, 6)
    if (gcd(p, q) !== 1 || p === q) continue
    const k = int(rng, 2, 5)
    const a = int(rng, 1, 20)
    const b = int(rng, 1, 20)
    const small = poly([[p, 'a'], [q, 'b']])
    const large = poly([[k * p, 'a'], [k * q, 'b']])
    const n = p * a + q * b
    const up = rng() < 0.5
    return {
      text: up
        ? `Se consideră numerele naturale $a$ și $b$. Dacă $${small} = ${n}$, calculați $${large}$.`
        : `Se consideră numerele naturale $a$ și $b$. Dacă $${large} = ${k * n}$, calculați $${small}$.`,
      solution: up
        ? lines('Dăm factor comun și folosim egalitatea dată:', show(`${large} = ${k} \\cdot (${small}) = ${k} \\cdot ${n} = ${k * n}`))
        : lines('Dăm factor comun în egalitatea dată:', show(`${large} = ${k} \\cdot (${small}) = ${k * n} \\Rightarrow ${small} = ${k * n} : ${k} = ${n}`)),
      verify: () => k * p * a + k * q * b === k * n && p * a + q * b === n,
    }
  }
}

const SUBST = [
  { A: 'batoane', a1: 'un baton', B: 'pâini', b1: 'o pâine', rel: (k: number) => `${k} batoane cântăresc cât o pâine`, verb: 'cântăresc', verb1: 'cântărește', unit: 'g', lo: 3, hi: 8, step: 10 },
  { A: 'buchete de zambile', a1: 'un buchet de zambile', B: 'buchete de lalele', b1: 'un buchet de lalele', rel: (k: number) => `${k} buchete de zambile costă cât un buchet de lalele`, verb: 'costă', verb1: 'costă', unit: 'lei', lo: 5, hi: 20, step: 1 },
  { A: 'caiete', a1: 'un caiet', B: 'cărți', b1: 'o carte', rel: (k: number) => `${k} caiete costă cât o carte`, verb: 'costă', verb1: 'costă', unit: 'lei', lo: 3, hi: 12, step: 1 },
]

/** k of A weigh as much as one B; nA of A and nB of B weigh T: replace B by A, p. 99 Problema 3, p. 100 ex. 10. */
export function compareSubstitution(rng: Rng): Made {
  const c = pick(rng, SUBST)
  const k = int(rng, 2, 8)
  const u = int(rng, c.lo, c.hi) * c.step
  const nA = int(rng, 2, 19)
  const nB = int(rng, 2, 9)
  const tot = nA + nB * k
  const T = tot * u
  return {
    text: `Se știe că ${c.rel(k)} și că ${nA} ${c.A} și ${nB} ${c.B} ${c.verb} ${qty(T, c.unit)}. Calculați cât ${c.verb1} ${c.a1} și cât ${c.verb1} ${c.b1}.`,
    solution: lines(
      `Înlocuim fiecare dintre cele ${nB} ${c.B} cu ${k} ${c.A}: ele ${c.verb} cât $${nB} \\cdot ${k} = ${nB * k}$ ${deW(nB * k)}${c.A}.`,
      `Atunci $${nA} + ${nB * k} = ${tot}$ ${deW(tot)}${c.A} ${c.verb} ${qty(T, c.unit)}, deci ${c.a1} ${c.verb1}:`,
      show(`${nr(T)} : ${tot} = ${u}`),
      `${cap(c.a1)} ${c.verb1} ${qty(u, c.unit)}, iar ${c.b1} ${c.verb1} $${k} \\cdot ${u} = ${k * u}$ ${SYMBOLS.has(c.unit) ? '' : deW(k * u)}${c.unit}.`,
    ),
    verify: () => nA * u + nB * k * u === T,
  }
}

/** Contradictory data (fewer tickets dearer) or insufficient data (one purchase k times the other), p. 99–100. */
export function compareBadData(rng: Rng): Made {
  if (rng() < 0.5) {
    const a = int(rng, 2, 6)
    const b = int(rng, 2, 5)
    const c = b + int(rng, 1, 3)
    const T1 = 5 * int(rng, 20, 120)
    const T2 = T1 - 5 * int(rng, 1, Math.max(1, Math.floor(T1 / 20)))
    return {
      text: `Pentru ${a} bilete la teatru și ${b} bilete la film se plătesc ${deN(T1)} lei, iar pentru ${a} bilete la teatru și ${c} bilete la film se plătesc ${deN(T2)} lei. Cât costă un bilet la film?`,
      solution: lines(
        `În ambele situații sunt ${a} bilete la teatru. A doua oară sunt cu $${c} - ${b} = ${c - b}$ ${c - b === 1 ? 'bilet' : 'bilete'} la film mai mult, deci ar trebui să se plătească mai mult; totuși se plătește mai puțin ($${T2} < ${T1}$).`,
        'Datele problemei sunt **contradictorii**, iar problema nu are soluție.',
      ),
      verify: () => T2 < T1 && c > b,
    }
  }
  for (;;) {
    const a = int(rng, 2, 4)
    const b = int(rng, 2, 4)
    const k = int(rng, 2, 3)
    const x = 5 * int(rng, 6, 30)
    const y = 5 * int(rng, 4, 16)
    const T2 = a * x + b * y
    const T1 = k * T2
    // another price of a theatre ticket that fits the same data
    let x2 = 0
    for (let t = x + 5; t < T2 / a; t += 5) if ((T2 - a * t) % b === 0 && T2 - a * t > 0) { x2 = t; break }
    if (!x2) continue
    const y2 = (T2 - a * x2) / b
    return {
      text: `Pentru ${k * a} bilete la teatru și ${k * b} bilete la film se plătesc ${deN(T1)} lei, iar pentru ${a} bilete la teatru și ${b} bilete la film se plătesc ${deN(T2)} lei. Cât costă un bilet la teatru?`,
      solution: lines(
        `Dacă înmulțim a doua situație cu ${k}, obținem ${k * a} bilete la teatru și ${k * b} bilete la film pentru $${k} \\cdot ${nr(T2)} = ${nr(T1)}$ ${deW(T1)}lei, adică exact prima situație. Cele două informații spun de fapt același lucru.`,
        `Datele sunt **insuficiente**: de exemplu, biletele ar putea costa ${deN(x)} lei la teatru și ${deN(y)} lei la film, dar și ${deN(x2)} lei la teatru și ${deN(y2)} lei la film ($${a} \\cdot ${x2} + ${b} \\cdot ${y2} = ${T2}$). Nu putem afla cât costă un bilet la teatru.`,
      ),
      verify: () => k * a * x + k * b * y === T1 && a * x2 + b * y2 === T2 && x2 !== x,
    }
  }
}

/** p·a + q·b = N₁ and q·a + p·b = N₂: add and subtract, p. 100 ex. 9 c. */
export function compareSymmetric(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 3, 9)
    const q = int(rng, 2, p - 1)
    const a = int(rng, 2, 20)
    const b = int(rng, 1, a - 1)
    const N1 = p * a + q * b
    const N2 = q * a + p * b
    const s = a + b
    const d = a - b
    if ((s + d) % 2) continue
    return {
      text: `Determinați numerele naturale $a$ și $b$, știind că $${p}a + ${q}b = ${N1}$ și $${q}a + ${p}b = ${N2}$.`,
      solution: lines(
        'Adunăm cele două egalități membru cu membru:',
        show(`${p + q}a + ${p + q}b = ${N1 + N2} \\Rightarrow ${p + q} \\cdot (a + b) = ${N1 + N2} \\Rightarrow a + b = ${s}`),
        'Scădem a doua egalitate din prima:',
        show(p - q === 1 ? `a - b = ${N1 - N2}` : `${p - q}a - ${p - q}b = ${N1 - N2} \\Rightarrow ${p - q} \\cdot (a - b) = ${N1 - N2} \\Rightarrow a - b = ${d}`),
        'Cunoaștem suma și diferența celor două numere:',
        show(`a = (${s} + ${d}) : 2 = ${a}, \\quad b = ${s} - ${a} = ${b}`),
      ),
      verify: () => p * a + q * b === N1 && q * a + p * b === N2,
    }
  }
}

const VEG = [['roșii', 'vinete'], ['mere', 'pere'], ['cartofi', 'ceapă'], ['struguri', 'prune'], ['portocale', 'banane']]

/** a kg + b kg and c kg + d kg with a + c = b + d: adding gives the price of 1 kg + 1 kg, p. 101 ex. 19. */
export function compareSumTrick(rng: Rng): Made {
  for (;;) {
    const [A, B] = pick(rng, VEG)
    const x = int(rng, 2, 15)
    const y = int(rng, 2, 15)
    const s = int(rng, 8, 30)
    const a = int(rng, 2, s - 2)
    const b = int(rng, 2, s - 2)
    const c = s - a
    const d = s - b
    if (a === b || c === d || (a === c && b === d)) continue
    const T1 = a * x + b * y
    const T2 = c * x + d * y
    const u = int(rng, 2, 9)
    return {
      text: lines(
        `Se știe că ${a} kg de ${A} și ${b} kg de ${B} costă ${deN(T1)} lei, iar ${c} kg de ${A} și ${d} kg de ${B} costă ${deN(T2)} lei.`,
        `a) Calculați cât costă 1 kg de ${A} împreună cu 1 kg de ${B}.`,
        `b) Calculați cât costă ${u} kg de ${A} împreună cu ${u} kg de ${B}.`,
      ),
      solution: lines(
        `a) Adunăm cele două cumpărături: $${a} + ${c} = ${s}$ kg de ${A} și $${b} + ${d} = ${s}$ kg de ${B} costă $${T1} + ${T2} = ${T1 + T2}$ ${deW(T1 + T2)}lei. Aceeași cantitate din fiecare, deci 1 kg de ${A} și 1 kg de ${B} costă:`,
        show(`${T1 + T2} : ${s} = ${x + y}`),
        `b) De ${u} ori mai mult: $${u} \\cdot ${x + y} = ${u * (x + y)}$ ${deW(u * (x + y))}lei.`,
      ),
      verify: () => (T1 + T2) / s === x + y,
    }
  }
}

/** The hound and the fox: jumps of different lengths at different rates, p. 101 ex. 20. */
export function compareHoundFox(rng: Rng): Made {
  for (;;) {
    const h = int(rng, 2, 6)
    const f = int(rng, h, h + 3)
    const a = int(rng, 2, 8)
    const b = int(rng, a + 1, a + 4)
    if (gcd(a, b) !== 1) continue
    const g = h * b - f * a
    if (g <= 0) continue
    const d = int(rng, 6, 60)
    if ((d * a) % g) continue
    const cycles = (d * a) / g
    if (cycles < 2 || cycles > 60) continue
    const H = h * cycles
    return {
      text: `Un ogar urmărește o vulpe care are ${deN(d)} sărituri înaintea lui. În timp ce ogarul face ${h} sărituri, vulpea face ${f} sărituri, iar ${a} sărituri ale ogarului au aceeași lungime ca ${b} sărituri ale vulpii. Câte sărituri trebuie să facă ogarul pentru a ajunge vulpea?`,
      solution: lines(
        `Măsurăm drumul în „pași mici”: o săritură a vulpii are ${a} pași mici. Cum ${a} sărituri ale ogarului au lungimea a ${b} sărituri ale vulpii, adică $${b} \\cdot ${a}$ pași mici, o săritură a ogarului are ${b} pași mici.`,
        `În timp ce ogarul face ${h} sărituri ($${h} \\cdot ${b} = ${h * b}$ ${deW(h * b)}pași mici), vulpea face ${f} sărituri ($${f} \\cdot ${a} = ${f * a}$ ${deW(f * a)}pași mici). Ogarul se apropie de fiecare dată cu $${h * b} - ${f * a} = ${g}$ ${g === 1 ? 'pas mic' : `${deW(g)}pași mici`}.`,
        `La început, vulpea are un avans de $${d} \\cdot ${a} = ${d * a}$ ${deW(d * a)}pași mici. Ogarul recuperează avansul după:`,
        show(`${d * a} : ${g} = ${cycles}`),
        `serii de câte ${h} sărituri, deci face $${cycles} \\cdot ${h} = ${H}$ ${deW(H)}sărituri.`,
      ),
      verify: () => H * b === d * a + (H / h) * f * a && Number.isInteger(H / h),
    }
  }
}

/** Three things priced in pencils: a pencil case is r₁ pencils, a box of paints r₂ pencils, p. 101 ex. 18. */
export function compareThreeItems(rng: Rng): Made {
  const c = pick(rng, [
    { A: 'penare', B: 'cutii de culori', C: 'creioane', a1: 'un penar', b1: 'o cutie de culori', c1: 'un creion', verb: 'costă', unit: 'lei', lo: 1, hi: 5, step: 1, intro: 'Pentru', paid: 's-a plătit suma de', theA: 'cele', theB: 'cele' },
    { A: 'pepeni', B: 'ananași', C: 'mere', a1: 'un pepene', b1: 'un ananas', c1: 'un măr', verb: 'cântărește', unit: 'g', lo: 10, hi: 25, step: 10, intro: 'Împreună,', paid: 'cântăresc', theA: 'cei', theB: 'cei' },
  ])
  const u = int(rng, c.lo, c.hi) * c.step
  const r1 = int(rng, 5, 20)
  const r2 = int(rng, 3, 15)
  const [nA, nC, nB] = [int(rng, 2, 6), int(rng, 2, 9), int(rng, 2, 6)]
  const [mA, mC, mB] = [int(rng, 2, 6), int(rng, 2, 9), int(rng, 2, 6)]
  const tot = nA * r1 + nC + nB * r2
  const T = tot * u
  const ask = mA * r1 + mC + mB * r2
  const amount = c.unit === 'lei' ? `${deN(T)} lei` : `${N(T)} g`
  return {
    text: `${c.intro} ${nA} ${c.A}, ${nC} ${c.C} și ${nB} ${c.B} ${c.paid} ${amount}. Se știe că ${c.a1} ${c.verb} cât ${r1} ${c.C}, iar ${c.b1} ${c.verb} cât ${r2} ${c.C}. Calculați cât ${c.unit === 'lei' ? 'costă' : 'cântăresc'} ${mA} ${c.A}, ${mC} ${c.C} și ${mB} ${c.B} împreună.`,
    solution: lines(
      `Înlocuim totul cu ${c.C}: ${c.theA} ${nA} ${c.A} valorează cât $${nA} \\cdot ${r1} = ${nA * r1}$ ${deW(nA * r1)}${c.C}, iar ${c.theB} ${nB} ${c.B} cât $${nB} \\cdot ${r2} = ${nB * r2}$ ${deW(nB * r2)}${c.C}.`,
      `În total: $${nA * r1} + ${nC} + ${nB * r2} = ${tot}$ ${deW(tot)}${c.C}, deci ${c.c1}:`,
      show(`${nr(T)} : ${tot} = ${u}`),
      `La fel, ${mA} ${c.A}, ${mC} ${c.C} și ${mB} ${c.B} valorează cât $${mA} \\cdot ${r1} + ${mC} + ${mB} \\cdot ${r2} = ${ask}$ ${deW(ask)}${c.C}:`,
      show(`${ask} \\cdot ${u} = ${nr(ask * u)}`),
      `Rezultatul: ${c.unit === 'lei' ? `${deN(ask * u)} lei` : `${N(ask * u)} g`}.`,
    ),
    verify: () => (nA * r1 * u + nC * u + nB * r2 * u) === T && mA * r1 * u + mC * u + mB * r2 * u === ask * u,
  }
}

/** a₁x + b₁y = N₁ and a₂x + b₂y = N₂ with neither a dividing the other: both multiplied, p. 99 Problema 2. */
export function compareBothMultiplied(rng: Rng): Made {
  for (;;) {
    const a1 = int(rng, 2, 7)
    const a2 = int(rng, 2, 7)
    if (a1 % a2 === 0 || a2 % a1 === 0) continue
    const b1 = int(rng, 1, 9)
    const b2 = int(rng, 1, 9)
    const x = int(rng, 2, 30)
    const y = int(rng, 2, 30)
    const L = lcm(a1, a2)
    const f1 = L / a1
    const f2 = L / a2
    const c1 = b1 * f1
    const c2 = b2 * f2
    if (c1 === c2) continue
    const N1 = a1 * x + b1 * y
    const N2 = a2 * x + b2 * y
    const M1 = N1 * f1
    const M2 = N2 * f2
    const [hi, lo, Mh, Ml] = c1 > c2 ? [c1, c2, M1, M2] : [c2, c1, M2, M1]
    const e1 = poly([[a1, 'x'], [b1, 'y']])
    const e2 = poly([[a2, 'x'], [b2, 'y']])
    return {
      text: `Aflați numerele naturale $x$ și $y$, știind că $${e1} = ${N1}$ și $${e2} = ${N2}$.`,
      solution: lines(
        `Ne propunem să avem același coeficient la $x$ în cele două egalități. Cel mai mic multiplu comun al lui ${a1} și ${a2} este ${L}, deci înmulțim prima egalitate cu ${f1} și a doua cu ${f2}:`,
        show(`\\begin{cases} ${poly([[L, 'x'], [c1, 'y']])} = ${nr(M1)} \\\\ ${poly([[L, 'x'], [c2, 'y']])} = ${nr(M2)} \\end{cases}`),
        'Scădem egalitățile membru cu membru și îl eliminăm pe $x$:',
        show(`${poly([[hi - lo, 'y']])} = ${nr(Mh)} - ${nr(Ml)} = ${nr(Mh - Ml)} \\Rightarrow y = ${y}`),
        `Din prima egalitate: $${a1}x = ${N1} - ${b1 === 1 ? '' : `${b1} \\cdot `}${y} = ${a1 * x} \\Rightarrow x = ${x}$.`,
      ),
      verify: () => (Mh - Ml) / (hi - lo) === y && (N1 - b1 * y) / a1 === x && a2 * x + b2 * y === N2,
    }
  }
}

/** a₁ of A are worth a₂ of B (both over 1): nA of A and nB of B, p. 101 ex. 13 and ex. 17. */
export function compareRatioSubstitution(rng: Rng): Made {
  for (;;) {
    const a2 = int(rng, 2, 4)
    const a1 = int(rng, a2 + 1, 6)
    if (gcd(a1, a2) !== 1) continue
    const t = int(rng, 1, 4)
    const nB = a2 * t
    const nA = int(rng, 2, 12)
    const pumps = rng() < 0.5
    const u = a2 * (pumps ? 100 * int(rng, 2, 20) : int(rng, 3, 20))
    const v = (a1 * u) / a2
    const tot = nA + t * a1
    const T = nA * u + nB * v
    if (pumps) {
      return {
        text: `Un bazin cu capacitatea de ${qty(T, 'litri')} este umplut într-o oră de ${nA} robinete și ${nB} pompe. Se știe că, într-o oră, prin ${a1} robinete curge aceeași cantitate de apă ca prin ${a2} pompe. Calculați debitul unei pompe și debitul unui robinet într-o oră.`,
        solution: lines(
          `Cele ${nB} pompe înseamnă ${t === 1 ? 'un grup' : `${t} grupuri`} de câte ${a2} pompe, iar fiecare grup dă cât ${a1} robinete. Deci pompele dau cât $${t} \\cdot ${a1} = ${t * a1}$ robinete.`,
          `Bazinul se umple într-o oră ca de $${nA} + ${t * a1} = ${tot}$ ${deW(tot)}robinete, deci un robinet dă:`,
          show(`${nr(T)} : ${tot} = ${nr(u)} \\text{ litri}`),
          `${a2} pompe dau cât ${a1} robinete, adică $${a1} \\cdot ${nr(u)} = ${nr(a1 * u)}$ litri, deci o pompă dă $${nr(a1 * u)} : ${a2} = ${nr(v)}$ litri pe oră.`,
        ),
        verify: () => nA * u + nB * v === T && a1 * u === a2 * v,
      }
    }
    return {
      text: `O croitoreasă cumpără ${nA} metri de dantelă și ${nB} metri de stofă, pentru care plătește ${deN(T)} lei. Se știe că ${a1} metri de dantelă costă cât ${a2} metri de stofă. Calculați cât costă un metru de dantelă și cât costă un metru de stofă.`,
      solution: lines(
        `Cei ${nB} metri de stofă înseamnă ${t === 1 ? 'o bucată' : `${t} bucăți`} de câte ${a2} metri, iar fiecare costă cât ${a1} metri de dantelă. Deci stofa costă cât $${t} \\cdot ${a1} = ${t * a1}$ metri de dantelă.`,
        `Croitoreasa plătește cât pentru $${nA} + ${t * a1} = ${tot}$ ${deW(tot)}metri de dantelă, deci un metru de dantelă costă:`,
        show(`${nr(T)} : ${tot} = ${u}`),
        `${a2} metri de stofă costă cât ${a1} metri de dantelă, adică $${a1} \\cdot ${u} = ${a1 * u}$ ${deW(a1 * u)}lei, deci un metru de stofă costă $${a1 * u} : ${a2} = ${v}$ ${deW(v)}lei.`,
      ),
      verify: () => nA * u + nB * v === T && a1 * u === a2 * v,
    }
  }
}

// ================= the figurative method (pp. 102–104) =================

/** The difference, and the quotient and remainder of big : small, Testul 3, I.1. */
export function figDiffQuotient(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 10, 200)
    const q = int(rng, 2, 9)
    const r = int(rng, 1, s - 1)
    if (r > 120) continue
    const b = q * s + r
    const D = b - s
    return {
      text: `Diferența a două numere naturale este ${N(D)}. Dacă împărțim numărul mare la numărul mic, obținem câtul ${q} și restul ${r}. Aflați cele două numere.`,
      solution: lines(
        `Numărul mare este de ${q} ori numărul mic și încă ${r}. Reprezentăm numărul mic printr-o parte; numărul mare are ${q} părți și încă ${r}.`,
        `Diferența lor înseamnă ${q - 1 === 1 ? 'o parte' : `${q - 1} părți`} și încă ${r}:`,
        show(`${nr(D)} - ${r} = ${nr(D - r)}${q - 1 === 1 ? '' : `, \\quad ${nr(D - r)} : ${q - 1} = ${s}`}`),
        `Numărul mic este ${s}, iar numărul mare este $${q} \\cdot ${s} + ${r} = ${nr(b)}$. Verificare: $${nr(b)} - ${s} = ${nr(D)}$ și $${r} < ${s}$.`,
      ),
      verify: () => b - s === D && Math.floor(b / s) === q && b % s === r,
    }
  }
}

const MULT: Record<number, string> = { 2: 'dublul', 3: 'triplul', 4: 'cvadruplul' }

/** Split T so that a·first = b·second: the parts are b and a, p. 103 ex. 5. */
export function figRatioParts(rng: Rng): Made {
  const [a, b] = pick(rng, [[2, 3], [3, 2], [3, 4], [4, 3]] as const)
  const u = int(rng, 5, 60)
  const first = b * u
  const second = a * u
  const T = (a + b) * u
  const money = rng() < 0.5
  return {
    text: money
      ? `Doi frați au împreună ${deN(T)} lei. ${cap(MULT[a])} sumei primului frate este egal cu ${MULT[b]} sumei celui de-al doilea. Ce sumă are fiecare frate?`
      : `Împărțiți ${N(T)} kg de fructe în două grămezi, astfel încât ${MULT[a]} cantității din prima grămadă să fie egal cu ${MULT[b]} cantității din a doua grămadă.`,
    solution: lines(
      `Reprezentăm ${money ? 'suma primului frate' : 'prima grămadă'} prin ${b} părți egale. Atunci ${MULT[a]} ei are $${a} \\cdot ${b} = ${a * b}$ părți, iar acestea reprezintă ${MULT[b]} ${money ? 'sumei celui de-al doilea' : 'celei de-a doua grămezi'}, deci ${money ? 'al doilea frate are' : 'a doua grămadă are'} $${a * b} : ${b} = ${a}$ părți.`,
      `În total sunt $${b} + ${a} = ${a + b}$ părți egale:`,
      show(`${nr(T)} : ${a + b} = ${u}, \\quad ${b} \\cdot ${u} = ${first}, \\quad ${a} \\cdot ${u} = ${second}`),
      money ? `Primul frate are ${deN(first)} lei, iar al doilea ${deN(second)} lei.` : `Prima grămadă are ${first} kg, iar a doua ${second} kg.`,
    ),
    verify: () => a * first === b * second && first + second === T,
  }
}

/** A rectangle: its width d less than its length (or k times smaller), and its perimeter, p. 104 ex. 9. */
export function figRectangle(rng: Rng): Made {
  const times = rng() < 0.4
  const W = int(rng, 4, 60)
  const d = int(rng, 2, 40)
  const k = int(rng, 2, 5)
  const L = times ? k * W : W + d
  const P = 2 * (L + W)
  const half = L + W
  return {
    text: times
      ? `Aflați lungimea și lățimea unui dreptunghi, știind că lungimea este de ${k} ori mai mare decât lățimea și că perimetrul dreptunghiului este de ${P} cm.`
      : `Aflați lungimea și lățimea unui dreptunghi, știind că lățimea este cu ${d} cm mai mică decât lungimea și că perimetrul dreptunghiului este de ${P} cm.`,
    solution: lines(
      `Perimetrul este suma celor patru laturi, deci lungimea și lățimea împreună au jumătate din perimetru: $${P} : 2 = ${half}$ cm.`,
      times
        ? `Reprezentăm lățimea printr-o parte; lungimea are ${k} părți. În total sunt ${k + 1} părți:`
        : `Reprezentăm lățimea printr-un segment; lungimea este același segment și încă ${d} cm:`,
      times ? show(`${half} : ${k + 1} = ${W}, \\quad ${k} \\cdot ${W} = ${L}`) : show(`${half} - ${d} = ${half - d}, \\quad ${half - d} : 2 = ${W}, \\quad ${W} + ${d} = ${L}`),
      `Lățimea este de ${W} cm, iar lungimea de ${L} cm. Verificare: $2 \\cdot (${L} + ${W}) = ${P}$.`,
    ),
    verify: () => 2 * (L + W) === P && (times ? L === k * W : L - W === d),
  }
}

/** Half of A's money = a third of B's = a fifth of C's: parts 2, 3, 5, p. 103 Problema 5. */
export function figEqualFractions(rng: Rng): Made {
  const [p, q, r] = shuffle(rng, [2, 3, 4, 5, 6]).slice(0, 3).sort((u, v) => u - v)
  const [A, B, C] = shuffle(rng, GIRLS).slice(0, 3)
  const u = int(rng, 4, 40)
  const S = (p + q + r) * u
  return {
    text: `${A}, ${B} și ${C} au împreună ${deN(S)} lei. ${cap(FR[p])} din suma pe care o are ${A} este egală cu ${FR[q]} din suma pe care o are ${B} și cu ${FR[r]} din suma pe care o are ${C}. Aflați ce sumă are fiecare.`,
    solution: lines(
      `Reprezentăm această valoare comună printr-o parte. Atunci ${A} are ${p} părți, ${B} are ${q} părți, iar ${C} are ${r} părți, în total $${p} + ${q} + ${r} = ${p + q + r}$ ${deW(p + q + r)}părți egale.`,
      show(`${nr(S)} : ${p + q + r} = ${u}`),
      `${A} are $${p} \\cdot ${u} = ${p * u}$ ${deW(p * u)}lei, ${B} are $${q} \\cdot ${u} = ${q * u}$ ${deW(q * u)}lei, iar ${C} are $${r} \\cdot ${u} = ${r * u}$ ${deW(r * u)}lei.`,
    ),
    verify: () => p * u + q * u + r * u === S && (p * u) / p === (q * u) / q && (q * u) / q === (r * u) / r,
  }
}

/** The second is k times the first; m times the first plus n times the second is T, p. 104 ex. 8. */
export function figWeightedSum(rng: Rng): Made {
  const k = int(rng, 2, 9)
  const m = pick(rng, [2, 3, 4])
  const n = pick(rng, [2, 3, 4])
  const x = int(rng, 3, 60)
  const parts = m + n * k
  const T = parts * x
  return {
    text: `Aflați două numere naturale, știind că al doilea număr este de ${k} ori mai mare decât primul, iar suma dintre ${MULT[m]} primului număr și ${MULT[n]} celui de-al doilea este ${N(T)}.`,
    solution: lines(
      `Reprezentăm primul număr printr-o parte; al doilea are ${k} părți. ${cap(MULT[m])} primului are ${m} părți, iar ${MULT[n]} celui de-al doilea are $${n} \\cdot ${k} = ${n * k}$ ${deW(n * k)}părți.`,
      `În total sunt $${m} + ${n * k} = ${parts}$ ${deW(parts)}părți egale:`,
      show(`${nr(T)} : ${parts} = ${x}, \\quad ${k} \\cdot ${x} = ${k * x}`),
      `Numerele sunt ${x} și ${k * x}.`,
    ),
    verify: () => m * x + n * k * x === T,
  }
}

/** Three children: the first has a more than the second, the third b more than the second, p. 103 ex. 3. */
export function figChainDifferences(rng: Rng): Made {
  const thing = pick(rng, ['timbre', 'cartonașe', 'abțibilduri', 'nuci', 'castane'])
  const x = int(rng, 10, 120)
  const a = int(rng, 3, 60)
  const b = int(rng, 3, 60)
  const T = 3 * x + a + b
  return {
    text: `Trei elevi au împreună ${deN(T)} ${thing}. Primul are cu ${deN(a)} ${thing} mai mult decât al doilea, iar al treilea are cu ${deN(b)} ${thing} mai mult decât al doilea. Câte ${thing} are fiecare elev?`,
    solution: lines(
      `Reprezentăm numărul de ${thing} al celui de-al doilea elev printr-un segment. Primul are același segment și încă ${a}, iar al treilea același segment și încă ${b}.`,
      `Dacă din total scădem surplusurile, rămân trei segmente egale:`,
      show(`${nr(T)} - ${a} - ${b} = ${3 * x}, \\quad ${3 * x} : 3 = ${x}`),
      `Al doilea elev are ${deN(x)} ${thing}, primul $${x} + ${a} = ${x + a}$, iar al treilea $${x} + ${b} = ${x + b}$.`,
    ),
    verify: () => x + (x + a) + (x + b) === T,
  }
}

/** Two equal pieces of cloth; after selling a and b metres, one rest is 1/k of the other, p. 104 ex. 21. */
export function figPiecesSold(rng: Rng): Made {
  const k = int(rng, 2, 5)
  const u = int(rng, 3, 30)
  const b = int(rng, 2, 20)
  const a = b + (k - 1) * u
  const L = u + a
  return {
    text: `Două bucăți de stofă au aceeași lungime. Dacă din prima bucată se vând ${qty(a, 'm')}, iar din a doua ${qty(b, 'm')}, atunci ce a rămas din prima bucată reprezintă ${FR[k]} din ce a rămas din a doua. Câți metri de stofă au fost în fiecare bucată?`,
    solution: lines(
      `Reprezentăm ce a rămas din prima bucată printr-o parte; din a doua au rămas ${k} părți.`,
      `Bucățile au fost egale, iar din prima s-a vândut cu $${a} - ${b} = ${a - b}$ m mai mult, deci restul celei de-a doua este cu ${a - b} m mai mare: ${k - 1 === 1 ? 'o parte' : `${k - 1} părți`} înseamnă ${a - b} m.`,
      ...(k - 1 === 1 ? [] : [show(`${a - b} : ${k - 1} = ${u}`)]),
      `Din prima bucată au rămas ${u} m, deci fiecare bucată a avut $${u} + ${a} = ${L}$ m. Verificare: $${L} - ${b} = ${L - b} = ${k} \\cdot ${u}$.`,
    ),
    verify: () => L - b === k * (L - a) && L - a === u,
  }
}

/** Pages in three days: the first day d more than the second, the second a half (third) of the third, p. 104 ex. 20. */
export function figPagesThreeDays(rng: Rng): Made {
  const name = pick(rng, [...GIRLS, ...BOYS])
  const m = pick(rng, [2, 3])
  const y = int(rng, 8, 60)
  const d = int(rng, 3, 40)
  const day1 = y + d
  const day3 = m * y
  const total = day1 + y + day3
  return {
    text: `${name} a citit o carte cu ${deN(total)} pagini în trei zile. În prima zi a citit cu ${deN(d)} pagini mai mult decât în a doua zi, iar în a doua zi a citit ${FR[m]} din numărul paginilor citite în a treia zi. Câte pagini a citit ${name} în fiecare zi?`,
    solution: lines(
      `Reprezentăm paginile citite în a doua zi printr-o parte. În a treia zi a citit ${m} părți, iar în prima zi o parte și încă ${deN(d)} pagini.`,
      `În total sunt $1 + 1 + ${m} = ${m + 2}$ părți și încă ${deN(d)} pagini:`,
      show(`${total} - ${d} = ${total - d}, \\quad ${total - d} : ${m + 2} = ${y}`),
      `A doua zi a citit ${deN(y)} pagini, a treia zi $${m} \\cdot ${y} = ${day3}$, iar prima zi $${y} + ${d} = ${day1}$. Verificare: $${day1} + ${y} + ${day3} = ${total}$.`,
    ),
    verify: () => day1 + y + day3 === total && day3 === m * y && day1 - y === d,
  }
}

/** a + b + c = S, b = a + d and c = k·b, p. 104 ex. 19. */
export function figChainRatio(rng: Rng): Made {
  const a = int(rng, 5, 150)
  const d = int(rng, 3, 80)
  const k = int(rng, 2, 5)
  const b = a + d
  const c = k * b
  const S = a + b + c
  return {
    text: `Suma a trei numere naturale $a$, $b$ și $c$ este ${N(S)}. Aflați cele trei numere, știind că $b$ este cu ${d} mai mare decât $a$ și de ${k} ori mai mic decât $c$.`,
    solution: lines(
      `Reprezentăm numărul $a$ printr-o parte. Atunci $b$ este o parte și încă ${d}, iar $c$ are de ${k} ori mai mult: ${k} părți și încă $${k} \\cdot ${d} = ${k * d}$.`,
      `În total sunt $1 + 1 + ${k} = ${k + 2}$ părți și încă $${d} + ${k * d} = ${(k + 1) * d}$:`,
      show(`${nr(S)} - ${(k + 1) * d} = ${nr(S - (k + 1) * d)}, \\quad ${nr(S - (k + 1) * d)} : ${k + 2} = ${a}`),
      `Deci $a = ${a}$, $b = ${a} + ${d} = ${b}$ și $c = ${k} \\cdot ${b} = ${c}$.`,
    ),
    verify: () => a + b + c === S && b - a === d && c === k * b,
  }
}

// ================= the backwards method (pp. 105–108) =================

/** a →(·m) b →(+p) c →(:q) d →(−s) result, in a random order of the operations, p. 105 and p. 107 ex. 6. */
export function backArrows(rng: Rng): Made {
  for (;;) {
    const order = shuffle(rng, ['mul', 'add', 'div', 'sub'])
    let v = int(rng, 2, 60)
    const vals = [v]
    const ops: [string, number][] = []
    let ok = true
    for (const o of order) {
      if (o === 'mul') {
        const m = int(rng, 2, 25)
        v *= m
        ops.push(['\\cdot', m])
      } else if (o === 'add') {
        const p = int(rng, 5, 500)
        v += p
        ops.push(['+', p])
      } else if (o === 'div') {
        const ds: number[] = []
        for (let q = 2; q <= 30; q++) if (v % q === 0 && v / q >= 2) ds.push(q)
        if (!ds.length) { ok = false; break }
        const q = pick(rng, ds)
        v /= q
        ops.push([':', q])
      } else {
        if (v < 4) { ok = false; break }
        const s = int(rng, 1, v - 2)
        v -= s
        ops.push(['-', s])
      }
      vals.push(v)
    }
    if (!ok || v > 100000) continue
    const L = ['a', 'b', 'c', 'd']
    const scheme = L.map((l, i) => `${l} \\xrightarrow{${ops[i][0]} ${nr(ops[i][1])}}`).join(' ') + ` ${nr(v)}`
    const back = [3, 2, 1, 0].map((i) => {
      const [o, n] = ops[i]
      const R = nr(vals[i + 1])
      const x = nr(vals[i])
      const l = L[i]
      if (o === '\\cdot') return `${l} \\cdot ${nr(n)} = ${R} \\Rightarrow ${l} = ${R} : ${nr(n)} = ${x}`
      if (o === '+') return `${l} + ${nr(n)} = ${R} \\Rightarrow ${l} = ${R} - ${nr(n)} = ${x}`
      if (o === ':') return `${l} : ${nr(n)} = ${R} \\Rightarrow ${l} = ${R} \\cdot ${nr(n)} = ${x}`
      return `${l} - ${nr(n)} = ${R} \\Rightarrow ${l} = ${R} + ${nr(n)} = ${x}`
    })
    let expr = nr(vals[0])
    let lastAdd = false
    for (const [o, n] of ops) {
      if ((o === '\\cdot' || o === ':') && lastAdd) expr = `(${expr})`
      expr = `${expr} ${o} ${nr(n)}`
      lastAdd = o === '+' || o === '-'
    }
    return {
      text: lines('Aflați numerele $a$, $b$, $c$ și $d$ din schema următoare:', show(scheme)),
      solution: lines(
        'Singurul număr cunoscut este rezultatul final, deci pornim de la el și facem, pe rând, operațiile inverse:',
        show(`\\begin{aligned} ${back.join(' \\\\ ')} \\end{aligned}`),
        `Deci $a = ${nr(vals[0])}$, $b = ${nr(vals[1])}$, $c = ${nr(vals[2])}$ și $d = ${nr(vals[3])}$.`,
        `Verificare: $${expr} = ${nr(v)}$.`,
      ),
      verify: () => ops.reduce((acc, [o, n]) => (o === '\\cdot' ? acc * n : o === '+' ? acc + n : o === ':' ? acc / n : acc - n), vals[0]) === v,
    }
  }
}

/** Doubles and spends, three times, and has F left, p. 106 ex. 1. */
export function backDoubleSpend(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 15, 200)
    const s1 = int(rng, 1, 2 * x - 5)
    const r1 = 2 * x - s1
    const s2 = int(rng, 1, 2 * r1 - 5)
    const r2 = 2 * r1 - s2
    const s3 = int(rng, 1, 2 * r2 - 5)
    const F = 2 * r2 - s3
    if (F < 5 || s1 < 2 || s2 < 2 || s3 < 2) continue
    const name = pick(rng, [...GIRLS, ...BOYS])
    return {
      text: `${name} are o sumă de bani. Dublează suma și cheltuiește ${deN(s1)} lei. Dublează suma rămasă și cheltuiește ${deN(s2)} lei. Dublează din nou suma rămasă și cheltuiește ${deN(s3)} lei, iar în final constată că mai are ${deN(F)} lei. Ce sumă a avut ${name} la început?`,
      solution: lines(
        'Mergem invers, de la sfârșit spre început: în locul cheltuielii adunăm, în locul dublării împărțim la 2.',
        `Înainte de ultima cheltuială avea $${F} + ${s3} = ${F + s3}$ ${deW(F + s3)}lei, iar înainte de ultima dublare $${F + s3} : 2 = ${r2}$ ${deW(r2)}lei.`,
        `Înainte de a doua cheltuială avea $${r2} + ${s2} = ${r2 + s2}$ ${deW(r2 + s2)}lei, iar înainte de a doua dublare $${r2 + s2} : 2 = ${r1}$ ${deW(r1)}lei.`,
        `Înainte de prima cheltuială avea $${r1} + ${s1} = ${r1 + s1}$ ${deW(r1 + s1)}lei, iar la început $${r1 + s1} : 2 = ${x}$ ${deW(x)}lei.`,
        `Verificare: $${x} \\cdot 2 - ${s1} = ${r1}$, $${r1} \\cdot 2 - ${s2} = ${r2}$, $${r2} \\cdot 2 - ${s3} = ${F}$.`,
      ),
      verify: () => (((x * 2 - s1) * 2 - s2) * 2 - s3) === F,
    }
  }
}

/** Spends 1/k of the money and m lei more, has F left, p. 106 ex. 4. */
export function backPartAndMore(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3, 4])
    const u = int(rng, 10, 150)
    const x = k * u
    const m = int(rng, 2, (k - 1) * u - 2)
    const F = x - u - m
    if (F < 2) continue
    const name = pick(rng, [...GIRLS, ...BOYS])
    return {
      text: `${name} cheltuiește ${FR[k]} din suma pe care o are și încă ${deN(m)} lei, iar apoi constată că mai are ${deN(F)} lei. Ce sumă a avut ${name}?`,
      solution: lines(
        `Înainte să cheltuiască cei ${deN(m)} lei, ${name} avea $${F} + ${m} = ${F + m}$ ${deW(F + m)}lei. Aceștia reprezintă ce rămâne după ce cheltuiește ${FR[k]} din sumă, adică ${leftOf(k)}:`,
        show(k === 2 ? `${F + m} \\cdot 2 = ${x}` : `${F + m} : ${k - 1} = ${u}, \\quad ${u} \\cdot ${k} = ${x}`),
        `${name} a avut ${deN(x)} lei. Verificare: $${x} - ${x} : ${k} - ${m} = ${x} - ${u} - ${m} = ${F}$.`,
      ),
      verify: () => x - x / k - m === F,
    }
  }
}

/** Two children each eat a part of what is left in the bowl; F fruits remain, p. 106 ex. 2, p. 107 ex. 11. */
export function backTwoParts(rng: Rng): Made {
  for (;;) {
    const d1 = pick(rng, [2, 3, 4, 5])
    const d2 = pick(rng, [2, 3, 4, 5])
    const F = int(rng, 2, 30)
    if ((F * d2) % (d2 - 1)) continue
    const r1 = (F * d2) / (d2 - 1)
    if ((r1 * d1) % (d1 - 1)) continue
    const x = (r1 * d1) / (d1 - 1)
    const e1 = x / d1
    const e2 = r1 / d2
    const [fruit, the] = pick(rng, [['prune', 'prunele'], ['caise', 'caisele'], ['piersici', 'piersicile'], ['mandarine', 'mandarinele'], ['cireșe', 'cireșele']])
    const [P1, P2] = shuffle(rng, [...GIRLS, ...BOYS]).slice(0, 2)
    return {
      text: `Într-o fructieră sunt ${fruit}. Vine ${P1} și mănâncă ${FR[d1]} din numărul lor, apoi vine ${P2} și mănâncă ${FR[d2]} din ${the} rămase. În fructieră au mai rămas ${deN(F)} ${fruit}. Câte ${fruit} erau la început și câte a mâncat fiecare copil?`,
      solution: lines(
        `Mergem invers. Cele ${deN(F)} ${fruit} rămase la sfârșit sunt ce a lăsat ${P2}, adică ${leftOf(d2)} din ${the} găsite de ${P2}:`,
        show(undo(F, d2)),
        `${P2} a găsit ${deN(r1)} ${fruit}. Acestea sunt ce a lăsat ${P1}, adică ${leftOf(d1)} din ${the} de la început:`,
        show(undo(r1, d1)),
        `La început erau ${deN(x)} ${fruit}. ${P1} a mâncat $${x} : ${d1} = ${e1}$, iar ${P2} $${r1} : ${d2} = ${e2}$.`,
      ),
      verify: () => x - x / d1 === r1 && r1 - r1 / d2 === F && e1 + e2 + F === x,
    }
  }
}

/** A school bus: k get off, then p/q of those left, then the last m, p. 107 ex. 10. */
export function backBus(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 12)
    const q = int(rng, 2, 5)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const t = int(rng, 2, 8)
    const R = q * t
    const m = (q - p) * t
    const n = R + k
    return {
      text: `Dintr-un autobuz școlar coboară la prima stație ${k} elevi, la următoarea stație coboară ${part(p, q)} din numărul elevilor rămași în autobuz, iar la a treia stație coboară ultimii ${deN(m)} elevi. Calculați câți elevi au fost în autobuz.`,
      solution: lines(
        `Mergem invers. Cei ${deN(m)} elevi de la ultima stație sunt cei rămași după a doua stație, adică $\\frac{${q - p}}{${q}}$ din elevii rămași după prima stație.`,
        show(q - p === 1 ? `${m} \\cdot ${q} = ${R}` : `${m} : ${q - p} = ${t}, \\quad ${t} \\cdot ${q} = ${R}`),
        `După prima stație au rămas ${deN(R)} elevi, deci în autobuz au fost $${R} + ${k} = ${n}$ ${deW(n)}elevi.`,
        `Verificare: $${n} - ${k} = ${R}$, $${R} - ${R} : ${q}${p === 1 ? '' : ` \\cdot ${p}`} = ${m}$.`,
      ),
      verify: () => n - k === R && R - (R / q) * p === m,
    }
  }
}

const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

/** When to leave home: a stop at a friend's, two walks and arriving early, p. 107 ex. 17. */
export function backSchedule(rng: Rng): Made {
  const S = 60 * int(rng, 8, 14) + pick(rng, [0, 30])
  const e = 5 * int(rng, 1, 3)
  const v = 5 * int(rng, 2, 12)
  const w1 = int(rng, 10, 30)
  const w2 = int(rng, 5, 25)
  const name = pick(rng, BOYS)
  const friend = pick(rng, BOYS.filter((b) => b !== name))
  const arrive = S - e
  const leaveFriend = arrive - w2
  const reachFriend = leaveFriend - v
  const leave = reachFriend - w1
  return {
    text: `${name} începe cursurile la ora ${clock(S)}. În drum spre școală vrea să se oprească la prietenul său ${friend}, pentru ${qty(v, 'minute')}. De acasă până la prieten face ${qty(w1, 'minute')}, iar de la prieten până la școală încă ${qty(w2, 'minute')}. La ce oră trebuie să plece ${name} de acasă pentru a ajunge la școală cu ${qty(e, 'minute')} înainte de începerea cursurilor?`,
    solution: lines(
      'Mergem invers, de la ora începerii cursurilor spre plecarea de acasă:',
      `- trebuie să ajungă la școală cu ${qty(e, 'minute')} mai devreme, adică la ora ${clock(arrive)};`,
      `- pleacă de la prieten cu ${qty(w2, 'minute')} înainte, la ora ${clock(leaveFriend)};`,
      `- ajunge la prieten cu ${qty(v, 'minute')} înainte, la ora ${clock(reachFriend)};`,
      `- pleacă de acasă cu ${qty(w1, 'minute')} înainte, la ora ${clock(leave)}.`,
      `${name} trebuie să plece de acasă la ora ${clock(leave)}. Verificare: $${w1} + ${v} + ${w2} + ${e} = ${w1 + v + w2 + e}$ ${deW(w1 + v + w2 + e)}minute de la plecare până la începerea cursurilor.`,
    ),
    verify: () => leave + w1 + v + w2 + e === S && leave > 0,
  }
}

/** Balloons: a part of the total, a part of the rest and some more, a part of the new rest and some more, p. 108 ex. 20. */
export function backBalloons(rng: Rng): Made {
  for (;;) {
    const F = int(rng, 4, 20)
    const c = pick(rng, [2, 3, 4, 5])
    const e2 = int(rng, 2, 8)
    if (((F + e2) * c) % (c - 1)) continue
    const R2 = ((F + e2) * c) / (c - 1)
    const b = pick(rng, [3, 4, 5, 6])
    const e1 = int(rng, 2, 8)
    if (((R2 + e1) * b) % (b - 1)) continue
    const R1 = ((R2 + e1) * b) / (b - 1)
    const a = pick(rng, [2, 3, 4])
    if ((R1 * a) % (a - 1)) continue
    const T = (R1 * a) / (a - 1)
    const red = T / a
    const yellow = R1 / b + e1
    const green = R2 / c + e2
    const name = pick(rng, BOYS)
    return {
      text: `La petrecerea organizată pentru aniversarea lui ${name} au fost cumpărate baloane roșii, galbene, verzi și albastre. Numărul baloanelor roșii este ${FR[a]} din numărul total, numărul baloanelor galbene este ${FR[b]} din rest și încă ${e1} baloane, numărul baloanelor verzi este ${FR[c]} din noul rest și încă ${e2} baloane, iar albastre sunt ${deN(F)} baloane. Aflați câte baloane de fiecare culoare au fost cumpărate.`,
      solution: lines(
        'Mergem invers, de la baloanele albastre spre numărul total.',
        `Noul rest este format din baloanele verzi și albastre. Dacă luăm din el ${FR[c]} și încă ${e2}, rămân cele ${F} albastre; deci $${F} + ${e2} = ${F + e2}$ baloane reprezintă ${leftOf(c)} din noul rest:`,
        show(undo(F + e2, c)),
        `Restul (fără cele roșii) este format din baloanele galbene și din noul rest. La fel, $${R2} + ${e1} = ${R2 + e1}$ baloane reprezintă ${leftOf(b)} din rest:`,
        show(undo(R2 + e1, b)),
        `Restul de ${deN(R1)} baloane reprezintă ${leftOf(a)} din numărul total:`,
        show(undo(R1, a)),
        `Au fost ${deN(T)} baloane: roșii $${T} : ${a} = ${red}$, galbene $${R1} : ${b} + ${e1} = ${yellow}$, verzi $${R2} : ${c} + ${e2} = ${green}$ și albastre ${F}. Verificare: $${red} + ${yellow} + ${green} + ${F} = ${T}$.`,
      ),
      verify: () => red + yellow + green + F === T && T - red === R1 && R1 - yellow === R2 && R2 - green === F,
    }
  }
}

/** A book read in four days: parts of what is left each day, the last day F pages, p. 107 ex. 12. */
export function backBookDays(rng: Rng): Made {
  for (;;) {
    const [d1, d2, d3] = [pick(rng, [2, 3, 4, 5]), pick(rng, [3, 4, 5, 6]), pick(rng, [2, 3, 4])]
    const F = int(rng, 10, 80)
    if ((F * d3) % (d3 - 1)) continue
    const r2 = (F * d3) / (d3 - 1)
    if ((r2 * d2) % (d2 - 1)) continue
    const r1 = (r2 * d2) / (d2 - 1)
    if ((r1 * d1) % (d1 - 1)) continue
    const n = (r1 * d1) / (d1 - 1)
    if (n > 600 || n < 60) continue
    const [p1, p2, p3] = [n / d1, r1 / d2, r2 / d3]
    const name = pick(rng, [...GIRLS, ...BOYS])
    return {
      text: lines(
        `${name} și-a propus să citească o carte în patru zile. În prima zi a citit ${FR[d1]} din numărul paginilor cărții, a doua zi ${FR[d2]} din numărul paginilor rămase, a treia zi ${FR[d3]} din ce mai avea de citit, iar a patra zi a citit ultimele ${deN(F)} pagini. Aflați:`,
        'a) câte pagini are cartea;',
        'b) câte pagini a citit în fiecare zi.',
      ),
      solution: lines(
        `a) Mergem invers. Cele ${deN(F)} pagini din a patra zi reprezintă ${leftOf(d3)} din ce rămăsese după a doua zi:`,
        show(undo(F, d3)),
        `Cele ${deN(r2)} pagini reprezintă ${leftOf(d2)} din ce rămăsese după prima zi:`,
        show(undo(r2, d2)),
        `Cele ${deN(r1)} pagini reprezintă ${leftOf(d1)} din carte:`,
        show(undo(r1, d1)),
        `Cartea are ${deN(n)} pagini.`,
        `b) Prima zi: $${n} : ${d1} = ${p1}$; a doua zi: $${r1} : ${d2} = ${p2}$; a treia zi: $${r2} : ${d3} = ${p3}$; a patra zi: ${F}. Verificare: $${p1} + ${p2} + ${p3} + ${F} = ${n}$.`,
      ),
      verify: () => p1 + p2 + p3 + F === n && n - p1 === r1 && r1 - p2 === r2 && r2 - p3 === F,
    }
  }
}

/** Marks at a test: 1/a got at most 6, p/q of the rest 7 or 8, half of the new rest 9, F got 10, p. 107 ex. 13. */
export function backTestMarks(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [3, 4, 5, 6])
    const [p, q] = pick(rng, [[2, 3], [3, 4], [1, 2], [2, 5], [3, 5], [1, 3]] as const)
    const F = int(rng, 2, 9)
    const R2 = 2 * F
    if ((R2 * q) % (q - p)) continue
    const R1 = (R2 * q) / (q - p)
    if ((R1 * a) % (a - 1)) continue
    const n = (R1 * a) / (a - 1)
    if (n > 60) continue
    const low = n / a
    const mid = (R1 / q) * p
    return {
      text: `La un test de matematică, ${FR[a]} din totalul elevilor au luat note mai mici sau egale cu 6, ${part(p, q)} din rest au luat note de 7 și de 8, jumătate din noul rest au luat nota 9, iar nota 10 au luat-o ${F} elevi. Calculați câți elevi au dat testul și câți au luat note mai mici sau egale cu 6.`,
      solution: lines(
        `Mergem invers. Noul rest este format din elevii cu nota 9 și cei cu nota 10, în număr egal, deci are $2 \\cdot ${F} = ${R2}$ elevi.`,
        `Noul rest reprezintă $\\frac{${q - p}}{${q}}$ din rest:`,
        show(q - p === 1 ? `${R2} \\cdot ${q} = ${R1}` : `${R2} : ${q - p} = ${R2 / (q - p)}, \\quad ${R2 / (q - p)} \\cdot ${q} = ${R1}`),
        `Restul de ${deN(R1)} elevi reprezintă ${leftOf(a)} din total:`,
        show(undo(R1, a)),
        `Testul l-au dat ${deN(n)} elevi, dintre care $${n} : ${a} = ${low}$ au luat note mai mici sau egale cu 6. Verificare: $${low} + ${mid} + ${F} + ${F} = ${n}$.`,
      ),
      verify: () => low + mid + F + F === n && R1 - mid === R2,
    }
  }
}

// ================= the method of the false hypothesis (pp. 108–110) =================

const TWO_KINDS: { text: (n: number, s: number, b: number, T: number, name: string) => string; s: [number, number]; b: [number, number]; unit: string; all: string; smallAll: string; oneBig: string; bigPl: string; smallPl: string }[] = [
  {
    text: (n, s, b, T) => `La un concert s-au vândut ${deN(n)} bilete, unele la prețul de ${deN(s)} lei și altele la prețul de ${deN(b)} lei, încasându-se în total ${deN(T)} lei. Câte bilete de fiecare fel au fost vândute?`,
    s: [3, 40], b: [5, 80], unit: 'lei', all: 'toate biletele', smallAll: `ar fi fost cele mai ieftine`, oneBig: 'bilet scump', bigPl: 'bilete scumpe', smallPl: 'bilete ieftine',
  },
  {
    text: (n, s, b, T, name) => `${name} a cumpărat ${deN(n)} prăjituri, unele la prețul de ${deN(s)} lei și altele la prețul de ${deN(b)} lei bucata, și a plătit ${deN(T)} lei. Câte prăjituri de fiecare fel a cumpărat?`,
    s: [3, 9], b: [5, 15], unit: 'lei', all: 'toate prăjiturile', smallAll: 'ar fi fost cele mai ieftine', oneBig: 'prăjitură scumpă', bigPl: 'prăjituri scumpe', smallPl: 'prăjituri ieftine',
  },
  {
    text: (n, s, b, T, name) => `${name} a cumpărat ${deN(n)} caiete, unele cu ${deN(s)} file și altele cu ${deN(b)} file. În total, caietele au ${deN(T)} file. Câte caiete de fiecare fel a cumpărat?`,
    s: [12, 48], b: [24, 100], unit: 'file', all: 'toate caietele', smallAll: `ar fi fost cele subțiri`, oneBig: 'caiet gros', bigPl: 'caiete groase', smallPl: 'caiete subțiri',
  },
  {
    text: (n, s, b, T) => `Se toarnă ${qty(T, 'litri')} de apă în ${deN(n)} vase, unele de ${s} litri și altele de ${b} litri, toate pline. Câte vase de fiecare fel au fost necesare?`,
    s: [2, 6], b: [3, 10], unit: 'litri', all: 'toate vasele', smallAll: 'ar fi fost cele mici', oneBig: 'vas mare', bigPl: 'vase mari', smallPl: 'vase mici',
  },
  {
    text: (n, s, b, T) => `${cap(`${N(T)} kg`)} de vișine au fost puse în ${deN(n)} lădițe, unele de ${s} kg și altele de ${b} kg, toate pline. Câte lădițe de fiecare fel s-au folosit?`,
    s: [3, 7], b: [4, 12], unit: 'kg', all: 'toate lădițele', smallAll: 'ar fi fost cele mici', oneBig: 'lădiță mare', bigPl: 'lădițe mari', smallPl: 'lădițe mici',
  },
  {
    text: (n, s, b, T) => `Într-o tabără, ${deN(T)} elevi au fost cazați în ${deN(n)} camere, unele cu ${s} paturi și altele cu ${b} paturi, toate ocupate. Câte camere de fiecare fel au fost?`,
    s: [2, 4], b: [3, 6], unit: 'elevi', all: 'toate camerele', smallAll: 'ar fi fost cele mici', oneBig: 'cameră mare', bigPl: 'camere mari', smallPl: 'camere mici',
  },
]

/** Two kinds with a total count and a total value: suppose all were the small kind, p. 109 ex. 1, 4, 10–13. */
export function falseTwoKinds(rng: Rng): Made {
  for (;;) {
    const c = pick(rng, TWO_KINDS)
    const s = int(rng, c.s[0], c.s[1])
    const b = int(rng, c.b[0], c.b[1])
    if (b <= s) continue
    const x = int(rng, 2, 40)
    const y = int(rng, 2, 40)
    const n = x + y
    const T = s * x + b * y
    const name = pick(rng, [...GIRLS, ...BOYS])
    const unitAfter = (v: number) => (SYMBOLS.has(c.unit) ? c.unit : `${deW(v)}${c.unit}`)
    return {
      text: c.text(n, s, b, T, name),
      solution: lines(
        `Presupunem că ${c.all} ${c.smallAll}. Atunci am avea $${n} \\cdot ${s} = ${nr(n * s)}$ ${unitAfter(n * s)}, cu $${nr(T)} - ${nr(n * s)} = ${nr(T - n * s)}$ ${unitAfter(T - n * s)} mai puțin decât în realitate.`,
        `Diferența apare pentru că fiecare ${c.oneBig} are cu $${b} - ${s} = ${b - s}$ ${unitAfter(b - s)} mai mult. Numărul de ${c.bigPl} este:`,
        show(`${nr(T - n * s)} : ${b - s} = ${y}`),
        `Numărul de ${c.smallPl} este $${n} - ${y} = ${x}$. Verificare: $${x} \\cdot ${s} + ${y} \\cdot ${b} = ${nr(T)}$.`,
      ),
      verify: () => x + y === n && s * x + b * y === T && (T - n * s) / (b - s) === y,
    }
  }
}

/** n shots (problems): a points for a hit, b lost for a miss, S in all, p. 108 Problema 2, p. 110 ex. 19. */
export function falsePenalty(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 10, 30)
    const a = int(rng, 3, 10)
    const b = int(rng, 1, a - 1)
    const miss = int(rng, 1, n - 2)
    const hit = n - miss
    const S = a * hit - b * miss
    if (S <= 0 || miss < 2) continue
    const shooting = rng() < 0.5
    const pts = (v: number) => `${deW(v)}puncte`
    return {
      text: shooting
        ? `La un concurs de tir, un sportiv a realizat ${deN(n)} lovituri și a obținut ${deN(S)} puncte. Pentru fiecare lovitură reușită primește ${a} puncte, iar pentru fiecare lovitură ratată pierde ${b === 1 ? 'un punct' : `${b} puncte`}. Câte lovituri a reușit sportivul?`
        : `La un concurs de matematică, un elev are de rezolvat ${deN(n)} probleme. Pentru fiecare problemă rezolvată corect primește ${a} puncte, iar pentru fiecare problemă greșită i se scad ${b === 1 ? 'un punct' : `${b} puncte`}. Câte probleme a rezolvat corect elevul, dacă a obținut ${deN(S)} puncte și le-a rezolvat pe toate?`,
      solution: lines(
        `Presupunem că toate ${shooting ? 'loviturile au fost reușite' : 'problemele au fost rezolvate corect'}. Atunci ar fi obținut $${n} \\cdot ${a} = ${n * a}$ ${pts(n * a)}, cu $${n * a} - ${S} = ${n * a - S}$ ${pts(n * a - S)} mai mult decât în realitate.`,
        `Fiecare ${shooting ? 'lovitură ratată' : 'problemă greșită'} îl costă $${a} + ${b} = ${a + b}$ ${pts(a + b)}: nu primește ${a} și i se scad ${b}. Numărul ${shooting ? 'loviturilor ratate' : 'problemelor greșite'} este:`,
        show(`${n * a - S} : ${a + b} = ${miss}`),
        `${shooting ? 'Lovituri reușite' : 'Probleme rezolvate corect'}: $${n} - ${miss} = ${hit}$. Verificare: $${hit} \\cdot ${a} - ${miss} \\cdot ${b} = ${a * hit} - ${b * miss} = ${S}$.`,
      ),
      verify: () => a * hit - b * miss === S && (n * a - S) / (a + b) === miss,
    }
  }
}

/** Can there be X bottles of the big kind? Then the real numbers, p. 110 ex. 18 and Testul 1, V.2. */
export function falsePossible(rng: Rng): Made {
  for (;;) {
    const bottles = rng() < 0.5
    const s = bottles ? 2 : 1
    const b = 5
    const x = int(rng, 3, 300)
    const y = int(rng, 3, 300)
    if (!bottles && x + y > 60) continue
    const n = x + y
    const V = s * x + b * y
    let X = int(rng, 2, n - 2)
    if (X === y) X = y + 1
    if (X > n - 1) continue
    const V2 = X * b + (n - X) * s
    const things = bottles ? 'sticle' : 'vase'
    const intro = bottles
      ? `La un magazin s-au adus ${deN(n)} sticle cu apă, unele cu capacitatea de 2 litri și altele cu capacitatea de 5 litri. În total, sticlele conțin ${qty(V, 'litri')} de apă.`
      : `Punem ${qty(V, 'litri')} de apă în ${deN(n)} vase, unele de un litru și altele de 5 litri, toate pline.`
    return {
      text: lines(intro, `a) Poate fi ${N(X)} numărul ${things === 'sticle' ? 'sticlelor' : 'vaselor'} de 5 litri? Justificați.`, `b) Calculați câte ${things} sunt de fiecare fel.`),
      solution: lines(
        `a) Dacă ar fi ${deN(X)} ${things} de 5 litri, celelalte $${nr(n)} - ${nr(X)} = ${nr(n - X)}$ ar fi ${things === 'sticle' ? 'de 2 litri' : 'de un litru'}, iar cantitatea de apă ar fi $${nr(X)} \\cdot 5 + ${nr(n - X)}${s === 1 ? '' : ' \\cdot 2'} = ${nr(V2)}$ litri, nu ${N(V)}. Deci nu este posibil.`,
        `b) Presupunem că toate ar fi ${things === 'sticle' ? 'de 2 litri' : 'de un litru'}: am avea ${s === 1 ? `${N(n)} litri` : `$${nr(n)} \\cdot 2 = ${nr(n * s)}$ litri`}, cu $${nr(V)} - ${nr(n * s)} = ${nr(V - n * s)}$ litri mai puțin. Fiecare ${things === 'sticle' ? 'sticlă' : 'vas'} de 5 litri are cu $5 - ${s} = ${5 - s}$ litri mai mult, deci:`,
        show(`${nr(V - n * s)} : ${5 - s} = ${nr(y)}`),
        `Sunt ${deN(y)} ${things} de 5 litri și $${nr(n)} - ${nr(y)} = ${nr(x)}$ ${deW(x)}${things} ${things === 'sticle' ? 'de 2 litri' : 'de un litru'}.`,
      ),
      verify: () => V2 !== V && s * x + b * y === V && (V - n * s) / (b - s) === y,
    }
  }
}

/** Both hypotheses side by side: if all had s rooms, if all had b rooms, then the real numbers, Test de autoevaluare I. */
export function falseBothHypotheses(rng: Rng): Made {
  const flats = rng() < 0.5
  const s = flats ? int(rng, 2, 3) : int(rng, 3, 5)
  const b = s + int(rng, 1, 2)
  const x = int(rng, 3, 30)
  const y = int(rng, 3, 30)
  const n = x + y
  const T = s * x + b * y
  const name = pick(rng, [...GIRLS, ...BOYS])
  const [thing, some, unit, all] = flats ? ['apartamente', 'camere', 'camere', 'apartamentele'] : ['mese', 'scaune', 'scaune', 'mesele']
  const intro = flats
    ? `În blocul în care locuiește ${name} sunt ${deN(n)} apartamente, unele cu ${s} camere, altele cu ${b} camere.`
    : `În sala de mese a unei grădinițe sunt ${deN(n)} mese, unele cu câte ${s} scaune, altele cu câte ${b} scaune.`
  return {
    text: lines(
      intro,
      `1) Dacă toate ${all} ar avea câte ${s} ${some}, câte ${unit} ar fi în total?`,
      `2) Dacă toate ${all} ar avea câte ${b} ${some}, câte ${unit} ar fi în total?`,
      `3) Dacă în total sunt ${deN(T)} ${unit}, câte ${thing} de fiecare fel sunt?`,
    ),
    solution: lines(
      `1) $${n} \\cdot ${s} = ${n * s}$ ${deW(n * s)}${unit}.`,
      `2) $${n} \\cdot ${b} = ${n * b}$ ${deW(n * b)}${unit}.`,
      `3) Față de prima presupunere sunt cu $${T} - ${n * s} = ${T - n * s}$ ${deW(T - n * s)}${unit} mai mult. Fiecare ${flats ? 'apartament' : 'masă'} cu ${b} ${some} are cu ${b - s === 1 ? (flats ? 'o cameră' : 'un scaun') : `${b - s} ${some}`} mai mult, deci:`,
      show(`${T - n * s} : ${b - s} = ${y}`),
      `Sunt ${deN(y)} ${thing} cu ${b} ${some} și $${n} - ${y} = ${x}$ ${deW(x)}${thing} cu ${s} ${some}. Verificare, cu a doua presupunere: $(${n * b} - ${T}) : ${b - s} = ${x}$.`,
    ),
    verify: () => s * x + b * y === T && (n * b - T) / (b - s) === x && (T - n * s) / (b - s) === y,
  }
}

/** Three prizes, the third prize k times as often as the first: a group of 1 + k replaced by second prizes, p. 110 ex. 20. */
export function falseThreePrizes(rng: Rng): Made {
  for (;;) {
    const p3 = 5 * int(rng, 4, 10)
    const p2 = p3 + 5 * int(rng, 1, 6)
    const p1 = p2 + 5 * int(rng, 1, 8)
    const k = int(rng, 2, 3)
    const g = p1 + k * p3
    const delta = (1 + k) * p2 - g
    if (delta <= 0) continue
    const f = int(rng, 2, 15)
    const sec = int(rng, 2, 25)
    const n = f + k * f + sec
    const M = f * p1 + sec * p2 + k * f * p3
    return {
      text: `Pentru premierea elevilor la olimpiada de matematică, o școală a cumpărat ${deN(n)} cărți: la prețul de ${deN(p3)} lei pentru premiul al treilea, la prețul de ${deN(p2)} lei pentru premiul al doilea și la prețul de ${deN(p1)} lei pentru premiul întâi. Calculați câți elevi au luat fiecare premiu, știind că numărul celor care au luat premiul al treilea este de ${k} ori mai mare decât al celor care au luat premiul întâi și că toate cărțile au costat ${deN(M)} lei.`,
      solution: lines(
        `Grupăm fiecare elev cu premiul întâi cu ${k} elevi cu premiul al treilea. Un astfel de grup are ${1 + k} elevi, iar cărțile lor costă $${p1} + ${k} \\cdot ${p3} = ${g}$ ${deW(g)}lei.`,
        `Presupunem că toți elevii ar fi luat premiul al doilea: cărțile ar fi costat $${n} \\cdot ${p2} = ${nr(n * p2)}$ ${deW(n * p2)}lei, cu $${nr(n * p2)} - ${nr(M)} = ${n * p2 - M}$ ${deW(n * p2 - M)}lei mai mult decât în realitate.`,
        `Un grup costă cu $${1 + k} \\cdot ${p2} - ${g} = ${delta}$ ${deW(delta)}lei mai puțin decât ${1 + k} cărți de câte ${deN(p2)} lei, deci numărul grupurilor este:`,
        show(`${n * p2 - M} : ${delta} = ${f}`),
        `Premiul întâi l-au luat ${f} elevi, premiul al treilea $${k} \\cdot ${f} = ${k * f}$ ${deW(k * f)}elevi, iar premiul al doilea $${n} - ${f} - ${k * f} = ${sec}$ ${deW(sec)}elevi.`,
      ),
      verify: () => f * p1 + sec * p2 + k * f * p3 === M && (n * p2 - M) / delta === f,
    }
  }
}

/** a lei for each right answer, b lei back for each wrong one, nobody owes anything after n problems. */
export function falseZeroBalance(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 10)
    const b = int(rng, 2, 10)
    if (a === b) continue
    const g = gcd(a, b)
    const t = int(rng, 1, 4)
    const c = (b / g) * t
    const w = (a / g) * t
    const n = c + w
    if (n > 40 || n < 6) continue
    return {
      text: `Un tată îi promite fiului său câte ${deN(a)} lei pentru fiecare problemă rezolvată corect, iar pentru fiecare problemă greșită fiul trebuie să-i dea tatălui câte ${deN(b)} lei. După ${deN(n)} probleme, niciunul nu îi mai datorează nimic celuilalt. Câte probleme a rezolvat corect fiul?`,
      solution: lines(
        `Presupunem că fiul ar fi rezolvat corect toate problemele. Atunci tatăl i-ar datora $${n} \\cdot ${a} = ${n * a}$ ${deW(n * a)}lei.`,
        `Fiecare problemă greșită în locul uneia corecte micșorează datoria tatălui cu $${a} + ${b} = ${a + b}$ ${deW(a + b)}lei: tatăl nu mai dă ${a} lei, iar fiul îi dă ${b} lei. Datoria trebuie să ajungă la 0, deci numărul problemelor greșite este:`,
        show(`${n * a} : ${a + b} = ${w}`),
        `Fiul a rezolvat corect $${n} - ${w} = ${c}$ probleme. Verificare: $${c} \\cdot ${a} = ${c * a}$ și $${w} \\cdot ${b} = ${w * b}$.`,
      ),
      verify: () => c * a === w * b && c + w === n && (n * a) / (a + b) === w,
    }
  }
}

/** Points from the start, unanswered questions, a for right and b lost for wrong: how many right. */
export function falseQuiz(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 15, 30)
    const P = 5 * int(rng, 1, 6)
    const a = int(rng, 3, 8)
    const b = int(rng, 1, a - 1)
    const u = int(rng, 2, 6)
    const answered = n - u
    const wrong = int(rng, 2, answered - 2)
    const right = answered - wrong
    const S = P + a * right - b * wrong
    if (a * right - b * wrong <= 0) continue
    const name = pick(rng, [...GIRLS, ...BOYS])
    return {
      text: `La un concurs cu ${deN(n)} întrebări, fiecare concurent primește ${deN(P)} puncte din oficiu. Pentru fiecare răspuns corect primește ${a} puncte, pentru fiecare răspuns greșit pierde ${b === 1 ? 'un punct' : `${b} puncte`}, iar pentru o întrebare la care nu răspunde nu primește și nu pierde nimic. ${name} nu a răspuns la ${u} întrebări și a obținut în total ${deN(S)} puncte. La câte întrebări a răspuns corect?`,
      solution: lines(
        `${name} a răspuns la $${n} - ${u} = ${answered}$ ${deW(answered)}întrebări, iar din răspunsuri a obținut $${S} - ${P} = ${S - P}$ ${deW(S - P)}puncte.`,
        `Presupunem că toate cele ${answered} răspunsuri ar fi corecte: ar fi obținut $${answered} \\cdot ${a} = ${answered * a}$ ${deW(answered * a)}puncte, cu $${answered * a} - ${S - P} = ${answered * a - (S - P)}$ ${deW(answered * a - (S - P))}puncte mai mult.`,
        `Fiecare răspuns greșit înseamnă $${a} + ${b} = ${a + b}$ puncte în minus, deci numărul răspunsurilor greșite este:`,
        show(`${answered * a - (S - P)} : ${a + b} = ${wrong}`),
        `${name} a răspuns corect la $${answered} - ${wrong} = ${right}$ ${deW(right)}întrebări. Verificare: $${P} + ${right} \\cdot ${a} - ${wrong} \\cdot ${b} = ${S}$.`,
      ),
      verify: () => P + a * right - b * wrong === S && (answered * a - (S - P)) / (a + b) === wrong,
    }
  }
}

// ================= the kinds =================

export const KINDS: GradeKind[] = [
  {
    id: 'v-powers-digits', label: 'Puteri: ordinea operațiilor, ultima cifră, zerouri, sume de puteri', topic: 'Algebră',
    forms: {
      1: [powersOrder, powersTower, powersZeros, powersLastDigitProduct],
      2: [powersLastDigitSum, powersTwoFive, powersSquareCheck],
      3: [powersCompare, powersGroupedSum, powersFindN, powersRemainder],
    },
  },
  {
    id: 'v-bases', label: 'Scrierea în baza 10 și în baza 2', topic: 'Algebră',
    forms: {
      1: [baseBinToDec, baseDecToBin, baseExpanded],
      2: [baseFind, baseSum, baseOrder, baseDigitEquation, baseAbBa],
      3: [baseFindSum, baseDigitsOf, baseRotations, baseBinaryCompare],
    },
  },
  {
    id: 'v-unit-method', label: 'Metoda reducerii la unitate', topic: 'Algebră',
    forms: {
      1: [unitDirect, unitInverse, unitSpeed],
      2: [unitTwoQuestions, unitCrates, unitTeamChange, unitSalt],
      3: [unitTwoFactors, unitTapsClosed, unitTwoTeams],
    },
  },
  {
    id: 'v-comparison-method', label: 'Metoda comparației', topic: 'Algebră',
    forms: {
      1: [compareMultiple, compareSubstitution],
      2: [compareBadData, compareSymmetric, compareSumTrick],
      3: [compareHoundFox, compareThreeItems, compareBothMultiplied, compareRatioSubstitution],
    },
  },
  {
    id: 'v-figurative-method', label: 'Metoda figurativă', topic: 'Algebră',
    forms: {
      1: [figDiffQuotient, figRatioParts, figRectangle],
      2: [figEqualFractions, figWeightedSum, figChainDifferences],
      3: [figPiecesSold, figPagesThreeDays, figChainRatio],
    },
  },
  {
    id: 'v-backwards-method', label: 'Metoda mersului invers', topic: 'Algebră',
    forms: {
      1: [backArrows, backDoubleSpend, backPartAndMore],
      2: [backTwoParts, backBus, backSchedule],
      3: [backBalloons, backBookDays, backTestMarks],
    },
  },
  {
    id: 'v-false-hypothesis', label: 'Metoda falsei ipoteze', topic: 'Algebră',
    forms: {
      1: [falseTwoKinds, falsePenalty],
      2: [falsePossible, falseBothHypotheses],
      3: [falseThreePrizes, falseZeroBalance, falseQuiz],
    },
  },
]
