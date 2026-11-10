// The contest level (4): problems like those of the school competitions of grades V–VIII (olimpiada locală,
// concursuri școlare): Gauss sums, counting digits, the method of the false hypothesis, going backwards, remainders,
// c.m.m.d.c. and c.m.m.m.c., telescoping sums, irreducible fractions, double radicals, equations in whole numbers,
// minimums by squares, primes. Each has a worked solution in Romanian, the way a contest solution is written.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, pick, poly, root, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** "x + 3", "x - 2", "x" */
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
/** The word "de" alone, for a number written inside a formula: "$… = 120$ de cifre". */
const deWord = (n: number) => (de(n) === String(n) ? '' : 'de ')
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0)
const isPrime = (n: number) => {
  if (n < 2) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}
const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n))
const pairs = (list: [number, number][]) => list.map(([a, b]) => `(${a}, ${b})`).join(', ')
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))

// ================= grade V =================

/** x + (x + d) + … + (x + kd) = S: count the terms, then Gauss. */
export function arithmeticSum(rng: Rng): Made {
  const d = int(rng, 2, 7)
  const k = int(rng, 9, 30)
  const x = int(rng, 3, 60)
  const n = k + 1
  const gauss = (k * (k + 1)) / 2
  const S = n * x + d * gauss
  return {
    text: `Aflați numărul natural $x$ știind că $x + (x + ${d}) + (x + ${2 * d}) + \\ldots + (x + ${k * d}) = ${S}$.`,
    solution: lines(
      `Termenii cresc din ${d} în ${d}, deci suma are $${k * d} : ${d} + 1 = ${n}$ ${deWord(n)}termeni. Grupăm toți $x$ și scoatem factor comun ${d}:`,
      show(`${n}x + ${d} \\cdot (1 + 2 + \\ldots + ${k}) = ${S}`),
      `Cu suma lui Gauss, $1 + 2 + \\ldots + ${k} = \\frac{${k} \\cdot ${k + 1}}{2} = ${gauss}$, deci`,
      show(`${n}x + ${d * gauss} = ${S} \\Rightarrow ${n}x = ${n * x} \\Rightarrow x = ${x}`),
    ),
    verify: () => Array.from({ length: n }, (_, i) => x + i * d).reduce((s, t) => s + t, 0) === S,
  }
}

/** The pages of a book were numbered with D digits: how many pages? */
export function bookPages(rng: Rng): Made {
  const N = int(rng, 120, 999)
  const D = 9 + 180 + 3 * (N - 99)
  const rest = D - 189
  return {
    text: `Pentru numerotarea paginilor unei cărți, începând cu pagina 1, s-au folosit ${de(D)} cifre. Câte pagini are cartea?`,
    solution: lines(
      'Paginile 1–9 folosesc câte o cifră: 9 cifre. Paginile 10–99 sunt 90 de pagini, cu câte două cifre: $90 \\cdot 2 = 180$ de cifre. Până la pagina 99 s-au folosit $9 + 180 = 189$ de cifre.',
      `Au mai rămas $${D} - 189 = ${rest}$ ${deWord(rest)}cifre, pentru pagini cu câte trei cifre: $${rest} : 3 = ${N - 99}$ ${deWord(N - 99)}pagini, de la 100 la ${N}.`,
      `Cartea are $99 + ${N - 99} = ${N}$ ${deWord(N)}pagini.`,
    ),
    verify: () => {
      let digits = 0
      for (let p = 1; p <= N; p++) digits += String(p).length
      return digits === D
    },
  }
}

/** The sum of the numbers that, divided by d, give the quotient equal to the remainder. */
export function quotientIsRemainder(rng: Rng): Made {
  const d = int(rng, 6, 25)
  const half = ((d - 1) * d) / 2
  const S = (d + 1) * half
  return {
    text: `Calculați suma tuturor numerelor naturale nenule care, împărțite la ${d}, dau câtul egal cu restul.`,
    solution: lines(
      `Din teorema împărțirii cu rest, $n = ${d} \\cdot c + r$, cu $r < ${d}$. Cum $c = r$, avem $n = ${d}r + r = ${d + 1}r$, cu $r \\in \\{1, 2, \\ldots, ${d - 1}\\}$ (pentru $r = 0$ s-ar obține $n = 0$).`,
      show(`S = ${d + 1} \\cdot 1 + ${d + 1} \\cdot 2 + \\ldots + ${d + 1} \\cdot ${d - 1} = ${d + 1} \\cdot \\frac{${d - 1} \\cdot ${d}}{2} = ${d + 1} \\cdot ${half} = ${S}`),
    ),
    verify: () => {
      let s = 0
      for (let n = 1; n <= d * (d + 1); n++) if (Math.floor(n / d) === n % d) s += n
      return s === S
    },
  }
}

const LEGS = [
  { what: 'găini și iepuri', heads: 'capete', small: 'găinile', big: 'iepurii', parts: 'picioare', s: 2, b: 4, ask: 'Câte găini și câți iepuri sunt?', one: 'o găină', other: 'un iepure', all: 'găini', unitS: 'găini', unitB: 'iepuri' },
  { what: 'biciclete și tricicluri', heads: 'vehicule', small: 'bicicletele', big: 'triciclurile', parts: 'roți', s: 2, b: 3, ask: 'Câte biciclete și câte tricicluri sunt?', one: 'o bicicletă', other: 'un triciclu', all: 'biciclete', unitS: 'biciclete', unitB: 'tricicluri' },
  { what: 'gândaci și păianjeni', heads: 'vietăți', small: 'gândacii', big: 'păianjenii', parts: 'picioare', s: 6, b: 8, ask: 'Câți gândaci și câți păianjeni sunt?', one: 'un gândac', other: 'un păianjen', all: 'gândaci', unitS: 'gândaci', unitB: 'păianjeni' },
]

