// Exercises after the recap tests for the national exam (grade VIII, subjects II and III) that the user photographed
// on 10 November 2026: numbers written with digits, divisibility of sums of powers, word problems, the linear function,
// radicals with conjugates, rational expressions to bring to x, identities, inequalities with an absolute value.
// Each form keeps the shape and the difficulty of a model, with other numbers and a worked solution in Romanian.
import type { Made } from './generators'
import { de, frac, int, nonZero, pick, poly, reduce, rootParts, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
const over = (s: string) => `\\overline{${s}}`
const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n))

// ================= numbers: digits, powers, divisibility =================

/** The digit x for which a number with x among its digits is divisible by 3 or by 9. */
export function digitDivisible(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 1, 9), int(rng, 0, 9)]
    const by = pick(rng, [3, 9])
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => (a + x + b) % by === 0)
    if (!xs.length) continue
    return {
      text: `Determinați cifra $x$ pentru care numărul $${over(`${a}x${b}`)}$ este divizibil cu ${by}.`,
      solution: lines(
        `Un număr este divizibil cu ${by} dacă suma cifrelor lui este divizibilă cu ${by}: $${a} + x + ${b} = ${a + b} + x$.`,
        show(`${a + b} + x \\in M_{${by}} \\Rightarrow x \\in \\{${xs.join(', ')}\\}`),
      ),
      verify: () => xs.every((x) => (100 * a + 10 * x + b) % by === 0),
    }
  }
}

/** a^(n+2) + a^(n+1) + a^n is divisible by a² + a + 1. */
export function powerSumThree(rng: Rng): Made {
  const a = pick(rng, [2, 3, 4, 5, 6, 7])
  const s = a * a + a + 1
  // the exponents start at n + t, so that the sheet does not always show the same sum
  const t = int(rng, 0, 3)
  const e = (k: number) => (t + k === 0 ? 'n' : `n+${t + k}`)
  return {
    text: `Arătați că numărul $N = ${a}^{${e(2)}} + ${a}^{${e(1)}} + ${a}^{${e(0)}}$ este divizibil cu ${s}, pentru orice număr natural $n$.`,
    solution: lines('Dăm factor comun puterea cea mai mică:', show(`N = ${a}^{${e(0)}}(${a}^2 + ${a} + 1) = ${a}^{${e(0)}} \\cdot ${s}`), `deci $N$ este divizibil cu ${s}, oricare ar fi $n$.`),
    verify: () => [0, 1, 4].every((n) => (a ** (n + t + 2) + a ** (n + t + 1) + a ** (n + t)) % s === 0),
  }
}

/** a^n + a^(n+1) + a^(n+2) + a^(n+3) = a^n·(1 + a)(1 + a²), as in the tests: divisible by 10 for a = 3. */
export function powerSumFour(rng: Rng): Made {
  const a = pick(rng, [2, 3])
  const s = (1 + a) * (1 + a * a)
  const by = a === 3 ? pick(rng, [10, 20, 40]) : pick(rng, [5, 15])
  const t = int(rng, 0, 3)
  const e = (k: number) => (t + k === 0 ? 'n' : `n+${t + k}`)
  return {
    text: `Arătați că numărul $N = ${a}^{${e(0)}} + ${a}^{${e(1)}} + ${a}^{${e(2)}} + ${a}^{${e(3)}}$ este divizibil cu ${by}, pentru orice număr natural $n$.`,
    solution: lines(show(`N = ${a}^{${e(0)}}(1 + ${a} + ${a * a} + ${a ** 3}) = ${a}^{${e(0)}} \\cdot ${s}`), `Cum $${s} = ${by} \\cdot ${s / by}$, numărul $N$ este divizibil cu ${by}.`),
    verify: () => s % by === 0 && [0, 2, 5].every((n) => (a ** (n + t) + a ** (n + t + 1) + a ** (n + t + 2) + a ** (n + t + 3)) % by === 0),
  }
}

