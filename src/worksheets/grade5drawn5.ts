// Grade V exercises WITH DRAWINGS from Mate 2000+ Consolidare, part II (Paralela 45), the photos 51–99 of
// `clasa5\sem2` (pp. 75–148, photographed on 14 November 2026), which the first pass (grade5part2b.ts, grade5part2c.ts)
// skipped because they need a figure: bar and line charts, pie charts and tables (pp. 82–90), points and lines counted
// on a figure (pp. 98–106, 115–119), lengths read from a figure (pp. 109–111, 113–118), angles with their rays and a
// protractor (pp. 123–148), the axis of symmetry on squared paper (pp. 137–146) and the number line (p. 118).
// Seen: pp. 75–78, 82–90, 98–99, 101–106, 109–111, 113–120, 123–124, 127–129, 132–134, 137–139, 143–148.
// Levels after the stars of the sections: Înțelegere * = 1, Aplicare ** = 2, Aprofundare *** and Supermate **** = 3;
// the tests by their content. Every form draws its figure (`fig`) from the same numbers its statement and solution use,
// and names its page and exercise. Asked for by the user on 15 November 2026.
import type { Made } from './generators'
import type { DrawnContest, DrawnKind } from './grade5drawn'
import { barChart, numberLine, pointsOnLine, rays, shadedGrid, table } from './figures5'
import { onCircle, type Fig, type Pt } from '../models/figure'
import { de, int, pick, shuffle, type Rng } from './tex'

// ---------------------------------------------------------------- writing

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : items[0])
const math = (items: string[]) => list(items.map((x) => `$${x}$`))
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0)
const C2 = (n: number) => (n * (n - 1)) / 2
const A = (name: string) => `\\sphericalangle ${name}`
const g = (n: number) => `${n}^\\circ`
/** n / 10^k with the Romanian comma, the zeros at the end dropped: dec(1205, 2) = 12{,}05. */
function dec(n: number, k: number): string {
  const neg = n < 0
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  const part = k > 0 ? s.slice(s.length - k).replace(/0+$/, '') : ''
  return (neg ? '-' : '') + s.slice(0, s.length - k) + (part ? `{,}${part}` : '')
}
/** tenths: 25 → 2{,}5 */
const t10 = (n: number) => dec(n, 1)
/** the same, as written on a figure: 2,5 */
const f10 = (n: number) => t10(n).replace('{,}', ',')
/** a length in tenths of a centimetre */
const cm = (n: number) => `${t10(n)}\\text{ cm}`
const ROMAN = ['I', 'II', 'III', 'IV']
const WEEK = ['I', 'a II-a', 'a III-a', 'a IV-a']

/** The letters used for points (O is kept for vertices and the origin). */
const LET = 'ABCDEFGHIJKLMNPQRSTUVXYZ'
/** k consecutive letters from a random place: "D, E, F, G". */
function run(rng: Rng, k: number): string[] {
  const s = int(rng, 0, LET.length - k)
  return [...LET.slice(s, s + k)]
}
/** k different letters in any order. */
const some = (rng: Rng, k: number, avoid = '') => shuffle(rng, [...LET].filter((c) => !avoid.includes(c))).slice(0, k)

const GIRLS = ['Ana', 'Maria', 'Ioana', 'Ilinca', 'Mioara', 'Elena', 'Sanda', 'Irina', 'Daria', 'Alina']
const BOYS = ['Matei', 'Cătălin', 'Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Luca', 'Bogdan']
const DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']
const DAY_SHORT = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']

// ---------------------------------------------------------------- drawings not in figures5.ts

