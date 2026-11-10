// More exercises after the national exam simulations (Model E.N. 1–9) the user photographed on 10 November 2026:
// periodic decimals, sets defined by divisors, factoring with a cube, an expression with an absolute value and a root
// that is constant, word problems (is it possible…, people leaving and coming, cloth, tickets), angles in a cube.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, pick, poly, reduce, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)

/** [0,(a) − 0,b] : 1,(c) + e·f⁻¹, as in Model E.N. 4, III.14 b. */
export function periodicDecimals(rng: Rng): Made {
  const a = int(rng, 1, 8)
  const b = int(rng, 1, 9)
  const c = int(rng, 1, 8)
  const e = int(rng, 1, 9)
  const f = pick(rng, [2, 4, 5, 8, 10])
  // (a/9 − b/10) · 9/(9 + c) = (10a − 9b) / (10(9 + c))
  const [p, q] = reduce(10 * a - 9 * b, 10 * (9 + c))
  const [rn, rd] = reduce(p * f + e * q, q * f)
  return {
    text: `Calculați numărul $x = \\left[0{,}(${a}) - 0{,}${b}\\right] : 1{,}(${c}) + ${e} \\cdot ${f}^{-1}$.`,
    solution: lines(
      'Transformăm fracțiile zecimale în fracții ordinare:',
      show(`0{,}(${a}) = \\frac{${a}}{9}, \\quad 0{,}${b} = \\frac{${b}}{10}, \\quad 1{,}(${c}) = \\frac{1${c} - 1}{9} = \\frac{${9 + c}}{9}, \\quad ${f}^{-1} = \\frac{1}{${f}}`),
      show(`\\left[\\frac{${a}}{9} - \\frac{${b}}{10}\\right] : \\frac{${9 + c}}{9} = \\frac{${10 * a - 9 * b}}{90} \\cdot \\frac{9}{${9 + c}} = ${frac(p, q)}`),
      show(`x = ${frac(p, q)} + \\frac{${e}}{${f}} = ${frac(rn, rd)}`),
    ),
    verify: () => Math.abs(((a / 9 - b / 10) / ((9 + c) / 9) + e / f) - rn / rd) < 1e-9,
  }
}

/** A = {x | k/(ax + b) ∈ ℤ}: ax + b is a divisor of k. */
export function divisorSet(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [1, 2])
    const b = nonZero(rng, -5, 5)
    const k = pick(rng, [3, 4, 6, 8, 10, 12, 15, 18])
    const natural = rng() < 0.5
    const divisors: number[] = []
    for (let d = 1; d <= k; d++) if (k % d === 0) divisors.push(d, -d)
    const xs = divisors.map((d) => (d - b) / a).filter((x) => Number.isInteger(x) && (!natural || x >= 0))
    const sorted = [...new Set(xs)].sort((u, v) => u - v)
    if (sorted.length < 2) continue
    const set = natural ? '\\mathbb{N}' : '\\mathbb{Z}'
    const den = plus(a === 1 ? 'x' : `${a}x`, b)
    return {
      text: `Determinați elementele mulțimii $A = \\left\\{x \\in ${set} \\;\\middle|\\; \\frac{${k}}{${den}} \\in \\mathbb{Z}\\right\\}$.`,
      solution: lines(
        `Fracția este un număr întreg doar dacă $${den}$ este un divizor întreg al lui ${k}:`,
        show(`${den} \\in \\{${[...divisors].sort((u, v) => u - v).join(', ')}\\}`),
        `Păstrăm valorile pentru care $x$ este ${natural ? 'natural' : 'întreg'}:`,
        show(`A = \\{${sorted.join(', ')}\\}`),
      ),
      verify: () => sorted.every((x) => Number.isInteger(k / (a * x + b)) && (!natural || x >= 0)),
    }
  }
}

/** kx³ − 2kax² + ka²x = kx(x − a)², as in Model E.N. 4, I.4. */
export function factoringCubeSquare(rng: Rng): Made {
  const k = int(rng, 1, 4)
  const a = nonZero(rng, -6, 6)
  const kx = `${k === 1 ? '' : k}x`
  return {
    text: `Descompuneți în factori ireductibili expresia $${poly([[k, 'x^3'], [-2 * k * a, 'x^2'], [k * a * a, 'x']])}$.`,
    solution: lines(
      'Dăm factor comun, apoi recunoaștem pătratul unui binom:',
      show(`${poly([[k, 'x^3'], [-2 * k * a, 'x^2'], [k * a * a, 'x']])} = ${kx}(${poly([[1, 'x^2'], [-2 * a, 'x'], [a * a, '']])}) = ${kx}(${plus('x', -a)})^2`),
    ),
    verify: () => [1, -2, 3].every((x) => k * x ** 3 - 2 * k * a * x * x + k * a * a * x === k * x * (x - a) ** 2),
  }
}

