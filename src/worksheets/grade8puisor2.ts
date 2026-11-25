// Grade VIII algebra after the workbook "cu puișorul" photographed by the user on 25 November 2026, pp. 26–43:
// applications with radicals and equations (3.4), factoring (3.5), algebraic fractions (3.6–3.7), equations of the
// second degree (3.8). Levels by the stars of the book. Each form names its page and exercise.
import { de, gcd, int, nonZero, pick, poly, rightTriangle, root, rootParts, shuffle, surd, type Rng } from './tex'
import type { Made } from './generators'
import { N, R, X, Z, asc, at, cf, fac, fr, lin, lines, mul, near, q, range, same, setOf, sgn, show, type Kind8 } from './alg8'

/** Factors written one after another; equal ones as a square. */
const prod = (l: string[]) => (l.length === 2 && l[0] === l[1] ? `${l[0]}^2` : l.join(''))
const except = (l: number[]) => `x \\in ${R} \\setminus ${setOf(asc(l))}`

// ---------- 3.4 applications ----------

/** p. 26, ex. 3 */
export function inverseConj(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 4), m = pick(rng, [2, 3, 5, 6, 7, 10]), b = int(rng, 1, 9), d = a * a * m - b * b
    if (d === 0 || Math.abs(d) > 12) continue
    const v = `${cf(a)}\\sqrt{${m}} - ${b}`, s = Math.sign(d)
    const inv = `${cf(a)}\\sqrt{${m}} + ${b}`
    return {
      text: `Aflați inversul numărului $n = |${v}|$, scris cu numitorul rațional.`,
      solution: lines(`Cum $${root(a * a * m)} = \\sqrt{${a * a * m}}$ și $${b} = \\sqrt{${b * b}}$, avem $n = ${s > 0 ? v : `${b} - ${cf(a)}\\sqrt{${m}}`}$.`, show(`\\frac{1}{n} = \\frac{${inv}}{${s > 0 ? `${a * a * m} - ${b * b}` : `${b * b} - ${a * a * m}`}} = ${Math.abs(d) === 1 ? inv : fr(inv, Math.abs(d))}`)),
      verify: () => near(1 / Math.abs(a * Math.sqrt(m) - b), (a * Math.sqrt(m) + b) / Math.abs(d)),
    }
  }
}
/** p. 26, ex. 1 */
export function meansConj(rng: Rng): Made {
  const a = int(rng, 2, 12), m = a * a - 1
  return {
    text: `Comparați media aritmetică și media geometrică a numerelor $a = ${a} + ${root(m)}$ și $b = \\frac{1}{${a} + ${root(m)}}$.`,
    solution: lines('Raționalizăm:', show(`b = \\frac{${a} - ${root(m)}}{${a * a} - ${m}} = ${a} - ${root(m)}`), show(`m_a = \\frac{a + b}{2} = ${a}, \\qquad m_g = \\sqrt{ab} = \\sqrt{1} = 1`), `Deci $m_a > m_g$.`),
    verify: () => near(1 / (a + Math.sqrt(m)), a - Math.sqrt(m)),
  }
}
/** p. 26, ex. 4, 6 b */
export function conjSum(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 6), m = pick(rng, [2, 3, 5, 6, 7, 10, 11]), d = a * a - m, k = int(rng, 1, 5)
    if (d === 0) continue
    const plus = rng() < 0.5
    const val = plus ? q(2 * a * k, d) : surd(2 * k, d, m)
    return {
      text: `Calculați: $\\frac{${k}}{${a} - \\sqrt{${m}}} ${plus ? '+' : '-'} \\frac{${k}}{${a} + \\sqrt{${m}}}$.`,
      solution: lines('Aducem la numitorul comun, care este o diferență de pătrate:', show(`\\frac{${cf(k)}(${a} + \\sqrt{${m}}) ${plus ? '+' : '-'} ${cf(k)}(${a} - \\sqrt{${m}})}{${a * a} - ${m}} = \\frac{${plus ? 2 * a * k : `${2 * k}\\sqrt{${m}}`}}{${d}}${val === fr(plus ? 2 * a * k : `${2 * k}\\sqrt{${m}}`, d) ? '' : ` = ${val}`}`)),
      verify: () => near(k / (a - Math.sqrt(m)) + (plus ? k : -k) / (a + Math.sqrt(m)), plus ? (2 * a * k) / d : (2 * k * Math.sqrt(m)) / d),
    }
  }
}
/** p. 27, ex. 12 */
export function radicalEquation(rng: Rng): Made {
  for (;;) {
    const m = pick(rng, [2, 3, 5, 6, 7]), k = int(rng, 1, 4), j = int(rng, 1, 5)
    if (j === 2 * k) continue
    // (x + k√m)² = x(x + j√m)  →  (2k − j)√m x = −k²m
    const p = -k * k, d = 2 * k - j
    return {
      text: `Rezolvați în $${R}$ ecuația $(x + ${root(k * k * m)})^2 = x(x + ${root(j * j * m)})$.`,
      solution: lines(show(`x^2 + ${2 * k}x\\sqrt{${m}} + ${k * k * m} = x^2 + ${cf(j)}x\\sqrt{${m}}`), show(`${cf(d)}x\\sqrt{${m}} = -${k * k * m} \\Rightarrow x = ${surd(p, d, m)}`)),
      verify: () => { const x = (p / d) * Math.sqrt(m); return near((x + k * Math.sqrt(m)) ** 2, x * (x + j * Math.sqrt(m))) },
    }
  }
}
/** p. 29, ex. 27–28 */
export function telescopeStep(rng: Rng): Made {
  const s = int(rng, 1, 4), a = int(rng, 1, 5), n = int(rng, 3, 9), last = a + n * s * 1, A = a * a, B = last * last
  const end = A + Math.ceil((B - A) / s) * s
  const ok = (B - A) % s === 0
  const M = ok ? B : end
  return {
    text: `Arătați că $\\frac{${s}}{\\sqrt{${A + s}} + \\sqrt{${A}}} + \\frac{${s}}{\\sqrt{${A + 2 * s}} + \\sqrt{${A + s}}} + \\ldots + \\frac{${s}}{\\sqrt{${M}} + \\sqrt{${M - s}}} = ${last - a}$.`,
    solution: lines('Raționalizăm fiecare fracție:', show(`\\frac{${s}}{\\sqrt{n + ${s}} + \\sqrt{n}} = \\frac{${s}(\\sqrt{n + ${s}} - \\sqrt{n})}{${s}} = \\sqrt{n + ${s}} - \\sqrt{n}`), 'Termenii se reduc doi câte doi și rămâne:', show(`\\sqrt{${M}} - \\sqrt{${A}} = ${last} - ${a} = ${last - a}`)),
    verify: () => ok,
  }
}
/** p. 29, ex. 29, 32 */
export function doubleRadicals(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [2, 3, 5, 6, 7, 10, 11]), b = pick(rng, [1, 2, 3, 5]), c = pick(rng, [1, 2, 3, 5, 7])
    if (a <= b || a <= c || b === c || rootParts(a)[1] !== a) continue
    // √(a + b + 2√ab) − √(a + c − 2√ac) = √b + √c
    const w = (x: number) => (x === 1 ? '1' : `\\sqrt{${x}}`)
    return {
      text: `Calculați: $\\sqrt{${a + b} + 2\\sqrt{${a * b}}} - \\sqrt{${a + c} - 2\\sqrt{${a * c}}}$.`,
      solution: lines('Scriem numerele de sub radicali ca pătrate:', show(`${a + b} + 2\\sqrt{${a * b}} = (\\sqrt{${a}} + ${w(b)})^2, \\qquad ${a + c} - 2\\sqrt{${a * c}} = (\\sqrt{${a}} - ${w(c)})^2`), show(`(\\sqrt{${a}} + ${w(b)}) - (\\sqrt{${a}} - ${w(c)}) = ${b === 1 ? `1 + ${w(c)}` : c === 1 ? `1 + ${w(b)}` : `${w(b)} + ${w(c)}`}`)),
      verify: () => near(Math.sqrt(a + b + 2 * Math.sqrt(a * b)) - Math.sqrt(a + c - 2 * Math.sqrt(a * c)), Math.sqrt(b) + Math.sqrt(c)),
    }
  }
}
/** p. 27, ex. 13 */
export function systemSquares(rng: Rng): Made {
  for (;;) {
    const x0 = int(rng, -5, 5), y0 = int(rng, -5, 5), a = nonZero(rng, -4, 4), b = nonZero(rng, -4, 4), c = nonZero(rng, -4, 4), d = nonZero(rng, -5, 5)
    // (x + a)² − (y + b)² = x² − y² + k ; cx + dy = e
    const k = 2 * a * x0 + a * a - 2 * b * y0 - b * b
    if (2 * a * d + 2 * b * c === 0) continue
    const e = c * x0 + d * y0
    return {
      text: `Rezolvați sistemul de ecuații: $\\begin{cases} (${lin(a)})^2 - (${lin(b, 'y')})^2 = x^2 - y^2${sgn(k)} \\\\ ${poly([[c, 'x'], [d, 'y']])} = ${e} \\end{cases}$`,
      solution: lines('Desfacem pătratele în prima ecuație; $x^2$ și $y^2$ se reduc:', show(`\\begin{cases} ${poly([[2 * a, 'x'], [-2 * b, 'y']])} = ${k - a * a + b * b} \\\\ ${poly([[c, 'x'], [d, 'y']])} = ${e} \\end{cases}`), 'Prin metoda reducerii sau a substituției:', show(`x = ${x0}, \\quad y = ${y0}, \\qquad S = \\{(${x0}, ${y0})\\}`)),
      verify: () => 2 * a * x0 - 2 * b * y0 === k - a * a + b * b,
    }
  }
}
/** p. 27, ex. 14; p. 28, ex. 15–17 */
export function ineqSquares(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -5, 5), b = nonZero(rng, -5, 5), k = int(rng, 1, 3), x0 = int(rng, 0, 6), m = 2 * a * k - b
    if (m === 0) continue
    // (kx + a)² ≤ k²x² + bx + c
    const c = m * x0 + a * a, set = rng() < 0.5 ? N : Z, up = m > 0
    const S = up ? (set === N ? setOf(range(0, x0)) : `\\{\\ldots;\\ ${x0 - 1};\\ ${x0}\\}`) : `\\{${x0};\\ ${x0 + 1};\\ \\ldots\\}`
    return {
      text: `Rezolvați în $${set}$ inecuația $(${X([k, a])})^2 \\le ${X([k * k, b, c])}$.`,
      solution: lines(show(`${X(mul([k, a], [k, a]))} \\le ${X([k * k, b, c])} \\Leftrightarrow ${X([m, 0])} \\le ${c - a * a}`), m < 0 ? 'Împărțim la un număr negativ, deci sensul se schimbă:' : '', show(`x ${up ? '\\le' : '\\ge'} ${x0} \\Rightarrow S = ${S}`)),
      verify: () => (k * x0 + a) ** 2 === k * k * x0 * x0 + b * x0 + c,
    }
  }
}
/** p. 29, ex. 26 d–i */
export function ineqAlwaysPositive(rng: Rng): Made {
  const a = nonZero(rng, -5, 5), m = int(rng, 1, 9), k = pick(rng, [-4, -3, -2, 2, 3, 4]), b = nonZero(rng, -9, 9), pos = rng() < 0.5
  const f = pos === k > 0 ? '>' : '<'
  return {
    text: `Rezolvați în $${R}$ inecuația $${fr(X([1, 2 * a, a * a + m]), X([k, b]))} ${pos ? '>' : '<'} 0$.`,
    solution: lines(show(`${X([1, 2 * a, a * a + m])} = (${lin(a)})^2 + ${m} > 0, \\text{ pentru orice } x`), 'Semnul fracției este semnul numitorului:', show(`${X([k, b])} ${pos ? '>' : '<'} 0 \\Leftrightarrow x ${f} ${q(-b, k)}, \\quad S = ${f === '>' ? `\\left(${q(-b, k)}, +\\infty\\right)` : `\\left(-\\infty, ${q(-b, k)}\\right)`}`)),
    verify: () => m > 0,
  }
}

