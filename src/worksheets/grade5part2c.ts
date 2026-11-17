// Grade V, Mate 2000+ Consolidare, part II (Paralela 45), pp. 102–148, photographed on 14 November 2026: the end of
// the unit on points and lines (lines determined by points, relative positions of two lines, the length of a segment,
// the midpoint and the symmetric of a point, tests) and the unit on angles (definition and interior, measure and kinds,
// calculations with degrees and minutes, congruent figures and the axis of symmetry, tests).
// Seen: pp. 102–106, 109–111, 113–120, 123–124, 127–129, 132–134, 137–139, 143–148 (the other pages were not in the photos).
// Levels after the stars of the sections: Înțelegere * = 1, Aplicare ** = 2, Aprofundare *** and Supermate **** = 3.
import type { Made } from './generators'
import { de, int, pick, shuffle, type Rng } from './tex'

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
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const math = (items: string[]) => list(items.map((x) => `$${x}$`))
/** How many pairs n things make: n(n − 1)/2. */
const C2 = (n: number) => (n * (n - 1)) / 2
/** A whole number of hundredths with the Romanian comma: 1205 → 12{,}05, 1250 → 12{,}5, 1200 → 12. */
const t100 = (n: number) => {
  const i = Math.floor(n / 100)
  const r = n % 100
  if (r === 0) return String(i)
  const s = String(r).padStart(2, '0')
  return `${i}{,}${s.endsWith('0') ? s[0] : s}`
}
/** tenths: 25 → 2{,}5 */
const t10 = (n: number) => t100(10 * n)
/** halves: 5 → 2{,}5 */
const h2 = (n: number) => t100(50 * n)
/** quarters: 5 → 1{,}25 */
const q4 = (n: number) => t100(25 * n)
/** A measure given in minutes, in degrees and minutes: 1395 → 23^\circ 15'. */
const dm = (m: number) => {
  const d = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${d}^\\circ` : d === 0 ? `${r}'` : `${d}^\\circ ${r}'`
}
const A = (name: string) => `\\sphericalangle ${name}`
/** The letters used for points (O is kept for the vertex and the origin). */
const LETTERS = 'ABCDEFGHIJKLMNPQRSTUVXYZ'
const NAMES = ['Ana', 'Maria', 'Ioana', 'Sanda', 'Elena', 'Mihai', 'Andrei', 'Dan', 'Vlad', 'Radu', 'Tudor', 'Luca']
const SEGS = ['AB', 'MN', 'PQ', 'CD', 'EF', 'RS']

/** The kind of a proper or improper angle, from its measure in minutes. */
const kindOf = (m: number) => (m === 0 ? 'nul' : m < 5400 ? 'ascuțit' : m === 5400 ? 'drept' : m < 10800 ? 'obtuz' : 'alungit')

// ================= 1. lines determined by points (pp. 102–106, 115–119) =================

/** n points, no three collinear: the lines (or the segments) they determine. p. 103, ex. 14; p. 117, IV.2; p. 119, II.3. */
export function linesNoThree(rng: Rng): Made {
  const n = int(rng, 4, 45)
  const seg = rng() < 0.5
  const L = C2(n)
  return {
    text: seg
      ? `Se dau ${de(n)} puncte distincte, oricare trei necoliniare. Câte segmente au ambele capete printre aceste puncte?`
      : `Se dau ${de(n)} puncte distincte, oricare trei necoliniare. Câte drepte determină aceste puncte, luate câte două?`,
    solution: lines(
      `Unim fiecare punct cu fiecare dintre celelalte ${de(n - 1)} puncte: obținem $${n} \\cdot ${n - 1}$ ${seg ? 'segmente' : 'drepte'}, dar astfel fiecare ${seg ? 'segment a fost numărat' : 'dreaptă a fost numărată'} de două ori, o dată din fiecare capăt.${seg ? '' : ' Cum oricare trei puncte sunt necoliniare, două perechi diferite de puncte dau drepte diferite.'}`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${L}`),
      `Răspuns: ${de(L)} ${seg ? 'segmente' : 'drepte'}.`,
    ),
    verify: () => {
      let count = 0
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) count++
      return count === L
    },
  }
}

/** Collinear points: in how many ways the line can be named. p. 115, II.1. */
export function lineNames(rng: Rng): Made {
  const k = int(rng, 3, 8)
  const start = int(rng, 0, LETTERS.length - k)
  const pts = LETTERS.slice(start, start + k).split('')
  const names: string[] = []
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) names.push(pts[i] + pts[j])
  const N = C2(k)
  return {
    text: `Punctele ${math(pts)} sunt coliniare. În câte moduri poate fi numită dreapta pe care se află, folosind două dintre aceste puncte?`,
    solution: lines(
      `O dreaptă se numește după oricare două puncte ale ei, iar $${pts[0]}${pts[1]}$ și $${pts[1]}${pts[0]}$ sunt aceeași dreaptă. Fiecare dintre cele ${k} puncte se poate pune cu fiecare dintre celelalte ${k - 1}, iar fiecare pereche apare de două ori:`,
      show(`\\frac{${k} \\cdot ${k - 1}}{2} = ${N}`),
      k <= 6 ? `Denumirile sunt: ${math(names)}.` : `De exemplu: ${math(names.slice(0, 4))} etc.`,
      `Răspuns: în ${N} moduri.`,
    ),
    verify: () => new Set(names).size === N && names.every((s) => s[0] < s[1]),
  }
}

/** n points on a line: the segments with ends among them and the rays with the origin in one of them. p. 102, ex. 6. */
export function raysSegmentsOnLine(rng: Rng): Made {
  const n = int(rng, 3, 45)
  const S = C2(n)
  return {
    text: lines(
      `Pe dreapta $d$ se iau ${de(n)} puncte distincte.`,
      'a) Câte segmente au ambele capete printre aceste puncte?',
      'b) Câte semidrepte incluse în dreapta $d$ au originea într-unul dintre aceste puncte?',
    ),
    solution: lines(
      `a) Fiecare pereche de puncte este un alt segment (chiar dacă punctele sunt coliniare, segmentele sunt diferite):`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${S}`),
      `b) Fiecare punct este originea a două semidrepte opuse, incluse în dreapta $d$:`,
      show(`2 \\cdot ${n} = ${2 * n}`),
      `Răspuns: ${de(S)} segmente și ${de(2 * n)} semidrepte.`,
    ),
    verify: () => S + n === C2(n + 1) && 2 * n > 0,
  }
}

/** n points, exactly k of them collinear, otherwise no three collinear. p. 103, ex. 19; p. 117, IV.3. */
export function linesSomeCollinear(rng: Rng): Made {
  const n = int(rng, 6, 30)
  const k = int(rng, 3, n - 2)
  const L = C2(n) - C2(k) + 1
  return {
    text: `Se dau ${de(n)} puncte distincte, dintre care exact ${k} sunt coliniare, iar în rest oricare trei sunt necoliniare. Câte drepte determină cele ${de(n)} puncte?`,
    solution: lines(
      `Dacă oricare trei puncte ar fi necoliniare, ar fi $\\frac{${n} \\cdot ${n - 1}}{2} = ${C2(n)}$ drepte.`,
      `Cele ${k} puncte coliniare ar da astfel $\\frac{${k} \\cdot ${k - 1}}{2} = ${C2(k)}$ drepte, dar toate sunt de fapt una singură, dreapta pe care se află. Scădem ${C2(k)} și adunăm 1:`,
      show(`${C2(n)} - ${C2(k)} + 1 = ${L}`),
      `Răspuns: ${de(L)} drepte.`,
    ),
    // the other way: the line of the k points, the lines among the other n − k, and each of the k with each of the others
    verify: () => 1 + C2(n - k) + k * (n - k) === L,
  }
}

/** a points on d₁ and b points on d₂, with d₁ ∥ d₂: the lines they determine. p. 102, ex. 6. */
export function twoParallelLines(rng: Rng): Made {
  const a = int(rng, 2, 14)
  const b = int(rng, 2, 14)
  const L = a * b + 2
  return {
    text: `Dreptele $d_1$ și $d_2$ sunt paralele. Pe dreapta $d_1$ se iau ${de(a)} puncte distincte, iar pe dreapta $d_2$ se iau ${de(b)} puncte distincte. Câte drepte determină toate aceste puncte, luate câte două?`,
    solution: lines(
      `Oricare două puncte de pe $d_1$ determină chiar dreapta $d_1$, iar oricare două puncte de pe $d_2$ determină dreapta $d_2$.`,
      `Un punct de pe $d_1$ și unul de pe $d_2$ determină o dreaptă care taie $d_1$ și $d_2$ într-un singur punct, deci perechi diferite dau drepte diferite:`,
      show(`${a} \\cdot ${b} = ${a * b}`),
      show(`${a * b} + 2 = ${L}`),
      `Răspuns: ${de(L)} drepte.`,
    ),
    verify: () => C2(a + b) - C2(a) - C2(b) + 2 === L,
  }
}

/** The least and the greatest number of lines through n points. p. 103, ex. 20; p. 117, IV.1–2. */
export function minMaxLines(rng: Rng): Made {
  const n = int(rng, 4, 100)
  const M = C2(n)
  return {
    text: lines(
      `Se consideră ${de(n)} puncte distincte. Calculați:`,
      `a) numărul minim de drepte determinate de cele ${de(n)} puncte;`,
      `b) numărul maxim de drepte determinate de cele ${de(n)} puncte.`,
    ),
    solution: lines(
      `a) Cele mai puține drepte se obțin când toate punctele sunt coliniare: atunci determină o singură dreaptă. Minimul este 1.`,
      `b) Cele mai multe drepte se obțin când oricare trei puncte sunt necoliniare: fiecare pereche de puncte dă o altă dreaptă.`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${M}`),
      `Maximul este ${M}.`,
    ),
    verify: () => M === (n * n - n) / 2 && M >= 1,
  }
}

/** The number of points, from the number of lines they determine. After p. 103, ex. 14 and p. 124, ex. 19. */
export function findNPoints(rng: Rng): Made {
  const n = int(rng, 5, 45)
  const L = C2(n)
  return {
    text: `Mai multe puncte distincte, oricare trei necoliniare, determină ${de(L)} drepte. Câte puncte sunt?`,
    solution: lines(
      `Dacă sunt $n$ puncte, ele determină $\\frac{n(n - 1)}{2}$ drepte:`,
      show(`\\frac{n(n - 1)}{2} = ${L} \\Rightarrow n(n - 1) = ${2 * L}`),
      `Produsul a două numere naturale consecutive este ${2 * L}: $${2 * L} = ${n} \\cdot ${n - 1}$, deci $n = ${n}$.`,
      `Răspuns: ${de(n)} puncte.`,
    ),
    verify: () => n * (n - 1) === 2 * L && (n + 1) * n !== 2 * L,
  }
}

