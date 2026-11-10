// Contest problems (level 4) for grades V–VII, after more olympiad subjects from sorinborodi.ro, downloaded with the
// user's consent on 10 November 2026: local stages of Dâmbovița, Vâlcea and Dolj 2007, Cluj 2008, București 2009,
// the Moldavian excellence centres contest 2007 and the national final 2007. As before, each keeps the idea of a
// problem with other numbers and a worked solution in Romanian; geometry with figures is left out.
import type { Made } from './generators'
import { de, frac, int, nonZero, pick, shuffle, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n))
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
const distinctDigits = (n: number) => new Set(String(n)).size === String(n).length
/** The prime factors of n, each once, or null when one of them repeats (n is not squarefree). */
function squarefreePrimes(n: number): number[] | null {
  const ps: number[] = []
  for (let p = 2; p * p <= n; p++) {
    if (n % p) continue
    n /= p
    if (n % p === 0) return null
    ps.push(p)
  }
  if (n > 1) ps.push(n)
  return ps
}

// ================= grade V =================

/** 2^(5t+3) − 2^(5t+2) − 2^(5t+1), 3^(3t+3) − 2·3^(3t+2) − 2·3^(3t+1) − 3^(3t), 7^(2t+2) + 9·7^(2t) − 8·7^(2t+1), in order.
 * (Dâmbovița 2007 and Cluj 2008, V.1) */
export function orderPowers(rng: Rng): Made {
  const t = int(rng, 60, 400)
  const raw = [
    { tex: `2^{${5 * t + 3}} - 2^{${5 * t + 2}} - 2^{${5 * t + 1}}`, step: `2^{${5 * t + 1}}(2^2 - 2 - 1) = 2^{${5 * t + 1}} = 2 \\cdot 2^{${5 * t}} = 2 \\cdot (2^5)^{${t}} = 2 \\cdot 32^{${t}}`, base: 32 },
    { tex: `3^{${3 * t + 3}} - 2 \\cdot 3^{${3 * t + 2}} - 2 \\cdot 3^{${3 * t + 1}} - 3^{${3 * t}}`, step: `3^{${3 * t}}(3^3 - 2 \\cdot 3^2 - 2 \\cdot 3 - 1) = 2 \\cdot 3^{${3 * t}} = 2 \\cdot (3^3)^{${t}} = 2 \\cdot 27^{${t}}`, base: 27 },
    { tex: `7^{${2 * t + 2}} + 9 \\cdot 7^{${2 * t}} - 8 \\cdot 7^{${2 * t + 1}}`, step: `7^{${2 * t}}(7^2 + 9 - 8 \\cdot 7) = 2 \\cdot 7^{${2 * t}} = 2 \\cdot (7^2)^{${t}} = 2 \\cdot 49^{${t}}`, base: 49 },
  ]
  const named = shuffle(rng, raw).map((r, i) => ({ ...r, name: ['x', 'y', 'z'][i] }))
  const order = [...named].sort((a, b) => a.base - b.base).map((r) => r.name)
  return {
    text: `Scrieți în ordine crescătoare numerele ${named.map((r) => `$${r.name} = ${r.tex}$`).join(', ')}.`,
    solution: lines(
      'Dăm factor comun puterea cea mai mică din fiecare număr:',
      ...named.map((r) => show(`${r.name} = ${r.step}`)),
      `Toate au forma $2 \\cdot n^{${t}}$, deci le comparăm bazele: $27 < 32 < 49$. Ordinea crescătoare este`,
      show(order.join(' < ')),
    ),
    verify: () => {
      // the factored forms, checked exactly for a small exponent in place of t
      const s = 2
      return 2 ** (5 * s + 3) - 2 ** (5 * s + 2) - 2 ** (5 * s + 1) === 2 * 32 ** s
        && 3 ** (3 * s + 3) - 2 * 3 ** (3 * s + 2) - 2 * 3 ** (3 * s + 1) - 3 ** (3 * s) === 2 * 27 ** s
        && 7 ** (2 * s + 2) + 9 * 7 ** (2 * s) - 8 * 7 ** (2 * s + 1) === 2 * 49 ** s
    },
  }
}

