// Grade V forms with drawings, from Mate 2000+ Consolidare, grade V, part II, pp. 9–74 (photos 1–50 of
// `clasa5\sem2`, read again on 15 November 2026 for the exercises the first pass skipped because they need a figure):
// the number line with decimals (pp. 15–21: reading coordinates, tenths and hundredths, two labelled ticks,
// approximations of the points), the tables of decimal places (pp. 10–12), the tables of approximations and roundings
// (p. 18, ex. 27–28), the pyramid of means (p. 48, ex. 25) and the table of grades (p. 48, ex. 19).
// The levels follow the stars of the sections (Înțelegere * = 1, Aplicare ** = 2, Aprofundare *** and Supermate **** = 3).
// Every form names its page and exercise. The figures are drawn with figures5.ts; the pyramid is drawn here.
import type { Made } from './generators'
import type { DrawnContest, DrawnKind } from './grade5drawn'
import { numberLine, table } from './figures5'
import type { Fig, Pt } from '../models/figure'
import { de, frac, int, pick, shuffle, type Rng } from './tex'

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const P10 = (k: number) => 10 ** k
const near = (x: number, y: number) => Math.abs(x - y) < 1e-6
const list = (items: string[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : items[0])

/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** n / 10^k with the Romanian comma: D(235, 2) = 2{,}35; the zeros at the end are dropped. */
function D(n: number, k: number): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  const part = k > 0 ? s.slice(s.length - k).replace(/0+$/, '') : ''
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - k))) + (part ? `{,}${part}` : '')
}
/** n / 10^k keeping all k decimals, as an approximation is written: 19{,}10. */
function Dfix(n: number, k: number): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - k))) + (k > 0 ? `{,}${s.slice(s.length - k)}` : '')
}
/** The same number as it is written on a figure: 2,35. */
const plain = (tex: string) => tex.replace(/\{,\}/g, ',').replace(/\\,/g, '')

const NAMES = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H'], ['R', 'S', 'T', 'U'], ['X', 'Y', 'Z', 'W']]

/** count different whole positions in [lo, hi], not in `avoid`, at least `gap` apart, in increasing order. */
function spots(rng: Rng, lo: number, hi: number, count: number, avoid: number[] = [], gap = 1): number[] {
  const pool: number[] = []
  for (let v = lo; v <= hi; v++) if (!avoid.includes(v)) pool.push(v)
  for (let t = 0; t < 300; t++) {
    const s = shuffle(rng, pool).slice(0, count).sort((a, b) => a - b)
    if (s.every((v, i) => i === 0 || v - s[i - 1] >= gap)) return s
  }
  return pool.filter((_, i) => i % gap === 0).slice(0, count)
}

/** The number a point of a `numberLine` figure stands for, read back from its pixels (the helper's margins). */
const valueAt = (fig: Fig, name: string, from: number, to: number) => from + ((fig.p[name][0] - 14) / (fig.w - 24 - 14)) * (to - from)

/** "5 + 3 · 0,1" or "5 - 2 · 0,1": k ticks from a labelled number. */
const move = (ref: string, k: number, step: string) => (k >= 0 ? `${ref} + ${k} \\cdot ${step}` : `${ref} - ${-k} \\cdot ${step}`)
const side = (k: number) => (k >= 0 ? 'la dreapta' : 'la stânga')
const ticks = (k: number) => (Math.abs(k) === 1 ? 'o gradație' : `${Math.abs(k)} gradații`)

// ---------- the number line ----------

/** p. 17, ex. 11 a); p. 18, ex. 22 a): the line marked at two consecutive naturals, a tick every tenth. */
function nlReadTenths(rng: Rng): Made {
  const a = int(rng, 1, 40)
  const from = a * 10 - int(rng, 1, 3)
  const to = from + 15
  const names = pick(rng, NAMES).slice(0, 3)
  const at = spots(rng, from + 1, to - 1, 3, [a * 10, a * 10 + 10], 2)
  const fig = numberLine({ from: from / 10, to: to / 10, step: 0.1, labels: [a, a + 1], points: names.map((name, i) => ({ name, at: at[i] / 10 })) })
  const steps = names.map((name, i) => {
    const ref = at[i] > a * 10 + 10 ? a + 1 : a
    const k = at[i] - ref * 10
    return `$${name}$ este la ${ticks(k)} ${side(k)} lui $${ref}$: $${move(String(ref), k, '0{,}1')} = ${D(at[i], 1)}$, deci $${name}(${D(at[i], 1)})$.`
  })
  return {
    text: `Pe axa numerelor din figură sunt scrise numerele naturale $${a}$ și $${a + 1}$, iar gradațiile sunt la distanțe egale. Precizați coordonatele punctelor ${list(names.map((n) => `$${n}$`))}.`,
    solution: lines(
      `Între $${a}$ și $${a + 1}$ sunt $10$ intervale egale, deci distanța dintre două gradații vecine este`,
      show(`1 : 10 = 0{,}1`),
      ...steps,
    ),
    verify: () => names.every((n, i) => near(valueAt(fig, n, from / 10, to / 10), at[i] / 10)) && at.every((v) => v > from && v < to),
    fig,
  }
}

