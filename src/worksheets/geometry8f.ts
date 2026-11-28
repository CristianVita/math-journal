// Grade VIII geometry in space, fifth batch (28 November 2026): what the tests of chapter 6 of the workbook "cu
// puișorul" (areas and volumes, pp. 90–91, 101–102, 109–110) ask and the earlier batches did not have. Own numbers and
// wording, worked solutions in Romanian; every `verify` rebuilds the figure in coordinates or recomputes the numbers.
import type { Made } from './generators'
import type { Form, Kind8 } from './alg8'
import { addExact, exact, exactTex, frac, gcd, int, pick, rightTriangle, root, rootParts, shuffle, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.filter(Boolean).join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const close = (a: number, b: number) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))
/** √(p/q) simplified. */
const sqrtFrac = (p: number, q: number) => {
  const [k, m] = rootParts(p * q)
  return surd(k, q, m)
}
/** n/√s simplified. */
const over = (n: number, s: number) => {
  const [k, m] = rootParts(s)
  return surd(n, k * m, m)
}
/** a coefficient (LaTeX) times π */
const withPi = (t: string) => (t === '1' ? '\\pi' : `${t}\\pi`)
const pi = (p: number, q = 1) => withPi(frac(p, q))
const ABC = 'abcdefghij'
const listed = (items: string[]) => items.map((t, i) => `${ABC[i]}) ${t}`).join('; ')
const S3 = Math.sqrt(3)
/** The usual Pythagorean triples, legs first. */
const TRIPLES = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]] as const

// ---------- coordinates ----------
type P = [number, number, number]
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
const dot = (a: P, b: P) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: P, b: P): P => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: P) => Math.sqrt(dot(a, a))
const dist = (a: P, b: P) => len(sub(a, b))
const toLine = (p: P, a: P, b: P) => len(cross(sub(p, a), sub(b, a))) / dist(a, b)
const normal = (a: P, b: P, c: P) => cross(sub(b, a), sub(c, a))
const toPlane = (p: P, a: P, b: P, c: P) => Math.abs(dot(sub(p, a), normal(a, b, c))) / len(normal(a, b, c))
const sinLP = (p: P, q: P, a: P, b: P, c: P) => {
  const n = normal(a, b, c)
  return Math.abs(dot(sub(q, p), n)) / (dist(p, q) * len(n))
}
const cosPP = (a1: P, b1: P, c1: P, a2: P, b2: P, c2: P) => {
  const [n1, n2] = [normal(a1, b1, c1), normal(a2, b2, c2)]
  return Math.abs(dot(n1, n2)) / (len(n1) * len(n2))
}
const triArea = (a: P, b: P, c: P) => len(normal(a, b, c)) / 2
const up = (p: P, z: number): P => [p[0], p[1], p[2] + z]
const boxPts = (x: number, y: number, z: number): P[] =>
  [[0, 0, 0], [x, 0, 0], [x, y, 0], [0, y, 0], [0, 0, z], [x, 0, z], [x, y, z], [0, y, z]]
/** A regular polygon with n vertices on a circle of radius r, centred at the origin, at height z. */
const polygon = (n: number, r: number, z = 0): P[] =>
  Array.from({ length: n }, (_, k) => [r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n), z] as P)
/** The foot of the perpendicular from p on the line ab. */
const foot = (p: P, a: P, b: P): P => {
  const d = sub(b, a)
  const t = dot(sub(p, a), d) / dot(d, d)
  return [a[0] + t * d[0], a[1] + t * d[1], a[2] + t * d[2]]
}

// ======================= prisms (test pp. 90–91) =======================

/** Four quick questions on the cube, each with its own numbers. (Test p. 90, 1.1) */
export function cubeQuick(rng: Rng): Made {
  const a = int(rng, 2, 20), b = int(rng, 2, 20), e = int(rng, 2, 20)
  return {
    text: `i) Desenați cubul $ABCDA'B'C'D'$. ii) Dacă latura cubului este de ${a} cm, calculați aria lui totală. iii) Dacă $\\ell = ${b}$ cm, calculați lungimea diagonalei cubului. iv) Dacă aria laterală este de ${4 * e * e} cm², aflați muchia cubului.`,
    solution: lines(
      "i) Fața $ABCD$ se desenează ca un paralelogram, muchiile laterale $AA'$, $BB'$, $CC'$, $DD'$ verticale și egale, iar muchiile ascunse punctat.",
      `ii) $\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${a * a} = ${6 * a * a}$ cm².`,
      `iii) $d = \\ell\\sqrt{3} = ${b}\\sqrt{3}$ cm.`,
      `iv) $\\mathcal{A}_\\ell = 4\\ell^2 = ${4 * e * e}$, deci $\\ell^2 = ${e * e}$ și $\\ell = ${e}$ cm.`,
    ),
    verify: () => {
      const p = boxPts(b, b, b)
      return close(dist(p[0], p[6]), b * S3) && close(4 * e * e, 4 * dist(p[0], p[1]) ** 2 * (e / b) ** 2)
    },
  }
}

/** One cube: its diagonal, volume and total area. (Test p. 91, 3.1) */
export function cubeOne(rng: Rng): Made {
  const a = int(rng, 2, 30)
  return {
    text: `Fie cubul $ABCDA'B'C'D'$ cu $AB = ${a}$ cm. i) Desenați cubul. ii) Calculați lungimea diagonalei cubului. iii) Calculați volumul cubului. iv) Calculați aria totală a cubului.`,
    solution: lines(
      "i) Fața $ABCD$ se desenează ca un paralelogram, muchiile laterale verticale și egale, iar muchiile ascunse punctat.",
      `ii) $d = \\ell\\sqrt{3} = ${a}\\sqrt{3}$ cm.`,
      `iii) $V = \\ell^3 = ${a}^3 = ${a ** 3}$ cm³.`,
      `iv) $\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${a * a} = ${6 * a * a}$ cm².`,
    ),
    verify: () => {
      const p = boxPts(a, a, a)
      return close(dist(p[0], p[6]), a * S3) && close(dist(p[0], p[1]) * dist(p[0], p[3]) * dist(p[0], p[4]), a ** 3)
    },
  }
}

/** The cuboid: the diagonal of the base, then of the cuboid. (Test p. 90, 2.1) */
export function cuboidQuick(rng: Rng): Made {
  const l = int(rng, 2, 15), L = int(rng, l + 1, 24), h = int(rng, 2, 24)
  return {
    text: `i) Desenați paralelipipedul dreptunghic $ABCDA'B'C'D'$. ii) Dacă $L = ${L}$ cm și $\\ell = ${l}$ cm, calculați lungimea diagonalei bazei paralelipipedului desenat. iii) Dacă, în plus, $h = ${h}$ cm, calculați diagonala paralelipipedului.`,
    solution: lines(
      'i) Baza $ABCD$ se desenează ca un paralelogram, muchiile laterale verticale și egale, iar muchiile ascunse punctat.',
      `ii) Triunghiul $ABC$ este dreptunghic în $B$: $AC = \\sqrt{L^2 + \\ell^2} = \\sqrt{${L * L} + ${l * l}} = ${root(L * L + l * l)}$ cm.`,
      `iii) $d = \\sqrt{L^2 + \\ell^2 + h^2} = \\sqrt{${L * L} + ${l * l} + ${h * h}} = ${root(L * L + l * l + h * h)}$ cm.`,
    ),
    verify: () => {
      const p = boxPts(L, l, h)
      return close(dist(p[0], p[2]), Math.sqrt(L * L + l * l)) && close(dist(p[0], p[6]), Math.sqrt(L * L + l * l + h * h))
    },
  }
}

/** The regular hexagonal prism: base area, volume, the diagonal AC'. (Test p. 91, 4.1) */
export function hexPrismQuick(rng: Rng): Made {
  const a = int(rng, 2, 20), h = int(rng, 2, 25)
  return {
    text: `Fie prisma hexagonală regulată dreaptă $ABCDEFA'B'C'D'E'F'$ cu $AB = ${a}$ cm și $AA' = ${h}$ cm. i) Desenați prisma. ii) Calculați aria bazei. iii) Calculați volumul prismei. iv) Calculați lungimea lui $AC'$.`,
    solution: lines(
      'i) Hexagonul $ABCDEF$ se desenează în perspectivă, cu laturile opuse paralele, iar muchiile laterale verticale și egale.',
      `ii) Baza este formată din 6 triunghiuri echilaterale cu latura de ${a} cm: $\\mathcal{A}_b = 6 \\cdot \\frac{\\ell^2\\sqrt{3}}{4} = \\frac{3 \\cdot ${a * a}\\sqrt{3}}{2} = ${surd(3 * a * a, 2, 3)}$ cm².`,
      `iii) $V = \\mathcal{A}_b \\cdot h = ${surd(3 * a * a, 2, 3)} \\cdot ${h} = ${surd(3 * a * a * h, 2, 3)}$ cm³.`,
      `iv) În hexagonul regulat $AC = \\ell\\sqrt{3} = ${a}\\sqrt{3}$ cm, iar $CC' \\perp AC$: $AC' = \\sqrt{${3 * a * a} + ${h * h}} = ${root(3 * a * a + h * h)}$ cm.`,
    ),
    verify: () => {
      const b = polygon(6, a)
      return close(dist(b[0], up(b[2], h)), Math.sqrt(3 * a * a + h * h)) && close(6 * triArea([0, 0, 0], b[0], b[1]) * h, (3 * a * a * h * S3) / 2)
    },
  }
}

