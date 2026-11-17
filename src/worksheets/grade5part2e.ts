// Grade V, Mate 2000+ Consolidare, part II (Paralela 45), pp. 178–199, photographed on 14 November 2026: the end of the
// unit on volumes (Testul 2, Testul 3, the self-assessment test), the end-of-year recap tests (Testele 1–10) and the
// problems given at school contests (pp. 195–199).
// Seen: pp. 178–182 and 185–199 (p. 183–184, the summary of the units of measure, only at the edge of a photo).
// Levels: the tests have no stars, so the level follows the content (short items = 1, problems = 2, the longer
// problems with several steps = 3); the contest pages go to CONTEST.
import type { Made } from './generators'
import { de, gcd, int, pick, reduce, shuffle, type Rng } from './tex'

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
const list = (items: (string | number)[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}` : String(items[0]))

/** n given in units of 10^-p, with the Romanian comma and without trailing zeros: dec(1250, 2) → 12{,}5. */
const dec = (n: number, p: number) => {
  const neg = n < 0
  const s = String(Math.abs(n)).padStart(p + 1, '0')
  const i = s.slice(0, s.length - p)
  const f = p ? s.slice(s.length - p).replace(/0+$/, '') : ''
  return (neg ? '-' : '') + (f ? `${i}{,}${f}` : i)
}
/** Like dec, but with all p decimals kept (an approximation to hundredths is written 11{,}50). */
const fix = (n: number, p: number) => {
  const s = String(n).padStart(p + 1, '0')
  return p ? `${s.slice(0, s.length - p)}{,}${s.slice(s.length - p)}` : s
}
/** A sum of money given in bani: 77625 → 776{,}25, 40000 → 400. */
const money = (b: number) => (b % 100 === 0 ? String(b / 100) : fix(b, 2))
/** units after a number inside a formula */
const u1 = (u: string) => `\\text{ ${u}}`
const u2 = (u: string) => `\\text{ ${u}}^2`
const u3 = (u: string) => `\\text{ ${u}}^3`
/** a unit standing alone, in a sentence: $\text{dm}^3$ */
const cube = (u: string) => `$\\text{${u}}^3$`
/** A measure given in minutes, in degrees and minutes: 1395 → 23^\circ 15'. */
const dm = (m: number) => {
  const d = Math.floor(m / 60)
  const r = m % 60
  return r === 0 ? `${d}^\\circ` : d === 0 ? `${r}'` : `${d}^\\circ ${r}'`
}
const ang = (name: string) => `\\sphericalangle ${name}`
const NAMES = ['Ana', 'Maria', 'Ioana', 'Elena', 'Alexandra', 'Sonia', 'Mihai', 'Andrei', 'Tudor', 'Vlad', 'Radu', 'Luca']
const cbrtInt = (v: number) => {
  let e = 0
  while ((e + 1) ** 3 <= v) e++
  return e
}
const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

/** p/q (0 < p, q > 0) as a decimal, periodic if needed: 7/3 → 2{,}(3), 11/30 → 0{,}3(6). With its parts. */
function expand(p: number, q: number) {
  const w = Math.floor(p / q)
  let r = p % q
  const digits: number[] = []
  const seen = new Map<number, number>()
  while (r !== 0 && !seen.has(r)) {
    seen.set(r, digits.length)
    r *= 10
    digits.push(Math.floor(r / q))
    r %= q
  }
  if (r === 0) return { w, pre: digits.join(''), rep: '', tex: digits.length ? `${w}{,}${digits.join('')}` : String(w) }
  const s = seen.get(r)!
  const pre = digits.slice(0, s).join('')
  const rep = digits.slice(s).join('')
  return { w, pre, rep, tex: `${w}{,}${pre}(${rep})` }
}
/** The rule that turns the periodic part 0,pre(rep) into a fraction: [\frac{36 - 3}{90}, numerator, denominator]. */
function periodicRule(pre: string, rep: string): [string, number, number] {
  const top = Number(pre + rep) - Number(pre || '0')
  const bottom = Number('9'.repeat(rep.length) + '0'.repeat(pre.length))
  const raw = pre ? `\\frac{${Number(pre + rep)} - ${Number(pre)}}{${bottom}}` : `\\frac{${Number(rep)}}{${bottom}}`
  return [raw, top, bottom]
}
/** a = b = c, without writing the same member twice in a row */
const chain = (...parts: string[]) => parts.filter((p, i) => i === 0 || p !== parts[i - 1]).join(' = ')
/** "1 oră", "3 ore", "20 de ore" */
const hours = (h: number) => (h === 1 ? 'o oră' : `${de(h)} ore`)
const minutes = (m: number) => (m === 1 ? 'un minut' : `${de(m)} minute`)
/** A time given in minutes, in words: 150 → "2 ore și 30 de minute". */
const duration = (M: number) => {
  const h = Math.floor(M / 60)
  const m = M % 60
  if (h === 0) return minutes(m)
  if (m === 0) return hours(h)
  return `${hours(h)} și ${minutes(m)}`
}

// ================= 1. volumes: the chapter tests (pp. 178–182) =================

/** The sum of the edges of a cube, then its volume in two units. p. 179, Testul 3, II.1; p. 178, Testul 2, II.3. */
export function volEdgeSum(rng: Rng): Made {
  const [u, v] = pick(rng, [['dm', 'cm'], ['m', 'dm'], ['cm', 'mm']] as const)
  const a = int(rng, 2, 30)
  const S = 12 * a
  const V = a ** 3
  return {
    text: `Suma lungimilor tuturor muchiilor unui cub este de ${S} ${u}. Calculați volumul cubului și exprimați-l în ${cube(u)} și în ${cube(v)}.`,
    solution: lines(
      'Cubul are 12 muchii, toate de aceeași lungime:',
      show(`l = ${S} : 12 = ${a}${u1(u)}`),
      show(`V = l^3 = ${a} \\cdot ${a} \\cdot ${a} = ${V}${u3(u)}`),
      `Cum $1${u3(u)} = 1000${u3(v)}$:`,
      show(`V = ${V}${u3(u)} = ${V * 1000}${u3(v)}`),
    ),
    verify: () => {
      let e = 1
      while (12 * e < S) e++
      return 12 * e === S && e * e * e * 1000 === V * 1000 && V === a * a * a
    },
  }
}

const LEN = ['mm', 'cm', 'dm', 'm', 'dam'] as const
/** A length given in cm, written in another unit: (8, 'dam') → 0{,}08. */
const fromCm = (v: number, u: (typeof LEN)[number]) => (u === 'mm' ? String(10 * v) : u === 'cm' ? String(v) : dec(v, LEN.indexOf(u) - 1))

/** The dimensions in three different units: the volume in cm³ and dm³. p. 178, Testul 2, I.1; p. 181, II.2. */
export function volMixedUnits(rng: Rng): Made {
  const L = int(rng, 20, 120)
  const l = int(rng, 10, L - 1)
  const h = int(rng, 5, 90)
  const [uL, ul, uh] = shuffle(rng, [...LEN]).slice(0, 3)
  const V = L * l * h
  const conv = (v: number, u: (typeof LEN)[number]) => (u === 'cm' ? `${v}${u1('cm')}` : `${fromCm(v, u)}${u1(u)} = ${v}${u1('cm')}`)
  return {
    text: `Un paralelipiped dreptunghic are lungimea $L = ${fromCm(L, uL)}${u1(uL)}$, lățimea $l = ${fromCm(l, ul)}${u1(ul)}$ și înălțimea $h = ${fromCm(h, uh)}${u1(uh)}$. Calculați volumul paralelipipedului, exprimat în ${cube('cm')}, apoi în ${cube('dm')}.`,
    solution: lines(
      'Transformăm toate dimensiunile în centimetri ($1 \\text{ m} = 100 \\text{ cm}$, $1 \\text{ dm} = 10 \\text{ cm}$, $1 \\text{ cm} = 10 \\text{ mm}$, $1 \\text{ dam} = 1000 \\text{ cm}$):',
      show(`L = ${conv(L, uL)}, \\quad l = ${conv(l, ul)}, \\quad h = ${conv(h, uh)}`),
      show(`V = L \\cdot l \\cdot h = ${L} \\cdot ${l} \\cdot ${h} = ${V}${u3('cm')}`),
      `Cum $1${u3('dm')} = 1000${u3('cm')}$, avem $V = ${dec(V, 3)}${u3('dm')}$.`,
    ),
    verify: () => {
      const back = (u: (typeof LEN)[number], v: number) => Math.round(Number(fromCm(v, u).replace('{,}', '.')) * [0.1, 1, 10, 100, 1000][LEN.indexOf(u)])
      return back(uL, L) * back(ul, l) * back(uh, h) === V
    },
  }
}

const VOL = ['mm', 'cm', 'dm', 'm', 'dam', 'hm'] as const
/** A sum and difference of volumes in three units, in a given unit. p. 180, IV; p. 179, IV. */
export function volUnitSum(rng: Rng): Made {
  for (;;) {
    const t = int(rng, 1, 4)
    // each term in units of VOL[t - 1], that is in thousandths of the unit of the answer
    const terms = [
      { k: 100 * int(rng, 1, 99), j: t - 1 },
      { k: 1000 * int(rng, 1, 30) + 100 * int(rng, 0, 9), j: t },
      { k: 100 * int(rng, 5, 400), j: t + 1 },
    ]
    const order = shuffle(rng, terms).map((x, i) => ({ ...x, s: i === 0 ? 1 : pick(rng, [1, -1]) }))
    let run = 0
    let ok = true
    for (const x of order) {
      run += x.s * x.k
      if (run <= 0) ok = false
    }
    if (!ok || order.every((x) => x.s === 1)) continue
    const wr = (x: { k: number; j: number }) => `${dec(x.k, 3 * (x.j - t + 1))}${u3(VOL[x.j])}`
    const expr = order.map((x, i) => (i === 0 ? '' : x.s > 0 ? ' + ' : ' - ') + wr(x)).join('')
    const inT = order.map((x, i) => (i === 0 ? '' : x.s > 0 ? ' + ' : ' - ') + dec(x.k, 3)).join('')
    return {
      text: `Calculați și exprimați rezultatul în ${cube(VOL[t])}: $${expr}$.`,
      solution: lines(
        `O unitate de volum este de 1000 de ori mai mare decât cea imediat mai mică. Transformăm fiecare termen în ${cube(VOL[t])}:`,
        show(order.filter((x) => x.j !== t).map((x) => `${wr(x)} = ${dec(x.k, 3)}${u3(VOL[t])}`).join(', \\quad ')),
        show(`${inT} = ${dec(run, 3)}${u3(VOL[t])}`),
      ),
      // read the written numbers back and convert them with the factor 1000 between neighbouring units
      verify: () => {
        const total = order.reduce((s, x) => s + x.s * Number(dec(x.k, 3 * (x.j - t + 1)).replace('{,}', '.')) * 1000 ** (x.j - t + 1), 0)
        return Math.abs(total - run) < 1e-6 && run > 0
      },
    }
  }
}

/** The volume of a cube: its edge and the sum of its edges. p. 181, II.1; p. 178, Testul 2, II.3. */
export function volCubeFromVolume(rng: Rng): Made {
  const u = pick(rng, ['cm', 'dm', 'm'])
  const a = int(rng, 2, 15)
  const V = a ** 3
  return {
    text: `Volumul unui cub este de $${V}${u3(u)}$. Aflați lungimea muchiei cubului și suma lungimilor tuturor muchiilor lui.`,
    solution: lines(
      `Dacă muchia are lungimea $l$, atunci $l \\cdot l \\cdot l = ${V}$. Căutăm numărul natural care, înmulțit de trei ori cu el însuși, dă ${V}:`,
      show(`${a} \\cdot ${a} \\cdot ${a} = ${V}, \\quad \\text{deci } l = ${a}${u1(u)}`),
      'Cubul are 12 muchii egale:',
      show(`12 \\cdot ${a} = ${12 * a}${u1(u)}`),
    ),
    verify: () => cbrtInt(V) === a && cbrtInt(V) ** 3 === V,
  }
}

/** A full vessel: the litres, then p/q of the water taken out, the litres left and how much the level fell. p. 179, V.1. */
export function volRemoveFraction(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 4, 15)
    const l = int(rng, 2, L - 1)
    const h = int(rng, 3, 12)
    const q = int(rng, 3, 12)
    const p = int(rng, 1, q - 1)
    const V = L * l * h
    if (gcd(p, q) !== 1 || (V * p) % q || (10 * h * p) % q) continue
    const out = (V * p) / q
    const drop = (10 * h * p) / q
    return {
      text: lines(
        `Un vas are forma unui paralelipiped dreptunghic cu dimensiunile de ${L} dm, ${l} dm și ${h} dm și este plin cu apă.`,
        'a) Calculați câți litri de apă încap în vas.',
        `b) Dacă scoatem din vas o cantitate de apă egală cu $\\frac{${p}}{${q}}$ din cantitatea totală, calculați cantitatea de apă care rămâne în vas.`,
        'c) Calculați cu câți centimetri a scăzut nivelul apei din vas.',
      ),
      solution: lines(
        'a) Volumul vasului, știind că $1 \\text{ dm}^3 = 1 \\text{ l}$:',
        show(`V = ${L} \\cdot ${l} \\cdot ${h} = ${V}${u3('dm')} = ${V}${u1('l')}`),
        'b) Apa scoasă și apa rămasă:',
        show(`\\frac{${p}}{${q}} \\cdot ${V} = ${out}${u1('l')}, \\quad ${V} - ${out} = ${V - out}${u1('l')}`),
        `c) Apa scoasă ocupa un paralelipiped cu aceeași bază, de arie $${L} \\cdot ${l} = ${L * l}${u2('dm')}$. Înălțimea lui este scăderea nivelului:`,
        show(`${out} : ${L * l} = ${dec(drop, 1)}${u1('dm')} = ${drop}${u1('cm')}`),
      ),
      verify: () => L * l * drop === out * 10 && out * q === V * p && V - out > 0,
    }
  }
}

/** Buckets taken out of a tank: the level falls by d cm; the capacity of one bucket. p. 180, III.3. */
export function volBuckets(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 5, 15)
    const n = int(rng, 4, 30)
    const d = int(rng, 5, 40)
    const A = (10 * n * c) / d
    if (!Number.isInteger(A) || A < 12 || A > 400) continue
    return {
      text: `Dintr-un rezervor în formă de paralelipiped dreptunghic se scot ${de(n)} găleți cu apă, toate la fel de mari, iar apa din rezervor coboară cu ${d} cm. Știind că produsul dintre lungimea și lățimea rezervorului este de $${A}${u2('dm')}$, aflați capacitatea unei găleți.`,
      solution: lines(
        `Apa scoasă ocupa un paralelipiped cu baza de $${A}${u2('dm')}$ și înălțimea de $${d}${u1('cm')} = ${dec(d, 1)}${u1('dm')}$:`,
        show(`V = ${A} \\cdot ${dec(d, 1)} = ${n * c}${u3('dm')} = ${n * c}${u1('l')}`),
        `Această apă a umplut ${de(n)} găleți:`,
        show(`${n * c} : ${n} = ${c}${u1('l')}`),
        `Răspuns: o găleată are capacitatea de ${de(c)} litri.`,
      ),
      verify: () => A * d === 10 * n * c,
    }
  }
}

/** A cube-shaped pool: its volume, the litres up to a height, the days to empty it with k hl a day. p. 180, V.1. */
export function volCubeBasinDays(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 3, 10)
    const h = int(rng, 1, a - 1)
    const k = pick(rng, [5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 40, 50])
    const litres = a * a * h * 1000
    if (litres % (100 * k)) continue
    const days = litres / (100 * k)
    if (days < 4 || days > 2000) continue
    return {
      text: lines(
        `Un bazin în formă de cub are latura de ${a} m.`,
        'a) Calculați volumul bazinului.',
        `b) Dacă bazinul se umple cu apă până la înălțimea de ${h} m, calculați câți litri de apă sunt în bazin.`,
        `c) Știind că în fiecare zi se iau din bazin câte ${k} hl de apă, calculați în câte zile se golește bazinul.`,
      ),
      solution: lines(
        show(`\\text{a) } V = ${a} \\cdot ${a} \\cdot ${a} = ${a ** 3}${u3('m')}`),
        'b) Apa formează un paralelipiped cu aceeași bază și înălțimea apei:',
        show(`${a} \\cdot ${a} \\cdot ${h} = ${a * a * h}${u3('m')} = ${litres}${u3('dm')} = ${litres}${u1('l')}`),
        `c) $1 \\text{ hl} = 100 \\text{ l}$, deci $${k} \\text{ hl} = ${100 * k} \\text{ l}$:`,
        show(`${litres} : ${100 * k} = ${days}`),
        `Răspuns: bazinul se golește în ${days === 1 ? 'o zi' : `${de(days)} zile`}.`,
      ),
      verify: () => days * 100 * k === a * a * h * 1000 && h < a,
    }
  }
}

/** A full tank emptied through a tap: the litres, the time, the height for a given time. p. 178, V.2. */
export function volTapEmpty(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 2, 6)
    const l = int(rng, 1, L)
    const hd = int(rng, 10, 40) // dm
    const r = pick(rng, [20, 25, 40, 50, 60, 75, 80, 100, 120, 125, 150, 200, 250])
    const V = 10 * L * 10 * l * hd
    if (V % r) continue
    const M = V / r
    const H = int(rng, 1, 12)
    const base = 100 * L * l // dm²
    const hcm = (600 * H * r) / base // 60·H·r litres over the base, in dm, times 10
    if (!Number.isInteger(hcm) || hcm < 50 || hcm > 500 || hcm === 10 * hd) continue
    return {
      text: lines(
        `Un rezervor în formă de paralelipiped dreptunghic are lungimea de ${L} m, lățimea de ${l} m și înălțimea de $${dec(hd, 1)}$ m și este plin cu apă.`,
        'a) Calculați câți litri de apă încap în rezervor.',
        `b) Rezervorul se golește printr-un robinet prin care curg ${r} de litri pe minut. Calculați în cât timp se golește rezervorul.`,
        `c) Cât ar trebui să fie înălțimea unui rezervor cu aceeași bază, plin cu apă, pentru ca el să se golească prin același robinet în ${hours(H)}?`,
      ),
      solution: lines(
        `a) Transformăm în decimetri: $${L} \\text{ m} = ${10 * L} \\text{ dm}$, $${l} \\text{ m} = ${10 * l} \\text{ dm}$, $${dec(hd, 1)} \\text{ m} = ${hd} \\text{ dm}$.`,
        show(`V = ${10 * L} \\cdot ${10 * l} \\cdot ${hd} = ${V}${u3('dm')} = ${V}${u1('l')}`),
        'b) Împărțim cantitatea de apă la debitul robinetului:',
        show(`${V} : ${r} = ${M} \\text{ min}`),
        M >= 60 ? `adică ${duration(M)}.` : `Rezervorul se golește în ${duration(M)}.`,
        `c) În ${hours(H)} curg $${60 * H} \\cdot ${r} = ${60 * H * r}$ de litri. Baza are aria $${10 * L} \\cdot ${10 * l} = ${base}${u2('dm')}$:`,
        show(`h = ${60 * H * r} : ${base} = ${dec(hcm, 1)}${u1('dm')} = ${hcm}${u1('cm')}`),
      ),
      verify: () => M * r === V && hcm * base === 600 * H * r,
    }
  }
}

const PERIODIC: [number, number][] = [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [5, 12], [7, 12], [11, 12], [1, 12]]

/** An aquarium in mixed units, filled up to 0,8(3) of its height, then some litres taken out. p. 180, V.2. */
export function volAquariumPeriodic(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 10, 20)
    const l = int(rng, 3, L - 1)
    const h = int(rng, 3, 12)
    const [p, q] = pick(rng, PERIODIC)
    const V = L * l * h
    if ((V * p) % q) continue
    const filled = (V * p) / q
    const drop = int(rng, 1, Math.floor((10 * h * p) / q) - 1)
    if (drop < 1 || (L * l * drop) % 10) continue
    const X = (L * l * drop) / 10
    if (X >= filled) continue
    const e = expand(p, q)
    const [raw, top, bottom] = periodicRule(e.pre, e.rep)
    const [a, b] = shuffle(rng, NAMES).slice(0, 2)
    return {
      text: lines(
        `Un acvariu are forma unui paralelipiped dreptunghic cu lungimea de $${dec(L, 1)}$ m, lățimea de ${10 * l} cm și înălțimea de ${h} dm.`,
        'a) Calculați volumul acvariului.',
        `b) ${a} pune apă în acvariu până când aceasta se ridică la $${e.tex}$ din înălțimea acvariului. Calculați cantitatea de apă pusă de ${a} în acvariu.`,
        `c) ${b} scoate ${de(X)} litri de apă din acvariu. Calculați cu câți centimetri a scăzut nivelul apei din acvariu.`,
      ),
      solution: lines(
        `a) În decimetri: $${dec(L, 1)} \\text{ m} = ${L} \\text{ dm}$, $${10 * l} \\text{ cm} = ${l} \\text{ dm}$.`,
        show(`V = ${L} \\cdot ${l} \\cdot ${h} = ${V}${u3('dm')} = ${V}${u1('l')}`),
        'b) Transformăm fracția periodică în fracție ordinară:',
        show(chain(e.tex, raw, `\\frac{${top}}{${bottom}}`, `\\frac{${p}}{${q}}`)),
        `Apa ocupă $\\frac{${p}}{${q}}$ din înălțime, deci $\\frac{${p}}{${q}}$ din volum:`,
        show(`\\frac{${p}}{${q}} \\cdot ${V} = ${filled}${u1('l')}`),
        `c) Apa scoasă ocupa un paralelipiped cu baza de $${L} \\cdot ${l} = ${L * l}${u2('dm')}$:`,
        show(`${X} : ${L * l} = ${dec(drop, 1)}${u1('dm')} = ${drop}${u1('cm')}`),
      ),
      verify: () => expand(p, q).rep !== '' && filled * q === V * p && X * 10 === L * l * drop,
    }
  }
}

/** A cuboid with the volume of a cube: its height. p. 182, IV. */
export function volSameAsCube(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 9)
    const L = 10 * int(rng, 3, 20)
    const l = 10 * int(rng, 1, L / 10 - 1)
    const Vc = a ** 3 * 1000
    if (Vc % (L * l)) continue
    const h = Vc / (L * l) // cm
    if (h < 5 || h > 300) continue
    return {
      text: lines(
        `Un paralelipiped dreptunghic are același volum cu un cub a cărui muchie are lungimea de ${a} dm. Lungimea paralelipipedului este de ${L} cm, iar lățimea de ${l} cm. Calculați:`,
        `a) volumul cubului, în ${cube('cm')};`,
        'b) înălțimea paralelipipedului, în dm.',
      ),
      solution: lines(
        `a) $${a} \\text{ dm} = ${10 * a} \\text{ cm}$:`,
        show(`V = ${10 * a} \\cdot ${10 * a} \\cdot ${10 * a} = ${Vc}${u3('cm')}`),
        'b) Volumul paralelipipedului este $L \\cdot l \\cdot h$, deci înălțimea este volumul împărțit la aria bazei:',
        show(`h = ${Vc} : (${L} \\cdot ${l}) = ${Vc} : ${L * l} = ${h}${u1('cm')} = ${dec(h, 1)}${u1('dm')}`),
      ),
      verify: () => L * l * h === (10 * a) ** 3,
    }
  }
}

/** Every edge of a cube grows by d: the new volume is known; the first volume. p. 181, II.4. */
export function volEdgeIncreased(rng: Rng): Made {
  const u = pick(rng, ['cm', 'dm', 'm'])
  const a = int(rng, 1, 12)
  const d = int(rng, 1, 9)
  const e = a + d
  const V2 = e ** 3
  const V1 = a ** 3
  return {
    text: `Lungimea fiecărei muchii a unui cub se mărește cu ${d} ${u} și se obține un nou cub, cu volumul de $${V2}${u3(u)}$. Aflați volumul cubului inițial și cu cât a crescut volumul.`,
    solution: lines(
      `Muchia noului cub: căutăm numărul care înmulțit de trei ori cu el însuși dă ${V2}:`,
      show(`${e} \\cdot ${e} \\cdot ${e} = ${V2}`),
      `Deci muchia nouă are ${e} ${u}.`,
      'Muchia cubului inițial și volumul lui:',
      show(`${e} - ${d} = ${a}${u1(u)}, \\quad V = ${a} \\cdot ${a} \\cdot ${a} = ${V1}${u3(u)}`),
      show(`${V2} - ${V1} = ${V2 - V1}${u3(u)}`),
      `Răspuns: volumul inițial era $${V1}${u3(u)}$ și a crescut cu $${V2 - V1}${u3(u)}$.`,
    ),
    verify: () => cbrtInt(V2) - d === a && (a + d) ** 3 - a ** 3 === V2 - V1,
  }
}

/** R₂ has k times the edge of R₁: how many times the volume, the edge and the capacity of R₁. p. 191, Testul 7, IV.1. */
export function volScaledReservoir(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 5)
    const a1 = int(rng, 2, 12)
    const a2 = k * a1
    const C = a2 ** 3
    if (C > 400000) continue
    const times = k === 2 ? 'dublând' : k === 3 ? 'triplând' : `mărind de ${k} ori`
    return {
      text: lines(
        `Două rezervoare pentru apă, notate $R_1$ și $R_2$, au formă de cub. Rezervorul $R_2$ a fost construit ${times} lungimea laturii rezervorului $R_1$.`,
        'a) Calculați de câte ori este mai mare volumul rezervorului $R_2$ față de volumul rezervorului $R_1$.',
        `b) Dacă rezervorul $R_2$ are o capacitate de ${de(C)} litri, calculați lungimea laturii rezervorului $R_1$.`,
        'c) Calculați capacitatea rezervorului $R_1$.',
      ),
      solution: lines(
        `a) Dacă latura lui $R_1$ este $l$, latura lui $R_2$ este $${k} \\cdot l$:`,
        show(`V_2 = ${k}l \\cdot ${k}l \\cdot ${k}l = ${k ** 3} \\cdot l^3 = ${k ** 3} \\cdot V_1`),
        `Volumul lui $R_2$ este de ${de(k ** 3)} ori mai mare.`,
        `b) $${C} \\text{ l} = ${C} \\text{ dm}^3$ și $${a2} \\cdot ${a2} \\cdot ${a2} = ${C}$, deci latura lui $R_2$ este de ${a2} dm, iar a lui $R_1$:`,
        show(`${a2} : ${k} = ${a1}${u1('dm')}`),
        show(`\\text{c) } V_1 = ${a1} \\cdot ${a1} \\cdot ${a1} = ${a1 ** 3}${u3('dm')} = ${a1 ** 3}${u1('l')}`),
      ),
      verify: () => a1 ** 3 * k ** 3 === C && cbrtInt(C) === a2,
    }
  }
}

/** N small cubes: the largest cube that can be built and the cubes left. p. 180, III.2; p. 182, V. */
export function volCubesFromSmall(rng: Rng): Made {
  for (;;) {
    const N = int(rng, 10, 1500)
    const s = int(rng, 1, 5)
    const k = cbrtInt(N)
    if (k ** 3 === N) continue
    return {
      text: lines(
        `Din ${de(N)} cuburi cu latura de ${s} cm se construiește un cub cu volumul cel mai mare posibil.`,
        'a) Ce lungime are latura cubului construit?',
        'b) Câte cuburi rămân neutilizate?',
      ),
      solution: lines(
        'Un cub cu $n$ cuburi mici pe fiecare muchie folosește $n \\cdot n \\cdot n$ cuburi. Căutăm cel mai mare $n$ pentru care ajung cuburile:',
        show(`${k}^3 = ${k ** 3} \\le ${N} < ${(k + 1) ** 3} = ${k + 1}^3`),
        `a) Pe fiecare muchie sunt ${k} cuburi, deci latura este $${k} \\cdot ${s} = ${k * s}$ cm.`,
        show(`\\text{b) } ${N} - ${k ** 3} = ${N - k ** 3}`),
        `Rămân neutilizate ${de(N - k ** 3)} cuburi.`,
      ),
      verify: () => k ** 3 < N && (k + 1) ** 3 > N,
    }
  }
}

/** A cube cut into cuboids p × q × r: how many. p. 196, ex. 15; p. 182, V.b. */
export function volCutCube(rng: Rng): Made {
  for (;;) {
    const [p, q, r] = [int(rng, 1, 12), int(rng, 2, 12), int(rng, 2, 12)]
    if (p === q && q === r) continue
    const base = lcm(lcm(p, q), r)
    const m = int(rng, 1, 6)
    const a = base * m
    if (a > 120 || a < 6) continue
    const n = (a / p) * (a / q) * (a / r)
    return {
      text: `Un cub cu latura de ${a} cm se taie în paralelipipede dreptunghice, toate cu dimensiunile de ${p} cm, ${q} cm și ${r} cm. Câte paralelipipede se obțin?`,
      solution: lines(
        `Pe fiecare dintre cele trei direcții ale cubului, latura de ${a} cm se împarte exact:`,
        show(`${a} : ${p} = ${a / p}, \\quad ${a} : ${q} = ${a / q}, \\quad ${a} : ${r} = ${a / r}`),
        show(`${a / p} \\cdot ${a / q} \\cdot ${a / r} = ${n}`),
        `Verificare cu volumele: $${a}^3 : (${p} \\cdot ${q} \\cdot ${r}) = ${a ** 3} : ${p * q * r} = ${n}$.`,
        `Răspuns: ${de(n)} paralelipipede.`,
      ),
      verify: () => a ** 3 === n * p * q * r && a % p === 0 && a % q === 0 && a % r === 0,
    }
  }
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23]
/** The dimensions are prime numbers and the volume is known: the sum of the edges. p. 179, Testul 3, II.2. */
export function volPrimeDims(rng: Rng): Made {
  const u = pick(rng, ['cm', 'dm', 'm'])
  const [a, b, c] = shuffle(rng, PRIMES).slice(0, 3).sort((x, y) => x - y)
  const V = a * b * c
  return {
    text: `Dimensiunile unui paralelipiped dreptunghic, exprimate în ${u === 'm' ? 'metri' : u === 'dm' ? 'decimetri' : 'centimetri'}, sunt numere prime diferite. Dacă volumul paralelipipedului este de $${V}${u3(u)}$, calculați suma lungimilor tuturor muchiilor lui.`,
    solution: lines(
      `Produsul celor trei dimensiuni este ${V}. Descompunem în factori primi:`,
      show(`${V} = ${a} \\cdot ${b} \\cdot ${c}`),
      `Descompunerea este unică, deci dimensiunile sunt ${a} ${u}, ${b} ${u} și ${c} ${u}. Paralelipipedul are câte 4 muchii de fiecare lungime:`,
      show(`4 \\cdot (${a} + ${b} + ${c}) = 4 \\cdot ${a + b + c} = ${4 * (a + b + c)}${u1(u)}`),
    ),
    verify: () => {
      const f: number[] = []
      let v = V
      for (let d = 2; v > 1; d++) while (v % d === 0) { f.push(d); v /= d }
      return f.length === 3 && 4 * (f[0] + f[1] + f[2]) === 4 * (a + b + c)
    },
  }
}

/** A full vessel holds a metal cube; taking the cube out lowers the water: the edge of the cube. p. 179, Testul 3, II.3. */
export function volMetalCube(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 6)
    const L = int(rng, 6, 25)
    const l = int(rng, 4, L)
    const h = int(rng, 8, 30)
    const num = a ** 3 * 10
    if (num % (L * l) || l < a + 1 || h <= a) continue
    const d = num / (L * l) // cm
    if (d < 1 || d > 40) continue
    const dropText = d % 10 === 0 ? `$${dec(d, 2)}$ m` : `${d} cm`
    return {
      text: `Un vas plin cu apă, în formă de paralelipiped dreptunghic cu $L = ${L}$ dm, $l = ${l}$ dm și $h = ${h}$ dm, conține un cub din metal. Dacă, după scoaterea cubului din vas, apa coboară cu ${dropText}, aflați lungimea laturii cubului.`,
      solution: lines(
        `Volumul cubului este egal cu volumul cu care a scăzut apa: un paralelipiped cu baza de $${L} \\cdot ${l} = ${L * l}${u2('dm')}$ și înălțimea de $${d}${u1('cm')} = ${dec(d, 1)}${u1('dm')}$.`,
        show(`V = ${L * l} \\cdot ${dec(d, 1)} = ${a ** 3}${u3('dm')}`),
        show(`${a} \\cdot ${a} \\cdot ${a} = ${a ** 3}, \\quad \\text{deci latura cubului este } ${a}${u1('dm')}`),
      ),
      verify: () => L * l * d === 10 * a ** 3 && cbrtInt(a ** 3) === a,
    }
  }
}

// ================= 2. recap tests: numbers and problems (pp. 185–194) =================

/** a · b + c : d with decimals. p. 185, Testul 1, I.3; p. 187, Testul 3, II.1. */
export function recDecCalc(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 11, 999)
    const b = int(rng, 2, 40)
    const d = pick(rng, [2, 4, 5, 8])
    const c = int(rng, 11, 999)
    if (a % 10 === 0 || c % 10 === 0 || (100 * c) % d) continue
    const P = 10 * a * b
    const Q = (100 * c) / d
    return {
      text: `Calculați: $${dec(a, 2)} \\cdot ${b} + ${dec(c, 1)} : ${d}$.`,
      solution: lines(
        'Efectuăm întâi înmulțirea și împărțirea, apoi adunarea:',
        show(`${dec(a, 2)} \\cdot ${b} = ${dec(P, 3)}, \\quad ${dec(c, 1)} : ${d} = ${dec(Q, 3)}`),
        show(`${dec(P, 3)} + ${dec(Q, 3)} = ${dec(P + Q, 3)}`),
      ),
      verify: () => Math.abs((a / 100) * b + c / 10 / d - (P + Q) / 1000) < 1e-9,
    }
  }
}

/** a · (b − c) + e, where b − c is whole. p. 186, Testul 2, I.4. */
export function recDecBracket(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 101, 999)
    const c = int(rng, 1, 999)
    const n = int(rng, 1, 9)
    const b = c + 100 * n
    const e = int(rng, 1, 99)
    if (a % 10 === 0 || c % 10 === 0 || e % 10 === 0) continue
    return {
      text: `Calculați: $${dec(a, 2)} \\cdot (${dec(b, 2)} - ${dec(c, 2)}) + ${dec(e, 1)}$.`,
      solution: lines(
        'Efectuăm întâi paranteza, apoi înmulțirea, apoi adunarea:',
        show(`${dec(b, 2)} - ${dec(c, 2)} = ${n}, \\quad ${dec(a, 2)} \\cdot ${n} = ${dec(a * n, 2)}`),
        show(`${dec(a * n, 2)} + ${dec(e, 1)} = ${dec(a * n + 10 * e, 2)}`),
      ),
      verify: () => b - c === 100 * n && Math.abs((a / 100) * ((b - c) / 100) + e / 10 - (a * n + 10 * e) / 100) < 1e-9,
    }
  }
}

/** The mean of two or three numbers is known: the unknown number. p. 187, Testul 3, II.2. */
export function recMeanUnknown(rng: Rng): Made {
  for (;;) {
    const three = rng() < 0.5
    const known = three ? [int(rng, 10, 400), int(rng, 10, 400)] : [int(rng, 10, 400)]
    const x = int(rng, 5, 400)
    const n = known.length + 1
    const S = known.reduce((s, v) => s + v, 0) + x // tenths
    if ((100 * S) % n) continue
    const m = (100 * S) / n / 10 // hundredths
    if (!Number.isInteger(m) || m % 10 === 0) continue
    const nums = known.map((v) => dec(v, 1))
    return {
      text: `Media aritmetică a numerelor ${list([...nums.map((v) => `$${v}$`), '$x$'])} este $${dec(m, 2)}$. Aflați numărul $x$.`,
      solution: lines(
        `Suma celor ${n} numere este media înmulțită cu ${n}:`,
        show(`${nums.join(' + ')} + x = ${n} \\cdot ${dec(m, 2)} = ${dec(S, 1)}`),
        show(`x = ${dec(S, 1)} - ${n === 2 ? nums[0] : `(${nums.join(' + ')})`} = ${dec(x, 1)}`),
      ),
      verify: () => (known.reduce((s, v) => s + v, 0) + x) * 10 === n * m,
    }
  }
}

/** Approximations of a number with four decimals. p. 191, Testul 7, III; p. 185, I.1; p. 189, I.2. */
export function recRoundings(rng: Rng): Made {
  const w = int(rng, 1, 99)
  const digits = Array.from({ length: 4 }, () => int(rng, 1, 9))
  const N = w * 10000 + Number(digits.join(''))
  const lack1 = Math.floor(N / 1000)
  const excess3 = Math.ceil(N / 10)
  const round2 = Math.floor((N + 50) / 100)
  const round1 = Math.floor((N + 500) / 1000)
  const x = dec(N, 4)
  return {
    text: lines(
      `Se consideră numărul $${x}$. Scrieți:`,
      'a) aproximarea lui prin lipsă la ordinul zecimilor;',
      'b) aproximarea lui prin adaos la ordinul miimilor;',
      'c) rotunjirea lui la ordinul sutimilor;',
      'd) rotunjirea lui la ordinul zecimilor.',
    ),
    solution: lines(
      `a) Prin lipsă păstrăm cifrele până la zecimi și renunțăm la celelalte: $${fix(lack1, 1)}$.`,
      `b) Prin adaos păstrăm cifrele până la miimi și mărim cifra miimilor cu 1: $${fix(excess3, 3)}$.`,
      `c) Cifra miimilor este ${digits[2]}, ${digits[2] >= 5 ? 'cel puțin 5, deci aproximăm prin adaos' : 'mai mică decât 5, deci aproximăm prin lipsă'}: $${fix(round2, 2)}$.`,
      `d) Cifra sutimilor este ${digits[1]}, ${digits[1] >= 5 ? 'cel puțin 5, deci aproximăm prin adaos' : 'mai mică decât 5, deci aproximăm prin lipsă'}: $${fix(round1, 1)}$.`,
    ),
    verify: () => lack1 * 1000 <= N && excess3 * 10 >= N && Math.abs(round2 * 100 - N) <= 50 && Math.abs(round1 * 1000 - N) <= 500,
  }
}

/** A periodic decimal with a whole part, as a mixed number. p. 193, Testul 9, III; p. 194, Testul 10, III. */
export function recPeriodicMixed(rng: Rng): Made {
  for (;;) {
    const w = int(rng, 1, 9)
    const preLen = int(rng, 0, 1)
    const repLen = int(rng, 1, 2)
    const pre = Array.from({ length: preLen }, () => int(rng, 0, 9)).join('')
    const rep = Array.from({ length: repLen }, () => int(rng, 0, 9)).join('')
    if (/^0+$/.test(rep) || /^9+$/.test(rep) || (repLen === 2 && rep[0] === rep[1])) continue
    if (pre && pre[pre.length - 1] === rep[rep.length - 1]) continue
    const [raw, top, bottom] = periodicRule(pre, rep)
    const [n, d] = reduce(top, bottom)
    const tex = `${w}{,}${pre}(${rep})`
    return {
      text: `Scrieți fracția zecimală periodică $${tex}$ sub formă de număr mixt, cu fracția ireductibilă.`,
      solution: lines(
        `Partea întreagă este ${w}. Partea zecimală este o fracție periodică ${pre ? 'mixtă' : 'simplă'}:`,
        show(chain(`0{,}${pre}(${rep})`, raw, `\\frac{${top}}{${bottom}}`, `\\frac{${n}}{${d}}`)),
        show(`${tex} = ${w}\\frac{${n}}{${d}}`),
      ),
      verify: () => expand(w * d + n, d).tex === tex,
    }
  }
}

/** The ratio of two natural numbers and their difference: the larger. p. 186, Testul 2, II.2. */
export function recRatioDiff(rng: Rng): Made {
  for (;;) {
    const q = int(rng, 2, 9)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const k = int(rng, 2, 30)
    const d = (q - p) * k
    return {
      text: `Raportul a două numere naturale este $\\frac{${p}}{${q}}$, iar diferența lor este ${d}. Aflați cele două numere.`,
      solution: lines(
        `Numărul mai mic are ${p === 1 ? 'o parte' : `${p} părți`}, iar cel mai mare are ${q} părți egale. Diferența lor înseamnă ${q - p === 1 ? `o parte, deci o parte este ${d}.` : `${q - p} părți:`}`,
        ...(q - p === 1 ? [] : [show(`${d} : ${q - p} = ${k}`)]),
        show(`${p} \\cdot ${k} = ${p * k}, \\quad ${q} \\cdot ${k} = ${q * k}`),
        `Numerele sunt ${p * k} și ${q * k}.`,
      ),
      verify: () => q * k - p * k === d && (p * k) * q === (q * k) * p,
    }
  }
}

/** The difference of two positive numbers, one k times the other. p. 191, Testul 7, II.4. */
export function recTimesDiff(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 11, 300)
    const k = int(rng, 2, 9)
    if (s % 10 === 0) continue
    const D = (k - 1) * s
    return {
      text: `Diferența a două numere raționale pozitive este $${dec(D, 1)}$. Unul dintre numere este de ${k} ori mai mare decât celălalt. Aflați cele două numere.`,
      solution: lines(
        `Numărul mai mic are o parte, iar cel mai mare are ${k} părți; diferența lor are ${k - 1 === 1 ? 'o parte' : `${k - 1} părți`}:`,
        show(`${dec(D, 1)} : ${k - 1} = ${dec(s, 1)}, \\quad ${k} \\cdot ${dec(s, 1)} = ${dec(k * s, 1)}`),
        `Numerele sunt $${dec(s, 1)}$ și $${dec(k * s, 1)}$.`,
      ),
      verify: () => k * s - s === D,
    }
  }
}

/** p/q of a book read, n pages left: the book. p. 186, Testul 2, II.1. */
export function recBookPart(rng: Rng): Made {
  for (;;) {
    const q = int(rng, 2, 9)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const t = int(rng, 5, 60)
    const total = q * t
    const n = (q - p) * t
    const who = pick(rng, NAMES)
    return {
      text: `După ce ${who} a citit $\\frac{${p}}{${q}}$ dintr-o carte, i-au mai rămas de citit ${de(n)} pagini. Câte pagini are cartea și câte pagini a citit ${who}?`,
      solution: lines(
        `Au rămas de citit $1 - \\frac{${p}}{${q}} = \\frac{${q - p}}{${q}}$ din carte, adică ${de(n)} pagini. ${q - p === 1 ? `Deci o parte din cele ${q} are ${de(t)} pagini, iar toată cartea:` : `O parte din cele ${q}:`}`,
        ...(q - p === 1 ? [] : [show(`${n} : ${q - p} = ${t}`)]),
        show(`${q} \\cdot ${t} = ${total}, \\quad ${total} - ${n} = ${total - n}`),
        `Cartea are ${de(total)} pagini, iar ${who} a citit ${de(total - n)} pagini.`,
      ),
      verify: () => total * (q - p) === n * q && (total * p) / q === total - n,
    }
  }
}

/** Two savings together and the difference: the larger one. p. 192, Testul 8, II.4. */
export function recSavings(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 10000, 60000)
    const d = int(rng, 100, 5000)
    if (x % 5 || d % 5 || x - d < 1000) continue
    const S = 2 * x - d
    const [a, b] = shuffle(rng, NAMES).slice(0, 2)
    return {
      text: `${a} și ${b} au economisit împreună $${money(S)}$ lei. Dacă ${a} a economisit cu $${money(d)}$ lei mai mult decât ${b}, câți lei a economisit fiecare?`,
      solution: lines(
        `Dacă ${b} ar fi economisit tot atât cât ${a}, suma ar fi fost mai mare cu $${money(d)}$ lei și ar fi conținut de două ori suma lui ${a}:`,
        show(`${money(S)} + ${money(d)} = ${money(S + d)}, \\quad ${money(S + d)} : 2 = ${money(x)}`),
        show(`${money(x)} - ${money(d)} = ${money(x - d)}`),
        `${a} a economisit $${money(x)}$ lei, iar ${b} $${money(x - d)}$ lei.`,
      ),
      verify: () => x + (x - d) === S && (S + d) % 2 === 0,
    }
  }
}

const DAILY = [
  { who: 'un tractor ară', of: 'dintr-un teren agricol', done: 'va fi arat întregul teren' },
  { who: 'o echipă de zugravi zugrăvește', of: 'dintr-o clădire', done: 'va fi zugrăvită toată clădirea' },
  { who: 'un muncitor sapă', of: 'dintr-un șanț', done: 'va fi săpat tot șanțul' },
  { who: 'un elev rezolvă', of: 'din problemele unei culegeri', done: 'vor fi rezolvate toate problemele' },
] as const
/** 0,1(6) of a field each day: in how many days. p. 193, Testul 9, II.4. */
export function recPeriodicDays(rng: Rng): Made {
  const n = pick(rng, [3, 6, 9, 11, 12, 15, 18, 22, 24, 30, 33, 36, 45])
  const c = pick(rng, DAILY)
  const e = expand(1, n)
  const [raw, top, bottom] = periodicRule(e.pre, e.rep)
  return {
    text: `Într-o zi, ${c.who} $${e.tex}$ ${c.of}. Lucrând la fel în fiecare zi, în câte zile ${c.done}?`,
    solution: lines(
      'Transformăm fracția periodică în fracție ordinară:',
      show(chain(e.tex, raw, `\\frac{${top}}{${bottom}}`, `\\frac{1}{${n}}`)),
      `În fiecare zi se face $\\frac{1}{${n}}$ din toată lucrarea, deci întreaga lucrare se face în ${de(n)} zile.`,
    ),
    verify: () => expand(1, n).rep !== '' && top * n === bottom,
  }
}

/** Three numbers with a sum, a difference and a ratio; their mean and a percentage. p. 188, Testul 4, IV.1. */
export function recThreeNumbers(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 2, 200)
    const a = int(rng, 1, 100)
    const k = int(rng, 2, 6)
    const S = x * (k + 2) + a
    if (S % 3 || (100 * k * x) % (2 * x + a)) continue
    const P = (100 * k * x) / (2 * x + a)
    return {
      text: lines(
        `Suma a trei numere este $${dec(S, 1)}$.`,
        `a) Aflați numerele, știind că primul este cu $${dec(a, 1)}$ mai mic decât al doilea și de ${k} ori mai mic decât al treilea.`,
        'b) Calculați media aritmetică a celor trei numere.',
        'c) Calculați ce procent din suma primelor două numere reprezintă al treilea număr.',
      ),
      solution: lines(
        `a) Dacă primul număr este $x$, al doilea este $x + ${dec(a, 1)}$, iar al treilea $${k}x$:`,
        show(`x + x + ${dec(a, 1)} + ${k}x = ${dec(S, 1)} \\Rightarrow ${k + 2}x = ${dec(S - a, 1)} \\Rightarrow x = ${dec(x, 1)}`),
        `Numerele sunt $${dec(x, 1)}$, $${dec(x + a, 1)}$ și $${dec(k * x, 1)}$.`,
        show(`\\text{b) } m_a = ${dec(S, 1)} : 3 = ${dec(S / 3, 1)}`),
        `c) Suma primelor două este $${dec(x, 1)} + ${dec(x + a, 1)} = ${dec(2 * x + a, 1)}$:`,
        show(`\\frac{${dec(k * x, 1)}}{${dec(2 * x + a, 1)}} \\cdot 100 = ${P}\\%`),
      ),
      verify: () => x + (x + a) + k * x === S && P * (2 * x + a) === 100 * k * x,
    }
  }
}

/** Wine in a cuboid vessel: its volume, p/q of it filled, r/s of the wine sold at c lei a litre. p. 188, Testul 4, IV.2. */
export function recWine(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 5, 20)
    const l = int(rng, 3, 15)
    const h = int(rng, 3, 15)
    const q = int(rng, 3, 9)
    const p = int(rng, 1, q - 1)
    const s = int(rng, 3, 30)
    const r = int(rng, 1, s - 1)
    const c = int(rng, 3, 20)
    const V = L * l * h
    if (gcd(p, q) !== 1 || gcd(r, s) !== 1 || (V * p) % q) continue
    const W = (V * p) / q
    if ((W * r) % s) continue
    const sold = (W * r) / s
    const who = pick(rng, ['Un viticultor', 'Un podgorean', 'Un fermier'])
    return {
      text: lines(
        `${who} își depozitează vinul într-un vas în formă de paralelipiped dreptunghic cu dimensiunile de $${dec(L, 1)}$ m, ${l} dm și ${10 * h} cm.`,
        'a) Calculați volumul vasului.',
        `b) Punând vinul în vas, constată că acesta a ocupat $\\frac{${p}}{${q}}$ din capacitatea vasului. Ce cantitate de vin a obținut?`,
        `c) Calculați ce sumă a încasat, dacă a vândut $\\frac{${r}}{${s}}$ din cantitatea de vin la prețul de ${de(c)} lei litrul.`,
      ),
      solution: lines(
        `a) În decimetri: $${dec(L, 1)} \\text{ m} = ${L} \\text{ dm}$, $${10 * h} \\text{ cm} = ${h} \\text{ dm}$.`,
        show(`V = ${L} \\cdot ${l} \\cdot ${h} = ${V}${u3('dm')} = ${V}${u1('l')}`),
        show(`\\text{b) } \\frac{${p}}{${q}} \\cdot ${V} = ${W}${u1('l')}`),
        show(`\\text{c) } \\frac{${r}}{${s}} \\cdot ${W} = ${sold}${u1('l')}, \\quad ${sold} \\cdot ${c} = ${sold * c} \\text{ lei}`),
      ),
      verify: () => W * q === V * p && sold * s === W * r,
    }
  }
}

/** a · w,(r) + B : C − e · u,(v): periodic decimals turned into fractions. p. 190, Testul 6, II.3. */
export function recPeriodicExpr(rng: Rng): Made {
  for (;;) {
    const d1 = pick(rng, [3, 6, 9, 12])
    const d2 = pick(rng, [3, 6, 9, 12])
    const n1 = d1 * int(rng, 1, 4) + int(rng, 1, d1 - 1)
    const n2 = d2 * int(rng, 1, 4) + int(rng, 1, d2 - 1)
    if (gcd(n1, d1) !== 1 || gcd(n2, d2) !== 1) continue
    const a = d1 * int(rng, 1, 2)
    const e = d2 * int(rng, 1, 2)
    const C = pick(rng, [20, 25, 40, 50]) // hundredths
    const B = int(rng, 2, 99) // tenths
    if ((10 * B) % C || B % 10 === 0) continue
    const q = (10 * B) / C
    const A1 = (a * n1) / d1
    const A2 = (e * n2) / d2
    const R = A1 + q - A2
    if (R <= 0 || A1 + q <= A2) continue
    const f1 = expand(n1, d1)
    const f2 = expand(n2, d2)
    const step = (f: ReturnType<typeof expand>, n: number, d: number) => {
      const [raw, top, bottom] = periodicRule(f.pre, f.rep)
      return chain(f.tex, `${f.w} + ${raw}`, `${f.w} + \\frac{${top}}{${bottom}}`, `\\frac{${n}}{${d}}`)
    }
    return {
      text: `Calculați: $${a} \\cdot ${f1.tex} + ${dec(B, 1)} : ${dec(C, 2)} - ${e} \\cdot ${f2.tex}$.`,
      solution: lines(
        'Transformăm fracțiile periodice în fracții ordinare:',
        show(step(f1, n1, d1)),
        show(step(f2, n2, d2)),
        'Efectuăm înmulțirile și împărțirea, apoi adunarea și scăderea:',
        show(`${a} \\cdot \\frac{${n1}}{${d1}} = ${A1}, \\quad ${dec(B, 1)} : ${dec(C, 2)} = ${10 * B} : ${C} = ${q}, \\quad ${e} \\cdot \\frac{${n2}}{${d2}} = ${A2}`),
        show(`${A1} + ${q} - ${A2} = ${R}`),
      ),
      verify: () => expand(n1, d1).rep !== '' && expand(n2, d2).rep !== '' && A1 * d1 === a * n1 && Math.abs(B / 10 / (C / 100) - q) < 1e-9,
    }
  }
}

/** Two equivalent fractions with the denominators p and q, the numerators d apart. p. 195, ex. 6 a. */
export function recEquivFractions(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 11)
    const q = int(rng, p + 1, 15)
    const t = int(rng, 2, 20)
    const d = (q - p) * t
    return {
      text: `Determinați două fracții echivalente, știind că numitorii lor sunt ${p} și ${q}, iar numărătorul primei fracții este cu ${d} mai mic decât numărătorul celei de-a doua.`,
      solution: lines(
        `Fracțiile $\\frac{a}{${p}}$ și $\\frac{b}{${q}}$ au aceeași valoare $v$, deci $a = ${p} \\cdot v$ și $b = ${q} \\cdot v$. Atunci:`,
        show(`b - a = ${q} \\cdot v - ${p} \\cdot v = ${q - p} \\cdot v = ${d} \\Rightarrow v = ${t}`),
        show(`a = ${p} \\cdot ${t} = ${p * t}, \\quad b = ${q} \\cdot ${t} = ${q * t}`),
        `Fracțiile sunt $\\frac{${p * t}}{${p}}$ și $\\frac{${q * t}}{${q}}$.`,
      ),
      verify: () => p * t * q === q * t * p && q * t - p * t === d,
    }
  }
}

// ================= 3. recap tests: figures and measures (pp. 185–194) =================

const LUNITS = ['cm', 'dm', 'm'] as const

/** A rectangle: perimeter, area and the perimeter of the square with the same area. p. 185, Testul 1, IV.2. */
export function geoRectSameArea(rng: Rng): Made {
  for (;;) {
    const u = pick(rng, LUNITS)
    const s = int(rng, 3, 30)
    const l = int(rng, 2, s - 1)
    if ((s * s) % l) continue
    const L = (s * s) / l
    return {
      text: lines(
        `Un dreptunghi are lungimea de ${L} ${u} și lățimea de ${l} ${u}. Calculați:`,
        'a) perimetrul dreptunghiului;',
        'b) aria dreptunghiului;',
        'c) perimetrul pătratului care are aceeași arie ca dreptunghiul.',
      ),
      solution: lines(
        show(`\\text{a) } P = 2 \\cdot (${L} + ${l}) = 2 \\cdot ${L + l} = ${2 * (L + l)}${u1(u)}`),
        show(`\\text{b) } \\mathcal{A} = ${L} \\cdot ${l} = ${s * s}${u2(u)}`),
        `c) Latura pătratului este numărul care înmulțit cu el însuși dă ${s * s}: $${s} \\cdot ${s} = ${s * s}$, deci latura este de ${s} ${u}.`,
        show(`P = 4 \\cdot ${s} = ${4 * s}${u1(u)}`),
      ),
      verify: () => L * l === s * s && L > l,
    }
  }
}

/** A rectangle in dm and cm: perimeter, area, the side of the square with the same perimeter. p. 193, Testul 9, IV.1. */
export function geoRectSamePerimeter(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 30, 150)
    const l = int(rng, 10, L - 5)
    if (L % 10 === 0) continue
    const P = 2 * (L + l)
    return {
      text: lines(
        `Un dreptunghi are lungimea egală cu $${dec(L, 1)}$ dm și lățimea egală cu ${l} cm.`,
        'a) Calculați perimetrul dreptunghiului.',
        'b) Calculați aria dreptunghiului.',
        'c) Determinați lungimea laturii unui pătrat care are perimetrul egal cu perimetrul dreptunghiului.',
      ),
      solution: lines(
        `Transformăm lungimea în centimetri: $${dec(L, 1)} \\text{ dm} = ${L} \\text{ cm}$.`,
        show(`\\text{a) } P = 2 \\cdot (${L} + ${l}) = ${P}${u1('cm')}`),
        show(`\\text{b) } \\mathcal{A} = ${L} \\cdot ${l} = ${L * l}${u2('cm')}`),
        'c) Pătratul are 4 laturi egale:',
        show(`${P} : 4 = ${dec(P * 10 / 4, 1)}${u1('cm')}`),
      ),
      verify: () => (P * 10) % 4 === 0 && 4 * (P * 10 / 4) === 20 * (L + l),
    }
  }
}

const SEGS = [['M', 'N', 'O', 'P'], ['A', 'B', 'O', 'C'], ['E', 'F', 'O', 'G'], ['C', 'D', 'M', 'N']] as const
/** O the midpoint of MN, MO known: MN; P the midpoint of OM: PN. p. 193, Testul 9, I.3; p. 194, I.3. */
export function geoMidpoint(rng: Rng): Made {
  const [M, N, O, P] = pick(rng, SEGS)
  const x = int(rng, 101, 2000)
  const half = 5 * x // thousandths
  return {
    text: lines(
      `Punctul $${O}$ este mijlocul segmentului $${M}${N}$, iar $${M}${O} = ${dec(x, 2)}$ cm.`,
      `a) Calculați lungimea segmentului $${M}${N}$.`,
      `b) Dacă $${P}$ este mijlocul segmentului $${O}${M}$, calculați lungimea segmentului $${P}${N}$.`,
    ),
    solution: lines(
      `a) $${O}$ este mijlocul lui $${M}${N}$, deci $${M}${N} = 2 \\cdot ${M}${O}$:`,
      show(`${M}${N} = 2 \\cdot ${dec(x, 2)} = ${dec(2 * x, 2)}${u1('cm')}`),
      `b) $${O}${P} = ${M}${O} : 2 = ${dec(half, 3)}$ cm și $${O}${N} = ${M}${O} = ${dec(x, 2)}$ cm. Punctul $${O}$ este între $${P}$ și $${N}$:`,
      show(`${P}${N} = ${P}${O} + ${O}${N} = ${dec(half, 3)} + ${dec(x, 2)} = ${dec(half + 10 * x, 3)}${u1('cm')}`),
    ),
    verify: () => half * 2 === 10 * x && half + 10 * x === 15 * x,
  }
}

/** The area of a square: its perimeter, in a larger unit. p. 187, Testul 3, I.2; p. 189, III.2. */
export function geoSquareAreaPerimeter(rng: Rng): Made {
  const [u, v] = pick(rng, [['cm', 'dm'], ['dm', 'm'], ['m', 'dam'], ['mm', 'cm']] as const)
  const s = int(rng, 2, 40)
  const P = 4 * s
  return {
    text: `Aria unui pătrat este egală cu $${s * s}${u2(u)}$. Calculați perimetrul pătratului și exprimați-l în ${v}.`,
    solution: lines(
      `Latura pătratului este numărul care înmulțit cu el însuși dă ${s * s}: $${s} \\cdot ${s} = ${s * s}$, deci latura este de ${s} ${u}.`,
      show(`P = 4 \\cdot ${s} = ${P}${u1(u)} = ${dec(P, 1)}${u1(v)}`),
    ),
    verify: () => s * s === s ** 2 && Math.abs(Number(dec(P, 1).replace('{,}', '.')) * 10 - P) < 1e-9,
  }
}

/** A rectangle with a known perimeter and the length k times the width: its sides and area. p. 189, Testul 5, IV.1 b. */
export function geoRectRatioPerimeter(rng: Rng): Made {
  const u = pick(rng, LUNITS)
  const l = int(rng, 3, 60)
  const k = int(rng, 2, 6)
  const L = k * l
  const P = 2 * (L + l)
  return {
    text: `Un dreptunghi are perimetrul de ${P} ${u}, iar lungimea lui este de ${k} ori mai mare decât lățimea. Calculați dimensiunile și aria dreptunghiului.`,
    solution: lines(
      `Semiperimetrul este $${P} : 2 = ${P / 2}$ ${u}. Lățimea are o parte, lungimea ${k} părți, deci împreună ${k + 1} părți:`,
      show(`l = ${P / 2} : ${k + 1} = ${l}${u1(u)}, \\quad L = ${k} \\cdot ${l} = ${L}${u1(u)}`),
      show(`\\mathcal{A} = ${L} \\cdot ${l} = ${L * l}${u2(u)}`),
    ),
    verify: () => 2 * (L + l) === P && L === k * l,
  }
}

/** Two angles with a known sum (or difference), one k times the other: the larger. p. 188, Testul 4, II.2. */
export function geoAngleSumTimes(rng: Rng): Made {
  const k = int(rng, 2, 8)
  const x = int(rng, 5, Math.floor(179 / k))
  const diff = rng() < 0.4
  const T = diff ? (k - 1) * x : (k + 1) * x
  return {
    text: `${diff ? 'Diferența' : 'Suma'} măsurilor a două unghiuri este egală cu $${T}^\\circ$. Dacă unul dintre unghiuri are măsura de ${k} ori mai mare decât celălalt, aflați măsura unghiului mai mare.`,
    solution: lines(
      `Unghiul mai mic are o parte, iar cel mai mare ${k} părți; ${diff ? 'diferența' : 'suma'} lor are ${diff ? k - 1 : k + 1} ${(diff ? k - 1 : k + 1) === 1 ? 'parte' : 'părți'}:`,
      show(`${T}^\\circ : ${diff ? k - 1 : k + 1} = ${x}^\\circ, \\quad ${k} \\cdot ${x}^\\circ = ${k * x}^\\circ`),
      `Unghiul mai mare are $${k * x}^\\circ$.`,
    ),
    verify: () => (diff ? k * x - x : k * x + x) === T && k * x < 180,
  }
}

/** C interior to AOB: BOC in minutes, in degrees and minutes and in degrees. p. 191, Testul 7, IV.2. */
export function geoAngleInterior(rng: Rng): Made {
  for (;;) {
    const X = int(rng, 40 * 60, 170 * 60)
    const Y = int(rng, 10 * 60, X - 10 * 60)
    const M = X - Y
    if (X % 60 === 0 || Y % 60 === 0 || M % 3 || M % 60 === 0) continue
    const borrow = Y % 60 > X % 60
    return {
      text: lines(
        `Se consideră un unghi $AOB$ cu măsura de $${dm(X)}$ și un punct $C$, situat în interiorul unghiului $AOB$, astfel încât măsura unghiului $AOC$ să fie de $${dm(Y)}$. Calculați măsura unghiului $BOC$ și exprimați rezultatul în:`,
        'a) minute; b) grade și minute; c) grade.',
      ),
      solution: lines(
        `Punctul $C$ este în interiorul unghiului, deci $${ang('BOC')} = ${ang('AOB')} - ${ang('AOC')}$.${borrow ? " Împrumutăm un grad: $1^\\circ = 60'$." : ''}`,
        show(`${ang('BOC')} = ${dm(X)} - ${dm(Y)} = ${borrow ? `${Math.floor(X / 60) - 1}^\\circ ${(X % 60) + 60}' - ${dm(Y)} = ` : ''}${dm(M)}`),
        show(`\\text{a) } ${dm(M)} = ${Math.floor(M / 60)} \\cdot 60' + ${M % 60}' = ${M}'`),
        `b) $${dm(M)}$.`,
        show(`\\text{c) } ${M % 60}' = \\frac{${M % 60}}{60}^\\circ = ${dec((5 * (M % 60)) / 3, 2)}^\\circ, \\quad ${ang('BOC')} = ${dec((5 * M) / 3, 2)}^\\circ`),
      ),
      verify: () => M + Y === X && (5 * M) % 3 === 0 && Math.abs(M / 60 - (5 * M) / 300) < 1e-9,
    }
  }
}

