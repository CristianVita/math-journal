// More kinds for grade VII, after the chapters of the Romanian syllabus that had no generated exercises:
// real numbers (absolute value, integer part, means), algebraic calculation, equations and systems with their
// word problems, quadrilaterals, the circle and the regular polygons, the metric relations in the right triangle.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, paren, pick, poly, reduce, rightTriangle, root, rootParts, shuffle, surd, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  id: string
  label: string
  topic: 'Algebră' | 'Geometrie'
  forms: Record<1 | 2 | 3, Form[]>
}

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
const coef = (n: number) => (n === 1 ? '' : n === -1 ? '-' : String(n))
const op = (s: number) => (s < 0 ? '-' : '+')
/** Like `poly`, with the positive terms first: 9 - 2\sqrt{11}, not -2\sqrt{11} + 9. */
const sum = (terms: [number, string][]) => poly([...terms.filter(([c]) => c > 0), ...terms.filter(([c]) => c <= 0)])
/** A number with at most two decimals, with the decimal comma. */
const dec = (x: number) => String(Math.round(x * 100) / 100).replace('.', '{,}')
/** (p/q)·π, p/q positive. */
const piTex = (p: number, q = 1) => {
  const [n, d] = reduce(p, q)
  const top = (n === 1 ? '' : n) + '\\pi'
  return d === 1 ? top : `\\frac{${top}}{${d}}`
}
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n))
/** √n as the last step of a computation: "6", "\sqrt{7}" or "\sqrt{12} = 2\sqrt{3}". */
const rootEq = (n: number) => {
  const [k, m] = rootParts(n)
  if (m === 1) return String(k)
  if (k === 1) return `\\sqrt{${n}}`
  return `\\sqrt{${n}} = ${root(n)}`
}
const cm = '\\text{ cm}'
const cm2 = '\\text{ cm}^2'
/** Numbers without square factors, for radicals that stay as they are. */
const SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19]

// ───────────────────────────── 1. Real numbers ─────────────────────────────

/** √((−a)²) ± √(b²) ± |−c|. */
const rootSquare: Form = (rng) => {
  const [a, b, c] = [int(rng, 2, 15), int(rng, 2, 15), int(rng, 2, 15)]
  const [s2, s3] = [pick(rng, [1, -1]), pick(rng, [1, -1])]
  const total = a + s2 * b + s3 * c
  return {
    text: `Calculați: $\\sqrt{(-${a})^2} ${op(s2)} \\sqrt{${b}^2} ${op(s3)} |-${c}|$.`,
    solution: lines(
      'Pentru orice număr real $x$, $\\sqrt{x^2} = |x|$:',
      show(`\\sqrt{(-${a})^2} = |-${a}| = ${a}, \\quad \\sqrt{${b}^2} = |${b}| = ${b}, \\quad |-${c}| = ${c}`),
      show(`${a} ${op(s2)} ${b} ${op(s3)} ${c} = ${total}`),
    ),
    verify: () => Math.sqrt((-a) ** 2) + s2 * Math.sqrt(b * b) + s3 * Math.abs(-c) === total,
  }
}

/** The consecutive naturals around √n. */
const rootBetween: Form = (rng) => {
  for (;;) {
    const n = int(rng, 5, 400)
    if (isSquare(n)) continue
    const k = Math.floor(Math.sqrt(n))
    return {
      text: `Determinați două numere naturale consecutive între care se află numărul $\\sqrt{${n}}$.`,
      solution: lines(
        `Căutăm două pătrate perfecte consecutive între care se află ${n}:`,
        show(`${k}^2 = ${k * k} < ${n} < ${(k + 1) ** 2} = ${k + 1}^2`),
        show(`${k} < \\sqrt{${n}} < ${k + 1}`),
      ),
      verify: () => k < Math.sqrt(n) && Math.sqrt(n) < k + 1,
    }
  }
}

/** Which elements of a set are rational and which are not. */
const irrationalSet: Form = (rng) => {
  for (;;) {
    const k = int(rng, 2, 15)
    const m = int(rng, 2, 99)
    if (isSquare(m)) continue
    const q = int(rng, 2, 9)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const [d, e] = [int(rng, 0, 5), int(rng, 1, 8)]
    const items: { tex: string; note: string; value: number; rational: boolean }[] = [
      { tex: `\\sqrt{${k * k}}`, note: `\\sqrt{${k * k}} = ${k} \\in \\mathbb{Q}`, value: k, rational: true },
      { tex: `\\sqrt{${m}}`, note: `\\sqrt{${m}} \\notin \\mathbb{Q}`, value: Math.sqrt(m), rational: false },
      { tex: `-\\frac{${p}}{${q}}`, note: `-\\frac{${p}}{${q}} \\in \\mathbb{Q}`, value: -p / q, rational: true },
      { tex: `${d}{,}(${e})`, note: `${d}{,}(${e}) = ${frac(9 * d + e, 9)} \\in \\mathbb{Q}`, value: d + e / 9, rational: true },
    ]
    if (rng() < 0.5) {
      const [c, s] = [int(rng, 2, 5), pick(rng, [2, 3, 5, 7])]
      if (c * c * s === m) continue
      items.push({ tex: `${c}\\sqrt{${s}}`, note: `${c}\\sqrt{${s}} \\notin \\mathbb{Q}`, value: c * Math.sqrt(s), rational: false })
    } else {
      const v = int(rng, 2, 7)
      const u = int(rng, 1, 9)
      if (gcd(u, v) !== 1 || u === v) continue
      items.push({ tex: `\\sqrt{\\frac{${u * u}}{${v * v}}}`, note: `\\sqrt{\\frac{${u * u}}{${v * v}}} = \\frac{${u}}{${v}} \\in \\mathbb{Q}`, value: u / v, rational: true })
    }
    const all = shuffle(rng, items)
    const rat = all.filter((x) => x.rational)
    const irr = all.filter((x) => !x.rational)
    const looksRational = (v: number) => Array.from({ length: 90 }, (_, i) => i + 1).some((den) => Math.abs(v * den - Math.round(v * den)) < 1e-9)
    return {
      text: `Se consideră mulțimea $A = \\left\\{${all.map((x) => x.tex).join(';\\ ')}\\right\\}$. Scrieți elementele mulțimii $A \\cap \\mathbb{Q}$ și elementele mulțimii $A \\setminus \\mathbb{Q}$.`,
      solution: lines(
        'Un număr este rațional dacă se poate scrie ca fracție (în particular, fracțiile zecimale periodice sunt numere raționale). Radicalul unui număr natural care nu este pătrat perfect este un număr irațional.',
        ...all.map((x) => show(x.note)),
        show(`A \\cap \\mathbb{Q} = \\left\\{${rat.map((x) => x.tex).join(';\\ ')}\\right\\}, \\qquad A \\setminus \\mathbb{Q} = \\left\\{${irr.map((x) => x.tex).join(';\\ ')}\\right\\}`),
      ),
      verify: () => all.every((x) => looksRational(x.value) === x.rational) && rat.length + irr.length === 5,
    }
  }
}

/** The arithmetic and the geometric mean of k·m² and k·n². */
const geometricMean: Form = (rng) => {
  for (;;) {
    const k = int(rng, 1, 6)
    const [m, n] = [int(rng, 1, 6), int(rng, 1, 6)]
    if (m === n) continue
    const [a, b] = [k * m * m, k * n * n]
    const g = k * m * n
    return {
      text: `Calculați media aritmetică și media geometrică a numerelor $a = ${a}$ și $b = ${b}$.`,
      solution: lines(
        show(`m_a = \\frac{a + b}{2} = \\frac{${a} + ${b}}{2} = ${dec((a + b) / 2)}`),
        show(`m_g = \\sqrt{a \\cdot b} = \\sqrt{${a} \\cdot ${b}} = \\sqrt{${a * b}} = ${g}`),
      ),
      verify: () => g * g === a * b && g > 0,
    }
  }
}

/** |a − √n| + |√n − b|, with a and b near √n. */
const absSurd: Form = (rng) => {
  for (;;) {
    const n = pick(rng, SQF)
    const f = Math.floor(Math.sqrt(n))
    const a = int(rng, Math.max(1, f - 2), f + 3)
    const b = int(rng, Math.max(1, f - 2), f + 3)
    if (a === b) continue
    const s1 = a > Math.sqrt(n) ? 1 : -1 // |a − √n| = s1(a − √n)
    const s2 = Math.sqrt(n) > b ? 1 : -1 // |√n − b| = s2(√n − b)
    const r = `\\sqrt{${n}}`
    const t1 = s1 > 0 ? `${a} - ${r}` : `${r} - ${a}`
    const t2 = s2 > 0 ? `${r} - ${b}` : `${b} - ${r}`
    const result = sum([[s2 - s1, r], [s1 * a - s2 * b, '']])
    return {
      text: `Calculați: $|${a} - ${r}| + |${r} - ${b}|$.`,
      solution: lines(
        `Comparăm numerele ${a} și ${b} cu $${r}$, comparând pătratele lor cu ${n}:`,
        show(`${a}^2 = ${a * a} ${a * a < n ? '<' : '>'} ${n} \\Rightarrow ${a} ${a * a < n ? '<' : '>'} ${r}, \\qquad ${b}^2 = ${b * b} ${b * b < n ? '<' : '>'} ${n} \\Rightarrow ${b} ${b * b < n ? '<' : '>'} ${r}`),
        'Modulul unui număr negativ este opusul lui:',
        show(`|${a} - ${r}| = ${t1}, \\qquad |${r} - ${b}| = ${t2}`),
        show(`(${t1}) + (${t2}) = ${result}`),
      ),
      verify: () => Math.abs(Math.abs(a - Math.sqrt(n)) + Math.abs(Math.sqrt(n) - b) - ((s2 - s1) * Math.sqrt(n) + s1 * a - s2 * b)) < 1e-9,
    }
  }
}

/** [√n] + [−a,d] + [c,e]. */
const integerPart: Form = (rng) => {
  for (;;) {
    const n = int(rng, 5, 200)
    if (isSquare(n)) continue
    const k = Math.floor(Math.sqrt(n))
    const [a, d] = [int(rng, 1, 9), int(rng, 1, 9)]
    const [c, e] = [int(rng, 1, 9), int(rng, 1, 9)]
    const total = k - (a + 1) + c
    return {
      text: `Calculați $[\\sqrt{${n}}] + [-${a}{,}${d}] + [${c}{,}${e}]$, unde $[x]$ este partea întreagă a numărului real $x$.`,
      solution: lines(
        'Partea întreagă a lui $x$ este cel mai mare număr întreg mai mic sau egal cu $x$.',
        show(`${k * k} < ${n} < ${(k + 1) ** 2} \\Rightarrow ${k} < \\sqrt{${n}} < ${k + 1} \\Rightarrow [\\sqrt{${n}}] = ${k}`),
        show(`-${a + 1} < -${a}{,}${d} < -${a} \\Rightarrow [-${a}{,}${d}] = -${a + 1}`),
        show(`${c} < ${c}{,}${e} < ${c + 1} \\Rightarrow [${c}{,}${e}] = ${c}`),
        show(`${k} + (-${a + 1}) + ${c} = ${total}`),
      ),
      verify: () => Math.floor(Math.sqrt(n)) + Math.floor(-(a + d / 10)) + Math.floor(c + e / 10) === total,
    }
  }
}

