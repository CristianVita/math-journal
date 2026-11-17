// Grade V forms WITH DRAWINGS from Mate 2000+ Consolidare, grade V part I, pp. 184–206 (the fraction tests, the
// recapitulation tests, "Probleme de matematică aplicată în viața cotidiană", "Probleme date la concursuri școlare"),
// photographed by the user on 14 November 2026. These pages are almost all calculation; the only exercises that rely
// on a picture are the tiled kitchen floor (p. 192, ex. 8, with its photo of square tiles), Creangă's loaves cut in
// three (p. 193, ex. 10, with its picture of the cut loaves) and the magic square (p. 203, ex. 4). The text-only versions
// of the first two exist in grade5book4.ts; here the pupil reads the numbers from the drawing.
// The levels follow the content (no stars on these pages). Every form names its page and exercise.
import type { Made } from './generators'
import type { DrawnContest, DrawnKind } from './grade5drawn'
import type { Fig } from '../models/figure'
import { table } from './figures5'
import { de, frac, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** A whole number in LaTeX, with thin spaces from 1 000 up. */
const nr = (n: number) => (String(Math.abs(n)).length < 4 ? String(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
/** A number in the prose: plain below 1 000, in a formula from 1 000 up. */
const N = (n: number) => (Math.abs(n) >= 1000 ? `$${nr(n)}$` : String(n))
/** A number before a noun in the prose: "19 plăci", "20 de plăci". */
const deN = (n: number) => N(n) + (de(n) === String(n) ? '' : ' de')
/** "de " after a formula that ends with the number. */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
const lei = (n: number) => (n === 1 ? '1 leu' : `${deN(n)} lei`)
type Q = [number, number]
/** A fraction, as a mixed number when it is improper: 3\frac{1}{8}. */
const M = (p: number, q: number) => {
  const [a, d] = reduce(p, q)
  if (d === 1 || a < d) return frac(a, d)
  const w = Math.floor(a / d)
  return `${w}\\frac{${a - w * d}}{${d}}`
}
/** The fraction as written, then simplified (and as a mixed number) when it changes. */
const R = (p: number, q: number) => {
  const raw = q === 1 ? String(p) : `\\frac{${p}}{${q}}`
  const f = frac(p, q)
  const m = M(p, q)
  return [raw, ...(f !== raw ? [f] : []), ...(m !== f ? [m] : [])].join(' = ')
}
const same = (a: Q, b: Q) => a[0] * b[1] === a[1] * b[0]

// ================= drawings =================

const f1 = (x: number) => Number(x.toFixed(1))

/**
 * The plan of a rectangular floor L × W (cm) covered with square tiles of side s, from the top left corner; the last
 * column and row are cut when s does not divide the side. `hatch(i, j)` hatches the tile in column i, row j.
 * `dims` writes the two sides of the floor; `tile` writes the side of the first tile above it.
 */
function floorPlan(o: { L: number; W: number; s: number; hatch?: (i: number, j: number) => boolean; dims?: boolean; tile?: boolean }): Fig {
  const { L, W, s } = o
  const k = Math.min(330 / L, 200 / W)
  const ox = o.dims ? 60 : 4
  const oy = o.tile ? 20 : 4
  const x = (cm: number) => f1(ox + cm * k)
  const y = (cm: number) => f1(oy + cm * k)
  const n = Math.ceil(L / s), m = Math.ceil(W / s)
  const path: NonNullable<Fig['path']> = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (!o.hatch?.(i, j)) continue
      const x0 = x(i * s), x1 = x(Math.min((i + 1) * s, L)), y0 = y(j * s), y1 = y(Math.min((j + 1) * s, W))
      path.push({ d: `M${x0} ${y0} H${x1} V${y1} H${x0} Z`, hatch: true })
    }
  }
  const grid: string[] = []
  for (let i = 1; i < n; i++) grid.push(`M${x(i * s)} ${y(0)} V${y(W)}`)
  for (let j = 1; j < m; j++) grid.push(`M${x(0)} ${y(j * s)} H${x(L)}`)
  if (grid.length) path.push({ d: grid.join(' ') })
  path.push({ d: `M${x(0)} ${y(0)} H${x(L)} V${y(W)} H${x(0)} Z` })
  const t: NonNullable<Fig['t']> = []
  if (o.dims) {
    t.push({ at: [x(L / 2), y(W) + 17], s: `${L} cm`, size: 12 })
    t.push({ at: [ox - 6, y(W / 2) + 4], s: `${W} cm`, anchor: 'end', size: 12 })
  }
  if (o.tile) {
    path.push({ d: `M${x(0)} ${oy - 6} H${x(s)} M${x(0)} ${oy - 9} V${oy - 3} M${x(s)} ${oy - 9} V${oy - 3}` })
    t.push({ at: [x(s) + 4, oy - 3], s: `${s} cm`, anchor: 'start', size: 10 })
  }
  return { w: Math.ceil(x(L) + 6), h: Math.ceil(y(W) + (o.dims ? 24 : 4)), p: {}, path, t }
}

/**
 * An L-shaped floor: the rectangle A × B (cm) without its top right corner a × b. The four given sides are written
 * on the figure: the bottom A, the left side B, and the two sides of the corner cut away (a across, b down).
 */
function lFloor(A: number, B: number, a: number, b: number): Fig {
  const k = Math.min(300 / A, 190 / B)
  const ox = 60, oy = 6
  const X = (cm: number) => f1(ox + cm * k)
  const Y = (cm: number) => f1(oy + (B - cm) * k) // y up in centimetres
  const d = `M${X(0)} ${Y(0)} H${X(A)} V${Y(B - b)} H${X(A - a)} V${Y(B)} H${X(0)} Z`
  return {
    w: Math.ceil(X(A) + 50), h: Math.ceil(Y(0) + 24), p: {},
    path: [{ d }],
    t: [
      { at: [X(A / 2), Y(0) + 17], s: `${A} cm`, size: 12 },
      { at: [ox - 6, Y(B / 2) + 4], s: `${B} cm`, anchor: 'end', size: 12 },
      { at: [X(A - a / 2), Y(B - b) - 6], s: `${a} cm`, size: 12 },
      { at: [X(A - a) + 5, Y(B - b / 2) + 4], s: `${b} cm`, anchor: 'start', size: 12 },
    ],
  }
}

/**
 * Loaves in rows, each loaf a rounded bar cut into k equal parts; in every row the first `hatched` parts (loaf after
 * loaf) are hatched. The row's name is written on its left.
 */
function loaves(rows: { name: string; n: number; hatched: number }[], k: number): Fig {
  const lw = Math.max(54, k * 11), lh = 26, gap = 9, r = 9
  const ox = rows.some((q) => q.name) ? 74 : 4
  const path: NonNullable<Fig['path']> = []
  const t: NonNullable<Fig['t']> = []
  const pw = lw / k
  rows.forEach((row, ri) => {
    const y0 = 6 + ri * (lh + 16), y1 = y0 + lh
    if (row.name) t.push({ at: [ox - 8, y0 + lh / 2 + 4], s: row.name, anchor: 'end', size: 12 })
    for (let l = 0; l < row.n; l++) {
      const x0 = ox + l * (lw + gap)
      for (let q = 0; q < k; q++) {
        const a = f1(x0 + q * pw), b = f1(x0 + (q + 1) * pw)
        let d: string
        if (q === 0) d = `M${f1(a + r)} ${y0} H${b} V${y1} H${f1(a + r)} A${r} ${r} 0 0 1 ${a} ${f1(y1 - r)} V${f1(y0 + r)} A${r} ${r} 0 0 1 ${f1(a + r)} ${y0} Z`
        else if (q === k - 1) d = `M${a} ${y0} H${f1(b - r)} A${r} ${r} 0 0 1 ${b} ${f1(y0 + r)} V${f1(y1 - r)} A${r} ${r} 0 0 1 ${f1(b - r)} ${y1} H${a} Z`
        else d = `M${a} ${y0} H${b} V${y1} H${a} Z`
        path.push({ d, hatch: l * k + q < row.hatched })
      }
    }
  })
  const most = Math.max(...rows.map((q) => q.n))
  return { w: Math.ceil(ox + most * (lw + gap)), h: Math.ceil(6 + rows.length * (lh + 16) - 6), p: {}, path, t }
}

// ================= tiles on a floor (p. 192, ex. 8) =================

const ROOMS = ['unui hol', 'unei bucătării', 'unei băi', 'unei terase', 'unei cămări', 'unui balcon']

/** The plan shows every tile and the side of one: count the tiles, find the sides of the floor, p. 192, ex. 8 a. */
export function tilesFromPlan(rng: Rng): Made {
  const n = int(rng, 4, 12), m = int(rng, 3, 7), s = pick(rng, [15, 20, 25, 30, 40, 50])
  const room = pick(rng, ROOMS)
  const L = n * s, W = m * s
  return {
    text: lines(
      `Figura alăturată arată planul pardoselii ${room}, acoperită exact cu plăci pătrate de gresie, cu latura de ${s} cm.`,
      'a) Câte plăci sunt pe lungime și câte pe lățime? Câte plăci s-au folosit în total?',
      'b) Aflați lungimea, lățimea și perimetrul pardoselii, în centimetri.',
    ),
    solution: lines(
      `a) Din figură: pe lungime sunt ${de(n)} plăci, pe lățime ${de(m)} plăci, deci în total`,
      show(`${n} \\cdot ${m} = ${n * m} \\text{ placi}`),
      `b) Lungimea: $${n} \\cdot ${s} = ${L}$ cm; lățimea: $${m} \\cdot ${s} = ${W}$ cm. Perimetrul:`,
      show(`P = 2 \\cdot (${L} + ${W}) = 2 \\cdot ${L + W} = ${nr(2 * (L + W))} \\text{ cm}`),
    ),
    verify: () => L / s === n && W / s === m && 2 * (L + W) === 2 * s * (n + m),
    fig: floorPlan({ L, W, s, tile: true }),
  }
}

/** Part of the floor is already tiled (hatched): how many tiles placed, how many left, what fraction, p. 192, ex. 8. */
export function tilesPlacedPart(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 5, 10), m = int(rng, 3, 6)
    const full = int(rng, 1, m - 1), more = int(rng, 0, n - 1)
    const placed = full * n + more
    const total = n * m
    if (placed >= total) continue
    const room = pick(rng, ROOMS)
    return {
      text: lines(
        `Un faianțar placează pardoseala ${room} cu plăci pătrate de gresie, ca în figura alăturată. Plăcile hașurate sunt cele pe care le-a pus deja.`,
        'a) Câte plăci a pus faianțarul și câte mai are de pus?',
        'b) Ce fracție din pardoseală a acoperit până acum? Ce fracție mai are de acoperit?',
      ),
      solution: lines(
        `a) Pardoseala are ${de(n)} plăci pe lungime și ${de(m)} pe lățime, adică $${n} \\cdot ${m} = ${total}$ ${deW(total)}plăci. Hașurate sunt ${full === 1 ? 'un rând întreg' : `${full} rânduri întregi`}${more === 1 ? ' și încă o placă' : more ? ` și încă ${de(more)} plăci` : ''}:`,
        show(`${full} \\cdot ${n}${more ? ` + ${more}` : ''} = ${placed} \\text{ placi puse}, \\qquad ${total} - ${placed} = ${total - placed} \\text{ placi de pus}`),
        `b) A acoperit $${R(placed, total)}$ din pardoseală și mai are de acoperit $${R(total - placed, total)}$.`,
      ),
      verify: () => same(reduce(placed, total), [placed, total]) && placed + (total - placed) === total && placed === full * n + more,
      fig: floorPlan({ L: n, W: m, s: 1, hatch: (i, j) => j < full || (j === full && i < more) }),
    }
  }
}