/** 1 + 1·2 + 1·2·3 + … + 1·2·…·n ends in 3, so it is not a perfect square. (București 2009, V.3) */
export function factorialSumDigit(rng: Rng): Made {
  const n = pick(rng, [int(rng, 30, 999), 2025, 2026, 2027, 2030, int(rng, 1000, 5000)])
  return {
    text: `Fie $M = 1 + 1 \\cdot 2 + 1 \\cdot 2 \\cdot 3 + \\ldots + 1 \\cdot 2 \\cdot 3 \\cdot \\ldots \\cdot ${n}$.\n\na) Determinați ultima cifră a numărului $M$.\n\nb) Arătați că $M$ nu este pătrat perfect.`,
    solution: lines(
      'a) Începând cu $1 \\cdot 2 \\cdot 3 \\cdot 4 \\cdot 5$, fiecare produs îi conține pe 2 și pe 5, deci se divide cu 10 și se termină în 0. Ultima cifră a lui $M$ vine doar din primii patru termeni:',
      show('1 + 2 + 6 + 24 = 33'),
      'deci ultima cifră a lui $M$ este 3.',
      'b) Pătratele perfecte se termină doar în 0, 1, 4, 5, 6 sau 9 (ca $0^2, 1^2, \\ldots, 9^2$). Cum $M$ se termină în 3, nu este pătrat perfect.',
    ),
    verify: () => {
      let s = 0
      let p = 1
      for (let k = 1; k <= n; k++) {
        p = (p * k) % 10
        s = (s + p) % 10
      }
      return s === 3
    },
  }
}

/** The sum of the remainders of 0, 1, …, N divided by d: whole rounds of 0, 1, …, d − 1, then a part. (București 2009, V.4) */
export function sumRemainders(rng: Rng): Made {
  const d = pick(rng, [6, 7, 8, 9, 10, 11, 12])
  const N = int(rng, 500, 3000)
  const full = Math.floor((N + 1) / d)
  const r = (N + 1) % d
  const round = (d * (d - 1)) / 2
  const part = (r * (r - 1)) / 2
  const total = full * round + part
  return {
    text: `Determinați suma tuturor resturilor împărțirilor la ${d} ale numerelor naturale $n$ cu $0 \\leq n \\leq ${N}$.`,
    solution: lines(
      `Resturile se repetă din ${d} în ${d}: pentru $0, 1, \\ldots, ${d - 1}$ sunt $0, 1, \\ldots, ${d - 1}$, apoi la fel pentru următoarele ${d} numere și așa mai departe. Sunt ${de(N + 1)} numere, iar $${N + 1} = ${d} \\cdot ${full} + ${r}$, deci avem ${full} grupe complete${r ? ` și încă ${r} ${r === 1 ? 'număr' : 'numere'}, cu resturile ${r === 1 ? '0' : `$0, \\ldots, ${r - 1}$`}` : ''}.`,
      `O grupă completă dă $0 + 1 + \\ldots + ${d - 1} = \\frac{${d - 1} \\cdot ${d}}{2} = ${round}$.`,
      show(`S = ${full} \\cdot ${round}${r > 1 ? ` + (0 + 1 + \\ldots + ${r - 1}) = ${full * round} + ${part}` : ''} = ${total}`),
    ),
    verify: () => {
      let s = 0
      for (let k = 0; k <= N; k++) s += k % d
      return s === total
    },
  }
}

/** Dividing 1, 2, …, kq by q, the quotients add up to q·k(k − 1)/2 + k. (Vâlcea 2007, VI.3 b) */
export function quotientsSum(rng: Rng): Made {
  const k = pick(rng, [2, 3, 4, 5])
  const q = int(rng, 5, 400)
  const tri = (k * (k - 1)) / 2
  const S = q * tri + k
  return {
    text: `Luăm un număr natural nenul $q$ și împărțim cu rest la $q$ fiecare dintre numerele $1, 2, 3, \\ldots, ${k}q$. Suma tuturor câturilor obținute este ${S}. Determinați $q$.`,
    solution: lines(
      `Numerele de la 1 la $q - 1$ dau câtul 0. ${Array.from({ length: k - 1 }, (_, i) => i + 1).map((j) => `Cele $q$ numere de la $${j === 1 ? '' : j}q$ la $${j + 1}q - 1$ dau câtul ${j}.`).join(' ')} Ultimul, $${k}q$, dă câtul ${k}.`,
      k === 2
        ? show(`q \\cdot 1 + 2 = ${S} \\Rightarrow q = ${S} - 2 = ${q}`)
        : show(`q \\cdot (${Array.from({ length: k - 1 }, (_, i) => i + 1).join(' + ')}) + ${k} = ${S} \\Rightarrow ${tri}q + ${k} = ${S} \\Rightarrow ${tri}q = ${S - k} \\Rightarrow q = ${q}`),
    ),
    verify: () => {
      let s = 0
      for (let n = 1; n <= k * q; n++) s += Math.floor(n / q)
      return s === S
    },
  }
}

