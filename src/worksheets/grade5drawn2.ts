// Grade V exercises with drawings from the workbook "cu puișorul", pp. 43–79 (photos 38–74 of 14 November 2026),
// which the first pass skipped: the shaded parts of a figure (3.1, p. 44, ex. 1; fractions equivalent on figures,
// 3.2, p. 46), fractions and decimals on the number line (3.3, p. 47, ex. 3–10; 4.2, p. 62, ex. 3) and the tables and
// charts of 4.11 (pp. 77–79). Every form draws its figure (`fig`) from the same numbers it asks about.
// Levels: the stars of the book (* = 1, ** = 2, *** = 3); 4.11 has a single star for the whole section, so there the
// level follows the content (reading = 1, a mean or a missing value = 2, several steps = 3).
// The other pages (pp. 45, 48–76) have no drawings: only computations and word problems.
import type { Made } from './generators'
import type { DrawnKind, DrawnContest } from './grade5drawn'
import { barChart, numberLine, table } from './figures5'
import { onCircle, plane, type Fig, type Pt } from '../models/figure'
import { frac, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const same = (x: number, y: number) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))

/** n / 10^k with the Romanian comma in LaTeX: D(235, 2) = 2{,}35; the zeros at the end are dropped. */
function D(n: number, k: number): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  const part = k > 0 ? s.slice(s.length - k).replace(/0+$/, '') : ''
  return (n < 0 ? '-' : '') + s.slice(0, s.length - k) + (part ? `{,}${part}` : '')
}
/** The same on a figure: 2,35. */
const Df = (n: number, k: number) => D(n, k).replace('{,}', ',')
/** Money on a figure, always with two decimals: 1,25. */
const lei = (cents: number) => `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')}`

/** "a counted noun": "$7$ pătrățele", "$24$ de pătrățele". */
const cnt = (n: number, noun: string) => {
  const r = n % 100
  return `$${n}$${(r === 0 && n !== 0) || r >= 20 ? ' de' : ''} ${noun}`
}
/** p/q as written first, then simplified when it can be: \frac{6}{8} = \frac{3}{4}. */
const fracAns = (p: number, q: number) => (gcd(p, q) > 1 ? `\\frac{${p}}{${q}} = ${frac(p, q)}` : `\\frac{${p}}{${q}}`)
/** p/q > 0 as a mixed number: 1\frac{1}{2}, 3, \frac{3}{4}. */
function mixed(p: number, q: number): string {
  const [n, d] = reduce(p, q)
  if (d === 1) return String(n)
  const w = Math.floor(n / d)
  return (w ? String(w) : '') + `\\frac{${n % d}}{${d}}`
}
const LETTERS = [['A', 'B', 'C', 'D', 'E'], ['M', 'N', 'P', 'Q', 'R'], ['E', 'F', 'G', 'H', 'K']]
const listAnd = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} și ${xs[xs.length - 1]}`)
/** k different numbers from 0 … n−1, in increasing order. */
const choose = (rng: Rng, n: number, k: number) => shuffle(rng, Array.from({ length: n }, (_, i) => i)).slice(0, k).sort((a, b) => a - b)

// ---------- drawing helpers ----------
/** A grid of cols × rows squares at (x0, y0), the given cells (index r·cols + c) hatched. */
function gridPaths(cols: number, rows: number, cells: number[], cell: number, x0 = 0, y0 = 0): NonNullable<Fig['path']> {
  const w = cols * cell, h = rows * cell
  const ls: string[] = []
  for (let i = 0; i <= cols; i++) ls.push(`M${x0 + i * cell} ${y0} L${x0 + i * cell} ${y0 + h}`)
  for (let j = 0; j <= rows; j++) ls.push(`M${x0} ${y0 + j * cell} L${x0 + w} ${y0 + j * cell}`)
  return [
    ...cells.map((i) => ({ d: `M${x0 + (i % cols) * cell} ${y0 + Math.floor(i / cols) * cell} h${cell} v${cell} h${-cell} Z`, hatch: true })),
    { d: ls.join(' ') },
  ]
}
/** A disc at c cut into n equal sectors from the top, clockwise, the given ones hatched. */
function discParts(c: Pt, r: number, n: number, shaded: number[]): { c: NonNullable<Fig['c']>; path: NonNullable<Fig['path']> } {
  const at = (k: number) => onCircle(c, r, 90 - (360 * k) / n)
  const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`
  return {
    c: [{ at: c, r }],
    path: [
      ...shaded.map((k) => ({ d: `M${f(c)} L${f(at(k))} A${r} ${r} 0 0 1 ${f(at(k + 1))} Z`, hatch: true })),
      { d: Array.from({ length: n }, (_, k) => `M${f(c)} L${f(at(k))}`).join(' ') },
    ],
  }
}
const hatched = (fig: Fig) => (fig.path ?? []).filter((p) => p.hatch).length

/** Where a point of `numberLine` (default width) lies, read back from the drawing. */
const readLine = (fig: Fig, name: string, from: number, to: number) => from + ((fig.p[name][0] - 14) / (fig.w - 38)) * (to - from)

/** A fraction axis: 0 … T, every unit cut in d parts; points at the given ticks. */
function fracLine(T: number, d: number, names: string[], ticks: number[]): Fig {
  return numberLine({
    from: 0, to: T, step: 1 / d,
    labels: Array.from({ length: T + 1 }, (_, i) => i),
    points: names.map((name, i) => ({ name, at: ticks[i] / d })),
  })
}
/** count ticks among 1 … total−1, increasing, at least `gap` apart, none in `avoid`. */
function ticksApart(rng: Rng, total: number, count: number, gap: number, avoid: (t: number) => boolean): number[] {
  for (;;) {
    const ts = choose(rng, total - 1, count).map((t) => t + 1)
    if (ts.some(avoid)) continue
    if (ts.every((t, i) => i === 0 || t - ts[i - 1] >= gap)) return ts
  }
}

// ======================= shaded parts (3.1, p. 44, ex. 1; 3.2, p. 46) =======================

/** A bar cut into equal parts, some hatched: the fraction hatched or not, p. 44, ex. 1 a–f. */
export function d2ShadedBar(rng: Rng): Made {
  const n = int(rng, 3, 10)
  const k = int(rng, 1, n - 1)
  const cells = choose(rng, n, k)
  const [subj, cut, whole] = pick(rng, [
    ['Dreptunghiul', 'împărțit', 'dreptunghi'], ['Banda de hârtie', 'împărțită', 'bandă'], ['Tableta de ciocolată', 'împărțită', 'tabletă'],
  ])
  const shadedAsked = rng() < 0.6
  const m = shadedAsked ? k : n - k
  const cell = n > 8 ? 30 : 36
  const fig: Fig = { w: n * cell, h: cell, p: {}, path: gridPaths(n, 1, cells, cell) }
  return {
    text: `${subj} din figura alăturată este ${cut} în ${cnt(n, 'părți egale')}. Ce fracție din ${whole} reprezintă porțiunea ${shadedAsked ? 'hașurată' : 'nehașurată'}?`,
    solution: lines(
      `Întregul are $${n}$ părți egale. Părți hașurate: $${k}$; părți nehașurate: $${n - k}$. Porțiunea ${shadedAsked ? 'hașurată' : 'nehașurată'} reprezintă:`,
      show(fracAns(m, n)),
    ),
    verify: () => hatched(fig) === k && (shadedAsked ? hatched(fig) : n - hatched(fig)) === m,
    fig,
  }
}

/** A disc cut into equal sectors, some hatched (a pizza, a cake), p. 44, ex. 1 l–p. */
export function d2ShadedCircle(rng: Rng): Made {
  const n = pick(rng, [3, 4, 5, 6, 8, 10, 12])
  const k = int(rng, 1, n - 1)
  const parts = choose(rng, n, k)
  const [subj, piece] = pick(rng, [['Discul', 'sectoare'], ['Pizza', 'felii'], ['Tortul', 'felii'], ['Cercul', 'sectoare']])
  const shadedAsked = rng() < 0.6
  const m = shadedAsked ? k : n - k
  const d = discParts([62, 62], 62, n, parts)
  const fig: Fig = { w: 124, h: 124, p: {}, ...d }
  const eaten = subj === 'Pizza' || subj === 'Tortul'
  return {
    text: `${subj} din figura alăturată este ${subj === 'Pizza' ? 'tăiată' : eaten ? 'tăiat' : 'împărțit'} în ${cnt(n, `${piece} egale`)}. ${eaten ? `Porțiunea hașurată a fost mâncată. Ce fracție din ${subj === 'Pizza' ? 'pizza' : 'tort'} ${shadedAsked ? 's-a mâncat' : 'a rămas'}?` : `Ce fracție din ${subj === 'Discul' ? 'disc' : 'cerc'} reprezintă porțiunea ${shadedAsked ? 'hașurată' : 'nehașurată'}?`}`,
    solution: lines(
      `Sunt $${n}$ ${piece} egale. Hașurate: $${k}$; nehașurate: $${n - k}$. Răspunsul este:`,
      show(fracAns(m, n)),
    ),
    verify: () => hatched(fig) === k && m === (shadedAsked ? k : n - k),
    fig,
  }
}

