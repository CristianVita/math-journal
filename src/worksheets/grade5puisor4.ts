// Grade V forms from the second grade V workbook (the one "cu puișorul"), pp. 90–116, photographed by the user on
// 14 November 2026: units of length and perimeters (5.8, pp. 90–92), units of area (5.9, pp. 92–94), units of volume
// and capacity (5.10, pp. 95–96), the chapter tests (p. 97), school contests (5.11, p. 98), the final recapitulation and
// its tests (6.1–6.2, pp. 99–106) and the "Fișă pentru portofoliu" sheets 1–10 (pp. 107–116).
// The chapter 5.7 (the axis of symmetry) ends on p. 90 with drawings only; it began before these photos.
// The levels follow the stars of the sections (* = 1, ** = 2, *** = 3); the tests and the sheets by their content.
// Almost every form extends an existing kind (`joins`); the problems of 5.11 make a contest kind.
// Every form names its page and exercise.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
export interface GradeKind {
  /** 'v-…', unique */
  id: string
  /** Romanian, shown in the interface (ignored when the kind joins another) */
  label: string
  topic: 'Algebră' | 'Geometrie'
  /** an existing kind that receives these forms */
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
const P10 = (k: number) => 10 ** k
const same = (x: number, y: number) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b

/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** n / 10^k with the Romanian comma: D(235, 2) = 2{,}35; the zeros at the end are dropped. */
function D(n: number, k: number): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  const part = k > 0 ? s.slice(s.length - k).replace(/0+$/, '') : ''
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - k))) + (part ? `{,}${part}` : '')
}
/** p/q > 0 as a mixed number: 1\frac{1}{2}, 3, \frac{3}{4}. */
function mixed(p: number, q: number): string {
  const [n, d] = reduce(p, q)
  if (d === 1) return String(n)
  const w = Math.floor(n / d)
  return (w ? String(w) : '') + `\\frac{${n % d}}{${d}}`
}

/** An exact decimal quantity: n / 10^k. */
interface Q { n: number; k: number }
function norm(n: number, k = 0): Q {
  if (k < 0) {
    n *= P10(-k)
    k = 0
  }
  while (k > 0 && n % 10 === 0) {
    n /= 10
    k--
  }
  return { n, k }
}
const T = (x: Q) => D(x.n, x.k)
const V = (x: Q) => x.n / P10(x.k)

/** A unit: how it is written, its power of 10 in the smallest unit (mm, mm², mm³, ml), its name in the plural. */
interface Unit { tex: string; e: number; name: string }
const LEN = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km']
const LNAME = ['milimetri', 'centimetri', 'decimetri', 'metri', 'decametri', 'hectometri', 'kilometri']
const LU: Unit[] = LEN.map((s, i) => ({ tex: `\\text{ ${s}}`, e: i, name: LNAME[i] }))
const CAP = ['ml', 'cl', 'dl', 'l', 'dal', 'hl', 'kl']
const CNAME = ['mililitri', 'centilitri', 'decilitri', 'litri', 'decalitri', 'hectolitri', 'kilolitri']
const CU: Unit[] = CAP.map((s, i) => ({ tex: `\\text{ ${s}}`, e: i, name: CNAME[i] }))
const [MM, CM, DM, M, DAM, HM] = LU
const [, , , , DAL, HL, KL] = CU

/** x, given in the unit a, in the unit b. */
const conv = (x: Q, a: Unit, b: Unit) => norm(x.n, x.k - (a.e - b.e))
/** x in a, in the smallest unit: to check a conversion without `conv`. */
const base = (x: Q, a: Unit) => V(x) * P10(a.e)
const fac = (d: number) => (d <= 6 ? nr(P10(d)) : `10^{${d}}`)
/** "2,5 m = 2,5 · 100 cm = 250 cm" */
function convTex(x: Q, a: Unit, b: Unit): string {
  const d = a.e - b.e
  const r = conv(x, a, b)
  if (d === 0) return `${T(x)}${a.tex} = ${T(r)}${b.tex}`
  return `${T(x)}${a.tex} = ${T(x)} ${d > 0 ? '\\cdot' : ':'} ${fac(Math.abs(d))}${b.tex} = ${T(r)}${b.tex}`
}
const m = (x: Q, u: Unit) => `$${T(x)}${u.tex}$`
const q0 = (n: number) => norm(n)

const TIMESW: Record<number, string> = { 2: 'de două ori', 3: 'de trei ori', 4: 'de patru ori', 5: 'de cinci ori', 6: 'de șase ori' }

// ======================= units of length, perimeters (5.8, pp. 90–92) =======================

/** The perimeter of a rhombus (square) from its decimal side, and the side of another from its perimeter, p. 90, ex. 4, 6 a, c and 7. */
export function p4RhombusSides(rng: Rng): Made {
  for (;;) {
    const fig = pick(rng, ['romb', 'pătrat'] as const)
    const u = pick(rng, [CM, DM, M])
    const u2 = pick(rng, [CM, DM, M, MM])
    if (u2 === u) continue
    const s1 = norm(int(rng, 12, 999), pick(rng, [1, 2]))
    const s2 = norm(int(rng, 11, 499), pick(rng, [1, 2]))
    if (s1.k === 0 || s2.k === 0) continue
    const P1 = norm(4 * s1.n, s1.k)
    const P2 = norm(4 * s2.n, s2.k)
    const other = fig === 'romb' ? 'pătratului' : 'rombului'
    return {
      text: lines(
        `a) Calculați perimetrul unui ${fig} cu latura de ${m(s1, u)}.`,
        `b) Aflați latura ${other} care are perimetrul de ${m(P2, u2)}.`,
      ),
      solution: lines(
        `a) ${fig === 'romb' ? 'Rombul' : 'Pătratul'} are toate cele patru laturi egale, deci perimetrul este de 4 ori latura:`,
        show(`\\mathcal{P} = 4 \\cdot ${T(s1)}${u.tex} = ${T(P1)}${u.tex}`),
        `b) Și ${fig === 'romb' ? 'pătratul' : 'rombul'} are patru laturi egale, deci latura este a patra parte din perimetru:`,
        show(`\\ell = ${T(P2)} : 4 = ${T(s2)}${u2.tex}`),
      ),
      verify: () => same(V(P1), 4 * V(s1)) && same(4 * V(s2), V(P2)),
    }
  }
}

/** The width of a rectangle from its length and its perimeter given in other units, p. 90, ex. 5. */
export function p4RectWidthFromPerimeter(rng: Rng): Made {
  for (;;) {
    const Lmm = int(rng, 25, 900) * pick(rng, [1, 10])
    const lmm = int(rng, 10, Lmm - 5)
    const P = 2 * (Lmm + lmm)
    const uL = pick(rng, [CM, DM, M, DAM])
    const uP = pick(rng, [MM, CM, DM, M])
    if (uL === uP) continue
    const xL = conv(q0(Lmm), MM, uL)
    const xP = conv(q0(P), MM, uP)
    if (xL.k > 4 || xP.k > 4) continue
    const lc = conv(q0(lmm), MM, CM)
    return {
      text: `Aflați lățimea $l$ a unui dreptunghi, în centimetri, dacă lungimea lui este $L = ${T(xL)}${uL.tex}$, iar perimetrul este $\\mathcal{P} = ${T(xP)}${uP.tex}$.`,
      solution: lines(
        'Exprimăm lungimea și perimetrul în milimetri:',
        show(convTex(xL, uL, MM)),
        uP === MM ? '' : show(convTex(xP, uP, MM)),
        'Lungimea și lățimea împreună fac jumătate din perimetru:',
        show(`L + l = ${nr(P)} : 2 = ${nr(P / 2)}\\text{ mm}`),
        show(`l = ${nr(P / 2)} - ${nr(Lmm)} = ${nr(lmm)}\\text{ mm} = ${T(lc)}\\text{ cm}`),
      ),
      verify: () => same(2 * (base(xL, uL) + base(lc, CM)), base(xP, uP)),
    }
  }
}

/** A parallelogram (a trapezoid) with sides given as decimals, mixed numbers and fractions: the perimeter, p. 90, ex. 6 b, d. */
export function p4MixedSidesPerimeter(rng: Rng): Made {
  for (;;) {
    if (rng() < 0.5) {
      const a10 = int(rng, 11, 99)
      if (a10 % 10 === 0) continue
      const d = pick(rng, [2, 4, 5])
      const w = int(rng, 1, 5)
      const n = int(rng, 1, d - 1)
      if (gcd(n, d) !== 1) continue
      const b100 = ((w * d + n) * 100) / d
      const P100 = 2 * (a10 * 10 + b100)
      return {
        text: `Aflați perimetrul unui paralelogram cu laturile de $${D(a10, 1)}\\text{ cm}$ și $${mixed(w * d + n, d)}\\text{ cm}$.`,
        solution: lines(
          'Scriem a doua latură ca fracție zecimală:',
          show(`${mixed(w * d + n, d)} = ${w} + ${frac(n, d)} = ${D(b100, 2)}\\text{ cm}`),
          'Paralelogramul are laturile opuse egale, deci:',
          show(`\\mathcal{P} = 2 \\cdot (${D(a10, 1)} + ${D(b100, 2)}) = 2 \\cdot ${D(a10 * 10 + b100, 2)} = ${D(P100, 2)}\\text{ cm}`),
        ),
        verify: () => same(P100 / 100, 2 * (a10 / 10 + w + n / d)),
      }
    }
    const d1 = pick(rng, [2, 3, 4, 5])
    const w1 = int(rng, 1, 4)
    const n1 = int(rng, 1, d1 - 1)
    const q = pick(rng, [2, 3, 4, 5, 6, 8])
    const p = int(rng, 1, 2 * q)
    const c = w1 + int(rng, 1, 3)
    if (gcd(n1, d1) !== 1 || gcd(p, q) !== 1 || p === q || q === d1) continue
    const b1 = w1 + n1 / d1
    if (Math.abs(c - b1) >= (2 * p) / q) continue
    const den = lcm(d1, q)
    const A = ((w1 * d1 + n1) * den) / d1
    const B = c * den
    const C = (p * den) / q
    const tot = A + B + 2 * C
    const [rn, rd] = reduce(tot, den)
    return {
      text: `Aflați perimetrul unui trapez isoscel cu bazele de $${mixed(w1 * d1 + n1, d1)}\\text{ cm}$ și $${c}\\text{ cm}$ și cu laturile neparalele de câte $${frac(p, q)}\\text{ cm}$.`,
      solution: lines(
        `Adunăm cele patru laturi, aducând fracțiile la numitorul comun ${den}:`,
        show(`\\mathcal{P} = ${mixed(w1 * d1 + n1, d1)} + ${c} + ${frac(p, q)} + ${frac(p, q)} = \\frac{${A}}{${den}} + \\frac{${B}}{${den}} + \\frac{${C}}{${den}} + \\frac{${C}}{${den}} = \\frac{${tot}}{${den}}${rd !== den ? ` = ${frac(rn, rd)}` : ''}`),
        rd === 1 ? `Perimetrul este de $${rn}\\text{ cm}$.` : `Perimetrul este de $${mixed(rn, rd)}\\text{ cm}$.`,
      ),
      verify: () => same(rn / rd, b1 + c + (2 * p) / q),
    }
  }
}