/** The largest remainder with distinct digits when N is divided by some number: r < N − r, reached with quotient 1.
 * (Vâlcea 2007, V.3) */
export function largestRemainder(rng: Rng): Made {
  const N = int(rng, 1000, 9999)
  let r = Math.ceil(N / 2) - 1
  while (!distinctDigits(r)) r--
  const divisors: number[] = []
  for (let d = r + 1; d <= N - r; d++) if ((N - r) % d === 0) divisors.push(d)
  return {
    text: `Care este cel mai mare rest, cu cifrele diferite două câte două, care se poate obține împărțind numărul ${N} la un număr natural nenul? Pentru ce împărțitor se obține acest rest?`,
    solution: lines(
      `Dacă $${N} = d \\cdot c + r$, cu $r < d$, atunci $c \\geq 1$ (altfel $r = ${N} \\geq d$), deci $d \\leq ${N} - r$ și, cum $r < d$, $r < ${N} - r$, adică $2r < ${N}$, $r \\leq ${Math.ceil(N / 2) - 1}$.`,
      `Orice astfel de rest se și obține, cu câtul 1 și împărțitorul $d = ${N} - r$. Cel mai mare număr cel mult egal cu ${Math.ceil(N / 2) - 1} care are cifrele diferite este ${r}.`,
      `Restul ${r} se obține pentru $d \\mid ${N - r}$ și $d > ${r}$, adică pentru $d ${divisors.length === 1 ? `= ${divisors[0]}` : `\\in \\{${divisors.join(', ')}\\}`}$.`,
    ),
    verify: () => {
      let best = -1
      const at: number[] = []
      for (let d = 1; d <= N; d++) {
        const rem = N % d
        if (!distinctDigits(rem)) continue
        if (rem > best) {
          best = rem
          at.length = 0
        }
        if (rem === best) at.push(d)
      }
      return best === r && at.join(',') === divisors.join(',')
    },
  }
}

// ================= grade VI =================

