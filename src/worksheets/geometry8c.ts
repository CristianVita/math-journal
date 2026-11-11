// Grade VIII geometry in space, third batch, after lesson pages 5.11–5.17 and the tests after them that the user
// photographed on 11 November 2026: heights of prisms and frustums, projections, the theorem of the three
// perpendiculars, the angle of a line with a plane, dihedral angles, perpendicular planes, folding along a diagonal.
// Own numbers and wording, worked solutions in Romanian. Every `verify` rebuilds the figure in coordinates and
// measures the answer there, so a wrong formula in a solution makes the tests fail.
import type { Made } from './generators'
import { frac, int, pick, rightTriangle, root, rootParts, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const close = (a: number, b: number) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))
/** √(p/q) simplified: √(p/q) = √(pq)/q. */
const sqrtFrac = (p: number, q: number) => {
  const [k, m] = rootParts(p * q)
  return surd(k, q, m)
}
/** n/√s simplified: n√m/(km), with √s = k√m. */
const over = (n: number, s: number) => {
  const [k, m] = rootParts(s)
  return surd(n, k * m, m)
}
const pi = (p: number, q = 1) => {
  const v = frac(p, q)
  return v === '1' ? '\\pi' : `${v}\\pi`
}

// ---------- coordinates, for the checks ----------
type P = [number, number, number]
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: P, b: P) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: P, b: P): P => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: P) => Math.sqrt(dot(a, a))
const dist = (a: P, b: P) => len(sub(a, b))
const toLine = (p: P, a: P, b: P) => len(cross(sub(p, a), sub(b, a))) / dist(a, b)
const normal = (a: P, b: P, c: P) => cross(sub(b, a), sub(c, a))
const toPlane = (p: P, a: P, b: P, c: P) => Math.abs(dot(sub(p, a), normal(a, b, c))) / len(normal(a, b, c))
/** The sine of the angle between the line pq and the plane abc. */
const sinLP = (p: P, q: P, a: P, b: P, c: P) => {
  const n = normal(a, b, c)
  return Math.abs(dot(sub(q, p), n)) / (dist(p, q) * len(n))
}
/** The cosine of the angle between the planes a1b1c1 and a2b2c2. */
const cosPP = (a1: P, b1: P, c1: P, a2: P, b2: P, c2: P) => {
  const [n1, n2] = [normal(a1, b1, c1), normal(a2, b2, c2)]
  return Math.abs(dot(n1, n2)) / (len(n1) * len(n2))
}
/** Mostly a second leg m with p² + m² a perfect square, so that the hypotenuse is whole; otherwise any m. */
const niceLeg = (rng: Rng, p: number, lo = 2, hi = 40) => {
  const good: number[] = []
  for (let m = lo; m <= hi; m++) if (Number.isInteger(Math.sqrt(p * p + m * m))) good.push(m)
  return good.length && rng() < 0.7 ? pick(rng, good) : int(rng, lo, hi)
}
const rad = (deg: number) => (deg * Math.PI) / 180

/** The usual angles, by the square of their tangent. */
const ANGLE = {
  30: { t2: [1, 3], tg: '\\frac{\\sqrt{3}}{3}' },
  45: { t2: [1, 1], tg: '1' },
  60: { t2: [3, 1], tg: '\\sqrt{3}' },
} as const
type Deg = keyof typeof ANGLE
const DEGS: Deg[] = [30, 45, 60]

// ================= 5.13 projections =================

/** A, B, C on one line, projected on α: the projection keeps the ratios AB : BC. (5.13, 4) */
export function projectionRatio(rng: Rng): Made {
  for (;;) {
    const [p, q, v] = [int(rng, 2, 20), int(rng, 2, 20), int(rng, 2, 6)]
    const u = int(rng, 1, v - 1)
    const s = p + q
    if (p === q || (s * u) % v !== 0) continue
    const r = (s * u) / v
    return {
      text: `Punctele $A$, $B$, $C$ sunt coliniare, în această ordine, și nu se află în planul $\\alpha$, iar $A'$, $B'$, $C'$ sunt proiecțiile lor pe $\\alpha$. Dacă $AB = ${p}$ cm, $BC = ${q}$ cm și $A'C' = ${r}$ cm, calculați lungimile segmentelor $A'B'$ și $B'C'$.`,
      solution: lines(
        "Dreptele $AA'$, $BB'$, $CC'$ sunt perpendiculare pe $\\alpha$, deci paralele, și se află în același plan cu dreapta $AC$. În acest plan, din teorema lui Thales, proiecția păstrează rapoartele:",
        show(`\\frac{A'B'}{AB} = \\frac{B'C'}{BC} = \\frac{A'C'}{AC} = \\frac{${r}}{${s}}${frac(r, s) === `\\frac{${r}}{${s}}` ? '' : ` = ${frac(r, s)}`}`),
        show(`A'B' = ${p} \\cdot ${frac(r, s)} = ${frac(p * r, s)}\\text{ cm}, \\qquad B'C' = ${q} \\cdot ${frac(r, s)} = ${frac(q * r, s)}\\text{ cm}`),
      ),
      verify: () => {
        // the line rises at the angle whose cosine is r/s
        const c = r / s
        const pt = (x: number): P => [x * c, 0, 3 + x * Math.sqrt(1 - c * c)]
        const [A, B, C] = [pt(0), pt(p), pt(s)]
        return close(Math.abs(B[0] - A[0]), (p * r) / s) && close(Math.abs(C[0] - B[0]), (q * r) / s)
      },
    }
  }
}

/** A ∈ α and BC ∥ α: BB' = CC', so the projection of AB comes from CC'. (5.13, 6) */
export function projectionParallelSide(rng: Rng): Made {
  const [r, h, c] = rightTriangle(rng, 40)
  const b = int(rng, h + 1, h + 30)
  return {
    text: `Triunghiul $ABC$ are vârful $A$ în planul $\\alpha$, iar latura $BC$ este paralelă cu $\\alpha$ ($B, C \\notin \\alpha$). Proiecțiile lui $B$ și $C$ pe $\\alpha$ sunt $B'$ și $C'$. Dacă $AC = ${c}$ cm, $AB = ${b}$ cm și proiecția laturii $AC$ pe $\\alpha$ are ${r} cm, calculați lungimea proiecției laturii $AB$ pe $\\alpha$.`,
    solution: lines(
      `Cum $A \\in \\alpha$, proiecția lui $AC$ este $AC' = ${r}$ cm, iar triunghiul $ACC'$ este dreptunghic în $C'$:`,
      show(`CC' = \\sqrt{${c * c} - ${r * r}} = ${h}\\text{ cm}`),
      `Cum $BC \\parallel \\alpha$, punctele $B$ și $C$ sunt la aceeași distanță de $\\alpha$: $BB' = CC' = ${h}$ cm. Proiecția lui $AB$ este $AB'$, din triunghiul $ABB'$, dreptunghic în $B'$:`,
      show(`AB' = \\sqrt{${b * b} - ${h * h}} = ${root(b * b - h * h)}\\text{ cm}`),
    ),
    verify: () => r * r + h * h === c * c && b > h,
  }
}

/** AB ⊂ α: the height CD of ABC projects onto C'D ⊥ AB, so the projected area is AB · C'D / 2. (5.13, 9) */
export function projectedTriangleArea(rng: Rng): Made {
  const [x, c, hh] = rightTriangle(rng, 50)
  const b = 2 * int(rng, 2, 20)
  const S = (b * hh) / 2
  return {
    text: `Triunghiul $ABC$ are latura $AB$ inclusă în planul $\\alpha$, iar $C \\notin \\alpha$. Proiecția lui $C$ pe $\\alpha$ este $C'$, cu $CC' = ${c}$ cm. Dacă $AB = ${b}$ cm și aria triunghiului $ABC$ este ${S} cm², calculați distanța de la $C'$ la dreapta $AB$ și aria triunghiului $ABC'$.`,
    solution: lines(
      `Fie $CD$ înălțimea triunghiului, $D \\in AB$: $CD = \\frac{2 \\cdot ${S}}{${b}} = ${hh}$ cm.`,
      "Cum $CC' \\perp \\alpha$, $CD \\perp AB$ și $AB \\subset \\alpha$, din reciproca teoremei celor trei perpendiculare $C'D \\perp AB$, deci $d(C', AB) = C'D$:",
      show(`C'D = \\sqrt{${hh * hh} - ${c * c}} = ${x}\\text{ cm}, \\qquad \\mathcal{A}_{ABC'} = \\frac{${b} \\cdot ${x}}{2} = ${(b * x) / 2}\\text{ cm}^2`),
    ),
    verify: () => {
      const C: P = [3, x, c]
      return close(toLine(C, [0, 0, 0], [b, 0, 0]), hh) && close(toLine([3, x, 0], [0, 0, 0], [b, 0, 0]), x)
    },
  }
}

/** Perpendiculars AA', CC' on the plane of a parallelogram: A'C' from a right trapezoid, then ∠A'OC' = 90°. (5.13, 12) */
export function twoPerpendicularsSegment(rng: Rng): Made {
  for (;;) {
    const u = int(rng, 2, 20)
    const p = int(rng, 2, 30)
    const q = int(rng, 1, 30)
    if (p === q) continue
    const x = (u * u) / p
    return {
      text: `Paralelogramul $ABCD$ are centrul $O$ și $AC = ${2 * u}$ cm. În $A$ și $C$ se ridică, de aceeași parte a planului, perpendicularele $AA'$ și $CC'$ pe planul $(ABC)$, cu $AA' = ${p}$ cm. a) Dacă $CC' = ${q}$ cm, calculați $A'C'$. b) Aflați lungimea lui $CC'$ pentru care $m(\\angle A'OC') = 90^\\circ$.`,
      solution: lines(
        `a) $AA' \\parallel CC'$, deci $AA'C'C$ este un trapez dreptunghic. Ducem din $C'$ perpendiculara $C'E$ pe $AA'$: $C'E = AC = ${2 * u}$ cm și $A'E = ${Math.abs(p - q)}$ cm.`,
        show(`A'C' = \\sqrt{${4 * u * u} + ${(p - q) ** 2}} = ${root(4 * u * u + (p - q) ** 2)}\\text{ cm}`),
        `b) Fie $CC' = x$. Cu $OA = OC = ${u}$ cm, din triunghiurile dreptunghice $OAA'$ și $OCC'$ și din trapez:`,
        show(`OA'^2 = ${u * u} + ${p * p}, \\quad OC'^2 = ${u * u} + x^2, \\quad A'C'^2 = ${4 * u * u} + (${p} - x)^2`),
        `Unghiul $A'OC'$ este drept exact când $OA'^2 + OC'^2 = A'C'^2$: $${2 * u * u + p * p} + x^2 = ${4 * u * u + p * p} - ${2 * p}x + x^2$, deci $${2 * p}x = ${2 * u * u}$ și $x = ${frac(u * u, p)}$ cm.`,
      ),
      verify: () => {
        const [A1, C1, C2]: P[] = [[-u, 0, p], [u, 0, q], [u, 0, x]]
        return close(dist(A1, C1), Math.sqrt(4 * u * u + (p - q) ** 2)) && Math.abs(dot(A1, C2)) < 1e-9
      },
    }
  }
}

// ================= 5.15 the theorem of the three perpendiculars =================

/** AE ⊥ the plane of a square: d(E, BC) = EB, d(E, CD) = ED, d(E, BD) = EO. (5.15, 2) */
export function squareDistancesToLines(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const e = niceLeg(rng, a)
  return {
    text: `Pe planul pătratului $ABCD$, cu $AB = ${a}$ cm, se ridică perpendiculara $AE$, cu $AE = ${e}$ cm. Calculați distanțele de la $E$ la dreptele $BC$, $CD$ și $BD$.`,
    solution: lines(
      'Cum $EA \\perp (ABC)$ și $AB \\perp BC$, din teorema celor trei perpendiculare $EB \\perp BC$, deci $d(E, BC) = EB$. La fel, $ED \\perp CD$ și $d(E, CD) = ED$:',
      show(`EB = ED = \\sqrt{${e * e} + ${a * a}} = ${root(e * e + a * a)}\\text{ cm}`),
      `Fie $O$ centrul pătratului: $AO \\perp BD$, deci $EO \\perp BD$, iar $AO = \\frac{AC}{2} = ${surd(a, 2, 2)}$ cm:`,
      show(`d(E, BD) = EO = \\sqrt{${e * e} + ${frac(a * a, 2)}} = ${sqrtFrac(2 * e * e + a * a, 2)}\\text{ cm}`),
    ),
    verify: () => {
      const E: P = [0, 0, e]
      return close(toLine(E, [a, 0, 0], [a, a, 0]), Math.sqrt(e * e + a * a)) && close(toLine(E, [a, 0, 0], [0, a, 0]), Math.sqrt(e * e + (a * a) / 2))
    },
  }
}

