// Grade V forms from the second grade V workbook (the one "cu puișorul"), pp. 62–89, photographed by the user on
// 14 November 2026: decimals (4.2 comparing and approximating, 4.3 adding and subtracting, 4.4 multiplying, 4.5–4.6
// dividing and periodic decimals, 4.7 the arithmetic mean, 4.8 periodic decimals as fractions, 4.9 positive rationals,
// the tests on p. 73–74, 4.10 arithmetic methods, 4.11 data, 4.12 contest problems) and the beginning of geometry
// (5.1–5.7: points, lines, segments, angles, the axis of symmetry). The chapter on decimals began before p. 62 and the
// geometry chapter goes on after p. 89 (other photos).
// Every kind joins an existing grade V kind on the same subject; the levels follow the stars of the book (* = 1,
// ** = 2, *** = 3), unmarked items by content. Every form names its page and exercise.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  /** 'v-…', unique */
  id: string
  /** Romanian, shown in the interface (ignored when the kind joins another) */
  label: string
  topic: 'Algebră' | 'Geometrie'
  /** an existing kind whose forms these are appended to */
  joins?: string
  /** level 1 easy, 2 medium, 3 hard */
  forms: Record<1 | 2 | 3, Form[]>
}
/** contest level only */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

// ---------------------------------------------------------------- helpers

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const P10 = (k: number) => 10 ** k
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const close = (x: number, y: number) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))
const L = 'abcdefgh'
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b

/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** n / 10^k with the Romanian comma; the zeros at the end are dropped unless `keep`. */
function D(n: number, k: number, keep = false): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  let part = k > 0 ? s.slice(s.length - k) : ''
  if (!keep) part = part.replace(/0+$/, '')
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - k))) + (part ? `{,}${part}` : '')
}
/** A sum of money given in bani: "73 de lei" or "$47{,}50$ lei". */
const lei = (b: number) => (b % 100 === 0 ? `${de(b / 100)} lei` : `$${D(b, 2, true)}$ lei`)
/** The same inside a formula. */
const leiM = (b: number) => (b % 100 === 0 ? nr(b / 100) : D(b, 2, true))

/** An exact decimal n / 10^k. */
interface Q { n: number; k: number }
function norm(n: number, k = 0): Q {
  while (k > 0 && n % 10 === 0) {
    n /= 10
    k--
  }
  return { n, k }
}
const T = (x: Q) => D(x.n, x.k)
const V = (x: Q) => x.n / P10(x.k)
const up = (x: Q, k: number) => x.n * P10(k - x.k)
const addQ = (a: Q, b: Q) => {
  const k = Math.max(a.k, b.k)
  return norm(up(a, k) + up(b, k), k)
}
const subQ = (a: Q, b: Q) => addQ(a, { n: -b.n, k: b.k })
const mulQ = (a: Q, b: Q) => norm(a.n * b.n, a.k + b.k)
/** A random decimal: a whole number of 10^-k from lo to hi. */
const rq = (rng: Rng, lo: number, hi: number, k: number) => norm(int(rng, lo, hi), k)
/** A random decimal that really has k decimals (the last one is not 0). */
const rqk = (rng: Rng, lo: number, hi: number, k: number) => {
  for (;;) {
    const n = int(rng, lo, hi)
    if (k === 0 || n % 10 !== 0) return norm(n, k)
  }
}

/** p/q (positive) as a finite or periodic decimal: 2{,}1(6). */
function ratTex(p: number, q: number): string {
  ;[p, q] = reduce(p, q)
  const ip = Math.floor(p / q)
  let r = p % q
  const digits: number[] = []
  const seen = new Map<number, number>()
  while (r !== 0 && !seen.has(r)) {
    seen.set(r, digits.length)
    r *= 10
    digits.push(Math.floor(r / q))
    r %= q
  }
  if (digits.length === 0) return nr(ip)
  if (r === 0) return `${nr(ip)}{,}${digits.join('')}`
  const s = seen.get(r)!
  return `${nr(ip)}{,}${digits.slice(0, s).join('')}(${digits.slice(s).join('')})`
}
/** The parts of a decimal written like 2{,}1(6): whole part, the digits before the period, the period. */
function splitDec(t: string): [number, string, string] {
  const m = /^(\d+)(?:\{,\}(\d*)(?:\((\d+)\))?)?$/.exec(t.replace(/\\,/g, ''))
  if (!m) throw new Error(`not a decimal: ${t}`)
  return [Number(m[1]), m[2] ?? '', m[3] ?? '']
}
/** The value of such a decimal, as a reduced fraction [p, q]. */
function parseDec(t: string): [number, number] {
  const [w, a, per] = splitDec(t)
  const qa = P10(a.length)
  if (!per) return reduce(w * qa + Number(a || 0), qa)
  const qp = (P10(per.length) - 1) * qa
  return reduce(w * qp + Number(a || 0) * (P10(per.length) - 1) + Number(per), qp)
}
const decVal = (t: string) => {
  const [p, q] = parseDec(t)
  return p / q
}
/** The first n decimals of p/q, followed by … when it goes on. */
function expand(p: number, q: number, n: number): string {
  const ip = Math.floor(p / q)
  let r = p % q
  let s = ''
  for (let i = 0; i < n && r !== 0; i++) {
    r *= 10
    s += Math.floor(r / q)
    r %= q
  }
  return `${nr(ip)}${s ? `{,}${s}` : ''}${r !== 0 ? '\\ldots' : ''}`
}
/** A periodic decimal turned into an ordinary fraction, by the rule from school. */
function perToFrac(t: string): string {
  const [w, pre, per] = splitDec(t)
  if (!per) return `${t} = ${frac(w * P10(pre.length) + Number(pre || 0), P10(pre.length))}`
  const den = Number('9'.repeat(per.length) + '0'.repeat(pre.length))
  const num = Number(pre + per) - Number(pre || 0)
  const top = pre ? `\\frac{${Number(pre + per)} - ${Number(pre)}}{${den}}` : `\\frac{${Number(per)}}{${den}}`
  const end = frac(w * den + num, den)
  return `${t} = ${w ? w : ''}${top}${!w && end === top ? '' : ` = ${end}`}`
}
/** p/q as a mixed number when it is larger than 1: 2\frac{1}{3}. */
const mixed = (p: number, q: number) => {
  const [a, b] = reduce(p, q)
  return a > b && b > 1 ? `${Math.floor(a / b)}\\frac{${a % b}}{${b}}` : frac(a, b)
}
/** "<", ">" or "=" between two fractions. */
const cmp = (a: [number, number], b: [number, number]) => {
  const d = a[0] * b[1] - b[0] * a[1]
  return d < 0 ? '<' : d > 0 ? '>' : '='
}

