// More grade VIII geometry in space, after lesson pages the user photographed on 10 November 2026 (5.2–5.10 of a
// workbook): the elements of prisms and pyramids, developments and the shortest path on the faces, cones and
// cylinders from one measure, prisms from face diagonals and angles, angles in a pyramid with equal edges, sections
// parallel to the base, the perpendicular on a plane. Own numbers and wording, worked solutions in Romanian; the
// statements use the usual notation, so they read without a figure.
import type { Made } from './generators'
import { de, frac, gcd, int, pick, rightTriangle, root, rootParts, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const close = (a: number, b: number) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))
/** √(p/q) simplified, as a surd: √(p/q) = √(pq)/q. */
const rootFrac = (p: number, q: number) => {
  const [k, m] = rootParts(p * q)
  return surd(k, q, m)
}
/** p/q · π: \pi, 4\pi, \frac{32}{3}\pi. */
const pi = (p: number, q = 1) => {
  const v = frac(p, q)
  return v === '1' ? '\\pi' : `${v}\\pi`
}

// ================= elements, developments, shortest paths =================

const BASES: Record<number, string> = { 3: 'triunghiulară', 4: 'patrulateră', 5: 'pentagonală', 6: 'hexagonală', 7: 'heptagonală', 8: 'octogonală' }
const kindOf = (n: number, what: string) => (BASES[n] ? `${what} ${BASES[n]}` : `${what} cu baza un poligon cu ${de(n)} laturi`)

/** A prism whose base has n sides: 3n edges, 2n vertices, n + 2 faces, n(n − 3) diagonals. (5.3, 3–4, 18–20) */
export function elementsPrism(rng: Rng): Made {
  const n = int(rng, 3, 40)
  const given = pick(rng, ['muchii', 'vârfuri', 'fețe'] as const)
  const value = given === 'muchii' ? 3 * n : given === 'vârfuri' ? 2 * n : n + 2
  const how = given === 'muchii' ? `$3n = ${3 * n}$` : given === 'vârfuri' ? `$2n = ${2 * n}$` : `$n + 2 = ${n + 2}$`
  return {
    text: `O prismă are în total ${de(value)} ${given}. Ce fel de prismă este? Câte muchii, câte vârfuri, câte fețe și câte diagonale are?`,
    solution: lines(
      'O prismă cu baza un poligon cu $n$ laturi are $3n$ muchii ($n$ pe fiecare bază și $n$ laterale), $2n$ vârfuri și $n + 2$ fețe ($n$ laterale și cele două baze).',
      `Din ${how} obținem $n = ${n}$: este o ${kindOf(n, 'prismă')}.`,
      `Are ${de(3 * n)} muchii, ${de(2 * n)} vârfuri și ${de(n + 2)} fețe. Din fiecare vârf al unei baze pleacă diagonale spre vârfurile celeilalte baze, în afară de cel de deasupra lui și de cei doi vecini ai acestuia, deci numărul diagonalelor este`,
      show(`n(n - 3) = ${n} \\cdot ${n - 3} = ${n * (n - 3)}`),
    ),
    verify: () => (n === 4 ? n * (n - 3) === 4 : true) && 3 * n - 2 * n === n,
  }
}

/** A pyramid whose base has n sides: 2n edges, n + 1 vertices, n + 1 faces. (5.2, 3–4) */
export function elementsPyramid(rng: Rng): Made {
  const n = int(rng, 3, 40)
  const given = pick(rng, ['muchii', 'vârfuri', 'fețe laterale'] as const)
  const value = given === 'muchii' ? 2 * n : given === 'vârfuri' ? n + 1 : n
  const how = given === 'muchii' ? `$2n = ${2 * n}$` : given === 'vârfuri' ? `$n + 1 = ${n + 1}$` : `$n = ${n}$`
  return {
    text: `O piramidă are în total ${de(value)} ${given}. Ce fel de piramidă este? Câte muchii, câte vârfuri și câte fețe are în total?`,
    solution: lines(
      'O piramidă cu baza un poligon cu $n$ laturi are $2n$ muchii ($n$ ale bazei și $n$ laterale), $n + 1$ vârfuri (ale bazei și vârful piramidei) și $n + 1$ fețe ($n$ laterale și baza).',
      `Din ${how} obținem $n = ${n}$: este o ${kindOf(n, 'piramidă')}, cu ${de(2 * n)} muchii, ${de(n + 1)} vârfuri și ${de(n + 1)} fețe.`,
    ),
    verify: () => 2 * n === n + n && n + 1 === n + 1,
  }
}

