// Grade VIII algebra after the workbook "cu puișorul" photographed by the user on 25 November 2026, pp. 9–25: sets
// (2.1), intervals (2.2–2.3), inequations (2.4), calculations with letters (3.1–3.2), short formulas (3.3).
// Levels by the stars of the book; sections without stars by content. Each form names its page and exercise.
import { de, gcd, int, nonZero, pick, poly, root, rootParts, shuffle, type Rng } from './tex'
import type { Made } from './generators'
import { FLIP, N, R, X, Z, add, asc, at, cf, fr, has, holds, iv, lin, lines, mul, near, q, range, same, setOf, sgn, show, solIv, type Iv, type Kind8, type P } from './alg8'

const REL = ['<', '\\le', '>', '\\ge'] as const

// ---------- 2.1 sets given by a property ----------

/** p. 9, ex. 1 */
export function setBetween(rng: Rng): Made {
  const a = int(rng, 0, 6), b = a + int(rng, 3, 7), c = -int(rng, 1, 6), d = int(rng, 1, 5)
  const A = range(a + 1, b), B = range(c, d - 1)
  return {
    text: `Determinați elementele și cardinalul mulțimilor $A = \\{x \\in ${N} \\mid ${a} < x \\le ${b}\\}$ și $B = \\{x \\in ${Z} \\mid ${c} \\le x < ${d}\\}$.`,
    solution: lines(show(`A = ${setOf(A)}, \\quad \\operatorname{card} A = ${A.length}`), show(`B = ${setOf(B)}, \\quad \\operatorname{card} B = ${B.length}`)),
    verify: () => A.length === b - a && B.length === d - c,
  }
}
/** p. 9, ex. 1–2, 11 */
export function setModulus(rng: Rng): Made {
  const k = int(rng, 2, 9), m = int(rng, 1, 6), s = nonZero(rng, -5, 5)
  const A = range(-k, k), B = range(-m - s, m - s)
  return {
    text: `Enumerați elementele mulțimilor $A = \\{x \\in ${Z} \\mid |x| \\le ${k}\\}$ și $B = \\{x \\in ${Z} \\mid |${lin(s)}| \\le ${m}\\}$.`,
    solution: lines(show(`|x| \\le ${k} \\Leftrightarrow -${k} \\le x \\le ${k} \\Rightarrow A = ${setOf(A)}`), show(`-${m} \\le ${lin(s)} \\le ${m} \\Leftrightarrow ${-m - s} \\le x \\le ${m - s} \\Rightarrow B = ${setOf(B)}`)),
    verify: () => B.every((x) => Math.abs(x + s) <= m),
  }
}
/** p. 9, ex. 5 */
export function setProperty(rng: Rng): Made {
  const k = int(rng, 2, 9), n = int(rng, 4, 6), r = int(rng, 1, k), b = int(rng, 2, 5), e = int(rng, 4, 5)
  const A = range(0, n).map((i) => k * i + r), B = range(0, e).map((i) => b ** i)
  return {
    text: `Scrieți cu ajutorul unei proprietăți caracteristice mulțimile $A = ${setOf(A)}$ și $B = ${setOf(B)}$.`,
    solution: lines(`Elementele lui $A$ cresc din ${k} în ${k}, iar cele ale lui $B$ sunt puteri ale lui ${b}:`, show(`A = \\{x \\mid x = ${k}n + ${r},\\ n \\in ${N},\\ n \\le ${n}\\}`), show(`B = \\{x \\mid x = ${b}^n,\\ n \\in ${N},\\ n \\le ${e}\\}`)),
    verify: () => A.length === n + 1,
  }
}
/** p. 9, ex. 2; p. 10, ex. 20 */
export function setLinear(rng: Rng): Made {
  const a = int(rng, 2, 5), b = nonZero(rng, -9, 9), t = int(rng, 3, 7), c = a * t + b + int(rng, 0, a - 1)
  const k = int(rng, 2, 4), s = nonZero(rng, -5, 5), m = int(rng, 4, 13)
  const A = range(0, t), B = range(Math.floor((-m - s) / k) - 1, Math.ceil((m - s) / k) + 1).filter((x) => Math.abs(k * x + s) < m)
  return {
    text: `Enumerați elementele mulțimilor $A = \\{x \\in ${N} \\mid ${X([a, b])} \\le ${c}\\}$ și $B = \\{x \\in ${Z} \\mid |${X([k, s])}| < ${m}\\}$.`,
    solution: lines(show(`${a}x \\le ${c - b} \\Rightarrow x \\le ${q(c - b, a)} \\Rightarrow A = ${setOf(A)}`), show(`-${m} < ${X([k, s])} < ${m} \\Leftrightarrow ${q(-m - s, k)} < x < ${q(m - s, k)} \\Rightarrow B = ${setOf(B)}`)),
    verify: () => a * t + b <= c && a * (t + 1) + b > c,
  }
}
const divisors = (n: number) => range(1, Math.abs(n)).filter((d) => n % d === 0)
/** p. 10, ex. 18 */
export function setDivisors(rng: Rng): Made {
  const n = pick(rng, [6, 8, 10, 12, 15, 16, 18, 20, 24, 30]), a = int(rng, 1, 4), b = nonZero(rng, -5, 5)
  const A = divisors(n).map((d) => d - a).filter((x) => x >= 0), B = asc(divisors(n).flatMap((d) => [d - b, -d - b]))
  return {
    text: `Determinați elementele mulțimilor $A = \\left\\{x \\in ${N} \\mid ${fr(n, lin(a))} \\in ${N}\\right\\}$ și $B = \\left\\{x \\in ${Z} \\mid ${fr(n, lin(b))} \\in ${Z}\\right\\}$.`,
    solution: lines(`Numitorul trebuie să fie divizor al lui ${n}. Pentru $A$, divizor natural:`, show(`${lin(a)} \\in ${setOf(divisors(n))} \\Rightarrow A = ${setOf(A)}`), `Pentru $B$, divizor întreg:`, show(`${lin(b)} \\in \\{${divisors(n).map((d) => `\\pm ${d}`).join(';\\ ')}\\} \\Rightarrow B = ${setOf(B)}`)),
    verify: () => B.every((x) => n % (x + b) === 0) && A.every((x) => n % (x + a) === 0),
  }
}
/** p. 9, ex. 11–12 */
export function setOperations(rng: Rng): Made {
  const a = int(rng, 2, 5), b = int(rng, 1, 4), c = b + int(rng, 3, 5)
  const A = range(-a, a), B = range(b, c - 1)
  return {
    text: `Fie mulțimile $A = \\{x \\mid x \\in ${Z},\\ |x| \\le ${a}\\}$ și $B = \\{x \\mid x \\in ${N},\\ ${b} \\le x < ${c}\\}$. Calculați $A \\cup B$, $A \\cap B$, $A - B$ și $B - A$.`,
    solution: lines(show(`A = ${setOf(A)}, \\quad B = ${setOf(B)}`), show(`A \\cup B = ${setOf(asc([...A, ...B]))}, \\quad A \\cap B = ${setOf(A.filter((x) => B.includes(x)))}`), show(`A - B = ${setOf(A.filter((x) => !B.includes(x)))}, \\quad B - A = ${setOf(B.filter((x) => !A.includes(x)))}`)),
    verify: () => B.length >= 3,
  }
}
/** p. 10, ex. 13–14 */
export function setRoots(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 30), b = int(rng, 2, 60)
    const [k, m] = rootParts(a), [k2, m2] = rootParts(b)
    if (m === 1 || m2 === 1) continue
    const A = range(-10, 10).filter((x) => x > -Math.sqrt(a) && x < Math.sqrt(b))
    return {
      text: `Determinați elementele mulțimii $A = \\{x \\in ${Z} \\mid -${root(a)} < x \\le ${root(b)}\\}$.`,
      solution: lines(`Încadrăm radicalii între numere întregi consecutive${k > 1 || k2 > 1 ? ` ($${root(a)} = \\sqrt{${a}}$, $${root(b)} = \\sqrt{${b}}$)` : ''}:`, show(`${Math.floor(Math.sqrt(a))} < \\sqrt{${a}} < ${Math.floor(Math.sqrt(a)) + 1}, \\quad ${Math.floor(Math.sqrt(b))} < \\sqrt{${b}} < ${Math.floor(Math.sqrt(b)) + 1}`), show(`A = ${setOf(A)}`)),
      verify: () => A.length === Math.floor(Math.sqrt(a)) + Math.floor(Math.sqrt(b)) + 1,
    }
  }
}
/** p. 10, ex. 19 */
export function setQuotient(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 4), c = nonZero(rng, -5, 5), r = pick(rng, [2, 3, 4, 5, 6, 7, 9, 10, 11, -3, -4, -5, -6, -7]), b = a * c + r
    if (b === 0) continue
    const A = asc(divisors(r).flatMap((d) => [d - c, -d - c]))
    return {
      text: `Determinați elementele mulțimii $A = \\left\\{x \\in ${Z} \\mid ${fr(X([a, b]), lin(c))} \\in ${Z}\\right\\}$.`,
      solution: lines('Scoatem întregii din fracție:', show(`${fr(X([a, b]), lin(c))} = ${fr(`${a}(${lin(c)})${sgn(r)}`, lin(c))} = ${a} ${r < 0 ? '-' : '+'} ${fr(Math.abs(r), lin(c))}`), `Fracția este număr întreg dacă $${lin(c)}$ divide pe ${Math.abs(r)}:`, show(`${lin(c)} \\in \\{${divisors(r).map((d) => `\\pm ${d}`).join(';\\ ')}\\} \\Rightarrow A = ${setOf(A)}`)),
      verify: () => A.every((x) => Number.isInteger((a * x + b) / (x + c))),
    }
  }
}
/** p. 10, ex. 22 */
export function setCardinal(rng: Rng): Made {
  const b = pick(rng, [2, 3, 5]), e = int(rng, 2, b === 2 ? 12 : 5), f = e + int(rng, 1, 3), c = pick(rng, [2, 3, 10].filter((t) => t !== b)), g = int(rng, 2, 4), h = g + int(rng, 1, 2)
  return {
    text: `Precizați cardinalul mulțimilor: a) $A = \\{x \\in ${N} \\mid ${b}^{${e}} < x < ${b}^{${f}}\\}$; b) $B = \\{x \\in ${N} \\mid ${c}^{${g}} \\le x \\le ${c}^{${h}}\\}$.`,
    solution: lines('Numărul numerelor naturale dintre două numere, fără capete, este diferența lor minus 1; cu ambele capete, diferența plus 1.', show(`\\operatorname{card} A = ${b}^{${e}}(${b}^{${f - e}} - 1) - 1 = ${b ** f - b ** e - 1}`), show(`\\operatorname{card} B = ${c}^{${g}}(${c}^{${h - g}} - 1) + 1 = ${c ** h - c ** g + 1}`)),
    verify: () => f > e && h > g,
  }
}
/** p. 10, ex. 17 */
export function setDigitProduct(rng: Rng): Made {
  const n = pick(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 27, 28, 30, 32, 35, 36, 40, 42, 45, 48])
  const sumDiv = pick(rng, [2, 3, 4, 5, 9]), list = range(100, 999).filter((v) => Math.floor(v / 100) * (Math.floor(v / 10) % 10) * (v % 10) === n)
  const ok = list.filter((v) => v % sumDiv === 0)
  return {
    text: `Fie mulțimea $A = \\{\\overline{abc} \\mid a \\cdot b \\cdot c = ${n}\\}$. a) Aflați cardinalul mulțimii $A$. b) Calculați probabilitatea ca, alegând un element din $A$, acesta să se dividă cu ${sumDiv}.`,
    solution: lines(`a) Scriem pe ${n} ca produs de trei cifre, în toate ordinele:`, show(`A = \\{${list.join(';\\ ')}\\}`).replace(/;\\ /g, ';\\allowbreak\\ '), show(`\\operatorname{card} A = ${list.length}`), `b) ${ok.length === 0 ? 'Niciun element nu se divide' : ok.length === 1 ? 'Un singur element se divide' : `${de(ok.length)} elemente se divid`} cu ${sumDiv}, deci:`, show(`p = ${fr(ok.length, list.length)}${q(ok.length, list.length) !== fr(ok.length, list.length) ? ` = ${q(ok.length, list.length)}` : ''}`)),
    verify: () => list.length > 0,
  }
}
/** p. 10, ex. 16 */
export function setTwoDigits(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 9), r = int(rng, 0, 8), lim = int(rng, 30, 99), list = range(10, 99).filter((v) => Math.floor(v / 10) + (v % 10) > r && Math.floor(v / (Math.floor(v / 10) + (v % 10))) === k && v % (Math.floor(v / 10) + (v % 10)) === r && v <= lim)
    if (!list.length || list.length > 9) continue
    return {
      text: `Determinați elementele mulțimii $A = \\{\\overline{ab} \\mid \\overline{ab} : (a + b) = ${k}${r ? ` \\text{ rest } ${r}` : ''},\\ \\overline{ab} \\le ${lim}\\}$.`,
      solution: lines('Din teorema împărțirii cu rest:', show(`10a + b = ${k}(a + b)${sgn(r)}${r ? `, \\quad a + b > ${r}` : ''} \\Rightarrow ${poly([[10 - k, 'a']])} = ${X([k - 1, r], 'b')}`), 'Dăm valori cifrei $a$, de la 1 la 9, și păstrăm valorile pentru care $b$ este cifră:', show(`A = ${setOf(list)}`)),
      verify: () => list.every((v) => (10 - k) * Math.floor(v / 10) === (k - 1) * (v % 10) + r),
    }
  }
}

