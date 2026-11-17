// Grade V exercises WITH DRAWINGS from Mate 2000+ Consolidare, part II (Paralela 45), pp. 152–220 (the 60 photos in
// `clasa5\sem2 2.0`, 14 November 2026), which grade5part2d/e/f.ts left out because they need a figure: the courtyard
// and the quadrilateral with a diagonal of the length tests (pp. 154–156), the pool with its fence (p. 153), the shapes
// made of unit squares (p. 164, ex. 28), the garden crossed by two alleys (p. 163, ex. 23), the squares a and b of
// (a + b)² (p. 164, ex. 35–36), the L-shaped field and the three squares (p. 170), the table of the cuboids (p. 177,
// ex. 12), the table of grades and the chart of visitors (Tema 6, pp. 208–209), the chart of cars (p. 220), the angles
// in a figure (p. 211, ex. 16; p. 217, Testul 3, V.2), the points and lines (p. 210, ex. 2; p. 211, ex. 18), the square
// garden split in fractions (p. 213, ex. 25). The number line and the shaded parts are made from the lengths and
// fractions of these chapters (a ruler, a tape in metres, a floor of tiles).
// Levels: Înțelegere * = 1, Aplicare ** = 2, Aprofundare *** and Supermate **** = 3; the tests by content.
// Every form draws its figure from the same numbers it computes with, and names its page and exercise.
import type { Made } from './generators'
import type { DrawnKind, DrawnContest } from './grade5drawn'
import { barChart, numberLine, pointsOnLine, rays, shadedGrid, table } from './figures5'
import { onCircle, plane, type Fig, type Pt } from '../models/figure'
import { de, frac, gcd, int, pick, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const r6 = (x: number) => Math.round(x * 1e6) / 1e6
/** a decimal in LaTeX, with the Romanian comma */
const dx = (x: number) => String(r6(x)).replace('.', '{,}')
/** a decimal on a figure */
const fx = (x: number) => String(r6(x)).replace('.', ',')
const same = (a: number, b: number) => Math.abs(a - b) < 1e-6
const A = (n: string) => `\\sphericalangle ${n}`
const deg = (x: number) => `${x}^\\circ`
const LETTERS = 'ABCDEFGHIJKLMNOPRSTUV'.split('')
/** "3, 5 și 8" */
const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : items[0])

/** the scale of plane(): units per pixel, so that texts can be placed a few pixels away in the figure's own units */
function unitPerPx(pts: Pt[], w: number) {
  const xs = pts.map((p) => p[0])
  return (Math.max(...xs) - Math.min(...xs)) / (w - 20)
}

// ================= 1. perimeters on a figure (pp. 153–156) → v-length-perimeter =================

/** A courtyard: the square DEFG on top of the rectangle ABCD, sizes in dam on the drawing. p. 156, Testul 3, V.1. */
function courtyard(rng: Rng): Made {
  const a = int(rng, 4, 12) / 2, c = int(rng, 4, 14) / 2, h = int(rng, 3, 9) / 2
  const who = pick(rng, ['Mihai', 'Andrei', 'Radu', 'Vlad', 'Tudor', 'Matei', 'Luca', 'Dan'])
  const W = 300
  const pts: Record<string, Pt> = { A: [0, 0], B: [a + c, 0], C: [a + c, h], D: [0, h], G: [a, h], E: [0, h + a], F: [a, h + a] }
  const u = unitPerPx(Object.values(pts), W)
  const fig = plane(pts, W, {
    s: 'A-B-C-D-A D-E-F-G',
    t: [
      { at: [a / 2, h - 16 * u], s: fx(a), size: 12 },
      { at: [a + c / 2, h + 6 * u], s: fx(c), size: 12 },
      { at: [5 * u, h / 2 - 4 * u], s: fx(h), size: 12, anchor: 'start' },
    ],
  })
  fig.l = { A: 'sw', B: 'se', C: 'ne', D: 'w', E: 'nw', F: 'ne', G: 'ne' }
  const pSq = 4 * a, pRect = 2 * (a + c + h), pYard = pRect + 2 * a
  return {
    text: lines(
      `În figura alăturată este desenată la scară curtea bunicii lui ${who}. $ABCD$ este un dreptunghi, iar $DEFG$ este un pătrat; dimensiunile din desen sunt exprimate în decametri. Aflați:`,
      `a) perimetrul pătratului $DEFG$; b) perimetrul dreptunghiului $ABCD$; c) perimetrul curții, în metri.`,
    ),
    solution: lines(
      `Din desen: $DG = ${dx(a)}\\text{ dam}$, $GC = ${dx(c)}\\text{ dam}$, $AD = ${dx(h)}\\text{ dam}$, deci $DC = ${dx(a)} + ${dx(c)} = ${dx(a + c)}\\text{ dam}$.`,
      `a) ${show(`\\mathcal{P}_{DEFG} = 4 \\cdot ${dx(a)} = ${dx(pSq)}\\text{ dam}`)}`,
      `b) ${show(`\\mathcal{P}_{ABCD} = 2 \\cdot (${dx(a + c)} + ${dx(h)}) = ${dx(pRect)}\\text{ dam}`)}`,
      `c) Conturul curții este format din $AB$, $BC$, $CG$, $GF$, $FE$, $ED$ și $DA$:`,
      show(`\\mathcal{P} = ${dx(a + c)} + ${dx(h)} + ${dx(c)} + ${dx(a)} + ${dx(a)} + ${dx(a)} + ${dx(h)} = ${dx(pYard)}\\text{ dam} = ${dx(pYard * 10)}\\text{ m}`),
    ),
    verify: () => same(pYard, (a + c) + h + c + 3 * a + h) && same(pRect + 2 * a, pYard),
    fig,
  }
}

/** ABCD with the diagonal BD; ABD and CDB have the same perimeter: BD (or the perimeter of ABD). p. 154, Testul 1, II.1. */
function quadDiagonal(rng: Rng): Made {
  const d = int(rng, 5, 16)
  const s = d + int(rng, 3, 14)
  const P = s + d, Q = 2 * s
  const askBD = rng() < 0.5
  const pts: Record<string, Pt> = { A: [0, 1.2], B: [5.6, 0], C: [7.4, 2.2], D: [4, 3.4] }
  const fig = plane(pts, 300, { s: 'A-B-C-D-A B-D' })
  fig.l = { A: 'w', B: 's', C: 'e', D: 'n' }
  return {
    text: askBD
      ? `Triunghiurile $ABD$ și $CDB$ din figura alăturată au același perimetru. Dacă perimetrul triunghiului $CDB$ este egal cu $${P}\\text{ cm}$ și perimetrul patrulaterului $ABCD$ este egal cu $${Q}\\text{ cm}$, aflați lungimea segmentului $BD$.`
      : `Triunghiurile $ABD$ și $CDB$ din figura alăturată au același perimetru. Diagonala $BD$ are $${d}\\text{ cm}$, iar perimetrul patrulaterului $ABCD$ este egal cu $${Q}\\text{ cm}$. Aflați perimetrul triunghiului $ABD$.`,
    solution: lines(
      `Adunăm perimetrele celor două triunghiuri: laturile patrulaterului apar o dată, iar $BD$ de două ori:`,
      show(`\\mathcal{P}_{ABD} + \\mathcal{P}_{CDB} = (AB + AD + BC + CD) + 2 \\cdot BD = \\mathcal{P}_{ABCD} + 2 \\cdot BD`),
      askBD
        ? show(`${P} + ${P} = ${Q} + 2 \\cdot BD \\Rightarrow 2 \\cdot BD = ${2 * P - Q} \\Rightarrow BD = ${d}\\text{ cm}`)
        : show(`2 \\cdot \\mathcal{P}_{ABD} = ${Q} + 2 \\cdot ${d} = ${Q + 2 * d} \\Rightarrow \\mathcal{P}_{ABD} = ${P}\\text{ cm}`),
    ),
    verify: () => 2 * P === Q + 2 * d && s > d,
    fig,
  }
}

/** A pool fenced at a distance d all round with panels of the longest whole length. p. 153, ex. 16 (Supermate). */
function poolFence(rng: Rng): Made {
  let L = 0, l = 0, dd = 0, side1 = 0, side2 = 0, g = 0
  for (;;) {
    L = int(rng, 10, 25); l = int(rng, 4, 9); dd = pick(rng, [50, 75, 100, 125, 150])
    side1 = L * 100 + 2 * dd; side2 = l * 100 + 2 * dd; g = gcd(side1, side2)
    if (g >= 50 && (2 * (side1 + side2)) / g <= 80) break
  }
  const per = 2 * (side1 + side2)
  const n = per / g
  const d = dd / 100
  const W = 360
  const pts: Record<string, Pt> = {
    M: [0, l + 2 * d], N: [L + 2 * d, l + 2 * d], P: [L + 2 * d, 0], Q: [0, 0],
    A: [d, l + d], C: [L + d, l + d], D: [L + d, d], B: [d, d],
  }
  const u = unitPerPx(Object.values(pts), W)
  const fig = plane(pts, W, {
    s: 'M-N-P-Q-M A-C-D-B-A',
    t: [
      { at: [(L + 2 * d) / 2, (l + 2 * d) / 2 - 4 * u], s: 'piscină', size: 12 },
    ],
  })
  fig.l = { M: 'nw', N: 'ne', P: 'se', Q: 'sw', A: 'se', C: 'sw', D: 'nw', B: 'ne' }
  return {
    text: lines(
      `O piscină $ACDB$, cu lungimea $AC = ${L}\\text{ m}$ și lățimea $AB = ${l}\\text{ m}$, trebuie împrejmuită ca în schema alăturată: gardul $MNPQ$ este paralel cu marginile piscinei, la distanța de $${dx(d)}\\text{ m}$ de ele. Pentru împrejmuire se folosesc panouri dreptunghiulare, toate cu aceeași lungime, care acoperă exact fiecare latură a gardului.`,
      `a) Calculați perimetrul dreptunghiului $MNPQ$. b) Lungimea unui panou, exprimată printr-un număr întreg de centimetri, trebuie să fie cea mai mare posibilă. Aflați lungimea panoului și numărul de panouri.`,
    ),
    solution: lines(
      `a) Fiecare latură a gardului este mai lungă cu $2 \\cdot ${dx(d)} = ${dx(2 * d)}\\text{ m}$ decât latura piscinei:`,
      show(`MN = ${L} + ${dx(2 * d)} = ${dx(side1 / 100)}\\text{ m}, \\quad NP = ${l} + ${dx(2 * d)} = ${dx(side2 / 100)}\\text{ m}`),
      show(`\\mathcal{P}_{MNPQ} = 2 \\cdot (${dx(side1 / 100)} + ${dx(side2 / 100)}) = ${dx(per / 100)}\\text{ m}`),
      `b) În centimetri, laturile au $${side1}\\text{ cm}$ și $${side2}\\text{ cm}$. Panoul trebuie să încapă de un număr exact de ori în fiecare latură, deci lungimea lui este cel mai mare divizor comun:`,
      show(`(${side1}, ${side2}) = ${g} \\Rightarrow l = ${g}\\text{ cm}`),
      show(`\\text{numarul de panouri} = ${per} : ${g} = ${n}`),
    ),
    verify: () => side1 % g === 0 && side2 % g === 0 && gcd(side1 / g, side2 / g) === 1 && n * g === per,
    fig,
  }
}