/** False hypothesis, with a difference instead of a total: the big ones have k more legs than the small ones. */
export function legsDifference(rng: Rng): Made {
  for (;;) {
    const c = pick(rng, LEGS)
    const y = int(rng, 6, 40)
    const x = int(rng, 6, 40)
    const k = c.b * y - c.s * x
    if (k <= 0) continue
    const H = x + y
    const step = c.s + c.b
    return {
      text: `Într-o curte sunt ${c.what}, în total ${de(H)} ${c.heads}. ${c.big[0].toUpperCase() + c.big.slice(1)} au cu ${de(k)} ${c.parts} mai multe decât ${c.small}. ${c.ask}`,
      solution: lines(
        `Presupunem că toate cele ${H} ar fi ${c.all}. Atunci ${c.small} ar avea $${H} \\cdot ${c.s} = ${H * c.s}$ ${deWord(H * c.s)}${c.parts}, iar ${c.big} 0. Socotim diferența ca „${c.big} minus ${c.small}”: ea ar fi $0 - ${H * c.s} = -${H * c.s}$.`,
        `Când înlocuim ${c.one} cu ${c.other}, ${c.big} câștigă ${c.b} ${c.parts}, iar ${c.small} pierd ${c.s}, deci diferența crește cu $${c.b} + ${c.s} = ${step}$. Ea trebuie să ajungă de la $-${H * c.s}$ la ${k}, adică să crească cu $${H * c.s} + ${k} = ${H * c.s + k}$. Numărul înlocuirilor este numărul de ${c.unitB}:`,
        `$${H * c.s + k} : ${step} = ${y}$ ${deWord(y)}${c.unitB}, iar $${H} - ${y} = ${x}$ ${deWord(x)}${c.unitS}.`,
        `Verificare: $${y} \\cdot ${c.b} - ${x} \\cdot ${c.s} = ${y * c.b} - ${x * c.s} = ${k}$.`,
      ),
      verify: () => x + y === H && c.b * y - c.s * x === k && (H * c.s + k) % step === 0,
    }
  }
}

/** The sum of the ages now, and how many times older the father was some years ago: figurative method. */
export function agesThen(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 3, 6)
    const f0 = int(rng, 3, 12)
    const y = int(rng, 2, 15)
    const T = p * f0 + y
    const F = f0 + y
    if ((p - 1) * f0 < 18 || T > 70) continue
    const S = T + F
    return {
      text: `Suma vârstelor unui tată și a fiului său este de ${S} de ani. Acum ${de(y)} ani, tatăl era de ${p} ori mai în vârstă decât fiul. Ce vârstă are fiecare acum?`,
      solution: lines(
        `Acum ${y} ani, fiecare era cu ${y} ani mai tânăr, deci suma vârstelor era $${S} - 2 \\cdot ${y} = ${S - 2 * y}$.`,
        `Atunci, vârsta fiului era o parte, iar a tatălui ${p} părți, în total ${p + 1} părți egale:`,
        `O parte: $${S - 2 * y} : ${p + 1} = ${f0}$, vârsta fiului atunci. Vârsta tatălui atunci: $${p} \\cdot ${f0} = ${p * f0}$.`,
        `Acum fiul are $${f0} + ${y} = ${F}$ ${deWord(F)}ani, iar tatăl $${p * f0} + ${y} = ${T}$ ${deWord(T)}ani. Verificare: $${F} + ${T} = ${S}$.`,
      ),
      verify: () => T + F === S && T - y === p * (F - y),
    }
  }
}

const PART: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'un sfert', 5: 'o cincime' }

/** Going backwards: a part of the money and some more, then a part of the rest and some more. */
export function moneyBackwards(rng: Rng): Made {
  for (;;) {
    const p = pick(rng, [2, 3, 4])
    const q = pick(rng, [2, 3, 4, 5])
    const a = int(rng, 1, 12)
    const b = int(rng, 1, 12)
    const t = int(rng, 3, 40)
    const x = p * t
    const y = (p - 1) * t - a
    if (y <= 0 || y % q !== 0) continue
    const r = y - y / q - b
    if (r <= 0) continue
    return {
      text: `Ana a cheltuit în prima zi ${PART[p]} din banii pe care îi avea și încă ${de(a)} lei, iar a doua zi ${PART[q]} din banii rămași și încă ${de(b)} lei. I-au rămas ${de(r)} lei. Câți lei a avut Ana la început?`,
      solution: lines(
        'Mergem invers, de la sfârșit spre început.',
        `A doua zi, înainte de ultimii ${b} lei, Ana mai avea $${r} + ${b} = ${r + b}$ ${deWord(r + b)}lei. Aceștia sunt ce rămâne după ce cheltuie ${PART[q]}, adică ${q - 1} din ${q} părți egale ale banilor de la începutul zilei a doua:`,
        `O parte: $${r + b} : ${q - 1} = ${y / q}$. La începutul zilei a doua avea $${y / q} \\cdot ${q} = ${y}$ ${deWord(y)}lei.`,
        `În prima zi, înainte de cei ${a} lei, avea $${y} + ${a} = ${y + a}$ ${deWord(y + a)}lei, adică ${p - 1} din ${p} părți ale sumei inițiale:`,
        `O parte: $${y + a} : ${p - 1} = ${t}$, iar suma inițială: $${t} \\cdot ${p} = ${x}$ ${deWord(x)}lei.`,
        `Ana a avut la început ${de(x)} lei.`,
      ),
      verify: () => {
        const after1 = x - x / p - a
        return after1 === y && after1 - after1 / q - b === r
      },
    }
  }
}