const ANGLE_NAMES = [['MNP', 'QRS'], ['ABC', 'DEF'], ['XOY', 'UVT'], ['AOB', 'COD']] as const
/** k · ∢A + ∢B : m with degrees and minutes. p. 192, Testul 8, I.4; p. 193, Testul 9, I.4. */
export function geoAngleExpr(rng: Rng): Made {
  for (;;) {
    const [n1, n2] = pick(rng, ANGLE_NAMES)
    const k = int(rng, 2, 5)
    const m = int(rng, 2, 6)
    const A = int(rng, 5 * 60, 35 * 60)
    const B = int(rng, 20 * 60, 150 * 60)
    if (A % 60 === 0 || B % 60 === 0 || B % m || k * A + B / m >= 360 * 60) continue
    const kd = k * Math.floor(A / 60)
    const km = k * (A % 60)
    const R = k * A + B / m
    return {
      text: `Dacă $${ang(n1)} = ${dm(A)}$ și $${ang(n2)} = ${dm(B)}$, calculați $${k} \\cdot ${ang(n1)} + ${ang(n2)} : ${m}$.`,
      solution: lines(
        'Înmulțim separat gradele și minutele, apoi transformăm minutele care trec de 60 în grade:',
        show(`${k} \\cdot ${dm(A)} = ${kd}^\\circ ${km}'${km >= 60 ? ` = ${dm(k * A)}` : ''}`),
        `Pentru împărțire, transformăm unghiul în minute: $${dm(B)} = ${B}'$.`,
        show(`${B}' : ${m} = ${B / m}' = ${dm(B / m)}`),
        show(`${dm(k * A)} + ${dm(B / m)} = ${dm(R)}`),
      ),
      verify: () => R === k * A + B / m && Number.isInteger(B / m),
    }
  }
}

