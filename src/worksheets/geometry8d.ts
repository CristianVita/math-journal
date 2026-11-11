// Grade VIII areas and volumes, after chapter 6 of a workbook the user photographed on 11 November 2026 (6.1–6.13
// and the tests after them): the cuboid and the cube, regular prisms, regular pyramids and the tetrahedron, frustums,
// the cylinder, the cone and the sphere, with the practical problems (water, tiles, a tent, a trailer). Own numbers
// and wording, worked solutions in Romanian. The level follows the stars of the book.
import type { Made } from './generators'
import { de, frac, int, pick, rightTriangle, root, rootParts, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const close = (a: number, b: number) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))
const cm = '\\text{ cm}'
const cm2 = '\\text{ cm}^2'
const cm3 = '\\text{ cm}^3'
const sqrtFrac = (p: number, q: number) => {
  const [k, m] = rootParts(p * q)
  return surd(k, q, m)
}
const over = (n: number, s: number) => {
  const [k, m] = rootParts(s)
  return surd(n, k * m, m)
}
const pi = (p: number, q = 1) => {
  const v = frac(p, q)
  return v === '1' ? '\\pi' : `${v}\\pi`
}
const piS = (p: number, q: number, r: number) => (r === 1 ? pi(p, q) : `${surd(p, q, r)}\\pi`)
/** A coefficient before a letter: 1 is left out. */
const kc = (n: number) => (n === 1 ? '' : String(n))
const round = (x: number) => Math.round(x * 1000) / 1000
const dec = (x: number) => String(round(x)).replace('.', '{,}')
const decT = (x: number) => String(round(x)).replace('.', ',')
const S2 = Math.SQRT2
const S3 = Math.sqrt(3)
const isSq = (n: number) => Number.isInteger(Math.sqrt(n))

// ---------- coordinates, for the checks ----------
type P = [number, number, number]
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: P, b: P) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: P, b: P): P => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: P) => Math.sqrt(dot(a, a))
const dist = (a: P, b: P) => len(sub(a, b))
const toLine = (p: P, a: P, b: P) => len(cross(sub(p, a), sub(b, a))) / dist(a, b)
const normal = (a: P, b: P, c: P) => cross(sub(b, a), sub(c, a))
const toPlane = (p: P, a: P, b: P, c: P) => Math.abs(dot(sub(p, a), normal(a, b, c))) / len(normal(a, b, c))
const cosPP = (a1: P, b1: P, c1: P, a2: P, b2: P, c2: P) => {
  const [n1, n2] = [normal(a1, b1, c1), normal(a2, b2, c2)]
  return Math.abs(dot(n1, n2)) / (len(n1) * len(n2))
}
const sinLP = (p: P, q: P, a: P, b: P, c: P) => Math.abs(dot(sub(q, p), normal(a, b, c))) / (dist(p, q) * len(normal(a, b, c)))

/** Cuboids with whole edges and a whole diagonal. */
const QUADS: [number, number, number, number][] = []
for (let a = 1; a <= 30; a++) for (let b = 1; b <= 30; b++) for (let c = 1; c <= 30; c++) {
  const d = Math.sqrt(a * a + b * b + c * c)
  if (Number.isInteger(d) && d <= 40) QUADS.push([a, b, c, d])
}
/** Pairs (t, h) with h² + 3t² a perfect square. */
const PAIRS3: [number, number][] = []
for (let t = 1; t <= 20; t++) for (let h = 2; h <= 40; h++) if (isSq(h * h + 3 * t * t)) PAIRS3.push([t, h])

// ================= 6.2–6.3 the cuboid and the cube =================

/** 6.2, 1 (*) */
export function cuboidBasic(rng: Rng): Made {
  const [a, b, c, d] = pick(rng, QUADS)
  return {
    text: `Aflați volumul, aria totală și diagonala unui paralelipiped dreptunghic cu dimensiunile de ${a} cm, ${b} cm și ${c} cm.`,
    solution: lines(
      show(`V = L \\cdot \\ell \\cdot h = ${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}${cm3}`),
      show(`\\mathcal{A}_t = 2(L\\ell + \\ell h + Lh) = 2(${a * b} + ${b * c} + ${a * c}) = ${2 * (a * b + b * c + a * c)}${cm2}`),
      show(`d = \\sqrt{L^2 + \\ell^2 + h^2} = \\sqrt{${a * a} + ${b * b} + ${c * c}} = ${d}${cm}`),
    ),
    verify: () => a * a + b * b + c * c === d * d,
  }
}

/** 6.3, 1–2 (*): a cube from one of its measures. */
export function cubeTable(rng: Rng): Made {
  const l = int(rng, 2, 40)
  const given = [
    { name: 'diagonala', val: `$${surd(l, 1, 3)}$ cm`, eq: `\\ell\\sqrt{3} = ${surd(l, 1, 3)}` },
    { name: 'aria laterală', val: `${4 * l * l} cm²`, eq: `4\\ell^2 = ${4 * l * l}` },
    { name: 'aria totală', val: `${6 * l * l} cm²`, eq: `6\\ell^2 = ${6 * l * l}` },
    { name: 'volumul', val: `${l ** 3} cm³`, eq: `\\ell^3 = ${l ** 3}` },
    { name: 'diagonala bazei', val: `$${surd(l, 1, 2)}$ cm`, eq: `\\ell\\sqrt{2} = ${surd(l, 1, 2)}` },
    { name: 'suma lungimilor tuturor muchiilor', val: `${12 * l} cm`, eq: `12\\ell = ${12 * l}` },
    { name: 'perimetrul bazei', val: `${4 * l} cm`, eq: `4\\ell = ${4 * l}` },
  ]
  const g = pick(rng, given)
  return {
    text: `Un cub are ${g.name} de ${g.val}. Aflați latura, aria laterală, aria totală, volumul și diagonala cubului.`,
    solution: lines(
      `Din $${g.eq}$ obținem $\\ell = ${l}$ cm.`,
      show(`\\mathcal{A}_l = 4\\ell^2 = ${4 * l * l}${cm2}, \\quad \\mathcal{A}_t = 6\\ell^2 = ${6 * l * l}${cm2}`),
      show(`V = \\ell^3 = ${l ** 3}${cm3}, \\quad d = \\ell\\sqrt{3} = ${surd(l, 1, 3)}${cm}`),
    ),
    verify: () => close(Math.sqrt(3 * l * l), l * S3),
  }
}

/** 6.2, 2 (**) */
export function cuboidFromSection(rng: Rng): Made {
  const [l, L, dB] = rightTriangle(rng, 40)
  const h = int(rng, 2, 30)
  return {
    text: `Un paralelipiped dreptunghic are lățimea $\\ell = ${l}$ cm, aria bazei de ${l * L} cm² și aria secțiunii diagonale de ${dB * h} cm². Aflați aria totală, volumul și diagonala paralelipipedului.`,
    solution: lines(
      `Lungimea bazei: $L = \\frac{\\mathcal{A}_b}{\\ell} = \\frac{${l * L}}{${l}} = ${L}$ cm, iar diagonala bazei este $\\sqrt{${l * l} + ${L * L}} = ${dB}$ cm.`,
      `Secțiunea diagonală este un dreptunghi cu laturile egale cu diagonala bazei și cu înălțimea: $${dB} \\cdot h = ${dB * h}$, deci $h = ${h}$ cm.`,
      show(`\\mathcal{A}_t = 2(${L * l} + ${l * h} + ${L * h}) = ${2 * (L * l + l * h + L * h)}${cm2}, \\qquad V = ${L} \\cdot ${l} \\cdot ${h} = ${L * l * h}${cm3}`),
      show(`d = \\sqrt{${dB * dB} + ${h * h}} = ${root(dB * dB + h * h)}${cm}`),
    ),
    verify: () => l * l + L * L === dB * dB,
  }
}

/** 6.2, 7 (**) */
export function cuboidProportional(rng: Rng): Made {
  for (;;) {
    const [p, q] = [int(rng, 1, 6), int(rng, 1, 7)]
    if (p >= q) continue
    const k = int(rng, 1, 8)
    const h = int(rng, 2, 20)
    const [a, b] = [p * k, q * k]
    const P = 2 * (a + b)
    const V = a * b * h
    return {
      text: `Muchiile bazei unui paralelipiped dreptunghic sunt direct proporționale cu ${p} și ${q}, iar perimetrul bazei este de ${P} cm. Dacă volumul este de ${V} cm³, aflați aria totală și diagonala paralelipipedului.`,
      solution: lines(
        `Muchiile bazei sunt $${kc(p)}k$ și $${kc(q)}k$: $2(${kc(p)}k + ${kc(q)}k) = ${P}$, deci $${2 * (p + q)}k = ${P}$ și $k = ${k}$. Muchiile bazei au ${a} cm și ${b} cm.`,
        `Din $V = ${a} \\cdot ${b} \\cdot h = ${V}$ obținem $h = ${h}$ cm.`,
        show(`\\mathcal{A}_t = 2(${a * b} + ${b * h} + ${a * h}) = ${2 * (a * b + b * h + a * h)}${cm2}, \\qquad d = \\sqrt{${a * a} + ${b * b} + ${h * h}} = ${root(a * a + b * b + h * h)}${cm}`),
      ),
      verify: () => 2 * (a + b) === P && a * b * h === V && a * q === b * p,
    }
  }
}

/** 6.2, 5 (**) */
export function cuboidFromDiagonal(rng: Rng): Made {
  const [a, b, c, d] = pick(rng, QUADS)
  return {
    text: `Aflați volumul și aria totală ale unui paralelipiped dreptunghic care are diagonala de ${d} cm, lățimea de ${a} cm și aria bazei de ${a * b} cm².`,
    solution: lines(
      `Lungimea bazei: $L = \\frac{${a * b}}{${a}} = ${b}$ cm. Din $d^2 = L^2 + \\ell^2 + h^2$: $h^2 = ${d * d} - ${b * b} - ${a * a} = ${c * c}$, deci $h = ${c}$ cm.`,
      show(`V = ${a * b} \\cdot ${c} = ${a * b * c}${cm3}, \\qquad \\mathcal{A}_t = 2(${a * b} + ${b * c} + ${a * c}) = ${2 * (a * b + b * c + a * c)}${cm2}`),
    ),
    verify: () => a * a + b * b + c * c === d * d,
  }
}

/** 6.3, 3 (**) */
export function cubeFromSectionArea(rng: Rng): Made {
  const a = int(rng, 2, 40)
  return {
    text: `Aflați aria totală și volumul unui cub a cărui secțiune diagonală are aria de $${surd(a * a, 1, 2)}$ cm².`,
    solution: lines(
      'Secțiunea diagonală este un dreptunghi cu laturile egale cu muchia $\\ell$ și cu diagonala unei fețe, $\\ell\\sqrt{2}$:',
      show(`\\ell \\cdot \\ell\\sqrt{2} = ${surd(a * a, 1, 2)} \\Rightarrow \\ell^2 = ${a * a} \\Rightarrow \\ell = ${a}${cm}`),
      show(`\\mathcal{A}_t = 6\\ell^2 = ${6 * a * a}${cm2}, \\qquad V = \\ell^3 = ${a ** 3}${cm3}`),
    ),
    verify: () => close(a * a * S2, a * (a * S2)),
  }
}

/** 6.3, 6–7 (**): B'N with N the midpoint of AB, or B'M with M the midpoint of AD. */
export function cubeMidpointEdge(rng: Rng): Made {
  const k = int(rng, 1, 20)
  const a = 2 * k
  const onAB = rng() < 0.5
  return {
    text: onAB
      ? `Fie $N$ mijlocul laturii $[AB]$ a cubului $ABCDA'B'C'D'$. Dacă $B'N = ${surd(k, 1, 5)}$ cm, aflați aria totală, volumul și diagonala cubului.`
      : `Fie $M$ mijlocul laturii $[AD]$ a cubului $ABCDA'B'C'D'$. Dacă $B'M = ${3 * k}$ cm, aflați aria totală, volumul și diagonala cubului.`,
    solution: lines(
      onAB
        ? `Triunghiul $B'BN$ este dreptunghic în $B$, cu $BB' = \\ell$ și $BN = \\frac{\\ell}{2}$: $B'N^2 = \\ell^2 + \\frac{\\ell^2}{4} = \\frac{5\\ell^2}{4}$, deci $B'N = \\frac{\\ell\\sqrt{5}}{2} = ${surd(k, 1, 5)}$ și $\\ell = ${a}$ cm.`
        : `În triunghiul $BAM$, dreptunghic în $A$: $BM^2 = \\ell^2 + \\frac{\\ell^2}{4} = \\frac{5\\ell^2}{4}$. Cum $BB' \\perp (ABC)$, triunghiul $B'BM$ este dreptunghic în $B$: $B'M^2 = \\ell^2 + \\frac{5\\ell^2}{4} = \\frac{9\\ell^2}{4}$, deci $B'M = \\frac{3\\ell}{2} = ${3 * k}$ și $\\ell = ${a}$ cm.`,
      show(`\\mathcal{A}_t = 6\\ell^2 = ${6 * a * a}${cm2}, \\quad V = \\ell^3 = ${a ** 3}${cm3}, \\quad d = \\ell\\sqrt{3} = ${surd(a, 1, 3)}${cm}`),
    ),
    verify: () => (onAB ? close(dist([a, 0, a], [a / 2, 0, 0]), k * Math.sqrt(5)) : close(dist([a, 0, a], [0, a / 2, 0]), 3 * k)),
  }
}

/** 6.3, 10 (**): a cube with the volume of a cuboid m² × mn × n². */
export function cubeEquivalent(rng: Rng): Made {
  for (;;) {
    const [m, n] = [int(rng, 1, 7), int(rng, 1, 9)]
    if (m >= n) continue
    const [x, y, z] = [m * m, m * n, n * n]
    const a = m * n
    return {
      text: `Aflați aria totală și volumul unui cub echivalent cu un paralelipiped dreptunghic cu dimensiunile de ${x} cm, ${y} cm și ${z} cm.`,
      solution: lines(
        `Corpurile echivalente au același volum: $V = ${x} \\cdot ${y} \\cdot ${z} = ${a ** 3}$ cm³. Muchia cubului: $\\ell^3 = ${a ** 3} = ${a}^3$, deci $\\ell = ${a}$ cm.`,
        show(`\\mathcal{A}_t = 6\\ell^2 = ${6 * a * a}${cm2}, \\qquad V = ${a ** 3}${cm3}`),
      ),
      verify: () => x * y * z === a ** 3,
    }
  }
}

/** 6.3, 9 (**): a cube full of water poured into a cuboid. */
export function waterCubeToCuboid(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 2, 15)
    const L = int(rng, 3, 30)
    const w = int(rng, 2, 25)
    const v = l ** 3
    if (v % (L * w) !== 0 || L === w) continue
    const x = v / (L * w)
    if (x > 60) continue
    return {
      text: `Un cub cu muchia de ${l} cm este plin cu apă. Apa se toarnă într-un vas în formă de paralelipiped dreptunghic, cu lungimea bazei de ${L} cm și lățimea de ${w} cm. Până la ce înălțime se ridică apa în vas?`,
      solution: lines(
        `Volumul apei este volumul cubului: $V = ${l}^3 = ${v}$ cm³. În vas, apa formează un paralelipiped cu baza de $${L} \\cdot ${w} = ${L * w}$ cm² și înălțimea $x$:`,
        show(`${L * w} \\cdot x = ${v} \\Rightarrow x = ${x}${cm}`),
      ),
      verify: () => L * w * x === v,
    }
  }
}

/** 6.2, 15 (***) */
export function cuboidDiag45(rng: Rng): Made {
  const [a, b, c] = rightTriangle(rng, 40)
  return {
    text: `În paralelipipedul dreptunghic $ABCDA'B'C'D'$ se cunosc $AB = ${a}$ cm și $BC = ${b}$ cm, iar diagonala $BD'$ face cu muchia laterală $DD'$ un unghi de $45^\\circ$. Aflați: a) aria laterală, aria totală și volumul; b) $d(C', BD')$; c) $d(A', (BDD'))$.`,
    solution: lines(
      `a) Diagonala bazei: $BD = \\sqrt{${a * a} + ${b * b}} = ${c}$ cm. Triunghiul $BDD'$ este dreptunghic în $D$, cu $m(\\angle BD'D) = 45^\\circ$, deci este isoscel: $DD' = BD = ${c}$ cm.`,
      show(`\\mathcal{A}_l = 2(${a} + ${b}) \\cdot ${c} = ${2 * (a + b) * c}${cm2}, \\quad \\mathcal{A}_t = ${2 * (a + b) * c} + ${2 * a * b} = ${2 * (a + b) * c + 2 * a * b}${cm2}, \\quad V = ${a * b * c}${cm3}`),
      `b) $D'C' \\perp (BCC')$, deci triunghiul $BC'D'$ este dreptunghic în $C'$, cu $C'D' = ${a}$ cm, $BC' = \\sqrt{${b * b} + ${c * c}} = ${root(b * b + c * c)}$ cm și $BD' = ${surd(c, 1, 2)}$ cm. Distanța cerută este înălțimea din $C'$:`,
      show(`d(C', BD') = \\frac{C'D' \\cdot BC'}{BD'} = ${sqrtFrac(a * a * (b * b + c * c), 2 * c * c)}${cm}`),
      `c) Planul $(BDD')$ este perpendicular pe fața $A'B'C'D'$ și o taie după $B'D'$, deci distanța este înălțimea din $A'$ a triunghiului dreptunghic $A'B'D'$:`,
      show(`d(A', (BDD')) = \\frac{A'B' \\cdot A'D'}{B'D'} = \\frac{${a} \\cdot ${b}}{${c}} = ${frac(a * b, c)}${cm}`),
    ),
    verify: () => {
      const [B, D, D1, C1, A1]: P[] = [[a, 0, 0], [0, b, 0], [0, b, c], [a, b, c], [0, 0, c]]
      return close(toLine(C1, B, D1), Math.sqrt((a * a * (b * b + c * c)) / (2 * c * c))) && close(toPlane(A1, B, D, D1), (a * b) / c)
    },
  }
}

