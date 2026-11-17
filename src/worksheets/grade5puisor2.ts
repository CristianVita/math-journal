// Grade V forms from the second grade V workbook (the one "cu puișorul"), pp. 34–61, photographed by the user on
// 14 November 2026: the end of the methods chapter (p. 34), divisibility, divisors and multiples, the criteria, the
// prime numbers (pp. 34–39), the chapter tests (p. 40), the contest problems (pp. 41–43), ordinary fractions:
// subunitary and supraunitary fractions, percents, equivalent fractions, comparison, wholes, simplification, the
// common denominator, addition and subtraction, multiplication, powers, division, parts of a number and the tests
// (pp. 44–60), and the first page of the decimals chapter (p. 61).
// These pages repeat chapters the app already has, so every kind here joins an existing kind (`joins`).
// The levels follow the stars of the book (* = 1, ** = 2, *** = 3); unmarked items are placed by their content.
// Every form names its page and exercise.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, poly, reduce, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  /** 'v-…', unique */
  id: string
  /** Romanian, shown in the interface (only for a kind that does not join another) */
  label: string
  topic: 'Algebră' | 'Geometrie'
  /** an existing kind whose forms these are added to */
  joins?: string
  /** level 1 easy, 2 medium, 3 hard */
  forms: Record<1 | 2 | 3, Form[]>
}
/** contest level only */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** The word "de" alone, after a formula that ends with the number: "$… = 120$ de litri". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
const COUNTW: Record<number, string> = { 2: 'două', 3: 'trei', 4: 'patru', 5: 'cinci', 6: 'șase', 7: 'șapte' }
/** A whole number in LaTeX, with thin spaces between groups of three digits from 10 000 up. */
const nr = (n: number) => (Math.abs(n) < 10000 ? String(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))

// ---------- exact fractions ----------
type Q = [number, number]
const q = (p: number, d = 1): Q => reduce(p, d)
const qa = (x: Q, y: Q) => q(x[0] * y[1] + y[0] * x[1], x[1] * y[1])
const qs = (x: Q, y: Q) => q(x[0] * y[1] - y[0] * x[1], x[1] * y[1])
const qm = (x: Q, y: Q) => q(x[0] * y[0], x[1] * y[1])
const qd = (x: Q, y: Q) => q(x[0] * y[1], x[1] * y[0])
const qeq = (x: Q, y: Q) => x[0] * y[1] === y[0] * x[1]
const F = (x: Q) => frac(x[0], x[1])
/** a/b written as given, not simplified */
const raw = (a: number, b: number) => `\\frac{${a}}{${b}}`
/** w a/b written as given */
const mx = (w: number, a: number, b: number) => `${w}\\frac{${a}}{${b}}`
/** A positive fraction, simplified, then as a mixed number when it is greater than 1: \frac{7}{2} = 3\frac{1}{2}. */
function res(x: Q): string {
  const [n, d] = q(x[0], x[1])
  if (d === 1 || n < d) return frac(n, d)
  return `${frac(n, d)} = ${Math.floor(n / d)}\\frac{${n % d}}{${d}}`
}
/** What follows a fraction written unsimplified: ' = 3/2 = 1 1/2', only the steps that change something. */
function after(num: number, den: number): string {
  const r = q(num, den)
  let s = r[1] !== den ? ` = ${F(r)}` : ''
  if (r[1] > 1 && r[0] > r[1]) s += ` = ${Math.floor(r[0] / r[1])}\\frac{${r[0] % r[1]}}{${r[1]}}`
  return s
}
const P = (a: number, b: number) => `\\left(\\frac{${a}}{${b}}\\right)`

// ---------- natural numbers ----------
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const divisors = (n: number) => {
  const out: number[] = []
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d)
  return out
}
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
function factors(n: number): [number, number][] {
  const out: [number, number][] = []
  for (let p = 2; p * p <= n; p++) {
    let e = 0
    while (n % p === 0) {
      n /= p
      e++
    }
    if (e) out.push([p, e])
  }
  if (n > 1) out.push([n, 1])
  return out
}
const powTex = (f: [number, number][]) => f.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join(' \\cdot ')
const set = (l: number[]) => `\\{${l.join(', ')}\\}`
const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)
const digitSum = (n: number) => String(n).split('').reduce((s, c) => s + Number(c), 0)
const andList = (l: (string | number)[]) => (l.length === 1 ? String(l[0]) : `${l.slice(0, -1).join(', ')} și ${l[l.length - 1]}`)
const PRIMES = range(2, 200).filter(isPrime)

// ================= divisibility (pp. 34–40) =================

/** The g.c.d. and the l.c.m. of two numbers from their prime factors, p. 35, ex. 12 and 14 (p. 49, ex. 1–2). */
function divGcdLcm(rng: Rng): Made {
  for (;;) {
    const g = int(rng, 2, 12)
    const m = int(rng, 2, 12)
    const n = int(rng, 2, 12)
    if (m >= n || gcd(m, n) !== 1) continue
    const a = g * m
    const b = g * n
    if (b > 180) continue
    const fa = new Map(factors(a))
    const fb = new Map(factors(b))
    const ps = [...new Set([...fa.keys(), ...fb.keys()])].sort((x, y) => x - y)
    const gF = ps.filter((p) => fa.has(p) && fb.has(p)).map((p): [number, number] => [p, Math.min(fa.get(p)!, fb.get(p)!)])
    const lF = ps.map((p): [number, number] => [p, Math.max(fa.get(p) ?? 0, fb.get(p) ?? 0)])
    const G = gF.reduce((s, [p, e]) => s * p ** e, 1)
    const L = lF.reduce((s, [p, e]) => s * p ** e, 1)
    const eqv = (t: string, v: number) => (t === String(v) ? t : `${t} = ${v}`)
    const [x, y] = rng() < 0.5 ? [a, b] : [b, a]
    return {
      text: `Aflați cel mai mare divizor comun și cel mai mic multiplu comun al numerelor ${x} și ${y}.`,
      solution: lines(
        'Descompunem numerele în produs de factori primi:',
        show(`${x} = ${powTex(factors(x))}, \\qquad ${y} = ${powTex(factors(y))}`),
        'Pentru c.m.m.d.c. luăm doar factorii comuni, la puterea cea mai mică; pentru c.m.m.m.c. luăm toți factorii, comuni și necomuni, la puterea cea mai mare:',
        show(`(${x}, ${y}) = ${eqv(powTex(gF), G)}, \\qquad [${x}, ${y}] = ${eqv(powTex(lF), L)}`),
      ),
      verify: () => {
        let g2 = 1
        for (let d = 1; d <= a; d++) if (a % d === 0 && b % d === 0) g2 = d
        let l2 = b
        while (l2 % a !== 0) l2 += b
        return g2 === G && l2 === L
      },
    }
  }
}

interface Criterion { t: string; rule: string; sums: boolean; ok: (x: number) => boolean; check: (x: number) => boolean }
const by = (x: number, d: number) => Number.isInteger(x / d)
const CRITERIA: Criterion[] = [
  { t: 'divizibile cu 2 și cu 5', rule: 'Un număr se divide cu 2 și cu 5 exact când ultima lui cifră este 0.', sums: false, ok: (x) => x % 10 === 0, check: (x) => by(x, 2) && by(x, 5) },
  { t: 'divizibile cu 3, dar nu cu 9', rule: 'Un număr se divide cu 3 dacă suma cifrelor lui se divide cu 3 și cu 9 dacă suma cifrelor se divide cu 9.', sums: true, ok: (x) => digitSum(x) % 3 === 0 && digitSum(x) % 9 !== 0, check: (x) => by(x, 3) && !by(x, 9) },
  { t: 'divizibile cu 4', rule: 'Un număr se divide cu 4 dacă numărul format din ultimele lui două cifre se divide cu 4.', sums: false, ok: (x) => (x % 100) % 4 === 0, check: (x) => by(x, 4) },
  { t: 'divizibile cu 25', rule: 'Un număr se divide cu 25 dacă ultimele lui două cifre formează 00, 25, 50 sau 75.', sums: false, ok: (x) => [0, 25, 50, 75].includes(x % 100), check: (x) => by(x, 25) },
  { t: 'divizibile cu 2 și cu 3', rule: 'Un număr se divide cu 2 dacă ultima lui cifră este pară și cu 3 dacă suma cifrelor lui se divide cu 3.', sums: true, ok: (x) => x % 2 === 0 && digitSum(x) % 3 === 0, check: (x) => by(x, 6) },
  { t: 'divizibile cu 5, dar nu cu 3', rule: 'Un număr se divide cu 5 dacă ultima lui cifră este 0 sau 5 și cu 3 dacă suma cifrelor lui se divide cu 3.', sums: true, ok: (x) => [0, 5].includes(x % 10) && digitSum(x) % 3 !== 0, check: (x) => by(x, 5) && !by(x, 3) },
  { t: 'divizibile cu 9', rule: 'Un număr se divide cu 9 dacă suma cifrelor lui se divide cu 9.', sums: true, ok: (x) => digitSum(x) % 9 === 0, check: (x) => by(x, 9) },
  { t: 'divizibile cu 3 și cu 5', rule: 'Un număr se divide cu 5 dacă ultima lui cifră este 0 sau 5 și cu 3 dacă suma cifrelor lui se divide cu 3.', sums: true, ok: (x) => [0, 5].includes(x % 10) && digitSum(x) % 3 === 0, check: (x) => by(x, 15) },
]

/** The numbers of a list that meet a condition given by the criteria, p. 37, ex. 2 and 5 (p. 35, ex. 8). */
function divCriteriaPick(rng: Rng): Made {
  const c = pick(rng, CRITERIA)
  const k = int(rng, 2, 4)
  const nums: number[] = []
  while (nums.length < 8) {
    const x = int(rng, 12, 999)
    if (nums.includes(x) || c.ok(x) !== nums.length < k) continue
    nums.push(x)
  }
  const list = shuffle(rng, nums)
  const yes = list.filter((x) => c.ok(x))
  const half = (l: number[]) => show(l.map((x) => `S(${x}) = ${digitSum(x)}`).join(', \\quad '))
  return {
    text: `Alegeți dintre numerele ${list.join('; ')} pe cele ${c.t}.`,
    solution: lines(
      c.rule,
      c.sums ? 'Notăm cu $S(n)$ suma cifrelor numărului $n$:' : '',
      c.sums ? half(list.slice(0, 4)) : '',
      c.sums ? half(list.slice(4)) : '',
      `Îndeplinesc condiția numerele ${andList(yes)}.`,
    ),
    verify: () => list.filter((x) => c.check(x)).join() === yes.join() && yes.length === k,
  }
}

/** The smallest and the largest number with d digits divisible by two or three numbers, p. 37, ex. 6 (p. 35, ex. 4). */
function divSmallestLargest(rng: Rng): Made {
  for (;;) {
    const ds = pick(rng, [[3, 5], [2, 9], [4, 5], [2, 3, 5], [4, 9], [3, 4], [5, 9], [2, 5, 9], [4, 7], [2, 3, 7]])
    const d = int(rng, 2, 4)
    const L = ds.reduce((s, x) => s * x, 1)
    if (d === 2 && L > 45) continue
    const lo = 10 ** (d - 1)
    const hi = 10 ** d - 1
    const [ql, rl] = [Math.floor(lo / L), lo % L]
    const [qh, rh] = [Math.floor(hi / L), hi % L]
    const small = rl === 0 ? lo : L * (ql + 1)
    const big = L * qh
    const tx = andList(ds)
    return {
      text: `Determinați cel mai mic și cel mai mare număr natural de ${d} cifre divizibil cu ${tx}.`,
      solution: lines(
        `Numerele ${tx} sunt prime între ele${ds.length > 2 ? ' două câte două' : ''}, deci un număr se divide cu fiecare dintre ele exact când se divide cu produsul lor, $${ds.join(' \\cdot ')} = ${L}$.`,
        `Cel mai mic număr de ${d} cifre este ${lo}:`,
        show(`${nr(lo)} = ${L} \\cdot ${ql}${rl ? ` + ${rl}` : ''}`),
        rl === 0 ? `deci chiar ${lo} este cel căutat.` : `deci cel mai mic multiplu de ${L} cu ${d} cifre este $${L} \\cdot ${ql + 1} = ${nr(small)}$.`,
        `Cel mai mare număr de ${d} cifre este ${hi}:`,
        show(`${nr(hi)} = ${L} \\cdot ${qh}${rh ? ` + ${rh}` : ''}`),
        `deci cel mai mare multiplu de ${L} cu ${d} cifre este $${L} \\cdot ${qh} = ${nr(big)}$.`,
      ),
      verify: () => {
        const ok = range(lo, hi).filter((x) => ds.every((y) => x % y === 0))
        return ok[0] === small && ok[ok.length - 1] === big
      },
    }
  }
}

