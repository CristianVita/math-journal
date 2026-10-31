export const toRad = (d: number) => (d * Math.PI) / 180
export const toDeg = (r: number) => (r * 180) / Math.PI

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))

/** Degrees → radians written as a fraction of π when it is a "nice" one (denominator ≤ 12), else decimal. */
export function radLatex(deg: number): string {
  const num = Math.round(deg * 1000)
  const den = 180000
  if (Math.abs(deg * 1000 - num) < 1e-6) {
    const g = gcd(num, den)
    const p = num / g
    const q = den / g
    if (q <= 12) {
      if (p === 0) return '0'
      const sign = p < 0 ? '-' : ''
      const ap = Math.abs(p)
      const top = ap === 1 ? '\\pi' : `${ap}\\pi`
      return q === 1 ? sign + top : `${sign}\\frac{${top}}{${q}}`
    }
  }
  return (toRad(deg)).toFixed(4)
}

const SIN_REF: Record<number, string> = { 0: '0', 30: '\\frac{1}{2}', 45: '\\frac{\\sqrt{2}}{2}', 60: '\\frac{\\sqrt{3}}{2}', 90: '1' }
const TG_REF: Record<number, string | null> = { 0: '0', 30: '\\frac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}', 90: null }

const neg = (s: string, negative: boolean) => (negative && s !== '0' ? '-' + s : s)

/** Exact values for multiples of 30° and 45°; `null` entries mean "nu există" (undefined). */
export function exactTrig(deg: number): { sin: string; cos: string; tg: string | null; ctg: string | null } | undefined {
  if (Math.abs(deg - Math.round(deg)) > 1e-9) return undefined
  const d = ((Math.round(deg) % 360) + 360) % 360
  if (d % 30 !== 0 && d % 45 !== 0) return undefined
  const quadrant = Math.floor(d / 90) // 0..3
  // acute reference angle measured from the x-axis
  const r = d % 180 === 0 ? 0 : d % 90 === 0 ? 90 : quadrant % 2 === 0 ? d % 90 : 90 - (d % 90)
  const sinNeg = d > 180
  const cosNeg = d > 90 && d < 270
  const sin = neg(SIN_REF[r], sinNeg)
  const cos = neg(SIN_REF[90 - r], cosNeg)
  const tgNeg = sinNeg !== cosNeg
  const tgRaw = TG_REF[r]
  const ctgRaw = TG_REF[90 - r]
  return {
    sin,
    cos,
    tg: tgRaw == null ? null : neg(tgRaw, tgNeg),
    ctg: ctgRaw == null ? null : neg(ctgRaw, tgNeg),
  }
}

export function quadrantName(deg: number) {
  const d = ((deg % 360) + 360) % 360
  if (d % 90 === 0) return 'pe axă'
  return ['cadranul I', 'cadranul II', 'cadranul III', 'cadranul IV'][Math.floor(d / 90)]
}

export const fmt = (v: number, digits = 4) => {
  if (!isFinite(v)) return '∄'
  const r = Number(v.toFixed(digits))
  return Object.is(r, -0) ? '0' : String(r)
}

// ---------- triangle solver ----------

export interface Triangle {
  a: number; b: number; c: number
  A: number; B: number; C: number // degrees
}

export interface TriangleInput {
  a?: number; b?: number; c?: number
  A?: number; B?: number; C?: number
}

const ok = (v: number | undefined): v is number => v != null && isFinite(v) && v > 0

function lawOfCosSide(b: number, c: number, Adeg: number) {
  return Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(toRad(Adeg)))
}
function lawOfCosAngle(a: number, b: number, c: number) {
  return toDeg(Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)))))
}