// ---------- 3.5 factoring ----------

/** p. 30, ex. 2–3 */
export function facBracket(rng: Rng): Made {
  const a = int(rng, 2, 7), b = nonZero(rng, -7, 7), c = int(rng, 1, 3), d = nonZero(rng, -7, 7), g = gcd(a, b)
  if (g > 1) return facBracket(rng)
  return {
    text: `Dați factor comun: $${a}x(${X([c, d])}) ${b < 0 ? '-' : '+'} ${cf(Math.abs(b))}(${X([c, d])})$.`,
    solution: lines(`Factorul comun este $(${X([c, d])})$:`, show(`(${X([c, d])})(${X([a, b])})`)),
    verify: () => g === 1,
  }
}
/** p. 30, ex. 4–5 */
export function facPerfectSquare(rng: Rng): Made {
  const a = int(rng, 1, 8), b = int(rng, 1, 8), s = pick(rng, [1, -1]), e = int(rng, 1, 2), v = e === 1 ? 'x' : 'x^2', v2 = e === 1 ? 'x^2' : 'x^4', g = gcd(a, b)
  if (g > 1) return facPerfectSquare(rng)
  return {
    text: `Restrângeți ca pătrat: $${poly([[a * a, v2], [2 * s * a * b, v + 'y'], [b * b, 'y^2']])}$.`,
    solution: show(`(${poly([[a, v]])})^2 ${s < 0 ? '-' : '+'} 2 \\cdot ${poly([[a, v]])} \\cdot ${poly([[b, 'y']])} + (${poly([[b, 'y']])})^2 = (${poly([[a, v], [s * b, 'y']])})^2`),
    verify: () => true,
  }
}
/** p. 30, ex. 6 */
export function facFillGap(rng: Rng): Made {
  const a = int(rng, 1, 9), b = int(rng, 1, 9), s = pick(rng, [1, -1]), gap = int(rng, 0, 2)
  const t = [poly([[a * a, 'x^2']]), `${s < 0 ? '-' : '+'} ${2 * a * b}x`, `+ ${b * b}`], ans = [poly([[a * a, 'x^2']]), `${2 * a * b}x`, String(b * b)][gap]
  const shown = t.map((x, i) => (i === gap ? (i === 0 ? '\\ldots' : i === 1 ? `${s < 0 ? '-' : '+'} \\ldots` : '+ \\ldots') : x)).join(' ')
  return {
    text: `Completați spațiul liber ca să obțineți pătratul unui binom: $${shown}$.`,
    solution: lines(show(`(${X([a, s * b])})^2 = ${X([a * a, 2 * s * a * b, b * b])}`), `Lipsește $${ans}$.`),
    verify: () => true,
  }
}
/** p. 30, ex. 7–8 */
export function facDifference(rng: Rng): Made {
  const a = int(rng, 1, 12), b = int(rng, 2, 13), e = int(rng, 1, 3), g = gcd(a, b)
  if (g > 1) return facDifference(rng)
  const v = e === 1 ? 'x' : `x^${e}`
  return {
    text: `Descompuneți în factori: $${poly([[a * a, `x^${2 * e}`], [-b * b, 'y^2']])}$.`,
    solution: show(`(${poly([[a, v]])})^2 - (${b}y)^2 = (${poly([[a, v], [-b, 'y']])})(${poly([[a, v], [b, 'y']])})`),
    verify: () => true,
  }
}
/** p. 31, ex. 13 */
export function facDiffBrackets(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 4), a = nonZero(rng, -5, 5), r = int(rng, 1, 4), b = nonZero(rng, -5, 5)
    const u = [p - r, p * a - r * b], w = [p + r, p * a + r * b]
    if (u[0] === 0 || u[1] === 0 || w[1] === 0) continue
    const show1 = (k: number, s: number) => (k === 1 ? `(${lin(s)})^2` : `${k * k}(${lin(s)})^2`)
    const gu = gcd(u[0], u[1]) * (u[0] < 0 ? -1 : 1), gw = gcd(w[0], w[1]), G = gu * gw
    return {
      text: `Descompuneți în factori: $${show1(p, a)} - ${show1(r, b)}$.`,
      solution: lines(show(`${p === 1 ? `(${lin(a)})^2` : `[${p}(${lin(a)})]^2`} - ${r === 1 ? `(${lin(b)})^2` : `[${r}(${lin(b)})]^2`} = [${X([p, p * a])} - (${X([r, r * b])})][${X([p, p * a])} + (${X([r, r * b])})]`), show(`= (${X(u)})(${X(w)})${G !== 1 ? ` = ${cf(G)}(${X(u.map((t) => t / gu))})(${X(w.map((t) => t / gw))})` : ''}`)),
      verify: () => same((x) => p * p * (x + a) ** 2 - r * r * (x + b) ** 2, (x) => at(u, x) * at(w, x)),
    }
  }
}
/** p. 31, ex. 11, 17 */
export function facCommonThen(rng: Rng): Made {
  const k = int(rng, 2, 6), e = int(rng, 1, 2), r1 = nonZero(rng, -7, 7), r2 = rng() < 0.4 ? -r1 : rng() < 0.4 ? r1 : nonZero(rng, -7, 7)
  const t = mul([1, r1], [1, r2]), E = [...t.map((c) => c * k), ...Array.from({ length: e }, () => 0)], c = `${k}x${e === 2 ? '^2' : ''}`
  return {
    text: `Descompuneți în factori: $${X(E)}$.`,
    solution: show(`${c}(${X(t)}) = ${c}${prod([fac(r1), fac(r2)])}`),
    verify: () => same((x) => at(E, x), (x) => k * x ** e * (x + r1) * (x + r2)),
  }
}
/** p. 31, ex. 14 o–t, 18 */
export function facTrinomialA(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 5), b = nonZero(rng, -5, 5), c = nonZero(rng, -6, 6)
    if (gcd(a, b) > 1) continue
    const t = mul([a, b], [1, c])
    if (t[1] === 0) continue
    return {
      text: `Descompuneți în factori: $${X(t)}$.`,
      solution: lines(`Scriem termenul din mijloc ca sumă, cu produsul coeficienților ${a} · ${t[2]} = ${a * t[2]}: $${poly([[t[1], 'x']])} = ${poly([[a * c, 'x'], [b, 'x']])}$.`.replace(`· -`, '· (-').replace(/\(-(\d+) =/, '(-$1) ='), show(`${poly([[a, 'x^2'], [a * c, 'x'], [b, 'x'], [t[2], '']])} = ${a}x(${lin(c)}) ${b < 0 ? '-' : '+'} ${cf(Math.abs(b))}(${lin(c)}) = (${lin(c)})(${X([a, b])})`)),
      verify: () => same((x) => at(t, x), (x) => (a * x + b) * (x + c)),
    }
  }
}
/** p. 32, ex. 26; p. 31, ex. 16 */
export function facCubicGroup(rng: Rng): Made {
  const a = nonZero(rng, -6, 6), b = int(rng, 1, 5), t = mul([1, a], [1, 0, -b * b])
  return {
    text: `Descompuneți în factori: $${X(t)}$.`,
    solution: show(`x^2(${lin(a)}) - ${cf(b * b)}(${lin(a)}) = (${lin(a)})(x^2 - ${b * b}) = (${lin(a)})(x - ${b})(x + ${b})`),
    verify: () => same((x) => at(t, x), (x) => (x + a) * (x * x - b * b)),
  }
}
/** p. 33, ex. 28–29 */
export function facSubstitution(rng: Rng): Made {
  const a = nonZero(rng, -5, 5), m = nonZero(rng, -5, 5), n = nonZero(rng, -5, 5)
  if (m + n === 0 || m === n) return facSubstitution(rng)
  const tr = (c: number) => { const D = a * a - 4 * c, s = Math.sqrt(D); if (D >= 0 && Number.isInteger(s)) { const r1 = (a + s) / 2, r2 = (a - s) / 2; return Number.isInteger(r1) ? prod([fac(r1), fac(r2)]) : `(${X([1, a, c])})` } return `(${X([1, a, c])})` }
  const f = `${tr(m)}${tr(n)}`, plain = `(${X([1, a, m])})(${X([1, a, n])})`
  return {
    text: `Descompuneți în factori: $(${X([1, a, 0])})(${X([1, a, m + n])})${sgn(m * n)}$.`,
    solution: lines(`Notăm $t = ${X([1, a, 0])}$:`, show(`t(${lin(m + n, 't')})${sgn(m * n)} = ${X([1, m + n, m * n], 't')} = (${lin(m, 't')})(${lin(n, 't')})`), show(`= ${plain}${f !== plain ? ` = ${f}` : ''}`)),
    verify: () => same((x) => { const t = x * x + a * x; return t * (t + m + n) + m * n }, (x) => at([1, a, m], x) * at([1, a, n], x)),
  }
}
/** p. 32, ex. 20 i–n; p. 33, ex. 29 b */
export function facSquareMinus(rng: Rng): Made {
  const a = nonZero(rng, -7, 7), b = int(rng, 1, 5), v = `${cf(b)}y`, s = rng() < 0.5
  return {
    text: s ? `Descompuneți în factori: $${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, ''], [-b * b, 'y^2']])}$.` : `Descompuneți în factori: $${poly([[b * b, 'y^2'], [-1, 'x^2'], [-2 * a, 'x'], [-a * a, '']])}$.`,
    solution: s
      ? show(`(${lin(a)})^2 - (${v})^2 = (${lin(a)} - ${v})(${lin(a)} + ${v})`)
      : show(`(${v})^2 - (${lin(a)})^2 = (${v} - x${sgn(-a)})(${v} + x${sgn(a)})`),
    verify: () => true,
  }
}
/** p. 33, ex. 27 b, e, 29 f */
export function facBiquadratic(rng: Rng): Made {
  const p = int(rng, 1, 7), r = p + int(rng, 1, 4), k = pick(rng, [1, 1, 2, 3]), t = [1, 0, -(p * p + r * r), 0, p * p * r * r].map((c) => c * k)
  return {
    text: `Descompuneți în factori: $${X(t)}$.`,
    solution: lines(`${k > 1 ? `Dăm factor comun pe ${k} și notăm` : 'Notăm'} $t = x^2$:`, show(`${cf(k)}${k > 1 ? `(${X([1, -(p * p + r * r), p * p * r * r], 't')})` : X([1, -(p * p + r * r), p * p * r * r], 't')} = ${cf(k)}(t - ${p * p})(t - ${r * r})`), show(`${cf(k)}(x^2 - ${p * p})(x^2 - ${r * r}) = ${cf(k)}(x - ${p})(x + ${p})(x - ${r})(x + ${r})`)),
    verify: () => [p, r, -p, -r].every((x) => at(t, x) === 0),
  }
}
/** p. 33, ex. 33 */
export function facParameter(rng: Rng): Made {
  const a = nonZero(rng, -7, 7), b = int(rng, 1, 7), E = [1, -2 * a, a * a - b * b], r1 = -a - b, r2 = -a + b
  return {
    text: lines(`Fie expresia $E(x) = ${X(E)}$.`, 'a) Descompuneți $E(x)$ în factori.', `b) Determinați numărul real $a$ pentru care $E(x) = (x - a)^2 - ${b * b}$, oricare ar fi $x$ real.`),
    solution: lines(show(`\\text{a) } E(x) = ${prod([fac(r1), fac(r2)])}`), show(`\\text{b) } E(x) = (${X([1, -2 * a, a * a])}) - ${b * b} = (${lin(-a)})^2 - ${b * b} \\Rightarrow a = ${a}`)),
    verify: () => same((x) => at(E, x), (x) => (x + r1) * (x + r2)),
  }
}