/** The least and the greatest number of intersection points of n distinct lines in a plane. p. 106, ex. 19. */
export function intersectionPoints(rng: Rng): Made {
  const n = int(rng, 3, 50)
  const M = C2(n)
  return {
    text: lines(
      `Se consideră ${de(n)} drepte distincte, situate în același plan.`,
      'a) Care este numărul maxim de puncte de intersecție ale acestor drepte?',
      'b) Care este numărul minim de puncte de intersecție?',
    ),
    solution: lines(
      `a) Două drepte distincte au cel mult un punct comun. Cele mai multe puncte se obțin când oricare două drepte sunt concurente și oricare trei nu trec prin același punct; atunci fiecare pereche de drepte dă un alt punct:`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${M}`),
      'b) Dacă toate dreptele sunt paralele, ele nu au niciun punct comun: minimul este 0.',
    ),
    verify: () => {
      let pairs = 0
      for (let i = 1; i < n; i++) pairs += i
      return pairs === M
    },
  }
}

/** n lines, no two parallel, no three through one point: the regions of the plane. p. 106, ex. 20. */
export function planeRegions(rng: Rng): Made {
  const n = int(rng, 2, 40)
  const R = 1 + (n * (n + 1)) / 2
  return {
    text: `În plan se consideră ${de(n)} drepte, astfel încât oricare două nu sunt paralele și oricare trei nu trec prin același punct. În câte regiuni împart aceste drepte planul?`,
    solution: lines(
      'O singură dreaptă împarte planul în 2 regiuni.',
      'Când trasăm a $k$-a dreaptă, ea taie fiecare dintre cele $k - 1$ drepte de dinainte în puncte diferite, deci este împărțită în $k$ bucăți; fiecare bucată taie o regiune în două, așa că se adaugă $k$ regiuni:',
      show(`1 + (1 + 2 + \\ldots + ${n}) = 1 + \\frac{${n} \\cdot ${n + 1}}{2} = 1 + ${R - 1} = ${R}`),
      `Răspuns: ${de(R)} regiuni.`,
    ),
    verify: () => {
      let r = 1
      for (let k = 1; k <= n; k++) r += k
      return r === R
    },
  }
}

// ================= 2. the length of a segment (pp. 109–111, 116–119) =================

/** A, B, C in this order: BC from AC and AB, with decimals. p. 109, ex. 9; p. 110, ex. 16. */
export function segDifference(rng: Rng): Made {
  const ab = int(rng, 5, 150)
  const bc = int(rng, 5, 150)
  const ac = ab + bc
  return {
    text: `Pe dreapta $d$ se iau punctele $A$, $B$ și $C$, în această ordine, astfel încât $AC = ${t10(ac)}$ cm și $AB = ${t10(ab)}$ cm. Calculați lungimea segmentului $BC$.`,
    solution: lines(
      'Punctul $B$ este între $A$ și $C$, deci $AB + BC = AC$:',
      show(`BC = AC - AB = ${t10(ac)} - ${t10(ab)} = ${t10(bc)} \\text{ cm}`),
    ),
    verify: () => ac - ab === bc && bc > 0,
  }
}

/** The length of a bridge from two odometer readings. p. 111, ex. 23. */
export function odometerBridge(rng: Rng): Made {
  const name = pick(rng, NAMES)
  const r1 = int(rng, 100000, 999000)
  const d = int(rng, 3, 99)
  const r2 = r1 + d
  return {
    text: `${name} măsoară lungimea unui pod cu ajutorul kilometrajului mașinii. La un capăt al podului aparatul arăta $${t10(r1)}$ km, iar la celălalt capăt $${t10(r2)}$ km. Cât de lung este podul, în kilometri și în metri?`,
    solution: lines(
      'Lungimea podului este diferența dintre cele două indicații:',
      show(`${t10(r2)} - ${t10(r1)} = ${t10(d)} \\text{ km}`),
      'Cum $1 \\text{ km} = 1000 \\text{ m}$:',
      show(`${t10(d)} \\text{ km} = ${t10(d)} \\cdot 1000 \\text{ m} = ${100 * d} \\text{ m}`),
    ),
    verify: () => r2 - r1 === d && 100 * d === (d / 10) * 1000,
  }
}

const PARTS: Record<number, string> = { 2: 'jumătate', 3: 'o treime', 4: 'un sfert', 5: 'o cincime', 6: 'o șesime' }
const lcm = (a: number, b: number) => {
  let m = a
  while (m % b !== 0) m += a
  return m
}

/** Half of a segment and a quarter of it measure S: the segment. p. 109, ex. 11. */
export function segPartsSum(rng: Rng): Made {
  const [p, q] = pick(rng, [[2, 4], [2, 3], [3, 6], [2, 5], [3, 4], [4, 5], [2, 6], [3, 5]] as [number, number][])
  const s = pick(rng, SEGS)
  const m = lcm(p, q)
  const x = m * int(rng, 1, 12)
  const S = x / p + x / q
  const top = m / p + m / q
  return {
    text: `${cap(PARTS[p])} din lungimea unui segment $${s}$ și încă ${PARTS[q]} din lungimea lui măsoară împreună ${S} cm. Calculați lungimea segmentului $${s}$.`,
    solution: lines(
      show(`\\frac{${s}}{${p}} + \\frac{${s}}{${q}} = ${S}`),
      `Aducem la numitorul comun ${m}:`,
      show(`\\frac{${m / p} \\cdot ${s} + ${m / q} \\cdot ${s}}{${m}} = ${S} \\Rightarrow \\frac{${top} \\cdot ${s}}{${m}} = ${S}`),
      show(`${s} = ${S} \\cdot ${m} : ${top} = ${x} \\text{ cm}`),
    ),
    verify: () => x % p === 0 && x % q === 0 && (S * m) / top === x,
  }
}

const TIMES: Record<number, string> = { 2: 'Dublul', 3: 'Triplul' }
const FRACT: Record<number, string> = { 2: 'jumătatea', 3: 'treimea', 4: 'sfertul', 5: 'cincimea' }

/** The triple of a segment exceeds by a its half. p. 109, ex. 10. */
export function segTimesExceeds(rng: Rng): Made {
  const k = pick(rng, [2, 3])
  const m = pick(rng, [2, 3, 4, 5])
  const s = pick(rng, SEGS)
  const t = int(rng, 1, 30)
  const x = m * t
  const a = (k * m - 1) * t
  return {
    text: `${TIMES[k]} lungimii unui segment $${s}$ depășește cu ${a} cm ${FRACT[m]} lungimii acestuia. Ce lungime are segmentul $${s}$?`,
    solution: lines(
      show(`${k} \\cdot ${s} - \\frac{${s}}{${m}} = ${a}`),
      `Scriem $${k} \\cdot ${s} = \\frac{${k * m} \\cdot ${s}}{${m}}$:`,
      show(`\\frac{${k * m - 1} \\cdot ${s}}{${m}} = ${a} \\Rightarrow ${s} = ${a} \\cdot ${m} : ${k * m - 1} = ${x} \\text{ cm}`),
      `Verificare: $${k} \\cdot ${x} - ${x} : ${m} = ${k * x} - ${t} = ${a}$.`,
    ),
    verify: () => k * x - x / m === a,
  }
}

/** A, B, C, D in order, with AB, AC and BD: BC, CD and AD. p. 110, ex. 16; p. 111, ex. 22. */
export function segFourPoints(rng: Rng): Made {
  const x = int(rng, 5, 90)
  const y = int(rng, 5, 90)
  const z = int(rng, 5, 90)
  const [ab, ac, bd] = [x, x + y, y + z]
  const bc = ac - ab
  const cd = bd - bc
  const ad = ab + bd
  return {
    text: `Fie punctele $A$, $B$, $C$, $D$ pe o dreaptă, astfel încât $B$ este între $A$ și $C$, iar $C$ este între $B$ și $D$. Știind că $AB = ${t10(ab)}$ cm, $AC = ${t10(ac)}$ cm și $BD = ${t10(bd)}$ cm, determinați lungimile segmentelor $BC$, $CD$ și $AD$.`,
    solution: lines(
      'Punctele sunt în ordinea $A$, $B$, $C$, $D$.',
      show(`BC = AC - AB = ${t10(ac)} - ${t10(ab)} = ${t10(bc)} \\text{ cm}`),
      show(`CD = BD - BC = ${t10(bd)} - ${t10(bc)} = ${t10(cd)} \\text{ cm}`),
      show(`AD = AB + BD = ${t10(ab)} + ${t10(bd)} = ${t10(ad)} \\text{ cm}`),
    ),
    verify: () => bc === y && cd === z && ad === x + y + z,
  }
}

/** Are A, B, C collinear, and in which order, from the three distances. p. 116, V.1; p. 119, II.4. */
export function collinearOrder(rng: Rng): Made {
  for (;;) {
    const collinear = rng() < 0.7
    let d: Record<string, number>
    let mid = ''
    if (collinear) {
      const x = int(rng, 2, 25)
      const y = int(rng, 2, 25)
      mid = pick(rng, ['A', 'B', 'C'])
      const [p, q] = ['A', 'B', 'C'].filter((c) => c !== mid)
      d = { [[p, mid].sort().join('')]: x, [[mid, q].sort().join('')]: y, [p + q]: x + y }
    } else {
      const [x, y, z] = [int(rng, 2, 25), int(rng, 2, 25), int(rng, 2, 25)]
      const big = Math.max(x, y, z)
      if (2 * big >= x + y + z) continue
      d = { AB: x, AC: y, BC: z }
    }
    const segs = ['AB', 'AC', 'BC']
    const longest = segs.reduce((u, v) => (d[v] > d[u] ? v : u))
    const others = segs.filter((s) => s !== longest)
    const sum = d[others[0]] + d[others[1]]
    return {
      text: `Stabiliți dacă punctele $A$, $B$ și $C$ sunt coliniare și, în caz afirmativ, precizați care dintre ele este între celelalte două, știind că $AB = ${d.AB}$ cm, $AC = ${d.AC}$ cm și $BC = ${d.BC}$ cm.`,
      solution: collinear
        ? lines(
            'Dacă trei puncte sunt coliniare, unul dintre ele este între celelalte două, iar cel mai lung segment este suma celorlalte două. Aici:',
            show(`${others[0]} + ${others[1]} = ${d[others[0]]} + ${d[others[1]]} = ${sum} = ${longest}`),
            `Punctul $${mid}$ se află pe segmentul $${longest}$: punctele sunt coliniare, iar $${mid}$ este între $${longest[0]}$ și $${longest[1]}$.`,
          )
        : lines(
            'Dacă trei puncte sunt coliniare, unul dintre ele este între celelalte două, iar cel mai lung segment este suma celorlalte două. Aici:',
            show(`${others[0]} + ${others[1]} = ${d[others[0]]} + ${d[others[1]]} = ${sum} \\neq ${d[longest]} = ${longest}`),
            'Deci punctele $A$, $B$ și $C$ nu sunt coliniare.',
          ),
      verify: () => (sum === d[longest]) === collinear && (!collinear || !longest.includes(mid)),
    }
  }
}

/** O, A, B, C, D on a line in this order, the distances from O given: the six segments. p. 111, ex. 21. */
export function segFromO(rng: Rng): Made {
  const oa = int(rng, 5, 40)
  const ob = oa + int(rng, 5, 40)
  const oc = ob + int(rng, 5, 40)
  const od = oc + int(rng, 5, 40)
  const pos: Record<string, number> = { A: oa, B: ob, C: oc, D: od }
  const asks = ['AB', 'BC', 'CD', 'AC', 'BD', 'AD']
  return {
    text: `Punctele $O$, $A$, $B$, $C$, $D$ aparțin dreptei $d$, în această ordine, iar $OA = ${t10(oa)}$ cm, $OB = ${t10(ob)}$ cm, $OC = ${t10(oc)}$ cm și $OD = ${t10(od)}$ cm. Calculați lungimile segmentelor ${math(asks)}.`,
    solution: lines(
      'Fiecare segment este diferența a două segmente cu capătul în $O$; de exemplu, $A$ este între $O$ și $B$, deci $AB = OB - OA$:',
      ...asks.map((s) => show(`${s} = O${s[1]} - O${s[0]} = ${t10(pos[s[1]])} - ${t10(pos[s[0]])} = ${t10(pos[s[1]] - pos[s[0]])} \\text{ cm}`)),
    ),
    verify: () => pos.D - pos.A === (pos.B - pos.A) + (pos.C - pos.B) + (pos.D - pos.C) && pos.A > 0,
  }
}

/** C between A and B, A between B and D: AC, CD, BD. p. 110, ex. 17. */
export function segMixedOrder(rng: Rng): Made {
  const p = int(rng, 6, 40)
  const q = int(rng, 1, p - 1)
  const r = int(rng, 2, 30)
  const ac = p - q
  const cd = r + ac
  const bd = p + r
  // coordinates: D = 0, A = r, C = r + p − q, B = r + p
  const [D, Ap, C, B] = [0, r, r + p - q, r + p]
  return {
    text: `Pe dreapta $d$ se iau punctele $A$, $B$, $C$, $D$, astfel încât $C$ este între $A$ și $B$, iar $A$ este între $B$ și $D$. Știind că $AB = ${p}$ cm, $BC = ${q}$ cm și $AD = ${r}$ cm, calculați lungimile segmentelor $AC$, $CD$ și $BD$.`,
    solution: lines(
      'Din ipoteză, punctele sunt în ordinea $D$, $A$, $C$, $B$.',
      show(`AC = AB - BC = ${p} - ${q} = ${ac} \\text{ cm}`),
      'Punctul $A$ este între $D$ și $C$:',
      show(`CD = AD + AC = ${r} + ${ac} = ${cd} \\text{ cm}`),
      show(`BD = AB + AD = ${p} + ${r} = ${bd} \\text{ cm}`),
    ),
    verify: () => C - Ap === ac && C - D === cd && B - D === bd && B - C === q,
  }
}

const RATIO: [number, string][] = [[2, '0{,}5'], [4, '0{,}25'], [5, '0{,}2']]
const PERIODIC: [number, number, string][] = [[1, 3, '0{,}(3)'], [2, 3, '0{,}(6)'], [1, 9, '0{,}(1)'], [2, 9, '0{,}(2)'], [4, 9, '0{,}(4)'], [5, 9, '0{,}(5)'], [7, 9, '0{,}(7)']]

/** AB in metres, AC = 0,5·BC and AD = 0,(6)·AB: AC, BC, AD, CD. p. 117, V.1. */
export function segPeriodic(rng: Rng): Made {
  for (;;) {
    const [k, co] = pick(rng, RATIO)
    const [num, den, fp] = pick(rng, PERIODIC)
    if (num * (k + 1) === den) continue
    const step = lcm(k + 1, den)
    const L = step * int(rng, 1, Math.floor(300 / step))
    if (L < 12) continue
    const ac = L / (k + 1)
    const bc = L - ac
    const ad = (num * L) / den
    const cd = Math.abs(ad - ac)
    return {
      text: `Pe segmentul $AB$, cu lungimea de $${t100(L)}$ m, se iau punctele $C$ și $D$, astfel încât $AC = ${co} \\cdot BC$ și $AD = ${fp} \\cdot AB$. Calculați, în centimetri, lungimile segmentelor $AC$, $BC$, $AD$ și $CD$.`,
      solution: lines(
        `$AB = ${t100(L)} \\text{ m} = ${L} \\text{ cm}$. Cum $${co} = \\frac{1}{${k}}$, avem $BC = ${k} \\cdot AC$, iar $C$ este pe segmentul $AB$:`,
        show(`AB = AC + BC = AC + ${k} \\cdot AC = ${k + 1} \\cdot AC \\Rightarrow AC = ${L} : ${k + 1} = ${ac} \\text{ cm}`),
        show(`BC = ${L} - ${ac} = ${bc} \\text{ cm}`),
        `Fracția periodică: $${fp} = \\frac{${num}}{${den}}$, deci:`,
        show(`AD = \\frac{${num}}{${den}} \\cdot ${L} = ${ad} \\text{ cm}`),
        `Punctele $C$ și $D$ sunt pe segmentul $AB$, deci $CD$ este diferența dintre $AD$ și $AC$:`,
        show(`CD = ${Math.max(ad, ac)} - ${Math.min(ad, ac)} = ${cd} \\text{ cm}`),
      ),
      verify: () => Number.isInteger(ac) && Number.isInteger(ad) && ac * k === bc && ac + bc === L && cd > 0 && cd < L,
    }
  }
}

/** A, B, C, D in order with AC, BD and AD: BC, AB, CD. p. 114, ex. 19 a. */
export function segOverlap(rng: Rng): Made {
  const p = int(rng, 1, 30)
  const x = int(rng, 1, 30)
  const q = int(rng, 1, 30)
  const [ac, bd, ad] = [p + x, x + q, p + x + q]
  const bc = ac + bd - ad
  return {
    text: `Pe o dreaptă $d$ se consideră punctele $A$, $B$, $C$, $D$, în această ordine. Știind că $AC = ${ac}$ cm, $BD = ${bd}$ cm și $AD = ${ad}$ cm, calculați lungimile segmentelor $BC$, $AB$ și $CD$.`,
    solution: lines(
      'Segmentele $AC$ și $BD$ acoperă împreună tot segmentul $AD$, iar porțiunea $BC$ este numărată de două ori:',
      show(`AC + BD = AD + BC \\Rightarrow BC = ${ac} + ${bd} - ${ad} = ${bc} \\text{ cm}`),
      show(`AB = AD - BD = ${ad} - ${bd} = ${ad - bd} \\text{ cm}, \\quad CD = AD - AC = ${ad} - ${ac} = ${ad - ac} \\text{ cm}`),
    ),
    verify: () => bc === x && ad - bd === p && ad - ac === q,
  }
}

// ================= 3. the midpoint and the symmetric of a point (pp. 113–120) =================

/** AB → AM, and MB → AB. p. 113, ex. 1. */
export function midpointBasic(rng: Rng): Made {
  const a = 2 * int(rng, 3, 120)
  const b = int(rng, 3, 150)
  return {
    text: lines(
      'Se consideră un segment $AB$, iar $M$ este mijlocul acestuia.',
      `a) Dacă $AB = ${t10(a)}$ cm, aflați lungimea segmentului $AM$.`,
      `b) Dacă $MB = ${t10(b)}$ cm, aflați lungimea segmentului $AB$.`,
    ),
    solution: lines(
      'Mijlocul împarte segmentul în două segmente congruente: $AM = MB = AB : 2$.',
      show(`\\text{a) } AM = ${t10(a)} : 2 = ${t10(a / 2)} \\text{ cm}`),
      show(`\\text{b) } AB = 2 \\cdot MB = 2 \\cdot ${t10(b)} = ${t10(2 * b)} \\text{ cm}`),
    ),
    verify: () => (a / 2) * 2 === a && Number.isInteger(a / 2),
  }
}

/** A on OB, M the midpoint of AB: AM and OM. p. 113, ex. 4. */
export function midpointOnRay(rng: Rng): Made {
  const a = int(rng, 1, 30)
  const b = a + int(rng, 2, 30)
  return {
    text: `Se dau punctele $O$, $A$ și $B$, astfel încât $A \\in OB$, $OA = ${a}$ cm și $OB = ${b}$ cm. Dacă $M$ este mijlocul segmentului $AB$, aflați lungimile segmentelor $AM$ și $OM$.`,
    solution: lines(
      show(`AB = OB - OA = ${b} - ${a} = ${b - a} \\text{ cm}, \\quad AM = ${b - a} : 2 = ${h2(b - a)} \\text{ cm}`),
      'Punctul $A$ este între $O$ și $M$:',
      show(`OM = OA + AM = ${a} + ${h2(b - a)} = ${h2(a + b)} \\text{ cm}`),
    ),
    verify: () => 2 * a + (b - a) === a + b,
  }
}

/** O on AB, Q the symmetric of O with respect to B: AQ and OQ. p. 113, ex. 9. */
export function symmetricOnSegment(rng: Rng): Made {
  const L = int(rng, 4, 40)
  const a = int(rng, 1, L - 1)
  const ob = L - a
  return {
    text: `Pe segmentul $AB$, cu lungimea de ${L} cm, se consideră un punct $O$, astfel încât $AO = ${a}$ cm. Se notează cu $Q$ simetricul punctului $O$ față de punctul $B$. Calculați lungimile segmentelor $OB$, $OQ$ și $AQ$.`,
    solution: lines(
      show(`OB = AB - AO = ${L} - ${a} = ${ob} \\text{ cm}`),
      'Punctul $B$ este mijlocul segmentului $OQ$, deci $BQ = OB$:',
      show(`OQ = 2 \\cdot OB = ${2 * ob} \\text{ cm}, \\quad AQ = AB + BQ = ${L} + ${ob} = ${L + ob} \\text{ cm}`),
    ),
    // coordinates: A = 0, O = a, B = L, Q = 2L − a
    verify: () => 2 * L - a - a === 2 * ob && 2 * L - a === L + ob,
  }
}

/** M, N midpoints of AB and BC, AB and MN known: BC and AC. p. 113, ex. 7. */
export function midpointsReverse(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const c = int(rng, 2, 40)
  return {
    text: `Punctele $A$, $B$, $C$ sunt coliniare, în această ordine. Fie $M$ mijlocul segmentului $AB$ și $N$ mijlocul segmentului $BC$. Dacă $AB = ${a}$ cm și $MN = ${h2(a + c)}$ cm, calculați lungimile segmentelor $BC$ și $AC$.`,
    solution: lines(
      show(`MB = AB : 2 = ${a} : 2 = ${h2(a)} \\text{ cm}`),
      'Punctul $B$ este între $M$ și $N$:',
      show(`BN = MN - MB = ${h2(a + c)} - ${h2(a)} = ${h2(c)} \\text{ cm}`),
      show(`BC = 2 \\cdot BN = ${c} \\text{ cm}, \\quad AC = AB + BC = ${a} + ${c} = ${a + c} \\text{ cm}`),
      `Observăm că $MN = AC : 2$.`,
    ),
    verify: () => (a + c) / 2 - a / 2 === c / 2 && (a + c) / 2 === (a + c) / 2,
  }
}

/** M₁ the midpoint of AB, M₂ of AM₁, …: AMₖ. p. 114, ex. 14. */
export function halvingChain(rng: Rng): Made {
  const k = int(rng, 2, 5)
  const t = int(rng, 1, 12)
  const AB = 2 ** k * t
  const defs = [`cu $M_1$ mijlocul segmentului $AB$`]
  for (let i = 2; i <= k; i++) defs.push(`cu $M_${i}$ mijlocul segmentului $AM_${i - 1}$`)
  const steps: string[] = []
  let v = AB
  for (let i = 1; i <= k; i++) {
    steps.push(show(`AM_${i} = ${i === 1 ? 'AB' : `AM_${i - 1}`} : 2 = ${v} : 2 = ${v / 2} \\text{ cm}`))
    v /= 2
  }
  return {
    text: `Se consideră segmentul $AB$ cu lungimea de ${AB} cm. Se notează ${list(defs)}. Calculați lungimea segmentului $AM_${k}$.`,
    solution: lines('Fiecare punct este mijlocul segmentului precedent, deci lungimea se înjumătățește de fiecare dată:', ...steps),
    verify: () => v === t && t * 2 ** k === AB,
  }
}

/** D the symmetric of B with respect to C, AD and BC known: CD, BD, AB, AC. p. 114, ex. 16. */
export function symmetricChain(rng: Rng): Made {
  const p = int(rng, 1, 30)
  const c = int(rng, 1, 20)
  const s = p + 2 * c
  return {
    text: `Punctele $A$, $B$, $C$, $D$ sunt coliniare, în această ordine. Se știe că $AD = ${s}$ cm și $BC = ${c}$ cm, iar $D$ este simetricul punctului $B$ față de punctul $C$. Determinați lungimile segmentelor $CD$, $BD$, $AB$ și $AC$.`,
    solution: lines(
      'Punctul $C$ este mijlocul segmentului $BD$:',
      show(`CD = BC = ${c} \\text{ cm}, \\quad BD = 2 \\cdot ${c} = ${2 * c} \\text{ cm}`),
      show(`AB = AD - BD = ${s} - ${2 * c} = ${p} \\text{ cm}, \\quad AC = AB + BC = ${p} + ${c} = ${p + c} \\text{ cm}`),
    ),
    // coordinates: A = 0, B = p, C = p + c, D = p + 2c
    verify: () => p + 2 * c === s && p + c === s - c,
  }
}

/** M, N, P, Q in order, Q the symmetric of M with respect to P: MP, PQ, MQ, NQ. p. 114, ex. 18. */
export function symmetricMQ(rng: Rng): Made {
  const a = int(rng, 1, 30)
  const b = int(rng, 1, 30)
  const mp = a + b
  return {
    text: `Punctele distincte $M$, $N$, $P$ și $Q$ sunt coliniare, în această ordine. Punctul $Q$ este simetricul punctului $M$ față de punctul $P$, $MN = ${a}$ cm și $NP = ${b}$ cm. Calculați lungimile segmentelor $MP$, $PQ$, $MQ$ și $NQ$.`,
    solution: lines(
      show(`MP = MN + NP = ${a} + ${b} = ${mp} \\text{ cm}`),
      'Punctul $P$ este mijlocul segmentului $MQ$:',
      show(`PQ = MP = ${mp} \\text{ cm}, \\quad MQ = 2 \\cdot ${mp} = ${2 * mp} \\text{ cm}`),
      show(`NQ = NP + PQ = ${b} + ${mp} = ${b + mp} \\text{ cm}`),
    ),
    // coordinates: M = 0, N = a, P = a + b, Q = 2(a + b)
    verify: () => 2 * (a + b) - a === b + mp && 2 * (a + b) === 2 * mp,
  }
}

/** O, A, B, C with OB = 2·OA − 2·BC: N is the midpoint of MP. p. 114, ex. 15. */
export function midpointsAlign(rng: Rng): Made {
  const c = int(rng, 1, 12)
  const a = int(rng, 2 * c + 1, 2 * c + 25)
  const b = 2 * a - 2 * c
  // twice the distances from O
  const [M2, N2, P2] = [b + c, a + b, 2 * b + c]
  return {
    text: lines(
      `Se consideră punctele coliniare $O$, $A$, $B$ și $C$, în această ordine, astfel încât $OA = ${a}$ cm, $OB = ${b}$ cm și $BC = ${c}$ cm. Se notează cu $M$, $N$ și $P$ mijloacele segmentelor $OC$, $AB$ și, respectiv, $BC$.`,
      'a) Calculați lungimile segmentelor $AB$, $OC$ și $AC$.',
      'b) Arătați prin calcul că $N$ este mijlocul segmentului $MP$.',
    ),
    solution: lines(
      show(`\\text{a) } AB = ${b} - ${a} = ${b - a} \\text{ cm}, \\quad OC = ${b} + ${c} = ${b + c} \\text{ cm}, \\quad AC = ${b - a} + ${c} = ${b - a + c} \\text{ cm}`),
      'b) Calculăm distanțele de la $O$ la cele trei mijloace:',
      show(`OM = OC : 2 = ${h2(M2)} \\text{ cm}, \\quad ON = OA + AB : 2 = ${a} + ${h2(b - a)} = ${h2(N2)} \\text{ cm}`),
      show(`OP = OB + BC : 2 = ${b} + ${h2(c)} = ${h2(P2)} \\text{ cm}`),
      'Cum $OM < ON < OP$, punctul $N$ este între $M$ și $P$:',
      show(`MN = ${h2(N2)} - ${h2(M2)} = ${h2(N2 - M2)} \\text{ cm}, \\quad NP = ${h2(P2)} - ${h2(N2)} = ${h2(P2 - N2)} \\text{ cm}`),
      'Deci $MN = NP$, iar $N$ este mijlocul segmentului $MP$.',
    ),
    verify: () => M2 < N2 && N2 < P2 && N2 - M2 === P2 - N2,
  }
}

/** A, B, C, D in order with AC, BD, AD; O the midpoint of BD: BC, O between C and D, OC. p. 114, ex. 19. */
export function midpointBD(rng: Rng): Made {
  const p = int(rng, 1, 20)
  const x = int(rng, 1, 15)
  const q = x + int(rng, 1, 25)
  const [ac, bd, ad] = [p + x, x + q, p + x + q]
  const bc = ac + bd - ad
  return {
    text: lines(
      `Pe o dreaptă $d$ se consideră patru puncte $A$, $B$, $C$, $D$, în această ordine. Se știe că $AC = ${ac}$ cm, $BD = ${bd}$ cm și $AD = ${ad}$ cm.`,
      'a) Calculați lungimea segmentului $BC$.',
      'b) Dacă $O$ este mijlocul segmentului $BD$, arătați că $O$ este între $C$ și $D$.',
      'c) Calculați lungimea segmentului $OC$.',
    ),
    solution: lines(
      show(`\\text{a) } AC + BD = AD + BC \\Rightarrow BC = ${ac} + ${bd} - ${ad} = ${bc} \\text{ cm}`),
      show(`\\text{b) } BO = BD : 2 = ${bd} : 2 = ${h2(bd)} \\text{ cm}`),
      `Cum $BO = ${h2(bd)} \\text{ cm} > BC = ${bc}$ cm, iar $O$ și $C$ sunt pe semidreapta $BD$, punctul $C$ este între $B$ și $O$, deci $O$ este între $C$ și $D$.`,
      show(`\\text{c) } OC = BO - BC = ${h2(bd)} - ${bc} = ${h2(q - x)} \\text{ cm}`),
    ),
    verify: () => bc === x && bd > 2 * bc && bd - 2 * bc === q - x,
  }
}

/** O, A, B collinear, OA and OB known, M the midpoint of AB: OM, in the two cases. p. 114, ex. 21. */
export function midpointDiscussion(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 40)
    const b = int(rng, 1, 40)
    if (a === b) continue
    const [lo, hi] = [Math.min(a, b), Math.max(a, b)]
    return {
      text: `Punctele $O$, $A$, $B$ sunt coliniare, $OA = ${a}$ cm și $OB = ${b}$ cm, iar $M$ este mijlocul segmentului $AB$. Calculați lungimea segmentului $OM$. Discuție.`,
      solution: lines(
        `Cazul 1: punctele $A$ și $B$ sunt de aceeași parte a punctului $O$. Atunci $AB = ${hi} - ${lo} = ${hi - lo}$ cm și`,
        show(`OM = ${lo} + ${hi - lo} : 2 = ${lo} + ${h2(hi - lo)} = ${h2(a + b)} \\text{ cm}`),
        `Cazul 2: punctul $O$ este între $A$ și $B$. Atunci $AB = ${a} + ${b} = ${a + b}$ cm, $AM = ${h2(a + b)}$ cm și`,
        show(`OM = AM - OA = ${h2(a + b)} - ${a} = ${h2(Math.abs(b - a))} \\text{ cm}`),
        a > b ? `(aici $OA > AM$, deci $M$ este între $A$ și $O$, iar $OM = OA - AM = ${h2(a - b)}$ cm).` : `(aici $M$ este între $O$ și $B$).`,
        `Răspuns: $OM = ${h2(a + b)}$ cm sau $OM = ${h2(hi - lo)}$ cm.`,
      ),
      // coordinates on the line, O = 0
      verify: () => Math.abs((a + b) / 2) * 2 === a + b && Math.abs((a - b) / 2) * 2 === hi - lo,
    }
  }
}

/** A, B, C on a ray OX, D, E, F the midpoints of AB, BC, AC: DE and BF have the same midpoint. p. 114, ex. 20. */
export function raysMidpointsCommon(rng: Rng): Made {
  const a = int(rng, 1, 20)
  const b = a + int(rng, 1, 20)
  const c = b + int(rng, 1, 20)
  const [D2, E2, F2] = [a + b, b + c, a + c]
  return {
    text: `Se consideră trei puncte $A$, $B$, $C$ pe semidreapta $OX$, astfel încât $OA = ${a}$ cm, $OB = ${b}$ cm și $OC = ${c}$ cm. Fie $D$, $E$, $F$ mijloacele segmentelor $AB$, $BC$ și, respectiv, $AC$. Calculați $OD$, $OE$ și $OF$, apoi arătați că segmentele $DE$ și $BF$ au același mijloc.`,
    solution: lines(
      'Mijlocul unui segment de pe semidreaptă este la distanța egală cu media distanțelor capetelor față de $O$:',
      show(`OD = \\frac{${a} + ${b}}{2} = ${h2(D2)} \\text{ cm}, \\quad OE = \\frac{${b} + ${c}}{2} = ${h2(E2)} \\text{ cm}, \\quad OF = \\frac{${a} + ${c}}{2} = ${h2(F2)} \\text{ cm}`),
      'Mijlocul segmentului $DE$ și mijlocul segmentului $BF$ sunt la distanțele:',
      show(`\\frac{OD + OE}{2} = \\frac{${h2(D2)} + ${h2(E2)}}{2} = ${q4(D2 + E2)} \\text{ cm}, \\quad \\frac{OB + OF}{2} = \\frac{${b} + ${h2(F2)}}{2} = ${q4(2 * b + F2)} \\text{ cm}`),
      'Cele două mijloace sunt pe aceeași semidreaptă, la aceeași distanță de $O$, deci coincid.',
    ),
    verify: () => D2 + E2 === 2 * b + F2,
  }
}

// ================= 4. the measure of an angle and its kind (pp. 123–129, 132) =================

/** Degrees and minutes to minutes, and back. p. 128, ex. 8–9; p. 132, ex. 1–2. */
export function toMinutes(rng: Rng): Made {
  const d1 = int(rng, 1, 179)
  const m1 = int(rng, 1, 59)
  const d2 = int(rng, 2, 180)
  const N = int(rng, 61, 10799)
  return {
    text: lines(
      `a) Transformați în minute sexagesimale: $${d1}^\\circ ${m1}'$ și $${d2}^\\circ$.`,
      `b) Transformați în grade și minute sexagesimale: $${N}'$.`,
    ),
    solution: lines(
      "Folosim $1^\\circ = 60'$.",
      show(`\\text{a) } ${d1}^\\circ ${m1}' = ${d1} \\cdot 60' + ${m1}' = ${60 * d1}' + ${m1}' = ${60 * d1 + m1}', \\quad ${d2}^\\circ = ${d2} \\cdot 60' = ${60 * d2}'`),
      `b) Împărțim la 60: $${N} : 60 = ${Math.floor(N / 60)}$ rest ${N % 60}, deci`,
      show(`${N}' = ${dm(N)}`),
    ),
    verify: () => Math.floor(N / 60) * 60 + (N % 60) === N && (60 * d1 + m1) % 60 === m1,
  }
}