/** A grid of squares, some hatched: the fraction, in lowest terms, p. 44, ex. 1 g–j. */
export function d2ShadedGrid(rng: Rng): Made {
  const cols = int(rng, 2, 5), rows = int(rng, 2, 4)
  const N = cols * rows
  const k = int(rng, 1, N - 1)
  const cells = choose(rng, N, k)
  const fig: Fig = { w: cols * 30, h: rows * 30, p: {}, path: gridPaths(cols, rows, cells, 30) }
  const shadedAsked = rng() < 0.6
  const m = shadedAsked ? k : N - k
  return {
    text: `Figura alăturată are ${cnt(rows, 'rânduri')} a câte ${cnt(cols, 'pătrățele egale')}. Ce fracție din figură reprezintă pătrățelele ${shadedAsked ? 'hașurate' : 'nehașurate'}? Scrie fracția ireductibilă.`,
    solution: lines(
      `Figura are $${rows} \\cdot ${cols} = ${N}$ pătrățele. Hașurate: $${k}$; nehașurate: $${N - k}$. Fracția cerută este:`,
      show(fracAns(m, N)),
      gcd(m, N) > 1 ? `Am simplificat prin $${gcd(m, N)}$.` : 'Fracția este deja ireductibilă.',
    ),
    verify: () => hatched(fig) === k && reduce(m, N)[1] * m === reduce(m, N)[0] * N,
    fig,
  }
}

/** A square cut by its diagonals and its middle lines into 8 equal triangles, some hatched: the fraction and the
 * area, p. 44, ex. 1 k. */
export function d2SquareEighths(rng: Rng): Made {
  const a = pick(rng, [4, 8, 12, 16, 20])
  const k = int(rng, 1, 7)
  const tri = ['O-A-M', 'O-M-B', 'O-B-N', 'O-N-C', 'O-C-P', 'O-P-D', 'O-D-Q', 'O-Q-A']
  const chosen = choose(rng, 8, k)
  const pts: Record<string, Pt> = { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], O: [2, 2], M: [2, 0], N: [4, 2], P: [2, 4], Q: [0, 2] }
  const fig = plane(pts, 150, {
    s: 'A-B-C-D-A A-C B-D M-P Q-N',
    hatch: chosen.map((i) => tri[i]),
    l: Object.fromEntries(Object.keys(pts).map((n) => [n, ''])),
  })
  const shadedAsked = rng() < 0.6
  const m = shadedAsked ? k : 8 - k
  const area = (a * a * m) / 8
  return {
    text: `Pătratul din figura alăturată are latura de $${a}\\text{ cm}$ și este împărțit de diagonale și de liniile mijlocii în $8$ triunghiuri egale. a) Ce fracție din pătrat reprezintă porțiunea ${shadedAsked ? 'hașurată' : 'nehașurată'}? b) Ce arie are această porțiune?`,
    solution: lines(
      `a) Din cele $8$ triunghiuri egale, hașurate sunt $${k}$, iar nehașurate $${8 - k}$. Porțiunea ${shadedAsked ? 'hașurată' : 'nehașurată'} reprezintă:`,
      show(fracAns(m, 8)),
      `b) Aria pătratului este $${a} \\cdot ${a} = ${a * a}\\text{ cm}^2$, iar porțiunea cerută are $\\frac{${m}}{8}$ din ea:`,
      show(`${a * a} : 8 \\cdot ${m} = ${(a * a) / 8} \\cdot ${m} = ${area}\\text{ cm}^2`),
    ),
    verify: () => (fig.hatch ?? []).length === k && same(area * 8, a * a * m),
    fig,
  }
}

/** An empty grid: how many squares must be hatched so that they make p/q of it, p. 44 (shade a given fraction). */
export function d2ShadeHowMany(rng: Rng): Made {
  for (;;) {
    const cols = int(rng, 3, 8), rows = int(rng, 2, 4)
    const N = cols * rows
    const q = pick(rng, [2, 3, 4, 5, 6, 8, 10, 12])
    if (N % q !== 0 || q === N) continue
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const ans = (N / q) * p
    const fig: Fig = { w: cols * 28, h: rows * 28, p: {}, path: gridPaths(cols, rows, [], 28) }
    return {
      text: `Câte pătrățele din figura alăturată trebuie hașurate pentru ca partea hașurată să reprezinte $\\frac{${p}}{${q}}$ din figură?`,
      solution: lines(
        `Figura are $${rows} \\cdot ${cols} = ${N}$ pătrățele egale. Aflăm $\\frac{${p}}{${q}}$ din $${N}$: împărțim la $${q}$ și înmulțim cu $${p}$.`,
        show(`${N} : ${q} \\cdot ${p} = ${N / q} \\cdot ${p} = ${ans}`),
        `Trebuie hașurate ${cnt(ans, 'pătrățele')}.`,
      ),
      verify: () => ans * q === N * p && hatched(fig) === 0,
      fig,
    }
  }
}

/** A grid of 10, 20, 25 or 50 squares, some hatched: the percent hatched and not hatched, p. 44, ex. 6–7. */
export function d2ShadedPercent(rng: Rng): Made {
  const [cols, rows] = pick(rng, [[5, 2], [5, 4], [10, 2], [5, 5], [10, 5], [4, 5]] as [number, number][])
  const N = cols * rows
  const k = int(rng, 1, N - 1)
  const cells = choose(rng, N, k)
  const cell = cols > 5 ? 26 : 32
  const fig: Fig = { w: cols * cell, h: rows * cell, p: {}, path: gridPaths(cols, rows, cells, cell) }
  const pct = (k * 100) / N
  const step = 100 / N
  const P = step * int(rng, 1, N - 1)
  const want = P / step
  return {
    text: `Figura alăturată este formată din ${cnt(N, 'pătrățele egale')}. a) Ce procent din figură este hașurat? Ce procent nu este hașurat? b) Câte pătrățele ar trebui să fie hașurate pentru ca partea hașurată să fie de $${P}\\%$ din figură?`,
    solution: lines(
      `a) Sunt $${k}$ pătrățele hașurate din $${N}$. Scriem fracția cu numitorul $100$:`,
      show(`\\frac{${k}}{${N}} = \\frac{${k} \\cdot ${step}}{${N} \\cdot ${step}} = \\frac{${pct}}{100} = ${pct}\\%`),
      'Partea nehașurată este restul până la $100\\%$:',
      show(`100\\% - ${pct}\\% = ${100 - pct}\\%`),
      `b) Un pătrățel reprezintă $100\\% : ${N} = ${step}\\%$, deci:`,
      show(`${P} : ${step} = ${want}`),
      `Ar trebui hașurate ${cnt(want, 'pătrățele')}${want === k ? ', exact câte sunt acum' : want > k ? `, adică încă $${want - k}$` : `, adică cu $${k - want}$ mai puține decât acum`}.`,
    ),
    verify: () => hatched(fig) === k && same(pct / 100, k / N) && same((want * 100) / N, P),
    fig,
  }
}

/** Two equal discs (two pizzas), each a whole, some sectors hatched: the fraction together, sub-, equal to or
 * greater than one, p. 44, ex. 1 with 3.1 (fracții echiunitare, subunitare, supraunitare). */