/** A sports field with a track around it: the area of the field, the outer perimeter, the area of the track. p. 186, Testul 2, IV.2. */
export function geoSportsTrack(rng: Rng): Made {
  const l = int(rng, 10, 80)
  const k = int(rng, 2, 3)
  const L = k * l
  const P = 2 * (L + l)
  const w = int(rng, 5, 50) // tenths of a metre
  const outer = (10 * L + 2 * w) * (10 * l + 2 * w) // hundredths of m²
  const track = outer - 100 * L * l
  return {
    text: lines(
      `Terenul de sport al unei școli este în formă de dreptunghi cu perimetrul de ${P} m și lungimea de ${k === 2 ? 'două' : 'trei'} ori mai mare decât lățimea. Terenul este înconjurat de o pistă cu lățimea de $${dec(w, 1)}$ m. Calculați:`,
      'a) aria terenului de sport;',
      'b) perimetrul exterior al pistei;',
      'c) aria pistei.',
    ),
    solution: lines(
      `a) Semiperimetrul este ${P / 2} m; lățimea are o parte, lungimea ${k} părți:`,
      show(`l = ${P / 2} : ${k + 1} = ${l}${u1('m')}, \\quad L = ${L}${u1('m')}, \\quad \\mathcal{A} = ${L} \\cdot ${l} = ${L * l}${u2('m')}`),
      `b) Marginea exterioară a pistei este un dreptunghi mai lung și mai lat cu câte $2 \\cdot ${dec(w, 1)} = ${dec(2 * w, 1)}$ m:`,
      show(`${L} + ${dec(2 * w, 1)} = ${dec(10 * L + 2 * w, 1)}${u1('m')}, \\quad ${l} + ${dec(2 * w, 1)} = ${dec(10 * l + 2 * w, 1)}${u1('m')}`),
      show(`P = 2 \\cdot (${dec(10 * L + 2 * w, 1)} + ${dec(10 * l + 2 * w, 1)}) = ${dec(10 * P + 8 * w, 1)}${u1('m')}`),
      'c) Aria pistei este diferența dintre aria dreptunghiului exterior și aria terenului:',
      show(`${dec(10 * L + 2 * w, 1)} \\cdot ${dec(10 * l + 2 * w, 1)} - ${L * l} = ${dec(outer, 2)} - ${L * l} = ${dec(track, 2)}${u2('m')}`),
    ),
    verify: () => 2 * (10 * L + 2 * w + 10 * l + 2 * w) === 10 * P + 8 * w && track === 2 * w * 10 * (L + l) + 4 * w * w,
  }
}