const P = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`
/** A filled dot of a line chart. */
const dotPath = (q: Pt) => `M${(q[0] - 2.6).toFixed(1)} ${q[1].toFixed(1)} a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0`

/** A line chart, as the book draws temperatures by the hour: values on the vertical axis every `step`, grid lines. */
function lineChart(names: string[], values: number[], step: number, w = 380): Fig {
  const top = Math.ceil(Math.max(...values) / step) * step
  const h = 220
  const ox = 40, oy = h - 30, y1 = 14
  const Y = (v: number) => oy - (v / top) * (oy - y1 - 10)
  const gap = (w - ox - 10) / names.length
  const X = (i: number) => ox + gap * (i + 0.5)
  const grid: string[] = []
  const t: NonNullable<Fig['t']> = []
  for (let v = step; v <= top; v += step) {
    grid.push(`M${ox} ${Y(v).toFixed(1)} L${w - 6} ${Y(v).toFixed(1)}`)
    t.push({ at: [ox - 5, Y(v) + 4], s: String(v), anchor: 'end', size: 10 })
  }
  t.push({ at: [ox - 5, oy + 4], s: '0', anchor: 'end', size: 10 })
  names.forEach((n, i) => t.push({ at: [X(i), oy + 16], s: n, size: 10 }))
  const pts = values.map((v, i) => [X(i), Y(v)] as Pt)
  return {
    w, h, p: {},
    path: [
      { d: grid.join(' '), dashed: true },
      { d: names.map((_, i) => `M${X(i).toFixed(1)} ${oy - 3} L${X(i).toFixed(1)} ${oy + 3}`).join(' ') },
      { d: `M${ox} ${oy} L${w - 4} ${oy} M${ox} ${oy} L${ox} ${y1}` },
      { d: `M${ox} ${y1} l-3.5 7 l7 0 Z M${w - 4} ${oy} l-7 -3.5 l0 7 Z`, fill: '#111' },
      { d: pts.map((q, i) => `${i ? 'L' : 'M'}${P(q)}`).join(' ') },
      { d: pts.map(dotPath).join(' '), fill: '#111' },
    ],
    t,
  }
}

/** A pie chart: sectors from the top, clockwise, the name inside, the percent (or '?') outside; `hatched` sectors hatched. */
function pieChart(pcs: number[], names: string[], shown: string[], hatched: number[]): Fig {
  const r = 70
  const c: Pt = [110, 92]
  const at = (p: number) => onCircle(c, r, 90 - 3.6 * p)
  const cum = pcs.map((_, i) => sum(pcs.slice(0, i)))
  const t: NonNullable<Fig['t']> = []
  pcs.forEach((p, i) => {
    const mid = 90 - 3.6 * (cum[i] + p / 2)
    const inside = onCircle(c, r * 0.55, mid)
    const outside = onCircle(c, r + 17, mid)
    t.push({ at: [inside[0], inside[1] + 4], s: names[i], size: 12 })
    t.push({ at: [outside[0], outside[1] + 4], s: shown[i], size: 11 })
  })
  return {
    w: 220, h: 184, p: {},
    c: [{ at: c, r }],
    path: [
      ...hatched.map((i) => ({ d: `M${P(c)} L${P(at(cum[i]))} A${r} ${r} 0 ${pcs[i] > 50 ? 1 : 0} 1 ${P(at(cum[i] + pcs[i]))} Z`, hatch: true })),
      { d: cum.map((p) => `M${P(c)} L${P(at(p))}`).join(' ') },
    ],
    t,
  }
}

/** Squared paper, cols × rows squares of 24 px, a vertical axis d on the line `axis`, hatched squares, points on the nodes. */
function axisGrid(cols: number, rows: number, axis: number, cells: [number, number][], pts: Record<string, [number, number]> = {}, segs = ''): Fig {
  const cell = 24
  const base = shadedGrid(cols, rows, cells, cell)
  const x = axis * cell
  const p: Record<string, Pt> = Object.fromEntries(Object.entries(pts).map(([n, [c, r]]) => [n, [c * cell, r * cell] as Pt]))
  return {
    ...base, p,
    l: Object.fromEntries(Object.keys(p).map((n) => [n, 'ne'])),
    dot: Object.keys(p).join(' ') || undefined,
    s: segs || undefined,
    path: [...(base.path ?? []), { d: `M${x - 0.8} -8 L${x - 0.8} ${base.h + 8} M${x + 0.8} -8 L${x + 0.8} ${base.h + 8}` }],
    t: [{ at: [x + 9, 2], s: 'd', italic: true, size: 14 }],
  }
}

/** The measures written inside angles of a fan of rays, far enough from the vertex for a narrow angle. */
function measures(fig: Fig, vertex: string, dirs: Record<string, number>, ms: { between: [string, string]; s: string }[]): Fig {
  const v = fig.p[vertex]
  const len = Math.hypot(fig.p[Object.keys(dirs)[0]][0] - v[0], fig.p[Object.keys(dirs)[0]][1] - v[1])
  const t = ms.map((m) => {
    let a = dirs[m.between[0]], b = dirs[m.between[1]]
    if (Math.abs(a - b) > 180) (a < b ? (a += 360) : (b += 360))
    const half = (Math.abs(a - b) * Math.PI) / 360
    const R = Math.min(0.78 * len, Math.max(36, (5 + 4 * m.s.length) / Math.sin(half) + 4))
    const q = onCircle(v, R, (a + b) / 2)
    return { at: [q[0], q[1] + 4] as Pt, s: m.s, size: 11 }
  })
  return { ...fig, t: [...(fig.t ?? []), ...t] }
}

/** A fan of rays (figures5 `rays`) with these rays dashed instead of drawn. */
function dashed(fig: Fig, vertex: string, names: string[]): Fig {
  const chains = (fig.s ?? '').split(' ')
  const out = chains.filter((c) => !names.some((n) => c === `${vertex}-${n}`))
  return { ...fig, s: out.join(' '), d: names.map((n) => `${vertex}-${n}`).join(' ') }
}

/** A protractor from vertex `v` at the bottom: the half circle with a mark every 10°, numbers every 20°, the rays to the
 * points at their readings (0 on the left, 180 on the right), as on p. 127, fig. 1. */
function protractor(v: string, pts: { name: string; at: number }[]): Fig {
  const w = 340, h = 176
  const c: Pt = [170, 160]
  const R = 105
  const dir = (x: number) => 180 - x
  const ticks: string[] = []
  for (let x = 0; x <= 180; x += 10) ticks.push(`M${P(onCircle(c, R, dir(x)))} L${P(onCircle(c, R - (x % 20 ? 5 : 8), dir(x)))}`)
  const t: NonNullable<Fig['t']> = []
  for (let x = 20; x <= 160; x += 20) {
    const q = onCircle(c, R - 18, dir(x))
    t.push({ at: [q[0], q[1] + 4], s: String(x), size: 9 })
  }
  const p: Record<string, Pt> = { [v]: c }
  const l: Fig['l'] = { [v]: 's' }
  for (const q of pts) {
    p[q.name] = onCircle(c, 150, dir(q.at))
    l[q.name] = q.at < 8 || q.at > 172 ? 's' : q.at < 70 ? 'nw' : q.at > 110 ? 'ne' : 'n'
  }
  return {
    w, h, p, l,
    s: pts.map((q) => `${v}-${q.name}`).join(' '),
    dot: pts.map((q) => q.name).join(' '),
    path: [{ d: `M${P([c[0] - R, c[1]])} A${R} ${R} 0 0 1 ${P([c[0] + R, c[1]])}` }, { d: ticks.join(' ') }],
    t,
  }
}

/** Directions between lo and hi degrees, n of them, at least `gap` apart, increasing. */
function spread(rng: Rng, n: number, lo: number, hi: number, gap: number): number[] {
  for (;;) {
    const d = Array.from({ length: n }, () => int(rng, lo, hi)).sort((a, b) => a - b)
    if (d.every((x, i) => i === 0 || x - d[i - 1] >= gap)) return d
  }
}

// ================================================================ the number line (p. 118)

/** O, A, B, C on the number line, unit 1 cm: their coordinates read from the figure and the lengths. p. 118, Testul 2, V.1. */
export function axisLengths(rng: Rng): Made {
  const N = int(rng, 10, 16)
  const xs = shuffle(rng, Array.from({ length: N }, (_, i) => i + 1)).slice(0, 3).sort((a, b) => a - b)
  const names = run(rng, 3)
  const pts: [string, number][] = [['O', 0], ...names.map((n, i) => [n, xs[i]] as [string, number])]
  const pairs: [string, string, number][] = []
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([pts[i][0] + pts[j][0], `${pts[j][1]} - ${pts[i][1]}`, pts[j][1] - pts[i][1]])
  return {
    text: `Pe axa numerelor din figura alăturată, unitatea de măsură este de $1\\text{ cm}$. a) Scrieți coordonatele punctelor ${math(names)}. b) Calculați lungimile segmentelor ${math(pairs.map((q) => q[0]))}.`,
    solution: lines(
      `a) Citim din figură: ${math(pts.map(([n, x]) => `${n}(${x})`))}.`,
      'b) Lungimea unui segment de pe axă este diferența dintre coordonata mai mare și cea mai mică:',
      show(pairs.map(([s, e, v]) => `${s} = ${e} = ${v}\\text{ cm}`).join(', \\quad ')),
    ),
    verify: () => pairs.every(([s, , v]) => {
      const a = pts.find((q) => q[0] === s[0])![1], b = pts.find((q) => q[0] === s[1])![1]
      return v === Math.abs(b - a) && v > 0
    }),
    fig: numberLine({ from: 0, to: N, step: 1, points: pts.map(([name, at]) => ({ name, at })) }),
  }
}

/** Points read on a number line marked only every 5 units; which letter is at a number; a distance. p. 118, V.1 b). */
export function axisReadPoints(rng: Rng): Made {
  const N = pick(rng, [10, 15, 20])
  const free = Array.from({ length: N - 1 }, (_, i) => i + 1).filter((x) => x % 5 !== 0)
  const xs = shuffle(rng, free).slice(0, 4).sort((a, b) => a - b)
  const names = some(rng, 4, 'O')
  const k = int(rng, 0, 3)
  const [i, j] = shuffle(rng, [0, 1, 2, 3]).slice(0, 2).sort()
  const d = xs[j] - xs[i]
  const labels = Array.from({ length: N / 5 + 1 }, (_, q) => 5 * q)
  return {
    text: `Pe axa numerelor din figură sunt scrise doar numerele din $5$ în $5$, dar sunt marcate toate numerele naturale. a) Scrieți coordonatele punctelor ${math(names)}. b) Ce literă se află în dreptul numărului $${xs[k]}$? c) Calculați distanța dintre punctele $${names[i]}$ și $${names[j]}$.`,
    solution: lines(
      `a) Numărăm diviziunile de la cel mai apropiat număr scris: ${math(names.map((n, q) => `${n}(${xs[q]})`))}.`,
      `b) În dreptul numărului $${xs[k]}$ se află punctul $${names[k]}$.`,
      `c) ${show(`${names[i]}${names[j]} = ${xs[j]} - ${xs[i]} = ${d}`)}`,
    ),
    verify: () => d === xs[j] - xs[i] && d > 0 && xs.every((x) => x % 5 !== 0 && x > 0 && x < N),
    fig: numberLine({ from: 0, to: N, step: 1, labels, points: names.map((name, q) => ({ name, at: xs[q] })) }),
  }
}

/** The midpoint of a segment on the number line: its coordinate. pp. 113, 118 (the midpoint on a figure). */
export function axisMidpoint(rng: Rng): Made {
  const N = int(rng, 12, 20)
  let a: number, b: number
  do {
    a = int(rng, 1, N - 4)
    b = int(rng, a + 4, N)
  } while ((b - a) % 2 !== 0)
  const [X, Y, M] = run(rng, 3)
  const m = (a + b) / 2
  return {
    text: `Pe axa numerelor din figură sunt reprezentate punctele $${X}$ și $${Y}$ (din $2$ în $2$ sunt scrise numerele). a) Scrieți coordonatele punctelor $${X}$ și $${Y}$. b) Aflați coordonata mijlocului $${M}$ al segmentului $${X}${Y}$. c) Calculați lungimile segmentelor $${X}${Y}$, $${X}${M}$ și $O${M}$, unde $O$ este originea axei.`,
    solution: lines(
      `a) $${X}(${a})$, $${Y}(${b})$.`,
      `b) Mijlocul este la jumătatea distanței: ${show(`${X}${Y} = ${b} - ${a} = ${b - a}, \\quad ${X}${M} = ${b - a} : 2 = ${(b - a) / 2}, \\quad ${a} + ${(b - a) / 2} = ${m}`)}deci $${M}(${m})$ (sau, direct, $(${a} + ${b}) : 2 = ${m}$).`,
      `c) $${X}${Y} = ${b - a}$, $${X}${M} = ${(b - a) / 2}$, $O${M} = ${m}$.`,
    ),
    verify: () => m - a === b - m && (a + b) / 2 === m,
    fig: numberLine({ from: 0, to: N, step: 1, labels: Array.from({ length: Math.floor(N / 2) + 1 }, (_, q) => 2 * q), points: [{ name: X, at: a }, { name: Y, at: b }] }),
  }
}

/** The symmetric of a point with respect to another, on the number line. p. 113, ex. 10; p. 118 (the number line). */
export function axisSymmetric(rng: Rng): Made {
  const N = int(rng, 12, 20)
  let a: number, b: number
  do {
    a = int(rng, 0, N - 2)
    b = int(rng, 1, N - 1)
  } while (b === a || 2 * b - a < 0 || 2 * b - a > N || Math.abs(b - a) < 2)
  const c = 2 * b - a
  const [X, Y, Z] = run(rng, 3)
  return {
    text: `Pe axa numerelor din figură sunt reprezentate punctele $${X}$ și $${Y}$. Notăm cu $${Z}$ simetricul punctului $${X}$ față de punctul $${Y}$. a) Aflați coordonata punctului $${Z}$. b) Calculați lungimile segmentelor $${X}${Y}$ și $${X}${Z}$.`,
    solution: lines(
      `Din figură: $${X}(${a})$, $${Y}(${b})$, deci $${X}${Y} = ${Math.abs(b - a)}$.`,
      `a) $${Y}$ este mijlocul segmentului $${X}${Z}$, deci $${Z}$ este de cealaltă parte a lui $${Y}$, la aceeași distanță: ${show(`${b} ${b > a ? '+' : '-'} ${Math.abs(b - a)} = ${c}`)}deci $${Z}(${c})$.`,
      `b) $${X}${Y} = ${Math.abs(b - a)}$, $${X}${Z} = 2 \\cdot ${Math.abs(b - a)} = ${Math.abs(c - a)}$.`,
    ),
    verify: () => c - b === b - a && Math.abs(c - a) === 2 * Math.abs(b - a),
    fig: numberLine({ from: 0, to: N, step: 1, points: [{ name: X, at: a }, { name: Y, at: b }] }),
  }
}

// ================================================================ charts and tables (pp. 82–90)

/** Books read by four children, a bar chart: the most, the fewest, the girls together. p. 87, Testul 3, I–II. */
export function chartBooks(rng: Rng): Made {
  for (;;) {
    const girls = shuffle(rng, GIRLS).slice(0, 2)
    const boys = shuffle(rng, BOYS).slice(0, 2)
    const kids = shuffle(rng, [...girls, ...boys])
    const v = shuffle(rng, [2, 4, 6, 8, 10, 12, 14]).slice(0, 4)
    const of = (n: string) => v[kids.indexOf(n)]
    const gs = of(girls[0]) + of(girls[1]), bs = of(boys[0]) + of(boys[1])
    if (gs === bs) continue
    const hi = kids[v.indexOf(Math.max(...v))], lo = kids[v.indexOf(Math.min(...v))]
    const more = gs > bs ? 'fetele' : 'băieții', less = gs > bs ? 'băieții' : 'fetele'
    return {
      text: `${list(kids)} au citit în vacanța mare cărți pentru lectura suplimentară. Diagrama cu bare verticale din figură arată câte cărți a citit fiecare (fetele sunt ${girls[0]} și ${girls[1]}). a) Cine a citit cele mai multe cărți și câte? b) Cine a citit cele mai puține cărți? c) Câte cărți au citit cei patru copii împreună? d) Cu câte cărți au citit mai mult ${more} decât ${less}?`,
      solution: lines(
        `Citim din diagramă: ${list(kids.map((k, i) => `${k} – $${v[i]}$`))}.`,
        `a) ${hi}, $${Math.max(...v)}$ cărți. b) ${lo}, $${Math.min(...v)}$ cărți.`,
        `c) ${show(`${v.join(' + ')} = ${sum(v)}`)}`,
        `d) Fetele: $${of(girls[0])} + ${of(girls[1])} = ${gs}$, băieții: $${of(boys[0])} + ${of(boys[1])} = ${bs}$, deci ${more} au citit cu ${de(Math.abs(gs - bs))} cărți mai mult.`,
      ),
      verify: () => sum(v) === gs + bs && new Set(v).size === 4,
      fig: barChart(kids, v, 2, { w: 330 }),
    }
  }
}

const MARKS = [4, 5, 6, 7, 8, 9, 10]

/** The marks of a class in a bar chart: the frequency of a mark, the pupils with at least a mark, the class. p. 82, ex. 3 a, c, d. */
export function chartMarksRead(rng: Rng): Made {
  const c = MARKS.map(() => int(rng, 1, 7))
  const k = pick(rng, MARKS), m = int(rng, 7, 9)
  const atLeast = sum(c.filter((_, i) => MARKS[i] >= m))
  const T = sum(c)
  return {
    text: `În diagrama din figură sunt reprezentate notele obținute de elevii unei clase la un test: sub fiecare bară este nota, iar înălțimea barei arată câți elevi au obținut-o. a) Care este frecvența notei $${k}$? b) Câți elevi au obținut cel puțin nota $${m}$? c) Câți elevi are clasa?`,
    solution: lines(
      `Citim din diagramă: ${list(MARKS.map((n, i) => `nota $${n}$ – $${c[i]}$`))}.`,
      `a) Nota $${k}$ a fost obținută de $${c[MARKS.indexOf(k)]}$ elevi, deci frecvența ei este $${c[MARKS.indexOf(k)]}$.`,
      `b) Cel puțin nota $${m}$ înseamnă notele de la $${m}$ la $10$: ${show(`${c.filter((_, i) => MARKS[i] >= m).join(' + ')} = ${atLeast}`)}`,
      `c) ${show(`${c.join(' + ')} = ${T}`)}`,
    ),
    verify: () => T === sum(c) && atLeast <= T,
    fig: barChart(MARKS.map(String), c, 1, { w: 400 }),
  }
}

/** The same chart: the mean of the class and the percent of the pupils with at most 7. p. 82, ex. 3 b, e. */
export function chartMarksMean(rng: Rng): Made {
  for (;;) {
    const c = MARKS.map(() => int(rng, 1, 6))
    const T = sum(c)
    const S = sum(c.map((x, i) => x * MARKS[i]))
    const th = int(rng, 6, 8), cls = pick(rng, ['A', 'B', 'C', 'D'])
    const low = sum(c.slice(0, th - 3))
    if ((S * 100) % T !== 0 || (low * 100) % T !== 0) continue
    const mean = (S * 100) / T
    return {
      text: `Diagrama din figură arată câți elevi ai clasei a V-a ${cls} au obținut fiecare notă la un test. a) Calculați media clasei. b) Ce procent din numărul elevilor au obținut note mai mici sau egale cu $${th}$?`,
      solution: lines(
        `Citim din diagramă: ${list(MARKS.map((n, i) => `nota $${n}$ – $${c[i]}$`))}; clasa are $${c.join(' + ')} = ${T}$ elevi.`,
        `a) Media ponderată: ${show(`m = \\frac{${MARKS.map((n, i) => `${n} \\cdot ${c[i]}`).join(' + ')}}{${T}} = \\frac{${S}}{${T}} = ${dec(mean, 2)}`)}`,
        `b) Note cel mult $${th}$: $${c.slice(0, th - 3).join(' + ')} = ${low}$ elevi. ${show(`\\frac{${low}}{${T}} \\cdot 100 = ${(low * 100) / T}\\%`)}`,
      ),
      verify: () => Math.abs(mean / 100 - S / T) < 1e-9 && sum(c) === T,
      fig: barChart(MARKS.map(String), c, 1, { w: 400 }),
    }
  }
}

/** Temperatures by the hour in a line chart: the highest, the rise, the fall. p. 86, Testul 2, IV. */
export function chartTemperature(rng: Rng): Made {
  const n = int(rng, 8, 10)
  const h0 = int(rng, 7, 11)
  const p = int(rng, 2, n - 3)
  const v = [2 * int(rng, 0, 3)]
  for (let i = 1; i <= p; i++) v.push(v[i - 1] + 2 * int(rng, 1, 2))
  for (let i = p + 1; i < n; i++) v.push(Math.max(0, v[i - 1] - (i === p + 1 ? 2 * int(rng, 1, 2) : 2 * int(rng, 0, 2))))
  const hours = v.map((_, i) => h0 + i)
  const max = v[p], last = v[n - 1]
  const k = int(rng, 0, n - 1)
  return {
    text: `La o stație meteo s-a înregistrat temperatura aerului (în $^\\circ\\text{C}$) din oră în oră, între orele $${h0}$ și $${h0 + n - 1}$. Rezultatele sunt în diagrama cu linii din figură: pe axa orizontală sunt orele, pe cea verticală temperatura. a) Care a fost temperatura cea mai mare și la ce oră s-a înregistrat? b) Ce temperatură era la ora $${hours[k]}$? c) Cu câte grade a crescut temperatura de la ora $${h0}$ până la ora ei maximă? d) Cu câte grade a scăzut de la ora maximă până la ora $${h0 + n - 1}$?`,
    solution: lines(
      `Citim din diagramă: ${list(hours.map((h, i) => `ora $${h}$ – $${g(v[i])}$`))}.`,
      `a) Cea mai mare temperatură, $${g(max)}\\text{C}$, s-a înregistrat la ora $${hours[p]}$.`,
      `b) La ora $${hours[k]}$ erau $${g(v[k])}\\text{C}$.`,
      `c) ${show(`${max} - ${v[0]} = ${max - v[0]}`)}grade.`,
      `d) ${show(`${max} - ${last} = ${max - last}`)}grade.`,
    ),
    verify: () => v.every((x) => x <= max) && v.filter((x) => x === max).length === 1 && max - v[0] > 0,
    fig: lineChart(hours.map(String), v, 2),
  }
}

/** The marks in a table: the class, the percent frequency of a mark, the pupils with at least a mark. p. 83, ex. 8 and 9. */
export function tableMarks(rng: Rng): Made {
  const T = pick(rng, [20, 25, 50])
  const c = MARKS.map(() => 1)
  for (let i = 7; i < T; i++) c[int(rng, 0, 6)]++
  const k = pick(rng, MARKS), m = int(rng, 7, 9)
  const ck = c[MARKS.indexOf(k)]
  const up = sum(c.filter((_, i) => MARKS[i] >= m))
  return {
    text: `În tabelul din figură sunt trecute notele obținute de elevii unei clase la un test de evaluare. a) Câți elevi au susținut testul? b) Calculați frecvența procentuală a notei $${k}$. c) Câți elevi au obținut cel puțin nota $${m}$ și ce procent din clasă reprezintă ei?`,
    solution: lines(
      `a) ${show(`${c.join(' + ')} = ${T}`)}elevi.`,
      `b) Nota $${k}$ are frecvența $${ck}$: ${show(`\\frac{${ck}}{${T}} \\cdot 100 = ${(ck * 100) / T}\\%`)}`,
      `c) ${show(`${c.filter((_, i) => MARKS[i] >= m).join(' + ')} = ${up}`)}elevi, adică $\\frac{${up}}{${T}} \\cdot 100 = ${(up * 100) / T}\\%$.`,
    ),
    verify: () => sum(c) === T && (ck * 100) % T === 0 && (up * 100) % T === 0,
    fig: table([['Nota', ...MARKS.map(String)], ['Număr elevi', ...c.map(String)]], { cell: 38, first: 96 }),
  }
}

/** The goods sold in four weeks in a pie chart; the fourth week's percent and the quantities. p. 85, Testul 2. */
export function chartPie(rng: Rng): Made {
  for (;;) {
    const pc = [int(rng, 3, 7) * 5, int(rng, 3, 7) * 5, int(rng, 3, 7) * 5]
    pc.push(100 - sum(pc))
    if (pc[3] < 15) continue
    const T = int(rng, 10, 50) * 20
    const q = pc.map((x) => (T * x) / 100)
    const j = int(rng, 0, 2)
    const [x, y] = shuffle(rng, [0, 1, 2, 3]).slice(0, 2)
    if (pc[x] === pc[y]) continue
    const [big, small] = pc[x] > pc[y] ? [x, y] : [y, x]
    return {
      text: `Cantitatea de marfă vândută de un magazin în patru săptămâni este redată în diagrama circulară din figură (pentru săptămâna a IV-a procentul lipsește). În săptămâna ${WEEK[j]} s-au vândut $${q[j]}$ kg de marfă. a) Ce procent din marfă s-a vândut în săptămâna a IV-a? b) Câte kilograme de marfă s-au vândut în cele patru săptămâni? c) Cu câte kilograme s-a vândut mai mult în săptămâna ${WEEK[big]} decât în săptămâna ${WEEK[small]}?`,
      solution: lines(
        `a) ${show(`100\\% - ${pc[0]}\\% - ${pc[1]}\\% - ${pc[2]}\\% = ${pc[3]}\\%`)}`,
        `b) $${pc[j]}\\%$ din total înseamnă $${q[j]}$ kg: ${show(`${q[j]} : ${pc[j]} \\cdot 100 = ${T}\\text{ kg}`)}`,
        `c) ${show(`\\frac{${pc[big]}}{100} \\cdot ${T} - \\frac{${pc[small]}}{100} \\cdot ${T} = ${q[big]} - ${q[small]} = ${q[big] - q[small]}\\text{ kg}`)}`,
      ),
      verify: () => sum(q) === T && q.every(Number.isInteger) && q[big] > q[small],
      fig: pieChart(pc, ROMAN, [...pc.slice(0, 3).map((x) => `${x}%`), '?'], [3]),
    }
  }
}

/** Tickets sold in a week, one day missing from the table, the total known: the day, the mean, the spread. p. 84, ex. 10. */
export function tableTickets(rng: Rng): Made {
  for (;;) {
    const v = DAYS.map(() => int(rng, 20, 60) * 10)
    const T = sum(v)
    if (T % 7 !== 0 || new Set(v).size < 7) continue
    const j = int(rng, 0, 6)
    const hi = v.indexOf(Math.max(...v)), lo = v.indexOf(Math.min(...v))
    const known = v.filter((_, i) => i !== j)
    return {
      text: `La un cinematograf s-au vândut într-o săptămână bilete conform tabelului din figură; numărul biletelor vândute ${DAYS[j]} s-a șters. În toată săptămâna s-au vândut ${de(T)} bilete. a) Câte bilete s-au vândut ${DAYS[j]}? b) Câte bilete s-au vândut, în medie, pe zi? c) Cu câte bilete s-au vândut mai multe ${DAYS[hi]} decât ${DAYS[lo]}?`,
      solution: lines(
        `a) ${show(`${T} - (${known.join(' + ')}) = ${T} - ${sum(known)} = ${v[j]}`)}`,
        `b) ${show(`${T} : 7 = ${T / 7}`)}bilete pe zi.`,
        `c) Cele mai multe bilete s-au vândut ${DAYS[hi]} ($${v[hi]}$), cele mai puține ${DAYS[lo]} ($${v[lo]}$): $${v[hi]} - ${v[lo]} = ${v[hi] - v[lo]}$.`,
      ),
      verify: () => sum(known) + v[j] === T && T % 7 === 0,
      fig: table([['Ziua', ...DAY_SHORT], ['Bilete', ...v.map((x, i) => (i === j ? '?' : String(x)))]], { cell: 42, first: 64 }),
    }
  }
}

/** The percent frequencies of a bar chart, rounded to whole numbers. p. 87, Testul 3, IV and the Observație. */
export function chartBooksPercent(rng: Rng): Made {
  for (;;) {
    const kids = shuffle(rng, [...GIRLS.slice(0, 5), ...BOYS.slice(0, 5)]).slice(0, 4)
    const v = kids.map(() => 2 * int(rng, 1, 7))
    const T = sum(v)
    if (v.some((x) => ((100 * x) % T) * 2 === T)) continue
    if (v.every((x) => (100 * x) % T === 0)) continue
    const pc = v.map((x) => Math.round((100 * x) / T))
    const step = (x: number) => {
      const exact = (100 * x) % T === 0
      const h = Math.round((10000 * x) / T)
      return `\\frac{${x}}{${T}} \\cdot 100 ${exact ? '=' : '\\approx'} ${exact ? (100 * x) / T : dec(h, 2)}`
    }
    return {
      text: `Diagrama cu bare din figură arată câte cărți au citit în vacanță ${list(kids)}. Calculați frecvența procentuală a cărților citite de fiecare copil, rotunjită la întregi.`,
      solution: lines(
        `Din diagramă: ${list(kids.map((k, i) => `${k} – $${v[i]}$`))}; numărul total al cărților este $${v.join(' + ')} = ${T}$.`,
        ...kids.map((k, i) => `${k}: $${step(v[i])}$, deci aproximativ $${pc[i]}\\%$.`),
      ),
      verify: () => v.every((x, i) => Math.abs((100 * x) / T - pc[i]) < 0.5),
      fig: barChart(kids, v, 2, { w: 330 }),
    }
  }
}

// ================================================================ counting on a figure (pp. 98–106, 111, 117–124)

const SUB = ['₁', '₂', '₃', '₄', '₅', '₆']

/** k lines through one point: the rays with their origin there, the straight angles. p. 98, ex. 13. */
export function countRaysThroughPoint(rng: Rng): Made {
  const k = int(rng, 2, 5)
  const X = pick(rng, ['O', 'P', 'M', 'S', 'T', 'Q'])
  const base = int(rng, 0, Math.floor(180 / k) - 1)
  const dirs = Array.from({ length: k }, (_, i) => base + (i * 180) / k + int(rng, -5, 5))
  const c: Pt = [150, 95]
  const path = dirs.map((a) => `M${P(onCircle(c, 82, a))} L${P(onCircle(c, 82, a + 180))}`).join(' ')
  const t = dirs.map((a, i) => {
    const q = onCircle(c, 90, a)
    return { at: [q[0] + 6, q[1] + 4] as Pt, s: `d${SUB[i]}`, italic: true, size: 13 }
  })
  const names = dirs.map((_, i) => `d_${i + 1}`)
  return {
    text: `În figura alăturată, dreptele ${math(names)} trec toate prin punctul $${X}$. a) Câte semidrepte cu originea în punctul $${X}$ sunt în figură? b) Câte unghiuri alungite cu vârful în $${X}$ au laturile pe aceste drepte?`,
    solution: lines(
      `a) Punctul $${X}$ împarte fiecare dreaptă în două semidrepte opuse, deci sunt ${show(`2 \\cdot ${k} = ${2 * k}`)}semidrepte cu originea în $${X}$.`,
      `b) Două semidrepte opuse formează un unghi alungit; pe fiecare dreaptă este câte unul, deci $${k}$ unghiuri alungite.`,
    ),
    verify: () => dirs.length === k && 2 * k === 2 * dirs.length,
    fig: { w: 300, h: 190, p: { [X]: c }, l: { [X]: 'se' }, dot: X, path: [{ d: path }], t },
  }
}

/** n points on a segment: the segments they determine, those with an end at one of them. p. 99, ex. 14. */
export function countSegmentsOnSegment(rng: Rng): Made {
  const n = int(rng, 4, 7)
  const names = some(rng, n, 'O')
  const at: number[] = [0]
  for (let i = 1; i < n; i++) at.push(at[i - 1] + int(rng, 2, 5))
  const Y = pick(rng, names)
  return {
    text: `În figura alăturată, pe segmentul $${names[0]}${names[n - 1]}$ s-au fixat punctele ${math(names.slice(1, -1))}. a) Câte segmente determină cele $${n}$ puncte din figură? b) Câte dintre aceste segmente au un capăt în punctul $${Y}$?`,
    solution: lines(
      `a) Fiecare punct formează un segment cu fiecare dintre celelalte $${n - 1}$ puncte; așa fiecare segment este numărat de două ori: ${show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}`)}segmente.`,
      `b) Punctul $${Y}$ este capăt pentru câte un segment cu fiecare dintre celelalte puncte: $${n - 1}$ segmente.`,
    ),
    verify: () => C2(n) === (n * (n - 1)) / 2 && names.length === n,
    fig: pointsOnLine(names, at, { segment: true }),
  }
}