/** 6.2, 17 (***): the angle of (A'DB) with the base is 60°. */
export function cuboidDihedral60(rng: Rng): Made {
  const [a, b, c] = rightTriangle(rng, 40)
  return {
    text: `În paralelipipedul dreptunghic $ABCDA'B'C'D'$, unghiul planelor $(A'DB)$ și $(ABD)$ are $60^\\circ$. Dacă $AB = ${a}$ cm și aria secțiunii diagonale $BDD'B'$ este de $${surd(a * b, 1, 3)}$ cm², aflați aria laterală și volumul paralelipipedului.`,
    solution: lines(
      "Fie $AH \\perp BD$, $H \\in BD$. Din teorema celor trei perpendiculare, $A'H \\perp BD$, deci unghiul planelor este $\\angle A'HA = 60^\\circ$ și $AA' = AH \\cdot \\operatorname{tg} 60^\\circ = AH\\sqrt{3}$.",
      `Cu $AD = x$: $AH = \\frac{AB \\cdot AD}{BD} = \\frac{${a}x}{BD}$, iar aria secțiunii diagonale este $BD \\cdot AA' = ${a}x\\sqrt{3}$. Din $${a}x\\sqrt{3} = ${surd(a * b, 1, 3)}$ obținem $AD = ${b}$ cm.`,
      show(`BD = \\sqrt{${a * a} + ${b * b}} = ${c}${cm}, \\quad AH = \\frac{${a} \\cdot ${b}}{${c}} = ${frac(a * b, c)}${cm}, \\quad AA' = ${surd(a * b, c, 3)}${cm}`),
      show(`\\mathcal{A}_l = 2(${a} + ${b}) \\cdot AA' = ${surd(2 * (a + b) * a * b, c, 3)}${cm2}, \\qquad V = ${a} \\cdot ${b} \\cdot AA' = ${surd(a * a * b * b, c, 3)}${cm3}`),
    ),
    verify: () => {
      const h = (a * b * S3) / c
      const [A, B, D, A1]: P[] = [[0, 0, 0], [a, 0, 0], [0, b, 0], [0, 0, h]]
      return close(cosPP(A1, D, B, A, B, D), 0.5) && close(c * h, a * b * S3)
    },
  }
}

/** 6.3, 16 (***): identical cubes raise the water of an aquarium. */
export function aquariumCubes(rng: Rng): Made {
  for (;;) {
    const s = int(rng, 2, 15)
    const n = int(rng, 2, 6)
    const N = n * s ** 3
    const opts: [number, number, number][] = []
    for (let L = 20; L <= 80; L++) for (let w = 10; w < L; w++) if (N % (L * w) === 0 && N / (L * w) <= 15) opts.push([L, w, N / (L * w)])
    if (!opts.length) continue
    const [L, w, x] = pick(rng, opts)
    return {
      text: `Într-un acvariu în formă de paralelipiped dreptunghic, cu lungimea de ${L} cm și lățimea de ${w} cm, se pun ${n} cuburi identice, care sunt acoperite de apă. Nivelul apei crește cu ${x} cm. Aflați latura unui cub.`,
      solution: lines(
        `Volumul cu care crește apa este volumul celor ${n} cuburi: $${L} \\cdot ${w} \\cdot ${x} = ${N}$ cm³.`,
        show(`V_{\\text{cub}} = \\frac{${N}}{${n}} = ${s ** 3}${cm3} \\Rightarrow \\ell = \\sqrt[3]{${s ** 3}} = ${s}${cm}`),
      ),
      verify: () => L * w * x === n * s ** 3,
    }
  }
}

/** 6.1, 12 and 6.3, 12 (***) */
export function cubeFromDistance(rng: Rng): Made {
  const k = int(rng, 1, 20)
  const a = 2 * k
  return {
    text: `În cubul $ABCDA'B'C'D'$ se știe că $d(A', BD) = ${surd(k, 1, 6)}$ cm. Aflați: a) aria totală și volumul cubului; b) $d(A, (A'BD))$.`,
    solution: lines(
      `a) Fie $O$ centrul bazei. $AO \\perp BD$ și, din teorema celor trei perpendiculare, $A'O \\perp BD$, deci $d(A', BD) = A'O = \\sqrt{\\ell^2 + \\frac{\\ell^2}{2}} = \\frac{\\ell\\sqrt{6}}{2}$. Din $\\frac{\\ell\\sqrt{6}}{2} = ${surd(k, 1, 6)}$ obținem $\\ell = ${a}$ cm.`,
      show(`\\mathcal{A}_t = ${6 * a * a}${cm2}, \\qquad V = ${a ** 3}${cm3}`),
      "b) $BD \\perp AO$ și $BD \\perp AA'$, deci $BD \\perp (A'AO)$, iar înălțimea din $A$ a triunghiului dreptunghic $A'AO$ este perpendiculară pe planul $(A'BD)$:",
      show(`d(A, (A'BD)) = \\frac{AA' \\cdot AO}{A'O} = \\frac{\\ell\\sqrt{3}}{3} = ${surd(a, 3, 3)}${cm}`),
    ),
    verify: () => {
      const [A, B, D, A1]: P[] = [[0, 0, 0], [a, 0, 0], [0, a, 0], [0, 0, a]]
      return close(toLine(A1, B, D), k * Math.sqrt(6)) && close(toPlane(A, A1, B, D), (a * S3) / 3)
    },
  }
}

/** 6.2, 22 (***): a closed box with water, turned over. */
export function boxFlip(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = [int(rng, 10, 60), int(rng, 10, 60), int(rng, 10, 60)]
    if (a === b || b === c || a === c) continue
    const x = int(rng, 2, c - 1)
    if ((b * x) % c !== 0) continue
    const y = (b * x) / c
    return {
      text: `Într-o cutie în formă de paralelipiped dreptunghic se închide etanș o cantitate de apă. Cutia are $L = ${a}$ cm, $\\ell = ${b}$ cm și $h = ${c}$ cm, iar apa se ridică la ${x} cm. Dacă se răstoarnă cutia astfel încât $L = ${c}$ cm, $\\ell = ${a}$ cm și $h = ${b}$ cm, până la ce înălțime se ridică apa?`,
      solution: lines(
        `Volumul apei nu se schimbă: $V = ${a} \\cdot ${b} \\cdot ${x} = ${a * b * x}$ cm³. După răsturnare, baza are $${c} \\cdot ${a} = ${c * a}$ cm²:`,
        show(`y = \\frac{${a * b * x}}{${c * a}} = ${y}${cm}`),
      ),
      verify: () => c * a * y === a * b * x && y <= b,
    }
  }
}

/** 6.2, 23 (***): a pool, the time to fill it and the cost of the tiles. */
export function poolTiles(rng: Rng): Made {
  const l = int(rng, 2, 6)
  const L = int(rng, l + 1, 12)
  const h = int(rng, 1, 3)
  const q = pick(rng, [10, 20, 25, 40, 50, 100])
  const p = 10 * int(rng, 2, 9)
  const liters = 1000 * l * L * h
  const M = liters / q
  const [H, mn] = [Math.floor(M / 60), M % 60]
  const time = [H === 1 ? 'o oră' : `${de(H)} ore`, mn === 0 ? '' : mn === 1 ? 'un minut' : `${de(mn)} minute`].filter(Boolean).join(' și ')
  const area = l * L + 2 * (l + L) * h
  const cost = (area * p * 11) / 10
  return {
    text: `Un bazin fără capac, în formă de paralelipiped dreptunghic, are lățimea de ${l} m, lungimea de ${L} m și adâncimea de ${h} m. a) Dacă robinetul care alimentează bazinul are debitul de ${q} l pe minut, în cât timp se umple bazinul? b) Interiorul bazinului se acoperă cu gresie care costă ${de(p)} lei pe m². Cât costă gresia, dacă se cumpără cu 10% mai mult decât este necesar?`,
    solution: lines(
      `a) $V = ${l} \\cdot ${L} \\cdot ${h} = ${l * L * h}$ m³, adică ${liters} l (1 m³ are 1000 l). Bazinul se umple în $${liters} : ${q} = ${M}$ minute, adică ${time}.`,
      `b) Gresia acoperă fundul și cei patru pereți: $${l} \\cdot ${L} + 2 \\cdot (${l} + ${L}) \\cdot ${h} = ${area}$ m². Se cumpără $${area} \\cdot 1{,}1 = ${dec(area * 1.1)}$ m², care costă $${dec(area * 1.1)} \\cdot ${p} = ${cost}$, adică ${de(cost)} lei.`,
    ),
    verify: () => Number.isInteger(cost) && Number.isInteger(M) && H * 60 + mn === M,
  }
}

// ================= 6.4–6.5 regular prisms =================

/** 6.4, 1 (*) */
export function squarePrismBasic(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const h = int(rng, 2, 30)
  return {
    text: `O prismă patrulateră regulată are latura bazei de ${l} cm și înălțimea de ${h} cm. Aflați aria totală, volumul și diagonala prismei.`,
    solution: lines(
      show(`\\mathcal{A}_t = 2\\ell^2 + 4\\ell h = ${2 * l * l} + ${4 * l * h} = ${2 * l * l + 4 * l * h}${cm2}, \\qquad V = \\ell^2 h = ${l * l * h}${cm3}`),
      show(`d = \\sqrt{\\ell^2 + \\ell^2 + h^2} = \\sqrt{${2 * l * l} + ${h * h}} = ${root(2 * l * l + h * h)}${cm}`),
    ),
    verify: () => close(dist([0, 0, 0], [l, l, h]), Math.sqrt(2 * l * l + h * h)),
  }
}

/** 6.5, 1 (*) */
export function triPrismBasic(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const h = int(rng, 2, 30)
  return {
    text: `Aflați aria totală și volumul unei prisme triunghiulare regulate care are latura bazei de ${l} cm și înălțimea de ${h} cm.`,
    solution: lines(
      show(`\\mathcal{A}_b = \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(l * l, 4, 3)}${cm2}, \\qquad \\mathcal{A}_l = 3\\ell h = ${3 * l * h}${cm2}`),
      show(`\\mathcal{A}_t = \\mathcal{A}_l + 2\\mathcal{A}_b = ${3 * l * h} + ${surd(l * l, 2, 3)}${cm2}, \\qquad V = \\mathcal{A}_b \\cdot h = ${surd(l * l * h, 4, 3)}${cm3}`),
    ),
    verify: () => close(((l * l * S3) / 4) * h, (l * l * h * S3) / 4),
  }
}

/** 6.5, 3 (*) */
export function hexPrismBasic(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const h = int(rng, 2, 30)
  return {
    text: `Prisma hexagonală regulată $ABCDEFA'B'C'D'E'F'$ are latura bazei de ${l} cm și înălțimea de ${h} cm. Calculați aria totală și volumul ei.`,
    solution: lines(
      'Baza este formată din șase triunghiuri echilaterale cu latura $\\ell$:',
      show(`\\mathcal{A}_b = 6 \\cdot \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(3 * l * l, 2, 3)}${cm2}, \\qquad \\mathcal{A}_l = 6\\ell h = ${6 * l * h}${cm2}`),
      show(`\\mathcal{A}_t = ${6 * l * h} + ${surd(3 * l * l, 1, 3)}${cm2}, \\qquad V = \\mathcal{A}_b \\cdot h = ${surd(3 * l * l * h, 2, 3)}${cm3}`),
    ),
    verify: () => close(6 * ((l * l * S3) / 4) * h, (3 * l * l * h * S3) / 2),
  }
}

/** 6.5, 2 (*): from the height of the base triangle and the volume. */
export function triPrismBaseHeight(rng: Rng): Made {
  const t = int(rng, 1, 20)
  const h = int(rng, 2, 30)
  return {
    text: `Înălțimea triunghiului de la baza unei prisme triunghiulare regulate este de $${surd(t, 1, 3)}$ cm, iar volumul prismei este de $${surd(t * t * h, 1, 3)}$ cm³. Aflați: a) latura bazei; b) înălțimea prismei; c) aria totală.`,
    solution: lines(
      `a) Înălțimea unui triunghi echilateral este $\\frac{\\ell\\sqrt{3}}{2}$: din $\\frac{\\ell\\sqrt{3}}{2} = ${surd(t, 1, 3)}$ obținem $\\ell = ${2 * t}$ cm.`,
      `b) $\\mathcal{A}_b = \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(t * t, 1, 3)}$ cm², deci $h = \\frac{V}{\\mathcal{A}_b} = ${h}$ cm.`,
      show(`\\text{c) } \\mathcal{A}_t = 3\\ell h + 2\\mathcal{A}_b = ${6 * t * h} + ${surd(2 * t * t, 1, 3)}${cm2}`),
    ),
    verify: () => close((((2 * t) ** 2 * S3) / 4) * h, t * t * h * S3),
  }
}

/** 6.4, 3 (**) */
export function squarePrismFromV(rng: Rng): Made {
  const l = int(rng, 2, 20)
  const h = int(rng, 2, 30)
  return {
    text: `Într-o prismă patrulateră regulată, volumul este de ${l * l * h} cm³ și înălțimea de ${h} cm. Aflați: a) aria totală și diagonala unei fețe laterale; b) aria secțiunii diagonale; c) sinusul unghiului format de diagonala prismei cu planul bazei.`,
    solution: lines(
      `$\\ell^2 = \\frac{V}{h} = ${l * l}$, deci $\\ell = ${l}$ cm.`,
      show(`\\text{a) } \\mathcal{A}_t = ${2 * l * l} + ${4 * l * h} = ${2 * l * l + 4 * l * h}${cm2}, \\qquad \\sqrt{${l * l} + ${h * h}} = ${root(l * l + h * h)}${cm}`),
      `b) Secțiunea diagonală este un dreptunghi cu laturile $\\ell\\sqrt{2}$ și $h$: $\\mathcal{A} = ${surd(l, 1, 2)} \\cdot ${h} = ${surd(l * h, 1, 2)}$ cm².`,
      `c) Proiecția diagonalei $A'C$ pe bază este $AC = ${surd(l, 1, 2)}$ cm, iar $A'C = \\sqrt{${2 * l * l} + ${h * h}} = ${root(2 * l * l + h * h)}$ cm:`,
      show(`\\sin(\\angle A'CA) = \\frac{AA'}{A'C} = ${over(h, 2 * l * l + h * h)}`),
    ),
    verify: () => close(sinLP([0, 0, h], [l, l, 0], [0, 0, 0], [l, 0, 0], [0, l, 0]), h / Math.sqrt(2 * l * l + h * h)),
  }
}

/** 6.4, 4–5 (**): from the side and the total area, or from the height and the lateral area. */
export function squarePrismFromAt(rng: Rng): Made {
  const l = int(rng, 2, 20)
  const h = int(rng, 2, 30)
  const At = 2 * l * l + 4 * l * h
  if (rng() < 0.5) {
    return {
      text: `Într-o prismă patrulateră regulată se cunosc latura bazei, de ${l} cm, și aria totală, de ${At} cm². Aflați volumul și diagonala prismei.`,
      solution: lines(
        `$\\mathcal{A}_t = 2\\ell^2 + 4\\ell h$: $${2 * l * l} + ${4 * l}h = ${At}$, deci $h = ${h}$ cm.`,
        show(`V = ${l * l} \\cdot ${h} = ${l * l * h}${cm3}, \\qquad d = \\sqrt{${2 * l * l} + ${h * h}} = ${root(2 * l * l + h * h)}${cm}`),
      ),
      verify: () => 2 * l * l + 4 * l * h === At,
    }
  }
  return {
    text: `O prismă patrulateră regulată are înălțimea de ${h} cm și aria laterală de ${4 * l * h} cm². Aflați volumul și aria totală ale prismei.`,
    solution: lines(
      `$\\mathcal{A}_l = 4\\ell h$: $${4 * h}\\ell = ${4 * l * h}$, deci $\\ell = ${l}$ cm.`,
      show(`V = ${l * l} \\cdot ${h} = ${l * l * h}${cm3}, \\qquad \\mathcal{A}_t = ${4 * l * h} + ${2 * l * l} = ${At}${cm2}`),
    ),
    verify: () => 4 * l * h + 2 * l * l === At,
  }
}

