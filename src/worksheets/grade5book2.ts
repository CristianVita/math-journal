// Grade V exercises after "Matematică, clasa a V-a, partea I", Mate 2000+ Consolidare (Maria Zaharia, Dan Zaharia,
// Sorin Peligrad, Paralela 45), pages 44–82: equations and problems with addition and subtraction, multiplication and
// the common factor, exact division, the division theorem, the order of operations, powers and their comparison,
// perfect squares and the last digit. The book's sections "Înțelegere *", "Aplicare și exersare **" and
// "Aprofundare și performanță ***" / "Supermate ****" give levels 1, 2 and 3. Each form takes a seeded random source and
// returns the statement, the worked solution in Romanian and a check of its arithmetic.
import type { Made } from './generators'
import { de, int, pick, shuffle, type Rng } from './tex'

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
/** A whole number for a formula, with a thin space between the groups of three digits: 20\,347. */
const grp = (x: number | bigint): string => {
  const s = String(x)
  const neg = s.startsWith('-')
  const d = neg ? s.slice(1) : s
  if (d.length < 4) return s
  return (neg ? '-' : '') + d.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,')
}
/** A whole number in prose: as it is below 1000, otherwise as a formula with the digits grouped. */
const N = (x: number) => (Math.abs(x) < 1000 ? String(x) : `$${grp(x)}$`)
/** Like `de`, for a number in prose that may be large. */
const deN = (x: number) => {
  const r = Math.abs(x) % 100
  return (r === 0 && x !== 0) || r >= 20 ? `${N(x)} de` : N(x)
}
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const tri = (n: number) => (n * (n + 1)) / 2
const isSquare = (v: number) => v >= 0 && Number.isInteger(Math.sqrt(v))
const big = (b: number, e: number) => BigInt(b) ** BigInt(e)
/** The last digit of a^n, by repeated multiplication. */
const lastDigit = (a: number, n: number) => {
  let r = 1
  for (let i = 0; i < n; i++) r = (r * (a % 10)) % 10
  return r
}
/** The last digits of u, u², u³, … until they repeat. */
const cycleOf = (u: number) => {
  const c: number[] = []
  let x = u
  do {
    c.push(x)
    x = (x * u) % 10
  } while (x !== u && c.length < 5)
  return c
}
/** The last digit of a^m explained with the cycle of the last digits: [prose, digit]. */
function lastDigitSteps(a: number, m: number): [string, number] {
  const u = a % 10
  const c = cycleOf(u)
  const L = c.length
  const d = c[(m - 1) % L]
  if (L === 1) return [`Orice putere cu exponent nenul a unui număr terminat în ${u} se termină tot în ${u}: $U(${a}^{${grp(m)}}) = ${d}$.`, d]
  const rest = ((m - 1) % L) + 1
  return [
    `Ultimele cifre ale puterilor lui ${u} se repetă din ${L} în ${L}: ${c.join(', ')}. Cum $${grp(m)} = ${L} \\cdot ${grp((m - rest) / L)} + ${rest}$, avem $U(${a}^{${grp(m)}}) = U(${u}^{${rest}}) = ${d}$.`,
    d,
  ]
}
const KIDS: [string, string][] = [
  ['Mihaela', 'Mihaelei'], ['Ana', 'Anei'], ['Ioana', 'Ioanei'], ['Elena', 'Elenei'],
  ['Andrei', 'lui Andrei'], ['Mihai', 'lui Mihai'], ['Radu', 'lui Radu'], ['Matei', 'lui Matei'],
]
const NAMES = ['Mihai', 'Ana', 'Andrei', 'Ioana', 'Radu', 'Elena', 'Vlad', 'Maria']

// ================= 1. addition and subtraction: equations, inequalities, problems (pp. 44–50) =================

/** a ≤ x + b ≤ c, a ≤ x − b ≤ c, x + b < c: the natural numbers x (p. 44, ex. 5 and 10). */
export function ineqInterval(rng: Rng): Made {
  const t = int(rng, 0, 2)
  const b = int(rng, 3, 400)
  const cnt = int(rng, 2, 7)
  let tex: string
  let steps: string
  let lo: number
  let holds: (x: number) => boolean
  if (t === 0) {
    lo = int(rng, 1, 80)
    const a = lo + b
    const c = lo + cnt - 1 + b
    tex = `${a} \\le x + ${b} \\le ${c}`
    steps = `Scădem ${b} din fiecare membru: $${a} - ${b} \\le x \\le ${c} - ${b}$, adică $${lo} \\le x \\le ${lo + cnt - 1}$.`
    holds = (x) => a <= x + b && x + b <= c
  } else if (t === 1) {
    const a = int(rng, 0, 80)
    lo = a + b
    const c = a + cnt - 1
    tex = `${a} \\le x - ${b} \\le ${c}`
    steps = `Adunăm ${b} la fiecare membru: $${a} + ${b} \\le x \\le ${c} + ${b}$, adică $${lo} \\le x \\le ${lo + cnt - 1}$.`
    holds = (x) => x >= b && a <= x - b && x - b <= c
  } else {
    lo = 0
    const c = b + cnt
    tex = `x + ${b} < ${c}`
    steps = `Scădem ${b} din ambii membri: $x < ${c} - ${b}$, adică $x < ${cnt}$.`
    holds = (x) => x + b < c
  }
  const xs = Array.from({ length: cnt }, (_, i) => lo + i)
  return {
    text: `Determinați numerele naturale $x$ care verifică ${t === 2 ? 'inegalitatea' : 'inegalitățile'} $${tex}$.`,
    solution: lines(steps, show(`x \\in \\{${xs.join(', ')}\\}`)),
    verify: () => {
      const all: number[] = []
      for (let x = 0; x <= lo + cnt + b + 100; x++) if (holds(x)) all.push(x)
      return all.join() === xs.join()
    },
  }
}

/** a + b + c = S and b + c = T: three expressions (p. 47, Testul 2, V.1). */
export function exprSubstitution(rng: Rng): Made {
  const T = int(rng, 100, 600)
  const a = T + int(rng, 10, 900)
  const S = a + T
  const u = int(rng, 10, T - 10)
  const v = int(rng, 100, S - 50)
  return {
    text: lines(`Dacă $a + b + c = ${grp(S)}$ și $b + c = ${T}$, calculați:`, 'a) $a - (b + c)$;', `b) $b + c - ${u}$;`, `c) $a + b + c - ${grp(v)}$.`),
    solution: lines(
      `Din $a + (b + c) = ${grp(S)}$ aflăm $a = ${grp(S)} - ${T} = ${grp(a)}$.`,
      show(`\\text{a) } a - (b + c) = ${grp(a)} - ${T} = ${grp(a - T)}`),
      show(`\\text{b) } b + c - ${u} = ${T} - ${u} = ${T - u}`),
      show(`\\text{c) } a + b + c - ${grp(v)} = ${grp(S)} - ${grp(v)} = ${grp(S - v)}`),
    ),
    verify: () => a + T === S && a - T > 0 && T - u > 0 && S - v > 0,
  }
}

/** The sum against the difference, the minuend and the subtrahend (p. 46, Testul 1, V.1). */
export function termsQuestions(rng: Rng): Made {
  const p = int(rng, 150, 999)
  const q = int(rng, 20, p - 20)
  const s = int(rng, 300, 5000)
  const d = int(rng, 300, 5000)
  const m = int(rng, 1000, 9999)
  const e = int(rng, 100, m - 100)
  return {
    text: lines(
      `a) Cu cât este mai mare suma numerelor ${p} și ${q} decât diferența lor?`,
      `b) Aflați descăzutul, dacă scăzătorul este ${N(s)}, iar diferența este ${N(d)}.`,
      `c) Aflați scăzătorul, dacă descăzutul este ${N(m)}, iar diferența este ${N(e)}.`,
    ),
    solution: lines(
      show(`\\text{a) } (${p} + ${q}) - (${p} - ${q}) = ${grp(p + q)} - ${p - q} = ${2 * q}`),
      `Suma este mai mare decât diferența cu ${2 * q}, adică cu dublul numărului mai mic.`,
      `b) Descăzutul este suma dintre scăzător și diferență: $${grp(s)} + ${grp(d)} = ${grp(s + d)}$.`,
      `c) Scăzătorul este diferența dintre descăzut și diferență: $${grp(m)} - ${grp(e)} = ${grp(m - e)}$.`,
    ),
    verify: () => p + q - (p - q) === 2 * q && s + d - s === d && m - (m - e) === e && m - e > 0,
  }
}

/** a + b = P, b + c = Q, c + a = R (p. 44, ex. 13; p. 66, ex. 10). */
export function pairSums(rng: Rng): Made {
  const [a, b, c] = [int(rng, 5, 300), int(rng, 5, 300), int(rng, 5, 300)]
  const [P, Q, R] = [a + b, b + c, c + a]
  const T = a + b + c
  return {
    text: `Aflați numerele naturale $a$, $b$ și $c$ care verifică simultan egalitățile $a + b = ${P}$, $b + c = ${Q}$ și $c + a = ${R}$.`,
    solution: lines(
      'Adunăm membru cu membru cele trei egalități; fiecare număr apare de două ori:',
      show(`2 \\cdot (a + b + c) = ${P} + ${Q} + ${R} = ${grp(2 * T)} \\Rightarrow a + b + c = ${grp(2 * T)} : 2 = ${T}`),
      show(`c = ${T} - (a + b) = ${T} - ${P} = ${c}, \\quad a = ${T} - (b + c) = ${T} - ${Q} = ${a}, \\quad b = ${T} - (c + a) = ${T} - ${R} = ${b}`),
    ),
    verify: () => a + b === P && b + c === Q && c + a === R,
  }
}

/** At the child's birth the parent was M: the difference of ages stays the same (p. 47, Testul 1, V.2). */
export function ageProblem(rng: Rng): Made {
  for (;;) {
    const [name, gen] = pick(rng, KIDS)
    const mother = rng() < 0.5
    const M = int(rng, 22, 40)
    const k = int(rng, 3, 7)
    if (M % (k - 1) !== 0) continue
    const c = M / (k - 1)
    const t = int(rng, 3, 30)
    const A = M + t
    const B = int(rng, 3, 40)
    const [par, parN, parG] = mother ? ['mama sa', 'mama', 'mamei'] : ['tatăl său', 'tatăl', 'tatălui']
    return {
      text: lines(
        `La nașterea ${gen}, ${par} avea ${de(M)} ani.`,
        `a) Câți ani va avea ${name} când ${parN} va avea ${de(A)} ani?`,
        `b) Câți ani va avea ${parN} când ${name} va avea ${de(B)} ani?`,
        `c) Câți ani va avea ${name} când vârsta ${parG} va fi de ${k} ori mai mare decât vârsta ${gen}?`,
      ),
      solution: lines(
        `Diferența dintre vârsta ${parG} și vârsta ${gen} rămâne mereu aceeași: ${de(M)} ani.`,
        `a) $${A} - ${M} = ${t}$, deci ${name} va avea ${de(t)} ani.`,
        `b) $${B} + ${M} = ${B + M}$, deci ${parN} va avea ${de(B + M)} ani.`,
        `c) Notăm cu $v$ vârsta ${gen} atunci; ${parN} va avea $${k}v$ ani, iar diferența vârstelor este tot ${M}:`,
        show(`${k}v - v = ${M} \\Rightarrow ${k - 1}v = ${M} \\Rightarrow v = ${M} : ${k - 1} = ${c}`),
        `${name} va avea ${de(c)} ani, iar ${parN} $${k} \\cdot ${c} = ${k * c}$ de ani.`,
      ),
      verify: () => A - t === M && k * c - c === M && c >= 2,
    }
  }
}

/** Three numbers with the sum S; the same number taken from each leaves p, q, r (p. 45, ex. 27; p. 48, V.2 b). */
export function sameSubtracted(rng: Rng): Made {
  const x = int(rng, 5, 2500)
  const [p, q, r] = [int(rng, 10, 200), int(rng, 10, 200), int(rng, 10, 200)]
  const S = 3 * x + p + q + r
  return {
    text: `Suma a trei numere naturale este ${N(S)}. Dacă din fiecare dintre ele scădem același număr, obținem numerele ${p}, ${q} și, respectiv, ${r}. Aflați cele trei numere.`,
    solution: lines(
      `Notăm cu $x$ numărul scăzut. Numerele sunt $x + ${p}$, $x + ${q}$ și $x + ${r}$:`,
      show(`3x + ${p} + ${q} + ${r} = ${grp(S)} \\Rightarrow 3x = ${grp(S)} - ${p + q + r} = ${grp(3 * x)} \\Rightarrow x = ${grp(3 * x)} : 3 = ${grp(x)}`),
      `Numerele sunt ${list([x + p, x + q, x + r].map(N))}.`,
    ),
    verify: () => x + p + x + q + x + r === S,
  }
}

/** The difference D; the minuend and the subtrahend change (p. 45, ex. 24 a; p. 50, IV). */
export function differenceChange(rng: Rng): Made {
  for (;;) {
    const D = int(rng, 500, 4000)
    const su = pick(rng, [1, -1])
    const sv = pick(rng, [1, -1])
    const u = int(rng, 10, 400)
    const v = int(rng, 10, 400)
    const nd = D + su * u - sv * v
    if (nd <= 0) continue
    const w = int(rng, 10, 300)
    const e = int(rng, 10, 300)
    const verb = (s: number) => (s > 0 ? 'mărim' : 'micșorăm')
    const sg = (s: number) => (s > 0 ? '+' : '-')
    return {
      text: lines(
        `Diferența a două numere naturale este ${N(D)}.`,
        `a) Dacă ${verb(su)} descăzutul cu ${u} și ${verb(sv)} scăzătorul cu ${v}, cât devine diferența?`,
        `b) Cu cât trebuie mărit descăzutul, dacă mărim scăzătorul cu ${w}, pentru ca diferența să devină ${N(D + e)}?`,
      ),
      solution: lines(
        `Notăm descăzutul cu $a$ și scăzătorul cu $b$, deci $a - b = ${grp(D)}$.`,
        show(`\\text{a) } (a ${sg(su)} ${u}) - (b ${sg(sv)} ${v}) = a - b ${sg(su)} ${u} ${sg(-sv)} ${v} = ${grp(D)} ${sg(su)} ${u} ${sg(-sv)} ${v} = ${grp(nd)}`),
        `b) Mărim descăzutul cu $y$: $(a + y) - (b + ${w}) = a - b + y - ${w}$, deci`,
        show(`${grp(D)} + y - ${w} = ${grp(D + e)} \\Rightarrow y - ${w} = ${e} \\Rightarrow y = ${w + e}`),
        `Descăzutul trebuie mărit cu ${w + e}.`,
      ),
      verify: () => {
        const b = 1000
        const a = b + D
        return a + su * u - (b + sv * v) === nd && a + w + e - (b + w) === D + e
      },
    }
  }
}

/** ab + ba = 11s, or the sum of the numbers ab that are 9k more than ba (p. 44, ex. 14; p. 48, V.1 a; p. 70, V.2). */
export function reversedTwoDigit(rng: Rng): Made {
  if (rng() < 0.5) {
    const s = int(rng, 3, 17)
    const nums: number[] = []
    for (let a = 1; a <= 9; a++) if (s - a >= 1 && s - a <= 9) nums.push(10 * a + s - a)
    return {
      text: `Aflați numerele naturale de forma $\\overline{ab}$ pentru care $\\overline{ab} + \\overline{ba} = ${11 * s}$.`,
      solution: lines(
        'Scriem numerele în baza zece:',
        show(`\\overline{ab} + \\overline{ba} = 10a + b + 10b + a = 11a + 11b = 11 \\cdot (a + b)`),
        show(`11 \\cdot (a + b) = ${11 * s} \\Rightarrow a + b = ${11 * s} : 11 = ${s}`),
        `Cifrele $a$ și $b$ sunt nenule (fiecare este prima cifră a unui număr de două cifre), iar suma lor este ${s}:`,
        show(`\\overline{ab} \\in \\{${nums.join(', ')}\\}`),
      ),
      verify: () => {
        const all: number[] = []
        for (let n = 10; n <= 99; n++) if (n % 10 !== 0 && n + (n % 10) * 10 + Math.floor(n / 10) === 11 * s) all.push(n)
        return all.join() === nums.join()
      },
    }
  }
  const k = int(rng, 1, 7)
  const nums: number[] = []
  for (let b = 1; b + k <= 9; b++) nums.push(10 * (b + k) + b)
  const total = sum(nums)
  return {
    text: `Calculați suma tuturor numerelor naturale de forma $\\overline{ab}$ care sunt cu ${9 * k} mai mari decât $\\overline{ba}$.`,
    solution: lines(
      show(`\\overline{ab} - \\overline{ba} = 10a + b - 10b - a = 9a - 9b = 9 \\cdot (a - b)`),
      show(`9 \\cdot (a - b) = ${9 * k} \\Rightarrow a - b = ${k}`),
      'Cifra $b$ este nenulă, pentru că $\\overline{ba}$ are două cifre, deci numerele sunt:',
      show(`${nums.join(', ')}`),
      show(`${nums.join(' + ')} = ${total}`),
    ),
    verify: () => {
      let t = 0
      for (let n = 10; n <= 99; n++) if (n % 10 !== 0 && n - ((n % 10) * 10 + Math.floor(n / 10)) === 9 * k) t += n
      return t === total
    },
  }
}

/** a − b = D; the minuend less u and the subtrahend doubled (tripled) give E (p. 45, ex. 24 b). */
export function doubleSubtrahend(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3])
    const b = int(rng, 40, 900)
    const u = int(rng, 10, 400)
    const D = int(rng, 300, 3000)
    const E = D - u - (k - 1) * b
    if (E < 10) continue
    const a = b + D
    const kb = k === 2 ? 'b' : '2b'
    return {
      text: `Diferența a două numere naturale este ${N(D)}. Dacă micșorăm descăzutul cu ${u} și ${k === 2 ? 'dublăm' : 'triplăm'} scăzătorul, diferența devine ${N(E)}. Aflați cele două numere.`,
      solution: lines(
        `Notăm descăzutul cu $a$ și scăzătorul cu $b$; $a - b = ${grp(D)}$.`,
        show(`(a - ${u}) - ${k}b = (a - b) - ${u} - ${kb} = ${grp(D)} - ${u} - ${kb}`),
        show(`${grp(D)} - ${u} - ${kb} = ${grp(E)} \\Rightarrow ${kb} = ${grp(D)} - ${u} - ${grp(E)} = ${grp((k - 1) * b)}${k === 3 ? ` \\Rightarrow b = ${grp(2 * b)} : 2 = ${b}` : ''}`),
        show(`a = b + ${grp(D)} = ${b} + ${grp(D)} = ${grp(a)}`),
        `Numerele sunt ${N(a)} și ${b}.`,
      ),
      verify: () => a - b === D && a - u - k * b === E,
    }
  }
}

