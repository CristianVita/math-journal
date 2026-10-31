// Parsing, LaTeX, SymPy serialisation and numeric helpers shared by the derivative and integral calculators.
import { parse, rationalize, simplify, type MathNode } from 'mathjs'

export type Node = MathNode

/** Romanian / school notation → mathjs names. Longest names first so "arcctg" is not eaten by "ctg". */
const NAME_MAP: [RegExp, string][] = [
  [/\barcctg\b/g, 'acot'],
  [/\barctg\b/g, 'atan'],
  [/\barcsin\b/g, 'asin'],
  [/\barccos\b/g, 'acos'],
  [/\bctg\b/g, 'cot'],
  [/\btg\b/g, 'tan'],
  [/\bln\b/g, 'log'],
  [/\blg\b/g, 'log10'],
  [/π/g, 'pi'],
  [/√/g, 'sqrt'],
  [/·|×/g, '*'],
  [/:/g, '/'],
]

const FN_NAMES = 'sin|cos|tan|cot|asin|acos|atan|acot|sinh|cosh|tanh|log|log10|exp|sqrt'

/** Turn what a student types ("tg^2(x)", "ln x", "2·x") into something mathjs parses. */
export function normalizeInput(src: string): string {
  let s = src.trim().replace(/,(?=\d)/g, '.')
  for (const [re, to] of NAME_MAP) s = s.replace(re, to)
  // sin^2(x) → sin(x)^2   (only for a simple, non-nested argument)
  s = s.replace(new RegExp(`\\b(${FN_NAMES})\\^(\\d+|\\(\\d+\\))\\(([^()]*)\\)`, 'g'), '$1($3)^$2')
  // "sin x", "ln x", "tg 2x" → sin(x)   (argument = a single term without spaces)
  s = s.replace(new RegExp(`\\b(${FN_NAMES})\\s+([0-9.]*[a-zA-Z]\\w*(?:\\^\\w+)?)`, 'g'), '$1($2)')
  // "x(x+1)" is a product in class, but a function call for mathjs: insert the multiplication
  s = s.replace(/\b([a-zA-Z_]\w*)\s*\(/g, (m, name: string) => (name in KNOWN_FNS ? m : `${name}*(`))
  return s
}

const KNOWN_FNS: Record<string, true> = Object.fromEntries(
  (FN_NAMES + '|log2|cbrt|abs|nthRoot|sign|sec|csc|asinh|acosh|atanh').split('|').map((k) => [k, true]),
)

export function stripParens(n: Node): Node {
  if (n.type === 'ParenthesisNode') return stripParens((n as unknown as { content: Node }).content)
  return n.map((c) => stripParens(c))
}

export interface Parsed {
  node: Node
  normalized: string
}

export function parseExpr(src: string): Parsed {
  const normalized = normalizeInput(src)
  if (!normalized) throw new Error('Introdu o expresie.')
  let node: Node
  try {
    node = parse(normalized)
  } catch (e) {
    throw new Error('Expresie invalidă: ' + (e as Error).message)
  }
  return { node: stripParens(node), normalized }
}

// ---------- LaTeX ----------

const TEX_FN: Record<string, string> = {
  tan: '\\operatorname{tg}', cot: '\\operatorname{ctg}', atan: '\\operatorname{arctg}', acot: '\\operatorname{arcctg}',
  asin: '\\arcsin', acos: '\\arccos', log10: '\\lg',
}

export function tex(n: Node): string {
  // mathjs prints some single-letter parameters as \mathrm{b}; in math they are italic like any variable
  return toTexRaw(n).replace(/\\mathrm\{([a-zA-Z])\}/g, '$1')
}

function toTexRaw(n: Node): string {
  return n.toTex({
    implicit: 'hide',
    parenthesis: 'auto',
    handler: (node: Node, options: object) => {
      if (node.type !== 'FunctionNode') return undefined
      const f = node as unknown as { fn: { name: string }; args: Node[] }
      const arg = () => f.args[0].toTex(options)
      if (f.fn.name === 'exp') return `e^{${arg()}}`
      if (TEX_FN[f.fn.name] && f.args.length === 1) return `${TEX_FN[f.fn.name]}\\left(${arg()}\\right)`
      if (f.fn.name === 'log' && f.args.length === 2) return `\\log_{${f.args[1].toTex(options)}}\\left(${arg()}\\right)`
      return undefined
    },
  })
}

/** SymPy writes ln|u| as \ln{\left(\left|{u}\right| \right)}; turn it into \ln\left|u\right| (brace-matched). */
function lnAbs(s: string): string {
  const open = '\\ln{\\left(\\left|{'
  const close = '}\\right| \\right)}'
  let out = ''
  let i = 0
  for (;;) {
    const j = s.indexOf(open, i)
    if (j < 0) return out + s.slice(i)
    let depth = 1
    let k = j + open.length
    for (; k < s.length && depth; k++) {
      if (s[k] === '{') depth++
      else if (s[k] === '}') depth--
    }
    // k is just past the brace that closes the |…| content
    if (s.startsWith(close, k - 1)) {
      out += s.slice(i, j) + '\\ln\\left|' + s.slice(j + open.length, k - 1) + '\\right|'
      i = k - 1 + close.length
    } else {
      out += s.slice(i, j + open.length)
      i = j + open.length
    }
  }
}

/** SymPy prints \tan, \log, \operatorname{acot}…; switch to the notation used in Romanian schools. */
export function roTex(s: string): string {
  return lnAbs(s)
    .replace(/\\operatorname\{acot\}/g, '\\operatorname{arcctg}')
    .replace(/\\operatorname\{atan\}/g, '\\operatorname{arctg}')
    .replace(/\\arctan(?![a-z])/g, '\\operatorname{arctg}')
    .replace(/\\operatorname\{arccot\}/g, '\\operatorname{arcctg}')
    .replace(/\\tan(?![a-z])/g, '\\operatorname{tg}')
    .replace(/\\cot(?![a-z])/g, '\\operatorname{ctg}')
    .replace(/\\log(?![a-z_])/g, '\\ln')
}

// ---------- simplification ----------

const MATH_CONSTS = new Set(['e', 'pi', 'E', 'PI'])

/** True when the subtree has no free symbols (only numbers, e, π). */
function isNumeric(n: Node): boolean {
  let ok = true
  n.traverse((c) => {
    if (c.type === 'SymbolNode') {
      const name = (c as unknown as { name: string }).name
      // function names are SymbolNodes too; only flag real variables
      if (!MATH_CONSTS.has(name) && !(name in FN_SET)) ok = false
    }
  })
  return ok
}
const FN_SET: Record<string, true> = Object.fromEntries(
  'sin cos tan cot asin acos atan acot sinh cosh tanh log log10 log2 exp sqrt cbrt abs nthRoot'.split(' ').map((k) => [k, true]),
)

/**
 * mathjs folds ln 2, √3, sin 1 into decimals; a student expects them exact. Swap such sub-terms for
 * placeholder symbols while simplifying, then put them back.
 */
export function simp(n: Node): Node {
  const saved: Node[] = []
  const protect = (x: Node): Node => {
    if (x.type === 'FunctionNode' && isNumeric(x)) {
      saved.push(x)
      return parse(`K__${saved.length - 1}`)
    }
    return x.map(protect)
  }
  const restore = (x: Node): Node => {
    if (x.type === 'SymbolNode') {
      const m = /^K__(\d+)$/.exec((x as unknown as { name: string }).name)
      if (m) return saved[Number(m[1])]
    }
    return x.map(restore)
  }
  try {
    return restore(simplify(protect(n)))
  } catch {
    return n
  }
}

// ---------- rational functions: cancel common factors ----------

type Poly = number[] // coefficients, index = power

const trim = (p: Poly) => {
  const q = [...p]
  while (q.length > 1 && Math.abs(q[q.length - 1]) < 1e-12) q.pop()
  return q
}
const deg = (p: Poly) => trim(p).length - 1

function polyDivmod(a: Poly, b: Poly): [Poly, Poly] {
  let r = trim(a)
  const d = trim(b)
  const q: Poly = new Array(Math.max(1, r.length - d.length + 1)).fill(0)
  while (r.length >= d.length && !(r.length === 1 && Math.abs(r[0]) < 1e-12)) {
    const k = r[r.length - 1] / d[d.length - 1]
    const shift = r.length - d.length
    q[shift] = k
    r = trim(r.map((c, i) => (i >= shift && i - shift < d.length ? c - k * d[i - shift] : c)))
    if (shift === 0) break
  }
  return [trim(q), r]
}

function polyGcd(a: Poly, b: Poly): Poly {
  let x = trim(a)
  let y = trim(b)
  while (!(y.length === 1 && Math.abs(y[0]) < 1e-9)) {
    const [, r] = polyDivmod(x, y)
    // relative tolerance: tiny remainders are rounding noise
    const scale = Math.max(...x.map(Math.abs), 1)
    x = y
    y = r.every((c) => Math.abs(c) < 1e-9 * scale) ? [0] : r
  }
  return x.map((c) => c / x[x.length - 1])
}

function polyNode(p: Poly, v: string): Node | null {
  const terms: string[] = []
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i]
    if (Math.abs(c) < 1e-12) continue
    const r = Math.round(c)
    if (Math.abs(c - r) > 1e-9) return null // keep it simple: integer coefficients only
    const mon = i === 0 ? '' : i === 1 ? v : `${v}^${i}`
    const coef = i === 0 ? String(Math.abs(r)) : Math.abs(r) === 1 ? '' : `${Math.abs(r)}*`
    terms.push(`${r < 0 ? '-' : terms.length ? '+' : ''} ${coef}${mon}`)
  }
  return parse(terms.join(' ') || '0')
}