const KINDS_PLURAL: [string, string][] = [['nul', 'nule'], ['ascuțit', 'ascuțite'], ['drept', 'drepte'], ['obtuz', 'obtuze'], ['alungit', 'alungite']]

/** Six angles written in degrees, minutes or both, some with more than 60 minutes: their kinds. p. 128, ex. 10. */
export function classifyAngles(rng: Rng): Made {
  const names = ['A', 'B', 'C', 'D', 'E', 'F']
  const angles = names.map((name) => {
    const kind = pick(rng, [0, 1, 1, 2, 3, 3, 4])
    const value = [0, int(rng, 1, 5399), 5400, int(rng, 5401, 10799), 10800][kind]
    const style = pick(rng, ['deg', 'min', 'over'])
    let deg = Math.floor(value / 60)
    let min = value % 60
    let tex: string
    if (style === 'min' || value === 0) {
      tex = `${value}'`
      ;[deg, min] = [0, value]
    } else if (style === 'over' && deg >= 1) {
      const k = Math.min(deg, int(rng, 1, 4))
      deg -= k
      min += 60 * k
      tex = `${deg}^\\circ ${min}'`
    } else {
      tex = dm(value)
    }
    return { name, value, deg, min, tex }
  })
  const groups = KINDS_PLURAL.map(([one, many]) => {
    const g = angles.filter((x) => kindOf(x.value) === one).map((x) => A(x.name))
    return `${cap(many)}: ${g.length ? math(g) : 'niciunul'}.`
  })
  return {
    text: `Se consideră unghiurile: ${list(angles.map((x) => `$${A(x.name)} = ${x.tex}$`))}. Precizați care dintre ele sunt nule, ascuțite, drepte, obtuze, respectiv alungite.`,
    solution: lines(
      "Scriem fiecare măsură în grade și minute ($60' = 1^\\circ$) și o comparăm cu $0^\\circ$, $90^\\circ$ și $180^\\circ$:",
      show(angles.map((x) => `${A(x.name)} = ${x.tex === dm(x.value) ? x.tex : `${x.tex} = ${dm(x.value)}`}`).join(', \\quad ')),
      ...groups,
    ),
    verify: () => angles.every((x) => 60 * x.deg + x.min === x.value) && angles.length === 6,
  }
}