/** The natural x for which kx + a divides N, p. 36, ex. 20 and p. 37, ex. 34. */
function divXDivides(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [1, 1, 2, 3])
    const a = k === 1 ? int(rng, 1, 6) : int(rng, 1, k - 1)
    const N = int(rng, 12, 90)
    const D = divisors(N)
    const good = D.filter((d) => d >= a && (d - a) % k === 0)
    if (good.length < 2 || good.length > 6) continue
    const xs = good.map((d) => (d - a) / k)
    const lin = poly([[k, 'x'], [a, '']])
    const cond = rng() < 0.5 ? `(${lin}) \\mid ${N}` : `${N} \\vdots (${lin})`
    return {
      text: `Aflați numerele naturale $x$ pentru care $${cond}$.`,
      solution: lines(
        `Numărul $${lin}$ trebuie să fie un divizor al lui ${N}:`,
        show(`D_{${N}} = ${set(D)}`),
        k === 1
          ? `Cum $x + ${a} \\geq ${a}$, rămân divizorii ${andList(good)}:`
          : `Numărul $${lin}$ este cel puțin ${a} și dă restul ${a} la împărțirea cu ${k}, deci rămân divizorii ${andList(good)}:`,
        show(good.map((d, i) => `${lin} = ${d} \\Rightarrow x = ${xs[i]}`).join('; \\quad ')),
        `Deci $x \\in ${set(xs)}$.`,
      ),
      verify: () => range(0, N).filter((x) => N % (k * x + a) === 0).join() === xs.join(),
    }
  }
}

/** The natural x < M for which k divides A + x, p. 35, ex. 6 (and p. 36, ex. 21). */
function divShiftedMultiple(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 3, 12)
    const A = int(rng, 11, 99)
    const M = int(rng, 15, 60)
    const r = A % k
    const x0 = (k - r) % k
    const xs: number[] = []
    for (let x = x0; x < M; x += k) xs.push(x)
    if (xs.length < 3 || xs.length > 9) continue
    return {
      text: `Determinați numerele naturale $x$ pentru care $x < ${M}$ și $${k} \\mid (${A} + x)$.`,
      solution: lines(
        show(`${A} = ${k} \\cdot ${(A - r) / k}${r ? ` + ${r}` : ''}`),
        r === 0
          ? `Numărul ${A} se divide cu ${k}, deci $${A} + x$ se divide cu ${k} exact când $x$ se divide cu ${k}.`
          : `Numărul $${A} + x$ se divide cu ${k} exact când $${r} + x$ se divide cu ${k}, adică atunci când $x$ dă restul ${x0} la împărțirea cu ${k}.`,
        `Numerele de acest fel mai mici decât ${M} sunt:`,
        show(`x \\in ${set(xs)}`),
      ),
      verify: () => range(0, M - 1).filter((x) => (A + x) % k === 0).join() === xs.join(),
    }
  }
}

/** The largest proper divisor of a number, of p^a·q^b and of m^n, p. 36, ex. 28. */
function divLargestProper(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 30, 300)
    if (isPrime(n)) continue
    const [p, r] = pick(rng, [[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [5, 7]])
    const e1 = int(rng, 5, 40)
    const e2 = int(rng, 5, 40)
    const m = pick(rng, [6, 10, 12, 14, 15, 20, 21, 35])
    const e3 = int(rng, 10, 60)
    const sp = (x: number) => factors(x)[0][0]
    const s1 = sp(n)
    const s3 = sp(m)
    return {
      text: `Aflați cel mai mare divizor propriu al fiecăruia dintre numerele: a) ${n}; b) $${p}^{${e1}} \\cdot ${r}^{${e2}}$; c) $${m}^{${e3}}$.`,
      solution: lines(
        'Divizorii proprii ai unui număr sunt divizorii lui diferiți de 1 și de numărul însuși. Cel mai mare dintre ei se obține împărțind numărul la cel mai mic divizor prim al său.',
        `a) Cel mai mic divizor prim al lui ${n} este ${s1}: $${n} : ${s1} = ${n / s1}$.`,
        `b) Cel mai mic divizor prim este ${p}:`,
        show(`${p}^{${e1}} \\cdot ${r}^{${e2}} : ${p} = ${p}^{${e1 - 1}} \\cdot ${r}^{${e2}}`),
        `c) $${m} = ${powTex(factors(m))}$, deci cel mai mic divizor prim este ${s3}:`,
        show(`${m}^{${e3}} : ${s3} = ${m}^{${e3 - 1}} \\cdot ${m} : ${s3} = ${m}^{${e3 - 1}} \\cdot ${m / s3}`),
      ),
      verify: () => {
        const prop = divisors(n).filter((d) => d !== n)
        const B = (x: number, e: number) => BigInt(x) ** BigInt(e)
        const N2 = B(p, e1) * B(r, e2)
        const D2 = B(p, e1 - 1) * B(r, e2)
        const N3 = B(m, e3)
        const D3 = B(m, e3 - 1) * BigInt(m / s3)
        return prop[prop.length - 1] === n / s1 && N2 / D2 === BigInt(p) && N2 % D2 === 0n && isPrime(p) && isPrime(r) && p < r &&
          N3 % D3 === 0n && N3 / D3 === BigInt(s3) && divisors(m).find((d) => d > 1) === s3
      },
    }
  }
}

/** The numbers between A and B that leave the remainder 7 or 8 when divided by a one-digit number, p. 40, Testul 2, ex. 4. */
function divRemainderRange(rng: Rng): Made {
  for (;;) {
    const r = pick(rng, [7, 8])
    const A = int(rng, 30, 400)
    const B = A + int(rng, 20, 45)
    const ds = r === 8 ? [9] : [8, 9]
    const xs = range(A + 1, B - 1).filter((x) => ds.some((d) => x % d === r))
    if (xs.length < 3) continue
    return {
      text: `Aflați toate numerele naturale mai mari decât ${A} și mai mici decât ${B} care, împărțite la un număr de o cifră, dau restul ${r}.`,
      solution: lines(
        r === 8
          ? 'Restul este mai mic decât împărțitorul, deci împărțitorul este mai mare decât 8: singurul număr de o cifră de acest fel este 9.'
          : 'Restul este mai mic decât împărțitorul, deci împărțitorul, de o cifră, este 8 sau 9.',
        ...ds.map((d) => `Cu împărțitorul ${d}, numerele sunt de forma $${d}c + ${r}$: ${andList(range(A + 1, B - 1).filter((x) => x % d === r))}.`),
        ds.length > 1 ? `În total: ${andList(xs)}.` : '',
      ),
      verify: () => range(A + 1, B - 1).filter((x) => range(1, 9).some((d) => x % d === r)).join() === xs.join(),
    }
  }
}

/** Two primes with an odd sum, and two primes with a given product, p. 39, ex. 9–11. */
function divPrimesSumProduct(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, PRIMES.filter((x) => x > 5 && x < 100))
    const S = p + 2
    const u = pick(rng, PRIMES.filter((x) => x < 20))
    const v = pick(rng, PRIMES.filter((x) => x > u && x < 100))
    const Pr = u * v
    if (Pr > 500) continue
    return {
      text: `a) Suma a două numere prime este ${S}. Aflați numerele. b) Produsul a două numere prime este ${Pr}. Aflați numerele.`,
      solution: lines(
        `a) Suma ${S} este impară. Suma a două numere impare este pară, deci unul dintre numere este par; singurul număr prim par este 2. Celălalt este $${S} - 2 = ${p}$, care este prim. Numerele sunt 2 și ${p}.`,
        `b) Descompunem în factori primi: $${Pr} = ${u} \\cdot ${v}$. Numerele ${u} și ${v} sunt prime, deci ele sunt numerele căutate.`,
      ),
      verify: () => {
        const sums = PRIMES.filter((x) => x <= S - x && isPrime(S - x))
        const prods = PRIMES.filter((x) => x * x <= Pr && Pr % x === 0 && isPrime(Pr / x))
        return sums.join() === '2' && prods.join() === String(u) && isPrime(p)
      },
    }
  }
}

const CYCLE: Record<number, number[]> = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6] }

/** The last digit of 1 + a + a² + … + aⁿ: the last digits of the powers repeat in fours, p. 38, ex. 17 and 20. */
function divLastDigitSeries(rng: Rng): Made {
  const a = pick(rng, [2, 3, 7, 8])
  const n = int(rng, 20, 150)
  const c = CYCLE[a]
  const g = Math.floor(n / 4)
  const j = n % 4
  const tail = c.slice(0, j)
  const ans = (1 + tail.reduce((s, x) => s + x, 0)) % 10
  const tailTex = range(1, j).map((i) => `${a}^{${4 * g + i}}`).join(', ')
  return {
    text: `Aflați ultima cifră a numărului $S = 1 + ${a} + ${a}^2 + ${a}^3 + \\ldots + ${a}^{${n}}$.`,
    solution: lines(
      `Ultimele cifre ale puterilor lui ${a} se repetă din patru în patru: $${a}^1, ${a}^2, ${a}^3, ${a}^4$ se termină în ${c.join(', ')}, apoi la fel.`,
      `Patru puteri consecutive $${a}^{4k+1} + ${a}^{4k+2} + ${a}^{4k+3} + ${a}^{4k+4}$ au suma ultimelor cifre $${c.join(' + ')} = 20$, deci suma lor se termină în 0.`,
      `Avem $${n} = 4 \\cdot ${g}${j ? ` + ${j}` : ''}$. După 1 urmează ${de(g)} grupe de câte patru puteri (până la $${a}^{${4 * g}}$)${j ? `, apoi ${j === 1 ? 'puterea' : 'puterile'} $${tailTex}$, care se ${j === 1 ? 'termină' : 'termină, pe rând,'} în ${tail.join(', ')}` : ''}.`,
      show(`U(S) = U(1${tail.map((x) => ` + ${x}`).join('')}) = ${ans}`),
    ),
    verify: () => {
      let s = 0
      let p = 1
      for (let i = 0; i <= n; i++) {
        s = (s + p) % 10
        p = (p * a) % 10
      }
      return s === ans
    },
  }
}

const SERIES: [number, number, number][] = [
  [2, 2, 3], [2, 3, 7], [2, 4, 15], [3, 2, 4], [3, 3, 13], [3, 4, 40], [4, 2, 5], [4, 3, 21], [5, 2, 6], [5, 3, 31], [6, 2, 7], [7, 2, 8],
]

/** 1 + a + … + aⁿ is divisible by 1 + a + … + a^(k−1): the terms grouped by k, p. 36, ex. 26 and 29 (p. 37, ex. 31). */
function divSeriesGroups(rng: Rng): Made {
  const [a, k, M] = pick(rng, SERIES)
  const t = int(rng, 6, 40)
  const n = k * t - 1
  const inner = range(0, k - 1).map((i) => (i === 0 ? '1' : i === 1 ? `${a}` : `${a}^{${i}}`)).join(' + ')
  const vals = range(0, k - 1).map((i) => a ** i)
  return {
    text: `Arătați că numărul $S = 1 + ${a} + ${a}^2 + \\ldots + ${a}^{${n}}$ este divizibil cu ${M}.`,
    solution: lines(
      `Suma are ${de(n + 1)} termeni, adică ${de(t)} grupe de câte ${k}. Grupăm termenii câte ${k} și dăm factor comun în fiecare grupă:`,
      show(`S = (${inner}) + ${a}^{${k}} \\cdot (${inner}) + \\ldots + ${a}^{${n - k + 1}} \\cdot (${inner})`),
      show(k > 2 ? `${inner} = ${vals.join(' + ')} = ${M}` : `${inner} = ${M}`),
      show(`S = ${M} \\cdot (1 + ${a}^{${k}} + \\ldots + ${a}^{${n - k + 1}})`),
      `deci $S$ se divide cu ${M}.`,
    ),
    verify: () => {
      let s = 0
      let p = 1
      for (let i = 0; i <= n; i++) {
        s = (s + p) % M
        p = (p * a) % M
      }
      return s === 0 && vals.reduce((x, y) => x + y, 0) === M
    },
  }
}

/** (x + a)(y + b) = N, or xy + x + y = N − 1, in natural numbers, p. 35, ex. 15. */
function divProductEquation(rng: Rng): Made {
  for (;;) {
    const sumForm = rng() < 0.3
    const a = sumForm ? 1 : int(rng, 0, 3)
    const b = sumForm ? 1 : int(rng, 1, 3)
    const N = int(rng, 6, 48)
    const D = divisors(N)
    const ds = D.filter((d) => d >= a && N / d >= b)
    if (ds.length < 2 || ds.length > 8) continue
    const sols = ds.map((d) => [d - a, N / d - b])
    const xa = a === 0 ? 'x' : `x + ${a}`
    const eq = sumForm ? `xy + x + y = ${N - 1}` : `${a === 0 ? 'x' : `(x + ${a})`} \\cdot (y + ${b}) = ${N}`
    return {
      text: `Aflați numerele naturale $x$ și $y$ pentru care $${eq}$.`,
      solution: lines(
        sumForm ? `Adunăm 1 în ambii membri: $xy + x + y + 1 = ${N}$, adică $x(y + 1) + (y + 1) = ${N}$, deci $(x + 1)(y + 1) = ${N}$.` : '',
        `Numerele $${xa}$ și $y + ${b}$ sunt divizori ai lui ${N} cu produsul ${N}, iar $${xa} \\geq ${a}$, $y + ${b} \\geq ${b}$:`,
        show(`\\begin{aligned} ${ds.map((d, i) => `${xa} = ${d}, \\; y + ${b} = ${N / d} &\\Rightarrow x = ${sols[i][0]}, \\; y = ${sols[i][1]}`).join(' \\\\ ')} \\end{aligned}`),
        `Soluțiile sunt perechile $(x, y)$: ${sols.map(([x, y]) => `$(${x}, ${y})$`).join(', ')}.`,
      ),
      verify: () => {
        const all: string[] = []
        for (let x = 0; x <= N; x++) for (let y = 0; y <= N; y++) if ((sumForm ? x * y + x + y === N - 1 : (x + a) * (y + b) === N)) all.push(`${x},${y}`)
        return all.join(';') === sols.map((s) => s.join()).join(';')
      },
    }
  }
}