/** 6.4, 7 (**) */
export function squarePrismAbAl(rng: Rng): Made {
  const l = int(rng, 2, 25)
  const h = int(rng, 2, 30)
  return {
    text: `Să se afle cosinusul unghiului format de diagonala și planul bazei într-o prismă patrulateră regulată care are aria bazei de ${l * l} cm² și aria laterală de ${4 * l * h} cm².`,
    solution: lines(
      `$\\ell = \\sqrt{${l * l}} = ${l}$ cm, iar din $4\\ell h = ${4 * l * h}$ obținem $h = ${h}$ cm.`,
      `Proiecția diagonalei pe bază este diagonala bazei, $\\ell\\sqrt{2} = ${surd(l, 1, 2)}$ cm, iar diagonala prismei are $\\sqrt{${2 * l * l} + ${h * h}} = ${root(2 * l * l + h * h)}$ cm:`,
      show(`\\cos = \\frac{${surd(l, 1, 2)}}{${root(2 * l * l + h * h)}} = ${sqrtFrac(2 * l * l, 2 * l * l + h * h)}`),
    ),
    verify: () => {
      const s = sinLP([0, 0, h], [l, l, 0], [0, 0, 0], [l, 0, 0], [0, l, 0])
      return close(Math.sqrt(1 - s * s), Math.sqrt((2 * l * l) / (2 * l * l + h * h)))
    },
  }
}

/** 6.4, 8 (**) */
export function squarePrism60(rng: Rng): Made {
  const l = int(rng, 2, 30)
  return {
    text: `Într-o prismă patrulateră regulată $ABCDA'B'C'D'$ se cunosc latura bazei, de ${l} cm, și măsura unghiului dintre $AC'$ și planul $(A'B'C')$, de $60^\\circ$. Aflați: a) înălțimea prismei; b) aria totală; c) volumul.`,
    solution: lines(
      `a) $AA' \\perp (A'B'C')$, deci proiecția lui $AC'$ pe acest plan este $A'C' = ${surd(l, 1, 2)}$ cm, iar unghiul este $\\angle AC'A' = 60^\\circ$:`,
      show(`AA' = A'C' \\cdot \\operatorname{tg} 60^\\circ = ${surd(l, 1, 2)} \\cdot \\sqrt{3} = ${surd(l, 1, 6)}${cm}`),
      show(`\\text{b) } \\mathcal{A}_t = 2\\ell^2 + 4\\ell h = ${2 * l * l} + ${surd(4 * l * l, 1, 6)}${cm2}, \\qquad \\text{c) } V = \\ell^2 h = ${surd(l ** 3, 1, 6)}${cm3}`),
    ),
    verify: () => close(sinLP([0, 0, 0], [l, l, l * Math.sqrt(6)], [0, 0, l * Math.sqrt(6)], [l, 0, l * Math.sqrt(6)], [0, l, l * Math.sqrt(6)]), S3 / 2),
  }
}

/** 6.5, 4 (**) */
export function triPrism30(rng: Rng): Made {
  const k = int(rng, 1, 20)
  return {
    text: `Într-o prismă triunghiulară regulată, diagonala unei fețe laterale face cu muchia laterală un unghi de $30^\\circ$ și are lungimea de ${2 * k} cm. Aflați aria totală și volumul prismei.`,
    solution: lines(
      'Fața laterală este un dreptunghi cu laturile $\\ell$ (muchia bazei) și $h$ (muchia laterală). În triunghiul dreptunghic format de diagonală cu cele două muchii, muchia bazei se opune unghiului de $30^\\circ$, deci este jumătate din diagonală:',
      show(`\\ell = \\frac{${2 * k}}{2} = ${k}${cm}, \\qquad h = ${2 * k} \\cdot \\cos 30^\\circ = ${surd(k, 1, 3)}${cm}`),
      show(`\\mathcal{A}_t = 3\\ell h + 2 \\cdot \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(3 * k * k, 1, 3)} + ${surd(k * k, 2, 3)} = ${surd(7 * k * k, 2, 3)}${cm2}`),
      show(`V = \\frac{\\ell^2\\sqrt{3}}{4} \\cdot h = ${frac(3 * k ** 3, 4)}${cm3}`),
    ),
    verify: () => close(3 * k * k * S3 + (k * k * S3) / 2, (7 * k * k * S3) / 2) && close(((k * k * S3) / 4) * k * S3, (3 * k ** 3) / 4),
  }
}

/** 6.5, 5 (**) */
export function triPrismCircumradius(rng: Rng): Made {
  const k = int(rng, 1, 15)
  const h = int(rng, 2, 30)
  const l = 3 * k
  return {
    text: `Raza cercului circumscris bazei unei prisme triunghiulare regulate este de $${surd(k, 1, 3)}$ cm, iar înălțimea prismei este de ${h} cm. Aflați aria totală și volumul prismei.`,
    solution: lines(
      `$R = \\frac{\\ell\\sqrt{3}}{3}$, deci $\\ell = R\\sqrt{3} = ${l}$ cm.`,
      show(`\\mathcal{A}_b = ${surd(l * l, 4, 3)}${cm2}, \\quad \\mathcal{A}_l = 3 \\cdot ${l} \\cdot ${h} = ${3 * l * h}${cm2}, \\quad \\mathcal{A}_t = ${3 * l * h} + ${surd(l * l, 2, 3)}${cm2}`),
      show(`V = \\mathcal{A}_b \\cdot h = ${surd(l * l * h, 4, 3)}${cm3}`),
    ),
    verify: () => close((l * S3) / 3, k * S3),
  }
}

/** 6.5, 16 (**) */
export function hexPrismFromAl(rng: Rng): Made {
  const l = int(rng, 2, 20)
  const h = int(rng, 2, 20)
  return {
    text: `Aflați volumul și aria totală ale prismei hexagonale regulate cu înălțimea de ${h} cm și aria laterală de ${6 * l * h} cm².`,
    solution: lines(
      `$\\mathcal{A}_l = 6\\ell h$: $${6 * h}\\ell = ${6 * l * h}$, deci $\\ell = ${l}$ cm.`,
      show(`\\mathcal{A}_b = \\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(3 * l * l, 2, 3)}${cm2}, \\qquad V = ${surd(3 * l * l * h, 2, 3)}${cm3}, \\qquad \\mathcal{A}_t = ${6 * l * h} + ${surd(3 * l * l, 1, 3)}${cm2}`),
    ),
    verify: () => close(6 * l * h, 6 * l * h) && l > 0,
  }
}

/** 6.5, 18 (**) */
export function hexPrismAD(rng: Rng): Made {
  for (;;) {
    const [x, h, d] = rightTriangle(rng, 60)
    if (x % 2) continue
    const l = x / 2
    return {
      text: `Prisma hexagonală regulată $ABCDEFA'B'C'D'E'F'$ are aria bazei de $${surd(3 * l * l, 2, 3)}$ cm² și volumul de $${surd(3 * l * l * h, 2, 3)}$ cm³. Aflați: a) aria totală; b) cosinusul unghiului dintre dreapta $A'D$ și planul $(ABC)$.`,
      solution: lines(
        `Din $\\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(3 * l * l, 2, 3)}$ obținem $\\ell^2 = ${l * l}$, $\\ell = ${l}$ cm, iar $h = \\frac{V}{\\mathcal{A}_b} = ${h}$ cm.`,
        show(`\\text{a) } \\mathcal{A}_t = 6\\ell h + 2\\mathcal{A}_b = ${6 * l * h} + ${surd(3 * l * l, 1, 3)}${cm2}`),
        `b) $AD$ este o diagonală mare a hexagonului: $AD = 2\\ell = ${x}$ cm. Proiecția lui $A'D$ pe bază este $AD$, iar $A'D = \\sqrt{${x * x} + ${h * h}} = ${d}$ cm:`,
        show(`\\cos(\\angle A'DA) = \\frac{AD}{A'D} = ${frac(x, d)}`),
      ),
      verify: () => x * x + h * h === d * d,
    }
  }
}

/** 6.5, 20 (**): water from one prism fills a smaller one. */
export function waterPrisms(rng: Rng): Made {
  const [p, q] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5]] as const)
  const m = int(rng, 1, 10)
  const h1 = int(rng, 2, 30)
  const [l1, l2] = [q * m, p * m]
  return {
    text: `O prismă triunghiulară regulată cu latura bazei de ${l1} cm și înălțimea de ${h1} cm este plină cu apă. Apa se toarnă într-o altă prismă triunghiulară regulată, cu latura bazei de ${l2} cm, pe care o umple exact. Aflați înălțimea celei de-a doua prisme și raportul dintre înălțimea ei și înălțimea primei prisme.`,
    solution: lines(
      `Volumele sunt egale: $\\frac{${l1}^2\\sqrt{3}}{4} \\cdot ${h1} = \\frac{${l2}^2\\sqrt{3}}{4} \\cdot h$, deci $${l1 * l1} \\cdot ${h1} = ${l2 * l2} \\cdot h$.`,
      show(`h = \\frac{${l1 * l1 * h1}}{${l2 * l2}} = ${frac(l1 * l1 * h1, l2 * l2)}${cm}, \\qquad \\frac{h}{${h1}} = \\frac{${l1 * l1}}{${l2 * l2}} = ${frac(q * q, p * p)}`),
    ),
    verify: () => close(l2 * l2 * ((l1 * l1 * h1) / (l2 * l2)), l1 * l1 * h1),
  }
}

/** 6.4, 12 (***) */
export function squarePrism30Plane(rng: Rng): Made {
  const k = int(rng, 1, 15)
  const l = 3 * k
  return {
    text: `Măsura unghiului dintre planul bazei $A'B'C'D'$ a prismei patrulatere regulate $ABCDA'B'C'D'$ și planul $(A'C'B)$ este de $30^\\circ$, iar aria laterală este de $${surd(6 * k * k, 1, 6)}$ cm². Aflați volumul și aria totală ale prismei.`,
    solution: lines(
      "Fie $O'$ centrul bazei $A'B'C'D'$. $B'O' \\perp A'C'$ și, din teorema celor trei perpendiculare, $BO' \\perp A'C'$. Planele se taie după $A'C'$, deci unghiul lor este $\\angle BO'B' = 30^\\circ$:",
      show(`h = BB' = B'O' \\cdot \\operatorname{tg} 30^\\circ = \\frac{\\ell\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{3}}{3} = \\frac{\\ell\\sqrt{6}}{6}`),
      `Atunci $\\mathcal{A}_l = 4\\ell h = \\frac{2\\ell^2\\sqrt{6}}{3} = ${surd(6 * k * k, 1, 6)}$, deci $\\ell^2 = ${l * l}$, $\\ell = ${l}$ cm și $h = ${surd(k, 2, 6)}$ cm.`,
      show(`V = \\ell^2 h = ${surd(9 * k ** 3, 2, 6)}${cm3}, \\qquad \\mathcal{A}_t = ${2 * l * l} + ${surd(6 * k * k, 1, 6)}${cm2}`),
    ),
    verify: () => {
      const h = (k * Math.sqrt(6)) / 2
      const [A1, B1, C1, B]: P[] = [[0, 0, h], [l, 0, h], [l, l, h], [l, 0, 0]]
      return close(cosPP(A1, C1, B, A1, B1, C1), S3 / 2) && close(4 * l * h, 6 * k * k * Math.sqrt(6))
    },
  }
}

/** 6.4, 14 (***) */
export function squarePrismSectionDist(rng: Rng): Made {
  const k = int(rng, 1, 15)
  const h = int(rng, 2, 30)
  const l = 2 * k
  return {
    text: `Într-o prismă patrulateră regulată $ABCDA'B'C'D'$ se cunosc aria secțiunii diagonale, de $${surd(2 * k * h, 1, 2)}$ cm², și $d(C, (BDD')) = ${surd(k, 1, 2)}$ cm. Aflați aria totală și volumul prismei.`,
    solution: lines(
      `Fie $O$ centrul bazei. $CO \\perp BD$ și $CO \\perp DD'$, deci $CO \\perp (BDD')$ și $d(C, (BDD')) = CO = \\frac{\\ell\\sqrt{2}}{2}$. Din $\\frac{\\ell\\sqrt{2}}{2} = ${surd(k, 1, 2)}$ obținem $\\ell = ${l}$ cm și $BD = ${surd(l, 1, 2)}$ cm.`,
      `Secțiunea diagonală $BDD'B'$ este un dreptunghi: $BD \\cdot h = ${surd(2 * k * h, 1, 2)}$, deci $h = ${h}$ cm.`,
      show(`\\mathcal{A}_t = ${2 * l * l} + ${4 * l * h} = ${2 * l * l + 4 * l * h}${cm2}, \\qquad V = ${l * l * h}${cm3}`),
    ),
    verify: () => close(toPlane([l, l, 0], [l, 0, 0], [0, l, 0], [0, l, h]), k * S2),
  }
}

/** 6.5, 22 (***) */
export function triPrismAlV(rng: Rng): Made {
  const l = int(rng, 2, 24)
  const h = int(rng, 2, 30)
  return {
    text: `O prismă triunghiulară regulată $ABCA'B'C'$ are aria laterală de ${3 * l * h} cm² și volumul de $${surd(l * l * h, 4, 3)}$ cm³. Aflați latura bazei, înălțimea prismei și sinusul unghiului dintre dreapta $A'C$ și planul $(CC'B')$.`,
    solution: lines(
      `Împărțim volumul la aria laterală: $\\frac{V}{\\mathcal{A}_l} = \\frac{\\ell^2\\sqrt{3} \\cdot h}{4 \\cdot 3\\ell h} = \\frac{\\ell\\sqrt{3}}{12}$, deci $\\frac{\\ell\\sqrt{3}}{12} = ${surd(l, 12, 3)}$ și $\\ell = ${l}$ cm. Atunci $h = \\frac{${3 * l * h}}{${3 * l}} = ${h}$ cm.`,
      `Fie $N$ mijlocul lui $B'C'$: $A'N \\perp B'C'$ și $A'N \\perp CC'$, deci $A'N \\perp (CC'B')$, iar proiecția lui $A'C$ pe acest plan este $NC$. $A'N = ${surd(l, 2, 3)}$ cm, $A'C = \\sqrt{${l * l} + ${h * h}} = ${root(l * l + h * h)}$ cm:`,
      show(`\\sin(\\angle A'CN) = \\frac{A'N}{A'C} = ${sqrtFrac(3 * l * l, 4 * (l * l + h * h))}`),
    ),
    verify: () => {
      const C: P = [l / 2, (l * S3) / 2, 0]
      return close(sinLP([0, 0, h], C, C, [l / 2, (l * S3) / 2, h], [l, 0, h]), Math.sqrt((3 * l * l) / (4 * (l * l + h * h))))
    },
  }
}

/** 6.5, 23 (***) */
export function triPrismM45(rng: Rng): Made {
  const k = int(rng, 1, 20)
  return {
    text: `Fie $M$ mijlocul muchiei $[AC]$ în prisma triunghiulară regulată $ABCA'B'C'$. Dacă aria bazei este de $${surd(k * k, 1, 3)}$ cm² și $m(\\angle(B'M, (ABC))) = 45^\\circ$, aflați volumul, aria totală și lungimea segmentului $B'M$.`,
    solution: lines(
      `Din $\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(k * k, 1, 3)}$ obținem $\\ell = ${2 * k}$ cm. $BM$ este înălțime în triunghiul echilateral: $BM = ${surd(k, 1, 3)}$ cm.`,
      `Proiecția lui $B'M$ pe bază este $BM$, iar triunghiul $B'BM$ este dreptunghic isoscel: $BB' = BM = ${surd(k, 1, 3)}$ cm și $B'M = BM\\sqrt{2} = ${surd(k, 1, 6)}$ cm.`,
      show(`V = ${surd(k * k, 1, 3)} \\cdot ${surd(k, 1, 3)} = ${3 * k ** 3}${cm3}, \\qquad \\mathcal{A}_t = 3 \\cdot ${2 * k} \\cdot ${surd(k, 1, 3)} + 2 \\cdot ${surd(k * k, 1, 3)} = ${surd(8 * k * k, 1, 3)}${cm2}`),
    ),
    verify: () => {
      const l = 2 * k
      const B: P = [l, 0, 0]
      const M: P = [l / 4, (l * S3) / 4, 0]
      const B1: P = [l, 0, k * S3]
      return close(sinLP(B1, M, [0, 0, 0], B, [l / 2, (l * S3) / 2, 0]), S2 / 2) && close(dist(B1, M), k * Math.sqrt(6))
    },
  }
}

/** 6.5, 25 (***) */
export function hexPrismAE(rng: Rng): Made {
  const [l, h] = pick(rng, PAIRS3)
  const e = Math.sqrt(3 * l * l + h * h)
  return {
    text: `În prisma hexagonală regulată $ABCDEFA'B'C'D'E'F'$ se știe că latura bazei este de ${l} cm și $AE' = ${e}$ cm. Aflați aria totală și volumul prismei.`,
    solution: lines(
      `În hexagonul regulat, $m(\\angle AFE) = 120^\\circ$, iar $AE = \\ell\\sqrt{3} = ${surd(l, 1, 3)}$ cm. Triunghiul $AEE'$ este dreptunghic în $E$:`,
      show(`EE' = \\sqrt{${e * e} - ${3 * l * l}} = ${h}${cm}`),
      show(`\\mathcal{A}_t = 6\\ell h + 3\\ell^2\\sqrt{3} = ${6 * l * h} + ${surd(3 * l * l, 1, 3)}${cm2}, \\qquad V = \\frac{3\\ell^2\\sqrt{3}}{2} \\cdot h = ${surd(3 * l * l * h, 2, 3)}${cm3}`),
    ),
    verify: () => close(dist([l, 0, 0], [l * Math.cos((4 * Math.PI) / 3), l * Math.sin((4 * Math.PI) / 3), h]), e),
  }
}

