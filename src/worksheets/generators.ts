// Exercises made by the app, for middle school (grades V–VIII, up to the national exam), each with its worked
// solution in Romanian, written as in Romanian textbooks. Every generator takes a seeded random source and a level
// (1 easy, 2 medium, 3 hard, 4 contest), so the same seed always gives the same exercise.
import {
  addExact, exact, exactTex, frac, gcd, int, nonZero, paren, pick, poly, reduce, root, rightTriangle, rootParts, shuffle, surd,
  type Exact, type Rng,
} from './tex'
import * as F from './forms'
import * as H from './hard'
import * as E from './en'
import * as E2 from './en2'
import * as C from './contest'
import * as C2 from './contest2'
import * as C3 from './contest3'
import * as C4 from './contest4'
import * as G8 from './geometry8'

export type Level = 1 | 2 | 3 | 4
export type Grade = 5 | 6 | 7 | 8

export interface Made {
  /** the statement, markdown with $…$ */
  text: string
  /** the worked solution, markdown with $…$ and $$…$$ */
  solution: string
  /** for the tests: the arithmetic of the exercise holds, independently of how it is written */
  verify?: () => boolean
}

/** One kind of exercise as first written: one form for each level. */
interface Kind {
  id: string
  grade: Grade
  topic: 'Algebră' | 'Geometrie'
  label: string
  make: (rng: Rng, level: Level) => Made
}

/**
 * A kind of exercise with all its forms: at each level, several different exercises, not only other numbers.
 * `form` picks one of them (0 … forms(level) − 1); without it, one is chosen at random.
 */
export interface Generator extends Omit<Kind, 'make'> {
  forms: (level: Level) => number
  make: (rng: Rng, level: Level, form?: number) => Made
}

type Form = (rng: Rng) => Made

/**
 * The forms of a kind at each level: its own, then `more`. With `hard`, the hard level is made of those exercises
 * (as on the national exam), and the kind's own hard exercise goes down to the medium level, beside its own,
 * unless `demote` is false (when it is the medium exercise with larger numbers).
 */
function withForms(kind: Kind, more: Partial<Record<Level, Form[]>> = {}, hard?: Form[], demote = true): Generator {
  const at = (level: Level): Form[] => {
    // the contest level has kinds of its own (`contest`), not harder forms of these
    if (level === 4) return []
    const own: Form[] = level === 3 && hard ? [...hard] : [(rng) => kind.make(rng, level)]
    if (level === 2 && hard && demote) own.push((rng) => kind.make(rng, 3))
    return [...own, ...(more[level] ?? [])]
  }
  return {
    id: kind.id, grade: kind.grade, topic: kind.topic, label: kind.label,
    forms: (level) => at(level).length,
    make(rng, level, form) {
      const list = at(level)
      const i = form ?? Math.floor(rng() * list.length)
      return list[((i % list.length) + list.length) % list.length](rng)
    },
  }
}