// ---------- 2.2–2.3 intervals ----------

const ivOf = (rng: Rng, lo = -7, hi = 7): Iv => { const a = int(rng, lo, hi - 2); return { a, b: a + int(rng, 2, 6), l: rng() < 0.5, r: rng() < 0.5 } }
const inter = (u: Iv, v: Iv): Iv => {
  const a = Math.max(u.a, v.a), b = Math.min(u.b, v.b)
  return { a, b, l: has(u, a) && has(v, a), r: has(u, b) && has(v, b) }
}
const join = (u: Iv, v: Iv): Iv => {
  const a = Math.min(u.a, v.a), b = Math.max(u.b, v.b)
  return { a, b, l: has(u, a) || has(v, a), r: has(u, b) || has(v, b) }
}
/** u overlaps v from the left, and neither contains the other. */
function overlap(rng: Rng): [Iv, Iv] {
  const a = int(rng, -8, 2), c = a + int(rng, 2, 4), b = c + int(rng, 1, 4), d = b + int(rng, 1, 5)
  return [{ a, b, l: rng() < 0.5, r: rng() < 0.5 }, { a: c, b: d, l: rng() < 0.5, r: rng() < 0.5 }]
}
/** p. 11, ex. 1–2 */
export function ivTruth(rng: Rng): Made {
  const I = ivOf(rng), J = ivOf(rng, 1, 8), n = int(rng, 2, 70), x = pick(rng, [I.a, I.b, I.a + 1, I.b + 1]), f = [int(rng, 1, 30), int(rng, 2, 7)]
  const A = has(I, x), B = has(J, Math.sqrt(n)), C = has(J, f[0] / f[1])
  return {
    text: lines('Stabiliți valoarea de adevăr a propozițiilor:', `a) $${x} \\in ${iv(I)}$`, `b) $${root(n)} \\in ${iv(J)}$`, `c) $${q(f[0], f[1])} \\in ${iv(J)}$`),
    solution: lines(`a) ${A ? 'Adevărat' : 'Fals'}${x === I.a || x === I.b ? ': este chiar un capăt al intervalului' + (A ? ', care îi aparține' : ', care nu îi aparține') : ''}.`, `b) ${B ? 'Adevărat' : 'Fals'}: $${J.a} = \\sqrt{${J.a ** 2}}$, $${J.b} = \\sqrt{${J.b ** 2}}$, iar numărul este $\\sqrt{${n}}$.`, `c) ${C ? 'Adevărat' : 'Fals'}: $${J.a} = ${fr(J.a * f[1], f[1])}$, $${J.b} = ${fr(J.b * f[1], f[1])}$, iar numărul este $${fr(f[0], f[1])}$.`),
    verify: () => J.a >= 1 && B === (n > J.a ** 2 && n < J.b ** 2 || (J.l && n === J.a ** 2) || (J.r && n === J.b ** 2)),
  }
}
/** p. 11, ex. 5, 8 */
export function ivWrite(rng: Rng): Made {
  const a = int(rng, -9, 5), b = a + int(rng, 2, 9), c = int(rng, -8, 8), d = int(rng, 1, 9), strict = rng() < 0.5
  return {
    text: lines('Scrieți sub formă de interval mulțimile:', `a) $\\{x \\in ${R} \\mid ${a} \\le x < ${b}\\}$`, `b) $\\{x \\in ${R} \\mid x ${strict ? '>' : '\\le'} ${c}\\}$`, `c) $\\{x \\in ${R} \\mid |x| \\le ${d}\\}$`),
    solution: lines(show(`\\text{a) } [${a}, ${b})`), show(`\\text{b) } ${solIv(strict ? '>' : '\\le', String(c))}`), show(`\\text{c) } |x| \\le ${d} \\Leftrightarrow -${d} \\le x \\le ${d}, \\quad [-${d}, ${d}]`)),
    verify: () => a < b,
  }
}
/** p. 11, ex. 6–7 */
export function ivIntegers(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 60), b = int(rng, 2, 60)
    if (rootParts(a)[1] === 1 || rootParts(b)[1] === 1) continue
    const u = Math.floor(Math.sqrt(a)), v = Math.floor(Math.sqrt(b))
    return {
      text: `Aflați cel mai mic și cel mai mare număr întreg din intervalul $(-${root(a)}, ${root(b)})$ și numărul numerelor întregi din interval.`,
      solution: lines(show(`-${u + 1} < -\\sqrt{${a}} < -${u}, \\quad ${v} < \\sqrt{${b}} < ${v + 1}`), `Cel mai mic este $-${u}$, cel mai mare este $${v}$, iar în interval sunt $${u} + ${v} + 1 = ${u + v + 1}$ numere întregi.`),
      verify: () => u * u < a && a < (u + 1) ** 2 && v * v < b && b < (v + 1) ** 2,
    }
  }
}
/** p. 12, ex. 1, 5 */
export function ivUnionInter(rng: Rng): Made {
  const [A, B] = overlap(rng)
  return {
    text: `Calculați $A \\cup B$ și $A \\cap B$, unde $A = ${iv(A)}$ și $B = ${iv(B)}$.`,
    solution: lines('Reprezentăm intervalele pe axa numerelor:', show(`A \\cup B = ${iv(join(A, B))}, \\qquad A \\cap B = ${iv(inter(A, B))}`)),
    verify: () => [A.a, A.b, B.a, B.b].every((x) => has(inter(A, B), x) === (has(A, x) && has(B, x)) && has(join(A, B), x) === (has(A, x) || has(B, x))),
  }
}
/** p. 12, ex. 1; p. 13, ex. 9 */
export function ivWithSet(rng: Rng): Made {
  const I = ivOf(rng, -6, 4), S = asc(shuffle(rng, range(I.a - 2, I.b + 2).filter((x) => x !== I.a && x !== I.b)).slice(0, 4)), In = S.filter((x) => has(I, x)), Zs = range(I.a, I.b).filter((x) => has(I, x))
  return {
    text: `Fie $A = ${iv(I)}$ și $B = ${setOf(S)}$. Determinați $A \\cap B$, $B - A$ și $A \\cap ${Z}$.`,
    solution: lines(show(`A \\cap B = ${setOf(In)}, \\qquad B - A = ${setOf(S.filter((x) => !has(I, x)))}`), show(`A \\cap ${Z} = ${setOf(Zs)}`)),
    verify: () => Zs.length >= 1,
  }
}
/** p. 12, ex. 10, 13 a */
export function ivDouble(rng: Rng): Made {
  const k = int(rng, 2, 5), b = nonZero(rng, -7, 7), u = int(rng, -5, 1), v = u + int(rng, 2, 6)
  return {
    text: `Scrieți sub formă de interval mulțimea $A = \\{x \\in ${R} \\mid ${k * u + b} \\le ${X([k, b])} < ${k * v + b}\\}$.`,
    solution: lines(`Scădem ${b} din toți membrii, apoi împărțim la ${k}:`.replace('Scădem -', 'Adunăm ').replace(' din toți', b < 0 ? ' la toți' : ' din toți'), show(`${k * u} \\le ${k}x < ${k * v} \\Leftrightarrow ${u} \\le x < ${v} \\Rightarrow A = [${u}, ${v})`)),
    verify: () => u < v,
  }
}
/** p. 12, ex. 13 d–f */
export function ivModulus(rng: Rng): Made {
  const k = int(rng, 2, 5), u = int(rng, -6, 3), v = u + 2 * int(rng, 1, 5), s = (k * (u + v)) / 2, m = (k * (v - u)) / 2, ge = rng() < 0.4
  return {
    text: `Scrieți cu ajutorul intervalelor mulțimea $A = \\{x \\in ${R} \\mid |${X([k, -s])}| ${ge ? '\\ge' : '\\le'} ${m}\\}$.`,
    solution: ge
      ? lines(show(`${X([k, -s])} \\le -${m} \\text{ sau } ${X([k, -s])} \\ge ${m} \\Leftrightarrow x \\le ${u} \\text{ sau } x \\ge ${v}`), show(`A = (-\\infty, ${u}] \\cup [${v}, +\\infty)`))
      : lines(show(`-${m} \\le ${X([k, -s])} \\le ${m} \\Leftrightarrow ${s - m} \\le ${k}x \\le ${s + m} \\Leftrightarrow ${u} \\le x \\le ${v}`), show(`A = [${u}, ${v}]`)),
    verify: () => Math.abs(k * u - s) === m && Math.abs(k * v - s) === m,
  }
}
/** p. 13, ex. 14 */
export function ivSetsOps(rng: Rng): Made {
  const a = int(rng, 2, 8), c = nonZero(rng, -4, 4), u = int(rng, -a + 1, a - 1), A: Iv = { a: -a, b: a, l: true, r: true }, B: Iv = { a: u, b: Infinity, l: false, r: false }
  return {
    text: `Fie $A = \\{x \\in ${R} \\mid |x| \\le ${a}\\}$ și $B = \\{x \\in ${R} \\mid ${lin(c)} > ${u + c}\\}$. Calculați $A \\cup B$, $A \\cap B$ și $A - B$.`,
    solution: lines(show(`A = ${iv(A)}, \\quad B = ${iv(B)}`), show(`A \\cup B = ${iv(join(A, B))}, \\quad A \\cap B = ${iv(inter(A, B))}, \\quad A - B = [${-a}, ${u}]`)),
    verify: () => u > -a && u < a,
  }
}
/** p. 12, ex. 2–4 */
export function ivFindAB(rng: Rng): Made {
  const [A, B] = overlap(rng), U = join(A, B), I = inter(A, B), un = rng() < 0.5
  return {
    text: un
      ? `Aflați numerele reale $a$ și $b$, știind că $${A.l ? '[' : '('}a, ${A.b}${A.r ? ']' : ')'} \\cup ${B.l ? '[' : '('}${B.a}, b${B.r ? ']' : ')'} = ${iv(U)}$.`
      : `Aflați numerele reale $a$ și $b$, știind că $${A.l ? '[' : '('}${A.a}, b${A.r ? ']' : ')'} \\cap ${B.l ? '[' : '('}a, ${B.b}${B.r ? ']' : ')'} = ${iv(I)}$.`,
    solution: un
      ? lines(`Intervalele au puncte comune ($${B.a} < ${A.b}$), deci reuniunea începe la capătul din stânga al primului și se termină la capătul din dreapta al celui de-al doilea:`, show(`a = ${A.a}, \\quad b = ${B.b}`))
      : lines('Intersecția începe la capătul din stânga al celui de-al doilea interval și se termină la capătul din dreapta al primului:', show(`a = ${B.a}, \\quad b = ${A.b}`)),
    verify: () => U.a === A.a && U.b === B.b && I.a === B.a && I.b === A.b,
  }
}
/** p. 12, ex. 9 */
export function ivPowers(rng: Rng): Made {
  const b = int(rng, 2, 5), k = int(rng, 2, 3), num = range(1, k).reduce((s, i) => s + b ** (k - i), 0), den = b ** k, c = int(rng, 0, 1), d = int(rng, 1, 7), hi = [c * d + int(rng, 1, d), d]
  const t = num / den, good = t > c && t < hi[0] / hi[1]
  return {
    text: `Stabiliți dacă numărul $n = ${range(1, k).map((i) => `${b}^{-${i}}`).join(' + ')}$ aparține intervalului $\\left(${c}, ${q(hi[0], hi[1])}\\right)$.`,
    solution: lines(show(`n = ${range(1, k).map((i) => fr(1, b ** i)).join(' + ')} = ${q(num, den)}`), `${good ? 'Numărul aparține' : 'Numărul nu aparține'} intervalului: $${q(num, den)} ${t > c ? '>' : '<'} ${c}$, iar $${q(num, den)} ${near(t, hi[0] / hi[1]) ? '=' : t < hi[0] / hi[1] ? '<' : '>'} ${q(hi[0], hi[1])}$.`),
    verify: () => t !== c,
  }
}
/** p. 12, ex. 15–16 (2.2) */
export function ivProve(rng: Rng): Made {
  const m = int(rng, -4, 5), n = m + int(rng, 1, 7)
  return {
    text: lines(`Dacă $a, b \\in (${m}, ${n})$, arătați că:`, `a) $|a - b| < ${n - m}$`, `b) $${poly([[1, 'ab'], [-n, 'a'], [-m, 'b'], [m * n, '']])} < 0$`),
    solution: lines(`a) Din $${m} < a < ${n}$ și $${-n} < -b < ${-m}$, prin adunare, $-${n - m} < a - b < ${n - m}$, deci $|a - b| < ${n - m}$.`, 'b) Grupăm termenii:', show(`${poly([[1, 'ab'], [-n, 'a'], [-m, 'b'], [m * n, '']])} = (a${sgn(-m)})(b${sgn(-n)})`), `Cum $a > ${m}$, primul factor este pozitiv, iar cum $b < ${n}$, al doilea este negativ; produsul este negativ.`),
    verify: () => m < n,
  }
}
/** p. 13, ex. 15 b */
export function ivCard(rng: Rng): Made {
  const p = int(rng, 1, 4), s = int(rng, 1, 4), x = nonZero(rng, -5, 5), c = nonZero(rng, -6, 6), r = (p + s) * x + c
  return {
    text: `Aflați numărul real $x$ pentru care $\\operatorname{card}\\left((-\\infty, ${X([p, c])}] \\cap [${X([-s, r])}, +\\infty)\\right) = 1$.`,
    solution: lines('Intersecția are un singur element doar dacă cele două capete sunt egale:', show(`${X([p, c])} = ${X([-s, r])} \\Rightarrow ${X([p + s, 0])} = ${r - c} \\Rightarrow x = ${x}`)),
    verify: () => p * x + c === -s * x + r,
  }
}
/** p. 13, ex. 15 a */
export function ivDisjoint(rng: Rng): Made {
  const p = int(rng, 1, 4), b = int(rng, 1, 4), x0 = int(rng, -6, 6), c = nonZero(rng, -6, 6), a = (p + b) * x0 + c
  return {
    text: `Determinați valorile reale ale lui $x$ pentru care $(-\\infty, ${poly([[a, ''], [-p, 'x']])}) \\cap (${X([b, c])}, +\\infty) = \\varnothing$.`,
    solution: lines('Intersecția este vidă dacă primul interval se termină înainte de începutul celui de-al doilea (sau exact acolo):', show(`${poly([[a, ''], [-p, 'x']])} \\le ${X([b, c])} \\Leftrightarrow ${-(p + b)}x \\le ${c - a} \\Leftrightarrow x \\ge ${x0}, \\quad x \\in [${x0}, +\\infty)`)),
    verify: () => a - p * x0 === b * x0 + c,
  }
}

