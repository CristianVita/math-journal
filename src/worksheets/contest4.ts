// More contest problems for grade VIII (level 4), after the user asked on 10 November 2026 for many more patterns,
// so that a sheet of contest exercises does not show the same problem with other numbers: absolute values and
// t + 1/t ≥ 2, minimums and maximums without derivatives, integer parts, symmetric systems, perfect squares from
// products, the identity x³ + y³ + z³ = 3xyz, and the linear function as olympiads ask it.
import type { Made } from './generators'
import { frac, int, nonZero, pick, poly, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
const k1 = (n: number) => (n === 1 ? '' : n === -1 ? '-' : String(n))
const paren = (n: number) => (n < 0 ? `(${n})` : String(n))
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n))

// ================= algebra =================

/** |u/v| + |v/u| = 2 − |w|: the left side is at least 2, the right side at most 2. (București 2009, VIII.1) */
export function absEquationFraction(rng: Rng): Made {
  for (;;) {
    const x0 = nonZero(rng, -5, 5)
    const p = int(rng, 1, 5)
    const k = int(rng, 1, 6)
    const sign = rng() < 0.5 ? 1 : -1
    // v(x0) = ±u(x0), so that |u| = |v| at x0
    const q = sign * k * x0 - p * x0
    if (q === 0 || k === p) continue
    const u = `${k1(k)}x`
    const v = poly([[p, 'x'], [q, '']])
    const w = poly([[p, 'x'], [-p * x0, '']])
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $\\left|\\frac{${u}}{${v}}\\right| + \\left|\\frac{${v}}{${u}}\\right| = 2 - |${w}|$.`,
      solution: lines(
        `Condiții: $x \\neq 0$ și $${v} \\neq 0$. Notăm $t = \\left|\\frac{${u}}{${v}}\\right| > 0$. Din $(t - 1)^2 \\geq 0$ obținem $t^2 + 1 \\geq 2t$, adică $t + \\frac{1}{t} \\geq 2$: membrul stâng este cel puțin 2.`,
        `Membrul drept este cel mult 2, pentru că $|${w}| \\geq 0$. Egalitatea cere ca ambii membri să fie 2: $|${w}| = 0$, deci $x = ${x0}$, și $t = 1$.`,
        `Verificăm: pentru $x = ${x0}$, $${u} = ${k * x0}$ și $${v} = ${p * x0 + q}$, deci $t = \\frac{${Math.abs(k * x0)}}{${Math.abs(p * x0 + q)}} = 1$. Soluția este $x = ${x0}$.`,
      ),
      verify: () => {
        const L = (x: number) => Math.abs((k * x) / (p * x + q)) + Math.abs((p * x + q) / (k * x))
        const R = (x: number) => 2 - Math.abs(p * x - p * x0)
        return close(L(x0), R(x0)) && [-7.3, -1.1, 0.4, 2.9, 6.2].every((x) => x === x0 || p * x + q === 0 || L(x) > R(x))
      },
    }
  }
}

/** ax + b/x ≥ 2a·x0 for x > 0, when b = a·x0²: a(x − x0)²/x ≥ 0. */
export function minimumXplusK(rng: Rng): Made {
  const a = int(rng, 1, 6)
  const x0 = int(rng, 1, 9)
  const b = a * x0 * x0
  const min = 2 * a * x0
  return {
    text: `Determinați valoarea minimă a expresiei $E(x) = ${k1(a)}x + \\frac{${b}}{x}$, unde $x$ este un număr real pozitiv, și valoarea lui $x$ pentru care se obține.`,
    solution: lines(
      `Comparăm $E(x)$ cu ${min}: aducem la același numitor (cu $x > 0$):`,
      show(`E(x) - ${min} = \\frac{${k1(a)}x^2 - ${min}x + ${b}}{x} = \\frac{${k1(a)}(x - ${x0})^2}{x} \\geq 0`),
      `Deci $E(x) \\geq ${min}$, cu egalitate pentru $x = ${x0}$. Valoarea minimă este ${min}.`,
    ),
    verify: () => close(a * x0 + b / x0, min) && [0.3, 1.7, 4.4, 12].every((x) => x === x0 || a * x + b / x > min),
  }
}

/** ax + by = s with x, y > 0: xy is at most s²/(4ab), from (ax)(by) ≤ ((ax + by)/2)². */
export function maxProduct(rng: Rng): Made {
  const a = int(rng, 1, 5)
  const b = int(rng, 1, 5)
  const s = 2 * int(rng, 2, 20)
  const max = frac(s * s, 4 * a * b)
  const [x0, y0] = [frac(s, 2 * a), frac(s, 2 * b)]
  const left = poly([[a, 'x'], [b, 'y']])
  return {
    text: `Numerele reale pozitive $x$ și $y$ verifică $${left} = ${s}$. Determinați valoarea maximă a produsului $xy$ și numerele $x$, $y$ pentru care se obține.`,
    solution: lines(
      `Pentru numere reale $u$, $v$: $(u - v)^2 \\geq 0$, deci $4uv \\leq (u + v)^2$. Cu $u = ${k1(a)}x$ și $v = ${k1(b)}y$:`,
      show(`4 \\cdot ${a * b === 1 ? '' : a * b}xy \\leq (${left})^2 = ${s * s} \\Rightarrow xy \\leq \\frac{${s * s}}{${4 * a * b}} = ${max}`),
      `Egalitatea are loc pentru $${k1(a)}x = ${k1(b)}y = ${s / 2}$, adică $x = ${x0}$ și $y = ${y0}$. Valoarea maximă a lui $xy$ este $${max}$.`,
    ),
    verify: () => {
      const f = (x: number) => x * ((s - a * x) / b)
      return close(f(s / (2 * a)), (s * s) / (4 * a * b)) && [0.2, 0.45, 0.7].every((t) => f((t * s) / a) <= (s * s) / (4 * a * b) + 1e-9)
    },
  }
}

/** |x − a| + |x − b| (+ |x − c|): the smallest value, from |u| + |v| ≥ |u − v| (and the middle term). */
export function absMinimum(rng: Rng): Made {
  const three = rng() < 0.5
  const pts = three ? [int(rng, -10, -3), int(rng, -2, 2), int(rng, 3, 12)] : [int(rng, -12, 0), int(rng, 1, 12)]
  const E = pts.map((p) => `|${plus('x', -p)}|`).join(' + ')
  const [a, c] = [pts[0], pts[pts.length - 1]]
  const min = c - a
  return {
    text: `Determinați valoarea minimă a expresiei $E(x) = ${E}$, unde $x$ este număr real, ${three ? 'și valoarea lui $x$ pentru care se obține' : 'și valorile lui $x$ pentru care se obține'}.`,
    solution: three
      ? lines(
        `Pentru orice numere reale, $|u| + |v| \\geq |u - v|$. Deci $|${plus('x', -a)}| + |${plus('x', -c)}| \\geq |(${plus('x', -a)}) - (${plus('x', -c)})| = ${min}$, cu egalitate pentru $x \\in [${a}, ${c}]$.`,
        `Termenul din mijloc, $|${plus('x', -pts[1])}|$, este cel puțin 0, cu egalitate pentru $x = ${pts[1]}$, care se află în $[${a}, ${c}]$.`,
        `Deci $E(x) \\geq ${min}$, cu egalitate doar pentru $x = ${pts[1]}$. Valoarea minimă este ${min}.`,
      )
      : lines(
        `Pentru orice numere reale, $|u| + |v| \\geq |u - v|$, cu egalitate când $u$ și $v$ au semne opuse (sau unul este 0). Cu $u = ${plus('x', -a)}$, $v = ${plus('x', -c)}$:`,
        show(`E(x) \\geq |(${plus('x', -a)}) - (${plus('x', -c)})| = ${min}`),
        `Egalitatea are loc pentru $${plus('x', -a)} \\geq 0$ și $${plus('x', -c)} \\leq 0$, adică $x \\in [${a}, ${c}]$. Valoarea minimă este ${min}.`,
      ),
    verify: () => {
      const f = (x: number) => pts.reduce((t, p) => t + Math.abs(x - p), 0)
      const at = three ? pts[1] : (a + c) / 2
      return close(f(at), min) && [a - 1, c + 1, a - 5].every((x) => f(x) > min)
    },
  }
}

/** (a − b)³ + (b − c)³ + (c − a)³ = 3(a − b)(b − c)(c − a), because the three add up to 0. */
export function cubesSumZero(rng: Rng): Made {
  const a = int(rng, 1000, 3000)
  const b = a + nonZero(rng, -5, 5)
  const c = b + nonZero(rng, -5, 5)
  const [x, y, z] = [a - b, b - c, c - a]
  const value = 3 * x * y * z
  return {
    text: `Calculați $E = (${a} - ${b})^3 + (${b} - ${c})^3 + (${c} - ${a})^3$${rng() < 0.5 ? ', folosind o identitate' : ''}.`,
    solution: lines(
      `Notăm $x = ${a} - ${b} = ${x}$, $y = ${b} - ${c} = ${y}$, $z = ${c} - ${a} = ${z}$. Atunci $x + y + z = 0$, deci $z = -(x + y)$ și`,
      show(`x^3 + y^3 + z^3 = x^3 + y^3 - (x + y)^3 = -3x^2y - 3xy^2 = -3xy(x + y) = 3xyz`),
      show(`E = 3 \\cdot ${paren(x)} \\cdot ${paren(y)} \\cdot ${paren(z)} = ${value}`),
    ),
    verify: () => x ** 3 + y ** 3 + z ** 3 === value,
  }
}

/** n(n + 1)(n + 2)(n + 3) + 1 = (n² + 3n + 1)². */
export function productFourPlusOne(rng: Rng): Made {
  const n = pick(rng, [int(rng, 10, 99), int(rng, 100, 999), int(rng, 2020, 2030)])
  const t = n * n + 3 * n
  return {
    text: `Arătați că numărul $N = ${n} \\cdot ${n + 1} \\cdot ${n + 2} \\cdot ${n + 3} + 1$ este pătrat perfect.`,
    solution: lines(
      'Pentru orice număr natural $n$, grupăm primul factor cu ultimul și pe cei din mijloc:',
      show(`n(n + 3) = n^2 + 3n, \\qquad (n + 1)(n + 2) = n^2 + 3n + 2`),
      show(`n(n + 1)(n + 2)(n + 3) + 1 = (n^2 + 3n)(n^2 + 3n + 2) + 1 = (n^2 + 3n)^2 + 2(n^2 + 3n) + 1 = (n^2 + 3n + 1)^2`),
      `Pentru $n = ${n}$: $n^2 + 3n + 1 = ${t + 1}$, deci $N = ${t + 1}^2$ este pătrat perfect.`,
    ),
    verify: () => {
      const N = BigInt(n) * BigInt(n + 1) * BigInt(n + 2) * BigInt(n + 3) + 1n
      return N === BigInt(t + 1) ** 2n
    },
  }
}

// ================= numbers =================

/** [√(m² + t)] = m when 1 ≤ t ≤ 2m: m² < m² + t < (m + 1)². */
export function integerPartRoot(rng: Rng): Made {
  const m = pick(rng, [int(rng, 20, 99), int(rng, 100, 999), int(rng, 2020, 2030)])
  const t = int(rng, 1, 2 * m)
  return {
    text: `Determinați partea întreagă a numărului $a = \\sqrt{${m}^2 + ${t}}$.`,
    solution: lines(
      `Încadrăm numărul de sub radical între două pătrate perfecte consecutive. Cum $1 \\leq ${t} \\leq ${2 * m} = 2 \\cdot ${m}$:`,
      show(`${m}^2 < ${m}^2 + ${t} \\leq ${m}^2 + 2 \\cdot ${m} < ${m}^2 + 2 \\cdot ${m} + 1 = ${m + 1}^2`),
      `Deci $${m} < a < ${m + 1}$ și $[a] = ${m}$.`,
    ),
    verify: () => Math.floor(Math.sqrt(m * m + t)) === m && !isSquare(m * m + t),
  }
}

/** x + y = s and x² + y² = Q: xy from the square of the sum, then x and y as the roots of t² − st + p. */
export function symmetricSystem(rng: Rng): Made {
  for (;;) {
    const x = nonZero(rng, -9, 9)
    const y = nonZero(rng, -9, 9)
    if (x === y) continue
    const s = x + y
    const Q = x * x + y * y
    const p = x * y
    const [lo, hi] = x < y ? [x, y] : [y, x]
    return {
      text: `Rezolvați în mulțimea numerelor reale sistemul $\\begin{cases} x + y = ${s} \\\\ x^2 + y^2 = ${Q} \\end{cases}$.`,
      solution: lines(
        'Din pătratul sumei aflăm produsul:',
        show(`2xy = (x + y)^2 - (x^2 + y^2) = ${s * s} - ${Q} = ${2 * p} \\Rightarrow xy = ${p}`),
        `Atunci $(t - x)(t - y) = t^2 - (x + y)t + xy$, deci $x$ și $y$ sunt soluțiile ecuației $${poly([[1, 't^2'], [-s, 't'], [p, '']])} = 0$, adică $(${plus('t', -lo)})(${plus('t', -hi)}) = 0$, cu soluțiile $${lo}$ și $${hi}$.`,
        show(`(x, y) \\in \\{(${lo}, ${hi}), (${hi}, ${lo})\\}`),
      ),
      verify: () => lo + hi === s && lo * lo + hi * hi === Q && lo * hi === p,
    }
  }
}

// ================= the linear function =================

/** f(x) = ax + b with f(f(x)) = cx + d: a² = c and b(a + 1) = d. */
export function composeLinear(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [-4, -3, -2, 2, 3, 4])
    const b = nonZero(rng, -6, 6)
    const c = a * a
    const d = b * (a + 1)
    const sols = [a, -a].filter((A) => A !== -1).map((A) => [A, d / (A + 1)] as [number, number])
    if (!sols.length) continue
    const fTex = (A: number) => {
      const B = frac(d, A + 1)
      return `f(x) = ${poly([[A, 'x']])}${B === '0' ? '' : B.startsWith('-') ? ` - ${B.slice(1)}` : ` + ${B}`}`
    }
    return {
      text: `Determinați funcțiile liniare $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ax + b$, pentru care $f(f(x)) = ${poly([[c, 'x'], [d, '']])}$, pentru orice număr real $x$.`,
      solution: lines(
        show(`f(f(x)) = a(ax + b) + b = a^2x + ab + b`),
        `Identificăm coeficienții: $a^2 = ${c}$ și $b(a + 1) = ${d}$. Din prima, $a = ${Math.abs(a)}$ sau $a = -${Math.abs(a)}$.`,
        ...[a, -a].map((A) => (A === -1
          ? `Pentru $a = -1$: $b \\cdot 0 = ${d}$, imposibil.`
          : `Pentru $a = ${A}$: $${A + 1 === 1 ? '' : paren(A + 1)}b = ${d}$, deci $b = ${frac(d, A + 1)}$.`)),
        sols.length === 1 ? `Funcția este $${fTex(sols[0][0])}$.` : `Funcțiile sunt ${sols.map(([A]) => `$${fTex(A)}$`).join(' și ')}.`,
      ),
      verify: () => sols.every(([A, B]) => [0, 1, -2, 5].every((x) => close(A * (A * x + B) + B, c * x + d))),
    }
  }
}

/** p·f(x) + q·f(−x) = mx + n for a linear f: (p − q)a = m and (p + q)b = n. */
export function functionalLinear(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 5)
    const q = int(rng, 1, 5)
    if (p === q) continue
    const a = nonZero(rng, -6, 6)
    const b = nonZero(rng, -6, 6)
    const m = (p - q) * a
    const n = (p + q) * b
    return {
      text: `Determinați funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ax + b$, pentru care $${k1(p)}f(x) + ${k1(q)}f(-x) = ${poly([[m, 'x'], [n, '']])}$, pentru orice număr real $x$.`,
      solution: lines(
        show(`${k1(p)}(ax + b) + ${k1(q)}(-ax + b) = ${p - q === 1 ? '' : p - q === -1 ? '-' : p - q}ax + ${p + q}b`),
        `Identificăm coeficienții: $${p - q === 1 ? '' : paren(p - q)}a = ${m}$ și $${p + q}b = ${n}$, deci $a = ${a}$ și $b = ${b}$.`,
        show(`f(x) = ${poly([[a, 'x'], [b, '']])}`),
      ),
      verify: () => [0, 1, -3, 7].every((x) => p * (a * x + b) + q * (-a * x + b) === m * x + n),
    }
  }
}

/** The triangle formed by the graphs of two linear functions and the Ox axis: base on Ox, height from their meeting. */
export function twoLinesTriangle(rng: Rng): Made {
  for (;;) {
    const u = int(rng, -4, 4)
    const x1 = int(rng, -8, 8)
    const x2 = int(rng, -8, 8)
    const a1 = nonZero(rng, -3, 3)
    if (x1 === x2 || u === x1 || u === x2) continue
    const v = a1 * (u - x1)
    if (v % (u - x2) !== 0) continue
    const a2 = v / (u - x2)
    if (a2 === a1 || a2 === 0) continue
    const [b1, b2] = [-a1 * x1, -a2 * x2]
    const area = frac(Math.abs(x1 - x2) * Math.abs(v), 2)
    const f = poly([[a1, 'x'], [b1, '']])
    const g = poly([[a2, 'x'], [b2, '']])
    return {
      text: `Se consideră funcțiile $f, g: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${f}$ și $g(x) = ${g}$. Calculați aria triunghiului format de graficele celor două funcții și axa $Ox$.`,
      solution: lines(
        `Graficul lui $f$ taie axa $Ox$ unde $f(x) = 0$: $x = ${x1}$, în $A(${x1}, 0)$. Graficul lui $g$: $g(x) = 0 \\Rightarrow x = ${x2}$, în $B(${x2}, 0)$.`,
        `Graficele se intersectează unde $f(x) = g(x)$: $${f} = ${g} \\Rightarrow x = ${u}$, iar $f(${u}) = ${v}$, în $C(${u}, ${v})$.`,
        `Baza $AB = |${x1} - ${paren(x2)}| = ${Math.abs(x1 - x2)}$, iar înălțimea este distanța de la $C$ la $Ox$, $|${v}| = ${Math.abs(v)}$:`,
        show(`\\mathcal{A} = \\frac{${Math.abs(x1 - x2)} \\cdot ${Math.abs(v)}}{2} = ${area}`),
      ),
      verify: () => a1 * x1 + b1 === 0 && a2 * x2 + b2 === 0 && a1 * u + b1 === v && a2 * u + b2 === v,
    }
  }
}

/** m for which A, B and C(m, y) are on one line: the line through A and B, then C on it. */
export function collinearPoints(rng: Rng): Made {
  for (;;) {
    const k = nonZero(rng, -4, 4)
    const c = int(rng, -8, 8)
    const [xa, xb, m] = [int(rng, -6, 6), int(rng, -6, 6), int(rng, -9, 9)]
    if (xa === xb || m === xa || m === xb) continue
    const at = (x: number) => k * x + c
    const line = poly([[k, 'x'], [c, '']])
    return {
      text: `Determinați numărul real $m$ pentru care punctele $A(${xa}, ${at(xa)})$, $B(${xb}, ${at(xb)})$ și $C(m, ${at(m)})$ sunt coliniare.`,
      solution: lines(
        `Căutăm funcția liniară $f(x) = ax + b$ al cărei grafic trece prin $A$ și $B$: $${k1(xa)}a + b = ${at(xa)}$ și $${k1(xb)}a + b = ${at(xb)}$. Scăzând, $${xa - xb === 1 ? '' : paren(xa - xb)}a = ${at(xa) - at(xb)}$, deci $a = ${k}$ și $b = ${c}$: $f(x) = ${line}$.`,
        `Punctul $C$ este pe aceeași dreaptă exact când $f(m) = ${at(m)}$:`,
        show(`${poly([[k, 'm'], [c, '']])} = ${at(m)} \\Rightarrow m = ${m}`),
      ),
      verify: () => (at(xb) - at(xa)) * (m - xa) === (at(m) - at(xa)) * (xb - xa),
    }
  }
}