/** p. 16, ex. 10; p. 21, V.1 a): which letter stands at a given number, and the number at a given letter. */
function nlWhichLetter(rng: Rng): Made {
  const a = int(rng, 0, 30)
  const from = a * 10 - int(rng, 0, 2)
  const to = from + 14
  const names = pick(rng, NAMES)
  const at = spots(rng, Math.max(from + 1, 1), to - 1, 4, [a * 10, a * 10 + 10], 2)
  const fig = numberLine({ from: from / 10, to: to / 10, step: 0.1, labels: [a, a + 1], points: names.map((name, i) => ({ name, at: at[i] / 10 })) })
  const [i, j] = shuffle(rng, [0, 1, 2, 3]).slice(0, 2)
  const say = (q: number) => {
    const ref = at[q] > a * 10 + 10 ? a + 1 : a
    return move(String(ref), at[q] - ref * 10, '0{,}1') + ` = ${D(at[q], 1)}`
  }
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub două dintre ele sunt scrise numerele $${a}$ și $${a + 1}$.`,
      `a) Care dintre punctele ${list(names.map((n) => `$${n}$`))} are coordonata $${D(at[i], 1)}$?`,
      `b) Ce coordonată are punctul $${names[j]}$?`,
    ),
    solution: lines(
      `O unitate este împărțită în $10$ părți egale, deci între două gradații vecine distanța este $0{,}1$.`,
      `a) Punctul $${names[i]}$, pentru că $${say(i)}$.`,
      `b) $${say(j)}$, deci $${names[j]}(${D(at[j], 1)})$.`,
    ),
    verify: () => near(valueAt(fig, names[i], from / 10, to / 10), at[i] / 10) && near(valueAt(fig, names[j], from / 10, to / 10), at[j] / 10) && i !== j,
    fig,
  }
}

/** p. 16, ex. 10; p. 17, ex. 20 a): from a marked point, a number of ticks to the right and to the left. */
function nlNextPoint(rng: Rng): Made {
  const a = int(rng, 1, 30)
  const from = a * 10 - int(rng, 1, 3)
  const to = from + 15
  const name = pick(rng, ['A', 'M', 'P', 'E'])
  const [pa] = spots(rng, from + 3, to - 3, 1, [a * 10, a * 10 + 10])
  const r = int(rng, 2, 9), l = int(rng, 2, 9)
  const fig = numberLine({ from: from / 10, to: to / 10, step: 0.1, labels: [a, a + 1], points: [{ name, at: pa / 10 }] })
  const ref = pa > a * 10 + 10 ? a + 1 : a
  const k = pa - ref * 10
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub două dintre ele sunt scrise numerele $${a}$ și $${a + 1}$.`,
      `a) Precizați coordonata punctului $${name}$.`,
      `b) Punctul $B$ se află cu ${ticks(r)} la dreapta lui $${name}$, iar punctul $C$ cu ${ticks(l)} la stânga lui $${name}$. Ce coordonate au $B$ și $C$?`,
    ),
    solution: lines(
      `Între $${a}$ și $${a + 1}$ sunt $10$ intervale egale, deci o gradație înseamnă $0{,}1$.`,
      `a) $${move(String(ref), k, '0{,}1')} = ${D(pa, 1)}$, deci $${name}(${D(pa, 1)})$.`,
      `b) ${show(`${D(pa, 1)} + ${r} \\cdot 0{,}1 = ${D(pa, 1)} + ${D(r, 1)} = ${D(pa + r, 1)}, \\qquad ${D(pa, 1)} - ${l} \\cdot 0{,}1 = ${D(pa, 1)} - ${D(l, 1)} = ${D(pa - l, 1)}`)}`,
      `Deci $B(${D(pa + r, 1)})$ și $C(${D(pa - l, 1)})$.`,
    ),
    verify: () => near(valueAt(fig, name, from / 10, to / 10), pa / 10) && pa - l >= 0,
    fig,
  }
}

/** p. 15, ex. 2–3 (theory); p. 16, ex. 2: between two tenths, a tick every hundredth. */
function nlHundredths(rng: Rng): Made {
  const t = int(rng, 11, 99)
  const from = t * 10 - int(rng, 1, 3)
  const to = from + 14
  const names = pick(rng, NAMES).slice(0, 2)
  const at = spots(rng, from + 1, to - 1, 2, [t * 10, t * 10 + 10], 3)
  const fig = numberLine({ from: from / 100, to: to / 100, step: 0.01, labels: [t / 10, (t + 1) / 10], points: names.map((name, i) => ({ name, at: at[i] / 100 })) })
  const say = (q: number) => {
    const ref = at[q] > t * 10 + 10 ? t + 1 : t
    return `${move(D(ref, 1), at[q] - ref * 10, '0{,}01')} = ${D(at[q], 2)}`
  }
  return {
    text: lines(
      `Pe axa numerelor din figură sunt scrise fracțiile zecimale $${D(t, 1)}$ și $${D(t + 1, 1)}$, iar gradațiile sunt la distanțe egale.`,
      `a) Precizați coordonatele punctelor $${names[0]}$ și $${names[1]}$.`,
      `b) Cu cât este mai mare coordonata lui $${names[1]}$ decât coordonata lui $${names[0]}$?`,
    ),
    solution: lines(
      `Distanța dintre $${D(t, 1)}$ și $${D(t + 1, 1)}$ este $0{,}1$, împărțită în $10$ intervale egale, deci o gradație înseamnă`,
      show(`0{,}1 : 10 = 0{,}01`),
      `a) $${say(0)}$ și $${say(1)}$, deci $${names[0]}(${D(at[0], 2)})$ și $${names[1]}(${D(at[1], 2)})$.`,
      `b) ${show(`${D(at[1], 2)} - ${D(at[0], 2)} = ${D(at[1] - at[0], 2)}`)}`,
      `(sunt $${at[1] - at[0]}$ gradații de câte $0{,}01$ între cele două puncte).`,
    ),
    verify: () => names.every((n, i) => near(valueAt(fig, n, from / 100, to / 100), at[i] / 100)) && at[1] > at[0],
    fig,
  }
}