const UNITS: { name: string; k: number }[] = [
  { name: 'dm', k: 10 }, { name: 'm', k: 1 }, { name: 'dam', k: 0.1 }, { name: 'hm', k: 0.01 },
]
/** An L-shaped field: the outer rectangle W × H without its lower-left corner. The four sizes in mixed units. */
function lField(rng: Rng) {
  const W = 10 * int(rng, 12, 30), H = 10 * int(rng, 6, Math.min(15, W / 10 - 2))
  const h1 = 10 * int(rng, 2, H / 10 - 2), b = 10 * int(rng, 3, W / 10 - 4)
  const us = shuffle(rng, UNITS)
  const lab = (v: number, i: number) => ({ v, u: us[i], s: `${fx(v * us[i].k)} ${us[i].name}`, tex: `${dx(v * us[i].k)}\\text{ ${us[i].name}}` })
  const top = lab(W, 0), left = lab(h1, 1), right = lab(H, 2), bottom = lab(b, 3)
  const pts: Record<string, Pt> = { A: [0, H], B: [W, H], C: [W, 0], D: [W - b, 0], E: [W - b, H - h1], F: [0, H - h1] }
  const Wpx = 320
  const u = unitPerPx(Object.values(pts), Wpx)
  const fig = plane(pts, Wpx, {
    s: 'A-B-C-D-E-F-A',
    t: [
      { at: [W / 2, H + 5 * u], s: top.s, size: 12 },
      { at: [5 * u, H - h1 / 2 - 4 * u], s: left.s, size: 12, anchor: 'start' },
      { at: [W - 5 * u, H / 2 - 4 * u], s: right.s, size: 12, anchor: 'end' },
      { at: [W - b / 2, -16 * u], s: bottom.s, size: 12 },
    ],
  })
  fig.l = Object.fromEntries(Object.keys(pts).map((n) => [n, ''])) as Fig['l']
  return { W, H, h1, b, top, left, right, bottom, fig }
}
const conv = (x: { v: number; u: { name: string; k: number }; tex: string }) =>
  x.u.k === 1 ? `${x.v}\\text{ m}` : `${x.tex} = ${x.v}\\text{ m}`

/** The perimeter of the L-shaped field of p. 170, IV a (Testul 3), with the two sides that are not written. */
function lFieldPerimeter(rng: Rng): Made {
  const f = lField(rng)
  const per = 2 * (f.W + f.H)
  return {
    text: `Un teren agricol are forma și dimensiunile din figura alăturată ($${f.top.tex}$, $${f.left.tex}$, $${f.right.tex}$, $${f.bottom.tex}$; toate colțurile sunt unghiuri drepte). Aflați lungimile celor două laturi nescrise pe figură și perimetrul terenului, în metri.`,
    solution: lines(
      `Transformăm în metri: $${conv(f.top)}$, $${conv(f.left)}$, $${conv(f.right)}$, $${conv(f.bottom)}$.`,
      `Latura orizontală din interior: $${f.W} - ${f.b} = ${f.W - f.b}\\text{ m}$; latura verticală din interior: $${f.H} - ${f.h1} = ${f.H - f.h1}\\text{ m}$.`,
      show(`\\mathcal{P} = ${f.W} + ${f.H} + ${f.b} + ${f.H - f.h1} + ${f.W - f.b} + ${f.h1} = ${per}\\text{ m}`),
      `Observăm că perimetrul este egal cu cel al dreptunghiului de $${f.W}\\text{ m}$ pe $${f.H}\\text{ m}$.`,
    ),
    verify: () => per === f.W + f.H + f.b + (f.H - f.h1) + (f.W - f.b) + f.h1,
    fig: f.fig,
  }
}

// ================= 2. areas on a figure (pp. 163–170) → v-area-units =================

/** The area of the same L-shaped field, in m² and in ari. p. 170, IV b. */
function lFieldArea(rng: Rng): Made {
  const f = lField(rng)
  const big = f.W * f.H, cut = (f.W - f.b) * (f.H - f.h1), area = big - cut
  return {
    text: `Un teren agricol are forma și dimensiunile din figura alăturată ($${f.top.tex}$, $${f.left.tex}$, $${f.right.tex}$, $${f.bottom.tex}$; toate colțurile sunt unghiuri drepte). Calculați aria terenului, în metri pătrați și în ari.`,
    solution: lines(
      `Transformăm în metri: $${conv(f.top)}$, $${conv(f.left)}$, $${conv(f.right)}$, $${conv(f.bottom)}$.`,
      `Terenul este un dreptunghi de $${f.W}\\text{ m}$ pe $${f.H}\\text{ m}$ din care lipsește colțul de jos, un dreptunghi de $${f.W} - ${f.b} = ${f.W - f.b}\\text{ m}$ pe $${f.H} - ${f.h1} = ${f.H - f.h1}\\text{ m}$:`,
      show(`\\mathcal{A} = ${f.W} \\cdot ${f.H} - ${f.W - f.b} \\cdot ${f.H - f.h1} = ${big} - ${cut} = ${area}\\text{ m}^2 = ${dx(area / 100)}\\text{ ari}`),
    ),
    verify: () => area === f.W * f.h1 + f.b * (f.H - f.h1),
    fig: f.fig,
  }
}

/** A shape made of unit squares: [column, row] cells. */
function polyomino(rng: Rng): [number, number][] {
  const kind = int(rng, 0, 3)
  const cells: [number, number][] = []
  if (kind === 0) {
    // stairs: k rows of width w, each shifted by s
    const k = int(rng, 3, 5), w = int(rng, 2, 4), s = int(rng, 1, 2)
    for (let r = 0; r < k; r++) for (let c = 0; c < w; c++) cells.push([r * s + c, k - 1 - r])
  } else if (kind === 1) {
    // diamond: widths 1, 3, 5, …, m, …, 3, 1 (centred)
    const m = pick(rng, [3, 5, 7]), half = (m - 1) / 2
    const widths = [...Array.from({ length: half + 1 }, (_, i) => 2 * i + 1), ...Array.from({ length: half }, (_, i) => m - 2 - 2 * i)]
    widths.forEach((wd, r) => { for (let c = 0; c < wd; c++) cells.push([half - (wd - 1) / 2 + c, r]) })
  } else if (kind === 2) {
    // cross: a plus with arms of length a and thickness 1 or 2
    const a = int(rng, 1, 3), t = int(rng, 1, 2), n = 2 * a + t
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if ((r >= a && r < a + t) || (c >= a && c < a + t)) cells.push([c, r])
  } else {
    // a staircase triangle: rows of 1, 2, …, k (from the top, left-aligned), maybe with a base row longer
    const k = int(rng, 3, 6), extra = int(rng, 0, 2)
    for (let r = 0; r < k; r++) for (let c = 0; c < r + 1 + (r === k - 1 ? extra : 0); c++) cells.push([c, r])
  }
  return cells
}
function polyFig(cells: [number, number][], cell = 24): Fig {
  const cols = Math.max(...cells.map((c) => c[0])) + 1, rows = Math.max(...cells.map((c) => c[1])) + 1
  return { w: cols * cell, h: rows * cell, p: {}, path: [{ d: cells.map(([c, r]) => `M${c * cell} ${r * cell} h${cell} v${cell} h${-cell} Z`).join(' ') }] }
}
function polyPerimeter(cells: [number, number][]) {
  const has = new Set(cells.map(([c, r]) => `${c},${r}`))
  let p = 0
  for (const [c, r] of cells) for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!has.has(`${c + dc},${r + dr}`)) p++
  return p
}

/** The area of a shape drawn on squares, in unit squares. p. 164, ex. 28 (Fig. 5–7). */
function gridShapeArea(rng: Rng): Made {
  const cells = polyomino(rng)
  const n = cells.length
  const rows = Math.max(...cells.map((c) => c[1])) + 1
  const cols = Math.max(...cells.map((c) => c[0])) + 1
  const per = Array.from({ length: rows }, (_, r) => cells.filter((c) => c[1] === r).length)
  return {
    text: `Calculați aria figurii alăturate, luând ca unitate de măsură un pătrățel al figurii. Figura încape exact într-un dreptunghi cu $${rows}$ rânduri a câte $${cols}$ pătrățele: câte pătrățele ar mai trebui adăugate pentru a umple acest dreptunghi?`,
    solution: lines(
      `Numărăm pătrățelele pe rânduri, de sus în jos:`,
      show(`${per.join(' + ')} = ${n}`),
      `Aria figurii este de $${n}$ unități de arie (pătrățele).`,
      `Dreptunghiul are $${rows} \\cdot ${cols} = ${rows * cols}$ pătrățele, deci mai trebuie adăugate $${rows * cols} - ${n} = ${rows * cols - n}$ pătrățele.`,
    ),
    verify: () => per.reduce((s, x) => s + x, 0) === n && n <= rows * cols,
    fig: polyFig(cells),
  }
}