/** Two blanks to fill, among a cuboid, a square, a triangular and a hexagonal prism. (Test p. 90, 1.2, 2.3, 2.4) */
export function prismBlanks(rng: Rng): Made {
  const parts = shuffle(rng, [0, 1, 2, 3]).slice(0, 2).sort()
  const qs: string[] = [], sols: string[] = [], checks: boolean[] = []
  for (const k of parts) {
    if (k === 0) {
      const l = int(rng, 2, 12), L = int(rng, l + 1, 20), h = int(rng, 2, 15)
      const at = 2 * (L * l + L * h + l * h)
      qs.push(`paralelipipedul dreptunghic cu $\\mathcal{A}_b = ${L * l}$ cm², $\\ell = ${l}$ cm și $V = ${L * l * h}$ cm³ are $\\mathcal{A}_t = \\ldots$ cm²`)
      sols.push(`$L = \\frac{${L * l}}{${l}} = ${L}$ cm, $h = \\frac{V}{\\mathcal{A}_b} = \\frac{${L * l * h}}{${L * l}} = ${h}$ cm, deci $\\mathcal{A}_t = 2(${L * l} + ${L * h} + ${l * h}) = ${at}$ cm²`)
      const p = boxPts(L, l, h)
      checks.push(close(2 * (dist(p[0], p[1]) * dist(p[0], p[3]) + dist(p[0], p[1]) * dist(p[0], p[4]) + dist(p[0], p[3]) * dist(p[0], p[4])), at))
    } else if (k === 1) {
      const a = int(rng, 2, 15), h = int(rng, 2, 20)
      qs.push(`prisma patrulateră regulată cu $\\mathcal{A}_\\ell = ${4 * a * h}$ cm² și latura bazei de ${a} cm are $V = \\ldots$ cm³`)
      sols.push(`$\\mathcal{A}_\\ell = 4\\ell h$, deci $h = \\frac{${4 * a * h}}{${4 * a}} = ${h}$ cm și $V = \\ell^2 h = ${a * a} \\cdot ${h} = ${a * a * h}$ cm³`)
      checks.push(close((4 * a * h) / (4 * a) * a * a, a * a * h))
    } else if (k === 2) {
      const m = int(rng, 1, 8), h = int(rng, 2, 20)
      qs.push(`prisma triunghiulară regulată cu $\\mathcal{A}_\\ell = ${6 * m * h}$ cm² și $\\mathcal{A}_b = ${surd(m * m, 1, 3)}$ cm² are volumul de $\\ldots$ cm³`)
      sols.push(`$\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(m * m, 1, 3)}$, deci $\\ell = ${2 * m}$ cm; $\\mathcal{A}_\\ell = 3\\ell h$, deci $h = \\frac{${6 * m * h}}{${6 * m}} = ${h}$ cm și $V = \\mathcal{A}_b \\cdot h = ${surd(m * m * h, 1, 3)}$ cm³`)
      const b = polygon(3, (2 * m) / S3)
      checks.push(close(3 * dist(b[0], b[1]) * h, 6 * m * h) && close(triArea(b[0], b[1], b[2]) * h, m * m * h * S3))
    } else {
      const a = int(rng, 2, 12), h = int(rng, 2, 15)
      qs.push(`prisma hexagonală regulată cu $h = ${h}$ cm și o diagonală mare a bazei de ${2 * a} cm are volumul de $\\ldots$ cm³`)
      sols.push(`diagonala mare a hexagonului regulat este dublul laturii, deci $\\ell = ${a}$ cm, $\\mathcal{A}_b = \\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(3 * a * a, 2, 3)}$ cm² și $V = ${surd(3 * a * a * h, 2, 3)}$ cm³`)
      const b = polygon(6, a)
      checks.push(close(dist(b[0], b[3]), 2 * a) && close(6 * triArea([0, 0, 0], b[0], b[1]) * h, (3 * a * a * h * S3) / 2))
    }
  }
  return {
    text: `Completați spațiile punctate: ${listed(qs)}.`,
    solution: sols.map((s, i) => `${ABC[i]}) ${s}.`).join('\n\n'),
    verify: () => checks.every(Boolean),
  }
}

/** The regular triangular prism from its base area and volume: an angle, a distance, a right triangle. (Test p. 90, 3) */
export function triPrismAbV(rng: Rng): Made {
  const m = int(rng, 1, 10), h = int(rng, 2, 20)
  return {
    text: `În prisma triunghiulară regulată $ABCA'B'C'$ se cunosc $\\mathcal{A}_b = ${surd(m * m, 1, 3)}$ cm² și $V = ${surd(m * m * h, 1, 3)}$ cm³. Să se afle: a) $\\cos(\\angle(A'C, (ABC)))$; b) $d(A, (BCA'))$; c) aria triunghiului $A'BD$, unde $D$ este mijlocul lui $[B'C']$.`,
    solution: lines(
      `Din $\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(m * m, 1, 3)}$ rezultă $\\ell^2 = ${4 * m * m}$, deci $AB = ${2 * m}$ cm, iar $h = \\frac{V}{\\mathcal{A}_b} = ${h}$ cm.`,
      `a) $AA' \\perp (ABC)$, deci proiecția lui $A'C$ pe planul bazei este $AC$ și unghiul cerut este $\\angle A'CA$. $A'C = \\sqrt{${4 * m * m} + ${h * h}} = ${root(4 * m * m + h * h)}$ cm:`,
      show(`\\cos(\\angle A'CA) = \\frac{AC}{A'C} = ${over(2 * m, 4 * m * m + h * h)}`),
      `b) Fie $M$ mijlocul lui $[BC]$: $AM \\perp BC$ și, din teorema celor trei perpendiculare, $A'M \\perp BC$, deci $BC \\perp (A'AM)$ și $(BCA') \\perp (A'AM)$. Perpendiculara $AN$ pe $A'M$ este perpendiculară pe planul $(BCA')$. $AM = \\frac{\\ell\\sqrt{3}}{2} = ${surd(m, 1, 3)}$ cm, $A'M = \\sqrt{${h * h} + ${3 * m * m}} = ${root(h * h + 3 * m * m)}$ cm:`,
      show(`d(A, (BCA')) = AN = \\frac{AA' \\cdot AM}{A'M} = ${sqrtFrac(3 * m * m * h * h, 3 * m * m + h * h)}\\text{ cm}`),
      `c) $A'D \\perp B'C'$ (mediană în triunghiul echilateral $A'B'C'$) și $A'D \\perp BB'$, deci $A'D \\perp (BCC')$ și $A'D \\perp BD$. $A'D = ${surd(m, 1, 3)}$ cm, $BD = \\sqrt{BB'^2 + B'D^2} = \\sqrt{${h * h} + ${m * m}} = ${root(h * h + m * m)}$ cm:`,
      show(`\\mathcal{A}_{A'BD} = \\frac{A'D \\cdot BD}{2} = ${sqrtFrac(3 * m * m * (h * h + m * m), 4)}\\text{ cm}^2`),
    ),
    verify: () => {
      const [A, B, C] = polygon(3, (2 * m) / S3)
      const [A1, B1, C1] = [A, B, C].map((p) => up(p, h))
      const D = mid(B1, C1)
      return close(Math.sqrt(1 - sinLP(C, A1, A, B, C) ** 2), (2 * m) / Math.sqrt(4 * m * m + h * h))
        && close(toPlane(A, B, C, A1), Math.sqrt((3 * m * m * h * h) / (3 * m * m + h * h)))
        && close(triArea(A1, B, D), Math.sqrt((3 * m * m * (h * h + m * m)) / 4))
    },
  }
}