// ---------- 3.6–3.7 algebraic fractions ----------

/** p. 35, ex. 1 */
export function afNoSense(rng: Rng): Made {
  const a = nonZero(rng, -8, 8), b = int(rng, 1, 9), k = int(rng, 2, 5), c = nonZero(rng, -9, 9)
  return {
    text: `Determinați valorile reale ale lui $x$ pentru care rapoartele nu au sens: a) $${fr(lin(a), X([k, c]))}$; b) $${fr(X([2, a]), `x^2 - ${b * b}`)}$.`,
    solution: lines('Un raport nu are sens dacă numitorul este 0:', show(`\\text{a) } ${X([k, c])} = 0 \\Rightarrow x = ${q(-c, k)}`), show(`\\text{b) } x^2 = ${b * b} \\Rightarrow x \\in \\{-${b};\\ ${b}\\}`)),
    verify: () => true,
  }
}
/** p. 35, ex. 2 */
export function afSense(rng: Rng): Made {
  const a = nonZero(rng, -8, 8), b = nonZero(rng, -8, 8), c = int(rng, 1, 9)
  if (a === b) return afSense(rng)
  return {
    text: `Determinați valorile reale ale lui $x$ pentru care au sens rapoartele: a) $${fr(lin(c), `x(${lin(a)})`)}$; b) $${fr(X([3, c]), X(mul([1, a], [1, b])))}$.`,
    solution: lines('Numitorul trebuie să fie diferit de 0:', show(`\\text{a) } x(${lin(a)}) \\ne 0 \\Rightarrow ${except([0, -a])}`), show(`\\text{b) } ${prod([fac(a), fac(b)])} \\ne 0 \\Rightarrow ${except([-a, -b])}`)),
    verify: () => at(mul([1, a], [1, b]), -a) === 0,
  }
}
/** p. 35, ex. 3–4 */
export function afValue(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 5), b = nonZero(rng, -7, 7), c = nonZero(rng, -5, 5), d = nonZero(rng, -7, 7), x = nonZero(rng, -5, 5), y = nonZero(rng, -5, 5)
    const D = (t: number) => t * t + c * t + d
    if (x === y || D(x) === 0 || D(y) === 0) continue
    const s = (a * x + b) * D(y) + (a * y + b) * D(x)
    return {
      text: `Fie raportul $E(x) = ${fr(X([a, b]), X([1, c, d]))}$. Calculați $E(${x}) + E(${y})$.`,
      solution: lines(show(`E(${x}) = ${fr(a * x + b, D(x))}${q(a * x + b, D(x)) !== fr(a * x + b, D(x)) ? ` = ${q(a * x + b, D(x))}` : ''}, \\qquad E(${y}) = ${fr(a * y + b, D(y))}${q(a * y + b, D(y)) !== fr(a * y + b, D(y)) ? ` = ${q(a * y + b, D(y))}` : ''}`), show(`E(${x}) + E(${y}) = ${q(s, D(x) * D(y))}`)),
      verify: () => near((a * x + b) / D(x) + (a * y + b) / D(y), s / (D(x) * D(y))),
    }
  }
}
/** p. 36, ex. 8 */
export function afSimplifyEasy(rng: Rng): Made {
  const k = int(rng, 2, 6), a = int(rng, 1, 9), m = int(rng, 2, 6), g = gcd(k, m), s = pick(rng, [1, -1])
  return {
    text: `Simplificați raportul $${fr(X([k, s * k * a]), X([m, 0, -m * a * a]))}$.`,
    solution: show(`\\frac{${k}(${lin(s * a)})}{${m}(x - ${a})(x + ${a})} = ${k / g === 1 && m / g === 1 ? fr(1, lin(-s * a)) : fr(k / g, m / g === 1 ? lin(-s * a) : `${m / g}(${lin(-s * a)})`)}, \\quad x \\ne \\pm ${a}`),
    verify: () => same((x) => (k * x + s * k * a) / (m * x * x - m * a * a), (x) => k / (m * (x - s * a))),
  }
}
/** p. 35, ex. 5; p. 36, ex. 7 */
export function afAmplify(rng: Rng): Made {
  const a = nonZero(rng, -6, 6), b = int(rng, 1, 4), c = nonZero(rng, -6, 6), d = nonZero(rng, -6, 6)
  if (a === d) return afAmplify(rng)
  return {
    text: `Amplificați fracția $${fr(X([b, c]), lin(d))}$ cu $${lin(a)}$, scriind condițiile de existență.`,
    solution: lines(`Condiții: $x \\ne ${-d}$ și $x \\ne ${-a}$.`, show(`\\frac{(${X([b, c])})(${lin(a)})}{(${lin(d)})(${lin(a)})} = ${fr(X(mul([b, c], [1, a])), X(mul([1, d], [1, a])))}`)),
    verify: () => same((x) => (b * x + c) / (x + d), (x) => at(mul([b, c], [1, a]), x) / at(mul([1, d], [1, a]), x)),
  }
}
/** p. 37, ex. 1 */
export function afSumEasy(rng: Rng): Made {
  const a = int(rng, 1, 6), b = nonZero(rng, -6, 6), c = int(rng, 2, 5), d = nonZero(rng, -7, 7), n = [a * c, b * c + d], g = gcd(gcd(n[0], Math.abs(n[1])), c), e = c / g
  return {
    text: `Efectuați, pentru $x \\ne 0$: $${fr(X([a, b]), 'x')} + ${fr(d < 0 ? `(${d})` : d, `${c}x`)}$.`.replace(/\+ \\frac\{\((-\d+)\)\}/, (_, v) => `- \\frac{${-Number(v)}}`),
    solution: lines(`Numitorul comun este $${c}x$:`, show(`${fr(`${c}(${X([a, b])})${sgn(d)}`, `${c}x`)} = ${fr(X(n), `${c}x`)}${g > 1 ? ` = ${fr(X(n.map((t) => t / g)), `${cf(e)}x`)}` : ''}`)),
    verify: () => same((x) => (a * x + b) / x + d / (c * x), (x) => at(n, x) / (c * x)),
  }
}
/** p. 36, ex. 9–10 */
export function afSimplify(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -6, 6), b = nonZero(rng, -6, 6), c = nonZero(rng, -6, 6), k = int(rng, 1, 3)
    if (b === c) continue
    const num = mul([1, a], [k, b]), den = mul([1, a], [1, c])
    if (k * -c + b === 0 || gcd(k, b) > 1 || num[1] === 0 || den[1] === 0) continue
    return {
      text: `Simplificați raportul $${fr(X(num), X(den))}$.`,
      solution: lines('Descompunem numărătorul și numitorul:', show(`\\frac{(${lin(a)})(${X([k, b])})}{(${lin(a)})(${lin(c)})} = ${fr(X([k, b]), lin(c))}, \\quad ${except([-a, -c])}`)),
      verify: () => same((x) => at(num, x) / at(den, x), (x) => (k * x + b) / (x + c)),
    }
  }
}
/** p. 37, ex. 2–3 */
export function afSum(rng: Rng): Made {
  const a = int(rng, 1, 8), p = nonZero(rng, -5, 5), r = int(rng, 1, 5), c = [r * 0 + p + r, 0], m = nonZero(rng, -9, 9)
  // p/(x − a) + r/(x + a) + (mx + n)/(x² − a²), made so that the sum simplifies to s/(x − a)
  const s = nonZero(rng, -6, 6), mx = s - p - r, n = s * a - p * a + r * a
  void c; void m
  if (mx === 0 && n === 0) return afSum(rng)
  const g3 = X([mx, n])
  return {
    text: `Efectuați: $${fr(p, lin(-a))} + ${fr(r, lin(a))} + ${fr(g3, `x^2 - ${a * a}`)}$.`.replace(/\$\\frac\{-(\d+)\}/, '$-\\frac{$1}'),
    solution: lines(`Numitorul comun este $(x - ${a})(x + ${a})$; condiții: $x \\ne \\pm ${a}$.`, show(`\\frac{${cf(p)}(x + ${a}) + ${cf(r)}(x - ${a}) + (${g3})}{(x - ${a})(x + ${a})} = \\frac{${X([s, s * a])}}{(x - ${a})(x + ${a})} = ${fr(s, lin(-a)).replace(/^\\frac\{-(\d+)\}/, '-\\frac{$1}')}`)),
    verify: () => same((x) => p / (x - a) + r / (x + a) + (mx * x + n) / (x * x - a * a), (x) => s / (x - a)),
  }
}
/** p. 37, ex. 5; p. 38, ex. 5–6 */
export function afProduct(rng: Rng): Made {
  const [a, b, c, d] = shuffle(rng, [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 4), div = rng() < 0.5
  // (x+a)(x+b)/((x+c)(x+d)) · (x+c)/(x+a) = (x+b)/(x+d)
  const A = X(mul([1, a], [1, b])), B = X(mul([1, c], [1, d]))
  const x2 = div ? fr(X(mul([1, a], [1, 0])), X(mul([1, c], [1, 0]))) : fr(X(mul([1, c], [1, 0])), X(mul([1, a], [1, 0])))
  return {
    text: `Efectuați: $${fr(A, B)} ${div ? ':' : '\\cdot'} ${x2}$.`,
    solution: lines(`${div ? 'Înmulțim cu fracția răsturnată și descompunem' : 'Descompunem'} în factori:`, show(`\\frac{(${lin(a)})(${lin(b)})}{(${lin(c)})(${lin(d)})} \\cdot \\frac{x(${lin(c)})}{x(${lin(a)})} = ${fr(lin(b), lin(d))}`), `Condiții: $${except([0, -a, -c, -d])}$.`),
    verify: () => same((x) => ((x + a) * (x + b) * (x + c)) / ((x + c) * (x + d) * (x + a)), (x) => (x + b) / (x + d)),
  }
}
/** p. 38, ex. 7 h–k */
export function afBracket(rng: Rng): Made {
  const a = nonZero(rng, -6, 6), k = int(rng, 2, 7), b = a - k // 1 − k/(x + a) = (x + a − k)/(x + a)
  if (b === 0) return afBracket(rng)
  const c = nonZero(rng, -6, 6)
  if (c === b || c === a) return afBracket(rng)
  return {
    text: `Efectuați: $\\left(1 - ${fr(k, lin(a))}\\right) : ${fr(X(mul([1, b], [1, c])), X([1, a, 0]))}$.`,
    solution: lines('Calculăm paranteza și descompunem numărătorul împărțitorului:', show(`${fr(`${lin(a)} - ${k}`, lin(a))} \\cdot ${fr(`x(${lin(a)})`, `(${lin(b)})(${lin(c)})`)} = ${fr(lin(b), lin(a))} \\cdot ${fr(`x(${lin(a)})`, `(${lin(b)})(${lin(c)})`)} = ${fr('x', lin(c))}`), `Condiții: $${except([0, -a, -b, -c])}$.`),
    verify: () => same((x) => (1 - k / (x + a)) / (((x + b) * (x + c)) / (x * x + a * x)), (x) => x / (x + c)),
  }
}
/** p. 39, ex. 9–10 */
export function afExpression(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 5), p = nonZero(rng, -5, 5), r = int(rng, 1, 6), k = int(rng, 1, 2)
    // E = (p/(x−a) + r/(x+a)) : 1/(x−a)... = (p(x+a) + r(x−a))/(x+a) → S = p+r, T = a(p−r)
    const S = p + r, T = a * (p - r)
    if (S === 0 || T === 0) continue
    const rest = T - S * a // S + rest/(x+a) = (p(x+a)+r(x-a))/(x+a); rest = −2ra
    const ds = range(1, Math.abs(rest)).filter((d) => rest % d === 0)
    const sol = asc(ds.flatMap((d) => [d - a, -d - a])).filter((x) => x !== a && x !== -a)
    void k
    return {
      text: lines(`Fie expresia $E(x) = \\left(${fr(p, lin(-a)).replace(/^\\frac\{-(\d+)\}/, '-\\frac{$1}')} + ${fr(r, lin(a))}\\right) : ${fr(1, lin(-a))}$, unde $x \\in ${R} \\setminus \\{\\pm ${a}\\}$.`, `a) Aduceți $E(x)$ la forma cea mai simplă.`, `b) Aflați numerele întregi $x$ pentru care $E(x) \\in ${Z}$.`),
      solution: lines(show(`\\text{a) } E(x) = \\frac{${cf(p)}(x + ${a}) + ${cf(r)}(x - ${a})}{(x - ${a})(x + ${a})} \\cdot (x - ${a}) = ${fr(X([S, T]), lin(a))}`), show(`\\text{b) } E(x) = ${S} ${rest < 0 ? '-' : '+'} ${fr(Math.abs(rest), lin(a))}`), `Deci $${lin(a)}$ divide pe ${Math.abs(rest)} și $x \\ne \\pm ${a}$:`, show(`x \\in ${setOf(sol)}`)),
      verify: () => same((x) => (p / (x - a) + r / (x + a)) * (x - a), (x) => (S * x + T) / (x + a)) && sol.every((x) => Number.isInteger((S * x + T) / (x + a))),
    }
  }
}
/** p. 36, ex. 11 m–p; p. 37, ex. 11 q–t */
export function afSubstitution(rng: Rng): Made {
  const a = pick(rng, [-4, -3, -2, 2, 3, 4]), m = int(rng, 1, 5), n = nonZero(rng, -6, 6), r = nonZero(rng, -6, 6)
  if (n === r || n === m || r === m) return afSubstitution(rng)
  const t = X([1, a, 0]), tri = (u: number, w: number) => `(${t})^2 ${u + w < 0 ? '-' : '+'} ${cf(Math.abs(u + w))}(${t})${sgn(u * w)}`.replace(/ [+-] 0\([^)]*\)/, '')
  return {
    text: `Simplificați raportul $${fr(tri(m, n), tri(m, r))}$.`,
    solution: lines(`Notăm $t = ${t}$ și descompunem:`, show(`${fr(X([1, m + n, m * n], 't'), X([1, m + r, m * r], 't'))} = ${fr(`(${lin(m, 't')})(${lin(n, 't')})`, `(${lin(m, 't')})(${lin(r, 't')})`)} = ${fr(lin(n, 't'), lin(r, 't'))} = ${fr(X([1, a, n]), X([1, a, r]))}`)),
    verify: () => same((x) => { const u = x * x + a * x; return (u * u + (m + n) * u + m * n) / (u * u + (m + r) * u + m * r) }, (x) => (x * x + a * x + n) / (x * x + a * x + r)),
  }
}
/** p. 37, ex. 12–13 */
export function afReducible(rng: Rng): Made {
  const u = nonZero(rng, -6, 6), v = nonZero(rng, -6, 6), k = int(rng, 2, 5)
  if (u === v) return afReducible(rng)
  const b = asc([-k * u, -k * v])
  return {
    text: `Determinați numerele reale $b$ pentru care fracția $F(x) = ${fr(X(mul([1, -u], [1, -v])), `${k}x + b`)}$ este reductibilă.`,
    solution: lines(show(`${X(mul([1, -u], [1, -v]))} = (${lin(-u)})(${lin(-v)})`), `Fracția se simplifică dacă numitorul $${k}x + b$ este multiplu al unuia dintre factori, adică se anulează pentru $x = ${u}$ sau $x = ${v}$:`, show(`${k * u} + b = 0 \\Rightarrow b = ${-k * u} \\quad \\text{ sau } \\quad ${k * v} + b = 0 \\Rightarrow b = ${-k * v}`), show(`b \\in ${setOf(b)}`)),
    verify: () => b.length === 2,
  }
}
/** p. 36, ex. 11 a–j */
export function afCubic(rng: Rng): Made {
  const a = nonZero(rng, -5, 5), b = int(rng, 1, 4), num = mul([1, a], [1, 0, -b * b]), den = mul([1, a], [1, b])
  if (a === b || a === -b) return afCubic(rng)
  return {
    text: `Simplificați raportul $${fr(X(num), X(den))}$.`,
    solution: lines('La numărător grupăm termenii doi câte doi:', show(`\\frac{x^2(${lin(a)}) - ${cf(b * b)}(${lin(a)})}{(${lin(a)})(${lin(b)})} = \\frac{(${lin(a)})(x - ${b})(x + ${b})}{(${lin(a)})(x + ${b})} = x - ${b}`), `Condiții: $${except([-a, -b])}$.`),
    verify: () => same((x) => at(num, x) / at(den, x), (x) => x - b),
  }
}
/** p. 39, ex. 11; p. 40 */
export function afEquation(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 5), b = nonZero(rng, -6, 6), c = int(rng, 1, 5), d = nonZero(rng, -6, 6), x0 = nonZero(rng, -7, 7)
    // a/(x + b) = c/(x + d): (a − c)x = cb − ad
    if (a === c || b === d || (a - c) * x0 !== c * b - a * d || x0 === -b || x0 === -d) continue
    return {
      text: `Rezolvați ecuația $${fr(a, lin(b))} = ${fr(c, lin(d))}$, ținând cont de condițiile de existență.`,
      solution: lines(`Condiții: $x \\ne ${-b}$ și $x \\ne ${-d}$.`, show(`${a === 1 ? lin(d) : `${a}(${lin(d)})`} = ${c === 1 ? lin(b) : `${c}(${lin(b)})`} \\Rightarrow ${X([a - c, 0])} = ${c * b - a * d} \\Rightarrow x = ${x0}`), 'Valoarea respectă condițiile.'),
      verify: () => near(a / (x0 + b), c / (x0 + d)),
    }
  }
}

