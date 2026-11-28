// Small tools for the algebra forms of grade VIII: polynomials in x by their coefficients, intervals, checks by values.
import type { Made } from './generators'
import { frac, poly } from './tex'

export type Form = (rng: () => number) => Made
export interface Kind8 { id: string; label: string; topic: 'Algebră' | 'Geometrie'; joins?: string; forms: Record<1 | 2 | 3, Form[]> }

/** Coefficients from the highest power down: [1, -2, 3] = x² − 2x + 3. */
export type P = number[]
export const X = (p: P, v = 'x') => poly(p.map((c, i) => {
  const e = p.length - 1 - i
  return [c, e === 0 ? '' : e === 1 ? v : `${v}^${e}`]
}))
export const at = (p: P, x: number) => p.reduce((s, c) => s * x + c, 0)
export const mul = (a: P, b: P): P => {
  const out = Array.from({ length: a.length + b.length - 1 }, () => 0)
  a.forEach((u, i) => b.forEach((v, j) => { out[i + j] += u * v }))
  return out
}
export const add = (a: P, b: P, k = 1): P => {
  const n = Math.max(a.length, b.length)
  return Array.from({ length: n }, (_, i) => (a[i - n + a.length] ?? 0) + k * (b[i - n + b.length] ?? 0))
}
/** x + a */
export const lin = (a: number, v = 'x') => X([1, a], v)
/** The factor (x + a), or x alone. */
export const fac = (a: number) => (a === 0 ? 'x' : `(${lin(a)})`)
/** " + 5", " - 5" after something else; nothing for 0 */
export const sgn = (n: number) => (n === 0 ? '' : n < 0 ? ` - ${-n}` : ` + ${n}`)
/** a coefficient before a bracket or letter: '', '-', '3' */
export const cf = (n: number) => (n === 1 ? '' : n === -1 ? '-' : String(n))
export const lines = (...l: string[]) => l.filter(Boolean).join('\n\n')
export const show = (tex: string) => `$$${tex}$$`
export const near = (a: number, b: number) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))
/** Two expressions equal at enough values (where both exist). */
export const same = (f: (x: number) => number, g: (x: number) => number) =>
  [0.37, 1.71, -2.43, 5.19, -7.61, 11.3].every((x) => near(f(x), g(x)))
export const setOf = (l: (number | string)[]) => (l.length ? `\\{${l.join(';\\ ')}\\}` : '\\varnothing')
export const asc = (l: number[]) => [...new Set(l)].sort((a, b) => a - b)
export const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)
export const R = '\\mathbb{R}', Z = '\\mathbb{Z}', N = '\\mathbb{N}'

/** An interval with whole (or infinite) ends. */
export interface Iv { a: number; b: number; l: boolean; r: boolean }
export const iv = (i: Iv) => `${i.l ? '[' : '('}${i.a === -Infinity ? '-\\infty' : i.a}, ${i.b === Infinity ? '+\\infty' : i.b}${i.r ? ']' : ')'}`
export const has = (i: Iv, x: number) => (x > i.a || (i.l && x === i.a)) && (x < i.b || (i.r && x === i.b))
/** The fraction \frac{num}{den} of two expressions. */
export const fr = (n: string | number, d: string | number) => `\\frac{${n}}{${d}}`
export const q = frac
/** The solutions of a relation "x rel p/q". */
export const solIv = (rel: string, v: string) => {
  const [l, r] = v.includes('frac') ? ['\\left', '\\right'] : ['', '']
  return { '<': `${l}(-\\infty, ${v}${r})`, '\\le': `${l}(-\\infty, ${v}${r}]`, '>': `${l}(${v}, +\\infty${r})`, '\\ge': `${l}[${v}, +\\infty${r})` }[rel]!
}
export const FLIP: Record<string, string> = { '<': '>', '\\le': '\\ge', '>': '<', '\\ge': '\\le' }
export const holds = (rel: string, a: number, b: number) => (rel === '<' ? a < b : rel === '\\le' ? a <= b : rel === '>' ? a > b : a >= b)