/** The regular square prism from the diagonal of the base and a sine: total area, a tangent, a trapezoid. (Test p. 91, 2.5) */
export function squarePrismSine(rng: Rng): Made {
  const [p, q, r] = pick(rng, TRIPLES)
  const t = int(rng, 1, Math.max(1, Math.floor(40 / q)))
  const k = pick(rng, [3, 4])
  const [ac, h, d] = [q * t, p * t, r * t]
  const sinTex = r === 5 ? `$0{,}${2 * p}$` : `$${frac(p, r)}$`
  const at = exactTex(addExact(exact(ac * ac, 1), exact(2 * ac * h, 1, 2)))
  return {
    text: `O prismă patrulateră regulată $ABCDA'B'C'D'$ are diagonala bazei de ${ac} cm și sinusul unghiului format de diagonala prismei cu planul bazei de ${sinTex}. Să se afle: a) aria totală; b) tangenta unghiului dintre diagonala prismei și o față laterală; c) aria patrulaterului $PRQN$, unde $M \\in [AB]$, cu $AB = ${k} \\cdot AM$, iar paralelele prin $M$ la $AC$ și $BD$ intersectează dreapta $BC$ în $N$, respectiv $Q$, și dreapta $AD$ în $R$, respectiv $P$.`,
    solution: lines(
      `Proiecția diagonalei $AC'$ pe planul bazei este $AC$, deci $\\sin(\\angle C'AC) = \\frac{CC'}{AC'} = ${frac(p, r)}$ și $\\cos(\\angle C'AC) = \\frac{AC}{AC'} = ${frac(q, r)}$. Rezultă $AC' = ${d}$ cm și $h = CC' = ${h}$ cm. Latura bazei: $\\ell = \\frac{AC}{\\sqrt{2}} = ${surd(ac, 2, 2)}$ cm.`,
      `a) $\\mathcal{A}_t = 2\\ell^2 + 4\\ell h = 2 \\cdot ${frac(ac * ac, 2)} + 4 \\cdot ${surd(ac, 2, 2)} \\cdot ${h} = ${at}$ cm².`,
      `b) $AB \\perp (BCC')$, deci proiecția lui $AC'$ pe fața $(BCC')$ este $BC'$, iar unghiul cerut este $\\angle AC'B$. $BC' = \\sqrt{\\ell^2 + h^2} = ${sqrtFrac(ac * ac + 2 * h * h, 2)}$ cm:`,
      show(`\\operatorname{tg}(\\angle AC'B) = \\frac{AB}{BC'} = ${over(q, q * q + 2 * p * p)}`),
      `c) $AM = \\frac{\\ell}{${k}}$, $MB = \\frac{${k - 1}\\ell}{${k}}$. Triunghiurile $MBN$, $MAR$, $MAP$, $MBQ$ sunt dreptunghice isoscele (laturile fac unghiuri de $45^\\circ$ cu $AB$), deci $BN = BQ = MB$ și $AR = AP = AM$. Patrulaterul $PRQN$ este un trapez cu bazele $PR = 2AM$ și $NQ = 2MB$ (pe dreptele paralele $AD$ și $BC$) și înălțimea $AB = \\ell$:`,
      show(`\\mathcal{A}_{PRQN} = \\frac{(2AM + 2MB) \\cdot \\ell}{2} = \\ell^2 = ${frac(ac * ac, 2)}\\text{ cm}^2`),
    ),
    verify: () => {
      const s = ac / Math.SQRT2
      const pts = boxPts(s, s, h)
      const sn = sinLP(pts[0], pts[6], pts[1], pts[2], pts[6])
      // the trapezoid, by the shoelace formula, with A(0, 0), B(s, 0), D(0, s)
      const am = s / k
      const quad = [[0, am], [0, -am], [s, -(s - am)], [s, s - am]]
      const shoe = Math.abs(quad.reduce((sum, [x, y], i) => sum + x * quad[(i + 1) % 4][1] - quad[(i + 1) % 4][0] * y, 0)) / 2
      return close(sinLP(pts[0], pts[6], pts[0], pts[1], pts[2]), p / r) && close(sn / Math.sqrt(1 - sn * sn), q / Math.sqrt(q * q + 2 * p * p))
        && close(shoe, (ac * ac) / 2) && close(2 * s * s + 4 * s * h, ac * ac + 2 * Math.SQRT2 * ac * h)
    },
  }
}

/** A cuboid from AA', AB and d(A', BD): the volume and d(A, (A'BD)). (Test p. 91, 3.3) */
export function cuboidFromDistance(rng: Rng): Made {
  for (;;) {
    const [p, q, r] = pick(rng, TRIPLES)
    const u = int(rng, 1, 3)
    const [b, c, bd, ae, be] = [p * r * u, q * r * u, r * r * u, p * q * u, p * p * u]
    const [x, y, z] = pick(rng, TRIPLES)
    if (ae % x !== 0 || b > 90 || c > 90) continue
    const w = ae / x
    const [h, de] = [y * w, z * w]
    if (h > 90) continue
    return {
      text: `Fie paralelipipedul dreptunghic $ABCDA'B'C'D'$ cu $AA' = ${h}$ cm, $AB = ${b}$ cm și $d(A', BD) = ${de}$ cm. a) Aflați volumul paralelipipedului. b) Calculați $d(A, (A'BD))$.`,
      solution: lines(
        `Fie $AE \\perp BD$, $E \\in BD$. Cum $AA' \\perp (ABC)$, din teorema celor trei perpendiculare $A'E \\perp BD$, deci $A'E = ${de}$ cm. În triunghiul $A'AE$, dreptunghic în $A$: $AE = \\sqrt{${de * de} - ${h * h}} = ${ae}$ cm.`,
        `a) În triunghiul $ABD$, dreptunghic în $A$: $BE = \\sqrt{AB^2 - AE^2} = \\sqrt{${b * b} - ${ae * ae}} = ${be}$ cm, iar din teorema catetei $AB^2 = BE \\cdot BD$, deci $BD = \\frac{${b * b}}{${be}} = ${bd}$ cm și $AD = \\sqrt{${bd * bd} - ${b * b}} = ${c}$ cm.`,
        show(`V = AB \\cdot AD \\cdot AA' = ${b} \\cdot ${c} \\cdot ${h} = ${b * c * h}\\text{ cm}^3`),
        `b) $BD \\perp AE$ și $BD \\perp AA'$, deci $BD \\perp (A'AE)$ și $(A'BD) \\perp (A'AE)$. Perpendiculara $AF$ pe $A'E$ este perpendiculară pe planul $(A'BD)$:`,
        show(`d(A, (A'BD)) = AF = \\frac{AA' \\cdot AE}{A'E} = \\frac{${h} \\cdot ${ae}}{${de}} = ${frac(h * ae, de)}\\text{ cm}`),
      ),
      verify: () => {
        const P8 = boxPts(b, c, h)
        return close(toLine(P8[4], P8[1], P8[3]), de) && close(toPlane(P8[0], P8[4], P8[1], P8[3]), (h * ae) / de)
      },
    }
  }
}

/** The regular hexagonal prism: total area, and the shortest closed path A–M–N–D' over three lateral faces. (Test p. 91, 3.4) */
export function hexPrismPath(rng: Rng): Made {
  const a = int(rng, 2, 20), h = int(rng, 2, 30)
  const at = exactTex(addExact(exact(6 * a * h, 1), exact(3 * a * a, 1, 3)))
  const [k1, m1] = rootParts(9 * a * a + h * h), [k2, m2] = rootParts(4 * a * a + h * h)
  const per = exactTex(addExact(exact(k1, 1, m1), exact(k2, 1, m2)))
  return {
    text: `Fie prisma hexagonală regulată dreaptă $ABCDEFA'B'C'D'E'F'$ cu $AB = ${a}$ cm și $AA' = ${h}$ cm. a) Calculați aria totală a prismei. b) Aflați poziția punctelor $M \\in (BB')$ și $N \\in (CC')$ pentru care perimetrul patrulaterului $AMND'$ este minim și calculați acest perimetru.`,
    solution: lines(
      `a) $\\mathcal{A}_\\ell = 6 \\cdot \\ell \\cdot h = ${6 * a * h}$ cm², $\\mathcal{A}_b = \\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(3 * a * a, 2, 3)}$ cm², deci $\\mathcal{A}_t = \\mathcal{A}_\\ell + 2\\mathcal{A}_b = ${at}$ cm².`,
      `b) Latura $AD'$ nu depinde de $M$ și $N$: $AD = 2\\ell = ${2 * a}$ cm, $AD' = \\sqrt{${4 * a * a} + ${h * h}} = ${root(4 * a * a + h * h)}$ cm. Desfășurăm fețele $ABB'A'$, $BCC'B'$, $CDD'C'$ în plan: se obține un dreptunghi cu lungimea $3\\ell = ${3 * a}$ cm și lățimea $h = ${h}$ cm. Suma $AM + MN + ND'$ este minimă când punctele $A$, $M$, $N$, $D'$ sunt coliniare în desfășurare, adică pe diagonala dreptunghiului. Din teorema lui Thales:`,
      show(`BM = \\frac{h}{3} = ${frac(h, 3)}\\text{ cm}, \\qquad CN = \\frac{2h}{3} = ${frac(2 * h, 3)}\\text{ cm}`),
      `Atunci $AM + MN + ND' = \\sqrt{(3\\ell)^2 + h^2} = \\sqrt{${9 * a * a} + ${h * h}} = ${root(9 * a * a + h * h)}$ cm, iar perimetrul minim este $${per}$ cm.`,
    ),
    verify: () => {
      const b = polygon(6, a)
      const path = (dm: number) => {
        const M = up(b[1], h / 3 + dm), N = up(b[2], (2 * h) / 3)
        return dist(b[0], M) + dist(M, N) + dist(N, up(b[3], h))
      }
      return close(path(0), Math.sqrt(9 * a * a + h * h)) && path(0.01) > path(0) && path(-0.01) > path(0)
        && close(path(0) + dist(b[0], up(b[3], h)), Math.sqrt(9 * a * a + h * h) + Math.sqrt(4 * a * a + h * h))
    },
  }
}