/** ∢M in decimal degrees and ∢N in minutes: are they congruent? p. 128, ex. 11. */
export function congruentCheck(rng: Rng): Made {
  const d = int(rng, 1, 170)
  const h = 5 * int(rng, 1, 19)
  const M = 60 * d + (3 * h) / 5
  const equal = rng() < 0.5
  const N = equal ? M : M + pick(rng, [-1, 1]) * int(rng, 1, 20)
  const asMinutes = rng() < 0.5
  const k = int(rng, 1, 3)
  const nTex = asMinutes ? `${N}'` : `${Math.floor(N / 60) - k}^\\circ ${(N % 60) + 60 * k}'`
  return {
    text: `Verificați dacă unghiurile $M$ și $N$ sunt congruente, știind că $${A('M')} = ${t100(100 * d + h)}^\\circ$ și $${A('N')} = ${nTex}$.`,
    solution: lines(
      "Exprimăm ambele măsuri în minute, cu $1^\\circ = 60'$:",
      show(`${A('M')} = ${t100(100 * d + h)}^\\circ = ${t100(100 * d + h)} \\cdot 60' = ${M}'`),
      show(`${A('N')} = ${nTex}${asMinutes ? '' : ` = ${N}'`}`),
      equal ? 'Măsurile sunt egale, deci unghiurile sunt congruente.' : `Cum $${M}' \\neq ${N}'$, unghiurile nu sunt congruente.`,
    ),
    verify: () => (Math.round(((100 * d + h) * 60) / 100) === N) === equal && Number.isInteger(M),
  }
}

/** ∢ABC = n° + c°: the values of n for each kind. p. 129, ex. 21. */
export function kindFromN(rng: Rng): Made {
  const c = int(rng, 5, 85)
  const name = pick(rng, ['ABC', 'MNP', 'XOY', 'DEF', 'RST'])
  const front = rng() < 0.5
  const expr = front ? `n^\\circ + ${c}^\\circ` : `${c}^\\circ + n^\\circ`
  return {
    text: lines(
      `Se consideră unghiul $${name}$ cu măsura egală cu $${expr}$, unde $n$ este un număr natural. Determinați valorile lui $n$ pentru care unghiul $${name}$ este:`,
      'a) ascuțit; b) drept; c) obtuz; d) alungit.',
    ),
    solution: lines(
      show(`\\text{a) } 0^\\circ < n^\\circ + ${c}^\\circ < 90^\\circ \\Rightarrow n < ${90 - c} \\Rightarrow n \\in \\{0, 1, \\ldots, ${89 - c}\\}`),
      show(`\\text{b) } n^\\circ + ${c}^\\circ = 90^\\circ \\Rightarrow n = ${90 - c}`),
      show(`\\text{c) } 90^\\circ < n^\\circ + ${c}^\\circ < 180^\\circ \\Rightarrow ${90 - c} < n < ${180 - c} \\Rightarrow n \\in \\{${91 - c}, ${92 - c}, \\ldots, ${179 - c}\\}`),
      show(`\\text{d) } n^\\circ + ${c}^\\circ = 180^\\circ \\Rightarrow n = ${180 - c}`),
    ),
    verify: () => kindOf(60 * (89 - c + c)) === 'ascuțit' && kindOf(60 * (90 - c + c)) === 'drept' && kindOf(60 * (179 - c + c)) === 'obtuz' && kindOf(60 * (91 - c + c)) === 'obtuz',
  }
}

/** ∢ = (a·n + c)°: when acute, right, obtuse or straight, and whether it can be right at all. After p. 129, ex. 21. */
export function kindFromLinear(rng: Rng): Made {
  const a = int(rng, 2, 6)
  const c = int(rng, 1, 89)
  const name = pick(rng, ['ABC', 'MNP', 'XOY', 'DEF'])
  const acuteMax = Math.floor((89 - c) / a)
  const right = (90 - c) % a === 0 ? (90 - c) / a : -1
  const obtLo = Math.floor((90 - c) / a) + 1
  const obtHi = Math.floor((179 - c) / a)
  const straight = (180 - c) % a === 0 ? (180 - c) / a : -1
  const set = (lo: number, hi: number) => (hi < lo ? '\\varnothing' : hi === lo ? `\\{${lo}\\}` : hi === lo + 1 ? `\\{${lo}, ${hi}\\}` : `\\{${lo}, ${lo + 1}, \\ldots, ${hi}\\}`)
  return {
    text: lines(
      `Măsura unghiului $${name}$ este egală cu $(${a}n + ${c})^\\circ$, unde $n$ este un număr natural. Determinați valorile lui $n$ pentru care unghiul $${name}$ este:`,
      'a) ascuțit; b) drept; c) obtuz; d) alungit.',
    ),
    solution: lines(
      show(`\\text{a) } ${a}n + ${c} < 90 \\Rightarrow ${a}n < ${90 - c} \\Rightarrow n \\in ${set(0, acuteMax)}`),
      right >= 0
        ? show(`\\text{b) } ${a}n + ${c} = 90 \\Rightarrow ${a}n = ${90 - c} \\Rightarrow n = ${right}`)
        : `b) $${a}n + ${c} = 90 \\Rightarrow ${a}n = ${90 - c}$, dar ${90 - c} nu se împarte exact la ${a}: unghiul nu poate fi drept.`,
      show(`\\text{c) } 90 < ${a}n + ${c} < 180 \\Rightarrow ${90 - c} < ${a}n < ${180 - c} \\Rightarrow n \\in ${set(obtLo, obtHi)}`),
      straight >= 0
        ? show(`\\text{d) } ${a}n + ${c} = 180 \\Rightarrow ${a}n = ${180 - c} \\Rightarrow n = ${straight}`)
        : `d) $${a}n + ${c} = 180 \\Rightarrow ${a}n = ${180 - c}$, dar ${180 - c} nu se împarte exact la ${a}: unghiul nu poate fi alungit.`,
    ),
    verify: () => {
      for (let n = 0; n <= 200; n++) {
        const k = kindOf(60 * (a * n + c))
        const v = a * n + c
        if (v > 180) break
        if ((k === 'ascuțit') !== (n <= acuteMax)) return false
        if ((k === 'drept') !== (n === right)) return false
        if ((k === 'obtuz') !== (n >= obtLo && n <= obtHi)) return false
        if ((k === 'alungit') !== (n === straight)) return false
      }
      return true
    },
  }
}

/** n rays with the same origin, no two opposite: how many angles. p. 124, ex. 17; p. 147, I.1. */
export function countRaysAngles(rng: Rng): Made {
  const n = int(rng, 3, 45)
  const N = C2(n)
  return {
    text: `Se consideră ${de(n)} semidrepte distincte, cu originea comună în punctul $O$, oricare două neopuse. Câte unghiuri au ca laturi două dintre aceste semidrepte?`,
    solution: lines(
      `Fiecare pereche de semidrepte formează un unghi. Fiecare semidreaptă se pune cu fiecare dintre celelalte ${n - 1}, iar fiecare unghi apare de două ori:`,
      show(`\\frac{${n} \\cdot ${n - 1}}{2} = ${N}`),
      `Răspuns: ${de(N)} unghiuri.`,
    ),
    verify: () => N * 2 === n * (n - 1),
  }
}

/** C, O, D collinear and n rays in one half-plane: n from the number of angles. p. 124, ex. 19. */
export function raysFindN(rng: Rng): Made {
  const m = int(rng, 5, 35)
  const T = C2(m)
  const n = m - 2
  return {
    text: `Punctele $C$, $O$, $D$ sunt coliniare, în această ordine, iar semidreptele $OA_1$, $OA_2$, $\\ldots$, $OA_n$ sunt situate în același semiplan determinat de dreapta $CD$. Determinați $n$, astfel încât cele $n + 2$ semidrepte să determine ${de(T)} unghiuri.`,
    solution: lines(
      'Cele $n + 2$ semidrepte ($OC$, $OD$ și cele $n$ din semiplan) sunt distincte, iar oricare două formează un unghi (semidreptele opuse $OC$ și $OD$ formează unghiul alungit $COD$):',
      show(`\\frac{(n + 2)(n + 1)}{2} = ${T} \\Rightarrow (n + 2)(n + 1) = ${2 * T} = ${m} \\cdot ${m - 1}`),
      `Deci $n + 2 = ${m}$, adică $n = ${n}$.`,
    ),
    verify: () => ((n + 2) * (n + 1)) / 2 === T,
  }
}

/** A straight angle with k rays inside, in one half-plane: the proper angles. p. 124, ex. 18. */
export function straightWithRays(rng: Rng): Made {
  const k = int(rng, 3, 35)
  const N = C2(k + 2) - 1
  return {
    text: `Se consideră unghiul alungit $A_0OA_{${k + 1}}$ și semidreptele distincte $OA_1$, $OA_2$, $\\ldots$, $OA_{${k}}$, situate în același semiplan determinat de dreapta $A_0A_{${k + 1}}$. Câte unghiuri proprii au ca laturi două dintre aceste ${de(k + 2)} semidrepte?`,
    solution: lines(
      `Oricare două dintre cele ${de(k + 2)} semidrepte formează un unghi:`,
      show(`\\frac{${k + 2} \\cdot ${k + 1}}{2} = ${C2(k + 2)}`),
      `Dintre acestea, doar unghiul $A_0OA_{${k + 1}}$ este alungit, deci nu este propriu (niciun unghi nu este nul, semidreptele fiind distincte):`,
      show(`${C2(k + 2)} - 1 = ${N}`),
      `Răspuns: ${de(N)} unghiuri proprii.`,
    ),
    verify: () => {
      let count = 0
      for (let i = 0; i <= k + 1; i++) for (let j = i + 1; j <= k + 1; j++) if (!(i === 0 && j === k + 1)) count++
      return count === N
    },
  }
}

/** a° − N': what kind of angle. p. 147, II.1. */
export function exprKind(rng: Rng): Made {
  const kind = pick(rng, [0, 1, 2, 3, 4])
  const v = [0, int(rng, 1, 89) * 60 + pick(rng, [0, int(rng, 1, 59)]), 5400, int(rng, 91, 179) * 60 + pick(rng, [0, int(rng, 1, 59)]), 10800][kind]
  const a = Math.ceil(v / 60) + int(rng, 1, 80)
  const N = 60 * a - v
  return {
    text: `Un unghi are măsura egală cu $${a}^\\circ - ${N}'$. Precizați dacă este nul, ascuțit, drept, obtuz sau alungit.`,
    solution: lines(
      show(`${a}^\\circ = ${a} \\cdot 60' = ${60 * a}', \\quad ${60 * a}' - ${N}' = ${v}' = ${dm(v)}`),
      v === 0 ? 'Măsura este $0^\\circ$, deci unghiul este nul.'
        : v === 5400 ? 'Măsura este $90^\\circ$, deci unghiul este drept.'
        : v === 10800 ? 'Măsura este $180^\\circ$, deci unghiul este alungit.'
        : v < 5400 ? `Cum $${dm(v)} < 90^\\circ$, unghiul este ascuțit.` : `Cum $90^\\circ < ${dm(v)} < 180^\\circ$, unghiul este obtuz.`,
    ),
    verify: () => N > 0 && 60 * a - N === v && kindOf(v) === ['nul', 'ascuțit', 'drept', 'obtuz', 'alungit'][kind],
  }
}

// ================= 5. calculations with measures of angles (pp. 129, 132–134, 143–148) =================

/** A measure in minutes that has both degrees and minutes. */
const withMinutes = (rng: Rng, lo: number, hi: number) => 60 * int(rng, lo, hi) + int(rng, 1, 59)

/** a°b' + c°d' and e°f' − g°h'. p. 132, ex. 3; p. 133, ex. 7. */
export function sexaAddSub(rng: Rng): Made {
  const x = withMinutes(rng, 10, 120)
  const y = withMinutes(rng, 10, 120)
  const p = withMinutes(rng, 60, 170)
  const q = withMinutes(rng, 5, Math.floor(p / 60) - 2)
  const carry = (x % 60) + (y % 60) >= 60
  const borrow = p % 60 < q % 60
  const rawSum = `${Math.floor(x / 60) + Math.floor(y / 60)}^\\circ ${(x % 60) + (y % 60)}'`
  const pTex = borrow ? `${Math.floor(p / 60) - 1}^\\circ ${(p % 60) + 60}'` : dm(p)
  return {
    text: `Efectuați calculele: a) $${dm(x)} + ${dm(y)}$; b) $${dm(p)} - ${dm(q)}$.`,
    solution: lines(
      `a) Adunăm gradele cu gradele și minutele cu minutele${carry ? ", apoi transformăm $60'$ în $1^\\circ$" : ''}:`,
      show(`${dm(x)} + ${dm(y)} = ${rawSum}${carry ? ` = ${dm(x + y)}` : ''}`),
      `b) ${borrow ? "Minutele descăzutului sunt mai puține, așa că transformăm un grad în $60'$:" : 'Scădem gradele din grade și minutele din minute:'}`,
      show(`${dm(p)} - ${dm(q)} = ${borrow ? `${pTex} - ${dm(q)} = ` : ''}${dm(p - q)}`),
    ),
    verify: () => (x + y) % 60 === ((x % 60) + (y % 60)) % 60 && p - q > 0 && Math.floor(p / 60) * 60 + (p % 60) - q === p - q,
  }
}

/** k·(a°b') and (c°d') : m, exactly. p. 132, ex. 3 g, h, k, l. */
export function sexaMulDiv(rng: Rng): Made {
  const k = int(rng, 2, 6)
  const x = withMinutes(rng, 5, Math.floor(170 / k))
  const m = int(rng, 2, 9)
  let r: number
  do r = withMinutes(rng, 3, Math.floor(179 / m)); while ((r * m) % 60 === 0)
  const D = r * m
  const [dd, dmin] = [Math.floor(D / 60), D % 60]
  const [qd, rd] = [Math.floor(dd / m), dd % m]
  return {
    text: `Efectuați calculele: a) $${k} \\cdot ${dm(x)}$; b) $${dm(D)} : ${m}$.`,
    solution: lines(
      'a) Înmulțim gradele și minutele, apoi transformăm minutele care trec de 60:',
      show(`${k} \\cdot ${dm(x)} = ${k * Math.floor(x / 60)}^\\circ ${k * (x % 60)}' = ${dm(k * x)}`),
      `b) Împărțim gradele: $${dd} : ${m} = ${qd}$ rest ${rd}.${rd ? ` Restul de $${rd}^\\circ = ${60 * rd}'$ se adaugă la minute: $${60 * rd}' + ${dmin}' = ${60 * rd + dmin}'$.` : ''} Apoi împărțim minutele: $${60 * rd + dmin} : ${m} = ${(60 * rd + dmin) / m}$.`,
      show(`${dm(D)} : ${m} = ${dm(r)}`),
    ),
    verify: () => (60 * rd + dmin) % m === 0 && 60 * qd + (60 * rd + dmin) / m === r && r * m === D,
  }
}

/** ∢A, ∢B known: p·∢A + q·∢B and ∢A − ∢B. p. 132, ex. 4. */
export function angleExpr(rng: Rng): Made {
  let a: number
  let b: number
  let p: number
  let q: number
  // the sum stays under a full turn, as on p. 132 (2·∢A + 3·∢B = 186°21')
  do {
    a = withMinutes(rng, 30, 100)
    b = withMinutes(rng, 10, Math.floor(a / 60) - 3)
    p = int(rng, 2, 4)
    q = int(rng, 2, 4)
  } while (p * a + q * b >= 21600)
  return {
    text: `Știind că $${A('A')} = ${dm(a)}$ și $${A('B')} = ${dm(b)}$, calculați: a) $${p} \\cdot ${A('A')} + ${q} \\cdot ${A('B')}$; b) $${A('A')} - ${A('B')}$.`,
    solution: lines(
      show(`\\text{a) } ${p} \\cdot ${dm(a)} = ${dm(p * a)}, \\quad ${q} \\cdot ${dm(b)} = ${dm(q * b)}`),
      show(`${dm(p * a)} + ${dm(q * b)} = ${dm(p * a + q * b)}`),
      show(`\\text{b) } ${dm(a)} - ${dm(b)} = ${dm(a - b)}`),
    ),
    verify: () => p * a + q * b - (a - b) === (p - 1) * a + (q + 1) * b && p * a + q * b < 21600,
  }
}

/** ∢AOB and ∢BOC share OB; OA inside or outside ∢COB: ∢AOC. p. 129, ex. 19. */
export function interiorExterior(rng: Rng): Made {
  const inside = rng() < 0.5
  let a: number
  let b: number
  for (;;) {
    a = 5 * int(rng, 4, 34)
    b = 5 * int(rng, 4, 34)
    if (inside ? a < b : a !== b) break
  }
  const sum = a + b
  const res = inside ? b - a : sum <= 180 ? sum : 360 - sum
  return {
    text: `Unghiurile $AOB$ și $BOC$ au același vârf și latura comună $OB$. Aflați măsura unghiului $AOC$, dacă $${A('AOB')} = ${a}^\\circ$, $${A('BOC')} = ${b}^\\circ$ și semidreapta $OA$ este ${inside ? 'interioară' : 'exterioară'} unghiului $COB$.`,
    solution: inside
      ? lines('Semidreapta $OA$ este în interiorul unghiului $COB$, deci $\\sphericalangle COA + \\sphericalangle AOB = \\sphericalangle COB$:', show(`${A('AOC')} = ${b}^\\circ - ${a}^\\circ = ${res}^\\circ`))
      : sum <= 180
        ? lines('Semidreapta $OA$ este exterioară unghiului $COB$, deci unghiurile $AOB$ și $BOC$ sunt adiacente:', show(`${A('AOC')} = ${a}^\\circ + ${b}^\\circ = ${res}^\\circ`))
        : lines(
            `Unghiurile $AOB$ și $BOC$ sunt adiacente, dar $${a}^\\circ + ${b}^\\circ = ${sum}^\\circ > 180^\\circ$. Unghiul $AOC$ este cel care completează această sumă până la $360^\\circ$:`,
            show(`${A('AOC')} = 360^\\circ - ${sum}^\\circ = ${res}^\\circ`),
          ),
    verify: () => res > 0 && res <= 180 && (inside ? a + res === b : res === Math.min(sum, 360 - sum)),
  }
}

/** O on AA', OB and OC on the same side: ∢A'OB, ∢A'OC, ∢COB. p. 133, ex. 10. */
export function supplementaryRays(rng: Rng): Made {
  const minutes = rng() < 0.5
  const a = minutes ? withMinutes(rng, 40, 170) : 60 * int(rng, 40, 170)
  const c = minutes ? withMinutes(rng, 10, Math.floor(a / 60) - 5) : 60 * int(rng, 10, a / 60 - 5)
  return {
    text: `Fie dreapta $AA'$ și punctul $O$ pe segmentul $AA'$. În același semiplan determinat de dreapta $AA'$ considerăm semidreptele $OB$ și $OC$, astfel încât $${A('AOB')} = ${dm(a)}$ și $${A('AOC')} = ${dm(c)}$. Calculați $${A("A'OB")}$, $${A("A'OC")}$ și $${A('COB')}$.`,
    solution: lines(
      `Unghiul $AOA'$ este alungit, deci are $180^\\circ${minutes ? " = 179^\\circ 60'" : ''}$:`,
      show(`${A("A'OB")} = 180^\\circ - ${dm(a)} = ${dm(10800 - a)}, \\quad ${A("A'OC")} = 180^\\circ - ${dm(c)} = ${dm(10800 - c)}`),
      'Semidreapta $OC$ este în interiorul unghiului $AOB$:',
      show(`${A('COB')} = ${dm(a)} - ${dm(c)} = ${dm(a - c)}`),
    ),
    verify: () => (10800 - c) - (10800 - a) === a - c && a - c > 0,
  }
}

/** ∢BAC and ∢BAD in different half-planes of AB: ∢DAC. p. 133, ex. 12. */
export function halfPlanesSum(rng: Rng): Made {
  const minutes = rng() < 0.6
  const x = minutes ? withMinutes(rng, 15, 150) : 60 * int(rng, 15, 150)
  const y = minutes ? withMinutes(rng, 15, 150) : 60 * int(rng, 15, 150)
  const s = x + y
  const res = s <= 10800 ? s : 21600 - s
  return {
    text: `Fie semidreapta $AB$. În semiplane diferite determinate de dreapta $AB$ se construiesc unghiurile $BAC$ și $BAD$. Calculați $${A('DAC')}$, dacă $${A('BAC')} = ${dm(x)}$ și $${A('BAD')} = ${dm(y)}$.`,
    solution: s <= 10800
      ? lines('Unghiurile $BAC$ și $BAD$ sunt adiacente, cu latura comună $AB$, iar suma lor nu depășește $180^\\circ$:', show(`${A('DAC')} = ${dm(x)} + ${dm(y)} = ${dm(s)}`))
      : lines(
          `Suma $${dm(x)} + ${dm(y)} = ${dm(s)}$ depășește $180^\\circ$, deci unghiul $DAC$ este cel care o completează până la $360^\\circ$ (în jurul lui $A$):`,
          show(`${A('DAC')} = 360^\\circ - ${dm(s)} = ${dm(res)}`),
        ),
    verify: () => res > 0 && res <= 10800 && res === Math.min(s, 21600 - s),
  }
}

/** p times an angle is d° less (more) than q times an angle of c°. p. 133, ex. 8. */
export function equationAngle(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 4)
    const q = int(rng, 2, 4)
    const c = int(rng, 15, 60)
    const d = int(rng, 5, 40)
    const less = rng() < 0.5
    const R = less ? q * c - d : q * c + d
    const x = (60 * R) / p
    if (R <= 0 || x >= 10800 || p === q) continue
    return {
      text: `De ${p} ori măsura unui unghi este cu $${d}^\\circ$ mai ${less ? 'mică' : 'mare'} decât de ${q} ori măsura unui unghi de $${c}^\\circ$. Care este măsura unghiului?`,
      solution: lines(
        `Notăm cu $x$ măsura unghiului:`,
        show(`${p} \\cdot x = ${q} \\cdot ${c}^\\circ ${less ? '-' : '+'} ${d}^\\circ = ${q * c}^\\circ ${less ? '-' : '+'} ${d}^\\circ = ${R}^\\circ`),
        show(`x = ${R}^\\circ : ${p} = ${dm(x)}`),
      ),
      verify: () => Number.isInteger(x) && p * x === 60 * (less ? q * c - d : q * c + d),
    }
  }
}