/** 1 + 3 + … + (2n − 1) + x = 2 + 4 + … + 2n and its relatives (p. 45, ex. 21). */
export function oddEvenSum(rng: Rng): Made {
  const n = int(rng, 10, 150)
  const t = int(rng, 0, 2)
  const odd = `1 + 3 + 5 + \\ldots + ${2 * n - 1}`
  const even = `2 + 4 + 6 + \\ldots + ${2 * n}`
  if (t < 2) {
    const eq = t === 0 ? `${odd} + x = ${even}` : `x + ${even} = 3 + 5 + 7 + \\ldots + ${2 * n + 1}`
    const pairs = t === 0 ? `(2 - 1) + (4 - 3) + \\ldots + (${2 * n} - ${2 * n - 1})` : `(3 - 2) + (5 - 4) + \\ldots + (${2 * n + 1} - ${2 * n})`
    return {
      text: `Aflați numărul natural $x$ care verifică egalitatea $${eq}$.`,
      solution: lines(
        `Ambele sume au câte ${de(n)} termeni. Îl aflăm pe $x$ scăzând suma din stânga fără $x$ din suma din dreapta, termen cu termen:`,
        show(`x = ${pairs} = \\underbrace{1 + 1 + \\ldots + 1}_{${n}} = ${n}`),
      ),
      verify: () => {
        let L = 0
        let R = 0
        for (let i = 1; i <= n; i++) {
          L += t === 0 ? 2 * i - 1 : 2 * i
          R += t === 0 ? 2 * i : 2 * i + 1
        }
        return L + n === R
      },
    }
  }
  const x = n * n + n * (n + 1)
  return {
    text: `Aflați numărul natural $x$ care verifică egalitatea $x - (${odd}) = ${even}$.`,
    solution: lines(
      `Calculăm cele două sume, fiecare cu ${n} termeni. Cu suma lui Gauss, $${even} = 2 \\cdot (1 + 2 + \\ldots + ${n}) = ${n} \\cdot ${n + 1} = ${grp(n * (n + 1))}$.`,
      show(`${odd} = (1 + 2 + 3 + \\ldots + ${2 * n}) - (${even}) = ${grp(n * (2 * n + 1))} - ${grp(n * (n + 1))} = ${grp(n * n)}`),
      show(`x = ${grp(n * n)} + ${grp(n * (n + 1))} = ${grp(x)}`),
    ),
    verify: () => {
      let o = 0
      let e = 0
      for (let i = 1; i <= n; i++) {
        o += 2 * i - 1
        e += 2 * i
      }
      return x - o === e
    },
  }
}

/** aaa + aa + a = 123a and its relatives (p. 44, ex. 16). */
export function repeatedDigit(rng: Rng): Made {
  const a = int(rng, 1, 9)
  const t = int(rng, 0, 2)
  const [eq, dec, k] = ([
    ['\\overline{aaa} + \\overline{aa} + a', '111a + 11a + a', 123],
    ['\\overline{aa} + \\overline{aaa} + \\overline{aaaa}', '11a + 111a + 1111a', 1233],
    ['\\overline{aaa} - \\overline{aa} - a', '111a - 11a - a', 99],
  ] as [string, string, number][])[t]
  const v = k * a
  return {
    text: `Aflați cifra $a$, știind că $${eq} = ${grp(v)}$.`,
    solution: lines(
      'Scriem numerele în baza zece: $\\overline{aa} = 11a$, $\\overline{aaa} = 111a$, $\\overline{aaaa} = 1111a$.',
      show(`${eq} = ${dec} = ${k}a`),
      show(`${k}a = ${grp(v)} \\Rightarrow a = ${grp(v)} : ${k} = ${a}`),
    ),
    verify: () => [111 * a + 11 * a + a, 11 * a + 111 * a + 1111 * a, 111 * a - 11 * a - a][t] === v,
  }
}

// ================= 2. multiplication: properties, the common factor (pp. 51–55) =================

/** a·b + a·c − a·d with a round bracket (p. 53, ex. 5 c–f; p. 65, ex. 4). */
export function commonFactorCalc(rng: Rng): Made {
  const t = int(rng, 0, 3)
  const a = int(rng, 11, 999)
  if (t === 3) {
    const k = int(rng, 2, 20)
    const c = int(rng, 100, 900)
    const b = c + k + 1
    return {
      text: `Calculați, folosind metoda factorului comun: $${a} \\cdot ${grp(b)} - ${a} \\cdot ${c} - ${a}$.`,
      solution: show(`${a} \\cdot ${grp(b)} - ${a} \\cdot ${c} - ${a} \\cdot 1 = ${a} \\cdot (${grp(b)} - ${c} - 1) = ${a} \\cdot ${k} = ${grp(a * k)}`),
      verify: () => a * b - a * c - a === a * k,
    }
  }
  const T = pick(rng, [100, 1000])
  let b: number
  let c: number
  let d = 0
  if (t === 0) {
    b = int(rng, 11, T - 11)
    c = T - b
  } else if (t === 1) {
    c = int(rng, 11, T === 100 ? 899 : 8999)
    b = c + T
  } else {
    d = int(rng, 11, 300)
    b = int(rng, 11, T + d - 11)
    c = T + d - b
  }
  const sign = t === 1 ? '-' : '+'
  const expr = `${a} \\cdot ${grp(b)} ${sign} ${a} \\cdot ${grp(c)}${t === 2 ? ` - ${a} \\cdot ${d}` : ''}`
  const inside = `${grp(b)} ${sign} ${grp(c)}${t === 2 ? ` - ${d}` : ''}`
  return {
    text: `Calculați, folosind metoda factorului comun: $${expr}$.`,
    solution: lines(`Dăm factor comun pe ${a}:`, show(`${expr} = ${a} \\cdot (${inside}) = ${a} \\cdot ${grp(T)} = ${grp(a * T)}`)),
    verify: () => (t === 0 ? a * b + a * c : t === 1 ? a * b - a * c : a * b + a * c - a * d) === a * T,
  }
}

/** 25·n·4, 8·n·125: grouping the factors (p. 53, ex. 5 a, b). */
export function smartProduct(rng: Rng): Made {
  const [p, q] = pick(rng, [[25, 4], [125, 8], [50, 2], [20, 5], [250, 4], [500, 2], [4, 25], [8, 125]] as [number, number][])
  const T = p * q
  const n = int(rng, 11, 9999)
  const order = int(rng, 0, 2)
  const expr = [`${p} \\cdot ${grp(n)} \\cdot ${q}`, `${grp(n)} \\cdot ${p} \\cdot ${q}`, `${p} \\cdot ${q} \\cdot ${grp(n)}`][order]
  return {
    text: `Folosind proprietățile înmulțirii, calculați cât mai simplu: $${expr}$.`,
    solution: lines(
      `Înmulțirea este comutativă și asociativă, deci putem grupa întâi factorii ${p} și ${q}:`,
      show(`${expr} = (${p} \\cdot ${q}) \\cdot ${grp(n)} = ${grp(T)} \\cdot ${grp(n)} = ${grp(T * n)}`),
    ),
    verify: () => p * n * q === T * n && (T === 100 || T === 1000),
  }
}

/** x + y = S, z = Z ⇒ xz + yz; ab + ac = N, b + c = S ⇒ a (p. 53, ex. 7–10). */
export function givenSumProduct(rng: Rng): Made {
  const t = int(rng, 0, 3)
  if (t <= 1) {
    const S = int(rng, 5, 99)
    const Z = int(rng, 3, 60)
    const plus = t === 0
    return {
      text: `Se știe că $x ${plus ? '+' : '-'} y = ${S}$ și $z = ${Z}$. Calculați $xz ${plus ? '+' : '-'} yz$.`,
      solution: lines(`Dăm factor comun pe $z$:`, show(`xz ${plus ? '+' : '-'} yz = z \\cdot (x ${plus ? '+' : '-'} y) = ${Z} \\cdot ${S} = ${grp(Z * S)}`)),
      verify: () => {
        const y = 7
        const x = plus ? S - y : S + y
        return plus ? x * Z + y * Z === Z * S || x < 0 : x * Z - y * Z === Z * S
      },
    }
  }
  if (t === 2) {
    const a = int(rng, 3, 60)
    const S = int(rng, 5, 40)
    return {
      text: `Se știe că $ab + ac = ${grp(a * S)}$ și $b + c = ${S}$. Aflați numărul $a$.`,
      solution: show(`ab + ac = a \\cdot (b + c) = a \\cdot ${S} = ${grp(a * S)} \\Rightarrow a = ${grp(a * S)} : ${S} = ${a}`),
      verify: () => (a * S) / S === a,
    }
  }
  const a = int(rng, 3, 30)
  const D = int(rng, 3, 60)
  return {
    text: `Se știe că $ab - ac = ${grp(a * D)}$ și $a = ${a}$. Aflați $b - c$.`,
    solution: show(`ab - ac = a \\cdot (b - c) = ${a} \\cdot (b - c) = ${grp(a * D)} \\Rightarrow b - c = ${grp(a * D)} : ${a} = ${D}`),
    verify: () => (a * D) / a === D,
  }
}

/** ab + ac + a = N, b + c = S (p. 53, ex. 11). */
export function withExtraA(rng: Rng): Made {
  const t = int(rng, 0, 2)
  const a = int(rng, 2, 60)
  const S = int(rng, 4, 40)
  const [given, rel, expr, k] = ([
    [`b + c = ${S}`, `ab + ac + a`, `a \\cdot (b + c) + a = a \\cdot ${S} + a = ${S + 1}a`, S + 1],
    [`b + c = ${S}`, `ab + ac - a`, `a \\cdot (b + c) - a = a \\cdot ${S} - a = ${S - 1}a`, S - 1],
    [`b - c = ${S}`, `ab - ac - a`, `a \\cdot (b - c) - a = a \\cdot ${S} - a = ${S - 1}a`, S - 1],
  ] as [string, string, string, number][])[t]
  const V = a * k
  return {
    text: `Se știe că $${rel} = ${grp(V)}$ și $${given}$. Aflați numărul $a$.`,
    solution: lines('Dăm factor comun pe $a$ în primii doi termeni:', show(`${rel} = ${expr}`), show(`${k}a = ${grp(V)} \\Rightarrow a = ${grp(V)} : ${k} = ${a}`)),
    verify: () => {
      const c = 3
      const b = t === 2 ? c + S : S - c
      const val = t === 0 ? a * b + a * c + a : t === 1 ? a * b + a * c - a : a * b - a * c - a
      return val === V || b < 0
    },
  }
}

/** a + 2b + c = P and 2a + b + 2c = Q: add them (p. 53, ex. 12 and 13). */
export function combinationSum(rng: Rng): Made {
  const [a, b, c] = [int(rng, 1, 40), int(rng, 1, 40), int(rng, 1, 40)]
  if (rng() < 0.5) {
    const P = a + 2 * b + c
    const Q = 2 * a + b + 2 * c
    return {
      text: `Se știe că $a + 2b + c = ${P}$ și $2a + b + 2c = ${Q}$. Aflați $a + b + c$.`,
      solution: lines(
        'Adunăm membru cu membru cele două egalități:',
        show(`3a + 3b + 3c = ${P} + ${Q} \\Rightarrow 3 \\cdot (a + b + c) = ${P + Q} \\Rightarrow a + b + c = ${P + Q} : 3 = ${a + b + c}`),
      ),
      verify: () => P + Q === 3 * (a + b + c),
    }
  }
  const S = a + b + c
  const Q = 2 * a + b + 2 * c
  const ac = a + c
  const r = ac * (3 * ac + 2 * b)
  return {
    text: `Dacă $a$, $b$, $c$ sunt numere naturale, $a + b + c = ${S}$ și $2a + b + 2c = ${Q}$, calculați $(a + c) \\cdot (3a + 2b + 3c)$.`,
    solution: lines(
      'Scădem prima egalitate din a doua:',
      show(`(2a + b + 2c) - (a + b + c) = ${Q} - ${S} \\Rightarrow a + c = ${ac}`),
      show(`b = (a + b + c) - (a + c) = ${S} - ${ac} = ${b}`),
      show(`(a + c) \\cdot (3a + 2b + 3c) = (a + c) \\cdot [3 \\cdot (a + c) + 2b] = ${ac} \\cdot (${3 * ac} + ${2 * b}) = ${ac} \\cdot ${3 * ac + 2 * b} = ${grp(r)}`),
    ),
    verify: () => (a + c) * (3 * a + 2 * b + 3 * c) === r,
  }
}

/** m + n = S, n − p = D ⇒ αm + (α + β)n − βp (p. 52, the worked problem; p. 55, ex. 31). */
export function linearCombination(rng: Rng): Made {
  const al = int(rng, 2, 9)
  const be = int(rng, 2, 9)
  if (rng() < 0.5) {
    const [m, n, p] = [int(rng, 3, 30), int(rng, 10, 30), int(rng, 1, 9)]
    const S = m + n
    const D = n - p
    const r = al * S + be * D
    return {
      text: `Se știe că $m + n = ${S}$ și $n - p = ${D}$. Calculați $${al}m + ${al + be}n - ${be}p$.`,
      solution: lines(
        `Despărțim $${al + be}n = ${al}n + ${be}n$ și dăm factor comun:`,
        show(`${al}m + ${al + be}n - ${be}p = ${al}m + ${al}n + ${be}n - ${be}p = ${al} \\cdot (m + n) + ${be} \\cdot (n - p) = ${al} \\cdot ${S} + ${be} \\cdot ${D} = ${r}`),
      ),
      verify: () => al * m + (al + be) * n - be * p === r,
    }
  }
  const [x, y, z] = [int(rng, 1, 20), int(rng, 1, 20), int(rng, 1, 20)]
  const S = x + y
  const T = y + 2 * z
  const r = al * S + be * T
  return {
    text: `Dacă $x + y = ${S}$ și $y + 2z = ${T}$, calculați $${al}x + ${al + be}y + ${2 * be}z$.`,
    solution: lines(
      `Despărțim $${al + be}y = ${al}y + ${be}y$ și dăm factor comun:`,
      show(`${al}x + ${al}y + ${be}y + ${2 * be}z = ${al} \\cdot (x + y) + ${be} \\cdot (y + 2z) = ${al} \\cdot ${S} + ${be} \\cdot ${T} = ${r}`),
    ),
    verify: () => al * x + (al + be) * y + 2 * be * z === r,
  }
}

/** x + 2x + … + nx = N (p. 55, ex. 29). */
export function arithmeticX(rng: Rng): Made {
  const n = int(rng, 10, 100)
  const x = int(rng, 2, 60)
  const T = tri(n)
  const V = x * T
  return {
    text: `Rezolvați ecuația $x + 2x + 3x + \\ldots + ${n}x = ${grp(V)}$.`,
    solution: lines(
      'Dăm factor comun pe $x$ și calculăm suma cu formula lui Gauss:',
      show(`x \\cdot (1 + 2 + 3 + \\ldots + ${n}) = ${grp(V)}, \\quad 1 + 2 + \\ldots + ${n} = ${n} \\cdot ${n + 1} : 2 = ${grp(T)}`),
      show(`${grp(T)} \\cdot x = ${grp(V)} \\Rightarrow x = ${grp(V)} : ${grp(T)} = ${x}`),
    ),
    verify: () => {
      let s = 0
      for (let i = 1; i <= n; i++) s += i * x
      return s === V
    },
  }
}

/** ab + a = N: a(b + 1) = N, all the pairs (p. 55, ex. 30). */
export function factorPairs(rng: Rng): Made {
  for (;;) {
    const V = int(rng, 6, 72)
    const divs = Array.from({ length: V }, (_, i) => i + 1).filter((d) => V % d === 0)
    if (divs.length < 4 || divs.length > 9) continue
    const t = int(rng, 0, 2)
    const [eq, fact] = ([
      ['ab + a', 'a \\cdot (b + 1)'],
      ['ab + b', 'b \\cdot (a + 1)'],
      ['ab + a + b + 1', '(a + 1) \\cdot (b + 1)'],
    ] as [string, string][])[t]
    const pairs: [number, number][] = divs
      .map((d): [number, number] => (t === 0 ? [d, V / d - 1] : t === 1 ? [V / d - 1, d] : [d - 1, V / d - 1]))
      .sort((p, q) => p[0] - q[0])
    const why = t === 0 ? '$a$ este un divizor al lui ' + V + ', iar $b + 1$ este celălalt factor' : t === 1 ? '$b$ este un divizor al lui ' + V + ', iar $a + 1$ este celălalt factor' : '$a + 1$ și $b + 1$ sunt doi divizori ai lui ' + V + ' cu produsul ' + V
    return {
      text: `Aflați numerele naturale $a$ și $b$ care verifică egalitatea $${eq} = ${V}$.`,
      solution: lines(
        'Dăm factor comun:',
        show(`${eq} = ${fact} = ${V}`),
        `Deci ${why}. Divizorii lui ${V} sunt $${divs.join(', ')}$:`,
        show(`(a, b) \\in \\{${pairs.map(([a, b]) => `(${a}, ${b})`).join(', ')}\\}`),
      ),
      verify: () => {
        const all: string[] = []
        for (let a = 0; a <= V; a++) for (let b = 0; b <= V; b++) if ([a * b + a, a * b + b, a * b + a + b + 1][t] === V) all.push(`${a},${b}`)
        return all.join(';') === pairs.map((p) => p.join(',')).join(';')
      },
    }
  }
}