/** The regular square prism from its lateral area and volume: the diagonal, the rhombus A'MCN. (Test p. 91, 4.3) */
export function squarePrismRhombus(rng: Rng): Made {
  const a = int(rng, 2, 15), h = int(rng, 2, 20)
  const [k, m] = rootParts(4 * a * a + h * h)
  return {
    text: `Prisma patrulateră regulată dreaptă $ABCDA'B'C'D'$ are $\\mathcal{A}_\\ell = ${4 * a * h}$ cm² și $V = ${a * a * h}$ cm³. a) Calculați diagonala prismei. b) Aflați aria și perimetrul patrulaterului $A'MCN$, unde $M$ și $N$ sunt mijloacele muchiilor $[BB']$ și $[DD']$.`,
    solution: lines(
      `$\\frac{V}{\\mathcal{A}_\\ell} = \\frac{\\ell^2 h}{4\\ell h} = \\frac{\\ell}{4}$, deci $\\ell = \\frac{4 \\cdot ${a * a * h}}{${4 * a * h}} = ${a}$ cm și $h = \\frac{${4 * a * h}}{4 \\cdot ${a}} = ${h}$ cm.`,
      `a) $d = \\sqrt{2\\ell^2 + h^2} = \\sqrt{${2 * a * a} + ${h * h}} = ${root(2 * a * a + h * h)}$ cm.`,
      `b) Din triunghiurile dreptunghice $A'B'M$, $MBC$, $CDN$, $ND'A'$ (catete $\\ell$ și $\\frac{h}{2}$): $A'M = MC = CN = NA' = \\sqrt{${a * a} + ${frac(h * h, 4)}} = ${sqrtFrac(4 * a * a + h * h, 4)}$ cm. $MB \\parallel ND$ și $MB = ND$, deci $MBDN$ este paralelogram și $MN = BD = ${a}\\sqrt{2}$ cm. Segmentele $A'C$ și $MN$ au același mijloc (centrul prismei), deci $A'MCN$ este un paralelogram cu laturile egale, adică un romb:`,
      show(`\\mathcal{A}_{A'MCN} = \\frac{A'C \\cdot MN}{2} = \\frac{${root(2 * a * a + h * h)} \\cdot ${a}\\sqrt{2}}{2} = ${sqrtFrac(2 * a * a * (2 * a * a + h * h), 4)}\\text{ cm}^2, \\qquad \\mathcal{P}_{A'MCN} = 4 \\cdot ${sqrtFrac(4 * a * a + h * h, 4)} = ${surd(2 * k, 1, m)}\\text{ cm}`),
    ),
    verify: () => {
      const p = boxPts(a, a, h)
      const [M, N] = [mid(p[1], p[5]), mid(p[3], p[7])]
      return close(dist(p[0], p[6]), Math.sqrt(2 * a * a + h * h)) && close(triArea(p[4], M, p[2]) + triArea(p[4], p[2], N), Math.sqrt((2 * a * a * (2 * a * a + h * h)) / 4))
        && close(4 * dist(p[4], M), 2 * Math.sqrt(4 * a * a + h * h)) && close(dist(p[4], M), dist(M, p[2]))
    },
  }
}

// ======================= pyramids and frustums (test pp. 101–102) =======================

/** The regular hexagonal pyramid from its base area and height: the apothem, d(A, VD), d(M, (VEF)). (Test p. 101, 1.3) */
export function hexPyrDistances(rng: Rng): Made {
  const m = int(rng, 1, 8), h = int(rng, 2, 20)
  return {
    text: `Piramida hexagonală regulată $VABCDEF$ are $\\mathcal{A}_b = ${surd(6 * m * m, 1, 3)}$ cm², înălțimea $h = ${h}$ cm, iar $M$ este mijlocul lui $[BC]$. Aflați: a) apotema piramidei $VM$; b) $d(A, VD)$; c) $d(M, (VEF))$.`,
    solution: lines(
      `Din $\\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(6 * m * m, 1, 3)}$ rezultă $\\ell^2 = ${4 * m * m}$, deci $AB = ${2 * m}$ cm. Fie $O$ centrul bazei.`,
      `a) $OM = \\frac{\\ell\\sqrt{3}}{2} = ${surd(m, 1, 3)}$ cm, deci $VM = \\sqrt{VO^2 + OM^2} = \\sqrt{${h * h} + ${3 * m * m}} = ${root(h * h + 3 * m * m)}$ cm.`,
      `b) $AD = 2\\ell = ${4 * m}$ cm și $VA = VD = \\sqrt{${h * h} + ${4 * m * m}} = ${root(h * h + 4 * m * m)}$ cm. Fie $AK \\perp VD$. Din aria triunghiului $VAD$: $AD \\cdot VO = VD \\cdot AK$, deci`,
      show(`d(A, VD) = AK = \\frac{${4 * m} \\cdot ${h}}{${root(h * h + 4 * m * m)}} = ${sqrtFrac(16 * m * m * h * h, h * h + 4 * m * m)}\\text{ cm}`),
      `c) Fie $N$ mijlocul lui $[EF]$: $M$, $O$, $N$ sunt coliniare și $MN = 2 \\cdot OM = ${surd(2 * m, 1, 3)}$ cm. $EF \\perp MN$ și $EF \\perp VO$, deci $EF \\perp (VMN)$ și $(VEF) \\perp (VMN)$. Perpendiculara $MT$ pe $VN$ este perpendiculară pe $(VEF)$, iar $VN = VM$. Din aria triunghiului $VMN$:`,
      show(`d(M, (VEF)) = MT = \\frac{MN \\cdot VO}{VN} = ${sqrtFrac(12 * m * m * h * h, h * h + 3 * m * m)}\\text{ cm}`),
    ),
    verify: () => {
      const [A, B, C, D, E, F] = polygon(6, 2 * m)
      const V: P = [0, 0, h]
      const M = mid(B, C)
      return close(dist(V, M), Math.sqrt(h * h + 3 * m * m)) && close(toLine(A, V, D), Math.sqrt((16 * m * m * h * h) / (h * h + 4 * m * m)))
        && close(toPlane(M, V, E, F), Math.sqrt((12 * m * m * h * h) / (h * h + 3 * m * m)))
    },
  }
}

/** A regular triangular pyramid cut parallel with the base; the triangle NAC of least area. (Test p. 101, 1.4) */
export function triPyrCutMin(rng: Rng): Made {
  let m = 0, h = 0
  // the foot of the perpendicular from M on VB falls inside [VB] only when the angle MVB is acute: VO² > OM · OB
  do [m, h] = [int(rng, 2, 12), 4 * int(rng, 1, 6)]
  while (3 * h * h <= 2 * m * m)
  const pct = pick(rng, [25, 50, 75])
  const kn = (100 - pct) / 25 // the small pyramid is kn/4 of the whole
  return {
    text: `Piramida triunghiulară regulată $VABC$ are $\\mathcal{A}_b = ${surd(m * m, 1, 3)}$ cm² și $h = ${h}$ cm. Se secționează piramida cu un plan paralel cu baza, la o distanță egală cu ${pct}% din înălțime față de bază. Aflați: a) volumul trunchiului de piramidă format; b) $\\cos(\\angle((NAC), (ABC)))$, unde $N \\in [VB]$ este punctul pentru care aria triunghiului $NAC$ este minimă.`,
    solution: lines(
      `a) $V = \\frac{\\mathcal{A}_b \\cdot h}{3} = ${surd(m * m * h, 3, 3)}$ cm³. Piramida mică are înălțimea de $${frac(kn, 4)}$ din înălțimea piramidei, deci volumul ei este $\\left(${frac(kn, 4)}\\right)^3 V$:`,
      show(`V_{tr} = V\\left(1 - ${frac(kn ** 3, 64)}\\right) = ${surd(m * m * h, 3, 3)} \\cdot ${frac(64 - kn ** 3, 64)} = ${surd(m * m * h * (64 - kn ** 3), 192, 3)}\\text{ cm}^3`),
      `b) Din $\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(m * m, 1, 3)}$ rezultă $AB = ${2 * m}$ cm. Fie $M$ mijlocul lui $[AC]$ și $O$ centrul bazei: $AC \\perp BM$ și $AC \\perp VO$, deci $AC \\perp (VBM)$. Pentru $N \\in VB$, $NM \\perp AC$, așa că $\\mathcal{A}_{NAC} = \\frac{AC \\cdot NM}{2}$ este minimă când $NM$ este minim, adică $NM \\perp VB$. Unghiul planelor $(NAC)$ și $(ABC)$ este $\\angle NMB$.`,
      `În triunghiul $VMB$, $\\angle NMB = 90^\\circ - \\angle VBM$, deci $\\cos(\\angle NMB) = \\sin(\\angle VBO) = \\frac{VO}{VB}$. $OB = \\frac{\\ell\\sqrt{3}}{3} = ${surd(2 * m, 3, 3)}$ cm, $VB = \\sqrt{${h * h} + ${frac(4 * m * m, 3)}} = ${sqrtFrac(3 * h * h + 4 * m * m, 3)}$ cm:`,
      show(`\\cos(\\angle((NAC), (ABC))) = \\frac{VO}{VB} = ${sqrtFrac(3 * h * h, 3 * h * h + 4 * m * m)}`),
    ),
    verify: () => {
      const [A, B, C] = polygon(3, (2 * m) / S3)
      const V: P = [0, 0, h]
      const M = mid(A, C)
      const N = foot(M, V, B)
      const area = (t: number) => triArea(add(V, [t * (B[0] - V[0]), t * (B[1] - V[1]), t * (B[2] - V[2])]), A, C)
      const tn = dist(V, N) / dist(V, B)
      const vol = (triArea(A, B, C) * h) / 3
      return close(cosPP(N, A, C, A, B, C), Math.sqrt((3 * h * h) / (3 * h * h + 4 * m * m))) && tn > 0 && tn < 1
        && area(tn + 0.01) > area(tn) && area(tn - 0.01) > area(tn) && close(vol * (1 - (kn / 4) ** 3), (m * m * h * (64 - kn ** 3) * S3) / 192)
    },
  }
}

const BASE = { 3: 'triunghiulară', 4: 'patrulateră', 6: 'hexagonală' } as const