const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
/** A decimal number with the Romanian comma: 2{,}5 */
const dec = (x: number) => {
  const s = String(Math.round(x * 10000) / 10000)
  return s.replace('.', '{,}')
}
const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`

// ---------- grade V ----------

const orderOfOps: Kind = {
  id: 'v-ops', grade: 5, topic: 'Algebră', label: 'Ordinea efectuării operațiilor',
  make(rng, level) {
    if (level === 1) {
      const [b, c] = [int(rng, 2, 9), int(rng, 2, 9)]
      const a = int(rng, 5, 40)
      const d = int(rng, 1, a + b * c - 1)
      const r = a + b * c - d
      return {
        text: `Calculați: $${a} + ${b} \\cdot ${c} - ${d}$.`,
        solution: lines('Întâi înmulțirea, apoi adunarea și scăderea, de la stânga la dreapta:', show(`${a} + ${b} \\cdot ${c} - ${d} = ${a} + ${b * c} - ${d} = ${a + b * c} - ${d} = ${r}`)),
        verify: () => r === a + b * c - d && r >= 0,
      }
    }
    if (level === 2) {
      const [a, b, c] = [int(rng, 2, 9), int(rng, 2, 15), int(rng, 2, 15)]
      const e = int(rng, 2, 9)
      const d = e * int(rng, 1, Math.max(1, Math.floor((a * (b + c)) / e)))
      const r = a * (b + c) - d / e
      return {
        text: `Calculați: $${a} \\cdot (${b} + ${c}) - ${d} : ${e}$.`,
        solution: lines('Întâi paranteza, apoi înmulțirea și împărțirea, la final scăderea:', show(`${a} \\cdot (${b} + ${c}) - ${d} : ${e} = ${a} \\cdot ${b + c} - ${d / e} = ${a * (b + c)} - ${d / e} = ${r}`)),
        verify: () => r === a * (b + c) - d / e && r >= 0,
      }
    }
    const [b, c] = [int(rng, 2, 6), int(rng, 6, 12)]
    const d = int(rng, 1, c - 1)
    const e = int(rng, 2, 6)
    const q = int(rng, Math.ceil((b * (c - d) + 1) / e), Math.ceil((b * (c - d) + 1) / e) + 8)
    const a = q * e - b * (c - d)
    const f = int(rng, 2, 9)
    const r = q + f * f
    return {
      text: `Calculați: $\\left[${a} + ${b} \\cdot (${c} - ${d})\\right] : ${e} + ${f}^2$.`,
      solution: lines('Întâi parantezele, de la cea rotundă la cea dreaptă, apoi puterea, apoi împărțirea, la final adunarea:',
        show(`\\left[${a} + ${b} \\cdot ${c - d}\\right] : ${e} + ${f * f} = \\left[${a} + ${b * (c - d)}\\right] : ${e} + ${f * f} = ${a + b * (c - d)} : ${e} + ${f * f} = ${q} + ${f * f} = ${r}`)),
      verify: () => (a + b * (c - d)) / e === q && a > 0,
    }
  },
}

const powersV: Kind = {
  id: 'v-powers', grade: 5, topic: 'Algebră', label: 'Puteri cu exponent natural',
  make(rng, level) {
    if (level === 1) {
      const [a, m, b, n] = [int(rng, 2, 5), int(rng, 2, 3), int(rng, 2, 5), int(rng, 2, 3)]
      const r = a ** m + b ** n
      return {
        text: `Calculați: $${a}^${m} + ${b}^${n}$.`,
        solution: show(`${a}^${m} + ${b}^${n} = ${a ** m} + ${b ** n} = ${r}`),
        verify: () => r === a ** m + b ** n,
      }
    }
    if (level === 2) {
      const a = int(rng, 2, 7)
      const [m, n] = [int(rng, 3, 12), int(rng, 2, 12)]
      const p = int(rng, 1, m + n - 1)
      const k = m + n - p
      return {
        text: `Scrieți ca o singură putere: $${a}^{${m}} \\cdot ${a}^{${n}} : ${a}^{${p}}$.`,
        solution: lines('La înmulțire exponenții se adună, la împărțire se scad:', show(`${a}^{${m}} \\cdot ${a}^{${n}} : ${a}^{${p}} = ${a}^{${m} + ${n} - ${p}} = ${a}^{${k}}`)),
        verify: () => k > 0,
      }
    }
    const a = pick(rng, [2, 3, 5])
    const [m, n] = [int(rng, 2, 5), int(rng, 2, 4)]
    const p = int(rng, 1, 9)
    const q = int(rng, 1, Math.floor((m * n + p - 1) / 2))
    const k = m * n + p - 2 * q
    return {
      text: `Scrieți ca o singură putere: $(${a}^{${m}})^{${n}} \\cdot ${a}^{${p}} : (${a}^{${q}})^2$.`,
      solution: lines('La puterea unei puteri exponenții se înmulțesc:', show(`(${a}^{${m}})^{${n}} \\cdot ${a}^{${p}} : (${a}^{${q}})^2 = ${a}^{${m * n}} \\cdot ${a}^{${p}} : ${a}^{${2 * q}} = ${a}^{${m * n} + ${p} - ${2 * q}} = ${a}^{${k}}`)),
      verify: () => k > 0,
    }
  },
}

const fractionsV: Kind = {
  id: 'v-fractions', grade: 5, topic: 'Algebră', label: 'Adunarea și scăderea fracțiilor',
  make(rng, level) {
    if (level === 1) {
      const n = int(rng, 3, 12)
      const [a, b] = [int(rng, 1, n - 1), int(rng, 1, n - 1)]
      return {
        text: `Calculați: $\\frac{${a}}{${n}} + \\frac{${b}}{${n}}$.`,
        solution: lines('Fracțiile au același numitor: se adună numărătorii.', show(`\\frac{${a}}{${n}} + \\frac{${b}}{${n}} = \\frac{${a + b}}{${n}}${reduce(a + b, n)[1] !== n ? ` = ${frac(a + b, n)}` : ''}`)),
        verify: () => true,
      }
    }
    const pair = () => {
      const d = int(rng, 2, 12)
      return [int(rng, 1, d - 1), d] as const
    }
    const [[a, m], [b, n]] = [pair(), pair()]
    const L = lcm(m, n)
    if (level === 2) {
      const top = a * (L / m) + b * (L / n)
      return {
        text: `Calculați: $\\frac{${a}}{${m}} + \\frac{${b}}{${n}}$.`,
        solution: lines(`Aducem la numitorul comun ${L}:`, show(`\\frac{${a}}{${m}} + \\frac{${b}}{${n}} = \\frac{${a * (L / m)}}{${L}} + \\frac{${b * (L / n)}}{${L}} = \\frac{${top}}{${L}}${reduce(top, L)[1] !== L ? ` = ${frac(top, L)}` : ''}`)),
        verify: () => Math.abs(top / L - (a / m + b / n)) < 1e-9,
      }
    }
    const [c, p] = pair()
    const L3 = lcm(L, p)
    let top = a * (L3 / m) + b * (L3 / n) - c * (L3 / p)
    // the result must not be negative in grade V: then the last fraction is added instead
    const minus = top >= 0
    if (!minus) top = a * (L3 / m) + b * (L3 / n) + c * (L3 / p)
    const op = minus ? '-' : '+'
    return {
      text: `Calculați: $\\frac{${a}}{${m}} + \\frac{${b}}{${n}} ${op} \\frac{${c}}{${p}}$.`,
      solution: lines(`Aducem la numitorul comun ${L3}:`, show(`\\frac{${a * (L3 / m)}}{${L3}} + \\frac{${b * (L3 / n)}}{${L3}} ${op} \\frac{${c * (L3 / p)}}{${L3}} = \\frac{${top}}{${L3}}${reduce(top, L3)[1] !== L3 ? ` = ${frac(top, L3)}` : ''}`)),
      verify: () => Math.abs(top / L3 - (a / m + b / n + (minus ? -1 : 1) * (c / p))) < 1e-9,
    }
  },
}

const decimalsV: Kind = {
  id: 'v-decimals', grade: 5, topic: 'Algebră', label: 'Operații cu fracții zecimale',
  make(rng, level) {
    // in hundredths, so that the arithmetic stays exact
    const num = (lo: number, hi: number, places: number) => int(rng, lo, hi) / 10 ** places
    if (level === 1) {
      const [a, b] = [num(11, 999, 1), num(101, 9999, 2)]
      const r = Math.round((a + b) * 100) / 100
      return { text: `Calculați: $${dec(a)} + ${dec(b)}$.`, solution: show(`${dec(a)} + ${dec(b)} = ${dec(r)}`), verify: () => Math.abs(r - a - b) < 1e-9 }
    }
    if (level === 2) {
      const [a, b] = [num(11, 99, 1), num(2, 99, 1)]
      const r = Math.round(a * b * 100) / 100
      return {
        text: `Calculați: $${dec(a)} \\cdot ${dec(b)}$.`,
        solution: lines('Înmulțim ca pe numere naturale, apoi punem virgula după numărul total de zecimale ale factorilor:', show(`${dec(a)} \\cdot ${dec(b)} = ${dec(r)}`)),
        verify: () => Math.abs(r - a * b) < 1e-9,
      }
    }
    const [a, b] = [num(11, 99, 1), num(11, 99, 1)]
    const c = int(rng, 2, 9)
    const s = Math.round((a + b) * 10) / 10
    const d = num(1, Math.floor(s * c * 10) - 1, 1)
    const r = Math.round((s * c - d) * 100) / 100
    return {
      text: `Calculați: $(${dec(a)} + ${dec(b)}) \\cdot ${c} - ${dec(d)}$.`,
      solution: show(`(${dec(a)} + ${dec(b)}) \\cdot ${c} - ${dec(d)} = ${dec(s)} \\cdot ${c} - ${dec(d)} = ${dec(Math.round(s * c * 10) / 10)} - ${dec(d)} = ${dec(r)}`),
      verify: () => r >= 0 && Math.abs(r - ((a + b) * c - d)) < 1e-9,
    }
  },
}

const rectangleV: Kind = {
  id: 'v-rectangle', grade: 5, topic: 'Geometrie', label: 'Perimetrul și aria dreptunghiului și pătratului',
  make(rng, level) {
    if (level === 1) {
      const [L, l] = [int(rng, 6, 20), int(rng, 2, 5)]
      return {
        text: `Un dreptunghi are lungimea de ${L} cm și lățimea de ${l} cm. Calculați perimetrul dreptunghiului.`,
        solution: show(`P = 2 \\cdot (L + l) = 2 \\cdot (${L} + ${l}) = 2 \\cdot ${L + l} = ${2 * (L + l)}\\text{ cm}`),
        verify: () => true,
      }
    }
    if (level === 2) {
      const a = int(rng, 3, 15)
      return {
        text: `Un pătrat are latura de ${a} cm. Calculați perimetrul și aria pătratului.`,
        solution: lines(show(`P = 4 \\cdot \\ell = 4 \\cdot ${a} = ${4 * a}\\text{ cm}`), show(`\\mathcal{A} = \\ell^2 = ${a}^2 = ${a * a}\\text{ cm}^2`)),
        verify: () => true,
      }
    }
    const l = int(rng, 3, 12)
    const L = l + int(rng, 2, 10)
    const P = 2 * (L + l)
    return {
      text: `Un dreptunghi are perimetrul de ${P} cm și lungimea de ${L} cm. Calculați lățimea și aria dreptunghiului.`,
      solution: lines(show(`L + l = P : 2 = ${P} : 2 = ${P / 2}\\text{ cm}, \\quad l = ${P / 2} - ${L} = ${l}\\text{ cm}`), show(`\\mathcal{A} = L \\cdot l = ${L} \\cdot ${l} = ${L * l}\\text{ cm}^2`)),
      verify: () => P / 2 - L === l,
    }
  },
}

// ---------- grade VI ----------

const fractionsVI: Kind = {
  id: 'vi-fractions', grade: 6, topic: 'Algebră', label: 'Înmulțirea și împărțirea fracțiilor',
  make(rng, level) {
    const f = () => {
      const q = int(rng, 2, 12)
      return [int(rng, 1, 15), q] as const
    }
    const [[a, b], [c, d]] = [f(), f()]
    if (level === 1) {
      return {
        text: `Calculați: $\\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}}$.`,
        solution: lines('Se înmulțesc numărătorii între ei și numitorii între ei, apoi se simplifică:', show(`\\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}} = \\frac{${a * c}}{${b * d}}${reduce(a * c, b * d)[1] !== b * d ? ` = ${frac(a * c, b * d)}` : ''}`)),
        verify: () => true,
      }
    }
    if (level === 2) {
      return {
        text: `Calculați: $\\frac{${a}}{${b}} : \\frac{${c}}{${d}}$.`,
        solution: lines('Împărțirea la o fracție înseamnă înmulțirea cu inversa ei:', show(`\\frac{${a}}{${b}} : \\frac{${c}}{${d}} = \\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}} = \\frac{${a * d}}{${b * c}}${reduce(a * d, b * c)[1] !== b * c ? ` = ${frac(a * d, b * c)}` : ''}`)),
        verify: () => true,
      }
    }
    const [e, g] = f()
    const L = lcm(b, d)
    const top = a * (L / b) + c * (L / d)
    const [sn, sd] = reduce(top, L)
    return {
      text: `Calculați: $\\left(\\frac{${a}}{${b}} + \\frac{${c}}{${d}}\\right) \\cdot \\frac{${e}}{${g}}$.`,
      solution: lines('Întâi paranteza, aducând la numitorul comun, apoi înmulțirea:', show(`\\left(\\frac{${a * (L / b)}}{${L}} + \\frac{${c * (L / d)}}{${L}}\\right) \\cdot \\frac{${e}}{${g}} = ${frac(sn, sd)} \\cdot \\frac{${e}}{${g}} = ${frac(sn * e, sd * g)}`)),
      verify: () => Math.abs((sn * e) / (sd * g) - (a / b + c / d) * (e / g)) < 1e-9,
    }
  },
}

const percents: Kind = {
  id: 'vi-percent', grade: 6, topic: 'Algebră', label: 'Procente',
  make(rng, level) {
    if (level === 1) {
      const p = pick(rng, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75])
      const N = (100 / gcd(p, 100)) * int(rng, 1, 20)
      const r = (p * N) / 100
      return { text: `Calculați ${p}% din ${N}.`, solution: show(`${p}\\% \\text{ din } ${N} = \\frac{${p}}{100} \\cdot ${N} = ${r}`), verify: () => Number.isInteger(r) }
    }
    if (level === 2) {
      const p = pick(rng, [10, 15, 20, 25, 30, 40])
      const up = rng() < 0.5
      const P = (100 / gcd(p, 100)) * int(rng, 2, 30)
      const change = (p * P) / 100
      const r = up ? P + change : P - change
      return {
        text: `Un produs costă ${P} lei. Prețul lui ${up ? 'crește' : 'scade'} cu ${p}%. Cât costă produsul după ${up ? 'scumpire' : 'reducere'}?`,
        solution: lines(show(`${p}\\% \\text{ din } ${P} = \\frac{${p}}{100} \\cdot ${P} = ${change}\\text{ lei}`), show(`${P} ${up ? '+' : '-'} ${change} = ${r}\\text{ lei}`)),
        verify: () => Number.isInteger(change),
      }
    }
    const b = pick(rng, [20, 25, 40, 50, 80, 120, 200, 250, 400, 500])
    const p = pick(rng, [5, 10, 20, 25, 30, 40, 60, 75, 80].filter((x) => Number.isInteger((x * b) / 100)))
    const a = (p * b) / 100
    return {
      text: `Ce procent reprezintă ${a} din ${b}?`,
      solution: show(`\\frac{${a}}{${b}} \\cdot 100\\% = ${p}\\%`),
      verify: () => (a / b) * 100 === p,
    }
  },
}

const proportions: Kind = {
  id: 'vi-proportion', grade: 6, topic: 'Algebră', label: 'Proporții și mărimi direct proporționale',
  make(rng, level) {
    if (level === 1) {
      const [a, c] = [int(rng, 2, 12), int(rng, 2, 12)]
      // x/a = y/c with a whole y: y = x·c/a, so x is a multiple of a / gcd(a, c)
      const xx = (a / gcd(a, c)) * int(rng, 1, 6)
      const y = (xx * c) / a
      return {
        text: `Aflați numărul $x$ din proporția $\\frac{x}{${a}} = \\frac{${y}}{${c}}$.`,
        solution: lines('Produsul mezilor este egal cu produsul extremilor:', show(`x \\cdot ${c} = ${a} \\cdot ${y} \\Rightarrow x = \\frac{${a * y}}{${c}} = ${xx}`)),
        verify: () => xx * c === a * y,
      }
    }
    if (level === 2) {
      const [b, d] = [int(rng, 2, 9), int(rng, 2, 9)]
      const k = int(rng, 1, 6)
      const xa = b * k
      const c = d * k
      const a = int(rng, 1, 9)
      const x = xa - a
      return {
        text: `Aflați numărul $x$ din proporția $\\frac{x + ${a}}{${b}} = \\frac{${c}}{${d}}$.`,
        solution: show(`(x + ${a}) \\cdot ${d} = ${b} \\cdot ${c} \\Rightarrow x + ${a} = \\frac{${b * c}}{${d}} = ${xa} \\Rightarrow x = ${x}`),
        verify: () => (x + a) * d === b * c,
      }
    }
    const parts = [int(rng, 1, 5), int(rng, 2, 6), int(rng, 3, 7)]
    const s = parts[0] + parts[1] + parts[2]
    const k = int(rng, 2, 15)
    const N = s * k
    return {
      text: `Împărțiți numărul ${N} în părți direct proporționale cu numerele ${parts.join(', ')}.`,
      solution: lines(
        show(`\\frac{a}{${parts[0]}} = \\frac{b}{${parts[1]}} = \\frac{c}{${parts[2]}} = k \\Rightarrow a = ${parts[0]}k,\\ b = ${parts[1]}k,\\ c = ${parts[2]}k`),
        show(`${parts[0]}k + ${parts[1]}k + ${parts[2]}k = ${N} \\Rightarrow ${s}k = ${N} \\Rightarrow k = ${k}`),
        show(`a = ${parts[0] * k},\\ b = ${parts[1] * k},\\ c = ${parts[2] * k}`),
      ),
      verify: () => parts.reduce((t, p) => t + p * k, 0) === N,
    }
  },
}

const integers: Kind = {
  id: 'vi-integers', grade: 6, topic: 'Algebră', label: 'Operații cu numere întregi',
  make(rng, level) {
    if (level === 1) {
      const [a, b, c] = [nonZero(rng, -20, 20), nonZero(rng, -20, 20), nonZero(rng, -20, 20)]
      const r = a + b - c
      return {
        text: `Calculați: $${a} + ${paren(b)} - ${paren(c)}$.`,
        solution: show(`${a} + ${paren(b)} - ${paren(c)} = ${poly([[a, ''], [b, ''], [-c, '']])} = ${r}`),
        verify: () => r === a + b - c,
      }
    }
    if (level === 2) {
      const [a, b] = [nonZero(rng, -9, 9), nonZero(rng, -9, 9)]
      const d = nonZero(rng, -6, 6)
      const c = d * nonZero(rng, -8, 8)
      const r = a * b + c / d
      return {
        text: `Calculați: $${a} \\cdot ${paren(b)} + ${paren(c)} : ${paren(d)}$.`,
        solution: show(`${a} \\cdot ${paren(b)} + ${paren(c)} : ${paren(d)} = ${a * b} + ${paren(c / d)} = ${r}`),
        verify: () => r === a * b + c / d,
      }
    }
    const [a, n] = [nonZero(rng, -3, 3), int(rng, 2, 3)]
    const [b, m] = [nonZero(rng, -4, 4), 2]
    const c = nonZero(rng, -15, 15)
    const r = a ** n - b ** m + c
    return {
      text: `Calculați: $(${a})^${n} - (${b})^${m} + ${paren(c)}$.`,
      solution: lines('O putere a unui număr negativ este pozitivă când exponentul e par și negativă când e impar:', show(`(${a})^${n} - (${b})^${m} + ${paren(c)} = ${paren(a ** n)} - ${b ** m} + ${paren(c)} = ${r}`)),
      verify: () => r === a ** n - b ** m + c,
    }
  },
}

const anglesVI: Kind = {
  id: 'vi-angles', grade: 6, topic: 'Geometrie', label: 'Unghiuri în triunghi, complement și suplement',
  make(rng, level) {
    if (level === 1) {
      const A = int(rng, 30, 90)
      const B = int(rng, 20, 160 - A)
      const C = 180 - A - B
      return {
        text: `În triunghiul $ABC$, $\\angle A = ${A}^\\circ$ și $\\angle B = ${B}^\\circ$. Aflați măsura unghiului $C$.`,
        solution: lines('Suma măsurilor unghiurilor unui triunghi este $180^\\circ$:', show(`\\angle C = 180^\\circ - ${A}^\\circ - ${B}^\\circ = ${C}^\\circ`)),
        verify: () => C > 0,
      }
    }
    if (level === 2) {
      const a = int(rng, 10, 80)
      return {
        text: `Un unghi are măsura de $${a}^\\circ$. Aflați măsura complementului și a suplementului său.`,
        solution: lines(show(`\\text{complementul: } 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`), show(`\\text{suplementul: } 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`)),
        verify: () => true,
      }
    }
    const options = [[1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 3, 7], [1, 1, 2], [3, 4, 5], [1, 4, 7], [2, 5, 5], [1, 2, 2], [1, 1, 3], [2, 3, 10], [3, 5, 7], [1, 5, 9], [4, 5, 6], [2, 7, 9], [5, 6, 7], [1, 8, 9], [3, 7, 10], [4, 7, 9], [5, 6, 9], [1, 2, 9], [3, 4, 8], [1, 6, 8]]
    const parts = pick(rng, options.filter((p) => 180 % (p[0] + p[1] + p[2]) === 0))
    const k = 180 / (parts[0] + parts[1] + parts[2])
    return {
      text: `Măsurile unghiurilor unui triunghi sunt direct proporționale cu numerele ${parts.join(', ')}. Aflați măsurile unghiurilor.`,
      solution: lines(
        show(`\\angle A = ${parts[0]}k,\\ \\angle B = ${parts[1]}k,\\ \\angle C = ${parts[2]}k,\\quad ${parts[0] + parts[1] + parts[2]}k = 180^\\circ \\Rightarrow k = ${k}^\\circ`),
        show(`\\angle A = ${parts[0] * k}^\\circ,\\ \\angle B = ${parts[1] * k}^\\circ,\\ \\angle C = ${parts[2] * k}^\\circ`),
      ),
      verify: () => parts.reduce((t, p) => t + p * k, 0) === 180,
    }
  },
}

// ---------- grade VII ----------

const radicals: Kind = {
  id: 'vii-radicals', grade: 7, topic: 'Algebră', label: 'Calcule cu radicali',
  make(rng, level) {
    const b = pick(rng, [2, 3, 5, 6, 7])
    const count = level === 1 ? 2 : 3
    const ks = Array.from({ length: count }, () => int(rng, 2, 6))
    const signs = ks.map((_, i) => (i === 0 || level === 1 ? 1 : rng() < 0.5 ? -1 : 1))
    const coefs = ks.map(() => (level === 3 ? int(rng, 1, 3) : 1))
    const term = (i: number) => (coefs[i] === 1 ? '' : coefs[i]) + `\\sqrt{${ks[i] ** 2 * b}}`
    const simple = (i: number) => (coefs[i] * ks[i] === 1 ? '' : coefs[i] * ks[i]) + `\\sqrt{${b}}`
    const join = (f: (i: number) => string) => ks.map((_, i) => (i === 0 ? '' : signs[i] < 0 ? ' - ' : ' + ') + f(i)).join('')
    const total = ks.reduce((s, k, i) => s + signs[i] * coefs[i] * k, 0)
    return {
      text: `Calculați: $${join(term)}$.`,
      solution: lines(
        'Scoatem factorii de sub radical, apoi adunăm termenii asemenea:',
        ...ks.map((k) => show(`\\sqrt{${k ** 2 * b}} = \\sqrt{${k ** 2} \\cdot ${b}} = ${k}\\sqrt{${b}}`)),
        show(`${join(term)} = ${join(simple)} = ${surd(total, 1, b)}`),
      ),
      verify: () => Math.abs(ks.reduce((s, k, i) => s + signs[i] * coefs[i] * Math.sqrt(k * k * b), 0) - total * Math.sqrt(b)) < 1e-9,
    }
  },
}

const linear: Kind = {
  id: 'vii-linear', grade: 7, topic: 'Algebră', label: 'Ecuații de gradul I',
  make(rng, level) {
    const x0 = nonZero(rng, -9, 9)
    if (level === 1) {
      const a = nonZero(rng, -9, 9)
      const b = nonZero(rng, -20, 20)
      const c = a * x0 + b
      return {
        text: `Rezolvați în $\\mathbb{R}$ ecuația $${poly([[a, 'x'], [b, '']])} = ${c}$.`,
        solution: show(`${poly([[a, 'x']])} = ${c} - ${paren(b)} \\Rightarrow ${poly([[a, 'x']])} = ${c - b} \\Rightarrow x = ${frac(c - b, a)}, \\quad S = \\{${x0}\\}`),
        verify: () => a * x0 + b === c,
      }
    }
    if (level === 2) {
      let [a, c] = [nonZero(rng, -9, 9), nonZero(rng, -9, 9)]
      if (a === c) c = a + 1 || 2
      const b = int(rng, -20, 20)
      const d = (a - c) * x0 + b
      return {
        text: `Rezolvați în $\\mathbb{R}$ ecuația $${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])}$.`,
        solution: lines('Trecem termenii cu $x$ în stânga și numerele în dreapta:', show(`${poly([[a, 'x'], [-c, 'x']])} = ${poly([[d, ''], [-b, '']])} \\Rightarrow ${poly([[a - c, 'x']])} = ${d - b} \\Rightarrow x = ${x0}, \\quad S = \\{${x0}\\}`)),
        verify: () => a * x0 + b === c * x0 + d,
      }
    }
    // a(x + b) - c = d(x - e)
    let [a, d] = [nonZero(rng, 2, 6), nonZero(rng, 1, 5)]
    if (a === d) a += 1
    const [b, e] = [nonZero(rng, -9, 9), nonZero(rng, -9, 9)]
    const c = a * (x0 + b) - d * (x0 - e)
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $${a}(${poly([[1, 'x'], [b, '']])}) - ${paren(c)} = ${d === 1 ? '' : d}(${poly([[1, 'x'], [-e, '']])})$.`,
      solution: lines(
        'Desfacem parantezele:',
        show(`${poly([[a, 'x'], [a * b, '']])} - ${paren(c)} = ${poly([[d, 'x'], [-d * e, '']])}`),
        show(`${poly([[a, 'x'], [-d, 'x']])} = ${poly([[-d * e, ''], [-a * b, ''], [c, '']])} \\Rightarrow ${poly([[a - d, 'x']])} = ${-d * e - a * b + c} \\Rightarrow x = ${x0}, \\quad S = \\{${x0}\\}`),
      ),
      verify: () => a * (x0 + b) - c === d * (x0 - e),
    }
  },
}

