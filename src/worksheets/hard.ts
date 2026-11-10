// The hard level, as on the national exam (Evaluarea Națională, subjects II and III): several steps, fractions,
// expressions to bring to their simplest form, multi-part problems. Each returns the statement and the worked solution.
import type { Made } from './generators'
import { frac, gcd, int, nonZero, paren, pick, poly, reduce, rightTriangle, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]
/** a + b with the sign of b written out: "x - 3", "x + 3" */
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)

// ---------- grade VIII ----------

/** The integers x for which m1 ≤ (bx + c)/d < m2, written as a set. */
export function inequalityHard(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 2, 5)
    const d = int(rng, 2, 4)
    const c = nonZero(rng, -9, 9)
    const m1 = int(rng, -6, 2)
    const m2 = m1 + int(rng, 2, 5)
    const [lo, hi] = [(d * m1 - c) / b, (d * m2 - c) / b]
    const xs: number[] = []
    for (let x = Math.ceil(lo); x < hi; x++) xs.push(x)
    if (xs.length < 2 || xs.length > 8) continue
    const strictLow = rng() < 0.4
    const kept = strictLow ? xs.filter((x) => x > lo) : xs
    if (kept.length < 2) continue
    const r1 = strictLow ? '<' : '\\le'
    return {
      text: `Determinați elementele mulțimii $A = \\left\\{x \\in \\mathbb{Z} \\;\\middle|\\; ${m1} ${r1} \\frac{${plus(`${b}x`, c)}}{${d}} < ${m2}\\right\\}$.`,
      solution: lines(
        `Înmulțim inegalitățile cu ${d}, apoi scădem ${paren(c)} și împărțim la ${b}:`,
        show(`${d * m1} ${r1} ${plus(`${b}x`, c)} < ${d * m2} \\Rightarrow ${d * m1 - c} ${r1} ${b}x < ${d * m2 - c} \\Rightarrow ${frac(d * m1 - c, b)} ${r1} x < ${frac(d * m2 - c, b)}`),
        `Numerele întregi din acest interval sunt:`,
        show(`A = \\{${kept.join(', ')}\\}`),
      ),
      verify: () => kept.every((x) => (strictLow ? m1 < (b * x + c) / d : m1 <= (b * x + c) / d) && (b * x + c) / d < m2),
    }
  }
}

/** x/a + y/b = c, x/d − y/e = f, with whole solutions. */
export function systemHard(rng: Rng): Made {
  for (;;) {
    const [a, b, d, e] = [int(rng, 2, 5), int(rng, 2, 5), int(rng, 2, 5), int(rng, 2, 5)]
    // different denominators, otherwise each equation is only a sum or a difference in disguise
    if (a === b || d === e || new Set([a, b, d, e]).size < 3) continue
    const x0 = lcm(a, d) * nonZero(rng, -3, 3)
    const y0 = lcm(b, e) * nonZero(rng, -3, 3)
    const c = x0 / a + y0 / b
    const f = x0 / d - y0 / e
    // multiplied by ab and de: whole coefficients
    const [p1, q1, s1] = [b, a, a * b * c]
    const [p2, q2, s2] = [e, -d, d * e * f]
    if (p1 * q2 - p2 * q1 === 0) continue
    return {
      text: `Rezolvați sistemul de ecuații: $\\begin{cases} \\frac{x}{${a}} + \\frac{y}{${b}} = ${c} \\\\[4pt] \\frac{x}{${d}} - \\frac{y}{${e}} = ${f} \\end{cases}$`,
      solution: lines(
        `Înmulțim prima ecuație cu ${a * b} și a doua cu ${d * e}, ca să scăpăm de numitori:`,
        show(`\\begin{cases} ${poly([[p1, 'x'], [q1, 'y']])} = ${s1} \\\\ ${poly([[p2, 'x'], [q2, 'y']])} = ${s2} \\end{cases}`),
        'Prin metoda reducerii (sau a substituției) obținem:',
        show(`x = ${x0}, \\quad y = ${y0}, \\qquad S = \\{(${x0}, ${y0})\\}`),
      ),
      verify: () => p1 * x0 + q1 * y0 === s1 && p2 * x0 + q2 * y0 === s2,
    }
  }
}