// ---------- 2.4 inequations ----------

/** p. 14, ex. 1 */
export function ineqWhich(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6), b = nonZero(rng, -6, 6), c = nonZero(rng, -5, 5), d = nonZero(rng, -9, 9), rel = pick(rng, REL)
    if (a === c) continue
    const S = asc(shuffle(rng, range(-6, 6)).slice(0, 5)), ok = S.filter((x) => holds(rel, a * x + b, c * x + d))
    if (!ok.length || ok.length === S.length) continue
    return {
      text: `Care dintre elementele mulțimii $${setOf(S)}$ sunt soluții ale inecuației $${X([a, b])} ${rel} ${X([c, d])}$?`,
      solution: lines('Înlocuim pe rând $x$ în inecuație:', ...S.map((x) => `- pentru $x = ${x}$: $${a * x + b} ${rel} ${c * x + d}$, ${holds(rel, a * x + b, c * x + d) ? 'adevărat' : 'fals'};`), `Soluțiile sunt $${setOf(ok)}$.`),
      verify: () => ok.length > 0,
    }
  }
}
/** p. 14, ex. 4–5, 11 */
export function ineqFractions(rng: Rng): Made {
  for (;;) {
    const [m, n] = pick(rng, [[2, 3], [2, 5], [3, 4], [3, 5], [4, 6], [2, 4]]), a = nonZero(rng, -7, 7), b = nonZero(rng, -7, 7), e = int(rng, -3, 4)
    const L = (m * n) / gcd(m, n), k = L / m - L / n, rhs = L * e - (L / m) * a + (L / n) * b
    if (k <= 0) continue
    const t = Math.floor(rhs / k)
    if (t < 0 || t > 9) continue
    return {
      text: `Rezolvați în $${N}$ inecuația $${fr(lin(a), m)} - ${fr(lin(b), n)} \\le ${e}$.`,
      solution: lines(`Înmulțim cu ${L}, numitorul comun:`, show(`${cf(L / m)}(${lin(a)}) - ${cf(L / n)}(${lin(b)}) \\le ${L * e} \\Rightarrow ${cf(k)}x \\le ${rhs}${k > 1 ? ` \\Rightarrow x \\le ${q(rhs, k)}` : ''}`), show(`S = ${setOf(range(0, t))}`)),
      verify: () => (t + a) / m - (t + b) / n <= e + 1e-9 && (t + 1 + a) / m - (t + 1 + b) / n > e,
    }
  }
}
/** p. 14, ex. 3 */
export function ineqSquaresCancel(rng: Rng): Made {
  for (;;) {
    const a = nonZero(rng, -6, 6), b = nonZero(rng, -6, 6), c = nonZero(rng, -5, 5), k = int(rng, 2, 4), x0 = int(rng, -6, 6)
    const m = k * a - b - k * c
    if (m === 0) continue
    const d = m * x0, rel = pick(rng, REL), f = m < 0 ? FLIP[rel] : rel
    // kx(x + a) − bx ? kx(x + c) + d
    return {
      text: `Rezolvați în $${R}$ inecuația $${k}x(${lin(a)}) ${poly([[-b, 'x']]).replace(/^-/, '- ').replace(/^(?!-)/, '+ ')} ${rel} ${k}x(${lin(c)})${sgn(d)}$.`,
      solution: lines('Desfacem parantezele; termenii cu $x^2$ se reduc:', show(`${X([k, k * a - b, 0])} ${rel} ${X([k, k * c, d])} \\Rightarrow ${X([m, 0])} ${rel} ${d}`), m < 0 ? 'Împărțim la un număr negativ, deci sensul se schimbă:' : '', show(`x ${f} ${x0} \\Rightarrow S = ${solIv(f, String(x0))}`)),
      verify: () => same((x) => k * x * (x + a) - b * x - k * x * (x + c) - d, (x) => m * x - d),
    }
  }
}
/** p. 14, ex. 4 d–f */
export function ineqRadical(rng: Rng): Made {
  const m = pick(rng, [2, 3, 5, 6, 7]), k = int(rng, 2, 5), j = nonZero(rng, -5, 5), x0 = int(rng, -5, 7)
  const c = (k - 1) * x0 + j
  if (c === 0) return ineqRadical(rng)
  return {
    text: `Rezolvați în $${R}$ inecuația $${k}x\\sqrt{${m}} ${j < 0 ? '-' : '+'} ${root(j * j * m)} \\ge x\\sqrt{${m}} ${c < 0 ? '-' : '+'} ${c === 0 ? '0' : root(c * c * m)}$.`,
    solution: lines(show(`${cf(k - 1)}x\\sqrt{${m}} \\ge ${poly([[c, `\\sqrt{${m}}`], [-j, `\\sqrt{${m}}`]])} = ${c - j === 0 ? '0' : poly([[c - j, `\\sqrt{${m}}`]])}`), `Împărțim la $${cf(k - 1)}\\sqrt{${m}} > 0$:`, show(`x \\ge ${x0} \\Rightarrow S = [${x0}, +\\infty)`)),
    verify: () => k * x0 + j === x0 + c,
  }
}
/** p. 14, ex. 6–7 */
export function ineqModZ(rng: Rng): Made {
  const k = int(rng, 2, 4), s = nonZero(rng, -7, 7), m = int(rng, 4, 15), L = Math.ceil((-m - s) / k), H = Math.floor((m - s) / k)
  return {
    text: `Rezolvați în $${Z}$ inecuația $|${X([k, s])}| \\le ${m}$.`,
    solution: lines(show(`-${m} \\le ${X([k, s])} \\le ${m} \\Leftrightarrow ${-m - s} \\le ${k}x \\le ${m - s} \\Leftrightarrow ${q(-m - s, k)} \\le x \\le ${q(m - s, k)}`), show(`S = ${setOf(range(L, H))}`)),
    verify: () => range(-40, 40).filter((x) => Math.abs(k * x + s) <= m).length === Math.max(0, H - L + 1),
  }
}
/** p. 15, ex. 12 */
export function ineqSign(rng: Rng): Made {
  const n = nonZero(rng, -9, 9), a = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]), b = nonZero(rng, -9, 9), pos = rng() < 0.5
  const wantPos = n > 0 === pos, f = wantPos === a > 0 ? '>' : '<'
  return {
    text: `Rezolvați în $${R}$ inecuația $${fr(n, X([a, b]))} ${pos ? '>' : '<'} 0$.`,
    solution: lines(`Numărătorul este ${n > 0 ? 'pozitiv' : 'negativ'}, deci fracția este ${pos ? 'pozitivă' : 'negativă'} dacă numitorul este ${wantPos ? 'pozitiv' : 'negativ'}:`, show(`${X([a, b])} ${wantPos ? '>' : '<'} 0 \\Leftrightarrow ${X([a, 0])} ${wantPos ? '>' : '<'} ${-b} \\Leftrightarrow x ${f} ${q(-b, a)}, \\quad S = ${solIv(f, q(-b, a))}`)),
    verify: () => [-50, 50].every((x) => holds(f, x, -b / a) === (n / (a * x + b) > 0 === pos)),
  }
}
/** p. 15, ex. 13 */
export function ineqDomain(rng: Rng): Made {
  const a = pick(rng, [-5, -4, -3, -2, 2, 3, 4, 5]), b = nonZero(rng, -9, 9), c = pick(rng, [-3, -2, -1, 1, 2, 3]), d = nonZero(rng, -9, 9), n = int(rng, 2, 9)
  const f = a > 0 ? '\\ge' : '\\le', g = c > 0 ? '>' : '<'
  return {
    text: `Aflați mulțimea numerelor reale $x$ pentru care este definită expresia: a) $\\sqrt{${X([a, b])}}$; b) $${fr(n, `\\sqrt{${X([c, d])}}`)}$.`,
    solution: lines('a) Numărul de sub radical trebuie să fie cel puțin 0:', show(`${X([a, b])} \\ge 0 \\Leftrightarrow x ${f} ${q(-b, a)}, \\quad x \\in ${solIv(f, q(-b, a))}`), 'b) Radicalul este la numitor, deci nu poate fi 0:', show(`${X([c, d])} > 0 \\Leftrightarrow x ${g} ${q(-d, c)}, \\quad x \\in ${solIv(g, q(-d, c))}`)),
    verify: () => holds(f, 30 * Math.sign(a), -b / a),
  }
}
/** p. 15, ex. 16 */
export function ineqParameter(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 1, 3), r = p + int(rng, 1, 3), s = nonZero(rng, -6, 6), c = int(rng, 1, 12)
    const k = r - p // x(km + s) = c
    return {
      text: `Aflați numerele reale $m$ pentru care ecuația $${cf(p)}mx + ${c} = x(${X([r, s], 'm')})$ are soluția pozitivă.`,
      solution: lines(show(`x(${X([r, s], 'm')}) - ${cf(p)}mx = ${c} \\Leftrightarrow x(${X([k, s], 'm')}) = ${c}`), `Dacă $${X([k, s], 'm')} = 0$, ecuația nu are soluții. Altfel $x = ${fr(c, X([k, s], 'm'))}$, pozitiv dacă numitorul este pozitiv:`, show(`${X([k, s], 'm')} > 0 \\Leftrightarrow m > ${q(-s, k)}, \\quad m \\in \\left(${q(-s, k)}, +\\infty\\right)`)),
      verify: () => k > 0,
    }
  }
}
/** p. 15, ex. 18 */
export function ineqOverModulus(rng: Rng): Made {
  for (;;) {
    const a = pick(rng, [-4, -3, -2, 2, 3, 4]), x0 = int(rng, -5, 5), c = nonZero(rng, -5, 5)
    if (x0 === -c) continue
    const pos = rng() < 0.5, f = pos === a > 0 ? '\\ge' : '\\le', inS = holds(f, -c, x0)
    const S = f === '\\ge' ? (inS ? `[${x0}, ${-c}) \\cup (${-c}, +\\infty)` : `[${x0}, +\\infty)`) : inS ? `(-\\infty, ${-c}) \\cup (${-c}, ${x0}]` : `(-\\infty, ${x0}]`
    return {
      text: `Rezolvați în $${R}$ inecuația $${fr(X([a, -a * x0]), `|${lin(c)}|`)} ${pos ? '\\ge' : '\\le'} 0$.`,
      solution: lines(`Condiție: $x \\ne ${-c}$. Atunci $|${lin(c)}| > 0$, deci semnul fracției este semnul numărătorului:`, show(`${X([a, -a * x0])} ${pos ? '\\ge' : '\\le'} 0 \\Leftrightarrow x ${f} ${x0}`), inS ? `Scoatem din soluții pe $${-c}$:` : `Numărul $${-c}$ nu este printre aceste valori:`, show(`S = ${S}`)),
      verify: () => holds(f, x0, x0),
    }
  }
}
/** p. 15, ex. 10, 17 */
export function ineqTwoSets(rng: Rng): Made {
  const u = int(rng, -5, 1), v = u + int(rng, 2, 5), k = int(rng, 2, 4), b = nonZero(rng, -6, 6), w = int(rng, u + 1, v), c = nonZero(rng, -5, 5)
  if (c + w === 0) return ineqTwoSets(rng)
  return {
    text: `Fie $A = \\{x \\in ${R} \\mid ${k * u + b} < ${X([k, b])} \\le ${k * v + b}\\}$ și $B = \\{x \\in ${Z} \\mid ${X([2, c])} \\le x ${c + w < 0 ? '-' : '+'} ${Math.abs(c + w)}\\}$. Determinați $A \\cap B$.`,
    solution: lines(show(`${k * u} < ${k}x \\le ${k * v} \\Rightarrow A = (${u}, ${v}]`), show(`${X([2, c])} \\le x${sgn(c + w)} \\Rightarrow x \\le ${w}, \\quad B = \\{\\ldots;\\ ${w - 1};\\ ${w}\\}`), show(`A \\cap B = ${setOf(range(u + 1, w))}`)),
    verify: () => w <= v && w > u,
  }
}