/** The same shapes with the side of a square in cm: the area and the perimeter. p. 164, ex. 28 (Aprofundare). */
function gridShapeReal(rng: Rng): Made {
  const cells = polyomino(rng)
  const n = cells.length, sides = polyPerimeter(cells)
  const c = pick(rng, [2, 3, 4, 5, 6, 0.5, 1.5, 2.5])
  return {
    text: `Figura alăturată este formată din pătrate cu latura de $${dx(c)}\\text{ cm}$. Calculați aria și perimetrul figurii.`,
    solution: lines(
      `Figura are $${n}$ pătrate, fiecare cu aria $${dx(c)} \\cdot ${dx(c)} = ${dx(c * c)}\\text{ cm}^2$:`,
      show(`\\mathcal{A} = ${n} \\cdot ${dx(c * c)} = ${dx(n * c * c)}\\text{ cm}^2`),
      `Pe conturul figurii numărăm $${sides}$ laturi de pătrat (o latură comună a două pătrate nu este pe contur):`,
      show(`\\mathcal{P} = ${sides} \\cdot ${dx(c)} = ${dx(sides * c)}\\text{ cm}`),
    ),
    verify: () => sides % 2 === 0 && sides <= 4 * n && sides >= 4,
    fig: polyFig(cells),
  }
}

/** n identical squares of a given area side by side: the rectangle's area and perimeter. p. 170, Testul 3, V. */
function squaresInRow(rng: Rng): Made {
  const n = int(rng, 2, 5), s = int(rng, 2, 12), a = s * s
  const cell = Math.min(60, Math.floor(380 / n))
  const pathD = [`M0 0 h${n * cell} v${cell} h${-n * cell} Z`, ...Array.from({ length: n - 1 }, (_, i) => `M${(i + 1) * cell} 0 v${cell}`)].join(' ')
  const words: Record<number, string> = { 2: 'Două', 3: 'Trei', 4: 'Patru', 5: 'Cinci' }
  return {
    text: `${words[n]} pătrate identice, fiecare cu aria de $${a}\\text{ m}^2$, sunt așezate unul lângă altul ca în figura alăturată, formând un dreptunghi. Calculați aria și perimetrul dreptunghiului.`,
    solution: lines(
      `Latura unui pătrat: $l \\cdot l = ${a} \\Rightarrow l = ${s}\\text{ m}$.`,
      `Dreptunghiul are lungimea $${n} \\cdot ${s} = ${n * s}\\text{ m}$ și lățimea $${s}\\text{ m}$.`,
      show(`\\mathcal{A} = ${n} \\cdot ${a} = ${n * a}\\text{ m}^2, \\quad \\mathcal{P} = 2 \\cdot (${n * s} + ${s}) = ${2 * (n * s + s)}\\text{ m}`),
    ),
    verify: () => n * s * s === n * a,
    fig: { w: n * cell, h: cell, p: {}, path: [{ d: pathD }] },
  }
}

/** A lawn crossed by two alleys: the area of the grass, in two ways. p. 163, ex. 23. */
function gardenAlleys(rng: Rng): Made {
  const L = 2 * int(rng, 10, 30), l = 2 * int(rng, 6, Math.min(20, L / 2 - 2)), acm = pick(rng, [80, 100, 120, 150, 200])
  const a = acm / 100
  const W = 320, k = W / L, H = l * k
  const ap = Math.max(6, a * k)
  const x1 = Math.round(W * pick(rng, [0.4, 0.5, 0.6]) - ap / 2), y1 = Math.round(H * pick(rng, [0.4, 0.5]) - ap / 2)
  const rect = (x: number, y: number, w: number, h: number) => `M${x.toFixed(1)} ${y.toFixed(1)} h${w.toFixed(1)} v${h.toFixed(1)} h${(-w).toFixed(1)} Z`
  const fig: Fig = {
    w: W, h: Math.round(H), p: {},
    path: [
      { d: [rect(0, 0, x1, y1), rect(x1 + ap, 0, W - x1 - ap, y1), rect(0, y1 + ap, x1, H - y1 - ap), rect(x1 + ap, y1 + ap, W - x1 - ap, H - y1 - ap)].join(' '), hatch: true },
      { d: rect(0, 0, W, H) },
    ],
  }
  const grass = (L - a) * (l - a)
  return {
    text: `În figura alăturată este reprezentată o grădină dreptunghiulară străbătută de două alei perpendiculare, paralele cu laturile ei. Grădina are lungimea de $${L}\\text{ m}$ și lățimea de $${l}\\text{ m}$, iar lățimea fiecărei alei este de $${acm}\\text{ cm}$. Restul grădinii (partea hașurată) este acoperit cu gazon. Calculați aria gazonului în două moduri.`,
    solution: lines(
      `Lățimea aleilor: $${acm}\\text{ cm} = ${dx(a)}\\text{ m}$.`,
      `**Modul 1.** Mutând în gând cele patru bucăți de gazon una lângă alta, obținem un dreptunghi cu laturile $${L} - ${dx(a)} = ${dx(L - a)}\\text{ m}$ și $${l} - ${dx(a)} = ${dx(l - a)}\\text{ m}$:`,
      show(`\\mathcal{A} = ${dx(L - a)} \\cdot ${dx(l - a)} = ${dx(grass)}\\text{ m}^2`),
      `**Modul 2.** Din aria grădinii scădem aria aleilor; pătratul în care se întâlnesc aleile a fost scăzut de două ori, deci îl adunăm o dată:`,
      show(`\\mathcal{A} = ${L} \\cdot ${l} - ${L} \\cdot ${dx(a)} - ${l} \\cdot ${dx(a)} + ${dx(a)} \\cdot ${dx(a)} = ${L * l} - ${dx(L * a)} - ${dx(l * a)} + ${dx(a * a)} = ${dx(grass)}\\text{ m}^2`),
    ),
    verify: () => same(grass, L * l - L * a - l * a + a * a),
    fig,
  }
}

/** The square AEHJ cut into the squares ABCD (side a), CFHI (side b) and two rectangles: (a + b)². p. 164, ex. 36. */
function squaresAB(rng: Rng): Made {
  const a = int(rng, 3, 8), b = int(rng, 2, 7)
  const n = a + b, cell = Math.min(26, Math.floor(300 / n)), S = n * cell
  const grid: string[] = []
  for (let i = 0; i <= n; i++) grid.push(`M${i * cell} 0 V${S} M0 ${i * cell} H${S}`)
  // E top-left, A top-right, J bottom-right, H bottom-left; C at (b, a) cells from the top-left
  const cx = b * cell, cy = a * cell
  const p: Record<string, Pt> = {
    E: [0, 0], A: [S, 0], J: [S, S], H: [0, S], D: [cx, 0], B: [S, cy], C: [cx, cy], F: [0, cy], I: [cx, S],
  }
  const fig: Fig = {
    w: S, h: S, p,
    l: { E: 'nw', A: 'ne', J: 'se', H: 'sw', D: 'n', B: 'e', C: 'nw', F: 'w', I: 's' },
    path: [{ d: grid.join(' '), dashed: true }],
    s: 'E-A-J-H-E D-C-I F-C-B',
  }
  const big = n * n
  return {
    text: lines(
      `În figura alăturată, desenată pe o rețea de pătrățele cu latura de $1\\text{ cm}$, $ABCD$ și $CFHI$ sunt pătrate, iar $CDEF$ și $BCIJ$ sunt dreptunghiuri. Pătratul $ABCD$ are latura de $${a}\\text{ cm}$, iar pătratul $CFHI$ are latura de $${b}\\text{ cm}$.`,
      `a) Calculați lungimea laturii pătratului $AEHJ$. b) Calculați aria pătratului $AEHJ$ în două moduri: direct și ca sumă a ariilor celor patru figuri.`,
    ),
    solution: lines(
      `a) $EA = ED + DA = ${b} + ${a} = ${n}\\text{ cm}$ (pentru că $ED = FC = ${b}\\text{ cm}$ și $DA = ${a}\\text{ cm}$).`,
      `b) Direct: ${show(`\\mathcal{A}_{AEHJ} = ${n} \\cdot ${n} = ${big}\\text{ cm}^2`)}`,
      `Ca sumă: dreptunghiurile $CDEF$ și $BCIJ$ au fiecare laturile de $${a}\\text{ cm}$ și $${b}\\text{ cm}$:`,
      show(`\\mathcal{A}_{AEHJ} = \\mathcal{A}_{ABCD} + \\mathcal{A}_{CDEF} + \\mathcal{A}_{BCIJ} + \\mathcal{A}_{CFHI} = ${a * a} + ${a * b} + ${a * b} + ${b * b} = ${big}\\text{ cm}^2`),
      `Am regăsit egalitatea $(a + b)^2 = a^2 + 2ab + b^2$.`,
    ),
    verify: () => big === a * a + 2 * a * b + b * b,
    fig,
  }
}

// ================= 3. the table of the cuboids (p. 177, ex. 12) → v-volume-units =================

const CU = ['cm', 'dm', 'm', 'mm']
/** Complete the table: L, l, h, V of cuboids, one value missing in every column. p. 177, ex. 12. */
function cuboidTable(rng: Rng): Made {
  const cols = 4
  const data = Array.from({ length: cols }, () => {
    const u = pick(rng, CU)
    const L = int(rng, 3, 12), l = int(rng, 2, 9), h = int(rng, 2, 10)
    return { u, v: [L, l, h, L * l * h], miss: int(rng, 0, 3) }
  })
  const row = (i: number, name: string) => [name, ...data.map((c) => (c.miss === i ? '?' : `${c.v[i]} ${c.u}${i === 3 ? '³' : ''}`))]
  const fig = table([row(0, 'L'), row(1, 'l'), row(2, 'h'), row(3, 'V')], { cell: 70, first: 40 })
  const steps = data.map((c, j) => {
    const [L, l, h, V] = c.v
    const unit = `\\text{ ${c.u}}`
    const t = c.miss === 3
      ? `\\mathcal{V} = ${L} \\cdot ${l} \\cdot ${h} = ${V}${unit}^3`
      : c.miss === 0 ? `L = ${V} : (${l} \\cdot ${h}) = ${L}${unit}`
        : c.miss === 1 ? `l = ${V} : (${L} \\cdot ${h}) = ${l}${unit}` : `h = ${V} : (${L} \\cdot ${l}) = ${h}${unit}`
    return `Coloana ${j + 1}: $${t}$.`
  })
  return {
    text: `În tabelul alăturat, $L$, $l$ și $h$ reprezintă lungimea, lățimea și înălțimea unui paralelipiped dreptunghic, iar $V$ este volumul acestuia. Completați căsuțele cu semnul întrebării (${data.map((c, j) => `coloana ${j + 1}: $${['L', 'l', 'h', 'V'][c.miss]}$`).join(', ')}).`,
    solution: lines(`Folosim $\\mathcal{V} = L \\cdot l \\cdot h$; o dimensiune lipsă este volumul împărțit la produsul celorlalte două.`, ...steps, `Valorile găsite: ${list(data.map((c) => `$${c.v[c.miss]}\\text{ ${c.u}}${c.miss === 3 ? '^3' : ''}$`))}.`),
    verify: () => data.every((c) => c.v[0] * c.v[1] * c.v[2] === c.v[3]),
    fig,
  }
}

