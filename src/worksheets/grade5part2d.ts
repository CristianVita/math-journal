// Grade V kinds from "Matematică, clasa a V-a", Mate 2000+ Consolidare (Paralela 45), partea a II-a, pp. 152–177,
// photographed by the user on 14 November 2026: units of length and perimeters (pp. 152–158), units of area and the
// area of the square and of the rectangle (pp. 161–170), units of volume and the volume of the cube and of the cuboid
// (pp. 175–177, the beginning of the chapter test; the rest of the volume chapter is in the next photos).
// Pages 159–160 and 171–174 (the theory of areas and volumes) were not among the photos.
// The levels follow the stars of the sections (Înțelegere * = 1, Aplicare ** = 2, Aprofundare *** = 3); the chapter
// tests are placed by their content; "Supermate ****" problems that can be generated are the contest kind.
// Every form names its page and exercise.
import type { Made } from './generators'
import { de, frac, int, pick, reduce, shuffle, type Rng } from './tex'

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
/** contest level only: the "Supermate" problems */
export interface ContestKind {
  /** 'v-contest-…', unique */
  id: string
  label: string
  forms: Form[]
}

const lines = (...l: string[]) => l.filter((s) => s !== '').join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const P10 = (k: number) => 10 ** k
const sum = (l: number[]) => l.reduce((s, t) => s + t, 0)
const same = (x: number, y: number) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))
/** The word "de" alone, after a formula that ends with the number: "$… = 120$ de litri". */
const deW = (n: number) => (de(n) === String(n) ? '' : 'de ')
const COUNTW: Record<number, string> = { 2: 'două', 3: 'trei', 4: 'patru', 5: 'cinci', 6: 'șase', 7: 'șapte' }
const TIMES: Record<number, string> = { 2: 'de două ori', 3: 'de trei ori', 4: 'de patru ori', 5: 'de cinci ori' }

/** A whole number in LaTeX, with thin spaces between groups of three digits from 1 000 up. */
const nr = (n: number) => {
  const s = String(Math.abs(n))
  return (n < 0 ? '-' : '') + (s.length < 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))
}
/** n / 10^k with the Romanian comma: D(235, 2) = 2{,}35; the zeros at the end are dropped unless `keep`. */
function D(n: number, k: number, keep = false): string {
  const s = String(Math.abs(n)).padStart(k + 1, '0')
  let part = k > 0 ? s.slice(s.length - k) : ''
  if (!keep) part = part.replace(/0+$/, '')
  return (n < 0 ? '-' : '') + nr(Number(s.slice(0, s.length - k))) + (part ? `{,}${part}` : '')
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

/** A unit: how it is written, its power of 10 in mm (mm², mm³), its name in the plural. */
interface Unit { tex: string; e: number; name: string }
const LEN = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km']
const LNAME = ['milimetri', 'centimetri', 'decimetri', 'metri', 'decametri', 'hectometri', 'kilometri']
const LU: Unit[] = LEN.map((s, i) => ({ tex: `\\text{ ${s}}`, e: i, name: LNAME[i] }))
const AU: Unit[] = LEN.map((s, i) => ({ tex: `\\text{ ${s}}^2`, e: 2 * i, name: `${LNAME[i]} pătrați` }))
const VU: Unit[] = LEN.map((s, i) => ({ tex: `\\text{ ${s}}^3`, e: 3 * i, name: `${LNAME[i]} cubi` }))
const ARI: Unit = { tex: '\\text{ ari}', e: 8, name: 'ari' }
const HA: Unit = { tex: '\\text{ ha}', e: 10, name: 'hectare' }
const [MM, CM, DM, M, DAM, HM, KM] = LU

/** x, given in the unit a, in the unit b. */
const conv = (x: Q, a: Unit, b: Unit) => norm(x.n, x.k - (a.e - b.e))
/** x in a, in the smallest unit (mm, mm², mm³): to check a conversion without `conv`. */
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

const RULE_LEN = 'Două unități de lungime vecine diferă de 10 ori: când trecem la o unitate mai mică înmulțim cu 10, 100, 1000, …, iar când trecem la una mai mare împărțim.'
const RULE_AREA = 'Două unități de arie vecine diferă de 100 de ori: când trecem la o unitate mai mică înmulțim cu 100, 10 000, …, iar când trecem la una mai mare împărțim. În plus, $1\\text{ ar} = 1\\text{ dam}^2$ și $1\\text{ ha} = 1\\text{ hm}^2$.'
const RULE_VOL = 'Două unități de volum vecine diferă de 1000 de ori: când trecem la o unitate mai mică înmulțim cu 1000, 1 000 000, …, iar când trecem la una mai mare împărțim.'

/** Four quantities in different units, in one unit. */
function convertMany(rng: Rng, units: Unit[], maxGap: number, rule: string): Made {
  for (;;) {
    const t = pick(rng, units)
    const pool = shuffle(rng, units.filter((u) => u.e !== t.e && Math.abs(u.e - t.e) <= maxGap))
    if (pool.length < 3) continue
    const items = pool.slice(0, 4).map((s) => {
      const x = s.e > t.e ? norm(int(rng, 2, 9999), int(rng, 0, 3)) : norm(int(rng, 12, 99999) * P10(int(rng, 0, 2)), int(rng, 0, 1))
      return { s, x, r: conv(x, s, t) }
    })
    if (items.some((it) => it.r.k > 7 || it.r.n > 1e13)) continue
    return {
      text: `Transformați în ${t.name}: ${items.map((it) => m(it.x, it.s)).join('; ')}.`,
      solution: lines(rule, ...items.map((it, i) => `${'abcd'[i]}) $${convTex(it.x, it.s, t)}$`)),
      verify: () => items.every((it) => same(base(it.r, t), base(it.x, it.s)) && Number.isSafeInteger(it.r.n)),
    }
  }
}

/** A sum and difference of 3 or 4 quantities in different units, in one unit. */
function mixedSum(rng: Rng, units: Unit[], maxGap: number, rule: string): Made {
  for (;;) {
    const t = pick(rng, units)
    const chosen: Unit[] = []
    for (const u of shuffle(rng, units.filter((v) => Math.abs(v.e - t.e) <= maxGap))) {
      if (chosen.length < 4 && !chosen.some((c) => c.e === u.e)) chosen.push(u)
    }
    if (chosen.length < 3) continue
    const tenths = chosen.map(() => int(rng, 5, 9999))
    const signs = [1, ...shuffle(rng, chosen.length === 4 ? [1, -1, 1] : [1, -1])]
    const terms = chosen.map((u, i) => conv(norm(tenths[i], 1), t, u))
    let run = 0
    let ok = true
    signs.forEach((s, i) => {
      run += s * tenths[i]
      if (run <= 0) ok = false
    })
    if (!ok || terms.some((x) => x.k > 5 || x.n > 1e9)) continue
    const total = norm(run, 1)
    const expr = terms.map((x, i) => `${i === 0 ? '' : signs[i] > 0 ? ' + ' : ' - '}${T(x)}${chosen[i].tex}`).join('')
    const steps = chosen.map((u, i) => (u === t ? '' : show(convTex(terms[i], u, t))))
    const inT = tenths.map((v, i) => `${i === 0 ? '' : signs[i] > 0 ? ' + ' : ' - '}${D(v, 1)}`).join('')
    return {
      text: `Calculați și exprimați rezultatul în ${t.name}: $${expr}$.`,
      solution: lines(rule, `Transformăm fiecare termen în ${t.name}:`, ...steps, show(`${inT} = ${T(total)}${t.tex}`)),
      verify: () => same(sum(terms.map((x, i) => signs[i] * base(x, chosen[i]))), base(total, t)),
    }
  }
}

// ---------- units of length, perimeters (pp. 152–158) ----------

/** Lengths in several units, in one unit, p. 152, ex. 1–7. */
export function lengthConvert(rng: Rng): Made {
  return convertMany(rng, LU, 4, RULE_LEN)
}

/** A triangle with its sides in three units: the perimeter, and the side of a square with the same perimeter, p. 153, ex. 9 and p. 154, V.2 a. */
export function trianglePerimeterUnits(rng: Rng): Made {
  for (;;) {
    const s = [int(rng, 8, 90), int(rng, 8, 90), int(rng, 8, 90)]
    const P = sum(s)
    if (2 * Math.max(...s) >= P || P % 4 !== 0 || new Set(s).size < 3) continue
    const us = shuffle(rng, [MM, CM, DM, M]).slice(0, 3)
    const xs = s.map((c, i) => conv(norm(c), CM, us[i]))
    const t = pick(rng, [CM, DM, MM])
    const Pt = conv(norm(P), CM, t)
    return {
      text: lines(
        `Un triunghi are laturile de ${m(xs[0], us[0])}, ${m(xs[1], us[1])} și ${m(xs[2], us[2])}.`,
        `a) Calculați perimetrul triunghiului, în ${t.name}.`,
        'b) Aflați lungimea laturii unui pătrat care are perimetrul egal cu cel al triunghiului.',
      ),
      solution: lines(
        'a) Exprimăm toate laturile în centimetri:',
        ...us.map((u, i) => (u === CM ? '' : show(convTex(xs[i], u, CM)))),
        show(`\\mathcal{P} = ${s.join(' + ')} = ${P}\\text{ cm}${t === CM ? '' : ` = ${T(Pt)}${t.tex}`}`),
        'b) Pătratul are patru laturi egale:',
        show(`\\ell = ${P} : 4 = ${P / 4}\\text{ cm}`),
      ),
      verify: () => same(base(Pt, t), sum(us.map((u, i) => base(xs[i], u)))) && 4 * (P / 4) === P,
    }
  }
}

/** The length, and the width some millimetres or centimetres shorter: the perimeter in a given unit, p. 156, I.3. */
export function rectWidthLess(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 12, 95)
    const d = int(rng, 2, L - 3)
    const uL = pick(rng, [CM, DM, MM])
    const ud = pick(rng, [MM, CM, DM])
    const t = pick(rng, [CM, DM, MM, M])
    const xL = conv(norm(L), CM, uL)
    const xd = conv(norm(d), CM, ud)
    if (uL === ud) continue
    const l = L - d
    const P = 2 * (L + l)
    const Pt = conv(norm(P), CM, t)
    return {
      text: `Un dreptunghi are lungimea de ${m(xL, uL)} și lățimea cu ${m(xd, ud)} mai mică. Calculați perimetrul dreptunghiului, în ${t.name}.`,
      solution: lines(
        'Exprimăm lungimile în centimetri:',
        ...[uL === CM ? '' : show(convTex(xL, uL, CM)), ud === CM ? '' : show(convTex(xd, ud, CM))],
        show(`l = ${L} - ${d} = ${l}\\text{ cm}`),
        show(`\\mathcal{P} = 2 \\cdot (L + l) = 2 \\cdot (${L} + ${l}) = ${P}\\text{ cm}${t === CM ? '' : ` = ${T(Pt)}${t.tex}`}`),
      ),
      verify: () => same(base(Pt, t), 2 * (base(xL, uL) + base(xL, uL) - base(xd, ud))),
    }
  }
}

