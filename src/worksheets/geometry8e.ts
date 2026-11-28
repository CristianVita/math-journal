// Grade VIII geometry in space, fourth batch (27 November 2026): what the tests of chapter 5 of the workbook "cu
// puișorul" (pp. 61–62, 71–72, 81–82) ask and the earlier batches (geometry8b, geometry8c) did not have: examples and
// true/false statements in a cube or cuboid, a cube from the sum of its edges, the centre of a face of a cube, the
// regular tetrahedron, faces of a regular triangular pyramid, a pyramid with all edges equal, the diagonals of the axial
// section of a cylinder, the cone from its development, trapezoids with perpendiculars. Own numbers and wording,
// worked solutions in Romanian; every `verify` rebuilds the figure in coordinates.
import type { Made } from './generators'
import type { Form, Kind8 } from './alg8'
import { de, frac, gcd, int, pick, rightTriangle, root, rootParts, shuffle, surd, type Rng } from './tex'

const lines = (...l: string[]) => l.filter(Boolean).join('\n\n')
const show = (tex: string) => `$$${tex}$$`
const close = (a: number, b: number) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(a), Math.abs(b))
/** √(p/q) simplified: √(p/q) = √(pq)/q. */
const sqrtFrac = (p: number, q: number) => {
  const [k, m] = rootParts(p * q)
  return surd(k, q, m)
}
/** n/√s simplified. */
const over = (n: number, s: number) => {
  const [k, m] = rootParts(s)
  return surd(n, k * m, m)
}
const pi = (p: number, q = 1) => {
  const v = frac(p, q)
  return v === '1' ? '\\pi' : `${v}\\pi`
}
const ABC = 'abcdefghij'
/** "a) …; b) …" */
const listed = (items: string[]) => items.map((t, i) => `${ABC[i]}) ${t}`).join('; ')

// ---------- coordinates, for the checks ----------
type P = [number, number, number]
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]
const dot = (a: P, b: P) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: P, b: P): P => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const len = (a: P) => Math.sqrt(dot(a, a))
const dist = (a: P, b: P) => len(sub(a, b))
const zero = (a: P) => a[0] === 0 && a[1] === 0 && a[2] === 0
const toLine = (p: P, a: P, b: P) => len(cross(sub(p, a), sub(b, a))) / dist(a, b)
const normal = (a: P, b: P, c: P) => cross(sub(b, a), sub(c, a))
const toPlane = (p: P, a: P, b: P, c: P) => Math.abs(dot(sub(p, a), normal(a, b, c))) / len(normal(a, b, c))
const sinLP = (p: P, q: P, a: P, b: P, c: P) => {
  const n = normal(a, b, c)
  return Math.abs(dot(sub(q, p), n)) / (dist(p, q) * len(n))
}
const cosPP = (a1: P, b1: P, c1: P, a2: P, b2: P, c2: P) => {
  const [n1, n2] = [normal(a1, b1, c1), normal(a2, b2, c2)]
  return Math.abs(dot(n1, n2)) / (len(n1) * len(n2))
}
/** The angle of two lines, in degrees. */
const angle = (u: P, v: P) => (Math.acos(Math.min(1, Math.abs(dot(u, v)) / (len(u) * len(v)))) * 180) / Math.PI

/** The usual angles, by the square of their tangent. */
const ANGLE = { 30: [1, 3], 45: [1, 1], 60: [3, 1] } as const
const DEGS = [30, 45, 60] as const

// ---------- the box ABCDA'B'C'D' ----------
const NAMES = ['A', 'B', 'C', 'D', "A'", "B'", "C'", "D'"]
const boxPts = (x: number, y: number, z: number): P[] =>
  [[0, 0, 0], [x, 0, 0], [x, y, 0], [0, y, 0], [0, 0, z], [x, 0, z], [x, y, z], [0, y, z]]
const FACES = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [3, 2, 6, 7], [0, 3, 7, 4], [1, 2, 6, 5]]
const FACE_NAME = ['(ABC)', "(A'B'C')", "(ABB')", "(DCC')", "(ADD')", "(BCC')"]
const DIAG = [[0, 2, 6, 4], [1, 3, 7, 5], [0, 1, 6, 7], [3, 2, 5, 4], [0, 3, 6, 5], [1, 2, 7, 4]]
const CORNER = [[1, 3, 4], [0, 2, 5], [1, 3, 6], [0, 2, 7], [0, 5, 7], [1, 4, 6], [2, 5, 7], [3, 4, 6]]
const PLANES = [...FACES, ...DIAG, ...CORNER]
const GENERIC = boxPts(2, 3, 5)
const EDGES: [number, number][] = []
for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
  const d = sub(GENERIC[j], GENERIC[i])
  if (d.filter((c) => c !== 0).length === 1) EDGES.push([i, j])
}
const seg = (l: [number, number]) => NAMES[l[0]] + NAMES[l[1]]
/** Both orders of an edge, so that the examples do not always read "AB". */
const turn = (rng: Rng, l: [number, number]): [number, number] => (rng() < 0.5 ? l : [l[1], l[0]])

const inPlane = (pts: P[], p: P, s: number[]) => dot(sub(p, pts[s[0]]), normal(pts[s[0]], pts[s[1]], pts[s[2]])) === 0
const nOf = (pts: P[], s: number[]) => normal(pts[s[0]], pts[s[1]], pts[s[2]])
const dOf = (pts: P[], l: [number, number]) => sub(pts[l[1]], pts[l[0]])
const coplanar = (pts: P[], a: [number, number], b: [number, number]) => dot(cross(dOf(pts, a), dOf(pts, b)), sub(pts[b[0]], pts[a[0]])) === 0
const sameLine = (pts: P[], a: [number, number], b: [number, number]) => zero(cross(dOf(pts, a), dOf(pts, b))) && zero(cross(dOf(pts, a), sub(pts[b[0]], pts[a[0]])))

// ================= examples in a cube (tests p. 72, 2.1; p. 82, 3.1) =================

