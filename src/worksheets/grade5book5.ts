// Grade V forms from "Matematică, clasa a V-a, partea I", Mate 2000+ Consolidare (Paralela 45), pp. 118–183,
// photographed by the user on 19 November 2026 (folder `clasa5\Culegere mate 2000+ partea I\Fractii ordinare`):
// Unit 5, the divisibility of natural numbers (divisors and multiples, even and odd numbers, the criteria, prime
// numbers), and the ordinary fractions. These chapters exist already in the app, so every kind here joins an existing
// kind (`joins`). The levels follow the stars of the book: Înțelegere * → 1, Aplicare și exersare ** → 2,
// Aprofundare și performanță *** and Supermate **** → 3. Every form names its page and exercise.
import type { Made } from './generators'
import { de, gcd, int, pick, shuffle, type Rng } from './tex'
import type { GradeKind } from './grade5puisor2'

type Form = (rng: Rng) => Made
const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
/** A whole number in LaTeX, with thin spaces between groups of three digits from 10 000 up. */
const nr = (n: number) => (Math.abs(n) < 10000 ? String(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
/** "3, 5 și 8" */
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))
const divisors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0)
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const digitSum = (n: number) => String(n).split('').reduce((s, c) => s + Number(c), 0)
const bar = (s: string) => `\\overline{${s}}`

// ============================== divisors and multiples (pp. 118–121) ==============================

// p. 120, ex. 1: all the divisors of a number, found in pairs
const allDivisors: Form = (rng) => {
  const n = pick(rng, [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72, 75, 78, 80, 84, 88, 90, 96, 98, 100])
  const d = divisors(n)
  const pairs = d.filter((x) => x * x <= n).map((x) => (x * x === n ? `${n} = ${x} \\cdot ${x}` : `${n} = ${x} \\cdot ${n / x}`))
  return {
    text: `Scrieți toți divizorii numărului ${n} și precizați care dintre ei sunt divizori proprii.`,
    solution: lines(
      `Căutăm perechile de numere al căror produs este ${n}: $${pairs.join('$, $')}$.`,
      `Divizorii lui ${n} sunt: ${list(d)}. Divizorii improprii sunt 1 și ${n}, iar cei proprii: ${list(d.slice(1, -1))}.`,
    ),
    verify: () => d.every((x) => n % x === 0) && d.length === 2 * pairs.length - (Number.isInteger(Math.sqrt(n)) ? 1 : 0),
  }
}

// p. 120, ex. 4 b): the multiples of a number between two others
const multiplesBetween: Form = (rng) => {
  const k = int(rng, 3, 13)
  const a = int(rng, 10, 60)
  const b = a + int(rng, 3, 7) * k
  const m = Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i).filter((x) => x % k === 0)
  return {
    text: `Scrieți toți multiplii lui ${k} cuprinși între ${a} și ${b}.`,
    solution: lines(`Multiplii lui ${k} sunt $0, ${k}, ${2 * k}, ${3 * k}, \\ldots$ (se obțin înmulțind pe ${k} cu $0, 1, 2, 3, \\ldots$).`, `Între ${a} și ${b} se află: ${list(m)}.`),
    verify: () => m.length > 0 && m.every((x) => x % k === 0 && x > a && x < b),
  }
}

// p. 120, ex. 6, 9: the common divisors, and the greatest of them
const commonDivisors: Form = (rng) => {
  for (;;) {
    const g = pick(rng, [4, 6, 8, 9, 10, 12, 14, 15, 18])
    const [p, q] = [int(rng, 2, 7), int(rng, 2, 7)]
    if (p === q || gcd(p, q) !== 1) continue
    const [a, b] = [g * p, g * q]
    const common = divisors(a).filter((d) => b % d === 0)
    return {
      text: `Aflați toți divizorii comuni ai numerelor ${a} și ${b} și precizați care este cel mai mare dintre ei.`,
      solution: lines(
        `Divizorii lui ${a}: ${list(divisors(a))}.`,
        `Divizorii lui ${b}: ${list(divisors(b))}.`,
        `Divizorii comuni sunt ${list(common)}, iar cel mai mare dintre ei este ${g}.`,
      ),
      verify: () => common[common.length - 1] === g && gcd(a, b) === g,
    }
  }
}

// p. 120, ex. 7, 8: the least common multiple, by listing the multiples
const smallestCommonMultiple: Form = (rng) => {
  const three = rng() < 0.4
  const nums = three ? shuffle(rng, [2, 3, 4, 5, 6]).slice(0, 3).sort((x, y) => x - y) : [int(rng, 3, 12), int(rng, 3, 12)].sort((x, y) => x - y)
  if (nums[0] === nums[1]) nums[1]++
  const m = nums.reduce(lcm)
  const big = nums[nums.length - 1]
  const tried = Array.from({ length: m / big }, (_, i) => (i + 1) * big)
  return {
    text: `Care este cel mai mic număr natural nenul, multiplu comun pentru numerele ${list(nums)}?`,
    solution: lines(
      `Scriem multiplii nenuli ai celui mai mare număr, ${big}, până găsim unul care se divide și cu ${nums.length === 2 ? nums[0] : list(nums.slice(0, -1))}: ${tried.join(', ')}.`,
      `Cel mai mic multiplu comun nenul este ${m}.`,
    ),
    verify: () => nums.every((x) => m % x === 0) && tried.slice(0, -1).every((t) => nums.some((x) => t % x !== 0)),
  }
}

// p. 120, ex. 10: how many divisors a number has
const countDivisors: Form = (rng) => {
  const n = pick(rng, [18, 28, 30, 36, 40, 42, 45, 48, 50, 52, 54, 56, 60, 63, 64, 66, 70, 72, 75, 78, 80, 81, 84, 88, 90, 96, 98, 100, 104, 105, 108, 110, 112, 117, 120, 126, 128, 130, 132, 135, 140, 144, 150])
  const d = divisors(n)
  return {
    text: `Câți divizori are numărul ${n}?`,
    solution: lines(`Divizorii lui ${n} sunt: ${list(d)}.`, `Numărul ${n} are ${d.length} divizori.`),
    verify: () => d.length === divisors(n).length && d[0] === 1 && d[d.length - 1] === n,
  }
}

// p. 120, ex. 12, 13: the greatest number of three digits (the least of four) that is a multiple of k
const extremeMultiple: Form = (rng) => {
  const k = int(rng, 13, 97)
  const greatest = rng() < 0.5
  if (greatest) {
    const q = Math.floor(999 / k)
    return {
      text: `Aflați cel mai mare număr natural de trei cifre care este multiplu de ${k}.`,
      solution: lines(`Împărțim cel mai mare număr de trei cifre la ${k}: $999 = ${k} \\cdot ${q} + ${999 - k * q}$.`, `Cel mai mare multiplu de ${k} de trei cifre este $${k} \\cdot ${q} = ${k * q}$.`),
      verify: () => k * q <= 999 && k * (q + 1) > 999 && k * q >= 100,
    }
  }
  const q = Math.ceil(1000 / k)
  return {
    text: `Aflați cel mai mic număr natural de patru cifre care este multiplu de ${k}.`,
    solution: lines(
      `Împărțim cel mai mic număr de patru cifre la ${k}: $1000 = ${k} \\cdot ${Math.floor(1000 / k)} + ${1000 % k}$.`,
      1000 % k === 0 ? `Deci 1000 este chiar multiplu de ${k}.` : `Multiplul următor este $${k} \\cdot ${q} = ${k * q}$, cel mai mic multiplu de ${k} de patru cifre.`,
    ),
    verify: () => k * q >= 1000 && k * (q - 1) < 1000,
  }
}

// p. 120, ex. 16: three-digit numbers with given digits, divisible by 2, by 5 or by 10
const digitsDivisible: Form = (rng) => {
  for (;;) {
    const [a, b] = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2)
    const d = pick(rng, [2, 5, 10])
    const digits = [0, a, b]
    const all: number[] = []
    for (const x of digits) for (const y of digits) for (const z of digits) if (x !== 0 && x !== y && y !== z && x !== z) all.push(100 * x + 10 * y + z)
    const ok = all.filter((n) => n % d === 0).sort((m, n) => m - n)
    if (ok.length < 2) continue
    const rule = d === 2 ? 'ultima cifră este pară (0, 2, 4, 6 sau 8)' : d === 5 ? 'ultima cifră este 0 sau 5' : 'ultima cifră este 0'
    return {
      text: `Folosind cifrele 0, ${a} și ${b}, o singură dată fiecare, scrieți toate numerele de trei cifre divizibile cu ${d}.`,
      solution: lines(`Un număr se divide cu ${d} dacă ${rule}. Prima cifră nu poate fi 0.`, `Numerele sunt: ${list(ok)}.`),
      verify: () => ok.every((n) => n % d === 0 && n >= 100),
    }
  }
}

// p. 120, ex. 19: how many two-digit (three-digit) numbers divide by k
const countMultiples: Form = (rng) => {
  const three = rng() < 0.5
  const k = three ? int(rng, 11, 60) : int(rng, 3, 19)
  const [lo, hi] = three ? [100, 999] : [10, 99]
  const first = Math.ceil(lo / k)
  const last = Math.floor(hi / k)
  return {
    text: `Câte numere naturale de ${three ? 'trei' : 'două'} cifre se divid cu ${k}?`,
    solution: lines(
      `Numerele sunt $${k} \\cdot ${first} = ${k * first}, \\ ${k} \\cdot ${first + 1} = ${k * (first + 1)}, \\ \\ldots, \\ ${k} \\cdot ${last} = ${k * last}$.`,
      `Factorii merg de la ${first} la ${last}, deci sunt $${last} - ${first} + 1 = ${last - first + 1}$ numere.`,
    ),
    verify: () => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((x) => x % k === 0).length === last - first + 1,
  }
}

// p. 121, ex. 22: the sum of all three-digit multiples of k (Gauss)
const sumOfMultiples: Form = (rng) => {
  const k = int(rng, 11, 75)
  const first = Math.ceil(100 / k)
  const last = Math.floor(999 / k)
  const cnt = last - first + 1
  const S = (k * (first + last) * cnt) / 2
  return {
    text: `Calculați suma tuturor numerelor de trei cifre divizibile cu ${k}.`,
    solution: lines(
      `Numerele sunt $${k} \\cdot ${first}, ${k} \\cdot ${first + 1}, \\ldots, ${k} \\cdot ${last}$, deci suma este $${k} \\cdot (${first} + ${first + 1} + \\ldots + ${last})$.`,
      `Suma din paranteză are $${last} - ${first} + 1 = ${cnt}$ termeni: $${first} + \\ldots + ${last} = \\frac{(${first} + ${last}) \\cdot ${cnt}}{2} = ${nr(((first + last) * cnt) / 2)}$.`,
      show(`S = ${k} \\cdot ${nr(((first + last) * cnt) / 2)} = ${nr(S)}`),
    ),
    verify: () => {
      let s = 0
      for (let x = 100; x <= 999; x++) if (x % k === 0) s += x
      return s === S
    },
  }
}

// p. 120, ex. 18: a number has three primes among its divisors: write four more divisors
const moreDivisors: Form = (rng) => {
  const [p, q, r] = shuffle(rng, [2, 3, 5, 7, 11, 13]).slice(0, 3).sort((x, y) => x - y)
  return {
    text: `Un număr natural nenul $a$ are printre divizorii săi numerele ${p}, ${q} și ${r}. Scrieți încă patru divizori diferiți de aceștia ai numărului $a$.`,
    solution: lines(
      `Numerele ${p}, ${q} și ${r} sunt prime și îl divid pe $a$, deci și produsele lor îl divid pe $a$.`,
      `De exemplu: $${p} \\cdot ${q} = ${p * q}$, $${p} \\cdot ${r} = ${p * r}$, $${q} \\cdot ${r} = ${q * r}$ și $${p} \\cdot ${q} \\cdot ${r} = ${p * q * r}$ (sau 1).`,
    ),
    verify: () => [p * q, p * r, q * r].every((x) => (p * q * r) % x === 0),
  }
}

// ============================== even and odd numbers (pp. 121–123) ==============================

// p. 121, ex. 2; p. 122, ex. 3: the place of a number in the sequence of even (odd) numbers
const placeInSequence: Form = (rng) => {
  const even = rng() < 0.5
  const n = even ? 2 * int(rng, 10, 15000) : 2 * int(rng, 10, 15000) + 1
  const place = even ? n / 2 + 1 : (n + 1) / 2
  return {
    text: `Scrieți șirul numerelor naturale ${even ? 'pare' : 'impare'} și calculați al câtelea termen al șirului este $${nr(n)}$.`,
    solution: even
      ? lines('Șirul este $0, 2, 4, 6, \\ldots$: termenul de pe locul $k$ este $2(k - 1)$.', show(`2(k - 1) = ${nr(n)} \\Rightarrow k - 1 = ${nr(n / 2)} \\Rightarrow k = ${nr(place)}`))
      : lines('Șirul este $1, 3, 5, 7, \\ldots$: termenul de pe locul $k$ este $2k - 1$.', show(`2k - 1 = ${nr(n)} \\Rightarrow 2k = ${nr(n + 1)} \\Rightarrow k = ${nr(place)}`)),
    verify: () => (even ? 2 * (place - 1) === n : 2 * place - 1 === n),
  }
}

// p. 122, ex. 5: three (two) consecutive even or odd numbers with a given sum
const consecutiveWithSum: Form = (rng) => {
  const even = rng() < 0.5
  const k = pick(rng, [2, 3, 4, 5])
  const first = even ? 2 * int(rng, 3, 400) : 2 * int(rng, 3, 400) + 1
  const terms = Array.from({ length: k }, (_, i) => first + 2 * i)
  const S = terms.reduce((s, x) => s + x, 0)
  const word = { 2: 'două', 3: 'trei', 4: 'patru', 5: 'cinci' }[k]
  return {
    text: `Aflați ${word} numere naturale ${even ? 'pare' : 'impare'} consecutive, știind că suma lor este $${nr(S)}$.`,
    solution: lines(
      `Două numere ${even ? 'pare' : 'impare'} consecutive diferă prin 2. Dacă primul este $n$, numerele sunt ${terms.map((_, i) => (i === 0 ? '$n$' : `$n + ${2 * i}$`)).join(', ')}.`,
      show(`${k}n + ${S - k * first} = ${nr(S)} \\Rightarrow ${k}n = ${nr(k * first)} \\Rightarrow n = ${first}`),
      `Numerele sunt ${list(terms)}.`,
    ),
    verify: () => terms.every((x) => x % 2 === (even ? 0 : 1)) && k * first + (S - k * first) === S,
  }
}

// p. 122, ex. 11: the parity of expressions in a and b
const parityOfExpressions: Form = (rng) => {
  const [p, q] = [2 * int(rng, 1, 6), 2 * int(rng, 1, 8)]
  const [r, s] = [2 * int(rng, 1, 6), 2 * int(rng, 1, 9)]
  const c = int(rng, 1, 40)
  const xTex = `${p}a + ${q}b`
  const yTex = `${r}a + ${s}b + ${c}`
  return {
    text: `Dacă $a$ și $b$ sunt două numere naturale, $x = ${xTex}$ și $y = ${yTex}$, aflați ce paritate au numerele $x$ și $y$.`,
    solution: lines(
      `Numerele $${p}a$, $${q}b$, $${r}a$ și $${s}b$ sunt pare (au un factor par), iar suma a două numere pare este pară, deci $x$ este **par**.`,
      `$y$ este suma dintre numărul par $${r}a + ${s}b$ și ${c}, care este ${c % 2 ? 'impar' : 'par'}, deci $y$ este **${c % 2 ? 'impar' : 'par'}**.`,
    ),
    verify: () => [0, 1, 2, 3].every((a) => (p * a + q * (a + 1)) % 2 === 0 && (r * a + s * (a + 1) + c) % 2 === c % 2),
  }
}

// p. 122, ex. 6–10: a number written as a sum of k consecutive even (odd) numbers
const sumOfConsecutive: Form = (rng) => {
  const even = rng() < 0.5
  const k = int(rng, 2, 6)
  const first = even ? 2 * int(rng, 1, 30) : 2 * int(rng, 0, 30) + 1
  const terms = Array.from({ length: k }, (_, i) => first + 2 * i)
  const S = terms.reduce((s, x) => s + x, 0)
  const word = { 2: 'două', 3: 'trei', 4: 'patru', 5: 'cinci', 6: 'șase' }[k]
  return {
    text: `Scrieți numărul ${S} ca sumă a ${word} numere naturale ${even ? 'pare' : 'impare'} consecutive.`,
    solution: lines(
      `Dacă primul număr este $n$, suma este $${terms.map((_, i) => (i === 0 ? 'n' : `(n + ${2 * i})`)).join(' + ')} = ${k}n + ${S - k * first}$.`,
      show(`${k}n + ${S - k * first} = ${S} \\Rightarrow ${k}n = ${k * first} \\Rightarrow n = ${first}`),
      show(`${S} = ${terms.join(' + ')}`),
    ),
    verify: () => terms.reduce((s, x) => s + x, 0) === S && terms.every((x) => x % 2 === (even ? 0 : 1)),
  }
}

// p. 122, ex. 12, 14: k distinct nonzero even numbers whose sum is the least possible
const leastSumDistinct: Form = (rng) => {
  const even = rng() < 0.5
  const k = int(rng, 5, 15)
  const terms = Array.from({ length: k }, (_, i) => (even ? 2 * (i + 1) : 2 * i + 1))
  const S = terms.reduce((s, x) => s + x, 0)
  return {
    text: `Suma a ${k} numere naturale nenule ${even ? 'pare' : 'impare'} distincte este ${S}. Aflați numerele.`,
    solution: lines(
      `Cele mai mici ${k} numere naturale nenule ${even ? 'pare' : 'impare'} distincte sunt ${terms[0]}, ${terms[1]}, …, ${terms[k - 1]}, cu suma`,
      show(even ? `2 + 4 + \\ldots + ${terms[k - 1]} = 2 \\cdot (1 + 2 + \\ldots + ${k}) = 2 \\cdot \\frac{${k} \\cdot ${k + 1}}{2} = ${S}` : `1 + 3 + \\ldots + ${terms[k - 1]} = ${k} \\cdot ${k} = ${S}`),
      `Orice alte ${k} numere de acest fel au suma mai mare, deci numerele sunt chiar ${terms.join(', ')}.`,
    ),
    verify: () => S === (even ? k * (k + 1) : k * k),
  }
}

// p. 122, ex. 23, 24: the parity of n(n + 1) + c
const parityOfProduct: Form = (rng) => {
  const c = int(rng, 1, 99)
  const plus = rng() < 0.5
  const expr = plus ? `n(n + 1) + ${c}` : `(n + 1)(n + 2) + ${c}`
  return {
    text: `Aflați ce paritate are numărul $${expr}$, unde $n$ este un număr natural.`,
    solution: lines(
      `${plus ? '$n$ și $n + 1$' : '$n + 1$ și $n + 2$'} sunt numere consecutive, deci unul dintre ele este par, iar produsul lor este par.`,
      `Adunând numărul ${c % 2 ? 'impar' : 'par'} ${c}, obținem un număr **${c % 2 ? 'impar' : 'par'}**.`,
    ),
    verify: () => [0, 1, 2, 5].every((n) => ((plus ? n * (n + 1) : (n + 1) * (n + 2)) + c) % 2 === c % 2),
  }
}

// p. 122, ex. 19, 20: can k odd numbers add up to S?
const oddNumbersSum: Form = (rng) => {
  const k = int(rng, 3, 25)
  const S = 2 * int(rng, 300, 1500) + (rng() < 0.5 ? 1 : 0)
  const can = S % 2 === k % 2
  return {
    text: `Stabiliți dacă există ${k} numere naturale impare care, adunate, să aibă suma $${nr(S)}$.`,
    solution: lines(
      `Suma a două numere impare este pară, deci suma a ${k} numere impare are paritatea lui ${k}: este ${k % 2 ? 'impară' : 'pară'}.`,
      can
        ? `Numărul $${nr(S)}$ este ${S % 2 ? 'impar' : 'par'}, deci asemenea numere există, de exemplu ${k - 1} numere egale cu 1 și numărul $${nr(S - (k - 1))}$.`
        : `Numărul $${nr(S)}$ este ${S % 2 ? 'impar' : 'par'}, deci nu există asemenea numere.`,
    ),
    verify: () => !can || (S - (k - 1)) % 2 === 1,
  }
}

// p. 123, ex. 28: a = p·3^(n+1)·5^n + q·3^(n+1)·5^(n+1): factor out and find n
const factorPowers: Form = (rng) => {
  const p = int(rng, 2, 30)
  const q = int(rng, 2, 30)
  const n = int(rng, 1, 3)
  const f = p + 5 * q
  const a = f * 3 ** (n + 1) * 5 ** n
  return {
    text: `Se consideră numărul $a = ${p} \\cdot 3^{n+1} \\cdot 5^{n} + ${q} \\cdot 3^{n+1} \\cdot 5^{n+1}$, unde $n$ este număr natural. Arătați că $${f} \\mid a$ și determinați $n$ pentru care $a = ${nr(a)}$.`,
    solution: lines(
      show(`a = 3^{n+1} \\cdot 5^{n} \\cdot (${p} + ${q} \\cdot 5) = ${f} \\cdot 3^{n+1} \\cdot 5^{n}`),
      `deci $${f} \\mid a$. Din $${f} \\cdot 3^{n+1} \\cdot 5^{n} = ${nr(a)}$ obținem $3^{n+1} \\cdot 5^{n} = ${nr(a / f)} = 3^{${n + 1}} \\cdot 5^{${n}}$, deci $n = ${n}$.`,
    ),
    verify: () => a % f === 0 && a / f === 3 ** (n + 1) * 5 ** n,
  }
}

// ============================== the criteria of divisibility (pp. 123–124) ==============================