const isPrime = (n: number) => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every((d) => n % d !== 0)
const CONDITIONS: { text: string; ok: (a: number, b: number) => boolean }[] = [
  { text: 'divizibile cu 3', ok: (a, b) => (a + b) % 3 === 0 },
  { text: 'pare', ok: (_, b) => b % 2 === 0 },
  { text: 'impare', ok: (_, b) => b % 2 === 1 },
  { text: 'mai mari decât 50', ok: (a) => a >= 5 },
  { text: 'mai mici decât 60', ok: (a) => a < 6 },
  { text: 'divizibile cu 4', ok: (a, b) => (10 * a + b) % 4 === 0 },
  { text: 'divizibile cu 7', ok: (a, b) => (10 * a + b) % 7 === 0 },
  { text: 'prime', ok: (a, b) => isPrime(10 * a + b) },
  { text: 'cu cifra unităților mai mare decât 4', ok: (_, b) => b > 4 },
]

/** The numbers ab with √(ab − ba) natural: ab − ba = 9(a − b), so a − b is a square. */
export function digitsDifferenceRoot(rng: Rng): Made {
  for (;;) {
    const cond = pick(rng, CONDITIONS)
    const found: number[] = []
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (a !== b && isSquare(9 * (a - b)) && cond.ok(a, b)) found.push(10 * a + b)
    if (!found.length || found.length > 8) continue
    return {
      text: `Determinați numerele naturale de forma $${over('ab')}$, ${cond.text}, pentru care $\\sqrt{${over('ab')} - ${over('ba')}} \\in \\mathbb{N}$, cu $a \\neq b$ și $a, b \\neq 0$.`,
      solution: lines(
        show(`${over('ab')} - ${over('ba')} = 10a + b - 10b - a = 9(a - b)`),
        `$\\sqrt{9(a - b)} = 3\\sqrt{a - b} \\in \\mathbb{N}$ cere ca $a - b$ să fie pătrat perfect, adică $a - b \\in \\{1, 4\\}$ (cu $a, b$ cifre nenule). Dintre aceste numere le păstrăm pe cele ${cond.text}:`,
        show(`${over('ab')} \\in \\{${found.join(', ')}\\}`),
      ),
      verify: () => found.every((n) => isSquare(n - (n % 10) * 10 - Math.floor(n / 10))),
    }
  }
}

/** The numbers ab with √(ab + ba) natural: ab + ba = 11(a + b), so a + b = 11. */
export function digitsSumRoot(rng: Rng): Made {
  for (;;) {
    const cond = pick(rng, CONDITIONS)
    const found: number[] = []
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (isSquare(11 * (a + b)) && cond.ok(a, b)) found.push(10 * a + b)
    if (!found.length) continue
    return {
      text: `Determinați numerele naturale de forma $${over('ab')}$, ${cond.text}, pentru care $\\sqrt{${over('ab')} + ${over('ba')}} \\in \\mathbb{N}$.`,
      solution: lines(
        show(`${over('ab')} + ${over('ba')} = 10a + b + 10b + a = 11(a + b)`),
        '$11(a + b)$ este pătrat perfect doar dacă $a + b = 11$ (pentru că $a + b \\le 18$). Dintre numerele cu suma cifrelor 11 le păstrăm pe cele ' + cond.text + ':',
        show(`${over('ab')} \\in \\{${found.join(', ')}\\}`),
      ),
      verify: () => found.every((n) => isSquare(n + (n % 10) * 10 + Math.floor(n / 10))),
    }
  }
}

// ================= word problems =================

/** The girls are p% fewer than the boys; together they are T. */
export function percentGroup(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, [10, 20, 25, 40, 50])
    const b = int(rng, 6, 30)
    const g = (b * (100 - p)) / 100
    if (!Number.isInteger(g)) continue
    const T = b + g
    return {
      text: `Într-o clasă sunt ${de(T)} elevi. Determinați numărul băieților din clasă, știind că numărul fetelor este cu ${p}% mai mic decât numărul băieților.`,
      solution: lines(
        show(`f = b - \\frac{${p}}{100}b = \\frac{${100 - p}}{100}b`),
        show(`b + \\frac{${100 - p}}{100}b = ${T} \\Rightarrow \\frac{${200 - p}}{100}b = ${T} \\Rightarrow b = ${b}`),
        `Sunt ${de(b)} băieți (și ${de(g)} fete).`,
      ),
      verify: () => (b * (200 - p)) / 100 === T,
    }
  }
}