/** |x + a| + √((x − b)²) is a + b on [−a, b], as in Model E.N. 8, III.14 b. */
export function absoluteConstant(rng: Rng): Made {
  const a = int(rng, 1, 9)
  const b = int(rng, 1, 9)
  return {
    text: `Arătați că, pentru orice $x \\in [-${a}, ${b}]$, expresia $E(x) = |x + ${a}| + \\sqrt{(x - ${b})^2}$ are aceeași valoare.`,
    solution: lines(
      `Pentru $x \\in [-${a}, ${b}]$ avem $x + ${a} \\ge 0$ și $x - ${b} \\le 0$, iar $\\sqrt{(x - ${b})^2} = |x - ${b}|$:`,
      show(`E(x) = (x + ${a}) + (${b} - x) = ${a + b}`),
      `deci $E(x) = ${a + b}$ pentru orice $x$ din interval.`,
    ),
    verify: () => [-a, 0, b].every((x) => Math.abs(x + a) + Math.sqrt((x - b) ** 2) === a + b),
  }
}

/** The girls are p% of the boys: is a given number of boys possible? and from the total, the girls. */
export function percentPossible(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, [20, 25, 40, 60, 75, 80])
    const m = 100 / gcd(p, 100)
    const b = m * int(rng, 1, Math.floor(30 / m) || 1)
    const g = (p * b) / 100
    const T = b + g
    const ask = int(rng, 10, 30)
    const possible = ask % m === 0
    if (T < 10) continue
    return {
      text: lines(
        `Într-o clasă, numărul fetelor reprezintă ${p}% din numărul băieților.`,
        `a) Este posibil ca numărul băieților să fie ${ask}?`,
        `b) Dacă în clasă sunt ${de(T)} elevi, aflați numărul fetelor.`,
      ),
      solution: lines(
        `a) $f = \\frac{${p}}{100} \\cdot b = ${frac(p, 100)}b$, deci $b$ trebuie să fie multiplu de ${m}, ca $f$ să fie număr natural.`,
        possible
          ? `${ask} este multiplu de ${m}, deci da: ar fi ${de((p * ask) / 100)} fete.`
          : `${ask} nu este multiplu de ${m}, deci nu este posibil: numărul fetelor ar fi $${frac(p * ask, 100)}$, care nu e natural.`,
        show(`\\text{b) } b + ${frac(p, 100)}b = ${T} \\Rightarrow ${frac(100 + p, 100)}b = ${T} \\Rightarrow b = ${b}, \\quad f = ${g}`),
      ),
      verify: () => b + g === T && (possible ? Number.isInteger((p * ask) / 100) : !Number.isInteger((p * ask) / 100)),
    }
  }
}

/** If u boys left and v girls came, there would be d fewer boys than girls. */
export function classSwap(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 20, 32)
    const u = int(rng, 1, 3)
    const v = int(rng, 1, 3)
    const d = int(rng, 1, 6)
    if ((n + u + v - d) % 2 !== 0) continue
    const b = (n + u + v - d) / 2
    const g = n - b
    if (g <= v || b <= u) continue
    const who = (k: number, one: string, many: string) => (k === 1 ? `un ${one}` : `${k} ${many}`)
    return {
      text: `Într-o clasă sunt ${de(n)} elevi. Dacă ar pleca ${who(u, 'băiat', 'băieți')} și ar mai veni ${who(v, 'fată', 'fete')}, numărul băieților ar fi cu ${d} mai mic decât numărul fetelor. Câți băieți și câte fete sunt în clasă?`,
      solution: lines(
        show(`\\begin{cases} b + f = ${n} \\\\ b - ${u} = f + ${v} - ${d} \\end{cases} \\Rightarrow \\begin{cases} b + f = ${n} \\\\ b - f = ${u + v - d} \\end{cases}`),
        show(`2b = ${n + u + v - d} \\Rightarrow b = ${b}, \\quad f = ${g}`),
      ),
      verify: () => b + g === n && b - u === g + v - d,
    }
  }
}

