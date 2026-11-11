// Grade VIII exercises after the recap tests (Testele 1–10) of a workbook the user photographed on 10 November 2026.
// Only what the app did not have yet: data (means from tables and diagrams, percentages), solids from one given
// measure, radicals with conjugates, the linear function (points with a property, a parameter, sums of values,
// equations with f, distance to a line), powers that make a square, problems (contest points, means, candies),
// equations and systems from squares. Each pattern keeps an idea of the tests, with other numbers and words, and a
// worked solution in Romanian. Problems that need the test's figure are left out.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, pick, poly, rightTriangle, rootParts, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
const paren = (n: number) => (n < 0 ? `(${n})` : String(n))
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n))
/** A number with at most two decimals, as in a Romanian textbook: in a formula with {,}, in text with a comma. */
const dec = (x: number, math = true) => {
  const s = String(Math.round(x * 100) / 100)
  return math ? s.replace('.', '{,}') : s.replace('.', ',')
}
/** Whether x has at most two decimals. */
const twoDecimals = (x: number) => close(Math.round(x * 100) / 100, x)
const deWord = (n: number) => (de(n) === String(n) ? '' : 'de ')

// ================= data: means, percentages =================

/** The mean of the marks from a frequency table. (Testele 1, 7, I.6) */
export function meanFromTable(rng: Rng): Made {
  for (;;) {
    const marks = [10, 9, 8, 7, 6, 5, 4]
    const counts = marks.map(() => int(rng, 0, 8))
    const n = counts.reduce((s, c) => s + c, 0)
    const sum = marks.reduce((s, m, i) => s + m * counts[i], 0)
    if (counts.filter((c) => c > 0).length < 4 || n < 10 || !twoDecimals(sum / n)) continue
    const used = marks.map((m, i) => [m, counts[i]] as const).filter(([, c]) => c > 0)
    return {
      text: `La un test, elevii unei clase au obținut notele următoare: ${used.map(([m, c]) => `nota ${m} — ${de(c)} ${c === 1 ? 'elev' : 'elevi'}`).join('; ')}. Calculați media notelor clasei la acest test.`,
      solution: lines(
        `În clasă sunt $${used.map(([, c]) => c).join(' + ')} = ${n}$ ${deWord(n)}elevi. Suma tuturor notelor este`,
        show(`${used.map(([m, c]) => `${m} \\cdot ${c}`).join(' + ')} = ${sum}`),
        show(`m = \\frac{${sum}}{${n}} = ${dec(sum / n)}`),
      ),
      verify: () => close(sum / n, used.reduce((s, [m, c]) => s + m * c, 0) / used.reduce((s, [, c]) => s + c, 0)),
    }
  }
}

const RANGES = ['5–5,99', '6–6,99', '7–7,99', '8–8,99', '9–9,99', '10']

/** How many graduates have an average of at least 7, 8 or 9, from the counts on each range. (Testul 4, I.6) */
export function countAtLeast(rng: Rng): Made {
  const counts = RANGES.map(() => int(rng, 3, 40))
  const from = int(rng, 2, 4)
  const take = counts.slice(from)
  const total = take.reduce((s, c) => s + c, 0)
  const all = counts.reduce((s, c) => s + c, 0)
  return {
    text: `La sfârșitul clasei a VIII-a, mediile generale ale absolvenților unei școli au fost: ${RANGES.map((r, i) => `între ${r} — ${de(counts[i])} ${counts[i] === 1 ? 'absolvent' : 'absolvenți'}`).join('; ').replace('între 10', 'media 10')}. Câți absolvenți au media generală cel puțin ${from + 5}? Ce procent din absolvenți reprezintă ei, rotunjit la un număr întreg?`,
    solution: lines(
      `Adunăm absolvenții din grupele cu media de la ${from + 5} în sus:`,
      show(`${take.join(' + ')} = ${total}`),
      `În total sunt $${counts.join(' + ')} = ${all}$ ${deWord(all)}absolvenți, deci procentul este $\\frac{${total}}{${all}} \\cdot 100\\% \\approx ${Math.round((total / all) * 100)}\\%$.`,
    ),
    verify: () => total === counts.slice(from).reduce((s, c) => s + c, 0),
  }
}

const SPORTS = ['fotbal', 'baschet', 'handbal', 'volei', 'tenis', 'înot']

/** The pupils who play the sport not given on a pie chart: 100% minus the others, then a part of the school. (Testul 6, I.6) */
export function percentFromPie(rng: Rng): Made {
  for (;;) {
    const names = [...SPORTS].sort(() => rng() - 0.5).slice(0, 4)
    const ps = [5 * int(rng, 2, 9), 5 * int(rng, 2, 7), 5 * int(rng, 1, 5)]
    const rest = 100 - ps.reduce((s, p) => s + p, 0)
    const N = 20 * int(rng, 10, 40)
    if (rest <= 0) continue
    const count = (N * rest) / 100
    return {
      text: `Într-o diagramă circulară sunt prezentate sporturile practicate de elevii unei școli: ${names.slice(0, 3).map((s, i) => `${s} ${ps[i]}%`).join(', ')}, iar restul elevilor practică ${names[3]}. Știind că în școală sunt ${de(N)} elevi și că fiecare practică un singur sport, câți elevi practică ${names[3]}?`,
      solution: lines(
        `Procentul elevilor care practică ${names[3]} este $100\\% - (${ps.join('\\% + ')}\\%) = ${rest}\\%$.`,
        show(`\\frac{${rest}}{100} \\cdot ${N} = ${count}\\text{ elevi}`),
      ),
      verify: () => Number.isInteger(count) && count > 0,
    }
  }
}

const DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']

