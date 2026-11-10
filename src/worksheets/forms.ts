// More forms of each kind of exercise, so that a sheet of one kind is not the same exercise with other numbers.
// Each form takes a seeded random source and returns the statement and the worked solution in Romanian.
import type { Made } from './generators'
import { de, frac, gcd, int, nonZero, paren, pick, poly, reduce, rightTriangle, root, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]
/** a + b with the sign of b written out: "x - 3", "x + 3" */
const plus = (a: string, b: number) => (b === 0 ? a : `${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}`)
const dec = (x: number) => String(Math.round(x * 10000) / 10000).replace('.', '{,}')
const FLIP: Record<string, string> = { '<': '>', '\\le': '\\ge', '>': '<', '\\ge': '\\le' }
const interval = (rel: string, x0: number) => ({ '<': `(-\\infty, ${x0})`, '\\le': `(-\\infty, ${x0}]`, '>': `(${x0}, +\\infty)`, '\\ge': `[${x0}, +\\infty)` })[rel]!

// ================= grade V =================

export function opsParens(rng: Rng): Made {
  const [a, b, c] = [int(rng, 2, 20), int(rng, 2, 20), int(rng, 2, 9)]
  const d = int(rng, 1, (a + b) * c - 1)
  const r = (a + b) * c - d
  return {
    text: `Calculați: $(${a} + ${b}) \\cdot ${c} - ${d}$.`,
    solution: show(`(${a} + ${b}) \\cdot ${c} - ${d} = ${a + b} \\cdot ${c} - ${d} = ${(a + b) * c} - ${d} = ${r}`),
    verify: () => r >= 0,
  }
}

export function opsTwoProducts(rng: Rng): Made {
  const [a, b] = [int(rng, 3, 12), int(rng, 3, 12)]
  const [c, d] = [int(rng, 2, 9), int(rng, 2, Math.max(2, Math.floor((a * b) / 3)))]
  const e = int(rng, 1, 4)
  const r = a * b - c * e + d
  if (r < 0) return opsTwoProducts(rng)
  return {
    text: `Calculați: $${a} \\cdot ${b} - ${c} \\cdot ${e} + ${d}$.`,
    solution: show(`${a} \\cdot ${b} - ${c} \\cdot ${e} + ${d} = ${a * b} - ${c * e} + ${d} = ${r}`),
    verify: () => r === a * b - c * e + d,
  }
}

export function opsSquare(rng: Rng): Made {
  const a = int(rng, 2, 12)
  const c = int(rng, 2, 9)
  const d = int(rng, 1, c - 1 || 1)
  const b = int(rng, 2, 9)
  const r = a * a + b * (c - d)
  return {
    text: `Calculați: $${a}^2 + ${b} \\cdot (${c} - ${d})$.`,
    solution: show(`${a}^2 + ${b} \\cdot (${c} - ${d}) = ${a * a} + ${b} \\cdot ${c - d} = ${a * a} + ${b * (c - d)} = ${r}`),
    verify: () => c > d,
  }
}

export function opsBraces(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = [int(rng, 2, 9), int(rng, 2, 9), int(rng, 1, 5)]
    const inner = a * b - c
    const e = int(rng, 2, 5)
    const f = int(rng, 1, 30)
    const total = 2 * inner + f
    if (total % e !== 0 || inner <= 0) continue
    const r = total / e
    return {
      text: `Calculați: $\\{2 \\cdot [${a} \\cdot ${b} - ${c}] + ${f}\\} : ${e}$.`,
      solution: lines('Întâi paranteza dreaptă, apoi acolada, la final împărțirea:', show(`\\{2 \\cdot ${inner} + ${f}\\} : ${e} = \\{${2 * inner} + ${f}\\} : ${e} = ${total} : ${e} = ${r}`)),
      verify: () => total === e * r,
    }
  }
}

export function powersCompare(rng: Rng): Made {
  for (;;) {
    const [a, m, b, n] = [int(rng, 2, 5), int(rng, 2, 6), int(rng, 2, 5), int(rng, 2, 6)]
    const [A, B] = [a ** m, b ** n]
    if (A === B || a === b) continue
    const rel = A < B ? '<' : '>'
    return {
      text: `Comparați numerele $${a}^${m}$ și $${b}^${n}$.`,
      solution: show(`${a}^${m} = ${A}, \\quad ${b}^${n} = ${B} \\Rightarrow ${a}^${m} ${rel} ${b}^${n}`),
      verify: () => true,
    }
  }
}

export function powersSameBase(rng: Rng): Made {
  const k = int(rng, 2, 6)
  const m = int(rng, 1, 4)
  const exp = 3 * k + 2 * m
  return {
    text: `Scrieți ca o putere cu baza 2: $8^{${k}} \\cdot 4^{${m}}$.`,
    solution: lines('Scriem $8 = 2^3$ și $4 = 2^2$:', show(`8^{${k}} \\cdot 4^{${m}} = (2^3)^{${k}} \\cdot (2^2)^{${m}} = 2^{${3 * k}} \\cdot 2^{${2 * m}} = 2^{${exp}}`)),
    verify: () => 8 ** k * 4 ** m === 2 ** exp,
  }
}

export function powersLastDigit(rng: Rng): Made {
  const base = pick(rng, [2, 3, 7, 8])
  const n = int(rng, 20, 2026)
  const cycle = [1, 2, 3, 4].map((e) => base ** e % 10)
  const digit = cycle[(n - 1) % 4]
  return {
    text: `Aflați ultima cifră a numărului $${base}^{${n}}$.`,
    solution: lines(
      `Ultimele cifre ale puterilor lui ${base} se repetă din 4 în 4: ${cycle.join(', ')}, ${cycle.join(', ')}, …`,
      show(`${n} = 4 \\cdot ${Math.floor((n - 1) / 4)} + ${((n - 1) % 4) + 1} \\Rightarrow U(${base}^{${n}}) = U(${base}^{${((n - 1) % 4) + 1}}) = ${digit}`),
    ),
    verify: () => digit === Number(BigInt(base) ** BigInt(n) % 10n),
  }
}

export function fractionSimplify(rng: Rng): Made {
  for (;;) {
    const [p, q] = [int(rng, 1, 9), int(rng, 2, 12)]
    if (gcd(p, q) !== 1 || p === q) continue
    const k = int(rng, 2, 9)
    return {
      text: `Simplificați fracția $\\frac{${p * k}}{${q * k}}$ până la o fracție ireductibilă.`,
      solution: show(`\\frac{${p * k}}{${q * k}} = \\frac{${p * k} : ${k}}{${q * k} : ${k}} = \\frac{${p}}{${q}}`),
      verify: () => gcd(p, q) === 1,
    }
  }
}

export function fractionCompare(rng: Rng): Made {
  for (;;) {
    const [a, m, b, n] = [int(rng, 1, 11), int(rng, 2, 12), int(rng, 1, 11), int(rng, 2, 12)]
    if (a * n === b * m || m === n) continue
    const L = lcm(m, n)
    const rel = a * n < b * m ? '<' : '>'
    return {
      text: `Comparați fracțiile $\\frac{${a}}{${m}}$ și $\\frac{${b}}{${n}}$.`,
      solution: lines(`Le aducem la numitorul comun ${L}:`, show(`\\frac{${a}}{${m}} = \\frac{${a * (L / m)}}{${L}}, \\quad \\frac{${b}}{${n}} = \\frac{${b * (L / n)}}{${L}} \\Rightarrow \\frac{${a}}{${m}} ${rel} \\frac{${b}}{${n}}`)),
      verify: () => true,
    }
  }
}

