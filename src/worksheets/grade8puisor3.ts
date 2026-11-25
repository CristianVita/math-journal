// Grade VIII algebra after the workbook "cu puișorul" photographed by the user on 25 November 2026, pp. 45–55: functions
// on finite sets (4.1), linear functions (4.2), statistics (4.3). 4.1 has stars; 4.2 and 4.3 have none (by content).
import type { Fig, Pt } from '../models/figure'
import { de, int, nonZero, paren, pick, root, shuffle, surd, rootParts, type Rng } from './tex'
import type { Made } from './generators'
import { R, X, asc, at, cf, fr, lin, lines, near, q, range, setOf, sgn, show, type Kind8 } from './alg8'
import { barChart, pieChart, table } from './figures5'

const F = (l: [number, number]) => X(l) // [a, b] = ax + b
const fDef = (l: [number, number], name = 'f') => `$${name}: ${R} \\to ${R}$, $${name}(x) = ${F(l)}$`
const pt = (a: number | string, b: number | string) => `(${a}, ${b})`
const line = (rng: Rng, k = 5): [number, number] => [nonZero(rng, -k, k), nonZero(rng, -9, 9)]

// ---------- 4.1 functions on finite sets ----------

/** Two ovals with arrows between their elements. */
function arrows(left: string[], right: string[], pairs: [number, number][]): Fig {
  const w = 220, h = 150, L = (i: number): Pt => [50, 34 + (i * 96) / Math.max(1, left.length - 1)], Q = (i: number): Pt => [170, 28 + (i * 108) / Math.max(1, right.length - 1)]
  const path: NonNullable<Fig['path']> = pairs.flatMap(([i, j]) => {
    const [a, b] = [L(i), Q(j)], d = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / d, (b[1] - a[1]) / d]
    const s = [a[0] + 5 * u[0], a[1] + 5 * u[1]], e = [b[0] - 5 * u[0], b[1] - 5 * u[1]], f = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`
    return [{ d: `M${f(s[0], s[1])} L${f(e[0], e[1])}` }, { d: `M${f(e[0], e[1])} L${f(e[0] - 7 * u[0] - 3 * u[1], e[1] - 7 * u[1] + 3 * u[0])} L${f(e[0] - 7 * u[0] + 3 * u[1], e[1] - 7 * u[1] - 3 * u[0])} Z`, fill: '#111' }]
  })
  return {
    w, h, p: {}, e: [{ at: [44, 82], rx: 34, ry: 66 }, { at: [176, 82], rx: 34, ry: 66 }], path,
    t: [...left.map((s, i) => ({ at: [L(i)[0] - 14, L(i)[1] + 4] as Pt, s, size: 12, italic: true })), ...right.map((s, i) => ({ at: [Q(i)[0] + 14, Q(i)[1] + 4] as Pt, s, size: 12 })), { at: [12, 18] as Pt, s: 'A', size: 13 }, { at: [208, 18] as Pt, s: 'B', size: 13 }],
  }
}
/** p. 45, ex. 1 */
export function fnDiagram(rng: Rng): Made {
  const n = int(rng, 3, 4), m = int(rng, 3, 4), left = ['a', 'b', 'c', 'd'].slice(0, n), right = shuffle(rng, range(0, 9)).slice(0, m).sort((x, y) => x - y).map(String)
  const kind = int(rng, 0, 2), map = left.map(() => int(rng, 0, m - 1)), bad = int(rng, 0, n - 1)
  let pairs = map.map((j, i) => [i, j] as [number, number])
  if (kind === 1) pairs = pairs.filter(([i]) => i !== bad)
  if (kind === 2) pairs.push([bad, (map[bad] + 1) % m])
  return {
    text: lines(`Stabiliți dacă corespondența de la $A = \\{${left.join(';\\ ')}\\}$ la $B = \\{${right.join(';\\ ')}\\}$, din diagrama alăturată, este o funcție. Dacă este, scrieți mulțimea valorilor ei.`),
    solution: kind === 0 ? lines('Din fiecare element al lui $A$ pleacă exact o săgeată, deci este funcție.', show(`\\operatorname{Im} f = ${setOf(asc(map).map((j) => right[j]))}`)) : kind === 1 ? `Nu este funcție: elementului $${left[bad]}$ nu îi corespunde niciun element din $B$.` : `Nu este funcție: elementului $${left[bad]}$ îi corespund două elemente din $B$.`,
    fig: arrows(left, right, pairs),
    verify: () => (kind === 0) === left.every((_, i) => pairs.filter((p) => p[0] === i).length === 1),
  }
}
/** p. 45, ex. 3; p. 46, ex. 13 */
export function fnImage(rng: Rng): Made {
  const D = asc(shuffle(rng, range(-5, 6)).slice(0, 5)), a = int(rng, 1, 3), b = nonZero(rng, -5, 5), sq = rng() < 0.4, f = (x: number) => (sq ? x * x + b : a * x + b)
  return {
    text: `Fie funcția $f: ${setOf(D)} \\to ${R}$, $f(x) = ${sq ? X([1, 0, b]) : X([a, b])}$. Determinați mulțimea valorilor funcției și scrieți graficul ei.`,
    solution: lines(show(D.map((x) => `f(${x}) = ${f(x)}`).join(', \\ ')), show(`\\operatorname{Im} f = ${setOf(asc(D.map(f)))}`), show(`G_f = ${setOf(D.map((x) => pt(x, f(x))))}`)),
    verify: () => D.length === 5,
  }
}
/** p. 46, ex. 6 */
export function fnValues(rng: Rng): Made {
  const n = int(rng, 4, 6), a = int(rng, 1, 5), b = nonZero(rng, -6, 6), f = (x: number) => a * x + b, u = int(rng, 1, n)
  return {
    text: `Fie $f: ${setOf(range(0, n))} \\to ${R}$, $f(x) = ${X([a, b])}$. Calculați: a) $f(0) + f(${n})$; b) $f(1) - f(${u}) \\cdot f(2)$.`,
    solution: lines(show(`\\text{a) } f(0) + f(${n}) = ${b} + ${paren(f(n))} = ${b + f(n)}`), show(`\\text{b) } f(1) - f(${u}) \\cdot f(2) = ${f(1)} - ${paren(f(u))} \\cdot ${paren(f(2))} = ${f(1) - f(u) * f(2)}`)),
    verify: () => u <= n,
  }
}
/** p. 45, ex. 4 */
export function fnTable(rng: Rng): Made {
  const D = asc(shuffle(rng, range(-4, 6)).slice(0, 5)), a = nonZero(rng, -3, 4), b = nonZero(rng, -6, 6)
  return {
    text: `Tabelul alăturat este tabelul de valori al unei funcții $f: ${setOf(D)} \\to ${R}$. Găsiți o lege de corespondență de forma $f(x) = ax + b$.`,
    solution: lines(`Din primele două coloane: $${D[0]}a + b = ${a * D[0] + b}$ și $${D[1]}a + b = ${a * D[1] + b}$.`.replace(/\$0a \+ b/, '$b').replace(/\$1a/, '$a').replace(/\$-1a/, '$-a').replace(/și \$0a \+ b/, 'și $b').replace(/și \$1a/, 'și $a').replace(/și \$-1a/, 'și $-a'), show(`a = \\frac{${a * D[1] + b} - ${paren(a * D[0] + b)}}{${D[1]} - ${paren(D[0])}} = ${a}, \\qquad b = ${b}, \\qquad f(x) = ${X([a, b])}`), 'Legea se verifică și în celelalte coloane.'),
    fig: table([['x', ...D.map(String)], ['f(x)', ...D.map((x) => String(a * x + b))]], { cell: 44, first: 60 }),
    verify: () => D.length === 5,
  }
}
/** p. 46, ex. 8 */
export function fnDomain(rng: Rng): Made {
  const a = pick(rng, [-3, -2, -1, 2, 3]), b = nonZero(rng, -7, 7), D = asc(shuffle(rng, range(-5, 6)).slice(0, 4)), B = D.map((x) => a * x + b).sort((x, y) => x - y)
  return {
    text: `Funcția $f: A \\to B$, $f(x) = ${X([a, b])}$, are mulțimea valorilor $B = ${setOf(B)}$. Determinați domeniul de definiție $A$.`,
    solution: lines(...B.map((y) => `$${X([a, b])} = ${y} \\Rightarrow x = ${(y - b) / a}$;`), show(`A = ${setOf(D)}`)),
    verify: () => B.every((y) => Number.isInteger((y - b) / a)),
  }
}
/** p. 46, ex. 9 */
export function fnEqual(rng: Rng): Made {
  const u = int(rng, 1, 5), s = pick(rng, [1, 1, -1]), b = nonZero(rng, -4, 4), D = [-u, 0, u], eq = rng() < 0.5, c = eq ? u * u * b : u * u * b + nonZero(rng, -3, 3)
  // f(x) = s·x³ + b·... on {−u, 0, u}: x³ = u²x
  return {
    text: `Verificați dacă funcțiile $f, g: ${setOf(D)} \\to ${R}$, $f(x) = ${X([s * b, 0, 0, 0])}$ și $g(x) = ${X([s * c, 0])}$ sunt egale.`,
    solution: lines('Au același domeniu și același codomeniu; comparăm valorile:', ...D.map((x) => `$f(${x}) = ${s * b * x ** 3 + 0}$, $g(${x}) = ${s * c * x + 0}$;`), eq ? 'Valorile sunt egale, deci $f = g$.' : 'Valorile nu coincid, deci $f \\ne g$.'),
    verify: () => eq === (b * u ** 3 === c * u),
  }
}
/** p. 47, ex. 17 */
export function fnOnGraph(rng: Rng): Made {
  const a = nonZero(rng, -3, 3), b = nonZero(rng, -6, 6), D = range(-3, 4), xs = shuffle(rng, D).slice(0, 3), P = [pt(xs[0], a * xs[0] + b), pt(xs[1], a * xs[1] + b + pick(rng, [-2, -1, 1, 2])), pt(6, a * 6 + b)], ok = [true, false, false]
  const order = shuffle(rng, [0, 1, 2])
  return {
    text: `Fie $f: ${setOf(D)} \\to ${R}$, $f(x) = ${X([a, b])}$. Care dintre punctele ${order.map((i, j) => `$${'ABC'[j]}${P[i]}$`).join(', ')} aparțin graficului funcției?`,
    solution: lines(...order.map((i, j) => i === 2 ? `- $${'ABC'[j]} \\notin G_f$, pentru că 6 nu este în domeniu;` : `- $f(${xs[i]}) = ${a * xs[i] + b}$, deci $${'ABC'[j]} ${ok[i] ? '\\in' : '\\notin'} G_f$;`)),
    verify: () => ok[0],
  }
}
/** The grid of a Cartesian drawing with these points marked (letters), and these lines drawn. */
function cartesian(points: { n: string; at: Pt }[], segs: [Pt, Pt][] = []): Fig {
  const all = [...points.map((x) => x.at), ...segs.flat(), [0, 0] as Pt], u = 28
  const x0 = Math.min(...all.map((x) => x[0])) - 1, x1 = Math.max(...all.map((x) => x[0])) + 1.5, y0 = Math.min(...all.map((x) => x[1])) - 1, y1 = Math.max(...all.map((x) => x[1])) + 1.5
  const P = (x: number, y: number): Pt => [(x - x0) * u, (y1 - y) * u], w = (x1 - x0) * u, h = (y1 - y0) * u, o = P(0, 0)
  const ticks = [...range(Math.ceil(x0), Math.floor(x1)).map((x) => `M${P(x, 0)[0]} ${o[1] - 2} L${P(x, 0)[0]} ${o[1] + 2}`), ...range(Math.ceil(y0), Math.floor(y1)).map((y) => `M${o[0] - 2} ${P(0, y)[1]} L${o[0] + 2} ${P(0, y)[1]}`)].join(' ')
  return {
    w, h, p: Object.fromEntries(points.map((x) => [x.n, P(...x.at)])), l: Object.fromEntries(points.map((x) => [x.n, x.at[1] < 0 ? ('s' as const) : ('n' as const)])), dot: points.map((x) => x.n).join(' '),
    axes: { o, x: [0, w], y: [h, 0], xl: 'x', yl: 'y' },
    path: [{ d: ticks }, ...points.filter((x) => x.at[0] !== 0 && x.at[1] !== 0).map((x) => ({ d: `M${P(x.at[0], 0).join(' ')} L${P(...x.at).join(' ')} L${P(0, x.at[1]).join(' ')}`, dashed: true })), ...segs.map(([a, b]) => ({ d: `M${P(...a).join(' ')} L${P(...b).join(' ')}` }))],
    t: [...asc(points.map((x) => x.at[0]).filter((x) => x !== 0)).map((x) => ({ at: [P(x, 0)[0], o[1] + (points.some((z) => z.at[0] === x && z.at[1] < 0) ? -6 : 14)] as Pt, s: String(x), size: 10 })), ...asc(points.map((x) => x.at[1]).filter((y) => y !== 0)).map((y) => points.some((z) => z.at[1] === y && z.at[0] < 0) ? { at: [o[0] + 4, P(0, y)[1] - 3] as Pt, s: String(y), size: 10, anchor: 'start' as const } : { at: [o[0] - 4, P(0, y)[1] + 4] as Pt, s: String(y), size: 10, anchor: 'end' as const })],
  }
}
/** p. 46, ex. 16 */
export function fnReadGraph(rng: Rng): Made {
  const xs = asc(shuffle(rng, [-3, -2, -1, 1, 2, 3, 4]).slice(0, 4)), ys = xs.map(() => nonZero(rng, -3, 4)), P = xs.map((x, i) => ({ n: 'ABCD'[i], at: [x, ys[i]] as Pt }))
  const [i, j] = shuffle(rng, [0, 1, 2, 3])
  return {
    text: lines('Graficul unei funcții $f$ este format din punctele $A$, $B$, $C$, $D$ din sistemul de axe alăturat.', 'a) Scrieți domeniul de definiție și mulțimea valorilor funcției.', `b) Calculați $f(${xs[i]}) + f(${xs[j]})$.`),
    solution: lines(show(`G_f = ${setOf(P.map((x) => pt(x.at[0], x.at[1])))}`), show(`\\text{a) domeniul } ${setOf(xs)}, \\qquad \\operatorname{Im} f = ${setOf(asc(ys))}`), show(`\\text{b) } ${ys[i]} + ${paren(ys[j])} = ${ys[i] + ys[j]}`)),
    fig: cartesian(P),
    verify: () => new Set(xs).size === 4,
  }
}
/** p. 47, ex. 20 */
export function fnParameter(rng: Rng): Made {
  const k = int(rng, 2, 3), n = int(rng, 1, 3), a = nonZero(rng, -4, 4), x0 = k * n, b = nonZero(rng, -7, 7), D = asc([0, x0, x0 + k, -k])
  return {
    text: `Fie $f: ${setOf(D)} \\to ${R}$, $f(x) = ${X([a, b])}$. Aflați numărul real $m$ pentru care punctul $M(${k}m, ${a * x0 + b})$ aparține graficului funcției.`,
    solution: lines(show(`f(${k}m) = ${a * x0 + b} \\Leftrightarrow ${X([a * k, b], 'm')} = ${a * x0 + b} \\Rightarrow m = ${n}`), `Verificăm: $${k}m = ${x0}$ este în domeniu.`),
    verify: () => a * k * n + b === a * x0 + b,
  }
}
/** p. 47, ex. 21 */
export function fnChain(rng: Rng): Made {
  const c = int(rng, 2, 5), A = [-1, 0, 1], k = int(rng, 1, 5), d = nonZero(rng, -4, 4), y = A.map((x) => [k, x + c] as const), g = y.map(([p, r]) => q(p + d * r, r))
  return {
    text: `Fie $A = \\{-1;\\ 0;\\ 1\\}$, $f: A \\to ${R}$, $f(x) = ${fr(k, lin(c))}$, și $g: B \\to ${R}$, $g(y) = ${lin(d, 'y')}$, unde $B$ este mulțimea valorilor lui $f$. Determinați mulțimea valorilor lui $g$.`,
    solution: lines(show(`B = \\{f(-1), f(0), f(1)\\} = ${setOf(y.map(([p, r]) => q(p, r)))}`), show(`\\operatorname{Im} g = ${setOf(g)}`)),
    verify: () => new Set(g).size === 3,
  }
}
/** p. 47, ex. 22 */
export function fnInequality(rng: Rng): Made {
  const a = int(rng, 2, 6), b = nonZero(rng, -6, 6), p = int(rng, 1, 3), s = nonZero(rng, -4, 4), t = int(rng, 1, 8)
  // 2f(a) − f(a + s) ≤ c, in N: a·n + b − a·s ≤ c
  const c = a * t + b - a * s + int(rng, 0, a - 1)
  void p
  return {
    text: `Fie $f: ${R} \\to ${R}$, $f(x) = ${X([a, b])}$. Determinați numerele naturale $n$ pentru care $2f(n) - f(${lin(s, 'n')}) \\le ${c}$.`,
    solution: lines(show(`2(${X([a, b], 'n')}) - (${X([a, a * s + b], 'n')}) \\le ${c} \\Leftrightarrow ${X([a, b - a * s], 'n')} \\le ${c} \\Leftrightarrow n \\le ${q(c - b + a * s, a)}`), show(`n \\in ${setOf(range(0, t))}`)),
    verify: () => a * t + b - a * s <= c && a * (t + 1) + b - a * s > c,
  }
}

// ---------- 4.2 the linear function ----------

/** p. 50, ex. 46–47 */
export function lfAxes(rng: Rng): Made {
  const l = line(rng, 6)
  return {
    text: `Determinați coordonatele punctelor de intersecție cu axele ale graficului funcției ${fDef(l)}.`,
    solution: lines(show(`f(x) = 0 \\Leftrightarrow x = ${q(-l[1], l[0])} \\Rightarrow G_f \\cap Ox = \\left\\{A\\left(${q(-l[1], l[0])}, 0\\right)\\right\\}`), show(`f(0) = ${l[1]} \\Rightarrow G_f \\cap Oy = \\{B(0, ${l[1]})\\}`)),
    verify: () => l[0] !== 0,
  }
}
/** p. 47, ex. 1 */
export function lfWhich(rng: Rng): Made {
  const a = nonZero(rng, -5, 5), b = nonZero(rng, -9, 9), m = pick(rng, [2, 3, 5, 7]), c = int(rng, 2, 6)
  const L = shuffle(rng, [{ t: `${cf(a)}x\\sqrt{${m}}`, y: true }, { t: `\\frac{${c}}{x^2 + 1}${sgn(b)}`, y: false }, { t: X([c, b, 0]), y: false }, { t: `${fr('x', c)}${sgn(b)}`, y: true }])
  return {
    text: lines(`Care dintre funcțiile definite pe $${R}$ sunt liniare?`, ...L.map((x, i) => `${'abcd'[i]}) $f(x) = ${x.t}$`)),
    solution: lines(`O funcție liniară are forma $f(x) = ax + b$. Sunt liniare: ${L.flatMap((x, i) => (x.y ? ['abcd'[i] + ')'] : [])).join(', ')}.`),
    verify: () => L.filter((x) => x.y).length === 2,
  }
}
/** p. 47, ex. 2 */
export function lfDraw(rng: Rng): Made {
  const l: [number, number] = [nonZero(rng, -3, 3), nonZero(rng, -5, 5)], x = int(rng, 1, 3)
  return {
    text: `Reprezentați grafic funcția ${fDef(l)} și stabiliți dacă punctul $M(${x}, ${at(l, x)})$ este pe grafic.`,
    solution: lines('Graficul este o dreaptă; ajung două puncte:', show(`f(0) = ${l[1]} \\Rightarrow A(0, ${l[1]}), \\qquad f(1) = ${at(l, 1)} \\Rightarrow B(1, ${at(l, 1)})`), `Trasăm dreapta $AB$. Cum $f(${x}) = ${at(l, x)}$, punctul $M$ este pe grafic.`),
    verify: () => true,
  }
}
/** p. 48, ex. 12 */
export function lfSpecialPoint(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -5, 6), b = nonZero(rng, -9, 9), v = int(rng, 0, 2)
    if ((v === 0 && a === 1) || (v === 1 && a === -1)) continue
    const what = ['coordonatele egale', 'coordonatele opuse', 'ordonata egală cu dublul abscisei'][v], k = [1, -1, 2][v]
    if (a === k) continue
    return {
      text: `Aflați punctul de pe graficul funcției ${fDef([a, b])} care are ${what}.`,
      solution: lines(`Punctul are forma $M(m, ${cf(k)}m)$:`, show(`f(m) = ${cf(k)}m \\Leftrightarrow ${X([a, b], 'm')} = ${cf(k)}m \\Rightarrow m = ${q(-b, a - k)}`), show(`M\\left(${q(-b, a - k)}, ${q(-k * b, a - k)}\\right)`)),
      verify: () => near((a * -b) / (a - k) + b, (k * -b) / (a - k)),
    }
  }
}
/** p. 48, ex. 9–10 */
export function lfParamPoints(rng: Rng): Made {
  const l: [number, number] = [pick(rng, [5, 4, -2, -3, -4]), nonZero(rng, -7, 7)], m = nonZero(rng, -5, 5), k = int(rng, 2, 3), s = nonZero(rng, -4, 4)
  return {
    text: `Determinați numărul real $a$ pentru care punctul $A(a${sgn(s)}, ${k}a${sgn(at(l, m + s) - k * m)})$ aparține graficului funcției ${fDef(l)}.`,
    solution: lines(show(`f(a${sgn(s)}) = ${X([l[0], at(l, s)], 'a')} = ${X([k, at(l, m + s) - k * m], 'a')} \\Rightarrow ${X([l[0] - k, 0], 'a')} = ${(l[0] - k) * m} \\Rightarrow a = ${m}`)),
    verify: () => at(l, m + s) - at(l, s) === l[0] * m,
  }
}
/** p. 51, ex. 55, 57 */
export function lfIntersection(rng: Rng): Made {
  for (;;) {
    const x = int(rng, -5, 5), y = int(rng, -6, 6), a = nonZero(rng, -4, 4), c = nonZero(rng, -4, 4)
    if (a === c) continue
    const f: [number, number] = [a, y - a * x], g: [number, number] = [c, y - c * x]
    return {
      text: `Aflați coordonatele punctului de intersecție a graficelor funcțiilor $f, g: ${R} \\to ${R}$, $f(x) = ${F(f)}$ și $g(x) = ${F(g)}$.`,
      solution: lines('În punctul comun cele două funcții au aceeași valoare:', show(`${F(f)} = ${F(g)} \\Rightarrow ${X([a - c, 0])} = ${g[1] - f[1]} \\Rightarrow x = ${x}`), show(`f(${x}) = ${y} \\Rightarrow G_f \\cap G_g = \\{M(${x}, ${y})\\}`)),
      verify: () => at(f, x) === y && at(g, x) === y,
    }
  }
}
/** p. 49, ex. 36–38 */
export function lfCollinear(rng: Rng): Made {
  const l: [number, number] = [nonZero(rng, -3, 3), nonZero(rng, -5, 5)], xs = shuffle(rng, range(-5, 6)).slice(0, 3), yes = rng() < 0.5, d = yes ? 0 : pick(rng, [-2, -1, 1, 2]), y = [at(l, xs[0]), at(l, xs[1]), at(l, xs[2]) + d]
  return {
    text: `Verificați dacă punctele $A${pt(xs[0], y[0])}$, $B${pt(xs[1], y[1])}$ și $C${pt(xs[2], y[2])}$ sunt coliniare.`,
    solution: lines('Aflăm funcția liniară $f(x) = ax + b$ al cărei grafic trece prin $A$ și $B$:', show(`a = \\frac{${y[1]} - ${paren(y[0])}}{${xs[1]} - ${paren(xs[0])}} = ${l[0]}, \\qquad b = ${y[0]} - ${paren(l[0])} \\cdot ${paren(xs[0])} = ${l[1]}, \\qquad f(x) = ${F(l)}`), `$f(${xs[2]}) = ${at(l, xs[2])}$, deci $C ${yes ? '\\in' : '\\notin'} G_f$: punctele ${yes ? 'sunt' : 'nu sunt'} coliniare.`),
    verify: () => (y[1] - y[0]) / (xs[1] - xs[0]) === l[0],
  }
}
/** p. 48, ex. 19 */
export function lfEquation(rng: Rng): Made {
  for (;;) {
    const l: [number, number] = [int(rng, 2, 5), nonZero(rng, -6, 6)], p = int(rng, 2, 4), r = int(rng, 2, 5), s = nonZero(rng, -3, 3), m = nonZero(rng, -5, 5), k = p * 2 * l[0] - r * l[0]
    if (k === 0) continue
    const c = p * at(l, 2 * m + s) - r * at(l, m)
    return {
      text: `Fie ${fDef(l)}. Rezolvați în $${R}$ ecuația $${p}f(2a${sgn(s)}) - ${r}f(a) = ${c}$.`,
      solution: lines(show(`f(2a${sgn(s)}) = ${X([2 * l[0], at(l, s)], 'a')}, \\qquad f(a) = ${F(l).replace('x', 'a')}`), show(`${X([2 * p * l[0], p * at(l, s)], 'a')} - (${X([r * l[0], r * l[1]], 'a')}) = ${c} \\Rightarrow ${X([k, 0], 'a')} = ${k * m} \\Rightarrow a = ${m}`)),
      verify: () => k * m === c - p * at(l, s) + r * l[1],
    }
  }
}
/** p. 49, ex. 27–30 */
export function lfInequality(rng: Rng): Made {
  const l: [number, number] = [int(rng, 2, 5), nonZero(rng, -6, 6)], u = int(rng, -5, 1), v = u + int(rng, 2, 6)
  return {
    text: `Fie ${fDef(l)}. Aflați numerele întregi $a$ pentru care $${at(l, u)} < f(a) \\le ${at(l, v)}$.`,
    solution: lines(show(`${at(l, u)} < ${F(l).replace('x', 'a')} \\le ${at(l, v)} \\Leftrightarrow ${l[0] * u} < ${l[0]}a \\le ${l[0] * v} \\Leftrightarrow ${u} < a \\le ${v}`), show(`a \\in ${setOf(range(u + 1, v))}`)),
    verify: () => u < v,
  }
}
/** p. 50, ex. 41–42, 45 */
export function lfFunctional(rng: Rng): Made {
  const l: [number, number] = [nonZero(rng, -4, 5), nonZero(rng, -6, 6)], s = int(rng, 1, 3), k = int(rng, 1, 3), E = [(k + 1) * l[0], k * l[1] + l[1] + l[0] * s]
  return {
    text: `Determinați funcția liniară $f: ${R} \\to ${R}$ pentru care $f(x + ${s}) + ${cf(k)}f(x) = ${X(E)}$, oricare ar fi $x$ real.`,
    solution: lines('Căutăm $f(x) = ax + b$:', show(`a(x + ${s}) + b + ${cf(k)}${k === 1 ? 'ax + b' : '(ax + b)'} = ${k + 1}ax + ${cf(s)}a + ${k + 1}b = ${X(E)}`), show(`${k + 1}a = ${E[0]} \\Rightarrow a = ${l[0]}, \\qquad ${cf(s)}a + ${k + 1}b = ${E[1]} \\Rightarrow b = ${l[1]}`), show(`f(x) = ${F(l)}`)),
    verify: () => l[0] * (2 + s) + l[1] + k * (2 * l[0] + l[1]) === at(E, 2),
  }
}
/** p. 51, ex. 66–67; p. 52, ex. 68 */
export function lfTwoLinesArea(rng: Rng): Made {
  for (;;) {
    const x = int(rng, -3, 4), y = int(rng, 1, 6), a = int(rng, 1, 3), c = -int(rng, 1, 3)
    if (y % a || y % c) continue
    const f: [number, number] = [a, y - a * x], g: [number, number] = [c, y - c * x], u = x - y / a, v = x - y / c
    if (!f[1] || !g[1]) continue
    return {
      text: `Calculați aria triunghiului format de axa $Ox$ și de graficele funcțiilor $f, g: ${R} \\to ${R}$, $f(x) = ${F(f)}$ și $g(x) = ${F(g)}$.`,
      solution: lines(show(`f(x) = g(x) \\Rightarrow x = ${x}, \\quad M(${x}, ${y})`), show(`f(x) = 0 \\Rightarrow A(${u}, 0), \\qquad g(x) = 0 \\Rightarrow B(${v}, 0)`), show(`AB = ${v - u}, \\quad d(M, Ox) = ${y}, \\qquad \\mathcal{A}_{MAB} = \\frac{${v - u} \\cdot ${y}}{2} = ${q((v - u) * y, 2)}`)),
      verify: () => at(f, u) === 0 && at(g, v) === 0 && v > u,
    }
  }
}
/** p. 51, ex. 65 */
export function lfAreaGiven(rng: Rng): Made {
  const m = int(rng, 1, 6), k = int(rng, 1, 8), b = m * k * 2 // x-intercept 2k, area = b·2k/2 = 2mk²
  return {
    text: `Determinați numerele reale $a$ știind că graficul funcției $f: ${R} \\to ${R}$, $f(x) = ${cf(-m)}x + a$, formează cu axele de coordonate un triunghi cu aria de ${de(2 * m * k * k)} unități pătrate.`.replace(/de 2 unități/, 'de 2 unități'),
    solution: lines(show(`A\\left(${m === 1 ? 'a' : fr('a', m)}, 0\\right), \\quad B(0, a), \\qquad \\mathcal{A}_{AOB} = \\frac{OA \\cdot OB}{2} = \\frac{a^2}{${2 * m}} = ${2 * m * k * k}`), show(`a^2 = ${b * b} \\Rightarrow a = \\pm ${b}`)),
    verify: () => (b * b) / (2 * m) === 2 * m * k * k,
  }
}
/** p. 50, ex. 49 */
export function lfTangent(rng: Rng): Made {
  const a = nonZero(rng, -5, 5), k = int(rng, 1, 6), l: [number, number] = [a, a * k * pick(rng, [1, -1])], A = Math.abs(a), x = -l[1] / a, y = l[1]
  return {
    text: `Calculați tangentele unghiurilor ascuțite formate cu axele de coordonate de graficul funcției ${fDef(l)}.`,
    solution: lines(show(`A(${x}, 0), \\quad B(0, ${y}), \\quad OA = ${Math.abs(x)}, \\quad OB = ${Math.abs(y)}`), show(`\\operatorname{tg}(\\sphericalangle OAB) = \\frac{OB}{OA} = ${A}, \\qquad \\operatorname{tg}(\\sphericalangle OBA) = \\frac{OA}{OB} = ${q(1, A)}`)),
    verify: () => near(Math.abs(y / x), A),
  }
}
/** p. 51, ex. 61; p. 55, test 4, ex. 3 d */
export function lfSymmetric(rng: Rng): Made {
  const m = int(rng, 1, 4), k = int(rng, 1, 6), b = m * k, [r, s] = rootParts(k * k + b * b)
  return {
    text: lines(`Graficul funcției ${fDef([-m, b])} intersectează axa $Ox$ în $A$ și axa $Oy$ în $B$, iar $C$ este simetricul lui $A$ față de axa $Oy$.`, 'a) Calculați perimetrul triunghiului $ABC$.', 'b) Calculați distanța de la $C$ la dreapta $AB$.'),
    solution: lines(show(`A(${k}, 0), \\quad B(0, ${b}), \\quad C(-${k}, 0), \\qquad AB = BC = \\sqrt{${k * k} + ${b * b}} = ${root(k * k + b * b)}, \\quad AC = ${2 * k}`), show(`\\mathcal{P} = ${s === 1 ? 2 * r + 2 * k : `${2 * k} + ${surd(2 * r, 1, s)}`}`), 'Scriem aria în două moduri:', show(`\\frac{AC \\cdot OB}{2} = \\frac{AB \\cdot d}{2} \\Rightarrow d = \\frac{${2 * k} \\cdot ${b}}{${root(k * k + b * b)}} = ${s === 1 ? q(2 * k * b, r) : surd(2 * k * b, r * s, s)}`)),
    verify: () => near((2 * k * b) / Math.sqrt(k * k + b * b), (2 * k * b * Math.sqrt(s)) / (r * s)),
  }
}

// ---------- 4.3 statistics ----------

const NOTES = [4, 5, 6, 7, 8, 9, 10]
/** p. 52, ex. 1 */
export function stGrades(rng: Rng): Made {
  for (;;) {
    const c = NOTES.map(() => int(rng, 0, 8)), n = c.reduce((s, x) => s + x, 0), sum = c.reduce((s, x, i) => s + x * NOTES[i], 0), top = Math.max(...c)
    if (n < 15 || c.filter((x) => x === top).length > 1 || (sum * 100) % n) continue
    const i = int(rng, 2, 5), m = String(sum / n).replace('.', '{,}')
    return {
      text: lines(`Rezultatele unui test sunt date în diagrama alăturată (numărul elevilor pentru fiecare notă). Suma tuturor notelor este ${sum}.`, `a) Câți elevi au dat testul?`, `b) Care este frecvența notei ${NOTES[i]}?`, 'c) Care sunt media și valoarea modală?'),
      solution: lines(show(`\\text{a) } ${c.join(' + ')} = ${n}`), `b) Nota ${NOTES[i]} are frecvența ${c[i]}.`, show(`\\text{c) } m = \\frac{${sum}}{${n}} = ${m}`), `Valoarea modală este nota cu frecvența cea mai mare: ${NOTES[c.indexOf(top)]}.`),
      fig: barChart(NOTES.map(String), c, 1, { w: 340 }),
      verify: () => near(sum / n, Number(m.replace('{,}', '.'))),
    }
  }
}
/** p. 52, ex. 2 */
export function stTemperatures(rng: Rng): Made {
  const t = range(1, 7).map(() => int(rng, 12, 30)), lim = int(rng, 17, 24), k = t.filter((x) => x > lim).length
  return {
    text: lines(`Temperaturile măsurate în șapte zile ale unei săptămâni sunt, în ordine: ${t.map((x) => `$${x}^\\circ$C`).join(', ')}.`, `a) Aflați amplitudinea temperaturilor.`, `b) Care este probabilitatea ca, alegând o zi la întâmplare, temperatura să fi fost peste $${lim}^\\circ$C?`),
    solution: lines(show(`\\text{a) } ${Math.max(...t)}^\\circ - ${Math.min(...t)}^\\circ = ${Math.max(...t) - Math.min(...t)}^\\circ`), `b) ${k === 1 ? 'O zi din 7 are' : `${k} zile din 7 au`} temperatura peste $${lim}^\\circ$C:`, show(`p = ${q(k, 7)}`)),
    verify: () => k <= 7,
  }
}
/** p. 52, ex. 3 */
export function stPie(rng: Rng): Made {
  for (;;) {
    const p = [5 * int(rng, 2, 7), 5 * int(rng, 2, 7), 5 * int(rng, 1, 5)], r = 100 - p[0] - p[1] - p[2], N = 20 * int(rng, 5, 40)
    if (r < 10 || new Set([...p, r]).size < 4) continue
    const names = ['M', 'P', 'D', 'I'], v = [...p, r], known = (N * v[1]) / 100
    return {
      text: lines(`Răspunsurile la un sondaj sunt date în diagrama alăturată (M — mult, P — puțin, D — deloc, I — indiferent). Știind că ${de(known)} persoane au răspuns „puțin”, aflați:`, 'a) ce procent au răspuns „indiferent”;', 'b) câte persoane au participat la sondaj;', 'c) câte persoane au răspuns „mult”.'),
      solution: lines(show(`\\text{a) } 100\\% - ${p[0]}\\% - ${p[1]}\\% - ${p[2]}\\% = ${r}\\%`), show(`\\text{b) } \\frac{${v[1]}}{100} \\cdot n = ${known} \\Rightarrow n = ${N}`), show(`\\text{c) } \\frac{${v[0]}}{100} \\cdot ${N} = ${(N * v[0]) / 100}`)),
      fig: pieChart(v, names, [`${p[0]}%`, `${p[1]}%`, `${p[2]}%`, '?'], []),
      verify: () => Number.isInteger(known) && Number.isInteger((N * v[0]) / 100),
    }
  }
}
/** p. 52, ex. 4 */
export function stTimes(rng: Rng): Made {
  const t = [23, 24, 25, 26, 27, 28, 29, 30, 31, 32], c = t.map(() => int(rng, 0, 5)), n = c.reduce((s, x) => s + x, 0), lim = int(rng, 5, 8), k = c.slice(0, lim).reduce((s, x) => s + x, 0), top = Math.max(...c)
  const used = t.map((x, i) => [x, c[i]] as const).filter(([, y]) => y > 0), w = (x: number) => `$${Math.floor(x / 10)}{,}${x % 10}$`
  if (n < 10 || k === 0 || c.filter((x) => x === top).length > 1) return stTimes(rng)
  return {
    text: lines(`La o probă de alergare s-au obținut timpii (în minute): ${used.map(([x, y]) => `${w(x)} — ${y === 1 ? 'un elev' : `${de(y)} elevi`}`).join('; ')}.`, `a) Ce procent din elevi au avut un timp mai bun decât ${w(t[lim])} minute? (rotunjiți la întreg)`, 'b) Care este valoarea modală?'),
    solution: lines(show(`\\text{a) } \\frac{${k}}{${n}} \\cdot 100\\% \\approx ${Math.round((k / n) * 100)}\\%`), `b) Cel mai des apare timpul ${w(t[c.indexOf(top)])} minute (${de(top)} elevi).`.replace('(1 elevi)', '(un elev)')),
    verify: () => k <= n,
  }
}
/** A broken line over the hours, with the values named on the axes. */
function trip(y: number[], yl: string): Fig {
  const w = 300, h = 200, o: Pt = [44, 170], ux = 220 / (y.length - 1), top = Math.max(...y), uy = 130 / top, P = (i: number): Pt => [o[0] + i * ux, o[1] - y[i] * uy]
  return {
    w, h, p: {}, axes: { o, x: [30, 288], y: [186, 14] },
    path: [{ d: 'M' + y.map((_, i) => P(i).map((v) => v.toFixed(1)).join(' ')).join(' L') }, ...y.map((_, i) => ({ d: `M${o[0]} ${P(i)[1].toFixed(1)} L${P(i).map((v) => v.toFixed(1)).join(' ')} L${P(i)[0].toFixed(1)} ${o[1]}`, dashed: true })).slice(1)],
    t: [...y.slice(1).map((_, i) => ({ at: [P(i + 1)[0], o[1] + 14] as Pt, s: String(i + 1), size: 11 })), ...asc(y.slice(1)).map((v) => ({ at: [o[0] - 4, o[1] - v * uy + 4] as Pt, s: String(v), size: 11, anchor: 'end' as const })), { at: [270, 196] as Pt, s: 'ore', size: 11 }, { at: [50, 12] as Pt, s: yl, size: 11, anchor: 'start' as const }],
  }
}
/** pp. 53–54, ex. 14–15 */
export function stTrip(rng: Rng): Made {
  for (;;) {
    const d = range(1, 5).map(() => 10 * int(rng, 2, 10)), st = int(rng, 1, 3), top = Math.max(...d)
    d[st] = 0
    if (d.filter((x) => x === Math.max(...d)).length > 1 || Math.max(...d) !== top) continue
    const y = d.reduce((a, x) => [...a, a[a.length - 1] + x], [0]), i = d.indexOf(top)
    if (asc(y).some((v, j, a) => j > 0 && v - a[j - 1] < y[5] / 14)) continue
    return {
      text: lines(`Graficul alăturat arată distanța parcursă (în km) de un vehicul care a făcut în total ${de(y[5])} km în 5 ore.`, 'a) În ce oră a avut viteza cea mai mare și cât a fost ea?', 'b) Cât timp a staționat?', 'c) Care este viteza medie pe întregul drum?'),
      solution: lines(`a) Viteza este cea mai mare unde graficul urcă cel mai abrupt: în ${['prima', 'a doua', 'a treia', 'a patra', 'a cincea'][i]} oră, cu $${top}\\text{ km/h}$.`, `b) O oră: între ora ${st} și ora ${st + 1} distanța nu se schimbă.`, show(`\\text{c) } v_m = \\frac{${y[5]}}{5} = ${y[5] / 5}\\text{ km/h}`)),
      fig: trip(y, 'distanța (km)'),
      verify: () => y[5] === d.reduce((s, x) => s + x, 0),
    }
  }
}
/** p. 52, ex. 5; p. 53, ex. 11–12 */
export function stTwoCars(rng: Rng): Made {
  for (;;) {
    const a = 10 * int(rng, 4, 9), b = 10 * int(rng, 4, 12), t = int(rng, 2, 4), lead = a * t
    if (b <= a) continue
    const meet = lead / (b - a)
    if (!Number.isInteger(meet) || meet > 12) continue
    return {
      text: lines(`Distanțele (în km) parcurse de două automobile după $x$ ore de la plecarea celui de-al doilea sunt date de funcțiile $f(x) = ${a}x + ${lead}$ și $g(x) = ${b}x$, $x \\ge 0$.`, 'a) Care automobil are viteza mai mare?', 'b) Ce avans are primul la plecarea celui de-al doilea?', 'c) După câte ore îl ajunge al doilea pe primul?'),
      solution: lines(`a) Vitezele sunt ${a} km/h și ${b} km/h; al doilea are viteza mai mare.`, `b) $f(0) - g(0) = ${lead}$, deci ${de(lead)} km.`, show(`\\text{c) } ${a}x + ${lead} = ${b}x \\Rightarrow ${b - a}x = ${lead} \\Rightarrow x = ${meet}`), `Îl ajunge după ${meet === 1 ? 'o oră' : `${de(meet)} ore`}.`),
      verify: () => a * meet + lead === b * meet,
    }
  }
}

export const KINDS: Kind8[] = [
  { id: 'viii-functions', label: 'Funcții definite pe mulțimi finite', topic: 'Algebră', forms: { 1: [fnDiagram, fnImage, fnValues, fnTable], 2: [fnDomain, fnEqual, fnOnGraph, fnReadGraph], 3: [fnParameter, fnChain, fnInequality] } },
  { id: 'viii-p-function', joins: 'viii-function', label: '', topic: 'Algebră', forms: { 1: [lfAxes, lfWhich, lfDraw], 2: [lfSpecialPoint, lfParamPoints, lfIntersection, lfCollinear, lfEquation, lfInequality], 3: [lfFunctional, lfTwoLinesArea, lfAreaGiven, lfTangent, lfSymmetric] } },
  { id: 'viii-p-data', joins: 'viii-data', label: '', topic: 'Algebră', forms: { 1: [stGrades, stTemperatures], 2: [stPie, stTimes], 3: [stTrip, stTwoCars] } },
]