/** p. 21, Testul 2, V.1 b)–c): only two ticks are labelled, not neighbours; the step is found first. */
function nlTwoLabels(rng: Rng): Made {
  const stepU = pick(rng, [5, 10, 20, 25, 50])
  const i = int(rng, 1, 3)
  const gap = int(rng, 3, 6)
  const j = i + gap
  const n = 14
  const L1 = stepU * int(rng, i + 1, i + 30)
  const L2 = L1 + gap * stepU
  const fromU = L1 - i * stepU
  const toU = fromU + n * stepU
  const names = pick(rng, NAMES).slice(0, 3)
  const idx = spots(rng, 1, n - 1, 3, [i, j], 2)
  const at = idx.map((q) => fromU + q * stepU)
  const fig = numberLine({ from: fromU / 100, to: toU / 100, step: stepU / 100, labels: [L1 / 100, L2 / 100], points: names.map((name, q) => ({ name, at: at[q] / 100 })) })
  const step = D(stepU, 2)
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub două dintre ele sunt scrise numerele $${D(L1, 2)}$ și $${D(L2, 2)}$.`,
      `a) Aflați distanța dintre două gradații vecine.`,
      `b) Precizați coordonatele punctelor ${list(names.map((x) => `$${x}$`))}.`,
    ),
    solution: lines(
      `a) Între $${D(L1, 2)}$ și $${D(L2, 2)}$ sunt $${gap}$ intervale egale, deci`,
      show(`(${D(L2, 2)} - ${D(L1, 2)}) : ${gap} = ${D(L2 - L1, 2)} : ${gap} = ${step}`),
      `b) Pornim de la $${D(L1, 2)}$ și numărăm gradațiile:`,
      ...names.map((x, q) => `$${x}$: $${move(D(L1, 2), idx[q] - i, step)} = ${D(at[q], 2)}$, deci $${x}(${D(at[q], 2)})$.`),
    ),
    verify: () => near((L2 - L1) / gap, stepU) && names.every((x, q) => near(valueAt(fig, x, fromU / 100, toU / 100), at[q] / 100)) && fromU >= 0,
    fig,
  }
}

/** p. 20, Testul 1, V.1 a) (0,25; 1,75; 2,75; 0,75 on the line): a unit cut in four, as decimals and as fractions. */
function nlQuarters(rng: Rng): Made {
  const a = int(rng, 0, 20)
  const names = pick(rng, NAMES).slice(0, 3)
  const idx = spots(rng, 1, 11, 3, [4, 8], 2)
  const fig = numberLine({ from: a, to: a + 3, step: 0.25, labels: [a, a + 1, a + 2, a + 3], points: names.map((name, q) => ({ name, at: a + idx[q] / 4 })) })
  const hund = idx.map((q) => a * 100 + q * 25)
  return {
    text: `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub unele dintre ele sunt scrise numerele naturale $${a}$, $${a + 1}$, $${a + 2}$ și $${a + 3}$. Precizați coordonatele punctelor ${list(names.map((x) => `$${x}$`))}, scrise ca fracții zecimale și ca fracții ordinare ireductibile.`,
    solution: lines(
      `Între două numere naturale consecutive sunt $4$ intervale egale, deci o gradație înseamnă`,
      show(`1 : 4 = 0{,}25 = \\frac{1}{4}`),
      ...names.map((x, q) => {
        const ref = a + Math.floor(idx[q] / 4)
        const k = idx[q] % 4
        return `$${x}$: $${ref} + ${k} \\cdot 0{,}25 = ${D(hund[q], 2)} = ${frac(4 * a + idx[q], 4)}$.`
      }),
    ),
    verify: () => names.every((x, q) => near(valueAt(fig, x, a, a + 3), hund[q] / 100)) && hund.every((h, q) => near(h / 100, (4 * a + idx[q]) / 4)),
    fig,
  }
}

/** p. 17, ex. 20; p. 24, V: two points, the distance between them and the number halfway. */
function nlDistanceMid(rng: Rng): Made {
  const a = int(rng, 1, 40)
  const from = a * 10 - int(rng, 1, 3)
  const to = from + 15
  const names = pick(rng, NAMES).slice(0, 2)
  const at = spots(rng, from + 1, to - 1, 2, [a * 10, a * 10 + 10], 3)
  const fig = numberLine({ from: from / 10, to: to / 10, step: 0.1, labels: [a, a + 1], points: names.map((name, i) => ({ name, at: at[i] / 10 })) })
  const [p, q] = at
  const mid = (p + q) * 5
  const say = (v: number) => {
    const ref = v > a * 10 + 10 ? a + 1 : a
    return `${move(String(ref), v - ref * 10, '0{,}1')} = ${D(v, 1)}`
  }
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub două dintre ele sunt scrise numerele $${a}$ și $${a + 1}$.`,
      `a) Precizați coordonatele punctelor $${names[0]}$ și $${names[1]}$.`,
      `b) Cât este distanța dintre punctele $${names[0]}$ și $${names[1]}$ (diferența coordonatelor)?`,
      `c) Ce număr se află pe axă exact la jumătatea distanței dintre $${names[0]}$ și $${names[1]}$?`,
    ),
    solution: lines(
      `O gradație înseamnă $1 : 10 = 0{,}1$.`,
      `a) $${say(p)}$ și $${say(q)}$, deci $${names[0]}(${D(p, 1)})$ și $${names[1]}(${D(q, 1)})$.`,
      `b) ${show(`${D(q, 1)} - ${D(p, 1)} = ${D(q - p, 1)}`)}`,
      `c) Numărul de la jumătate este media aritmetică a coordonatelor:`,
      show(`(${D(p, 1)} + ${D(q, 1)}) : 2 = ${D(p + q, 1)} : 2 = ${D(mid, 2)}`),
    ),
    verify: () => near(valueAt(fig, names[0], from / 10, to / 10), p / 10) && near(valueAt(fig, names[1], from / 10, to / 10), q / 10) && near(mid / 100, (p + q) / 20),
    fig,
  }
}

/** p. 18, ex. 22–23 a)–b): the coordinates of the points, then their approximations with one unit. */
function nlApproxUnit(rng: Rng): Made {
  const a = int(rng, 1, 40)
  const from = a * 10 - int(rng, 1, 2)
  const to = from + 22
  const names = pick(rng, NAMES)
  const at = spots(rng, from + 1, to - 1, 4, [a * 10, a * 10 + 10, a * 10 + 20], 3)
  const fig = numberLine({ from: from / 10, to: to / 10, step: 0.1, labels: [a, a + 1, a + 2], points: names.map((name, i) => ({ name, at: at[i] / 10 })) })
  const lo = at.map((v) => Math.floor(v / 10))
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub unele dintre ele sunt scrise numerele $${a}$, $${a + 1}$ și $${a + 2}$.`,
      `a) Precizați coordonatele punctelor ${list(names.map((x) => `$${x}$`))}.`,
      `b) Precizați aproximările prin lipsă și prin adaos cu o unitate ale acestor coordonate.`,
    ),
    solution: lines(
      `O unitate este împărțită în $10$ părți egale, deci o gradație înseamnă $0{,}1$.`,
      `a) ${names.map((x, i) => `$${x}(${D(at[i], 1)})$`).join(', ')}.`,
      `b) Aproximarea prin lipsă cu o unitate este numărul natural din stânga punctului, cea prin adaos numărul natural din dreapta lui:`,
      ...names.map((x, i) => `$${x}$: $${lo[i]} < ${D(at[i], 1)} < ${lo[i] + 1}$, prin lipsă $${lo[i]}$, prin adaos $${lo[i] + 1}$.`),
    ),
    verify: () => names.every((x, i) => near(valueAt(fig, x, from / 10, to / 10), at[i] / 10)) && at.every((v, i) => lo[i] * 10 < v && v < lo[i] * 10 + 10),
    fig,
  }
}

/** p. 18, ex. 23 c): on a line of hundredths, the approximations with one tenth and the rounding to tenths. */
function nlApproxTenth(rng: Rng): Made {
  const t = int(rng, 11, 99)
  const from = t * 10 - int(rng, 1, 4)
  const to = from + 20
  const names = pick(rng, NAMES).slice(0, 3)
  const at = spots(rng, from + 1, to - 1, 3, [t * 10, t * 10 + 10, t * 10 + 20], 3)
  const fig = numberLine({ from: from / 100, to: to / 100, step: 0.01, labels: [t / 10, (t + 1) / 10, (t + 2) / 10].filter((v) => v * 100 <= to + 1e-9), points: names.map((name, i) => ({ name, at: at[i] / 100 })) })
  const lo = at.map((v) => Math.floor(v / 10))
  const rd = at.map((v, i) => (v % 10 >= 5 ? lo[i] + 1 : lo[i]))
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub unele dintre ele sunt scrise fracțiile zecimale $${D(t, 1)}$ și $${D(t + 1, 1)}$.`,
      `a) Precizați coordonatele punctelor ${list(names.map((x) => `$${x}$`))}.`,
      `b) Scrieți aproximările prin lipsă și prin adaos cu o zecime ale acestor coordonate.`,
      `c) Rotunjiți coordonatele la zecimi.`,
    ),
    solution: lines(
      `Între două fracții cu o zecimală vecine sunt $10$ intervale, deci o gradație înseamnă $0{,}1 : 10 = 0{,}01$.`,
      `a) ${names.map((x, i) => `$${x}(${D(at[i], 2)})$`).join(', ')}.`,
      `b) ${names.map((x, i) => `$${x}$: $${Dfix(lo[i], 1)} < ${D(at[i], 2)} < ${Dfix(lo[i] + 1, 1)}$`).join('; ')}. Prin lipsă: ${lo.map((v) => `$${Dfix(v, 1)}$`).join(', ')}; prin adaos: ${lo.map((v) => `$${Dfix(v + 1, 1)}$`).join(', ')}.`,
      `c) Se privește cifra sutimilor: dacă este cel puțin $5$, rotunjim prin adaos, altfel prin lipsă: ${names.map((x, i) => `$${x}$: $${D(at[i], 2)} \\approx ${Dfix(rd[i], 1)}$`).join(', ')}.`,
    ),
    verify: () => names.every((x, i) => near(valueAt(fig, x, from / 100, to / 100), at[i] / 100)) && at.every((v, i) => v % 10 !== 0 && near(rd[i] / 10, Math.round(v / 10 + 1e-9) / 10)),
    fig,
  }
}