/** The mean of the marks of a class: a weighted arithmetic mean. */
const weightedMean: Form = (rng) => {
  for (;;) {
    const ns = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 9)]
    const gs = shuffle(rng, [4, 5, 6, 7, 8, 9, 10]).slice(0, 3).sort((u, v) => u - v)
    const N = ns[0] + ns[1] + ns[2]
    const S = ns[0] * gs[0] + ns[1] * gs[1] + ns[2] * gs[2]
    if ((100 * S) % N !== 0) continue
    const where = pick(rng, ['La un test de matematică', 'La o lucrare scrisă', 'La teza de matematică', 'La un test de geometrie', 'La o lucrare de algebră'])
    return {
      text: `${where}, ${ns[0]} elevi au obținut nota ${gs[0]}, ${ns[1]} elevi nota ${gs[1]} și ${ns[2]} elevi nota ${gs[2]}. Calculați media notelor obținute.`,
      solution: lines(
        'Media este media aritmetică ponderată a notelor, ponderile fiind numerele de elevi:',
        show(`m = \\frac{${gs[0]} \\cdot ${ns[0]} + ${gs[1]} \\cdot ${ns[1]} + ${gs[2]} \\cdot ${ns[2]}}{${ns[0]} + ${ns[1]} + ${ns[2]}} = \\frac{${S}}{${N}} = ${dec(S / N)}`),
      ),
      verify: () => Math.abs(S / N - Math.round((S / N) * 100) / 100) < 1e-9 && S / N > gs[0] && S / N < gs[2],
    }
  }
}

/** √((√m − a)²) + √((b − √n)²) + |√m − √n|. */
const absThree: Form = (rng) => {
  for (;;) {
    const [m, n] = shuffle(rng, SQF).slice(0, 2).sort((u, v) => u - v)
    const [fm, fn] = [Math.floor(Math.sqrt(m)), Math.floor(Math.sqrt(n))]
    const a = int(rng, Math.max(1, fm - 1), fm + 2)
    const b = int(rng, Math.max(1, fn - 1), fn + 2)
    const s1 = Math.sqrt(m) > a ? 1 : -1 // |√m − a| = s1(√m − a)
    const s2 = b > Math.sqrt(n) ? 1 : -1 // |b − √n| = s2(b − √n)
    const [rm, rn] = [`\\sqrt{${m}}`, `\\sqrt{${n}}`]
    const t1 = s1 > 0 ? `${rm} - ${a}` : `${a} - ${rm}`
    const t2 = s2 > 0 ? `${b} - ${rn}` : `${rn} - ${b}`
    const [cm_, cn_, c0] = [s1 - 1, 1 - s2, s2 * b - s1 * a]
    const result = sum([[cn_, rn], [cm_, rm], [c0, '']])
    const rel = (x: number, y: number) => (x < y ? '<' : '>')
    return {
      text: `Calculați: $\\sqrt{(${rm} - ${a})^2} + \\sqrt{(${b} - ${rn})^2} + |${rm} - ${rn}|$.`,
      solution: lines(
        'Pentru orice număr real $x$, $\\sqrt{x^2} = |x|$, deci numărul este egal cu:',
        show(`|${rm} - ${a}| + |${b} - ${rn}| + |${rm} - ${rn}|`),
        'Comparăm numerele din fiecare modul:',
        show(`${a}^2 = ${a * a} ${rel(a * a, m)} ${m} \\Rightarrow ${a} ${rel(a * a, m)} ${rm}, \\qquad ${b}^2 = ${b * b} ${rel(b * b, n)} ${n} \\Rightarrow ${b} ${rel(b * b, n)} ${rn}, \\qquad ${rm} < ${rn}`),
        show(`|${rm} - ${a}| = ${t1}, \\qquad |${b} - ${rn}| = ${t2}, \\qquad |${rm} - ${rn}| = ${rn} - ${rm}`),
        show(`(${t1}) + (${t2}) + (${rn} - ${rm}) = ${result}`),
      ),
      verify: () => {
        const value = Math.sqrt((Math.sqrt(m) - a) ** 2) + Math.sqrt((b - Math.sqrt(n)) ** 2) + Math.abs(Math.sqrt(m) - Math.sqrt(n))
        return Math.abs(value - (cm_ * Math.sqrt(m) + cn_ * Math.sqrt(n) + c0)) < 1e-9
      },
    }
  }
}

/** The means of p + √q and p − √q, with p² − q a perfect square. */
const conjugateMeans: Form = (rng) => {
  for (;;) {
    const p = int(rng, 2, 14)
    const k = int(rng, 1, p - 1)
    const q = p * p - k * k
    if (isSquare(q)) continue
    const r = root(q)
    return {
      text: `Se consideră numerele $a = ${p} + ${r}$ și $b = ${p} - ${r}$. Calculați media aritmetică și media geometrică a numerelor $a$ și $b$, apoi comparați cele două medii.`,
      solution: lines(
        show(`m_a = \\frac{a + b}{2} = \\frac{${p} + ${r} + ${p} - ${r}}{2} = \\frac{${2 * p}}{2} = ${p}`),
        'Pentru produs folosim formula $(x + y)(x - y) = x^2 - y^2$:',
        show(`a \\cdot b = (${p} + ${r})(${p} - ${r}) = ${p}^2 - (${r})^2 = ${p * p} - ${q} = ${k * k}`),
        show(`m_g = \\sqrt{a \\cdot b} = \\sqrt{${k * k}} = ${k}`),
        `Cum $${k} < ${p}$, avem $m_g < m_a$.`,
      ),
      verify: () => Math.abs(Math.sqrt((p + Math.sqrt(q)) * (p - Math.sqrt(q))) - k) < 1e-9 && k < p,
    }
  }
}

/** The weighted mean is known: find one of the numbers. */
const weightedMissing: Form = (rng) => {
  for (;;) {
    const [a, b, x] = [int(rng, 2, 20), int(rng, 2, 20), int(rng, 2, 20)]
    const [p, q, r] = [int(rng, 2, 6), int(rng, 2, 6), int(rng, 2, 6)]
    if (a === b || x === a || x === b) continue
    const N = p + q + r
    const S = a * p + b * q + x * r
    if (S % N !== 0) continue
    const M = S / N
    return {
      text: `Media aritmetică ponderată a numerelor ${a}, ${b} și $x$, cu ponderile ${p}, ${q}, respectiv ${r}, este egală cu ${M}. Aflați numărul $x$.`,
      solution: lines(
        'Scriem media aritmetică ponderată:',
        show(`\\frac{${a} \\cdot ${p} + ${b} \\cdot ${q} + x \\cdot ${r}}{${p} + ${q} + ${r}} = ${M} \\Rightarrow \\frac{${a * p + b * q} + ${r}x}{${N}} = ${M}`),
        show(`${a * p + b * q} + ${r}x = ${M * N} \\Rightarrow ${r}x = ${M * N - a * p - b * q} \\Rightarrow x = ${x}`),
      ),
      verify: () => (a * p + b * q + x * r) / (p + q + r) === M,
    }
  }
}

// ───────────────────────────── 2. Algebraic calculation ─────────────────────────────

/** ax + by + c + a'x + b'y + c', reduced. */
const likeTerms: Form = (rng) => {
  for (;;) {
    const [x, y] = pick(rng, [['x', 'y'], ['a', 'b'], ['m', 'n'], ['x', 'z']] as const)
    const [a1, a2, b1, b2, c1, c2] = Array.from({ length: 6 }, () => nonZero(rng, -9, 9))
    if (a1 + a2 === 0 || b1 + b2 === 0) continue
    const result = poly([[a1 + a2, x], [b1 + b2, y], [c1 + c2, '']])
    return {
      text: `Reduceți termenii asemenea: $${poly([[a1, x], [b1, y], [c1, ''], [a2, x], [b2, y], [c2, '']])}$.`,
      solution: lines(
        'Grupăm termenii asemenea:',
        show(`(${poly([[a1, x], [a2, x]])}) + (${poly([[b1, y], [b2, y]])}) + (${poly([[c1, ''], [c2, '']])}) = ${result}`),
      ),
      verify: () => [[2, 3], [-1, 5]].every(([u, v]) => a1 * u + b1 * v + c1 + a2 * u + b2 * v + c2 === (a1 + a2) * u + (b1 + b2) * v + c1 + c2),
    }
  }
}

/** (ax ± b)². */
const squareBinomial: Form = (rng) => {
  const a = int(rng, 1, 6)
  const b = int(rng, 1, 12)
  const s = pick(rng, [1, -1])
  const ax = `${coef(a)}x`
  return {
    text: `Calculați, folosind formulele de calcul prescurtat: $(${ax} ${op(s)} ${b})^2$.`,
    solution: lines(
      `Folosim formula $(a ${op(s)} b)^2 = a^2 ${op(s)} 2ab + b^2$:`,
      show(`(${ax} ${op(s)} ${b})^2 = ${a === 1 ? 'x^2' : `(${ax})^2`} ${op(s)} 2 \\cdot ${ax} \\cdot ${b} + ${b}^2 = ${poly([[a * a, 'x^2'], [2 * a * b * s, 'x'], [b * b, '']])}`),
    ),
    verify: () => [1, -2, 3].every((x) => (a * x + s * b) ** 2 === a * a * x * x + 2 * a * b * s * x + b * b),
  }
}

/** (ax + b)(ax − b). */
const sumDiffProduct: Form = (rng) => {
  const a = int(rng, 1, 9)
  const b = int(rng, 1, 12)
  const ax = `${coef(a)}x`
  const first = rng() < 0.5
  return {
    text: `Calculați, folosind formulele de calcul prescurtat: $(${ax} ${first ? '+' : '-'} ${b})(${ax} ${first ? '-' : '+'} ${b})$.`,
    solution: lines(
      'Folosim formula $(a + b)(a - b) = a^2 - b^2$:',
      show(`(${ax} ${first ? '+' : '-'} ${b})(${ax} ${first ? '-' : '+'} ${b}) = ${a === 1 ? 'x^2' : `(${ax})^2`} - ${b}^2 = ${poly([[a * a, 'x^2'], [-b * b, '']])}`),
    ),
    verify: () => [1, -2, 3].every((x) => (a * x + b) * (a * x - b) === a * a * x * x - b * b),
  }
}

/** (x + a)(x + b) − x(x + c). */
const expandReduce: Form = (rng) => {
  for (;;) {
    const [a, b, c] = [nonZero(rng, -9, 9), nonZero(rng, -9, 9), nonZero(rng, -9, 9)]
    if (a + b - c === 0) continue
    const result = poly([[a + b - c, 'x'], [a * b, '']])
    return {
      text: `Efectuați calculele și reduceți termenii asemenea: $(${plus('x', a)})(${plus('x', b)}) - x(${plus('x', c)})$.`,
      solution: lines(
        'Înmulțim fiecare termen din prima paranteză cu fiecare termen din a doua:',
        show(`(${plus('x', a)})(${plus('x', b)}) = ${poly([[1, 'x^2'], [b, 'x'], [a, 'x'], [a * b, '']])} = ${poly([[1, 'x^2'], [a + b, 'x'], [a * b, '']])}`),
        show(`x(${plus('x', c)}) = ${poly([[1, 'x^2'], [c, 'x']])}`),
        'Scădem, schimbând semnele termenilor din a doua expresie:',
        show(`${poly([[1, 'x^2'], [a + b, 'x'], [a * b, ''], [-1, 'x^2'], [-c, 'x']])} = ${result}`),
      ),
      verify: () => [2, -3, 5].every((x) => (x + a) * (x + b) - x * (x + c) === (a + b - c) * x + a * b),
    }
  }
}

