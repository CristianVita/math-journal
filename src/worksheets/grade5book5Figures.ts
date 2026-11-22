// Illustrated exercises from Mate 2000+ Consolidare, grade V, part I (Paralela 45), pp. 136–183.
// These forms join the existing worksheet kinds. The statement, figure and solution share the same data.
import type { Fig } from '../models/figure'
import { barChart, numberLine, pieChart, shadedGrid, table } from './figures5'
import type { GradeKind } from './grade5puisor2'
import type { Made } from './generators'
import { de, frac, int, pick, shuffle, type Rng } from './tex'

type Form = (rng: Rng) => Made
const lines = (...parts: string[]) => parts.join('\n\n')
const display = (math: string) => `$$${math}$$`
const raw = (p: number, q: number) => `\\frac{${p}}{${q}}`
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

// p. 136, ex. 2 a): the shaded part of a rectangle.
const shadedRectangle: Form = (rng) => {
  const cols = int(rng, 3, 9)
  const rows = int(rng, 2, 5)
  const total = cols * rows
  const count = int(rng, 1, total - 1)
  const cells = shuffle(rng, Array.from({ length: total }, (_, i) => i)).slice(0, count)
  const fig = shadedGrid(cols, rows, cells.map((i) => [i % cols, Math.floor(i / cols)]))
  return {
    text: `Dreptunghiul din desen are ${rows} rânduri și ${cols} coloane de pătrățele egale. Scrieți fracția care reprezintă partea hașurată, apoi fracția care reprezintă partea nehașurată.`,
    solution: lines(
      `În total sunt $${rows} \\cdot ${cols} = ${total}$ pătrățele. Numărăm ${de(count)} ${count === 1 ? 'pătrățel hașurat' : 'pătrățele hașurate'} și rămân $${total} - ${count} = ${total - count}$ nehașurate.`,
      display(`${raw(count, total)} + ${raw(total - count, total)} = 1`),
    ),
    verify: () => new Set(cells).size === count && fig.path?.filter((part) => part.hatch).length === count,
    fig,
  }
}

// p. 136, ex. 3: equal parts of a triangle, each with the same height and base length.
const shadedTriangle: Form = (rng) => {
  const parts = int(rng, 3, 9)
  const count = int(rng, 1, parts - 1)
  const shaded = shuffle(rng, Array.from({ length: parts }, (_, i) => i)).slice(0, count)
  const base = parts * 24
  const apex = `${base / 2 + 4} 4`
  const onBase = (i: number) => `${4 + 24 * i} 94`
  const fig: Fig = {
    w: base + 8, h: 98, p: {},
    path: [
      ...shaded.map((i) => ({ d: `M${apex} L${onBase(i)} L${onBase(i + 1)} Z`, hatch: true })),
      { d: `M${apex} L${onBase(0)} L${onBase(parts)} Z` },
      { d: Array.from({ length: parts - 1 }, (_, i) => `M${apex} L${onBase(i + 1)}`).join(' ') },
    ],
  }
  return {
    text: `Triunghiul din desen este împărțit în ${parts} părți de arii egale. Ce fracție din aria lui reprezintă partea hașurată? Scrieți răspunsul în formă ireductibilă.`,
    solution: lines(`Se văd ${count === 1 ? 'o singură parte hașurată' : `${count} părți hașurate`} din ${parts}.`, display(`${raw(count, parts)}${raw(count, parts) === frac(count, parts) ? '' : ` = ${frac(count, parts)}`}`)),
    verify: () => fig.path?.filter((part) => part.hatch).length === count && new Set(shaded).size === count,
    fig,
  }
}

// p. 150, ex. 6–7: a point on the axis has several equivalent fraction coordinates.
const equivalentOnAxis: Form = (rng) => {
  const d = int(rng, 3, 12)
  const tick = int(rng, 1, 2 * d - 1)
  const name = pick(rng, ['A', 'B', 'C', 'D', 'M', 'P'])
  const fig = numberLine({ from: 0, to: 2, step: 1 / d, labels: [0, 1, 2], points: [{ name, at: tick / d }], w: 290 })
  return {
    text: `Pe axa din desen, unitatea are ${d} diviziuni egale. Citiți coordonata punctului $${name}$ și scrieți-o sub forma a trei fracții echivalente.`,
    solution: lines(
      `De la $0$ la $${name}$ numărăm ${tick} ${tick === 1 ? 'diviziune' : 'diviziuni'}. O diviziune este $${raw(1, d)}$ din unitate. Amplificăm coordonata cu $2$ și cu $3$.`,
      display(`${raw(tick, d)} = ${raw(2 * tick, 2 * d)} = ${raw(3 * tick, 3 * d)}`),
    ),
    verify: () => Math.abs((fig.p[name][0] - 14) / (fig.w - 38) - tick / (2 * d)) < 1e-9,
    fig,
  }
}