/** For a rational function of v, divide numerator and denominator by their gcd. */
function cancelRational(n: Node, v: string): Node | null {
  try {
    const r = rationalize(n, {}, true) as unknown as { numerator: Node; denominator: Node | null; coefficients: Poly; variables: string[] }
    if (r.variables.some((x) => x !== v)) return null
    const num = r.coefficients
    const den = r.denominator ? (rationalize(r.denominator, {}, true) as unknown as { coefficients: Poly }).coefficients : [1]
    const g = polyGcd(num, den)
    let [qn] = polyDivmod(num, g)
    let [qd] = polyDivmod(den, g)
    // make the leading coefficient of the denominator positive and as small as possible
    const lead = qd[qd.length - 1]
    qn = qn.map((c) => c / lead)
    qd = qd.map((c) => c / lead)
    const nn = polyNode(qn, v)
    const dn = polyNode(qd, v)
    if (!nn || !dn) return null
    return deg(qd) === 0 ? nn : parse(`(${nn.toString()}) / (${dn.toString()})`)
  } catch {
    return null
  }
}

const isDiv = (n: Node) => n.type === 'OperatorNode' && (n as unknown as { op: string }).op === '/' && (n as unknown as { args: Node[] }).args.length === 2
const argsOf = (n: Node) => (n as unknown as { args: Node[] }).args