// ---------- 3.8 equations of the second degree ----------

const quadSol = (a: number, b: number, c: number) => {
  const D = b * b - 4 * a * c, s = Math.sqrt(D)
  if (D < 0) return { D, tex: `\\Delta < 0 \\Rightarrow S = \\varnothing` }
  if (D === 0) return { D, tex: `\\Delta = 0 \\Rightarrow x_1 = x_2 = ${q(-b, 2 * a)}` }
  if (Number.isInteger(s)) return { D, tex: `x_1 = ${fr(`${-b} - ${s}`, 2 * a)} = ${q(-b - s, 2 * a)}, \\quad x_2 = ${fr(`${-b} + ${s}`, 2 * a)} = ${q(-b + s, 2 * a)}` }
  return { D, tex: `x_{1,2} = ${fr(`${-b} \\pm ${root(D)}`, 2 * a)}` }
}
const delta = (a: number, b: number, c: number) => `\\Delta = b^2 - 4ac = ${b < 0 ? `(${b})` : b}^2 - 4 \\cdot ${a < 0 ? `(${a})` : a} \\cdot ${c < 0 ? `(${c})` : c} = ${b * b - 4 * a * c}`
/** p. 41, ex. 1; p. 42, ex. 1, 7 */
export function qdFormula(rng: Rng): Made {
  const a = pick(rng, [1, 1, 2, 3, -1, -2]), r = int(rng, -6, 6), s = int(rng, -7, 7), k = rng() < 0.2
  const [A, B, C] = k ? [Math.abs(a), nonZero(rng, -3, 3), int(rng, 3, 9)] : mul([a, -a * r], [1, -s])
  const { tex } = quadSol(A, B, C)
  return {
    text: `Rezolvați în $${R}$, cu ajutorul discriminantului, ecuația $${X([A, B, C])} = 0$.`,
    solution: lines(show(delta(A, B, C)), show(tex)),
    verify: () => k || (at([A, B, C], r) === 0 && at([A, B, C], s) === 0),
  }
}
/** p. 42, ex. 3 */
export function qdSquareForm(rng: Rng): Made {
  const k = int(rng, 1, 5), a = nonZero(rng, -6, 6), b = int(rng, 1, 12)
  if (gcd(k, a) > 1) return qdSquareForm(rng)
  return {
    text: `Rezolvați în $\\mathbb{Q}$ ecuația $${X([k * k, 2 * k * a, a * a])} = ${b * b}$.`,
    solution: lines(show(`(${X([k, a])})^2 = ${b}^2 \\Rightarrow ${X([k, a])} = ${b} \\text{ sau } ${X([k, a])} = -${b}`), show(`x = ${q(b - a, k)} \\text{ sau } x = ${q(-b - a, k)}`)),
    verify: () => near((k * ((b - a) / k) + a) ** 2, b * b),
  }
}
/** p. 42, ex. 5–6 */
export function qdProduct(rng: Rng): Made {
  const a = int(rng, 1, 5), b = nonZero(rng, -9, 9), c = int(rng, 1, 5), d = nonZero(rng, -9, 9), e = int(rng, 1, 7)
  if (gcd(a, b) > 1 || gcd(c, d) > 1 || a * d === b * c) return qdProduct(rng)
  return {
    text: `Rezolvați în $${R}$ ecuația $(${X([a, b])})(${X([c, d])})(x^2 - ${e * e}) = 0$.`,
    solution: lines('Un produs este 0 dacă cel puțin un factor este 0:', show(`${X([a, b])} = 0 \\Rightarrow x = ${q(-b, a)}; \\qquad ${X([c, d])} = 0 \\Rightarrow x = ${q(-d, c)}; \\qquad x^2 = ${e * e} \\Rightarrow x = \\pm ${e}`)),
    verify: () => true,
  }
}
/** p. 42, ex. 8 */
export function qdToForm(rng: Rng): Made {
  const r = int(rng, -6, 6), s = int(rng, -6, 6), a = nonZero(rng, -4, 4), b = nonZero(rng, -4, 4)
  // (2x + a)² − (x + b)(3x) ... make x² + Bx + C with roots r, s: (2x + a)² = 3x² + px + w
  const [, B, C] = mul([1, -r], [1, -s]), p = 4 * a - B, w = a * a - C
  void b
  return {
    text: `Rezolvați în $${R}$ ecuația $(${X([2, a])})^2 = ${X([3, p, w])}$.`,
    solution: lines('Aducem ecuația la forma $ax^2 + bx + c = 0$:', show(`4x^2${4 * a < 0 ? ' - ' : ' + '}${Math.abs(4 * a)}x + ${a * a} - (${X([3, p, w])}) = 0 \\Leftrightarrow ${X([1, B, C])} = 0`), show(delta(1, B, C)), show(quadSol(1, B, C).tex)),
    verify: () => [r, s].every((x) => (2 * x + a) ** 2 === 3 * x * x + p * x + w),
  }
}
/** p. 42, ex. 9 */
export function qdFractionSquare(rng: Rng): Made {
  const a = int(rng, 1, 4), b = nonZero(rng, -7, 7), c = int(rng, 2, 5), d = int(rng, 1, 8)
  if (gcd(a, b) > 1) return qdFractionSquare(rng)
  return {
    text: `Rezolvați în $${R}$ ecuația $\\left(${fr(X([a, b]), c)}\\right)^2 = ${d * d}$.`,
    solution: lines(show(`${fr(X([a, b]), c)} = \\pm ${d} \\Leftrightarrow ${X([a, b])} = \\pm ${c * d}`), show(`x = ${q(c * d - b, a)} \\text{ sau } x = ${q(-c * d - b, a)}`)),
    verify: () => near(((a * ((c * d - b) / a) + b) / c) ** 2, d * d),
  }
}
/** p. 42, ex. 10 */
export function qdGivenRoot(rng: Rng): Made {
  for (;;) {
    const x0 = nonZero(rng, -4, 4), p = nonZero(rng, -3, 3), b = nonZero(rng, -6, 6), m = nonZero(rng, -5, 5), k = p * x0 + 1
    // x² + (pm)x... : x² + p·m·x + m + c = 0, c so that x0 is a root
    if (k === 0) continue
    const c = -(x0 * x0 + p * m * x0 + m), x1 = -p * m - x0
    void b
    return {
      text: `Aflați numărul real $m$, știind că $${x0}$ este soluție a ecuației $x^2 ${p < 0 ? '-' : '+'} ${cf(Math.abs(p))}mx + m${sgn(c)} = 0$, apoi aflați cealaltă soluție.`,
      solution: lines(`Înlocuim $x = ${x0}$:`, show(`${x0 * x0} ${p * x0 < 0 ? '-' : '+'} ${cf(Math.abs(p * x0))}m + m${sgn(c)} = 0 \\Rightarrow ${X([k, 0], 'm')} = ${-x0 * x0 - c} \\Rightarrow m = ${m}`), show(`${X([1, p * m, m + c])} = 0 \\Leftrightarrow ${prod([fac(-x0), fac(-x1)])} = 0 \\Rightarrow x = ${x1}${x1 === x0 ? ' \\text{ (solutie dubla)}' : ''}`)),
      verify: () => at([1, p * m, m + c], x0) === 0 && at([1, p * m, m + c], x1) === 0,
    }
  }
}
/** p. 42, ex. 12, 14–15 */
export function qdNumbers(rng: Rng): Made {
  const v = int(rng, 0, 2)
  if (v === 0) {
    const n = 2 * int(rng, 2, 20) + 1, S = n * n + (n + 2) ** 2
    return {
      text: `Suma pătratelor a două numere naturale impare consecutive este ${S}. Aflați numerele.`,
      solution: lines('Notăm numerele cu $n$ și $n + 2$:', show(`n^2 + (n + 2)^2 = ${S} \\Leftrightarrow 2n^2 + 4n + 4 - ${S} = 0 \\Leftrightarrow n^2 + 2n - ${(S - 4) / 2} = 0`), show(`\\Delta = 4 + ${2 * (S - 4)} = ${4 + 2 * (S - 4)} = ${2 * n + 2}^2 \\Rightarrow n = ${n}`), `Numerele sunt ${n} și ${n + 2}.`),
      verify: () => (2 * n + 2) ** 2 === 4 + 2 * (S - 4),
    }
  }
  const x = int(rng, 3, 30), y = x + int(rng, 1, 15)
  return {
    text: `Aflați două numere a căror sumă este ${x + y}, iar produsul este ${x * y}.`,
    solution: lines(`Notăm unul dintre numere cu $x$; celălalt este $${x + y} - x$:`, show(`x(${x + y} - x) = ${x * y} \\Leftrightarrow x^2 - ${x + y}x + ${x * y} = 0`), show(`\\Delta = ${(x + y) ** 2} - ${4 * x * y} = ${(y - x) ** 2} \\Rightarrow x_1 = ${x}, \\quad x_2 = ${y}`), `Numerele sunt ${x} și ${y}.`),
    verify: () => (x + y) ** 2 - 4 * x * y === (y - x) ** 2,
  }
}
/** p. 42, ex. 13 */
export function qdTriangle(rng: Rng): Made {
  const [u, w, h] = rightTriangle(rng, 60), [a, b] = [Math.min(u, w), Math.max(u, w)], s = a + b, half = (s * s - h * h) / 2
  return {
    text: `Suma catetelor unui triunghi dreptunghic este de ${s} cm, iar ipotenuza are ${h} cm. Aflați lungimile catetelor și aria triunghiului.`,
    solution: lines(`Notăm catetele cu $x$ și $${s} - x$. Din teorema lui Pitagora:`, show(`x^2 + (${s} - x)^2 = ${h * h} \\Leftrightarrow x^2 - ${s}x + ${half} = 0`), show(`\\Delta = ${s * s} - ${4 * half} = ${(b - a) ** 2} \\Rightarrow x_1 = ${a}, \\quad x_2 = ${b}`), `Catetele au ${a} cm și ${b} cm, iar aria este $${fr(`${a} \\cdot ${b}`, 2)} = ${(a * b) / 2}\\text{ cm}^2$.`),
    verify: () => a * b === half,
  }
}
/** p. 42, ex. 16 */
export function qdSquareSide(rng: Rng): Made {
  const l = int(rng, 3, 30), d = int(rng, 2, 9), D = 2 * d * l + d * d
  return {
    text: `Dacă mărim latura unui pătrat cu ${d} cm, aria lui crește cu ${D} cm². Aflați latura pătratului.`,
    solution: show(`(\\ell + ${d})^2 - \\ell^2 = ${D} \\Leftrightarrow ${2 * d}\\ell + ${d * d} = ${D} \\Rightarrow \\ell = ${l}\\text{ cm}`),
    verify: () => (l + d) ** 2 - l * l === D,
  }
}
/** p. 43, ex. 17–18 */
export function qdFractions(rng: Rng): Made {
  for (;;) {
    const r = int(rng, -7, 7), s = int(rng, -7, 7), a = nonZero(rng, -5, 5)
    if (r === s || r === -a || s === -a || r + s + a === 0) continue
    // x + k/(x + a) = t : x² + (a − t)x + k − at = 0
    const t = a + r + s, k = r * s + a * t
    if (k === 0) continue
    return {
      text: `Rezolvați în $${R}$ ecuația $x ${k < 0 ? '-' : '+'} ${fr(Math.abs(k), lin(a))} = ${t}$, ținând cont de condițiile de existență.`,
      solution: lines(`Condiție: $x \\ne ${-a}$. Înmulțim cu $${lin(a)}$:`, show(`x(${lin(a)})${sgn(k)} = ${cf(t)}(${lin(a)}) \\Leftrightarrow ${X([1, -(r + s), r * s])} = 0`), show(`${quadSol(1, -(r + s), r * s).tex}`), 'Ambele valori respectă condiția.'),
      verify: () => [r, s].every((x) => near(x + k / (x + a), t)),
    }
  }
}
/** p. 43, ex. 22 */
export function qdEqualRoots(rng: Rng): Made {
  const p = int(rng, 1, 3), d = int(rng, 1, 8), u = int(rng, -8, 5), c = int(rng, 0, 1)
  // x² + 2p·... : x² + (m + u)x + d² = 0  → m + u = ±2d
  const k = p * p * d * d, m = asc([-u + 2 * p * d, -u - 2 * p * d])
  void c
  return {
    text: `Determinați numerele reale $m$ pentru care ecuația $x^2 + (${lin(u, 'm')})x + ${k} = 0$ are soluții reale egale.`.replace(/\+ \(m\)x/, '+ mx'),
    solution: lines('Soluțiile sunt egale dacă $\\Delta = 0$:', show(`(${lin(u, 'm')})^2 - 4 \\cdot ${k} = 0 \\Leftrightarrow (${lin(u, 'm')})^2 = ${4 * k} \\Leftrightarrow ${lin(u, 'm')} = \\pm ${2 * p * d}`), show(`m \\in ${setOf(m)}`)),
    verify: () => m.every((v) => (v + u) ** 2 === 4 * k),
  }
}
/** p. 43, ex. 19–21 */
export function qdAlwaysReal(rng: Rng): Made {
  const a = nonZero(rng, -5, 5), c = int(rng, 1, 9), v = rng() < 0.5
  // x² − 2(m + a)x + (m + a)² − c (Δ = 4c)  or  x² + 2(m+a)x + (m+a)² + c  (Δ = −4c)
  const K = [1, 2 * a, a * a + (v ? -c : c)]
  return {
    text: `Demonstrați că ecuația $x^2 - 2(${lin(a, 'm')})x ${X(K, 'm').replace(/^/, '+ ')} = 0$ ${v ? 'are soluții reale distincte' : 'nu are soluții reale'}, oricare ar fi $m \\in ${R}$.`,
    solution: lines(show(`\\Delta = 4(${lin(a, 'm')})^2 - 4(${X(K, 'm')}) = 4(${X([1, 2 * a, a * a], 'm')} - ${X(K, 'm').replace(/ ([+-]) /g, (_, s) => (s === '+' ? ' - ' : ' + '))}) = ${v ? 4 * c : -4 * c}`), v ? `Cum $\\Delta > 0$ pentru orice $m$, ecuația are două soluții reale distincte.` : `Cum $\\Delta < 0$ pentru orice $m$, ecuația nu are soluții reale.`),
    verify: () => a * a - K[2] === (v ? c : -c),
  }
}
/** p. 44, test 2, ex. 5 b, 6 */
export function qdSumSquares(rng: Rng): Made {
  const a = int(rng, 1, 3), b = nonZero(rng, -4, 4), c = nonZero(rng, -5, 5)
  // (ax − by)² + (x + c)² = 0
  return {
    text: `Determinați numerele reale $x$ și $y$ pentru care $${poly([[a * a + 1, 'x^2'], [2 * c, 'x'], [c * c, ''], [-2 * a * b, 'xy'], [b * b, 'y^2']])} = 0$.`,
    solution: lines('Scriem expresia ca sumă de pătrate:', show(`(${poly([[a, 'x'], [-b, 'y']])})^2 + (${lin(c)})^2 = 0`), show(`${lin(c)} = 0 \\Rightarrow x = ${-c}, \\qquad ${poly([[a, 'x'], [-b, 'y']])} = 0 \\Rightarrow y = ${q(-a * c, b)}`)),
    verify: () => near(a * -c - b * ((-a * c) / b), 0),
  }
}
/** p. 43, test 1, ex. 7 */
export function quizPoints(rng: Rng): Made {
  const n = int(rng, 15, 40), g = int(rng, 2, 6), w = int(rng, 1, 6), ok = int(rng, Math.ceil(n / 2), n - 2), s = g * ok - w * (n - ok)
  if (s <= 0) return quizPoints(rng)
  return {
    text: `La un concurs, Mihai primește ${de(g)} puncte pentru un răspuns corect și pierde ${w === 1 ? 'un punct' : `${de(w)} puncte`} pentru unul greșit. După ${de(n)} întrebări are ${s === 1 ? 'un punct' : `${de(s)} puncte`}. La câte întrebări a răspuns corect?`,
    solution: lines('Notăm cu $x$ numărul răspunsurilor corecte:', show(`${g}x - ${cf(w)}(${n} - x) = ${s} \\Leftrightarrow ${g + w}x = ${s + w * n} \\Rightarrow x = ${ok}`), `A răspuns corect la ${de(ok)} întrebări.`),
    verify: () => (g + w) * ok === s + w * n,
  }
}