/** The mean of the non-negative (or negative) temperatures of a week. (Testul 3, I.6) */
export function meanOfSubset(rng: Rng): Made {
  for (;;) {
    const t = DAYS.map(() => int(rng, -6, 9))
    const negative = rng() < 0.4
    const pick2 = t.filter((v) => (negative ? v < 0 : v >= 0))
    if (pick2.length < 2 || pick2.length > 6) continue
    const sum = pick2.reduce((s, v) => s + v, 0)
    if (!twoDecimals(sum / pick2.length)) continue
    return {
      text: `La o stație meteorologică s-au înregistrat, într-o săptămână, temperaturile: ${DAYS.map((d, i) => `${d} $${t[i]}^\\circ$C`).join(', ')}. Calculați media temperaturilor ${negative ? 'negative' : 'nenegative'} din acea săptămână.`,
      solution: lines(
        `Temperaturile ${negative ? 'negative (mai mici decât 0)' : 'nenegative (cel puțin 0)'} sunt $${pick2.join(', ')}$, adică ${pick2.length} valori.`,
        show(`m = \\frac{${pick2.map(paren).join(' + ')}}{${pick2.length}} = \\frac{${sum}}{${pick2.length}} = ${dec(sum / pick2.length)}^\\circ\\text{C}`),
      ),
      verify: () => close(sum / pick2.length, pick2.reduce((s, v) => s + v, 0) / pick2.length),
    }
  }
}

/** The promotion rate of a grade: promoted over enrolled, as a percentage. (Testul 9, I.6) */
export function promotionPercent(rng: Rng): Made {
  for (;;) {
    const start = ['A', 'B', 'C', 'D'].map(() => int(rng, 24, 32))
    const promoted = start.map((s) => s - int(rng, 0, 4))
    const [S, P] = [start.reduce((a, b) => a + b, 0), promoted.reduce((a, b) => a + b, 0)]
    if (!Number.isInteger((P * 100) / S) || P === S) continue
    return {
      text: `La începutul anului școlar, clasele a VIII-a A, B, C și D ale unei școli aveau ${start.slice(0, 3).join(', ')}, respectiv ${de(start[3])} elevi. La sfârșitul anului au promovat ${promoted.slice(0, 3).join(', ')}, respectiv ${de(promoted[3])} elevi. Calculați procentul de promovabilitate al elevilor de clasa a VIII-a din școală.`,
      solution: lines(
        `Elevii de la începutul anului: $${start.join(' + ')} = ${S}$. Elevii promovați: $${promoted.join(' + ')} = ${P}$.`,
        show(`\\frac{${P}}{${S}} \\cdot 100\\% = ${(P * 100) / S}\\%`),
      ),
      verify: () => (P * 100) / S === (promoted.reduce((a, b) => a + b, 0) * 100) / start.reduce((a, b) => a + b, 0),
    }
  }
}

/** A new pupil joins a class with a known mean; the new mean is given: find the new pupil's mark. */
export function meanAfterNew(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 18, 30)
    const total = int(rng, 6 * n, 9 * n)
    const g = int(rng, 4, 10)
    const m1 = total / n
    const m2 = (total + g) / (n + 1)
    if (!twoDecimals(m1) || !twoDecimals(m2) || close(m1, m2)) continue
    return {
      text: `Media notelor celor ${de(n)} elevi ai unei clase la un test este ${dec(m1, false)}. Un elev nou dă și el testul, iar media celor ${de(n + 1)} elevi devine ${dec(m2, false)}. Ce notă a luat elevul nou?`,
      solution: lines(
        `Suma notelor celor ${de(n)} elevi este $${n} \\cdot ${dec(m1)} = ${total}$, iar a celor ${de(n + 1)} elevi este $${n + 1} \\cdot ${dec(m2)} = ${total + g}$.`,
        `Nota elevului nou este diferența: $${total + g} - ${total} = ${g}$.`,
      ),
      verify: () => close(n * m1 + g, (n + 1) * m2),
    }
  }
}

// ================= solids from one measure =================

/** A cube from the sum of its edges: 12 edges. (Testul 3, I.4) */
export function cubeFromEdgesSum(rng: Rng): Made {
  const l = int(rng, 2, 30)
  return {
    text: `Suma lungimilor tuturor muchiilor unui cub este de ${de(12 * l)} cm. Calculați aria totală și volumul cubului.`,
    solution: lines(
      `Cubul are 12 muchii egale, deci $\\ell = ${12 * l} : 12 = ${l}$ cm.`,
      show(`\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${l * l} = ${6 * l * l}\\text{ cm}^2, \\qquad V = \\ell^3 = ${l ** 3}\\text{ cm}^3`),
    ),
    verify: () => (12 * l) / 12 === l,
  }
}

/** A regular tetrahedron from its area: four equilateral faces, A = ℓ²√3. (Testul 2, I.5) */
export function tetrahedronFromArea(rng: Rng): Made {
  const l = int(rng, 2, 30)
  return {
    text: `Un tetraedru regulat are aria totală egală cu $${l * l}\\sqrt{3}$ cm². Calculați lungimea muchiei tetraedrului și aria unei fețe.`,
    solution: lines(
      'Tetraedrul regulat are patru fețe, triunghiuri echilaterale congruente:',
      show(`\\mathcal{A}_t = 4 \\cdot \\frac{\\ell^2\\sqrt{3}}{4} = \\ell^2\\sqrt{3} = ${l * l}\\sqrt{3} \\Rightarrow \\ell^2 = ${l * l} \\Rightarrow \\ell = ${l}\\text{ cm}`),
      `Aria unei fețe este $\\frac{${l * l}\\sqrt{3}}{4}${(l * l) % 4 === 0 ? ` = ${surd(l * l, 4, 3)}` : ''}$ cm².`,
    ),
    verify: () => close(l * l * Math.sqrt(3), 4 * ((l * l * Math.sqrt(3)) / 4)),
  }
}