/** Cloth for dresses and skirts: a system with whole or half meters. */
export function clothSystem(rng: Rng): Made {
  for (;;) {
    const r = int(rng, 2, 4)
    const f = int(rng, 1, 2)
    const [p1, q1, p2, q2] = [int(rng, 1, 5), int(rng, 1, 5), int(rng, 1, 5), int(rng, 1, 5)]
    if (p1 * q2 - p2 * q1 === 0) continue
    const [M, N] = [p1 * r + q1 * f, p2 * r + q2 * f]
    const n = (k: number, one: string, many: string) => (k === 1 ? `o ${one}` : `${k} ${many}`)
    return {
      text: `Din ${M} m de stofă se pot confecționa ${n(p1, 'rochie', 'rochii')} și ${n(q1, 'fustă', 'fuste')}, iar din ${N} m de stofă, ${n(p2, 'rochie', 'rochii')} și ${n(q2, 'fustă', 'fuste')}, de același tip. Câți metri de stofă sunt necesari pentru o rochie și câți pentru o fustă?`,
      solution: lines(
        'Fie $r$ metrii pentru o rochie și $f$ metrii pentru o fustă:',
        show(`\\begin{cases} ${poly([[p1, 'r'], [q1, 'f']])} = ${M} \\\\ ${poly([[p2, 'r'], [q2, 'f']])} = ${N} \\end{cases}`),
        'Prin metoda reducerii:',
        show(`r = ${r}\\text{ m}, \\quad f = ${f}\\text{ m}`),
      ),
      verify: () => p1 * r + q1 * f === M && p2 * r + q2 * f === N,
    }
  }
}

/** Tickets for adults and children: how many adults, from the takings. */
export function tickets(rng: Rng): Made {
  const a = int(rng, 40, 300)
  const c = int(rng, 20, 200)
  const p = 5 * int(rng, 2, 8)
  const d = 5 * int(rng, 1, 4)
  const n = a + c
  const S = a * (p + d) + c * p
  return {
    text: `La un spectacol s-au vândut ${de(n)} bilete. Un bilet pentru copii costă ${de(p)} lei, iar unul pentru adulți este cu ${de(d)} lei mai scump. Știind că s-au încasat în total ${de(S)} lei, aflați câte bilete pentru adulți s-au vândut.`,
    solution: lines(
      `Dacă toate biletele ar fi fost pentru copii, s-ar fi încasat $${n} \\cdot ${p} = ${n * p}$ lei. Diferența vine din biletele pentru adulți, fiecare cu ${d} lei mai scump:`,
      show(`${S} - ${n * p} = ${S - n * p} \\Rightarrow ${S - n * p} : ${d} = ${a}`),
      `S-au vândut ${de(a)} bilete pentru adulți.`,
    ),
    verify: () => (S - n * p) / d === a,
  }
}

const CUBE_ANGLES: { a: string; b: string; deg: number; why: string }[] = [
  { a: 'BC', b: "DC'", deg: 90, why: "$BC \\perp (DCC')$, deci $BC$ este perpendiculară pe orice dreaptă din acest plan, deci și pe $DC'$." },
  { a: 'AB', b: "DC'", deg: 45, why: "$AB \\parallel DC$, deci unghiul este $\\angle(DC, DC') = \\angle CDC' = 45^\\circ$, pentru că $DCC'D'$ este pătrat." },
  { a: 'AD', b: "BC'", deg: 45, why: "$AD \\parallel BC$, deci unghiul este $\\angle CBC' = 45^\\circ$, diagonala pătratului $BCC'B'$ cu latura." },
  { a: "A'D", b: 'AC', deg: 60, why: "$A'D \\parallel B'C$, iar triunghiul $AB'C$ este echilateral (laturile lui sunt diagonale ale fețelor), deci unghiul este $60^\\circ$." },
  { a: "AB'", b: "BC'", deg: 60, why: "$AB' \\parallel DC'$, iar triunghiul $BC'D$ este echilateral, deci unghiul este $60^\\circ$." },
  { a: 'AC', b: "B'D'", deg: 90, why: "$B'D' \\parallel BD$, iar diagonalele pătratului $ABCD$ sunt perpendiculare: $AC \\perp BD$." },
  { a: 'AB', b: "A'C'", deg: 45, why: "$A'C' \\parallel AC$, deci unghiul este $\\angle BAC = 45^\\circ$." },
  { a: "AA'", b: 'BD', deg: 90, why: "$AA' \\perp (ABC)$, deci $AA'$ este perpendiculară pe $BD$." },
]

/** The angle between two lines of a cube, as in Model E.N. 4, I.12. */
export function cubeAngles(rng: Rng): Made {
  const t = pick(rng, CUBE_ANGLES)
  const l = int(rng, 2, 12)
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${l} cm. Determinați măsura unghiului dreptelor $${t.a}$ și $${t.b}$.`,
    solution: lines(t.why, show(`\\angle(${t.a}, ${t.b}) = ${t.deg}^\\circ`)),
    verify: () => [45, 60, 90].includes(t.deg),
  }
}