/** a/(a + p) = b/(b + q) = c/(c + r) and p/a + q/b + r/c = 3t: then p/a = q/b = r/c = t. (Cluj 2008, VI.1 b) */
export function proportionChain(rng: Rng): Made {
  const [p, q, r] = shuffle(rng, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((x, y) => x - y)
  const t = int(rng, 2, 30)
  return {
    text: `Știind că $\\frac{a}{a + ${p}} = \\frac{b}{b + ${q}} = \\frac{c}{c + ${r}}$ și $\\frac{${p}}{a} + \\frac{${q}}{b} + \\frac{${r}}{c} = ${3 * t}$, calculați $a + b + c$.`,
    solution: lines(
      'Inversăm rapoartele egale (sunt nenule):',
      show(`\\frac{a + ${p}}{a} = \\frac{b + ${q}}{b} = \\frac{c + ${r}}{c} \\Rightarrow 1 + \\frac{${p}}{a} = 1 + \\frac{${q}}{b} = 1 + \\frac{${r}}{c} \\Rightarrow \\frac{${p}}{a} = \\frac{${q}}{b} = \\frac{${r}}{c}`),
      `Cele trei fracții sunt egale și au suma ${3 * t}, deci fiecare este ${t}:`,
      show(`a = \\frac{${p}}{${t}}, \\quad b = \\frac{${q}}{${t}}, \\quad c = \\frac{${r}}{${t}} \\Rightarrow a + b + c = \\frac{${p + q + r}}{${t}}${frac(p + q + r, t) === `\\frac{${p + q + r}}{${t}}` ? '' : ` = ${frac(p + q + r, t)}`}`),
    ),
    verify: () => {
      const [a, b, c] = [p / t, q / t, r / t]
      return close(a / (a + p), b / (b + q)) && close(b / (b + q), c / (c + r)) && close(p / a + q / b + r / c, 3 * t)
    },
  }
}

/** 1 + r + r² + … + r^(n−1) = total: multiply by r and subtract. (Cluj 2008, VI.1 c) */
export function geometricCount(rng: Rng): Made {
  const r = pick(rng, [2, 3, 4, 5])
  const n = int(rng, 5, r === 2 ? 11 : r === 3 ? 8 : 7)
  const total = (r ** n - 1) / (r - 1)
  const times = r === 2 ? 'dublul' : r === 3 ? 'triplul' : r === 4 ? 'împătritul' : 'încincitul'
  return {
    text: `Într-o fabrică lucrează ${de(total)} persoane, repartizate la mai multe puncte de lucru. La primul punct lucrează o persoană, iar la fiecare dintre următoarele lucrează ${times} numărului de persoane de la punctul anterior. Câte puncte de lucru are fabrica?`,
    solution: lines(
      `Dacă sunt $n$ puncte de lucru, $S = 1 + ${r} + ${r}^2 + \\ldots + ${r}^{n-1} = ${total}$. Înmulțim cu ${r} și scădem:`,
      show(`${r}S - S = ${r}^n - 1 \\Rightarrow ${r - 1 === 1 ? '' : `${r - 1} \\cdot `}${total} = ${r}^n - 1 \\Rightarrow ${r}^n = ${(r - 1) * total + 1} = ${r}^{${n}}`),
      `Fabrica are ${n} puncte de lucru.`,
    ),
    verify: () => Array.from({ length: n }, (_, i) => r ** i).reduce((s, v) => s + v, 0) === total,
  }
}

const ORDINAL = ['', 'primul', 'al doilea', 'al treilea', 'al patrulea', 'al cincilea', 'al șaselea']

/** a, b, b − a, −a, −b, a − b, a, b, …: each term the difference of the two before, period 6.
 * (Moldavian excellence centres 2007, VI.2) */
export function periodicSequence(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -20, 20)
    const b = nonZero(rng, -20, 20)
    if (a === b || b - a === 0) continue
    const terms = [a, b]
    while (terms.length < 12) terms.push(terms[terms.length - 1] - terms[terms.length - 2])
    const N1 = int(rng, 50, 200)
    const N2 = int(rng, 2000, 20000)
    const at = (N: number) => terms[(N - 1) % 6]
    const pos = (N: number) => ((N - 1) % 6) + 1
    return {
      text: `Se formează un șir de numere astfel: primul număr este ${a < 0 ? `$${a}$` : a}, al doilea este ${b < 0 ? `$${b}$` : b}, iar fiecare dintre următoarele este egal cu diferența dintre numărul dinaintea lui și cel de dinaintea acestuia (al treilea este al doilea minus primul, al patrulea este al treilea minus al doilea și așa mai departe).\n\na) Scrieți primele 12 numere ale șirului.\n\nb) Care este al ${N1}-lea număr al șirului? Dar al ${N2}-lea?`,
      solution: lines(
        `a) $${terms.join(',\\ ')}$.`,
        'Numerele se repetă din 6 în 6: al șaptelea este egal cu primul, iar al optulea cu al doilea, deci de acolo șirul o ia de la capăt.',
        `b) Locul unui număr din șir contează doar prin restul împărțirii la 6 (restul 0 înseamnă locul al șaselea). ${[N1, N2].map((N) => `Cum $${N} = 6 \\cdot ${Math.floor(N / 6)}${N % 6 ? ` + ${N % 6}` : ''}$, al ${N}-lea număr este egal cu ${ORDINAL[pos(N)]}, adică $${at(N)}$.`).join(' ')}`,
      ),
      verify: () => {
        const s = [a, b]
        while (s.length < N2) s.push(s[s.length - 1] - s[s.length - 2])
        return s[N1 - 1] === at(N1) && s[N2 - 1] === at(N2) && s.slice(0, 12).join() === terms.join()
      },
    }
  }
}

/** Horseshoe nails: a quarter of the h horses, 4 hooves each, p nails a hoof: h·p nails, and h is a multiple of 4.
 * (Vâlcea 2007, VI.1) */