/** a − kb = c, then x from x + ma − mkb = R (p. 54, ex. 28). */
export function hiddenRelation(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 9)
    const c = int(rng, 2, 30)
    const t = int(rng, 0, 2)
    const x = int(rng, 1, 200)
    let eq: string
    let steps: string[]
    let check: (a: number, b: number) => boolean
    if (t === 0) {
      const m = int(rng, 2, 9)
      const R = x + m * c
      check = (a, b) => x + m * a - m * k * b === R
      eq = `x + ${m}a - ${m * k}b = ${R}`
      steps = [`x + ${m} \\cdot (a - ${k}b) = ${R} \\Rightarrow x + ${m} \\cdot ${c} = ${R} \\Rightarrow x = ${R} - ${m * c} = ${x}`]
    } else if (t === 1) {
      const u = int(rng, 10, 150)
      const p = int(rng, 2, 9)
      const R = x - u + p * c
      if (R <= 0) continue
      check = (a, b) => x - u + p * a - p * k * b === R
      eq = `x - ${u} + ${p}a - ${p * k}b = ${R}`
      steps = [`x - ${u} + ${p} \\cdot (a - ${k}b) = ${R} \\Rightarrow x - ${u} + ${p * c} = ${R}`, `x = ${R} + ${u} - ${p * c} = ${x}`]
    } else {
      const q = int(rng, 2, 9)
      const r = int(rng, 2, 9)
      if (q === r) continue
      const V = int(rng, 1, 60)
      const W = x - q * c + r * c + V
      if (W < 2) continue
      check = (a, b) => W - x + q * a - q * k * b === r * a - r * k * b + V
      eq =`${W} - x + ${q}a - ${q * k}b = ${r}a - ${r * k}b + ${V}`
      steps = [
        `${W} - x + ${q} \\cdot (a - ${k}b) = ${r} \\cdot (a - ${k}b) + ${V} \\Rightarrow ${W} - x + ${q * c} = ${r * c + V}`,
        `x = ${W} + ${q * c} - ${r * c + V} = ${x}`,
      ]
    }
    return {
      text: `Dacă $a - ${k}b = ${c}$, aflați numărul natural $x$ din relația $${eq}$.`,
      solution: lines(`Grupăm termenii care îi conțin pe $a$ și $b$ și dăm factor comun, ca să apară $a - ${k}b = ${c}$:`, ...steps.map(show)),
      verify: () => x >= 1 && [0, 5, 12].every((b) => check(c + k * b, b)),
    }
  }
}

// ================= 3. exact division: properties and calculations (pp. 55–60) =================

/** Half, third and quarter; or N made p, q, r times smaller (p. 58, ex. 5 and 7). */
export function halfThirdQuarter(rng: Rng): Made {
  if (rng() < 0.5) {
    const N0 = 12 * int(rng, 10, 900)
    return {
      text: `Scrieți jumătatea, treimea și sfertul numărului ${N(N0)}.`,
      solution: show(`${grp(N0)} : 2 = ${grp(N0 / 2)}, \\quad ${grp(N0)} : 3 = ${grp(N0 / 3)}, \\quad ${grp(N0)} : 4 = ${grp(N0 / 4)}`),
      verify: () => N0 % 12 === 0,
    }
  }
  const [p, q, r] = shuffle(rng, [5, 6, 7, 8, 9]).slice(0, 3).sort((u, v) => u - v)
  const g = (u: number, v: number): number => (v === 0 ? u : g(v, u % v))
  const L = [p, q, r].reduce((u, v) => (u * v) / g(u, v))
  const N0 = L * int(rng, 2, Math.max(2, Math.floor(60000 / L)))
  return {
    text: `Micșorați numărul ${N(N0)} de ${p} ori, de ${q} ori și de ${r} ori.`,
    solution: lines('A micșora un număr de $k$ ori înseamnă a-l împărți la $k$:', show(`${grp(N0)} : ${p} = ${grp(N0 / p)}, \\quad ${grp(N0)} : ${q} = ${grp(N0 / q)}, \\quad ${grp(N0)} : ${r} = ${grp(N0 / r)}`)),
    verify: () => N0 % p === 0 && N0 % q === 0 && N0 % r === 0,
  }
}

/** How many pages (buses, rows) are needed: the quotient plus one for the remainder (p. 58, ex. 3). */
export function pagesNeeded(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 200, 2000)
    const k = int(rng, 12, 45)
    const q = Math.floor(n / k)
    const r = n % k
    if (r === 0) continue
    const t = int(rng, 0, 2)
    const name = pick(rng, NAMES)
    const [text, last] = ([
      [`${name} are o colecție de ${deN(n)} timbre și vrea să le așeze într-un clasor, câte ${k} pe fiecare pagină. De câte pagini are nevoie?`, `pe ultima pagină vor fi ${de(r)} timbre`],
      [`La o excursie merg ${deN(n)} elevi, cu autocare de câte ${de(k)} locuri. Câte autocare sunt necesare?`, `în ultimul autocar vor fi ${de(r)} elevi`],
      [`Într-o sală trebuie așezate ${deN(n)} scaune, în rânduri de câte ${k}. Câte rânduri se formează, dacă ultimul poate fi incomplet?`, `ultimul rând va avea ${de(r)} scaune`],
    ] as [string, string][])[t]
    return {
      text,
      solution: lines(
        show(`${grp(n)} = ${k} \\cdot ${q} + ${r}`),
        `Se completează ${de(q)} ${['pagini', 'autocare', 'rânduri'][t]}, iar pentru cele ${r} rămase mai trebuie ${t === 0 ? 'o pagină' : t === 1 ? 'un autocar' : 'un rând'}: $${q} + 1 = ${q + 1}$ (${last}).`,
      ),
      verify: () => Math.ceil(n / k) === q + 1 && k * q + r === n,
    }
  }
}

/** How many times the product is greater than the quotient (p. 59, ex. 17). */
export function timesBigger(rng: Rng): Made {
  for (;;) {
    const Q = int(rng, 2, 40)
    const k = int(rng, 2, 60)
    const P = k * Q
    const divs = Array.from({ length: P }, (_, i) => i + 1).filter((d) => P % d === 0 && d >= 4 && P / d >= 4)
    if (divs.length === 0) continue
    const a = pick(rng, divs)
    const b = P / a
    const d = int(rng, 3, 50)
    const c = Q * d
    const bigger = rng() < 0.5
    return {
      text: bigger
        ? `De câte ori este mai mare produsul numerelor ${a} și ${b} decât câtul numerelor ${N(c)} și ${d}?`
        : `De câte ori este mai mic câtul $${grp(c)} : ${d}$ decât produsul $${a} \\cdot ${b}$?`,
      solution: lines(
        show(`${a} \\cdot ${b} = ${grp(P)}, \\quad ${grp(c)} : ${d} = ${Q}`),
        show(`${grp(P)} : ${Q} = ${k}`),
        `${bigger ? 'Produsul este mai mare' : 'Câtul este mai mic'} de ${de(k)} ori.`,
      ),
      verify: () => (a * b) / (c / d) === k,
    }
  }
}

/** (1 + 2 + … + n) : m, x · (1 + … + n) = N, (1 + … + n) : x = m (p. 59, ex. 21 and 22). */
export function gaussDivision(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 10, 100)
    const T = tri(n)
    const t = int(rng, 0, 2)
    const S = `1 + 2 + 3 + \\ldots + ${n}`
    const gauss = `${S} = ${n} \\cdot ${n + 1} : 2 = ${grp(T)}`
    if (t === 1) {
      const x = int(rng, 2, 30)
      return {
        text: `Aflați numărul natural $x$, știind că $x \\cdot (${S}) = ${grp(x * T)}$.`,
        solution: lines('Calculăm suma cu formula lui Gauss:', show(gauss), show(`x \\cdot ${grp(T)} = ${grp(x * T)} \\Rightarrow x = ${grp(x * T)} : ${grp(T)} = ${x}`)),
        verify: () => (x * T) / T === x,
      }
    }
    const divs = Array.from({ length: T }, (_, i) => i + 1).filter((d) => T % d === 0 && d >= 3 && d <= T / 3)
    if (divs.length === 0) continue
    const m = pick(rng, divs)
    if (t === 0) {
      return {
        text: `Calculați: $(${S}) : ${m}$.`,
        solution: lines('Calculăm suma cu formula lui Gauss:', show(gauss), show(`${grp(T)} : ${m} = ${grp(T / m)}`)),
        verify: () => T % m === 0,
      }
    }
    return {
      text: `Aflați numărul natural $x$, știind că $(${S}) : x = ${grp(T / m)}$.`,
      solution: lines('Calculăm suma cu formula lui Gauss:', show(gauss), show(`${grp(T)} : x = ${grp(T / m)} \\Rightarrow x = ${grp(T)} : ${grp(T / m)} = ${m}`)),
      verify: () => T / (T / m) === m,
    }
  }
}

/** abab : ab = 101, aaa : a = 111, … without doing the division (p. 59, ex. 15, 20, 24). */
export function repDigits(rng: Rng): Made {
  const d = () => int(rng, 1, 9)
  const two = () => int(rng, 11, 99)
  const all: (() => [string, string, number])[] = [
    () => { const ab = two(); return [`${ab}${ab}`, String(ab), 101] },
    () => { const ab = two(); return [`${ab}${ab}${ab}`, String(ab), 10101] },
    () => { const a = d(); return [`${a}${a}${a}`, String(a), 111] },
    () => { const a = d(); return [`${a}${a}${a}${a}`, `${a}${a}`, 101] },
    () => { const abc = int(rng, 101, 999); return [`${abc}${abc}`, String(abc), 1001] },
  ]
  const chosen = shuffle(rng, [0, 1, 2, 3, 4]).slice(0, 3).sort((u, v) => u - v).map((i) => all[i]())
  return {
    text: `Calculați, fără a face împărțirea în scris: ${list(chosen.map(([a, b]) => `$${grp(Number(a))} : ${b}$`))}.`,
    solution: lines(
      'Scriem deîmpărțitul ca produs în care apare împărțitorul:',
      ...chosen.map(([a, b, k]) => show(`${grp(Number(a))} = ${b} \\cdot ${grp(k)} \\Rightarrow ${grp(Number(a))} : ${b} = ${grp(k)}`)),
    ),
    verify: () => chosen.every(([a, b, k]) => Number(a) === Number(b) * k),
  }
}

/** a + b = S and xa + xb + kx = N (p. 60, ex. 25). */
export function xTimesSum(rng: Rng): Made {
  const S = int(rng, 5, 40)
  const k = int(rng, 1, 9)
  const plus = rng() < 0.6
  const m = plus ? S + k : S - k
  if (m < 2) return xTimesSum(rng)
  const x = int(rng, 2, 60)
  const V = x * m
  const kx = k === 1 ? 'x' : `${k}x`
  return {
    text: `Calculați numărul $x$, știind că $a + b = ${S}$ și $x \\cdot a + x \\cdot b ${plus ? '+' : '-'} ${kx} = ${grp(V)}$.`,
    solution: lines(
      'Dăm factor comun pe $x$:',
      show(`x \\cdot (a + b) ${plus ? '+' : '-'} ${kx} = x \\cdot ${S} ${plus ? '+' : '-'} ${kx} = ${m}x`),
      show(`${m}x = ${grp(V)} \\Rightarrow x = ${grp(V)} : ${m} = ${x}`),
    ),
    verify: () => {
      const a = 2
      const b = S - a
      return x * a + x * b + (plus ? 1 : -1) * k * x === V
    },
  }
}

/** a·b = P, b·c = Q, a·c = R (p. 60, ex. 29). */
export function threeProducts(rng: Rng): Made {
  const [a, b, c] = [int(rng, 2, 25), int(rng, 2, 25), int(rng, 2, 25)]
  const [P, Q, R] = [a * b, b * c, a * c]
  const m = a * b * c
  return {
    text: `Aflați numerele naturale $a$, $b$, $c$, știind că $a \\cdot b = ${P}$, $b \\cdot c = ${Q}$ și $a \\cdot c = ${R}$.`,
    solution: lines(
      'Înmulțim membru cu membru cele trei egalități:',
      show(`(a \\cdot b) \\cdot (b \\cdot c) \\cdot (a \\cdot c) = (a \\cdot b \\cdot c) \\cdot (a \\cdot b \\cdot c) = ${P} \\cdot ${Q} \\cdot ${R} = ${grp(m * m)}`),
      `Numărul care înmulțit cu el însuși dă ${N(m * m)} este ${N(m)}, deci $a \\cdot b \\cdot c = ${grp(m)}$. Atunci:`,
      show(`a = ${grp(m)} : (b \\cdot c) = ${grp(m)} : ${Q} = ${a}, \\quad b = ${grp(m)} : ${R} = ${b}, \\quad c = ${grp(m)} : ${P} = ${c}`),
    ),
    verify: () => a * b === P && b * c === Q && a * c === R && m * m === P * Q * R,
  }
}

const TRI_PAIRS: [number, number][] = []
for (let n = 5; n <= 80; n++) for (let m = 3; m < n; m++) if (tri(n) % tri(m) === 0 && tri(n) / tri(m) >= 2) TRI_PAIRS.push([m, n])

/** (1 + … + n) : (1 + … + m) (p. 60, ex. 27 a). */
export function triangularRatio(rng: Rng): Made {
  const [m, n] = pick(rng, TRI_PAIRS)
  const [A, B] = [tri(n), tri(m)]
  return {
    text: `Calculați: $(1 + 2 + 3 + \\ldots + ${n}) : (1 + 2 + 3 + \\ldots + ${m})$.`,
    solution: lines(
      'Calculăm fiecare sumă cu formula lui Gauss, $1 + 2 + \\ldots + n = n \\cdot (n + 1) : 2$:',
      show(`1 + 2 + \\ldots + ${n} = ${n} \\cdot ${n + 1} : 2 = ${grp(A)}, \\quad 1 + 2 + \\ldots + ${m} = ${m} \\cdot ${m + 1} : 2 = ${B}`),
      show(`${grp(A)} : ${B} = ${A / B}`),
    ),
    verify: () => {
      let s = 0
      for (let i = 1; i <= n; i++) s += i
      let r = 0
      for (let i = 1; i <= m; i++) r += i
      return s / r === A / B && Number.isInteger(A / B)
    },
  }
}

/** ab6 + 3ab + b9a = 1173: the sum a + b (p. 55, ex. 33). */
export function digitsEquation(rng: Rng): Made {
  const s = int(rng, 2, 18)
  const d = int(rng, 0, 9)
  const e = int(rng, 1, 9)
  const f = int(rng, 0, 9)
  const K = d + 100 * e + 10 * f
  const V = 111 * s + K
  return {
    text: `Determinați suma cifrelor nenule $a$ și $b$, știind că $\\overline{ab${d}} + \\overline{${e}ab} + \\overline{b${f}a} = ${grp(V)}$.`,
    solution: lines(
      'Scriem numerele în baza zece și grupăm termenii:',
      show(`(100a + 10b + ${d}) + (${100 * e} + 10a + b) + (100b + ${10 * f} + a) = 111a + 111b + ${K}`),
      show(`111 \\cdot (a + b) + ${K} = ${grp(V)} \\Rightarrow 111 \\cdot (a + b) = ${grp(V - K)} \\Rightarrow a + b = ${grp(V - K)} : 111 = ${s}`),
    ),
    verify: () => {
      const a = Math.max(1, s - 9)
      const b = s - a
      return 100 * a + 10 * b + d + (100 * e + 10 * a + b) + (100 * b + 10 * f + a) === V && b >= 1 && b <= 9
    },
  }
}

// ================= 4. the division theorem (pp. 60–63, 68–72) =================

/** The remainder of pa + qb + c at m, with m dividing p and q (p. 63, ex. 19, 25). */
export function remainderExpression(rng: Rng): Made {
  if (rng() < 0.5) {
    const m = int(rng, 3, 9)
    const [i, j] = [int(rng, 2, 12), int(rng, 2, 12)]
    const [p, q] = [m * i, m * j]
    let c = int(rng, 10, 99)
    if (c % m === 0) c += 1
    const s = Math.floor(c / m)
    const r = c % m
    return {
      text: `Fie $a$ și $b$ numere naturale. Aflați restul împărțirii numărului $x = ${p}a + ${q}b + ${c}$ la ${m}.`,
      solution: lines(
        `Dăm factor comun pe ${m} și scriem $${c} = ${m} \\cdot ${s} + ${r}$:`,
        show(`x = ${m} \\cdot (${i}a + ${j}b) + ${m} \\cdot ${s} + ${r} = ${m} \\cdot (${i}a + ${j}b + ${s}) + ${r}`),
        `Cum $${r} < ${m}$, restul împărțirii lui $x$ la ${m} este ${r}.`,
      ),
      verify: () => [0, 1, 7].every((a) => (p * a + q * 3 + c) % m === r),
    }
  }
  const [K, ms] = pick(rng, [[70, [7, 10, 14]], [60, [6, 12, 15]], [84, [7, 12, 14]], [90, [9, 10, 18]], [42, [6, 7, 14]], [72, [8, 9, 12]]] as [number, number[]][])
  let c = int(rng, 20, 99)
  if (ms.some((m) => c % m === 0)) c += 1
  const rs = ms.map((m) => c % m)
  return {
    text: `Fie $a$ un număr natural. Aflați resturile împărțirii numărului $${K}a + ${c}$ la ${list(ms)}.`,
    solution: lines(
      `Numărul $${K}a$ se împarte exact la fiecare dintre numerele ${list(ms)}, deci restul este cel al lui ${c}:`,
      ...ms.map((m, i) => show(`${K}a + ${c} = ${m} \\cdot (${K / m}a + ${Math.floor(c / m)}) + ${rs[i]}, \\quad ${rs[i]} < ${m}`)),
      `Resturile sunt, în ordine, ${list(rs)}.`,
    ),
    verify: () => ms.every((m, i) => K % m === 0 && [0, 1, 5].every((a) => (K * a + c) % m === rs[i])),
  }
}

/** The numbers that divided by d give the quotient q; the sum of the possible remainders (p. 68, Testul 1, I). */
export function quotientClass(rng: Rng): Made {
  const d = int(rng, 3, 9)
  const q = int(rng, 2, 40)
  const nums = Array.from({ length: d }, (_, r) => d * q + r)
  const rs = Array.from({ length: d }, (_, r) => r)
  return {
    text: lines(`a) Scrieți toate numerele naturale care, împărțite la ${d}, dau câtul ${q}.`, `b) Calculați suma tuturor resturilor posibile la împărțirea unui număr natural la ${d}.`),
    solution: lines(
      `a) Numerele sunt de forma $${d} \\cdot ${q} + r$, cu $r < ${d}$, deci $r \\in \\{${rs.join(', ')}\\}$:`,
      show(`${nums.join(', ')}`),
      `b) Resturile posibile sunt $${rs.join(', ')}$, iar suma lor este $${rs.join(' + ')} = ${sum(rs)}$.`,
    ),
    verify: () => nums.every((n) => Math.floor(n / d) === q) && sum(rs) === (d * (d - 1)) / 2,
  }
}

/** The smallest and the largest number of three (four) digits with the remainder r at d (p. 63, ex. 13). */
export function extremesWithRemainder(rng: Rng): Made {
  const D = pick(rng, [3, 4])
  const d = int(rng, 11, 99)
  const r = int(rng, 1, d - 1)
  const lo = 10 ** (D - 1)
  const hi = 10 ** D - 1
  const c0 = Math.ceil((lo - r) / d)
  const c1 = Math.floor((hi - r) / d)
  const [small, large] = [d * c0 + r, d * c1 + r]
  const word = D === 3 ? 'trei' : 'patru'
  return {
    text: `Determinați cel mai mic și cel mai mare număr natural de ${word} cifre care, împărțite la ${d}, dau restul ${r}.`,
    solution: lines(
      `Numerele căutate sunt de forma $${d} \\cdot c + ${r}$, unde $c$ este câtul.`,
      `Cel mai mic este $${d} \\cdot ${c0} + ${r} = ${grp(small)}$; cel dinainte, $${d} \\cdot ${c0 - 1} + ${r} = ${grp(small - d)}$, are mai puțin de ${word} cifre.`,
      `Cel mai mare este $${d} \\cdot ${c1} + ${r} = ${grp(large)}$; următorul, $${d} \\cdot ${c1 + 1} + ${r} = ${grp(large + d)}$, are mai mult de ${word} cifre.`,
    ),
    verify: () => {
      let s = -1
      let l = -1
      for (let x = lo; x <= hi; x++) if (x % d === r) {
        if (s < 0) s = x
        l = x
      }
      return s === small && l === large
    },
  }
}

