// Small exact arithmetic for the exercises, and how its numbers are written in LaTeX, as in a Romanian textbook.

/** A random source in [0, 1); seeded, so that a worksheet can be made again exactly and tests are repeatable. */
export type Rng = () => number

export function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A whole number from lo to hi, both included. */
export const int = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1))
/** Like `int`, but never 0. */
export const nonZero = (rng: Rng, lo: number, hi: number) => {
  for (;;) {
    const n = int(rng, lo, hi)
    if (n !== 0) return n
  }
}
export const pick = <T,>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)]
export const shuffle = <T,>(rng: Rng, list: T[]): T[] => {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

/** n written as k²·m with m without square factors: [k, m]. */
export function rootParts(n: number): [number, number] {
  let k = 1
  let m = n
  for (let f = 2; f * f <= m; f++) {
    while (m % (f * f) === 0) {
      m /= f * f
      k *= f
    }
  }
  return [k, m]
}

/** p/q in lowest terms, with the sign on top. */
export function reduce(p: number, q: number): [number, number] {
  if (q < 0) {
    p = -p
    q = -q
  }
  const g = gcd(p, q) || 1
  return [p / g, q / g]
}

/** A fraction in LaTeX: 3, -2, \frac{3}{4}, -\frac{1}{2}. */
export function frac(p: number, q = 1): string {
  const [n, d] = reduce(p, q)
  if (d === 1) return String(n)
  return (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`
}

/** (p/q)·√r, with r without square factors, in LaTeX: \frac{\sqrt{3}}{2}, 2\sqrt{2}, -\frac{3\sqrt{2}}{4}. */
export function surd(p: number, q: number, r: number): string {
  if (r === 1 || p === 0) return frac(p, q)
  const [n, d] = reduce(p, q)
  const top = (Math.abs(n) === 1 ? '' : Math.abs(n)) + `\\sqrt{${r}}`
  return (n < 0 ? '-' : '') + (d === 1 ? top : `\\frac{${top}}{${d}}`)
}

/** √n simplified: \sqrt{8} → 2\sqrt{2}, \sqrt{9} → 3. */
export function root(n: number): string {
  const [k, m] = rootParts(n)
  return surd(k, 1, m)
}

/** A sum of terms like 3x², -x, 5, written as in a textbook: 3x^2 - x + 5. Zero terms are left out. */
export function poly(terms: [number, string][]): string {
  let out = ''
  for (const [c, v] of terms) {
    if (c === 0) continue
    const abs = Math.abs(c)
    const body = v ? (abs === 1 ? '' : abs) + v : String(abs)
    out += out ? (c < 0 ? ' - ' : ' + ') + body : (c < 0 ? '-' : '') + body
  }
  return out || '0'
}

/** A number inside an expression: in brackets when negative, as the Romanian textbooks write it. */
export const paren = (n: number | string) => (String(n).startsWith('-') ? `(${n})` : String(n))

/** An angle given in degrees, written in radians: 0, \frac{\pi}{6}, -\frac{2\pi}{3}, \pi. */
export function radians(deg: number): string {
  const [p, q] = reduce(deg, 180)
  if (p === 0) return '0'
  const top = (Math.abs(p) === 1 ? '' : Math.abs(p)) + '\\pi'
  return (p < 0 ? '-' : '') + (q === 1 ? top : `\\frac{${top}}{${q}}`)
}

/**
 * An exact value a + b√2 + c√3 + d√6 with rational a, b, c, d, enough for the special angles and their sums.
 * Kept as fractions [p, q] for each root.
 */
export type Exact = Map<number, [number, number]>

export const exact = (p: number, q: number, r = 1): Exact => new Map([[r, reduce(p, q)]])

export function addExact(a: Exact, b: Exact, k = 1): Exact {
  const out: Exact = new Map(a)
  for (const [r, [p, q]] of b) {
    const [p0, q0] = out.get(r) ?? [0, 1]
    out.set(r, reduce(p0 * q + k * p * q0, q0 * q))
  }
  return out
}

/** The value written out: the rational part first, then the roots in order. */
export function exactTex(v: Exact): string {
  let out = ''
  for (const r of [...v.keys()].sort((a, b) => a - b)) {
    const [p, q] = v.get(r)!
    if (p === 0) continue
    const t = surd(p, q, r)
    out += out ? (t.startsWith('-') ? ' - ' + t.slice(1) : ' + ' + t) : t
  }
  return out || '0'
}

export const exactValue = (v: Exact) => [...v].reduce((s, [r, [p, q]]) => s + (p / q) * Math.sqrt(r), 0)

/** A number before a noun, as Romanian says it: "19 elevi", but "20 de elevi", "105 elevi", "120 de elevi". */
export const de = (n: number) => {
  const r = Math.abs(n) % 100
  return r === 0 && n !== 0 || r >= 20 ? `${n} de` : String(n)
}

const rightCache = new Map<number, [number, number, number][]>()
/**
 * A right triangle with whole sides and the hypotenuse at most maxHyp, among all of them (not only multiples of
 * 3-4-5), with its legs in either order: [leg, leg, hypotenuse]. So that a sheet of 100 exercises need not repeat one.
 */
export function rightTriangle(rng: Rng, maxHyp = 100, minLeg = 3): [number, number, number] {
  let all = rightCache.get(maxHyp)
  if (!all) {
    all = []
    for (let c = 5; c <= maxHyp; c++) for (let a = 3; a * a * 2 < c * c; a++) {
      const b = Math.sqrt(c * c - a * a)
      if (Number.isInteger(b)) all.push([a, b, c])
    }
    rightCache.set(maxHyp, all)
  }
  const ok = all.filter(([a]) => a >= minLeg)
  const [a, b, c] = pick(rng, ok)
  return rng() < 0.5 ? [a, b, c] : [b, a, c]
}