/** Factoring in several steps: a square and a difference of squares, a common factor first, or two squares of binomials. */
export function factoringHard(rng: Rng, which?: 0 | 1 | 2): Made {
  const kind = which ?? int(rng, 0, 2)
  if (kind === 0) {
    // with a second unknown, so that it cannot be done as a plain trinomial: (x − a)² − (by)²
    const a = nonZero(rng, -6, 6)
    const b = int(rng, 2, 5)
    return {
      text: `Descompuneți în factori: $${poly([[1, 'x^2'], [-2 * a, 'x'], [a * a, ''], [-b * b, 'y^2']])}$.`,
      solution: lines(
        'Primii trei termeni formează pătratul unui binom; apoi folosim diferența de pătrate:',
        show(`(${plus('x', -a)})^2 - (${b}y)^2 = (${plus('x', -a)} - ${b}y)(${plus('x', -a)} + ${b}y)`),
      ),
      verify: () => [[1, 2], [-3, 0], [4, -1]].every(([x, y]) => (x - a) ** 2 - (b * y) ** 2 === (x - a - b * y) * (x - a + b * y)),
    }
  }
  if (kind === 1) {
    const k = int(rng, 2, 5)
    const a = int(rng, 2, 7)
    return {
      text: `Descompuneți în factori: $${poly([[k, 'x^3'], [-k * a * a, 'x']])}$.`,
      solution: lines('Dăm factor comun, apoi folosim diferența de pătrate:', show(`${k}x^3 - ${k * a * a}x = ${k}x(x^2 - ${a * a}) = ${k}x(x - ${a})(x + ${a})`)),
      verify: () => true,
    }
  }
  const [a, c] = [nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
  const b = int(rng, 2, 3)
  const f1: [number, number] = [1 - b, a - c]
  const f2: [number, number] = [1 + b, a + c]
  return {
    text: `Descompuneți în factori: $(${plus('x', a)})^2 - (${plus(`${b}x`, c)})^2$.`,
    solution: lines(
      'Diferența de pătrate, $A^2 - B^2 = (A - B)(A + B)$:',
      show(`\\left[(${plus('x', a)}) - (${plus(`${b}x`, c)})\\right]\\left[(${plus('x', a)}) + (${plus(`${b}x`, c)})\\right] = (${poly([[f1[0], 'x'], [f1[1], '']])})(${poly([[f2[0], 'x'], [f2[1], '']])})`),
    ),
    verify: () => [0, 1, 2, -3].every((x) => (x + a) ** 2 - (b * x + c) ** 2 === (f1[0] * x + f1[1]) * (f2[0] * x + f2[1])),
  }
}

/** (x + a)² = kx + m: expand, gather, factor. */
export function quadraticHard(rng: Rng): Made {
  const r1 = nonZero(rng, -7, 7)
  let r2 = nonZero(rng, -7, 7)
  if (r2 === r1) r2 = r1 === 7 ? 6 : r1 + 1
  const a = nonZero(rng, -5, 5)
  const s = r1 + r2
  const p = r1 * r2
  const k = 2 * a + s
  const m = a * a - p
  const rhs = poly([[k, 'x'], [m, '']])
  return {
    text: `Rezolvați în $\\mathbb{R}$ ecuația $(${plus('x', a)})^2 = ${rhs}$.`,
    solution: lines(
      'Desfacem pătratul și aducem totul în membrul stâng:',
      show(`${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])} = ${rhs} \\Rightarrow ${poly([[1, 'x^2'], [-s, 'x'], [p, '']])} = 0`),
      `Căutăm două numere cu suma ${s} și produsul ${p}: acestea sunt ${r1} și ${r2}.`,
      show(`(${plus('x', -r1)})(${plus('x', -r2)}) = 0 \\Rightarrow S = \\{${[r1, r2].sort((u, v) => u - v).join(', ')}\\}`),
    ),
    verify: () => [r1, r2].every((x) => (x + a) ** 2 === k * x + m),
  }
}

/** A regular square pyramid, in three parts, as subject III: apothem and lateral area, volume, the dihedral angle. */
export function pyramidHard(rng: Rng): Made {
  // the sizes stay as in a textbook: a base side of at most 30 cm
  const choices: [number, number, number][] = []
  for (const [p0, q0, r0] of [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]) {
    for (const m of [1, 2, 3]) {
      if (2 * p0 * m <= 30) choices.push([p0 * m, q0 * m, r0 * m])
      if (2 * q0 * m <= 30) choices.push([q0 * m, p0 * m, r0 * m])
    }
  }
  const [half, h, ap] = pick(rng, choices)
  const l = 2 * half
  const Al = 2 * l * ap
  return {
    text: lines(
      `Piramida patrulateră regulată $VABCD$ are latura bazei $AB = ${l}$ cm și înălțimea $VO = ${h}$ cm.`,
      `a) Calculați apotema piramidei și aria laterală.`,
      `b) Calculați volumul piramidei.`,
      `c) Calculați sinusul unghiului dintre o față laterală și planul bazei.`,
    ),
    solution: lines(
      `a) Fie $M$ mijlocul lui $BC$; $OM = \\frac{AB}{2} = ${half}$ cm. În triunghiul $VOM$, dreptunghic în $O$:`,
      show(`VM^2 = VO^2 + OM^2 = ${h * h} + ${half * half} = ${ap * ap} \\Rightarrow VM = ${ap}\\text{ cm}`),
      show(`\\mathcal{A}_\\ell = \\frac{P_b \\cdot a_p}{2} = \\frac{${4 * l} \\cdot ${ap}}{2} = ${Al}\\text{ cm}^2`),
      `b)`,
      show(`V = \\frac{\\mathcal{A}_b \\cdot h}{3} = \\frac{${l * l} \\cdot ${h}}{3} = ${frac(l * l * h, 3)}\\text{ cm}^3`),
      `c) Unghiul dintre fața $VBC$ și planul bazei este $\\angle VMO$, pentru că $VM \\perp BC$ și $OM \\perp BC$:`,
      show(`\\sin \\angle VMO = \\frac{VO}{VM} = ${frac(h, ap)}`),
    ),
    verify: () => h * h + half * half === ap * ap,
  }
}

/** Expressions to bring to their simplest form, as subject II asks. */
export function expressions(rng: Rng, level: 1 | 2 | 3): Made {
  if (level === 1) {
    const a = nonZero(rng, -6, 6)
    const b = int(rng, 1, 6)
    return {
      text: `Aduceți la forma cea mai simplă expresia $E(x) = (${plus('x', a)})^2 - (x - ${b})(x + ${b})$, unde $x$ este un număr real.`,
      solution: lines(
        'Folosim formulele $(a + b)^2 = a^2 + 2ab + b^2$ și $(a - b)(a + b) = a^2 - b^2$:',
        show(`E(x) = ${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])} - (x^2 - ${b * b}) = ${poly([[2 * a, 'x'], [a * a + b * b, '']])}`),
      ),
      verify: () => [0, 1, -2, 5].every((x) => (x + a) ** 2 - (x - b) * (x + b) === 2 * a * x + a * a + b * b),
    }
  }
  if (level === 2) {
    const a = int(rng, 1, 6)
    const b = int(rng, 1, 6)
    const v = 2 * a * a + 2 * b * b
    return {
      text: `Se consideră expresia $E(x) = (x + ${a})^2 + (x - ${a})^2 - 2(x - ${b})(x + ${b})$, unde $x$ este un număr real. Arătați că valoarea expresiei nu depinde de $x$.`,
      solution: lines(
        show(`E(x) = x^2 + ${2 * a}x + ${a * a} + x^2 - ${2 * a}x + ${a * a} - 2(x^2 - ${b * b})`),
        show(`E(x) = 2x^2 + ${2 * a * a} - 2x^2 + ${2 * b * b} = ${v}`),
        `deci $E(x) = ${v}$ pentru orice număr real $x$, adică nu depinde de $x$.`,
      ),
      verify: () => [0, 1, -3, 7].every((x) => (x + a) ** 2 + (x - a) ** 2 - 2 * (x - b) * (x + b) === v),
    }
  }
  const a = int(rng, 1, 7)
  if (rng() < 0.5) {
    return {
      text: `Se consideră expresia $E(x) = \\left(\\frac{1}{x - ${a}} + \\frac{1}{x + ${a}}\\right) : \\frac{2x}{x^2 - ${a * a}}$, unde $x$ este un număr real, $x \\neq -${a}$, $x \\neq 0$, $x \\neq ${a}$. Arătați că $E(x) = 1$.`,
      solution: lines(
        'Aducem la numitorul comun $(x - ' + a + ')(x + ' + a + ') = x^2 - ' + a * a + '$:',
        show(`\\frac{1}{x - ${a}} + \\frac{1}{x + ${a}} = \\frac{x + ${a} + x - ${a}}{x^2 - ${a * a}} = \\frac{2x}{x^2 - ${a * a}}`),
        show(`E(x) = \\frac{2x}{x^2 - ${a * a}} \\cdot \\frac{x^2 - ${a * a}}{2x} = 1`),
      ),
      verify: () => [1.5, 3.25, -2.5].every((x) => Math.abs((1 / (x - a) + 1 / (x + a)) / ((2 * x) / (x * x - a * a)) - 1) < 1e-9),
    }
  }
  const k = int(rng, 2, 6)
  return {
    text: `Se consideră expresia $E(x) = \\left(\\frac{${k}}{x - ${a}} - \\frac{${k}}{x + ${a}}\\right) \\cdot \\frac{x^2 - ${a * a}}{${2 * a}}$, unde $x$ este un număr real, $x \\neq \\pm ${a}$. Arătați că $E(x) = ${k}$.`,
    solution: lines(
      show(`\\frac{${k}}{x - ${a}} - \\frac{${k}}{x + ${a}} = \\frac{${k}(x + ${a}) - ${k}(x - ${a})}{x^2 - ${a * a}} = \\frac{${2 * k * a}}{x^2 - ${a * a}}`),
      show(`E(x) = \\frac{${2 * k * a}}{x^2 - ${a * a}} \\cdot \\frac{x^2 - ${a * a}}{${2 * a}} = ${k}`),
    ),
    verify: () => [1.5, 9.25, -12.5].every((x) => Math.abs((k / (x - a) - k / (x + a)) * ((x * x - a * a) / (2 * a)) - k) < 1e-9),
  }
}

// ---------- grade VII ----------

/** "Show that the number a = (…)·√b is natural": take the factors out, make the denominator rational, multiply. */
export function radicalsHard(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 3, 5, 6, 7])
    const [k1, k2] = [int(rng, 2, 6), int(rng, 2, 6)]
    const j = int(rng, 1, 4)
    const s2 = rng() < 0.5 ? -1 : 1
    const total = k1 + s2 * k2 + j
    if (total <= 0) continue
    const term = (k: number) => `\\sqrt{${k * k * b}}`
    return {
      text: `Arătați că numărul $a = \\left(${term(k1)} ${s2 < 0 ? '-' : '+'} ${term(k2)} + \\frac{${j * b}}{\\sqrt{${b}}}\\right) \\cdot \\sqrt{${b}}$ este natural.`,
      solution: lines(
        'Scoatem factorii de sub radical și raționalizăm numitorul:',
        show(`${term(k1)} = ${k1}\\sqrt{${b}}, \\quad ${term(k2)} = ${k2}\\sqrt{${b}}, \\quad \\frac{${j * b}}{\\sqrt{${b}}} = \\frac{${j * b}\\sqrt{${b}}}{${b}} = ${j === 1 ? '' : j}\\sqrt{${b}}`),
        show(`a = (${k1}\\sqrt{${b}} ${s2 < 0 ? '-' : '+'} ${k2}\\sqrt{${b}} + ${j === 1 ? '' : j}\\sqrt{${b}}) \\cdot \\sqrt{${b}} = ${total === 1 ? '' : total}\\sqrt{${b}} \\cdot \\sqrt{${b}} = ${total} \\cdot ${b} = ${total * b} \\in \\mathbb{N}`),
      ),
      verify: () => Math.abs((Math.sqrt(k1 * k1 * b) + s2 * Math.sqrt(k2 * k2 * b) + (j * b) / Math.sqrt(b)) * Math.sqrt(b) - total * b) < 1e-9,
    }
  }
}