/** The side of a square from its perimeter, and the perimeter from the side, in other units, p. 155, III.1 and p. 157, III. */
export function squareSidePerimeter(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 15, 400)
    if (s % 10 === 0) continue
    const xP = conv(norm(4 * s), MM, CM)
    const u = pick(rng, [HM, DAM, DM, KM])
    const y = norm(int(rng, 2, 99), int(rng, 0, 2))
    const four = norm(4 * y.n, y.k)
    const Pm = conv(four, u, M)
    if (Pm.k > 2) continue
    return {
      text: lines(
        `a) Un pătrat are perimetrul de ${m(xP, CM)}. Exprimați în milimetri lungimea laturii pătratului.`,
        `b) Latura altui pătrat are lungimea de ${m(y, u)}. Exprimați în metri perimetrul acestui pătrat.`,
      ),
      solution: lines(
        'a) Transformăm perimetrul în milimetri și îl împărțim la 4:',
        show(`${convTex(xP, CM, MM)}, \\qquad \\ell = ${4 * s} : 4 = ${s}\\text{ mm}`),
        'b) Perimetrul este de 4 ori latura:',
        show(`\\mathcal{P} = 4 \\cdot ${T(y)}${u.tex} = ${convTex(four, u, M)}`),
      ),
      verify: () => same(base(xP, CM) / 4, s) && same(base(Pm, M), 4 * base(y, u)),
    }
  }
}

/** The length k times the width and the perimeter in another unit: the dimensions in centimetres, p. 153, ex. 8 and p. 158, IV. */
export function rectRatioUnits(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3, 4, 5])
    const l = int(rng, 3, 60)
    const P = 2 * (k + 1) * l
    const u = pick(rng, [DAM, M, DM])
    const xP = conv(norm(P), CM, u)
    if (xP.k > 3) continue
    const rel = k === 2 ? 'egală cu dublul lățimii' : k === 3 ? 'egală cu triplul lățimii' : `de ${k} ori mai mare decât lățimea`
    return {
      text: `Un dreptunghi are lungimea ${rel} și perimetrul de ${m(xP, u)}. Calculați lungimea și lățimea dreptunghiului, în centimetri.`,
      solution: lines(
        show(convTex(xP, u, CM)),
        'Lungimea și lățimea împreună reprezintă jumătate din perimetru:',
        show(`L + l = ${P} : 2 = ${P / 2}\\text{ cm}`),
        `Lungimea are ${k} părți cât lățimea, deci împreună au ${k + 1} părți egale:`,
        show(`l = ${P / 2} : ${k + 1} = ${l}\\text{ cm}, \\qquad L = ${k} \\cdot ${l} = ${k * l}\\text{ cm}`),
      ),
      verify: () => 2 * (k * l + l) === P && same(base(xP, u), 10 * P),
    }
  }
}

/** A square garden closed with several rows of wire: the price of the wire, p. 153, ex. 10. */
export function wireCost(rng: Rng): Made {
  for (;;) {
    const n = int(rng, 120, 990) // the perimeter in dm
    const r = int(rng, 2, 7)
    const pc = int(rng, 25, 95) // bani for 1 m
    if ((n * r * pc) % 10 !== 0 || n % 10 === 0) continue
    const cost = (n * r * pc) / 10 // bani
    const u = pick(rng, [DAM, HM])
    const xP = conv(norm(n), DM, u)
    const Pm = norm(n, 1)
    const total = norm(n * r, 1)
    return {
      text: `O grădină în formă de pătrat, cu perimetrul de ${m(xP, u)}, este închisă cu ${COUNTW[r]} rânduri suprapuse de sârmă. Cât costă sârma, știind că 1 m de sârmă costă $${D(pc, 2, true)}$ lei?`,
      solution: lines(
        show(convTex(xP, u, M)),
        `Sârma înconjoară grădina de ${r} ori:`,
        show(`${T(Pm)} \\cdot ${r} = ${T(total)}\\text{ m}`),
        show(`${T(total)} \\cdot ${D(pc, 2, true)} = ${D(cost, 2, true)}\\text{ lei}`),
      ),
      verify: () => cost * 10 === n * r * pc && same(base(xP, u), n * 100),
    }
  }
}

/** Rolls of wire bought for a fence with several rows: the wire left over, p. 153, ex. 14. */
export function fenceRolls(rng: Rng): Made {
  for (;;) {
    const P = int(rng, 120, 990)
    const r = int(rng, 2, 4)
    const R = pick(rng, [50, 100, 150, 200, 250])
    const need = P * r
    const n = Math.ceil(need / R) + int(rng, 0, 2)
    const left = n * R - need
    if (left <= 0) continue
    const u = pick(rng, [KM, HM, DAM])
    const xR = conv(norm(R), M, u)
    return {
      text: `Pentru împrejmuirea unui teren cu perimetrul de ${P} m, cu ${COUNTW[r]} rânduri de sârmă, s-au cumpărat ${de(n)} role de sârmă de ${m(xR, u)} fiecare. Ce lungime are sârma rămasă după împrejmuire?`,
      solution: lines(
        show(convTex(xR, u, M)),
        'Sârma cumpărată și sârma folosită:',
        show(`${n} \\cdot ${R} = ${nr(n * R)}\\text{ m}, \\qquad ${P} \\cdot ${r} = ${nr(need)}\\text{ m}`),
        show(`${nr(n * R)} - ${nr(need)} = ${nr(left)}\\text{ m}`),
      ),
      verify: () => n * R - P * r === left && left > 0 && same(base(xR, u), R * 1000),
    }
  }
}

/** Lengths in several units added and subtracted, p. 154, IV, p. 155, IV and p. 156, IV. */
export function lengthMixed(rng: Rng): Made {
  return mixedSum(rng, LU, 3, RULE_LEN)
}

/** Lamp posts around a rectangular court, or trees along both sides of a street, p. 155, V.2 and p. 156, II.3. */
export function postsAround(rng: Rng): Made {
  if (rng() < 0.5) {
    for (;;) {
      const L = 10 * int(rng, 3, 30)
      const p = pick(rng, [20, 25, 40, 50, 60, 75, 80])
      const d = pick(rng, [2, 4, 5, 8, 10])
      const l = (L * p) / 100
      if (!Number.isInteger(l) || L % d !== 0 || l % d !== 0) continue
      const P = 2 * (L + l)
      const [pa, pb] = reduce(p, 100)
      return {
        text: lines(
          `Pe marginea unui teren de sport în formă de dreptunghi se instalează stâlpi de iluminat din ${d} în ${d} m, câte un stâlp în fiecare colț. Terenul are lungimea de ${L} m, iar lățimea este ${p}% din lungime. Aflați:`,
          'a) lățimea terenului;',
          'b) perimetrul terenului;',
          'c) numărul de stâlpi necesari.',
        ),
        solution: lines(
          show(`\\text{a) } l = ${frac(pa, pb)} \\cdot ${L} = ${l}\\text{ m}`),
          show(`\\text{b) } \\mathcal{P} = 2 \\cdot (${L} + ${l}) = ${nr(P)}\\text{ m}`),
          `c) Pe un contur închis sunt tot atâția stâlpi câte intervale de câte ${d} m:`,
          show(`${nr(P)} : ${d} = ${P / d}`),
        ),
        verify: () => P % d === 0 && 2 * (L / d) + 2 * (l / d) === P / d,
      }
    }
  }
  const d = pick(rng, [4, 5, 6, 8, 10])
  const S = d * int(rng, 12, 60)
  const side = S / d + 1
  return {
    text: `Pe marginea unei străzi cu lungimea de ${S} m, de o parte și de alta a străzii, s-au plantat tei la distanța de ${d} m unul de altul, primul și ultimul fiind chiar la capetele străzii. Câți tei s-au plantat?`,
    solution: lines(
      'Pe o parte a străzii sunt cu un tei mai mulți decât intervalele dintre ei:',
      show(`${S} : ${d} = ${S / d} \\text{ intervale}, \\qquad ${S / d} + 1 = ${side} \\text{ tei}`),
      'Pe ambele părți:',
      show(`2 \\cdot ${side} = ${2 * side} \\text{ tei}`),
    ),
    verify: () => (side - 1) * d === S,
  }
}

/** A plank cut into equal pieces, with the width of the cut: the sum of the perimeters of the pieces, p. 153, ex. 17. */
export function plankCut(rng: Rng): Made {
  const n = int(rng, 5, 14)
  const a = int(rng, 10, 30)
  const c = int(rng, 1, 4)
  const w = int(rng, 8, 25)
  const L = n * a + (n - 1) * c
  const one = 2 * (a + w)
  return {
    text: `O scândură cu lungimea de ${L} cm și lățimea de ${w} cm este tăiată, de-a curmezișul, în bucăți de câte ${a} cm lungime. Lățimea fiecărei tăieturi este de ${c} cm. Calculați suma perimetrelor bucăților rezultate.`,
    solution: lines(
      `Fiecare bucată are ${a} cm, iar între două bucăți vecine se pierd ${c} cm. Dacă adăugăm încă ${c} cm la scândură, ea se împarte exact în grupe de câte $${a} + ${c} = ${a + c}$ cm:`,
      `Numărul bucăților: $(${L} + ${c}) : ${a + c} = ${L + c} : ${a + c} = ${n}$.`,
      `Fiecare bucată este un dreptunghi de ${a} cm pe ${w} cm:`,
      show(`\\mathcal{P} = 2 \\cdot (${a} + ${w}) = ${one}\\text{ cm}, \\qquad ${n} \\cdot ${one} = ${nr(n * one)}\\text{ cm}`),
    ),
    verify: () => {
      let k = 0
      while ((k + 1) * a + k * c <= L) k++
      return k === n
    },
  }
}

/** Right triangles with a common leg h: [the other leg, the hypotenuse]; [0, h] is the leg itself. */
const LEGS: Record<number, [number, number][]> = {
  8: [[0, 8], [6, 10], [15, 17]],
  12: [[0, 12], [5, 13], [9, 15], [16, 20], [35, 37]],
  15: [[0, 15], [8, 17], [20, 25], [36, 39]],
  20: [[0, 20], [15, 25], [21, 29], [48, 52]],
  24: [[0, 24], [7, 25], [10, 26], [18, 30], [32, 40]],
}