// ================= grade VI =================

const TRIPLES: [number, number, number][] = [[4, 6, 9], [6, 8, 12], [5, 6, 8], [6, 10, 15], [8, 12, 18], [4, 5, 6], [3, 4, 5], [6, 9, 10], [4, 6, 10], [5, 8, 10]]

/** The smallest (or largest) three-digit number with remainders a − k, b − k, c − k: n + k is a common multiple. */
export function remainders(rng: Rng): Made {
  const [a, b, c] = pick(rng, TRIPLES)
  const k = int(rng, 1, a - 1)
  const L = lcm(lcm(a, b), c)
  const largest = rng() < 0.5
  const m = largest ? Math.floor((999 + k) / L) : Math.ceil((100 + k) / L)
  const n = L * m - k
  return {
    text: `Determinați cel mai ${largest ? 'mare' : 'mic'} număr natural de trei cifre care, împărțit pe rând la ${a}, ${b} și ${c}, dă resturile ${a - k}, ${b - k}, respectiv ${c - k}.`,
    solution: lines(
      `Din $n = ${a}c_1 + ${a - k}$ obținem $n + ${k} = ${a}c_1 + ${a} = ${a}(c_1 + 1)$, deci $${a} \\mid n + ${k}$. La fel, $${b} \\mid n + ${k}$ și $${c} \\mid n + ${k}$.`,
      `Așadar $n + ${k}$ este multiplu comun al numerelor ${a}, ${b}, ${c}, deci multiplu al lui $[${a}, ${b}, ${c}] = ${L}$:`,
      show(`n + ${k} = ${L}m \\Rightarrow n = ${L}m - ${k}`),
      `Cum $100 \\le n \\le 999$, ${largest ? `cea mai mare valoare este $m = ${m}$` : `cea mai mică valoare este $m = ${m}$`}, deci $n = ${L} \\cdot ${m} - ${k} = ${n}$.`,
    ),
    verify: () => {
      const ok = (v: number) => v % a === a - k && v % b === b - k && v % c === c - k
      const all = Array.from({ length: 900 }, (_, i) => 100 + i).filter(ok)
      return all.length > 0 && n === (largest ? all[all.length - 1] : all[0])
    },
  }
}

/** a·b and (a, b) given: a = dx, b = dy with (x, y) = 1. */
export function gcdProduct(rng: Rng): Made {
  for (;;) {
    const d = int(rng, 2, 12)
    const P = pick(rng, [6, 10, 12, 15, 18, 20, 24, 30, 36, 40, 42, 60])
    const xy: [number, number][] = divisors(P).filter((x) => x * x < P && gcd(x, P / x) === 1).map((x) => [x, P / x])
    if (xy.length < 2) continue
    const ab = xy.map(([x, y]) => [d * x, d * y] as [number, number])
    return {
      text: `Determinați numerele naturale $a$ și $b$, cu $a < b$, știind că $a \\cdot b = ${d * d * P}$ și $(a, b) = ${d}$.`,
      solution: lines(
        `Cum $(a, b) = ${d}$, scriem $a = ${d}x$, $b = ${d}y$, cu $(x, y) = 1$ și $x < y$. Atunci`,
        show(`${d}x \\cdot ${d}y = ${d * d * P} \\Rightarrow ${d * d}xy = ${d * d * P} \\Rightarrow xy = ${P}`),
        `Perechile de numere prime între ele cu produsul ${P} și $x < y$ sunt $(x, y) \\in \\{${pairs(xy)}\\}$, deci`,
        show(`(a, b) \\in \\{${pairs(ab)}\\}`),
      ),
      verify: () => {
        const found: string[] = []
        for (let a = 1; a * a < d * d * P; a++) {
          const b = (d * d * P) / a
          if (Number.isInteger(b) && gcd(a, b) === d) found.push(`${a},${b}`)
        }
        return found.join(';') === ab.map(([a, b]) => `${a},${b}`).join(';')
      },
    }
  }
}

/** How many numbers from 1 to N are divisible by a or by b (or by exactly one of them): inclusion and exclusion. */
export function countMultiples(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [2, 3, 4, 5, 6])
    const b = pick(rng, [3, 5, 6, 7, 8, 9, 10])
    if (a >= b) continue
    const N = int(rng, 100, 999)
    const L = lcm(a, b)
    const [ca, cb, cl] = [Math.floor(N / a), Math.floor(N / b), Math.floor(N / L)]
    const exactly = rng() < 0.5
    const answer = exactly ? ca + cb - 2 * cl : ca + cb - cl
    const count = (k: number) => `$${N} = ${k} \\cdot ${Math.floor(N / k)} + ${N % k}$, deci ${Math.floor(N / k)} multipli`
    return {
      text: `Câte numere naturale de la 1 la ${N} se divid ${exactly ? `cu exact unul dintre numerele ${a} și ${b}` : `cu ${a} sau cu ${b}`}?`,
      solution: lines(
        `Multiplii lui ${a}: ${count(a)}. Multiplii lui ${b}: ${count(b)}.`,
        `Numerele divizibile cu ambele sunt multiplii lui $[${a}, ${b}] = ${L}$: ${count(L)}. Ei au fost numărați de două ori.`,
        exactly
          ? show(`${ca} + ${cb} - 2 \\cdot ${cl} = ${answer}`) + `\n\nScădem de două ori numerele divizibile cu ambele, pentru că ele nu trebuie numărate deloc.`
          : show(`${ca} + ${cb} - ${cl} = ${answer}`),
      ),
      verify: () => {
        let s = 0
        for (let n = 1; n <= N; n++) {
          const [p, q] = [n % a === 0, n % b === 0]
          if (exactly ? p !== q : p || q) s++
        }
        return s === answer
      },
    }
  }
}