const NAMES = ['Ana', 'Maria', 'Ioana', 'Elena', 'Sara', 'Mihai', 'Andrei', 'Radu', 'Vlad', 'Tudor', 'Luca', 'Dan']
/** ∢AOB */
const ang = (name: string) => `\\sphericalangle ${name}`
/** an angle given in minutes: 43°20' */
const dm = (m: number) => {
  const d = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${d}^\\circ` : d === 0 ? `${r}'` : `${d}^\\circ ${r}'`
}

// ================= 4.2 comparing, ordering, approximating (p. 62, 66–67, 72) → v-decimal-order =================

/** An ordinary fraction against a decimal, p. 62, ex. 1 f–h. */
export function ordFracVsDec(rng: Rng): Made {
  const used: number[] = []
  const items = Array.from({ length: 3 }, () => {
    for (;;) {
      const q = pick(rng, [2, 4, 5, 8, 20, 25])
      const p = int(rng, 1, 5 * q)
      if (p % q === 0 || gcd(p, q) !== 1) continue
      const v = (p * 1000) / q
      const w = v + pick(rng, [0, 0, 10 * int(rng, -9, 9), int(rng, -9, 9), 100 * int(rng, -2, 2)])
      if (w <= 0 || used.includes(p / q)) continue
      used.push(p / q)
      return { p, q, v, w, s: v < w ? '<' : v > w ? '>' : '=' }
    }
  })
  return {
    text: `Comparați numerele: ${items.map((x, i) => `${L[i]}) $\\frac{${x.p}}{${x.q}}$ și $${D(x.w, 3)}$`).join('; ')}.`,
    solution: lines(
      'Transformăm fracția ordinară în fracție zecimală, împărțind numărătorul la numitor, apoi comparăm.',
      ...items.map((x, i) => `${L[i]}) $\\frac{${x.p}}{${x.q}} = ${x.p} : ${x.q} = ${D(x.v, 3)}$, deci $\\frac{${x.p}}{${x.q}} ${x.s} ${D(x.w, 3)}$.`),
    ),
    verify: () => items.every((x) => Math.sign(x.p / x.q - x.w / 1000) === (x.s === '<' ? -1 : x.s === '>' ? 1 : 0)),
  }
}

/** Two decimals between a and b, also when they are neighbours, p. 62, ex. 8. */
export function ordExamplesBetween(rng: Rng): Made {
  const pairs = [false, true].map((tight) => {
    for (;;) {
      const k = int(rng, 1, 2)
      const a = int(rng, P10(k), 30 * P10(k))
      const gap = tight ? 1 : int(rng, 3, 9)
      const b = a + gap
      if (a % 10 === 0 || b % 10 === 0) continue
      const [x1, x2, kx] = tight ? [10 * a + int(rng, 1, 4), 10 * a + int(rng, 5, 9), k + 1] : [a + 1, a + gap - 1, k]
      if (x1 % 10 === 0 || x2 % 10 === 0) continue
      return { a, b, k, x1, x2, kx, tight }
    }
  })
  return {
    text: `Găsiți câte două fracții zecimale cuprinse între: ${pairs.map((p, i) => `${L[i]}) $${D(p.a, p.k)}$ și $${D(p.b, p.k)}$`).join('; ')}.`,
    solution: lines(
      ...pairs.map((p, i) =>
        p.tight
          ? `${L[i]}) Numerele sunt vecine la ${p.k === 1 ? 'zecimi' : 'sutimi'}, așa că le scriem cu încă o zecimală: $${D(p.a, p.k)} = ${D(10 * p.a, p.k + 1, true)}$ și $${D(p.b, p.k)} = ${D(10 * p.b, p.k + 1, true)}$. Între ele se află, de exemplu, $${D(p.x1, p.kx)}$ și $${D(p.x2, p.kx)}$.`
          : `${L[i]}) De exemplu $${D(p.x1, p.kx)}$ și $${D(p.x2, p.kx)}$: $${D(p.a, p.k)} < ${D(p.x1, p.kx)} < ${D(p.x2, p.kx)} < ${D(p.b, p.k)}$.`,
      ),
      'Răspunsurile nu sunt unice: între două fracții zecimale diferite se află o infinitate de fracții zecimale.',
    ),
    verify: () => pairs.every((p) => {
      const s = P10(p.kx - p.k)
      return p.a * s < p.x1 && p.x1 < p.x2 && p.x2 < p.b * s
    }),
  }
}

interface Num { tex: string; p: number; q: number }

/** Decimals and ordinary fractions (some not simplified) with the same whole part, in increasing order, p. 62, ex. 2 c. */
export function ordMixedFractions(rng: Rng): Made {
  for (;;) {
    const W = int(rng, 1, 9)
    const items: Num[] = []
    for (let i = 0; i < 2; i++) {
      const q = pick(rng, [4, 5, 8, 20, 25])
      const p = int(rng, W * q + 1, (W + 1) * q - 1)
      const m = pick(rng, [1, 1, 2, 3])
      items.push({ tex: `\\frac{${p * m}}{${q * m}}`, p, q })
    }
    for (let i = 0; i < 3; i++) {
      const k = int(rng, 1, 3)
      const x = rqk(rng, W * P10(k) + 1, (W + 1) * P10(k) - 1, k)
      items.push({ tex: T(x), p: x.n, q: P10(x.k) })
    }
    const th = items.map((x) => (x.p * 1000) / x.q)
    if (new Set(th).size < 5) continue
    const sorted = [...items].sort((a, b) => a.p * b.q - b.p * a.q)
    const shown = shuffle(rng, items)
    return {
      text: `Ordonați crescător numerele: $${shown.map((x) => x.tex).join(';\\ ')}$.`,
      solution: lines(
        'Scriem fracțiile ordinare ca fracții zecimale:',
        show(items.slice(0, 2).map((x) => `${x.tex} = ${D((x.p * 1000) / x.q, 3)}`).join(', \\qquad ')),
        'Toate numerele au aceeași parte întreagă, deci le comparăm după zecimi, apoi după sutimi și miimi:',
        show(sorted.map((x) => x.tex).join(' < ')),
      ),
      verify: () => sorted.every((x, i) => i === 0 || sorted[i - 1].p / sorted[i - 1].q < x.p / x.q),
    }
  }
}

/** Fractions (some not simplified) and a periodic decimal between two consecutive naturals, p. 66, ex. 12; p. 67, ex. 16. */
export function ordFractionBetween(rng: Rng): Made {
  const fr: [number, number][] = []
  while (fr.length < 3) {
    const q = int(rng, 3, 40)
    const p = int(rng, q + 1, 12 * q)
    if (p % q === 0 || fr.some(([a, b]) => a * q === p * b)) continue
    fr.push([p, q])
  }
  const w = int(rng, 0, 9)
  const per = rng() < 0.5 ? `${w}{,}(${int(rng, 1, 8)})` : `${w}{,}${int(rng, 0, 9)}(${int(rng, 1, 8)})`
  return {
    text: `Încadrați între două numere naturale consecutive: ${fr.map(([p, q], i) => `${L[i]}) $\\frac{${p}}{${q}}$`).join('; ')}; d) $${per}$.`,
    solution: lines(
      'Împărțim numărătorul la numitor: câtul este numărul natural din stânga, iar câtul plus 1 cel din dreapta.',
      ...fr.map(([p, q], i) => {
        const n = Math.floor(p / q)
        return `${L[i]}) $${p} : ${q} = ${n}$ rest ${p % q}, deci $${n} < \\frac{${p}}{${q}} < ${n + 1}$.`
      }),
      `d) Partea întreagă este ${w}, deci $${w} < ${per} < ${w + 1}$.`,
    ),
    verify: () => fr.every(([p, q]) => Math.floor(p / q) < p / q && p / q < Math.floor(p / q) + 1) && w < decVal(per) && decVal(per) < w + 1,
  }
}

/** A periodic decimal against a finite one, against another periodic one, against a fraction, p. 67, ex. 15. */
export function ordComparePeriodic(rng: Rng): Made {
  const makers = [
    () => {
      const w = int(rng, 0, 9), b = int(rng, 1, 8)
      let c: number
      do c = int(rng, 0, 9); while (c === b)
      return { L: `${w}{,}(${b})`, R: `${w}{,}${b}${c}` }
    },
    () => {
      const w = int(rng, 0, 9)
      let x: number, y: number
      do [x, y] = [int(rng, 0, 9), int(rng, 1, 8)]; while (x === y)
      return { L: `${w}{,}${x}(${y})`, R: `${w}{,}(${x}${y})` }
    },
    () => {
      for (;;) {
        const q = pick(rng, [3, 6, 7, 9, 11, 12])
        const p = int(rng, 1, 4 * q)
        const [, d] = reduce(p, q)
        if (d % 3 !== 0 && d % 7 !== 0 && d % 11 !== 0) continue
        const h = Math.floor((100 * p) / q) + pick(rng, [0, 1])
        return { L: `\\frac{${p}}{${q}}`, R: D(h, 2), fp: [p, q] as [number, number] }
      }
    },
  ]
  const pairs = shuffle(rng, makers).map((f) => {
    const r: { L: string; R: string; fp?: [number, number] } = f()
    const lv = r.fp ?? parseDec(r.L)
    const rv = parseDec(r.R)
    const swap = rng() < 0.5
    return swap ? { a: r.R, av: rv, b: r.L, bv: lv } : { a: r.L, av: lv, b: r.R, bv: rv }
  })
  return {
    text: `Puneți unul dintre semnele $<$, $=$, $>$ între numerele: ${pairs.map((p, i) => `${L[i]}) $${p.a}$ și $${p.b}$`).join('; ')}.`,
    solution: lines(
      'Scriem mai multe zecimale ale fiecărui număr și le comparăm cifră cu cifră:',
      ...pairs.map((p, i) => `${L[i]}) $${p.a} = ${expand(p.av[0], p.av[1], 5)}$ și $${p.b} = ${expand(p.bv[0], p.bv[1], 5)}$, deci $${p.a} ${cmp(p.av, p.bv)} ${p.b}$.`),
    ),
    verify: () => pairs.every((p) => {
      const d = p.av[0] / p.av[1] - p.bv[0] / p.bv[1]
      return Math.abs(d) > 1e-12 && (d < 0) === (cmp(p.av, p.bv) === '<')
    }),
  }
}

/** The digits x for which a decimal with x is below or above a fraction, p. 67, ex. 17. */
export function ordDigitPeriodic(rng: Rng): Made {
  type Fam = { tex: (x: string) => string; val: (x: number) => number; dom: number[]; lo: number; hi: number }
  const fams: (() => Fam)[] = [
    () => {
      const w = int(rng, 0, 9)
      return { tex: (x) => `\\overline{${w}{,}${x}}`, val: (x) => w + x / 10, dom: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], lo: w, hi: w + 1 }
    },
    () => {
      const w = int(rng, 0, 9)
      return { tex: (x) => `\\overline{${w}{,}(${x})}`, val: (x) => w + x / 9, dom: [1, 2, 3, 4, 5, 6, 7, 8], lo: w, hi: w + 1 }
    },
    () => {
      const w = int(rng, 0, 9), y = int(rng, 0, 9)
      return {
        tex: (x) => `\\overline{${w}{,}${y}(${x})}`, val: (x) => w + y / 10 + x / 90,
        dom: [1, 2, 3, 4, 5, 6, 7, 8].filter((x) => x !== y), lo: w + y / 10, hi: w + (y + 1) / 10,
      }
    },
    () => {
      const d = int(rng, 1, 8)
      return { tex: (x) => `\\overline{${x}{,}(${d})}`, val: (x) => x + d / 9, dom: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], lo: 0, hi: 10 }
    },
  ]
  const chosen = shuffle(rng, [0, 1, 2, 3]).slice(0, 2)
  const items = chosen.map((ix) => {
    for (;;) {
      const f = fams[ix]()
      const q = ix === 2 ? pick(rng, [36, 45, 60, 72, 90]) : pick(rng, [3, 4, 6, 7, 8, 9, 11, 12])
      const lo = Math.ceil(f.lo * q), hi = Math.floor(f.hi * q)
      if (hi - lo < 2) continue
      const p = int(rng, lo, hi)
      if (p % q === 0) continue
      const less = rng() < 0.5
      const ok = f.dom.filter((x) => (less ? f.val(x) * q < p : f.val(x) * q > p) && Math.abs(f.val(x) * q - p) > 1e-9)
      if (ok.length === 0 || ok.length === f.dom.length) continue
      const ordered = less ? f.dom : [...f.dom].reverse()
      const out = ordered[ok.length]
      const inside = ordered[ok.length - 1]
      const vOut = f.val(out) * q
      const rOut = Math.abs(vOut - p) < 1e-9 ? '=' : less ? '>' : '<'
      return { f, p, q, less, ok, inside, out, rOut }
    }
  })
  return {
    text: `Aflați valorile pe care le poate lua cifra $x$ în fiecare caz: ${items.map((it, i) => `${L[i]}) $${it.f.tex('x')} ${it.less ? '<' : '>'} ${frac(it.p, it.q)}$`).join('; ')}.`,
    solution: lines(
      'Scriem fracția ordinară ca fracție zecimală și comparăm cifră cu cifră; cu cât cifra $x$ este mai mare, cu atât numărul este mai mare.',
      ...items.map((it, i) => {
        const F = ratTex(it.p, it.q)
        return `${L[i]}) $${frac(it.p, it.q)} = ${F}$. Avem $${plain(it.f.tex(String(it.inside)))} ${it.less ? '<' : '>'} ${F}$, dar $${plain(it.f.tex(String(it.out)))} ${it.rOut} ${F}$. Deci $x \\in \\{${[...it.ok].sort((a, b) => a - b).join(', ')}\\}$.`
      }),
    ),
    verify: () => items.every((it) => {
      const again = it.f.dom.filter((x) => (it.less ? it.f.val(x) < it.p / it.q - 1e-12 : it.f.val(x) > it.p / it.q + 1e-12))
      return again.join() === [...it.ok].sort((a, b) => a - b).join()
    }),
  }
}

/** a written number without its bar: \overline{5{,}3} → 5{,}3 */
const plain = (t: string) => t.replace(/^\\overline\{/, '').replace(/\}$/, '')

/** Five rationals with the same whole part (periodic, finite, fractions, a mixed number), in increasing order, p. 72, ex. 3. */
export function ordRationalsHard(rng: Rng): Made {
  for (;;) {
    const W = int(rng, 1, 6)
    const a = int(rng, 0, 9)
    let b: number
    do b = int(rng, 1, 8); while (b === a)
    const q1 = pick(rng, [20, 25, 40, 50])
    const q2 = pick(rng, [3, 6, 7, 9, 11, 12])
    const q3 = pick(rng, [3, 6, 7, 8, 9, 12])
    const p1 = int(rng, W * q1 + 1, (W + 1) * q1 - 1)
    const p2 = int(rng, W * q2 + 1, (W + 1) * q2 - 1)
    const r3 = int(rng, 1, q3 - 1)
    const t = int(rng, 1, 9)
    const per = `${W}{,}${a}(${b})`
    const items: Num[] = [
      { tex: per, p: parseDec(per)[0], q: parseDec(per)[1] },
      { tex: `\\frac{${p1}}{${q1}}`, p: p1, q: q1 },
      { tex: `\\frac{${p2}}{${q2}}`, p: p2, q: q2 },
      { tex: D(10 * W + t, 1), p: 10 * W + t, q: 10 },
      { tex: `${W}\\frac{${r3}}{${q3}}`, p: W * q3 + r3, q: q3 },
    ]
    const vals = items.map((x) => x.p / x.q)
    if (vals.some((v, i) => vals.some((u, j) => j < i && Math.abs(u - v) < 1e-4))) continue
    if (gcd(p2, q2) !== 1 || gcd(r3, q3) !== 1) continue
    const sorted = [...items].sort((x, y) => x.p * y.q - y.p * x.q)
    return {
      text: `Ordonați crescător numerele raționale: $${shuffle(rng, items).map((x) => x.tex).join(';\\ ')}$.`,
      solution: lines(
        'Scriem fiecare număr ca fracție zecimală, cu patru zecimale:',
        show(items.map((x) => `${x.tex} = ${expand(x.p, x.q, 4)}`).join(', \\quad ')),
        'Toate au partea întreagă ' + W + ', deci comparăm zecimalele în ordine:',
        show(sorted.map((x) => x.tex).join(' < ')),
      ),
      verify: () => sorted.every((x, i) => i === 0 || sorted[i - 1].p / sorted[i - 1].q < x.p / x.q),
    }
  }
}

// ================= 4.3 adding and subtracting (pp. 62–64) → v-decimal-add-sub =================

/** x + a = b, x − a = b, a − x = b, p. 63, ex. 4. */
export function addUnknown(rng: Rng): Made {
  const r = () => norm(int(rng, 1, 30000) * pick(rng, [1, 10, 100]), 3)
  const x1 = r(), a1 = r()
  const b1 = addQ(x1, a1)
  const x2 = r(), a2 = r()
  const minus = rng() < 0.5
  let second: { text: string; steps: string; x: Q; check: () => boolean }
  if (minus && subQ(x2, a2).n > 0) {
    const b2 = subQ(x2, a2)
    second = { text: `x - ${T(a2)} = ${T(b2)}`, steps: `x = ${T(b2)} + ${T(a2)} = ${T(x2)}`, x: x2, check: () => close(V(x2) - V(a2), V(b2)) }
  } else {
    const big = addQ(x2, a2)
    second = { text: `${T(big)} - x = ${T(a2)}`, steps: `x = ${T(big)} - ${T(a2)} = ${T(x2)}`, x: x2, check: () => close(V(big) - V(x2), V(a2)) }
  }
  return {
    text: `Aflați numărul necunoscut: a) $x + ${T(a1)} = ${T(b1)}$; b) $${second.text}$.`,
    solution: lines(
      'a) Termenul necunoscut este suma minus celălalt termen:',
      show(`x = ${T(b1)} - ${T(a1)} = ${T(x1)}`),
      `b) ${second.text.startsWith('x') ? 'Descăzutul este diferența plus scăzătorul:' : 'Scăzătorul este descăzutul minus diferența:'}`,
      show(second.steps),
    ),
    verify: () => close(V(x1) + V(a1), V(b1)) && second.check(),
  }
}

/** A decimal as a natural plus a decimal below 1, and as a natural minus one, p. 63, ex. 5–6. */
export function addDecompose(rng: Rng): Made {
  const xs: Q[] = []
  while (xs.length < 4) {
    const k = int(rng, 1, 3)
    const x = rqk(rng, 1, 25 * P10(k), k)
    if (x.n % P10(x.k) === 0 || xs.some((y) => y.n === x.n && y.k === x.k)) continue
    xs.push(x)
  }
  const parts = xs.map((x) => {
    const w = Math.floor(x.n / P10(x.k))
    const f = norm(x.n - w * P10(x.k), x.k)
    const g = norm(P10(x.k) - f.n * P10(x.k - f.k), x.k)
    return { x, w, f, g }
  })
  return {
    text: `Scrieți fiecare dintre numerele $${xs.map(T).join(';\\ ')}$ ca sumă dintre un număr natural și o fracție zecimală subunitară, apoi ca diferență dintre un număr natural și o fracție zecimală subunitară.`,
    solution: lines(
      'Pentru sumă despărțim partea întreagă de partea zecimală; pentru diferență pornim de la numărul natural următor și scădem cât îi lipsește numărului până la el.',
      ...parts.map((p) => show(`${T(p.x)} = ${p.w} + ${T(p.f)} = ${p.w + 1} - ${T(p.g)}`)),
    ),
    verify: () => parts.every((p) => close(p.w + V(p.f), V(p.x)) && close(p.w + 1 - V(p.g), V(p.x)) && V(p.f) < 1 && V(p.g) < 1 && V(p.g) > 0),
  }
}

const FRUIT = ['prune', 'mere', 'pere', 'caise', 'cireșe', 'piersici']

/** A full crate, three amounts taken out, the empty crate: what is left, p. 63, ex. 13. */
export function addCrate(rng: Rng): Made {
  const fruit = pick(rng, FRUIT)
  const outs = [norm(int(rng, 500, 25000), 3), norm(int(rng, 50, 2500) * 10, 3), norm(int(rng, 5, 25) * 1000, 3)]
  const E = norm(int(rng, 300, 900) * 10, 3)
  const left = norm(int(rng, 1000, 30000), 3)
  const F = [...outs, E, left].reduce(addQ)
  const order = shuffle(rng, outs)
  const taken = order.reduce(addQ)
  const net = subQ(F, taken)
  return {
    text: `Dintr-o ladă cu ${fruit} care, plină, cântărește $${T(F)}$ kg s-au scos pe rând $${T(order[0])}$ kg, $${T(order[1])}$ kg și $${T(order[2])}$ kg. Câte kilograme de ${fruit} au rămas în ladă, dacă lada goală cântărește $${T(E)}$ kg?`,
    solution: lines(
      'Calculăm cât s-a scos în total:',
      show(`${order.map(T).join(' + ')} = ${T(taken)}\\text{ kg}`),
      'Lada cu ce a rămas în ea cântărește:',
      show(`${T(F)} - ${T(taken)} = ${T(net)}\\text{ kg}`),
      'Scădem masa lăzii goale:',
      show(`${T(net)} - ${T(E)} = ${T(left)}\\text{ kg}`),
      `Au rămas $${T(left)}$ kg de ${fruit}.`,
    ),
    verify: () => close(V(F) - sum(outs.map(V)) - V(E), V(left)),
  }
}

/** Three days: the second d more than the first, the third e more than the first two together, p. 63, ex. 9. */
export function addThreeDays(rng: Rng): Made {
  const ctx = pick(rng, [
    ['La o cantină', 'de alimente'], ['La un depozit', 'de cartofi'], ['La un magazin', 'de fructe'], ['La o brutărie', 'de făină'],
  ])
  const A = norm(int(rng, 5000, 40000), 2)
  const d = norm(int(rng, 100, 30000), 3)
  const e = norm(int(rng, 100, 10000), 3)
  const d2 = addQ(A, d)
  const d12 = addQ(A, d2)
  const d3 = addQ(d12, e)
  const tot = addQ(d12, d3)
  return {
    text: `${ctx[0]} s-au adus într-o zi $${T(A)}$ kg ${ctx[1]}, a doua zi cu $${T(d)}$ kg mai mult, iar a treia zi cu $${T(e)}$ kg mai mult decât în prima zi și în a doua zi la un loc. Câte kilograme ${ctx[1]} s-au adus în total în cele trei zile?`,
    solution: lines(
      show(`\\text{a doua zi: } ${T(A)} + ${T(d)} = ${T(d2)}\\text{ kg}`),
      show(`\\text{primele doua zile: } ${T(A)} + ${T(d2)} = ${T(d12)}\\text{ kg}`),
      show(`\\text{a treia zi: } ${T(d12)} + ${T(e)} = ${T(d3)}\\text{ kg}`),
      show(`\\text{total: } ${T(d12)} + ${T(d3)} = ${T(tot)}\\text{ kg}`),
    ),
    verify: () => close(V(A) + (V(A) + V(d)) + (2 * V(A) + V(d) + V(e)), V(tot)),
  }
}

/** The difference between the sum of a and b and the difference of c and d (or the other way), p. 63, ex. 11. */
export function addSumMinusDiff(rng: Rng): Made {
  for (;;) {
    const [a, b, c, d] = [rqk(rng, 11, 999, int(rng, 1, 2)), rqk(rng, 11, 999, int(rng, 1, 2)), rqk(rng, 101, 3999, int(rng, 1, 2)), rqk(rng, 11, 999, int(rng, 1, 2))]
    if (V(c) <= V(d)) continue
    const s = addQ(a, b), df = subQ(c, d)
    if (s.n * P10(df.k) === df.n * P10(s.k)) continue
    const sumFirst = V(s) > V(df)
    const r = sumFirst ? subQ(s, df) : subQ(df, s)
    return {
      text: sumFirst
        ? `Aflați diferența dintre suma numerelor $${T(a)}$ și $${T(b)}$ și diferența numerelor $${T(c)}$ și $${T(d)}$.`
        : `Aflați diferența dintre diferența numerelor $${T(c)}$ și $${T(d)}$ și suma numerelor $${T(a)}$ și $${T(b)}$.`,
      solution: lines(
        show(`${T(a)} + ${T(b)} = ${T(s)}, \\qquad ${T(c)} - ${T(d)} = ${T(df)}`),
        show(sumFirst ? `${T(s)} - ${T(df)} = ${T(r)}` : `${T(df)} - ${T(s)} = ${T(r)}`),
      ),
      verify: () => close(Math.abs(V(a) + V(b) - (V(c) - V(d))), V(r)),
    }
  }
}

/** x,a + x,(a+1) + … + x,b = S: the digit x, p. 64, ex. 14 e. */
export function addDigitSeries(rng: Rng): Made {
  const a = int(rng, 0, 5), b = int(rng, a + 2, 9), x = int(rng, 1, 9)
  const n = b - a + 1
  const tenths = sum(Array.from({ length: n }, (_, i) => a + i))
  const S = norm(10 * n * x + tenths, 1)
  const term = (d: number | string) => `\\overline{x{,}${d}}`
  const lhs = n <= 3 ? Array.from({ length: n }, (_, i) => term(a + i)).join(' + ') : `${term(a)} + ${term(a + 1)} + \\ldots + ${term(b)}`
  return {
    text: `Aflați cifra $x$ știind că $${lhs} = ${T(S)}$.`,
    solution: lines(
      `Sunt ${n} termeni; fiecare are partea întreagă $x$, iar zecimile sunt ${a}, ${a + 1}, …, ${b}. Atunci suma este`,
      show(`${n} \\cdot x + ${D(tenths, 1)} = ${T(S)}`),
      show(`${n} \\cdot x = ${T(S)} - ${D(tenths, 1)} = ${n * x}, \\qquad x = ${n * x} : ${n} = ${x}`),
    ),
    verify: () => {
      const sols = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((y) => close(sum(Array.from({ length: n }, (_, i) => y + (a + i) / 10)), V(S)))
      return sols.length === 1 && sols[0] === x
    },
  }
}

/** x − y,x = r with x, y digits, p. 64, ex. 14 d. */
export function addDigitMinus(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 1, 9), y = int(rng, 0, 9)
    const R = 9 * x - 10 * y
    if (R <= 0) continue
    return {
      text: `Aflați cifrele $x$ și $y$ știind că $x - \\overline{y{,}x} = ${D(R, 1)}$.`,
      solution: lines(
        `Scriem totul în zecimi: $x$ înseamnă $10 \\cdot x$ zecimi, iar $\\overline{y{,}x}$ înseamnă $10 \\cdot y + x$ zecimi. Atunci`,
        show(`10 \\cdot x - 10 \\cdot y - x = ${R}, \\qquad 9 \\cdot x - 10 \\cdot y = ${R}`),
        `Numărul $10 \\cdot y$ se termină în 0, deci $9 \\cdot x$ se termină în ${R % 10}; singura cifră potrivită este $x = ${x}$ ($9 \\cdot ${x} = ${9 * x}$).`,
        show(`10 \\cdot y = ${9 * x} - ${R} = ${10 * y}, \\qquad y = ${y}`),
        `Verificare: $${x} - ${D(10 * y + x, 1)} = ${D(R, 1)}$.`,
      ),
      verify: () => {
        const sols: [number, number][] = []
        for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) if (close(a - (b + a / 10), R / 10)) sols.push([a, b])
        return sols.length === 1 && sols[0][0] === x && sols[0][1] === y
      },
    }
  }
}

/** x,yA + y,xB = S: all the digits x, y, p. 64, ex. 14 a–b. */
export function addDigitPairs(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 1, 9), B = int(rng, 1, 9), s = int(rng, 3, 16)
    const pairs: [number, number][] = []
    for (let x = 1; x <= 9; x++) if (s - x >= 1 && s - x <= 9) pairs.push([x, s - x])
    if (pairs.length < 2) continue
    const S = 110 * s + A + B
    return {
      text: `Aflați cifrele $x$ și $y$ știind că $\\overline{x{,}y${A}} + \\overline{y{,}x${B}} = ${D(S, 2)}$ (găsiți toate soluțiile).`,
      solution: lines(
        'Scriem totul în sutimi:',
        show(`\\overline{x{,}y${A}} + \\overline{y{,}x${B}} = (100x + 10y + ${A} + 100y + 10x + ${B}) : 100 = (110 \\cdot (x + y) + ${A + B}) : 100`),
        show(`110 \\cdot (x + y) = ${nr(S)} - ${A + B} = ${nr(110 * s)},\\qquad x + y = ${s}`),
        `Cifrele nenule cu suma ${s} dau perechile $(x, y)$: ${pairs.map(([x, y]) => `$(${x}, ${y})$`).join(', ')}.`,
      ),
      verify: () => {
        const found: string[] = []
        for (let x = 1; x <= 9; x++) for (let y = 1; y <= 9; y++) if (close(x + y / 10 + A / 100 + y + x / 10 + B / 100, S / 100)) found.push(`${x},${y}`)
        return found.join(';') === pairs.map((p) => p.join(',')).join(';')
      },
    }
  }
}

// ================= 4.4 multiplying (pp. 64–65) → v-decimal-multiply =================

/** a·b − c and d + e·f (or g − h·i): the multiplication first, p. 64, ex. 7. */
export function mulOrderSimple(rng: Rng): Made {
  for (;;) {
    const a = rqk(rng, 11, 999, int(rng, 1, 2)), b = rq(rng, 2, 99, int(rng, 0, 1))
    const p1 = mulQ(a, b)
    const c = rqk(rng, 1, 999, int(rng, 1, 2))
    if (V(c) >= V(p1)) continue
    const d = rqk(rng, 11, 9999, int(rng, 1, 2)), e = rqk(rng, 2, 99, 1), f = rq(rng, 2, 99, int(rng, 0, 1))
    const p2 = mulQ(e, f)
    const plus = rng() < 0.5
    if (!plus && V(p2) >= V(d)) continue
    const r1 = subQ(p1, c), r2 = plus ? addQ(d, p2) : subQ(d, p2)
    return {
      text: `Calculați: a) $${T(a)} \\cdot ${T(b)} - ${T(c)}$; b) $${T(d)} ${plus ? '+' : '-'} ${T(e)} \\cdot ${T(f)}$.`,
      solution: lines(
        'Efectuăm întâi înmulțirea, apoi adunarea sau scăderea.',
        show(`\\text{a) } ${T(a)} \\cdot ${T(b)} - ${T(c)} = ${T(p1)} - ${T(c)} = ${T(r1)}`),
        show(`\\text{b) } ${T(d)} ${plus ? '+' : '-'} ${T(e)} \\cdot ${T(f)} = ${T(d)} ${plus ? '+' : '-'} ${T(p2)} = ${T(r2)}`),
      ),
      verify: () => close(V(a) * V(b) - V(c), V(r1)) && close(V(d) + (plus ? 1 : -1) * V(e) * V(f), V(r2)),
    }
  }
}

const GOODS: [boolean, string, string, number, number][] = [
  [true, 'pâine', 'pâini', 60, 160], [false, 'pachet de unt', 'pachete de unt', 20, 50], [true, 'cutie de bomboane', 'cutii de bomboane', 20, 100],
  [false, 'pachet de biscuiți', 'pachete de biscuiți', 20, 80], [false, 'borcan cu miere', 'borcane cu miere', 50, 200],
  [true, 'tabletă de ciocolată', 'tablete de ciocolată', 10, 40], [false, 'pachet de cafea', 'pachete de cafea', 20, 100],
]

/** Goods weighed in grams; the weight of the bag in kilograms, p. 65, ex. 11. */
export function mulBagWeight(rng: Rng): Made {
  const items = shuffle(rng, GOODS).slice(0, 4).map(([f, one, many, lo, hi]) => {
    const n = int(rng, 1, 4), g = 5 * int(rng, lo, hi)
    return { n, g, words: n === 1 ? `${f ? 'o' : 'un'} ${one} de ${g} g` : `${n} ${many} de câte ${g} g` }
  })
  const total = sum(items.map((x) => x.n * x.g))
  return {
    text: `Am cumpărat de la magazin ${items.slice(0, -1).map((x) => x.words).join(', ')} și ${items[3].words}. Câte kilograme cântărește sacoșa cu produsele cumpărate?`,
    solution: lines(
      show(`${items.map((x) => (x.n === 1 ? String(x.g) : `${x.n} \\cdot ${x.g}`)).join(' + ')} = ${nr(total)}\\text{ g}`),
      `Cum $1\\text{ kg} = 1000\\text{ g}$:`,
      show(`${nr(total)}\\text{ g} = ${nr(total)} : 1000\\text{ kg} = ${D(total, 3)}\\text{ kg}`),
    ),
    verify: () => close(items.reduce((s, x) => s + x.n * x.g / 1000, 0), total / 1000),
  }
}

const KG_GOODS = ['mere', 'portocale', 'cartofi', 'roșii', 'struguri', 'banane', 'pere']
const PIECES: [string, string][] = [['ciocolată', 'ciocolate'], ['pâine', 'pâini'], ['sticlă de suc', 'sticle de suc'], ['caiet', 'caiete']]

/** Goods by the kilogram and by the piece, paid with a banknote: the change, p. 65, ex. 12–15; p. 75, ex. 4. */
export function mulShoppingChange(rng: Rng): Made {
  for (;;) {
    const kgs = shuffle(rng, KG_GOODS).slice(0, 2).map((name) => ({ name, k: int(rng, 3, 40), p: int(rng, 15, 140) }))
    const [one, many] = pick(rng, PIECES)
    const n = int(rng, 2, 5), pp = 10 * int(rng, 15, 120)
    const costs = kgs.map((g) => g.k * g.p)
    const cost3 = n * pp
    const total = sum(costs) + cost3
    const note = pick(rng, [5000, 10000, 20000])
    if (total >= note || total < note / 4) continue
    void one
    return {
      text: `O persoană cumpără ${kgs.map((g) => `$${D(g.k, 1)}$ kg de ${g.name} cu ${lei(10 * g.p)} kilogramul`).join(', ')} și ${n} ${many} cu ${lei(pp)} bucata. Plătește cu o bancnotă de ${de(note / 100)} lei. Ce rest primește?`,
      solution: lines(
        show(kgs.map((g, i) => `${D(g.k, 1)} \\cdot ${leiM(10 * g.p)} = ${leiM(costs[i])}`).join(', \\qquad ')),
        show(`${n} \\cdot ${leiM(pp)} = ${leiM(cost3)}`),
        show(`\\text{total: } ${leiM(costs[0])} + ${leiM(costs[1])} + ${leiM(cost3)} = ${leiM(total)}\\text{ lei}`),
        show(`\\text{rest: } ${note / 100} - ${leiM(total)} = ${leiM(note - total)}\\text{ lei}`),
      ),
      verify: () => close(note / 100 - kgs.reduce((s, g) => s + (g.k / 10) * (g.p / 10), 0) - n * pp / 100, (note - total) / 100),
    }
  }
}

/** Trucks in tonnes, vans in kilograms, given out in quintals: what is left, p. 65, ex. 16–17. */
export function mulDepot(rng: Rng): Made {
  for (;;) {
    const n1 = int(rng, 2, 6), a = int(rng, 15, 80)
    const n2 = int(rng, 2, 7), b = 10 * int(rng, 20, 90)
    const total = n1 * a * 100 + n2 * b
    const c = int(rng, 20, Math.floor(total / 10) - 10)
    const left = total - 10 * c
    if (left <= 100 || c % 10 === 0) continue
    return {
      text: `La un depozit au adus marfă ${n1} camioane, fiecare câte $${D(a, 1)}$ t, și ${n2} autoutilitare, fiecare câte ${b} kg. Dacă din depozit s-au dat $${D(c, 1)}$ q, câte kilograme de marfă au rămas?`,
      solution: lines(
        'Știm că $1\\text{ t} = 1000\\text{ kg}$ și $1\\text{ q} = 100\\text{ kg}$.',
        show(`${n1} \\cdot ${D(a, 1)}\\text{ t} = ${D(n1 * a, 1)}\\text{ t} = ${nr(n1 * a * 100)}\\text{ kg}, \\qquad ${n2} \\cdot ${b} = ${nr(n2 * b)}\\text{ kg}`),
        show(`${nr(n1 * a * 100)} + ${nr(n2 * b)} = ${nr(total)}\\text{ kg}, \\qquad ${D(c, 1)}\\text{ q} = ${nr(10 * c)}\\text{ kg}`),
        show(`${nr(total)} - ${nr(10 * c)} = ${nr(left)}\\text{ kg}`),
      ),
      verify: () => close(n1 * (a / 10) * 1000 + n2 * b - (c / 10) * 100, left),
    }
  }
}

/** Two kinds of boxes: packets, biscuits per packet, the weight of a biscuit: which box is heavier, p. 65, ex. 19. */
export function mulWhichHeavier(rng: Rng): Made {
  for (;;) {
    const b = [0, 1].map(() => ({ N: int(rng, 20, 90), n: int(rng, 5, 15), w: int(rng, 60, 200) }))
    const wt = b.map((x) => x.N * x.n * x.w)
    if (wt[0] === wt[1]) continue
    const h = wt[0] > wt[1] ? 0 : 1
    const diff = Math.abs(wt[0] - wt[1])
    const brand = pick(rng, ['Pinky', 'Crocant', 'Dulcinel', 'Bobo'])
    return {
      text: `Biscuiții „${brand}” se ambalează în două tipuri de cutii. Primul tip conține ${de(b[0].N)} pachete, un pachet având ${de(b[0].n)} biscuiți, iar un biscuit cântărește $${D(b[0].w, 1)}$ g. Al doilea tip conține ${de(b[1].N)} pachete, un pachet având ${de(b[1].n)} biscuiți, iar un biscuit cântărește $${D(b[1].w, 1)}$ g. Care cutie este mai grea și cu câte grame?`,
      solution: lines(
        ...b.map((x, i) => show(`\\text{cutia ${i + 1}: } ${x.N} \\cdot ${x.n} \\cdot ${D(x.w, 1)} = ${x.N * x.n} \\cdot ${D(x.w, 1)} = ${D(wt[i], 1)}\\text{ g}`)),
        `Mai grea este cutia de tipul ${h === 0 ? 'întâi' : 'al doilea'}, cu`,
        show(`${D(Math.max(...wt), 1)} - ${D(Math.min(...wt), 1)} = ${D(diff, 1)}\\text{ g}`),
      ),
      verify: () => close(Math.abs(b[0].N * b[0].n * b[0].w - b[1].N * b[1].n * b[1].w) / 10, diff / 10) && (b[h].N * b[h].n * b[h].w) > (b[1 - h].N * b[1 - h].n * b[1 - h].w),
    }
  }
}

const STEPS: Q[] = [norm(1, 1), norm(2, 1), norm(3, 1), norm(5, 1), norm(6, 2), norm(4, 2), norm(25, 2), norm(1, 2), norm(3, 2), norm(12, 2), norm(15, 2), norm(7, 1)]

/** s + 2s + 3s + … + ns with s a decimal, by taking s out, p. 65, ex. 22. */
export function mulStepSeries(rng: Rng): Made {
  const s = pick(rng, STEPS), n = int(rng, 8, 40)
  const g = (n * (n + 1)) / 2
  const r = mulQ(s, norm(g))
  const t = (i: number) => T(mulQ(s, norm(i)))
  return {
    text: `Calculați: $${t(1)} + ${t(2)} + ${t(3)} + \\ldots + ${t(n)}$.`,
    solution: lines(
      `Fiecare termen este un multiplu al lui $${T(s)}$: $${t(n)} = ${T(s)} \\cdot ${n}$. Scoatem factor comun:`,
      show(`${T(s)} \\cdot (1 + 2 + 3 + \\ldots + ${n}) = ${T(s)} \\cdot \\frac{${n} \\cdot ${n + 1}}{2} = ${T(s)} \\cdot ${g} = ${T(r)}`),
    ),
    verify: () => close(sum(Array.from({ length: n }, (_, i) => (i + 1) * s.n)) / P10(s.k), V(r)),
  }
}

/** a² + b² − 2·a·b and c² − d² − e·f with decimals, p. 65, ex. 23. */
export function mulSquaresExpr(rng: Rng): Made {
  for (;;) {
    const a = rqk(rng, 2, 39, 1), b = rqk(rng, 2, 39, 1)
    if (a.n === b.n) continue
    const a2 = mulQ(a, a), b2 = mulQ(b, b), ab2 = mulQ(norm(2), mulQ(a, b))
    const r1 = subQ(addQ(a2, b2), ab2)
    const c = rqk(rng, 15, 49, 1), d = rqk(rng, 2, 14, 1), e = rqk(rng, 11, 299, 2), f = rqk(rng, 2, 49, 1)
    const c2 = mulQ(c, c), d2 = mulQ(d, d), ef = mulQ(e, f)
    const r2 = subQ(subQ(c2, d2), ef)
    if (r2.n <= 0) continue
    return {
      text: `Calculați: a) $${T(a)}^2 + ${T(b)}^2 - 2 \\cdot ${T(a)} \\cdot ${T(b)}$; b) $${T(c)}^2 - ${T(d)}^2 - ${T(e)} \\cdot ${T(f)}$.`,
      solution: lines(
        'Calculăm întâi puterile, apoi înmulțirile, apoi adunările și scăderile.',
        show(`\\text{a) } ${T(a2)} + ${T(b2)} - ${T(ab2)} = ${T(addQ(a2, b2))} - ${T(ab2)} = ${T(r1)}`),
        show(`\\text{b) } ${T(c2)} - ${T(d2)} - ${T(ef)} = ${T(subQ(c2, d2))} - ${T(ef)} = ${T(r2)}`),
      ),
      verify: () => close((V(a) - V(b)) ** 2, V(r1)) && close(V(c) ** 2 - V(d) ** 2 - V(e) * V(f), V(r2)),
    }
  }
}

/** Father, mother and you: do the family's money cover the fuel and the shopping? p. 65, ex. 21. */
export function mulFamilyMoney(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 3, 8)
    const mom = 100 * k * int(rng, 6, 25)
    const dad = 100 * int(rng, 40, 120)
    const you = mom / k
    const litres = int(rng, 8, 30), price = 10 * int(rng, 55, 80)
    const fuel = litres * price
    const need = 10 * int(rng, 300, 1500)
    const missing = fuel + need - dad - mom
    if (missing > you || missing < -2000 || Math.abs(fuel - dad) < 100 || Math.abs(need - mom) < 100) continue
    const dadLine = fuel <= dad ? `Tatălui îi ajung banii și îi rămân $${leiM(dad - fuel)}$ lei.` : `Tatălui îi lipsesc $${leiM(fuel - dad)}$ lei.`
    const momLine = need <= mom ? `Mamei îi ajung banii și îi rămân $${leiM(mom - need)}$ lei.` : `Mamei îi lipsesc $${leiM(need - mom)}$ lei.`
    return {
      text: `Tata are ${lei(dad)}, mama are ${lei(mom)}, iar tu, din banii câștigați în vacanță, ai de ${k} ori mai puțin decât mama. Tata trebuie să cumpere ${de(litres)} litri de benzină care costă ${lei(price)} litrul, iar mama are nevoie de ${lei(need)} pentru cumpărături. Le ajung banii celor doi părinți împreună? Dacă nu, cât trebuie să dai tu?`,
      solution: lines(
        show(`\\text{tu ai: } ${leiM(mom)} : ${k} = ${leiM(you)}\\text{ lei}, \\qquad \\text{benzina: } ${litres} \\cdot ${leiM(price)} = ${leiM(fuel)}\\text{ lei}`),
        `${dadLine} ${momLine}`,
        show(`\\text{au impreuna } ${leiM(dad)} + ${leiM(mom)} = ${leiM(dad + mom)}\\text{ lei}, \\quad \\text{le trebuie } ${leiM(fuel)} + ${leiM(need)} = ${leiM(fuel + need)}\\text{ lei}`),
        missing > 0
          ? `Părinților le lipsesc $${leiM(fuel + need)} - ${leiM(dad + mom)} = ${leiM(missing)}$ lei, iar tu ai $${leiM(you)}$ lei, deci le poți da cei $${leiM(missing)}$ lei.`
          : `Banii părinților ajung (le rămân $${leiM(-missing)}$ lei), așa că nu apelează la tine.`,
      ),
      verify: () => close(litres * price / 100 + need / 100 - dad / 100 - mom / 100, missing / 100) && missing <= you,
    }
  }
}

// ================= 4.5, 4.8, 4.9 periodic decimals and rationals (pp. 66–67, 71–73) → v-decimal-periodic =================

/** w,(a) + v,(b) and 0,(ab) − 0,(cd), p. 71, ex. 6. */
export function perAddSub(rng: Rng): Made {
  for (;;) {
    const w1 = int(rng, 0, 4), w2 = int(rng, 0, 4), a = int(rng, 1, 8), b = int(rng, 1, 8)
    if (w1 === w2 && a === b) continue
    const x = int(rng, 1, 9), y = int(rng, 0, 9), z = int(rng, 0, 9), t = int(rng, 1, 9)
    if (x === y || z === t || 10 * x + y <= 10 * z + t || 10 * x + y === 99) continue
    const A = `${w1}{,}(${a})`, B = `${w2}{,}(${b})`, C = `0{,}(${x}${y})`, E = `0{,}(${z}${t})`
    const s = (9 * (w1 + w2) + a + b)
    const dnum = 10 * x + y - 10 * z - t
    return {
      text: `Efectuați și scrieți rezultatul ca fracție ordinară ireductibilă și ca fracție zecimală: a) $${A} + ${B}$; b) $${C} - ${E}$.`,
      solution: lines(
        'Transformăm fracțiile periodice în fracții ordinare:',
        show(`\\text{a) } ${perToFrac(A)}, \\quad ${perToFrac(B)}`),
        show(`${frac(9 * w1 + a, 9)} + ${frac(9 * w2 + b, 9)} = ${frac(s, 9)} = ${ratTex(s, 9)}`),
        show(`\\text{b) } \\frac{${10 * x + y}}{99} - \\frac{${10 * z + t}}{99} = \\frac{${dnum}}{99}${gcd(dnum, 99) > 1 ? ` = ${frac(dnum, 99)}` : ''} = ${ratTex(dnum, 99)}`),
      ),
      verify: () => close(decVal(A) + decVal(B), decVal(ratTex(s, 9))) && close(decVal(C) - decVal(E), decVal(ratTex(dnum, 99))),
    }
  }
}

/** Which pairs (fraction or mixed number, periodic decimal) are the same rational number, p. 72, ex. 2. */
export function perSameRational(rng: Rng): Made {
  const pairs = Array.from({ length: 3 }, (_, i) => {
    for (;;) {
      const q = pick(rng, [3, 6, 9, 11, 12, 15, 18, 22])
      const p = int(rng, 1, 5 * q)
      const [rp, rqq] = reduce(p, q)
      if (rqq % 3 !== 0 && rqq % 11 !== 0) continue
      let dec = ratTex(rp, rqq)
      const [w, pre, per] = splitDec(dec)
      if (rng() < 0.5) {
        if (pre) dec = `${w}{,}(${pre}${per})`
        else {
          const last = Number(per[per.length - 1])
          dec = `${w}{,}(${per.slice(0, -1)}${last === 8 ? 1 : last + 1})`
        }
      }
      if (/\((\d)\1*\)$/.test(dec) && /\(9+\)$/.test(dec)) continue
      const m = pick(rng, [1, 1, 2, 3])
      const left = i === 1 && rp > rqq ? mixed(rp, rqq) : `\\frac{${rp * m}}{${rqq * m}}`
      return { left, dec, rp, rqq, same: cmp(parseDec(dec), [rp, rqq]) === '=' }
    }
  })
  return {
    text: `În care dintre perechile următoare cele două numere reprezintă același număr rațional? ${pairs.map((p, i) => `${L[i]}) $${p.left}$ și $${p.dec}$`).join('; ')}.`,
    solution: lines(
      'Scriem fracția zecimală ca fracție ordinară ireductibilă și o comparăm cu cealaltă, adusă și ea la forma ireductibilă.',
      ...pairs.map((p, i) => `${L[i]}) $${perToFrac(p.dec)}$, iar $${p.left === frac(p.rp, p.rqq) ? p.left : `${p.left} = ${frac(p.rp, p.rqq)}`}$: ${p.same ? 'același număr rațional.' : 'numere diferite.'}`),
    ),
    verify: () => pairs.every((p) => (Math.abs(decVal(p.dec) - p.rp / p.rqq) < 1e-12) === p.same),
  }
}

const PERFR = [3, 6, 9, 12, 18, 15, 30]
/** A periodic number q as a reduced fraction with a denominator from PERFR, not finite. */
function periodicFrac(rng: Rng, maxW: number): [number, number] {
  for (;;) {
    const q = pick(rng, PERFR)
    const p = int(rng, 1, maxW * q)
    const [a, b] = reduce(p, q)
    if (b % 3 === 0) return [a, b]
  }
}
const FIN: Q[] = [norm(6, 1), norm(3, 1), norm(12, 1), norm(9, 1), norm(15, 1), norm(45, 2), norm(5, 1), norm(25, 2), norm(75, 2), norm(24, 1)]

/** a,(b)·c and x : y with periodic decimals, p. 71, ex. 7. */
export function perProductQuotient(rng: Rng): Made {
  const [p, q] = periodicFrac(rng, 6)
  const c = pick(rng, FIN)
  const X = ratTex(p, q)
  const [cp, cq] = reduce(c.n, P10(c.k))
  const [pp, pq] = reduce(p * cp, q * cq)
  const [yp, yq] = periodicFrac(rng, 3)
  const r = pick(rng, [norm(2), norm(3), norm(4), norm(5), norm(6), norm(15, 1), norm(25, 1), norm(5, 1)])
  const [rp, rqq] = reduce(r.n, P10(r.k))
  const [xp, xq] = reduce(yp * rp, yq * rqq)
  const Xb = ratTex(xp, xq), Yb = ratTex(yp, yq)
  return {
    text: `Efectuați: a) $${X} \\cdot ${T(c)}$; b) $${Xb} : ${Yb}$.`,
    solution: lines(
      'Transformăm fracțiile periodice în fracții ordinare.',
      show(`\\text{a) } ${perToFrac(X)}, \\qquad ${frac(p, q)} \\cdot ${frac(cp, cq)} = ${frac(pp, pq)} = ${ratTex(pp, pq)}`),
      show(`\\text{b) } ${perToFrac(Xb)}, \\qquad ${perToFrac(Yb)}`),
      show(`${frac(xp, xq)} : ${frac(yp, yq)} = ${frac(xp, xq)} \\cdot ${frac(yq, yp)} = ${frac(rp, rqq) === T(r) ? T(r) : `${frac(rp, rqq)} = ${T(r)}`}`),
    ),
    verify: () => close(decVal(X) * V(c), decVal(ratTex(pp, pq))) && close(decVal(Xb) / decVal(Yb), V(r)),
  }
}

/** X : n ± y and [X + Y] : z with periodic decimals, p. 73, ex. 13. */
export function perOpsMixed(rng: Rng): Made {
  for (;;) {
    const [u, v] = periodicFrac(rng, 3)
    const n = int(rng, 2, 12)
    const X = ratTex(n * u, v)
    const y = rqk(rng, 1, 9, 1)
    const [yp, yq] = reduce(y.n, 10)
    const plus = rng() < 0.5
    const [r1p, r1q] = reduce(u * yq + (plus ? 1 : -1) * yp * v, v * yq)
    if (r1p <= 0) continue
    const [a1, b1] = periodicFrac(rng, 4), [a2, b2] = periodicFrac(rng, 4)
    const z = pick(rng, [norm(5, 1), norm(15, 1), norm(2), norm(25, 2), norm(3), norm(4)])
    const [zp, zq] = reduce(z.n, P10(z.k))
    const [sp, sq] = reduce(a1 * b2 + a2 * b1, b1 * b2)
    const [r2p, r2q] = reduce(sp * zq, sq * zp)
    const A1 = ratTex(a1, b1), A2 = ratTex(a2, b2)
    return {
      text: `Efectuați: a) $${X} : ${n} ${plus ? '+' : '-'} ${T(y)}$; b) $(${A1} + ${A2}) : ${T(z)}$.`,
      solution: lines(
        show(`\\text{a) } ${perToFrac(X)}, \\qquad ${frac(n * u, v)} : ${n} ${plus ? '+' : '-'} ${frac(yp, yq)} = ${frac(u, v)} ${plus ? '+' : '-'} ${frac(yp, yq)} = ${frac(r1p, r1q)} = ${ratTex(r1p, r1q)}`),
        show(`\\text{b) } ${perToFrac(A1)}, \\qquad ${perToFrac(A2)}`),
        show(`\\left(${frac(a1, b1)} + ${frac(a2, b2)}\\right) : ${frac(zp, zq)} = ${frac(sp, sq)} \\cdot ${frac(zq, zp)} = ${frac(r2p, r2q)} = ${ratTex(r2p, r2q)}`),
      ),
      verify: () => close(decVal(X) / n + (plus ? 1 : -1) * V(y), decVal(ratTex(r1p, r1q))) && close((decVal(A1) + decVal(A2)) / V(z), decVal(ratTex(r2p, r2q))),
    }
  }
}

/** p/q = w,a(b): the digits; w,(d) = a/3 or ab/3: the digits, p. 67, ex. 14; p. 71, ex. 8. */
export function perDigitsFromFraction(rng: Rng): Made {
  let first: { p: number; q: number; dec: string; w: number; a: string; b: string }
  for (;;) {
    const q = pick(rng, [6, 12, 15, 18, 30, 36, 45, 60, 90])
    const p = int(rng, 1, 4 * q)
    const [rp, rqq] = reduce(p, q)
    const dec = ratTex(rp, rqq)
    const [w, a, b] = splitDec(dec)
    if (a.length !== 1 || b.length !== 1) continue
    first = { p: rp, q: rqq, dec, w, a, b }
    break
  }
  const w2 = int(rng, 0, 6), d = pick(rng, [3, 6])
  const N = 3 * w2 + d / 3
  const two = N >= 10
  const unknown = two ? '\\overline{ab}' : 'a'
  return {
    text: `Aflați cifrele $a$, $b$ în fiecare caz: a) $\\frac{${first.p}}{${first.q}} = \\overline{${first.w}{,}a(b)}$; b) $${w2}{,}(${d}) = \\frac{${unknown}}{3}$.`,
    solution: lines(
      `a) Împărțim: $${first.p} : ${first.q} = ${first.dec}$, deci $a = ${first.a}$ și $b = ${first.b}$.`,
      `b) Transformăm fracția periodică: $${perToFrac(`${w2}{,}(${d})`)}$, deci $${unknown} = ${N}$${two ? `, adică $a = ${Math.floor(N / 10)}$ și $b = ${N % 10}$` : ''}.`,
    ),
    verify: () => close(first.p / first.q, first.w + Number(first.a) / 10 + Number(first.b) / 90) && close(w2 + d / 9, N / 3),
  }
}

/** The natural x in w,a(b) = x/90, w,(a) = x/3, w,a(b) = p/x, p. 71, ex. 9. */
export function perFindNatural(rng: Rng): Made {
  const types = shuffle(rng, [0, 1, 2]).slice(0, 2)
  const items = types.map((t) => {
    for (;;) {
      const w = int(rng, 0, 5), a = int(rng, 0, 9), b = int(rng, 1, 8)
      if (a === b) continue
      if (t === 0) {
        const dec = `${w}{,}${a}(${b})`
        const x = 90 * w + 9 * a + b
        return { eq: `${dec} = \\frac{x}{90}`, dec, x, extra: gcd(x, 90) > 1 ? ` = \\frac{${x}}{90}` : '', check: () => close(decVal(dec), x / 90) }
      }
      if (t === 1) {
        const d = pick(rng, [3, 6])
        const dec = `${w}{,}(${d})`
        const x = 3 * w + d / 3
        return { eq: `${dec} = \\frac{x}{3}`, dec, x, extra: '', check: () => close(decVal(dec), x / 3) }
      }
      const dec = `${w}{,}${a}(${b})`
      const [N, Dd] = parseDec(dec)
      if (Dd > 30) continue
      return { eq: `${dec} = \\frac{${N}}{x}`, dec, x: Dd, extra: '', check: () => close(decVal(dec), N / Dd) }
    }
  })
  return {
    text: `Aflați numărul natural $x$ dacă: ${items.map((it, i) => `${L[i]}) $${it.eq}$`).join('; ')}.`,
    solution: lines(
      'Transformăm fracția periodică în fracție ordinară și o comparăm cu cea dată.',
      ...items.map((it, i) => `${L[i]}) $${perToFrac(it.dec)}${it.extra}$, deci $x = ${it.x}$.`),
    ),
    verify: () => items.every((it) => it.check()),
  }
}

/** a,(b) + b,(a) = S, or c,(a) + d,(a) + b,(a) = N: all the digits, p. 71, ex. 11. */
export function perDigitSwapSum(rng: Rng): Made {
  if (rng() < 0.5) {
    for (;;) {
      const s = int(rng, 3, 16)
      const pairs: [number, number][] = []
      for (let a = 1; a <= 8; a++) if (s - a >= 1 && s - a <= 8) pairs.push([a, s - a])
      if (pairs.length < 2) continue
      const S = ratTex(10 * s, 9)
      return {
        text: `Aflați cifrele $a$ și $b$ știind că $\\overline{a{,}(b)} + \\overline{b{,}(a)} = ${S}$ (găsiți toate soluțiile).`,
        solution: lines(
          show(`\\overline{a{,}(b)} + \\overline{b{,}(a)} = a + \\frac{b}{9} + b + \\frac{a}{9} = (a + b) + \\frac{a + b}{9} = \\frac{10 \\cdot (a + b)}{9}`),
          show(`${perToFrac(S)}, \\qquad 10 \\cdot (a + b) = ${10 * s}, \\qquad a + b = ${s}`),
          `Cifrele (de la 1 la 8, perioada nu poate fi 0 sau 9) cu suma ${s}: ${pairs.map(([a, b]) => `$(${a}, ${b})$`).join(', ')}.`,
        ),
        verify: () => {
          const found: string[] = []
          for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) if (close(a + b / 9 + b + a / 9, decVal(S))) found.push(`${a},${b}`)
          return found.join(';') === pairs.map((p) => p.join(',')).join(';')
        },
      }
    }
  }
  for (;;) {
    const c = int(rng, 1, 5), d = int(rng, c + 1, 7), b0 = int(rng, 0, 9), a0 = pick(rng, [3, 6])
    const N = c + d + b0 + a0 / 3
    const sols: [number, number][] = []
    for (const a of [3, 6]) {
      const b = N - c - d - a / 3
      if (b >= 0 && b <= 9) sols.push([a, b])
    }
    return {
      text: `Aflați cifrele $a$ și $b$ știind că $\\overline{${c}{,}(a)} + \\overline{${d}{,}(a)} + \\overline{b{,}(a)} = ${N}$ (găsiți toate soluțiile).`,
      solution: lines(
        show(`\\overline{${c}{,}(a)} + \\overline{${d}{,}(a)} + \\overline{b{,}(a)} = ${c} + ${d} + b + 3 \\cdot \\frac{a}{9} = ${c + d} + b + \\frac{a}{3}`),
        `Rezultatul ${N} este număr natural, deci $\\frac{a}{3}$ este natural; cum perioada nu poate fi 0 sau 9, $a \\in \\{3, 6\\}$.`,
        ...[3, 6].map((a) => {
          const b = N - c - d - a / 3
          return b >= 0 && b <= 9 ? `Pentru $a = ${a}$: $b = ${N} - ${c + d} - ${a / 3} = ${b}$.` : `Pentru $a = ${a}$: $b = ${N} - ${c + d} - ${a / 3} = ${b}$, care nu este cifră.`
        }),
        `Soluții: ${sols.map(([a, b]) => `$a = ${a}, b = ${b}$`).join('; ')}.`,
      ),
      verify: () => {
        const found: string[] = []
        for (let a = 1; a <= 8; a++) for (let b = 0; b <= 9; b++) if (close(c + d + b + 3 * a / 9, N)) found.push(`${a},${b}`)
        return found.join(';') === sols.map((p) => p.join(',')).join(';') && sols.length > 0
      },
    }
  }
}

// ================= 4.6 dividing decimals, equations (pp. 66–69) → v-decimal-division =================

/** x : a = b, a : x = b, c·x = d, p. 64, ex. 6; p. 68, ex. 8–9. */
export function divEquation(rng: Rng): Made {
  const a = rqk(rng, 2, 99, int(rng, 1, 2)), b = rqk(rng, 2, 99, int(rng, 0, 1))
  const x1 = mulQ(a, b)
  const x2 = rqk(rng, 2, 99, 1), b2 = rqk(rng, 2, 49, int(rng, 0, 1))
  const a2 = mulQ(x2, b2)
  const x3 = rqk(rng, 2, 999, int(rng, 1, 2)), c = rqk(rng, 2, 99, 1)
  const d3 = mulQ(c, x3)
  return {
    text: `Aflați numărul necunoscut: a) $x : ${T(a)} = ${T(b)}$; b) $${T(a2)} : x = ${T(b2)}$; c) $${T(c)} \\cdot x = ${T(d3)}$.`,
    solution: lines(
      `a) Deîmpărțitul este câtul înmulțit cu împărțitorul: $x = ${T(b)} \\cdot ${T(a)} = ${T(x1)}$.`,
      `b) Împărțitorul este deîmpărțitul împărțit la cât: $x = ${T(a2)} : ${T(b2)} = ${T(x2)}$.`,
      `c) Factorul necunoscut este produsul împărțit la celălalt factor: $x = ${T(d3)} : ${T(c)} = ${T(x3)}$.`,
    ),
    verify: () => close(V(x1) / V(a), V(b)) && close(V(a2) / V(x2), V(b2)) && close(V(c) * V(x3), V(d3)),
  }
}

/** Sour cream in jars, boxes in decigrams on a truck in quintals, bars in grams from tonnes, p. 68, ex. 11–13. */
export function divContainers(rng: Rng): Made {
  const makers = [
    () => {
      const c = pick(rng, [250, 500, 400, 750, 200, 300]), n = int(rng, 6, 60)
      const M = n * c
      const what = pick(rng, [['smântână', 'borcane'], ['miere', 'borcane'], ['dulceață', 'borcane'], ['brânză', 'cutii']])
      return {
        t: `$${D(M, 3)}$ kg de ${what[0]} se pun în ${what[1]} de câte $${D(c, 3)}$ kg. Câte ${what[1]} se folosesc?`,
        s: show(`${D(M, 3)} : ${D(c, 3)} = ${nr(M)} : ${c} = ${n}`),
        ok: () => close(n * c / 1000, M / 1000),
      }
    },
    () => {
      for (;;) {
        const b = pick(rng, [250, 350, 400, 500, 750, 125, 200]), kg = 10 * int(rng, 10, 500)
        if ((kg * 10000) % b !== 0) continue
        const n = (kg * 10000) / b
        return {
          t: `Câte cutii de câte ${b} dg pot fi transportate de un camion care poate încărca $${D(kg, 2)}$ q?`,
          s: lines(`Transformăm în kilograme: $1\\text{ q} = 100\\text{ kg}$ și $1\\text{ dg} = 0{,}1\\text{ g} = 0{,}0001\\text{ kg}$.`, show(`${D(kg, 2)}\\text{ q} = ${nr(kg)}\\text{ kg}, \\qquad ${b}\\text{ dg} = ${D(b, 4)}\\text{ kg}, \\qquad ${nr(kg)} : ${D(b, 4)} = ${nr(n)}`)),
          ok: () => close((n * b) / 1e6, kg / 100),
        }
      }
    },
    () => {
      for (;;) {
        const g = pick(rng, [50, 100, 125, 200, 250, 80]), n = int(rng, 100, 3000)
        if ((n * g) % 1000 !== 0) continue
        const kg = (n * g) / 1000
        return {
          t: `Câte batoane de ciocolată de câte ${g} g se pot fabrica dintr-o cantitate de $${D(kg, 3)}$ t de ciocolată?`,
          s: show(`${D(kg, 3)}\\text{ t} = ${nr(kg)}\\text{ kg} = ${nr(kg * 1000)}\\text{ g}, \\qquad ${nr(kg * 1000)} : ${g} = ${nr(n)}`),
          ok: () => close(n * g, kg * 1000),
        }
      }
    },
  ]
  const two = shuffle(rng, makers).slice(0, 2).map((f) => f())
  return {
    text: two.map((x, i) => `${L[i]}) ${x.t}`).join(' '),
    solution: lines(...two.map((x, i) => `${L[i]})\n\n${x.s}`)),
    verify: () => two.every((x) => x.ok()),
  }
}

/** a·(x + b) + c = d, a·(x + b) + x + c = d, p. 68, ex. 19. */
export function divEquationBrackets(rng: Rng): Made {
  for (;;) {
    const a = norm(int(rng, 2, 6)), x = rqk(rng, 1, 99, int(rng, 1, 2)), b = rqk(rng, 1, 99, 1), c = rqk(rng, 1, 999, int(rng, 1, 2))
    const withX = rng() < 0.5
    const inner = addQ(x, b)
    const prod = mulQ(a, inner)
    const d = withX ? addQ(addQ(prod, x), c) : addQ(prod, c)
    if (withX) {
      const ab = mulQ(a, b)
      const coef = a.n + 1
      const rhs = subQ(subQ(d, ab), c)
      return {
        text: `Aflați numărul necunoscut: $${a.n} \\cdot (x + ${T(b)}) + x + ${T(c)} = ${T(d)}$.`,
        solution: lines(
          'Desfacem paranteza și grupăm termenii cu $x$:',
          show(`${a.n} \\cdot x + ${T(ab)} + x + ${T(c)} = ${T(d)}`),
          show(`${coef} \\cdot x = ${T(d)} - ${T(ab)} - ${T(c)} = ${T(rhs)}, \\qquad x = ${T(rhs)} : ${coef} = ${T(x)}`),
        ),
        verify: () => close(a.n * (V(x) + V(b)) + V(x) + V(c), V(d)),
      }
    }
    return {
      text: `Aflați numărul necunoscut: $${a.n} \\cdot (x + ${T(b)}) + ${T(c)} = ${T(d)}$.`,
      solution: lines(
        'Mergem de la exterior spre $x$, cu operațiile inverse:',
        show(`${a.n} \\cdot (x + ${T(b)}) = ${T(d)} - ${T(c)} = ${T(prod)}`),
        show(`x + ${T(b)} = ${T(prod)} : ${a.n} = ${T(inner)}, \\qquad x = ${T(inner)} - ${T(b)} = ${T(x)}`),
      ),
      verify: () => close(a.n * (V(x) + V(b)) + V(c), V(d)),
    }
  }
}

/** Two children buy pens: who paid more for one pen, p. 68, ex. 15. */
export function divWhoPaidMore(rng: Rng): Made {
  for (;;) {
    const [A, B] = shuffle(rng, NAMES).slice(0, 2)
    const n1 = int(rng, 2, 12), n2 = int(rng, 2, 15), p1 = 10 * int(rng, 12, 60), p2 = 10 * int(rng, 12, 60)
    if (p1 === p2 || n1 === n2) continue
    const what = pick(rng, [['pixuri', 'pix'], ['caiete', 'caiet'], ['creioane', 'creion'], ['radiere', 'radieră']])
    const hi = p1 > p2 ? A : B
    return {
      text: `${A} a cumpărat ${n1} ${what[0]}, pe care a plătit ${lei(n1 * p1)}, iar ${B} a luat ${n2} ${what[0]} cu ${lei(n2 * p2)}. Care dintre ei a plătit mai mult pe un ${what[1]} și cu cât?`,
      solution: lines(
        show(`${leiM(n1 * p1)} : ${n1} = ${leiM(p1)}\\text{ lei}, \\qquad ${leiM(n2 * p2)} : ${n2} = ${leiM(p2)}\\text{ lei}`),
        `${hi} a plătit mai mult, cu $${leiM(Math.max(p1, p2))} - ${leiM(Math.min(p1, p2))} = ${leiM(Math.abs(p1 - p2))}$ lei pe ${what[1]}.`,
      ),
      verify: () => close((n1 * p1) / n1 - (n2 * p2) / n2, p1 - p2) && (hi === A) === (p1 > p2),
    }
  }
}

/** How many bags fit in N trucks of C kg, when k bags weigh W t, p. 69, ex. 22. */
export function divBagsTrucks(rng: Rng): Made {
  for (;;) {
    const bag = pick(rng, [20, 25, 40, 50]), k = int(rng, 3, 12), N = int(rng, 2, 8), C = 10 * int(rng, 50, 200)
    if (C % bag !== 0) continue
    const W = k * bag
    return {
      text: `Câți saci cu ciment intră în ${N} camioane, știind că un camion poate încărca ${C} kg, iar ${k} saci cântăresc $${D(W, 3)}$ t?`,
      solution: lines(
        show(`${D(W, 3)}\\text{ t} = ${W}\\text{ kg}, \\qquad \\text{un sac: } ${W} : ${k} = ${bag}\\text{ kg}`),
        show(`\\text{intr-un camion: } ${C} : ${bag} = ${C / bag}\\text{ saci}, \\qquad ${N} \\cdot ${C / bag} = ${N * C / bag}\\text{ saci}`),
      ),
      verify: () => close((N * C) / ((W / 1000) * 1000 / k), (N * C) / bag),
    }
  }
}

/** a·x + b = c·x + d, p·(x + q) + r·x = s·x + t, p. 69, ex. 21. */
export function divEquationBothSides(rng: Rng): Made {
  for (;;) {
    const x = rqk(rng, 2, 99, 1)
    if (rng() < 0.5) {
      const a = rqk(rng, 11, 89, 1), c = rqk(rng, 1, 79, 1), b = rqk(rng, 1, 199, 1)
      if (V(a) <= V(c)) continue
      const d = subQ(addQ(mulQ(a, x), b), mulQ(c, x))
      if (d.n <= 0) continue
      const k = subQ(a, c), rhs = subQ(d, b)
      if (rhs.n <= 0) continue
      return {
        text: `Determinați numărul necunoscut: $${T(a)}x + ${T(b)} = ${T(c)}x + ${T(d)}$.`,
        solution: lines(
          'Trecem termenii cu $x$ în stânga și numerele în dreapta:',
          show(`${T(a)}x - ${T(c)}x = ${T(d)} - ${T(b)}, \\qquad ${T(k)}x = ${T(rhs)}, \\qquad x = ${T(rhs)} : ${T(k)} = ${T(x)}`),
        ),
        verify: () => close(V(a) * V(x) + V(b), V(c) * V(x) + V(d)),
      }
    }
    const p = norm(int(rng, 2, 6)), q = rqk(rng, 1, 99, 1), r = rqk(rng, 1, 29, 1), s = rqk(rng, 1, 49, 1)
    const coef = subQ(addQ(p, r), s)
    if (coef.n <= 0) continue
    const pq = mulQ(p, q)
    const t = subQ(addQ(addQ(mulQ(p, x), pq), mulQ(r, x)), mulQ(s, x))
    const rhs = subQ(t, pq)
    if (t.n <= 0 || rhs.n <= 0) continue
    return {
      text: `Determinați numărul necunoscut: $${p.n} \\cdot (x + ${T(q)}) + ${T(r)}x = ${T(s)}x + ${T(t)}$.`,
      solution: lines(
        'Desfacem paranteza, apoi trecem termenii cu $x$ în stânga:',
        show(`${p.n}x + ${T(pq)} + ${T(r)}x = ${T(s)}x + ${T(t)}`),
        show(`${p.n}x + ${T(r)}x - ${T(s)}x = ${T(t)} - ${T(pq)}, \\qquad ${T(coef)}x = ${T(rhs)}, \\qquad x = ${T(x)}`),
      ),
      verify: () => close(p.n * (V(x) + V(q)) + V(r) * V(x), V(s) * V(x) + V(t)),
    }
  }
}

/** x·s + x·2s + … + x·ns = S, p. 69, ex. 26 b. */
export function divEquationSeries(rng: Rng): Made {
  const s = pick(rng, [norm(1, 1), norm(2, 1), norm(3, 1), norm(5, 1), norm(5, 2), norm(4, 1)]), n = int(rng, 4, 12)
  const x = rqk(rng, 2, 99, int(rng, 0, 1))
  const g = (n * (n + 1)) / 2
  const sg = mulQ(s, norm(g))
  const S = mulQ(x, sg)
  const t = (i: number) => T(mulQ(s, norm(i)))
  return {
    text: `Aflați $x$ dacă $x \\cdot ${t(1)} + x \\cdot ${t(2)} + \\ldots + x \\cdot ${t(n)} = ${T(S)}$.`,
    solution: lines(
      'Scoatem $x$ factor comun, apoi suma rămasă o calculăm scoțând factor comun pe ' + `$${T(s)}$:`,
      show(`x \\cdot (${t(1)} + ${t(2)} + \\ldots + ${t(n)}) = x \\cdot ${T(s)} \\cdot (1 + 2 + \\ldots + ${n}) = x \\cdot ${T(s)} \\cdot ${g} = x \\cdot ${T(sg)}`),
      show(`x \\cdot ${T(sg)} = ${T(S)}, \\qquad x = ${T(S)} : ${T(sg)} = ${T(x)}`),
    ),
    verify: () => close(sum(Array.from({ length: n }, (_, i) => V(x) * (i + 1) * V(s))), V(S)),
  }
}

/** An empty truck, the same truck with N bags, the empty bag: what one bag holds, p. 69, ex. 23. */
export function divTruckBags(rng: Rng): Made {
  for (;;) {
    const E = 100 * int(rng, 15, 50), N = int(rng, 20, 60), c = 5 * int(rng, 8, 14), w = pick(rng, [1, 2, 0.5, 1.5])
    const load = N * (c + w)
    if (!Number.isInteger(load)) continue
    const F = E + load
    const what = pick(rng, ['porumb', 'grâu', 'cartofi', 'orz'])
    const ft = Math.floor(F / 1000), fk = F % 1000
    const wq = norm(Math.round(w * 10), 1)
    return {
      text: `Un autocamion gol cântărește $${D(E, 3)}$ t, iar încărcat cu ${de(N)} saci de ${what} cântărește ${ft} t${fk ? ` și ${fk} kg` : ''}. Câte kilograme de ${what} sunt într-un sac, dacă un sac gol cântărește $${T(wq)}$ kg?`,
      solution: lines(
        show(`${D(E, 3)}\\text{ t} = ${nr(E)}\\text{ kg}, \\qquad ${ft}\\text{ t}${fk ? ` \\ ${fk}\\text{ kg}` : ''} = ${nr(F)}\\text{ kg}`),
        show(`\\text{sacii plini: } ${nr(F)} - ${nr(E)} = ${nr(load)}\\text{ kg}, \\qquad \\text{un sac plin: } ${nr(load)} : ${N} = ${T(norm(Math.round((c + w) * 10), 1))}\\text{ kg}`),
        show(`${T(norm(Math.round((c + w) * 10), 1))} - ${T(wq)} = ${c}\\text{ kg}`),
      ),
      verify: () => close((F - E) / N - w, c),
    }
  }
}

// ================= 4.7 the arithmetic mean (pp. 69–70) → v-mean-applied =================

const SUBJECTS = ['matematică', 'română', 'geografie', 'istorie', 'biologie', 'engleză']

/** The mean of the marks of two pupils, p. 69, ex. 9–10. */
export function meanGrades(rng: Rng): Made {
  const subj = pick(rng, SUBJECTS)
  const sets = [0, 1].map(() => {
    const n = pick(rng, [2, 4, 5])
    return Array.from({ length: n }, () => int(rng, 4, 10))
  })
  const means = sets.map((s) => (sum(s) * 100) / s.length)
  return {
    text: `Ce medie are la ${subj} un elev cu notele ${sets[0].join(', ')}? Dar un elev cu notele ${sets[1].join(', ')}?`,
    solution: lines(...sets.map((s, i) => show(`m_${i + 1} = (${s.join(' + ')}) : ${s.length} = ${sum(s)} : ${s.length} = ${D(means[i], 2)}`))),
    verify: () => sets.every((s, i) => close(sum(s) / s.length, means[i] / 100)),
  }
}

const MULTW: Record<number, string> = { 2: 'dublul său', 3: 'triplul său', 4: 'împătritul său' }

/** The mean of a number and its double (triple…) is m, p. 70, ex. 12. */
export function meanNumberTriple(rng: Rng): Made {
  const k = int(rng, 2, 4), x = rqk(rng, 2, 400, int(rng, 0, 1))
  const S = mulQ(x, norm(k + 1))
  const m = mulQ(S, norm(5, 1))
  return {
    text: `Media aritmetică dintre un număr și ${MULTW[k]} este $${T(m)}$. Care este numărul?`,
    solution: lines(
      `Suma celor două numere este $${T(m)} \\cdot 2 = ${T(S)}$. Numărul și ${MULTW[k]} înseamnă $1 + ${k} = ${k + 1}$ părți egale:`,
      show(`${T(S)} : ${k + 1} = ${T(x)}`),
      `Verificare: $(${T(x)} + ${T(mulQ(x, norm(k)))}) : 2 = ${T(m)}$.`,
    ),
    verify: () => close((V(x) + k * V(x)) / 2, V(m)),
  }
}

/** The mark needed for a wished mean, p. 70, ex. 11 and ex. 20. */
export function meanNeededGrade(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 2, 3)
    const marks = Array.from({ length: n }, () => int(rng, 4, 10))
    const M = int(rng, 6, 10)
    const need = M * (n + 1) - sum(marks)
    if (need < 4 || need > 10 || M * n <= sum(marks)) continue
    const subj = pick(rng, SUBJECTS)
    const cur = ratTex(sum(marks), n)
    return {
      text: `Un elev are la ${subj} notele ${marks.join(', ')}. Ce medie are acum? Ce notă trebuie să mai ia ca să obțină media ${M}?`,
      solution: lines(
        show(`m = (${marks.join(' + ')}) : ${n} = ${sum(marks)} : ${n} = ${cur}`),
        `Cu încă o notă vor fi ${n + 1} note, iar media ${M} cere suma $${M} \\cdot ${n + 1} = ${M * (n + 1)}$.`,
        show(`${M * (n + 1)} - ${sum(marks)} = ${need}`),
        `Trebuie să ia nota ${need}.`,
      ),
      verify: () => (sum(marks) + need) / (n + 1) === M && close(decVal(cur), sum(marks) / n),
    }
  }
}

/** The mean of two numbers and their difference, or the quotient and remainder of one by the other, p. 70, ex. 17–18. */
export function meanDiffOrQuotient(rng: Rng): Made {
  if (rng() < 0.5) {
    const x = int(rng, 1, 200), d = int(rng, 1, 80)
    const S = 2 * x + d
    return {
      text: `Media aritmetică a două numere este $${D(5 * S, 1)}$. Aflați numerele, dacă unul este cu ${d} mai mare decât celălalt.`,
      solution: lines(
        show(`\\text{suma: } ${D(5 * S, 1)} \\cdot 2 = ${S}`),
        'Dacă din sumă scădem diferența, rămâne dublul numărului mai mic:',
        show(`(${S} - ${d}) : 2 = ${x}, \\qquad ${x} + ${d} = ${x + d}`),
        `Numerele sunt ${x} și ${x + d}.`,
      ),
      verify: () => (x + x + d) / 2 === S / 2 && x + d - x === d,
    }
  }
  for (;;) {
    const y = int(rng, 3, 60), q = int(rng, 2, 6), r = int(rng, 1, y - 1)
    const a = q * y + r, S = a + y
    return {
      text: `Media aritmetică a două numere naturale este $${D(5 * S, 1)}$. Aflați numerele, dacă împărțind unul la celălalt obținem câtul ${q} și restul ${r}.`,
      solution: lines(
        show(`\\text{suma: } ${D(5 * S, 1)} \\cdot 2 = ${S}`),
        `Numărul mare este de ${q} ori numărul mic, plus ${r}. Deci suma înseamnă $${q + 1}$ numere mici plus ${r}:`,
        show(`(${S} - ${r}) : ${q + 1} = ${y}, \\qquad ${q} \\cdot ${y} + ${r} = ${a}`),
        `Numerele sunt ${a} și ${y} (restul ${r} < ${y}).`,
      ),
      verify: () => Math.floor(a / y) === q && a % y === r && (a + y) / 2 === S / 2,
    }
  }
}

/** Consecutive naturals (odd, even) with a given mean, p. 70, ex. 21. */
export function meanConsecutive(rng: Rng): Made {
  const types = shuffle(rng, [0, 1, 2, 3]).slice(0, 2)
  const items = types.map((t) => {
    if (t === 0) {
      const m = int(rng, 2, 300)
      return { q: `trei numere naturale consecutive a căror medie aritmetică este ${m}`, nums: [m - 1, m, m + 1], why: `Media a trei numere consecutive este numărul din mijloc, ${m}.`, ask: 'all' }
    }
    if (t === 1) {
      const x = int(rng, 2, 300)
      return { q: `patru numere naturale consecutive a căror medie aritmetică este $${D(10 * x + 5, 1)}$`, nums: [x - 1, x, x + 1, x + 2], why: `Media este la jumătatea distanței dintre cele două numere din mijloc, deci acestea sunt ${x} și ${x + 1}.`, ask: 'all' }
    }
    if (t === 2) {
      const n = pick(rng, [4, 6]), m = 2 * int(rng, 4, 100)
      const nums = Array.from({ length: n }, (_, i) => m - (n - 1) + 2 * i)
      return { q: `${n === 4 ? 'patru' : 'șase'} numere naturale impare consecutive a căror medie aritmetică este ${m}`, nums, why: `Numerele sunt așezate simetric față de ${m}: cele din mijloc sunt ${m - 1} și ${m + 1}.`, ask: 'all' }
    }
    const m = 2 * int(rng, 4, 100) + 1
    const nums = [m - 3, m - 1, m + 1, m + 3]
    return { q: `cel mai mare dintre patru numere pare consecutive a căror medie aritmetică este ${m}`, nums, why: `Numerele sunt așezate simetric față de ${m}: cele din mijloc sunt ${m - 1} și ${m + 1}.`, ask: 'max' }
  })
  return {
    text: `Aflați: ${items.map((it, i) => `${L[i]}) ${it.q}`).join('; ')}.`,
    solution: lines(...items.map((it, i) => `${L[i]}) ${it.why} ${it.ask === 'max' ? `Numerele sunt ${it.nums.join(', ')}, iar cel mai mare este ${it.nums[3]}.` : `Numerele sunt ${it.nums.join(', ')}.`}`)),
    verify: () => items.every((it) => it.nums.every((v, i) => i === 0 || v - it.nums[i - 1] === it.nums[1] - it.nums[0]) && it.nums[0] >= 0),
  }
}

/** The mean of three numbers; the second is d more than the first, the third k times the first, p. 70, ex. 22. */
export function meanThreeRelations(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 5, 200), d = int(rng, 1, 80), k = int(rng, 2, 4)
    const S = a * (k + 2) + d
    if (S % 3 !== 0) continue
    const m = S / 3
    return {
      text: `Media aritmetică a trei numere este $${D(m, 1)}$. Al doilea este cu $${D(d, 1)}$ mai mare decât primul, iar al treilea este de ${k} ori mai mare decât primul. Aflați numerele.`,
      solution: lines(
        show(`\\text{suma: } ${D(m, 1)} \\cdot 3 = ${D(S, 1)}`),
        `Dacă primul număr este o parte, al doilea este o parte plus $${D(d, 1)}$, iar al treilea ${k} părți: în total $${k + 2}$ părți plus $${D(d, 1)}$.`,
        show(`(${D(S, 1)} - ${D(d, 1)}) : ${k + 2} = ${D(a, 1)}, \\qquad ${D(a, 1)} + ${D(d, 1)} = ${D(a + d, 1)}, \\qquad ${k} \\cdot ${D(a, 1)} = ${D(k * a, 1)}`),
        `Numerele sunt $${D(a, 1)}$, $${D(a + d, 1)}$ și $${D(k * a, 1)}$.`,
      ),
      verify: () => close((a + a + d + k * a) / 30, m / 10),
    }
  }
}

/** n numbers with mean M, the first p with mean A, the last r with mean B: the one in the middle, p. 70, ex. 27. */
export function meanMiddle(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 3), r = int(rng, 2, 3), n = p + r + 1
    const A = int(rng, 5, 99), B = int(rng, 5, 99), c = int(rng, 1, 99)
    const tot = p * A + r * B + c
    if ((tot * 10) % n !== 0) continue
    const M = (tot * 10) / n
    return {
      text: `Media aritmetică a ${n} numere este $${D(M, 2)}$. Media aritmetică a primelor ${p} numere este $${D(A, 1)}$, iar media aritmetică a ultimelor ${r} numere este $${D(B, 1)}$. Aflați numărul din mijloc (al ${p === 2 ? 'treilea' : 'patrulea'}).`,
      solution: lines(
        show(`\\text{suma tuturor: } ${D(M, 2)} \\cdot ${n} = ${D(tot, 1)}`),
        show(`\\text{primele ${p}: } ${D(A, 1)} \\cdot ${p} = ${D(p * A, 1)}, \\qquad \\text{ultimele ${r}: } ${D(B, 1)} \\cdot ${r} = ${D(r * B, 1)}`),
        show(`${D(tot, 1)} - ${D(p * A, 1)} - ${D(r * B, 1)} = ${D(c, 1)}`),
      ),
      verify: () => close(((p * A + r * B + c) / 10) / n, M / 100),
    }
  }
}

/** The mean of three numbers is m; the third is k times smaller than the sum of the first two, p. 70, ex. 26. */
export function meanThirdFraction(rng: Rng): Made {
  let t: number, k: number, S: number
  do {
    t = int(rng, 2, 300)
    k = int(rng, 2, 6)
    S = t * (k + 1)
  } while (S % 3 !== 0)
  const m3 = S
  return {
    text: `Media aritmetică a trei numere este $${ratTex(m3, 3).replace(/^(\d+)$/, '$1')}$. Al treilea număr este de ${k} ori mai mic decât suma primelor două. Aflați al treilea număr și suma primelor două.`,
    solution: lines(
      show(`\\text{suma celor trei: } ${ratTex(m3, 3)} \\cdot 3 = ${S}`),
      `Suma primelor două este de ${k} ori al treilea număr, deci suma tuturor înseamnă $${k} + 1 = ${k + 1}$ părți egale:`,
      show(`${S} : ${k + 1} = ${t}, \\qquad ${S} - ${t} = ${S - t}`),
      `Al treilea număr este ${t}, iar suma primelor două este ${S - t}.`,
    ),
    verify: () => close(decVal(ratTex(m3, 3)) * 3, S) && (S - t) === k * t,
  }
}

// ================= 4.10 arithmetic methods (pp. 74–76) → v-decimal-methods =================

const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

/** A film with commercials: when does it end, p. 75, ex. 2. */
export function methFilmEnd(rng: Rng): Made {
  for (;;) {
    const h = int(rng, 1, 2), mm = 5 * int(rng, 0, 11), ad = 5 * int(rng, 1, 6)
    const start = 5 * int(rng, 12 * 12, 22 * 12)
    const dur = 60 * h + mm + ad
    const end = start + dur
    if (end >= 24 * 60) continue
    return {
      text: `Un film care durează ${h === 1 ? 'o oră' : '2 ore'}${mm ? ` și ${de(mm)} minute` : ''} are ${de(ad)} minute de reclamă și începe la ora ${hm(start)}. La ce oră se termină?`,
      solution: lines(
        show(`${h}\\text{ h}${mm ? ` \\ ${mm}\\text{ min}` : ''} + ${ad}\\text{ min} = ${dur}\\text{ min} = ${Math.floor(dur / 60)}\\text{ h}${dur % 60 ? ` \\ ${dur % 60}\\text{ min}` : ''}`),
        `Adunăm durata la ora de început: filmul se termină la ora ${hm(end)}.`,
      ),
      verify: () => (end - start) === 60 * h + mm + ad && hm(end) === `${Math.floor(end / 60)}:${String(end % 60).padStart(2, '0')}`,
    }
  }
}

/** An alarm every k minutes from a full hour: how many times it rings between two moments, p. 75, ex. 3. */
export function methAlarm(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [5, 10, 15, 20, 6, 12]), H = int(rng, 6, 18)
    const start = 60 * H
    const t1 = start + int(rng, 1, 90), t2 = t1 + int(rng, 30, 150)
    if (t2 >= 24 * 60) continue
    const first = start + Math.ceil((t1 - start) / k) * k
    const last = start + Math.floor((t2 - start) / k) * k
    const n = (last - first) / k + 1
    if (n < 2) continue
    return {
      text: `Alarma telefonului sună la fiecare ${de(k)} minute, începând cu ora ${hm(start)}. De câte ori va suna între orele ${hm(t1)} și ${hm(t2)}?`,
      solution: lines(
        `Alarma sună la ${hm(start)}, ${hm(start + k)}, ${hm(start + 2 * k)}, … adică la ore aflate la multipli de ${k} minute după ${hm(start)}.`,
        `În acest interval, prima sunare este la ${hm(first)}, iar ultima la ${hm(last)}.`,
        show(`(${last - start} - ${first - start}) : ${k} + 1 = ${(last - first) / k} + 1 = ${n}`),
        `Alarma sună de ${n} ori.`,
      ),
      verify: () => {
        let c = 0
        for (let t = start; t <= t2; t += k) if (t >= t1) c++
        return c === n
      },
    }
  }
}

/** An empty box and n packets of g grams: the full box, or the packet from the full box, p. 75, ex. 1. */
export function methBoxPackets(rng: Rng): Made {
  const b = 10 * int(rng, 5, 60), n = int(rng, 12, 80), g = 5 * int(rng, 5, 100)
  const full = b + n * g
  if (rng() < 0.5) {
    return {
      text: `Într-o cutie goală care cântărește $${D(b, 3)}$ kg se pun ${de(n)} pachete. Știind că un pachet cântărește ${g} g, aflați masa cutiei pline (în kilograme).`,
      solution: lines(
        show(`${n} \\cdot ${g} = ${nr(n * g)}\\text{ g} = ${D(n * g, 3)}\\text{ kg}`),
        show(`${D(b, 3)} + ${D(n * g, 3)} = ${D(full, 3)}\\text{ kg}`),
      ),
      verify: () => close(b / 1000 + (n * g) / 1000, full / 1000),
    }
  }
  return {
    text: `O cutie plină cu ${de(n)} pachete la fel cântărește $${D(full, 3)}$ kg, iar cutia goală cântărește $${D(b, 3)}$ kg. Câte grame cântărește un pachet?`,
    solution: lines(
      show(`${D(full, 3)} - ${D(b, 3)} = ${D(n * g, 3)}\\text{ kg} = ${nr(n * g)}\\text{ g}`),
      show(`${nr(n * g)} : ${n} = ${g}\\text{ g}`),
    ),
    verify: () => close((full - b) / n, g),
  }
}

/** The sum of two numbers; the first is d more than k times the second (or a + 2b = S, a = k·b), p. 75, ex. 5 and ex. 14. */
export function methSumMultiple(rng: Rng): Made {
  if (rng() < 0.5) {
    const k = int(rng, 2, 3), b = int(rng, 1, 300), d = int(rng, 1, 90)
    const a = k * b + d, S = a + b
    return {
      text: `Suma a două numere este $${D(S, 1)}$. Primul număr este cu $${D(d, 1)}$ mai mare decât ${k === 2 ? 'dublul' : 'triplul'} celui de-al doilea. Aflați cele două numere.`,
      solution: lines(
        `Al doilea număr este o parte, iar primul ${k} părți și încă $${D(d, 1)}$. Suma înseamnă $${k + 1}$ părți și $${D(d, 1)}$:`,
        show(`(${D(S, 1)} - ${D(d, 1)}) : ${k + 1} = ${D(b, 1)}, \\qquad ${k} \\cdot ${D(b, 1)} + ${D(d, 1)} = ${D(a, 1)}`),
        `Numerele sunt $${D(a, 1)}$ și $${D(b, 1)}$.`,
      ),
      verify: () => close((a + b) / 10, S / 10) && a - k * b === d,
    }
  }
  const k = int(rng, 3, 9), b = int(rng, 1, 99)
  const a = k * b, S = a + 2 * b
  return {
    text: `Suma dintre un număr $a$ și dublul unui număr $b$ este $${D(S, 2)}$. Primul număr este de ${k} ori mai mare decât al doilea. Aflați cele două numere.`,
    solution: lines(
      `Dacă $b$ este o parte, $a$ are ${k} părți, iar dublul lui $b$ are 2 părți: în total $${k + 2}$ părți.`,
      show(`b = ${D(S, 2)} : ${k + 2} = ${D(b, 2)}, \\qquad a = ${k} \\cdot ${D(b, 2)} = ${D(a, 2)}`),
    ),
    verify: () => close((a + 2 * b) / 100, S / 100) && a === k * b,
  }
}

/** Three numbers: the sum; the first d1 less than double the second, the second d2 more than the third, p. 75, ex. 9. */
export function methThreeNumbers(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 1, 60), d2 = int(rng, 1, 40), d1 = int(rng, 1, 40)
    const s2 = t + d2, f = 2 * s2 - d1
    if (f <= 0) continue
    const S = f + s2 + t
    return {
      text: `Suma a trei numere este $${D(S, 1)}$. Primul număr este cu $${D(d1, 1)}$ mai mic decât dublul celui de-al doilea, iar al doilea este cu $${D(d2, 1)}$ mai mare decât al treilea. Aflați cele trei numere.`,
      solution: lines(
        `Luăm al treilea număr ca o parte. Al doilea este o parte și $${D(d2, 1)}$, iar primul este două părți și $${D(2 * d2, 1)} - ${D(d1, 1)}$.`,
        show(`4 \\text{ parti} = ${D(S, 1)} - ${D(d2, 1)} - ${D(2 * d2, 1)} + ${D(d1, 1)} = ${D(4 * t, 1)}, \\qquad \\text{o parte} = ${D(t, 1)}`),
        `Numerele sunt $${D(f, 1)}$, $${D(s2, 1)}$ și $${D(t, 1)}$.`,
      ),
      verify: () => f + s2 + t === S && f === 2 * s2 - d1 && s2 === t + d2,
    }
  }
}

/** n people, the same sum spent by each, what is left to each: how much each had, p. 75, ex. 7. */
export function methSameSpent(rng: Rng): Made {
  const n = int(rng, 2, 4)
  const who = shuffle(rng, NAMES).slice(0, n)
  const s = 10 * int(rng, 50, 400)
  const left = Array.from({ length: n }, () => 10 * int(rng, 20, 400))
  const had = left.map((r) => r + s)
  const total = sum(had)
  return {
    text: `${who.slice(0, -1).join(', ')} și ${who[n - 1]} au împreună ${lei(total)}. După ce fiecare cheltuiește aceeași sumă de bani, ${who.map((w, i) => `${w} rămâne cu ${lei(left[i])}`).join(', ')}. Ce sumă a avut la început fiecare?`,
    solution: lines(
      show(`\\text{au ramas: } ${left.map(leiM).join(' + ')} = ${leiM(sum(left))}\\text{ lei}`),
      show(`\\text{au cheltuit: } ${leiM(total)} - ${leiM(sum(left))} = ${leiM(total - sum(left))}\\text{ lei}, \\qquad \\text{fiecare: } ${leiM(total - sum(left))} : ${n} = ${leiM(s)}\\text{ lei}`),
      who.map((w, i) => `${w}: $${leiM(left[i])} + ${leiM(s)} = ${leiM(had[i])}$ lei`).join('; ') + '.',
    ),
    verify: () => sum(had) === total && had.every((h, i) => h - left[i] === (total - sum(left)) / n),
  }
}

/** p% of a number is d more than a k-th of it; p% of a number is d less than the number, p. 74, Testul 2, ex. 4; Testul 3, ex. 6. */
export function methPercent(rng: Rng): Made {
  if (rng() < 0.5) {
    for (;;) {
      const p = pick(rng, [30, 40, 45, 50, 60, 75, 80]), k = pick(rng, [3, 4, 5, 10, 8])
      if (p * k <= 100) continue
      const x = int(rng, 2, 400)
      const num = x * (p * k - 100)
      if (num % k !== 0) continue
      const d = num / k
      const kw: Record<number, string> = { 3: 'o treime', 4: 'un sfert', 5: 'o cincime', 8: 'o optime', 10: 'o zecime' }
      return {
        text: `Aflați un număr știind că ${p}% din el este cu $${D(d, 2)}$ mai mare decât ${kw[k]} din el.`,
        solution: lines(
          `Notăm numărul cu $x$. Atunci $\\frac{${p}}{100} \\cdot x - \\frac{1}{${k}} \\cdot x = ${D(d, 2)}$.`,
          show(`${frac(p, 100)} - \\frac{1}{${k}} = ${frac(p * k - 100, 100 * k)}, \\qquad x = ${D(d, 2)} : ${frac(p * k - 100, 100 * k)} = ${x}`),
        ),
        verify: () => close((p / 100) * x - x / k, d / 100),
      }
    }
  }
  const p = pick(rng, [5, 10, 15, 20, 25, 35, 45, 55, 60, 75]), x = int(rng, 2, 600)
  const d = x * (100 - p)
  return {
    text: `Aflați un număr știind că ${p}% din el este cu $${D(d, 2)}$ mai mic decât numărul.`,
    solution: lines(
      `Dacă ${p}% din număr este cu $${D(d, 2)}$ mai mic decât numărul, atunci $${D(d, 2)}$ reprezintă $100\\% - ${p}\\% = ${100 - p}\\%$ din număr.`,
      show(`x = ${D(d, 2)} : \\frac{${100 - p}}{100} = ${D(d, 2)} \\cdot \\frac{100}{${100 - p}} = ${x}`),
    ),
    verify: () => close(x - (p / 100) * x, d / 100),
  }
}

const PAIRS: [string, string, string, string][] = [
  ['caiete', 'caiet', 'pixuri', 'pix'], ['creioane', 'creion', 'radiere', 'radieră'], ['cărți', 'carte', 'reviste', 'revistă'],
  ['sucuri', 'suc', 'sandvișuri', 'sandviș'], ['bilete de film', 'bilet de film', 'pungi cu floricele', 'pungă cu floricele'],
]

/** a items A + b items B = T1, c items A + b items B = T2 (the same number of B), p. 75, ex. 11. */
export function methCompareSame(rng: Rng): Made {
  for (;;) {
    const [Am, A1, Bm, B1] = pick(rng, PAIRS)
    const a = int(rng, 2, 6), c = int(rng, a + 1, 10), b = int(rng, 2, 7)
    const pa = 10 * int(rng, 15, 120), pb = 10 * int(rng, 10, 90)
    const T1 = a * pa + b * pb, T2 = c * pa + b * pb
    const swap = rng() < 0.5
    void B1
    return {
      text: `Pentru ${a} ${Am} și ${b} ${Bm} s-au plătit ${lei(T1)}, iar pentru ${swap ? `${b} ${Bm} și ${c} ${Am}` : `${c} ${Am} și ${b} ${Bm}`} s-au plătit ${lei(T2)}. Cât costă un ${A1} și cât costă un${/ă$/.test(B1) || /e$/.test(B1) && B1 !== 'creion' ? 'a' : ''} ${B1}?`.replace('un carte', 'o carte').replace('una revistă', 'o revistă').replace('una radieră', 'o radieră').replace('una pungă', 'o pungă'),
      solution: lines(
        `În ambele cumpărături sunt ${b} ${Bm}; a doua cumpărătură are în plus $${c} - ${a} = ${c - a}$ ${Am}, care costă diferența:`,
        show(`${leiM(T2)} - ${leiM(T1)} = ${leiM(T2 - T1)}\\text{ lei}, \\qquad ${leiM(T2 - T1)} : ${c - a} = ${leiM(pa)}\\text{ lei}`),
        show(`${leiM(T1)} - ${a} \\cdot ${leiM(pa)} = ${leiM(T1 - a * pa)}\\text{ lei}, \\qquad ${leiM(T1 - a * pa)} : ${b} = ${leiM(pb)}\\text{ lei}`),
        `Un ${A1} costă $${leiM(pa)}$ lei, iar un ${B1} costă $${leiM(pb)}$ lei.`.replace('Un carte', 'O carte').replace('un revistă', 'o revistă').replace('un radieră', 'o radieră').replace('un pungă', 'o pungă'),
      ),
      verify: () => a * pa + b * pb === T1 && c * pa + b * pb === T2,
    }
  }
}

/** k pencils cost as much as a pen, pencil + pen = S, m pens cost as much as n books, p. 75, ex. 16. */
export function methEquivalents(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 6), p = 10 * int(rng, 10, 80), m = int(rng, 5, 20), n = int(rng, 2, 12)
    if (m === n || (m * k * p) % (10 * n) !== 0) continue
    const pen = k * p, S = p + pen, book = (m * pen) / n
    return {
      text: `Cu suma de bani pentru ${k} creioane se poate cumpăra un stilou. Un creion și un stilou costă ${lei(S)}, iar cu suma pentru ${m} stilouri se pot cumpăra ${n} cărți. Cât costă fiecare obiect?`,
      solution: lines(
        `Un stilou costă cât ${k} creioane, deci un creion și un stilou costă cât $${k + 1}$ creioane.`,
        show(`\\text{creionul: } ${leiM(S)} : ${k + 1} = ${leiM(p)}\\text{ lei}, \\qquad \\text{stiloul: } ${k} \\cdot ${leiM(p)} = ${leiM(pen)}\\text{ lei}`),
        show(`\\text{cartea: } ${m} \\cdot ${leiM(pen)} : ${n} = ${leiM(m * pen)} : ${n} = ${leiM(book)}\\text{ lei}`),
      ),
      verify: () => p + k * p === S && n * book === m * pen,
    }
  }
}

/** A part of the money on boots, then two sums, what is left: the money at first, backwards, p. 76, ex. 21. */
export function methHalfThenSpent(rng: Rng): Made {
  for (;;) {
    const f = pick(rng, [2, 3, 4])
    const X = 10 * f * int(rng, 300, 3000)
    const rest = (X * (f - 1)) / f
    const a = 10 * int(rng, 5, Math.floor(rest / 20)), b = 10 * int(rng, 2, Math.floor(rest / 40))
    const r = rest - a - b
    if (r <= 0) continue
    const fw: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'un sfert' }
    const what = pick(rng, [['o pereche de cizme', 'o cămașă', 'alimente'], ['o geacă', 'o carte', 'fructe'], ['un telefon', 'o husă', 'un abonament']])
    return {
      text: `O persoană cumpără ${what[0]} cu ${fw[f]} din suma de bani pe care o are, mai cheltuiește ${lei(a)} pe ${what[1]}, încă ${lei(b)} pe ${what[2]} și îi rămân ${lei(r)}. Ce sumă de bani a avut la început?`,
      solution: lines(
        'Mergem de la sfârșit spre început:',
        show(`${leiM(r)} + ${leiM(b)} + ${leiM(a)} = ${leiM(rest)}\\text{ lei}`),
        f === 2 ? 'Suma aceasta este cealaltă jumătate din bani, deci la început persoana a avut:' : `Suma aceasta este ce a rămas după prima cumpărătură, adică ${f === 3 ? 'două treimi' : 'trei sferturi'} din bani.`,
        show(f === 2 ? `${leiM(rest)} \\cdot 2 = ${leiM(X)}\\text{ lei}` : `${leiM(rest)} : ${f - 1} \\cdot ${f} = ${leiM(X)}\\text{ lei}`),
      ),
      verify: () => X - X / f - a - b === r,
    }
  }
}

/** Two baskets made equal by moving d kg; two barrels made equal by taking dl and adding l, p. 76, ex. 24–25. */
export function methMoveEqual(rng: Rng): Made {
  if (rng() < 0.5) {
    const half = int(rng, 50, 500), d = int(rng, 5, half - 5)
    const S = 2 * half
    return {
      text: `În două coșuri sunt $${D(S, 1)}$ kg de mere. Dacă luăm $${D(d, 1)}$ kg de mere din primul coș și le punem în al doilea, în cele două coșuri vor fi cantități egale. Câte kilograme de mere erau la început în fiecare coș?`,
      solution: lines(
        show(`\\text{la sfarsit, in fiecare cos: } ${D(S, 1)} : 2 = ${D(half, 1)}\\text{ kg}`),
        show(`\\text{primul: } ${D(half, 1)} + ${D(d, 1)} = ${D(half + d, 1)}\\text{ kg}, \\qquad \\text{al doilea: } ${D(half, 1)} - ${D(d, 1)} = ${D(half - d, 1)}\\text{ kg}`),
      ),
      verify: () => half + d - d === half - d + d && (half + d) + (half - d) === S,
    }
  }
  for (;;) {
    const k = int(rng, 2, 4), x = int(rng, 50, 900), b = int(rng, 5, 150)
    const aL = (k - 1) * x - b
    if (aL <= 0) continue
    return {
      text: `Într-un butoi se află de ${k === 2 ? 'două' : k === 3 ? 'trei' : 'patru'} ori mai multă apă decât în altul. Dacă scoatem din primul butoi ${aL} dl de apă și adăugăm în al doilea $${D(b, 1)}$ l, în ambele butoaie vor fi cantități egale de apă. Câți litri de apă erau la început în fiecare butoi?`,
      solution: lines(
        show(`${aL}\\text{ dl} = ${D(aL, 1)}\\text{ l}`),
        `Dacă al doilea butoi are o parte, primul are ${k} părți. Diferența de $${k - 1}$ părți este $${D(aL, 1)} + ${D(b, 1)} = ${D(aL + b, 1)}$ l.`,
        show(`\\text{o parte: } ${D(aL + b, 1)} : ${k - 1} = ${D(x, 1)}\\text{ l}, \\qquad \\text{primul: } ${k} \\cdot ${D(x, 1)} = ${D(k * x, 1)}\\text{ l}`),
      ),
      verify: () => close((k * x - aL) / 10, (x + b) / 10),
    }
  }
}

// ================= 5.3 the length of a segment (pp. 83–85) → v-segment-length =================

const TRIPLES = [['S', 'R', 'T'], ['M', 'N', 'P'], ['A', 'B', 'C'], ['E', 'F', 'G'], ['X', 'Y', 'Z']]

/** S, R, T collinear with SR and ST known: all the values of RT, p. 84, ex. 9. */
export function segTwoSolutions(rng: Rng): Made {
  for (;;) {
    const [S, R, Tt] = pick(rng, TRIPLES)
    const k = int(rng, 0, 1)
    const a = int(rng, 2, 150), b = int(rng, 2, 150)
    if (a === b) continue
    const lo = Math.abs(b - a), hi = a + b
    return {
      text: `Punctele coliniare $${S}$, $${R}$, $${Tt}$ sunt astfel încât $${S}${R} = ${D(a, k)}\\text{ cm}$ și $${S}${Tt} = ${D(b, k)}\\text{ cm}$. Aflați lungimea segmentului $${R}${Tt}$. Dați toate soluțiile.`,
      solution: lines(
        `Dacă $${R}$ și $${Tt}$ sunt de aceeași parte a lui $${S}$, atunci $${R}${Tt} = ${D(Math.max(a, b), k)} - ${D(Math.min(a, b), k)} = ${D(lo, k)}\\text{ cm}$.`,
        `Dacă $${S}$ se află între $${R}$ și $${Tt}$, atunci $${R}${Tt} = ${D(a, k)} + ${D(b, k)} = ${D(hi, k)}\\text{ cm}$.`,
      ),
      verify: () => [b - a, b + a].map(Math.abs).sort((x, y) => x - y).join() === [lo, hi].join(),
    }
  }
}

/** Three towns: d(A, B) = k·d(B, C), d(A, C) known, p. 85, ex. 27. */
export function segRatioTowns(rng: Rng): Made {
  const k = int(rng, 2, 5), y = int(rng, 5, 60)
  const D_ = (k + 1) * y
  return {
    text: `Localitățile $A$, $B$ și $C$ sunt situate în această ordine pe un drum național, astfel încât $d(A, B) = ${k} \\cdot d(B, C)$ și $d(A, C) = ${D_}\\text{ km}$. Aflați $d(A, B)$ și $d(B, C)$.`,
    solution: lines(
      `$B$ este între $A$ și $C$, deci $d(A, C) = d(A, B) + d(B, C)$, adică $${k} + 1 = ${k + 1}$ părți egale cu $d(B, C)$.`,
      show(`d(B, C) = ${D_} : ${k + 1} = ${y}\\text{ km}, \\qquad d(A, B) = ${k} \\cdot ${y} = ${k * y}\\text{ km}`),
    ),
    verify: () => k * y + y === D_,
  }
}

/** Four trees in a row, one distance a multiple of another plus d, a midpoint: the whole row, p. 85, ex. 28. */
export function segTrees(rng: Rng): Made {
  const y = int(rng, 2, 20), d = int(rng, 1, 9)
  const L_ = 3 * y + d
  const [t1, t2, t3, t4] = shuffle(rng, ['măr', 'păr', 'prun', 'cais', 'cireș', 'nuc']).slice(0, 4)
  return {
    text: `Pe o alee sunt plantați 4 pomi fructiferi, în ordinea: ${t1}, ${t2}, ${t3}, ${t4}. Distanța dintre ${t1} și ${t2} este cu ${d} m mai mare decât dublul distanței dintre ${t3} și ${t4}, ${t3}ul se află la mijloc între ${t2} și ${t4}, iar distanța dintre ${t1} și ${t3} este de ${L_} m. Aflați distanța de la ${t1} la ${t4}.`,
    solution: lines(
      `Notăm cu $y$ distanța dintre ${t3} și ${t4}. ${t3[0].toUpperCase() + t3.slice(1)}ul este la mijloc, deci și distanța dintre ${t2} și ${t3} este $y$, iar distanța dintre ${t1} și ${t2} este $2y + ${d}$.`,
      show(`(2y + ${d}) + y = ${L_}, \\qquad 3y = ${L_ - d}, \\qquad y = ${y}\\text{ m}`),
      show(`${L_} + ${y} = ${L_ + y}\\text{ m}`),
    ),
    verify: () => {
      const pos = [0, 2 * y + d, 3 * y + d, 4 * y + d]
      return pos[2] - pos[0] === L_ && pos[2] - pos[1] === pos[3] - pos[2] && pos[1] - pos[0] === 2 * (pos[3] - pos[2]) + d && pos[3] === L_ + y
    },
  }
}

/** A, P, R, B, E in this order with AP, AR, PB, PE: six more segments, p. 84, ex. 12. */
export function segFivePoints(rng: Rng): Made {
  for (;;) {
    const names = pick(rng, [['A', 'P', 'R', 'B', 'E'], ['M', 'N', 'P', 'Q', 'R'], ['A', 'B', 'C', 'D', 'E'], ['O', 'K', 'L', 'M', 'N']])
    const gaps = Array.from({ length: 4 }, () => int(rng, 1, 9))
    const pos = [0, gaps[0], gaps[0] + gaps[1], gaps[0] + gaps[1] + gaps[2], sum(gaps)]
    const [A, P, R, B, E] = names
    const seg = (i: number, j: number) => pos[j] - pos[i]
    const asked: [number, number][] = [[1, 2], [2, 3], [3, 4], [2, 4], [0, 3], [0, 4]]
    if (seg(0, 2) === seg(1, 3)) continue
    return {
      text: `Punctele $${names.join('$, $')}$ sunt coliniare, în această ordine, astfel încât $${A}${P} = ${seg(0, 1)}\\text{ cm}$, $${A}${R} = ${seg(0, 2)}\\text{ cm}$, $${P}${B} = ${seg(1, 3)}\\text{ cm}$ și $${P}${E} = ${seg(1, 4)}\\text{ cm}$. Aflați lungimile segmentelor ${asked.map(([i, j]) => `$${names[i]}${names[j]}$`).join(', ')}.`,
      solution: lines(
        show(`${P}${R} = ${A}${R} - ${A}${P} = ${seg(0, 2)} - ${seg(0, 1)} = ${seg(1, 2)}\\text{ cm}, \\qquad ${R}${B} = ${P}${B} - ${P}${R} = ${seg(1, 3)} - ${seg(1, 2)} = ${seg(2, 3)}\\text{ cm}`),
        show(`${B}${E} = ${P}${E} - ${P}${B} = ${seg(1, 4)} - ${seg(1, 3)} = ${seg(3, 4)}\\text{ cm}, \\qquad ${R}${E} = ${P}${E} - ${P}${R} = ${seg(1, 4)} - ${seg(1, 2)} = ${seg(2, 4)}\\text{ cm}`),
        show(`${A}${B} = ${A}${P} + ${P}${B} = ${seg(0, 1)} + ${seg(1, 3)} = ${seg(0, 3)}\\text{ cm}, \\qquad ${A}${E} = ${A}${P} + ${P}${E} = ${seg(0, 1)} + ${seg(1, 4)} = ${seg(0, 4)}\\text{ cm}`),
      ),
      verify: () => seg(0, 2) - seg(0, 1) === seg(1, 2) && seg(1, 3) - seg(1, 2) === seg(2, 3) && seg(0, 1) + seg(1, 4) === seg(0, 4),
    }
  }
}

/** A1, …, An with each segment c cm longer than the one before: several segments, p. 85, ex. 32. */
export function segIncreasing(rng: Rng): Made {
  const n = int(rng, 8, 12), d = int(rng, 1, 3), c = int(rng, 1, 3)
  const len = (k: number) => d + (k - 1) * c
  const i = int(rng, 4, n - 1)
  let j = int(rng, 2, n - 3), m = int(rng, j + 2, n)
  if (j === 1) [j, m] = [2, Math.max(m, 4)]
  const between = (a: number, b: number) => sum(Array.from({ length: b - a }, (_, t) => len(a + t)))
  return {
    text: `Pe o dreaptă sunt figurate, în ordine, punctele $A_1, A_2, \\ldots, A_{${n}}$, astfel încât $A_1A_2 = ${d}\\text{ cm}$, $A_2A_3 = ${len(2)}\\text{ cm}$ și așa mai departe, fiecare segment fiind cu ${c} cm mai mare decât precedentul. Aflați lungimile segmentelor $A_{${i}}A_{${i + 1}}$, $A_1A_{${n}}$ și $A_{${j}}A_{${m}}$.`,
    solution: lines(
      `Segmentul $A_kA_{k+1}$ are $${d} + (k - 1) \\cdot ${c}$ cm. Lungimile sunt: ${Array.from({ length: n - 1 }, (_, t) => len(t + 1)).join(', ')} (cm).`,
      show(`A_{${i}}A_{${i + 1}} = ${d} + ${i - 1} \\cdot ${c} = ${len(i)}\\text{ cm}`),
      show(`A_1A_{${n}} = ${Array.from({ length: n - 1 }, (_, t) => len(t + 1)).join(' + ')} = ${between(1, n)}\\text{ cm}`),
      show(`A_{${j}}A_{${m}} = ${Array.from({ length: m - j }, (_, t) => len(j + t)).join(' + ')} = ${between(j, m)}\\text{ cm}`),
    ),
    verify: () => {
      const pos = [0]
      for (let k = 1; k < n; k++) pos.push(pos[k - 1] + d + (k - 1) * c)
      return pos[n - 1] === between(1, n) && pos[m - 1] - pos[j - 1] === between(j, m) && pos[i] - pos[i - 1] === len(i)
    },
  }
}

/** A1, …, An with each segment q times the one before, p. 85, ex. 33. */
export function segDoubling(rng: Rng): Made {
  const q = pick(rng, [2, 2, 3]), d = int(rng, 1, 4), n = q === 2 ? int(rng, 7, 10) : int(rng, 6, 7)
  const len = (k: number) => d * q ** (k - 1)
  const i = int(rng, 3, n - 1)
  const j = int(rng, 2, n - 3), m = int(rng, j + 2, n)
  const between = (a: number, b: number) => sum(Array.from({ length: b - a }, (_, t) => len(a + t)))
  return {
    text: `Pe o dreaptă sunt figurate, în ordine, punctele $A_1, A_2, \\ldots, A_{${n}}$, astfel încât $A_1A_2 = ${d}\\text{ cm}$, $A_2A_3 = ${len(2)}\\text{ cm}$ și așa mai departe, fiecare segment fiind de ${q === 2 ? 'două' : 'trei'} ori mai mare decât precedentul. Aflați lungimile segmentelor $A_{${i}}A_{${i + 1}}$, $A_1A_4$, $A_{${j}}A_{${m}}$ și $A_1A_{${n}}$.`,
    solution: lines(
      `Lungimile segmentelor $A_1A_2, A_2A_3, \\ldots$ sunt: ${Array.from({ length: n - 1 }, (_, t) => nr(len(t + 1))).join(', ')} (cm).`,
      show(`A_{${i}}A_{${i + 1}} = ${d} \\cdot ${q}^{${i - 1}} = ${nr(len(i))}\\text{ cm}, \\qquad A_1A_4 = ${len(1)} + ${len(2)} + ${len(3)} = ${between(1, 4)}\\text{ cm}`),
      show(`A_{${j}}A_{${m}} = ${Array.from({ length: m - j }, (_, t) => nr(len(j + t))).join(' + ')} = ${nr(between(j, m))}\\text{ cm}`),
      show(`A_1A_{${n}} = ${Array.from({ length: n - 1 }, (_, t) => nr(len(t + 1))).join(' + ')} = ${nr(between(1, n))}\\text{ cm}`),
    ),
    verify: () => {
      const pos = [0]
      for (let k = 1; k < n; k++) pos.push(pos[k - 1] + d * q ** (k - 1))
      return pos[n - 1] === between(1, n) && pos[3] === between(1, 4) && pos[m - 1] - pos[j - 1] === between(j, m)
    },
  }
}

// ================= 5.3 midpoints (pp. 84–85) → v-midpoint-symmetric =================

/** A, B, C, D in order with AB, BC, CD; M, N the midpoints of AD and BC: MN, p. 85, ex. 31. */
export function midAdBc(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 0, 1)
    const a = int(rng, 2, 120), b = int(rng, 2, 120), c = int(rng, 2, 120)
    if (a === c) continue
    const AM = (a + b + c) * 5, AN = a * 10 + b * 5
    const MN = Math.abs(AM - AN)
    return {
      text: `Fie $A, B, C, D$ puncte coliniare, în această ordine, cu $AB = ${D(a, k)}\\text{ cm}$, $BC = ${D(b, k)}\\text{ cm}$, $CD = ${D(c, k)}\\text{ cm}$. Aflați lungimea segmentului $MN$, dacă $M$ și $N$ sunt mijloacele segmentelor $AD$, respectiv $BC$.`,
      solution: lines(
        show(`AD = ${D(a, k)} + ${D(b, k)} + ${D(c, k)} = ${D(a + b + c, k)}\\text{ cm}, \\qquad AM = ${D(a + b + c, k)} : 2 = ${D(AM, k + 1)}\\text{ cm}`),
        show(`BN = ${D(b, k)} : 2 = ${D(5 * b, k + 1)}\\text{ cm}, \\qquad AN = ${D(a, k)} + ${D(5 * b, k + 1)} = ${D(AN, k + 1)}\\text{ cm}`),
        show(`MN = ${D(Math.max(AM, AN), k + 1)} - ${D(Math.min(AM, AN), k + 1)} = ${D(MN, k + 1)}\\text{ cm}`),
      ),
      verify: () => close(Math.abs((0 + a + b + c) / 2 - (a + (a + b)) / 2) * 10, MN),
    }
  }
}

/** A, B, C, D in order; M the midpoint of AB, C the midpoint of BD, AM and BD known, p. 85, ex. 24. */
export function midChain(rng: Rng): Made {
  const m = int(rng, 1, 30), d = 2 * int(rng, 1, 30)
  const A = 0, M = m, B = 2 * m, C = B + d / 2, Dp = B + d
  const midAC = (A + C) / 2, midCD = (C + Dp) / 2
  const dist = midCD - midAC
  return {
    text: `Fie $A, B, C, D$ puncte coliniare, în această ordine, $M$ mijlocul segmentului $AB$ și $C$ mijlocul segmentului $BD$, astfel încât $AM = ${m}\\text{ cm}$ și $BD = ${d}\\text{ cm}$. Aflați: a) lungimile segmentelor $AB$, $MC$, $MD$, $AD$; b) distanța dintre mijlocul segmentului $AC$ și mijlocul segmentului $CD$.`,
    solution: lines(
      show(`AB = 2 \\cdot ${m} = ${B}\\text{ cm}, \\quad BC = CD = ${d} : 2 = ${d / 2}\\text{ cm}`),
      show(`MC = MB + BC = ${m} + ${d / 2} = ${C - M}\\text{ cm}, \\quad MD = ${m} + ${d} = ${Dp - M}\\text{ cm}, \\quad AD = ${B} + ${d} = ${Dp}\\text{ cm}`),
      `b) $AC = ${B} + ${d / 2} = ${C}$ cm; mijlocul lui $AC$ este la $${D(5 * C, 1)}$ cm de $A$, iar mijlocul lui $CD$ este la $${C} + ${D(25 * d, 2)} = ${D(10 * midCD, 1)}$ cm de $A$.`,
      show(`${D(10 * midCD, 1)} - ${D(5 * C, 1)} = ${D(10 * dist, 1)}\\text{ cm}`),
    ),
    verify: () => close(dist, (Dp - A) / 2) && M === m && C - B === Dp - C,
  }
}

/** A, B, C, D in order with AB, AC, AD: the distance between midpoints, p. 85, ex. 25. */
export function midOfAbBd(rng: Rng): Made {
  const a = int(rng, 1, 20), c = a + int(rng, 1, 20), e = c + int(rng, 1, 20)
  const mAB = a / 2, mBD = (a + e) / 2, mAC = c / 2
  return {
    text: `Fie $A, B, C, D$ puncte coliniare, în această ordine, astfel încât $AB = ${a}\\text{ cm}$, $AC = ${c}\\text{ cm}$, $AD = ${e}\\text{ cm}$. Aflați: a) distanța dintre mijloacele segmentelor $AB$ și $BD$; b) distanța dintre mijloacele segmentelor $AC$ și $BD$.`,
    solution: lines(
      'Măsurăm distanțele de la $A$. Mijlocul unui segment se află la jumătatea drumului dintre capetele lui.',
      show(`\\text{mijlocul lui } AB: ${D(5 * a, 1)}\\text{ cm}, \\quad \\text{mijlocul lui } BD: (${a} + ${e}) : 2 = ${D(5 * (a + e), 1)}\\text{ cm}, \\quad \\text{mijlocul lui } AC: ${D(5 * c, 1)}\\text{ cm}`),
      show(`\\text{a) } ${D(5 * (a + e), 1)} - ${D(5 * a, 1)} = ${D(10 * (mBD - mAB), 1)}\\text{ cm}, \\qquad \\text{b) } ${D(10 * Math.max(mBD, mAC), 1)} - ${D(10 * Math.min(mBD, mAC), 1)} = ${D(10 * Math.abs(mBD - mAC), 1)}\\text{ cm}`),
      `Observație: la a) rezultatul este jumătate din $AD$.`,
    ),
    verify: () => close(mBD - mAB, e / 2) && close(Math.abs(mBD - mAC), Math.abs(a + e - c) / 2),
  }
}

/** A, B, D, C in order with AB, BC, BD; M, N the midpoints of BD and DC: eight segments, p. 85, ex. 23. */
export function midTwoMids(rng: Rng): Made {
  const a = int(rng, 1, 20), d = 2 * int(rng, 1, 10), e = 2 * int(rng, 1, 10)
  const b = d + e
  const B = a, Dp = a + d, C = a + b
  const M = (B + Dp) / 2, N = (Dp + C) / 2
  const f = (x: number) => D(Math.round(10 * x), 1)
  return {
    text: `Punctele coliniare $A, B, D, C$ sunt așezate în această ordine, astfel încât $AB = ${a}\\text{ cm}$, $BC = ${b}\\text{ cm}$, $BD = ${d}\\text{ cm}$. a) Aflați lungimile segmentelor $AD$, $DC$, $AC$. b) Fie $M$, $N$ mijloacele segmentelor $BD$, respectiv $DC$. Aflați lungimile segmentelor $BM$, $AM$, $CN$, $BN$, $MN$, $AN$.`,
    solution: lines(
      show(`AD = ${a} + ${d} = ${Dp}\\text{ cm}, \\quad DC = ${b} - ${d} = ${e}\\text{ cm}, \\quad AC = ${a} + ${b} = ${C}\\text{ cm}`),
      show(`BM = ${d} : 2 = ${f(M - B)}\\text{ cm}, \\quad AM = ${a} + ${f(M - B)} = ${f(M)}\\text{ cm}, \\quad CN = ${e} : 2 = ${f(C - N)}\\text{ cm}`),
      show(`BN = ${d} + ${f(N - Dp)} = ${f(N - B)}\\text{ cm}, \\quad MN = ${f(Dp - M)} + ${f(N - Dp)} = ${f(N - M)}\\text{ cm}, \\quad AN = ${a} + ${f(N - B)} = ${f(N)}\\text{ cm}`),
    ),
    verify: () => close(N - M, b / 2) && close(M, a + d / 2) && close(C - N, e / 2),
  }
}

// ================= 5.6 angles in degrees and minutes (pp. 87–88) → v-angle-calc =================

const ANG_NAMES = ['POR', 'LOM', 'SOP', 'DOE', 'JOP', 'TOS', 'MON', 'NOP', 'GEF', 'KEG', 'CAD', 'BAC', 'XOY', 'UVW']

/** Angles written with 60' or 120' in the minutes, written correctly; which are congruent, p. 88, ex. 6. */
export function angNormalize(rng: Rng): Made {
  for (;;) {
    const base = [60 * int(rng, 10, 170) + 5 * int(rng, 0, 11), 60 * int(rng, 10, 170) + 5 * int(rng, 0, 11)]
    if (base[0] === base[1]) continue
    const other = 60 * int(rng, 10, 170) + 5 * int(rng, 0, 11)
    if (base.includes(other)) continue
    const vals = shuffle(rng, [base[0], base[0], base[1], base[1], other])
    const names = shuffle(rng, ANG_NAMES).slice(0, 5)
    const written = vals.map((v, i) => {
      const odd = i % 2 === 0 || rng() < 0.4
      if (!odd || v < 180) return { tex: dm(v), v }
      const extra = rng() < 0.7 ? 60 : 120
      const d = Math.floor((v - extra) / 60), m = v - 60 * d
      return { tex: `${d}^\\circ ${m}'`, v }
    })
    if (written.every((w) => !/'/.test(w.tex) || Number(/(\d+)'$/.exec(w.tex)?.[1]) < 60)) continue
    const groups = base.map((b) => names.filter((_, i) => vals[i] === b))
    return {
      text: `Scrieți corect măsurile unghiurilor următoare și precizați care dintre ele sunt congruente: ${written.map((w, i) => `$${ang(names[i])} = ${w.tex}$`).join('; ')}.`,
      solution: lines(
        "Cum $60' = 1^\\circ$, minutele care trec de 60 se transformă în grade:",
        show(written.map((w, i) => `${ang(names[i])} = ${w.tex === dm(w.v) ? dm(w.v) : `${w.tex} = ${dm(w.v)}`}`).join(', \\quad ')),
        `Unghiurile congruente: ${groups.map((g) => `$${ang(g[0])} \\equiv ${ang(g[1])}$`).join(' și ')}.`,
      ),
      verify: () => written.every((w) => {
        const m = /^(\d+)\^\\circ(?: (\d+)')?$/.exec(w.tex) ?? /^(\d+)'$/.exec(w.tex)
        if (!m) return false
        const v = w.tex.includes('circ') ? 60 * Number(m[1]) + Number(m[2] ?? 0) : Number(m[1])
        return v === w.v
      }) && groups.every((g) => g.length === 2),
    }
  }
}