/** The perimeters of MNP, MNQ and MQP, with Q on NP: MQ, then the perimeter of the square with the side MQ, p. 155, V.1. */
export function triangleCevian(rng: Rng): Made {
  for (;;) {
    const h = pick(rng, [8, 12, 15, 20, 24])
    const legs = LEGS[h]
    const [a, MN] = pick(rng, legs.filter(([o]) => o > 0))
    const [c, MP] = pick(rng, legs.filter(([o]) => o > 0))
    const [b, MQ] = pick(rng, legs)
    const q = rng() < 0.5 ? b : -b
    if (!(q > -a && q < c)) continue
    const NQ = q + a
    const QP = c - q
    const P = MN + NQ + QP + MP
    const p1 = MN + NQ + MQ
    const p2 = MQ + QP + MP
    return {
      text: lines(
        `Perimetrul triunghiului $MNP$ este de ${P} cm. Punctul $Q$ este situat pe latura $NP$, astfel încât perimetrul triunghiului $MNQ$ este de ${p1} cm, iar perimetrul triunghiului $MQP$ este de ${p2} cm.`,
        'a) Calculați lungimea segmentului $MQ$.',
        'b) Dacă $MQ$ este latura unui pătrat, calculați perimetrul pătratului.',
      ),
      solution: lines(
        'a) Adunăm perimetrele celor două triunghiuri mici. Laturile $MN$, $NQ$, $QP$, $PM$ formează perimetrul triunghiului $MNP$, iar $MQ$ apare de două ori:',
        show(`${p1} + ${p2} = \\mathcal{P}_{MNP} + 2 \\cdot MQ = ${P} + 2 \\cdot MQ`),
        show(`2 \\cdot MQ = ${p1 + p2} - ${P} = ${2 * MQ}, \\qquad MQ = ${MQ}\\text{ cm}`),
        show(`\\text{b) } \\mathcal{P} = 4 \\cdot ${MQ} = ${4 * MQ}\\text{ cm}`),
      ),
      verify: () => (p1 + p2 - P) / 2 === MQ && NQ + QP === a + c && MQ * MQ === h * h + b * b,
    }
  }
}

/** ABCD with the diagonal BD: ABD and CDB have the same perimeter; the perimeter of ABCD gives BD, p. 154, II.1. */
export function parallelogramDiagonal(rng: Rng): Made {
  for (;;) {
    const h = pick(rng, [8, 12, 15, 20, 24])
    const [[o1, AB], [o2, AD]] = shuffle(rng, LEGS[h]).slice(0, 2)
    const BD = o1 + o2
    if (BD === 0) continue
    const p = AB + AD + BD
    const Q = 2 * (AB + AD)
    return {
      text: `Triunghiurile $ABD$ și $CDB$ au același perimetru, de ${p} cm, iar perimetrul patrulaterului $ABCD$ este de ${Q} cm. Calculați lungimea diagonalei $BD$.`,
      solution: lines(
        'Adunăm perimetrele celor două triunghiuri: laturile $AB$, $AD$, $CB$, $CD$ formează perimetrul patrulaterului, iar $BD$ apare de două ori:',
        show(`${p} + ${p} = \\mathcal{P}_{ABCD} + 2 \\cdot BD = ${Q} + 2 \\cdot BD`),
        show(`2 \\cdot BD = ${2 * p} - ${Q} = ${2 * BD}, \\qquad BD = ${BD}\\text{ cm}`),
      ),
      verify: () => 2 * p - Q === 2 * BD && AB * AB === h * h + o1 * o1 && AD * AD === h * h + o2 * o2,
    }
  }
}

const DRAWERS = ['Mihai', 'Ana', 'Andrei', 'Ioana', 'Radu', 'Elena', 'Vlad', 'Maria']

/** Three segments: the second shorter than the first, the third longer than the second, the sum in cm, p. 157, II.4. */
export function segmentsChain(rng: Rng): Made {
  for (;;) {
    const a = 5 * int(rng, 1, 8) // mm
    const b = 5 * int(rng, 2, 14) // mm
    const f = int(rng, 30, 90) // mm
    const s = f - a
    const t = s + b
    if (s < 10 || t === f) continue
    const S = f + s + t
    const name = pick(rng, DRAWERS)
    const xa = conv(norm(a), MM, CM)
    const xS = conv(norm(S), MM, CM)
    const big = Math.max(f, t)
    return {
      text: `${name} desenează trei segmente. Al doilea segment este cu ${m(xa, CM)} mai scurt decât primul, iar al treilea este cu ${b} mm mai lung decât al doilea. Suma lungimilor celor trei segmente este de ${m(xS, CM)}. Aflați lungimea celui mai lung segment, în milimetri.`,
      solution: lines(
        'Lucrăm în milimetri:',
        show(`${convTex(xa, CM, MM)}, \\qquad ${convTex(xS, CM, MM)}`),
        'Notăm cu $x$ lungimea primului segment. Atunci al doilea are $x - ' + a + '$ mm, iar al treilea $x - ' + a + ' + ' + b + ' = x ' + (b - a >= 0 ? '+ ' + (b - a) : '- ' + (a - b)) + '$ mm:',
        show(`x + (x - ${a}) + (x ${b - a >= 0 ? '+' : '-'} ${Math.abs(b - a)}) = ${S} \\Rightarrow 3x = ${S} + ${2 * a} - ${b} = ${3 * f} \\Rightarrow x = ${f}`),
        `Segmentele au ${f} mm, ${s} mm și ${t} mm, deci cel mai lung are ${big} mm.`,
      ),
      verify: () => 3 * f - 2 * a + b === S && big === Math.max(f, s, t),
    }
  }
}

/** One perimeter, three conditions: a difference, a percent of the width, a percent of the length, p. 156, V.2. */
export function rectThreeCases(rng: Rng): Made {
  for (;;) {
    const half = int(rng, 20, 200)
    const d = 2 * int(rng, 1, Math.floor((half - 2) / 2))
    const p = pick(rng, [125, 150, 200, 250, 300])
    const q = pick(rng, [20, 25, 40, 50, 60, 75, 80])
    if ((half - d) % 2 !== 0 || (100 * half) % (100 + p) !== 0 || (100 * half) % (100 + q) !== 0) continue
    const la = (half - d) / 2
    const lb = (100 * half) / (100 + p)
    const Lc = (100 * half) / (100 + q)
    if (la < 1) continue
    const [pa, pb] = reduce(p, 100)
    const [qa, qb] = reduce(q, 100)
    return {
      text: lines(
        `Perimetrul unui dreptunghi este de ${2 * half} m. Determinați dimensiunile dreptunghiului în fiecare dintre situațiile:`,
        `a) diferența dintre lungime și lățime este de ${d} m;`,
        `b) lungimea reprezintă ${p}% din lățime;`,
        `c) lățimea reprezintă ${q}% din lungime.`,
      ),
      solution: lines(
        `Semiperimetrul este $L + l = ${2 * half} : 2 = ${half}$ m.`,
        show(`\\text{a) } l = (${half} - ${d}) : 2 = ${la}\\text{ m}, \\qquad L = ${la} + ${d} = ${la + d}\\text{ m}`),
        show(`\\text{b) } L = ${frac(pa, pb)} \\cdot l, \\quad l + ${frac(pa, pb)}l = ${frac(pa + pb, pb)}l = ${half} \\Rightarrow l = ${half} \\cdot ${frac(pb, pa + pb)} = ${lb}\\text{ m}, \\quad L = ${half - lb}\\text{ m}`),
        show(`\\text{c) } l = ${frac(qa, qb)} \\cdot L, \\quad L + ${frac(qa, qb)}L = ${frac(qa + qb, qb)}L = ${half} \\Rightarrow L = ${half} \\cdot ${frac(qb, qa + qb)} = ${Lc}\\text{ m}, \\quad l = ${half - Lc}\\text{ m}`),
      ),
      verify: () => (half - lb) * 100 === p * lb && (half - Lc) * 100 === q * Lc && 2 * la + d === half,
    }
  }
}

// ---------- units of area, the square and the rectangle (pp. 161–170) ----------

/** Areas in several units, in one unit (also ari and hectare), p. 162, ex. 5–9. */
export function areaConvert(rng: Rng): Made {
  return convertMany(rng, [...AU, ARI, HA], 6, RULE_AREA)
}

/** What is missing up to 1 of a larger unit, p. 163, ex. 16. */
export function areaComplete(rng: Rng): Made {
  const singles = [0, 1].map(() => {
    const u = int(rng, 0, 4)
    const v = u <= 3 && rng() < 0.3 ? u + 2 : u + 1
    const F = P10(2 * (v - u))
    const a = int(rng, 5, F * 10 - 5)
    return { u, v, F, a, miss: F * 10 - a }
  })
  const u = int(rng, 1, 5)
  const [a, b] = [int(rng, 1, 99), int(rng, 1, 99)]
  const miss2 = 10000 - 100 * a - b
  const item = (s: (typeof singles)[0]) => `$${D(s.a, 1)}${AU[s.u].tex} + \\ldots = 1${AU[s.v].tex}$`
  return {
    text: `Completați: a) ${item(singles[0])}; b) ${item(singles[1])}; c) $${a}${AU[u].tex} + ${b}${AU[u - 1].tex} + \\ldots = 1${AU[u + 1].tex}$.`,
    solution: lines(
      ...singles.map((s, i) => `${'ab'[i]}) $1${AU[s.v].tex} = ${nr(s.F)}${AU[s.u].tex}$, deci lipsesc $${nr(s.F)} - ${D(s.a, 1)} = ${D(s.miss, 1)}${AU[s.u].tex}$.`),
      `c) Lucrăm în ${AU[u - 1].name}: $1${AU[u + 1].tex} = 10\\,000${AU[u - 1].tex}$ și $${a}${AU[u].tex} = ${nr(100 * a)}${AU[u - 1].tex}$, deci lipsesc`,
      show(`10\\,000 - ${nr(100 * a)} - ${b} = ${nr(miss2)}${AU[u - 1].tex}`),
    ),
    verify: () => singles.every((s) => s.miss > 0 && same((s.a + s.miss) / 10 * P10(2 * s.u), P10(2 * s.v))) && miss2 > 0 && 100 * a + b + miss2 === 10000,
  }
}