/** O on AB, ∢AOD = ∢DOC / p = ∢COB / q: the three angles. p. 134, ex. 17 a. */
export function ratioOnLine(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 9)
    const q = int(rng, 2, 9)
    const s = 1 + p + q
    if (10800 % s !== 0) continue
    const x = 10800 / s
    return {
      text: `Fie dreapta $AB$, punctul $O$ pe segmentul $AB$, iar $OC$ și $OD$ semidrepte în același semiplan determinat de dreapta $AB$, astfel încât $${A('AOD')} = \\frac{1}{${p}} \\cdot ${A('DOC')} = \\frac{1}{${q}} \\cdot ${A('COB')}$. Calculați măsurile unghiurilor $AOD$, $COB$ și $COD$.`,
      solution: lines(
        `Notăm $${A('AOD')} = x$; atunci $${A('DOC')} = ${p}x$ și $${A('COB')} = ${q}x$. Semidreptele sunt în ordinea $OA$, $OD$, $OC$, $OB$, iar unghiul $AOB$ este alungit:`,
        show(`x + ${p}x + ${q}x = 180^\\circ \\Rightarrow ${s}x = 180^\\circ \\Rightarrow x = ${dm(x)}`),
        show(`${A('AOD')} = ${dm(x)}, \\quad ${A('COD')} = ${p} \\cdot ${dm(x)} = ${dm(p * x)}, \\quad ${A('COB')} = ${q} \\cdot ${dm(x)} = ${dm(q * x)}`),
      ),
      verify: () => x + p * x + q * x === 10800,
    }
  }
}

