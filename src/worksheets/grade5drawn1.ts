// Grade V forms with drawings, from the workbook "cu puișorul", pp. 6–42 (photographed by the user on 14 November 2026):
// the initial tests (pp. 6–7: count the triangles / squares of a figure, the fraction a hatched part is of a square, a
// strip, a triangle cut by its medians) and 2.1 (p. 8: the number line, ex. 3–4). Pages 9–42 (operations, powers,
// divisibility, the arithmetic methods, contest problems) have no drawings; their exercises are in grade5puisor1–2.ts.
// The levels follow the stars of the sections; the tests (no stars) by their content. Every form names its page and
// exercise and draws its own figure from the same numbers it states.
import type { Made } from './generators'
import type { DrawnContest, DrawnKind } from './grade5drawn'
import { numberLine, pointsOnLine, shadedCircle, shadedGrid } from './figures5'
import type { Fig, Pt } from '../models/figure'
import { de, frac, gcd, int, pick, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (t: string) => `$$${t}$$`
const C2 = (n: number) => (n * (n - 1)) / 2
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
/** k different whole numbers from lo to hi, in increasing order. */
const distinct = (rng: Rng, k: number, lo: number, hi: number) => shuffle(rng, range(lo, hi)).slice(0, k).sort((a, b) => a - b)
/** k/n, and its simplified form when it simplifies: \frac{6}{8} = \frac{3}{4}. */
const fr = (k: number, n: number) => (gcd(k, n) > 1 ? `\\frac{${k}}{${n}} = ${frac(k, n)}` : `\\frac{${k}}{${n}}`)
/** "A, B, C și D" */
const list = (names: string[]) => (names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} și ${names[names.length - 1]}`)
const f1 = (x: number) => Math.round(x * 10) / 10

const NAMES3 = [['A', 'B', 'C'], ['M', 'N', 'P'], ['E', 'F', 'G'], ['R', 'S', 'T'], ['X', 'Y', 'Z'], ['K', 'L', 'M'], ['D', 'E', 'F']]
const NAMES4 = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H'], ['R', 'S', 'T', 'U'], ['K', 'L', 'M', 'N']]

// ======================= the number line (p. 8, ex. 3–4) =======================

/** Read the coordinates of three points; every tick is a step, every second one numbered. p. 8, ex. 3–4. */
export function d1AxisReadLabeled(rng: Rng): Made {
  const step = pick(rng, [1, 2, 5, 10, 20, 25, 50, 100])
  const n = int(rng, 10, 14)
  const names = pick(rng, NAMES3)
  const at = shuffle(rng, distinct(rng, 3, 1, n))
  const labels = range(0, Math.floor(n / 2)).map((k) => 2 * k * step)
  const fig = numberLine({ from: 0, to: n * step, step, labels, points: names.map((name, i) => ({ name, at: at[i] * step })) })
  const c = at.map((k) => k * step)
  return {
    text: lines(
      `Pe axa numerelor din figură, gradațiile sunt din ${step} în ${step}; sub ele este scris doar unul din două numere.`,
      `Scrieți coordonatele punctelor ${list(names)}.`,
    ),
    solution: lines(
      `Numărăm gradațiile de la $0$: fiecare gradație adaugă $${step}$.`,
      ...names.map((name, i) => `Punctul ${name} este la a ${at[i]}-a gradație: $${at[i]} \\cdot ${step} = ${c[i]}$, deci $${name}(${c[i]})$.`),
    ),
    verify: () => names.every((name, i) => names.every((o, j) => (c[i] < c[j]) === (fig.p[name][0] < fig.p[o][0]))) && c.every((x) => x % step === 0),
    fig,
  }
}

/** Only 0 is written; the coordinate of A gives the step; find B and C. p. 8, ex. 4 a. */
export function d1AxisFromA(rng: Rng): Made {
  const step = pick(rng, [1, 2, 3, 4, 5, 10])
  const n = int(rng, 10, 14)
  const kA = int(rng, 2, 4)
  const [kB, kC] = distinct(rng, 2, kA + 1, n)
  const [a, b, c] = [kA * step, kB * step, kC * step]
  const fig = numberLine({ from: 0, to: n * step, step, labels: [0], points: [{ name: 'O', at: 0 }, { name: 'A', at: a }, { name: 'B', at: b }, { name: 'C', at: c }] })
  return {
    text: lines(
      `Pe axa numerelor din figură, punctului O îi corespunde numărul $0$.`,
      `Dacă punctului A îi corespunde coordonata $${a}$, aflați coordonatele punctelor B și C.`,
    ),
    solution: lines(
      `De la O la A sunt ${kA} intervale egale, deci un interval are lungimea $${a} : ${kA} = ${step}$.`,
      `B este la ${kB} intervale de O: $${kB} \\cdot ${step} = ${b}$, deci $B(${b})$.`,
      `C este la ${kC} intervale de O: $${kC} \\cdot ${step} = ${c}$, deci $C(${c})$.`,
    ),
    verify: () => a / kA === step && b === kB * (a / kA) && c === kC * (a / kA) && fig.p.A[0] < fig.p.B[0] && fig.p.B[0] < fig.p.C[0],
    fig,
  }
}

/** Which letter stands for a number; the ticks go by a step, 0 and the first step written. p. 8, ex. 3. */
export function d1AxisWhichLetter(rng: Rng): Made {
  const step = pick(rng, [1, 2, 5, 10, 25, 50])
  const n = int(rng, 10, 14)
  const names = pick(rng, NAMES4)
  const at = shuffle(rng, distinct(rng, 4, 2, n))
  const fig = numberLine({ from: 0, to: n * step, step, labels: [0, step], points: names.map((name, i) => ({ name, at: at[i] * step })) })
  const [i, j] = distinct(rng, 2, 0, 3)
  const x = at[i] * step, y = at[j] * step
  return {
    text: lines(
      `Pe axa numerelor din figură sunt marcate punctele ${list(names)}.`,
      `Ce punct corespunde numărului $${x}$? Dar numărului $${y}$?`,
    ),
    solution: lines(
      `Între $0$ și $${step}$ este un interval, deci gradațiile sunt din $${step}$ în $${step}$.`,
      `$${x} = ${at[i]} \\cdot ${step}$: numărul se află la a ${at[i]}-a gradație de la $0$, adică în punctul ${names[i]}.`,
      `$${y} = ${at[j]} \\cdot ${step}$: numărul se află la a ${at[j]}-a gradație, adică în punctul ${names[j]}.`,
    ),
    verify: () => x / step === at[i] && y / step === at[j] && Math.abs(fig.p[names[i]][0] - fig.p[names[j]][0]) > 1,
    fig,
  }
}

/** The distances OA, OB, AB, AC, BC on the line of p. 8, ex. 4 b. */
export function d1AxisDistances(rng: Rng): Made {
  const step = pick(rng, [2, 3, 4, 5, 6, 10, 20])
  const n = int(rng, 10, 14)
  const kA = int(rng, 2, 4)
  const [kB, kC] = distinct(rng, 2, kA + 1, n)
  const [a, b, c] = [kA * step, kB * step, kC * step]
  const fig = numberLine({ from: 0, to: n * step, step, labels: [0], points: [{ name: 'O', at: 0 }, { name: 'A', at: a }, { name: 'B', at: b }, { name: 'C', at: c }] })
  const d = { OA: a, OB: b, AB: b - a, AC: c - a, BC: c - b }
  return {
    text: lines(
      `Pe axa numerelor din figură, punctul O are coordonata $0$, iar punctul A are coordonata $${a}$.`,
      `Calculați distanțele OA, OB, AB, AC și BC.`,
    ),
    solution: lines(
      `Un interval are $${a} : ${kA} = ${step}$, deci $B(${b})$ și $C(${c})$.`,
      `Distanța dintre două puncte ale axei este diferența coordonatelor (cea mare minus cea mică):`,
      show(`OA = ${a},\\quad OB = ${b},\\quad AB = ${b} - ${a} = ${d.AB},\\quad AC = ${c} - ${a} = ${d.AC},\\quad BC = ${c} - ${b} = ${d.BC}`),
    ),
    verify: () => d.AB + d.BC === d.AC && d.OA + d.AB === d.OB && b - a === (kB - kA) * step,
    fig,
  }
}

/** A piece of the line without 0: A and B are given, find C and D. p. 8, ex. 4 (harder). */
export function d1AxisNoZero(rng: Rng): Made {
  const step = pick(rng, [1, 2, 5, 10, 20, 50])
  const n = int(rng, 10, 14)
  const from = step * int(rng, 3, 30)
  const ks = distinct(rng, 4, 0, n)
  // A and B at least two intervals apart, so that the step must be worked out
  const [kA, kB] = shuffle(rng, ks).slice(0, 2).sort((x, y) => x - y)
  if (kB - kA < 2) return d1AxisNoZero(rng)
  const [kC, kD] = shuffle(rng, ks.filter((k) => k !== kA && k !== kB))
  const co = (k: number) => from + k * step
  const fig = numberLine({ from, to: from + n * step, step, labels: [], points: [{ name: 'A', at: co(kA) }, { name: 'B', at: co(kB) }, { name: 'C', at: co(kC) }, { name: 'D', at: co(kD) }] })
  const dir = (k: number) => (k > kA ? `la ${k - kA} intervale la dreapta lui A: $${co(kA)} + ${k - kA} \\cdot ${step} = ${co(k)}$` : `la ${kA - k} intervale la stânga lui A: $${co(kA)} - ${kA - k} \\cdot ${step} = ${co(k)}$`)
  return {
    text: lines(
      `În figură este desenată o parte a axei numerelor. Punctul A are coordonata $${co(kA)}$, iar punctul B are coordonata $${co(kB)}$.`,
      `Aflați coordonatele punctelor C și D.`,
    ),
    solution: lines(
      `Între A și B sunt ${kB - kA} intervale egale și $AB = ${co(kB)} - ${co(kA)} = ${(kB - kA) * step}$, deci un interval are $${(kB - kA) * step} : ${kB - kA} = ${step}$.`,
      `C este ${dir(kC)}.`,
      `D este ${dir(kD)}.`,
    ),
    verify: () => (co(kB) - co(kA)) / (kB - kA) === step && fig.p.C[0] !== fig.p.D[0],
    fig,
  }
}

/** The number halfway between A and B: the midpoint M is drawn. p. 8, ex. 4. */
export function d1AxisMidpoint(rng: Rng): Made {
  const step = pick(rng, [1, 2, 3, 5, 10])
  const n = int(rng, 10, 14)
  const half = int(rng, 2, Math.floor(n / 2) - 1)
  const kA = int(rng, 1, n - 2 * half)
  const kB = kA + 2 * half
  const kM = kA + half
  const [a, b, m] = [kA * step, kB * step, kM * step]
  const fig = numberLine({ from: 0, to: n * step, step, labels: [0, step], points: [{ name: 'A', at: a }, { name: 'M', at: m }, { name: 'B', at: b }] })
  return {
    text: lines(
      `Pe axa numerelor din figură, punctul M este mijlocul segmentului AB, iar punctul B are coordonata $${b}$.`,
      `Aflați coordonatele punctelor A și M și lungimea segmentului AM.`,
    ),
    solution: lines(
      `Gradațiile sunt din $${step}$ în $${step}$ (între $0$ și $${step}$ este un interval). A este la a ${kA}-a gradație, deci $A(${a})$.`,
      `Mijlocul are coordonata egală cu media coordonatelor capetelor:`,
      show(`\\frac{${a} + ${b}}{2} = \\frac{${a + b}}{2} = ${m}, \\quad M(${m})`),
      `$AM = ${m} - ${a} = ${m - a}$ (jumătate din $AB = ${b - a}$).`,
    ),
    verify: () => (a + b) / 2 === m && 2 * (m - a) === b - a && fig.p.A[0] < fig.p.M[0] && fig.p.M[0] < fig.p.B[0],
    fig,
  }
}

/** The length AB is given and only O is numbered: the step comes from it. p. 8, ex. 4 (backwards). */
export function d1AxisFromLength(rng: Rng): Made {
  const step = pick(rng, [2, 3, 4, 5, 6, 10, 15, 20])
  const n = int(rng, 10, 14)
  const [kA, kB, kC] = shuffle(rng, distinct(rng, 3, 1, n))
  const ord = [kA, kB].sort((x, y) => x - y)
  if (ord[1] - ord[0] < 2) return d1AxisFromLength(rng)
  const ab = Math.abs(kB - kA) * step
  const fig = numberLine({ from: 0, to: n * step, step, labels: [0], points: [{ name: 'O', at: 0 }, { name: 'A', at: kA * step }, { name: 'B', at: kB * step }, { name: 'C', at: kC * step }] })
  return {
    text: lines(
      `Pe axa numerelor din figură, punctul O are coordonata $0$, iar distanța dintre punctele A și B este $AB = ${ab}$.`,
      `Aflați coordonatele punctelor A, B și C și distanța $AC$.`,
    ),
    solution: lines(
      `Între A și B sunt ${Math.abs(kB - kA)} intervale egale, deci un interval are $${ab} : ${Math.abs(kB - kA)} = ${step}$.`,
      `Numărând intervalele de la O: $A(${kA * step})$, $B(${kB * step})$, $C(${kC * step})$.`,
      `$AC = ${Math.max(kA, kC) * step} - ${Math.min(kA, kC) * step} = ${Math.abs(kC - kA) * step}$.`,
    ),
    verify: () => ab / Math.abs(kB - kA) === step && kA !== kC && kB !== kC,
    fig,
  }
}

// ======================= fractions on figures (pp. 6–7, the initial tests) =======================

/** A strip of n equal squares, some hatched. p. 7, test 3, ex. 5 a. */
export function d1StripFraction(rng: Rng): Made {
  const n = int(rng, 4, 12)
  const k = int(rng, 1, n - 1)
  const cells = distinct(rng, k, 0, n - 1).map((c) => [c, 0] as [number, number])
  const a = int(rng, 1, 6)
  const fig = shadedGrid(n, 1, cells, 30)
  return {
    text: `Dreptunghiul din figură, lung de $${n * a}\\text{ cm}$, este împărțit în ${n} pătrate egale. Ce fracție din dreptunghi reprezintă partea hașurată? Dar partea nehașurată? Ce lungime ar avea pătratele hașurate puse unul lângă altul?`,
    solution: lines(
      `Sunt hașurate ${k} din cele ${n} pătrate egale:`,
      show(`\\text{hasurat: } ${fr(k, n)}, \\qquad \\text{nehasurat: } ${fr(n - k, n)}`),
      `Un pătrat are latura $${n * a} : ${n} = ${a}\\text{ cm}$, deci pătratele hașurate puse unul lângă altul au $${k} \\cdot ${a} = ${k * a}\\text{ cm}$.`,
    ),
    verify: () => cells.length === k && (fig.path?.filter((p) => p.hatch).length ?? 0) === k,
    fig,
  }
}

/** A disc cut into n equal sectors, some hatched. pp. 6–7, the tests (fractions of a figure). */
export function d1CircleFraction(rng: Rng): Made {
  const n = pick(rng, [3, 4, 5, 6, 8, 10, 12])
  const k = int(rng, 1, n - 1)
  const sectors = distinct(rng, k, 0, n - 1)
  const g = n * int(rng, 5, 30) * 10
  const fig = shadedCircle(n, sectors, 64)
  return {
    text: `O pizza rotundă de $${g}$${de(g).endsWith(' de') ? ' de' : ''} grame este tăiată în ${n} felii egale, ca discul din figură; feliile hașurate au fost mâncate. Ce fracție din pizza s-a mâncat? Câte grame de pizza au rămas?`,
    solution: lines(
      `Sunt hașurate ${k} din ${n} felii egale, deci s-a mâncat $${fr(k, n)}$ din pizza.`,
      `O felie are $${g} : ${n} = ${g / n}$${de(g / n).endsWith(' de') ? ' de' : ''} grame, iar au rămas ${n - k} felii:`,
      show(`${n - k} \\cdot ${g / n} = ${(n - k) * (g / n)}\\text{ g}`),
    ),
    verify: () => sectors.length === k && new Set(sectors).size === k && (n - k) * (g / n) + k * (g / n) === g,
    fig,
  }
}

/** A rectangle of r rows of c squares, some hatched. pp. 6–7, the tests. */
export function d1GridFraction(rng: Rng): Made {
  const c = int(rng, 3, 6), r = int(rng, 2, 4)
  const N = c * r
  const k = int(rng, 1, N - 1)
  const cells = distinct(rng, k, 0, N - 1).map((i) => [i % c, Math.floor(i / c)] as [number, number])
  const fig = shadedGrid(c, r, cells, 30)
  return {
    text: `Dreptunghiul din figură are ${r} rânduri a câte ${c} pătrățele egale. Ce fracție din dreptunghi este hașurată?`,
    solution: lines(
      `Dreptunghiul are $${r} \\cdot ${c} = ${N}$ pătrățele, dintre care ${k} sunt hașurate:`,
      show(fr(k, N)),
    ),
    verify: () => (fig.path?.filter((p) => p.hatch).length ?? 0) === k,
    fig,
  }
}

/** The square cut by its diagonals and midlines into 8 equal triangles. p. 7, test 4, ex. 5 b. */
export function d1SquareEight(rng: Rng): Made {
  const k = int(rng, 1, 5)
  const t = int(rng, k + 1, 7)
  const hatched = distinct(rng, k, 0, 7)
  // the boundary points in order, from the top left corner, clockwise
  const Q: Pt[] = [[10, 10], [90, 10], [170, 10], [170, 90], [170, 170], [90, 170], [10, 170], [10, 90]]
  const p: Record<string, Pt> = { O: [90, 90] }
  Q.forEach((q, i) => { p[`Q${i}`] = q })
  const fig: Fig = {
    w: 180, h: 180, p,
    l: Object.fromEntries(Object.keys(p).map((n) => [n, ''])),
    s: 'Q0-Q2-Q4-Q6-Q0 Q0-Q4 Q2-Q6 Q1-Q5 Q3-Q7',
    hatch: hatched.map((i) => `O-Q${i}-Q${(i + 1) % 8}`),
  }
  return {
    text: lines(
      `Pătratul din figură este împărțit de diagonale și de cele două linii mijlocii în 8 triunghiuri egale.`,
      `a) Ce fracție din pătrat este hașurată?`,
      `b) Câte triunghiuri ar mai trebui hașurate pentru ca partea hașurată să reprezinte $${frac(t, 8)}$ din pătrat?`,
    ),
    solution: lines(
      `a) Sunt hașurate ${k} din cele 8 triunghiuri egale: $${fr(k, 8)}$.`,
      `b) ${frac(t, 8) === `\\frac{${t}}{8}` ? `$${frac(t, 8)}$ din pătrat înseamnă ${t} triunghiuri` : `$${frac(t, 8)} = \\frac{${t}}{8}$, adică ${t} triunghiuri`}, deci mai trebuie hașurate $${t} - ${k} = ${t - k}$ triunghiuri.`,
    ),
    verify: () => fig.hatch!.length === k && t > k && (t / 8) * 8 === t,
    fig,
  }
}

/** The triangle cut by its three medians into 6 triangles of equal areas. p. 7, test 4, ex. 5 c. */
export function d1TriangleSix(rng: Rng): Made {
  const k = int(rng, 1, 5)
  const S = 6 * int(rng, 2, 25)
  const hatched = distinct(rng, k, 0, 5)
  const A: Pt = [110, 10], B: Pt = [10, 180], C: Pt = [210, 180]
  const m = (u: Pt, v: Pt): Pt => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2]
  const p: Record<string, Pt> = { A, B, C, G: [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3], M1: m(A, B), M2: m(B, C), M3: m(C, A) }
  const ring = ['A', 'M1', 'B', 'M2', 'C', 'M3']
  const fig: Fig = {
    w: 220, h: 190, p,
    l: { A: 'n', B: 'sw', C: 'se', G: '', M1: '', M2: '', M3: '' },
    s: 'A-B-C-A A-M2 B-M3 C-M1',
    hatch: hatched.map((i) => `G-${ring[i]}-${ring[(i + 1) % 6]}`),
  }
  const part = (S * k) / 6
  return {
    text: lines(
      `În triunghiul ABC din figură s-au trasat cele trei mediane, care îl împart în 6 triunghiuri cu arii egale.`,
      `Ce fracție din triunghi este hașurată? Dacă aria triunghiului ABC este $${S}\\text{ cm}^2$, ce arie are partea hașurată?`,
    ),
    solution: lines(
      `Sunt hașurate ${k} din cele 6 triunghiuri cu arii egale: $${fr(k, 6)}$ din triunghi.`,
      `Un triunghi mic are aria $${S} : 6 = ${S / 6}\\text{ cm}^2$, deci partea hașurată are`,
      show(`${k} \\cdot ${S / 6} = ${part}\\text{ cm}^2`),
    ),
    verify: () => fig.hatch!.length === k && part * 6 === S * k,
    fig,
  }
}

/** How many more squares to hatch for a given fraction. pp. 6–7 (the brief's "shade a fraction"). */
export function d1GridToShade(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 3, 6), r = int(rng, 2, 4)
    const N = c * r
    const qs = range(2, N - 1).filter((q) => N % q === 0)
    if (!qs.length) continue
    const q = pick(rng, qs)
    const ps = range(1, q - 1).filter((x) => gcd(x, q) === 1)
    const pp = pick(rng, ps)
    const want = (pp * N) / q
    if (want < 2) continue
    const k = int(rng, 1, want - 1)
    const cells = distinct(rng, k, 0, N - 1).map((i) => [i % c, Math.floor(i / c)] as [number, number])
    const fig = shadedGrid(c, r, cells, 30)
    return {
      text: `Dreptunghiul din figură are ${r} rânduri a câte ${c} pătrățele egale, dintre care unele sunt hașurate. Câte pătrățele mai trebuie hașurate pentru ca partea hașurată să fie $${frac(pp, q)}$ din dreptunghi?`,
      solution: lines(
        `Dreptunghiul are $${r} \\cdot ${c} = ${N}$ pătrățele. $${frac(pp, q)}$ din ele înseamnă`,
        show(`${N} : ${q} \\cdot ${pp} = ${want}`),
        `pătrățele. Sunt hașurate ${k}, deci mai trebuie hașurate $${want} - ${k} = ${want - k}$.`,
      ),
      verify: () => want * q === pp * N && want > k && (fig.path?.filter((x) => x.hatch).length ?? 0) === k,
      fig,
    }
  }
}

/** A square of 4 quarters, one hatched, one halved, one cut in 4 small squares: different pieces. p. 6, test 2, ex. 5 c. */
export function d1SquareMixed(rng: Rng): Made {
  for (;;) {
    const L = 4 * int(rng, 2, 10)
    const full = int(rng, 0, 1), halfOn = int(rng, 0, 1), j = int(rng, 0, 3)
    if (full + halfOn + (j > 0 ? 1 : 0) < 2) continue
    const num = 4 * full + 2 * halfOn + j
    const roles = shuffle(rng, ['full', 'half', 'small', 'none'])
    const s = 96 // a quarter, in pixels
    const at = (i: number): Pt => [(i % 2) * s, Math.floor(i / 2) * s]
    const path: NonNullable<Fig['path']> = []
    const lines2: string[] = ['M0 0 H192 V192 H0 Z', 'M96 0 V192 M0 96 H192']
    roles.forEach((role, i) => {
      const [x, y] = at(i)
      if (role === 'full' && full) path.push({ d: `M${x} ${y} h${s} v${s} h${-s} Z`, hatch: true })
      if (role === 'half') {
        lines2.push(`M${x} ${y + s} L${x + s} ${y}`)
        if (halfOn) path.push({ d: `M${x} ${y} L${x + s} ${y} L${x} ${y + s} Z`, hatch: true })
      }
      if (role === 'small') {
        lines2.push(`M${x + s / 2} ${y} V${y + s} M${x} ${y + s / 2} H${x + s}`)
        for (let q = 0; q < j; q++) path.push({ d: `M${x + (q % 2) * (s / 2)} ${y + Math.floor(q / 2) * (s / 2)} h${s / 2} v${s / 2} h${-s / 2} Z`, hatch: true })
      }
    })
    path.push({ d: lines2.join(' ') })
    const fig: Fig = { w: 192, h: 192, p: {}, path }
    const area = (L * L * num) / 16
    const parts = [
      full ? `un sfert întreg: $\\frac{1}{4} = \\frac{4}{16}$` : '',
      halfOn ? `jumătate dintr-un sfert: $\\frac{1}{8} = \\frac{2}{16}$` : '',
      j ? `${j === 1 ? 'un pătrățel mic' : `${j} pătrățele mici`}, fiecare $\\frac{1}{16}$ din pătrat: $\\frac{${j}}{16}$` : '',
    ].filter(Boolean)
    return {
      text: lines(
        `Pătratul din figură, cu latura de $${L}\\text{ cm}$, este împărțit în 4 pătrate egale; unele dintre ele sunt împărțite mai departe, ca în figură.`,
        `Ce fracție din pătrat este hașurată? Ce arie are partea hașurată?`,
      ),
      solution: lines(
        `Măsurăm totul în șaisprezecimi din pătrat. Partea hașurată este formată din: ${parts.join('; ')}.`,
        show(`\\frac{${num}}{16}${gcd(num, 16) > 1 ? ` = ${frac(num, 16)}` : ''}`),
        `Aria pătratului este $${L} \\cdot ${L} = ${L * L}\\text{ cm}^2$, deci partea hașurată are $${L * L} : 16 \\cdot ${num} = ${area}\\text{ cm}^2$.`,
      ),
      verify: () => Number.isInteger(area) && num > 0 && num < 16 && path.filter((x) => x.hatch).length === full + halfOn + j,
      fig,
    }
  }
}

/** A strip of squares, each cut by a diagonal; whole squares and halves hatched. p. 7, test 3, ex. 5 a. */
export function d1StripDiagonals(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 3, 6)
    const a = 2 * int(rng, 1, 6)
    const state = Array.from({ length: n }, () => int(rng, 0, 2)) // 0 none, 1 half, 2 whole
    const f = state.filter((x) => x === 2).length, h = state.filter((x) => x === 1).length
    if (h === 0 || f + h === n && f === n) continue
    const num = 2 * f + h
    if (num === 2 * n) continue
    const s = 48
    const path: NonNullable<Fig['path']> = []
    const ln: string[] = [`M0 0 H${n * s} V${s} H0 Z`]
    state.forEach((st, i) => {
      const x = i * s
      if (i) ln.push(`M${x} 0 V${s}`)
      ln.push(`M${x} ${s} L${x + s} 0`)
      if (st === 2) path.push({ d: `M${x} 0 h${s} v${s} h${-s} Z`, hatch: true })
      if (st === 1) path.push({ d: `M${x} ${s} L${x + s} 0 L${x + s} ${s} Z`, hatch: true })
    })
    path.push({ d: ln.join(' ') })
    const fig: Fig = { w: n * s, h: s, p: {}, path }
    const area = (a * a * num) / 2
    return {
      text: lines(
        `Dreptunghiul din figură este format din ${n} pătrate egale, cu latura de $${a}\\text{ cm}$, fiecare împărțit de o diagonală în două triunghiuri egale.`,
        `Ce fracție din dreptunghi este hașurată? Ce arie are partea hașurată?`,
      ),
      solution: lines(
        `Dreptunghiul are $2 \\cdot ${n} = ${2 * n}$ triunghiuri egale. Hașurate sunt ${f ? `${f === 1 ? 'un pătrat întreg' : `${f} pătrate întregi`} (câte 2 triunghiuri) și ` : ''}${h === 1 ? 'un triunghi' : `${h} triunghiuri`} singure, adică $${f ? `2 \\cdot ${f} + ` : ''}${h} = ${num}$ triunghiuri:`,
        show(fr(num, 2 * n)),
        `Un triunghi are aria $${a} \\cdot ${a} : 2 = ${(a * a) / 2}\\text{ cm}^2$, deci partea hașurată are $${num} \\cdot ${(a * a) / 2} = ${area}\\text{ cm}^2$.`,
      ),
      verify: () => num === 2 * f + h && area * 2 === a * a * num && path.filter((x) => x.hatch).length === f + h,
      fig,
    }
  }
}

/** The triangle of an n-grid: the up and down small triangles, for the hatched ones and the grid count. */
function triGrid(n: number, side = 200, ox = 10, oy = 10) {
  const s = side / n, hh = (s * Math.sqrt(3)) / 2
  const P = (i: number, j: number): Pt => [ox + side / 2 + (j - i / 2) * s, oy + i * hh]
  const small: Pt[][] = []
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
    small.push([P(i, j), P(i + 1, j), P(i + 1, j + 1)])
    if (j < i) small.push([P(i, j), P(i, j + 1), P(i + 1, j + 1)])
  }
  const ln: string[] = []
  const f = (q: Pt) => `${f1(q[0])} ${f1(q[1])}`
  for (let i = 1; i <= n; i++) ln.push(`M${f(P(i, 0))} L${f(P(i, i))}`)
  for (let j = 0; j < n; j++) ln.push(`M${f(P(j, j))} L${f(P(n, j))}`, `M${f(P(j, 0))} L${f(P(n, n - j))}`)
  ln.push(`M${f(P(0, 0))} L${f(P(n, 0))} L${f(P(n, n))} Z`)
  return { small, grid: ln.join(' '), w: side + 2 * ox, h: Math.ceil(n * hh + 2 * oy), f }
}

/** An equilateral triangle cut into n² equal small triangles, some hatched; its area given. pp. 6–7, the tests. */
export function d1TriangleGridFraction(rng: Rng): Made {
  const n = pick(rng, [2, 3, 4])
  const N = n * n
  const k = int(rng, 1, N - 1)
  const S = N * int(rng, 2, 12)
  const g = triGrid(n)
  const chosen = distinct(rng, k, 0, N - 1)
  const fig: Fig = {
    w: g.w, h: g.h, p: {},
    path: [...chosen.map((i) => ({ d: `M${g.small[i].map(g.f).join(' L')} Z`, hatch: true })), { d: g.grid }],
  }
  return {
    text: lines(
      `Triunghiul echilateral din figură, cu aria de $${S}\\text{ cm}^2$, este împărțit în ${N} triunghiuri echilaterale egale.`,
      `Ce fracție din triunghi este hașurată? Ce arie are partea nehașurată?`,
    ),
    solution: lines(
      `Sunt hașurate ${k} din cele ${N} triunghiuri egale: $${fr(k, N)}$.`,
      `Un triunghi mic are aria $${S} : ${N} = ${S / N}\\text{ cm}^2$, iar nehașurate sunt $${N} - ${k} = ${N - k}$ triunghiuri:`,
      show(`${N - k} \\cdot ${S / N} = ${(N - k) * (S / N)}\\text{ cm}^2`),
    ),
    verify: () => g.small.length === N && chosen.length === k && (N - k) * (S / N) + k * (S / N) === S,
    fig,
  }
}

// ======================= counting figures (pp. 6–7, the initial tests) =======================

/** n points on a line: the segments n(n−1)/2 and the rays 2n. p. 6–7, counting (rule of the book's lessons). */
export function d1CountSegments(rng: Rng): Made {
  const n = int(rng, 3, 8)
  const ABC = 'ABCDEFGHIJKLMNPQRSTUVXYZ' // no O, which is kept for the origin
  const first = int(rng, 0, ABC.length - n)
  const names = ABC.slice(first, first + n).split('')
  let x = 0
  const at = names.map(() => (x += int(rng, 3, 7)))
  const fig = pointsOnLine(names, at, { w: 380, line: 'd' })
  let pairs = 0
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs++
  return {
    text: `Pe dreapta $d$ din figură sunt marcate punctele ${list(names)}. Câte segmente au ambele capete printre aceste puncte? Câte semidrepte au originea într-unul dintre ele?`,
    solution: lines(
      `Din fiecare punct pornesc segmente către celelalte ${n - 1} puncte; așa fiecare segment este numărat de două ori:`,
      show(`${n} \\cdot ${n - 1} : 2 = ${C2(n)}`),
      `Fiecare punct este originea a două semidrepte opuse, deci sunt $2 \\cdot ${n} = ${2 * n}$ semidrepte.`,
    ),
    verify: () => pairs === C2(n),
    fig,
  }
}

/** The triangle with k segments from a vertex to the opposite side, and m segments parallel to that side. */
function cevianFig(names: string[], k: number, m: number, rng: Rng): Fig {
  const [A, B, C] = names
  const pA: Pt = [140, 10], pB: Pt = [10, 190], pC: Pt = [270, 190]
  const p: Record<string, Pt> = { [A]: pA, [B]: pB, [C]: pC }
  const l: Fig['l'] = { [A]: 'n', [B]: 'sw', [C]: 'se' }
  const segs: string[] = [`${A}-${B}-${C}-${A}`]
  for (let i = 1; i <= k; i++) {
    p[`D${i}`] = [f1(10 + (260 * i) / (k + 1) + int(rng, -10, 10) * (k > 3 ? 0.4 : 1)), 190]
    l[`D${i}`] = ''
    segs.push(`${A}-D${i}`)
  }
  for (let j = 1; j <= m; j++) {
    const t = m === 1 ? 0.5 : 0.35 + (0.4 * (j - 1)) / (m - 1)
    p[`P${j}`] = [pA[0] + t * (pB[0] - pA[0]), pA[1] + t * (pB[1] - pA[1])]
    p[`R${j}`] = [pA[0] + t * (pC[0] - pA[0]), pA[1] + t * (pC[1] - pA[1])]
    l[`P${j}`] = ''
    l[`R${j}`] = ''
    segs.push(`P${j}-R${j}`)
  }
  return { w: 280, h: 200, p, l, s: segs.join(' ') }
}

/** Triangles formed by k+2 lines from the vertex and m+1 bases, counted one by one. */
function countCevian(k: number, m: number) {
  let t = 0
  for (let i = 0; i < k + 2; i++) for (let j = i + 1; j < k + 2; j++) for (let b = 0; b <= m; b++) t++
  return t
}

/** k segments from the vertex A to the side BC: C(k+2, 2) triangles. p. 6, test 1, ex. 2 (counting triangles). */
export function d1CountCevians(rng: Rng): Made {
  const names = pick(rng, NAMES3)
  const [A, B, C] = names
  const k = int(rng, 1, 6)
  const fig = cevianFig(names, k, 0, rng)
  const T = C2(k + 2)
  return {
    text: `În triunghiul ${A}${B}${C} din figură, din vârful ${A} s-au trasat ${k === 1 ? 'un segment' : `${k} segmente`} până pe latura ${B}${C}. Câte triunghiuri sunt în figură?`,
    solution: lines(
      `Fiecare triunghi are vârful ${A} și latura opusă pe ${B}${C}. Pe ${B}${C} sunt $${k} + 2 = ${k + 2}$ puncte (${B}, ${C} și capetele celor ${k} segmente), iar oricare două dintre ele dau un triunghi:`,
      show(`${k + 2} \\cdot ${k + 1} : 2 = ${T}`),
      `În figură sunt ${de(T)} triunghiuri.`,
    ),
    verify: () => countCevian(k, 0) === T,
    fig,
  }
}

/** The same with one segment parallel to the side, cutting them all. p. 6, test 2, ex. 2. */
export function d1CountCeviansParallel(rng: Rng): Made {
  const names = pick(rng, NAMES3)
  const [A, B, C] = names
  const k = int(rng, 1, 5)
  const fig = cevianFig(names, k, 1, rng)
  const T = 2 * C2(k + 2)
  return {
    text: `În triunghiul ${A}${B}${C} din figură, din vârful ${A} pornesc ${k === 1 ? 'un segment' : `${k} segmente`} până pe latura ${B}${C}, iar un segment paralel cu ${B}${C} taie toate segmentele care pornesc din ${A}. Câte triunghiuri sunt în figură?`,
    solution: lines(
      `Orice triunghi din figură are vârful ${A}, două laturi pe segmentele care pornesc din ${A} (sunt $${k} + 2 = ${k + 2}$, cu ${A}${B} și ${A}${C}) și a treia latură pe ${B}${C} sau pe segmentul paralel.`,
      `Pe fiecare dintre cele două baze sunt $${k + 2} \\cdot ${k + 1} : 2 = ${C2(k + 2)}$ triunghiuri:`,
      show(`2 \\cdot ${C2(k + 2)} = ${T}`),
    ),
    verify: () => countCevian(k, 1) === T,
    fig,
  }
}

/** k segments from the vertex and m parallels to the opposite side: (m+1)·C(k+2, 2). p. 6–7, counting (harder). */
export function d1CountCeviansParallels(rng: Rng): Made {
  const names = pick(rng, NAMES3)
  const [A, B, C] = names
  const k = int(rng, 1, 5)
  const m = int(rng, 2, 3)
  const fig = cevianFig(names, k, m, rng)
  const T = (m + 1) * C2(k + 2)
  return {
    text: `În triunghiul ${A}${B}${C} din figură, din vârful ${A} pornesc ${k === 1 ? 'un segment' : `${k} segmente`} până pe ${B}${C}, iar ${m} segmente paralele cu ${B}${C} le taie pe toate. Câte triunghiuri sunt în figură?`,
    solution: lines(
      `Un triunghi are vârful ${A}, două laturi pe două dintre cele ${k + 2} segmente care pornesc din ${A} și baza pe ${B}${C} sau pe una dintre cele ${m} paralele (în total ${m + 1} baze). Două drepte paralele nu pot fi laturi ale aceluiași triunghi.`,
      show(`(${m} + 1) \\cdot \\frac{${k + 2} \\cdot ${k + 1}}{2} = ${m + 1} \\cdot ${C2(k + 2)} = ${T}`),
    ),
    verify: () => countCevian(k, m) === T,
    fig,
  }
}

/** The equilateral triangle with each side cut in n: all its triangles, up and down; and the side of a small one. p. 6, test 1, ex. 2. */
export function d1CountTriGrid(rng: Rng): Made {
  const n = int(rng, 2, 5)
  const L = n * int(rng, 1, 8)
  const g = triGrid(n)
  const fig: Fig = { w: g.w, h: g.h, p: {}, path: [{ d: g.grid }] }
  const up = range(1, n).map((s) => ((n - s + 1) * (n - s + 2)) / 2)
  const down = range(1, Math.floor(n / 2)).map((s) => ((n - 2 * s + 1) * (n - 2 * s + 2)) / 2)
  const T = [...up, ...down].reduce((x, y) => x + y, 0)
  return {
    text: lines(
      `Fiecare latură a triunghiului echilateral din figură, lungă de $${L}\\text{ cm}$, este împărțită în ${n} părți egale, iar prin punctele de împărțire s-au dus paralele la laturi.`,
      `a) Câte triunghiuri sunt în figură? b) Ce perimetru are un triunghi mic?`,
    ),
    solution: lines(
      `a) Numărăm după mărime. Cu vârful în sus: ${up.map((u, i) => `cu latura de ${i + 1} ${i ? 'părți' : 'parte'}: ${u}`).join('; ')}.`,
      `Cu vârful în jos: ${down.map((d, i) => `cu latura de ${i + 1} ${i ? 'părți' : 'parte'}: ${d}`).join('; ')}.`,
      show(`${[...up, ...down].join(' + ')} = ${T}`),
      `b) Latura unui triunghi mic este $${L} : ${n} = ${L / n}\\text{ cm}$, deci perimetrul este $3 \\cdot ${L / n} = ${(3 * L) / n}\\text{ cm}$.`,
    ),
    verify: () => T === Math.floor((n * (n + 2) * (2 * n + 1)) / 8) && g.small.length === n * n,
    fig,
  }
}

const countSquares = (c: number, r: number) => {
  let t = 0
  for (let s = 1; s <= Math.min(c, r); s++) for (let x = 0; x + s <= c; x++) for (let y = 0; y + s <= r; y++) t++
  return t
}

/** All the squares of a grid of r rows of c. p. 7, test 4, ex. 2. */
export function d1CountSquares(rng: Rng): Made {
  const c = int(rng, 2, 6), r = int(rng, 2, Math.min(c, 5))
  const fig = shadedGrid(c, r, [], 32)
  const by = range(1, Math.min(c, r)).map((s) => (c - s + 1) * (r - s + 1))
  const T = by.reduce((x, y) => x + y, 0)
  return {
    text: `Dreptunghiul din figură are ${r} rânduri a câte ${c} pătrățele egale. Câte pătrate sunt în figură (de toate mărimile)?`,
    solution: lines(
      `Numărăm după latură (în pătrățele): ${by.map((b, i) => `cu latura ${i + 1}: $${c - i} \\cdot ${r - i} = ${b}$`).join('; ')}.`,
      show(`${by.join(' + ')} = ${T}`),
    ),
    verify: () => countSquares(c, r) === T,
    fig,
  }
}

/** All the rectangles (squares too) of a grid: C(c+1, 2)·C(r+1, 2). p. 7, test 4, ex. 2 (harder). */
export function d1CountRectangles(rng: Rng): Made {
  const c = int(rng, 2, 6), r = int(rng, 1, 4)
  const fig = shadedGrid(c, r, [], 32)
  const T = C2(c + 1) * C2(r + 1)
  let brute = 0
  for (let x1 = 0; x1 <= c; x1++) for (let x2 = x1 + 1; x2 <= c; x2++) for (let y1 = 0; y1 <= r; y1++) for (let y2 = y1 + 1; y2 <= r; y2++) brute++
  return {
    text: `Dreptunghiul din figură este împărțit în ${r === 1 ? 'un rând' : `${r} rânduri`} a câte ${c} pătrățele egale. Câte dreptunghiuri sunt în figură, socotind și pătratele?`,
    solution: lines(
      `Un dreptunghi este hotărât de două dintre cele ${c + 1} linii verticale și de două dintre cele ${r + 1} linii orizontale.`,
      `Perechi de linii verticale: $${c + 1} \\cdot ${c} : 2 = ${C2(c + 1)}$; perechi de linii orizontale: $${r + 1} \\cdot ${r} : 2 = ${C2(r + 1)}$.`,
      show(`${C2(c + 1)} \\cdot ${C2(r + 1)} = ${T}`),
    ),
    verify: () => brute === T,
    fig,
  }
}

/** a points on d, b points on a parallel e: the triangles and segments they determine. pp. 6–7, counting (harder). */
export function d1CountTwoLines(rng: Rng): Made {
  const a = int(rng, 2, 5), b = int(rng, 2, 5)
  const top = ['A', 'B', 'C', 'D', 'E'].slice(0, a)
  const bot = ['M', 'N', 'P', 'Q', 'R'].slice(0, b)
  const p: Record<string, Pt> = {}
  const l: Fig['l'] = {}
  const xs = (k: number, off: number) => range(0, k - 1).map((i) => f1(30 + off + (250 * i) / Math.max(k - 1, 1) * (k === 1 ? 0 : 1) + int(rng, -12, 12)))
  xs(a, 0).forEach((x, i) => { p[top[i]] = [x, 25]; l[top[i]] = 'n' })
  xs(b, 10).forEach((x, i) => { p[bot[i]] = [x, 85]; l[bot[i]] = 's' })
  const fig: Fig = {
    w: 320, h: 105, p, l,
    dot: [...top, ...bot].join(' '),
    path: [{ d: 'M0 25 L320 25 M0 85 L320 85' }],
    t: [{ at: [316, 18], s: 'd', anchor: 'end', italic: true, size: 13 }, { at: [316, 78], s: 'e', anchor: 'end', italic: true, size: 13 }],
  }
  const T = C2(a) * b + a * C2(b)
  const S = C2(a + b)
  const pts = [...top.map(() => 0), ...bot.map(() => 1)]
  let brute = 0
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) for (let k = j + 1; k < pts.length; k++) if (!(pts[i] === pts[j] && pts[j] === pts[k])) brute++
  return {
    text: lines(
      `Pe dreapta $d$ din figură sunt marcate ${a} puncte, iar pe dreapta $e$, paralelă cu $d$, ${b} puncte.`,
      `a) Câte triunghiuri au toate vârfurile printre aceste puncte? b) Câte segmente au ambele capete printre ele?`,
    ),
    solution: lines(
      `a) Trei puncte de pe aceeași dreaptă nu formează triunghi, deci un triunghi are două vârfuri pe o dreaptă și unul pe cealaltă.`,
      `Două pe $d$ și unul pe $e$: $${a} \\cdot ${a - 1} : 2 \\cdot ${b} = ${C2(a) * b}$; unul pe $d$ și două pe $e$: $${a} \\cdot ${b} \\cdot ${b - 1} : 2 = ${a * C2(b)}$.`,
      show(`${C2(a) * b} + ${a * C2(b)} = ${T}`),
      `b) Oricare două dintre cele $${a + b}$ puncte dau un segment: $${a + b} \\cdot ${a + b - 1} : 2 = ${S}$.`,
    ),
    verify: () => brute === T && S === C2(a) + C2(b) + a * b,
    fig,
  }
}

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d1-number-line', label: 'Axa numerelor (culegerea cu puișorul)', topic: 'Algebră', joins: 'v-number-line',
    forms: { 1: [d1AxisReadLabeled, d1AxisFromA, d1AxisWhichLetter], 2: [d1AxisDistances, d1AxisNoZero, d1AxisMidpoint], 3: [d1AxisFromLength, d1AxisNoZero] },
  },
  {
    id: 'v-d1-fraction-figures', label: 'Fracții pe figuri (culegerea cu puișorul)', topic: 'Algebră', joins: 'v-fraction-figures',
    forms: { 1: [d1StripFraction, d1CircleFraction, d1GridFraction], 2: [d1SquareEight, d1TriangleSix, d1GridToShade], 3: [d1SquareMixed, d1StripDiagonals, d1TriangleGridFraction] },
  },
  {
    id: 'v-d1-count-figures', label: 'Numărarea figurilor (culegerea cu puișorul)', topic: 'Geometrie', joins: 'v-count-figures',
    forms: { 1: [d1CountSegments, d1CountCevians], 2: [d1CountTriGrid, d1CountSquares, d1CountCeviansParallel], 3: [d1CountRectangles, d1CountTwoLines, d1CountCeviansParallels] },
  },
]

export const CONTEST: DrawnContest[] = []