/** The lateral area of a regular frustum from the sides of its bases and its apothem. (Test p. 101, 2.3) */
export function frustumLateral(rng: Rng): Made {
  const n = pick(rng, [3, 4, 6] as const)
  const l = int(rng, 2, 15), L = int(rng, l + 1, 30), at = int(rng, 2, 25)
  return {
    text: `Completați: aria laterală a unui trunchi de piramidă ${BASE[n]} regulată, având $\\ell = ${l}$ cm, $L = ${L}$ cm și $a_t = ${at}$ cm, este de $\\ldots$ cm².`,
    solution: lines(
      `Fețele laterale sunt ${n} trapeze isoscele congruente, cu bazele $L$ și $\\ell$ și înălțimea $a_t$:`,
      show(`\\mathcal{A}_\\ell = ${n} \\cdot \\frac{(L + \\ell) \\cdot a_t}{2} = ${n} \\cdot \\frac{(${L} + ${l}) \\cdot ${at}}{2} = ${frac(n * (L + l) * at, 2)}\\text{ cm}^2`),
    ),
    verify: () => {
      // one face, by coordinates: the trapezoid with bases L and l and height at
      const T: P[] = [[0, 0, 0], [L, 0, 0], [(L + l) / 2, at, 0], [(L - l) / 2, at, 0]]
      return close(n * (triArea(T[0], T[1], T[2]) + triArea(T[0], T[2], T[3])), (n * (L + l) * at) / 2)
    },
  }
}

/** A regular hexagonal frustum whose faces make 30° with the base: volume, the pyramid, a dihedral angle, a distance. (Test p. 101, 2.4) */
export function hexFrustumAll(rng: Rng): Made {
  const l = int(rng, 2, 20), d = int(rng, 1, 12)
  const L = l + 2 * d
  const atP = exactTex(addExact(exact(3 * L * L, 1), exact(3 * L * L, 2, 3)))
  return {
    text: `Un trunchi de piramidă hexagonală regulată are $L = ${L}$ cm, aria bazei mici $\\mathcal{A}_b = ${surd(3 * l * l, 2, 3)}$ cm² și $a_t = ${2 * d}$ cm. Să se afle: a) volumul trunchiului; b) aria totală a piramidei din care provine trunchiul; c) măsura unghiului diedru format de o față laterală cu planul bazei mici a trunchiului; d) distanța de la centrul bazei mari la o față laterală.`,
    solution: lines(
      `Din $\\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(3 * l * l, 2, 3)}$ rezultă $\\ell = ${l}$ cm. Fie $O$, $O'$ centrele bazelor și $M$, $M'$ mijloacele a două laturi paralele ale lor, $BC$ și $B'C'$. Apotemele bazelor: $OM = \\frac{L\\sqrt{3}}{2} = ${surd(L, 2, 3)}$ cm, $O'M' = \\frac{\\ell\\sqrt{3}}{2} = ${surd(l, 2, 3)}$ cm. În trapezul dreptunghic $OO'M'M$, cu $M'K \\perp OM$: $KM = ${surd(L - l, 2, 3)}$ cm, $MM' = a_t = ${2 * d}$ cm, deci $h = M'K = \\sqrt{${4 * d * d} - ${3 * d * d}} = ${d}$ cm și $\\cos(\\angle M'MK) = \\frac{${surd(d, 1, 3)}}{${2 * d}} = \\frac{\\sqrt{3}}{2}$, adică $m(\\angle M'MK) = 30^\\circ$.`,
      `a) Cu $\\mathcal{A}_B = \\frac{3L^2\\sqrt{3}}{2}$ și $\\mathcal{A}_b = \\frac{3\\ell^2\\sqrt{3}}{2}$:`,
      show(`V = \\frac{h}{3}\\left(\\mathcal{A}_B + \\mathcal{A}_b + \\sqrt{\\mathcal{A}_B \\cdot \\mathcal{A}_b}\\right) = \\frac{h\\sqrt{3}}{2}(L^2 + L\\ell + \\ell^2) = ${surd(d * (L * L + L * l + l * l), 2, 3)}\\text{ cm}^3`),
      `b) Apotema piramidei: $VM = \\frac{OM}{\\cos 30^\\circ} = L = ${L}$ cm, deci $\\mathcal{A}_\\ell = 6 \\cdot \\frac{L \\cdot VM}{2} = ${3 * L * L}$ cm² și $\\mathcal{A}_t = ${atP}$ cm².`,
      `c) Fața laterală face cu planul bazei mari un unghi de $30^\\circ$ ($MM' \\perp BC$, $OM \\perp BC$). Planul bazei mici este paralel cu baza mare, iar unghiul diedru dintre fața laterală și baza mică, în interiorul trunchiului, este $\\angle O'M'M = 180^\\circ - 30^\\circ = 150^\\circ$ (planele lor formează un unghi de $30^\\circ$).`,
      `d) $BC \\perp (VOM)$, deci perpendiculara $OT$ pe $VM$ este perpendiculară pe fața $(BCC')$:`,
      show(`d(O, (BCC')) = OT = OM \\cdot \\sin 30^\\circ = ${surd(L, 4, 3)}\\text{ cm}`),
    ),
    verify: () => {
      const big = polygon(6, L), small = polygon(6, l, d)
      const [M, M1] = [mid(big[1], big[2]), mid(small[1], small[2])]
      const [AB, Ab] = [6 * triArea([0, 0, 0], big[0], big[1]), 6 * triArea([0, 0, d], small[0], small[1])]
      return close(dist(M, M1), 2 * d) && close(cosPP(big[1], big[2], small[2], big[0], big[1], big[2]), S3 / 2)
        && close((d / 3) * (AB + Ab + Math.sqrt(AB * Ab)), (d * (L * L + L * l + l * l) * S3) / 2)
        && close(toPlane([0, 0, 0], big[1], big[2], small[2]), (L * S3) / 4) && close(dist(M, [0, 0, (L * d) / (L - l)]), L)
    },
  }
}

/** A regular triangular frustum: its volume, the pyramid it comes from, the angle of VA with (VBC). (Test p. 102, 3.2) */
export function triFrustumOrigin(rng: Rng): Made {
  for (;;) {
    const U = 2 * int(rng, 2, 20), u = int(rng, 1, U - 1), k = int(rng, 1, 20)
    if ((k * U) % (U - u) !== 0) continue
    const K = (k * U) / (U - u)
    const ap = Math.sqrt(3 * K * K + (U * U) / 4)
    if (!Number.isInteger(ap) || K > 40) continue
    return {
      text: `Fie trunchiul de piramidă triunghiulară regulată $ABCA'B'C'$ care are $AB = ${surd(U, 1, 3)}$ cm, $A'B' = ${surd(u, 1, 3)}$ cm și înălțimea de $${surd(k, 1, 3)}$ cm. a) Desenați trunchiul și aflați volumul. b) Calculați aria laterală a piramidei $VABC$ din care provine trunchiul. c) Calculați $\\sin(\\angle(VA, (VBC)))$.`,
      solution: lines(
        `a) $\\mathcal{A}_B = \\frac{AB^2\\sqrt{3}}{4} = ${surd(3 * U * U, 4, 3)}$ cm², $\\mathcal{A}_b = ${surd(3 * u * u, 4, 3)}$ cm², $\\sqrt{\\mathcal{A}_B \\cdot \\mathcal{A}_b} = ${surd(3 * U * u, 4, 3)}$ cm²:`,
        show(`V = \\frac{h}{3}\\left(\\mathcal{A}_B + \\mathcal{A}_b + \\sqrt{\\mathcal{A}_B \\cdot \\mathcal{A}_b}\\right) = \\frac{${surd(k, 1, 3)}}{3} \\cdot ${surd(3 * (U * U + U * u + u * u), 4, 3)} = ${frac(3 * k * (U * U + U * u + u * u), 4)}\\text{ cm}^3`),
        `b) Fie $O$, $O'$ centrele bazelor. Baza mică este secțiunea piramidei, deci $\\frac{VO'}{VO} = \\frac{A'B'}{AB} = ${frac(u, U)}$ și $\\frac{OO'}{VO} = ${frac(U - u, U)}$: $VO = ${surd(k, 1, 3)} \\cdot ${frac(U, U - u)} = ${surd(K, 1, 3)}$ cm. Fie $M$ mijlocul lui $[BC]$: $OM = \\frac{AB\\sqrt{3}}{6} = ${frac(U, 2)}$ cm, deci apotema $VM = \\sqrt{${3 * K * K} + ${frac(U * U, 4)}} = ${ap}$ cm.`,
        show(`\\mathcal{A}_\\ell = \\frac{3 \\cdot AB \\cdot VM}{2} = \\frac{3 \\cdot ${surd(U, 1, 3)} \\cdot ${ap}}{2} = ${surd(3 * U * ap, 2, 3)}\\text{ cm}^2`),
        `c) $BC \\perp AM$ și $BC \\perp VM$, deci $BC \\perp (VAM)$ și $(VBC) \\perp (VAM)$. Perpendiculara $AT$ pe $VM$ este perpendiculară pe $(VBC)$, iar unghiul cerut este $\\angle AVT$. $AM = \\frac{AB\\sqrt{3}}{2} = ${frac(3 * U, 2)}$ cm, $AT = \\frac{AM \\cdot VO}{VM} = ${surd(3 * U * K, 2 * ap, 3)}$ cm, $OA = \\frac{AB\\sqrt{3}}{3} = ${U}$ cm, $VA = \\sqrt{${3 * K * K} + ${U * U}} = ${root(3 * K * K + U * U)}$ cm:`,
        show(`\\sin(\\angle(VA, (VBC))) = \\frac{AT}{VA} = ${sqrtFrac(27 * U * U * K * K, 4 * ap * ap * (3 * K * K + U * U))}`),
      ),
      verify: () => {
        const [A, B, C] = polygon(3, U)
        const V: P = [0, 0, K * S3]
        const H = k * S3
        const sec = [A, B, C].map((p) => add(p, [(V[0] - p[0]) * (H / V[2]), (V[1] - p[1]) * (H / V[2]), H] as P))
        const [aB, ab] = [triArea(A, B, C), triArea(sec[0], sec[1], sec[2])]
        return close(dist(sec[0], sec[1]), u * S3) && close(dist(A, B), U * S3) && close((H / 3) * (aB + ab + Math.sqrt(aB * ab)), (3 * k * (U * U + U * u + u * u)) / 4)
          && close(triArea(V, A, B) * 3, (3 * U * ap * S3) / 2) && close(sinLP(V, A, V, B, C), Math.sqrt((27 * U * U * K * K) / (4 * ap * ap * (3 * K * K + U * U))))
      },
    }
  }
}