/** n rays from a vertex: the angles they make, those with one given side. p. 123, ex. 12 a. */
export function countAnglesFromRays(rng: Rng): Made {
  const n = int(rng, 3, 6)
  const names = run(rng, n)
  const dirs = spread(rng, n, -70, 80, 24)
  const V = pick(rng, ['O', 'V'])
  const Y = pick(rng, names)
  return {
    text: `În figura alăturată sunt desenate semidreptele ${math(names.map((x) => V + x))}, cu originea comună $${V}$. a) Câte unghiuri au ca laturi două dintre aceste semidrepte? b) Câte dintre ele au latura $${V}${Y}$?`,
    solution: lines(
      `a) Fiecare dintre cele $${n}$ semidrepte formează un unghi cu fiecare dintre celelalte $${n - 1}$; fiecare unghi este numărat de două ori: ${show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}`)}unghiuri.`,
      `b) Latura $${V}${Y}$ formează câte un unghi cu fiecare dintre celelalte semidrepte: $${n - 1}$ unghiuri.`,
    ),
    verify: () => C2(n) === (n * (n - 1)) / 2 && dirs.length === n,
    fig: rays(V, names.map((name, i) => ({ name, deg: dirs[i] })), { w: 260 }),
  }
}

/** Cross product of ab and ac, by the length of the longest: how far c is from the line ab, roughly. */
const offLine = (a: Pt, b: Pt, c: Pt) =>
  Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - a[0], c[1] - a[1]), Math.hypot(c[0] - b[0], c[1] - b[1]))

/** n points, no three collinear: the lines, those through one point. p. 103, ex. 14; p. 117, IV.2; p. 119, II.3. */
export function countLinesNoThree(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 7)
    const names = some(rng, n)
    const c: Pt = [130, 100]
    const base = int(rng, 0, 359)
    const pts = names.map((_, i) => onCircle(c, int(rng, 62, 88), base + (360 * i) / n + int(rng, -10, 10)))
    let ok = true
    for (let i = 0; i < n && ok; i++) for (let j = i + 1; j < n && ok; j++) for (let k = j + 1; k < n && ok; k++) if (offLine(pts[i], pts[j], pts[k]) < 12) ok = false
    if (!ok) continue
    const Y = pick(rng, names)
    return {
      text: `În figura alăturată sunt $${n}$ puncte, ${math(names)}, oricare trei necoliniare. a) Câte drepte determină aceste puncte, luate câte două? b) Câte dintre aceste drepte trec prin punctul $${Y}$?`,
      solution: lines(
        `a) Prin oricare două puncte trece o singură dreaptă și nicio dreaptă nu conține trei puncte, deci sunt atâtea drepte câte perechi de puncte: ${show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}`)}`,
        `b) Prin $${Y}$ trece câte o dreaptă cu fiecare dintre celelalte puncte: $${n - 1}$ drepte.`,
      ),
      verify: () => C2(n) === (n * (n - 1)) / 2,
      fig: { w: 260, h: 200, p: Object.fromEntries(names.map((x, i) => [x, pts[i]])), dot: names.join(' ') },
    }
  }
}