// p. 124, ex. 1: pick the numbers divisible by 2, 3, 5, 9 or 10
const pickDivisible: Form = (rng) => {
  const d = pick(rng, [2, 3, 5, 9, 10])
  const nums = [...new Set(Array.from({ length: 10 }, () => int(rng, 10, 999)))].sort((x, y) => x - y)
  while (!nums.some((x) => x % d === 0)) nums[0] = d * int(rng, 3, 90)
  nums.sort((x, y) => x - y)
  const ok = nums.filter((x) => x % d === 0)
  const rule = {
    2: 'ultima cifră este pară',
    3: 'suma cifrelor se divide cu 3',
    5: 'ultima cifră este 0 sau 5',
    9: 'suma cifrelor se divide cu 9',
    10: 'ultima cifră este 0',
  }[d]
  return {
    text: `Fie numerele ${list(nums)}. Scrieți numerele divizibile cu ${d}.`,
    solution: lines(
      `Un număr se divide cu ${d} dacă ${rule}.`,
      d === 3 || d === 9 ? `Sumele cifrelor: ${nums.map((x) => `${x} → ${digitSum(x)}`).join(', ')}.` : '',
      `Numerele divizibile cu ${d} sunt: ${list(ok)}.`,
    ),
    verify: () => ok.every((x) => x % d === 0 && (d % 3 !== 0 || digitSum(x) % d === 0)),
  }
}

// p. 124, ex. 5, 6: the digit x for which a number with one unknown digit divides by 2 and 3 (by 2, by 5)
const unknownLastDigit: Form = (rng) => {
  for (;;) {
    const a = int(rng, 1, 9)
    const b = int(rng, 0, 9)
    const [d, rule] = pick(rng, [[6, 'cu 2 și cu 3'], [2, 'cu 2'], [5, 'cu 5'], [15, 'cu 3 și cu 5'], [10, 'cu 2 și cu 5']] as [number, string][])
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => (100 * a + 10 * b + x) % d === 0)
    if (!xs.length) continue
    const nums = xs.map((x) => 100 * a + 10 * b + x)
    return {
      text: `Determinați numerele naturale de forma $${bar(`${a}${b}x`)}$ care sunt divizibile ${rule}.`,
      solution: lines(
        d % 2 === 0 ? 'Pentru divizibilitatea cu 2, ultima cifră $x$ trebuie să fie pară.' : '',
        d % 5 === 0 ? `Pentru divizibilitatea cu 5, $x$ este 0 sau 5${d === 10 ? '; cu 2 și cu 5 deodată, $x = 0$' : ''}.` : '',
        d % 3 === 0 ? `Pentru divizibilitatea cu 3, suma cifrelor $${a} + ${b} + x = ${a + b} + x$ trebuie să se dividă cu 3.` : '',
        `Obținem $x \\in \\{${xs.join(', ')}\\}$, deci numerele sunt ${list(nums)}.`,
      ),
      verify: () => nums.every((n) => n % d === 0) && xs.length === Array.from({ length: 10 }, (_, x) => x).filter((x) => (100 * a + 10 * b + x) % d === 0).length,
    }
  }
}

// p. 124, ex. 7, 8: two unknown digits: divisible by 3 (or 9) and by 5, or by 3 and not by 9
const twoUnknownDigits: Form = (rng) => {
  const a = int(rng, 1, 9)
  const b = int(rng, 0, 9)
  const kind = int(rng, 0, 1)
  const found: number[] = []
  for (let x = 0; x <= 9; x++)
    for (const y of kind === 0 ? [0, 5] : [x]) {
      const n = 1000 * a + 100 * x + 10 * b + y
      if (kind === 0 ? n % 15 === 0 : n % 3 === 0 && n % 9 !== 0) found.push(n)
    }
  if (kind === 0)
    return {
      text: `Determinați numerele naturale de forma $${bar(`${a}x${b}y`)}$ care sunt divizibile cu 3 și cu 5.`,
      solution: lines(
        'Pentru divizibilitatea cu 5, $y = 0$ sau $y = 5$.',
        `Pentru divizibilitatea cu 3, suma cifrelor $${a} + x + ${b} + y$ trebuie să se dividă cu 3.`,
        `Numerele sunt: ${list(found)}.`,
      ),
      verify: () => found.length > 0 && found.every((n) => n % 15 === 0),
    }
  return {
    text: `Determinați numerele naturale de forma $${bar(`${a}x${b}x`)}$ care sunt divizibile cu 3 și nu sunt divizibile cu 9.`,
    solution: lines(
      `Suma cifrelor este $${a} + ${b} + 2x = ${a + b} + 2x$; ea trebuie să se dividă cu 3, dar nu cu 9.`,
      found.length ? `Numerele sunt: ${list(found)}.` : 'Nu există asemenea numere.',
    ),
    verify: () => found.every((n) => n % 3 === 0 && n % 9 !== 0 && digitSum(n) % 3 === 0),
  }
}

// p. 124, ex. 10: the least and the greatest number of the form d x x divisible by 2 (3, 9)
const extremeOfForm: Form = (rng) => {
  for (;;) {
    const a = int(rng, 1, 9)
    const d = pick(rng, [2, 3, 9])
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => (100 * a + 11 * x) % d === 0)
    if (xs.length < 2) continue
    const [lo, hi] = [100 * a + 11 * xs[0], 100 * a + 11 * xs[xs.length - 1]]
    return {
      text: `Scrieți cel mai mic și cel mai mare număr de forma $${bar(`${a}xx`)}$ divizibil cu ${d}.`,
      solution: lines(
        d === 2 ? 'Ultima cifră, $x$, trebuie să fie pară.' : `Suma cifrelor $${a} + 2x$ trebuie să se dividă cu ${d}.`,
        `Valorile potrivite ale lui $x$ sunt ${list(xs)}, deci cel mai mic număr este ${lo}, iar cel mai mare este ${hi}.`,
      ),
      verify: () => lo % d === 0 && hi % d === 0 && lo <= hi,
    }
  }
}

// p. 124, ex. 14 a): n divides 1 + 2 + … + n, for n odd
const gaussDivides: Form = (rng) => {
  const n = 2 * int(rng, 50, 1500) + 1
  return {
    text: `Arătați că $${nr(n)} \\mid (1 + 2 + 3 + \\ldots + ${nr(n)})$.`,
    solution: show(`1 + 2 + \\ldots + ${nr(n)} = \\frac{${nr(n)} \\cdot ${nr(n + 1)}}{2} = ${nr(n)} \\cdot ${nr((n + 1) / 2)}`) + `\n\ndeci suma este multiplu de $${nr(n)}$.`,
    verify: () => ((n * (n + 1)) / 2) % n === 0,
  }
}

// p. 124, ex. 9: x = p·a + q·b with a common factor is its multiple
const commonFactor: Form = (rng) => {
  for (;;) {
    const g = pick(rng, [2, 3, 4, 5, 6, 7])
    const [u, v] = [int(rng, 1, 6), int(rng, 1, 6)]
    if (gcd(u, v) !== 1) continue
    const [p, q] = [g * u, g * v]
    return {
      text: `Dacă $a$ și $b$ sunt numere naturale și $x = ${p}a + ${q}b$, arătați că $x$ este multiplu de ${g}.`,
      solution: show(`x = ${p}a + ${q}b = ${g} \\cdot ${u === 1 ? 'a' : `${u}a`} + ${g} \\cdot ${v === 1 ? 'b' : `${v}b`} = ${g}(${u === 1 ? 'a' : `${u}a`} + ${v === 1 ? 'b' : `${v}b`})`) + `\n\ndeci $x$ este multiplu de ${g}.`,
      verify: () => p % g === 0 && q % g === 0,
    }
  }
}

// ============================== prime and composite numbers (pp. 125–127) ==============================

const isPrime = (n: number) => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every((d) => n % d !== 0)
const PRIMES = Array.from({ length: 200 }, (_, i) => i).filter(isPrime)

// p. 125 (the algorithm), p. 126, ex. 2: is a number prime? divide by the primes until the quotient is smaller
const checkPrime: Form = (rng) => {
  for (;;) {
    const n = 2 * int(rng, 60, 499) + 1
    if (n % 5 === 0 || (rng() < 0.5 && !isPrime(n))) continue
    const steps: string[] = []
    let verdict = ''
    for (const p of PRIMES) {
      const q = Math.floor(n / p)
      steps.push(`${n} = ${p} \\cdot ${q} + ${n % p}`)
      if (n % p === 0) {
        verdict = `Împărțirea la ${p} dă restul 0, deci ${n} este număr **compus** ($${n} = ${p} \\cdot ${q}$).`
        break
      }
      if (q < p) {
        verdict = `Câtul ${q} a devenit mai mic decât împărțitorul ${p} fără niciun rest 0, deci ${n} este număr **prim**.`
        break
      }
    }
    return {
      text: `Verificați dacă numărul ${n} este prim sau compus.`,
      solution: lines('Împărțim numărul, pe rând, la numerele prime 2, 3, 5, 7, …, până când obținem un rest 0 sau un cât mai mic decât împărțitorul:', show(steps.join(' \\\\ ')), verdict),
      verify: () => verdict.includes('prim**') === isPrime(n),
    }
  }
}

// p. 126, ex. 4: the digit that makes a two-digit number prime
const digitMakesPrime: Form = (rng) => {
  for (;;) {
    const first = rng() < 0.5
    const k = int(rng, 1, 9)
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => (first ? x > 0 && isPrime(10 * x + k) : isPrime(10 * k + x)))
    if (!xs.length) continue
    const form = first ? bar(`a${k}`) : bar(`${k}a`)
    const nums = xs.map((x) => (first ? 10 * x + k : 10 * k + x))
    return {
      text: `Aflați cifra $a$, știind că numărul $${form}$ este număr prim.`,
      solution: lines(`Încercăm toate cifrele: numerele prime de forma $${form}$ sunt ${list(nums)}.`, `Deci $a \\in \\{${xs.join(', ')}\\}$.`),
      verify: () => nums.every(isPrime),
    }
  }
}

// p. 126, ex. 5 b): p·a + q·b = S with q even and S even: a = 2
const primesFromEquation: Form = (rng) => {
  for (;;) {
    const p = pick(rng, [3, 5, 7, 9, 11])
    const q = 2 * int(rng, 1, 7)
    const b = pick(rng, PRIMES.filter((x) => x > 2 && x < 60))
    const S = 2 * p + q * b
    return {
      text: `Determinați numerele prime $a$ și $b$, știind că $${p}a + ${q}b = ${S}$.`,
      solution: lines(
        `Numerele $${q}b$ și ${S} sunt pare, deci și $${p}a$ este par. Cum ${p} este impar, $a$ este par, iar singurul număr prim par este 2.`,
        show(`a = 2 \\Rightarrow ${q}b = ${S} - ${2 * p} = ${q * b} \\Rightarrow b = ${b}`),
        `Numărul ${b} este prim, deci $a = 2$ și $b = ${b}$.`,
      ),
      verify: () => p * 2 + q * b === S && isPrime(b),
    }
  }
}

// p. 126, ex. 8; p. 127, ex. 10: a prime plus an odd number is odd (a prime times an odd number is even): the prime is 2
const primeIsTwo: Form = (rng) => {
  const odd = 2 * int(rng, 20, 600) + 1
  if (rng() < 0.5) {
    const S = odd + 2
    return {
      text: `Suma dintre un număr prim și un număr impar este ${S}. Determinați numerele.`,
      solution: lines(
        `Suma este impară, iar unul dintre termeni este impar, deci celălalt (numărul prim) este par. Singurul număr prim par este 2.`,
        `Numerele sunt 2 și $${S} - 2 = ${odd}$.`,
      ),
      verify: () => S % 2 === 1 && odd % 2 === 1,
    }
  }
  const N = 2 * odd
  return {
    text: `Produsul dintre un număr natural impar și un număr prim este egal cu ${N}. Determinați numerele.`,
    solution: lines(
      `Produsul este par, iar un factor este impar, deci numărul prim este par, adică 2.`,
      `Numărul impar este $${N} : 2 = ${odd}$.`,
    ),
    verify: () => N === 2 * odd,
  }
}

// p. 127, ex. 15: two primes with a given odd sum, or a given product
const primesSumOrProduct: Form = (rng) => {
  const sum = rng() < 0.5
  if (sum) {
    const b = pick(rng, PRIMES.filter((x) => x > 10 && x < 200))
    const S = b + 2
    return {
      text: `Determinați numerele prime $a$ și $b$, cu $a < b$, care îndeplinesc condiția $a + b = ${S}$.`,
      solution: lines(
        `Suma ${S} este impară, deci un termen este par și celălalt impar. Singurul număr prim par este 2.`,
        `Deci $a = 2$ și $b = ${S} - 2 = ${b}$, care este prim.`,
      ),
      verify: () => isPrime(b) && S % 2 === 1,
    }
  }
  const [a, b] = shuffle(rng, PRIMES.filter((x) => x < 50)).slice(0, 2).sort((x, y) => x - y)
  return {
    text: `Determinați numerele prime $a$ și $b$, cu $a < b$, care îndeplinesc condiția $a \\cdot b = ${a * b}$.`,
    solution: lines(
      `Descompunem: $${a * b} = ${a} \\cdot ${b}$, iar ${a} și ${b} sunt prime. Altă scriere ca produs de doi factori este doar $1 \\cdot ${a * b}$, dar 1 nu este prim.`,
      `Deci $a = ${a}$ și $b = ${b}$.`,
    ),
    verify: () => isPrime(a) && isPrime(b) && a < b,
  }
}

// p. 127, ex. 16: the primes xy for which k divides yx
const primesWithReverse: Form = (rng) => {
  for (;;) {
    if (rng() < 0.6) {
      // the same idea with the sum of the digits: x + y = s
      const s = int(rng, 4, 16)
      const found = PRIMES.filter((n) => n >= 10 && n < 100 && Math.floor(n / 10) + (n % 10) === s)
      if (!found.length) continue
      const cands = Array.from({ length: 9 }, (_, i) => i + 1).filter((x) => s - x >= 0 && s - x <= 9).map((x) => 10 * x + s - x)
      return {
        text: `Scrieți numerele prime de forma $${bar('xy')}$ cu proprietatea că $x + y = ${s}$.`,
        solution: lines(
          `Numerele de două cifre cu suma cifrelor ${s} sunt ${list(cands)}.`,
          `Dintre ele sunt prime: ${list(found)}.`,
        ),
        verify: () => found.every((n) => isPrime(n) && cands.includes(n)),
      }
    }
    const k = pick(rng, [3, 7, 11, 13, 17, 19])
    const found = PRIMES.filter((n) => n >= 10 && n < 100 && (10 * (n % 10) + Math.floor(n / 10)) % k === 0)
    if (!found.length) continue
    return {
      text: `Scrieți numerele prime de forma $${bar('xy')}$ cu proprietatea că $${k} \\mid ${bar('yx')}$.`,
      solution: lines(
        `Numerele prime de două cifre sunt 11, 13, 17, 19, 23, 29, 31, 37, …, 97. Le inversăm cifrele și păstrăm doar pe cele pentru care $${bar('yx')}$ se divide cu ${k}:`,
        found.map((n) => `$${n} \\to ${10 * (n % 10) + Math.floor(n / 10)} = ${k} \\cdot ${(10 * (n % 10) + Math.floor(n / 10)) / k}$`).join(', ') + '.',
        `Numerele sunt: ${list(found)}.`,
      ),
      verify: () => found.every((n) => isPrime(n) && (10 * (n % 10) + Math.floor(n / 10)) % k === 0),
    }
  }
}

// p. 127, ex. 20: the digit x for which two numbers are both prime
const bothPrime: Form = (rng) => {
  for (;;) {
    const [a, b] = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2).sort((x, y) => x - y)
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => isPrime(10 * a + x) && isPrime(10 * b + x))
    if (!xs.length) continue
    return {
      text: `Determinați cifra $x$ pentru care numerele naturale de forma $${bar(`${a}x`)}$ și $${bar(`${b}x`)}$ sunt simultan numere prime.`,
      solution: lines(
        'Un număr prim de două cifre se termină în 1, 3, 7 sau 9, deci încercăm doar aceste cifre:',
        [1, 3, 7, 9].map((x) => `$x = ${x}$: ${10 * a + x} ${isPrime(10 * a + x) ? 'prim' : 'compus'}, ${10 * b + x} ${isPrime(10 * b + x) ? 'prim' : 'compus'}`).join('; ') + '.',
        `Deci $x \\in \\{${xs.join(', ')}\\}$.`,
      ),
      verify: () => xs.every((x) => isPrime(10 * a + x) && isPrime(10 * b + x)),
    }
  }
}

// p. 127, ex. 23: a prime, a + b + c = S and b − c = d with S − d even: a = 2
const primeInSystem: Form = (rng) => {
  const c = int(rng, 3, 40)
  const d = int(rng, 5, 40)
  const b = c + d
  const S = 2 + b + c
  return {
    text: `Determinați numerele naturale $a$, $b$ și $c$, știind că $a$ este număr prim, $a + b + c = ${S}$ și $b - c = ${d}$.`,
    solution: lines(
      `Din $b = c + ${d}$ obținem $a + 2c + ${d} = ${S}$, adică $a + 2c = ${S - d}$. Numărul ${S - d} și $2c$ sunt pare, deci $a$ este par; fiind prim, $a = 2$.`,
      `Atunci $2c = ${S - d - 2}$, $c = ${c}$ și $b = ${c} + ${d} = ${b}$.`,
    ),
    verify: () => 2 + b + c === S && b - c === d,
  }
}

// p. 127, ex. 26: n² + kn prime
const squarePlusPrime: Form = (rng) => {
  const k = pick(rng, PRIMES.filter((p) => p > 3 && p < 120)) - 1
  return {
    text: `Determinați numărul natural $n$, astfel încât $n^2 + ${k}n$ să fie număr prim.`,
    solution: lines(
      `$n^2 + ${k}n = n(n + ${k})$. Un număr prim are doar divizorii 1 și el însuși, iar $n < n + ${k}$, deci $n = 1$ (pentru $n = 0$ produsul este 0, care nu e prim).`,
      `Pentru $n = 1$ obținem $1 + ${k} = ${k + 1}$, care este prim. Deci $n = 1$.`,
    ),
    verify: () => isPrime(k + 1) && [0, 2, 3, 4].every((n) => !isPrime(n * (n + k))),
  }
}

// p. 127, ex. 22: A = 2^(m+1)·5^m + c: the sum of its digits, and A is composite
const powerPlusComposite: Form = (rng) => {
  const m = int(rng, 3, 12)
  const two = rng() < 0.5
  const lead = two ? 2 : 5
  const c = pick(rng, two ? [1, 4, 7] : [1, 4, 7])
  const A = `${lead}${'0'.repeat(m - 1)}${c}`
  const s = lead + c
  const tex = two ? `2^{${m + 1}} \\cdot 5^{${m}}` : `2^{${m}} \\cdot 5^{${m + 1}}`
  return {
    text: `Se consideră numărul $A = ${tex} + ${c}$. Calculați suma cifrelor numărului $A$ și arătați că $A$ este număr compus.`,
    solution: lines(
      show(`${tex} = ${lead} \\cdot 2^{${m}} \\cdot 5^{${m}} = ${lead} \\cdot 10^{${m}}, \\quad A = ${lead}\\underbrace{0\\ldots0}_{${m - 1}}${c}`),
      `Suma cifrelor lui $A$ este $${lead} + ${c} = ${s}$, care se divide cu 3, deci $3 \\mid A$. Cum $A > 3$, $A$ are un divizor propriu, deci este număr compus.`,
    ),
    verify: () => s % 3 === 0 && A.length === m + 1 && digitSum(Number(A.slice(0, 15))) === s,
  }
}

// ============================== the chapter tests (pp. 128–130) ==============================

// p. 128, test 1, V.1: the remainders by 2, 5 and 10, from the last digit
const remaindersByCriteria: Form = (rng) => {
  const n = int(rng, 1000, 99999)
  const u = n % 10
  return {
    text: `Folosind criteriile de divizibilitate cu 2, cu 5 și cu 10, stabiliți restul împărțirii numărului $${nr(n)}$ la 2, la 5 și la 10.`,
    solution: lines(
      `Restul depinde doar de ultima cifră, ${u}.`,
      `La 10: restul este chiar ultima cifră, ${u}. La 2: ${u} este ${u % 2 ? 'impar, deci restul este 1' : 'par, deci restul este 0'}. La 5: ${u} dă la împărțirea cu 5 restul ${u % 5}.`,
    ),
    verify: () => n % 10 === u && n % 2 === u % 2 && n % 5 === u % 5,
  }
}

// p. 128, test 1, II.3; p. 129, test 2, V.2 b): the sum of the even (odd) numbers aa…a
const repdigitSum: Form = (rng) => {
  const len = int(rng, 2, 4)
  const kind = pick(rng, ['pare', 'impare', 'divizibile cu 3'] as const)
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((a) => (kind === 'pare' ? a % 2 === 0 : kind === 'impare' ? a % 2 === 1 : (a * len) % 3 === 0))
  const rep = Number('1'.repeat(len))
  const S = rep * digits.reduce((s, a) => s + a, 0)
  const form = bar('a'.repeat(len))
  return {
    text: `Calculați suma tuturor numerelor ${kind} de forma $${form}$.`,
    solution: lines(
      kind === 'divizibile cu 3' ? `Suma cifrelor lui $${form}$ este $${len}a$, deci trebuie ca $3 \\mid ${len}a$.` : '',
      `Numerele sunt ${list(digits.map((a) => String(a).repeat(len)))}, adică $${rep} \\cdot a$ cu $a \\in \\{${digits.join(', ')}\\}$.`,
      show(`S = ${rep} \\cdot (${digits.join(' + ')}) = ${rep} \\cdot ${S / rep} = ${nr(S)}`),
    ),
    verify: () => digits.length > 0 && digits.map((a) => Number(String(a).repeat(len))).reduce((s, x) => s + x, 0) === S,
  }
}