/** Solve a triangle from any three elements (at least one side). Returns 0, 1 or 2 solutions (SSA ambiguity). */
export function solveTriangle(inp: TriangleInput): { solutions: Triangle[]; method: string; error?: string } {
  const sides = (['a', 'b', 'c'] as const).filter((k) => ok(inp[k]))
  const angles = (['A', 'B', 'C'] as const).filter((k) => ok(inp[k]))
  if (sides.length + angles.length !== 3) return { solutions: [], method: '', error: 'Introdu exact 3 elemente (cel puțin o latură).' }
  if (!sides.length) return { solutions: [], method: '', error: 'Cu trei unghiuri triunghiul nu e determinat (doar forma). Adaugă o latură.' }

  const opp = { a: 'A', b: 'B', c: 'C' } as const
  const finish = (t: Triangle): Triangle | null => {
    const vals = [t.a, t.b, t.c, t.A, t.B, t.C]
    if (vals.some((v) => !isFinite(v) || v <= 1e-9)) return null
    if (Math.abs(t.A + t.B + t.C - 180) > 1e-6) return null
    return t
  }

  // SSS
  if (sides.length === 3) {
    const { a, b, c } = inp as Required<TriangleInput>
    if (a + b <= c || a + c <= b || b + c <= a)
      return { solutions: [], method: 'LLL', error: 'Laturile nu respectă inegalitatea triunghiului.' }
    const A = lawOfCosAngle(a, b, c)
    const B = lawOfCosAngle(b, a, c)
    return { solutions: [{ a, b, c, A, B, C: 180 - A - B }], method: 'LLL — teorema cosinusului' }
  }

  // two angles + one side (ASA / AAS)
  if (angles.length === 2) {
    const all = { ...inp } as Record<string, number>
    const missing = (['A', 'B', 'C'] as const).find((k) => !ok(inp[k]))!
    all[missing] = 180 - angles.reduce((s, k) => s + inp[k]!, 0)
    if (all[missing] <= 0) return { solutions: [], method: 'ULU', error: 'Suma unghiurilor depășește 180°.' }
    const s = sides[0]
    const k = all[s] / Math.sin(toRad(all[opp[s]])) // 2R
    const t: Triangle = {
      a: k * Math.sin(toRad(all.A)), b: k * Math.sin(toRad(all.B)), c: k * Math.sin(toRad(all.C)),
      A: all.A, B: all.B, C: all.C,
    }
    const f = finish(t)
    return { solutions: f ? [f] : [], method: 'ULU / LUU — teorema sinusurilor' }
  }

  // two sides + one angle
  const [s1, s2] = sides
  const ang = angles[0]
  const third = (['a', 'b', 'c'] as const).find((k) => !ok(inp[k]))!
  if (opp[third] === ang) {
    // SAS: angle between the two given sides
    const x = lawOfCosSide(inp[s1]!, inp[s2]!, inp[ang]!)
    const full = { ...inp, [third]: x } as Required<TriangleInput>
    const A = lawOfCosAngle(full.a, full.b, full.c)
    const B = lawOfCosAngle(full.b, full.a, full.c)
    const f = finish({ a: full.a, b: full.b, c: full.c, A, B, C: 180 - A - B })
    return { solutions: f ? [f] : [], method: 'LUL — teorema cosinusului' }
  }
  // SSA: the angle is opposite one of the known sides → 0, 1 or 2 solutions
  const known = (opp[s1] === ang ? s1 : s2) as 'a' | 'b' | 'c'
  const other = (known === s1 ? s2 : s1) as 'a' | 'b' | 'c'
  const sinOther = (inp[other]! * Math.sin(toRad(inp[ang]!))) / inp[known]!
  if (sinOther > 1 + 1e-12) return { solutions: [], method: 'LLU', error: 'Nu există triunghi cu aceste date (sin > 1).' }
  const base = toDeg(Math.asin(Math.min(1, sinOther)))
  const candidates = Math.abs(base - 90) < 1e-9 ? [base] : [base, 180 - base]
  const solutions: Triangle[] = []
  for (const angOther of candidates) {
    const all: Record<string, number> = { ...(inp as Record<string, number>) }
    all[opp[other]] = angOther
    all[opp[third]] = 180 - inp[ang]! - angOther
    if (all[opp[third]] <= 1e-9) continue
    const k = inp[known]! / Math.sin(toRad(inp[ang]!))
    all[third] = k * Math.sin(toRad(all[opp[third]]))
    const f = finish({ a: all.a, b: all.b, c: all.c, A: all.A, B: all.B, C: all.C })
    if (f) solutions.push(f)
  }
  return {
    solutions,
    method: solutions.length === 2 ? 'LLU — caz ambiguu, două triunghiuri posibile' : 'LLU — teorema sinusurilor',
    error: solutions.length ? undefined : 'Nu există triunghi cu aceste date.',
  }
}

export function triangleExtras(t: Triangle) {
  const p = (t.a + t.b + t.c) / 2
  const area = Math.sqrt(Math.max(0, p * (p - t.a) * (p - t.b) * (p - t.c)))
  return {
    perimeter: 2 * p,
    area,
    R: t.a / (2 * Math.sin(toRad(t.A))),
    r: area / p,
    ha: (2 * area) / t.a,
    hb: (2 * area) / t.b,
    hc: (2 * area) / t.c,
    type:
      Math.abs(Math.max(t.A, t.B, t.C) - 90) < 1e-6 ? 'dreptunghic' : Math.max(t.A, t.B, t.C) > 90 ? 'obtuzunghic' : 'ascuțitunghic',
    sidesType:
      Math.abs(t.a - t.b) < 1e-9 && Math.abs(t.b - t.c) < 1e-9
        ? 'echilateral'
        : Math.abs(t.a - t.b) < 1e-9 || Math.abs(t.b - t.c) < 1e-9 || Math.abs(t.a - t.c) < 1e-9
          ? 'isoscel'
          : 'oarecare',
  }
}

/** Vertex coordinates with A at the origin and AB on the x-axis (c = AB). */
export function triangleVertices(t: Triangle) {
  return {
    A: { x: 0, y: 0 },
    B: { x: t.c, y: 0 },
    C: { x: t.b * Math.cos(toRad(t.A)), y: t.b * Math.sin(toRad(t.A)) },
  }
}