type Example = { ask: string; make: (rng: Rng) => { tex: string; ok: (pts: P[]) => boolean } }
const pairsOf = <T,>(l: T[]) => l.flatMap((a, i) => l.slice(i + 1).map((b): [T, T] => [a, b]))
const EDGE_PAIRS = pairsOf(EDGES)
const EXAMPLES: Record<string, Example> = {
  par: {
    ask: '2 drepte paralele',
    make: (rng) => {
      const [a, b] = pick(rng, EDGE_PAIRS.filter(([a, b]) => zero(cross(dOf(GENERIC, a), dOf(GENERIC, b)))))
      return { tex: `$${seg(a)} \\parallel ${seg(b)}$`, ok: (p) => zero(cross(dOf(p, a), dOf(p, b))) && !sameLine(p, a, b) }
    },
  },
  skew: {
    ask: '2 drepte necoplanare',
    make: (rng) => {
      const [a, b] = pick(rng, EDGE_PAIRS.filter(([a, b]) => !coplanar(GENERIC, a, b)))
      return { tex: `$${seg(turn(rng, a))}$ și $${seg(turn(rng, b))}$`, ok: (p) => !coplanar(p, a, b) }
    },
  },
  inPlane: {
    ask: 'o dreaptă inclusă într-un plan',
    make: (rng) => {
      const f = int(rng, 0, 5)
      const e = turn(rng, pick(rng, EDGES.filter((e) => FACES[f].includes(e[0]) && FACES[f].includes(e[1]))))
      return { tex: `$${seg(e)} \\subset ${FACE_NAME[f]}$`, ok: (p) => inPlane(p, p[e[0]], FACES[f]) && inPlane(p, p[e[1]], FACES[f]) }
    },
  },
  parPlane: {
    ask: 'o dreaptă paralelă cu un plan',
    make: (rng) => {
      const f = int(rng, 0, 5)
      const e = turn(rng, pick(rng, EDGES.filter((e) => !FACES[f].includes(e[0]) && !FACES[f].includes(e[1]) && dot(dOf(GENERIC, e), nOf(GENERIC, FACES[f])) === 0)))
      return { tex: `$${seg(e)} \\parallel ${FACE_NAME[f]}$`, ok: (p) => dot(dOf(p, e), nOf(p, FACES[f])) === 0 && !inPlane(p, p[e[0]], FACES[f]) }
    },
  },
  perpPlane: {
    ask: 'o dreaptă perpendiculară pe un plan',
    make: (rng) => {
      const f = int(rng, 0, 5)
      const e = turn(rng, pick(rng, EDGES.filter((e) => zero(cross(dOf(GENERIC, e), nOf(GENERIC, FACES[f]))))))
      return { tex: `$${seg(e)} \\perp ${FACE_NAME[f]}$`, ok: (p) => zero(cross(dOf(p, e), nOf(p, FACES[f]))) }
    },
  },
  parPlanes: {
    ask: 'două plane paralele',
    make: (rng) => {
      const f = 2 * int(rng, 0, 2)
      const [a, b] = rng() < 0.5 ? [f, f + 1] : [f + 1, f]
      return { tex: `$${FACE_NAME[a]} \\parallel ${FACE_NAME[b]}$`, ok: (p) => zero(cross(nOf(p, FACES[a]), nOf(p, FACES[b]))) && !inPlane(p, p[FACES[b][0]], FACES[a]) }
    },
  },
  perpPlanes: {
    ask: 'două plane perpendiculare',
    make: (rng) => {
      const a = int(rng, 0, 5)
      const b = pick(rng, [0, 1, 2, 3, 4, 5].filter((b) => (b >> 1) !== (a >> 1)))
      return { tex: `$${FACE_NAME[a]} \\perp ${FACE_NAME[b]}$`, ok: (p) => dot(nOf(p, FACES[a]), nOf(p, FACES[b])) === 0 }
    },
  },
  secant: {
    ask: 'o dreaptă care intersectează un plan într-un singur punct',
    make: (rng) => {
      const f = int(rng, 0, 5)
      const e = pick(rng, EDGES.filter((e) => dot(dOf(GENERIC, e), nOf(GENERIC, FACES[f])) !== 0))
      const at = FACES[f].includes(e[0]) ? e[0] : e[1]
      return { tex: `$${seg(e)} \\cap ${FACE_NAME[f]} = \\{${NAMES[at]}\\}$`, ok: (p) => dot(dOf(p, e), nOf(p, FACES[f])) !== 0 && inPlane(p, p[at], FACES[f]) }
    },
  },
  perpLines: {
    ask: 'două drepte perpendiculare și concurente',
    make: (rng) => {
      const v = int(rng, 0, 7)
      const [a, b] = shuffle(rng, EDGES.filter((e) => e.includes(v))).slice(0, 2).map((e): [number, number] => (e[0] === v ? e : [v, e[0]]))
      return { tex: `$${seg(a)} \\perp ${seg(b)}$`, ok: (p) => dot(dOf(p, a), dOf(p, b)) === 0 && a[0] === b[0] }
    },
  },
  par3: {
    ask: '3 perechi de muchii paralele',
    make: (rng) => {
      const picks = [0, 1, 2].map((axis) => pick(rng, EDGE_PAIRS.filter(([a, b]) => dOf(GENERIC, a)[axis] !== 0 && zero(cross(dOf(GENERIC, a), dOf(GENERIC, b))))))
      return {
        tex: shuffle(rng, picks).map(([a, b]) => `$${seg(a)} \\parallel ${seg(b)}$`).join(', '),
        ok: (p) => picks.every(([a, b]) => zero(cross(dOf(p, a), dOf(p, b))) && !sameLine(p, a, b)),
      }
    },
  },
}

/** Draw a cube or a cuboid and give an example of each of 4–6 positions of lines and planes. (Tests p. 72, 2.1; p. 82, 3.1) */
export function cubeExamples(rng: Rng): Made {
  const cube = rng() < 0.6
  const keys = shuffle(rng, Object.keys(EXAMPLES)).slice(0, int(rng, 4, 6))
  const made = keys.map((k) => EXAMPLES[k].make(rng))
  return {
    text: `Desenați ${cube ? 'cubul' : 'paralelipipedul dreptunghic'} $ABCDA'B'C'D'$ și dați câte un exemplu de: ${listed(keys.map((k) => EXAMPLES[k].ask))}.`,
    solution: lines(
      `Câte un exemplu (sunt și altele): ${listed(made.map((m) => m.tex))}.`,
      'Muchiile opuse ale unei fețe sunt paralele; o muchie laterală este perpendiculară pe planele bazelor; fețele opuse sunt plane paralele, iar două fețe vecine sunt plane perpendiculare.',
    ),
    verify: () => made.every((m) => m.ok(GENERIC) && m.ok(boxPts(1, 1, 1))),
  }
}

// ================= true or false in a cube or cuboid (5.1, 5.12; test p. 82, 4.1) =================

type Rel = 'll' | 'lp' | 'lperp' | 'pp' | 'pperp'
type Plane = { full: number[]; s: number[] }

