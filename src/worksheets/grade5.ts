// More kinds of exercises for grade V, after the Romanian syllabus: division with remainder, divisibility, equations
// in natural numbers, word problems (figurative method, false hypothesis, comparison), the arithmetic mean and units
// of measure, segments, angles and volumes. Each form takes a seeded random source and returns the statement, the
// worked solution in Romanian and a check of its arithmetic. `KINDS` is registered in `generators.ts`.
import type { Made } from './generators'
import { de, gcd, int, pick, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  /** 'v-…', unique */
  id: string
  /** Romanian, shown in the interface */
  label: string
  topic: 'Algebră' | 'Geometrie'
  /** level 1 easy, 2 medium, 3 hard */
  forms: Record<1 | 2 | 3, Form[]>
}

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** The word "de" alone, for a number written inside a formula: "$… = 120$ de pagini". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
/** A decimal number with the Romanian comma: 2{,}5 */
const dec = (x: number) => String(Math.round(x * 10000) / 10000).replace('.', '{,}')
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0)
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
const digitsOf = (n: number) => String(n).split('').map(Number)
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const GIRLS = ['Ana', 'Maria', 'Ioana', 'Elena', 'Irina', 'Daria', 'Sara', 'Bianca']
const BOYS = ['Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Matei', 'Luca']
const COUNT: Record<number, string> = { 2: 'două', 3: 'trei', 4: 'patru', 5: 'cinci' }

// ================= division with remainder =================

/** a : b, the quotient and the remainder, with the check. */
export function divQuotRem(rng: Rng): Made {
  const b = int(rng, 6, 48)
  const c = int(rng, 12, 180)
  const r = int(rng, 1, b - 1)
  const a = b * c + r
  return {
    text: `Aflați câtul și restul împărțirii numărului ${a} la ${b}, apoi faceți proba.`,
    solution: lines(
      show(`${a} : ${b} = ${c} \\text{ rest } ${r}`),
      `Proba: $${b} \\cdot ${c} + ${r} = ${b * c} + ${r} = ${a}$, iar restul este mai mic decât împărțitorul: $${r} < ${b}$.`,
    ),
    verify: () => Math.floor(a / b) === c && a % b === r,
  }
}

/** The number that divided by b gives the quotient c and the remainder r. */
export function divFindDividend(rng: Rng): Made {
  const b = int(rng, 4, 60)
  const c = int(rng, 3, 90)
  const r = int(rng, 1, b - 1)
  const n = b * c + r
  return {
    text: `Aflați numărul natural care, împărțit la ${b}, dă câtul ${c} și restul ${r}.`,
    solution: lines(
      'Din teorema împărțirii cu rest, deîmpărțitul este produsul dintre împărțitor și cât, la care se adună restul:',
      show(`n = ${b} \\cdot ${c} + ${r} = ${b * c} + ${r} = ${n}`),
    ),
    verify: () => Math.floor(n / b) === c && n % b === r,
  }
}

/** The largest remainder at a division by b, and the largest number with a given quotient. */
export function divLargestRemainder(rng: Rng): Made {
  const b = int(rng, 5, 45)
  const c = int(rng, 3, 70)
  const n = b * c + b - 1
  return {
    text: lines(
      `La o împărțire de numere naturale, împărțitorul este ${b}.`,
      'a) Care este cel mai mare rest posibil?',
      `b) Aflați cel mai mare număr natural care, împărțit la ${b}, dă câtul ${c}.`,
    ),
    solution: lines(
      `a) Restul este mai mic decât împărțitorul, deci poate fi $0, 1, 2, \\ldots, ${b - 1}$. Cel mai mare rest posibil este ${b - 1}.`,
      'b) Numărul este cel mai mare atunci când restul este cel mai mare:',
      show(`n = ${b} \\cdot ${c} + ${b - 1} = ${b * c} + ${b - 1} = ${n}`),
    ),
    verify: () => Math.floor(n / b) === c && Math.floor((n + 1) / b) === c + 1,
  }
}

/** The divisor, from the dividend, the quotient and the remainder. */
export function divFindDivisor(rng: Rng): Made {
  const b = int(rng, 7, 60)
  const c = int(rng, 5, 40)
  const r = int(rng, 1, b - 1)
  const a = b * c + r
  return {
    text: `Împărțind numărul ${a} la un număr natural, obținem câtul ${c} și restul ${r}. Aflați împărțitorul.`,
    solution: lines(
      'Notăm împărțitorul cu $b$. Din teorema împărțirii cu rest:',
      show(`${a} = b \\cdot ${c} + ${r} \\Rightarrow b \\cdot ${c} = ${a} - ${r} = ${a - r} \\Rightarrow b = ${a - r} : ${c} = ${b}`),
      `Restul este mai mic decât împărțitorul, $${r} < ${b}$, deci împărțitorul este ${b}.`,
    ),
    verify: () => (a - r) / c === b && r < b && Math.floor(a / b) === c,
  }
}

const PACKS = [
  { who: 'Un fermier', verb: 'așază', items: 'ouă', boxes: 'cofraje', one: 'un cofraj', sizes: [6, 10, 12, 30] },
  { who: 'Un livădar', verb: 'pune', items: 'mere', boxes: 'lădițe', one: 'o lădiță', sizes: [15, 18, 24, 25, 32, 36] },
  { who: 'Un librar', verb: 'împachetează', items: 'cărți', boxes: 'cutii', one: 'o cutie', sizes: [8, 12, 14, 16, 18, 24] },
  { who: 'Un cofetar', verb: 'pune', items: 'bomboane', boxes: 'pungi', one: 'o pungă', sizes: [9, 15, 20, 25, 35, 40] },
]

/** N things in boxes of k: how many full boxes, how many left, how many more for one more box. */
export function divPacking(rng: Rng): Made {
  const p = pick(rng, PACKS)
  const k = pick(rng, p.sizes)
  const c = int(rng, 6, 60)
  const r = int(rng, 2, k - 2)
  const N = k * c + r
  return {
    text: lines(
      `${p.who} ${p.verb} ${de(N)} ${p.items} în ${p.boxes} de câte ${k}.`,
      `a) Câte ${p.boxes} se umplu și câte ${p.items} rămân?`,
      `b) De câte ${p.items} ar mai fi nevoie pentru a umple încă ${p.one}?`,
    ),
    solution: lines(
      show(`${N} : ${k} = ${c} \\text{ rest } ${r}`),
      `a) Se umplu ${de(c)} ${p.boxes} și rămân ${de(r)} ${p.items}.`,
      `b) Pentru încă ${p.one} ar mai fi nevoie de $${k} - ${r} = ${k - r}$ ${deW(k - r)}${p.items}.`,
    ),
    verify: () => Math.floor(N / k) === c && N % k === r && (N + k - r) % k === 0,
  }
}

const DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']

/** What day of the week it will be in N days: the remainder at 7. */
export function divWeekday(rng: Rng): Made {
  for (;;) {
    const today = int(rng, 0, 6)
    const N = int(rng, 30, 400)
    const q = Math.floor(N / 7)
    const r = N % 7
    if (r === 0) continue
    const then = DAYS[(today + r) % 7]
    return {
      text: `Astăzi este ${DAYS[today]}. Ce zi a săptămânii va fi peste ${de(N)} zile?`,
      solution: lines(
        'Zilele săptămânii se repetă din 7 în 7:',
        show(`${N} : 7 = ${q} \\text{ rest } ${r}`),
        `Trec ${de(q)} săptămâni întregi, după care este tot ${DAYS[today]}, și încă ${r === 1 ? 'o zi' : `${r} zile`}. Va fi ${then}.`,
      ),
      verify: () => DAYS[(today + N) % 7] === then && 7 * q + r === N,
    }
  }
}

/** a + b = S and a : b = c rest r. */
export function divSumAndQuotient(rng: Rng): Made {
  const b = int(rng, 8, 60)
  const c = int(rng, 2, 9)
  const r = int(rng, 1, b - 1)
  const a = b * c + r
  const S = a + b
  return {
    text: `Suma a două numere naturale este ${S}. Împărțind numărul mai mare la cel mai mic, obținem câtul ${c} și restul ${r}. Aflați cele două numere.`,
    solution: lines(
      `Notăm cu $a$ numărul mai mare și cu $b$ numărul mai mic. Din teorema împărțirii cu rest, $a = ${c} \\cdot b + ${r}$. Înlocuim în sumă:`,
      show(`${c} \\cdot b + ${r} + b = ${S} \\Rightarrow ${c + 1} \\cdot b = ${S} - ${r} = ${S - r} \\Rightarrow b = ${S - r} : ${c + 1} = ${b}`),
      show(`a = ${c} \\cdot ${b} + ${r} = ${a}`),
      `Numerele sunt ${a} și ${b}. Verificare: $${a} + ${b} = ${S}$ și $${r} < ${b}$.`,
    ),
    verify: () => a + b === S && Math.floor(a / b) === c && a % b === r,
  }
}

/** How many three-digit numbers leave the remainder r when divided by b. */
export function divCountThreeDigit(rng: Rng): Made {
  const b = int(rng, 6, 45)
  const r = int(rng, 1, b - 1)
  const q0 = Math.ceil((100 - r) / b)
  const q1 = Math.floor((999 - r) / b)
  const count = q1 - q0 + 1
  return {
    text: `Câte numere naturale de trei cifre dau restul ${r} la împărțirea la ${b}?`,
    solution: lines(
      `Numerele căutate sunt de forma $n = ${b} \\cdot c + ${r}$, unde $c$ este câtul.`,
      `Cel mai mic număr de trei cifre de această formă este $${b} \\cdot ${q0} + ${r} = ${b * q0 + r}$ (cel dinainte, $${b} \\cdot ${q0 - 1} + ${r} = ${b * (q0 - 1) + r}$, are mai puțin de trei cifre).`,
      `Cel mai mare este $${b} \\cdot ${q1} + ${r} = ${b * q1 + r}$ (următorul, $${b} \\cdot ${q1 + 1} + ${r} = ${b * (q1 + 1) + r}$, are patru cifre).`,
      `Câtul ia toate valorile de la ${q0} la ${q1}, deci sunt $${q1} - ${q0} + 1 = ${count}$ ${deW(count)}numere.`,
    ),
    verify: () => {
      let n = 0
      for (let x = 100; x <= 999; x++) if (x % b === r) n++
      return n === count
    },
  }
}

/** The numbers whose quotient at the division by b is k times the remainder. */
export function divQuotientMultiple(rng: Rng): Made {
  const b = int(rng, 3, 7)
  const k = int(rng, 2, 9)
  const found = Array.from({ length: b - 1 }, (_, i) => (b * k + 1) * (i + 1))
  return {
    text: `Determinați toate numerele naturale nenule care, împărțite la ${b}, dau câtul de ${k} ori mai mare decât restul.`,
    solution: lines(
      `Din teorema împărțirii cu rest, $n = ${b} \\cdot c + r$, cu $r < ${b}$. Cum $c = ${k} \\cdot r$:`,
      show(`n = ${b} \\cdot ${k} \\cdot r + r = ${b * k} \\cdot r + r = ${b * k + 1} \\cdot r`),
      `Restul poate fi $${Array.from({ length: b - 1 }, (_, i) => i + 1).join(', ')}$ (pentru $r = 0$ am obține $n = 0$), deci`,
      show(`n \\in \\{${found.join(', ')}\\}`),
    ),
    verify: () => {
      const all: number[] = []
      for (let n = 1; n <= (b * k + 1) * b + b; n++) if (Math.floor(n / b) === k * (n % b)) all.push(n)
      return all.join() === found.join()
    },
  }
}