/** Remainder r1 at a and r2 at b, with b a multiple of a: possible or not (p. 62, example 2; p. 63, ex. 22). */
export function remaindersCompatible(rng: Rng): Made {
  const a = int(rng, 2, 6)
  const k = int(rng, 2, 5)
  const b = a * k
  const r2 = int(rng, 1, b - 1)
  const possible = rng() < 0.4
  let r1 = r2 % a
  if (!possible) {
    r1 = (r2 % a + int(rng, 1, a - 1)) % a
  }
  const t = Math.floor(r2 / a)
  const s = r2 % a
  return {
    text: `Stabiliți dacă există numere naturale care, împărțite la ${a}, dau restul ${r1}, iar împărțite la ${b}, dau restul ${r2}.`,
    solution: lines(
      `Un număr care dă restul ${r2} la împărțirea la ${b} este de forma $x = ${b}c + ${r2}$. Cum $${b} = ${a} \\cdot ${k}$ și $${r2} = ${a} \\cdot ${t} + ${s}$:`,
      show(`x = ${a} \\cdot ${k}c + ${a} \\cdot ${t} + ${s} = ${a} \\cdot (${k}c + ${t}) + ${s}`),
      possible
        ? `Deci $x$ dă restul ${s} la împărțirea la ${a}, exact cât se cere: astfel de numere există. Cel mai mic este ${r2}, apoi $${r2} + ${b} = ${r2 + b}$, $${r2 + 2 * b}$ și așa mai departe.`
        : `Deci orice astfel de număr dă restul ${s} la împărțirea la ${a}, nu restul ${r1}. Nu există numere cu proprietatea cerută.`,
    ),
    verify: () => {
      let found = false
      for (let x = 0; x < 10 * b; x++) if (x % a === r1 && x % b === r2) found = true
      return found === possible && r1 < a
    },
  }
}

/** d − r = P and q − b = k: the sum q + b (p. 71, II.4). */
export function dividendMinusRemainder(rng: Rng): Made {
  const b = int(rng, 2, 20)
  const k = int(rng, 2, 30)
  const q = b + k
  const P = b * q
  const pairs: [number, number][] = []
  for (let u = 1; u * u <= P; u++) if (P % u === 0) pairs.push([u, P / u])
  return {
    text: `Într-o împărțire de numere naturale, diferența dintre deîmpărțit și rest este ${P}, iar diferența dintre cât și împărțitor este ${k}. Aflați suma dintre cât și împărțitor.`,
    solution: lines(
      'Notăm deîmpărțitul cu $d$, împărțitorul cu $î$, câtul cu $c$ și restul cu $r$. Din teorema împărțirii cu rest, $d = î \\cdot c + r$, deci',
      show(`d - r = î \\cdot c = ${P}, \\quad c - î = ${k}`),
      `Căutăm doi factori ai lui ${P} care diferă prin ${k}:`,
      show(`${P} = ${pairs.map(([u, v]) => `${u} \\cdot ${v}`).join(' = ')}`),
      `Doar $${b} \\cdot ${q}$ are factorii la diferența ${k}, deci $î = ${b}$, $c = ${q}$ și $c + î = ${b + q}$.`,
    ),
    verify: () => pairs.filter(([u, v]) => v - u === k).length === 1 && b * q === P && q - b === k,
  }
}

/** Divided by a two-digit number, the quotient q and a remainder over 90 (p. 62, ex. 8). */
export function twoDigitDivisor(rng: Rng): Made {
  const q = int(rng, 10, 99)
  const r = int(rng, 94, 98)
  const bs = Array.from({ length: 99 - r }, (_, i) => r + 1 + i)
  const nums = bs.map((b) => b * q + r)
  return {
    text: `Aflați ${bs.length === 1 ? 'numărul natural care' : 'numerele naturale care'}, împărțit${bs.length === 1 ? '' : 'e'} la un număr natural de două cifre, ${bs.length === 1 ? 'dă' : 'dau'} câtul ${q} și restul ${r}.`,
    solution: lines(
      `Restul este mai mic decât împărțitorul, deci împărțitorul este mai mare decât ${r}; fiind de două cifre, el poate fi doar ${list(bs)}.`,
      ...bs.map((b, i) => show(`${b} \\cdot ${q} + ${r} = ${grp(nums[i])}`)),
      bs.length === 1 ? `Numărul este ${N(nums[0])}.` : `Numerele sunt ${list(nums.map(N))}.`,
    ),
    verify: () => nums.every((n, i) => Math.floor(n / bs[i]) === q && n % bs[i] === r) && bs.every((b) => b >= 10 && b <= 99),
  }
}

/** The sum of all the numbers that give the quotient q at d (p. 63, ex. 18). */
export function sumOfQuotientClass(rng: Rng): Made {
  const d = int(rng, 7, 40)
  const q = int(rng, 10, 300)
  const total = d * d * q + (d * (d - 1)) / 2
  return {
    text: `Calculați suma tuturor numerelor naturale care dau câtul ${q} la împărțirea prin ${d}.`,
    solution: lines(
      `Numerele sunt $${d} \\cdot ${q} + r$, cu restul $r \\in \\{0, 1, \\ldots, ${d - 1}\\}$, deci sunt ${de(d)} numere:`,
      show(`S = ${d} \\cdot ${grp(d * q)} + (0 + 1 + \\ldots + ${d - 1}) = ${grp(d * d * q)} + ${d - 1} \\cdot ${d} : 2 = ${grp(d * d * q)} + ${(d * (d - 1)) / 2} = ${grp(total)}`),
    ),
    verify: () => {
      let s = 0
      for (let r = 0; r < d; r++) s += d * q + r
      return s === total
    },
  }
}

/** The quotient is the square (cube) of the remainder (p. 63, ex. 23). */
export function quotientPowerRemainder(rng: Rng): Made {
  const p = rng() < 0.6 ? 2 : 3
  const d = p === 2 ? int(rng, 3, 9) : int(rng, 3, 6)
  const rs = Array.from({ length: d - 1 }, (_, i) => i + 1)
  const nums = rs.map((r) => d * r ** p + r)
  return {
    text: `Aflați toate numerele naturale nenule care, împărțite la ${d}, dau câtul egal cu ${p === 2 ? 'pătratul' : 'cubul'} restului.`,
    solution: lines(
      `Din teorema împărțirii cu rest, $n = ${d} \\cdot c + r$, cu $r < ${d}$ și $c = r^${p}$. Pentru $r = 0$ am obține $n = 0$, deci $r \\in \\{${rs.join(', ')}\\}$:`,
      show(rs.map((r, i) => `${d} \\cdot ${r ** p} + ${r} = ${nums[i]}`).join(', \\quad ')),
      show(`n \\in \\{${nums.join(', ')}\\}`),
    ),
    verify: () => {
      const all: number[] = []
      for (let n = 1; n <= d * d ** p + d; n++) if (Math.floor(n / d) === (n % d) ** p) all.push(n)
      return all.join() === nums.join()
    },
  }
}

/** The remainder of 1·2·…·n + c at m = u·v, with u, v ≤ n (p. 63, ex. 17). */
export function factorialRemainder(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 6, 12)
    const u = int(rng, 2, n - 1)
    const v = int(rng, u + 1, n)
    const m = u * v
    if (m < 15) continue
    const c = int(rng, m + 1, 400)
    const r = c % m
    if (r === 0) continue
    return {
      text: `Calculați restul împărțirii numărului $1 \\cdot 2 \\cdot 3 \\cdot \\ldots \\cdot ${n} + ${c}$ la ${m}.`,
      solution: lines(
        `Produsul $1 \\cdot 2 \\cdot \\ldots \\cdot ${n}$ îi conține pe ${u} și pe ${v}, deci se împarte exact la $${u} \\cdot ${v} = ${m}$: îl scriem $${m} \\cdot k$.`,
        show(`${c} = ${m} \\cdot ${Math.floor(c / m)} + ${r} \\Rightarrow ${m} \\cdot k + ${c} = ${m} \\cdot (k + ${Math.floor(c / m)}) + ${r}`),
        `Cum $${r} < ${m}$, restul este ${r}.`,
      ),
      verify: () => {
        let f = 1
        for (let i = 2; i <= n; i++) f = (f * i) % m
        return (f + c) % m === r
      },
    }
  }
}

const REVERSE_CASES: [number, number, number, number][] = (() => {
  const all: [number, number, number, number][] = []
  for (let n = 10; n <= 99; n++) {
    const x = Math.floor(n / 10)
    const y = n % 10
    if (y === 0 || x <= y) continue
    const rev = 10 * y + x
    const q = Math.floor(n / rev)
    const r = n % rev
    if (r === 0) continue
    all.push([n, x + y, q, r])
  }
  return all.filter(([, s, q, r]) => all.filter((o) => o[1] === s && o[2] === q && o[3] === r).length === 1)
})()

/** Digit sum s; divided by its reverse it gives the quotient q and the remainder r (p. 72, V; p. 68, V.2 c). */
export function reverseDivision(rng: Rng): Made {
  const [n, s, q, r] = pick(rng, REVERSE_CASES)
  const cands: number[] = []
  for (let x = 1; x <= 9; x++) {
    const y = s - x
    if (y >= 1 && y <= 9 && x > y) cands.push(10 * x + y)
  }
  const rev = (k: number) => (k % 10) * 10 + Math.floor(k / 10)
  return {
    text: `Suma cifrelor unui număr de două cifre este ${s}. Aflați numărul, știind că, împărțindu-l la răsturnatul său, se obține câtul ${q} și restul ${r}.`,
    solution: lines(
      `Câtul este cel puțin 1, deci numărul este mai mare decât răsturnatul său: prima cifră este mai mare decât a doua. Cum restul nu este 0, ultima cifră nu este 0 (răsturnatul are două cifre). Numerele cu suma cifrelor ${s} de acest fel sunt ${list(cands)}. Le împărțim la răsturnatul lor:`,
      ...cands.map((k) => show(`${k} = ${rev(k)} \\cdot ${Math.floor(k / rev(k))} + ${k % rev(k)}`)),
      `Câtul ${q} și restul ${r} se obțin doar pentru numărul ${n}.`,
    ),
    verify: () => cands.filter((k) => Math.floor(k / rev(k)) === q && k % rev(k) === r).join() === String(n),
  }
}

// ================= 5. the order of operations (pp. 64–67, 68–71) =================

/** (A + B) : d ± (C − E) : f with exact divisions (p. 66, ex. 8). */
export function twoQuotients(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 5, 25)
    const u = int(rng, 10, 90)
    const A = int(rng, 100, d * u - 50)
    const B = d * u - A
    const f = int(rng, 2, 9)
    const v = int(rng, 2, 60)
    const E = int(rng, 100, 900)
    const C = E + f * v
    const plus = rng() < 0.6
    if (B < 10 || (!plus && u <= v)) continue
    const res = plus ? u + v : u - v
    const op = plus ? '+' : '-'
    return {
      text: `Calculați: $(${A} + ${B}) : ${d} ${op} (${grp(C)} - ${E}) : ${f}$.`,
      solution: lines(
        'Întâi parantezele, apoi împărțirile, la final ' + (plus ? 'adunarea' : 'scăderea') + ':',
        show(`(${A} + ${B}) : ${d} ${op} (${grp(C)} - ${E}) : ${f} = ${grp(d * u)} : ${d} ${op} ${f * v} : ${f} = ${u} ${op} ${v} = ${res}`),
      ),
      verify: () => (A + B) / d + (plus ? 1 : -1) * ((C - E) / f) === res,
    }
  }
}

/** a = A, b + c = S: three expressions (p. 65, ex. 2; p. 66, ex. 9 a). */
export function substitutionABC(rng: Rng): Made {
  const A = int(rng, 5, 60)
  const S = int(rng, 10, 90)
  const [p, q] = [int(rng, 2, 9), int(rng, 2, 9)]
  const k = int(rng, 2, 9)
  return {
    text: lines(`Dacă $a = ${A}$ și $b + c = ${S}$, calculați:`, 'a) $a + b + c$;', `b) $${p} \\cdot a + ${q} \\cdot b + ${q} \\cdot c$;`, `c) $a \\cdot b + a \\cdot c + ${k} \\cdot b + ${k} \\cdot c$.`),
    solution: lines(
      show(`\\text{a) } a + b + c = a + (b + c) = ${A} + ${S} = ${A + S}`),
      show(`\\text{b) } ${p} \\cdot a + ${q} \\cdot (b + c) = ${p} \\cdot ${A} + ${q} \\cdot ${S} = ${p * A} + ${q * S} = ${p * A + q * S}`),
      show(`\\text{c) } a \\cdot (b + c) + ${k} \\cdot (b + c) = (b + c) \\cdot (a + ${k}) = ${S} \\cdot ${A + k} = ${grp(S * (A + k))}`),
    ),
    verify: () => {
      const b = 4
      const c = S - b
      return A * b + A * c + k * b + k * c === S * (A + k) && p * A + q * b + q * c === p * A + q * S
    },
  }
}

/** The largest (smallest) x with x + p·q < R (p. 71, I.3). */
export function extremeX(rng: Rng): Made {
  const t = int(rng, 0, 2)
  const p = int(rng, 2, 12)
  const q = int(rng, 11, 90)
  const R = p * q + int(rng, 5, 500)
  const P = p * q
  const [rel, ask, x, why] = ([
    [`x + ${p} \\cdot ${q} < ${R}`, 'cel mai mare', R - P - 1, `x + ${P} < ${R} \\Rightarrow x < ${R - P}`],
    [`x + ${p} \\cdot ${q} \\le ${R}`, 'cel mai mare', R - P, `x + ${P} \\le ${R} \\Rightarrow x \\le ${R - P}`],
    [`x - ${p} \\cdot ${q} > ${R}`, 'cel mai mic', R + P + 1, `x - ${P} > ${R} \\Rightarrow x > ${R + P}`],
  ] as [string, string, number, string][])[t]
  return {
    text: `Aflați ${ask} număr natural $x$ pentru care $${rel}$.`,
    solution: lines('Întâi înmulțirea:', show(why), `Deci ${ask} număr natural cu această proprietate este ${N(x)}.`),
    verify: () => {
      const ok = (y: number) => [y + P < R, y + P <= R, y - P > R][t]
      return ok(x) && !ok(t === 2 ? x - 1 : x + 1)
    },
  }
}

/** A + {B + [C : d + e·(f·g − h·i)]}, or {[p·u + Q : v] : w − z}·y, by stages (p. 64; p. 66, ex. 14). */
export function nestedChain(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const f = int(rng, 5, 40)
      const g = int(rng, 2, 15)
      const h = int(rng, 2, 12)
      const i = int(rng, 2, 40)
      if (h * i >= f * g) continue
      const inner = f * g - h * i
      const d = int(rng, 2, 15)
      const w = int(rng, 5, 60)
      const C = d * w
      const e = int(rng, 2, 9)
      const B = int(rng, 10, 999)
      const A = int(rng, 100, 9999)
      const sq = w + e * inner
      const br = B + sq
      const res = A + br
      return {
        text: `Calculați, respectând ordinea efectuării operațiilor: $${grp(A)} + \\{${B} + [${C} : ${d} + ${e} \\cdot (${f} \\cdot ${g} - ${h} \\cdot ${i})]\\}$.`,
        solution: lines(
          'Etapa I, paranteza rotundă:',
          show(`${f} \\cdot ${g} - ${h} \\cdot ${i} = ${f * g} - ${h * i} = ${inner}`),
          'Etapa a II-a, paranteza dreaptă:',
          show(`${C} : ${d} + ${e} \\cdot ${inner} = ${w} + ${grp(e * inner)} = ${grp(sq)}`),
          'Etapa a III-a, acolada, apoi adunarea finală:',
          show(`${grp(A)} + \\{${B} + ${grp(sq)}\\} = ${grp(A)} + ${grp(br)} = ${grp(res)}`),
        ),
        verify: () => A + (B + (C / d + e * (f * g - h * i))) === res,
      }
    }
    const p = int(rng, 3, 30)
    const u = int(rng, 2, 12)
    const v = int(rng, 2, 9)
    const w = int(rng, 2, 9)
    const s = Math.ceil((p * u + 1) / w) + int(rng, 0, 20)
    const t = w * s - p * u
    if (t < 1) continue
    const Q = t * v
    const z = int(rng, 1, s - 1)
    const y = int(rng, 2, 9)
    const res = (s - z) * y
    return {
      text: `Calculați, respectând ordinea efectuării operațiilor: $\\{[${p} \\cdot ${u} + ${grp(Q)} : ${v}] : ${w} - ${z}\\} \\cdot ${y}$.`,
      solution: lines(
        'Etapa I, paranteza dreaptă: întâi înmulțirea și împărțirea, apoi adunarea:',
        show(`${p} \\cdot ${u} + ${grp(Q)} : ${v} = ${p * u} + ${t} = ${p * u + t}`),
        'Etapa a II-a, acolada:',
        show(`${p * u + t} : ${w} - ${z} = ${s} - ${z} = ${s - z}`),
        'La final, înmulțirea:',
        show(`${s - z} \\cdot ${y} = ${res}`),
      ),
      verify: () => ((p * u + Q / v) / w - z) * y === res,
    }
  }
}

/** Is [a + b·(c − d·e)] : f − g·h = R true? (p. 66, ex. 12). */
export function trueOrFalse(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 2, 9)
    const e = int(rng, 2, 9)
    const c = d * e + int(rng, 1, 60)
    const b = int(rng, 2, 9)
    const f = int(rng, 2, 9)
    const in0 = b * (c - d * e)
    const s = Math.ceil((in0 + 1) / f) + int(rng, 0, 40)
    const a = f * s - in0
    const g = int(rng, 2, 9)
    if (s - 1 < g) continue
    const h = int(rng, 1, Math.floor((s - 1) / g))
    const val = s - g * h
    const right = rng() < 0.5
    const R = right ? val : val + pick(rng, [-3, -2, -1, 1, 2, 3, 10])
    if (R < 0) continue
    return {
      text: `Stabiliți dacă egalitatea $[${a} + ${b} \\cdot (${c} - ${d} \\cdot ${e})] : ${f} - ${g} \\cdot ${h} = ${R}$ este adevărată sau falsă.`,
      solution: lines(
        'Calculăm membrul stâng, respectând ordinea operațiilor:',
        show(`[${a} + ${b} \\cdot (${c} - ${d * e})] : ${f} - ${g * h} = [${a} + ${b} \\cdot ${c - d * e}] : ${f} - ${g * h} = ${a + in0} : ${f} - ${g * h} = ${s} - ${g * h} = ${val}`),
        right ? `Rezultatul este ${val}, deci egalitatea este adevărată.` : `Rezultatul este ${val}, nu ${R}, deci egalitatea este falsă.`,
      ),
      verify: () => ((a + b * (c - d * e)) / f - g * h === R) === right,
    }
  }
}

