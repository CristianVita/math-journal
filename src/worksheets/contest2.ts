// More contest problems (level 4), after olympiad subjects the user pointed to on sorinborodi.ro on 10 November 2026:
// the local stage of Iași 2009 (grades V–VIII), the county stage of 2009 (grade VII), the local stage of Constanța 2009
// and the sheet of minimum and maximum exercises. Each keeps the idea of a problem, with other numbers and a worked
// solution in Romanian; problems that need a figure are left out, as the sheets do not draw yet.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, pick, poly, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
/** A coefficient before a letter: 1 is not written. */
const k1 = (n: number) => (n === 1 ? '' : String(n))
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n))
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const over = (s: string) => `\\overline{${s}}`

// ================= grade V =================

/** 2, 10, 26, 58, … : each term is twice the one before plus c, so a_n + c doubles. (Iași 2009, V.3) */
export function sequenceDouble(rng: Rng): Made {
  const a1 = int(rng, 1, 9)
  const c = int(rng, 1, 9)
  const terms = [a1]
  for (let i = 1; i < 8; i++) terms.push(2 * terms[i - 1] + c)
  const N = pick(rng, [50, 100, 2025, 2026, 2027, 2030])
  const s = a1 + c
  // s · 2^(N−1), with s taken into the power when it is one
  const e = Math.log2(s)
  const big = Number.isInteger(e) ? `2^{${N - 1 + e}}` : `${s} \\cdot 2^{${N - 1}}`
  return {
    text: `Se consideră șirul ${terms.slice(0, 5).join(', ')}, …\n\na) Scrieți încă trei termeni ai șirului.\n\nb) Determinați al ${N}-lea termen al șirului.`,
    solution: lines(
      `a) Fiecare termen se obține din cel dinainte înmulțindu-l cu 2 și adunând ${c}: $${terms[1]} = 2 \\cdot ${terms[0]} + ${c}$, $${terms[2]} = 2 \\cdot ${terms[1]} + ${c}$ și așa mai departe. Următorii trei termeni sunt ${terms[5]}, ${terms[6]}, ${terms[7]}.`,
      `b) Adunăm ${c} la fiecare termen: obținem ${terms.slice(0, 5).map((t) => t + c).join(', ')}, …, adică $${s}, ${s} \\cdot 2, ${s} \\cdot 2^2, ${s} \\cdot 2^3, \\ldots$ Termenul de pe locul $n$, mărit cu ${c}, este $${s} \\cdot 2^{n-1}$, deci`,
      show(`a_{${N}} = ${s} \\cdot 2^{${N - 1}} - ${c}${Number.isInteger(e) ? ` = ${big} - ${c}` : ''}`),
    ),
    verify: () => terms.every((t, i) => t === s * 2 ** i - c),
  }
}

/** The numbers 68ab that leave remainder r when divided by d. (Iași 2009, V.2 a) */
export function digitsRemainder(rng: Rng): Made {
  for (;;) {
    const d = pick(rng, [21, 23, 27, 29, 31, 33, 37, 41])
    const r = int(rng, 1, d - 1)
    const xy = int(rng, 10, 99)
    const lo = 100 * xy
    const found = Array.from({ length: 100 }, (_, i) => lo + i).filter((n) => n % d === r)
    if (found.length < 2) continue
    const q = Math.floor(lo / d)
    return {
      text: `Determinați numerele de forma $${over(`${xy}ab`)}$ care, la împărțirea prin ${d}, dau restul ${r}.`,
      solution: lines(
        `Numerele sunt între ${lo} și ${lo + 99} și au forma $${d} \\cdot c + ${r}$. Cum $${lo} = ${d} \\cdot ${q} + ${lo - d * q}$, primul număr de această formă cel puțin egal cu ${lo} este $${found[0]} = ${d} \\cdot ${(found[0] - r) / d} + ${r}$.`,
        `Următoarele se obțin adunând câte ${d}, cât timp rămânem sub ${lo + 100}:`,
        show(`${over(`${xy}ab`)} \\in \\{${found.join(', ')}\\}`),
      ),
      verify: () => found.every((n) => Math.floor(n / 100) === xy && n % d === r),
    }
  }
}