// p. 128, test 1, II.1–2: the least (greatest) number of three distinct digits divisible by d
const distinctDigitsExtreme: Form = (rng) => {
  const d = pick(rng, [2, 3, 4, 5, 6, 9, 11, 12, 15])
  const least = rng() < 0.5
  const ok = (n: number) => new Set(String(n)).size === 3 && n % d === 0
  let n = least ? 100 : 999
  while (!ok(n)) n += least ? 1 : -1
  return {
    text: `Aflați cel mai ${least ? 'mic' : 'mare'} număr natural de trei cifre distincte, divizibil cu ${d}.`,
    solution: lines(
      `Pornim de la ${least ? '100 în sus' : '999 în jos'} și căutăm primul număr cu cifrele distincte care se divide cu ${d}.`,
      `Acesta este ${n} ($${n} = ${d} \\cdot ${n / d}$).`,
    ),
    verify: () => ok(n),
  }
}

// p. 129, test 2, V.2 a): the parity of a from p·a + q·b − c = 0
const parityFromEquation: Form = (rng) => {
  const p = pick(rng, [3, 5, 7, 9])
  const q = 2 * int(rng, 1, 5)
  const c = int(rng, 20, 99)
  return {
    text: `Stabiliți paritatea numărului natural $a$, știind că $${p}a + ${q}b - ${c} = 0$ și $b$ este un număr natural oarecare.`,
    solution: lines(
      `Din egalitate, $${p}a = ${c} - ${q}b$. Numărul $${q}b$ este par, iar ${c} este ${c % 2 ? 'impar' : 'par'}, deci $${p}a$ este ${c % 2 ? 'impar' : 'par'}.`,
      `Cum ${p} este impar, $a$ are aceeași paritate ca $${p}a$: $a$ este **${c % 2 ? 'impar' : 'par'}**.`,
    ),
    verify: () => [0, 1, 2, 3].every((b) => (c - q * b) % 2 === c % 2),
  }
}

// p. 128, test 1, V.2 b): how many numbers 1xy with x ≠ y divide by 10 (by 5, by 2)
const countWithDistinct: Form = (rng) => {
  const a = int(rng, 1, 9)
  const d = pick(rng, [2, 5, 10])
  const found: number[] = []
  for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) if (x !== y && (100 * a + 10 * x + y) % d === 0) found.push(100 * a + 10 * x + y)
  const ys = [...new Set(found.map((n) => n % 10))]
  return {
    text: `Precizați câte numere de forma $${bar(`${a}xy`)}$, cu $x \\ne y$, sunt divizibile cu ${d}.`,
    solution: lines(
      `Ultima cifră trebuie să fie ${d === 10 ? '0' : d === 5 ? '0 sau 5' : 'pară'}: $y \\in \\{${ys.join(', ')}\\}$.`,
      `Pentru fiecare valoare a lui $y$, cifra $x$ poate fi oricare dintre cele 10 cifre, în afară de $y$: câte 9 valori. Sunt $${ys.length} \\cdot 9 = ${found.length}$ numere.`,
    ),
    verify: () => found.length === ys.length * 9,
  }
}

// p. 130, test 3, V.2 b): does 1 + 2 + … + n divide by k?
const gaussDivisibleBy: Form = (rng) => {
  const n = int(rng, 10, 60)
  const k = int(rng, 3, 13)
  const S = (n * (n + 1)) / 2
  return {
    text: `Stabiliți dacă numărul $1 + 2 + 3 + \\ldots + ${n}$ se divide cu ${k}.`,
    solution: lines(
      show(`1 + 2 + \\ldots + ${n} = \\frac{${n} \\cdot ${n + 1}}{2} = ${S}`),
      S % k === 0 ? `$${S} = ${k} \\cdot ${S / k}$, deci suma se divide cu ${k}.` : `$${S} = ${k} \\cdot ${Math.floor(S / k)} + ${S % k}$, deci suma nu se divide cu ${k}.`,
    ),
    verify: () => Array.from({ length: n }, (_, i) => i + 1).reduce((s, x) => s + x, 0) === S,
  }
}

// p. 130, test 3, V.2 c): the numbers xyzz divisible by 2, with x + y = s and x < y
const xyzzForms: Form = (rng) => {
  for (;;) {
    const s = int(rng, 3, 15)
    const pairs: [number, number][] = []
    for (let x = 1; x <= 9; x++) if (s - x > x && s - x <= 9) pairs.push([x, s - x])
    if (!pairs.length) continue
    const d = pick(rng, [2, 5])
    const zs = d === 2 ? [0, 2, 4, 6, 8] : [0, 5]
    const nums = pairs.flatMap(([x, y]) => zs.map((z) => 1000 * x + 100 * y + 11 * z))
    return {
      text: `Scrieți numerele naturale de forma $${bar('xyzz')}$, știind că sunt divizibile cu ${d}, $x + y = ${s}$ și $x < y$.`,
      solution: lines(
        `Din $x + y = ${s}$ și $x < y$: ${pairs.map(([x, y]) => `$x = ${x}, y = ${y}$`).join('; ')}.`,
        `Divizibilitatea cu ${d} cere ca ultima cifră $z$ să fie ${d === 2 ? 'pară' : '0 sau 5'}: $z \\in \\{${zs.join(', ')}\\}$.`,
        `Numerele sunt: ${list(nums)}.`,
      ),
      verify: () => nums.every((n) => n % d === 0),
    }
  }
}

// p. 129, test 2, V.1 b): 10^n + c divides by 3 for every n
const tenPowerPlus: Form = (rng) => {
  for (;;) {
    const c = int(rng, 100, 999)
    if ((1 + digitSum(c)) % 3 !== 0) continue
    const k = (1 + digitSum(c)) % 9 === 0 && rng() < 0.5 ? 9 : 3
    return {
      text: `Arătați că numărul $10^n + ${c}$ este divizibil cu ${k}, pentru orice număr natural nenul $n$.`,
      solution: lines(
        `$10^n = \\underbrace{9\\ldots9}_{n} + 1$, deci $10^n + ${c} = \\underbrace{9\\ldots9}_{n} + ${c + 1}$.`,
        `Numărul $\\underbrace{9\\ldots9}_{n}$ are suma cifrelor $9n$, deci se divide cu ${k}, iar ${c + 1} are suma cifrelor ${digitSum(c + 1)}, deci se divide și el cu ${k}. Suma lor se divide cu ${k}.`,
      ),
      verify: () => [1, 2, 3, 4, 5, 6].every((n) => (10 ** n + c) % k === 0),
    }
  }
}

// p. 130, test 3, II.1: A = 2^n·3^(n+a) + 2^(n+b)·3^n = 6^n·(3^a + 2^b)
const sixPowerFactor: Form = (rng) => {
  const a = int(rng, 1, 4)
  const b = int(rng, 1, 5)
  const f = 3 ** a + 2 ** b
  return {
    text: `Se consideră numărul $A = 2^{n} \\cdot 3^{n+${a}} + 2^{n+${b}} \\cdot 3^{n}$, unde $n$ este un număr natural. Arătați că $A$ este multiplu al numărului ${f}.`,
    solution: show(`A = 2^{n} \\cdot 3^{n} \\cdot 3^{${a}} + 2^{n} \\cdot 2^{${b}} \\cdot 3^{n} = 6^{n} \\cdot (${3 ** a} + ${2 ** b}) = ${f} \\cdot 6^{n}`),
    verify: () => [0, 1, 2, 3].every((n) => (2 ** n * 3 ** (n + a) + 2 ** (n + b) * 3 ** n) === f * 6 ** n),
  }
}

// p. 130, test 3, III.1: a^n + b is composite for every n (a, b odd)
const oddPowerComposite: Form = (rng) => {
  const a = pick(rng, [3, 5, 7, 9, 11, 13])
  const b = 2 * int(rng, 1, 12) + 1
  return {
    text: `Arătați că, pentru orice număr natural $n$, numărul $${a}^{n} + ${b}$ este compus.`,
    solution: lines(
      `$${a}^{n}$ este un produs de numere impare, deci este impar; adunat cu numărul impar ${b}, dă un număr par.`,
      `În plus, $${a}^{n} + ${b} \\ge 1 + ${b} = ${b + 1} > 2$, deci numărul este par și mai mare decât 2: are divizorul propriu 2, deci este compus.`,
    ),
    verify: () => [0, 1, 2, 3].every((n) => (a ** n + b) % 2 === 0 && a ** n + b > 2),
  }
}

// p. 131, I.1: the least number of three (four) digits divisible by several numbers
const leastDivisibleByAll: Form = (rng) => {
  const ds = shuffle(rng, [2, 3, 4, 5, 6, 7, 9]).slice(0, int(rng, 2, 3)).sort((x, y) => x - y)
  const m = ds.reduce(lcm)
  const four = rng() < 0.4
  const lo = four ? 1000 : 100
  const n = Math.ceil(lo / m) * m
  return {
    text: `Aflați cel mai mic număr natural de ${four ? 'patru' : 'trei'} cifre divizibil cu ${list(ds)}.`,
    solution: lines(
      `Un număr divizibil cu ${list(ds)} este multiplu al celui mai mic multiplu comun al lor, ${m}.`,
      `Cel mai mic multiplu al lui ${m} cu ${four ? 'patru' : 'trei'} cifre este $${m} \\cdot ${n / m} = ${n}$.`,
    ),
    verify: () => ds.every((d) => n % d === 0) && n >= lo && n - m < lo,
  }
}

// p. 131, I.2: the sum of the divisors of n greater than k
const sumOfLargeDivisors: Form = (rng) => {
  const n = pick(rng, [18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 72, 80, 84, 90, 96, 100])
  const d = divisors(n)
  const k = pick(rng, d.slice(1, -2))
  const big = d.filter((x) => x > k)
  const S = big.reduce((s, x) => s + x, 0)
  return {
    text: `Calculați suma divizorilor lui ${n} mai mari decât ${k}.`,
    solution: lines(`Divizorii lui ${n} sunt ${list(d)}.`, `Cei mai mari decât ${k} sunt ${list(big)}, cu suma $${big.join(' + ')} = ${S}$.`),
    verify: () => big.every((x) => n % x === 0 && x > k),
  }
}

// p. 131, II.3: the least common multiple of a and b greater than k
const commonMultipleAbove: Form = (rng) => {
  const [a, b] = shuffle(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 2).sort((x, y) => x - y)
  const m = lcm(a, b)
  const k = int(rng, m + 1, 6 * m)
  const n = Math.floor(k / m) * m + m
  return {
    text: `Aflați cel mai mic multiplu comun al numerelor ${a} și ${b} mai mare decât ${k}.`,
    solution: lines(
      `Multiplii comuni ai lui ${a} și ${b} sunt multiplii celui mai mic multiplu comun, ${m}: ${m}, ${2 * m}, ${3 * m}, …`,
      `Primul dintre ei mai mare decât ${k} este ${n}.`,
    ),
    verify: () => n % a === 0 && n % b === 0 && n > k && n - m <= k,
  }
}

// p. 131, III a), c): x + a divides b; k divides M + x with x < L
const unknownInDivisibility: Form = (rng) => {
  if (rng() < 0.5) {
    const b = pick(rng, [12, 15, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48])
    const a = int(rng, 1, 6)
    const ds = divisors(b).filter((d) => d >= a)
    const xs = ds.map((d) => d - a)
    return {
      text: `Aflați numerele naturale $x$ pentru care $x + ${a}$ divide pe ${b}.`,
      solution: lines(
        `$x + ${a}$ este un divizor al lui ${b}, cel puțin egal cu ${a}. Divizorii lui ${b} sunt ${list(divisors(b))}.`,
        `Deci $x + ${a} \\in \\{${ds.join(', ')}\\}$ și $x \\in \\{${xs.join(', ')}\\}$.`,
      ),
      verify: () => xs.every((x) => b % (x + a) === 0),
    }
  }
  const k = int(rng, 3, 13)
  const M = int(rng, 100, 2000)
  const L = int(rng, 2, 4) * k + int(rng, 0, k - 1)
  const r = (k - (M % k)) % k
  const xs = Array.from({ length: L }, (_, x) => x).filter((x) => (M + x) % k === 0)
  return {
    text: `Aflați numerele naturale $x$ pentru care $${k} \\mid ${nr(M)} + x$ și $x < ${L}$.`,
    solution: lines(
      `$${nr(M)} = ${k} \\cdot ${Math.floor(M / k)} + ${M % k}$, deci $${nr(M)} + x$ se divide cu ${k} dacă $${M % k} + x$ se divide cu ${k}, adică $x$ este de forma $${r}, ${r + k}, ${r + 2 * k}, \\ldots$`,
      `Cu $x < ${L}$: $x \\in \\{${xs.join(', ')}\\}$.`,
    ),
    verify: () => xs.length > 0 && xs.every((x) => (M + x) % k === 0) && xs[0] === r,
  }
}

// p. 131, III b): N divides by 2x + c
const dividesByLinear: Form = (rng) => {
  for (;;) {
    const N = pick(rng, [15, 21, 27, 31, 33, 35, 39, 45, 49, 51, 55, 63, 65, 75, 77, 81, 91, 99, 105])
    const c = 2 * int(rng, 0, 4) + 1
    const ds = divisors(N).filter((d) => d >= c)
    if (!ds.length) continue
    const xs = ds.map((d) => (d - c) / 2)
    return {
      text: `Aflați numerele naturale $x$ pentru care $${N} \\,\\vdots\\, (2x + ${c})$.`,
      solution: lines(
        `$2x + ${c}$ este un divizor al lui ${N}, cel puțin egal cu ${c}. Divizorii lui ${N} sunt ${list(divisors(N))}.`,
        `Din $2x + ${c} \\in \\{${ds.join(', ')}\\}$ obținem $x \\in \\{${xs.join(', ')}\\}$.`,
      ),
      verify: () => xs.every((x) => Number.isInteger(x) && N % (2 * x + c) === 0),
    }
  }
}

// p. 132, IV: abc + bca + cab = 111·(a + b + c)
const cyclicSum: Form = (rng) => {
  const [a, b, c] = [int(rng, 1, 9), int(rng, 1, 9), int(rng, 1, 9)]
  const n = 111 * (a + b + c)
  const s = `${a}${b}${c} + ${b}${c}${a} + ${c}${a}${b}`
  return {
    text: `Fie $n = ${s}$. Arătați, fără a efectua adunarea, că $n$ este multiplu al lui 111 și că se divide cu ${a + b + c}, apoi verificați prin calcul.`,
    solution: lines(
      `Descompunem în baza 10: $${bar('abc')} + ${bar('bca')} + ${bar('cab')} = 100(a + b + c) + 10(a + b + c) + (a + b + c) = 111(a + b + c)$.`,
      show(`n = 111 \\cdot (${a} + ${b} + ${c}) = 111 \\cdot ${a + b + c} = ${n}`),
      `deci $n$ este multiplu al lui 111 și al lui ${a + b + c}. Verificare: $${s} = ${n}$.`,
    ),
    verify: () => 100 * a + 10 * b + c + 100 * b + 10 * c + a + 100 * c + 10 * a + b === n,
  }
}

// p. 132, V: k consecutive numbers, S − s and S + s
const consecutiveHalves: Form = (rng) => {
  const m = int(rng, 2, 5)
  const k = 2 * m
  const d = pick(rng, [2, 3, 4, 5, 6, 8, 9])
  const diff = m * m
  // S + s = k·n + k(k − 1)/2
  const base = (k * (k - 1)) / 2
  const sumAlways = k % d === 0 && base % d === 0
  const sumNever = gcd(k, d) !== 0 && base % gcd(k, d) !== 0
  return {
    text: `Se aleg ${k} numere naturale consecutive și se scriu în ordine crescătoare. Se notează cu $S$ suma ultimelor ${m} numere și cu $s$ suma primelor ${m}. Este $S - s$ divizibilă cu ${d}? Dar $S + s$?`,
    solution: lines(
      `Fie numerele $n, n + 1, \\ldots, n + ${k - 1}$. Fiecare dintre ultimele ${m} numere este cu ${m} mai mare decât numărul aflat cu ${m} locuri înaintea lui, deci $S - s = ${m} \\cdot ${m} = ${diff}$.`,
      diff % d === 0 ? `${diff} se divide cu ${d}, deci $S - s$ este divizibilă cu ${d}.` : `${diff} nu se divide cu ${d}, deci $S - s$ nu este divizibilă cu ${d}.`,
      `$S + s$ este suma tuturor numerelor: $${k}n + ${base}$.`,
      sumAlways
        ? `Ambii termeni se divid cu ${d}, deci $S + s$ este divizibilă cu ${d} oricare ar fi $n$.`
        : sumNever
          ? `$${k}n$ se divide cu ${gcd(k, d)}, dar ${base} nu, deci $S + s$ nu se divide cu ${gcd(k, d)}, deci nici cu ${d}, oricare ar fi $n$.`
          : `Depinde de $n$: de exemplu, pentru $n = 0$ suma este ${base}, ${base % d === 0 ? 'divizibilă' : 'nedivizibilă'} cu ${d}, iar pentru $n = 1$ este ${k + base}, ${(k + base) % d === 0 ? 'divizibilă' : 'nedivizibilă'} cu ${d}.`,
    ),
    verify: () => {
      const sums = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => Array.from({ length: k }, (_, i) => n + i))
      const okDiff = sums.every((t) => t.slice(m).reduce((x, y) => x + y, 0) - t.slice(0, m).reduce((x, y) => x + y, 0) === diff)
      const div = sums.map((t) => t.reduce((x, y) => x + y, 0) % d === 0)
      return okDiff && (sumAlways ? div.every(Boolean) : sumNever ? div.every((x) => !x) : div.some(Boolean) && div.some((x) => !x))
    },
  }
}

// ============================== ordinary fractions: writing, reading, defined (pp. 135–137) ==============================

/** a/b in LaTeX, as written (not simplified). */
const fr = (a: number | string, b: number | string) => `\\frac{${a}}{${b}}`
/** the simplified fraction a/b, or the whole number */
const simp = (a: number, b: number) => {
  const g = gcd(a, b)
  return b / g === 1 ? String(a / g) : fr(a / g, b / g)
}
const PARTS: Record<number, [string, string]> = {
  2: ['doime', 'doimi'], 3: ['treime', 'treimi'], 4: ['pătrime', 'pătrimi'], 5: ['cincime', 'cincimi'], 6: ['șesime', 'șesimi'],
  7: ['șeptime', 'șeptimi'], 8: ['optime', 'optimi'], 9: ['noime', 'noimi'], 10: ['zecime', 'zecimi'],
}
const NUMW = ['', 'o', 'două', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă', 'zece', 'unsprezece', 'douăsprezece']
const fracWords = (a: number, b: number) => `${NUMW[a]} ${a === 1 ? PARTS[b][0] : PARTS[b][1]}`

// p. 136, ex. 1: fractions read in words
const fractionFromWords: Form = (rng) => {
  const items = Array.from({ length: 4 }, () => {
    const b = int(rng, 2, 10)
    return [int(rng, 1, 12), b] as [number, number]
  })
  return {
    text: `Scrieți fracțiile corespunzătoare pentru: ${items.map(([a, b], i) => `${'abcd'[i]}) ${fracWords(a, b)}`).join('; ')}.`,
    solution: lines(
      'Numitorul arată în câte părți egale s-a împărțit întregul (îl numește partea), iar numărătorul câte părți s-au luat.',
      items.map(([a, b], i) => `${'abcd'[i]}) $${fr(a, b)}$`).join('; ') + '.',
    ),
    verify: () => items.every(([a, b]) => a >= 1 && b >= 2 && PARTS[b] !== undefined),
  }
}

// p. 136, ex. 8; p. 137, ex. 9, 10: what part of an hour (a week, a year)
const partOfTime: Form = (rng) => {
  const [whole, total, unit, units] = pick(rng, [
    ['o oră', 60, 'minut', 'minute'],
    ['o săptămână', 7, 'zi', 'zile'],
    ['un an', 12, 'lună', 'luni'],
    ['o zi', 24, 'oră', 'ore'],
  ] as [string, number, string, string][])
  const n = int(rng, 1, 2 * total - 1)
  const q = n === 1 ? `${unit === 'lună' || unit === 'zi' || unit === 'oră' ? 'o' : 'un'} ${unit}` : `${de(n)} ${units}`
  return {
    text: `Ce parte din ${whole} reprezintă ${q}?`,
    solution: lines(
      `${whole[0].toUpperCase() + whole.slice(1)} are ${total} ${units}, deci ${q} reprezintă $${fr(n, total)}$${gcd(n, total) > 1 ? `$ = ${simp(n, total)}$` : ''} din ${whole}.`.replace('$$', ''),
    ),
    verify: () => n / total > 0,
  }
}

// p. 136, ex. 7: how many fifths in k wholes
const partsInWholes: Form = (rng) => {
  const b = int(rng, 2, 10)
  const k = int(rng, 1, 12)
  return {
    text: `Câte ${PARTS[b][1]} sunt în ${k === 1 ? 'un întreg' : `${NUMW[k] ?? k} întregi`}?`,
    solution: `Un întreg are ${b} ${PARTS[b][1]} ($1 = ${fr(b, b)}$), deci ${k === 1 ? 'un întreg are' : `${k} întregi au`} $${k} \\cdot ${b} = ${k * b}$ ${PARTS[b][1]}: $${k} = ${fr(k * b, b)}$.`,
    verify: () => (k * b) / b === k,
  }
}

// p. 137, ex. 12: the fractions with denominator n whose numerators are the divisors of n
const fractionsOfDivisors: Form = (rng) => {
  const n = pick(rng, [8, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 26, 27, 28, 30, 32, 33, 35, 36, 40, 42, 44, 45])
  const d = divisors(n)
  return {
    text: `Scrieți fracțiile care au numitorul ${n}, iar numărătorii sunt divizorii naturali ai lui ${n}.`,
    solution: lines(`Divizorii lui ${n} sunt ${list(d)}.`, `Fracțiile sunt: $${d.map((x) => fr(x, n)).join('$, $')}$.`),
    verify: () => d.every((x) => n % x === 0),
  }
}