/** The development of a cone's lateral surface is a sector of radius G and angle 360°·R/G. (5.4, 5–6, 10–11) */
export function coneDevelopment(rng: Rng): Made {
  for (;;) {
    const G = int(rng, 6, 36)
    const R = int(rng, 1, G - 1)
    if ((360 * R) % G !== 0) continue
    const u = (360 * R) / G
    const reverse = rng() < 0.5
    return {
      text: reverse
        ? `Un sector de cerc cu raza de ${G} cm și unghiul la centru de $${u}^\\circ$ este desfășurarea suprafeței laterale a unui con circular drept. Aflați raza bazei și aria laterală a conului.`
        : `Un con circular drept are generatoarea de ${G} cm și raza bazei de ${R} cm. Calculați măsura unghiului la centru al sectorului de cerc care reprezintă desfășurarea suprafeței laterale a conului.`,
      solution: lines(
        'Desfășurarea suprafeței laterale este un sector de cerc cu raza egală cu generatoarea. Lungimea arcului este lungimea cercului de la baza conului:',
        show(`\\frac{2\\pi G \\cdot u}{360^\\circ} = 2\\pi R \\Rightarrow u = \\frac{360^\\circ \\cdot R}{G}`),
        reverse
          ? show(`R = \\frac{G \\cdot u}{360^\\circ} = \\frac{${G} \\cdot ${u}^\\circ}{360^\\circ} = ${R}\\text{ cm}, \\qquad \\mathcal{A}_l = \\pi R G = \\pi \\cdot ${R} \\cdot ${G} = ${pi(R * G)}\\text{ cm}^2`)
          : show(`u = \\frac{360^\\circ \\cdot ${R}}{${G}} = ${u}^\\circ`),
      ),
      verify: () => close((2 * Math.PI * G * u) / 360, 2 * Math.PI * R),
    }
  }
}

/** A cylinder from its axial section (a square of given area), or the axial rectangle from the base area. (5.4, 2–3) */
export function cylinderAxialSection(rng: Rng): Made {
  const r = int(rng, 2, 20)
  if (rng() < 0.5) {
    const A = 4 * r * r
    return {
      text: `Secțiunea axială a unui cilindru circular drept este un pătrat cu aria de ${A} cm². Calculați raza bazei, generatoarea și aria laterală a cilindrului.`,
      solution: lines(
        'Secțiunea axială are laturile egale cu diametrul bazei și cu generatoarea. Fiind pătrat, $2R = G$:',
        show(`(2R)^2 = ${A} \\Rightarrow 2R = ${2 * r} \\Rightarrow R = ${r}\\text{ cm}, \\quad G = ${2 * r}\\text{ cm}`),
        show(`\\mathcal{A}_l = 2\\pi R G = 2\\pi \\cdot ${r} \\cdot ${2 * r} = ${pi(4 * r * r)}\\text{ cm}^2`),
      ),
      verify: () => (2 * r) ** 2 === A,
    }
  }
  const g = int(rng, 2, 30)
  return {
    text: `Un cilindru circular drept are aria bazei de $${pi(r * r)}$ cm² și generatoarea de ${g} cm. Calculați diametrul bazei și aria secțiunii axiale.`,
    solution: lines(
      show(`\\pi R^2 = ${pi(r * r)} \\Rightarrow R = ${r}\\text{ cm}, \\quad d = 2R = ${2 * r}\\text{ cm}`),
      'Secțiunea axială este un dreptunghi cu laturile egale cu diametrul și cu generatoarea:',
      show(`\\mathcal{A} = d \\cdot G = ${2 * r} \\cdot ${g} = ${2 * r * g}\\text{ cm}^2`),
    ),
    verify: () => 2 * r * g === 2 * r * g,
  }
}