/** The tiles along the edge are dark (hatched): how many dark, how many light, with the sides written, p. 192, ex. 8. */
export function tilesBorder(rng: Rng): Made {
  const n = int(rng, 5, 12), m = int(rng, 4, 8), s = pick(rng, [20, 25, 30, 40, 50])
  const pd = int(rng, 3, 9), pl = int(rng, 2, pd - 1)
  const L = n * s, W = m * s
  const dark = 2 * (n + m) - 4, light = (n - 2) * (m - 2)
  const cost = dark * pd + light * pl
  return {
    text: lines(
      `Pardoseala dreptunghiulară din figura alăturată se acoperă exact cu plăci pătrate cu latura de ${s} cm. Plăcile de pe margine (hașurate) sunt închise la culoare, celelalte sunt deschise.`,
      `a) Câte plăci închise și câte plăci deschise sunt necesare?`,
      `b) O placă închisă costă ${lei(pd)}, iar una deschisă ${lei(pl)}. Cât costă toate plăcile?`,
    ),
    solution: lines(
      `a) Pe lungime încap $${L} : ${s} = ${n}$ plăci, iar pe lățime $${W} : ${s} = ${m}$ plăci. Pe margine sunt două rânduri de câte ${n} plăci și două coloane de câte ${m} plăci, dar cele 4 plăci din colțuri se numără de două ori:`,
      show(`2 \\cdot ${n} + 2 \\cdot ${m} - 4 = ${dark} \\text{ placi inchise}`),
      `Plăcile deschise formează un dreptunghi de $${n - 2} \\times ${m - 2}$ plăci: $${n - 2} \\cdot ${m - 2} = ${light}$ ${deW(light)}plăci deschise.`,
      `b) Costul: $${dark} \\cdot ${pd} + ${light} \\cdot ${pl} = ${dark * pd} + ${light * pl} = ${nr(cost)}$ ${deW(cost)}lei.`,
    ),
    verify: () => dark + light === n * m && cost === dark * pd + light * pl,
    fig: floorPlan({ L, W, s, dims: true, hatch: (i, j) => i === 0 || j === 0 || i === n - 1 || j === m - 1 }),
  }
}