/** Two crossing lines with points on them: the segments on the lines, the lines all the points determine. p. 99, ex. 17. */
export function countCrossingLines(rng: Rng): Made {
  const p = int(rng, 2, 3), q = int(rng, 2, 3)
  const names = some(rng, p + q + 1)
  const X = names[0]
  const on1 = names.slice(1, 1 + p), on2 = names.slice(1 + p)
  const slots = [-92, -62, -32, 32, 62, 92]
  const t1 = shuffle(rng, slots).slice(0, p), t2 = shuffle(rng, slots).slice(0, q)
  const a1 = int(rng, -15, 20), a2 = a1 + int(rng, 65, 110)
  const c: Pt = [150, 105]
  const at = (a: number, t: number) => onCircle(c, t, a)
  const pts: Record<string, Pt> = { [X]: c }
  on1.forEach((n, i) => (pts[n] = at(a1, t1[i])))
  on2.forEach((n, i) => (pts[n] = at(a2, t2[i])))
  const segs = C2(p + 1) + C2(q + 1)
  const lns = p * q + 2
  return {
    text: `În figura alăturată, două drepte se intersectează în punctul $${X}$; pe una sunt punctele ${math(on1)}, iar pe cealaltă punctele ${math(on2)}. a) Câte segmente cu ambele capete printre punctele marcate sunt desenate pe cele două drepte? b) Câte drepte determină toate cele $${p + q + 1}$ puncte marcate, luate câte două?`,
    solution: lines(
      `a) Pe prima dreaptă sunt $${p + 1}$ puncte (cu $${X}$), care determină $\\frac{${p + 1} \\cdot ${p}}{2} = ${C2(p + 1)}$ segmente; pe a doua sunt $${q + 1}$ puncte, deci $${C2(q + 1)}$ segmente. În total ${show(`${C2(p + 1)} + ${C2(q + 1)} = ${segs}`)}`,
      `b) Cele două drepte desenate, plus câte o dreaptă pentru fiecare pereche formată dintr-un punct de pe prima dreaptă (altul decât $${X}$) și unul de pe a doua: ${show(`2 + ${p} \\cdot ${q} = ${lns}`)}`,
    ),
    verify: () => segs === C2(p + 1) + C2(q + 1) && lns === C2(p + q + 1) - C2(p + 1) - C2(q + 1) + 2,
    fig: {
      w: 300, h: 210, p: pts, dot: names.join(' '),
      path: [{ d: `M${P(at(a1, -108))} L${P(at(a1, 108))} M${P(at(a2, -100))} L${P(at(a2, 100))}` }],
    },
  }
}

/** n points of which exactly k are collinear: the lines they determine. p. 103, ex. 19; p. 117, IV.3. */
export function countLinesSomeCollinear(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 5, 7), k = int(rng, 3, 4)
    const names = some(rng, n)
    const a = int(rng, -25, 25)
    const c: Pt = [150, 100]
    const slots = shuffle(rng, [-120, -80, -40, 0, 40, 80, 120]).slice(0, k).sort((x, y) => x - y)
    const pts: Pt[] = slots.map((t) => onCircle(c, t, a))
    for (let i = k; i < n; i++) pts.push([int(rng, 15, 285), int(rng, 10, 190)])
    let ok = true
    for (let i = 0; i < n && ok; i++) for (let j = i + 1; j < n && ok; j++) {
      if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 34) ok = false
      for (let m = j + 1; m < n && ok; m++) if (!(m < k) && offLine(pts[i], pts[j], pts[m]) < 14) ok = false
    }
    if (!ok) continue
    const lns = C2(n) - C2(k) + 1
    const on = names.slice(0, k)
    return {
      text: `În figura alăturată sunt $${n}$ puncte; dintre ele, exact $${k}$, anume ${math(on)}, sunt coliniare (pe dreapta desenată), iar oricare alte trei sunt necoliniare. Câte drepte determină cele $${n}$ puncte, luate câte două?`,
      solution: lines(
        `Dacă oricare trei puncte ar fi necoliniare, ar fi $\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}$ drepte.`,
        `Cele $${k}$ puncte coliniare formează $\\frac{${k} \\cdot ${k - 1}}{2} = ${C2(k)}$ perechi, dar toate dau aceeași dreaptă: în loc de $${C2(k)}$ drepte avem una singură.`,
        show(`${C2(n)} - ${C2(k)} + 1 = ${lns}`),
      ),
      verify: () => lns === C2(n) - C2(k) + 1 && lns > 0,
      fig: {
        w: 300, h: 200, p: Object.fromEntries(names.map((x, i) => [x, pts[i]])), dot: names.join(' '),
        path: [{ d: `M${P(onCircle(c, -146, a))} L${P(onCircle(c, 146, a))}` }],
      },
    }
  }
}

/** A line, a point O on it and n rays in one half-plane: all the rays and angles with the vertex O. p. 124, ex. 19, 20. */
export function countAnglesWithLine(rng: Rng): Made {
  const n = int(rng, 2, 5)
  const [L, R, ...names] = run(rng, n + 2)
  const dirs = spread(rng, n, 22, 158, 24)
  const N = n + 2
  const all = C2(N)
  return {
    text: `În figura alăturată, punctul $O$ este pe dreapta $${L}${R}$, între $${L}$ și $${R}$, iar semidreptele ${math(names.map((x) => 'O' + x))} sunt în același semiplan determinat de dreapta $${L}${R}$. a) Câte semidrepte cu originea $O$ sunt în figură? b) Câte unghiuri au ca laturi două dintre aceste semidrepte? c) Câte dintre aceste unghiuri sunt unghiuri proprii?`,
    solution: lines(
      `a) Semidreptele $O${L}$ și $O${R}$ și încă $${n}$: în total $${N}$.`,
      `b) Oricare două dintre cele $${N}$ semidrepte formează un unghi: ${show(`\\frac{${N} \\cdot ${N - 1}}{2} = ${all}`)}`,
      `c) Singurul unghi care nu este propriu este unghiul alungit $${L}O${R}$ (laturile sunt semidrepte opuse): $${all} - 1 = ${all - 1}$.`,
    ),
    verify: () => all === (N * (N - 1)) / 2,
    fig: rays('O', [{ name: L, deg: 180 }, { name: R, deg: 0 }, ...names.map((name, i) => ({ name, deg: dirs[i] }))], { w: 300 }),
  }
}

/** n points at 1 cm from each other: the segments of k cm, the longest, the sum of all the lengths. p. 111, ex. 25.1. */
export function countUnitPieces(rng: Rng): Made {
  const n = int(rng, 5, 9)
  const names = run(rng, n)
  const k = int(rng, 2, n - 2)
  const total = ((n - 1) * n * (n + 1)) / 6
  const terms = Array.from({ length: n - 1 }, (_, i) => `${i + 1} \\cdot ${n - 1 - i}`)
  return {
    text: `Pe dreapta din figură, punctele ${math(names)} sunt în această ordine, iar oricare două puncte vecine sunt la $1\\text{ cm}$ unul de altul. a) Câte segmente cu capetele în aceste puncte au lungimea de $${k}\\text{ cm}$? b) Care este cel mai lung segment și ce lungime are? c) Cât este suma lungimilor tuturor segmentelor determinate de cele $${n}$ puncte?`,
    solution: lines(
      `a) Un segment de $${k}\\text{ cm}$ începe într-unul dintre primele $${n - k}$ puncte și se termină cu $${k}$ puncte mai departe: $${n - k}$ segmente.`,
      `b) $${names[0]}${names[n - 1]} = ${n - 1}\\text{ cm}$.`,
      `c) Pentru fiecare lungime $\\ell$ de la $1$ la $${n - 1}$ sunt $${n} - \\ell$ segmente: ${show(`${terms.join(' + ')} = ${total}\\text{ cm}`)}`,
    ),
    verify: () => {
      let s = 0
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s += j - i
      return s === total
    },
    fig: pointsOnLine(names, names.map((_, i) => i), { lengths: names.slice(1).map(() => '1 cm') }),
  }
}

// ================================================================ lengths on a figure (pp. 109–111)

/** Equal pieces written on the figure: how many times one segment fits in another. p. 109, ex. 8. */
export function segEqualPieces(rng: Rng): Made {
  const n = int(rng, 6, 8)
  const names = run(rng, n)
  const u = int(rng, 2, 5)
  const a = int(rng, 1, 2), mult = int(rng, 2, Math.floor((n - 1) / a))
  const i = int(rng, 0, n - 1 - a), j = int(rng, 0, n - 1 - a * mult)
  const XY = names[i] + names[i + a], ZW = names[j] + names[j + a * mult]
  return {
    text: `În figura alăturată, punctele ${math(names)} sunt pe o dreaptă, în această ordine, iar lungimile segmentelor dintre punctele vecine sunt scrise pe figură. a) De câte ori se cuprinde segmentul $${XY}$ în segmentul $${ZW}$? b) Ce lungime are segmentul $${names[0]}${names[n - 1]}$?`,
    solution: lines(
      `a) Din figură: ${show(`${XY} = ${a} \\cdot ${u} = ${a * u}\\text{ u.m.}, \\quad ${ZW} = ${a * mult} \\cdot ${u} = ${a * mult * u}\\text{ u.m.}`)}și $${a * mult * u} : ${a * u} = ${mult}$, deci $${XY}$ se cuprinde de $${mult}$ ori în $${ZW}$.`,
      `b) ${show(`${names[0]}${names[n - 1]} = ${n - 1} \\cdot ${u} = ${(n - 1) * u}\\text{ u.m.}`)}`,
    ),
    verify: () => (a * mult * u) / (a * u) === mult && j + a * mult <= n - 1,
    fig: pointsOnLine(names, names.map((_, q) => q), { lengths: names.slice(1).map(() => `${u} u.m.`), segment: true }),
  }
}

/** Two pieces written on the figure: the whole and the difference. p. 109, ex. 6 and 9. */
export function segTwoPieces(rng: Rng): Made {
  let a: number, b: number
  do {
    a = int(rng, 8, 60)
    b = int(rng, 8, 60)
  } while (a === b)
  const [X, Y, Z] = run(rng, 3)
  const [big, small] = a > b ? [X + Y, Y + Z] : [Y + Z, X + Y]
  return {
    text: `În figura alăturată, punctul $${Y}$ aparține segmentului $${X}${Z}$, iar lungimile segmentelor $${X}${Y}$ și $${Y}${Z}$ sunt scrise pe figură. a) Calculați lungimea segmentului $${X}${Z}$. b) Cu cât este mai lung segmentul $${big}$ decât segmentul $${small}$?`,
    solution: lines(
      `a) $${Y}$ este între $${X}$ și $${Z}$, deci ${show(`${X}${Z} = ${X}${Y} + ${Y}${Z} = ${t10(a)} + ${t10(b)} = ${cm(a + b)}`)}`,
      `b) ${show(`${t10(Math.max(a, b))} - ${t10(Math.min(a, b))} = ${cm(Math.abs(a - b))}`)}`,
    ),
    verify: () => a + b > 0 && Math.abs(a - b) > 0,
    fig: pointsOnLine([X, Y, Z], [0, a, a + b], { lengths: [`${f10(a)} cm`, `${f10(b)} cm`], segment: true }),
  }
}