export function d2TwoCircles(rng: Rng): Made {
  const n = pick(rng, [3, 4, 5, 6, 8])
  const a = int(rng, 1, n)
  const b = int(rng, 1, n - 1)
  const s1 = choose(rng, n, a), s2 = choose(rng, n, b)
  const d1 = discParts([50, 50], 50, n, s1), d2 = discParts([170, 50], 50, n, s2)
  const fig: Fig = { w: 220, h: 100, p: {}, c: [...d1.c, ...d2.c], path: [...d1.path, ...d2.path] }
  const t = a + b
  const kind = t < n ? 'subunitară' : t === n ? 'echiunitară' : 'supraunitară'
  const [what, piece, gen] = pick(rng, [['Două pizza egale', 'felii', 'dintr-o pizza'], ['Două discuri egale', 'sectoare', 'dintr-un disc'], ['Două torturi egale', 'felii', 'dintr-un tort']])
  return {
    text: `${what} sunt împărțite fiecare în ${cnt(n, `${piece} egale`)}, ca în figura alăturată. Fiecare reprezintă un întreg. Ce fracție ${gen} reprezintă împreună părțile hașurate? Este fracția subunitară, echiunitară sau supraunitară?`,
    solution: lines(
      `O parte este $\\frac{1}{${n}}$ dintr-un întreg. Sunt hașurate $${a}$ părți în prima figură și $${b}$ în a doua, adică $${a} + ${b} = ${t}$ părți:`,
      show(`\\frac{${a}}{${n}} + \\frac{${b}}{${n}} = ${fracAns(t, n)}`),
      t < n ? `Numărătorul $${t}$ este mai mic decât numitorul $${n}$, deci fracția este subunitară.`
        : t === n ? `Numărătorul este egal cu numitorul, deci fracția este echiunitară (un întreg).`
        : `Numărătorul $${t}$ este mai mare decât numitorul $${n}$, deci fracția este supraunitară: $\\frac{${t}}{${n}} = ${mixed(t, n)}$.`,
    ),
    verify: () => hatched(fig) === t && (kind === 'subunitară') === (t < n) && (kind === 'supraunitară') === (t > n),
    fig,
  }
}

const GRIDS: [number, number][] = [[2, 2], [3, 2], [4, 2], [3, 3], [4, 3], [5, 2], [6, 2], [4, 4], [5, 3], [6, 3], [5, 4], [6, 4]]

/** Two figures: how many squares of the second must be hatched for the two fractions to be equivalent, 3.2, p. 46. */
export function d2EquivalentGrids(rng: Rng): Made {
  for (;;) {
    const q = pick(rng, [2, 3, 4, 5, 6])
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const [c1, r1] = pick(rng, GRIDS), [c2, r2] = pick(rng, GRIDS)
    const N1 = c1 * r1, N2 = c2 * r2
    if (N1 % q || N2 % q || N1 === N2) continue
    const k1 = (N1 / q) * p
    const ans = (N2 / q) * p
    const cell = 26, x2 = c1 * cell + 40
    const h = Math.max(r1, r2) * cell
    const fig: Fig = {
      w: x2 + c2 * cell, h: h + 22, p: {},
      path: [...gridPaths(c1, r1, choose(rng, N1, k1), cell), ...gridPaths(c2, r2, [], cell, x2)],
      t: [{ at: [(c1 * cell) / 2, h + 18], s: 'Figura 1', size: 11 }, { at: [x2 + (c2 * cell) / 2, h + 18], s: 'Figura 2', size: 11 }],
    }
    return {
      text: `Figura 1 are ${cnt(N1, 'pătrățele egale')}, iar figura 2 are ${cnt(N2, 'pătrățele egale')}. Câte pătrățele din figura 2 trebuie hașurate pentru ca partea hașurată să reprezinte din ea o fracție echivalentă cu partea hașurată din figura 1?`,
      solution: lines(
        `În figura 1 sunt hașurate $${k1}$ pătrățele din $${N1}$; simplificăm:`,
        show(fracAns(k1, N1)),
        `Amplificăm fracția $\\frac{${p}}{${q}}$ ca să aibă numitorul $${N2}$ (cu $${N2 / q}$):`,
        show(`\\frac{${p}}{${q}} = \\frac{${p} \\cdot ${N2 / q}}{${q} \\cdot ${N2 / q}} = \\frac{${ans}}{${N2}}`),
        `În figura 2 trebuie hașurate ${cnt(ans, 'pătrățele')}.`,
      ),
      verify: () => ans * N1 === k1 * N2 && hatched(fig) === k1,
      fig,
    }
  }
}

/** A grid with some squares hatched: how many more must be hatched so that the hatched part is p/q, p. 44 and 46. */
export function d2ShadeMore(rng: Rng): Made {
  for (;;) {
    const [cols, rows] = pick(rng, GRIDS)
    const N = cols * rows
    const q = pick(rng, [2, 3, 4, 5, 6, 8])
    if (N % q || q === N) continue
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const goal = (N / q) * p
    if (goal < 2) continue
    const k = int(rng, 1, goal - 1)
    const fig: Fig = { w: cols * 30, h: rows * 30, p: {}, path: gridPaths(cols, rows, choose(rng, N, k), 30) }
    return {
      text: `Câte pătrățele mai trebuie hașurate în figura alăturată pentru ca partea hașurată să reprezinte $\\frac{${p}}{${q}}$ din figură?`,
      solution: lines(
        `Figura are $${rows} \\cdot ${cols} = ${N}$ pătrățele, iar $\\frac{${p}}{${q}}$ din ele înseamnă:`,
        show(`${N} : ${q} \\cdot ${p} = ${goal}`),
        `Pătrățele hașurate deja: $${k}$. Mai trebuie hașurate:`,
        show(`${goal} - ${k} = ${goal - k}`),
      ),
      verify: () => hatched(fig) + (goal - k) === (N * p) / q,
      fig,
    }
  }
}

// ======================= the number line (3.3, p. 47, ex. 3–10; 4.2, p. 62, ex. 3) =======================

/** The coordinates of three points on an axis whose units are cut in d parts, p. 47, ex. 6 and 9. */
export function d2AxisCoords(rng: Rng): Made {
  const d = int(rng, 2, 6)
  const T = Math.min(4, Math.floor(24 / d))
  const names = pick(rng, LETTERS).slice(0, 3)
  const ts = ticksApart(rng, T * d, 3, 2, (t) => t % d === 0)
  const fig = fracLine(T, d, names, ts)
  return {
    text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în ${cnt(d, 'părți egale')}. Aflați coordonatele punctelor $${names[0]}$, $${names[1]}$ și $${names[2]}$.`,
    solution: lines(
      `O diviziune mică reprezintă $\\frac{1}{${d}}$. Numărăm diviziunile de la $0$ până la fiecare punct:`,
      ...names.map((n, i) => show(`${n}\\left(${fracAns(ts[i], d)}\\right)`)),
    ),
    verify: () => names.every((n, i) => same(readLine(fig, n, 0, T), ts[i] / d)),
    fig,
  }
}

/** Which letters stand at two given fractions, p. 47, ex. 4–5, 7–8 (place the numbers on the axis). */
export function d2AxisWhichLetter(rng: Rng): Made {
  const d = int(rng, 2, 6)
  const T = Math.min(4, Math.floor(24 / d))
  const names = pick(rng, LETTERS).slice(0, 4)
  const ts = ticksApart(rng, T * d, 4, 2, (t) => t % d === 0)
  const fig = fracLine(T, d, names, ts)
  const [i, j] = choose(rng, 4, 2)
  const asked = shuffle(rng, [i, j])
  return {
    text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în ${cnt(d, 'părți egale')}. Ce litere corespund numerelor $${frac(ts[asked[0]], d)}$ și $${frac(ts[asked[1]], d)}$?`,
    solution: lines(
      `O diviziune reprezintă $\\frac{1}{${d}}$. Scriem fiecare număr cu numitorul $${d}$ și numărăm diviziunile de la $0$:`,
      ...asked.map((x) => show(`${gcd(ts[x], d) > 1 ? `${frac(ts[x], d)} = ` : ''}\\frac{${ts[x]}}{${d}} \\Rightarrow ${names[x]}`)),
      `Numărului $${frac(ts[asked[0]], d)}$ îi corespunde punctul $${names[asked[0]]}$, iar numărului $${frac(ts[asked[1]], d)}$, punctul $${names[asked[1]]}$.`,
    ),
    verify: () => asked.every((x) => same(readLine(fig, names[x], 0, T), ts[x] / d)),
    fig,
  }
}