/** OC, OD inside ∢AOB, ∢AOC = ∢BOD / k, ∢COD known: ∢AOC, ∢BOD. p. 134, ex. 18. */
export function insideRatio(rng: Rng): Made {
  for (;;) {
    const T = int(rng, 60, 175)
    const k = int(rng, 2, 4)
    const c = int(rng, 10, 120)
    if (T - c < 15) continue
    const x = (60 * (T - c)) / (k + 1)
    return {
      text: `Fie unghiul $AOB$ cu măsura de $${T}^\\circ$, iar $OC$ și $OD$ semidrepte în interiorul lui, în ordinea $OA$, $OC$, $OD$, $OB$, astfel încât $${A('AOC')} = \\frac{1}{${k}} \\cdot ${A('BOD')}$ și $${A('COD')} = ${c}^\\circ$. Calculați $${A('AOC')}$ și $${A('BOD')}$.`,
      solution: lines(
        `Notăm $${A('AOC')} = x$; atunci $${A('BOD')} = ${k}x$, iar`,
        show(`x + ${c}^\\circ + ${k}x = ${T}^\\circ \\Rightarrow ${k + 1}x = ${T - c}^\\circ \\Rightarrow x = ${dm(x)}`),
        show(`${A('AOC')} = ${dm(x)}, \\quad ${A('BOD')} = ${k} \\cdot ${dm(x)} = ${dm(k * x)}`),
      ),
      verify: () => Number.isInteger(x) && x + 60 * c + k * x === 60 * T,
    }
  }
}