// ================= divisibility =================

/** All the divisors of n, found in pairs. */
export function divisorsList(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 12, 150)
    const d = divisors(n)
    if (d.length < 4 || d.length > 12) continue
    const pairs = d.filter((x) => x * x <= n).map((x) => `${x} \\cdot ${n / x}`)
    return {
      text: `Scrieți toți divizorii numărului ${n}.`,
      solution: lines(
        `Căutăm toate perechile de numere naturale care au produsul ${n}:`,
        show(`${n} = ${pairs.join(' = ')}`),
        show(`D_{${n}} = \\{${d.join(', ')}\\}`),
      ),
      verify: () => d.every((x) => n % x === 0) && d.length === Array.from({ length: n }, (_, i) => i + 1).filter((x) => Number.isInteger(n / x)).length,
    }
  }
}

/** The multiples of k between two numbers. */
export function multiplesBetween(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 3, 19)
    const lo = int(rng, 10, 200)
    const hi = lo + int(rng, 3 * k, 6 * k)
    if (lo % k === 0 || hi % k === 0) continue
    const q = Math.floor(lo / k) + 1
    const found: number[] = []
    for (let m = q * k; m < hi; m += k) found.push(m)
    return {
      text: `Scrieți multiplii lui ${k} cuprinși între ${lo} și ${hi}.`,
      solution: lines(
        `Cum $${lo} : ${k} = ${q - 1} \\text{ rest } ${lo % k}$, primul multiplu al lui ${k} mai mare decât ${lo} este $${k} \\cdot ${q} = ${q * k}$. Adunăm mereu ${k}:`,
        show(found.join(', ')),
        `Următorul multiplu, ${found[found.length - 1] + k}, este mai mare decât ${hi}.`,
      ),
      verify: () => {
        const all: number[] = []
        for (let x = lo + 1; x < hi; x++) if (x % k === 0) all.push(x)
        return all.join() === found.join()
      },
    }
  }
}

const RULES: Record<number, string> = {
  2: 'Un număr este divizibil cu 2 dacă ultima sa cifră este pară (0, 2, 4, 6 sau 8).',
  3: 'Un număr este divizibil cu 3 dacă suma cifrelor sale este divizibilă cu 3.',
  5: 'Un număr este divizibil cu 5 dacă ultima sa cifră este 0 sau 5.',
  9: 'Un număr este divizibil cu 9 dacă suma cifrelor sale este divizibilă cu 9.',
  10: 'Un număr este divizibil cu 10 dacă ultima sa cifră este 0.',
}

/** Which of five numbers are divisible by 2, 3, 5, 9 or 10. */
export function divisibleWhich(rng: Rng): Made {
  const k = pick(rng, [2, 3, 5, 9, 10])
  const flags = shuffle(rng, rng() < 0.5 ? [true, true, false, false, false] : [true, true, true, false, false])
  const nums: number[] = []
  for (const f of flags) {
    for (;;) {
      const n = f ? k * int(rng, Math.ceil(100 / k), Math.floor(9999 / k)) : int(rng, 100, 9999)
      if ((n % k === 0) !== f || nums.includes(n)) continue
      nums.push(n)
      break
    }
  }
  const yes = nums.filter((n) => n % k === 0)
  const no = nums.filter((n) => n % k !== 0)
  const bySum = k === 3 || k === 9
  return {
    text: `Care dintre numerele ${list(nums)} sunt divizibile cu ${k}?`,
    solution: lines(
      RULES[k],
      ...(bySum ? nums.map((n) => `Pentru ${n}: $${digitsOf(n).join(' + ')} = ${sum(digitsOf(n))}$, care ${sum(digitsOf(n)) % k === 0 ? 'este' : 'nu este'} divizibil cu ${k}.`) : []),
      `Sunt divizibile cu ${k} numerele ${list(yes)}. Nu sunt divizibile cu ${k} numerele ${list(no)}.`,
    ),
    verify: () => yes.length >= 2 && no.length >= 2 && yes.every((n) => Number.isInteger(n / k)) && no.every((n) => !Number.isInteger(n / k)),
  }
}

/** The digits x for which a number with the digit x is divisible by 3 or by 9. */
export function divisibleDigit(rng: Rng): Made {
  const k = pick(rng, [3, 9])
  const pos = int(rng, 1, 3)
  const ds = [int(rng, 1, 9), int(rng, 0, 9), int(rng, 0, 9), int(rng, 0, 9)]
  const shown = ds.map((d, i) => (i === pos ? 'x' : String(d)))
  const s = sum(ds.filter((_, i) => i !== pos))
  const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => (s + x) % k === 0)
  const numbers = xs.map((x) => Number(shown.join('').replace('x', String(x))))
  return {
    text: `Determinați cifrele $x$ pentru care numărul $\\overline{${shown.join('')}}$ este divizibil cu ${k}.`,
    solution: lines(
      `Numărul este divizibil cu ${k} dacă suma cifrelor sale este divizibilă cu ${k}. Suma cifrelor este $${shown.join(' + ')} = ${s} + x$.`,
      `Cum $x$ este cifră, $${s} \\le ${s} + x \\le ${s + 9}$, deci $${s} + x \\in \\{${xs.map((x) => s + x).join(', ')}\\}$, adică $x \\in \\{${xs.join(', ')}\\}$.`,
      `${numbers.length === 1 ? 'Obținem numărul' : 'Obținem numerele'} ${list(numbers)}.`,
    ),
    verify: () => {
      const all: number[] = []
      for (let x = 0; x <= 9; x++) {
        const n = Number(shown.join('').replace('x', String(x)))
        if (n % k === 0) all.push(n)
      }
      return all.join() === numbers.join() && numbers.length > 0
    },
  }
}

const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17]

/** Which of four numbers are prime: trial division by the primes up to the square root. */
export function primesAmong(rng: Rng): Made {
  const primes: number[] = []
  const others: number[] = []
  while (primes.length < 2 || others.length < 2) {
    const n = int(rng, 31, 199)
    if (n % 2 === 0 || n % 5 === 0 || primes.includes(n) || others.includes(n)) continue
    if (isPrime(n)) {
      if (primes.length < 2) primes.push(n)
    } else if (others.length < 2) others.push(n)
  }
  const nums = shuffle(rng, [...primes, ...others])
  const why = (n: number) => {
    if (isPrime(n)) {
      const tried = SMALL_PRIMES.filter((p) => p * p <= n)
      const stop = SMALL_PRIMES.find((p) => p * p > n)!
      return `${n} este număr prim: nu se împarte exact la ${list(tried)} (și ne oprim, deoarece $${stop}^2 = ${stop * stop} > ${n}$).`
    }
    const p = SMALL_PRIMES.find((q) => n % q === 0)!
    return `$${n} = ${p} \\cdot ${n / p}$, deci ${n} nu este număr prim.`
  }
  return {
    text: `Stabiliți care dintre numerele ${list(nums)} sunt prime.`,
    solution: lines(
      'Încercăm împărțirea la numerele prime, în ordine, cât timp pătratul lor nu depășește numărul.',
      ...nums.map(why),
      `Numerele prime sunt ${list(nums.filter(isPrime))}.`,
    ),
    verify: () => nums.filter((n) => divisors(n).length === 2).length === 2 && others.every((n) => SMALL_PRIMES.some((q) => n % q === 0 && n / q > 1)),
  }
}

/** The divisors of two numbers and the common ones. */
export function commonDivisors(rng: Rng): Made {
  for (;;) {
    const g = pick(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20])
    const m = int(rng, 1, 6)
    const n = int(rng, 2, 7)
    if (m >= n || gcd(m, n) !== 1 || g * n > 160) continue
    const [a, b] = [g * m, g * n]
    const common = divisors(a).filter((d) => b % d === 0)
    return {
      text: `Scrieți divizorii numerelor ${a} și ${b}, apoi aflați divizorii lor comuni.`,
      solution: lines(
        show(`D_{${a}} = \\{${divisors(a).join(', ')}\\}`),
        show(`D_{${b}} = \\{${divisors(b).join(', ')}\\}`),
        `Divizorii comuni sunt numerele care apar în ambele șiruri: ${list(common)}.`,
      ),
      verify: () => common.join() === divisors(g).join(),
    }
  }
}

/** The numbers AxBy divisible by two numbers at once (5 and 3, 5 and 9, 2 and 9). */
export function divisibleTwoDigits(rng: Rng): Made {
  const [p, q] = pick(rng, [[5, 3], [5, 9], [2, 9]])
  const A = int(rng, 1, 9)
  const B = int(rng, 0, 9)
  const ys = p === 5 ? [0, 5] : [0, 2, 4, 6, 8]
  const rows = ys.map((y) => ({ y, s: A + B + y, xs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => (A + B + y + x) % q === 0) }))
  const numbers = rows.flatMap((r) => r.xs.map((x) => 1000 * A + 100 * x + 10 * B + r.y)).sort((u, v) => u - v)
  return {
    text: `Determinați toate numerele de forma $\\overline{${A}x${B}y}$ care sunt divizibile și cu ${p}, și cu ${q}.`,
    solution: lines(
      `Numărul este divizibil cu ${p}, deci ultima sa cifră este ${p === 5 ? '0 sau 5' : 'pară'}: $y \\in \\{${ys.join(', ')}\\}$.`,
      `Numărul este divizibil cu ${q} dacă suma cifrelor sale, $${A} + x + ${B} + y$, este divizibilă cu ${q}.`,
      ...rows.map((r) => `Pentru $y = ${r.y}$, suma cifrelor este $${r.s} + x$, deci ${r.xs.length === 1 ? `$x = ${r.xs[0]}$` : `$x \\in \\{${r.xs.join(', ')}\\}$`}.`),
      `Numerele căutate sunt: ${numbers.join(', ')}.`,
    ),
    verify: () => {
      const all: number[] = []
      for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) {
        const n = 1000 * A + 100 * x + 10 * B + y
        if (n % p === 0 && n % q === 0) all.push(n)
      }
      return all.sort((u, v) => u - v).join() === numbers.join() && numbers.length >= 2
    },
  }
}