/** E(x) = (x + a)² − (x − b)(x + b) = 2ax + a² + b², then its value at a point. */
const expressionValue: Form = (rng) => {
  for (;;) {
    const a = nonZero(rng, -6, 6)
    const b = int(rng, 1, 7)
    const q = pick(rng, [1, 1, 2])
    const p = nonZero(rng, -7, 7)
    if (q === 2 && p % 2 === 0) continue
    const v = frac(p, q)
    const c = a * a + b * b
    const value = (2 * a * p) / q + c
    const reduced = poly([[2 * a, 'x'], [c, '']])
    const at = p < 0 ? `\\left(${v}\\right)` : v
    return {
      text: `Se consideră expresia $E(x) = (${plus('x', a)})^2 - (${plus('x', -b)})(${plus('x', b)})$. Arătați că $E(x) = ${reduced}$, apoi calculați $E\\left(${v}\\right)$.`,
      solution: lines(
        'Folosim formulele de calcul prescurtat:',
        show(`(${plus('x', a)})^2 = ${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])}, \\qquad (${plus('x', -b)})(${plus('x', b)}) = x^2 - ${b * b}`),
        show(`E(x) = ${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])} - x^2 + ${b * b} = ${reduced}`),
        show(`E\\left(${v}\\right) = ${2 * a} \\cdot ${at} + ${c} = ${plus(String((2 * a * p) / q), c)} = ${value}`),
      ),
      verify: () => Math.abs((p / q + a) ** 2 - (p / q - b) * (p / q + b) - value) < 1e-9 && Number.isInteger(value),
    }
  }
}

/** (a√q ± b)². */
const radicalSquare: Form = (rng) => {
  const a = int(rng, 1, 5)
  const q = pick(rng, [2, 3, 5, 6, 7])
  const b = int(rng, 1, 9)
  const s = pick(rng, [1, -1])
  const t = `${coef(a)}\\sqrt{${q}}`
  const rational = a * a * q + b * b
  return {
    text: `Calculați: $(${t} ${op(s)} ${b})^2$.`,
    solution: lines(
      `Folosim formula $(a ${op(s)} b)^2 = a^2 ${op(s)} 2ab + b^2$:`,
      show(`(${t} ${op(s)} ${b})^2 = (${t})^2 ${op(s)} 2 \\cdot ${t} \\cdot ${b} + ${b}^2 = ${a * a * q} ${op(s)} ${2 * a * b}\\sqrt{${q}} + ${b * b} = ${rational} ${op(s)} ${2 * a * b}\\sqrt{${q}}`),
    ),
    verify: () => Math.abs((a * Math.sqrt(q) + s * b) ** 2 - (rational + s * 2 * a * b * Math.sqrt(q))) < 1e-9,
  }
}

/** a² − b² with a + b a round number. */
const numericDifference: Form = (rng) => {
  for (;;) {
    const s = pick(rng, [50, 100, 100, 200, 1000])
    const d = 2 * int(rng, 1, 24)
    if (d >= s) continue
    const [a, b] = [(s + d) / 2, (s - d) / 2]
    return {
      text: `Calculați, folosind formulele de calcul prescurtat: $${a}^2 - ${b}^2$.`,
      solution: lines(
        'Folosim formula $a^2 - b^2 = (a - b)(a + b)$:',
        show(`${a}^2 - ${b}^2 = (${a} - ${b})(${a} + ${b}) = ${d} \\cdot ${s} = ${d * s}`),
      ),
      verify: () => a * a - b * b === d * s,
    }
  }
}

/** (x + a)² + (x − a)² − 2(x − b)(x + b) = 2a² + 2b². */
const showConstant: Form = (rng) => {
  const a = int(rng, 1, 12)
  const b = int(rng, 1, 12)
  const value = 2 * a * a + 2 * b * b
  return {
    text: `Arătați că valoarea expresiei $E(x) = (x + ${a})^2 + (x - ${a})^2 - 2(x - ${b})(x + ${b})$ nu depinde de $x$.`,
    solution: lines(
      'Folosim formulele de calcul prescurtat:',
      show(`(x + ${a})^2 = x^2 + ${2 * a}x + ${a * a}, \\qquad (x - ${a})^2 = x^2 - ${2 * a}x + ${a * a}, \\qquad (x - ${b})(x + ${b}) = x^2 - ${b * b}`),
      show(`E(x) = x^2 + ${2 * a}x + ${a * a} + x^2 - ${2 * a}x + ${a * a} - 2x^2 + ${2 * b * b} = ${value}`),
      `Deci $E(x) = ${value}$ pentru orice număr real $x$.`,
    ),
    verify: () => [0, 1, -3, 2.5].every((x) => Math.abs((x + a) ** 2 + (x - a) ** 2 - 2 * (x - b) * (x + b) - value) < 1e-9),
  }
}

/** From a + b and ab: a² + b² and (a − b)². */
const sumProductSquares: Form = (rng) => {
  for (;;) {
    const [u, v] = [nonZero(rng, -9, 12), nonZero(rng, -9, 12)]
    if (u === v || u + v === 0) continue
    const [s, p] = [u + v, u * v]
    const sq = s * s - 2 * p
    return {
      text: `Numerele reale $a$ și $b$ verifică relațiile $a + b = ${s}$ și $ab = ${p}$. Calculați $a^2 + b^2$ și $(a - b)^2$.`,
      solution: lines(
        'Din $(a + b)^2 = a^2 + 2ab + b^2$ rezultă:',
        show(`a^2 + b^2 = (a + b)^2 - 2ab = ${paren(s)}^2 - 2 \\cdot ${paren(p)} = ${s * s} ${op(-p)} ${Math.abs(2 * p)} = ${sq}`),
        show(`(a - b)^2 = a^2 + b^2 - 2ab = ${sq} - 2 \\cdot ${paren(p)} = ${sq - 2 * p}`),
      ),
      verify: () => u * u + v * v === sq && (u - v) ** 2 === sq - 2 * p,
    }
  }
}

/** From x ± 1/x: x² + 1/x². */
const reciprocalSquares: Form = (rng) => {
  const k = int(rng, 2, 40)
  const s = pick(rng, [1, -1])
  const value = k * k - 2 * s
  return {
    text: `Știind că $x ${op(s)} \\frac{1}{x} = ${k}$, unde $x$ este un număr real nenul, calculați $x^2 + \\frac{1}{x^2}$.`,
    solution: lines(
      'Ridicăm relația la pătrat:',
      show(`\\left(x ${op(s)} \\frac{1}{x}\\right)^2 = x^2 ${op(s)} 2 \\cdot x \\cdot \\frac{1}{x} + \\frac{1}{x^2} = x^2 + \\frac{1}{x^2} ${op(s)} 2`),
      show(`x^2 + \\frac{1}{x^2} ${op(s)} 2 = ${k}^2 = ${k * k} \\Rightarrow x^2 + \\frac{1}{x^2} = ${k * k} ${op(-s)} 2 = ${value}`),
    ),
    verify: () => {
      const x = (k + Math.sqrt(k * k - 4 * s)) / 2 // a root of x² − kx ± 1 = 0
      return Math.abs(x + s / x - k) < 1e-9 && Math.abs(x * x + 1 / (x * x) - value) < 1e-6
    },
  }
}

// ───────────────────────────── 3. Equations and systems ─────────────────────────────

/** x² = a, with a a square, a fraction of squares or neither. */
const squareEquals: Form = (rng) => {
  for (;;) {
    const kind = int(rng, 0, 2)
    if (kind === 2) {
      const [p, q] = [int(rng, 1, 12), int(rng, 2, 9)]
      if (gcd(p, q) !== 1) continue
      return {
        text: `Rezolvați în $\\mathbb{R}$ ecuația $x^2 = \\frac{${p * p}}{${q * q}}$.`,
        solution: lines(
          show(`x^2 = \\frac{${p * p}}{${q * q}} \\Rightarrow x = \\pm\\sqrt{\\frac{${p * p}}{${q * q}}} = \\pm\\frac{${p}}{${q}}`),
          show(`S = \\left\\{-\\frac{${p}}{${q}};\\ \\frac{${p}}{${q}}\\right\\}`),
        ),
        verify: () => Math.abs((p / q) ** 2 - (p * p) / (q * q)) < 1e-12,
      }
    }
    const a = kind === 0 ? int(rng, 2, 25) ** 2 : int(rng, 2, 150)
    if (kind === 1 && isSquare(a)) continue
    const r = root(a)
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $x^2 = ${a}$.`,
      solution: lines(
        show(`x^2 = ${a} \\Rightarrow x = \\pm\\sqrt{${a}}${r === `\\sqrt{${a}}` ? '' : ` = \\pm ${r}`}`),
        show(`S = \\{-${r};\\ ${r}\\}`),
      ),
      verify: () => {
        const [k, m] = rootParts(a)
        return k * k * m === a
      },
    }
  }
}

/** "If we add b to the triple of a number, we get c." */
const numberWord: Form = (rng) => {
  const [word, k] = pick(rng, [['dublul', 2], ['triplul', 3], ['împătritul', 4], ['încincitul', 5]] as const)
  const x = int(rng, 2, 40)
  const b = int(rng, 2, 30)
  const add = rng() < 0.5 || k * x - b <= 0
  const c = add ? k * x + b : k * x - b
  return {
    text: add
      ? `Dacă la ${word} unui număr adunăm ${b}, obținem ${c}. Aflați numărul.`
      : `Dacă din ${word} unui număr scădem ${b}, obținem ${c}. Aflați numărul.`,
    solution: lines(
      'Notăm numărul cu $x$ și scriem ecuația:',
      show(`${k}x ${add ? '+' : '-'} ${b} = ${c} \\Rightarrow ${k}x = ${c} ${add ? '-' : '+'} ${b} = ${k * x} \\Rightarrow x = ${k * x} : ${k} = ${x}`),
    ),
    verify: () => (add ? k * x + b : k * x - b) === c,
  }
}

/** x + y = s, x − y = d. */
const systemSumDiff: Form = (rng) => {
  for (;;) {
    const [x, y] = [int(rng, -9, 20), int(rng, -9, 20)]
    if (y === 0 || x === 0 || x === y || x === -y) continue
    const [s, d] = [x + y, x - y]
    return {
      text: `Rezolvați sistemul de ecuații: $\\begin{cases} x + y = ${s} \\\\ x - y = ${d} \\end{cases}$`,
      solution: lines(
        'Adunăm cele două ecuații; termenii cu $y$ se reduc:',
        show(`2x = ${s} + ${paren(d)} = ${s + d} \\Rightarrow x = ${x}`),
        'Înlocuim în prima ecuație:',
        show(`${x} + y = ${s} \\Rightarrow y = ${s} - ${paren(x)} = ${y}`),
        show(`S = \\{(${x};\\ ${y})\\}`),
      ),
      verify: () => x + y === s && x - y === d,
    }
  }
}

/** (x + a)² = k². */
const squareShifted: Form = (rng) => {
  const a = nonZero(rng, -12, 12)
  const k = int(rng, 1, 15)
  const [x1, x2] = [-k - a, k - a]
  return {
    text: `Rezolvați în $\\mathbb{R}$ ecuația $(${plus('x', a)})^2 = ${k * k}$.`,
    solution: lines(
      `Un pătrat este egal cu ${k * k} dacă baza lui este ${k} sau $-${k}$:`,
      show(`${plus('x', a)} = ${k} \\Rightarrow x = ${x2} \\qquad \\text{sau} \\qquad ${plus('x', a)} = -${k} \\Rightarrow x = ${x1}`),
      show(`S = \\{${x1};\\ ${x2}\\}`),
    ),
    verify: () => (x1 + a) ** 2 === k * k && (x2 + a) ** 2 === k * k && x1 !== x2,
  }
}

/** ax² ± b = c. */
const squareScaled: Form = (rng) => {
  const a = int(rng, 2, 7)
  const m = rng() < 0.5 ? int(rng, 2, 12) ** 2 : int(rng, 2, 60)
  const b = int(rng, 1, 30)
  const s = pick(rng, [1, -1])
  const c = a * m + s * b
  const r = root(m)
  return {
    text: `Rezolvați în $\\mathbb{R}$ ecuația $${a}x^2 ${op(s)} ${b} = ${c}$.`,
    solution: lines(
      show(`${a}x^2 = ${c} ${op(-s)} ${b} = ${a * m} \\Rightarrow x^2 = ${a * m} : ${a} = ${m}`),
      show(`x = \\pm\\sqrt{${m}}${r === `\\sqrt{${m}}` ? '' : ` = \\pm ${r}`}, \\qquad S = \\{-${r};\\ ${r}\\}`),
    ),
    verify: () => Math.abs(a * Math.sqrt(m) ** 2 + s * b - c) < 1e-9,
  }
}

/** (ax + b)/c = (dx + e)/f, with a whole solution. */
const crossFraction: Form = (rng) => {
  for (;;) {
    const [c, f] = [int(rng, 2, 7), int(rng, 2, 7)]
    const [a, d] = [int(rng, 1, 4), int(rng, 1, 4)]
    const x0 = nonZero(rng, -9, 9)
    const t = int(rng, -5, 5)
    const b = c * t - a * x0
    const e = f * t - d * x0
    const k = a * f - c * d
    if (c === f || k === 0 || b === 0 || e === 0 || Math.abs(b) > 20 || Math.abs(e) > 20) continue
    const [left, right] = [poly([[a, 'x'], [b, '']]), poly([[d, 'x'], [e, '']])]
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $\\frac{${left}}{${c}} = \\frac{${right}}{${f}}$.`,
      solution: lines(
        'Într-o proporție, produsul mezilor este egal cu produsul extremilor:',
        show(`${f}(${left}) = ${c}(${right}) \\Rightarrow ${poly([[a * f, 'x'], [b * f, '']])} = ${poly([[c * d, 'x'], [c * e, '']])}`),
        show(`${poly([[a * f, 'x'], [-c * d, 'x']])} = ${poly([[c * e, ''], [-b * f, '']])} \\Rightarrow ${poly([[k, 'x']])} = ${c * e - b * f} \\Rightarrow x = ${x0}`),
        show(`S = \\{${x0}\\}`),
      ),
      verify: () => f * (a * x0 + b) === c * (d * x0 + e) && k * x0 === c * e - b * f,
    }
  }
}