/** C inside ∢AOB with ∢AOB = k·∢AOC: the other two angles from one of them. p. 148, IV. */
export function kTimesInterior(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 6)
    const x = rng() < 0.5 ? 60 * int(rng, 5, 60) : withMinutes(rng, 5, 60)
    if (k * x >= 10800) continue
    const given = pick(rng, ['AOC', 'AOB', 'BOC'])
    const val: Record<string, number> = { AOC: x, AOB: k * x, BOC: (k - 1) * x }
    const others = ['AOC', 'AOB', 'BOC'].filter((g) => g !== given)
    const steps =
      given === 'AOC'
        ? [show(`${A('AOB')} = ${k} \\cdot ${dm(x)} = ${dm(k * x)}, \\quad ${A('BOC')} = ${dm(k * x)} - ${dm(x)} = ${dm((k - 1) * x)}`)]
        : given === 'AOB'
          ? [show(`${A('AOC')} = ${dm(k * x)} : ${k} = ${dm(x)}, \\quad ${A('BOC')} = ${dm(k * x)} - ${dm(x)} = ${dm((k - 1) * x)}`)]
          : [
              `Rezultă $${A('BOC')} = ${A('AOB')} - ${A('AOC')} = ${k} \\cdot ${A('AOC')} - ${A('AOC')} = ${k - 1} \\cdot ${A('AOC')}$.`,
              show(`${A('AOC')} = ${dm((k - 1) * x)} : ${k - 1} = ${dm(x)}, \\quad ${A('AOB')} = ${k} \\cdot ${dm(x)} = ${dm(k * x)}`),
            ]
    return {
      text: `În interiorul unghiului $AOB$ se consideră un punct $C$, astfel încât $${A('AOB')} = ${k} \\cdot ${A('AOC')}$. Știind că $${A(given)} = ${dm(val[given])}$, aflați măsurile unghiurilor $${others[0]}$ și $${others[1]}$.`,
      solution: lines('Punctul $C$ este în interiorul unghiului $AOB$, deci $\\sphericalangle AOB = \\sphericalangle AOC + \\sphericalangle BOC$.', ...steps),
      verify: () => val.AOB === val.AOC + val.BOC && val.AOB === k * val.AOC && val.AOB < 10800,
    }
  }
}

// ================= 6. congruent figures and the axis of symmetry (pp. 137–139, 143–148) =================

/** The capital letters and their axes of symmetry (the usual sans-serif printing letters). */
const LETTER_AXES: Record<string, number> = {
  A: 1, B: 1, C: 1, D: 1, E: 1, H: 2, I: 2, M: 1, T: 1, U: 1, V: 1, W: 1, X: 2, Y: 1,
  F: 0, G: 0, J: 0, L: 0, N: 0, P: 0, R: 0, S: 0, Z: 0,
}
const VERTICAL = 'AMTUVWY'

/** Which letters have an axis of symmetry, and how many. p. 139, ex. 11. */
export function lettersAxes(rng: Rng): Made {
  const chosen = shuffle(rng, Object.keys(LETTER_AXES)).slice(0, int(rng, 5, 7)).sort()
  const one = chosen.filter((c) => LETTER_AXES[c] === 1)
  const two = chosen.filter((c) => LETTER_AXES[c] === 2)
  const none = chosen.filter((c) => LETTER_AXES[c] === 0)
  const v = one.filter((c) => VERTICAL.includes(c))
  const h = one.filter((c) => !VERTICAL.includes(c))
  return {
    text: `Care dintre literele ${list(chosen)}, scrise cu majuscule de tipar, admit axă de simetrie? Câte axe de simetrie are fiecare dintre ele?`,
    solution: lines(
      'O figură are axă de simetrie dacă, îndoind-o după acea dreaptă, cele două părți se suprapun.',
      v.length ? `Au o axă de simetrie verticală: ${list(v)}.` : '',
      h.length ? `Au o axă de simetrie orizontală: ${list(h)}.` : '',
      two.length ? `Au două axe de simetrie, una verticală și una orizontală: ${list(two)}.` : '',
      none.length ? `Nu au axă de simetrie: ${list(none)}.` : 'Toate literele date au axă de simetrie.',
    ).replace(/\n\n(\n\n)+/g, '\n\n'),
    verify: () => one.length + two.length + none.length === chosen.length && one.length === v.length + h.length,
  }
}

/** The axis of symmetry of an angle halves it, and the other way. p. 139, ex. 12. */
export function bisectorBasic(rng: Rng): Made {
  const a = 2 * int(rng, 600, 5370)
  const b = int(rng, 300, 5399)
  return {
    text: lines(
      'Semidreapta $OM$ este axa de simetrie a unghiului $AOB$.',
      `a) Dacă $${A('AOB')} = ${dm(a)}$, calculați măsurile unghiurilor $AOM$ și $BOM$.`,
      `b) Dacă $${A('AOM')} = ${dm(b)}$, calculați măsura unghiului $AOB$.`,
    ),
    solution: lines(
      'Axa de simetrie a unui unghi îl împarte în două unghiuri congruente: $\\sphericalangle AOM = \\sphericalangle BOM = \\sphericalangle AOB : 2$.',
      show(`\\text{a) } ${A('AOM')} = ${A('BOM')} = ${dm(a)} : 2 = ${dm(a / 2)}`),
      show(`\\text{b) } ${A('AOB')} = 2 \\cdot ${dm(b)} = ${dm(2 * b)}`),
    ),
    verify: () => (a / 2) * 2 === a && 2 * b < 10800,
  }
}

/** M, O, N collinear, A on OP, B the symmetric of A with respect to O: AB, ∢AON, ∢BON. p. 139, ex. 14. */
export function verticalSymmetric(rng: Rng): Made {
  let a: number
  do a = int(rng, 20, 160); while (a === 90)
  const r = int(rng, 5, 150)
  return {
    text: lines(
      `Se consideră punctele coliniare $M$, $O$ și $N$, în această ordine, și o semidreaptă $OP$, astfel încât $${A('MOP')} = ${a}^\\circ$. Pe semidreapta $OP$ se ia un punct $A$, astfel încât $OA = ${t10(r)}$ cm, iar $B$ este simetricul punctului $A$ față de punctul $O$.`,
      'a) Calculați lungimea segmentului $AB$.',
      `b) Calculați măsurile unghiurilor $AON$ și $BON$ și precizați dacă $${A('AOM')} \\equiv ${A('BON')}$.`,
    ),
    solution: lines(
      show(`\\text{a) } OB = OA = ${t10(r)} \\text{ cm}, \\quad AB = 2 \\cdot ${t10(r)} = ${t10(2 * r)} \\text{ cm}`),
      `b) Punctul $A$ este pe semidreapta $OP$, deci $${A('AOM')} = ${A('MOP')} = ${a}^\\circ$. Unghiul $MON$ este alungit:`,
      show(`${A('AON')} = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`),
      'Punctele $A$, $O$, $B$ sunt coliniare ($O$ este mijlocul lui $AB$), deci și unghiul $AOB$ este alungit:',
      show(`${A('BON')} = 180^\\circ - ${A('AON')} = 180^\\circ - ${180 - a}^\\circ = ${a}^\\circ`),
      `Așadar $${A('AOM')} = ${A('BON')} = ${a}^\\circ$, deci unghiurile sunt congruente.`,
    ),
    verify: () => 180 - (180 - a) === a && 2 * r === r + r,
  }
}

const PART_OF: [number, number, string][] = [[1, 3, '0{,}(3)'], [1, 2, '0{,}5'], [1, 4, '0{,}25'], [1, 5, '0{,}2'], [2, 3, '0{,}(6)'], [3, 4, '0{,}75']]

/** A, O, B in order with AO = 0,(3)·OB and AB known; AB the axis of ∢MON. p. 139, ex. 16. */
export function axisOnLine(rng: Rng): Made {
  const [num, den, f] = pick(rng, PART_OF)
  const L = (num + den) * int(rng, 1, 12)
  const ao = (num * L) / (num + den)
  const bo = L - ao
  const a = int(rng, 10, 85)
  return {
    text: lines(
      `Fie punctele coliniare $A$, $O$, $B$, în această ordine, astfel încât $AO = ${f} \\cdot OB$ și $AB = ${L}$ cm. Se știe că dreapta $AB$ este axa de simetrie a unghiului $MON$ și $${A('MOA')} = ${a}^\\circ$.`,
      'a) Calculați lungimile segmentelor $AO$ și $BO$.',
      'b) Calculați măsurile unghiurilor $MON$ și $MOB$.',
    ),
    solution: lines(
      `a) $${f} = \\frac{${num}}{${den}}$, deci $AO = \\frac{${num}}{${den}} \\cdot OB$. Dacă $OB$ are ${den} părți, $AO$ are ${num === 1 ? 'o parte' : `${num} părți`}, iar $AB = AO + OB$ are ${num + den} părți:`,
      show(`\\text{o parte} = ${L} : ${num + den} = ${L / (num + den)} \\text{ cm}, \\quad AO = ${ao} \\text{ cm}, \\quad BO = ${bo} \\text{ cm}`),
      `b) Semidreapta $OA$ este pe axa de simetrie, deci $${A('NOA')} = ${A('MOA')} = ${a}^\\circ$:`,
      show(`${A('MON')} = 2 \\cdot ${a}^\\circ = ${2 * a}^\\circ, \\quad ${A('MOB')} = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`),
    ),
    verify: () => ao * den === num * bo && ao + bo === L && 2 * a < 180,
  }
}

/** ∢AOB, its axis OM, P inside ∢AOM with ∢POM known: ∢POB and ∢AOP. p. 147, II.3. */
export function bisectorPoint(rng: Rng): Made {
  const a = 2 * int(rng, 20, 89)
  const b = int(rng, 2, a / 2 - 2)
  return {
    text: `Se consideră un unghi $AOB$ cu măsura de $${a}^\\circ$ și semidreapta $OM$, axa de simetrie a acestui unghi. În interiorul unghiului $AOM$ se consideră un punct $P$, astfel încât $${A('POM')} = ${b}^\\circ$. Calculați măsurile unghiurilor $POB$ și $AOP$.`,
    solution: lines(
      show(`${A('AOM')} = ${A('MOB')} = ${a}^\\circ : 2 = ${a / 2}^\\circ`),
      'Semidreapta $OM$ este în interiorul unghiului $POB$, iar $OP$ în interiorul unghiului $AOM$:',
      show(`${A('POB')} = ${b}^\\circ + ${a / 2}^\\circ = ${b + a / 2}^\\circ, \\quad ${A('AOP')} = ${a / 2}^\\circ - ${b}^\\circ = ${a / 2 - b}^\\circ`),
    ),
    verify: () => b + a / 2 + (a / 2 - b) === a && a / 2 - b > 0,
  }
}

/** A straight angle, ∢AOC, ∢COD = k·∢AOC, ∢BOE: ∢DOE and whether OD is the axis of ∢COE. p. 139, ex. 15. */
export function straightAxis(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 5)
    const axis = rng() < 0.5
    let a: number
    let b: number
    if (axis) {
      a = 5400 / (k + 1)
      b = a
    } else {
      a = 60 * int(rng, 5, 40)
      b = 60 * int(rng, 5, 40)
    }
    const cod = k * a
    const doe = 10800 - a - cod - b
    if (doe <= 0 || (!axis && doe === cod)) continue
    return {
      text: lines(
        `Se consideră unghiul alungit $AOB$ și semidreapta $OC$, astfel încât $${A('AOC')} = ${dm(a)}$. Fie punctele $D$ și $E$, de aceeași parte a dreptei $AB$ ca și punctul $C$, astfel încât $${A('COD')} = ${k} \\cdot ${A('AOC')}$, iar $${A('BOE')} = ${dm(b)}$, semidreptele fiind în ordinea $OA$, $OC$, $OD$, $OE$, $OB$.`,
        'a) Calculați măsurile unghiurilor $COD$ și $DOE$.',
        'b) Precizați dacă semidreapta $OD$ este axa de simetrie a unghiului $COE$.',
      ),
      solution: lines(
        show(`\\text{a) } ${A('COD')} = ${k} \\cdot ${dm(a)} = ${dm(cod)}`),
        'Unghiurile $AOC$, $COD$, $DOE$, $EOB$ formează împreună unghiul alungit $AOB$:',
        show(`${A('DOE')} = 180^\\circ - ${dm(a)} - ${dm(cod)} - ${dm(b)} = ${dm(doe)}`),
        axis
          ? `b) $${A('COD')} = ${A('DOE')} = ${dm(cod)}$, iar $OD$ este în interiorul unghiului $COE$, deci $OD$ este axa de simetrie a unghiului $COE$.`
          : `b) $${A('COD')} = ${dm(cod)} \\neq ${dm(doe)} = ${A('DOE')}$, deci $OD$ nu este axa de simetrie a unghiului $COE$.`,
      ),
      verify: () => a + cod + doe + b === 10800 && (doe === cod) === axis,
    }
  }
}