/** a − b + c with degrees and minutes, borrowing a degree, p. 87, ex. 4 i–j. */
export function angThreeTerms(rng: Rng): Made {
  for (;;) {
    const a = 60 * int(rng, 10, 90) + (rng() < 0.4 ? 0 : int(rng, 1, 59))
    const b = 60 * int(rng, 1, 40) + int(rng, 1, 59)
    const c = 60 * int(rng, 1, 40) + int(rng, 1, 59)
    if (b >= a || a % 60 >= b % 60) continue
    const r1 = a - b, r = r1 + c
    if (r >= 180 * 60) continue
    const borrowed = `${Math.floor(a / 60) - 1}^\\circ ${(a % 60) + 60}'`
    const raw = `${Math.floor(r1 / 60) + Math.floor(c / 60)}^\\circ ${(r1 % 60) + (c % 60)}'`
    return {
      text: `Calculați: $${dm(a)} - ${dm(b)} + ${dm(c)}$.`,
      solution: lines(
        "Minutele descăzutului sunt mai puține, așa că transformăm un grad în $60'$:",
        show(`${dm(a)} - ${dm(b)} = ${borrowed} - ${dm(b)} = ${dm(r1)}`),
        show(`${dm(r1)} + ${dm(c)} = ${raw}${(r1 % 60) + (c % 60) >= 60 ? ` = ${dm(r)}` : ''}`),
      ),
      verify: () => a - b + c === r && (r1 % 60) + (c % 60) - (r % 60) === ((r1 % 60) + (c % 60) >= 60 ? 60 : 0),
    }
  }
}