/** The perimeter of a triangle with the sides given by relations, in mixed units, p. 91, ex. 13 c, d, e. */
export function p4TriangleRelations(rng: Rng): Made {
  for (;;) {
    const v = int(rng, 1, 3)
    let a: number, b: number, c: number, rel: string, steps: string[]
    const uA = pick(rng, [CM, DM, M])
    const uD = pick(rng, [MM, CM, DM])
    if (v === 1) {
      const k = pick(rng, [2, 3])
      a = int(rng, 4, 40)
      const d = int(rng, 1, a - 1)
      b = k * a
      c = b - d
      const xd = conv(q0(d), CM, uD)
      rel = `latura $b$ este ${TIMESW[k]} mai mare decât $a$, iar $c$ este cu ${m(xd, uD)} mai mică decât $b$`
      steps = [show(`b = ${k} \\cdot ${a} = ${b}\\text{ cm}`), uD === CM ? '' : show(convTex(xd, uD, CM)), show(`c = ${b} - ${d} = ${c}\\text{ cm}`)]
    } else if (v === 2) {
      const k = pick(rng, [2, 3])
      const t = int(rng, 3, 30)
      const d = int(rng, (k - 2) * t + 1, k * t - 1)
      a = k * t
      b = t
      c = t + d
      const xd = conv(q0(d), CM, uD)
      rel = `latura $b$ este ${TIMESW[k]} mai mică decât $a$, iar $c$ este cu ${m(xd, uD)} mai mare decât $b$`
      steps = [show(`b = ${a} : ${k} = ${b}\\text{ cm}`), uD === CM ? '' : show(convTex(xd, uD, CM)), show(`c = ${b} + ${d} = ${c}\\text{ cm}`)]
    } else {
      const [p, q] = pick(rng, [[2, 3], [3, 4], [7, 9], [4, 5], [5, 6], [3, 5], [5, 8]] as [number, number][])
      const s = int(rng, 1, 12)
      if (((p + q) * s) % 2) continue
      a = q * s
      b = p * s
      c = (a + b) / 2
      rel = `$b = ${frac(p, q)}$ din $a$, iar $c = ${frac(1, 2)}$ din suma primelor două`
      steps = [show(`b = ${frac(p, q)} \\cdot ${a} = ${b}\\text{ cm}`), show(`c = (${a} + ${b}) : 2 = ${c}\\text{ cm}`)]
    }
    if (a < 3 || a + b <= c || a + c <= b || b + c <= a) continue
    const xa = conv(q0(a), CM, uA)
    if (xa.k > 2) continue
    const t = pick(rng, [MM, CM, DM, M])
    const P = a + b + c
    const Pt = conv(q0(P), CM, t)
    return {
      text: `Calculați perimetrul unui triunghi cu laturile $a$, $b$, $c$ (rezultatul în ${t.name}), dacă $a = ${T(xa)}${uA.tex}$, ${rel}.`,
      solution: lines(
        'Lucrăm în centimetri:',
        uA === CM ? '' : show(convTex(xa, uA, CM)),
        ...steps,
        show(`\\mathcal{P} = ${a} + ${b} + ${c} = ${P}\\text{ cm}${t === CM ? '' : ` = ${T(Pt)}${t.tex}`}`),
      ),
      verify: () => same(base(Pt, t), 10 * (a + b + c)) && same(base(xa, uA), 10 * a),
    }
  }
}

const PART: Record<string, string> = { '1/2': 'jumătate din lungime', '1/3': 'o treime din lungime', '1/4': 'un sfert din lungime' }

/** A rectangular garden with the width a part of the length, closed with several rows of wire: the wire, p. 92, ex. 19. */
export function p4FenceRows(rng: Rng): Made {
  for (;;) {
    const [p, q] = pick(rng, [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [2, 5], [3, 5]] as [number, number][])
    const L = q * int(rng, 4, 60)
    const l = (p * L) / q
    const r = int(rng, 2, 6)
    const half = L + l
    const W = r * 2 * half
    const relText = PART[`${p}/${q}`] ?? `$${frac(p, q)}$ din lungime`
    return {
      text: `O grădină în formă de dreptunghi are lungimea de $${L}\\text{ m}$, iar lățimea ei este ${relText}. Grădina este înconjurată cu un gard format din ${r} rânduri de sârmă. Câți metri de sârmă are gardul?`,
      solution: lines(
        show(`l = ${frac(p, q)} \\cdot ${L} = ${l}\\text{ m}`),
        show(`\\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${2 * half}\\text{ m}`),
        `Fiecare rând de sârmă are lungimea perimetrului, deci:`,
        show(`${r} \\cdot ${2 * half} = ${nr(W)}\\text{ m}`),
      ),
      verify: () => W === r * 2 * (L + (L * p) / q),
    }
  }
}

/** The wire of a fence with several rows and the length k times the width: the dimensions, p. 92, ex. 21. */
export function p4FenceRowsBack(rng: Rng): Made {
  const k = int(rng, 2, 6)
  const l = int(rng, 5, 60)
  const r = int(rng, 2, 5)
  const P = 2 * (k + 1) * l
  const W = r * P
  return {
    text: `O curte de formă dreptunghiulară este împrejmuită cu un gard format din ${r} rânduri de sârmă care măsoară în total $${nr(W)}\\text{ m}$. Să se afle dimensiunile curții, știind că lungimea este ${TIMESW[k]} mai mare decât lățimea.`,
    solution: lines(
      'Un rând de sârmă are lungimea perimetrului:',
      show(`\\mathcal{P} = ${nr(W)} : ${r} = ${P}\\text{ m}, \\qquad L + l = ${P} : 2 = ${P / 2}\\text{ m}`),
      `Lungimea are ${k} părți cât lățimea, deci împreună au ${k + 1} părți egale:`,
      show(`l = ${P / 2} : ${k + 1} = ${l}\\text{ m}, \\qquad L = ${k} \\cdot ${l} = ${k * l}\\text{ m}`),
    ),
    verify: () => r * 2 * (k * l + l) === W,
  }
}

/** A route in four stages, in km, hm and dam: the fourth stage, p. 92, ex. 23. */
export function p4TripStages(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 20, 90)
    const b = int(rng, 15, 900)
    const c = int(rng, 10, 80)
    const s1 = 10 * a
    const s2 = s1 + b
    const s3 = s1 + s2 - 10 * c
    const s4 = int(rng, 50, 1500)
    if (s3 <= 0 || b % 10 === 0) continue
    const tot = s1 + s2 + s3 + s4
    const Tdam = 10 * tot
    return {
      text: `Un autocar a parcurs un drum în patru etape. În prima etapă a parcurs $${a}\\text{ km}$, în a doua cu $${nr(b)}\\text{ hm}$ mai mult, iar în a treia cu $${c}\\text{ km}$ mai puțin decât în primele două etape împreună. Câți kilometri a parcurs în a patra etapă, dacă lungimea drumului, exprimată în decametri, este $${nr(Tdam)}$?`,
      solution: lines(
        'Lucrăm în kilometri:',
        show(`${nr(b)}\\text{ hm} = ${D(b, 1)}\\text{ km}, \\qquad ${nr(Tdam)}\\text{ dam} = ${D(Tdam, 2)}\\text{ km}`),
        show(`\\text{etapa 2: } ${a} + ${D(b, 1)} = ${D(s2, 1)}\\text{ km}`),
        show(`\\text{etapa 3: } ${a} + ${D(s2, 1)} - ${c} = ${D(s3, 1)}\\text{ km}`),
        show(`\\text{etapa 4: } ${D(tot, 1)} - (${a} + ${D(s2, 1)} + ${D(s3, 1)}) = ${D(tot, 1)} - ${D(s1 + s2 + s3, 1)} = ${D(s4, 1)}\\text{ km}`),
      ),
      verify: () => same(Tdam / 100 - a - (a + b / 10) - (2 * a + b / 10 - c), s4 / 10),
    }
  }
}

/** Cloth brought to a factory, used on two days (the second a fraction of the first): what is left, in metres, p. 92, ex. 24. */
export function p4FabricLeft(rng: Rng): Made {
  for (;;) {
    const [p, q] = pick(rng, [[4, 5], [2, 3], [3, 4], [3, 5], [5, 6], [1, 2]] as [number, number][])
    const A = int(rng, 300, 2500)
    const w = int(rng, 100, 1500)
    const B = q * w
    const B2 = p * w
    const left = 10 * A - B - B2
    if (left <= 0 || left < A) continue
    return {
      text: `La o fabrică de confecții s-au adus ${de(A)} metri de stofă. În prima zi s-au folosit $${nr(B)}\\text{ dm}$, iar în a doua zi $${frac(p, q)}$ din cât s-a folosit în prima zi. Aflați câți metri de stofă au rămas neutilizați.`,
      solution: lines(
        'Lucrăm în decimetri:',
        show(`${nr(A)}\\text{ m} = ${nr(10 * A)}\\text{ dm}`),
        show(`\\text{a doua zi: } ${frac(p, q)} \\cdot ${nr(B)} = ${nr(B2)}\\text{ dm}`),
        show(`${nr(10 * A)} - ${nr(B)} - ${nr(B2)} = ${nr(left)}\\text{ dm} = ${D(left, 1)}\\text{ m}`),
      ),
      verify: () => same(A - B / 10 - ((B / 10) * p) / q, left / 10),
    }
  }
}

/** The sides of a triangle from its perimeter, two sides being fractions of the second (or the third half of the sum of the first two), p. 91, ex. 16, p. 92, ex. 27, 28. */
export function p4TriangleFractions(rng: Rng): Made {
  const FR: [number, number][] = [[1, 2], [2, 3], [3, 4], [3, 2], [4, 3], [5, 4], [4, 5], [7, 5], [5, 6], [3, 5]]
  for (;;) {
    const u = pick(rng, [M, CM, DAM, DM])
    const [p1, q1] = pick(rng, FR)
    if (rng() < 0.5) {
      const [p2, q2] = pick(rng, FR)
      if (p1 * q2 === p2 * q1) continue
      const Lp = lcm(q1, q2)
      const t = int(rng, 1, 12)
      const b = Lp * t
      const a = (p1 * b) / q1
      const c = (p2 * b) / q2
      if (a + b <= c || a + c <= b || b + c <= a) continue
      const P = a + b + c
      const parts = [(p1 * Lp) / q1, Lp, (p2 * Lp) / q2]
      const N = parts[0] + parts[1] + parts[2]
      return {
        text: `Să se afle laturile unui triunghi, știind că perimetrul lui este de $${P}${u.tex}$, prima latură este $${frac(p1, q1)}$ din a doua, iar a treia latură este $${frac(p2, q2)}$ din a doua.`,
        solution: lines(
          `Împărțim a doua latură în ${Lp} părți egale. Atunci prima latură are ${parts[0]} astfel de părți, iar a treia ${parts[2]}; în total sunt $${parts[0]} + ${parts[1]} + ${parts[2]} = ${N}$ părți. O parte are:`,
          show(`${P} : ${N} = ${t}${u.tex}`),
          show(`a = ${parts[0]} \\cdot ${t} = ${a}${u.tex}, \\quad b = ${Lp} \\cdot ${t} = ${b}${u.tex}, \\quad c = ${parts[2]} \\cdot ${t} = ${c}${u.tex}`),
        ),
        verify: () => a + b + c === P && a * q1 === p1 * b && c * q2 === p2 * b,
      }
    }
    const t = int(rng, 1, 10)
    const k = (p1 + q1) % 2 ? 2 : 1
    const b = q1 * k * t
    const a = p1 * k * t
    const c = (a + b) / 2
    if (a + b <= c || a + c <= b || b + c <= a) continue
    const P = a + b + c
    const pa = p1 * k
    const pb = q1 * k
    const pc = (pa + pb) / 2
    const N = pa + pb + pc
    return {
      text: `Aflați laturile unui triunghi în care prima latură este $${frac(p1, q1)}$ din a doua latură, a treia este jumătate din suma primelor două, iar perimetrul este de $${P}${u.tex}$.`,
      solution: lines(
        `Împărțim a doua latură în ${pb} părți egale; prima are ${pa} părți, iar a treia $(${pa} + ${pb}) : 2 = ${pc}$ părți. În total:`,
        show(`${pa} + ${pb} + ${pc} = ${N}, \\qquad ${P} : ${N} = ${t}${u.tex}`),
        show(`a = ${pa} \\cdot ${t} = ${a}${u.tex}, \\quad b = ${pb} \\cdot ${t} = ${b}${u.tex}, \\quad c = ${pc} \\cdot ${t} = ${c}${u.tex}`),
      ),
      verify: () => a + b + c === P && a * q1 === p1 * b && 2 * c === a + b,
    }
  }
}

