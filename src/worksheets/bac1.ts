// Baccalaureate, profile M1 (mate-info), subject I: the six short exercises, from the syllabus of grades IX and X
// (12 November 2026). Each kind has two or three forms at each level; the solutions are written as on the exam's
// marking scheme, in Romanian, with the school's notation (\operatorname{tg}, C_n^k, A_n^k, P_n).
import type { Made } from './generators'
import {
  addExact, exact, exactTex, exactValue, frac, gcd, int, nonZero, paren, pick, poly, reduce, rightTriangle, root, rootParts, surd,
  type Exact, type Rng,
} from './tex'

type Form = (rng: Rng) => Made
const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const R = '\\mathbb{R}'
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))

/** A number written after a sign: "+ 3", "- 3". */
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`)
/** A power of a base, or its reciprocal for a negative exponent: 8, \frac{1}{9}. */
const powerTex = (b: number, e: number) => (e >= 0 ? String(b ** e) : `\\frac{1}{${b ** -e}}`)
/** A line ax + by + c = 0 with whole coefficients, reduced and with the first nonzero one positive. */
function lineTex(a: number, b: number, c: number): string {
  const g = gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) || 1
  let [p, q, r] = [a / g, b / g, c / g]
  if (p < 0 || (p === 0 && q < 0)) [p, q, r] = [-p, -q, -r]
  return `${poly([[p, 'x'], [q, 'y'], [r, '']])} = 0`
}
/** A complex number a + bi, as written in a textbook: 3 - 2i, i, -i, 5, 0. */
function cx(re: number, im: number): string {
  if (im === 0) return String(re)
  const imPart = Math.abs(im) === 1 ? 'i' : `${Math.abs(im)}i`
  if (re === 0) return (im < 0 ? '-' : '') + imPart
  return `${re} ${im < 0 ? '-' : '+'} ${imPart}`
}
const point = (name: string, x: number, y: number) => `${name}(${x}, ${y})`

// ============================== progressions (grade IX) ==============================

const apTerm: Form = (rng) => {
  const a1 = int(rng, -10, 20)
  const r = nonZero(rng, -6, 9)
  const k = int(rng, 5, 12)
  const ak = a1 + (k - 1) * r
  return {
    text: `Determinați termenul $a_{${k}}$ al progresiei aritmetice $(a_n)_{n \\ge 1}$, știind că $a_1 = ${a1}$ și $a_2 = ${a1 + r}$.`,
    solution: lines(
      `Rația este $r = a_2 - a_1 = ${a1 + r} - ${paren(a1)} = ${r}$.`,
      show(`a_{${k}} = a_1 + ${k - 1}r = ${a1} + ${k - 1} \\cdot ${paren(r)} = ${ak}`),
    ),
    verify: () => a1 + r - a1 === r && ak === a1 + (k - 1) * r,
  }
}

const gpTerm: Form = (rng) => {
  const b1 = nonZero(rng, -5, 5)
  const q = pick(rng, [-3, -2, 2, 3])
  const k = int(rng, 3, 6)
  const bk = b1 * q ** (k - 1)
  return {
    text: `Determinați termenul $b_{${k}}$ al progresiei geometrice $(b_n)_{n \\ge 1}$, știind că $b_1 = ${b1}$ și $b_2 = ${b1 * q}$.`,
    solution: lines(
      `Rația este $q = \\frac{b_2}{b_1} = \\frac{${b1 * q}}{${b1}} = ${q}$.`,
      show(`b_{${k}} = b_1 \\cdot q^{${k - 1}} = ${paren(b1)} \\cdot ${paren(q)}^{${k - 1}} = ${bk}`),
    ),
    verify: () => (b1 * q) / b1 === q && bk === b1 * q ** (k - 1),
  }
}

const apSum: Form = (rng) => {
  const a = int(rng, 1, 9)
  const r = int(rng, 2, 7)
  const n = int(rng, 8, 30)
  const last = a + (n - 1) * r
  const S = (n * (a + last)) / 2
  return {
    text: `Calculați suma $${a} + ${a + r} + ${a + 2 * r} + \\ldots + ${last}$.`,
    solution: lines(
      `Termenii sunt în progresie aritmetică, cu $a_1 = ${a}$ și rația $r = ${r}$. Din $a_n = ${a} + (n - 1) \\cdot ${r} = ${last}$ obținem $n = ${n}$.`,
      show(`S_{${n}} = \\frac{(a_1 + a_{${n}}) \\cdot ${n}}{2} = \\frac{(${a} + ${last}) \\cdot ${n}}{2} = ${S}`),
    ),
    verify: () => Array.from({ length: n }, (_, i) => a + i * r).reduce((s, x) => s + x, 0) === S,
  }
}

const apFromTwo: Form = (rng) => {
  const a1 = int(rng, -8, 12)
  const r = nonZero(rng, -5, 6)
  const p = int(rng, 2, 5)
  const q = p + int(rng, 2, 5)
  const n = int(rng, 8, 20)
  const ap = a1 + (p - 1) * r
  const aq = a1 + (q - 1) * r
  const S = (n * (2 * a1 + (n - 1) * r)) / 2
  return {
    text: `Se consideră progresia aritmetică $(a_n)_{n \\ge 1}$ în care $a_{${p}} = ${ap}$ și $a_{${q}} = ${aq}$. Calculați suma primilor ${n} termeni ai progresiei.`,
    solution: lines(
      `Din $a_{${q}} - a_{${p}} = ${q - p}r$ obținem $${q - p}r = ${aq - ap}$, deci $r = ${r}$, iar $a_1 = a_{${p}} - ${p - 1}r = ${a1}$.`,
      show(`S_{${n}} = \\frac{(2a_1 + ${n - 1}r) \\cdot ${n}}{2} = \\frac{(${2 * a1} ${signed((n - 1) * r)}) \\cdot ${n}}{2} = ${S}`),
    ),
    verify: () => (aq - ap) / (q - p) === r && ap - (p - 1) * r === a1 && Array.from({ length: n }, (_, i) => a1 + i * r).reduce((s, x) => s + x, 0) === S,
  }
}

const apMiddle: Form = (rng) => {
  for (;;) {
    const x = int(rng, -5, 8)
    const m = int(rng, 2, 4)
    const n = int(rng, 1, 6)
    const k = 2 * m - 1 - n
    if (k === 0) continue
    const p = nonZero(rng, -6, 6)
    const q = nonZero(rng, -6, 6)
    const s = x * k + 2 * q - p
    if (s === 0) continue
    const e1 = poly([[1, 'x'], [p, '']])
    const e2 = poly([[m, 'x'], [q, '']])
    const e3 = poly([[n, 'x'], [s, '']])
    return {
      text: `Determinați numărul real $x$ pentru care numerele $${e1}$, $${e2}$ și $${e3}$ sunt termeni consecutivi ai unei progresii aritmetice.`,
      solution: lines(
        'Trei numere sunt termeni consecutivi ai unei progresii aritmetice dacă termenul din mijloc este media aritmetică a celorlalți doi:',
        show(`2(${e2}) = ${e1} + ${e3} \\Rightarrow ${poly([[2 * m, 'x'], [2 * q, '']])} = ${poly([[1 + n, 'x'], [p + s, '']])}`),
        `de unde ${k === 1 ? '' : `$${poly([[k, 'x']])} = ${p + s - 2 * q}$, deci `}$x = ${x}$.`,
      ),
      verify: () => 2 * (m * x + q) === x + p + n * x + s,
    }
  }
}

const gpMiddle: Form = (rng) => {
  for (;;) {
    const [a, b, c] = [int(rng, -6, 9), int(rng, -6, 9), int(rng, -6, 9)]
    if (a === b || b === c || a === c) continue
    const k = 2 * b - a - c
    if (k === 0 || (a * c - b * b) % k !== 0) continue
    const x = (a * c - b * b) / k
    if (x + a === 0 || x + b === 0 || x + c === 0 || Math.abs(x) > 15) continue
    const e = (t: number) => poly([[1, 'x'], [t, '']])
    return {
      text: `Determinați numărul real $x$ pentru care numerele $${e(a)}$, $${e(b)}$ și $${e(c)}$ sunt termeni consecutivi ai unei progresii geometrice.`,
      solution: lines(
        'Trei numere nenule sunt termeni consecutivi ai unei progresii geometrice dacă pătratul termenului din mijloc este produsul celorlalți doi:',
        show(`(${e(b)})^2 = (${e(a)})(${e(c)})`),
        show(`${poly([[1, 'x^2'], [2 * b, 'x'], [b * b, '']])} = ${poly([[1, 'x^2'], [a + c, 'x'], [a * c, '']])}`),
        `de unde ${k === 1 ? '' : `$${poly([[k, 'x']])} = ${a * c - b * b}$, deci `}$x = ${x}$. Pentru această valoare numerele sunt $${x + a}$, $${x + b}$, $${x + c}$, toate nenule.`,
      ),
      verify: () => (x + b) ** 2 === (x + a) * (x + c) && x + a !== 0,
    }
  }
}

const apFromSum: Form = (rng) => {
  const p = int(rng, 1, 5)
  const q = int(rng, -5, 9)
  const m = int(rng, 5, 20)
  const am = p * (2 * m - 1) + q
  const Sn = poly([[p, 'n^2'], [q, 'n']])
  return {
    text: `Suma primilor $n$ termeni ai șirului $(a_n)_{n \\ge 1}$ este $S_n = ${Sn}$, pentru orice $n \\ge 1$. Arătați că șirul este progresie aritmetică și determinați $a_{${m}}$.`,
    solution: lines(
      `Pentru $n \\ge 2$: $a_n = S_n - S_{n-1} = ${Sn} - ${p === 1 ? '' : p}(n - 1)^2 ${q === 0 ? '' : (q < 0 ? '+ ' : '- ') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + '(n - 1)'} = ${poly([[2 * p, 'n'], [q - p, '']])}$, iar $a_1 = S_1 = ${p + q}$ verifică aceeași formulă.`,
      `Atunci $a_{n+1} - a_n = ${2 * p}$ pentru orice $n$, deci șirul este progresie aritmetică, cu rația $${2 * p}$.`,
      show(`a_{${m}} = ${2 * p} \\cdot ${m} ${signed(q - p)} = ${am}`),
    ),
    verify: () => p * m * m + q * m - (p * (m - 1) ** 2 + q * (m - 1)) === am && p + q === 2 * p + q - p,
  }
}

const gpFindN: Form = (rng) => {
  const q = int(rng, 2, 5)
  const n = int(rng, 3, q === 2 ? 11 : q === 3 ? 8 : 7)
  const S = (q ** (n + 1) - 1) / (q - 1)
  return {
    text: `Determinați numărul natural $n$ pentru care $1 + ${q} + ${q}^2 + \\ldots + ${q}^n = ${S}$.`,
    solution: lines(
      `Termenii formează o progresie geometrică cu $b_1 = 1$ și rația $${q}$, cu $n + 1$ termeni:`,
      show(`1 + ${q} + \\ldots + ${q}^n = \\frac{${q}^{n+1} - 1}{${q} - 1} = ${S} \\Rightarrow ${q}^{n+1} = ${S * (q - 1) + 1} = ${q}^{${n + 1}}`),
      `deci $n + 1 = ${n + 1}$, adică $n = ${n}$.`,
    ),
    verify: () => Array.from({ length: n + 1 }, (_, i) => q ** i).reduce((s, x) => s + x, 0) === S,
  }
}

const apThenGp: Form = (rng) => {
  for (;;) {
    const b = int(rng, 3, 10)
    const r = int(rng, 1, 6)
    const [a, c] = [b - r, b + r]
    const g1 = int(rng, 1, 6)
    const qq = pick(rng, [2, 3])
    const [G1, G2, G3] = [g1, g1 * qq, g1 * qq * qq]
    const [al, be, ga] = [G1 - a, G2 - b, G3 - c]
    if (al === 0 || be === 0 || ga === 0 || Math.abs(al) > 30 || Math.abs(ga) > 40) continue
    const U = b + al
    const V = b + ga
    const B = b + be
    // r² + (V − U)r + B² − UV = 0, with the roots r and r2
    const r2 = U - V - r
    if (r2 > 0 && r2 !== r) continue
    const eq = poly([[1, 'r^2'], [V - U, 'r'], [B * B - U * V, '']])
    return {
      text: `Determinați numerele reale $a$, $b$ și $c$, știind că sunt termeni consecutivi ai unei progresii aritmetice crescătoare, că $a + b + c = ${3 * b}$ și că numerele $${poly([[1, 'a'], [al, '']])}$, $${poly([[1, 'b'], [be, '']])}$ și $${poly([[1, 'c'], [ga, '']])}$ sunt termeni consecutivi ai unei progresii geometrice.`,
      solution: lines(
        `Cum $a + c = 2b$, obținem $3b = ${3 * b}$, deci $b = ${b}$. Notăm $a = ${b} - r$ și $c = ${b} + r$, cu $r > 0$.`,
        `Condiția de progresie geometrică: $${B}^2 = (${U} - r)(${V} + r)$, adică $${eq} = 0$.`,
        r2 === r
          ? `Ecuația are soluția dublă $r = ${r}$.`
          : `Soluțiile sunt $r = ${r}$ și $r = ${r2}$; cum progresia este crescătoare, $r = ${r}$.`,
        `Așadar $a = ${a}$, $b = ${b}$, $c = ${c}$ (iar numerele ${G1}, ${G2}, ${G3} sunt în progresie geometrică, cu rația ${qq}).`,
      ),
      verify: () => a + b + c === 3 * b && (b + be) ** 2 === (a + al) * (c + ga) && r > 0 && r * r + (V - U) * r + B * B - U * V === 0,
    }
  }
}

export const progressions: Record<1 | 2 | 3, Form[]> = {
  1: [apTerm, gpTerm, apSum],
  2: [apFromTwo, apMiddle, gpMiddle],
  3: [apFromSum, gpFindN, apThenGp],
}

// ============================== quadratic function (grade IX) ==============================

const fx = (a: number, b: number, c: number) => poly([[a, 'x^2'], [b, 'x'], [c, '']])
const fDef = (body: string, name = 'f') => `$${name}: ${R} \\to ${R}$, $${name}(x) = ${body}$`

const vertex: Form = (rng) => {
  const a = pick(rng, [-2, -1, 1, 2])
  const h = int(rng, -5, 5)
  const k = int(rng, -7, 7)
  const b = -2 * a * h
  const c = a * h * h + k
  return {
    text: `Se consideră funcția ${fDef(fx(a, b, c))}. Determinați coordonatele vârfului parabolei asociate funcției $f$.`,
    solution: lines(
      show(`x_V = -\\frac{b}{2a} = -\\frac{${b}}{${2 * a}} = ${h}, \\qquad y_V = f(${h}) = ${k}`),
      `Vârful parabolei este $V(${h}, ${k})$.`,
    ),
    verify: () => a * h * h + b * h + c === k && -b / (2 * a) === h,
  }
}

const axisPoints: Form = (rng) => {
  for (;;) {
    const r1 = int(rng, -7, 7)
    const r2 = int(rng, -7, 7)
    if (r1 >= r2) continue
    const b = -(r1 + r2)
    const c = r1 * r2
    const D = b * b - 4 * c
    return {
      text: `Determinați coordonatele punctelor de intersecție a graficului funcției ${fDef(fx(1, b, c))} cu axa $Ox$.`,
      solution: lines(
        `Punctele de pe axa $Ox$ au $y = 0$, deci rezolvăm ecuația $${fx(1, b, c)} = 0$.`,
        show(`\\Delta = ${paren(b)}^2 - 4 \\cdot ${paren(c)} = ${D}, \\qquad x_{1,2} = \\frac{${-b} \\pm ${Math.sqrt(D)}}{2}`),
        `deci $x_1 = ${r1}$, $x_2 = ${r2}$, iar punctele sunt $A(${r1}, 0)$ și $B(${r2}, 0)$.`,
      ),
      verify: () => r1 * r1 + b * r1 + c === 0 && r2 * r2 + b * r2 + c === 0 && Math.sqrt(D) === r2 - r1,
    }
  }
}

const pointOnParabola: Form = (rng) => {
  const m = nonZero(rng, -8, 8)
  const p = nonZero(rng, -4, 4)
  const c = int(rng, -9, 9)
  const q = p * p + m * p + c
  return {
    text: `Se consideră funcția ${fDef(poly([[1, 'x^2'], [1, 'mx'], [c, '']]))}, unde $m$ este număr real. Determinați numărul real $m$ pentru care punctul $A(${p}, ${q})$ aparține graficului funcției $f$.`,
    solution: lines(
      `$A \\in G_f \\Leftrightarrow f(${p}) = ${q}$, adică $${paren(p)}^2 ${p < 0 ? '-' : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}m${c === 0 ? '' : ' ' + signed(c)} = ${q}$.`,
      `Obținem $${poly([[p, 'm']])} = ${q - p * p - c}$, deci $m = ${m}$.`,
    ),
    verify: () => p * p + m * p + c === q,
  }
}

const vieteValue: Form = (rng) => {
  for (;;) {
    const s = nonZero(rng, -9, 9)
    const p = nonZero(rng, -12, 12)
    if (s * s - 4 * p < 0) continue
    const ask = int(rng, 0, 2)
    const value = ask === 0 ? s * s - 2 * p : ask === 1 ? frac(s, p) : String(s * p)
    const expr = ask === 0 ? 'x_1^2 + x_2^2' : ask === 1 ? '\\frac{1}{x_1} + \\frac{1}{x_2}' : 'x_1^2 x_2 + x_1 x_2^2'
    const how = ask === 0
      ? `x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2 = ${paren(s)}^2 - 2 \\cdot ${paren(p)} = ${value}`
      : ask === 1
        ? `\\frac{1}{x_1} + \\frac{1}{x_2} = \\frac{x_1 + x_2}{x_1 x_2} = \\frac{${s}}{${p}} = ${value}`
        : `x_1^2 x_2 + x_1 x_2^2 = x_1x_2(x_1 + x_2) = ${paren(p)} \\cdot ${paren(s)} = ${value}`
    return {
      text: `Se notează cu $x_1$ și $x_2$ soluțiile ecuației $${fx(1, -s, p)} = 0$. Calculați $${expr}$.`,
      solution: lines(`Din relațiile lui Viète: $x_1 + x_2 = ${s}$ și $x_1 x_2 = ${p}$.`, show(how)),
      verify: () => {
        const D = Math.sqrt(s * s - 4 * p)
        const [x1, x2] = [(s - D) / 2, (s + D) / 2]
        const v = ask === 0 ? x1 * x1 + x2 * x2 : ask === 1 ? 1 / x1 + 1 / x2 : x1 * x1 * x2 + x1 * x2 * x2
        const [n, d] = ask === 1 ? reduce(s, p) : [Number(value), 1]
        return close(v, n / d)
      },
    }
  }
}

const tangentToAxis: Form = (rng) => {
  const p = nonZero(rng, -6, 6)
  const t = int(rng, 1, 6)
  const [m1, m2] = [-p - 2 * t, -p + 2 * t]
  return {
    text: `Determinați numerele reale $m$ pentru care graficul funcției ${fDef(`x^2 + (m ${signed(p)})x + ${t * t}`)} intersectează axa $Ox$ într-un singur punct.`,
    solution: lines(
      'Graficul intersectează axa $Ox$ într-un singur punct dacă ecuația $f(x) = 0$ are două soluții egale, adică $\\Delta = 0$:',
      show(`\\Delta = (m ${signed(p)})^2 - ${4 * t * t} = 0 \\Rightarrow m ${signed(p)} = \\pm ${2 * t}`),
      `deci $m = ${m1}$ sau $m = ${m2}$.`,
    ),
    verify: () => (m1 + p) ** 2 === 4 * t * t && (m2 + p) ** 2 === 4 * t * t,
  }
}

const minValueParam: Form = (rng) => {
  const h = nonZero(rng, -6, 6)
  const k = int(rng, -9, 9)
  const m = k + h * h
  return {
    text: `Determinați numărul real $m$ pentru care valoarea minimă a funcției ${fDef(`x^2 ${h > 0 ? '- ' + 2 * h : '+ ' + -2 * h}x + m`)} este egală cu $${k}$.`,
    solution: lines(
      `Coeficientul lui $x^2$ este pozitiv, deci minimul se atinge în $x_V = -\\frac{b}{2a} = ${h}$.`,
      show(`f(${h}) = ${h * h} ${-2 * h * h < 0 ? '- ' + 2 * h * h : '+ ' + -2 * h * h} + m = m - ${h * h} = ${k}`),
      `deci $m = ${m}$.`,
    ),
    verify: () => h * h - 2 * h * h + m === k,
  }
}

const vieteParam: Form = (rng) => {
  for (;;) {
    const p = nonZero(rng, -4, 4)
    const k = int(rng, 1, 3)
    const m1 = int(rng, -6, 6)
    const m2 = 2 * k - 2 * p - m1
    if (m1 === m2) continue
    const q = int(rng, -6, 6)
    const N = p * p - 2 * q - m1 * m2
    const ok = [m1, m2].filter((m) => (m + p) ** 2 - 4 * (k * m + q) >= 0).sort((x, y) => x - y)
    if (!ok.length) continue
    const bad = [m1, m2].filter((m) => !ok.includes(m))
    const B = poly([[k, 'm'], [q, '']])
    const delta = (m: number) => (m + p) ** 2 - 4 * (k * m + q)
    return {
      text: `Se consideră ecuația $x^2 - (m ${signed(p)})x + ${B} = 0$, unde $m$ este număr real. Determinați numerele reale $m$ pentru care ecuația are soluțiile reale $x_1$ și $x_2$ care verifică relația $x_1^2 + x_2^2 = ${N}$.`,
      solution: lines(
        `Din relațiile lui Viète: $x_1 + x_2 = m ${signed(p)}$ și $x_1 x_2 = ${B}$, deci`,
        show(`x_1^2 + x_2^2 = (m ${signed(p)})^2 - 2(${B}) = ${poly([[1, 'm^2'], [2 * p - 2 * k, 'm'], [p * p - 2 * q, '']])}`),
        `Din $${poly([[1, 'm^2'], [2 * p - 2 * k, 'm'], [p * p - 2 * q, '']])} = ${N}$ obținem $${poly([[1, 'm^2'], [-(m1 + m2), 'm'], [m1 * m2, '']])} = 0$, cu soluțiile $m = ${Math.min(m1, m2)}$ și $m = ${Math.max(m1, m2)}$.`,
        `Soluțiile ecuației sunt reale dacă $\\Delta = (m ${signed(p)})^2 - 4(${B}) \\ge 0$. ${[m1, m2].sort((x, y) => x - y).map((m) => `Pentru $m = ${m}$, $\\Delta = ${delta(m)}$.`).join(' ')}`,
        bad.length ? `Convine doar $m = ${ok[0]}$.` : `Convin ambele valori: $m \\in \\{${ok.join(', ')}\\}$.`,
      ),
      verify: () => ok.every((m) => {
        const D = Math.sqrt(delta(m))
        const s = m + p
        const [x1, x2] = [(s - D) / 2, (s + D) / 2]
        return close(x1 * x1 + x2 * x2, N)
      }) && bad.every((m) => delta(m) < 0),
    }
  }
}

const integerSolutions: Form = (rng) => {
  for (;;) {
    const r1 = int(rng, -8, 5)
    const r2 = r1 + int(rng, 2, 9)
    const strict = rng() < 0.5
    const a = pick(rng, [1, 1, 2])
    const b = -a * (r1 + r2)
    const c = a * r1 * r2
    const count = strict ? r2 - r1 - 1 : r2 - r1 + 1
    const D = b * b - 4 * a * c
    return {
      text: `Determinați numărul de elemente ale mulțimii $A = \\{x \\in \\mathbb{Z} \\mid ${fx(a, b, c)} ${strict ? '<' : '\\le'} 0\\}$.`,
      solution: lines(
        `Ecuația $${fx(a, b, c)} = 0$ are $\\Delta = ${D}$ și soluțiile $x_1 = ${r1}$, $x_2 = ${r2}$. Coeficientul lui $x^2$ este pozitiv, deci expresia este ${strict ? 'negativă' : 'negativă sau nulă'} pentru $x \\in ${strict ? '(' : '['}${r1}, ${r2}${strict ? ')' : ']'}$.`,
        `Numerele întregi din acest interval sunt ${listed(strict ? r1 + 1 : r1, strict ? r2 - 1 : r2)}, deci $A$ are ${count} ${count === 1 ? 'element' : count >= 20 ? 'de elemente' : 'elemente'}.`,
      ),
      verify: () => {
        let n = 0
        for (let x = -50; x <= 50; x++) if (strict ? a * x * x + b * x + c < 0 : a * x * x + b * x + c <= 0) n++
        return n === count && Math.sqrt(D) === a * (r2 - r1)
      },
    }
  }
}

/** The whole numbers from lo to hi, all of them when few. */
const listed = (lo: number, hi: number) => (hi - lo < 6 ? Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).join(', ') : `${lo}, ${lo + 1}, …, ${hi}`)

const lineMeetsParabola: Form = (rng) => {
  for (;;) {
    const r1 = int(rng, -5, 5)
    const r2 = int(rng, -5, 5)
    if (r1 >= r2) continue
    const p = nonZero(rng, -4, 4)
    const q = int(rng, -6, 6)
    const b = p - (r1 + r2)
    const c = q + r1 * r2
    return {
      text: `Se consideră funcțiile ${fDef(fx(1, b, c))} și ${fDef(poly([[p, 'x'], [q, '']]), 'g')}. Determinați coordonatele punctelor de intersecție a graficelor celor două funcții.`,
      solution: lines(
        `Abscisele punctelor comune verifică $f(x) = g(x)$, adică $${fx(1, b, c)} = ${poly([[p, 'x'], [q, '']])}$, sau $${fx(1, -(r1 + r2), r1 * r2)} = 0$.`,
        `Soluțiile sunt $x_1 = ${r1}$ și $x_2 = ${r2}$, iar $g(${r1}) = ${p * r1 + q}$, $g(${r2}) = ${p * r2 + q}$.`,
        `Punctele de intersecție sunt $A(${r1}, ${p * r1 + q})$ și $B(${r2}, ${p * r2 + q})$.`,
      ),
      verify: () => [r1, r2].every((x) => x * x + b * x + c === p * x + q),
    }
  }
}

export const quadratic: Record<1 | 2 | 3, Form[]> = {
  1: [vertex, axisPoints, pointOnParabola],
  2: [vieteValue, tangentToAxis, minValueParam],
  3: [vieteParam, integerSolutions, lineMeetsParabola],
}

// ============================== trigonometry (grade IX) ==============================

const SIN: Record<number, Exact> = {
  0: exact(0, 1), 30: exact(1, 2), 45: exact(1, 2, 2), 60: exact(1, 2, 3), 90: exact(1, 1),
  120: exact(1, 2, 3), 135: exact(1, 2, 2), 150: exact(1, 2), 180: exact(0, 1),
}
const COS: Record<number, Exact> = {
  0: exact(1, 1), 30: exact(1, 2, 3), 45: exact(1, 2, 2), 60: exact(1, 2), 90: exact(0, 1),
  120: exact(-1, 2), 135: exact(-1, 2, 2), 150: exact(-1, 2, 3), 180: exact(-1, 1),
}
const TG: Record<number, Exact> = {
  0: exact(0, 1), 30: exact(1, 3, 3), 45: exact(1, 1), 60: exact(1, 1, 3),
  120: exact(-1, 1, 3), 135: exact(-1, 1), 150: exact(-1, 3, 3), 180: exact(0, 1),
}
const FN = { sin: SIN, cos: COS, tg: TG }
const fnTex = (f: keyof typeof FN) => (f === 'tg' ? '\\operatorname{tg}' : `\\${f}`)
const deg = (d: number) => `${d}^\\circ`

const specialValues: Form = (rng) => {
  const terms: { k: number; f: keyof typeof FN; d: number }[] = []
  while (terms.length < 3) {
    const f = pick(rng, ['sin', 'cos', 'tg'] as const)
    const d = pick(rng, Object.keys(FN[f]).map(Number).filter((x) => x !== 0))
    if (terms.some((t) => t.f === f && t.d === d)) continue
    terms.push({ k: (rng() < 0.3 ? -1 : 1) * int(rng, 1, 3), f, d })
  }
  let sum: Exact = new Map()
  for (const t of terms) sum = addExact(sum, FN[t.f][t.d], t.k)
  const term = (t: (typeof terms)[number], v?: string) => {
    const a = Math.abs(t.k)
    if (!v) return (a === 1 ? '' : `${a} `) + `${fnTex(t.f)} ${deg(t.d)}`
    const w = v.startsWith('-') ? `\\left(${v}\\right)` : v
    return a === 1 ? w : `${a} \\cdot ${w}`
  }
  const joined = (fmt: (t: (typeof terms)[number]) => string) =>
    terms.map((t, i) => (i === 0 ? (t.k < 0 ? '-' : '') : t.k < 0 ? ' - ' : ' + ') + fmt(t)).join('')
  return {
    text: `Calculați $${joined((t) => term(t))}$.`,
    solution: lines(
      `Folosim valorile: ${terms.map((t) => `$${fnTex(t.f)} ${deg(t.d)} = ${exactTex(FN[t.f][t.d])}$`).join(', ')}.`,
      show(`${joined((t) => term(t, exactTex(FN[t.f][t.d])))} = ${exactTex(sum)}`),
    ),
    verify: () => {
      const v = terms.reduce((s, t) => {
        const r = (t.d * Math.PI) / 180
        return s + t.k * (t.f === 'sin' ? Math.sin(r) : t.f === 'cos' ? Math.cos(r) : Math.tan(r))
      }, 0)
      return close(v, exactValue(sum))
    },
  }
}

const cosFromSin: Form = (rng) => {
  const [a, b, c] = rightTriangle(rng, 65)
  const second = rng() < 0.5
  const askTg = rng() < 0.4
  const cosv = second ? -b : b
  const interval = second ? '\\left(\\frac{\\pi}{2}, \\pi\\right)' : '\\left(0, \\frac{\\pi}{2}\\right)'
  return {
    text: `Știind că $x \\in ${interval}$ și $\\sin x = ${frac(a, c)}$, calculați $${askTg ? '\\operatorname{tg} x' : '\\cos x'}$.`,
    solution: lines(
      show(`\\cos^2 x = 1 - \\sin^2 x = 1 - ${frac(a * a, c * c)} = ${frac(b * b, c * c)}`),
      `Pentru $x \\in ${interval}$, $\\cos x ${second ? '<' : '>'} 0$, deci $\\cos x = ${frac(cosv, c)}$.`,
      askTg ? show(`\\operatorname{tg} x = \\frac{\\sin x}{\\cos x} = ${frac(a, cosv)}`) : '',
    ).trim(),
    verify: () => {
      const x = second ? Math.PI - Math.asin(a / c) : Math.asin(a / c)
      return close(Math.cos(x), cosv / c) && close(Math.tan(x), a / cosv)
    },
  }
}

const areaWithSine: Form = (rng) => {
  const b = int(rng, 2, 12)
  const c = int(rng, 2, 12)
  const A = pick(rng, [30, 45, 60, 120, 135, 150])
  const [p, q] = SIN[A].values().next().value as [number, number]
  const r = [...SIN[A].keys()][0]
  const area = surd(b * c * p, 2 * q, r)
  return {
    text: `Calculați aria triunghiului $ABC$, știind că $AB = ${c}$, $AC = ${b}$ și $m(\\sphericalangle A) = ${deg(A)}$.`,
    solution: show(`\\mathcal{A}_{ABC} = \\frac{AB \\cdot AC \\cdot \\sin A}{2} = \\frac{${c} \\cdot ${b} \\cdot ${exactTex(SIN[A])}}{2} = ${area}`),
    verify: () => close((b * c * Math.sin((A * Math.PI) / 180)) / 2, (b * c * p * Math.sqrt(r)) / (2 * q)),
  }
}

const lawOfCosines: Form = (rng) => {
  const b = int(rng, 2, 12)
  const c = int(rng, 2, 12)
  const A = pick(rng, [60, 120])
  const sq = b * b + c * c + (A === 60 ? -b * c : b * c)
  return {
    text: `În triunghiul $ABC$ se cunosc $AB = ${c}$, $AC = ${b}$ și $m(\\sphericalangle A) = ${deg(A)}$. Calculați lungimea laturii $BC$.`,
    solution: lines(
      'Din teorema cosinusului:',
      show(`BC^2 = AB^2 + AC^2 - 2 \\cdot AB \\cdot AC \\cdot \\cos A = ${c * c} + ${b * b} - 2 \\cdot ${c} \\cdot ${b} \\cdot \\left(${exactTex(COS[A])}\\right) = ${sq}`),
      `deci $BC = ${root(sq)}$.`,
    ),
    verify: () => close(b * b + c * c - 2 * b * c * Math.cos((A * Math.PI) / 180), sq),
  }
}

const circumradius: Form = (rng) => {
  const a = int(rng, 2, 30)
  const A = pick(rng, [30, 45, 60, 90, 120, 135, 150])
  // R = a / (2 sin A)
  const [[r, [p, q]]] = [...SIN[A]]
  // a / (2 · p√r / q) = a q / (2 p √r) = a q √r / (2 p r)
  const R2 = surd(a * q, 2 * p * r, r)
  return {
    text: `Calculați raza cercului circumscris triunghiului $ABC$, știind că $BC = ${a}$ și $m(\\sphericalangle A) = ${deg(A)}$.`,
    solution: lines(
      'Din teorema sinusurilor, $\\frac{BC}{\\sin A} = 2R$, deci',
      show(`R = \\frac{BC}{2 \\sin A} = \\frac{${a}}{2 \\cdot ${exactTex(SIN[A])}} = ${R2}`),
    ),
    verify: () => close(a / (2 * Math.sin((A * Math.PI) / 180)), (a * q * Math.sqrt(r)) / (2 * p * r)),
  }
}

const cosOfAngle: Form = (rng) => {
  for (;;) {
    const a = int(rng, 3, 15)
    const b = int(rng, 3, 15)
    const c = int(rng, 3, 15)
    if (a >= b + c || b >= a + c || c >= a + b) continue
    const num = b * b + c * c - a * a
    if (num === 0) continue
    const v = frac(num, 2 * b * c)
    return {
      text: `Triunghiul $ABC$ are $AB = ${c}$, $AC = ${b}$ și $BC = ${a}$. Calculați $\\cos A$ și precizați dacă unghiul $A$ este ascuțit sau obtuz.`,
      solution: lines(
        'Din teorema cosinusului:',
        show(`\\cos A = \\frac{AB^2 + AC^2 - BC^2}{2 \\cdot AB \\cdot AC} = \\frac{${c * c} + ${b * b} - ${a * a}}{2 \\cdot ${c} \\cdot ${b}} = ${v}`),
        num > 0 ? 'Cum $\\cos A > 0$, unghiul $A$ este ascuțit.' : 'Cum $\\cos A < 0$, unghiul $A$ este obtuz.',
      ),
      verify: () => {
        const [p, q] = reduce(num, 2 * b * c)
        return close(Math.cos(Math.acos(num / (2 * b * c))), p / q)
      },
    }
  }
}

const doubleAngle: Form = (rng) => {
  const [a, b, c] = rightTriangle(rng, 65)
  const ask = int(rng, 0, 3)
  // sin x = a/c, cos x = b/c, x acute
  const s = Math.asin(a / c)
  let expr = ''
  let value: Exact
  let how = ''
  if (ask === 0) {
    expr = '\\sin 2x'
    value = exact(2 * a * b, c * c)
    how = `\\sin 2x = 2 \\sin x \\cos x = 2 \\cdot ${frac(a, c)} \\cdot ${frac(b, c)} = ${exactTex(value)}`
  } else if (ask === 1) {
    expr = '\\cos 2x'
    value = exact(b * b - a * a, c * c)
    how = `\\cos 2x = \\cos^2 x - \\sin^2 x = ${frac(b * b, c * c)} - ${frac(a * a, c * c)} = ${exactTex(value)}`
  } else {
    const d = ask === 2 ? 60 : 30
    expr = `\\sin\\left(x + \\frac{\\pi}{${180 / d}}\\right)`
    value = addExact(new Map(), new Map([...COS[d]].map(([r, [p, q]]) => [r, reduce(p * a, q * c)] as [number, [number, number]])))
    value = addExact(value, new Map([...SIN[d]].map(([r, [p, q]]) => [r, reduce(p * b, q * c)] as [number, [number, number]])))
    how = `\\sin\\left(x + \\frac{\\pi}{${180 / d}}\\right) = \\sin x \\cos \\frac{\\pi}{${180 / d}} + \\cos x \\sin \\frac{\\pi}{${180 / d}} = ${frac(a, c)} \\cdot ${exactTex(COS[d])} + ${frac(b, c)} \\cdot ${exactTex(SIN[d])} = ${exactTex(value)}`
  }
  return {
    text: `Știind că $x \\in \\left(0, \\frac{\\pi}{2}\\right)$ și $\\sin x = ${frac(a, c)}$, calculați $${expr}$.`,
    solution: lines(
      `Cum $x \\in \\left(0, \\frac{\\pi}{2}\\right)$, $\\cos x > 0$, deci $\\cos x = \\sqrt{1 - \\sin^2 x} = ${frac(b, c)}$.`,
      show(how),
    ),
    verify: () => {
      const v = ask === 0 ? Math.sin(2 * s) : ask === 1 ? Math.cos(2 * s) : Math.sin(s + (ask === 2 ? Math.PI / 3 : Math.PI / 6))
      return close(v, exactValue(value)) && close(Math.cos(s), b / c)
    },
  }
}

const heron: Form = (rng) => {
  for (;;) {
    const a = int(rng, 3, 14)
    const b = int(rng, 3, 14)
    const c = int(rng, 3, 14)
    if (a >= b + c || b >= a + c || c >= a + b || (a === b && b === c)) continue
    const P = a + b + c
    // 16 S² = P (P − 2a)(P − 2b)(P − 2c)
    const K = P * (P - 2 * a) * (P - 2 * b) * (P - 2 * c)
    const [k, m] = rootParts(K)
    const S = surd(k, 4, m)
    const askR = rng() < 0.5
    const r = surd(k, 2 * P, m)
    const p2 = frac(P, 2)
    return {
      text: `Triunghiul $ABC$ are laturile $AB = ${c}$, $BC = ${a}$ și $AC = ${b}$. Calculați aria triunghiului${askR ? ' și raza cercului înscris în triunghi' : ''}.`,
      solution: lines(
        `Semiperimetrul este $p = ${p2}$. Din formula lui Heron:`,
        show(`\\mathcal{A} = \\sqrt{p(p - a)(p - b)(p - c)} = \\sqrt{${p2} \\cdot ${frac(P - 2 * a, 2)} \\cdot ${frac(P - 2 * b, 2)} \\cdot ${frac(P - 2 * c, 2)}} = ${S}`),
        askR ? show(`r = \\frac{\\mathcal{A}}{p} = ${r}`) : '',
      ).trim(),
      verify: () => {
        const p = P / 2
        const A = Math.sqrt(p * (p - a) * (p - b) * (p - c))
        return close(A, (k * Math.sqrt(m)) / 4) && close(A / p, (k * Math.sqrt(m)) / (2 * P))
      },
    }
  }
}

const sumOfSquares: Form = (rng) => {
  const a = int(rng, 1, 40)
  const f = pick(rng, ['sin', 'cos'] as const)
  const n = 91 - 2 * a
  const value = frac(n, 2)
  return {
    text: `Calculați $\\${f}^2 ${deg(a)} + \\${f}^2 ${deg(a + 1)} + \\ldots + \\${f}^2 ${deg(90 - a)}$.`,
    solution: lines(
      `Suma are ${n} termeni. Cum $\\${f === 'sin' ? 'sin' : 'cos'}(90^\\circ - x) = \\${f === 'sin' ? 'cos' : 'sin'} x$, termenii egal depărtați de capete dau $\\${f}^2 x + \\${f}^2 (90^\\circ - x) = \\sin^2 x + \\cos^2 x = 1$.`,
      `Se formează ${(n - 1) / 2} perechi, iar termenul din mijloc este $\\${f}^2 45^\\circ = \\frac{1}{2}$. Suma este $${(n - 1) / 2} + \\frac{1}{2} = ${value}$.`,
    ),
    verify: () => {
      let s = 0
      for (let d = a; d <= 90 - a; d++) s += (f === 'sin' ? Math.sin : Math.cos)((d * Math.PI) / 180) ** 2
      return close(s, n / 2)
    },
  }
}

export const trig: Record<1 | 2 | 3, Form[]> = {
  1: [specialValues, cosFromSin, areaWithSine],
  2: [lawOfCosines, circumradius, cosOfAngle],
  3: [doubleAngle, heron, sumOfSquares],
}

// ============================== numbers: powers, logarithms, complex numbers (grade X) ==============================

const logTerms: Form = (rng) => {
  const B = pick(rng, [2, 3, 5])
  const u = pick(rng, [2, 3, 5, 6, 7, 10, 11].filter((x) => x % B !== 0))
  const e1 = int(rng, 1, B === 5 ? 2 : 3)
  const e2 = int(rng, 1, B === 5 ? 2 : 4)
  const third = rng() < 0.5
  const value = e1 + (third ? e2 : 0)
  return {
    text: `Calculați $\\log_${B} ${u * B ** e1} - \\log_${B} ${u}${third ? ` + \\log_${B} ${B ** e2}` : ''}$.`,
    solution: show(`\\log_${B} ${u * B ** e1} - \\log_${B} ${u}${third ? ` + \\log_${B} ${B ** e2}` : ''} = \\log_${B} \\frac{${u * B ** e1}}{${u}}${third ? ` + ${e2}` : ''} = \\log_${B} ${B ** e1}${third ? ` + ${e2}` : ''} = ${value}`),
    verify: () => close(Math.log(u * B ** e1) / Math.log(B) - Math.log(u) / Math.log(B) + (third ? Math.log(B ** e2) / Math.log(B) : 0), value),
  }
}

const complexOps: Form = (rng) => {
  const [a, b, c, d] = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
  const ask = int(rng, 0, 2)
  let expr: string
  let re: number
  let im: number
  let how: string
  if (ask === 0) {
    expr = 'z_1 \\cdot z_2'
    re = a * c - b * d
    im = a * d + b * c
    how = `z_1 z_2 = (${cx(a, b)})(${cx(c, d)}) = ${a * c} ${signed(a * d)}i ${signed(b * c)}i ${signed(b * d)}i^2 = ${cx(re, im)}`
  } else if (ask === 1) {
    expr = 'z_1 + \\overline{z_2}'
    re = a + c
    im = b - d
    how = `\\overline{z_2} = ${cx(c, -d)}, \\qquad z_1 + \\overline{z_2} = ${cx(re, im)}`
  } else {
    expr = 'z_1^2'
    re = a * a - b * b
    im = 2 * a * b
    how = `z_1^2 = ${paren(a)}^2 + 2 \\cdot ${paren(a)} \\cdot ${paren(b)}i + ${paren(b)}^2 i^2 = ${cx(re, im)}`
  }
  return {
    text: `Se consideră numerele complexe $z_1 = ${cx(a, b)}$ și $z_2 = ${cx(c, d)}$. Calculați $${expr}$.`,
    solution: lines('Folosim $i^2 = -1$.', show(how)),
    verify: () => (ask === 0 ? re === a * c - b * d && im === a * d + b * c : ask === 1 ? re === a + c && im === b - d : re === a * a - b * b && im === 2 * a * b),
  }
}

const powersAndRoots: Form = (rng) => {
  const a = int(rng, 2, 5) * (rng() < 0.5 ? -1 : 1)
  const c = int(rng, 2, 4)
  const p = int(rng, 1, 2)
  const d = int(rng, 2, 9)
  const k = int(rng, 1, 3)
  const value = a + c ** p - k * d
  return {
    text: `Calculați $\\sqrt[3]{${a ** 3}} + ${c ** 3}^{\\frac{${p}}{3}} - ${k === 1 ? '' : k}\\sqrt{${d * d}}$.`,
    solution: show(`\\sqrt[3]{${a ** 3}} + ${c ** 3}^{\\frac{${p}}{3}} - ${k === 1 ? '' : k}\\sqrt{${d * d}} = ${a} + ${p === 1 ? c : `${c}^{${p}}`} - ${k === 1 ? '' : k + ' \\cdot '}${d} = ${a} + ${c ** p} - ${k * d} = ${value}`),
    verify: () => close(Math.cbrt(a ** 3) + (c ** 3) ** (p / 3) - k * Math.sqrt(d * d), value),
  }
}

const complexModulus: Form = (rng) => {
  const [a, b, c, d] = [nonZero(rng, -7, 7), nonZero(rng, -7, 7), nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
  const N = a * a + b * b
  const D = c * c + d * d
  const [k, m] = rootParts(N * D)
  const v = surd(k, D, m)
  return {
    text: `Calculați modulul numărului complex $z = \\frac{${cx(a, b)}}{${cx(c, d)}}$.`,
    solution: lines(
      'Modulul câtului este câtul modulelor:',
      show(`|z| = \\frac{|${cx(a, b)}|}{|${cx(c, d)}|} = \\frac{\\sqrt{${a * a} + ${b * b}}}{\\sqrt{${c * c} + ${d * d}}} = \\frac{\\sqrt{${N}}}{\\sqrt{${D}}} = ${v}`),
    ),
    verify: () => close(Math.sqrt(N) / Math.sqrt(D), (k * Math.sqrt(m)) / D),
  }
}

const complexLinear: Form = (rng) => {
  for (;;) {
    const [a1, b1, a2, b2] = [nonZero(rng, -4, 4), nonZero(rng, -4, 4), nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
    const det = a1 * b2 - a2 * b1
    if (det === 0) continue
    const x = nonZero(rng, -6, 6)
    const y = nonZero(rng, -6, 6)
    const re = a1 * x + a2 * y
    const im = b1 * x + b2 * y
    return {
      text: `Determinați numerele reale $x$ și $y$ pentru care $x(${cx(a1, b1)}) + y(${cx(a2, b2)}) = ${cx(re, im)}$.`,
      solution: lines(
        `Grupăm partea reală și partea imaginară: $(${poly([[a1, 'x'], [a2, 'y']])}) + (${poly([[b1, 'x'], [b2, 'y']])})i = ${cx(re, im)}$.`,
        `Două numere complexe sunt egale dacă au părțile reale egale și părțile imaginare egale:`,
        show(`\\begin{cases} ${poly([[a1, 'x'], [a2, 'y']])} = ${re} \\\\ ${poly([[b1, 'x'], [b2, 'y']])} = ${im} \\end{cases}`),
        `de unde $x = ${x}$ și $y = ${y}$.`,
      ),
      verify: () => a1 * x + a2 * y === re && b1 * x + b2 * y === im && det !== 0,
    }
  }
}

const logChain: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3, 5])
    const e = int(rng, 2, B === 2 ? 6 : 3)
    const mids = [int(rng, 3, 13), int(rng, 3, 13)].slice(0, int(rng, 1, 2))
    const chain = [B, ...mids, B ** e]
    if (new Set(chain).size !== chain.length) continue
    const factors = chain.slice(0, -1).map((b, i) => `\\log_{${b}} ${chain[i + 1]}`)
    return {
      text: `Calculați $${factors.join(' \\cdot ')}$.`,
      solution: lines(
        'Folosim $\\log_a b \\cdot \\log_b c = \\log_a c$ (formula de schimbare a bazei):',
        show(`${factors.join(' \\cdot ')} = \\log_{${B}} ${B ** e} = ${e}`),
      ),
      verify: () => close(chain.slice(0, -1).reduce((s, b, i) => s * (Math.log(chain[i + 1]) / Math.log(b)), 1), e),
    }
  }
}

const powersOfI: Form = (rng) => {
  if (rng() < 0.5) {
    const n = 2 * int(rng, 2, 20)
    const minus = rng() < 0.5
    const h = n / 2
    // (1 ± i)² = ±2i
    const unit = minus ? -1 : 1
    const ip = [[1, 0], [0, 1], [-1, 0], [0, -1]][h % 4]
    const sign = unit ** h
    const re = sign * 2 ** h * ip[0]
    const im = sign * 2 ** h * ip[1]
    return {
      text: `Calculați $(1 ${minus ? '-' : '+'} i)^{${n}}$.`,
      solution: lines(
        `$(1 ${minus ? '-' : '+'} i)^2 = 1 ${minus ? '-' : '+'} 2i + i^2 = ${minus ? '-' : ''}2i$, deci`,
        show(`(1 ${minus ? '-' : '+'} i)^{${n}} = (${minus ? '-' : ''}2i)^{${h}} = ${minus && h % 2 ? '-' : ''}2^{${h}} \\cdot i^{${h}} = ${cx(re, im)}`),
        `pentru că $i^{${h}} = ${cx(ip[0], ip[1])}$ (${h} dă restul ${h % 4} la împărțirea cu 4).`,
      ),
      verify: () => {
        let [x, y] = [1, 0]
        for (let k = 0; k < n; k++) [x, y] = [x - unit * y, y + unit * x]
        return x === re && y === im
      },
    }
  }
  const n = int(rng, 10, 2030)
  // i + i² + … + iⁿ: every four consecutive powers add up to 0
  const rest = n % 4
  const parts = [[0, 1], [-1, 0], [0, -1]].slice(0, rest)
  const re = parts.reduce((s, p) => s + p[0], 0)
  const im = parts.reduce((s, p) => s + p[1], 0)
  return {
    text: `Calculați $i + i^2 + i^3 + \\ldots + i^{${n}}$.`,
    solution: lines(
      'Patru puteri consecutive ale lui $i$ au suma $i^k(1 + i + i^2 + i^3) = i^k(1 + i - 1 - i) = 0$.',
      `Cum $${n} = 4 \\cdot ${Math.floor(n / 4)} + ${rest}$, ${rest === 0 ? 'toți termenii se grupează câte patru, iar suma este $0$.' : `rămân ultimii ${rest} termeni, care au aceeași sumă ca ${['', '$i$', '$i + i^2$', '$i + i^2 + i^3$'][rest]}: suma este $${cx(re, im)}$.`}`,
    ),
    verify: () => {
      let [x, y, sx, sy] = [1, 0, 0, 0]
      for (let k = 1; k <= n; k++) {
        ;[x, y] = [-y, x]
        sx += x
        sy += y
      }
      return sx === re && sy === im
    },
  }
}

const conjugateEquation: Form = (rng) => {
  const a = pick(rng, [2, 3, 4, 5, -2, -3])
  const x = nonZero(rng, -6, 6)
  const y = nonZero(rng, -6, 6)
  const re = (1 + a) * x
  const im = (1 - a) * y
  const k = a === 1 ? '' : a < 0 ? `- ${-a === 1 ? '' : -a}` : `+ ${a}`
  return {
    text: `Determinați numărul complex $z$ pentru care $z ${k}\\overline{z} = ${cx(re, im)}$.`,
    solution: lines(
      `Notăm $z = x + yi$, cu $x, y \\in ${R}$; atunci $\\overline{z} = x - yi$ și`,
      show(`x + yi ${a < 0 ? '-' : '+'} ${Math.abs(a)}(x - yi) = ${poly([[1 + a, 'x'], [1 - a, 'yi']])} = ${cx(re, im)}`),
      `Din egalitatea părților reale și a celor imaginare: $${poly([[1 + a, 'x']])} = ${re}$ și $${poly([[1 - a, 'y']])} = ${im}$, deci $x = ${x}$, $y = ${y}$ și $z = ${cx(x, y)}$.`,
    ),
    verify: () => x + a * x === re && y - a * y === im,
  }
}

const logBetween: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3, 5])
    const N = int(rng, 3, 900)
    let k = 0
    while (B ** (k + 1) <= N) k++
    if (B ** k === N) continue
    return {
      text: `Arătați că $${k} < \\log_{${B}} ${N} < ${k + 1}$.`,
      solution: lines(
        `Funcția $\\log_{${B}}$ este strict crescătoare, deoarece baza este mai mare decât 1.`,
        show(`${B ** k} < ${N} < ${B ** (k + 1)} \\Rightarrow \\log_{${B}} ${B ** k} < \\log_{${B}} ${N} < \\log_{${B}} ${B ** (k + 1)} \\Rightarrow ${k} < \\log_{${B}} ${N} < ${k + 1}`),
      ),
      verify: () => k < Math.log(N) / Math.log(B) && Math.log(N) / Math.log(B) < k + 1,
    }
  }
}

export const numbers: Record<1 | 2 | 3, Form[]> = {
  1: [logTerms, complexOps, powersAndRoots],
  2: [complexModulus, complexLinear, logChain],
  3: [powersOfI, conjugateEquation, logBetween],
}

// ============================== equations (grade X) ==============================

const expSimple: Form = (rng) => {
  const B = pick(rng, [2, 3, 5])
  const a = int(rng, 1, 3)
  const x = int(rng, -3, 4)
  const top = B === 2 ? 6 : B === 3 ? 4 : 3
  const e = int(rng, -top, top)
  const b = e - a * x
  const lhs = `${B}^{${poly([[a, 'x'], [b, '']])}}`
  return {
    text: `Rezolvați în mulțimea numerelor reale ecuația $${lhs} = ${powerTex(B, e)}$.`,
    solution: lines(
      `$${powerTex(B, e)} = ${B}^{${e}}$, deci ecuația devine $${lhs} = ${B}^{${e}}$. Funcția exponențială este injectivă, deci $${poly([[a, 'x'], [b, '']])} = ${e}$.`,
      `Soluția este $x = ${x}$.`,
    ),
    verify: () => close(B ** (a * x + b), B ** e),
  }
}

const logSimple: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3, 5])
    const k = int(rng, 0, B === 2 ? 5 : 3)
    const a = int(rng, 1, 4)
    const x = int(rng, -6, 12)
    const b = B ** k - a * x
    if (b === 0) continue
    const inside = poly([[a, 'x'], [b, '']])
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $\\log_{${B}}(${inside}) = ${k}$.`,
      solution: lines(
        `Condiția de existență: $${inside} > 0$.`,
        `Ecuația devine $${inside} = ${B}^{${k}} = ${B ** k}$, deci $x = ${x}$, care verifică condiția ($${a * x + b} > 0$).`,
      ),
      verify: () => close(Math.log(a * x + b) / Math.log(B), k),
    }
  }
}

