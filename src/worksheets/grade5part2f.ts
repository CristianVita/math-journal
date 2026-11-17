// Grade V, Mate 2000+ Consolidare, part II (Paralela 45), pp. 201–220, photographed on 14 November 2026: the final
// recap ("Recapitulare finală", I. Teme de recapitulare finală 1–8: natural numbers, divisibility, arithmetic methods,
// fractions, decimals, data, geometry, units of measure) and the five final tests ("Teste de evaluare finală", pp. 215–220).
// Seen: pp. 201–220, all of them. The recap and the tests have no stars: the levels are judged by content.
// Tema 6 (data, p. 208–209) and the bar chart of p. 220 need a table or a diagram to read: left out.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  id: string
  label: string
  topic: 'Algebră' | 'Geometrie'
  forms: Record<1 | 2 | 3, Form[]>
}
/** contest level only: problems from "Supermate", performance, olympiad or Gazeta pages that can be generated */
export interface ContestKind { id: string; label: string; forms: Form[] }

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const math = (items: (string | number)[]) => list(items.map((x) => `$${x}$`))
/** n units of 10^-p with the Romanian comma: dec(1205, 2) = 12{,}05, dec(1250, 2) = 12{,}5, dec(1200, 2) = 12. */
const dec = (n: number, p: number) => {
  const neg = n < 0
  const m = Math.abs(n)
  const d = 10 ** p
  const i = Math.floor(m / d)
  const r = p === 0 ? '' : String(m % d).padStart(p, '0').replace(/0+$/, '')
  return (neg ? '-' : '') + (r ? `${i}{,}${r}` : String(i))
}
/** A measure given in minutes, in degrees and minutes: 1395 → 23^\circ 15'. */
const dm = (m: number) => {
  const d = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${d}^\\circ` : d === 0 ? `${r}'` : `${d}^\\circ ${r}'`
}
const A = (name: string) => `\\sphericalangle ${name}`
const set = (xs: number[]) => `\\{${xs.join(', ')}\\}`
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
const powMod = (b: number, e: number, m: number) => {
  let r = 1 % m
  let x = b % m
  let k = e
  while (k > 0) {
    if (k & 1) r = (r * x) % m
    x = (x * x) % m
    k >>= 1
  }
  return r
}
const NAMES = ['Ana', 'Maria', 'Ioana', 'Elena', 'Alexandra', 'Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Luca']

// ================= 1. natural numbers and divisibility (Teme 1–2, pp. 201–203) =================

/** Two-digit numbers from a condition on their digits. p. 201, ex. 2. */
export function naturalsTwoDigit(rng: Rng): Made {
  for (;;) {
    const mode = pick(rng, ['product', 'sum', 'times', 'diff'] as const)
    const v = mode === 'product' ? int(rng, 4, 48) : mode === 'sum' ? int(rng, 4, 16) : mode === 'times' ? int(rng, 2, 4) : int(rng, 2, 8)
    const test = (a: number, b: number) =>
      mode === 'product' ? a * b === v : mode === 'sum' ? a + b === v : mode === 'times' ? a === v * b || b === v * a : Math.abs(a - b) === v
    const found: number[] = []
    for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) if (test(a, b) && !(mode === 'times' && b === 0)) found.push(10 * a + b)
    if (found.length < 2 || found.length > 10) continue
    const cond = mode === 'product' ? `produsul cifrelor este ${v}` : mode === 'sum' ? `suma cifrelor este ${v}` : mode === 'times' ? `una dintre cifre este de ${v} ori mai mare decât cealaltă` : `diferența dintre cifra mai mare și cifra mai mică este ${v}`
    const how = mode === 'product'
      ? `Scriem ${v} ca produs de două cifre, în toate felurile posibile.`
      : mode === 'sum' ? `Căutăm perechile de cifre cu suma ${v}, cu cifra zecilor $a \\neq 0$.`
        : mode === 'times' ? `Perechile de cifre nenule în care una este de ${v} ori cealaltă: ${math(found.filter((n) => Math.floor(n / 10) < n % 10).map((n) => `(${Math.floor(n / 10)}, ${n % 10})`))}. Fiecare pereche dă două numere.`
          : `Căutăm perechile de cifre care diferă cu ${v}, cu cifra zecilor $a \\neq 0$.`
    return {
      text: `Determinați numerele de forma $\\overline{ab}$, știind că ${cond}.`,
      solution: lines(how, `Numerele sunt: ${math(found)} (${found.length} numere).`),
      verify: () => found.every((n) => test(Math.floor(n / 10), n % 10)) && new Set(found).size === found.length,
    }
  }
}

/** Three numbers from sums of two. p. 201, ex. 6. */
export function naturalsPairSums(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 20, 300)
    const b = int(rng, 10, 280)
    const c = int(rng, 10, 280)
    if (a <= b) continue
    if (rng() < 0.5) {
      const [x, y, z] = [a + b, b + c, a + c]
      const S = (x + y + z) / 2
      return {
        text: `Determinați trei numere $a$, $b$, $c$, știind că $a + b = ${x}$, $b + c = ${y}$ și $a + c = ${z}$.`,
        solution: lines(
          'Adunăm cele trei egalități; fiecare număr apare de două ori:',
          show(`2 \\cdot (a + b + c) = ${x} + ${y} + ${z} = ${x + y + z}, \\quad a + b + c = ${S}`),
          show(`a = ${S} - ${y} = ${a}, \\quad b = ${S} - ${z} = ${b}, \\quad c = ${S} - ${x} = ${c}`),
        ),
        verify: () => a + b === x && b + c === y && a + c === z && Number.isInteger(S),
      }
    }
    const [S, d, y] = [a + b + c, a - b, b + c]
    return {
      text: `Determinați trei numere $a$, $b$, $c$, știind că $a + b + c = ${S}$, $a - b = ${d}$ și $b + c = ${y}$.`,
      solution: lines(
        show(`a = (a + b + c) - (b + c) = ${S} - ${y} = ${S - y}`),
        show(`b = a - (a - b) = ${a} - ${d} = ${a - d}, \\quad c = (b + c) - b = ${y} - ${b} = ${y - b}`),
      ),
      verify: () => S - y === a && a - d === b && y - b === c,
    }
  }
}

/** Division with remainder and its check. p. 201, ex. 12. */
export function naturalsDivisionProof(rng: Rng): Made {
  const d = int(rng, 3, 150)
  const q = d > 40 ? int(rng, 2, 30) : int(rng, 5, 200)
  const r = int(rng, 0, d - 1)
  const D = d * q + r
  return {
    text: `Calculați câtul și restul împărțirii $${D} : ${d}$, apoi faceți proba.`,
    solution: lines(
      `Câtul este ${q}, iar restul este ${r}${r === 0 ? ' (împărțirea este exactă)' : ''}, cu $${r} < ${d}$.`,
      'Proba (teorema împărțirii cu rest):',
      show(`${d} \\cdot ${q} + ${r} = ${d * q} + ${r} = ${D}`),
    ),
    verify: () => Math.floor(D / d) === q && D % d === r,
  }
}

/** a + 2b = 24 and 3a + 5b = 65: a third expression from the two. p. 201, ex. 10. */
export function naturalsCombination(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 20)
    const b = int(rng, 1, 20)
    const [p, q, r, s] = [int(rng, 1, 5), int(rng, 1, 6), int(rng, 1, 6), int(rng, 1, 7)]
    if (p * s === q * r) continue
    const [m, n] = pick(rng, [[1, 1], [2, 1], [1, 2], [1, -1], [-1, 1], [3, 1], [1, 3]] as const)
    const t = m * p + n * r
    const u = m * q + n * s
    if (t <= 0 || u <= 0) continue
    const X = p * a + q * b
    const Y = r * a + s * b
    const e1 = `${p === 1 ? '' : p}a + ${q === 1 ? '' : q}b`
    const e2 = `${r === 1 ? '' : r}a + ${s === 1 ? '' : s}b`
    const target = `${t === 1 ? '' : t}a + ${u === 1 ? '' : u}b`
    const part = (k: number, e: string, first: boolean) => (k === 1 ? (first ? '' : ' + ') + `(${e})` : k === -1 ? (first ? '-' : ' - ') + `(${e})` : (first ? '' : ' + ') + `${k}(${e})`)
    const partN = (k: number, v: number, first: boolean) => (k === 1 ? (first ? '' : ' + ') + v : k === -1 ? (first ? '-' : ' - ') + v : (first ? '' : ' + ') + `${k} \\cdot ${v}`)
    const res = m * X + n * Y
    return {
      text: `Dacă $${e1} = ${X}$ și $${e2} = ${Y}$, calculați $${target}$.`,
      solution: lines(
        'Scriem expresia cerută cu ajutorul celor două sume cunoscute:',
        show(`${target} = ${part(m, e1, true)}${part(n, e2, false)}`),
        show(`${target} = ${partN(m, X, true)}${partN(n, Y, false)} = ${res}`),
      ),
      verify: () => t * a + u * b === res,
    }
  }
}

/** The same number subtracted from (or added to) three numbers. p. 201, ex. 8. */
export function naturalsSubtractSame(rng: Rng): Made {
  const add = rng() < 0.4
  const k = int(rng, 5, 90)
  const res = [int(rng, add ? k + 5 : 10, 200), int(rng, add ? k + 5 : 10, 200), int(rng, add ? k + 5 : 10, 200)]
  const orig = res.map((x) => (add ? x - k : x + k))
  const S = orig[0] + orig[1] + orig[2]
  const R = res[0] + res[1] + res[2]
  return {
    text: `Determinați numerele $a$, $b$ și $c$, știind că $a + b + c = ${S}$ și că, ${add ? 'adunând la fiecare' : 'scăzând din fiecare'} același număr, obținem numerele ${res[0]}, ${res[1]} și, respectiv, ${res[2]}.`,
    solution: lines(
      `Suma noilor numere este $${res.join(' + ')} = ${R}$.`,
      add
        ? `Suma a crescut cu de trei ori numărul adunat: $${R} - ${S} = ${R - S}$, deci numărul adunat este $${R - S} : 3 = ${k}$.`
        : `Suma a scăzut cu de trei ori numărul scăzut: $${S} - ${R} = ${S - R}$, deci numărul scăzut este $${S - R} : 3 = ${k}$.`,
      show(`a = ${res[0]} ${add ? '-' : '+'} ${k} = ${orig[0]}, \\quad b = ${res[1]} ${add ? '-' : '+'} ${k} = ${orig[1]}, \\quad c = ${res[2]} ${add ? '-' : '+'} ${k} = ${orig[2]}`),
    ),
    verify: () => orig[0] + orig[1] + orig[2] === S && Math.abs(R - S) === 3 * k,
  }
}

/** Numbers of a form with two unknown digits divisible by two numbers. p. 202, ex. 7–9. */
export function naturalsDigitsDivisible(rng: Rng): Made {
  for (;;) {
    const [d1, d2] = pick(rng, [[2, 9], [5, 9], [2, 3], [5, 3], [10, 3], [10, 9]] as const)
    const f1 = int(rng, 0, 9)
    const f2 = int(rng, 0, 9)
    const rows: [number, number[]][] = []
    const all: number[] = []
    for (let y = 0; y <= 9; y++) {
      const xs: number[] = []
      for (let x = 1; x <= 9; x++) {
        const n = 1000 * x + 100 * f1 + 10 * f2 + y
        if (n % d1 === 0 && n % d2 === 0) {
          xs.push(x)
          all.push(n)
        }
      }
      if (xs.length) rows.push([y, xs])
    }
    if (all.length < 2 || all.length > 12) continue
    const last = d1 === 2 ? 'o cifră pară' : d1 === 5 ? '$0$ sau $5$' : '$0$'
    return {
      text: `Scrieți toate numerele naturale de forma $\\overline{x${f1}${f2}y}$ divizibile cu ${d1} și cu ${d2}.`,
      solution: lines(
        `Din divizibilitatea cu ${d1}, ultima cifră $y$ este ${last}. Din divizibilitatea cu ${d2}, suma cifrelor $x + ${f1} + ${f2} + y = x + y + ${f1 + f2}$ se divide cu ${d2}; cifra $x$ nu poate fi 0.`,
        rows.map(([y, xs]) => `Pentru $y = ${y}$: $x \\in ${set(xs)}$.`).join('\n\n'),
        `Numerele sunt: ${math(all)}.`,
      ),
      verify: () => {
        const re = new RegExp(`^[1-9]${f1}${f2}[0-9]$`)
        let count = 0
        for (let n = 1000; n <= 9999; n++) if (re.test(String(n)) && n % (d1 * d2 / gcd(d1, d2)) === 0) count++
        return count === all.length
      },
    }
  }
}

/** The sum of two primes is odd: one of them is 2. p. 203, ex. 12. */
export function naturalsTwoPrimes(rng: Rng): Made {
  for (;;) {
    const S = 2 * int(rng, 4, 150) + 1
    if (!isPrime(S - 2)) continue
    const p = S - 2
    return {
      text: `Suma a două numere prime este ${S}. Calculați diferența și produsul numerelor.`,
      solution: lines(
        `Suma ${S} este impară, deci un număr este par și celălalt impar. Singurul număr prim par este 2, așa că celălalt este $${S} - 2 = ${p}$ (care este într-adevăr prim).`,
        show(`${p} - 2 = ${p - 2}, \\qquad ${p} \\cdot 2 = ${2 * p}`),
      ),
      verify: () => isPrime(p) && p + 2 === S && S % 2 === 1,
    }
  }
}

/** The last digit (remainder by 10) of a sum of three large powers. p. 202, ex. 20; p. 201, ex. 15. */
export function naturalsLastDigitSum(rng: Rng): Made {
  const bases = shuffle(rng, [2, 3, 4, 7, 8, 9, 5, 6]).slice(0, 3).sort((x, y) => x - y)
  const exps = bases.map(() => int(rng, 2000, 2040))
  const cycle = (b: number) => {
    const out: number[] = []
    let x = b % 10
    while (!out.includes(x)) {
      out.push(x)
      x = (x * b) % 10
    }
    return out
  }
  const lasts = bases.map((b, i) => {
    const c = cycle(b)
    const r = exps[i] % c.length
    return { c, r, u: c[(r + c.length - 1) % c.length] }
  })
  const total = lasts.reduce((s, l) => s + l.u, 0)
  const ans = total % 10
  const A = bases.map((b, i) => `${b}^{${exps[i]}}`).join(' + ')
  return {
    text: `Calculați restul împărțirii numărului $A = ${A}$ la 10.`,
    solution: lines(
      'Restul împărțirii la 10 este ultima cifră a numărului. Căutăm ultima cifră a fiecărei puteri.',
      ...bases.map((b, i) => {
        const { c, r, u } = lasts[i]
        return c.length === 1
          ? `Toate puterile lui ${b} se termină în ${b}, deci $u(${b}^{${exps[i]}}) = ${u}$.`
          : `Ultimele cifre ale puterilor lui ${b} se repetă din ${c.length} în ${c.length}: ${c.join(', ')}. Cum $${exps[i]} = ${c.length} \\cdot ${Math.floor(exps[i] / c.length)} + ${r}$, avem $u(${b}^{${exps[i]}}) = ${u}$.`
      }),
      show(`u(A) = u(${lasts.map((l) => l.u).join(' + ')}) = u(${total}) = ${ans}`),
      `Restul este ${ans}.`,
    ),
    verify: () => bases.reduce((s, b, i) => s + powMod(b, exps[i], 10), 0) % 10 === ans,
  }
}

/** n + 2·(1 + 2 + … + (n − 1)) and 1 + 3 + … + (2k − 1) are perfect squares. p. 201, ex. 17; p. 202, ex. 24; p. 219, III.1. */
export function naturalsGaussSquare(rng: Rng): Made {
  if (rng() < 0.55) {
    const n = int(rng, 100, 2100)
    const half = ((n - 1) * n) / 2
    return {
      text: `Arătați că numărul $N = ${n} + 2 \\cdot (1 + 2 + 3 + \\ldots + ${n - 1})$ este pătrat perfect.`,
      solution: lines(
        'Cu formula lui Gauss:',
        show(`1 + 2 + \\ldots + ${n - 1} = \\frac{${n - 1} \\cdot ${n}}{2}`),
        show(`N = ${n} + 2 \\cdot \\frac{${n - 1} \\cdot ${n}}{2} = ${n} + ${n - 1} \\cdot ${n} = ${n} \\cdot (1 + ${n - 1}) = ${n}^2`),
        `Deci $N = ${n}^2$ este pătrat perfect.`,
      ),
      verify: () => n + 2 * half === n * n,
    }
  }
  const k = int(rng, 20, 1100)
  return {
    text: `Arătați că numărul $N = 1 + 3 + 5 + \\ldots + ${2 * k - 1}$ este pătrat perfect.`,
    solution: lines(
      `Termenii sunt numerele impare de la 1 la ${2 * k - 1}; numărul lor este $(${2 * k - 1} + 1) : 2 = ${k}$.`,
      show(`N = \\frac{(1 + ${2 * k - 1}) \\cdot ${k}}{2} = \\frac{${2 * k} \\cdot ${k}}{2} = ${k} \\cdot ${k} = ${k}^2`),
      `Deci $N$ este pătrat perfect.`,
    ),
    verify: () => {
      let s = 0
      for (let i = 1; i <= 2 * k - 1; i += 2) s += i
      return s === k * k
    },
  }
}

/** p + p² + … + p^E divisible by 1 + p (or 1 + p + p²), grouping the terms. p. 203, ex. 19. */
export function naturalsPowerSumDivisible(rng: Rng): Made {
  const g = rng() < 0.6 ? 2 : 3
  const p = g === 2 ? int(rng, 2, 9) : int(rng, 2, 6)
  const E = g * int(rng, Math.ceil(1000 / g), Math.floor(2100 / g))
  const D = g === 2 ? 1 + p : 1 + p + p * p
  const grp = g === 2 ? `(1 + ${p})` : `(1 + ${p} + ${p}^2)`
  const firsts = g === 2 ? [`${p}`, `${p}^3`, `${p}^{${E - 1}}`] : [`${p}`, `${p}^4`, `${p}^{${E - 2}}`]
  return {
    text: `Arătați că numărul $A = ${p} + ${p}^2 + ${p}^3 + \\ldots + ${p}^{${E}}$ este divizibil cu ${D}.`,
    solution: lines(
      `Suma are ${E} termeni; îi grupăm câte ${g}, deci obținem ${E / g} grupe:`,
      show(`A = ${firsts[0]} \\cdot ${grp} + ${firsts[1]} \\cdot ${grp} + \\ldots + ${firsts[2]} \\cdot ${grp}`),
      show(`A = ${D} \\cdot (${firsts[0]} + ${firsts[1]} + \\ldots + ${firsts[2]})`),
      `Deci $A$ este divizibil cu ${D}.`,
    ),
    verify: () => {
      let s = 0
      for (let e = 1; e <= E; e++) s = (s + powMod(p, e, D)) % D
      return s === 0 && E % g === 0
    },
  }
}

// ================= 2. arithmetic methods (Tema 3, pp. 203–204) =================

const GOODS: [string, string][] = [['seturi de creioane colorate', 'un set'], ['caiete', 'un caiet'], ['cărți', 'o carte'], ['mingi', 'o minge'], ['pixuri', 'un pix'], ['bilete', 'un bilet']]

/** n things cost T, how much m of them. p. 203, ex. 1, ex. 3. */
export function methodsUnitPrice(rng: Rng): Made {
  const [items, one] = pick(rng, GOODS)
  for (;;) {
    const n = int(rng, 2, 9)
    const m = int(rng, 2, 15)
    if (m === n) continue
    const p = int(rng, 3, 45)
    return {
      text: `${de(n)} ${items} de același fel costă ${de(n * p)} lei. Cât costă ${de(m)} ${items} de același fel?`,
      solution: lines(
        `Aflăm mai întâi cât costă ${one} (metoda reducerii la unitate):`,
        show(`${n * p} : ${n} = ${p} \\text{ lei}`),
        show(`${m} \\cdot ${p} = ${m * p} \\text{ lei}`),
        `Răspuns: ${de(m * p)} lei.`,
      ),
      verify: () => (n * p) / n * m === m * p,
    }
  }
}

/** Three consecutive (even, odd) numbers with a given sum. p. 204, ex. 9, ex. 11. */
export function methodsConsecutive(rng: Rng): Made {
  const kind = pick(rng, ['naturale', 'pare', 'impare'] as const)
  const step = kind === 'naturale' ? 1 : 2
  let x = int(rng, 10, 700)
  if (kind === 'pare' && x % 2) x++
  if (kind === 'impare' && x % 2 === 0) x++
  const S = 3 * x + 3 * step
  const what = kind === 'naturale' ? 'trei numere naturale consecutive' : `trei numere naturale ${kind} consecutive`
  return {
    text: `Suma a ${what} este ${S}. Aflați cele trei numere.`,
    solution: lines(
      `Dacă cel mai mic număr este $x$, celelalte sunt $x + ${step}$ și $x + ${2 * step}$:`,
      show(`x + (x + ${step}) + (x + ${2 * step}) = ${S}, \\quad 3x + ${3 * step} = ${S}, \\quad 3x = ${S - 3 * step}, \\quad x = ${x}`),
      `Numerele sunt ${x}, ${x + step} și ${x + 2 * step}.`,
    ),
    verify: () => x + x + step + x + 2 * step === S && (step === 1 || (kind === 'pare') === (x % 2 === 0)),
  }
}

/** Workers and days (inverse proportion), also with workers joining from the first day. p. 203, ex. 2, ex. 4. */
export function methodsWorkersInverse(rng: Rng): Made {
  for (;;) {
    const w = int(rng, 3, 20)
    const d = int(rng, 4, 30)
    const join = rng() < 0.5
    const w2 = join ? w + int(rng, 1, 20) : int(rng, 2, 30)
    if (w2 === w || (w * d) % w2 !== 0) continue
    const d2 = (w * d) / w2
    const text = join
      ? `${de(w)} muncitori pot termina o lucrare în ${de(d)} zile. În câte zile se termină lucrarea, dacă încă din prima zi se alătură echipei alți ${de(w2 - w)} muncitori, care lucrează la fel?`
      : `O echipă formată din ${de(w)} muncitori termină o lucrare în ${de(d)} zile. Câte zile ar dura lucrarea, dacă ar fi făcută de o echipă de ${de(w2)} muncitori, care lucrează la fel?`
    return {
      text,
      solution: lines(
        `Un singur muncitor ar termina lucrarea în ${de(w * d)} zile ($${w} \\cdot ${d} = ${w * d}$).`,
        join ? `Echipa are acum $${w} + ${w2 - w} = ${w2}$ muncitori, care lucrează de ${w2} ori mai repede decât unul singur:` : `${de(w2)} muncitori lucrează de ${w2} ori mai repede decât unul singur:`,
        show(`${w * d} : ${w2} = ${d2}`),
        `Răspuns: ${d2 === 1 ? 'o zi' : `${de(d2)} zile`}.`,
      ),
      verify: () => w2 * d2 === w * d,
    }
  }
}

/** Sum (or difference) of two numbers and the quotient with remainder. p. 203, ex. 7; p. 204, ex. 8; p. 215, II.3. */
export function methodsSumQuotient(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 15, 400)
    const q = int(rng, 2, 9)
    const r = int(rng, 1, s - 1)
    if (r > 99) continue
    const b = q * s + r
    const sum = rng() < 0.5
    const T = sum ? b + s : b - s
    return {
      text: `${sum ? 'Suma' : 'Diferența'} a două numere naturale este ${T}. Dacă împărțim numărul mare la cel mic, obținem câtul ${q} și restul ${r}. Aflați cele două numere.`,
      solution: lines(
        `Numărul mare este de ${q} ori cel mic, plus ${r}. Reprezentăm numărul mic printr-un segment: numărul mare are ${q} astfel de segmente și încă ${r}.`,
        sum
          ? `Suma are ${q + 1} segmente și încă ${r}:`
          : `Diferența are ${q - 1} ${q - 1 === 1 ? 'segment' : 'segmente'} și încă ${r}:`,
        show(sum ? `(${T} - ${r}) : ${q + 1} = ${T - r} : ${q + 1} = ${s}` : `(${T} - ${r}) : ${q - 1} = ${T - r} : ${q - 1} = ${s}`),
        `Numărul mic este ${s}, iar cel mare este $${q} \\cdot ${s} + ${r} = ${b}$.`,
      ),
      verify: () => Math.floor(b / s) === q && b % s === r && (sum ? b + s : b - s) === T,
    }
  }
}

const PAIRS: [string, string, string, string][] = [
  ['păpuși', 'mașinuțe', 'o păpușă', 'o mașinuță'],
  ['caiete', 'pixuri', 'un caiet', 'un pix'],
  ['cărți', 'reviste', 'o carte', 'o revistă'],
  ['mingi', 'rachete', 'o minge', 'o rachetă'],
  ['tricouri', 'șepci', 'un tricou', 'o șapcă'],
]
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

/** a things of one kind and b of another, then b and a: the two prices. p. 203, ex. 5. */
export function methodsTwoItems(rng: Rng): Made {
  for (;;) {
    const [X, Y, x1, y1] = pick(rng, PAIRS)
    const a = int(rng, 2, 6)
    const b = int(rng, 1, a - 1)
    const p = int(rng, 5, 90)
    const c = int(rng, 5, 90)
    if (p === c) continue
    const [n1, n2] = shuffle(rng, NAMES).slice(0, 2)
    const S1 = a * p + b * c
    const S2 = b * p + a * c
    const qty = (n: number, plural: string, single: string) => (n === 1 ? single : `${n} ${plural}`)
    const D = Math.abs(p - c)
    const [hi, lo] = p > c ? [x1, y1] : [y1, x1]
    return {
      text: `${n1} cumpără ${qty(a, X, x1)} și ${qty(b, Y, y1)}, pentru care plătește ${de(S1)} lei. ${n2} cumpără ${qty(b, X, x1)} și ${qty(a, Y, y1)} de același fel și plătește ${de(S2)} lei. Aflați cât costă ${x1} și cât costă ${y1}.`,
      solution: lines(
        `Împreună, cei doi au cumpărat ${a + b} ${X} și ${a + b} ${Y}, adică de ${a + b} ori „${x1} și ${y1}”:`,
        show(`(${S1} + ${S2}) : ${a + b} = ${S1 + S2} : ${a + b} = ${p + c} \\text{ lei}`),
        `${n1} a cumpărat cu ${qty(a - b, X, x1)} mai mult și cu ${qty(a - b, Y, y1)} mai puțin decât ${n2}, iar diferența sumelor plătite este $${Math.max(S1, S2)} - ${Math.min(S1, S2)} = ${Math.abs(S1 - S2)}$ lei:`,
        show(`${Math.abs(S1 - S2)} : ${a - b} = ${D} \\text{ lei}`),
        `${cap(hi)} costă cu ${de(D)} lei mai mult decât ${lo}:`,
        show(`(${p + c} + ${D}) : 2 = ${Math.max(p, c)} \\text{ lei}, \\quad ${p + c} - ${Math.max(p, c)} = ${Math.min(p, c)} \\text{ lei}`),
        `Răspuns: ${x1} costă ${de(p)} lei, iar ${y1} costă ${de(c)} lei.`,
      ),
      verify: () => a * p + b * c === S1 && b * p + a * c === S2 && Math.abs(S1 - S2) === (a - b) * D,
    }
  }
}

/** Working backwards through a chain of operations. p. 204, ex. 12, ex. 13, ex. 15. */
export function methodsBackwards(rng: Rng): Made {
  if (rng() < 0.5) {
    const d = pick(rng, [2, 3, 4, 5])
    const part = ['', '', 'jumătatea', 'treimea', 'sfertul', 'cincimea'][d]
    const m = int(rng, 2, 9)
    const s = int(rng, 5, 60)
    const k = int(rng, 3, 40)
    const x = d * k
    const R = k * m - s
    if (R <= 0) return methodsBackwards(rng)
    return {
      text: `Mă gândesc la un număr. Îi înmulțesc ${part} cu ${m}, rezultatul îl micșorez cu ${s} și obțin ${R}. La ce număr m-am gândit?`,
      solution: lines(
        'Mergem de la sfârșit spre început, făcând operațiile inverse:',
        show(`${R} + ${s} = ${R + s}, \\quad ${R + s} : ${m} = ${k}, \\quad ${k} \\cdot ${d} = ${x}`),
        `M-am gândit la numărul ${x}.`,
      ),
      verify: () => (x / d) * m - s === R,
    }
  }
  for (;;) {
    const x = int(rng, 1, 200)
    const a = int(rng, 2, 100)
    const b = int(rng, 2, 9)
    const c = int(rng, 1, 50)
    const e = int(rng, 2, 9)
    if ((x + a) % b !== 0) continue
    const t = (x + a) / b - c
    if (t <= 0 || t % e !== 0) continue
    const R = t / e
    return {
      text: `Un număr se adună cu ${a}, suma obținută se micșorează de ${b} ori, rezultatul se micșorează cu ${c}, iar noul rezultat se împarte la ${e}, obținându-se astfel ${R}. Determinați numărul.`,
      solution: lines(
        'Mergem de la sfârșit spre început, făcând operațiile inverse:',
        show(`${R} \\cdot ${e} = ${t}, \\quad ${t} + ${c} = ${t + c}, \\quad ${t + c} \\cdot ${b} = ${x + a}, \\quad ${x + a} - ${a} = ${x}`),
        `Numărul este ${x}.`,
      ),
      verify: () => ((x + a) / b - c) / e === R,
    }
  }
}

/** Benches with k₁ and with k₂ pupils each: the benches and the pupils. p. 204, ex. 10. */
export function methodsBenches(rng: Rng): Made {
  for (;;) {
    const [k1, k2] = pick(rng, [[2, 3], [3, 4], [2, 4], [2, 5]] as const)
    const n2 = int(rng, 3, 20)
    if ((k2 * n2) % k1 !== 0) continue
    const n1 = (k2 * n2) / k1
    const f1 = int(rng, 1, 5)
    const B = n1 + f1 + 1
    const f2 = B - n2 - 1
    const N = k1 * n1 + 1
    const free = (f: number) => (f === 1 ? 'rămâne o bancă liberă' : `rămân ${de(f)} bănci libere`)
    const lhs = k2 * (f2 + 1) - k1 * (f1 + 1)
    return {
      text: `Într-o sală de clasă, dacă se așază câte ${k1} elevi într-o bancă, ${free(f1)}, iar în una dintre bănci stă un singur elev. Dacă se așază câte ${k2} elevi într-o bancă, ${free(f2)}, iar în una dintre bănci stă un singur elev. Aflați câte bănci și câți elevi sunt în sală.`,
      solution: lines(
        `Fie $b$ numărul băncilor. În primul caz, băncile pline sunt $b - ${f1} - 1 = b - ${f1 + 1}$, în al doilea $b - ${f2} - 1 = b - ${f2 + 1}$. Fără elevul care stă singur, numărul elevilor este același:`,
        show(`${k1} \\cdot (b - ${f1 + 1}) = ${k2} \\cdot (b - ${f2 + 1})`),
        show(`${k1}b - ${k1 * (f1 + 1)} = ${k2}b - ${k2 * (f2 + 1)}, \\quad ${k2 - k1 === 1 ? '' : k2 - k1}b = ${lhs}${k2 - k1 === 1 ? '' : `, \\quad b = ${B}`}`),
        show(`\\text{elevi: } ${k1} \\cdot ${n1} + 1 = ${N}`),
        `Răspuns: ${de(B)} bănci și ${de(N)} elevi.`,
      ),
      verify: () => (k2 - k1) * B === lhs && k2 * (B - f2 - 1) + 1 === N && f2 > 0,
    }
  }
}

/** A route walked in three days by fractions of what was left. p. 204, ex. 14. */
export function methodsJourney(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 5)
    const b = int(rng, 2, 5)
    const [c, d] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]] as const)
    const T = a * b * d * int(rng, 1, 12)
    const day1 = T / a
    const r1 = T - day1
    if (r1 % b) continue
    const day2 = r1 / b
    const r2 = r1 - day2
    if ((r2 * c) % d) continue
    const day3 = (r2 * c) / d
    const R = r2 - day3
    if (R < 2 || T > 400) continue
    const pa = ['', '', 'jumătate', 'o treime', 'o pătrime', 'o cincime'][a]
    const pb = ['', '', 'jumătate', 'o treime', 'o pătrime', 'o cincime'][b]
    return {
      text: lines(
        `Un excursionist a parcurs un traseu în trei zile. În prima zi a parcurs ${pa} din traseu, a doua zi ${pb} din ce mai avea de parcurs, iar a treia zi $${frac(c, d)}$ din noul rest și a constatat că mai avea de parcurs încă ${R} km. Calculați:`,
        'a) lungimea traseului;',
        'b) câți kilometri a parcurs în fiecare zi.',
      ),
      solution: lines(
        `a) Mergem de la sfârșit. A treia zi a parcurs $${frac(c, d)}$ din restul de după ziua a doua, deci cei ${R} km rămași sunt $${frac(d - c, d)}$ din acest rest:`,
        show(`${R} : ${frac(d - c, d)} = ${r2} \\text{ km}`),
        `Cei ${r2} km sunt $${frac(b - 1, b)}$ din restul de după prima zi:`,
        show(`${r2} : ${frac(b - 1, b)} = ${r1} \\text{ km}`),
        `Cei ${r1} km sunt $${frac(a - 1, a)}$ din traseu:`,
        show(`${r1} : ${frac(a - 1, a)} = ${T} \\text{ km}`),
        `b) Prima zi: $${T} : ${a} = ${day1}$ km; a doua zi: $${r1} : ${b} = ${day2}$ km; a treia zi: $${frac(c, d)} \\cdot ${r2} = ${day3}$ km.`,
      ),
      verify: () => day1 + day2 + day3 + R === T && day1 * a === T,
    }
  }
}

/** Bottles of two sizes holding a given volume (false hypothesis). p. 204, ex. 23. */
export function methodsBottles(rng: Rng): Made {
  for (;;) {
    const [v1, v2] = pick(rng, [[50, 75], [50, 100], [25, 50], [75, 100], [100, 150], [50, 150], [25, 75]] as const)
    const n = int(rng, 10, 60)
    const y = int(rng, 1, n - 1)
    const x = n - y
    const V = x * v1 + y * v2
    const liquid = pick(rng, ['sirop de căpșuni', 'suc de mere', 'ulei', 'apă minerală', 'sirop de soc'])
    return {
      text: `Pentru a îmbutelia $${dec(V, 2)}$ l de ${liquid} s-au folosit ${de(n)} sticle, unele de $${dec(v1, 2)}$ l, altele de $${dec(v2, 2)}$ l, toate pline. Câte sticle de fiecare fel s-au folosit?`,
      solution: lines(
        `Presupunem că toate cele ${de(n)} sticle ar fi de $${dec(v1, 2)}$ l:`,
        show(`${n} \\cdot ${dec(v1, 2)} = ${dec(n * v1, 2)} \\text{ l}`),
        `Lipsesc $${dec(V, 2)} - ${dec(n * v1, 2)} = ${dec(V - n * v1, 2)}$ l. O sticlă de $${dec(v2, 2)}$ l are cu $${dec(v2 - v1, 2)}$ l mai mult:`,
        show(`${dec(V - n * v1, 2)} : ${dec(v2 - v1, 2)} = ${y}`),
        `Răspuns: ${de(y)} sticle de $${dec(v2, 2)}$ l și $${n} - ${y} = ${x}$ sticle de $${dec(v1, 2)}$ l.`,
      ),
      verify: () => (V - n * v1) / (v2 - v1) === y && x * v1 + y * v2 === V,
    }
  }
}

// ================= 3. fractions and decimals (Teme 4–5, pp. 205–208) =================

/** Fractions with the same denominator or the same numerator in increasing order. p. 205, ex. 2. */
export function fractionsOrder(rng: Rng): Made {
  const sameDen = rng() < 0.5
  const fixed = int(rng, 3, 25)
  const vars = shuffle(rng, Array.from({ length: 40 }, (_, i) => i + 1)).slice(0, 5)
  const fr = vars.map((v) => (sameDen ? [v, fixed] : [fixed, v]) as [number, number])
  const sorted = [...fr].sort((x, y) => x[0] * y[1] - y[0] * x[1])
  const t = (f: [number, number]) => `\\frac{${f[0]}}{${f[1]}}`
  return {
    text: `Scrieți în ordine crescătoare fracțiile: $${fr.map(t).join(', \\ ')}$.`,
    solution: lines(
      sameDen
        ? 'Fracțiile au același numitor, deci este mai mare fracția cu numărătorul mai mare.'
        : 'Fracțiile au același numărător, deci este mai mare fracția cu numitorul mai mic.',
      show(sorted.map(t).join(' < ')),
    ),
    verify: () => sorted.every((f, i) => i === 0 || f[0] / f[1] > sorted[i - 1][0] / sorted[i - 1][1]),
  }
}

/** Percents as irreducible fractions and fractions with denominator 100 as percents. p. 205, ex. 6, ex. 7. */
export function fractionsPercents(rng: Rng): Made {
  const ps = shuffle(rng, Array.from({ length: 299 }, (_, i) => i + 1).filter((p) => p % 100 !== 0)).slice(0, 4).sort((x, y) => x - y)
  const back = rng() < 0.3
  if (back) {
    return {
      text: `Scrieți ca procente fracțiile: $${ps.map((p) => `\\frac{${p}}{100}`).join(', \\ ')}$.`,
      solution: lines('O fracție cu numitorul 100 se scrie direct ca procent: $\\frac{p}{100} = p\\%$.', show(ps.map((p) => `\\frac{${p}}{100} = ${p}\\%`).join(', \\quad '))),
      verify: () => ps.every((p) => p > 0 && p < 300),
    }
  }
  return {
    text: `Scrieți ca fracții ordinare ireductibile procentele: $${ps.map((p) => `${p}\\%`).join(', \\ ')}$.`,
    solution: lines(
      'Scriem fiecare procent ca fracție cu numitorul 100, apoi simplificăm cu cel mai mare divizor comun:',
      ...ps.map((p) => (gcd(p, 100) === 1 ? show(`${p}\\% = \\frac{${p}}{100}`) + ' (fracția este deja ireductibilă)' : show(`${p}\\% = \\frac{${p}}{100} = ${frac(p, 100)}`))),
    ),
    verify: () => ps.every((p) => {
      const [n, d] = reduce(p, 100)
      return gcd(n, d) === 1 && n * 100 === p * d
    }),
  }
}

/** Find n: 2,71 = n/100, 5,46 = 546/n, 0,005 = 5/10ⁿ. p. 207, Tema 5, ex. 4. */
export function fractionsFindN(rng: Rng): Made {
  const v1 = int(rng, 101, 999)
  let v2 = int(rng, 101, 9999)
  if (v2 % 10 === 0) v2++
  const places2 = v2 > 999 ? pick(rng, [2, 3]) : 2
  const k = int(rng, 1, 9)
  const z = int(rng, 2, 5)
  return {
    text: lines(
      'Determinați numărul natural $n$, știind că:',
      `a) $${dec(v1, 2)} = \\frac{n}{100}$; b) $${dec(v2, places2)} = \\frac{${v2}}{n}$; c) $${dec(k, z)} = \\frac{${k}}{10^n}$.`,
    ),
    solution: lines(
      `a) $${dec(v1, 2)} = \\frac{${v1}}{100}$, deci $n = ${v1}$.`,
      `b) $${dec(v2, places2)}$ are ${places2} zecimale, deci $${dec(v2, places2)} = \\frac{${v2}}{${10 ** places2}}$ și $n = ${10 ** places2}$.`,
      `c) $${dec(k, z)}$ are ${z} zecimale, deci $${dec(k, z)} = \\frac{${k}}{${10 ** z}} = \\frac{${k}}{10^{${z}}}$ și $n = ${z}$.`,
    ),
    verify: () => Math.abs(v2 / 10 ** places2 - Number(dec(v2, places2).replace('{,}', '.'))) < 1e-9 && Number(dec(k, z).replace('{,}', '.')) * 10 ** z - k < 1e-9,
  }
}

/** p/q of a number and a percent of a number. p. 207, ex. 25. */
export function fractionsPartOf(rng: Rng): Made {
  for (;;) {
    const q = int(rng, 2, 12)
    const p = int(rng, 1, 2 * q)
    if (gcd(p, q) !== 1 || p === q) continue
    const N = q * int(rng, 3, 60)
    const pc = int(rng, 1, 99)
    const M = pick(rng, [100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000])
    const r = (pc * M) / 100
    if (!Number.isInteger(r)) continue
    return {
      text: `Calculați: a) $\\frac{${p}}{${q}}$ din ${N}; b) $${pc}\\%$ din ${M}.`,
      solution: lines(
        show(`\\text{a) } \\frac{${p}}{${q}} \\cdot ${N} = ${p} \\cdot (${N} : ${q}) = ${p} \\cdot ${N / q} = ${(p * N) / q}`),
        show(`\\text{b) } \\frac{${pc}}{100} \\cdot ${M} = ${pc} \\cdot ${M / 100} = ${r}`),
      ),
      verify: () => (p * N) % q === 0 && pc * M === 100 * r,
    }
  }
}

/** The natural x in 3/x ≥ 3/7, x/11 < 5/11, 15/2 > 15/x ≥ 15/7, 4/19 ≤ x/19 < 7/19. p. 205, ex. 4. */
export function fractionsNaturalX(rng: Rng): Made {
  const mode = pick(rng, [0, 1, 2, 3])
  const a = int(rng, 2, 30)
  let tex = ''
  let why = ''
  let test: (x: number) => boolean
  if (mode === 0) {
    const b = int(rng, 3, 14)
    tex = `\\frac{${a}}{x} \\geq \\frac{${a}}{${b}}`
    why = `Fracțiile au același numărător, deci inegalitatea are loc când numitorul $x$ este cel mult ${b}; $x \\neq 0$.`
    test = (x) => x !== 0 && a * b >= a * x
  } else if (mode === 1) {
    const c = int(rng, 3, 14)
    const d = int(rng, c + 1, 40)
    tex = `\\frac{x}{${d}} < \\frac{${c}}{${d}}`
    why = `Fracțiile au același numitor, deci $x < ${c}$.`
    test = (x) => x < c
  } else if (mode === 2) {
    const p = int(rng, 2, 8)
    const q = int(rng, p + 2, p + 10)
    tex = `\\frac{${a}}{${p}} > \\frac{${a}}{x} \\geq \\frac{${a}}{${q}}`
    why = `Fracțiile au același numărător; numitorul mai mare dă fracția mai mică, deci $${p} < x \\leq ${q}$.`
    test = (x) => x !== 0 && a * x > a * p && a * q >= a * x
  } else {
    const d = int(rng, 7, 40)
    const c1 = int(rng, 1, d - 3)
    const c2 = int(rng, c1 + 2, Math.min(c1 + 8, d + 5))
    tex = `\\frac{${c1}}{${d}} \\leq \\frac{x}{${d}} < \\frac{${c2}}{${d}}`
    why = `Fracțiile au același numitor, deci $${c1} \\leq x < ${c2}$.`
    test = (x) => c1 <= x && x < c2
  }
  const xs: number[] = []
  for (let x = 0; x <= 60; x++) if (test(x)) xs.push(x)
  return {
    text: `Determinați numerele naturale $x$, știind că $${tex}$.`,
    solution: lines(why, show(`x \\in ${set(xs)}`)),
    verify: () => xs.length > 0 && xs.every(test) && !test(61) ,
  }
}

/** Pairs with a given greatest common divisor and a given sum. p. 206, ex. 13. */
export function fractionsGcdPairs(rng: Rng): Made {
  const g = int(rng, 2, 15)
  const k = int(rng, 3, 13)
  const S = g * k
  const ms: number[] = []
  for (let m = 1; 2 * m <= k; m++) if (gcd(m, k - m) === 1) ms.push(m)
  const pairs = ms.map((m) => [g * m, g * (k - m)])
  return {
    text: `Determinați perechile de numere naturale $a$ și $b$, cu $a \\leq b$, știind că cel mai mare divizor comun al lor este ${g} și că suma lor este ${S}.`,
    solution: lines(
      `Scriem $a = ${g}x$ și $b = ${g}y$, unde $x \\leq y$ sunt numere prime între ele. Din $a + b = ${S}$ obținem $${g}(x + y) = ${S}$, deci $x + y = ${k}$.`,
      `Perechile $(x, y)$ prime între ele cu suma ${k}: ${math(ms.map((m) => `(${m}, ${k - m})`))}.`,
      `Răspuns: ${math(pairs.map(([a, b]) => `(${a}, ${b})`))}.`,
    ),
    verify: () => {
      let count = 0
      for (let a = 1; 2 * a <= S; a++) if (gcd(a, S - a) === g) count++
      return count === pairs.length && pairs.every(([a, b]) => gcd(a, b) === g && a + b === S)
    },
  }
}

/** A price lowered and then raised by percents (or the other way). p. 207, ex. 26. */
export function fractionsPercentChange(rng: Rng): Made {
  for (;;) {
    const P = 10 * int(rng, 5, 200)
    const p1 = pick(rng, [5, 10, 15, 20, 25, 30, 40])
    const p2 = pick(rng, [5, 10, 15, 20, 25, 30, 40])
    const down = rng() < 0.6
    const P1 = P * (down ? 100 - p1 : 100 + p1) // in bani
    if ((P1 * (down ? 100 + p2 : 100 - p2)) % 100) continue
    const P2 = (P1 * (down ? 100 + p2 : 100 - p2)) / 100
    const d1 = down ? 'scade' : 'crește'
    const d2 = down ? 'crește' : 'scade'
    return {
      text: lines(
        `Prețul unui obiect este de ${de(P)} lei. Prețul ${d1} cu $${p1}\\%$, iar după câteva zile noul preț ${d2} cu $${p2}\\%$.`,
        `a) Calculați prețul după ${down ? 'reducere' : 'scumpire'}.`,
        'b) Calculați prețul după cele două modificări.',
      ),
      solution: lines(
        `a) $${p1}\\%$ din ${P} este $\\frac{${p1}}{100} \\cdot ${P} = ${dec(P * p1, 2)}$ lei.`,
        show(`${P} ${down ? '-' : '+'} ${dec(P * p1, 2)} = ${dec(P1, 2)} \\text{ lei}`),
        `b) $${p2}\\%$ din $${dec(P1, 2)}$ este $\\frac{${p2}}{100} \\cdot ${dec(P1, 2)} = ${dec(P1 * p2 / 100, 2)}$ lei.`,
        show(`${dec(P1, 2)} ${down ? '+' : '-'} ${dec(P1 * p2 / 100, 2)} = ${dec(P2, 2)} \\text{ lei}`),
        P2 === 100 * P ? 'Prețul final este egal cu cel inițial.' : `Prețul final este ${P2 < 100 * P ? 'mai mic' : 'mai mare'} decât cel inițial, deși procentele ${p1 === p2 ? 'sunt egale' : 'sunt apropiate'}: al doilea procent se calculează din alt preț.`,
      ),
      verify: () => P2 * 100 === P * (down ? 100 - p1 : 100 + p1) * (down ? 100 + p2 : 100 - p2) && Number.isInteger((P1 * p2) / 100),
    }
  }
}

/** a,b + b,a = X with nonzero digits. p. 208, ex. 13. */
export function fractionsDecimalDigits(rng: Rng): Made {
  const S = int(rng, 3, 17)
  const pairs: [number, number][] = []
  for (let a = 1; a <= 9; a++) if (S - a >= 1 && S - a <= 9) pairs.push([a, S - a])
  const X = 11 * S
  return {
    text: `Determinați cifrele nenule $a$ și $b$, știind că $\\overline{a{,}b} + \\overline{b{,}a} = ${dec(X, 1)}$.`,
    solution: lines(
      show(`\\overline{a{,}b} + \\overline{b{,}a} = \\frac{10a + b}{10} + \\frac{10b + a}{10} = \\frac{11(a + b)}{10}`),
      show(`\\frac{11(a + b)}{10} = \\frac{${X}}{10}, \\quad 11(a + b) = ${X}, \\quad a + b = ${S}`),
      `Perechile de cifre nenule cu suma ${S}: ${math(pairs.map(([a, b]) => `a = ${a}, b = ${b}`))}.`,
    ),
    verify: () => pairs.every(([a, b]) => 10 * a + b + 10 * b + a === X) && pairs.length === pairs.filter(([a, b]) => a >= 1 && b >= 1 && b <= 9).length,
  }
}

/** x with (ax + b)/(cx + d) equivalent to p/q. p. 206, ex. 20. */
export function fractionsEquivalentX(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 1, 15)
    const a = int(rng, 1, 9)
    const b = int(rng, -9, 9)
    const c = int(rng, 1, 9)
    const d = int(rng, -9, 9)
    const N = a * x + b
    const D = c * x + d
    if (N <= 0 || D <= 0 || N === D) continue
    const [p, q] = reduce(N, D)
    if (q === 1 || p > 40 || q > 40 || q * a === p * c) continue
    const L = q * a - p * c
    const R = p * d - q * b
    const lin = (u: number, v: number) => (v === 0 ? `${u === 1 ? '' : u}x` : `${u === 1 ? '' : u}x ${v < 0 ? '-' : '+'} ${Math.abs(v)}`)
    return {
      text: `Determinați numărul natural $x$, astfel încât fracțiile $\\frac{${lin(a, b)}}{${lin(c, d)}}$ și $\\frac{${p}}{${q}}$ să fie echivalente.`,
      solution: lines(
        'Două fracții sunt echivalente când produsele „pe diagonală” sunt egale:',
        show(`${q} \\cdot (${lin(a, b)}) = ${p} \\cdot (${lin(c, d)})`),
        show(`${lin(q * a, q * b)} = ${lin(p * c, p * d)}`),
        L < 0
          ? show(`${-R} = ${L === -1 ? '' : -L}x, \\quad x = ${x}`)
          : show(`${L === 1 ? '' : L}x = ${R}, \\quad x = ${x}`),
        `Verificare: pentru $x = ${x}$, prima fracție este $\\frac{${N}}{${D}}${gcd(N, D) > 1 ? ` = ${frac(p, q)}` : ''}$.`,
      ),
      verify: () => L * x === R && N * q === D * p,
    }
  }
}

/** a = 2/3·4/5·…·N/(N+1), b = 3/4·5/6·…·(N+1)/(N+2): a·b telescopes. p. 206, ex. 22. */
export function fractionsTelescoping(rng: Rng): Made {
  const N = 2 * int(rng, 10, 100)
  const K = (N + 2) / 2
  return {
    text: lines(
      `Dacă $a = \\frac{2}{3} \\cdot \\frac{4}{5} \\cdot \\frac{6}{7} \\cdot \\ldots \\cdot \\frac{${N}}{${N + 1}}$ și $b = \\frac{3}{4} \\cdot \\frac{5}{6} \\cdot \\frac{7}{8} \\cdot \\ldots \\cdot \\frac{${N + 1}}{${N + 2}}$, calculați:`,
      `a) $a \\cdot b$; b) $a \\cdot b + \\frac{${K - 1}}{${K}}$.`,
    ),
    solution: lines(
      'a) Înmulțim factorii în ordine; fiecare numitor se simplifică cu numărătorul următor:',
      show(`a \\cdot b = \\frac{2}{3} \\cdot \\frac{3}{4} \\cdot \\frac{4}{5} \\cdot \\ldots \\cdot \\frac{${N + 1}}{${N + 2}} = \\frac{2}{${N + 2}} = \\frac{1}{${K}}`),
      show(`\\text{b) } \\frac{1}{${K}} + \\frac{${K - 1}}{${K}} = \\frac{${K}}{${K}} = 1`),
    ),
    verify: () => {
      let [p, q] = [1, 1]
      for (let k = 2; k <= N + 1; k++) [p, q] = reduce(p * k, q * (k + 1))
      return p === 1 && q === K
    },
  }
}

/** x natural for which a fraction with x is subunitary, equal to 1 or supraunitary. p. 205, ex. 8. */
export function fractionsNaturalCondition(rng: Rng): Made {
  const mode = pick(rng, [0, 1, 2])
  if (mode === 0) {
    for (;;) {
      const c = int(rng, 1, 9)
      const T = int(rng, c + 3, 150)
      const xs: number[] = []
      for (let x = 0; x * x + c < T; x++) xs.push(x)
      return {
        text: `Determinați numerele naturale $x$, astfel încât fracția $\\frac{${T}}{x^2 + ${c}}$ să fie supraunitară.`,
        solution: lines(
          `Fracția este supraunitară când numărătorul este mai mare decât numitorul: $x^2 + ${c} < ${T}$, adică $x^2 < ${T - c}$.`,
          `Pătratele perfecte mai mici decât ${T - c} sunt ${math(xs.map((x) => x * x))}.`,
          show(`x \\in ${set(xs)}`),
        ),
        verify: () => xs.every((x) => T > x * x + c) && !(T > xs.length * xs.length + c),
      }
    }
  }
  if (mode === 1) {
    const m = int(rng, 2, 30)
    const c = int(rng, 1, 30)
    const x = int(rng, 1, 30)
    const T = m * x + c
    return {
      text: `Determinați numărul natural $x$, astfel încât fracția $\\frac{${T}}{${m}x + ${c}}$ să fie echiunitară.`,
      solution: lines(
        'Fracția este echiunitară când numărătorul este egal cu numitorul:',
        show(`${m}x + ${c} = ${T}, \\quad ${m}x = ${T - c}, \\quad x = ${x}`),
      ),
      verify: () => m * x + c === T,
    }
  }
  for (;;) {
    const a = int(rng, 2, 4)
    const b = int(rng, 1, 7)
    const c = int(rng, 1, 15)
    const xs: number[] = []
    for (let x = 0; x <= 100; x++) if (a * x - b >= 1 && a * x - b < x + c) xs.push(x)
    if (xs.length < 2) continue
    return {
      text: `Determinați numerele naturale $x$, astfel încât fracția $\\frac{${a}x - ${b}}{x + ${c}}$ să fie subunitară (cu numărătorul nenul).`,
      solution: lines(
        `Numărătorul trebuie să fie un număr natural nenul: $${a}x - ${b} \\geq 1$, deci $x \\geq ${xs[0]}$.`,
        `Fracția este subunitară când numărătorul este mai mic decât numitorul:`,
        show(`${a}x - ${b} < x + ${c}, \\quad ${a - 1 === 1 ? '' : a - 1}x < ${b + c}`),
        show(`x \\in ${set(xs)}`),
      ),
      verify: () => xs.every((x) => (a - 1) * x < b + c && a * x - b >= 1),
    }
  }
}

// ================= 4. lines, segments, angles (Tema 7, pp. 210–211; tests pp. 215–219) =================

const TRIPLES = [['A', 'B', 'C'], ['M', 'N', 'P'], ['E', 'F', 'G'], ['R', 'S', 'T'], ['X', 'Y', 'Z']]

/** AC and BC known, A, B, C collinear: AB in all the cases. p. 210, ex. 6. */
export function geoCollinearCases(rng: Rng): Made {
  for (;;) {
    const [P, Q, R] = pick(rng, TRIPLES)
    const a = int(rng, 2, 40)
    const b = int(rng, 1, 40)
    if (a === b) continue
    const sum = a + b
    const diff = Math.abs(a - b)
    return {
      text: `Punctele $${P}$, $${Q}$, $${R}$ sunt coliniare, $${P}${R} = ${a}$ cm și $${Q}${R} = ${b}$ cm. Calculați lungimea segmentului $${P}${Q}$. Analizați toate cazurile posibile.`,
      solution: lines(
        `Cazul 1: punctul $${R}$ este între $${P}$ și $${Q}$. Atunci $${P}${Q} = ${P}${R} + ${R}${Q} = ${a} + ${b} = ${sum}$ cm.`,
        a > b
          ? `Cazul 2: punctul $${Q}$ este între $${P}$ și $${R}$ (se poate, pentru că $${Q}${R} < ${P}${R}$). Atunci $${P}${Q} = ${P}${R} - ${Q}${R} = ${a} - ${b} = ${diff}$ cm.`
          : `Cazul 2: punctul $${P}$ este între $${Q}$ și $${R}$ (se poate, pentru că $${P}${R} < ${Q}${R}$). Atunci $${P}${Q} = ${Q}${R} - ${P}${R} = ${b} - ${a} = ${diff}$ cm.`,
        `Punctul $${a > b ? P : Q}$ nu poate fi între celelalte două, pentru că $${a > b ? `${P}${R}` : `${Q}${R}`}$ este cel mai lung dintre segmentele date. Deci $${P}${Q} = ${sum}$ cm sau $${P}${Q} = ${diff}$ cm.`,
      ),
      verify: () => [0, a, -a].some((pp) => Math.abs(pp - b) === sum || Math.abs(pp - b) === diff) && sum - diff === 2 * Math.min(a, b),
    }
  }
}

/** Are M, N, P collinear, from MN, NP, MP? p. 211, ex. 20. */
export function geoCollinearCheck(rng: Rng): Made {
  const [P, Q, R] = pick(rng, TRIPLES)
  const names = [`${P}${Q}`, `${Q}${R}`, `${P}${R}`]
  const x = int(rng, 2, 30)
  const y = int(rng, 2, 30)
  const yes = rng() < 0.7
  let d: number[]
  let mid = ''
  if (yes) {
    const between = pick(rng, [Q, R, P])
    // the distances when `between` is in the middle
    d = between === Q ? [x, y, x + y] : between === R ? [x + y, y, x] : [x, x + y, y]
    mid = between
  } else {
    for (;;) {
      const z = int(rng, Math.abs(x - y) + 1, x + y - 1)
      if (z > 0) {
        d = [x, y, z]
        break
      }
    }
  }
  const [a, b, c] = d!
  const order = mid === Q ? `${P}, ${Q}, ${R}` : mid === R ? `${P}, ${R}, ${Q}` : `${Q}, ${P}, ${R}`
  return {
    text: `Stabiliți dacă punctele $${P}$, $${Q}$ și $${R}$ sunt coliniare și, în caz afirmativ, precizați ordinea lor pe dreaptă, știind că $${names[0]} = ${a}$ cm, $${names[1]} = ${b}$ cm și $${names[2]} = ${c}$ cm.`,
    solution: yes
      ? lines(
        `Cel mai lung segment este $${mid === Q ? names[2] : mid === R ? names[0] : names[1]}$, iar lungimea lui este suma celorlalte două:`,
        show(mid === Q ? `${names[0]} + ${names[1]} = ${a} + ${b} = ${c} = ${names[2]}` : mid === R ? `${names[2]} + ${names[1]} = ${c} + ${b} = ${a} = ${names[0]}` : `${names[0]} + ${names[2]} = ${a} + ${c} = ${b} = ${names[1]}`),
        `Deci punctele sunt coliniare, iar $${mid}$ este între celelalte două: ordinea este $${order}$.`,
      )
      : lines(
        'Dacă punctele ar fi coliniare, unul dintre segmente ar fi egal cu suma celorlalte două. Verificăm:',
        show(`${a} + ${b} = ${a + b} \\neq ${c}, \\quad ${a} + ${c} = ${a + c} \\neq ${b}, \\quad ${b} + ${c} = ${b + c} \\neq ${a}`),
        'Deci punctele nu sunt coliniare.',
      ),
    verify: () => yes === (a + b === c || a + c === b || b + c === a),
  }
}

/** A, B, C in this order, the midpoints M, N, O of AB, BC, AC; is O the midpoint of BN? p. 210, ex. 7. */
export function geoMidpointsThree(rng: Rng): Made {
  const t = 2 * int(rng, 2, 25)
  const s = rng() < 0.4 ? 3 * t : 2 * int(rng, t / 2 + 1, t + 30)
  // positions on the line, from A
  const B = t
  const M = t / 2
  const N = (t + s) / 2
  const O = s / 2
  const isMid = O > B && O < N && O - B === N - O
  return {
    text: lines(
      `Punctele $A$, $B$, $C$ sunt coliniare, în această ordine, astfel încât $AC = ${s}$ cm și $AB = ${t}$ cm. Notăm cu $M$, $N$ și $O$ mijloacele segmentelor $AB$, $BC$, respectiv $AC$.`,
      'a) Calculați lungimile segmentelor $BC$, $BM$ și $BN$.',
      'b) Stabiliți dacă punctul $O$ este mijlocul segmentului $BN$.',
    ),
    solution: lines(
      show(`\\text{a) } BC = AC - AB = ${s} - ${t} = ${s - t} \\text{ cm}, \\quad BM = AB : 2 = ${M} \\text{ cm}, \\quad BN = BC : 2 = ${(s - t) / 2} \\text{ cm}`),
      `b) Măsurăm de la $A$: $AB = ${t}$ cm, $AO = AC : 2 = ${O}$ cm, $AN = AB + BN = ${N}$ cm.`,
      O <= B
        ? `Cum $AO \\leq AB$, punctul $O$ nu este între $B$ și $N$, deci nu este mijlocul segmentului $BN$.`
        : `Punctul $O$ este între $B$ și $N$; $BO = ${O} - ${B} = ${O - B}$ cm, iar $ON = ${N} - ${O} = ${N - O}$ cm. ${isMid ? 'Segmentele sunt egale, deci $O$ este mijlocul segmentului $BN$.' : 'Segmentele nu sunt egale, deci $O$ nu este mijlocul segmentului $BN$.'}`,
    ),
    verify: () => isMid === (s === 3 * t) && N - B === (s - t) / 2,
  }
}

/** C interior to AOB, AOB = k·AOC; OD the axis of symmetry of AOB. p. 211, ex. 14. */
export function geoInteriorMultiple(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 3, 6)
    const a = int(rng, 8, 59)
    const T = k * a
    if (T >= 180 || T % 2) continue
    const kind = T < 90 ? 'ascuțit' : T === 90 ? 'drept' : 'obtuz'
    return {
      text: lines(
        `Se consideră un punct $C$ interior unghiului $AOB$, astfel încât $${A('AOB')} = ${k} \\cdot ${A('AOC')}$.`,
        `a) Determinați măsura unghiului $BOC$, știind că $${A('AOC')} = ${a}^\\circ$. Ce fel de unghi este unghiul $AOB$?`,
        'b) Dacă $OD$ este axa de simetrie a unghiului $AOB$, aflați măsurile unghiurilor $BOD$ și $COD$.',
      ),
      solution: lines(
        show(`\\text{a) } ${A('AOB')} = ${k} \\cdot ${a}^\\circ = ${T}^\\circ, \\quad ${A('BOC')} = ${T}^\\circ - ${a}^\\circ = ${T - a}^\\circ`),
        `Unghiul $AOB$ este ${kind}.`,
        `b) Axa de simetrie împarte unghiul în două unghiuri congruente: $${A('BOD')} = ${A('AOD')} = ${T}^\\circ : 2 = ${T / 2}^\\circ$.`,
        `Semidreapta $OC$ este între $OA$ și $OD$, pentru că $${a}^\\circ < ${T / 2}^\\circ$:`,
        show(`${A('COD')} = ${A('AOD')} - ${A('AOC')} = ${T / 2}^\\circ - ${a}^\\circ = ${T / 2 - a}^\\circ`),
      ),
      verify: () => T - a === (k - 1) * a && T / 2 - a > 0,
    }
  }
}

/** MON, OP its axis of symmetry, OQ the axis of MOP, OR opposite to OQ. p. 211, ex. 15. */
export function geoBisectorChain(rng: Rng): Made {
  const t = int(rng, 30, 179) * 60
  return {
    text: lines(
      `Se consideră un unghi $MON$ cu măsura de $${dm(t)}$. Semidreapta $OP$ este axa de simetrie a unghiului $MON$, iar $OQ$ este axa de simetrie a unghiului $MOP$.`,
      'a) Calculați măsurile unghiurilor $MOP$, $MOQ$ și $NOQ$.',
      'b) Dacă $OR$ este semidreapta opusă semidreptei $OQ$, calculați măsura unghiului $MOR$.',
    ),
    solution: lines(
      show(`\\text{a) } ${A('MOP')} = ${dm(t)} : 2 = ${dm(t / 2)}, \\quad ${A('MOQ')} = ${dm(t / 2)} : 2 = ${dm(t / 4)}`),
      show(`${A('NOQ')} = ${A('MON')} - ${A('MOQ')} = ${dm(t)} - ${dm(t / 4)} = ${dm((3 * t) / 4)}`),
      `b) Unghiurile $MOQ$ și $MOR$ sunt adiacente și au laturile necomune semidrepte opuse, deci suma lor este $180^\\circ$:`,
      show(`${A('MOR')} = 180^\\circ - ${dm(t / 4)} = ${dm(10800 - t / 4)}`),
    ),
    verify: () => t / 4 + (3 * t) / 4 === t && Number.isInteger(t / 4),
  }
}

/** α − k·β + γ : m with degrees and minutes. p. 216, Test 2, V.1a. */
export function geoAngleExpression(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 60, 175) * 60 + int(rng, 1, 59)
    const b = int(rng, 5, 40) * 60 + int(rng, 1, 59)
    const k = int(rng, 2, 4)
    const m = int(rng, 2, 6)
    const g = m * (int(rng, 5, 40) * 60 + pick(rng, [0, 5, 10, 15, 20, 30, 45]))
    const res = a - k * b + g / m
    if (res <= 0 || a - k * b <= 0 || g >= 180 * 60) continue
    return {
      text: `Calculați: $${dm(a)} - ${k} \\cdot ${dm(b)} + ${dm(g)} : ${m}$.`,
      solution: lines(
        'Efectuăm mai întâi înmulțirea și împărțirea (minutele care trec de 60 devin grade, iar gradele care rămân la împărțire devin minute):',
        show(`${k} \\cdot ${dm(b)} = ${dm(k * b)}, \\quad ${dm(g)} : ${m} = ${dm(g / m)}`),
        show(`${dm(a)} - ${dm(k * b)} = ${dm(a - k * b)}, \\quad ${dm(a - k * b)} + ${dm(g / m)} = ${dm(res)}`),
      ),
      verify: () => res === a - k * b + g / m && Number.isInteger(g / m),
    }
  }
}

/** AOB right, OC and OD inside; the axes of AOB and of COD. p. 211, ex. 19. */
export function geoRightAngleSplit(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 10, 40) * 60 + int(rng, 1, 59)
    const b = int(rng, 10, 40) * 60 + int(rng, 1, 59)
    if (a + b >= 5400 - 300 || (a - b) % 2) continue
    const c = 5400 - a - b
    const posD = 5400 - b
    const aon = (a + posD) / 2
    const dom = Math.abs(posD - 2700)
    const com = Math.abs(2700 - a)
    if (dom === 0 || com === 0) continue
    return {
      text: lines(
        `Unghiul $AOB$ este unghi drept, iar semidreptele $OC$ și $OD$ sunt în interiorul lui, în ordinea $OA$, $OC$, $OD$, $OB$, astfel încât $${A('AOC')} = ${dm(a)}$ și $${A('BOD')} = ${dm(b)}$.`,
        'a) Calculați măsura unghiului $COD$.',
        'b) Dacă $OM$ este axa de simetrie a unghiului $AOB$, calculați măsurile unghiurilor $DOM$ și $COM$.',
        'c) Dacă $ON$ este axa de simetrie a unghiului $COD$, calculați măsurile unghiurilor $AON$ și $BON$.',
      ),
      solution: lines(
        show(`\\text{a) } ${A('COD')} = 90^\\circ - ${dm(a)} - ${dm(b)} = ${dm(c)}`),
        `b) $${A('AOM')} = ${A('BOM')} = 45^\\circ$. Măsurăm de la $OA$: $${A('AOD')} = 90^\\circ - ${dm(b)} = ${dm(posD)}$.`,
        show(`${A('DOM')} = ${posD > 2700 ? `${dm(posD)} - 45^\\circ` : `45^\\circ - ${dm(posD)}`} = ${dm(dom)}, \\quad ${A('COM')} = ${a < 2700 ? `45^\\circ - ${dm(a)}` : `${dm(a)} - 45^\\circ`} = ${dm(com)}`),
        `c) $${A('CON')} = ${dm(c)} : 2 = ${dm(c / 2)}$.`,
        show(`${A('AON')} = ${dm(a)} + ${dm(c / 2)} = ${dm(aon)}, \\quad ${A('BON')} = 90^\\circ - ${dm(aon)} = ${dm(5400 - aon)}`),
      ),
      verify: () => a + c + b === 5400 && aon === a + c / 2 && 5400 - aon === b + c / 2,
    }
  }
}

/** MON is a percent of a straight angle; POX exterior with PON a fraction of MON: M, O, P collinear. p. 215, Test 1, V.2. */
export function geoStraightPercent(rng: Rng): Made {
  const [pct, f, fTex] = pick(rng, [[60, [2, 3], '0{,}(6)'], [75, [1, 3], '0{,}(3)'], [80, [1, 4], '0{,}25'], [90, [1, 9], '0{,}(1)'], [40, [3, 2], '1{,}5']] as const)
  const [M, O, N, P, Q] = pick(rng, [['M', 'O', 'N', 'P', 'Q'], ['A', 'O', 'B', 'C', 'D'], ['X', 'O', 'Y', 'Z', 'T'], ['E', 'V', 'F', 'G', 'H']])
  const m = (180 * pct) / 100
  const pon = (m * f[0]) / f[1]
  const hasQ = m > 90
  const noq = 2 * m - 180
  const ang = (s: string) => A(s)
  return {
    text: lines(
      `Un unghi $${M}${O}${N}$ are măsura egală cu $${pct}\\%$ din măsura unui unghi alungit. Se consideră un punct $${P}$, exterior unghiului $${M}${O}${N}$, astfel încât măsura unghiului $${P}${O}${N}$ să fie egală cu $${fTex}$ din măsura unghiului $${M}${O}${N}$.${hasQ ? ` Un punct $${Q}$ este interior unghiului $${M}${O}${N}$, astfel încât $${ang(`${N}${O}${Q}`)} = ${noq}^\\circ$.` : ''}`,
      `a) Calculați măsura unghiului $${M}${O}${N}$.`,
      `b) Arătați că punctele $${M}$, $${O}$ și $${P}$ sunt coliniare.`,
      ...(hasQ ? [`c) Arătați că unghiurile $${M}${O}${Q}$ și $${P}${O}${N}$ sunt congruente.`] : []),
    ),
    solution: lines(
      show(`\\text{a) } ${ang(`${M}${O}${N}`)} = \\frac{${pct}}{100} \\cdot 180^\\circ = ${m}^\\circ`),
      `b) $${fTex} = ${frac(f[0], f[1])}$, deci $${ang(`${P}${O}${N}`)} = ${frac(f[0], f[1])} \\cdot ${m}^\\circ = ${pon}^\\circ$. Unghiurile $${M}${O}${N}$ și $${P}${O}${N}$ sunt adiacente (punctul $${P}$ este exterior unghiului $${M}${O}${N}$):`,
      show(`${ang(`${M}${O}${N}`)} + ${ang(`${P}${O}${N}`)} = ${m}^\\circ + ${pon}^\\circ = 180^\\circ`),
      `Deci unghiul $${M}${O}${P}$ este alungit, iar punctele $${M}$, $${O}$, $${P}$ sunt coliniare.`,
      ...(hasQ ? [show(`\\text{c) } ${ang(`${M}${O}${Q}`)} = ${m}^\\circ - ${noq}^\\circ = ${m - noq}^\\circ = ${ang(`${P}${O}${N}`)}`)] : []),
    ),
    verify: () => m + pon === 180 && (!hasQ || m - noq === pon),
  }
}

/** A, B, C in order, BC a percent of AB, O the midpoint of AB, D the symmetric of O about A, E the midpoint of AD. p. 210, ex. 8; p. 211, ex. 17. */
export function geoSegmentPercent(rng: Rng): Made {
  for (;;) {
    const a = 4 * int(rng, 3, 50)
    const p = pick(rng, [10, 20, 25, 40, 50, 75])
    if ((a * p) % 100) continue
    const bc = (a * p) / 100
    // positions from A; D and E are on the other side of A
    const O = a / 2
    const C = a + bc
    const E = -a / 4
    const OE = O - E
    const OC = C - O
    const sym = OE === OC
    return {
      text: lines(
        `Punctele coliniare $A$, $B$, $C$ sunt în această ordine, astfel încât $AB = ${a}$ cm, iar lungimea segmentului $BC$ este $${p}\\%$ din lungimea segmentului $AB$. Notăm cu $O$ mijlocul segmentului $AB$, cu $D$ simetricul punctului $O$ față de punctul $A$ și cu $E$ mijlocul segmentului $AD$.`,
        'a) Calculați lungimile segmentelor $AC$, $OB$ și $OC$.',
        'b) Stabiliți dacă punctele $E$ și $C$ sunt simetrice față de punctul $O$.',
      ),
      solution: lines(
        show(`\\text{a) } BC = \\frac{${p}}{100} \\cdot ${a} = ${bc} \\text{ cm}, \\quad AC = ${a} + ${bc} = ${C} \\text{ cm}`),
        show(`OB = ${a} : 2 = ${O} \\text{ cm}, \\quad OC = OB + BC = ${O} + ${bc} = ${OC} \\text{ cm}`),
        `b) $AD = AO = ${O}$ cm, deci $AE = ${O} : 2 = ${-E}$ cm, iar $OE = OA + AE = ${O} + ${-E} = ${OE}$ cm. Punctele $E$ și $C$ sunt de o parte și de alta a lui $O$.`,
        sym ? `Cum $OE = OC = ${OC}$ cm, punctele $E$ și $C$ sunt simetrice față de $O$.` : `Cum $OE = ${OE}$ cm $\\neq OC = ${OC}$ cm, punctele $E$ și $C$ nu sunt simetrice față de $O$.`,
      ),
      verify: () => sym === (p === 25) && C - E === OE + OC,
    }
  }
}

// ================= 5. units of measure, perimeters, areas, volumes (Tema 8, pp. 212–214) =================

const LEN: Record<string, number> = { km: 3, hm: 2, dam: 1, m: 0, dm: -1, cm: -2, mm: -3 }
const LU = Object.keys(LEN)
/** A length kept in mm, written in a unit. */
const inU = (mm: number, u: string) => dec(mm, 3 + LEN[u])
const u1 = (u: string) => `\\text{ ${u}}`

/** A length with a random unit and at most two decimals, as [mm, unit]. */
function length(rng: Rng, maxMm: number, minMm = 1, maxK = 9999): [number, string] {
  for (;;) {
    const u = pick(rng, LU)
    const places = int(rng, 0, Math.min(2, 3 + LEN[u]))
    const step = 10 ** (3 + LEN[u] - places)
    const mm = step * int(rng, 1, maxK)
    if (mm <= maxMm && mm >= minMm && step <= mm) return [mm, u]
  }
}

/** 5,27 dam − 8,7 m + 600 cm = ? dm. p. 212, ex. 4. */
export function measuresLengthSum(rng: Rng): Made {
  for (;;) {
    const t = [length(rng, 2000000, 1000), length(rng, 2000000, 1000), length(rng, 2000000, 1000)]
    if (new Set(t.map((x) => x[1])).size < 3) continue
    const res = t[0][0] - t[1][0] + t[2][0]
    if (res <= 0) continue
    const target = pick(rng, LU.filter((u) => !t.some((x) => x[1] === u)))
    if (inU(res, target).replace(/\D/g, '').length > 9) continue
    const expr = `${inU(t[0][0], t[0][1])}${u1(t[0][1])} - ${inU(t[1][0], t[1][1])}${u1(t[1][1])} + ${inU(t[2][0], t[2][1])}${u1(t[2][1])}`
    return {
      text: `Calculați și exprimați rezultatul în ${target}: $${expr}$.`,
      solution: lines(
        `Transformăm fiecare termen în ${target}:`,
        show(t.map(([mm, u]) => `${inU(mm, u)}${u1(u)} = ${inU(mm, target)}${u1(target)}`).join(', \\quad ')),
        show(`${inU(t[0][0], target)} - ${inU(t[1][0], target)} + ${inU(t[2][0], target)} = ${inU(res, target)}${u1(target)}`),
      ),
      verify: () => t[0][0] - t[1][0] + t[2][0] === res,
    }
  }
}

/** The perimeter of a square from its side, or the side from the perimeter, in metres. p. 213, ex. 15, ex. 16. */
export function measuresSquarePerimeter(rng: Rng): Made {
  const back = rng() < 0.5
  for (;;) {
    const [mm, u] = length(rng, 500000, 10)
    if (back) {
      if (mm % 4) continue
      const side = mm / 4
      return {
        text: `Calculați lungimea laturii unui pătrat, în metri, știind că perimetrul acestuia este egal cu $${inU(mm, u)}$ ${u}.`,
        solution: lines(
          show(`P = ${inU(mm, u)}${u1(u)} = ${inU(mm, 'm')}${u1('m')}`),
          show(`l = P : 4 = ${inU(mm, 'm')} : 4 = ${inU(side, 'm')}${u1('m')}`),
        ),
        verify: () => 4 * side === mm,
      }
    }
    return {
      text: `Calculați perimetrul unui pătrat și exprimați-l în metri, știind că lungimea laturii acestuia este egală cu $${inU(mm, u)}$ ${u}.`,
      solution: lines(
        show(`l = ${inU(mm, u)}${u1(u)} = ${inU(mm, 'm')}${u1('m')}`),
        show(`P = 4 \\cdot l = 4 \\cdot ${inU(mm, 'm')} = ${inU(4 * mm, 'm')}${u1('m')}`),
      ),
      verify: () => Number(inU(4 * mm, 'm').replace('{,}', '.')) - 4 * Number(inU(mm, 'm').replace('{,}', '.')) < 1e-6,
    }
  }
}

/** The area of a rectangle with sides in different units, in m². p. 213, ex. 18. */
export function measuresRectArea(rng: Rng): Made {
  for (;;) {
    const [L, uL] = length(rng, 100000, 100, 999)
    const [l, ul] = length(rng, 100000, 100, 999)
    if (uL === ul || l >= L) continue
    const area = L * l // mm²
    if (dec(area, 6).replace(/\D/g, '').length > 10) continue
    return {
      text: `Exprimați în metri pătrați aria unui dreptunghi care are dimensiunile $L = ${inU(L, uL)}$ ${uL} și $l = ${inU(l, ul)}$ ${ul}.`,
      solution: lines(
        'Exprimăm ambele dimensiuni în metri:',
        show(`L = ${inU(L, 'm')}${u1('m')}, \\quad l = ${inU(l, 'm')}${u1('m')}`),
        show(`\\mathcal{A} = L \\cdot l = ${inU(L, 'm')} \\cdot ${inU(l, 'm')} = ${dec(area, 6)}${u1('m')}^2`),
      ),
      verify: () => Math.abs(Number(dec(area, 6).replace('{,}', '.')) - (L / 1000) * (l / 1000)) < 1e-9,
    }
  }
}

/** The sides of a rectangle from its perimeter and a relation. p. 213, ex. 14; p. 218, Test 4, II.1. */
export function measuresRectDims(rng: Rng): Made {
  const mode = pick(rng, ['diff', 'pct', 'part', 'times'] as const)
  for (;;) {
    let L = 0
    let l = 0
    let cond = ''
    let how = ''
    if (mode === 'diff') {
      l = int(rng, 3, 120)
      L = l + int(rng, 2, 80)
      cond = `diferența dintre lungime și lățime este de ${L - l} m`
      how = `Din semiperimetru scădem diferența și obținem de două ori lățimea: $l = (${L + l} - ${L - l}) : 2 = ${l}$ m, iar $L = ${l} + ${L - l} = ${L}$ m.`
    } else if (mode === 'pct') {
      const [p, a, b] = pick(rng, [[25, 1, 4], [20, 1, 5], [40, 2, 5], [50, 1, 2], [60, 3, 5], [75, 3, 4]] as const)
      const u = int(rng, 2, 30)
      l = a * u
      L = b * u
      cond = `lățimea reprezintă $${p}\\%$ din lungime`
      how = `$${p}\\% = ${frac(a, b)}$: lungimea are ${b} părți egale, iar lățimea ${a === 1 ? 'una' : a}. Semiperimetrul are ${a + b} părți: o parte este $${L + l} : ${a + b} = ${u}$ m, deci $L = ${L}$ m și $l = ${l}$ m.`
    } else if (mode === 'part') {
      const [k, w] = pick(rng, [[2, 'jumătate'], [3, 'o treime'], [4, 'un sfert'], [5, 'o cincime']] as const)
      l = int(rng, 2, 40)
      L = k * l
      cond = `lățimea este ${w} din lungime`
      how = `Lungimea are ${k} părți cât lățimea, iar semiperimetrul ${k + 1} părți: $l = ${L + l} : ${k + 1} = ${l}$ m, $L = ${k} \\cdot ${l} = ${L}$ m.`
    } else {
      const k = int(rng, 2, 9)
      l = int(rng, 2, 40)
      L = k * l
      cond = `lungimea este de ${k} ori mai mare decât lățimea`
      how = `Semiperimetrul are ${k + 1} părți egale cu lățimea: $l = ${L + l} : ${k + 1} = ${l}$ m, $L = ${k} \\cdot ${l} = ${L}$ m.`
    }
    const P = 2 * (L + l)
    if (L === l) continue
    return {
      text: `Perimetrul unui dreptunghi este egal cu ${P} m. Calculați dimensiunile dreptunghiului, știind că ${cond}.`,
      solution: lines(`Semiperimetrul este $L + l = ${P} : 2 = ${L + l}$ m.`, how),
      verify: () => 2 * (L + l) === P && L > l,
    }
  }
}

/** A square and a rectangle with equal perimeters. p. 213, ex. 24; p. 216, Test 2, V.2. */
export function measuresSquareRect(rng: Rng): Made {
  const tenths = rng() < 0.4
  const [u, p] = tenths ? ['dm', 1] : [pick(rng, ['cm', 'm']), 0]
  for (;;) {
    const s = int(rng, 3, 20)
    const d = int(rng, 1, 2 * s - 1)
    if (d === s) continue
    const o = 2 * s - d
    const ar = d * o
    return {
      text: lines(
        `Un pătrat și un dreptunghi au perimetrele egale. Dacă aria pătratului este egală cu $${dec(s * s, 2 * p)}${u1(u)}^2$ și o dimensiune a dreptunghiului este de $${dec(d, p)}$ ${u}, calculați:`,
        'a) lungimea laturii pătratului;',
        'b) perimetrul dreptunghiului;',
        'c) aria dreptunghiului.',
      ),
      solution: lines(
        show(`\\text{a) } ${dec(s * s, 2 * p)} = ${dec(s, p)} \\cdot ${dec(s, p)}, \\text{ deci latura este } ${dec(s, p)}${u1(u)}`),
        show(`\\text{b) } P = 4 \\cdot ${dec(s, p)} = ${dec(4 * s, p)}${u1(u)}`),
        `c) Semiperimetrul dreptunghiului este $${dec(2 * s, p)}$ ${u}, deci cealaltă dimensiune este $${dec(2 * s, p)} - ${dec(d, p)} = ${dec(o, p)}$ ${u}.`,
        show(`\\mathcal{A} = ${dec(d, p)} \\cdot ${dec(o, p)} = ${dec(ar, 2 * p)}${u1(u)}^2`),
      ),
      verify: () => 2 * (d + o) === 4 * s && ar <= s * s,
    }
  }
}

/** Square paving slabs for a rectangular alley. p. 213, ex. 22. */
export function measuresPaving(rng: Rng): Made {
  const c = pick(rng, [20, 25, 30, 40, 50])
  const n1 = int(rng, 10, 120)
  const n2 = int(rng, 2, 9)
  const L = n1 * c
  const l = n2 * c
  return {
    text: lines(
      `Pentru pavarea unei alei dreptunghiulare cu dimensiunile de $${dec(L, 2)}$ m, respectiv $${dec(l, 2)}$ m se folosesc plăci de pavaj în formă de pătrat cu lungimea laturii de ${c} cm.`,
      'a) Calculați aria unei plăci folosite pentru pavare.',
      'b) Aflați câte plăci de pavaj sunt necesare pentru pavarea aleii.',
    ),
    solution: lines(
      show(`\\text{a) } ${c} \\cdot ${c} = ${c * c}\\text{ cm}^2`),
      `b) Exprimăm dimensiunile aleii în centimetri: $${L}$ cm și $${l}$ cm.`,
      show(`\\mathcal{A} = ${L} \\cdot ${l} = ${L * l}\\text{ cm}^2, \\quad ${L * l} : ${c * c} = ${n1 * n2}`),
      `Sunt necesare ${de(n1 * n2)} plăci (pe lungime încap $${L} : ${c} = ${n1}$, pe lățime $${l} : ${c} = ${n2}$).`,
    ),
    verify: () => L * l === n1 * n2 * c * c,
  }
}

/** A square garden split into fractions of its area. p. 213, ex. 25. */
export function measuresGardenParts(rng: Rng): Made {
  const crops = shuffle(rng, ['ardei', 'vinete', 'roșii', 'castraveți', 'fasole', 'ceapă'])
  for (;;) {
    const [a, b] = shuffle(rng, [2, 3, 4, 5, 6, 8]).slice(0, 2)
    if (1 / a + 1 / b >= 1) continue
    const s = int(rng, 4, 40)
    const S = s * s
    if (S % a || S % b) continue
    const x = S / a
    const y = S / b
    const z = S - x - y
    return {
      text: lines(
        `În grădina sa în formă de pătrat, bunica plantează astfel: pe $${frac(1, a)}$ din suprafață ${crops[0]}, pe $${frac(1, b)}$ din suprafață ${crops[1]}, iar pe restul ${crops[2]}. Știind că perimetrul grădinii este egal cu ${4 * s} m, calculați aria suprafeței cultivate cu:`,
        `a) ${crops[0]}; b) ${crops[1]}; c) ${crops[2]}.`,
      ),
      solution: lines(
        show(`l = ${4 * s} : 4 = ${s} \\text{ m}, \\quad \\mathcal{A} = ${s} \\cdot ${s} = ${S}\\text{ m}^2`),
        show(`\\text{a) } ${frac(1, a)} \\cdot ${S} = ${x}\\text{ m}^2, \\quad \\text{b) } ${frac(1, b)} \\cdot ${S} = ${y}\\text{ m}^2, \\quad \\text{c) } ${S} - ${x} - ${y} = ${z}\\text{ m}^2`),
      ),
      verify: () => x * a === S && y * b === S && z > 0,
    }
  }
}

/** A tank: the height from the volume, the water level, a cube dropped in. p. 213, ex. 27; p. 214, ex. 34; p. 218, Test 4, V.2. */
export function measuresCuboidWater(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 2, 12) // dm
    const l = int(rng, 2, 10)
    const h = int(rng, 3, 12)
    if (l > L) continue
    const lvl = int(rng, 1, 2 * h - 2) // half-dm, so the level is in whole cm multiples of 5
    const W2 = L * l * lvl
    if (W2 % 2) continue
    const W = W2 / 2
    const e = int(rng, 1, Math.min(l, 6))
    const rise = (e * e * e * 100) / (L * l) // cm, needs to be whole
    if (!Number.isInteger(rise) || rise < 1 || lvl * 5 + rise > h * 10 || lvl * 5 + rise < 10 * e) continue
    const showL = pick(rng, [['dam', inU(L * 100, 'dam')], ['m', inU(L * 100, 'm')], ['cm', inU(L * 100, 'cm')]] as const)
    const showl = pick(rng, [['mm', inU(l * 100, 'mm')], ['cm', inU(l * 100, 'cm')], ['m', inU(l * 100, 'm')]] as const)
    const V = L * l * h
    return {
      text: lines(
        `Un vas în formă de paralelipiped dreptunghic are $L = ${showL[1]}$ ${showL[0]}, $l = ${showl[1]}$ ${showl[0]} și volumul egal cu $${V}\\text{ dm}^3$.`,
        'a) Calculați înălțimea vasului.',
        `b) Calculați până la ce înălțime se ridică apa în vas, dacă în acesta se pun ${W} l de apă.`,
        `c) În vas se scufundă apoi un cub metalic. Calculați lungimea laturii cubului, știind că prin scufundarea lui nivelul apei crește cu ${rise} cm.`,
      ),
      solution: lines(
        show(`\\text{a) } L = ${L}\\text{ dm}, \\quad l = ${l}\\text{ dm}, \\quad h = ${V} : (${L} \\cdot ${l}) = ${h}\\text{ dm}`),
        show(`\\text{b) } ${W}\\text{ l} = ${W}\\text{ dm}^3, \\quad ${W} : ${L * l} = ${dec(lvl * 5, 1)}\\text{ dm} = ${lvl * 5}\\text{ cm}`),
        `c) Cubul este acoperit de apă, iar volumul lui este volumul apei „ridicate”: $${L * l}\\text{ dm}^2 \\cdot ${dec(rise, 1)}\\text{ dm} = ${e * e * e}\\text{ dm}^3$.`,
        show(`${e * e * e} = ${e} \\cdot ${e} \\cdot ${e}, \\text{ deci latura cubului este } ${e}\\text{ dm}`),
      ),
      verify: () => L * l * h === V && L * l * lvl * 5 === W * 10 && L * l * rise === e * e * e * 100,
    }
  }
}

/** A cube with the side increased by a percent, or a cuboid with all sides halved. p. 214, ex. 36–39. */
export function measuresCubeScale(rng: Rng): Made {
  if (rng() < 0.65) {
    for (;;) {
      const p = pick(rng, [10, 20, 25, 50, 100])
      const a = int(rng, 2, 60) // cm
      if ((a * p) % 100) continue
      const b = a + (a * p) / 100
      const V1 = a ** 3
      const V2 = b ** 3
      const ratio = dec((100 + p) ** 3, 6)
      return {
        text: lines(
          `Un cub are lungimea laturii egală cu ${a} cm. Știind că latura cubului se mărește cu $${p}\\%$, calculați:`,
          'a) cu cât se mărește volumul cubului;',
          'b) de câte ori se mărește volumul cubului.',
        ),
        solution: lines(
          `Noua latură: $${a} + \\frac{${p}}{100} \\cdot ${a} = ${b}$ cm.`,
          show(`V_1 = ${a}^3 = ${V1}\\text{ cm}^3, \\quad V_2 = ${b}^3 = ${V2}\\text{ cm}^3`),
          show(`\\text{a) } ${V2} - ${V1} = ${V2 - V1}\\text{ cm}^3, \\quad \\text{b) } ${V2} : ${V1} = ${ratio}`),
          `Volumul se mărește de $${ratio}$ ori (latura se mărește de $${dec(100 + p, 2)}$ ori, iar volumul de $${dec(100 + p, 2)}^3$ ori).`,
        ),
        verify: () => V2 * 1000000 === V1 * (100 + p) ** 3,
      }
    }
  }
  const [L, l, h] = [2 * int(rng, 2, 30), 2 * int(rng, 2, 30), 2 * int(rng, 2, 30)]
  const V = L * l * h
  const v = V / 8
  return {
    text: lines(
      `Un paralelipiped dreptunghic are dimensiunile $L = ${dec(L, 2)}$ m, $l = ${l}$ cm și $h = ${10 * h}$ mm. Știind că fiecare dimensiune a paralelipipedului se micșorează cu $50\\%$, calculați:`,
      'a) cu cât se micșorează volumul paralelipipedului dreptunghic;',
      'b) de câte ori se micșorează volumul paralelipipedului dreptunghic.',
    ),
    solution: lines(
      `În centimetri: $L = ${L}$ cm, $l = ${l}$ cm, $h = ${h}$ cm. După micșorare: $${L / 2}$ cm, $${l / 2}$ cm, $${h / 2}$ cm.`,
      show(`V_1 = ${L} \\cdot ${l} \\cdot ${h} = ${V}\\text{ cm}^3, \\quad V_2 = ${L / 2} \\cdot ${l / 2} \\cdot ${h / 2} = ${v}\\text{ cm}^3`),
      show(`\\text{a) } ${V} - ${v} = ${V - v}\\text{ cm}^3, \\quad \\text{b) } ${V} : ${v} = 8`),
    ),
    verify: () => V === 8 * v && (L / 2) * (l / 2) * (h / 2) === v,
  }
}

/** How the area of a rectangle changes when the sides change. p. 213, ex. 21; ex. 19. */
export function measuresAreaChange(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 6, 60)
    const l = int(rng, 4, L - 1)
    const mode = pick(rng, ['minusPlus', 'plusMinus', 'doubleHalf', 'halfDouble'] as const)
    const x = int(rng, 1, l - 1)
    if ((mode === 'doubleHalf' && l % 2) || (mode === 'halfDouble' && L % 2)) continue
    const [L2, l2, what] = mode === 'minusPlus'
      ? [L - x, l + x, `lungimea se micșorează cu ${x} m și lățimea se mărește cu ${x} m`]
      : mode === 'plusMinus'
        ? [L + x, l - x, `lungimea se mărește cu ${x} m și lățimea se micșorează cu ${x} m`]
        : mode === 'doubleHalf' ? [2 * L, l / 2, 'lungimea se dublează și lățimea se înjumătățește'] : [L / 2, 2 * l, 'lungimea se înjumătățește și lățimea se dublează']
    const A1 = L * l
    const A2 = L2 * l2
    const d = A2 - A1
    return {
      text: `Un dreptunghi are lungimea de ${L} m și lățimea de ${l} m. Aflați cum se modifică aria dreptunghiului dacă ${what}.`,
      solution: lines(
        show(`\\mathcal{A}_1 = ${L} \\cdot ${l} = ${A1}\\text{ m}^2, \\quad \\mathcal{A}_2 = ${L2} \\cdot ${l2} = ${A2}\\text{ m}^2`),
        d === 0 ? 'Aria nu se modifică.' : d > 0 ? `Aria se mărește cu $${A2} - ${A1} = ${d}\\text{ m}^2$.` : `Aria se micșorează cu $${A1} - ${A2} = ${-d}\\text{ m}^2$.`,
      ),
      verify: () => (mode === 'minusPlus' ? d === x * (L - l) - x * x : mode === 'plusMinus' ? d === x * (l - L) - x * x : d === 0),
    }
  }
}

// ================= 6. the final tests (pp. 215–220) =================

/** (a⁴ − a³) : (a² − a) − m³·n² − r². p. 215, Test 1, IV.1. */
export function testsPowerQuotient(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 3, 15)
    const m = int(rng, 2, 4)
    const n = int(rng, 2, 4)
    const r = int(rng, 1, 9)
    const res = a * a - m ** 3 * n * n - r * r
    if (res < 0) continue
    return {
      text: `Calculați: $(${a}^4 - ${a}^3) : (${a}^2 - ${a}) - ${m}^3 \\cdot ${n}^2 - ${r}^2$.`,
      solution: lines(
        'Dăm factor comun în paranteze:',
        show(`(${a}^4 - ${a}^3) : (${a}^2 - ${a}) = ${a}^3 \\cdot (${a} - 1) : [${a} \\cdot (${a} - 1)] = ${a}^3 : ${a} = ${a}^2 = ${a * a}`),
        show(`${a * a} - ${m ** 3} \\cdot ${n * n} - ${r * r} = ${a * a} - ${m ** 3 * n * n} - ${r * r} = ${res}`),
      ),
      verify: () => (a ** 4 - a ** 3) / (a * a - a) - m ** 3 * n * n - r * r === res,
    }
  }
}

/** a : b = k: three expressions with a and b. p. 219, Test 5, IV. */
export function testsRatioLetters(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 15)
    const c = int(rng, 2, 6)
    const p = int(rng, 2, 9)
    const q = int(rng, 1, 9)
    const s1 = int(rng, 1, c * k)
    const s2 = int(rng, 0, k - 1)
    const s3 = int(rng, 1, p * k + q)
    return {
      text: lines(
        `Se consideră numerele naturale nenule $a$ și $b$. Dacă $a : b = ${k}$, calculați:`,
        `a) $${c} \\cdot a : b - ${s1}$; b) $(a - b) : b - ${s2}$; c) $(${p}a + ${q}b) : b - ${s3}$.`,
      ),
      solution: lines(
        `Din $a : b = ${k}$ avem $a = ${k}b$.`,
        show(`\\text{a) } ${c} \\cdot ${k} - ${s1} = ${c * k - s1}`),
        show(`\\text{b) } (${k}b - b) : b - ${s2} = ${k - 1} - ${s2} = ${k - 1 - s2}`),
        show(`\\text{c) } (${p * k}b + ${q}b) : b - ${s3} = ${p * k + q} - ${s3} = ${p * k + q - s3}`),
      ),
      verify: () => {
        const b = 7
        const a = k * b
        return (c * a) / b - s1 === c * k - s1 && (a - b) / b - s2 === k - 1 - s2 && (p * a + q * b) / b - s3 === p * k + q - s3 && k - 1 - s2 >= 0
      },
    }
  }
}

/** The side and the area of a square from a decimal perimeter. p. 216, Test 2, III.3; p. 218, Test 4, III.3. */
export function testsSquareDecimal(rng: Rng): Made {
  const s = int(rng, 11, 499) // cm
  const P = 4 * s
  return {
    text: `Un pătrat are perimetrul de $${dec(P, 2)}$ m. Calculați lungimea laturii și aria pătratului, în metri pătrați.`,
    solution: lines(
      show(`l = ${dec(P, 2)} : 4 = ${dec(s, 2)}\\text{ m}`),
      show(`\\mathcal{A} = ${dec(s, 2)} \\cdot ${dec(s, 2)} = ${dec(s * s, 4)}\\text{ m}^2`),
    ),
    verify: () => Math.abs(Number(dec(s * s, 4).replace('{,}', '.')) - (s / 100) ** 2) < 1e-9,
  }
}

/** Banknotes of two values: possible or not, and how many of each. p. 215, Test 1, V.1. */
export function testsBanknotes(rng: Rng): Made {
  for (;;) {
    const [v1, v2] = pick(rng, [[10, 5], [50, 10], [5, 1], [100, 50], [50, 20], [10, 1]] as const)
    const n = int(rng, 8, 60)
    const x = int(rng, 1, n - 1)
    const y = n - x
    const S = x * v1 + y * v2
    const m = int(rng, 1, 15)
    const rest = S - m * v2
    const ok = rest >= 0 && rest % v1 === 0
    const name = pick(rng, NAMES)
    const pctOk = (100 * y) % x === 0
    return {
      text: lines(
        `${name} are suma de ${de(S)} lei în bancnote de ${de(v1)} lei și de ${de(v2)} lei.`,
        `a) Este posibil ca ${name} să aibă ${m === 1 ? 'o singură bancnotă' : `${de(m)} bancnote`} de ${de(v2)} lei? Justificați răspunsul.`,
        `b) Dacă ${name} are în total ${de(n)} bancnote, aflați numărul bancnotelor de ${de(v1)} lei.`,
        ...(pctOk ? [`c) Aflați ce procent din numărul bancnotelor de ${de(v1)} lei reprezintă numărul bancnotelor de ${de(v2)} lei.`] : []),
      ),
      solution: lines(
        rest < 0
          ? `a) ${m === 1 ? 'O bancnotă' : `${de(m)} bancnote`} de ${de(v2)} lei ar însemna ${de(m * v2)} lei, mai mult decât suma totală. Nu este posibil.`
          : `a) ${m === 1 ? 'O bancnotă' : `${de(m)} bancnote`} de ${de(v2)} lei înseamnă ${de(m * v2)} lei; ar mai rămâne $${S} - ${m * v2} = ${rest}$ lei, care ${ok ? 'se pot' : 'nu se pot'} plăti numai cu bancnote de ${de(v1)} lei${ok ? '' : `, pentru că ${rest} nu se împarte exact la ${v1}`}. ${ok ? 'Da, este posibil.' : 'Nu este posibil.'}`,
        `b) Presupunem că toate cele ${de(n)} bancnote ar fi de ${de(v2)} lei: $${n} \\cdot ${v2} = ${n * v2}$ lei. Diferența $${S} - ${n * v2} = ${S - n * v2}$ lei vine din bancnotele de ${de(v1)} lei, fiecare cu ${de(v1 - v2)} lei mai mult:`,
        show(`${S - n * v2} : ${v1 - v2} = ${x}`),
        `Sunt ${x === 1 ? 'o bancnotă' : `${de(x)} bancnote`} de ${de(v1)} lei (și ${y === 1 ? 'o bancnotă' : `${de(y)} bancnote`} de ${de(v2)} lei).`,
        ...(pctOk ? [show(`\\text{c) } \\frac{${y}}{${x}} = \\frac{${(100 * y) / x}}{100} = ${(100 * y) / x}\\%`)] : []),
      ),
      verify: () => x * v1 + y * v2 === S && (S - n * v2) / (v1 - v2) === x && ok === (rest >= 0 && (S - m * v2) % v1 === 0),
    }
  }
}

/** Two positive rationals: their difference (or sum) and one is k times the other. p. 216, Test 2, V.1c. */
export function testsTwoRationals(rng: Rng): Made {
  const k = int(rng, 2, 9)
  const s = int(rng, 11, 999) // tenths
  const sum = rng() < 0.4
  const T = sum ? (k + 1) * s : (k - 1) * s
  return {
    text: `${sum ? 'Suma' : 'Diferența'} a două numere raționale pozitive este $${dec(T, 1)}$. Determinați cele două numere, știind că unul dintre ele este de ${k} ori mai mare decât celălalt.`,
    solution: lines(
      `Numărul mic are o parte, iar numărul mare ${k} părți; ${sum ? 'suma' : 'diferența'} are ${sum ? k + 1 : k - 1} ${(sum ? k + 1 : k - 1) === 1 ? 'parte' : 'părți'}:`,
      show(`${dec(T, 1)} : ${sum ? k + 1 : k - 1} = ${dec(s, 1)}, \\quad ${k} \\cdot ${dec(s, 1)} = ${dec(k * s, 1)}`),
      `Numerele sunt $${dec(s, 1)}$ și $${dec(k * s, 1)}$.`,
    ),
    verify: () => (sum ? k * s + s : k * s - s) === T,
  }
}

/** a kg of one fruit and b kg of another, then 2a kg and d kg: prices and mean price. p. 218, Test 4, V.1. */
export function testsFruitPrices(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 5)
    const b = int(rng, 2, 7)
    const d = int(rng, 1, 2 * b - 1)
    const x = 50 * int(rng, 4, 30) // bani
    const y = 50 * int(rng, 4, 30)
    if (x === y) continue
    const S1 = a * x + b * y
    const S2 = 2 * a * x + d * y
    const [f1, f2] = pick(rng, [['prune', 'struguri'], ['mere', 'pere'], ['cireșe', 'caise'], ['roșii', 'ardei'], ['portocale', 'banane']])
    const K = a + b + 2 * a + d
    const T = S1 + S2
    const mean = Math.floor((T + 5 * K) / (10 * K)) // tenths of a leu, rounded
    return {
      text: lines(
        `Pentru ${a} kg de ${f1} și ${b} kg de ${f2} s-au plătit $${dec(S1, 2)}$ lei, iar pentru ${2 * a} kg de ${f1} și ${d} kg de ${f2} s-au plătit $${dec(S2, 2)}$ lei. Calculați:`,
        `a) prețul unui kilogram de ${f2};`,
        `b) prețul unui kilogram de ${f1};`,
        'c) prețul mediu plătit pentru un kilogram din fructele cumpărate, rotunjit la zecimi.',
      ),
      solution: lines(
        `a) Dublăm prima cumpărătură: ${2 * a} kg de ${f1} și ${2 * b} kg de ${f2} ar costa $2 \\cdot ${dec(S1, 2)} = ${dec(2 * S1, 2)}$ lei. Față de a doua cumpărătură, diferența vine din cele $${2 * b} - ${d} = ${2 * b - d}$ kg de ${f2}:`,
        show(`(${dec(2 * S1, 2)} - ${dec(S2, 2)}) : ${2 * b - d} = ${dec(2 * S1 - S2, 2)} : ${2 * b - d} = ${dec(y, 2)}\\text{ lei}`),
        show(`\\text{b) } (${dec(S1, 2)} - ${b} \\cdot ${dec(y, 2)}) : ${a} = ${dec(S1 - b * y, 2)} : ${a} = ${dec(x, 2)}\\text{ lei}`),
        `c) S-au cumpărat $${a + 2 * a} + ${b + d} = ${K}$ kg pentru $${dec(S1, 2)} + ${dec(S2, 2)} = ${dec(T, 2)}$ lei.`,
        show(`${dec(T, 2)} : ${K} \\approx ${dec(mean, 1)}\\text{ lei}`),
      ),
      verify: () => (2 * S1 - S2) / (2 * b - d) === y && (S1 - b * y) / a === x && Math.abs(T / 100 / K - mean / 10) <= 0.05 + 1e-9,
    }
  }
}

/** bⁿ + bⁿ⁺¹ + … + bⁿ⁺ᵏ⁻¹ is a multiple of 1 + b + … + bᵏ⁻¹. p. 216, Test 2, V.1b. */
export function testsPowerSumMultiple(rng: Rng): Made {
  const b = int(rng, 2, 6)
  const k = int(rng, 2, 6)
  if (b ** (k - 1) > 1300 || (k === 2 && b < 3)) return testsPowerSumMultiple(rng)
  let M = 0
  for (let i = 0; i < k; i++) M += b ** i
  const terms = Array.from({ length: k }, (_, i) => (i === 0 ? `${b}^n` : `${b}^{n + ${i}}`))
  const inner = Array.from({ length: k }, (_, i) => (i === 0 ? '1' : i === 1 ? `${b}` : `${b}^${i}`))
  const letter = pick(rng, ['a', 'A', 'N', 'x'])
  return {
    text: `Demonstrați că numărul $${letter} = ${terms.join(' + ')}$ este multiplu al numărului ${M}, pentru orice număr natural $n$.`,
    solution: lines(
      `Dăm factor comun pe $${b}^n$:`,
      show(`${letter} = ${b}^n \\cdot (${inner.join(' + ')}) = ${b}^n \\cdot ${M}`),
      `Deci $${letter}$ este multiplu al lui ${M}.`,
    ),
    verify: () => [0, 1, 2, 3].every((n) => {
      let s = 0
      for (let i = 0; i < k; i++) s += b ** (n + i)
      return s % M === 0
    }),
  }
}

/** n = [0,ab + 0,(ab)]·L, a whole number: its square. p. 219, Test 5, V.1c. */
export function testsPeriodicSquare(rng: Rng): Made {
  for (;;) {
    const ab = int(rng, 10, 99)
    if (ab % 11 === 0 || ab % 10 === 0) continue
    const [p1, q1] = reduce(ab, 100)
    const [p2, q2] = reduce(ab, 99)
    const L = (q1 * q2) / gcd(q1, q2)
    if (L > 9900) continue
    const n = (p1 * L) / q1 + (p2 * L) / q2
    return {
      text: `Calculați pătratul numărului $n$, unde $n = [0{,}${ab} + 0{,}(${ab})] \\cdot ${L}$.`,
      solution: lines(
        show(`0{,}${ab} = \\frac{${ab}}{100}${q1 === 100 ? '' : ` = ${frac(ab, 100)}`}, \\quad 0{,}(${ab}) = \\frac{${ab}}{99}${q2 === 99 ? '' : ` = ${frac(ab, 99)}`}`),
        show(`n = ${frac(p1, q1)} \\cdot ${L} + ${frac(p2, q2)} \\cdot ${L} = ${(p1 * L) / q1} + ${(p2 * L) / q2} = ${n}`),
        show(`n^2 = ${n}^2 = ${n * n}`),
      ),
      verify: () => Math.abs((ab / 100 + ab / 99) * L - n) < 1e-6 && Number.isInteger(n),
    }
  }
}

/** p/q, kp/kq and (pn + pm)/(qn + qm) are the same rational number; as a decimal. p. 217, Test 3, V.1. */
export function testsEquivalentFamily(rng: Rng): Made {
  for (;;) {
    const q = pick(rng, [2, 4, 5, 8, 20, 25])
    const p = int(rng, q + 1, 12 * q)
    if (gcd(p, q) !== 1) continue
    const k = int(rng, 2, 9)
    const m = int(rng, 1, 9)
    const v = (p * 1000) / q // thousandths
    return {
      text: lines(
        `a) Arătați că fracțiile $\\frac{${p}}{${q}}$, $\\frac{${k * p}}{${k * q}}$ și $\\frac{${p} \\cdot n + ${p * m}}{${q} \\cdot n + ${q * m}}$ reprezintă același număr rațional, oricare ar fi numărul natural $n$.`,
        'b) Scrieți acest număr ca fracție zecimală.',
      ),
      solution: lines(
        `a) $\\frac{${k * p}}{${k * q}}$ se simplifică prin ${k} și dă $\\frac{${p}}{${q}}$.`,
        show(`\\frac{${p} \\cdot n + ${p * m}}{${q} \\cdot n + ${q * m}} = \\frac{${p} \\cdot (n + ${m})}{${q} \\cdot (n + ${m})} = \\frac{${p}}{${q}}`),
        `(am simplificat prin $n + ${m} \\neq 0$).`,
        show(`\\text{b) } \\frac{${p}}{${q}} = ${p} : ${q} = ${dec(v, 3)}`),
      ),
      verify: () => Number.isInteger(v) && [0, 1, 5].every((n) => (p * n + p * m) * q === (q * n + q * m) * p),
    }
  }
}

// ================= the kinds =================

export const KINDS: GradeKind[] = [
  {
    id: 'v-final-naturals', label: 'Recapitulare finală: numere naturale și divizibilitate', topic: 'Algebră',
    forms: { 1: [naturalsTwoDigit, naturalsPairSums, naturalsDivisionProof], 2: [naturalsCombination, naturalsSubtractSame, naturalsDigitsDivisible, naturalsTwoPrimes], 3: [naturalsLastDigitSum, naturalsGaussSquare, naturalsPowerSumDivisible] },
  },
  {
    id: 'v-final-methods', label: 'Recapitulare finală: metode aritmetice', topic: 'Algebră',
    forms: { 1: [methodsUnitPrice, methodsConsecutive, methodsWorkersInverse], 2: [methodsSumQuotient, methodsTwoItems, methodsBackwards], 3: [methodsBenches, methodsJourney, methodsBottles] },
  },
  {
    id: 'v-final-fractions', label: 'Recapitulare finală: fracții ordinare și zecimale', topic: 'Algebră',
    forms: { 1: [fractionsOrder, fractionsPercents, fractionsFindN, fractionsPartOf], 2: [fractionsNaturalX, fractionsGcdPairs, fractionsPercentChange, fractionsDecimalDigits], 3: [fractionsEquivalentX, fractionsTelescoping, fractionsNaturalCondition] },
  },
  {
    id: 'v-final-geometry', label: 'Recapitulare finală: drepte, segmente, unghiuri', topic: 'Geometrie',
    forms: { 1: [geoCollinearCases, geoCollinearCheck, geoMidpointsThree], 2: [geoInteriorMultiple, geoBisectorChain, geoAngleExpression], 3: [geoRightAngleSplit, geoStraightPercent, geoSegmentPercent] },
  },
  {
    id: 'v-final-measures', label: 'Recapitulare finală: unități de măsură, arii, volume', topic: 'Geometrie',
    forms: { 1: [measuresLengthSum, measuresSquarePerimeter, measuresRectArea], 2: [measuresRectDims, measuresSquareRect, measuresPaving, measuresGardenParts], 3: [measuresCuboidWater, measuresCubeScale, measuresAreaChange] },
  },
  {
    id: 'v-final-tests', label: 'Teste de evaluare finală', topic: 'Algebră',
    forms: { 1: [testsPowerQuotient, testsRatioLetters, testsSquareDecimal], 2: [testsBanknotes, testsTwoRationals, testsFruitPrices], 3: [testsPowerSumMultiple, testsPeriodicSquare, testsEquivalentFamily] },
  },
]

export const CONTEST: ContestKind[] = []