/** The shortest path of an ant from A to C' on the faces of a cuboid: the shortest of three developments. (5.3, 16–17) */
export function shortestPathCuboid(rng: Rng): Made {
  for (;;) {
    const [a, b, c] = [int(rng, 1, 12), int(rng, 1, 12), int(rng, 1, 12)]
    if (a === b && b === c) continue
    const opts = [
      { sq: (a + b) ** 2 + c * c, tex: `(AB + BC)^2 + AA'^2 = ${(a + b) ** 2} + ${c * c}`, via: 'fețele $(ABB\'A\')$ și $(BCC\'B\')$, trecând peste muchia $BB\'$' },
      { sq: (a + c) ** 2 + b * b, tex: `(AB + AA')^2 + BC^2 = ${(a + c) ** 2} + ${b * b}`, via: 'fețele $(ABCD)$ și $(BCC\'B\')$, trecând peste muchia $BC$' },
      { sq: (b + c) ** 2 + a * a, tex: `(BC + AA')^2 + AB^2 = ${(b + c) ** 2} + ${a * a}`, via: 'fețele $(ABCD)$ și $(DCC\'D\')$, trecând peste muchia $DC$' },
    ]
    const best = opts.reduce((x, y) => (y.sq < x.sq ? y : x))
    return {
      text: `O furnică se află în vârful $A$ al paralelipipedului dreptunghic $ABCDA'B'C'D'$, cu $AB = ${a}$ cm, $BC = ${b}$ cm și $AA' = ${c}$ cm, și vrea să ajungă în $C'$ mergând pe fețele lui. Calculați lungimea drumului cel mai scurt.`,
      solution: lines(
        'Desfășurăm în plan două fețe alăturate prin care trece drumul; pe desfășurare, drumul cel mai scurt este segmentul care unește cele două puncte. Sunt trei posibilități:',
        ...opts.map((o) => show(`${o.tex} = ${o.sq} \\Rightarrow d = ${root(o.sq)}`)),
        `Cel mai scurt drum trece prin ${best.via} și are lungimea $${root(best.sq)}$ cm.`,
      ),
      verify: () => best.sq === Math.min((a + b) ** 2 + c * c, (a + c) ** 2 + b * b, (b + c) ** 2 + a * a),
    }
  }
}

/** On a pyramid with all edges equal (or a regular tetrahedron), the shortest path over one edge: two equilateral triangles. (5.2, 16–18) */
export function shortestPathPyramid(rng: Rng): Made {
  const l = int(rng, 2, 40)
  const tetra = rng() < 0.5
  return {
    text: tetra
      ? `Tetraedrul regulat $ABCD$ are muchia de ${l} cm. O furnică pleacă din $B$ și ajunge în $C$ trecând peste muchia $AD$, pe fețele $(ABD)$ și $(ACD)$. Calculați lungimea drumului cel mai scurt.`
      : `Piramida patrulateră regulată $VABCD$ are toate muchiile de ${l} cm. O furnică pleacă din $A$ și ajunge în $C$ mergând pe fețele laterale $(VAB)$ și $(VBC)$. Calculați lungimea drumului cel mai scurt.`,
    solution: lines(
      `Desfășurăm în plan cele două fețe, ${tetra ? '$ABD$ și $ACD$, alăturate de-a lungul lui $AD$' : '$VAB$ și $VBC$, alăturate de-a lungul lui $VB$'}. Sunt triunghiuri echilaterale cu latura de ${l} cm, deci împreună formează un romb cu un unghi de $60^\\circ$.`,
      `Drumul cel mai scurt este diagonala mare a rombului, ${tetra ? '$BC$' : '$AC$'}. Ea este dublul înălțimii unui triunghi echilateral:`,
      show(`d = 2 \\cdot \\frac{\\ell\\sqrt{3}}{2} = \\ell\\sqrt{3} = ${surd(l, 1, 3)}\\text{ cm}`),
    ),
    verify: () => close(2 * ((l * Math.sqrt(3)) / 2), l * Math.sqrt(3)),
  }
}

// ================= the perpendicular on a plane =================

/** AP ⊥ the plane of the square ABCD: PB, PC and PO from Pythagoras, with AB, AC and AO in the plane. (5.10, 1) */
export function perpendicularOnSquare(rng: Rng): Made {
  const [a, h, b] = rightTriangle(rng, 60)
  const pc = 2 * a * a + h * h
  return {
    text: `Pe planul pătratului $ABCD$, cu $AB = ${a}$ cm, se ridică perpendiculara $AP = ${h}$ cm. Calculați distanțele de la $P$ la punctele $B$ și $C$ și la centrul $O$ al pătratului.`,
    solution: lines(
      '$PA$ este perpendiculară pe orice dreaptă din planul pătratului, deci triunghiurile $PAB$, $PAC$ și $PAO$ sunt dreptunghice în $A$.',
      show(`PB = \\sqrt{${h * h} + ${a * a}} = ${b}\\text{ cm}`),
      show(`AC = ${surd(a, 1, 2)}, \\qquad PC = \\sqrt{${h * h} + ${2 * a * a}} = ${root(pc)}\\text{ cm}`),
      show(`AO = \\frac{AC}{2} = ${surd(a, 2, 2)}, \\qquad PO = \\sqrt{${h * h} + ${frac(a * a, 2)}} = ${rootFrac(2 * h * h + a * a, 2)}\\text{ cm}`),
    ),
    verify: () => h * h + a * a === b * b && close(Math.sqrt(h * h + (a * a) / 2), Math.sqrt((2 * h * h + a * a) / 2)),
  }
}