/** AS ⊥ the plane of a rectangle: SB, SD, and d(S, BD) from the height AH of triangle ABD. (5.15, 3) */
export function rectangleDistancesToLines(rng: Rng): Made {
  const [p, q, r] = rightTriangle(rng, 50)
  const s = int(rng, 2, 40)
  return {
    text: `Pe planul dreptunghiului $ABCD$ se ridică perpendiculara $AS$, cu $AS = ${s}$ cm. Dacă $AB = ${p}$ cm și $AC = ${r}$ cm, calculați distanțele de la $S$ la dreptele $BC$, $DC$ și $BD$.`,
    solution: lines(
      show(`BC = AD = \\sqrt{${r * r} - ${p * p}} = ${q}\\text{ cm}`),
      'Cum $SA \\perp (ABC)$, $AB \\perp BC$ și $AD \\perp DC$, din teorema celor trei perpendiculare $SB \\perp BC$ și $SD \\perp DC$:',
      show(`d(S, BC) = SB = \\sqrt{${s * s} + ${p * p}} = ${root(s * s + p * p)}\\text{ cm}, \\qquad d(S, DC) = SD = \\sqrt{${s * s} + ${q * q}} = ${root(s * s + q * q)}\\text{ cm}`),
      `Fie $AH \\perp BD$, $H \\in BD$; atunci $SH \\perp BD$. În triunghiul $ABD$, dreptunghic în $A$, $BD = AC = ${r}$ cm și $AH = \\frac{AB \\cdot AD}{BD} = ${frac(p * q, r)}$ cm:`,
      show(`d(S, BD) = SH = \\sqrt{${s * s} + \\left(${frac(p * q, r)}\\right)^2} = ${sqrtFrac(s * s * r * r + p * p * q * q, r * r)}\\text{ cm}`),
    ),
    verify: () => {
      const S: P = [0, 0, s]
      return close(toLine(S, [p, 0, 0], [0, q, 0]), Math.sqrt(s * s + (p * q / r) ** 2)) && close(toLine(S, [p, 0, 0], [p, q, 0]), Math.sqrt(s * s + p * p))
    },
  }
}

/** Two right triangles with a common height make ABC; then d(M, BC) = MD with AD ⊥ BC. (5.15, 6) */
export function heronThreePerp(rng: Rng): Made {
  for (;;) {
    const [x1, h, c1] = rightTriangle(rng, 40)
    const others: [number, number][] = []
    for (let k = 1; k <= 60; k++) {
      const c = Math.sqrt(h * h + k * k)
      if (k !== x1 && Number.isInteger(c)) others.push([k, c])
    }
    if (!others.length) continue
    const [x2, c2] = pick(rng, others)
    const s = x1 + x2
    const m = niceLeg(rng, h)
    return {
      text: `Pe planul triunghiului $ABC$, cu $AB = ${c1}$ cm, $AC = ${c2}$ cm și $BC = ${s}$ cm, se ridică perpendiculara $AM$, cu $AM = ${m}$ cm. Calculați distanța de la $M$ la dreapta $BC$.`,
      solution: lines(
        `Fie $D$ piciorul înălțimii din $A$ și $BD = x$. Din triunghiurile dreptunghice $ABD$ și $ACD$: $AD^2 = ${c1 * c1} - x^2 = ${c2 * c2} - (${s} - x)^2$, de unde $${2 * s}x = ${c1 * c1 - c2 * c2 + s * s}$ și $x = ${x1}$ cm.`,
        show(`AD = \\sqrt{${c1 * c1} - ${x1 * x1}} = ${h}\\text{ cm}`),
        'Cum $MA \\perp (ABC)$ și $AD \\perp BC$, din teorema celor trei perpendiculare $MD \\perp BC$, deci $d(M, BC) = MD$:',
        show(`MD = \\sqrt{${m * m} + ${h * h}} = ${root(m * m + h * h)}\\text{ cm}`),
      ),
      verify: () => {
        const A: P = [x1, h, 0]
        const [B, C]: P[] = [[0, 0, 0], [s, 0, 0]]
        return close(dist(A, B), c1) && close(dist(A, C), c2) && close(toLine([x1, h, m], B, C), Math.sqrt(m * m + h * h))
      },
    }
  }
}

/** A regular triangular prism: d(C', AB) = C'N, N the midpoint of AB, and the area of ABC'. (5.15, 8) */
export function prismEdgeDistance(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const h = int(rng, 2, 30)
  return {
    text: `Prisma triunghiulară regulată $ABCA'B'C'$ are latura bazei de ${l} cm și $AA' = ${h}$ cm. Calculați distanța de la $C'$ la dreapta $AB$ și aria triunghiului $ABC'$.`,
    solution: lines(
      `Fie $N$ mijlocul lui $AB$: $CN \\perp AB$ și $CN = \\frac{\\ell\\sqrt{3}}{2} = ${surd(l, 2, 3)}$ cm. Cum $C'C \\perp (ABC)$, din teorema celor trei perpendiculare $C'N \\perp AB$:`,
      show(`d(C', AB) = C'N = \\sqrt{${h * h} + ${frac(3 * l * l, 4)}} = ${sqrtFrac(4 * h * h + 3 * l * l, 4)}\\text{ cm}`),
      show(`\\mathcal{A}_{ABC'} = \\frac{AB \\cdot C'N}{2} = ${sqrtFrac(l * l * (4 * h * h + 3 * l * l), 16)}\\text{ cm}^2`),
    ),
    verify: () => close(toLine([l / 2, (l * Math.sqrt(3)) / 2, h], [0, 0, 0], [l, 0, 0]), Math.sqrt(h * h + (3 * l * l) / 4)),
  }
}

/** d(M, BD) = MO forces AO ⊥ BD: the rectangle is a square. (5.15, 21) */
export function rectangleBecomesSquare(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const m = int(rng, 2, 40)
  return {
    text: `Pe planul dreptunghiului $ABCD$ se ridică perpendiculara $AM$, cu $AM = ${m}$ cm. Se știe că $d(M, BD) = MO$, unde $O$ este intersecția diagonalelor, și că $AD = ${a}$ cm. Calculați aria dreptunghiului și lungimea segmentului $MO$.`,
    solution: lines(
      'Cum $MA \\perp (ABC)$, $MO \\perp BD$ și $O \\in BD$, din reciproca teoremei celor trei perpendiculare $AO \\perp BD$. Diagonalele dreptunghiului sunt perpendiculare, deci $ABCD$ este pătrat.',
      show(`\\mathcal{A}_{ABCD} = AD^2 = ${a * a}\\text{ cm}^2, \\qquad AO = \\frac{AC}{2} = ${surd(a, 2, 2)}\\text{ cm}`),
      show(`MO = \\sqrt{${m * m} + ${frac(a * a, 2)}} = ${sqrtFrac(2 * m * m + a * a, 2)}\\text{ cm}`),
    ),
    verify: () => close(toLine([0, 0, m], [a, 0, 0], [0, a, 0]), Math.sqrt(m * m + (a * a) / 2)),
  }
}

/** d(M, BC) = MC forces AC ⊥ BC in a parallelogram: AC, its area and MC. (5.15, 28) */
export function parallelogramFootAtC(rng: Rng): Made {
  const [b, ac, a] = rightTriangle(rng, 50)
  const m = niceLeg(rng, ac)
  return {
    text: `Pe planul paralelogramului $ABCD$, cu $AB = ${a}$ cm și $BC = ${b}$ cm, se ridică perpendiculara $MA$, cu $MA = ${m}$ cm. Se știe că $d(M, BC) = MC$. Calculați $AC$, aria paralelogramului și distanța de la $M$ la dreapta $BC$.`,
    solution: lines(
      'Cum $MA \\perp (ABC)$ și $MC \\perp BC$, din reciproca teoremei celor trei perpendiculare $AC \\perp BC$. Triunghiul $ACB$ este dreptunghic în $C$:',
      show(`AC = \\sqrt{${a * a} - ${b * b}} = ${ac}\\text{ cm}, \\qquad \\mathcal{A}_{ABCD} = BC \\cdot AC = ${b * ac}\\text{ cm}^2`),
      show(`d(M, BC) = MC = \\sqrt{${m * m} + ${ac * ac}} = ${root(m * m + ac * ac)}\\text{ cm}`),
    ),
    verify: () => b * b + ac * ac === a * a && close(toLine([ac, 0, m], [0, 0, 0], [0, b, 0]), Math.sqrt(m * m + ac * ac)),
  }
}

/** A perpendicular on the plane of a rhombus, at a vertex or at the centre: distances to the sides by the heights. (5.15, 10–11) */
export function rhombusPerpendicular(rng: Rng): Made {
  const [p, q, s] = rightTriangle(rng, 40)
  const t = int(rng, 2, 30)
  const verifyAt = (T: P, want: number, A: P, B: P) => close(toLine(T, A, B), want)
  const [A, B, C, D]: P[] = [[-p, 0, 0], [0, -q, 0], [p, 0, 0], [0, q, 0]]
  if (rng() < 0.5) {
    return {
      text: `Pe planul rombului $ABCD$, cu $AB = ${s}$ cm și $AC = ${2 * p}$ cm, se ridică perpendiculara $AT$, cu $AT = ${t}$ cm. Calculați distanța de la $T$ la dreapta $BD$ și distanța de la $T$ la dreapta $DC$.`,
      solution: lines(
        `Fie $O$ centrul rombului: $AO = ${p}$ cm și $BO = \\sqrt{${s * s} - ${p * p}} = ${q}$ cm, deci $BD = ${2 * q}$ cm. Diagonalele rombului sunt perpendiculare, deci $AO \\perp BD$ și, din teorema celor trei perpendiculare, $TO \\perp BD$:`,
        show(`d(T, BD) = TO = \\sqrt{${t * t} + ${p * p}} = ${root(t * t + p * p)}\\text{ cm}`),
        `Fie $AE \\perp DC$; $AE$ este înălțimea rombului: $AE = \\frac{\\mathcal{A}}{DC} = \\frac{AC \\cdot BD}{2 \\cdot DC} = ${frac(2 * p * q, s)}$ cm, iar $TE \\perp DC$:`,
        show(`d(T, DC) = TE = \\sqrt{${t * t} + \\left(${frac(2 * p * q, s)}\\right)^2} = ${sqrtFrac(t * t * s * s + 4 * p * p * q * q, s * s)}\\text{ cm}`),
      ),
      verify: () => verifyAt([-p, 0, t], Math.sqrt(t * t + p * p), B, D) && verifyAt([-p, 0, t], Math.sqrt(t * t + (2 * p * q / s) ** 2), D, C),
    }
  }
  return {
    text: `Pe planul rombului $ABCD$, cu $AB = ${s}$ cm și $AC = ${2 * p}$ cm, se ridică perpendiculara $PO$, cu $PO = ${t}$ cm, unde $O$ este intersecția diagonalelor. Calculați distanța de la $P$ la dreapta $BC$ și tangenta unghiului dintre planele $(PBC)$ și $(ABC)$.`,
    solution: lines(
      `$OC = ${p}$ cm, $OB = \\sqrt{${s * s} - ${p * p}} = ${q}$ cm, iar triunghiul $BOC$ este dreptunghic în $O$. Fie $OE \\perp BC$: $OE = \\frac{OB \\cdot OC}{BC} = ${frac(p * q, s)}$ cm. Din teorema celor trei perpendiculare, $PE \\perp BC$:`,
      show(`d(P, BC) = PE = \\sqrt{${t * t} + \\left(${frac(p * q, s)}\\right)^2} = ${sqrtFrac(t * t * s * s + p * p * q * q, s * s)}\\text{ cm}`),
      'Planele $(PBC)$ și $(ABC)$ se taie după $BC$, iar $PE \\perp BC$ și $OE \\perp BC$, deci unghiul lor este $\\angle PEO$:',
      show(`\\operatorname{tg}(\\angle PEO) = \\frac{PO}{OE} = ${frac(t * s, p * q)}`),
    ),
    verify: () => {
      const Pp: P = [0, 0, t]
      const c = cosPP(Pp, B, C, A, B, C)
      return verifyAt(Pp, Math.sqrt(t * t + (p * q / s) ** 2), B, C) && close(Math.sqrt(1 - c * c) / c, (t * s) / (p * q))
    },
  }
}