/** Cubes: the edge, the sum of the edges, the area of a face, the volume; one value given in each column. After p. 177, ex. 8–9. */
function cubeTable(rng: Rng): Made {
  const edges = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 4)
  const data = edges.map((e) => ({ e, v: [e, 12 * e, e * e, e * e * e], give: int(rng, 0, 3) }))
  const row = (i: number, name: string) => [name, ...data.map((c) => (c.give === i ? `${c.v[i]}` : ''))]
  const fig = table([row(0, 'muchia (cm)'), row(1, 'suma muchiilor (cm)'), row(2, 'aria unei fețe (cm²)'), row(3, 'volumul (cm³)')], { cell: 56, first: 150 })
  const how = (c: { e: number; give: number; v: number[] }) => {
    const e = c.e
    if (c.give === 0) return `muchia $${e}\\text{ cm}$`
    if (c.give === 1) return `muchia $= ${12 * e} : 12 = ${e}\\text{ cm}$`
    if (c.give === 2) return `$l \\cdot l = ${e * e} \\Rightarrow l = ${e}\\text{ cm}$`
    return `$l \\cdot l \\cdot l = ${e ** 3} \\Rightarrow l = ${e}\\text{ cm}$`
  }
  return {
    text: `Tabelul alăturat se referă la patru cuburi; pentru fiecare cub este dată o singură valoare (${data.map((c, j) => `cubul ${j + 1}: ${['muchia', 'suma muchiilor', 'aria unei fețe', 'volumul'][c.give]}`).join('; ')}). Completați tabelul.`,
    solution: lines(
      `Aflăm întâi muchia fiecărui cub, apoi suma celor $12$ muchii, aria unei fețe ($l \\cdot l$) și volumul ($l \\cdot l \\cdot l$).`,
      ...data.map((c, j) => `Cubul ${j + 1}: ${how(c)}; suma muchiilor $${12 * c.e}\\text{ cm}$, aria unei fețe $${c.e * c.e}\\text{ cm}^2$, volumul $${c.e ** 3}\\text{ cm}^3$.`),
    ),
    verify: () => data.every((c) => c.v[3] === c.v[0] ** 3 && c.v[1] === 12 * c.v[0]),
    fig,
  }
}

// ================= 4. tables and charts (Tema 6, pp. 208–209; p. 220) → v-statistics =================

/** A class's grades 3–10 with their frequencies; the largest and the smallest frequency are unique. */
function gradeData(rng: Rng, totals?: number[]) {
  for (;;) {
    const f = Array.from({ length: 8 }, () => int(rng, 1, 7))
    if (totals) {
      const T = pick(rng, totals)
      const s = f.reduce((x, y) => x + y, 0)
      const diff = T - s
      const i = int(rng, 2, 5)
      f[i] += diff
      if (f[i] < 1 || f[i] > 9) continue
    }
    const mx = Math.max(...f), mn = Math.min(...f)
    if (f.filter((x) => x === mx).length === 1 && f.filter((x) => x === mn).length === 1) {
      const fig = table([['Nota', '3', '4', '5', '6', '7', '8', '9', '10'], ['Numărul elevilor', ...f.map(String)]], { cell: 32, first: 120 })
      return { f, total: f.reduce((x, y) => x + y, 0), fig, grades: [3, 4, 5, 6, 7, 8, 9, 10] }
    }
  }
}
const THE_TABLE = (n?: number) => `Rezultatele obținute de ${n ? `cei ${de(n)} elevi ai unei clase` : 'elevii unei clase'} la un test de evaluare sunt centralizate în tabelul alăturat.`

/** The grade with the largest (smallest) frequency, the pupils, at least / at most a grade. p. 209, I.1–5. */
function gradesFrequency(rng: Rng): Made {
  const g = gradeData(rng)
  const k = int(rng, 6, 8), m = int(rng, 4, 6)
  const most = rng() < 0.5
  const fr = most ? Math.max(...g.f) : Math.min(...g.f)
  const best = g.grades[g.f.indexOf(fr)]
  const atLeast = g.f.slice(k - 3).reduce((x, y) => x + y, 0)
  const atMost = g.f.slice(0, m - 2).reduce((x, y) => x + y, 0)
  return {
    text: lines(THE_TABLE(), `a) Care este nota cu frecvența cea mai ${most ? 'mare' : 'mică'}? b) Câți elevi sunt în clasă? c) Câți elevi au obținut cel puțin nota $${k}$? d) Câți elevi au obținut cel mult nota $${m}$?`),
    solution: lines(
      `a) Frecvența unei note este numărul elevilor care au obținut-o. Cea mai ${most ? 'mare' : 'mică'} frecvență din tabel este $${fr}$, la nota $${best}$.`,
      `b) ${show(`${g.f.join(' + ')} = ${g.total} \\text{ elevi}`)}`,
      `c) Notele $${k}$, …, $10$: ${show(`${g.f.slice(k - 3).join(' + ')} = ${atLeast}`)}`,
      `d) Notele $3$, …, $${m}$: ${show(`${g.f.slice(0, m - 2).join(' + ')} = ${atMost}`)}`,
    ),
    verify: () => atLeast + g.f.slice(0, k - 3).reduce((x, y) => x + y, 0) === g.total && g.f[g.grades.indexOf(best)] === fr,
    fig: g.fig,
  }
}

/** The mean grade of the class, rounded to hundredths. p. 209, I.6. */
function gradesMean(rng: Rng): Made {
  const g = gradeData(rng)
  const sum = g.f.reduce((s, x, i) => s + x * g.grades[i], 0)
  const mean = sum / g.total
  const r = Math.round(mean * 100) / 100
  const exact = same(mean, r)
  return {
    text: lines(THE_TABLE(g.total), `Calculați media notelor clasei${exact ? '' : ', rotunjită la sutimi'}.`),
    solution: lines(
      `Suma notelor: fiecare notă se înmulțește cu numărul elevilor care au obținut-o.`,
      show(`S = ${g.f.map((x, i) => `${g.grades[i]} \\cdot ${x}`).join(' + ')} = ${sum}`),
      `Numărul elevilor: $${g.f.join(' + ')} = ${g.total}$.`,
      show(`m = ${sum} : ${g.total} ${exact ? '=' : '\\approx'} ${dx(r)}`),
    ),
    verify: () => Math.abs(sum / g.total - r) <= 0.005 + 1e-9,
    fig: g.fig,
  }
}

/** The percent of the pupils with grades under 5 and over 7 (a total of 20, 25 or 50 pupils). p. 209, I.7–8. */
function gradesPercent(rng: Rng): Made {
  const g = gradeData(rng, [20, 25, 50])
  const sLim = pick(rng, [5, 6]), tLim = pick(rng, [7, 8])
  const lowF = g.f.slice(0, sLim - 3), highF = g.f.slice(tLim - 2)
  const low = lowF.reduce((x, y) => x + y, 0), high = highF.reduce((x, y) => x + y, 0)
  const pl = (low * 100) / g.total, ph = (high * 100) / g.total
  const fr = (k: number) => (frac(k, g.total) === `\\frac{${k}}{${g.total}}` ? '' : ` = ${frac(k, g.total)}`)
  const gs = (from: number, n: number) => list(Array.from({ length: n }, (_, i) => `$${from + i}$`))
  return {
    text: lines(THE_TABLE(g.total), `a) Ce procent din numărul elevilor au note sub $${sLim}$? b) Ce procent din numărul elevilor au note mai mari decât $${tLim}$?`),
    solution: lines(
      `Numărul elevilor: $${g.f.join(' + ')} = ${g.total}$.`,
      `a) Sub $${sLim}$ (notele ${gs(3, sLim - 3)}): $${lowF.join(' + ')} = ${low}$ elevi. ${show(`\\frac{${low}}{${g.total}}${fr(low)} = ${dx(pl)}\\%`)}`,
      `b) Peste $${tLim}$ (notele ${gs(tLim + 1, 10 - tLim)}): $${highF.join(' + ')} = ${high}$ elevi. ${show(`\\frac{${high}}{${g.total}}${fr(high)} = ${dx(ph)}\\%`)}`,
    ),
    verify: () => same(pl * g.total, low * 100) && same(ph * g.total, high * 100) && highF.length === 10 - tLim,
    fig: g.fig,
  }
}

const DAYS = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']
const DAYS_IN = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']
const CHARTS = [
  { step: 30, lo: 2, hi: 10, what: 'numărul de vizitatori ai unui muzeu în fiecare zi a unei săptămâni', unit: 'vizitatori' },
  { step: 5, lo: 2, hi: 12, what: 'numărul de autoturisme care au intrat în parcarea subterană a unui magazin în fiecare zi a unei săptămâni', unit: 'autoturisme' },
  { step: 10, lo: 2, hi: 9, what: 'numărul de cărți împrumutate de la biblioteca școlii în fiecare zi a unei săptămâni', unit: 'cărți' },
]
/** Seven distinct values, multiples of the step, so that every bar ends on a grid line. */
function chartData(rng: Rng) {
  const c = pick(rng, CHARTS)
  const ks = shuffle(rng, Array.from({ length: c.hi - c.lo + 1 }, (_, i) => c.lo + i)).slice(0, 7)
  const v = ks.map((k) => k * c.step)
  return { ...c, v, fig: barChart(DAYS, v, c.step, { w: 420 }) }
}