const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]

const pythagoras: Kind = {
  id: 'vii-pythagoras', grade: 7, topic: 'Geometrie', label: 'Teorema lui Pitagora',
  make(rng, level) {
    const [b, c, a] = rightTriangle(rng, 100)
    if (level === 1) {
      return {
        text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${b}$ cm și $AC = ${c}$ cm. Calculați lungimea ipotenuzei $BC$.`,
        solution: lines('Din teorema lui Pitagora:', show(`BC^2 = AB^2 + AC^2 = ${b * b} + ${c * c} = ${a * a} \\Rightarrow BC = ${a}\\text{ cm}`)),
        verify: () => b * b + c * c === a * a,
      }
    }
    if (level === 2) {
      return {
        text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $BC = ${a}$ cm și $AB = ${b}$ cm. Calculați lungimea catetei $AC$.`,
        solution: lines('Din teorema lui Pitagora:', show(`AC^2 = BC^2 - AB^2 = ${a * a} - ${b * b} = ${c * c} \\Rightarrow AC = ${c}\\text{ cm}`)),
        verify: () => a * a - b * b === c * c,
      }
    }
    // legs whose hypotenuse is not whole: the answer is a radical
    let [x, y] = [int(rng, 1, 15), int(rng, 2, 20)]
    while (Number.isInteger(Math.sqrt(x * x + y * y))) y += 1
    const n = x * x + y * y
    return {
      text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${x}$ cm și $AC = ${y}$ cm. Calculați lungimea ipotenuzei $BC$.`,
      solution: lines('Din teorema lui Pitagora:', show(`BC^2 = ${x * x} + ${y * y} = ${n} \\Rightarrow BC = \\sqrt{${n}}${rootParts(n)[0] > 1 ? ` = ${root(n)}` : ''}\\text{ cm}`)),
      verify: () => !Number.isInteger(Math.sqrt(n)),
    }
  },
}

const areasVII: Kind = {
  id: 'vii-areas', grade: 7, topic: 'Geometrie', label: 'Aria paralelogramului, trapezului și rombului',
  make(rng, level) {
    if (level === 1) {
      const [b, h] = [int(rng, 4, 20), int(rng, 2, 12)]
      return {
        text: `Un paralelogram are o latură de ${b} cm, iar înălțimea corespunzătoare ei are ${h} cm. Calculați aria paralelogramului.`,
        solution: show(`\\mathcal{A} = b \\cdot h = ${b} \\cdot ${h} = ${b * h}\\text{ cm}^2`),
        verify: () => true,
      }
    }
    if (level === 2) {
      const b = int(rng, 3, 12)
      const B = b + int(rng, 2, 10)
      const h = 2 * int(rng, 1, 6)
      return {
        text: `Un trapez are bazele de ${B} cm și ${b} cm, iar înălțimea de ${h} cm. Calculați aria trapezului.`,
        solution: show(`\\mathcal{A} = \\frac{(B + b) \\cdot h}{2} = \\frac{(${B} + ${b}) \\cdot ${h}}{2} = \\frac{${(B + b) * h}}{2} = ${((B + b) * h) / 2}\\text{ cm}^2`),
        verify: () => Number.isInteger(((B + b) * h) / 2),
      }
    }
    // a rhombus whose half-diagonals form a Pythagorean triple: the side is whole too
    const [p, q, r] = pick(rng, TRIPLES)
    const k = pick(rng, [1, 2, 3])
    const [d1, d2] = shuffle(rng, [2 * p * k, 2 * q * k])
    const l = r * k
    return {
      text: `Un romb are diagonalele de ${d1} cm și ${d2} cm. Calculați aria și perimetrul rombului.`,
      solution: lines(
        show(`\\mathcal{A} = \\frac{d_1 \\cdot d_2}{2} = \\frac{${d1} \\cdot ${d2}}{2} = ${(d1 * d2) / 2}\\text{ cm}^2`),
        'Diagonalele rombului sunt perpendiculare și se înjumătățesc; din teorema lui Pitagora:',
        show(`\\ell^2 = ${d1 / 2}^2 + ${d2 / 2}^2 = ${l * l} \\Rightarrow \\ell = ${l}\\text{ cm}, \\quad P = 4\\ell = ${4 * l}\\text{ cm}`),
      ),
      verify: () => (d1 / 2) ** 2 + (d2 / 2) ** 2 === l * l,
    }
  },
}

const thales: Kind = {
  id: 'vii-thales', grade: 7, topic: 'Geometrie', label: 'Teorema lui Thales și asemănarea',
  make(rng, level) {
    const AD = int(rng, 2, 9)
    const DB = int(rng, 2, 9)
    const t = int(rng, 1, 4)
    if (level === 1) {
      // AE a multiple of AD, so that EC is whole
      const AE = AD * t
      const EC = DB * t
      return {
        text: `În triunghiul $ABC$, punctele $D \\in AB$ și $E \\in AC$ sunt astfel încât $DE \\parallel BC$. Știind că $AD = ${AD}$ cm, $DB = ${DB}$ cm și $AE = ${AE}$ cm, aflați lungimea segmentului $EC$.`,
        solution: lines('Din teorema lui Thales:', show(`\\frac{AD}{DB} = \\frac{AE}{EC} \\Rightarrow \\frac{${AD}}{${DB}} = \\frac{${AE}}{EC} \\Rightarrow EC = \\frac{${DB} \\cdot ${AE}}{${AD}} = ${EC}\\text{ cm}`)),
        verify: () => AD * EC === DB * AE,
      }
    }
    const AB = AD + DB
    const BC = AB * t
    const DE = AD * t
    if (level === 2) {
      return {
        text: `În triunghiul $ABC$, $D \\in AB$ și $E \\in AC$, cu $DE \\parallel BC$. Știind că $AD = ${AD}$ cm, $AB = ${AB}$ cm și $BC = ${BC}$ cm, aflați lungimea segmentului $DE$.`,
        solution: lines('Din teorema fundamentală a asemănării, $\\triangle ADE \\sim \\triangle ABC$:', show(`\\frac{AD}{AB} = \\frac{DE}{BC} \\Rightarrow \\frac{${AD}}{${AB}} = \\frac{DE}{${BC}} \\Rightarrow DE = \\frac{${AD} \\cdot ${BC}}{${AB}} = ${DE}\\text{ cm}`)),
        verify: () => AD * BC === DE * AB,
      }
    }
    const AC = AB * int(rng, 1, 3)
    const AE = (AD * AC) / AB
    const P = AB + BC + AC
    return {
      text: `În triunghiul $ABC$, $D \\in AB$ și $E \\in AC$, cu $DE \\parallel BC$. Știind că $AD = ${AD}$ cm, $AB = ${AB}$ cm, $AC = ${AC}$ cm și $BC = ${BC}$ cm, calculați perimetrul triunghiului $ADE$.`,
      solution: lines(
        'Din teorema fundamentală a asemănării, $\\triangle ADE \\sim \\triangle ABC$, cu raportul de asemănare:',
        show(`k = \\frac{AD}{AB} = ${frac(AD, AB)}`),
        show(`AE = k \\cdot AC = ${frac(AE, 1)}\\text{ cm}, \\quad DE = k \\cdot BC = ${DE}\\text{ cm}`),
        show(`P_{ADE} = k \\cdot P_{ABC} = ${frac(AD, AB)} \\cdot ${P} = ${frac(AD * P, AB)}\\text{ cm}`),
      ),
      verify: () => Math.abs(AD + AE + DE - (AD * P) / AB) < 1e-9,
    }
  },
}

/** sin, cos, tg of the special angles of a right triangle, exactly. */
const TRIG: Record<'sin' | 'cos' | 'tg', Record<30 | 45 | 60, Exact>> = {
  sin: { 30: exact(1, 2), 45: exact(1, 2, 2), 60: exact(1, 2, 3) },
  cos: { 30: exact(1, 2, 3), 45: exact(1, 2, 2), 60: exact(1, 2) },
  tg: { 30: exact(1, 3, 3), 45: exact(1, 1), 60: exact(1, 1, 3) },
}
const fn = (f: string) => (f === 'tg' ? '\\operatorname{tg}' : `\\${f}`)

const trigRight: Kind = {
  id: 'vii-trig', grade: 7, topic: 'Geometrie', label: 'Rapoarte trigonometrice în triunghiul dreptunghic',
  make(rng, level) {
    if (level === 1) {
      const [p, q, r] = rightTriangle(rng, 100)
      return {
        text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${p}$ cm, $AC = ${q}$ cm și $BC = ${r}$ cm. Calculați $\\sin B$, $\\cos B$ și $\\operatorname{tg} B$.`,
        solution: lines(
          'Pentru unghiul $B$, cateta opusă este $AC$, iar cateta alăturată este $AB$:',
          show(`\\sin B = \\frac{AC}{BC} = ${frac(q, r)}, \\quad \\cos B = \\frac{AB}{BC} = ${frac(p, r)}, \\quad \\operatorname{tg} B = \\frac{AC}{AB} = ${frac(q, p)}`),
        ),
        verify: () => p * p + q * q === r * r,
      }
    }
    if (level === 2) {
      const BC = 2 * int(rng, 2, 20)
      // the angle of 30° at B or at C: the leg opposite it is half the hypotenuse
      const atB = rng() < 0.5
      const [half, other] = atB ? ['AC', 'AB'] : ['AB', 'AC']
      return {
        text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $\\angle ${atB ? 'B' : 'C'} = 30^\\circ$ și $BC = ${BC}$ cm. Calculați lungimile catetelor.`,
        solution: lines(
          'Cateta opusă unghiului de $30^\\circ$ este jumătate din ipotenuză:',
          show(`${half} = \\frac{BC}{2} = ${BC / 2}\\text{ cm}`),
          show(`${other} = BC \\cdot \\cos 30^\\circ = ${BC} \\cdot \\frac{\\sqrt{3}}{2} = ${surd(BC / 2, 1, 3)}\\text{ cm}`),
        ),
        verify: () => Math.abs((BC / 2) ** 2 + 3 * (BC / 2) ** 2 - BC * BC) < 1e-9,
      }
    }
    const terms = shuffle(rng, [
      ['sin', pick(rng, [30, 45, 60] as const)], ['cos', pick(rng, [30, 45, 60] as const)], ['tg', pick(rng, [30, 45, 60] as const)],
    ] as ['sin' | 'cos' | 'tg', 30 | 45 | 60][]).slice(0, 3)
    const coefs = terms.map(() => pick(rng, [1, 2, 3, -1, -2]))
    coefs[0] = Math.abs(coefs[0])
    const expr = terms.map(([f, a], i) => {
      const c = coefs[i]
      const mag = Math.abs(c) === 1 ? '' : Math.abs(c) + ' '
      return (i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + ') + mag + `${fn(f)} ${a}^\\circ`
    }).join('')
    const subst = terms.map(([f, a], i) => {
      const c = coefs[i]
      const mag = Math.abs(c) === 1 ? '' : Math.abs(c) + ' \\cdot '
      return (i === 0 ? (c < 0 ? '-' : '') : c < 0 ? ' - ' : ' + ') + mag + exactTex(TRIG[f][a])
    }).join('')
    const total = terms.reduce<Exact>((s, [f, a], i) => addExact(s, TRIG[f][a], coefs[i]), new Map())
    return {
      text: `Calculați: $${expr}$.`,
      solution: show(`${expr} = ${subst} = ${exactTex(total)}`),
      verify: () => true,
    }
  },
}

// ---------- grade VIII ----------

const inequality: Kind = {
  id: 'viii-inequality', grade: 8, topic: 'Algebră', label: 'Inecuații de gradul I',
  make(rng, level) {
    const x0 = int(rng, -9, 9)
    const a = level === 1 ? nonZero(rng, 1, 9) : nonZero(rng, -9, 9)
    const b = nonZero(rng, -20, 20)
    const rel = pick(rng, ['<', '\\le', '>', '\\ge'] as const)
    const flip: Record<string, string> = { '<': '>', '\\le': '\\ge', '>': '<', '\\ge': '\\le' }
    const final = a < 0 ? flip[rel] : rel
    const interval = { '<': `(-\\infty, ${x0})`, '\\le': `(-\\infty, ${x0}]`, '>': `(${x0}, +\\infty)`, '\\ge': `[${x0}, +\\infty)` }[final]!
    if (level < 3) {
      const c = a * x0 + b
      return {
        text: `Rezolvați în $\\mathbb{R}$ inecuația $${poly([[a, 'x'], [b, '']])} ${rel} ${c}$.`,
        solution: lines(
          show(`${poly([[a, 'x']])} ${rel} ${c - b}`),
          a < 0 ? `Împărțim la ${a}, un număr negativ, deci sensul inegalității se schimbă:` : `Împărțim la ${a}:`,
          show(`x ${final} ${x0} \\Rightarrow S = ${interval}`),
        ),
        verify: () => a * x0 + b === c,
      }
    }
    // with the unknown on both sides: a·x + b ? cc·x + d, where a - cc = k is not 0
    const k = nonZero(rng, -6, 6)
    const cc = a - k
    const d = k * x0 + b
    const final3 = k < 0 ? flip[rel] : rel
    const interval3 = { '<': `(-\\infty, ${x0})`, '\\le': `(-\\infty, ${x0}]`, '>': `(${x0}, +\\infty)`, '\\ge': `[${x0}, +\\infty)` }[final3]!
    return {
      text: `Rezolvați în $\\mathbb{R}$ inecuația $${poly([[a, 'x'], [b, '']])} ${rel} ${poly([[cc, 'x'], [d, '']])}$.`,
      solution: lines(
        show(`${poly([[a, 'x'], [-cc, 'x']])} ${rel} ${poly([[d, ''], [-b, '']])} \\Rightarrow ${poly([[k, 'x']])} ${rel} ${d - b}`),
        k < 0 ? `Împărțim la ${k}, un număr negativ, deci sensul inegalității se schimbă:` : `Împărțim la ${k}:`,
        show(`x ${final3} ${x0} \\Rightarrow S = ${interval3}`),
      ),
      verify: () => k * x0 === d - b && a - cc === k,
    }
  },
}

const system: Kind = {
  id: 'viii-system', grade: 8, topic: 'Algebră', label: 'Sisteme de ecuații',
  make(rng, level) {
    const [x0, y0] = [int(rng, -6, 6), int(rng, -6, 6)]
    let a1: number, b1: number, a2: number, b2: number
    do {
      a1 = level === 1 ? 1 : nonZero(rng, -5, 5)
      b1 = nonZero(rng, -5, 5)
      a2 = nonZero(rng, -5, 5)
      b2 = level === 1 ? -b1 : nonZero(rng, -5, 5)
    } while (a1 * b2 - a2 * b1 === 0)
    const [c1, c2] = [a1 * x0 + b1 * y0, a2 * x0 + b2 * y0]
    const eq = (a: number, b: number, c: number) => `${poly([[a, 'x'], [b, 'y']])} = ${c}`
    // reduction: make the coefficients of x opposite
    const [m1, m2] = [a2, -a1]
    const B = m1 * b1 + m2 * b2
    const C = m1 * c1 + m2 * c2
    return {
      text: `Rezolvați sistemul de ecuații: $\\begin{cases} ${eq(a1, b1, c1)} \\\\ ${eq(a2, b2, c2)} \\end{cases}$`,
      solution: lines(
        `Prin metoda reducerii: înmulțim prima ecuație cu ${paren(m1)} și a doua cu ${paren(m2)}, apoi le adunăm, ca să dispară $x$:`,
        show(`${poly([[B, 'y']])} = ${C} \\Rightarrow y = ${y0}`),
        'Înlocuim în prima ecuație:',
        show(`${poly([[a1, 'x']])} ${b1 * y0 < 0 ? '-' : '+'} ${Math.abs(b1 * y0)} = ${c1} \\Rightarrow x = ${x0}`),
        show(`S = \\{(${x0}, ${y0})\\}`),
      ),
      verify: () => B * y0 === C && a1 * x0 + b1 * y0 === c1 && a2 * x0 + b2 * y0 === c2,
    }
  },
}

const factoring: Kind = {
  id: 'viii-factoring', grade: 8, topic: 'Algebră', label: 'Descompunerea în factori',
  make(rng, level) {
    if (level === 1) {
      const a = int(rng, 2, 12)
      if (rng() < 0.5) {
        return {
          text: `Descompuneți în factori: $x^2 - ${a * a}$.`,
          solution: lines('Formula diferenței de pătrate, $a^2 - b^2 = (a - b)(a + b)$:', show(`x^2 - ${a * a} = x^2 - ${a}^2 = (x - ${a})(x + ${a})`)),
          verify: () => true,
        }
      }
      const k = int(rng, 2, 9)
      return {
        text: `Descompuneți în factori: $${poly([[k, 'x^2'], [k * a, 'x']])}$.`,
        solution: lines('Dăm factor comun:', show(`${poly([[k, 'x^2'], [k * a, 'x']])} = ${k}x(x + ${a})`)),
        verify: () => true,
      }
    }
    if (level === 2) {
      const r1 = nonZero(rng, -9, 9)
      let r2 = nonZero(rng, -9, 9)
      if (r2 === -r1) r2 += 1
      const s = r1 + r2
      const p = r1 * r2
      return {
        text: `Descompuneți în factori: $${poly([[1, 'x^2'], [s, 'x'], [p, '']])}$.`,
        solution: lines(
          `Căutăm două numere cu suma ${s} și produsul ${p}: acestea sunt ${r1} și ${r2}. Descompunem termenul din mijloc:`,
          show(`${poly([[1, 'x^2'], [r1, 'x'], [r2, 'x'], [p, '']])} = x(${poly([[1, 'x'], [r1, '']])}) ${r2 < 0 ? '-' : '+'} ${Math.abs(r2)}(${poly([[1, 'x'], [r1, '']])}) = (${poly([[1, 'x'], [r1, '']])})(${poly([[1, 'x'], [r2, '']])})`),
        ),
        verify: () => r1 + r2 === s && r1 * r2 === p,
      }
    }
    const [a, b] = [int(rng, 2, 5), int(rng, 1, 7)]
    const sign = rng() < 0.5 ? 1 : -1
    return {
      text: `Descompuneți în factori: $${poly([[a * a, 'x^2'], [sign * 2 * a * b, 'x'], [b * b, '']])}$.`,
      solution: lines(
        `Formula pătratului unui binom, $a^2 ${sign < 0 ? '-' : '+'} 2ab + b^2 = (a ${sign < 0 ? '-' : '+'} b)^2$:`,
        show(`${poly([[a * a, 'x^2'], [sign * 2 * a * b, 'x'], [b * b, '']])} = (${a}x)^2 ${sign < 0 ? '-' : '+'} 2 \\cdot ${a}x \\cdot ${b} + ${b}^2 = (${poly([[a, 'x'], [sign * b, '']])})^2`),
      ),
      verify: () => true,
    }
  },
}

const quadratic: Kind = {
  id: 'viii-quadratic', grade: 8, topic: 'Algebră', label: 'Ecuații de gradul II (prin descompunere)',
  make(rng, level) {
    if (level === 1) {
      const a = int(rng, 1, 12)
      return {
        text: `Rezolvați în $\\mathbb{R}$ ecuația $x^2 = ${a * a}$.`,
        solution: show(`x^2 = ${a * a} \\Rightarrow x = \\pm\\sqrt{${a * a}} = \\pm ${a}, \\quad S = \\{-${a}, ${a}\\}`),
        verify: () => true,
      }
    }
    if (level === 2) {
      const k = int(rng, 1, 5)
      const r = nonZero(rng, -9, 9)
      return {
        text: `Rezolvați în $\\mathbb{R}$ ecuația $${poly([[k, 'x^2'], [-k * r, 'x']])} = 0$.`,
        solution: lines('Dăm factor comun și folosim faptul că un produs este zero doar dacă unul dintre factori este zero:',
          show(`${k === 1 ? '' : k}x(x ${r < 0 ? '+' : '-'} ${Math.abs(r)}) = 0 \\Rightarrow x = 0 \\text{ sau } x = ${r}, \\quad S = \\{${[0, r].sort((u, v) => u - v).join(', ')}\\}`)),
        verify: () => k * r * r - k * r * r === 0,
      }
    }
    const r1 = nonZero(rng, -9, 9)
    let r2 = nonZero(rng, -9, 9)
    if (r2 === r1) r2 = r1 === 9 ? r1 - 1 : r1 + 1
    const [s, p] = [-(r1 + r2), r1 * r2]
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $${poly([[1, 'x^2'], [s, 'x'], [p, '']])} = 0$.`,
      solution: lines(
        `Descompunem în factori: căutăm două numere cu suma ${-s} și produsul ${p}, adică ${r1} și ${r2}.`,
        show(`(${poly([[1, 'x'], [-r1, '']])})(${poly([[1, 'x'], [-r2, '']])}) = 0 \\Rightarrow x = ${r1} \\text{ sau } x = ${r2}, \\quad S = \\{${[r1, r2].sort((u, v) => u - v).join(', ')}\\}`),
      ),
      verify: () => r1 * r1 + s * r1 + p === 0 && r2 * r2 + s * r2 + p === 0,
    }
  },
}