const sqrtSimple: Form = (rng) => {
  for (;;) {
    const a = int(rng, 1, 4)
    const c = int(rng, 1, 9)
    const x = int(rng, -8, 12)
    const b = c * c - a * x
    if (b === 0) continue
    const inside = poly([[a, 'x'], [b, '']])
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $\\sqrt{${inside}} = ${c}$.`,
      solution: lines(
        `Ridicăm la pătrat: $${inside} = ${c * c}$, deci $x = ${x}$.`,
        `Verificare: $\\sqrt{${a * x + b}} = ${c}$, deci $x = ${x}$ este soluția ecuației.`,
      ),
      verify: () => Math.sqrt(a * x + b) === c,
    }
  }
}

const sqrtLinear: Form = (rng) => {
  for (;;) {
    const b = int(rng, -3, 5)
    const s = b + int(rng, 2, 7)
    const t = 2 * b + 1 - s
    const a = b * b - s * t
    if (a === 0) continue
    const lhs = `\\sqrt{${poly([[1, 'x'], [a, '']])}}`
    const rhs = poly([[1, 'x'], [-b, '']])
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $${lhs} = ${rhs}$.`,
      solution: lines(
        `Membrul stâng este nenegativ, deci trebuie $${rhs} \\ge 0$, adică $x \\ge ${b}$.`,
        `Ridicăm la pătrat: $${poly([[1, 'x'], [a, '']])} = ${b === 0 ? 'x^2' : `(${rhs})^2`}$, adică $${poly([[1, 'x^2'], [-(2 * b + 1), 'x'], [b * b - a, '']])} = 0$, cu soluțiile $x_1 = ${t}$ și $x_2 = ${s}$.`,
        `Cum $${t} < ${b}$, $x_1$ nu convine; soluția ecuației este $x = ${s}$.`,
      ),
      verify: () => Math.sqrt(s + a) === s - b && t < b && t * t - (2 * b + 1) * t + b * b - a === 0,
    }
  }
}