/** The tiles do not fit exactly: the last ones are cut (hatched); whole, cut, bought tiles and boxes, p. 192, ex. 8 a–c. */
export function tilesCut(rng: Rng): Made {
  for (;;) {
    const s = pick(rng, [20, 25, 30, 40])
    const fn = int(rng, 5, 12), fm = int(rng, 3, 8)
    const rL = 5 * int(rng, 1, s / 5 - 1)
    const rW = rng() < 0.6 ? 5 * int(rng, 1, s / 5 - 1) : 0
    const L = fn * s + rL, W = fm * s + rW
    if (W >= L) continue
    const n = Math.ceil(L / s), m = Math.ceil(W / s)
    const whole = fn * fm, total = n * m, cut = total - whole
    const k = pick(rng, [4, 5, 6, 8, 10])
    const boxes = Math.ceil(total / k)
    const side = (len: number, q: number, rest: number) =>
      rest ? `$${len} = ${q} \\cdot ${s} + ${rest}$, deci încap ${de(q)} plăci întregi și încă una tăiată` : `$${len} : ${s} = ${q}$, deci încap exact ${de(q)} plăci`
    return {
      text: lines(
        `Pardoseala din figura alăturată se acoperă cu plăci pătrate de gresie cu latura de ${s} cm, așezate din colțul din stânga sus. Plăcile hașurate trebuie tăiate, pentru că depășesc pardoseala.`,
        'a) Câte plăci rămân întregi și câte se taie?',
        `b) Plăcile se vând în cutii de câte ${k}. Câte cutii trebuie cumpărate, dacă din fiecare placă tăiată se folosește o singură bucată?`,
      ),
      solution: lines(
        `a) Pe lungime: ${side(L, fn, rL)}. Pe lățime: ${side(W, fm, rW)}.`,
        `Se folosesc $${n} \\cdot ${m} = ${total}$ ${deW(total)}plăci, dintre care întregi sunt $${fn} \\cdot ${fm} = ${whole}$, iar tăiate $${total} - ${whole} = ${cut}$.`,
        `b) ${total % k === 0 ? `$${total} : ${k} = ${boxes}$, deci sunt necesare ${de(boxes)} cutii.` : `$${total} : ${k} = ${Math.floor(total / k)}$ rest ${total % k}, deci sunt necesare ${de(boxes)} cutii (ultima nu se folosește toată).`}`,
      ),
      verify: () => total === Math.ceil(L / s) * Math.ceil(W / s) && whole === Math.floor(L / s) * Math.floor(W / s) && boxes * k >= total && (boxes - 1) * k < total && cut > 0,
      fig: floorPlan({ L, W, s, dims: true, hatch: (i, j) => i >= fn || j >= fm }),
    }
  }
}