/** A fraction of the whole on the first day, a percent of the rest on the second, the last part on the third. */
export function threeDays(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3, 4, 5])
    const p = pick(rng, [20, 25, 40, 50, 60])
    const N = k * int(rng, 4, 60)
    const rest = (N * (k - 1)) / k
    const day2 = (p * rest) / 100
    if (!Number.isInteger(day2)) continue
    const R = rest - day2
    const [what, unit] = pick(rng, [['Un turist a parcurs un traseu', 'km'], ['Un elev a citit o carte', 'pagini']] as const)
    const piece = unit === 'km' ? 'din lungimea traseului' : 'din numărul paginilor'
    return {
      text: `${what} în trei zile. În prima zi a ${unit === 'km' ? 'parcurs' : 'citit'} $\\frac{1}{${k}}$ ${piece}, a doua zi ${p}% din rest, iar a treia zi ${unit === 'km' ? `ultimii ${R}` : `ultimele ${de(R)}`} ${unit}. Aflați ${unit === 'km' ? 'lungimea traseului' : 'câte pagini are cartea'}.`,
      solution: lines(
        `Fie $x$ totalul. După prima zi rămân $x - \\frac{x}{${k}} = \\frac{${k - 1}x}{${k}}$. A treia zi rămâne ${100 - p}% din acest rest:`,
        show(`\\frac{${100 - p}}{100} \\cdot \\frac{${k - 1}x}{${k}} = ${R} \\Rightarrow x = ${N}\\text{ ${unit}}`),
      ),
      verify: () => Math.abs(((100 - p) / 100) * ((k - 1) / k) * N - R) < 1e-9,
    }
  }
}

/** The mean of three numbers, each told by the first. */
export function averageProblem(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 3, 40)
    const d = int(rng, 1, 15)
    const m3 = x + (x + d) + 2 * x
    if (m3 % 3 !== 0) continue
    const m = m3 / 3
    return {
      text: `Media aritmetică a trei numere este ${m}. Al doilea număr este cu ${d} mai mare decât primul, iar al treilea este dublul primului. Aflați numerele.`,
      solution: lines(show(`x + (x + ${d}) + 2x = 3 \\cdot ${m} \\Rightarrow 4x + ${d} = ${3 * m} \\Rightarrow x = ${x}`), `Numerele sunt ${x}, ${x + d} și ${2 * x}.`),
      verify: () => 4 * x + d === 3 * m,
    }
  }
}

/** If each child gets a candies, r are left; if each gets b, m are missing. */
export function candies(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 5, 20)
    const a = int(rng, 3, 6)
    const b = a + int(rng, 1, 3)
    // at least two left over and two missing: "rămân 2 bomboane", never the singular
    const r = int(rng, 2, c)
    const m = c * (b - a) - r
    if (m < 2) continue
    const total = c * a + r
    return {
      text: `Un grup de copii au primit bomboane. Dacă fiecare copil primește câte ${a} bomboane, rămân ${de(r)} bomboane. Dacă fiecare primește câte ${b} bomboane, ar mai trebui ${de(m)} bomboane. Câți copii sunt și câte bomboane au primit?`,
      solution: lines(
        'Fie $c$ numărul copiilor; numărul bomboanelor se scrie în două feluri:',
        show(`${a}c + ${r} = ${b}c - ${m} \\Rightarrow ${b - a === 1 ? '' : b - a}c = ${r + m} \\Rightarrow c = ${c}`),
        `Sunt ${de(c)} copii și ${de(total)} bomboane.`,
      ),
      verify: () => total === c * b - m,
    }
  }
}