const solidsVIII: Kind = {
  id: 'viii-solids', grade: 8, topic: 'Geometrie', label: 'Arii și volume ale corpurilor',
  make(rng, level) {
    if (level === 1) {
      const l = int(rng, 2, 25)
      return {
        text: `Un cub are muchia de ${l} cm. Calculați aria totală și volumul cubului.`,
        solution: lines(show(`\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${l * l} = ${6 * l * l}\\text{ cm}^2`), show(`V = \\ell^3 = ${l}^3 = ${l ** 3}\\text{ cm}^3`)),
        verify: () => true,
      }
    }
    if (level === 2) {
      const [L, l, h] = [int(rng, 3, 12), int(rng, 2, 8), int(rng, 2, 10)]
      const d2 = L * L + l * l + h * h
      return {
        text: `Un paralelipiped dreptunghic are dimensiunile $L = ${L}$ cm, $\\ell = ${l}$ cm și $h = ${h}$ cm. Calculați volumul și lungimea diagonalei.`,
        solution: lines(show(`V = L \\cdot \\ell \\cdot h = ${L} \\cdot ${l} \\cdot ${h} = ${L * l * h}\\text{ cm}^3`), show(`d = \\sqrt{L^2 + \\ell^2 + h^2} = \\sqrt{${L * L} + ${l * l} + ${h * h}} = \\sqrt{${d2}}${rootParts(d2)[0] > 1 ? ` = ${root(d2)}` : ''}\\text{ cm}`)),
        verify: () => true,
      }
    }
    // a regular square pyramid whose height, half side and apothem form a Pythagorean triple
    const [p0, q0, r0] = pick(rng, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]])
    const m = pick(rng, [1, 2, 3])
    const [p, q, r] = [p0 * m, q0 * m, r0 * m]
    const [half, h, ap] = rng() < 0.5 ? [p, q, r] : [q, p, r]
    const l = 2 * half
    return {
      text: `O piramidă patrulateră regulată are latura bazei de ${l} cm și înălțimea de ${h} cm. Calculați apotema piramidei și volumul ei.`,
      solution: lines(
        'Apotema bazei este jumătate din latură; înălțimea, apotema bazei și apotema piramidei formează un triunghi dreptunghic:',
        show(`a_p^2 = h^2 + \\left(\\frac{\\ell}{2}\\right)^2 = ${h * h} + ${half * half} = ${ap * ap} \\Rightarrow a_p = ${ap}\\text{ cm}`),
        show(`V = \\frac{\\mathcal{A}_b \\cdot h}{3} = \\frac{${l}^2 \\cdot ${h}}{3} = \\frac{${l * l * h}}{3} = ${frac(l * l * h, 3)}\\text{ cm}^3`),
      ),
      verify: () => h * h + half * half === ap * ap,
    }
  },
}