/** a = m·p + m·q and b = 2m·r + 2m·s (p. 66, ex. 13). */
export function compareFactored(rng: Rng): Made {
  const m = int(rng, 101, 999)
  const p = int(rng, 10, 99)
  const q = int(rng, 10, 99)
  const S = p + q
  let r: number
  let s: number
  if (S % 2 === 0 && rng() < 0.6) {
    r = int(rng, 1, S / 2 - 1)
    s = S / 2 - r
  } else {
    do {
      r = int(rng, 5, 60)
      s = int(rng, 5, 60)
    } while (2 * (r + s) === S)
  }
  const A = m * S
  const B = 2 * m * (r + s)
  const rel = A < B ? '<' : A > B ? '>' : '='
  return {
    text: `Comparați numerele $a$ și $b$, unde $a = ${m} \\cdot ${p} + ${m} \\cdot ${q}$ și $b = ${grp(2 * m)} \\cdot ${r} + ${grp(2 * m)} \\cdot ${s}$.`,
    solution: lines(
      'Dăm factor comun în fiecare număr:',
      show(`a = ${m} \\cdot (${p} + ${q}) = ${m} \\cdot ${S} = ${grp(A)}`),
      show(`b = ${grp(2 * m)} \\cdot (${r} + ${s}) = ${grp(2 * m)} \\cdot ${r + s} = ${grp(B)}`),
      `Deci $a ${rel} b$.`,
    ),
    verify: () => (m * p + m * q < 2 * m * r + 2 * m * s ? '<' : m * p + m * q > 2 * m * r + 2 * m * s ? '>' : '=') === rel,
  }
}

/** [P − (A − B·C + x) : (x + k) − 1] : Q = R for every x (p. 67, ex. 20). */
export function identityForAnyX(rng: Rng): Made {
  const k = int(rng, 1, 9)
  const B = int(rng, 10, 40)
  const C = int(rng, 10, 30)
  const A = B * C + k
  const R = int(rng, 2, 9)
  const Q = int(rng, 100, 500)
  const P = R * Q + 2
  return {
    text: `Arătați că, pentru orice număr natural $x$, are loc egalitatea $[${grp(P)} - (${A} - ${B} \\cdot ${C} + x) : (x + ${k}) - 1] : ${Q} = ${R}$.`,
    solution: lines(
      'Întâi paranteza rotundă: înmulțirea, apoi scăderea și adunarea:',
      show(`${A} - ${B} \\cdot ${C} + x = ${A} - ${B * C} + x = ${k} + x`),
      `Câtul $(x + ${k}) : (x + ${k})$ este 1, oricare ar fi $x$ (un număr nenul împărțit la el însuși). Atunci:`,
      show(`[${grp(P)} - 1 - 1] : ${Q} = ${grp(P - 2)} : ${Q} = ${R}`),
    ),
    verify: () => [0, 1, 7, 100].every((x) => (P - (A - B * C + x) / (x + k) - 1) / Q === R),
  }
}

/** E = pa − q(b + c) + M : d − e, when ua − vb = wb − ta + qc (p. 67, ex. 18). */
export function relationExpression(rng: Rng): Made {
  const u = int(rng, 2, 9)
  const t = int(rng, 1, 9)
  const v = int(rng, 1, 9)
  const w = int(rng, 1, 9)
  const p = u + t
  const q = v + w
  const d = int(rng, 2, 9)
  const s = int(rng, 10, 60)
  const M = d * s
  const e = int(rng, 1, s - 1)
  return {
    text: `Calculați $E = ${p}a - ${q}(b + c) + ${M} : ${d} - ${e}$, dacă $${u}a - ${v}b = ${w}b - ${t}a + ${q}c$.`,
    solution: lines(
      `Adunăm $${t}a + ${v}b$ în ambii membri ai relației:`,
      show(`${u}a + ${t}a = ${v}b + ${w}b + ${q}c \\Rightarrow ${p}a = ${q}b + ${q}c = ${q}(b + c)`),
      show(`E = ${q}(b + c) - ${q}(b + c) + ${M} : ${d} - ${e} = 0 + ${s} - ${e} = ${s - e}`),
    ),
    verify: () => {
      const b = 3 * p
      const c = 2 * p
      const a = (q * (b + c)) / p
      return u * a - v * b === w * b - t * a + q * c && p * a - q * (b + c) + M / d - e === s - e
    },
  }
}

/** n + n·(n + 1) − (n + 2)·(n − 1) and its relatives (p. 67, ex. 17). */
export function consecutiveTrick(rng: Rng): Made {
  const t = int(rng, 0, 2)
  if (t === 2) {
    const m = int(rng, 1001, 4999)
    const a = int(rng, 11, 89)
    const b = 100 - a
    const K = int(rng, 1000, 5000)
    const Nn = K + m
    return {
      text: `Calculați cât mai simplu: $${grp(m)} \\cdot ${a} + ${b} \\cdot (${grp(Nn)} - ${grp(K)})$.`,
      solution: show(`${grp(m)} \\cdot ${a} + ${b} \\cdot ${grp(m)} = ${grp(m)} \\cdot (${a} + ${b}) = ${grp(m)} \\cdot 100 = ${grp(m * 100)}`),
      verify: () => m * a + b * (Nn - K) === m * 100,
    }
  }
  const n = int(rng, 1001, 2999)
  if (t === 0) {
    const r = n + 2
    return {
      text: `Calculați cât mai simplu: $${grp(n)} + ${grp(n)} \\cdot ${grp(n + 1)} - ${grp(n + 2)} \\cdot ${grp(n - 1)}$.`,
      solution: lines(
        'Dăm factor comun de două ori:',
        show(`${grp(n)} \\cdot (1 + ${grp(n + 1)}) - ${grp(n + 2)} \\cdot ${grp(n - 1)} = ${grp(n)} \\cdot ${grp(n + 2)} - ${grp(n + 2)} \\cdot ${grp(n - 1)} = ${grp(n + 2)} \\cdot (${grp(n)} - ${grp(n - 1)}) = ${grp(n + 2)} \\cdot 1 = ${grp(r)}`),
      ),
      verify: () => n + n * (n + 1) - (n + 2) * (n - 1) === r,
    }
  }
  const r = (n + 1) * (n + 1)
  return {
    text: `Calculați cât mai simplu: $${grp(n)} + ${grp(n)} \\cdot ${grp(n)} + ${grp(n + 1)}$.`,
    solution: lines(
      'Dăm factor comun de două ori:',
      show(`${grp(n)} \\cdot (1 + ${grp(n)}) + ${grp(n + 1)} = ${grp(n)} \\cdot ${grp(n + 1)} + ${grp(n + 1)} = ${grp(n + 1)} \\cdot (${grp(n)} + 1) = ${grp(n + 1)} \\cdot ${grp(n + 1)} = ${grp(r)}`),
    ),
    verify: () => n + n * n + (n + 1) === r,
  }
}

// ================= 6. powers: rules and equations (pp. 74–76) =================

const SMALL_POW: Record<number, number[]> = { 2: [4, 8, 16, 32], 3: [9, 27, 81], 5: [25, 125, 625] }

/** 27·3·9·81·3⁰ as one power (p. 75, ex. 2). */
export function productToPower(rng: Rng): Made {
  const b = pick(rng, [2, 3, 5])
  const cnt = int(rng, 3, 4)
  const items: [string, number][] = []
  for (let i = 0; i < cnt; i++) {
    const t = int(rng, 0, 2)
    if (t === 0) {
      const k = int(rng, 2, 15)
      items.push([`${b}^{${k}}`, k])
    } else if (t === 1) {
      const v = pick(rng, SMALL_POW[b])
      items.push([String(v), Math.round(Math.log(v) / Math.log(b))])
    } else items.push([String(b), 1])
  }
  items.splice(int(rng, 0, items.length), 0, [`${b}^0`, 0])
  const E = sum(items.map((i) => i[1]))
  return {
    text: `Scrieți sub formă de putere numărul $${items.map((i) => i[0]).join(' \\cdot ')}$.`,
    solution: lines(
      `Scriem fiecare factor ca putere a lui ${b}, apoi adunăm exponenții:`,
      show(`${items.map((i) => `${b}^{${i[1]}}`).join(' \\cdot ')} = ${b}^{${items.map((i) => i[1]).join(' + ')}} = ${b}^{${E}}`),
    ),
    verify: () => items.reduce((p, [tex, k]) => p * (tex.includes('^') || tex === String(b) ? big(b, k) : BigInt(tex)), 1n) === big(b, E),
  }
}

/** Small powers with the order of operations (p. 75, ex. 3, 4). */
export function smallPowersCalc(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 0, 3)
    if (t === 0) {
      const [a, m, b, n] = [int(rng, 2, 9), int(rng, 2, 4), int(rng, 2, 9), int(rng, 2, 3)]
      const c = int(rng, 2, 99)
      if (a ** m <= b ** n || a ** m > 10000) continue
      const r = a ** m - b ** n + 1
      return {
        text: `Calculați: $${a}^${m} - ${b}^${n} + ${c}^0$.`,
        solution: lines('Întâi puterile (orice număr nenul la puterea zero este 1):', show(`${a}^${m} - ${b}^${n} + ${c}^0 = ${grp(a ** m)} - ${b ** n} + 1 = ${grp(r)}`)),
        verify: () => a ** m - b ** n + c ** 0 === r,
      }
    }
    if (t === 1) {
      const [a, b] = [int(rng, 2, 30), int(rng, 2, 30)]
      return {
        text: `Calculați $(${a} + ${b})^2$ și $${a}^2 + ${b}^2$. Sunt egale cele două rezultate?`,
        solution: lines(
          show(`(${a} + ${b})^2 = ${a + b}^2 = ${(a + b) ** 2}, \\quad ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}`),
          `Rezultatele nu sunt egale: primul este mai mare cu $${(a + b) ** 2 - a * a - b * b} = 2 \\cdot ${a} \\cdot ${b}$.`,
        ),
        verify: () => (a + b) ** 2 - a * a - b * b === 2 * a * b,
      }
    }
    if (t === 2) {
      const a = int(rng, 10, 25)
      const [b, c] = [int(rng, 2, a - 1), int(rng, 2, a - 1)]
      const r = a * a - b * b - c * c
      if (r <= 0) continue
      return {
        text: `Calculați: $${a}^2 - ${b}^2 - ${c}^2$.`,
        solution: show(`${a}^2 - ${b}^2 - ${c}^2 = ${a * a} - ${b * b} - ${c * c} = ${r}`),
        verify: () => a ** 2 - b ** 2 - c ** 2 === r,
      }
    }
    const [a, p, b, c, d] = [int(rng, 2, 5), int(rng, 2, 5), int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 99)]
    const r = a ** p + b * b * c
    return {
      text: `Calculați: $${a}^${p} + ${b}^2 \\cdot ${c} \\cdot ${d}^0$.`,
      solution: lines('Întâi puterile, apoi înmulțirile, la final adunarea:', show(`${a}^${p} + ${b}^2 \\cdot ${c} \\cdot ${d}^0 = ${a ** p} + ${b * b} \\cdot ${c} \\cdot 1 = ${a ** p} + ${b * b * c} = ${r}`)),
      verify: () => a ** p + b ** 2 * c * d ** 0 === r,
    }
  }
}

/** For x = a and y = b, check (x + y)² = x² + y² + 2xy and its relatives (p. 75, ex. 7; p. 76, ex. 8). */
export function identityCheck(rng: Rng): Made {
  const t = int(rng, 0, 3)
  const x = int(rng, 3, 20)
  const y = int(rng, 1, x - 1)
  const z = int(rng, 1, 15)
  if (t === 3) {
    const L = (x + y + z) ** 2
    return {
      text: `Pentru $x = ${x}$, $y = ${y}$ și $z = ${z}$, verificați egalitatea $(x + y + z)^2 = x^2 + y^2 + z^2 + 2xy + 2yz + 2zx$.`,
      solution: lines(
        show(`(x + y + z)^2 = ${x + y + z}^2 = ${L}`),
        show(`x^2 + y^2 + z^2 + 2xy + 2yz + 2zx = ${x * x} + ${y * y} + ${z * z} + ${2 * x * y} + ${2 * y * z} + ${2 * z * x} = ${L}`),
        'Cei doi membri sunt egali, deci egalitatea este adevărată.',
      ),
      verify: () => L === x * x + y * y + z * z + 2 * x * y + 2 * y * z + 2 * z * x,
    }
  }
  const [eq, left, right, v] = ([
    ['(x + y)^2 = x^2 + y^2 + 2xy', `(${x} + ${y})^2 = ${x + y}^2`, `${x * x} + ${y * y} + ${2 * x * y}`, (x + y) ** 2],
    ['(x - y)^2 = x^2 + y^2 - 2xy', `(${x} - ${y})^2 = ${x - y}^2`, `${x * x} + ${y * y} - ${2 * x * y}`, (x - y) ** 2],
    ['(x + y)(x - y) = x^2 - y^2', `(${x} + ${y}) \\cdot (${x} - ${y}) = ${x + y} \\cdot ${x - y}`, `${x * x} - ${y * y}`, (x + y) * (x - y)],
  ] as [string, string, string, number][])[t]
  return {
    text: `Pentru $x = ${x}$ și $y = ${y}$, verificați dacă egalitatea $${eq}$ este adevărată.`,
    solution: lines(show(`${left} = ${v}`), show(`${right} = ${v}`), 'Cei doi membri sunt egali, deci egalitatea este adevărată.'),
    verify: () => [x * x + y * y + 2 * x * y, x * x + y * y - 2 * x * y, x * x - y * y][t] === v,
  }
}

/** 2ˣ·4 = 32, 8ˣ·16 = 128 (p. 76, ex. 12). */
export function simpleExpEq(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 3, 5])
    const maxE = b === 2 ? 18 : b === 3 ? 11 : 7
    const t = int(rng, 0, 2)
    if (t === 0) {
      const e = int(rng, 3, maxE)
      return {
        text: `Aflați numărul natural $x$ știind că $${b}^x = ${grp(b ** e)}$.`,
        solution: lines(`Scriem ${N(b ** e)} ca putere a lui ${b}:`, show(`${b}^x = ${b}^{${e}} \\Rightarrow x = ${e}`)),
        verify: () => b ** e === Number(big(b, e)),
      }
    }
    if (t === 1) {
      const j = int(rng, 1, 3)
      const e = int(rng, j + 1, maxE)
      return {
        text: `Aflați numărul natural $x$ știind că $${b}^x \\cdot ${b ** j} = ${grp(b ** e)}$.`,
        solution: show(`${b}^x = ${grp(b ** e)} : ${b ** j} = ${grp(b ** (e - j))} = ${b}^{${e - j}} \\Rightarrow x = ${e - j}`),
        verify: () => b ** (e - j) * b ** j === b ** e,
      }
    }
    const k = int(rng, 2, 3)
    const j = int(rng, 1, 2)
    if (j === k) continue
    const x = int(rng, 1, 5)
    const E = k * x + j
    if (E > maxE) continue
    return {
      text: `Aflați numărul natural $x$ știind că $${b ** k}^x \\cdot ${b ** j} = ${grp(b ** E)}$.`,
      solution: lines(
        `Scriem toate numerele ca puteri ale lui ${b}:`,
        show(`(${b}^${k})^x \\cdot ${b}^${j} = ${b}^{${E}} \\Rightarrow ${b}^{${k}x + ${j}} = ${b}^{${E}} \\Rightarrow ${k}x + ${j} = ${E} \\Rightarrow ${k}x = ${E - j} \\Rightarrow x = ${x}`),
      ),
      verify: () => (b ** k) ** x * b ** j === b ** E,
    }
  }
}

const PRIMES = [2, 3, 5, 7]

/** (a^p·b^q)^m : (a^r·b^s)^n (p. 75, ex. 5). */
export function powerRulesCalc(rng: Rng): Made {
  for (;;) {
    const [a, b] = shuffle(rng, PRIMES).slice(0, 2).sort((u, v) => u - v)
    const m = int(rng, 2, 12)
    const n = int(rng, 2, 12)
    const r = int(rng, 1, 9)
    const s = int(rng, 1, 9)
    const p = Math.ceil((r * n) / m) + int(rng, 0, 3)
    const q = Math.ceil((s * n) / m) + int(rng, 0, 3)
    const X = p * m - r * n
    const Y = q * m - s * n
    if (X < 2 || Y < 2 || m === n) continue
    return {
      text: `Calculați, scriind rezultatul ca produs de puteri: $(${a}^{${p}} \\cdot ${b}^{${q}})^{${m}} : (${a}^{${r}} \\cdot ${b}^{${s}})^{${n}}$.`,
      solution: lines(
        'Ridicăm fiecare factor la putere (exponenții se înmulțesc), apoi împărțim puterile cu aceeași bază (exponenții se scad):',
        show(`${a}^{${p * m}} \\cdot ${b}^{${q * m}} : (${a}^{${r * n}} \\cdot ${b}^{${s * n}}) = ${a}^{${p * m} - ${r * n}} \\cdot ${b}^{${q * m} - ${s * n}} = ${a}^{${X}} \\cdot ${b}^{${Y}}`),
      ),
      verify: () => (big(a, p) * big(b, q)) ** BigInt(m) === (big(a, r) * big(b, s)) ** BigInt(n) * big(a, X) * big(b, Y),
    }
  }
}