/** 1/(a(a+d)) + … + 1/(l(l+d)): each term is a difference, and the sum telescopes. */
export function telescopingFractions(rng: Rng): Made {
  const d = pick(rng, [1, 1, 2, 3])
  const a = int(rng, 1, 6)
  const m = int(rng, 5, 14)
  const last = a + (m - 1) * d
  const e = a + m * d
  const t = (k: number) => `\\frac{1}{${k} \\cdot ${k + d}}`
  const S = frac(m, a * e)
  return {
    text: `Calculați suma $S = ${t(a)} + ${t(a + d)} + ${t(a + 2 * d)} + \\ldots + ${t(last)}$.`,
    solution: d === 1
      ? lines(
        'Fiecare termen se scrie ca diferență: $\\frac{1}{k(k + 1)} = \\frac{1}{k} - \\frac{1}{k + 1}$. Termenii din mijloc se reduc:',
        show(`S = \\frac{1}{${a}} - \\frac{1}{${a + 1}} + \\frac{1}{${a + 1}} - \\frac{1}{${a + 2}} + \\ldots + \\frac{1}{${last}} - \\frac{1}{${e}} = \\frac{1}{${a}} - \\frac{1}{${e}} = ${S}`),
      )
      : lines(
        `Avem $\\frac{${d}}{k(k + ${d})} = \\frac{(k + ${d}) - k}{k(k + ${d})} = \\frac{1}{k} - \\frac{1}{k + ${d}}$, deci înmulțim suma cu ${d}:`,
        show(`${d}S = \\frac{1}{${a}} - \\frac{1}{${a + d}} + \\frac{1}{${a + d}} - \\frac{1}{${a + 2 * d}} + \\ldots + \\frac{1}{${last}} - \\frac{1}{${e}} = \\frac{1}{${a}} - \\frac{1}{${e}} = ${frac(e - a, a * e)}`),
        show(`S = ${frac(e - a, a * e)} : ${d} = ${S}`),
      ),
    verify: () => {
      let s = 0
      for (let i = 0; i < m; i++) s += 1 / ((a + i * d) * (a + i * d + d))
      return close(s, m / (a * e))
    },
  }
}

/** (an + b)/(cn + d) with ad − bc = ±1 is irreducible: a common divisor divides 1. */
export function irreducible(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 9)
    const c = int(rng, 2, 9)
    if (a === c || gcd(a, c) !== 1) continue
    const found: [number, number][] = []
    for (let b = 1; b <= 15; b++) for (let d = 1; d <= 15; d++) if (Math.abs(a * d - b * c) === 1) found.push([b, d])
    if (!found.length) continue
    const [b, d] = pick(rng, found)
    // the difference is taken with the larger term first, so that it comes out 1
    const [big, small] = a * d > b * c ? [a * d, b * c] : [b * c, a * d]
    return {
      text: `Arătați că fracția $\\frac{${a}n + ${b}}{${c}n + ${d}}$ este ireductibilă pentru orice număr natural $n$.`,
      solution: lines(
        `Fie $k$ un divizor comun al numărătorului și al numitorului: $k \\mid ${a}n + ${b}$ și $k \\mid ${c}n + ${d}$. Atunci $k$ divide și multiplii lor:`,
        show(`k \\mid ${c}(${a}n + ${b}) = ${a * c}n + ${b * c}, \\qquad k \\mid ${a}(${c}n + ${d}) = ${a * c}n + ${a * d}`),
        `Deci $k$ divide și diferența lor: $k \\mid (${a * c}n + ${big}) - (${a * c}n + ${small}) = 1$, adică $k = 1$. Numărătorul și numitorul sunt prime între ele, deci fracția este ireductibilă.`,
      ),
      verify: () => Math.abs(a * d - b * c) === 1 && Array.from({ length: 60 }, (_, n) => gcd(a * n + b, c * n + d)).every((g) => g === 1),
    }
  }
}

/** (an + b)/(n + c) = a + k/(n + c) is natural exactly when n + c divides k. */
export function naturalFraction(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6)
    const c = int(rng, 1, 6)
    const k = pick(rng, [6, 8, 10, 12, 15, 18, 20, 24, 28, 30, 36])
    const b = k + a * c
    const ds = divisors(k)
    const ns = ds.filter((t) => t >= c).map((t) => t - c)
    if (ns.length < 2) continue
    return {
      text: `Determinați numerele naturale $n$ pentru care fracția $\\frac{${a}n + ${b}}{n + ${c}}$ este număr natural.`,
      solution: lines(
        'Scoatem întregii din fracție:',
        show(`\\frac{${a}n + ${b}}{n + ${c}} = \\frac{${a}(n + ${c}) + ${k}}{n + ${c}} = ${a} + \\frac{${k}}{n + ${c}}`),
        `Fracția este număr natural exact când $n + ${c}$ este divizor al lui ${k}. Divizorii lui ${k} sunt $${ds.join(', ')}$, iar $n + ${c} \\ge ${c}$, deci`,
        show(`n + ${c} \\in \\{${ds.filter((t) => t >= c).join(', ')}\\} \\Rightarrow n \\in \\{${ns.join(', ')}\\}`),
      ),
      verify: () => {
        const all = Array.from({ length: k + 5 }, (_, n) => n).filter((n) => (a * n + b) % (n + c) === 0)
        return all.join(',') === ns.join(',')
      },
    }
  }
}