/** Two angles AOB and BOC without common interior points: AOC, then BOC, then when OA and OC are opposite. p. 194, Testul 10, IV.2. */
export function geoAdjacentAngles(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 15, 100)
    const y = int(rng, 15, 100)
    if (x + y >= 180) continue
    const T = int(rng, 100 * 60, 175 * 60)
    const Y = int(rng, 30 * 60, T - 20 * 60)
    const Q = int(rng, 30 * 60, 150 * 60)
    if (T % 60 === 0 || Y % 60 === 0 || Q % 60 === 0) continue
    const R = 180 * 60 - Q
    return {
      text: lines(
        'Unghiurile $AOB$ și $BOC$ nu au puncte interioare comune.',
        `a) Calculați măsura unghiului $AOC$, dacă $${ang('AOB')} = ${x}^\\circ$ și $${ang('BOC')} = ${y}^\\circ$.`,
        `b) Calculați măsura unghiului $BOC$, dacă $${ang('AOC')} = ${dm(T)}$ și $${ang('AOB')} = ${dm(Y)}$.`,
        `c) Ce puteți spune despre semidreptele $OA$ și $OC$, dacă $${ang('AOB')} = ${dm(Q)}$ și $${ang('BOC')} = ${dm(R)}$?`,
      ),
      solution: lines(
        'Unghiurile nu au puncte interioare comune, deci semidreapta $OB$ este între $OA$ și $OC$ și $\\sphericalangle AOC = \\sphericalangle AOB + \\sphericalangle BOC$.',
        show(`\\text{a) } ${ang('AOC')} = ${x}^\\circ + ${y}^\\circ = ${x + y}^\\circ`),
        show(`\\text{b) } ${ang('BOC')} = ${dm(T)} - ${dm(Y)} = ${dm(T - Y)}`),
        show(`\\text{c) } ${ang('AOC')} = ${dm(Q)} + ${dm(R)} = ${dm(Q + R)}`),
        'Unghiul $AOC$ este alungit, deci semidreptele $OA$ și $OC$ sunt semidrepte opuse.',
      ),
      verify: () => Q + R === 180 * 60 && T - Y > 0 && x + y < 180,
    }
  }
}