/** A square with the side equal to the mean of two numbers: the perimeter and the area, p. 162, ex. 12 and p. 167, V.1. */
export function squareMean(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 4, 90)
    const b = int(rng, 4, 90)
    if (a === b || (a + b) % 2 !== 0) continue
    const s = (a + b) / 2
    const u = pick(rng, ['cm', 'm', 'dm'])
    return {
      text: `Un pătrat $ABCD$ are latura, exprimată în ${u === 'm' ? 'metri' : u === 'cm' ? 'centimetri' : 'decimetri'}, egală cu media aritmetică a numerelor ${a} și ${b}. Calculați: a) lungimea laturii; b) perimetrul pătratului; c) aria pătratului.`,
      solution: lines(
        show(`\\text{a) } \\ell = (${a} + ${b}) : 2 = ${a + b} : 2 = ${s}\\text{ ${u}}`),
        show(`\\text{b) } \\mathcal{P} = 4 \\cdot \\ell = 4 \\cdot ${s} = ${4 * s}\\text{ ${u}}`),
        show(`\\text{c) } \\mathcal{A} = \\ell \\cdot \\ell = ${s} \\cdot ${s} = ${nr(s * s)}\\text{ ${u}}^2`),
      ),
      verify: () => 2 * s === a + b && s * s > 0,
    }
  }
}

/** The area of a rectangle, then with both sides shorter, then longer by the same length, p. 166, V.1. */
export function rectShrinkGrow(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 8, 60)
    const l = int(rng, 5, L - 1)
    const d = int(rng, 1, Math.min(9, l - 2))
    if (d < 1) continue
    return {
      text: lines(
        `Un dreptunghi are lungimea de ${L} m și lățimea de ${l} m.`,
        'a) Calculați aria dreptunghiului.',
        `b) Calculați aria dreptunghiului dacă dimensiunile scad cu câte ${d} m fiecare.`,
        `c) Calculați aria dreptunghiului dacă dimensiunile cresc cu câte ${d} m fiecare.`,
      ),
      solution: lines(
        show(`\\text{a) } \\mathcal{A} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ m}^2`),
        show(`\\text{b) } (${L} - ${d}) \\cdot (${l} - ${d}) = ${L - d} \\cdot ${l - d} = ${nr((L - d) * (l - d))}\\text{ m}^2`),
        show(`\\text{c) } (${L} + ${d}) \\cdot (${l} + ${d}) = ${L + d} \\cdot ${l + d} = ${nr((L + d) * (l + d))}\\text{ m}^2`),
      ),
      verify: () => (L + d) * (l + d) - L * l === d * (L + l) + d * d && L * l - (L - d) * (l - d) === d * (L + l) - d * d,
    }
  }
}

/** A square from its area in ha or ari (the perimeter), and from its perimeter in another unit (the area in ha), p. 162, ex. 13, p. 165, I.1 and p. 166, I.2. */
export function squareAreaUnits(rng: Rng): Made {
  for (;;) {
    const s = 10 * int(rng, 3, 99)
    const t = 10 * int(rng, 3, 99)
    if (s === t) continue
    const ua = pick(rng, [HA, ARI, AU[4], AU[5]])
    const xA = conv(norm(s * s), AU[3], ua)
    const up = pick(rng, [DAM, HM, KM])
    const xP = conv(norm(4 * t), M, up)
    const A2 = conv(norm(t * t), AU[3], HA)
    if (xA.k > 4 || xP.k > 3) continue
    return {
      text: lines(
        `a) Un teren în formă de pătrat are aria de ${m(xA, ua)}. Calculați perimetrul terenului, în metri.`,
        `b) Un alt teren în formă de pătrat are perimetrul de ${m(xP, up)}. Calculați aria lui, în hectare.`,
      ),
      solution: lines(
        'a) Transformăm aria în metri pătrați și căutăm numărul care înmulțit cu el însuși dă aria:',
        show(`${convTex(xA, ua, AU[3])} = ${s} \\cdot ${s}\\text{ m}^2`),
        show(`\\ell = ${s}\\text{ m}, \\qquad \\mathcal{P} = 4 \\cdot ${s} = ${nr(4 * s)}\\text{ m}`),
        'b) Transformăm perimetrul în metri:',
        show(`${convTex(xP, up, M)}, \\qquad \\ell = ${nr(4 * t)} : 4 = ${t}\\text{ m}`),
        show(`\\mathcal{A} = ${t} \\cdot ${t} = ${nr(t * t)}\\text{ m}^2 = ${T(A2)}\\text{ ha}`),
      ),
      verify: () => same(base(xA, ua), s * s * 1e6) && same(base(A2, HA), t * t * 1e6) && same(base(xP, up), 4 * t * 1000),
    }
  }
}

const ROOMS = ['O baie', 'O bucătărie', 'Un hol', 'O terasă', 'O cameră']

/** How many square tiles cover a rectangular floor, p. 163, ex. 25 and p. 167, II.1. */
export function tilesCount(rng: Rng): Made {
  for (;;) {
    const c = pick(rng, [10, 15, 20, 25, 30, 40, 50])
    const L = c * int(rng, 6, 30)
    const l = c * int(rng, 4, 20)
    if (l >= L || L > 900) continue
    const xL = norm(L, 2)
    const xl = norm(l, 2)
    const n = (L / c) * (l / c)
    return {
      text: `${pick(rng, ROOMS)} are lungimea de $${T(xL)}$ m și lățimea de $${T(xl)}$ m. De câte plăci de gresie în formă de pătrat, cu latura de ${c} cm, este nevoie pentru a acoperi podeaua?`,
      solution: lines(
        'Lucrăm în centimetri:',
        show(`${T(xL)}\\text{ m} = ${L}\\text{ cm}, \\qquad ${T(xl)}\\text{ m} = ${l}\\text{ cm}`),
        show(`\\mathcal{A}_{\\text{podea}} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ cm}^2, \\qquad \\mathcal{A}_{\\text{placa}} = ${c} \\cdot ${c} = ${c * c}\\text{ cm}^2`),
        `Numărul plăcilor: $${nr(L * l)} : ${c * c} = ${nr(n)}$.`,
        `Pe lungime încap $${L} : ${c} = ${L / c}$ plăci, pe lățime $${l} : ${c} = ${l / c}$ plăci, așa că plăcile acoperă podeaua exact, fără să fie tăiate.`,
      ),
      verify: () => (L * l) % (c * c) === 0 && n === (L * l) / (c * c),
    }
  }
}

/** Tiles of 1 dm sold in boxes: how many boxes and what the tiles cost, p. 163, ex. 22. */
export function tilesBoxes(rng: Rng): Made {
  for (;;) {
    const A = 100 * int(rng, 6, 40) // dm²
    const b = pick(rng, [20, 25, 30, 40, 50, 60])
    const pc = int(rng, 2500, 9999) // bani for 1 m²
    const boxes = Math.ceil(A / b)
    if (A % b === 0 && rng() < 0.6) continue
    const cost = (A / 100) * pc
    return {
      text: `Pardoseala unei camere se acoperă cu plăcuțe pătrate de gresie, cu latura de 1 dm. Suprafața pardoselii măsoară $${nr(A)}\\text{ dm}^2$. Plăcile se vând în cutii de câte ${de(b)} bucăți, iar 1 m² de gresie costă $${D(pc, 2, true)}$ lei. Aflați câte cutii trebuie cumpărate și cât costă gresia care acoperă pardoseala.`,
      solution: lines(
        `O plăcuță are aria de $1\\text{ dm}^2$, deci sunt necesare $${nr(A)}$ ${deW(A)}plăcuțe.`,
        A % b === 0
          ? `$${nr(A)} : ${b} = ${boxes}$, deci sunt necesare ${de(boxes)} cutii.`
          : `$${nr(A)} : ${b} = ${Math.floor(A / b)}$ rest ${A % b}, deci ${de(Math.floor(A / b))} cutii nu ajung: trebuie cumpărate ${de(boxes)} cutii.`,
        show(`${nr(A)}\\text{ dm}^2 = ${A / 100}\\text{ m}^2, \\qquad ${A / 100} \\cdot ${D(pc, 2, true)} = ${D(cost, 2, true)}\\text{ lei}`),
      ),
      verify: () => boxes * b >= A && (boxes - 1) * b < A && cost * 100 === A * pc,
    }
  }
}

/** A rectangle and a square with the same area: the side, the width, the two perimeters, p. 166, V.2. */
export function sameAreaRectSquare(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 12, 90)
    const A = s * s
    const Ls = [] as number[]
    for (let L = s + 1; L <= 4 * s; L++) if (A % L === 0) Ls.push(L)
    if (Ls.length === 0) continue
    const L = pick(rng, Ls)
    const l = A / L
    return {
      text: lines(
        `Un dreptunghi și un pătrat au aceeași arie, $${nr(A)}\\text{ m}^2$. Dacă lungimea dreptunghiului este de ${L} m, calculați:`,
        'a) lungimea laturii pătratului;',
        'b) lățimea dreptunghiului;',
        'c) perimetrul dreptunghiului și pe cel al pătratului.',
      ),
      solution: lines(
        show(`\\text{a) } \\ell \\cdot \\ell = ${nr(A)} = ${s} \\cdot ${s} \\Rightarrow \\ell = ${s}\\text{ m}`),
        show(`\\text{b) } l = ${nr(A)} : ${L} = ${l}\\text{ m}`),
        show(`\\text{c) } \\mathcal{P}_{\\text{dreptunghi}} = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ m}, \\qquad \\mathcal{P}_{\\text{patrat}} = 4 \\cdot ${s} = ${4 * s}\\text{ m}`),
      ),
      verify: () => L * l === s * s && 2 * (L + l) > 4 * s,
    }
  }
}

/** Areas in several units added and subtracted, p. 162, ex. 15, p. 166, IV, p. 167, IV and p. 168, IV. */
export function areaMixed(rng: Rng): Made {
  return mixedSum(rng, [...AU, ARI, HA], 4, RULE_AREA)
}

