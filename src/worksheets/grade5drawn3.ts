// Grade V exercises with drawings from the workbook "cu puișorul", pp. 80–116 (photographed on 14 November 2026):
// the geometry chapter (5.1–5.7: points, lines, segments, angles, the axis of symmetry; 5.8 lengths and perimeters),
// the school contests (5.11), the recap tests and the portfolio sheets. The earlier pass (grade5puisor3.ts,
// grade5puisor4.ts) skipped what needs a figure; these forms draw their own (`fig`), from the same numbers.
// Seen: pp. 80–116. Pages with figures used: 80, 81, 83–89, 91, 92, 98, 113. Without figures: 93–97, 99–112, 114–116.
// Levels after the stars of the sections (* = 1, ** = 2, *** = 3). Every form names its page and exercise.
import type { Made } from './generators'
import type { DrawnContest, DrawnKind } from './grade5drawn'
import { pointsOnLine, rays, table } from './figures5'
import { onCircle, plane, type Fig, type Pt } from '../models/figure'
import { de, int, pick, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const C2 = (n: number) => (n * (n - 1)) / 2
const num = (x: number) => String(Math.round(x * 1000) / 1000)
/** a decimal in LaTeX, with the Romanian comma */
const T = (x: number) => num(x).replace('.', '{,}')
/** a decimal on a figure */
const F = (x: number) => num(x).replace('.', ',')
const cm = (x: number) => `${T(x)}\\text{ cm}`
const A = (name: string) => `\\sphericalangle ${name}`
const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : items[0])
const math = (items: string[]) => list(items.map((x) => `$${x}$`))
const same = (x: number, y: number) => Math.abs(x - y) < 1e-9

/** letter sets for the points, never O (the vertex of the angles) */
const SETS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  ['M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U'],
  ['E', 'F', 'G', 'H', 'K', 'L', 'M', 'N'],
]
function letters(rng: Rng, n: number): string[] {
  const set = pick(rng, SETS)
  const s = int(rng, 0, set.length - n)
  return set.slice(s, s + n)
}

/** measures written inside angles with the vertex v, between the directions a and b (degrees), further out than `rays` does */
function writeAngles(fig: Fig, v: string, items: { a: number; b: number; s: string }[], r = 54): Fig {
  return { ...fig, t: [...(fig.t ?? []), ...items.map((it) => ({ at: onCircle(fig.p[v], r, (it.a + it.b) / 2), s: it.s, size: 11 }))] }
}

/** the kind of a proper angle */
const kindOf = (m: number) => (m < 90 ? 'ascuțit' : m === 90 ? 'drept' : m < 180 ? 'obtuz' : 'alungit')

// ---------- counting in a figure made of lines: segments and triangles, from the drawn lines ----------
/** each drawn line as the list of the marked points on it */
const countSegments = (ls: string[][]) => ls.reduce((s, l) => s + C2(l.length), 0)
function countTriangles(ls: string[][]): number {
  const pts = [...new Set(ls.flat())]
  const joined = (a: string, b: string) => ls.some((l) => l.includes(a) && l.includes(b))
  const oneLine = (a: string, b: string, c: string) => ls.some((l) => l.includes(a) && l.includes(b) && l.includes(c))
  let n = 0
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) for (let k = j + 1; k < pts.length; k++) {
    const [a, b, c] = [pts[i], pts[j], pts[k]]
    if (joined(a, b) && joined(b, c) && joined(a, c) && !oneLine(a, b, c)) n++
  }
  return n
}

// ======================= counting figures (pp. 80–81, 83, 85–86, 113) → v-count-figures =======================

/** Points on a line: the segments, the rays or the pairs of opposite rays, p. 80, ex. 3–5 and p. 113, ex. 1. */
export function d3CountOnLine(rng: Rng): Made {
  const n = int(rng, 4, 7)
  const P = letters(rng, n)
  const at: number[] = []
  let x = 0
  for (let i = 0; i < n; i++) {
    at.push(x)
    x += int(rng, 2, 5)
  }
  const fig = pointsOnLine(P, at, { line: 'd' })
  const where = `Pe dreapta $d$ din figura alăturată sunt marcate, în această ordine, punctele ${math(P)}.`
  const segs: string[] = []
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) segs.push(P[i] + P[j])
  const rs = new Set<string>()
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) rs.add(`${i}${j > i ? '+' : '-'}`)
  const inner = P.filter((_, i) => rs.has(`${i}+`) && rs.has(`${i}-`))
  const q = pick(rng, ['seg', 'ray', 'opp'] as const)
  if (q === 'seg') {
    return {
      text: `${where} Câte segmente cu ambele capete printre punctele marcate sunt în figură? Numiți-le.`,
      solution: lines(
        `Fiecare punct formează un segment cu fiecare dintre celelalte ${n - 1}; numărând așa, fiecare segment apare de două ori (o dată la fiecare capăt):`,
        show(`${n} \\cdot ${n - 1} : 2 = ${C2(n)}`),
        `Sunt ${de(C2(n))} segmente: ${math(segs)}.`,
      ),
      verify: () => segs.length === C2(n),
      fig,
    }
  }
  if (q === 'ray') {
    const named = P.flatMap((p, i) => [...(i < n - 1 ? [`(${p}${P[i + 1]}`] : []), ...(i > 0 ? [`(${p}${P[i - 1]}`] : [])])
    return {
      text: `${where} Câte semidrepte diferite, cu originea într-unul dintre punctele marcate și care mai conțin un punct marcat, se pot numi în figură? Numiți-le.`,
      solution: lines(
        `Din fiecare punct pleacă două semidrepte opuse; pentru capetele $${P[0]}$ și $${P[n - 1]}$, doar una dintre ele mai conține puncte marcate. Semidreptele cu aceeași origine și același sens sunt aceeași (de exemplu $(${P[0]}${P[1]}$ și $(${P[0]}${P[2]}$).`,
        show(`2 \\cdot ${n} - 2 = ${2 * n - 2}`),
        `Sunt ${de(2 * n - 2)} semidrepte: ${math(named)}.`,
      ),
      verify: () => rs.size === 2 * n - 2 && named.length === rs.size,
      fig,
    }
  }
  return {
    text: `${where} Câte perechi de semidrepte opuse se pot numi în figură, dacă originea este un punct marcat, iar fiecare semidreaptă mai conține un punct marcat? Numiți-le.`,
    solution: lines(
      `Două semidrepte opuse au aceeași origine și sensuri diferite. Din capetele $${P[0]}$ și $${P[n - 1]}$ pleacă doar câte o semidreaptă care mai conține un punct marcat, deci originea este unul dintre punctele dintre ele: ${math(inner)}.`,
      `Sunt ${de(inner.length)} perechi: ${inner.map((p) => { const i = P.indexOf(p); return `$(${p}${P[i - 1]}$ și $(${p}${P[i + 1]}$` }).join('; ')}.`,
    ),
    verify: () => inner.length === n - 2,
    fig,
  }
}

/** Rays with a common origin in a half-plane: how many angles, p. 85, ex. 1 and p. 86, ex. 2 a. */
export function d3CountAngles(rng: Rng): Made {
  const n = int(rng, 3, 6)
  const P = letters(rng, n)
  const start = int(rng, 6, 24)
  const room = Math.floor((170 - start) / (n - 1))
  const degs = [start]
  for (let i = 1; i < n; i++) degs.push(degs[i - 1] + int(rng, 24, Math.max(24, room)))
  // P[0] on the left: the largest direction
  const fig = rays('O', P.map((name, i) => ({ name, deg: degs[n - 1 - i] })), { w: 280 })
  const angs: string[] = []
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) angs.push(A(`${P[i]}O${P[j]}`))
  return {
    text: `În figura alăturată, semidreptele ${math(P.map((p) => `(O${p}`))} au originea comună $O$ și sunt în același semiplan. Câte unghiuri au ambele laturi printre aceste semidrepte? Numiți-le.`,
    solution: lines(
      `Fiecare dintre cele ${n} semidrepte formează un unghi cu fiecare dintre celelalte ${n - 1}; așa, fiecare unghi se numără de două ori:`,
      show(`${n} \\cdot ${n - 1} : 2 = ${C2(n)}`),
      `Unghiurile sunt: ${math(angs)}.`,
    ),
    verify: () => angs.length === C2(n) && degs.every((d, i) => i === 0 || d > degs[i - 1]) && degs[n - 1] < 180,
    fig,
  }
}

/** n points, of which only k are collinear: the lines and the segments they determine, p. 80, ex. 6 and p. 83, ex. 12. */
export function d3LinesThroughPoints(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 5, 7)
    const k = int(rng, 3, n - 2)
    const pts: Pt[] = []
    let x = 0
    for (let i = 0; i < k; i++) {
      pts.push([x, 0])
      x += int(rng, 2, 3)
    }
    const xm = pts[k - 1][0]
    const ok = (q: Pt) => pts.every((a) => Math.hypot(a[0] - q[0], a[1] - q[1]) >= 2) &&
      pts.every((a, i) => pts.every((b, j) => j <= i || Math.abs((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) >= 3))
    for (let t = 0; t < 300 && pts.length < n; t++) {
      const q: Pt = [int(rng, -1, xm + 1), pick(rng, [-1, 1]) * int(rng, 2, 3)]
      if (ok(q)) pts.push(q)
    }
    if (pts.length < n) continue
    const names = shuffle(rng, letters(rng, n))
    const col = names.slice(0, k)
    const sorted = [...col].sort()
    const others = names.slice(k).sort()
    // the distinct lines, from the pairs
    const keys = new Set<string>()
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const [a, b] = [pts[i], pts[j]]
      let p = b[1] - a[1], q = a[0] - b[0]
      const g = (u: number, v: number): number => (v === 0 ? Math.abs(u) : g(v, u % v))
      const d = g(p, q) || 1
      p /= d; q /= d
      if (p < 0 || (p === 0 && q < 0)) { p = -p; q = -q }
      keys.add(`${p},${q},${p * a[0] + q * a[1]}`)
    }
    const L = C2(n) - C2(k) + 1
    const fig = plane(Object.fromEntries(names.map((nm, i) => [nm, pts[i]])), 280, { dot: names.join(' ') })
    return {
      text: `În figura alăturată sunt marcate punctele ${math([...names].sort())}. Dintre ele, doar punctele ${math(sorted)} sunt coliniare; oricare alte trei puncte nu sunt coliniare. Câte drepte și câte segmente se pot desena unind punctele două câte două?`,
      solution: lines(
        `Segmentele: fiecare punct se unește cu fiecare dintre celelalte ${n - 1}, iar fiecare segment se numără de două ori:`,
        show(`${n} \\cdot ${n - 1} : 2 = ${C2(n)}\\text{ segmente}`),
        `Dreptele: dacă oricare trei puncte ar fi necoliniare, ar fi tot ${de(C2(n))} drepte. Dar cele ${k} puncte coliniare ${math(sorted)} formează $${k} \\cdot ${k - 1} : 2 = ${C2(k)}$ perechi care dau toate aceeași dreaptă:`,
        show(`${C2(n)} - ${C2(k)} + 1 = ${L}\\text{ drepte}`),
        others.length ? `(Punctele ${math(others)} nu sunt pe dreapta celor coliniare.)` : '',
      ),
      verify: () => keys.size === L,
      fig,
    }
  }
}