/** A, O, B collinear, ∢COD known, OE and OF the axes of ∢AOC and ∢BOD: ∢EOF. p. 147, II.4. */
export function bisectorsOnLine(rng: Rng): Made {
  const c = rng() < 0.5 ? 60 * int(rng, 20, 160) : 2 * int(rng, 600, 4800)
  const e = 5400 + c / 2
  return {
    text: `Punctele $A$, $O$, $B$ sunt coliniare, în această ordine, iar semidreptele $OC$ și $OD$ sunt în același semiplan determinat de dreapta $AB$, în ordinea $OA$, $OC$, $OD$, $OB$, cu $${A('COD')} = ${dm(c)}$. Dacă $OE$ este axa de simetrie a unghiului $AOC$, iar $OF$ este axa de simetrie a unghiului $BOD$, calculați măsura unghiului $EOF$.`,
    solution: lines(
      'Unghiul $AOB$ este alungit:',
      show(`${A('AOC')} + ${A('BOD')} = 180^\\circ - ${dm(c)} = ${dm(10800 - c)}`),
      'Axele de simetrie înjumătățesc unghiurile, deci:',
      show(`${A('EOC')} + ${A('DOF')} = ${dm(10800 - c)} : 2 = ${dm((10800 - c) / 2)}`),
      show(`${A('EOF')} = ${A('EOC')} + ${A('COD')} + ${A('DOF')} = ${dm((10800 - c) / 2)} + ${dm(c)} = ${dm(e)}`),
    ),
    verify: () => (10800 - c) / 2 + c === e && Number.isInteger(c / 2),
  }
}

/** ∢AOB obtuse, ∢AOC = 180° − ∢AOB, OD opposite to OA: ∢BOC and ∢BOD ≡ ∢AOC. p. 148, V. */
export function oppositeRayCongruent(rng: Rng): Made {
  const minutes = rng() < 0.5
  const a = minutes ? withMinutes(rng, 95, 170) : 60 * int(rng, 95, 170)
  const c = 10800 - a
  return {
    text: lines(
      `În interiorul unghiului $AOB$, cu măsura de $${dm(a)}$, se consideră un punct $C$, astfel încât $${A('AOC')} = ${dm(c)}$.`,
      'a) Calculați măsura unghiului $BOC$.',
      `b) Dacă $OD$ este semidreapta opusă semidreptei $OA$, arătați că $${A('BOD')} \\equiv ${A('AOC')}$.`,
    ),
    solution: lines(
      show(`\\text{a) } ${A('BOC')} = ${A('AOB')} - ${A('AOC')} = ${dm(a)} - ${dm(c)} = ${dm(a - c)}`),
      'b) Unghiul $AOD$ este alungit, iar $OB$ este în interiorul lui:',
      show(`${A('BOD')} = 180^\\circ - ${dm(a)} = ${dm(c)} = ${A('AOC')}`),
    ),
    verify: () => a - c > 0 && 10800 - a === c,
  }
}

// ================= contest: Supermate pages and the olympiad problem on p. 134 =================

/** ∢C₁OC₂ = d, ∢C₂OC₃ = 2d, …, ∢CₙOA = n·d, ∢C₁OA known: n. p. 134, ex. 20 (Olimpiada județeană Bihor, 2001). */
export function anglesOneToN(rng: Rng): Made {
  for (;;) {
    const d = pick(rng, [10, 12, 15, 20, 30, 60, 120, 180])
    const n = int(rng, 4, 40)
    const T = (d * n * (n + 1)) / 2
    if (T > 10800 || !Number.isInteger(T)) continue
    return {
      text: `În interiorul unghiului $C_1OA$ se consideră semidreptele $OC_2$, $OC_3$, $\\ldots$, $OC_n$, astfel încât $${A('C_1OC_2')} = ${dm(d)}$, $${A('C_2OC_3')} = 2 \\cdot ${dm(d)}$, $${A('C_3OC_4')} = 3 \\cdot ${dm(d)}$, $\\ldots$, $${A('C_nOA')} = n \\cdot ${dm(d)}$. Determinați $n \\in \\mathbb{N}$ pentru care $${A('C_1OA')} = ${dm(T)}$.`,
      solution: lines(
        'Unghiul $C_1OA$ este suma celor $n$ unghiuri alăturate:',
        show(`${dm(d)} \\cdot (1 + 2 + \\ldots + n) = ${dm(T)} \\Rightarrow 1 + 2 + \\ldots + n = ${T}' : ${d}' = ${T / d}`),
        show(`\\frac{n(n + 1)}{2} = ${T / d} \\Rightarrow n(n + 1) = ${(2 * T) / d} = ${n} \\cdot ${n + 1}`),
        `Deci $n = ${n}$.`,
      ),
      verify: () => {
        let s = 0
        for (let i = 1; i <= n; i++) s += i * d
        return s === T
      },
    }
  }
}

/** Aᵢ on a line with AᵢAᵢ₊₁ = i·d cm: two segments ApAq. p. 111, ex. 25.2. */
export function consecutiveGaps(rng: Rng): Made {
  const d = pick(rng, [1, 1, 2, 3])
  const pair = () => {
    const p = int(rng, 1, 25)
    return [p, p + int(rng, 3, 15)] as [number, number]
  }
  const [p1, q1] = pair()
  const [p2, q2] = pair()
  const len = (p: number, q: number) => (d * (q - p) * (p + q - 1)) / 2
  const step = (p: number, q: number) =>
    show(`A_{${p}}A_{${q}} = ${d === 1 ? `${p} + ${p + 1} + \\ldots + ${q - 1}` : `${d} \\cdot (${p} + ${p + 1} + \\ldots + ${q - 1})`} =${d === 1 ? '' : `${d} \\cdot `}\\frac{(${p} + ${q - 1}) \\cdot ${q - p}}{2} = ${len(p, q)} \\text{ cm}`)
  return {
    text: `Pe o dreaptă $d$ se consideră punctele $A_1$, $A_2$, $A_3$, $\\ldots$, în această ordine, astfel încât, pentru orice număr natural nenul $i$, $A_iA_{i+1} = ${d === 1 ? '' : `${d} \\cdot `}i$ cm. Calculați lungimile segmentelor $A_{${p1}}A_{${q1}}$ și $A_{${p2}}A_{${q2}}$.`,
    solution: lines(
      `Segmentul $A_pA_q$ (cu $p < q$) este format din segmentele $A_pA_{p+1}$, $\\ldots$, $A_{q-1}A_q$, cu lungimile ${d === 1 ? '$p$, $p + 1$, $\\ldots$, $q - 1$' : `$${d}p$, $${d}(p + 1)$, $\\ldots$, $${d}(q - 1)$`} cm. Suma a $q - p$ numere consecutive este (primul + ultimul) $\\cdot$ (câte sunt) $: 2$:`,
      step(p1, q1),
      step(p2, q2),
    ),
    verify: () => {
      const brute = (p: number, q: number) => {
        let s = 0
        for (let i = p; i < q; i++) s += d * i
        return s
      }
      return brute(p1, q1) === len(p1, q1) && brute(p2, q2) === len(p2, q2)
    },
  }
}

/** OMᵢ = i·x on a ray: MₐM_b, and the midpoint Q of MₙMₚ. p. 114, ex. 23; p. 117, V.2. */
export function pointsRayMidpoint(rng: Rng): Made {
  const x = int(rng, 1, 9)
  const a = int(rng, 1, 20)
  const b = a + int(rng, 1, 20)
  const n = int(rng, 1, 30)
  const p = n + int(rng, 1, 30)
  const xi = x === 1 ? 'i' : `${x}i`
  return {
    text: lines(
      `Punctele $M_1$, $M_2$, $M_3$, $\\ldots$ aparțin unei semidrepte cu originea în punctul $O$, iar pentru orice număr natural nenul $i$, $OM_i = ${xi}$ cm.`,
      `a) Calculați lungimea segmentului $M_{${a}}M_{${b}}$.`,
      `b) Dacă $Q$ este mijlocul segmentului $M_{${n}}M_{${p}}$, calculați lungimea segmentului $OQ$.`,
    ),
    solution: lines(
      `Cum $OM_1 < OM_2 < OM_3 < \\ldots$, punctele sunt pe semidreaptă în ordinea $O$, $M_1$, $M_2$, $M_3$, $\\ldots$`,
      show(`\\text{a) } M_{${a}}M_{${b}} = OM_{${b}} - OM_{${a}} = ${x * b} - ${x * a} = ${x * (b - a)} \\text{ cm}`),
      show(`\\text{b) } M_{${n}}M_{${p}} = ${x * p} - ${x * n} = ${x * (p - n)} \\text{ cm}, \\quad M_{${n}}Q = ${h2(x * (p - n))} \\text{ cm}`),
      show(`OQ = OM_{${n}} + M_{${n}}Q = ${x * n} + ${h2(x * (p - n))} = ${h2(x * (n + p))} \\text{ cm}`),
    ),
    verify: () => 2 * x * n + x * (p - n) === x * (n + p) && x * (b - a) > 0,
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-lines-through-points',
    label: 'Drepte determinate de puncte',
    topic: 'Geometrie',
    forms: {
      1: [linesNoThree, lineNames, raysSegmentsOnLine],
      2: [linesSomeCollinear, twoParallelLines, minMaxLines],
      3: [findNPoints, intersectionPoints, planeRegions],
    },
  },
  {
    id: 'v-segment-length',
    label: 'Lungimea unui segment',
    topic: 'Geometrie',
    forms: {
      1: [segDifference, odometerBridge, segPartsSum],
      2: [segTimesExceeds, segFourPoints, collinearOrder, segFromO],
      3: [segMixedOrder, segPeriodic, segOverlap],
    },
  },
  {
    id: 'v-midpoint-symmetric',
    label: 'Mijlocul unui segment, simetricul unui punct',
    topic: 'Geometrie',
    forms: {
      1: [midpointBasic, midpointOnRay, symmetricOnSegment],
      2: [midpointsReverse, halvingChain, symmetricChain, symmetricMQ],
      3: [midpointsAlign, midpointBD, midpointDiscussion, raysMidpointsCommon],
    },
  },
  {
    id: 'v-angle-measure',
    label: 'Măsura unui unghi, clasificarea unghiurilor',
    topic: 'Geometrie',
    forms: {
      1: [toMinutes, classifyAngles, countRaysAngles],
      2: [congruentCheck, kindFromN, exprKind],
      3: [raysFindN, straightWithRays, kindFromLinear],
    },
  },
  {
    id: 'v-angle-calc',
    label: 'Calcule cu măsuri de unghiuri',
    topic: 'Geometrie',
    forms: {
      1: [sexaAddSub, sexaMulDiv, angleExpr],
      2: [interiorExterior, supplementaryRays, halfPlanesSum, equationAngle],
      3: [ratioOnLine, insideRatio, kTimesInterior],
    },
  },
  {
    id: 'v-symmetry-axis',
    label: 'Axa de simetrie',
    topic: 'Geometrie',
    forms: {
      1: [lettersAxes, bisectorBasic],
      2: [verticalSymmetric, axisOnLine, bisectorPoint],
      3: [straightAxis, bisectorsOnLine, oppositeRayCongruent],
    },
  },
]

export const CONTEST: ContestKind[] = [
  { id: 'v-contest-lines-angles', label: 'Segmente și unghiuri (concurs)', forms: [anglesOneToN, consecutiveGaps, pointsRayMidpoint] },
]