/** 6.5, 26 (***) */
export function hexPrismAD45(rng: Rng): Made {
  const k = int(rng, 1, 20)
  return {
    text: `În prisma hexagonală regulată $ABCDEFA'B'C'D'E'F'$ se cunosc $AD' = ${surd(2 * k, 1, 2)}$ cm și unghiul format de $AD'$ cu planul bazei, de $45^\\circ$. Aflați: a) aria totală și volumul; b) $d(A', BE)$.`,
    solution: lines(
      `a) Proiecția lui $AD'$ pe bază este $AD$, iar triunghiul $ADD'$ este dreptunghic isoscel: $AD = DD' = \\frac{AD'}{\\sqrt{2}} = ${2 * k}$ cm. $AD$ este o diagonală mare, deci $\\ell = \\frac{AD}{2} = ${k}$ cm, iar $h = ${2 * k}$ cm.`,
      show(`\\mathcal{A}_t = 6\\ell h + 3\\ell^2\\sqrt{3} = ${12 * k * k} + ${surd(3 * k * k, 1, 3)}${cm2}, \\qquad V = \\frac{3\\ell^2\\sqrt{3}}{2} \\cdot h = ${surd(3 * k ** 3, 1, 3)}${cm3}`),
      `b) Fie $O$ centrul bazei și $AP \\perp BE$, $P \\in BE$. Triunghiul $AOB$ este echilateral, deci $AP = \\frac{\\ell\\sqrt{3}}{2} = ${surd(k, 2, 3)}$ cm. Din teorema celor trei perpendiculare, $A'P \\perp BE$:`,
      show(`d(A', BE) = \\sqrt{${4 * k * k} + ${frac(3 * k * k, 4)}} = ${surd(k, 2, 19)}${cm}`),
    ),
    verify: () => {
      const at = (i: number): P => [k * Math.cos((i * Math.PI) / 3), k * Math.sin((i * Math.PI) / 3), 0]
      const A1: P = [k, 0, 2 * k]
      return close(toLine(A1, at(1), at(4)), (k * Math.sqrt(19)) / 2) && close(dist([k, 0, 0], [-k, 0, 2 * k]), 2 * k * S2)
    },
  }
}

/** 6.4, 19 (***): the mass and the price of a piece of cheese. */
export function cheese(rng: Rng): Made {
  const l = int(rng, 1, 3)
  const h = int(rng, 1, 3)
  const rho = pick(rng, [9, 11, 12, 13, 15])
  const p = int(rng, 20, 60)
  const V = l * l * h
  const mass = (V * rho) / 10
  const cost = (V * rho * p) / 10
  return {
    text: `O bucată de brânză are forma unei prisme patrulatere regulate, cu latura bazei de ${l} dm și înălțimea de ${h} dm. a) Dacă densitatea brânzei este de ${decT(rho / 10)} kg/dm³, aflați masa bucății. b) Dacă prețul este de ${de(p)} lei pe kilogram, cât costă bucata?`,
    solution: lines(
      `a) $V = ${l}^2 \\cdot ${h} = ${V}$ dm³, iar masa este densitatea înmulțită cu volumul: $${dec(rho / 10)} \\cdot ${V} = ${dec(mass)}$ kg.`,
      `b) $${dec(mass)} \\cdot ${p} = ${dec(cost)}$, deci bucata costă ${Number.isInteger(round(cost)) ? `${de(round(cost))} lei` : `${decT(cost)} lei`}.`,
    ),
    verify: () => close(mass * p, cost),
  }
}

/** 6.4, 20 (***): square prisms of wood in a trailer. */
export function trailer(rng: Rng): Made {
  for (;;) {
    const s = pick(rng, [10, 20, 25, 50])
    const hp = pick(rng, [50, 100, 150])
    const [a, b, c] = [int(rng, 2, 40), int(rng, 2, 15), int(rng, 1, 4)]
    const [L, W, H] = [a * s, b * s, c * hp]
    if (L > 1000 || W > 300 || H > 300 || L <= W) continue
    return {
      text: `În remorca unui camion, în formă de paralelipiped dreptunghic, cu lungimea de ${decT(L / 100)} m, lățimea de ${decT(W / 100)} m și înălțimea de ${decT(H / 100)} m, se pun bucăți de lemn în formă de prismă patrulateră regulată, cu latura bazei de ${s} cm și înălțimea de ${decT(hp / 100)} m, așezate vertical. Câte bucăți încap?`,
      solution: lines(
        `În centimetri, remorca are ${L} cm, ${W} cm și ${H} cm, iar o bucată are baza un pătrat cu latura de ${s} cm și înălțimea de ${hp} cm.`,
        `Pe lungime încap $${L} : ${s} = ${a}$ bucăți, pe lățime $${W} : ${s} = ${b}$, iar pe înălțime $${H} : ${hp} = ${c}$ ${c === 1 ? 'rând' : 'rânduri'}:`,
        show(`${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}`),
      ),
      verify: () => a * s * b * s * c * hp === L * W * H,
    }
  }
}

// ================= 6.6–6.7 regular pyramids =================

/** 6.6, 1 (*): two of l, h, ap. */
export function quadPyrTable(rng: Rng): Made {
  const [half, h, ap] = rightTriangle(rng, 50)
  const l = 2 * half
  const v = int(rng, 0, 2)
  const given = [`latura bazei este de ${l} cm și înălțimea de ${h} cm`, `latura bazei este de ${l} cm și apotema piramidei de ${ap} cm`, `înălțimea este de ${h} cm și apotema piramidei de ${ap} cm`][v]
  const missing = ['apotema piramidei', 'înălțimea', 'latura bazei'][v]
  const step = [`a_p = VM = \\sqrt{${h * h} + ${half * half}} = ${ap}`, `h = VO = \\sqrt{${ap * ap} - ${half * half}} = ${h}`, `OM = \\sqrt{${ap * ap} - ${h * h}} = ${half}, \\quad \\ell = 2 \\cdot OM = ${l}`][v]
  return {
    text: `Într-o piramidă patrulateră regulată, ${given}. Aflați ${missing}, aria laterală, aria totală și volumul.`,
    solution: lines(
      'Fie $O$ centrul bazei și $M$ mijlocul unei laturi a bazei: triunghiul $VOM$ este dreptunghic în $O$, cu $OM = \\frac{\\ell}{2}$ (apotema bazei).',
      show(step),
      show(`\\mathcal{A}_l = \\frac{4\\ell \\cdot a_p}{2} = ${2 * l * ap}${cm2}, \\quad \\mathcal{A}_t = ${l * l} + ${2 * l * ap} = ${l * l + 2 * l * ap}${cm2}, \\quad V = \\frac{\\ell^2 h}{3} = ${frac(l * l * h, 3)}${cm3}`),
    ),
    verify: () => half * half + h * h === ap * ap,
  }
}

/** 6.7, 1 (*): a regular triangular pyramid with l = 2m√3, so that its base apothem is m. */
export function triPyrBasic(rng: Rng): Made {
  const [m, h, ap] = rightTriangle(rng, 40)
  const byH = rng() < 0.5
  return {
    text: `Într-o piramidă triunghiulară regulată, latura bazei este de $${surd(2 * m, 1, 3)}$ cm și ${byH ? `înălțimea de ${h} cm` : `apotema piramidei de ${ap} cm`}. Aflați ${byH ? 'apotema piramidei' : 'înălțimea piramidei'}, aria totală și volumul.`,
    solution: lines(
      `Apotema bazei (raza cercului înscris) este $a_b = \\frac{\\ell\\sqrt{3}}{6} = ${m}$ cm. În triunghiul $VOM$, dreptunghic în $O$:`,
      show(byH ? `a_p = \\sqrt{${h * h} + ${m * m}} = ${ap}${cm}` : `h = \\sqrt{${ap * ap} - ${m * m}} = ${h}${cm}`),
      show(`\\mathcal{A}_b = \\frac{\\ell^2\\sqrt{3}}{4} = ${surd(3 * m * m, 1, 3)}${cm2}, \\qquad \\mathcal{A}_l = \\frac{3\\ell \\cdot a_p}{2} = ${surd(3 * m * ap, 1, 3)}${cm2}`),
      show(`\\mathcal{A}_t = ${surd(3 * m * m + 3 * m * ap, 1, 3)}${cm2}, \\qquad V = \\frac{\\mathcal{A}_b \\cdot h}{3} = ${surd(m * m * h, 1, 3)}${cm3}`),
    ),
    verify: () => {
      const l = 2 * m * S3
      return close((l * S3) / 6, m) && close(((l * l * S3) / 4) * h / 3, m * m * h * S3) && m * m + h * h === ap * ap
    },
  }
}

/** 6.7, 2 (*) */
export function hexPyrBasic(rng: Rng): Made {
  const [t, h] = pick(rng, PAIRS3)
  const ap = Math.sqrt(h * h + 3 * t * t)
  return {
    text: `Aflați aria totală și volumul piramidei hexagonale regulate care are latura bazei de ${2 * t} cm și înălțimea de ${h} cm.`,
    solution: lines(
      `Apotema bazei este înălțimea unui triunghi echilateral cu latura $\\ell$: $a_b = \\frac{\\ell\\sqrt{3}}{2} = ${surd(t, 1, 3)}$ cm. Apotema piramidei: $a_p = \\sqrt{${h * h} + ${3 * t * t}} = ${ap}$ cm.`,
      show(`\\mathcal{A}_b = \\frac{3\\ell^2\\sqrt{3}}{2} = ${surd(6 * t * t, 1, 3)}${cm2}, \\qquad \\mathcal{A}_l = \\frac{6\\ell \\cdot a_p}{2} = ${6 * t * ap}${cm2}`),
      show(`\\mathcal{A}_t = ${6 * t * ap} + ${surd(6 * t * t, 1, 3)}${cm2}, \\qquad V = \\frac{\\mathcal{A}_b \\cdot h}{3} = ${surd(2 * t * t * h, 1, 3)}${cm3}`),
    ),
    verify: () => close((3 * (2 * t) ** 2 * S3) / 2, 6 * t * t * S3) && Number.isInteger(ap),
  }
}

/** 6.6, 2 and 5 (**) */
export function quadPyrFromEdgeAp(rng: Rng): Made {
  const [half, h, ap] = rightTriangle(rng, 40)
  const e2 = ap * ap + half * half
  const l = 2 * half
  return {
    text: `O piramidă patrulateră regulată are muchia laterală de $${root(e2)}$ cm și apotema de ${ap} cm. Aflați: a) aria totală și volumul; b) sinusul unghiului format de muchia laterală cu planul bazei.`,
    solution: lines(
      `a) Fața $VBC$ este un triunghi isoscel, iar apotema $VM$ este și mediană: $BM = \\sqrt{${e2} - ${ap * ap}} = ${half}$ cm, deci $\\ell = ${l}$ cm. Înălțimea: $VO = \\sqrt{VM^2 - OM^2} = \\sqrt{${ap * ap} - ${half * half}} = ${h}$ cm.`,
      show(`\\mathcal{A}_t = ${l * l} + ${2 * l * ap} = ${l * l + 2 * l * ap}${cm2}, \\qquad V = \\frac{${l * l} \\cdot ${h}}{3} = ${frac(l * l * h, 3)}${cm3}`),
      'b) Proiecția muchiei $VB$ pe bază este $OB$, deci unghiul este $\\angle VBO$:',
      show(`\\sin(\\angle VBO) = \\frac{VO}{VB} = ${over(h, e2)}`),
    ),
    verify: () => close(Math.sqrt(h * h + 2 * half * half), Math.sqrt(e2)),
  }
}

/** 6.6, 4 (**): the triangle VDB is right at V, so all the edges are equal. */
export function quadPyrRightApex(rng: Rng): Made {
  const k = int(rng, 1, 20)
  return {
    text: `În piramida patrulateră regulată $VABCD$ cu latura bazei $\\ell = ${surd(2 * k, 1, 2)}$ cm, triunghiul $VDB$ este dreptunghic, cu $m(\\angle DVB) = 90^\\circ$. Aflați: a) aria totală și volumul; b) $d(O, (VAB))$, unde $O$ este centrul bazei.`,
    solution: lines(
      `a) $BD = \\ell\\sqrt{2} = ${4 * k}$ cm. Triunghiul $VDB$ este dreptunghic isoscel, deci $VB = \\frac{BD}{\\sqrt{2}} = ${surd(2 * k, 1, 2)}$ cm, iar înălțimea $VO$ este mediana din unghiul drept: $VO = \\frac{BD}{2} = ${2 * k}$ cm. Toate muchiile sunt egale, deci fețele laterale sunt triunghiuri echilaterale.`,
      show(`\\mathcal{A}_t = ${8 * k * k} + 4 \\cdot \\frac{\\ell^2\\sqrt{3}}{4} = ${8 * k * k} + ${surd(8 * k * k, 1, 3)}${cm2}, \\qquad V = \\frac{${8 * k * k} \\cdot ${2 * k}}{3} = ${frac(16 * k ** 3, 3)}${cm3}`),
      `b) Fie $M$ mijlocul lui $AB$: $OM = ${surd(k, 1, 2)}$ cm, iar apotema $VM = \\frac{\\ell\\sqrt{3}}{2} = ${surd(k, 1, 6)}$ cm. $AB \\perp (VOM)$, deci înălțimea din $O$ a triunghiului dreptunghic $VOM$ este perpendiculară pe $(VAB)$:`,
      show(`d(O, (VAB)) = \\frac{VO \\cdot OM}{VM} = ${surd(2 * k, 3, 3)}${cm}`),
    ),
    verify: () => {
      const s = k * S2
      const V: P = [0, 0, 2 * k]
      return close(dist(V, [s, s, 0]), 2 * k * S2) && close(toPlane([0, 0, 0], V, [-s, -s, 0], [s, -s, 0]), (2 * k * S3) / 3)
    },
  }
}

/** 6.6, 7 (**) */
export function quadPyrAlAb(rng: Rng): Made {
  const [half, h, ap] = rightTriangle(rng, 40)
  const l = 2 * half
  return {
    text: `Aflați volumul piramidei patrulatere regulate care are aria laterală de ${2 * l * ap} cm² și aria bazei de ${l * l} cm².`,
    solution: lines(
      `$\\ell = \\sqrt{${l * l}} = ${l}$ cm. $\\mathcal{A}_l = 2\\ell \\cdot a_p$: $${2 * l}a_p = ${2 * l * ap}$, deci $a_p = ${ap}$ cm. Înălțimea: $h = \\sqrt{${ap * ap} - ${half * half}} = ${h}$ cm.`,
      show(`V = \\frac{${l * l} \\cdot ${h}}{3} = ${frac(l * l * h, 3)}${cm3}`),
    ),
    verify: () => half * half + h * h === ap * ap,
  }
}

/** 6.6, 9 (**) */
export function quadPyr60(rng: Rng): Made {
  const l = int(rng, 2, 20)
  return {
    text: `Muchia laterală a unei piramide patrulatere regulate face cu planul bazei un unghi de $60^\\circ$, iar latura bazei este de ${l} cm. Aflați: a) aria totală și volumul; b) cosinusul unghiului format de apotema piramidei cu planul bazei.`,
    solution: lines(
      `a) Fie $O$ centrul bazei: $OA = \\frac{\\ell\\sqrt{2}}{2} = ${surd(l, 2, 2)}$ cm, iar unghiul muchiei cu baza este $\\angle VAO = 60^\\circ$:`,
      show(`h = OA \\cdot \\operatorname{tg} 60^\\circ = ${surd(l, 2, 6)}${cm}, \\qquad a_p = \\sqrt{h^2 + \\frac{\\ell^2}{4}} = \\sqrt{${frac(3 * l * l, 2)} + ${frac(l * l, 4)}} = ${surd(l, 2, 7)}${cm}`),
      show(`\\mathcal{A}_t = ${l * l} + 2 \\cdot ${l} \\cdot ${surd(l, 2, 7)} = ${l * l} + ${surd(l * l, 1, 7)}${cm2}, \\qquad V = \\frac{${l * l} \\cdot ${surd(l, 2, 6)}}{3} = ${surd(l ** 3, 6, 6)}${cm3}`),
      'b) Unghiul apotemei $VM$ cu baza este $\\angle VMO$:',
      show(`\\cos(\\angle VMO) = \\frac{OM}{VM} = \\frac{\\ell / 2}{\\ell\\sqrt{7} / 2} = \\frac{\\sqrt{7}}{7}`),
    ),
    verify: () => {
      const h = (l * Math.sqrt(6)) / 2
      return close(Math.atan(h / ((l * S2) / 2)), Math.PI / 3) && close(Math.sqrt(h * h + (l * l) / 4), (l * Math.sqrt(7)) / 2)
    },
  }
}