/** A field ploughed by tractors, or the wheat harvested from it, p. 167, II.3 and p. 169, II.4. */
export function farmField(rng: Rng): Made {
  if (rng() < 0.5) {
    for (;;) {
      const r = int(rng, 3, 12) // ha a day
      const n = int(rng, 2, 12) // tractors
      const d = int(rng, 4, 30) // days
      const ha = r * n * d
      const L = 100 * int(rng, 10, 90) // m
      const l = (ha * 10000) / L
      if (!Number.isInteger(l) || l % 10 !== 0 || l >= L || l < 50) continue
      const xL = conv(norm(L), M, KM)
      const xl = conv(norm(l), M, DAM)
      return {
        text: `Un tractor ară într-o zi ${r} hectare. Un teren agricol în formă de dreptunghi are lungimea de ${m(xL, KM)} și lățimea de ${m(xl, DAM)}. În câte zile vor ara acest teren ${n === 2 ? 'două' : n} tractoare care lucrează împreună?`,
        solution: lines(
          show(`${convTex(xL, KM, M)}, \\qquad ${convTex(xl, DAM, M)}`),
          show(`\\mathcal{A} = ${nr(L)} \\cdot ${nr(l)} = ${nr(ha * 10000)}\\text{ m}^2 = ${nr(ha)}\\text{ ha}`),
          `Într-o zi, cele ${n} tractoare ară $${n} \\cdot ${r} = ${n * r}$ ha, deci:`,
          show(`${nr(ha)} : ${n * r} = ${d} \\text{ zile}`),
        ),
        verify: () => L * l === ha * 10000 && ha === n * r * d,
      }
    }
  }
  for (;;) {
    const L = int(rng, 10, 90) // hm
    const l = int(rng, 20, 99) // dam
    const y = 100 * int(rng, 25, 70) // kg/ha
    const ha = norm(L * l, 1) // L hm · l dam = 1000 L l m² = L l / 10 ha
    const kg = (L * l * y) / 10
    if (!Number.isInteger(kg) || 10 * l >= 100 * L) continue
    return {
      text: `Un teren în formă de dreptunghi, cu lungimea de ${L} hm și lățimea de ${l} dam, a fost cultivat cu grâu. Producția medie la hectar a fost de $${nr(y)}$ kg. Ce cantitate de grâu s-a obținut, în tone?`,
      solution: lines(
        show(`${L}\\text{ hm} = ${nr(100 * L)}\\text{ m}, \\qquad ${l}\\text{ dam} = ${10 * l}\\text{ m}`),
        show(`\\mathcal{A} = ${nr(100 * L)} \\cdot ${10 * l} = ${nr(1000 * L * l)}\\text{ m}^2 = ${T(ha)}\\text{ ha}`),
        show(`${T(ha)} \\cdot ${nr(y)} = ${nr(kg)}\\text{ kg} = ${D(kg, 3)}\\text{ t}`),
      ),
      verify: () => same(V(ha) * y, kg) && same(1000 * L * l, V(ha) * 10000),
    }
  }
}

/** The whole sides of a square with its area, or its perimeter, between two numbers, p. 162, ex. 14 and p. 163, ex. 20. */
export function sideBetween(rng: Rng): Made {
  for (;;) {
    const s1 = int(rng, 3, 20)
    const A1 = s1 * s1 + int(rng, 0, 2 * s1)
    const s2 = s1 + int(rng, 1, 3)
    const A2 = s2 * s2 + int(rng, 1, 2 * s2)
    const sides = Array.from({ length: 40 }, (_, i) => i + 1).filter((x) => x * x > A1 && x * x < A2)
    const P1 = int(rng, 40, 300)
    const P2 = P1 + int(rng, 6, 15)
    const xs = Array.from({ length: 100 }, (_, i) => i + 1).filter((x) => 4 * x > P1 && 4 * x < P2)
    if (sides.length < 1 || xs.length < 2) continue
    return {
      text: lines(
        `a) Câți centimetri poate avea latura unui pătrat cu aria cuprinsă între $${A1}\\text{ cm}^2$ și $${A2}\\text{ cm}^2$, dacă lungimea laturii, exprimată în centimetri, este un număr natural?`,
        `b) Un pătrat are perimetrul cuprins între ${P1} m și ${P2} m, iar latura lui are $x$ metri, unde $x$ este un număr natural. Determinați valorile lui $x$ și aria cea mai mică pe care o poate avea pătratul.`,
      ),
      solution: lines(
        'a) Căutăm numerele naturale al căror pătrat este între cele două arii:',
        show(sides.map((x) => `${x} \\cdot ${x} = ${x * x}`).join(', \\quad ')),
        `deci latura poate avea ${sides.length === 1 ? `doar ${sides[0]} cm` : `${sides.join(', ').replace(/, (\d+)$/, ' sau $1')} cm`}.`,
        `b) $${P1} < 4x < ${P2}$, iar $4x$ este multiplu de 4:`,
        show(`4x \\in \\{${xs.map((x) => 4 * x).join(', ')}\\} \\Rightarrow x \\in \\{${xs.join(', ')}\\}`),
        `Aria este cea mai mică pentru latura cea mai mică: $${xs[0]} \\cdot ${xs[0]} = ${nr(xs[0] * xs[0])}\\text{ m}^2$.`,
      ),
      verify: () => sides.every((x) => x * x > A1 && x * x < A2) && (sides[0] - 1) ** 2 <= A1 && (sides[sides.length - 1] + 1) ** 2 >= A2 &&
        xs.every((x) => 4 * x > P1 && 4 * x < P2) && 4 * (xs[0] - 1) <= P1 && 4 * (xs[xs.length - 1] + 1) >= P2,
    }
  }
}

/** One side of a square longer, the other shorter: the area grows by c, so the side is found, p. 163, ex. 17. */
export function squareToRect(rng: Rng): Made {
  for (;;) {
    const b = int(rng, 1, 6)
    const a = b + int(rng, 1, 5)
    const s = int(rng, b + 3, 40)
    const c = s * (a - b) - a * b
    if (c <= 0) continue
    return {
      text: `Lungimea laturii $AB$ a unui pătrat $ABCD$ se mărește cu ${a} cm, iar latura $BC$ se micșorează cu ${b} cm. Se obține astfel un dreptunghi. Determinați lungimea laturii pătratului, dacă aria figurii obținute s-a mărit cu $${c}\\text{ cm}^2$.`,
      solution: lines(
        `Notăm cu $\\ell$ latura pătratului. Dreptunghiul are dimensiunile $\\ell + ${a}$ și $\\ell - ${b}$. Față de pătrat, se adaugă o fâșie de ${a} cm pe $\\ell$ și se pierde o fâșie de ${b} cm pe $\\ell + ${a}$:`,
        show(`(\\ell + ${a})(\\ell - ${b}) = \\ell \\cdot \\ell + ${a}\\ell - ${b}(\\ell + ${a}) = \\ell \\cdot \\ell + ${a - b === 1 ? '' : a - b}\\ell - ${a * b}`),
        show(`${a - b === 1 ? '' : a - b}\\ell - ${a * b} = ${c} \\Rightarrow ${a - b === 1 ? '' : a - b}\\ell = ${c + a * b} \\Rightarrow \\ell = ${s}\\text{ cm}`),
        `Verificare: $${s + a} \\cdot ${s - b} - ${s} \\cdot ${s} = ${nr((s + a) * (s - b))} - ${nr(s * s)} = ${nr(c)}$.`,
      ),
      verify: () => (s + a) * (s - b) - s * s === c,
    }
  }
}

const PART: Record<number, string> = { 2: '\\frac{1}{2}', 3: '\\frac{1}{3}', 4: '\\frac{1}{4}', 5: '\\frac{1}{5}' }

/** The width a part of the length; twice (three times) the difference is d less than the perimeter, p. 163, ex. 18. */
export function rectDiffPerimeter(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3, 4, 5])
    const mult = pick(rng, [2, 3])
    const den = 2 * (k + 1) - mult * (k - 1)
    if (den <= 0) continue
    const l = int(rng, 3, 40)
    const d = l * den
    const L = k * l
    const P = 2 * (L + l)
    return {
      text: lines(
        `Lățimea unui dreptunghi reprezintă $${PART[k]}$ din lungime. ${mult === 2 ? 'Dublul' : 'Triplul'} diferenței dintre lungime și lățime este cu ${d} m mai mic decât perimetrul dreptunghiului.`,
        'a) Calculați lungimea și lățimea dreptunghiului.',
        'b) Calculați aria dreptunghiului și aria pătratului cu latura egală cu perimetrul dreptunghiului.',
      ),
      solution: lines(
        `a) Lungimea are ${k} părți egale cu lățimea: $L = ${k}l$. Diferența este $${k - 1 === 1 ? '' : k - 1}l$, iar perimetrul $2 \\cdot (${k}l + l) = ${2 * (k + 1)}l$:`,
        show(`${2 * (k + 1)}l - ${mult * (k - 1)}l = ${d} \\Rightarrow ${den === 1 ? '' : `${den}l = ${d} \\Rightarrow `}l = ${l}\\text{ m}, \\quad L = ${L}\\text{ m}`),
        show(`\\text{b) } \\mathcal{A} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ m}^2, \\qquad \\mathcal{P} = ${P}\\text{ m}, \\qquad \\mathcal{A}_{\\text{patrat}} = ${P} \\cdot ${P} = ${nr(P * P)}\\text{ m}^2`),
      ),
      verify: () => P - mult * (L - l) === d && L === k * l,
    }
  }
}

/** The width is 1/n of the perimeter and the length is d more: the area, p. 163, ex. 21. */
export function rectFractionPerimeter(rng: Rng): Made {
  const n = pick(rng, [6, 8, 10, 12])
  const l = int(rng, 4, 40)
  const parts = n / 2 - 1 // L = parts · l
  const d = (parts - 1) * l
  const L = parts * l
  const u = pick(rng, ['cm', 'm'])
  return {
    text: `Un teren de joacă are formă dreptunghiulară. Lățimea lui este egală cu $\\frac{1}{${n}}$ din perimetru, iar diferența dintre lungime și lățime este de ${d} ${u}. Ce arie are suprafața terenului?`,
    solution: lines(
      `Perimetrul are ${n} părți cât lățimea, deci semiperimetrul $L + l$ are ${n / 2} părți, iar lungimea $${n / 2} - 1 = ${parts}$ părți.`,
      parts === 2
        ? 'Diferența $L - l$ are $2 - 1 = 1$ parte, deci lățimea este chiar diferența:'
        : `Diferența $L - l$ are $${parts} - 1 = ${parts - 1}$ părți:`,
      show(`l = ${parts === 2 ? d : `${d} : ${parts - 1} = ${l}`}\\text{ ${u}}, \\qquad L = ${parts} \\cdot ${l} = ${L}\\text{ ${u}}`),
      show(`\\mathcal{A} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ ${u}}^2`),
    ),
    verify: () => 2 * (L + l) === n * l && L - l === d,
  }
}