/** A triangle with segments from a vertex to the opposite side: triangles, segments or angles at the vertex, p. 81, ex. 9 c. */
export function d3Cevians(rng: Rng): Made {
  const k = int(rng, 1, 3)
  const N = letters(rng, k + 3)
  const [V, ...base] = N
  const X = base[0], Y = base[k + 1]
  const inner = base.slice(1, k + 1)
  const bx: number[] = [0]
  for (let i = 1; i < k + 2; i++) bx.push(bx[i - 1] + int(rng, 2, 4))
  const apex: Pt = [int(rng, 1, bx[k + 1] - 1) + 0.5, int(rng, 4, 6)]
  const pts: Record<string, Pt> = { [V]: apex }
  base.forEach((b, i) => (pts[b] = [bx[i], 0]))
  const ls = [base, ...base.map((b) => [V, b])]
  const fig = plane(pts, 280, { s: [`${V}-${X}-${Y}-${V}`, ...inner.map((m) => `${V}-${m}`)].join(' ') })
  const where = `În figura alăturată, ${k === 1 ? `punctul $${inner[0]}$ se află` : `punctele ${math(inner)} se află`} pe latura $${X}${Y}$ a triunghiului $${V}${X}${Y}$ și ${k === 1 ? 'este unit' : 'sunt unite'} cu vârful $${V}$.`
  const m = k + 2
  const pairs = `Pe latura $${X}${Y}$ sunt ${m} puncte, care formează $${m} \\cdot ${m - 1} : 2 = ${C2(m)}$ perechi`
  const q = pick(rng, ['tri', 'seg', 'ang'] as const)
  if (q === 'tri') {
    return {
      text: `${where} Câte triunghiuri sunt în figură?`,
      solution: lines(
        `Fiecare triunghi are vârful $${V}$ și latura opusă pe $${X}${Y}$, cu capetele în două dintre punctele marcate pe ea. ${pairs}, deci:`,
        show(`${C2(m)}\\text{ triunghiuri}`),
      ),
      verify: () => countTriangles(ls) === C2(m),
      fig,
    }
  }
  if (q === 'seg') {
    return {
      text: `${where} Câte segmente sunt în figură?`,
      solution: lines(
        `${pairs}, deci ${de(C2(m))} segmente pe $${X}${Y}$. Din $${V}$ pleacă încă ${m} segmente (câte unul spre fiecare punct de pe $${X}${Y}$):`,
        show(`${C2(m)} + ${m} = ${C2(m) + m}\\text{ segmente}`),
      ),
      verify: () => countSegments(ls) === C2(m) + m,
      fig,
    }
  }
  return {
    text: `${where} Câte unghiuri cu vârful în $${V}$ (diferite de unghiul nul) sunt în figură?`,
    solution: lines(
      `Din $${V}$ pleacă ${m} semidrepte, fiecare spre un punct de pe $${X}${Y}$. Oricare două formează un unghi:`,
      show(`${m} \\cdot ${m - 1} : 2 = ${C2(m)}\\text{ unghiuri}`),
    ),
    verify: () => ls.slice(1).length === m,
    fig,
  }
}

/** A triangle with segments from a vertex and a segment parallel to the base across them: triangles, trapezoids, segments, p. 81, ex. 9 c (extended). */
export function d3CeviansParallel(rng: Rng): Made {
  const k = int(rng, 1, 3)
  const m = k + 2
  const [V, X, Y, M, Nn] = pick(rng, [['A', 'B', 'C', 'M', 'N'], ['V', 'E', 'F', 'P', 'Q'], ['O', 'R', 'S', 'K', 'L']])
  const bx: number[] = [0]
  for (let i = 1; i < m; i++) bx.push(bx[i - 1] + int(rng, 2, 4))
  const apex: Pt = [int(rng, 1, bx[m - 1] - 1) + 0.5, int(rng, 5, 7)]
  const tt = pick(rng, [0.45, 0.5, 0.55])
  const pts: Record<string, Pt> = { [V]: apex }
  const baseN = bx.map((_, i) => (i === 0 ? X : i === m - 1 ? Y : `b${i}`))
  const topN = bx.map((_, i) => (i === 0 ? M : i === m - 1 ? Nn : `t${i}`))
  bx.forEach((x, i) => {
    pts[baseN[i]] = [x, 0]
    pts[topN[i]] = [apex[0] + (x - apex[0]) * tt, apex[1] * (1 - tt)]
  })
  const hidden = Object.fromEntries([...baseN, ...topN].filter((n) => /\d/.test(n)).map((n) => [n, ''] as [string, '']))
  const ls = [baseN, topN, ...bx.map((_, i) => [V, topN[i], baseN[i]])]
  const fig = plane(pts, 280, {
    s: [`${V}-${X}-${Y}-${V}`, `${M}-${Nn}`, ...baseN.slice(1, -1).map((b) => `${V}-${b}`)].join(' '),
    l: { ...hidden, [M]: 'w', [Nn]: 'e' },
  })
  const where = `În figura alăturată, triunghiul $${V}${X}${Y}$ are ${k === 1 ? 'un segment dus' : `${k} segmente duse`} din vârful $${V}$ până pe latura $${X}${Y}$, iar segmentul $${M}${Nn}$, paralel cu $${X}${Y}$ ($${M}$ pe $${V}${X}$, $${Nn}$ pe $${V}${Y}$), ${k === 1 ? 'îl taie' : 'le taie pe toate'}.`
  const lead = `Din $${V}$ pleacă ${m} drepte (laturile $${V}${X}$, $${V}${Y}$ și ${k === 1 ? 'segmentul dus' : `cele ${k} segmente`}); oricare două dintre ele formează $${m} \\cdot ${m - 1} : 2 = ${C2(m)}$ perechi.`
  const q = pick(rng, ['tri', 'trap', 'seg'] as const)
  if (q === 'tri') {
    return {
      text: `${where} Câte triunghiuri sunt în figură?`,
      solution: lines(
        lead,
        `Fiecare pereche dă un triunghi cu baza pe $${M}${Nn}$ și unul cu baza pe $${X}${Y}$:`,
        show(`2 \\cdot ${C2(m)} = ${2 * C2(m)}\\text{ triunghiuri}`),
      ),
      verify: () => countTriangles(ls) === 2 * C2(m),
      fig,
    }
  }
  if (q === 'trap') {
    return {
      text: `${where} Câte trapeze sunt în figură?`,
      solution: lines(
        lead,
        `Fiecare pereche de drepte din $${V}$ taie, între $${M}${Nn}$ și $${X}${Y}$, un trapez (are două laturi paralele):`,
        show(`${C2(m)}\\text{ trapeze}`),
      ),
      verify: () => C2(baseN.length) === C2(m) && countTriangles(ls) - countTriangles([baseN, ...bx.map((_, i) => [V, baseN[i]])]) === C2(m),
      fig,
    }
  }
  return {
    text: `${where} Câte segmente sunt în figură?`,
    solution: lines(
      `Pe $${X}${Y}$ și pe $${M}${Nn}$ sunt câte ${m} puncte: câte $${m} \\cdot ${m - 1} : 2 = ${C2(m)}$ segmente pe fiecare.`,
      `Pe fiecare dintre cele ${m} drepte din $${V}$ sunt câte 3 puncte, deci câte 3 segmente:`,
      show(`2 \\cdot ${C2(m)} + 3 \\cdot ${m} = ${2 * C2(m) + 3 * m}\\text{ segmente}`),
    ),
    verify: () => countSegments(ls) === 2 * C2(m) + 3 * m,
    fig,
  }
}