/** 6.6, 8 (**): the height makes 30° with the plane (VAB). */
export function quadPyrAngle30(rng: Rng): Made {
  const l = int(rng, 2, 20)
  return {
    text: `În piramida patrulateră regulată $VABCD$, măsura unghiului dintre înălțime și planul $(VAB)$ este de $30^\\circ$. Dacă aria bazei este de ${l * l} cm², aflați: a) aria totală și volumul; b) aria secțiunii diagonale; c) $d(A, VC)$.`,
    solution: lines(
      `$\\ell = ${l}$ cm. Fie $M$ mijlocul lui $AB$. $AB \\perp (VOM)$, deci proiecția înălțimii $VO$ pe $(VAB)$ este pe $VM$, iar unghiul este $\\angle OVM = 30^\\circ$. În triunghiul $VOM$, dreptunghic în $O$, cateta $OM = \\frac{\\ell}{2}$ se opune unghiului de $30^\\circ$:`,
      show(`a_p = VM = 2 \\cdot OM = ${l}${cm}, \\qquad h = VO = OM\\sqrt{3} = ${surd(l, 2, 3)}${cm}`),
      show(`\\text{a) } \\mathcal{A}_t = ${l * l} + 2 \\cdot ${l} \\cdot ${l} = ${3 * l * l}${cm2}, \\qquad V = \\frac{${l * l} \\cdot ${surd(l, 2, 3)}}{3} = ${surd(l ** 3, 6, 3)}${cm3}`),
      `b) Secțiunea diagonală $VAC$ are baza $AC = ${surd(l, 1, 2)}$ cm și înălțimea $VO$: $\\mathcal{A} = ${surd(l * l, 4, 6)}$ cm².`,
      `c) $VC = \\sqrt{VO^2 + OC^2} = \\sqrt{${frac(3 * l * l, 4)} + ${frac(l * l, 2)}} = ${surd(l, 2, 5)}$ cm. În triunghiul $VAC$, distanța este înălțimea din $A$:`,
      show(`d(A, VC) = \\frac{AC \\cdot VO}{VC} = ${surd(l, 5, 30)}${cm}`),
    ),
    verify: () => {
      const s = l / 2
      const V: P = [0, 0, (l * S3) / 2]
      const [A, B, C]: P[] = [[-s, -s, 0], [s, -s, 0], [s, s, 0]]
      return close(sinLP(V, [0, 0, 0], V, A, B), 0.5) && close(toLine(A, V, C), (l * Math.sqrt(30)) / 5)
    },
  }
}

/** 6.7, 4 (**) */
export function triPyrAlAb(rng: Rng): Made {
  const [m, h, ap] = rightTriangle(rng, 40)
  return {
    text: `Aflați volumul piramidei triunghiulare regulate care are aria laterală de $${surd(3 * m * ap, 1, 3)}$ cm² și aria bazei de $${surd(3 * m * m, 1, 3)}$ cm².`,
    solution: lines(
      `Din $\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(3 * m * m, 1, 3)}$ obținem $\\ell^2 = ${12 * m * m}$ și $\\ell = ${surd(2 * m, 1, 3)}$ cm. Din $\\mathcal{A}_l = \\frac{3\\ell \\cdot a_p}{2}$: $a_p = \\frac{2\\mathcal{A}_l}{3\\ell} = ${ap}$ cm.`,
      `Apotema bazei este $a_b = \\frac{\\ell\\sqrt{3}}{6} = ${m}$ cm, deci $h = \\sqrt{${ap * ap} - ${m * m}} = ${h}$ cm.`,
      show(`V = \\frac{\\mathcal{A}_b \\cdot h}{3} = ${surd(m * m * h, 1, 3)}${cm3}`),
    ),
    verify: () => close((3 * (2 * m * S3) * ap) / 2, 3 * m * ap * S3) && m * m + h * h === ap * ap,
  }
}

/** 6.7, 7 (**) */
export function triPyrFace60(rng: Rng): Made {
  const m = int(rng, 1, 15)
  return {
    text: `În piramida triunghiulară regulată $VABC$ se cunosc latura bazei, $\\ell = ${surd(2 * m, 1, 3)}$ cm, și unghiul dintre o față laterală și planul bazei, de $60^\\circ$. Aflați: a) aria totală și volumul; b) sinusul unghiului format de muchia laterală cu planul bazei.`,
    solution: lines(
      `a) Fie $O$ centrul bazei și $M$ mijlocul lui $BC$: $OM = \\frac{\\ell\\sqrt{3}}{6} = ${m}$ cm. Unghiul feței $(VBC)$ cu baza este $\\angle VMO = 60^\\circ$, deci $VO = OM\\sqrt{3} = ${surd(m, 1, 3)}$ cm și $VM = 2 \\cdot OM = ${2 * m}$ cm.`,
      show(`\\mathcal{A}_b = ${surd(3 * m * m, 1, 3)}${cm2}, \\quad \\mathcal{A}_l = \\frac{3\\ell \\cdot a_p}{2} = ${surd(6 * m * m, 1, 3)}${cm2}, \\quad \\mathcal{A}_t = ${surd(9 * m * m, 1, 3)}${cm2}, \\quad V = ${3 * m ** 3}${cm3}`),
      `b) $OA = 2 \\cdot OM = ${2 * m}$ cm și $VA = \\sqrt{${3 * m * m} + ${4 * m * m}} = ${surd(m, 1, 7)}$ cm:`,
      show(`\\sin(\\angle VAO) = \\frac{VO}{VA} = \\frac{\\sqrt{21}}{7}`),
    ),
    verify: () => close(((3 * m * m * S3) * m * S3) / 3, 3 * m ** 3) && close((m * S3) / (m * Math.sqrt(7)), Math.sqrt(21) / 7),
  }
}

/** 6.7, 8 (**): the lateral faces are right triangles. */
export function triPyrRightFaces(rng: Rng): Made {
  const j = int(rng, 1, 15)
  const e = 2 * j
  return {
    text: `Fețele laterale ale piramidei triunghiulare regulate $VABC$ sunt triunghiuri dreptunghice. Dacă aria laterală este de ${6 * j * j} cm², aflați: a) volumul; b) sinusul unghiului format de înălțimea piramidei cu o față laterală.`,
    solution: lines(
      `Fețele laterale sunt triunghiuri isoscele congruente, dreptunghice în $V$, deci $VA$, $VB$, $VC$ sunt perpendiculare două câte două. Cu $VA = e$: $\\mathcal{A}_l = 3 \\cdot \\frac{e^2}{2} = ${6 * j * j}$, deci $e = ${e}$ cm.`,
      'a) Privim piramida ca având vârful $A$ și baza $VBC$: $AV \\perp (VBC)$, deci',
      show(`V = \\frac{1}{3} \\cdot \\frac{${e} \\cdot ${e}}{2} \\cdot ${e} = ${frac(e ** 3, 6)}${cm3}`),
      `b) Fie $O$ centrul bazei și $M$ mijlocul lui $BC$. $BC \\perp (VOM)$, deci proiecția lui $VO$ pe $(VBC)$ este pe $VM$, iar unghiul este $\\angle OVM$. $BC = e\\sqrt{2} = ${surd(e, 1, 2)}$ cm, $VM = \\frac{BC}{2} = ${surd(j, 1, 2)}$ cm (mediana din unghiul drept) și $OM = \\frac{BC\\sqrt{3}}{6} = ${surd(j, 3, 6)}$ cm:`,
      show(`\\sin(\\angle OVM) = \\frac{OM}{VM} = \\frac{\\sqrt{3}}{3}`),
    ),
    verify: () => {
      const [V, A, B, C]: P[] = [[0, 0, 0], [e, 0, 0], [0, e, 0], [0, 0, e]]
      const vol = toPlane(V, A, B, C) * ((e * S2) ** 2 * S3 / 4) / 3
      return close(vol, e ** 3 / 6) && close(sinLP(V, [e / 3, e / 3, e / 3], V, B, C), S3 / 3)
    },
  }
}

/** 6.7, 9 (**) */
export function tetraFromV(rng: Rng): Made {
  const k = int(rng, 1, 12)
  const a = 6 * k
  return {
    text: `Fie tetraedrul regulat $VABC$ cu volumul de $${surd(18 * k ** 3, 1, 2)}$ cm³. Aflați muchia și aria totală a tetraedrului.`,
    solution: lines(
      'Tetraedrul regulat cu muchia $a$ are înălțimea $\\frac{a\\sqrt{6}}{3}$ și baza de arie $\\frac{a^2\\sqrt{3}}{4}$, deci volumul $\\frac{a^3\\sqrt{2}}{12}$:',
      show(`\\frac{a^3\\sqrt{2}}{12} = ${surd(18 * k ** 3, 1, 2)} \\Rightarrow a^3 = ${a ** 3} \\Rightarrow a = ${a}${cm}`),
      show(`\\mathcal{A}_t = 4 \\cdot \\frac{a^2\\sqrt{3}}{4} = ${surd(a * a, 1, 3)}${cm2}`),
    ),
    verify: () => close(((a * a * S3) / 4) * ((a * Math.sqrt(6)) / 3) / 3, 18 * k ** 3 * S2),
  }
}

/** 6.7, 12 (**) */
export function hexPyrVAh(rng: Rng): Made {
  const [l, h, e] = rightTriangle(rng, 40)
  const s = 4 * h * h + 3 * l * l
  const [kk, rr] = rootParts(s)
  return {
    text: `În piramida hexagonală regulată $VABCDEF$ se cunosc $VA = ${e}$ cm și înălțimea de ${h} cm. Aflați: a) aria totală și volumul; b) sinusul unghiului dintre apotema piramidei și planul bazei.`,
    solution: lines(
      `a) În hexagonul regulat, distanța de la centru la vârfuri este egală cu latura: $OA = \\ell$. Din triunghiul $VOA$: $\\ell = \\sqrt{${e * e} - ${h * h}} = ${l}$ cm. Apotema bazei: $a_b = ${surd(l, 2, 3)}$ cm, iar apotema piramidei:`,
      show(`a_p = \\sqrt{${h * h} + ${frac(3 * l * l, 4)}} = ${sqrtFrac(s, 4)}${cm}`),
      show(`\\mathcal{A}_b = ${surd(3 * l * l, 2, 3)}${cm2}, \\quad \\mathcal{A}_l = \\frac{6\\ell \\cdot a_p}{2} = ${surd(3 * l * kk, 2, rr)}${cm2}, \\quad V = \\frac{\\mathcal{A}_b \\cdot h}{3} = ${surd(l * l * h, 2, 3)}${cm3}`),
      `Aria totală este $${surd(3 * l * kk, 2, rr)} + ${surd(3 * l * l, 2, 3)}$ cm².`,
      show(`\\text{b) } \\sin(\\angle VMO) = \\frac{h}{a_p} = ${over(2 * h, s)}`),
    ),
    verify: () => l * l + h * h === e * e && close(Math.sqrt(h * h + (3 * l * l) / 4), (kk * Math.sqrt(rr)) / 2),
  }
}

/** 6.7, 13 (**) */
export function hexPyr60(rng: Rng): Made {
  const k = int(rng, 1, 15)
  return {
    text: `În piramida hexagonală regulată $VABCDEF$, muchia laterală are ${2 * k} cm și face cu planul bazei un unghi de $60^\\circ$. Aflați: a) aria totală și volumul; b) $\\sin(\\angle AVB)$.`,
    solution: lines(
      `a) Triunghiul $VOA$ este dreptunghic în $O$, cu $m(\\angle VAO) = 60^\\circ$: $OA = \\frac{VA}{2} = ${k}$ cm, deci $\\ell = ${k}$ cm, iar $h = ${surd(k, 1, 3)}$ cm. Apotema: $a_p = \\sqrt{VA^2 - \\frac{\\ell^2}{4}} = \\sqrt{${4 * k * k} - ${frac(k * k, 4)}} = ${surd(k, 2, 15)}$ cm.`,
      show(`\\mathcal{A}_b = ${surd(3 * k * k, 2, 3)}${cm2}, \\quad \\mathcal{A}_l = 3\\ell \\cdot a_p = ${surd(3 * k * k, 2, 15)}${cm2}, \\quad V = \\frac{${surd(3 * k * k, 2, 3)} \\cdot ${surd(k, 1, 3)}}{3} = ${frac(3 * k ** 3, 2)}${cm3}`),
      `Aria totală este $${surd(3 * k * k, 2, 15)} + ${surd(3 * k * k, 2, 3)}$ cm².`,
      `b) Aria triunghiului $AVB$ este $\\frac{AB \\cdot a_p}{2} = ${surd(k * k, 4, 15)}$ și, pe de altă parte, $\\frac{VA \\cdot VB \\cdot \\sin(\\angle AVB)}{2}$:`,
      show(`\\sin(\\angle AVB) = \\frac{2 \\cdot ${surd(k * k, 4, 15)}}{${4 * k * k}} = \\frac{\\sqrt{15}}{8}`),
    ),
    verify: () => {
      const V: P = [0, 0, k * S3]
      const [A, B]: P[] = [[k, 0, 0], [k / 2, (k * S3) / 2, 0]]
      const c = dot(sub(A, V), sub(B, V)) / (dist(A, V) * dist(B, V))
      return close(dist(V, A), 2 * k) && close(Math.sqrt(1 - c * c), Math.sqrt(15) / 8)
    },
  }
}

/** 6.6, 14 (***) */
export function quadPyrDihedral45(rng: Rng): Made {
  const l = int(rng, 2, 30)
  return {
    text: `Măsura unghiului diedru format de o față laterală cu planul bazei într-o piramidă patrulateră regulată $VABCD$ este de $45^\\circ$. Știind că aria totală este de $${l * l} + ${surd(l * l, 1, 2)}$ cm², aflați: a) volumul; b) $d(A, (VBC))$.`,
    solution: lines(
      `a) Fie $M$ mijlocul lui $BC$: unghiul diedru este $\\angle VMO = 45^\\circ$, deci $VO = OM = \\frac{\\ell}{2}$ și $a_p = VM = \\frac{\\ell\\sqrt{2}}{2}$. Atunci $\\mathcal{A}_t = \\ell^2 + 2\\ell \\cdot \\frac{\\ell\\sqrt{2}}{2} = \\ell^2(1 + \\sqrt{2})$, deci $\\ell^2 = ${l * l}$ și $\\ell = ${l}$ cm.`,
      show(`V = \\frac{${l * l} \\cdot ${frac(l, 2)}}{3} = ${frac(l ** 3, 6)}${cm3}`),
      'b) $AD \\parallel (VBC)$, deci $A$ și mijlocul $N$ al lui $AD$ sunt la aceeași distanță de $(VBC)$. $O$ este mijlocul lui $NM$, deci distanța de la $N$ este dublul distanței de la $O$. $BC \\perp (VOM)$, iar înălțimea din $O$ a triunghiului dreptunghic isoscel $VOM$ are $\\frac{OM\\sqrt{2}}{2}$:',
      show(`d(A, (VBC)) = 2 \\cdot \\frac{\\ell}{2} \\cdot \\frac{\\sqrt{2}}{2} = ${surd(l, 2, 2)}${cm}`),
    ),
    verify: () => {
      const s = l / 2
      const V: P = [0, 0, s]
      return close(toPlane([-s, -s, 0], V, [s, -s, 0], [s, s, 0]), (l * S2) / 2)
    },
  }
}

/** 6.7, 21 (***) */
export function tetraDistances(rng: Rng): Made {
  const a = int(rng, 2, 30)
  return {
    text: `Fie tetraedrul regulat $VABC$ cu muchia de ${a} cm. Aflați: a) cosinusul unghiului format de două fețe; b) distanța de la un vârf la fața opusă; c) distanța de la punctul de pe înălțime aflat la egală distanță de cele patru fețe până la o față.`,
    solution: lines(
      'a) Fie $M$ mijlocul lui $BC$ și $O$ centrul bazei. $VM \\perp BC$ și $AM \\perp BC$, deci unghiul fețelor $(VBC)$ și $(ABC)$ este $\\angle VMO$. $O$ este centrul de greutate, deci $OM = \\frac{AM}{3}$, iar $VM = AM$:',
      show(`\\cos(\\angle VMO) = \\frac{OM}{VM} = \\frac{1}{3}`),
      show(`\\text{b) } VO = \\sqrt{VA^2 - OA^2} = \\sqrt{${a * a} - ${frac(a * a, 3)}} = ${surd(a, 3, 6)}${cm}`),
      'c) Fie $r$ distanța de la acest punct la fiecare față. Tetraedrul se împarte în patru piramide cu vârful în punct, care au ca baze fețele: $4 \\cdot \\frac{\\mathcal{A}_b \\cdot r}{3} = \\frac{\\mathcal{A}_b \\cdot VO}{3}$, deci',
      show(`r = \\frac{VO}{4} = ${surd(a, 12, 6)}${cm}`),
    ),
    verify: () => {
      const [A, B, C]: P[] = [[0, 0, 0], [a, 0, 0], [a / 2, (a * S3) / 2, 0]]
      const V: P = [a / 2, (a * S3) / 6, (a * Math.sqrt(6)) / 3]
      return close(dist(V, A), a) && close(cosPP(V, B, C, A, B, C), 1 / 3)
    },
  }
}