const RATIOS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]] as const

/** A regular hexagonal pyramid with h = c√3: base area, a frustum from a section, the angle of two opposite faces. (Test p. 102, 3.3) */
export function hexPyrCutFaces(rng: Rng): Made {
  const a = int(rng, 2, 16), c = int(rng, 1, 12)
  const [p, q] = pick(rng, RATIOS)
  return {
    text: `Fie piramida hexagonală regulată $VABCDEF$ cu $AB = ${a}$ cm și înălțimea de $${surd(c, 1, 3)}$ cm. a) Desenați piramida și aflați aria bazei. b) Se secționează piramida cu un plan paralel cu baza astfel încât aria secțiunii este de $${surd(3 * a * a * p * p, 2 * q * q, 3)}$ cm². Aflați volumul trunchiului. c) Calculați $\\sin(\\angle((VAB), (VED)))$.`,
    solution: lines(
      `a) $\\mathcal{A}_b = 6 \\cdot \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(3 * a * a, 2, 3)}$ cm².`,
      `b) Secțiunea și baza sunt hexagoane asemenea, cu raportul ariilor $${frac(p * p, q * q)}$, deci raportul de asemănare al piramidei mici cu cea mare este $${frac(p, q)}$ și raportul volumelor $${frac(p ** 3, q ** 3)}$. $V = \\frac{\\mathcal{A}_b \\cdot h}{3} = \\frac{${surd(3 * a * a, 2, 3)} \\cdot ${surd(c, 1, 3)}}{3} = ${frac(3 * a * a * c, 2)}$ cm³:`,
      show(`V_{tr} = V\\left(1 - ${frac(p ** 3, q ** 3)}\\right) = ${frac(3 * a * a * c * (q ** 3 - p ** 3), 2 * q ** 3)}\\text{ cm}^3`),
      `c) $AB \\parallel ED$, deci intersecția planelor $(VAB)$ și $(VED)$ este dreapta $d$ prin $V$, paralelă cu $AB$. Fie $M$, $N$ mijloacele lui $[AB]$ și $[ED]$: $VM \\perp AB$ și $VN \\perp ED$, deci $VM \\perp d$, $VN \\perp d$ și unghiul planelor are sinusul egal cu $\\sin(\\angle MVN)$. $MN = \\ell\\sqrt{3} = ${surd(a, 1, 3)}$ cm, $OM = ${surd(a, 2, 3)}$ cm, $VM = VN = \\sqrt{${3 * c * c} + ${frac(3 * a * a, 4)}} = ${sqrtFrac(12 * c * c + 3 * a * a, 4)}$ cm. Din aria triunghiului $VMN$, $MN \\cdot VO = VM \\cdot VN \\cdot \\sin(\\angle MVN)$:`,
      show(`\\sin(\\angle MVN) = \\frac{MN \\cdot VO}{VM^2} = \\frac{${surd(a, 1, 3)} \\cdot ${surd(c, 1, 3)}}{${frac(12 * c * c + 3 * a * a, 4)}} = ${frac(4 * a * c, 4 * c * c + a * a)}`),
    ),
    verify: () => {
      const [A, B, , D, E] = polygon(6, a)
      const V: P = [0, 0, c * S3]
      const co = cosPP(V, A, B, V, E, D)
      const vol = (6 * triArea([0, 0, 0], A, B) * c * S3) / 3
      return close(Math.sqrt(1 - co * co), (4 * a * c) / (4 * c * c + a * a)) && close(vol * (1 - (p / q) ** 3), (3 * a * a * c * (q ** 3 - p ** 3)) / (2 * q ** 3))
    },
  }
}

/** The regular hexagonal pyramid from its lateral edge and base edge: lateral area, the angle of two adjacent faces. (Test p. 102, 4.3) */
export function hexPyrAdjacentFaces(rng: Rng): Made {
  const a = int(rng, 2, 16), b = int(rng, a + 1, a + 20)
  const q = 4 * b * b - a * a
  return {
    text: `Fie piramida hexagonală regulată $VABCDEF$ cu $VA = ${b}$ cm și $AB = ${a}$ cm. a) Desenați piramida și aflați aria laterală. b) Determinați sinusul unghiului dintre două fețe laterale alăturate.`,
    solution: lines(
      `a) Fie $M$ mijlocul lui $[AB]$: apotema $VM = \\sqrt{VA^2 - AM^2} = \\sqrt{${b * b} - ${frac(a * a, 4)}} = ${sqrtFrac(q, 4)}$ cm.`,
      show(`\\mathcal{A}_\\ell = 6 \\cdot \\frac{AB \\cdot VM}{2} = 3 \\cdot ${a} \\cdot ${sqrtFrac(q, 4)} = ${sqrtFrac(9 * a * a * q, 4)}\\text{ cm}^2`),
      `b) Fețele $(VAB)$ și $(VBC)$ au muchia comună $VB$. Fie $AK \\perp VB$; triunghiurile $VAB$ și $VCB$ sunt congruente, deci și $CK \\perp VB$, $CK = AK$, iar unghiul fețelor este $\\angle AKC$. Din aria triunghiului $VAB$: $AK = \\frac{AB \\cdot VM}{VB} = ${sqrtFrac(a * a * q, 4 * b * b)}$ cm.`,
      `În triunghiul isoscel $AKC$, $AC = \\ell\\sqrt{3} = ${surd(a, 1, 3)}$ cm, iar înălțimea $KS$ ($S$ mijlocul lui $AC$) este $KS = \\sqrt{AK^2 - AS^2} = \\sqrt{${frac(a * a * q, 4 * b * b)} - ${frac(3 * a * a, 4)}} = ${sqrtFrac(a * a * (b * b - a * a), 4 * b * b)}$ cm. Din aria triunghiului $AKC$, $AC \\cdot KS = AK \\cdot KC \\cdot \\sin(\\angle AKC)$:`,
      show(`\\sin(\\angle AKC) = \\frac{AC \\cdot KS}{AK^2} = ${sqrtFrac(12 * b * b * (b * b - a * a), q * q)}`),
    ),
    verify: () => {
      const [A, B, C] = polygon(6, a)
      const V: P = [0, 0, Math.sqrt(b * b - a * a)]
      const co = cosPP(V, A, B, V, B, C)
      return close(dist(V, A), b) && close(6 * triArea(V, A, B), Math.sqrt((9 * a * a * q) / 4)) && close(Math.sqrt(1 - co * co), Math.sqrt((12 * b * b * (b * b - a * a)) / (q * q)))
    },
  }
}

// ======================= round solids (test pp. 109–110) =======================

/** How many times larger the frustum's lateral area is than the small cone's: n, with √(n + 1) whole. */
const TIMES = [[3, 2], [8, 3], [15, 4], [24, 5]] as const
const POSITIONS = [[1, 2], [2, 3], [3, 4], [1, 3]] as const

/** A cone rolled from a sector, cut parallel with the base; where to cut for lateral areas in a given ratio. (Test p. 109, 1.4) */
export function sectorConeCut(rng: Rng): Made {
  const [r, h, G] = rightTriangle(rng, 50)
  const [fn, fd] = pick(rng, POSITIONS) // the plane at fn/fd of the height, from the base
  const [n, s] = pick(rng, TIMES)
  const k = fd - fn // the small cone is k/fd of the cone
  const atNum = r * r * fd * fd + r * r * k * k + r * (fd + k) * fn * G // the frustum's total area, over π·fd²
  return {
    text: `Un sector de cerc cu $R = ${G}$ cm și aria de $${pi(r * G)}$ cm² se înfășoară și formează un con. La $${frac(fn, fd)}$ din înălțime față de bază se duce un plan paralel cu baza. Să se afle: a) volumul conului; b) aria totală a trunchiului de con format; c) la ce distanță de bază trebuie dus un plan paralel cu baza astfel încât aria laterală a trunchiului de con ce se formează să fie de ${n} ori mai mare decât aria laterală a conului mic.`,
    solution: lines(
      `Raza sectorului este generatoarea conului, $G = ${G}$ cm, iar aria sectorului este aria laterală: $\\pi r G = ${pi(r * G)}$, deci $r = ${r}$ cm și $h = \\sqrt{${G * G} - ${r * r}} = ${h}$ cm.`,
      `a) $V = \\frac{\\pi r^2 h}{3} = \\frac{\\pi \\cdot ${r * r} \\cdot ${h}}{3} = ${pi(r * r * h, 3)}$ cm³.`,
      `b) Conul mic are înălțimea de $${frac(k, fd)}$ din înălțimea conului, deci raza $r' = ${frac(r * k, fd)}$ cm, iar generatoarea trunchiului este $g = ${frac(fn, fd)} \\cdot G = ${frac(G * fn, fd)}$ cm:`,
      show(`\\mathcal{A}_t = \\pi\\left[(R + r')g + R^2 + r'^2\\right] = ${pi(atNum, fd * fd)}\\text{ cm}^2`),
      `c) Dacă conul mic are raportul de asemănare $k$ față de con, aria lui laterală este $k^2 \\mathcal{A}_\\ell$, iar a trunchiului $(1 - k^2)\\mathcal{A}_\\ell$. Din $1 - k^2 = ${n}k^2$ rezultă $k^2 = ${frac(1, n + 1)}$, $k = ${frac(1, s)}$: conul mic are înălțimea $\\frac{h}{${s}} = ${frac(h, s)}$ cm, deci planul se duce la $${frac(h * (s - 1), s)}$ cm de bază.`,
    ),
    verify: () => {
      const kk = k / fd
      const [r1, g] = [kk * r, (fn / fd) * G]
      const ks = 1 / s
      return close(Math.PI * r * G, Math.PI * r * Math.sqrt(r * r + h * h)) && close((r + r1) * g + r * r + r1 * r1, atNum / (fd * fd))
        && close(Math.PI * r * G * (1 - ks * ks), n * Math.PI * r * G * ks * ks)
    },
  }
}