/** The length multiplied, the width increased: the area grows by c, so the length is found, p. 163, ex. 27. */
export function rectGrowArea(rng: Rng): Made {
  const w = int(rng, 5, 40)
  const k = pick(rng, [2, 3])
  const a = int(rng, 1, 6)
  const L = int(rng, w + 1, 80)
  const per = k * (w + a) - w
  const c = L * per
  return {
    text: `Un dreptunghi are lățimea de ${w} cm. Calculați lungimea sa, știind că, dacă aceasta se mărește ${TIMES[k]}, iar lățimea se mărește cu ${a} cm, atunci aria dreptunghiului se mărește cu $${nr(c)}\\text{ cm}^2$.`,
    solution: lines(
      `Notăm cu $L$ lungimea. Aria inițială este $${w} \\cdot L$, iar noul dreptunghi are dimensiunile $${k}L$ și $${w} + ${a} = ${w + a}$ cm:`,
      show(`${k}L \\cdot ${w + a} - ${w}L = ${k * (w + a)}L - ${w}L = ${per}L`),
      show(`${per}L = ${nr(c)} \\Rightarrow L = ${nr(c)} : ${per} = ${L}\\text{ cm}`),
    ),
    verify: () => k * L * (w + a) - L * w === c,
  }
}

/** Both sides grow by c: from the two areas, the perimeter, p. 164, ex. 32. */
export function bothGrow(rng: Rng): Made {
  const l = int(rng, 2, 15)
  const L = int(rng, l + 1, 25)
  const c = int(rng, 1, 5)
  const A = L * l
  const A2 = (L + c) * (l + c)
  return {
    text: `Un dreptunghi are aria de $${A}\\text{ cm}^2$. Dacă mărim și lungimea, și lățimea cu ${c} cm, aria noului dreptunghi este egală cu $${A2}\\text{ cm}^2$. Aflați perimetrul dreptunghiului inițial.`,
    solution: lines(
      `Noul dreptunghi se împarte în: dreptunghiul inițial, două fâșii de lățime ${c} cm de-a lungul laturilor $L$ și $l$, și un pătrat de ${c} cm în colț:`,
      show(`${A2} = ${A} + ${c} \\cdot L + ${c} \\cdot l + ${c} \\cdot ${c} \\Rightarrow ${c === 1 ? '' : c + ' \\cdot '}(L + l) = ${A2} - ${A} - ${c * c} = ${c * (L + l)}`),
      show(`L + l = ${L + l}\\text{ cm}, \\qquad \\mathcal{P} = 2 \\cdot ${L + l} = ${2 * (L + l)}\\text{ cm}`),
    ),
    verify: () => A2 - A - c * c === c * (L + l),
  }
}

/** A rectangle cut from a sheet leaves a square: the square and both rectangles, p. 168, V.1. */
export function cutSquare(rng: Rng): Made {
  const s = 10 * int(rng, 4, 15)
  let t = 10 * int(rng, 1, 9)
  if (t === s) t -= 10
  const A1 = s * (s + t)
  const A2 = s * t
  return {
    text: lines(
      `Dintr-o bucată de tablă dreptunghiulară cu aria de $${D(A1, 2)}\\text{ dam}^2$ s-a tăiat o bucată dreptunghiulară cu aria de $${nr(A2)}\\text{ m}^2$. Se știe că bucata rămasă este un pătrat. Calculați:`,
      'a) lungimea laturii pătratului rămas;',
      'b) lungimea și lățimea dreptunghiului tăiat;',
      'c) lungimea și lățimea dreptunghiului inițial.',
    ),
    solution: lines(
      show(`${D(A1, 2)}\\text{ dam}^2 = ${nr(A1)}\\text{ m}^2, \\qquad \\mathcal{A}_{\\text{patrat}} = ${nr(A1)} - ${nr(A2)} = ${nr(s * s)}\\text{ m}^2`),
      show(`\\text{a) } ${s} \\cdot ${s} = ${nr(s * s)} \\Rightarrow \\ell = ${s}\\text{ m}`),
      `b) Bucata tăiată are o latură comună cu pătratul, de ${s} m:`,
      show(`${nr(A2)} : ${s} = ${t}\\text{ m}`),
      `deci dreptunghiul tăiat are ${s} m și ${t} m.`,
      `c) Dreptunghiul inițial are lățimea de ${s} m și lungimea de $${s} + ${t} = ${s + t}$ m.`,
    ),
    verify: () => (s + t) * s === A1 && s * t === A2 && A1 - A2 === s * s,
  }
}

/** A string of P m: a rectangle with the length k times the width, or a square? p. 164, ex. 34. */
export function farmerRope(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3])
    const P = 4 * (k + 1) * int(rng, 3, 60)
    const l = P / (2 * (k + 1))
    const s = P / 4
    if (!Number.isInteger(l) || !Number.isInteger(s)) continue
    const Ar = k * l * l
    return {
      text: `Un fermier are la dispoziție o sfoară lungă de ${P} m pentru a delimita o suprafață de teren. El are de ales între a delimita un dreptunghi cu lungimea ${TIMES[k]} mai mare decât lățimea sau un pătrat. Ce formă trebuie să aleagă pentru ca suprafața să fie cât mai mare? Cu câți metri pătrați este mai mare?`,
      solution: lines(
        `Dreptunghiul: semiperimetrul este $${P} : 2 = ${P / 2}$ m și are ${k + 1} părți cât lățimea:`,
        show(`l = ${P / 2} : ${k + 1} = ${l}\\text{ m}, \\quad L = ${k * l}\\text{ m}, \\quad \\mathcal{A} = ${k * l} \\cdot ${l} = ${nr(Ar)}\\text{ m}^2`),
        'Pătratul:',
        show(`\\ell = ${P} : 4 = ${s}\\text{ m}, \\quad \\mathcal{A} = ${s} \\cdot ${s} = ${nr(s * s)}\\text{ m}^2`),
        `Pătratul are aria mai mare, cu $${nr(s * s)} - ${nr(Ar)} = ${nr(s * s - Ar)}\\text{ m}^2$.`,
      ),
      verify: () => s * s > Ar && 2 * (k * l + l) === P && 4 * s === P,
    }
  }
}

// ---------- units of volume, the cube and the cuboid (pp. 175–177) ----------

/** Volumes in several units, in one unit, p. 175, ex. 1–7. */
export function volumeConvert(rng: Rng): Made {
  return convertMany(rng, VU, 9, RULE_VOL)
}

/** The sum of the edges of a cube: the edge and the volume in two units, p. 177, I.1 and p. 175, ex. 9. */
export function cubeEdges(rng: Rng): Made {
  const a = int(rng, 2, 15)
  const i = pick(rng, [1, 2, 3])
  const S = 12 * a
  const v = norm(a * a * a)
  return {
    text: `Suma lungimilor tuturor muchiilor unui cub este de $${S}${LU[i].tex}$. Calculați: a) lungimea muchiei cubului; b) volumul cubului, în ${VU[i].name} și în ${VU[i - 1].name}.`,
    solution: lines(
      'a) Cubul are 12 muchii egale:',
      show(`${S} : 12 = ${a}${LU[i].tex}`),
      show(`\\text{b) } \\mathcal{V} = ${a} \\cdot ${a} \\cdot ${a} = ${nr(a * a * a)}${VU[i].tex}, \\qquad ${convTex(v, VU[i], VU[i - 1])}`),
    ),
    verify: () => 12 * a === S && same(base(conv(v, VU[i], VU[i - 1]), VU[i - 1]), a ** 3 * P10(3 * i)),
  }
}

const DIMS = ['lungimea', 'lățimea', 'înălțimea']

/** A cuboid: the volume and two dimensions in mixed units give the third, p. 175, ex. 12 and p. 177, I.2, II.2. */
export function cuboidMissing(rng: Rng): Made {
  for (;;) {
    const i = pick(rng, [1, 2, 3])
    const d = [int(rng, 6, 20), int(rng, 3, 12), int(rng, 2, 12)]
    if (d[1] >= d[0]) continue
    const miss = int(rng, 0, 2)
    const given = [0, 1, 2].filter((j) => j !== miss)
    const other = pick(rng, [i - 1, i + 1])
    const which = pick(rng, given)
    const us = given.map((j) => (j === which ? LU[other] : LU[i]))
    const xs = given.map((j, t) => conv(norm(d[j]), LU[i], us[t]))
    const vol = norm(d[0] * d[1] * d[2])
    const uv = rng() < 0.5 ? VU[i] : VU[i - 1]
    const xv = conv(vol, VU[i], uv)
    if (xs.some((x) => x.k > 2)) continue
    const prod = d[given[0]] * d[given[1]]
    return {
      text: `Un paralelipiped dreptunghic are ${DIMS[given[0]]} de ${m(xs[0], us[0])}, ${DIMS[given[1]]} de ${m(xs[1], us[1])} și volumul de ${m(xv, uv)}. Calculați ${DIMS[miss]} paralelipipedului, în ${LNAME[i]}.`,
      solution: lines(
        `Exprimăm totul în ${LNAME[i]} și ${VU[i].name}:`,
        ...given.map((_, t) => (us[t] === LU[i] ? '' : show(convTex(xs[t], us[t], LU[i])))),
        uv === VU[i] ? '' : show(convTex(xv, uv, VU[i])),
        `Volumul este produsul celor trei dimensiuni, deci dimensiunea necunoscută este:`,
        show(`${nr(d[0] * d[1] * d[2])} : (${d[given[0]]} \\cdot ${d[given[1]]}) = ${nr(d[0] * d[1] * d[2])} : ${prod} = ${d[miss]}${LU[i].tex}`),
      ),
      verify: () => same(base(xv, uv), base(xs[0], us[0]) * base(xs[1], us[1]) * d[miss] * P10(i)),
    }
  }
}

/** Small boxes filling a big box exactly, p. 175, ex. 10. */
export function boxesFit(rng: Rng): Made {
  for (;;) {
    const s = [int(rng, 2, 8), int(rng, 1, 5), int(rng, 1, 4)]
    const k = [int(rng, 2, 15), int(rng, 2, 12), int(rng, 2, 25)]
    if (s[1] > s[0] || s[2] > s[1]) continue
    const B = s.map((v, i) => v * k[i])
    const n = k[0] * k[1] * k[2]
    const vs = s[0] * s[1] * s[2]
    const vb = B[0] * B[1] * B[2]
    return {
      text: `O cutie cu medicamente este un paralelipiped dreptunghic cu $L = ${s[0]}$ cm, $l = ${s[1]}$ cm și $h = ${s[2]}$ cm. Câte cutii sunt necesare pentru a umple un bax cu lungimea de ${B[0]} cm, lățimea de ${B[1]} cm și înălțimea de ${B[2]} cm?`,
      solution: lines(
        show(`\\mathcal{V}_{\\text{cutie}} = ${s.join(' \\cdot ')} = ${vs}\\text{ cm}^3, \\qquad \\mathcal{V}_{\\text{bax}} = ${B.join(' \\cdot ')} = ${nr(vb)}\\text{ cm}^3`),
        show(`${nr(vb)} : ${vs} = ${nr(n)} \\text{ cutii}`),
        `Cutiile chiar umplu baxul: pe lungime încap $${B[0]} : ${s[0]} = ${k[0]}$, pe lățime $${B[1]} : ${s[1]} = ${k[1]}$, pe înălțime $${B[2]} : ${s[2]} = ${k[2]}$, și $${k[0]} \\cdot ${k[1]} \\cdot ${k[2]} = ${nr(n)}$.`,
      ),
      verify: () => vb === n * vs,
    }
  }
}