/** 6.7, 17 (***) */
export function triPyr30edge(rng: Rng): Made {
  const k = int(rng, 1, 12)
  return {
    text: `O piramidă triunghiulară regulată $VABC$ are latura bazei de ${6 * k} cm, iar unghiul format de muchia laterală cu planul bazei are $30^\\circ$. Aflați: a) aria totală și volumul; b) muchia laterală; c) lungimea perpendicularei comune a dreptelor $BC$ și $VA$.`,
    solution: lines(
      `Fie $O$ centrul bazei și $M$ mijlocul lui $BC$: $AM = ${surd(3 * k, 1, 3)}$ cm, $OA = \\frac{2}{3}AM = ${surd(2 * k, 1, 3)}$ cm, $OM = ${surd(k, 1, 3)}$ cm. Unghiul muchiei $VA$ cu baza este $\\angle VAO = 30^\\circ$:`,
      show(`VO = OA \\cdot \\operatorname{tg} 30^\\circ = ${2 * k}${cm}, \\qquad VA = 2 \\cdot VO = ${4 * k}${cm}, \\qquad VM = \\sqrt{${4 * k * k} + ${3 * k * k}} = ${surd(k, 1, 7)}${cm}`),
      show(`\\text{a) } \\mathcal{A}_t = ${surd(9 * k * k, 1, 3)} + \\frac{3 \\cdot ${6 * k} \\cdot ${surd(k, 1, 7)}}{2} = ${surd(9 * k * k, 1, 3)} + ${surd(9 * k * k, 1, 7)}${cm2}, \\qquad V = \\frac{${surd(9 * k * k, 1, 3)} \\cdot ${2 * k}}{3} = ${surd(6 * k ** 3, 1, 3)}${cm3}`),
      `b) $VA = ${4 * k}$ cm.`,
      'c) $BC \\perp AM$ și $BC \\perp VO$, deci $BC \\perp (VAM)$. Perpendiculara $MN$ din $M$ pe $VA$ este în planul $(VAM)$, deci e perpendiculară și pe $BC$: ea este perpendiculara comună. Din aria triunghiului $VAM$:',
      show(`MN = \\frac{AM \\cdot VO}{VA} = \\frac{${surd(3 * k, 1, 3)} \\cdot ${2 * k}}{${4 * k}} = ${surd(3 * k, 2, 3)}${cm}`),
    ),
    verify: () => {
      const r = 2 * k * S3
      const A: P = [r, 0, 0]
      const M: P = [-r / 2, 0, 0]
      const V: P = [0, 0, 2 * k]
      return close(dist(V, A), 4 * k) && close(toLine(M, V, A), (3 * k * S3) / 2)
    },
  }
}

/** 6.7, 26 (***): with the shortest path of an ant from E to C over the lateral faces. */
export function hexPyr45(rng: Rng): Made {
  const k = int(rng, 1, 12)
  return {
    text: `Într-o piramidă hexagonală regulată $VABCDEF$ cu înălțimea de ${3 * k} cm, o față laterală face cu planul bazei un unghi de $45^\\circ$. Aflați: a) aria totală și volumul; b) lungimea drumului celui mai scurt pe care îl parcurge o furnică ce merge pe suprafața laterală a piramidei de la $E$ la $C$.`,
    solution: lines(
      `a) Fie $M$ mijlocul lui $DE$: unghiul feței cu baza este $\\angle VMO = 45^\\circ$, deci $OM = VO = ${3 * k}$ cm și $a_p = VM = ${surd(3 * k, 1, 2)}$ cm. Apotema bazei este $\\frac{\\ell\\sqrt{3}}{2}$, deci $\\ell = \\frac{2 \\cdot ${3 * k}}{\\sqrt{3}} = ${surd(2 * k, 1, 3)}$ cm.`,
      show(`\\mathcal{A}_t = ${surd(18 * k * k, 1, 3)} + ${surd(18 * k * k, 1, 6)}${cm2}, \\qquad V = \\frac{${surd(18 * k * k, 1, 3)} \\cdot ${3 * k}}{3} = ${surd(18 * k ** 3, 1, 3)}${cm3}`),
      `b) Muchia laterală: $VE = \\sqrt{VO^2 + OE^2} = \\sqrt{${9 * k * k} + ${12 * k * k}} = ${surd(k, 1, 21)}$ cm. Desfășurăm fețele $VED$ și $VDC$ în plan, alăturate de-a lungul lui $VD$; drumul cel mai scurt este segmentul $EC$ din desfășurare. Cu $\\alpha = m(\\angle EVD)$, din aria triunghiului $VED$:`,
      show(`\\sin\\alpha = \\frac{\\ell \\cdot a_p}{VE^2} = \\frac{${surd(2 * k, 1, 3)} \\cdot ${surd(3 * k, 1, 2)}}{${21 * k * k}} = \\frac{2\\sqrt{6}}{7}`),
      'Triunghiul $EVC$ din desfășurare este isoscel, cu unghiul din vârf $2\\alpha$, deci',
      show(`EC = 2 \\cdot VE \\cdot \\sin\\alpha = 2 \\cdot ${surd(k, 1, 21)} \\cdot \\frac{2\\sqrt{6}}{7} = ${surd(12 * k, 7, 14)}${cm}`),
    ),
    verify: () => {
      const l = 2 * k * S3
      const e = k * Math.sqrt(21)
      const alpha = 2 * Math.asin(l / (2 * e))
      return close(Math.sin(alpha), (2 * Math.sqrt(6)) / 7) && close(2 * e * Math.sin(alpha), (12 * k * Math.sqrt(14)) / 7) && alpha < Math.PI / 2
    },
  }
}

/** 6.6, 17 (***): a pyramid full of water poured into a square prism. */
export function pyramidWaterToPrism(rng: Rng): Made {
  for (;;) {
    const l = int(rng, 4, 30)
    const h = int(rng, 3, 30)
    const L = int(rng, 5, 40)
    if (L === l) continue
    return {
      text: `O piramidă patrulateră regulată cu latura bazei de ${l} cm și înălțimea de ${h} cm este plină cu apă. Apa se toarnă într-un vas în formă de prismă patrulateră regulată, cu latura bazei de ${L} cm. Până la ce înălțime se ridică apa în vas?`,
      solution: lines(
        show(`V = \\frac{${l * l} \\cdot ${h}}{3} = ${frac(l * l * h, 3)}${cm3}`),
        `În vas, apa ocupă o prismă cu baza de ${L * L} cm² și înălțimea $x$:`,
        show(`${L * L} \\cdot x = ${frac(l * l * h, 3)} \\Rightarrow x = ${frac(l * l * h, 3 * L * L)}${cm}`),
      ),
      verify: () => close(L * L * ((l * l * h) / (3 * L * L)), (l * l * h) / 3),
    }
  }
}

/** 6.6, 23 (***): a tent with a floor. */
export function tent(rng: Rng): Made {
  // a tent of a few metres: the base side is x/2, the height y/4 and the apothem z/4, with x² + y² = z²
  let x = 0, y = 0, z = 0
  do [x, y, z] = rightTriangle(rng, 25)
  while (x * x * y < 48 || x > 16)
  const [l, h, ap] = [x / 2, y / 4, z / 4]
  const area = l * l + 2 * l * ap
  const [vn, vd] = [x * x * y, 48]
  const people = Math.floor(vn / vd)
  return {
    text: `Un cort cu podea are forma unei piramide patrulatere regulate, cu latura bazei de ${decT(l)} m și înălțimea de ${decT(h)} m. a) Câtă pânză s-a folosit pentru cort, cu tot cu podea? b) Dacă un om are nevoie de 1 m³ de aer, câți oameni pot dormi în cort?`,
    solution: lines(
      `a) Apotema bazei este $${dec(l / 2)}$ m, iar apotema piramidei: $a_p = \\sqrt{${dec(h)}^2 + ${dec(l / 2)}^2} = ${dec(ap)}$ m.`,
      `Pânza acoperă baza și fețele laterale: $\\ell^2 + 2\\ell \\cdot a_p = ${dec(l * l)} + 2 \\cdot ${dec(l)} \\cdot ${dec(ap)} = ${dec(area)}$ m².`,
      `b) $V = \\frac{${dec(l * l)} \\cdot ${dec(h)}}{3} = ${frac(vn, vd)}${Number.isInteger(vn / vd) ? '' : ` \\approx ${dec(vn / vd)}`}$ m³, deci în cort pot dormi ${people === 1 ? 'un om' : `${de(people)} oameni`}.`,
    ),
    verify: () => close(h * h + (l / 2) ** 2, ap * ap) && close((l * l * h) / 3, vn / vd) && people >= 1,
  }
}

// ================= 6.8–6.9, 6.12–6.13 frustums and the sphere =================

/** 6.8, 1 (*) */
export function quadFrustumTable(rng: Rng): Made {
  const [x, h, at] = rightTriangle(rng, 30)
  const l = int(rng, 2, 30)
  const L = l + 2 * x
  const Al = 2 * (L + l) * at
  return {
    text: `Un trunchi de piramidă patrulateră regulată are laturile bazelor de ${L} cm și ${l} cm și înălțimea de ${h} cm. Aflați apotema trunchiului, muchia laterală, aria totală și volumul.`,
    solution: lines(
      `Apotema trunchiului este latura oblică a trapezului dreptunghic cu înălțimea $h$ și diferența apotemelor bazelor $\\frac{${L} - ${l}}{2} = ${x}$ cm:`,
      show(`a_t = \\sqrt{${h * h} + ${x * x}} = ${at}${cm}`),
      `Fața laterală este un trapez isoscel cu înălțimea $a_t$, iar muchia laterală este latura lui oblică: $m = \\sqrt{${at * at} + ${x * x}} = ${root(at * at + x * x)}$ cm.`,
      show(`\\mathcal{A}_l = \\frac{(${4 * L} + ${4 * l}) \\cdot ${at}}{2} = ${Al}${cm2}, \\qquad \\mathcal{A}_t = ${Al} + ${L * L} + ${l * l} = ${Al + L * L + l * l}${cm2}`),
      show(`V = \\frac{h(\\mathcal{A}_B + \\mathcal{A}_b + \\sqrt{\\mathcal{A}_B \\cdot \\mathcal{A}_b})}{3} = \\frac{${h}(${L * L} + ${l * l} + ${L * l})}{3} = ${frac(h * (L * L + l * l + L * l), 3)}${cm3}`),
    ),
    verify: () => {
      const H = (h * L) / (L - l)
      return close((L * L * H - l * l * (H - h)) / 3, (h * (L * L + l * l + L * l)) / 3)
    },
  }
}

/** 6.12, 1 (*) */
export function coneFrustumTable(rng: Rng): Made {
  const [x, h, G] = rightTriangle(rng, 30)
  const r = int(rng, 1, 20)
  const R = r + x
  return {
    text: `Un trunchi de con circular drept are razele bazelor de ${R} cm și ${r} cm și înălțimea de ${h} cm. Aflați generatoarea, aria totală și volumul trunchiului.`,
    solution: lines(
      `În secțiunea axială (un trapez isoscel), generatoarea este ipotenuza unui triunghi dreptunghic cu catetele $h$ și $R - r = ${x}$ cm:`,
      show(`G = \\sqrt{${h * h} + ${x * x}} = ${G}${cm}`),
      show(`\\mathcal{A}_l = \\pi G(R + r) = ${pi(G * (R + r))}${cm2}, \\qquad \\mathcal{A}_t = ${pi(G * (R + r))} + ${pi(R * R)} + ${pi(r * r)} = ${pi(G * (R + r) + R * R + r * r)}${cm2}`),
      show(`V = \\frac{\\pi h(R^2 + r^2 + Rr)}{3} = ${pi(h * (R * R + r * r + R * r), 3)}${cm3}`),
    ),
    verify: () => {
      const H = (h * R) / x
      return close((R * R * H - r * r * (H - h)) / 3, (h * (R * R + r * r + R * r)) / 3)
    },
  }
}

/** 6.13, 3 (*) */
export function sphereFromVolume(rng: Rng): Made {
  const R = int(rng, 1, 30)
  return {
    text: `Să se afle raza și aria sferei cu volumul de $${pi(4 * R ** 3, 3)}$ cm³.`,
    solution: lines(
      show(`\\frac{4\\pi R^3}{3} = ${pi(4 * R ** 3, 3)} \\Rightarrow R^3 = ${R ** 3} \\Rightarrow R = ${R}${cm}`),
      show(`\\mathcal{A} = 4\\pi R^2 = ${pi(4 * R * R)}${cm2}`),
    ),
    verify: () => close(Math.cbrt(R ** 3), R),
  }
}

/** 6.9, 3 (*) */
export function hexFrustum(rng: Rng): Made {
  const [t, h] = pick(rng, PAIRS3)
  const l = int(rng, 2, 20)
  const L = l + 2 * t
  const at = Math.sqrt(h * h + 3 * t * t)
  return {
    text: `În trunchiul de piramidă hexagonală regulată $ABCDEFA'B'C'D'E'F'$ se cunosc $AB = ${L}$ cm, $A'B' = ${l}$ cm și înălțimea de ${h} cm. Aflați aria totală și volumul trunchiului.`,
    solution: lines(
      `Apotemele bazelor sunt $\\frac{${L}\\sqrt{3}}{2}$ și $\\frac{${l}\\sqrt{3}}{2}$, cu diferența $${surd(t, 1, 3)}$ cm. Apotema trunchiului:`,
      show(`a_t = \\sqrt{${h * h} + ${3 * t * t}} = ${at}${cm}`),
      show(`\\mathcal{A}_l = \\frac{(6 \\cdot ${L} + 6 \\cdot ${l}) \\cdot ${at}}{2} = ${3 * (L + l) * at}${cm2}, \\quad \\mathcal{A}_B = ${surd(3 * L * L, 2, 3)}${cm2}, \\quad \\mathcal{A}_b = ${surd(3 * l * l, 2, 3)}${cm2}`),
      show(`\\mathcal{A}_t = ${3 * (L + l) * at} + ${surd(3 * (L * L + l * l), 2, 3)}${cm2}, \\qquad V = \\frac{h}{3} \\cdot \\frac{3\\sqrt{3}}{2}(L^2 + \\ell^2 + L\\ell) = ${surd(h * (L * L + l * l + L * l), 2, 3)}${cm3}`),
    ),
    verify: () => {
      const hex = (s: number) => (3 * s * s * S3) / 2
      return close((h / 3) * (hex(L) + hex(l) + Math.sqrt(hex(L) * hex(l))), (h * (L * L + l * l + L * l) * S3) / 2)
    },
  }
}

/** 6.8, 2 (**) */
export function pyramidCutFrustum(rng: Rng): Made {
  for (;;) {
    const [p, q] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]] as const)
    const m = int(rng, 1, 8)
    const n = int(rng, 1, 8)
    const [l, s, h] = [q * m, p * m, q * n]
    if ((l * l * h) % 3 !== 0) continue
    const V = (l * l * h) / 3
    const small = (V * p ** 3) / q ** 3
    return {
      text: `Piramida patrulateră regulată cu înălțimea de ${h} cm și volumul de ${V} cm³ se secționează cu un plan paralel cu baza, astfel încât aria secțiunii este de ${s * s} cm². Aflați înălțimea și volumul trunchiului de piramidă obținut.`,
      solution: lines(
        `$\\ell^2 = \\frac{3V}{h} = ${l * l}$, deci $\\ell = ${l}$ cm, iar secțiunea este un pătrat cu latura de ${s} cm. Piramida mică este asemenea cu cea mare, în raportul $k = \\frac{${s}}{${l}} = ${frac(p, q)}$: înălțimea ei este $${h} \\cdot ${frac(p, q)} = ${p * n}$ cm, iar volumul ei este $k^3 \\cdot V$.`,
        show(`V' = ${frac(p ** 3, q ** 3)} \\cdot ${V} = ${frac(V * p ** 3, q ** 3)}${cm3}, \\qquad V_t = ${V} - ${frac(V * p ** 3, q ** 3)} = ${frac(V * (q ** 3 - p ** 3), q ** 3)}${cm3}`),
        `Înălțimea trunchiului este $${h} - ${p * n} = ${h - p * n}$ cm.`,
      ),
      verify: () => close(V - small, ((h - p * n) * (l * l + s * s + l * s)) / 3),
    }
  }
}