// ================= fractions: writing, percents, equivalence, comparison (pp. 44–50, 58–60) =================

/** Percents as irreducible fractions, and fractions with denominators dividing 100 as percents, p. 44, ex. 6 and p. 49, ex. 11. */
function fpPercents(rng: Rng): Made {
  for (;;) {
    const ps = [int(rng, 2, 99), int(rng, 101, 250), pick(rng, [5, 12, 15, 24, 25, 35, 36, 45, 48, 55, 64, 72, 75, 84, 85, 95, 96])]
    if (new Set(ps).size < 3 || ps.some((p) => p % 100 === 0)) continue
    const fr: Q[] = []
    while (fr.length < 2) {
      const b = pick(rng, [2, 4, 5, 10, 20, 25, 50])
      const a = int(rng, 1, 2 * b - 1)
      if (gcd(a, b) !== 1 || a === b || fr.some((f) => f[1] === b)) continue
      fr.push([a, b])
    }
    return {
      text: `a) Scrieți sub formă de fracții ordinare ireductibile: ${ps.map((p) => `$${p}\\%$`).join(', ')}. b) Scrieți sub formă de procent fracțiile $${raw(...fr[0])}$ și $${raw(...fr[1])}$.`,
      solution: lines(
        'a) Un procent este o fracție cu numitorul 100, pe care o simplificăm:',
        show(ps.map((p) => `${p}\\% = ${raw(p, 100)}${gcd(p, 100) > 1 ? ` = ${frac(p, 100)}` : ''}`).join(', \\qquad ')),
        'b) Amplificăm fracțiile ca să aibă numitorul 100:',
        show(fr.map(([a, b]) => `${raw(a, b)} = ${raw(a * (100 / b), 100)} = ${a * (100 / b)}\\%`).join(', \\qquad ')),
      ),
      verify: () => ps.every((p) => qeq(q(p, 100), [p, 100]) && reduce(p, 100)[1] > 1) && fr.every(([a, b]) => Math.abs((a / b) * 100 - a * (100 / b)) < 1e-9),
    }
  }
}

/** A part of a quantity given by a fraction, and what remains, p. 58, ex. 2–4 and 7. */
function fpPartRemaining(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 0, 3)
    const b = int(rng, 3, 9)
    const a = int(rng, 1, b - 1)
    if (gcd(a, b) !== 1) continue
    const N = b * (t === 2 ? int(rng, 3, 4) : int(rng, 3, 12))
    if (t === 2 && (N < 20 || N > 35)) continue
    const part = (N / b) * a
    const left = N - part
    const f = `$${raw(a, b)}$`
    const [text, end] = [
      [`Un elev are de rezolvat ${de(N)} exerciții și a rezolvat ${f} din ele. Câte exerciții mai are de rezolvat?`, `Mai are de rezolvat $${N} - ${part} = ${left}$ ${deW(left)}exerciții.`],
      [`O gospodină a cumpărat ${de(N)} kg de cartofi și a consumat ${f} din ei. Câte kilograme a consumat și câte i-au mai rămas?`, `A consumat ${de(part)} kg și i-au rămas $${N} - ${part} = ${left}$ ${deW(left)}kg.`],
      [`Într-o clasă sunt ${de(N)} elevi, iar ${f} dintre ei sunt fete. Câte fete și câți băieți sunt în clasă?`, `Sunt ${de(part)} ${part === 1 ? 'fată' : 'fete'} și $${N} - ${part} = ${left}$ ${deW(left)}${left === 1 ? 'băiat' : 'băieți'}.`],
      [`Un drumeț are de parcurs ${de(N)} km și a mers ${f} din drum. Câți kilometri mai are de mers?`, `Mai are de mers $${N} - ${part} = ${left}$ ${deW(left)}km.`],
    ][t]
    return {
      text,
      solution: lines(`Calculăm ${f} din ${N}: împărțim la numitor și înmulțim cu numărătorul.`, show(`${raw(a, b)} \\cdot ${N} = ${N} : ${b} \\cdot ${a} = ${part}`), end),
      verify: () => part * b === a * N && part + left === N && left > 0,
    }
  }
}

/** Two percents of a sum spent, what remains, p. 58, ex. 8 (and ex. 5–7). */
function fpPercentSpent(rng: Rng): Made {
  for (;;) {
    const N = 100 * int(rng, 3, 30)
    const p = 5 * int(rng, 1, 12)
    const r = 5 * int(rng, 1, 12)
    if (p + r >= 90 || p === r) continue
    const A = (N / 100) * p
    const B = (N / 100) * r
    const left = N - A - B
    const [x, y] = pick(rng, [['o cămașă', 'o pereche de pantofi'], ['o carte', 'rechizite'], ['un cadou', 'mâncare'], ['o geacă', 'o pereche de ghete'], ['un bilet de tren', 'cazare']])
    return {
      text: `O persoană avea ${de(N)} lei și a cheltuit ${p}% din sumă pe ${x} și ${r}% din sumă pe ${y}. Câți lei i-au rămas?`,
      solution: lines(
        show(`${p}\\% \\cdot ${nr(N)} = ${raw(p, 100)} \\cdot ${nr(N)} = ${nr(A)}, \\qquad ${r}\\% \\cdot ${nr(N)} = ${raw(r, 100)} \\cdot ${nr(N)} = ${nr(B)}`),
        `I-au rămas $${nr(N)} - ${nr(A)} - ${nr(B)} = ${nr(left)}$ ${deW(left)}lei.`,
      ),
      verify: () => left * 100 === N * (100 - p - r) && left > 0,
    }
  }
}

/** x/a = b/c, a/x = b/c, (x + k)/a = b/c, p. 46, ex. 5 (and ex. 6). */
function fpEquivalentX(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 9)
    const d = int(rng, 2, 12)
    if (p === d || gcd(p, d) !== 1) continue
    const s = int(rng, 1, 3)
    const [m1, m2, m3] = [int(rng, 2, 6), int(rng, 2, 6), int(rng, 2, 6)]
    const k = int(rng, 1, 6)
    if (p * m3 <= k || m1 === m3) continue
    const g = raw(p * s, d * s)
    return {
      text: `Aflați numărul natural $x$ în fiecare caz: a) $\\frac{x}{${d * m1}} = ${g}$; b) $\\frac{${p * m2}}{x} = ${g}$; c) $\\frac{x + ${k}}{${d * m3}} = ${g}$.`,
      solution: lines(
        'Două fracții sunt egale când produsul dintre numărătorul primei și numitorul celei de-a doua este egal cu produsul dintre numitorul primei și numărătorul celei de-a doua.',
        `a) $x \\cdot ${d * s} = ${d * m1} \\cdot ${p * s}$, deci $x = ${d * m1 * p * s} : ${d * s} = ${p * m1}$.`,
        `b) $${p * m2} \\cdot ${d * s} = x \\cdot ${p * s}$, deci $x = ${p * m2 * d * s} : ${p * s} = ${d * m2}$.`,
        `c) $(x + ${k}) \\cdot ${d * s} = ${d * m3} \\cdot ${p * s}$, deci $x + ${k} = ${d * m3 * p * s} : ${d * s} = ${p * m3}$ și $x = ${p * m3 - k}$.`,
      ),
      verify: () => qeq([p * m1, d * m1], [p * s, d * s]) && qeq([p * m2, d * m2], [p * s, d * s]) && qeq([p * m3 - k + k, d * m3], [p * s, d * s]),
    }
  }
}

/** The x for which a fraction is supraunitary, subunitary or equal to 1, p. 45, ex. 12–13. */
function fpConditionX(rng: Rng): Made {
  for (;;) {
    const A = int(rng, 5, 14)
    const b = int(rng, 1, 3)
    const xsA = range(0, A - b - 1)
    const c = int(rng, 2, 5)
    const d = int(rng, 1, 6)
    const e = int(rng, d + c + 1, 30)
    const xsB = range(0, 40).filter((x) => c * x + d < e)
    if (xsA.length < 2 || xsB.length < 2 || xsB.length > 7) continue
    const c2 = int(rng, 2, 6)
    const x2 = int(rng, 1, 9)
    const d2 = int(rng, 1, 9)
    const e2 = c2 * x2 + d2
    return {
      text: `Aflați numerele naturale $x$ pentru care: a) fracția $\\frac{${A}}{x + ${b}}$ este supraunitară; b) fracția $\\frac{${c}x + ${d}}{${e}}$ este subunitară; c) fracția $\\frac{${c2}x + ${d2}}{${e2}}$ este echiunitară.`,
      solution: lines(
        `a) O fracție este supraunitară când numărătorul este mai mare decât numitorul: $x + ${b} < ${A}$, deci $x < ${A - b}$ și $x \\in ${set(xsA)}$.`,
        `b) O fracție este subunitară când numărătorul este mai mic decât numitorul: $${c}x + ${d} < ${e}$, deci $${c}x < ${e - d}$ și $x \\in ${set(xsB)}$.`,
        `c) O fracție este echiunitară când numărătorul este egal cu numitorul: $${c2}x + ${d2} = ${e2}$, $${c2}x = ${e2 - d2}$, deci $x = ${x2}$.`,
      ),
      verify: () =>
        range(0, 40).filter((x) => A > x + b).join() === xsA.join() && range(0, 40).filter((x) => c * x + d < e).join() === xsB.join() &&
        range(0, 40).filter((x) => c2 * x + d2 === e2).join() === String(x2),
    }
  }
}

/** N/(2x + 1) and (x + k)/x are natural numbers, p. 45, ex. 18–19. */
function fpNaturalValue(rng: Rng): Made {
  for (;;) {
    const N = 2 * int(rng, 7, 49) + 1
    const DN = divisors(N)
    const k = int(rng, 6, 40)
    const Dk = divisors(k)
    if (DN.length < 3 || Dk.length < 4) continue
    const xs = DN.map((d) => (d - 1) / 2)
    return {
      text: `Aflați numerele naturale $x$ pentru care următoarele fracții sunt numere naturale: a) $\\frac{${N}}{2x + 1}$; b) $\\frac{x + ${k}}{x}$, cu $x \\neq 0$.`,
      solution: lines(
        `a) Numitorul $2x + 1$ trebuie să fie un divizor al lui ${N}: $D_{${N}} = ${set(DN)}$.`,
        show(DN.map((d, i) => `2x + 1 = ${d} \\Rightarrow x = ${xs[i]}`).join('; \\quad ')),
        `Deci $x \\in ${set(xs)}$.`,
        `b) Despărțim fracția:`,
        show(`\\frac{x + ${k}}{x} = \\frac{x}{x} + \\frac{${k}}{x} = 1 + \\frac{${k}}{x}`),
        `Ea este număr natural când $x$ este un divizor al lui ${k}: $x \\in ${set(Dk)}$.`,
      ),
      verify: () => range(0, N).filter((x) => N % (2 * x + 1) === 0).join() === xs.join() && range(1, k).filter((x) => (x + k) % x === 0).join() === Dk.join(),
    }
  }
}