/** The day with the most and the fewest, the days with more than one day. p. 209, II.1–2; p. 220, 2 b. */
function chartMostLeast(rng: Rng): Made {
  const d = chartData(rng)
  const mx = Math.max(...d.v), mn = Math.min(...d.v)
  const ref = int(rng, 0, 6)
  const more = d.v.map((x, i) => (x > d.v[ref] ? DAYS_IN[i] : '')).filter(Boolean)
  return {
    text: lines(
      `În diagrama alăturată este reprezentat ${d.what}.`,
      d.unit === 'vizitatori'
        ? `a) Precizați ziua cu cei mai mulți și ziua cu cei mai puțini vizitatori. b) Precizați zilele în care au fost mai mulți vizitatori decât ${DAYS_IN[ref]}.`
        : `a) Precizați ziua cu cele mai multe și ziua cu cele mai puține ${d.unit === 'cărți' ? 'cărți împrumutate' : d.unit}. b) Precizați zilele în care au fost mai multe ${d.unit === 'cărți' ? 'cărți împrumutate' : d.unit} decât ${DAYS_IN[ref]}.`,
    ),
    solution: lines(
      `Citim din diagramă înălțimea fiecărei bare: ${list(d.v.map((x, i) => `${DAYS_IN[i]} $${x}$`))}.`,
      `a) Cea mai înaltă bară este cea de ${DAYS_IN[d.v.indexOf(mx)]} ($${mx}$), iar cea mai scundă este cea de ${DAYS_IN[d.v.indexOf(mn)]} ($${mn}$).`,
      more.length
        ? `b) ${DAYS[ref]} au fost $${d.v[ref]}$; mai mult de atât: ${list(more)}.`
        : `b) ${DAYS[ref]} au fost $${d.v[ref]}$, cel mai mult din săptămână, deci nu există o astfel de zi.`,
    ),
    verify: () => more.every((n) => d.v[DAYS_IN.indexOf(n)] > d.v[ref]) && d.v.filter((x) => x > d.v[ref]).length === more.length,
    fig: d.fig,
  }
}

/** Complete the table from the chart, the total and the mean per day. p. 220, 2 a, c; p. 209, II.5–7. */
function chartMean(rng: Rng): Made {
  const d = chartData(rng)
  const total = d.v.reduce((s, x) => s + x, 0)
  const mean = total / 7, r = Math.round(mean)
  const exact = same(mean, r)
  const [i1, i2] = shuffle(rng, [0, 1, 2, 3, 4, 5, 6]).slice(0, 2)
  const [hi, lo] = d.v[i1] > d.v[i2] ? [i1, i2] : [i2, i1]
  return {
    text: lines(
      `În diagrama alăturată este reprezentat ${d.what}.`,
      `a) Scrieți valorile citite din diagramă într-un tabel cu zilele săptămânii. b) Cu cât a fost mai mare numărul de ${d.unit} de ${DAYS_IN[hi]} decât cel de ${DAYS_IN[lo]}? c) Calculați numărul total din săptămâna analizată și media pe zi${exact ? '' : ', rotunjită la unități'}.`,
    ),
    solution: lines(
      `a) ${list(d.v.map((x, i) => `${DAYS[i]}: $${x}$`))}.`,
      `b) ${show(`${d.v[hi]} - ${d.v[lo]} = ${d.v[hi] - d.v[lo]}`)}`,
      `c) ${show(`${d.v.join(' + ')} = ${total}`)}`,
      show(`m = ${total} : 7 ${exact ? '=' : '\\approx'} ${r}`),
    ),
    verify: () => Math.abs(total / 7 - r) <= 0.5 && d.v[hi] > d.v[lo],
    fig: d.fig,
  }
}

/** The percent of one day in the week, rounded to hundredths; the days with at most / at least a value. p. 209, II.3–4, 8. */
function chartPercent(rng: Rng): Made {
  const d = chartData(rng)
  const total = d.v.reduce((s, x) => s + x, 0)
  const day = int(rng, 0, 6)
  const p = (d.v[day] * 100) / total
  const pr = Math.round(p * 100) / 100
  const sorted = [...d.v].sort((a, b) => a - b)
  const lim = sorted[int(rng, 2, 4)]
  const atMost = d.v.map((x, i) => (x <= lim ? DAYS_IN[i] : '')).filter(Boolean)
  return {
    text: lines(
      `În diagrama alăturată este reprezentat ${d.what}.`,
      `a) Precizați zilele în care au fost cel mult $${lim}$ ${de(lim) === String(lim) ? '' : 'de '}${d.unit}. b) Ce procent din numărul total al săptămânii reprezintă numărul din ziua de ${DAYS_IN[day]}? Rotunjiți rezultatul la sutimi.`,
    ),
    solution: lines(
      `Din diagramă: ${list(d.v.map((x, i) => `${DAYS_IN[i]} $${x}$`))}.`,
      `a) Barele care nu depășesc linia $${lim}$: ${list(atMost)}.`,
      `b) Totalul săptămânii: $${d.v.join(' + ')} = ${total}$.`,
      show(`\\frac{${d.v[day]}}{${total}} \\cdot 100\\% ${same(p, pr) ? '=' : '\\approx'} ${dx(pr)}\\%`),
    ),
    verify: () => Math.abs(p - pr) <= 0.005 + 1e-9 && atMost.length === d.v.filter((x) => x <= lim).length,
    fig: d.fig,
  }
}

// ================= 5. angles in a figure (p. 211, ex. 16; p. 217, Testul 3, V.2) → v-angle-calc =================

function withLabels(fig: Fig, l: Fig['l']): Fig {
  fig.l = { ...fig.l, ...l }
  return fig
}

/** A, O, B collinear, ∢AOC given: ∢BOC. p. 217, Testul 3, V.2 (the first figure). */
function supplementBOC(rng: Rng): Made {
  let x = int(rng, 25, 155)
  if (Math.abs(x - 90) < 6) x += 15
  const fig = withLabels(rays('O', [{ name: 'A', deg: 180 }, { name: 'B', deg: 0 }, { name: 'C', deg: 180 - x }], {
    w: 300, arcs: ['COA'], measures: [{ between: ['A', 'C'], s: `${x}°` }],
  }), { O: 's', A: 's', B: 's' })
  return {
    text: `În figura alăturată, punctele $A$, $O$ și $B$ sunt coliniare, iar $${A('AOC')} = ${deg(x)}$. Determinați măsura unghiului $BOC$ și precizați ce fel de unghi este.`,
    solution: lines(
      `Unghiurile $AOC$ și $BOC$ sunt adiacente, iar laturile lor necomune sunt semidrepte opuse, deci sunt suplementare:`,
      show(`${A('BOC')} = 180^\\circ - ${deg(x)} = ${deg(180 - x)}`),
      `Unghiul $BOC$ este ${180 - x < 90 ? 'ascuțit' : 'obtuz'}.`,
    ),
    verify: () => x + (180 - x) === 180,
    fig,
  }
}

/** ∢DEF = 90°, G interior, ∢GEF given: ∢GED. p. 217, Testul 3, V.2 (the third figure). */
function complementGED(rng: Rng): Made {
  let x = int(rng, 12, 78)
  if (Math.abs(x - 45) < 3) x += 6
  const fig = withLabels(rays('E', [{ name: 'F', deg: 0 }, { name: 'D', deg: 90 }, { name: 'G', deg: x }], {
    w: 240, measures: [{ between: ['F', 'G'], s: `${x}°` }],
  }), { E: 'sw', F: 's', D: 'w' })
  fig.ra = ['FED']
  return {
    text: `În figura alăturată, $${A('DEF')} = 90^\\circ$, punctul $G$ este în interiorul unghiului $DEF$, iar $${A('GEF')} = ${deg(x)}$. Determinați măsura unghiului $GED$.`,
    solution: lines(
      `Semidreapta $EG$ este în interiorul unghiului drept $DEF$, deci $${A('DEG')} + ${A('GEF')} = 90^\\circ$:`,
      show(`${A('GED')} = 90^\\circ - ${deg(x)} = ${deg(90 - x)}`),
    ),
    verify: () => x + 90 - x === 90,
    fig,
  }
}

/** M, N, P collinear, R and Q on the same side: ∢RNQ from ∢MNR and ∢QNP. p. 217, Testul 3, V.2 (the second figure). */
function lineTwoAngles(rng: Rng): Made {
  const a = int(rng, 30, 80), b = int(rng, 25, 75)
  const c = 180 - a - b
  const fig = withLabels(rays('N', [{ name: 'M', deg: 180 }, { name: 'P', deg: 0 }, { name: 'R', deg: 180 - a }, { name: 'Q', deg: b }], {
    w: 320, measures: [{ between: ['M', 'R'], s: `${a}°` }, { between: ['Q', 'P'], s: `${b}°` }],
  }), { N: 's', M: 's', P: 's' })
  return {
    text: `În figura alăturată, punctele $M$, $N$ și $P$ sunt coliniare, iar punctele $R$ și $Q$ sunt de aceeași parte a dreptei $MP$, $${A('MNR')} = ${deg(a)}$ și $${A('QNP')} = ${deg(b)}$. Determinați măsura unghiului $RNQ$.`,
    solution: lines(
      `Unghiurile $MNR$, $RNQ$ și $QNP$ formează împreună unghiul alungit $MNP$:`,
      show(`${A('MNR')} + ${A('RNQ')} + ${A('QNP')} = 180^\\circ`),
      show(`${A('RNQ')} = 180^\\circ - ${deg(a)} - ${deg(b)} = ${deg(c)}`),
    ),
    verify: () => a + b + c === 180 && c > 0,
    fig,
  }
}

/** ∢AOC obtuse, ∢AOB right with B inside; OD the bisector of AOB: BOC, COD, and AOD against BOC. p. 211, ex. 16. */
function rightInsideObtuse(rng: Rng): Made {
  const al = int(rng, 105, 170)
  const boc = al - 90
  const fig = withLabels(rays('O', [{ name: 'C', deg: 0 }, { name: 'B', deg: boc }, { name: 'A', deg: al }], { w: 280 }), { O: 's', C: 's' })
  fig.ra = ['BOA']
  const cod = boc + 45
  const rel = boc === 45 ? 'congruente' : boc < 45 ? `$${A('BOC')} < ${A('AOD')}$` : `$${A('BOC')} > ${A('AOD')}$`
  return {
    text: lines(
      `În figura alăturată, $${A('AOC')} = ${deg(al)}$, iar unghiul $AOB$ este drept, cu $B$ în interiorul unghiului $AOC$.`,
      `a) Calculați măsura unghiului $BOC$. b) Dacă $OD$ este bisectoarea (axa de simetrie a) unghiului $AOB$, calculați măsura unghiului $COD$. c) Comparați unghiurile $AOD$ și $BOC$.`,
    ),
    solution: lines(
      `a) ${show(`${A('BOC')} = ${A('AOC')} - ${A('AOB')} = ${deg(al)} - 90^\\circ = ${deg(boc)}`)}`,
      `b) $OD$ împarte unghiul drept în două unghiuri de $45^\\circ$, iar $D$ este între $A$ și $B$: ${show(`${A('COD')} = ${A('COB')} + ${A('BOD')} = ${deg(boc)} + 45^\\circ = ${deg(cod)}`)}`,
      `c) $${A('AOD')} = 45^\\circ$ și $${A('BOC')} = ${deg(boc)}$, deci unghiurile ${boc === 45 ? 'sunt congruente' : `nu sunt congruente: ${rel}`}.`,
    ),
    verify: () => cod + 45 === al && boc + 90 === al,
    fig,
  }
}