/** The side of a square grows by d and the area by X: the side. p. 185, Testul 1, I.4 (the area as the side changes). */
export function geoSquareGrow(rng: Rng): Made {
  const u = pick(rng, LUNITS)
  const a = int(rng, 2, 40)
  const d = int(rng, 1, 10)
  const X = 2 * a * d + d * d
  return {
    text: `Dacă latura unui pătrat se mărește cu ${d} ${u}, aria lui crește cu $${X}${u2(u)}$. Aflați latura și aria pătratului inițial.`,
    solution: lines(
      `Pătratul nou se descompune în pătratul inițial, două dreptunghiuri cu laturile $a$ și ${d} ${u} și un pătrat mic cu latura de ${d} ${u}. Creșterea ariei este:`,
      show(`2 \\cdot ${d} \\cdot a + ${d} \\cdot ${d} = ${X} \\Rightarrow ${2 * d} \\cdot a = ${X} - ${d * d} = ${X - d * d}`),
      show(`a = ${X - d * d} : ${2 * d} = ${a}${u1(u)}, \\quad \\mathcal{A} = ${a} \\cdot ${a} = ${a * a}${u2(u)}`),
      `Verificare: $${a + d} \\cdot ${a + d} - ${a * a} = ${(a + d) ** 2 - a * a}$.`,
    ),
    verify: () => (a + d) ** 2 - a * a === X,
  }
}