/** How many zeros 1·2·…·n ends with: the factors 5 are fewer than the factors 2. (after Iași 2009, V.1 b) */
export function factorialZeros(rng: Rng): Made {
  const n = int(rng, 26, 260)
  const parts = [5, 25, 125].filter((p) => p <= n).map((p) => [p, Math.floor(n / p)] as const)
  const zeros = parts.reduce((s, [, c]) => s + c, 0)
  return {
    text: `Cu câte zerouri se termină numărul $A = 1 \\cdot 2 \\cdot 3 \\cdot \\ldots \\cdot ${n}$?`,
    solution: lines(
      'Fiecare zero de la sfârșit vine dintr-un factor $10 = 2 \\cdot 5$. În produs sunt mai mulți factori 2 decât factori 5 (numerele pare sunt mai multe decât multiplii lui 5), deci numărăm factorii 5.',
      parts.map(([p, c], i) => (i === 0
        ? `Multiplii lui 5 până la ${n} sunt ${c}, fiecare cu un factor 5.`
        : `Multiplii lui ${p} sunt ${c} și fiecare mai aduce un factor 5.`)).join(' '),
      show(`${parts.map(([, c]) => c).join(' + ')} = ${zeros}`),
      `Numărul $A$ se termină cu ${de(zeros)} zerouri.`,
    ),
    verify: () => {
      let twos = 0
      let fives = 0
      for (let k = 2; k <= n; k++) {
        for (let m = k; m % 2 === 0; m /= 2) twos++
        for (let m = k; m % 5 === 0; m /= 5) fives++
      }
      return Math.min(twos, fives) === zeros
    },
  }
}

// ================= grade VI =================

/** Primes a, b with 5(a + k) + b = 5a² − m: b is even, so b = 2. (Iași 2009, VI.2 a) */
export function primesParity(rng: Rng): Made {
  const a = pick(rng, [7, 11, 13, 17, 19, 23, 29, 31])
  const N = 5 * a * (a - 1) - 2
  const k = int(rng, 10, Math.min(300, Math.floor((N - 1) / 5)))
  const m = N - 5 * k
  const P = a * (a - 1)
  return {
    text: `Aflați numerele prime $a$ și $b$ pentru care $5(a + ${k}) + b = 5a^2 - ${m}$.`,
    solution: lines(
      'Scoatem $b$:',
      show(`b = 5a^2 - 5a - ${5 * k} - ${m} = 5a(a - 1) - ${N}`),
      `Numerele $a - 1$ și $a$ sunt consecutive, deci produsul lor este par; atunci $5a(a - 1)$ este par și, cum și ${N} este par, $b$ este par. Singurul număr prim par este 2, deci $b = 2$.`,
      show(`5a(a - 1) = ${N + 2} \\Rightarrow (a - 1) \\cdot a = ${P} = ${a - 1} \\cdot ${a} \\Rightarrow a = ${a}`),
      `Cum ${a} este prim, soluția este $a = ${a}$, $b = 2$.`,
    ),
    verify: () => {
      const sols: string[] = []
      for (let x = 2; x < 200; x++) {
        if (!isPrime(x)) continue
        const b = 5 * x * x - m - 5 * (x + k)
        if (isPrime(b)) sols.push(`${x},${b}`)
      }
      return sols.length === 1 && sols[0] === `${a},2`
    },
  }
}