export function horseshoes(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 6)
    const h = 4 * int(rng, 10, 80)
    const N = p * h
    const fits = [2, 3, 4, 5, 6].filter((x) => N % x === 0 && (N / x) % 4 === 0)
    if (fits.length !== 1) continue
    const why = [2, 3, 4, 5, 6].map((x) => (N % x !== 0
      ? `$p = ${x}$: ${N} nu se divide cu ${x}`
      : `$p = ${x}$: $${N} : ${x} = ${N / x}$, ${(N / x) % 4 === 0 ? 'care se divide cu 4' : 'care nu se divide cu 4'}`)).join('; ')
    return {
      text: `Caielele sunt cuiele cu care se prind potcoavele. La potcovirea cailor unei ferme se folosesc, la fiecare copită, același număr $p$ de caiele, cu $2 \\leq p \\leq 6$. După ce au fost potcoviți 25% din cai, s-au folosit ${de(N)} caiele.\n\na) Determinați $p$.\n\nb) Câți cai sunt în fermă?`,
      solution: lines(
        `Fie $h$ numărul cailor. Au fost potcoviți $\\frac{h}{4}$ cai, deci $h$ se divide cu 4. Fiecare cal are 4 copite, cu câte $p$ caiele: $\\frac{h}{4} \\cdot 4 \\cdot p = h \\cdot p = ${N}$.`,
        `Încercăm valorile lui $p$: ${why}.`,
        `a) $p = ${p}$. b) În fermă sunt ${de(h)} cai.`,
      ),
      verify: () => p * h === N && h % 4 === 0,
    }
  }
}

/** The smallest square that is a sum of 2s consecutive naturals, s odd and squarefree: s(2n + 2s − 1) = (3s)².
 * (Dâmbovița 2007, VI.3) */
export function squareConsecutiveSum(rng: Rng): Made {
  for (;;) {
    const s = 2 * int(rng, 7, 750) + 1
    const ps = squarefreePrimes(s)
    if (!ps || ps.length < 2) continue
    const k = 2 * s
    const n = (7 * s + 1) / 2
    const sq = 9 * s * s
    return {
      text: `Aflați cel mai mic pătrat perfect care se poate scrie ca suma a ${de(k)} numere naturale consecutive.`,
      solution: lines(
        `Suma numerelor $n, n + 1, \\ldots, n + ${k - 1}$ este`,
        show(`${k}n + \\frac{${k - 1} \\cdot ${k}}{2} = ${k}n + ${(k * (k - 1)) / 2} = ${s}(2n + ${k - 1})`),
        `Cum $${s} = ${ps.join(' \\cdot ')}$, cu factori primi diferiți, pentru ca produsul să fie pătrat perfect, $2n + ${k - 1}$ trebuie să fie de forma $${s}m^2$. Numărul $2n + ${k - 1}$ este impar, deci $m$ este impar. Pentru $m = 1$ ar trebui $2n + ${k - 1} = ${s}$, imposibil, deci cel mai mic $m$ este 3:`,
        show(`2n + ${k - 1} = ${9 * s} \\Rightarrow n = ${n}, \\qquad ${s} \\cdot ${9 * s} = ${3 * s}^2 = ${sq}`),
        `Cel mai mic pătrat perfect căutat este $${3 * s}^2 = ${sq}$, suma numerelor de la ${n} la ${n + k - 1}.`,
      ),
      verify: () => {
        for (let m = 0; m < n; m++) if (isSquare(s * (2 * m + k - 1))) return false
        return isSquare(s * (2 * n + k - 1)) && s * (2 * n + k - 1) === sq
      },
    }
  }
}

// ================= grade VII =================

/** n² − k is never a multiple of p when k is not a square remainder; pigeonholes for b). (Dâmbovița 2007, VII.2) */
export function squaresModulo(rng: Rng): Made {
  const p = pick(rng, [7, 11, 13, 17])
  const rems = Array.from({ length: p }, (_, r) => (r * r) % p)
  const squares = [...new Set(rems)].sort((x, y) => x - y)
  const non = Array.from({ length: p }, (_, r) => r).filter((r) => !squares.includes(r))
  const K = shuffle(rng, non).slice(0, int(rng, 3, non.length)).sort((x, y) => x - y)
  const many = squares.length + 1
  return {
    text: `a) Arătați că, oricare ar fi $k \\in \\{${K.join(', ')}\\}$ și oricare ar fi $n \\in \\mathbb{N}$, numărul $n^2 - k$ nu se divide cu ${p}.\n\nb) Arătați că, oricum am alege ${many} numere naturale diferite, există două dintre ele pentru care diferența pătratelor lor este multiplu de ${p}.`,
    solution: lines(
      `a) Scriem $n = ${p}c + r$, cu $r \\in \\{0, 1, \\ldots, ${p - 1}\\}$. Atunci $n^2 = ${p}(${p}c^2 + 2cr) + r^2$, deci $n^2$ dă la împărțirea prin ${p} același rest ca $r^2$. Resturile lui $r^2$ sunt:`,
      show(`r = ${rems.map((_, r) => r).join(',\\ ')} \\quad\\Rightarrow\\quad r^2 \\text{ mod } ${p} = ${rems.join(',\\ ')}`),
      `Deci $n^2$ dă doar resturile $${squares.join(', ')}$. Dacă ${p} ar divide $n^2 - k$, atunci $n^2$ ar da restul $k$, dar niciunul dintre numerele $${K.join(', ')}$ nu este printre aceste resturi.`,
      `b) Pătratele numerelor alese pot da cel mult ${squares.length} resturi diferite la împărțirea prin ${p}. Avem ${many} numere, deci (principiul cutiei) două dintre pătrate dau același rest, iar diferența lor se divide cu ${p}.`,
    ),
    verify: () => K.every((k) => Array.from({ length: 3 * p }, (_, n) => n).every((n) => (n * n - k) % p !== 0)) && squares.length === (p + 1) / 2,
  }
}