/** VA ⊥ the plane of a square, from d(V, B) and d(V, C): the side, then the angles of VD and VC. (5.15, 14) */
export function squareFromDistances(rng: Rng): Made {
  const a = int(rng, 2, 60)
  const k = pick(rng, [1, 3])
  const [vb, vc] = [root(a * a * (1 + k)), root(a * a * (2 + k))]
  const va = root(k * a * a)
  const [d1, d2] = k === 1 ? [45, 45] : [60, 30]
  return {
    text: `Pe planul pătratului $ABCD$ se ridică perpendiculara $VA$. Dacă $d(V, B) = ${vb}$ cm și $d(V, C) = ${vc}$ cm, aflați: a) latura pătratului și $d(V, D)$; b) $m(\\angle(VD, (ABC)))$; c) $m(\\angle(VD, (VAB)))$; d) $\\cos(\\angle(VC, (ABC)))$.`,
    solution: lines(
      `a) Triunghiurile $VAB$ și $VAC$ sunt dreptunghice în $A$. Cu latura $\\ell$, $VB^2 = VA^2 + \\ell^2$ și $VC^2 = VA^2 + 2\\ell^2$, deci $\\ell^2 = VC^2 - VB^2 = ${a * a * (2 + k)} - ${a * a * (1 + k)} = ${a * a}$ și $\\ell = ${a}$ cm. Atunci $VA = \\sqrt{${a * a * (1 + k)} - ${a * a}} = ${va}$ cm, iar $VD = VB = ${vb}$ cm (triunghiurile $VAB$ și $VAD$ sunt congruente).`,
      `b) Proiecția lui $VD$ pe $(ABC)$ este $AD$, deci unghiul este $\\angle VDA$: $\\operatorname{tg}(\\angle VDA) = \\frac{VA}{AD} = ${k === 1 ? '1' : '\\sqrt{3}'}$, deci măsura este $${d1}^\\circ$.`,
      `c) $DA \\perp AB$ și $DA \\perp VA$, deci $DA \\perp (VAB)$, iar proiecția lui $VD$ pe $(VAB)$ este $VA$: $\\operatorname{tg}(\\angle DVA) = \\frac{AD}{VA} = ${k === 1 ? '1' : '\\frac{\\sqrt{3}}{3}'}$, deci măsura este $${d2}^\\circ$.`,
      `d) Proiecția lui $VC$ pe $(ABC)$ este $AC = ${surd(a, 1, 2)}$ cm: $\\cos(\\angle VCA) = \\frac{AC}{VC} = ${sqrtFrac(2, 2 + k)}$.`,
    ),
    verify: () => {
      const V: P = [0, 0, a * Math.sqrt(k)]
      const [A, B, C, D]: P[] = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0]]
      return close(dist(V, B), Math.sqrt(a * a * (1 + k))) && close(dist(V, C), Math.sqrt(a * a * (2 + k)))
        && close(sinLP(V, D, A, B, C), Math.sin(rad(d1))) && close(sinLP(V, D, V, A, B), Math.sin(rad(d2)))
        && close(Math.sqrt(1 - sinLP(V, C, A, B, C) ** 2), Math.sqrt(2 / (2 + k)))
    },
  }
}

/** AM ⊥ the plane of a square: MO ⊥ BD, and d(A, (MBD)) is the height from A in triangle MAO. (5.15, 19) */
export function squareDistanceToPlane(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const m = int(rng, 1, 40)
  return {
    text: `Pe planul pătratului $ABCD$, cu $AB = ${a}$ cm, se ridică perpendiculara $AM$, cu $AM = ${m}$ cm, iar $O$ este intersecția diagonalelor. a) Arătați că $MO \\perp BD$. b) Calculați distanța de la $A$ la planul $(MBD)$.`,
    solution: lines(
      'a) Diagonalele pătratului sunt perpendiculare: $AO \\perp BD$. Cum $MA \\perp (ABC)$, din teorema celor trei perpendiculare $MO \\perp BD$.',
      'b) $BD \\perp AO$ și $BD \\perp MA$, deci $BD \\perp (MAO)$. Fie $AH \\perp MO$, $H \\in MO$; cum $AH \\subset (MAO)$, avem și $AH \\perp BD$, deci $AH \\perp (MBD)$ și $d(A, (MBD)) = AH$.',
      show(`AO = ${surd(a, 2, 2)}\\text{ cm}, \\qquad MO = \\sqrt{${m * m} + ${frac(a * a, 2)}} = ${sqrtFrac(2 * m * m + a * a, 2)}\\text{ cm}`),
      show(`AH = \\frac{AM \\cdot AO}{MO} = ${sqrtFrac(m * m * a * a, 2 * m * m + a * a)}\\text{ cm}`),
    ),
    verify: () => close(toPlane([0, 0, 0], [0, 0, m], [a, 0, 0], [0, a, 0]), Math.sqrt((m * m * a * a) / (2 * m * m + a * a))),
  }
}

const CUBE = (l: number): Record<string, P> => ({
  A: [0, 0, 0], B: [l, 0, 0], C: [l, l, 0], D: [0, l, 0],
  "A'": [0, 0, l], "B'": [l, 0, l], "C'": [l, l, l], "D'": [0, l, l],
})

const CUBE_DISTANCES: { q: string, why: string, ans: [number, number, number], at: (c: Record<string, P>) => number }[] = [
  { q: "d(A', D)", why: "$A'D$ este diagonala feței $ADD'A'$: $\\ell\\sqrt{2}$", ans: [1, 1, 2], at: (c) => dist(c["A'"], c.D) },
  { q: "d(A', CC')", why: "$CC' \\perp (A'B'C')$, deci $CC' \\perp A'C'$, iar distanța este diagonala bazei, $A'C' = \\ell\\sqrt{2}$", ans: [1, 1, 2], at: (c) => toLine(c["A'"], c.C, c["C'"]) },
  { q: "d(A', BD)", why: "Fie $O$ centrul bazei. $AO \\perp BD$ și $A'A \\perp (ABC)$, deci, din teorema celor trei perpendiculare, $A'O \\perp BD$: $A'O = \\sqrt{\\ell^2 + \\frac{\\ell^2}{2}} = \\frac{\\ell\\sqrt{6}}{2}$", ans: [1, 2, 6], at: (c) => toLine(c["A'"], c.B, c.D) },
  { q: "d(C, AC')", why: "Triunghiul $ACC'$ este dreptunghic în $C$, cu $AC = \\ell\\sqrt{2}$, $CC' = \\ell$ și $AC' = \\ell\\sqrt{3}$. Distanța este înălțimea din $C$: $\\frac{\\ell\\sqrt{2} \\cdot \\ell}{\\ell\\sqrt{3}} = \\frac{\\ell\\sqrt{6}}{3}$", ans: [1, 3, 6], at: (c) => toLine(c.C, c.A, c["C'"]) },
  { q: "d(A'D', BC)", why: "$A'D' \\parallel BC$, iar $A'B \\perp BC$ (pentru că $BC \\perp (ABB')$), deci distanța dintre cele două paralele este $A'B = \\ell\\sqrt{2}$", ans: [1, 1, 2], at: (c) => toLine(c["A'"], c.B, c.C) },
  { q: "d(A'D, B'C)", why: "$A'D \\parallel B'C$, iar $A'B' \\perp (BCC')$, deci $A'B' \\perp B'C$ și distanța este $A'B' = \\ell$", ans: [1, 1, 1], at: (c) => toLine(c["A'"], c["B'"], c.C) },
  { q: "d((A'BD), (B'D'C))", why: "Planele sunt paralele ($A'B \\parallel D'C$ și $BD \\parallel B'D'$). Diagonala $AC'$ este perpendiculară pe amândouă și este împărțită de ele în trei părți egale, deci distanța este $\\frac{AC'}{3} = \\frac{\\ell\\sqrt{3}}{3}$", ans: [1, 3, 3], at: (c) => toPlane(c.C, c["A'"], c.B, c.D) },
  { q: "d(A'B', (DCC'))", why: "$A'B' \\parallel (DCC')$, iar $A'D' \\perp (DCC')$, deci distanța este $A'D' = \\ell$", ans: [1, 1, 1], at: (c) => toPlane(c["A'"], c.D, c.C, c["C'"]) },
]