/** a/b < x/c < d/e (same denominator) or a/b < N/x < d/e (same numerator), p. 50, ex. 10–11 and p. 47, ex. 2. */
function fpBetween(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const c = pick(rng, [12, 15, 18, 20, 24, 30, 36, 40])
      const Dc = divisors(c).filter((x) => x > 1 && x < c)
      const b = pick(rng, Dc)
      const e = pick(rng, Dc)
      const a = int(rng, 1, 2 * b)
      const d = int(rng, 1, 2 * e)
      if (gcd(a, b) !== 1 || gcd(d, e) !== 1) continue
      const lo = (a * c) / b
      const hi = (d * c) / e
      const xs = range(lo + 1, hi - 1)
      if (xs.length < 2 || xs.length > 10) continue
      return {
        text: `Aflați numerele naturale $x$ pentru care $${raw(a, b)} < \\frac{x}{${c}} < ${raw(d, e)}$.`,
        solution: lines(
          `Aducem fracțiile la numitorul ${c}:`,
          show(`${raw(lo, c)} < \\frac{x}{${c}} < ${raw(hi, c)}`),
          `Dintre două fracții cu același numitor este mai mare cea cu numărătorul mai mare, deci $${lo} < x < ${hi}$ și $x \\in ${set(xs)}$.`,
        ),
        verify: () => range(0, 200).filter((x) => a * c < x * b && x * e < d * c).join() === xs.join(),
      }
    }
    const a = int(rng, 1, 9)
    const b = int(rng, a + 1, a + 9)
    const d = int(rng, 1, 9)
    const e = int(rng, d + 1, d + 9)
    if (gcd(a, b) !== 1 || gcd(d, e) !== 1 || a * e >= d * b) continue
    const N = lcm(a, d) * int(rng, 1, 4)
    if (N < 6 || N > 72) continue
    const B1 = (b * N) / a
    const E1 = (e * N) / d
    const xs = range(E1 + 1, B1 - 1)
    if (xs.length < 2 || xs.length > 10) continue
    return {
      text: `Aflați numerele naturale $x$ pentru care $${raw(a, b)} < \\frac{${N}}{x} < ${raw(d, e)}$.`,
      solution: lines(
        `Aducem fracțiile la numărătorul ${N}:`,
        show(`${raw(N, B1)} < \\frac{${N}}{x} < ${raw(N, E1)}`),
        `Dintre două fracții cu același numărător este mai mare cea cu numitorul mai mic, deci $${E1} < x < ${B1}$ și $x \\in ${set(xs)}$.`,
      ),
      verify: () => range(1, 400).filter((x) => a * x < N * b && N * e < d * x).join() === xs.join(),
    }
  }
}

/** a/b equivalent to p/q with a + b or b − a known, p. 46, ex. 10–11. */
function fpEquivalentSum(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 8)
    const r = int(rng, 2, 12)
    if (p >= r || gcd(p, r) !== 1) continue
    const k = int(rng, 2, 15)
    const a = p * k
    const b = r * k
    const sum = rng() < 0.5
    const S = sum ? a + b : b - a
    const pk = poly([[p, 'k']])
    return {
      text: `Aflați numerele naturale $a$ și $b$ știind că fracția $\\frac{a}{b}$ este echivalentă cu $${raw(p, r)}$ și $${sum ? 'a + b' : 'b - a'} = ${S}$.`,
      solution: lines(
        `Fracția $${raw(p, r)}$ este ireductibilă, deci fracțiile echivalente cu ea se obțin prin amplificare: $a = ${pk}$, $b = ${r}k$, cu $k$ natural nenul.`,
        show(sum ? `${pk} + ${r}k = ${S} \\Rightarrow ${p + r}k = ${S} \\Rightarrow k = ${k}` : `${r}k - ${pk} = ${S} \\Rightarrow ${r - p === 1 ? '' : `${r - p}k = ${S} \\Rightarrow `}k = ${k}`),
        `Deci $a = ${a}$ și $b = ${b}$.`,
      ),
      verify: () => {
        const sols = range(1, 400).filter((x) => {
          const y = sum ? S - x : S + x
          return y > 0 && x * r === y * p
        })
        return sols.join() === String(a)
      },
    }
  }
}

/** p% of a sum, then q% of the rest; or a/b of some pieces, then c/d of the rest, p. 59, ex. 12–14. */
function fpRestOfRest(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const N = 100 * int(rng, 2, 20)
      const p = pick(rng, [10, 20, 25, 30, 40, 50, 60, 75])
      const r = pick(rng, [10, 20, 25, 30, 40, 50, 60, 75])
      const day1 = (N * p) / 100
      const rest = N - day1
      const day2 = (rest * r) / 100
      if (!Number.isInteger(day2)) continue
      const left = rest - day2
      return {
        text: `O persoană are ${de(N)} lei. Într-o zi cheltuiește ${p}% din sumă, iar a doua zi ${r}% din rest. Câți lei i-au mai rămas?`,
        solution: lines(
          show(`${raw(p, 100)} \\cdot ${nr(N)} = ${nr(day1)}`),
          `În prima zi cheltuiește ${de(day1)} lei, deci rămân $${nr(N)} - ${nr(day1)} = ${nr(rest)}$ ${deW(rest)}lei.`,
          show(`${raw(r, 100)} \\cdot ${nr(rest)} = ${nr(day2)}`),
          `A doua zi cheltuiește ${de(day2)} lei, deci i-au mai rămas $${nr(rest)} - ${nr(day2)} = ${nr(left)}$ ${deW(left)}lei.`,
        ),
        verify: () => left * 10000 === N * (100 - p) * (100 - r),
      }
    }
    const b = int(rng, 3, 12)
    const a = int(rng, 1, b - 1)
    const d = int(rng, 2, 9)
    const c = int(rng, 1, d - 1)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue
    const N = b * int(rng, 2, 15)
    const h1 = (N / b) * a
    const rest = N - h1
    if (rest % d !== 0) continue
    const h2 = (rest / d) * c
    const left = rest - h2
    return {
      text: `Un muncitor trebuie să facă ${de(N)} piese. În prima oră face $${raw(a, b)}$ din ele, iar în a doua oră $${raw(c, d)}$ din rest. Câte piese a făcut în cele două ore și câte mai are de făcut?`,
      solution: lines(
        show(`${raw(a, b)} \\cdot ${N} = ${N} : ${b} \\cdot ${a} = ${h1}`),
        `În prima oră face ${de(h1)} ${h1 === 1 ? 'piesă' : 'piese'}; rest: $${N} - ${h1} = ${rest}$ ${deW(rest)}piese.`,
        show(`${raw(c, d)} \\cdot ${rest} = ${rest} : ${d} \\cdot ${c} = ${h2}`),
        `În cele două ore a făcut $${h1} + ${h2} = ${h1 + h2}$ ${deW(h1 + h2)}piese și mai are de făcut $${rest} - ${h2} = ${left}$ ${deW(left)}${left === 1 ? 'piesă' : 'piese'}.`,
      ),
      verify: () => h1 * b === a * N && h2 * d === c * (N - h1) && left === N - h1 - h2 && left > 0,
    }
  }
}

/** The digit x in a fraction of two-digit numbers equal to a given fraction, p. 46, ex. 8–9. */
function fpDigitFraction(rng: Rng): Made {
  for (;;) {
    const nx = rng() < 0.5
    const dx = rng() < 0.5
    const a = int(rng, 1, 9)
    const b = int(rng, 1, 9)
    const x = int(rng, 1, 9)
    const val = (lead: boolean, y: number, other: number) => (lead ? 10 * y + other : 10 * other + y)
    const num = val(nx, x, a)
    const den = val(dx, x, b)
    const [p, r] = reduce(num, den)
    if (num === den || r === den || p === 1 && r === 1) continue
    const sols = range(0, 9).filter((y) => (y > 0 || (!nx && !dx)) && val(nx, y, a) * r === val(dx, y, b) * p)
    if (sols.length !== 1) continue
    const [n1, n0] = nx ? [10, a] : [1, 10 * a]
    const [d1, d0] = dx ? [10, b] : [1, 10 * b]
    const C = r * n1 - p * d1
    const R = p * d0 - r * n0
    if (C === 0) continue
    const over = (lead: boolean, o: number) => (lead ? `\\overline{x${o}}` : `\\overline{${o}x}`)
    return {
      text: `Aflați cifra $x$ știind că $\\frac{${over(nx, a)}}{${over(dx, b)}} = ${raw(p, r)}$.`,
      solution: lines(
        `Scriem numerele în baza 10: $${over(nx, a)} = ${poly([[n1, 'x'], [n0, '']])}$ și $${over(dx, b)} = ${poly([[d1, 'x'], [d0, '']])}$. Din egalitatea fracțiilor:`,
        show(`${r} \\cdot (${poly([[n1, 'x'], [n0, '']])}) = ${p} \\cdot (${poly([[d1, 'x'], [d0, '']])})`),
        show(`${poly([[r * n1, 'x'], [r * n0, '']])} = ${poly([[p * d1, 'x'], [p * d0, '']])}`),
        show(`${poly([[Math.abs(C), 'x']])} = ${Math.abs(R)} \\Rightarrow x = ${x}`),
        `Verificare: $${raw(num, den)} = ${raw(p, r)}$.`,
      ),
      verify: () => sols[0] === x && C * x === R,
    }
  }
}

/** Two percents of a class, the pupils with neither: those with both, p. 60, Testul 2, ex. 8. */
function fpTwoGroups(rng: Rng): Made {
  for (;;) {
    const N = pick(rng, [20, 25, 30, 40, 50])
    const pA = 5 * int(rng, 6, 18)
    const pB = 5 * int(rng, 4, 16)
    const A = (N * pA) / 100
    const B = (N * pB) / 100
    const none = int(rng, 2, 6)
    const both = A + B - (N - none)
    if (!Number.isInteger(A) || !Number.isInteger(B) || both < 2 || both > Math.min(A, B) - 1) continue
    const [x, y, z, w] = pick(rng, [
      ['au bicicletă', 'au role', 'nu au nici bicicletă, nici role', 'au și bicicletă, și role'],
      ['învață limba engleză', 'învață limba franceză', 'nu învață niciuna dintre aceste limbi', 'învață ambele limbi'],
      ['merg la înot', 'merg la șah', 'nu merg nici la înot, nici la șah', 'merg și la înot, și la șah'],
    ])
    return {
      text: `Într-o clasă cu ${de(N)} elevi, ${pA}% ${x}, iar ${pB}% ${y}. Dacă ${de(none)} elevi ${z}, câți elevi ${w}?`,
      solution: lines(
        show(`${raw(pA, 100)} \\cdot ${N} = ${A}, \\qquad ${raw(pB, 100)} \\cdot ${N} = ${B}`),
        `Elevii care ${x} sau ${y} (cel puțin una dintre cele două) sunt $${N} - ${none} = ${N - none}$.`,
        `În suma $${A} + ${B}$, elevii care ${w} sunt numărați de două ori, deci ei sunt:`,
        show(`${A} + ${B} - ${N - none} = ${both}`),
      ),
      verify: () => {
        const ok = range(0, Math.min(A, B)).filter((t) => A + B - t === N - none)
        return ok.join() === String(both)
      },
    }
  }
}

/** Day 1: D km more than a/b of the road; day 2: E km less than c/d of the rest; what is left, p. 59, ex. 18 (and ex. 14). */
function fpJourney(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 3, 9)
    const a = int(rng, 1, b - 1)
    const d = int(rng, 2, 8)
    const c = int(rng, 1, d - 1)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue
    const L = b * int(rng, 10, 60)
    const D = int(rng, 5, 40)
    const day1 = (L / b) * a + D
    const rest1 = L - day1
    if (rest1 <= 20 || rest1 % d !== 0) continue
    const E = int(rng, 3, 30)
    const part2 = (rest1 / d) * c
    const day2 = part2 - E
    const left = rest1 - day2
    if (day2 <= 0 || left <= 0) continue
    return {
      text: `Un grup de excursioniști are de parcurs un drum de ${de(L)} km. În prima zi parcurge cu ${de(D)} km mai mult decât $${raw(a, b)}$ din drum, iar a doua zi cu ${de(E)} km mai puțin decât $${raw(c, d)}$ din rest. Câți kilometri mai are de parcurs?`,
      solution: lines(
        show(`${raw(a, b)} \\cdot ${L} = ${(L / b) * a}`),
        `În prima zi: $${(L / b) * a} + ${D} = ${day1}$ km; rest: $${L} - ${day1} = ${rest1}$ km.`,
        show(`${raw(c, d)} \\cdot ${rest1} = ${part2}`),
        `A doua zi: $${part2} - ${E} = ${day2}$ km.`,
        `Mai are de parcurs $${rest1} - ${day2} = ${left}$ ${deW(left)}km.`,
      ),
      verify: () => b * (day1 - D) === a * L && d * (day2 + E) === c * (L - day1) && left === L - day1 - day2,
    }
  }
}

// ================= fractions: adding and subtracting (pp. 51–53) =================

/** a/d + 2a/d + … + na/d: the numerators summed with Gauss, p. 51, ex. 1 f–i. */
function faSameDenSeries(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 3)
    const d = int(rng, 2, 13)
    const n = int(rng, 5, 30)
    if (a === d) continue
    const S = (a * n * (n + 1)) / 2
    return {
      text: `Calculați și simplificați rezultatul: $${raw(a, d)} + ${raw(2 * a, d)} + ${raw(3 * a, d)} + \\ldots + ${raw(n * a, d)}$.`,
      solution: lines(
        'Fracțiile au același numitor, deci adunăm numărătorii:',
        show(`\\frac{${a === 1 ? '' : `${a} \\cdot (`}1 + 2 + 3 + \\ldots + ${n}${a === 1 ? '' : ')'}}{${d}} = \\frac{${a === 1 ? '' : `${a} \\cdot `}${n} \\cdot ${n + 1} : 2}{${d}} = ${raw(S, d)}${after(S, d)}`),
      ),
      verify: () => {
        let s: Q = [0, 1]
        for (let i = 1; i <= n; i++) s = qa(s, [i * a, d])
        return qeq(s, [S, d])
      },
    }
  }
}