/** (p/q)/r → p/(q·r) and p/(q/r) → (p·r)/q, bottom-up: nested fractions are hard to read. */
function flattenFractions(n: Node): Node {
  const m = n.map(flattenFractions)
  if (!isDiv(m)) return m
  const [top, bottom] = argsOf(m)
  if (isDiv(top)) {
    const [p, q] = argsOf(top)
    return flattenFractions(parse(`(${p.toString()}) / ((${q.toString()}) * (${bottom.toString()}))`))
  }
  if (isDiv(bottom)) {
    const [q, r] = argsOf(bottom)
    return flattenFractions(parse(`((${top.toString()}) * (${r.toString()})) / (${q.toString()})`))
  }
  return m
}

/** The most readable equivalent form we can find: plain simplification vs. cancelled rational function. */
export function nice(n: Node, v: string): Node {
  const cancelled = cancelRational(n, v)
  const candidates = [simp(n), n, ...(cancelled ? [simp(cancelled)] : [])].map(flattenFractions)
  // shortest LaTeX wins; mathjs simplify sometimes makes things longer (e.g. with cube roots)
  return candidates.reduce((best, c) => (tex(c).length < tex(best).length ? c : best))
}

// ---------- SymPy serialisation ----------

const SYMPY_FN: Record<string, string> = { abs: 'Abs', nthRoot: 'root' }