const expSubstitution: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3])
    const p = int(rng, 0, B === 2 ? 4 : 3)
    const negative = rng() < 0.4
    const t1 = B ** p
    const t2 = negative ? -int(rng, 1, 9) : B ** int(rng, 0, B === 2 ? 4 : 3)
    if (t1 === t2) continue
    const k = t1 + t2
    const m = t1 * t2
    const sols = negative ? [p] : [p, Math.round(Math.log(t2) / Math.log(B))].sort((x, y) => x - y)
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $${B * B}^x ${k === 0 ? '' : (k > 0 ? '- ' : '+ ') + (Math.abs(k) === 1 ? '' : Math.abs(k) + ' \\cdot ') + `${B}^x `}${signed(m)} = 0$.`.replace(/ +/g, ' '),
      solution: lines(
        `Notăm $${B}^x = t$, cu $t > 0$; cum $${B * B}^x = (${B}^x)^2 = t^2$, ecuația devine $${poly([[1, 't^2'], [-k, 't'], [m, '']])} = 0$, cu soluțiile $t_1 = ${Math.min(t1, t2)}$ și $t_2 = ${Math.max(t1, t2)}$.`,
        negative
          ? `Cum $t > 0$, convine doar $t = ${t1}$, deci $${B}^x = ${t1}$ și $x = ${p}$.`
          : `Din $${B}^x = ${Math.min(t1, t2)}$ și $${B}^x = ${Math.max(t1, t2)}$ obținem $x \\in \\{${sols.join(', ')}\\}$.`,
      ),
      verify: () => sols.every((x) => (B * B) ** x - k * B ** x + m === 0),
    }
  }
}

const logSum: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3])
    const k = int(rng, 2, B === 2 ? 5 : 3)
    const i = int(rng, 0, k)
    const [u, v] = [B ** i, B ** (k - i)]
    if (u === v) continue
    const s = int(rng, -3, 6)
    const [a, b] = [u - s, v - s]
    if (a === 0 || b === 0) continue
    const t = -(a + b) - s
    const xa = poly([[1, 'x'], [a, '']])
    const xb = poly([[1, 'x'], [b, '']])
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $\\log_{${B}}(${xa}) + \\log_{${B}}(${xb}) = ${k}$.`,
      solution: lines(
        `Condițiile de existență: $${xa} > 0$ și $${xb} > 0$, adică $x > ${Math.max(-a, -b)}$.`,
        `Ecuația devine $\\log_{${B}}\\left[(${xa})(${xb})\\right] = ${k}$, adică $(${xa})(${xb}) = ${B ** k}$, sau $${poly([[1, 'x^2'], [a + b, 'x'], [a * b - B ** k, '']])} = 0$.`,
        `Soluțiile sunt $x_1 = ${Math.min(s, t)}$ și $x_2 = ${Math.max(s, t)}$; condițiile le verifică doar $x = ${s}$, care este soluția ecuației.`,
      ),
      verify: () => s + a > 0 && s + b > 0 && (t + a <= 0 || t + b <= 0) && (s + a) * (s + b) === B ** k && t * t + (a + b) * t + a * b - B ** k === 0,
    }
  }
}