/** Rays AB, AC, AD, AE in this order: ∢CAD, ∢BAD, ∢BAE from ∢BAC, ∢CAE, ∢DAE, p. 88, ex. 8. */
export function angFourRays(rng: Rng): Made {
  for (;;) {
    const x = 60 * int(rng, 5, 60) + 15 * int(rng, 0, 3), y = 60 * int(rng, 20, 100) + 15 * int(rng, 0, 3), z = 60 * int(rng, 3, 50) + 15 * int(rng, 0, 3)
    if (z >= y || x + y >= 180 * 60 || y - z < 120) continue
    return {
      text: `Semidreptele $AB$, $AC$, $AD$, $AE$ sunt așezate în această ordine, în același semiplan, astfel încât $${ang('BAC')} = ${dm(x)}$, $${ang('CAE')} = ${dm(y)}$ și $${ang('DAE')} = ${dm(z)}$. Aflați $${ang('CAD')}$, $${ang('BAD')}$ și $${ang('BAE')}$.`,
      solution: lines(
        show(`${ang('CAD')} = ${ang('CAE')} - ${ang('DAE')} = ${dm(y)} - ${dm(z)} = ${dm(y - z)}`),
        show(`${ang('BAD')} = ${ang('BAC')} + ${ang('CAD')} = ${dm(x)} + ${dm(y - z)} = ${dm(x + y - z)}`),
        show(`${ang('BAE')} = ${ang('BAC')} + ${ang('CAE')} = ${dm(x)} + ${dm(y)} = ${dm(x + y)}`),
      ),
      verify: () => {
        const pos = [0, x, x + y - z, x + y]
        return pos[2] - pos[1] === y - z && pos[2] - pos[0] === x + y - z && pos[3] - pos[0] === x + y
      },
    }
  }
}

