// Symbolic differentiation that records every rule it applies, so the result can be explained like in class.
import { ConstantNode, FunctionNode, OperatorNode, SymbolNode } from 'mathjs'
import { type Node, nice, simp, tex } from './expr'

export interface Step {
  title: string // rule name in Romanian
  formula?: string // the general rule, LaTeX
  expr: string // f, LaTeX
  raw?: string // f' exactly as the formula produces it, before simplifying (what a student writes first)
  result: string // f', LaTeX (simplified)
  children: Step[]
}

// ---------- node builders with light constant folding ----------

const num = (v: number): Node => new ConstantNode(v)
const sym = (n: string): Node => new SymbolNode(n)
const isNum = (n: Node, v?: number) => n.type === 'ConstantNode' && (v === undefined || (n as unknown as { value: number }).value === v)
const fn = (name: string, ...args: Node[]): Node => new FunctionNode(sym(name), args)

function mul(...xs: Node[]): Node {
  const f = xs.filter((x) => !isNum(x, 1))
  if (f.some((x) => isNum(x, 0))) return num(0)
  if (!f.length) return num(1)
  return f.reduce((a, b) => new OperatorNode('*', 'multiply', [a, b]))
}
function add(a: Node, b: Node): Node {
  if (isNum(a, 0)) return b
  if (isNum(b, 0)) return a
  return new OperatorNode('+', 'add', [a, b])
}
function sub(a: Node, b: Node): Node {
  if (isNum(b, 0)) return a
  if (isNum(a, 0)) return neg(b)
  return new OperatorNode('-', 'subtract', [a, b])
}
function div(a: Node, b: Node): Node {
  if (isNum(b, 1)) return a
  if (isNum(a, 0)) return num(0)
  return new OperatorNode('/', 'divide', [a, b])
}
function pow(a: Node, b: Node): Node {
  if (isNum(b, 1)) return a
  if (isNum(b, 0)) return num(1)
  return new OperatorNode('^', 'pow', [a, b])
}
function neg(a: Node): Node {
  if (isNum(a, 0)) return a
  return new OperatorNode('-', 'unaryMinus', [a])
}

// ---------- helpers ----------

/** Does the expression contain the variable? Everything else (numbers, e, π, parameters a, b, m…) is a constant. */
export function dependsOn(n: Node, v: string): boolean {
  const a = n as unknown as { type: string; name?: string; args?: Node[]; content?: Node }
  if (a.type === 'SymbolNode') return a.name === v
  if (a.type === 'ConstantNode') return false
  if (a.type === 'ParenthesisNode') return dependsOn(a.content!, v)
  return (a.args ?? []).some((c) => dependsOn(c, v))
}

const isVar = (n: Node, v: string) => n.type === 'SymbolNode' && (n as unknown as { name: string }).name === v
const isE = (n: Node) => n.type === 'SymbolNode' && ['e', 'E'].includes((n as unknown as { name: string }).name)

interface Out {
  d: Node
  step: Step
}