// ---------- 3.1–3.2 calculations with letters ----------

/** p. 18, ex. 2–3 */
export function likeTerms(rng: Rng): Made {
  const c = Array.from({ length: 6 }, () => nonZero(rng, -9, 9)), v = pick(rng, [['x', 'y'], ['a', 'b'], ['x^2', 'x'], ['ab', 'a']])
  const t: [number, string][] = c.map((n, i) => [n, v[i % 2]])
  const s = [c[0] + c[2] + c[4], c[1] + c[3] + c[5]]
  return {
    text: `Reduceți termenii asemenea: $${poly(t)}$.`,
    solution: lines('Grupăm termenii cu aceeași parte literală:', show(`(${poly(t.filter((_, i) => i % 2 === 0))}) + (${poly(t.filter((_, i) => i % 2 === 1))}) = ${poly([[s[0], v[0]], [s[1], v[1]]])}`)),
    verify: () => s[0] === c[0] + c[2] + c[4],
  }
}
/** p. 18, ex. 1 */
export function bracketsMinus(rng: Rng): Made {
  const k = int(rng, 2, 5), m = int(rng, 2, 5), A = [nonZero(rng, -4, 4), nonZero(rng, -6, 6), nonZero(rng, -6, 6)], B = [nonZero(rng, -4, 4), nonZero(rng, -6, 6), nonZero(rng, -6, 6)]
  const kA = A.map((x) => k * x), mB = B.map((x) => m * x), r = add(kA, mB, -1)
  return {
    text: `Efectuați: $${k}(${X(A)}) - ${m}(${X(B)})$.`,
    solution: lines('Desfacem parantezele și reducem termenii asemenea:', show(`${X(kA)} ${X(mB.map((x) => -x)).replace(/^-/, '- ').replace(/^(?!-)/, '+ ')} = ${X(r)}`)),
    verify: () => same((x) => k * at(A, x) - m * at(B, x), (x) => at(r, x)),
  }
}
const mono = (c: number, e: number[], v = ['x', 'y']) => poly([[c, e.map((n, i) => (n === 0 ? '' : n === 1 ? v[i] : `${v[i]}^${n}`)).join('')]])
/** p. 19, ex. 1 */
export function monoProduct(rng: Rng): Made {
  const [a, b] = [nonZero(rng, -7, 7), -int(rng, 2, 7)], e = [int(rng, 1, 4), int(rng, 0, 3)], f = [int(rng, 1, 4), int(rng, 1, 3)]
  return {
    text: `Calculați: $${mono(a, e)} \\cdot (${mono(b, f)})$.`,
    solution: lines('Înmulțim coeficienții între ei, iar la puterile cu aceeași bază adunăm exponenții:', show(`${mono(a, e)} \\cdot (${mono(b, f)}) = ${mono(a * b, [e[0] + f[0], e[1] + f[1]])}`)),
    verify: () => a * b !== 0,
  }
}
/** p. 19, ex. 2–3 */
export function monoPower(rng: Rng): Made {
  const a = int(rng, 2, 5), n = int(rng, 2, 3), e = int(rng, 1, 3), d = pick(rng, range(2, a ** n).filter((t) => a ** n % t === 0)), f = int(rng, 1, e * n)
  return {
    text: `Calculați: $(${mono(a, [e])})^${n} : (${mono(d, [f])})$, unde $x \\ne 0$.`,
    solution: show(`(${mono(a, [e])})^${n} : (${mono(d, [f])}) = ${mono(a ** n, [e * n])} : (${mono(d, [f])}) = ${mono(a ** n / d, [e * n - f])}`),
    verify: () => Number.isInteger(a ** n / d),
  }
}
/** p. 19, ex. 4–6 */
export function distribute(rng: Rng): Made {
  const a = int(rng, 2, 6), b = [nonZero(rng, -5, 5), nonZero(rng, -7, 7)], c = int(rng, 2, 6), d = [nonZero(rng, -5, 5), nonZero(rng, -7, 7)]
  const u = [a * b[0], a * b[1], 0], w = [c * d[0], c * d[1], 0], r = add(u, w, -1)
  return {
    text: `Calculați: $${a}x(${X(b)}) - ${c}x(${X(d)})$.`,
    solution: show(`${X(u)} ${X(w.map((x) => -x)).replace(/^-/, '- ').replace(/^(?!-)/, '+ ')} = ${X(r)}`),
    verify: () => same((x) => a * x * at(b, x) - c * x * at(d, x), (x) => at(r, x)),
  }
}
/** p. 19, ex. 2 e–k */
export function polyByMono(rng: Rng): Made {
  const k = pick(rng, [-5, -4, -3, -2, 2, 3, 4, 5]), Q = [nonZero(rng, -5, 5), nonZero(rng, -6, 6), nonZero(rng, -6, 6)], e = int(rng, 1, 2)
  const Pp: P = [...Q.map((c) => c * k), ...Array.from({ length: e }, () => 0)]
  return {
    text: `Efectuați împărțirea: $(${X(Pp)}) : (${X([k, ...Array.from({ length: e }, () => 0)])})$, unde $x \\ne 0$.`,
    solution: lines('Împărțim fiecare termen:', show(X(Q))),
    verify: () => same((x) => at(Pp, x) / (k * x ** e), (x) => at(Q, x)),
  }
}
/** p. 18, ex. 4 */
export function likeFractions(rng: Rng): Made {
  const [m, n] = pick(rng, [[2, 3], [2, 5], [3, 4], [4, 5], [2, 7], [3, 5]]), a = int(rng, 1, 9), b = int(rng, 1, 9), c = int(rng, 1, 6), p = int(rng, 1, 9), r = int(rng, 1, 9)
  const L = m * n, sx = a * n + b * m - c * L, sy = p * n - r * m
  const t = (k: number, v: string) => (k === 0 ? '' : frac1(k, L, v))
  const frac1 = (k: number, d: number, v: string) => { const s = q(k, d); return s === '1' ? v : s === '-1' ? `-${v}` : s + v }
  const first = t(sx, 'x'), second = t(sy, 'y')
  return {
    text: `Reduceți termenii asemenea: $${frac1(a, m, 'x')} + ${frac1(p, m, 'y')} + ${frac1(b, n, 'x')} - ${frac1(r, n, 'y')} - ${cf(c)}x$.`,
    solution: lines('Grupăm termenii și aducem la același numitor:', show(`\\left(${q(a, m)} + ${q(b, n)} - ${c}\\right)x + \\left(${q(p, m)} - ${q(r, n)}\\right)y = ${first ? first + (second ? (second.startsWith('-') ? ' - ' + second.slice(1) : ' + ' + second) : '') : second || '0'}`)),
    verify: () => near(a / m + b / n - c, sx / L) && near(p / m - r / n, sy / L),
  }
}
/** p. 18, ex. 5 */
export function likeRadicals(rng: Rng): Made {
  const [m, n] = pick(rng, [[2, 3], [2, 5], [3, 5], [3, 2], [5, 2], [6, 5]]), c = [int(rng, 2, 6), int(rng, 2, 6), int(rng, 2, 6), int(rng, 2, 6)], s = pick(rng, [1, -1])
  const a = c[0] + s * c[2], b = c[1] - c[3]
  return {
    text: `Reduceți termenii asemenea: $x\\sqrt{${c[0] ** 2 * m}} + y\\sqrt{${c[1] ** 2 * n}} ${s > 0 ? '+' : '-'} x\\sqrt{${c[2] ** 2 * m}} - y\\sqrt{${c[3] ** 2 * n}}$.`,
    solution: lines('Scoatem factorii de sub radicali:', show(`${c[0]}x\\sqrt{${m}} + ${c[1]}y\\sqrt{${n}} ${s > 0 ? '+' : '-'} ${c[2]}x\\sqrt{${m}} - ${c[3]}y\\sqrt{${n}} = ${poly([[a, `x\\sqrt{${m}}`], [b, `y\\sqrt{${n}}`]])}`)),
    verify: () => near(Math.sqrt(c[0] ** 2 * m) + s * Math.sqrt(c[2] ** 2 * m), a * Math.sqrt(m)),
  }
}
/** p. 20, ex. 9–13 */
export function productsMinus(rng: Rng): Made {
  const A = [int(rng, 1, 4), nonZero(rng, -6, 6)], B = [int(rng, 1, 4), nonZero(rng, -6, 6)], C = [1, nonZero(rng, -6, 6)], D = [int(rng, 1, 3), nonZero(rng, -6, 6)]
  const u = mul(A, B), w = mul(C, D), r = add(u, w, -1)
  return {
    text: `Efectuați: $(${X(A)})(${X(B)}) - (${X(C)})(${X(D)})$.`,
    solution: lines('Înmulțim fiecare termen cu fiecare; scăderea schimbă toate semnele celui de-al doilea produs:', show(`(${X(u)}) - (${X(w)}) = ${X(r)}`)),
    verify: () => same((x) => at(A, x) * at(B, x) - at(C, x) * at(D, x), (x) => at(r, x)),
  }
}
/** p. 19, ex. 7; p. 20, ex. 8, 15 */
export function quotientPlus(rng: Rng): Made {
  const k = pick(rng, [-5, -4, -3, -2, 2, 3, 4]), Q = [nonZero(rng, -4, 4), nonZero(rng, -6, 6)], a = nonZero(rng, -5, 5), c = [int(rng, 1, 3), nonZero(rng, -5, 5)]
  const Pp = [...Q.map((t) => t * k), 0, 0], prod = mul([1, a], c), r = add(prod, Q)
  return {
    text: `Calculați, pentru $x \\ne 0$: $(${X(Pp)}) : (${X([k, 0, 0])}) + (${lin(a)})(${X(c)})$.`,
    solution: show(`${X(Q)} ${X(prod).replace(/^(?!-)/, '+ ')} = ${X(r)}`),
    verify: () => same((x) => at(Pp, x) / (k * x * x) + (x + a) * at(c, x), (x) => at(r, x)),
  }
}
/** p. 20, ex. 14 */
export function equationProducts(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 3), b = nonZero(rng, -5, 5), c = nonZero(rng, -5, 5), x0 = nonZero(rng, -6, 6), L = mul([1, b], [a, c]), k = L[1]
    if (k === 0) continue
    const rhs = k * x0 + L[2]
    return {
      text: `Rezolvați în $${R}$ ecuația $(${lin(b)})(${X([a, c])}) = ${X([a, 0, rhs])}$.`,
      solution: lines('Desfacem parantezele; termenii cu $x^2$ se reduc:', show(`${X(L)} = ${X([a, 0, rhs])} \\Rightarrow ${X([k, 0])} = ${rhs - L[2]} \\Rightarrow x = ${x0}`)),
      verify: () => (x0 + b) * (a * x0 + c) === a * x0 * x0 + rhs,
    }
  }
}
/** p. 21, ex. 16 */
export function equationQuotient(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 2, 6), b = nonZero(rng, -6, 6), c = nonZero(rng, -5, 5), x0 = nonZero(rng, -6, 6), k = pick(rng, [-4, -3, -2, 2, 3, 4])
    if (a === c) continue
    const d = (a - c) * x0 + b
    return {
      text: `Rezolvați în $${R}^*$ ecuația $(${X([a * k, b * k, 0])}) : (${X([k, 0])}) = ${X([c, d])}$.`,
      solution: show(`${X([a, b])} = ${X([c, d])} \\Rightarrow ${X([a - c, 0])} = ${d - b} \\Rightarrow x = ${x0}`),
      verify: () => a * x0 + b === c * x0 + d,
    }
  }
}
/** p. 20, ex. 15 h–j */
export function nestedQuotient(rng: Rng): Made {
  const a = int(rng, 2, 4), b = int(rng, 1, 5), k = int(rng, 2, 4)
  // [(ax + b)(ax + b) − b²] : x  − (kx − 1)(kx + 1) : ... keep it exact
  const c = nonZero(rng, -5, 5), r = add([a * a, 2 * a * b], mul([k, 0], [1, c]), -1)
  return {
    text: `Calculați, pentru $x \\ne 0$: $[(${X([a, b])})(${X([a, b])}) - ${b * b}] : x - ${k}x(${lin(c)})$.`,
    solution: lines(show(`(${X(mul([a, b], [a, b]))} - ${b * b}) : x - (${X([k, k * c, 0])})`), show(`= ${X([a * a, 2 * a * b])} ${X([-k, -k * c, 0]).replace(/^-/, '- ')} = ${X(r)}`)),
    verify: () => same((x) => ((a * x + b) ** 2 - b * b) / x - k * x * (x + c), (x) => at(r, x)),
  }
}