const BOXES: [number, number, number][] = (() => {
  const out: [number, number, number][] = []
  for (let a = 1; a <= 20; a++) for (let b = a; b <= 24; b++) for (let c = b; c <= 30; c++) if (isSquare(a * a + b * b + c * c) && !(a === b && b === c)) out.push([a, b, c])
  return out
})()

/** A cuboid with a whole diagonal: d² = a² + b² + c². (Testul 4, I.5; Testul 8, I.4) */
export function cuboidIntegerDiagonal(rng: Rng): Made {
  const [a, b, c] = [...pick(rng, BOXES)].sort(() => rng() - 0.5)
  const d = Math.sqrt(a * a + b * b + c * c)
  return {
    text: `Un paralelipiped dreptunghic are dimensiunile de ${a} cm, ${b} cm și ${c} cm. Calculați lungimea diagonalei paralelipipedului.`,
    solution: show(`d = \\sqrt{a^2 + b^2 + c^2} = \\sqrt{${a * a} + ${b * b} + ${c * c}} = \\sqrt{${d * d}} = ${d}\\text{ cm}`),
    verify: () => Number.isInteger(d),
  }
}

/** A regular quadrilateral pyramid with all edges equal: the lateral faces are equilateral. (Testul 9, I.4) */
export function pyramidEqualEdgesLateral(rng: Rng): Made {
  const l = int(rng, 2, 30)
  return {
    text: `O piramidă patrulateră regulată are muchiile laterale și latura bazei egale cu ${l} cm. Calculați aria laterală și aria totală a piramidei.`,
    solution: lines(
      'Fețele laterale sunt patru triunghiuri echilaterale cu latura egală cu latura bazei:',
      show(`\\mathcal{A}_l = 4 \\cdot \\frac{${l * l}\\sqrt{3}}{4} = ${l * l}\\sqrt{3}\\text{ cm}^2, \\qquad \\mathcal{A}_t = \\mathcal{A}_l + \\ell^2 = ${l * l}\\sqrt{3} + ${l * l} = ${l * l}(\\sqrt{3} + 1)\\text{ cm}^2`),
    ),
    verify: () => close(4 * ((l * l * Math.sqrt(3)) / 4), l * l * Math.sqrt(3)),
  }
}

/** A regular triangular prism from AB and the diagonal A'B of a lateral face. (Testul 3, III.2 a) */
export function prismFromDiagonal(rng: Rng): Made {
  const [l, h, d] = rightTriangle(rng, 60)
  return {
    text: `Prisma triunghiulară regulată $ABCA'B'C'$ are $AB = ${l}$ cm și $A'B = ${d}$ cm. Calculați înălțimea și volumul prismei.`,
    solution: lines(
      "Fața $ABB'A'$ este un dreptunghi, deci triunghiul $A'AB$ este dreptunghic în $A$:",
      show(`AA'^2 = A'B^2 - AB^2 = ${d * d} - ${l * l} = ${h * h} \\Rightarrow AA' = ${h}\\text{ cm}`),
      show(`V = \\mathcal{A}_b \\cdot h = \\frac{${l * l}\\sqrt{3}}{4} \\cdot ${h} = ${surd(l * l * h, 4, 3)}\\text{ cm}^3`),
    ),
    verify: () => l * l + h * h === d * d,
  }
}

const CONE_RATIOS: [number, number, number][] = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [6, 8, 10], [8, 6, 10]]

/** A cone whose radius and height are proportional to two numbers, from its volume. (Testul 8, III.2) */
export function coneRatioVolume(rng: Rng): Made {
  const [p, q, s] = pick(rng, CONE_RATIOS)
  const g = gcd(p, q)
  const [pp, qq, ss] = [p / g, q / g, s / g]
  const k = int(rng, 1, 6)
  const [R, h, G] = [pp * k, qq * k, ss * k]
  const V = (R * R * h) / 3
  return {
    text: `Un con circular drept are raza și înălțimea direct proporționale cu numerele ${pp} și ${qq}, iar volumul egal cu $${frac(R * R * h, 3) === '1' ? '' : frac(R * R * h, 3)}\\pi$ cm³. Calculați raza, generatoarea și aria laterală a conului.`,
    solution: lines(
      `Din proporționalitate, $R = ${pp}k$ și $h = ${qq}k$, cu $k > 0$. Atunci`,
      show(`V = \\frac{\\pi R^2 h}{3} = \\frac{\\pi \\cdot ${pp * pp}k^2 \\cdot ${qq}k}{3} = ${frac(pp * pp * qq, 3)}\\pi k^3 = ${frac(R * R * h, 3)}\\pi \\Rightarrow k^3 = ${k ** 3} \\Rightarrow k = ${k}`),
      `Deci $R = ${R}$ cm, $h = ${h}$ cm și $G = \\sqrt{R^2 + h^2} = \\sqrt{${R * R} + ${h * h}} = ${G}$ cm.`,
      show(`\\mathcal{A}_l = \\pi R G = \\pi \\cdot ${R} \\cdot ${G} = ${R * G}\\pi\\text{ cm}^2`),
    ),
    verify: () => close((Math.PI * R * R * h) / 3, V * Math.PI) && R * R + h * h === G * G,
  }
}