/** p% of the way on the first day, 1/k of the rest on the second, and on the third d km less (or more) than on the first. */
export function journeyDifference(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, [20, 25, 30, 40, 50, 60])
    const k = pick(rng, [2, 3, 4])
    const N = 20 * int(rng, 2, 30)
    const day1 = (p * N) / 100
    const rest = N - day1
    const day3 = rest - rest / k
    if (!Number.isInteger(rest / k) || day1 === day3) continue
    const d = Math.abs(day1 - day3)
    const less = day3 < day1
    return {
      text: `Un biciclist a parcurs un drum în trei zile. În prima zi a parcurs ${p}% din lungimea drumului, a doua zi $\\frac{1}{${k}}$ din rest, iar a treia zi cu ${d} km ${less ? 'mai puțin' : 'mai mult'} decât în prima zi. Care a fost lungimea drumului?`,
      solution: lines(
        `Fie $x$ lungimea drumului. Prima zi: $\\frac{${p}}{100}x$; rămâne $\\frac{${100 - p}}{100}x$; a treia zi parcurge $\\frac{${k - 1}}{${k}}$ din acest rest:`,
        show(`\\frac{${k - 1}}{${k}} \\cdot \\frac{${100 - p}}{100}x = \\frac{${p}}{100}x ${less ? '-' : '+'} ${d} \\Rightarrow x = ${N}\\text{ km}`),
      ),
      verify: () => Math.abs(((k - 1) / k) * ((100 - p) / 100) * N - ((p / 100) * N + (less ? -d : d))) < 1e-9,
    }
  }
}

// ================= the linear function =================

const fx = (a: number, b: number) => `f(x) = ${poly([[a, 'x'], [b, '']])}`

/** The m for which a point A(m, c) lies on the graph. */
export function pointOnGraph(rng: Rng): Made {
  const [a, b] = [nonZero(rng, -5, 5), nonZero(rng, -9, 9)]
  const m = nonZero(rng, -8, 8)
  const c = a * m + b
  return {
    text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $${fx(a, b)}$. Determinați numărul real $m$ pentru care punctul $A(m, ${c})$ aparține graficului funcției $f$.`,
    solution: show(`f(m) = ${c} \\Rightarrow ${poly([[a, 'm'], [b, '']])} = ${c} \\Rightarrow ${poly([[a, 'm']])} = ${c - b} \\Rightarrow m = ${m}`),
    verify: () => a * m + b === c,
  }
}

/** f(1) + f(2) + … + f(n). */
export function valuesSum(rng: Rng): Made {
  const [a, b] = [nonZero(rng, -4, 6), nonZero(rng, -9, 9)]
  const n = int(rng, 5, 30)
  const s = (a * n * (n + 1)) / 2 + b * n
  return {
    text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $${fx(a, b)}$. Calculați $f(1) + f(2) + \\dots + f(${n})$.`,
    solution: show(`${a === 1 ? '' : a === -1 ? '-' : a}(1 + 2 + \\dots + ${n}) ${b < 0 ? '-' : '+'} ${n} \\cdot ${Math.abs(b)} = ${a === 1 ? '' : a === -1 ? '-' : `${paren2(a)} \\cdot `}\\frac{${n} \\cdot ${n + 1}}{2} ${b < 0 ? '-' : '+'} ${Math.abs(b * n)} = ${s}`),
    verify: () => Array.from({ length: n }, (_, i) => a * (i + 1) + b).reduce((t, v) => t + v, 0) === s,
  }
}
const paren2 = (n: number) => (n < 0 ? `(${n})` : String(n))