const SPLIT = [[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5], [4, 5]] as const

/** A cone cut so that the lateral areas of the small cone and of the frustum are in a given ratio. (Test p. 109, 2.3) */
export function coneLateralRatio(rng: Rng): Made {
  for (;;) {
    const [r, h, G] = rightTriangle(rng, 50)
    if ((r * r * h) % 3 !== 0) continue
    const [s, t] = pick(rng, SPLIT)
    return {
      text: `Un con circular drept cu $V = ${pi(r * r * h, 3)}$ cm³ se secționează cu un plan paralel cu baza astfel încât raportul dintre aria laterală a conului mic și aria laterală a trunchiului de con format să fie $${frac(s * s, t * t - s * s)}$. a) Aflați volumul trunchiului de con format. b) Dacă înălțimea conului este de ${h} cm, să se afle aria totală a conului.`,
      solution: lines(
        `a) Dacă $k$ este raportul de asemănare al conului mic cu conul, aria laterală a conului mic este $k^2\\mathcal{A}_\\ell$, iar a trunchiului $(1 - k^2)\\mathcal{A}_\\ell$. Din $\\frac{k^2}{1 - k^2} = ${frac(s * s, t * t - s * s)}$ rezultă $k^2 = ${frac(s * s, t * t)}$, $k = ${frac(s, t)}$. Volumul conului mic este $k^3 V$:`,
        show(`V_{tr} = V(1 - k^3) = ${pi(r * r * h, 3)} \\cdot ${frac(t ** 3 - s ** 3, t ** 3)} = ${pi(r * r * h * (t ** 3 - s ** 3), 3 * t ** 3)}\\text{ cm}^3`),
        `b) $\\frac{\\pi r^2 \\cdot ${h}}{3} = ${pi(r * r * h, 3)}$, deci $r^2 = ${r * r}$, $r = ${r}$ cm și $G = \\sqrt{${r * r} + ${h * h}} = ${G}$ cm.`,
        show(`\\mathcal{A}_t = \\pi r(G + r) = \\pi \\cdot ${r} \\cdot ${G + r} = ${pi(r * (G + r))}\\text{ cm}^2`),
      ),
      verify: () => {
        const k = s / t
        return close((k * k) / (1 - k * k), (s * s) / (t * t - s * s)) && close(Math.sqrt(r * r + h * h), G)
          && close(((Math.PI * r * r * h) / 3) * (1 - k ** 3), (Math.PI * r * r * h * (t ** 3 - s ** 3)) / (3 * t ** 3))
      },
    }
  }
}

/** A cone rolled from a semicircle: its volume, and where to cut for lateral areas in a given ratio. (Test p. 110, 4.3) */
export function semicircleConeCut(rng: Rng): Made {
  const G = 2 * int(rng, 1, 30)
  const [n, s] = pick(rng, TIMES)
  return {
    text: `Un semicerc de rază ${G} cm se înfășoară și se obține un con. a) Calculați volumul conului. b) Aflați punctul de pe înălțimea conului prin care se duce o secțiune paralelă cu baza astfel încât aria laterală a trunchiului format să fie de ${n} ori mai mare decât aria laterală a conului mic.`,
    solution: lines(
      `a) Raza semicercului este generatoarea, $G = ${G}$ cm, iar lungimea arcului este lungimea cercului de bază: $\\pi G = 2\\pi r$, deci $r = ${G / 2}$ cm și $h = \\sqrt{${G * G} - ${(G * G) / 4}} = ${surd(G, 2, 3)}$ cm.`,
      show(`V = \\frac{\\pi r^2 h}{3} = \\frac{\\pi \\cdot ${(G * G) / 4} \\cdot ${surd(G, 2, 3)}}{3} = ${withPi(surd(G ** 3, 24, 3))}\\text{ cm}^3`),
      `b) Dacă $k$ este raportul de asemănare al conului mic cu conul, aria laterală a conului mic este $k^2\\mathcal{A}_\\ell$, iar a trunchiului $(1 - k^2)\\mathcal{A}_\\ell$. Din $1 - k^2 = ${n}k^2$ rezultă $k = ${frac(1, s)}$, deci secțiunea trece prin punctul înălțimii aflat la $\\frac{h}{${s}} = ${surd(G, 2 * s, 3)}$ cm de vârf (adică la $${surd(G * (s - 1), 2 * s, 3)}$ cm de bază).`,
    ),
    verify: () => {
      const r = G / 2, h = Math.sqrt(G * G - r * r)
      const k = 1 / s
      return close(Math.PI * G, 2 * Math.PI * r) && close((Math.PI * r * r * h) / 3, (Math.PI * G ** 3 * S3) / 24) && close(1 - k * k, n * k * k) && close(h / s, (G * S3) / (2 * s))
    },
  }
}

/** A frustum of a cone from its volume, height and big radius: lateral area, the development of the cone. (Test p. 109, 2.4) */
export function coneFrustumFromV(rng: Rng): Made {
  const t = int(rng, 1, 6), r = int(rng, 1, 20)
  const [dr, h, G] = rng() < 0.5 ? [3 * t, 4 * t, 5 * t] : [4 * t, 3 * t, 5 * t]
  const R = r + dr
  const Q = R * R + R * r + r * r
  const g0 = frac(G * R, dr)
  return {
    text: `Un trunchi de con circular drept are $V = ${pi(h * Q, 3)}$ cm³, $h = ${h}$ cm și $R = ${R}$ cm. a) Desenați trunchiul de con. b) Aflați aria laterală a trunchiului de con. c) Determinați măsura unghiului sectorului circular obținut prin desfășurarea laterală a conului din care provine trunchiul.`,
    solution: lines(
      'a) Bazele se desenează ca elipse, cea mare jos, unite prin două generatoare; jumătatea din spate a bazei mari, punctat.',
      `b) $V = \\frac{\\pi h}{3}(R^2 + Rr + r^2)$, deci $${R * R} + ${R}r + r^2 = ${Q}$, adică $r^2 + ${R}r - ${Q - R * R} = 0$, $(r - ${r})(r + ${r + R}) = 0$ și $r = ${r}$ cm. Generatoarea: $G = \\sqrt{h^2 + (R - r)^2} = \\sqrt{${h * h} + ${dr * dr}} = ${G}$ cm.`,
      show(`\\mathcal{A}_\\ell = \\pi G(R + r) = \\pi \\cdot ${G} \\cdot ${R + r} = ${pi(G * (R + r))}\\text{ cm}^2`),
      `c) Conul din care provine trunchiul are generatoarea $G_0$ cu $\\frac{G_0 - G}{G_0} = \\frac{r}{R}$, deci $G_0 = \\frac{G \\cdot R}{R - r} = ${g0}$ cm. Lungimea arcului sectorului este lungimea cercului bazei, $2\\pi R$:`,
      show(`u = \\frac{360^\\circ \\cdot R}{G_0} = \\frac{360^\\circ \\cdot ${R}}{${g0}} = ${(360 * dr) / G}^\\circ`),
    ),
    verify: () => close((h / 3) * (R * R + R * r + r * r), (h * Q) / 3) && close(Math.sqrt(h * h + (R - r) ** 2), G) && close((360 * R) / ((G * R) / dr), (360 * dr) / G) && Number.isInteger((360 * dr) / G),
  }
}