/** The sides of a triangle from its perimeter in m and two differences in dm and hm, p. 92, ex. 25. */
export function p4TriangleDiffUnits(rng: Rng): Made {
  for (;;) {
    const d1 = int(rng, 5, 90)
    const d2 = 10 * int(rng, 1, 9)
    const a = int(rng, d2 + 1, 400)
    const P = 3 * a + 2 * d1 + d2
    if (P % 10 === 0 && rng() < 0.5) continue
    const x2 = conv(q0(d2), DM, HM)
    const xP = conv(q0(P), DM, M)
    return {
      text: `Să se afle laturile unui triunghi care are perimetrul de ${m(xP, M)}, știind că a doua latură este cu $${d1}\\text{ dm}$ mai mare decât prima, iar a treia latură este cu ${m(x2, HM)} mai mare decât a doua.`,
      solution: lines(
        'Lucrăm în decimetri:',
        show(`${convTex(xP, M, DM)}, \\qquad ${convTex(x2, HM, DM)}`),
        `Dacă prima latură este $a$, a doua este $a + ${d1}$, iar a treia $a + ${d1} + ${d2} = a + ${d1 + d2}$. Atunci:`,
        show(`3 \\cdot a = ${nr(P)} - ${d1} - ${d1 + d2} = ${nr(3 * a)}, \\qquad a = ${a}\\text{ dm}`),
        show(`a = ${D(a, 1)}\\text{ m}, \\quad b = ${D(a + d1, 1)}\\text{ m}, \\quad c = ${D(a + d1 + d2, 1)}\\text{ m}`),
      ),
      verify: () => same(base(xP, M), 100 * (a + a + d1 + a + d1 + d2)) && same(base(x2, HM), 100 * d2),
    }
  }
}

/** A fence built around a rectangle at a given distance: its length, p. 92, ex. 20. */
export function p4FenceOffset(rng: Rng): Made {
  for (;;) {
    const [p, q] = pick(rng, [[3, 7], [2, 3], [3, 5], [4, 7], [2, 5], [5, 8], [3, 4]] as [number, number][])
    const L = q * int(rng, 3, 30)
    const l = (p * L) / q
    const e = pick(rng, [1, 1, 2, 3])
    if (L > 200) continue
    const F = 2 * (L + 2 * e + l + 2 * e)
    return {
      text: `Un teren are formă dreptunghiulară, cu lungimea de $${L}\\text{ m}$, iar lățimea reprezintă $${frac(p, q)}$ din lungime. Care este lungimea gardului care se construiește în jurul terenului, la ${e === 1 ? 'un metru' : `${e} metri`} distanță de marginea lui?`,
      solution: lines(
        show(`l = ${frac(p, q)} \\cdot ${L} = ${l}\\text{ m}`),
        `Gardul formează un dreptunghi mai mare: fiecare latură crește cu câte ${e === 1 ? 'un metru' : `${e} metri`} la ambele capete.`,
        show(`${L} + 2 \\cdot ${e} = ${L + 2 * e}\\text{ m}, \\qquad ${l} + 2 \\cdot ${e} = ${l + 2 * e}\\text{ m}`),
        show(`2 \\cdot (${L + 2 * e} + ${l + 2 * e}) = ${F}\\text{ m}`),
      ),
      verify: () => F === 2 * (L + l) + 8 * e,
    }
  }
}

// ======================= units of area (5.9, pp. 92–94) =======================

/** A rectangle from its decimal area and width: the length and the perimeter, p. 93, ex. 8. */
export function p4RectFromAreaWidth(rng: Rng): Made {
  for (;;) {
    const w10 = int(rng, 15, 250)
    const L10 = int(rng, w10 + 5, 600)
    if (w10 % 10 === 0 && L10 % 10 === 0) continue
    const A100 = L10 * w10
    const P10x = 2 * (L10 + w10)
    return {
      text: `Un teren în formă de dreptunghi are aria de $${D(A100, 2)}\\text{ m}^2$, iar lățimea lui este de $${D(w10, 1)}\\text{ m}$. Să se afle lungimea și perimetrul terenului.`,
      solution: lines(
        'Aria dreptunghiului este $L \\cdot l$, deci lungimea este câtul dintre arie și lățime:',
        show(`L = ${D(A100, 2)} : ${D(w10, 1)} = ${D(L10, 1)}\\text{ m}`),
        show(`\\mathcal{P} = 2 \\cdot (${D(L10, 1)} + ${D(w10, 1)}) = ${D(P10x, 1)}\\text{ m}`),
      ),
      verify: () => same((L10 / 10) * (w10 / 10), A100 / 100),
    }
  }
}

/** The area of a rectangle with its sides in dam and mm, in m² and in ari, p. 93, ex. 7. */
export function p4RectAreaUnits(rng: Rng): Made {
  for (;;) {
    const Ld = int(rng, 30, 999)
    const ld = int(rng, 10, Ld - 1)
    if (Ld % 100 === 0) continue
    const xL = conv(q0(Ld), DM, DAM)
    const xl = conv(q0(ld), DM, MM)
    const A = Ld * ld
    return {
      text: `Să se afle aria, în $\\text{m}^2$ și în ari, a unui teren în formă de dreptunghi cu dimensiunile de ${m(xL, DAM)} și ${m(xl, MM)}.`,
      solution: lines(
        'Exprimăm dimensiunile în metri:',
        show(convTex(xL, DAM, M)),
        show(convTex(xl, MM, M)),
        show(`\\mathcal{A} = ${D(Ld, 1)} \\cdot ${D(ld, 1)} = ${D(A, 2)}\\text{ m}^2`),
        'Un ar are $100\\text{ m}^2$, deci:',
        show(`${D(A, 2)}\\text{ m}^2 = ${D(A, 2)} : 100\\text{ ari} = ${D(A, 4)}\\text{ ari}`),
      ),
      verify: () => same((base(xL, DAM) / 1000) * (base(xl, MM) / 1000), A / 100),
    }
  }
}

/** Which rectangles have the same area as a given square (equivalent surfaces), p. 93, ex. 11. */
export function p4EquivalentSurfaces(rng: Rng): Made {
  for (;;) {
    const s = pick(rng, [6, 8, 10, 12, 14, 15, 16, 18, 20, 24, 30])
    const A = s * s
    const pairs: [number, number][] = []
    for (let l = 2; l < s; l++) if (A % l === 0 && A / l <= 150) pairs.push([A / l, l])
    if (pairs.length < 2) continue
    const good = shuffle(rng, pairs).slice(0, int(rng, 2, Math.min(3, pairs.length)))
    const bad: [number, number][] = []
    for (let tries = 0; bad.length < 5 - good.length && tries < 50; tries++) {
      const [L0, l0] = pick(rng, pairs)
      const cand: [number, number] = rng() < 0.5 ? [L0 + pick(rng, [-2, -1, 1, 2]), l0] : [L0, l0 + pick(rng, [-1, 1])]
      if (cand[1] < 1 || cand[0] <= cand[1] || cand[0] * cand[1] === A) continue
      if (bad.some((b) => b[0] === cand[0] && b[1] === cand[1])) continue
      bad.push(cand)
    }
    if (bad.length < 5 - good.length) continue
    const all = shuffle(rng, [...good.map((g) => ({ r: g, ok: true })), ...bad.map((b) => ({ r: b, ok: false }))])
    const letters = 'abcde'
    const answer = all.map((x, i) => (x.ok ? letters[i] : '')).filter(Boolean)
    return {
      text: `Precizați care dintre următoarele dreptunghiuri au aceeași arie cu pătratul cu latura de $${s}\\text{ cm}$ (reprezintă suprafețe echivalente cu el): ${all.map((x, i) => `${letters[i]}) $L = ${x.r[0]}\\text{ cm}$, $l = ${x.r[1]}\\text{ cm}$`).join('; ')}.`,
      solution: lines(
        `Aria pătratului este $${s} \\cdot ${s} = ${A}\\text{ cm}^2$. Ariile dreptunghiurilor:`,
        ...all.map((x, i) => `${letters[i]}) $${x.r[0]} \\cdot ${x.r[1]} = ${x.r[0] * x.r[1]}\\text{ cm}^2$${x.ok ? ' (aceeași arie)' : ''}`),
        `Sunt echivalente cu pătratul dreptunghiurile ${answer.map((a) => `${a})`).join(', ')}.`,
      ),
      verify: () => all.every((x, i) => (x.r[0] * x.r[1] === A) === answer.includes(letters[i])) && answer.length >= 2,
    }
  }
}

/** The length divided by the width gives a quotient and a remainder, and the perimeter is known: sides and area, p. 93, ex. 13. */
export function p4RectQuotientPerimeter(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 4, 40)
    const q = int(rng, 2, 6)
    const r = int(rng, 1, l - 1)
    const L = q * l + r
    const P = 2 * (L + l)
    if (P > 600) continue
    return {
      text: `Să se afle laturile și aria unui dreptunghi, dacă știm că lungimea împărțită la lățime dă câtul ${q} și restul ${r}, iar perimetrul este de $${P}\\text{ m}$.`,
      solution: lines(
        `Din teorema împărțirii cu rest, $L = ${q} \\cdot l + ${r}$. Semiperimetrul este:`,
        show(`L + l = ${P} : 2 = ${P / 2}\\text{ m}`),
        show(`${q} \\cdot l + ${r} + l = ${P / 2} \\Rightarrow ${q + 1} \\cdot l = ${P / 2 - r} \\Rightarrow l = ${l}\\text{ m}`),
        show(`L = ${q} \\cdot ${l} + ${r} = ${L}\\text{ m}, \\qquad \\mathcal{A} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ m}^2`),
      ),
      verify: () => Math.floor(L / l) === q && L % l === r && 2 * (L + l) === P,
    }
  }
}

/** The length k times the width and the area known: the sides and the perimeter, p. 93, ex. 14. */
export function p4RectRatioArea(rng: Rng): Made {
  const k = int(rng, 2, 6)
  const l = int(rng, 2, 25)
  const L = k * l
  const A = L * l
  const rel = rng() < 0.5 ? `lungimea este ${TIMESW[k]} mai mare decât lățimea` : `lățimea este ${TIMESW[k]} mai mică decât lungimea`
  return {
    text: `Să se afle laturile și perimetrul unui dreptunghi, știind că ${rel}, iar aria este de $${A}\\text{ m}^2$.`,
    solution: lines(
      `Dreptunghiul se împarte în ${k} pătrate egale, cu latura egală cu lățimea, deci:`,
      show(`l \\cdot l = ${A} : ${k} = ${l * l} \\Rightarrow l = ${l}\\text{ m}`),
      show(`L = ${k} \\cdot ${l} = ${L}\\text{ m}, \\qquad \\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ m}`),
    ),
    verify: () => L * l === A && L === k * l,
  }
}

/** A field: p/q of it wheat, r/s of the rest corn: the uncultivated area, p. 93, ex. 15 and p. 94, ex. 23. */
export function p4CropRest(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 10, 120)
    const d = int(rng, 1, 15) * 10
    const L = l + d / 10
    const A = L * l
    const [p, q] = pick(rng, [[5, 6], [1, 3], [2, 3], [3, 4], [1, 2], [3, 5], [2, 5]] as [number, number][])
    const [r, s] = pick(rng, [[5, 16], [1, 2], [1, 3], [2, 5], [3, 4], [3, 8], [1, 4]] as [number, number][])
    if ((A * p) % q) continue
    const w = (A * p) / q
    const rest = A - w
    if ((rest * r) % s) continue
    const c = (rest * r) / s
    const left = rest - c
    if (left <= 0) continue
    return {
      text: `Un teren în formă de dreptunghi are lățimea $l = ${l}\\text{ m}$, iar lungimea cu $${d}\\text{ dm}$ mai mare. Pe $${frac(p, q)}$ din suprafața lui se cultivă grâu, iar pe $${frac(r, s)}$ din rest, porumb. Ce arie a rămas necultivată?`,
      solution: lines(
        show(`${d}\\text{ dm} = ${d / 10}\\text{ m}, \\qquad L = ${l} + ${d / 10} = ${L}\\text{ m}`),
        show(`\\mathcal{A} = ${L} \\cdot ${l} = ${nr(A)}\\text{ m}^2`),
        `Grâu: $${frac(p, q)} \\cdot ${nr(A)} = ${nr(w)}\\text{ m}^2$; rămân $${nr(A)} - ${nr(w)} = ${nr(rest)}\\text{ m}^2$.`,
        `Porumb: $${frac(r, s)} \\cdot ${nr(rest)} = ${nr(c)}\\text{ m}^2$.`,
        `Necultivat: $${nr(rest)} - ${nr(c)} = ${nr(left)}\\text{ m}^2$.`,
      ),
      verify: () => same(A * (1 - p / q) * (1 - r / s), left),
    }
  }
}