/** A sum of powers of the same base is divisible by a number: the smallest power as a common factor. */
export function powersDivisible(rng: Rng): Made {
  const b = pick(rng, [2, 3, 5, 7])
  const n = int(rng, 10, 60)
  const kind = int(rng, 0, 3)
  const [expr, low, inside, value, m] = ([
    [`${b}^{${n + 2}} + ${b}^{${n + 1}} + ${b}^{${n}}`, n, `${b}^2 + ${b} + 1`, `${b * b} + ${b} + 1`, b * b + b + 1],
    [`${b}^{${n + 2}} - ${b}^{${n}}`, n, `${b}^2 - 1`, `${b * b} - 1`, b * b - 1],
    [`${b}^{${n + 3}} + ${b}^{${n + 1}}`, n + 1, `${b}^2 + 1`, `${b * b} + 1`, b * b + 1],
    [`${b}^{${n + 2}} + ${b}^{${n + 1}} - ${b}^{${n}}`, n, `${b}^2 + ${b} - 1`, `${b * b} + ${b} - 1`, b * b + b - 1],
  ] as [string, number, string, string, number][])[kind]
  return {
    text: `Arătați că numărul $N = ${expr}$ este divizibil cu ${m}.`,
    solution: lines(
      'Dăm factor comun puterea cu exponentul cel mai mic:',
      show(`N = ${b}^{${low}} \\cdot (${inside}) = ${b}^{${low}} \\cdot (${value}) = ${b}^{${low}} \\cdot ${m}`),
      `Numărul $N$ este produsul dintre $${b}^{${low}}$ și ${m}, deci este divizibil cu ${m}.`,
    ),
    verify: () => {
      const B = BigInt(b)
      const P = (e: number) => B ** BigInt(e)
      const N = [P(n + 2) + P(n + 1) + P(n), P(n + 2) - P(n), P(n + 3) + P(n + 1), P(n + 2) + P(n + 1) - P(n)][kind]
      return N === P(low) * BigInt(m) && N % BigInt(m) === 0n
    },
  }
}

/** ka + mb = N with a, b prime, k odd, m and N even: a = 2. */
export function primesEquation(rng: Rng): Made {
  const k = pick(rng, [3, 5, 7])
  const m = pick(rng, [2, 4, 6])
  const b = pick(rng, [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47])
  const N = 2 * k + m * b
  return {
    text: `Determinați numerele prime $a$ și $b$ știind că $${k}a + ${m}b = ${N}$.`,
    solution: lines(
      `Numerele $${m}b$ și ${N} sunt pare, deci și $${k}a = ${N} - ${m}b$ este număr par. Cum ${k} este impar, $a$ este par, iar singurul număr prim par este 2, deci $a = 2$.`,
      show(`${k} \\cdot 2 + ${m}b = ${N} \\Rightarrow ${m}b = ${N} - ${2 * k} = ${N - 2 * k} \\Rightarrow b = ${N - 2 * k} : ${m} = ${b}`),
      `Cum ${b} este număr prim, soluția este $a = 2$ și $b = ${b}$.`,
    ),
    verify: () => {
      const all: string[] = []
      for (let x = 2; k * x < N; x++) for (let y = 2; k * x + m * y <= N; y++) if (isPrime(x) && isPrime(y) && k * x + m * y === N) all.push(`${x},${y}`)
      return all.length === 1 && all[0] === `2,${b}`
    },
  }
}

// ================= equations in natural numbers =================

/** One operation: x + a = b, x − a = b, a − x = b, a·x = b, x : a = b, a : x = b. */
export function eqOneStep(rng: Rng): Made {
  const t = int(rng, 0, 5)
  const [u, v] = t <= 2 ? [int(rng, 12, 400), int(rng, 12, 400)] : [int(rng, 3, 25), int(rng, 4, 60)]
  const [eq, rule, step, x, check] = ([
    [`x + ${u} = ${u + v}`, 'Termenul necunoscut se află scăzând din sumă termenul cunoscut:', `x = ${u + v} - ${u}`, v, `${v} + ${u} = ${u + v}`],
    [`x - ${u} = ${v}`, 'Descăzutul este suma dintre diferență și scăzător:', `x = ${v} + ${u}`, u + v, `${u + v} - ${u} = ${v}`],
    [`${u + v} - x = ${v}`, 'Scăzătorul este diferența dintre descăzut și rest:', `x = ${u + v} - ${v}`, u, `${u + v} - ${u} = ${v}`],
    [`${u} \\cdot x = ${u * v}`, 'Factorul necunoscut se află împărțind produsul la factorul cunoscut:', `x = ${u * v} : ${u}`, v, `${u} \\cdot ${v} = ${u * v}`],
    [`x : ${u} = ${v}`, 'Deîmpărțitul este produsul dintre cât și împărțitor:', `x = ${v} \\cdot ${u}`, u * v, `${u * v} : ${u} = ${v}`],
    [`${u * v} : x = ${v}`, 'Împărțitorul se află împărțind deîmpărțitul la cât:', `x = ${u * v} : ${v}`, u, `${u * v} : ${u} = ${v}`],
  ] as [string, string, string, number, string][])[t]
  return {
    text: `Rezolvați în mulțimea numerelor naturale ecuația $${eq}$.`,
    solution: lines(rule, show(`${step} = ${x}`), `Verificare: $${check}$.`),
    verify: () => [x + u === u + v, x - u === v, u + v - x === v, u * x === u * v, x / u === v, (u * v) / x === v][t],
  }
}

/** Two operations: a·x + b = c, a·x − b = c, x : a + b = c. */
export function eqTwoStep(rng: Rng): Made {
  const t = int(rng, 0, 2)
  const a = int(rng, 2, 12)
  const x0 = int(rng, 2, 40)
  const b = t === 1 ? int(rng, 1, a * x0 - 1) : int(rng, 2, 90)
  const x = t === 2 ? a * x0 : x0
  const [eq, steps] = ([
    [`${a} \\cdot x + ${b} = ${a * x + b}`, `${a} \\cdot x = ${a * x + b} - ${b} = ${a * x} \\Rightarrow x = ${a * x} : ${a} = ${x}`],
    [`${a} \\cdot x - ${b} = ${a * x - b}`, `${a} \\cdot x = ${a * x - b} + ${b} = ${a * x} \\Rightarrow x = ${a * x} : ${a} = ${x}`],
    [`x : ${a} + ${b} = ${x0 + b}`, `x : ${a} = ${x0 + b} - ${b} = ${x0} \\Rightarrow x = ${x0} \\cdot ${a} = ${x}`],
  ] as [string, string][])[t]
  return {
    text: `Aflați numărul natural $x$ din egalitatea $${eq}$.`,
    solution: lines('Aflăm întâi termenul care îl conține pe $x$, apoi pe $x$:', show(steps)),
    verify: () => [a * x + b - b === a * x0, a * x - b > 0 && x === x0, x / a === x0][t],
  }
}

/** The double (triple, …) of a number, plus or minus something. */
export function eqWordsNumber(rng: Rng): Made {
  const k = int(rng, 2, 9)
  const x = int(rng, 4, 60)
  const minus = rng() < 0.5
  const a = minus ? int(rng, 2, k * x - 2) : int(rng, 2, 120)
  const c = minus ? k * x - a : k * x + a
  const what = k === 2 ? 'dublul unui număr natural' : k === 3 ? 'triplul unui număr natural' : `produsul dintre un număr natural și ${k}`
  return {
    text: minus ? `Dacă din ${what} scădem ${a}, obținem ${c}. Aflați numărul.` : `Dacă la ${what} adunăm ${a}, obținem ${c}. Aflați numărul.`,
    solution: lines(
      'Notăm numărul cu $x$ și scriem ecuația:',
      show(`${k} \\cdot x ${minus ? '-' : '+'} ${a} = ${c} \\Rightarrow ${k} \\cdot x = ${c} ${minus ? '+' : '-'} ${a} = ${k * x} \\Rightarrow x = ${k * x} : ${k} = ${x}`),
      `Numărul este ${x}.`,
    ),
    verify: () => (minus ? k * x - a : k * x + a) === c && c > 0,
  }
}

/** With a bracket: a·(x + b) − c = d, (x − b) : a + c = d, a·(x − b) + c = d, (x + b) : a − c = d. */
export function eqParen(rng: Rng): Made {
  const t = int(rng, 0, 3)
  const a = int(rng, 2, 9)
  let eq: string
  let steps: string[]
  let x: number
  let ok: () => boolean
  if (t === 0) {
    x = int(rng, 2, 40)
    const b = int(rng, 2, 30)
    const c = int(rng, 1, a * (x + b) - 1)
    const d = a * (x + b) - c
    eq = `${a} \\cdot (x + ${b}) - ${c} = ${d}`
    steps = [`${a} \\cdot (x + ${b}) = ${d} + ${c} = ${d + c}`, `x + ${b} = ${d + c} : ${a} = ${x + b}`, `x = ${x + b} - ${b} = ${x}`]
    ok = () => a * (x + b) - c === d
  } else if (t === 1) {
    const q = int(rng, 2, 30)
    const b = int(rng, 2, 40)
    const c = int(rng, 2, 50)
    x = a * q + b
    eq = `(x - ${b}) : ${a} + ${c} = ${q + c}`
    steps = [`(x - ${b}) : ${a} = ${q + c} - ${c} = ${q}`, `x - ${b} = ${q} \\cdot ${a} = ${q * a}`, `x = ${q * a} + ${b} = ${x}`]
    ok = () => (x - b) / a + c === q + c
  } else if (t === 2) {
    const b = int(rng, 2, 30)
    const c = int(rng, 2, 60)
    x = b + int(rng, 1, 30)
    const d = a * (x - b) + c
    eq = `${a} \\cdot (x - ${b}) + ${c} = ${d}`
    steps = [`${a} \\cdot (x - ${b}) = ${d} - ${c} = ${d - c}`, `x - ${b} = ${d - c} : ${a} = ${x - b}`, `x = ${x - b} + ${b} = ${x}`]
    ok = () => a * (x - b) + c === d
  } else {
    const q = int(rng, 5, 40)
    const c = int(rng, 1, q - 1)
    const b = int(rng, 1, a * q - 1)
    x = a * q - b
    eq = `(x + ${b}) : ${a} - ${c} = ${q - c}`
    steps = [`(x + ${b}) : ${a} = ${q - c} + ${c} = ${q}`, `x + ${b} = ${q} \\cdot ${a} = ${q * a}`, `x = ${q * a} - ${b} = ${x}`]
    ok = () => (x + b) / a - c === q - c
  }
  return {
    text: `Rezolvați în mulțimea numerelor naturale ecuația $${eq}$.`,
    solution: lines('Aflăm pe rând, din exterior spre interior, termenul sau factorul care îl conține pe $x$:', ...steps.map(show)),
    verify: () => ok() && x > 0,
  }
}

/** x as a common factor: a·x + b·x = c, a·x − b·x + c = d, x + a·x + b·x = c. */
export function eqCommonFactor(rng: Rng): Made {
  const t = int(rng, 0, 2)
  const x = int(rng, 2, 40)
  const b = int(rng, 2, 9)
  const a = t === 1 ? b + int(rng, 2, 9) : int(rng, 2, 12)
  const c = int(rng, 2, 80)
  const [eq, steps, ok] = ([
    [`${a} \\cdot x + ${b} \\cdot x = ${(a + b) * x}`, `(${a} + ${b}) \\cdot x = ${(a + b) * x} \\Rightarrow ${a + b} \\cdot x = ${(a + b) * x} \\Rightarrow x = ${(a + b) * x} : ${a + b} = ${x}`, a * x + b * x === (a + b) * x],
    [`${a} \\cdot x - ${b} \\cdot x + ${c} = ${(a - b) * x + c}`, `(${a} - ${b}) \\cdot x = ${(a - b) * x + c} - ${c} \\Rightarrow ${a - b} \\cdot x = ${(a - b) * x} \\Rightarrow x = ${(a - b) * x} : ${a - b} = ${x}`, a - b >= 2],
    [`x + ${a} \\cdot x + ${b} \\cdot x = ${(1 + a + b) * x}`, `(1 + ${a} + ${b}) \\cdot x = ${(1 + a + b) * x} \\Rightarrow ${1 + a + b} \\cdot x = ${(1 + a + b) * x} \\Rightarrow x = ${(1 + a + b) * x} : ${1 + a + b} = ${x}`, true],
  ] as [string, string, boolean][])[t]
  return {
    text: `Aflați numărul natural $x$ pentru care $${eq}$.`,
    solution: lines('Dăm factor comun pe $x$:', show(steps)),
    verify: () => ok,
  }
}