/** A regular quadrilateral pyramid from its height and base: apothem, lateral edge, lateral area. (5.10, 10) */
export function pyramidFromHeight(rng: Rng): Made {
  const [half, h, ap] = rightTriangle(rng, 60)
  const l = 2 * half
  const edge2 = ap * ap + half * half
  return {
    text: `Piramida patrulateră regulată $VABCD$ are înălțimea $VO = ${h}$ cm și latura bazei $AB = ${l}$ cm. Calculați apotema, muchia laterală și aria laterală a piramidei.`,
    solution: lines(
      `Fie $M$ mijlocul lui $BC$; $OM = \\frac{AB}{2} = ${half}$ cm și $VO \\perp OM$:`,
      show(`VM = \\sqrt{${h * h} + ${half * half}} = ${ap}\\text{ cm}`),
      `În triunghiul $VMB$, dreptunghic în $M$, cu $MB = ${half}$ cm:`,
      show(`VB = \\sqrt{${ap * ap} + ${half * half}} = ${root(edge2)}\\text{ cm}, \\qquad \\mathcal{A}_l = 4 \\cdot \\frac{${l} \\cdot ${ap}}{2} = ${2 * l * ap}\\text{ cm}^2`),
    ),
    verify: () => h * h + half * half === ap * ap,
  }
}

/** AV ⊥ the plane of an equilateral triangle: d(V, B) and, by the three perpendiculars, d(V, BC). (5.10, 15) */
export function perpendicularOnEquilateral(rng: Rng): Made {
  const l = int(rng, 2, 24)
  const h = int(rng, 2, 24)
  const vm2 = 4 * h * h + 3 * l * l
  const [k, m] = rootParts(vm2)
  return {
    text: `Pe planul triunghiului echilateral $ABC$, cu latura de ${l} cm, se ridică perpendiculara $AV = ${h}$ cm. Calculați distanța de la $V$ la punctul $B$ și distanța de la $V$ la dreapta $BC$.`,
    solution: lines(
      show(`VB = \\sqrt{AV^2 + AB^2} = \\sqrt{${h * h} + ${l * l}} = ${root(h * h + l * l)}\\text{ cm}`),
      `Fie $M$ mijlocul lui $BC$; $AM \\perp BC$ și $AM = \\frac{\\ell\\sqrt{3}}{2} = ${surd(l, 2, 3)}$ cm. Din teorema celor trei perpendiculare, $VM \\perp BC$, deci $d(V, BC) = VM$:`,
      show(`VM = \\sqrt{${h * h} + ${frac(3 * l * l, 4)}} = \\frac{\\sqrt{${vm2}}}{2} = ${surd(k, 2, m)}\\text{ cm}`),
    ),
    verify: () => close(Math.sqrt(h * h + (3 * l * l) / 4), (k * Math.sqrt(m)) / 2),
  }
}

/** NO ⊥ the plane of a right triangle at the circumcentre O, the midpoint of the hypotenuse: N is equally far from A, B, C. (5.10, 6) */
export function perpendicularAtCircumcenter(rng: Rng): Made {
  const [p, q, r0] = rightTriangle(rng, 50)
  const [AB, AC, BC] = [2 * p, 2 * q, 2 * r0]
  const h = int(rng, 2, 40)
  const R = r0
  const d2 = h * h + R * R
  return {
    text: `Triunghiul $ABC$ este dreptunghic în $A$, cu $AB = ${AB}$ cm și $AC = ${AC}$ cm. În centrul $O$ al cercului circumscris triunghiului se ridică perpendiculara $NO$ pe planul lui, cu $NO = ${h}$ cm. Calculați distanțele de la $N$ la vârfurile triunghiului.`,
    solution: lines(
      `Ipotenuza: $BC = \\sqrt{${AB * AB} + ${AC * AC}} = ${BC}$ cm. Centrul cercului circumscris unui triunghi dreptunghic este mijlocul ipotenuzei, deci $OA = OB = OC = ${R}$ cm.`,
      'Triunghiurile $NOA$, $NOB$, $NOC$ sunt dreptunghice în $O$ și congruente (catete egale), deci',
      show(`NA = NB = NC = \\sqrt{${h * h} + ${R * R}} = ${root(d2)}\\text{ cm}`),
    ),
    verify: () => AB * AB + AC * AC === BC * BC,
  }
}