/** A chessboard of dark (hatched) and light tiles, the corner dark: count each colour and the boxes, p. 192, ex. 8. */
export function tilesChessboard(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 5, 12), m = int(rng, 3, 8), s = pick(rng, [20, 25, 30, 40, 50])
    if ((n * m) % 2 === 0 && rng() < 0.4) continue // the odd boards more often: there the colours differ
    const k = pick(rng, [4, 5, 6, 8, 10])
    const L = n * s, W = m * s
    const total = n * m, dark = Math.ceil(total / 2), light = total - dark
    const bd = Math.ceil(dark / k), bl = Math.ceil(light / k)
    const boxes = (c: number, b: number) => (c % k === 0 ? `$${c} : ${k} = ${b}$` : `$${c} : ${k} = ${Math.floor(c / k)}$ rest ${c % k}, deci ${b}`)
    return {
      text: lines(
        `Pardoseala din figura alăturată se acoperă exact cu plăci pătrate cu latura de ${s} cm, închise (hașurate) și deschise, așezate ca pe tabla de șah; placa din colțul din stânga sus este închisă.`,
        'a) Câte plăci închise și câte plăci deschise sunt necesare?',
        `b) Plăcile de fiecare culoare se vând în cutii de câte ${k}. Câte cutii de fiecare culoare trebuie cumpărate?`,
      ),
      solution: lines(
        `a) Pe lungime încap $${L} : ${s} = ${n}$ plăci, pe lățime $${W} : ${s} = ${m}$ plăci, în total $${n} \\cdot ${m} = ${total}$ ${deW(total)}plăci.`,
        total % 2 === 0
          ? `Culorile alternează și numărul plăcilor este par, deci jumătate sunt închise: $${total} : 2 = ${dark}$ plăci închise și ${de(light)} plăci deschise.`
          : `Culorile alternează, iar numărul plăcilor este impar; cum placa din colț (cu care începe numărarea) este închisă, plăcile închise sunt cu una mai multe: $(${total} + 1) : 2 = ${dark}$ închise și $${total} - ${dark} = ${light}$ deschise.`,
        `b) Închise: ${boxes(dark, bd)} cutii. Deschise: ${boxes(light, bl)} cutii.`,
      ),
      verify: () => {
        let d = 0
        for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if ((i + j) % 2 === 0) d++
        return d === dark && total - d === light && bd * k >= dark && (bd - 1) * k < dark && bl * k >= light && (bl - 1) * k < light
      },
      fig: floorPlan({ L, W, s, dims: true, hatch: (i, j) => (i + j) % 2 === 0 }),
    }
  }
}

/** An L-shaped floor with its sides written: the largest square tile that covers it exactly, how many, p. 192, ex. 8 c. */
export function tilesLShape(rng: Rng): Made {
  for (;;) {
    const g = pick(rng, [10, 15, 20, 25, 30, 40, 45, 50, 60])
    const A = g * int(rng, 6, 14), B = g * int(rng, 4, 10)
    if (B > 0.8 * A || A > 720 || B > 520) continue
    const a = g * int(rng, 2, A / g - 2), b = g * int(rng, 2, B / g - 2)
    const G = gcd(gcd(A, B), gcd(a, b))
    const lo = 5, hi = pick(rng, [20, 25, 30, 40, 50])
    const cands: number[] = []
    for (let d = lo; d <= hi; d++) if (G % d === 0) cands.push(d)
    if (!cands.length) continue
    const s = cands[cands.length - 1]
    const area = A * B - a * b
    const count = area / (s * s)
    const divs: number[] = []
    for (let d = 1; d <= G; d++) if (G % d === 0) divs.push(d)
    return {
      text: `Pardoseala unei camere are forma din figura alăturată (un dreptunghi din care lipsește un colț dreptunghiular), cu dimensiunile scrise pe figură: ${A} cm și ${B} cm, iar colțul lipsă are ${a} cm pe ${b} cm. Ea trebuie acoperită exact, fără tăieturi, cu plăci pătrate de gresie, toate la fel, cu latura un număr natural de centimetri cuprins între ${lo} cm și ${hi} cm, cât mai mare. Aflați latura plăcii și câte plăci sunt necesare.`,
      solution: lines(
        `Latura plăcii trebuie să dividă toate laturile pardoselii: ${A}, ${B}, ${a}, ${b} (și deci și pe celelalte două, $${A} - ${a} = ${A - a}$ și $${B} - ${b} = ${B - b}$). Cel mai mare divizor comun al lor este ${G}, iar divizorii lui ${G} sunt`,
        show(`${divs.join(',\\ ')}`),
        `Cel mai mare dintre ei cuprins între ${lo} și ${hi} este ${s}, deci placa are latura de ${s} cm.`,
        `Aria pardoselii este aria dreptunghiului mare minus aria colțului lipsă:`,
        show(`${A} \\cdot ${B} - ${a} \\cdot ${b} = ${nr(A * B)} - ${nr(a * b)} = ${nr(area)} \\text{ cm}^2`),
        `O placă are aria $${s} \\cdot ${s} = ${nr(s * s)}\\text{ cm}^2$, deci sunt necesare $${nr(area)} : ${nr(s * s)} = ${nr(count)}$ ${deW(count)}plăci.`,
      ),
      verify: () => [A, B, a, b, A - a, B - b].every((x) => x % s === 0) && !cands.some((c) => c > s) && Number.isInteger(count) && count === (A / s) * (B / s) - (a / s) * (b / s),
      fig: lFloor(A, B, a, b),
    }
  }
}