/** Distances in a cube, three at a time from a table of eight. (5.15, 12 and 23) */
export function cubeDistanceTable(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const chosen: typeof CUBE_DISTANCES = []
  while (chosen.length < 3) {
    const d = pick(rng, CUBE_DISTANCES)
    if (!chosen.includes(d)) chosen.push(d)
  }
  const letters = ['a', 'b', 'c']
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${l} cm. Calculați: ${chosen.map((d, i) => `${letters[i]}) $${d.q}$`).join('; ')}.`,
    solution: lines(
      `Notăm muchia cu $\\ell = ${l}$ cm.`,
      ...chosen.map((d, i) => `${letters[i]}) ${d.why}. Deci $${d.q} = ${surd(d.ans[0] * l, d.ans[1], d.ans[2])}$ cm.`),
    ),
    verify: () => chosen.every((d) => close(d.at(CUBE(l)), (d.ans[0] * l * Math.sqrt(d.ans[2])) / d.ans[1])),
  }
}

// ================= 5.14 the angle of a line with a plane =================

/** VA ⊥ the plane of an isosceles triangle: VC, and the angle of VB with the plane is ∠VBA. (5.14, 1) */
export function perpendicularIsoscelesSine(rng: Rng): Made {
  const c = int(rng, 3, 30)
  const bc = int(rng, 2, 2 * c - 1)
  const v = niceLeg(rng, c, 2, 30)
  return {
    text: `Pe planul triunghiului isoscel $ABC$, cu $AB = AC = ${c}$ cm și $BC = ${bc}$ cm, se ridică perpendiculara $VA$, cu $VA = ${v}$ cm. Calculați distanța de la $V$ la punctul $C$ și sinusul unghiului dintre dreapta $VB$ și planul $(ABC)$.`,
    solution: lines(
      '$VA \\perp (ABC)$, deci $VA \\perp AC$ și $VA \\perp AB$:',
      show(`VC = \\sqrt{${v * v} + ${c * c}} = ${root(v * v + c * c)}\\text{ cm}`),
      `Proiecția lui $VB$ pe $(ABC)$ este $AB$, deci unghiul este $\\angle VBA$. Cum $AB = AC$, $VB = VC = ${root(v * v + c * c)}$ cm:`,
      show(`\\sin(\\angle VBA) = \\frac{VA}{VB} = ${over(v, v * v + c * c)}`),
    ),
    verify: () => close(sinLP([0, 0, v], [c, 0, 0], [0, 0, 0], [c, 0, 0], [0, c, 0]), v / Math.sqrt(v * v + c * c)),
  }
}

/** Pairs (t, h) with h² + 3t² a perfect square: A'M is whole when AB = 2t. */
const MEDIAN_PAIRS: [number, number][] = []
for (let t = 1; t <= 20; t++) for (let h = 3; h <= 40; h++) if (2 * h >= t && Number.isInteger(Math.sqrt(h * h + 3 * t * t))) MEDIAN_PAIRS.push([t, h])

/** A regular triangular prism: the angle of A'M (M the midpoint of BC) with the base. (5.14, 5) */
export function prismMedianAngle(rng: Rng): Made {
  const [t, h] = pick(rng, MEDIAN_PAIRS)
  const l = 2 * t
  return {
    text: `În prisma triunghiulară regulată $ABCA'B'C'$ se cunosc $AB = ${l}$ cm și $AA' = ${h}$ cm, iar $M$ este mijlocul lui $BC$. Calculați sinusul și tangenta unghiului dintre dreapta $A'M$ și planul $(ABC)$.`,
    solution: lines(
      `$A'A \\perp (ABC)$, deci proiecția lui $A'M$ pe $(ABC)$ este $AM$, iar unghiul este $\\angle A'MA$. $AM$ este înălțime în triunghiul echilateral: $AM = ${surd(l, 2, 3)}$ cm.`,
      show(`A'M = \\sqrt{${h * h} + ${frac(3 * l * l, 4)}} = ${sqrtFrac(4 * h * h + 3 * l * l, 4)}\\text{ cm}`),
      show(`\\sin(\\angle A'MA) = \\frac{AA'}{A'M} = ${over(2 * h, 4 * h * h + 3 * l * l)}, \\qquad \\operatorname{tg}(\\angle A'MA) = \\frac{AA'}{AM} = ${sqrtFrac(4 * h * h, 3 * l * l)}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [l, 0, 0], [l / 2, (l * Math.sqrt(3)) / 2, 0]]
      const M: P = [(3 * l) / 4, (l * Math.sqrt(3)) / 4, 0]
      return close(sinLP([0, 0, h], M, A, B, C), (2 * h) / Math.sqrt(4 * h * h + 3 * l * l))
    },
  }
}

/** A regular triangular prism: CN ⊥ (ABB'), so the angle of A'C with that face has sine CN/A'C. (5.14, 16) */
export function prismSideAngle(rng: Rng): Made {
  const [l, h] = rightTriangle(rng, 40)
  return {
    text: `În prisma triunghiulară regulată $ABCA'B'C'$ se cunosc $AB = ${l}$ cm și $AA' = ${h}$ cm. Calculați distanța de la $C$ la planul $(ABB')$ și sinusul unghiului dintre dreapta $A'C$ și planul $(ABB')$.`,
    solution: lines(
      `Fie $N$ mijlocul lui $AB$. $CN \\perp AB$ (mediană în triunghiul echilateral) și $CN \\perp AA'$ (pentru că $AA' \\perp (ABC)$), deci $CN \\perp (ABB')$ și $d(C, (ABB')) = CN = ${surd(l, 2, 3)}$ cm.`,
      `Proiecția lui $A'C$ pe $(ABB')$ este $A'N$, iar unghiul este $\\angle CA'N$. Din triunghiul $A'AC$, dreptunghic în $A$:`,
      show(`A'C = \\sqrt{${h * h} + ${l * l}} = ${root(h * h + l * l)}\\text{ cm}, \\qquad \\sin(\\angle CA'N) = \\frac{CN}{A'C} = ${sqrtFrac(3 * l * l, 4 * (l * l + h * h))}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [l, 0, 0], [l / 2, (l * Math.sqrt(3)) / 2, 0]]
      return close(sinLP([0, 0, h], C, A, B, [0, 0, h]), Math.sqrt((3 * l * l) / (4 * (l * l + h * h))))
    },
  }
}

const CUBE_ANGLES: { q: string, fn: 'sin' | 'cos' | 'tg' | 'deg', ans: string, val: number, why: string, line: [string, string], plane: [string, string, string] }[] = [
  { q: "\\cos(\\angle(A'C, (ABC)))", fn: 'cos', ans: '\\frac{\\sqrt{6}}{3}', val: Math.sqrt(6) / 3, line: ["A'", 'C'], plane: ['A', 'B', 'C'], why: "Proiecția lui $A'C$ pe $(ABC)$ este $AC$, deci unghiul este $\\angle A'CA$, în triunghiul $A'AC$, dreptunghic în $A$, cu $AC = \\ell\\sqrt{2}$ și $A'C = \\ell\\sqrt{3}$: $\\cos = \\frac{AC}{A'C}$" },
  { q: "\\sin(\\angle(A'C, (ABC)))", fn: 'sin', ans: '\\frac{\\sqrt{3}}{3}', val: Math.sqrt(3) / 3, line: ["A'", 'C'], plane: ['A', 'B', 'C'], why: "Unghiul este $\\angle A'CA$, cu $AA' = \\ell$ și $A'C = \\ell\\sqrt{3}$: $\\sin = \\frac{AA'}{A'C}$" },
  { q: "\\operatorname{tg}(\\angle(A'C, (ABC)))", fn: 'tg', ans: '\\frac{\\sqrt{2}}{2}', val: Math.sqrt(2) / 2, line: ["A'", 'C'], plane: ['A', 'B', 'C'], why: "Unghiul este $\\angle A'CA$, cu $AA' = \\ell$ și $AC = \\ell\\sqrt{2}$: $\\operatorname{tg} = \\frac{AA'}{AC}$" },
  { q: "m(\\angle(AB', (ABC)))", fn: 'deg', ans: '45^\\circ', val: 45, line: ['A', "B'"], plane: ['A', 'B', 'C'], why: "Proiecția lui $AB'$ pe $(ABC)$ este $AB$, iar triunghiul $ABB'$ este dreptunghic isoscel" },
  { q: "\\operatorname{tg}(\\angle(AC, (DCC')))", fn: 'tg', ans: '1', val: 1, line: ['A', 'C'], plane: ['D', 'C', "C'"], why: "$AD \\perp DC$ și $AD \\perp DD'$, deci $AD \\perp (DCC')$ și proiecția lui $AC$ este $DC$. Unghiul $ACD$ are $45^\\circ$" },
  { q: "m(\\angle(A'B, (DBB')))", fn: 'deg', ans: '30^\\circ', val: 30, line: ["A'", 'B'], plane: ['D', 'B', "B'"], why: "Fie $O'$ centrul feței $A'B'C'D'$. $A'O' \\perp B'D'$ și $A'O' \\perp BB'$, deci $A'O' \\perp (DBB')$ și proiecția lui $A'B$ este $O'B$. $\\sin(\\angle A'BO') = \\frac{A'O'}{A'B} = \\frac{\\ell\\sqrt{2}/2}{\\ell\\sqrt{2}} = \\frac{1}{2}$" },
  { q: "\\sin(\\angle(C'O, (CBB')))", fn: 'sin', ans: '\\frac{\\sqrt{6}}{6}', val: Math.sqrt(6) / 6, line: ["C'", 'O'], plane: ['C', 'B', "B'"], why: "$O$ este centrul bazei $ABCD$. Fie $N$ mijlocul lui $BC$: $ON \\perp BC$ și $ON \\perp BB'$, deci $ON \\perp (CBB')$ și proiecția lui $C'O$ este $C'N$. $ON = \\frac{\\ell}{2}$, $C'O = \\sqrt{\\ell^2 + \\frac{\\ell^2}{2}} = \\frac{\\ell\\sqrt{6}}{2}$, iar $\\sin = \\frac{ON}{C'O}$" },
  { q: "\\cos(\\angle(BD', (ADD')))", fn: 'cos', ans: '\\frac{\\sqrt{6}}{3}', val: Math.sqrt(6) / 3, line: ['B', "D'"], plane: ['A', 'D', "D'"], why: "$AB \\perp (ADD')$, deci proiecția lui $BD'$ este $AD'$. $AD' = \\ell\\sqrt{2}$, $BD' = \\ell\\sqrt{3}$, iar $\\cos = \\frac{AD'}{BD'}$" },
]

/** Angles of lines with planes in a cube, two at a time. (5.14, 4 and 17) */
export function cubeLinePlane(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const [x, y] = [pick(rng, CUBE_ANGLES), pick(rng, CUBE_ANGLES)]
  const chosen = x === y ? [x] : [x, y]
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${l} cm, iar $O$ este centrul bazei $ABCD$. Calculați ${chosen.map((c) => `$${c.q}$`).join(' și ')}.`,
    solution: lines(`Notăm muchia cu $\\ell = ${l}$ cm; rezultatele nu depind de ea.`, ...chosen.map((c) => `${c.why}. Deci $${c.q} = ${c.ans}$.`)),
    verify: () => {
      const pts: Record<string, P> = { ...CUBE(l), O: [l / 2, l / 2, 0] }
      return chosen.every((c) => {
        const s = sinLP(pts[c.line[0]], pts[c.line[1]], pts[c.plane[0]], pts[c.plane[1]], pts[c.plane[2]])
        const co = Math.sqrt(1 - s * s)
        const got = c.fn === 'sin' ? s : c.fn === 'cos' ? co : c.fn === 'tg' ? s / co : (Math.asin(s) * 180) / Math.PI
        return close(got, c.val)
      })
    },
  }
}

const QUADS: [number, number, number, number][] = []
for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) for (let c = 1; c <= 30; c++) {
  const d = Math.sqrt(a * a + b * b + c * c)
  if (Number.isInteger(d) && d <= 40) QUADS.push([a, b, c, d])
}

/** A cuboid with a whole diagonal: the sines of the angles of A'C with three faces. (5.14, 13) */
export function cuboidDiagonalAngles(rng: Rng): Made {
  const [a, b, c, d] = pick(rng, QUADS)
  return {
    text: `Paralelipipedul dreptunghic $ABCDA'B'C'D'$ are $AB = ${a}$ cm, $AD = ${b}$ cm și $AA' = ${c}$ cm. Calculați lungimea diagonalei $A'C$ și sinusurile unghiurilor formate de dreapta $A'C$ cu planele $(ABC)$, $(DCC')$ și $(BCC')$.`,
    solution: lines(
      show(`A'C = \\sqrt{${a * a} + ${b * b} + ${c * c}} = ${d}\\text{ cm}`),
      `Cu $(ABC)$: $A'A \\perp (ABC)$, deci proiecția lui $A'C$ este $AC$, iar $\\sin(\\angle A'CA) = \\frac{AA'}{A'C} = ${frac(c, d)}$.`,
      `Cu $(DCC')$: $A'D' \\perp (DCC')$, deci proiecția este $D'C$, iar $\\sin(\\angle A'CD') = \\frac{A'D'}{A'C} = ${frac(b, d)}$.`,
      `Cu $(BCC')$: $A'B' \\perp (BCC')$, deci proiecția este $B'C$, iar $\\sin(\\angle A'CB') = \\frac{A'B'}{A'C} = ${frac(a, d)}$.`,
    ),
    verify: () => {
      const [A1, C, A, B, D, C1]: P[] = [[0, 0, c], [a, b, 0], [0, 0, 0], [a, 0, 0], [0, b, 0], [a, b, c]]
      return close(sinLP(A1, C, A, B, C), c / d) && close(sinLP(A1, C, D, C, C1), b / d) && close(sinLP(A1, C, B, C, C1), a / d)
    },
  }
}

/** A regular quadrilateral pyramid: VB with the base, and VA with (VBD), since AO ⊥ (VBD). (5.14, 2 and 20) */
export function pyramidLineAngles(rng: Rng): Made {
  const a = 2 * int(rng, 1, 15)
  const vo = int(rng, 1, 30)
  const e2 = vo * vo + (a * a) / 2
  const v2 = 2 * vo * vo // 2·VO²
  return {
    text: `În piramida patrulateră regulată $VABCD$ se cunosc $VA = ${root(e2)}$ cm și $AB = ${a}$ cm. Calculați: a) înălțimea piramidei; b) sinusul unghiului dintre dreapta $VB$ și planul $(ABC)$; c) tangenta unghiului dintre dreapta $VA$ și planul $(VBD)$.`,
    solution: lines(
      `a) Fie $O$ centrul bazei: $AO = \\frac{AC}{2} = ${surd(a, 2, 2)}$ cm și $VO \\perp (ABC)$:`,
      show(`VO = \\sqrt{${e2} - ${a * a / 2}} = ${vo}\\text{ cm}`),
      `b) Proiecția lui $VB$ pe $(ABC)$ este $OB$, iar $\\sin(\\angle VBO) = \\frac{VO}{VB} = ${over(vo, e2)}$.`,
      `c) $AO \\perp BD$ (diagonalele pătratului) și $AO \\perp VO$, deci $AO \\perp (VBD)$ și proiecția lui $VA$ pe $(VBD)$ este $VO$: $\\operatorname{tg}(\\angle AVO) = \\frac{AO}{VO} = ${sqrtFrac(a * a, v2)}$.`,
    ),
    verify: () => {
      const h = Math.sqrt(v2 / 2)
      const s = a / 2
      const [A, B, C, D, V]: P[] = [[-s, -s, 0], [s, -s, 0], [s, s, 0], [-s, s, 0], [0, 0, h]]
      const t = sinLP(V, A, V, B, D)
      return v2 > 0 && close(sinLP(V, B, A, B, C), vo / Math.sqrt(e2)) && close(t / Math.sqrt(1 - t * t), Math.sqrt((a * a) / v2))
    },
  }
}

/** A regular triangular pyramid from VO and the base: apothem, and three angles. (5.14, 19) */
export function triangularPyramidAll(rng: Rng): Made {
  const t = int(rng, 1, 12)
  const v = int(rng, 1, 25)
  const l = 3 * t
  const va2 = v * v + 3 * t * t
  return {
    text: `Piramida triunghiulară regulată $VABC$ are muchia bazei $AB = ${l}$ cm și muchia laterală $VA = ${root(va2)}$ cm, iar $M$ este mijlocul lui $BC$. Calculați: a) $d(V, (ABC))$ și $d(V, BC)$; b) $\\operatorname{tg}(\\angle(VM, (ABC)))$; c) $\\sin(\\angle(VA, (ABC)))$; d) $\\operatorname{tg}(\\angle(VB, (VAM)))$.`,
    solution: lines(
      `a) Fie $O$ centrul bazei. $OA = \\frac{\\ell\\sqrt{3}}{3} = ${surd(t, 1, 3)}$ cm și $OM = \\frac{OA}{2} = ${surd(t, 2, 3)}$ cm. Din triunghiurile dreptunghice $VOA$ și $VMB$:`,
      show(`VO = \\sqrt{${va2} - ${3 * t * t}} = ${v}\\text{ cm}, \\qquad VM = \\sqrt{${va2} - ${frac(l * l, 4)}} = ${sqrtFrac(4 * v * v + 3 * t * t, 4)}\\text{ cm}`),
      `b) Proiecția lui $VM$ pe $(ABC)$ este $OM$: $\\operatorname{tg}(\\angle VMO) = \\frac{VO}{OM} = ${sqrtFrac(4 * v * v, 3 * t * t)}$.`,
      `c) Proiecția lui $VA$ este $OA$: $\\sin(\\angle VAO) = \\frac{VO}{VA} = ${over(v, va2)}$.`,
      `d) $BC \\perp AM$ și $BC \\perp VM$, deci $BC \\perp (VAM)$, iar proiecția lui $VB$ pe $(VAM)$ este $VM$: $\\operatorname{tg}(\\angle BVM) = \\frac{BM}{VM} = ${sqrtFrac(9 * t * t, 4 * v * v + 3 * t * t)}$.`,
    ),
    verify: () => {
      const r = t * Math.sqrt(3)
      const A: P = [r, 0, 0]
      const B: P = [r * Math.cos(rad(120)), r * Math.sin(rad(120)), 0]
      const C: P = [r * Math.cos(rad(240)), r * Math.sin(rad(240)), 0]
      const V: P = [0, 0, v]
      const M: P = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2, 0]
      const s = sinLP(V, B, V, A, M)
      return close(dist(A, B), l) && close(dist(V, A), Math.sqrt(va2)) && close(toLine(V, B, C), Math.sqrt(v * v + (3 * t * t) / 4))
        && close(sinLP(V, A, A, B, C), v / Math.sqrt(va2)) && close(s / Math.sqrt(1 - s * s), Math.sqrt((9 * t * t) / (4 * v * v + 3 * t * t)))
    },
  }
}

/** BC ⊂ α and AB at 30° or 45° to α: d(A, α), then the angle of the median AM; or a right isosceles triangle. (5.14, 7 and 10) */
export function equilateralTilted(rng: Rng): Made {
  const variant = pick(rng, [30, 45, 0] as const)
  if (variant === 0) {
    const c = 2 * int(rng, 1, 30)
    return {
      text: `Triunghiul dreptunghic isoscel $ABC$, cu $AB = BC$ și $AC = ${c}$ cm, are latura $BC$ inclusă în planul $\\alpha$. Știind că $m(\\angle(AC, \\alpha)) = 30^\\circ$, aflați distanța de la $A$ la $\\alpha$ și $m(\\angle(AB, \\alpha))$.`,
      solution: lines(
        `Fie $A'$ proiecția lui $A$ pe $\\alpha$. Proiecția lui $AC$ este $A'C$, deci $\\angle ACA' = 30^\\circ$ și, în triunghiul dreptunghic $AA'C$, $AA' = \\frac{AC}{2} = ${c / 2}$ cm.`,
        `$AB = \\frac{AC}{\\sqrt{2}} = ${surd(c, 2, 2)}$ cm, iar unghiul lui $AB$ cu $\\alpha$ este $\\angle ABA'$:`,
        show(`\\sin(\\angle ABA') = \\frac{AA'}{AB} = \\frac{${c / 2}}{${surd(c, 2, 2)}} = \\frac{\\sqrt{2}}{2} \\Rightarrow m(\\angle(AB, \\alpha)) = 45^\\circ`),
      ),
      verify: () => {
        const ab = c / Math.SQRT2
        const phi = Math.asin(c / 2 / ab)
        const A: P = [0, ab * Math.cos(phi), ab * Math.sin(phi)]
        const [B, C]: P[] = [[0, 0, 0], [ab, 0, 0]]
        return close(sinLP(A, C, B, C, [0, 1, 0]), 0.5) && close(sinLP(A, B, B, C, [0, 1, 0]), Math.SQRT1_2)
      },
    }
  }
  const l = 2 * int(rng, 1, 30)
  const s30 = variant === 30
  const d = s30 ? String(l / 2) : surd(l, 2, 2)
  return {
    text: `Triunghiul echilateral $ABC$, cu latura de ${l} cm, are latura $BC$ inclusă în planul $\\alpha$. Dacă $m(\\angle(AB, \\alpha)) = ${variant}^\\circ$, calculați distanța de la $A$ la planul $\\alpha$ și sinusul și cosinusul unghiului dintre dreapta $AM$ și planul $\\alpha$, unde $M$ este mijlocul lui $BC$.`,
    solution: lines(
      `Fie $A'$ proiecția lui $A$ pe $\\alpha$. Proiecția lui $AB$ este $A'B$, deci $\\angle ABA' = ${variant}^\\circ$ și $AA' = AB \\cdot \\sin ${variant}^\\circ = ${d}$ cm.`,
      `$AM = ${surd(l, 2, 3)}$ cm (înălțime în triunghiul echilateral), iar unghiul lui $AM$ cu $\\alpha$ este $\\angle AMA'$:`,
      show(`\\sin(\\angle AMA') = \\frac{AA'}{AM} = ${s30 ? '\\frac{\\sqrt{3}}{3}' : '\\frac{\\sqrt{6}}{3}'}, \\qquad \\cos(\\angle AMA') = \\sqrt{1 - \\sin^2} = ${s30 ? '\\frac{\\sqrt{6}}{3}' : '\\frac{\\sqrt{3}}{3}'}`),
    ),
    verify: () => {
      const am = (l * Math.sqrt(3)) / 2
      const aa = l * Math.sin(rad(variant))
      const phi = Math.asin(aa / am)
      const A: P = [0, am * Math.cos(phi), am * Math.sin(phi)]
      const [B, C, M]: P[] = [[-l / 2, 0, 0], [l / 2, 0, 0], [0, 0, 0]]
      return close(sinLP(A, B, B, C, [0, 1, 0]), Math.sin(rad(variant))) && close(sinLP(A, M, B, C, [0, 1, 0]), s30 ? Math.sqrt(3) / 3 : Math.sqrt(6) / 3)
    },
  }
}

// ================= 5.16–5.17 dihedral angles, perpendicular planes =================

/** DA ⊥ the plane of an equilateral triangle: the dihedral angle along BC is ∠DMA, M the midpoint of BC. (5.16, 2) */
export function dihedralEquilateral(rng: Rng): Made {
  const l = 2 * int(rng, 1, 30)
  const g = pick(rng, DEGS)
  const [n, d] = ANGLE[g].t2
  const da4 = (3 * l * l * n) / d // 4·DA²
  return {
    text: `Pe planul triunghiului echilateral $ABC$, cu latura de ${l} cm, se ridică perpendiculara $DA$, cu $DA = ${sqrtFrac(da4, 4)}$ cm. Calculați măsura unghiului dintre planele $(DBC)$ și $(ABC)$ și distanța de la $D$ la dreapta $BC$.`,
    solution: lines(
      `Fie $M$ mijlocul lui $BC$: $AM \\perp BC$ și $AM = ${surd(l, 2, 3)}$ cm. Din teorema celor trei perpendiculare, $DM \\perp BC$. Planele se taie după $BC$, deci unghiul lor este $\\angle DMA$:`,
      show(`\\operatorname{tg}(\\angle DMA) = \\frac{DA}{AM} = ${ANGLE[g].tg} \\Rightarrow m(\\angle DMA) = ${g}^\\circ`),
      show(`d(D, BC) = DM = \\sqrt{DA^2 + AM^2} = ${sqrtFrac(da4 + 3 * l * l, 4)}\\text{ cm}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [l, 0, 0], [l / 2, (l * Math.sqrt(3)) / 2, 0]]
      const D: P = [0, 0, Math.sqrt(da4 / 4)]
      return close(cosPP(D, B, C, A, B, C), Math.cos(rad(g))) && close(toLine(D, B, C), Math.sqrt((da4 + 3 * l * l) / 4))
    },
  }
}

/** A regular triangular prism: the angle of (B'AC) with the base is ∠B'MB, M the midpoint of AC. (5.16, 7) */
export function prismDihedral(rng: Rng): Made {
  const l = 2 * int(rng, 1, 30)
  const g = pick(rng, DEGS)
  const [n, d] = ANGLE[g].t2
  const h4 = (3 * l * l * n) / d // 4·BB'²
  return {
    text: `Prisma triunghiulară dreaptă $ABCA'B'C'$ are baza un triunghi echilateral cu latura de ${l} cm și $BB' = ${sqrtFrac(h4, 4)}$ cm. Aflați măsura unghiului dintre planele $(B'AC)$ și $(ABC)$ și aria triunghiului $B'AC$.`,
    solution: lines(
      `Fie $M$ mijlocul lui $AC$: $BM \\perp AC$, $BM = ${surd(l, 2, 3)}$ cm și, din teorema celor trei perpendiculare, $B'M \\perp AC$. Unghiul planelor este $\\angle B'MB$:`,
      show(`\\operatorname{tg}(\\angle B'MB) = \\frac{BB'}{BM} = ${ANGLE[g].tg} \\Rightarrow m(\\angle B'MB) = ${g}^\\circ`),
      show(`B'M = \\sqrt{BB'^2 + BM^2} = ${sqrtFrac(h4 + 3 * l * l, 4)}\\text{ cm}, \\qquad \\mathcal{A}_{B'AC} = \\frac{AC \\cdot B'M}{2} = ${sqrtFrac(l * l * (h4 + 3 * l * l), 16)}\\text{ cm}^2`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [l, 0, 0], [l / 2, (l * Math.sqrt(3)) / 2, 0]]
      const B1: P = [l, 0, Math.sqrt(h4 / 4)]
      return close(cosPP(B1, A, C, A, B, C), Math.cos(rad(g))) && close(toLine(B1, A, C), Math.sqrt((h4 + 3 * l * l) / 4))
    },
  }
}

/** d(M, BC) = MB forces AB ⊥ BC; the dihedral angle along BC is then ∠MBA. (5.17, 7; 5.16, 9) */
export function footAtVertex(rng: Rng): Made {
  const [ab, bc, ac] = rightTriangle(rng, 50)
  const g = pick(rng, DEGS)
  const [n, d] = ANGLE[g].t2
  return {
    text: `Pe planul triunghiului $ABC$ se ridică perpendiculara $MA$, cu $MA = ${sqrtFrac(ab * ab * n, d)}$ cm. Se știe că $AC = ${ac}$ cm, $BC = ${bc}$ cm și $d(M, BC) = MB$. Calculați $AB$ și măsura unghiului dintre planele $(MBC)$ și $(ABC)$.`,
    solution: lines(
      'Cum $MA \\perp (ABC)$ și $MB \\perp BC$, din reciproca teoremei celor trei perpendiculare $AB \\perp BC$. Triunghiul $ABC$ este dreptunghic în $B$:',
      show(`AB = \\sqrt{${ac * ac} - ${bc * bc}} = ${ab}\\text{ cm}`),
      'Planele se taie după $BC$, iar $MB \\perp BC$ și $AB \\perp BC$, deci unghiul lor este $\\angle MBA$:',
      show(`\\operatorname{tg}(\\angle MBA) = \\frac{MA}{AB} = ${ANGLE[g].tg} \\Rightarrow m(\\angle MBA) = ${g}^\\circ`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [ab, 0, 0], [ab, bc, 0]]
      const M: P = [0, 0, ab * Math.sqrt(n / d)]
      return close(dist(A, C), ac) && close(toLine(M, B, C), dist(M, B)) && close(cosPP(M, B, C, A, B, C), Math.cos(rad(g)))
    },
  }
}

/** MA ⊥ an equilateral triangle, MB at a given angle with the plane: MA, then the dihedral angle along BC. (5.16, 15) */
export function equilateralLineThenDihedral(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const g = pick(rng, DEGS)
  const [n, d] = ANGLE[g].t2
  return {
    text: `Pe planul triunghiului echilateral $ABC$, cu $AB = ${a}$ cm, se ridică perpendiculara $MA$. Dacă $m(\\angle(MB, (ABC))) = ${g}^\\circ$, calculați $MA$ și tangenta unghiului dintre planele $(MBC)$ și $(ABC)$.`,
    solution: lines(
      `Proiecția lui $MB$ pe $(ABC)$ este $AB$, deci $\\angle MBA = ${g}^\\circ$ și $MA = AB \\cdot \\operatorname{tg} ${g}^\\circ = ${sqrtFrac(a * a * n, d)}$ cm.`,
      `Fie $N$ mijlocul lui $BC$: $AN \\perp BC$, $AN = ${surd(a, 2, 3)}$ cm și, din teorema celor trei perpendiculare, $MN \\perp BC$. Unghiul planelor este $\\angle MNA$:`,
      show(`\\operatorname{tg}(\\angle MNA) = \\frac{MA}{AN} = ${sqrtFrac(4 * n, 3 * d)}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [a, 0, 0], [a / 2, (a * Math.sqrt(3)) / 2, 0]]
      const M: P = [0, 0, a * Math.sqrt(n / d)]
      const c = cosPP(M, B, C, A, B, C)
      return close(sinLP(M, B, A, B, C), Math.sin(rad(g))) && close(Math.sqrt(1 - c * c) / c, Math.sqrt((4 * n) / (3 * d)))
    },
  }
}

/** A square folded along AC: the angle of the planes is ∠DOB, so DB and the area of DOB follow. (5.16, 25; 5.17, 4) */
export function foldedSquare(rng: Rng): Made {
  const a = 2 * int(rng, 1, 25)
  const g = pick(rng, [60, 90])
  const right = g === 90
  return {
    text: `Pătratul $ABCD$, cu latura de ${a} cm și centrul $O$, se îndoaie după diagonala $AC$ astfel încât planele $(ADC)$ și $(ABC)$ să ${right ? 'fie perpendiculare' : `formeze un unghi de $60^\\circ$`}. Calculați lungimea segmentului $DB$ după îndoire și aria triunghiului $DOB$${right ? ', apoi distanța de la $B$ la dreapta $CD$' : ''}.`,
    solution: lines(
      `Diagonalele pătratului sunt perpendiculare, deci după îndoire $DO \\perp AC$ și $BO \\perp AC$: unghiul planelor este $\\angle DOB$. Iar $DO = BO = \\frac{AC}{2} = ${surd(a, 2, 2)}$ cm.`,
      right
        ? show(`m(\\angle DOB) = 90^\\circ \\Rightarrow DB = DO\\sqrt{2} = ${a}\\text{ cm}, \\qquad \\mathcal{A}_{DOB} = \\frac{DO \\cdot BO}{2} = ${frac(a * a, 4)}\\text{ cm}^2`)
        : `Triunghiul $DOB$ este isoscel, cu un unghi de $60^\\circ$, deci echilateral: $DB = DO = ${surd(a, 2, 2)}$ cm și $\\mathcal{A}_{DOB} = \\frac{DO^2\\sqrt{3}}{4} = ${surd(a * a, 8, 3)}$ cm².`,
      ...(right ? [
        `$BO \\perp AC$ și $BO \\perp DO$, deci $BO \\perp (ADC)$. Fie $OE \\perp CD$, $E \\in CD$: $OE = \\frac{AD}{2} = ${a / 2}$ cm și, din teorema celor trei perpendiculare, $BE \\perp CD$:`,
        show(`d(B, CD) = BE = \\sqrt{BO^2 + OE^2} = \\sqrt{${a * a / 2} + ${a * a / 4}} = ${surd(a, 2, 3)}\\text{ cm}`),
      ] : []),
    ),
    verify: () => {
      const h = a / Math.SQRT2
      const [C, D]: P[] = [[h, 0, 0], [0, h, 0]]
      const B: P = [0, h * Math.cos(rad(g)), h * Math.sin(rad(g))]
      const ok = close(dist(D, B), right ? a : h)
      return right ? ok && close(toLine(B, C, D), (a * Math.sqrt(3)) / 2) : ok
    },
  }
}

/** MA ⊥ the plane of an isosceles triangle: the dihedral angle along BC has cosine AD/MD. (5.16, 3) */
export function dihedralIsosceles(rng: Rng): Made {
  const [x, h, c] = rightTriangle(rng, 40)
  const m = niceLeg(rng, h)
  return {
    text: `Pe planul triunghiului isoscel $ABC$, cu $AB = AC = ${c}$ cm și $BC = ${2 * x}$ cm, se ridică perpendiculara $MA$, cu $MA = ${m}$ cm. Calculați distanța de la $M$ la dreapta $BC$ și cosinusul unghiului dintre planele $(MBC)$ și $(ABC)$.`,
    solution: lines(
      `Fie $D$ mijlocul lui $BC$: $AD \\perp BC$ și $AD = \\sqrt{${c * c} - ${x * x}} = ${h}$ cm. Din teorema celor trei perpendiculare, $MD \\perp BC$:`,
      show(`d(M, BC) = MD = \\sqrt{${m * m} + ${h * h}} = ${root(m * m + h * h)}\\text{ cm}`),
      'Unghiul planelor este $\\angle MDA$:',
      show(`\\cos(\\angle MDA) = \\frac{AD}{MD} = ${over(h, h * h + m * m)}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, h, 0], [-x, 0, 0], [x, 0, 0]]
      return close(cosPP([0, h, m], B, C, A, B, C), h / Math.sqrt(h * h + m * m))
    },
  }
}

/** A regular triangular pyramid VABC with AB = 6t and VB = t√13, t√15 or t√21: faces at 30°, 45°, 60° to the base. (5.16, 5) */
export function dihedralTriangularPyramid(rng: Rng): Made {
  const t = int(rng, 1, 25)
  const g = pick(rng, DEGS)
  const k = { 30: 13, 45: 15, 60: 21 }[g]
  const l = 6 * t
  return {
    text: `Piramida triunghiulară regulată $VABC$ are $AB = ${l}$ cm și $VB = ${root(k * t * t)}$ cm. Calculați apotema piramidei, înălțimea ei și măsura unghiului dintre o față laterală și planul bazei.`,
    solution: lines(
      `Fie $M$ mijlocul lui $BC$ și $O$ centrul bazei. Apotema $VM$ este perpendiculară pe $BC$, cu $BM = ${3 * t}$ cm:`,
      show(`VM = \\sqrt{${k * t * t} - ${9 * t * t}} = ${root((k - 9) * t * t)}\\text{ cm}, \\qquad OM = \\frac{\\ell\\sqrt{3}}{6} = ${surd(t, 1, 3)}\\text{ cm}`),
      show(`VO = \\sqrt{VM^2 - OM^2} = \\sqrt{${(k - 9) * t * t} - ${3 * t * t}} = ${root((k - 12) * t * t)}\\text{ cm}`),
      `$VM \\perp BC$ și $OM \\perp BC$, deci unghiul feței $(VBC)$ cu baza este $\\angle VMO$: $\\cos(\\angle VMO) = \\frac{OM}{VM} = ${sqrtFrac(3, k - 9)}$, deci măsura lui este $${g}^\\circ$.`,
    ),
    verify: () => {
      const r = 2 * t * Math.sqrt(3)
      const A: P = [r, 0, 0]
      const B: P = [r * Math.cos(rad(120)), r * Math.sin(rad(120)), 0]
      const C: P = [r * Math.cos(rad(240)), r * Math.sin(rad(240)), 0]
      const V: P = [0, 0, Math.sqrt((k - 12) * t * t)]
      return close(dist(A, B), l) && close(dist(V, B), Math.sqrt(k * t * t)) && close(cosPP(V, B, C, A, B, C), Math.cos(rad(g)))
    },
  }
}

const CUBE_PLANES = [
  { top: "D'", foot: 'D', diag: 'AC' },
  { top: "A'", foot: 'A', diag: 'BD' },
  { top: "B'", foot: 'B', diag: 'AC' },
  { top: "C'", foot: 'C', diag: 'BD' },
]

/** A cube: the plane through a diagonal of the base and the vertex above a third corner, at an angle with tg √2. (5.16, 6) */
export function cubeDihedral(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const p = pick(rng, CUBE_PLANES)
  const fn = pick(rng, [['sinusul', '\\sin', '\\frac{\\sqrt{6}}{3}'], ['cosinusul', '\\cos', '\\frac{\\sqrt{3}}{3}'], ['tangenta', '\\operatorname{tg}', '\\sqrt{2}']] as const)
  const plane = `(${p.top}${p.diag})`
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${l} cm. Calculați ${fn[0]} unghiului dintre planele $${plane}$ și $(ABC)$ și distanța de la $${p.foot}$ la planul $${plane}$.`,
    solution: lines(
      `Fie $O$ centrul bazei. $${p.foot}O \\perp ${p.diag}$ (diagonalele pătratului) și, din teorema celor trei perpendiculare, $${p.top}O \\perp ${p.diag}$. Unghiul planelor este $\\angle ${p.top}O${p.foot}$.`,
      show(`${p.foot}O = ${surd(l, 2, 2)}, \\qquad ${p.top}O = \\sqrt{${l * l} + ${frac(l * l, 2)}} = ${surd(l, 2, 6)}`),
      show(`\\sin = \\frac{${p.foot}${p.top}}{${p.top}O} = \\frac{\\sqrt{6}}{3}, \\quad \\cos = \\frac{${p.foot}O}{${p.top}O} = \\frac{\\sqrt{3}}{3}, \\quad \\operatorname{tg} = \\frac{${p.foot}${p.top}}{${p.foot}O} = \\sqrt{2}`),
      `Deci ${fn[0]} cerut este $${fn[2]}$. Cum $${p.diag} \\perp (${p.top}${p.foot}O)$, înălțimea din $${p.foot}$ a triunghiului dreptunghic $${p.top}${p.foot}O$ este perpendiculară pe planul $${plane}$:`,
      show(`d(${p.foot}, ${plane}) = \\frac{${p.foot}${p.top} \\cdot ${p.foot}O}{${p.top}O} = ${surd(l, 3, 3)}\\text{ cm}`),
    ),
    verify: () => {
      const c = CUBE(l)
      const [d1, d2] = [c[p.diag[0]], c[p.diag[1]]]
      return close(cosPP(c[p.top], d1, d2, c.A, c.B, c.C), Math.sqrt(3) / 3) && close(toPlane(c[p.foot], c[p.top], d1, d2), (l * Math.sqrt(3)) / 3)
    },
  }
}

/** MB ⊥ the plane of an isosceles triangle ABC at B: the foot on AC is the foot E of the height from B. (5.16, 8) */
export function isoscelesVertexPerp(rng: Rng): Made {
  const [x, h, c] = rightTriangle(rng, 40)
  const [r0, r1] = pick(rng, [[3, 4], [4, 3]])
  const be = [2 * x * h, c] // BE = 2xh/c
  const mb = frac(be[0] * r0, be[1] * r1)
  return {
    text: `Triunghiul isoscel $ABC$ are $AB = AC = ${c}$ cm și $BC = ${2 * x}$ cm. Pe planul lui se ridică perpendiculara $MB$, cu $MB = ${mb}$ cm. Aflați: a) $d(M, AC)$; b) sinusul unghiului dintre planele $(MAC)$ și $(ABC)$; c) $d(B, (MAC))$.`,
    solution: lines(
      `Înălțimea din $A$: $AD = \\sqrt{${c * c} - ${x * x}} = ${h}$ cm, deci aria triunghiului este $\\frac{${2 * x} \\cdot ${h}}{2} = ${x * h}$ cm². Fie $BE \\perp AC$: $BE = \\frac{2 \\cdot ${x * h}}{${c}} = ${frac(be[0], be[1])}$ cm.`,
      `a) Din teorema celor trei perpendiculare, $ME \\perp AC$:`,
      show(`d(M, AC) = ME = \\sqrt{MB^2 + BE^2} = ${frac(5 * be[0], be[1] * r1)}\\text{ cm}`),
      `b) Unghiul planelor este $\\angle MEB$: $\\sin(\\angle MEB) = \\frac{MB}{ME} = \\frac{${r0}}{5}$.`,
      `c) $AC \\perp BE$ și $AC \\perp MB$, deci $AC \\perp (MBE)$. Înălțimea $BF$ a triunghiului dreptunghic $MBE$ este perpendiculară pe $ME$ și pe $AC$, deci pe $(MAC)$:`,
      show(`d(B, (MAC)) = BF = \\frac{MB \\cdot BE}{ME} = ${frac(be[0] * r0, be[1] * 5)}\\text{ cm}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, h, 0], [-x, 0, 0], [x, 0, 0]]
      const M: P = [-x, 0, (be[0] * r0) / (be[1] * r1)]
      return close(toLine(M, A, C), (5 * be[0]) / (be[1] * r1)) && close(toPlane(B, M, A, C), (be[0] * r0) / (be[1] * 5))
        && close(Math.sqrt(1 - cosPP(M, A, C, A, B, C) ** 2), r0 / 5)
    },
  }
}