/** y = kx + m and ax + by = c, by substitution. */
const substitutionSystem: Form = (rng) => {
  for (;;) {
    const k = nonZero(rng, -4, 4)
    const m = nonZero(rng, -9, 9)
    const a = int(rng, 1, 5)
    const b = nonZero(rng, -4, 4)
    const x0 = int(rng, -6, 6)
    const y0 = k * x0 + m
    const c = a * x0 + b * y0
    if (a + b * k === 0 || y0 === 0) continue
    const line = poly([[k, 'x'], [m, '']])
    return {
      text: `Rezolvați, prin metoda substituției, sistemul de ecuații: $\\begin{cases} y = ${line} \\\\ ${poly([[a, 'x'], [b, 'y']])} = ${c} \\end{cases}$`,
      solution: lines(
        'Înlocuim $y$ din prima ecuație în a doua:',
        show(`${poly([[a, 'x']])} ${op(b)} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(${line}) = ${c} \\Rightarrow ${poly([[a, 'x'], [b * k, 'x'], [b * m, '']])} = ${c}`),
        show(`${poly([[a + b * k, 'x']])} = ${c - b * m} \\Rightarrow x = ${x0}`),
        show(`y = ${k === 1 ? '' : k === -1 ? '-' : `${k} \\cdot `}${k === 1 ? x0 : paren(x0)} ${op(m)} ${Math.abs(m)} = ${y0}`),
        show(`S = \\{(${x0};\\ ${y0})\\}`),
      ),
      verify: () => y0 === k * x0 + m && a * x0 + b * y0 === c && (a + b * k) * x0 === c - b * m,
    }
  }
}

/** The sum of two naturals, and the quotient and the remainder of their division. */
const quotientRemainder: Form = (rng) => {
  const n = int(rng, 5, 40)
  const q = int(rng, 2, 9)
  const r = int(rng, 1, n - 1)
  const big = q * n + r
  const S = big + n
  return {
    text: `Suma a două numere naturale este ${S}. Împărțind numărul mai mare la cel mai mic, obținem câtul ${q} și restul ${r}. Aflați cele două numere.`,
    solution: lines(
      'Notăm cu $a$ numărul mai mare și cu $b$ numărul mai mic. Din teorema împărțirii cu rest:',
      show(`\\begin{cases} a + b = ${S} \\\\ a = ${q}b + ${r} \\end{cases}`),
      'Înlocuim $a$ în prima ecuație:',
      show(`${q}b + ${r} + b = ${S} \\Rightarrow ${q + 1}b = ${S - r} \\Rightarrow b = ${n}`),
      show(`a = ${q} \\cdot ${n} + ${r} = ${big}`),
      `Restul ${r} este mai mic decât împărțitorul ${n}, deci numerele sunt ${big} și ${n}.`,
    ),
    verify: () => big + n === S && Math.floor(big / n) === q && big % n === r,
  }
}

const FAMILY = [
  { adult: 'Un tată', the: 'tatăl', The: 'Tatăl', child: 'fiului său', childThe: 'fiul', childOf: 'fiului', lo: 24, hi: 60 },
  { adult: 'O mamă', the: 'mama', The: 'Mama', child: 'fiicei sale', childThe: 'fiica', childOf: 'fiicei', lo: 24, hi: 60 },
  { adult: 'Un bunic', the: 'bunicul', The: 'Bunicul', child: 'nepotului său', childThe: 'nepotul', childOf: 'nepotului', lo: 50, hi: 84 },
  { adult: 'O bunică', the: 'bunica', The: 'Bunica', child: 'nepoatei sale', childThe: 'nepoata', childOf: 'nepoatei', lo: 50, hi: 84 },
]

/** Now k times as old; in n years, m times as old. */
const agesProblem: Form = (rng) => {
  for (;;) {
    const who = pick(rng, FAMILY)
    const f = int(rng, 3, 15)
    const k = int(rng, 3, 12)
    const m = int(rng, 2, k - 1)
    const n = (f * (k - m)) / (m - 1)
    if (!Number.isInteger(n) || n < 2 || n > 30 || k * f < who.lo || k * f > who.hi) continue
    return {
      text: `${who.adult} are acum de ${k} ori vârsta ${who.child}. Peste ${de(n)} ani, ${who.the} va avea de ${m} ori vârsta ${who.childOf}. Ce vârstă are fiecare acum?`,
      solution: lines(
        `Notăm cu $x$ vârsta de acum a ${who.childOf}; ${who.the} are $${k}x$ ani. Peste ${de(n)} ani, vârstele vor fi $x + ${n}$ și $${k}x + ${n}$:`,
        show(`${k}x + ${n} = ${m}(x + ${n}) \\Rightarrow ${k}x + ${n} = ${m}x + ${m * n}`),
        show(`${k - m === 1 ? '' : k - m}x = ${m * n - n} \\Rightarrow x = ${f}`),
        `${who.The} are acum ${de(k * f)} ani, iar ${who.childThe} are ${de(f)} ani.`,
      ),
      verify: () => k * f + n === m * (f + n),
    }
  }
}