/** Where the graph meets the axes, and the area of the triangle it makes with them. */
export function axesTriangle(rng: Rng): Made {
  const a = nonZero(rng, -4, 4)
  const m = nonZero(rng, -6, 6)
  const b = -a * m
  return {
    text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $${fx(a, b)}$. Determinați coordonatele punctelor de intersecție ale graficului cu axele și calculați aria triunghiului format de grafic cu axele de coordonate.`,
    solution: lines(
      show(`f(x) = 0 \\Rightarrow x = ${m} \\Rightarrow A(${m}, 0); \\qquad f(0) = ${b} \\Rightarrow B(0, ${b})`),
      'Triunghiul $AOB$ este dreptunghic în $O$:',
      show(`\\mathcal{A}_{AOB} = \\frac{OA \\cdot OB}{2} = \\frac{${Math.abs(m)} \\cdot ${Math.abs(b)}}{2} = ${frac(Math.abs(m * b), 2)}`),
    ),
    verify: () => a * m + b === 0,
  }
}

/** The linear function whose graph passes through two given points. */
export function throughTwoPoints(rng: Rng): Made {
  const [a, b] = [nonZero(rng, -5, 5), int(rng, -9, 9)]
  const x1 = int(rng, -5, 5)
  let x2 = int(rng, -5, 5)
  if (x2 === x1) x2 = x1 + int(rng, 1, 4)
  const [y1, y2] = [a * x1 + b, a * x2 + b]
  return {
    text: `Determinați funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ax + b$, al cărei grafic conține punctele $A(${x1}, ${y1})$ și $B(${x2}, ${y2})$.`,
    solution: lines(
      show(`\\begin{cases} ${poly([[x1, 'a']]).replace(/^0$/, '0')} + b = ${y1} \\\\ ${poly([[x2, 'a']]).replace(/^0$/, '0')} + b = ${y2} \\end{cases}`),
      'Scădem ecuațiile:',
      show(`${x2 - x1 === 1 ? '' : x2 - x1 === -1 ? '-' : x2 - x1}a = ${y2 - y1} \\Rightarrow a = ${a}, \\quad b = ${b}, \\qquad ${fx(a, b)}`),
    ),
    verify: () => a * x1 + b === y1 && a * x2 + b === y2,
  }
}

/** The radius of the circle round the triangle that the graph makes with the axes: half its hypotenuse. */
export function circumRadius(rng: Rng): Made {
  const a = nonZero(rng, -4, 4)
  const m = nonZero(rng, -5, 5)
  const b = -a * m
  const h2 = m * m + b * b
  const [k, r] = rootParts(h2)
  return {
    text: lines(
      `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $${fx(a, b)}$.`,
      'a) Determinați punctele de intersecție ale graficului funcției cu axele de coordonate.',
      'b) Calculați raza cercului circumscris triunghiului determinat de axele de coordonate și de graficul funcției.',
    ),
    solution: lines(
      show(`\\text{a) } A(${m}, 0), \\quad B(0, ${b})`),
      'b) Triunghiul $AOB$ este dreptunghic în $O$, deci raza cercului circumscris este jumătate din ipotenuza $AB$:',
      show(`AB = \\sqrt{${m * m} + ${b * b}} = ${surd(k, 1, r)}, \\qquad R = \\frac{AB}{2} = ${surd(k, 2, r)}`),
    ),
    verify: () => Math.abs((k * Math.sqrt(r)) ** 2 - h2) < 1e-9,
  }
}

/** The distance from the origin to the graph: the height on the hypotenuse of that triangle. */
export function distanceFromOrigin(rng: Rng): Made {
  const a = nonZero(rng, -4, 4)
  const m = nonZero(rng, -5, 5)
  const b = -a * m
  const h2 = m * m + b * b
  const [k, r] = rootParts(h2)
  // d = OA·OB / AB = |m·b| / (k√r) = |m·b|·√r / (k·r)
  const [p, q] = reduce(Math.abs(m * b), k * r)
  return {
    text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $${fx(a, b)}$. Calculați distanța de la originea axelor de coordonate la graficul funcției $f$.`,
    solution: lines(
      `Graficul taie axele în $A(${m}, 0)$ și $B(0, ${b})$. Distanța cerută este înălțimea din $O$ a triunghiului dreptunghic $AOB$:`,
      show(`AB = \\sqrt{${m * m} + ${b * b}} = ${surd(k, 1, r)}, \\qquad d = \\frac{OA \\cdot OB}{AB} = \\frac{${Math.abs(m * b)}}{${surd(k, 1, r)}} = ${surd(p, q, r)}`),
    ),
    verify: () => Math.abs((p / q) * Math.sqrt(r) - Math.abs(m * b) / Math.sqrt(h2)) < 1e-9,
  }
}