/** A regular triangular pyramid with a right angle at the vertex: VA, VB, VC pairwise perpendicular. (Testul 7, III.2) */
export function trirectangularPyramid(rng: Rng): Made {
  const m = int(rng, 2, 20)
  return {
    text: `Piramida triunghiulară regulată $VABC$ are muchia laterală $VA = ${m}$ cm și $m(\\angle AVB) = 90^\\circ$. Calculați latura bazei, volumul piramidei și înălțimea ei.`,
    solution: lines(
      `Fețele laterale sunt triunghiuri congruente, deci toate unghiurile de la vârf au $90^\\circ$. Triunghiul $AVB$ este dreptunghic isoscel: $AB = VA\\sqrt{2} = ${surd(m, 1, 2)}$ cm.`,
      'Cum $VA \\perp VB$ și $VA \\perp VC$, rezultă $VA \\perp (VBC)$. Luăm drept bază triunghiul $VBC$ și înălțime $VA$:',
      show(`V = \\frac{1}{3} \\cdot \\frac{VB \\cdot VC}{2} \\cdot VA = \\frac{${m}^3}{6} = ${frac(m ** 3, 6)}\\text{ cm}^3`),
      `Baza $ABC$ este echilaterală, cu aria $\\frac{AB^2\\sqrt{3}}{4} = \\frac{${2 * m * m}\\sqrt{3}}{4} = ${surd(m * m, 2, 3)}$ cm². Din volum, înălțimea piramidei este`,
      show(`h = \\frac{3V}{\\mathcal{A}_b} = \\frac{${frac(m ** 3, 2)}}{${surd(m * m, 2, 3)}} = \\frac{${m}}{\\sqrt{3}} = ${surd(m, 3, 3)}\\text{ cm}`),
    ),
    verify: () => close(((m ** 3) / 2) / ((m * m * Math.sqrt(3)) / 2), m / Math.sqrt(3)),
  }
}

// ================= radicals =================

/** x/(p + √q) = (p − √q)/k: x = (p² − q)/k. (Testul 4, I.3; Testul 8, I.3) */
export function conjugateProportion(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 12)
    const q = int(rng, 2, p * p - 1)
    if (isSquare(q)) continue
    const D = p * p - q
    const ks = Array.from({ length: D }, (_, i) => i + 1).filter((k) => k > 1 && D % k === 0)
    if (!ks.length) continue
    const k = pick(rng, ks)
    const minus = rng() < 0.5
    const [num, den] = minus ? [`${p} + \\sqrt{${q}}`, `${p} - \\sqrt{${q}}`] : [`${p} - \\sqrt{${q}}`, `${p} + \\sqrt{${q}}`]
    return {
      text: `Determinați numărul real $x$ pentru care $\\frac{x}{${den}} = \\frac{${num}}{${k}}$.`,
      solution: lines(
        'Din proporție (produsul mezilor este egal cu produsul extremilor):',
        show(`${k}x = (${p} - \\sqrt{${q}})(${p} + \\sqrt{${q}}) = ${p * p} - ${q} = ${D} \\Rightarrow x = ${frac(D, k)}`),
      ),
      verify: () => close((D / k) / (minus ? p - Math.sqrt(q) : p + Math.sqrt(q)), (minus ? p + Math.sqrt(q) : p - Math.sqrt(q)) / k),
    }
  }
}

const UNITS2: [number, number, number][] = (() => {
  const out: [number, number, number][] = []
  for (let q = 2; q <= 30; q++) {
    if (rootParts(q)[0] !== 1) continue
    for (let r = 1; r <= 12; r++) {
      const p = Math.sqrt(r * r * q + 1)
      if (Number.isInteger(p) && p <= 30) out.push([p, r, q])
    }
  }
  return out
})()

/** a = k/(p − r√q) − 2kr√q and b = k/(p + r√q) + 2kr√q are conjugates: their geometric mean is k. (Testul 4, II.2) */
export function geometricMeanConjugates(rng: Rng): Made {
  const [p, r, q] = pick(rng, UNITS2)
  const k = int(rng, 1, 9)
  const rq = `${r === 1 ? '' : r}\\sqrt{${q}}`
  const krq = `${k * r === 1 ? '' : k * r}\\sqrt{${q}}`
  const twoKrq = `${2 * k * r}\\sqrt{${q}}`
  return {
    text: `Se consideră numerele $a = \\frac{${k}}{${p} - ${rq}} - ${twoKrq}$ și $b = \\frac{${k}}{${p} + ${rq}} + ${twoKrq}$. Calculați media geometrică a numerelor $a$ și $b$.`,
    solution: lines(
      `Cum $(${p} - ${rq})(${p} + ${rq}) = ${p * p} - ${r * r * q} = 1$, raționalizarea dă $\\frac{${k}}{${p} - ${rq}} = ${k === 1 ? '' : k}(${p} + ${rq})$ și $\\frac{${k}}{${p} + ${rq}} = ${k === 1 ? '' : k}(${p} - ${rq})$.`,
      show(`a = ${k * p} + ${krq} - ${twoKrq} = ${k * p} - ${krq}, \\qquad b = ${k * p} - ${krq} + ${twoKrq} = ${k * p} + ${krq}`),
      show(`m_g = \\sqrt{ab} = \\sqrt{${k * k * p * p} - ${k * k * r * r * q}} = \\sqrt{${k * k}} = ${k}`),
    ),
    verify: () => {
      const s = r * Math.sqrt(q)
      const a = k / (p - s) - 2 * k * s
      const b = k / (p + s) + 2 * k * s
      return close(Math.sqrt(a * b), k)
    },
  }
}

const FREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]