/** a + b − c = s and 2ab − c² = s² give (a − s)² + (b − s)² = 0: equilateral of side s. (national final 2007, VII.1) */
export function equilateralFromRelations(rng: Rng): Made {
  const s = int(rng, 2, 15)
  return {
    text: `Într-un triunghi $ABC$, laturile $a$, $b$, $c$ verifică relațiile $a + b - c = ${s}$ și $2ab - c^2 = ${s * s}$. Arătați că triunghiul este echilateral și calculați aria lui.`,
    solution: lines(
      `Din prima relație, $c = a + b - ${s}$. Înlocuim în a doua:`,
      show(`2ab - (a + b - ${s})^2 = ${s * s} \\Rightarrow 2ab - a^2 - b^2 - ${s * s} - 2ab + ${2 * s}a + ${2 * s}b = ${s * s}`),
      show(`a^2 - ${2 * s}a + ${s * s} + b^2 - ${2 * s}b + ${s * s} = 0 \\Rightarrow (a - ${s})^2 + (b - ${s})^2 = 0`),
      `O sumă de pătrate este 0 doar dacă ambele sunt 0: $a = b = ${s}$, iar $c = ${s} + ${s} - ${s} = ${s}$. Triunghiul are toate laturile de ${s}, deci este echilateral, cu aria`,
      show(`\\mathcal{A} = \\frac{\\ell^2\\sqrt{3}}{4} = \\frac{${s * s}\\sqrt{3}}{4}${s % 2 === 0 ? ` = ${surd(s * s, 4, 3)}` : ''}`),
    ),
    verify: () => s + s - s === s && 2 * s * s - s * s === s * s,
  }
}

const SQUARE_PRODUCTS = [2009, 72, 200, 288, 392, 500, 675, 1125, 1800, 4050, 252, 1008]

/** x²·√((y + c)²) = N: x² is a square divisor of N, and |y + c| = N/x². (București 2009, VII.1 c) */
export function squareTimesAbs(rng: Rng): Made {
  const N = pick(rng, SQUARE_PRODUCTS)
  const c = int(rng, -5, 5)
  const ds = Array.from({ length: Math.floor(Math.sqrt(N)) }, (_, i) => i + 1).filter((d) => N % (d * d) === 0)
  const sols: [number, number][] = []
  for (const d of ds) for (const sx of [1, -1]) for (const sy of [1, -1]) sols.push([sx * d, -c + sy * (N / (d * d))])
  sols.sort((u, v) => u[0] - v[0] || u[1] - v[1])
  const yc = plus('y', c)
  return {
    text: `Determinați numerele întregi $x$ și $y$ pentru care $x^2 \\cdot \\sqrt{(${yc})^2} = ${N}$.`,
    solution: lines(
      `Avem $\\sqrt{(${yc})^2} = |${yc}|$, deci $x^2 \\cdot |${yc}| = ${N}$. Atunci $x^2$ este un divizor al lui ${N} care este pătrat perfect: $x^2 \\in \\{${ds.map((d) => d * d).join(', ')}\\}$, adică $|x| \\in \\{${ds.join(', ')}\\}$.`,
      ds.map((d) => `Pentru $|x| = ${d}$: $|${yc}| = ${N / (d * d)}$, deci $y = ${-c} \\pm ${N / (d * d)}$.`).join(' '),
      show(`(x, y) \\in \\{${sols.map(([x, y]) => `(${x}, ${y})`).join(', ')}\\}`),
    ),
    verify: () => {
      const found: string[] = []
      for (let x = -N; x <= N; x++) {
        if (x === 0 || N % (x * x) !== 0) continue
        const v = N / (x * x)
        for (const y of [-c + v, -c - v]) found.push(`${x},${y}`)
      }
      return [...new Set(found)].sort().join(';') === sols.map(([x, y]) => `${x},${y}`).sort().join(';')
    },
  }
}