export function fractionProblem(rng: Rng): Made {
  const [p, q] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 6], [5, 6], [3, 8]])
  const N = q * int(rng, 8, 40)
  const read = (N * p) / q
  return {
    text: `O carte are ${de(N)} pagini. Ana a citit $\\frac{${p}}{${q}}$ din carte. Câte pagini mai are de citit?`,
    solution: lines(show(`\\frac{${p}}{${q}} \\text{ din } ${N} = ${N} : ${q} \\cdot ${p} = ${read} \\text{ pagini citite}`), show(`${N} - ${read} = ${N - read} \\text{ pagini}`)),
    verify: () => Number.isInteger(read),
  }
}

export function decimalsSubtract(rng: Rng): Made {
  const a = int(rng, 500, 9999) / 100
  const b = int(rng, 10, Math.floor(a * 100) - 1) / 100
  const r = Math.round((a - b) * 100) / 100
  return { text: `Calculați: $${dec(a)} - ${dec(b)}$.`, solution: show(`${dec(a)} - ${dec(b)} = ${dec(r)}`), verify: () => r > 0 }
}

export function decimalsDivide(rng: Rng): Made {
  const q = int(rng, 11, 999) / 10
  const d = int(rng, 2, 9)
  const a = Math.round(q * d * 10) / 10
  return {
    text: `Calculați: $${dec(a)} : ${d}$.`,
    solution: show(`${dec(a)} : ${d} = ${dec(q)}`),
    verify: () => Math.abs(q * d - a) < 1e-9,
  }
}

export function decimalsProblem(rng: Rng): Made {
  const price = int(rng, 15, 99) / 10
  const n = int(rng, 2, 6)
  const paid = Math.ceil(price * n / 10) * 10
  const rest = Math.round((paid - price * n) * 100) / 100
  return {
    text: `Un caiet costă ${dec(price).replace('{,}', ',')} lei. Mihai cumpără ${n} caiete și plătește cu ${de(paid)} lei. Ce rest primește?`,
    solution: show(`${n} \\cdot ${dec(price)} = ${dec(Math.round(price * n * 100) / 100)} \\text{ lei}, \\quad ${paid} - ${dec(Math.round(price * n * 100) / 100)} = ${dec(rest)} \\text{ lei}`),
    verify: () => rest >= 0,
  }
}

export function squarePerimeterToArea(rng: Rng): Made {
  const a = int(rng, 2, 80)
  return {
    text: `Un pătrat are perimetrul de ${4 * a} cm. Calculați aria pătratului.`,
    solution: show(`\\ell = ${4 * a} : 4 = ${a}\\text{ cm}, \\quad \\mathcal{A} = \\ell^2 = ${a * a}\\text{ cm}^2`),
    verify: () => true,
  }
}

export function rectangleArea(rng: Rng): Made {
  const [L, l] = [int(rng, 5, 30), int(rng, 2, 12)]
  return {
    text: `O grădină în formă de dreptunghi are lungimea de ${L} m și lățimea de ${l} m. Calculați aria grădinii și lungimea gardului care o înconjoară.`,
    solution: show(`\\mathcal{A} = ${L} \\cdot ${l} = ${L * l}\\text{ m}^2, \\quad P = 2 \\cdot (${L} + ${l}) = ${2 * (L + l)}\\text{ m}`),
    verify: () => true,
  }
}

export function samePerimeter(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 2, 15)
    const L = l + 2 * int(rng, 1, 8)
    const P = 2 * (L + l)
    const s = P / 4
    if (!Number.isInteger(s)) continue
    return {
      text: `Un dreptunghi cu lungimea de ${L} cm și lățimea de ${l} cm are același perimetru ca un pătrat. Calculați latura și aria pătratului.`,
      solution: show(`P = 2 \\cdot (${L} + ${l}) = ${P}\\text{ cm}, \\quad \\ell = ${P} : 4 = ${s}\\text{ cm}, \\quad \\mathcal{A} = ${s * s}\\text{ cm}^2`),
      verify: () => 4 * s === P,
    }
  }
}

// ================= grade VI =================

export function fractionOfNumber(rng: Rng): Made {
  const [p, q] = pick(rng, [[2, 3], [3, 4], [2, 5], [4, 5], [5, 6], [3, 7], [5, 8], [7, 9]])
  const N = q * int(rng, 2, 25)
  return {
    text: `Calculați $\\frac{${p}}{${q}}$ din ${N}.`,
    solution: show(`\\frac{${p}}{${q}} \\cdot ${N} = \\frac{${p} \\cdot ${N}}{${q}} = ${(p * N) / q}`),
    verify: () => (p * N) % q === 0,
  }
}

export function fractionSquare(rng: Rng): Made {
  const [a, b] = [int(rng, 1, 9), int(rng, 2, 9)]
  const [c, d] = [int(rng, 1, 9), int(rng, 2, 9)]
  return {
    text: `Calculați: $\\left(\\frac{${a}}{${b}}\\right)^2 \\cdot \\frac{${c}}{${d}}$.`,
    solution: show(`\\left(\\frac{${a}}{${b}}\\right)^2 \\cdot \\frac{${c}}{${d}} = \\frac{${a * a}}{${b * b}} \\cdot \\frac{${c}}{${d}} = ${frac(a * a * c, b * b * d)}`),
    verify: () => true,
  }
}

export function fractionMixed(rng: Rng): Made {
  const [a, b] = [int(rng, 1, 5), int(rng, 2, 6)]
  const [c, d] = [int(rng, 1, 5), int(rng, 2, 6)]
  const [e, f] = [int(rng, 1, 5), int(rng, 2, 6)]
  const [pn, pd] = reduce(a * d - c * b, b * d)
  if (pn <= 0) return fractionMixed(rng)
  return {
    text: `Calculați: $\\left(\\frac{${a}}{${b}} - \\frac{${c}}{${d}}\\right) : \\frac{${e}}{${f}}$.`,
    solution: show(`\\left(\\frac{${a * d}}{${b * d}} - \\frac{${c * b}}{${b * d}}\\right) : \\frac{${e}}{${f}} = ${frac(pn, pd)} \\cdot \\frac{${f}}{${e}} = ${frac(pn * f, pd * e)}`),
    verify: () => Math.abs((pn * f) / (pd * e) - (a / b - c / d) / (e / f)) < 1e-9,
  }
}

export function percentWhole(rng: Rng): Made {
  const p = pick(rng, [5, 10, 20, 25, 30, 40, 50, 60, 75])
  const N = (100 / gcd(p, 100)) * int(rng, 1, 20)
  const part = (p * N) / 100
  return {
    text: `${p}% dintr-un număr este ${part}. Aflați numărul.`,
    solution: show(`\\frac{${p}}{100} \\cdot x = ${part} \\Rightarrow x = ${part} \\cdot \\frac{100}{${p}} = ${N}`),
    verify: () => (p * N) / 100 === part,
  }
}