/** (an + b)/(cn + d) is reducible exactly when the prime |ad − bc| divides cn + d. (Iași 2009, VI.3 a) */
export function reducibleFraction(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 9)
    const c = int(rng, 2, 9)
    const b = int(rng, 1, 15)
    const d = int(rng, 1, 15)
    const D = Math.abs(a * d - b * c)
    if (a === c || ![5, 7, 11, 13].includes(D) || c % D === 0) continue
    // the remainder of n for which D divides cn + d
    const r = Array.from({ length: D }, (_, i) => i).find((i) => (c * i + d) % D === 0)!
    const [big, small] = a * d > b * c ? [a * d, b * c] : [b * c, a * d]
    return {
      text: `Determinați numerele naturale $n$ pentru care fracția $\\frac{${a}n + ${b}}{${c}n + ${d}}$ este reductibilă.`,
      solution: lines(
        `Fie $k > 1$ un divizor comun al numărătorului și al numitorului. Atunci $k \\mid ${c}(${a}n + ${b}) = ${a * c}n + ${b * c}$ și $k \\mid ${a}(${c}n + ${d}) = ${a * c}n + ${a * d}$, deci $k$ divide diferența lor: $k \\mid ${big} - ${small} = ${D}$. Cum ${D} este prim, $k = ${D}$.`,
        `Fracția este reductibilă exact când ${D} divide numitorul $${c}n + ${d}$ (atunci divide și numărătorul, după relația de mai sus). Încercăm resturile lui $n$ la împărțirea prin ${D}: pentru $n = ${r}$, $${c} \\cdot ${r} + ${d} = ${c * r + d}$ se divide cu ${D}, iar celelalte resturi nu dau multipli de ${D}.`,
        show(`n = ${D}m${r === 0 ? '' : ` + ${r}`}, \\quad m \\in \\mathbb{N}`),
      ),
      verify: () => Array.from({ length: 200 }, (_, n) => n).every((n) => (gcd(a * n + b, c * n + d) > 1) === (n % D === r)),
    }
  }
}

/** 1/s² + … + 1/n² < 1/(s − 1) − 1/n, from 1/k² < 1/((k − 1)k). (Iași 2009, VI.3 b) */
export function squaresSumBound(rng: Rng): Made {
  const s = int(rng, 2, 4)
  const n = pick(rng, [int(rng, 20, 99), int(rng, 100, 999), int(rng, 2020, 2030)])
  const bound = frac(n - s + 1, (s - 1) * n)
  const t = (k: number | string) => `\\frac{1}{${k}^2}`
  return {
    text: `Arătați că $${t(s)} + ${t(s + 1)} + ${t(s + 2)} + \\ldots + ${t(n)} < ${bound}$.`,
    solution: lines(
      'Micșorăm fiecare numitor: pentru $k \\geq 2$, $k^2 > (k - 1)k$, deci',
      show(`\\frac{1}{k^2} < \\frac{1}{(k - 1)k} = \\frac{1}{k - 1} - \\frac{1}{k}`),
      'Adunăm aceste inegalități; în dreapta, termenii din mijloc se reduc:',
      show(`${t(s)} + \\ldots + ${t(n)} < \\frac{1}{${s - 1}} - \\frac{1}{${s}} + \\frac{1}{${s}} - \\frac{1}{${s + 1}} + \\ldots + \\frac{1}{${n - 1}} - \\frac{1}{${n}} = \\frac{1}{${s - 1}} - \\frac{1}{${n}} = ${bound}`),
    ),
    verify: () => {
      let sum = 0
      for (let k = s; k <= n; k++) sum += 1 / (k * k)
      return sum < (n - s + 1) / ((s - 1) * n)
    },
  }
}

// ================= grade VII =================

/** p divides an + bm, with a + b = p: then p divides am + bn too. (county stage 2009, VII.1) */
export function linearDivisibility(rng: Rng): Made {
  const p = pick(rng, [5, 7, 11, 13])
  const a = int(rng, 1, p - 1)
  const b = p - a
  return {
    text: `Fie $m$ și $n$ numere naturale nenule cu proprietatea că ${p} divide $${k1(a)}n + ${k1(b)}m$. Arătați că ${p} divide și $${k1(a)}m + ${k1(b)}n$.`,
    solution: lines(
      'Adunăm cele două numere:',
      show(`(${k1(a)}n + ${k1(b)}m) + (${k1(a)}m + ${k1(b)}n) = ${a + b}m + ${a + b}n = ${p}(m + n)`),
      `Suma se divide cu ${p}, iar primul termen se divide cu ${p} din ipoteză, deci și diferența lor, $${k1(a)}m + ${k1(b)}n = ${p}(m + n) - (${k1(a)}n + ${k1(b)}m)$, se divide cu ${p}.`,
    ),
    verify: () => {
      for (let m = 1; m <= 30; m++) for (let n = 1; n <= 30; n++) if ((a * n + b * m) % p === 0 && (a * m + b * n) % p !== 0) return false
      return true
    },
  }
}

