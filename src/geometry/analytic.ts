// Analytic geometry on the board (12 November 2026): equations of lines and circles, typed or read off the drawing,
// written as in Romanian textbooks (2x − 3y + 6 = 0, (x − 1)² + (y + 2)² = 9, AB = 3i − 2j), and the areas from
// coordinates. Pure functions, without the board, so that they can be tested.
import { compile } from 'mathjs'
import type { Vec } from './engine'

const EPS = 1e-7
const MINUS = '−'

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

/** v as a fraction p/q with a small denominator, when it is one: 0.5 → [1, 2]; √2 → null. */
export function asFraction(v: number, maxDen = 12): [number, number] | null {
  for (let q = 1; q <= maxDen; q++) {
    const p = Math.round(v * q)
    if (Math.abs(p / q - v) < EPS) {
      const g = gcd(p, q) || 1
      return [p / g, q / g]
    }
  }
  return null
}

/** A number as written on the board: 3, −2, 2/3, √ of nothing; else two decimals. */
export function numText(v: number): string {
  const f = asFraction(v)
  if (f) {
    const [p, q] = f
    const s = q === 1 ? String(Math.abs(p)) : `${Math.abs(p)}/${q}`
    return (p < 0 ? MINUS : '') + s
  }
  const r = Math.round(v * 100) / 100
  return (r < 0 ? MINUS : '') + String(Math.abs(r))
}

/** A coefficient before a letter: x, −x, 2x, 2/3x stays "2/3·x" so that it reads clearly. */
function term(c: number, letter: string, first: boolean): string {
  if (Math.abs(c) < EPS) return ''
  const sign = c < 0 ? (first ? MINUS : ` ${MINUS} `) : first ? '' : ' + '
  const abs = Math.abs(c)
  if (!letter) return sign + numText(abs)
  const k = Math.abs(abs - 1) < EPS ? '' : numText(abs)
  return sign + (k.includes('/') || k.includes('.') ? `${k}·` : k) + letter
}

/** A sum of terms, written as in a textbook; 0 when they are all zero. */
export function sumText(terms: [number, string][]): string {
  let out = ''
  for (const [c, l] of terms) out += term(c, l, out === '')
  return out || '0'
}

/** The coefficients of a line, as whole numbers when they can be, without a common factor, the first one positive. */
export function niceLine(a: number, b: number, c: number): [number, number, number] {
  // the coefficients may share an irrational factor (two points at a distance of √13): divide it out first
  const whole = (vs: number[]) => {
    for (let m = 1; m <= 120; m++) if (vs.every((v) => Math.abs(v * m - Math.round(v * m)) < 1e-6 * Math.max(1, Math.abs(v * m)))) return vs.map((v) => Math.round(v * m))
    return null
  }
  let ints: number[] | null = null
  for (const s of [1, a, b, c]) if (!ints && Math.abs(s) > EPS) ints = whole([a / s, b / s, c / s])
  let co: [number, number, number]
  if (ints) {
    const g = ints.reduce((s, v) => gcd(s, v), 0) || 1
    co = ints.map((v) => v / g) as [number, number, number]
  } else {
    // not rational with a small denominator: the largest coefficient of x or y becomes 1
    const s = Math.abs(a) > Math.abs(b) ? a : b
    co = [a / s, b / s, c / s]
  }
  if (co[0] < -EPS || (Math.abs(co[0]) < EPS && co[1] < 0)) co = co.map((v) => -v) as [number, number, number]
  return co.map((v) => (Math.abs(v) < EPS ? 0 : v)) as [number, number, number]
}

/** The line through p and q, as a·x + b·y + c = 0. */
export function lineThrough(p: Vec, q: Vec): [number, number, number] {
  const a = q.y - p.y
  const b = p.x - q.x
  return niceLine(a, b, -(a * p.x + b * p.y))
}

/** The general form: 2x − 3y + 6 = 0. */
export function generalForm([a, b, c]: [number, number, number]): string {
  return `${sumText([[a, 'x'], [b, 'y'], [c, '']])} = 0`
}

/** The explicit form y = mx + n, or x = k for a vertical line. */
export function explicitForm([a, b, c]: [number, number, number]): string {
  if (Math.abs(b) < EPS) return `x = ${numText(-c / a)}`
  return `y = ${sumText([[-a / b, 'x'], [-c / b, '']])}`
}

/** The slope, or null for a vertical line. */
export const slope = ([a, b]: [number, number, number]) => (Math.abs(b) < EPS ? null : -a / b)

/** (x − 1)² + (y + 2)² = 9 */
export function circleEquation(c: Vec, r: number): string {
  const part = (v: number, letter: string) => (Math.abs(v) < EPS ? `${letter}²` : `(${letter} ${v > 0 ? MINUS : '+'} ${numText(Math.abs(v))})²`)
  return `${part(c.x, 'x')} + ${part(c.y, 'y')} = ${numText(r * r)}`
}

/** A vector by its coordinates: 3i − 2j. */
export const vectorText = (d: Vec) => sumText([[d.x, 'i'], [d.y, 'j']])