/** Rays OA, OB, OC, OD in order, ∢BOD ≡ ∢AOC: ∢COD and ∢AOD, p. 88, ex. 9. */
export function angOverlap(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 10, 80), y = int(rng, x + 5, 150)
    if (x + y >= 180) continue
    return {
      text: `Semidreptele $OA$, $OB$, $OC$, $OD$ sunt așezate în această ordine, în același semiplan, astfel încât $${ang('AOB')} = ${x}^\\circ$, $${ang('BOD')} = ${y}^\\circ$ și $${ang('BOD')} \\equiv ${ang('AOC')}$. Aflați: a) $${ang('COD')}$; b) $${ang('AOD')}$.`,
      solution: lines(
        show(`${ang('AOC')} = ${ang('BOD')} = ${y}^\\circ, \\qquad ${ang('BOC')} = ${ang('AOC')} - ${ang('AOB')} = ${y}^\\circ - ${x}^\\circ = ${y - x}^\\circ`),
        show(`\\text{a) } ${ang('COD')} = ${ang('BOD')} - ${ang('BOC')} = ${y}^\\circ - ${y - x}^\\circ = ${x}^\\circ`),
        show(`\\text{b) } ${ang('AOD')} = ${ang('AOB')} + ${ang('BOD')} = ${x}^\\circ + ${y}^\\circ = ${x + y}^\\circ`),
      ),
      verify: () => {
        const pos = { A: 0, B: x, C: y, D: x + y }
        return pos.D - pos.B === y && pos.C - pos.A === y && pos.D - pos.C === x
      },
    }
  }
}