/** A garden from its perimeter and width; the harvest at a given yield per area, p. 94, ex. 25. */
export function p4HarvestPerimeter(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 3, 30)
    const L = int(rng, l + 1, 60)
    const P = 2 * (L + l)
    const A = L * l
    const a = pick(rng, [5, 10, 12, 15, 20, 25, 4, 6, 8])
    if (A % a) continue
    const kg = int(rng, 15, 150)
    const veg = pick(rng, ['varză', 'cartofi', 'roșii', 'ceapă', 'morcovi'])
    const tot = (A / a) * kg
    return {
      text: `O grădină dreptunghiulară cu perimetrul de $${P}\\text{ m}$ și lățimea de $${l}\\text{ m}$ este cultivată cu ${veg}. Dacă de pe $${a}\\text{ m}^2$ se strâng $${kg}\\text{ kg}$ de ${veg}, ce cantitate se va strânge din toată grădina?`,
      solution: lines(
        show(`L + l = ${P} : 2 = ${P / 2}\\text{ m}, \\qquad L = ${P / 2} - ${l} = ${L}\\text{ m}`),
        show(`\\mathcal{A} = ${L} \\cdot ${l} = ${A}\\text{ m}^2`),
        show(`${A} : ${a} = ${A / a}, \\qquad ${A / a} \\cdot ${kg} = ${nr(tot)}\\text{ kg}`),
      ),
      verify: () => tot * a === kg * L * l && 2 * (L + l) === P,
    }
  }
}

/** Doubling the width (or multiplying the length) increases the area by X: the perimeter and the area, p. 93, ex. 16 a, b. */
export function p4DoubleWidth(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 4, 30)
    const l = int(rng, 2, 25)
    if (l >= L) continue
    if (rng() < 0.5) {
      const X = L * l
      return {
        text: `Lungimea unui dreptunghi este de $${L}\\text{ m}$. Să se afle perimetrul și aria dreptunghiului, dacă, atunci când dublăm lățimea, aria crește cu $${X}\\text{ m}^2$.`,
        solution: lines(
          'Dublând lățimea, aria se dublează; deci creșterea este chiar aria dreptunghiului:',
          show(`\\mathcal{A} = ${X}\\text{ m}^2, \\qquad l = ${X} : ${L} = ${l}\\text{ m}`),
          show(`\\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ m}`),
        ),
        verify: () => L * 2 * l - L * l === X,
      }
    }
    const k = int(rng, 2, 6)
    const X = (k - 1) * L * l
    return {
      text: `Lățimea unui dreptunghi este de $${l}\\text{ cm}$. Să se afle perimetrul și aria dreptunghiului, dacă, atunci când înmulțim lungimea cu ${k}, aria crește cu $${X}\\text{ cm}^2$.`,
      solution: lines(
        `Înmulțind lungimea cu ${k}, aria devine de ${k} ori mai mare, deci crește cu ${k - 1} arii ale dreptunghiului:`,
        show(`\\mathcal{A} = ${X} : ${k - 1} = ${L * l}\\text{ cm}^2, \\qquad L = ${L * l} : ${l} = ${L}\\text{ cm}`),
        show(`\\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ cm}`),
      ),
      verify: () => k * L * l - L * l === X,
    }
  }
}

/** Parquet for three rooms, sold in packets: how many packets and the cost, p. 94, ex. 19. */
export function p4Parquet(rng: Rng): Made {
  for (;;) {
    const rooms = [0, 1, 2].map(() => [int(rng, 3, 7), int(rng, 2, 6)] as [number, number])
    if (rooms.some(([a, b]) => b > a)) continue
    const A = rooms.reduce((s, [a, b]) => s + a * b, 0)
    const pk10 = pick(rng, [9, 12, 15, 18, 24, 25, 8])
    const n = Math.ceil((10 * A) / pk10)
    const price = int(rng, 30, 95)
    const exact = (10 * A) % pk10 === 0
    return {
      text: `Pardoseala celor trei camere ale unui apartament se acoperă cu parchet. Camerele au dimensiunile: $L_1 = ${rooms[0][0]}\\text{ m}$ și $l_1 = ${rooms[0][1]}\\text{ m}$, $L_2 = ${rooms[1][0]}\\text{ m}$ și $l_2 = ${rooms[1][1]}\\text{ m}$, $L_3 = ${rooms[2][0]}\\text{ m}$ și $l_3 = ${rooms[2][1]}\\text{ m}$. a) Câte pachete de parchet sunt necesare, dacă un pachet acoperă $${D(pk10, 1)}\\text{ m}^2$? b) Cât costă parchetul, dacă un pachet se vinde cu ${de(price)} lei?`,
      solution: lines(
        show(`\\mathcal{A} = ${rooms.map(([a, b]) => `${a} \\cdot ${b}`).join(' + ')} = ${rooms.map(([a, b]) => a * b).join(' + ')} = ${A}\\text{ m}^2`),
        exact
          ? `a) $${A} : ${D(pk10, 1)} = ${n}$, deci sunt necesare ${de(n)} pachete.`
          : `a) $${A} : ${D(pk10, 1)}$ nu este număr natural: ${de(n - 1)} pachete acoperă doar $${D((n - 1) * pk10, 1)}\\text{ m}^2$, deci sunt necesare ${de(n)} pachete.`,
        `b) $${n} \\cdot ${price} = ${nr(n * price)}$ lei.`,
      ),
      verify: () => n * pk10 >= 10 * A && (n - 1) * pk10 < 10 * A,
    }
  }
}

/** The walls of a room to be painted, without a door and a window, p. 94, ex. 18. */
export function p4PaintRoom(rng: Rng): Made {
  for (;;) {
    const L10 = int(rng, 30, 70)
    const l10 = int(rng, 25, L10)
    const h10 = int(rng, 25, 32)
    const du = [int(rng, 19, 22), int(rng, 8, 12)]
    const fe = [int(rng, 10, 25), int(rng, 10, 18)]
    const walls = 2 * (L10 + l10) * h10
    const res = walls - du[0] * du[1] - fe[0] * fe[1]
    if (res <= 0) continue
    return {
      text: `O cameră are dimensiunile $L = ${D(L10, 1)}\\text{ m}$, $l = ${D(l10, 1)}\\text{ m}$, iar înălțimea de $${D(h10, 1)}\\text{ m}$. Pe un perete este o ușă cu dimensiunile de $${D(du[0], 1)}\\text{ m}$ și $${D(du[1], 1)}\\text{ m}$, iar pe alt perete o fereastră cu dimensiunile de $${D(fe[0], 1)}\\text{ m}$ și $${D(fe[1], 1)}\\text{ m}$. Să se calculeze aria pereților care urmează a se zugrăvi (fără tavan).`,
      solution: lines(
        'Cei patru pereți formează, desfășurați, un dreptunghi cu lungimea egală cu perimetrul podelei și lățimea egală cu înălțimea:',
        show(`2 \\cdot (${D(L10, 1)} + ${D(l10, 1)}) \\cdot ${D(h10, 1)} = ${D(2 * (L10 + l10), 1)} \\cdot ${D(h10, 1)} = ${D(walls, 2)}\\text{ m}^2`),
        `Ușa are $${D(du[0], 1)} \\cdot ${D(du[1], 1)} = ${D(du[0] * du[1], 2)}\\text{ m}^2$, iar fereastra $${D(fe[0], 1)} \\cdot ${D(fe[1], 1)} = ${D(fe[0] * fe[1], 2)}\\text{ m}^2$. Le scădem:`,
        show(`${D(walls, 2)} - ${D(du[0] * du[1], 2)} - ${D(fe[0] * fe[1], 2)} = ${D(res, 2)}\\text{ m}^2`),
      ),
      verify: () => same(2 * (L10 / 10) * (h10 / 10) + 2 * (l10 / 10) * (h10 / 10) - (du[0] * du[1] + fe[0] * fe[1]) / 100, res / 100),
    }
  }
}

/** A square and a rectangle with the same perimeter; the rectangle split so that 1/m of one crop equals 1/n of the other, p. 94, ex. 17. */
export function p4SamePerimeterCrops(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 6, 40)
    const l = int(rng, 2, a - 1)
    const L = 2 * a - l
    const A = L * l
    const mm = int(rng, 2, 6)
    const n = int(rng, 2, 7)
    if (mm === n || A % (mm + n)) continue
    const W = (A / (mm + n)) * mm
    const C = (A / (mm + n)) * n
    return {
      text: `Un pătrat cu latura de $${a}\\text{ m}$ și un dreptunghi cu lățimea de $${l}\\text{ m}$ au același perimetru. Suprafața dreptunghiului este cultivată cu grâu și porumb. Dacă ${mm === 4 ? 'un sfert' : `$${frac(1, mm)}$`} din lotul de grâu este egal cu ${n === 5 ? 'o cincime' : `$${frac(1, n)}$`} din lotul cu porumb, aflați aria cultivată cu grâu și pe cea cultivată cu porumb.`,
      solution: lines(
        show(`\\mathcal{P} = 4 \\cdot ${a} = ${4 * a}\\text{ m}, \\qquad L = ${2 * a} - ${l} = ${L}\\text{ m}, \\qquad \\mathcal{A} = ${L} \\cdot ${l} = ${A}\\text{ m}^2`),
        `O parte egală este $${frac(1, mm)}$ din grâu și $${frac(1, n)}$ din porumb, deci grâul are ${mm} părți, iar porumbul ${n} părți:`,
        show(`${A} : ${mm + n} = ${A / (mm + n)}\\text{ m}^2`),
        `Grâu: $${mm} \\cdot ${A / (mm + n)} = ${W}\\text{ m}^2$; porumb: $${n} \\cdot ${A / (mm + n)} = ${C}\\text{ m}^2$.`,
      ),
      verify: () => W + C === L * l && W * n === C * mm && 2 * (L + l) === 4 * a,
    }
  }
}

// ======================= units of volume and capacity (5.10, pp. 95–96) =======================

/** A cube from the area of a face: the edge, the total area, the volume, p. 95, ex. 3 and 10. */
export function p4CubeFaceArea(rng: Rng): Made {
  const a = int(rng, 3, 150)
  const A = a * a
  const u = pick(rng, [CM, DM, M])
  return {
    text: `Să se afle latura, aria totală și volumul unui cub care are aria unei fețe de $${D(A, 2)}${u.tex}^2$.`,
    solution: lines(
      'O față a cubului este un pătrat cu latura egală cu muchia cubului:',
      show(`a \\cdot a = ${D(A, 2)} \\Rightarrow a = ${D(a, 1)}${u.tex}`),
      show(`\\mathcal{A}_t = 6 \\cdot ${D(A, 2)} = ${D(6 * A, 2)}${u.tex}^2`),
      show(`\\mathcal{V} = ${D(a, 1)} \\cdot ${D(a, 1)} \\cdot ${D(a, 1)} = ${D(A * a, 3)}${u.tex}^3`),
    ),
    verify: () => same((a / 10) ** 3, (A * a) / 1000) && same((a / 10) ** 2, A / 100),
  }
}

/** The litres in a cuboid whose width is a percent of the length and the height a fraction of the width, p. 96, ex. 15 d. */
export function p4LitresPercent(rng: Rng): Made {
  for (;;) {
    const L = 5 * int(rng, 4, 40)
    const pct = pick(rng, [20, 25, 40, 50, 60, 75, 80])
    if ((L * pct) % 100) continue
    const l = (L * pct) / 100
    const [p, q] = pick(rng, [[2, 5], [1, 2], [3, 4], [3, 5], [4, 5], [2, 3], [1, 3]] as [number, number][])
    if ((l * p) % q) continue
    const h = (l * p) / q
    const Vc = L * l * h
    return {
      text: `Aflați câți litri de apă pot încăpea într-un paralelipiped dreptunghic cu $L = ${L}\\text{ cm}$, $l = ${pct}\\%$ din $L$ și $h = ${frac(p, q)}$ din $l$.`,
      solution: lines(
        show(`l = \\frac{${pct}}{100} \\cdot ${L} = ${l}\\text{ cm}, \\qquad h = ${frac(p, q)} \\cdot ${l} = ${h}\\text{ cm}`),
        show(`\\mathcal{V} = ${L} \\cdot ${l} \\cdot ${h} = ${nr(Vc)}\\text{ cm}^3`),
        'Deoarece $1\\text{ l} = 1\\text{ dm}^3 = 1000\\text{ cm}^3$:',
        show(`${nr(Vc)}\\text{ cm}^3 = ${D(Vc, 3)}\\text{ dm}^3 = ${D(Vc, 3)}\\text{ l}`),
      ),
      verify: () => same(L * ((L * pct) / 100) * ((((L * pct) / 100) * p) / q), Vc),
    }
  }
}