/** Three fractions to simplify first, then add and subtract with a common denominator, p. 51, ex. 7 (and ex. 5). */
function faSimplifyThenAdd(rng: Rng): Made {
  for (;;) {
    const ds = shuffle(rng, [2, 3, 4, 5, 6, 8, 9, 10, 12, 15]).slice(0, 3)
    const ns = ds.map((d) => int(rng, 1, 2 * d - 1))
    if (ns.some((n, i) => gcd(n, ds[i]) !== 1 || n === ds[i])) continue
    const ks = ds.map(() => int(rng, 2, 5))
    const signs = [1, pick(rng, [1, -1]), pick(rng, [1, -1])]
    let r: Q = [0, 1]
    ns.forEach((n, i) => (r = signs[i] > 0 ? qa(r, [n, ds[i]]) : qs(r, [n, ds[i]])))
    const L = ds.reduce(lcm, 1)
    if (r[0] <= 0 || L > 60) continue
    const sg = (i: number) => (i === 0 ? '' : signs[i] > 0 ? ' + ' : ' - ')
    const given = ns.map((n, i) => `${sg(i)}${raw(n * ks[i], ds[i] * ks[i])}`).join('')
    return {
      text: `Simplificați fracțiile, aduceți-le la același numitor și efectuați: $${given}$.`,
      solution: lines(
        'Simplificăm fiecare fracție:',
        show(ns.map((n, i) => `${raw(n * ks[i], ds[i] * ks[i])} = ${raw(n, ds[i])}`).join(', \\quad ')),
        `Numitorul comun este $[${ds.join(', ')}] = ${L}$:`,
        show(`${ns.map((n, i) => `${sg(i)}${raw(n, ds[i])}`).join('')} = ${ns.map((n, i) => `${sg(i)}${raw((n * L) / ds[i], L)}`).join('')} = ${raw(r[0] * (L / r[1]), L)}${after(r[0] * (L / r[1]), L)}`),
      ),
      verify: () => {
        let t: Q = [0, 1]
        ns.forEach((n, i) => (t = qa(t, [signs[i] * n * ks[i], ds[i] * ks[i]])))
        return qeq(t, r)
      },
    }
  }
}

/** w a/b − v c/d, and n − w a/b, p. 52, ex. 9 (and p. 51, ex. 8). */
function faMixedSubtract(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 2, 9)
    const d = int(rng, 2, 9)
    const a = int(rng, 1, b - 1)
    const c = int(rng, 1, d - 1)
    const w1 = int(rng, 3, 9)
    const w2 = int(rng, 1, w1 - 1)
    if (b === d || gcd(a, b) !== 1 || gcd(c, d) !== 1) continue
    const M1: Q = [w1 * b + a, b]
    const M2: Q = [w2 * d + c, d]
    const r1 = qs(M1, M2)
    if (r1[0] <= 0) continue
    const f = int(rng, 2, 9)
    const e = int(rng, 1, f - 1)
    const w3 = int(rng, 1, 5)
    const n = int(rng, w3 + 2, 12)
    if (gcd(e, f) !== 1) continue
    const r2 = qs([n, 1], [w3 * f + e, f])
    const L = lcm(b, d)
    return {
      text: `Calculați: a) $${mx(w1, a, b)} - ${mx(w2, c, d)}$; b) $${n} - ${mx(w3, e, f)}$.`,
      solution: lines(
        'Introducem întregii în fracție și aducem la același numitor:',
        show(`${mx(w1, a, b)} - ${mx(w2, c, d)} = ${raw(M1[0], b)} - ${raw(M2[0], d)} = ${raw((M1[0] * L) / b, L)} - ${raw((M2[0] * L) / d, L)} = ${raw((M1[0] * L) / b - (M2[0] * L) / d, L)}${after((M1[0] * L) / b - (M2[0] * L) / d, L)}`),
        show(`${n} - ${mx(w3, e, f)} = ${raw(n * f, f)} - ${raw(w3 * f + e, f)} = ${raw(n * f - w3 * f - e, f)}${after(n * f - w3 * f - e, f)}`),
      ),
      verify: () => qeq(qa(r1, M2), M1) && qeq(qa(r2, [w3 * f + e, f]), [n, 1]),
    }
  }
}

/** a/b + c/d + x = T, or x + a/b − c/d = T, p. 52, ex. 10. */
function faUnknownTerm(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 2, 12)
    const d = int(rng, 2, 12)
    const f = int(rng, 2, 12)
    const a = int(rng, 1, 2 * b)
    const c = int(rng, 1, d - 1)
    const e = int(rng, 1, 2 * f)
    if (b === d || gcd(a, b) !== 1 || gcd(c, d) !== 1 || gcd(e, f) !== 1 || a === b || e === f) continue
    const x: Q = [e, f]
    const v1 = rng() < 0.5
    const T = v1 ? qs(qa(x, [a, b]), [c, d]) : qa(qa([a, b], [c, d]), x)
    if (T[0] <= 0 || T[1] > 60) continue
    const L = lcm(lcm(b, d), T[1])
    const mid = v1
      ? `${raw((T[0] * L) / T[1], L)} - ${raw((a * L) / b, L)} + ${raw((c * L) / d, L)}`
      : `${raw((T[0] * L) / T[1], L)} - ${raw((a * L) / b, L)} - ${raw((c * L) / d, L)}`
    return {
      text: `Aflați numărul necunoscut: $${v1 ? `x + ${raw(a, b)} - ${raw(c, d)}` : `${raw(a, b)} + ${raw(c, d)} + x`} = ${F(T)}$.`,
      solution: lines(
        v1 ? `Termenul necunoscut se află din $x + ${raw(a, b)} = ${F(T)} + ${raw(c, d)}$:` : 'Un termen necunoscut este egal cu suma minus ceilalți termeni:',
        show(`x = ${F(T)} - ${raw(a, b)} ${v1 ? '+' : '-'} ${raw(c, d)} = ${mid} = ${res(x)}`),
      ),
      verify: () => qeq(v1 ? qs(qa(x, [a, b]), [c, d]) : qa(qa([a, b], [c, d]), x), T),
    }
  }
}

const hoursText = (h: number, m: number) =>
  [h ? (h === 1 ? 'o oră' : `${de(h)} ore`) : '', m ? `${de(m)} minute` : ''].filter((s) => s).join(' și ')

/** Two or three workers finish a job alone in a, b, c hours: together, p. 53, ex. 16. */
function faWorkTogether(rng: Rng): Made {
  for (;;) {
    const k = rng() < 0.5 ? 2 : 3
    const ts = shuffle(rng, range(2, 24)).slice(0, k).sort((x, y) => x - y)
    let s: Q = [0, 1]
    for (const t of ts) s = qa(s, [1, t])
    const T = q(s[1], s[0])
    const minutes = (60 * T[0]) / T[1]
    if (!Number.isInteger(minutes) || minutes < 40) continue
    const h = Math.floor(minutes / 60)
    const mm = minutes % 60
    const ord = ['primul', 'al doilea', 'al treilea']
    const text = k === 3
      ? `O echipă este formată din trei muncitori. Primul, lucrând singur, ar termina o lucrare în ${de(ts[0])} ore, al doilea în ${de(ts[1])} ore, iar al treilea în ${de(ts[2])} ore. În cât timp termină lucrarea dacă lucrează împreună?`
      : `Doi muncitori lucrează la aceeași lucrare. Primul, singur, ar termina-o în ${de(ts[0])} ore, iar al doilea în ${de(ts[1])} ore. În cât timp o termină dacă lucrează împreună?`
    return {
      text,
      solution: lines(
        `Într-o oră, ${ts.map((t, i) => `${ord[i]} face $${raw(1, t)}$ din lucrare`).join(', ')}. Împreună, într-o oră, fac:`,
        show(`${ts.map((t) => raw(1, t)).join(' + ')} = ${F(s)}`),
        'din lucrare, deci toată lucrarea o termină în',
        show(`1 : ${F(s)} = ${res(T)}`),
        `ore, adică în ${hoursText(h, mm)}.`,
      ),
      verify: () => {
        const total = ts.reduce((acc, t) => acc + minutes / (60 * t), 0)
        return Math.abs(total - 1) < 1e-9 && h * 60 + mm === minutes
      },
    }
  }
}

/** The part of a garden, or of a book, left after some parts, p. 53, ex. 18 and 20. */
function faPartsLeft(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const n = pick(rng, [7, 11, 13, 17, 19])
      const s = int(rng, 1, 4)
      const t = int(rng, 1, 4)
      const c = int(rng, 1, 5)
      const rest = n - s - (s + t) - c
      if (rest < 1) continue
      return {
        text: `Bunicul a cultivat sfeclă pe $${raw(s, n)}$ din grădină, varză pe o suprafață cu $${raw(t, n)}$ mai mare, iar ceapă pe $${raw(c, n)}$ din grădină. Ce parte din grădină a rămas pentru morcovi?`,
        solution: lines(
          `Varza ocupă $${raw(s, n)} + ${raw(t, n)} = ${raw(s + t, n)}$ din grădină. Toată grădina este $1 = ${raw(n, n)}$:`,
          show(`${raw(n, n)} - \\left(${raw(s, n)} + ${raw(s + t, n)} + ${raw(c, n)}\\right) = ${raw(n, n)} - ${raw(2 * s + t + c, n)} = ${raw(rest, n)}`),
        ),
        verify: () => qeq(qs(qs(qs([1, 1], [s, n]), [s + t, n]), [c, n]), [rest, n]) && rest > 0,
      }
    }
    const b = int(rng, 3, 12)
    const d = int(rng, 3, 15)
    const a = int(rng, 1, b - 1)
    const c = int(rng, 1, d - 1)
    if (b === d || gcd(a, b) !== 1 || gcd(c, d) !== 1) continue
    const day2 = qs([a, b], [c, d])
    const left = qs(qs([1, 1], [a, b]), day2)
    if (day2[0] <= 0 || left[0] <= 0) continue
    const L1 = lcm(b, d)
    return {
      text: `Radu a citit într-o zi $${raw(a, b)}$ dintr-o carte cu povești, iar a doua zi cu $${raw(c, d)}$ mai puțin. Ce parte din carte mai are de citit?`,
      solution: lines(
        'A doua zi a citit:',
        show(`${raw(a, b)} - ${raw(c, d)} = ${raw((a * L1) / b, L1)} - ${raw((c * L1) / d, L1)} = ${F(day2)}`),
        'Toată cartea este 1, deci mai are de citit:',
        show(`1 - \\left(${raw(a, b)} + ${F(day2)}\\right) = 1 - ${F(qa([a, b], day2))} = ${F(left)}`),
      ),
      verify: () => qeq(qa(qa([a, b], day2), left), [1, 1]),
    }
  }
}

/** Material for k blouses cut from a piece, or the milk sold from a can, p. 53, ex. 17 and 19. */
function faClothLeft(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const b = int(rng, 2, 6)
      const a = int(rng, 1, b - 1)
      const w = int(rng, 1, 2)
      const k = int(rng, 2, 4)
      if (gcd(a, b) !== 1) continue
      const M: Q = [w * b + a, b]
      const used = qm([k, 1], M)
      const L = int(rng, Math.ceil(used[0] / used[1]) + 1, 20)
      const left = qs([L, 1], used)
      return {
        text: `Pentru o bluză se folosesc $${mx(w, a, b)}$ m de material. Dintr-o bucată de ${de(L)} m s-a tăiat cât este necesar pentru ${COUNTW[k]} bluze. Ce lungime are bucata rămasă?`,
        solution: lines(
          show(`${k} \\cdot ${mx(w, a, b)} = ${k} \\cdot ${raw(M[0], b)} = ${raw(k * M[0], b)}${after(k * M[0], b)}`),
          `Pentru ${COUNTW[k]} bluze s-au tăiat atâția metri de material, deci bucata rămasă are (în metri):`,
          show(`${L} - ${F(used)} = ${res(left)}`),
        ),
        verify: () => qeq(qa(left, used), [L, 1]) && left[0] > 0,
      }
    }
    const b = int(rng, 2, 9)
    const d = int(rng, 2, 9)
    const a = int(rng, 1, b - 1)
    const c = int(rng, 1, d - 1)
    const w1 = int(rng, 6, 20)
    const w2 = int(rng, 1, w1 - 2)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || b === d) continue
    const sold = qs([w1 * b + a, b], [w2 * d + c, d])
    const L = lcm(b, d)
    return {
      text: `Într-un vas sunt $${mx(w1, a, b)}$ litri de lapte. După ce s-a vândut o parte, în vas au rămas $${mx(w2, c, d)}$ litri. Câți litri de lapte s-au vândut?`,
      solution: lines(
        'Cantitatea vândută este diferența dintre cantitatea de la început și cea rămasă (în litri):',
        show(`${mx(w1, a, b)} - ${mx(w2, c, d)} = ${raw(w1 * b + a, b)} - ${raw(w2 * d + c, d)} = ${raw(((w1 * b + a) * L) / b, L)} - ${raw(((w2 * d + c) * L) / d, L)} = ${res(sold)}`),
      ),
      verify: () => qeq(qa(sold, [w2 * d + c, d]), [w1 * b + a, b]),
    }
  }
}

