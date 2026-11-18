// Baccalaureate, profile M1 (mate-info), subject II: matrices, determinants and linear systems (grade XI), laws of
// composition and polynomials (grade XII), one item of the two problems at a time (19 November 2026). Each kind has
// three forms at each level; the solutions are written as on the marking scheme, in Romanian, with the school's
// notation (det A, A^*, I_2, the Horner scheme, the relations of Viète).
import type { Made } from './generators'
import { frac, int, nonZero, paren, pick, poly, type Rng } from './tex'

type Form = (rng: Rng) => Made
const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** A number written after a sign: "+ 3", "- 3". */
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`)
/** A coefficient in front of a letter or a bracket: "", "-", "3". */
const coef = (c: number) => (c === 1 ? '' : c === -1 ? '-' : String(c))

type Cell = number | string
const matrix = (rows: Cell[][], env = 'pmatrix') => `\\begin{${env}} ${rows.map((r) => r.join(' & ')).join(' \\\\ ')} \\end{${env}}`
const detTex = (rows: Cell[][]) => matrix(rows, 'vmatrix')
const det2 = ([[a, b], [c, d]]: number[][]) => a * d - b * c
const det3 = (m: number[][]) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
const mul2 = (A: number[][], B: number[][]) => [0, 1].map((i) => [0, 1].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j]))
const randMatrix = (rng: Rng, lo: number, hi: number, n = 2) => Array.from({ length: n }, () => Array.from({ length: n }, () => int(rng, lo, hi)))

// ============================== matrices, determinants, systems (grade XI) ==============================

const det2Form: Form = (rng) => {
  const A = randMatrix(rng, -5, 9)
  const [[a, b], [c, d]] = A
  return {
    text: `Se consideră matricea $A = ${matrix(A)}$. Calculați $\\det A$.`,
    solution: show(`\\det A = ${detTex(A)} = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${det2(A)}`),
    verify: () => det2(A) === a * d - b * c,
  }
}

const linearCombination: Form = (rng) => {
  const A = randMatrix(rng, -5, 6)
  const B = randMatrix(rng, -5, 6)
  const k = int(rng, 2, 4)
  const kA = A.map((r) => r.map((x) => k * x))
  const C = kA.map((r, i) => r.map((x, j) => x - B[i][j]))
  return {
    text: `Se consideră matricele $A = ${matrix(A)}$ și $B = ${matrix(B)}$. Calculați matricea $${k}A - B$.`,
    solution: show(`${k}A - B = ${matrix(kA)} - ${matrix(B)} = ${matrix(C)}`),
    verify: () => C.every((r, i) => r.every((x, j) => x === k * A[i][j] - B[i][j])),
  }
}

const product: Form = (rng) => {
  const A = randMatrix(rng, -3, 4)
  const B = randMatrix(rng, -3, 4)
  const P = mul2(A, B)
  const cell = (i: number, j: number) => `${A[i][0]} \\cdot ${paren(B[0][j])} + ${paren(A[i][1])} \\cdot ${paren(B[1][j])}`
  return {
    text: `Se consideră matricele $A = ${matrix(A)}$ și $B = ${matrix(B)}$. Calculați produsul $A \\cdot B$.`,
    solution: show(`A \\cdot B = ${matrix([[cell(0, 0), cell(0, 1)], [cell(1, 0), cell(1, 1)]])} = ${matrix(P)}`),
    verify: () => P[0][0] === A[0][0] * B[0][0] + A[0][1] * B[1][0] && P[1][1] === A[1][0] * B[0][1] + A[1][1] * B[1][1],
  }
}

const detParam: Form = (rng) => {
  for (;;) {
    const r1 = int(rng, -6, 6)
    const r2 = int(rng, -6, 6)
    const s = -(r1 + r2)
    if (r1 >= r2 || s === 0) continue
    const p = nonZero(rng, -5, 5)
    const q = nonZero(rng, -5, 5)
    const v = -p * q - r1 * r2
    const aS = poly([[1, 'a'], [s, '']])
    return {
      text: `Se consideră matricea $A(a) = ${matrix([['a', p], [q, aS]])}$, unde $a$ este număr real. Determinați numerele reale $a$ pentru care $\\det(A(a)) = ${v}$.`,
      solution: lines(
        show(`\\det(A(a)) = a(${aS}) - ${paren(p)} \\cdot ${paren(q)} = ${poly([[1, 'a^2'], [s, 'a'], [-p * q, '']])}`),
        `Ecuația $${poly([[1, 'a^2'], [s, 'a'], [-p * q, '']])} = ${v}$ devine $${poly([[1, 'a^2'], [s, 'a'], [-p * q - v, '']])} = 0$, cu soluțiile $a = ${r1}$ și $a = ${r2}$.`,
      ),
      verify: () => [r1, r2].every((a) => det2([[a, p], [q, a + s]]) === v),
    }
  }
}

const inverse2: Form = (rng) => {
  for (;;) {
    const A = randMatrix(rng, -4, 6)
    const [[a, b], [c, d]] = A
    const D = det2(A)
    if (D === 0 || Math.abs(D) > 6 || b === 0 || c === 0) continue
    const inv = [[d, -b], [-c, a]].map((r) => r.map((x) => x / D))
    const I = mul2(A, inv)
    return {
      text: `Se consideră matricea $A = ${matrix(A)}$. Arătați că matricea $A$ este inversabilă și determinați inversa ei.`,
      solution: lines(
        `$\\det A = ${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D} \\ne 0$, deci $A$ este inversabilă.`,
        `Adjuncta ei este $A^* = ${matrix([[d, -b], [-c, a]])}$, iar`,
        show(`A^{-1} = \\frac{1}{\\det A} \\cdot A^* = ${matrix([[d, -b], [-c, a]].map((r) => r.map((x) => frac(x, D))))}`),
      ),
      verify: () => Math.abs(I[0][0] - 1) < 1e-9 && Math.abs(I[1][1] - 1) < 1e-9 && Math.abs(I[0][1]) < 1e-9 && Math.abs(I[1][0]) < 1e-9,
    }
  }
}

const cayley: Form = (rng) => {
  for (;;) {
    const A = randMatrix(rng, -4, 5)
    const [[a, b]] = A
    if (b === 0) continue
    const A2 = mul2(A, A)
    const p = A[0][0] + A[1][1]
    const q = -det2(A)
    return {
      text: `Se consideră matricea $A = ${matrix(A)}$. Determinați numerele reale $p$ și $q$ pentru care $A^2 = pA + qI_2$.`,
      solution: lines(
        `Calculăm $A^2 = A \\cdot A = ${matrix(A2)}$.`,
        `Din egalitatea elementelor de pe linia 1, coloana 2: $${A2[0][1]} = ${poly([[b, 'p']])}$, deci $p = ${p}$.`,
        `Din linia 1, coloana 1: $${A2[0][0]} = ${poly([[a, 'p'], [1, 'q']])}$, deci $q = ${q}$.`,
        `Pentru aceste valori egalitatea are loc și pe celelalte poziții (relația Hamilton–Cayley: $A^2 - (\\operatorname{tr} A) A + (\\det A) I_2 = O_2$).`,
      ),
      verify: () => A2.every((r, i) => r.every((x, j) => x === p * A[i][j] + (i === j ? q : 0))) && A2[0][1] === b * p && A2[0][0] === a * p + q,
    }
  }
}

const vandermonde: Form = (rng) => {
  for (;;) {
    const p = nonZero(rng, -4, 5)
    const q = nonZero(rng, -4, 5)
    if (p === q || p === -q) continue
    const mp = poly([[1, 'm'], [-p, '']])
    const qm = poly([[q, ''], [-1, 'm']])
    const [lo, hi] = [Math.min(p, q), Math.max(p, q)]
    return {
      text: `Se consideră matricea $A(m) = ${matrix([[1, 1, 1], [p, 'm', q], [p * p, 'm^2', q * q]])}$, unde $m$ este număr real. Determinați numerele reale $m$ pentru care matricea $A(m)$ nu este inversabilă.`,
      solution: lines(
        'Matricea nu este inversabilă exact când determinantul ei este nul. Scădem prima coloană din celelalte două:',
        show(`\\det(A(m)) = ${detTex([[1, 0, 0], [p, mp, q - p], [p * p, poly([[1, 'm^2'], [-p * p, '']]), q * q - p * p]])} = (${mp}) \\cdot ${paren(q * q - p * p)} - ${paren(q - p)}(${poly([[1, 'm^2'], [-p * p, '']])})`),
        `Scoțând factorul comun $${paren(q - p)}(${mp})$, obținem $\\det(A(m)) = ${paren(q - p)}(${mp})(${qm})$.`,
        `Determinantul este nul pentru $m = ${lo}$ sau $m = ${hi}$.`,
      ),
      verify: () =>
        [-3, 0, 2, 7].every((m) => det3([[1, 1, 1], [p, m, q], [p * p, m * m, q * q]]) === (q - p) * (m - p) * (q - m)) &&
        [lo, hi].every((m) => det3([[1, 1, 1], [p, m, q], [p * p, m * m, q * q]]) === 0),
    }
  }
}

const cramer: Form = (rng) => {
  for (;;) {
    const A = randMatrix(rng, -3, 3, 3)
    const D = det3(A)
    if (D === 0 || Math.abs(D) > 15) continue
    const sol = [int(rng, -4, 4), int(rng, -4, 4), int(rng, -4, 4)]
    const rhs = A.map((r) => r[0] * sol[0] + r[1] * sol[1] + r[2] * sol[2])
    const swap = (k: number) => A.map((r, i) => r.map((x, j) => (j === k ? rhs[i] : x)))
    const Ds = [0, 1, 2].map((k) => det3(swap(k)))
    const eqs = A.map((r, i) => `${poly([[r[0], 'x'], [r[1], 'y'], [r[2], 'z']])} = ${rhs[i]}`)
    return {
      text: `Rezolvați sistemul de ecuații $\\begin{cases} ${eqs.join(' \\\\ ')} \\end{cases}$`,
      solution: lines(
        `Determinantul sistemului este $\\Delta = ${detTex(A)} = ${D} \\ne 0$, deci sistemul este compatibil determinat și se rezolvă cu regula lui Cramer.`,
        `$\\Delta_x = ${Ds[0]}$, $\\Delta_y = ${Ds[1]}$, $\\Delta_z = ${Ds[2]}$, deci`,
        show(`x = \\frac{\\Delta_x}{\\Delta} = ${sol[0]}, \\quad y = \\frac{\\Delta_y}{\\Delta} = ${sol[1]}, \\quad z = \\frac{\\Delta_z}{\\Delta} = ${sol[2]}`),
      ),
      verify: () => Ds.every((d, k) => d === sol[k] * D),
    }
  }
}

const powerForm: Form = (rng) => {
  const a = nonZero(rng, -6, 9)
  const n = int(rng, 4, 30)
  const A = (k: Cell) => matrix([[1, k], [0, 1]])
  let P = [[1, 0], [0, 1]]
  for (let i = 0; i < n; i++) P = mul2(P, [[1, a], [0, 1]])
  return {
    text: `Se consideră matricea $A = ${A(a)}$. Determinați matricea $A^{${n}}$.`,
    solution: lines(
      show(`A^2 = A \\cdot A = ${A(2 * a)}, \\quad A^3 = A^2 \\cdot A = ${A(3 * a)}`),
      `Arătăm prin inducție că $A^k = ${A(poly([[a, 'k']]))}$ pentru orice $k \\ge 1$: dacă egalitatea are loc pentru $k$, atunci $A^{k+1} = A^k \\cdot A = ${A(poly([[a, 'k'], [a, '']]))} = ${A(`${coef(a)}(k + 1)`)}$.`,
      show(`A^{${n}} = ${A(a * n)}`),
    ),
    verify: () => P[0][0] === 1 && P[1][0] === 0 && P[1][1] === 1 && P[0][1] === a * n,
  }
}

export const matrices: Record<1 | 2 | 3, Form[]> = {
  1: [det2Form, linearCombination, product],
  2: [detParam, inverse2, cayley],
  3: [vandermonde, cramer, powerForm],
}

// ============================== laws of composition (grade XII) ==============================
// x ∘ y = a(x − h)(y − h) + h, written expanded, as on the exam

const law = (rng: Rng) => [int(rng, 1, 3), nonZero(rng, -4, 5)] as const
const lawTex = (a: number, h: number) => poly([[a, 'xy'], [-a * h, 'x'], [-a * h, 'y'], [a * h * h + h, '']])
const intro = (a: number, h: number) => `Pe mulțimea numerelor reale se definește legea de compoziție $x \\circ y = ${lawTex(a, h)}$.`
const op = (a: number, h: number) => (x: number, y: number) => a * (x - h) * (y - h) + h
/** a(x − h)(y − h) + h, in letters. */
const factored = (a: number, h: number, x = 'x', y = 'y') => `${coef(a)}(${poly([[1, x], [-h, '']])})(${poly([[1, y], [-h, '']])}) ${signed(h)}`

const lawValue: Form = (rng) => {
  const [a, h] = law(rng)
  const u = int(rng, -4, 6)
  const v = int(rng, -4, 6)
  const terms: string[] = [`${a === 1 ? '' : `${a} \\cdot `}${paren(u)} \\cdot ${paren(v)}`, `${signed(-a * h)} \\cdot ${paren(u)}`, `${signed(-a * h)} \\cdot ${paren(v)}`]
  if (a * h * h + h !== 0) terms.push(signed(a * h * h + h))
  const val = op(a, h)(u, v)
  return {
    text: `${intro(a, h)} Calculați $${paren(u)} \\circ ${paren(v)}$.`,
    solution: show(`${paren(u)} \\circ ${paren(v)} = ${terms.join(' ')} = ${val}`),
    verify: () => val === a * u * v - a * h * u - a * h * v + a * h * h + h,
  }
}

const lawRewrite: Form = (rng) => {
  const [a, h] = law(rng)
  const inner = poly([[1, 'xy'], [-h, 'x'], [-h, 'y'], [h * h, '']])
  return {
    text: `${intro(a, h)} Arătați că $x \\circ y = ${factored(a, h)}$, pentru orice numere reale $x$ și $y$.`,
    solution: show(`${factored(a, h)} = ${a === 1 ? inner : `${a}(${inner})`} ${signed(h)} = ${lawTex(a, h)} = x \\circ y`),
    verify: () => [[0, 1], [2, -3], [5, 7]].every(([x, y]) => op(a, h)(x, y) === a * x * y - a * h * x - a * h * y + a * h * h + h),
  }
}

const additiveLaw: Form = (rng) => {
  const c = nonZero(rng, -9, 9)
  const [u, v, w] = [int(rng, -6, 9), int(rng, -6, 9), int(rng, -6, 9)]
  const t = u + v + c
  return {
    text: `Pe mulțimea numerelor reale se definește legea de compoziție $x * y = x + y ${signed(c)}$. Calculați $(${u} * ${v}) * ${paren(w)}$.`,
    solution: lines(
      show(`${u} * ${v} = ${u} + ${paren(v)} ${signed(c)} = ${t}`),
      show(`(${u} * ${v}) * ${paren(w)} = ${t} * ${paren(w)} = ${t} + ${paren(w)} ${signed(c)} = ${t + w + c}`),
    ),
    verify: () => t + w + c === u + v + w + 2 * c,
  }
}

const neutral: Form = (rng) => {
  const [a, h] = law(rng)
  const fx = `(${poly([[1, 'x'], [-h, '']])})`
  const fe = `(${poly([[1, 'e'], [-h, '']])})`
  const e = h + 1 / a
  return {
    text: `${intro(a, h)} Determinați elementul neutru al legii de compoziție „$\\circ$”.`,
    solution: lines(
      `Avem $x \\circ y = ${factored(a, h)}$, iar legea este comutativă. Numărul $e$ este element neutru dacă $x \\circ e = x$ pentru orice număr real $x$:`,
      show(`${coef(a)}${fx}${fe} ${signed(h)} = x \\Leftrightarrow ${coef(a)}${fx}${fe} = ${poly([[1, 'x'], [-h, '']])} \\Leftrightarrow ${fx}\\left[${coef(a)}${fe} - 1\\right] = 0`),
      `Egalitatea are loc pentru orice $x$ doar dacă $${coef(a)}${fe} = 1$, adică $e = ${frac(a * h + 1, a)}$.`,
    ),
    verify: () => [-2, 0, 3.5, 9].every((x) => Math.abs(op(a, h)(x, e) - x) < 1e-9),
  }
}

const solveSquare: Form = (rng) => {
  const [a, h] = law(rng)
  const t = int(rng, 1, 5)
  const v = a * t * t + h
  return {
    text: `${intro(a, h)} Rezolvați ecuația $x \\circ x = ${v}$.`,
    solution: lines(
      `Avem $x \\circ y = ${factored(a, h)}$, deci $x \\circ x = ${coef(a)}(${poly([[1, 'x'], [-h, '']])})^2 ${signed(h)}$.`,
      show(`${coef(a)}(${poly([[1, 'x'], [-h, '']])})^2 ${signed(h)} = ${v} \\Leftrightarrow (${poly([[1, 'x'], [-h, '']])})^2 = ${t * t}`),
      `deci $${poly([[1, 'x'], [-h, '']])} = -${t}$ sau $${poly([[1, 'x'], [-h, '']])} = ${t}$, adică $x = ${h - t}$ sau $x = ${h + t}$.`,
    ),
    verify: () => [h - t, h + t].every((x) => op(a, h)(x, x) === v),
  }
}

const symmetric: Form = (rng) => {
  for (;;) {
    const [a, h] = law(rng)
    const u = int(rng, -5, 7)
    if (u === h) continue
    const k = a * (u - h)
    const sym = h + 1 / (a * k)
    return {
      text: `${intro(a, h)} Știind că $e = ${frac(a * h + 1, a)}$ este elementul neutru al legii, determinați simetricul numărului $${u}$ în raport cu legea „$\\circ$”.`,
      solution: lines(
        `Avem $x \\circ y = ${factored(a, h)}$. Legea este comutativă, deci căutăm numărul $x$ pentru care $${paren(u)} \\circ x = e$:`,
        show(`${coef(k)}(${poly([[1, 'x'], [-h, '']])}) ${signed(h)} = ${frac(a * h + 1, a)} \\Leftrightarrow ${coef(k)}(${poly([[1, 'x'], [-h, '']])}) = ${frac(1, a)}`),
        `deci $x = ${frac(h * a * k + 1, a * k)}$ este simetricul lui $${u}$.`,
      ),
      verify: () => Math.abs(op(a, h)(u, sym) - (h + 1 / a)) < 1e-9,
    }
  }
}

const solveCube: Form = (rng) => {
  const [a, h] = law(rng)
  const t = nonZero(rng, -3, 3)
  const v = a * a * t ** 3 + h
  const xh = poly([[1, 'x'], [-h, '']])
  return {
    text: `${intro(a, h)} Știind că legea este asociativă, rezolvați ecuația $x \\circ x \\circ x = ${v}$.`,
    solution: lines(
      `Avem $x \\circ y = ${factored(a, h)}$, deci $x \\circ x = ${coef(a)}(${xh})^2 ${signed(h)}$ și`,
      show(`x \\circ x \\circ x = (x \\circ x) \\circ x = ${coef(a)} \\cdot ${coef(a) || '1'}(${xh})^2 (${xh}) ${signed(h)} = ${coef(a * a)}(${xh})^3 ${signed(h)}`),
      `Ecuația devine $(${xh})^3 = ${t ** 3}$, deci $${xh} = ${t}$ și $x = ${h + t}$.`,
    ),
    verify: () => {
      const o = op(a, h)
      return o(o(h + t, h + t), h + t) === v
    },
  }
}

const absorbing: Form = (rng) => {
  const [a, h] = law(rng)
  const p = h - int(rng, 1, 4)
  const q = h + int(rng, 2, 6)
  let val = p
  for (let x = p + 1; x <= q; x++) val = op(a, h)(val, x)
  return {
    text: `${intro(a, h)} Știind că legea este asociativă, calculați $${paren(p)} \\circ ${paren(p + 1)} \\circ \\ldots \\circ ${paren(q)}$.`,
    solution: lines(
      `Avem $x \\circ y = ${factored(a, h)}$, deci $x \\circ ${paren(h)} = ${paren(h)} \\circ x = ${h}$ pentru orice număr real $x$.`,
      `Numărul $${h}$ se află printre factori, așa că, grupând termenii (legea e asociativă),`,
      show(`${paren(p)} \\circ \\ldots \\circ ${paren(q)} = (${paren(p)} \\circ \\ldots \\circ ${paren(h - 1)}) \\circ ${paren(h)} \\circ (${paren(h + 1)} \\circ \\ldots \\circ ${paren(q)}) = ${h}`),
    ),
    verify: () => val === h,
  }
}

const expLaw: Form = (rng) => {
  for (;;) {
    const a = int(rng, 1, 3)
    const b = pick(rng, [2, 3])
    const x0 = int(rng, 1, 3)
    const B = b ** x0
    const t = int(rng, Math.ceil(B / 2), B + 3)
    const h = B - t
    if (h === 0) continue
    const v = a * t * t + h
    const bh = poly([[1, `${b}^x`], [-h, '']])
    const other = h - t
    return {
      text: `${intro(a, h)} Rezolvați ecuația $${b}^x \\circ ${b}^x = ${v}$.`,
      solution: lines(
        `Avem $x \\circ y = ${factored(a, h)}$, deci ecuația se scrie $${coef(a)}(${bh})^2 ${signed(h)} = ${v}$, adică $(${bh})^2 = ${t * t}$.`,
        `Atunci $${b}^x = ${h + t}$ sau $${b}^x = ${other}$. A doua egalitate nu este posibilă, pentru că $${b}^x > 0$.`,
        `Din $${b}^x = ${B}$ obținem $x = ${x0}$.`,
      ),
      verify: () => other <= 0 && op(a, h)(B, B) === v,
    }
  }
}

export const laws: Record<1 | 2 | 3, Form[]> = {
  1: [lawValue, lawRewrite, additiveLaw],
  2: [neutral, solveSquare, symmetric],
  3: [solveCube, absorbing, expLaw],
}

// ============================== polynomials (grade XII) ==============================

const fTex = (m: number, n: number, p: number) => poly([[1, 'X^3'], [m, 'X^2'], [n, 'X'], [p, '']])
const fAt = (m: number, n: number, p: number) => (x: number) => x ** 3 + m * x * x + n * x + p
const fromRoots = (r: number[]) => [-(r[0] + r[1] + r[2]), r[0] * r[1] + r[0] * r[2] + r[1] * r[2], -r[0] * r[1] * r[2]] as const
/** f(u) written out: (-2)^3 + 3 · (-2)^2 - 5 · (-2) + 1. */
function substituted(m: number, n: number, p: number, u: number): string {
  let out = `${paren(u)}^3`
  for (const [c, pow] of [[m, 2], [n, 1], [p, 0]] as const) {
    if (c === 0) continue
    out += ` ${c < 0 ? '-' : '+'} ${pow === 0 ? Math.abs(c) : `${Math.abs(c) === 1 ? '' : `${Math.abs(c)} \\cdot `}${paren(u)}${pow === 2 ? '^2' : ''}`}`
  }
  return out
}
const xMinus = (u: number) => poly([[1, 'X'], [-u, '']])
/** The Horner scheme for f : (X − u). */
function horner(m: number, n: number, p: number, u: number) {
  const b1 = m + u
  const b0 = n + u * b1
  const r = p + u * b0
  const table = `\\begin{array}{c|cccc} & 1 & ${m} & ${n} & ${p} \\\\ \\hline ${u} & 1 & ${b1} & ${b0} & ${r} \\end{array}`
  return { b1, b0, r, table }
}
const randomF = (rng: Rng) => [int(rng, -6, 6), int(rng, -6, 6), nonZero(rng, -8, 8)] as const

const remainderForm: Form = (rng) => {
  const [m, n, p] = randomF(rng)
  const u = nonZero(rng, -3, 3)
  const r = fAt(m, n, p)(u)
  return {
    text: `Se consideră polinomul $f = ${fTex(m, n, p)}$. Determinați restul împărțirii polinomului $f$ la $${xMinus(u)}$.`,
    solution: lines('Conform teoremei restului, restul este egal cu valoarea polinomului în rădăcina împărțitorului:', show(`r = f(${paren(u)}) = ${substituted(m, n, p, u)} = ${r}`)),
    verify: () => r === u ** 3 + m * u * u + n * u + p,
  }
}

const hornerForm: Form = (rng) => {
  const [m, n, p] = randomF(rng)
  const u = nonZero(rng, -3, 3)
  const { b1, b0, r, table } = horner(m, n, p, u)
  return {
    text: `Determinați câtul și restul împărțirii polinomului $f = ${fTex(m, n, p)}$ la $${xMinus(u)}$.`,
    solution: lines('Folosim schema lui Horner:', show(table), `Câtul este $q = ${poly([[1, 'X^2'], [b1, 'X'], [b0, '']])}$, iar restul este $r = ${r}$.`),
    verify: () => [-2, 1, 5].every((x) => fAt(m, n, p)(x) === (x - u) * (x * x + b1 * x + b0) + r),
  }
}

const divisibleParam: Form = (rng) => {
  const u = nonZero(rng, -3, 3)
  const [m, n, p] = fromRoots([u, int(rng, -4, 4), int(rng, -4, 4)])
  const rest = u ** 3 + n * u + p
  return {
    text: `Se consideră polinomul $f = ${poly([[1, 'X^3'], [1, 'mX^2'], [n, 'X'], [p, '']])}$, unde $m$ este număr real. Determinați numărul real $m$ pentru care polinomul $f$ este divizibil cu $${xMinus(u)}$.`,
    solution: lines(
      `Polinomul $f$ este divizibil cu $${xMinus(u)}$ dacă și numai dacă $f(${paren(u)}) = 0$ (teorema lui Bézout).`,
      show(`f(${paren(u)}) = ${poly([[u * u, 'm'], [rest, '']])} = 0 \\Rightarrow m = ${m}`),
    ),
    verify: () => u * u * m + rest === 0,
  }
}

const sumSquares: Form = (rng) => {
  const r = [int(rng, -4, 5), int(rng, -4, 5), int(rng, -4, 5)]
  const [m, n, p] = fromRoots(r)
  const S = m * m - 2 * n
  return {
    text: `Se consideră polinomul $f = ${fTex(m, n, p)}$, cu rădăcinile $x_1$, $x_2$, $x_3$. Calculați $x_1^2 + x_2^2 + x_3^2$.`,
    solution: lines(
      `Din relațiile lui Viète, $x_1 + x_2 + x_3 = ${-m}$ și $x_1 x_2 + x_1 x_3 + x_2 x_3 = ${n}$.`,
      show(`x_1^2 + x_2^2 + x_3^2 = (x_1 + x_2 + x_3)^2 - 2(x_1 x_2 + x_1 x_3 + x_2 x_3) = ${paren(-m)}^2 - 2 \\cdot ${paren(n)} = ${S}`),
    ),
    verify: () => S === r.reduce((s, x) => s + x * x, 0),
  }
}

const otherRoots: Form = (rng) => {
  for (;;) {
    const u = nonZero(rng, -3, 3)
    const r2 = int(rng, -5, 5)
    const r3 = int(rng, -5, 5)
    if (r2 >= r3) continue
    const [m, n, p] = fromRoots([u, r2, r3])
    const { b1, b0, r, table } = horner(m, n, p, u)
    const D = b1 * b1 - 4 * b0
    return {
      text: `Se consideră polinomul $f = ${fTex(m, n, p)}$. Știind că $x_1 = ${u}$ este rădăcină a polinomului $f$, determinați celelalte rădăcini ale lui $f$.`,
      solution: lines(
        `Împărțim polinomul $f$ la $${xMinus(u)}$ cu schema lui Horner:`,
        show(table),
        `deci $f = (${xMinus(u)})(${poly([[1, 'X^2'], [b1, 'X'], [b0, '']])})$. Ecuația $${poly([[1, 'x^2'], [b1, 'x'], [b0, '']])} = 0$ are $\\Delta = ${D}$ și rădăcinile $x_2 = ${r2}$, $x_3 = ${r3}$.`,
      ),
      verify: () => r === 0 && D === (r3 - r2) ** 2 && (-b1 - Math.sqrt(D)) / 2 === r2 && (-b1 + Math.sqrt(D)) / 2 === r3,
    }
  }
}

const reciprocals: Form = (rng) => {
  const r = [nonZero(rng, -4, 5), nonZero(rng, -4, 5), nonZero(rng, -4, 5)]
  const [m, n, p] = fromRoots(r)
  return {
    text: `Se consideră polinomul $f = ${fTex(m, n, p)}$, cu rădăcinile $x_1$, $x_2$, $x_3$. Calculați $\\frac{1}{x_1} + \\frac{1}{x_2} + \\frac{1}{x_3}$.`,
    solution: lines(
      `Din relațiile lui Viète, $x_1 x_2 + x_1 x_3 + x_2 x_3 = ${n}$ și $x_1 x_2 x_3 = ${-p}$.`,
      show(`\\frac{1}{x_1} + \\frac{1}{x_2} + \\frac{1}{x_3} = \\frac{x_2 x_3 + x_1 x_3 + x_1 x_2}{x_1 x_2 x_3} = \\frac{${n}}{${-p}} = ${frac(n, -p)}`),
    ),
    verify: () => Math.abs(1 / r[0] + 1 / r[1] + 1 / r[2] - n / -p) < 1e-9,
  }
}

const squaresParam: Form = (rng) => {
  const m0 = int(rng, 1, 7)
  const n = nonZero(rng, -6, 6)
  const p = nonZero(rng, -8, 8)
  const v = m0 * m0 - 2 * n
  return {
    text: `Se consideră polinomul $f = ${poly([[1, 'X^3'], [1, 'mX^2'], [n, 'X'], [p, '']])}$, unde $m$ este număr real, cu rădăcinile $x_1$, $x_2$, $x_3$. Determinați numerele reale $m$ pentru care $x_1^2 + x_2^2 + x_3^2 = ${v}$.`,
    solution: lines(
      `Din relațiile lui Viète, $x_1 + x_2 + x_3 = -m$ și $x_1 x_2 + x_1 x_3 + x_2 x_3 = ${n}$, deci`,
      show(`x_1^2 + x_2^2 + x_3^2 = (-m)^2 - 2 \\cdot ${paren(n)} = ${poly([[1, 'm^2'], [-2 * n, '']])}`),
      `Ecuația $${poly([[1, 'm^2'], [-2 * n, '']])} = ${v}$ devine $m^2 = ${m0 * m0}$, deci $m = -${m0}$ sau $m = ${m0}$.`,
    ),
    verify: () => [m0, -m0].every((m) => m * m - 2 * n === v),
  }
}

const remainderTwo: Form = (rng) => {
  for (;;) {
    const [m, n, p] = randomF(rng)
    const u = int(rng, -3, 3)
    const w = int(rng, -3, 3)
    if (u >= w) continue
    const f = fAt(m, n, p)
    const [fu, fw] = [f(u), f(w)]
    const A = (fw - fu) / (w - u)
    const B = fu - A * u
    const factor = (x: number) => (x === 0 ? 'X' : `(${xMinus(x)})`)
    const lhs = (x: number) => poly([[x, 'a'], [1, 'b']])
    return {
      text: `Determinați restul împărțirii polinomului $f = ${fTex(m, n, p)}$ la $${factor(u)}${factor(w)}$.`,
      solution: lines(
        `Împărțitorul are gradul 2, deci restul are forma $r = aX + b$, iar $f = ${factor(u)}${factor(w)} \\cdot q + aX + b$.`,
        `Pentru $X = ${u}$ și $X = ${w}$ obținem $f(${paren(u)}) = ${lhs(u)}$ și $f(${paren(w)}) = ${lhs(w)}$, unde $f(${paren(u)}) = ${fu}$ și $f(${paren(w)}) = ${fw}$:`,
        show(`\\begin{cases} ${lhs(u)} = ${fu} \\\\ ${lhs(w)} = ${fw} \\end{cases} \\Rightarrow a = ${A}, \\ b = ${B}`),
        `Restul este $r = ${poly([[A, 'X'], [B, '']])}$.`,
      ),
      verify: () => Number.isInteger(A) && A * u + B === fu && A * w + B === fw,
    }
  }
}

const rootsInProgression: Form = (rng) => {
  const c = int(rng, -3, 3)
  const d = int(rng, 1, 4)
  const [m, n, p] = fromRoots([c - d, c, c + d])
  const known = c ** 3 + m * c * c + n * c
  return {
    text: `Se consideră polinomul $f = ${poly([[1, 'X^3'], [m, 'X^2'], [n, 'X'], [1, 'p']])}$, unde $p$ este număr real. Determinați numărul real $p$ pentru care rădăcinile polinomului $f$ sunt în progresie aritmetică.`,
    solution: lines(
      `Dacă rădăcinile $x_1$, $x_2$, $x_3$ sunt în progresie aritmetică, atunci $x_1 + x_3 = 2x_2$. Din relațiile lui Viète, $x_1 + x_2 + x_3 = ${-m}$, deci $3x_2 = ${-m}$ și $x_2 = ${c}$.`,
      `Din $f(${paren(c)}) = 0$ obținem $${poly([[known, ''], [1, 'p']])} = 0$, deci $p = ${p}$.`,
      `Pentru $p = ${p}$, $f = (${xMinus(c)})(${poly([[1, 'X^2'], [-2 * c, 'X'], [c * c - d * d, '']])})$, cu rădăcinile $${c - d}$, $${c}$, $${c + d}$, care sunt în progresie aritmetică.`,
    ),
    verify: () => known + p === 0 && [c - d, c, c + d].every((x) => fAt(m, n, p)(x) === 0),
  }
}

export const polynomials: Record<1 | 2 | 3, Form[]> = {
  1: [remainderForm, hornerForm, divisibleParam],
  2: [sumSquares, otherRoots, reciprocals],
  3: [squaresParam, remainderTwo, rootsInProgression],
}