/** p. 17, ex. 20 b)–c); p. 22, V.1 b): how many decimals lie strictly between two points of the figure. */
function nlCountBetween(rng: Rng): Made {
  const t = int(rng, 11, 99)
  const from = t * 10 - int(rng, 1, 3)
  const to = from + 16
  const names = pick(rng, NAMES).slice(0, 2)
  const at = spots(rng, from + 1, to - 1, 2, [t * 10, t * 10 + 10], 4)
  const fig = numberLine({ from: from / 100, to: to / 100, step: 0.01, labels: [t / 10, (t + 1) / 10], points: names.map((name, i) => ({ name, at: at[i] / 100 })) })
  const [p, q] = at
  const inner: number[] = []
  for (let h = p + 1; h < q; h++) if (h % 10 !== 0) inner.push(h)
  const three = 9 * (q - p)
  return {
    text: lines(
      `Pe axa numerelor din figură gradațiile sunt la distanțe egale, iar sub două dintre ele sunt scrise fracțiile zecimale $${D(t, 1)}$ și $${D(t + 1, 1)}$.`,
      `a) Precizați coordonatele punctelor $${names[0]}$ și $${names[1]}$.`,
      `b) Câte fracții zecimale cu exact două zecimale (a doua zecimală nenulă) sunt cuprinse strict între coordonatele lui $${names[0]}$ și $${names[1]}$?`,
      `c) Câte fracții zecimale cu exact trei zecimale (a treia zecimală nenulă) sunt cuprinse strict între ele?`,
    ),
    solution: lines(
      `O gradație înseamnă $0{,}1 : 10 = 0{,}01$, deci $${names[0]}(${D(p, 2)})$ și $${names[1]}(${D(q, 2)})$ (punctul a).`,
      `b) Între ele sunt gradațiile de la $${D(p + 1, 2)}$ la $${D(q - 1, 2)}$, adică $${q - p - 1}$ numere cu cel mult două zecimale; le păstrăm pe cele cu a doua zecimală nenulă: ${inner.map((h) => `$${D(h, 2)}$`).join(', ')}, adică $${inner.length}$ numere.`,
      `c) Între două sutimi vecine, de exemplu între $${D(p, 2)}$ și $${D(p + 1, 2)}$, sunt $9$ numere cu exact trei zecimale ($${Dfix(p * 10 + 1, 3)}$, …, $${Dfix(p * 10 + 9, 3)}$). Între $${names[0]}$ și $${names[1]}$ sunt $${q - p}$ intervale de câte o sutime, deci`,
      show(`${q - p} \\cdot 9 = ${three}`),
    ),
    verify: () => {
      let c3 = 0
      for (let m = 10 * p + 1; m < 10 * q; m++) if (m % 10 !== 0) c3++
      return c3 === three && near(valueAt(fig, names[0], from / 100, to / 100), p / 100) && near(valueAt(fig, names[1], from / 100, to / 100), q / 100) && inner.length > 0
    },
    fig,
  }
}

// ---------- tables of decimal places ----------

const PLACES = ['mii', 'sute', 'zeci', 'unități', 'zecimi', 'sutimi', 'miimi']
const ORD: Record<number, string> = { 1: 'zecimilor', 2: 'sutimilor', 3: 'miimilor' }

/** A decimal n / 10^k: integer part of 1–4 digits, 1–3 decimals, the last one not zero. */
function decimal(rng: Rng, maxInt = 9999, kmin = 1): { n: number; k: number } {
  const k = int(rng, kmin, 3)
  const ip = int(rng, 1, maxInt)
  let f = int(rng, 0, P10(k) - 1)
  if (f % 10 === 0) f += int(rng, 1, 9)
  return { n: ip * P10(k) + f, k }
}
/** Its digits under PLACES (thousands to thousandths), '' above the first digit and beyond the decimals. */
function placeRow(n: number, k: number): string[] {
  const ip = Math.floor(n / P10(k))
  return PLACES.map((_, c) => {
    const e = 3 - c // the power of 10 of the column
    if (e >= 0) return P10(e) <= ip || e === 0 ? String(Math.floor(ip / P10(e)) % 10) : ''
    return -e <= k ? String(Math.floor(n / P10(k + e)) % 10) : ''
  })
}
const digitAt = (n: number, k: number, e: number) => Math.floor(n / P10(k + e)) % 10
const countOf = (n: number, k: number, d: number) => (d <= k ? Math.floor(n / P10(k - d)) : n * P10(d - k)) // the number of tenths (d = 1), hundredths…