/** x = Σ c/d, y = Σ (d − c)/d: x + y; or x = Σ (d + c)/d, y = Σ c/d: x − y, p. 53, ex. 22–23. */
function faSumsXY(rng: Rng): Made {
  const c = int(rng, 1, 6)
  const s = int(rng, c + 1, c + 6)
  const e = s + int(rng, 10, 45)
  const diff = rng() < 0.4
  const cnt = e - s + 1
  const xn = (d: number) => (diff ? d + c : c)
  const yn = (d: number) => (diff ? c : d - c)
  const ser = (f: (d: number) => number) => `${raw(f(s), s)} + ${raw(f(s + 1), s + 1)} + ${raw(f(s + 2), s + 2)} + \\ldots + ${raw(f(e), e)}`
  return {
    text: `Calculați $x ${diff ? '-' : '+'} y$, unde $x = ${ser(xn)}$ și $y = ${ser(yn)}$.`,
    solution: lines(
      `Grupăm termenii lui $x$ și $y$ care au același numitor:`,
      show(diff
        ? `${raw(s + c, s)} - ${raw(c, s)} = ${raw(s, s)} = 1, \\quad ${raw(s + 1 + c, s + 1)} - ${raw(c, s + 1)} = 1, \\quad \\ldots, \\quad ${raw(e + c, e)} - ${raw(c, e)} = 1`
        : `${raw(c, s)} + ${raw(s - c, s)} = ${raw(s, s)} = 1, \\quad ${raw(c, s + 1)} + ${raw(s + 1 - c, s + 1)} = 1, \\quad \\ldots, \\quad ${raw(c, e)} + ${raw(e - c, e)} = 1`),
      `Numitorii merg de la ${s} la ${e}, deci sunt $${e} - ${s} + 1 = ${cnt}$ ${deW(cnt)}perechi, fiecare cu rezultatul 1:`,
      show(`x ${diff ? '-' : '+'} y = ${cnt}`),
    ),
    verify: () => {
      let x = 0
      let y = 0
      for (let d = s; d <= e; d++) {
        x += xn(d) / d
        y += yn(d) / d
      }
      return Math.abs((diff ? x - y : x + y) - cnt) < 1e-9
    },
  }
}

/** 2n/d − (2n−1)/d + … + 2/d − 1/d, or 1/d + 2/d − 3/d + 4/d + 5/d − 6/d + …, p. 52, ex. 3 e–g. */
function faAlternating(rng: Rng): Made {
  if (rng() < 0.5) {
    const d = int(rng, 3, 15)
    const n = int(rng, 4, 20)
    const r = q(n, d)
    return {
      text: `Calculați: $${raw(2 * n, d)} - ${raw(2 * n - 1, d)} + ${raw(2 * n - 2, d)} - ${raw(2 * n - 3, d)} + \\ldots + ${raw(2, d)} - ${raw(1, d)}$.`,
      solution: lines(
        `Grupăm termenii doi câte doi; fiecare pereche dă $${raw(1, d)}$ și sunt ${de(n)} perechi:`,
        show(`\\left(${raw(2 * n, d)} - ${raw(2 * n - 1, d)}\\right) + \\ldots + \\left(${raw(2, d)} - ${raw(1, d)}\\right) = ${n} \\cdot ${raw(1, d)} = ${raw(n, d)}${after(n, d)}`),
      ),
      verify: () => {
        let s: Q = [0, 1]
        for (let i = 2 * n; i >= 1; i--) s = qa(s, [i % 2 === 0 ? i : -i, d])
        return qeq(s, r)
      },
    }
  }
  const d = int(rng, 10, 40)
  const m = int(rng, 4, 12)
  const S = (3 * m * (m - 1)) / 2
  const r = q(S, d)
  const t = (k: number) => `${raw(3 * k - 2, d)} + ${raw(3 * k - 1, d)} - ${raw(3 * k, d)}`
  return {
    text: `Calculați: $${t(1)} + ${t(2)} + \\ldots + ${t(m)}$.`,
    solution: lines(
      'Grupăm termenii câte trei: în grupa a $k$-a numărătorii dau $(3k - 2) + (3k - 1) - 3k = 3k - 3$.',
      show(`\\frac{0 + 3 + 6 + \\ldots + ${3 * m - 3}}{${d}} = \\frac{3 \\cdot (0 + 1 + 2 + \\ldots + ${m - 1})}{${d}} = \\frac{3 \\cdot ${(m * (m - 1)) / 2}}{${d}} = ${raw(S, d)}${after(S, d)}`),
    ),
    verify: () => {
      let s: Q = [0, 1]
      for (let i = 1; i <= 3 * m; i++) s = qa(s, [i % 3 === 0 ? -i : i, d])
      return qeq(s, r)
    },
  }
}

/** The digit a in pa/m + a/n = aq/m, p. 53, ex. 21. */
function faDigitEquation(rng: Rng): Made {
  for (;;) {
    const r = pick(rng, [2, 3, 4, 6])
    const n = int(rng, 2, 6)
    const m = r * n
    const a = int(rng, 1, 9)
    const p = int(rng, 1, 9)
    const qd0 = 10 * p - (9 - r) * a
    if (qd0 < 0 || qd0 > 9) continue
    const sols = range(1, 9).filter((y) => (10 * p + y) * n + y * m === (10 * y + qd0) * n)
    if (sols.length !== 1) continue
    return {
      text: `Determinați cifra $a$ astfel încât $\\frac{\\overline{${p}a}}{${m}} + \\frac{a}{${n}} = \\frac{\\overline{a${qd0}}}{${m}}$.`,
      solution: lines(
        `Amplificăm fracția $\\frac{a}{${n}}$ cu ${r}, ca să aibă numitorul ${m}, și egalăm numărătorii:`,
        show(`\\overline{${p}a} + ${r}a = \\overline{a${qd0}} \\Rightarrow ${10 * p} + a + ${r}a = 10a + ${qd0}`),
        show(`${10 * p} - ${qd0} = 10a - a - ${r}a \\Rightarrow ${10 * p - qd0} = ${9 - r}a \\Rightarrow a = ${a}`),
      ),
      verify: () => sols[0] === a,
    }
  }
}

// ================= fractions: multiplying, powers, dividing (pp. 54–58) =================

/** A product of three fractions, simplified before multiplying, p. 54, ex. 1. */
function fmProductThree(rng: Rng): Made {
  for (;;) {
    const fs: Q[] = [0, 1, 2].map(() => [int(rng, 2, 30), int(rng, 2, 30)])
    if (fs.some(([n, d]) => gcd(n, d) !== 1)) continue
    const N = fs.reduce((s, [n]) => s * n, 1)
    const D = fs.reduce((s, [, d]) => s * d, 1)
    const r = q(N, D)
    if (gcd(N, D) < 6 || r[1] > 30 || r[0] > 60) continue
    return {
      text: `Calculați, simplificând înainte de a înmulți: $${fs.map(([n, d]) => raw(n, d)).join(' \\cdot ')}$.`,
      solution: lines(
        'Scriem numărătorii și numitorii ca produse de factori primi și simplificăm factorii comuni:',
        show(`\\frac{${fs.map(([n]) => powTex(factors(n))).join(' \\cdot ')}}{${fs.map(([, d]) => powTex(factors(d))).join(' \\cdot ')}} = ${res(r)}`),
      ),
      verify: () => qeq(fs.reduce((s, f) => qm(s, f), [1, 1] as Q), r),
    }
  }
}

/** w a/b : c/d, N : w a/b, c/d : n, p. 57, ex. 1. */
function fmDivideMixed(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 2, 9)
    const a = int(rng, 1, b - 1)
    const w = int(rng, 1, 5)
    const d = int(rng, 2, 9)
    const c = int(rng, 1, 9)
    const b2 = int(rng, 2, 9)
    const a2 = int(rng, 1, b2 - 1)
    const w2 = int(rng, 1, 4)
    const d3 = int(rng, 2, 9)
    const c3 = int(rng, 1, 12)
    const n3 = int(rng, 2, 9)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || c === d || gcd(a2, b2) !== 1 || gcd(c3, d3) !== 1 || c3 === d3) continue
    const M: Q = [w * b + a, b]
    const r1 = qd(M, [c, d])
    if (r1[1] > 40) continue
    const P2 = w2 * b2 + a2
    const t = int(rng, 2, 6)
    const N = P2 * t
    const r3 = q(c3, d3 * n3)
    return {
      text: `Calculați: a) $${mx(w, a, b)} : ${raw(c, d)}$; b) $${N} : ${mx(w2, a2, b2)}$; c) $${raw(c3, d3)} : ${n3}$.`,
      solution: lines(
        'Împărțim înmulțind cu inversul împărțitorului (după ce introducem întregii în fracție):',
        show(`${mx(w, a, b)} : ${raw(c, d)} = ${raw(M[0], b)} \\cdot ${raw(d, c)} = ${res(r1)}`),
        show(`${N} : ${mx(w2, a2, b2)} = ${N} : ${raw(P2, b2)} = ${N} \\cdot ${raw(b2, P2)} = ${t * b2}`),
        show(`${raw(c3, d3)} : ${n3} = ${raw(c3, d3)} \\cdot ${raw(1, n3)} = ${res(r3)}`),
      ),
      verify: () => qeq(qm(r1, [c, d]), M) && qeq(qm([t * b2, 1], [P2, b2]), [N, 1]) && qeq(qm(r3, [n3, 1]), [c3, d3]),
    }
  }
}

/** (a/b)ⁿ, (w c/d)², (1/g)³, p. 55, ex. 1. */
function fmPowerMixed(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 9)
    const b = int(rng, 2, 9)
    const n = int(rng, 2, 4)
    const d = int(rng, 2, 6)
    const c = int(rng, 1, d - 1)
    const w = int(rng, 1, 3)
    const g = int(rng, 2, 10)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || a === b) continue
    const Pm = w * d + c
    return {
      text: `Ridicați la putere: a) $${P(a, b)}^{${n}}$; b) $\\left(${mx(w, c, d)}\\right)^2$; c) $${P(1, g)}^3$.`,
      solution: lines(
        'Ridicăm la putere și numărătorul, și numitorul:',
        show(`${P(a, b)}^{${n}} = \\frac{${a}^{${n}}}{${b}^{${n}}} = ${res(q(a ** n, b ** n))}`),
        show(`\\left(${mx(w, c, d)}\\right)^2 = ${P(Pm, d)}^2 = \\frac{${Pm}^2}{${d}^2} = ${res(q(Pm * Pm, d * d))}`),
        show(`${P(1, g)}^3 = \\frac{1}{${g}^3} = ${raw(1, g ** 3)}`),
      ),
      verify: () => {
        let v: Q = [1, 1]
        for (let i = 0; i < n; i++) v = qm(v, [a, b])
        return qeq(v, [a ** n, b ** n]) && qeq(qm([w * d + c, d], [w * d + c, d]), [Pm * Pm, d * d]) && qeq(qm(qm([1, g], [1, g]), [1, g]), [1, g ** 3])
      },
    }
  }
}

/** w a/b : x = c/d and x : w a/b = c/d, p. 57, ex. 4. */
function fmUnknownDivision(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 2, 9)
    const a = int(rng, 1, b - 1)
    const w = int(rng, 1, 4)
    const d = int(rng, 2, 12)
    const c = int(rng, 1, 12)
    const b2 = int(rng, 2, 9)
    const a2 = int(rng, 1, b2 - 1)
    const w2 = int(rng, 1, 4)
    const d2 = int(rng, 2, 9)
    const c2 = int(rng, 1, 9)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || c === d || gcd(a2, b2) !== 1 || gcd(c2, d2) !== 1 || c2 === d2) continue
    const M: Q = [w * b + a, b]
    const M2q: Q = [w2 * b2 + a2, b2]
    const x1 = qd(M, [c, d])
    const x2 = qm([c2, d2], M2q)
    if (x1[1] > 30 || x2[1] > 30) continue
    return {
      text: `Aflați numărul necunoscut: a) $${mx(w, a, b)} : x = ${raw(c, d)}$; b) $x : ${mx(w2, a2, b2)} = ${raw(c2, d2)}$.`,
      solution: lines(
        'a) Împărțitorul este egal cu deîmpărțitul împărțit la cât:',
        show(`x = ${mx(w, a, b)} : ${raw(c, d)} = ${raw(M[0], b)} \\cdot ${raw(d, c)} = ${res(x1)}`),
        'b) Deîmpărțitul este egal cu câtul înmulțit cu împărțitorul:',
        show(`x = ${raw(c2, d2)} \\cdot ${mx(w2, a2, b2)} = ${raw(c2, d2)} \\cdot ${raw(M2q[0], b2)} = ${res(x2)}`),
      ),
      verify: () => qeq(qd(M, x1), [c, d]) && qeq(qd(x2, M2q), [c2, d2]),
    }
  }
}