export const KINDS: Kind8[] = [
  { id: 'viii-p-radicals', joins: 'viii-radicals', label: '', topic: 'Algebră', forms: { 1: [inverseConj, meansConj], 2: [conjSum, radicalEquation], 3: [telescopeStep, doubleRadicals] } },
  { id: 'viii-p-system', joins: 'viii-system', label: '', topic: 'Algebră', forms: { 1: [], 2: [], 3: [systemSquares] } },
  { id: 'viii-p-ineq-squares', joins: 'viii-inequality', label: '', topic: 'Algebră', forms: { 1: [], 2: [ineqSquares], 3: [ineqAlwaysPositive] } },
  { id: 'viii-p-factoring', joins: 'viii-factoring', label: '', topic: 'Algebră', forms: { 1: [facBracket, facPerfectSquare, facFillGap, facDifference], 2: [facDiffBrackets, facCommonThen, facTrinomialA, facCubicGroup], 3: [facSubstitution, facSquareMinus, facBiquadratic, facParameter] } },
  { id: 'viii-alg-fractions', label: 'Fracții algebrice', topic: 'Algebră', forms: { 1: [afNoSense, afSense, afValue, afSimplifyEasy, afAmplify, afSumEasy], 2: [afSimplify, afSum, afProduct, afBracket], 3: [afExpression, afSubstitution, afReducible, afCubic, afEquation] } },
  { id: 'viii-p-quadratic', joins: 'viii-quadratic', label: '', topic: 'Algebră', forms: { 1: [qdFormula, qdSquareForm, qdProduct], 2: [qdToForm, qdFractionSquare, qdGivenRoot, qdNumbers, qdTriangle, qdSquareSide], 3: [qdFractions, qdEqualRoots, qdAlwaysReal, qdSumSquares] } },
  { id: 'viii-p-problems', joins: 'viii-problems', label: '', topic: 'Algebră', forms: { 1: [], 2: [quizPoints], 3: [] } },
]