// ================= grade VII =================

/** 1/(√k + √(k+1)) = √(k+1) − √k, from √(p²) to √(q²): the sum is q − p. */
export function rootTelescoping(rng: Rng): Made {
  const p = int(rng, 1, 5)
  const q = p + int(rng, 2, 8)
  const [a, b] = [p * p, q * q]
  const t = (k: number) => `\\frac{1}{\\sqrt{${k}} + \\sqrt{${k + 1}}}`
  return {
    text: `Arătați că numărul $S = ${t(a)} + ${t(a + 1)} + \\ldots + ${t(b - 1)}$ este natural.`,
    solution: lines(
      'Raționalizăm fiecare termen, cu conjugatul numitorului:',
      show(`\\frac{1}{\\sqrt{k} + \\sqrt{k + 1}} = \\frac{\\sqrt{k + 1} - \\sqrt{k}}{(k + 1) - k} = \\sqrt{k + 1} - \\sqrt{k}`),
      'Termenii din mijloc se reduc:',
      show(`S = \\sqrt{${a + 1}} - \\sqrt{${a}} + \\sqrt{${a + 2}} - \\sqrt{${a + 1}} + \\ldots + \\sqrt{${b}} - \\sqrt{${b - 1}} = \\sqrt{${b}} - \\sqrt{${a}} = ${q} - ${p} = ${q - p} \\in \\mathbb{N}`),
    ),
    verify: () => {
      let s = 0
      for (let k = a; k < b; k++) s += 1 / (Math.sqrt(k) + Math.sqrt(k + 1))
      return close(s, q - p)
    },
  }
}

/** √x + √y against √z + √w with x + y = z + w: the squares differ only by the products. */
export function compareRoots(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 12, 40)
    const x = int(rng, 2, s - 2)
    const z = int(rng, 2, s - 2)
    const [y, w] = [s - x, s - z]
    if ([x, y, z, w].some(isSquare) || x === z || x === w || x * y === z * w) continue
    const aBig = x * y > z * w
    return {
      text: `Comparați numerele $a = \\sqrt{${x}} + \\sqrt{${y}}$ și $b = \\sqrt{${z}} + \\sqrt{${w}}$.`,
      solution: lines(
        'Ambele numere sunt pozitive, deci le comparăm pătratele:',
        show(`a^2 = ${x} + ${y} + 2\\sqrt{${x} \\cdot ${y}} = ${s} + 2\\sqrt{${x * y}}, \\qquad b^2 = ${z} + ${w} + 2\\sqrt{${z} \\cdot ${w}} = ${s} + 2\\sqrt{${z * w}}`),
        `Cum $${x * y} ${aBig ? '>' : '<'} ${z * w}$, avem $a^2 ${aBig ? '>' : '<'} b^2$, deci $a ${aBig ? '>' : '<'} b$.`,
      ),
      verify: () => (Math.sqrt(x) + Math.sqrt(y) > Math.sqrt(z) + Math.sqrt(w)) === aBig,
    }
  }
}

const SQUAREFREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]

/** √(m + r² + 2r√m) − √(m + r² − 2r√m) = 2r: double radicals as squares of sums. */
export function nestedRoot(rng: Rng): Made {
  const r = int(rng, 1, 4)
  const m = pick(rng, SQUAREFREE.filter((v) => v > r * r))
  const s = m + r * r
  const inner = `${2 * r}\\sqrt{${m}}`
  return {
    text: `Arătați că numărul $N = \\sqrt{${s} + ${inner}} - \\sqrt{${s} - ${inner}}$ este natural.`,
    solution: lines(
      `Scriem ${s} ca $${m} + ${r * r} = (\\sqrt{${m}})^2 + ${r}^2$, iar $${inner} = 2 \\cdot ${r} \\cdot \\sqrt{${m}}$, deci sub radicali avem pătrate:`,
      show(`${s} \\pm ${inner} = (\\sqrt{${m}} \\pm ${r})^2`),
      `Cum $\\sqrt{${m}} > ${r}$, ambele paranteze sunt pozitive și $\\sqrt{(\\sqrt{${m}} \\pm ${r})^2} = \\sqrt{${m}} \\pm ${r}$:`,
      show(`N = (\\sqrt{${m}} + ${r}) - (\\sqrt{${m}} - ${r}) = ${2 * r} \\in \\mathbb{N}`),
    ),
    verify: () => close(Math.sqrt(s + 2 * r * Math.sqrt(m)) - Math.sqrt(s - 2 * r * Math.sqrt(m)), 2 * r),
  }
}