/** 6.11, 13 and 6.12, 7 (**): a cone cut at p/q of its height from the vertex. */
export function coneCut(rng: Rng): Made {
  const [R0, h0, G0] = rightTriangle(rng, 20)
  const [p, q] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]] as const)
  const [R, h, G] = [q * R0, q * h0, q * G0]
  const [r, hs, g] = [p * R0, p * h0, p * G0]
  const ht = h - hs
  return {
    text: `Un con circular drept cu raza de ${R} cm și generatoarea de ${G} cm se secționează cu un plan paralel cu baza, dus la $\\frac{${p}}{${q}}$ din înălțime față de vârf. Aflați aria totală și volumul trunchiului de con obținut.`,
    solution: lines(
      `$h = \\sqrt{${G * G} - ${R * R}} = ${h}$ cm. Conul mic este asemenea cu cel mare, în raportul $\\frac{${p}}{${q}}$: are raza $r = ${r}$ cm, înălțimea ${hs} cm și generatoarea ${g} cm.`,
      `Trunchiul are razele ${R} cm și ${r} cm, generatoarea $${G} - ${g} = ${G - g}$ cm și înălțimea $${h} - ${hs} = ${ht}$ cm.`,
      show(`\\mathcal{A}_t = \\pi \\cdot ${G - g}(${R} + ${r}) + \\pi \\cdot ${R * R} + \\pi \\cdot ${r * r} = ${pi((G - g) * (R + r) + R * R + r * r)}${cm2}`),
      show(`V = \\frac{\\pi \\cdot ${ht}(${R * R} + ${r * r} + ${R * r})}{3} = ${pi(ht * (R * R + r * r + R * r), 3)}${cm3}`),
    ),
    verify: () => close((R * R * h - r * r * hs) / 3, (ht * (R * R + r * r + R * r)) / 3),
  }
}

/** 6.13, 5 and 8 (**) */
export function sphereSection(rng: Rng): Made {
  const [d, r, R] = rightTriangle(rng, 40)
  return {
    text: `O sferă cu raza de ${R} cm este secționată de un plan aflat la ${d} cm de centrul ei. Aflați aria secțiunii și ariile celor două calote sferice obținute.`,
    solution: lines(
      `Raza cercului de secțiune: $r = \\sqrt{${R * R} - ${d * d}} = ${r}$ cm, deci aria secțiunii este $${pi(r * r)}$ cm².`,
      `Calotele au înălțimile $${R} - ${d} = ${R - d}$ cm și $${R} + ${d} = ${R + d}$ cm, iar aria unei calote este $2\\pi R h$:`,
      show(`\\mathcal{A}_1 = 2\\pi \\cdot ${R} \\cdot ${R - d} = ${pi(2 * R * (R - d))}${cm2}, \\qquad \\mathcal{A}_2 = 2\\pi \\cdot ${R} \\cdot ${R + d} = ${pi(2 * R * (R + d))}${cm2}`),
    ),
    verify: () => 2 * R * (R - d) + 2 * R * (R + d) === 4 * R * R,
  }
}

/** 6.13, 9 (**) */
export function sphereZone(rng: Rng): Made {
  const R = int(rng, 2, 30)
  const h = int(rng, 1, 2 * R - 1)
  return {
    text: `O sferă este intersectată de două plane paralele, aflate la ${h} cm unul de altul. Știind că aria zonei sferice dintre ele este de $${pi(2 * R * h)}$ cm², aflați aria și volumul sferei.`,
    solution: lines(
      'Aria zonei sferice este $2\\pi R h$, unde $h$ este distanța dintre plane:',
      show(`2\\pi R \\cdot ${h} = ${pi(2 * R * h)} \\Rightarrow R = ${R}${cm}`),
      show(`\\mathcal{A} = 4\\pi R^2 = ${pi(4 * R * R)}${cm2}, \\qquad V = \\frac{4\\pi R^3}{3} = ${pi(4 * R ** 3, 3)}${cm3}`),
    ),
    verify: () => h < 2 * R,
  }
}

/** 6.9, 13 (**): a hexagonal pyramid cut through the midpoint of its height. */
export function hexPyrMidCut(rng: Rng): Made {
  const [t, H] = pick(rng, PAIRS3)
  const ap = Math.sqrt(H * H + 3 * t * t)
  return {
    text: `Piramida hexagonală regulată $VABCDEF$ cu $VO = ${H}$ cm și $AB = ${2 * t}$ cm se secționează cu un plan paralel cu baza, dus prin mijlocul înălțimii. Aflați aria totală și volumul trunchiului obținut.`,
    solution: lines(
      `Apotema bazei este $${surd(t, 1, 3)}$ cm, iar apotema piramidei: $a_p = \\sqrt{${H * H} + ${3 * t * t}} = ${ap}$ cm. Planul trece prin mijlocul înălțimii, deci piramida mică are toate dimensiunile pe jumătate: latura de ${t} cm, iar apotema trunchiului este $\\frac{${ap}}{2} = ${frac(ap, 2)}$ cm.`,
      show(`\\mathcal{A}_l = \\frac{(6 \\cdot ${2 * t} + 6 \\cdot ${t}) \\cdot ${frac(ap, 2)}}{2} = ${frac(9 * t * ap, 2)}${cm2}, \\quad \\mathcal{A}_B = ${surd(6 * t * t, 1, 3)}${cm2}, \\quad \\mathcal{A}_b = ${surd(3 * t * t, 2, 3)}${cm2}`),
      `Aria totală este $${frac(9 * t * ap, 2)} + ${surd(15 * t * t, 2, 3)}$ cm². Piramida mică are volumul $\\left(\\frac{1}{2}\\right)^3 = \\frac{1}{8}$ din volumul piramidei mari, deci trunchiul are $\\frac{7}{8}$ din el:`,
      show(`V = \\frac{7}{8} \\cdot \\frac{${surd(6 * t * t, 1, 3)} \\cdot ${H}}{3} = ${surd(7 * t * t * H, 4, 3)}${cm3}`),
    ),
    verify: () => {
      const hex = (s: number) => (3 * s * s * S3) / 2
      return close((H / 2 / 3) * (hex(2 * t) + hex(t) + Math.sqrt(hex(2 * t) * hex(t))), (7 * t * t * H * S3) / 4)
    },
  }
}

/** 6.13, 10 (***): a frustum of a cone circumscribed about a sphere. */
export function frustumSphere(rng: Rng): Made {
  for (;;) {
    const c = int(rng, 1, 3)
    const [a, b] = [int(rng, 1, 5), int(rng, 1, 6)]
    if (a >= b) continue
    const [r, R, rho] = [c * a * a, c * b * b, c * a * b]
    return {
      text: `Un trunchi de con circular drept este circumscris unei sfere și are razele bazelor de ${r} cm și ${R} cm. Aflați: a) aria totală și volumul trunchiului; b) aria și volumul sferei.`,
      solution: lines(
        `Secțiunea axială este un trapez isoscel circumscris unui cerc mare al sferei. Într-un patrulater circumscris, sumele laturilor opuse sunt egale: $2G = 2R + 2r$, deci $G = ${R + r}$ cm. Înălțimea trunchiului este diametrul sferei:`,
        show(`h = \\sqrt{G^2 - (R - r)^2} = \\sqrt{${(R + r) ** 2} - ${(R - r) ** 2}} = ${2 * rho}${cm}`),
        show(`\\text{a) } \\mathcal{A}_t = \\pi G(R + r) + \\pi R^2 + \\pi r^2 = ${pi((R + r) ** 2 + R * R + r * r)}${cm2}, \\qquad V = \\frac{\\pi h(R^2 + r^2 + Rr)}{3} = ${pi(2 * rho * (R * R + r * r + R * r), 3)}${cm3}`),
        `b) Raza sferei este $\\frac{h}{2} = ${rho}$ cm:`,
        show(`\\mathcal{A} = 4\\pi \\cdot ${rho * rho} = ${pi(4 * rho * rho)}${cm2}, \\qquad V = \\frac{4\\pi \\cdot ${rho ** 3}}{3} = ${pi(4 * rho ** 3, 3)}${cm3}`),
      ),
      verify: () => (R + r) ** 2 - (R - r) ** 2 === (2 * rho) ** 2,
    }
  }
}

/** 6.12, 16 and the tests (***): where to cut a cone for a given ratio of lateral areas or volumes. */
export function coneCutRatio(rng: Rng): Made {
  const [p, q] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5]] as const)
  const H = q * int(rng, 1, 12)
  const areas = rng() < 0.5
  const n = areas ? 2 : 3
  const ratio = frac(p ** n, q ** n - p ** n)
  const hs = (H * p) / q
  return {
    text: `Un con circular drept cu înălțimea de ${H} cm se secționează cu un plan paralel cu baza. La ce distanță de bază se face secțiunea, dacă raportul dintre ${areas ? 'aria laterală a conului mic și aria laterală a trunchiului' : 'volumul conului mic și volumul trunchiului'} este $${ratio}$?`,
    solution: lines(
      `Conul mic este asemenea cu cel mare; fie $k$ raportul de asemănare. Raportul ${areas ? 'ariilor laterale' : 'volumelor'} celor două conuri este $k^${n}$, deci raportul dintre conul mic și trunchi este $\\frac{k^${n}}{1 - k^${n}} = ${ratio}$.`,
      `De aici $k^${n} = ${frac(p ** n, q ** n)}$ și $k = ${frac(p, q)}$. Conul mic are înălțimea $${H} \\cdot ${frac(p, q)} = ${hs}$ cm, deci secțiunea se face la`,
      show(`${H} - ${hs} = ${H - hs}${cm}`),
    ),
    verify: () => close((hs / H) ** n / (1 - (hs / H) ** n), p ** n / (q ** n - p ** n)),
  }
}

// ================= 6.10–6.11 the cylinder and the cone =================

/** 6.10, 1 (*) */
export function cylinderFromV(rng: Rng): Made {
  const R = int(rng, 1, 20)
  const G = int(rng, 1, 30)
  return {
    text: `Volumul unui cilindru circular drept este de $${pi(R * R * G)}$ cm³. Știind că raza este de ${R} cm, aflați aria laterală și aria totală a cilindrului.`,
    solution: lines(
      show(`\\pi \\cdot ${R * R} \\cdot G = ${pi(R * R * G)} \\Rightarrow G = ${G}${cm}`),
      show(`\\mathcal{A}_l = 2\\pi RG = ${pi(2 * R * G)}${cm2}, \\qquad \\mathcal{A}_t = 2\\pi R(R + G) = ${pi(2 * R * (R + G))}${cm2}`),
    ),
    verify: () => 2 * R * G + 2 * R * R === 2 * R * (R + G),
  }
}

/** 6.10, 2 (*) */
export function cylinderBasic(rng: Rng): Made {
  for (;;) {
    const [x, G, d] = rightTriangle(rng, 50)
    if (x % 2) continue
    const R = x / 2
    return {
      text: `Un cilindru circular drept are $R = ${R}$ cm și $G = ${G}$ cm. Aflați volumul, aria totală și cosinusul unghiului format de diagonala secțiunii axiale cu planul bazei.`,
      solution: lines(
        show(`V = \\pi R^2 G = ${pi(R * R * G)}${cm3}, \\qquad \\mathcal{A}_t = 2\\pi R(R + G) = ${pi(2 * R * (R + G))}${cm2}`),
        `Secțiunea axială este un dreptunghi cu laturile $2R = ${x}$ cm și $G = ${G}$ cm, cu diagonala $\\sqrt{${x * x} + ${G * G}} = ${d}$ cm. Proiecția diagonalei pe bază este diametrul:`,
        show(`\\cos = \\frac{2R}{d} = ${frac(x, d)}`),
      ),
      verify: () => x * x + G * G === d * d,
    }
  }
}

/** 6.10, 3 (*) */
export function cylinderFromAl(rng: Rng): Made {
  const R = int(rng, 1, 20)
  const G = int(rng, 2, 30)
  return {
    text: `Aria laterală a unui cilindru circular drept este de $${pi(2 * R * G)}$ cm², iar generatoarea este de ${G} cm. Aflați volumul și aria totală.`,
    solution: lines(
      show(`2\\pi R \\cdot ${G} = ${pi(2 * R * G)} \\Rightarrow R = ${R}${cm}`),
      show(`V = \\pi R^2 G = ${pi(R * R * G)}${cm3}, \\qquad \\mathcal{A}_t = ${pi(2 * R * G)} + ${pi(2 * R * R)} = ${pi(2 * R * (R + G))}${cm2}`),
    ),
    verify: () => 2 * R * G + 2 * R * R === 2 * R * (R + G),
  }
}

/** 6.11, 1 (*) */
export function coneTable(rng: Rng): Made {
  const [R, h, G] = rightTriangle(rng, 40)
  const v = int(rng, 0, 2)
  const given = [`raza bazei de ${R} cm și generatoarea de ${G} cm`, `raza bazei de ${R} cm și înălțimea de ${h} cm`, `înălțimea de ${h} cm și generatoarea de ${G} cm`][v]
  const missing = ['înălțimea', 'generatoarea', 'raza bazei'][v]
  const step = [`h = \\sqrt{${G * G} - ${R * R}} = ${h}`, `G = \\sqrt{${R * R} + ${h * h}} = ${G}`, `R = \\sqrt{${G * G} - ${h * h}} = ${R}`][v]
  return {
    text: `Un con circular drept are ${given}. Aflați ${missing}, aria bazei, aria laterală, aria totală și volumul conului.`,
    solution: lines(
      'Înălțimea, raza și generatoarea formează un triunghi dreptunghic, cu ipotenuza $G$:',
      show(`${step}${cm}`),
      show(`\\mathcal{A}_b = \\pi R^2 = ${pi(R * R)}${cm2}, \\quad \\mathcal{A}_l = \\pi RG = ${pi(R * G)}${cm2}, \\quad \\mathcal{A}_t = ${pi(R * (R + G))}${cm2}, \\quad V = \\frac{\\pi R^2 h}{3} = ${pi(R * R * h, 3)}${cm3}`),
    ),
    verify: () => R * R + h * h === G * G,
  }
}

/** 6.11, 2 (*) */
export function coneFromAt(rng: Rng): Made {
  const [R, h, G] = rightTriangle(rng, 40)
  return {
    text: `Un con circular drept are raza de ${R} cm și aria totală de $${pi(R * (R + G))}$ cm². Aflați: a) volumul; b) aria secțiunii axiale.`,
    solution: lines(
      `$\\mathcal{A}_t = \\pi R(R + G)$: $${R}(${R} + G) = ${R * (R + G)}$, deci $G = ${G}$ cm, iar $h = \\sqrt{${G * G} - ${R * R}} = ${h}$ cm.`,
      show(`\\text{a) } V = \\frac{\\pi \\cdot ${R * R} \\cdot ${h}}{3} = ${pi(R * R * h, 3)}${cm3}`),
      `b) Secțiunea axială este un triunghi isoscel cu baza $2R$ și înălțimea $h$: $\\mathcal{A} = R \\cdot h = ${R * h}$ cm².`,
    ),
    verify: () => R * R + h * h === G * G,
  }
}

/** 6.10, 5 (**) */
export function cylinderVAl(rng: Rng): Made {
  const R = int(rng, 1, 20)
  const G = int(rng, 1, 30)
  return {
    text: `Un cilindru circular drept are volumul de $${pi(R * R * G)}$ cm³ și aria laterală de $${pi(2 * R * G)}$ cm². Aflați aria totală și diagonala secțiunii axiale.`,
    solution: lines(
      show(`\\frac{V}{\\mathcal{A}_l} = \\frac{\\pi R^2 G}{2\\pi RG} = \\frac{R}{2} = ${frac(R, 2)} \\Rightarrow R = ${R}${cm}, \\qquad G = \\frac{${pi(2 * R * G)}}{${pi(2 * R)}} = ${G}${cm}`),
      show(`\\mathcal{A}_t = 2\\pi R(R + G) = ${pi(2 * R * (R + G))}${cm2}, \\qquad d = \\sqrt{(2R)^2 + G^2} = \\sqrt{${4 * R * R} + ${G * G}} = ${root(4 * R * R + G * G)}${cm}`),
    ),
    verify: () => close((R * R * G) / (2 * R * G), R / 2),
  }
}

/** 6.10, 6 (**) */
export function cylinderSectionV(rng: Rng): Made {
  const R = int(rng, 1, 20)
  const G = int(rng, 1, 30)
  return {
    text: `Aria secțiunii axiale a unui cilindru circular drept este de ${2 * R * G} cm², iar volumul este de $${pi(R * R * G)}$ cm³. Aflați: a) aria totală; b) latura triunghiului echilateral înscris în cercul de la bază.`,
    solution: lines(
      `Secțiunea axială este un dreptunghi cu laturile $2R$ și $G$, deci aria ei este $2RG$. Împărțind volumul la ea:`,
      show(`\\frac{\\pi R^2 G}{2RG} = \\frac{\\pi R}{2} = \\frac{${pi(R * R * G)}}{${2 * R * G}} = ${pi(R, 2)} \\Rightarrow R = ${R}${cm}, \\qquad G = \\frac{${2 * R * G}}{${2 * R}} = ${G}${cm}`),
      show(`\\text{a) } \\mathcal{A}_t = 2\\pi R(R + G) = ${pi(2 * R * (R + G))}${cm2}`),
      `b) Latura triunghiului echilateral înscris într-un cerc de rază $R$ este $R\\sqrt{3} = ${surd(R, 1, 3)}$ cm.`,
    ),
    verify: () => close(2 * R * Math.sin(Math.PI / 3), R * S3),
  }
}