/** A, B, C, D in this order, AB, AC and BD known: BC, CD, AD. p. 110, ex. 16. */
export function segFourPoints(rng: Rng): Made {
  const [W, X, Y, Z] = run(rng, 4)
  const ab = int(rng, 5, 40), bc = int(rng, 5, 50), cd = int(rng, 5, 50)
  const ac = ab + bc, bd = bc + cd
  return {
    text: `În figura alăturată, punctele ${math([W, X, Y, Z])} sunt pe o dreaptă, în această ordine, și $${W}${X} = ${cm(ab)}$, $${W}${Y} = ${cm(ac)}$, $${X}${Z} = ${cm(bd)}$. Determinați lungimile segmentelor $${X}${Y}$, $${Y}${Z}$ și $${W}${Z}$.`,
    solution: lines(
      show(`${X}${Y} = ${W}${Y} - ${W}${X} = ${t10(ac)} - ${t10(ab)} = ${cm(bc)}`),
      show(`${Y}${Z} = ${X}${Z} - ${X}${Y} = ${t10(bd)} - ${t10(bc)} = ${cm(cd)}`),
      show(`${W}${Z} = ${W}${X} + ${X}${Z} = ${t10(ab)} + ${t10(bd)} = ${cm(ab + bd)}`),
    ),
    verify: () => ac - ab === bc && bd - bc === cd && ab + bd === ab + bc + cd,
    fig: pointsOnLine([W, X, Y, Z], [0, ab, ac, ac + cd], { segment: true }),
  }
}

/** A railway map with the distances between neighbouring stations: the distances between two stations. p. 110, ex. 20. */
export function segRailway(rng: Rng): Made {
  const n = int(rng, 5, 6)
  const names = run(rng, n)
  const km = names.slice(1).map(() => int(rng, 15, 110))
  const at = [0]
  km.forEach((k, i) => at.push(at[i] + k))
  let i1: number, j1: number, i2: number, j2: number
  do {
    i1 = int(rng, 0, n - 3); j1 = int(rng, i1 + 2, n - 1)
    i2 = int(rng, 0, n - 3); j2 = int(rng, i2 + 2, n - 1)
  } while (i1 === i2 && j1 === j2)
  const d = (i: number, j: number) => at[j] - at[i]
  const step = (i: number, j: number) => show(`${names[i]}${names[j]} = ${km.slice(i, j).join(' + ')} = ${d(i, j)}\\text{ km}`)
  return {
    text: `Pe o hartă de cale ferată (figura alăturată), stațiile ${math(names)} sunt pe aceeași linie, iar distanțele în kilometri dintre stațiile vecine sunt scrise pe figură. Calculați distanțele: a) de la stația $${names[i1]}$ la stația $${names[j1]}$; b) de la stația $${names[i2]}$ la stația $${names[j2]}$.`,
    solution: lines(`a) ${step(i1, j1)}`, `b) ${step(i2, j2)}`),
    verify: () => d(i1, j1) === sum(km.slice(i1, j1)) && d(i2, j2) === sum(km.slice(i2, j2)),
    fig: pointsOnLine(names, at, { lengths: km.map((k) => `${k} km`), segment: true, w: 400 }),
  }
}

/** O, A, B, C, D on a line, their distances from O known: the segments between them. p. 111, ex. 21. */
export function segFromOrigin(rng: Rng): Made {
  const names = run(rng, 4)
  const o: number[] = []
  let x = 0
  for (let i = 0; i < 4; i++) o.push((x += int(rng, 8, 30)))
  const pairs: [number, number][] = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3], [0, 3]]
  return {
    text: `Punctele ${math(['O', ...names])} aparțin dreptei din figura alăturată, în această ordine. Se știe că ${math(names.map((n, i) => `O${n} = ${cm(o[i])}`))}. Calculați lungimile segmentelor ${math(pairs.map(([i, j]) => names[i] + names[j]))}, observând că fiecare este diferența dintre lungimile a două segmente cu un capăt în $O$.`,
    solution: show(`\\begin{gathered}${pairs.map(([i, j]) => `${names[i]}${names[j]} = O${names[j]} - O${names[i]} = ${t10(o[j])} - ${t10(o[i])} = ${cm(o[j] - o[i])}`).join(' \\\\ ')}\\end{gathered}`),
    verify: () => pairs.every(([i, j]) => o[j] - o[i] > 0),
    fig: pointsOnLine(['O', ...names], [0, ...o], { segment: true }),
  }
}

/** Points whose neighbouring gaps grow by one unit each: the lengths between two of them. p. 111, ex. 25.2. */
export function segGrowingPieces(rng: Rng): Made {
  const n = int(rng, 6, 8)
  const names = run(rng, n)
  const u = int(rng, 1, 2)
  const at = [0]
  for (let i = 1; i < n; i++) at.push(at[i - 1] + i * u)
  let i1: number, j1: number, i2: number, j2: number
  do {
    i1 = int(rng, 0, n - 3); j1 = int(rng, i1 + 2, n - 1)
    i2 = int(rng, 0, n - 3); j2 = int(rng, i2 + 2, n - 1)
  } while (i1 === i2 && j1 === j2)
  const len = (i: number, j: number) => at[j] - at[i]
  const step = (i: number, j: number) => show(`${names[i]}${names[j]} = ${Array.from({ length: j - i }, (_, q) => (i + q + 1) * u).join(' + ')} = ${len(i, j)}\\text{ cm}`)
  return {
    text: `Pe dreapta din figură, punctele ${math(names)} sunt în această ordine. Segmentul dintre primul și al doilea punct are $${u}\\text{ cm}$, cel dintre al doilea și al treilea $${2 * u}\\text{ cm}$ și, în general, cel dintre punctul cu numărul $i$ și următorul are $${u === 1 ? '' : `${u} \\cdot `}i\\text{ cm}$. Calculați lungimile segmentelor $${names[i1]}${names[j1]}$, $${names[i2]}${names[j2]}$ și $${names[0]}${names[n - 1]}$.`,
    solution: lines(step(i1, j1), step(i2, j2), step(0, n - 1)),
    verify: () => len(0, n - 1) === (u * (n - 1) * n) / 2 && len(i1, j1) > 0,
    fig: pointsOnLine(names, at, { segment: true }),
  }
}

/** C between A and B, A between B and D, AB, BC, AD known: AC, CD, BD. p. 110, ex. 17. */
export function segMixedOrder(rng: Rng): Made {
  const [W, X, Y, Z] = some(rng, 4, 'O')
  const ab = int(rng, 6, 20), bc = int(rng, 2, ab - 2), ad = int(rng, 3, 15)
  return {
    text: `Pe dreapta din figură sunt punctele ${math([W, X, Y, Z])}, astfel încât $${Y}$ este între $${W}$ și $${X}$, iar $${W}$ este între $${X}$ și $${Z}$. Știind că $${W}${X} = ${ab}\\text{ u.m.}$, $${X}${Y} = ${bc}\\text{ u.m.}$ și $${W}${Z} = ${ad}\\text{ u.m.}$, calculați lungimile segmentelor $${W}${Y}$, $${Y}${Z}$ și $${X}${Z}$.`,
    solution: lines(
      `Ordinea punctelor pe dreaptă este $${Z}, ${W}, ${Y}, ${X}$.`,
      show(`${W}${Y} = ${W}${X} - ${X}${Y} = ${ab} - ${bc} = ${ab - bc}\\text{ u.m.}`),
      show(`${Y}${Z} = ${Z}${W} + ${W}${Y} = ${ad} + ${ab - bc} = ${ad + ab - bc}\\text{ u.m.}`),
      show(`${X}${Z} = ${X}${W} + ${W}${Z} = ${ab} + ${ad} = ${ab + ad}\\text{ u.m.}`),
    ),
    verify: () => ab - bc > 0 && ad + ab - bc === ad + (ab - bc) && ab + ad === ad + ab,
    fig: pointsOnLine([Z, W, Y, X], [0, ad, ad + ab - bc, ad + ab], { segment: true }),
  }
}

// ================================================================ midpoints and symmetric points (pp. 113–118)

/** M the midpoint of AB, C between M and B: AM, CB, AC. p. 118, Testul 3, IV. */
export function midAMC(rng: Rng): Made {
  const [X, M, Z, Y] = some(rng, 4, 'O')
  const h = int(rng, 4, 30), mc = int(rng, 1, h - 1)
  return {
    text: `În figura alăturată, punctul $${M}$ este mijlocul segmentului $${X}${Y}$, iar punctul $${Z}$ este între $${M}$ și $${Y}$. Știind că $${X}${Y} = ${cm(20 * h)}$ și $${M}${Z} = ${cm(10 * mc)}$, calculați lungimile segmentelor $${X}${M}$, $${Z}${Y}$ și $${X}${Z}$.`,
    solution: lines(
      show(`${X}${M} = ${M}${Y} = ${X}${Y} : 2 = ${2 * h} : 2 = ${h}\\text{ cm}`),
      show(`${Z}${Y} = ${M}${Y} - ${M}${Z} = ${h} - ${mc} = ${h - mc}\\text{ cm}`),
      show(`${X}${Z} = ${X}${M} + ${M}${Z} = ${h} + ${mc} = ${h + mc}\\text{ cm}`),
    ),
    verify: () => h - mc + h + mc === 2 * h && h - mc > 0,
    fig: pointsOnLine([X, M, Z, Y], [0, h, h + mc, 2 * h], { segment: true }),
  }
}

/** M, N, P in this order, O the midpoint of NP, MP and MN known: NP, NO, MO. p. 113, ex. 3. */
export function midMNP(rng: Rng): Made {
  const [X, Y, Z] = run(rng, 3)
  const W = pick(rng, ['O', 'Q', 'T'].filter((c) => ![X, Y, Z].includes(c)))
  const mn = int(rng, 2, 20), half = int(rng, 1, 10)
  const mp = mn + 2 * half
  return {
    text: `Pe dreapta din figură sunt punctele $${X}$, $${Y}$, $${Z}$, în această ordine, iar $${W}$ este mijlocul segmentului $${Y}${Z}$. Dacă $${X}${Z} = ${mp}\\text{ cm}$ și $${X}${Y} = ${mn}\\text{ cm}$, calculați lungimile segmentelor $${Y}${Z}$, $${Y}${W}$ și $${X}${W}$.`,
    solution: lines(
      show(`${Y}${Z} = ${X}${Z} - ${X}${Y} = ${mp} - ${mn} = ${2 * half}\\text{ cm}`),
      show(`${Y}${W} = ${Y}${Z} : 2 = ${half}\\text{ cm}`),
      show(`${X}${W} = ${X}${Y} + ${Y}${W} = ${mn} + ${half} = ${mn + half}\\text{ cm}`),
    ),
    verify: () => mp - mn === 2 * half && mn + half < mp,
    fig: pointsOnLine([X, Y, W, Z], [0, mn, mn + half, mp], { segment: true }),
  }
}

/** B on AC, M and N the midpoints of AB and BC, AB and BN known: BC, AM, MN, AC. p. 113, ex. 7. */
export function midTwoMidpoints(rng: Rng): Made {
  const [X, Y, Z] = run(rng, 3)
  const [M, N] = ['M', 'N'].some((c) => [X, Y, Z].includes(c)) ? ['P', 'Q'] : ['M', 'N']
  const ab = 2 * int(rng, 5, 40), bn = int(rng, 5, 40)
  return {
    text: `Pe segmentul $${X}${Z}$ din figură se consideră punctul $${Y}$. Punctele $${M}$ și $${N}$ sunt mijloacele segmentelor $${X}${Y}$, respectiv $${Y}${Z}$. Dacă $${X}${Y} = ${cm(ab)}$ și $${Y}${N} = ${cm(bn)}$, calculați lungimile segmentelor $${Y}${Z}$, $${X}${M}$, $${M}${N}$ și $${X}${Z}$.`,
    solution: lines(
      show(`${Y}${Z} = 2 \\cdot ${Y}${N} = 2 \\cdot ${t10(bn)} = ${cm(2 * bn)}`),
      show(`${X}${M} = ${X}${Y} : 2 = ${t10(ab)} : 2 = ${cm(ab / 2)}`),
      show(`${M}${N} = ${M}${Y} + ${Y}${N} = ${t10(ab / 2)} + ${t10(bn)} = ${cm(ab / 2 + bn)}`),
      show(`${X}${Z} = ${X}${Y} + ${Y}${Z} = ${t10(ab)} + ${t10(2 * bn)} = ${cm(ab + 2 * bn)}`),
    ),
    verify: () => ab / 2 + bn === (ab + 2 * bn) / 2,
    fig: pointsOnLine([X, M, Y, N, Z], [0, ab / 2, ab, ab + bn, ab + 2 * bn], { segment: true }),
  }
}