// ================= radicals: conjugates and means =================

/** p² − r²q = 1: (p − r√q)(p + r√q) = 1. */
// all of them with p ≤ 40 and q without square factors, so that a long sheet need not repeat one
const UNITS: [number, number, number][] = (() => {
  const out: [number, number, number][] = []
  for (let q = 2; q <= 30; q++) {
    if (rootParts(q)[0] !== 1) continue
    for (let r = 1; r <= 20; r++) {
      const p = Math.sqrt(r * r * q + 1)
      if (Number.isInteger(p) && p <= 40) out.push([p, r, q])
    }
  }
  return out
})()

export function rationalizeSimple(rng: Rng): Made {
  const q = pick(rng, [2, 3, 5, 6, 7])
  const k = int(rng, 2, 6)
  const j = int(rng, 1, 6)
  const total = k - j
  return {
    text: `Calculați: $\\sqrt{${k * k * q}} - \\frac{${j * q}}{\\sqrt{${q}}}$.`,
    solution: show(`\\sqrt{${k * k * q}} - \\frac{${j * q}}{\\sqrt{${q}}} = ${k}\\sqrt{${q}} - \\frac{${j * q}\\sqrt{${q}}}{${q}} = ${k}\\sqrt{${q}} - ${j === 1 ? '' : j}\\sqrt{${q}} = ${surd(total, 1, q)}`),
    verify: () => true,
  }
}

export function squareOfSum(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 2, 15), int(rng, 2, 15)]
    if (a === b || isSquare(a) || isSquare(b)) continue
    return {
      text: `Calculați: $(\\sqrt{${a}} + \\sqrt{${b}})^2 - 2\\sqrt{${a * b}}$.`,
      solution: show(`(\\sqrt{${a}} + \\sqrt{${b}})^2 - 2\\sqrt{${a * b}} = ${a} + 2\\sqrt{${a * b}} + ${b} - 2\\sqrt{${a * b}} = ${a + b}`),
      verify: () => Math.abs((Math.sqrt(a) + Math.sqrt(b)) ** 2 - 2 * Math.sqrt(a * b) - (a + b)) < 1e-9,
    }
  }
}

/** 1/(m + √(m² + 1)) + 1/(√(m² + 1) + √(m² + 2)) + … + 1/(√(N − 1) + √N) = √N − m, with N = n². */
export function telescoping(rng: Rng): Made {
  const m = pick(rng, [1, 1, 2, 3, 4, 5, 6])
  const n = int(rng, m + 2, m + 25)
  const N = n * n
  const M = m * m
  return {
    text: `Arătați că numărul $a = \\frac{1}{${m} + \\sqrt{${M + 1}}} + \\frac{1}{\\sqrt{${M + 1}} + \\sqrt{${M + 2}}} + \\dots + \\frac{1}{\\sqrt{${N - 1}} + \\sqrt{${N}}}$ este natural.`,
    solution: lines(
      'Raționalizăm fiecare termen cu conjugata numitorului:',
      show(`\\frac{1}{\\sqrt{k} + \\sqrt{k + 1}} = \\frac{\\sqrt{k + 1} - \\sqrt{k}}{(k + 1) - k} = \\sqrt{k + 1} - \\sqrt{k}`),
      `Primul termen este cel cu $k = ${M}$, iar $\\sqrt{${M}} = ${m}$. Termenii se reduc doi câte doi:`,
      show(`a = (\\sqrt{${M + 1}} - ${m}) + (\\sqrt{${M + 2}} - \\sqrt{${M + 1}}) + \\dots + (\\sqrt{${N}} - \\sqrt{${N - 1}}) = \\sqrt{${N}} - ${m} = ${n - m} \\in \\mathbb{N}`),
    ),
    verify: () => Math.abs(Array.from({ length: N - M }, (_, i) => 1 / (Math.sqrt(M + i) + Math.sqrt(M + i + 1))).reduce((t, v) => t + v, 0) - (n - m)) < 1e-9,
  }
}