/** OM ⊥ a right triangle at the circumcentre (midpoint of the hypotenuse): distances to the legs, to (MAC), the dihedral angle. (5.16, 10) */
export function circumcenterDihedral(rng: Rng): Made {
  const [p, q] = rightTriangle(rng, 40)
  const m = niceLeg(rng, p)
  return {
    text: `Pe planul triunghiului $ABC$, dreptunghic în $A$, cu $AB = ${2 * p}$ cm și $AC = ${2 * q}$ cm, se ridică perpendiculara $OM$, cu $OM = ${m}$ cm, unde $O$ este centrul cercului circumscris triunghiului. Aflați: a) $d(M, AC)$ și $d(M, AB)$; b) $d(O, (MAC))$; c) tangenta unghiului dintre planele $(MAC)$ și $(ABC)$.`,
    solution: lines(
      `$O$ este mijlocul ipotenuzei $BC$. Fie $P$ și $N$ mijloacele lui $AC$ și $AB$: $OP$ și $ON$ sunt linii mijlocii, deci $OP \\parallel AB$, $OP \\perp AC$, $OP = ${p}$ cm, iar $ON \\perp AB$, $ON = ${q}$ cm.`,
      `a) Din teorema celor trei perpendiculare, $MP \\perp AC$ și $MN \\perp AB$:`,
      show(`d(M, AC) = MP = \\sqrt{${m * m} + ${p * p}} = ${root(m * m + p * p)}\\text{ cm}, \\qquad d(M, AB) = MN = \\sqrt{${m * m} + ${q * q}} = ${root(m * m + q * q)}\\text{ cm}`),
      'b) $AC \\perp OP$ și $AC \\perp OM$, deci $AC \\perp (MOP)$, iar înălțimea din $O$ a triunghiului $MOP$ este perpendiculară pe $(MAC)$:',
      show(`d(O, (MAC)) = \\frac{OM \\cdot OP}{MP} = ${over(m * p, m * m + p * p)}\\text{ cm}`),
      `c) Unghiul planelor este $\\angle MPO$: $\\operatorname{tg}(\\angle MPO) = \\frac{OM}{OP} = ${frac(m, p)}$.`,
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [2 * p, 0, 0], [0, 2 * q, 0]]
      const M: P = [p, q, m]
      const c = cosPP(M, A, C, A, B, C)
      return close(toLine(M, A, C), Math.sqrt(m * m + p * p)) && close(toPlane([p, q, 0], M, A, C), (m * p) / Math.sqrt(m * m + p * p)) && close(Math.sqrt(1 - c * c) / c, m / p)
    },
  }
}