/** xy + ax + by = c in natural numbers: (x + b)(y + a) = c + ab. */
export function integerEquation(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 6)
    const b = int(rng, 1, 6)
    const N = pick(rng, [12, 18, 20, 24, 30, 36, 40, 48])
    const c = N - a * b
    if (c <= 0) continue
    const sols: [number, number][] = divisors(N).filter((u) => u >= b && N / u >= a).map((u) => [u - b, N / u - a])
    if (sols.length < 2) continue
    const k = (n: number) => (n === 1 ? '' : String(n))
    return {
      text: `Determinați numerele naturale $x$ și $y$ pentru care $${poly([[1, 'xy'], [a, 'x'], [b, 'y']])} = ${c}$.`,
      solution: lines(
        `Adunăm ${a * b} în ambii membri, ca să descompunem în factori:`,
        show(`xy + ${k(a)}x + ${k(b)}y + ${a * b} = ${N} \\Rightarrow x(y + ${a}) + ${k(b)}(y + ${a}) = ${N} \\Rightarrow (x + ${b})(y + ${a}) = ${N}`),
        `Cum $x + ${b} \\ge ${b}$ și $y + ${a} \\ge ${a}$, căutăm divizorii lui ${N} care îndeplinesc aceste condiții: $x + ${b} \\in \\{${sols.map(([x]) => x + b).join(', ')}\\}$, cu $y + ${a} = ${N} : (x + ${b})$. Obținem`,
        show(`(x, y) \\in \\{${pairs(sols)}\\}`),
      ),
      verify: () => {
        const all: string[] = []
        for (let x = 0; x <= N; x++) for (let y = 0; y <= N; y++) if (x * y + a * x + b * y === c) all.push(`${x},${y}`)
        return all.join(';') === sols.map(([x, y]) => `${x},${y}`).join(';')
      },
    }
  }
}

/** x² + y² − 2ax − 2by + c = (x − a)² + (y − b)² + m: the minimum m, reached at x = a, y = b. */
export function minimumSquares(rng: Rng): Made {
  const a = nonZero(rng, -6, 6)
  const b = nonZero(rng, -6, 6)
  const m = int(rng, -10, 10)
  const c = a * a + b * b + m
  const E = poly([[1, 'x^2'], [1, 'y^2'], [-2 * a, 'x'], [-2 * b, 'y'], [c, '']])
  const sq = (v: string, t: number) => `(${plus(v, -t)})^2`
  return {
    text: `Determinați valoarea minimă a expresiei $E(x, y) = ${E}$, unde $x$ și $y$ sunt numere reale, și valorile lui $x$ și $y$ pentru care se obține.`,
    solution: lines(
      `Formăm pătrate perfecte: $${c} = ${a * a} + ${b * b}${m === 0 ? '' : ` ${m < 0 ? '-' : '+'} ${Math.abs(m)}`}$, deci`,
      show(`E(x, y) = (${poly([[1, 'x^2'], [-2 * a, 'x'], [a * a, '']])}) + (${poly([[1, 'y^2'], [-2 * b, 'y'], [b * b, '']])})${m === 0 ? '' : ` ${m < 0 ? '-' : '+'} ${Math.abs(m)}`} = ${sq('x', a)} + ${sq('y', b)}${m === 0 ? '' : ` ${m < 0 ? '-' : '+'} ${Math.abs(m)}`}`),
      `Un pătrat este cel puțin 0, deci $E(x, y) \\ge ${m}$, cu egalitate când ambele pătrate sunt 0: $x = ${a}$ și $y = ${b}$.`,
      `Valoarea minimă este ${m < 0 ? `$${m}$` : m}, pentru $x = ${a}$, $y = ${b}$.`,
    ),
    verify: () => {
      const f = (x: number, y: number) => x * x + y * y - 2 * a * x - 2 * b * y + c
      return f(a, b) === m && [[1, 0], [0, 1], [-1, 0], [0, -1], [0.5, 0.5]].every(([u, v]) => f(a + u, b + v) > m)
    },
  }
}

/** x + y = s and xy = p: x² + y², |x − y| and x/y + y/x, without finding x and y. */
export function sumProduct(rng: Rng): Made {
  for (;;) {
    const s = nonZero(rng, -9, 9)
    const p = nonZero(rng, -12, 12)
    const D = s * s - 4 * p
    if (D <= 0 || isSquare(D)) continue
    const sq = s * s - 2 * p
    return {
      text: `Numerele reale $x$ și $y$ verifică $x + y = ${s}$ și $xy = ${p}$. Calculați $x^2 + y^2$, $|x - y|$ și $\\frac{x}{y} + \\frac{y}{x}$.`,
      solution: lines(
        show(`x^2 + y^2 = (x + y)^2 - 2xy = ${s * s} - 2 \\cdot ${p < 0 ? `(${p})` : p} = ${sq}`),
        show(`(x - y)^2 = x^2 + y^2 - 2xy = ${sq} - 2 \\cdot ${p < 0 ? `(${p})` : p} = ${D} \\Rightarrow |x - y| = \\sqrt{${D}}${root(D) === `\\sqrt{${D}}` ? '' : ` = ${root(D)}`}`),
        show(`\\frac{x}{y} + \\frac{y}{x} = \\frac{x^2 + y^2}{xy} = \\frac{${sq}}{${p}} = ${frac(sq, p)}`),
      ),
      verify: () => {
        const x = (s + Math.sqrt(D)) / 2
        const y = (s - Math.sqrt(D)) / 2
        return close(x + y, s) && close(x * y, p) && close(x * x + y * y, sq) && close(Math.abs(x - y), Math.sqrt(D)) && close(x / y + y / x, sq / p)
      },
    }
  }
}

// ================= grade VIII =================