export function percentTwice(rng: Rng): Made {
  const [p, q] = [pick(rng, [10, 20, 25, 50]), pick(rng, [10, 20, 25, 50])]
  const P = 400 * int(rng, 1, 10)
  const after1 = P + (p * P) / 100
  const after2 = after1 - (q * after1) / 100
  return {
    text: `Prețul unui produs de ${P} lei crește cu ${p}%, apoi noul preț scade cu ${q}%. Cât costă produsul la final?`,
    solution: lines(show(`${P} + \\frac{${p}}{100} \\cdot ${P} = ${after1}\\text{ lei}`), show(`${after1} - \\frac{${q}}{100} \\cdot ${after1} = ${after2}\\text{ lei}`)),
    verify: () => Number.isInteger(after2),
  }
}

export function proportionInverse(rng: Rng): Made {
  // a number of days that divides evenly among the other number of workers
  let workers: number, days: number, options: number[]
  do {
    workers = int(rng, 2, 8)
    days = int(rng, 3, 12)
    options = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16].filter((w) => w !== workers && (workers * days) % w === 0)
  } while (!options.length)
  const total = workers * days
  const w2 = pick(rng, options)
  const d2 = total / w2
  return {
    text: `${workers} muncitori termină o lucrare în ${days} zile. În câte zile ar termina aceeași lucrare ${w2} muncitori, lucrând la fel de repede?`,
    solution: lines('Numărul de muncitori și numărul de zile sunt mărimi invers proporționale:', show(`${workers} \\cdot ${days} = ${w2} \\cdot x \\Rightarrow x = \\frac{${total}}{${w2}} = ${frac(total, w2)}\\text{ zile}`)),
    verify: () => Number.isInteger(d2) && w2 * d2 === total,
  }
}

export function proportionCross(rng: Rng): Made {
  const [a, b] = [int(rng, 2, 12), int(rng, 2, 12)]
  const k = int(rng, 1, 6)
  const x = b * k
  return {
    text: `Aflați numărul $x$ din proporția $\\frac{${a}}{x} = \\frac{${a * k}}{${b * k * k}}$.`,
    solution: show(`${a * k} \\cdot x = ${a} \\cdot ${b * k * k} \\Rightarrow x = \\frac{${a * b * k * k}}{${a * k}} = ${x}`),
    verify: () => a * b * k * k === a * k * x,
  }
}

export function proportionInverseSplit(rng: Rng): Made {
  const [p, q, r] = pick(rng, [[2, 3, 6], [1, 2, 3], [2, 4, 8], [3, 4, 6], [2, 3, 4]])
  // inversely proportional to p, q, r: directly to 1/p, 1/q, 1/r, so to L/p, L/q, L/r
  const L = lcm(lcm(p, q), r)
  const parts = [L / p, L / q, L / r]
  const s = parts[0] + parts[1] + parts[2]
  const k = int(rng, 2, 12)
  const N = s * k
  return {
    text: `Împărțiți numărul ${N} în părți invers proporționale cu numerele ${p}, ${q}, ${r}.`,
    solution: lines(
      show(`${p}a = ${q}b = ${r}c = t \\Rightarrow a = \\frac{t}{${p}},\\ b = \\frac{t}{${q}},\\ c = \\frac{t}{${r}}`),
      show(`\\frac{t}{${p}} + \\frac{t}{${q}} + \\frac{t}{${r}} = ${N} \\Rightarrow \\frac{${s}t}{${L}} = ${N} \\Rightarrow t = ${(N * L) / s}`),
      show(`a = ${parts[0] * k},\\ b = ${parts[1] * k},\\ c = ${parts[2] * k}`),
    ),
    verify: () => parts.reduce((t, x) => t + x * k, 0) === N,
  }
}

export function integersAbs(rng: Rng): Made {
  const [a, b, c] = [nonZero(rng, -15, 15), nonZero(rng, -15, 15), nonZero(rng, -15, 15)]
  const r = Math.abs(a) - Math.abs(b) + c
  return {
    text: `Calculați: $|${a}| - |${b}| + ${paren(c)}$.`,
    solution: show(`|${a}| - |${b}| + ${paren(c)} = ${Math.abs(a)} - ${Math.abs(b)} ${c < 0 ? '-' : '+'} ${Math.abs(c)} = ${r}`),
    verify: () => true,
  }
}

export function integersEquation(rng: Rng): Made {
  const x = nonZero(rng, -20, 20)
  const a = nonZero(rng, -15, 15)
  const k = nonZero(rng, -6, 6)
  const b = k * x + a
  return {
    text: `Aflați numărul întreg $x$ pentru care $${poly([[k, 'x'], [a, '']])} = ${b}$.`,
    solution: show(`${poly([[k, 'x']])} = ${b} - ${paren(a)} = ${b - a} \\Rightarrow x = ${b - a} : ${paren(k)} = ${x}`),
    verify: () => k * x + a === b,
  }
}

export function integersSigns(rng: Rng): Made {
  const n = int(rng, 10, 2026)
  const m = int(rng, 10, 2026)
  const a = nonZero(rng, -9, 9)
  const r = (-1) ** n + (-1) ** m * a
  return {
    text: `Calculați: $(-1)^{${n}} + (-1)^{${m}} \\cdot ${paren(a)}$.`,
    solution: lines('O putere a lui $-1$ este $1$ dacă exponentul e par și $-1$ dacă e impar:', show(`(-1)^{${n}} + (-1)^{${m}} \\cdot ${paren(a)} = ${(-1) ** n} + ${paren((-1) ** m)} \\cdot ${paren(a)} = ${r}`)),
    verify: () => true,
  }
}

export function anglesIsosceles(rng: Rng): Made {
  const top = 2 * int(rng, 10, 80)
  const base = (180 - top) / 2
  return {
    text: `Triunghiul $ABC$ este isoscel, cu $AB = AC$ și $\\angle A = ${top}^\\circ$. Aflați măsurile unghiurilor $B$ și $C$.`,
    solution: show(`\\angle B = \\angle C = \\frac{180^\\circ - ${top}^\\circ}{2} = ${base}^\\circ`),
    verify: () => Number.isInteger(base),
  }
}

export function anglesVertical(rng: Rng): Made {
  const a = int(rng, 20, 160)
  return {
    text: `Două drepte se intersectează și formează un unghi de $${a}^\\circ$. Aflați măsurile celorlalte trei unghiuri formate.`,
    solution: lines('Unghiurile opuse la vârf sunt egale, iar cele adiacente sunt suplementare:', show(`${a}^\\circ,\\ ${180 - a}^\\circ,\\ ${a}^\\circ,\\ ${180 - a}^\\circ`)),
    verify: () => true,
  }
}

export function anglesExterior(rng: Rng): Made {
  const A = int(rng, 20, 80)
  const B = int(rng, 20, 150 - A)
  return {
    text: `În triunghiul $ABC$, $\\angle A = ${A}^\\circ$ și $\\angle B = ${B}^\\circ$. Aflați măsura unghiului exterior din vârful $C$.`,
    solution: lines('Unghiul exterior este egal cu suma celor două unghiuri interioare neadiacente:', show(`${A}^\\circ + ${B}^\\circ = ${A + B}^\\circ`)),
    verify: () => A + B < 180,
  }
}

// ================= grade VII =================