/** A kind made only of forms: the expressions of grade VIII, as subject II of the national exam asks them. */
const expressions: Kind = {
  id: 'viii-expressions', grade: 8, topic: 'Algebră', label: 'Calcul cu expresii și rapoarte algebrice',
  make: (rng, level) => H.expressions(rng, level as 1 | 2 | 3),
}

export const GENERATORS: Generator[] = [
  withForms(orderOfOps, { 1: [F.opsParens, F.opsTwoProducts], 2: [F.opsSquare], 3: [F.opsBraces] }),
  withForms(powersV, { 1: [F.powersCompare], 2: [F.powersSameBase], 3: [F.powersLastDigit] }),
  withForms(fractionsV, { 1: [F.fractionSimplify], 2: [F.fractionCompare], 3: [F.fractionProblem] }),
  withForms(decimalsV, { 1: [F.decimalsSubtract], 2: [F.decimalsDivide], 3: [F.decimalsProblem] }),
  withForms(rectangleV, { 1: [F.squarePerimeterToArea], 2: [F.rectangleArea], 3: [F.samePerimeter] }),

  withForms(fractionsVI, { 1: [F.fractionOfNumber], 2: [F.fractionSquare], 3: [F.fractionMixed] }),
  withForms(percents, { 1: [F.fractionOfNumber], 2: [F.percentWhole], 3: [F.percentTwice] }),
  withForms(proportions, { 1: [F.proportionCross], 2: [F.proportionInverse], 3: [F.proportionInverseSplit] }),
  withForms(integers, { 1: [F.integersAbs], 2: [F.integersEquation], 3: [F.integersSigns] }),
  withForms(anglesVI, { 1: [F.anglesIsosceles], 2: [F.anglesVertical], 3: [F.anglesExterior] }),

  withForms(radicals, { 1: [F.radicalsProduct], 2: [F.radicalsRationalize] }, [H.radicalsHard, F.radicalsCompare]),
  withForms(linear, { 1: [F.linearProblem] }, [H.linearHard, F.linearFractionsSum]),
  withForms(pythagoras, { 1: [F.equilateralHeight], 2: [F.rectangleDiagonal] }, [H.metricHard, F.isoscelesHeight]),
  withForms(areasVII, { 1: [F.squareDiagonal], 2: [F.parallelogram30] }, [H.trapezoidHard, F.rhombusFromSide]),
  withForms(thales, { 1: [F.midline], 2: [F.thalesFind], 3: [F.similarArea] }),
  withForms(trigRight, { 1: [F.trig45] }, [H.trigHard, F.trigTangent]),

  withForms(inequality, { 1: [F.inequalityNatural], 2: [F.inequalityParens] }, [H.inequalityHard, F.inequalityExtreme, E.absoluteInequality]),
  withForms(system, { 1: [F.systemSum], 2: [F.systemSubstitution, F.systemProblem] }, [H.systemHard, F.systemParens], false),
  withForms(factoring, { 1: [F.factoringCommonNumber], 2: [F.factoringGrouping] }, [(rng) => H.factoringHard(rng, 0), (rng) => H.factoringHard(rng, 1), (rng) => H.factoringHard(rng, 2), E2.factoringCubeSquare]),
  withForms(quadratic, { 1: [F.quadraticRadical], 2: [F.quadraticSquare] }, [H.quadraticHard, F.quadraticCommon]),
  withForms(expressions, { 1: [F.expressionProduct], 2: [F.expressionDivisible, E.reciprocalIdentity], 3: [F.expressionMinimum, E.rationalToX, E2.absoluteConstant] }),
  withForms(solidsVIII, { 1: [F.cuboidEasy, F.cubeFromVolume], 2: [F.prismTriangle, F.cylinder, F.cone, E2.cubeAngles] }, [H.pyramidHard, F.cubeHard, F.cuboidHard, F.coneHard]),
  // the chapters of geometry in space beyond areas and volumes, asked for on 10 November 2026
  fromForms('viii-space', 'Distanțe și unghiuri în spațiu (perpendicularitate)', 'Geometrie', {
    1: [G8.perpendicularPlane, G8.cubeDistances], 2: [G8.threePerpendiculars, G8.lateralEdgeAngle], 3: [G8.dihedralPyramid, G8.distanceToFace, G8.cubeToPlane],
  }),
  fromForms('viii-frustums', 'Trunchiuri, sfera, secțiuni paralele cu baza', 'Geometrie', {
    1: [G8.sphereFromRadius, G8.sectionArea], 2: [G8.frustumCone, G8.frustumPyramid, G8.sphereFromArea], 3: [G8.coneLiquid, G8.sphereInCylinder, G8.frustumFromCut],
  }),
  // after the recap tests for the national exam photographed by the user
  fromForms('viii-numbers', 'Puteri, divizibilitate, numere scrise cu cifre', 'Algebră', {
    1: [E.digitDivisible, F.powersLastDigit], 2: [E.powerSumThree, E.powerSumFour, E2.periodicDecimals], 3: [E.digitsDifferenceRoot, E.digitsSumRoot, E2.divisorSet],
  }),
  fromForms('viii-problems', 'Probleme (procente, părți din rest, sisteme)', 'Algebră', {
    1: [E.percentGroup, F.linearProblem], 2: [E.threeDays, E.averageProblem, E2.classSwap, E2.clothSystem], 3: [E.candies, E.journeyDifference, E2.tickets, E2.percentPossible],
  }),
  fromForms('viii-function', 'Funcția liniară', 'Algebră', {
    1: [E.pointOnGraph, E.valuesSum], 2: [E.axesTriangle, E.throughTwoPoints], 3: [E.circumRadius, E.distanceFromOrigin],
  }),
  fromForms('viii-radicals', 'Radicali: raționalizare, conjugată, medii', 'Algebră', {
    1: [E.rationalizeSimple, E.squareOfSum], 2: [E.telescoping, E.conjugateNatural], 3: [E.conjugateMeans, E.rationalEquality],
  }),
]