/** x² + ky² = N with 3 | k and N leaving remainder 2 at 3: squares leave only 0 or 1. (București 2009, VII.3) */
export function noIntegerSolutions(rng: Rng): Made {
  const k = pick(rng, [3, 6, 9, 12, 15, 21])
  const N = 3 * int(rng, 100, 1500) + 2
  return {
    text: `Arătați că ecuația $x^2 + ${k}y^2 = ${N}$ nu are soluții numere întregi.`,
    solution: lines(
      `Comparăm resturile la împărțirea prin 3. Un întreg $x$ este de forma $3m$, $3m + 1$ sau $3m + 2$, deci $x^2$ este $9m^2$, $9m^2 + 6m + 1$ sau $9m^2 + 12m + 4 = 3(3m^2 + 4m + 1) + 1$: $x^2$ dă restul 0 sau 1.`,
      `${k === 3 ? '' : `Cum ${k} se divide cu 3, `}$${k}y^2$ se divide cu 3, deci $x^2 + ${k}y^2$ dă la împărțirea prin 3 restul 0 sau 1.`,
      `Dar $${N} = 3 \\cdot ${(N - 2) / 3} + 2$ dă restul 2. Egalitatea este imposibilă, deci ecuația nu are soluții întregi.`,
    ),
    verify: () => {
      for (let y = 0; k * y * y <= N; y++) if (isSquare(N - k * y * y)) return false
      return true
    },
  }
}

// ================= grade VIII =================

/** a + 1/a = k: E = (a^(2m) + … + a + 1)/a^m = 1 + Σ (a^j + 1/a^j), from the squares and cubes of a + 1/a.
 * (București 2009, VIII.3) */
export function reciprocalPowers(rng: Rng): Made {
  const k = int(rng, 3, 7)
  const m = pick(rng, [2, 3, 4])
  const s = [0, k, k * k - 2, k ** 3 - 3 * k]
  s[4] = s[2] * s[2] - 2
  const total = 1 + s.slice(1, m + 1).reduce((x, y) => x + y, 0)
  const poly = Array.from({ length: 2 * m + 1 }, (_, i) => 2 * m - i).map((e) => (e === 0 ? '1' : e === 1 ? 'a' : `a^{${e}}`)).join(' + ')
  const how = [
    '',
    '',
    `a^2 + \\frac{1}{a^2} = \\left(a + \\frac{1}{a}\\right)^2 - 2 = ${k * k} - 2 = ${s[2]}`,
    `a^3 + \\frac{1}{a^3} = \\left(a + \\frac{1}{a}\\right)^3 - 3\\left(a + \\frac{1}{a}\\right) = ${k ** 3} - ${3 * k} = ${s[3]}`,
    `a^4 + \\frac{1}{a^4} = \\left(a^2 + \\frac{1}{a^2}\\right)^2 - 2 = ${s[2] * s[2]} - 2 = ${s[4]}`,
  ]
  return {
    text: `Dacă $a$ este un număr real pozitiv și $a + \\frac{1}{a} = ${k}$, determinați valoarea expresiei $E = \\frac{1}{a^{${m}}}(${poly})$.`,
    solution: lines(
      `Împărțim fiecare termen la $a^{${m}}$ și grupăm puterile opuse:`,
      show(`E = 1 + ${Array.from({ length: m }, (_, i) => i + 1).map((j) => `\\left(a${j === 1 ? '' : `^{${j}}`} + \\frac{1}{a${j === 1 ? '' : `^{${j}}`}}\\right)`).join(' + ')}`),
      ...how.slice(2, m + 1).map(show),
      show(`E = 1 + ${s.slice(1, m + 1).join(' + ')} = ${total}`),
    ),
    verify: () => {
      const a = (k + Math.sqrt(k * k - 4)) / 2
      let E = 0
      for (let e = 0; e <= 2 * m; e++) E += a ** e
      return close(E / a ** m, total)
    },
  }
}
