// Runs SymPy (via Pyodide, Python compiled to WebAssembly) off the main thread, so a hard integral
// never freezes the UI and can be cancelled by terminating the worker.

const PYODIDE_VERSION = '0.27.7'
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

const PY = String.raw`
import json
from dataclasses import fields
import sympy as sp
from sympy.integrals.manualintegrate import integral_steps, Rule, RewriteRule

SPECIAL = (sp.erf, sp.erfi, sp.erfc, sp.Si, sp.Ci, sp.Ei, sp.li, sp.Shi, sp.Chi,
           sp.fresnels, sp.fresnelc, sp.gamma, sp.uppergamma, sp.lowergamma, sp.polylog, sp.hyper, sp.meijerg, sp.elliptic_e, sp.elliptic_f)

def tex(e):
    return sp.latex(e, ln_notation=True, inv_trig_style='full')

def parse(src, v):
    loc = {v.name: v, 'E': sp.E, 'pi': sp.pi, 'oo': sp.oo, 'inf': sp.oo}
    e = sp.sympify(src, locals=loc)
    # 0.5 typed by the student should behave like 1/2, not like a float
    return e.xreplace({f: sp.Rational(str(f)) for f in e.atoms(sp.Float)})

def abs_logs(F, f):
    """School convention: the ln coming from ∫ du/u is ln|u|. Only touch logs that were not already in
    the integrand and whose argument is not known to be positive (ln(x²+1) stays as is)."""
    have = f.atoms(sp.log)
    # positivity is decided on a real copy of the variables (x² + 1 > 0 only holds for real x)
    real = {s: sp.Symbol(s.name, real=True) for s in F.free_symbols}
    return F.replace(
        lambda e: isinstance(e, sp.log) and e not in have and not isinstance(e.args[0], sp.Abs)
                  and e.args[0].xreplace(real).is_positive is not True,
        lambda e: sp.log(sp.Abs(e.args[0])),
    )

def ser(r, f, depth=0):
    d = {'rule': type(r).__name__, 'integrand': tex(r.integrand), 'variable': tex(r.variable), 'substeps': []}
    if depth > 40:
        return d
    try:
        d['result'] = tex(abs_logs(r.eval(), f))
    except Exception:
        d['result'] = None
    if d['rule'] == 'RewriteRule':
        try:
            g = r.integrand
            d['partial'] = bool(g.is_rational_function(r.variable) and sp.simplify(r.rewritten - sp.apart(g, r.variable)) == 0)
        except Exception:
            pass
    for fl in fields(r):
        if fl.name in ('integrand', 'variable'):
            continue
        val = getattr(r, fl.name)
        if isinstance(val, Rule):
            d['substeps'].append({'field': fl.name, 'step': ser(val, f, depth + 1)})
        elif isinstance(val, (list, tuple)):
            for item in val:
                if isinstance(item, Rule):
                    d['substeps'].append({'field': fl.name, 'step': ser(item, f, depth + 1)})
                elif isinstance(item, tuple) and item and isinstance(item[0], Rule):
                    cond = tex(item[1]) if len(item) > 1 and isinstance(item[1], sp.Basic) else ''
                    d['substeps'].append({'field': fl.name, 'cond': cond, 'step': ser(item[0], f, depth + 1)})
        elif isinstance(val, sp.Basic):
            d[fl.name] = tex(val)
        elif val is not None:
            d[fl.name] = str(val)
    return d

def school_steps(f, v):
    """manualintegrate often attacks rational functions with odd substitutions; in school they are done by
    polynomial division + partial fractions, so do that rewrite first when it changes anything."""
    try:
        if f.is_rational_function(v) and not f.is_polynomial(v):
            g = sp.apart(sp.cancel(f), v)
            if sp.Add.make_args(g) != sp.Add.make_args(f) and len(sp.Add.make_args(g)) > 1:
                return RewriteRule(integrand=f, variable=v, rewritten=g, substep=integral_steps(g, v))
    except Exception:
        pass  # e.g. symbolic parameters apart() cannot handle
    return integral_steps(f, v)

def nonelementary(f, v):
    try:
        from sympy.integrals.risch import risch_integrate, NonElementaryIntegral
        return isinstance(risch_integrate(f, v), NonElementaryIntegral)
    except Exception:
        return None  # Risch is only implemented for some classes of functions

def integrate(req):
    # a plain symbol: declaring it real makes manualintegrate pick odd routes (e.g. completing the square
    # instead of partial fractions)
    v = sp.Symbol(req['var'])
    f = parse(req['expr'], v)
    out = {'integrand': tex(f)}
    steps = school_steps(f, v)
    complete = not steps.contains_dont_know()
    out['steps'] = ser(steps, f)
    out['completeSteps'] = complete
    F = steps.eval() if complete else sp.integrate(f, v)
    if F.has(sp.Integral):
        out['antiderivative'] = None
        out['nonElementary'] = nonelementary(f, v)
    else:
        G = sp.simplify(F)
        if sp.count_ops(G) <= sp.count_ops(F):
            F = G
        # check before adding |…|: SymPy differentiates ln|u| into sign(u)/|u|, which is harder to compare
        out['verified'] = bool(sp.simplify(sp.diff(F, v) - f) == 0)
        F = abs_logs(F, f)
        out['antiderivative'] = tex(F)
        out['antiderivativeSrc'] = sp.sstr(F)
        out['special'] = bool(F.has(*SPECIAL))
    if req.get('a') is not None and req.get('b') is not None:
        a = parse(req['a'], v)
        b = parse(req['b'], v)
        val = sp.integrate(f, (v, a, b))
        out['a'] = tex(a)
        out['b'] = tex(b)
        if val.has(sp.Integral):
            num = sp.Integral(f, (v, a, b)).evalf(15)
            out['definite'] = None
            out['numeric'] = str(num)
        else:
            val = sp.simplify(val)
            divergent = bool(val in (sp.oo, -sp.oo, sp.zoo) or val.has(sp.nan, sp.zoo))
            out['divergent'] = divergent
            out['definite'] = None if val.has(sp.nan, sp.zoo) else tex(val)
            out['numeric'] = None if divergent else str(sp.N(val, 15))
            if divergent:
                # most common reason in class: the function blows up inside the interval
                try:
                    lo, hi = (a, b) if (b - a).is_nonnegative else (b, a)
                    sing = sp.singularities(f, v, sp.Interval(lo, hi))
                    if sing and sing.is_FiniteSet:
                        out['singular'] = [tex(s) for s in sing]
                except Exception:
                    pass
    return out

def run(req_json):
    req = json.loads(req_json)
    if req['op'] == 'integrate':
        return json.dumps(integrate(req))
    if req['op'] == 'ping':
        return json.dumps({'sympy': sp.__version__})
    raise ValueError('operatie necunoscuta: ' + req['op'])
`