export function radicalsProduct(rng: Rng): Made {
  const b = pick(rng, [2, 3, 5, 6])
  const [k1, k2] = [int(rng, 2, 5), int(rng, 2, 5)]
  return {
    text: `Calculați: $\\sqrt{${k1 * k1 * b}} \\cdot \\sqrt{${k2 * k2 * b}}$.`,
    solution: show(`\\sqrt{${k1 * k1 * b}} \\cdot \\sqrt{${k2 * k2 * b}} = ${k1}\\sqrt{${b}} \\cdot ${k2}\\sqrt{${b}} = ${k1 * k2} \\cdot ${b} = ${k1 * k2 * b}`),
    verify: () => true,
  }
}

export function radicalsRationalize(rng: Rng): Made {
  const b = pick(rng, [2, 3, 5, 6, 7])
  const k = int(rng, 1, 6) * b
  const [p, q] = reduce(k, b)
  return {
    text: `Raționalizați numitorul: $\\frac{${k}}{\\sqrt{${b}}}$.`,
    solution: show(`\\frac{${k}}{\\sqrt{${b}}} = \\frac{${k}\\sqrt{${b}}}{${b}} = ${q === 1 ? (p === 1 ? '' : p) + `\\sqrt{${b}}` : `\\frac{${p}\\sqrt{${b}}}{${q}}`}`),
    verify: () => true,
  }
}

export function radicalsCompare(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 2, 7), int(rng, 2, 7)]
    const [m, n] = [pick(rng, [2, 3, 5, 6, 7, 10, 11]), pick(rng, [2, 3, 5, 6, 7, 10, 11])]
    const [A, B] = [a * a * m, b * b * n]
    if (A === B || m === n) continue
    const rel = A < B ? '<' : '>'
    return {
      text: `Comparați numerele $a = ${a}\\sqrt{${m}}$ și $b = ${b}\\sqrt{${n}}$.`,
      solution: lines(
        'Introducem factorii sub radical și comparăm numerele de sub radical:',
        show(`a = \\sqrt{${a * a} \\cdot ${m}} = \\sqrt{${A}}, \\quad b = \\sqrt{${b * b} \\cdot ${n}} = \\sqrt{${B}}`),
        show(`${A} ${rel} ${B} \\Rightarrow a ${rel} b`),
      ),
      verify: () => (rel === '<') === (a * Math.sqrt(m) < b * Math.sqrt(n)),
    }
  }
}

export function linearFractionsSum(rng: Rng): Made {
  for (;;) {
    const [a, b] = [int(rng, 2, 6), int(rng, 2, 8)]
    if (a === b) continue
    const L = lcm(a, b)
    const x0 = L * nonZero(rng, -4, 4)
    const c = x0 / a + x0 / b
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $\\frac{x}{${a}} + \\frac{x}{${b}} = ${c}$.`,
      solution: lines(
        `Înmulțim cu ${L}:`,
        show(`${L / a === 1 ? '' : L / a}x + ${L / b === 1 ? '' : L / b}x = ${L * c} \\Rightarrow ${L / a + L / b}x = ${L * c} \\Rightarrow x = ${x0}, \\qquad S = \\{${x0}\\}`),
      ),
      verify: () => (L / a + L / b) * x0 === L * c,
    }
  }
}

export function linearProblem(rng: Rng): Made {
  const x = int(rng, 5, 40)
  const k = int(rng, 2, 4)
  const s = x + k * x
  return {
    text: `Suma a două numere este ${s}. Unul dintre numere este de ${k} ori mai mare decât celălalt. Aflați numerele.`,
    solution: show(`x + ${k}x = ${s} \\Rightarrow ${k + 1}x = ${s} \\Rightarrow x = ${x}, \\quad ${k}x = ${k * x}`),
    verify: () => (k + 1) * x === s,
  }
}

export function rectangleDiagonal(rng: Rng): Made {
  const [AB, BC, AC] = rightTriangle(rng, 100)
  return {
    text: `Dreptunghiul $ABCD$ are $AB = ${AB}$ cm și diagonala $AC = ${AC}$ cm. Calculați lungimea laturii $BC$, perimetrul și aria dreptunghiului.`,
    solution: lines(
      'În triunghiul $ABC$, dreptunghic în $B$, din teorema lui Pitagora:',
      show(`BC^2 = AC^2 - AB^2 = ${AC * AC} - ${AB * AB} = ${BC * BC} \\Rightarrow BC = ${BC}\\text{ cm}`),
      show(`P = 2(${AB} + ${BC}) = ${2 * (AB + BC)}\\text{ cm}, \\quad \\mathcal{A} = ${AB} \\cdot ${BC} = ${AB * BC}\\text{ cm}^2`),
    ),
    verify: () => AB * AB + BC * BC === AC * AC,
  }
}

export function equilateralHeight(rng: Rng): Made {
  const l = int(rng, 2, 60)
  return {
    text: `Un triunghi echilateral are latura de ${l} cm. Calculați înălțimea și aria triunghiului.`,
    solution: show(`h = \\frac{\\ell\\sqrt{3}}{2} = ${surd(l, 2, 3)}\\text{ cm}, \\quad \\mathcal{A} = \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(l * l, 4, 3)}\\text{ cm}^2`),
    verify: () => true,
  }
}

export function squareDiagonal(rng: Rng): Made {
  const l = int(rng, 2, 12)
  return {
    text: `Un pătrat are diagonala de $${l}\\sqrt{2}$ cm. Calculați latura, perimetrul și aria pătratului.`,
    solution: lines('Diagonala pătratului este $\\ell\\sqrt{2}$:', show(`\\ell = ${l}\\text{ cm}, \\quad P = ${4 * l}\\text{ cm}, \\quad \\mathcal{A} = ${l * l}\\text{ cm}^2`)),
    verify: () => true,
  }
}

export function parallelogram30(rng: Rng): Made {
  const a = int(rng, 4, 16)
  const b = 2 * int(rng, 2, 8)
  return {
    text: `Paralelogramul $ABCD$ are $AB = ${a}$ cm, $AD = ${b}$ cm și $\\angle A = 30^\\circ$. Calculați aria paralelogramului.`,
    solution: lines(
      'Ducem înălțimea $DE \\perp AB$. În triunghiul $ADE$, dreptunghic în $E$, cateta opusă unghiului de $30^\\circ$ este jumătate din ipotenuză:',
      show(`DE = \\frac{AD}{2} = ${b / 2}\\text{ cm}, \\quad \\mathcal{A} = AB \\cdot DE = ${a} \\cdot ${b / 2} = ${(a * b) / 2}\\text{ cm}^2`),
    ),
    verify: () => true,
  }
}

export function thalesFind(rng: Rng): Made {
  const t = int(rng, 2, 4)
  const AD = int(rng, 2, 8)
  const AB = AD * t
  const AE = int(rng, 2, 9)
  const AC = AE * t
  return {
    text: `În triunghiul $ABC$, $D \\in AB$ și $E \\in AC$, cu $AD = ${AD}$ cm, $AB = ${AB}$ cm, $AE = ${AE}$ cm și $AC = ${AC}$ cm. Arătați că $DE \\parallel BC$.`,
    solution: lines(show(`\\frac{AD}{AB} = \\frac{${AD}}{${AB}} = ${frac(1, t)}, \\quad \\frac{AE}{AC} = \\frac{${AE}}{${AC}} = ${frac(1, t)}`), 'Rapoartele sunt egale, deci, din reciproca teoremei lui Thales, $DE \\parallel BC$.'),
    verify: () => AD * AC === AE * AB,
  }
}

export function midline(rng: Rng): Made {
  const BC = 2 * int(rng, 2, 15)
  return {
    text: `În triunghiul $ABC$, $M$ este mijlocul lui $AB$ și $N$ este mijlocul lui $AC$. Știind că $BC = ${BC}$ cm, calculați lungimea segmentului $MN$.`,
    solution: lines('$MN$ este linie mijlocie în triunghiul $ABC$, deci este paralelă cu $BC$ și are jumătate din lungimea ei:', show(`MN = \\frac{BC}{2} = ${BC / 2}\\text{ cm}`)),
    verify: () => true,
  }
}

export function trigTangent(rng: Rng): Made {
  const [p, q, BC] = rightTriangle(rng, 100)
  const [AB, AC] = [q, p]
  const [tn, td] = reduce(p, q)
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${AB}$ cm și $\\operatorname{tg} B = ${frac(tn, td)}$. Calculați lungimile laturilor $AC$ și $BC$ și $\\cos C$.`,
    solution: lines(
      show(`\\operatorname{tg} B = \\frac{AC}{AB} \\Rightarrow AC = ${AB} \\cdot ${frac(tn, td)} = ${AC}\\text{ cm}`),
      show(`BC^2 = AB^2 + AC^2 = ${AB * AB} + ${AC * AC} = ${BC * BC} \\Rightarrow BC = ${BC}\\text{ cm}`),
      show(`\\cos C = \\frac{AC}{BC} = ${frac(AC, BC)}`),
    ),
    verify: () => AB * AB + AC * AC === BC * BC && AC * td === AB * tn,
  }
}