// ================= 4. school contests (pp. 195–199) =================

const PROPER: [number, number][] = [[1, 2], [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [1, 3], [1, 4], [3, 7], [4, 7], [5, 7], [5, 8]]
/** Three canisters with whole litres in given ratios, poured in a barrel that does not fill up. p. 195, ex. 8 (Cangurul). */
export function contCanisters(rng: Rng): Made {
  for (;;) {
    const [p1, q1] = pick(rng, PROPER)
    const [p2, q2] = pick(rng, PROPER)
    if (p1 * q2 === p2 * q1) continue
    const F = lcm(p1, p2)
    const s = (F * q1) / p1
    const t = (F * q2) / p2
    const T = F + s + t
    if (T > 120) continue
    const B = int(rng, T + 1, 2 * T)
    const times = (q: number, p: number) => (p === 1 ? `${q} \\cdot x` : `x \\cdot \\frac{${q}}{${p}}`)
    const need = [...new Set([p1, p2])].filter((v) => v > 1)
    if (!need.length) continue
    return {
      text: `Avem trei canistre, conținând fiecare un număr întreg de litri de apă. Volumul de apă din prima canistră este $\\frac{${p1}}{${q1}}$ din volumul celei de-a doua și $\\frac{${p2}}{${q2}}$ din volumul celei de-a treia. Turnăm apa din cele trei canistre într-un butoi de ${de(B)} litri, dar acesta nu se umple. De câtă apă este nevoie pentru a-l umple?`,
      solution: lines(
        `Dacă prima canistră are $x$ litri, a doua are $${times(q1, p1)}$ litri, iar a treia $${times(q2, p2)}$ litri. ${need.length ? `Ca acestea să fie numere naturale, $x$ trebuie să fie multiplu de ${need.join(' și de ')}${need.length > 1 ? `, deci multiplu de ${F}` : ''}.` : ''}`,
        `Pentru $x = ${F}$, canistrele au ${list([F, s, t])} litri, adică în total ${de(T)} litri. Pentru $x = ${2 * F}$ ar fi ${de(2 * T)} litri, cel puțin cât butoiul, care s-ar umple; cu atât mai mult pentru un multiplu mai mare.`,
        `Deci $x = ${F}$, în butoi sunt ${de(T)} litri și mai sunt necesari:`,
        show(`${B} - ${T} = ${B - T}${u1('l')}`),
      ),
      verify: () => {
        const sols: number[] = []
        for (let x = 1; x <= 4 * B; x++) {
          const a = (x * q1) / p1
          const b = (x * q2) / p2
          if (Number.isInteger(a) && Number.isInteger(b) && x + a + b < B) sols.push(B - x - a - b)
        }
        return sols.length === 1 && sols[0] === B - T
      },
    }
  }
}

/** The perimeter of a rectangle and a relation between half the width plus a and half the length. p. 195, ex. 9. */
export function contRectHalves(rng: Rng): Made {
  const l = int(rng, 5, 80)
  const a = int(rng, 1, 10)
  const j = int(rng, 1, 8)
  const b = 5 * j // dm
  const D = 2 * a + j
  const L = l + D
  const P = 2 * (L + l)
  return {
    text: `Perimetrul unui dreptunghi este de ${P} m. Aflați dimensiunile sale, știind că, dacă mărim cu ${a} m jumătate din lățime, obținem cu ${b} dm mai puțin decât jumătate din lungime.`,
    solution: lines(
      `$${b} \\text{ dm} = ${dec(b, 1)} \\text{ m}$. Jumătate din lungime este cu $${a} + ${dec(b, 1)} = ${dec(10 * a + b, 1)}$ m mai mare decât jumătate din lățime, deci lungimea este cu $2 \\cdot ${dec(10 * a + b, 1)} = ${D}$ m mai mare decât lățimea.`,
      `Semiperimetrul: $L + l = ${P} : 2 = ${P / 2}$ m, iar $L - l = ${D}$ m.`,
      show(`L = (${P / 2} + ${D}) : 2 = ${L}${u1('m')}, \\quad l = ${P / 2} - ${L} = ${l}${u1('m')}`),
    ),
    verify: () => 2 * (L + l) === P && 10 * l / 2 + 10 * a === 10 * L / 2 - b,
  }
}

const RUNNERS = [
  { a: 'o broască', A: 'Broasca', b: 'un șoarece', B: 'șoarecele' },
  { a: 'o furnică', A: 'Furnica', b: 'un gândac', B: 'gândacul' },
  { a: 'un arici', A: 'Ariciul', b: 'o veveriță', B: 'veverița' },
] as const
/** Two animals run round a rectangle in opposite directions from the same point: when they meet. p. 196, ex. 13 (Cangurul). */
export function contRoundRectangle(rng: Rng): Made {
  for (;;) {
    const L = int(rng, 8, 60)
    const l = int(rng, 4, L - 1)
    const v1 = int(rng, 1, 4)
    const v2 = int(rng, v1 + 1, 8)
    const P = 2 * (L + l)
    if (P % (v1 + v2)) continue
    const t = P / (v1 + v2)
    const r = pick(rng, RUNNERS)
    return {
      text: `Pe laturile unui teren în formă de dreptunghi, cu lungimea de ${L} m și lățimea de ${l} m, pleacă din același punct, în sensuri opuse, ${r.a} și ${r.b}. ${r.A} parcurge ${v1} m într-o secundă, iar ${r.B}, ${v2} m într-o secundă. La cât timp de la plecare se întâlnesc și ce distanță a parcurs fiecare?`,
      solution: lines(
        `Până la întâlnire, împreună parcurg tot perimetrul terenului: $2 \\cdot (${L} + ${l}) = ${P}$ m. Într-o secundă se apropie cu $${v1} + ${v2} = ${v1 + v2}$ m:`,
        show(`${P} : ${v1 + v2} = ${t} \\text{ s}`),
        show(`${v1} \\cdot ${t} = ${v1 * t}${u1('m')}, \\quad ${v2} \\cdot ${t} = ${v2 * t}${u1('m')}`),
        `Se întâlnesc după ${de(t)} secunde; ${r.A.toLowerCase()} a parcurs ${de(v1 * t)} metri, iar ${r.B}, ${de(v2 * t)} metri.`,
      ),
      verify: () => v1 * t + v2 * t === P,
    }
  }
}

/** A painted cube cut into small cubes: the paint for the new faces. p. 198, ex. 25 (Comper). */
export function contPaintedCube(rng: Rng): Made {
  const k = int(rng, 2, 40) // tenths of a kg
  const n = int(rng, 2, 6)
  const need = (n - 1) * k
  return {
    text: `Pentru vopsirea unui cub este necesar $${dec(k, 1)}$ kg de vopsea. După ce am vopsit cubul, îl tăiem în cubulețe cu muchia de ${n} ori mai mică. De câte kilograme de vopsea mai avem nevoie pentru a vopsi fețele neacoperite de vopsea?`,
    solution: lines(
      `Fiecare față a cubului mare se împarte în $${n} \\cdot ${n} = ${n * n}$ pătrățele, deci suprafața lui este formată din $6 \\cdot ${n * n} = ${6 * n * n}$ fețe de cubuleț.`,
      `Se obțin $${n}^3 = ${n ** 3}$ cubulețe, cu $6 \\cdot ${n ** 3} = ${6 * n ** 3}$ fețe în total, adică de ${n} ori mai multe. Vopseaua pentru toate fețele ar fi $${n} \\cdot ${dec(k, 1)} = ${dec(n * k, 1)}$ kg, din care $${dec(k, 1)}$ kg ${k === 10 ? "s-a" : "s-au"} folosit deja:`,
      show(`${dec(n * k, 1)} - ${dec(k, 1)} = ${dec(need, 1)} \\text{ kg}`),
    ),
    verify: () => (6 * n ** 3) / (6 * n * n) === n && need === n * k - k,
  }
}

const ITEMS = [
  { many: 'stilouri', many2: 'pixuri', one: 'un stilou', same: 'de același tip' },
  { many: 'caiete', many2: 'creioane', one: 'un caiet', same: 'de același fel' },
  { many: 'cărți', many2: 'reviste', one: 'o carte', same: 'de același fel' },
] as const
/** a pens and b pencils cost S₁, c pens and d pencils S₂, with a = m·c: the price of a pen. p. 198, ex. 26. */
export function contPensPencils(rng: Rng): Made {
  for (;;) {
    const x = int(rng, 4, 25)
    const y = int(rng, 2, x - 1)
    const c = int(rng, 2, 5)
    const m = int(rng, 2, 3)
    const a = m * c
    const d = int(rng, 2, 6)
    const b = int(rng, 2, 9)
    if (Math.abs(b - m * d) < 2) continue
    const S1 = a * x + b * y
    const S2 = c * x + d * y
    const it = pick(rng, ITEMS)
    const more = m * d > b
    const diffCount = Math.abs(m * d - b)
    const diffSum = Math.abs(m * S2 - S1)
    return {
      text: `${a} ${it.many} și ${b} ${it.many2} costă ${de(S1)} lei. ${c} ${it.many} și ${d} ${it.many2} ${it.same} costă ${de(S2)} lei. Cât costă ${it.one}?`,
      solution: lines(
        `Luăm de ${m} ori a doua cumpărătură: $${a}$ ${it.many} și $${m * d}$ ${it.many2} costă $${m} \\cdot ${S2} = ${m * S2}$ lei.`,
        `Acum numărul de ${it.many} este același ca în prima cumpărătură. Diferența de preț vine doar din cele $${Math.max(m * d, b)} - ${Math.min(m * d, b)} = ${diffCount}$ ${it.many2}:`,
        show(`${more ? `${m * S2} - ${S1}` : `${S1} - ${m * S2}`} = ${diffSum} \\text{ lei}, \\quad ${diffSum} : ${diffCount} = ${y} \\text{ lei}`),
        `Din a doua cumpărătură: $${c}$ ${it.many} costă $${S2} - ${d} \\cdot ${y} = ${S2 - d * y}$ lei, deci:`,
        show(`${S2 - d * y} : ${c} = ${x} \\text{ lei}`),
      ),
      verify: () => a * x + b * y === S1 && c * x + d * y === S2 && diffSum === diffCount * y,
    }
  }
}

/** The angle of the hour hand with the vertical and with the minute hand. p. 197, ex. 24 (Lumina Math). */
export function contClockAngle(rng: Rng): Made {
  const h = int(rng, 1, 12)
  const m = int(rng, 1, 59)
  const H2 = 60 * (h % 12) + m // twice the angle of the hour hand from 12
  const M2 = 12 * m
  let D2 = Math.abs(H2 - M2)
  if (D2 > 360) D2 = 720 - D2
  const V2 = Math.min(H2, 720 - H2)
  const half = (x: number) => dec(5 * x, 1)
  return {
    text: `La ora ${h}:${String(m).padStart(2, '0')}, ce măsură are: a) unghiul format de limba care indică ora cu poziția verticală (direcția spre cifra 12); b) unghiul format de cele două limbi ale ceasului?`,
    solution: lines(
      'Limba orelor face un tur ($360^\\circ$) în 12 ore, deci se rotește cu $30^\\circ$ pe oră și cu $0{,}5^\\circ$ pe minut. Limba minutelor se rotește cu $6^\\circ$ pe minut. Măsurăm unghiurile de la direcția spre cifra 12, în sensul acelor de ceasornic:',
      show(`\\text{ora: } 30^\\circ \\cdot ${h % 12} + 0{,}5^\\circ \\cdot ${m} = ${half(H2)}^\\circ, \\quad \\text{minutele: } 6^\\circ \\cdot ${m} = ${6 * m}^\\circ`),
      `a) ${H2 <= 360 ? `Unghiul cu verticala este $${half(V2)}^\\circ$.` : `Limba orelor a trecut de $180^\\circ$, deci unghiul cu verticala este $360^\\circ - ${half(H2)}^\\circ = ${half(V2)}^\\circ$.`}`,
      `b) ${Math.abs(H2 - M2) > 360 ? `Diferența este $${half(Math.abs(H2 - M2))}^\\circ > 180^\\circ$, deci unghiul este $360^\\circ - ${half(Math.abs(H2 - M2))}^\\circ = ${half(D2)}^\\circ$.` : `$|${half(H2)}^\\circ - ${6 * m}^\\circ| = ${half(D2)}^\\circ$.`}`,
    ),
    verify: () => {
      const hour = (30 * (h % 12) + m / 2) % 360
      const min = 6 * m
      const d = Math.abs(hour - min)
      return Math.abs(Math.min(d, 360 - d) - D2 / 2) < 1e-9 && Math.abs(Math.min(hour, 360 - hour) - V2 / 2) < 1e-9
    },
  }
}

/** n consecutive numbers: the sum of the k smallest is known; the sum of the k largest. p. 198, ex. 33 (Cangurul). */
export function contConsecutive(rng: Rng): Made {
  const n = int(rng, 5, 12)
  const k = int(rng, 2, Math.floor(n / 2))
  const x = int(rng, 1, 60)
  const small = k * x + (k * (k - 1)) / 2
  const big = small + k * (n - k)
  const who = pick(rng, NAMES)
  return {
    text: `${who} scrie pe tablă ${de(n)} numere naturale consecutive. Suma celor mai mici ${k} numere este ${small}. Care este suma celor mai mari ${k} numere?`,
    solution: lines(
      `Numerele cresc din 1 în 1, deci fiecare dintre cele mai mari ${k} numere este cu ${n - k} mai mare decât unul dintre cele mai mici ${k} (primul cel mai mare cu primul, al doilea cu al doilea etc.):`,
      show(`${small} + ${k} \\cdot ${n - k} = ${small} + ${k * (n - k)} = ${big}`),
      `Verificare: numerele sunt de la ${x} la ${x + n - 1}.`,
    ),
    verify: () => {
      let s = 0
      for (let i = n - k; i < n; i++) s += x + i
      return s === big
    },
  }
}

/** n cards with a or a + 1, the sum divisible by m: how many carry a. p. 198, ex. 34 (Cangurul). */
export function contCards(rng: Rng): Made {
  for (;;) {
    const N = int(rng, 10, 30)
    const a = int(rng, 1, 8)
    const b = a + 1
    const m = int(rng, N + 1, 60)
    const mults: number[] = []
    for (let s = a * N; s <= b * N; s++) if (s % m === 0) mults.push(s)
    if (mults.length !== 1) continue
    const S = mults[0]
    const x = b * N - S
    return {
      text: `Pe fiecare dintre cele ${de(N)} cartonașe este scris exact un număr: fie ${a}, fie ${b}. Suma tuturor numerelor scrise pe cartonașe este divizibilă cu ${m}. Pe câte cartonașe este scris numărul ${a}?`,
      solution: lines(
        `Dacă pe toate cartonașele ar fi ${b}, suma ar fi $${b} \\cdot ${N} = ${b * N}$; fiecare cartonaș cu ${a} micșorează suma cu 1. Deci suma este între $${a} \\cdot ${N} = ${a * N}$ și ${b * N}.`,
        `Singurul multiplu de ${m} dintre ${a * N} și ${b * N} este ${S}, deci suma este ${S}:`,
        show(`${b * N} - ${S} = ${x}`),
        `Numărul ${a} este scris pe ${x === 1 ? 'un cartonaș' : `${de(x)} cartonașe`}.`,
      ),
      verify: () => (a * x + b * (N - x)) % m === 0 && x >= 0 && x <= N,
    }
  }
}

/** Three shops take apples from a depot; what was left is known: the first quantity, backwards. p. 197, ex. 18. */
export function contDepot(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 3, 6)
    const q = int(rng, 2, 5)
    const T = p * int(rng, 8000, 40000) // thousandths of a tonne
    const a = int(rng, 100, 5000)
    const b = int(rng, 100, 2000)
    if (a % 1000 === 0 || b % 1000 === 0 || 2 * a - b <= 0) continue
    const first = T / p + a
    const second = first - b
    const rem = T - first - second
    if (second <= 0 || rem <= 0 || rem % q) continue
    const third = rem / q
    const R = rem - third
    return {
      text: `Trei magazine se aprovizionează cu mere de la un depozit astfel: primul ia $\\frac{1}{${p}}$ din cantitate și încă $${dec(a, 3)}$ tone, al doilea ia cu $${dec(b, 3)}$ tone mai puțin decât primul, iar al treilea ia $\\frac{1}{${q}}$ din ce a rămas. Aflați ce cantitate de mere a fost la început în depozit, știind că în depozit au mai rămas $${dec(R, 3)}$ tone.`,
      solution: lines(
        `Mergem de la sfârșit spre început. După primele două magazine rămăsese o cantitate din care al treilea a luat $\\frac{1}{${q}}$, deci au rămas $\\frac{${q - 1}}{${q}}$ din ea, adică $${dec(R, 3)}$ tone:`,
        show(`${q === 2 ? `${dec(R, 3)} \\cdot 2` : `${dec(R, 3)} : ${q - 1} \\cdot ${q}`} = ${dec(rem, 3)} \\text{ t}`),
        `Primele două magazine au luat de două ori cantitatea primului, minus $${dec(b, 3)}$ t, adică $\\frac{2}{${p}}$ din cantitate și încă $2 \\cdot ${dec(a, 3)} - ${dec(b, 3)} = ${dec(2 * a - b, 3)}$ t. Restul, de $\\frac{${p - 2}}{${p}}$ din cantitate, este cele $${dec(rem, 3)}$ t la care adăugăm aceste $${dec(2 * a - b, 3)}$ t:`,
        show(`${dec(rem, 3)} + ${dec(2 * a - b, 3)} = ${dec(rem + 2 * a - b, 3)} \\text{ t}`),
        show(`${dec(rem + 2 * a - b, 3)} : ${p - 2} \\cdot ${p} = ${dec(T, 3)} \\text{ t}`),
        `La început în depozit erau $${dec(T, 3)}$ tone de mere.`,
      ),
      verify: () => ((rem + 2 * a - b) * p) / (p - 2) === T && T - first - second - third === R,
    }
  }
}