/** The result as a power: (a/b)^m · (a/b)^n : (a/b)^p, [(c/d)^m]^n, (e/f)^k · (g/h)^k, p. 56, ex. 7 (and p. 55, ex. 2). */
function fmPowerRules(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 30)
    const b = int(rng, 2, 30)
    const c = int(rng, 1, 12)
    const d = int(rng, 2, 12)
    if (gcd(a, b) !== 1 || gcd(c, d) !== 1 || a === b || c === d) continue
    const m = int(rng, 3, 15)
    const n = int(rng, 2, 12)
    const p = int(rng, 2, m + n - 2)
    const m2 = int(rng, 2, 7)
    const n2 = int(rng, 2, 9)
    const e = int(rng, 2, 9)
    const f = int(rng, 2, 9)
    const s = int(rng, 2, 6)
    const k = int(rng, 5, 20)
    if (gcd(e, f) !== 1) continue
    const [g, h] = q(s * f, e)
    if (h === 1 || (g === e && h === f)) continue
    return {
      text: `Scrieți rezultatul sub formă de putere: a) $${P(a, b)}^{${m}} \\cdot ${P(a, b)}^{${n}} : ${P(a, b)}^{${p}}$; b) $\\left[${P(c, d)}^{${m2}}\\right]^{${n2}}$; c) $${P(e, f)}^{${k}} \\cdot ${P(g, h)}^{${k}}$.`,
      solution: lines(
        'a) La înmulțirea puterilor cu aceeași bază adunăm exponenții, iar la împărțire îi scădem:',
        show(`${P(a, b)}^{${m} + ${n} - ${p}} = ${P(a, b)}^{${m + n - p}}`),
        'b) La puterea unei puteri înmulțim exponenții:',
        show(`${P(c, d)}^{${m2} \\cdot ${n2}} = ${P(c, d)}^{${m2 * n2}}`),
        'c) Puterile au același exponent, deci înmulțim bazele:',
        show(`\\left(${raw(e, f)} \\cdot ${raw(g, h)}\\right)^{${k}} = ${s}^{${k}}`),
      ),
      verify: () => {
        const B = (x: number, y: number) => BigInt(x) ** BigInt(y)
        return B(e, k) * B(g, k) === B(s, k) * B(f, k) * B(h, k) && [m, n, -p].reduce((x, y) => x + y) === m + n - p && m + n - p >= 2
      },
    }
  }
}

/** Fractions of fractions: (a/b)/(c/d) and (w a/b)/(v c/d), p. 57, ex. 5. */
function fmComplexFraction(rng: Rng): Made {
  for (;;) {
    const [a, b, c, d] = [int(rng, 1, 12), int(rng, 2, 12), int(rng, 1, 12), int(rng, 2, 12)]
    const [b1, b2] = [int(rng, 2, 9), int(rng, 2, 9)]
    const [a1, a2] = [int(rng, 1, b1 - 1), int(rng, 1, b2 - 1)]
    const [w1, w2] = [int(rng, 1, 5), int(rng, 1, 5)]
    if ([[a, b], [c, d], [a1, b1], [a2, b2]].some(([x, y]) => gcd(x, y) !== 1 || x === y)) continue
    const r1 = qd([a, b], [c, d])
    const M1: Q = [w1 * b1 + a1, b1]
    const M2q: Q = [w2 * b2 + a2, b2]
    const r2 = qd(M1, M2q)
    if (r1[1] > 40 || r2[1] > 40 || qeq(r1, [1, 1])) continue
    return {
      text: `Calculați: a) $\\dfrac{${raw(a, b)}}{${raw(c, d)}}$; b) $\\dfrac{${mx(w1, a1, b1)}}{${mx(w2, a2, b2)}}$.`,
      solution: lines(
        'Linia de fracție mare înseamnă împărțirea numărătorului la numitor:',
        show(`\\dfrac{${raw(a, b)}}{${raw(c, d)}} = ${raw(a, b)} : ${raw(c, d)} = ${raw(a, b)} \\cdot ${raw(d, c)} = ${res(r1)}`),
        show(`\\dfrac{${mx(w1, a1, b1)}}{${mx(w2, a2, b2)}} = ${raw(M1[0], b1)} : ${raw(M2q[0], b2)} = ${raw(M1[0], b1)} \\cdot ${raw(b2, M2q[0])} = ${res(r2)}`),
      ),
      verify: () => qeq(qm(r1, [c, d]), [a, b]) && qeq(qm(r2, M2q), M1),
    }
  }
}

/** x = s/(s+1) · (s+2)/(s+3) · …, y = (s+1)/(s+2) · (s+3)/(s+4) · …: x · y, p. 54, ex. 6 a. */
function fmProductXY(rng: Rng): Made {
  const s = int(rng, 2, 12)
  const t = int(rng, 4, 10)
  const e = s + 2 * t
  const r = q(s, e)
  return {
    text: `Calculați $x \\cdot y$, unde $x = ${raw(s, s + 1)} \\cdot ${raw(s + 2, s + 3)} \\cdot ${raw(s + 4, s + 5)} \\cdot \\ldots \\cdot ${raw(e - 2, e - 1)}$ și $y = ${raw(s + 1, s + 2)} \\cdot ${raw(s + 3, s + 4)} \\cdot \\ldots \\cdot ${raw(e - 1, e)}$.`,
    solution: lines(
      'Așezăm factorii lui $x$ și ai lui $y$ în ordine, pe rând:',
      show(`x \\cdot y = ${raw(s, s + 1)} \\cdot ${raw(s + 1, s + 2)} \\cdot ${raw(s + 2, s + 3)} \\cdot \\ldots \\cdot ${raw(e - 2, e - 1)} \\cdot ${raw(e - 1, e)}`),
      'Fiecare numitor se simplifică cu numărătorul fracției următoare; rămân doar primul numărător și ultimul numitor:',
      show(`x \\cdot y = ${raw(s, e)}${r[1] !== e ? ` = ${F(r)}` : ''}`),
    ),
    verify: () => {
      let x: Q = [1, 1]
      let y: Q = [1, 1]
      for (let i = 0; i < t; i++) {
        x = qm(x, [s + 2 * i, s + 2 * i + 1])
        y = qm(y, [s + 2 * i + 1, s + 2 * i + 2])
      }
      return qeq(qm(x, y), r)
    },
  }
}

const BASES: Q[] = [[21, 10], [7, 5], [13, 10], [9, 4], [5, 2], [11, 10], [3, 2], [7, 2], [9, 5], [12, 5], [7, 4], [11, 5], [17, 10]]

/** (a/b)^m · (a/b)^n : (a/b)^(m+n−2) − k (or − (c/d)²), p. 56, ex. 8 a and 9 a. */
function fmPowersMinus(rng: Rng): Made {
  for (;;) {
    const [a, b] = pick(rng, BASES)
    const m = int(rng, 3, 12)
    const n = int(rng, 2, 10)
    const p = m + n - 2
    const sq: Q = [a * a, b * b]
    const useInt = rng() < 0.5
    let sub: Q
    let subTex: string
    let subVal: string
    if (useInt) {
      const top = Math.floor((a * a - 1) / (b * b))
      if (top < 1) continue
      const k = int(rng, 1, top)
      sub = [k, 1]
      subTex = `${k}`
      subVal = `${k}`
    } else {
      const [c, d] = pick(rng, BASES)
      if (c * b >= a * d) continue
      sub = [c * c, d * d]
      subTex = `${P(c, d)}^2`
      subVal = raw(c * c, d * d)
    }
    const r = qs(sq, sub)
    if (r[0] <= 0) continue
    return {
      text: `Calculați: $${P(a, b)}^{${m}} \\cdot ${P(a, b)}^{${n}} : ${P(a, b)}^{${p}} - ${subTex}$.`,
      solution: lines(
        'Efectuăm întâi operațiile cu puteri care au aceeași bază:',
        show(`${P(a, b)}^{${m}} \\cdot ${P(a, b)}^{${n}} : ${P(a, b)}^{${p}} = ${P(a, b)}^{${m} + ${n} - ${p}} = ${P(a, b)}^2 = ${raw(a * a, b * b)}`),
        show(`${raw(a * a, b * b)} - ${subVal} = ${res(r)}`),
      ),
      verify: () => {
        const B = (x: number, y: number) => BigInt(x) ** BigInt(y)
        const power = B(a, m + n) * B(b, p) * B(b, 2) === B(a, 2) * B(b, m + n) * B(a, p)
        return power && qeq(qa(r, sub), [a * a, b * b])
      },
    }
  }
}

/** (a/1 + a/2 + … + a/n) : (b/c + b/(2c) + … + b/(nc)) = ac/b, p. 58, ex. 8 b. */
function fmSeriesQuotient(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 12)
    const b = int(rng, 2, 12)
    const c = int(rng, 2, 6)
    const n = int(rng, 10, 60)
    if (a === b || a * c === b) continue
    const r = q(a * c, b)
    const H = `\\left(1 + \\frac{1}{2} + \\frac{1}{3} + \\ldots + \\frac{1}{${n}}\\right)`
    return {
      text: `Calculați: $\\left(${raw(a, 1)} + ${raw(a, 2)} + ${raw(a, 3)} + \\ldots + ${raw(a, n)}\\right) : \\left(${raw(b, c)} + ${raw(b, 2 * c)} + ${raw(b, 3 * c)} + \\ldots + ${raw(b, n * c)}\\right)$.`,
      solution: lines(
        'Dăm factor comun în fiecare paranteză:',
        show(`${raw(a, 1)} + ${raw(a, 2)} + \\ldots + ${raw(a, n)} = ${a} \\cdot ${H}`),
        show(`${raw(b, c)} + ${raw(b, 2 * c)} + \\ldots + ${raw(b, n * c)} = ${raw(b, c)} \\cdot ${H}`),
        'Paranteza este aceeași și nu este 0, deci se simplifică:',
        show(`${a} : ${raw(b, c)} = ${a} \\cdot ${raw(c, b)} = ${res(r)}`),
      ),
      verify: () => {
        let x = 0
        let y = 0
        for (let i = 1; i <= n; i++) {
          x += a / i
          y += b / (i * c)
        }
        return Math.abs(x / y - r[0] / r[1]) < 1e-9
      },
    }
  }
}

// ================= contest problems (pp. 41–43) =================

/** p(a + qb) and αa + βb + c known: γ(a + b) + c; or a + kb and b + lc known: a combination, p. 41, ex. 1 and p. 42, ex. 20. */
function contestLinear(rng: Rng): Made {
  const a = int(rng, 1, 12)
  const b = int(rng, 1, 12)
  const c = int(rng, 0, 20)
  if (rng() < 0.5) {
    const p = int(rng, 2, 4)
    const qq = int(rng, 2, 3)
    const t = int(rng, 1, 3)
    const beta = int(rng, 1, 5)
    const alpha = beta + t * (qq - 1)
    const gamma = alpha + t
    const Pv = p * (a + qq * b)
    const Qv = alpha * a + beta * b + c
    const T = gamma * (a + b) + c
    return {
      text: `Dacă $${p}a + ${p * qq}b = ${Pv}$ și $${poly([[beta, 'b'], [alpha, 'a'], [1, 'c']])} = ${Qv}$, unde $a, b, c$ sunt numere naturale, calculați $${gamma}(a + b) + c$.`,
      solution: lines(
        show(`${p}(a + ${qq}b) = ${Pv} \\Rightarrow a + ${qq}b = ${Pv / p}`),
        show(`${gamma}(a + b) + c = ${gamma}a + ${gamma}b + c = (${poly([[alpha, 'a'], [beta, 'b'], [1, 'c']])}) + ${t === 1 ? '' : t}(a + ${qq}b)`),
        show(`${gamma}(a + b) + c = ${Qv} + ${t === 1 ? '' : `${t} \\cdot `}${Pv / p} = ${T}`),
      ),
      verify: () => gamma * a + gamma * b + c === alpha * a + beta * b + c + t * (a + qq * b) && T === Qv + (t * Pv) / p,
    }
  }
  const k = int(rng, 2, 3)
  const l = int(rng, 2, 3)
  const u = int(rng, 2, 4)
  const v = int(rng, 2, 4)
  const M = a + k * b
  const N = b + l * c
  const T = u * a + (u * k + v) * b + v * l * c
  return {
    text: `Știind că $a, b, c$ sunt numere naturale, $a + ${k}b = ${M}$ și $b + ${l}c = ${N}$, calculați $${poly([[u, 'a'], [u * k + v, 'b'], [v * l, 'c']])}$.`,
    solution: lines(
      'Despărțim termenul cu $b$ ca să apară cele două sume cunoscute:',
      show(`${poly([[u, 'a'], [u * k + v, 'b'], [v * l, 'c']])} = ${u}(a + ${k}b) + ${v}(b + ${l}c) = ${u} \\cdot ${M} + ${v} \\cdot ${N} = ${T}`),
    ),
    verify: () => T === u * M + v * N,
  }
}