// ---------- 3.3 short formulas ----------

/** p. 21, ex. 1–2 */
export function fSquare(rng: Rng): Made {
  const a = int(rng, 1, 7), b = int(rng, 1, 9), c = int(rng, 2, 7), d = int(rng, 1, 9)
  return {
    text: `Calculați: a) $(${X([a, b])})^2$; b) $(${X([c, -d])})^2$.`,
    solution: lines(show(`(${X([a, b])})^2 = (${poly([[a, 'x']])})^2 + 2 \\cdot ${poly([[a, 'x']])} \\cdot ${b} + ${b}^2 = ${X(mul([a, b], [a, b]))}`), show(`(${X([c, -d])})^2 = (${c}x)^2 - 2 \\cdot ${c}x \\cdot ${d} + ${d}^2 = ${X(mul([c, -d], [c, -d]))}`)),
    verify: () => same((x) => (a * x + b) ** 2, (x) => at(mul([a, b], [a, b]), x)),
  }
}
/** p. 21, ex. 4; p. 22, ex. 5 */
export function fDiff(rng: Rng): Made {
  const a = int(rng, 2, 9), b = int(rng, 1, 9), m = pick(rng, [2, 3, 5, 6, 7, 10, 11]), c = int(rng, 1, 5)
  return {
    text: `Efectuați: a) $(${X([a, -b])})(${X([a, b])})$; b) $(${c === 1 ? '' : c}x - \\sqrt{${m}})(${c === 1 ? '' : c}x + \\sqrt{${m}})$.`,
    solution: lines(`Folosim $(a - b)(a + b) = a^2 - b^2$:`, show(`\\text{a) } (${a}x)^2 - ${b}^2 = ${X([a * a, 0, -b * b])}`), show(`\\text{b) } ${c === 1 ? 'x^2' : `(${c}x)^2`} - (\\sqrt{${m}})^2 = ${X([c * c, 0, -m])}`)),
    verify: () => same((x) => (a * x - b) * (a * x + b), (x) => a * a * x * x - b * b),
  }
}
/** p. 21, ex. 1 l–o */
export function fSquareRoots(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 1, 4), m = pick(rng, [2, 3, 5, 6, 7]), b = int(rng, 1, 4), n = pick(rng, [2, 3, 5, 6, 7]), s = pick(rng, [1, -1])
    if (m === n) continue
    const t = `${cf(a)}\\sqrt{${m}}`, u = `${cf(b)}\\sqrt{${n}}`, [k, w] = rootParts(m * n)
    return {
      text: `Calculați: $(${t} ${s > 0 ? '+' : '-'} ${u})^2$.`,
      solution: show(`(${t})^2 ${s > 0 ? '+' : '-'} 2 \\cdot ${t} \\cdot ${u} + (${u})^2 = ${a * a * m} ${s > 0 ? '+' : '-'} ${2 * a * b * k}\\sqrt{${w}} + ${b * b * n} = ${a * a * m + b * b * n} ${s > 0 ? '+' : '-'} ${2 * a * b * k}\\sqrt{${w}}`),
      verify: () => near((a * Math.sqrt(m) + s * b * Math.sqrt(n)) ** 2, a * a * m + b * b * n + s * 2 * a * b * k * Math.sqrt(w)),
    }
  }
}
/** p. 22, ex. 7; p. 23, ex. 12 */
export function fMixed(rng: Rng): Made {
  const a = nonZero(rng, -6, 6), b = int(rng, 1, 7), c = int(rng, 2, 4), d = nonZero(rng, -5, 5)
  const r = add(add(mul([1, a], [1, a]), [1, 0, -b * b], -1), mul([c, d], [c, d]))
  return {
    text: `Calculați: $(${lin(a)})^2 - (x - ${b})(x + ${b}) + (${X([c, d])})^2$.`,
    solution: show(`(${X(mul([1, a], [1, a]))}) - (x^2 - ${b * b}) + (${X(mul([c, d], [c, d]))}) = ${X(r)}`),
    verify: () => same((x) => (x + a) ** 2 - (x - b) * (x + b) + (c * x + d) ** 2, (x) => at(r, x)),
  }
}
/** p. 23, ex. 10 */
export function fIdentity(rng: Rng): Made {
  const a = int(rng, 1, 6), b = int(rng, 1, 6), c = int(rng, 2, 5), r = add(mul([c, a], [c, a]), mul([1, -b], [1, -b]), -1)
  return {
    text: `Arătați că $(${X([c, a])})^2 - (x - ${b})^2 = ${X(r)}$, pentru orice număr real $x$.`,
    solution: show(`(${X(mul([c, a], [c, a]))}) - (${X(mul([1, -b], [1, -b]))}) = ${X(r)}`),
    verify: () => same((x) => (c * x + a) ** 2 - (x - b) ** 2, (x) => at(r, x)),
  }
}
/** p. 23, ex. 11 */
export function fMeans(rng: Rng): Made {
  const a = int(rng, 2, 6), m = pick(rng, [2, 3, 5, 6, 7].filter((t) => t !== a * a && t < a * a)), [A, B] = [a * a + m, 2 * a]
  return {
    text: `Calculați media aritmetică și media geometrică a numerelor $x = (${a} + \\sqrt{${m}})^2$ și $y = (${a} - \\sqrt{${m}})^2$.`,
    solution: lines(show(`x = ${A} + ${B}\\sqrt{${m}}, \\quad y = ${A} - ${B}\\sqrt{${m}}`), show(`m_a = ${fr(`x + y`, 2)} = ${fr(2 * A, 2)} = ${A}`), show(`m_g = \\sqrt{xy} = \\sqrt{[(${a} + \\sqrt{${m}})(${a} - \\sqrt{${m}})]^2} = ${a * a} - ${m} = ${a * a - m}`)),
    verify: () => near(Math.sqrt((a + Math.sqrt(m)) ** 2 * (a - Math.sqrt(m)) ** 2), a * a - m),
  }
}
/** p. 24, ex. 22–23 */
export function fEquation(rng: Rng): Made {
  for (;;) {
    const k = int(rng, 2, 4), a = nonZero(rng, -5, 5), b = int(rng, 1, 6), x0 = nonZero(rng, -5, 5), c = 2 * k * a * x0 + a * a
    // (kx + a)² = (kx − b)(kx + b) + c + b²  → 2kax + a² = c
    const d = c + b * b
    if (d === 0) continue
    return {
      text: `Rezolvați în $${R}$ ecuația $(${X([k, a])})^2 = (${X([k, -b])})(${X([k, b])})${sgn(d)}$.`,
      solution: lines(show(`${X(mul([k, a], [k, a]))} = ${k * k}x^2 - ${b * b}${sgn(d)}`), show(`${X([2 * k * a, 0])} = ${c - a * a} \\Rightarrow x = ${x0}`)),
      verify: () => (k * x0 + a) ** 2 === (k * x0 - b) * (k * x0 + b) + d,
    }
  }
}
/** p. 23, ex. 20 */
export function fNested(rng: Rng): Made {
  for (;;) {
    const a = int(rng, 3, 12), m = int(rng, 2, 60), d = a * a - m, s = pick(rng, [1, -1]), r = Math.sqrt(d)
    if (d <= 0 || !Number.isInteger(r) || rootParts(m)[1] === 1) continue
    const v = 2 * a + s * 2 * r
    return {
      text: `Calculați: $\\left(\\sqrt{${a} + ${root(m)}} ${s > 0 ? '+' : '-'} \\sqrt{${a} - ${root(m)}}\\right)^2$.`,
      solution: lines(show(`${a} + ${root(m)} ${s > 0 ? '+' : '-'} 2\\sqrt{(${a} + ${root(m)})(${a} - ${root(m)})} + ${a} - ${root(m)}`), show(`= ${2 * a} ${s > 0 ? '+' : '-'} 2\\sqrt{${a * a} - ${m}} = ${2 * a} ${s > 0 ? '+' : '-'} 2 \\cdot ${r} = ${v}`)),
      verify: () => near((Math.sqrt(a + Math.sqrt(m)) + s * Math.sqrt(a - Math.sqrt(m))) ** 2, v),
    }
  }
}
/** p. 24, ex. 28–29 */
export function fExtreme(rng: Rng): Made {
  const a = nonZero(rng, -6, 6), m = nonZero(rng, -9, 9), max = rng() < 0.4, s = max ? -1 : 1, E = [s, 2 * s * a, s * a * a + m]
  return {
    text: `Aflați ${max ? 'maximul' : 'minimul'} expresiei $E(x) = ${X(E)}$, unde $x$ este număr real, și valoarea lui $x$ pentru care se obține.`,
    solution: lines('Formăm un pătrat perfect:', show(`E(x) = ${cf(s)}(${X([1, 2 * a, a * a])})${sgn(m)} = ${cf(s)}(${lin(a)})^2${sgn(m)}`), `Cum $(${lin(a)})^2 \\ge 0$, ${max ? 'maximul' : 'minimul'} este $${m}$, pentru $x = ${-a}$.`),
    verify: () => at(E, -a) === m,
  }
}
/** p. 25, ex. 36 */
export function fReciprocal(rng: Rng): Made {
  const k = int(rng, 3, 15), s = pick(rng, [1, -1])
  return {
    text: `Dacă $x ${s > 0 ? '+' : '-'} \\frac{1}{x} = ${k}$, calculați $x^2 + \\frac{1}{x^2}$ și $x^4 + \\frac{1}{x^4}$.`,
    solution: lines('Ridicăm relația la pătrat:', show(`x^2 ${s > 0 ? '+' : '-'} 2 + \\frac{1}{x^2} = ${k * k} \\Rightarrow x^2 + \\frac{1}{x^2} = ${k * k - 2 * s}`), 'Ridicăm din nou la pătrat:', show(`x^4 + 2 + \\frac{1}{x^4} = ${(k * k - 2 * s) ** 2} \\Rightarrow x^4 + \\frac{1}{x^4} = ${(k * k - 2 * s) ** 2 - 2}`)),
    verify: () => { const x = (k + Math.sqrt(k * k - 4 * s)) / 2; return near(x * x + 1 / (x * x), k * k - 2 * s) },
  }
}
/** p. 24, ex. 30 */
export function fSumProduct(rng: Rng): Made {
  const x = int(rng, 2, 15), y = int(rng, 1, x - 1), byDiff = rng() < 0.5
  return {
    text: byDiff ? `Dacă $x$ și $y$ sunt numere naturale cu $x - y = ${x - y}$ și $x \\cdot y = ${x * y}$, aflați $x^2 + y^2$ și $x + y$.` : `Dacă $x$ și $y$ sunt numere naturale cu $x + y = ${x + y}$ și $x^2 + y^2 = ${x * x + y * y}$, aflați $x \\cdot y$ și $|x - y|$.`,
    solution: byDiff
      ? lines(show(`x^2 + y^2 = (x - y)^2 + 2xy = ${(x - y) ** 2} + ${2 * x * y} = ${x * x + y * y}`), show(`(x + y)^2 = x^2 + y^2 + 2xy = ${(x + y) ** 2} \\Rightarrow x + y = ${x + y}`))
      : lines(show(`2xy = (x + y)^2 - (x^2 + y^2) = ${(x + y) ** 2} - ${x * x + y * y} = ${2 * x * y} \\Rightarrow xy = ${x * y}`), show(`(x - y)^2 = x^2 + y^2 - 2xy = ${(x - y) ** 2} \\Rightarrow |x - y| = ${x - y}`)),
    verify: () => (x - y) ** 2 + 2 * x * y === x * x + y * y,
  }
}
/** p. 24, ex. 35; p. 25, ex. 39; p. 28, ex. 20 */
export function fSquaresZero(rng: Rng): Made {
  const k = int(rng, 1, 3), a = nonZero(rng, -5, 5), m = int(rng, 1, 3), b = nonZero(rng, -5, 5)
  const c = a * a + b * b
  return {
    text: `Aflați numerele reale $x$ și $y$, știind că $${poly([[k * k, 'x^2'], [m * m, 'y^2'], [2 * k * a, 'x'], [2 * m * b, 'y'], [c, '']])} = 0$.`,
    solution: lines('Grupăm termenii în pătrate perfecte:', show(`(${X([k, a])})^2 + (${X([m, b], 'y')})^2 = 0`), 'O sumă de pătrate este 0 doar dacă fiecare pătrat este 0:', show(`${X([k, a])} = 0 \\Rightarrow x = ${q(-a, k)}, \\qquad ${X([m, b], 'y')} = 0 \\Rightarrow y = ${q(-b, m)}`)),
    verify: () => c === a * a + b * b,
  }
}
/** p. 24, ex. 32; p. 25, ex. 41–42 */
export function fRootsOfSquares(rng: Rng): Made {
  const a = int(rng, -5, 3), b = a + int(rng, 2, 7)
  return {
    text: `Arătați că, pentru orice $x \\in (${a}, ${b})$, numărul $n = \\sqrt{${X([1, -2 * a, a * a])}} + \\sqrt{${X([1, -2 * b, b * b])}}$ este natural.`,
    solution: lines(show(`n = \\sqrt{${a === 0 ? 'x^2' : `(${lin(-a)})^2`}} + \\sqrt{${b === 0 ? 'x^2' : `(${lin(-b)})^2`}} = |${lin(-a)}| + |${lin(-b)}|`), `Cum $${a} < x < ${b}$, primul modul este $${lin(-a)}$, iar al doilea $${poly([[b, ''], [-1, 'x']])}$:`, show(`n = ${lin(-a)} ${b >= 0 ? (b ? `+ ${b}` : '') : `- ${-b}`} - x = ${b - a} \\in ${N}`)),
    verify: () => near(Math.abs((a + b) / 2 - a) + Math.abs((a + b) / 2 - b), b - a),
  }
}
/** p. 24, ex. 31 */
export function fInequality(rng: Rng): Made {
  const a = nonZero(rng, -6, 6), b = nonZero(rng, -6, 6), c = int(rng, 1, 8)
  return {
    text: `Demonstrați că $${poly([[1, 'x^2'], [1, 'y^2'], [2 * a, 'x'], [2 * b, 'y'], [a * a + b * b + c, '']])} > 0$, pentru orice numere reale $x$ și $y$.`,
    solution: lines(show(`(${X([1, 2 * a, a * a])}) + (${X([1, 2 * b, b * b], 'y')}) + ${c} = (${lin(a)})^2 + (${lin(b, 'y')})^2 + ${c}`), `Pătratele sunt cel puțin 0, deci expresia este cel puțin $${c} > 0$.`),
    verify: () => c > 0,
  }
}
/** p. 24, ex. 33 */
export function fTelescoping(rng: Rng): Made {
  const a = pick(rng, [2, 3, 4, 5, 6, 7, 8, 9, 10]), n = int(rng, 2, 5)
  const f = range(0, n).map((i) => `(${a}${i === 0 ? '' : `^{${2 ** i}}`} + 1)`)
  return {
    text: `Arătați că $${cf(a - 1)}${f.join('')} = ${a}^{${2 ** (n + 1)}} - 1$.`,
    solution: lines(`Scriem $${a - 1} = ${a} - 1$ și folosim de fiecare dată $(u - 1)(u + 1) = u^2 - 1$:`, show(`(${a} - 1)(${a} + 1) = ${a}^2 - 1, \\quad (${a}^2 - 1)(${a}^2 + 1) = ${a}^4 - 1, \\ \\ldots`), show(`(${a}^{${2 ** n}} - 1)(${a}^{${2 ** n}} + 1) = ${a}^{${2 ** (n + 1)}} - 1`)),
    verify: () => n >= 2,
  }
}