/** True or false: five statements on lines and planes of a cube or cuboid, each kind once. (5.12, 1; test p. 82, 4.1) */
export function truthValues(rng: Rng): Made {
  const cube = rng() < 0.5
  const pts = cube ? boxPts(1, 1, 1) : GENERIC
  const name = (l: [number, number]) => seg(l)
  const pname = (p: Plane) => `(${p.s.map((i) => NAMES[i]).join('')})`
  const line = (): [number, number] => {
    const a = int(rng, 0, 7)
    const b = int(rng, 0, 6)
    return [a, b >= a ? b + 1 : b]
  }
  const plane = (): Plane => {
    const full = pick(rng, PLANES)
    return { full, s: shuffle(rng, full).slice(0, 3) }
  }
  const n = (p: Plane) => nOf(pts, p.s)
  const on = (i: number, p: Plane) => inPlane(pts, pts[i], p.s)
  const samePlane = (a: Plane, b: Plane) => zero(cross(n(a), n(b))) && on(b.s[0], a)
  /** Two points of the plane: a line in it with the given property. */
  const inside = (p: Plane, good: (d: P) => boolean) => {
    for (const [i, j] of pairsOf(p.full)) if (good(sub(pts[j], pts[i]))) return NAMES[i] + NAMES[j]
    return null
  }
  const shared = (a: number[], b: number[]) => a.find((i) => b.includes(i))

  const one = (rel: Rel, want: boolean) => {
    for (let t = 0; ; t++) {
      const r = attempt(rel)
      if (r && (r.truth === want || t > 400)) return r
    }
  }
  type Item = { tex: string; truth: boolean; why: string; judge: (q: P[]) => boolean }
  const attempt = (rel: Rel): Item | null => {
    const r = attempt0(rel)
    return r && { ...r, truth: r.judge(pts) }
  }
  const attempt0 = (rel: Rel): Omit<Item, 'truth'> & { truth?: boolean } | null => {
    if (rel === 'll') {
      const [a, b] = [line(), line()]
      if (sameLine(pts, a, b)) return null
      const judge = (q: P[]) => zero(cross(dOf(q, a), dOf(q, b)))
      const truth = judge(pts)
      const common = shared(a, b)
      const why = truth ? 'dreptele sunt coplanare și au aceeași direcție, fără puncte comune'
        : common !== undefined ? `dreptele au punctul comun $${NAMES[common]}$`
          : coplanar(pts, a, b) ? 'dreptele sunt coplanare și se intersectează' : 'dreptele sunt necoplanare'
      return { tex: `${name(a)} \\parallel ${name(b)}`, why, judge }
    }
    if (rel === 'lp') {
      const [l, p] = [line(), plane()]
      const d = dOf(pts, l)
      const inP = on(l[0], p) && on(l[1], p)
      const judge = (q: P[]) => !(inPlane(q, q[l[0]], p.s) && inPlane(q, q[l[1]], p.s)) && dot(dOf(q, l), nOf(q, p.s)) === 0
      const truth = judge(pts)
      let why: string
      if (truth) {
        const par = inside(p, (e) => zero(cross(d, e)))
        why = par ? `$${name(l)} \\parallel ${par}$, iar $${par} \\subset ${pname(p)}$` : 'dreapta nu este inclusă în plan și este paralelă cu o dreaptă din plan'
      } else {
        const at = on(l[0], p) ? l[0] : on(l[1], p) ? l[1] : -1
        why = inP ? 'dreapta este inclusă în plan' : at >= 0 ? `dreapta intersectează planul în punctul $${NAMES[at]}$` : 'dreapta intersectează planul'
      }
      return { tex: `${name(l)} \\parallel ${pname(p)}`, why, judge }
    }
    if (rel === 'lperp') {
      const [l, p] = [line(), plane()]
      const d = dOf(pts, l)
      const judge = (q: P[]) => zero(cross(dOf(q, l), nOf(q, p.s)))
      const truth = judge(pts)
      const not = inside(p, (e) => dot(d, e) !== 0)
      const [x, y, z] = p.s.map((i) => NAMES[i])
      const why = truth ? `dreapta este perpendiculară pe dreptele concurente $${x}${y}$ și $${x}${z}$ din plan`
        : `dreapta nu este perpendiculară pe dreapta $${not}$ din plan`
      return { tex: `${name(l)} \\perp ${pname(p)}`, why, judge }
    }
    const [a, b] = [plane(), plane()]
    if (samePlane(a, b)) return null
    if (rel === 'pp') {
      const judge = (q: P[]) => zero(cross(nOf(q, a.s), nOf(q, b.s)))
      const truth = judge(pts)
      const common = shared(a.full, b.full)
      const why = truth ? 'planele sunt distincte și nu au puncte comune'
        : common !== undefined ? `planele au punctul comun $${NAMES[common]}$` : 'planele se intersectează'
      return { tex: `${pname(a)} \\parallel ${pname(b)}`, why, judge }
    }
    const judge = (q: P[]) => dot(nOf(q, a.s), nOf(q, b.s)) === 0
    const truth = judge(pts)
    let why: string
    if (truth) {
      const ab = inside(a, (e) => zero(cross(e, n(b))))
      const ba = ab ? null : inside(b, (e) => zero(cross(e, n(a))))
      why = ab ? `planul $${pname(a)}$ conține dreapta $${ab}$, perpendiculară pe planul $${pname(b)}$`
        : ba ? `planul $${pname(b)}$ conține dreapta $${ba}$, perpendiculară pe planul $${pname(a)}$` : 'unghiul planelor este drept'
    } else why = zero(cross(n(a), n(b))) ? 'planele sunt paralele' : 'unghiul planelor nu este drept'
    return { tex: `${pname(a)} \\perp ${pname(b)}`, why, judge }
  }

  const rels = shuffle(rng, ['ll', 'lp', 'lperp', 'pp', 'pperp'] as Rel[])
  const items = rels.map((r) => one(r, rng() < 0.5))
  return {
    text: `Fie ${cube ? 'cubul' : 'paralelipipedul dreptunghic'} $ABCDA'B'C'D'$. Precizați valoarea de adevăr a propozițiilor: ${listed(items.map((i) => `$${i.tex}$`))}.`,
    solution: items.map((it, i) => `${ABC[i]}) ${it.truth ? 'Adevărat' : 'Fals'}: ${it.why}.`).join('\n\n'),
    // judged on the figure in coordinates; the same answers on another solid of the same kind
    verify: () => {
      const other = cube ? boxPts(3, 3, 3) : boxPts(3, 7, 4)
      return items.length === 5 && items.every((i) => i.judge(other) === i.truth)
    },
  }
}

// ================= the cube from the sum of its edges (test p. 72, 2.2; p. 82, 2.1) =================

type CubeItem = { q: string; ans: (a: number) => string; why: string; value: (pts: P[]) => number; exact: (a: number) => number }
const ang = (a: [number, number], b: [number, number]) => (pts: P[]) => angle(dOf(pts, a), dOf(pts, b))
const CUBE_ITEMS: CubeItem[] = [
  { q: "m(\\angle(AB', CD'))", ans: () => '90^\\circ', why: "$CD' \\parallel BA'$, iar diagonalele pătratului $ABB'A'$ sunt perpendiculare", value: ang([0, 5], [2, 7]), exact: () => 90 },
  { q: "m(\\angle(AB, B'C))", ans: () => '90^\\circ', why: "$AB \\perp (BCC')$ și $B'C \\subset (BCC')$", value: ang([0, 1], [5, 2]), exact: () => 90 },
  { q: "m(\\angle(B'C, C'D))", ans: () => '60^\\circ', why: "$C'D \\parallel B'A$, iar triunghiul $AB'C$ este echilateral (laturile lui sunt diagonale ale fețelor)", value: ang([5, 2], [6, 3]), exact: () => 60 },
  { q: "m(\\angle(AA', BC))", ans: () => '90^\\circ', why: "$AA' \\parallel BB'$ și $BB' \\perp BC$", value: ang([0, 4], [1, 2]), exact: () => 90 },
  { q: "m(\\angle(A'B', AB))", ans: () => '0^\\circ', why: "$A'B' \\parallel AB$", value: ang([4, 5], [0, 1]), exact: () => 0 },
  { q: "m(\\angle(A'C', BD))", ans: () => '90^\\circ', why: "$A'C' \\parallel AC$, iar diagonalele pătratului $ABCD$ sunt perpendiculare", value: ang([4, 6], [1, 3]), exact: () => 90 },
  { q: "m(\\angle(AD', BD))", ans: () => '60^\\circ', why: "$AD' \\parallel BC'$, iar triunghiul $BC'D$ este echilateral", value: ang([0, 7], [1, 3]), exact: () => 60 },
  { q: "d(A', BD)", ans: (a) => `${surd(a, 2, 6)}\\text{ cm}`, why: "triunghiul $A'BD$ este echilateral, cu latura $\\ell\\sqrt{2}$, iar distanța cerută este înălțimea lui, $\\frac{\\ell\\sqrt{2} \\cdot \\sqrt{3}}{2} = \\frac{\\ell\\sqrt{6}}{2}$", value: (p) => toLine(p[4], p[1], p[3]), exact: (a) => (a * Math.sqrt(6)) / 2 },
  { q: "d(A, C')", ans: (a) => `${surd(a, 1, 3)}\\text{ cm}`, why: "$AC'$ este diagonala cubului, $\\ell\\sqrt{3}$", value: (p) => dist(p[0], p[6]), exact: (a) => a * Math.sqrt(3) },
  { q: "d(A, (BDD'))", ans: (a) => `${surd(a, 2, 2)}\\text{ cm}`, why: "$AC \\perp BD$ și $AC \\perp DD'$, deci $AC \\perp (BDD')$; distanța este $AO = \\frac{AC}{2} = \\frac{\\ell\\sqrt{2}}{2}$, unde $O$ este centrul bazei", value: (p) => toPlane(p[0], p[1], p[3], p[7]), exact: (a) => (a * Math.sqrt(2)) / 2 },
]