/** p. 10, ex. 4; p. 12, ex. 12: the digits of two decimals in the table of places; the numbers and their parts. */
function placeTableRead(rng: Rng): Made {
  const x = decimal(rng), y = decimal(rng)
  const fig = table([['', ...PLACES], ['a)', ...placeRow(x.n, x.k)], ['b)', ...placeRow(y.n, y.k)]], { first: 34, cell: 50 })
  const d = int(rng, 1, 2)
  const e = -int(rng, 1, y.k)
  const m = int(rng, 1, 9), mk = int(rng, 1, 3)
  const kk = Math.max(mk, x.k)
  const more = x.n * P10(kk - x.k) + m * P10(kk - mk)
  const UNIT: Record<number, [string, string]> = { 1: ['zecime', 'zecimi'], 2: ['sutime', 'sutimi'], 3: ['miime', 'miimi'] }
  return {
    text: lines(
      `În tabelul din figură sunt scrise, pe ordine, cifrele a două fracții zecimale.`,
      `a) Scrieți cele două fracții zecimale.`,
      `b) Precizați numărul ${ORD[d]} primei fracții și cifra ${ORD[-e]} celei de-a doua.`,
      `c) Scrieți fracția zecimală cu $${m}$ ${UNIT[mk][m === 1 ? 0 : 1]} mai mare decât prima.`,
    ),
    solution: lines(
      `a) Virgula se pune între coloana unităților și coloana zecimilor: a) $${D(x.n, x.k)}$, b) $${D(y.n, y.k)}$.`,
      `b) Numărul ${ORD[d]} se citește de la prima cifră până la cifra ${ORD[d]}, fără virgulă:`,
      show(`${D(x.n, x.k)} = ${nr(countOf(x.n, x.k, d))} \\cdot ${frac(1, P10(d))} ${countOf(x.n, x.k, d) * P10(x.k - d) === x.n ? '' : '+ \\ldots'}`),
      `deci numărul ${ORD[d]} este $${nr(countOf(x.n, x.k, d))}$. Cifra ${ORD[-e]} numărului $${D(y.n, y.k)}$ este $${digitAt(y.n, y.k, e)}$.`,
      `c) ${show(`${D(x.n, x.k)} + ${D(m, mk)} = ${D(more, kk)}`)}`,
    ),
    verify: () => near(more / P10(kk), x.n / P10(x.k) + m / P10(mk)) && Number(placeRow(x.n, x.k).join('')) === x.n && countOf(x.n, x.k, d) === Math.floor((x.n / P10(x.k)) * P10(d) + 1e-9) && digitAt(y.n, y.k, e) === Number(placeRow(y.n, y.k)[3 - e]),
    fig,
  }
}

/** p. 11, ex. 10: the table of digits and numbers of tenths, hundredths, thousandths, to complete. */
function placeTableDigits(rng: Rng): Made {
  const xs = [decimal(rng, 999, 2), decimal(rng, 999, 2)]
  const rows = [['Fracția zecimală', ...xs.map((x) => plain(D(x.n, x.k)))]]
  const heads: [string, number, boolean][] = []
  for (const d of [1, 2, 3]) heads.push([`Cifra ${ORD[d]}`, d, false], [`Numărul ${ORD[d]}`, d, true])
  for (const [h] of heads) rows.push([h, '?', '?'])
  const val = (x: { n: number; k: number }, d: number, count: boolean) => (count ? countOf(x.n, x.k, d) : digitAt(x.n, x.k, -d))
  const fig = table(rows, { first: 150, cell: 80 })
  return {
    text: `Completați căsuțele cu „?” din tabelul alăturat: cifra și numărul zecimilor, sutimilor și miimilor fracțiilor zecimale $${D(xs[0].n, xs[0].k)}$ și $${D(xs[1].n, xs[1].k)}$.`,
    solution: lines(
      `Cifra ${ORD[1]}, ${ORD[2]}, ${ORD[3]} este prima, a doua, a treia cifră după virgulă; numărul lor se citește de la prima cifră până la acea cifră, fără virgulă (lipsa unei cifre înseamnă $0$).`,
      ...xs.map((x) => `$${D(x.n, x.k)}$: ${heads.map(([h, d, c]) => `${h.toLowerCase()} $${nr(val(x, d, c))}$`).join(', ')}.`),
    ),
    verify: () => xs.every((x) => heads.every(([, d, c]) => (c ? near(val(x, d, c), Math.floor((x.n * P10(d)) / P10(x.k) + 1e-9)) : val(x, d, c) === Math.floor((x.n * P10(d)) / P10(x.k)) % 10))),
    fig,
  }
}

/** p. 11, ex. 10, read the other way: the fractions from some of their digits and numbers. */
function placeTableReverse(rng: Rng): Made {
  const x = decimal(rng, 999, 3), y = decimal(rng, 999, 3)
  const ix = Math.floor(x.n / 1000)
  const fig = table([
    ['Fracția zecimală', '?', '?'],
    ['Partea întreagă', String(ix), '?'],
    ['Cifra zecimilor', String(digitAt(x.n, 3, -1)), '?'],
    ['Cifra sutimilor', String(digitAt(x.n, 3, -2)), '?'],
    ['Numărul sutimilor', '?', String(countOf(y.n, 3, 2))],
    ['Cifra miimilor', String(digitAt(x.n, 3, -3)), String(digitAt(y.n, 3, -3))],
  ], { first: 150, cell: 80 })
  return {
    text: `În tabelul alăturat, fiecare coloană descrie o fracție zecimală cu trei zecimale: prima are partea întreagă $${ix}$, a doua are numărul sutimilor $${nr(countOf(y.n, 3, 2))}$. Completați căsuțele cu „?”.`,
    solution: lines(
      `Prima coloană: partea întreagă $${ix}$, apoi cifrele zecimilor, sutimilor și miimilor $${digitAt(x.n, 3, -1)}$, $${digitAt(x.n, 3, -2)}$, $${digitAt(x.n, 3, -3)}$, deci fracția este $${D(x.n, 3)}$, iar numărul sutimilor ei este $${nr(countOf(x.n, 3, 2))}$.`,
      `A doua coloană: numărul sutimilor este $${nr(countOf(y.n, 3, 2))}$, adică $${D(countOf(y.n, 3, 2), 2)}$ întregi și sutimi; adăugăm cifra miimilor $${digitAt(y.n, 3, -3)}$:`,
      show(`${D(countOf(y.n, 3, 2), 2)} + ${digitAt(y.n, 3, -3)} \\cdot 0{,}001 = ${D(y.n, 3)}`),
      `Deci partea întreagă este $${Math.floor(y.n / 1000)}$, cifra zecimilor $${digitAt(y.n, 3, -1)}$, cifra sutimilor $${digitAt(y.n, 3, -2)}$.`,
    ),
    verify: () => ix * 1000 + digitAt(x.n, 3, -1) * 100 + digitAt(x.n, 3, -2) * 10 + digitAt(x.n, 3, -3) === x.n && countOf(y.n, 3, 2) * 10 + digitAt(y.n, 3, -3) === y.n,
    fig,
  }
}