/** A straight angle split by rays, the consecutive measures written in: how many acute, right and obtuse angles, p. 86, ex. 2 and p. 87, ex. 6. */
export function d3AcuteCount(rng: Rng): Made {
  for (;;) {
    const r = int(rng, 2, 3)
    const parts: number[] = []
    let rem = 180
    for (let i = 0; i < r; i++) {
      const hi = Math.floor((rem - 30 * (r - i)) / 5)
      const p = 5 * int(rng, 6, Math.max(6, Math.min(hi, 22)))
      parts.push(p)
      rem -= p
    }
    if (rem < 30) continue
    parts.push(rem)
    const N = letters(rng, r + 2)
    const dirs: number[] = [180]
    parts.forEach((p, i) => dirs.push(dirs[i] - p))
    let fig = rays('O', N.map((name, i) => ({ name, deg: dirs[i] })), { w: 300 })
    fig = writeAngles(fig, 'O', parts.map((p, i) => ({ a: dirs[i], b: dirs[i + 1], s: `${p}°` })))
    const all: { n: string; m: number }[] = []
    for (let i = 0; i <= r + 1; i++) for (let j = i + 1; j <= r + 1; j++) {
      if (i === 0 && j === r + 1) continue
      all.push({ n: `${N[i]}O${N[j]}`, m: dirs[i] - dirs[j] })
    }
    const acute = all.filter((a) => a.m < 90), right = all.filter((a) => a.m === 90), obtuse = all.filter((a) => a.m > 90)
    const consec = parts.map((p, i) => `${A(`${N[i]}O${N[i + 1]}`)} = ${p}^\\circ`)
    return {
      text: `În figura alăturată, punctele $${N[0]}$, $O$, $${N[r + 1]}$ sunt coliniare, iar ${math(consec)}. Considerăm toate unghiurile cu vârful $O$ și laturile printre semidreptele din figură, în afară de unghiul alungit $${N[0]}O${N[r + 1]}$. Câte dintre ele sunt ascuțite, câte drepte și câte obtuze?`,
      solution: lines(
        `Sunt $${r + 2} \\cdot ${r + 1} : 2 - 1 = ${all.length}$ unghiuri. Măsura fiecăruia este suma unghiurilor consecutive dintre laturile lui:`,
        ...[0, 3, 6].filter((i) => i < all.length).map((i) => show(all.slice(i, i + 3).map((a) => `${A(a.n)} = ${a.m}^\\circ`).join(',\\quad '))),
        `Ascuțite (sub $90^\\circ$): ${acute.length}; drepte: ${right.length}; obtuze (între $90^\\circ$ și $180^\\circ$): ${obtuse.length}.`,
      ),
      verify: () => parts.reduce((s, p) => s + p, 0) === 180 && acute.length + right.length + obtuse.length === C2(r + 2) - 1,
      fig,
    }
  }
}

// ======================= segment lengths read on a figure (pp. 83–84) → v-segment-length =======================

/** A, B, C, D in order with the three pieces written on the figure: AC, BD, AD, p. 83, ex. 1 and p. 84, ex. 10. */
export function d3SegSum(rng: Rng): Made {
  const P = letters(rng, 4)
  const dec = rng() < 0.5
  const p = [0, 1, 2].map(() => (dec ? int(rng, 12, 95) : 10 * int(rng, 2, 12)))
  const at = [0, p[0], p[0] + p[1], p[0] + p[1] + p[2]]
  const fig = pointsOnLine(P, at, { lengths: p.map((x) => `${F(x / 10)} cm`), segment: true })
  const s = (i: number, j: number) => at[j] - at[i]
  return {
    text: `În figura alăturată, punctele ${math(P)} sunt coliniare, în această ordine, iar $${P[0]}${P[1]} = ${cm(p[0] / 10)}$, $${P[1]}${P[2]} = ${cm(p[1] / 10)}$, $${P[2]}${P[3]} = ${cm(p[2] / 10)}$, ca pe figură. Aflați lungimile segmentelor $${P[0]}${P[2]}$, $${P[1]}${P[3]}$ și $${P[0]}${P[3]}$.`,
    solution: lines(
      'Un punct dintre capetele unui segment îl împarte în două segmente cu suma lungimilor egală cu lungimea lui:',
      show(`${P[0]}${P[2]} = ${P[0]}${P[1]} + ${P[1]}${P[2]} = ${T(p[0] / 10)} + ${T(p[1] / 10)} = ${cm(s(0, 2) / 10)}`),
      show(`${P[1]}${P[3]} = ${P[1]}${P[2]} + ${P[2]}${P[3]} = ${T(p[1] / 10)} + ${T(p[2] / 10)} = ${cm(s(1, 3) / 10)}`),
      show(`${P[0]}${P[3]} = ${P[0]}${P[2]} + ${P[2]}${P[3]} = ${T(s(0, 2) / 10)} + ${T(p[2] / 10)} = ${cm(s(0, 3) / 10)}`),
    ),
    verify: () => s(0, 3) === p[0] + p[1] + p[2] && s(0, 2) + s(1, 3) === s(0, 3) + p[1],
    fig,
  }
}

/** E, F, G, H in order with EH, EG and FH known: GH, FG, EF, p. 84, ex. 11. */
export function d3SegFromWholes(rng: Rng): Made {
  const P = letters(rng, 4)
  const [a, b, c] = [int(rng, 2, 12), int(rng, 2, 12), int(rng, 2, 12)]
  const AD = a + b + c, AC = a + b, BD = b + c
  const fig = pointsOnLine(P, [0, a, a + b, AD], { segment: true })
  const [p, q, r, s] = P
  return {
    text: `Punctele ${math(P)} din figura alăturată sunt coliniare, în această ordine, astfel încât $${p}${s} = ${cm(AD)}$, $${p}${r} = ${cm(AC)}$ și $${q}${s} = ${cm(BD)}$. Aflați lungimile segmentelor $${r}${s}$, $${q}${r}$ și $${p}${q}$.`,
    solution: lines(
      show(`${r}${s} = ${p}${s} - ${p}${r} = ${AD} - ${AC} = ${cm(c)}`),
      show(`${q}${r} = ${q}${s} - ${r}${s} = ${BD} - ${c} = ${cm(b)}`),
      show(`${p}${q} = ${p}${r} - ${q}${r} = ${AC} - ${b} = ${cm(a)}`),
    ),
    verify: () => AD - AC === c && BD - c === b && AC - b === a,
    fig,
  }
}

/** A, C, B, D, F, E in order; AE, AB, BD, AC ≡ BD, DF known: DE, FE, AC, CB, p. 84, ex. 13. */
export function d3SegCongruent(rng: Rng): Made {
  const b = int(rng, 2, 9), c = int(rng, 1, 9), f = int(rng, 2, 9), e = int(rng, 1, 9)
  const AB = b + c, AE = 2 * b + c + f + e, DE = f + e
  const P = ['A', 'C', 'B', 'D', 'F', 'E']
  const fig = pointsOnLine(P, [0, b, b + c, 2 * b + c, 2 * b + c + f, AE], { segment: true })
  return {
    text: `În figura alăturată, punctele $A$, $C$, $B$, $D$, $F$, $E$ sunt coliniare, în această ordine. Se cunosc $AE = ${cm(AE)}$, $AB = ${cm(AB)}$, $BD = ${cm(b)}$, $AC \\equiv BD$ și $DF = ${cm(f)}$. Aflați lungimile segmentelor $DE$, $FE$, $AC$ și $CB$.`,
    solution: lines(
      show(`AC = BD = ${cm(b)}, \\qquad CB = AB - AC = ${AB} - ${b} = ${cm(c)}`),
      show(`DE = AE - AB - BD = ${AE} - ${AB} - ${b} = ${cm(DE)}`),
      show(`FE = DE - DF = ${DE} - ${f} = ${cm(e)}`),
    ),
    verify: () => b + c + b + DE === AE && DE - f === e,
    fig,
  }
}

/** A, B, C, E, F in order; AB ≡ BC, CE ≡ EF, AF known, CE d cm longer than BC: AB and CE, p. 84, ex. 15. */
export function d3SegEqualPairs(rng: Rng): Made {
  const x = int(rng, 2, 12), d = int(rng, 1, 6)
  const AF = 4 * x + 2 * d
  const P = ['A', 'B', 'C', 'E', 'F']
  const fig = pointsOnLine(P, [0, x, 2 * x, 3 * x + d, AF], { segment: true })
  return {
    text: `În figura alăturată, punctele $A$, $B$, $C$, $E$, $F$ sunt coliniare, în această ordine, $AB \\equiv BC$, $CE \\equiv EF$ și $AF = ${cm(AF)}$, iar segmentul $EC$ este cu $${cm(d)}$ mai lung decât $BC$. a) Aflați lungimile segmentelor $AB$ și $CE$. b) Ce reprezintă punctele $B$ și $E$ pentru segmentele $AC$, respectiv $CF$?`,
    solution: lines(
      `Notăm $AB = BC = x$. Atunci $CE = EF = x + ${d}$ și`,
      show(`AF = x + x + (x + ${d}) + (x + ${d}) = 4 \\cdot x + ${2 * d} = ${AF}`),
      show(`4 \\cdot x = ${AF - 2 * d} \\Rightarrow x = ${AF - 2 * d} : 4 = ${x}`),
      `a) $AB = ${cm(x)}$, $CE = ${x} + ${d} = ${cm(x + d)}$.`,
      `b) $B$ este între $A$ și $C$ și $AB = BC$, deci $B$ este mijlocul segmentului $AC$; la fel, $E$ este mijlocul segmentului $CF$.`,
    ),
    verify: () => 4 * x + 2 * d === AF,
    fig,
  }
}