/** M, N, P, Q in this order, Q the symmetric of M with respect to P, MN and NP known: MP, PQ, MQ. p. 114, ex. 18. */
export function midSymmetricChain(rng: Rng): Made {
  const [W, X, Y, Z] = run(rng, 4)
  const a = int(rng, 4, 50), b = int(rng, 4, 50)
  const mp = a + b
  return {
    text: `În figura alăturată sunt reprezentate punctele coliniare, distincte, ${math([W, X, Y, Z])}, în această ordine. Punctul $${Z}$ este simetricul punctului $${W}$ față de punctul $${Y}$, $${W}${X} = ${cm(a)}$ și $${X}${Y} = ${cm(b)}$. Calculați lungimile segmentelor $${W}${Y}$, $${Y}${Z}$ și $${W}${Z}$.`,
    solution: lines(
      show(`${W}${Y} = ${W}${X} + ${X}${Y} = ${t10(a)} + ${t10(b)} = ${cm(mp)}`),
      `$${Y}$ este mijlocul segmentului $${W}${Z}$, deci ${show(`${Y}${Z} = ${W}${Y} = ${cm(mp)}, \\quad ${W}${Z} = 2 \\cdot ${t10(mp)} = ${cm(2 * mp)}`)}`,
    ),
    verify: () => 2 * mp === 2 * (a + b),
    fig: pointsOnLine([W, X, Y, Z], [0, a, mp, 2 * mp], { segment: true }),
  }
}

/** A, B, C, D in this order, D the symmetric of B with respect to C, AD and BC known: CD, BD, AC, AB. p. 114, ex. 16. */
export function midSymmetricBCD(rng: Rng): Made {
  const [W, X, Y, Z] = run(rng, 4)
  const bc = int(rng, 2, 9), ab = int(rng, 2, 12)
  const ad = ab + 2 * bc
  return {
    text: `În figura alăturată, punctele ${math([W, X, Y, Z])} sunt coliniare, în această ordine. Se știe că $${W}${Z} = ${ad}\\text{ cm}$ și $${X}${Y} = ${bc}\\text{ cm}$, iar $${Z}$ este simetricul punctului $${X}$ față de punctul $${Y}$. Determinați lungimile segmentelor $${Y}${Z}$, $${X}${Z}$, $${W}${Y}$ și $${W}${X}$.`,
    solution: lines(
      `$${Y}$ este mijlocul segmentului $${X}${Z}$: ${show(`${Y}${Z} = ${X}${Y} = ${bc}\\text{ cm}, \\quad ${X}${Z} = 2 \\cdot ${bc} = ${2 * bc}\\text{ cm}`)}`,
      show(`${W}${Y} = ${W}${Z} - ${Y}${Z} = ${ad} - ${bc} = ${ad - bc}\\text{ cm}, \\quad ${W}${X} = ${W}${Z} - ${X}${Z} = ${ad} - ${2 * bc} = ${ab}\\text{ cm}`),
    ),
    verify: () => ad - 2 * bc === ab && ab > 0,
    fig: pointsOnLine([W, X, Y, Z], [0, ab, ab + bc, ad], { segment: true }),
  }
}

/** Midpoints taken again and again towards A: AM3 (or AM4) and the segment between two of them. p. 114, ex. 14 and 22. */
export function midHalving(rng: Rng): Made {
  const k = int(rng, 3, 4)
  const [X, Y] = pick(rng, [['A', 'B'], ['C', 'D'], ['E', 'F'], ['R', 'S']])
  const mids = ['M', 'N', 'P', 'Q'].slice(0, k)
  const ab = int(rng, 2, 9) * 2 ** k
  const len = mids.map((_, i) => ab / 2 ** (i + 1))
  const desc = mids.map((m, i) => `$${m}$ mijlocul segmentului $${X}${i === 0 ? Y : mids[i - 1]}$`)
  const last = mids[k - 1]
  return {
    text: `Segmentul $${X}${Y}$ din figură are lungimea de $${ab}\\text{ cm}$. Notăm cu ${list(desc)}. Calculați lungimile segmentelor $${X}${last}$ și $${mids[0]}${last}$.`,
    solution: lines(
      'Fiecare mijloc înjumătățește segmentul de dinainte:',
      show(mids.map((m, i) => `${X}${m} = ${i === 0 ? ab : len[i - 1]} : 2 = ${len[i]}\\text{ cm}`).join(', \\quad ')),
      show(`${mids[0]}${last} = ${X}${mids[0]} - ${X}${last} = ${len[0]} - ${len[k - 1]} = ${len[0] - len[k - 1]}\\text{ cm}`),
    ),
    verify: () => len[k - 1] * 2 ** k === ab && Number.isInteger(len[k - 1]),
    fig: pointsOnLine([X, ...[...mids].reverse(), Y], [0, ...[...len].reverse(), ab], { segment: true, w: 400 }),
  }
}

/** O, A, B, C collinear, OA, OB, BC known, M, N, P the midpoints of OC, AB, BC: AB, OC, AC, and N the midpoint of MP. p. 114, ex. 15. */
export function midThreeMidpoints(rng: Rng): Made {
  for (;;) {
    const m = int(rng, 4, 12), c = int(rng, 1, m - 1)
    const b = 2 * m, a = m + c
    // in tenths: M at (b + c)/2, N at (a + b)/2, P at b + c/2
    const T = (x: number) => 10 * x
    const pos = { O: 0, A: T(a), B: T(b), C: T(b + c), M: T(b + c) / 2, N: T(a + b) / 2, P: T(b) + T(c) / 2 }
    const order = (Object.entries(pos) as [string, number][]).sort((x, y) => x[1] - y[1])
    if (order.some(([, x], i) => i > 0 && x - order[i - 1][1] < T(b + c) / 18)) continue
    const mp = pos.P - pos.M, mn = pos.N - pos.M
    return {
      text: `Punctele coliniare $O$, $A$, $B$ și $C$ sunt în această ordine, astfel încât $OA = ${a}\\text{ cm}$, $OB = ${b}\\text{ cm}$ și $BC = ${c}\\text{ cm}$. Notăm cu $M$, $N$ și $P$ mijloacele segmentelor $OC$, $AB$, respectiv $BC$ (figura alăturată). a) Calculați lungimile segmentelor $AB$, $OC$ și $AC$. b) Calculați $MN$ și $NP$ și arătați că $N$ este mijlocul segmentului $MP$.`,
      solution: lines(
        `a) ${show(`AB = ${b} - ${a} = ${b - a}\\text{ cm}, \\quad OC = ${b} + ${c} = ${b + c}\\text{ cm}, \\quad AC = ${b - a} + ${c} = ${b - a + c}\\text{ cm}`)}`,
        `b) Măsurăm totul de la $O$: ${show(`OM = ${b + c} : 2 = ${cm(pos.M)}, \\quad ON = ${a} + ${b - a} : 2 = ${cm(pos.N)}, \\quad OP = ${b} + ${c} : 2 = ${cm(pos.P)}`)}`,
        show(`MN = ${t10(pos.N)} - ${t10(pos.M)} = ${cm(mn)}, \\quad NP = ${t10(pos.P)} - ${t10(pos.N)} = ${cm(pos.P - pos.N)}`),
        `Deci $MN = NP$ și $N$ este între $M$ și $P$: $N$ este mijlocul segmentului $MP$ (care are $${cm(mp)}$).`,
      ),
      verify: () => 2 * mn === mp && pos.N > pos.M && pos.P > pos.N,
      fig: pointsOnLine(order.map(([n]) => n), order.map(([, x]) => x), { segment: true, w: 400 }),
    }
  }
}

// ================================================================ angles on a figure (pp. 127–148)

/** Reading a protractor: the rays at odd tens, the numbers written every 20°. p. 127, ex. 4. */
export function angleProtractor(rng: Rng): Made {
  const k = int(rng, 3, 4)
  const names = run(rng, k + 2)
  const reads = shuffle(rng, [10, 30, 50, 70, 90, 110, 130, 150, 170]).slice(0, k).sort((a, b) => a - b)
  const V = 'O'
  const pts = [{ name: names[0], at: 0 }, ...reads.map((at, i) => ({ name: names[i + 1], at })), { name: names[k + 1], at: 180 }]
  const first = names[0], lastN = names[k + 1]
  const [i, j] = shuffle(rng, Array.from({ length: k }, (_, q) => q + 1)).slice(0, 2).sort((a, b) => a - b)
  const asked = reads.map((_, q) => `${first}${V}${names[q + 1]}`)
  return {
    text: `În figura alăturată, raportorul are centrul în $${V}$, semidreapta $${V}${first}$ trece prin gradația $0$, iar $${V}${lastN}$ prin gradația $180$; numerele sunt scrise din $20$ în $20$ de grade, iar liniuțele sunt din $10$ în $10$. Precizați măsurile unghiurilor ${math(asked)}, apoi pe cele ale unghiurilor $${names[i]}${V}${names[j]}$ și $${names[j]}${V}${lastN}$.`,
    solution: lines(
      `Citim gradația prin care trece fiecare semidreaptă (între două numere scrise este o liniuță din mijloc): ${show(asked.map((a, q) => `${A(a)} = ${g(reads[q])}`).join(', \\quad '))}`,
      show(`${A(`${names[i]}${V}${names[j]}`)} = ${g(reads[j - 1])} - ${g(reads[i - 1])} = ${g(reads[j - 1] - reads[i - 1])}, \\quad ${A(`${names[j]}${V}${lastN}`)} = 180^\\circ - ${g(reads[j - 1])} = ${g(180 - reads[j - 1])}`),
    ),
    verify: () => reads[j - 1] > reads[i - 1] && reads.every((r) => r % 20 === 10),
    fig: protractor(V, pts),
  }
}

/** A, O, B collinear, two rays with the outer angles written: the angle x between them. p. 134, ex. 21 (fig. 2.a). */
export function angleXOnLine(rng: Rng): Made {
  let a: number, b: number
  do {
    a = int(rng, 6, 15) * 5
    b = int(rng, 6, 15) * 5
  } while (180 - a - b < 30)
  const x = 180 - a - b
  const [L, C, D, R] = run(rng, 4)
  const dirs = { [L]: 180, [C]: 180 - a, [D]: b, [R]: 0 }
  const fig = measures(rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 300, arcs: [`${L}O${C}`, `${C}O${D}`, `${D}O${R}`] }), 'O', dirs,
    [{ between: [L, C], s: `${a}°` }, { between: [C, D], s: 'x' }, { between: [D, R], s: `${b}°` }])
  return {
    text: `În figura alăturată, punctele $${L}$, $O$ și $${R}$ sunt coliniare, iar măsurile a două unghiuri sunt scrise pe figură. Determinați $x$, măsura unghiului $${C}O${D}$, și precizați ce fel de unghi este $${D}O${L}$.`,
    solution: lines(
      `Unghiul $${L}O${R}$ este alungit, deci are $180^\\circ$: ${show(`${a}^\\circ + x + ${b}^\\circ = 180^\\circ \\Rightarrow x = 180^\\circ - ${g(a + b)} = ${g(x)}`)}`,
      `$${A(`${D}O${L}`)} = ${g(a)} + ${g(x)} = ${g(a + x)}$, deci unghiul $${D}O${L}$ este ${a + x < 90 ? 'ascuțit' : a + x === 90 ? 'drept' : 'obtuz'}.`,
    ),
    verify: () => a + x + b === 180 && x >= 30,
    fig,
  }
}

const term = (k: number, r: number) => `${k === 1 ? '' : k}x${r ? ` ${r > 0 ? '+' : '-'} ${Math.abs(r)}°` : ''}`
const termTex = (k: number, r: number) => `${k === 1 ? '' : k}x${r ? ` ${r > 0 ? '+' : '-'} ${g(Math.abs(r))}` : ''}`

/** Three angles on a line, two of them written with x: x and the three measures. p. 134, ex. 21 (fig. 2.c). */
export function angleXExpressions(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 4), q = int(rng, 1, 4)
    const r = pick(rng, [0, 10, 20, -10, 15, 5])
    const x = int(rng, 4, 12) * 5
    const u = p * x, w = q * x + r
    const mid = 180 - u - w
    if (u < 30 || w < 30 || mid < 30 || p === q && r === 0) continue
    const [L, C, D, R] = run(rng, 4)
    const dirs = { [L]: 180, [C]: 180 - u, [D]: w, [R]: 0 }
    const fig = measures(rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 300, arcs: [`${L}O${C}`, `${C}O${D}`, `${D}O${R}`] }), 'O', dirs,
      [{ between: [L, C], s: term(p, 0) }, { between: [C, D], s: `${mid}°` }, { between: [D, R], s: term(q, r) }])
    return {
      text: `În figura alăturată, punctele $${L}$, $O$ și $${R}$ sunt coliniare, iar măsurile unghiurilor $${L}O${C}$, $${C}O${D}$ și $${D}O${R}$ sunt scrise pe figură. Determinați $x$, apoi măsurile unghiurilor $${L}O${C}$ și $${D}O${R}$.`,
      solution: lines(
        `Cele trei unghiuri formează împreună unghiul alungit $${L}O${R}$: ${show(`${termTex(p, 0)} + ${g(mid)} + ${termTex(q, r)} = 180^\\circ`)}`,
        show(`${p + q}x = 180^\\circ - ${g(mid)}${r ? ` ${r > 0 ? '-' : '+'} ${g(Math.abs(r))}` : ''} = ${g((p + q) * x)} \\Rightarrow x = ${g(x)}`),
        show(`${A(`${L}O${C}`)} = ${g(u)}, \\quad ${A(`${D}O${R}`)} = ${g(w)}`),
      ),
      verify: () => u + mid + w === 180 && (p + q) * x === 180 - mid - r,
      fig,
    }
  }
}