export function trig45(rng: Rng): Made {
  const l = int(rng, 2, 40)
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $\\angle B = 45^\\circ$ și $AB = ${l}$ cm. Calculați lungimile laturilor $AC$ și $BC$.`,
    solution: lines('Triunghiul are două unghiuri de $45^\\circ$, deci este dreptunghic isoscel:', show(`AC = AB = ${l}\\text{ cm}, \\quad BC = AB\\sqrt{2} = ${l}\\sqrt{2}\\text{ cm}`)),
    verify: () => true,
  }
}

// ================= grade VIII =================

/** a(x − b) + c ? dx: parentheses first. */
export function inequalityParens(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6)
    const d = nonZero(rng, -4, 6)
    if (a === d) continue
    const b = nonZero(rng, -6, 6)
    const x0 = int(rng, -8, 8)
    const c = (d - a) * x0 + a * b
    const rel = pick(rng, ['<', '\\le', '>', '\\ge'] as const)
    const k = a - d
    const fin = k < 0 ? FLIP[rel] : rel
    return {
      text: `Rezolvați în $\\mathbb{R}$ inecuația $${a}(${plus('x', -b)}) ${c < 0 ? '-' : '+'} ${Math.abs(c)} ${rel} ${poly([[d, 'x']])}$.`,
      solution: lines(
        show(`${poly([[a, 'x'], [-a * b, '']])} ${c < 0 ? '-' : '+'} ${Math.abs(c)} ${rel} ${poly([[d, 'x']])} \\Rightarrow ${poly([[k, 'x']])} ${rel} ${a * b - c}`),
        k < 0 ? `Împărțim la ${k}, număr negativ, deci sensul inegalității se schimbă:` : `Împărțim la ${k}:`,
        show(`x ${fin} ${x0} \\Rightarrow S = ${interval(fin, x0)}`),
      ),
      verify: () => k * x0 === a * b - c,
    }
  }
}

/** The greatest (or least) whole number for which (x − a)/b + (x + c)/d < e (or > e). */
export function inequalityExtreme(rng: Rng): Made {
  for (;;) {
    const [b, d] = [int(rng, 2, 4), int(rng, 2, 5)]
    if (b === d) continue
    const [a, c] = [nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
    const e = int(rng, -4, 6)
    const L = lcm(b, d)
    const k = L / b + L / d
    const rhs = L * e + (L / b) * a - (L / d) * c
    const greatest = rng() < 0.5
    const x = greatest ? Math.ceil(rhs / k) - 1 : Math.floor(rhs / k) + 1
    return {
      text: `Determinați cel mai ${greatest ? 'mare' : 'mic'} număr întreg $x$ pentru care $\\frac{${plus('x', -a)}}{${b}} + \\frac{${plus('x', c)}}{${d}} ${greatest ? '<' : '>'} ${e}$.`,
      solution: lines(
        `Înmulțim cu ${L}, numitorul comun:`,
        show(`${L / b === 1 ? '' : L / b}(${plus('x', -a)}) + ${L / d === 1 ? '' : L / d}(${plus('x', c)}) ${greatest ? '<' : '>'} ${L * e} \\Rightarrow ${k}x ${greatest ? '<' : '>'} ${rhs} \\Rightarrow x ${greatest ? '<' : '>'} ${frac(rhs, k)}`),
        `Cel mai ${greatest ? 'mare' : 'mic'} număr întreg cu această proprietate este $x = ${x}$.`,
      ),
      verify: () => (greatest ? k * x < rhs && k * (x + 1) >= rhs : k * x > rhs && k * (x - 1) <= rhs),
    }
  }
}

/** y given by the first equation: substitution. */
export function systemSubstitution(rng: Rng): Made {
  for (;;) {
    const [x0, y0] = [int(rng, -6, 6), int(rng, -6, 6)]
    const m = nonZero(rng, -4, 4)
    const n = y0 - m * x0
    const [a, b] = [nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    if (a + b * m === 0) continue
    const c = a * x0 + b * y0
    return {
      text: `Rezolvați sistemul de ecuații: $\\begin{cases} y = ${poly([[m, 'x'], [n, '']])} \\\\ ${poly([[a, 'x'], [b, 'y']])} = ${c} \\end{cases}$`,
      solution: lines(
        'Prin metoda substituției: înlocuim $y$ din prima ecuație în a doua:',
        show(`${poly([[a, 'x']])} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(${poly([[m, 'x'], [n, '']])}) = ${c} \\Rightarrow ${poly([[a + b * m, 'x']])} = ${c - b * n} \\Rightarrow x = ${x0}`),
        show(`y = ${paren(m)} \\cdot ${paren(x0)} ${n < 0 ? '-' : '+'} ${Math.abs(n)} = ${y0}, \\qquad S = \\{(${x0}, ${y0})\\}`),
      ),
      verify: () => (a + b * m) * x0 === c - b * n && m * x0 + n === y0,
    }
  }
}

/** With parentheses in the first equation. */
export function systemParens(rng: Rng): Made {
  for (;;) {
    const [x0, y0] = [int(rng, -5, 5), int(rng, -5, 5)]
    const [p, q, r, s] = [int(rng, 2, 4), int(rng, 2, 4), nonZero(rng, -5, 5), nonZero(rng, -5, 5)]
    const [u, v] = [nonZero(rng, -4, 4), nonZero(rng, -4, 4)]
    if (p * v - u * q === 0) continue
    const c1 = p * (x0 + r) + q * (y0 - s)
    const c2 = u * x0 + v * y0
    return {
      text: `Rezolvați sistemul de ecuații: $\\begin{cases} ${p}(${plus('x', r)}) + ${q}(${plus('y', -s)}) = ${c1} \\\\ ${poly([[u, 'x'], [v, 'y']])} = ${c2} \\end{cases}$`,
      solution: lines(
        'Desfacem parantezele în prima ecuație:',
        show(`\\begin{cases} ${poly([[p, 'x'], [q, 'y']])} = ${c1 - p * r + q * s} \\\\ ${poly([[u, 'x'], [v, 'y']])} = ${c2} \\end{cases}`),
        'Prin metoda reducerii obținem:',
        show(`x = ${x0}, \\quad y = ${y0}, \\qquad S = \\{(${x0}, ${y0})\\}`),
      ),
      verify: () => p * x0 + q * y0 === c1 - p * r + q * s && u * x0 + v * y0 === c2,
    }
  }
}

/** A problem with two unknowns. */
export function systemProblem(rng: Rng): Made {
  const [x, y] = [int(rng, 3, 20), int(rng, 3, 20)]
  const p = int(rng, 3, 9)
  const q = int(rng, 2, p - 1)
  return {
    text: `La un magazin, ${de(x + y)} caiete și pixuri costă împreună ${de(p * x + q * y)} lei. Un caiet costă ${p} lei, iar un pix ${q} lei. Câte caiete și câte pixuri s-au cumpărat?`,
    solution: lines(
      show(`\\begin{cases} c + p = ${x + y} \\\\ ${p}c + ${q}p = ${p * x + q * y} \\end{cases}`),
      'Din prima ecuație $p = ' + (x + y) + ' - c$; înlocuim în a doua:',
      show(`${p}c + ${q}(${x + y} - c) = ${p * x + q * y} \\Rightarrow ${p - q === 1 ? '' : p - q === -1 ? '-' : p - q}c = ${p * x + q * y - q * (x + y)} \\Rightarrow c = ${x}, \\quad p = ${y}`),
    ),
    verify: () => p !== q,
  }
}

/** Grouping: xy + bx + ay + ab = (x + a)(y + b). */
export function factoringGrouping(rng: Rng): Made {
  const [a, b] = [nonZero(rng, -7, 7), nonZero(rng, -7, 7)]
  return {
    text: `Descompuneți în factori: $${poly([[1, 'xy'], [b, 'x'], [a, 'y'], [a * b, '']])}$.`,
    solution: lines('Grupăm termenii câte doi și dăm factor comun:', show(`x(${plus('y', b)}) ${a < 0 ? '-' : '+'} ${Math.abs(a)}(${plus('y', b)}) = (${plus('x', a)})(${plus('y', b)})`)),
    verify: () => true,
  }
}

/** x² − a² = k(x − a): a common factor x − a, not divided away. */
export function quadraticCommon(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -7, 7)
    const k = nonZero(rng, -9, 9)
    const other = k - a
    if (other === a) continue
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $x^2 - ${a * a} = ${k === 1 ? '' : k === -1 ? '-' : k}(${plus('x', -a)})$.`,
      solution: lines(
        `Descompunem membrul stâng și aducem totul într-un membru; nu împărțim la $${plus('x', -a)}$, care poate fi zero:`,
        show(`(${plus('x', -a)})(${plus('x', a)}) - ${paren(k)}(${plus('x', -a)}) = 0 \\Rightarrow (${plus('x', -a)})(${plus('x', a - k)}) = 0`),
        show(`x = ${a} \\text{ sau } x = ${other}, \\qquad S = \\{${[a, other].sort((u, v) => u - v).join(', ')}\\}`),
      ),
      verify: () => [a, other].every((x) => x * x - a * a === k * (x - a)),
    }
  }
}