/** A, O, E collinear; rays split ∢AOE into n equal angles; a ray inside the last one, p. 88, ex. 12. */
export function angThirds(rng: Rng): Made {
  const n = pick(rng, [3, 3, 4, 5, 6])
  const part = (180 * 60) / n
  const inner = 'BCDFGH'.slice(0, n - 1).split('')
  const last = inner[n - 2]
  const z = 60 * int(rng, 1, part / 60 - 1) + (rng() < 0.5 ? 0 : 5 * int(rng, 1, 11))
  const nw: Record<number, string> = { 3: 'trei', 4: 'patru', 5: 'cinci', 6: 'șase' }
  const B = inner[0]
  return {
    text: `Fie $A$, $O$, $E$ puncte coliniare, în această ordine. Semidreptele ${inner.map((c) => `$O${c}$`).join(', ')} împart $${ang('AOE')}$ în ${nw[n]} unghiuri congruente, iar semidreapta $OM$ se află în interiorul $${ang(`${last}OE`)}$ astfel încât $${ang('MOE')} = ${dm(z)}$. Aflați: a) $${ang(`${last}OM`)}$; b) $${ang(`${B}OM`)}$.`,
    solution: lines(
      `Unghiul $${ang('AOE')}$ este alungit, deci are $180^\\circ$; fiecare dintre cele ${nw[n]} unghiuri are $180^\\circ : ${n} = ${dm(part)}$.`,
      show(`\\text{a) } ${ang(`${last}OM`)} = ${dm(part)} - ${dm(z)} = ${dm(part - z)}`),
      show(`\\text{b) } ${ang(`${B}OM`)} = ${ang('AOM')} - ${ang(`AO${B}`)} = (180^\\circ - ${dm(z)}) - ${dm(part)} = ${dm(180 * 60 - z - part)}`),
    ),
    verify: () => n * part === 180 * 60 && z < part && (n - 1) * part - (part - z) - part + part === (n - 1) * part - part + z && 180 * 60 - z - part === (n - 2) * part + (part - z),
  }
}