/** a : b gives q, remainder r, and ma + b = S: a and b, p. 42, ex. 16 and 26. */
function contestDivisionSum(rng: Rng): Made {
  const b = int(rng, 10, 80)
  const qq = int(rng, 2, 9)
  const r = int(rng, 1, b - 1)
  const a = qq * b + r
  const m = int(rng, 1, 3)
  const S = m * a + b
  const left = m === 1 ? `${qq}b + ${r} + b` : `${m}(${qq}b + ${r}) + b`
  return {
    text: `Împărțind numărul natural $a$ la numărul natural $b$, obținem câtul ${qq} și restul ${r}. Aflați numerele, știind că $${poly([[m, 'a'], [1, 'b']])} = ${S}$.`,
    solution: lines(
      `Din teorema împărțirii cu rest: $a = ${qq}b + ${r}$, cu $${r} < b$.`,
      show(`${left} = ${S} \\Rightarrow ${m * qq + 1}b + ${m * r} = ${S} \\Rightarrow ${m * qq + 1}b = ${S - m * r} \\Rightarrow b = ${b}`),
      `Deci $a = ${qq} \\cdot ${b} + ${r} = ${a}$ și $b = ${b}$ (restul ${r} este mai mic decât ${b}).`,
    ),
    verify: () => range(1, S).filter((y) => {
      const x = qq * y + r
      return r < y && m * x + y === S
    }).join() === String(b),
  }
}

/** a + b + c = S, a : b and b : c with given quotients and remainders, p. 42, ex. 22. */
function contestThreeNumbers(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 5, 30)
    const q2 = int(rng, 2, 6)
    const r2 = int(rng, 0, c - 1)
    const b = q2 * c + r2
    const q1 = int(rng, 2, 5)
    const r1 = int(rng, 0, Math.min(b - 1, 20))
    const a = q1 * b + r1
    const S = a + b + c
    if (S > 2000) continue
    const K = q1 * q2 + q2 + 1
    const free = q1 * r2 + r1 + r2
    return {
      text: `Suma a trei numere naturale $a$, $b$, $c$ este ${S}. Împărțind pe $a$ la $b$ obținem câtul ${q1} și restul ${r1}, iar împărțind pe $b$ la $c$ obținem câtul ${q2} și restul ${r2}. Aflați numerele.`,
      solution: lines(
        show(`b = ${poly([[q2, 'c'], [r2, '']])}, \\qquad a = ${q1}b + ${r1} = ${poly([[q1 * q2, 'c'], [q1 * r2 + r1, '']])}`),
        show(`a + b + c = ${poly([[q1 * q2, 'c'], [q1 * r2 + r1, '']])} + ${poly([[q2, 'c'], [r2, '']])} + c = ${poly([[K, 'c'], [free, '']])} = ${S}`),
        show(`${K}c = ${S - free} \\Rightarrow c = ${c}, \\quad b = ${b}, \\quad a = ${a}`),
        `Resturile sunt mai mici decât împărțitorii: $${r1} < ${b}$ și $${r2} < ${c}$.`,
      ),
      verify: () => range(1, S).filter((z) => {
        const y = q2 * z + r2
        const x = q1 * y + r1
        return r2 < z && r1 < y && x + y + z === S
      }).join() === String(c),
    }
  }
}

/** A round-robin tournament: the number of games from the players, or back, p. 43, ex. 35. */
function contestGames(rng: Rng): Made {
  const n = int(rng, 5, 40)
  const G = (n * (n - 1)) / 2
  const back = rng() < 0.5
  if (!back) {
    return {
      text: `La un turneu de șah participă ${de(n)} concurenți, care joacă fiecare cu fiecare câte o partidă. Câte partide se joacă în total?`,
      solution: lines(
        `Fiecare dintre cei ${de(n)} concurenți joacă cu ceilalți ${n - 1}. Produsul $${n} \\cdot ${n - 1}$ numără fiecare partidă de două ori (o dată pentru fiecare jucător), deci:`,
        show(`${n} \\cdot ${n - 1} : 2 = ${G}`),
      ),
      verify: () => range(1, n).reduce((s, i) => s + (i - 1), 0) === G,
    }
  }
  return {
    text: `La o întâlnire, fiecare persoană a dat mâna o singură dată cu fiecare dintre celelalte. S-au dat în total ${de(G)} strângeri de mână. Câte persoane au fost la întâlnire?`,
    solution: lines(
      'Dacă sunt $n$ persoane, fiecare dă mâna cu celelalte $n - 1$, iar fiecare strângere de mână este numărată de două ori:',
      show(`n(n - 1) : 2 = ${G} \\Rightarrow n(n - 1) = ${2 * G} = ${n} \\cdot ${n - 1}`),
      `Numărul ${2 * G} este produsul a două numere consecutive, ${n - 1} și ${n}, deci la întâlnire au fost ${de(n)} persoane.`,
    ),
    verify: () => range(2, 100).filter((x) => x * (x - 1) === 2 * G).join() === String(n),
  }
}

/** The number 123…N: how many digits, and the digit in a given place, p. 41, ex. 13. */
function contestDigitsConcat(rng: Rng): Made {
  const N = int(rng, 25, 300)
  const total = N <= 99 ? 9 + 2 * (N - 9) : 189 + 3 * (N - 99)
  const k = int(rng, 10, total)
  const ORD = ['prima', 'a doua', 'a treia']
  let where: string
  let digit: number
  if (k <= 189) {
    const k1 = k - 9
    const before = Math.floor((k1 - 1) / 2)
    const pos = (k1 - 1) % 2
    const num = 10 + before
    digit = Number(String(num)[pos])
    where = `Primele 9 cifre sunt ale numerelor de o cifră. Rămân $${k} - 9 = ${k1}$ cifre din numere de câte două cifre: $${k1} = 2 \\cdot ${before} + ${pos + 1}$, deci după ${de(before)} numere complete de două cifre urmează ${ORD[pos]} cifră a numărului $10 + ${before} = ${num}$, adică ${digit}.`
  } else {
    const k2 = k - 189
    const before = Math.floor((k2 - 1) / 3)
    const pos = (k2 - 1) % 3
    const num = 100 + before
    digit = Number(String(num)[pos])
    where = `Numerele de o cifră și de două cifre au $9 + 90 \\cdot 2 = 189$ de cifre. Rămân $${k} - 189 = ${k2}$ cifre din numere de câte trei cifre: $${k2} = 3 \\cdot ${before} + ${pos + 1}$, deci după ${de(before)} numere complete de trei cifre urmează ${ORD[pos]} cifră a numărului $100 + ${before} = ${num}$, adică ${digit}.`
  }
  return {
    text: `Se formează un număr scriind unul după altul numerele naturale de la 1 la ${N}: $123\\ldots${N}$. a) Câte cifre are acest număr? b) Care este cifra de pe poziția ${k}, numărând de la stânga?`,
    solution: lines(
      N <= 99
        ? `a) Sunt 9 numere de o cifră și $${N} - 9 = ${N - 9}$ numere de două cifre: $9 + ${N - 9} \\cdot 2 = ${total}$ de cifre.`
        : `a) Sunt 9 numere de o cifră, 90 de numere de două cifre și $${N} - 99 = ${N - 99}$ numere de trei cifre: $9 + 90 \\cdot 2 + ${N - 99} \\cdot 3 = ${total}$ de cifre.`,
      `b) ${where}`,
    ),
    verify: () => {
      const s = range(1, N).join('')
      return s.length === total && Number(s[k - 1]) === digit
    },
  }
}

/** Petrol sold over n days, d litres more each day: the first day, p. 42, ex. 24. */
function contestPump(rng: Rng): Made {
  const n = int(rng, 4, 7)
  const d = 10 * int(rng, 2, 20)
  const first = 10 * int(rng, 10, 90)
  const extra = (d * n * (n - 1)) / 2
  const total = n * first + extra
  return {
    text: `La o pompă s-au vândut în ${COUNTW[n] ?? n} zile ${de(total)} litri de benzină. Aflați câți litri s-au vândut în prima zi, știind că în fiecare zi s-au vândut cu ${de(d)} litri mai mult decât în ziua precedentă.`,
    solution: lines(
      'Notăm cu $x$ cantitatea din prima zi:',
      show(`x + (x + ${d}) + ${range(2, n - 1).map((i) => `(x + ${i * d})`).join(' + ')} = ${nr(total)}`),
      show(`${n}x + ${d} \\cdot (1 + 2 + \\ldots + ${n - 1}) = ${n}x + ${nr(extra)} = ${nr(total)}`),
      show(`${n}x = ${nr(total - extra)} \\Rightarrow x = ${nr(first)}`),
      `În prima zi s-au vândut ${de(first)} litri.`,
    ),
    verify: () => range(0, n - 1).reduce((s, i) => s + first + i * d, 0) === total,
  }
}

const REM_PAIRS: [number, number][] = [[28, 35], [12, 18], [15, 20], [6, 10], [8, 12], [9, 12], [10, 15], [14, 21], [16, 24], [20, 30], [6, 8], [10, 12]]

/** How many multiples of k lie between A and B; the sum of the numbers between them with two given remainders, p. 42, ex. 27. */
function contestTwoRemainders(rng: Rng): Made {
  for (;;) {
    const [m1, m2] = pick(rng, REM_PAIRS)
    const dl = int(rng, 1, Math.min(m1, m2) - 1)
    const r1 = m1 - dl
    const r2 = m2 - dl
    const L = lcm(m1, m2)
    const A = int(rng, 100, 2000)
    const B = A + int(rng, 3, 7) * L
    const xs = range(A + 1, B - 1).filter((x) => (x + dl) % L === 0)
    if (xs.length < 2) continue
    const k = pick(rng, [7, 9, 10, 11, 12, 13])
    const f1 = Math.floor((B - 1) / k)
    const f2 = Math.floor(A / k)
    const cnt = f1 - f2
    const sum = xs.reduce((s, x) => s + x, 0)
    return {
      text: `a) Câte numere naturale cuprinse între ${A} și ${B} sunt divizibile cu ${k}? b) Determinați suma numerelor naturale cuprinse între ${A} și ${B} care, împărțite la ${m1}, dau restul ${r1}, iar împărțite la ${m2}, dau restul ${r2}.`,
      solution: lines(
        `a) Numărul multiplilor nenuli ai lui ${k} mai mici decât ${B} este câtul împărțirii $${B - 1} : ${k}$, adică ${f1}, iar numărul celor cel mult egali cu ${A} este câtul împărțirii $${A} : ${k}$, adică ${f2}. Între ${A} și ${B} sunt $${f1} - ${f2} = ${cnt}$.`,
        `b) Dacă $x$ dă restul ${r1} la împărțirea cu ${m1}, atunci $x + ${dl}$ se divide cu ${m1} (pentru că $${r1} + ${dl} = ${m1}$); la fel, $x + ${dl}$ se divide cu ${m2}. Deci $x + ${dl}$ este multiplu de $[${m1}, ${m2}] = ${L}$:`,
        show(`x = ${L}t - ${dl}: \\quad ${xs.join(', ')}`),
        show(`${xs.join(' + ')} = ${nr(sum)}`),
      ),
      verify: () => {
        const c2 = range(A + 1, B - 1).filter((x) => x % k === 0).length
        const s2 = range(A + 1, B - 1).filter((x) => x % m1 === r1 && x % m2 === r2).reduce((s, x) => s + x, 0)
        return c2 === cnt && s2 === sum
      },
    }
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-p2-divisibility',
    joins: 'v-divisibility',
    label: 'Divizibilitate: divizori, multipli, criterii, numere prime',
    topic: 'Algebră',
    forms: {
      1: [divGcdLcm, divCriteriaPick, divSmallestLargest],
      2: [divXDivides, divShiftedMultiple, divLargestProper, divRemainderRange, divPrimesSumProduct],
      3: [divLastDigitSeries, divSeriesGroups, divProductEquation],
    },
  },
  {
    id: 'v-p2-fraction-props',
    joins: 'v-fraction-props',
    label: 'Fracții: scriere, echivalență, comparare, părți dintr-un număr',
    topic: 'Algebră',
    forms: {
      1: [fpPercents, fpPartRemaining, fpPercentSpent, fpEquivalentX],
      2: [fpConditionX, fpNaturalValue, fpBetween, fpEquivalentSum, fpRestOfRest],
      3: [fpDigitFraction, fpTwoGroups, fpJourney],
    },
  },
  {
    id: 'v-p2-fraction-add',
    joins: 'v-fraction-order',
    label: 'Fracții ordinare: adunarea și scăderea',
    topic: 'Algebră',
    forms: {
      1: [faSameDenSeries, faSimplifyThenAdd, faMixedSubtract],
      2: [faUnknownTerm, faWorkTogether, faPartsLeft, faClothLeft],
      3: [faSumsXY, faAlternating, faDigitEquation],
    },
  },
  {
    id: 'v-p2-fraction-mult',
    joins: 'v-fraction-mult',
    label: 'Fracții ordinare: înmulțirea, împărțirea și puterea',
    topic: 'Algebră',
    forms: {
      1: [fmProductThree, fmDivideMixed, fmPowerMixed],
      2: [fmUnknownDivision, fmPowerRules, fmComplexFraction],
      3: [fmProductXY, fmPowersMinus, fmSeriesQuotient],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-p2-naturals',
    label: 'Probleme de concurs: numere naturale',
    forms: [contestLinear, contestDivisionSum, contestThreeNumbers, contestGames, contestDigitsConcat, contestPump, contestTwoRemainders],
  },
]