/** Litres of a liquid in small bottles, the bottles packed in boxes, p. 96, ex. 24. */
export function p4BottlesBoxes(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, [20, 25, 30, 40, 50, 75, 100, 125, 150, 200, 250])
    const Aml = 100 * int(rng, 10, 300)
    if (Aml % b) continue
    const n = Aml / b
    const c = pick(rng, [6, 8, 10, 12, 20, 24, 25])
    const boxes = Math.ceil(n / c)
    const what = pick(rng, ['esență de rom', 'sirop', 'parfum', 'ulei de măsline', 'esență de vanilie'])
    return {
      text: `Câte sticluțe de câte $${b}\\text{ ml}$ se pot umple din $${D(Aml, 3)}\\text{ l}$ de ${what}? Câte cutii sunt necesare pentru ambalarea lor, dacă într-o cutie se pun ${de(c)} sticluțe?`,
      solution: lines(
        show(`${D(Aml, 3)}\\text{ l} = ${D(Aml, 3)} \\cdot 1000\\text{ ml} = ${nr(Aml)}\\text{ ml}`),
        `Se umplu $${nr(Aml)} : ${b} = ${n}$ sticluțe.`,
        n % c === 0
          ? `$${n} : ${c} = ${boxes}$, deci sunt necesare ${de(boxes)} cutii.`
          : `$${n} = ${c} \\cdot ${Math.floor(n / c)} + ${n % c}$: cele ${n % c} sticluțe rămase au nevoie de încă o cutie, deci sunt necesare ${de(boxes)} cutii.`,
      ),
      verify: () => n * b === Aml && boxes * c >= n && (boxes - 1) * c < n,
    }
  }
}

/** A cube-shaped pool filled by a tap: how many hours, p. 96, ex. 22. */
export function p4PoolTap(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6)
    const Vl = a * a * a * 1000
    const H = int(rng, 2, 30)
    if (Vl % (60 * H)) continue
    const d = Vl / (60 * H)
    if (d < 5 || d > 500) continue
    return {
      text: `Un bazin în formă de cub cu latura de $${a}\\text{ m}$ este umplut printr-un robinet cu debitul de ${de(d)} litri pe minut. În câte ore se umple bazinul?`,
      solution: lines(
        show(`\\mathcal{V} = ${a} \\cdot ${a} \\cdot ${a} = ${a ** 3}\\text{ m}^3 = ${nr(Vl)}\\text{ dm}^3 = ${nr(Vl)}\\text{ l}`),
        show(`${nr(Vl)} : ${d} = ${nr(60 * H)} \\text{ minute} = ${nr(60 * H)} : 60 \\text{ ore} = ${H} \\text{ ore}`),
      ),
      verify: () => H * 60 * d === a ** 3 * 1000,
    }
  }
}

/** The water of a cube poured into a cuboid: does it fit, and up to what height, p. 96, ex. 23 and 16. */
export function p4CubeIntoCuboid(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 8, 30)
    const L = int(rng, 10, 40)
    const d = int(rng, 1, 10)
    const l = L - d
    if (l < 5 || l % 2) continue
    const h = l / 2
    const Vc = a ** 3
    const Vb = L * l * h
    const fits = Vc <= Vb
    if (fits !== rng() < 0.6) continue
    const base2 = L * l
    if (fits && (100 * Vc) % base2) continue
    const lvl10 = fits ? (100 * Vc) / base2 : 0
    return {
      text: `Apa dintr-un vas plin, în formă de cub cu muchia de $${a}\\text{ cm}$, este vărsată într-un alt vas, în formă de paralelipiped dreptunghic, cu lungimea $L = ${nr(10 * L)}\\text{ mm}$, lățimea cu $${D(d, 1)}\\text{ dm}$ mai mică decât $L$ și înălțimea de 2 ori mai mică decât lățimea. Ce capacitate are cubul? Încape apa în paralelipiped?${fits ? ' Până la ce înălțime se ridică?' : ''}`,
      solution: lines(
        show(`\\mathcal{V}_{\\text{cub}} = ${a}^3 = ${nr(Vc)}\\text{ cm}^3 = ${D(Vc, 3)}\\text{ l}`),
        show(`L = ${nr(10 * L)}\\text{ mm} = ${L}\\text{ cm}, \\quad l = ${L} - ${d} = ${l}\\text{ cm}, \\quad h = ${l} : 2 = ${h}\\text{ cm}`),
        show(`\\mathcal{V}_{\\text{paralelipiped}} = ${L} \\cdot ${l} \\cdot ${h} = ${nr(Vb)}\\text{ cm}^3`),
        fits
          ? `Cum $${nr(Vc)} \\le ${nr(Vb)}$, apa încape. Ea acoperă baza de $${L} \\cdot ${l} = ${nr(base2)}\\text{ cm}^2$ până la înălțimea $${nr(Vc)} : ${nr(base2)} = ${D(lvl10, 2)}\\text{ cm}$.`
          : `Cum $${nr(Vc)} > ${nr(Vb)}$, apa nu încape: se varsă $${nr(Vc - Vb)}\\text{ cm}^3$.`,
      ),
      verify: () => (fits ? same(base2 * (lvl10 / 100), Vc) && lvl10 <= 100 * h : Vc > Vb),
    }
  }
}

/** Canisters (cisterns) of a capacity emptied into barrels (tanks) of another unit: how many, p. 96, ex. 25 and p. 115, ex. 5. */
export function p4BarrelsFromCanisters(rng: Rng): Made {
  for (;;) {
    const kind = pick(rng, [
      { big: 'canistre', u: HL, small: 'butoaie', v: DAL, what: 'ulei' },
      { big: 'cisterne', u: KL, small: 'rezervoare', v: DAL, what: 'benzină' },
      { big: 'cisterne', u: KL, small: 'butoaie', v: HL, what: 'apă' },
    ])
    const n = int(rng, 2, 30)
    const c = int(rng, 2, 25)
    const d = int(rng, 2, 60)
    const totV = n * c * P10(kind.u.e - kind.v.e)
    if (totV % d) continue
    const cnt = totV / d
    if (cnt > 5000) continue
    return {
      text: `${de(n)} ${kind.big} conțin câte $${c}${kind.u.tex}$ de ${kind.what}. Întreaga cantitate se pune în ${kind.small} de câte $${d}${kind.v.tex}$. Câte ${kind.small} sunt necesare?`,
      solution: lines(
        show(`${n} \\cdot ${c} = ${n * c}${kind.u.tex} = ${nr(totV)}${kind.v.tex}`),
        show(`${nr(totV)} : ${d} = ${nr(cnt)}`),
        `Sunt necesare ${de(cnt)} ${kind.small}.`,
      ),
      verify: () => cnt * d * P10(kind.v.e) === n * c * P10(kind.u.e),
    }
  }
}

/** Two syrups bottled in bottles of dl and of ml: how many bottles in all, p. 96, ex. 27. */
export function p4TwoBottleSizes(rng: Rng): Made {
  for (;;) {
    const A = 2 * int(rng, 5, 60)
    const k = pick(rng, [2, 2, 4])
    if (A % k) continue
    const B = A / k
    const b = pick(rng, [2, 4, 5])
    const e = pick(rng, [200, 250, 500, 125])
    if ((A * 10) % b || (B * 1000) % e) continue
    const n1 = (A * 10) / b
    const n2 = (B * 1000) / e
    return {
      text: `Într-un bidon sunt ${de(A)} litri de sirop de vișine, iar în altul o cantitate ${TIMESW[k]} mai mică de sirop de căpșuni. Siropul de vișine s-a turnat în sticle de $${b}\\text{ dl}$, iar cel de căpșuni în sticle de $${e}\\text{ ml}$. Câte sticle s-au folosit în total?`,
      solution: lines(
        `Sirop de căpșuni: $${A} : ${k} = ${B}\\text{ l}$.`,
        show(`${A}\\text{ l} = ${nr(A * 10)}\\text{ dl}, \\qquad ${nr(A * 10)} : ${b} = ${n1} \\text{ sticle}`),
        show(`${B}\\text{ l} = ${nr(B * 1000)}\\text{ ml}, \\qquad ${nr(B * 1000)} : ${e} = ${n2} \\text{ sticle}`),
        show(`${n1} + ${n2} = ${n1 + n2} \\text{ sticle}`),
      ),
      verify: () => n1 * b * 100 === A * 1000 && n2 * e === B * 1000,
    }
  }
}

/** Three taps fill a pool in t hours; the first gives half of the second and three times the third: the flow of each, p. 96, ex. 28. */
export function p4ThreeTaps(rng: Rng): Made {
  for (;;) {
    const mm = int(rng, 2, 3)
    const n = int(rng, 2, 4)
    const u = int(rng, 2, 25)
    const t = int(rng, 4, 15)
    const r3 = u
    const r1 = n * u
    const r2 = mm * n * u
    const per = r1 + r2 + r3
    const C = per * t
    if (C % 10) continue
    const word = (k: number) => (k === 2 ? 'de două ori' : k === 3 ? 'de trei ori' : 'de patru ori')
    return {
      text: `Un bazin de înot cu capacitatea de $${D(C, 1)}\\text{ kl}$ se umple cu apă în ${t} ore, folosind trei robinete deschise împreună. Primul robinet are debitul ${word(mm)} mai mic decât al doilea și ${word(n)} mai mare decât al treilea. Aflați debitul fiecărui robinet, în hectolitri pe oră.`,
      solution: lines(
        show(`${D(C, 1)}\\text{ kl} = ${nr(C)}\\text{ hl}, \\qquad ${nr(C)} : ${t} = ${per}\\text{ hl}`),
        `Într-o oră cele trei robinete dau împreună ${de(per)} hectolitri. Dacă al treilea dă o parte, primul dă ${n} părți, iar al doilea $${mm} \\cdot ${n} = ${mm * n}$ părți; în total $${1 + n + mm * n}$ părți.`,
        show(`${per} : ${1 + n + mm * n} = ${u}\\text{ hl}`),
        `Debitele sunt: primul $${r1}\\text{ hl}$ pe oră, al doilea $${r2}\\text{ hl}$ pe oră, al treilea $${r3}\\text{ hl}$ pe oră.`,
      ),
      verify: () => (r1 + r2 + r3) * t === C && r2 === mm * r1 && r1 === n * r3,
    }
  }
}

/** Identical cubes dropped in a cuboid with water raise the level from h₁ to h₂: the edge of a cube, p. 96, ex. 18. */
export function p4SubmergedCubes(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 15)
    const k = int(rng, 2, 5)
    const pct = pick(rng, [200, 150, 300, 250])
    const l = int(rng, 4, 40)
    if ((l * pct) % 100) continue
    const L = (l * pct) / 100
    const vol = k * a ** 3
    if (vol % (L * l)) continue
    const dh = vol / (L * l)
    const h1 = int(rng, 5, 60)
    const h2 = h1 + dh
    if (h2 > 120) continue
    return {
      text: `Într-un paralelipiped dreptunghic cu $l = ${D(l, 1)}\\text{ m}$ și $L = ${pct}\\%$ din $l$, apa se ridică până la $h_1 = ${D(h1, 1)}\\text{ m}$. Dacă în apă se scufundă ${k === 2 ? 'două' : k === 3 ? 'trei' : k === 4 ? 'patru' : 'cinci'} cuburi identice, apa se ridică până la $h_2 = ${D(h2, 1)}\\text{ m}$. Aflați muchia unui cub.`,
      solution: lines(
        'Lucrăm în decimetri:',
        show(`l = ${l}\\text{ dm}, \\quad L = \\frac{${pct}}{100} \\cdot ${l} = ${L}\\text{ dm}, \\quad h_2 - h_1 = ${h2} - ${h1} = ${dh}\\text{ dm}`),
        'Volumul cuburilor este egal cu volumul cu care s-a ridicat apa:',
        show(`${L} \\cdot ${l} \\cdot ${dh} = ${nr(vol)}\\text{ dm}^3, \\qquad ${nr(vol)} : ${k} = ${nr(a ** 3)}\\text{ dm}^3`),
        show(`a \\cdot a \\cdot a = ${nr(a ** 3)} \\Rightarrow a = ${a}\\text{ dm} = ${D(a, 1)}\\text{ m}`),
      ),
      verify: () => L * l * (h2 - h1) === k * a * a * a,
    }
  }
}