/** A, C, B, F, E in order; AE, AF, CF, AC ≡ CB: EF, BF, AC, and B is the midpoint of AE, p. 84, ex. 21–22. */
export function d3SegMidpointProof(rng: Rng): Made {
  const a = int(rng, 2, 9)
  const bf = int(rng, 1, 2 * a - 1)
  const e = 2 * a - bf
  const AE = 4 * a, AF = 2 * a + bf, CF = a + bf
  const P = ['A', 'C', 'B', 'F', 'E']
  const fig = pointsOnLine(P, [0, a, 2 * a, 2 * a + bf, AE], { segment: true })
  return {
    text: `În figura alăturată, punctele $A$, $C$, $B$, $F$, $E$ sunt coliniare, în această ordine, $AE = ${cm(AE)}$, $AF = ${cm(AF)}$, $CF = ${cm(CF)}$ și $AC \\equiv CB$. Aflați lungimile segmentelor $EF$, $BF$ și $AC$ și arătați că punctul $B$ este mijlocul segmentului $AE$.`,
    solution: lines(
      show(`EF = AE - AF = ${AE} - ${AF} = ${cm(e)}`),
      show(`AC = AF - CF = ${AF} - ${CF} = ${cm(a)}, \\qquad CB = AC = ${cm(a)}`),
      show(`BF = CF - CB = ${CF} - ${a} = ${cm(bf)}`),
      show(`AB = AC + CB = ${cm(2 * a)}, \\qquad BE = BF + FE = ${bf} + ${e} = ${cm(2 * a)}`),
      `$B$ este între $A$ și $E$ și $AB = BE$, deci $B$ este mijlocul segmentului $AE$.`,
    ),
    verify: () => AF - CF === a && AE - AF === e && 2 * a === bf + e,
    fig,
  }
}

// ======================= angles in a figure (pp. 88, 113) → v-angle-calc =======================

/** Two lines AB and CD meeting at O, ∢AOC known: the other angles, p. 113, ex. 4. */
export function d3VerticalAngles(rng: Rng): Made {
  let al = int(rng, 20, 160)
  if (al === 90) al = 70
  const fig0 = rays('O', [{ name: 'A', deg: 180 }, { name: 'B', deg: 0 }, { name: 'C', deg: 180 - al }, { name: 'D', deg: 360 - al }], { w: 280 })
  const fig = writeAngles({ ...fig0, ang: ['AOC'] }, 'O', [{ a: 180, b: 180 - al, s: `${al}°` }], al < 50 ? 66 : 34)
  const sup = 180 - al
  return {
    text: `În figura alăturată, dreptele $AB$ și $CD$ sunt concurente în punctul $O$, iar $${A('AOC')} = ${al}^\\circ$. Aflați măsurile unghiurilor $AOD$, $BOD$ și $BOC$.`,
    solution: lines(
      `Punctele $C$, $O$, $D$ sunt coliniare, deci $${A('AOC')} + ${A('AOD')} = 180^\\circ$:`,
      show(`${A('AOD')} = 180^\\circ - ${al}^\\circ = ${sup}^\\circ`),
      `Unghiurile $BOD$ și $AOC$ sunt opuse la vârf, deci congruente; la fel $BOC$ și $AOD$:`,
      show(`${A('BOD')} = ${al}^\\circ, \\qquad ${A('BOC')} = ${sup}^\\circ`),
    ),
    verify: () => al + sup === 180 && al !== 90,
    fig,
  }
}

const RATIO_K = [1, 2, 4, 5, 8, 9, 14, 17]

/** ∢AOB = 90°, OC inside, ∢AOC = k·∢BOC (or d° more): both angles, p. 113, ex. 5. */
export function d3RightSplit(rng: Rng): Made {
  const ratio = rng() < 0.6
  let x: number, big: number, cond: string, steps: string[]
  if (ratio) {
    const k = pick(rng, RATIO_K.filter((t) => t > 1))
    x = 90 / (k + 1)
    big = k * x
    cond = `$${A('AOC')} = ${k} \\cdot ${A('BOC')}$`
    steps = [
      `Notăm $${A('BOC')} = x$; atunci $${A('AOC')} = ${k} \\cdot x$ și, cum $(OC$ este în interiorul unghiului drept:`,
      show(`${k} \\cdot x + x = 90^\\circ \\Rightarrow ${k + 1} \\cdot x = 90^\\circ \\Rightarrow x = ${x}^\\circ`),
    ]
  } else {
    const d = 2 * int(rng, 2, 40)
    x = (90 - d) / 2
    big = x + d
    cond = `$${A('AOC')}$ este cu $${d}^\\circ$ mai mare decât $${A('BOC')}$`
    steps = [
      `Notăm $${A('BOC')} = x$; atunci $${A('AOC')} = x + ${d}^\\circ$ și:`,
      show(`x + ${d}^\\circ + x = 90^\\circ \\Rightarrow 2 \\cdot x = ${90 - d}^\\circ \\Rightarrow x = ${x}^\\circ`),
    ]
  }
  const fig0 = rays('O', [{ name: 'A', deg: 90 }, { name: 'C', deg: x }, { name: 'B', deg: 0 }], { w: 240 })
  const fig = { ...fig0, ra: ['AOB'] }
  return {
    text: `În figura alăturată, $${A('AOB')} = 90^\\circ$, semidreapta $(OC$ este în interiorul lui, iar ${cond}. Aflați măsurile unghiurilor $BOC$ și $AOC$.`,
    solution: lines(...steps, show(`${A('BOC')} = ${x}^\\circ, \\qquad ${A('AOC')} = ${big}^\\circ`)),
    verify: () => same(x + big, 90) && Number.isInteger(x),
    fig,
  }
}

/** A, O, B collinear, three consecutive angles written, the fourth marked x, p. 88, ex. 15. */
export function d3CollinearMissing(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 20, 60), b = int(rng, 20, 60), c = int(rng, 20, 60)
    const x = 180 - a - b - c
    if (x < 20) continue
    const N = pick(rng, [['A', 'C', 'D', 'E', 'B'], ['M', 'P', 'Q', 'R', 'N'], ['E', 'F', 'G', 'H', 'K']])
    const parts = [a, b, x, c]
    const dirs = [180]
    parts.forEach((p, i) => dirs.push(dirs[i] - p))
    let fig = rays('O', N.map((name, i) => ({ name, deg: dirs[i] })), { w: 300 })
    fig = writeAngles(fig, 'O', parts.map((p, i) => ({ a: dirs[i], b: dirs[i + 1], s: i === 2 ? 'x' : `${p}°` })))
    const [P0, P1, P2, P3, P4] = N
    return {
      text: `În figura alăturată, punctele $${P0}$, $O$, $${P4}$ sunt coliniare, $${A(`${P0}O${P1}`)} = ${a}^\\circ$, $${A(`${P1}O${P2}`)} = ${b}^\\circ$ și $${A(`${P3}O${P4}`)} = ${c}^\\circ$. Aflați măsura $x$ a unghiului $${P2}O${P3}$.`,
      solution: lines(
        `Unghiul $${P0}O${P4}$ este alungit, deci suma celor patru unghiuri consecutive este $180^\\circ$:`,
        show(`x = 180^\\circ - ${a}^\\circ - ${b}^\\circ - ${c}^\\circ = ${x}^\\circ`),
      ),
      verify: () => a + b + x + c === 180,
      fig,
    }
  }
}