/** x² + y² + z² + K = 2ax + 2by + 2cz: a sum of three squares equal to 0. */
export function squaresZero(rng: Rng): Made {
  const a = nonZero(rng, -6, 6)
  const b = nonZero(rng, -6, 6)
  const c = nonZero(rng, -6, 6)
  const K = a * a + b * b + c * c
  const sq = (v: string, t: number) => `(${plus(v, -t)})^2`
  return {
    text: `Determinați numerele reale $x$, $y$, $z$ pentru care $x^2 + y^2 + z^2 + ${K} = ${poly([[2 * a, 'x'], [2 * b, 'y'], [2 * c, 'z']])}$, apoi calculați $xyz$.`,
    solution: lines(
      `Trecem totul în stânga și scriem $${K} = ${a * a} + ${b * b} + ${c * c}$:`,
      show(`(${poly([[1, 'x^2'], [-2 * a, 'x'], [a * a, '']])}) + (${poly([[1, 'y^2'], [-2 * b, 'y'], [b * b, '']])}) + (${poly([[1, 'z^2'], [-2 * c, 'z'], [c * c, '']])}) = 0`),
      show(`${sq('x', a)} + ${sq('y', b)} + ${sq('z', c)} = 0`),
      `O sumă de pătrate este 0 doar dacă fiecare pătrat este 0: $x = ${a}$, $y = ${b}$, $z = ${c}$, deci $xyz = ${a * b * c}$.`,
    ),
    verify: () => a * a + b * b + c * c + K === 2 * a * a + 2 * b * b + 2 * c * c,
  }
}

/** x + y = s, xy = p: x³ + y³ = s³ − 3ps and x⁴ + y⁴ = (s² − 2p)² − 2p². */
export function cubesFromSumProduct(rng: Rng): Made {
  for (;;) {
    const s = nonZero(rng, -6, 6)
    const p = nonZero(rng, -8, 8)
    const D = s * s - 4 * p
    if (D <= 0 || isSquare(D)) continue
    const sq = s * s - 2 * p
    const cube = s ** 3 - 3 * p * s
    const four = sq * sq - 2 * p * p
    const ps = (n: number) => (n < 0 ? `(${n})` : String(n))
    return {
      text: `Numerele reale $x$ și $y$ verifică $x + y = ${s}$ și $xy = ${p}$. Calculați $x^3 + y^3$ și $x^4 + y^4$.`,
      solution: lines(
        show(`x^3 + y^3 = (x + y)^3 - 3xy(x + y) = ${ps(s)}^3 - 3 \\cdot ${ps(p)} \\cdot ${ps(s)} = ${s ** 3} ${-3 * p * s < 0 ? '-' : '+'} ${Math.abs(3 * p * s)} = ${cube}`),
        show(`x^2 + y^2 = (x + y)^2 - 2xy = ${s * s} ${-2 * p < 0 ? '-' : '+'} ${Math.abs(2 * p)} = ${sq}`),
        show(`x^4 + y^4 = (x^2 + y^2)^2 - 2(xy)^2 = ${ps(sq)}^2 - 2 \\cdot ${ps(p)}^2 = ${sq * sq} - ${2 * p * p} = ${four}`),
      ),
      verify: () => {
        const x = (s + Math.sqrt(D)) / 2
        const y = (s - Math.sqrt(D)) / 2
        return close(x ** 3 + y ** 3, cube) && close(x ** 4 + y ** 4, four)
      },
    }
  }
}

/** (x + p)(x + p + d)(x + p + 2d)(x + p + 3d) + k = (t + d²)² − d⁴ + k, with t = (x + p)(x + p + 3d). */
export function productOfFour(rng: Rng): Made {
  const d = pick(rng, [1, 1, 2])
  const p = int(rng, -5, 5)
  const k = int(rng, -10, 20)
  const f = (i: number) => `(${plus('x', p + i * d)})`
  const tail = k === 0 ? '' : ` ${k < 0 ? '-' : '+'} ${Math.abs(k)}`
  const t = poly([[1, 'x^2'], [2 * p + 3 * d, 'x'], [p * (p + 3 * d), '']])
  const t2 = poly([[1, 'x^2'], [2 * p + 3 * d, 'x'], [(p + d) * (p + 2 * d), '']])
  const min = k - d ** 4
  const c0 = -2 * p - 3 * d
  const root5 = `${d === 1 ? '' : d}\\sqrt{5}`
  const x = `\\frac{${c0 === 0 ? '' : `${c0} `}\\pm ${root5}}{2}`
  return {
    text: `Determinați valoarea minimă a expresiei $E(x) = ${f(0)}${f(1)}${f(2)}${f(3)}${tail}$, unde $x$ este număr real.`,
    solution: lines(
      'Înmulțim primul factor cu ultimul și pe cei din mijloc între ei:',
      show(`${f(0)}${f(3)} = ${t} = t, \\qquad ${f(1)}${f(2)} = ${t2} = t + ${2 * d * d}`),
      show(`E = t(t + ${2 * d * d})${tail} = t^2 + ${2 * d * d}t + ${d ** 4} - ${d ** 4}${tail} = (t + ${d * d})^2 ${min < 0 ? '-' : '+'} ${Math.abs(min)}`),
      `Deci $E(x) \\ge ${min}$, cu egalitate când $t = -${d * d}$, adică $${t} = -${d * d}$, ecuație care are soluțiile reale $x = ${x}$.`,
      `Valoarea minimă este ${min < 0 ? `$${min}$` : min}.`,
    ),
    verify: () => {
      const E = (v: number) => (v + p) * (v + p + d) * (v + p + 2 * d) * (v + p + 3 * d) + k
      const at = (-2 * p - 3 * d + d * Math.sqrt(5)) / 2
      let lowest = Infinity
      for (let v = -30; v <= 30; v += 0.001) lowest = Math.min(lowest, E(v))
      return close(E(at), min) && lowest >= min - 1e-9 && lowest - min < 1e-3
    },
  }
}