/** A point E outside the plane of a rectangle, equally far from its vertices: its projection is the centre O. (5.10, 34) */
export function equidistantPoint(rng: Rng): Made {
  const [p, q, r] = rightTriangle(rng, 40)
  const [AB, BC, AC] = [2 * p, 2 * q, 2 * r]
  const t = int(rng, 2, 40)
  const e2 = r * r + t * t
  return {
    text: `Dreptunghiul $ABCD$ are $AB = ${AB}$ cm și $BC = ${BC}$ cm. Punctul $E$, exterior planului dreptunghiului, are $EA = EB = EC = ED = ${root(e2)}$ cm. Arătați că proiecția lui $E$ pe planul dreptunghiului este centrul $O$ al acestuia și calculați $EO$.`,
    solution: lines(
      'Fie $O\'$ proiecția lui $E$ pe plan. Triunghiurile $EO\'A$, $EO\'B$, $EO\'C$, $EO\'D$ sunt dreptunghice în $O\'$, cu ipotenuzele egale și cateta $EO\'$ comună, deci $O\'A = O\'B = O\'C = O\'D$: $O\'$ este centrul cercului circumscris dreptunghiului, adică intersecția diagonalelor, $O$.',
      show(`AC = \\sqrt{${AB * AB} + ${BC * BC}} = ${AC}\\text{ cm}, \\qquad OA = ${r}\\text{ cm}`),
      show(`EO = \\sqrt{EA^2 - OA^2} = \\sqrt{${e2} - ${r * r}} = ${t}\\text{ cm}`),
    ),
    verify: () => AB * AB + BC * BC === AC * AC && e2 - r * r === t * t,
  }
}

const PYRAMID_ANGLES = [
  { pair: '$VA$ și $DC$', ans: 60, why: 'Cum $DC \\parallel AB$, unghiul cerut este $\\angle VAB$. Triunghiul $VAB$ are toate laturile egale, deci este echilateral' },
  { pair: '$VB$ și $VD$', ans: 90, why: 'În triunghiul $VBD$, $VB = VD = \\ell$ și $BD = \\ell\\sqrt{2}$ (diagonala pătratului). Cum $VB^2 + VD^2 = 2\\ell^2 = BD^2$, din reciproca teoremei lui Pitagora triunghiul este dreptunghic în $V$' },
  { pair: '$VA$ și $VC$', ans: 90, why: 'În triunghiul $VAC$, $VA = VC = \\ell$ și $AC = \\ell\\sqrt{2}$. Cum $VA^2 + VC^2 = AC^2$, triunghiul este dreptunghic în $V$' },
  { pair: '$VO$ și $VD$', ans: 45, why: 'Triunghiul $VBD$ este dreptunghic isoscel în $V$, iar $VO$ este mediană, deci și bisectoare: unghiul $OVD$ este jumătate din $90^\\circ$' },
  { pair: '$VC$ și $AB$', ans: 60, why: 'Cum $AB \\parallel DC$, unghiul cerut este $\\angle VCD$, iar triunghiul $VCD$ este echilateral' },
]

/** Angles between lines in a regular quadrilateral pyramid with all edges equal. (5.6, 5 and 14) */
export function pyramidAngles(rng: Rng): Made {
  const l = int(rng, 2, 30)
  const a = pick(rng, PYRAMID_ANGLES)
  return {
    text: `Piramida patrulateră regulată $VABCD$ are toate muchiile de ${l} cm, iar $O$ este centrul bazei. Determinați măsura unghiului dreptelor ${a.pair}.`,
    solution: lines(`${a.why}.`, show(`m(\\angle(${a.pair.replace(/\$/g, '').replace(' și ', ', ')})) = ${a.ans}^\\circ`)),
    verify: () => [45, 60, 90].includes(a.ans),
  }
}

/** A regular triangular pyramid from the base area and the area of a lateral face: side, apothem, lateral edge. (5.2, 13) */
export function regularTriangularFromAreas(rng: Rng): Made {
  const [x, ap, VA] = rightTriangle(rng, 60)
  const l = 2 * x
  return {
    text: `În piramida triunghiulară regulată $VABC$ se cunosc aria bazei, $${x * x}\\sqrt{3}$ cm², și aria unei fețe laterale, ${x * ap} cm². Calculați latura bazei, apotema piramidei și suma lungimilor tuturor muchiilor.`,
    solution: lines(
      show(`\\frac{AB^2\\sqrt{3}}{4} = ${x * x}\\sqrt{3} \\Rightarrow AB^2 = ${l * l} \\Rightarrow AB = ${l}\\text{ cm}`),
      `Fie $M$ mijlocul lui $BC$; apotema $VM$ este înălțimea feței $VBC$:`,
      show(`\\frac{BC \\cdot VM}{2} = ${x * ap} \\Rightarrow VM = \\frac{2 \\cdot ${x * ap}}{${l}} = ${ap}\\text{ cm}`),
      show(`VB = \\sqrt{VM^2 + MB^2} = \\sqrt{${ap * ap} + ${x * x}} = ${VA}\\text{ cm}, \\qquad 3 \\cdot ${l} + 3 \\cdot ${VA} = ${3 * l + 3 * VA}\\text{ cm}`),
    ),
    verify: () => x * x + ap * ap === VA * VA,
  }
}