/** How many cubes of a given edge fill a cuboid with dimensions in dm, dam and m, p. 96, ex. 17. */
export function p4CubesFit(rng: Rng): Made {
  for (;;) {
    const e = int(rng, 1, 4)
    const x = e * int(rng, 2, 15)
    const y = e * int(rng, 2, 15)
    const z = e * int(rng, 2, 6)
    const xl = conv(q0(x), M, DM)
    const yL = conv(q0(y), M, DAM)
    const N = (x / e) * (y / e) * (z / e)
    if (yL.k > 2 || x >= y) continue
    return {
      text: `Un paralelipiped are $l = ${T(xl)}\\text{ dm}$, $L = ${T(yL)}\\text{ dam}$ și $h = ${z}\\text{ m}$. Câte cuburi cu muchia de $${e}\\text{ m}$ încap în paralelipiped?`,
      solution: lines(
        show(`${convTex(xl, DM, M)}, \\qquad ${convTex(yL, DAM, M)}`),
        `Pe lățime încap $${x} : ${e} = ${x / e}$ cuburi, pe lungime $${y} : ${e} = ${y / e}$, iar pe înălțime $${z} : ${e} = ${z / e}$:`,
        show(`${x / e} \\cdot ${y / e} \\cdot ${z / e} = ${nr(N)} \\text{ cuburi}`),
      ),
      verify: () => same(N * e ** 3, (base(xl, DM) / 1000) * (base(yL, DAM) / 1000) * z),
    }
  }
}

// ======================= final recapitulation: numbers and problems (pp. 99–116) =======================

/** A number plus a multiple of it, or a multiple minus the number: the number, p. 102, ex. 6 and p. 109, ex. 4. */
export function p4NumberMultiple(rng: Rng): Made {
  const n = int(rng, 3, 99)
  const k = int(rng, 2, 4)
  const word = k === 2 ? 'dublul' : k === 3 ? 'triplul' : 'împătritul'
  if (rng() < 0.5) {
    const S = (k + 1) * n
    return {
      text: `Suma dintre un număr și ${word} său este ${S}. Aflați numărul.`,
      solution: lines(
        `Numărul este o parte, iar ${word} său are ${k} astfel de părți; împreună ${k + 1} părți.`,
        show(`${S} : ${k + 1} = ${n}`),
      ),
      verify: () => n + k * n === S,
    }
  }
  const d = (k - 1) * n
  return {
    text: `Ce număr natural este cu ${d} mai mic decât ${word} său?`,
    solution: k === 2
      ? `Dublul numărului este numărul adunat cu el însuși, deci diferența dintre dublu și număr este chiar numărul: $n = ${d}$.`
      : lines(
        `${word[0].toUpperCase() + word.slice(1)} numărului are ${k} părți egale cu numărul; diferența lor, de ${k - 1} părți, este ${d}.`,
        show(`${d} : ${k - 1} = ${n}`),
      ),
    verify: () => k * n - n === d,
  }
}

/** The mean of a number and its multiples, or of a number with its predecessor and successor, p. 105, ex. 4 and p. 104, ex. 4. */
export function p4MeanMultiples(rng: Rng): Made {
  if (rng() < 0.7) {
    const cnt = int(rng, 2, 4)
    const n = int(rng, 2, 60)
    const sumK = (cnt * (cnt + 1)) / 2
    if ((sumK * n) % cnt) return p4MeanMultiples(rng)
    const Mn = (sumK * n) / cnt
    const names = ['', 'unui număr', 'dublului său', 'triplului său', 'împătritului său']
    const list = names.slice(1, cnt + 1)
    const parts = ['', 'numărul o parte', 'dublul are 2 părți', 'triplul are 3 părți', 'împătritul are 4 părți'].slice(1, cnt + 1)
    return {
      text: `Media aritmetică a ${list.slice(0, -1).join(', a ')} și a ${list[cnt - 1]} este ${Mn}. Aflați numărul.`,
      solution: lines(
        `Suma celor ${cnt} numere este $${cnt} \\cdot ${Mn} = ${cnt * Mn}$.`,
        `Dacă numărul este o parte, atunci ${parts.slice(1).join(', ')}; în total $${Array.from({ length: cnt }, (_, i) => i + 1).join(' + ')} = ${sumK}$ părți.`,
        show(`${cnt * Mn} : ${sumK} = ${n}`),
      ),
      verify: () => Array.from({ length: cnt }, (_, i) => (i + 1) * n).reduce((s, x) => s + x, 0) === cnt * Mn,
    }
  }
  const Mn = int(rng, 5, 500)
  return {
    text: `Media aritmetică pentru un număr, succesorul și predecesorul său este ${Mn}. Aflați numărul.`,
    solution: lines(
      'Dacă numărul este $n$, cele trei numere sunt $n - 1$, $n$, $n + 1$, cu suma $3 \\cdot n$.',
      show(`3 \\cdot n = 3 \\cdot ${Mn} = ${3 * Mn} \\Rightarrow n = ${Mn}`),
    ),
    verify: () => (Mn - 1 + Mn + Mn + 1) / 3 === Mn,
  }
}

/** Two things cost together a decimal sum, one k times dearer: each price, p. 112, ex. 5. */
export function p4TwoPrices(rng: Rng): Made {
  const [A, gA, gB] = pick(rng, [
    ['O pâine și un corn', 'pâinii', 'cornului'],
    ['Un caiet și un creion', 'caietului', 'creionului'],
    ['O carte și un pix', 'cărții', 'pixului'],
    ['Un suc și o napolitană', 'sucului', 'napolitanei'],
  ] as [string, string, string][])
  const k = int(rng, 2, 6)
  const c = int(rng, 30, 600)
  const S = (k + 1) * c
  return {
    text: `${A} costă împreună $${D(S, 2)}$ lei. Dacă prețul ${gA} este ${TIMESW[k]} mai mare decât prețul ${gB}, aflați cât costă fiecare.`,
    solution: lines(
      `Prețul ${gB} este o parte, iar al ${gA} ${k} părți; împreună ${k + 1} părți.`,
      show(`${D(S, 2)} : ${k + 1} = ${D(c, 2)} \\text{ lei}, \\qquad ${k} \\cdot ${D(c, 2)} = ${D(k * c, 2)} \\text{ lei}`),
    ),
    verify: () => c + k * c === S,
  }
}

/** The quotient and the remainder of two numbers and their difference: their sum, p. 103, ex. 11. */
export function p4DiffQuotientSum(rng: Rng): Made {
  const b = int(rng, 4, 90)
  const q = int(rng, 2, 9)
  const r = int(rng, 1, b - 1)
  const a = q * b + r
  const d = a - b
  return {
    text: `La împărțirea a două numere naturale s-a obținut câtul ${q} și restul ${r}. Dacă diferența celor două numere este ${d}, să se afle suma lor.`,
    solution: lines(
      `Deîmpărțitul este $${q} \\cdot b + ${r}$, unde $b$ este împărțitorul. Diferența lor este $${q - 1} \\cdot b + ${r}$:`,
      show(`${q - 1} \\cdot b + ${r} = ${d} \\Rightarrow ${q - 1} \\cdot b = ${d - r} \\Rightarrow b = ${b}`),
      show(`a = ${q} \\cdot ${b} + ${r} = ${a}, \\qquad a + b = ${a + b}`),
    ),
    verify: () => Math.floor(a / b) === q && a % b === r && a - b === d,
  }
}

/** Two lorries carry the same sand, one with more tonnes a trip and fewer trips: the sand, p. 99, ex. 8. */
export function p4Lorries(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 4, 12)
    const k = int(rng, 1, 2)
    const c = int(rng, 1, 4)
    if (((n - k) * c) % k) continue
    const x = ((n - k) * c) / k
    const Qt = n * x
    return {
      text: `Un camion poate să transporte o cantitate de nisip în ${n} curse. Un alt camion, care duce la o cursă cu $${c}\\text{ t}$ mai mult, transportă aceeași cantitate în ${n - k} curse. Câte tone de nisip sunt de transportat?`,
      solution: lines(
        `Al doilea camion duce în ${n - k} curse cu $${n - k} \\cdot ${c} = ${(n - k) * c}\\text{ t}$ mai mult decât ar duce primul în ${n - k} curse. Această diferență o duce primul camion în ${k === 1 ? 'cursa rămasă, deci la o cursă duce' : `celelalte ${k} curse, deci la o cursă duce`}:`,
        show(k === 1 ? `${x}\\text{ t}` : `${(n - k) * c} : ${k} = ${x}\\text{ t}`),
        show(`${n} \\cdot ${x} = ${Qt}\\text{ t}`),
      ),
      verify: () => n * x === (n - k) * (x + c),
    }
  }
}

/** Ages: a mother's ages at the two births and the sum of the children's ages; or "in how many years twice as old", p. 109, ex. 6 and p. 103, ex. 8 c. */
export function p4Ages(rng: Rng): Made {
  if (rng() < 0.5) {
    const a = int(rng, 20, 30)
    const g = int(rng, 2, 8)
    const son = int(rng, 3, 40)
    const dau = son + g
    const S = dau + son
    return {
      text: `Mama avea ${de(a)} ani când s-a născut fiica sa și ${de(a + g)} ani când s-a născut fiul său. Câți ani au acum fiica și fiul, dacă suma vârstelor lor este de ${de(S)} ani? Câți ani are mama?`,
      solution: lines(
        `Fiica este mai mare decât fiul cu $${a + g} - ${a} = ${g}$ ani.`,
        show(`\\text{fiul: } (${S} - ${g}) : 2 = ${son}, \\qquad \\text{fiica: } ${son} + ${g} = ${dau}, \\qquad \\text{mama: } ${dau} + ${a} = ${dau + a}`),
      ),
      verify: () => dau + son === S && dau - son === g,
    }
  }
  const [x, y] = pick(rng, [['Radu', 'Andrei'], ['Ana', 'Maria'], ['Mihai', 'Ioana'], ['Elena', 'Dan']])
  const a = int(rng, 2, 15)
  const d = int(rng, a + 1, a + 25)
  const t = d - a
  return {
    text: `${x} este cu ${de(d)} ani mai mare decât ${y}, care are ${de(a)} ani. Peste câți ani vârsta lui ${x} va fi dublul vârstei lui ${y}?`,
    solution: lines(
      `Diferența de vârstă rămâne mereu de ${de(d)} ani. Când ${x} va avea dublul vârstei lui ${y}, diferența va fi chiar vârsta lui ${y}, deci ${y} va avea ${de(d)} ani.`,
      show(`${d} - ${a} = ${t} \\text{ ani}`),
      `Verificare: peste ${t} ani, ${y} are ${de(d)} ani, iar ${x} are ${de(2 * d)} ani.`,
    ),
    verify: () => a + d + t === 2 * (a + t),
  }
}