/** Soil carried with a wheelbarrow: how many trips, p. 175, ex. 11. */
export function barrowTrips(rng: Rng): Made {
  const c = pick(rng, [40, 50, 60, 75, 80, 100, 120, 150]) // dm³
  const n = int(rng, 10, 80)
  const exact = rng() < 0.5
  const r = exact ? 0 : int(rng, 5, c - 5)
  const vol = n * c - r // dm³
  const xv = conv(norm(vol), VU[2], VU[3])
  const uc = pick(rng, [VU[1], VU[2]])
  const xc = conv(norm(c), VU[2], uc)
  return {
    text: exact
      ? `S-au transportat ${m(xv, VU[3])} de pământ cu o roabă în care încap ${m(xc, uc)}. Câte transporturi au fost efectuate, dacă roaba a fost plină de fiecare dată?`
      : `Trebuie transportați ${m(xv, VU[3])} de pământ cu o roabă în care încap ${m(xc, uc)}. Câte transporturi sunt necesare, cel puțin?`,
    solution: lines(
      'Exprimăm volumele în decimetri cubi:',
      show(`${convTex(xv, VU[3], VU[2])}${uc === VU[2] ? '' : `, \\qquad ${convTex(xc, uc, VU[2])}`}`),
      exact
        ? show(`${nr(vol)} : ${c} = ${n} \\text{ transporturi}`)
        : lines(show(`${nr(vol)} : ${c} = ${n - 1} \\text{ rest } ${c - r}`), `După ${de(n - 1)} transporturi mai rămân $${c - r}\\text{ dm}^3$, care cer încă un transport: în total ${de(n)} transporturi.`),
    ),
    verify: () => Math.ceil(vol / c) === n && same(base(xv, VU[3]), vol * 1e6) && same(base(xc, uc), c * 1e6),
  }
}

/** Volumes in several units added and subtracted, p. 176, ex. 13 and p. 177, IV. */
export function volumeMixed(rng: Rng): Made {
  return mixedSum(rng, VU, 6, RULE_VOL)
}

/** A vessel with its dimensions in three units: the litres, and how many buckets fill it, p. 177, III.3. */
export function capacityLitres(rng: Rng): Made {
  for (;;) {
    const d = [10 * int(rng, 3, 15), 10 * int(rng, 2, 8), 10 * int(rng, 2, 8)] // cm
    const g = pick(rng, [5, 8, 10, 12, 15, 20, 25])
    const L = (d[0] / 10) * (d[1] / 10) * (d[2] / 10)
    if (L % g !== 0) continue
    const us = shuffle(rng, [CM, DM, M])
    const xs = d.map((v, i) => conv(norm(v), CM, us[i]))
    const what = pick(rng, ['Un vas', 'Un acvariu', 'Un rezervor'])
    return {
      text: lines(
        `${what} în formă de paralelipiped dreptunghic are lungimea de ${m(xs[0], us[0])}, lățimea de ${m(xs[1], us[1])} și înălțimea de ${m(xs[2], us[2])}.`,
        'a) Câți litri de apă încap în el?',
        `b) Câte găleți de câte ${g} litri trebuie turnate ca să se umple?`,
      ),
      solution: lines(
        'Pentru că $1\\text{ dm}^3 = 1$ litru, exprimăm dimensiunile în decimetri:',
        show(xs.map((x, i) => (us[i] === DM ? `${T(x)}\\text{ dm}` : convTex(x, us[i], DM))).join(', \\qquad ')),
        show(`\\text{a) } \\mathcal{V} = ${d.map((v) => v / 10).join(' \\cdot ')} = ${nr(L)}\\text{ dm}^3 = ${nr(L)} \\text{ litri}`),
        `b) $${nr(L)} : ${g} = ${nr(L / g)}$ ${deW(L / g)}găleți.`,
      ),
      verify: () => d[0] * d[1] * d[2] === L * 1000 && xs.every((x, i) => same(base(x, us[i]), d[i] * 10)),
    }
  }
}

/** The edge k times larger: the volume k³ times larger, p. 177, III.1. */
export function cubeScale(rng: Rng): Made {
  const k = int(rng, 2, 5)
  const a = int(rng, 1, 9)
  const v1 = (k * a) ** 3
  const v2 = a ** 3
  return {
    text: lines(
      `Muchia cubului $C_1$ este ${TIMES[k]} mai mare decât muchia cubului $C_2$, care are ${a} cm.`,
      'a) Calculați volumele celor două cuburi.',
      `b) De câte ori este mai mare volumul cubului $C_1$ decât volumul cubului $C_2$? Este adevărat că volumul este tot ${TIMES[k]} mai mare?`,
    ),
    solution: lines(
      show(`\\text{a) } \\mathcal{V}_2 = ${a} \\cdot ${a} \\cdot ${a} = ${v2}\\text{ cm}^3, \\qquad \\mathcal{V}_1 = ${k * a} \\cdot ${k * a} \\cdot ${k * a} = ${nr(v1)}\\text{ cm}^3`),
      show(`\\text{b) } ${nr(v1)} : ${v2} = ${k ** 3} = ${k} \\cdot ${k} \\cdot ${k}`),
      `Fiecare dintre cele trei dimensiuni crește ${TIMES[k]}, deci volumul crește de $${k}^3 = ${k ** 3}$ ${deW(k ** 3)}ori, nu ${TIMES[k]}: afirmația este falsă.`,
    ),
    verify: () => v1 === k ** 3 * v2,
  }
}

/** Cubes in a box with a side that is not a multiple of the edge: the count is less than the ratio of the volumes, p. 175, ex. 8. */
export function cubesInBox(rng: Rng): Made {
  for (;;) {
    const e = pick(rng, [2, 3, 4])
    const B = [int(rng, 4, 15), int(rng, 4, 15), int(rng, 4, 15)]
    const vb = B[0] * B[1] * B[2]
    const ve = e ** 3
    const fit = B.map((b) => Math.floor(b / e))
    const n = fit[0] * fit[1] * fit[2]
    if (vb % ve !== 0 || n >= vb / ve || B.every((b) => b % e === 0) || n === 0) continue
    return {
      text: lines(
        `a) Care este volumul unui cub cu muchia de ${e} cm?`,
        `b) Care este volumul unei cutii în formă de paralelipiped dreptunghic, cu dimensiunile de ${B[0]} cm, ${B[1]} cm și ${B[2]} cm?`,
        `c) Câte cuburi cu muchia de ${e} cm încap în cutie, așezate cu fețele paralele cu ale cutiei?`,
        'd) De câte ori se cuprinde volumul cubului în volumul cutiei?',
        'e) De ce diferă răspunsurile de la punctele c) și d)?',
      ),
      solution: lines(
        show(`\\text{a) } ${e} \\cdot ${e} \\cdot ${e} = ${ve}\\text{ cm}^3 \\qquad \\text{b) } ${B.join(' \\cdot ')} = ${nr(vb)}\\text{ cm}^3`),
        `c) Pe fiecare dimensiune încap: ${B.map((b, i) => `$${b} : ${e} = ${fit[i]}${b % e ? ` \\text{ rest } ${b % e}` : ''}$`).join(', ')} cuburi, deci în total $${fit.join(' \\cdot ')} = ${n}$ cuburi.`,
        show(`\\text{d) } ${nr(vb)} : ${ve} = ${vb / ve}`),
        'e) Cuburile nu pot fi tăiate: pe dimensiunile care nu sunt multipli ai muchiei rămâne un spațiu gol, în care nu încape niciun cub întreg. Nu este o contradicție.',
      ),
      verify: () => n < vb / ve && fit.every((f, i) => f * e <= B[i] && (f + 1) * e > B[i]),
    }
  }
}

const BRICKS: [number, number, number][] = [[20, 10, 7], [25, 12, 6], [24, 12, 8], [20, 10, 5], [25, 10, 8]]

/** How many bricks make a wall, p. 176, ex. 14. */
export function bricksWall(rng: Rng): Made {
  for (;;) {
    const b = pick(rng, BRICKS)
    const L = 10 * int(rng, 20, 90)
    const H = 10 * int(rng, 15, 30)
    const G = pick(rng, [10, 20, 25, 30, 40])
    const vw = L * H * G
    const vb = b[0] * b[1] * b[2]
    if (vw % vb !== 0) continue
    const xL = conv(norm(L), CM, M)
    const xH = conv(norm(H), CM, M)
    return {
      text: `Trebuie construit un perete lung de $${T(xL)}$ m, înalt de $${T(xH)}$ m și gros de ${G} cm, cu ajutorul unor cărămizi având lungimea de ${b[0]} cm, lățimea de ${b[1]} cm și grosimea de ${b[2]} cm. Câte cărămizi sunt necesare (fără să ținem seama de mortar)?`,
      solution: lines(
        show(`${T(xL)}\\text{ m} = ${L}\\text{ cm}, \\qquad ${T(xH)}\\text{ m} = ${H}\\text{ cm}`),
        show(`\\mathcal{V}_{\\text{perete}} = ${L} \\cdot ${H} \\cdot ${G} = ${nr(vw)}\\text{ cm}^3, \\qquad \\mathcal{V}_{\\text{caramida}} = ${b.join(' \\cdot ')} = ${nr(vb)}\\text{ cm}^3`),
        `Numărul cărămizilor: $${nr(vw)} : ${nr(vb)} = ${nr(vw / vb)}$.`,
      ),
      verify: () => (vw / vb) * vb === L * H * G,
    }
  }
}