const DIGIT_RULES: { text: string; ok: (a: number, b: number, c: number) => boolean }[] = [
  { text: '', ok: () => true },
  { text: ', cu $a$, $b$, $c$ cifre distincte', ok: (a, b, c) => a !== b && b !== c && a !== c },
  { text: ', cu $a$, $b$, $c$ cifre nenule', ok: (_, b, c) => b !== 0 && c !== 0 },
  { text: ', număr impar', ok: (_, __, c) => c % 2 === 1 },
  { text: ', număr par', ok: (_, __, c) => c % 2 === 0 },
]
const ROOT_KINDS = [
  { tex: (s: string) => `\\sqrt{${over('abc')}} - \\sqrt{${s}}`, small: 'c', of: (_: number, __: number, c: number) => c, sign: -1 },
  { tex: (s: string) => `\\sqrt{${over('abc')}} + \\sqrt{${s}}`, small: 'c', of: (_: number, __: number, c: number) => c, sign: 1 },
  { tex: (s: string) => `\\sqrt{${over('abc')}} - \\sqrt{${s}}`, small: over('bc'), of: (_: number, b: number, c: number) => 10 * b + c, sign: -1 },
]

/** The numbers abc with √abc ± √c (or − √bc) natural: both must be perfect squares. (Iași 2009, VII.1) */
export function threeDigitRoot(rng: Rng): Made {
  for (;;) {
    const kind = pick(rng, ROOT_KINDS)
    const rule = pick(rng, DIGIT_RULES)
    const found: number[] = []
    for (let n = 100; n <= 999; n++) {
      const [a, b, c] = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10]
      const y = kind.of(a, b, c)
      const v = Math.sqrt(n) + kind.sign * Math.sqrt(y)
      if (rule.ok(a, b, c) && isSquare(n) && isSquare(y) && v > 0) found.push(n)
    }
    if (found.length < 2 || found.length > 12) continue
    const y = kind.small
    return {
      text: `Determinați numerele $${over('abc')}$${rule.text}${rule.text ? ',' : ''} pentru care $${kind.tex(y)} \\in \\mathbb{N}$.`,
      solution: lines(
        `Fie $${kind.tex(y)} = k$, cu $k$ natural${kind.sign < 0 ? '; cum $\\overline{abc} > ' + y + '$, $k \\geq 1$' : ', $k \\geq 1$'}. Atunci $\\sqrt{${over('abc')}} = k ${kind.sign < 0 ? '+' : '-'} \\sqrt{${y}}$ și, ridicând la pătrat,`,
        show(`${over('abc')} = k^2 + ${y} ${kind.sign < 0 ? '+' : '-'} 2k\\sqrt{${y}} \\Rightarrow \\sqrt{${y}} = ${kind.sign < 0 ? `\\frac{${over('abc')} - k^2 - ${y}}{2k}` : `\\frac{k^2 + ${y} - ${over('abc')}}{2k}`}`),
        `Deci $\\sqrt{${y}}$ este rațional, adică $${y}$ este pătrat perfect, și atunci și $\\sqrt{${over('abc')}} = k ${kind.sign < 0 ? '+' : '-'} \\sqrt{${y}}$ este natural: $${over('abc')}$ este pătrat perfect. Căutăm pătratele de trei cifre (de la $10^2$ la $31^2$) cu $${y}$ pătrat perfect${rule.text ? ' și cu condiția din enunț' : ''}:`,
        show(`${over('abc')} \\in \\{${found.join(', ')}\\}`),
      ),
      verify: () => found.every((n) => {
        const [a, b, c] = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10]
        const v = Math.sqrt(n) + kind.sign * Math.sqrt(kind.of(a, b, c))
        return Math.abs(v - Math.round(v)) < 1e-9 && v > 0
      }),
    }
  }
}