/** "I thought of a number": four operations, undone backwards. */
export function eqThinkNumber(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 2, 40)
    if (rng() < 0.5) {
      const a = int(rng, 2, 9)
      const c = int(rng, 2, 9)
      const q = Math.ceil((a * x + 1) / c) + int(rng, 0, 5)
      const b = c * q - a * x
      if (q < 3) continue
      const d = int(rng, 1, q - 1)
      const e = q - d
      return {
        text: `M-am gândit la un număr natural. L-am înmulțit cu ${a}, am adunat ${b}, am împărțit rezultatul la ${c} și apoi am scăzut ${d}. Am obținut ${e}. La ce număr m-am gândit?`,
        solution: lines(
          'Mergem invers, de la rezultat spre început, și facem de fiecare dată operația opusă:',
          show(`${e} + ${d} = ${q}`),
          show(`${q} \\cdot ${c} = ${q * c}`),
          show(`${q * c} - ${b} = ${a * x}`),
          show(`${a * x} : ${a} = ${x}`),
          `M-am gândit la numărul ${x}. Verificare: $(${a} \\cdot ${x} + ${b}) : ${c} - ${d} = ${e}$.`,
        ),
        verify: () => (a * x + b) / c - d === e && b > 0,
      }
    }
    const a = int(rng, 2, 30)
    const b = int(rng, 2, 9)
    const d = int(rng, 2, 9)
    const P = (x + a) * b
    const e = Math.floor((P - 1) / d) - int(rng, 0, 3)
    if (e < 2) continue
    const c = P - d * e
    return {
      text: `M-am gândit la un număr natural. L-am mărit cu ${a}, am înmulțit rezultatul cu ${b}, am scăzut ${c} și apoi am împărțit la ${d}. Am obținut ${e}. La ce număr m-am gândit?`,
      solution: lines(
        'Mergem invers, de la rezultat spre început, și facem de fiecare dată operația opusă:',
        show(`${e} \\cdot ${d} = ${e * d}`),
        show(`${e * d} + ${c} = ${P}`),
        show(`${P} : ${b} = ${x + a}`),
        show(`${x + a} - ${a} = ${x}`),
        `M-am gândit la numărul ${x}. Verificare: $[(${x} + ${a}) \\cdot ${b} - ${c}] : ${d} = ${e}$.`,
      ),
      verify: () => ((x + a) * b - c) / d === e && c > 0,
    }
  }
}

/** Nested brackets, undone from the outside in. */
export function eqNested(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const e = int(rng, 2, 9)
      const t = int(rng, 2, 20)
      const d = int(rng, 1, 30)
      const x = e * t + d
      const c = int(rng, 1, 30)
      const b = int(rng, 2, 9)
      const a = int(rng, 1, 100)
      const f = a + b * (c + t)
      return {
        text: `Aflați numărul natural $x$ din egalitatea $${a} + ${b} \\cdot [${c} + (x - ${d}) : ${e}] = ${f}$.`,
        solution: lines(
          'Aflăm pe rând, din exterior spre interior, termenul sau factorul care îl conține pe $x$:',
          show(`${b} \\cdot [${c} + (x - ${d}) : ${e}] = ${f} - ${a} = ${f - a}`),
          show(`${c} + (x - ${d}) : ${e} = ${f - a} : ${b} = ${c + t}`),
          show(`(x - ${d}) : ${e} = ${c + t} - ${c} = ${t}`),
          show(`x - ${d} = ${t} \\cdot ${e} = ${t * e}`),
          show(`x = ${t * e} + ${d} = ${x}`),
        ),
        verify: () => a + b * (c + (x - d) / e) === f,
      }
    }
    const x = int(rng, 2, 40)
    const a = int(rng, 2, 30)
    const b = int(rng, 2, 9)
    const d = int(rng, 2, 9)
    const P = (x + a) * b
    const q = Math.floor((P - 1) / d) - int(rng, 0, 3)
    if (q < 2) continue
    const c = P - d * q
    const e = int(rng, 1, 30)
    const g = int(rng, 2, 9)
    const f = (q + e) * g
    return {
      text: `Aflați numărul natural $x$ din egalitatea $\\{[(x + ${a}) \\cdot ${b} - ${c}] : ${d} + ${e}\\} \\cdot ${g} = ${f}$.`,
      solution: lines(
        'Aflăm pe rând, din exterior spre interior, termenul sau factorul care îl conține pe $x$:',
        show(`[(x + ${a}) \\cdot ${b} - ${c}] : ${d} + ${e} = ${f} : ${g} = ${q + e}`),
        show(`[(x + ${a}) \\cdot ${b} - ${c}] : ${d} = ${q + e} - ${e} = ${q}`),
        show(`(x + ${a}) \\cdot ${b} - ${c} = ${q} \\cdot ${d} = ${q * d}`),
        show(`(x + ${a}) \\cdot ${b} = ${q * d} + ${c} = ${P}`),
        show(`x + ${a} = ${P} : ${b} = ${x + a}`),
        show(`x = ${x + a} - ${a} = ${x}`),
      ),
      verify: () => (((x + a) * b - c) / d + e) * g === f && c > 0,
    }
  }
}

/** b^(x+s) ± b^x = N: b^x as a common factor. */
export function eqPower(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 3, 5])
    const s = int(rng, 1, 3)
    const x = int(rng, 1, b === 2 ? 8 : b === 3 ? 5 : 3)
    const minus = rng() < 0.5
    const m = b ** s + (minus ? -1 : 1)
    if (m === 1) continue
    const N = b ** x * m
    const op = minus ? '-' : '+'
    const bs = s === 1 ? String(b) : `${b}^${s}`
    return {
      text: `Aflați numărul natural $x$ pentru care $${b}^{x + ${s}} ${op} ${b}^x = ${N}$.`,
      solution: lines(
        `Scriem $${b}^{x + ${s}} = ${b}^x \\cdot ${bs}$ și dăm factor comun $${b}^x$:`,
        show(`${b}^x \\cdot (${bs} ${op} 1) = ${N} \\Rightarrow ${b}^x \\cdot ${m} = ${N} \\Rightarrow ${b}^x = ${N} : ${m} = ${b ** x}`),
        `Cum $${b ** x} = ${b}^{${x}}$, obținem $x = ${x}$.`,
      ),
      verify: () => b ** (x + s) + (minus ? -1 : 1) * b ** x === N,
    }
  }
}

/** The sum of k consecutive (or consecutive even, or consecutive odd) numbers. */
export function eqConsecutive(rng: Rng): Made {
  const k = int(rng, 3, 5)
  const type = pick(rng, ['consecutive', 'pare consecutive', 'impare consecutive'] as const)
  const step = type === 'consecutive' ? 1 : 2
  const x = type === 'consecutive' ? int(rng, 5, 300) : 2 * int(rng, 3, 150) + (type === 'pare consecutive' ? 0 : 1)
  const off = (step * k * (k - 1)) / 2
  const S = k * x + off
  const terms = Array.from({ length: k }, (_, i) => (i === 0 ? 'x' : `(x + ${i * step})`))
  const nums = Array.from({ length: k }, (_, i) => x + i * step)
  return {
    text: `Suma a ${COUNT[k]} numere naturale ${type} este ${S}. Aflați numerele.`,
    solution: lines(
      `Notăm cu $x$ cel mai mic dintre numere. ${type === 'consecutive' ? 'Numerele consecutive cresc din 1 în 1' : `Numerele ${type} cresc din 2 în 2`}, deci celelalte sunt ${list(terms.slice(1).map((t) => `$${t.slice(1, -1)}$`))}:`,
      show(`${terms.join(' + ')} = ${S} \\Rightarrow ${k} \\cdot x + ${off} = ${S} \\Rightarrow ${k} \\cdot x = ${S - off} \\Rightarrow x = ${S - off} : ${k} = ${x}`),
      `Numerele sunt ${list(nums)}.`,
    ),
    verify: () => sum(nums) === S && nums.every((n) => (type === 'consecutive' ? true : n % 2 === (type === 'pare consecutive' ? 0 : 1))),
  }
}

// ================= word problems =================

const THINGS = [
  { n: 'lei', q: 'Câți lei', more: 'mai mult' },
  { n: 'timbre', q: 'Câte timbre', more: 'mai multe' },
  { n: 'cartonașe', q: 'Câte cartonașe', more: 'mai multe' },
  { n: 'abțibilduri', q: 'Câte abțibilduri', more: 'mai multe' },
]

/** The sum and the difference of two amounts. */
export function sumDifference(rng: Rng): Made {
  const c = pick(rng, THINGS)
  const A = pick(rng, GIRLS)
  const B = pick(rng, BOYS)
  const small = int(rng, 12, 150)
  const D = int(rng, 2, 80)
  const big = small + D
  const S = small + big
  return {
    text: `${A} și ${B} au împreună ${de(S)} ${c.n}. ${A} are cu ${de(D)} ${c.n} ${c.more} decât ${B}. ${c.q} are fiecare?`,
    solution: lines(
      'Dacă din sumă scădem diferența, obținem de două ori numărul mai mic:',
      show(`${S} - ${D} = ${S - D}, \\quad ${S - D} : 2 = ${small}`),
      show(`${small} + ${D} = ${big}`),
      `${B} are ${de(small)} ${c.n}, iar ${A} are ${de(big)} ${c.n}. Verificare: $${small} + ${big} = ${S}$.`,
    ),
    verify: () => small + big === S && big - small === D,
  }
}

const RATIOS: { text: (S: number, k: number) => string; answer: (small: number, big: number) => string }[] = [
  {
    text: (S, k) => `Într-o livadă sunt ${de(S)} pomi, meri și peri. Numărul merilor este de ${k} ori mai mare decât numărul perilor. Câți meri și câți peri sunt în livadă?`,
    answer: (s, b) => `În livadă sunt ${de(s)} peri și ${de(b)} meri.`,
  },
  {
    text: (S, k) => `Pe două rafturi sunt ${de(S)} cărți. Pe primul raft sunt de ${k} ori mai multe cărți decât pe al doilea. Câte cărți sunt pe fiecare raft?`,
    answer: (s, b) => `Pe al doilea raft sunt ${de(s)} cărți, iar pe primul ${de(b)} cărți.`,
  },
  {
    text: (S, k) => `Un penar și un ghiozdan costă împreună ${de(S)} lei. Ghiozdanul este de ${k} ori mai scump decât penarul. Cât costă fiecare?`,
    answer: (s, b) => `Penarul costă ${de(s)} lei, iar ghiozdanul ${de(b)} lei.`,
  },
  {
    text: (S, k) => `La un concurs participă ${de(S)} elevi. Numărul fetelor este de ${k} ori mai mare decât numărul băieților. Câte fete și câți băieți participă la concurs?`,
    answer: (s, b) => `La concurs participă ${de(s)} băieți și ${de(b)} fete.`,
  },
]