/** p. 11, ex. 8; p. 12, ex. 16: the decimal, its whole and decimal parts and its decimal fraction, to complete. */
function partsTable(rng: Rng): Made {
  const xs = [decimal(rng, 999), decimal(rng, 999), decimal(rng, 999)]
  const ip = (x: { n: number; k: number }) => Math.floor(x.n / P10(x.k))
  const fp = (x: { n: number; k: number }) => x.n % P10(x.k)
  const ord = (x: { n: number; k: number }) => `${x.n}/${P10(x.k)}`
  const fig = table([
    ['Fracția zecimală', plain(D(xs[0].n, xs[0].k)), '?', '?'],
    ['Partea întreagă', '?', '?', String(ip(xs[2]))],
    ['Partea zecimală', '?', '?', plain(D(fp(xs[2]), xs[2].k))],
    ['Fracția ordinară', '?', ord(xs[1]), '?'],
  ], { first: 130, cell: 74 })
  const col = (x: { n: number; k: number }) => `$${D(x.n, x.k)} = ${ip(x)} + ${D(fp(x), x.k)} = \\frac{${x.n}}{${nr(P10(x.k))}}$`
  return {
    text: `Completați căsuțele cu „?” din tabelul alăturat (fracția ordinară se scrie cu numitorul $10$, $100$ sau $1000$, ca $\\frac{721}{100}$). Prima coloană este a fracției $${D(xs[0].n, xs[0].k)}$.`,
    solution: lines(
      `Prima coloană: ${col(xs[0])}.`,
      `A doua coloană: împărțim la $${nr(P10(xs[1].k))}$, adică mutăm virgula cu ${xs[1].k === 1 ? 'o poziție' : `${xs[1].k} poziții`} spre stânga: ${col(xs[1])}.`,
      `A treia coloană: adunăm partea întreagă și partea zecimală: ${col(xs[2])}.`,
    ),
    verify: () => xs.every((x) => near(ip(x) + fp(x) / P10(x.k), x.n / P10(x.k)) && fp(x) > 0),
    fig,
  }
}

/** p. 10, ex. 5: the decimal of the table written as a sum with the powers of 10. */
function placeTableExpand(rng: Rng): Made {
  const x = decimal(rng, 9999, 2)
  const fig = table([PLACES, placeRow(x.n, x.k)], { first: 50, cell: 50 })
  const add = int(rng, 1, 999)
  const terms: string[] = []
  for (let e = 3; e >= -x.k; e--) {
    const dgt = digitAt(x.n, x.k, e)
    if (!dgt || (e >= 0 && P10(e) > Math.floor(x.n / P10(x.k)))) continue
    if (e > 1) terms.push(`${dgt} \\cdot 10^{${e}}`)
    else if (e === 1) terms.push(`${dgt} \\cdot 10`)
    else if (e === 0) terms.push(String(dgt))
    else terms.push(e === -1 ? `\\frac{${dgt}}{10}` : `\\frac{${dgt}}{10^{${-e}}}`)
  }
  return {
    text: lines(
      `În tabelul din figură sunt scrise, pe ordine, cifrele unei fracții zecimale.`,
      `a) Scrieți fracția zecimală.`,
      `b) Scrieți-o ca sumă, folosind puterile lui $10$, după modelul $54\\,156{,}12 = 5 \\cdot 10^{4} + 4 \\cdot 10^{3} + 1 \\cdot 10^{2} + 5 \\cdot 10 + 6 + \\frac{1}{10} + \\frac{2}{10^{2}}$.`,
      `c) Calculați suma dintre această fracție și $${D(add, 2)}$.`,
    ),
    solution: lines(
      `a) Virgula se pune după cifra unităților: $${D(x.n, x.k)}$.`,
      `b) Fiecare cifră se înmulțește cu valoarea coloanei ei; cifrele $0$ nu se scriu:`,
      show(`${D(x.n, x.k)} = ${terms.join(' + ')}`),
      `c) ${show(`${D(x.n, x.k)} + ${D(add, 2)} = ${D(x.n * P10(3 - x.k) + add * 10, 3)}`)}`,
    ),
    verify: () => {
      let s = 0
      for (let e = 3; e >= -x.k; e--) s += digitAt(x.n, x.k, e) * P10(e + x.k)
      return s === x.n && terms.length > 0
    },
    fig,
  }
}

// ---------- tables of approximations and roundings ----------

/** A decimal with 3 or 4 decimals, the last not zero: every approximation of it is strict. */
function longDecimal(rng: Rng): { n: number; k: number } {
  const k = int(rng, 3, 4)
  let f = int(rng, 0, P10(k) - 1)
  if (f % 10 === 0) f += int(rng, 1, 9)
  return { n: int(rng, 1, 999) * P10(k) + f, k }
}