/** A cone from its height and volume (or axial section): diameter, development, the frustum cut through the centroid. (Test p. 110, 3.3) */
export function coneCentroidCut(rng: Rng): Made {
  const t = int(rng, 1, 30)
  const [r, h, G] = rng() < 0.5 ? [3 * t, 4 * t, 5 * t] : [4 * t, 3 * t, 5 * t]
  const byV = rng() < 0.5
  const given = byV ? `$V = ${pi(r * r * h, 3)}$ cm³` : `aria secțiunii axiale de ${r * h} cm²`
  return {
    text: `Un con are $h = ${h}$ cm și ${given}. a) Aflați diametrul bazei. b) Aflați măsura unghiului sectorului de cerc ce reprezintă desfășurarea laterală a conului. c) Se secționează conul cu un plan paralel cu baza dus prin centrul de greutate al secțiunii axiale. Aflați aria totală a trunchiului de con obținut.`,
    solution: lines(
      byV
        ? `a) $\\frac{\\pi r^2 \\cdot ${h}}{3} = ${pi(r * r * h, 3)}$, deci $r^2 = ${r * r}$, $r = ${r}$ cm și diametrul este de ${2 * r} cm.`
        : `a) Secțiunea axială este un triunghi isoscel cu baza $2r$ și înălțimea $h$: $\\frac{2r \\cdot ${h}}{2} = ${r * h}$, deci $r = ${r}$ cm și diametrul este de ${2 * r} cm.`,
      `b) $G = \\sqrt{${r * r} + ${h * h}} = ${G}$ cm. Lungimea arcului sectorului este lungimea cercului de bază: $\\frac{\\pi G u}{180^\\circ} = 2\\pi r$, deci $u = \\frac{360^\\circ \\cdot ${r}}{${G}} = ${(360 * r) / G}^\\circ$.`,
      `c) Centrul de greutate al triunghiului isoscel $VAB$ se află pe înălțimea $VO$, la $\\frac{1}{3}$ din ea față de bază, deci conul mic are înălțimea de $\\frac{2}{3}$ din înălțimea conului: raza bazei mici $r' = \\frac{2r}{3} = ${frac(2 * r, 3)}$ cm și generatoarea trunchiului $g = \\frac{G}{3} = ${frac(G, 3)}$ cm.`,
      show(`\\mathcal{A}_t = \\pi\\left[(r + r')g + r^2 + r'^2\\right] = \\pi\\left(${frac(5 * r, 3)} \\cdot ${frac(G, 3)} + ${r * r} + ${frac(4 * r * r, 9)}\\right) = ${pi(13 * r * r + 5 * r * G, 9)}\\text{ cm}^2`),
    ),
    verify: () => {
      const V: P = [0, 0, h], A: P = [-r, 0, 0], B: P = [r, 0, 0]
      const g = [(V[0] + A[0] + B[0]) / 3, (V[1] + A[1] + B[1]) / 3, (V[2] + A[2] + B[2]) / 3]
      const k = (h - g[2]) / h
      const [r1, gg] = [k * r, (1 - k) * G]
      return close(k, 2 / 3) && close((r + r1) * gg + r * r + r1 * r1, (13 * r * r + 5 * r * G) / 9) && Number.isInteger((360 * r) / G)
    },
  }
}

/** A frustum of a cone with the generatrix at 60° and the diagonal of the axial section perpendicular on it. (Test p. 110, 3.4) */
export function coneFrustumPerpDiag(rng: Rng): Made {
  const G = int(rng, 2, 50)
  const byR = rng() < 0.5
  return {
    text: `Fie trunchiul de con cu ${byR ? `raza bazei mari $R = ${G}$ cm` : `$G = ${G}$ cm`}, măsura unghiului dintre generatoare și planul bazei de $60^\\circ$ și diagonala secțiunii axiale perpendiculară pe generatoare. a) Desenați trunchiul și secțiunea axială. b) Aflați volumul trunchiului. c) Determinați volumul sferei circumscrise trunchiului.`,
    solution: lines(
      'a) Secțiunea axială este trapezul isoscel $ABCD$, cu $AB = 2R$ (baza mare), $CD = 2r$ și generatoarele $AD = BC = G$.',
      `b) În triunghiul $ACB$, dreptunghic în $C$, $m(\\angle B) = 60^\\circ$, deci $m(\\angle CAB) = 30^\\circ$ și $AB = 2BC$, adică $2R = 2G$: $${byR ? `G = R = ${G}` : `R = G = ${G}`}$ cm. Proiecția lui $BC$ pe $AB$ are $\\frac{G}{2}$, deci $2r = 2R - G$, $r = ${frac(G, 2)}$ cm, iar $h = G \\sin 60^\\circ = ${surd(G, 2, 3)}$ cm.`,
      show(`V = \\frac{\\pi h}{3}(R^2 + Rr + r^2) = \\frac{\\pi}{3} \\cdot ${surd(G, 2, 3)} \\cdot \\left(${G * G} + ${frac(G * G, 2)} + ${frac(G * G, 4)}\\right) = ${withPi(surd(7 * G ** 3, 24, 3))}\\text{ cm}^3`),
      `c) Fie $O$ mijlocul lui $AB$ (centrul bazei mari): $OA = OB = R = ${G}$ cm, iar $OC = \\frac{AB}{2} = ${G}$ cm (mediana din unghiul drept); la fel $OD = ${G}$ cm. Toate punctele celor două cercuri ale bazelor sunt la ${G} cm de $O$, deci sfera circumscrisă are centrul $O$ și raza de ${G} cm:`,
      show(`V_s = \\frac{4\\pi R^3}{3} = ${pi(4 * G ** 3, 3)}\\text{ cm}^3`),
    ),
    verify: () => {
      const A: P = [-G, 0, 0], B: P = [G, 0, 0], C: P = [G / 2, 0, (G * S3) / 2], D: P = [-G / 2, 0, (G * S3) / 2]
      const h = C[2], r = G / 2
      return close(dot(sub(C, A), sub(C, B)), 0) && close(dist(B, C), G) && close(len(C), G) && close(len(D), G)
        && close(((Math.PI * h) / 3) * (G * G + G * r + r * r), (7 * Math.PI * G ** 3 * S3) / 24)
    },
  }
}

const PROPORTIONAL = [[3, 4], [4, 3], [5, 12], [12, 5], [8, 15], [15, 8]] as const

/** A frustum of a cone with r, h, R proportional to given numbers: its volume, the common vertex of two cones. (Test p. 110, 4.4) */
export function frustumProportional(rng: Rng): Made {
  for (;;) {
    const [dif, b] = pick(rng, PROPORTIONAL)
    const a = int(rng, 1, 8), k = int(rng, 1, 5)
    const c = a + dif
    if (gcd(gcd(a, b), c) > 1) continue
    const g = Math.sqrt(dif * dif + b * b)
    const [r, h, R] = [a * k, b * k, c * k]
    return {
      text: `Un trunchi de con are $r$, $h$ și $R$ direct proporționale cu ${a}, ${b} și ${c}, iar $\\mathcal{A}_\\ell = ${pi((a + c) * g * k * k)}$ cm². a) Aflați volumul trunchiului. b) Să se afle un punct $M$ de pe înălțimea trunchiului astfel încât conurile care au ca baze bazele trunchiului și vârful comun $M$ să aibă generatoarele în prelungire.`,
      solution: lines(
        `a) Fie $r = ${a === 1 ? '' : a}x$, $h = ${b}x$, $R = ${c}x$. Atunci $G = \\sqrt{h^2 + (R - r)^2} = \\sqrt{${b * b}x^2 + ${dif * dif}x^2} = ${g}x$ și $\\mathcal{A}_\\ell = \\pi G(R + r) = ${pi((a + c) * g)} x^2 = ${pi((a + c) * g * k * k)}$, deci $x = ${k}$: $r = ${r}$ cm, $h = ${h}$ cm, $R = ${R}$ cm.`,
        show(`V = \\frac{\\pi h}{3}(R^2 + Rr + r^2) = \\frac{\\pi \\cdot ${h}}{3}(${R * R} + ${R * r} + ${r * r}) = ${pi(h * (R * R + R * r + r * r), 3)}\\text{ cm}^3`),
        `b) În secțiunea axială $ABCD$ ($AB = 2R$ jos, $CD = 2r$ sus, $C$ deasupra lui $B$), generatoarea $MA$ a conului mare trebuie să continue generatoarea $MC$ a conului mic, deci $M$ este pe diagonala $AC$; la fel, pe $BD$. Așadar $M$ este intersecția diagonalelor, care se află pe înălțimea $OO'$. Din $CD \\parallel AB$: $\\frac{MO'}{MO} = \\frac{O'C}{OA} = \\frac{r}{R}$, iar $MO' + MO = h$:`,
        show(`MO' = \\frac{h \\cdot r}{R + r} = ${frac(h * r, R + r)}\\text{ cm}, \\qquad MO = \\frac{h \\cdot R}{R + r} = ${frac(h * R, R + r)}\\text{ cm}`),
        `Punctul $M$ se află pe înălțime, la $${frac(h * r, R + r)}$ cm de baza mică.`,
      ),
      verify: () => {
        const A: P = [-R, 0, 0], C: P = [r, 0, h]
        // where AC meets the axis x = 0
        const t = R / (R + r)
        const M = add(A, [t * (C[0] - A[0]), 0, t * (C[2] - A[2])])
        return Number.isInteger(g) && close(Math.PI * Math.sqrt(h * h + (R - r) ** 2) * (R + r), Math.PI * (a + c) * g * k * k) && close(M[0], 0) && close(h - M[2], (h * r) / (R + r))
      },
    }
  }
}

const geo = (id: string, joins: string, forms: Partial<Record<1 | 2 | 3, Form[]>>): Kind8 =>
  ({ id, label: id, topic: 'Geometrie', joins, forms: { 1: forms[1] ?? [], 2: forms[2] ?? [], 3: forms[3] ?? [] } })

/** All join the kinds of chapter 6; the level by difficulty (the tests have no stars). */
export const KINDS: Kind8[] = [
  geo('g8f-cuboid', 'viii-cuboid', { 1: [cubeQuick, cubeOne, cuboidQuick], 3: [cuboidFromDistance] }),
  geo('g8f-prisms', 'viii-prisms', { 1: [hexPrismQuick], 2: [prismBlanks, squarePrismRhombus], 3: [triPrismAbV, squarePrismSine, hexPrismPath] }),
  geo('g8f-pyramids', 'viii-pyramids', { 3: [hexPyrDistances, hexPyrAdjacentFaces] }),
  geo('g8f-frustums', 'viii-frustums', {
    1: [frustumLateral],
    3: [triPyrCutMin, hexFrustumAll, triFrustumOrigin, hexPyrCutFaces, sectorConeCut, coneLateralRatio, semicircleConeCut, coneFrustumFromV, coneCentroidCut, coneFrustumPerpDiag, frustumProportional],
  }),
]