/** (√m − √n)·√(m + n + 2√(mn)) = m − n and (u√s + v)·√(u²s + v² − 2uv√s) = u²s − v²; then the geometric mean. (Testul 8, II.2) */
export function nestedRadicalMean(rng: Rng): Made {
  for (;;) {
    const [m, n] = [pick(rng, FREE), pick(rng, FREE)].sort((x, y) => y - x)
    const s = pick(rng, [2, 3, 5, 6, 7])
    const u = int(rng, 1, 3)
    const v = int(rng, 1, 6)
    const A = m - n
    const B = u * u * s - v * v
    if (m === n || B <= 0 || !isSquare(A * B)) continue
    const us = `${u === 1 ? '' : u}\\sqrt{${s}}`
    return {
      text: `Calculați media geometrică a numerelor $a = (\\sqrt{${m}} - \\sqrt{${n}})\\sqrt{${m + n} + 2\\sqrt{${m * n}}}$ și $b = (${us} + ${v})\\sqrt{${u * u * s + v * v} - ${2 * u * v}\\sqrt{${s}}}$.`,
      solution: lines(
        'Numerele de sub radicalii mari sunt pătrate perfecte:',
        show(`${m + n} + 2\\sqrt{${m * n}} = (\\sqrt{${m}} + \\sqrt{${n}})^2, \\qquad ${u * u * s + v * v} - ${2 * u * v}\\sqrt{${s}} = (${us} - ${v})^2`),
        `Cum $${us} > ${v}$, $\\sqrt{(${us} - ${v})^2} = ${us} - ${v}$. Atunci`,
        show(`a = (\\sqrt{${m}} - \\sqrt{${n}})(\\sqrt{${m}} + \\sqrt{${n}}) = ${m} - ${n} = ${A}, \\qquad b = (${us} + ${v})(${us} - ${v}) = ${u * u * s} - ${v * v} = ${B}`),
        show(`m_g = \\sqrt{ab} = \\sqrt{${A} \\cdot ${B}} = \\sqrt{${A * B}} = ${Math.sqrt(A * B)}`),
      ),
      verify: () => {
        const a = (Math.sqrt(m) - Math.sqrt(n)) * Math.sqrt(m + n + 2 * Math.sqrt(m * n))
        const b = (u * Math.sqrt(s) + v) * Math.sqrt(u * u * s + v * v - 2 * u * v * Math.sqrt(s))
        return close(a, A) && close(b, B) && close(Math.sqrt(a * b), Math.sqrt(A * B))
      },
    }
  }
}

// ================= the linear function =================

const RATIO_WORDS: Record<number, string> = { 1: 'coordonatele egale', 2: 'ordonata egală cu dublul abscisei', 3: 'ordonata egală cu triplul abscisei', [-1]: 'coordonatele numere opuse' }

/** The point of the graph with y = kx: ax + b = kx. (Testul 3, II.4 b; Testul 5, II.4 b) */
export function pointWithRatio(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [1, 2, 3, -1])
    const a = nonZero(rng, -5, 5)
    const x0 = nonZero(rng, -9, 9)
    if (a === k) continue
    const b = (k - a) * x0
    return {
      text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${poly([[a, 'x'], [b, '']])}$. Determinați punctul de pe graficul funcției care are ${RATIO_WORDS[k]}.`,
      solution: lines(
        `Căutăm punctul $M(x, ${k === 1 ? 'x' : k === -1 ? '-x' : `${k}x`})$ de pe grafic: $f(x) = ${k === 1 ? 'x' : k === -1 ? '-x' : `${k}x`}$.`,
        show(`${poly([[a, 'x'], [b, '']])} = ${k === 1 ? 'x' : k === -1 ? '-x' : `${k}x`} \\Rightarrow ${poly([[a - k, 'x']])} = ${-b} \\Rightarrow x = ${x0}`),
        `Punctul este $M(${x0}, ${k * x0})$.`,
      ),
      verify: () => a * x0 + b === k * x0,
    }
  }
}

/** A(m, pm + q) on the graph of f(x) = mx + c: m² − pm + (c − q) = 0, with whole roots. (Testul 6, II.5 a) */
export function parameterOnGraph(rng: Rng): Made {
  for (;;) {
    const r1 = int(rng, -6, 6)
    const r2 = int(rng, -6, 6)
    const c = nonZero(rng, -6, 6)
    if (r1 === r2) continue
    const p = r1 + r2
    const q = c - r1 * r2
    const [lo, hi] = r1 < r2 ? [r1, r2] : [r2, r1]
    return {
      text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = mx ${c < 0 ? '-' : '+'} ${Math.abs(c)}$, unde $m$ este un număr real. Determinați valorile întregi ale lui $m$ pentru care punctul $A(m, ${poly([[p, 'm'], [q, '']])})$ se află pe graficul funcției.`,
      solution: lines(
        `$A$ este pe grafic exact când $f(m) = ${poly([[p, 'm'], [q, '']])}$:`,
        show(`m \\cdot m ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${poly([[p, 'm'], [q, '']])} \\Rightarrow ${poly([[1, 'm^2'], [-p, 'm'], [r1 * r2, '']])} = 0 \\Rightarrow ${[lo, hi].map((r) => (r === 0 ? 'm' : `(${plus('m', -r)})`)).join('')} = 0`),
        `Deci $m \\in \\{${lo}, ${hi}\\}$, ambele întregi.`,
      ),
      verify: () => [r1, r2].every((m) => m * m + c === p * m + q),
    }
  }
}