/** Rays OA, OB, OC, OD in order; ∢AOB, ∢BOC = ∢AOB + d, ∢COD half of ∢AOC: all the angles, p. 113, ex. 2. */
export function d3FourRays(rng: Rng): Made {
  const a = int(rng, 18, 40), d = 2 * int(rng, 1, 10)
  const BOC = a + d, AOC = 2 * a + d, COD = AOC / 2, BOD = BOC + COD, AOD = AOC + COD
  const N = pick(rng, [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H']])
  const dirs = [90 + AOD / 2]
  dirs.push(dirs[0] - a, dirs[0] - AOC, dirs[0] - AOD)
  let fig = rays('O', N.map((name, i) => ({ name, deg: dirs[i] })), { w: 280 })
  fig = writeAngles(fig, 'O', [{ a: dirs[0], b: dirs[1], s: `${a}°` }])
  const [P, Q, R, S] = N
  const an = (x: string, y: string) => A(`${x}O${y}`)
  return {
    text: `În figura alăturată, semidreptele $(O${R}$ și $(O${Q}$ sunt în interiorul unghiului $${P}O${S}$, astfel încât $(O${Q}$ este în interiorul unghiului $${P}O${R}$. Se știe că $${an(P, Q)} = ${a}^\\circ$, $${an(Q, R)}$ este cu $${d}^\\circ$ mai mare decât $${an(P, Q)}$, iar $${an(R, S)}$ este jumătate din $${an(P, R)}$. Aflați măsurile unghiurilor $${Q}O${R}$, $${P}O${R}$, $${R}O${S}$, $${Q}O${S}$ și $${P}O${S}$.`,
    solution: lines(
      show(`${an(Q, R)} = ${a}^\\circ + ${d}^\\circ = ${BOC}^\\circ, \\qquad ${an(P, R)} = ${a}^\\circ + ${BOC}^\\circ = ${AOC}^\\circ`),
      show(`${an(R, S)} = ${AOC}^\\circ : 2 = ${COD}^\\circ`),
      show(`${an(Q, S)} = ${BOC}^\\circ + ${COD}^\\circ = ${BOD}^\\circ, \\qquad ${an(P, S)} = ${AOC}^\\circ + ${COD}^\\circ = ${AOD}^\\circ`),
    ),
    verify: () => AOD === a + BOC + COD && AOD < 180 && BOD === AOD - a,
    fig,
  }
}

/** A, O, B collinear, rays OD, OC above; ∢AOD = k·∢DOC and ∢COB = m·∢DOC: the angles, p. 88, ex. 13. */
export function d3CollinearRatio(rng: Rng): Made {
  const opts: [number, number][] = []
  for (const s of [4, 5, 6, 9, 10, 12]) for (const m of [1, 2]) if (s - 1 - m >= 2) opts.push([s - 1 - m, m])
  const [k, m] = pick(rng, opts)
  const x = 180 / (k + 1 + m)
  const AOD = k * x, COB = m * x
  const fig = rays('O', [{ name: 'A', deg: 180 }, { name: 'D', deg: 180 - AOD }, { name: 'C', deg: COB }, { name: 'B', deg: 0 }], { w: 280 })
  const cond = m === 1 ? `$${A('DOC')} \\equiv ${A('COB')}$` : `$${A('COB')} = 2 \\cdot ${A('DOC')}$`
  return {
    text: `În figura alăturată, punctele $A$, $O$, $B$ sunt coliniare, $${A('AOD')} = ${k} \\cdot ${A('DOC')}$ și ${cond}. Aflați măsurile unghiurilor $AOD$, $DOC$ și $COB$.`,
    solution: lines(
      `Notăm $${A('DOC')} = x$. Atunci $${A('AOD')} = ${k} \\cdot x$ și $${A('COB')} = ${m === 1 ? 'x' : '2 \\cdot x'}$. Unghiul $AOB$ este alungit:`,
      show(`${k} \\cdot x + x + ${m === 1 ? 'x' : '2 \\cdot x'} = 180^\\circ \\Rightarrow ${k + 1 + m} \\cdot x = 180^\\circ \\Rightarrow x = ${x}^\\circ`),
      show(`${A('AOD')} = ${AOD}^\\circ, \\qquad ${A('DOC')} = ${x}^\\circ, \\qquad ${A('COB')} = ${COB}^\\circ`),
    ),
    verify: () => AOD + x + COB === 180 && Number.isInteger(x),
    fig,
  }
}

// ======================= kinds of angles, interior rays (pp. 86–87) → v-angle-measure =======================

/** ∢AOB and ∢BOC written on the figure: the kind of AOB, BOC, AOC, p. 87, ex. 6. */
export function d3ClassifyDrawn(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [90, int(rng, 20, 130), int(rng, 20, 130)])
    const b = pick(rng, [90 - (a % 90 === 0 ? 30 : 0), int(rng, 20, 120), int(rng, 20, 120)])
    if (a + b > 175 || b < 20) continue
    const N = letters(rng, 3)
    const dirs = [90 + (a + b) / 2, 90 + (a + b) / 2 - a, 90 - (a + b) / 2]
    let fig = rays('O', N.map((name, i) => ({ name, deg: dirs[i] })), { w: 280 })
    const ra = [...(a === 90 ? [`${N[0]}O${N[1]}`] : []), ...(b === 90 ? [`${N[1]}O${N[2]}`] : []), ...(a + b === 90 ? [`${N[0]}O${N[2]}`] : [])]
    fig = writeAngles({ ...fig, ra }, 'O', [{ a: dirs[0], b: dirs[1], s: `${a}°` }, { a: dirs[1], b: dirs[2], s: `${b}°` }])
    const [P, Q, R] = N
    return {
      text: `În figura alăturată, $${A(`${P}O${Q}`)} = ${a}^\\circ$, $${A(`${Q}O${R}`)} = ${b}^\\circ$, iar $(O${Q}$ este în interiorul unghiului $${P}O${R}$. Precizați felul fiecăruia dintre unghiurile $${P}O${Q}$, $${Q}O${R}$ și $${P}O${R}$ (ascuțit, drept sau obtuz).`,
      solution: lines(
        show(`${A(`${P}O${R}`)} = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`),
        `Un unghi este ascuțit dacă are sub $90^\\circ$, drept dacă are $90^\\circ$, obtuz dacă are între $90^\\circ$ și $180^\\circ$:`,
        `$${P}O${Q}$ este ${kindOf(a)}, $${Q}O${R}$ este ${kindOf(b)}, iar $${P}O${R}$ este ${kindOf(a + b)}.`,
      ),
      verify: () => a + b < 180 && dirs[2] > 0,
      fig,
    }
  }
}