/** A line X'X, O on it, OB and OC in one half-plane with XOB and XOC known: X'OB, X'OC, COB. p. 133, ex. 10. */
export function angleTwoRaysOnLine(rng: Rng): Made {
  let b: number, c: number
  do {
    b = int(rng, 4, 15) * 5
    c = int(rng, 8, 31) * 5
  } while (c - b < 25 || c > 150)
  const [L, R, B, C] = run(rng, 4)
  const dirs = { [L]: 180, [R]: 0, [B]: b, [C]: c }
  return {
    text: `Fie dreapta $${L}${R}$ și punctul $O$ pe ea, între $${L}$ și $${R}$. În același semiplan determinat de dreaptă considerăm semidreptele $O${B}$ și $O${C}$ (figura alăturată), astfel încât $${A(`${R}O${B}`)} = ${g(b)}$ și $${A(`${R}O${C}`)} = ${g(c)}$. Calculați $${A(`${L}O${B}`)}$, $${A(`${L}O${C}`)}$ și $${A(`${C}O${B}`)}$.`,
    solution: lines(
      `Unghiurile cu o latură $O${R}$ și cealaltă $O${L}$ sunt suplementare (împreună fac unghiul alungit $${L}O${R}$):`,
      show(`${A(`${L}O${B}`)} = 180^\\circ - ${g(b)} = ${g(180 - b)}, \\quad ${A(`${L}O${C}`)} = 180^\\circ - ${g(c)} = ${g(180 - c)}`),
      `Semidreapta $O${B}$ este în interiorul unghiului $${R}O${C}$: ${show(`${A(`${C}O${B}`)} = ${g(c)} - ${g(b)} = ${g(c - b)}`)}`,
    ),
    verify: () => 180 - b - (180 - c) === c - b,
    fig: rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 300, arcs: [`${R}O${B}`] }),
  }
}

/** Rays from a vertex with the angles between neighbours written: the sums. p. 133, ex. 13. */
export function angleSumsFan(rng: Rng): Made {
  for (;;) {
    const m = [int(rng, 5, 12) * 5, int(rng, 5, 12) * 5, int(rng, 5, 12) * 5]
    const total = sum(m)
    if (total > 160) continue
    const V = pick(rng, ['A', 'O', 'V'])
    const names = run(rng, 4).filter((c) => c !== V)
    if (names.length < 4) continue
    const start = -total / 2 + int(rng, -10, 10)
    const deg = [start, start + m[0], start + m[0] + m[1], start + total]
    const dirs = Object.fromEntries(names.map((n, i) => [n, deg[i]]))
    const [B, C, D, E] = names
    const fig = measures(rays(V, names.map((name, i) => ({ name, deg: deg[i] })), { w: 280 }), V, dirs,
      [{ between: [B, C], s: `${m[0]}°` }, { between: [C, D], s: `${m[1]}°` }, { between: [D, E], s: `${m[2]}°` }])
    return {
      text: `Semidreptele ${math([B, C, D, E].map((n) => V + n))} din figura alăturată au originea comună $${V}$, iar măsurile unghiurilor dintre semidreptele vecine sunt scrise pe figură. Calculați $${A(`${B}${V}${D}`)}$, $${A(`${C}${V}${E}`)}$ și $${A(`${B}${V}${E}`)}$, apoi completați: $${A(`${B}${V}${E}`)} - ${A(`${D}${V}${E}`)} = \\sphericalangle \\ldots$`,
      solution: lines(
        show(`${A(`${B}${V}${D}`)} = ${A(`${B}${V}${C}`)} + ${A(`${C}${V}${D}`)} = ${g(m[0])} + ${g(m[1])} = ${g(m[0] + m[1])}`),
        show(`${A(`${C}${V}${E}`)} = ${g(m[1])} + ${g(m[2])} = ${g(m[1] + m[2])}, \\quad ${A(`${B}${V}${E}`)} = ${g(m[0])} + ${g(m[1])} + ${g(m[2])} = ${g(total)}`),
        `$${A(`${B}${V}${E}`)} - ${A(`${D}${V}${E}`)} = ${A(`${B}${V}${D}`)}$ $(${g(total)} - ${g(m[2])} = ${g(m[0] + m[1])})$.`,
      ),
      verify: () => total - m[2] === m[0] + m[1],
      fig,
    }
  }
}

/** A, O, B collinear, C and D on one side, COD known, OE and OF the bisectors of AOC and BOD: EOF. p. 147, II.4. */
export function angleBisectorsEOF(rng: Rng): Made {
  for (;;) {
    const cod = int(rng, 4, 14) * 10
    const c = 2 * int(rng, 10, 40)
    const d = 180 - cod - c
    if (d < 20 || d % 2) continue
    const [R, L, C, D, E, F] = some(rng, 6, 'O')
    const dirs = { [R]: 0, [L]: 180, [C]: c, [D]: c + cod, [E]: c / 2, [F]: 180 - d / 2 }
    const base = rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 300 })
    const fig = measures(dashed(base, 'O', [E, F]), 'O', dirs, [{ between: [C, D], s: `${cod}°` }])
    const eof = 90 + cod / 2
    return {
      text: `În figura alăturată, punctele $${R}$, $O$, $${L}$ sunt coliniare, $${A(`${C}O${D}`)} = ${g(cod)}$, semidreapta $O${E}$ este axa de simetrie (bisectoarea) a unghiului $${R}O${C}$, iar $O${F}$ este axa de simetrie a unghiului $${L}O${D}$. Calculați măsura unghiului $${E}O${F}$.`,
      solution: lines(
        `Unghiurile $${R}O${C}$, $${C}O${D}$ și $${D}O${L}$ formează unghiul alungit, deci ${show(`${A(`${R}O${C}`)} + ${A(`${D}O${L}`)} = 180^\\circ - ${g(cod)} = ${g(180 - cod)}`)}`,
        `Axele de simetrie le împart în jumătăți: ${show(`${A(`${E}O${C}`)} + ${A(`${D}O${F}`)} = ${g(180 - cod)} : 2 = ${g((180 - cod) / 2)}`)}`,
        show(`${A(`${E}O${F}`)} = ${A(`${E}O${C}`)} + ${A(`${C}O${D}`)} + ${A(`${D}O${F}`)} = ${g((180 - cod) / 2)} + ${g(cod)} = ${g(eof)}`),
      ),
      verify: () => c / 2 + cod + d / 2 === eof && c + cod + d === 180,
      fig,
    }
  }
}

/** Four angles around a point, two of them with x: x. p. 134, ex. 21 (fig. 2.b, 2.d) and p. 144. */
export function angleAroundPoint(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 8, 30) * 5, b = int(rng, 8, 30) * 5
    const k = int(rng, 2, 4)
    const rest = 360 - a - b
    if (rest % (k + 1)) continue
    const x = rest / (k + 1)
    if (x < 30 || k * x > 170 || a > 170 || b > 170) continue
    const names = run(rng, 4)
    const m = [a, x, b, k * x]
    const start = int(rng, 0, 89)
    const deg = m.map((_, i) => start + sum(m.slice(0, i)))
    const dirs = Object.fromEntries(names.map((n, i) => [n, deg[i]]))
    const ms = names.map((n, i) => ({ between: [n, names[(i + 1) % 4]] as [string, string], s: [`${a}°`, 'x', `${b}°`, `${k}x`][i] }))
    const fig = measures(rays('O', names.map((name, i) => ({ name, deg: deg[i] })), { w: 260 }), 'O', dirs, ms)
    return {
      text: `În figura alăturată, semidreptele ${math(names.map((n) => 'O' + n))} au originea comună $O$, iar măsurile celor patru unghiuri din jurul punctului $O$ sunt scrise pe figură. Determinați $x$ și măsura unghiului $${names[3]}O${names[0]}$.`,
      solution: lines(
        `Unghiurile din jurul unui punct au împreună $360^\\circ$: ${show(`${g(a)} + x + ${g(b)} + ${k}x = 360^\\circ \\Rightarrow ${k + 1}x = 360^\\circ - ${g(a + b)} = ${g(rest)}`)}`,
        show(`x = ${g(rest)} : ${k + 1} = ${g(x)}, \\quad ${A(`${names[3]}O${names[0]}`)} = ${k} \\cdot ${g(x)} = ${g(k * x)}`),
      ),
      verify: () => a + b + (k + 1) * x === 360,
      fig,
    }
  }
}

// ================================================================ the axis of symmetry (pp. 137–148)

/** Squares hatched on one side of an axis: how many to hatch on the other, in all, left white. p. 139, ex. 9. */
export function symCompleteGrid(rng: Rng): Made {
  const m = int(rng, 3, 5), rows = int(rng, 5, 7)
  const cols = 2 * m
  const all: [number, number][] = []
  for (let c = 0; c < m; c++) for (let r = 0; r < rows; r++) all.push([c, r])
  const s = int(rng, 4, Math.min(11, m * rows - 3))
  const cells = shuffle(rng, all).slice(0, s)
  const white = cols * rows - 2 * s
  const side = int(rng, 1, 3)
  return {
    text: `Pe rețeaua de pătrățele din figură, dreapta $d$ împarte dreptunghiul de $${cols} \\times ${rows}$ pătrățele în două jumătăți, iar latura unui pătrățel este de $${side}\\text{ cm}$. Hașurăm pătrățele în jumătatea din dreapta, astfel încât figura hașurată să fie simetrică față de dreapta $d$. a) Câte pătrățele trebuie hașurate în dreapta? b) Câte pătrățele vor fi hașurate în total? c) Câte pătrățele ale dreptunghiului rămân nehașurate? d) Ce arie are figura hașurată?`,
    solution: lines(
      `În stânga dreptei $d$ sunt $${s}$ pătrățele hașurate. Fiecare are simetricul lui în dreapta, pe același rând și la aceeași distanță de $d$.`,
      `a) $${s}$ pătrățele. b) $${s} + ${s} = ${2 * s}$ pătrățele.`,
      `c) Dreptunghiul are $${cols} \\cdot ${rows} = ${cols * rows}$ pătrățele, deci rămân $${cols * rows} -${2 * s} = ${white}$ nehașurate.`,
      `d) Un pătrățel are aria $${side} \\cdot ${side} = ${side * side}\\text{ cm}^2$, deci figura hașurată are $${2 * s} \\cdot ${side * side} = ${2 * s * side * side}\\text{ cm}^2$.`,
    ),
    verify: () => cells.length === s && new Set(cells.map((q) => q.join())).size === s && white >= 0,
    fig: axisGrid(cols, rows, m, cells),
  }
}

/** Points on squared paper and a vertical axis: their distances to the axis and to their symmetric points. p. 143, IV; p. 146, V.2. */
export function symPointsGrid(rng: Rng): Made {
  const cols = 10, rows = 6
  const ax = int(rng, 3, 7)
  const [X, Y] = run(rng, 2)
  let p: [number, number], q: [number, number]
  do {
    p = [int(rng, 0, cols), int(rng, 1, rows - 1)]
    q = [int(rng, 0, cols), int(rng, 1, rows - 1)]
  } while (p[0] === ax || q[0] === ax || (p[0] === q[0] && p[1] === q[1]) || Math.abs(p[0] - ax) === Math.abs(q[0] - ax) && p[1] === q[1])
  const dx = Math.abs(p[0] - ax), dy = Math.abs(q[0] - ax)
  return {
    text: `Pe rețeaua de pătrățele din figură sunt desenate dreapta $d$ și punctele $${X}$ și $${Y}$. Notăm cu $${X}'$ și $${Y}'$ simetricele lor față de dreapta $d$. Latura unui pătrățel este de $1\\text{ cm}$. a) La ce distanță de dreapta $d$ se află fiecare punct? b) Calculați lungimile segmentelor $${X}${X}'$ și $${Y}${Y}'$.`,
    solution: lines(
      `a) Numărăm pătrățelele pe orizontală, până la $d$: $${X}$ este la $${dx}\\text{ cm}$, iar $${Y}$ la $${dy}\\text{ cm}$ de $d$.`,
      `b) Simetricul este pe același rând, de cealaltă parte a lui $d$, la aceeași distanță: ${show(`${X}${X}' = 2 \\cdot ${dx} = ${2 * dx}\\text{ cm}, \\quad ${Y}${Y}' = 2 \\cdot ${dy} = ${2 * dy}\\text{ cm}`)}`,
    ),
    verify: () => dx > 0 && dy > 0 && Math.abs(2 * ax - p[0] - ax) === dx,
    fig: axisGrid(cols, rows, ax, [], { [X]: p, [Y]: q }),
  }
}