/** Decimals on an axis cut in tenths: the coordinates and the distance between two points, p. 62, ex. 3. */
export function d2AxisDecimals(rng: Rng): Made {
  const a = int(rng, 0, 9)
  const names = pick(rng, LETTERS).slice(0, 3)
  const ts = ticksApart(rng, 20, 3, 2, (t) => t % 10 === 0)
  const fig = numberLine({ from: a, to: a + 2, step: 0.1, labels: [a, a + 1, a + 2], points: names.map((n, i) => ({ name: n, at: a + ts[i] / 10 })) })
  const v = ts.map((t) => a * 10 + t)
  return {
    text: `Pe axa numerelor din figura alăturată, porțiunea de la $${a}$ la $${a + 2}$ este împărțită în zecimi: distanța dintre două numere naturale consecutive are $10$ părți egale. Aflați coordonatele punctelor $${names[0]}$, $${names[1]}$, $${names[2]}$ și distanța dintre $${names[0]}$ și $${names[2]}$.`,
    solution: lines(
      `O diviziune mică reprezintă o zecime, $0{,}1$. Pornim de la $${a}$ și numărăm zecimile:`,
      ...names.map((n, i) => show(`${n}(${D(v[i], 1)})`)),
      `Distanța dintre $${names[0]}$ și $${names[2]}$ este diferența coordonatelor:`,
      show(`${D(v[2], 1)} - ${D(v[0], 1)} = ${D(v[2] - v[0], 1)}`),
    ),
    verify: () => names.every((n, i) => same(readLine(fig, n, a, a + 2) * 10, v[i])),
    fig,
  }
}

/** Five points on a fraction axis: which coordinates are below 1, equal to 1, above 1, p. 47, ex. 4. */
export function d2AxisAboveOne(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 3, 6)
    const T = Math.min(3, Math.floor(24 / d))
    const names = pick(rng, LETTERS)
    const ts = ticksApart(rng, T * d, 5, 1, (t) => t % d === 0 && t !== d)
    if (!ts.some((t) => t < d) || !ts.some((t) => t > d)) continue
    const fig = fracLine(T, d, names, ts)
    const pts = (f: (t: number) => boolean) => names.filter((_, i) => f(ts[i]))
    const sub = pts((t) => t < d), eq = pts((t) => t === d), sup = pts((t) => t > d)
    const say = (xs: string[]) => listAnd(xs.map((x) => `$${x}$`))
    return {
      text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în ${cnt(d, 'părți egale')}. Scrieți coordonatele punctelor $${names.join('$, $')}$ ca fracții cu numitorul $${d}$ și precizați care sunt subunitare, care echiunitare și care supraunitare.`,
      solution: lines(
        `O diviziune reprezintă $\\frac{1}{${d}}$, iar numărul $1 = \\frac{${d}}{${d}}$ este la a ${d}-a diviziune:`,
        show(names.map((n, i) => `${n}\\left(\\frac{${ts[i]}}{${d}}\\right)`).join(',\\ ')),
        `Fracțiile subunitare (punctele dintre $0$ și $1$): ${say(sub)}. ` +
          (eq.length ? `Fracția echiunitară (punctul din dreptul lui $1$): ${say(eq)}. ` : 'Niciun punct nu este în dreptul lui $1$, deci nu avem fracții echiunitare. ') +
          `Fracțiile supraunitare (punctele de după $1$): ${say(sup)}.`,
      ),
      verify: () => names.every((n, i) => same(readLine(fig, n, 0, T), ts[i] / d)) && sub.length + eq.length + sup.length === 5,
      fig,
    }
  }
}

/** The distance between two points of a fraction axis, in units and in centimetres, p. 47, ex. 3 and 6. */
export function d2AxisDistance(rng: Rng): Made {
  const d = int(rng, 2, 6)
  const T = Math.min(4, Math.floor(24 / d))
  const names = pick(rng, LETTERS).slice(0, 2)
  const ts = ticksApart(rng, T * d, 2, 2, () => false)
  const fig = fracLine(T, d, names, ts)
  const u = d * int(rng, 1, 3)
  const k = ts[1] - ts[0]
  return {
    text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în ${cnt(d, 'părți egale')}, iar segmentul de la $0$ la $1$ are $${u}\\text{ cm}$. Aflați coordonatele punctelor $${names[0]}$ și $${names[1]}$ și lungimea segmentului $${names[0]}${names[1]}$, ca fracție din unitate și în centimetri.`,
    solution: lines(
      'Numărăm diviziunile de la $0$:',
      show(`${names[0]}\\left(${fracAns(ts[0], d)}\\right),\\quad ${names[1]}\\left(${fracAns(ts[1], d)}\\right)`),
      `Între cele două puncte sunt $${k}$ diviziuni, adică:`,
      show(`${names[0]}${names[1]} = \\frac{${ts[1]}}{${d}} - \\frac{${ts[0]}}{${d}} = ${fracAns(k, d)}`),
      `O diviziune are $${u} : ${d} = ${u / d}\\text{ cm}$, deci:`,
      show(`${names[0]}${names[1]} = ${k} \\cdot ${u / d} = ${(k * u) / d}\\text{ cm}`),
    ),
    verify: () => same((readLine(fig, names[1], 0, T) - readLine(fig, names[0], 0, T)) * u, (k * u) / d),
    fig,
  }
}