/** A length: √13 when its square is a whole number that is not a square, else as a number. */
export function lengthText(l: number): string {
  const sq = l * l
  const n = Math.round(sq)
  if (Math.abs(sq - n) < 1e-6 && n > 0 && !Number.isInteger(Math.sqrt(n))) {
    // the squares taken out: √12 = 2√3
    let k = 1
    let m = n
    for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f }
    return `${k === 1 ? '' : k}√${m}`
  }
  return numText(l)
}

/** The signed area of a polygon from the coordinates of its vertices (positive counter-clockwise). */
export function signedArea(pts: Vec[]): number {
  let s = 0
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % pts.length]
    s += p.x * q.y - q.x * p.y
  }
  return s / 2
}

export type Typed =
  | { kind: 'point'; label?: string; x: number; y: number }
  | { kind: 'line'; co: [number, number, number] }
  | { kind: 'circle'; c: Vec; r: number }
  | { kind: 'error'; message: string }

const value = (s: string) => {
  const v = compile(s.trim().replace(/√/g, 'sqrt')).evaluate({}) as unknown
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error()
  return v
}

/**
 * What the user typed: a point A(2, −3) or (2; 2,5), a line 2x − 3y + 6 = 0, y = 2x + 1, x = 3, or a circle
 * (x − 1)^2 + (y + 2)^2 = 9, x^2 + y^2 − 4x = 0.
 */
export function parseTyped(input: string): Typed {
  const text = input.trim().replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/·/g, '*')
  if (!text) return { kind: 'error', message: 'Nu ai scris nimic.' }
  const pt = text.match(/^([A-Za-z][A-Za-z0-9′']*)?\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)$/)
  if (pt && !text.includes('=')) {
    const inside = pt[2]
    // with ";" the comma is the Romanian decimal comma: (2,5; 3)
    const parts = inside.includes(';') ? inside.split(';').map((s) => s.replace(/,/g, '.')) : inside.split(',')
    if (parts.length !== 2) return { kind: 'error', message: 'Un punct are două coordonate: A(2, −3), sau A(2,5; 3) cu zecimale.' }
    try {
      return { kind: 'point', label: pt[1], x: value(parts[0]), y: value(parts[1]) }
    } catch {
      return { kind: 'error', message: 'Nu înțeleg coordonatele: ' + inside }
    }
  }
  const sides = text.split('=')
  if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) {
    return { kind: 'error', message: 'Scrie un punct, ca A(2, −3), sau o ecuație cu un singur semn „=”.' }
  }
  let f: (x: number, y: number) => number
  try {
    const code = compile(`(${sides[0].replace(/,/g, '.')}) - (${sides[1].replace(/,/g, '.')})`)
    f = (x, y) => code.evaluate({ x, y }) as number
    if (typeof f(0.3, 0.7) !== 'number') throw new Error()
  } catch {
    return { kind: 'error', message: 'Nu înțeleg ecuația. Exemple: 2x - 3y + 6 = 0, y = 2x + 1, (x - 1)^2 + (y + 2)^2 = 9.' }
  }
  const samples: Vec[] = [{ x: 2.3, y: -1.7 }, { x: -3.1, y: 0.4 }, { x: 0.9, y: 5.2 }, { x: -4.4, y: -2.6 }]
  const ok = (g: (x: number, y: number) => number) => samples.every(({ x, y }) => Math.abs(f(x, y) - g(x, y)) < 1e-6 * Math.max(1, Math.abs(f(x, y))))
  // a line: f is a·x + b·y + c
  const c = f(0, 0)
  const a = f(1, 0) - c
  const b = f(0, 1) - c
  if (ok((x, y) => a * x + b * y + c)) {
    if (Math.abs(a) < EPS && Math.abs(b) < EPS) return { kind: 'error', message: 'Ecuația nu conține nici x, nici y.' }
    return { kind: 'line', co: niceLine(a, b, c) }
  }
  // a circle: f is A(x² + y²) + Dx + Ey + F
  const F = c
  const A1 = (f(1, 0) + f(-1, 0)) / 2 - F
  const A2 = (f(0, 1) + f(0, -1)) / 2 - F
  const D = (f(1, 0) - f(-1, 0)) / 2
  const E = (f(0, 1) - f(0, -1)) / 2
  if (Math.abs(A1) > EPS && Math.abs(A1 - A2) < 1e-9 * Math.max(1, Math.abs(A1)) && ok((x, y) => A1 * (x * x + y * y) + D * x + E * y + F)) {
    const center = { x: -D / (2 * A1), y: -E / (2 * A1) }
    const r2 = center.x ** 2 + center.y ** 2 - F / A1
    if (r2 <= EPS) return { kind: 'error', message: 'Ecuația nu descrie un cerc: raza ar ieși ' + (r2 < -EPS ? 'imaginară.' : 'zero.') }
    return { kind: 'circle', c: center, r: Math.sqrt(r2) }
  }
  return { kind: 'error', message: 'Pot desena doar drepte (ax + by + c = 0) și cercuri ((x − a)² + (y − b)² = r²). Pentru alte curbe folosește graficul unei funcții.' }
}