/** (x − a)² = b²: two roots. */
export function quadraticSquare(rng: Rng): Made {
  const a = nonZero(rng, -8, 8)
  const b = int(rng, 1, 9)
  const [r1, r2] = [a - b, a + b]
  return {
    text: `Rezolvați în $\\mathbb{R}$ ecuația $(${plus('x', -a)})^2 = ${b * b}$.`,
    solution: show(`${plus('x', -a)} = \\pm ${b} \\Rightarrow x = ${r1} \\text{ sau } x = ${r2}, \\qquad S = \\{${r1}, ${r2}\\}`),
    verify: () => (r1 - a) ** 2 === b * b && (r2 - a) ** 2 === b * b,
  }
}

/** E(x) = (x − a)(x + a) − x(x − b). */
export function expressionProduct(rng: Rng): Made {
  const a = int(rng, 1, 7)
  const b = nonZero(rng, -8, 8)
  return {
    text: `Aduceți la forma cea mai simplă expresia $E(x) = (x - ${a})(x + ${a}) - x(${plus('x', -b)})$, unde $x$ este un număr real.`,
    solution: show(`E(x) = x^2 - ${a * a} - x^2 ${-b < 0 ? '-' : '+'} ${Math.abs(b)}x = ${poly([[b, 'x'], [-a * a, '']])}`),
    verify: () => [0, 2, -3].every((x) => (x - a) * (x + a) - x * (x - b) === b * x - a * a),
  }
}

/** N = (n + a)² − (n − b)² = (a + b)(2n + a − b) is divisible by a + b (by 4a when a = b). */
export function expressionDivisible(rng: Rng): Made {
  const a = int(rng, 1, 12)
  const b = rng() < 0.3 ? a : int(rng, 1, 12)
  const d = a === b ? 4 * a : a + b
  const second = poly([[2, 'n'], [a - b, '']])
  return {
    text: `Arătați că numărul $N = (n + ${a})^2 - (n - ${b})^2$ este divizibil cu ${d}, pentru orice număr natural $n${a === b ? '' : ` \\geq ${b}`}$.`,
    solution: lines(
      'Folosim diferența de pătrate, $x^2 - y^2 = (x - y)(x + y)$:',
      show(`N = [(n + ${a}) - (n - ${b})] \\cdot [(n + ${a}) + (n - ${b})] = ${a + b}(${second})${a === b ? ` = ${4 * a}n` : ''}`),
      `deci $N$ este divizibil cu ${d}, oricare ar fi $n$ natural.`,
    ),
    verify: () => [0, 1, 7, 20].every((n) => ((n + a) ** 2 - (n - b) ** 2) % d === 0),
  }
}

/** E(x) = x² + 2ax + c: its least value, from the square of a binomial. */
export function expressionMinimum(rng: Rng): Made {
  const a = nonZero(rng, -6, 6)
  // never 0: then E(x) would be the square itself, with nothing to show
  const m = nonZero(rng, -10, 10)
  const c = a * a + m
  return {
    text: `Se consideră expresia $E(x) = ${poly([[1, 'x^2'], [2 * a, 'x'], [c, '']])}$. Arătați că $E(x) \\ge ${m}$, pentru orice număr real $x$.`,
    solution: lines(show(`E(x) = ${poly([[1, 'x^2'], [2 * a, 'x'], [a * a, '']])} ${m < 0 ? '-' : '+'} ${Math.abs(m)} = (${plus('x', a)})^2 ${m < 0 ? '-' : '+'} ${Math.abs(m)}`), `Pătratul unui număr real este cel puțin $0$, deci $E(x) \\ge ${m}$.`),
    verify: () => true,
  }
}