/** (x + a)² − x(x + b) = c: the squares of x cancel. */
const squareReducible: Form = (rng) => {
  for (;;) {
    const a = nonZero(rng, -7, 7)
    const b = nonZero(rng, -9, 9)
    const x0 = nonZero(rng, -9, 9)
    const k = 2 * a - b
    if (k === 0) continue
    const c = k * x0 + a * a
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $(${plus('x', a)})^2 - x(${plus('x', b)}) = ${c}$.`,
      solution: lines(
        'Desfacem parantezele, folosind formula pătratului unui binom:',
        show(`${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, ''], [-1, 'x^2'], [-b, 'x']])} = ${c}`),
        'Termenii cu $x^2$ se reduc și rămâne o ecuație de gradul I:',
        show(`${poly([[k, 'x'], [a * a, '']])} = ${c} \\Rightarrow ${poly([[k, 'x']])} = ${c - a * a} \\Rightarrow x = ${x0}`),
        show(`S = \\{${x0}\\}`),
      ),
      verify: () => (x0 + a) ** 2 - x0 * (x0 + b) === c,
    }
  }
}

/** A rectangle that becomes a square when its width grows and its length shrinks. */
const rectangleSystem: Form = (rng) => {
  const l = int(rng, 3, 25)
  const [u, v] = [int(rng, 1, 8), int(rng, 1, 8)]
  const L = l + u + v
  const P = 2 * (L + l)
  return {
    text: `Un dreptunghi are perimetrul de ${P} cm. Dacă mărim lățimea cu ${u} cm și micșorăm lungimea cu ${v} cm, obținem un pătrat. Aflați dimensiunile dreptunghiului.`,
    solution: lines(
      'Notăm cu $L$ lungimea și cu $\\ell$ lățimea dreptunghiului. Semiperimetrul este suma lor, iar laturile pătratului sunt egale:',
      show(`\\begin{cases} L + \\ell = ${P / 2} \\\\ L - ${v} = \\ell + ${u} \\end{cases} \\Rightarrow \\begin{cases} L + \\ell = ${P / 2} \\\\ L - \\ell = ${u + v} \\end{cases}`),
      'Adunăm ecuațiile:',
      show(`2L = ${P / 2 + u + v} \\Rightarrow L = ${L}${cm}, \\qquad \\ell = ${P / 2} - ${L} = ${l}${cm}`),
    ),
    verify: () => 2 * (L + l) === P && L - v === l + u,
  }
}

// ───────────────────────────── 4. Quadrilaterals ─────────────────────────────

/** One angle of a parallelogram gives the others. */
const parallelogramAngles: Form = (rng) => {
  for (;;) {
    const x = int(rng, 20, 160)
    if (x === 90) continue
    const i = int(rng, 0, 3)
    const V = 'ABCD'
    const [given, opposite, n1, n2] = [V[i], V[(i + 2) % 4], V[(i + 1) % 4], V[(i + 3) % 4]]
    return {
      text: `În paralelogramul $ABCD$, $\\angle ${given} = ${x}^\\circ$. Calculați măsurile celorlalte unghiuri ale paralelogramului.`,
      solution: lines(
        'În paralelogram, unghiurile opuse sunt congruente, iar unghiurile alăturate sunt suplementare:',
        show(`\\angle ${opposite} = \\angle ${given} = ${x}^\\circ, \\qquad \\angle ${n1} = \\angle ${n2} = 180^\\circ - ${x}^\\circ = ${180 - x}^\\circ`),
      ),
      verify: () => 2 * x + 2 * (180 - x) === 360,
    }
  }
}

/** The midline of a trapezoid from its bases. */
const trapezoidMidline: Form = (rng) => {
  const b = int(rng, 2, 30)
  const B = b + int(rng, 1, 30)
  return {
    text: `Trapezul $ABCD$ cu $AB \\parallel CD$ are $AB = ${B}$ cm și $CD = ${b}$ cm. Calculați lungimea liniei mijlocii a trapezului.`,
    solution: lines(
      'Linia mijlocie a trapezului unește mijloacele laturilor neparalele, este paralelă cu bazele și are lungimea egală cu semisuma lor. Dacă $M$ și $N$ sunt mijloacele laturilor $AD$ și $BC$:',
      show(`MN = \\frac{AB + CD}{2} = \\frac{${B} + ${b}}{2} = ${dec((B + b) / 2)}${cm}`),
    ),
    // the midpoints of the legs of A(0,0), B(B,0), C(3+b,4), D(3,4)
    verify: () => Math.abs((B + 3 + b) / 2 - 3 / 2 - (B + b) / 2) < 1e-9,
  }
}

/** A rectangle: the angle between the diagonals gives the angles they make with the sides. */
const rectangleCenterAngle: Form = (rng) => {
  const u = 2 * int(rng, 10, 80)
  const v = 90 - u / 2
  return {
    text: `Dreptunghiul $ABCD$ are centrul $O$ și $\\angle AOB = ${u}^\\circ$. Calculați măsurile unghiurilor $OAB$ și $OAD$.`,
    solution: lines(
      'Diagonalele dreptunghiului sunt congruente și se înjumătățesc, deci $OA = OB$, iar triunghiul $AOB$ este isoscel:',
      show(`\\angle OAB = \\frac{180^\\circ - ${u}^\\circ}{2} = ${v}^\\circ`),
      'Unghiul $DAB$ este drept:',
      show(`\\angle OAD = 90^\\circ - ${v}^\\circ = ${90 - v}^\\circ`),
    ),
    verify: () => {
      // a rectangle with half-diagonals at the angle u: A and B seen from O
      const t = (u * Math.PI) / 180
      const [ax, ay, bx, by] = [1, 0, Math.cos(t), Math.sin(t)]
      const ang = (px: number, py: number, qx: number, qy: number) => (Math.acos((px * qx + py * qy) / (Math.hypot(px, py) * Math.hypot(qx, qy))) * 180) / Math.PI
      return Math.abs(ang(-ax, -ay, bx - ax, by - ay) - v) < 1e-6
    },
  }
}

/** A parallelogram whose angles differ by d°, or one is k times the other. */
const parallelogramAngleRelation: Form = (rng) => {
  if (rng() < 0.3) {
    const k = pick(rng, [2, 3, 4, 5, 8, 9, 11, 14, 17, 19])
    const b = 180 / (k + 1)
    return {
      text: `În paralelogramul $ABCD$, măsura unghiului $A$ este de ${k} ori mai mare decât măsura unghiului $B$. Calculați măsurile unghiurilor paralelogramului.`,
      solution: lines(
        'Unghiurile alăturate ale paralelogramului sunt suplementare:',
        show(`\\angle A + \\angle B = 180^\\circ \\Rightarrow ${k} \\cdot \\angle B + \\angle B = 180^\\circ \\Rightarrow ${k + 1} \\cdot \\angle B = 180^\\circ \\Rightarrow \\angle B = ${b}^\\circ`),
        show(`\\angle A = ${k} \\cdot ${b}^\\circ = ${k * b}^\\circ`),
        `Unghiurile opuse sunt congruente: $\\angle C = \\angle A = ${k * b}^\\circ$ și $\\angle D = \\angle B = ${b}^\\circ$.`,
      ),
      verify: () => Number.isInteger(b) && k * b + b === 180,
    }
  }
  const d = 2 * int(rng, 2, 80)
  const [a, b] = [90 + d / 2, 90 - d / 2]
  return {
    text: `În paralelogramul $ABCD$, măsura unghiului $A$ este cu $${d}^\\circ$ mai mare decât măsura unghiului $B$. Calculați măsurile unghiurilor paralelogramului.`,
    solution: lines(
      'Unghiurile alăturate ale paralelogramului sunt suplementare:',
      show(`\\begin{cases} \\angle A + \\angle B = 180^\\circ \\\\ \\angle A - \\angle B = ${d}^\\circ \\end{cases} \\Rightarrow 2 \\cdot \\angle A = ${180 + d}^\\circ \\Rightarrow \\angle A = ${a}^\\circ, \\quad \\angle B = ${b}^\\circ`),
      `Unghiurile opuse sunt congruente: $\\angle C = \\angle A = ${a}^\\circ$ și $\\angle D = \\angle B = ${b}^\\circ$.`,
    ),
    verify: () => a + b === 180 && a - b === d && b > 0,
  }
}

/** A rhombus from the angle between a side and a diagonal. */
const rhombusDiagonalAngle: Form = (rng) => {
  for (;;) {
    const x = int(rng, 10, 80)
    if (x === 45) continue
    const [name, at, other] = pick(rng, [['ABD', 'ABC', 'BAD'], ['BAC', 'BAD', 'ABC']] as const)
    const twice = at === 'ABC' ? ['B', 'D', 'A', 'C'] : ['A', 'C', 'B', 'D']
    return {
      text: `În rombul $ABCD$, $\\angle ${name} = ${x}^\\circ$. Calculați măsurile unghiurilor rombului.`,
      solution: lines(
        'Diagonalele rombului sunt bisectoarele unghiurilor lui:',
        show(`\\angle ${at} = 2 \\cdot \\angle ${name} = ${2 * x}^\\circ`),
        'Unghiurile alăturate sunt suplementare, iar cele opuse sunt congruente:',
        show(`\\angle ${other} = 180^\\circ - ${2 * x}^\\circ = ${180 - 2 * x}^\\circ`),
        `Deci $\\angle ${twice[0]} = \\angle ${twice[1]} = ${2 * x}^\\circ$ și $\\angle ${twice[2]} = \\angle ${twice[3]} = ${180 - 2 * x}^\\circ$.`,
      ),
      verify: () => {
        // a rhombus with the angle 2x at the vertex: its diagonal makes the angle x with the side
        const t = (2 * x * Math.PI) / 180
        const [dx, dy] = [1 + Math.cos(t), Math.sin(t)]
        return Math.abs((Math.acos(dx / Math.hypot(dx, dy)) * 180) / Math.PI - x) < 1e-6
      },
    }
  }
}

/** The bases of a trapezoid from its midline and their difference. */
const trapezoidBases: Form = (rng) => {
  const m = int(rng, 6, 40)
  const d = 2 * int(rng, 1, m - 2)
  const [B, b] = [m + d / 2, m - d / 2]
  return {
    text: `În trapezul $ABCD$ cu $AB \\parallel CD$, linia mijlocie are lungimea de ${m} cm, iar baza mare $AB$ este cu ${d} cm mai lungă decât baza mică $CD$. Aflați lungimile bazelor.`,
    solution: lines(
      'Linia mijlocie este semisuma bazelor, deci suma bazelor este dublul ei:',
      show(`\\begin{cases} AB + CD = 2 \\cdot ${m} = ${2 * m} \\\\ AB - CD = ${d} \\end{cases}`),
      'Adunăm ecuațiile:',
      show(`2 \\cdot AB = ${2 * m + d} \\Rightarrow AB = ${B}${cm}, \\qquad CD = ${2 * m} - ${B} = ${b}${cm}`),
    ),
    verify: () => (B + b) / 2 === m && B - b === d && b > 0,
  }
}

/** A rhombus with an angle of 60°: two equilateral triangles. */
const rhombus60: Form = (rng) => {
  const a = int(rng, 2, 60)
  return {
    text: `Rombul $ABCD$ are $AB = ${a}$ cm și $\\angle A = 60^\\circ$. Calculați lungimile diagonalelor rombului.`,
    solution: lines(
      'Triunghiul $ABD$ este isoscel ($AB = AD$) și are un unghi de $60^\\circ$, deci este echilateral:',
      show(`BD = AB = ${a}${cm}`),
      'Fie $O$ punctul de intersecție a diagonalelor. $AO$ este înălțime în triunghiul echilateral $ABD$, iar $O$ este mijlocul lui $AC$:',
      show(`AO = \\frac{AB\\sqrt{3}}{2} = ${surd(a, 2, 3)}${cm}, \\qquad AC = 2 \\cdot AO = ${surd(a, 1, 3)}${cm}`),
    ),
    verify: () => {
      const [dx, dy] = [a * 0.5, (a * Math.sqrt(3)) / 2] // D, with A at the origin and B = (a, 0)
      return Math.abs(Math.hypot(dx - a, dy) - a) < 1e-9 && Math.abs(Math.hypot(a + dx, dy) - a * Math.sqrt(3)) < 1e-9
    },
  }
}

/** An isosceles trapezoid with angles of 60° at the large base. */
const isoscelesTrapezoid60: Form = (rng) => {
  const b = int(rng, 2, 25)
  const l = int(rng, 2, 25)
  const B = b + l
  return {
    text: `Trapezul isoscel $ABCD$ cu $AB \\parallel CD$ are $\\angle A = 60^\\circ$, $CD = ${b}$ cm și $AD = ${l}$ cm. Calculați lungimea bazei $AB$, perimetrul și înălțimea trapezului.`,
    solution: lines(
      'Ducem înălțimile $DE \\perp AB$ și $CF \\perp AB$, cu $E, F \\in AB$. În triunghiul $ADE$, dreptunghic în $E$, $\\angle ADE = 30^\\circ$, iar cateta opusă unghiului de $30^\\circ$ este jumătate din ipotenuză:',
      show(`AE = \\frac{AD}{2} = ${frac(l, 2)}${cm}`),
      'Trapezul este isoscel, deci $FB = AE$, iar $EF = CD$, pentru că $DEFC$ este dreptunghi:',
      show(`AB = AE + EF + FB = ${frac(l, 2)} + ${b} + ${frac(l, 2)} = ${B}${cm}`),
      show(`P = AB + BC + CD + DA = ${B} + ${l} + ${b} + ${l} = ${B + b + 2 * l}${cm}`),
      'Din teorema lui Pitagora în triunghiul $ADE$:',
      show(`DE^2 = AD^2 - AE^2 = ${l * l} - ${frac(l * l, 4)} = ${frac(3 * l * l, 4)} \\Rightarrow DE = ${surd(l, 2, 3)}${cm}`),
    ),
    verify: () => {
      const h = (l * Math.sqrt(3)) / 2
      // D = (l/2, h), C = (l/2 + b, h), B = (B, 0): the other leg is l too
      return Math.abs(Math.hypot(B - (l / 2 + b), h) - l) < 1e-9 && Math.abs(Math.hypot(l / 2, h) - l) < 1e-9
    },
  }
}

/** The midline of a trapezoid cut by the diagonals. */
const trapezoidDiagonalMidline: Form = (rng) => {
  const b = 2 * int(rng, 1, 15)
  const B = b + 2 * int(rng, 1, 15)
  return {
    text: `În trapezul $ABCD$ cu $AB \\parallel CD$, $AB = ${B}$ cm și $CD = ${b}$ cm, punctele $M$ și $N$ sunt mijloacele laturilor $AD$, respectiv $BC$. Dreapta $MN$ intersectează diagonalele $AC$ și $BD$ în punctele $P$, respectiv $Q$. Calculați lungimile segmentelor $MN$, $MP$ și $PQ$.`,
    solution: lines(
      '$MN$ este linia mijlocie a trapezului, deci $MN \\parallel AB \\parallel CD$ și:',
      show(`MN = \\frac{AB + CD}{2} = \\frac{${B} + ${b}}{2} = ${(B + b) / 2}${cm}`),
      'În triunghiul $ADC$, $M$ este mijlocul lui $AD$ și $MP \\parallel DC$, deci $MP$ este linie mijlocie:',
      show(`MP = \\frac{CD}{2} = ${b / 2}${cm}`),
      'La fel, în triunghiul $BCD$, $NQ$ este linie mijlocie, deci $NQ = \\frac{CD}{2} = ' + `${b / 2}$ cm. Atunci:`,
      show(`PQ = MN - MP - NQ = ${(B + b) / 2} - ${b / 2} - ${b / 2} = ${(B - b) / 2}${cm}`),
    ),
    verify: () => {
      // A(0,0), B(B,0), D(1,6), C(1+b,6): P and Q are the midpoints of the diagonals, on the line y = 3
      const [mx, px, qx, nx] = [0.5, (1 + b) / 2, (B + 1) / 2, (B + 1 + b) / 2]
      return nx - mx === (B + b) / 2 && px - mx === b / 2 && qx - px === (B - b) / 2
    },
  }
}

/** The bisector of an angle of a parallelogram cuts off an isosceles triangle. */
const parallelogramBisector: Form = (rng) => {
  const b = int(rng, 2, 25)
  const a = b + int(rng, 1, 20)
  return {
    text: `În paralelogramul $ABCD$, $AB = ${a}$ cm și $AD = ${b}$ cm. Bisectoarea unghiului $A$ intersectează latura $CD$ în punctul $E$. Calculați lungimile segmentelor $DE$ și $EC$ și perimetrul paralelogramului.`,
    solution: lines(
      'Unghiurile $DEA$ și $EAB$ sunt alterne interne ($AB \\parallel CD$, secanta $AE$), deci sunt congruente. Cum $AE$ este bisectoare, $\\angle EAB = \\angle DAE$, de unde $\\angle DEA = \\angle DAE$: triunghiul $ADE$ este isoscel, cu',
      show(`DE = AD = ${b}${cm}`),
      show(`EC = CD - DE = ${a} - ${b} = ${a - b}${cm}`),
      show(`P = 2(AB + AD) = 2(${a} + ${b}) = ${2 * (a + b)}${cm}`),
    ),
    verify: () => {
      // A at the origin, B = (a, 0), D = b(cos t, sin t); the bisector meets the line CD at A + s(1 + cos t, sin t), s = b
      const t = 1.1
      const ex = b * (1 + Math.cos(t))
      const dx = b * Math.cos(t)
      return Math.abs(ex - dx - b) < 1e-9 && ex < dx + a
    },
  }
}

// ───────────────────────────── 5. The circle ─────────────────────────────

/** The central and the inscribed angle on an arc. */
const inscribedAngle: Form = (rng) => {
  const u = 2 * int(rng, 10, 89)
  return {
    text: `Pe un cerc de centru $O$ se consideră punctele $A$, $B$ și $C$, astfel încât arcul mic $AB$ are măsura de $${u}^\\circ$, iar punctul $C$ se află pe arcul mare $AB$. Calculați măsurile unghiurilor $AOB$ și $ACB$.`,
    solution: lines(
      'Unghiul la centru are măsura egală cu măsura arcului cuprins între laturile lui:',
      show(`\\angle AOB = ${u}^\\circ`),
      'Unghiul înscris în cerc are măsura egală cu jumătate din măsura arcului cuprins între laturile lui:',
      show(`\\angle ACB = \\frac{${u}^\\circ}{2} = ${u / 2}^\\circ`),
    ),
    verify: () => {
      const t = (u * Math.PI) / 180
      const c = t + (2 * Math.PI - t) / 3 // a point of the large arc
      const [ax, ay, bx, by, cx, cy] = [1, 0, Math.cos(t), Math.sin(t), Math.cos(c), Math.sin(c)]
      const dot = (ax - cx) * (bx - cx) + (ay - cy) * (by - cy)
      return Math.abs((Math.acos(dot / (Math.hypot(ax - cx, ay - cy) * Math.hypot(bx - cx, by - cy))) * 180) / Math.PI - u / 2) < 1e-6
    },
  }
}

/** The length of a circle and the area of its disc. */
const circleLengthArea: Form = (rng) => {
  const r = int(rng, 2, 45)
  const byDiameter = rng() < 0.4
  return {
    text: byDiameter
      ? `Un cerc are diametrul de ${2 * r} cm. Calculați lungimea cercului și aria discului.`
      : `Un cerc are raza de ${r} cm. Calculați lungimea cercului și aria discului.`,
    solution: lines(
      ...(byDiameter ? [show(`r = \\frac{${2 * r}}{2} = ${r}${cm}`)] : []),
      show(`L = 2\\pi r = 2\\pi \\cdot ${r} = ${2 * r}\\pi${cm}`),
      show(`\\mathcal{A} = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi${cm2}`),
    ),
    verify: () => true,
  }
}

/** A triangle inscribed in a circle, from two of the arcs. */
const arcsTriangle: Form = (rng) => {
  for (;;) {
    const x = 2 * int(rng, 15, 100)
    const y = 2 * int(rng, 15, 100)
    const z = 360 - x - y
    if (z < 30 || x === y) continue
    return {
      text: `Punctele $A$, $B$ și $C$ sunt pe un cerc, astfel încât arcele $AB$ și $BC$ (fiecare fără al treilea punct) au măsurile de $${x}^\\circ$, respectiv $${y}^\\circ$. Calculați măsurile unghiurilor triunghiului $ABC$.`,
      solution: lines(
        'Al treilea arc, $AC$, are măsura:',
        show(`360^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ`),
        'Fiecare unghi al triunghiului este înscris în cerc și are măsura egală cu jumătate din măsura arcului opus:',
        show(`\\angle C = \\frac{${x}^\\circ}{2} = ${x / 2}^\\circ, \\qquad \\angle A = \\frac{${y}^\\circ}{2} = ${y / 2}^\\circ, \\qquad \\angle B = \\frac{${z}^\\circ}{2} = ${z / 2}^\\circ`),
      ),
      verify: () => x / 2 + y / 2 + z / 2 === 180 && z > 0,
    }
  }
}

/** The tangent from an outside point. */
const tangentLength: Form = (rng) => {
  const [p, q, r] = rightTriangle(rng, 100)
  return {
    text: `Din punctul $P$, exterior cercului de centru $O$ și rază ${p} cm, se duce tangenta $PT$ la cerc, $T$ fiind punctul de tangență. Știind că $OP = ${r}$ cm, calculați lungimea segmentului $PT$.`,
    solution: lines(
      'Raza dusă în punctul de tangență este perpendiculară pe tangentă, deci triunghiul $OTP$ este dreptunghic în $T$. Din teorema lui Pitagora:',
      show(`PT^2 = OP^2 - OT^2 = ${r * r} - ${p * p} = ${q * q} \\Rightarrow PT = ${q}${cm}`),
    ),
    verify: () => p * p + q * q === r * r,
  }
}

/** A chord and its distance from the centre, one from the other. */
const chordDistance: Form = (rng) => {
  const [p, q, r] = rightTriangle(rng, 100)
  if (rng() < 0.5) {
    return {
      text: `Într-un cerc de centru $O$ și rază ${r} cm, coarda $AB$ are lungimea de ${2 * p} cm. Calculați distanța de la centrul cercului la coarda $AB$.`,
      solution: lines(
        `Fie $M$ mijlocul coardei $AB$. Triunghiul $OAB$ este isoscel ($OA = OB$), deci mediana $OM$ este și înălțime: $OM \\perp AB$, iar $AM = \\frac{AB}{2} = ${p}$ cm. În triunghiul $OMA$, dreptunghic în $M$:`,
        show(`OM^2 = OA^2 - AM^2 = ${r * r} - ${p * p} = ${q * q} \\Rightarrow OM = ${q}${cm}`),
      ),
      verify: () => p * p + q * q === r * r,
    }
  }
  return {
    text: `Într-un cerc de centru $O$ și rază ${r} cm, distanța de la centru la coarda $AB$ este de ${q} cm. Calculați lungimea coardei $AB$.`,
    solution: lines(
      `Fie $M$ piciorul perpendicularei din $O$ pe $AB$, deci $OM = ${q}$ cm. Triunghiul $OAB$ este isoscel ($OA = OB$), deci înălțimea $OM$ este și mediană: $M$ este mijlocul lui $AB$. În triunghiul $OMA$, dreptunghic în $M$:`,
      show(`AM^2 = OA^2 - OM^2 = ${r * r} - ${q * q} = ${p * p} \\Rightarrow AM = ${p}${cm}`),
      show(`AB = 2 \\cdot AM = ${2 * p}${cm}`),
    ),
    verify: () => p * p + q * q === r * r,
  }
}

/** The length of an arc and the area of a sector. */
const sectorArc: Form = (rng) => {
  const r = int(rng, 2, 24)
  const u = pick(rng, [30, 36, 40, 45, 60, 72, 90, 120, 135, 150])
  return {
    text: `Într-un cerc cu raza de ${r} cm, un unghi la centru are măsura de $${u}^\\circ$. Calculați lungimea arcului de cerc și aria sectorului de cerc corespunzătoare acestui unghi.`,
    solution: lines(
      `Arcul și sectorul reprezintă $\\frac{${u}}{360} = ${frac(u, 360)}$ din cerc, respectiv din disc:`,
      show(`L_{\\text{arc}} = \\frac{\\pi r \\cdot ${u}}{180} = \\frac{\\pi \\cdot ${r} \\cdot ${u}}{180} = ${piTex(r * u, 180)}${cm}`),
      show(`\\mathcal{A}_{\\text{sector}} = \\frac{\\pi r^2 \\cdot ${u}}{360} = \\frac{\\pi \\cdot ${r * r} \\cdot ${u}}{360} = ${piTex(r * r * u, 360)}${cm2}`),
    ),
    verify: () => {
      const [n1, d1] = reduce(r * u, 180)
      const [n2, d2] = reduce(r * r * u, 360)
      return Math.abs(n1 / d1 - (2 * r * u) / 360) < 1e-9 && Math.abs(n2 / d2 - (r * r * u) / 360) < 1e-9
    },
  }
}

const POLYGONS = [
  { n: 3, name: 'Un triunghi echilateral', of: 'triunghiului', sub: 3 },
  { n: 4, name: 'Un pătrat', of: 'pătratului', sub: 4 },
  { n: 6, name: 'Un hexagon regulat', of: 'hexagonului', sub: 6 },
] as const

/** The side and the apothem of a regular polygon inscribed in a circle. */
const regularInscribed: Form = (rng) => {
  const g = pick(rng, POLYGONS)
  const R = int(rng, 2, 40)
  const side = g.n === 3 ? `\\ell_3 = R\\sqrt{3} = ${surd(R, 1, 3)}` : g.n === 4 ? `\\ell_4 = R\\sqrt{2} = ${surd(R, 1, 2)}` : `\\ell_6 = R = ${R}`
  const apothem = g.n === 3 ? `a_3 = \\frac{R}{2} = ${dec(R / 2)}` : g.n === 4 ? `a_4 = \\frac{R\\sqrt{2}}{2} = ${surd(R, 2, 2)}` : `a_6 = \\frac{R\\sqrt{3}}{2} = ${surd(R, 2, 3)}`
  const exact = g.n === 3 ? [R * Math.sqrt(3), R / 2] : g.n === 4 ? [R * Math.sqrt(2), (R * Math.sqrt(2)) / 2] : [R, (R * Math.sqrt(3)) / 2]
  return {
    text: `${g.name} este înscris într-un cerc cu raza de ${R} cm. Calculați latura și apotema ${g.of}.`,
    solution: lines(
      `Pentru poligonul regulat cu ${g.n} laturi înscris în cercul de rază $R = ${R}$ cm:`,
      show(`${side}${cm}, \\qquad ${apothem}${cm}`),
    ),
    verify: () => Math.abs(exact[0] - 2 * R * Math.sin(Math.PI / g.n)) < 1e-9 && Math.abs(exact[1] - R * Math.cos(Math.PI / g.n)) < 1e-9,
  }
}

/** The part of a disc outside the inscribed regular polygon. */
const discMinusPolygon: Form = (rng) => {
  const g = pick(rng, POLYGONS)
  const R = int(rng, 2, 24)
  const R2 = R * R
  const area = g.n === 3 ? surd(3 * R2, 4, 3) : g.n === 4 ? String(2 * R2) : surd(3 * R2, 2, 3)
  const steps =
    g.n === 3
      ? [show(`\\ell_3 = R\\sqrt{3} = ${surd(R, 1, 3)}${cm}`), show(`\\mathcal{A}_3 = \\frac{\\ell_3^2\\sqrt{3}}{4} = \\frac{${3 * R2}\\sqrt{3}}{4} = ${area}${cm2}`)]
      : g.n === 4
        ? [show(`\\ell_4 = R\\sqrt{2} = ${surd(R, 1, 2)}${cm}`), show(`\\mathcal{A}_4 = \\ell_4^2 = ${area}${cm2}`)]
        : [show(`\\ell_6 = R = ${R}${cm}`), 'Hexagonul regulat este format din 6 triunghiuri echilaterale cu latura $R$:', show(`\\mathcal{A}_6 = 6 \\cdot \\frac{R^2\\sqrt{3}}{4} = \\frac{6 \\cdot ${R2}\\sqrt{3}}{4} = ${area}${cm2}`)]
  const value = g.n === 3 ? (3 * R2 * Math.sqrt(3)) / 4 : g.n === 4 ? 2 * R2 : (3 * R2 * Math.sqrt(3)) / 2
  return {
    text: `${g.name} este înscris într-un cerc cu raza de ${R} cm. Calculați aria ${g.of} și aria părții din disc aflate în exteriorul ${g.of}.`,
    solution: lines(
      `Latura și aria ${g.of}, în funcție de raza $R = ${R}$ cm a cercului circumscris:`,
      ...steps,
      'Aria discului:',
      show(`\\mathcal{A}_{\\text{disc}} = \\pi R^2 = ${R2}\\pi${cm2}`),
      `Aria părții din disc aflate în exteriorul ${g.of} este diferența lor:`,
      show(`\\mathcal{A} = (${R2}\\pi - ${area})${cm2}`),
    ),
    verify: () => Math.abs(value - (g.n * R2 * Math.sin((2 * Math.PI) / g.n)) / 2) < 1e-9 && value < Math.PI * R2,
  }
}

/** Two parallel chords: the distance between them. */
const twoChords: Form = (rng) => {
  for (;;) {
    const r = int(rng, 5, 65)
    const legs: number[] = []
    for (let a = 1; a < r; a++) if (isSquare(r * r - a * a)) legs.push(a)
    if (legs.length < 2) continue
    const [h1, h2] = shuffle(rng, legs).slice(0, 2).sort((u, v) => u - v)
    const [d1, d2] = [Math.sqrt(r * r - h1 * h1), Math.sqrt(r * r - h2 * h2)]
    const between = rng() < 0.5
    const dist = between ? d1 + d2 : d1 - d2
    return {
      text: `Într-un cerc de centru $O$ și rază ${r} cm, coardele paralele $AB$ și $CD$ au lungimile $AB = ${2 * h1}$ cm și $CD = ${2 * h2}$ cm. Calculați distanța dintre cele două coarde, știind că ${between ? 'centrul cercului se află între ele' : 'ele se află de aceeași parte a centrului cercului'}.`,
      solution: lines(
        `Fie $M$ și $N$ mijloacele coardelor $AB$, respectiv $CD$. Atunci $OM \\perp AB$ și $ON \\perp CD$, cu $AM = ${h1}$ cm și $CN = ${h2}$ cm. Cum $AB \\parallel CD$, punctele $M$, $O$ și $N$ sunt coliniare. Din teorema lui Pitagora în triunghiurile $OMA$ și $ONC$:`,
        show(`OM^2 = OA^2 - AM^2 = ${r * r} - ${h1 * h1} = ${d1 * d1} \\Rightarrow OM = ${d1}${cm}`),
        show(`ON^2 = OC^2 - CN^2 = ${r * r} - ${h2 * h2} = ${d2 * d2} \\Rightarrow ON = ${d2}${cm}`),
        between ? 'Centrul este între coarde, deci distanța dintre ele este:' : 'Coardele sunt de aceeași parte a centrului, deci distanța dintre ele este:',
        show(`MN = OM ${between ? '+' : '-'} ON = ${d1} ${between ? '+' : '-'} ${d2} = ${dist}${cm}`),
      ),
      verify: () => d1 * d1 + h1 * h1 === r * r && d2 * d2 + h2 * h2 === r * r && Number.isInteger(dist) && dist > 0,
    }
  }
}

/** The two tangents from a point, from the angle between them. */
const tangentsAngle: Form = (rng) => {
  const r = int(rng, 2, 36)
  const alpha = pick(rng, [60, 90, 120] as const)
  const r2 = r * r
  const [PA, OP, area] =
    alpha === 60 ? [surd(r, 1, 3), String(2 * r), surd(r2, 1, 3)] : alpha === 90 ? [String(r), surd(r, 1, 2), String(r2)] : [surd(r, 3, 3), surd(2 * r, 3, 3), surd(r2, 3, 3)]
  const steps =
    alpha === 60
      ? [
          'În triunghiul $PAO$, cateta $OA$ este opusă unghiului de $30^\\circ$, deci este jumătate din ipotenuză:',
          show(`OP = 2 \\cdot OA = ${2 * r}${cm}`),
          'Din teorema lui Pitagora:',
          show(`PA^2 = OP^2 - OA^2 = ${4 * r2} - ${r2} = ${3 * r2} \\Rightarrow PA = ${PA}${cm}`),
        ]
      : alpha === 90
        ? [
            'Triunghiul $PAO$ este dreptunghic și are un unghi de $45^\\circ$, deci este isoscel:',
            show(`PA = OA = ${r}${cm}`),
            'Din teorema lui Pitagora:',
            show(`OP^2 = PA^2 + OA^2 = ${r2} + ${r2} = ${2 * r2} \\Rightarrow OP = ${OP}${cm}`),
          ]
        : [
            'În triunghiul $PAO$, $\\angle AOP = 30^\\circ$, iar cateta $PA$, opusă acestui unghi, este jumătate din ipotenuză: $OP = 2 \\cdot PA$. Din teorema lui Pitagora:',
            show(`OP^2 = PA^2 + OA^2 \\Rightarrow 4 \\cdot PA^2 = PA^2 + ${r2} \\Rightarrow PA^2 = ${frac(r2, 3)} \\Rightarrow PA = ${PA}${cm}`),
            show(`OP = 2 \\cdot PA = ${OP}${cm}`),
          ]
  const half = (alpha / 2) * (Math.PI / 180)
  const values = alpha === 60 ? [r * Math.sqrt(3), 2 * r] : alpha === 90 ? [r, r * Math.sqrt(2)] : [(r * Math.sqrt(3)) / 3, (2 * r * Math.sqrt(3)) / 3]
  return {
    text: `Din punctul $P$, exterior cercului de centru $O$ și rază ${r} cm, se duc tangentele $PA$ și $PB$ la cerc, $A$ și $B$ fiind punctele de tangență. Știind că $\\angle APB = ${alpha}^\\circ$, calculați lungimile segmentelor $PA$ și $OP$ și aria patrulaterului $PAOB$.`,
    solution: lines(
      `Razele duse în punctele de tangență sunt perpendiculare pe tangente, deci triunghiurile $PAO$ și $PBO$ sunt dreptunghice în $A$, respectiv în $B$. Ele sunt congruente (au ipotenuza $OP$ comună și $OA = OB$), deci $PA = PB$ și $\\angle APO = \\frac{${alpha}^\\circ}{2} = ${alpha / 2}^\\circ$.`,
      ...steps,
      'Patrulaterul $PAOB$ este format din cele două triunghiuri dreptunghice congruente:',
      show(`\\mathcal{A}_{PAOB} = 2 \\cdot \\frac{PA \\cdot OA}{2} = PA \\cdot OA = ${area}${cm2}`),
    ),
    verify: () => Math.abs(values[0] - r / Math.tan(half)) < 1e-9 && Math.abs(values[1] - r / Math.sin(half)) < 1e-9,
  }
}

/** A triangle inscribed in a semicircle. */
const semicircleTriangle: Form = (rng) => {
  const [p, q, r] = rightTriangle(rng, 50)
  return {
    text: `Segmentul $AB$ este diametru al unui cerc de centru $O$, iar $C$ este un punct al cercului, astfel încât $AC = ${2 * p}$ cm și $BC = ${2 * q}$ cm. Calculați raza cercului și distanța de la centrul $O$ la coarda $AC$.`,
    solution: lines(
      'Unghiul $ACB$ este înscris într-un semicerc, deci $\\angle ACB = 90^\\circ$. Din teorema lui Pitagora în triunghiul $ABC$:',
      show(`AB^2 = AC^2 + BC^2 = ${4 * p * p} + ${4 * q * q} = ${4 * r * r} \\Rightarrow AB = ${2 * r}${cm}`),
      show(`R = \\frac{AB}{2} = ${r}${cm}`),
      'Fie $M$ mijlocul coardei $AC$; atunci $OM \\perp AC$, deci $OM$ este distanța cerută. Cum $O$ este mijlocul lui $AB$, $OM$ este linie mijlocie în triunghiul $ABC$:',
      show(`OM = \\frac{BC}{2} = ${q}${cm}`),
    ),
    verify: () => p * p + q * q === r * r,
  }
}

// ───────────────────────────── 6. Metric relations in the right triangle ─────────────────────────────

const INTRO = 'În triunghiul $ABC$, dreptunghic în $A$, $AD \\perp BC$, $D \\in BC$'

/** The height from the projections of the legs. */
const heightTheorem: Form = (rng) => {
  for (;;) {
    const [m, n] = [int(rng, 2, 30), int(rng, 2, 30)]
    if (m === n) continue
    return {
      text: `${INTRO}, $BD = ${m}$ cm și $DC = ${n}$ cm. Calculați lungimea înălțimii $AD$.`,
      solution: lines('Din teorema înălțimii:', show(`AD^2 = BD \\cdot DC = ${m} \\cdot ${n} = ${m * n} \\Rightarrow AD = ${rootEq(m * n)}${cm}`)),
      verify: () => {
        // A = (m, h) over B(0,0), C(m + n, 0): the angle at A is right when h² = mn
        const h = Math.sqrt(m * n)
        return Math.abs(m * (m - (m + n)) + h * h) < 1e-9
      },
    }
  }
}

/** A leg from its projection and the hypotenuse. */
const legTheorem: Form = (rng) => {
  const m = int(rng, 2, 25)
  const a = m + int(rng, 1, 25)
  const atB = rng() < 0.5
  const [leg, proj] = atB ? ['AB', 'BD'] : ['AC', 'DC']
  return {
    text: `${INTRO}, $${proj} = ${m}$ cm și $BC = ${a}$ cm. Calculați lungimea catetei $${leg}$.`,
    solution: lines('Din teorema catetei:', show(`${leg}^2 = ${proj} \\cdot BC = ${m} \\cdot ${a} = ${m * a} \\Rightarrow ${leg} = ${rootEq(m * a)}${cm}`)),
    verify: () => {
      // the foot at distance m from the vertex, the height h with h² = m(a − m): the leg is √(m² + h²)
      const h2 = m * (a - m)
      return Math.abs(Math.sqrt(m * m + h2) - Math.sqrt(m * a)) < 1e-9
    },
  }
}

/** The radius of the circumscribed circle: half of the hypotenuse. */
const circumradius: Form = (rng) => {
  const [b, c, a] = rightTriangle(rng, 100)
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${b}$ cm și $AC = ${c}$ cm. Calculați raza cercului circumscris triunghiului și lungimea medianei duse din $A$.`,
    solution: lines(
      'Din teorema lui Pitagora:',
      show(`BC^2 = AB^2 + AC^2 = ${b * b} + ${c * c} = ${a * a} \\Rightarrow BC = ${a}${cm}`),
      'Centrul cercului circumscris unui triunghi dreptunghic este mijlocul $M$ al ipotenuzei, deci raza cercului și mediana $AM$ sunt jumătate din ipotenuză:',
      show(`R = AM = \\frac{BC}{2} = ${dec(a / 2)}${cm}`),
    ),
    // the midpoint of BC, with A at the origin, is as far from A as from B
    verify: () => Math.abs(Math.hypot(b / 2, c / 2) - a / 2) < 1e-9,
  }
}