/** The concrete of a pool with walls and bottom of a given thickness, and its capacity, p. 176, ex. 15. */
export function poolConcrete(rng: Rng): Made {
  for (;;) {
    const L = 50 * int(rng, 20, 60)
    const l = 50 * int(rng, 10, 30)
    const h = 10 * int(rng, 12, 25)
    const g = pick(rng, [20, 25, 30, 40])
    if (l >= L) continue
    const ext = L * l * h
    const inner = (L - 2 * g) * (l - 2 * g) * (h - g)
    const conc = ext - inner
    if (conc % 1000 !== 0 || inner % 1000 !== 0) continue
    const x = [L, l, h].map((v) => conv(norm(v), CM, M))
    const ce = norm(conc, 6)
    return {
      text: `Se construiește din beton un bazin pentru înot, în formă de paralelipiped dreptunghic, deschis deasupra. Dimensiunile lui exterioare sunt: lungimea de $${T(x[0])}$ m, lățimea de $${T(x[1])}$ m și înălțimea de $${T(x[2])}$ m. Pereții și fundul bazinului au grosimea de ${g} cm. Calculați volumul betonului necesar și câți litri de apă încap în bazin.`,
      solution: lines(
        'Lucrăm în centimetri. Interiorul bazinului este mai scurt cu doi pereți pe lungime și pe lățime, și mai jos cu grosimea fundului:',
        show(`${nr(L)} - 2 \\cdot ${g} = ${nr(L - 2 * g)}\\text{ cm}, \\quad ${nr(l)} - 2 \\cdot ${g} = ${nr(l - 2 * g)}\\text{ cm}, \\quad ${h} - ${g} = ${h - g}\\text{ cm}`),
        show(`\\mathcal{V}_{\\text{exterior}} = ${nr(L)} \\cdot ${nr(l)} \\cdot ${h} = ${nr(ext)}\\text{ cm}^3`),
        show(`\\mathcal{V}_{\\text{interior}} = ${nr(L - 2 * g)} \\cdot ${nr(l - 2 * g)} \\cdot ${h - g} = ${nr(inner)}\\text{ cm}^3`),
        show(`\\mathcal{V}_{\\text{beton}} = ${nr(ext)} - ${nr(inner)} = ${nr(conc)}\\text{ cm}^3 = ${T(ce)}\\text{ m}^3`),
        `În bazin încap $${nr(inner)}\\text{ cm}^3 = ${nr(inner / 1000)}\\text{ dm}^3$, adică $${nr(inner / 1000)}$ ${deW(inner / 1000)}litri.`,
      ),
      verify: () => conc + inner === ext && same(base(ce, VU[3]), conc * 1000),
    }
  }
}

/** Dimensions that are consecutive (even, odd) numbers and the sum of the edges: the volume, p. 177, II.3. */
export function consecutiveCuboid(rng: Rng): Made {
  const kind = pick(rng, ['', 'pare ', 'impare '])
  const step = kind ? 2 : 1
  let a = int(rng, 2, 20)
  if (kind === 'pare ' && a % 2) a++
  if (kind === 'impare ' && a % 2 === 0) a++
  const d = [a, a + step, a + 2 * step]
  const S = 4 * sum(d)
  const V3 = d[0] * d[1] * d[2]
  return {
    text: `Dimensiunile unui paralelipiped dreptunghic, exprimate în centimetri, sunt numere naturale ${kind}consecutive. Dacă suma tuturor muchiilor paralelipipedului este egală cu ${S} cm, calculați volumul paralelipipedului.`,
    solution: lines(
      'Paralelipipedul are câte 4 muchii de fiecare lungime, deci suma celor trei dimensiuni este:',
      show(`${S} : 4 = ${sum(d)}\\text{ cm}`),
      `Notăm cea mai mică dimensiune cu $a$; celelalte sunt $a + ${step}$ și $a + ${2 * step}$:`,
      show(`3a + ${3 * step} = ${sum(d)} \\Rightarrow 3a = ${sum(d) - 3 * step} \\Rightarrow a = ${a}`),
      show(`\\mathcal{V} = ${d.join(' \\cdot ')} = ${nr(V3)}\\text{ cm}^3`),
    ),
    verify: () => 4 * (3 * a + 3 * step) === S && V3 === a * (a + step) * (a + 2 * step),
  }
}

// ---------- Supermate ----------

/** The areas of three faces of a cuboid: the volume, p. 176, ex. 17. */
export function contestFaceAreas(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = [int(rng, 2, 12), int(rng, 2, 12), int(rng, 2, 12)]
    if (new Set([a, b, c]).size < 3) continue
    const areas = shuffle(rng, [a * b, b * c, c * a])
    const V3 = a * b * c
    const P = areas[0] * areas[1] * areas[2]
    return {
      text: `Trei fețe ale unui paralelipiped dreptunghic au ariile de $${areas[0]}\\text{ cm}^2$, $${areas[1]}\\text{ cm}^2$, respectiv $${areas[2]}\\text{ cm}^2$. Calculați volumul paralelipipedului și dimensiunile lui.`,
      solution: lines(
        'Ariile celor trei fețe sunt $L \\cdot l$, $l \\cdot h$ și $h \\cdot L$. Înmulțindu-le, fiecare dimensiune apare de două ori:',
        show(`${areas.join(' \\cdot ')} = (L \\cdot l \\cdot h) \\cdot (L \\cdot l \\cdot h) = \\mathcal{V} \\cdot \\mathcal{V}`),
        show(`\\mathcal{V} \\cdot \\mathcal{V} = ${nr(P)} = ${V3} \\cdot ${V3} \\Rightarrow \\mathcal{V} = ${V3}\\text{ cm}^3`),
        `Fiecare dimensiune este volumul împărțit la aria feței care nu o conține: $${V3} : ${areas[0]} = ${V3 / areas[0]}$, $${V3} : ${areas[1]} = ${V3 / areas[1]}$, $${V3} : ${areas[2]} = ${V3 / areas[2]}$ (cm).`,
      ),
      verify: () => V3 * V3 === P && (V3 / areas[0]) * (V3 / areas[1]) * (V3 / areas[2]) === V3,
    }
  }
}

/** Strawberries from a rectangle: the harvest split into three consecutive numbers, p. 164, ex. 39. */
export function contestStrawberries(rng: Rng): Made {
  for (;;) {
    const k = pick(rng, [2, 3, 4])
    const l = int(rng, 5, 60)
    const L = k * l
    const P = 2 * (L + l)
    const q = int(rng, 2, 9)
    const total = L * l * q
    const even = rng() < 0.4
    if (total % 3 !== 0 || (even && (total / 3) % 2 !== 0)) continue
    const mid = total / 3
    const st = even ? 2 : 1
    const xP = conv(norm(P), M, DAM)
    return {
      text: `De pe un teren în formă de dreptunghi, cu perimetrul de ${m(xP, DAM)} și lățimea ${TIMES[k]} mai mică decât lungimea, s-au recoltat căpșuni, în medie ${q} kg pe metru pătrat. Căpșunile au fost împărțite la trei unități de vânzare. Aflați cele trei cantități, știind că ele sunt reprezentate prin trei numere naturale ${even ? 'pare ' : ''}consecutive.`,
      solution: lines(
        show(`${convTex(xP, DAM, M)}, \\qquad L + l = ${P / 2}\\text{ m}`),
        `Lungimea are ${k} părți cât lățimea, deci împreună ${k + 1} părți:`,
        show(`l = ${P / 2} : ${k + 1} = ${l}\\text{ m}, \\quad L = ${L}\\text{ m}, \\quad \\mathcal{A} = ${L} \\cdot ${l} = ${nr(L * l)}\\text{ m}^2`),
        show(`${nr(L * l)} \\cdot ${q} = ${nr(total)}\\text{ kg}`),
        `Suma a trei numere ${even ? 'pare ' : ''}consecutive este de trei ori numărul din mijloc:`,
        show(`${nr(total)} : 3 = ${nr(mid)}, \\qquad ${nr(mid - st)}\\text{ kg}, \\quad ${nr(mid)}\\text{ kg}, \\quad ${nr(mid + st)}\\text{ kg}`),
      ),
      verify: () => mid - st + mid + mid + st === total && (!even || mid % 2 === 0) && 2 * (L + l) === P,
    }
  }
}

/** The largest area of a rectangle with a given perimeter and different whole sides, after p. 164, ex. 38. */
export function contestMaxArea(rng: Rng): Made {
  const P = 2 * int(rng, 10, 120)
  const h = P / 2
  const dmin = h % 2 === 0 ? 2 : 1
  const best = (h * h - dmin * dmin) / 4
  const a = (h + dmin) / 2
  const b = (h - dmin) / 2
  return {
    text: `Perimetrul unui dreptunghi este de ${P} cm, iar lungimea și lățimea lui, exprimate în centimetri, sunt numere naturale diferite. Care este cea mai mare arie pe care o poate avea dreptunghiul?`,
    solution: lines(
      `Semiperimetrul este $L + l = ${h}$ cm. Folosim egalitatea $4 \\cdot L \\cdot l = (L + l)^2 - (L - l)^2$:`,
      show(`4 \\cdot \\mathcal{A} = ${h}^2 - (L - l)^2 = ${nr(h * h)} - (L - l)^2`),
      `Aria este cea mai mare când diferența $L - l$ este cea mai mică. $L - l$ nu poate fi 0 (laturile sunt diferite) și are aceeași paritate ca $L + l = ${h}$, deci cea mai mică valoare este ${dmin}.`,
      show(`L = ${a}\\text{ cm}, \\quad l = ${b}\\text{ cm}, \\quad \\mathcal{A} = ${a} \\cdot ${b} = ${nr(best)}\\text{ cm}^2`),
    ),
    verify: () => {
      let mx = 0
      for (let l = 1; 2 * l < h; l++) mx = Math.max(mx, l * (h - l))
      return mx === best && a * b === best
    },
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-length-perimeter',
    label: 'Unități de măsură pentru lungime. Perimetrul',
    topic: 'Geometrie',
    forms: {
      1: [lengthConvert, trianglePerimeterUnits, rectWidthLess, squareSidePerimeter],
      2: [rectRatioUnits, wireCost, fenceRolls, lengthMixed, postsAround],
      3: [plankCut, triangleCevian, parallelogramDiagonal, segmentsChain, rectThreeCases],
    },
  },
  {
    id: 'v-area-units',
    label: 'Unități de măsură pentru arie. Aria pătratului și a dreptunghiului',
    topic: 'Geometrie',
    forms: {
      1: [areaConvert, areaComplete, squareMean, rectShrinkGrow],
      2: [squareAreaUnits, tilesCount, tilesBoxes, sameAreaRectSquare, areaMixed, farmField, sideBetween],
      3: [squareToRect, rectDiffPerimeter, rectFractionPerimeter, rectGrowArea, bothGrow, cutSquare, farmerRope],
    },
  },
  {
    id: 'v-volume-units',
    label: 'Unități de măsură pentru volum. Volumul cubului și al paralelipipedului',
    topic: 'Geometrie',
    forms: {
      1: [volumeConvert, cubeEdges, cuboidMissing],
      2: [boxesFit, barrowTrips, volumeMixed, capacityLitres, cubeScale],
      3: [cubesInBox, bricksWall, poolConcrete, consecutiveCuboid],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-area-volume',
    label: 'Supermate: arii și volume',
    forms: [contestFaceAreas, contestStrawberries, contestMaxArea],
  },
]