// ================= loaves cut into equal parts (p. 193, ex. 10) =================

const PARTS: Record<number, string> = { 2: 'două', 3: 'trei', 4: 'patru', 5: 'cinci', 6: 'șase' }
const WHO = [
  ['Mama', 'membrii familiei'], ['Bunica', 'nepoți'], ['Brutarul', 'clienți'], ['Doamna învățătoare', 'elevi'], ['Bucătarul', 'oaspeți'],
]

/** Loaves cut into k parts, the eaten parts hatched: a part, the loaves eaten, the fraction of all, p. 193, ex. 10. */
export function loavesEaten(rng: Rng): Made {
  const n = int(rng, 2, 5), k = int(rng, 2, 6)
  const h = int(rng, 1, n * k - 1)
  const [who, ate] = pick(rng, WHO)
  return {
    text: lines(
      `${who} a tăiat ${n === 2 ? 'două pâini' : `${n} pâini`} la fel în câte ${PARTS[k]} părți egale, ca în figura alăturată. Părțile hașurate au fost mâncate de ${ate}.`,
      'a) Ce fracție dintr-o pâine este o parte?',
      'b) Câtă pâine s-a mâncat? Scrieți ca fracție de pâine.',
      'c) Ce fracție din toată pâinea s-a mâncat?',
    ),
    solution: lines(
      `a) O pâine are ${PARTS[k]} părți egale, deci o parte este $\\frac{1}{${k}}$ dintr-o pâine.`,
      `b) ${h === 1 ? 'Este hașurată o parte' : `Sunt hașurate ${h} părți`}, deci s-a mâncat (în pâini):`,
      show(`${h} \\cdot \\frac{1}{${k}} = ${R(h, k)}`),
      `c) În total sunt $${n} \\cdot ${k} = ${n * k}$ părți, dintre care s-au mâncat ${h}: $${R(h, n * k)}$ din toată pâinea.`,
    ),
    verify: () => { const [p, q] = reduce(h, n * k); return p * n * k === h * q && h < n * k },
    fig: loaves([{ name: '', n, hatched: h }], k),
  }
}

/** The same picture, asked from the other side: the parts left, the loaves left, the fraction left, p. 193, ex. 10. */
export function loavesLeft(rng: Rng): Made {
  const n = int(rng, 2, 5), k = int(rng, 2, 6)
  const h = int(rng, 1, n * k - 1)
  const left = n * k - h
  return {
    text: lines(
      `Pe masă erau ${n === 2 ? 'două pâini' : `${n} pâini`}, fiecare tăiată în ${PARTS[k]} felii egale (figura alăturată). Feliile hașurate s-au mâncat la prânz.`,
      'a) Câte felii au rămas?',
      'b) Câte pâini au rămas, scris ca fracție (sau ca număr mixt)?',
      'c) Ce fracție din toată pâinea a rămas?',
    ),
    solution: lines(
      `a) În total sunt $${n} \\cdot ${k} = ${n * k}$ felii, dintre care hașurate ${h}. Au rămas $${n * k} - ${h} = ${left}$ felii.`,
      `b) O felie este $\\frac{1}{${k}}$ dintr-o pâine, deci au rămas (în pâini):`,
      show(`${left} \\cdot \\frac{1}{${k}} = ${R(left, k)}`),
      `c) Din toată pâinea a rămas $${R(left, n * k)}$.`,
    ),
    verify: () => { const [p, q] = reduce(left, n * k); return left + h === n * k && p * n * k === left * q },
    fig: loaves([{ name: '', n, hatched: h }], k),
  }
}

const TRAVELLERS = [['Ion', 'Gheorghe'], ['Vasile', 'Petre'], ['Toma', 'Andrei'], ['Radu', 'Mihai']]