/** The sum of two amounts, one k times the other: equal parts. */
export function sumRatio(rng: Rng): Made {
  const c = pick(rng, RATIOS)
  const k = int(rng, 2, 6)
  const small = int(rng, 6, 48)
  const big = k * small
  const S = small + big
  return {
    text: c.text(S, k),
    solution: lines(
      `Reprezentăm mărimea mai mică printr-o parte. Cea mai mare are ${k} părți, deci în total sunt $${k} + 1 = ${k + 1}$ părți egale:`,
      show(`${S} : ${k + 1} = ${small}`),
      show(`${k} \\cdot ${small} = ${big}`),
      c.answer(small, big),
    ),
    verify: () => small + big === S && big === k * small,
  }
}

/** The difference of two numbers, one k times the other. */
export function differenceRatio(rng: Rng): Made {
  const k = int(rng, 3, 9)
  const small = int(rng, 4, 90)
  const big = k * small
  const D = big - small
  return {
    text: `Diferența a două numere naturale este ${D}, iar unul dintre ele este de ${k} ori mai mare decât celălalt. Aflați cele două numere.`,
    solution: lines(
      `Reprezentăm numărul mai mic printr-o parte; cel mai mare are ${k} părți. Diferența lor reprezintă $${k} - 1 = ${k - 1}$ ${k === 2 ? 'parte' : 'părți'}:`,
      show(`${D} : ${k - 1} = ${small}`),
      show(`${k} \\cdot ${small} = ${big}`),
      `Numerele sunt ${small} și ${big}.`,
    ),
    verify: () => big - small === D && big === k * small,
  }
}

/** Three numbers: the second is a more than the first, the third k times the first. */
export function threeNumbers(rng: Rng): Made {
  const x = int(rng, 3, 60)
  const a = int(rng, 2, 40)
  const k = int(rng, 2, 6)
  const S = (k + 2) * x + a
  return {
    text: `Suma a trei numere naturale este ${S}. Al doilea număr este cu ${a} mai mare decât primul, iar al treilea este de ${k} ori mai mare decât primul. Aflați numerele.`,
    solution: lines(
      `Reprezentăm primul număr printr-o parte. Al doilea este o parte și încă ${a}, iar al treilea are ${k} părți. În total sunt $1 + 1 + ${k} = ${k + 2}$ părți și încă ${a}:`,
      show(`${S} - ${a} = ${S - a}, \\quad ${S - a} : ${k + 2} = ${x}`),
      `Primul număr este ${x}, al doilea este $${x} + ${a} = ${x + a}$, iar al treilea este $${k} \\cdot ${x} = ${k * x}$.`,
      `Verificare: $${x} + ${x + a} + ${k * x} = ${S}$.`,
    ),
    verify: () => x + (x + a) + k * x === S,
  }
}

const HYPOTHESES: { text: (H: number, P: number, name: string) => string; s: number; b: number; suppose: string; parts: string; extra: string; bigN: string; smallN: string }[] = [
  {
    text: (H, P) => `Într-o curte sunt găini și iepuri, în total ${de(H)} capete și ${de(P)} picioare. Câte găini și câți iepuri sunt în curte?`,
    s: 2, b: 4, suppose: 'toate ar fi găini', parts: 'picioare', extra: 'fiecare iepure are cu 2 picioare mai mult decât o găină', bigN: 'iepuri', smallN: 'găini',
  },
  {
    text: (H, P) => `Într-o parcare sunt motociclete și mașini, în total ${de(H)} vehicule cu ${de(P)} roți. Câte motociclete și câte mașini sunt în parcare?`,
    s: 2, b: 4, suppose: 'toate vehiculele ar fi motociclete', parts: 'roți', extra: 'fiecare mașină are cu 2 roți mai mult decât o motocicletă', bigN: 'mașini', smallN: 'motociclete',
  },
  {
    text: (H, P) => `Un bloc are ${de(H)} apartamente, cu 2 sau cu 3 camere, în total ${de(P)} camere. Câte apartamente au 2 camere și câte au 3 camere?`,
    s: 2, b: 3, suppose: 'toate apartamentele ar avea 2 camere', parts: 'camere', extra: 'fiecare apartament cu 3 camere are cu o cameră mai mult', bigN: 'apartamente cu 3 camere', smallN: 'apartamente cu 2 camere',
  },
  {
    text: (H, P, name) => `${name} are ${de(H)} bancnote, de 5 lei și de 10 lei, în valoare totală de ${de(P)} lei. Câte bancnote de fiecare fel are ${name}?`,
    s: 5, b: 10, suppose: 'toate bancnotele ar fi de 5 lei', parts: 'lei', extra: 'fiecare bancnotă de 10 lei valorează cu 5 lei mai mult', bigN: 'bancnote de 10 lei', smallN: 'bancnote de 5 lei',
  },
]

/** The method of the false hypothesis, in its classic form: heads and legs. */
export function falseHypothesis(rng: Rng): Made {
  const c = pick(rng, HYPOTHESES)
  const name = pick(rng, [...GIRLS, ...BOYS])
  const x = int(rng, 3, 30)
  const y = int(rng, 3, 30)
  const H = x + y
  const P = c.s * x + c.b * y
  const diff = P - H * c.s
  return {
    text: c.text(H, P, name),
    solution: lines(
      `Presupunem că ${c.suppose}. Atunci am avea $${H} \\cdot ${c.s} = ${H * c.s}$ ${deW(H * c.s)}${c.parts}, cu $${P} - ${H * c.s} = ${diff}$ mai puțin decât în realitate.`,
      `Diferența apare pentru că ${c.extra}. Numărul de ${c.bigN} este:`,
      show(`${diff} : ${c.b - c.s} = ${y}`),
      `Numărul de ${c.smallN} este $${H} - ${y} = ${x}$.`,
      `Verificare: $${x} \\cdot ${c.s} + ${y} \\cdot ${c.b} = ${x * c.s} + ${y * c.b} = ${P}$.`,
    ),
    verify: () => x + y === H && c.s * x + c.b * y === P && diff / (c.b - c.s) === y,
  }
}

const SHOP = [
  [{ pl: 'caiete', one: 'un caiet' }, { pl: 'pixuri', one: 'un pix' }],
  [{ pl: 'creioane', one: 'un creion' }, { pl: 'radiere', one: 'o radieră' }],
  [{ pl: 'covrigi', one: 'un covrig' }, { pl: 'sucuri', one: 'un suc' }],
  [{ pl: 'înghețate', one: 'o înghețată' }, { pl: 'ciocolate', one: 'o ciocolată' }],
  [{ pl: 'stilouri', one: 'un stilou' }, { pl: 'blocuri de desen', one: 'un bloc de desen' }],
]

/** The method of comparison, with the same number of the first thing in both purchases. */
export function comparisonSame(rng: Rng): Made {
  const [A, B] = pick(rng, SHOP)
  const n = int(rng, 2, 8)
  const m1 = int(rng, 2, 6)
  const dm = int(rng, 2, 5)
  const m2 = m1 + dm
  const pa = int(rng, 2, 15)
  const pb = int(rng, 2, 15)
  const T1 = n * pa + m1 * pb
  const T2 = n * pa + m2 * pb
  return {
    text: `${n} ${A.pl} și ${m1} ${B.pl} costă ${de(T1)} lei, iar ${n} ${A.pl} și ${m2} ${B.pl} costă ${de(T2)} lei. Cât costă ${A.one} și cât costă ${B.one}?`,
    solution: lines(
      `Numărul de ${A.pl} este același, deci diferența de preț vine de la cele $${m2} - ${m1} = ${dm}$ ${B.pl} în plus:`,
      show(`${T2} - ${T1} = ${T2 - T1}, \\quad ${T2 - T1} : ${dm} = ${pb}`),
      `${cap(B.one)} costă ${de(pb)} lei. Cele ${m1} ${B.pl} costă $${m1} \\cdot ${pb} = ${m1 * pb}$ ${deW(m1 * pb)}lei, deci cele ${n} ${A.pl} costă $${T1} - ${m1 * pb} = ${n * pa}$ ${deW(n * pa)}lei:`,
      show(`${n * pa} : ${n} = ${pa}`),
      `${cap(A.one)} costă ${de(pa)} lei.`,
    ),
    verify: () => n * pa + m1 * pb === T1 && n * pa + m2 * pb === T2 && (T2 - T1) / (m2 - m1) === pb,
  }
}

const FRUIT = [['mere', 'pere'], ['roșii', 'castraveți'], ['cartofi', 'ceapă'], ['struguri', 'prune'], ['cireșe', 'căpșuni']]

/** The method of comparison, where the first purchase has to be multiplied first. */
export function comparisonScale(rng: Rng): Made {
  for (;;) {
    const [A, B] = pick(rng, FRUIT)
    const pa = int(rng, 2, 12)
    const pb = int(rng, 2, 12)
    const n1 = int(rng, 2, 5)
    const m1 = int(rng, 2, 6)
    const c = int(rng, 2, 3)
    const n2 = c * n1
    const m2 = int(rng, 1, c * m1 + 5)
    if (m2 === c * m1 || pa === pb) continue
    const T1 = n1 * pa + m1 * pb
    const T2 = n2 * pa + m2 * pb
    const more = c * m1 > m2
    const dk = Math.abs(c * m1 - m2)
    const dT = Math.abs(c * T1 - T2)
    return {
      text: `Pentru ${n1} kg de ${A} și ${m1} kg de ${B} s-au plătit ${de(T1)} lei, iar pentru ${n2} kg de ${A} și ${m2} kg de ${B} s-au plătit ${de(T2)} lei. Cât costă un kilogram de ${A} și cât costă un kilogram de ${B}?`,
      solution: lines(
        `Aducem cele două cumpărături la aceeași cantitate de ${A}. Dacă s-ar cumpăra de ${c} ori mai mult decât prima dată, adică $${c} \\cdot ${n1} = ${n2}$ kg de ${A} și $${c} \\cdot ${m1} = ${c * m1}$ kg de ${B}, s-ar plăti $${c} \\cdot ${T1} = ${c * T1}$ ${deW(c * T1)}lei.`,
        more
          ? `Față de a doua cumpărătură, ar fi cu $${c * m1} - ${m2} = ${dk}$ kg de ${B} mai mult și s-ar plăti cu $${c * T1} - ${T2} = ${dT}$ ${deW(dT)}lei mai mult:`
          : `A doua cumpărătură are cu $${m2} - ${c * m1} = ${dk}$ kg de ${B} mai mult și costă cu $${T2} - ${c * T1} = ${dT}$ ${deW(dT)}lei mai mult:`,
        show(`${dT} : ${dk} = ${pb}`),
        `Un kilogram de ${B} costă ${de(pb)} lei. Din prima cumpărătură, cele ${n1} kg de ${A} costă $${T1} - ${m1} \\cdot ${pb} = ${n1 * pa}$ ${deW(n1 * pa)}lei:`,
        show(`${n1 * pa} : ${n1} = ${pa}`),
        `Un kilogram de ${A} costă ${de(pa)} lei.`,
      ),
      verify: () => n1 * pa + m1 * pb === T1 && n2 * pa + m2 * pb === T2 && dT / dk === pb && (T1 - m1 * pb) / n1 === pa,
    }
  }
}