export function cuboidEasy(rng: Rng): Made {
  const [L, l, h] = [int(rng, 3, 15), int(rng, 2, 10), int(rng, 2, 12)]
  return {
    text: `Un paralelipiped dreptunghic are dimensiunile de ${L} cm, ${l} cm și ${h} cm. Calculați aria totală și volumul.`,
    solution: lines(show(`\\mathcal{A}_t = 2(L\\ell + Lh + \\ell h) = 2(${L * l} + ${L * h} + ${l * h}) = ${2 * (L * l + L * h + l * h)}\\text{ cm}^2`), show(`V = L \\cdot \\ell \\cdot h = ${L * l * h}\\text{ cm}^3`)),
    verify: () => true,
  }
}

export function cubeFromVolume(rng: Rng): Made {
  const l = int(rng, 2, 12)
  return {
    text: `Un cub are volumul de ${l ** 3} cm³. Calculați muchia și aria totală a cubului.`,
    solution: lines(show(`\\ell^3 = ${l ** 3} \\Rightarrow \\ell = ${l}\\text{ cm}`), show(`\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${l * l} = ${6 * l * l}\\text{ cm}^2`)),
    verify: () => true,
  }
}

export function prismTriangle(rng: Rng): Made {
  const l = 2 * int(rng, 1, 8)
  const h = int(rng, 3, 15)
  const v = l * l * h
  return {
    text: `O prismă triunghiulară regulată are latura bazei de ${l} cm și înălțimea de ${h} cm. Calculați aria laterală și volumul prismei.`,
    solution: lines(
      show(`\\mathcal{A}_\\ell = P_b \\cdot h = ${3 * l} \\cdot ${h} = ${3 * l * h}\\text{ cm}^2`),
      'Baza este un triunghi echilateral, cu aria $\\frac{\\ell^2\\sqrt{3}}{4}$:',
      show(`V = \\mathcal{A}_b \\cdot h = \\frac{${l * l}\\sqrt{3}}{4} \\cdot ${h} = ${v % 4 === 0 ? `${v / 4 === 1 ? '' : v / 4}\\sqrt{3}` : `\\frac{${v}\\sqrt{3}}{4}`}\\text{ cm}^3`),
    ),
    verify: () => true,
  }
}

export function cylinder(rng: Rng): Made {
  const r = int(rng, 2, 9)
  const g = int(rng, 3, 15)
  return {
    text: `Un cilindru circular drept are raza bazei de ${r} cm și generatoarea de ${g} cm. Calculați aria laterală și volumul cilindrului.`,
    solution: lines(show(`\\mathcal{A}_\\ell = 2\\pi R G = 2\\pi \\cdot ${r} \\cdot ${g} = ${2 * r * g}\\pi\\text{ cm}^2`), show(`V = \\pi R^2 G = \\pi \\cdot ${r * r} \\cdot ${g} = ${r * r * g}\\pi\\text{ cm}^3`)),
    verify: () => true,
  }
}

export function cone(rng: Rng): Made {
  const [p, q, r] = pick(rng, TRIPLES.slice(0, 4))
  const k = pick(rng, [1, 2])
  const [R, h, G] = [p * k, q * k, r * k]
  return {
    text: `Un con circular drept are raza bazei de ${R} cm și înălțimea de ${h} cm. Calculați generatoarea, aria laterală și volumul conului.`,
    solution: lines(
      show(`G^2 = R^2 + h^2 = ${R * R} + ${h * h} = ${G * G} \\Rightarrow G = ${G}\\text{ cm}`),
      show(`\\mathcal{A}_\\ell = \\pi R G = ${R * G}\\pi\\text{ cm}^2, \\quad V = \\frac{\\pi R^2 h}{3} = ${frac(R * R * h, 3)}\\pi\\text{ cm}^3`),
    ),
    verify: () => R * R + h * h === G * G,
  }
}

/** A cube given by its diagonal, in three parts. */
export function cubeHard(rng: Rng): Made {
  const l = int(rng, 2, 10)
  return {
    text: lines(
      `Cubul $ABCDA'B'C'D'$ are diagonala $AC' = ${l}\\sqrt{3}$ cm.`,
      'a) Calculați muchia cubului.',
      'b) Calculați aria totală și volumul cubului.',
      "c) Calculați sinusul unghiului dintre dreapta $AC'$ și planul $(ABC)$.",
    ),
    solution: lines(
      `a) Diagonala cubului este $\\ell\\sqrt{3}$, deci $\\ell = ${l}$ cm.`,
      show(`\\text{b) } \\mathcal{A}_t = 6\\ell^2 = ${6 * l * l}\\text{ cm}^2, \\quad V = \\ell^3 = ${l ** 3}\\text{ cm}^3`),
      "c) Proiecția lui $AC'$ pe planul bazei este $AC$, deci unghiul cerut este $\\angle C'AC$, iar $CC' \\perp (ABC)$:",
      show(`\\sin \\angle C'AC = \\frac{CC'}{AC'} = \\frac{${l}}{${l}\\sqrt{3}} = \\frac{\\sqrt{3}}{3}`),
    ),
    verify: () => true,
  }
}

/** A cuboid in three parts: the diagonal, area and volume, the angle of the diagonal with the base. */
export function cuboidHard(rng: Rng): Made {
  const [p, q, r] = pick(rng, TRIPLES.slice(0, 4))
  const k = pick(rng, [1, 2])
  const [AB, BC, AC] = [p * k, q * k, r * k]
  const h = int(rng, 2, 12)
  const d2 = AC * AC + h * h
  const [tn, td] = reduce(h, AC)
  return {
    text: lines(
      `Paralelipipedul dreptunghic $ABCDA'B'C'D'$ are $AB = ${AB}$ cm, $BC = ${BC}$ cm și $AA' = ${h}$ cm.`,
      "a) Calculați lungimea diagonalei $AC'$.",
      'b) Calculați aria totală și volumul paralelipipedului.',
      "c) Calculați tangenta unghiului dintre dreapta $AC'$ și planul $(ABC)$.",
    ),
    solution: lines(
      `a) În triunghiul $ABC$: $AC^2 = ${AB * AB} + ${BC * BC} = ${AC * AC}$, deci $AC = ${AC}$ cm. În triunghiul $ACC'$:`,
      show(`AC'^2 = AC^2 + CC'^2 = ${AC * AC} + ${h * h} = ${d2} \\Rightarrow AC' = ${root(d2)}\\text{ cm}`),
      show(`\\text{b) } \\mathcal{A}_t = 2(${AB * BC} + ${AB * h} + ${BC * h}) = ${2 * (AB * BC + AB * h + BC * h)}\\text{ cm}^2, \\quad V = ${AB} \\cdot ${BC} \\cdot ${h} = ${AB * BC * h}\\text{ cm}^3`),
      "c) Unghiul cerut este $\\angle C'AC$:",
      show(`\\operatorname{tg} \\angle C'AC = \\frac{CC'}{AC} = ${frac(tn, td)}`),
    ),
    verify: () => AB * AB + BC * BC === AC * AC,
  }
}