/** a = 1/(p − r√q) − r√q is the natural number p. */
export function conjugateNatural(rng: Rng): Made {
  const [p, r, q] = pick(rng, UNITS)
  const rq = `${r === 1 ? '' : r}\\sqrt{${q}}`
  return {
    text: `Arătați că numărul $a = \\frac{1}{${p} - ${rq}} - ${rq}$ este natural.`,
    solution: lines(
      'Amplificăm fracția cu conjugata numitorului:',
      show(`\\frac{1}{${p} - ${rq}} = \\frac{${p} + ${rq}}{${p * p} - ${r * r * q}} = ${p} + ${rq}`),
      show(`a = ${p} + ${rq} - ${rq} = ${p} \\in \\mathbb{N}`),
    ),
    verify: () => Math.abs(1 / (p - r * Math.sqrt(q)) - r * Math.sqrt(q) - p) < 1e-6,
  }
}

/** The arithmetic and the geometric mean of 1/(p − r√q) and 1/(p + r√q). */
export function conjugateMeans(rng: Rng): Made {
  const [p, r, q] = pick(rng, UNITS)
  const rq = `${r === 1 ? '' : r}\\sqrt{${q}}`
  return {
    text: `Se consideră numerele $a = \\frac{1}{${p} - ${rq}}$ și $b = \\frac{1}{${p} + ${rq}}$. Calculați media aritmetică și media geometrică a numerelor $a$ și $b$.`,
    solution: lines(
      show(`a = \\frac{${p} + ${rq}}{${p * p} - ${r * r * q}} = ${p} + ${rq}, \\qquad b = \\frac{${p} - ${rq}}{${p * p} - ${r * r * q}} = ${p} - ${rq}`),
      show(`m_a = \\frac{a + b}{2} = \\frac{${2 * p}}{2} = ${p}, \\qquad m_g = \\sqrt{a \\cdot b} = \\sqrt{${p * p} - ${r * r * q}} = 1`),
    ),
    verify: () => p * p - r * r * q === 1,
  }
}

/** The rational numbers a, b with (p + r√q)² = a + b√q. */
export function rationalEquality(rng: Rng): Made {
  const q = pick(rng, [2, 3, 5, 6, 7])
  const p = nonZero(rng, -5, 5)
  const r = int(rng, 1, 4)
  const A = p * p + r * r * q
  const B = 2 * p * r
  const rq = `${r === 1 ? '' : r}\\sqrt{${q}}`
  return {
    text: `Determinați numerele raționale $a$ și $b$ pentru care $(${p} + ${rq})^2 = a + b\\sqrt{${q}}$.`,
    solution: lines(
      show(`(${p} + ${rq})^2 = ${p * p} ${B < 0 ? '-' : '+'} ${Math.abs(B)}\\sqrt{${q}} + ${r * r * q} = ${A} ${B < 0 ? '-' : '+'} ${Math.abs(B)}\\sqrt{${q}}`),
      `Cum $\\sqrt{${q}}$ este irațional, iar $a$ și $b$ sunt raționali, egalitatea are loc doar dacă $a = ${A}$ și $b = ${B}$.`,
    ),
    verify: () => Math.abs((p + r * Math.sqrt(q)) ** 2 - (A + B * Math.sqrt(q))) < 1e-9,
  }
}

// ================= more forms for the kinds already there =================