// ================= prisms, cones, cylinders from one measure =================

/** A cube from the diagonal of a face: d = ℓ√2. (5.3, 8) */
export function cubeFromFaceDiagonal(rng: Rng): Made {
  const whole = rng() < 0.5
  const k = int(rng, 2, 30)
  // with a whole diagonal d = k: ℓ = k√2/2 and the total area is 3k²; else d = k√2 and ℓ = k
  return {
    text: `Diagonala unei fețe a unui cub are lungimea de $${whole ? k : `${k}\\sqrt{2}`}$ cm. Calculați muchia și aria totală a cubului.`,
    solution: whole
      ? lines(
        show(`\\ell\\sqrt{2} = ${k} \\Rightarrow \\ell = \\frac{${k}}{\\sqrt{2}} = ${surd(k, 2, 2)}\\text{ cm}`),
        show(`\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${frac(k * k, 2)} = ${3 * k * k}\\text{ cm}^2`),
      )
      : lines(
        show(`\\ell\\sqrt{2} = ${k}\\sqrt{2} \\Rightarrow \\ell = ${k}\\text{ cm}`),
        show(`\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${k * k} = ${6 * k * k}\\text{ cm}^2`),
      ),
    verify: () => (whole ? close(6 * (k / Math.SQRT2) ** 2, 3 * k * k) : true),
  }
}

const BY_LEG: Map<number, [number, number][]> = (() => {
  const m = new Map<number, [number, number][]>()
  for (let c = 5; c <= 60; c++) for (let a = 3; a < c; a++) {
    const b = Math.sqrt(c * c - a * a)
    if (!Number.isInteger(b)) continue
    if (!m.has(a)) m.set(a, [])
    m.get(a)!.push([b, c])
  }
  return m
})()
const SHARED = [...BY_LEG].filter(([, v]) => v.length >= 2).map(([k]) => k)

/** A cuboid from AB and the diagonals AB' and B'C of two faces: BB' then BC. (5.3, 10) */
export function cuboidFromFaceDiagonals(rng: Rng): Made {
  const h = pick(rng, SHARED)
  const [[a, d1], [b, d2]] = [...BY_LEG.get(h)!].sort(() => rng() - 0.5).slice(0, 2)
  const At = 2 * (a * b + b * h + h * a)
  return {
    text: `În paralelipipedul dreptunghic $ABCDA'B'C'D'$ se cunosc $AB = ${a}$ cm, $AB' = ${d1}$ cm și $B'C = ${d2}$ cm. Calculați aria totală și suma lungimilor tuturor muchiilor.`,
    solution: lines(
      show(`BB' = \\sqrt{AB'^2 - AB^2} = \\sqrt{${d1 * d1} - ${a * a}} = ${h}\\text{ cm}, \\qquad BC = \\sqrt{B'C^2 - BB'^2} = \\sqrt{${d2 * d2} - ${h * h}} = ${b}\\text{ cm}`),
      show(`\\mathcal{A}_t = 2(${a} \\cdot ${b} + ${b} \\cdot ${h} + ${h} \\cdot ${a}) = ${At}\\text{ cm}^2, \\qquad 4(${a} + ${b} + ${h}) = ${4 * (a + b + h)}\\text{ cm}`),
    ),
    verify: () => a * a + h * h === d1 * d1 && b * b + h * h === d2 * d2,
  }
}

/** A regular quadrilateral prism from the base area and the area of a lateral face: the diagonal section. (5.3, 12) */
export function prismSquareAreas(rng: Rng): Made {
  const l = int(rng, 2, 20)
  const h = int(rng, 2, 30)
  return {
    text: `Prisma patrulateră regulată $ABCDA'B'C'D'$ are aria bazei de ${l * l} cm² și aria unei fețe laterale de ${l * h} cm². Calculați perimetrul și aria secțiunii diagonale $ACC'A'$.`,
    solution: lines(
      show(`\\ell^2 = ${l * l} \\Rightarrow \\ell = ${l}\\text{ cm}, \\qquad \\ell \\cdot h = ${l * h} \\Rightarrow h = ${h}\\text{ cm}`),
      `Secțiunea $ACC'A'$ este un dreptunghi cu laturile $AC = \\ell\\sqrt{2} = ${surd(l, 1, 2)}$ cm și $AA' = ${h}$ cm:`,
      show(`P = 2(${surd(l, 1, 2)} + ${h}) = ${surd(2 * l, 1, 2)} + ${2 * h}\\text{ cm}, \\qquad \\mathcal{A} = ${surd(l, 1, 2)} \\cdot ${h} = ${surd(l * h, 1, 2)}\\text{ cm}^2`),
    ),
    verify: () => l * l > 0 && (l * h) / l === h,
  }
}