/** A, O, D collinear; ∢AOB : ∢BOC gives quotient q and remainder r, ∢COD = ∢BOC + d, p. 88, ex. 14. */
export function angQuotRem(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 15, 60), q = int(rng, 2, 4), r = int(rng, 1, 14), d = int(rng, 1, 30)
    if (r >= x) continue
    const a = q * x + r, c = x + d
    if (a + x + c !== 180) continue
    return {
      text: `Punctele $A$, $O$ și $D$ sunt coliniare, iar semidreptele $OB$ și $OC$ sunt de aceeași parte a dreptei $AD$, în ordinea $OA$, $OB$, $OC$, $OD$. Măsura $${ang('AOB')}$ împărțită la măsura $${ang('BOC')}$ dă câtul ${q} și restul ${r}, iar măsura $${ang('COD')}$ este cu $${d}^\\circ$ mai mare decât măsura $${ang('BOC')}$. Aflați măsurile $${ang('AOB')}$, $${ang('BOC')}$ și $${ang('COD')}$.`,
      solution: lines(
        `Notăm $${ang('BOC')} = x$. Atunci $${ang('AOB')} = ${q}x + ${r}^\\circ$ și $${ang('COD')} = x + ${d}^\\circ$. Cele trei unghiuri formează unghiul alungit $${ang('AOD')}$:`,
        show(`${q}x + ${r} + x + x + ${d} = 180, \\qquad ${q + 2}x = ${180 - r - d}, \\qquad x = ${x}`),
        show(`${ang('BOC')} = ${x}^\\circ, \\quad ${ang('AOB')} = ${q} \\cdot ${x}^\\circ + ${r}^\\circ = ${a}^\\circ, \\quad ${ang('COD')} = ${c}^\\circ`),
      ),
      verify: () => Math.floor(a / x) === q && a % x === r && a + x + c === 180,
    }
  }
}