/** Four rays around a point, three angles written on the figure: the fourth, and the obtuse ones. Unghiuri în jurul unui punct. */
function aroundPoint(rng: Rng): Made {
  let a = 0, b = 0, c = 0, d = 0
  do { a = int(rng, 50, 130); b = int(rng, 40, 120); c = int(rng, 45, 120); d = 360 - a - b - c } while (d < 40 || d > 150 || d === 90)
  const start = int(rng, 0, 40)
  const dirs = [{ name: 'A', deg: start }, { name: 'B', deg: start + a }, { name: 'C', deg: start + a + b }, { name: 'D', deg: start + a + b + c }]
  const fig = rays('O', dirs, { w: 260, measures: [{ between: ['A', 'B'], s: `${a}°` }, { between: ['B', 'C'], s: `${b}°` }, { between: ['C', 'D'], s: `${c}°` }] })
  const obtuse = [['AOB', a], ['BOC', b], ['COD', c], ['DOA', d]].filter(([, x]) => (x as number) > 90).map(([n]) => `$${n}$`)
  return {
    text: `În figura alăturată, semidreptele $OA$, $OB$, $OC$ și $OD$ formează în jurul punctului $O$ unghiurile $AOB$, $BOC$, $COD$ și $DOA$, fără puncte interioare comune: $${A('AOB')} = ${deg(a)}$, $${A('BOC')} = ${deg(b)}$, $${A('COD')} = ${deg(c)}$. Calculați măsura unghiului $DOA$ și precizați care dintre cele patru unghiuri sunt obtuze.`,
    solution: lines(
      `Suma măsurilor unghiurilor în jurul unui punct este $360^\\circ$:`,
      show(`${A('DOA')} = 360^\\circ - (${deg(a)} + ${deg(b)} + ${deg(c)}) = 360^\\circ - ${deg(a + b + c)} = ${deg(d)}`),
      obtuse.length ? `Unghiurile obtuze (mai mari de $90^\\circ$): ${list(obtuse)}.` : `Niciunul dintre unghiuri nu este obtuz.`,
    ),
    verify: () => a + b + c + d === 360,
    fig,
  }
}

/** A, O, B collinear, OC and OD on the same side, OM the bisector of COD: ∢COD and ∢AOM. After p. 211, ex. 19. */
function lineBisector(rng: Rng): Made {
  let a = 0, b = 0
  do { a = int(rng, 25, 80); b = int(rng, 25, 80) } while ((180 - a - b) % 2 !== 0 || 180 - a - b < 30)
  const cod = 180 - a - b, half = cod / 2
  const aom = a + half
  const fig = withLabels(rays('O', [
    { name: 'A', deg: 180 }, { name: 'B', deg: 0 }, { name: 'C', deg: 180 - a }, { name: 'D', deg: b }, { name: 'M', deg: b + half },
  ], { w: 320, measures: [{ between: ['A', 'C'], s: `${a}°` }, { between: ['D', 'B'], s: `${b}°` }] }), { O: 's', A: 's', B: 's' })
  return {
    text: `În figura alăturată, punctele $A$, $O$, $B$ sunt coliniare, iar $C$ și $D$ sunt de aceeași parte a dreptei $AB$, $${A('AOC')} = ${deg(a)}$ și $${A('BOD')} = ${deg(b)}$. Semidreapta $OM$ este bisectoarea unghiului $COD$. Calculați măsurile unghiurilor $COD$, $AOM$ și $BOM$.`,
    solution: lines(
      show(`${A('COD')} = 180^\\circ - ${deg(a)} - ${deg(b)} = ${deg(cod)}`),
      `$OM$ este bisectoare, deci $${A('COM')} = ${A('MOD')} = ${deg(cod)} : 2 = ${deg(half)}$.`,
      show(`${A('AOM')} = ${A('AOC')} + ${A('COM')} = ${deg(a)} + ${deg(half)} = ${deg(aom)}`),
      show(`${A('BOM')} = 180^\\circ - ${deg(aom)} = ${deg(180 - aom)}`),
    ),
    verify: () => 180 - aom === b + half,
    fig,
  }
}

// ================= 6. counting (p. 210, ex. 2; p. 211, ex. 18; p. 164) → v-count-figures =================

const C2 = (n: number) => (n * (n - 1)) / 2

/** n points on a line: how many segments. Puncte coliniare (p. 210, ex. 2–3). */
function segmentsOnLine(rng: Rng): Made {
  const n = int(rng, 4, 9)
  const first = int(rng, 0, LETTERS.length - n)
  const names = LETTERS.slice(first, first + n)
  let x = 0
  const at = names.map(() => (x += int(rng, 2, 6)))
  const fig = pointsOnLine(names, at, { line: 'd', w: 380 })
  return {
    text: `Pe dreapta $d$ din figura alăturată sunt marcate punctele ${list(names.map((s) => `$${s}$`))}. Câte segmente au ambele capete printre aceste puncte?`,
    solution: lines(
      `Din fiecare dintre cele $${n}$ puncte pornesc $${n - 1}$ segmente spre celelalte puncte; așa, fiecare segment este numărat de două ori (din ambele capete):`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}`),
      `Se pot forma $${C2(n)}$ segmente.`,
    ),
    verify: () => C2(n) === Array.from({ length: n }, (_, i) => n - 1 - i).reduce((s, t) => s + t, 0),
    fig,
  }
}

/** n points in a convex position (no three collinear): points only, how many lines. p. 210, ex. 2 a–b; p. 211, ex. 18 b. */
function pointsPositions(rng: Rng, n: number): Pt[] {
  const start = int(rng, 0, 359)
  return Array.from({ length: n }, (_, i) => onCircle([0, 0], 1 + 0.15 * ((i * 7) % 3) / 2, start + (360 / n) * i + int(rng, -10, 10)))
}
function linesThroughPoints(rng: Rng): Made {
  const n = int(rng, 4, 8)
  const first = int(rng, 0, LETTERS.length - n)
  const names = LETTERS.slice(first, first + n)
  const q = pointsPositions(rng, n)
  const fig = plane(Object.fromEntries(names.map((s, i) => [s, q[i]])), 220, { dot: names.join(' ') })
  return {
    text: `În figura alăturată sunt desenate ${de(n)} puncte, ${list(names.map((x) => `$${x}$`))}, oricare trei dintre ele necoliniare. Câte drepte distincte determină aceste puncte (unindu-le două câte două)?`,
    solution: lines(
      `Prin două puncte distincte trece o singură dreaptă, iar fiindcă oricare trei puncte sunt necoliniare, fiecare pereche de puncte dă o dreaptă diferită. Numărul perechilor:`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}`),
      `Punctele determină $${C2(n)}$ drepte.`,
    ),
    verify: () => C2(n) * 2 === n * (n - 1),
    fig,
  }
}

/** n points, k of them on the line d and the others not, no other three collinear: the lines. p. 210, ex. 2 c. */
function linesWithCollinear(rng: Rng): Made {
  const k = int(rng, 3, 5), m = int(rng, 2, 4), n = k + m
  const names = LETTERS.slice(0, n)
  const pts: Record<string, Pt> = {}
  const xs = Array.from({ length: k }, (_, i) => i * 2 + (i % 2) * 0.4)
  names.slice(0, k).forEach((s, i) => (pts[s] = [xs[i], 0]))
  // the others above and below the line, at heights and abscissas that keep them off every line through two points
  const ext = (k - 1) * 2 + 1
  const off = (): boolean => {
    const q = names.map((s) => pts[s])
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let t = Math.max(j + 1, k); t < n; t++) {
      const [a, b, c] = [q[i], q[j], q[t]]
      const cross = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]))
      const far = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]), Math.hypot(c[0] - a[0], c[1] - a[1]), Math.hypot(c[0] - b[0], c[1] - b[1]))
      if (cross / far < 0.25) return false
    }
    return true
  }
  do {
    names.slice(k).forEach((s, i) => (pts[s] = [int(rng, 0, 10 * (ext - 1)) / 10, (i % 2 ? -1 : 1) * int(rng, 12, 30) / 10]))
  } while (!off())
  pts.U = [-0.8, 0]; pts.V = [ext, 0]
  const fig = plane(pts, 300, { s: 'U-V', dot: names.join(' '), t: [{ at: [ext, 0.35], s: 'd', italic: true, size: 13, anchor: 'end' }] })
  fig.l = { U: '', V: '', ...Object.fromEntries(names.slice(0, k).map((s) => [s, 's'])) }
  const ans = C2(n) - C2(k) + 1
  return {
    text: `În figura alăturată sunt ${de(n)} puncte distincte: ${de(k)} dintre ele se află pe dreapta $d$, iar celelalte nu; în afară de acestea, oricare trei puncte sunt necoliniare. Câte drepte distincte se obțin unind punctele două câte două?`,
    solution: lines(
      `Dacă oricare trei puncte ar fi necoliniare, am avea $\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}$ drepte.`,
      `Cele $${k}$ puncte de pe $d$ formează $\\frac{${k} \\cdot ${k - 1}}{2} = ${C2(k)}$ perechi, dar toate dau aceeași dreaptă $d$; le scădem și o numărăm o singură dată:`,
      show(`${C2(n)} - ${C2(k)} + 1 = ${ans}`),
    ),
    // no three points collinear except those on d (each triple with a point off d is far from a line)
    verify: () => off() && ans === C2(m) + k * m + 1,
    fig,
  }
}