const SEATING: { p: [number, number]; a: [number, number]; b: [number, number]; seats: string; people: string; text: (p: number, a: number, b: number) => string; answer: (x: number, n: number) => string }[] = [
  {
    p: [2, 2], a: [2, 6], b: [2, 4], seats: 'bănci', people: 'elevi',
    text: (p, a, b) => `Dacă elevii unei clase se așază câte ${p} în bancă, rămân ${a} elevi în picioare. Dacă se așază câte ${p + 1} în bancă, rămân ${b} bănci libere. Câți elevi și câte bănci sunt în clasă?`,
    answer: (x, n) => `În clasă sunt ${de(x)} elevi și ${de(n)} bănci.`,
  },
  {
    p: [3, 6], a: [2, 9], b: [2, 6], seats: 'mese', people: 'copii',
    text: (p, a, b) => `Dacă toți copiii dintr-o tabără se așază câte ${p} la o masă, rămân ${a} copii fără loc. Dacă se așază câte ${p + 1} la o masă, rămân ${b} mese libere. Câți copii și câte mese sunt în tabără?`,
    answer: (x, n) => `În tabără sunt ${de(x)} copii și ${de(n)} mese.`,
  },
  {
    p: [2, 4], a: [2, 9], b: [2, 5], seats: 'camere', people: 'turiști',
    text: (p, a, b) => `Dacă turiștii dintr-un grup sunt cazați câte ${p} în cameră, rămân ${a} turiști fără loc. Dacă sunt cazați câte ${p + 1} în cameră, rămân ${b} camere libere. Câți turiști sunt în grup și câte camere are cabana?`,
    answer: (x, n) => `În grup sunt ${de(x)} turiști, iar cabana are ${de(n)} camere.`,
  },
  {
    p: [3, 5], a: [2, 9], b: [2, 5], seats: 'bărci', people: 'copii',
    text: (p, a, b) => `Dacă toți copiii dintr-un grup se urcă câte ${p} într-o barcă, rămân ${a} copii pe mal. Dacă se urcă câte ${p + 1} într-o barcă, rămân ${b} bărci goale. Câți copii și câte bărci sunt?`,
    answer: (x, n) => `Sunt ${de(x)} copii și ${de(n)} bărci.`,
  },
]

/** p on a bench leaves a pupils standing, p + 1 on a bench leaves b benches free. */
export function seatsProblem(rng: Rng): Made {
  const c = pick(rng, SEATING)
  const p = int(rng, c.p[0], c.p[1])
  const a = int(rng, c.a[0], c.a[1])
  const b = int(rng, c.b[0], c.b[1])
  const n = a + (p + 1) * b
  const x = p * n + a
  return {
    text: c.text(p, a, b),
    solution: lines(
      `Notăm cu $n$ numărul de ${c.seats}. Din prima situație, numărul de ${c.people} este $${p} \\cdot n + ${a}$.`,
      `În a doua situație sunt ocupate $n - ${b}$ ${c.seats}, deci numărul de ${c.people} este $${p + 1} \\cdot (n - ${b}) = ${p + 1} \\cdot n - ${(p + 1) * b}$.`,
      `Cele două numere sunt egale, iar $${p + 1} \\cdot n$ este cu $n$ mai mare decât $${p} \\cdot n$:`,
      show(`${p + 1} \\cdot n - ${(p + 1) * b} = ${p} \\cdot n + ${a} \\Rightarrow n = ${a} + ${(p + 1) * b} = ${n}`),
      show(`${p} \\cdot ${n} + ${a} = ${x}`),
      `${c.answer(x, n)} Verificare: $${p + 1} \\cdot (${n} - ${b}) = ${p + 1} \\cdot ${n - b} = ${x}$.`,
    ),
    verify: () => p * n + a === x && (p + 1) * (n - b) === x && n > b,
  }
}

/** A has k times as much as B; after A spends a and B receives b they have the same. */
export function equalAfter(rng: Rng): Made {
  for (;;) {
    const A = pick(rng, GIRLS)
    const B = pick(rng, BOYS)
    const k = int(rng, 3, 6)
    const x = int(rng, 8, 60)
    const total = (k - 1) * x
    const a = int(rng, 5, total - 5)
    const b = total - a
    return {
      text: `${A} are de ${k} ori mai mulți lei decât ${B}. După ce ${A} cheltuiește ${de(a)} lei, iar ${B} primește ${de(b)} lei, cei doi au sume egale. Câți lei avea fiecare la început?`,
      solution: lines(
        `Reprezentăm suma lui ${B} printr-o parte; ${A} are ${k} părți, adică ${k - 1} părți în plus.`,
        `Sumele devin egale după ce diferența dintre ele scade cu $${a} + ${b} = ${a + b}$ ${deW(a + b)}lei, deci cele ${k - 1} părți în plus înseamnă ${de(a + b)} lei:`,
        show(`${a + b} : ${k - 1} = ${x}`),
        `${B} avea ${de(x)} lei, iar ${A} avea $${k} \\cdot ${x} = ${k * x}$ ${deW(k * x)}lei.`,
        `Verificare: $${k * x} - ${a} = ${k * x - a}$ și $${x} + ${b} = ${x + b}$.`,
      ),
      verify: () => k * x - a === x + b && k * x - a > 0,
    }
  }
}

// ================= the arithmetic mean and units of measure =================

/** The arithmetic mean of three or four numbers. */
export function meanSimple(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 3, 4)
    const nums = Array.from({ length: n }, () => int(rng, 5, 99))
    const S = sum(nums)
    if (S % n !== 0 || new Set(nums).size < n) continue
    return {
      text: `Calculați media aritmetică a numerelor ${list(nums)}.`,
      solution: lines(
        'Media aritmetică este suma numerelor împărțită la numărul lor:',
        show(`m_a = (${nums.join(' + ')}) : ${n} = ${S} : ${n} = ${S / n}`),
      ),
      verify: () => Number.isInteger(S / n) && nums.reduce((s, t) => s + t, 0) / nums.length === S / n,
    }
  }
}

/** [from, to, how many of `to` in one `from`] */
const UNITS: [string, string, number][] = [
  ['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['dm', 'cm', 10], ['m', 'mm', 1000],
  ['kg', 'g', 1000], ['t', 'kg', 1000], ['l', 'ml', 1000], ['hl', 'l', 100], ['dal', 'l', 10],
]

/** Three changes of unit, to a smaller or to a larger one. */
export function unitsConvert(rng: Rng): Made {
  const chosen = shuffle(rng, UNITS).slice(0, 3)
  const items = chosen.map(([big, small, f]) => {
    if (rng() < 0.5) {
      // to the smaller unit: tenths of the larger one
      const t = int(rng, 11, 999)
      return { from: big, to: small, v: t / 10, r: (t * f) / 10, how: `${dec(t / 10)} \\cdot ${f}`, one: `1 \\text{ ${big}} = ${f} \\text{ ${small}}`, ok: Number.isInteger((t * f) / 10) }
    }
    const v = f === 10 ? int(rng, 12, 999) : 5 * int(rng, 3, 1999)
    return { from: small, to: big, v, r: v / f, how: `${v} : ${f}`, one: `1 \\text{ ${big}} = ${f} \\text{ ${small}}`, ok: Math.abs((v / f) * f - v) < 1e-9 }
  })
  return {
    text: `Transformați: ${items.map((it, i) => `${'abc'[i]}) $${dec(it.v)}$ ${it.from} în ${it.to}`).join('; ')}.`,
    solution: lines(...items.map((it, i) => `${'abc'[i]}) $${it.one}$, deci $${dec(it.v)} \\text{ ${it.from}} = ${it.how} \\text{ ${it.to}} = ${dec(it.r)} \\text{ ${it.to}}$.`)),
    verify: () => items.every((it) => it.ok && it.r > 0),
  }
}

/** Hours and minutes to minutes, minutes to hours and minutes, minutes and seconds to seconds. */
export function timeConvert(rng: Rng): Made {
  const h = int(rng, 2, 9)
  const m = int(rng, 5, 55)
  const q = int(rng, 2, 9)
  const r = int(rng, 1, 59)
  const T = 60 * q + r
  const mm = int(rng, 2, 30)
  const s = int(rng, 5, 55)
  return {
    text: `Transformați: a) ${h} h ${m} min în minute; b) ${T} min în ore și minute; c) ${mm} min ${s} s în secunde.`,
    solution: lines(
      `a) $1 \\text{ h} = 60 \\text{ min}$, deci $${h} \\text{ h } ${m} \\text{ min} = ${h} \\cdot 60 \\text{ min} + ${m} \\text{ min} = ${60 * h + m} \\text{ min}$.`,
      `b) $${T} : 60 = ${q} \\text{ rest } ${r}$, deci $${T} \\text{ min} = ${q} \\text{ h } ${r} \\text{ min}$.`,
      `c) $1 \\text{ min} = 60 \\text{ s}$, deci $${mm} \\text{ min } ${s} \\text{ s} = ${mm} \\cdot 60 \\text{ s} + ${s} \\text{ s} = ${60 * mm + s} \\text{ s}$.`,
    ),
    verify: () => Math.floor(T / 60) === q && T % 60 === r,
  }
}

/** The mean and all the numbers but one. */
export function meanMissing(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 3, 4)
    const m = int(rng, 12, 80)
    const known = Array.from({ length: n - 1 }, () => int(rng, 5, 99))
    const x = n * m - sum(known)
    if (x < 2 || new Set(known).size < n - 1) continue
    return {
      text: `Media aritmetică a ${COUNT[n]} numere naturale este ${m}. ${n === 3 ? 'Două' : 'Trei'} dintre ele sunt ${list(known)}. Aflați al ${n === 3 ? 'treilea' : 'patrulea'} număr.`,
      solution: lines(
        'Suma numerelor este media aritmetică înmulțită cu numărul lor:',
        show(`${m} \\cdot ${n} = ${m * n}`),
        'Scădem numerele cunoscute:',
        show(`${m * n} - ${known.join(' - ')} = ${x}`),
        `Verificare: $(${[...known, x].join(' + ')}) : ${n} = ${m * n} : ${n} = ${m}$.`,
      ),
      verify: () => (sum(known) + x) / n === m,
    }
  }
}