/** p. 18, ex. 27 (Supermate): the table of approximations by lack and by excess, after the model column. */
function approxTable(rng: Rng): Made {
  const xs = [longDecimal(rng), longDecimal(rng), longDecimal(rng)]
  const lack = (x: { n: number; k: number }, j: number) => Math.floor(x.n / P10(x.k - j))
  const rows: [string, number, boolean][] = []
  for (const j of [0, 1, 2]) for (const up of [false, true]) rows.push([`prin ${up ? 'adaos' : 'lipsă'}, ${j === 0 ? 'cu o unitate' : j === 1 ? 'cu o zecime' : 'cu o sutime'}`, j, up])
  const cell = (x: { n: number; k: number }, j: number, up: boolean) => Dfix(lack(x, j) + (up ? 1 : 0), j)
  const fig = table([
    ['Fracția zecimală', ...xs.map((x) => plain(D(x.n, x.k)))],
    ...rows.map(([h, j, up]) => [h, plain(cell(xs[0], j, up)), '?', '?']),
  ], { first: 160, cell: 70 })
  return {
    text: `Completați căsuțele cu „?” din tabelul alăturat, după modelul primei coloane, scrisă pentru $${D(xs[0].n, xs[0].k)}$: aproximările prin lipsă și prin adaos ale fracțiilor $${D(xs[1].n, xs[1].k)}$ și $${D(xs[2].n, xs[2].k)}$.`,
    solution: lines(
      `Aproximarea prin lipsă cu o unitate, o zecime, o sutime păstrează cifrele până la unități, zecimi, sutimi și le taie pe celelalte; cea prin adaos este cu o unitate, o zecime, o sutime mai mare (fracțiile au cifre nenule după acel loc).`,
      ...xs.slice(1).map((x) => `$${D(x.n, x.k)}$: ${[0, 1, 2].map((j) => `$${cell(x, j, false)} < ${D(x.n, x.k)} < ${cell(x, j, true)}$`).join(', ')}.`),
    ),
    verify: () => xs.every((x) => [0, 1, 2].every((j) => lack(x, j) * P10(x.k - j) < x.n && x.n < (lack(x, j) + 1) * P10(x.k - j))),
    fig,
  }
}

/** p. 18, ex. 28 (Supermate): the table of roundings to tens, units, tenths and hundredths. */
function roundTable(rng: Rng): Made {
  const xs = [longDecimal(rng), longDecimal(rng), longDecimal(rng)]
  /** rounded to 10^-j (j = -1: tens): [the value in units of 10^-max(j,0), its decimals]. */
  const round = (x: { n: number; k: number }, j: number): [number, number] => {
    const u = P10(x.k - j)
    const r = Math.floor(x.n / u) + (2 * (x.n % u) >= u ? 1 : 0)
    return j < 0 ? [r * 10, 0] : [r, j]
  }
  const places: [string, number][] = [['la zeci', -1], ['la unități', 0], ['la zecimi', 1], ['la sutimi', 2]]
  const cell = (x: { n: number; k: number }, j: number) => {
    const [v, d] = round(x, j)
    return Dfix(v, d)
  }
  const fig = table([
    ['Fracția zecimală', ...xs.map((x) => plain(D(x.n, x.k)))],
    ...places.map(([h, j]) => [`rotunjită ${h}`, plain(cell(xs[0], j)), '?', '?']),
  ], { first: 150, cell: 70 })
  const why = (x: { n: number; k: number }, j: number) => {
    const next = j < 0 ? digitAt(x.n, x.k, 0) : digitAt(x.n, x.k, -(j + 1))
    return `${places.find((p) => p[1] === j)![0]}: $${cell(x, j)}$ (cifra următoare este $${next}$${next >= 5 ? ', deci prin adaos' : ', deci prin lipsă'})`
  }
  return {
    text: `Completați căsuțele cu „?” din tabelul alăturat, după modelul primei coloane, scrisă pentru $${D(xs[0].n, xs[0].k)}$: rotunjirile fracțiilor $${D(xs[1].n, xs[1].k)}$ și $${D(xs[2].n, xs[2].k)}$.`,
    solution: lines(
      `La rotunjire privim cifra de după locul la care rotunjim: dacă este $5$ sau mai mare, aproximăm prin adaos, altfel prin lipsă.`,
      ...xs.slice(1).map((x) => `$${D(x.n, x.k)}$ — ${places.map(([, j]) => why(x, j)).join('; ')}.`),
    ),
    verify: () => xs.every((x) => places.every(([, j]) => {
      const [v, d] = round(x, j)
      return Math.abs(v / P10(d) - x.n / P10(x.k)) <= 0.5 * P10(-j) + 1e-9
    })),
    fig,
  }
}

// ---------- the arithmetic mean ----------

/** The pyramid of boxes: rows from the base up, each one box shorter; '' leaves a box empty. */
function pyramid(rows: string[][], bw = 64, bh = 28): Fig {
  const n = rows[0].length
  const w = n * bw, h = n * bh
  const path: NonNullable<Fig['path']> = []
  const t: NonNullable<Fig['t']> = []
  rows.forEach((row, r) => {
    const y = h - (r + 1) * bh
    row.forEach((s, i) => {
      const x = (r * bw) / 2 + i * bw
      path.push({ d: `M${x} ${y} h${bw} v${bh} h${-bw} Z` })
      if (s) t.push({ at: [x + bw / 2, y + bh / 2 + 4] as Pt, s, size: 12 })
    })
  })
  return { w, h, p: {}, path, t }
}

/** The rows of means above a base, in thousandths (the base numbers are natural). */
function meanRows(base: number[]): number[][] {
  const rows = [base.map((b) => b * 1000)]
  while (rows[rows.length - 1].length > 1) {
    const last = rows[rows.length - 1]
    rows.push(last.slice(1).map((v, i) => (last[i] + v) / 2))
  }
  return rows
}
const T3 = (v: number) => D(v, 3)

/** p. 48, ex. 25 (Supermate): each box holds the mean of the two below it; the number at the top. */
function meanPyramidTop(rng: Rng): Made {
  const size = pick(rng, [3, 4, 4])
  const base = Array.from({ length: size }, () => int(rng, 2, 60) * pick(rng, [1, 2, 4]))
  const rows = meanRows(base)
  const fig = pyramid(rows.map((row, r) => row.map((v) => (r === 0 ? plain(T3(v)) : r === rows.length - 1 ? '?' : ''))))
  const top = rows[rows.length - 1][0]
  return {
    text: `În figura alăturată, în fiecare căsuță se scrie media aritmetică a celor două numere situate în căsuțele de sub ea. Pe rândul de jos sunt numerele $${base.join('$, $')}$. Aflați numărul situat în vârful piramidei.`,
    solution: lines(
      ...rows.slice(1).map((row, r) => `Rândul ${r + 2} de jos: ${row.map((v, i) => `$(${T3(rows[r][i])} + ${T3(rows[r][i + 1])}) : 2 = ${T3(v)}$`).join(', ')}.`),
      `Numărul din vârf este $${T3(top)}$.`,
    ),
    verify: () => {
      const w = size === 3 ? [1, 2, 1] : [1, 3, 3, 1]
      return near((top * 2 ** (size - 1)) / 1000, base.reduce((s, b, i) => s + w[i] * b, 0))
    },
    fig,
  }
}