/** The edge of a cube from the sum of its edges, then its area and a few angles of lines and distances. (Test p. 72, 2.2) */
export function cubeFromEdgeSum(rng: Rng): Made {
  const a = int(rng, 2, 30)
  const items = shuffle(rng, CUBE_ITEMS).slice(0, int(rng, 3, 4))
  return {
    text: `Suma lungimilor tuturor muchiilor cubului $ABCDA'B'C'D'$ este de ${de(12 * a)} cm. Calculați: ${listed(['lungimea muchiei', 'aria totală', ...items.map((i) => `$${i.q}$`)])}.`,
    solution: lines(
      `a) Cubul are 12 muchii egale: $12\\ell = ${12 * a}$, deci $\\ell = ${a}$ cm.`,
      `b) $\\mathcal{A}_t = 6\\ell^2 = 6 \\cdot ${a * a} = ${6 * a * a}$ cm².`,
      ...items.map((it, i) => `${ABC[i + 2]}) $${it.q} = ${it.ans(a)}$, deoarece ${it.why}.`),
    ),
    verify: () => items.every((it) => close(it.value(boxPts(a, a, a)), it.exact(a))),
  }
}

// ================= the centre of a face of a cube (test p. 72, 2.3) =================

/** {Q} = B'C ∩ BC': AQ, the sine of ∠(AQ, AD') and four perpendicular or parallel positions. (Test p. 72, 2.3) */
export function cubeFaceCenter(rng: Rng): Made {
  const a = int(rng, 2, 30)
  return {
    text: `Cubul $ABCDA'B'C'D'$ are muchia de ${a} cm, iar $\\{Q\\} = B'C \\cap BC'$. Calculați lungimea segmentului $AQ$ și $\\sin(\\angle(AQ, AD'))$, apoi demonstrați că: a) $AB \\perp (BCC')$; b) $AB' \\perp (BCD')$; c) $(ACD') \\parallel (BC'A')$; d) $A'D \\perp AQ$.`,
    solution: lines(
      `$Q$ este centrul feței $BCC'B'$, deci $BQ = \\frac{BC'}{2} = ${surd(a, 2, 2)}$ cm. Cum $AB \\perp (BCC')$, triunghiul $ABQ$ este dreptunghic în $B$:`,
      show(`AQ = \\sqrt{${a * a} + \\frac{${a * a}}{2}} = ${surd(a, 2, 6)}\\text{ cm}`),
      `La fel, $D'Q = ${surd(a, 2, 6)}$ cm, deci triunghiul $AQD'$ este isoscel, cu $AD' = ${surd(a, 1, 2)}$ cm. Fie $P$ mijlocul lui $AD'$: $QP \\perp AD'$ și`,
      show(`QP = \\sqrt{AQ^2 - AP^2} = \\sqrt{\\frac{${3 * a * a}}{2} - \\frac{${a * a}}{2}} = ${a}\\text{ cm}, \\qquad \\sin(\\angle QAD') = \\frac{QP}{AQ} = \\frac{${a}}{${surd(a, 2, 6)}} = \\frac{\\sqrt{6}}{3}`),
      "a) $AB \\perp BC$ și $AB \\perp BB'$, drepte concurente din planul $(BCC')$, deci $AB \\perp (BCC')$.",
      "b) $AB' \\perp A'B$ (diagonalele pătratului $ABB'A'$) și $AB' \\perp BC$ (pentru că $BC \\perp (ABB')$). Dreptele $A'B$ și $BC$ sunt concurente și se află în planul $(BCD')$ (dreptunghiul $A'BCD'$), deci $AB' \\perp (BCD')$.",
      "c) $AC \\parallel A'C'$ și $CD' \\parallel BA'$ (din dreptunghiurile $ACC'A'$ și $A'BCD'$). Planul $(ACD')$ conține două drepte concurente paralele cu planul $(BC'A')$, deci $(ACD') \\parallel (BC'A')$.",
      "d) $A'D \\perp AD'$ (diagonalele pătratului $ADD'A'$) și $A'D \\perp AB$ (pentru că $AB \\perp (ADD')$), deci $A'D \\perp (ABC')$. Punctul $Q$ se află pe $BC'$, deci $AQ \\subset (ABC'D')$ și $A'D \\perp AQ$.",
    ),
    verify: () => {
      const p = boxPts(a, a, a)
      const Q = mid(p[5], p[2])
      const s = Math.sin((angle(sub(Q, p[0]), sub(p[7], p[0])) * Math.PI) / 180)
      return close(dist(p[0], Q), (a * Math.sqrt(6)) / 2) && close(s, Math.sqrt(6) / 3) && close(dot(sub(p[3], p[4]), sub(Q, p[0])), 0)
        && zero(cross(dOf(p, [0, 5]), normal(p[1], p[2], p[7]))) && zero(cross(normal(p[0], p[2], p[7]), normal(p[1], p[6], p[4])))
    },
  }
}

// ================= the regular tetrahedron (test p. 72, 2.4) =================

/** A regular tetrahedron of edge a: its height, the distance from the midpoint of an edge to the opposite edge, and the angle of opposite edges. (Test p. 72, 2.4) */
export function tetraBasics(rng: Rng): Made {
  const a = int(rng, 2, 40)
  return {
    text: `În tetraedrul regulat $VABC$ cu muchia de ${a} cm, aflați: a) $d(V, (ABC))$; b) $d(M, VC)$, unde $M$ este mijlocul lui $[AB]$; c) $m(\\angle(VC, AB))$.`,
    solution: lines(
      `a) Piciorul înălțimii este centrul $O$ al triunghiului echilateral $ABC$: $OC = \\frac{\\ell\\sqrt{3}}{3} = ${surd(a, 3, 3)}$ cm. Din triunghiul $VOC$, dreptunghic în $O$:`,
      show(`VO = \\sqrt{${a * a} - \\frac{${a * a}}{3}} = ${surd(a, 3, 6)}\\text{ cm}`),
      `b) $VM$ și $CM$ sunt înălțimi în triunghiurile echilaterale $VAB$ și $CAB$: $VM = CM = ${surd(a, 2, 3)}$ cm. Triunghiul $VMC$ este isoscel; fie $N$ mijlocul lui $VC$, atunci $MN \\perp VC$ și`,
      show(`d(M, VC) = MN = \\sqrt{\\frac{${3 * a * a}}{4} - \\frac{${a * a}}{4}} = ${surd(a, 2, 2)}\\text{ cm}`),
      'c) $AB \\perp VM$ și $AB \\perp CM$, deci $AB \\perp (VMC)$ și $AB \\perp VC$: $m(\\angle(VC, AB)) = 90^\\circ$.',
    ),
    verify: () => {
      const r = a / Math.sqrt(3)
      const [A, B, C]: P[] = [0, 120, 240].map((t) => [r * Math.cos((t * Math.PI) / 180), r * Math.sin((t * Math.PI) / 180), 0])
      const V: P = [0, 0, Math.sqrt(a * a - r * r)]
      return close(dist(V, A), a) && close(toPlane(V, A, B, C), (a * Math.sqrt(6)) / 3) && close(toLine(mid(A, B), V, C), (a * Math.sqrt(2)) / 2) && close(angle(sub(C, V), sub(B, A)), 90)
    },
  }
}

// ================= regular pyramids (test p. 61, 1.8–1.9; p. 62, 2.9) =================

/** [m, ap, VA]: half the base edge, the apothem and the lateral edge of a regular triangular pyramid, all whole. */
const TRI_PYR: [number, number, number][] = []
for (let c = 2; c <= 50; c++) for (let m = 1; m < c; m++) {
  const ap = Math.sqrt(c * c - m * m)
  if (Number.isInteger(ap) && 3 * ap * ap > m * m) TRI_PYR.push([m, ap, c])
}