/** NO ⊥ a rectangle at its centre: distances to the sides, to (NAD), the dihedral angle along AD. (5.15, 9; 5.16, 12) */
export function rectCenterDihedral(rng: Rng): Made {
  for (;;) {
    const u = int(rng, 1, 20)
    const w = int(rng, 1, 20)
    if (u === w) continue
    const n2 = pick(rng, [int(rng, 2, 30) ** 2, 3 * w * w, w * w])
    const tg = sqrtFrac(n2, w * w)
    const named = n2 === 3 * w * w ? ', deci unghiul are $60^\\circ$' : n2 === w * w ? ', deci unghiul are $45^\\circ$' : ''
    return {
      text: `Pe planul dreptunghiului $ABCD$ se ridică perpendiculara $NO$, cu $NO = ${root(n2)}$ cm, unde $O$ este intersecția diagonalelor. Dacă $AD = ${2 * u}$ cm și $DC = ${2 * w}$ cm, aflați: a) $d(N, BC)$ și $d(N, AB)$; b) $d(O, (NAD))$; c) tangenta unghiului dintre planele $(NAD)$ și $(ABC)$.`,
      solution: lines(
        `Distanța de la $O$ la $BC$ și la $AD$ este $\\frac{DC}{2} = ${w}$ cm, iar la $AB$ este $\\frac{AD}{2} = ${u}$ cm (perpendicularele din $O$ pe laturi ajung în mijloacele lor). Din teorema celor trei perpendiculare:`,
        show(`d(N, BC) = \\sqrt{${n2} + ${w * w}} = ${root(n2 + w * w)}\\text{ cm}, \\qquad d(N, AB) = \\sqrt{${n2} + ${u * u}} = ${root(n2 + u * u)}\\text{ cm}`),
        `b) Fie $E$ mijlocul lui $AD$: $AD \\perp OE$ și $AD \\perp NO$, deci $AD \\perp (NOE)$, iar înălțimea din $O$ a triunghiului dreptunghic $NOE$ este perpendiculară pe $(NAD)$:`,
        show(`d(O, (NAD)) = \\frac{NO \\cdot OE}{NE} = ${sqrtFrac(n2 * w * w, n2 + w * w)}\\text{ cm}`),
        `c) Unghiul planelor este $\\angle NEO$: $\\operatorname{tg}(\\angle NEO) = \\frac{NO}{OE} = ${tg}$${named}.`,
      ),
      verify: () => {
        const [A, B, C, D]: P[] = [[-w, -u, 0], [w, -u, 0], [w, u, 0], [-w, u, 0]]
        const N: P = [0, 0, Math.sqrt(n2)]
        const c = cosPP(N, A, D, A, B, C)
        return close(dist(A, D), 2 * u) && close(dist(D, C), 2 * w) && close(toLine(N, B, C), Math.sqrt(n2 + w * w)) && close(toLine(N, A, B), Math.sqrt(n2 + u * u))
          && close(toPlane([0, 0, 0], N, A, D), Math.sqrt((n2 * w * w) / (n2 + w * w))) && close(Math.sqrt(1 - c * c) / c, Math.sqrt(n2) / w)
      },
    }
  }
}