/** (x + a)/b − (x − c)/d = e, with a whole solution. */
export function linearHard(rng: Rng): Made {
  for (;;) {
    const [b, d] = shuffle(rng, [int(rng, 2, 4), int(rng, 3, 6)])
    if (b === d) continue
    const a = nonZero(rng, -6, 6)
    const c = nonZero(rng, -6, 6)
    const x0 = int(rng, -15, 15)
    if ((x0 + a) % b !== 0 || (x0 - c) % d !== 0) continue
    const e = (x0 + a) / b - (x0 - c) / d
    const L = lcm(b, d)
    const [u, v] = [L / b, L / d]
    // after clearing the denominators: u(x + a) − v(x − c) = L·e
    const k = u - v
    if (k === 0) continue
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $\\frac{${plus('x', a)}}{${b}} - \\frac{${plus('x', -c)}}{${d}} = ${e}$.`,
      solution: lines(
        `Înmulțim ecuația cu ${L}, numitorul comun:`,
        show(`${u === 1 ? '' : u}(${plus('x', a)}) - ${v === 1 ? '' : v}(${plus('x', -c)}) = ${L * e}`),
        show(`${poly([[u, 'x'], [u * a, '']])} ${poly([[-v, 'x'], [v * c, '']]).startsWith('-') ? '' : '+ '}${poly([[-v, 'x'], [v * c, '']])} = ${L * e} \\Rightarrow ${poly([[k, 'x']])} = ${L * e - u * a - v * c} \\Rightarrow x = ${x0}`),
        show(`S = \\{${x0}\\}`),
      ),
      verify: () => (x0 + a) / b - (x0 - c) / d === e && k * x0 === L * e - u * a - v * c,
    }
  }
}

/** The metric relations in a right triangle: the height on the hypotenuse and the legs, from the projections. */
export function metricHard(rng: Rng): Made {
  const [p, q, r] = rightTriangle(rng, 30)
  const k = pick(rng, [1, 2, 3])
  // BD = p²k, DC = q²k, so AD = pqk, AB = prk, AC = qrk, BC = r²k
  const [BD, DC] = [p * p * k, q * q * k]
  const [AD, AB, AC, BC] = [p * q * k, p * r * k, q * r * k, r * r * k]
  return {
    text: lines(
      `În triunghiul $ABC$, dreptunghic în $A$, $AD \\perp BC$, $D \\in BC$, $BD = ${BD}$ cm și $DC = ${DC}$ cm.`,
      'a) Calculați lungimea înălțimii $AD$.',
      'b) Calculați lungimile catetelor $AB$ și $AC$.',
      'c) Calculați aria triunghiului $ABC$.',
    ),
    solution: lines(
      'a) Din teorema înălțimii:',
      show(`AD^2 = BD \\cdot DC = ${BD} \\cdot ${DC} = ${AD * AD} \\Rightarrow AD = ${AD}\\text{ cm}`),
      `b) $BC = BD + DC = ${BC}$ cm. Din teorema catetei:`,
      show(`AB^2 = BD \\cdot BC = ${BD} \\cdot ${BC} = ${AB * AB} \\Rightarrow AB = ${AB}\\text{ cm}`),
      show(`AC^2 = DC \\cdot BC = ${DC} \\cdot ${BC} = ${AC * AC} \\Rightarrow AC = ${AC}\\text{ cm}`),
      'c)',
      show(`\\mathcal{A} = \\frac{AB \\cdot AC}{2} = \\frac{${AB} \\cdot ${AC}}{2} = ${frac(AB * AC, 2)}\\text{ cm}^2`),
    ),
    verify: () => AD * AD === BD * DC && AB * AB === BD * BC && AC * AC === DC * BC && AB * AB + AC * AC === BC * BC,
  }
}

/** An isosceles trapezoid from its bases and its leg: the height from Pythagoras, then the area and the perimeter. */
export function trapezoidHard(rng: Rng): Made {
  const [p0, q0, r0] = pick(rng, TRIPLES.slice(0, 4))
  const k = pick(rng, [1, 2])
  const [proj, h] = shuffle(rng, [p0 * k, q0 * k])
  const l = r0 * k
  const b = int(rng, 2, 12)
  const B = b + 2 * proj
  return {
    text: `Trapezul isoscel $ABCD$ are bazele $AB = ${B}$ cm și $CD = ${b}$ cm, iar laturile neparalele de câte ${l} cm. Calculați înălțimea, aria și perimetrul trapezului.`,
    solution: lines(
      'Ducem înălțimea $DE \\perp AB$, $E \\in AB$. În trapezul isoscel:',
      show(`AE = \\frac{AB - CD}{2} = \\frac{${B} - ${b}}{2} = ${proj}\\text{ cm}`),
      'În triunghiul $ADE$, dreptunghic în $E$, din teorema lui Pitagora:',
      show(`DE^2 = AD^2 - AE^2 = ${l * l} - ${proj * proj} = ${h * h} \\Rightarrow DE = ${h}\\text{ cm}`),
      show(`\\mathcal{A} = \\frac{(AB + CD) \\cdot DE}{2} = \\frac{${B + b} \\cdot ${h}}{2} = ${frac((B + b) * h, 2)}\\text{ cm}^2, \\quad P = ${B} + ${b} + 2 \\cdot ${l} = ${B + b + 2 * l}\\text{ cm}`),
    ),
    verify: () => proj * proj + h * h === l * l,
  }
}

/** From the hypotenuse and the sine of an angle: both legs, then the perimeter and the area. */
export function trigHard(rng: Rng): Made {
  const [p, q, r] = rightTriangle(rng, 100)
  const k = 1
  const BC = r * k
  const [opp, adj] = [p * k, q * k]
  const [sn, sd] = reduce(p, r)
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $BC = ${BC}$ cm și $\\sin B = \\frac{${sn}}{${sd}}$. Calculați perimetrul și aria triunghiului $ABC$.`,
    solution: lines(
      'Pentru unghiul $B$, cateta opusă este $AC$:',
      show(`\\sin B = \\frac{AC}{BC} \\Rightarrow AC = BC \\cdot \\sin B = ${BC} \\cdot \\frac{${sn}}{${sd}} = ${opp}\\text{ cm}`),
      'Din teorema lui Pitagora:',
      show(`AB^2 = BC^2 - AC^2 = ${BC * BC} - ${opp * opp} = ${adj * adj} \\Rightarrow AB = ${adj}\\text{ cm}`),
      show(`P = ${BC} + ${opp} + ${adj} = ${BC + opp + adj}\\text{ cm}, \\quad \\mathcal{A} = \\frac{AB \\cdot AC}{2} = ${frac(opp * adj, 2)}\\text{ cm}^2`),
    ),
    verify: () => opp * opp + adj * adj === BC * BC && sn * BC === opp * sd,
  }
}