/** A regular triangular pyramid: the base edge from the base area, then the lateral area; or a face and all edges. (Tests p. 61, 1.8; p. 62, 2.9) */
export function triPyramidFaces(rng: Rng): Made {
  const [m, ap, c] = pick(rng, TRI_PYR)
  const l = 2 * m
  const fromBase = rng() < 0.5
  const apo = (x: string, y: string, z: string) => `Fie $M$ mijlocul lui $${y}${z}$. Triunghiul $V${y}${z}$ este isoscel, deci $VM \\perp ${y}${z}$, iar $VM$ este apotema piramidei${x}:`
  return {
    text: fromBase
      ? `Piramida triunghiulară regulată $VABC$ are aria bazei de $${surd(m * m, 1, 3)}$ cm² și $VA = ${c}$ cm. Calculați: a) lungimea muchiei $AB$; b) aria laterală a piramidei.`
      : `Piramida triunghiulară regulată $VABC$ are $VA = ${c}$ cm și $AB = ${l}$ cm. Calculați: a) aria triunghiului $VAB$; b) suma lungimilor tuturor muchiilor.`,
    solution: fromBase
      ? lines(
        show(`\\text{a) } \\mathcal{A}_b = \\frac{AB^2\\sqrt{3}}{4} = ${surd(m * m, 1, 3)} \\Rightarrow AB^2 = ${4 * m * m} \\Rightarrow AB = ${l}\\text{ cm}`),
        `b) ${apo('', 'B', 'C')}`,
        show(`VM = \\sqrt{VB^2 - BM^2} = \\sqrt{${c * c} - ${m * m}} = ${ap}\\text{ cm}, \\qquad \\mathcal{A}_l = 3 \\cdot \\frac{BC \\cdot VM}{2} = 3 \\cdot \\frac{${l} \\cdot ${ap}}{2} = ${3 * m * ap}\\text{ cm}^2`),
      )
      : lines(
        `a) ${apo(' (înălțimea feței $VAB$)', 'A', 'B')}`,
        show(`VM = \\sqrt{${c * c} - ${m * m}} = ${ap}\\text{ cm}, \\qquad \\mathcal{A}_{VAB} = \\frac{AB \\cdot VM}{2} = \\frac{${l} \\cdot ${ap}}{2} = ${m * ap}\\text{ cm}^2`),
        `b) Piramida are 3 muchii ale bazei și 3 muchii laterale: $3 \\cdot ${l} + 3 \\cdot ${c} = ${3 * l + 3 * c}$ cm.`,
      ),
    verify: () => {
      const r = l / Math.sqrt(3)
      const [A, B, C]: P[] = [0, 120, 240].map((t) => [r * Math.cos((t * Math.PI) / 180), r * Math.sin((t * Math.PI) / 180), 0])
      const V: P = [0, 0, Math.sqrt(c * c - r * r)]
      const face = len(cross(sub(B, V), sub(C, V))) / 2
      return close(dist(V, A), c) && close(dist(A, B), l) && close(face, m * ap) && close((l * l * Math.sqrt(3)) / 4, m * m * Math.sqrt(3))
    },
  }
}

/** A regular square pyramid with all edges equal: the triangle VAC is right, and the midpoints of VA, VD lie in a plane with B and C. (Test p. 61, 1.9) */
export function quadPyramidEqualEdges(rng: Rng): Made {
  const a = int(rng, 2, 40)
  return {
    text: `Piramida patrulateră regulată $VABCD$ are $AB = VA = ${a}$ cm. a) Calculați aria triunghiului $VAC$. b) Dacă $M$ este mijlocul lui $VA$ și $N$ este mijlocul lui $VD$, arătați că punctele $M$, $N$, $B$ și $C$ sunt coplanare și calculați perimetrul patrulaterului $MNCB$.`,
    solution: lines(
      `a) $AC$ este diagonala pătratului $ABCD$: $AC = ${surd(a, 1, 2)}$ cm. Cum $VA^2 + VC^2 = ${2 * a * a} = AC^2$, triunghiul $VAC$ este dreptunghic în $V$ (reciproca teoremei lui Pitagora):`,
      show(`\\mathcal{A}_{VAC} = \\frac{VA \\cdot VC}{2} = \\frac{${a * a}}{2}${a % 2 === 0 ? ` = ${(a * a) / 2}` : ''}\\text{ cm}^2`),
      `b) $MN$ este linie mijlocie în triunghiul $VAD$: $MN \\parallel AD$ și $MN = \\frac{AD}{2} = ${frac(a, 2)}$ cm. Cum $AD \\parallel BC$, avem $MN \\parallel BC$; două drepte paralele determină un plan, deci $M$, $N$, $B$, $C$ sunt coplanare ($MNCB$ este trapez).`,
      `Fețele $VAB$ și $VDC$ sunt triunghiuri echilaterale, iar $BM$ și $CN$ sunt mediane (și înălțimi) în ele: $BM = CN = ${surd(a, 2, 3)}$ cm.`,
      show(`\\mathcal{P}_{MNCB} = ${frac(a, 2)} + ${a} + 2 \\cdot ${surd(a, 2, 3)} = ${frac(3 * a, 2)} + ${surd(a, 1, 3)}\\text{ cm}`),
    ),
    verify: () => {
      const s = a / 2
      const [A, B, C, D]: P[] = [[-s, -s, 0], [s, -s, 0], [s, s, 0], [-s, s, 0]]
      const V: P = [0, 0, a / Math.sqrt(2)]
      const [M, N] = [mid(V, A), mid(V, D)]
      const per = dist(M, N) + dist(N, C) + dist(C, B) + dist(B, M)
      return close(dist(V, A), a) && close(len(cross(sub(A, V), sub(C, V))) / 2, (a * a) / 2) && close(per, 1.5 * a + a * Math.sqrt(3))
        && Math.abs(dot(cross(sub(N, M), sub(B, M)), sub(C, M))) < 1e-9
    },
  }
}

// ================= the cylinder and the cone (test p. 62, 2.10–2.11) =================

/** The diagonals of the axial section of a cylinder make 60°: the radius from the generatrix. (Test p. 62, 2.10) */
export function cylinderAxialDiagonals(rng: Rng): Made {
  const h = int(rng, 2, 30)
  const tall = rng() < 0.5
  // tall: AA' > AB, so AB = h√3/3 and R² = h²/12; otherwise AB = h√3 and R² = 3h²/4
  const [rp, rq] = tall ? [1, 12] : [3, 4]
  return {
    text: `Un cilindru circular drept are diametrele bazelor $AB$ și $A'B'$, generatoarele $AA' = BB' = ${h}$ cm și $m(\\angle(AB', A'B)) = 60^\\circ$. Aflați aria bazei și volumul cilindrului, știind că $AA' ${tall ? '>' : '<'} AB$.`,
    solution: lines(
      "Secțiunea axială $ABB'A'$ este un dreptunghi. Diagonalele lui, $AB'$ și $A'B$, sunt congruente și se înjumătățesc în punctul $O$, iar unghiul ascuțit dintre ele, de $60^\\circ$, se află în fața laturii mai mici.",
      tall
        ? `Latura mai mică este $AB$: triunghiul $AOB$ este isoscel, cu un unghi de $60^\\circ$, deci echilateral, și $AB' = 2AB$. În triunghiul $ABB'$, dreptunghic în $B$: $BB'^2 = AB'^2 - AB^2 = 3AB^2$, deci $AB = \\frac{${h}}{\\sqrt{3}} = ${surd(h, 3, 3)}$ cm și $R = ${surd(h, 6, 3)}$ cm.`
        : `Latura mai mică este $AA'$: triunghiul $AOA'$ este isoscel, cu un unghi de $60^\\circ$, deci echilateral, și $AB' = 2AA' = ${2 * h}$ cm. În triunghiul $ABB'$, dreptunghic în $B$: $AB = \\sqrt{${4 * h * h} - ${h * h}} = ${surd(h, 1, 3)}$ cm, deci $R = ${surd(h, 2, 3)}$ cm.`,
      show(`\\mathcal{A}_b = \\pi R^2 = ${pi(rp * h * h, rq)}\\text{ cm}^2, \\qquad V = \\mathcal{A}_b \\cdot G = ${pi(rp * h * h, rq)} \\cdot ${h} = ${pi(rp * h ** 3, rq)}\\text{ cm}^3`),
    ),
    verify: () => {
      const w = 2 * Math.sqrt((rp * h * h) / rq)
      const [A, B, A1, B1]: P[] = [[0, 0, 0], [w, 0, 0], [0, 0, h], [w, 0, h]]
      return close(angle(sub(B1, A), sub(B, A1)), 60) && (tall ? h > w : h < w)
    },
  }
}