/** f(1) + f(2) + … + f(n) for f(x) = 2x − 1 is n²: a perfect square. (Testul 7, II.5 b) */
export function sumOfValuesSquare(rng: Rng): Made {
  const n = int(rng, 20, 600)
  return {
    text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = 2x - 1$. Arătați că numărul $a = f(1) + f(2) + f(3) + \\ldots + f(${n})$ este pătrat perfect.`,
    solution: lines(
      show(`a = (2 \\cdot 1 - 1) + (2 \\cdot 2 - 1) + \\ldots + (2 \\cdot ${n} - 1) = 2(1 + 2 + \\ldots + ${n}) - ${n}`),
      show(`a = 2 \\cdot \\frac{${n} \\cdot ${n + 1}}{2} - ${n} = ${n} \\cdot ${n + 1} - ${n} = ${n}^2`),
    ),
    verify: () => Array.from({ length: n }, (_, i) => 2 * (i + 1) - 1).reduce((s, v) => s + v, 0) === n * n,
  }
}

/** An equation with f: f(x + p) − k·f(x) = f(x − q) + c for a given linear f. (Testul 8, II.4 b) */
export function shiftEquation(rng: Rng): Made {
  const a = nonZero(rng, -6, 6)
  const b = int(rng, -9, 9)
  const p = int(rng, 1, 3)
  const q = int(rng, 1, 3)
  const k = pick(rng, [2, 3])
  const x0 = int(rng, -9, 9)
  const c = a * (p + q) - k * b - k * a * x0
  const fx = (shift: number) => poly([[a, 'x'], [a * shift + b, '']])
  return {
    text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${poly([[a, 'x'], [b, '']])}$. Rezolvați ecuația $f(x + ${p}) - ${k}f(x) = f(x - ${q})${c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c)}`}$.`,
    solution: lines(
      show(`f(x + ${p}) = ${fx(p)}, \\qquad f(x - ${q}) = ${fx(-q)}`),
      show(`${fx(p)} - ${k}(${fx(0)}) = ${fx(-q)}${c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c)}`}`),
      show(`${poly([[a - k * a, 'x'], [a * p + b - k * b, '']])} = ${poly([[a, 'x'], [-a * q + b + c, '']])} \\Rightarrow ${poly([[-k * a, 'x']])} = ${-a * q + b + c - (a * p + b - k * b)} \\Rightarrow x = ${x0}`),
    ),
    verify: () => {
      const f = (x: number) => a * x + b
      return f(x0 + p) - k * f(x0) === f(x0 - q) + c
    },
  }
}

/** The distance from M(m, 0) to the graph of f(x) = ax + b: twice the area of MAB over AB. (Testul 9, II.5 b) */
export function distancePointToLine(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [-3, -2, -1, 1, 2, 3])
    const xA = nonZero(rng, -6, 6)
    const b = -a * xA
    const m = int(rng, -8, 8)
    if (m === xA) continue
    const base = Math.abs(m - xA)
    const AB2 = xA * xA + b * b
    const [k, r] = rootParts(AB2)
    const d = surd(base * Math.abs(b), k * r, r)
    return {
      text: `Se consideră funcția $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ${poly([[a, 'x'], [b, '']])}$. Calculați distanța de la punctul $M(${m}, 0)$ la dreapta care reprezintă graficul funcției.`,
      solution: lines(
        `Graficul taie axele în $A(${xA}, 0)$ (din $f(x) = 0$) și $B(0, ${b})$ (din $f(0) = ${b}$). Distanța cerută este înălțimea din $M$ a triunghiului $MAB$.`,
        `Cu baza $MA = |${m} - ${paren(xA)}| = ${base}$ pe axa $Ox$ și înălțimea $OB = ${Math.abs(b)}$: $\\mathcal{A}_{MAB} = \\frac{${base} \\cdot ${Math.abs(b)}}{2} = ${frac(base * Math.abs(b), 2)}$.`,
        show(`AB = \\sqrt{OA^2 + OB^2} = \\sqrt{${xA * xA} + ${b * b}} = ${surd(k, 1, r)}, \\qquad d = \\frac{2\\mathcal{A}_{MAB}}{AB} = \\frac{${base * Math.abs(b)}}{${surd(k, 1, r)}} = ${d}`),
      ),
      verify: () => close((base * Math.abs(b)) / Math.sqrt(AB2), Math.abs(a * m + b) / Math.sqrt(a * a + 1)),
    }
  }
}

// ================= numbers =================

const POWER_PAIRS: [number, number, number][] = (() => {
  const out: [number, number, number][] = []
  for (const e of [1, 3]) for (let a = 2; a <= 12; a++) for (let b = 2; b <= 7; b++) {
    const w = b ** e - a
    if (a !== b && w > 0 && isSquare(w) && !isSquare(a)) out.push([a, b, e])
  }
  return out
})()

/** A = (a²)ⁿ·b^(2n+e) − a^(2n+1)·(b²)ⁿ = (ab)^(2n)(b^e − a), a perfect square when b^e − a is. (Testul 3, II.2) */
export function powerProductSquare(rng: Rng): Made {
  const [a, b, e] = pick(rng, POWER_PAIRS)
  const w = b ** e - a
  const s = Math.sqrt(w)
  return {
    text: `Arătați că numărul $A = ${a * a}^n \\cdot ${b}^{2n${e === 1 ? '+1' : `+${e}`}} - ${a}^{2n+1} \\cdot ${b * b}^n$, unde $n \\in \\mathbb{N}$, este pătrat perfect și calculați $\\sqrt{A}$.`,
    solution: lines(
      `Scriem puterile cu bazele ${a} și ${b}: $${a * a}^n = ${a}^{2n}$, $${b * b}^n = ${b}^{2n}$.`,
      show(`A = ${a}^{2n} \\cdot ${b}^{2n} \\cdot ${b}${e === 1 ? '' : `^{${e}}`} - ${a}^{2n} \\cdot ${a} \\cdot ${b}^{2n} = ${a}^{2n} \\cdot ${b}^{2n}(${b ** e} - ${a}) = ${a * b}^{2n} \\cdot ${w}`),
      show(`A = (${a * b}^n \\cdot ${s})^2, \\qquad \\sqrt{A} = ${s === 1 ? '' : `${s} \\cdot `}${a * b}^n`),
    ),
    verify: () => [0, 1, 2].every((n) => (a * a) ** n * b ** (2 * n + e) - a ** (2 * n + 1) * (b * b) ** n === (a * b) ** (2 * n) * w),
  }
}