/** a·b + a·c with a known, or two relations giving a and b + c: an expression, p. 102, ex. 5, p. 100, ex. 23, p. 116, ex. 5. */
export function p4FactorExpr(rng: Rng): Made {
  const v = int(rng, 1, 3)
  if (v === 1) {
    const a = int(rng, 2, 12)
    const s = int(rng, 3, 30)
    const k = int(rng, 2, 9)
    const e = int(rng, 1, k * s - 1)
    return {
      text: `Dacă $a \\cdot b + a \\cdot c = ${a * s}$ și $a = ${a}$, atunci cât este $${k} \\cdot b + ${k} \\cdot c - ${e}$?`,
      solution: lines(
        show(`a \\cdot (b + c) = ${a * s} \\Rightarrow ${a} \\cdot (b + c) = ${a * s} \\Rightarrow b + c = ${s}`),
        show(`${k} \\cdot b + ${k} \\cdot c - ${e} = ${k} \\cdot (b + c) - ${e} = ${k} \\cdot ${s} - ${e} = ${k * s - e}`),
      ),
      verify: () => a * s === a * s && k * s - e > 0,
    }
  }
  if (v === 2) {
    const a = int(rng, 2, 9)
    const s = int(rng, 3, 20)
    const t = int(rng, 1, s - 1)
    const S = a * s
    const R = a * (s - t)
    return {
      text: `Știind că $a \\cdot b + a \\cdot c = ${S}$ și $a \\cdot (b - ${t} + c) = ${R}$, să se afle $a$ și $b + c$.`,
      solution: lines(
        show(`a \\cdot (b - ${t} + c) = a \\cdot b + a \\cdot c - ${t} \\cdot a = ${S} - ${t} \\cdot a`),
        show(`${S} - ${t} \\cdot a = ${R} \\Rightarrow ${t} \\cdot a = ${S - R} \\Rightarrow a = ${a}`),
        show(`b + c = ${S} : ${a} = ${s}`),
      ),
      verify: () => a * (s - t) === R && t * a === S - R,
    }
  }
  for (;;) {
    const b = int(rng, 2, 9)
    const k = int(rng, 2, 5)
    const s = int(rng, 2, 20)
    if ((b + s) % 3) continue
    return {
      text: `Știind că $a \\cdot b + b \\cdot c = ${b * s}$ și $b \\cdot (${k} + a + c) = ${b * (k + s)}$, să se afle media aritmetică a numerelor $a$, $b$ și $c$.`,
      solution: lines(
        show(`b \\cdot (${k} + a + c) = ${k} \\cdot b + a \\cdot b + b \\cdot c = ${k} \\cdot b + ${b * s}`),
        show(`${k} \\cdot b = ${b * (k + s)} - ${b * s} = ${k * b} \\Rightarrow b = ${b}`),
        show(`a + c = ${b * s} : ${b} = ${s}, \\qquad m_a = (${s} + ${b}) : 3 = ${(s + b) / 3}`),
      ),
      verify: () => b * (k + s) - b * s === k * b && (s + b) % 3 === 0,
    }
  }
}

/** Five (three, seven) consecutive even (odd, natural) numbers with a given mean, p. 100, ex. 14. */
export function p4ConsecutiveMean(rng: Rng): Made {
  const cnt = pick(rng, [3, 5, 7])
  const kind = pick(rng, ['pare', 'impare', 'naturale'] as const)
  const step = kind === 'naturale' ? 1 : 2
  let Mn = int(rng, 10, 400)
  if (kind === 'pare' && Mn % 2) Mn++
  if (kind === 'impare' && Mn % 2 === 0) Mn++
  const half = (cnt - 1) / 2
  const first = Mn - half * step
  const nums = Array.from({ length: cnt }, (_, i) => first + i * step)
  const shift = (step * cnt * (cnt - 1)) / 2
  const cw = cnt === 3 ? 'trei' : cnt === 5 ? 'cinci' : 'șapte'
  return {
    text: `Să se afle ${cw} numere ${kind}, consecutive, a căror medie aritmetică este ${Mn}.`,
    solution: lines(
      `Suma numerelor este $${cnt} \\cdot ${Mn} = ${nr(cnt * Mn)}$. Dacă primul este $x$, numerele sunt $x$, $x + ${step}$, …, $x + ${(cnt - 1) * step}$, cu suma $${cnt} \\cdot x + ${shift}$.`,
      show(`${cnt} \\cdot x = ${nr(cnt * Mn)} - ${shift} = ${nr(cnt * first)} \\Rightarrow x = ${first}`),
      `Numerele sunt: ${nums.join(', ')}.`,
    ),
    verify: () => nums.reduce((s, x) => s + x, 0) === cnt * Mn && nums.every((x) => (kind === 'pare' ? x % 2 === 0 : kind === 'impare' ? x % 2 === 1 : true)),
  }
}

/** Three numbers with a sum: the first d more than the second, the third over the second a quotient and a remainder, p. 102, ex. 11. */
export function p4ThreeNumbersRemainder(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 5, 60)
    const d = int(rng, 1, 30)
    const q = int(rng, 2, 6)
    const r = int(rng, 1, b - 1)
    const a = b + d
    const c = q * b + r
    const S = a + b + c
    return {
      text: `Suma a trei numere naturale este ${S}. Primul număr este cu ${d} mai mare decât al doilea, iar împărțind al treilea număr la al doilea se obține câtul ${q} și restul ${r}. Să se afle cele trei numere.`,
      solution: lines(
        `Dacă al doilea număr este $b$, primul este $b + ${d}$, iar al treilea $${q} \\cdot b + ${r}$ (cu $${r} < b$).`,
        show(`b + ${d} + b + ${q} \\cdot b + ${r} = ${S} \\Rightarrow ${q + 2} \\cdot b = ${S - d - r} \\Rightarrow b = ${b}`),
        `Numerele sunt ${a}, ${b} și ${c}.`,
      ),
      verify: () => a + b + c === S && Math.floor(c / b) === q && c % b === r,
    }
  }
}

/** Three decimal numbers with a sum, each the next "k times plus c": the numbers, p. 112, ex. 7. */
export function p4ThreeNumbersChain(rng: Rng): Made {
  const k = int(rng, 2, 3)
  const x = int(rng, 11, 300)
  const c = int(rng, 1, 20) * 10
  const y = k * x + c
  const z = k * y + c
  const S = x + y + z
  const kw = k === 2 ? 'dublul' : 'triplul'
  return {
    text: `Suma a trei numere este $${D(S, 1)}$. Al doilea este cu ${c / 10} mai mare decât ${kw} primului, iar al treilea este cu ${c / 10} mai mare decât ${kw} celui de-al doilea. Să se afle numerele.`,
    solution: lines(
      `Dacă primul număr este $x$, al doilea este $${k} \\cdot x + ${c / 10}$, iar al treilea $${k} \\cdot (${k} \\cdot x + ${c / 10}) + ${c / 10} = ${k * k} \\cdot x + ${(k + 1) * (c / 10)}$.`,
      show(`x + ${k} \\cdot x + ${c / 10} + ${k * k} \\cdot x + ${(k + 1) * (c / 10)} = ${D(S, 1)} \\Rightarrow ${1 + k + k * k} \\cdot x = ${D(S - (k + 2) * c, 1)}`),
      show(`x = ${D(S - (k + 2) * c, 1)} : ${1 + k + k * k} = ${D(x, 1)}`),
      `Numerele sunt $${D(x, 1)}$, $${D(y, 1)}$ și $${D(z, 1)}$.`,
    ),
    verify: () => x + y + z === S && y === k * x + c && z === k * y + c && (1 + k + k * k) * x === S - (k + 2) * c,
  }
}

/** The largest number which, divided by d, gives a quotient smaller than (equal to, k times) the remainder, p. 100, ex. 24. */
export function p4QuotientVsRemainder(rng: Rng): Made {
  const d = int(rng, 6, 99)
  const v = int(rng, 1, 3)
  const r = d - 1
  let q: number
  let cond: string
  let why: string
  if (v === 1) {
    q = d - 2
    cond = 'câtul mai mic decât restul'
    why = `Restul este cel mult ${r}, iar câtul trebuie să fie mai mic decât restul, deci cel mult ${d - 2}. Ca numărul să fie cel mai mare, luăm restul ${r} și câtul ${q}.`
  } else if (v === 2) {
    q = d - 1
    cond = 'câtul egal cu restul'
    why = `Restul este cel mult ${r}; câtul este egal cu restul, deci cel mai mare număr se obține pentru câtul și restul ${r}.`
  } else {
    const k = int(rng, 2, 5)
    q = k * r
    cond = `câtul ${TIMESW[k]} mai mare decât restul`
    why = `Restul este cel mult ${r}, deci cel mai mare număr se obține pentru restul ${r} și câtul $${k} \\cdot ${r} = ${q}$.`
  }
  const n = d * q + r
  return {
    text: `Să se afle cel mai mare număr natural care, împărțit la ${d}, dă ${cond}.`,
    solution: lines(why, show(`n = ${d} \\cdot ${q} + ${r} = ${nr(n)}`)),
    verify: () => Math.floor(n / d) === q && n % d === r && (v === 1 ? q < r : v === 2 ? q === r : q % r === 0),
  }
}

// ======================= segments (pp. 104–105, 113) =======================

/** C the symmetric of A about B, D the midpoint of BC, E the symmetric of D about C; AE known: AB, p. 104, ex. 6. */
export function p4SymmetricChain(rng: Rng): Made {
  const x = 2 * int(rng, 2, 40)
  const AE = (5 * x) / 2
  return {
    text: `Pe o dreaptă se iau punctele $A$ și $B$; $C$ este simetricul lui $A$ față de $B$, $D$ este mijlocul segmentului $BC$, iar $E$ este simetricul lui $D$ față de $C$. Aflați lungimea segmentului $AB$, dacă $AE = ${AE}\\text{ cm}$.`,
    solution: lines(
      'Notăm $AB = x$. Atunci $BC = AB = x$, $BD = DC = x : 2$ și $CE = DC = x : 2$.',
      show(`AE = AB + BC + CE = x + x + \\frac{x}{2} = \\frac{5 \\cdot x}{2}`),
      show(`\\frac{5 \\cdot x}{2} = ${AE} \\Rightarrow x = ${AE} \\cdot 2 : 5 = ${x}\\text{ cm}`),
    ),
    verify: () => x + x + x / 2 === AE,
  }
}

/** A, B, C collinear in this order, AB and AC known, D the symmetric of B about C: AD and BD, p. 105, ex. 9. */
export function p4SymmetricOfB(rng: Rng): Made {
  const a = int(rng, 2, 40)
  const c = a + int(rng, 1, 40)
  const BC = c - a
  const AD = c + BC
  return {
    text: `Fie punctele $A$, $B$ și $C$ coliniare, în această ordine, astfel încât $AB = ${a}\\text{ cm}$ și $AC = ${c}\\text{ cm}$. Dacă $D$ este simetricul lui $B$ față de $C$, aflați lungimile segmentelor $AD$ și $BD$.`,
    solution: lines(
      show(`BC = AC - AB = ${c} - ${a} = ${BC}\\text{ cm}`),
      `$C$ este mijlocul lui $BD$, deci $CD = BC = ${BC}\\text{ cm}$:`,
      show(`AD = AC + CD = ${c} + ${BC} = ${AD}\\text{ cm}, \\qquad BD = 2 \\cdot ${BC} = ${2 * BC}\\text{ cm}`),
    ),
    verify: () => AD - a === 2 * BC && AD === 2 * c - a,
  }
}

/** M the midpoint of AB, B the midpoint of AC; AM known: MC, AC, and the distance from M to the midpoint of BN (N the midpoint of MC), p. 113, ex. 6. */
export function p4MidpointsAMC(rng: Rng): Made {
  // lengths in hundredths of a centimetre
  const t = int(rng, 2, 30)
  const am = 40 * t
  const ab = 2 * am
  const ac = 2 * ab
  const mc = ac - am
  const an = am + mc / 2
  const ap = (ab + an) / 2
  const mp = ap - am
  return {
    text: `Fie punctele $A$, $B$, $C$ coliniare și $M$ mijlocul segmentului $AB$, iar $B$ mijlocul segmentului $AC$. a) Dacă $AM = ${D(am, 2)}\\text{ cm}$, să se afle lungimile segmentelor $MC$ și $AC$. b) Dacă $N$ este mijlocul segmentului $MC$, să se afle la ce distanță de $M$ se află mijlocul segmentului $BN$.`,
    solution: lines(
      `a) $AB = 2 \\cdot AM = ${D(ab, 2)}\\text{ cm}$, $AC = 2 \\cdot AB = ${D(ac, 2)}\\text{ cm}$, iar $MC = AC - AM = ${D(mc, 2)}\\text{ cm}$.`,
      `b) Măsurăm distanțele de la $A$, în centimetri: $AB = ${D(ab, 2)}$ și $AN = AM + MC : 2 = ${D(am, 2)} + ${D(mc / 2, 2)} = ${D(an, 2)}$. Dacă $P$ este mijlocul lui $BN$:`,
      show(`AP = (${D(ab, 2)} + ${D(an, 2)}) : 2 = ${D(ap, 2)}\\text{ cm}, \\qquad MP = ${D(ap, 2)} - ${D(am, 2)} = ${D(mp, 2)}\\text{ cm}`),
    ),
    verify: () => Number.isInteger(ap) && 4 * mp === 5 * am && mc === 3 * am,
  }
}