/** The area in two ways: the height on the hypotenuse. */
const altitudeFromLegs: Form = (rng) => {
  const [b, c, a] = rightTriangle(rng, 60)
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${b}$ cm și $AC = ${c}$ cm, iar $AD \\perp BC$, $D \\in BC$. Calculați aria triunghiului și lungimea înălțimii $AD$.`,
    solution: lines(
      show(`\\mathcal{A} = \\frac{AB \\cdot AC}{2} = \\frac{${b} \\cdot ${c}}{2} = ${frac(b * c, 2)}${cm2}`),
      'Din teorema lui Pitagora:',
      show(`BC^2 = ${b * b} + ${c * c} = ${a * a} \\Rightarrow BC = ${a}${cm}`),
      'Scriem aria și cu ajutorul ipotenuzei și al înălțimii corespunzătoare ei:',
      show(`\\frac{BC \\cdot AD}{2} = \\frac{AB \\cdot AC}{2} \\Rightarrow AD = \\frac{AB \\cdot AC}{BC} = \\frac{${b} \\cdot ${c}}{${a}} = ${gcd(b * c, a) === 1 ? '' : `\\frac{${b * c}}{${a}} = `}${frac(b * c, a)}${cm}`),
    ),
    // the distance from the origin A to the line through B(b, 0) and C(0, c)
    verify: () => Math.abs((b * c) / Math.hypot(b, c) - (b * c) / a) < 1e-9,
  }
}

/** The projections of the legs on the hypotenuse. */
const projectionsFromLegs: Form = (rng) => {
  const [b, c, a] = rightTriangle(rng, 60)
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${b}$ cm și $AC = ${c}$ cm, iar $AD \\perp BC$, $D \\in BC$. Calculați lungimile proiecțiilor catetelor pe ipotenuză, $BD$ și $DC$.`,
    solution: lines(
      'Din teorema lui Pitagora:',
      show(`BC^2 = ${b * b} + ${c * c} = ${a * a} \\Rightarrow BC = ${a}${cm}`),
      'Din teorema catetei:',
      show(`AB^2 = BD \\cdot BC \\Rightarrow BD = \\frac{AB^2}{BC} = \\frac{${b * b}}{${a}}${gcd(b * b, a) === 1 ? '' : ` = ${frac(b * b, a)}`}${cm}`),
      show(`AC^2 = DC \\cdot BC \\Rightarrow DC = \\frac{AC^2}{BC} = \\frac{${c * c}}{${a}}${gcd(c * c, a) === 1 ? '' : ` = ${frac(c * c, a)}`}${cm}`),
      `Verificare: $BD + DC = ${frac(b * b + c * c, a)}$ cm $= BC$.`,
    ),
    verify: () => {
      // D is the projection of the origin A on the line BC, B(b, 0), C(0, c)
      const t = (b * b) / (b * b + c * c)
      const [dx, dy] = [b - t * b, t * c]
      return Math.abs(Math.hypot(dx - b, dy) - (b * b) / a) < 1e-9 && Math.abs(Math.hypot(dx, dy - c) - (c * c) / a) < 1e-9
    },
  }
}