/** A cylinder and a cone in three parts: the axial section, the area, the volume. */
export function coneHard(rng: Rng): Made {
  const [p, q, r] = pick(rng, TRIPLES.slice(0, 4))
  const k = pick(rng, [1, 2])
  const [R, h, G] = [p * k, q * k, r * k]
  return {
    text: lines(
      `Un con circular drept are generatoarea de ${G} cm și raza bazei de ${R} cm.`,
      'a) Calculați înălțimea conului.',
      'b) Calculați aria totală și volumul conului.',
      'c) Calculați aria secțiunii axiale a conului.',
    ),
    solution: lines(
      show(`\\text{a) } h^2 = G^2 - R^2 = ${G * G} - ${R * R} = ${h * h} \\Rightarrow h = ${h}\\text{ cm}`),
      show(`\\text{b) } \\mathcal{A}_t = \\pi R(G + R) = \\pi \\cdot ${R} \\cdot ${G + R} = ${R * (G + R)}\\pi\\text{ cm}^2, \\quad V = \\frac{\\pi R^2 h}{3} = ${frac(R * R * h, 3)}\\pi\\text{ cm}^3`),
      'c) Secțiunea axială este un triunghi isoscel cu baza $2R$ și înălțimea $h$:',
      show(`\\mathcal{A} = \\frac{2R \\cdot h}{2} = R \\cdot h = ${R * h}\\text{ cm}^2`),
    ),
    verify: () => R * R + h * h === G * G,
  }
}

/** An isosceles triangle from its equal sides and its base: the height from Pythagoras, then the area. */
export function isoscelesHeight(rng: Rng): Made {
  const [half, h, l] = rightTriangle(rng, 100)
  return {
    text: `Triunghiul isoscel $ABC$ are $AB = AC = ${l}$ cm și $BC = ${2 * half}$ cm. Calculați înălțimea $AD$ și aria triunghiului.`,
    solution: lines(
      'Înălțimea din vârful unui triunghi isoscel este și mediană, deci $BD = \\frac{BC}{2} = ' + half + '$ cm. În triunghiul $ABD$:',
      show(`AD^2 = AB^2 - BD^2 = ${l * l} - ${half * half} = ${h * h} \\Rightarrow AD = ${h}\\text{ cm}`),
      show(`\\mathcal{A} = \\frac{BC \\cdot AD}{2} = \\frac{${2 * half} \\cdot ${h}}{2} = ${half * h}\\text{ cm}^2`),
    ),
    verify: () => half * half + h * h === l * l,
  }
}

/** A rhombus from its side and one diagonal: the other diagonal, then the area. */
export function rhombusFromSide(rng: Rng): Made {
  const [p, q, r] = pick(rng, TRIPLES.slice(0, 4))
  const k = pick(rng, [1, 2])
  const [a, b] = rng() < 0.5 ? [p * k, q * k] : [q * k, p * k]
  const l = r * k
  return {
    text: `Rombul $ABCD$ are latura de ${l} cm și diagonala $AC = ${2 * a}$ cm. Calculați lungimea diagonalei $BD$ și aria rombului.`,
    solution: lines(
      'Diagonalele rombului sunt perpendiculare și se înjumătățesc în $O$. În triunghiul $AOB$, dreptunghic în $O$:',
      show(`BO^2 = AB^2 - AO^2 = ${l * l} - ${a * a} = ${b * b} \\Rightarrow BO = ${b}\\text{ cm}, \\quad BD = ${2 * b}\\text{ cm}`),
      show(`\\mathcal{A} = \\frac{AC \\cdot BD}{2} = \\frac{${2 * a} \\cdot ${2 * b}}{2} = ${2 * a * b}\\text{ cm}^2`),
    ),
    verify: () => a * a + b * b === l * l,
  }
}

/** Similar triangles: the ratio of their areas is the square of the ratio of similarity. */
export function similarArea(rng: Rng): Made {
  const t = int(rng, 2, 4)
  const AD = int(rng, 2, 9)
  const AB = AD * t
  const small = int(rng, 2, 20)
  const big = small * t * t
  return {
    text: `În triunghiul $ABC$, $D \\in AB$ și $E \\in AC$, cu $DE \\parallel BC$, $AD = ${AD}$ cm și $AB = ${AB}$ cm. Știind că aria triunghiului $ADE$ este de ${small} cm², calculați aria triunghiului $ABC$.`,
    solution: lines(
      `Din teorema fundamentală a asemănării, $\\triangle ADE \\sim \\triangle ABC$, cu raportul $k = \\frac{AD}{AB} = ${frac(AD, AB)}$.`,
      'Raportul ariilor este pătratul raportului de asemănare:',
      show(`\\frac{\\mathcal{A}_{ADE}}{\\mathcal{A}_{ABC}} = k^2 = ${frac(1, t * t)} \\Rightarrow \\mathcal{A}_{ABC} = ${t * t} \\cdot ${small} = ${big}\\text{ cm}^2`),
    ),
    verify: () => big === small * t * t,
  }
}

/** The natural numbers for which ax + b < c. */
export function inequalityNatural(rng: Rng): Made {
  const a = int(rng, 2, 6)
  const n = int(rng, 1, 6)
  const b = int(rng, -10, 10)
  // the solutions are 0, 1, …, n − 1: a(n − 1) + b < c ≤ an + b
  const c = a * n + b - int(rng, 0, a - 1)
  const xs = Array.from({ length: n }, (_, i) => i).filter((x) => a * x + b < c)
  return {
    text: `Determinați numerele naturale $x$ pentru care $${poly([[a, 'x'], [b, '']])} < ${c}$.`,
    solution: show(`${a}x < ${c - b} \\Rightarrow x < ${frac(c - b, a)} \\Rightarrow x \\in \\{${xs.join(', ')}\\}`),
    verify: () => xs.length === n && a * n + b >= c,
  }
}

/** x + y = s, x − y = d. */
export function systemSum(rng: Rng): Made {
  const [x0, y0] = [int(rng, -9, 12), int(rng, -9, 12)]
  return {
    text: `Rezolvați sistemul de ecuații: $\\begin{cases} x + y = ${x0 + y0} \\\\ x - y = ${x0 - y0} \\end{cases}$`,
    solution: lines('Adunăm cele două ecuații:', show(`2x = ${2 * x0} \\Rightarrow x = ${x0}, \\quad y = ${x0 + y0} - ${paren(x0)} = ${y0}, \\qquad S = \\{(${x0}, ${y0})\\}`)),
    verify: () => true,
  }
}

/** A common factor out of a binomial: 6x + 9 = 3(2x + 3). */
export function factoringCommonNumber(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 9)
    const [a, b] = [int(rng, 1, 9), nonZero(rng, -9, 9)]
    if (gcd(a, Math.abs(b)) !== 1) continue
    return {
      text: `Descompuneți în factori: $${poly([[k * a, 'x'], [k * b, '']])}$.`,
      solution: lines('Dăm factor comun cel mai mare divizor comun al coeficienților:', show(`${poly([[k * a, 'x'], [k * b, '']])} = ${k}(${poly([[a, 'x'], [b, '']])})`)),
      verify: () => true,
    }
  }
}

/** kx² − km = 0 with m not a square: the roots are radicals. */
export function quadraticRadical(rng: Rng): Made {
  for (;;) {
    const m = int(rng, 2, 50)
    if (Number.isInteger(Math.sqrt(m))) continue
    const k = int(rng, 2, 6)
    return {
      text: `Rezolvați în $\\mathbb{R}$ ecuația $${k}x^2 - ${k * m} = 0$.`,
      solution: show(`${k}x^2 = ${k * m} \\Rightarrow x^2 = ${m} \\Rightarrow x = \\pm\\sqrt{${m}}${root(m) !== `\\sqrt{${m}}` ? ` = \\pm ${root(m)}` : ''}, \\qquad S = \\{-${root(m)}, ${root(m)}\\}`),
      verify: () => true,
    }
  }
}