/** 6.10, 10 and 14 (**) */
export function cylinderSquareSection(rng: Rng): Made {
  const R = int(rng, 1, 25)
  const byDiag = rng() < 0.5
  return {
    text: `Secțiunea axială a unui cilindru circular drept este un pătrat ${byDiag ? `cu diagonala de $${surd(2 * R, 1, 2)}$ cm` : `cu perimetrul de ${8 * R} cm`}. Aflați aria laterală, aria totală și volumul cilindrului.`,
    solution: lines(
      `Latura pătratului este $2R = G$. ${byDiag ? `Din $2R\\sqrt{2} = ${surd(2 * R, 1, 2)}$` : `Din $4 \\cdot 2R = ${8 * R}$`} obținem $R = ${R}$ cm și $G = ${2 * R}$ cm.`,
      show(`\\mathcal{A}_l = 2\\pi RG = ${pi(4 * R * R)}${cm2}, \\quad \\mathcal{A}_t = ${pi(6 * R * R)}${cm2}, \\quad V = \\pi R^2 G = ${pi(2 * R ** 3)}${cm3}`),
    ),
    verify: () => close(2 * R * S2, Math.hypot(2 * R, 2 * R)),
  }
}

/** 6.10, 12 (**) */
export function cylinderProportional(rng: Rng): Made {
  for (;;) {
    const [p, q] = [int(rng, 1, 6), int(rng, 1, 6)]
    if (p === q) continue
    const k = int(rng, 1, 10)
    const s = 4 * p * p + q * q
    const [kk, rr] = rootParts(s)
    const unit = surd(kk, 1, rr)
    return {
      text: `Raza și înălțimea unui cilindru circular drept sunt direct proporționale cu numerele ${p} și ${q}, iar diagonala secțiunii axiale este de $${surd(k * kk, 1, rr)}$ cm. Aflați aria laterală, aria totală și volumul.`,
      solution: lines(
        `$R = ${kc(p)}k$ și $G = ${kc(q)}k$. Secțiunea axială este un dreptunghi cu laturile $2R = ${2 * p}k$ și $G$: $d = \\sqrt{${4 * p * p}k^2 + ${kc(q * q)}k^2} = ${unit === '1' ? '' : unit}k$. Din $${unit === '1' ? '' : unit}k = ${surd(k * kk, 1, rr)}$ obținem $k = ${k}$, deci $R = ${p * k}$ cm și $G = ${q * k}$ cm.`,
        show(`\\mathcal{A}_l = ${pi(2 * p * q * k * k)}${cm2}, \\quad \\mathcal{A}_t = ${pi(2 * p * k * (p * k + q * k))}${cm2}, \\quad V = ${pi(p * p * q * k ** 3)}${cm3}`),
      ),
      verify: () => close(Math.sqrt(4 * (p * k) ** 2 + (q * k) ** 2), k * kk * Math.sqrt(rr)),
    }
  }
}

/** 6.11, 3 (**) */
export function coneFromAbV(rng: Rng): Made {
  const [R, h, G] = rightTriangle(rng, 40)
  return {
    text: `Aria bazei unui con circular drept este de $${pi(R * R)}$ cm², iar volumul este de $${pi(R * R * h, 3)}$ cm³. Aflați: a) aria totală; b) tangenta unghiului format de generatoare cu planul bazei.`,
    solution: lines(
      `$R = ${R}$ cm, iar $h = \\frac{3V}{\\mathcal{A}_b} = ${h}$ cm, deci $G = \\sqrt{${R * R} + ${h * h}} = ${G}$ cm.`,
      show(`\\text{a) } \\mathcal{A}_t = \\pi R(R + G) = ${pi(R * (R + G))}${cm2}`),
      `b) Proiecția generatoarei pe bază este raza, deci tangenta unghiului este $\\frac{h}{R} = ${frac(h, R)}$.`,
    ),
    verify: () => R * R + h * h === G * G,
  }
}

/** 6.11, 4 (**) */
export function coneFromAlAt(rng: Rng): Made {
  for (;;) {
    const [R, h, G] = rightTriangle(rng, 50)
    if ((360 * R) % G !== 0) continue
    return {
      text: `Aria laterală a unui con circular drept este de $${pi(R * G)}$ cm², iar aria totală este de $${pi(R * (R + G))}$ cm². Aflați: a) volumul; b) măsura unghiului sectorului de cerc obținut prin desfășurarea suprafeței laterale.`,
      solution: lines(
        `$\\mathcal{A}_b = \\mathcal{A}_t - \\mathcal{A}_l = ${pi(R * R)}$, deci $R = ${R}$ cm; $G = \\frac{\\mathcal{A}_l}{\\pi R} = ${G}$ cm, iar $h = \\sqrt{${G * G} - ${R * R}} = ${h}$ cm.`,
        show(`\\text{a) } V = \\frac{\\pi \\cdot ${R * R} \\cdot ${h}}{3} = ${pi(R * R * h, 3)}${cm3}`),
        'b) Sectorul are raza $G$, iar arcul lui are lungimea cercului bazei, deci $\\frac{u}{360^\\circ} = \\frac{R}{G}$:',
        show(`u = \\frac{360^\\circ \\cdot ${R}}{${G}} = ${(360 * R) / G}^\\circ`),
      ),
      verify: () => close((2 * Math.PI * G * ((360 * R) / G)) / 360, 2 * Math.PI * R),
    }
  }
}

/** 6.11, 6 (**) */
export function cone45(rng: Rng): Made {
  const k = int(rng, 1, 25)
  return {
    text: `Măsura unghiului format de generatoarea unui con circular drept cu planul bazei este de $45^\\circ$. Dacă $G = ${surd(k, 1, 2)}$ cm, aflați: a) volumul și aria totală; b) aria secțiunii axiale.`,
    solution: lines(
      `Triunghiul format de înălțime, rază și generatoare este dreptunghic isoscel: $R = h = \\frac{G}{\\sqrt{2}} = ${k}$ cm.`,
      show(`\\text{a) } V = \\frac{\\pi R^2 h}{3} = ${pi(k ** 3, 3)}${cm3}, \\qquad \\mathcal{A}_t = \\pi R(R + G) = ${pi(k * k)} + ${piS(k * k, 1, 2)}${cm2}`),
      `b) $\\mathcal{A} = R \\cdot h = ${k * k}$ cm².`,
    ),
    verify: () => close(k * S2, Math.hypot(k, k)),
  }
}

/** 6.11, 10 (**) */
export function coneEquilateral(rng: Rng): Made {
  const R = int(rng, 1, 25)
  const byP = rng() < 0.5
  return {
    text: `Secțiunea axială a unui con circular drept este un triunghi echilateral ${byP ? `cu perimetrul de ${6 * R} cm` : `cu aria de $${surd(R * R, 1, 3)}$ cm²`}. Aflați aria laterală, aria totală și volumul conului.`,
    solution: lines(
      `Laturile triunghiului sunt $G = 2R$. ${byP ? `Din $3 \\cdot 2R = ${6 * R}$` : `Din $\\frac{(2R)^2\\sqrt{3}}{4} = R^2\\sqrt{3} = ${surd(R * R, 1, 3)}$`} obținem $R = ${R}$ cm și $G = ${2 * R}$ cm, iar înălțimea este $\\frac{G\\sqrt{3}}{2} = ${surd(R, 1, 3)}$ cm.`,
      show(`\\mathcal{A}_l = \\pi RG = ${pi(2 * R * R)}${cm2}, \\quad \\mathcal{A}_t = ${pi(3 * R * R)}${cm2}, \\quad V = \\frac{\\pi R^2 h}{3} = ${piS(R ** 3, 3, 3)}${cm3}`),
    ),
    verify: () => close(((2 * R) ** 2 * S3) / 4, R * R * S3),
  }
}

/** 6.11, 15 (**): a cylinder and a cone with the same height and volume. */
export function cylConeEquivalent(rng: Rng): Made {
  const [k, h] = pick(rng, PAIRS3)
  const G = Math.sqrt(3 * k * k + h * h)
  return {
    text: `Un cilindru circular drept și un con circular drept sunt echivalente și au aceeași înălțime, de ${h} cm. Dacă raza cilindrului este de ${k} cm, aflați raza conului și aria totală a conului.`,
    solution: lines(
      `Volumele sunt egale: $\\pi \\cdot ${k * k} \\cdot ${h} = \\frac{\\pi R^2 \\cdot ${h}}{3}$, deci $R^2 = 3 \\cdot ${k * k} = ${3 * k * k}$ și $R = ${surd(k, 1, 3)}$ cm.`,
      `Generatoarea conului: $G = \\sqrt{${3 * k * k} + ${h * h}} = ${G}$ cm.`,
      show(`\\mathcal{A}_t = \\pi R(R + G) = ${pi(3 * k * k)} + ${piS(k * G, 1, 3)}${cm2}`),
    ),
    verify: () => close(k * k * h, (3 * k * k * h) / 3) && Number.isInteger(G),
  }
}

/** 6.11, 16 (**): the water of a cone poured into a cylinder. */
export function coneIntoCylinder(rng: Rng): Made {
  for (;;) {
    const [R, h, G] = rightTriangle(rng, 30)
    const opts: [number, number, number][] = []
    for (let r = 2; r <= 20; r++) for (let H = 2; H <= 40; H++) {
      const pct = (100 * R * R * h) / (3 * r * r * H)
      if (Number.isInteger(pct) && pct < 100 && pct >= 5) opts.push([r, H, pct])
    }
    if (!opts.length) continue
    const [r, H, pct] = pick(rng, opts)
    return {
      text: `Un con circular drept plin cu apă are raza de ${R} cm și generatoarea de ${G} cm. Apa din con se toarnă într-un cilindru cu raza de ${r} cm și înălțimea de ${H} cm. Cât la sută din volumul cilindrului ocupă apa?`,
      solution: lines(
        `Înălțimea conului: $h = \\sqrt{${G * G} - ${R * R}} = ${h}$ cm.`,
        show(`V_{\\text{con}} = \\frac{\\pi \\cdot ${R * R} \\cdot ${h}}{3} = ${pi(R * R * h, 3)}${cm3}, \\qquad V_{\\text{cilindru}} = \\pi \\cdot ${r * r} \\cdot ${H} = ${pi(r * r * H)}${cm3}`),
        show(`\\frac{${pi(R * R * h, 3)}}{${pi(r * r * H)}} \\cdot 100 = ${pct}\\%`),
      ),
      verify: () => close((R * R * h) / 3 / (r * r * H) * 100, pct),
    }
  }
}

/** 6.10, 15 (***) */
export function cylinderDevelopment45(rng: Rng): Made {
  const R = int(rng, 1, 40)
  return {
    text: `Diagonala suprafeței laterale desfășurate a unui cilindru circular drept face cu generatoarea un unghi de $45^\\circ$. Știind că $R = ${R}$ cm, aflați aria totală și volumul cilindrului.`,
    solution: lines(
      `Suprafața laterală desfășurată este un dreptunghi cu laturile $2\\pi R$ (lungimea cercului bazei) și $G$. Diagonala face $45^\\circ$ cu $G$, deci dreptunghiul este pătrat: $G = 2\\pi R = ${pi(2 * R)}$ cm.`,
      show(`\\mathcal{A}_t = 2\\pi R(R + G) = ${pi(2 * R * R)} + ${4 * R * R}\\pi^2${cm2}, \\qquad V = \\pi R^2 G = ${2 * R ** 3}\\pi^2${cm3}`),
    ),
    verify: () => close(2 * Math.PI * R * (R + 2 * Math.PI * R), 2 * Math.PI * R * R + 4 * R * R * Math.PI ** 2),
  }
}

/** 6.10, 16 (***) */
export function cylinder45Diag(rng: Rng): Made {
  const k = int(rng, 1, 15)
  const r = int(rng, 1, 10)
  return {
    text: `Diagonala secțiunii axiale a unui cilindru circular drept formează cu planul bazei un unghi de $45^\\circ$ și are lungimea de $${surd(2 * k, 1, 2)}$ cm. Aflați: a) aria laterală, aria totală și volumul; b) înălțimea unui alt cilindru, echivalent cu primul, știind că aria pătratului înscris în cercul de la baza celui de-al doilea cilindru este de ${2 * r * r} cm².`,
    solution: lines(
      `a) Diagonala face $45^\\circ$ cu diametrul, deci secțiunea axială este un pătrat: $2R = G = \\frac{${surd(2 * k, 1, 2)}}{\\sqrt{2}} = ${2 * k}$ cm și $R = ${k}$ cm.`,
      show(`\\mathcal{A}_l = ${pi(4 * k * k)}${cm2}, \\quad \\mathcal{A}_t = ${pi(6 * k * k)}${cm2}, \\quad V = ${pi(2 * k ** 3)}${cm3}`),
      `b) Pătratul înscris într-un cerc de rază $r$ are diagonala $2r$, deci aria $\\frac{(2r)^2}{2} = 2r^2$: din $2r^2 = ${2 * r * r}$ obținem $r = ${r}$ cm. Cilindrul echivalent are același volum:`,
      show(`\\pi \\cdot ${r * r} \\cdot H = ${pi(2 * k ** 3)} \\Rightarrow H = ${frac(2 * k ** 3, r * r)}${cm}`),
    ),
    verify: () => close(((2 * r) ** 2) / 2, 2 * r * r),
  }
}

/** 6.10, 17 (***) */
export function cylinderPerimeter(rng: Rng): Made {
  const m = int(rng, 1, 30)
  return {
    text: `Secțiunea axială a unui cilindru circular drept este un dreptunghi cu perimetrul de ${18 * m} cm. Știind că raza cilindrului reprezintă 40% din generatoarea sa, aflați: a) aria laterală, aria totală și volumul cilindrului; b) volumul piramidei triunghiulare regulate care are baza înscrisă în cercul de la baza cilindrului și vârful în centrul celeilalte baze.`,
    solution: lines(
      `a) $R = \\frac{40}{100} G = \\frac{2G}{5}$. Perimetrul secțiunii este $2(2R + G) = 2\\left(\\frac{4G}{5} + G\\right) = \\frac{18G}{5} = ${18 * m}$, deci $G = ${5 * m}$ cm și $R = ${2 * m}$ cm.`,
      show(`\\mathcal{A}_l = ${pi(20 * m * m)}${cm2}, \\quad \\mathcal{A}_t = 2\\pi R(R + G) = ${pi(28 * m * m)}${cm2}, \\quad V = ${pi(20 * m ** 3)}${cm3}`),
      `b) Latura triunghiului echilateral înscris este $\\ell = R\\sqrt{3} = ${surd(2 * m, 1, 3)}$ cm, aria lui este $\\frac{\\ell^2\\sqrt{3}}{4} = ${surd(3 * m * m, 1, 3)}$ cm², iar înălțimea piramidei este $G$:`,
      show(`V = \\frac{${surd(3 * m * m, 1, 3)} \\cdot ${5 * m}}{3} = ${surd(5 * m ** 3, 1, 3)}${cm3}`),
    ),
    verify: () => 2 * (4 * m + 5 * m) === 18 * m && close((((2 * m * S3) ** 2 * S3) / 4) * 5 * m / 3, 5 * m ** 3 * S3),
  }
}

/** 6.11, 17 (***) */
export function cone90(rng: Rng): Made {
  const h = int(rng, 1, 40)
  return {
    text: `Măsura unghiului maxim dintre două generatoare ale unui con circular drept este de $90^\\circ$. Dacă $h = ${h}$ cm, aflați volumul, aria totală și aria secțiunii axiale.`,
    solution: lines(
      `Unghiul maxim dintre două generatoare este unghiul din vârful secțiunii axiale. Înălțimea este și bisectoarea lui, deci face cu generatoarea un unghi de $45^\\circ$: $R = h = ${h}$ cm și $G = ${surd(h, 1, 2)}$ cm.`,
      show(`V = \\frac{\\pi R^2 h}{3} = ${pi(h ** 3, 3)}${cm3}, \\qquad \\mathcal{A}_t = \\pi R(R + G) = ${pi(h * h)} + ${piS(h * h, 1, 2)}${cm2}, \\qquad \\mathcal{A} = R \\cdot h = ${h * h}${cm2}`),
    ),
    verify: () => close(2 * Math.atan(h / h), Math.PI / 2),
  }
}

/** 6.11, 18 (***) */
export function coneSemicircle(rng: Rng): Made {
  const k = int(rng, 1, 40)
  return {
    text: `Suprafața laterală desfășurată a unui con circular drept este un semicerc cu raza de ${2 * k} cm. Aflați: a) aria totală și volumul conului; b) sinusul unghiului maxim dintre două generatoare.`,
    solution: lines(
      `Raza semicercului este generatoarea, iar lungimea semicercului, $\\pi G = ${pi(2 * k)}$ cm, este lungimea cercului bazei: $2\\pi R = ${pi(2 * k)}$, deci $R = ${k}$ cm și $h = \\sqrt{${4 * k * k} - ${k * k}} = ${surd(k, 1, 3)}$ cm.`,
      show(`\\text{a) } \\mathcal{A}_t = \\pi R(R + G) = ${pi(3 * k * k)}${cm2}, \\qquad V = \\frac{\\pi R^2 h}{3} = ${piS(k ** 3, 3, 3)}${cm3}`),
      `b) Secțiunea axială are laturile $G = ${2 * k}$, $G = ${2 * k}$ și $2R = ${2 * k}$, deci este un triunghi echilateral: unghiul maxim are $60^\\circ$, iar sinusul lui este $\\frac{\\sqrt{3}}{2}$.`,
    ),
    verify: () => close(Math.PI * 2 * k, 2 * Math.PI * k),
  }
}