/** From the height and one projection: the other projection, the hypotenuse and the area. */
const heightReverse: Form = (rng) => {
  for (;;) {
    const [u, v] = [int(rng, 1, 6), int(rng, 1, 6)]
    const m = int(rng, 1, 6)
    if (u === v || gcd(u, v) !== 1) continue
    const [AD, BD, DC] = [m * u * v, m * u * u, m * v * v]
    const BC = BD + DC
    return {
      text: `${INTRO}, $AD = ${AD}$ cm și $BD = ${BD}$ cm. Calculați lungimile segmentelor $DC$ și $BC$ și aria triunghiului $ABC$.`,
      solution: lines(
        'Din teorema înălțimii:',
        show(`AD^2 = BD \\cdot DC \\Rightarrow DC = \\frac{AD^2}{BD} = \\frac{${AD * AD}}{${BD}} = ${DC}${cm}`),
        show(`BC = BD + DC = ${BD} + ${DC} = ${BC}${cm}`),
        show(`\\mathcal{A} = \\frac{BC \\cdot AD}{2} = \\frac{${BC} \\cdot ${AD}}{2} = ${frac(BC * AD, 2)}${cm2}`),
      ),
      // A = (BD, AD) over B(0,0), C(BC, 0): the angle at A is right
      verify: () => BD * (BD - BC) + AD * AD === 0,
    }
  }
}