/** a and b loaves (two rows), each cut in three, eaten equally by three: the parts each eats and gives, p. 193, ex. 10. */
export function loavesThreeShare(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6), b = int(rng, 1, a)
    if (2 * b <= a || (a + b) % 3 === 0 && rng() < 0.5) continue
    const [P, S] = pick(rng, TRAVELLERS)
    const parts = 3 * (a + b), each = a + b
    return {
      text: lines(
        `Doi drumeți, ${P} și ${S}, au pâinile din figura alăturată: ${P} are ${a} pâini, iar ${S} ${b === 1 ? 'o pâine' : `${b} pâini`}; fiecare pâine este tăiată în trei părți egale. Un al treilea drumeț, care nu are nimic de mâncare, este poftit la masă, iar cei trei mănâncă toate pâinile, fiecare la fel de mult.`,
        'a) Câte părți mănâncă fiecare drumeț? Cât reprezintă aceasta dintr-o pâine?',
        `b) Câte părți îi dă ${P} celui de-al treilea drumeț și câte îi dă ${S}?`,
      ),
      solution: lines(
        `a) ${P} are ${a === 1 ? 'o pâine' : `${a} pâini`}, adică ${3 * a} părți, iar ${S} are ${b === 1 ? 'o pâine' : `${b} pâini`}, adică ${3 * b} părți; în total $${3 * a} + ${3 * b} = ${parts}$ ${deW(parts)}părți. Fiecare mănâncă`,
        show(`${parts} : 3 = ${each} \\text{ parti} = ${each} \\cdot \\frac{1}{3} = ${R(each, 3)} \\text{ paini}`),
        `b) Din cele ${3 * a} părți ale sale, ${P} mănâncă ${each} și dă $${3 * a} - ${each} = ${2 * a - b}$; din cele ${3 * b} părți, ${S} mănâncă ${each} și dă $${3 * b} - ${each} = ${2 * b - a}$.`,
      ),
      verify: () => (2 * a - b) + (2 * b - a) === each && 3 * a - each === 2 * a - b,
      fig: loaves([{ name: P, n: a, hatched: 0 }, { name: S, n: b, hatched: 0 }], 3),
    }
  }
}

/** The parts the third traveller ate are hatched: what fraction of his bread each of the two gave, p. 193, ex. 10 b. */
export function loavesGivenFraction(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 7), b = int(rng, 1, a)
    if (2 * b <= a || a > 6 && b > 5) continue
    const [P, S] = pick(rng, TRAVELLERS)
    const ga = 2 * a - b, gb = 2 * b - a
    const sp = P, ss = S
    return {
      text: lines(
        `Figura alăturată arată pâinile a doi drumeți, ${sp} și ${ss}, tăiate fiecare în trei părți egale (${a} pâini, respectiv ${b === 1 ? 'o pâine' : `${b} pâini`}). Ei au împărțit pâinea cu un al treilea drumeț, iar părțile hașurate sunt cele mâncate de acesta.`,
        `a) Ce fracție din pâinea sa i-a dat ${sp} celui de-al treilea? Dar ${ss}?`,
        'b) Câtă pâine a mâncat al treilea drumeț? Arătați că toți trei au mâncat la fel de mult.',
      ),
      solution: lines(
        `a) ${sp} are $${a} \\cdot 3 = ${3 * a}$ părți, dintre care hașurate ${ga}: a dat $${R(ga, 3 * a)}$ din pâinea sa. ${ss} are $${b} \\cdot 3 = ${3 * b}$ părți, dintre care hașurate ${gb}: a dat $${R(gb, 3 * b)}$ din pâinea sa.`,
        `b) Al treilea a mâncat $${ga} + ${gb} = ${a + b}$ părți, adică $${R(a + b, 3)}$ pâini. ${sp} a mâncat $${3 * a} - ${ga} = ${a + b}$ părți, iar ${ss}, $${3 * b} - ${gb} = ${a + b}$ părți: toți trei au mâncat câte ${a + b} părți.`,
      ),
      verify: () => ga + gb === a + b && 3 * a - ga === a + b && 3 * b - gb === a + b && gb > 0,
      fig: loaves([{ name: P, n: a, hatched: ga }, { name: S, n: b, hatched: gb }], 3),
    }
  }
}

/** The picture suggests the fair split of the money the third traveller pays, p. 193, ex. 10 b–c. */
export function loavesFairMoney(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6), b = int(rng, 1, a)
    if (2 * b <= a) continue
    const u = int(rng, 1, 6)
    const money = u * (a + b)
    const ga = 2 * a - b, gb = 2 * b - a
    const [P, S] = pick(rng, TRAVELLERS)
    return {
      text: `${P} și ${S} au pâinile din figura alăturată, fiecare tăiată în trei părți egale. Ei mănâncă împreună cu un drumeț flămând, toți trei la fel de mult; părțile hașurate sunt cele mâncate de drumeț. La plecare, drumețul le lasă ${lei(money)}. Cum se împart banii în mod echitabil, după pâinea pe care i-a dat-o fiecare?`,
      solution: lines(
        `Din figură, drumețul a mâncat ${ga === 1 ? 'o parte' : `${ga} părți`} de la ${P} și ${gb === 1 ? 'o parte' : `${gb} părți`} de la ${S}, în total $${ga} + ${gb} = ${a + b}$ părți (verificare: fiecare mănâncă $3 \\cdot (${a} + ${b}) : 3 = ${a + b}$ părți).`,
        `O parte valorează`,
        show(`${money} : ${a + b} = ${u} \\text{ ${u === 1 ? 'leu' : 'lei'}}`),
        `${P} primește $${ga} \\cdot ${u} = ${ga * u}$ ${deW(ga * u)}${ga * u === 1 ? 'leu' : 'lei'}, iar ${S} primește $${gb} \\cdot ${u} = ${gb * u}$ ${deW(gb * u)}${gb * u === 1 ? 'leu' : 'lei'}.`,
      ),
      verify: () => ga * u + gb * u === money && (3 * a - (a + b)) * u === ga * u,
      fig: loaves([{ name: P, n: a, hatched: ga }, { name: S, n: b, hatched: gb }], 3),
    }
  }
}