/** Rays from O in a half-plane: the rays interior and exterior to one of the angles, p. 86, ex. 5. */
export function d3InteriorRays(rng: Rng): Made {
  const n = int(rng, 5, 6)
  const N = letters(rng, n)
  const dirs: number[] = [int(rng, 160, 172)]
  for (let i = 1; i < n; i++) dirs.push(dirs[i - 1] - int(rng, 24, Math.floor((dirs[0] - 10) / (n - 1))))
  const fig = rays('O', N.map((name, i) => ({ name, deg: dirs[i] })), { w: 300 })
  const i = int(rng, 0, n - 3)
  const j = int(rng, i + 2, n - 1)
  const inner = N.slice(i + 1, j)
  const outer = [...N.slice(0, i), ...N.slice(j + 1)]
  const X = N[i], Y = N[j]
  return {
    text: `În figura alăturată, semidreptele ${math(N.map((p) => `(O${p}`))} au originea comună $O$ și sunt în același semiplan. Numiți semidreptele din figură interioare unghiului $${X}O${Y}$ și pe cele exterioare lui (în afară de laturi). Câte sunt din fiecare?`,
    solution: lines(
      `Interioare unghiului $${X}O${Y}$ sunt semidreptele dintre laturile $(O${X}$ și $(O${Y}$: ${math(inner.map((p) => `(O${p}`))}, adică ${inner.length}.`,
      outer.length
        ? `Exterioare sunt celelalte: ${math(outer.map((p) => `(O${p}`))}, adică ${outer.length}.`
        : `Nu există semidrepte exterioare: toate celelalte sunt în interiorul unghiului.`,
    ),
    verify: () => inner.length + outer.length + 2 === n && inner.every((p) => { const k = N.indexOf(p); return dirs[k] < dirs[i] && dirs[k] > dirs[j] }),
    fig,
  }
}

// ======================= axes of symmetry (pp. 89–90) → v-symmetry-axis =======================

/** How many axes of symmetry a polygon has: lines through the centre of its vertices and a vertex or the middle of a side that map the vertices onto themselves. */
export function axesCount(pts: Pt[]): number {
  const g: Pt = [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length]
  const cands: Pt[] = [...pts, ...pts.map((q, i) => { const r = pts[(i + 1) % pts.length]; return [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2] as Pt })]
  const angles: number[] = []
  for (const c of cands) {
    const dx = c[0] - g[0], dy = c[1] - g[1]
    const len = Math.hypot(dx, dy)
    if (len < 1e-9) continue
    const u: Pt = [dx / len, dy / len]
    const ok = pts.every((q) => {
      const v: Pt = [q[0] - g[0], q[1] - g[1]]
      const d = v[0] * u[0] + v[1] * u[1]
      const r: Pt = [g[0] + 2 * d * u[0] - v[0], g[1] + 2 * d * u[1] - v[1]]
      return pts.some((p) => Math.hypot(p[0] - r[0], p[1] - r[1]) < 1e-6)
    })
    if (!ok) continue
    const t = ((Math.atan2(u[1], u[0]) * 180) / Math.PI + 360) % 180
    if (!angles.some((a) => Math.abs(a - t) < 1e-6 || Math.abs(Math.abs(a - t) - 180) < 1e-6)) angles.push(t)
  }
  return angles.length
}

interface Shape { name: string; pts: Pt[]; axes: number; how: string; labels?: string[] }
const s3 = Math.sqrt(3) / 2

/** A polygon of the usual kinds, with its sides from the rng, in centimetres. */
function someShape(rng: Rng, kind: string): Shape {
  switch (kind) {
    case 'square': {
      const a = int(rng, 2, 6)
      return { name: `un pătrat cu latura de ${a} cm`, pts: [[0, 0], [a, 0], [a, a], [0, a]], axes: 4, how: 'cele două diagonale și cele două drepte care unesc mijloacele laturilor opuse', labels: [`${a}`, '', '', ''] }
    }
    case 'rect': {
      const L = int(rng, 4, 8), l = int(rng, 2, L - 1)
      return { name: `un dreptunghi cu lungimea de ${L} cm și lățimea de ${l} cm`, pts: [[0, 0], [L, 0], [L, l], [0, l]], axes: 2, how: 'cele două drepte care unesc mijloacele laturilor opuse', labels: [`${L}`, `${l}`, '', ''] }
    }
    case 'rhombus': {
      const a = int(rng, 2, 6)
      return { name: `un romb cu latura de ${a} cm, care nu este pătrat`, pts: [[0, 0], [a, 0], [1.5 * a, s3 * a], [0.5 * a, s3 * a]], axes: 2, how: 'cele două diagonale', labels: [`${a}`, '', '', ''] }
    }
    case 'equi': {
      const a = int(rng, 2, 6)
      return { name: `un triunghi echilateral cu latura de ${a} cm`, pts: [[0, 0], [a, 0], [a / 2, s3 * a]], axes: 3, how: 'cele trei mediane (fiecare unește un vârf cu mijlocul laturii opuse)', labels: [`${a}`, '', ''] }
    }
    case 'iso': {
      for (;;) {
        const b = int(rng, 2, 6), l = int(rng, 3, 7)
        if (l === b || 2 * l <= b + 1) continue
        return { name: `un triunghi isoscel cu baza de ${b} cm și laturile egale de ${l} cm`, pts: [[0, 0], [b, 0], [b / 2, Math.sqrt(l * l - (b * b) / 4)]], axes: 1, how: 'dreapta care unește vârful cu mijlocul bazei', labels: [`${b}`, `${l}`, `${l}`] }
      }
    }
    case 'trap': {
      for (;;) {
        const B = int(rng, 5, 9), b = int(rng, 2, B - 2), c = int(rng, 2, 6)
        const off = (B - b) / 2
        if (c <= off + 0.8) continue
        const h = Math.sqrt(c * c - off * off)
        return { name: `un trapez isoscel cu bazele de ${B} cm și ${b} cm și laturile neparalele de ${c} cm`, pts: [[0, 0], [B, 0], [B - off, h], [off, h]], axes: 1, how: 'dreapta care unește mijloacele bazelor', labels: [`${B}`, `${c}`, `${b}`, `${c}`] }
      }
    }
    case 'para': {
      const a = int(rng, 4, 8), b = int(rng, 2, a - 1)
      return { name: `un paralelogram cu laturile de ${a} cm și ${b} cm, cu un unghi de $60^\\circ$`, pts: [[0, 0], [a, 0], [a + b / 2, s3 * b], [b / 2, s3 * b]], axes: 0, how: '', labels: [`${a}`, `${b}`, '', ''] }
    }
    case 'hexa': {
      const a = int(rng, 2, 5)
      return { name: `un hexagon regulat cu latura de ${a} cm`, pts: [0, 1, 2, 3, 4, 5].map((k) => [a * Math.cos((k * Math.PI) / 3), a * Math.sin((k * Math.PI) / 3)] as Pt), axes: 6, how: 'cele trei diagonale mari și cele trei drepte care unesc mijloacele laturilor opuse', labels: [`${a}`, '', '', '', '', ''] }
    }
    default: {
      // a scalene triangle
      for (;;) {
        const a = int(rng, 4, 8), b = int(rng, 3, 7), c = int(rng, 3, 7)
        if (a === b || b === c || a === c || a >= b + c || b >= a + c || c >= a + b) continue
        const x = (a * a + b * b - c * c) / (2 * a)
        return { name: `un triunghi cu laturile de ${a} cm, ${b} cm și ${c} cm`, pts: [[0, 0], [a, 0], [x, Math.sqrt(b * b - x * x)]], axes: 0, how: '', labels: [`${a}`, `${c}`, `${b}`] }
      }
    }
  }
}

/** Polygons side by side, each fitted in a box, the side lengths written outside, a tag "a)" above each. */
function shapesRow(shapes: { pts: Pt[]; labels?: string[]; tag?: string }[], box = 130, H = 104, common = false): Fig {
  const gap = 24, top = 22, pad = 16
  const path: NonNullable<Fig['path']> = []
  const t: NonNullable<Fig['t']> = []
  // one scale for all, so that the written lengths compare as drawn
  const kAll = Math.min(...shapes.map((sh) => { const xs = sh.pts.map((q) => q[0]), ys = sh.pts.map((q) => q[1]); return Math.min((box - 2 * pad) / (Math.max(...xs) - Math.min(...xs)), (H - 2 * pad) / (Math.max(...ys) - Math.min(...ys))) }))
  let x0 = 0
  for (const sh of shapes) {
    const xs = sh.pts.map((q) => q[0]), ys = sh.pts.map((q) => q[1])
    const minx = Math.min(...xs), maxy = Math.max(...ys)
    const wS = Math.max(...xs) - minx, hS = maxy - Math.min(...ys)
    const k = common ? kAll : Math.min((box - 2 * pad) / wS, (H - 2 * pad) / hS)
    const ox = x0 + (box - wS * k) / 2, oy = top + (H - hS * k) / 2
    const px = sh.pts.map((q) => [ox + (q[0] - minx) * k, oy + (maxy - q[1]) * k] as Pt)
    path.push({ d: px.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ') + ' Z' })
    const c: Pt = [px.reduce((s, q) => s + q[0], 0) / px.length, px.reduce((s, q) => s + q[1], 0) / px.length]
    sh.labels?.forEach((s, i) => {
      if (!s) return
      const a = px[i], b = px[(i + 1) % px.length]
      const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
      const len = Math.hypot(b[0] - a[0], b[1] - a[1])
      let n: Pt = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len]
      if (n[0] * (m[0] - c[0]) + n[1] * (m[1] - c[1]) < 0) n = [-n[0], -n[1]]
      t.push({ at: [Number((m[0] + n[0] * 11).toFixed(1)), Number((m[1] + n[1] * 11 + 4).toFixed(1))], s, size: 11 })
    })
    if (sh.tag) t.push({ at: [x0 + 8, 12], s: sh.tag, size: 12, anchor: 'start' })
    x0 += box + gap
  }
  return { w: x0 - gap, h: top + H, p: {}, path, t }
}

const KINDS_SHAPES = ['square', 'rect', 'rhombus', 'equi', 'iso', 'trap', 'para', 'hexa', 'scalene']

/** Three drawn figures: the axes of symmetry of each and in all, p. 89, ex. 1 and p. 90, ex. 6. */
export function d3AxesTotal(rng: Rng): Made {
  const kinds = shuffle(rng, KINDS_SHAPES).slice(0, 3)
  const sh = kinds.map((k) => someShape(rng, k))
  const tags = ['a)', 'b)', 'c)']
  const fig = shapesRow(sh.map((s, i) => ({ pts: s.pts, tag: tags[i] })), 130, 104, true)
  const total = sh.reduce((s, x) => s + x.axes, 0)
  return {
    text: `În figura alăturată sunt desenate: a) ${sh[0].name}; b) ${sh[1].name}; c) ${sh[2].name}. Câte axe de simetrie are fiecare figură? Câte axe de simetrie au în total?`,
    solution: lines(
      ...sh.map((s, i) => `${tags[i]} ${s.axes === 0 ? 'Nu are nicio axă de simetrie.' : `${s.axes === 1 ? 'O axă' : `${s.axes} axe`} de simetrie: ${s.how}.`}`),
      show(`${sh.map((s) => s.axes).join(' + ')} = ${total}\\text{ axe de simetrie}`),
    ),
    verify: () => sh.every((s) => axesCount(s.pts) === s.axes),
    fig,
  }
}

/** One drawn polygon with its vertices named: how many axes, and which, p. 90, ex. 6. */
export function d3AxesOne(rng: Rng): Made {
  const s = someShape(rng, pick(rng, KINDS_SHAPES))
  const N = letters(rng, s.pts.length)
  const xs = s.pts.map((q) => q[0]), ys = s.pts.map((q) => q[1])
  const aspect = (Math.max(...xs) - Math.min(...xs)) / (Math.max(...ys) - Math.min(...ys))
  const fig = plane(Object.fromEntries(N.map((n, i) => [n, s.pts[i]])), Math.round(Math.min(240, 190 * aspect + 20)), { s: [...N, N[0]].join('-') })
  const name = N.join('')
  return {
    text: `Figura $${name}$ din imagine este ${s.name}. Câte axe de simetrie are? Descrieți-le.`,
    solution: s.axes === 0
      ? lines(`Figura nu are nicio axă de simetrie: oricum am îndoi-o după o dreaptă, cele două părți nu se suprapun.`)
      : lines(
        `Figura are ${s.axes === 1 ? 'o axă' : `${s.axes} axe`} de simetrie: ${s.how}.`,
        `Îndoind figura după ${s.axes === 1 ? 'ea' : 'oricare dintre ele'}, cele două părți se suprapun.`,
      ),
    verify: () => axesCount(s.pts) === s.axes,
    fig,
  }
}

/** A grid of squares with a vertical axis d on a grid line, the named points at grid nodes (column, row from the top). */
function gridFig(cols: number, rows: number, axis: number, pts: Record<string, [number, number]>, chain?: string, cell = 24): Fig {
  const w = cols * cell, h = rows * cell
  const g: string[] = []
  for (let i = 0; i <= cols; i++) g.push(`M${i * cell} 0 L${i * cell} ${h}`)
  for (let j = 0; j <= rows; j++) g.push(`M0 ${j * cell} L${w} ${j * cell}`)
  return {
    w, h,
    p: Object.fromEntries(Object.entries(pts).map(([n, [i, j]]) => [n, [i * cell, j * cell] as Pt])),
    path: [{ d: g.join(' '), dashed: true }, { d: `M${axis * cell} -8 L${axis * cell} ${h + 8}` }],
    t: [{ at: [axis * cell + 5, -1], s: 'd', italic: true, size: 13, anchor: 'start' }],
    s: chain,
    dot: Object.keys(pts).join(' '),
  }
}

const CELLS = [1, 0.5, 2]

/** A triangle on a grid, the axis d: draw its symmetric and find the distance from a vertex to its image, p. 89, ex. 4. */
export function d3GridImage(rng: Rng): Made {
  for (;;) {
    const axis = 6
    const P: [number, number][] = [0, 1, 2].map(() => [int(rng, 1, 5), int(rng, 1, 6)])
    const area2 = Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[1][1] - P[0][1]) * (P[2][0] - P[0][0]))
    if (area2 < 4) continue
    const N = letters(rng, 3)
    const s = pick(rng, CELLS)
    const k = int(rng, 0, 2)
    const X = N[k]
    const dist = axis - P[k][0]
    const d = 2 * dist * s
    const fig = gridFig(12, 7, axis, Object.fromEntries(N.map((n, i) => [n, P[i]])), [...N, N[0]].join('-'))
    const img = N.map((n, i) => `$${n}'$ se află pe aceeași linie a rețelei ca $${n}$, la ${axis - P[i][0]} ${axis - P[i][0] === 1 ? 'pătrățel' : 'pătrățele'} la dreapta axei`)
    return {
      text: `În figura alăturată, rețeaua are pătrățele cu latura de $${cm(s)}$, iar dreapta $d$ trece pe o linie a rețelei. Desenați simetricul triunghiului $${N.join('')}$ față de dreapta $d$ și aflați lungimea segmentului $${X}${X}'$, unde $${X}'$ este simetricul punctului $${X}$.`,
      solution: lines(
        `Simetricul unui punct față de $d$ se află pe perpendiculara din acel punct pe $d$, la aceeași distanță de $d$, de cealaltă parte. Pe rețea: pe aceeași linie orizontală, la același număr de pătrățele de axă.`,
        `${img.join('; ')}. Triunghiul $${N.map((n) => `${n}'`).join('')}$ este simetricul căutat.`,
        `$${X}$ este la ${dist} ${dist === 1 ? 'pătrățel' : 'pătrățele'} de $d$, deci $${X}${X}'$ are $2 \\cdot ${dist} = ${2 * dist}$ laturi de pătrățel:`,
        show(`${X}${X}' = ${2 * dist} \\cdot ${T(s)} = ${cm(d)}`),
      ),
      verify: () => same(d, (axis + dist - P[k][0]) * s) && P.every((q) => q[0] < axis),
      fig,
    }
  }
}

/** A point on a grid and four points across the axis d: which is its symmetric, and their distance, p. 89, ex. 4–5. */
export function d3WhichSymmetric(rng: Rng): Made {
  const axis = 5
  const N = letters(rng, 5)
  const [Pn, ...cands] = N
  const px = int(rng, 1, 4), py = int(rng, 1, 5)
  const img: [number, number] = [2 * axis - px, py]
  const offs = shuffle(rng, [[1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [-1, -1], [1, 1]] as [number, number][])
  const wrong: [number, number][] = []
  for (const [dx, dy] of offs) {
    const q: [number, number] = [img[0] + dx, img[1] + dy]
    if (q[0] > axis && q[0] <= 10 && q[1] >= 1 && q[1] <= 6 && !wrong.some((w) => w[0] === q[0] && w[1] === q[1])) wrong.push(q)
    if (wrong.length === 3) break
  }
  const spots = shuffle(rng, [img, ...wrong])
  const right = cands[spots.indexOf(img)]
  const s = pick(rng, CELLS)
  const pts: Record<string, [number, number]> = { [Pn]: [px, py] }
  cands.forEach((c, i) => (pts[c] = spots[i]))
  const fig = gridFig(10, 7, axis, pts)
  const dist = axis - px
  return {
    text: `În figura alăturată, rețeaua are pătrățele cu latura de $${cm(s)}$. Care dintre punctele ${math(cands)} este simetricul punctului $${Pn}$ față de dreapta $d$? Aflați distanța dintre $${Pn}$ și simetricul lui.`,
    solution: lines(
      `Simetricul lui $${Pn}$ față de $d$ este pe aceeași linie orizontală a rețelei, la aceeași distanță de $d$, de cealaltă parte. $${Pn}$ este la ${dist} ${dist === 1 ? 'pătrățel' : 'pătrățele'} la stânga lui $d$, deci simetricul este la ${dist} ${dist === 1 ? 'pătrățel' : 'pătrățele'} la dreapta, pe aceeași linie: punctul $${right}$.`,
      show(`${Pn}${right} = 2 \\cdot ${dist} \\cdot ${T(s)} = ${cm(2 * dist * s)}`),
    ),
    verify: () => wrong.length === 3 && pts[right][0] - axis === axis - px && pts[right][1] === py && cands.filter((c) => pts[c][0] - axis === axis - px && pts[c][1] === py).length === 1,
    fig,
  }
}

// ======================= perimeters on a figure (pp. 91–92) → v-length-perimeter =======================

/** Two polygons with their sides written on the figure: the perimeters, p. 91, ex. 10 a. */
export function d3PolygonsPerimeter(rng: Rng): Made {
  const kinds = shuffle(rng, ['square', 'rect', 'rhombus', 'iso', 'trap', 'para', 'scalene', 'equi']).slice(0, 2)
  const sh = kinds.map((k) => someShape(rng, k))
  const sides = sh.map((s) => s.pts.map((q, i) => { const r = s.pts[(i + 1) % s.pts.length]; return Math.round(Math.hypot(r[0] - q[0], r[1] - q[1]) * 1000) / 1000 }))
  const P = sides.map((ss) => ss.reduce((a, b) => a + b, 0))
  const tags = ['a)', 'b)']
  const fig = shapesRow(sh.map((s, i) => ({ pts: s.pts, labels: s.labels, tag: tags[i] })), 150, 104, true)
  const how = (ss: number[]) => {
    const terms = ss.map((x) => T(x))
    const allEq = ss.every((x) => same(x, ss[0]))
    return allEq ? `${ss.length} \\cdot ${T(ss[0])}` : terms.join(' + ')
  }
  return {
    text: `În figura alăturată sunt desenate: a) ${sh[0].name}; b) ${sh[1].name}. Lungimile scrise pe figură sunt în centimetri. Aflați perimetrul fiecărei figuri.`,
    solution: lines(
      'Perimetrul unui poligon este suma lungimilor tuturor laturilor (laturile egale ale pătratului, rombului, dreptunghiului, paralelogramului se iau de câte ori apar):',
      ...tags.map((tag, i) => show(`\\text{${tag} } P = ${how(sides[i])} = ${cm(P[i])}`)),
    ),
    verify: () => sides.every((ss, i) => ss.every((x) => Number.isInteger(x)) && P[i] === ss.reduce((a, b) => a + b, 0)),
    fig,
  }
}

/** A table of rectangles with two of L, l, P known: the missing ones, p. 91, ex. 10 b. */
export function d3RectTable(rng: Rng): Made {
  const n = 4
  const unit = pick(rng, ['cm', 'dm', 'm'])
  const used = new Set<number>()
  const cols = Array.from({ length: n }, () => {
    let L = int(rng, 6, 300)
    while (used.has(L)) L = int(rng, 6, 300)
    used.add(L)
    const l = int(rng, 2, L - 1)
    return { L, l, P: 2 * (L + l) }
  })
  const hide = shuffle(rng, ['L', 'l', 'P', pick(rng, ['L', 'l', 'P'])] as ('L' | 'l' | 'P')[])
  const cell = (c: typeof cols[number], key: 'L' | 'l' | 'P', i: number) => (hide[i] === key ? '?' : String(c[key]))
  const fig = table([
    ['', '1', '2', '3', '4'],
    [`Lungimea (${unit})`, ...cols.map((c, i) => cell(c, 'L', i))],
    [`Lățimea (${unit})`, ...cols.map((c, i) => cell(c, 'l', i))],
    [`Perimetrul (${unit})`, ...cols.map((c, i) => cell(c, 'P', i))],
  ], { first: 130, cell: 54 })
  const given = cols.map((c, i) => {
    const known = (['L', 'l', 'P'] as const).filter((k) => k !== hide[i])
    return `${i + 1}) ${known.map((k) => `$${k} = ${c[k]}\\text{ ${unit}}$`).join(', ')}`
  })
  const sol = cols.map((c, i) => {
    const h = hide[i]
    if (h === 'P') return show(`\\text{${i + 1}) } P = 2 \\cdot (${c.L} + ${c.l}) = ${c.P}\\text{ ${unit}}`)
    if (h === 'L') return show(`\\text{${i + 1}) } L = ${c.P} : 2 - ${c.l} = ${c.P / 2} - ${c.l} = ${c.L}\\text{ ${unit}}`)
    return show(`\\text{${i + 1}) } l = ${c.P} : 2 - ${c.L} = ${c.P / 2} - ${c.L} = ${c.l}\\text{ ${unit}}`)
  })
  return {
    text: `Completați tabelul alăturat pentru patru dreptunghiuri, cu lungimea $L$, lățimea $l$ și perimetrul $P$: ${given.join('; ')}.`,
    solution: lines(
      'Perimetrul dreptunghiului este $P = 2 \\cdot (L + l)$, deci semiperimetrul $P : 2$ este suma $L + l$:',
      ...sol,
    ),
    verify: () => cols.every((c) => c.P === 2 * (c.L + c.l) && c.L > c.l),
    fig,
  }
}

/** thin spaces between groups of three digits in a whole number: 13\,500 */
const thin = (s: string) => (/^\d+$/.test(s) ? s.replace(/\B(?=(\d{3})+$)/g, '\\,') : s)

const ROUTE_UNITS = [
  { u: 'km', f: (k10: number) => T(k10 / 10), k: 1 },
  { u: 'hm', f: (k10: number) => String(k10), k: 10 },
  { u: 'dam', f: (k10: number) => String(k10 * 10), k: 100 },
  { u: 'm', f: (k10: number) => String(k10 * 100), k: 1000 },
  { u: 'dm', f: (k10: number) => String(k10 * 1000), k: 10000 },
]

/** A car's route drawn as a broken line, the stages in different units: the whole route in km, p. 92, ex. 22. */
export function d3Route(rng: Rng): Made {
  const n = int(rng, 4, 5)
  const N = letters(rng, n + 1)
  const k10 = Array.from({ length: n }, () => 10 * int(rng, 5, 18) + pick(rng, [0, 0, 5]))
  const us = Array.from({ length: n }, () => pick(rng, ROUTE_UNITS))
  const pts: Pt[] = [[0, 0]]
  const dirs: number[] = []
  for (let i = 0; i < n; i++) {
    const a = ((i % 2 === 0 ? 1 : -1) * int(rng, 35, 55) * Math.PI) / 180
    dirs.push(a)
    const L = k10[i] / 10
    pts.push([pts[i][0] + L * Math.cos(a), pts[i][1] + L * Math.sin(a)])
  }
  const xr = pts[n][0]
  const w = 400
  const sc = (w - 20) / xr
  const off = 14 / sc
  const t: NonNullable<Fig['t']> = []
  for (let i = 0; i < n; i++) {
    const [a, b] = [pts[i], pts[i + 1]]
    const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
    let nx = -Math.sin(dirs[i]), ny = Math.cos(dirs[i])
    if (ny < 0) { nx = -nx; ny = -ny }
    t.push({ at: [m[0] + nx * off, m[1] + ny * off], s: `${us[i].f(k10[i]).replace('{,}', ',')} ${us[i].u}`, size: 11, anchor: nx < 0 ? 'end' : 'start' })
  }
  const fig = plane(Object.fromEntries(N.map((nm, i) => [nm, pts[i]])), w, { s: N.join('-'), t, dot: N.join(' ') })
  const total = k10.reduce((s, x) => s + x, 0)
  const stage = (i: number) => `$${N[i]}${N[i + 1]} = ${thin(us[i].f(k10[i]))}\\text{ ${us[i].u}}$`
  return {
    text: `O mașină merge pe traseul $${N.join('')}$ din figura alăturată, cu etapele ${list(N.slice(0, n).map((_, i) => stage(i)))}. Calculați lungimea drumului parcurs, în kilometri.`,
    solution: lines(
      `Transformăm fiecare etapă în kilometri ($1\\text{ km} = 10\\text{ hm} = 100\\text{ dam} = 1\\,000\\text{ m} = 10\\,000\\text{ dm}$):`,
      ...k10.map((x, i) => us[i].u === 'km' ? '' : show(`${N[i]}${N[i + 1]} = ${thin(us[i].f(x))}\\text{ ${us[i].u}} = ${T(x / 10)}\\text{ km}`)),
      show(`${k10.map((x) => T(x / 10)).join(' + ')} = ${T(total / 10)}\\text{ km}`),
    ),
    verify: () => same(k10.reduce((s, x, i) => s + Number(us[i].f(x).replace('{,}', '.')) / us[i].k, 0), total / 10),
    fig,
  }
}

// ======================= school contests (p. 98, ex. 1) =======================

/** The 3 × 3 screen from the counts p, q, r, s of the four 2 × 2 squares chosen. */
const screen = (p: number, q: number, r: number, s: number) => [
  [p, p + q, q],
  [p + r, p + q + r + s, q + s],
  [r, r + s, s],
]
const GAME = 'Un joc pe calculator funcționează astfel: pe ecran se afișează un pătrat format din nouă căsuțe, cu câte un număr natural în fiecare căsuță. La primul pas, toate căsuțele conțin numărul $0$. La fiecare pas următor, calculatorul alege un pătrat format din patru căsuțe alăturate și mărește cu o unitate numerele din cele patru căsuțe.'
const COUNTS = 'Notăm cu $p$, $q$, $r$, $s$ de câte ori a fost ales pătratul de patru căsuțe din stânga sus, dreapta sus, stânga jos, respectiv dreapta jos. Fiecare colț aparține unui singur astfel de pătrat, fiecare căsuță din mijlocul unei laturi aparține la două, iar căsuța din centru la toate patru:'
const COUNTS_TEX = '\\begin{array}{|c|c|c|} \\hline p & p + q & q \\\\ \\hline p + r & p + q + r + s & q + s \\\\ \\hline r & r + s & s \\\\ \\hline \\end{array}'

function screenFig(cells: string[][]): Fig {
  return table(cells, { first: 60, cell: 60 })
}

/** The corners are shown: the other five numbers, p. 98, ex. 1. */
export function d3GridCorners(rng: Rng): Made {
  const [p, q, r, s] = [0, 1, 2, 3].map(() => int(rng, 100, 900))
  const g = screen(p, q, r, s)
  const fig = screenFig([[String(p), 'a', String(q)], ['b', 'c', 'd'], [String(r), 'e', String(s)]])
  return {
    text: `${GAME} După un număr de pași, pe ecran apare pătratul din figura alăturată, în care colțurile conțin numerele ${p}, ${q}, ${r} și ${s}. Determinați numerele $a$, $b$, $c$, $d$, $e$.`,
    solution: lines(
      COUNTS,
      show(COUNTS_TEX),
      `Din colțuri: $p = ${p}$, $q = ${q}$, $r = ${r}$, $s = ${s}$. Atunci`,
      show(`a = ${p} + ${q} = ${g[0][1]}, \\quad b = ${p} + ${r} = ${g[1][0]}, \\quad d = ${q} + ${s} = ${g[1][2]}, \\quad e = ${r} + ${s} = ${g[2][1]}`),
      show(`c = ${p} + ${q} + ${r} + ${s} = ${g[1][1]}`),
    ),
    verify: () => g[1][1] === g[0][1] + g[2][1] && g[1][1] === g[1][0] + g[1][2],
    fig,
  }
}

/** Two middles of sides, the centre and a corner are shown: the other numbers, p. 98, ex. 1 (the other way round). */
export function d3GridMiddles(rng: Rng): Made {
  const [p, q, r, s] = [0, 1, 2, 3].map(() => int(rng, 20, 500))
  const g = screen(p, q, r, s)
  const fig = screenFig([['a', String(g[0][1]), 'b'], [String(g[1][0]), String(g[1][1]), 'd'], ['c', 'e', String(s)]])
  return {
    text: `${GAME} După un număr de pași, pe ecran apare pătratul din figura alăturată: în mijlocul laturii de sus este ${g[0][1]}, în mijlocul laturii din stânga ${g[1][0]}, în centru ${g[1][1]}, iar în colțul din dreapta jos ${s}. Determinați numerele $a$, $b$, $c$, $d$, $e$.`,
    solution: lines(
      COUNTS,
      show(COUNTS_TEX),
      `Avem $p + q = ${g[0][1]}$, $p + r = ${g[1][0]}$, $s = ${s}$ și $p + q + r + s = ${g[1][1]}$. Adunând primele două egalități și pe a treia:`,
      show(`(p + q) + (p + r) + s = p + (p + q + r + s) \\Rightarrow ${g[0][1]} + ${g[1][0]} + ${s} = p + ${g[1][1]} \\Rightarrow p = ${p}`),
      show(`a = p = ${p}, \\quad b = q = ${g[0][1]} - ${p} = ${q}, \\quad c = r = ${g[1][0]} - ${p} = ${r}`),
      show(`d = q + s = ${q} + ${s} = ${g[1][2]}, \\quad e = r + s = ${r} + ${s} = ${g[2][1]}`),
    ),
    verify: () => g[0][1] + g[1][0] + s - g[1][1] === p && p > 0 && q > 0 && r > 0,
    fig,
  }
}

/** Three corners and the centre are shown: the fourth corner and the rest, p. 98, ex. 1 (the other way round). */
export function d3GridCentre(rng: Rng): Made {
  const [p, q, r, s] = [0, 1, 2, 3].map(() => int(rng, 30, 700))
  const g = screen(p, q, r, s)
  const fig = screenFig([[String(p), 'a', String(q)], ['b', String(g[1][1]), 'c'], [String(r), 'd', 'x']])
  return {
    text: `${GAME} După un număr de pași, pe ecran apare pătratul din figura alăturată, cu ${p}, ${q} și ${r} în trei dintre colțuri și ${g[1][1]} în centru. Aflați numărul $x$ din al patrulea colț și numerele $a$, $b$, $c$, $d$.`,
    solution: lines(
      COUNTS,
      show(COUNTS_TEX),
      `Centrul este suma colțurilor: $${p} + ${q} + ${r} + x = ${g[1][1]}$, deci`,
      show(`x = ${g[1][1]} - ${p + q + r} = ${s}`),
      show(`a = ${p} + ${q} = ${g[0][1]}, \\quad b = ${p} + ${r} = ${g[1][0]}, \\quad c = ${q} + ${s} = ${g[1][2]}, \\quad d = ${r} + ${s} = ${g[2][1]}`),
    ),
    verify: () => g[1][1] - p - q - r === s,
    fig,
  }
}

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d3-count', label: 'Numărarea figurilor', topic: 'Geometrie', joins: 'v-count-figures',
    forms: { 1: [d3CountOnLine, d3CountAngles], 2: [d3LinesThroughPoints, d3Cevians], 3: [d3CeviansParallel, d3AcuteCount] },
  },
  {
    id: 'v-d3-segments', label: 'Lungimea unui segment', topic: 'Geometrie', joins: 'v-segment-length',
    forms: { 1: [d3SegSum, d3SegFromWholes], 2: [d3SegCongruent, d3SegEqualPairs, d3SegMidpointProof], 3: [] },
  },
  {
    id: 'v-d3-angles', label: 'Calcule cu unghiuri pe figură', topic: 'Geometrie', joins: 'v-angle-calc',
    forms: { 1: [d3VerticalAngles, d3RightSplit, d3CollinearMissing], 2: [d3FourRays, d3CollinearRatio], 3: [] },
  },
  {
    id: 'v-d3-kinds', label: 'Felul unghiurilor, semidrepte interioare', topic: 'Geometrie', joins: 'v-angle-measure',
    forms: { 1: [d3ClassifyDrawn, d3InteriorRays], 2: [], 3: [] },
  },
  {
    id: 'v-d3-symmetry', label: 'Axa de simetrie pe figură', topic: 'Geometrie', joins: 'v-symmetry-axis',
    forms: { 1: [d3AxesTotal, d3AxesOne], 2: [d3GridImage, d3WhichSymmetric], 3: [] },
  },
  {
    id: 'v-d3-perimeter', label: 'Perimetre pe figură', topic: 'Geometrie', joins: 'v-length-perimeter',
    forms: { 1: [], 2: [d3PolygonsPerimeter, d3RectTable, d3Route], 3: [] },
  },
]

export const CONTEST: DrawnContest[] = [
  { id: 'v-contest-d3-screen', label: 'Pătratul de nouă căsuțe (concurs)', forms: [d3GridCorners, d3GridMiddles, d3GridCentre] },
]