const expFactor: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3, 5])
    const shifts = [2, 1, 0, -1].filter(() => rng() < 0.6)
    if (shifts.length < 2) continue
    const signs = shifts.map((_, i) => (i === 0 ? 1 : rng() < 0.3 ? -1 : 1))
    const m = Math.min(...shifts)
    const F = shifts.reduce((s, c, i) => s + signs[i] * B ** (c - m), 0)
    if (F <= 0) continue
    const x = int(rng, -m, (B === 2 ? 5 : 3) - m)
    const N = F * B ** (x + m)
    if (N > 5000) continue
    const term = (c: number) => `${B}^{${poly([[1, 'x'], [c, '']])}}`
    const lhs = shifts.map((c, i) => (i === 0 ? '' : signs[i] < 0 ? ' - ' : ' + ') + term(c)).join('')
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $${lhs} = ${N}$.`,
      solution: lines(
        `Dăm factor comun $${term(m)}$:`,
        show(`${term(m)}\\left(${shifts.map((c, i) => (i === 0 ? '' : signs[i] < 0 ? ' - ' : ' + ') + (c - m === 0 ? '1' : `${B}^{${c - m}}`)).join('')}\\right) = ${N} \\Rightarrow ${term(m)} \\cdot ${F} = ${N}`),
        `deci $${term(m)} = ${B ** (x + m)} = ${B}^{${x + m}}$, de unde $${poly([[1, 'x'], [m, '']])} = ${x + m}$ și $x = ${x}$.`,
      ),
      verify: () => close(shifts.reduce((s, c, i) => s + signs[i] * B ** (x + c), 0), N),
    }
  }
}

const logBases: Form = (rng) => {
  const B = pick(rng, [2, 3])
  const set = pick(rng, [[1, 2], [1, 3], [1, 2, 3], [2, 3]])
  // log_{B^j} x = (1/j) log_B x
  const den = set.reduce((l, j) => (l * j) / gcd(l, j), 1)
  const sumNum = set.reduce((s, j) => s + den / j, 0)
  const [sp, sq] = reduce(sumNum, den)
  const maxT = B === 2 ? 6 : 4
  const steps = Array.from({ length: 2 * maxT + 1 }, (_, i) => i - maxT).filter((t) => t !== 0 && (t * sp) % sq === 0)
  const t = pick(rng, steps.length ? steps : [sq])
  const K = (t * sp) / sq
  const lhs = set.map((j) => `\\log_{${B ** j}} x`).join(' + ')
  return {
    text: `Rezolvați în mulțimea numerelor reale ecuația $${lhs} = ${K}$.`,
    solution: lines(
      `Condiția de existență: $x > 0$. Cum $\\log_{${B}^j} x = \\frac{1}{j}\\log_{${B}} x$, ecuația devine`,
      show(`\\left(${set.map((j) => (j === 1 ? '1' : `\\frac{1}{${j}}`)).join(' + ')}\\right)\\log_{${B}} x = ${K} \\Rightarrow ${frac(sp, sq)} \\log_{${B}} x = ${K} \\Rightarrow \\log_{${B}} x = ${t}`),
      `deci $x = ${B}^{${t}} = ${powerTex(B, t)}$, care verifică condiția.`,
    ),
    verify: () => close(set.reduce((s, j) => s + (t * Math.log(B)) / Math.log(B ** j), 0), K),
  }
}

const logSquared: Form = (rng) => {
  for (;;) {
    const B = pick(rng, [2, 3, 5])
    const p = int(rng, -3, 4)
    const q = int(rng, -3, 4)
    if (p === q) continue
    const sols = [p, q].sort((x, y) => x - y)
    return {
      text: `Rezolvați în mulțimea numerelor reale ecuația $\\log_{${B}}^2 x ${-(p + q) === 0 ? '' : (-(p + q) < 0 ? '- ' : '+ ') + (Math.abs(p + q) === 1 ? '' : Math.abs(p + q)) + `\\log_{${B}} x `}${p * q === 0 ? '' : signed(p * q)} = 0$.`.replace(/ +/g, ' '),
      solution: lines(
        `Condiția de existență: $x > 0$. Notăm $\\log_{${B}} x = t$; ecuația devine $${poly([[1, 't^2'], [-(p + q), 't'], [p * q, '']])} = 0$, cu soluțiile $t_1 = ${sols[0]}$ și $t_2 = ${sols[1]}$.`,
        `Atunci $x_1 = ${B}^{${sols[0]}} = ${powerTex(B, sols[0])}$ și $x_2 = ${B}^{${sols[1]}} = ${powerTex(B, sols[1])}$, care verifică condiția.`,
      ),
      verify: () => sols.every((t) => t * t - (p + q) * t + p * q === 0),
    }
  }
}

export const equations: Record<1 | 2 | 3, Form[]> = {
  1: [expSimple, logSimple, sqrtSimple],
  2: [sqrtLinear, expSubstitution, logSum],
  3: [expFactor, logBases, logSquared],
}

// ============================== combinatorics and probabilities (grade X) ==============================

const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1))
// as products, exact also for large n (n! is not, past 18)
const A = (n: number, k: number) => (k < 0 || k > n ? 0 : Array.from({ length: k }, (_, i) => n - i).reduce((s, x) => s * x, 1))
const C = (n: number, k: number) => (k < 0 || k > n ? 0 : A(n, k) / fact(k))
const elements = (n: number) => `${n} ${n >= 20 ? 'de ' : ''}elemente`
const cases = (n: number) => `${n} ${n === 1 ? 'caz' : n >= 20 ? 'de cazuri' : 'cazuri'}`

const probabilityMultiples: Form = (rng) => {
  const twoDigit = rng() < 0.4
  const N = int(rng, 12, 60)
  const lo = twoDigit ? 10 : 1
  const hi = twoDigit ? 99 : N
  const squares = rng() < 0.3
  const k = int(rng, 2, 9)
  const good = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((n) => (squares ? Number.isInteger(Math.sqrt(n)) : n % k === 0)).length
  const total = hi - lo + 1
  const set = twoDigit ? 'mulțimea numerelor naturale de două cifre' : `mulțimea $\\{1, 2, 3, \\ldots, ${N}\\}$`
  return {
    text: `Calculați probabilitatea ca, alegând un număr din ${set}, acesta să fie ${squares ? 'pătrat perfect' : `divizibil cu ${k}`}.`,
    solution: lines(
      `Mulțimea are ${elements(total)}, deci sunt ${cases(total)} posibile.`,
      squares
        ? `Pătratele perfecte din mulțime sunt ${Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((n) => Number.isInteger(Math.sqrt(n))).join(', ')}, deci sunt ${cases(good)} favorabile.`
        : `Multiplii lui ${k} din mulțime sunt ${Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((n) => n % k === 0).slice(0, 3).join(', ')}, …, deci sunt ${cases(good)} favorabile.`,
      show(`p = \\frac{\\text{nr. cazuri favorabile}}{\\text{nr. cazuri posibile}} = \\frac{${good}}{${total}}${frac(good, total) === `\\frac{${good}}{${total}}` ? '' : ` = ${frac(good, total)}`}`),
    ),
    verify: () => good > 0 && good <= total,
  }
}

const combValues: Form = (rng) => {
  const kinds = ['C', 'A', 'P'] as const
  const picked: { kind: (typeof kinds)[number]; n: number; k: number; sign: number }[] = []
  while (picked.length < 2) {
    const kind = pick(rng, kinds)
    const n = kind === 'P' ? int(rng, 2, 5) : int(rng, 4, 10)
    const k = kind === 'P' ? n : int(rng, 2, 3)
    if (picked.some((p) => p.kind === kind)) continue
    picked.push({ kind, n, k, sign: picked.length && rng() < 0.4 ? -1 : 1 })
  }
  const name = (p: (typeof picked)[number]) => (p.kind === 'P' ? `P_{${p.n}}` : `${p.kind}_{${p.n}}^{${p.k}}`)
  const val = (p: (typeof picked)[number]) => (p.kind === 'P' ? fact(p.n) : p.kind === 'C' ? C(p.n, p.k) : A(p.n, p.k))
  const how = (p: (typeof picked)[number]) =>
    p.kind === 'P' ? `${p.n}! = ${fact(p.n)}` : p.kind === 'C' ? `\\frac{${p.n}!}{${p.k}! \\cdot ${p.n - p.k}!} = ${C(p.n, p.k)}` : `\\frac{${p.n}!}{${p.n - p.k}!} = ${A(p.n, p.k)}`
  const total = picked.reduce((s, p) => s + p.sign * val(p), 0)
  return {
    text: `Calculați $${picked.map((p, i) => (i === 0 ? '' : p.sign < 0 ? ' - ' : ' + ') + name(p)).join('')}$.`,
    solution: lines(
      picked.map((p) => `$${name(p)} = ${how(p)}$`).join(', ') + '.',
      show(`${picked.map((p, i) => (i === 0 ? '' : p.sign < 0 ? ' - ' : ' + ') + val(p)).join('')} = ${total}`),
    ),
    verify: () => total === picked.reduce((s, p) => s + p.sign * val(p), 0) && C(5, 2) === 10 && A(5, 2) === 20,
  }
}

const countings: Form = (rng) => {
  const ask = int(rng, 0, 2)
  if (ask === 0) {
    const n = int(rng, 4, 12)
    const k = int(rng, 2, Math.min(4, n - 1))
    return {
      text: `Determinați numărul submulțimilor cu ${k} elemente ale unei mulțimi cu ${elements(n)}.`,
      solution: show(`C_{${n}}^{${k}} = \\frac{${n}!}{${k}! \\cdot ${n - k}!} = ${C(n, k)}`),
      verify: () => C(n, k) === C(n, n - k),
    }
  }
  if (ask === 1) {
    const n = int(rng, 3, 10)
    return {
      text: `Determinați numărul submulțimilor mulțimii $A = \\{1, 2, \\ldots, ${n}\\}$.`,
      solution: `O mulțime cu $n$ elemente are $2^n$ submulțimi, deci $A$ are $2^{${n}} = ${2 ** n}$ submulțimi.`,
      verify: () => Array.from({ length: n + 1 }, (_, k) => C(n, k)).reduce((s, x) => s + x, 0) === 2 ** n,
    }
  }
  const n = int(rng, 4, 9)
  const k = int(rng, 2, 3)
  const digits = Array.from({ length: n }, (_, i) => i + 1)
  return {
    text: `Determinați câte numere de ${k} cifre distincte se pot forma cu cifrele ${digits.join(', ')}.`,
    solution: `Contează ordinea cifrelor, deci numărul lor este $A_{${n}}^{${k}} = \\frac{${n}!}{${n - k}!} = ${A(n, k)}$.`,
    verify: () => A(n, k) === Array.from({ length: k }, (_, i) => n - i).reduce((s, x) => s * x, 1),
  }
}

const combEquation: Form = (rng) => {
  const n = int(rng, 3, 30)
  const kind = int(rng, 0, 2)
  const [expr, val, how] = kind === 0
    ? ['C_n^2', (n * (n - 1)) / 2, '\\frac{n(n - 1)}{2}']
    : kind === 1 ? ['A_n^2', n * (n - 1), 'n(n - 1)'] : ['C_{n+1}^2', ((n + 1) * n) / 2, '\\frac{(n + 1)n}{2}']
  const target = kind === 1 ? val : 2 * val
  const shift = kind === 2 ? 1 : 0
  return {
    text: `Rezolvați ecuația $${expr} = ${val}$, unde $n$ este număr natural, $n \\ge ${2 - shift}$.`,
    solution: lines(
      show(`${expr} = ${how} = ${val} \\Rightarrow ${kind === 2 ? 'n(n + 1)' : 'n(n - 1)'} = ${target}`),
      `Produsul a două numere naturale consecutive este $${target} = ${kind === 2 ? `${n} \\cdot ${n + 1}` : `${n - 1} \\cdot ${n}`}$, deci $n = ${n}$ (ecuația de gradul al doilea mai are o soluție negativă, care nu convine).`,
    ),
    verify: () => (kind === 0 ? C(n, 2) : kind === 1 ? A(n, 2) : C(n + 1, 2)) === val,
  }
}

const probabilityDigits: Form = (rng) => {
  const kind = int(rng, 0, 2)
  const s = int(rng, 3, 16)
  const all = Array.from({ length: 90 }, (_, i) => i + 10)
  const ok = (n: number) => {
    const [a, b] = [Math.floor(n / 10), n % 10]
    return kind === 0 ? a + b === s : kind === 1 ? a !== b && (a * b) % 2 === 0 : a > b
  }
  const good = all.filter(ok)
  const what = kind === 0 ? `să aibă suma cifrelor egală cu ${s}` : kind === 1 ? 'să aibă cifrele distincte, iar produsul cifrelor să fie par' : 'să aibă cifra zecilor mai mare decât cifra unităților'
  const why = kind === 0
    ? `Numerele favorabile sunt ${good.join(', ')}, deci sunt ${cases(good.length)} favorabile.`
    : kind === 1
      ? `Numerele cu cifre distincte sunt $90 - 9 = 81$. Dintre ele, cele cu ambele cifre impare sunt $5 \\cdot 4 = 20$, deci sunt $81 - 20 = ${good.length}$ de cazuri favorabile.`
      : `Dacă cifra zecilor este $a$, cifra unităților poate lua $a$ valori ($0, 1, \\ldots, a - 1$), deci sunt $1 + 2 + \\ldots + 9 = ${good.length}$ de cazuri favorabile.`
  return {
    text: `Calculați probabilitatea ca, alegând un număr din mulțimea numerelor naturale de două cifre, acesta ${what}.`,
    solution: lines(
      'Sunt 90 de numere naturale de două cifre, deci 90 de cazuri posibile.',
      why,
      show(`p = \\frac{${good.length}}{90}${frac(good.length, 90) === `\\frac{${good.length}}{90}` ? '' : ` = ${frac(good.length, 90)}`}`),
    ),
    verify: () => good.length > 0 && (kind !== 2 || good.length === 45) && (kind !== 1 || good.length === 61),
  }
}

const functionsCount: Form = (rng) => {
  const m = int(rng, 2, 5)
  const n = int(rng, m, 7)
  const kind = int(rng, 0, 2)
  const A_ = m === 2 ? '\\{1, 2\\}' : m === 3 ? '\\{1, 2, 3\\}' : `\\{1, 2, \\ldots, ${m}\\}`
  const B_ = `\\{1, 2, \\ldots, ${n}\\}`
  const value = kind === 0 ? n ** m : kind === 1 ? A(n, m) : n ** (m - 1)
  const ask = kind === 0 ? 'funcțiilor $f: A \\to B$' : kind === 1 ? 'funcțiilor injective $f: A \\to B$' : 'funcțiilor $f: A \\to B$ cu $f(1) = 1$'
  const how = kind === 0
    ? `Fiecare dintre cele ${m} elemente ale lui $A$ are ${n} imagini posibile, deci sunt $${n}^{${m}} = ${value}$ funcții.`
    : kind === 1
      ? `Imaginile elementelor lui $A$ sunt distincte și contează ordinea, deci sunt $A_{${n}}^{${m}} = ${value}$ funcții.`
      : `$f(1)$ este fixat, iar celelalte ${m - 1} elemente au câte ${n} imagini posibile: $${n}^{${m - 1}} = ${value}$ funcții.`
  return {
    text: `Se consideră mulțimile $A = ${A_}$ și $B = ${B_}$. Determinați numărul ${ask}.`,
    solution: how,
    verify: () => (kind === 1 ? value === fact(n) / fact(n - m) : value > 0),
  }
}

const binomialFree: Form = (rng) => {
  for (;;) {
    const a = int(rng, 1, 3)
    const b = int(rng, 1, 3)
    const step = (a + b) / gcd(a, b)
    const n = step * int(rng, 1, 4)
    if (n < 3 || n > 12) continue
    const k = (a * n) / (a + b)
    const c = pick(rng, [1, 1, 2])
    const x1 = a === 1 ? 'x' : `x^{${a}}`
    const first = c === 1 ? x1 : `${c}${x1}`
    const second = `\\frac{1}{${b === 1 ? 'x' : `x^{${b}}`}}`
    const value = C(n, k) * c ** (n - k)
    return {
      text: `Determinați termenul care nu îl conține pe $x$ din dezvoltarea $\\left(${first} + ${second}\\right)^{${n}}$, $x \\ne 0$.`,
      solution: lines(
        'Termenul general al dezvoltării este',
        show(`T_{k+1} = C_{${n}}^{k} \\left(${first}\\right)^{${n} - k} \\left(${second}\\right)^{k} = C_{${n}}^{k}${c === 1 ? '' : ` \\cdot ${c}^{${n} - k}`} \\cdot x^{${a === 1 ? '' : a}(${n} - k) - ${b === 1 ? '' : b}k}`),
        `Exponentul lui $x$ este 0 dacă $${a * n} - ${a + b}k = 0$, adică $k = ${k}$. Termenul căutat este $T_{${k + 1}} = C_{${n}}^{${k}}${c === 1 ? '' : ` \\cdot ${c}^{${n - k}}`} = ${value}$.`,
      ),
      verify: () => a * (n - k) - b * k === 0 && value === C(n, k) * c ** (n - k),
    }
  }
}

const probabilityRealRoots: Form = (rng) => {
  const N = int(rng, 8, 20)
  const c = int(rng, 2, 25)
  const good = Array.from({ length: N }, (_, i) => i + 1).filter((a) => a * a >= 4 * c)
  if (!good.length || good.length === N) return probabilityRealRoots(rng)
  const least = good[0]
  return {
    text: `Calculați probabilitatea ca, alegând un număr $a$ din mulțimea $\\{1, 2, 3, \\ldots, ${N}\\}$, ecuația $x^2 + ax + ${c} = 0$ să aibă soluții reale.`,
    solution: lines(
      `Ecuația are soluții reale dacă $\\Delta = a^2 - ${4 * c} \\ge 0$, adică $a^2 \\ge ${4 * c}$. Pentru $a$ natural, aceasta înseamnă $a \\ge ${least}$.`,
      `Sunt ${cases(N)} posibile și ${cases(good.length)} favorabile ($a = ${least}, \\ldots, ${N}$).`,
      show(`p = \\frac{${good.length}}{${N}}${frac(good.length, N) === `\\frac{${good.length}}{${N}}` ? '' : ` = ${frac(good.length, N)}`}`),
    ),
    verify: () => least * least >= 4 * c && (least - 1) ** 2 < 4 * c,
  }
}

const combSumEquation: Form = (rng) => {
  // each, written over 2: P n² + Q n
  const kinds = [
    { tex: 'A_n^2', P: 2, Q: -2, min: 2 },
    { tex: 'C_n^2', P: 1, Q: -1, min: 2 },
    { tex: 'C_{n+1}^2', P: 1, Q: 1, min: 1 },
    { tex: 'A_{n+1}^2', P: 2, Q: 2, min: 1 },
    { tex: 'C_n^1', P: 0, Q: 2, min: 1 },
  ]
  for (;;) {
    const i = int(rng, 0, kinds.length - 1)
    const j = int(rng, 0, kinds.length - 1)
    if (i >= j) continue
    const [u, v] = [kinds[i], kinds[j]]
    const P = u.P + v.P
    const Q = u.Q + v.Q
    const n = int(rng, Math.max(u.min, v.min) + 1, 15)
    const k = (P * n * n + Q * n) / 2
    const other = reduce(-Q - P * n, P)
    return {
      text: `Rezolvați ecuația $${u.tex} + ${v.tex} = ${k}$, unde $n$ este număr natural, $n \\ge ${Math.max(u.min, v.min)}$.`,
      solution: lines(
        `Folosim $A_n^2 = n(n - 1)$, $C_n^2 = \\frac{n(n - 1)}{2}$, $C_n^1 = n$. Ecuația devine, după înmulțirea cu 2:`,
        show(`${poly([[P, 'n^2'], [Q, 'n']])} = ${2 * k} \\Rightarrow ${poly([[P, 'n^2'], [Q, 'n'], [-2 * k, '']])} = 0`),
        `cu soluțiile $n_1 = ${n}$ și $n_2 = ${frac(other[0], other[1])}$. Convine doar $n = ${n}$.`,
      ),
      verify: () => {
        const val = (t: (typeof kinds)[number]) => (t.tex === 'A_n^2' ? A(n, 2) : t.tex === 'C_n^2' ? C(n, 2) : t.tex === 'C_{n+1}^2' ? C(n + 1, 2) : t.tex === 'A_{n+1}^2' ? A(n + 1, 2) : n)
        return val(u) + val(v) === k && other[0] / other[1] < 0
      },
    }
  }
}

export const combinatorics: Record<1 | 2 | 3, Form[]> = {
  1: [probabilityMultiples, combValues, countings],
  2: [combEquation, probabilityDigits, functionsCount],
  3: [binomialFree, probabilityRealRoots, combSumEquation],
}

// ============================== vectors and analytic geometry (grade X) ==============================

const intro = 'În reperul cartezian $xOy$ se consideră'

const midpointOrLength: Form = (rng) => {
  const [x1, y1] = [int(rng, -8, 8), int(rng, -8, 8)]
  const length = rng() < 0.5
  let dx = nonZero(rng, -9, 9)
  let dy = nonZero(rng, -9, 9)
  if (length && rng() < 0.6) {
    const [a, b] = rightTriangle(rng, 15)
    dx = a * (rng() < 0.5 ? -1 : 1)
    dy = b * (rng() < 0.5 ? -1 : 1)
  }
  const [x2, y2] = [x1 + dx, y1 + dy]
  const d2 = dx * dx + dy * dy
  return {
    text: `${intro} punctele $${point('A', x1, y1)}$ și $${point('B', x2, y2)}$. ${length ? 'Calculați lungimea segmentului $AB$.' : 'Determinați coordonatele mijlocului segmentului $AB$.'}`,
    solution: length
      ? show(`AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2} = \\sqrt{${paren(dx)}^2 + ${paren(dy)}^2} = \\sqrt{${d2}} = ${root(d2)}`)
      : lines(show(`x_M = \\frac{x_A + x_B}{2} = \\frac{${x1} ${signed(x2)}}{2} = ${frac(x1 + x2, 2)}, \\qquad y_M = \\frac{y_A + y_B}{2} = \\frac{${y1} ${signed(y2)}}{2} = ${frac(y1 + y2, 2)}`), `Mijlocul este $M\\left(${frac(x1 + x2, 2)}, ${frac(y1 + y2, 2)}\\right)$.`),
    verify: () => close(Math.hypot(dx, dy) ** 2, d2),
  }
}

const lineThrough: Form = (rng) => {
  for (;;) {
    const [x1, y1, x2, y2] = [int(rng, -7, 7), int(rng, -7, 7), int(rng, -7, 7), int(rng, -7, 7)]
    if (x1 === x2 || y1 === y2) continue
    const a = y2 - y1
    const b = -(x2 - x1)
    const c = -a * x1 - b * y1
    return {
      text: `${intro} punctele $${point('A', x1, y1)}$ și $${point('B', x2, y2)}$. Determinați ecuația dreptei $AB$.`,
      solution: lines(
        show(`AB: \\frac{x - x_A}{x_B - x_A} = \\frac{y - y_A}{y_B - y_A} \\Leftrightarrow \\frac{${poly([[1, 'x'], [-x1, '']])}}{${x2 - x1}} = \\frac{${poly([[1, 'y'], [-y1, '']])}}{${y2 - y1}}`),
        `deci ecuația dreptei este $${lineTex(a, b, c)}$.`,
      ),
      verify: () => a * x1 + b * y1 + c === 0 && a * x2 + b * y2 + c === 0,
    }
  }
}

const vectorsCollinear: Form = (rng) => {
  const vec = (n: string, x: number, y: number) => `\\vec{${n}} = ${poly([[x, '\\vec{i}'], [y, '\\vec{j}']])}`
  if (rng() < 0.5) {
    const [a, b, c, d] = [nonZero(rng, -5, 5), nonZero(rng, -5, 5), nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    const [p, q] = [int(rng, 2, 4), nonZero(rng, -3, 3)]
    const [x, y] = [p * a - q * c, p * b - q * d]
    return {
      text: `Se consideră vectorii $${vec('u', a, b)}$ și $${vec('v', c, d)}$. Determinați coordonatele vectorului $\\vec{w} = ${p}\\vec{u} ${q < 0 ? '+ ' + (-q === 1 ? '' : -q) : '- ' + (q === 1 ? '' : q)}\\vec{v}$.`,
      solution: show(`\\vec{w} = ${p}(${poly([[a, '\\vec{i}'], [b, '\\vec{j}']])}) ${q < 0 ? '+ ' + (-q === 1 ? '' : -q) : '- ' + (q === 1 ? '' : q)}(${poly([[c, '\\vec{i}'], [d, '\\vec{j}']])}) = ${poly([[x, '\\vec{i}'], [y, '\\vec{j}']])}`),
      verify: () => x === p * a - q * c && y === p * b - q * d,
    }
  }
  for (;;) {
    const [p, q, r] = [nonZero(rng, -6, 6), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
    if ((p * r) % q !== 0) continue
    const m = (p * r) / q
    return {
      text: `Determinați numărul real $m$ pentru care vectorii $\\vec{u} = ${poly([[p, '\\vec{i}']])} + m\\vec{j}$ și $${vec('v', q, r)}$ sunt coliniari.`,
      solution: lines(
        'Vectorii sunt coliniari dacă au coordonatele proporționale:',
        show(`\\frac{${p}}{${q}} = \\frac{m}{${r}} \\Rightarrow m = \\frac{${p} \\cdot ${paren(r)}}{${q}} = ${m}`),
      ),
      verify: () => p * r === m * q,
    }
  }
}

const parallelOrPerp: Form = (rng) => {
  for (;;) {
    const [a, b] = [nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    const c = int(rng, -9, 9)
    const [p, q] = [int(rng, -6, 6), int(rng, -6, 6)]
    if (a * p + b * q + c === 0) continue
    const perp = rng() < 0.5
    const [A2, B2] = perp ? [b, -a] : [a, b]
    const C2 = -(A2 * p + B2 * q)
    return {
      text: `${intro} punctul $${point('A', p, q)}$ și dreapta $d: ${lineTex(a, b, c)}$. Determinați ecuația dreptei care trece prin $A$ și este ${perp ? 'perpendiculară pe' : 'paralelă cu'} dreapta $d$.`,
      solution: lines(
        `Panta dreptei $d$ este $m_d = ${frac(-a, b)}$. ${perp ? `Dreapta căutată are panta $m = -\\frac{1}{m_d} = ${frac(b, a)}$` : `Dreapta căutată are aceeași pantă, $m = ${frac(-a, b)}$`}, deci ecuația ei este`,
        show(`y - y_A = m(x - x_A) \\Leftrightarrow ${poly([[1, 'y'], [-q, '']])} = ${perp ? frac(b, a) : frac(-a, b)}(${poly([[1, 'x'], [-p, '']])})`),
        `adică $${lineTex(A2, B2, C2)}$.`,
      ),
      verify: () => A2 * p + B2 * q + C2 === 0 && (perp ? A2 * a + B2 * b === 0 : A2 * b - B2 * a === 0),
    }
  }
}

const collinearParam: Form = (rng) => {
  const [x1, y1] = [int(rng, -6, 6), int(rng, -6, 6)]
  const [dx, dy] = [nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
  const t = pick(rng, [-2, 2, 3, -1])
  const [x2, y2] = [x1 + dx, y1 + dy]
  const [m, k] = [x1 + t * dx, y1 + t * dy]
  return {
    text: `${intro} punctele $${point('A', x1, y1)}$, $${point('B', x2, y2)}$ și $C(m, ${k})$. Determinați numărul real $m$ pentru care punctele $A$, $B$ și $C$ sunt coliniare.`,
    solution: lines(
      'Punctele sunt coliniare dacă vectorii $\\overrightarrow{AB}$ și $\\overrightarrow{AC}$ au coordonatele proporționale:',
      show(`\\frac{x_C - x_A}{x_B - x_A} = \\frac{y_C - y_A}{y_B - y_A} \\Leftrightarrow \\frac{${poly([[1, 'm'], [-x1, '']])}}{${dx}} = \\frac{${k - y1}}{${dy}} = ${t}`),
      `deci $m = ${m}$.`,
    ),
    verify: () => (m - x1) * dy === (k - y1) * dx,
  }
}

const centroidOrArea: Form = (rng) => {
  for (;;) {
    const P = Array.from({ length: 3 }, () => [int(rng, -6, 6), int(rng, -6, 6)] as [number, number])
    const twice = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])
    if (twice === 0) continue
    const area = rng() < 0.5
    const [pa, pb, pc] = P.map(([x, y], i) => `$${point('ABC'[i], x, y)}$`)
    const pts = `${pa}, ${pb} și ${pc}`
    const sx = P[0][0] + P[1][0] + P[2][0]
    const sy = P[0][1] + P[1][1] + P[2][1]
    return {
      text: `${intro} punctele ${pts}. ${area ? 'Calculați aria triunghiului $ABC$.' : 'Determinați coordonatele centrului de greutate al triunghiului $ABC$.'}`,
      solution: area
        ? lines(
          show(`\\Delta = \\begin{vmatrix} ${P.map(([x, y]) => `${x} & ${y} & 1`).join(' \\\\ ')} \\end{vmatrix} = ${twice}`),
          `$\\mathcal{A}_{ABC} = \\frac{|\\Delta|}{2} = ${frac(Math.abs(twice), 2)}$.`,
        )
        : lines(
          show(`x_G = \\frac{x_A + x_B + x_C}{3} = ${frac(sx, 3)}, \\qquad y_G = \\frac{y_A + y_B + y_C}{3} = ${frac(sy, 3)}`),
          `Centrul de greutate este $G\\left(${frac(sx, 3)}, ${frac(sy, 3)}\\right)$.`,
        ),
      verify: () => {
        const det = P[0][0] * (P[1][1] - P[2][1]) - P[0][1] * (P[1][0] - P[2][0]) + (P[1][0] * P[2][1] - P[2][0] * P[1][1])
        return det === twice
      },
    }
  }
}

const parallelParam: Form = (rng) => {
  for (;;) {
    const m1 = nonZero(rng, -6, 6)
    const m2 = nonZero(rng, -6, 6)
    if (m1 === m2 || m1 * m2 >= 0) continue
    const s = -(m1 + m2)
    const prod = -m1 * m2
    const divisors = Array.from({ length: prod }, (_, i) => i + 1).filter((d) => prod % d === 0)
    const p = pick(rng, divisors)
    const q = prod / p
    const c1 = nonZero(rng, -5, 5)
    const c2 = nonZero(rng, -5, 5)
    // parallel: m(m + s) = pq; the same line when also m·c2 = q·c1
    const roots = [m1, m2].sort((x, y) => x - y)
    const valid = roots.filter((m) => m * c2 !== q * c1)
    if (!valid.length) continue
    const same = roots.filter((m) => !valid.includes(m))
    const d1 = `mx + ${p === 1 ? '' : p}y ${signed(c1)} = 0`
    const d2 = `${q === 1 ? '' : q}x + (m ${s === 0 ? '' : signed(s)})y ${signed(c2)} = 0`.replace('(m )', 'm')
    return {
      text: `Determinați numărul real $m$ pentru care dreptele $d_1: ${d1}$ și $d_2: ${d2}$ sunt paralele.`,
      solution: lines(
        'Dreptele sunt paralele dacă au coeficienții lui $x$ și $y$ proporționali, dar nu coincid:',
        show(`\\frac{m}{${q}} = \\frac{${p}}{${s === 0 ? 'm' : `m ${signed(s)}`}} \\Rightarrow ${poly([[1, 'm^2'], [s, 'm'], [-prod, '']])} = 0`),
        `cu soluțiile $m = ${roots[0]}$ și $m = ${roots[1]}$.`,
        same.length
          ? `Pentru $m = ${same[0]}$ dreptele coincid (și termenii liberi sunt proporționali), deci convine doar $m = ${valid[0]}$.`
          : 'Pentru ambele valori termenii liberi nu sunt proporționali, deci dreptele nu coincid: convin ambele valori.',
      ),
      verify: () => roots.every((m) => m * (m + s) === p * q) && valid.every((m) => m * c2 !== q * c1),
    }
  }
}

const distanceToLine: Form = (rng) => {
  for (;;) {
    let [a, b] = rng() < 0.4 ? pick(rng, [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8]]).map((v) => v * (rng() < 0.5 ? -1 : 1)) : [nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    let c = int(rng, -9, 9)
    // the line as it is written: reduced, with the first coefficient positive
    const g = gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c)) || 1
    ;[a, b, c] = [a / g, b / g, c / g].map((v) => (a < 0 ? -v : v))
    const [p, q] = [int(rng, -6, 6), int(rng, -6, 6)]
    const N = a * p + b * q + c
    if (N === 0) continue
    const S = a * a + b * b
    const [k, m] = rootParts(S)
    const v = surd(Math.abs(N), k * m, m)
    return {
      text: `${intro} punctul $${point('A', p, q)}$ și dreapta $d: ${lineTex(a, b, c)}$. Calculați distanța de la punctul $A$ la dreapta $d$.`,
      solution: show(`d(A, d) = \\frac{|a x_A + b y_A + c|}{\\sqrt{a^2 + b^2}} = \\frac{|${a} \\cdot ${paren(p)} ${b < 0 ? '- ' + -b : '+ ' + b} \\cdot ${paren(q)}${c === 0 ? '' : ' ' + signed(c)}|}{\\sqrt{${a * a} + ${b * b}}} = \\frac{${Math.abs(N)}}{${root(S)}} = ${v}`),
      verify: () => lineTex(a, b, c) === `${poly([[a, 'x'], [b, 'y'], [c, '']])} = 0` && close(Math.abs(N) / Math.sqrt(S), (Math.abs(N) * Math.sqrt(m)) / (k * m)),
    }
  }
}

const bisectorOrAltitude: Form = (rng) => {
  for (;;) {
    const P = Array.from({ length: 3 }, () => [int(rng, -6, 6), int(rng, -6, 6)] as [number, number])
    const [[x1, y1], [x2, y2], [x3, y3]] = P
    if ((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1) === 0) continue
    if (rng() < 0.5) {
      // the perpendicular bisector of AB: (B − A)·(2P − A − B) = 0
      const [dx, dy] = [x2 - x1, y2 - y1]
      const [a, b, c] = [2 * dx, 2 * dy, -(dx * (x1 + x2) + dy * (y1 + y2))]
      return {
        text: `${intro} punctele $${point('A', x1, y1)}$ și $${point('B', x2, y2)}$. Determinați ecuația mediatoarei segmentului $AB$.`,
        solution: lines(
          `Mediatoarea trece prin mijlocul $M\\left(${frac(x1 + x2, 2)}, ${frac(y1 + y2, 2)}\\right)$ al segmentului și este perpendiculară pe $AB$, deci vectorul $\\overrightarrow{AB} = ${poly([[dx, '\\vec{i}'], [dy, '\\vec{j}']])}$ este perpendicular pe ea.`,
          `Un punct $P(x, y)$ este pe mediatoare dacă $\\overrightarrow{MP} \\cdot \\overrightarrow{AB} = 0$: $${dx}\\left(x - ${paren(frac(x1 + x2, 2))}\\right) ${signed(dy)}\\left(y - ${paren(frac(y1 + y2, 2))}\\right) = 0$, adică $${lineTex(a, b, c)}$.`,
        ),
        verify: () => close(Math.hypot((x1 + x2) / 2 - x1, (y1 + y2) / 2 - y1), Math.hypot((x1 + x2) / 2 - x2, (y1 + y2) / 2 - y2)) && a * (x1 + x2) / 2 + b * (y1 + y2) / 2 + c === 0,
      }
    }
    // the altitude from A: (C − B)·(P − A) = 0
    const [dx, dy] = [x3 - x2, y3 - y2]
    const [a, b, c] = [dx, dy, -(dx * x1 + dy * y1)]
    return {
      text: `${intro} punctele $${point('A', x1, y1)}$, $${point('B', x2, y2)}$ și $${point('C', x3, y3)}$. Determinați ecuația înălțimii din $A$ a triunghiului $ABC$.`,
      solution: lines(
        `Înălțimea din $A$ este perpendiculară pe $BC$, deci vectorul $\\overrightarrow{BC} = ${poly([[dx, '\\vec{i}'], [dy, '\\vec{j}']])}$ este perpendicular pe ea.`,
        `Un punct $P(x, y)$ este pe înălțime dacă $\\overrightarrow{AP} \\cdot \\overrightarrow{BC} = 0$: $${[dx === 0 ? '' : `${dx}(${poly([[1, 'x'], [-x1, '']])})`, dy === 0 ? '' : `${dy}(${poly([[1, 'y'], [-y1, '']])})`].filter(Boolean).join(' + ').replace('+ -', '- ')} = 0$, adică $${lineTex(a, b, c)}$.`,
      ),
      verify: () => a * x1 + b * y1 + c === 0 && a * (x3 - x2) + b * (y3 - y2) === dx * dx + dy * dy,
    }
  }
}

export const analytic: Record<1 | 2 | 3, Form[]> = {
  1: [midpointOrLength, lineThrough, vectorsCollinear],
  2: [parallelOrPerp, collinearParam, centroidOrArea],
  3: [parallelParam, distanceToLine, bisectorOrAltitude],
}