type PyodideAPI = {
  loadPackage: (names: string[]) => Promise<void>
  runPython: (code: string) => unknown
  globals: { get: (name: string) => (arg: string) => string }
}

// the project is type-checked with DOM typings, where postMessage needs a target origin
const postMessage = (m: unknown) => (self as unknown as { postMessage: (m: unknown) => void }).postMessage(m)

let ready: Promise<PyodideAPI> | null = null

function load(): Promise<PyodideAPI> {
  ready ??= (async () => {
    postMessage({ type: 'status', text: 'Se descarcă motorul de calcul (Python + SymPy)… doar prima dată.' })
    const mod = await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`)
    const py: PyodideAPI = await mod.loadPyodide({ indexURL: INDEX_URL })
    postMessage({ type: 'status', text: 'Se încarcă SymPy…' })
    await py.loadPackage(['sympy'])
    py.runPython(PY)
    postMessage({ type: 'ready' })
    return py
  })()
  return ready
}

self.onmessage = async (e: MessageEvent<{ id: number; req: Record<string, unknown> }>) => {
  if (!e.data || typeof e.data.id !== 'number') return
  const { id, req } = e.data
  try {
    const py = await load()
    const out = py.globals.get('run')(JSON.stringify(req))
    postMessage({ type: 'result', id, ok: true, data: JSON.parse(out) })
  } catch (err) {
    const msg = String((err as Error)?.message ?? err)
    // Python tracebacks are long; the last line carries the actual error
    const last = msg.trim().split('\n').filter(Boolean).pop() ?? msg
    postMessage({ type: 'result', id, ok: false, error: last })
  }
}