/** Consecutive angles around O between OA and OB: are A, O, B collinear? p. 88, ex. 15. */
export function angCollinear(rng: Rng): Made {
  const make = (yes: boolean) => {
    for (;;) {
      const k = int(rng, 3, 4)
      const parts = Array.from({ length: k - 1 }, () => 60 * int(rng, 10, 60) + (rng() < 0.5 ? 0 : int(rng, 1, 59)))
      const target = yes ? 180 * 60 : 180 * 60 + pick(rng, [-1, 1]) * int(rng, 1, 90)
      const lastV = target - sum(parts)
      if (lastV < 300) continue
      return { vals: [...parts, lastV], yes }
    }
  }
  const items = shuffle(rng, [make(true), make(rng() < 0.5)])
  const rays = (k: number) => ['A', ...'CDEF'.slice(0, k - 1).split(''), 'B']
  return {
    text: `Semidreptele cu originea $O$ sunt așezate în ordinea scrisă, toate de aceeași parte a dreptei care trece prin $O$ și $A$. Stabiliți, în fiecare caz, dacă punctele $A$, $O$ și $B$ sunt coliniare: ${items.map((it, i) => {
      const r = rays(it.vals.length)
      return `${L[i]}) ${it.vals.map((v, j) => `$${ang(`${r[j]}O${r[j + 1]}`)} = ${dm(v)}$`).join(', ')}`
    }).join('; ')}.`,
    solution: lines(
      'Punctele $A$, $O$, $B$ sunt coliniare exact atunci când unghiurile alăturate formează un unghi alungit, adică suma lor este $180^\\circ$.',
      ...items.map((it, i) => `${L[i]}) $${it.vals.map(dm).join(' + ')} = ${dm(sum(it.vals))}$: ${it.yes ? 'punctele sunt coliniare.' : 'punctele nu sunt coliniare.'}`),
    ),
    verify: () => items.every((it) => (sum(it.vals) === 180 * 60) === it.yes),
  }
}

// ================= 4.12 contest problems (p. 79) =================

/** a books + b notebooks = T1, b books + a notebooks = T2; N objects for M lei, p. 79, ex. 1 (OLM Giurgiu 2008). */
export function contestBooksNotebooks(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 3, 8), b = int(rng, 2, 7)
    if (a === b) continue
    const B = 50 * int(rng, 10, 40), C = 50 * int(rng, 2, 20)
    if (B <= C) continue
    const T1 = a * B + b * C, T2 = b * B + a * C
    const N = int(rng, 6, 20), x = int(rng, 2, N - 2)
    const M = x * B + (N - x) * C
    return {
      text: `La o librărie, ${a} cărți și ${b} caiete costă ${lei(T1)}, iar ${b} cărți și ${a} caiete costă ${lei(T2)}. Câte cărți și câte caiete s-au cumpărat cu ${lei(M)}, dacă s-au cumpărat în total ${N} bucăți?`,
      solution: lines(
        `Adunând: ${a + b} cărți și ${a + b} caiete costă $${leiM(T1)} + ${leiM(T2)} = ${leiM(T1 + T2)}$ lei, deci o carte și un caiet costă $${leiM(T1 + T2)} : ${a + b} = ${leiM(B + C)}$ lei.`,
        Math.abs(a - b) === 1 ? `Scăzând: o carte costă cu $${leiM(B - C)}$ lei mai mult decât un caiet.` : `Scăzând: ${Math.abs(a - b)} cărți costă cu $${leiM(Math.abs(T1 - T2))}$ lei mai mult decât ${Math.abs(a - b)} caiete, deci o carte costă cu $${leiM(B - C)}$ lei mai mult decât un caiet.`,
        show(`\\text{cartea: } (${leiM(B + C)} + ${leiM(B - C)}) : 2 = ${leiM(B)}\\text{ lei}, \\qquad \\text{caietul: } ${leiM(B + C)} - ${leiM(B)} = ${leiM(C)}\\text{ lei}`),
        `Dacă toate cele ${N} bucăți ar fi caiete, s-ar plăti $${N} \\cdot ${leiM(C)} = ${leiM(N * C)}$ lei. Diferența $${leiM(M)} - ${leiM(N * C)} = ${leiM(M - N * C)}$ lei vine din cărți, fiecare cu $${leiM(B - C)}$ lei mai scumpă:`,
        show(`${leiM(M - N * C)} : ${leiM(B - C)} = ${x}\\text{ carti}, \\qquad ${N} - ${x} = ${N - x}\\text{ caiete}`),
      ),
      verify: () => {
        const s: number[] = []
        for (let t = 0; t <= N; t++) if (t * B + (N - t) * C === M) s.push(t)
        return s.length === 1 && s[0] === x && a * B + b * C === T1 && b * B + a * C === T2
      },
    }
  }
}

/** Objects of two prices, at least two of each, all the money spent: the most objects, p. 79, ex. 4. */
export function contestMaxItems(rng: Rng): Made {
  for (;;) {
    const p1 = 10 * int(rng, 30, 90), p2 = 10 * int(rng, 30, 90)
    if (p1 >= p2) continue
    const a0 = int(rng, 2, 40), b0 = int(rng, 2, 40)
    const Tt = a0 * p1 + b0 * p2
    const sols: [number, number][] = []
    for (let b = 2; b * p2 <= Tt; b++) {
      const r = Tt - b * p2
      if (r % p1 === 0 && r / p1 >= 2) sols.push([r / p1, b])
    }
    if (sols.length < 2 || sols.length > 6) continue
    const best = sols.reduce((x, y) => (x[0] + x[1] >= y[0] + y[1] ? x : y))
    const g = gcd(p1, p2)
    return {
      text: `Un elev are ${lei(Tt)} și trebuie să cumpere obiecte de două feluri, care costă ${lei(p1)} și, respectiv, ${lei(p2)} bucata. Aflați numărul maxim de obiecte pe care le poate cumpăra, știind că trebuie să aibă cel puțin două obiecte din fiecare fel și să cheltuiască toți banii.`,
      solution: lines(
        `Notăm cu $a$ numărul obiectelor ieftine și cu $b$ al celor scumpe. Lucrând în bani: $${p1}a + ${p2}b = ${nr(Tt)}$, adică, împărțind la ${g}: $${p1 / g}a + ${p2 / g}b = ${nr(Tt / g)}$, cu $a \\geq 2$, $b \\geq 2$.`,
        `Încercăm valorile lui $b$ pentru care $${nr(Tt / g)} - ${p2 / g}b$ se împarte exact la ${p1 / g}: ${sols.map(([a, b]) => `$b = ${b}, a = ${a}$`).join('; ')}.`,
        `Numărul de obiecte $a + b$ este cel mai mare pentru $a = ${best[0]}$, $b = ${best[1]}$: ${best[0] + best[1]} obiecte.`,
      ),
      verify: () => {
        let m = 0
        for (let a = 2; a * p1 <= Tt; a++) for (let b = 2; a * p1 + b * p2 <= Tt; b++) if (a * p1 + b * p2 === Tt) m = Math.max(m, a + b)
        return m === best[0] + best[1]
      },
    }
  }
}

const PARTW: Record<number, string> = { 2: 'jumătatea', 3: 'treimea', 4: 'sfertul', 5: 'cincimea', 6: 'șesimea', 8: 'optimea', 9: 'a noua parte a', 10: 'zecimea' }

/** Two consecutive naturals: the a-th of the first minus the b-th of the second equals the c-th minus the d-th, p. 79, ex. 5. */
export function contestConsecutiveFractions(rng: Rng): Made {
  for (;;) {
    const den = [2, 3, 4, 5, 6, 8, 9, 10]
    const a = pick(rng, den), b = pick(rng, den), c = pick(rng, den), d = pick(rng, den)
    if (a >= c || b >= d) continue
    const Lc = [a, b, c, d].reduce(lcm)
    const u = Lc / a - Lc / c, v = Lc / b - Lc / d
    if (u <= v || v % (u - v) !== 0) continue
    const n = v / (u - v)
    if (n < 2 || n > 200 || n * b <= (n + 1) * a || n * d <= (n + 1) * c) continue
    return {
      text: `Găsiți două numere naturale consecutive știind că diferența dintre ${PARTW[a]} primului și ${PARTW[b]} celui de-al doilea este egală cu diferența dintre ${PARTW[c]} primului și ${PARTW[d]} celui de-al doilea.`,
      solution: lines(
        'Notăm numerele cu $n$ și $n + 1$:',
        show(`\\frac{n}{${a}} - \\frac{n + 1}{${b}} = \\frac{n}{${c}} - \\frac{n + 1}{${d}}`),
        `Trecem termenii cu $n$ în stânga și pe cei cu $n + 1$ în dreapta, apoi înmulțim cu ${Lc}:`,
        show(`\\frac{n}{${a}} - \\frac{n}{${c}} = \\frac{n + 1}{${b}} - \\frac{n + 1}{${d}}, \\qquad ${u}n = ${v}(n + 1)`),
        show(`${u}n - ${v}n = ${v}, \\qquad ${u - v === 1 ? `n = ${v}` : `${u - v}n = ${v}, \\qquad n = ${n}`}`),
        `Numerele sunt ${n} și ${n + 1}.`,
      ),
      verify: () => n * (Lc / a) - (n + 1) * (Lc / b) === n * (Lc / c) - (n + 1) * (Lc / d),
    }
  }
}

// ---------------------------------------------------------------- the kinds

export const KINDS: GradeKind[] = [
  {
    id: 'v-p3-order', label: 'Compararea și ordonarea fracțiilor zecimale', topic: 'Algebră', joins: 'v-decimal-order',
    forms: {
      1: [ordFracVsDec, ordExamplesBetween],
      2: [ordMixedFractions, ordFractionBetween, ordComparePeriodic],
      3: [ordDigitPeriodic, ordRationalsHard],
    },
  },
  {
    id: 'v-p3-add-sub', label: 'Adunarea și scăderea fracțiilor zecimale', topic: 'Algebră', joins: 'v-decimal-add-sub',
    forms: {
      1: [addUnknown, addDecompose],
      2: [addCrate, addThreeDays, addSumMinusDiff],
      3: [addDigitSeries, addDigitMinus, addDigitPairs],
    },
  },
  {
    id: 'v-p3-multiply', label: 'Înmulțirea fracțiilor zecimale', topic: 'Algebră', joins: 'v-decimal-multiply',
    forms: {
      1: [mulOrderSimple, mulBagWeight],
      2: [mulShoppingChange, mulDepot, mulWhichHeavier],
      3: [mulStepSeries, mulSquaresExpr, mulFamilyMoney],
    },
  },
  {
    id: 'v-p3-periodic', label: 'Fracții zecimale periodice', topic: 'Algebră', joins: 'v-decimal-periodic',
    forms: {
      1: [perAddSub, perSameRational],
      2: [perProductQuotient, perOpsMixed],
      3: [perDigitsFromFraction, perFindNatural, perDigitSwapSum],
    },
  },
  {
    id: 'v-p3-division', label: 'Împărțirea fracțiilor zecimale, ecuații', topic: 'Algebră', joins: 'v-decimal-division',
    forms: {
      1: [divEquation, divContainers],
      2: [divEquationBrackets, divWhoPaidMore, divBagsTrucks],
      3: [divEquationBothSides, divEquationSeries, divTruckBags],
    },
  },
  {
    id: 'v-p3-mean', label: 'Media aritmetică', topic: 'Algebră', joins: 'v-mean-applied',
    forms: {
      1: [meanGrades, meanNumberTriple],
      2: [meanNeededGrade, meanDiffOrQuotient, meanConsecutive],
      3: [meanThreeRelations, meanMiddle, meanThirdFraction],
    },
  },
  {
    id: 'v-p3-methods', label: 'Metode aritmetice cu fracții zecimale', topic: 'Algebră', joins: 'v-decimal-methods',
    forms: {
      1: [methFilmEnd, methAlarm, methBoxPackets],
      2: [methSumMultiple, methThreeNumbers, methSameSpent, methPercent],
      3: [methCompareSame, methEquivalents, methHalfThenSpent, methMoveEqual],
    },
  },
  {
    id: 'v-p3-segments', label: 'Lungimea unui segment', topic: 'Geometrie', joins: 'v-segment-length',
    forms: {
      1: [segTwoSolutions, segRatioTowns],
      2: [segTrees, segFivePoints],
      3: [segIncreasing, segDoubling],
    },
  },
  {
    id: 'v-p3-midpoints', label: 'Mijlocul unui segment', topic: 'Geometrie', joins: 'v-midpoint-symmetric',
    forms: {
      1: [],
      2: [midAdBc, midChain],
      3: [midOfAbBd, midTwoMids],
    },
  },
  {
    id: 'v-p3-angles', label: 'Calcule cu măsuri de unghiuri', topic: 'Geometrie', joins: 'v-angle-calc',
    forms: {
      1: [angNormalize, angThreeTerms],
      2: [angFourRays, angOverlap, angThirds],
      3: [angQuotRem, angCollinear],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-p3-shopping', label: 'Concurs: cumpărături și numere consecutive',
    forms: [contestBooksNotebooks, contestMaxItems, contestConsecutiveFractions],
  },
]