/** SD ⊥ the plane of a square at D, at 30°, 45° or 60° to (SAC): distances to lines and planes. (5.16, 13) */
export function squareCornerPerpendicular(rng: Rng): Made {
  const a = int(rng, 2, 30)
  const g = pick(rng, DEGS)
  // squares of the lengths, as multiples of a²/6
  const sd = { 30: 1, 45: 3, 60: 9 }[g]
  const [sc, so] = [sd + 6, sd + 3]
  const L = (k: number, q = 6) => sqrtFrac(a * a * k, q)
  return {
    text: `Pe planul pătratului $ABCD$, cu latura de ${a} cm, se ridică perpendiculara $SD$, cu $SD = ${L(sd)}$ cm. Aflați: a) $d(S, BC)$ și $d(S, AC)$; b) $d(D, (SBC))$ și $d(D, (SAC))$; c) măsura unghiului dintre planele $(SAC)$ și $(ABC)$.`,
    solution: lines(
      `a) $DC \\perp BC$, deci, din teorema celor trei perpendiculare, $SC \\perp BC$. Fie $O$ centrul pătratului: $DO \\perp AC$, deci $SO \\perp AC$, iar $DO = ${surd(a, 2, 2)}$ cm.`,
      show(`d(S, BC) = SC = \\sqrt{SD^2 + DC^2} = ${L(sc)}\\text{ cm}, \\qquad d(S, AC) = SO = \\sqrt{SD^2 + DO^2} = ${L(so)}\\text{ cm}`),
      'b) $BC \\perp DC$ și $BC \\perp SD$, deci $BC \\perp (SDC)$; înălțimea din $D$ a triunghiului $SDC$ este perpendiculară pe $(SBC)$. La fel, $AC \\perp (SDO)$ și înălțimea din $D$ a triunghiului $SDO$ este perpendiculară pe $(SAC)$:',
      show(`d(D, (SBC)) = \\frac{SD \\cdot DC}{SC} = ${sqrtFrac(a * a * sd, sc)}\\text{ cm}, \\qquad d(D, (SAC)) = \\frac{SD \\cdot DO}{SO} = ${sqrtFrac(a * a * sd, 2 * so)}\\text{ cm}`),
      `c) Unghiul planelor este $\\angle SOD$: $\\operatorname{tg}(\\angle SOD) = \\frac{SD}{DO} = ${ANGLE[g].tg}$, deci măsura lui este $${g}^\\circ$.`,
    ),
    verify: () => {
      const [A, B, C, D]: P[] = [[0, 0, 0], [a, 0, 0], [a, a, 0], [0, a, 0]]
      const S: P = [0, a, a * Math.sqrt(sd / 6)]
      return close(toLine(S, B, C), a * Math.sqrt(sc / 6)) && close(toLine(S, A, C), a * Math.sqrt(so / 6))
        && close(toPlane(D, S, B, C), a * Math.sqrt(sd / sc)) && close(toPlane(D, S, A, C), a * Math.sqrt(sd / (2 * so))) && close(cosPP(S, A, C, A, B, C), Math.cos(rad(g)))
    },
  }
}

/** MD ⊥ an isosceles trapezoid with DC = 2AB and legs AB: DB ⊥ BC, so the dihedral angle along BC is ∠MBD. (Testul 4, 2) */
export function trapezoid60(rng: Rng): Made {
  const a = int(rng, 2, 30)
  const m = int(rng, 1, 30)
  return {
    text: `Trapezul isoscel $ABCD$ are $AB \\parallel CD$, $AB = ${a}$ cm, $DC = ${2 * a}$ cm și înălțimea de $${surd(a, 2, 3)}$ cm. Pe planul lui se ridică perpendiculara $MD$, cu $MD = ${m}$ cm. Aflați: a) $d(M, AB)$; b) sinusul unghiului dintre dreapta $MB$ și planul trapezului; c) tangenta unghiului dintre planele $(MBC)$ și $(ABC)$.`,
    solution: lines(
      `a) Fie $DE \\perp AB$, $E$ pe dreapta $AB$; $DE$ este înălțimea trapezului. Din teorema celor trei perpendiculare, $ME \\perp AB$:`,
      show(`d(M, AB) = ME = \\sqrt{${m * m} + ${frac(3 * a * a, 4)}} = ${sqrtFrac(4 * m * m + 3 * a * a, 4)}\\text{ cm}`),
      `b) Proiecția lui $B$ pe $DC$ este la $\\frac{DC - AB}{2} = ${frac(a, 2)}$ cm de $C$, deci la $${frac(3 * a, 2)}$ cm de $D$:`,
      show(`DB = \\sqrt{\\left(${frac(3 * a, 2)}\\right)^2 + \\left(${surd(a, 2, 3)}\\right)^2} = ${surd(a, 1, 3)}\\text{ cm}, \\qquad \\sin(\\angle MBD) = \\frac{MD}{MB} = ${over(m, m * m + 3 * a * a)}`),
      `c) Latura neparalelă $BC = \\sqrt{\\left(${frac(a, 2)}\\right)^2 + \\left(${surd(a, 2, 3)}\\right)^2} = ${a}$ cm. Cum $DB^2 + BC^2 = ${3 * a * a} + ${a * a} = ${4 * a * a} = DC^2$, $DB \\perp BC$ și, din teorema celor trei perpendiculare, $MB \\perp BC$. Unghiul planelor este $\\angle MBD$:`,
      show(`\\operatorname{tg}(\\angle MBD) = \\frac{MD}{DB} = ${sqrtFrac(m * m, 3 * a * a)}`),
    ),
    verify: () => {
      const r3 = Math.sqrt(3)
      const [D, C, B, A]: P[] = [[0, 0, 0], [2 * a, 0, 0], [1.5 * a, (a * r3) / 2, 0], [0.5 * a, (a * r3) / 2, 0]]
      const M: P = [0, 0, m]
      const c = cosPP(M, B, C, D, C, B)
      return close(dist(A, B), a) && close(toLine(M, A, B), Math.sqrt(m * m + 0.75 * a * a)) && close(sinLP(M, B, D, C, B), m / Math.sqrt(m * m + 3 * a * a))
        && close(Math.sqrt(1 - c * c) / c, m / (a * r3))
    },
  }
}