// p. 158, V: recover the length of the unit from the distance to a point whose coordinate is known.
const axisUnitLength: Form = (rng) => {
  const d = int(rng, 3, 9)
  const b = int(rng, 2, d - 1)
  const stepMm = 5 * int(rng, 1, 8)
  const fig = numberLine({
    from: 0, to: 1, step: 1 / d, labels: [0, 1],
    points: [{ name: 'O', at: 0 }, { name: 'A', at: 1 / d }, { name: 'B', at: b / d }], w: 270,
  })
  return {
    text: `Pe axa din desen, $O$ este originea, iar $A$ și $B$ au coordonatele $${raw(1, d)}$, respectiv $${frac(b, d)}$. Dacă $OA = ${stepMm}$ mm, aflați lungimea unității de măsură și lungimea segmentului $AB$, ambele în centimetri.`,
    solution: lines(
      `Unitatea are ${d} diviziuni egale, fiecare de lungime $OA$. Ea măsoară $${d} \\cdot ${stepMm} = ${d * stepMm}$ mm, adică $${frac(d * stepMm, 10)}$ cm.`,
      `Între $A$ și $B$ sunt $${b} - 1 = ${b - 1}$ diviziuni. Segmentul $AB$ măsoară $${b - 1} \\cdot ${stepMm} = ${(b - 1) * stepMm}$ mm, adică $${frac((b - 1) * stepMm, 10)}$ cm.`,
    ),
    verify: () => Math.abs((fig.p.B[0] - fig.p.A[0]) / (fig.p.A[0] - fig.p.O[0]) - (b - 1)) < 1e-9,
    fig,
  }
}

// p. 171, ex. 1: a LaTeX table keeps the numerators and denominators stacked.
const inverseTable: Form = (rng) => {
  const ds = shuffle(rng, [5, 7, 11, 13]).slice(0, 3)
  const ns = ds.map((d) => int(rng, 2, d - 1))
  const input = ns.map((n, i) => raw(n, ds[i]))
  const inverse = ns.map((n, i) => raw(ds[i], n))
  const row = (label: string, cells: string[]) => [`\\text{${label}}`, ...cells].join(' & ')
  const grid = (first: string[], second: string[]) => display(
    `\\begin{array}{|l|c|c|c|}\\hline ${row('Numere date', first)} \\\\ \\hline ${row('Inverse', second)} \\\\ \\hline\\end{array}`,
  )
  return {
    text: lines('Completați căsuțele libere din tabel. Pe fiecare coloană, numerele sunt inverse unul față de celălalt.',
      grid([input[0], '\\square', input[2]], ['\\square', inverse[1], '\\square'])),
    solution: lines(
      'Pentru a afla inversa unei fracții nenule, schimbăm între ele numărătorul și numitorul.',
      grid(input, inverse),
    ),
    verify: () => ns.every((n, i) => Math.abs((n / ds[i]) * (ds[i] / n) - 1) < 1e-12),
  }
}

// p. 172, ex. 7: both quotients of a pair of fractions, in opposite orders.
const quotientTable: Form = (rng) => {
  const a = int(rng, 2, 9), b = int(rng, 10, 19)
  const c = int(rng, 2, 9), d = int(rng, 3, 12)
  const grid = (x: string, y: string) => display(
    `\\begin{array}{|c|c|c|c|}\\hline x & y & x : y & y : x \\\\ \\hline ${raw(a, b)} & ${raw(c, d)} & ${x} & ${y} \\\\ \\hline\\end{array}`,
  )
  return {
    text: lines('Completați tabelul cu cele două câturi, sub formă ireductibilă.', grid('\\square', '\\square')),
    solution: lines(
      'La fiecare împărțire, înmulțim prima fracție cu inversa celei de-a doua.',
      display(`x : y = ${raw(a, b)} \\cdot ${raw(d, c)} = ${frac(a * d, b * c)}, \\qquad y : x = ${raw(c, d)} \\cdot ${raw(b, a)} = ${frac(b * c, a * d)}`),
      grid(frac(a * d, b * c), frac(b * c, a * d)),
    ),
    verify: () => Math.abs((a / b) / (c / d) - (a * d) / (b * c)) < 1e-12 && Math.abs((c / d) / (a / b) - (b * c) / (a * d)) < 1e-12,
  }
}