/** The development of the lateral surface of a cone is a sector of given radius and angle: the radius, height and lateral area of the cone. (Test p. 62, 2.11) */
export function sectorToCone(rng: Rng): Made {
  for (;;) {
    const u = pick(rng, [60, 72, 90, 120, 144, 150, 180, 200, 216, 240, 270, 288, 300])
    const k = u / gcd(u, 360)
    const r = k * int(rng, 1, Math.max(1, Math.floor(30 / k)))
    const G = (360 * r) / u
    if (G > 100) continue
    return {
      text: `Un sector de cerc cu raza de ${G} cm și unghiul la centru de $${u}^\\circ$ reprezintă desfășurarea suprafeței laterale a unui con circular drept. Aflați raza bazei, înălțimea și aria laterală a conului.`,
      solution: lines(
        `Raza sectorului este generatoarea conului, $G = ${G}$ cm, iar lungimea arcului sectorului este lungimea cercului de la bază:`,
        show(`\\frac{2\\pi \\cdot ${G} \\cdot ${u}^\\circ}{360^\\circ} = 2\\pi R \\Rightarrow R = \\frac{${G} \\cdot ${u}}{360} = ${r}\\text{ cm}`),
        show(`h = \\sqrt{G^2 - R^2} = \\sqrt{${G * G} - ${r * r}} = ${root(G * G - r * r)}\\text{ cm}, \\qquad \\mathcal{A}_l = \\pi R G = ${pi(r * G)}\\text{ cm}^2`),
      ),
      verify: () => close(2 * Math.PI * r, (2 * Math.PI * G * u) / 360) && r < G,
    }
  }
}

// ================= trapezoids and perpendiculars (test p. 71, 1.2–1.3; p. 82, 3.2) =================

/** [AB, AD, CD − AB, EA, EB] for a right trapezoid where AC bisects ∠C (so BC = AB) and a right triangle AEB. */
const TRAP: [number, number, number, number, number][] = []
for (let b = 5; b <= 30; b++) for (let h = 2; h < b; h++) {
  const w = Math.sqrt(b * b - h * h)
  if (!Number.isInteger(w)) continue
  for (let ea = 2; ea <= 60; ea++) {
    const e = Math.sqrt(ea * ea + b * b)
    if (Number.isInteger(e)) TRAP.push([b, h, w, ea, e])
  }
}

/** A right trapezoid where AC bisects ∠C and a right triangle AEB in another plane with EA ⊥ BC. (Test p. 71, 1.2) */
export function trapezoidTriangleSpace(rng: Rng): Made {
  const [b, h, w, ea, e] = pick(rng, TRAP)
  const ac2 = h * h + (b + w) ** 2
  return {
    text: `Fie trapezul dreptunghic $ABCD$, cu $AB \\parallel CD$, $AB < CD$, $m(\\angle A) = 90^\\circ$, și triunghiul $AEB$, dreptunghic în $A$, situate în plane diferite, astfel încât $EA \\perp BC$. Dacă $AC$ este bisectoarea unghiului $C$, $AD = ${h}$ cm, $AB = ${b}$ cm și $d(E, B) = ${e}$ cm: a) arătați că $AB \\parallel (EDC)$; b) arătați că $EA \\perp (ABC)$; c) calculați $\\sin(\\angle(EB, DC))$; d) demonstrați că $AB \\perp (EAD)$; e) calculați $d(E, C)$.`,
    solution: lines(
      'a) $AB \\parallel CD$, $CD \\subset (EDC)$ și $AB \\not\\subset (EDC)$, deci $AB \\parallel (EDC)$.',
      'b) $EA \\perp AB$ (triunghiul $AEB$ este dreptunghic în $A$) și $EA \\perp BC$, iar $AB$ și $BC$ sunt drepte concurente din planul $(ABC)$, deci $EA \\perp (ABC)$.',
      `c) Cum $DC \\parallel AB$, $\\angle(EB, DC) = \\angle(EB, AB) = \\angle EBA$. Din triunghiul $EAB$: $EA = \\sqrt{${e * e} - ${b * b}} = ${ea}$ cm, deci`,
      show(`\\sin(\\angle EBA) = \\frac{EA}{EB} = ${frac(ea, e)}`),
      'd) $AB \\perp AD$ (trapezul este dreptunghic) și $AB \\perp EA$, drepte concurente din planul $(EAD)$, deci $AB \\perp (EAD)$.',
      `e) Cum $AC$ este bisectoare, $\\angle ACB \\equiv \\angle ACD$, iar $\\angle ACD \\equiv \\angle CAB$ (alterne interne, $AB \\parallel CD$). Deci $\\angle CAB \\equiv \\angle ACB$, triunghiul $ABC$ este isoscel și $BC = AB = ${b}$ cm. Ducem $BF \\perp CD$, $F \\in CD$: $BF = AD = ${h}$ cm, $FC = \\sqrt{${b * b} - ${h * h}} = ${w}$ cm, deci $CD = ${b} + ${w} = ${b + w}$ cm.`,
      show(`AC^2 = AD^2 + DC^2 = ${h * h} + ${(b + w) ** 2} = ${ac2}`),
      `Cum $EA \\perp (ABC)$, avem $EA \\perp AC$:`,
      show(`d(E, C) = EC = \\sqrt{EA^2 + AC^2} = \\sqrt{${ea * ea} + ${ac2}} = ${root(ea * ea + ac2)}\\text{ cm}`),
    ),
    verify: () => {
      const [A, B, C, D, E]: P[] = [[0, 0, 0], [b, 0, 0], [b + w, h, 0], [0, h, 0], [0, 0, ea]]
      const bis = close(angle(sub(A, C), sub(D, C)), angle(sub(A, C), sub(B, C)))
      return bis && close(dist(B, C), b) && close(dist(E, B), e) && close(dot(sub(E, A), sub(C, B)), 0) && close(dist(E, C), Math.sqrt(ea * ea + ac2))
        && close(Math.sin((angle(sub(B, E), sub(C, D)) * Math.PI) / 180), ea / e)
    },
  }
}