/** From a leg and its projection: the hypotenuse, the height and the other leg. */
const legAndProjection: Form = (rng) => {
  const u = int(rng, 1, 5)
  const w = u + int(rng, 1, 4)
  const m = int(rng, 1, 5)
  const [BD, BC, AB] = [m * u * u, m * w * w, m * u * w]
  const DC = BC - BD
  return {
    text: `${INTRO}, $AB = ${AB}$ cm și $BD = ${BD}$ cm. Calculați lungimile segmentelor $BC$, $AD$ și $AC$.`,
    solution: lines(
      'Din teorema catetei, pentru cateta $AB$:',
      show(`AB^2 = BD \\cdot BC \\Rightarrow BC = \\frac{AB^2}{BD} = \\frac{${AB * AB}}{${BD}} = ${BC}${cm}`),
      show(`DC = BC - BD = ${BC} - ${BD} = ${DC}${cm}`),
      'Din teorema înălțimii:',
      show(`AD^2 = BD \\cdot DC = ${BD} \\cdot ${DC} = ${BD * DC} \\Rightarrow AD = ${rootEq(BD * DC)}${cm}`),
      'Din teorema catetei, pentru cateta $AC$:',
      show(`AC^2 = DC \\cdot BC = ${DC} \\cdot ${BC} = ${DC * BC} \\Rightarrow AC = ${rootEq(DC * BC)}${cm}`),
    ),
    verify: () => {
      // A = (BD, h) over B(0,0), C(BC, 0)
      const h = Math.sqrt(BD * DC)
      return Math.abs(Math.hypot(BD, h) - AB) < 1e-9 && Math.abs(BD * (BD - BC) + h * h) < 1e-9 && Math.abs(Math.hypot(BD - BC, h) - Math.sqrt(DC * BC)) < 1e-9
    },
  }
}

/** The hypotenuse and the ratio of the projections. */
const projectionsRatio: Form = (rng) => {
  for (;;) {
    const [u, v] = [int(rng, 1, 5), int(rng, 1, 5)]
    const t = int(rng, 1, 8)
    if (u === v || gcd(u, v) !== 1) continue
    const [BD, DC, BC] = [u * t, v * t, (u + v) * t]
    return {
      text: `${INTRO}, $BC = ${BC}$ cm și $\\frac{BD}{DC} = ${v === 1 ? u : `\\frac{${u}}{${v}}`}$. Calculați lungimile segmentelor $BD$, $DC$, $AD$ și $AB$.`,
      solution: lines(
        `Din raportul dat, $BD = ${coef(u)}k$ și $DC = ${coef(v)}k$, iar suma lor este ipotenuza:`,
        show(`${coef(u)}k + ${coef(v)}k = ${BC} \\Rightarrow ${u + v}k = ${BC} \\Rightarrow k = ${t}, \\qquad BD = ${BD}${cm}, \\quad DC = ${DC}${cm}`),
        'Din teorema înălțimii:',
        show(`AD^2 = BD \\cdot DC = ${BD} \\cdot ${DC} = ${BD * DC} \\Rightarrow AD = ${rootEq(BD * DC)}${cm}`),
        'Din teorema catetei:',
        show(`AB^2 = BD \\cdot BC = ${BD} \\cdot ${BC} = ${BD * BC} \\Rightarrow AB = ${rootEq(BD * BC)}${cm}`),
      ),
      verify: () => {
        const h = Math.sqrt(BD * DC)
        return BD * v === DC * u && Math.abs(BD * (BD - BC) + h * h) < 1e-9 && Math.abs(Math.hypot(BD, h) - Math.sqrt(BD * BC)) < 1e-9
      },
    }
  }
}

/** A right triangle with an angle of 30°: the height and the projections. */
const metric30: Form = (rng) => {
  const t = int(rng, 1, 25)
  const atB = rng() < 0.5
  // the leg opposite the angle of 30° is `short`, with the projection `near`
  const [angle, short, long, near, far] = atB ? ['B', 'AC', 'AB', 'DC', 'BD'] : ['C', 'AB', 'AC', 'BD', 'DC']
  const BC = 4 * t
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $\\angle ${angle} = 30^\\circ$ și $BC = ${BC}$ cm, iar $AD \\perp BC$, $D \\in BC$. Calculați lungimile segmentelor $AD$, $BD$ și $DC$.`,
    solution: lines(
      'Cateta opusă unghiului de $30^\\circ$ este jumătate din ipotenuză:',
      show(`${short} = \\frac{BC}{2} = ${2 * t}${cm}`),
      'Din teorema catetei:',
      show(`${short}^2 = ${near} \\cdot BC \\Rightarrow ${near} = \\frac{${short}^2}{BC} = \\frac{${4 * t * t}}{${BC}} = ${t}${cm}`),
      show(`${far} = BC - ${near} = ${BC} - ${t} = ${3 * t}${cm}`),
      'Din teorema înălțimii:',
      show(`AD^2 = BD \\cdot DC = ${atB ? 3 * t : t} \\cdot ${atB ? t : 3 * t} = ${3 * t * t} \\Rightarrow AD = ${surd(t, 1, 3)}${cm}`),
      `(Cealaltă catetă este $${long} = ${surd(2 * t, 1, 3)}$ cm, din teorema lui Pitagora.)`,
    ),
    verify: () => {
      // the legs 2t and 2t√3 from A at the origin; the foot of the height on the hypotenuse
      const [s, l] = [2 * t, 2 * t * Math.sqrt(3)]
      const h = (s * l) / Math.hypot(s, l)
      return Math.abs(Math.hypot(s, l) - BC) < 1e-9 && Math.abs(h - t * Math.sqrt(3)) < 1e-9 && Math.abs(Math.sqrt(s * s - h * h) - t) < 1e-9
    },
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'vii-real-numbers', label: 'Numere reale: modul, parte întreagă, medii', topic: 'Algebră',
    forms: { 1: [rootSquare, rootBetween, irrationalSet, geometricMean], 2: [absSurd, integerPart, weightedMean], 3: [absThree, conjugateMeans, weightedMissing] },
  },
  {
    id: 'vii-algebra', label: 'Calcul algebric și formule de calcul prescurtat', topic: 'Algebră',
    forms: { 1: [likeTerms, squareBinomial, sumDiffProduct], 2: [expandReduce, expressionValue, radicalSquare, numericDifference], 3: [showConstant, sumProductSquares, reciprocalSquares] },
  },
  {
    id: 'vii-equations', label: 'Ecuații de forma x² = a, sisteme și probleme', topic: 'Algebră',
    forms: { 1: [squareEquals, numberWord, systemSumDiff], 2: [squareShifted, squareScaled, crossFraction, substitutionSystem], 3: [quotientRemainder, agesProblem, squareReducible, rectangleSystem] },
  },
  {
    id: 'vii-quadrilaterals', label: 'Patrulatere: unghiuri, proprietăți, linia mijlocie', topic: 'Geometrie',
    forms: { 1: [parallelogramAngles, trapezoidMidline, rectangleCenterAngle], 2: [parallelogramAngleRelation, rhombusDiagonalAngle, trapezoidBases, rhombus60], 3: [isoscelesTrapezoid60, trapezoidDiagonalMidline, parallelogramBisector] },
  },
  {
    id: 'vii-circle', label: 'Cercul și poligoanele regulate', topic: 'Geometrie',
    forms: { 1: [inscribedAngle, circleLengthArea, arcsTriangle], 2: [tangentLength, chordDistance, sectorArc, regularInscribed], 3: [discMinusPolygon, twoChords, tangentsAngle, semicircleTriangle] },
  },
  {
    id: 'vii-metric', label: 'Relații metrice în triunghiul dreptunghic', topic: 'Geometrie',
    forms: { 1: [heightTheorem, legTheorem, circumradius], 2: [altitudeFromLegs, projectionsFromLegs, heightReverse], 3: [legAndProjection, projectionsRatio, metric30] },
  },
]