// p. 182, ex. 17: using a budget table to calculate amounts and draw a pie chart.
const budgetTable: Form = (rng) => {
  const income = 100 * int(rng, 20, 90)
  const rent = 5 * int(rng, 5, 7)
  const food = 5 * int(rng, 5, 6)
  const transport = 5 * int(rng, 2, 3)
  const percents = [rent, food, transport, 100 - rent - food - transport]
  const labels = ['Locuință', 'Hrană', 'Transport', 'Altele']
  const fig = table([['Cheltuieli', 'Procent', 'Sumă (lei)'], ...labels.map((label, i) => [label, `${percents[i]}%`, ''])],
    { first: 88, cell: 76 })
  const amounts = percents.map((p) => (p * income) / 100)
  const angles = percents.map((p) => (p * 360) / 100)
  return {
    text: `O familie alocă un buget lunar de ${income} de lei conform tabelului. Completați sumele în lei și calculați unghiurile sectoarelor unei diagrame circulare pentru acest buget.`,
    solution: lines(
      'Pentru fiecare categorie, aplicăm procentul din tabel la suma totală și la unghiul de $360^\\circ$.',
      ...labels.map((label, i) => `${label} — $${raw(percents[i], 100)} \\cdot ${income} = ${amounts[i]}$ lei, $${raw(percents[i], 100)} \\cdot 360^\\circ = ${angles[i]}^\\circ$.`),
    ),
    verify: () => sum(amounts) === income && sum(angles) === 360 && amounts.every(Number.isInteger),
    fig,
  }
}

// p. 183, ex. 19: recover a missing percent from a pie chart and find how many students it represents.
const marksPieChart: Form = (rng) => {
  const total = 100 * int(rng, 3, 16)
  const lower = int(rng, 13, 21)
  const middle = int(rng, 22, 29)
  const upper = int(rng, 30, 35)
  const top = 100 - lower - middle - upper
  const fig = pieChart(
    [lower, middle, upper, top], ['5–6', '7', '8–9', '10'],
    [`${lower}%`, `${middle}%`, `${upper}%`, '?'], [3],
  )
  return {
    text: `Diagrama circulară arată notele obținute de ${de(total)} elevi. Aflați procentul celor cu nota $10$ și numărul elevilor cu nota cel puțin $8$.`,
    solution: lines(
      display(`100\\% - (${lower}\\% + ${middle}\\% + ${upper}\\%) = ${top}\\%`),
      `Cu cel puțin $8$ sunt cei cu notele $8$, $9$ sau $10$, adică $${upper}\\% + ${top}\\% = ${upper + top}\\%$ din total.`,
      display(`${raw(upper + top, 100)} \\cdot ${total} = ${((upper + top) * total) / 100}`),
    ),
    verify: () => top > 0 && (upper + top) * total / 100 + (lower + middle) * total / 100 === total,
    fig,
  }
}

// p. 183, ex. 23, adapted to a bar chart: turn the counts read from the bars into percentages.
const marksBarChart: Form = (rng) => {
  const total = 10 * int(rng, 8, 20)
  const parts = shuffle(rng, pick(rng, [[1, 2, 3, 4], [1, 1, 3, 5], [1, 2, 2, 5], [1, 2, 2, 2, 3], [1, 1, 2, 2, 4]]))
  const labels = parts.length === 4 ? ['7', '8', '9', '10'] : ['6', '7', '8', '9', '10']
  const counts = parts.map((p) => p * total / 10)
  const fig = barChart(labels, counts, total / 10, { w: 270, title: 'Număr de elevi după notă' })
  return {
    text: `Pe grafic sunt reprezentate rezultatele a ${de(total)} elevi. Pentru fiecare dintre notele de la $${labels[0]}$ la $10$, citiți numărul elevilor și exprimați-l ca procent din total.`,
    solution: lines(
      `Citim înălțimea fiecărei bare. Pentru o notă cu $n$ elevi, scriem fracția $\\frac{n}{${total}}$ cu numitorul $100$.`,
      ...labels.map((label, i) => `Nota $${label}$ — $${raw(counts[i], total)} = ${raw(10 * parts[i], 100)} = ${10 * parts[i]}\\%$.`),
    ),
    verify: () => sum(counts) === total && counts.every((count, i) => count * 100 === total * parts[i] * 10),
    fig,
  }
}

export const KINDS: GradeKind[] = [
  {
    id: 'v-b5-fraction-areas', joins: 'v-fraction-figures',
    label: 'Fracții pe dreptunghiuri și triunghiuri', topic: 'Algebră',
    forms: { 1: [shadedRectangle, shadedTriangle], 2: [], 3: [] },
  },
  {
    id: 'v-b5-fraction-axis', joins: 'v-number-line',
    label: 'Fracții pe axa numerelor', topic: 'Algebră',
    forms: { 1: [], 2: [equivalentOnAxis], 3: [axisUnitLength] },
  },
  {
    id: 'v-b5-fraction-tables', joins: 'v-fraction-mult',
    label: 'Inverse și câturi în tabele', topic: 'Algebră',
    forms: { 1: [inverseTable], 2: [quotientTable], 3: [] },
  },
  {
    id: 'v-b5-percent-figures', joins: 'v-fraction-props',
    label: 'Procente în tabele și diagrame', topic: 'Algebră',
    forms: { 1: [], 2: [marksBarChart], 3: [budgetTable, marksPieChart] },
  },
]