/** A trapezoid with AD in α, the perpendiculars from B and C: ADFE is a trapezoid, with the sides from similar triangles. (Test p. 72, 1.3) */
export function trapezoidProjections(rng: Rng): Made {
  const [x, s, p] = rightTriangle(rng, 30)
  const i = int(rng, 1, 4)
  let j = int(rng, 1, 3)
  if (j >= i) j++
  return {
    text: `Un trapez $ABCD$, cu $AB \\parallel CD$, are latura $AD$ inclusă în planul $\\alpha$, iar vârfurile $B$ și $C$ se află de aceeași parte a lui $\\alpha$. Perpendicularele duse din $B$ și $C$ pe planul $\\alpha$ îl intersectează în punctele $E$ și $F$. a) Arătați că $ADFE$ este trapez. b) Dacă $AB = ${i * p}$ cm, $CD = ${j * p}$ cm și $BE = ${i * s}$ cm, aflați lungimile segmentelor $CF$, $AE$ și $DF$.`,
    solution: lines(
      "a) $BE \\parallel CF$ (ambele sunt perpendiculare pe $\\alpha$) și $AB \\parallel CD$. Planul $(ABE)$ conține dreptele concurente $AB$ și $BE$, paralele cu dreptele $DC$ și $CF$ din planul $(DCF)$, deci $(ABE) \\parallel (DCF)$. Planul $\\alpha$ taie aceste plane paralele după dreptele $AE$ și $DF$, deci $AE \\parallel DF$.",
      `Triunghiurile $ABE$ și $DCF$ sunt dreptunghice în $E$ și $F$ și au $\\angle BAE \\equiv \\angle CDF$ (unghiuri cu laturile paralele), deci sunt asemenea, cu raportul $\\frac{AB}{DC} = ${frac(i, j)} \\neq 1$. Așadar $AE \\neq DF$, iar $ADFE$ este un trapez cu bazele $AE$ și $DF$.`,
      show(`\\text{b) } AE = \\sqrt{${(i * p) ** 2} - ${(i * s) ** 2}} = ${i * x}\\text{ cm}, \\qquad \\frac{CF}{BE} = \\frac{DF}{AE} = \\frac{DC}{AB} = ${frac(j, i)}`),
      show(`CF = ${i * s} \\cdot ${frac(j, i)} = ${j * s}\\text{ cm}, \\qquad DF = ${i * x} \\cdot ${frac(j, i)} = ${j * x}\\text{ cm}`),
    ),
    verify: () => {
      const A: P = [0, 0, 0], D: P = [0, 7, 0], u: P = [x, 0, s]
      const B = add(A, [i * u[0], 0, i * u[2]]), C = add(D, [j * u[0], 0, j * u[2]])
      const E: P = [B[0], B[1], 0], F: P = [C[0], C[1], 0]
      return close(dist(A, B), i * p) && close(dist(C, D), j * p) && close(dist(C, F), j * s) && close(dist(A, E), i * x) && close(dist(D, F), j * x) && zero(cross(sub(E, A), sub(F, D)))
    },
  }
}

/** Perpendicular AV on the plane of a square: VB, d(V, DB), the area of VBC, an angle of lines, a line perpendicular to a plane, a line-plane angle and a dihedral angle. (Test p. 81, 1.1) */
export function squarePerpFull(rng: Rng): Made {
  const [l, h, vb] = rightTriangle(rng, 30)
  const vo2x2 = 2 * h * h + l * l // 2 · VO²
  return {
    text: `Pe planul pătratului $ABCD$, cu $AB = ${l}$ cm, se ridică perpendiculara $AV$, cu $AV = ${h}$ cm. Calculați: a) $VB$; b) $d(V, DB)$; c) aria triunghiului $VBC$; d) $m(\\angle(VA, BC))$; e) arătați că $AD \\perp (VAB)$; f) $\\sin(\\angle(VD, (VAB)))$; g) $\\cos(\\angle((VDB), (ABC)))$.`,
    solution: lines(
      `a) $VA \\perp AB$, deci $VB = \\sqrt{${h * h} + ${l * l}} = ${vb}$ cm.`,
      `b) Fie $O$ centrul pătratului: $AO \\perp BD$ și $VA \\perp (ABC)$, deci, din teorema celor trei perpendiculare, $VO \\perp BD$. Cu $AO = ${surd(l, 2, 2)}$ cm:`,
      show(`d(V, DB) = VO = \\sqrt{${h * h} + \\frac{${l * l}}{2}} = ${sqrtFrac(vo2x2, 2)}\\text{ cm}`),
      `c) $BC \\perp AB$ și $BC \\perp VA$, deci $BC \\perp (VAB)$ și $BC \\perp VB$: $\\mathcal{A}_{VBC} = \\frac{BC \\cdot VB}{2} = \\frac{${l} \\cdot ${vb}}{2} = ${frac(l * vb, 2)}$ cm².`,
      'd) $VA \\perp (ABC)$ și $BC \\subset (ABC)$, deci $m(\\angle(VA, BC)) = 90^\\circ$.',
      'e) $AD \\perp AB$ și $AD \\perp VA$, drepte concurente din planul $(VAB)$, deci $AD \\perp (VAB)$.',
      `f) Proiecția lui $D$ pe $(VAB)$ este $A$, deci $\\angle(VD, (VAB)) = \\angle DVA$, iar $VD = VB = ${vb}$ cm: $\\sin(\\angle DVA) = \\frac{AD}{VD} = ${frac(l, vb)}$.`,
      `g) $AO \\perp BD$ și $VO \\perp BD$, deci unghiul planelor $(VDB)$ și $(ABC)$ este $\\angle VOA$:`,
      show(`\\cos(\\angle VOA) = \\frac{AO}{VO} = ${over(l, vo2x2)}`),
    ),
    verify: () => {
      const [A, B, C, D, V]: P[] = [[0, 0, 0], [l, 0, 0], [l, l, 0], [0, l, 0], [0, 0, h]]
      return close(dist(V, B), vb) && close(toLine(V, D, B), Math.sqrt(vo2x2 / 2)) && close(len(cross(sub(B, V), sub(C, V))) / 2, (l * vb) / 2)
        && close(sinLP(V, D, V, A, B), l / vb) && close(cosPP(V, D, B, A, B, C), l / Math.sqrt(vo2x2))
    },
  }
}

/** Parallel segments through the vertices of a square or rectangle: parallel lines and planes, then a congruent quadrilateral. (Test p. 82, 1.2) */
export function parallelSquare(rng: Rng): Made {
  const square = rng() < 0.5
  const p = int(rng, 2, 30)
  let q = p
  while (!square && q === p) q = int(rng, 2, 30)
  const s = int(rng, 2, 30)
  const shape = square ? `pătratului $ABCD$, cu latura de ${p} cm` : `dreptunghiului $ABCD$, cu $AB = ${p}$ cm și $BC = ${q}$ cm`
  const [P2, A2] = [2 * (p + q), p * q]
  return {
    text: `Prin vârfurile ${shape}, se duc, de aceeași parte a planului său, segmentele $AA'$, $BB'$, $CC'$, $DD'$, paralele între ele și neconținute în planul $(ABC)$. a) Arătați că $AB \\parallel (DD'C')$ și $(AA'B) \\parallel (DD'C')$. b) Dacă $AA' = BB' = CC' = DD' = ${s}$ cm, arătați că $(ABC) \\parallel (A'B'C')$ și calculați perimetrul și aria patrulaterului $A'B'C'D'$.`,
    solution: lines(
      "a) $AB \\parallel DC$, $DC \\subset (DD'C')$ și $AB \\not\\subset (DD'C')$, deci $AB \\parallel (DD'C')$. Planul $(AA'B)$ conține dreptele concurente $AA'$ și $AB$, paralele cu dreptele $DD'$ și $DC$ ale planului $(DD'C')$, deci $(AA'B) \\parallel (DD'C')$.",
      "b) $AA' \\parallel BB'$ și $AA' = BB'$, deci $ABB'A'$ este paralelogram: $A'B' \\parallel AB$ și $A'B' = AB$. La fel, $B'C' \\parallel BC$ și $B'C' = BC$, $C'D' = CD$, $D'A' = DA$. Planul $(A'B'C')$ conține dreptele concurente $A'B'$ și $B'C'$, paralele cu planul $(ABC)$, deci $(ABC) \\parallel (A'B'C')$.",
      `Patrulaterul $A'B'C'D'$ are laturile egale și paralele cu ale lui $ABCD$ (unghiurile cu laturile paralele sunt congruente), deci este ${square ? 'un pătrat' : 'un dreptunghi'} congruent cu $ABCD$:`,
      show(`\\mathcal{P}_{A'B'C'D'} = ${square ? `4 \\cdot ${p}` : `2(${p} + ${q})`} = ${P2}\\text{ cm}, \\qquad \\mathcal{A}_{A'B'C'D'} = ${square ? `${p}^2` : `${p} \\cdot ${q}`} = ${A2}\\text{ cm}^2`),
    ),
    verify: () => {
      const t: P = [1, 2, 0.5 * s]
      const base: P[] = [[0, 0, 0], [p, 0, 0], [p, q, 0], [0, q, 0]]
      const top = base.map((v) => add(v, t))
      const per = top.reduce((sum, v, k) => sum + dist(v, top[(k + 1) % 4]), 0)
      return close(per, P2) && close(len(cross(sub(top[1], top[0]), sub(top[3], top[0]))), A2) && (square || p !== q)
    },
  }
}