/** A kind of grade VIII made only of forms, at least two at each level. */
function fromForms(id: string, label: string, topic: Kind['topic'], forms: Record<1 | 2 | 3, Form[]>): Generator {
  return withForms(
    { id, grade: 8, topic, label, make: (rng, level) => forms[level as 1 | 2 | 3][0](rng) },
    { 1: forms[1].slice(1), 2: forms[2].slice(1), 3: forms[3].slice(1) },
  )
}

/**
 * A kind of the contest level only, as in the school competitions of each grade: at the other levels it has no forms,
 * so the page does not offer it there.
 */
function contest(id: string, grade: Grade, label: string, list: Form[]): Generator {
  return {
    id, grade, topic: 'Algebră', label,
    forms: (level) => (level === 4 ? list.length : 0),
    make(rng, _level, form) {
      const i = form ?? Math.floor(rng() * list.length)
      return list[((i % list.length) + list.length) % list.length](rng)
    },
  }
}

GENERATORS.push(
  contest('v-contest-numbers', 5, 'Sume, cifre, împărțirea cu rest', [C.arithmeticSum, C.bookPages, C.quotientIsRemainder, C2.factorialZeros, C2.digitsRemainder, C2.sequenceDouble]),
  contest('v-contest-reasoning', 5, 'Probleme de raționament', [C.legsDifference, C.agesThen, C.moneyBackwards]),
  contest('v-contest-olympiad', 5, 'Puteri, resturi, câturi', [C3.orderPowers, C3.factorialSumDigit, C3.sumRemainders, C3.quotientsSum, C3.largestRemainder]),
  contest('vi-contest-divisibility', 6, 'Divizibilitate, c.m.m.d.c., c.m.m.m.c.', [C.remainders, C.gcdProduct, C.countMultiples, C2.primesParity]),
  contest('vi-contest-fractions', 6, 'Fracții: sume, ireductibile, numere naturale', [C.telescopingFractions, C.irreducible, C.naturalFraction, C2.reducibleFraction, C2.squaresSumBound]),
  contest('vi-contest-olympiad', 6, 'Șiruri, proporții, probleme', [C3.proportionChain, C3.geometricCount, C3.periodicSequence, C3.horseshoes, C3.squareConsecutiveSum]),
  contest('vii-contest-reals', 7, 'Radicali: sume, comparații, radicali dubli', [C.rootTelescoping, C.compareRoots, C.nestedRoot, C2.threeDigitRoot]),
  contest('vii-contest-algebra', 7, 'Ecuații în numere întregi, minime, divizibilitate', [C.integerEquation, C.minimumSquares, C.sumProduct, C2.minMaxQuadratic, C2.linearDivisibility, C2.absoluteTriples]),
  contest('vii-contest-olympiad', 7, 'Resturi, ecuații în întregi, triunghiul din relații', [C3.squaresModulo, C3.equilateralFromRelations, C3.squareTimesAbs, C3.noIntegerSolutions]),
  contest('viii-contest-algebra', 8, 'Pătrate, identități, inegalități, radicali', [C.squaresZero, C.cubesFromSumProduct, C.productOfFour, C2.radicalsRational, C2.productInequality, C2.squaresWithCoefficients, C3.reciprocalPowers, C4.absEquationFraction, C4.minimumXplusK, C4.maxProduct, C4.absMinimum, C4.cubesSumZero, C4.productFourPlusOne]),
  contest('viii-contest-function', 8, 'Funcția liniară', [C4.composeLinear, C4.functionalLinear, C4.twoLinesTriangle, C4.collinearPoints]),
  contest('viii-contest-numbers', 8, 'Ecuații în numere întregi, pătrate perfecte, numere prime', [C.differenceOfSquares, C.squareQuadratic, C.primeSquare, C4.integerPartRoot, C4.symmetricSystem]),
)

export const LEVELS: Record<Level, string> = { 1: 'ușor', 2: 'mediu', 3: 'greu', 4: 'concurs' }