/** Integer triples with |x + p| + |y + q| + |z + r| = 1, then how many for N: 4N² + 2. (Iași 2009, VII.2) */
export function absoluteTriples(rng: Rng): Made {
  const p = nonZero(rng, -5, 5)
  const q = nonZero(rng, -5, 5)
  const r = nonZero(rng, -5, 5)
  const N = int(rng, 5, 40)
  const E = `|${plus('x', p)}| + |${plus('y', q)}| + |${plus('z', r)}|`
  const ones: [number, number, number][] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
  const triples = ones.map(([u, v, w]) => `(${u - p}, ${v - q}, ${w - r})`)
  const count = 4 * N * N + 2
  return {
    text: `a) Determinați tripletele de numere întregi $(x, y, z)$ pentru care $${E} = 1$.\n\nb) Câte triplete de numere întregi verifică $${E} = ${N}$?`,
    solution: lines(
      `Notăm $u = ${plus('x', p)}$, $v = ${plus('y', q)}$, $w = ${plus('z', r)}$, numere întregi; tripletele $(x, y, z)$ și $(u, v, w)$ își corespund unul altuia.`,
      `a) $|u| + |v| + |w| = 1$ cere ca unul dintre numere să fie $\\pm 1$, iar celelalte 0: 6 triplete $(u, v, w)$. Revenind la $x = ${plus('u', -p)}$, $y = ${plus('v', -q)}$, $z = ${plus('w', -r)}$:`,
      show(`(x, y, z) \\in \\{${triples.join(', ')}\\}`),
      `b) Numărăm soluțiile lui $|u| + |v| + |w| = ${N}$ după câte numere sunt 0:`,
      `- niciunul: $|u|, |v|, |w| \\geq 1$ cu suma ${N}; valorile absolute se aleg în $\\frac{${N - 1} \\cdot ${N - 2}}{2} = ${((N - 1) * (N - 2)) / 2}$ ${de(((N - 1) * (N - 2)) / 2) === String(((N - 1) * (N - 2)) / 2) ? '' : 'de '}moduri, iar semnele în 8, deci $${4 * (N - 1) * (N - 2)}$;\n- exact unul: alegem care e 0 (3 moduri), celelalte două au suma ${N} în ${de(N - 1)} moduri și 4 combinații de semne: $3 \\cdot ${N - 1} \\cdot 4 = ${12 * (N - 1)}$;\n- exact două: alegem care nu e 0 (3 moduri) și semnul lui (2): 6.`,
      show(`${4 * (N - 1) * (N - 2)} + ${12 * (N - 1)} + 6 = ${count}`),
    ),
    verify: () => {
      let n = 0
      for (let u = -N; u <= N; u++) for (let v = -N + Math.abs(u); v <= N - Math.abs(u); v++) if (N - Math.abs(u) - Math.abs(v) >= 0) n += N - Math.abs(u) - Math.abs(v) === 0 ? 1 : 2
      return n === count
    },
  }
}

/** The minimum (or maximum) of α²x² + 2αpx + c: a square, plus a number. (sheet of minimum and maximum exercises) */
export function minMaxQuadratic(rng: Rng): Made {
  const al = int(rng, 1, 5)
  const p = nonZero(rng, -9, 9)
  const m = int(rng, -15, 20)
  const max = rng() < 0.5
  const s = max ? -1 : 1
  const E = poly([[s * al * al, 'x^2'], [s * 2 * al * p, 'x'], [s * p * p + m, '']])
  const sq = `(${plus(`${k1(al)}x`, p)})^2`
  const at = frac(-p, al)
  const mTex = m < 0 ? `(${m})` : String(m)
  return {
    text: `Determinați valoarea ${max ? 'maximă' : 'minimă'} a expresiei $E(x) = ${E}$, unde $x$ este număr real, și valoarea lui $x$ pentru care se obține.`,
    solution: lines(
      `Formăm un pătrat perfect: $${sq} = ${poly([[al * al, 'x^2'], [2 * al * p, 'x'], [p * p, '']])}$, deci`,
      show(max ? `E(x) = -(${poly([[al * al, 'x^2'], [2 * al * p, 'x'], [p * p, '']])}) + ${mTex} = ${m} - ${sq}` : `E(x) = ${sq} + ${mTex}`),
      `Cum $${sq} \\geq 0$, avem $E(x) ${max ? '\\leq' : '\\geq'} ${m}$, cu egalitate când $${plus(`${k1(al)}x`, p)} = 0$, adică $x = ${at}$.`,
      `Valoarea ${max ? 'maximă' : 'minimă'} este $${m}$, pentru $x = ${at}$.`,
    ),
    verify: () => {
      const f = (x: number) => s * al * al * x * x + s * 2 * al * p * x + s * p * p + m
      const x0 = -p / al
      return close(f(x0), m) && [-1, -0.1, 0.1, 1].every((h) => (max ? f(x0 + h) < m : f(x0 + h) > m))
    },
  }
}