const DAYS = ['luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă', 'duminică']
/** A month with as many Wednesdays as Fridays: which days can be the first of the month. p. 198, ex. 28 (Lumina Math). */
export function contMonthDays(rng: Rng): Made {
  const len = pick(rng, [29, 30, 31])
  const e = len - 28
  const [d1, d2] = shuffle(rng, [0, 1, 2, 3, 4, 5, 6]).slice(0, 2).sort((x, y) => x - y)
  const extra = (d: number, f: number) => (d - f + 7) % 7 < e
  const ok = [0, 1, 2, 3, 4, 5, 6].filter((f) => extra(d1, f) === extra(d2, f))
  return {
    text: `O lună cu ${de(len)} zile are același număr de zile de ${DAYS[d1]} și de ${DAYS[d2]}. Care dintre zilele săptămânii poate fi prima zi a lunii?`,
    solution: lines(
      `$${len} = 4 \\cdot 7 + ${e}$: în 4 săptămâni complete fiecare zi apare de 4 ori, iar ${e === 1 ? 'prima zi a lunii mai apare o dată' : `primele ${e} zile ale lunii (în ordinea săptămânii) mai apar câte o dată`}, adică de 5 ori.`,
      `Zilele de ${DAYS[d1]} și de ${DAYS[d2]} sunt la fel de multe dacă ${e === 1 ? 'niciuna dintre ele nu este prima zi a lunii' : `ambele sunt printre primele ${e} zile ale lunii sau niciuna nu este`}. Încercăm pe rând fiecare zi ca primă zi a lunii:`,
      `Prima zi a lunii poate fi: ${list(ok.map((f) => DAYS[f]))}.`,
    ),
    verify: () => {
      const good: number[] = []
      for (let f = 0; f < 7; f++) {
        const count = [0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < len; i++) count[(f + i) % 7]++
        if (count[d1] === count[d2]) good.push(f)
      }
      return good.join() === ok.join() && ok.length > 0
    },
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-volume-tests',
    label: 'Volumul cubului și al paralelipipedului: teste',
    topic: 'Geometrie',
    forms: {
      1: [volEdgeSum, volMixedUnits, volUnitSum, volCubeFromVolume],
      2: [volRemoveFraction, volBuckets, volCubeBasinDays, volTapEmpty, volAquariumPeriodic, volSameAsCube],
      3: [volEdgeIncreased, volScaledReservoir, volCubesFromSmall, volCutCube, volPrimeDims, volMetalCube],
    },
  },
  {
    id: 'v-final-recap-numbers',
    label: 'Teste recapitulative de final de an: numere și probleme',
    topic: 'Algebră',
    forms: {
      1: [recDecCalc, recDecBracket, recMeanUnknown, recRoundings],
      2: [recPeriodicMixed, recRatioDiff, recTimesDiff, recBookPart, recSavings, recPeriodicDays],
      3: [recThreeNumbers, recWine, recPeriodicExpr, recEquivFractions],
    },
  },
  {
    id: 'v-final-recap-figures',
    label: 'Teste recapitulative de final de an: figuri și măsuri',
    topic: 'Geometrie',
    forms: {
      1: [geoRectSameArea, geoRectSamePerimeter, geoMidpoint, geoSquareAreaPerimeter],
      2: [geoRectRatioPerimeter, geoAngleSumTimes, geoAngleInterior, geoAngleExpr],
      3: [geoSportsTrack, geoAdjacentAngles, geoSquareGrow],
    },
  },
]

export const CONTEST: ContestKind[] = [
  {
    id: 'v-contest-school-final',
    label: 'Concursuri școlare: probleme de final de an',
    forms: [contCanisters, contRectHalves, contRoundRectangle, contPaintedCube, contPensPencils, contClockAngle, contConsecutive, contCards, contDepot, contMonthDays],
  },
]