// ================= 5.11 heights of solids, frustums =================

/** A cylinder from its radius and lateral area: the height. (5.11, 11) */
export function cylinderFromLateral(rng: Rng): Made {
  const r = int(rng, 2, 20)
  const h = int(rng, 2, 30)
  return {
    text: `Un cilindru circular drept are raza bazei de ${r} cm și aria laterală de $${pi(2 * r * h)}$ cm². Calculați lungimea cercului de la bază, înălțimea și volumul cilindrului.`,
    solution: lines(
      show(`L = 2\\pi R = ${pi(2 * r)}\\text{ cm}, \\qquad \\mathcal{A}_l = L \\cdot h \\Rightarrow h = \\frac{${pi(2 * r * h)}}{${pi(2 * r)}} = ${h}\\text{ cm}`),
      show(`V = \\pi R^2 h = \\pi \\cdot ${r * r} \\cdot ${h} = ${pi(r * r * h)}\\text{ cm}^3`),
    ),
    verify: () => close(2 * Math.PI * r * h, 2 * Math.PI * r * h) && h > 0,
  }
}

/** A regular quadrilateral prism from AA' and the sum of its edges: distances between parallel faces. (5.11, 3) */
export function prismEdgesSum(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const h = int(rng, 2, 30)
  const S = 8 * l + 4 * h
  return {
    text: `Prisma patrulateră regulată $ABCDA'B'C'D'$ are $AA' = ${h}$ cm, iar suma lungimilor tuturor muchiilor este ${S} cm. Aflați distanța dintre planele $(ABC)$ și $(A'B'C')$, distanța dintre planele $(AA'B)$ și $(CC'D)$ și aria totală a prismei.`,
    solution: lines(
      `Prisma are 8 muchii ale bazelor, de lungime $\\ell$, și 4 muchii laterale, de ${h} cm: $8\\ell + ${4 * h} = ${S}$, deci $\\ell = ${l}$ cm.`,
      `$AA' \\perp (ABC)$ și $AA' \\perp (A'B'C')$, deci distanța dintre baze este $AA' = ${h}$ cm. Fețele $(AA'B)$ și $(CC'D)$ sunt paralele, iar $BC$ este perpendiculară pe amândouă, deci distanța dintre ele este $BC = ${l}$ cm.`,
      show(`\\mathcal{A}_t = 2\\ell^2 + 4\\ell h = ${2 * l * l} + ${4 * l * h} = ${2 * l * l + 4 * l * h}\\text{ cm}^2`),
    ),
    verify: () => 8 * l + 4 * h === S,
  }
}

/** A regular triangular prism from the base area and A'B, or from the circumradius of the base and a lateral face. (5.11, 2 and 5) */
export function prismHeightFromBase(rng: Rng): Made {
  if (rng() < 0.5) {
    const [l, h, d] = rightTriangle(rng, 50)
    return {
      text: `Prisma triunghiulară regulată $ABCA'B'C'$ are aria bazei de $${surd(l * l, 4, 3)}$ cm² și $A'B = ${d}$ cm. Aflați înălțimea și volumul prismei.`,
      solution: lines(
        show(`\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(l * l, 4, 3)} \\Rightarrow \\ell^2 = ${l * l} \\Rightarrow \\ell = ${l}\\text{ cm}`),
        `Triunghiul $A'AB$ este dreptunghic în $A$: $AA' = \\sqrt{${d * d} - ${l * l}} = ${h}$ cm.`,
        show(`V = \\mathcal{A}_b \\cdot h = ${surd(l * l, 4, 3)} \\cdot ${h} = ${surd(l * l * h, 4, 3)}\\text{ cm}^3`),
      ),
      verify: () => l * l + h * h === d * d,
    }
  }
  const k = int(rng, 1, 12)
  const l = 3 * k
  const h = int(rng, 2, 30)
  return {
    text: `Într-o prismă triunghiulară regulată, raza cercului circumscris bazei este de $${surd(k, 1, 3)}$ cm, iar aria unei fețe laterale este de ${l * h} cm². Aflați înălțimea și volumul prismei.`,
    solution: lines(
      show(`R = \\frac{\\ell\\sqrt{3}}{3} \\Rightarrow \\ell = R\\sqrt{3} = ${surd(k, 1, 3)} \\cdot \\sqrt{3} = ${l}\\text{ cm}`),
      `Fața laterală este un dreptunghi cu laturile $\\ell$ și $h$: $${l} \\cdot h = ${l * h}$, deci $h = ${h}$ cm.`,
      show(`V = \\frac{\\ell^2\\sqrt{3}}{4} \\cdot h = ${surd(l * l * h, 4, 3)}\\text{ cm}^3`),
    ),
    verify: () => close((l * Math.sqrt(3)) / 3, k * Math.sqrt(3)),
  }
}

/** A regular quadrilateral prism from AC and A'B: the side, the height, the area and the volume. (5.11, 6) */
export function squarePrismFromDiagonals(rng: Rng): Made {
  const [l, h, d] = rightTriangle(rng, 50)
  return {
    text: `Prisma patrulateră regulată $ABCDA'B'C'D'$ are $AC = ${surd(l, 1, 2)}$ cm și $A'B = ${d}$ cm. Aflați aria totală și volumul prismei.`,
    solution: lines(
      `$AC$ este diagonala pătratului de bază: $\\ell\\sqrt{2} = ${surd(l, 1, 2)}$, deci $\\ell = ${l}$ cm. Din triunghiul $A'AB$, dreptunghic în $A$: $AA' = \\sqrt{${d * d} - ${l * l}} = ${h}$ cm.`,
      show(`\\mathcal{A}_t = 2\\ell^2 + 4\\ell h = ${2 * l * l} + ${4 * l * h} = ${2 * l * l + 4 * l * h}\\text{ cm}^2, \\qquad V = \\ell^2 h = ${l * l * h}\\text{ cm}^3`),
    ),
    verify: () => l * l + h * h === d * d,
  }
}

const HEIGHTS = ['la jumătatea înălțimii', 'la o treime din înălțime', 'la un sfert din înălțime', 'la două treimi din înălțime']

/** Dimensions proportional to p, q, r: a section parallel to the base is congruent with the base, wherever it is. (5.11, 14) */
export function cuboidProportionalSection(rng: Rng): Made {
  for (;;) {
    const [p, q, r] = [int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)]
    if (p === q || q === r || p === r) continue
    const k = int(rng, 1, 8)
    const S = 4 * k * (p + q + r)
    return {
      text: `Un paralelipiped dreptunghic are lungimea, lățimea și înălțimea direct proporționale cu numerele ${p}, ${q} și ${r}, iar suma tuturor muchiilor este ${S} cm. Aflați aria secțiunii obținute printr-un plan paralel cu baza dus ${pick(rng, HEIGHTS)} și volumul paralelipipedului.`,
      solution: lines(
        `Dimensiunile sunt $${p}k$, $${q}k$ și $${r}k$. Paralelipipedul are câte 4 muchii din fiecare: $4(${p}k + ${q}k + ${r}k) = ${S}$, deci $${4 * (p + q + r)}k = ${S}$ și $k = ${k}$. Dimensiunile sunt ${p * k} cm, ${q * k} cm și ${r * k} cm.`,
        `Secțiunea unei prisme cu un plan paralel cu baza este congruentă cu baza, oriunde ar fi dusă. Aria ei este aria bazei:`,
        show(`\\mathcal{A} = ${p * k} \\cdot ${q * k} = ${p * q * k * k}\\text{ cm}^2, \\qquad V = ${p * k} \\cdot ${q * k} \\cdot ${r * k} = ${p * q * r * k ** 3}\\text{ cm}^3`),
      ),
      verify: () => 4 * (p * k + q * k + r * k) === S,
    }
  }
}

/** A frustum of a regular quadrilateral pyramid: its apothem, then the apothem and height of the whole pyramid. (5.11, 15) */
export function frustumOriginalApothem(rng: Rng): Made {
  const [x, h, af] = rightTriangle(rng, 40)
  const l = int(rng, 2, 40)
  const L = l + 2 * x
  return {
    text: `Un trunchi de piramidă patrulateră regulată are laturile bazelor de ${L} cm și ${l} cm și înălțimea de ${h} cm. Aflați apotema trunchiului, apotema și înălțimea piramidei din care provine trunchiul.`,
    solution: lines(
      `Apotema trunchiului este latura neparalelă a trapezului dreptunghic format de înălțime, de apotemele bazelor și de apotema trunchiului; diferența apotemelor bazelor este $\\frac{${L} - ${l}}{2} = ${x}$ cm:`,
      show(`a_t = \\sqrt{${h * h} + ${x * x}} = ${af}\\text{ cm}`),
      `Piramida mică, tăiată de pe vârf, este asemenea cu cea mare, în raportul $\\frac{${l}}{${L}}$. Dacă $a$ este apotema piramidei mari, apotema celei mici este $a - ${af}$:`,
      show(`\\frac{a - ${af}}{a} = \\frac{${l}}{${L}} \\Rightarrow a = \\frac{${af} \\cdot ${L}}{${L} - ${l}} = ${frac(af * L, 2 * x)}\\text{ cm}`),
      `La fel, înălțimea piramidei mari este $H = \\frac{${h} \\cdot ${L}}{${L} - ${l}} = ${frac(h * L, 2 * x)}$ cm.`,
    ),
    verify: () => close((af * L) / (2 * x) - af, ((af * L) / (2 * x)) * (l / L)) && h * h + x * x === af * af,
  }
}

/** A frustum of a regular triangular pyramid: R − r from the lateral edge and the height, then the larger base. (5.11, 16) */
export function frustumTriangularBase(rng: Rng): Made {
  const h = int(rng, 2, 20)
  const s = int(rng, 1, 10)
  const l = int(rng, 2, 30)
  const e2 = h * h + 3 * s * s
  const L = l + 3 * s
  return {
    text: `Un trunchi de piramidă triunghiulară regulată are muchia laterală de $${root(e2)}$ cm, latura bazei mici de ${l} cm și înălțimea de ${h} cm. Aflați latura bazei mari și aria ei.`,
    solution: lines(
      'Fie $O$ și $O\'$ centrele bazelor și $AA\'$ o muchie laterală. Proiecția lui $A\'$ pe baza mare este pe $OA$, la distanța $R - r$ de $A$ ($R$ și $r$ sunt razele cercurilor circumscrise bazelor):',
      show(`R - r = \\sqrt{${e2} - ${h * h}} = \\sqrt{${3 * s * s}} = ${surd(s, 1, 3)}\\text{ cm}`),
      `Cum $R = \\frac{L\\sqrt{3}}{3}$ și $r = \\frac{\\ell\\sqrt{3}}{3}$, avem $\\frac{(L - ${l})\\sqrt{3}}{3} = ${surd(s, 1, 3)}$, deci $L - ${l} = ${3 * s}$ și $L = ${L}$ cm.`,
      show(`\\mathcal{A}_B = \\frac{L^2\\sqrt{3}}{4} = ${surd(L * L, 4, 3)}\\text{ cm}^2`),
    ),
    verify: () => close(((L - l) / Math.sqrt(3)) ** 2 + h * h, e2),
  }
}