const ROUTES = [['București', 'Brașov'], ['Cluj-Napoca', 'Oradea'], ['Iași', 'Suceava'], ['Timișoara', 'Arad'], ['Constanța', 'București'], ['Craiova', 'Sibiu'], ['Galați', 'Bacău']]
const clock = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`
const hm = (h: number, m: number) => `${h} \\text{ h } ${m} \\text{ min}`

/** How long a journey takes, and the arrival after a late departure. */
export function timeInterval(rng: Rng): Made {
  for (;;) {
    const [from, to] = pick(rng, ROUTES)
    const what = pick(rng, ['Un tren', 'Un autocar'])
    const [h1, m1] = [int(rng, 5, 17), int(rng, 1, 59)]
    const [h2, m2] = [h1 + int(rng, 1, 4), int(rng, 1, 59)]
    const d = int(rng, 12, 55)
    const total = 60 * h2 + m2 - (60 * h1 + m1)
    const [dh, dm] = [Math.floor(total / 60), total % 60]
    const late = m2 + d
    if (dh < 1 || dm === 0 || late === 60) continue
    const borrow = m2 < m1
    const arrive = clock(h2 + Math.floor(late / 60), late % 60)
    return {
      text: lines(
        `${what} pleacă din ${from} la ora ${clock(h1, m1)} și ajunge la ${to} la ora ${clock(h2, m2)}.`,
        'a) Cât durează călătoria?',
        `b) La ce oră ar ajunge dacă ar pleca cu ${de(d)} minute mai târziu și ar merge la fel de mult?`,
      ),
      solution: lines(
        ...(borrow ? [`a) Nu putem scădea ${m1} min din ${m2} min, așa că transformăm o oră în 60 de minute: $${hm(h2, m2)} = ${hm(h2 - 1, m2 + 60)}$.`] : ['a) Scădem ora plecării din ora sosirii:']),
        show(`${hm(borrow ? h2 - 1 : h2, borrow ? m2 + 60 : m2)} - ${hm(h1, m1)} = ${hm(dh, dm)}`),
        late < 60
          ? `b) Ar ajunge cu ${de(d)} minute mai târziu: $${m2} + ${d} = ${late}$, deci la ora ${arrive}.`
          : `b) Ar ajunge cu ${de(d)} minute mai târziu: $${m2} \\text{ min} + ${d} \\text{ min} = ${late} \\text{ min} = ${hm(1, late - 60)}$, deci la ora ${arrive}.`,
      ),
      verify: () => 60 * h1 + m1 + 60 * dh + dm === 60 * h2 + m2 && arrive === clock(Math.floor((60 * h2 + m2 + d) / 60), (60 * h2 + m2 + d) % 60),
    }
  }
}

/** [the word for the unit of the result, its symbol, three units with how many thousandths of the result unit each is] */
const MIXED: { word: string; target: string; units: [string, number][] }[] = [
  { word: 'metri', target: 'm', units: [['km', 1000000], ['m', 1000], ['cm', 10]] },
  { word: 'kilograme', target: 'kg', units: [['t', 1000000], ['kg', 1000], ['g', 1]] },
  { word: 'litri', target: 'l', units: [['hl', 100000], ['l', 1000], ['ml', 1]] },
  { word: 'centimetri', target: 'cm', units: [['m', 100000], ['dm', 10000], ['mm', 100]] },
]

/** A sum of three quantities in different units, in one unit. */
export function unitsSum(rng: Rng): Made {
  const c = pick(rng, MIXED)
  // tenths of the largest unit, whole numbers of the middle one, and a round number of the smallest
  const v1 = int(rng, 11, 95) / 10
  const v2 = int(rng, 12, 900)
  const v3 = c.units[2][1] === 1 ? 50 * int(rng, 1, 39) : c.units[2][1] === 10 ? 10 * int(rng, 5, 95) : int(rng, 11, 99)
  const vs = [v1, v2, v3]
  const th = vs.map((v, i) => Math.round(v * c.units[i][1]))
  const total = sum(th)
  const term = (i: number) => `${dec(vs[i])} \\text{ ${c.units[i][0]}}`
  const change = (i: number) => {
    const f = c.units[i][1]
    return f > 1000 ? `${term(i)} = ${dec(vs[i])} \\cdot ${f / 1000} \\text{ ${c.target}} = ${dec(th[i] / 1000)} \\text{ ${c.target}}` : `${term(i)} = ${dec(vs[i])} : ${1000 / f} \\text{ ${c.target}} = ${dec(th[i] / 1000)} \\text{ ${c.target}}`
  }
  return {
    text: `Calculați și exprimați rezultatul în ${c.word}: $${[0, 1, 2].map(term).join(' + ')}$.`,
    solution: lines(
      `Transformăm toate mărimile în ${c.word}:`,
      ...[0, 1, 2].filter((i) => c.units[i][1] !== 1000).map((i) => show(change(i))),
      show(`${th.map((t) => dec(t / 1000)).join(' + ')} = ${dec(total / 1000)} \\text{ ${c.target}}`),
    ),
    verify: () => Math.abs(total / 1000 - (v1 * c.units[0][1] + v2 * c.units[1][1] + v3 * c.units[2][1]) / 1000) < 1e-6 && c.units[1][1] / 1000 >= 1,
  }
}

/** The mean of n numbers, then of n + 1: the number added. */
export function meanAdded(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 3, 9)
    const m1 = int(rng, 10, 80)
    const m2 = m1 + int(rng, -4, 6)
    const x = (n + 1) * m2 - n * m1
    if (m2 === m1 || x < 1) continue
    return {
      text: `Media aritmetică a ${n} numere naturale este ${m1}. Dacă li se adaugă încă un număr, media aritmetică a celor ${n + 1} numere devine ${m2}. Ce număr a fost adăugat?`,
      solution: lines(
        'Suma numerelor este media aritmetică înmulțită cu numărul lor.',
        `Suma celor ${n} numere de la început: $${n} \\cdot ${m1} = ${n * m1}$.`,
        `Suma celor ${n + 1} numere: $${n + 1} \\cdot ${m2} = ${(n + 1) * m2}$.`,
        `Numărul adăugat este diferența celor două sume: $${(n + 1) * m2} - ${n * m1} = ${x}$.`,
      ),
      verify: () => (n * m1 + x) / (n + 1) === m2,
    }
  }
}

/** The mean mark of a class of 20 or 25 at a test. */
export function meanGrades(rng: Rng): Made {
  for (;;) {
    const grades = shuffle(rng, [4, 5, 6, 7, 8, 9, 10]).slice(0, 4).sort((u, v) => u - v)
    const N = pick(rng, [20, 25])
    const counts = [int(rng, 2, 10), int(rng, 2, 10), int(rng, 2, 10)]
    counts.push(N - sum(counts))
    if (counts[3] < 2 || counts[3] > 10) continue
    const S = sum(grades.map((g, i) => g * counts[i]))
    return {
      text: `La un test, ${counts[0]} elevi au luat nota ${grades[0]}, ${counts[1]} elevi au luat nota ${grades[1]}, ${counts[2]} elevi au luat nota ${grades[2]}, iar ${counts[3]} elevi au luat nota ${grades[3]}. Calculați media clasei la acest test.`,
      solution: lines(
        'Media clasei este suma tuturor notelor împărțită la numărul elevilor.',
        'Suma notelor:',
        show(`${grades.map((g, i) => `${counts[i]} \\cdot ${g}`).join(' + ')} = ${grades.map((g, i) => counts[i] * g).join(' + ')} = ${S}`),
        'Numărul elevilor:',
        show(`${counts.join(' + ')} = ${N}`),
        'Media clasei:',
        show(`m_a = ${S} : ${N} = ${dec(S / N)}`),
      ),
      verify: () => {
        const all = grades.flatMap((g, i) => Array.from({ length: counts[i] }, () => g))
        return all.length === N && Math.abs(sum(all) / all.length - Number(dec(S / N).replace('{,}', '.'))) < 1e-9
      },
    }
  }
}

/** A van of T tonnes, loaded with sacks and crates: how many more crates fit. */
export function truckLoad(rng: Rng): Made {
  for (;;) {
    const T10 = int(rng, 12, 35)
    const cap = T10 * 100
    const a = pick(rng, [25, 40, 50])
    const n1 = int(rng, 10, 40)
    const b = pick(rng, [12, 15, 18, 24, 35, 45])
    const n2 = int(rng, 5, 30)
    const loaded = n1 * a + n2 * b
    const rest = cap - loaded
    if (rest < 2 * b || rest > 25 * b || rest % b === 0) continue
    const q = Math.floor(rest / b)
    const r = rest % b
    return {
      text: `O camionetă poate transporta cel mult $${dec(T10 / 10)}$ t. În ea s-au încărcat ${de(n1)} saci de câte ${a} kg și ${de(n2)} lăzi de câte ${b} kg. Câte lăzi de câte ${b} kg mai pot fi încărcate, cel mult?`,
      solution: lines(
        show(`${dec(T10 / 10)} \\text{ t} = ${dec(T10 / 10)} \\cdot 1000 \\text{ kg} = ${cap} \\text{ kg}`),
        show(`${n1} \\cdot ${a} + ${n2} \\cdot ${b} = ${n1 * a} + ${n2 * b} = ${loaded} \\text{ kg}`),
        show(`${cap} - ${loaded} = ${rest} \\text{ kg}, \\quad ${rest} : ${b} = ${q} \\text{ rest } ${r}`),
        `Mai pot fi încărcate cel mult ${de(q)} lăzi (ar mai rămâne loc doar pentru ${r} kg, prea puțin pentru încă o ladă).`,
      ),
      verify: () => loaded + q * b <= cap && loaded + (q + 1) * b > cap && q >= 2 && r === cap - loaded - q * b,
    }
  }
}

// ================= geometry: segments, angles, volumes =================

/** A, B, C on a line and the midpoint of BC. */
export function segmentMidpoint(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const b = 2 * int(rng, 2, 30)
  return {
    text: `Punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, cu $AB = ${a}$ cm și $BC = ${b}$ cm. Fie $M$ mijlocul segmentului $BC$. Calculați lungimile segmentelor $AC$ și $AM$.`,
    solution: lines(
      show(`AC = AB + BC = ${a} + ${b} = ${a + b} \\text{ cm}`),
      'Mijlocul împarte segmentul în două segmente de aceeași lungime:',
      show(`BM = BC : 2 = ${b} : 2 = ${b / 2} \\text{ cm}, \\quad AM = AB + BM = ${a} + ${b / 2} = ${a + b / 2} \\text{ cm}`),
    ),
    verify: () => Number.isInteger(b / 2) && a + b / 2 === (a + (a + b)) / 2,
  }
}

/** Two adjacent angles: the measure of their union and its kind. */
export function anglesAdjacent(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 12, 120)
    const b = int(rng, 12, 110)
    const s = a + b
    if (s >= 180) continue
    const kind = s < 90 ? 'ascuțit' : s === 90 ? 'drept' : 'obtuz'
    return {
      text: `Unghiurile $\\angle AOB$ și $\\angle BOC$ sunt adiacente, cu $\\angle AOB = ${a}^\\circ$ și $\\angle BOC = ${b}^\\circ$. Calculați măsura unghiului $\\angle AOC$ și precizați dacă acesta este ascuțit, drept sau obtuz.`,
      solution: lines(
        'Unghiurile adiacente au o latură comună și interioarele de o parte și de alta a ei, deci măsurile lor se adună:',
        show(`\\angle AOC = \\angle AOB + \\angle BOC = ${a}^\\circ + ${b}^\\circ = ${s}^\\circ`),
        s === 90 ? `Unghiul $AOC$ are $90^\\circ$, deci este drept.` : `Cum $${s}^\\circ ${s < 90 ? '<' : '>'} 90^\\circ$, unghiul $AOC$ este ${kind}.`,
      ),
      verify: () => s < 180 && (kind === 'ascuțit') === s < 90 && (kind === 'obtuz') === s > 90,
    }
  }
}

/** The volume of a cuboid and the sum of its edges. */
export function cuboidVolume(rng: Rng): Made {
  const u = pick(rng, ['cm', 'dm', 'm'])
  const [a, b, c] = [int(rng, 4, 20), int(rng, 2, 12), int(rng, 2, 10)]
  return {
    text: `Un paralelipiped dreptunghic are dimensiunile de ${a} ${u}, ${b} ${u} și ${c} ${u}. Calculați volumul paralelipipedului și suma lungimilor tuturor muchiilor sale.`,
    solution: lines(
      show(`V = L \\cdot l \\cdot h = ${a} \\cdot ${b} \\cdot ${c} = ${a * b * c} \\text{ ${u}}^3`),
      'Paralelipipedul are 12 muchii, câte 4 de fiecare lungime:',
      show(`4 \\cdot (${a} + ${b} + ${c}) = 4 \\cdot ${a + b + c} = ${4 * (a + b + c)} \\text{ ${u}}`),
    ),
    verify: () => a * b * c > 0 && 4 * a + 4 * b + 4 * c === 4 * (a + b + c),
  }
}

/** The midpoints of AB and BC: MN and AN. */
export function segmentTwoMidpoints(rng: Rng): Made {
  const a = int(rng, 3, 40)
  const b = int(rng, 3, 40)
  return {
    text: `Punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, $M$ este mijlocul segmentului $AB$, iar $N$ este mijlocul segmentului $BC$. Știind că $AB = ${a}$ cm și $BC = ${b}$ cm, calculați lungimile segmentelor $MN$ și $AN$.`,
    solution: lines(
      show(`MB = AB : 2 = ${a} : 2 = ${dec(a / 2)} \\text{ cm}, \\quad BN = BC : 2 = ${b} : 2 = ${dec(b / 2)} \\text{ cm}`),
      'Punctul $B$ este între $M$ și $N$, respectiv între $A$ și $N$:',
      show(`MN = MB + BN = ${dec(a / 2)} + ${dec(b / 2)} = ${dec((a + b) / 2)} \\text{ cm}`),
      show(`AN = AB + BN = ${a} + ${dec(b / 2)} = ${dec(a + b / 2)} \\text{ cm}`),
    ),
    verify: () => Math.abs((a + b / 2) - a / 2 - (a + b) / 2) < 1e-9,
  }
}

/** Four angles around a point, two of them equal. */
export function anglesAroundPoint(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 35, 150)
    const b = int(rng, 35, 150)
    const rest = 360 - a - b
    if (rest % 2 !== 0) continue
    const x = rest / 2
    return {
      text: `În jurul punctului $O$ sunt patru unghiuri: $\\angle AOB = ${a}^\\circ$, $\\angle BOC = ${b}^\\circ$, iar unghiurile $\\angle COD$ și $\\angle DOA$ au măsuri egale. Aflați măsura unghiului $\\angle COD$.`,
      solution: lines(
        'Suma măsurilor unghiurilor din jurul unui punct este $360^\\circ$:',
        show(`\\angle COD + \\angle DOA = 360^\\circ - ${a}^\\circ - ${b}^\\circ = ${rest}^\\circ`),
        show(`\\angle COD = \\angle DOA = ${rest}^\\circ : 2 = ${x}^\\circ`),
      ),
      verify: () => a + b + 2 * x === 360 && x < 180,
    }
  }
}

/** How many litres fit in a cuboid tank given in centimetres. */
export function tankLitres(rng: Rng): Made {
  const what = pick(rng, ['acvariu', 'vas', 'rezervor'])
  const L = 10 * int(rng, 3, 12)
  const l = 10 * int(rng, 2, 6)
  const h = 5 * int(rng, 4, 14)
  const V = ((L / 10) * (l / 10) * h) / 10
  return {
    text: `Un ${what} în formă de paralelipiped dreptunghic are lungimea de ${L} cm, lățimea de ${l} cm și înălțimea de ${h} cm. Câți litri de apă încap în ${what}?`,
    solution: lines(
      'Transformăm dimensiunile în decimetri, pentru că $1 \\text{ dm}^3 = 1 \\text{ l}$:',
      show(`${L} \\text{ cm} = ${L / 10} \\text{ dm}, \\quad ${l} \\text{ cm} = ${l / 10} \\text{ dm}, \\quad ${h} \\text{ cm} = ${dec(h / 10)} \\text{ dm}`),
      show(`V = ${L / 10} \\cdot ${l / 10} \\cdot ${dec(h / 10)} = ${dec(V)} \\text{ dm}^3 = ${dec(V)} \\text{ l}`),
    ),
    verify: () => Math.abs((L * l * h) / 1000 - V) < 1e-9,
  }
}

/** AB is k times BC and AC is known: AB, BC and the distance from B to the midpoint of AC. */
export function segmentRatio(rng: Rng): Made {
  const k = int(rng, 2, 5)
  const t = int(rng, 2, 30)
  const S = (k + 1) * t
  const AB = k * t
  return {
    text: `Punctele $A$, $B$ și $C$ sunt coliniare, în această ordine, $AC = ${S}$ cm, iar segmentul $AB$ este de ${k} ori mai lung decât segmentul $BC$. Calculați lungimile segmentelor $AB$ și $BC$, apoi distanța de la punctul $B$ la mijlocul $M$ al segmentului $AC$.`,
    solution: lines(
      `Reprezentăm segmentul $BC$ printr-o parte; atunci $AB$ are ${k} părți, iar $AC = AB + BC$ are ${k + 1} părți:`,
      show(`BC = ${S} : ${k + 1} = ${t} \\text{ cm}, \\quad AB = ${k} \\cdot ${t} = ${AB} \\text{ cm}`),
      show(`AM = AC : 2 = ${S} : 2 = ${dec(S / 2)} \\text{ cm}`),
      `Cum $AM < AB$, punctul $M$ este între $A$ și $B$:`,
      show(`BM = AB - AM = ${AB} - ${dec(S / 2)} = ${dec(AB - S / 2)} \\text{ cm}`),
    ),
    verify: () => AB + t === S && AB === k * t && S / 2 < AB && Math.abs(AB - S / 2 - ((k - 1) * t) / 2) < 1e-9,
  }
}

/** Three angles around a point, two of them given in degrees and minutes. */
export function anglesMinutes(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 70, 150), int(rng, 1, 59)]
    const [c, d] = [int(rng, 70, 150), int(rng, 1, 59)]
    const carry = b + d >= 60
    const X = a + c + (carry ? 1 : 0)
    const Y = (b + d) % 60
    const [R, r] = [359 - X, 60 - Y]
    if (Y === 0 || R < 30 || R > 178) continue
    const am = (deg: number, min: number) => `${deg}^\\circ ${min}'`
    return {
      text: `În jurul punctului $O$ sunt trei unghiuri: $\\angle AOB = ${am(a, b)}$, $\\angle BOC = ${am(c, d)}$ și $\\angle COA$. Aflați măsura unghiului $\\angle COA$.`,
      solution: lines(
        `Adunăm gradele cu gradele și minutele cu minutele${carry ? ", apoi transformăm 60 de minute într-un grad ($60' = 1^\\circ$)" : ''}:`,
        show(`${am(a, b)} + ${am(c, d)} = ${am(a + c, b + d)}${carry ? ` = ${am(X, Y)}` : ''}`),
        "Suma măsurilor unghiurilor din jurul unui punct este $360^\\circ$. Pentru scădere, scriem $360^\\circ = 359^\\circ 60'$:",
        show(`\\angle COA = 359^\\circ 60' - ${am(X, Y)} = ${am(R, r)}`),
      ),
      verify: () => 60 * a + b + 60 * c + d + 60 * R + r === 360 * 60 && r > 0 && r < 60,
    }
  }
}