export const KINDS: Kind8[] = [
  { id: 'viii-sets', label: 'Mulțimi definite printr-o proprietate', topic: 'Algebră', forms: { 1: [setBetween, setModulus, setProperty], 2: [setLinear, setDivisors, setOperations, setRoots], 3: [setQuotient, setCardinal, setDigitProduct, setTwoDigits] } },
  { id: 'viii-intervals', label: 'Intervale de numere reale', topic: 'Algebră', forms: { 1: [ivTruth, ivWrite, ivIntegers, ivUnionInter, ivWithSet], 2: [ivDouble, ivModulus, ivSetsOps, ivFindAB, ivPowers], 3: [ivProve, ivCard, ivDisjoint] } },
  { id: 'viii-p-inequality', joins: 'viii-inequality', label: '', topic: 'Algebră', forms: { 1: [ineqWhich], 2: [ineqFractions, ineqSquaresCancel, ineqRadical, ineqModZ], 3: [ineqSign, ineqDomain, ineqParameter, ineqOverModulus, ineqTwoSets] } },
  { id: 'viii-literal', label: 'Calcul cu numere reprezentate prin litere', topic: 'Algebră', forms: { 1: [likeTerms, bracketsMinus, monoProduct, monoPower, distribute, polyByMono], 2: [likeFractions, likeRadicals, productsMinus, quotientPlus], 3: [equationProducts, equationQuotient, nestedQuotient] } },
  { id: 'viii-formulas', label: 'Formule de calcul prescurtat', topic: 'Algebră', forms: { 1: [fSquare, fDiff, fSquareRoots], 2: [fMixed, fIdentity, fMeans, fEquation, fNested], 3: [fExtreme, fReciprocal, fSumProduct, fSquaresZero, fRootsOfSquares, fInequality, fTelescoping] } },
]