/** Equations in the exponent: (4ˣ)² = 2⁸, (5²)^(x+3) = 5^(4x)·5², x : (2²·2³) = 4 (p. 76, ex. 18). */
export function expEquation(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 0, 3)
    const b = pick(rng, [2, 3, 5, 7])
    if (t === 0) {
      const j = int(rng, 1, 3)
      const k = int(rng, 2, 5)
      const x = int(rng, 1, 9)
      const c = b ** j
      if (c > 125) continue
      const E = j * k * x
      return {
        text: `Determinați numărul natural $x$ care verifică egalitatea $(${c}^x)^{${k}} = ${b}^{${E}}$.`,
        solution: lines(
          j === 1 ? 'Ridicăm puterea la putere: exponenții se înmulțesc.' : `Scriem $${c} = ${b}^${j}$; la puterea unei puteri exponenții se înmulțesc:`,
          show(`${b}^{${j === 1 ? '' : `${j} \\cdot `}${k}x} = ${b}^{${E}} \\Rightarrow ${j * k}x = ${E} \\Rightarrow x = ${E} : ${j * k} = ${x}`),
        ),
        verify: () => j * k * x === E,
      }
    }
    if (t === 1) {
      const u = int(rng, 2, 3)
      const k = u + int(rng, 1, 4)
      const x = int(rng, 1, 9)
      const s = int(rng, 1, 6)
      const tt = u * s - (k - u) * x
      if (tt < 0) continue
      return {
        text: `Determinați numărul natural $x$ care verifică egalitatea $(${b}^${u})^{x + ${s}} = ${b}^{${k}x} \\cdot ${b}^{${tt}}$.`,
        solution: lines(
          'Scriem fiecare membru ca o singură putere a lui ' + b + ' și egalăm exponenții:',
          show(`${b}^{${u}x + ${u * s}} = ${b}^{${k}x + ${tt}} \\Rightarrow ${u}x + ${u * s} = ${k}x + ${tt} \\Rightarrow ${u * s - tt} = ${k - u}x \\Rightarrow x = ${x}`),
        ),
        verify: () => u * (x + s) === k * x + tt,
      }
    }
    if (t === 2) {
      const m = int(rng, 2, 9)
      const x = int(rng, 1, 12)
      const p = int(rng, 1, m * x - 1)
      const q = m * x - p
      return {
        text: `Determinați numărul natural $x$ care verifică egalitatea $(${b}^x)^{${m}} = ${b}^{${p}} \\cdot ${b}^{${q}}$.`,
        solution: show(`${b}^{${m}x} = ${b}^{${p} + ${q}} = ${b}^{${m * x}} \\Rightarrow ${m}x = ${m * x} \\Rightarrow x = ${x}`),
        verify: () => m * x === p + q,
      }
    }
    const bb = pick(rng, [2, 3])
    const [p, q, r] = [int(rng, 1, 4), int(rng, 1, 4), int(rng, 1, 3)]
    const x = bb ** (p + q + r)
    if (x > 100000) continue
    return {
      text: `Determinați numărul natural $x$ care verifică egalitatea $x : (${bb}^${p} \\cdot ${bb}^${q}) = ${bb ** r}$.`,
      solution: lines(
        'Deîmpărțitul este produsul dintre împărțitor și cât:',
        show(`x = ${bb}^{${p + q}} \\cdot ${bb ** r} = ${bb}^{${p + q}} \\cdot ${bb}^{${r}} = ${bb}^{${p + q + r}} = ${grp(x)}`),
      ),
      verify: () => x / (bb ** p * bb ** q) === bb ** r,
    }
  }
}

/** 2ˣ + 2ʸ = 24 with x < y (p. 76, ex. 9, 10). */
export function twoPowersSum(rng: Rng): Made {
  const three = rng() < 0.3
  const b = three ? 2 : pick(rng, [2, 3])
  const maxE = b === 2 ? 11 : 7
  const exps = shuffle(rng, Array.from({ length: maxE + 1 }, (_, i) => i)).slice(0, three ? 3 : 2).sort((u, v) => u - v)
  const V = sum(exps.map((e) => b ** e))
  const vars = three ? ['x', 'y', 'z'] : ['x', 'y']
  const steps: string[] = []
  let rest = V
  for (let i = exps.length - 1; i >= 0; i--) {
    const e = exps[i]
    steps.push(`$${vars[i]} = ${e}$, pentru că $${b}^{${e}} = ${grp(b ** e)}$ este cea mai mare putere a lui ${b} care nu întrece ${N(rest)}${i > 0 ? `; rămâne $${grp(rest)} - ${grp(b ** e)} = ${grp(rest - b ** e)}$` : ''}`)
    rest -= b ** e
  }
  return {
    text: `Aflați numerele naturale ${three ? '$x < y < z$' : '$x < y$'} care verifică egalitatea $${vars.map((v) => `${b}^${v}`).join(' + ')} = ${grp(V)}$.`,
    solution: lines(
      `Cum exponenții sunt diferiți, suma puterilor mai mici decât $${b}^${vars[vars.length - 1]}$ este mai mică decât $${b}^${vars[vars.length - 1]}$ însuși${b === 2 ? '' : ' (chiar și dublată)'}, deci $${b}^${vars[vars.length - 1]}$ este cea mai mare putere a lui ${b} care nu întrece suma. Alegem pe rând:`,
      ...steps,
      show(`${exps.map((e) => `${b}^{${e}}`).join(' + ')} = ${exps.map((e) => grp(b ** e)).join(' + ')} = ${grp(V)}`),
    ),
    verify: () => {
      const sols: string[] = []
      const rec = (start: number, left: number, chosen: number[]) => {
        if (chosen.length === exps.length) {
          if (left === 0) sols.push(chosen.join())
          return
        }
        for (let e = start; b ** e <= left; e++) rec(e + 1, left - b ** e, [...chosen, e])
      }
      rec(0, V, [])
      return sols.length === 1 && sols[0] === exps.join()
    },
  }
}

/** 1 + a + … + aⁿ by S·a − S (p. 75, example; p. 76, ex. 13, 14). */
export function geometricSum(rng: Rng): Made {
  const t = int(rng, 0, 3)
  const n = int(rng, 10, 200)
  if (t === 0) {
    return {
      text: `Arătați că $1 + 2 + 2^2 + 2^3 + \\ldots + 2^{${n}} < 2^{${n + 1}}$.`,
      solution: lines(
        `Fie $S = 1 + 2 + 2^2 + \\ldots + 2^{${n}}$. Înmulțim cu 2:`,
        show(`2S = 2 + 2^2 + 2^3 + \\ldots + 2^{${n}} + 2^{${n + 1}}`),
        'Scădem cele două egalități; termenii comuni se reduc:',
        show(`2S - S = 2^{${n + 1}} - 1 \\Rightarrow S = 2^{${n + 1}} - 1 < 2^{${n + 1}}`),
      ),
      verify: () => {
        let S = 0n
        for (let i = 0; i <= n; i++) S += big(2, i)
        return S === big(2, n + 1) - 1n
      },
    }
  }
  if (t === 1) {
    return {
      text: `Arătați că $2 \\cdot (1 + 3 + 3^2 + \\ldots + 3^{${n}}) < 3^{${n + 1}}$.`,
      solution: lines(
        `Fie $S = 1 + 3 + 3^2 + \\ldots + 3^{${n}}$. Înmulțim cu 3:`,
        show(`3S = 3 + 3^2 + \\ldots + 3^{${n}} + 3^{${n + 1}}`),
        show(`3S - S = 3^{${n + 1}} - 1 \\Rightarrow 2S = 3^{${n + 1}} - 1 < 3^{${n + 1}}`),
      ),
      verify: () => {
        let S = 0n
        for (let i = 0; i <= n; i++) S += big(3, i)
        return 2n * S === big(3, n + 1) - 1n
      },
    }
  }
  if (t === 2) {
    const m = Math.floor(n / 2)
    return {
      text: `Fie numerele $a = 1 + 2 + 2^2 + \\ldots + 2^{${2 * m + 1}}$ și $b = 3 \\cdot (1 + 4 + 4^2 + \\ldots + 4^{${m}})$. Arătați că $a = b$.`,
      solution: lines(
        `Ca în exemplul din manual, $2a - a = 2^{${2 * m + 2}} - 1$, deci $a = 2^{${2 * m + 2}} - 1$.`,
        `Pentru $S = 1 + 4 + \\ldots + 4^{${m}}$: $4S - S = 4^{${m + 1}} - 1$, deci $b = 3S = 4^{${m + 1}} - 1$.`,
        show(`4^{${m + 1}} = (2^2)^{${m + 1}} = 2^{${2 * m + 2}} \\Rightarrow b = 2^{${2 * m + 2}} - 1 = a`),
      ),
      verify: () => {
        let A = 0n
        for (let i = 0; i <= 2 * m + 1; i++) A += big(2, i)
        let S = 0n
        for (let i = 0; i <= m; i++) S += big(4, i)
        return A === 3n * S
      },
    }
  }
  const a = int(rng, 5, 9)
  return {
    text: `Arătați că $${a - 1} \\cdot (1 + ${a} + ${a}^2 + \\ldots + ${a}^{${n}}) = ${a}^{${n + 1}} - 1$.`,
    solution: lines(
      `Fie $S = 1 + ${a} + ${a}^2 + \\ldots + ${a}^{${n}}$. Înmulțim cu ${a}:`,
      show(`${a}S = ${a} + ${a}^2 + \\ldots + ${a}^{${n}} + ${a}^{${n + 1}}`),
      show(`${a}S - S = ${a}^{${n + 1}} - 1 \\Rightarrow ${a - 1}S = ${a}^{${n + 1}} - 1`),
    ),
    verify: () => {
      let S = 0n
      for (let i = 0; i <= n; i++) S += big(a, i)
      return BigInt(a - 1) * S === big(a, n + 1) - 1n
    },
  }
}

/** 3ˣ + 3^(x−1) + 3^(x−2) + 3^(x−3) = 40·…, 5·3ˣ − 2·3ˣ = 81 (p. 76, ex. 20). */
export function factorSumEq(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 0, 2)
    if (t === 0) {
      const b = pick(rng, [2, 3])
      const x = int(rng, 3, b === 2 ? 12 : 8)
      const K = b ** 3 + b ** 2 + b + 1
      const V = b ** (x - 3) * K
      return {
        text: `Determinați numărul natural $x$ care verifică egalitatea $${b}^x + ${b}^{x - 1} + ${b}^{x - 2} + ${b}^{x - 3} = ${grp(V)}$.`,
        solution: lines(
          `Dăm factor comun puterea cea mai mică, $${b}^{x - 3}$:`,
          show(`${b}^{x - 3} \\cdot (${b}^3 + ${b}^2 + ${b} + 1) = ${b}^{x - 3} \\cdot ${K} = ${grp(V)} \\Rightarrow ${b}^{x - 3} = ${grp(V)} : ${K} = ${grp(b ** (x - 3))} = ${b}^{${x - 3}}`),
          show(`x - 3 = ${x - 3} \\Rightarrow x = ${x}`),
        ),
        verify: () => b ** x + b ** (x - 1) + b ** (x - 2) + b ** (x - 3) === V,
      }
    }
    if (t === 1) {
      const b = pick(rng, [2, 3, 5])
      const q = int(rng, 1, 6)
      const p = q + int(rng, 2, 7)
      const x = int(rng, 1, b === 2 ? 10 : b === 3 ? 6 : 4)
      const V = (p - q) * b ** x
      return {
        text: `Determinați numărul natural $x$ care verifică egalitatea $${p} \\cdot ${b}^x - ${q} \\cdot ${b}^x = ${grp(V)}$.`,
        solution: show(`(${p} - ${q}) \\cdot ${b}^x = ${grp(V)} \\Rightarrow ${b}^x = ${grp(V)} : ${p - q} = ${grp(b ** x)} = ${b}^{${x}} \\Rightarrow x = ${x}`),
        verify: () => p * b ** x - q * b ** x === V,
      }
    }
    const b = pick(rng, [3, 4, 5])
    const x = int(rng, 1, b === 3 ? 7 : 5)
    const K = b * b - b - 1
    const V = b ** x * K
    return {
      text: `Determinați numărul natural $x$ care verifică egalitatea $${b}^{x + 2} - ${b}^{x + 1} - ${b}^x = ${grp(V)}$.`,
      solution: lines(
        `Dăm factor comun $${b}^x$:`,
        show(`${b}^x \\cdot (${b}^2 - ${b} - 1) = ${b}^x \\cdot ${K} = ${grp(V)} \\Rightarrow ${b}^x = ${grp(V)} : ${K} = ${grp(b ** x)} = ${b}^{${x}} \\Rightarrow x = ${x}`),
      ),
      verify: () => b ** (x + 2) - b ** (x + 1) - b ** x === V,
    }
  }
}

/** (16·12¹⁰ − 4·12¹⁰) : 12¹¹, 5¹¹ − (6·5¹⁰ − 2·5¹⁰), 15² − (14·15 + 15) : 15² (p. 76, ex. 21). */
export function factorPowersCalc(rng: Rng): Made {
  const t = int(rng, 0, 3)
  const b = int(rng, 3, 15)
  const n = int(rng, 5, 30)
  if (t === 0) {
    const k = int(rng, 1, 5)
    const q = int(rng, 2, 20)
    const p = q + b * k
    const mid = k === 1 ? `${b} \\cdot ${b}^{${n}} : ${b}^{${n + 1}} = ${b}^{${n + 1}} : ${b}^{${n + 1}}` : `${k} \\cdot ${b} \\cdot ${b}^{${n}} : ${b}^{${n + 1}} = ${k} \\cdot ${b}^{${n + 1}} : ${b}^{${n + 1}}`
    return {
      text: `Calculați: $(${p} \\cdot ${b}^{${n}} - ${q} \\cdot ${b}^{${n}}) : ${b}^{${n + 1}}$.`,
      solution: show(`(${p} - ${q}) \\cdot ${b}^{${n}} : ${b}^{${n + 1}} = ${mid} = ${k}`),
      verify: () => (BigInt(p) * big(b, n) - BigInt(q) * big(b, n)) / big(b, n + 1) === BigInt(k) && (p - q) % b === 0,
    }
  }
  if (t === 1) {
    const j = int(rng, 1, b - 2)
    const q = int(rng, 2, 9)
    const p = q + b - j
    const res = j === 1 ? `${b}^{${n}}` : `${j} \\cdot ${b}^{${n}}`
    return {
      text: `Calculați, scriind rezultatul cu puteri: $${b}^{${n + 1}} - (${p} \\cdot ${b}^{${n}} - ${q} \\cdot ${b}^{${n}})$.`,
      solution: show(`${b} \\cdot ${b}^{${n}} - ${p - q} \\cdot ${b}^{${n}} = (${b} - ${p - q}) \\cdot ${b}^{${n}} = ${res}`),
      verify: () => big(b, n + 1) - (BigInt(p) * big(b, n) - BigInt(q) * big(b, n)) === BigInt(j) * big(b, n),
    }
  }
  if (t === 2) {
    const k = int(rng, 2, 4)
    const e = int(rng, 1, 9)
    const d = int(rng, 10, 60)
    const c = d + e + int(rng, 1, 40)
    const P = 10 ** k
    const r = P * (c - d - e)
    return {
      text: `Calculați: $10^${k} \\cdot ${c} - 10^${k} \\cdot ${d} - ${grp(e * P)}$.`,
      solution: show(`10^${k} \\cdot ${c} - 10^${k} \\cdot ${d} - 10^${k} \\cdot ${e} = 10^${k} \\cdot (${c} - ${d} - ${e}) = 10^${k} \\cdot ${c - d - e} = ${grp(r)}`),
      verify: () => P * c - P * d - e * P === r,
    }
  }
  const a = int(rng, 6, 30)
  return {
    text: `Calculați: $${a}^2 - (${a - 1} \\cdot ${a} + ${a}) : ${a}^2$.`,
    solution: lines(
      'În paranteză dăm factor comun pe ' + a + ':',
      show(`${a - 1} \\cdot ${a} + ${a} = ${a} \\cdot (${a - 1} + 1) = ${a} \\cdot ${a} = ${a}^2`),
      show(`${a}^2 - ${a}^2 : ${a}^2 = ${a * a} - 1 = ${a * a - 1}`),
    ),
    verify: () => a * a - ((a - 1) * a + a) / (a * a) === a * a - 1,
  }
}

// ================= 7. comparing and ordering powers (pp. 77–78) =================

const relOf = (x: bigint, y: bigint) => (x < y ? '<' : x > y ? '>' : '=')

/** Same base or same exponent, and the bases 0 and 1 (p. 77, ex. 1). */
export function sameBaseOrExp(rng: Rng): Made {
  const kinds = shuffle(rng, [0, 1, pick(rng, [0, 1, 2])])
  const items = kinds.map((k): [string, string, string] => {
    if (k === 0) {
      const a = int(rng, 2, 120)
      let [m, n] = [int(rng, 10, 200), int(rng, 10, 200)]
      if (m === n) n += 7
      const r = m < n ? '<' : '>'
      return [`${a}^{${m}}`, `${a}^{${n}}`, `Au aceeași bază, iar $${m} ${r} ${n}$, deci $${a}^{${m}} ${r} ${a}^{${n}}$.`]
    }
    if (k === 1) {
      const m = int(rng, 10, 200)
      let [a, b] = [int(rng, 2, 120), int(rng, 2, 120)]
      if (a === b) b += 3
      const r = a < b ? '<' : '>'
      return [`${a}^{${m}}`, `${b}^{${m}}`, `Au același exponent, iar $${a} ${r} ${b}$, deci $${a}^{${m}} ${r} ${b}^{${m}}$.`]
    }
    const z = pick(rng, [0, 1])
    const [m, n] = [int(rng, 10, 200), int(rng, 201, 400)]
    return [`${z}^{${m}}`, `${z}^{${n}}`, `Orice putere cu exponent nenul a lui ${z} este ${z}, deci $${z}^{${m}} = ${z}^{${n}}$.`]
  })
  return {
    text: lines('Comparați numerele:', ...items.map(([u, v], i) => `${'abc'[i]}) $${u}$ și $${v}$;`)),
    solution: lines(...items.map(([, , s], i) => `${'abc'[i]}) ${s}`)),
    verify: () => items.every(([u, v, s]) => {
      const parse = (w: string) => w.match(/^(\d+)\^\{(\d+)\}$/)!.slice(1).map(Number)
      const [a, m] = parse(u)
      const [b, n] = parse(v)
      return s.includes(`${u} ${relOf(big(a, m), big(b, n))} ${v}`)
    }),
  }
}