/** A regular quadrilateral prism from AB' and the angle B'AB (30°, 45°, 60°). (Testul 1 of 5.4, 7) */
export function prismFromAngle(rng: Rng): Made {
  const k = int(rng, 2, 15)
  const ang = pick(rng, [30, 45, 60])
  const d = ang === 45 ? `${k}\\sqrt{2}` : String(2 * k)
  const AB = ang === 30 ? surd(k, 1, 3) : String(k)
  const BB = ang === 60 ? surd(k, 1, 3) : String(k)
  const base = ang === 30 ? 3 * k * k : k * k
  const V = ang === 30 ? String(3 * k ** 3) : ang === 45 ? String(k ** 3) : surd(k ** 3, 1, 3)
  const ratio = ang === 30 ? ['\\frac{\\sqrt{3}}{2}', '\\frac{1}{2}'] : ang === 45 ? ['\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{2}}{2}'] : ['\\frac{1}{2}', '\\frac{\\sqrt{3}}{2}']
  return {
    text: `Prisma patrulateră regulată $ABCDA'B'C'D'$ are $AB' = ${d}$ cm și $m(\\angle B'AB) = ${ang}^\\circ$. Calculați aria bazei și volumul prismei.`,
    solution: lines(
      `Triunghiul $ABB'$ este dreptunghic în $B$, deci $AB = AB' \\cdot \\cos ${ang}^\\circ$ și $BB' = AB' \\cdot \\sin ${ang}^\\circ$:`,
      show(`AB = ${d} \\cdot ${ratio[0]} = ${AB}\\text{ cm}, \\qquad BB' = ${d} \\cdot ${ratio[1]} = ${BB}\\text{ cm}`),
      show(`\\mathcal{A}_b = AB^2 = ${base}\\text{ cm}^2, \\qquad V = \\mathcal{A}_b \\cdot BB' = ${V}\\text{ cm}^3`),
    ),
    verify: () => {
      const dv = ang === 45 ? k * Math.SQRT2 : 2 * k
      const ab = dv * Math.cos((ang * Math.PI) / 180)
      const bb = dv * Math.sin((ang * Math.PI) / 180)
      return close(ab * ab, base) && close(ab * ab * bb, ang === 60 ? k ** 3 * Math.sqrt(3) : Number(V))
    },
  }
}

/** A cone from its generatrix and the angle VAB of the axial section (30°, 45°, 60°): radius, height, base area. (5.4, 4; 5.10, 13) */
export function coneFromAngle(rng: Rng): Made {
  const k = int(rng, 2, 15)
  const ang = pick(rng, [30, 45, 60])
  const G = 2 * k
  const R = ang === 60 ? String(k) : ang === 45 ? surd(k, 1, 2) : surd(k, 1, 3)
  const h = ang === 30 ? String(k) : ang === 45 ? surd(k, 1, 2) : surd(k, 1, 3)
  const area = ang === 60 ? k * k : ang === 45 ? 2 * k * k : 3 * k * k
  return {
    text: `În conul circular drept cu vârful $V$, $AB$ este un diametru al bazei, $VA = ${G}$ cm și $m(\\angle VAB) = ${ang}^\\circ$. Calculați raza, înălțimea și aria bazei conului.`,
    solution: lines(
      'Fie $O$ centrul bazei; triunghiul $VOA$ este dreptunghic în $O$, deci $OA = VA \\cdot \\cos \\angle VAB$ și $VO = VA \\cdot \\sin \\angle VAB$:',
      show(`R = ${G} \\cdot \\cos ${ang}^\\circ = ${R}\\text{ cm}, \\qquad h = ${G} \\cdot \\sin ${ang}^\\circ = ${h}\\text{ cm}`),
      show(`\\mathcal{A}_b = \\pi R^2 = ${pi(area)}\\text{ cm}^2`),
    ),
    verify: () => close((G * Math.cos((ang * Math.PI) / 180)) ** 2, area),
  }
}

// ================= sections parallel to the base, frustums =================