/** Two naturals with gcd d and a² − b² = D: a = dx, b = dy, x² − y² = D/d² with (x, y) = 1. (Testul 7, II.2) */
export function gcdDifferenceSquares(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 2, 12)
    const x = int(rng, 2, 9)
    const y = int(rng, 1, x - 1)
    if (gcd(x, y) !== 1) continue
    const K = x * x - y * y
    const D = d * d * K
    const sols: [number, number][] = []
    for (let u = 1; u * u < K; u++) {
      if (K % u) continue
      const v = K / u
      if ((u + v) % 2) continue
      const [X, Y] = [(u + v) / 2, (v - u) / 2]
      if (Y > 0 && gcd(X, Y) === 1) sols.push([X, Y])
    }
    return {
      text: `Determinați numerele naturale $a$ și $b$, cu $a > b$, care au cel mai mare divizor comun ${d} și pentru care $a^2 - b^2 = ${D}$.`,
      solution: lines(
        `Scriem $a = ${d}x$, $b = ${d}y$, cu $x > y$ și $(x, y) = 1$. Atunci $${d * d}(x^2 - y^2) = ${D}$, deci $(x - y)(x + y) = ${K}$.`,
        `Factorii au aceeași paritate. Din descompunerile lui ${K} obținem $(x, y) \\in \\{${sols.map(([X, Y]) => `(${X}, ${Y})`).join(', ')}\\}$, prime între ele.`,
        show(`(a, b) \\in \\{${sols.map(([X, Y]) => `(${d * X}, ${d * Y})`).join(', ')}\\}`),
      ),
      verify: () => sols.length > 0 && sols.every(([X, Y]) => gcd(d * X, d * Y) === d && (d * X) ** 2 - (d * Y) ** 2 === D),
    }
  }
}

const GROUPS: [number, number, number][] = [[2, 5, 31], [3, 4, 40], [2, 4, 15], [2, 3, 7], [5, 2, 6], [3, 2, 4], [4, 2, 5], [7, 2, 8]]

/** 1 + r + r² + … in groups of g terms, each group a multiple of 1 + r + … + r^(g−1). (Testul 4, II.5 b; Testul 6, II.2) */
export function geometricSumDivisible(rng: Rng): Made {
  const [r, g, M] = pick(rng, GROUPS)
  const s = int(rng, 0, 3)
  const t = int(rng, 100, 700)
  const last = s + g * t - 1
  const by = M === 40 && rng() < 0.5 ? 10 : M
  const first = Array.from({ length: g }, (_, i) => `${r}^{${s + i}}`).join(' + ')
  return {
    text: `Arătați că numărul $A = ${r}^{${s}} + ${r}^{${s + 1}} + ${r}^{${s + 2}} + \\ldots + ${r}^{${last}}$ se divide cu ${by}.`,
    solution: lines(
      `Suma are $${last} - ${s} + 1 = ${g * t}$ termeni, deci îi putem grupa câte ${g}, în ${t} grupe:`,
      show(`A = (${first}) + \\ldots + (${Array.from({ length: g }, (_, i) => `${r}^{${last - g + 1 + i}}`).join(' + ')})`),
      `Din fiecare grupă dăm factor comun prima ei putere: $${r}^k(${Array.from({ length: g }, (_, i) => (i === 0 ? '1' : i === 1 ? String(r) : `${r}^{${i}}`)).join(' + ')}) = ${r}^k \\cdot ${M}$.`,
      `Deci $A = ${M}(${r}^{${s}} + ${r}^{${s + g}} + \\ldots + ${r}^{${last - g + 1}})$ se divide cu ${M}${by === M ? '' : `, deci și cu ${by}`}.`,
    ),
    verify: () => {
      let sum = 0
      for (let i = 0; i < g; i++) sum += r ** i
      return sum === M && M % by === 0
    },
  }
}

// ================= problems =================

/** Two naturals from their arithmetic and geometric means: sum and product, then the roots. (Testul 2, II.2) */
export function meanArithGeom(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 1, 6)
    const u = int(rng, 1, 5)
    const v = int(rng, u + 1, 8)
    const [x, y] = [d * v * v, d * u * u]
    if ((x + y) % 2) continue
    const A = (x + y) / 2
    const G = d * u * v
    return {
      text: `Aflați două numere naturale care au media aritmetică egală cu ${A} și media geometrică egală cu ${G}.`,
      solution: lines(
        `Fie $a$ și $b$ numerele. Atunci $a + b = 2 \\cdot ${A} = ${2 * A}$ și $\\sqrt{ab} = ${G}$, adică $ab = ${G * G}$.`,
        `Numerele sunt soluțiile ecuației $t^2 - ${2 * A}t + ${G * G} = 0$, adică $(t - ${x})(t - ${y}) = 0$:`,
        show(`\\{a, b\\} = \\{${x}, ${y}\\}`),
      ),
      verify: () => x + y === 2 * A && x * y === G * G,
    }
  }
}