// p. 137, ex. 15: N/x is a natural number
const fractionIsNatural: Form = (rng) => {
  const N = pick(rng, [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 64, 72, 80, 84, 90, 96, 100])
  const d = divisors(N)
  return {
    text: `Determinați $x \\in \\mathbb{N}^*$ astfel încât $${fr(N, 'x')}$ să fie număr natural.`,
    solution: lines(`Fracția este număr natural exact când $x$ divide pe ${N}.`, `Deci $x \\in \\{${d.join(', ')}\\}$.`),
    verify: () => d.every((x) => Number.isInteger(N / x)),
  }
}

// p. 137, ex. 20: the natural numbers x for which a fraction is defined
const fractionDefined: Form = (rng) => {
  const a = int(rng, 1, 60)
  const b = int(rng, 1, 15)
  const t = int(rng, 0, 3)
  if (t === 0)
    return {
      text: `Determinați numerele naturale $x$ pentru care este definită fracția $${fr(a, `x - ${b}`)}$.`,
      solution: `Numitorul trebuie să fie un număr natural nenul: $x - ${b}$ există în $\\mathbb{N}$ pentru $x \\ge ${b}$ și este nenul pentru $x \\ne ${b}$. Deci $x \\ge ${b + 1}$, adică $x \\in \\{${b + 1}, ${b + 2}, ${b + 3}, \\ldots\\}$.`,
      verify: () => b + 1 - b > 0,
    }
  if (t === 1)
    return {
      text: `Determinați numerele naturale $x$ pentru care este definită fracția $${fr(a, `${b + 5} - x`)}$.`,
      solution: `Numitorul $${b + 5} - x$ trebuie să fie număr natural nenul, deci $x < ${b + 5}$: $x \\in \\{0, 1, 2, \\ldots, ${b + 4}\\}$.`,
      verify: () => b + 5 - (b + 4) === 1,
    }
  if (t === 2)
    return {
      text: `Determinați numerele naturale $x$ pentru care este definită fracția $${fr(a, `x + ${b}`)}$.`,
      solution: `Numitorul $x + ${b}$ este cel puțin ${b}, deci nu este niciodată 0: fracția este definită pentru orice număr natural $x$.`,
      verify: () => b > 0,
    }
  return {
    text: `Determinați numerele naturale $x$ pentru care este definită fracția $${fr(a, `x(x + ${b})`)}$.`,
    solution: `Produsul $x(x + ${b})$ este 0 doar dacă $x = 0$ (al doilea factor este cel puțin ${b}). Fracția este definită pentru $x \\in \\mathbb{N}^*$, adică $x \\ne 0$.`,
    verify: () => b > 0,
  }
}

// p. 137, ex. 17: fractions ax / b with d | ax
const fractionsWithDigit: Form = (rng) => {
  for (;;) {
    const a = int(rng, 1, 9)
    const b = int(rng, 11, 99)
    const d = pick(rng, [2, 3, 5, 9])
    const xs = Array.from({ length: 10 }, (_, x) => x).filter((x) => (10 * a + x) % d === 0)
    if (!xs.length) continue
    return {
      text: `Determinați toate fracțiile de forma $${fr(bar(`${a}x`), b)}$, unde $${d} \\mid ${bar(`${a}x`)}$.`,
      solution: lines(
        d === 2 ? '$x$ trebuie să fie cifră pară.' : d === 5 ? '$x$ trebuie să fie 0 sau 5.' : `Suma cifrelor, $${a} + x$, trebuie să se dividă cu ${d}.`,
        `Deci $x \\in \\{${xs.join(', ')}\\}$, iar fracțiile sunt $${xs.map((x) => fr(10 * a + x, b)).join('$, $')}$.`,
      ),
      verify: () => xs.every((x) => (10 * a + x) % d === 0),
    }
  }
}