/** The wrong split (by the loaves each had) against the fair one (by the parts each gave), p. 193, ex. 10 a–c. */
export function loavesNaiveSplit(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6), b = int(rng, 1, a - 1)
    if (2 * b <= a) continue
    const u = int(rng, 1, 6)
    const money = u * (a + b)
    const ga = 2 * a - b, gb = 2 * b - a
    const [P, S] = pick(rng, TRAVELLERS)
    return {
      text: lines(
        `${P} și ${S} au pâinile din figura alăturată, tăiate fiecare în trei părți egale, și le mănâncă împreună cu un drumeț, toți trei la fel de mult. Drumețul le lasă ${lei(money)}.`,
        `${S} propune să împartă banii după numărul de pâini avute: ${a} părți pentru ${P} și ${b} pentru ${S}. ${P} spune că banii trebuie împărțiți după pâinea dată drumețului.`,
        `a) Câți lei ar primi fiecare după propunerea lui ${S}?`,
        `b) Câți lei primește fiecare după împărțirea echitabilă? Cu câți lei mai mult primește ${P} astfel?`,
      ),
      solution: lines(
        `a) Banii se împart în $${a} + ${b} = ${a + b}$ părți egale de câte $${money} : ${a + b} = ${u}$ ${u === 1 ? 'leu' : 'lei'}: ${P} ar primi $${a} \\cdot ${u} = ${a * u}$, iar ${S} $${b} \\cdot ${u} = ${b * u}$ (lei).`,
        `b) Sunt $3 \\cdot ${a + b} = ${3 * (a + b)}$ părți de pâine, iar fiecare mănâncă $${3 * (a + b)} : 3 = ${a + b}$ părți. ${P} îi dă drumețului $${3 * a} - ${a + b} = ${ga}$ părți, iar ${S} $${3 * b} - ${a + b} = ${gb}$ ${gb === 1 ? 'parte' : 'părți'}. O parte valorează $${money} : ${a + b} = ${u}$ ${u === 1 ? 'leu' : 'lei'}:`,
        show(`\\text{${P}}: ${ga} \\cdot ${u} = ${ga * u}, \\qquad \\text{${S}}: ${gb} \\cdot ${u} = ${gb * u}`),
        `${P} primește cu $${ga * u} - ${a * u} = ${(ga - a) * u}$ ${deW((ga - a) * u)}${(ga - a) * u === 1 ? 'leu' : 'lei'} mai mult decât după prima propunere.`,
      ),
      verify: () => a * u + b * u === money && ga * u + gb * u === money && (ga - a) * u === (a - b) * u,
      fig: loaves([{ name: P, n: a, hatched: 0 }, { name: S, n: b, hatched: 0 }], 3),
    }
  }
}

// ================= the magic square (p. 203, ex. 4) =================

type Cell = [number, number]
interface Line { name: string; cells: Cell[] }
function magicLines(n: number): Line[] {
  const out: Line[] = []
  for (let r = 0; r < n; r++) out.push({ name: `linia ${r + 1}`, cells: Array.from({ length: n }, (_, c) => [r, c] as Cell) })
  for (let c = 0; c < n; c++) out.push({ name: `coloana ${c + 1}`, cells: Array.from({ length: n }, (_, r) => [r, c] as Cell) })
  out.push({ name: 'diagonala principală', cells: Array.from({ length: n }, (_, i) => [i, i] as Cell) })
  out.push({ name: 'diagonala secundară', cells: Array.from({ length: n }, (_, i) => [i, n - 1 - i] as Cell) })
  return out
}
const isMagic = (g: number[][]) => {
  const sums = magicLines(g.length).map((l) => l.cells.reduce((s, [r, c]) => s + g[r][c], 0))
  return sums.every((s) => s === sums[0]) && new Set(g.flat()).size === g.length ** 2
}
/** The 8 symmetries of the square. */
function symmetries(g: number[][]): number[][][] {
  const n = g.length
  const rot = (h: number[][]) => h.map((row, r) => row.map((_, c) => h[n - 1 - c][r]))
  const flip = (h: number[][]) => h.map((row) => [...row].reverse())
  const out: number[][][] = []
  let h = g
  for (let i = 0; i < 4; i++) { out.push(h, flip(h)); h = rot(h) }
  return out
}
const LO_SHU = [[2, 7, 6], [9, 5, 1], [4, 3, 8]]
const MAGIC3 = symmetries(LO_SHU)
/** 4 × 4 magic squares of 1…16: Dürer's and Franklin-like ones under the symmetries, the complement 17 − x and the
 * permutations of rows and columns at once that keep both diagonals. */
const MAGIC4: number[][][] = (() => {
  const bases = [
    [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]],
    [[1, 15, 14, 4], [12, 6, 7, 9], [8, 10, 11, 5], [13, 3, 2, 16]],
    [[7, 12, 1, 14], [2, 13, 8, 11], [16, 3, 10, 5], [9, 6, 15, 4]],
  ]
  const perms = [[0, 1, 2, 3], [1, 0, 3, 2], [0, 2, 1, 3], [2, 3, 0, 1], [3, 2, 1, 0], [1, 3, 0, 2], [2, 0, 3, 1], [3, 1, 2, 0]]
  const seen = new Set<string>()
  const out: number[][][] = []
  for (const b of bases) {
    for (const comp of [false, true]) {
      const g0 = comp ? b.map((r) => r.map((x) => 17 - x)) : b
      for (const p of perms) {
        const g1 = p.map((r) => p.map((c) => g0[r][c]))
        for (const g of symmetries(g1)) {
          const key = g.flat().join()
          if (!isMagic(g) || seen.has(key)) continue
          seen.add(key)
          out.push(g)
        }
      }
    }
  }
  return out
})()