/** Outer derivative f'(u) for each elementary function, plus the rule shown to the student. */
const FUNCS: Record<string, { d: (u: Node) => Node; name: string; formula: string }> = {
  sin: { d: (u) => fn('cos', u), name: 'sinus', formula: "(\\sin u)' = \\cos u \\cdot u'" },
  cos: { d: (u) => neg(fn('sin', u)), name: 'cosinus', formula: "(\\cos u)' = -\\sin u \\cdot u'" },
  tan: { d: (u) => div(num(1), pow(fn('cos', u), num(2))), name: 'tangentă', formula: "(\\operatorname{tg} u)' = \\dfrac{1}{\\cos^2 u} \\cdot u'" },
  cot: { d: (u) => neg(div(num(1), pow(fn('sin', u), num(2)))), name: 'cotangentă', formula: "(\\operatorname{ctg} u)' = -\\dfrac{1}{\\sin^2 u} \\cdot u'" },
  asin: { d: (u) => div(num(1), fn('sqrt', sub(num(1), pow(u, num(2))))), name: 'arcsinus', formula: "(\\arcsin u)' = \\dfrac{1}{\\sqrt{1-u^2}} \\cdot u'" },
  acos: { d: (u) => neg(div(num(1), fn('sqrt', sub(num(1), pow(u, num(2)))))), name: 'arccosinus', formula: "(\\arccos u)' = -\\dfrac{1}{\\sqrt{1-u^2}} \\cdot u'" },
  atan: { d: (u) => div(num(1), add(num(1), pow(u, num(2)))), name: 'arctangentă', formula: "(\\operatorname{arctg} u)' = \\dfrac{1}{1+u^2} \\cdot u'" },
  acot: { d: (u) => neg(div(num(1), add(num(1), pow(u, num(2))))), name: 'arccotangentă', formula: "(\\operatorname{arcctg} u)' = -\\dfrac{1}{1+u^2} \\cdot u'" },
  exp: { d: (u) => fn('exp', u), name: 'exponențiala', formula: "(e^u)' = e^u \\cdot u'" },
  log: { d: (u) => div(num(1), u), name: 'logaritmul natural', formula: "(\\ln u)' = \\dfrac{1}{u} \\cdot u'" },
  log10: { d: (u) => div(num(1), mul(u, fn('log', num(10)))), name: 'logaritmul zecimal', formula: "(\\lg u)' = \\dfrac{1}{u \\ln 10} \\cdot u'" },
  log2: { d: (u) => div(num(1), mul(u, fn('log', num(2)))), name: 'logaritmul în baza 2', formula: "(\\log_2 u)' = \\dfrac{1}{u \\ln 2} \\cdot u'" },
  sqrt: { d: (u) => div(num(1), mul(num(2), fn('sqrt', u))), name: 'radicalul', formula: "(\\sqrt{u})' = \\dfrac{1}{2\\sqrt{u}} \\cdot u'" },
  cbrt: { d: (u) => div(num(1), mul(num(3), pow(fn('cbrt', u), num(2)))), name: 'radicalul de ordin 3', formula: "(\\sqrt[3]{u})' = \\dfrac{1}{3\\sqrt[3]{u^2}} \\cdot u'" },
  abs: { d: (u) => div(u, fn('abs', u)), name: 'modulul', formula: "(|u|)' = \\dfrac{u}{|u|} \\cdot u' \\quad (u \\neq 0)" },
  sinh: { d: (u) => fn('cosh', u), name: 'sinus hiperbolic', formula: "(\\sinh u)' = \\cosh u \\cdot u'" },
  cosh: { d: (u) => fn('sinh', u), name: 'cosinus hiperbolic', formula: "(\\cosh u)' = \\sinh u \\cdot u'" },
  tanh: { d: (u) => div(num(1), pow(fn('cosh', u), num(2))), name: 'tangentă hiperbolică', formula: "(\\tanh u)' = \\dfrac{1}{\\cosh^2 u} \\cdot u'" },
}