/** 2⁵³ and 4²⁹, 125⁴³ and 25⁶¹: bring them to the same base (p. 77, ex. 2). */
export function toSameBase(rng: Rng): Made {
  const make = (): [string, string, string] => {
    const b = pick(rng, [2, 3, 5])
    const [j, k] = shuffle(rng, [1, 2, 3]).slice(0, 2)
    const [c1, c2] = [b ** j, b ** k]
    const m = int(rng, 10, 120)
    let n = Math.round((j * m) / k) + int(rng, -3, 3)
    if (j * m === k * n) n += 1
    const [e1, e2] = [j * m, k * n]
    const r = e1 < e2 ? '<' : '>'
    const w = (c: number, i: number, e: number) => (i === 1 ? `${b}^{${e}}` : `${c}^{${e / i}} = (${b}^${i})^{${e / i}} = ${b}^{${e}}`)
    return [`${c1}^{${m}}`, `${c2}^{${n}}`, `$${w(c1, j, e1)}$, $${w(c2, k, e2)}$; cum $${e1} ${r} ${e2}$, avem $${c1}^{${m}} ${r} ${c2}^{${n}}$.`]
  }
  const items = [make(), make()]
  return {
    text: lines('Comparați numerele:', ...items.map(([u, v], i) => `${'ab'[i]}) $${u}$ și $${v}$;`)),
    solution: lines('Aducem puterile la aceeași bază:', ...items.map(([, , s], i) => `${'ab'[i]}) ${s}`)),
    verify: () => items.every(([u, v, s]) => {
      const parse = (w: string) => w.match(/^(\d+)\^\{(\d+)\}$/)!.slice(1).map(Number)
      const [a, m] = parse(u)
      const [b, n] = parse(v)
      return s.endsWith(`$${u} ${relOf(big(a, m), big(b, n))} ${v}$.`)
    }),
  }
}

/** Fill in <, = or > (p. 78, ex. 7). */
export function signBox(rng: Rng): Made {
  const all: (() => [string, string, bigint, bigint, string])[] = [
    () => {
      const a = int(rng, 2, 9)
      const [m, n] = shuffle(rng, [int(rng, 2, 9), int(rng, 10, 20)])
      return [`${a}^{${m}}`, `${a}^{${n}}`, big(a, m), big(a, n), 'aceeași bază, comparăm exponenții']
    },
    () => {
      const [a, m, b] = [int(rng, 2, 9), int(rng, 2, 6), int(rng, 2, 9)]
      return [`${a}^{${m}}`, `${a}^{${m}} + ${b}^0`, big(a, m), big(a, m) + 1n, `$${b}^0 = 1$, deci membrul drept este mai mare cu 1`]
    },
    () => {
      const [a, b, m] = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 2, 5)]
      return [`(${a} \\cdot ${b})^{${m}}`, `${a}^{${m}} \\cdot ${b}^{${m}}`, big(a * b, m), big(a, m) * big(b, m), 'un produs se ridică la putere ridicând fiecare factor']
    },
    () => {
      const a = int(rng, 2, 9)
      const [p, q] = [int(rng, 2, 5), int(rng, 2, 5)]
      const s = int(rng, 2, 9)
      const r = s + p * q + int(rng, -2, 2)
      return [`(${a}^{${p}})^{${q}}`, `${a}^{${r}} : ${a}^{${s}}`, big(a, p * q), big(a, r - s), `$${a}^{${p * q}}$ și $${a}^{${r - s}}$: comparăm exponenții`]
    },
    () => {
      const a = int(rng, 2, 9)
      const [p, q, r, s] = [int(rng, 2, 6), int(rng, 2, 4), int(rng, 2, 6), int(rng, 2, 4)]
      const t = Math.max(0, p * q - r * s + int(rng, -2, 2))
      return [`(${a}^{${p}})^{${q}}`, `(${a}^{${r}})^{${s}} \\cdot ${a}^{${t}}`, big(a, p * q), big(a, r * s + t), `$${a}^{${p * q}}$ și $${a}^{${r * s + t}}$: comparăm exponenții`]
    },
  ]
  const items = shuffle(rng, [0, 1, 2, 3, 4]).slice(0, 3).sort((u, v) => u - v).map((i) => all[i]())
  return {
    text: lines('Completați în căsuțe simbolul potrivit ($<$, $=$ sau $>$):', ...items.map(([u, v], i) => `${'abc'[i]}) $${u} \\; \\square \\; ${v}$;`)),
    solution: lines(...items.map(([u, v, x, y, why], i) => `${'abc'[i]}) $${u} ${relOf(x, y)} ${v}$ (${why}).`)),
    verify: () => items.every(([, , x, y]) => ['<', '=', '>'].includes(relOf(x, y))),
  }
}

/** 2⁴⁵ and 3³⁰ at the same exponent (p. 77, example 2). */
export function toSameExponent(rng: Rng): Made {
  const [a, p, b, q] = pick(rng, [[2, 3, 3, 2], [2, 5, 5, 2], [3, 3, 5, 2], [2, 4, 3, 3], [3, 2, 2, 3], [7, 2, 2, 6], [2, 2, 3, 1], [5, 3, 2, 7], [3, 4, 2, 6]] as [number, number, number, number][])
  const m = int(rng, 5, 40)
  const [A, B] = [a ** p, b ** q]
  const r = A < B ? '<' : '>'
  return {
    text: `Comparați numerele $${a}^{${p * m}}$ și $${b}^{${q * m}}$.`,
    solution: lines(
      `Nu le putem aduce la aceeași bază, dar le putem aduce la același exponent, ${m}:`,
      show(`${a}^{${p * m}} = (${a}^${p})^{${m}} = ${A}^{${m}}, \\quad ${b}^{${q * m}} = ${q === 1 ? `${b}^{${m}}` : `(${b}^${q})^{${m}} = ${B}^{${m}}`}`),
      `Cum $${A} ${r} ${B}$, rezultă $${A}^{${m}} ${r} ${B}^{${m}}$, adică $${a}^{${p * m}} ${r} ${b}^{${q * m}}$.`,
    ),
    verify: () => relOf(big(a, p * m), big(b, q * m)) === r,
  }
}

/** Order 27⁹, 9¹³, 243⁵ (p. 77, example 1; p. 78, ex. 10, 11). */
export function orderThree(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 3, 5])
    const ks = shuffle(rng, b === 5 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5]).slice(0, 3)
    const es = ks.map(() => int(rng, 5, 40))
    const tot = ks.map((k, i) => k * es[i])
    if (new Set(tot).size < 3) continue
    const up = rng() < 0.5
    const idx = [0, 1, 2].sort((i, j) => (up ? tot[i] - tot[j] : tot[j] - tot[i]))
    const name = (i: number) => `${b ** ks[i]}^{${es[i]}}`
    const rw = (i: number) => (ks[i] === 1 ? `${b}^{${es[i]}}` : `${name(i)} = (${b}^${ks[i]})^{${es[i]}} = ${b}^{${tot[i]}}`)
    const sym = up ? '<' : '>'
    return {
      text: `Ordonați ${up ? 'crescător' : 'descrescător'} numerele: $${name(0)}$, $${name(1)}$ și $${name(2)}$.`,
      solution: lines(
        `Scriem toate numerele ca puteri ale lui ${b}:`,
        show([0, 1, 2].map(rw).join(', \\quad ')),
        `Având aceeași bază, comparăm exponenții: $${idx.map((i) => tot[i]).join(` ${sym} `)}$, deci`,
        show(idx.map(name).join(` ${sym} `)),
      ),
      verify: () => idx.every((i, j) => j === 0 || relOf(big(b, tot[idx[j - 1]]), big(b, tot[i])) === sym),
    }
  }
}

/** 3⁴⁰, 2⁶⁰, 25¹⁰, 7²⁰ ordered by bringing them to one exponent (p. 78, ex. 13 a). */
const SAME_EXP: [number, number, number][] = [
  [2, 2, 1], [2, 3, 1], [3, 2, 1], [2, 4, 1], [3, 3, 1], [5, 2, 1], [7, 1, 1], [11, 1, 1], [13, 1, 1],
  [25, 1, 2], [36, 1, 2], [49, 1, 2], [100, 1, 2], [81, 1, 2], [64, 1, 2],
]
export function orderSameExponent(rng: Rng): Made {
  for (;;) {
    const m = 2 * int(rng, 3, 15)
    const picked = shuffle(rng, SAME_EXP).slice(0, 4)
    const vals = picked.map(([b, num, den]) => Math.round(b ** (num / den)))
    if (new Set(vals).size < 4) continue
    const exps = picked.map(([, num, den]) => (m * num) / den)
    const name = (i: number) => `${picked[i][0]}^{${exps[i]}}`
    const rw = (i: number) => {
      const [b, num, den] = picked[i]
      if (num === 1 && den === 1) return `${name(i)}`
      if (den === 2) return `${name(i)} = (${vals[i]}^2)^{${exps[i]}} = ${vals[i]}^{${m}}`
      return `${name(i)} = ${b}^{${num} \\cdot ${m}} = (${b}^${num})^{${m}} = ${vals[i]}^{${m}}`
    }
    const up = rng() < 0.5
    const idx = [0, 1, 2, 3].sort((i, j) => (up ? vals[i] - vals[j] : vals[j] - vals[i]))
    const sym = up ? '<' : '>'
    return {
      text: `Ordonați ${up ? 'crescător' : 'descrescător'} numerele: $${name(0)}$, $${name(1)}$, $${name(2)}$ și $${name(3)}$.`,
      solution: lines(
        `Le aducem pe toate la exponentul ${m}:`,
        show([0, 1, 2, 3].map(rw).join(', \\quad ')),
        `Având același exponent, comparăm bazele: $${idx.map((i) => vals[i]).join(` ${sym} `)}$, deci`,
        show(idx.map(name).join(` ${sym} `)),
      ),
      verify: () => picked.every(([b, num, den], i) => big(b, exps[i]) === big(vals[i], m) && (num * m) % den === 0) && idx.every((i, j) => j === 0 || relOf(big(vals[idx[j - 1]], m), big(vals[i], m)) === sym),
    }
  }
}

/** The natural x with 2ˣ < 3⁴, 2^(2x) < 8⁴ (p. 78, ex. 15). */
export function powerInequality(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 0, 1)
    if (t === 0) {
      const a = pick(rng, [2, 3])
      const [c, d] = [pick(rng, [3, 5, 6, 7, 10]), int(rng, 2, 4)]
      if (c === a) continue
      const V = c ** d
      const xs: number[] = []
      for (let x = 0; a ** x < V; x++) xs.push(x)
      if (xs.length > 14 || a ** xs[xs.length - 1] === V) continue
      const top = xs[xs.length - 1]
      return {
        text: `Determinați numerele naturale $x$ pentru care $${a}^x < ${c}^${d}$.`,
        solution: lines(
          show(`${c}^${d} = ${grp(V)}, \\quad ${a}^{${top}} = ${grp(a ** top)} < ${grp(V)} < ${a}^{${top + 1}} = ${grp(a ** (top + 1))}`),
          `Deci $${a}^x < ${grp(V)}$ doar pentru $x \\le ${top}$:`,
          show(`x \\in \\{${xs.join(', ')}\\}`),
        ),
        verify: () => xs.every((x) => a ** x < V) && a ** (top + 1) >= V,
      }
    }
    const b = pick(rng, [2, 3, 5])
    const j = int(rng, 2, 3)
    const k = int(rng, 2, 3)
    const m = int(rng, 2, 6)
    const strict = rng() < 0.5
    const lim = j * m
    const xs: number[] = []
    for (let x = 0; strict ? k * x < lim : k * x <= lim; x++) xs.push(x)
    if (xs.length < 2) continue
    const s = strict ? '<' : '\\le'
    return {
      text: `Determinați numerele naturale $x$ pentru care $${b}^{${k}x} ${s} ${b ** j}^{${m}}$.`,
      solution: lines(
        `Scriem membrul drept ca putere a lui ${b}: $${b ** j}^{${m}} = (${b}^${j})^{${m}} = ${b}^{${lim}}$. Având aceeași bază, comparăm exponenții:`,
        show(`${k}x ${s} ${lim} \\Rightarrow x \\in \\{${xs.join(', ')}\\}`),
      ),
      verify: () => xs.every((x) => (strict ? big(b, k * x) < big(b, lim) : big(b, k * x) <= big(b, lim))) && !(strict ? k * xs.length < lim : k * xs.length <= lim),
    }
  }
}

/** 2^(3k+1) and 3^(2k+1) − 9ᵏ (p. 78, ex. 16 b). */
export function intermediateCompare(rng: Rng): Made {
  const t = int(rng, 0, 2)
  const k = int(rng, 10, 80)
  const [x, y, fx, fy, r] = ([
    [`2^{${3 * k + 1}}`, `3^{${2 * k + 1}} - 9^{${k}}`, `2 \\cdot (2^3)^{${k}} = 2 \\cdot 8^{${k}}`, `3 \\cdot (3^2)^{${k}} - 9^{${k}} = 3 \\cdot 9^{${k}} - 9^{${k}} = 2 \\cdot 9^{${k}}`, '<'],
    [`2^{${3 * k + 3}}`, `3^{${2 * k + 2}} - 9^{${k}}`, `2^3 \\cdot (2^3)^{${k}} = 8 \\cdot 8^{${k}}`, `3^2 \\cdot (3^2)^{${k}} - 9^{${k}} = 9 \\cdot 9^{${k}} - 9^{${k}} = 8 \\cdot 9^{${k}}`, '<'],
    [`3^{${2 * k + 1}} + 9^{${k}}`, `2^{${3 * k + 2}}`, `3 \\cdot (3^2)^{${k}} + 9^{${k}} = 3 \\cdot 9^{${k}} + 9^{${k}} = 4 \\cdot 9^{${k}}`, `2^2 \\cdot (2^3)^{${k}} = 4 \\cdot 8^{${k}}`, '>'],
  ] as [string, string, string, string, string][])[t]
  return {
    text: `Comparați numerele $x = ${x}$ și $y = ${y}$.`,
    solution: lines(
      'Aducem ambele numere la exponentul ' + k + ':',
      show(`x = ${fx}`),
      show(`y = ${fy}`),
      `Cum $8^{${k}} < 9^{${k}}$, rezultă $x ${r} y$.`,
    ),
    verify: () => {
      const X = [big(2, 3 * k + 1), big(2, 3 * k + 3), big(3, 2 * k + 1) + big(9, k)][t]
      const Y = [big(3, 2 * k + 1) - big(9, k), big(3, 2 * k + 2) - big(9, k), big(2, 3 * k + 2)][t]
      return relOf(X, Y) === r
    },
  }
}

/** x = aⁿ + a^(n+2) + a^(n+4), y = a^(n+5) + a^(n+3) + a^(n+1): y = a·x (p. 78, ex. 17 a). */
export function sumsCompare(rng: Rng): Made {
  const a = pick(rng, [2, 3, 5, 7])
  const n = int(rng, 10, 90)
  const g = pick(rng, [1, 3])
  const K = 1 + a * a + a ** 4
  const yTerms = [n + 4 + g, n + 2 + g, n + g]
  const yTex = (rng() < 0.5 ? yTerms : [...yTerms].reverse()).map((e) => `${a}^{${e}}`).join(' + ')
  return {
    text: `Comparați numerele $x = ${a}^{${n}} + ${a}^{${n + 2}} + ${a}^{${n + 4}}$ și $y = ${yTex}$. De câte ori este $y$ mai mare decât $x$?`,
    solution: lines(
      'Dăm factor comun puterea cea mai mică din fiecare număr:',
      show(`x = ${a}^{${n}} \\cdot (1 + ${a}^2 + ${a}^4) = ${a}^{${n}} \\cdot ${K}`),
      show(`y = ${a}^{${n + g}} \\cdot (1 + ${a}^2 + ${a}^4) = ${a}^{${n + g}} \\cdot ${K} = ${a}^{${g}} \\cdot (${a}^{${n}} \\cdot ${K}) = ${a}^{${g}} \\cdot x`),
      `Deci $x < y$, iar $y$ este de $${a}^{${g}} = ${a ** g}$ ori mai mare decât $x$.`,
    ),
    verify: () => {
      const X = big(a, n) + big(a, n + 2) + big(a, n + 4)
      const Y = yTerms.reduce((s, e) => s + big(a, e), 0n)
      return Y === X * big(a, g)
    },
  }
}

/** A = a^(1 + 2 + … + N) and B = (a^(N/2))^(N + 1) (p. 78, ex. 19). */
export function exponentSumCompare(rng: Rng): Made {
  const h = int(rng, 10, 1000)
  const N0 = 2 * h
  const eA = h * (N0 + 1)
  const t = int(rng, 0, 3)
  const [inner, outer] = ([[h, N0 + 1], [h + 1, N0], [N0, h], [N0 + 1, h]] as [number, number][])[t]
  const eB = inner * outer
  const r = eA < eB ? '<' : eA > eB ? '>' : '='
  const verdict = r === '=' ? 'Numerele sunt egale.' : r === '<' ? 'Numărul $B$ este mai mare.' : 'Numărul $A$ este mai mare.'
  return {
    text: `Fie $a$ un număr natural, $a \\ge 2$. Care dintre numerele $A = a^{1 + 2 + \\ldots + ${grp(N0)}}$ și $B = (a^{${grp(inner)}})^{${grp(outer)}}$ este mai mare?`,
    solution: lines(
      'Calculăm exponenții. Cu formula lui Gauss:',
      show(`1 + 2 + \\ldots + ${grp(N0)} = ${grp(N0)} \\cdot ${grp(N0 + 1)} : 2 = ${grp(h)} \\cdot ${grp(N0 + 1)} = ${grp(eA)}`),
      show(`B = a^{${grp(inner)} \\cdot ${grp(outer)}} = a^{${grp(eB)}}`),
      `Puterile au aceeași bază $a \\ge 2$, deci comparăm exponenții: $${grp(eA)} ${r} ${grp(eB)}$, adică $A ${r} B$. ${verdict}`,
    ),
    verify: () => tri(N0) === eA && relOf(BigInt(eA), BigInt(eB)) === r,
  }
}

// ================= 8. perfect squares and the last digit (pp. 79–82) =================

/** 1 + 3 + … + (2n − 1) = n², 2 + 2 + 2² + … = 2^(2m) (p. 81, ex. 5, 11, 18). */
export function oddSumSquare(rng: Rng): Made {
  if (rng() < 0.6) {
    const n = int(rng, 5, 100)
    return {
      text: `Arătați că numărul $1 + 3 + 5 + \\ldots + ${2 * n - 1}$ este pătrat perfect.`,
      solution: lines(
        `Suma are ${de(n)} termeni. O scriem de două ori, a doua oară în ordine inversă, și adunăm termenii aflați unul sub altul; fiecare pereche are suma ${2 * n}:`,
        show(`2S = (1 + ${2 * n - 1}) + (3 + ${2 * n - 3}) + \\ldots + (${2 * n - 1} + 1) = ${n} \\cdot ${2 * n} \\Rightarrow S = ${n} \\cdot ${n} = ${n}^2`),
      ),
      verify: () => {
        let s = 0
        for (let i = 1; i <= n; i++) s += 2 * i - 1
        return s === n * n
      },
    }
  }
  const m = int(rng, 3, 15)
  return {
    text: `Arătați că numărul $2 + 2^1 + 2^2 + 2^3 + \\ldots + 2^{${2 * m - 1}}$ este pătrat perfect.`,
    solution: lines(
      'Adunăm pe rând, de la stânga: $2 + 2^1 = 2^2$, apoi $2^2 + 2^2 = 2^3$, $2^3 + 2^3 = 2^4$ și așa mai departe; la fiecare pas obținem dublul puterii, adică puterea următoare.',
      show(`2 + 2^1 + 2^2 + \\ldots + 2^{${2 * m - 1}} = 2^{${2 * m - 1}} + 2^{${2 * m - 1}} = 2^{${2 * m}} = (2^{${m}})^2`),
    ),
    verify: () => {
      let s = 2n
      for (let i = 1; i <= 2 * m - 1; i++) s += big(2, i)
      return s === big(2, m) ** 2n
    },
  }
}