/** A horizontal segment on one side of an axis: its symmetric and the segments between them. p. 146, V.2 c). */
export function symSegmentGrid(rng: Rng): Made {
  const cols = 12, rows = 5
  const ax = int(rng, 5, 7)
  const a = int(rng, Math.max(0, 2 * ax - cols), ax - 2), b = int(rng, a + 1, ax - 1)
  const r = int(rng, 1, rows - 1)
  const [X, Y] = some(rng, 2, 'MNO')
  const M = 2 * ax - a, N = 2 * ax - b
  return {
    text: `Pe rețeaua de pătrățele din figură (latura unui pătrățel este de $1\\text{ cm}$) sunt desenate dreapta $d$ și segmentul $${X}${Y}$. Fie $M$ și $N$ simetricele punctelor $${X}$, respectiv $${Y}$, față de dreapta $d$. Calculați lungimile segmentelor $MN$, $${X}M$, $${Y}N$ și $${X}N$.`,
    solution: lines(
      `Segmentul $${X}${Y}$ are $${b - a}\\text{ cm}$; $${X}$ este la $${ax - a}\\text{ cm}$ de $d$, iar $${Y}$ la $${ax - b}\\text{ cm}$. Simetricele sunt pe același rând, de cealaltă parte a lui $d$, la aceleași distanțe.`,
      show(`MN = ${X}${Y} = ${b - a}\\text{ cm}, \\quad ${X}M = 2 \\cdot ${ax - a} = ${M - a}\\text{ cm}, \\quad ${Y}N = 2 \\cdot ${ax - b} = ${N - b}\\text{ cm}`),
      show(`${X}N = ${X}${Y} + ${Y}N = ${b - a} + ${N - b} = ${N - a}\\text{ cm}`),
    ),
    verify: () => M - N === b - a && M <= cols && N > ax,
    fig: axisGrid(cols, rows, ax, [], { [X]: [a, r], [Y]: [b, r] }, `${X}-${Y}`),
  }
}

/** The line AB is the axis of symmetry of the angle MON, O on AB, MOA known: MON, MOB. p. 139, ex. 16. */
export function symAxisLine(rng: Rng): Made {
  const m = int(rng, 4, 14) * 5
  const [L, R, M, N] = some(rng, 4, 'O')
  const dirs = { [L]: 180, [R]: 0, [M]: 180 - m, [N]: 180 + m }
  const fig = measures(rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 280, arcs: [`${M}O${L}`] }), 'O', dirs, [{ between: [L, M], s: `${m}°` }])
  return {
    text: `În figura alăturată, punctele $${L}$, $O$ și $${R}$ sunt coliniare, dreapta $${L}${R}$ este axa de simetrie a unghiului $${M}O${N}$, iar $${A(`${M}O${L}`)} = ${g(m)}$. Calculați măsurile unghiurilor $${M}O${N}$, $${M}O${R}$ și $${N}O${R}$.`,
    solution: lines(
      `Semidreptele $O${M}$ și $O${N}$ sunt simetrice față de dreapta $${L}${R}$, deci $${A(`${N}O${L}`)} = ${A(`${M}O${L}`)} = ${g(m)}$ și ${show(`${A(`${M}O${N}`)} = 2 \\cdot ${g(m)} = ${g(2 * m)}`)}`,
      show(`${A(`${M}O${R}`)} = ${A(`${N}O${R}`)} = 180^\\circ - ${g(m)} = ${g(180 - m)}`),
    ),
    verify: () => 2 * m + 2 * (180 - m) === 360,
    fig,
  }
}

/** The axis of symmetry of an angle and the ray opposite to one side. p. 139, ex. 12; p. 148, V. */
export function symAngleAxis(rng: Rng): Made {
  const t = int(rng, 5, 16) * 10
  const base = int(rng, -20, 20)
  const [X, Y, M, Z] = some(rng, 4, 'O')
  const dirs = { [X]: base, [Y]: base + t, [M]: base + t / 2, [Z]: base + 180 }
  const fig = dashed(rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 280, arcs: [`${X}O${M}`, `${M}O${Y}`] }), 'O', [M, Z])
  return {
    text: `În figura alăturată, $${A(`${X}O${Y}`)} = ${g(t)}$, semidreapta $O${M}$ este axa de simetrie a unghiului $${X}O${Y}$, iar $O${Z}$ este semidreapta opusă semidreptei $O${X}$. Calculați măsurile unghiurilor $${X}O${M}$, $${M}O${Z}$ și $${Y}O${Z}$ și precizați ce fel de unghi este fiecare.`,
    solution: lines(
      `Axa de simetrie împarte unghiul în două unghiuri congruente: ${show(`${A(`${X}O${M}`)} = ${A(`${M}O${Y}`)} = ${g(t)} : 2 = ${g(t / 2)}`)}`,
      `$${X}O${Z}$ este unghi alungit: ${show(`${A(`${M}O${Z}`)} = 180^\\circ - ${g(t / 2)} = ${g(180 - t / 2)}, \\quad ${A(`${Y}O${Z}`)} = 180^\\circ - ${g(t)} = ${g(180 - t)}`)}`,
      `Deci $${X}O${M}$ este ascuțit, $${M}O${Z}$ obtuz, iar $${Y}O${Z}$ ${180 - t < 90 ? 'ascuțit' : 180 - t === 90 ? 'drept' : 'obtuz'}.`,
    ),
    verify: () => t / 2 + (180 - t / 2) === 180 && t < 180,
    fig,
  }
}

/** A straight angle AOB, AOC and BOE equal, COD k times AOC: is OD the axis of symmetry of COE? p. 139, ex. 15. */
export function symStraightCheck(rng: Rng): Made {
  for (;;) {
    const yes = rng() < 0.5
    let a: number, k: number
    if (yes) [k, a] = pick(rng, [[1, 45], [2, 30], [4, 18], [5, 15]] as [number, number][])
    else {
      k = int(rng, 1, 4)
      a = int(rng, 3, 8) * 5
    }
    const doe = 180 - 2 * a - k * a
    if (doe < 15 || (!yes && doe === k * a)) continue
    const [L, R, C, D, E] = some(rng, 5, 'O')
    const dirs = { [L]: 180, [R]: 0, [C]: 180 - a, [D]: 180 - a - k * a, [E]: a }
    const fig = measures(rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 300 }), 'O', dirs,
      [{ between: [L, C], s: `${a}°` }, { between: [E, R], s: `${a}°` }])
    const axis = doe === k * a
    return {
      text: `Unghiul $${L}O${R}$ din figură este alungit. Punctele $${C}$, $${D}$, $${E}$ sunt de aceeași parte a dreptei $${L}${R}$, $${A(`${L}O${C}`)} = ${A(`${R}O${E}`)} = ${g(a)}$ și $${A(`${C}O${D}`)} = ${k === 1 ? '' : `${k} \\cdot `}${A(`${L}O${C}`)}$. a) Calculați măsurile unghiurilor $${C}O${D}$ și $${D}O${E}$. b) Este dreapta $O${D}$ axă de simetrie pentru unghiul $${C}O${E}$?`,
      solution: lines(
        `a) ${show(`${A(`${C}O${D}`)} = ${k === 1 ? '' : `${k} \\cdot `}${g(a)} = ${g(k * a)}, \\quad ${A(`${D}O${E}`)} = 180^\\circ - ${g(a)} - ${g(k * a)} - ${g(a)} = ${g(doe)}`)}`,
        `b) $O${D}$ este axă de simetrie pentru unghiul $${C}O${E}$ doar dacă îl împarte în două unghiuri congruente. ${axis ? `Aici $${A(`${C}O${D}`)} = ${A(`${D}O${E}`)} = ${g(doe)}$, deci da.` : `Aici $${g(k * a)} \\ne ${g(doe)}$, deci nu.`}`,
      ),
      verify: () => a + k * a + doe + a === 180 && axis === (a * (2 * k + 2) === 180),
      fig,
    }
  }
}

/** OM the axis of AOB, P inside AOM with POM known: POB and AOP. p. 147, II.3. */
export function symAxisInteriorPoint(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 5, 16) * 10
    const p = int(rng, 2, 9) * 4
    if (p > t / 2 - 10) continue
    const base = int(rng, -10, 20)
    const [X, Y, M, Q] = some(rng, 4, 'O')
    const dirs = { [X]: base, [Y]: base + t, [M]: base + t / 2, [Q]: base + t / 2 - p }
    const fig = dashed(rays('O', Object.entries(dirs).map(([name, deg]) => ({ name, deg })), { w: 280, arcs: [`${Q}O${M}`] }), 'O', [M])
    return {
      text: `Se consideră unghiul $${X}O${Y}$ cu măsura de $${g(t)}$ și semidreapta $O${M}$, axa lui de simetrie (figura alăturată). Semidreapta $O${Q}$ este în interiorul unghiului $${X}O${M}$, iar $${A(`${Q}O${M}`)} = ${g(p)}$. Calculați măsurile unghiurilor $${Q}O${Y}$ și $${X}O${Q}$.`,
      solution: lines(
        show(`${A(`${X}O${M}`)} = ${A(`${M}O${Y}`)} = ${g(t)} : 2 = ${g(t / 2)}`),
        show(`${A(`${Q}O${Y}`)} = ${A(`${Q}O${M}`)} + ${A(`${M}O${Y}`)} = ${g(p)} + ${g(t / 2)} = ${g(p + t / 2)}`),
        show(`${A(`${X}O${Q}`)} = ${A(`${X}O${M}`)} - ${A(`${Q}O${M}`)} = ${g(t / 2)} - ${g(p)} = ${g(t / 2 - p)}`),
      ),
      verify: () => p + t / 2 + (t / 2 - p) === t,
      fig,
    }
  }
}

// ================================================================ the kinds

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d5-number-line', label: 'Axa numerelor', topic: 'Algebră', joins: 'v-number-line',
    forms: { 1: [axisLengths, axisReadPoints], 2: [axisMidpoint, axisSymmetric], 3: [] },
  },
  {
    id: 'v-d5-charts', label: 'Diagrame și tabele', topic: 'Algebră', joins: 'v-statistics',
    forms: { 1: [chartBooks, chartMarksRead], 2: [chartMarksMean, chartTemperature, tableMarks], 3: [chartPie, tableTickets, chartBooksPercent] },
  },
  {
    id: 'v-d5-count', label: 'Numărarea figurilor', topic: 'Geometrie', joins: 'v-count-figures',
    forms: {
      1: [countRaysThroughPoint, countSegmentsOnSegment, countAnglesFromRays],
      2: [countLinesNoThree, countCrossingLines, countLinesSomeCollinear],
      3: [countAnglesWithLine, countUnitPieces],
    },
  },
  {
    id: 'v-d5-segments', label: 'Lungimi citite pe figură', topic: 'Geometrie', joins: 'v-segment-length',
    forms: { 1: [segEqualPieces, segTwoPieces], 2: [segFourPoints, segRailway, segFromOrigin], 3: [segGrowingPieces, segMixedOrder] },
  },
  {
    id: 'v-d5-midpoints', label: 'Mijloace și simetrice pe figură', topic: 'Geometrie', joins: 'v-midpoint-symmetric',
    forms: { 1: [midAMC, midMNP], 2: [midTwoMidpoints, midSymmetricChain, midSymmetricBCD], 3: [midHalving, midThreeMidpoints] },
  },
  {
    id: 'v-d5-angles', label: 'Unghiuri pe figură', topic: 'Geometrie', joins: 'v-angle-calc',
    forms: { 1: [angleProtractor, angleXOnLine], 2: [angleXExpressions, angleTwoRaysOnLine, angleSumsFan], 3: [angleBisectorsEOF, angleAroundPoint] },
  },
  {
    id: 'v-d5-symmetry', label: 'Axa de simetrie pe figură', topic: 'Geometrie', joins: 'v-symmetry-axis',
    forms: { 1: [symCompleteGrid, symPointsGrid], 2: [symSegmentGrid, symAxisLine, symAngleAxis], 3: [symStraightCheck, symAxisInteriorPoint] },
  },
]

export const CONTEST: DrawnContest[] = []