/** How many ways N = u·v with u ≤ v of the same parity: the solutions of x² − y² = N. */
const sameParity = (N: number) => divisors(N).filter((u) => u * u <= N && (u + N / u) % 2 === 0).length

/** x² − y² = N in natural numbers: (x − y)(x + y) = N, with factors of the same parity. */
export function differenceOfSquares(rng: Rng): Made {
  // a number with at least two solutions, so that the case analysis is worth doing
  let N = int(rng, 15, 400)
  while (sameParity(N) < 2) N = int(rng, 15, 400)
  const all = divisors(N).filter((u) => u * u <= N).map((u) => [u, N / u] as [number, number])
  const good = all.filter(([u, v]) => (u + v) % 2 === 0)
  const sols = good.map(([u, v]) => [(u + v) / 2, (v - u) / 2] as [number, number])
  return {
    text: `Determinați perechile de numere naturale $(x, y)$ pentru care $x^2 - y^2 = ${N}$.`,
    solution: lines(
      `Descompunem: $(x - y)(x + y) = ${N}$, cu $x - y \\le x + y$. Cum $(x - y) + (x + y) = 2x$ este par, cei doi factori au aceeași paritate.`,
      `Scrierile lui ${N} ca produs $u \\cdot v$ cu $u \\le v$ sunt: ${all.map(([u, v]) => `$${u} \\cdot ${v}$`).join(', ')}. Păstrăm doar perechile cu factori de aceeași paritate: ${good.length ? good.map(([u, v]) => `$${u} \\cdot ${v}$`).join(', ') : 'niciuna'}.`,
      `Din $x - y = u$, $x + y = v$ obținem $x = \\frac{u + v}{2}$, $y = \\frac{v - u}{2}$:`,
      show(`(x, y) \\in \\{${pairs(sols)}\\}`),
    ),
    verify: () => {
      const found: string[] = []
      for (let y = 0; y <= N; y++) {
        const x = Math.sqrt(N + y * y)
        if (Number.isInteger(x)) found.push(`${x},${y}`)
      }
      return found.sort().join(';') === sols.map(([x, y]) => `${x},${y}`).sort().join(';') && sols.length > 0
    },
  }
}

/** n² + 2cn + b is a perfect square: m² − (n + c)² = b − c². */
export function squareQuadratic(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 1, 6)
    const K = pick(rng, [15, 21, 24, 32, 35, 40, 45, 48, 63, 77, 80, 96])
    const b = K + c * c
    const all = divisors(K).filter((u) => u * u < K).map((u) => [u, K / u] as [number, number])
    const good = all.filter(([u, v]) => (u + v) % 2 === 0)
    const ns = good.map(([u, v]) => (v - u) / 2 - c).filter((n) => n >= 0).sort((x, y) => x - y)
    if (!ns.length) continue
    return {
      text: `Determinați numerele naturale $n$ pentru care numărul $n^2 + ${2 * c}n + ${b}$ este pătrat perfect.`,
      solution: lines(
        `Formăm un pătrat: $n^2 + ${2 * c}n + ${b} = (n + ${c})^2 + ${K}$. Dacă acesta este $m^2$, cu $m$ natural, atunci`,
        show(`m^2 - (n + ${c})^2 = ${K} \\Rightarrow (m - n - ${c})(m + n + ${c}) = ${K}`),
        `Factorii au aceeași paritate (suma lor, $2m$, e pară), iar primul e mai mic. Variantele: ${good.map(([u, v]) => `$${u} \\cdot ${v}$`).join(', ')}. Din $n + ${c} = \\frac{v - u}{2}$ obținem $n + ${c} \\in \\{${good.map(([u, v]) => (v - u) / 2).join(', ')}\\}$ și păstrăm doar valorile cu $n \\ge 0$:`,
        show(`n \\in \\{${ns.join(', ')}\\}`),
      ),
      verify: () => {
        const found = Array.from({ length: K + c + 5 }, (_, n) => n).filter((n) => isSquare(n * n + 2 * c * n + b))
        return found.join(',') === ns.join(',')
      },
    }
  }
}

/** p and p² + k both prime, with k even and k ≡ 2 (mod 3): only p = 3. */
export function primeSquare(rng: Rng): Made {
  const k = pick(rng, [2, 8, 14, 20, 32, 38, 44, 50, 62, 74, 80])
  return {
    text: `Determinați numerele prime $p$ pentru care și numărul $p^2 + ${k}$ este prim.`,
    solution: lines(
      `Pentru $p = 2$: $4 + ${k} = ${4 + k}$ este par și mai mare decât 2, deci nu este prim.`,
      `Pentru $p = 3$: $9 + ${k} = ${9 + k}$, care este prim.`,
      `Pentru $p > 3$, $p$ nu se divide cu 3, deci $p = 3m \\pm 1$ și $p^2 = 9m^2 \\pm 6m + 1 = M_3 + 1$. Atunci $p^2 + ${k} = M_3 + ${1 + k}$ se divide cu 3 (pentru că ${1 + k} se divide cu 3) și este mai mare decât 3, deci nu este prim.`,
      'Singura soluție este $p = 3$.',
    ),
    verify: () => {
      const ps = Array.from({ length: 1000 }, (_, i) => i).filter((p) => isPrime(p) && isPrime(p * p + k))
      return ps.length === 1 && ps[0] === 3
    },
  }
}