// ======================= angles (pp. 105–106) =======================

/** AOD split by OB and OC, AOB d° less than BOC and k times COD: the three angles, p. 106, ex. 8. */
export function p4AngleSplitThree(rng: Rng): Made {
  for (;;) {
    const y = int(rng, 5, 30)
    const k = int(rng, 2, 4)
    const d = int(rng, 1, 15)
    const X = (2 * k + 1) * y + d
    if (X >= 180) continue
    return {
      text: `În interiorul unghiului $\\sphericalangle AOD = ${X}^\\circ$ se duc semidreptele $(OB$ și $(OC$, astfel încât $(OB$ să fie în interiorul unghiului $\\sphericalangle AOC$. Dacă $\\sphericalangle AOB$ este cu $${d}^\\circ$ mai mic decât $\\sphericalangle BOC$ și ${TIMESW[k]} mai mare decât $\\sphericalangle COD$, aflați măsurile unghiurilor $AOB$, $BOC$ și $COD$.`,
      solution: lines(
        `Notăm $\\sphericalangle COD = x$. Atunci $\\sphericalangle AOB = ${k} \\cdot x$ și $\\sphericalangle BOC = ${k} \\cdot x + ${d}^\\circ$.`,
        show(`${k} \\cdot x + ${k} \\cdot x + ${d}^\\circ + x = ${X}^\\circ \\Rightarrow ${2 * k + 1} \\cdot x = ${X - d}^\\circ \\Rightarrow x = ${y}^\\circ`),
        show(`\\sphericalangle AOB = ${k * y}^\\circ, \\quad \\sphericalangle BOC = ${k * y + d}^\\circ, \\quad \\sphericalangle COD = ${y}^\\circ`),
      ),
      verify: () => k * y + k * y + d + y === X,
    }
  }
}

/** OC, OD inside AOB; BOD = AOC + 2δ and COD the mean of AOC and DOB: BOC, p. 105, ex. 6. */
export function p4AngleMean(rng: Rng): Made {
  for (;;) {
    const Tt = pick(rng, [90, 90, 120, 150, 60, 135, 105])
    const dl = int(rng, 1, 12)
    if (Tt % 3) continue
    const x = Tt / 3 - dl
    if (x < 3) continue
    const COD = x + dl
    const DOB = x + 2 * dl
    const BOC = COD + DOB
    return {
      text: `În interiorul unghiului ${Tt === 90 ? 'drept ' : ''}$\\sphericalangle AOB${Tt === 90 ? '' : ` = ${Tt}^\\circ`}$ se duc semidreptele $(OC$ și $(OD$ astfel încât $(OC$ să fie în interiorul unghiului $\\sphericalangle AOD$. Dacă $\\sphericalangle BOD = \\sphericalangle AOC + ${2 * dl}^\\circ$, iar $\\sphericalangle COD$ este media aritmetică a unghiurilor $\\sphericalangle AOC$ și $\\sphericalangle DOB$, calculați măsura unghiului $\\sphericalangle BOC$.`,
      solution: lines(
        `Notăm $\\sphericalangle AOC = x$. Atunci $\\sphericalangle DOB = x + ${2 * dl}^\\circ$ și $\\sphericalangle COD = (x + x + ${2 * dl}^\\circ) : 2 = x + ${dl}^\\circ$.`,
        show(`x + x + ${dl}^\\circ + x + ${2 * dl}^\\circ = ${Tt}^\\circ \\Rightarrow 3 \\cdot x = ${Tt - 3 * dl}^\\circ \\Rightarrow x = ${x}^\\circ`),
        show(`\\sphericalangle BOC = \\sphericalangle COD + \\sphericalangle DOB = ${COD}^\\circ + ${DOB}^\\circ = ${BOC}^\\circ`),
      ),
      verify: () => x + COD + DOB === Tt && 2 * COD === x + DOB && DOB === x + 2 * dl,
    }
  }
}

// ======================= contest (5.11, p. 98) =======================

/** The area of a rectangle grows by Δ when one side grows by d: the first perimeter, p. 98, ex. 3. */
export function contestSideGrow(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 2, 20)
    const L = int(rng, l + 1, 30)
    const d = int(rng, 1, 6)
    const A = L * l
    if (rng() < 0.5) {
      const A2 = (L + d) * l
      return {
        text: `Un dreptunghi are aria egală cu $${A}\\text{ cm}^2$. Mărind lungimea dreptunghiului cu $${d}\\text{ cm}$, aria noului dreptunghi devine egală cu $${A2}\\text{ cm}^2$. Aflați perimetrul dreptunghiului inițial.`,
        solution: lines(
          `Aria a crescut cu $${A2} - ${A} = ${A2 - A}\\text{ cm}^2$, adică aria unei fâșii de lungime ${d} cm și lățime egală cu lățimea dreptunghiului:`,
          show(`l = ${A2 - A} : ${d} = ${l}\\text{ cm}, \\qquad L = ${A} : ${l} = ${L}\\text{ cm}`),
          show(`\\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ cm}`),
        ),
        verify: () => (L + d) * l - L * l === A2 - A,
      }
    }
    const A2 = L * (l + d)
    return {
      text: `Un dreptunghi are aria egală cu $${A}\\text{ cm}^2$. Mărind lățimea dreptunghiului cu $${d}\\text{ cm}$, aria noului dreptunghi devine egală cu $${A2}\\text{ cm}^2$. Aflați perimetrul dreptunghiului inițial.`,
      solution: lines(
        `Aria a crescut cu $${A2} - ${A} = ${A2 - A}\\text{ cm}^2$, adică aria unei fâșii de lățime ${d} cm și lungime egală cu lungimea dreptunghiului:`,
        show(`L = ${A2 - A} : ${d} = ${L}\\text{ cm}, \\qquad l = ${A} : ${L} = ${l}\\text{ cm}`),
        show(`\\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ cm}`),
      ),
      verify: () => L * (l + d) - L * l === A2 - A,
    }
  }
}

/** A garden fenced with r rows of wire; the length is c more than k times the width: perimeter and area, p. 98, ex. 5. */
export function contestFenceRelation(rng: Rng): Made {
  const l = int(rng, 20, 400)
  const k = int(rng, 2, 4)
  const c = int(rng, 1, 40)
  const L = k * l + c
  const r = int(rng, 3, 9)
  const P = 2 * (L + l)
  const W = r * P
  const kw = k === 2 ? 'dublul' : k === 3 ? 'triplul' : 'împătritul'
  return {
    text: `O grădină de formă dreptunghiulară este împrejmuită cu un gard din ${r} rânduri de sârmă. Știind că lungimea totală a sârmei este de $${nr(W)}\\text{ m}$, iar lungimea grădinii este cu $${c}\\text{ m}$ mai mare decât ${kw} lățimii, aflați: a) perimetrul grădinii; b) aria grădinii.`,
    solution: lines(
      show(`\\text{a) } \\mathcal{P} = ${nr(W)} : ${r} = ${nr(P)}\\text{ m}`),
      show(`L + l = ${nr(P)} : 2 = ${nr(P / 2)}\\text{ m}, \\qquad ${k} \\cdot l + ${c} + l = ${nr(P / 2)} \\Rightarrow ${k + 1} \\cdot l = ${nr(P / 2 - c)} \\Rightarrow l = ${l}\\text{ m}`),
      show(`\\text{b) } L = ${k} \\cdot ${l} + ${c} = ${L}\\text{ m}, \\qquad \\mathcal{A} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ m}^2`),
    ),
    verify: () => r * 2 * (L + l) === W && L === k * l + c,
  }
}

/** Two taps fill a tank together in T hours; one runs alone a hours, then both b hours: the time of each alone, p. 98, ex. 4. */
export function contestTwoTaps(rng: Rng): Made {
  for (;;) {
    const t1 = int(rng, 6, 90)
    const t2 = int(rng, 4, 90)
    if (t1 === t2 || (t1 * t2) % (t1 + t2)) continue
    const Tt = (t1 * t2) / (t1 + t2)
    if (Tt < 3) continue
    const b = int(rng, 2, Tt - 1)
    if ((t1 * (Tt - b)) % Tt) continue
    const a = (t1 * (Tt - b)) / Tt
    if (a < 2) continue
    const ore = (n: number) => `${de(n)} ore`
    return {
      text: `Două robinete, curgând împreună, pot umple un rezervor în ${ore(Tt)}. După ce primul robinet curge singur ${ore(a)}, se deschide și al doilea, iar amândouă umplu rezervorul după încă ${ore(b)}. În cât timp ar umple fiecare robinet, singur, rezervorul?`,
      solution: lines(
        `Împreună, într-o oră, robinetele umplu $${frac(1, Tt)}$ din rezervor; în ${ore(b)} umplu $${frac(b, Tt)}$ din el.`,
        `Primul robinet, singur, a umplut în ${ore(a)} restul: $1 - ${frac(b, Tt)} = ${frac(Tt - b, Tt)}$ din rezervor. Într-o oră umple $${frac(Tt - b, Tt * a)}$, deci singur umple rezervorul în ${ore(t1)}.`,
        `Al doilea robinet umple într-o oră $${frac(1, Tt)} - ${frac(1, t1)} = ${frac(1, t2)}$ din rezervor, deci singur îl umple în ${ore(t2)}.`,
      ),
      verify: () => same(1 / t1 + 1 / t2, 1 / Tt) && same(a / t1 + b / Tt, 1),
    }
  }
}

// ======================= the kinds =======================

export const KINDS: GradeKind[] = [
  {
    id: 'v-p4-length', label: '', topic: 'Geometrie', joins: 'v-length-perimeter',
    forms: {
      1: [p4RhombusSides, p4RectWidthFromPerimeter, p4MixedSidesPerimeter],
      2: [p4TriangleRelations, p4FenceRows, p4FenceRowsBack, p4TripStages, p4FabricLeft],
      3: [p4TriangleFractions, p4TriangleDiffUnits, p4FenceOffset],
    },
  },
  {
    id: 'v-p4-area', label: '', topic: 'Geometrie', joins: 'v-area-units',
    forms: {
      1: [p4RectFromAreaWidth, p4RectAreaUnits, p4EquivalentSurfaces],
      2: [p4RectQuotientPerimeter, p4RectRatioArea, p4CropRest, p4HarvestPerimeter],
      3: [p4DoubleWidth, p4Parquet, p4PaintRoom, p4SamePerimeterCrops],
    },
  },
  {
    id: 'v-p4-volume', label: '', topic: 'Geometrie', joins: 'v-volume-units',
    forms: {
      1: [p4CubeFaceArea, p4LitresPercent, p4BottlesBoxes],
      2: [p4PoolTap, p4CubeIntoCuboid, p4BarrelsFromCanisters, p4TwoBottleSizes],
      3: [p4ThreeTaps, p4SubmergedCubes, p4CubesFit],
    },
  },
  {
    id: 'v-p4-recap', label: '', topic: 'Algebră', joins: 'v-final-recap-numbers',
    forms: {
      1: [p4NumberMultiple, p4MeanMultiples, p4TwoPrices],
      2: [p4DiffQuotientSum, p4Lorries, p4Ages, p4FactorExpr, p4ConsecutiveMean],
      3: [p4ThreeNumbersRemainder, p4ThreeNumbersChain, p4QuotientVsRemainder],
    },
  },
  {
    id: 'v-p4-segments', label: '', topic: 'Geometrie', joins: 'v-midpoint-symmetric',
    forms: { 1: [], 2: [p4SymmetricChain, p4SymmetricOfB, p4MidpointsAMC], 3: [] },
  },
  {
    id: 'v-p4-angles', label: '', topic: 'Geometrie', joins: 'v-angle-calc',
    forms: { 1: [], 2: [], 3: [p4AngleSplitThree, p4AngleMean] },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-p4-rectangles-taps',
    label: 'Concursuri școlare: dreptunghiuri, garduri și robinete',
    forms: [contestSideGrow, contestFenceRelation, contestTwoTaps],
  },
]