/** E(x) = x·((x + a)/(x + b) : (x² + (a + c)x + ac)/(x² + (b + d)x + bd) + (c − d)/(x + c)) = x, as in Test 1, II.5. */
export function rationalToX(rng: Rng): Made {
  for (;;) {
    const [a, b, c, d] = [int(rng, 1, 7), int(rng, 1, 7), int(rng, 1, 7), int(rng, 1, 7)]
    if (new Set([a, b, c, d]).size < 4) continue
    const k = c - d
    const tri = (u: number, v: number) => poly([[1, 'x^2'], [u + v, 'x'], [u * v, '']])
    const excluded = [-a, -b, -c, -d].sort((u, v) => u - v)
    const last = `${k < 0 ? '-' : '+'} \\frac{${Math.abs(k)}}{x + ${c}}`
    return {
      text: `Se consideră expresia $E(x) = x \\cdot \\left(\\frac{x + ${a}}{x + ${b}} : \\frac{${tri(a, c)}}{${tri(b, d)}} ${last}\\right)$, unde $x \\in \\mathbb{R} \\setminus \\{${excluded.join(', ')}\\}$. Arătați că $E(x) = x$.`,
      solution: lines(
        'Descompunem trinoamele în factori:',
        show(`${tri(a, c)} = (x + ${a})(x + ${c}), \\qquad ${tri(b, d)} = (x + ${b})(x + ${d})`),
        show(`\\frac{x + ${a}}{x + ${b}} \\cdot \\frac{(x + ${b})(x + ${d})}{(x + ${a})(x + ${c})} = \\frac{x + ${d}}{x + ${c}}`),
        show(`\\frac{x + ${d}}{x + ${c}} ${last} = \\frac{x + ${d} ${k < 0 ? '-' : '+'} ${Math.abs(k)}}{x + ${c}} = \\frac{x + ${c}}{x + ${c}} = 1 \\Rightarrow E(x) = x \\cdot 1 = x`),
      ),
      verify: () => [0.5, 9.25, -10.5].every((x) => Math.abs(x * (((x + a) / (x + b)) / (((x + a) * (x + c)) / ((x + b) * (x + d))) + k / (x + c)) - x) < 1e-9),
    }
  }
}

/** a + 1/a = k ⇒ a² + 1/a² = k² − 2 (or a − 1/a = k ⇒ k² + 2). */
export function reciprocalIdentity(rng: Rng): Made {
  const k = int(rng, 2, 40)
  const minus = rng() < 0.4
  const v = minus ? k * k + 2 : k * k - 2
  return {
    text: `Știind că $a ${minus ? '-' : '+'} \\frac{1}{a} = ${k}$, unde $a$ este un număr real nenul, calculați $a^2 + \\frac{1}{a^2}$.`,
    solution: lines(
      'Ridicăm la pătrat egalitatea dată:',
      show(`\\left(a ${minus ? '-' : '+'} \\frac{1}{a}\\right)^2 = a^2 ${minus ? '-' : '+'} 2 + \\frac{1}{a^2} = ${k * k} \\Rightarrow a^2 + \\frac{1}{a^2} = ${k * k} ${minus ? '+' : '-'} 2 = ${v}`),
    ),
    verify: () => true,
  }
}

/** The integers x with |bx − c| ≤ d. */
export function absoluteInequality(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 1, 3)
    const c = nonZero(rng, -7, 7)
    const d = int(rng, 2, 9)
    const strict = rng() < 0.4
    const xs: number[] = []
    for (let x = -30; x <= 30; x++) {
      const v = Math.abs(b * x - c)
      if (strict ? v < d : v <= d) xs.push(x)
    }
    if (xs.length < 2 || xs.length > 9) continue
    const rel = strict ? '<' : '\\le'
    const bx = b === 1 ? 'x' : `${b}x`
    return {
      text: `Determinați elementele mulțimii $A = \\{x \\in \\mathbb{Z} \\mid |${plus(bx, -c)}| ${rel} ${d}\\}$.`,
      solution: lines(
        show(`|${plus(bx, -c)}| ${rel} ${d} \\Leftrightarrow -${d} ${rel} ${plus(bx, -c)} ${rel} ${d} \\Leftrightarrow ${c - d} ${rel} ${bx} ${rel} ${c + d}${b === 1 ? '' : ` \\Leftrightarrow ${frac(c - d, b)} ${rel} x ${rel} ${frac(c + d, b)}`}`),
        show(`A = \\{${xs.join(', ')}\\}`),
      ),
      // every integer listed fits, and the neighbors just outside the list do not
      verify: () => {
        const fits = (x: number) => (strict ? Math.abs(b * x - c) < d : Math.abs(b * x - c) <= d)
        return xs.every(fits) && !fits(xs[0] - 1) && !fits(xs[xs.length - 1] + 1)
      },
    }
  }
}