const SQB: [number, number, number][] = [[4, 2, 2], [9, 3, 2], [25, 5, 2], [49, 7, 2], [16, 2, 4], [8, 2, 3], [27, 3, 3], [125, 5, 3], [2, 2, 1], [3, 3, 1], [5, 5, 1], [7, 7, 1]]

/** 25⁴⁷·49¹⁷ = (5⁴⁷·7¹⁷)² (p. 81, example 4 and ex. 16). */
export function productPowersSquare(rng: Rng): Made {
  for (;;) {
    const [f1, f2] = [pick(rng, SQB), pick(rng, SQB)]
    if (f1[1] === f2[1]) continue
    const ex = (f: [number, number, number]) => (f[2] % 2 === 1 ? 2 * int(rng, 5, 40) : int(rng, 5, 99))
    const [e1, e2] = [ex(f1), ex(f2)]
    const [h1, h2] = [(f1[2] * e1) / 2, (f2[2] * e2) / 2]
    const rw = (f: [number, number, number], e: number) => (f[2] === 1 ? `${f[0]}^{${e}}` : `${f[0]}^{${e}} = (${f[1]}^${f[2]})^{${e}} = ${f[1]}^{${f[2] * e}}`)
    return {
      text: `Arătați că numărul $${f1[0]}^{${e1}} \\cdot ${f2[0]}^{${e2}}$ este pătrat perfect.`,
      solution: lines(
        'Scriem fiecare factor ca putere a unui număr prim, cu exponent par:',
        show(`${rw(f1, e1)} = (${f1[1]}^{${h1}})^2, \\quad ${rw(f2, e2)} = (${f2[1]}^{${h2}})^2`),
        show(`${f1[0]}^{${e1}} \\cdot ${f2[0]}^{${e2}} = (${f1[1]}^{${h1}})^2 \\cdot (${f2[1]}^{${h2}})^2 = (${f1[1]}^{${h1}} \\cdot ${f2[1]}^{${h2}})^2`),
      ),
      verify: () => big(f1[0], e1) * big(f2[0], e2) === (big(f1[1], h1) * big(f2[1], h2)) ** 2n,
    }
  }
}

/** U(78 + 95), U(97·83), U(36⁵⁹) (p. 80, examples). */
export function lastDigitBasics(rng: Rng): Made {
  const [n1, n2] = [int(rng, 10, 999), int(rng, 10, 999)]
  const [n3, n4] = [int(rng, 11, 99), int(rng, 11, 99)]
  const n5 = 10 * int(rng, 1, 9) + pick(rng, [0, 1, 5, 6])
  const k = int(rng, 10, 2030)
  const [u1, u2, u3, u4, u5] = [n1, n2, n3, n4, n5].map((x) => x % 10)
  const [A, B] = [(u1 + u2) % 10, (u3 * u4) % 10]
  return {
    text: `Calculați ultima cifră a numerelor $a = ${n1} + ${n2}$, $b = ${n3} \\cdot ${n4}$ și $c = ${n5}^{${grp(k)}}$.`,
    solution: lines(
      'Notăm cu $U(x)$ ultima cifră a lui $x$. Ultima cifră a unei sume sau a unui produs depinde doar de ultimele cifre ale termenilor, respectiv ale factorilor:',
      show(`U(a) = U(${u1} + ${u2}) = U(${u1 + u2}) = ${A}, \\quad U(b) = U(${u3} \\cdot ${u4}) = U(${u3 * u4}) = ${B}`),
      `Orice putere cu exponent nenul a unui număr terminat în ${u5} se termină în ${u5}${u5 === 6 ? ' (pentru că $6 \\cdot 6 = 36$)' : u5 === 5 ? ' (pentru că $5 \\cdot 5 = 25$)' : ''}, deci $U(c) = ${u5}$.`,
    ),
    verify: () => (n1 + n2) % 10 === A && (n3 * n4) % 10 === B && lastDigit(n5, k) === u5,
  }
}

/** aᵐ + bⁿ ends in 2, 3, 7 or 8, so it is not a perfect square (p. 81, ex. 12, 13). */
export function notSquareLastDigit(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 2, 99), int(rng, 2, 99)]
    const [m, n] = [int(rng, 10, 2030), int(rng, 10, 2030)]
    if (a % 10 === 0 || b % 10 === 0 || a === b) continue
    const [s1, d1] = lastDigitSteps(a, m)
    const [s2, d2] = lastDigitSteps(b, n)
    const d = (d1 + d2) % 10
    if (![2, 3, 7, 8].includes(d)) continue
    return {
      text: `Arătați că numărul $${a}^{${grp(m)}} + ${b}^{${grp(n)}}$ nu este pătrat perfect.`,
      solution: lines(
        'Ultima cifră a unui pătrat perfect poate fi doar 0, 1, 4, 5, 6 sau 9. Calculăm ultima cifră a numărului:',
        s1,
        s2,
        show(`U(${a}^{${grp(m)}} + ${b}^{${grp(n)}}) = U(${d1} + ${d2}) = ${d}`),
        `Numărul se termină în ${d}, deci nu este pătrat perfect.`,
      ),
      verify: () => (lastDigit(a, m) + lastDigit(b, n)) % 10 === d && ![0, 1, 4, 5, 6, 9].includes(d),
    }
  }
}

/** 5³⁴ + 5¹⁷ and 2 + 4 + … + 2n lie between two consecutive squares (p. 81, example 3, ex. 15, 17). */
export function squareBetween(rng: Rng): Made {
  if (rng() < 0.5) {
    const a = int(rng, 2, 12)
    const k = int(rng, 5, 60)
    return {
      text: `Arătați că numărul $${a}^{${2 * k}} + ${a}^{${k}}$ nu este pătrat perfect.`,
      solution: lines(
        `Dăm factor comun $${a}^{${k}}$: $${a}^{${2 * k}} + ${a}^{${k}} = ${a}^{${k}} \\cdot (${a}^{${k}} + 1)$. Atunci`,
        show(`(${a}^{${k}})^2 < ${a}^{${k}} \\cdot (${a}^{${k}} + 1) < (${a}^{${k}} + 1)^2`),
        'Numărul este cuprins strict între pătratele a două numere naturale consecutive, deci nu este pătrat perfect.',
      ),
      verify: () => {
        const p = big(a, k)
        const v = p * p + p
        return p * p < v && v < (p + 1n) ** 2n
      },
    }
  }
  const n = int(rng, 10, 500)
  return {
    text: `Arătați că numărul $2 + 4 + 6 + \\ldots + ${2 * n}$ nu este pătrat perfect.`,
    solution: lines(
      show(`2 + 4 + \\ldots + ${2 * n} = 2 \\cdot (1 + 2 + \\ldots + ${n}) = 2 \\cdot ${n} \\cdot ${n + 1} : 2 = ${n} \\cdot ${n + 1}`),
      show(`${n}^2 < ${n} \\cdot ${n + 1} < ${n + 1}^2`),
      'Numărul este cuprins strict între pătratele a două numere naturale consecutive, deci nu este pătrat perfect.',
    ),
    verify: () => {
      let s = 0
      for (let i = 1; i <= n; i++) s += 2 * i
      return s === n * (n + 1) && !isSquare(s)
    },
  }
}

/** 2024² − 2024 − 2023 = 2023² and its relatives (p. 81, ex. 4). */
export function consecutiveSquare(rng: Rng): Made {
  const n = int(rng, 100, 3000)
  const t = int(rng, 0, 2)
  const g = grp
  const [expr, steps, root] = ([
    [`${g(n)}^2 - ${g(n)} - ${g(n - 1)}`, `${g(n)} \\cdot (${g(n)} - 1) - ${g(n - 1)} = ${g(n)} \\cdot ${g(n - 1)} - ${g(n - 1)} = ${g(n - 1)} \\cdot (${g(n)} - 1) = ${g(n - 1)} \\cdot ${g(n - 1)}`, n - 1],
    [`${g(n)}^2 + ${g(n)} + ${g(n + 1)}`, `${g(n)} \\cdot (${g(n)} + 1) + ${g(n + 1)} = ${g(n)} \\cdot ${g(n + 1)} + ${g(n + 1)} = ${g(n + 1)} \\cdot (${g(n)} + 1) = ${g(n + 1)} \\cdot ${g(n + 1)}`, n + 1],
    [`${g(n)} \\cdot ${g(n + 2)} + 1`, `${g(n)} \\cdot (${g(n + 1)} + 1) + 1 = ${g(n)} \\cdot ${g(n + 1)} + ${g(n)} + 1 = ${g(n)} \\cdot ${g(n + 1)} + ${g(n + 1)} = ${g(n + 1)} \\cdot (${g(n)} + 1) = ${g(n + 1)} \\cdot ${g(n + 1)}`, n + 1],
  ] as [string, string, number][])[t]
  return {
    text: `Arătați că numărul $${expr}$ este pătrat perfect.`,
    solution: lines('Dăm factor comun, de două ori:', show(`${expr} = ${steps} = ${g(root)}^2`)),
    verify: () => [n * n - n - (n - 1), n * n + n + n + 1, n * (n + 2) + 1][t] === root * root,
  }
}

/** 15x + 7 and 12p + 16q + 6 are not perfect squares (p. 82, ex. 23–25). */
export function linearNotSquare(rng: Rng): Made {
  const c0 = pick(rng, [2, 3, 7, 8])
  const t = int(rng, 0, 2)
  if (t === 0) {
    const k = pick(rng, [5, 15, 25, 35, 45, 55, 65, 75, 85, 95])
    const c = c0 + 10 * int(rng, 0, 9)
    const other = (c0 + 5) % 10
    return {
      text: `Dacă $x$ este un număr natural, arătați că numărul $${k}x + ${c}$ nu este pătrat perfect.`,
      solution: lines(
        `Produsul $${k}x$ se termină în 0 (dacă $x$ este par) sau în 5 (dacă $x$ este impar). Atunci $${k}x + ${c}$ se termină în ${Math.min(c0, other)} sau în ${Math.max(c0, other)}.`,
        'Un pătrat perfect se termină doar în 0, 1, 4, 5, 6 sau 9, deci numărul nu este pătrat perfect.',
      ),
      verify: () => [0, 1, 2, 3, 17].every((x) => [2, 3, 7, 8].includes((k * x + c) % 10)),
    }
  }
  if (t === 1) {
    const k = 10 * int(rng, 1, 12)
    const c = c0 + 10 * int(rng, 0, 9)
    return {
      text: `Dacă $x$ este un număr natural, arătați că numărul $${k}x + ${c}$ nu este pătrat perfect.`,
      solution: lines(
        `Produsul $${k}x$ se termină în 0, deci $${k}x + ${c}$ se termină în ${c0}.`,
        'Un pătrat perfect se termină doar în 0, 1, 4, 5, 6 sau 9, deci numărul nu este pătrat perfect.',
      ),
      verify: () => [0, 1, 2, 7].every((x) => (k * x + c) % 10 === c0),
    }
  }
  const [u, v] = [int(rng, 1, 9), int(rng, 1, 9)]
  const odd = rng() < 0.4
  const c = 4 * int(rng, 0, 9) + (odd ? 3 : 2)
  const w = (c - (c % 4)) / 4
  return {
    text: `Arătați că numărul $${4 * u}p + ${4 * v}q + ${c}$ nu este pătrat perfect, oricare ar fi numerele naturale $p$ și $q$.`,
    solution: lines(
      show(`${4 * u}p + ${4 * v}q + ${c} = 4 \\cdot (${u === 1 ? '' : u}p + ${v === 1 ? '' : v}q${w ? ` + ${w}` : ''}) + ${c % 4}`),
      odd
        ? 'Numărul este impar și dă restul 3 la împărțirea la 4. Un pătrat impar este de forma $(2k + 1)^2 = 4k^2 + 4k + 1 = 4 \\cdot (k^2 + k) + 1$, deci dă restul 1 la împărțirea la 4. Așadar numărul nu este pătrat perfect.'
        : 'Numărul este par, dar nu se împarte exact la 4 (restul este 2). Un pătrat par este de forma $(2k)^2 = 4k^2$, deci se împarte exact la 4. Așadar numărul nu este pătrat perfect.',
    ),
    verify: () => [[0, 0], [1, 2], [5, 3]].every(([p, q]) => (4 * u * p + 4 * v * q + c) % 4 === (odd ? 3 : 2)),
  }
}

/** The smallest n with bⁿ + M a perfect square (p. 82, ex. 30). */
export function smallestSquare(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [2, 3, 5])
    const n0 = int(rng, 1, b === 2 ? 9 : b === 3 ? 6 : 4)
    const p = b ** n0
    const s0 = Math.ceil(Math.sqrt(p))
    const s = int(rng, s0 + 3, s0 + 60)
    const M = s * s - p
    if (M < 10) continue
    let ok = true
    for (let n = 0; n < n0; n++) if (isSquare(b ** n + M)) ok = false
    if (!ok) continue
    const tries = Array.from({ length: n0 }, (_, n) => {
      const v = b ** n + M
      const r = Math.floor(Math.sqrt(v))
      return `Pentru $n = ${n}$: $${b}^{${n}} + ${grp(M)} = ${grp(v)}$, cuprins între $${r}^2 = ${grp(r * r)}$ și $${r + 1}^2 = ${grp((r + 1) * (r + 1))}$, deci nu este pătrat perfect.`
    })
    return {
      text: `Determinați cea mai mică valoare a numărului natural $n$ pentru care numărul $${b}^n + ${grp(M)}$ este pătrat perfect.`,
      solution: lines(
        'Încercăm pe rând valorile lui $n$, începând cu 0:',
        ...tries,
        `Pentru $n = ${n0}$: $${b}^{${n0}} + ${grp(M)} = ${grp(p)} + ${grp(M)} = ${grp(s * s)} = ${s}^2$. Cea mai mică valoare este $n = ${n0}$.`,
      ),
      verify: () => isSquare(p + M) && Array.from({ length: n0 }, (_, n) => n).every((n) => !isSquare(b ** n + M)),
    }
  }
}

/** 1·2·…·n + c ends in 2, 3, 7 or 8 (p. 82, ex. 29). */
export function factorialNotSquare(rng: Rng): Made {
  const n = int(rng, 5, 2030)
  const c0 = pick(rng, [2, 3, 7, 8])
  const c = c0 + 10 * int(rng, 0, 9)
  return {
    text: `Demonstrați că numărul $1 \\cdot 2 \\cdot 3 \\cdot \\ldots \\cdot ${grp(n)} + ${c}$ nu este pătrat perfect.`,
    solution: lines(
      `Produsul $1 \\cdot 2 \\cdot \\ldots \\cdot ${grp(n)}$ îi conține pe 2 și pe 5, deci se împarte exact la 10: se termină în 0.`,
      `Atunci numărul se termină în ${c0}. Un pătrat perfect se termină doar în 0, 1, 4, 5, 6 sau 9, deci numărul nu este pătrat perfect.`,
    ),
    verify: () => {
      let f = 1
      for (let i = 2; i <= Math.min(n, 20); i++) f = (f * i) % 10
      return n >= 5 && (f + c) % 10 === c0 && ![0, 1, 4, 5, 6, 9].includes(c0)
    },
  }
}

// ================= the kinds =================

export const KINDS: GradeKind[] = [
  {
    id: 'v-add-sub', label: 'Adunarea și scăderea: ecuații, inecuații, probleme', topic: 'Algebră',
    forms: { 1: [ineqInterval, exprSubstitution, termsQuestions], 2: [pairSums, ageProblem, reversedTwoDigit, repeatedDigit], 3: [oddEvenSum, sameSubtracted, differenceChange, doubleSubtrahend] },
  },
  {
    id: 'v-multiplication', label: 'Înmulțirea: proprietăți și factor comun', topic: 'Algebră',
    forms: { 1: [commonFactorCalc, smartProduct, givenSumProduct], 2: [withExtraA, combinationSum], 3: [linearCombination, arithmeticX, factorPairs, hiddenRelation] },
  },
  {
    id: 'v-division-exact', label: 'Împărțirea: proprietăți și calcule', topic: 'Algebră',
    forms: { 1: [halfThirdQuarter, pagesNeeded], 2: [timesBigger, repDigits], 3: [gaussDivision, xTimesSum, triangularRatio, threeProducts, digitsEquation] },
  },
  {
    id: 'v-remainder', label: 'Teorema împărțirii cu rest: probleme', topic: 'Algebră',
    forms: { 1: [quotientClass, twoDigitDivisor], 2: [extremesWithRemainder, dividendMinusRemainder], 3: [remainderExpression, remaindersCompatible, sumOfQuotientClass, quotientPowerRemainder, factorialRemainder, reverseDivision] },
  },
  {
    id: 'v-ops-brackets', label: 'Ordinea operațiilor: paranteze și calcule ingenioase', topic: 'Algebră',
    forms: { 1: [substitutionABC, extremeX], 2: [twoQuotients, nestedChain, trueOrFalse, compareFactored], 3: [consecutiveTrick, relationExpression, identityForAnyX] },
  },
  {
    id: 'v-power-rules', label: 'Puteri: reguli de calcul și ecuații', topic: 'Algebră',
    forms: { 1: [productToPower, smallPowersCalc, identityCheck, powerRulesCalc], 2: [simpleExpEq, twoPowersSum, geometricSum], 3: [expEquation, factorSumEq, factorPowersCalc] },
  },
  {
    id: 'v-power-compare', label: 'Compararea și ordonarea puterilor', topic: 'Algebră',
    forms: { 1: [sameBaseOrExp, toSameBase, signBox, toSameExponent], 2: [orderThree, orderSameExponent], 3: [powerInequality, intermediateCompare, sumsCompare, exponentSumCompare] },
  },
  {
    id: 'v-perfect-squares', label: 'Pătrate perfecte și ultima cifră', topic: 'Algebră',
    forms: { 1: [oddSumSquare, lastDigitBasics, consecutiveSquare], 2: [productPowersSquare, notSquareLastDigit, squareBetween], 3: [linearNotSquare, smallestSquare, factorialNotSquare] },
  },
]