/** Serialise a mathjs tree as SymPy source (same tree the student saw in the preview, so both engines agree). */
export function toSympy(n: Node): string {
  const a = n as unknown as { type: string; value?: unknown; name?: string; op?: string; args?: Node[]; content?: Node; fn?: { name: string } }
  switch (a.type) {
    case 'ConstantNode':
      return String(a.value)
    case 'SymbolNode':
      return a.name === 'e' ? 'E' : a.name === 'pi' ? 'pi' : a.name!
    case 'ParenthesisNode':
      return `(${toSympy(a.content!)})`
    case 'OperatorNode': {
      const args = a.args!.map(toSympy)
      if (args.length === 1) return a.op === '-' ? `(-${args[0]})` : args[0]
      const op = a.op === '^' ? '**' : a.op!
      return '(' + args.join(` ${op} `) + ')'
    }
    case 'FunctionNode': {
      const name = a.fn!.name
      const args = a.args!.map(toSympy)
      if (name === 'log10') return `log(${args[0]}, 10)`
      if (name === 'log2') return `log(${args[0]}, 2)`
      return `${SYMPY_FN[name] ?? name}(${args.join(', ')})`
    }
    default:
      throw new Error('Construcție nesuportată: ' + a.type)
  }
}

// ---------- numeric helpers ----------

export function evalAt(n: Node, v: string, x: number): number {
  try {
    const r = n.evaluate({ [v]: x })
    return typeof r === 'number' ? r : NaN
  } catch {
    return NaN
  }
}

/**
 * Do two expressions agree as functions of v? Compares them at many sample points, skipping points
 * outside either domain. `upToConstant` accepts a constant difference (antiderivatives).
 */
export function sameFunction(f: Node, g: Node, v: string, upToConstant = false): { ok: boolean; checked: number; counterexample?: number } {
  const pts = [-2.7, -1.9, -1.3, -0.77, -0.41, 0.23, 0.37, 0.61, 0.83, 1.17, 1.49, 1.91, 2.33, 2.9, 3.7, 5.1]
  // parameters (a, b, m…) get fixed "random" values so expressions with them can still be compared
  const params: Record<string, number> = {}
  const vals = [1.37, 2.11, 0.73, 3.29, 1.83, 2.57]
  for (const n of [f, g])
    n.traverse((c, path, parent) => {
      const name = (c as unknown as { name?: string }).name
      const isFnName = parent?.type === 'FunctionNode' && path === 'fn'
      if (c.type === 'SymbolNode' && !isFnName && name !== v && !MATH_CONSTS.has(name!) && !(name! in params))
        params[name!] = vals[Object.keys(params).length % vals.length]
    })
  const at = (n: Node, x: number) => {
    try {
      const r = n.evaluate({ ...params, [v]: x })
      return typeof r === 'number' ? r : NaN
    } catch {
      return NaN
    }
  }
  let checked = 0
  let offset: number | null = null
  for (const x of pts) {
    const a = at(f, x)
    const b = at(g, x)
    if (!isFinite(a) || !isFinite(b)) continue
    const diff = a - b
    if (upToConstant) {
      if (offset == null) {
        offset = diff
        checked++
        continue
      }
      if (Math.abs(diff - offset) > 1e-6 * Math.max(1, Math.abs(a), Math.abs(b))) return { ok: false, checked, counterexample: x }
    } else if (Math.abs(diff) > 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))) return { ok: false, checked, counterexample: x }
    checked++
  }
  return { ok: checked >= 4, checked }
}

/** Adaptive Simpson; good enough to sanity-check a definite integral offline. */
export function numericIntegral(n: Node, v: string, a: number, b: number): number {
  const f = (x: number) => evalAt(n, v, x)
  const simpson = (l: number, r: number, fl: number, fm: number, fr: number) => ((r - l) / 6) * (fl + 4 * fm + fr)
  const rec = (l: number, r: number, fl: number, fm: number, fr: number, whole: number, eps: number, depth: number): number => {
    const m = (l + r) / 2
    const lm = (l + m) / 2
    const rm = (m + r) / 2
    const flm = f(lm)
    const frm = f(rm)
    const left = simpson(l, m, fl, flm, fm)
    const right = simpson(m, r, fm, frm, fr)
    if (depth <= 0 || Math.abs(left + right - whole) <= 15 * eps) return left + right + (left + right - whole) / 15
    return rec(l, m, fl, flm, fm, left, eps / 2, depth - 1) + rec(m, r, fm, frm, fr, right, eps / 2, depth - 1)
  }
  const fa = f(a)
  const fb = f(b)
  const fm = f((a + b) / 2)
  return rec(a, b, fa, fm, fb, simpson(a, b, fa, fm, fb), 1e-10, 40)
}