/** Fills the hidden cells line by line (a line with one unknown); null when it gets stuck or no line is full. */
function solveMagic(g: number[][], hidden: boolean[][]): { first: Line; steps: { line: Line; cell: Cell }[] } | null {
  const n = g.length
  const known = hidden.map((r) => r.map((h) => !h))
  const ls = magicLines(n)
  const first = ls.find((l) => l.cells.every(([r, c]) => known[r][c]))
  if (!first) return null
  const steps: { line: Line; cell: Cell }[] = []
  for (;;) {
    const l = ls.find((q) => q.cells.filter(([r, c]) => !known[r][c]).length === 1)
    if (!l) break
    const cell = l.cells.find(([r, c]) => !known[r][c])!
    known[cell[0]][cell[1]] = true
    steps.push({ line: l, cell })
  }
  return known.every((r) => r.every(Boolean)) ? { first, steps } : null
}

function magicMade(rng: Rng, g: number[][], hide: number, text: (letters: string) => string): Made {
  const n = g.length
  for (;;) {
    const cells = shuffle(rng, Array.from({ length: n * n }, (_, i) => i)).slice(0, hide).sort((x, y) => x - y)
    const hidden = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => cells.includes(r * n + c)))
    const sol = solveMagic(g, hidden)
    if (!sol) continue
    const name: Record<string, string> = {}
    cells.forEach((i, k) => { name[`${Math.floor(i / n)},${i % n}`] = 'abcdefgh'[k] })
    const S = g[0].reduce((s, x) => s + x, 0)
    const shown = (r: number, c: number) => name[`${r},${c}`] ?? String(g[r][c])
    const known = hidden.map((row) => row.map((h) => !h))
    const steps = sol.steps.map(({ line, cell }) => {
      const others = line.cells.filter(([r, c]) => r !== cell[0] || c !== cell[1]).map(([r, c]) => g[r][c])
      known[cell[0]][cell[1]] = true
      const v = g[cell[0]][cell[1]]
      return `Pe ${line.name}: $${name[`${cell[0]},${cell[1]}`]} = ${S} - (${others.join(' + ')}) = ${S} - ${others.reduce((s, x) => s + x, 0)} = ${v}$.`
    })
    const letters = cells.map((_, k) => 'abcdefgh'[k])
    const rows = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => shown(r, c)))
    const firstVals = sol.first.cells.map(([r, c]) => g[r][c])
    return {
      text: `${text(`${letters.slice(0, -1).join(', ')} și ${letters[letters.length - 1]}`)} (Rând cu rând, în pătrat sunt scrise: ${rows.map((r) => r.join(', ')).join('; ')}.)`,
      solution: lines(
        `Toate liniile, coloanele și diagonalele au aceeași sumă. Pe ${sol.first.name} toate numerele sunt cunoscute, deci suma este`,
        show(`${firstVals.join(' + ')} = ${S}`),
        ...steps,
        `Verificare: toate cele ${2 * n + 2} sume sunt egale cu ${S}, iar numerele sunt diferite.`,
      ),
      verify: () => isMagic(g) && magicLines(n).every((l) => l.cells.reduce((s, [r, c]) => s + g[r][c], 0) === S),
      fig: table(rows, { cell: 38, first: 38 }),
    }
  }
}

/** A 3 × 3 magic square (Lo Shu, scaled and shifted) with some letters: find them, p. 203, ex. 4 (simpler). */
export function magicSquare3(rng: Rng): Made {
  const k = int(rng, 1, 6), m = int(rng, 0, 20)
  const g = pick(rng, MAGIC3).map((r) => r.map((x) => k * x + m))
  return magicMade(rng, g, int(rng, 4, 5), (l) =>
    `În pătratul din figura alăturată, suma numerelor de pe fiecare linie, de pe fiecare coloană și de pe fiecare diagonală este aceeași (pătrat magic). Aflați numerele ${l}.`)
}

/** A 4 × 4 magic square of 1…16 (or shifted) with letters in some cells: find them, p. 203, ex. 4. */
export function magicSquare4(rng: Rng): Made {
  const m = pick(rng, [0, 0, 0, 1, 2, 3, 5, 10])
  const g = pick(rng, MAGIC4).map((r) => r.map((x) => x + m))
  return magicMade(rng, g, int(rng, 6, 7), (l) =>
    `Completați pătratul magic din figura alăturată: numerele ${l} sunt naturale, toate numerele din pătrat sunt diferite, iar suma numerelor de pe fiecare linie, coloană și diagonală este aceeași. Aflați ${l}.`)
}

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d7-tiles', label: 'Plăci de gresie pe o pardoseală (planul desenat)', topic: 'Geometrie', joins: 'v-area-units',
    forms: { 1: [tilesFromPlan, tilesPlacedPart], 2: [tilesBorder, tilesCut], 3: [tilesChessboard, tilesLShape] },
  },
  {
    id: 'v-d7-loaves', label: 'Pâini tăiate în părți egale', topic: 'Algebră', joins: 'v-fraction-figures',
    forms: { 1: [loavesEaten, loavesLeft], 2: [loavesThreeShare, loavesGivenFraction], 3: [loavesFairMoney, loavesNaiveSplit] },
  },
]

export const CONTEST: DrawnContest[] = [
  { id: 'v-contest-d7-magic-square', label: 'Pătrate magice', forms: [magicSquare3, magicSquare4] },
]