export function differentiate(n: Node, v: string): Out {
  const children: Step[] = []
  const sub_ = (x: Node) => {
    const r = differentiate(x, v)
    children.push(r.step)
    return r.d
  }
  const done = (d: Node, title: string, formula?: string): Out => {
    const s = nice(d, v)
    const raw = tex(d)
    const result = tex(s)
    return { d: s, step: { title, formula, expr: tex(n), raw: raw !== result ? raw : undefined, result, children } }
  }

  if (!dependsOn(n, v)) return done(num(0), 'Derivata unei constante', "c' = 0")
  if (isVar(n, v)) return done(num(1), `Derivata lui ${v}`, `${v}' = 1`)

  const node = n as unknown as { type: string; op?: string; fn?: { name: string } | string; args: Node[] }

  if (node.type === 'OperatorNode') {
    const [a, b] = node.args
    switch (node.op) {
      case '+':
        if (node.args.length === 1) return differentiate(a, v)
        return done(node.args.map(sub_).reduce(add), 'Derivata sumei', "(f + g)' = f' + g'")
      case '-':
        if (node.args.length === 1) return done(neg(sub_(a)), 'Derivata cu semnul minus', "(-f)' = -f'")
        return done(sub(sub_(a), sub_(b)), 'Derivata diferenței', "(f - g)' = f' - g'")
      case '*': {
        const consts = node.args.filter((x) => !dependsOn(x, v))
        const vars = node.args.filter((x) => dependsOn(x, v))
        if (consts.length && vars.length === 1)
          return done(mul(...consts, sub_(vars[0])), 'Constanta iese în fața derivatei', "(c \\cdot f)' = c \\cdot f'")
        const f = vars.length === node.args.length ? a : mul(...consts, vars[0])
        const g = vars.length === node.args.length ? (node.args.length > 2 ? mul(...node.args.slice(1)) : b) : mul(...vars.slice(1))
        const df = sub_(f)
        const dg = sub_(g)
        return done(add(mul(df, g), mul(f, dg)), 'Derivata produsului', "(f \\cdot g)' = f' \\cdot g + f \\cdot g'")
      }
      case '/': {
        if (!dependsOn(b, v)) return done(div(sub_(a), b), 'Împărțirea la o constantă', "\\left(\\dfrac{f}{c}\\right)' = \\dfrac{f'}{c}")
        if (!dependsOn(a, v)) {
          const dg = sub_(b)
          return done(neg(div(mul(a, dg), pow(b, num(2)))), 'Derivata unei constante supra o funcție', "\\left(\\dfrac{c}{g}\\right)' = -\\dfrac{c \\cdot g'}{g^2}")
        }
        const df = sub_(a)
        const dg = sub_(b)
        const raw = div(sub(mul(df, b), mul(a, dg)), pow(b, num(2)))
        // textbook form: expand the numerator but keep the denominator as g², unless cancelling gives something shorter
        const kept = div(nice(sub(mul(df, b), mul(a, dg)), v), pow(b, num(2)))
        const cancelled = nice(raw, v)
        const best = tex(cancelled).length < tex(kept).length * 0.7 ? cancelled : kept
        const formula = "\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f' \\cdot g - f \\cdot g'}{g^2}"
        return { d: best, step: { title: 'Derivata câtului', formula, expr: tex(n), raw: tex(raw), result: tex(best), children } }
      }
      case '^': {
        const baseVar = dependsOn(a, v)
        const expVar = dependsOn(b, v)
        if (baseVar && !expVar) {
          const outer = mul(b, pow(a, simp(sub(b, num(1)))))
          if (isVar(a, v)) return done(outer, 'Derivata puterii', "(x^n)' = n \\cdot x^{n-1}")
          return done(mul(outer, sub_(a)), 'Puterea unei funcții (regula funcției compuse)', "(u^n)' = n \\cdot u^{n-1} \\cdot u'")
        }
        if (!baseVar && expVar) {
          if (isE(a)) {
            if (isVar(b, v)) return done(n, 'Derivata exponențialei', "(e^x)' = e^x")
            return done(mul(n, sub_(b)), 'Exponențiala compusă', "(e^u)' = e^u \\cdot u'")
          }
          const outer = mul(n, fn('log', a))
          if (isVar(b, v)) return done(outer, 'Derivata funcției exponențiale', "(a^x)' = a^x \\ln a")
          return done(mul(outer, sub_(b)), 'Funcția exponențială compusă', "(a^u)' = a^u \\ln a \\cdot u'")
        }
        // f^g with both depending on x: f^g = e^{g ln f}
        const df = sub_(a)
        const dg = sub_(b)
        return done(
          mul(n, add(mul(dg, fn('log', a)), div(mul(b, df), a))),
          'Funcție la putere funcție (scriem f^g = e^{g ln f})',
          "(f^g)' = f^g \\left(g' \\ln f + g \\cdot \\dfrac{f'}{f}\\right)",
        )
      }
    }
  }

  if (node.type === 'FunctionNode') {
    const name = typeof node.fn === 'string' ? node.fn : node.fn!.name
    const [u, base] = node.args
    if (name === 'log' && base) {
      // log_b(u) = ln u / ln b
      const outer = div(num(1), mul(u, fn('log', base)))
      if (isVar(u, v)) return done(outer, 'Derivata logaritmului în baza b', "(\\log_b x)' = \\dfrac{1}{x \\ln b}")
      return done(mul(outer, sub_(u)), 'Logaritm în baza b, compus', "(\\log_b u)' = \\dfrac{1}{u \\ln b} \\cdot u'")
    }
    if (name === 'nthRoot' && base) return differentiate(pow(u, div(num(1), base)), v)
    const rule = FUNCS[name]
    if (!rule) throw new Error(`Nu știu să derivez funcția „${name}”.`)
    const outer = rule.d(u)
    if (isVar(u, v)) return done(outer, `Derivata funcției ${rule.name}`, rule.formula.replace(/ \\cdot u'/g, '').replace(/\bu\b/g, v))
    return done(mul(outer, sub_(u)), `Regula funcției compuse (${rule.name})`, rule.formula)
  }

  throw new Error('Expresie nesuportată pentru derivare.')
}

export function derivativeOf(n: Node, v: string, order = 1): { result: Node; steps: Step[] } {
  let cur = n
  const steps: Step[] = []
  for (let i = 0; i < order; i++) {
    const r = differentiate(cur, v)
    steps.push(r.step)
    cur = r.d
  }
  return { result: cur, steps }
}