/** A right trapezoid with MD perpendicular on its plane: distances, a dihedral angle, the angle of MB with the base and of DB with (AMB). (Test p. 82, 3.2) */
export function rightTrapezoidPerp(rng: Rng): Made {
  for (;;) {
    const p = int(rng, 2, 20), w = int(rng, 1, 12)
    const r = int(rng, w + 1, w + 15)
    const q = p + w
    const ad2 = r * r - w * w
    const deg = pick(rng, DEGS)
    const [t0, t1] = ANGLE[deg]
    if ((ad2 * t0) % t1 !== 0) continue
    const md2 = (ad2 * t0) / t1
    if (rootParts(md2)[1] > 7 || rootParts(ad2)[1] > 7) continue
    const ma2 = md2 + ad2, db2 = ad2 + p * p
    // as in the book, the distance to BC and the diagonal DB come out with small radicals
    if (rootParts(md2 * r * r + q * q * ad2)[1] > 30 || rootParts(db2)[1] > 30) continue
    const tgName = deg === 30 ? '\\frac{\\sqrt{3}}{3}' : deg === 45 ? '1' : '\\sqrt{3}'
    return {
      text: `Fie trapezul dreptunghic $ABCD$, cu $AB \\parallel CD$, $m(\\angle A) = m(\\angle D) = 90^\\circ$, $AB = ${p}$ cm, $CD = ${q}$ cm și $BC = ${r}$ cm. Pe planul trapezului se ridică perpendiculara $MD$, cu $MD = ${root(md2)}$ cm. Calculați: a) $d(M, AB)$; b) $m(\\angle((MAB), (ABC)))$; c) $d(M, BC)$; d) $\\operatorname{tg}(\\angle(MB, (ABC)))$; e) $\\sin(\\angle(DB, (AMB)))$.`,
      solution: lines(
        `Ducem $BF \\perp CD$, $F \\in CD$: $ABFD$ este dreptunghi, $FC = ${q} - ${p} = ${w}$ cm și $AD = BF = \\sqrt{${r * r} - ${w * w}} = ${root(ad2)}$ cm.`,
        `a) $DA \\perp AB$ și $MD \\perp (ABC)$, deci, din teorema celor trei perpendiculare, $MA \\perp AB$: $d(M, AB) = MA = \\sqrt{${md2} + ${ad2}} = ${root(ma2)}$ cm.`,
        `b) $(MAB) \\cap (ABC) = AB$, $MA \\perp AB$ și $DA \\perp AB$, deci unghiul planelor este $\\angle MAD$: $\\operatorname{tg}(\\angle MAD) = \\frac{MD}{AD} = ${tgName}$, adică $${deg}^\\circ$.`,
        `c) Fie $DE \\perp BC$, $E \\in BC$; din teorema celor trei perpendiculare $ME \\perp BC$. Din aria triunghiului $DBC$: $\\frac{DC \\cdot AD}{2} = \\frac{BC \\cdot DE}{2}$, deci $DE = \\frac{${q} \\cdot ${root(ad2)}}{${r}} = ${sqrtFrac(q * q * ad2, r * r)}$ cm și`,
        show(`d(M, BC) = ME = \\sqrt{MD^2 + DE^2} = ${sqrtFrac(md2 * r * r + q * q * ad2, r * r)}\\text{ cm}`),
        `d) Proiecția lui $MB$ pe $(ABC)$ este $DB = \\sqrt{${ad2} + ${p * p}} = ${root(db2)}$ cm, deci $\\operatorname{tg}(\\angle MBD) = \\frac{MD}{DB} = ${sqrtFrac(md2, db2)}$.`,
        `e) $AB \\perp AD$ și $AB \\perp MD$, deci $AB \\perp (MAD)$. Ducem $DN \\perp MA$, $N \\in MA$; cum $DN \\subset (MAD)$, $DN \\perp AB$, deci $DN \\perp (AMB)$ și proiecția lui $DB$ pe $(AMB)$ este $NB$. În triunghiul $MDA$: $DN = \\frac{MD \\cdot AD}{MA} = ${sqrtFrac(md2 * ad2, ma2)}$ cm.`,
        show(`\\sin(\\angle DBN) = \\frac{DN}{DB} = ${sqrtFrac(md2 * ad2, ma2 * db2)}`),
      ),
      verify: () => {
        const ad = Math.sqrt(ad2), md = Math.sqrt(md2)
        const [A, B, C, D, M]: P[] = [[0, ad, 0], [p, ad, 0], [q, 0, 0], [0, 0, 0], [0, 0, md]]
        const s = sinLP(M, B, A, B, C)
        return close(dist(B, C), r) && close(toLine(M, A, B), Math.sqrt(ma2)) && close(cosPP(M, A, B, A, B, C), Math.cos((deg * Math.PI) / 180))
          && close(toLine(M, B, C), Math.sqrt(md2 + (q * q * ad2) / (r * r))) && close(s / Math.sqrt(1 - s * s), Math.sqrt(md2 / db2))
          && close(sinLP(D, B, A, M, B), Math.sqrt((md2 * ad2) / (ma2 * db2)))
      },
    }
  }
}

const geo = (id: string, joins: string, forms: Partial<Record<1 | 2 | 3, Form[]>>): Kind8 =>
  ({ id, label: id, topic: 'Geometrie', joins, forms: { 1: forms[1] ?? [], 2: forms[2] ?? [], 3: forms[3] ?? [] } })

/** All join the kinds of grade VIII geometry; the level follows the book (tests without stars: by difficulty). */
export const KINDS: Kind8[] = [
  geo('g8e-space', 'viii-space', { 1: [cubeExamples, truthValues], 2: [trapezoidProjections, cubeFromEdgeSum, squarePerpFull, parallelSquare], 3: [trapezoidTriangleSpace, cubeFaceCenter] }),
  geo('g8e-pyramids', 'viii-pyramids', { 1: [triPyramidFaces], 2: [quadPyramidEqualEdges, tetraBasics] }),
  geo('g8e-round', 'viii-round', { 2: [cylinderAxialDiagonals] }),
  geo('g8e-elements', 'viii-elements', { 1: [sectorToCone] }),
  geo('g8e-dihedral', 'viii-dihedral', { 3: [rightTrapezoidPerp] }),
]