// ================= grade VIII =================

/** a/√(u² + 2 + 2u√2) + b/√(u² + 2 − 2u√2) = √(v² + 2 + 2v√2), with a, b rational. (Iași 2009, VIII.1) */
export function radicalsRational(rng: Rng): Made {
  const u = int(rng, 2, 5)
  let v = int(rng, 1, 6)
  if (v === u) v = u === 6 ? 1 : v + 1
  const D = u * u - 2
  const a = frac(D * (v - u), 2 * u)
  const b = frac(D * (v + u), 2 * u)
  const r = (n: number, sign: '+' | '-') => `\\sqrt{${n * n + 2} ${sign} ${2 * n}\\sqrt{2}}`
  return {
    text: `Aflați numerele raționale $a$ și $b$, știind că $\\frac{a}{${r(u, '+')}} + \\frac{b}{${r(u, '-')}} = ${r(v, '+')}$.`,
    solution: lines(
      `Radicalii dubli sunt pătrate: $${u * u + 2} \\pm ${2 * u}\\sqrt{2} = ${u}^2 \\pm 2 \\cdot ${u} \\cdot \\sqrt{2} + 2 = (${u} \\pm \\sqrt{2})^2$ și, cum $${u} > \\sqrt{2}$,`,
      show(`${r(u, '+')} = ${u} + \\sqrt{2}, \\qquad ${r(u, '-')} = ${u} - \\sqrt{2}, \\qquad ${r(v, '+')} = ${v} + \\sqrt{2}`),
      `Raționalizăm, cu $(${u} + \\sqrt{2})(${u} - \\sqrt{2}) = ${u * u} - 2 = ${D}$:`,
      show(`\\frac{a(${u} - \\sqrt{2}) + b(${u} + \\sqrt{2})}{${D}} = ${v} + \\sqrt{2} \\Rightarrow ${u}(a + b) + (b - a)\\sqrt{2} = ${v * D} + ${D}\\sqrt{2}`),
      `Cum $a$, $b$ sunt raționale, iar $\\sqrt{2}$ este irațional, identificăm: $${u}(a + b) = ${v * D}$ și $b - a = ${D}$, deci $a + b = ${frac(v * D, u)}$ și`,
      show(`a = ${a}, \\qquad b = ${b}`),
    ),
    verify: () => {
      const [an, bn] = [(D * (v - u)) / (2 * u), (D * (v + u)) / (2 * u)]
      const s2 = Math.SQRT2
      return close(an / Math.sqrt(u * u + 2 + 2 * u * s2) + bn / Math.sqrt(u * u + 2 - 2 * u * s2), Math.sqrt(v * v + 2 + 2 * v * s2))
    },
  }
}