/** A contest: p points for a right answer, q taken off for a wrong one, all answered; the wrong answers. (Testele 5, 7, II.3) */
export function contestPoints(rng: Rng): Made {
  for (;;) {
    const N = int(rng, 20, 40)
    const p = int(rng, 4, 10)
    const q = int(rng, 1, 6)
    const w = int(rng, 1, N - 3)
    const T = p * (N - w) - q * w
    if (T <= 0) continue
    return {
      text: `La un concurs, fiecare participant a răspuns la ${de(N)} întrebări. Pentru un răspuns corect s-au acordat ${p} puncte, iar pentru un răspuns greșit s-au scăzut ${q === 1 ? 'un punct' : `${q} puncte`}. Un participant a obținut ${de(T)} puncte. La câte întrebări a răspuns greșit?`,
      solution: lines(
        `Dacă toate cele ${de(N)} răspunsuri ar fi fost corecte, ar fi obținut $${N} \\cdot ${p} = ${N * p}$ ${deWord(N * p)}puncte.`,
        `Fiecare răspuns greșit în locul unuia corect îl costă $${p} + ${q} = ${p + q}$ puncte (pierde ${p} și i se mai scad ${q}). A pierdut $${N * p} - ${T} = ${N * p - T}$ ${deWord(N * p - T)}puncte:`,
        `$${N * p - T} : ${p + q} = ${w}$, deci a răspuns greșit la ${de(w)} ${w === 1 ? 'întrebare' : 'întrebări'}.`,
      ),
      verify: () => p * (N - w) - q * w === T,
    }
  }
}

/** k children got a candies each and the rest b each; with c each, r would be left: n, then the candies. (Testul 6, II.3) */
export function candiesShortfall(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6)
    const c = a + int(rng, 1, 4)
    const b = c + int(rng, 1, 4)
    const k = int(rng, 2, 8)
    const n = k + int(rng, 3, 20)
    const total = k * a + (n - k) * b
    const r = total - c * n
    if (r <= 0) continue
    return {
      text: `Un grup de copii a primit bomboane. ${k} copii din grup au primit câte ${a} bomboane, iar ceilalți câte ${b} bomboane. Dacă fiecare copil ar fi primit câte ${c} bomboane, ar fi rămas ${de(r)} bomboane. Câte bomboane au fost distribuite?`,
      solution: lines(
        `Fie $n$ numărul copiilor. Numărul bomboanelor este, în ambele situații, același:`,
        show(`${k} \\cdot ${a} + (n - ${k}) \\cdot ${b} = ${c}n + ${r} \\Rightarrow ${b}n - ${k * b - k * a} = ${c}n + ${r} \\Rightarrow ${b - c === 1 ? '' : b - c}n = ${r + k * b - k * a} \\Rightarrow n = ${n}`),
        show(`${c} \\cdot ${n} + ${r} = ${total}\\text{ bomboane}`),
      ),
      verify: () => k * a + (n - k) * b === c * n + r && (r + k * b - k * a) % (b - c) === 0,
    }
  }
}

// ================= equations and systems =================

/** (x − a)² + c = x(x − b): the squares cancel and the equation is of grade I. (Testul 4, I.4) */
export function squareEquationLinear(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -6, 6)
    const b = nonZero(rng, -9, 9)
    const x0 = int(rng, -9, 9)
    if (2 * a - b === 0) continue
    const c = x0 * (2 * a - b) - a * a
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $(${plus('x', -a)})^2${c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c)}`} = x(${plus('x', -b)})$.`,
      solution: lines(
        show(`${poly([[1, 'x^2'], [-2 * a, 'x'], [a * a, '']])}${c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c)}`} = ${poly([[1, 'x^2'], [-b, 'x']])}`),
        `Termenii $x^2$ se reduc:`,
        show(`${poly([[b - 2 * a, 'x']])} = ${-(a * a + c)} \\Rightarrow x = ${x0}`),
      ),
      verify: () => (x0 - a) ** 2 + c === x0 * (x0 - b),
    }
  }
}

/** (a₁x + b₁y − c₁)² + (a₂x + b₂y − c₂)² = 0: both brackets are 0, a system. (Testul 9, I.3) */
export function squaresSystem(rng: Rng): Made {
  for (;;) {
    const [a1, b1, a2, b2] = [nonZero(rng, -3, 3), nonZero(rng, -3, 3), nonZero(rng, -3, 3), nonZero(rng, -3, 3)]
    if (a1 * b2 - a2 * b1 === 0) continue
    const [x, y] = [int(rng, -6, 6), int(rng, -6, 6)]
    const c1 = a1 * x + b1 * y
    const c2 = a2 * x + b2 * y
    const e1 = poly([[a1, 'x'], [b1, 'y'], [-c1, '']])
    const e2 = poly([[a2, 'x'], [b2, 'y'], [-c2, '']])
    return {
      text: `Determinați numerele reale $x$ și $y$ pentru care $(${e1})^2 + (${e2})^2 = 0$.`,
      solution: lines(
        'O sumă de pătrate este 0 doar dacă fiecare pătrat este 0, deci rezolvăm sistemul:',
        show(`\\begin{cases} ${poly([[a1, 'x'], [b1, 'y']])} = ${c1} \\\\ ${poly([[a2, 'x'], [b2, 'y']])} = ${c2} \\end{cases}`),
        `${a1 === a2 ? 'Scădem cele două ecuații' : `Înmulțim prima ecuație cu ${paren(a2)}, a doua cu ${paren(a1)} și le scădem`}: $${poly([[a2 * b1 - a1 * b2, 'y']])} = ${a2 * c1 - a1 * c2}$, deci $y = ${y}$. Înlocuind, $x = ${x}$.`,
        show(`(x, y) = (${x}, ${y})`),
      ),
      verify: () => a1 * x + b1 * y === c1 && a2 * x + b2 * y === c2 && (a2 * b1 - a1 * b2) * y === a2 * c1 - a1 * c2,
    }
  }
}