/** n rays from O, all inside a straight angle: how many angles (no null or straight one). Numărarea unghiurilor. */
function anglesFromRays(rng: Rng): Made {
  const n = int(rng, 3, 7)
  const span = int(rng, 110, 170)
  const start = int(rng, 0, 180 - span)
  const names = LETTERS.slice(int(rng, 0, 6)).filter((s) => s !== 'O').slice(0, n)
  const step = span / (n - 1)
  const dirs = names.map((s, i) => ({ name: s, deg: Math.round(start + i * step + (i > 0 && i < n - 1 ? int(rng, -4, 4) : 0)) }))
  const fig = withLabels(rays('O', dirs, { w: 280 }), { O: 's' })
  return {
    text: `În figura alăturată sunt desenate semidreptele ${list(names.map((s) => `$O${s}$`))}, cu originea comună $O$. Câte unghiuri au laturile printre aceste semidrepte?`,
    solution: lines(
      `Un unghi este determinat de două semidrepte diferite; fiecare semidreaptă formează câte un unghi cu fiecare dintre celelalte $${n - 1}$, iar fiecare unghi este numărat de două ori:`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}`),
      `Sunt $${C2(n)}$ unghiuri.`,
    ),
    verify: () => C2(n) === (n * (n - 1)) / 2,
    fig,
  }
}

/** All the rectangles in an m × n grid of squares. After p. 164, ex. 28 (figures made of squares). */
function rectanglesInGrid(rng: Rng): Made {
  const m = int(rng, 1, 3), n = int(rng, 3, 7)
  const ans = C2(m + 1) * C2(n + 1)
  return {
    text: `Câte dreptunghiuri (inclusiv pătratele) se pot vedea în figura alăturată, formată din ${m === 1 ? `${n} pătrățele așezate în linie` : `${m} rânduri a câte ${n} pătrățele`}?`,
    solution: lines(
      `Un dreptunghi din figură este determinat de două dintre cele $${n + 1}$ linii verticale și de două dintre cele $${m + 1}$ linii orizontale.`,
      `Perechi de linii verticale: $\\frac{${n + 1} \\cdot ${n}}{2} = ${C2(n + 1)}$; perechi de linii orizontale: $\\frac{${m + 1} \\cdot ${m}}{2} = ${C2(m + 1)}$.`,
      show(`${C2(n + 1)} \\cdot ${C2(m + 1)} = ${ans}`),
    ),
    verify: () => {
      let c = 0
      for (let x1 = 0; x1 <= n; x1++) for (let x2 = x1 + 1; x2 <= n; x2++) for (let y1 = 0; y1 <= m; y1++) for (let y2 = y1 + 1; y2 <= m; y2++) c++
      return c === ans
    },
    fig: shadedGrid(n, m, [], 32),
  }
}

/** All the squares in an m × n grid. After p. 164, ex. 28. */
function squaresInGrid(rng: Rng): Made {
  const m = int(rng, 2, 5), n = int(rng, m, 7)
  const terms = Array.from({ length: m }, (_, i) => (m - i) * (n - i))
  const ans = terms.reduce((s, t) => s + t, 0)
  return {
    text: `Câte pătrate de toate mărimile se pot vedea în rețeaua din figura alăturată, cu ${m} rânduri a câte ${n} pătrățele?`,
    solution: lines(
      `Numărăm pătratele după latură: cu latura de $k$ pătrățele încap $(${m} - k + 1) \\cdot (${n} - k + 1)$ pătrate.`,
      ...terms.map((t, i) => `Latura ${i + 1}: $${m - i} \\cdot ${n - i} = ${t}$.`),
      show(`${terms.join(' + ')} = ${ans}`),
    ),
    verify: () => ans === terms.reduce((s, t) => s + t, 0) && terms[0] === m * n,
    fig: shadedGrid(n, m, [], 30),
  }
}

// ================= 7. the number line with lengths (Unități de lungime, pp. 152–158) → v-number-line =================

const PAIRS: [string, string][] = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['P', 'Q'], ['R', 'S'], ['U', 'V']]

/** A ruler in cm, two points at whole or half centimetres: their places and AB in cm and mm. */
function rulerCm(rng: Rng): Made {
  const [P, Q] = pick(rng, PAIRS)
  const N = int(rng, 8, 14)
  let a = 0, b = 0
  do { a = int(rng, 0, 2 * N) / 2; b = int(rng, 0, 2 * N) / 2 } while (Math.abs(a - b) < 2 || (Number.isInteger(a) && Number.isInteger(b)))
  if (a > b) [a, b] = [b, a]
  const fig = numberLine({ from: 0, to: N, step: 0.5, labels: Array.from({ length: N + 1 }, (_, i) => i), points: [{ name: P, at: a }, { name: Q, at: b }], w: 400 })
  return {
    text: `Pe rigla de $${N}\\text{ cm}$ din figura alăturată, gradată în centimetri (cu o liniuță la fiecare jumătate de centimetru), sunt marcate punctele $${P}$ și $${Q}$. Citiți pozițiile punctelor și aflați lungimea segmentului $${P}${Q}$ în centimetri și în milimetri.`,
    solution: lines(
      `Între două numere vecine sunt două diviziuni, deci o diviziune are $0{,}5\\text{ cm}$. Punctul $${P}$ este la $${dx(a)}\\text{ cm}$, iar $${Q}$ la $${dx(b)}\\text{ cm}$.`,
      show(`${P}${Q} = ${dx(b)} - ${dx(a)} = ${dx(b - a)}\\text{ cm} = ${dx((b - a) * 10)}\\text{ mm}`),
    ),
    verify: () => same((b - a) * 10, Math.round((b - a) * 10)),
    fig,
  }
}

/** A tape in metres with a tick every 10 cm: the coordinates of A, B in m and AB in cm. */
function tapeMetres(rng: Rng): Made {
  const [P, Q] = pick(rng, PAIRS)
  const from = int(rng, 0, 2), to = from + 2
  let a = 0, b = 0
  do { a = from + int(rng, 1, 19) / 10; b = from + int(rng, 1, 19) / 10 } while (Math.abs(a - b) < 0.25 || Number.isInteger(a) || Number.isInteger(b))
  if (a > b) [a, b] = [b, a]
  const fig = numberLine({ from, to, step: 0.1, labels: [from, from + 0.5, from + 1, from + 1.5, to], points: [{ name: P, at: a }, { name: Q, at: b }], w: 420 })
  return {
    text: `Axa din figura alăturată reprezintă o bucată de ruletă gradată în metri, de la $${from}\\text{ m}$ la $${to}\\text{ m}$, cu o liniuță la fiecare $10\\text{ cm}$. Scrieți numerele (în metri) corespunzătoare punctelor $${P}$ și $${Q}$, apoi aflați distanța $${P}${Q}$ în centimetri.`,
    solution: lines(
      `Între $${from}$ și $${from + 1}$ sunt $10$ diviziuni, deci o diviziune are $0{,}1\\text{ m} = 10\\text{ cm}$.`,
      `Numărând diviziunile: $${P}$ corespunde lui $${dx(a)}\\text{ m}$, iar $${Q}$ lui $${dx(b)}\\text{ m}$.`,
      show(`${P}${Q} = ${dx(b)} - ${dx(a)} = ${dx(b - a)}\\text{ m} = ${Math.round((b - a) * 100)}\\text{ cm}`),
    ),
    verify: () => same(Math.round((b - a) * 100) / 100, r6(b - a)),
    fig,
  }
}

/** A road of 1 km with a tick every 100 m, only 0 and 1 written: A, B in km and in m, AB in dam. */
function kmLine(rng: Rng): Made {
  const [P, Q] = pick(rng, PAIRS)
  let a = 0, b = 0
  do { a = int(rng, 1, 9); b = int(rng, 1, 9) } while (Math.abs(a - b) < 2)
  if (a > b) [a, b] = [b, a]
  const fig = numberLine({ from: 0, to: 1, step: 0.1, labels: [0, 1], points: [{ name: P, at: a / 10 }, { name: Q, at: b / 10 }], w: 400 })
  const end = pick(rng, ['km', 'hm'])
  return {
    text: `Pe axa din figura alăturată, segmentul de la $0$ la $1$ reprezintă ${pick(rng, ['un drum', 'o pistă de alergare', 'un traseu pentru biciclete', 'o stradă'])} de $1\\text{ km}$, împărțit în părți egale. Scrieți pozițiile punctelor $${P}$ și $${Q}$ în kilometri și în metri, apoi exprimați distanța $${P}${Q}$ în decametri și în ${end === 'km' ? 'kilometri' : 'hectometri'}.`,
    solution: lines(
      `Segmentul de $1\\text{ km} = 1000\\text{ m}$ este împărțit în $10$ părți egale, deci o parte are $100\\text{ m} = 0{,}1\\text{ km}$.`,
      `$${P}$ este la $${a}$ diviziuni: $${dx(a / 10)}\\text{ km} = ${a * 100}\\text{ m}$; $${Q}$ este la $${b}$ diviziuni: $${dx(b / 10)}\\text{ km} = ${b * 100}\\text{ m}$.`,
      show(`${P}${Q} = ${b * 100} - ${a * 100} = ${(b - a) * 100}\\text{ m} = ${(b - a) * 10}\\text{ dam} = ${end === 'km' ? `${dx((b - a) / 10)}\\text{ km}` : `${b - a}\\text{ hm}`}`),
    ),
    verify: () => (b - a) * 100 === b * 100 - a * 100,
    fig,
  }
}

/** A and B on a tape in metres: the midpoint M, and AM in cm. */
function midpointMetres(rng: Rng): Made {
  const [P, Q] = pick(rng, PAIRS)
  const from = int(rng, 0, 3)
  let a = 0, b = 0
  do { a = int(rng, 1, 19); b = int(rng, 1, 19) } while (Math.abs(a - b) < 4)
  if (a > b) [a, b] = [b, a]
  const A1 = from + a / 10, B1 = from + b / 10, M = (A1 + B1) / 2
  const fig = numberLine({ from, to: from + 2, step: 0.1, labels: [from, from + 1, from + 2], points: [{ name: P, at: A1 }, { name: Q, at: B1 }], w: 420 })
  return {
    text: `Pe axa din figura alăturată, gradată în metri de la $${from}$ la $${from + 2}$, cu o liniuță la fiecare $10\\text{ cm}$, sunt marcate punctele $${P}$ și $${Q}$. Fie $M$ mijlocul segmentului $${P}${Q}$. Aflați numărul corespunzător punctului $M$ și lungimea segmentului $${P}M$, în centimetri.`,
    solution: lines(
      `O diviziune are $0{,}1\\text{ m}$. Citim: $${P}$ corespunde lui $${dx(A1)}$, iar $${Q}$ lui $${dx(B1)}$.`,
      `Mijlocul corespunde mediei aritmetice a celor două numere:`,
      show(`M: \\ (${dx(A1)} + ${dx(B1)}) : 2 = ${dx(A1 + B1)} : 2 = ${dx(M)}`),
      show(`${P}M = ${dx(M)} - ${dx(A1)} = ${dx(M - A1)}\\text{ m} = ${dx(r6((M - A1) * 100))}\\text{ cm}`),
    ),
    verify: () => same(M - A1, B1 - M),
    fig,
  }
}

// ================= 8. shaded parts (p. 213, ex. 25; p. 163, ex. 22–26) → v-fraction-figures =================

function randomCells(rng: Rng, cols: number, rows: number, k: number): [number, number][] {
  const all: [number, number][] = []
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) all.push([c, r])
  return shuffle(rng, all).slice(0, k)
}

/** What fraction of the rectangle is hatched, and what fraction is not. */
function hatchedFraction(rng: Rng): Made {
  const cols = int(rng, 3, 6), rows = int(rng, 2, 4), n = cols * rows
  const k = int(rng, 1, n - 2)
  const want = int(rng, k + 1, n - 1)
  const red = (p: number) => (frac(p, n) === `\\frac{${p}}{${n}}` ? '' : ` = ${frac(p, n)}`)
  return {
    text: `Dreptunghiul din figura alăturată este împărțit în pătrățele egale. Ce fracție din dreptunghi este hașurată și ce fracție nu este hașurată? Scrieți fracțiile ireductibile. Câte pătrățele ar mai trebui hașurate pentru ca partea hașurată să fie $${frac(want, n)}$ din dreptunghi?`,
    solution: lines(
      `Dreptunghiul are $${cols} \\cdot ${rows} = ${n}$ pătrățele, dintre care $${k}$ hașurate.`,
      show(`\\text{hasurat: } \\frac{${k}}{${n}}${red(k)}, \\qquad \\text{nehasurat: } \\frac{${n - k}}{${n}}${red(n - k)}`),
      `$${frac(want, n)}$ din $${n}$ pătrățele înseamnă $${n} : ${n / gcd(want, n)} \\cdot ${want / gcd(want, n)} = ${want}$ pătrățele, deci mai trebuie hașurate $${want} - ${k} = ${want - k}$.`,
    ),
    verify: () => k + (n - k) === n && want > k && want < n,
    fig: shadedGrid(cols, rows, randomCells(rng, cols, rows, k), 28),
  }
}

/** What percent of the figure is hatched (20, 25, 50 or 100 squares). After p. 209, I.7 (percents). */
function hatchedPercent(rng: Rng): Made {
  const [cols, rows] = pick(rng, [[5, 4], [5, 5], [10, 5], [10, 10], [10, 2]] as [number, number][])
  const n = cols * rows
  const k = int(rng, 1, n - 2)
  const p = (k * 100) / n
  const want = int(rng, k + 1, n - 1), wp = (want * 100) / n
  return {
    text: `Ce procent din suprafața figurii alăturate este hașurat? Dar nehașurat? Câte pătrățele ar mai trebui hașurate pentru ca partea hașurată să fie $${dx(wp)}\\%$ din figură?`,
    solution: lines(
      `Figura are $${cols} \\cdot ${rows} = ${n}$ pătrățele egale, dintre care $${k}$ hașurate.`,
      show(`\\frac{${k}}{${n}} = \\frac{${dx(p)}}{100} = ${dx(p)}\\%, \\qquad 100\\% - ${dx(p)}\\% = ${dx(100 - p)}\\%`),
      `$${dx(wp)}\\%$ din $${n}$ pătrățele: $\\frac{${dx(wp)}}{100} \\cdot ${n} = ${want}$ pătrățele; mai trebuie hașurate $${want} - ${k} = ${want - k}$.`,
    ),
    verify: () => same(p * n, k * 100) && same((wp * n) / 100, want),
    fig: shadedGrid(cols, rows, randomCells(rng, cols, rows, k), n > 50 ? 22 : 28),
  }
}

/** A square garden split into equal beds, peppers on the hatched ones: the fraction and the areas. p. 213, ex. 25. */
function gardenBeds(rng: Rng): Made {
  let r = 0, c = 0, s = 0
  do { r = int(rng, 2, 4); c = int(rng, 2, 5); s = (r * c) / gcd(r, c) * int(rng, 1, 6) } while (s < 6 || s > 60 || (s * s) % (r * c) !== 0)
  const n = r * c, k = int(rng, 1, n - 1)
  const area = s * s, peppers = (area * k) / n
  const cw = 240 / c, ch = 240 / r
  const grid: string[] = []
  for (let i = 0; i <= c; i++) grid.push(`M${(i * cw).toFixed(1)} 0 V240`)
  for (let j = 0; j <= r; j++) grid.push(`M0 ${(j * ch).toFixed(1)} H240`)
  const cells = randomCells(rng, c, r, k)
  const fig: Fig = {
    w: 240, h: 240, p: {},
    path: [...cells.map(([x, y]) => ({ d: `M${(x * cw).toFixed(1)} ${(y * ch).toFixed(1)} h${cw.toFixed(1)} v${ch.toFixed(1)} h${(-cw).toFixed(1)} Z`, hatch: true })), { d: grid.join(' ') }],
  }
  return {
    text: `Bunica are o grădină în formă de pătrat, cu perimetrul de $${4 * s}\\text{ m}$, împărțită în straturi egale ca în figura alăturată. Pe straturile hașurate a plantat ardei, iar pe celelalte roșii. Ce fracție din grădină este plantată cu ardei? Calculați aria suprafeței cultivate cu ardei și aria suprafeței cultivate cu roșii.`,
    solution: lines(
      `Latura grădinii: $${4 * s} : 4 = ${s}\\text{ m}$, deci aria ei este $${s} \\cdot ${s} = ${area}\\text{ m}^2$.`,
      `Grădina are $${r} \\cdot ${c} = ${n}$ straturi egale, dintre care $${k}$ hașurate: ardeii ocupă $\\frac{${k}}{${n}}${frac(k, n) === `\\frac{${k}}{${n}}` ? '' : ` = ${frac(k, n)}`}$ din grădină.`,
      show(`\\mathcal{A}_{\\text{ardei}} = ${frac(k, n)} \\cdot ${area} = ${dx(peppers)}\\text{ m}^2, \\qquad \\mathcal{A}_{\\text{rosii}} = ${area} - ${dx(peppers)} = ${dx(area - peppers)}\\text{ m}^2`),
    ),
    verify: () => same(peppers * n, area * k),
    fig,
  }
}

/** A floor of square tiles, some dark (hatched): the fraction of dark tiles and their area. p. 163, ex. 22, 25–26. */
function tilesHatched(rng: Rng): Made {
  const cols = int(rng, 4, 8), rows = int(rng, 3, 5), n = cols * rows
  const t = pick(rng, [20, 25, 30, 40, 50])
  const k = int(rng, 2, n - 2)
  const one = t * t
  const darkCm = k * one
  return {
    text: `Pardoseala ${pick(rng, ['unui hol', 'unei bucătării', 'unei băi', 'unei terase', 'unui coridor'])}, reprezentată în figura alăturată, este acoperită cu plăci pătrate de gresie cu latura de $${t}\\text{ cm}$; plăcile hașurate sunt de culoare închisă. Ce fracție din pardoseală este acoperită cu plăci închise? Calculați aria pardoselii și aria acoperită cu plăci închise, în metri pătrați.`,
    solution: lines(
      `Sunt $${cols} \\cdot ${rows} = ${n}$ plăci, dintre care $${k}$ închise: fracția este $\\frac{${k}}{${n}}${frac(k, n) === `\\frac{${k}}{${n}}` ? '' : ` = ${frac(k, n)}`}$.`,
      `O placă are aria $${t} \\cdot ${t} = ${one}\\text{ cm}^2 = ${dx(one / 10000)}\\text{ m}^2$.`,
      show(`\\mathcal{A}_{\\text{pardoseala}} = ${n} \\cdot ${dx(one / 10000)} = ${dx((n * one) / 10000)}\\text{ m}^2, \\qquad \\mathcal{A}_{\\text{inchis}} = ${k} \\cdot ${dx(one / 10000)} = ${dx(darkCm / 10000)}\\text{ m}^2`),
    ),
    verify: () => same((darkCm / 10000) * n, (k * n * one) / 10000),
    fig: shadedGrid(cols, rows, randomCells(rng, cols, rows, k), 30),
  }
}

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d6-perimeter-figures', label: 'Perimetre pe figură', topic: 'Geometrie', joins: 'v-length-perimeter',
    forms: { 1: [courtyard, quadDiagonal], 2: [poolFence, lFieldPerimeter], 3: [] },
  },
  {
    id: 'v-d6-area-figures', label: 'Arii pe figură', topic: 'Geometrie', joins: 'v-area-units',
    forms: { 1: [gridShapeArea, squaresInRow], 2: [gardenAlleys, lFieldArea], 3: [squaresAB, gridShapeReal] },
  },
  {
    id: 'v-d6-volume-tables', label: 'Volume: tabele de completat', topic: 'Geometrie', joins: 'v-volume-units',
    forms: { 1: [], 2: [cuboidTable, cubeTable], 3: [] },
  },
  {
    id: 'v-d6-data', label: 'Tabele și diagrame', topic: 'Algebră', joins: 'v-statistics',
    forms: { 1: [gradesFrequency, chartMostLeast], 2: [gradesMean, chartMean], 3: [gradesPercent, chartPercent] },
  },
  {
    id: 'v-d6-angles', label: 'Unghiuri pe figură', topic: 'Geometrie', joins: 'v-angle-calc',
    forms: { 1: [supplementBOC, complementGED], 2: [lineTwoAngles, rightInsideObtuse], 3: [aroundPoint, lineBisector] },
  },
  {
    id: 'v-d6-count', label: 'Numărarea figurilor', topic: 'Geometrie', joins: 'v-count-figures',
    forms: { 1: [segmentsOnLine, linesThroughPoints], 2: [linesWithCollinear, anglesFromRays], 3: [rectanglesInGrid, squaresInGrid] },
  },
  {
    id: 'v-d6-number-line', label: 'Axa numerelor: lungimi', topic: 'Algebră', joins: 'v-number-line',
    forms: { 1: [rulerCm, tapeMetres], 2: [kmLine, midpointMetres], 3: [] },
  },
  {
    id: 'v-d6-fraction-figures', label: 'Fracții pe figuri', topic: 'Algebră', joins: 'v-fraction-figures',
    forms: { 1: [hatchedFraction, hatchedPercent], 2: [gardenBeds, tilesHatched], 3: [] },
  },
]

export const CONTEST: DrawnContest[] = []