/** A pyramid cut by a plane through E ∈ VB, parallel to the base: ratio p/q for sides and perimeters, p²/q² for areas. (5.9, 9) */
export function sectionRatio(rng: Rng): Made {
  for (;;) {
    const q = int(rng, 2, 9)
    const p = int(rng, 1, q - 1)
    if (gcd(p, q) !== 1) continue
    const t = int(rng, 1, 6)
    const BC = q * t
    return {
      text: `Pe muchia $VB$ a piramidei triunghiulare $VABC$ se ia punctul $E$ astfel încât $\\frac{VE}{VB} = \\frac{${p}}{${q}}$. Planul care trece prin $E$ și este paralel cu baza taie muchiile $VA$ și $VC$ în $F$ și $G$. Știind că $BC = ${BC}$ cm, aflați $EG$, raportul perimetrelor și raportul ariilor triunghiurilor $EFG$ și $BCA$.`,
      solution: lines(
        `Secțiunea paralelă cu baza este asemenea cu baza: $\\triangle VEG \\sim \\triangle VBC$ (din $EG \\parallel BC$), deci raportul de asemănare este $k = \\frac{VE}{VB} = \\frac{${p}}{${q}}$.`,
        show(`EG = ${frac(p, q)} \\cdot ${BC} = ${p * t}\\text{ cm}, \\qquad \\frac{P_{EFG}}{P_{BCA}} = ${frac(p, q)}, \\qquad \\frac{\\mathcal{A}_{EFG}}{\\mathcal{A}_{BCA}} = k^2 = ${frac(p * p, q * q)}`),
      ),
      verify: () => (p * BC) / q === p * t,
    }
  }
}

/** A cone cut parallel to the base: the small cone's generatrix is G·r/R, the frustum's is the rest. (5.9, 11) */
export function frustumConeGeneratrix(rng: Rng): Made {
  const R = int(rng, 2, 12)
  const r = int(rng, 1, R - 1)
  const m = int(rng, 2, 4)
  const G = R * m
  const g = r * m
  return {
    text: `Un con circular drept cu raza bazei de ${R} cm și generatoarea de ${G} cm este secționat cu un plan paralel cu baza. Raza secțiunii este de ${r} cm. Aflați generatoarea trunchiului de con obținut.`,
    solution: lines(
      `Conul mic, de deasupra secțiunii, este asemenea cu conul mare, cu raportul $\\frac{${r}}{${R}}$. Generatoarea lui este`,
      show(`g = ${G} \\cdot ${frac(r, R)} = ${g}\\text{ cm}`),
      show(`G_{trunchi} = ${G} - ${g} = ${G - g}\\text{ cm}`),
    ),
    verify: () => (G * r) / R === g,
  }
}

/** A frustum of a cone from its diameters and generatrix: axial trapezoid and the cone it comes from. (5.9, 12) */
export function frustumTrapezoid(rng: Rng): Made {
  const [x, h, g] = rightTriangle(rng, 40)
  const r = int(rng, 1, 15)
  const R = r + x
  const Gtex = frac(g * R, x)
  return {
    text: `Un trunchi de con circular drept are diametrul bazei mari $AB = ${2 * R}$ cm, diametrul bazei mici $CD = ${2 * r}$ cm, cu $AB \\parallel CD$, și generatoarea $AC = ${g}$ cm. Calculați aria trapezului $ACDB$ și lungimea generatoarei conului din care provine trunchiul.`,
    solution: lines(
      `Secțiunea axială $ACDB$ este un trapez isoscel. Ducem înălțimea din $C$; proiecția lui $AC$ pe $AB$ are lungimea $\\frac{${2 * R} - ${2 * r}}{2} = ${x}$ cm:`,
      show(`h = \\sqrt{${g * g} - ${x * x}} = ${h}\\text{ cm}, \\qquad \\mathcal{A} = \\frac{(${2 * R} + ${2 * r}) \\cdot ${h}}{2} = ${(R + r) * h}\\text{ cm}^2`),
      `Prelungim generatoarele până la vârful $V$. Conul mic și conul mare sunt asemenea: $\\frac{VC}{VA} = \\frac{${r}}{${R}}$, deci $\\frac{VA - ${g}}{VA} = \\frac{${r}}{${R}}$:`,
      show(`${R}(VA - ${g}) = ${r} \\cdot VA \\Rightarrow ${x} \\cdot VA = ${g * R} \\Rightarrow VA = ${Gtex}\\text{ cm}`),
    ),
    verify: () => x * x + h * h === g * g && close(((g * R) / x - g) / ((g * R) / x), r / R),
  }
}