/** An axis in twelfths: the letters of three fractions, two of them equivalent, p. 47, ex. 7. */
export function d2AxisEquivalent(rng: Rng): Made {
  for (;;) {
    const reps = (v: number) => [2, 3, 4, 6, 12].filter((q) => (v * q) % 12 === 0).map((q) => [(v * q) / 12, q] as [number, number])
    const names = pick(rng, LETTERS)
    const ts = ticksApart(rng, 24, 5, 2, (t) => t % 12 === 0)
    const i1 = int(rng, 0, 4), i2 = int(rng, 0, 4)
    if (i1 === i2) continue
    const r1 = reps(ts[i1])
    if (r1.length < 2) continue
    const [f1, f2] = shuffle(rng, r1).slice(0, 2)
    const f3 = pick(rng, reps(ts[i2]))
    const fig = numberLine({ from: 0, to: 2, step: 1 / 12, labels: [0, 1, 2], points: names.map((n, i) => ({ name: n, at: ts[i] / 12 })) })
    const order = shuffle(rng, [[f1, i1], [f2, i1], [f3, i2]] as [[number, number], number][])
    const ft = ([p, q]: [number, number]) => `\\frac{${p}}{${q}}`
    return {
      text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în $12$ părți egale. Ce litere corespund numerelor $${order.map(([f]) => ft(f)).join('$, $')}$? Ce observați?`,
      solution: lines(
        'O diviziune este $\\frac{1}{12}$. Amplificăm fiecare fracție ca să aibă numitorul $12$:',
        ...order.map(([[p, q], i]) => show(`${q === 12 ? ft([p, q]) : `${ft([p, q])} = \\frac{${p * (12 / q)}}{12}`} \\Rightarrow ${names[i]}`)),
        `Fracțiile $${ft(f1)}$ și $${ft(f2)}$ corespund aceluiași punct, $${names[i1]}$: sunt fracții echivalente, egale cu $${frac(ts[i1], 12)}$.`,
      ),
      verify: () => order.every(([[p, q], i]) => same(readLine(fig, names[i], 0, 2), p / q)) && f1[0] * f2[1] === f2[0] * f1[1],
      fig,
    }
  }
}

/** Two points past 1: the coordinates as improper fractions, then with the wholes taken out, p. 47, ex. 10 and 3.4. */
export function d2AxisMixed(rng: Rng): Made {
  const d = int(rng, 2, 5)
  const T = Math.min(5, Math.floor(24 / d))
  const names = pick(rng, LETTERS).slice(0, 2)
  const ts = ticksApart(rng, T * d, 2, 2, (t) => t % d === 0 || t < d)
  const fig = fracLine(T, d, names, ts)
  return {
    text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în ${cnt(d, 'părți egale')}. Scrieți coordonatele punctelor $${names[0]}$ și $${names[1]}$ ca fracții cu numitorul $${d}$, apoi scoateți întregii din fiecare fracție. Între ce numere naturale consecutive se află fiecare punct?`,
    solution: lines(
      `O diviziune este $\\frac{1}{${d}}$; numărăm diviziunile de la $0$:`,
      ...names.map((n, i) => show(`${n}\\left(\\frac{${ts[i]}}{${d}}\\right),\\quad \\frac{${ts[i]}}{${d}} = ${mixed(ts[i], d)}`)),
      ...names.map((n, i) => `Punctul $${n}$ se află între $${Math.floor(ts[i] / d)}$ și $${Math.floor(ts[i] / d) + 1}$.`),
    ),
    verify: () => names.every((n, i) => same(readLine(fig, n, 0, T), ts[i] / d) && Math.floor(ts[i] / d) * d < ts[i]),
    fig,
  }
}

/** The number halfway between two points of a fraction axis, p. 47 (the midpoint of a segment on the axis). */
export function d2AxisMidpoint(rng: Rng): Made {
  const d = int(rng, 2, 6)
  const T = Math.min(4, Math.floor(24 / d))
  const names = pick(rng, LETTERS).slice(0, 2)
  const ts = ticksApart(rng, T * d, 2, 2, () => false)
  const fig = fracLine(T, d, names, ts)
  const [A, B] = names
  return {
    text: `Pe axa numerelor din figura alăturată, fiecare unitate este împărțită în ${cnt(d, 'părți egale')}. Aflați coordonata mijlocului segmentului $${A}${B}$ și lungimea jumătății lui.`,
    solution: lines(
      `Numărăm diviziunile (o diviziune este $\\frac{1}{${d}}$):`,
      show(`${A}\\left(\\frac{${ts[0]}}{${d}}\\right),\\quad ${B}\\left(\\frac{${ts[1]}}{${d}}\\right)`),
      'Mijlocul are coordonata egală cu media aritmetică a coordonatelor capetelor:',
      show(`\\left(\\frac{${ts[0]}}{${d}} + \\frac{${ts[1]}}{${d}}\\right) : 2 = \\frac{${ts[0] + ts[1]}}{${d}} \\cdot \\frac{1}{2} = ${fracAns(ts[0] + ts[1], 2 * d)}`),
      'Jumătatea segmentului este distanța de la un capăt la mijloc:',
      show(`\\left(\\frac{${ts[1]}}{${d}} - \\frac{${ts[0]}}{${d}}\\right) : 2 = \\frac{${ts[1] - ts[0]}}{${d}} \\cdot \\frac{1}{2} = ${fracAns(ts[1] - ts[0], 2 * d)}`),
    ),
    verify: () => same((readLine(fig, A, 0, T) + readLine(fig, B, 0, T)) / 2, (ts[0] + ts[1]) / (2 * d)),
    fig,
  }
}

// ======================= tables and charts (4.11, pp. 77–79) =======================

const DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']
const DAY = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']

/** The marks of a class in a table: how many have at most / at least a mark, the frequency of a mark, p. 77, ex. 3. */
export function d2GradesTable(rng: Rng): Made {
  const lo = pick(rng, [4, 5])
  const notes = Array.from({ length: 11 - lo }, (_, i) => lo + i)
  const counts = notes.map(() => int(rng, 1, 8))
  const fig = table([['nota', ...notes.map(String)], ['nr. de elevi', ...counts.map(String)]], { cell: 34, first: 90 })
  const X = int(rng, lo + 1, 9), Y = int(rng, lo + 1, 9), F = pick(rng, notes)
  const sum = (f: (n: number) => boolean) => notes.reduce((s, n, i) => s + (f(n) ? counts[i] : 0), 0)
  const atMost = sum((n) => n <= X), atLeast = sum((n) => n >= Y), total = sum(() => true)
  const fq = counts[notes.indexOf(F)]
  const terms = (f: (n: number) => boolean) => notes.map((n, i) => (f(n) ? counts[i] : null)).filter((c) => c !== null).join(' + ')
  return {
    text: `Tabelul alăturat arată notele obținute de elevii unei clase la o lucrare. a) Câți elevi au cel mult nota $${X}$? b) Câți elevi au nota mai mare sau egală cu $${Y}$? c) Câți elevi au scris lucrarea? d) Care este frecvența notei $${F}$?`,
    solution: lines(
      `a) „Cel mult $${X}$” înseamnă notele de la $${lo}$ la $${X}$:`,
      show(`${terms((n) => n <= X)} = ${atMost}`),
      `b) Notele de la $${Y}$ la $10$:`,
      show(`${terms((n) => n >= Y)} = ${atLeast}`),
      'c) Adunăm toate numerele de elevi:',
      show(`${counts.join(' + ')} = ${total}`),
      `d) Frecvența notei $${F}$ este numărul elevilor care au luat-o: $${fq}$.`,
    ),
    verify: () => atMost + sum((n) => n > X) === total && fq === counts[F - lo],
    fig,
  }
}

/** The rain of a week in a bar chart: days over a quantity, days without rain, the total, p. 78, ex. 9. */
export function d2RainChart(rng: Rng): Made {
  for (;;) {
    const v = DAY.map(() => int(rng, 0, 6))
    if (!v.includes(0) || Math.max(...v) < 4) continue
    const k = int(rng, 1, 4)
    const over = v.filter((x) => x > k).length
    if (over === 0) continue
    const dry = DAYS.filter((_, i) => v[i] === 0)
    const total = v.reduce((s, x) => s + x, 0)
    const fig = barChart(DAY, v, 1, { w: 400 })
    return {
      text: `Graficul alăturat arată cantitatea de precipitații, în litri pe metru pătrat, căzută în fiecare zi a unei săptămâni din luna ${pick(rng, ['martie', 'aprilie', 'mai', 'iunie', 'septembrie', 'octombrie', 'noiembrie'])}. a) În câte zile cantitatea a depășit $${k}$ litri? b) În ce zile nu a plouat? c) Câți litri au căzut în toată săptămâna?`,
      solution: lines(
        `Citim din grafic înălțimea fiecărei bare: ${DAYS.map((d, i) => `${d} $${v[i]}$`).join(', ')}.`,
        `a) Valorile mai mari decât $${k}$ sunt $${v.filter((x) => x > k).join(', ')}$, deci în ${cnt(over, over === 1 ? 'zi' : 'zile')}.`,
        `b) Nu a plouat în ${dry.length > 1 ? 'zilele' : 'ziua'} fără bară: ${listAnd(dry)}.`,
        'c) Adunăm valorile:',
        show(`${v.join(' + ')} = ${total}\\text{ litri}`),
      ),
      verify: () => hatched(fig) === 7 && over + v.filter((x) => x <= k).length === 7,
      fig,
    }
  }
}

/** The points of five players in a bar chart: the total and the players with equal points, p. 78, ex. 10. */
export function d2PlayersChart(rng: Rng): Made {
  for (;;) {
    const v = Array.from({ length: 5 }, () => 5 * int(rng, 1, 5))
    const names = ['A', 'B', 'C', 'D', 'E']
    const groups = [...new Set(v)].map((x) => names.filter((_, i) => v[i] === x)).filter((g) => g.length > 1)
    if (groups.length !== 1 || groups[0].length !== 2) continue
    const total = v.reduce((s, x) => s + x, 0)
    const best = names[v.indexOf(Math.max(...v))]
    if (v.filter((x) => x === Math.max(...v)).length > 1) continue
    const fig = barChart(names, v, 5, { w: 320 })
    const X = pick(rng, names.filter((n) => n !== best))
    const vx = v[names.indexOf(X)]
    const game = pick(rng, ['un joc', 'un concurs de aruncări la coș', 'un concurs de întrebări', 'o întrecere de sărituri', 'un joc de darts'])
    return {
      text: `Un grup de $5$ copii, numiți $A$, $B$, $C$, $D$ și $E$, au participat la ${game} și au obținut punctajele din graficul alăturat. a) Câte puncte a obținut grupul în total? b) Care sunt jucătorii cu punctaje egale? c) Cu câte puncte are câștigătorul mai mult decât ultimul clasat? d) Câte puncte i-au lipsit lui $${X}$ ca să-l egaleze pe câștigător?`,
      solution: lines(
        `Citim punctajele: ${names.map((n, i) => `$${n}$: $${v[i]}$`).join(', ')}.`,
        'a) Adunăm:',
        show(`${v.join(' + ')} = ${total}`),
        `b) Punctaje egale au $${groups[0][0]}$ și $${groups[0][1]}$ (câte $${v[names.indexOf(groups[0][0])]}$ puncte).`,
        `c) Câștigătorul este $${best}$, cu $${Math.max(...v)}$ puncte; cel mai mic punctaj este $${Math.min(...v)}$:`,
        show(`${Math.max(...v)} - ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}`),
        `d) $${X}$ are $${vx}$ puncte, iar câștigătorul $${Math.max(...v)}$:`,
        show(`${Math.max(...v)} - ${vx} = ${Math.max(...v) - vx}`),
      ),
      verify: () => hatched(fig) === 5 && total === v[0] + v[1] + v[2] + v[3] + v[4] && Math.max(...v) - vx > 0,
      fig,
    }
  }
}

const EXPRS: { s: string; tex: string; f: (x: number) => number; min: number }[] = [
  { s: '2x', tex: '2x', f: (x) => 2 * x, min: 0 },
  { s: '3x', tex: '3x', f: (x) => 3 * x, min: 0 },
  { s: 'x+5', tex: 'x + 5', f: (x) => x + 5, min: 0 },
  { s: 'x+3', tex: 'x + 3', f: (x) => x + 3, min: 0 },
  { s: '2x+4', tex: '2x + 4', f: (x) => 2 * x + 4, min: 0 },
  { s: '2(x+1)', tex: '2(x + 1)', f: (x) => 2 * (x + 1), min: 0 },
  { s: '2x−3', tex: '2x - 3', f: (x) => 2 * x - 3, min: 2 },
  { s: '3(x+2)', tex: '3(x + 2)', f: (x) => 3 * (x + 2), min: 0 },
  { s: 'x−1', tex: 'x - 1', f: (x) => x - 1, min: 1 },
]

/** Complete a table of expressions in x, p. 77, ex. 1–2. */
export function d2ExprTable(rng: Rng): Made {
  const ex = shuffle(rng, EXPRS).slice(0, 3)
  const min = Math.max(...ex.map((e) => e.min))
  const xs = choose(rng, 20 - min, 4).map((x) => x + min)
  const fig = table([['x', ...ex.map((e) => e.s)], ...xs.map((x) => [String(x), '', '', ''])], { cell: 62, first: 50 })
  return {
    text: `Completați tabelul alăturat: pentru fiecare valoare a lui $x$ din prima coloană, calculați $${ex[0].tex}$, $${ex[1].tex}$ și $${ex[2].tex}$.`,
    solution: lines(
      'Înlocuim $x$ cu fiecare valoare:',
      ...xs.map((x) => show(ex.map((e) => `${e.tex.replace(/(\d)x/, '$1 \\cdot x').replace(/x/g, String(x))} = ${e.f(x)}`).join(',\\quad '))),
    ),
    verify: () => xs.every((x) => ex.every((e) => e.f(x) >= 0)) && fig.t!.length === 4 * 5,
    fig,
  }
}

/** The ages of the children of a school in a table: totals under, over and at least an age, p. 77, ex. 4. */
export function d2AgesTable(rng: Rng): Made {
  const ages = [7, 8, 9, 10, 11, 12, 13, 14]
  const counts = ages.map(() => int(rng, 40, 95))
  const fig = table([['vârsta', ...ages.map(String)], ['nr. copii', ...counts.map(String)]], { cell: 38, first: 76 })
  const A = int(rng, 9, 11), B = int(rng, 11, 13)
  const sum = (f: (a: number) => boolean) => ages.reduce((s, a, i) => s + (f(a) ? counts[i] : 0), 0)
  const terms = (f: (a: number) => boolean) => ages.map((a, i) => (f(a) ? counts[i] : null)).filter((c) => c !== null).join(' + ')
  const total = sum(() => true), under = sum((a) => a < A), over = sum((a) => a > B)
  return {
    text: `Tabelul alăturat arată vârstele copiilor dintr-o școală. a) Câți copii sunt în școală? b) Câți copii au sub $${A}$ ani? c) Câți copii au mai mult de $${B}$ ani? d) Câți copii au cel puțin $${A}$ ani?`,
    solution: lines(
      'a) Adunăm numerele din al doilea rând:',
      show(`${counts.join(' + ')} = ${total}`),
      `b) Copiii de $7$ până la $${A - 1}$ ani:`,
      show(`${terms((a) => a < A)} = ${under}`),
      B === 13 ? `c) Doar copiii de $14$ ani: $${over}$.` : `c) Copiii de $${B + 1}$ până la $14$ ani:`,
      B === 13 ? '' : show(`${terms((a) => a > B)} = ${over}`),
      `d) Cei care au cel puțin $${A}$ ani sunt toți ceilalți în afară de cei de la b):`,
      show(`${total} - ${under} = ${total - under}`),
    ),
    verify: () => total - under === sum((a) => a >= A),
    fig,
  }
}

/** Marks and counts in a table, the counts chosen so that the mean has at most two decimals. */
function marksWithMean(rng: Rng, lo: number, maxCount: number, zeroOk = false) {
  for (;;) {
    const notes = Array.from({ length: 11 - lo }, (_, i) => lo + i)
    const counts = notes.map(() => int(rng, zeroOk ? 0 : 1, maxCount))
    const N = counts.reduce((s, c) => s + c, 0)
    const S = notes.reduce((s, n, i) => s + n * counts[i], 0)
    if (N >= 10 && (S * 100) % N === 0) return { notes, counts, N, S }
  }
}

/** The mean of a class from the table of its marks, p. 77, ex. 6 a. */
export function d2TableMean(rng: Rng): Made {
  const { notes, counts, N, S } = marksWithMean(rng, 4, 7)
  const fig = table([['nota', ...notes.map(String)], ['nr. de elevi', ...counts.map(String)]], { cell: 34, first: 90 })
  return {
    text: `Tabelul alăturat arată notele obținute de cei ${cnt(N, 'elevi')} ai unei clase la un test. Calculați media clasei la acest test.`,
    solution: lines(
      'Suma tuturor notelor: fiecare notă se înmulțește cu numărul elevilor care au luat-o.',
      show(`${notes.map((n, i) => `${n} \\cdot ${counts[i]}`).join(' + ')} = ${S}`),
      `Împărțim la numărul elevilor, $${N}$:`,
      show(`m = ${S} : ${N} = ${D((S * 100) / N, 2)}`),
    ),
    verify: () => same(((S * 100) / N) / 100, S / N) && counts.reduce((s, c) => s + c, 0) === N,
    fig,
  }
}

/** A week of temperatures in a table, Sunday missing, the mean given: Sunday's temperature, p. 77, ex. 7. */
export function d2MissingTemp(rng: Rng): Made {
  for (;;) {
    const t = DAY.slice(0, 6).map(() => int(rng, 2, 16))
    const M = int(rng, 4, 14)
    const sun = 7 * M - t.reduce((s, x) => s + x, 0)
    if (sun < 1 || sun > 20) continue
    const month = pick(rng, ['aprilie', 'mai', 'octombrie', 'martie', 'septembrie'])
    const fig = table([['ziua', ...DAY], ['t (°C)', ...t.map((x) => `${x}°C`), '?']], { cell: 44, first: 60 })
    return {
      text: `Într-o săptămână din luna ${month} s-au înregistrat la ora $12$ temperaturile din tabelul alăturat. Ce temperatură s-a înregistrat duminică, dacă media temperaturilor din acea săptămână a fost de $${M}^\\circ\\text{C}$?`,
      solution: lines(
        'Suma celor $7$ temperaturi este media înmulțită cu numărul zilelor:',
        show(`${M} \\cdot 7 = ${7 * M}`),
        'Suma temperaturilor de luni până sâmbătă:',
        show(`${t.join(' + ')} = ${7 * M - sun}`),
        'Duminică s-a înregistrat diferența:',
        show(`${7 * M} - ${7 * M - sun} = ${sun}\\ (^\\circ\\text{C})`),
      ),
      verify: () => same((t.reduce((s, x) => s + x, 0) + sun) / 7, M),
      fig,
    }
  }
}

/** The highest temperatures of a week in a bar chart: the greatest change between two consecutive days, p. 78, ex. 8. */
export function d2TempVariation(rng: Rng): Made {
  for (;;) {
    const v = DAY.map(() => int(rng, 1, 12))
    const diffs = v.slice(1).map((x, i) => Math.abs(x - v[i]))
    const big = Math.max(...diffs)
    if (diffs.filter((x) => x === big).length !== 1) continue
    const i = diffs.indexOf(big)
    const sum = v.reduce((s, x) => s + x, 0)
    if (sum % 7 !== 0) continue
    const fig = barChart(DAY, v, 1, { w: 400 })
    const k = int(rng, 4, 9)
    const warm = DAYS.filter((_, j) => v[j] > k)
    const month = pick(rng, ['martie', 'aprilie', 'octombrie', 'noiembrie', 'februarie'])
    return {
      text: `În graficul alăturat sunt temperaturile maxime, în grade Celsius, din zilele unei săptămâni din luna ${month}. a) Între care două zile consecutive a fost cea mai mare variație de temperatură și cât a fost ea? b) În ce zile temperatura maximă a depășit $${k}^\\circ\\text{C}$? c) Care a fost temperatura maximă medie a săptămânii?`,
      solution: lines(
        `Citim: ${DAYS.map((d, j) => `${d} $${v[j]}^\\circ$`).join(', ')}.`,
        `a) Diferențele dintre zilele consecutive sunt: $${diffs.join(',\\ ')}$. Cea mai mare este între ${DAYS[i]} și ${DAYS[i + 1]}:`,
        show(`${Math.max(v[i], v[i + 1])} - ${Math.min(v[i], v[i + 1])} = ${big}\\ (^\\circ\\text{C})`),
        `b) ${warm.length ? `Valori mai mari decât $${k}$ sunt în ${warm.length > 1 ? 'zilele' : 'ziua'}: ${listAnd(warm)}.` : `Nicio zi nu a avut mai mult de $${k}^\\circ\\text{C}$.`}`,
        'c) Media celor $7$ temperaturi:',
        show(`(${v.join(' + ')}) : 7 = ${sum} : 7 = ${sum / 7}\\ (^\\circ\\text{C})`),
      ),
      verify: () => hatched(fig) === 7 && big === Math.abs(v[i + 1] - v[i]) && warm.length === v.filter((x) => x > k).length,
      fig,
    }
  }
}

/** The results of a test in a bar chart: how many below 5, how many in all, the mean, p. 79, ex. 14. */
export function d2GradesChart(rng: Rng): Made {
  for (;;) {
    const { notes, counts, N, S } = marksWithMean(rng, 3, 6, true)
    if (Math.max(...counts) < 3) continue
    const below = counts[0] + counts[1]
    const fig = barChart(notes.map(String), counts, 1, { w: 400 })
    const K = int(rng, 6, 9)
    const atLeast = notes.reduce((s, n, i) => s + (n >= K ? counts[i] : 0), 0)
    return {
      text: `Rezultatele unui test la ${pick(rng, ['matematică', 'fizică', 'română', 'geografie'])} din clasa a V-a ${pick(rng, ['A', 'B', 'C'])} sunt redate în graficul alăturat: sub fiecare bară este nota, iar înălțimea barei arată câți elevi au luat-o. a) Câți elevi au nota sub $5$? b) Câți elevi au cel puțin nota $${K}$? c) Câți elevi sunt în clasă? d) Care este media clasei?`,
      solution: lines(
        `Citim: ${notes.map((n, i) => `nota $${n}$ – $${counts[i]}$`).join(', ')}.`,
        `a) Sub $5$ sunt notele $3$ și $4$: $${counts[0]} + ${counts[1]} = ${below}$ elevi.`,
        `b) Notele de la $${K}$ la $10$: $${notes.map((n, i) => (n >= K ? counts[i] : null)).filter((c) => c !== null).join(' + ')} = ${atLeast}$ elevi.`,
        'c) Adunăm înălțimile tuturor barelor:',
        show(`${counts.join(' + ')} = ${N}`),
        'd) Suma notelor împărțită la numărul elevilor:',
        show(`(${notes.map((n, i) => `${n} \\cdot ${counts[i]}`).join(' + ')}) : ${N} = ${S} : ${N} = ${D((S * 100) / N, 2)}`),
      ),
      verify: () => hatched(fig) === 8 && same(S / N, notes.reduce((s, n, i) => s + n * counts[i], 0) / N),
      fig,
    }
  }
}

/** Which mark the pupil with the given mark should have got for the class mean to be M, p. 77, ex. 6 b. */
export function d2FixGrade(rng: Rng): Made {
  for (;;) {
    const { notes, counts, N, S } = marksWithMean(rng, 4, 6)
    const g0 = pick(rng, notes.slice(0, 4))
    const g1 = int(rng, g0 + 1, 10)
    const S1 = S - g0 + g1
    if ((S1 * 100) % N !== 0) continue
    const fig = table([['nota', ...notes.map(String)], ['nr. de elevi', ...counts.map(String)]], { cell: 34, first: 90 })
    const M = D((S1 * 100) / N, 2)
    return {
      text: `Tabelul alăturat arată notele obținute de elevii unei clase la un test. a) Calculați media clasei. b) Ce notă ar fi trebuit să ia un elev care a primit nota $${g0}$ pentru ca media clasei să fie $${M}$?`,
      solution: lines(
        `a) Numărul elevilor: $${counts.join(' + ')} = ${N}$. Suma notelor:`,
        show(`${notes.map((n, i) => `${n} \\cdot ${counts[i]}`).join(' + ')} = ${S}`),
        show(`m = ${S} : ${N} = ${D((S * 100) / N, 2)}`),
        `b) Cu media $${M}$, suma notelor ar fi trebuit să fie:`,
        show(`${M} \\cdot ${N} = ${S1}`),
        `Suma crește cu $${S1} - ${S} = ${g1 - g0}$, deci elevul ar fi trebuit să ia:`,
        show(`${g0} + ${g1 - g0} = ${g1}`),
      ),
      verify: () => same(S1 / N, (S - g0 + g1) / N) && g1 <= 10,
      fig,
    }
  }
}

const GOODS: { name: string; unit: string; lo: number; hi: number; whole: boolean }[] = [
  { name: 'pâine', unit: 'buc', lo: 20, hi: 60, whole: true },
  { name: 'brânză', unit: 'kg', lo: 150, hi: 350, whole: false },
  { name: 'portocale', unit: 'kg', lo: 30, hi: 70, whole: false },
  { name: 'mere', unit: 'kg', lo: 25, hi: 60, whole: false },
  { name: 'lapte', unit: 'l', lo: 45, hi: 90, whole: true },
  { name: 'roșii', unit: 'kg', lo: 50, hi: 120, whole: false },
  { name: 'iaurt', unit: 'buc', lo: 20, hi: 50, whole: true },
]

/** A shopping list in a table: the cost of each article and what is left of the money, p. 78, ex. 12. */
export function d2ShoppingTable(rng: Rng): Made {
  const items = shuffle(rng, GOODS).slice(0, 4).map((g) => {
    const p = int(rng, g.lo, g.hi) * 10 // cents, a multiple of 10
    const q2 = g.whole ? 2 * int(rng, 1, 4) : int(rng, 1, 6) // the quantity in halves
    return { ...g, p, q2, cost: (q2 * p) / 2 }
  })
  const total = items.reduce((s, it) => s + it.cost, 0)
  const budget = (Math.ceil(total / 1000) + int(rng, 0, 2)) * 10
  const left = budget * 100 - total
  const qty = (it: (typeof items)[number]) => `${Df(it.q2 * 5, 1)} ${it.unit}`
  const fig = table([
    ['Articol', ...items.map((it) => it.name)],
    ['Cantitate', ...items.map(qty)],
    ['Preț unitar (lei)', ...items.map((it) => lei(it.p))],
    ['Cost (lei)', '', '', '', ''],
  ], { cell: 66, first: 110 })
  return {
    text: `Mama ți-a dat ${cnt(budget, 'lei')} și lista de cumpărături din tabelul alăturat, cu prețurile unitare. Completează rândul „Cost” și calculează ce sumă îți va rămâne după cumpărături.`,
    solution: lines(
      'Costul fiecărui articol este cantitatea înmulțită cu prețul unitar:',
      ...items.map((it) => show(`${D(it.q2 * 5, 1)} \\cdot ${D(it.p, 2)} = ${D(it.cost, 2)}\\text{ lei}`)),
      'Costul total:',
      show(`${items.map((it) => D(it.cost, 2)).join(' + ')} = ${D(total, 2)}\\text{ lei}`),
      'Rămân:',
      show(`${budget} - ${D(total, 2)} = ${D(left, 2)}\\text{ lei}`),
    ),
    verify: () => left >= 0 && items.every((it) => same(it.cost, (it.q2 / 2) * it.p)),
    fig,
  }
}

const STATIONS = ['Valea Mare', 'Dealu', 'Poiana', 'Lunca', 'Izvoare', 'Brădet', 'Săliște', 'Răchita', 'Pădureni', 'Livezi', 'Moara', 'Șesuri']

/** The railway distances between four stations in a table, some missing, p. 78, ex. 13. */
export function d2RailTable(rng: Rng): Made {
  const st = shuffle(rng, STATIONS).slice(0, 4)
  const d = [int(rng, 20, 90), int(rng, 20, 90), int(rng, 20, 90)]
  const pos = [0, d[0], d[0] + d[1], d[0] + d[1] + d[2]]
  const dist = (i: number, j: number) => Math.abs(pos[i] - pos[j])
  // the lower half of the table: given (1,0), (2,0), (3,1); missing (2,1), (3,2), (3,0)
  const given: [number, number][] = [[1, 0], [2, 0], [3, 1]]
  const rows = [['–', ...st], ...st.map((s, i) => [s, ...st.map((_, j) => (i === j ? '–' : given.some(([a, b]) => a === i && b === j) ? String(dist(i, j)) : ''))])]
  const fig = table(rows, { cell: 72, first: 80 })
  const [A, B, C, E] = st
  return {
    text: `Gările ${A}, ${B}, ${C} și ${E} sunt, în această ordine, pe aceeași linie de cale ferată. În tabelul alăturat sunt trecute câteva dintre distanțele în km dintre ele. Aflați distanțele ${B} – ${C}, ${C} – ${E} și ${A} – ${E} și completați tabelul sub diagonală.`,
    solution: lines(
      `Din tabel: ${A} – ${B} $= ${dist(1, 0)}$ km, ${A} – ${C} $= ${dist(2, 0)}$ km, ${B} – ${E} $= ${dist(3, 1)}$ km.`,
      `${B} este între ${A} și ${C}, deci:`,
      show(`${dist(2, 0)} - ${dist(1, 0)} = ${dist(2, 1)}\\text{ km}`),
      `${C} este între ${B} și ${E}, deci:`,
      show(`${dist(3, 1)} - ${dist(2, 1)} = ${dist(3, 2)}\\text{ km}`),
      `Distanța ${A} – ${E} este suma celor trei bucăți:`,
      show(`${dist(1, 0)} + ${dist(2, 1)} + ${dist(3, 2)} = ${dist(3, 0)}\\text{ km}`),
    ),
    verify: () => dist(3, 0) === d[0] + d[1] + d[2] && dist(2, 1) + dist(3, 2) === dist(3, 1),
    fig,
  }
}

/** A pie chart with one percent missing: the percent and the number in each category, p. 79, ex. 15. */
export function d2PieChart(rng: Rng): Made {
  for (;;) {
    const a = 5 * int(rng, 4, 8), b = 5 * int(rng, 4, 8), c = 5 * int(rng, 4, 8)
    const last = 100 - a - b - c
    if (last < 20 || last > 40) continue
    const pc = [a, b, c, last]
    const ctx = pick(rng, [
      { cats: ['0–10 ani', '10–25 ani', '25–65 ani', 'peste 65'], who: 'populației unei localități pe categorii de vârstă', unit: 'persoane', N: 20 * int(rng, 100, 700) },
      { cats: ['fotbal', 'baschet', 'înot', 'tenis'], who: 'elevilor unei școli după sportul preferat', unit: 'elevi', N: 20 * int(rng, 10, 40) },
      { cats: ['autobuz', 'pe jos', 'bicicletă', 'mașină'], who: 'elevilor unei școli după cum vin la școală', unit: 'elevi', N: 20 * int(rng, 10, 40) },
    ])
    const miss = int(rng, 0, 3)
    const r = 95
    const cen: Pt = [r, r]
    const edge = (deg: number) => onCircle(cen, r, 90 - deg)
    let acc = 0
    const cuts: string[] = []
    const t: NonNullable<Fig['t']> = []
    pc.forEach((p, i) => {
      const e = edge(acc * 3.6)
      cuts.push(`M${r} ${r} L${e[0].toFixed(1)} ${e[1].toFixed(1)}`)
      const m = onCircle(cen, r * 0.58, 90 - (acc + p / 2) * 3.6)
      t.push({ at: [Number(m[0].toFixed(1)), Number((m[1] - 3).toFixed(1))], s: ctx.cats[i], size: 10 })
      t.push({ at: [Number(m[0].toFixed(1)), Number((m[1] + 11).toFixed(1))], s: i === miss ? '?' : `${p}%`, size: 11 })
      acc += p
    })
    const fig: Fig = { w: 2 * r, h: 2 * r, p: {}, c: [{ at: cen, r }], path: [{ d: cuts.join(' ') }], t }
    const others = pc.filter((_, i) => i !== miss)
    const people = pc.map((p) => (ctx.N * p) / 100)
    return {
      text: `Diagrama alăturată arată împărțirea ${ctx.who}. a) Ce procent reprezintă categoria „${ctx.cats[miss]}”? b) Dacă în total sunt ${cnt(ctx.N, ctx.unit)}, ${ctx.unit === 'elevi' ? 'câți' : 'câte'} ${ctx.unit} sunt în fiecare categorie?`,
      solution: lines(
        'a) Toate categoriile împreună fac $100\\%$:',
        show(`100\\% - (${others.join('\\% + ')}\\%) = 100\\% - ${100 - pc[miss]}\\% = ${pc[miss]}\\%`),
        `b) Calculăm fiecare procent din $${ctx.N}$:`,
        ...pc.map((p, i) => show(`\\frac{${p}}{100} \\cdot ${ctx.N} = ${people[i]}`)),
        `Verificare: $${people.join(' + ')} = ${ctx.N}$.`,
      ),
      verify: () => pc.reduce((s, p) => s + p, 0) === 100 && people.reduce((s, x) => s + x, 0) === ctx.N,
      fig,
    }
  }
}

/** Two farmers, their areas and harvests in a table: the mean harvest per hectare, p. 78, ex. 11. */
export function d2YieldTable(rng: Rng): Made {
  for (;;) {
    const a1 = int(rng, 8, 30), a2 = int(rng, 8, 30)
    const y1 = int(rng, 250, 650) * 10, y2 = int(rng, 250, 650) * 10
    if (a1 === a2 || y1 === y2) continue
    const crop = pick(rng, ['grâu', 'porumb', 'orz', 'ovăz', 'secară'])
    const T1 = a1 * y1, T2 = a2 * y2
    const [A, B] = shuffle(rng, ['Ion', 'Vasile', 'Maria', 'Ana', 'Gheorghe', 'Elena', 'Mihai']).slice(0, 2)
    const fig = table([
      ['Fermier', 'Aria (ha)', 'Cantitate (kg)', 'Medie la hectar'],
      [A, String(a1), String(T1), ''],
      [B, String(a2), String(T2), ''],
    ], { cell: 100, first: 70 })
    const better = y1 > y2 ? A : B
    return {
      text: `Doi fermieri, ${A} și ${B}, au obținut cantitățile de ${crop} din tabelul alăturat, unde sunt trecute și ariile terenurilor lor. Completați tabelul și precizați care fermier a obținut o producție medie la hectar mai mare și cu câte kilograme.`,
      solution: lines(
        'Producția medie la hectar este cantitatea împărțită la arie:',
        `${A}:`,
        show(`${T1} : ${a1} = ${y1}\\text{ kg/ha}`),
        `${B}:`,
        show(`${T2} : ${a2} = ${y2}\\text{ kg/ha}`),
        `${better} a obținut mai mult la hectar, cu:`,
        show(`${Math.max(y1, y2)} - ${Math.min(y1, y2)} = ${Math.abs(y1 - y2)}\\text{ kg/ha}`),
      ),
      verify: () => T1 / a1 === y1 && T2 / a2 === y2,
      fig,
    }
  }
}

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d2-shaded', label: 'Fracții pe figuri: părți hașurate', topic: 'Algebră', joins: 'v-fraction-figures',
    forms: {
      1: [d2ShadedBar, d2ShadedCircle, d2ShadedGrid],
      2: [d2SquareEighths, d2ShadeHowMany, d2ShadedPercent],
      3: [d2TwoCircles, d2EquivalentGrids, d2ShadeMore],
    },
  },
  {
    id: 'v-d2-axis', label: 'Fracții pe axa numerelor', topic: 'Algebră', joins: 'v-number-line',
    forms: {
      1: [d2AxisCoords, d2AxisWhichLetter],
      2: [d2AxisDecimals, d2AxisAboveOne, d2AxisDistance],
      3: [d2AxisEquivalent, d2AxisMixed, d2AxisMidpoint],
    },
  },
  {
    id: 'v-d2-data', label: 'Tabele și grafice', topic: 'Algebră', joins: 'v-statistics',
    forms: {
      1: [d2GradesTable, d2RainChart, d2PlayersChart, d2ExprTable],
      2: [d2AgesTable, d2TableMean, d2MissingTemp, d2TempVariation, d2GradesChart],
      3: [d2FixGrade, d2ShoppingTable, d2RailTable, d2PieChart, d2YieldTable],
    },
  },
]

export const CONTEST: DrawnContest[] = []