// p. 137, ex. 23: a sequence of fractions (pn + q)/(rn + s)
const fractionSequence: Form = (rng) => {
  const [p, r] = [int(rng, 1, 4), int(rng, 1, 5)]
  const [q, s] = [int(rng, -1, 4), int(rng, 1, 6)]
  if (p + q <= 0) return fractionSequence(rng)
  const term = (n: number) => fr(p * n + q, r * n + s)
  const lin = (a: number, c: number) => `${a === 1 ? '' : a}n${c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${-c}`}`
  return {
    text: `Se consideră șirul de fracții: $${term(1)}; ${term(2)}; ${term(3)}; \\ldots$ Scrieți următoarele trei fracții din șir, a 100-a fracție și fracția aflată pe locul $n$.`,
    solution: lines(
      `Numărătorii cresc cu ${p}, iar numitorii cu ${r}. Pe locul $n$: numărătorul este $${lin(p, q)}$, numitorul $${lin(r, s)}$.`,
      `Următoarele trei: $${term(4)}; ${term(5)}; ${term(6)}$. A 100-a: $${term(100)}$. Pe locul $n$: $${fr(lin(p, q), lin(r, s))}$.`,
    ),
    verify: () => p * 100 + q === p * 100 + q && p + q > 0,
  }
}

// p. 137, ex. 22: a_n = (k^n − c)/(k^n + c)
const powerFractionSequence: Form = (rng) => {
  const k = int(rng, 2, 5)
  const c = int(rng, 1, 5)
  if (k - c <= 0) return powerFractionSequence(rng)
  const a = (n: number) => fr(k ** n - c, k ** n + c)
  return {
    text: `Fie fracția $a_n = ${fr(`${k}^n - ${c}`, `${k}^n + ${c}`)}$. Scrieți $a_1$, $a_2$, $a_3$ și $a_{100}$.`,
    solution: show(`a_1 = ${fr(`${k} - ${c}`, `${k} + ${c}`)} = ${a(1)}, \\quad a_2 = ${fr(`${k ** 2} - ${c}`, `${k ** 2} + ${c}`)} = ${a(2)}, \\quad a_3 = ${a(3)}, \\quad a_{100} = ${fr(`${k}^{100} - ${c}`, `${k}^{100} + ${c}`)}`),
    verify: () => k - c > 0,
  }
}

// ============================== subunitary, equal to one, supraunitary; wholes (pp. 138–140) ==============================

const kindOf = (a: number, b: number) => (a < b ? 'subunitară' : a === b ? 'echiunitară' : 'supraunitară')

// p. 139, ex. 2: sort fractions into subunitary, equal to one, supraunitary
const classifyFractions: Form = (rng) => {
  const fs: [number, number][] = []
  while (fs.length < 8) {
    const b = int(rng, 2, 20)
    const t = fs.length % 3
    const a = t === 0 ? int(rng, 1, b - 1) : t === 1 ? b : int(rng, b + 1, 3 * b)
    if (!fs.some(([x, y]) => x === a && y === b)) fs.push([a, b])
  }
  const order = shuffle(rng, fs)
  const group = (k: string) => order.filter(([a, b]) => kindOf(a, b) === k).map(([a, b]) => fr(a, b)).join('; ')
  return {
    text: `Fie fracțiile: $${order.map(([a, b]) => fr(a, b)).join('; ')}$. Scrieți fracțiile: a) subunitare; b) echiunitare; c) supraunitare.`,
    solution: lines(
      'Comparăm numărătorul cu numitorul: mai mic — subunitară, egal — echiunitară, mai mare — supraunitară.',
      `a) $${group('subunitară')}$; b) $${group('echiunitară')}$; c) $${group('supraunitară')}$.`,
    ),
    verify: () => order.length === 8,
  }
}

// p. 139, ex. 3, 4, 11: the subunitary fractions with denominator n (supraunitary with numerator n)
const fractionsOfAKind: Form = (rng) => {
  const n = int(rng, 3, 12)
  if (rng() < 0.5) {
    const fs = Array.from({ length: n - 1 }, (_, i) => fr(i + 1, n))
    return {
      text: `Scrieți fracțiile subunitare cu numitorul ${n} și numărătorul nenul.`,
      solution: `Numărătorul este mai mic decât ${n} și nenul: ${list(Array.from({ length: n - 1 }, (_, i) => i + 1))}. Fracțiile sunt $${fs.join('$, $')}$.`,
      verify: () => fs.length === n - 1,
    }
  }
  const fs = Array.from({ length: n - 1 }, (_, i) => fr(n, i + 1))
  return {
    text: `Scrieți toate fracțiile supraunitare cu numărătorul ${n}.`,
    solution: `Numitorul este nenul și mai mic decât ${n}: ${list(Array.from({ length: n - 1 }, (_, i) => i + 1))}. Fracțiile sunt $${fs.join('$, $')}$, adică ${n - 1} fracții.`,
    verify: () => fs.length === n - 1,
  }
}

// p. 139, ex. 5, 8: a from one set, b from another: the fractions a/b of each kind
const fractionsFromSets: Form = (rng) => {
  const A = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y)
  const B = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y)
  const all = A.flatMap((a) => B.map((b) => [a, b] as [number, number]))
  const g = (k: string) => {
    const l = all.filter(([a, b]) => kindOf(a, b) === k)
    return l.length ? `$${l.map(([a, b]) => fr(a, b)).join('$, $')}$` : 'nu există'
  }
  return {
    text: `Știind că $a$ este egal cu ${list(A).replace(' și ', ' sau ')}, iar $b$ este egal cu ${list(B).replace(' și ', ' sau ')}, scrieți toate fracțiile de forma $${fr('a', 'b')}$: a) subunitare; b) echiunitare; c) supraunitare.`,
    solution: lines(`Sunt ${all.length} fracții; le împărțim după comparația lui $a$ cu $b$.`, `a) ${g('subunitară')}; b) ${g('echiunitară')}; c) ${g('supraunitară')}.`),
    verify: () => all.length === 9,
  }
}

// p. 139, ex. 6, 9; p. 140, ex. 13: x for which k/(x + c) is supraunitary (equal to one)
const unknownMakesKind: Form = (rng) => {
  const c = int(rng, 0, 6)
  const k = c + int(rng, 3, 12)
  const den = c === 0 ? 'x' : `x + ${c}`
  if (rng() < 0.5) {
    const lo = c === 0 ? 1 : 0
    const xs = Array.from({ length: k - c - lo }, (_, i) => i + lo)
    return {
      text: `Determinați numerele naturale $x$ pentru care fracția $${fr(k, den)}$ este supraunitară.`,
      solution: `Trebuie ca numitorul să fie nenul și mai mic decât numărătorul: $${c === 0 ? '0 < x' : `x + ${c}`} < ${k}$, deci $x \\in \\{${xs.join(', ')}\\}$.`,
      verify: () => xs.every((x) => x + c < k && x + c > 0),
    }
  }
  return {
    text: `Determinați numărul natural $x$ pentru care fracția $${fr(k, den)}$ este echiunitară.`,
    solution: `Numitorul trebuie să fie egal cu numărătorul: $${den} = ${k}$, deci $x = ${k - c}$.`,
    verify: () => k - c + c === k,
  }
}

// p. 140, ex. 22: take the wholes out of a fraction
const extractWholes: Form = (rng) => {
  const b = int(rng, 4, 450)
  const c = int(rng, 1, 40)
  const r = int(rng, 1, b - 1)
  const a = b * c + r
  return {
    text: `Scoateți întregii din fracția $${fr(nr(a), b)}$.`,
    solution: lines(`Împărțim numărătorul la numitor: $${nr(a)} = ${b} \\cdot ${c} + ${r}$ (restul ${r} < ${b}).`, show(`${fr(nr(a), b)} = ${c}${fr(r, b)}`)),
    verify: () => b * c + r === a && r < b,
  }
}

// p. 140, ex. 23: put the wholes into a fraction
const introduceWholes: Form = (rng) => {
  const b = int(rng, 3, 900)
  const c = int(rng, 1, 150)
  const r = int(rng, 1, b - 1)
  return {
    text: `Introduceți întregii în fracția $${c}${fr(r, b)}$.`,
    solution: show(`${c}${fr(r, b)} = ${fr(`${c} \\cdot ${b} + ${r}`, b)} = ${fr(nr(c * b + r), b)}`),
    verify: () => (c * b + r) / b > c && (c * b + r) / b < c + 1,
  }
}

// p. 140, ex. 15: (ax + xb)/N is equal to one
const digitsEqualToOne: Form = (rng) => {
  const a = int(rng, 1, 9)
  const b = int(rng, 0, 9)
  const x = int(rng, 1, 9)
  const N = 10 * a + x + 10 * x + b
  return {
    text: `Determinați cifra $x$ astfel încât fracția $${fr(`${bar(`${a}x`)} + ${bar(`x${b}`)}`, N)}$ să fie echiunitară.`,
    solution: lines(
      `Fracția este echiunitară dacă $${bar(`${a}x`)} + ${bar(`x${b}`)} = ${N}$. Descompunem în baza 10: $${10 * a} + x + 10x${b ? ` + ${b}` : ''} = ${N}$.`,
      show(`11x = ${N} - ${10 * a + b} = ${11 * x} \\Rightarrow x = ${x}`),
    ),
    verify: () => 10 * a + x + 10 * x + b === N,
  }
}

// p. 140, ex. 19: (pn + q)/(rn + s): for which n is it subunitary, equal to one, supraunitary
const rangesOfN: Form = (rng) => {
  for (;;) {
    const p = int(rng, 1, 4)
    const r = p + int(rng, 1, 3)
    const n0 = int(rng, 1, 9)
    const s = int(rng, 1, 9)
    const q = s + (r - p) * n0
    const num = `${p === 1 ? '' : p}n + ${q}`
    const den = `${r}n + ${s}`
    return {
      text: `Fie fracția $${fr(num, den)}$, unde $n \\in \\mathbb{N}$. Determinați valorile numărului natural $n$ pentru care fracția este: a) subunitară; b) echiunitară; c) supraunitară.`,
      solution: lines(
        `Comparăm numărătorul cu numitorul: $${num} < ${den} \\Leftrightarrow ${q - s} < ${r - p === 1 ? '' : r - p}n \\Leftrightarrow n > ${n0}$.`,
        `a) subunitară pentru $n > ${n0}$; b) echiunitară pentru $n = ${n0}$; c) supraunitară pentru $n < ${n0}$, adică $n \\in \\{${Array.from({ length: n0 }, (_, i) => i).join(', ')}\\}$.`,
      ),
      verify: () => p * n0 + q === r * n0 + s && p * (n0 + 1) + q < r * (n0 + 1) + s && p * (n0 - 1) + q > r * (n0 - 1) + s,
    }
  }
}

// p. 140, ex. 21: (2N − (2N − 1) + … + 2 − 1)/(1 + 2 + … + n) is equal to one
const alternatingEqualsGauss: Form = (rng) => {
  const n = int(rng, 10, 70)
  const N = (n * (n + 1)) / 2
  return {
    text: `Fie fracția $${fr(`${nr(2 * N)} - ${nr(2 * N - 1)} + ${nr(2 * N - 2)} - ${nr(2 * N - 3)} + \\ldots + 4 - 3 + 2 - 1`, '1 + 2 + 3 + \\ldots + n')}$. Determinați numărul $n$ astfel încât fracția să fie echiunitară.`,
    solution: lines(
      `Grupăm numărătorul în perechi: $(${nr(2 * N)} - ${nr(2 * N - 1)}) + (${nr(2 * N - 2)} - ${nr(2 * N - 3)}) + \\ldots + (2 - 1)$: sunt $${nr(2 * N)} : 2 = ${nr(N)}$ perechi, fiecare egală cu 1, deci numărătorul este $${nr(N)}$.`,
      show(`1 + 2 + \\ldots + n = \\frac{n(n + 1)}{2} = ${nr(N)} \\Rightarrow n(n + 1) = ${nr(2 * N)} = ${n} \\cdot ${n + 1} \\Rightarrow n = ${n}`),
    ),
    verify: () => n * (n + 1) === 2 * N,
  }
}

// p. 140, ex. 24: (an + b)/(n + c) is a natural number
const fractionNaturalN: Form = (rng) => {
  for (;;) {
    const a = int(rng, 2, 6)
    const c = int(rng, 1, 5)
    const rest = pick(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24])
    const b = a * c + rest
    const ds = divisors(rest).filter((d) => d >= c)
    if (!ds.length) continue
    const ns = ds.map((d) => d - c)
    return {
      text: `Determinați valorile numărului natural $n$ pentru care fracția $${fr(`${a}n + ${b}`, `n + ${c}`)}$ reprezintă un număr natural.`,
      solution: lines(
        show(`${fr(`${a}n + ${b}`, `n + ${c}`)} = ${fr(`${a}(n + ${c}) + ${rest}`, `n + ${c}`)} = ${a} + ${fr(rest, `n + ${c}`)}`),
        `Trebuie ca $n + ${c}$ să dividă pe ${rest} și $n + ${c} \\ge ${c}$: $n + ${c} \\in \\{${ds.join(', ')}\\}$, deci $n \\in \\{${ns.join(', ')}\\}$.`,
      ),
      verify: () => ns.every((n) => (a * n + b) % (n + c) === 0) && Array.from({ length: 40 }, (_, n) => n).filter((n) => (a * n + b) % (n + c) === 0).length === ns.length,
    }
  }
}

// ============================== equivalent fractions (pp. 141–143) ==============================

// p. 141, ex. 1: are the fractions equal? (the cross products)
const checkEquality: Form = (rng) => {
  const pairs = Array.from({ length: 3 }, () => {
    const [a, b] = [int(rng, 1, 15), int(rng, 2, 20)]
    const k = int(rng, 2, 6)
    const off = rng() < 0.5 ? 0 : pick(rng, [-1, 1])
    return [a, b, k * a + off, k * b] as [number, number, number, number]
  }).filter(([, , c]) => c > 0)
  return {
    text: `Stabiliți dacă următoarele egalități de fracții sunt adevărate: $${pairs.map(([a, b, c, d]) => `${fr(a, b)} = ${fr(c, d)}`).join('; \\quad ')}$.`,
    solution: lines(
      'Două fracții $\\frac{a}{b}$ și $\\frac{c}{d}$ sunt egale dacă $a \\cdot d = b \\cdot c$.',
      pairs.map(([a, b, c, d]) => `$${a} \\cdot ${d} = ${a * d}$, $${b} \\cdot ${c} = ${b * c}$: ${a * d === b * c ? 'adevărată' : 'falsă'}`).join('; ') + '.',
    ),
    verify: () => pairs.length > 0,
  }
}

// p. 142, ex. 3: fill in the missing number
const completeEquality: Form = (rng) => {
  const [a, b] = [int(rng, 1, 12), int(rng, 2, 15)]
  const k = int(rng, 2, 9)
  const t = int(rng, 0, 3)
  const left = fr(a, b)
  const right = [fr(k * a, '\\ldots'), fr('\\ldots', k * b), fr(a, '\\ldots'), fr('\\ldots', b)][t]
  const shown = t === 2 || t === 3 ? [fr(k * a, k * b), ''] : ['', '']
  const eq = t < 2 ? `${left} = ${right}` : `${shown[0]} = ${right}`
  const ans = [k * b, k * a, b, a][t]
  return {
    text: `Completați spațiul punctat pentru a obține o propoziție adevărată: $${eq}$.`,
    solution:
      t < 2
        ? `${t === 0 ? 'Numărătorul' : 'Numitorul'} s-a înmulțit cu ${k}, deci amplificăm cu ${k}: $${fr(a, b)} = ${fr(k * a, k * b)}$. Numărul lipsă este ${ans}.`
        : `${t === 2 ? 'Numărătorul' : 'Numitorul'} s-a împărțit la ${k}, deci simplificăm cu ${k}: $${fr(k * a, k * b)} = ${fr(a, b)}$. Numărul lipsă este ${ans}.`,
    verify: () => (t < 2 ? a * (k * b) === b * (k * a) : (k * a) * b === (k * b) * a),
  }
}

// p. 142, ex. 4–6: a/b equal to p/q, with a + b, b − a or a·b given
const fractionFromCondition: Form = (rng) => {
  for (;;) {
    const q = int(rng, 2, 11)
    const p = int(rng, 1, 12)
    if (gcd(p, q) !== 1 || p === q) continue
    const k = int(rng, 2, 12)
    const [a, b] = [k * p, k * q]
    const t = int(rng, 0, 2)
    const cond = [`a + b = ${a + b}`, b > a ? `b - a = ${b - a}` : `a - b = ${a - b}`, `a \\cdot b = ${nr(a * b)}`][t]
    const step = [
      `$a = ${p}k$, $b = ${q}k$, deci $${p + q}k = ${a + b}$ și $k = ${k}$.`,
      `$a = ${p}k$, $b = ${q}k$, deci $${Math.abs(q - p) === 1 ? '' : Math.abs(q - p)}k = ${Math.abs(b - a)}$ și $k = ${k}$.`,
      `$a = ${p}k$, $b = ${q}k$, deci $${p * q}k^2 = ${nr(a * b)}$, $k^2 = ${k * k}$ și $k = ${k}$.`,
    ][t]
    return {
      text: `Determinați fracția $${fr('a', 'b')}$, știind că este egală cu fracția $${fr(p, q)}$ și că $${cond}$.`,
      solution: lines(`Fracția $${fr(p, q)}$ este ireductibilă, deci $${fr('a', 'b')}$ se obține amplificând-o cu un număr natural nenul $k$: ${step}`, `Fracția este $${fr(a, b)}$.`),
      verify: () => a * q === b * p,
    }
  }
}

// p. 142, ex. 12: x for which a fraction equals p/q
const unknownInEqualFractions: Form = (rng) => {
  for (;;) {
    const q = int(rng, 3, 12)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const k = int(rng, 2, 9)
    const t = int(rng, 0, 2)
    if (t === 2 && (k * p) % 2 === 0) continue
    const f = [fr('x', k * q), fr(k * p, 'x'), fr('2x + 1', k * q)][t]
    const x = [k * p, k * q, (k * p - 1) / 2][t]
    const sol = [
      `$x \\cdot ${q} = ${k * q} \\cdot ${p}$, deci $x = ${x}$.`,
      `$${k * p} \\cdot ${q} = x \\cdot ${p}$, deci $x = ${x}$.`,
      `$(2x + 1) \\cdot ${q} = ${k * q} \\cdot ${p}$, deci $2x + 1 = ${k * p}$ și $x = ${x}$.`,
    ][t]
    return {
      text: `Determinați $x$ astfel încât fracția $${f}$ să fie egală cu fracția $${fr(p, q)}$.`,
      solution: `Fracțiile sunt egale dacă produsele „pe cruce” sunt egale: ${sol}`,
      verify: () => Number.isInteger(x) && [x * q === k * q * p, k * p * q === x * p, (2 * x + 1) * q === k * q * p][t],
    }
  }
}

// p. 142, ex. 8: the fractions whose denominator divides N, equivalent to p/q
const equivalentWithDivisorDenominator: Form = (rng) => {
  for (;;) {
    const q = pick(rng, [2, 3, 4, 5, 6])
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const N = q * pick(rng, [6, 8, 10, 12, 14, 15, 18, 20, 21, 22])
    const ds = divisors(N).filter((d) => d % q === 0)
    return {
      text: `Scrieți toate fracțiile cu numitorul divizor al lui ${N}, echivalente cu fracția $${fr(p, q)}$.`,
      solution: lines(
        `O fracție echivalentă cu $${fr(p, q)}$ se obține prin amplificare, deci numitorul ei este multiplu de ${q}. Divizorii lui ${N} multipli de ${q}: ${list(ds)}.`,
        `Fracțiile sunt $${ds.map((d) => fr((p * d) / q, d)).join('$, $')}$.`,
      ),
      verify: () => ds.every((d) => N % d === 0 && d % q === 0),
    }
  }
}

// p. 142, ex. 7: x7/1x = 9/4, with digits
const digitsInEqualFractions: Form = (rng) => {
  for (;;) {
    const [a, b] = [int(rng, 1, 9), int(rng, 1, 9)]
    const [p, q] = [int(rng, 1, 9), int(rng, 1, 9)]
    if (gcd(p, q) !== 1 || p === q) continue
    const xs = Array.from({ length: 9 }, (_, i) => i + 1).filter((x) => (10 * x + a) * q === (10 * b + x) * p)
    if (xs.length !== 1) continue
    const x = xs[0]
    return {
      text: `Determinați cifra $x$ astfel încât $${fr(bar(`x${a}`), bar(`${b}x`))} = ${fr(p, q)}$.`,
      solution: lines(
        `Produsele „pe cruce”: $${q} \\cdot ${bar(`x${a}`)} = ${p} \\cdot ${bar(`${b}x`)}$, adică $${q}(10x + ${a}) = ${p}(${10 * b} + x)$.`,
        show(`${10 * q}x + ${q * a} = ${10 * b * p} + ${p}x \\Rightarrow ${10 * q - p}x = ${10 * b * p - q * a} \\Rightarrow x = ${x}`),
      ),
      verify: () => (10 * q - p) * x === 10 * b * p - q * a,
    }
  }
}

// p. 142, ex. 14: m·a = n·b and a/b = x/K
const proportionToFraction: Form = (rng) => {
  for (;;) {
    const [u, v] = [int(rng, 2, 9), int(rng, 2, 9)]
    if (gcd(u, v) !== 1 || u === v) continue
    const g = int(rng, 2, 9)
    const [m, n] = [g * v, g * u]
    const K = v * int(rng, 2, 8)
    const x = (u * K) / v
    return {
      text: `Determinați $x$, astfel încât $${m}a = ${n}b$ și $${fr('a', 'b')} = ${fr('x', K)}$.`,
      solution: lines(`Din $${m}a = ${n}b$ rezultă $${fr('a', 'b')} = ${fr(n, m)} = ${fr(u, v)}$.`, `Din $${fr(u, v)} = ${fr('x', K)}$: $x \\cdot ${v} = ${u} \\cdot ${K}$, deci $x = ${x}$.`),
      verify: () => Number.isInteger(x) && m * u === n * v,
    }
  }
}

// p. 143, ex. 19: N/(x² + kx) = p/q
const squareInEquality: Form = (rng) => {
  for (;;) {
    const x = int(rng, 1, 6)
    const k = int(rng, 1, 6)
    const D = x * x + k * x
    const d = pick(rng, divisors(D).filter((t) => t > 1))
    const p = int(rng, 1, 9)
    const N = p * d
    const q = D / d
    if (gcd(p, q) !== 1) continue
    return {
      text: `Aflați numărul natural $x$ care verifică egalitatea $${fr(N, `x^2 + ${k}x`)} = ${fr(p, q)}$.`,
      solution: lines(
        `Produsele „pe cruce”: $${p}(x^2 + ${k}x) = ${N} \\cdot ${q}$, deci $x^2 + ${k}x = ${D}$, adică $x(x + ${k}) = ${D}$.`,
        `Membrul stâng crește odată cu $x$; încercând, $${x} \\cdot ${x + k} = ${D}$, deci $x = ${x}$.`,
      ),
      verify: () => p * D === N * q,
    }
  }
}

// p. 143, ex. 18: a/x = (y + 1)/b
const twoUnknownsEqual: Form = (rng) => {
  const a = int(rng, 1, 6)
  const b = int(rng, 2, 7)
  const P = a * b
  const ds = divisors(P)
  return {
    text: `Determinați numerele naturale $x$ și $y$ astfel încât fracțiile $${fr(a, 'x')}$ și $${fr('y + 1', b)}$ să fie egale.`,
    solution: lines(
      `Din egalitate, $x(y + 1) = ${a} \\cdot ${b} = ${P}$, deci $x$ și $y + 1$ sunt divizori ai lui ${P} cu produsul ${P}.`,
      `Perechile $(x, y)$ sunt: ${ds.map((d) => `$(${d}, ${P / d - 1})$`).join(', ')}.`,
    ),
    verify: () => ds.every((d) => d * (P / d) === P),
  }
}

// ============================== amplifying and simplifying (pp. 143–145) ==============================

// p. 144, ex. 3, 4: by what to amplify each fraction to get the denominator (numerator) N
const amplifyTo: Form = (rng) => {
  const N = pick(rng, [24, 30, 36, 40, 48, 60, 72, 84, 90, 96, 120])
  const den = rng() < 0.6
  const ds = shuffle(rng, divisors(N).filter((d) => d > 1 && d < N)).slice(0, 5)
  const fs = ds.map((d) => {
    let a = int(rng, 1, Math.max(1, 2 * d))
    while (gcd(a, d) !== 1) a++
    return den ? [a, d] : [d, a]
  })
  return {
    text: `Aflați cu ce număr trebuie amplificată fiecare dintre fracțiile $${fs.map(([a, b]) => fr(a, b)).join('; ')}$, astfel încât să obținem de fiecare dată fracții cu ${den ? 'numitorul' : 'numărătorul'} ${N}.`,
    solution: lines(
      `Împărțim ${N} la ${den ? 'numitorul' : 'numărătorul'} fiecărei fracții:`,
      fs.map(([a, b]) => {
        const k = N / (den ? b : a)
        return `$${fr(a, b)} = ${fr(a * k, b * k)}$ (amplificare cu ${k})`
      }).join('; ') + '.',
    ),
    verify: () => fs.every(([a, b]) => N % (den ? b : a) === 0),
  }
}

// p. 144, ex. 8: simplify to irreducible fractions
const simplifyToIrreducible: Form = (rng) => {
  const fs = Array.from({ length: 4 }, () => {
    const g = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 25, 50, 100])
    let [p, q] = [int(rng, 1, 20), int(rng, 2, 30)]
    while (gcd(p, q) !== 1 || p === q) [p, q] = [int(rng, 1, 20), int(rng, 2, 30)]
    return [g * p, g * q] as [number, number]
  })
  return {
    text: `Simplificați fracțiile, astfel încât să obțineți fracții ireductibile: $${fs.map(([a, b]) => fr(nr(a), nr(b))).join('; ')}$.`,
    solution: lines(
      'Simplificăm fiecare fracție cu cel mai mare divizor comun al numărătorului și numitorului:',
      fs.map(([a, b]) => `$${fr(nr(a), nr(b))} = ${fr(a / gcd(a, b), b / gcd(a, b))}$ (cu ${gcd(a, b)})`).join('; ') + '.',
    ),
    verify: () => fs.every(([a, b]) => gcd(a / gcd(a, b), b / gcd(a, b)) === 1),
  }
}

// p. 144, ex. 8: fractions written with powers
const simplifyPowers: Form = (rng) => {
  const e = Array.from({ length: 6 }, () => int(rng, 1, 8))
  const extraTop = pick(rng, [1, 7, 11, 13])
  const extraBot = pick(rng, [1, 7, 11, 13].filter((x) => x !== extraTop || x === 1))
  const term = (p: number, k: number) => (k === 1 ? `${p}` : `${p}^{${k}}`)
  const top = [term(2, e[0]), term(3, e[1]), term(5, e[2]), extraTop > 1 ? String(extraTop) : ''].filter(Boolean).join(' \\cdot ')
  const bot = [term(2, e[3]), term(3, e[4]), term(5, e[5]), extraBot > 1 ? String(extraBot) : ''].filter(Boolean).join(' \\cdot ')
  const side = (up: boolean) => {
    const out: string[] = []
    ;[2, 3, 5].forEach((p, i) => {
      const d = up ? e[i] - e[i + 3] : e[i + 3] - e[i]
      if (d > 0) out.push(term(p, d))
    })
    const ex = up ? extraTop : extraBot
    if (ex > 1) out.push(String(ex))
    return out.length ? out.join(' \\cdot ') : '1'
  }
  const up = side(true)
  const down = side(false)
  return {
    text: `Simplificați fracția $${fr(top, bot)}$, astfel încât să obțineți o fracție ireductibilă.`,
    solution: lines(
      'Simplificăm cu puterile comune ale lui 2, 3 și 5 (cu exponentul cel mai mic din fiecare):',
      show(`${fr(top, bot)} = ${down === '1' ? up : fr(up, down)}`),
    ),
    verify: () => {
      const val = (s: string) => s.split(' \\cdot ').reduce((x, t) => x * (t.includes('^') ? Number(t.split('^')[0]) ** Number(t.match(/\{(\d+)\}/)![1]) : Number(t)), 1)
      return Math.abs(val(top) * val(down) - val(bot) * val(up)) < 1e-6 * val(top) * val(down)
    },
  }
}

// p. 144, ex. 9 c): k(x + a)/(x + b) = (x + a)/m
const commonFactorEquation: Form = (rng) => {
  const k = int(rng, 2, 9)
  const a = int(rng, 1, 9)
  const m = int(rng, 2, 9)
  const b = int(rng, 1, k * m - 1)
  const x = k * m - b
  return {
    text: `Aflați numărul natural $x$, astfel încât $${fr(`${k}x + ${k * a}`, `x + ${b}`)} = ${fr(`x + ${a}`, m)}$.`,
    solution: lines(
      `Numărătorul primei fracții este $${k}(x + ${a})$. Produsele „pe cruce”: $${k}(x + ${a}) \\cdot ${m} = (x + ${a})(x + ${b})$.`,
      `Cum $x + ${a} \\ne 0$, împărțim prin el: $x + ${b} = ${k * m}$, deci $x = ${x}$.`,
    ),
    verify: () => k * (x + a) * m === (x + a) * (x + b),
  }
}

// p. 144, ex. 11 a): abcabc / defdef
const repeatedBlocks: Form = (rng) => {
  for (;;) {
    const [u, v] = [int(rng, 100, 999), int(rng, 100, 999)]
    if (u === v) continue
    const g = gcd(u, v)
    return {
      text: `Simplificați fracția $${fr(nr(u * 1001), nr(v * 1001))}$.`,
      solution: lines(
        show(`${fr(nr(u * 1001), nr(v * 1001))} = ${fr(`${u} \\cdot 1001`, `${v} \\cdot 1001`)} = ${fr(u, v)}${g > 1 ? ` = ${fr(u / g, v / g)}` : ''}`),
        g > 1 ? `(am simplificat apoi cu ${g}).` : `Fracția $${fr(u, v)}$ este ireductibilă.`,
      ),
      verify: () => gcd(u / g, v / g) === 1,
    }
  }
}

// p. 145, ex. 19: n for which (n + a)/(n + b) is reducible
const reducibleValues: Form = (rng) => {
  const p = pick(rng, [2, 3, 5, 7, 11, 13])
  const a = int(rng, 1, 9)
  const b = a + p
  const r = (p - (a % p)) % p
  return {
    text: `Aflați numerele naturale $n$ pentru care fracția $${fr(`n + ${a}`, `n + ${b}`)}$ este reductibilă.`,
    solution: lines(
      `Dacă $d$ divide și $n + ${a}$, și $n + ${b}$, atunci $d$ divide diferența lor, ${p}. Cum ${p} este prim, fracția este reductibilă exact când $${p} \\mid n + ${a}$.`,
      `Adică $n + ${a} = ${p}k$, deci $n \\in \\{${[0, 1, 2].map((t) => r + t * p).join(', ')}, \\ldots\\}$ (numerele de forma $${p}k ${r === 0 ? '' : `+ ${r}`}$, $k \\in \\mathbb{N}$).`.replace('$${p}k $', `$${p}k$`),
    ),
    verify: () => [0, 1, 2].every((t) => gcd(r + t * p + a, r + t * p + b) > 1) && gcd(r + 1 + a, r + 1 + b) === 1,
  }
}

// p. 145, ex. 17, 18: (pn + q)/(rn + s) is irreducible for every n, since |r·q − p·s| = 1
const irreducibleForAll: Form = (rng) => {
  for (;;) {
    const [p, r] = [int(rng, 1, 9), int(rng, 1, 9)]
    const [q, s] = [int(rng, 1, 15), int(rng, 1, 15)]
    const D = r * q - p * s
    if (Math.abs(D) !== 1 || p === r) continue
    const [A, B] = D === 1 ? [r, p] : [p, r]
    const [nA, nB] = D === 1 ? [`${p}n + ${q}`, `${r}n + ${s}`] : [`${r}n + ${s}`, `${p}n + ${q}`]
    return {
      text: `Arătați că fracția $${fr(`${p === 1 ? '' : p}n + ${q}`, `${r === 1 ? '' : r}n + ${s}`)}$ este ireductibilă oricare ar fi $n$ număr natural.`,
      solution: lines(
        `Fie $d$ un divizor comun al numărătorului și numitorului. Atunci $d$ divide și $${A}(${nA})$, și $${B}(${nB})$, deci și diferența lor:`,
        show(`${A}(${nA}) - ${B}(${nB}) = ${A * (D === 1 ? q : s)} - ${B * (D === 1 ? s : q)} = 1`),
        'Deci $d = 1$, iar fracția este ireductibilă.',
      ).replace(/\b1n\b/g, 'n'),
      verify: () => A * (D === 1 ? q : s) - B * (D === 1 ? s : q) === 1 && [0, 1, 2, 3, 10].every((n) => gcd(p * n + q, r * n + s) === 1),
    }
  }
}

// p. 145, ex. 25 a): (a^n + a^(n+1))/(b^n + b^(n+1))
const powerSumFraction: Form = (rng) => {
  for (;;) {
    const [a, b] = [int(rng, 2, 19), int(rng, 2, 19)]
    if (a === b) continue
    const g = gcd(a + 1, b + 1)
    const [u, v] = [(a + 1) / g, (b + 1) / g]
    const num = u === 1 ? `${a}^{n}` : `${u} \\cdot ${a}^{n}`
    const den = v === 1 ? `${b}^{n}` : `${v} \\cdot ${b}^{n}`
    return {
      text: `Dacă $n$ este un număr natural nenul, simplificați fracția $${fr(`${a}^{n} + ${a}^{n+1}`, `${b}^{n} + ${b}^{n+1}`)}$.`,
      solution: show(`${fr(`${a}^{n} + ${a}^{n+1}`, `${b}^{n} + ${b}^{n+1}`)} = ${fr(`${a}^{n}(1 + ${a})`, `${b}^{n}(1 + ${b})`)} = ${fr(`${a + 1} \\cdot ${a}^{n}`, `${b + 1} \\cdot ${b}^{n}`)}${g > 1 ? ` = ${fr(num, den)}` : ''}`),
      verify: () => [1, 2].every((n) => Math.abs((a ** n + a ** (n + 1)) / (b ** n + b ** (n + 1)) - (u * a ** n) / (v * b ** n)) < 1e-9),
    }
  }
}

// p. 145, ex. 23: how many fractions equivalent to p/q have the denominator (numerator) smaller than N
const countEquivalent: Form = (rng) => {
  for (;;) {
    const q = int(rng, 2, 13)
    const p = int(rng, 1, 12)
    if (gcd(p, q) !== 1 || p === q) continue
    const N = pick(rng, [50, 100, 200, 500, 1000])
    const byDen = rng() < 0.5
    const base = byDen ? q : p
    const cnt = Math.floor((N - 1) / base)
    return {
      text: `Calculați câte fracții echivalente cu fracția $${fr(p, q)}$ și care au ${byDen ? 'numitorul' : 'numărătorul'} mai mic decât ${N} există.`,
      solution: lines(
        `Fracția $${fr(p, q)}$ este ireductibilă, deci fracțiile echivalente cu ea sunt $${fr(`${p}k`, `${q}k`)}$, $k \\in \\mathbb{N}^*$.`,
        `Condiția: $${base}k < ${N}$, adică $k \\le ${cnt}$ ($${base} \\cdot ${cnt} = ${base * cnt}$, $${base} \\cdot ${cnt + 1} = ${base * (cnt + 1)}$). Există ${cnt} fracții.`,
      ),
      verify: () => base * cnt < N && base * (cnt + 1) >= N,
    }
  }
}

// ============================== comparing and ordering (pp. 146–151) ==============================

// p. 151, ex. 17: order fractions with the same denominator (the same numerator)
const orderSameTerm: Form = (rng) => {
  const sameDen = rng() < 0.5
  const k = int(rng, 3, 25)
  const others = shuffle(rng, Array.from({ length: 30 }, (_, i) => i + 1).filter((x) => x !== k)).slice(0, 5)
  const fs = others.map((x) => (sameDen ? [x, k] : [k, x]) as [number, number])
  const sorted = [...fs].sort((p, q) => p[0] / p[1] - q[0] / q[1])
  return {
    text: `Scrieți în ordine crescătoare fracțiile: $${fs.map(([a, b]) => fr(a, b)).join(', ')}$.`,
    solution: lines(
      sameDen ? 'Fracțiile au același numitor, deci este mai mică cea cu numărătorul mai mic.' : 'Fracțiile au același numărător, deci este mai mică cea cu numitorul mai mare.',
      `$${sorted.map(([a, b]) => fr(a, b)).join(' < ')}$`,
    ),
    verify: () => sorted.every((f, i) => i === 0 || f[0] / f[1] > sorted[i - 1][0] / sorted[i - 1][1]),
  }
}

// p. 151, ex. 12: between which consecutive natural numbers a fraction lies
const betweenNaturals: Form = (rng) => {
  const b = int(rng, 3, 150)
  const n = int(rng, 0, 60)
  const r = int(rng, 1, b - 1)
  const a = n * b + r
  return {
    text: `Precizați două numere naturale consecutive între care este situată fracția $${fr(nr(a), b)}$.`,
    solution: lines(
      n === 0 ? `Fracția este subunitară: $0 < ${fr(a, b)} < 1$.` : `Scoatem întregii: $${nr(a)} = ${b} \\cdot ${n} + ${r}$, deci $${fr(nr(a), b)} = ${n}${fr(r, b)}$.`,
      `Cum $${n} < ${n === 0 ? fr(a, b) : `${n}${fr(r, b)}`} < ${n + 1}$, fracția este situată între ${n} și ${n + 1}.`,
    ),
    verify: () => a > n * b && a < (n + 1) * b,
  }
}

// p. 151, ex. 14: a mixed number against a fraction with the same denominator
const compareMixed: Form = (rng) => {
  const b = int(rng, 3, 40)
  const c = int(rng, 1, 12)
  const r = int(rng, 1, b - 1)
  const whole = c * b + r
  const other = whole + pick(rng, [-2, -1, 0, 1, 2])
  const sign = whole < other ? '<' : whole > other ? '>' : '='
  return {
    text: `Completați spațiul liber cu unul dintre simbolurile $<$, $=$, $>$, astfel încât să obțineți o propoziție adevărată: $${c}${fr(r, b)} \\ldots ${fr(other, b)}$.`,
    solution: `Introducem întregii: $${c}${fr(r, b)} = ${fr(`${c} \\cdot ${b} + ${r}`, b)} = ${fr(whole, b)}$. Fracțiile au același numitor și $${whole} ${sign} ${other}$, deci $${c}${fr(r, b)} ${sign} ${fr(other, b)}$.`,
    verify: () => (sign === '<') === whole < other && (sign === '=') === (whole === other),
  }
}

// p. 151, ex. 15: compare two fractions (same numerator, or bring them to a common denominator)
const compareTwo: Form = (rng) => {
  for (;;) {
    const [a, b, c, d] = [int(rng, 1, 40), int(rng, 2, 50), int(rng, 1, 40), int(rng, 2, 50)]
    if (a * d === b * c || b === d || a === c) continue
    const sign = a * d < b * c ? '<' : '>'
    const L = lcm(b, d)
    return {
      text: `Comparați fracțiile $${fr(a, b)}$ și $${fr(c, d)}$.`,
      solution: lines(
        `Aducem fracțiile la același numitor, ${L}: $${fr(a, b)} = ${fr((a * L) / b, L)}$, $${fr(c, d)} = ${fr((c * L) / d, L)}$.`,
        `Cum $${(a * L) / b} ${sign} ${(c * L) / d}$, rezultă $${fr(a, b)} ${sign} ${fr(c, d)}$.`,
      ),
      verify: () => ((a * L) / b < (c * L) / d) === (a / b < c / d),
    }
  }
}

// p. 151, ex. 18: order descending, with a common denominator
const orderDescending: Form = (rng) => {
  const dens = shuffle(rng, [2, 3, 4, 5, 6, 8, 9, 10, 12]).slice(0, 5)
  const fs = dens.map((d) => [int(rng, 1, 2 * d), d] as [number, number])
  const L = dens.reduce(lcm)
  const sorted = [...fs].sort((p, q) => (q[0] * L) / q[1] - (p[0] * L) / p[1])
  const uniq = new Set(fs.map(([a, b]) => (a * L) / b)).size === fs.length
  return {
    text: `Scrieți în ordine descrescătoare fracțiile: $${fs.map(([a, b]) => fr(a, b)).join(', ')}$.`,
    solution: lines(
      `Numitorul comun este ${L}: $${fs.map(([a, b]) => `${fr(a, b)} = ${fr((a * L) / b, L)}`).join('; \\ ')}$.`,
      `Ordinea descrescătoare: $${sorted.map(([a, b]) => fr(a, b)).join(uniq ? ' > ' : ' \\ge ')}$.`,
    ),
    verify: () => sorted.every((f, i) => i === 0 || f[0] / f[1] <= sorted[i - 1][0] / sorted[i - 1][1]),
  }
}

// p. 151, ex. 16, 19: natural numbers x (n) for which an inequality of fractions holds
const unknownInequality: Form = (rng) => {
  const t = int(rng, 0, 3)
  if (t === 0) {
    const q = int(rng, 11, 99)
    const c = int(rng, 1, 9)
    const k = c + int(rng, 2, 9)
    const ns = Array.from({ length: k - c }, (_, i) => i)
    return {
      text: `Determinați numerele naturale $n$ pentru care $${fr(`n + ${c}`, q)} < ${fr(k, q)}$.`,
      solution: `Fracțiile au același numitor, deci $n + ${c} < ${k}$, adică $n < ${k - c}$: $n \\in \\{${ns.join(', ')}\\}$.`,
      verify: () => ns.every((n) => n + c < k) && !(k - c + c < k),
    }
  }
  if (t === 1) {
    const p = int(rng, 5, 60)
    const c = int(rng, 1, 6)
    const k = c + int(rng, 2, 8)
    const ns = Array.from({ length: k - c }, (_, i) => i)
    return {
      text: `Determinați numerele naturale $n$ pentru care $${fr(p, `n + ${c}`)} > ${fr(p, k)}$.`,
      solution: `Fracțiile au același numărător, deci este mai mare cea cu numitorul mai mic: $n + ${c} < ${k}$, adică $n \\in \\{${ns.join(', ')}\\}$.`,
      verify: () => ns.every((n) => p / (n + c) > p / k),
    }
  }
  if (t === 2) {
    const q = int(rng, 20, 99)
    const a = int(rng, 1, 60)
    const b = a + int(rng, 2, 7)
    const xs = Array.from({ length: b - a - 1 }, (_, i) => a + 1 + i)
    return {
      text: `Determinați numerele naturale $x$, astfel încât $${fr(a, q)} < ${fr('x', q)} < ${fr(b, q)}$.`,
      solution: `Același numitor: $${a} < x < ${b}$, deci $x \\in \\{${xs.join(', ')}\\}$.`,
      verify: () => xs.every((x) => x > a && x < b),
    }
  }
  const p = int(rng, 11, 99)
  const a = int(rng, 2, 15)
  const b = a + int(rng, 2, 6)
  const xs = Array.from({ length: b - a + 1 }, (_, i) => a + i)
  return {
    text: `Determinați numerele naturale $x$, astfel încât $${fr(p, a)} \\ge ${fr(p, 'x')} \\ge ${fr(p, b)}$.`,
    solution: `Fracțiile au același numărător, deci ordinea numitorilor este inversă: $${a} \\le x \\le ${b}$, adică $x \\in \\{${xs.join(', ')}\\}$.`,
    verify: () => xs.every((x) => p / a >= p / x && p / x >= p / b),
  }
}

// p. 151, ex. 20: the five smallest supraunitary fractions (2x + 1)/5
const smallestSupraunitary: Form = (rng) => {
  const a = int(rng, 2, 5)
  const b = int(rng, 1, a - 1 + 3)
  const c = int(rng, b + 1, 15)
  const x0 = Math.floor((c - b) / a) + 1
  const xs = Array.from({ length: 5 }, (_, i) => x0 + i)
  return {
    text: `Scrieți cele mai mici cinci fracții supraunitare diferite, de forma $${fr(`${a}x + ${b}`, c)}$, unde $x$ este un număr natural.`,
    solution: lines(
      `Fracția este supraunitară dacă $${a}x + ${b} > ${c}$, adică $${a}x > ${c - b}$, deci $x \\ge ${x0}$.`,
      `Cele mai mici cinci se obțin pentru $x = ${xs.join(', ')}$: $${xs.map((x) => fr(a * x + b, c)).join(', ')}$.`,
    ),
    verify: () => a * x0 + b > c && a * (x0 - 1) + b <= c,
  }
}

// p. 153, test 1, V.2 c): the common denominator of three fractions
const commonDenominator: Form = (rng) => {
  const ds = shuffle(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24]).slice(0, 3).sort((x, y) => x - y)
  const fs = ds.map((d) => {
    let a = int(rng, 1, d - 1)
    while (gcd(a, d) !== 1) a++
    return [a, d] as [number, number]
  })
  const L = ds.reduce(lcm)
  return {
    text: `Calculați numitorul comun al fracțiilor $${fs.map(([a, b]) => fr(a, b)).join('$, $')}$ și aduceți fracțiile la acest numitor.`,
    solution: lines(
      `Numitorul comun este cel mai mic multiplu comun al numitorilor ${list(ds)}: ${L}.`,
      `$${fs.map(([a, b]) => `${fr(a, b)} = ${fr((a * L) / b, L)}`).join('; \\ ')}$.`,
    ),
    verify: () => ds.every((d) => L % d === 0) && [...Array(L).keys()].slice(1).every((m) => !ds.every((e) => m % e === 0)),
  }
}

// p. 152, ex. 22: order 1/a², 1/b², 1/(a·b)
const orderReciprocals: Form = (rng) => {
  const a = int(rng, 2, 30)
  const b = a + int(rng, 1, 9)
  const big = rng() < 0.4
  const [A, B] = big ? [a + 2000, b + 2000] : [a, b]
  const items = shuffle(rng, [fr(1, `${A}^2`), fr(1, `${B}^2`), fr(1, `${A} \\cdot ${B}`)])
  return {
    text: `Ordonați descrescător fracțiile: $${items.join(', ')}$.`,
    solution: lines(
      `Fracțiile au același numărător, 1, deci este mai mare cea cu numitorul mai mic. Cum $${A} < ${B}$: $${A}^2 = ${A} \\cdot ${A} < ${A} \\cdot ${B} < ${B} \\cdot ${B} = ${B}^2$.`,
      `Deci $${fr(1, `${A}^2`)} > ${fr(1, `${A} \\cdot ${B}`)} > ${fr(1, `${B}^2`)}$.`,
    ),
    verify: () => 1 / (A * A) > 1 / (A * B) && 1 / (A * B) > 1 / (B * B),
  }
}

// p. 152, ex. 23: k + r/b < n/b < k + s/b
const naturalsBetweenMixed: Form = (rng) => {
  const b = int(rng, 7, 99)
  const k = int(rng, 1, 12)
  const r = int(rng, 0, b - 6)
  const s = r + int(rng, 3, 5)
  const lo = k * b + r
  const hi = k * b + s
  const ns = Array.from({ length: hi - lo - 1 }, (_, i) => lo + 1 + i)
  const left = r === 0 ? String(k) : `${k}${fr(r, b)}`
  return {
    text: `Determinați numerele naturale $n$ pentru care $${left} < ${fr('n', b)} < ${k}${fr(s, b)}$.`,
    solution: lines(
      `Introducem întregii: $${left} = ${fr(lo, b)}$ și $${k}${fr(s, b)} = ${fr(hi, b)}$.`,
      `Fracțiile au același numitor, deci $${lo} < n < ${hi}$: $n \\in \\{${ns.join(', ')}\\}$.`,
    ),
    verify: () => ns.every((n) => n * 1 > lo && n < hi) && ns.length === hi - lo - 1,
  }
}

// p. 152, ex. 25: the greatest and the least fraction xy/97 with xy odd, divisible by 9 (3), x ≠ y
const extremeDigitFraction: Form = (rng) => {
  const d = pick(rng, [3, 9, 7, 13])
  const odd = rng() < 0.5
  const q = int(rng, 89, 199)
  const ok = Array.from({ length: 90 }, (_, i) => i + 10).filter((n) => n % d === 0 && n % 2 === (odd ? 1 : 0) && Math.floor(n / 10) !== n % 10)
  const [lo, hi] = [ok[0], ok[ok.length - 1]]
  return {
    text: `Determinați cea mai mare și cea mai mică fracție de forma $${fr(bar('xy'), q)}$, unde $${bar('xy')}$ $(x \\ne y)$ este număr ${odd ? 'impar' : 'par'} divizibil cu ${d}.`,
    solution: lines(
      `Fracțiile au același numitor, deci căutăm cel mai mic și cel mai mare număr $${bar('xy')}$ cu proprietățile cerute. Numerele de două cifre ${odd ? 'impare' : 'pare'}, divizibile cu ${d}, cu cifre diferite: ${list(ok)}.`,
      `Cea mai mică fracție: $${fr(lo, q)}$; cea mai mare: $${fr(hi, q)}$.`,
    ),
    verify: () => ok.length > 1 && lo % d === 0 && hi % d === 0,
  }
}

// p. 153, test 1, V.1: subunitary (supraunitary) and irreducible (reducible)
const kindAndIrreducible: Form = (rng) => {
  for (;;) {
    const supra = rng() < 0.4
    if (supra) {
      const k = pick(rng, [6, 8, 9, 10, 12, 14, 15, 16, 18, 20])
      const c = int(rng, 1, 4)
      if (c >= k) continue
      const ns = Array.from({ length: k - c }, (_, n) => n).filter((n) => gcd(k, n + c) === 1)
      if (!ns.length) continue
      return {
        text: `Determinați numerele naturale $n$, știind că fracția $${fr(k, `n + ${c}`)}$ este supraunitară și ireductibilă.`,
        solution: lines(
          `Supraunitară: $n + ${c} < ${k}$, adică $n + ${c} \\in \\{${Array.from({ length: k - c }, (_, i) => i + c).join(', ')}\\}$.`,
          `Ireductibilă: $n + ${c}$ nu are divizori comuni cu ${k} în afară de 1. Rămân $n + ${c} \\in \\{${ns.map((n) => n + c).join(', ')}\\}$, deci $n \\in \\{${ns.join(', ')}\\}$.`,
        ),
        verify: () => ns.every((n) => k > n + c && gcd(k, n + c) === 1),
      }
    }
    const a = int(rng, 2, 4)
    const b = int(rng, 1, 3)
    const q = pick(rng, [10, 12, 14, 15, 18, 20, 21, 24, 25, 30])
    const reducible = rng() < 0.5
    const all = Array.from({ length: 30 }, (_, n) => n).filter((n) => a * n + b < q)
    const ns = all.filter((n) => (gcd(a * n + b, q) === 1) !== reducible)
    if (!ns.length || ns.length === all.length) continue
    return {
      text: `Determinați numerele naturale $n$, știind că fracția $${fr(`${a}n + ${b}`, q)}$ este subunitară și ${reducible ? 'reductibilă' : 'ireductibilă'}.`,
      solution: lines(
        `Subunitară: $${a}n + ${b} < ${q}$, deci $n \\in \\{${all.join(', ')}\\}$, iar numărătorul ia valorile ${list(all.map((n) => a * n + b))}.`,
        `${reducible ? 'Reductibilă: numărătorul are un divizor comun cu' : 'Ireductibilă: numărătorul nu are divizori comuni (în afară de 1) cu'} ${q}. Rămâne $n \\in \\{${ns.join(', ')}\\}$.`,
      ),
      verify: () => ns.every((n) => a * n + b < q && (gcd(a * n + b, q) > 1) === reducible),
    }
  }
}

// p. 157, I.3: by what was N/M simplified to give p/q
const simplifiedBy: Form = (rng) => {
  for (;;) {
    const [p, q] = [int(rng, 1, 15), int(rng, 2, 20)]
    if (gcd(p, q) !== 1 || p === q) continue
    const n = int(rng, 2, 15)
    return {
      text: `Dacă fracția $${fr(n * p, n * q)}$, simplificată cu $n$, devine $${fr(p, q)}$, aflați numărul natural $n$.`,
      solution: `Prin simplificare cu $n$ numărătorul s-a împărțit la $n$: $${n * p} : n = ${p}$, deci $n = ${n}$ (verificare: $${n * q} : ${n} = ${q}$).`,
      verify: () => (n * p) / n === p && (n * q) / n === q,
    }
  }
}

// p. 155, test 2, V.1: c0 / db is reducible: the digit b
const reducibleDigit: Form = (rng) => {
  for (;;) {
    const c = int(rng, 1, 9)
    const d = int(rng, 1, 9)
    const bs = Array.from({ length: 10 }, (_, b) => b).filter((b) => gcd(10 * c, 10 * d + b) > 1)
    if (!bs.length || bs.length === 10) continue
    return {
      text: `Se consideră fracția $${fr(bar(`${c}0`), bar(`${d}b`))}$. Determinați cifra $b$, astfel încât fracția să fie reductibilă.`,
      solution: lines(
        `Numărătorul ${10 * c} are divizorii primi ${list(divisors(10 * c).filter((x) => isPrime(x)))}. Fracția este reductibilă dacă $${bar(`${d}b`)}$ se divide cu unul dintre ei.`,
        `Încercând cifrele: $b \\in \\{${bs.join(', ')}\\}$ (numerele ${list(bs.map((b) => 10 * d + b))}).`,
      ),
      verify: () => bs.every((b) => gcd(10 * c, 10 * d + b) > 1),
    }
  }
}

// p. 156, test 3, V.1: the fractions a/b that give P/Q when amplified
const amplifiedFrom: Form = (rng) => {
  for (;;) {
    const [p, q] = [int(rng, 1, 7), int(rng, 2, 9)]
    if (gcd(p, q) !== 1 || p === q) continue
    const g = pick(rng, [4, 6, 8, 9, 10, 12])
    const [P, Q] = [g * p, g * q]
    const ks = divisors(g)
    return {
      text: `Prin amplificarea unei fracții $${fr('a', 'b')}$ cu un număr natural nenul s-a obținut fracția $${fr(P, Q)}$. Determinați toate fracțiile $${fr('a', 'b')}$ care îndeplinesc această condiție.`,
      solution: lines(
        `Dacă $${fr('a', 'b')}$ s-a amplificat cu $k$, atunci $${P} = k \\cdot a$ și $${Q} = k \\cdot b$, deci $k$ este un divizor comun al lui ${P} și ${Q}: $k \\in \\{${ks.join(', ')}\\}$.`,
        `Fracțiile sunt: $${ks.map((k) => fr(P / k, Q / k)).join('$, $')}$.`,
      ),
      verify: () => ks.every((k) => P % k === 0 && Q % k === 0) && gcd(P, Q) === g,
    }
  }
}

// p. 156, test 3, V.2 c): p/q < N/(2n + 1) < r/s
const doubleInequality: Form = (rng) => {
  for (;;) {
    const N = pick(rng, [12, 15, 18, 20, 24, 30, 36])
    const [p, q] = [int(rng, 1, 5), int(rng, 1, 4)]
    const [r, s] = [int(rng, 2, 9), int(rng, 1, 3)]
    if (gcd(p, q) !== 1 || gcd(r, s) !== 1 || p / q >= r / s) continue
    const ns = Array.from({ length: 40 }, (_, n) => n).filter((n) => p * (2 * n + 1) < N * q && N * s < r * (2 * n + 1))
    if (!ns.length || ns.length > 6) continue
    return {
      text: `Determinați numerele naturale $n$, astfel încât să fie adevărată dubla inegalitate $${fr(p, q)} < ${fr(N, '2n + 1')} < ${fr(r, s)}$.`,
      solution: lines(
        `Din $${fr(p, q)} < ${fr(N, '2n + 1')}$: $${p}(2n + 1) < ${N * q}$. Din $${fr(N, '2n + 1')} < ${fr(r, s)}$: $${N * s} < ${r}(2n + 1)$.`,
        `Deci $${fr(N * s, r)} < 2n + 1 < ${fr(N * q, p)}$; numerele impare dintre aceste limite sunt ${list(ns.map((n) => 2 * n + 1))}, adică $n \\in \\{${ns.join(', ')}\\}$.`,
      ),
      verify: () => ns.every((n) => p / q < N / (2 * n + 1) && N / (2 * n + 1) < r / s),
    }
  }
}

// p. 157, II.2: (a^(m+i) + a^m)/(a^(m+j) − a^m)
const powerQuotient: Form = (rng) => {
  const a = int(rng, 2, 5)
  const m = int(rng, 10, 2030)
  const i = int(rng, 1, 3)
  const j = int(rng, 1, 3)
  const [u, v] = [a ** i + 1, a ** j - 1]
  const g = gcd(u, v)
  return {
    text: `Aduceți la forma ireductibilă fracția $${fr(`${a}^{${m + i}} + ${a}^{${m}}`, `${a}^{${m + j}} - ${a}^{${m}}`)}$.`,
    solution: show(`${fr(`${a}^{${m}} \\cdot (${a}^{${i}} + 1)`, `${a}^{${m}} \\cdot (${a}^{${j}} - 1)`)} = ${fr(u, v)}${g > 1 ? ` = ${simp(u, v)}` : ''}`),
    verify: () => Math.abs((a ** (5 + i) + a ** 5) / (a ** (5 + j) - a ** 5) - u / v) < 1e-9,
  }
}

// p. 158, IV a), b): the unknown in a mixed number
const unknownInMixed: Form = (rng) => {
  const b = int(rng, 3, 15)
  const n = int(rng, 1, 20)
  const r = int(rng, 1, b - 1)
  const N = n * b + r
  if (rng() < 0.5)
    return {
      text: `Determinați numărul natural $n$, știind că $${fr(N, b)} = n${fr(r, b)}$.`,
      solution: `Scoatem întregii: $${N} = ${b} \\cdot ${n} + ${r}$, deci $${fr(N, b)} = ${n}${fr(r, b)}$ și $n = ${n}$.`,
      verify: () => n * b + r === N,
    }
  return {
    text: `Determinați numărul natural $n$, știind că $${n}${fr('n', b)} = ${fr(N, b)}$.`,
    solution: `Introducem întregii: $${n}${fr('n', b)} = ${fr(`${n * b} + n`, b)}$, deci $${n * b} + n = ${N}$ și $n = ${r}$ (mai mic decât ${b}, cum trebuie).`,
    verify: () => n * b + r === N && r < b,
  }
}

// p. 158, V: f = (2^(n+a)·3^n − 2^n·3^n)/(2^(n+b)·3^(n+c)), compared with 1/k
const powerFractionCompare: Form = (rng) => {
  const a = int(rng, 1, 4)
  const b = int(rng, 1, 3)
  const c = int(rng, 1, 3)
  const [u, v] = [2 ** a - 1, 2 ** b * 3 ** c]
  const k = int(rng, 2, 9)
  const sign = u * k < v ? '<' : u * k > v ? '>' : '='
  return {
    text: `Se consideră fracțiile $f_1 = ${fr(1, k)}$ și $f_2 = ${fr(`2^{n+${a}} \\cdot 3^{n} - 2^{n} \\cdot 3^{n}`, `2^{n+${b}} \\cdot 3^{n+${c}}`)}$, unde $n$ este un număr natural. Comparați fracțiile $f_1$ și $f_2$.`,
    solution: lines(
      show(`f_2 = ${fr(`2^{n} \\cdot 3^{n} \\cdot (2^{${a}} - 1)`, `2^{n} \\cdot 3^{n} \\cdot 2^{${b}} \\cdot 3^{${c}}`)} = ${fr(u, v)}${gcd(u, v) > 1 ? ` = ${simp(u, v)}` : ''}`),
      `Comparăm prin produsele „pe cruce”: $1 \\cdot ${v} = ${v}$ și $${k} \\cdot ${u} = ${k * u}$, deci $f_1 ${sign === '<' ? '>' : sign === '>' ? '<' : '='} f_2$.`,
    ),
    verify: () => Math.abs((2 ** (3 + a) * 27 - 8 * 27) / (2 ** (3 + b) * 3 ** (3 + c)) - u / v) < 1e-12,
  }
}

// ============================== addition and subtraction (pp. 160–165) ==============================

/** the irreducible form of a/b, written after "=" only when it differs */
const andSimp = (a: number, b: number) => (gcd(a, b) > 1 || b === 1 ? ` = ${simp(a, b)}` : '')
const mixed = (a: number, b: number) => {
  const g = gcd(a, b)
  const [p, q] = [a / g, b / g]
  if (q === 1) return String(p)
  return p > q ? `${fr(p, q)} = ${Math.floor(p / q)}${fr(p % q, q)}` : fr(p, q)
}

// p. 163, ex. 1–3: fractions with the same denominator
const sameDenominator: Form = (rng) => {
  const m = int(rng, 5, 160)
  const k = int(rng, 2, 4)
  const minus = rng() < 0.5
  const terms = Array.from({ length: k }, () => int(rng, 1, Math.max(2, Math.floor(m / 2))))
  if (minus) terms[0] = terms.slice(1).reduce((s, x) => s + x, 0) + int(rng, 1, m)
  const res = minus ? terms[0] - terms.slice(1).reduce((s, x) => s + x, 0) : terms.reduce((s, x) => s + x, 0)
  const op = minus ? ' - ' : ' + '
  return {
    text: `Calculați: $${terms.map((t) => fr(t, m)).join(op)}$.`,
    solution: show(`${terms.map((t) => fr(t, m)).join(op)} = ${fr(terms.join(op), m)} = ${fr(res, m)}${andSimp(res, m)}`),
    verify: () => res > 0,
  }
}

// p. 163, ex. 5: two fractions with different denominators, the result irreducible
const differentDenominators: Form = (rng) => {
  for (;;) {
    const [b, d] = [int(rng, 2, 40), int(rng, 2, 40)]
    if (b === d) continue
    const [a, c] = [int(rng, 1, 2 * b), int(rng, 1, 2 * d)]
    const minus = rng() < 0.4
    const L = lcm(b, d)
    const [x, y] = [(a * L) / b, (c * L) / d]
    if (minus && x <= y) continue
    const res = minus ? x - y : x + y
    return {
      text: `Calculați și exprimați rezultatul printr-o fracție ireductibilă: $${fr(a, b)} ${minus ? '-' : '+'} ${fr(c, d)}$.`,
      solution: lines(
        `Numitorul comun este ${L} (cel mai mic multiplu comun al lui ${b} și ${d}).`,
        show(`${fr(a, b)} ${minus ? '-' : '+'} ${fr(c, d)} = ${fr(x, L)} ${minus ? '-' : '+'} ${fr(y, L)} = ${fr(res, L)}${andSimp(res, L)}`),
      ),
      verify: () => Math.abs((minus ? a / b - c / d : a / b + c / d) - res / L) < 1e-12,
    }
  }
}

// p. 163, ex. 6: mixed numbers
const mixedNumbers: Form = (rng) => {
  for (;;) {
    const [b, d] = [int(rng, 2, 12), int(rng, 2, 12)]
    const [p, q] = [int(rng, 1, 9), int(rng, 1, 9)]
    const [r, s] = [int(rng, 1, b - 1), int(rng, 1, d - 1)]
    const minus = rng() < 0.5
    const A = p * b + r
    const C = q * d + s
    if (minus && A * d <= C * b) continue
    const L = lcm(b, d)
    const res = minus ? (A * L) / b - (C * L) / d : (A * L) / b + (C * L) / d
    return {
      text: `Calculați și exprimați rezultatul printr-o fracție ireductibilă: $${p}${fr(r, b)} ${minus ? '-' : '+'} ${q}${fr(s, d)}$.`,
      solution: lines(
        `Introducem întregii: $${p}${fr(r, b)} = ${fr(A, b)}$, $${q}${fr(s, d)} = ${fr(C, d)}$.`,
        show(`${fr(A, b)} ${minus ? '-' : '+'} ${fr(C, d)} = ${fr((A * L) / b, L)} ${minus ? '-' : '+'} ${fr((C * L) / d, L)} = ${fr(res, L)}${gcd(res, L) > 1 || res > L ? ` = ${mixed(res, L)}` : ''}`),
      ),
      verify: () => Math.abs((minus ? A / b - C / d : A / b + C / d) - res / L) < 1e-12,
    }
  }
}

// p. 163, ex. 4: terms with a letter and the same denominator
const letterTerms: Form = (rng) => {
  const m = int(rng, 5, 60)
  const x = pick(rng, ['a', 'b', 'c', 'x', 'y'])
  const minus = rng() < 0.5
  const ks = [int(rng, 1, 30), int(rng, 1, 15), int(rng, 1, 15)]
  if (minus) ks[0] = ks[1] + ks[2] + int(rng, 1, 20)
  const res = minus ? ks[0] - ks[1] - ks[2] : ks[0] + ks[1] + ks[2]
  const t = (k: number) => fr(`${k === 1 ? '' : k}${x}`, m)
  const g = gcd(res, m)
  const final = m / g === 1 ? `${res / g === 1 ? '' : res / g}${x}` : fr(`${res / g === 1 ? '' : res / g}${x}`, m / g)
  return {
    text: `Calculați: $${ks.map(t).join(minus ? ' - ' : ' + ')}$.`,
    solution: show(`${ks.map(t).join(minus ? ' - ' : ' + ')} = ${t(res)}${g > 1 ? ` = ${final}` : ''}`),
    verify: () => res > 0,
  }
}

// p. 163, ex. 9; p. 164, ex. 11–13: the fraction greater (smaller) by p/q; the minuend and the subtrahend
const greaterOrSmallerBy: Form = (rng) => {
  for (;;) {
    const [b, d] = [int(rng, 2, 30), int(rng, 2, 30)]
    const [a, c] = [int(rng, 1, 3 * b), int(rng, 1, 3 * d)]
    const L = lcm(b, d)
    const [x, y] = [(a * L) / b, (c * L) / d]
    const t = int(rng, 0, 2)
    if (t === 0)
      return {
        text: `Calculați fracția cu $${fr(c, d)}$ mai mare decât fracția $${fr(a, b)}$.`,
        solution: show(`${fr(a, b)} + ${fr(c, d)} = ${fr(x, L)} + ${fr(y, L)} = ${fr(x + y, L)}${andSimp(x + y, L)}`),
        verify: () => Math.abs(a / b + c / d - (x + y) / L) < 1e-12,
      }
    if (x <= y) continue
    if (t === 1)
      return {
        text: `Calculați fracția cu $${fr(c, d)}$ mai mică decât fracția $${fr(a, b)}$.`,
        solution: show(`${fr(a, b)} - ${fr(c, d)} = ${fr(x, L)} - ${fr(y, L)} = ${fr(x - y, L)}${andSimp(x - y, L)}`),
        verify: () => Math.abs(a / b - c / d - (x - y) / L) < 1e-12,
      }
    return {
      text: `Diferența a două fracții ordinare este $${fr(c, d)}$, iar scăzătorul este $${fr(a, b)}$. Calculați descăzutul.`,
      solution: `Descăzutul este suma dintre diferență și scăzător: $${fr(c, d)} + ${fr(a, b)} = ${fr(y, L)} + ${fr(x, L)} = ${fr(x + y, L)}${andSimp(x + y, L)}$.`,
      verify: () => Math.abs(a / b + c / d - (x + y) / L) < 1e-12,
    }
  }
}

// p. 164, ex. 15: three or four fractions with related denominators
const sumOfSeveral: Form = (rng) => {
  const base = pick(rng, [2, 3, 5])
  const dens = shuffle(rng, [base, base * 2, base * 3, base * 4, base * 6, base * 9, base * 10, base * 12]).slice(0, int(rng, 3, 4))
  const fs = dens.map((d) => [int(rng, 1, d - 1), d] as [number, number])
  const L = dens.reduce(lcm)
  const tot = fs.reduce((s, [a, b]) => s + (a * L) / b, 0)
  return {
    text: `Efectuați: $${fs.map(([a, b]) => fr(a, b)).join(' + ')}$.`,
    solution: lines(
      `Numitorul comun este ${L}.`,
      show(`${fs.map(([a, b]) => fr((a * L) / b, L)).join(' + ')} = ${fr(tot, L)}${gcd(tot, L) > 1 || tot > L ? ` = ${mixed(tot, L)}` : ''}`),
    ),
    verify: () => Math.abs(fs.reduce((s, [a, b]) => s + a / b, 0) - tot / L) < 1e-9,
  }
}

// p. 164, ex. 14: 1/k + 1/k² + … + 1/k^n
const powersOfOneOver: Form = (rng) => {
  const k = pick(rng, [2, 3, 4, 5])
  const n = int(rng, 3, k === 2 ? 8 : 5)
  const L = k ** n
  const num = (L - 1) / (k - 1)
  const terms = Array.from({ length: n }, (_, i) => fr(1, i === 0 ? String(k) : `${k}^{${i + 1}}`))
  return {
    text: `Calculați suma: $${terms.join(' + ')}$.`,
    solution: lines(
      `Numitorul comun este $${k}^{${n}} = ${nr(L)}$; amplificăm fiecare fracție: $${Array.from({ length: n }, (_, i) => fr(k ** (n - 1 - i), nr(L))).join(' + ')}$.`,
      show(`= ${fr(Array.from({ length: n }, (_, i) => k ** (n - 1 - i)).join(' + '), nr(L))} = ${fr(nr(num), nr(L))}`),
    ),
    verify: () => Math.abs(Array.from({ length: n }, (_, i) => 1 / k ** (i + 1)).reduce((s, x) => s + x, 0) - num / L) < 1e-12 && gcd(num, L) === 1,
  }
}

// p. 164, ex. 19: 1/N + 2/N + … + k/N (the even numerators 2 + 4 + … + 2k)
const gaussNumerators: Form = (rng) => {
  const even = rng() < 0.4
  const k = int(rng, 10, 60)
  const N = int(rng, 100, 999)
  const S = even ? k * (k + 1) : (k * (k + 1)) / 2
  const last = even ? 2 * k : k
  return {
    text: `Calculați: $${fr(even ? 2 : 1, N)} + ${fr(even ? 4 : 2, N)} + ${fr(even ? 6 : 3, N)} + \\ldots + ${fr(last, N)}$.`,
    solution: lines(
      `Fracțiile au același numitor, deci adunăm numărătorii: $${even ? `2 + 4 + \\ldots + ${last} = 2(1 + 2 + \\ldots + ${k}) = ${k} \\cdot ${k + 1}` : `1 + 2 + \\ldots + ${k} = \\frac{${k} \\cdot ${k + 1}}{2}`} = ${nr(S)}$.`,
      show(`${fr(nr(S), N)}${gcd(S, N) > 1 || S >= N ? ` = ${mixed(S, N).replace(/\d{4,}/g, (m) => nr(Number(m)))}` : ''}`),
    ),
    verify: () => S === Array.from({ length: k }, (_, i) => (even ? 2 : 1) * (i + 1)).reduce((s, x) => s + x, 0),
  }
}

// p. 164, ex. 20: three workers who finish a job in t1, t2, t3 hours
const threeWorkers: Form = (rng) => {
  const ts = shuffle(rng, [6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60]).slice(0, 3).sort((x, y) => x - y)
  const L = ts.reduce(lcm)
  const parts = ts.map((t) => L / t)
  const sum = parts.reduce((s, x) => s + x, 0)
  const g = gcd(sum, L)
  return {
    text: `Un muncitor, lucrând singur, termină o lucrare în ${de(ts[0])} ore, al doilea în ${de(ts[1])} ore, iar al treilea în ${de(ts[2])} ore. a) Cât lucrează într-o oră fiecare muncitor? b) Cât lucrează într-o oră cei trei muncitori împreună? c) În câte ore termină lucrarea lucrând împreună?`,
    solution: lines(
      `a) Într-o oră fac $${fr(1, ts[0])}$, $${fr(1, ts[1])}$, respectiv $${fr(1, ts[2])}$ din lucrare.`,
      `b) Împreună: $${ts.map((t) => fr(1, t)).join(' + ')} = ${parts.map((p) => fr(p, L)).join(' + ')} = ${fr(sum, L)}${g > 1 ? ` = ${fr(sum / g, L / g)}` : ''}$ din lucrare.`,
      `c) Toată lucrarea ($1 = ${fr(L / g, L / g)}$) o termină în $${fr(L / g, sum / g)}${sum / g === 1 || (L / g) % (sum / g) === 0 ? '' : ` = ${Math.floor(L / g / (sum / g))}${fr((L / g) % (sum / g), sum / g)}`}$ ore.`,
    ),
    verify: () => Math.abs(1 / (1 / ts[0] + 1 / ts[1] + 1 / ts[2]) - L / sum) < 1e-9,
  }
}

// p. 164, ex. 17: the first day a/m of the work, the second day b/m more: what is left
const workLeft: Form = (rng) => {
  const m = int(rng, 9, 30)
  const a = int(rng, 1, Math.floor(m / 3))
  const b = int(rng, 1, Math.floor(m / 4))
  const second = a + b
  const left = m - a - second
  return {
    text: `Un muncitor realizează într-o zi $${fr(a, m)}$ din lucrare. A doua zi realizează cu $${fr(b, m)}$ mai mult decât în prima zi. Cât din lucrare mai are de realizat muncitorul?`,
    solution: lines(
      `A doua zi: $${fr(a, m)} + ${fr(b, m)} = ${fr(second, m)}$. În două zile: $${fr(a, m)} + ${fr(second, m)} = ${fr(a + second, m)}$.`,
      `Mai are de realizat $1 - ${fr(a + second, m)} = ${fr(m, m)} - ${fr(a + second, m)} = ${fr(left, m)}${andSimp(left, m)}$ din lucrare.`,
    ),
    verify: () => left > 0,
  }
}

// p. 165, ex. 26: 1/(1·2) + 1/(2·3) + … + 1/(n(n + 1))
const telescoping: Form = (rng) => {
  const n = int(rng, 5, 120)
  return {
    text: `Calculați: $${fr(1, '1 \\cdot 2')} + ${fr(1, '2 \\cdot 3')} + ${fr(1, '3 \\cdot 4')} + \\ldots + ${fr(1, `${n} \\cdot ${n + 1}`)}$.`,
    solution: lines(
      `Fiecare termen se scrie ca diferență: $${fr(1, 'k(k + 1)')} = ${fr(1, 'k')} - ${fr(1, 'k + 1')}$.`,
      show(`\\left(1 - ${fr(1, 2)}\\right) + \\left(${fr(1, 2)} - ${fr(1, 3)}\\right) + \\ldots + \\left(${fr(1, n)} - ${fr(1, n + 1)}\\right) = 1 - ${fr(1, n + 1)} = ${fr(n, n + 1)}`),
    ),
    verify: () => Math.abs(Array.from({ length: n }, (_, i) => 1 / ((i + 1) * (i + 2))).reduce((s, x) => s + x, 0) - n / (n + 1)) < 1e-12,
  }
}

// ============================== multiplication (pp. 165–170) ==============================

// p. 169, ex. 4, 12: a product of two or three fractions, simplified across
const productOfFractions: Form = (rng) => {
  const k = int(rng, 2, 3)
  const fs = Array.from({ length: k }, () => [int(rng, 1, 30), int(rng, 2, 30)] as [number, number])
  const N = fs.reduce((s, [a]) => s * a, 1)
  const D = fs.reduce((s, [, b]) => s * b, 1)
  return {
    text: `Calculați: $${fs.map(([a, b]) => fr(a, b)).join(' \\cdot ')}$.`,
    solution: show(`${fs.map(([a, b]) => fr(a, b)).join(' \\cdot ')} = ${fr(fs.map(([a]) => a).join(' \\cdot '), fs.map(([, b]) => b).join(' \\cdot '))} = ${simp(N, D)}`),
    verify: () => Math.abs(fs.reduce((s, [a, b]) => (s * a) / b, 1) - N / D) < 1e-12,
  }
}

// p. 170, ex. 14: distance = speed · time, the time a mixed number of hours
const speedTimesMixed: Form = (rng) => {
  const v = pick(rng, [40, 45, 50, 60, 70, 72, 80, 84, 90, 96, 100])
  const b = pick(rng, divisors(v).filter((d) => d > 1 && d < 13))
  const c = int(rng, 1, 7)
  const r = int(rng, 1, b - 1)
  const d = (v * (c * b + r)) / b
  return {
    text: `Un automobil are viteza de ${v} km pe oră. Ce distanță va parcurge în $${c}${fr(r, b)}$ ore?`,
    solution: show(`d = ${v} \\cdot ${c}${fr(r, b)} = ${v} \\cdot ${fr(c * b + r, b)} = ${fr(`${v} \\cdot ${c * b + r}`, b)} = ${d} \\text{ km}`),
    verify: () => Number.isInteger(d),
  }
}

// p. 169, ex. 9: take the common factor out
const commonFactorOut: Form = (rng) => {
  const k = int(rng, 2, 99)
  const [b, d] = [int(rng, 2, 12), int(rng, 2, 12)]
  const [a, c] = [int(rng, 1, b - 1 || 1), int(rng, 1, d - 1 || 1)]
  const L = lcm(b, d)
  const S = (a * L) / b + (c * L) / d
  return {
    text: `Calculați scoțând factor comun: $${fr(a, b)} \\cdot ${k} + ${fr(c, d)} \\cdot ${k}$.`,
    solution: show(`${k} \\cdot \\left(${fr(a, b)} + ${fr(c, d)}\\right) = ${k} \\cdot ${fr(S, L)} = ${fr(k * S, L)}${gcd(k * S, L) > 1 ? ` = ${simp(k * S, L)}` : ''}`),
    verify: () => Math.abs(k * (a / b + c / d) - (k * S) / L) < 1e-9,
  }
}

// p. 169, ex. 8: a·b and a·c known: a·(b + c), (b − c)·a
const knownProducts: Form = (rng) => {
  const [p, q] = [int(rng, 1, 30), int(rng, 2, 30)]
  const [r, s] = [int(rng, 1, 30), int(rng, 2, 30)]
  const L = lcm(q, s)
  const [x, y] = [(p * L) / q, (r * L) / s]
  const minus = x > y && rng() < 0.5
  return {
    text: `Știind că $a \\cdot b = ${fr(p, q)}$ și $a \\cdot c = ${fr(r, s)}$, calculați $a \\cdot (b ${minus ? '-' : '+'} c)$.`,
    solution: show(`a \\cdot (b ${minus ? '-' : '+'} c) = a \\cdot b ${minus ? '-' : '+'} a \\cdot c = ${fr(p, q)} ${minus ? '-' : '+'} ${fr(r, s)} = ${fr(minus ? x - y : x + y, L)}${andSimp(minus ? x - y : x + y, L)}`),
    verify: () => Math.abs((minus ? p / q - r / s : p / q + r / s) - (minus ? x - y : x + y) / L) < 1e-12,
  }
}

// p. 169, ex. 10; p. 170, ex. 18: (1 + 1/2)(1 + 1/3)…(1 + 1/n) or (1 − 1/2)…(1 − 1/n)
const telescopicProduct: Form = (rng) => {
  const n = int(rng, 10, 300)
  const plus = rng() < 0.6
  return {
    text: `Efectuați: $${plus ? `1${fr(1, 2)} \\cdot 1${fr(1, 3)} \\cdot 1${fr(1, 4)} \\cdot \\ldots \\cdot 1${fr(1, n)}` : `\\left(1 - ${fr(1, 2)}\\right) \\cdot \\left(1 - ${fr(1, 3)}\\right) \\cdot \\ldots \\cdot \\left(1 - ${fr(1, n)}\\right)`}$.`,
    solution: plus
      ? show(`${fr(3, 2)} \\cdot ${fr(4, 3)} \\cdot ${fr(5, 4)} \\cdot \\ldots \\cdot ${fr(n + 1, n)} = ${fr(n + 1, 2)}${(n + 1) % 2 === 0 ? ` = ${(n + 1) / 2}` : ''}`) + '\n\n(fiecare numărător se simplifică cu numitorul fracției următoare).'
      : show(`${fr(1, 2)} \\cdot ${fr(2, 3)} \\cdot ${fr(3, 4)} \\cdot \\ldots \\cdot ${fr(n - 1, n)} = ${fr(1, n)}`) + '\n\n(fiecare numărător se simplifică cu numitorul fracției dinainte).',
    verify: () => Math.abs(Array.from({ length: n - 1 }, (_, i) => (plus ? 1 + 1 / (i + 2) : 1 - 1 / (i + 2))).reduce((s, x) => s * x, 1) - (plus ? (n + 1) / 2 : 1 / n)) < 1e-9,
  }
}

// ============================== division (pp. 170–174) ==============================

// p. 171, ex. 2, 3; p. 172, ex. 4: a quotient of fractions or mixed numbers
const quotientOfFractions: Form = (rng) => {
  const m1 = rng() < 0.4
  const [b, d] = [int(rng, 2, 12), int(rng, 2, 12)]
  const [a, c] = [int(rng, 1, 3 * b), int(rng, 1, 3 * d)]
  const [p, q] = [int(rng, 1, 5), int(rng, 1, b - 1 || 1)]
  const A = m1 ? p * b + q : a
  const left = m1 ? `${p}${fr(q, b)}` : fr(a, b)
  return {
    text: `Calculați: $${left} : ${fr(c, d)}$.`,
    solution: show(`${m1 ? `${fr(A, b)} : ${fr(c, d)}` : `${left} : ${fr(c, d)}`} = ${fr(A, b)} \\cdot ${fr(d, c)} = ${fr(`${A} \\cdot ${d}`, `${b} \\cdot ${c}`)} = ${mixed(A * d, b * c)}`),
    verify: () => Math.abs(A / b / (c / d) - (A * d) / (b * c)) < 1e-12,
  }
}

// p. 172, ex. 8: a fraction over a fraction
const stackedFraction: Form = (rng) => {
  const [a, b, c, d] = [int(rng, 1, 15), int(rng, 2, 20), int(rng, 1, 15), int(rng, 2, 20)]
  return {
    text: `Calculați: $${fr(fr(a, b), fr(c, d))}$.`,
    solution: show(`${fr(fr(a, b), fr(c, d))} = ${fr(a, b)} : ${fr(c, d)} = ${fr(a, b)} \\cdot ${fr(d, c)} = ${mixed(a * d, b * c)}`),
    verify: () => Math.abs(a / b / (c / d) - (a * d) / (b * c)) < 1e-12,
  }
}

// p. 172, ex. 10: (a : b) : (c : d)
const nestedQuotients: Form = (rng) => {
  const f = () => [int(rng, 1, 20), int(rng, 2, 20)] as [number, number]
  const [A, B, C, D] = [f(), f(), f(), f()]
  const x = [A[0] * B[1], A[1] * B[0]]
  const y = [C[0] * D[1], C[1] * D[0]]
  const [n, m] = [x[0] * y[1], x[1] * y[0]]
  return {
    text: `Calculați: $\\left(${fr(...A)} : ${fr(...B)}\\right) : \\left(${fr(...C)} : ${fr(...D)}\\right)$.`,
    solution: lines(
      `$${fr(...A)} : ${fr(...B)} = ${fr(...A)} \\cdot ${fr(B[1], B[0])} = ${simp(x[0], x[1])}$; $${fr(...C)} : ${fr(...D)} = ${simp(y[0], y[1])}$.`,
      show(`${simp(x[0], x[1])} : ${simp(y[0], y[1])} = ${mixed(n, m)}`),
    ),
    verify: () => Math.abs(A[0] / A[1] / (B[0] / B[1]) / (C[0] / C[1] / (D[0] / D[1])) - n / m) < 1e-9,
  }
}

// p. 173, ex. 12, 13: the fraction that multiplied by p/q gives r/s (divided by p/q gives r/s)
const unknownFactor: Form = (rng) => {
  const [p, q, r, s] = [int(rng, 1, 20), int(rng, 2, 30), int(rng, 1, 20), int(rng, 2, 30)]
  const times = rng() < 0.5
  const [n, m] = times ? [r * q, s * p] : [r * p, s * q]
  return {
    text: times ? `Aflați fracția care înmulțită cu $${fr(p, q)}$ dă fracția $${fr(r, s)}$.` : `Împărțind o fracție la $${fr(p, q)}$, se obține $${fr(r, s)}$. Care este această fracție?`,
    solution: times
      ? show(`x = ${fr(r, s)} : ${fr(p, q)} = ${fr(r, s)} \\cdot ${fr(q, p)} = ${mixed(n, m)}`)
      : show(`x = ${fr(r, s)} \\cdot ${fr(p, q)} = ${mixed(n, m)}`),
    verify: () => Math.abs((times ? (n / m) * (p / q) : n / m / (p / q)) - r / s) < 1e-12,
  }
}

// p. 173, ex. 14: flour absorbs a/b of its mass of water, baking loses c/d: how much bread, how many loaves
const flourToBread: Form = (rng) => {
  for (;;) {
    const [a, b] = pick(rng, [[3, 5], [1, 2], [2, 5], [3, 4]] as [number, number][])
    const [c, d] = pick(rng, [[3, 25], [1, 10], [1, 8], [1, 5]] as [number, number][])
    const F = 100 * int(rng, 5, 50)
    const dough = F + (F * a) / b
    const bread = dough - (dough * c) / d
    const w = pick(rng, [400, 500, 800, 1000])
    if (!Number.isInteger(dough) || !Number.isInteger(bread) || (bread * 1000) % w) continue
    return {
      text: `La fabricarea pâinii, făina absoarbe apă în cantitate de $${fr(a, b)}$ din masa ei, iar prin coacere aluatul pierde $${fr(c, d)}$ din masă. Câte kilograme de pâine se fabrică din ${nr(F)} kg de făină? Câte pâini de ${w} g se obțin?`,
      solution: lines(
        `Aluatul: $${nr(F)} + ${fr(a, b)} \\cdot ${nr(F)} = ${nr(F)} + ${nr((F * a) / b)} = ${nr(dough)}$ kg.`,
        `Pâinea: $${nr(dough)} - ${fr(c, d)} \\cdot ${nr(dough)} = ${nr(dough)} - ${nr((dough * c) / d)} = ${nr(bread)}$ kg $= ${nr(bread * 1000)}$ g, deci $${nr(bread * 1000)} : ${w} = ${nr((bread * 1000) / w)}$ de pâini.`,
      ),
      verify: () => Math.abs(F * (1 + a / b) * (1 - c / d) - bread) < 1e-9,
    }
  }
}

// p. 173, ex. 17: 1 + 3 + … + (2n − 1) = n²
const oddSumSquare: Form = (rng) => {
  const n = int(rng, 20, 1200)
  return {
    text: `Știind că $1 + 3 + 5 + \\ldots + (2n - 1) = n^2$, calculați $1 + 3 + 5 + \\ldots + ${nr(2 * n - 1)}$.`,
    solution: `Ultimul termen este $2n - 1 = ${nr(2 * n - 1)}$, deci $n = ${n}$, iar suma este $${n}^2 = ${nr(n * n)}$.`,
    verify: () => Array.from({ length: n }, (_, i) => 2 * i + 1).reduce((s, x) => s + x, 0) === n * n,
  }
}

// ============================== powers of fractions (pp. 174–179) ==============================

const pf = (a: number, b: number, e: number | string) => `\\left(${fr(a, b)}\\right)^{${e}}`

// p. 177, ex. 4: a power of a fraction
const powerOfFraction: Form = (rng) => {
  const [a, b] = [int(rng, 1, 9), int(rng, 2, 12)]
  const e = int(rng, 2, 4)
  return {
    text: `Calculați: $${pf(a, b, e)}$.`,
    solution: show(`${pf(a, b, e)} = ${fr(`${a}^{${e}}`, `${b}^{${e}}`)} = ${fr(a ** e, b ** e)}${gcd(a, b) > 1 ? ` = ${simp(a ** e, b ** e)}` : ''}`),
    verify: () => Math.abs((a / b) ** e - a ** e / b ** e) < 1e-12,
  }
}

// p. 178, ex. 5, 10: a single power, by the rules
const powerRules: Form = (rng) => {
  const [a, b] = [int(rng, 1, 9), int(rng, 2, 13)]
  const [m, n, k] = [int(rng, 5, 30), int(rng, 2, 20), int(rng, 2, 6)]
  const t = int(rng, 0, 2)
  const [expr, step, res] = [
    [`${pf(a, b, m)} \\cdot ${pf(a, b, n)}`, `${m} + ${n}`, m + n],
    [`${pf(a, b, m + n)} : ${pf(a, b, n)}`, `${m + n} - ${n}`, m],
    [`\\left[${pf(a, b, m)}\\right]^{${k}}`, `${m} \\cdot ${k}`, m * k],
  ][t] as [string, string, number]
  return {
    text: `Scrieți, folosind o singură putere: $${expr}$.`,
    solution: show(`${expr} = ${pf(a, b, step)} = ${pf(a, b, res)}`),
    verify: () => [m + n, m, m * k][t] === res,
  }
}

// p. 178, ex. 9: write a fraction as a power with the given base
const asPowerOfBase: Form = (rng) => {
  const [a, b] = pick(rng, [[2, 3], [3, 2], [5, 2], [7, 3], [3, 4], [2, 5], [4, 3], [1, 2], [3, 5]] as [number, number][])
  const e = int(rng, 2, a === 1 ? 10 : 5)
  return {
    text: `Scrieți fracția $${fr(nr(a ** e), nr(b ** e))}$ ca putere cu baza $${fr(a, b)}$.`,
    solution: show(`${fr(nr(a ** e), nr(b ** e))} = ${fr(`${a}^{${e}}`, `${b}^{${e}}`)} = ${pf(a, b, e)}`),
    verify: () => a ** e > 0,
  }
}

// p. 178, ex. 8: same exponent: multiply the bases
const sameExponent: Form = (rng) => {
  for (;;) {
    const [a, b] = [int(rng, 2, 15), int(rng, 2, 15)]
    const [c, d] = [b * int(rng, 1, 3), a * int(rng, 1, 3)]
    const e = int(rng, 3, 150)
    const [n, m] = [a * c, b * d]
    const g = gcd(n, m)
    if (m / g > 9 || n / g > 9) continue
    return {
      text: `Calculați: $${pf(a, b, e)} \\cdot ${pf(c, d, e)}$.`,
      solution: show(`${pf(a, b, e)} \\cdot ${pf(c, d, e)} = \\left(${fr(a, b)} \\cdot ${fr(c, d)}\\right)^{${e}} = ${m / g === 1 ? `${n / g}^{${e}}` : pf(n / g, m / g, e)}`),
      verify: () => Math.abs((a / b) * (c / d) - n / g / (m / g)) < 1e-12,
    }
  }
}

// p. 179, ex. 13: (a/b)^x = A/B
const exponentFromEquality: Form = (rng) => {
  const [a, b] = pick(rng, [[2, 3], [3, 2], [1, 7], [5, 2], [3, 4], [2, 5], [1, 3], [4, 3]] as [number, number][])
  const x = int(rng, 2, 5)
  const k = int(rng, 1, 3)
  return {
    text: `Determinați numărul natural $x$, știind că $${pf(a, b, 'x')} = ${fr(nr(k * a ** x), nr(k * b ** x))}$.`,
    solution: show(`${fr(nr(k * a ** x), nr(k * b ** x))} = ${fr(a ** x, b ** x)} = ${pf(a, b, x)} \\Rightarrow x = ${x}`),
    verify: () => a ** x * k * b ** x === b ** x * k * a ** x,
  }
}

// p. 180, ex. 17 b): 1/(1·3) + 1/(3·5) + … + 1/((2n − 1)(2n + 1))
const oddTelescoping: Form = (rng) => {
  const n = int(rng, 5, 60)
  const last = 2 * n - 1
  return {
    text: `Calculați: $${fr(1, '1 \\cdot 3')} + ${fr(1, '3 \\cdot 5')} + ${fr(1, '5 \\cdot 7')} + \\ldots + ${fr(1, `${last} \\cdot ${last + 2}`)}$.`,
    solution: lines(
      `Fiecare termen: $${fr(1, 'k(k + 2)')} = ${fr(1, 2)} \\cdot \\left(${fr(1, 'k')} - ${fr(1, 'k + 2')}\\right)$.`,
      show(`S = ${fr(1, 2)} \\cdot \\left(1 - ${fr(1, last + 2)}\\right) = ${fr(1, 2)} \\cdot ${fr(last + 1, last + 2)} = ${simp(last + 1, 2 * (last + 2))}`),
    ),
    verify: () => Math.abs(Array.from({ length: n }, (_, i) => 1 / ((2 * i + 1) * (2 * i + 3))).reduce((s, x) => s + x, 0) - n / (2 * n + 1)) < 1e-12,
  }
}

// ============================== parts of a number, percents (pp. 180–183) ==============================

// p. 181, ex. 2, 3; p. 182, ex. 7: a/b of n
const partOfNumber: Form = (rng) => {
  const b = int(rng, 2, 12)
  const a = int(rng, 1, 2 * b)
  const n = b * int(rng, 5, 400)
  const [unit] = pick(rng, [['kg'], ['m'], ['lei'], ['l']] as [string][])
  return {
    text: `Calculați $${fr(a, b)}$ din ${nr(n)} ${unit === 'lei' ? (n >= 20 ? 'de lei' : 'lei') : unit}.`,
    solution: show(`${fr(a, b)} \\cdot ${nr(n)} = ${fr(`${a} \\cdot ${nr(n)}`, b)} = ${nr((a * n) / b)}`),
    verify: () => Number.isInteger((a * n) / b),
  }
}

// p. 182, ex. 8, 10, 11: p% of n; a price raised (lowered) by p%
const percentOf: Form = (rng) => {
  const p = pick(rng, [5, 10, 12, 15, 17, 20, 25, 30, 40, 50, 75])
  const n = 100 * int(rng, 1, 500)
  const t = int(rng, 0, 2)
  const part = (p * n) / 100
  if (t === 0)
    return {
      text: `Calculați ${p}% din ${nr(n)}.`,
      solution: show(`${fr(p, 100)} \\cdot ${nr(n)} = ${nr(part)}`),
      verify: () => Number.isInteger(part),
    }
  const up = t === 1
  return {
    text: `Prețul unui obiect a fost de ${nr(n)} ${n >= 20 ? 'de ' : ''}lei și s-a ${up ? 'mărit' : 'micșorat'} cu ${p}%. Cât costă după ${up ? 'scumpire' : 'ieftinire'}?`,
    solution: lines(`${up ? 'Scumpirea' : 'Reducerea'}: $${fr(p, 100)} \\cdot ${nr(n)} = ${nr(part)}$ lei.`, `Prețul nou: $${nr(n)} ${up ? '+' : '-'} ${nr(part)} = ${nr(up ? n + part : n - part)}$ lei.`),
    verify: () => Number.isInteger(part),
  }
}

// p. 182, ex. 13, 15: what percent; a field split in parts
const whatPercent: Form = (rng) => {
  const total = pick(rng, [20, 25, 50])
  const k = int(rng, 1, total - 1)
  const p = (k * 100) / total
  return {
    text: `Într-o clasă sunt ${total} ${total >= 20 ? 'de ' : ''}elevi, dintre care ${k} ${k >= 20 ? 'de ' : ''}băieți. Care este procentul băieților din clasă? Dar al fetelor?`,
    solution: show(`${fr(k, total)} = ${fr(p, 100)} = ${p}\\%, \\qquad 100\\% - ${p}\\% = ${100 - p}\\%`),
    verify: () => Number.isInteger(p),
  }
}

// p. 182, ex. 12: two successive reductions
const successiveDiscounts: Form = (rng) => {
  const [p, q] = [pick(rng, [5, 10, 20, 25]), pick(rng, [10, 20, 30, 40, 50])]
  const keep = (100 - p) * (100 - q)
  const total = 100 - keep / 100
  return {
    text: `Prețul unui articol a fost redus cu ${p}%, apoi prețul nou a fost redus din nou cu ${q}%. Cu ce procent s-a redus, în total, prețul inițial?`,
    solution: lines(
      `După prima reducere rămân $${100 - p}\\%$ din preț, iar după a doua, $${100 - q}\\%$ din acesta: $${fr(100 - p, 100)} \\cdot ${fr(100 - q, 100)} = ${fr(keep / 100, 100)}$.`,
      `Prețul final este ${keep / 100}% din cel inițial, deci reducerea totală este de ${total}% (nu ${p + q}%).`,
    ),
    verify: () => Math.abs((1 - p / 100) * (1 - q / 100) - keep / 10000) < 1e-12,
  }
}

// p. 183, ex. 21, 22: the number of which p% is k; after spending p%, k lei are left
const numberFromPart: Form = (rng) => {
  const p = pick(rng, [10, 20, 25, 30, 40, 60, 75])
  const N = pick(rng, [4, 20, 25, 100].filter((d) => (d * p) % 100 === 0)) * int(rng, 2, 40)
  const spent = rng() < 0.5
  if (spent) {
    const left = N - (p * N) / 100
    return {
      text: `După ce a cheltuit ${p}% din suma pe care o avea, Ionuț constată că mai are ${nr(left)} ${left >= 20 ? 'de ' : ''}lei. Ce sumă a avut inițial?`,
      solution: `Îi rămân $100\\% - ${p}\\% = ${100 - p}\\%$ din sumă: $${fr(100 - p, 100)} \\cdot S = ${nr(left)}$, deci $S = ${nr(left)} \\cdot ${fr(100, 100 - p)} = ${nr(N)}$ lei.`,
      verify: () => Math.abs(((100 - p) / 100) * N - left) < 1e-9,
    }
  }
  const k = (p * N) / 100
  return {
    text: `Calculați un număr, știind că ${p}% din el este ${nr(k)}.`,
    solution: `$${fr(p, 100)} \\cdot x = ${nr(k)}$, deci $x = ${nr(k)} \\cdot ${fr(100, p)} = ${nr(N)}$.`,
    verify: () => Number.isInteger(k),
  }
}

// p. 183, ex. 20: a/b of (a/b of (a/b of n))
const nestedParts: Form = (rng) => {
  const [a, b] = pick(rng, [[1, 2], [3, 5], [2, 3], [3, 4], [1, 3]] as [number, number][])
  const k = int(rng, 2, 4)
  const n = b ** k * int(rng, 1, 9)
  const inner = (s: number): string => (s === 0 ? String(n) : `${fr(a, b)} \\text{ din } \\left(${inner(s - 1)}\\right)`)
  return {
    text: `Calculați: $${inner(k).replace(/\\left\((\d+)\\right\)/, '$1')}$.`,
    solution: show(`${pf(a, b, k)} \\cdot ${n} = ${fr(a ** k, b ** k)} \\cdot ${n} = ${(a ** k * n) / b ** k}`),
    verify: () => Number.isInteger((a ** k * n) / b ** k),
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-b5-fraction-percent',
    joins: 'v-fraction-props',
    label: 'Fracții dintr-un număr. Procente',
    topic: 'Algebră',
    forms: {
      1: [partOfNumber, percentOf],
      2: [whatPercent, numberFromPart],
      3: [successiveDiscounts, nestedParts],
    },
  },
  {
    id: 'v-b5-fraction-powers',
    joins: 'v-fraction-mult',
    label: 'Puterea unei fracții ordinare',
    topic: 'Algebră',
    forms: {
      1: [powerOfFraction, powerRules],
      2: [asPowerOfBase, exponentFromEquality],
      3: [sameExponent, oddTelescoping],
    },
  },
  {
    id: 'v-b5-fraction-divide',
    joins: 'v-fraction-mult',
    label: 'Împărțirea fracțiilor ordinare',
    topic: 'Algebră',
    forms: {
      1: [quotientOfFractions, unknownFactor],
      2: [stackedFraction, flourToBread],
      3: [nestedQuotients, oddSumSquare],
    },
  },
  {
    id: 'v-b5-fraction-times',
    joins: 'v-fraction-mult',
    label: 'Înmulțirea fracțiilor ordinare',
    topic: 'Algebră',
    forms: {
      1: [productOfFractions, speedTimesMixed],
      2: [commonFactorOut, knownProducts],
      3: [telescopicProduct],
    },
  },
  {
    id: 'v-b5-fraction-add',
    joins: 'v-fraction-order',
    label: 'Adunarea și scăderea fracțiilor ordinare',
    topic: 'Algebră',
    forms: {
      1: [sameDenominator, differentDenominators, mixedNumbers],
      2: [letterTerms, greaterOrSmallerBy, sumOfSeveral, workLeft],
      3: [powersOfOneOver, gaussNumerators, threeWorkers, telescoping],
    },
  },
  {
    id: 'v-b5-fraction-tests',
    joins: 'v-fraction-props',
    label: 'Fracții ordinare: teste recapitulative',
    topic: 'Algebră',
    forms: {
      1: [commonDenominator, simplifiedBy],
      2: [orderReciprocals, reducibleDigit, unknownInMixed, powerFractionCompare],
      3: [naturalsBetweenMixed, extremeDigitFraction, kindAndIrreducible, amplifiedFrom, doubleInequality, powerQuotient],
    },
  },
  {
    id: 'v-b5-fraction-compare',
    joins: 'v-fraction-props',
    label: 'Compararea și ordonarea fracțiilor',
    topic: 'Algebră',
    forms: {
      1: [orderSameTerm, betweenNaturals],
      2: [compareMixed, compareTwo, orderDescending],
      3: [unknownInequality, smallestSupraunitary],
    },
  },
  {
    id: 'v-b5-fraction-simplify',
    joins: 'v-fraction-props',
    label: 'Amplificarea și simplificarea fracțiilor. Fracții ireductibile',
    topic: 'Algebră',
    forms: {
      1: [amplifyTo, simplifyToIrreducible],
      2: [simplifyPowers, commonFactorEquation, repeatedBlocks],
      3: [reducibleValues, irreducibleForAll, powerSumFraction, countEquivalent],
    },
  },
  {
    id: 'v-b5-fraction-equal',
    joins: 'v-fraction-props',
    label: 'Fracții echivalente',
    topic: 'Algebră',
    forms: {
      1: [checkEquality, completeEquality],
      2: [fractionFromCondition, unknownInEqualFractions, equivalentWithDivisorDenominator],
      3: [digitsInEqualFractions, proportionToFraction, squareInEquality, twoUnknownsEqual],
    },
  },
  {
    id: 'v-b5-fraction-kinds',
    joins: 'v-fraction-props',
    label: 'Fracții subunitare, echiunitare, supraunitare; întregii dintr-o fracție',
    topic: 'Algebră',
    forms: {
      1: [classifyFractions, fractionsOfAKind, fractionsFromSets],
      2: [unknownMakesKind, extractWholes, introduceWholes],
      3: [digitsEqualToOne, rangesOfN, alternatingEqualsGauss, fractionNaturalN],
    },
  },
  {
    id: 'v-b5-fraction-intro',
    joins: 'v-fraction-props',
    label: 'Fracții ordinare: scriere, citire, fracții definite',
    topic: 'Algebră',
    forms: {
      1: [fractionFromWords, partOfTime, partsInWholes],
      2: [fractionsOfDivisors, fractionIsNatural, fractionDefined],
      3: [fractionsWithDigit, fractionSequence, powerFractionSequence],
    },
  },
  {
    id: 'v-b5-self-test',
    joins: 'v-divisibility',
    label: 'Divizibilitate: test de autoevaluare',
    topic: 'Algebră',
    forms: {
      1: [leastDivisibleByAll, sumOfLargeDivisors],
      2: [commonMultipleAbove, unknownInDivisibility],
      3: [dividesByLinear, cyclicSum, consecutiveHalves],
    },
  },
  {
    id: 'v-b5-tests',
    joins: 'v-divisibility',
    label: 'Divizibilitate: teste recapitulative',
    topic: 'Algebră',
    forms: {
      1: [remaindersByCriteria, repdigitSum],
      2: [distinctDigitsExtreme, parityFromEquation, countWithDistinct, gaussDivisibleBy, xyzzForms],
      3: [tenPowerPlus, sixPowerFactor, oddPowerComposite],
    },
  },
  {
    id: 'v-b5-primes',
    joins: 'v-divisibility',
    label: 'Numere prime. Numere compuse',
    topic: 'Algebră',
    forms: {
      1: [checkPrime, digitMakesPrime],
      2: [primesFromEquation, primeIsTwo, primesSumOrProduct],
      3: [primesWithReverse, bothPrime, primeInSystem, squarePlusPrime, powerPlusComposite],
    },
  },
  {
    id: 'v-b5-divisors',
    joins: 'v-divisibility',
    label: 'Divizor, multiplu, divizori și multipli comuni',
    topic: 'Algebră',
    forms: {
      1: [allDivisors, multiplesBetween, commonDivisors, smallestCommonMultiple],
      2: [countDivisors, extremeMultiple, digitsDivisible],
      3: [countMultiples, sumOfMultiples, moreDivisors],
    },
  },
  {
    id: 'v-b5-parity',
    joins: 'v-divisibility',
    label: 'Numere pare și numere impare',
    topic: 'Algebră',
    forms: {
      1: [placeInSequence, consecutiveWithSum],
      2: [parityOfExpressions, sumOfConsecutive, leastSumDistinct],
      3: [parityOfProduct, oddNumbersSum, factorPowers],
    },
  },
  {
    id: 'v-b5-criteria',
    joins: 'v-divisibility',
    label: 'Criterii de divizibilitate',
    topic: 'Algebră',
    forms: {
      1: [pickDivisible, unknownLastDigit],
      2: [twoUnknownDigits, commonFactor],
      3: [extremeOfForm, gaussDivides],
    },
  },
]