/** p. 48, ex. 25, read backwards: the top is known, one number of the base is missing. */
function meanPyramidMissing(rng: Rng): Made {
  const size = pick(rng, [3, 4])
  const base = Array.from({ length: size }, () => int(rng, 2, 99))
  const miss = int(rng, 0, size - 1)
  const rows = meanRows(base)
  const top = rows[rows.length - 1][0]
  const w = size === 3 ? [1, 2, 1] : [1, 3, 3, 1]
  const div = size === 3 ? 4 : 8
  const fig = pyramid(rows.map((row, r) => row.map((v, i) => (r === 0 ? (i === miss ? '?' : String(base[i])) : r === rows.length - 1 ? plain(T3(v)) : ''))))
  const letters = ['a', 'b', 'c', 'd'].slice(0, size)
  const known = base.reduce((s, b, i) => (i === miss ? s : s + w[i] * b), 0)
  const gen = `\\frac{${letters.map((l, i) => (w[i] === 1 ? l : `${w[i]}${l}`)).join(' + ')}}{${div}}`
  return {
    text: `În figura alăturată, în fiecare căsuță se scrie media aritmetică a celor două numere situate în căsuțele de sub ea. În vârful piramidei este numărul $${T3(top)}$, iar pe rândul de jos lipsește un număr. Aflați numărul care lipsește.`,
    solution: lines(
      `Notăm numerele de jos, de la stânga la dreapta, cu $${letters.join(', ')}$. ${size === 3
        ? `Pe rândul al doilea sunt $\\frac{a + b}{2}$ și $\\frac{b + c}{2}$, iar în vârf media lor:`
        : `Pe rândul al doilea sunt $\\frac{a + b}{2}$, $\\frac{b + c}{2}$, $\\frac{c + d}{2}$, pe al treilea $\\frac{a + 2b + c}{4}$ și $\\frac{b + 2c + d}{4}$, iar în vârf media lor:`}`,
      show(`${gen} = ${T3(top)}, \\quad \\text{deci} \\quad ${letters.map((l, i) => (w[i] === 1 ? l : `${w[i]}${l}`)).join(' + ')} = ${T3(top)} \\cdot ${div} = ${T3(top * div)}`),
      `Înlocuim numerele cunoscute (lipsește $${letters[miss]}$):`,
      show(`${w[miss] === 1 ? letters[miss] : `${w[miss]}${letters[miss]}`} = ${T3(top * div)} - ${known} = ${w[miss] * base[miss]}${w[miss] === 1 ? '' : `, \\quad ${letters[miss]} = ${w[miss] * base[miss]} : ${w[miss]} = ${base[miss]}`}`),
      `Numărul care lipsește este $${base[miss]}$.`,
    ),
    verify: () => near((top * div) / 1000, base.reduce((s, b, i) => s + w[i] * b, 0)) && (top * div) / 1000 - known === w[miss] * base[miss],
    fig,
  }
}

/** p. 48, ex. 19: the grades of a class in a table; the number of pupils and the mean of the class. */
function meanGradesTable(rng: Rng): Made {
  let grades: number[] = [4, 7, 8, 9, 10], counts: number[] = [3, 4, 6, 8, 4]
  for (let t = 0; t < 500; t++) {
    const g = shuffle(rng, [3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5).sort((a, b) => a - b)
    const c = g.map(() => int(rng, 1, 8))
    const n = c.reduce((s, v) => s + v, 0)
    const S = g.reduce((s, v, i) => s + v * c[i], 0)
    if (n >= 12 && (S * 100) % n === 0) {
      grades = g
      counts = c
      break
    }
  }
  const n = counts.reduce((s, v) => s + v, 0)
  const S = grades.reduce((s, v, i) => s + v * counts[i], 0)
  const fig = table([['Nota', ...grades.map(String)], ['Numărul de elevi', ...counts.map(String)]], { first: 130, cell: 44 })
  const cls = pick(rng, ['A', 'B', 'C', 'D', 'E'])
  const g0 = grades[int(rng, 1, 3)]
  let atLeast = 0
  grades.forEach((g, i) => { if (g >= g0) atLeast += counts[i] })
  return {
    text: lines(
      `În urma unui test de evaluare la matematică, elevii clasei a V-a ${cls} au obținut notele din tabelul alăturat.`,
      `a) Câți elevi au dat testul?`,
      `b) Calculați media clasei la acest test.`,
      `c) Câți elevi au luat cel puțin nota $${g0}$?`,
    ),
    solution: lines(
      `a) $${counts.join(' + ')} = ${n}$, deci au dat testul ${de(n)} elevi.`,
      `b) Suma tuturor notelor este`,
      show(`${grades.map((g, i) => `${counts[i]} \\cdot ${g}`).join(' + ')} = ${S}`),
      `Media clasei este`,
      show(`${S} : ${n} = ${D((S * 100) / n, 2)}`),
      `c) Au luat nota $${g0}$ sau mai mare: $${counts.filter((_, i) => grades[i] >= g0).join(' + ')} = ${atLeast}$, adică ${de(atLeast)} elevi.`,
    ),
    verify: () => Number.isInteger((S * 100) / n) && near(S / n, (S * 100) / n / 100) && atLeast === counts.reduce((s, c, i) => s + (grades[i] >= g0 ? c : 0), 0),
    fig,
  }
}

export const KINDS: DrawnKind[] = [
  {
    id: 'v-d4-number-line', label: 'Axa numerelor: fracții zecimale', topic: 'Algebră', joins: 'v-number-line',
    forms: {
      1: [nlReadTenths, nlWhichLetter, nlNextPoint],
      2: [nlHundredths, nlTwoLabels, nlQuarters, nlDistanceMid],
      3: [nlApproxUnit, nlApproxTenth, nlCountBetween],
    },
  },
  {
    id: 'v-d4-place-tables', label: 'Tabelul ordinelor unei fracții zecimale', topic: 'Algebră', joins: 'v-decimal-writing',
    forms: {
      1: [placeTableRead, placeTableDigits],
      2: [partsTable, placeTableExpand, placeTableReverse],
      3: [],
    },
  },
  {
    id: 'v-d4-approx-tables', label: 'Tabele de aproximări și rotunjiri', topic: 'Algebră', joins: 'v-decimal-order',
    forms: { 1: [], 2: [], 3: [approxTable, roundTable] },
  },
  {
    id: 'v-d4-mean-figures', label: 'Media aritmetică: piramida și tabelul de note', topic: 'Algebră', joins: 'v-mean-applied',
    forms: { 1: [], 2: [], 3: [meanPyramidTop, meanPyramidMissing, meanGradesTable] },
  },
]

export const CONTEST: DrawnContest[] = []