/** Water poured into a cuboid vessel: how high it rises. */
export function waterLevel(rng: Rng): Made {
  for (;;) {
    const L = 10 * int(rng, 3, 12)
    const l = 10 * int(rng, 2, 8)
    const rise = int(rng, 2, 15)
    const h = int(rng, 5, 30)
    const tenths = (L / 10) * (l / 10) * rise
    if (tenths % 10 !== 0 || l > L) continue
    const V = tenths / 10
    return {
      text: `Un vas în formă de paralelipiped dreptunghic are baza un dreptunghi cu lungimea de ${L} cm și lățimea de ${l} cm. În vas se află apă până la înălțimea de ${h} cm. Mai turnăm ${de(V)} litri de apă, fără ca apa să dea pe dinafară. Până la ce înălțime ajunge apa?`,
      solution: lines(
        `Apa adăugată are volumul $${V} \\text{ l} = ${V} \\text{ dm}^3 = ${V * 1000} \\text{ cm}^3$ și formează în vas un paralelipiped dreptunghic cu aceeași bază:`,
        show(`\\mathcal{A}_b = ${L} \\cdot ${l} = ${L * l} \\text{ cm}^2`),
        'Împărțim volumul la aria bazei și aflăm cu cât crește nivelul apei:',
        show(`${V * 1000} : ${L * l} = ${rise} \\text{ cm}`),
        `Apa ajunge până la înălțimea de $${h} + ${rise} = ${h + rise}$ cm.`,
      ),
      verify: () => L * l * rise === V * 1000 && V >= 2,
    }
  }
}

// ================= the kinds =================

export const KINDS: GradeKind[] = [
  {
    id: 'v-division', label: 'Împărțirea cu rest', topic: 'Algebră',
    forms: { 1: [divQuotRem, divFindDividend, divLargestRemainder], 2: [divFindDivisor, divPacking, divWeekday], 3: [divSumAndQuotient, divCountThreeDigit, divQuotientMultiple] },
  },
  {
    id: 'v-divisibility', label: 'Divizibilitate: divizori, multipli, criterii, numere prime', topic: 'Algebră',
    forms: { 1: [divisorsList, multiplesBetween, divisibleWhich], 2: [divisibleDigit, primesAmong, commonDivisors], 3: [divisibleTwoDigits, powersDivisible, primesEquation] },
  },
  {
    id: 'v-equations', label: 'Ecuații și aflarea numărului necunoscut', topic: 'Algebră',
    forms: { 1: [eqOneStep, eqTwoStep, eqWordsNumber], 2: [eqParen, eqCommonFactor, eqThinkNumber], 3: [eqNested, eqPower, eqConsecutive] },
  },
  {
    id: 'v-problems', label: 'Probleme: metoda figurativă, falsa ipoteză, comparația', topic: 'Algebră',
    forms: { 1: [sumDifference, sumRatio, differenceRatio], 2: [threeNumbers, falseHypothesis, comparisonSame], 3: [comparisonScale, seatsProblem, equalAfter] },
  },
  {
    id: 'v-mean-units', label: 'Media aritmetică și unități de măsură', topic: 'Algebră',
    forms: { 1: [meanSimple, unitsConvert, timeConvert], 2: [meanMissing, timeInterval, unitsSum], 3: [meanAdded, meanGrades, truckLoad] },
  },
  {
    id: 'v-geometry', label: 'Segmente, unghiuri și volume', topic: 'Geometrie',
    forms: { 1: [segmentMidpoint, anglesAdjacent, cuboidVolume], 2: [segmentTwoMidpoints, anglesAroundPoint, tankLitres], 3: [segmentRatio, anglesMinutes, waterLevel] },
  },
]