/** ab = cd = k² ⇒ (a + p)(b + p)(c + q)(d + q) ≥ ((k + p)(k + q))², from a + b ≥ 2√(ab). (Iași 2009, VIII.3) */
export function productInequality(rng: Rng): Made {
  const k = int(rng, 2, 6)
  const p = int(rng, 1, 6)
  let q = int(rng, 1, 6)
  if (q === p) q = p === 6 ? 1 : p + 1
  const bound = ((k + p) * (k + q)) ** 2
  const half = (x: number, l: string, m: string) => lines(
    show(`(${l} + ${x})(${m} + ${x}) = ${l}${m} + ${x}(${l} + ${m}) + ${x * x} = ${k * k + x * x} + ${x}(${l} + ${m})`),
  )
  return {
    text: `Arătați că, dacă $a, b, c, d$ sunt numere reale pozitive cu $ab = cd = ${k * k}$, atunci $(a + ${p})(b + ${p})(c + ${q})(d + ${q}) \\geq ${bound}$.`,
    solution: lines(
      `Din $(\\sqrt{a} - \\sqrt{b})^2 \\geq 0$ obținem $a + b \\geq 2\\sqrt{ab} = 2 \\cdot ${k} = ${2 * k}$; la fel, $c + d \\geq ${2 * k}$.`,
      half(p, 'a', 'b'),
      `deci $(a + ${p})(b + ${p}) \\geq ${k * k + p * p} + ${p} \\cdot ${2 * k} = ${(k + p) ** 2}$. La fel:`,
      half(q, 'c', 'd'),
      `deci $(c + ${q})(d + ${q}) \\geq ${(k + q) ** 2}$. Înmulțind cele două inegalități între numere pozitive:`,
      show(`(a + ${p})(b + ${p})(c + ${q})(d + ${q}) \\geq ${(k + p) ** 2} \\cdot ${(k + q) ** 2} = ${bound}`),
      `Egalitatea are loc pentru $a = b = c = d = ${k}$.`,
    ),
    verify: () => {
      const f = (a: number, c: number) => (a + p) * (k * k / a + p) * (c + q) * (k * k / c + q)
      return close(f(k, k), bound) && [0.3, 1, 2.5, 9].every((a) => [0.7, 4, 11].every((c) => f(a, c) >= bound - 1e-6))
    },
  }
}

/** α²x² + β²y² + 2αpx + 2βry + p² + r² ≤ 0 (or = 0): two squares, so x = −p/α, y = −r/β. (Model E.N. 9, I.5) */
export function squaresWithCoefficients(rng: Rng): Made {
  for (;;) {
    const al = int(rng, 1, 5)
    const be = int(rng, 1, 5)
    if (al === 1 && be === 1) continue
    const p = nonZero(rng, -6, 6)
    const r = nonZero(rng, -6, 6)
    const atMost = rng() < 0.5
    const E = poly([[al * al, 'x^2'], [be * be, 'y^2'], [2 * al * p, 'x'], [2 * be * r, 'y'], [p * p + r * r, '']])
    const sx = `(${plus(`${k1(al)}x`, p)})^2`
    const sy = `(${plus(`${k1(be)}y`, r)})^2`
    const sum = frac(-p * be - r * al, al * be)
    return {
      text: `Numerele reale $x$ și $y$ verifică $${E} ${atMost ? '\\leq' : '='} 0$. Calculați $x + y$.`,
      solution: lines(
        `Împărțim termenul liber, $${p * p + r * r} = ${p * p} + ${r * r}$, și grupăm:`,
        show(`(${poly([[al * al, 'x^2'], [2 * al * p, 'x'], [p * p, '']])}) + (${poly([[be * be, 'y^2'], [2 * be * r, 'y'], [r * r, '']])}) = ${sx} + ${sy} ${atMost ? '\\leq' : '='} 0`),
        `O sumă de pătrate nu poate fi negativă, deci ${atMost ? 'este 0 și ' : ''}fiecare pătrat este 0: $x = ${frac(-p, al)}$, $y = ${frac(-r, be)}$.`,
        show(`x + y = ${frac(-p, al)} + ${frac(-r, be).startsWith('-') ? `\\left(${frac(-r, be)}\\right)` : frac(-r, be)} = ${sum}`),
      ),
      verify: () => {
        const f = (x: number, y: number) => al * al * x * x + be * be * y * y + 2 * al * p * x + 2 * be * r * y + p * p + r * r
        const [x0, y0] = [-p / al, -r / be]
        return close(f(x0, y0) + 1, 1) && f(x0 + 0.1, y0) > 0 && f(x0, y0 - 0.1) > 0 && close(x0 + y0, (-p * be - r * al) / (al * be))
      },
    }
  }
}
