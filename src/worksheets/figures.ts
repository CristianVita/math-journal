// A figure for a generated geometry exercise, read from its statement (asked for by the user on 13 November 2026).
// The generators write only the text, so the figure is found from the words: the solid or the plane figure named in
// it ("cubul ABCDA'B'C'D'", "piramida patrulateră regulată VABCD", "triunghiul ABC dreptunghic în A", "pe planul
// pătratului ABCD se ridică perpendiculara AM"), the points it defines (midpoints, the centre O, the foot of an
// altitude) and the segments and planes it names. Lengths written as plain numbers set the proportions; the others
// keep a usual shape, as the figures in a book do. Nothing is drawn when the statement is not understood.
import { foot, foot3, mid, mid3, plane, solid, type Fig, type P3, type Pt } from '../models/figure'
import { BOX, PRISM3, PYR4, TETRA, box, prism3, pyr4, tetra } from '../models/data/shapes'

type Pts = Record<string, Pt>
type Lens = Record<string, number>
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))
const NAME = "[A-Z]'?"

/** The lengths written as plain numbers: "$AB = 12$", "$AA' = 14$", "$AB = AC = 26$". */
function lengths(text: string): Lens {
  const out: Lens = {}
  const put = (k: string, v: number) => {
    if (!(k in out) && v > 0) out[k] = v
  }
  for (const m of text.matchAll(new RegExp(`(${NAME}${NAME})\\s*=\\s*(${NAME}${NAME})\\s*=\\s*(\\d+(?:\\{,\\}\\d+)?)(?![\\d\\\\{])`, 'g'))) {
    put(m[1], Number(m[3].replace('{,}', '.')))
    put(m[2], Number(m[3].replace('{,}', '.')))
  }
  for (const m of text.matchAll(new RegExp(`(?<![A-Za-z'])(${NAME}${NAME})\\s*=\\s*(\\d+(?:\\{,\\}\\d+)?)(?![\\d\\\\{])`, 'g'))) put(m[1], Number(m[2].replace('{,}', '.')))
  return out
}
/** A length by its name, either way round: AB or BA. */
function len(L: Lens, ...keys: string[]): number | undefined {
  for (const k of keys) {
    if (L[k]) return L[k]
    const parts = k.match(/[A-Z]'?/g)
    if (parts?.length === 2 && L[parts[1] + parts[0]]) return L[parts[1] + parts[0]]
  }
  return undefined
}
/** A number written after some words: "latura bazei de 12 cm", "raza de 6 cm". */
function after(text: string, words: RegExp): number | undefined {
  const m = text.match(new RegExp('(?:' + words.source + ')\\s*(?:de\\s*|egal[ăe] cu\\s*|=\\s*|\\$)*\\$?(\\d+(?:\\{,\\}\\d+)?)(?![\\d\\\\{])'))
  return m ? Number(m[1].replace('{,}', '.')) : undefined
}

/** The math of a statement, where the points and segments are named. */
const math = (text: string) => [...text.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]).join(' ')

/** The point names written in the formulas of a statement. */
const mentions = (text: string) => new Set(math(text).replace(/\\[a-zA-Z]+/g, ' ').match(/[A-Z]'?/g) ?? [])

/**
 * The segments named in the statement (AC', VM, A'M) and the edges of the planes named in it ((A'BD), (MBC)); a
 * plane that is a face of the solid (the base (ABC) of a cube) adds nothing.
 */
function named(text: string, known: Set<string>, faces: Set<string>[] = []): string[] {
  const t = math(text).replace(/\\[a-zA-Z]+/g, ' ')
  const out: string[] = []
  for (const m of t.matchAll(/\(((?:[A-Z]'?){3,4})\)/g)) {
    const ps = m[1].match(/[A-Z]'?/g)!
    if (faces.some((f) => ps.every((p) => f.has(p)))) continue
    if (ps.every((p) => known.has(p))) ps.forEach((p, i) => out.push(`${p}-${ps[(i + 1) % ps.length]}`))
  }
  for (const m of t.replace(/\(((?:[A-Z]'?){3,4})\)/g, ' ').matchAll(/(?<![A-Za-z'])([A-Z]'?)([A-Z]'?)(?![A-Za-z'])/g)) {
    if (known.has(m[1]) && known.has(m[2]) && m[1] !== m[2]) out.push(`${m[1]}-${m[2]}`)
  }
  return out
}

/** "$M$ (este) mijlocul (lui / laturii / muchiei) $[BC]$" → M: [B, C]. */
function midpoints(text: string): [string, string, string][] {
  const out: [string, string, string][] = []
  const re = new RegExp(`\\$(${NAME})\\$,? (?:este |să fie )?mijlocul (?:lui |laturii |muchiei |segmentului |înălțimii )?\\$\\[?(${NAME})(${NAME})\\]?\\$`, 'g')
  for (const m of text.matchAll(re)) out.push([m[1], m[2], m[3]])
  const re2 = new RegExp(`mijlocul (?:lui |laturii |muchiei |segmentului )?\\$\\[?(${NAME})(${NAME})\\]?\\$,? (?:este |notat cu )?\\$(${NAME})\\$`, 'g')
  for (const m of text.matchAll(re2)) out.push([m[3], m[1], m[2]])
  return out
}

/** "$AD \perp BC$" with D new: D is the foot of the perpendicular from A. */
function feet(text: string): [string, string, string, string][] {
  const out: [string, string, string, string][] = []
  for (const m of text.matchAll(new RegExp(`(${NAME})(${NAME})\\s*\\\\perp\\s*(${NAME})(${NAME})`, 'g'))) out.push([m[1], m[2], m[3], m[4]])
  return out
}

const segKey = (s: string) => s.split('-').sort().join('-')
/** Segments not already drawn: each once. `drawn` are chains; `closed` ones (faces) close back to their start. */
function dedupe(segs: string[], drawn: string[] = [], closed = false): string {
  const seen = new Set(drawn.flatMap((d) => d.split(/\s+/)).filter(Boolean).flatMap((chain) => {
    const ps = chain.split('-')
    const pairs = ps.slice(1).map((p, i) => segKey(`${ps[i]}-${p}`))
    if (closed) pairs.push(segKey(`${ps[ps.length - 1]}-${ps[0]}`))
    return pairs
  }))
  const out: string[] = []
  for (const s of segs) {
    const k = segKey(s)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(s)
  }
  return out.join(' ')
}

// =============== round solids, drawn flat ===============

function roundDims(text: string): { R?: number; H?: number; G?: number; r?: number } {
  const L = lengths(text)
  const R = after(text, /raz(?:a|ei)(?: bazei| mare| cilindrului| conului| sferei)?/) ?? after(text, /\bR\s*=/) ?? (after(text, /diametrul(?: bazei)?/) ?? 0) / 2
  const r = after(text, /raza mică|raza bazei mici/) ?? after(text, /\br\s*=/)
  const H = after(text, /înălțimea|\bh\s*=/) ?? len(L, 'VO', "OO'")
  const G = after(text, /generatoarea|\bG\s*=/)
  return { R: R || undefined, H, G, r }
}

function cone(text: string): Fig {
  let { R, H, G } = roundDims(text)
  if (R && !H && G && G > R) H = Math.sqrt(G * G - R * R)
  if (!R && H && G && G > H) R = Math.sqrt(G * G - H * H)
  const ratio = R && H ? clamp(H / R, 0.8, 3) : 1.6
  const rx = 62, ry = 14, m = 10, h = rx * ratio
  const down = /vârful în jos/.test(text)
  const by = down ? m + ry : m + h, vy = down ? m + ry + h : m
  const p: Pts = { V: [m + rx, vy], O: [m + rx, by], A: [m, by], B: [m + 2 * rx, by] }
  return {
    w: 2 * (m + rx), h: Math.ceil(h + 2 * m + 2 * ry), p, l: { O: 'n', V: down ? 's' : 'n' },
    e: [{ at: 'O', rx, ry, back: !down }], s: 'V-A V-B', d: 'A-B V-O', dot: 'O',
  }
}

function cylinder(text: string, sphere = false): Fig {
  const { R, H, G } = roundDims(text)
  const height = H ?? G
  const ratio = sphere ? 2 : R && height ? clamp(height / R, 0.8, 3) : 2
  const rx = 55, ry = 13, m = 10, h = rx * ratio
  const p: Pts = { "O'": [m + rx, m + ry], O: [m + rx, m + ry + h], "A'": [m, m + ry], "B'": [m + 2 * rx, m + ry], A: [m, m + ry + h], B: [m + 2 * rx, m + ry + h] }
  return {
    w: 2 * (m + rx), h: Math.ceil(h + 2 * m + 2 * ry), p, l: { O: 'n', "O'": 'n' },
    e: [{ at: 'O', rx, ry, back: true }, { at: "O'", rx, ry }], s: "A-A' B-B' A'-B'", d: "A-B O-O'", dot: "O O'",
    c: sphere ? [{ at: [m + rx, m + ry + h / 2], r: rx }] : undefined,
  }
}

function sphere(): Fig {
  const r = 60, m = 12
  const p: Pts = { O: [m + r, m + r], A: [m + 2 * r, m + r] }
  return { w: 2 * (m + r), h: 2 * (m + r), p, l: { O: 's', A: 'e' }, c: [{ at: 'O', r }], e: [{ at: 'O', rx: r, ry: 14, back: true }], s: 'O-A', dot: 'O' }
}

function coneFrustum(text: string): Fig {
  const L = lengths(text)
  const d = roundDims(text)
  const R = d.R ?? (len(L, 'AB') ? len(L, 'AB')! / 2 : undefined)
  const r = d.r ?? (len(L, 'CD') ? len(L, 'CD')! / 2 : undefined)
  const H = d.H
  const withApex = /conului din care|conul din care|conul mic|conului mic/.test(text)
  const k = R && r && r < R ? clamp(r / R, 0.3, withApex ? 0.7 : 0.85) : 0.6
  const ratio = R && H ? clamp(H / R, 0.4, 1.8) : 0.8
  const rx = 66, ry = 15, m = 10, h = rx * ratio
  const apexH = h / (1 - k)
  const top = withApex ? m + apexH - h : m + ry
  const base = top + h
  const [c, dd] = /\$CD\$|\$AC\$/.test(text) ? ['C', 'D'] : ["A'", "B'"]
  const p: Pts = {
    O: [m + rx, base], A: [m, base], B: [m + 2 * rx, base], "O'": [m + rx, top], [c]: [m + rx - k * rx, top], [dd]: [m + rx + k * rx, top],
  }
  if (withApex) p.V = [m + rx, m]
  return {
    w: 2 * (m + rx), h: Math.ceil(base + ry + m), p, l: { O: 'n', "O'": 'n' },
    e: [{ at: 'O', rx, ry, back: true }, { at: "O'", rx: k * rx, ry: k * ry }],
    s: `A-${c} B-${dd} ${c}-${dd}`, d: `A-B O-O'${withApex ? ` ${c}-V-${dd} O'-V` : ''}`, dot: "O O'",
  }
}

// =============== solids with flat faces ===============

interface Body { p: Record<string, P3>; faces: string; base: string[] }

const hexAt = (l: number, z: number, names: string[]): Record<string, P3> =>
  Object.fromEntries(names.map((n, i) => [n, [l * Math.cos(((240 + 60 * i) * Math.PI) / 180), l * Math.sin(((240 + 60 * i) * Math.PI) / 180) + l, z] as P3]))
const HEX = ['A', 'B', 'C', 'D', 'E', 'F']
const HEX1 = HEX.map((n) => n + "'")
const ring = (a: string[]) => a.join('-')
const sides = (a: string[], b: string[]) => a.map((n, i) => `${n}-${a[(i + 1) % a.length]}-${b[(i + 1) % a.length]}-${b[i]}`).join(' ')
const fan = (a: string[], v: string) => a.map((n, i) => `${n}-${a[(i + 1) % a.length]}-${v}`).join(' ')

function bodyFor(text: string): Body | undefined {
  const L = lengths(text)
  const side = len(L, 'AB') ?? after(text, /latura bazei|muchia bazei|latura de|muchia de|muchia/)
  const height = after(text, /înălțimea(?: prismei| piramidei)?/) ?? len(L, "AA'", "BB'", "CC'", "DD'", 'VO')

  if (/trunchi(?:ul)? de piramidă/.test(text)) {
    const kind = /hexagonal/.test(text) ? 6 : /triunghiular/.test(text) ? 3 : 4
    const big = side ?? 10
    const small = len(L, "A'B'") ?? after(text, /baza mică|bazei mici/)
    const k = small && small < big ? clamp(small / big, 0.3, 0.8) : 0.55
    const h = clamp((height ?? big * 0.6) / big, 0.35, 1.2) * big
    if (kind === 4) {
      const b = box(big, big, 0)
      const top = Object.fromEntries(['A', 'B', 'C', 'D'].map((n) => [n + "'", [big / 2 + (b[n][0] - big / 2) * k, big / 2 + (b[n][1] - big / 2) * k, h] as P3]))
      return { p: { ...pick4(b), ...top }, faces: BOX, base: ['A', 'B', 'C', 'D'] }
    }
    if (kind === 3) {
      const b = prism3(big, 0)
      const cx = big / 2, cy = (big * Math.sqrt(3)) / 3
      const top = Object.fromEntries(['A', 'B', 'C'].map((n) => [n + "'", [cx + (b[n][0] - cx) * k, cy + (b[n][1] - cy) * k, h] as P3]))
      return { p: { A: b.A, B: b.B, C: b.C, ...top }, faces: PRISM3, base: ['A', 'B', 'C'] }
    }
    const lo = hexAt(big, 0, HEX)
    const hi = Object.fromEntries(HEX.map((n, i) => [HEX1[i], [lo[n][0] * k, big + (lo[n][1] - big) * k, h] as P3]))
    return { p: { ...lo, ...hi }, faces: `${ring(HEX)} ${ring(HEX1)} ${sides(HEX, HEX1)}`, base: HEX }
  }
  if (/piramid\S* hexagonal|VABCDEF\b/.test(text)) {
    const l = side ?? 10
    const h = clamp((height ?? l * 1.6) / l, 0.8, 2.6) * l
    return { p: { ...hexAt(l, 0, HEX), V: [0, l, h], O: [0, l, 0] }, faces: `${ring(HEX)} ${fan(HEX, 'V')}`, base: HEX }
  }
  if (/prism\S* hexagonal|ABCDEFA'B'C'D'E'F'/.test(text)) {
    const l = side ?? 10
    const h = clamp((height ?? l * 1.8) / l, 0.6, 3) * l
    return { p: { ...hexAt(l, 0, HEX), ...hexAt(l, h, HEX1), O: [0, l, 0] }, faces: `${ring(HEX)} ${ring(HEX1)} ${sides(HEX, HEX1)}`, base: HEX }
  }
  if (/tetraedr/.test(text)) {
    const names = /VABC/.test(text) ? ['A', 'B', 'C', 'V'] : ['A', 'B', 'C', 'D']
    const t = tetra(10, names)
    const [a, b, c, v] = names
    return { p: { ...t, O: [5, 10 / Math.sqrt(3), 0] }, faces: TETRA(a, b, c, v), base: [a, b, c] }
  }
  if (/piramid\S* triunghiular|\$VABC\$/.test(text)) {
    const l = side ?? 10
    const h = clamp((height ?? l * 0.8) / l, 0.4, 1.8) * l
    const y = (l * Math.sqrt(3)) / 2
    return { p: { A: [0, y, 0], B: [l / 2, 0, 0], C: [l, y, 0], V: [l / 2, (2 * y) / 3, h], O: [l / 2, (2 * y) / 3, 0] }, faces: 'A-B-C A-B-V B-C-V C-A-V', base: ['A', 'B', 'C'] }
  }
  if (/piramid|\$VABCD\$/.test(text)) {
    const l = side ?? 10
    return { p: pyr4(l, clamp((height ?? l * 0.9) / l, 0.45, 1.8) * l), faces: PYR4, base: ['A', 'B', 'C', 'D'] }
  }
  if (/prism\S* triunghiular|ABCA'B'C'/.test(text)) {
    const l = side ?? 10
    const h = clamp((height ?? l * 1.2) / l, 0.5, 2.5) * l
    const p = prism3(l, h)
    return { p: { ...p, O: [l / 2, (l * Math.sqrt(3)) / 3, 0] }, faces: PRISM3, base: ['A', 'B', 'C'] }
  }
  if (/\bcub(?:ul|ului)?\b/.test(text) && !/paralelipiped/.test(text.split(/\bcub/)[0])) {
    return withCentre(box(10, 10, 10))
  }
  if (/prism\S* patrulater|paralelipiped|ABCDA'B'C'D'/.test(text)) {
    const regular = /prism\S* patrulater\S* regulat/.test(text)
    const dims = text.match(/dimensiunile (?:de )?\$?(\d+)\$? ?(?:cm|m|dm)?, \$?(\d+)\$? ?(?:cm|m|dm)? și \$?(\d+)/)
    let a = len(L, 'AB') ?? (dims ? Number(dims[1]) : undefined) ?? after(text, /lungimea|\bL\s*=/) ?? side
    let b = regular ? a : len(L, 'BC', 'AD') ?? (dims ? Number(dims[2]) : undefined) ?? after(text, /lățimea|\\ell\s*=/)
    let c = len(L, "AA'", "BB'", "CC'", "DD'") ?? (dims ? Number(dims[3]) : undefined) ?? height ?? after(text, /adâncimea/)
    a = a ?? 10
    b = b ?? (regular ? a : a * 0.7)
    c = c ?? (regular ? a * 1.6 : a * 0.6)
    const mx = Math.max(a, b, c)
    return withCentre(box(clamp(a / mx, 0.3, 1) * 10, clamp(b / mx, 0.3, 1) * 10, clamp(c / mx, 0.25, 1) * 10))
  }
  return undefined
}
const pick4 = (b: Record<string, P3>) => ({ A: b.A, B: b.B, C: b.C, D: b.D })
const withCentre = (b: Record<string, P3>): Body => ({ p: { ...b, O: mid3(b.A, b.C) }, faces: BOX, base: ['A', 'B', 'C', 'D'] })

function solidFigure(text: string, body: Body): Fig {
  const p = { ...body.p }
  // the centre of the base only when the statement uses it
  if (!mentions(text).has('O')) delete p.O
  for (const [m, a, b] of midpoints(text)) if (p[a] && p[b] && !p[m]) p[m] = mid3(p[a], p[b])
  for (const [a, f, b, c] of feet(text)) if (p[a] && p[b] && p[c] && !p[f]) p[f] = foot3(p[a], p[b], p[c])
  const vertices = new Set(body.faces.split(/[\s-]+/))
  const faces = body.faces.split(/\s+/).map((f) => new Set(f.split('-')))
  const segs = named(text, new Set(Object.keys(p)), faces)
  // the centre of a quadrilateral base, where the diagonals meet
  if (p.O && body.base.length === 4 && /centrul|∩|\\cap|intersecția diagonalelor/.test(text)) segs.push('A-C', 'B-D')
  if (p.O && p.V) segs.push('V-O')
  const labels: Record<string, '' | 's' | 'e'> = {}
  for (const n of Object.keys(p)) if (!vertices.has(n)) labels[n] = n === 'O' ? 's' : 'e'
  const opt = { seg: dedupe(segs, [body.faces], true) || undefined, l: labels }
  const fig = solid(p, body.faces, body.base.length === 6 ? 190 : 170, opt)
  // a tall solid is drawn narrower, so that it stays about 190 px high
  return fig.h > 190 ? solid(p, body.faces, Math.max(80, Math.round((fig.w * 190) / fig.h)), opt) : fig
}

// =============== plane figures ===============

interface Flat { p: Pts; s: string; ra?: string[] }

function triangle(text: string, L: Lens): Flat {
  const right = text.match(/dreptunghic(?:ă|e)? în (?:vârful )?\$?([A-Z])\$?/)
  if (right || /\\angle A = 90\^\\circ|m\(\\angle A\) = 90/.test(text)) {
    const a = right ? right[1] : 'A'
    const [b, c] = ['A', 'B', 'C'].filter((x) => x !== a)
    let lb = len(L, a + b), lc = len(L, a + c)
    const hyp = len(L, b + c)
    if (hyp && lb && !lc && hyp > lb) lc = Math.sqrt(hyp * hyp - lb * lb)
    if (hyp && lc && !lb && hyp > lc) lb = Math.sqrt(hyp * hyp - lc * lc)
    const bd = len(L, 'BD'), dc = len(L, 'DC', 'CD')
    if (!lb && !lc && bd && dc) {
      lb = Math.sqrt(bd * (bd + dc))
      lc = Math.sqrt(dc * (bd + dc))
    }
    lb = lb ?? 3
    lc = lc ?? 4
    const r = clamp(lb / lc, 0.5, 2)
    lb = r * 4
    lc = 4
    const h = Math.hypot(lb, lc)
    // the hypotenuse lies flat, the right angle on top, as in the book
    const P: Pt = [(lb * lb) / h, (lb * lc) / h]
    return { p: { [b]: [0, 0], [c]: [h, 0], [a]: P }, s: `${a}-${b}-${c}-${a}`, ra: [`${b}${a}${c}`] }
  }
  if (/echilateral/.test(text)) return { p: { A: [2, 2 * Math.sqrt(3)], B: [0, 0], C: [4, 0] }, s: 'A-B-C-A' }
  const iso = /isoscel/.test(text)
  const ab = len(L, 'AB'), ac = len(L, 'AC'), bc = len(L, 'BC')
  if (iso) {
    const leg = ab ?? ac ?? 5, base = bc ?? 6
    const r = clamp(base / leg, 0.4, 1.9)
    const h = Math.sqrt(Math.max(0.2, 1 - (r * r) / 4)) * 4
    return { p: { A: [2 * r, h], B: [0, 0], C: [4 * r, 0] }, s: 'A-B-C-A' }
  }
  if (ab && ac && bc && ab + ac > bc && ab + bc > ac && ac + bc > ab) {
    const x = (ab * ab - ac * ac + bc * bc) / (2 * bc)
    return { p: { B: [0, 0], C: [bc, 0], A: [x, Math.sqrt(Math.max(0, ab * ab - x * x))] }, s: 'A-B-C-A' }
  }
  return { p: { A: [1.7, 3.1], B: [0, 0], C: [5, 0] }, s: 'A-B-C-A' }
}

function quad(text: string, L: Lens): Flat | undefined {
  if (/[Pp]ătrat/.test(text)) return { p: { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4] }, s: 'A-B-C-D-A' }
  if (/[Dd]reptunghi(?!c)/.test(text)) {
    let a = len(L, 'AB', 'DC') ?? after(text, /lungimea/)
    let b = len(L, 'BC', 'AD') ?? after(text, /lățimea/)
    const d = len(L, 'AC', 'BD')
    if (a && d && !b && d > a) b = Math.sqrt(d * d - a * a)
    if (b && d && !a && d > b) a = Math.sqrt(d * d - b * b)
    const r = a && b ? clamp(b / a, 0.3, 1.6) : 0.6
    return { p: { A: [0, 0], B: [5, 0], C: [5, 5 * r], D: [0, 5 * r] }, s: 'A-B-C-D-A' }
  }
  if (/[Rr]omb/.test(text)) {
    const ac = len(L, 'AC'), bd = len(L, 'BD'), side = len(L, 'AB')
    let p = ac ? ac / 2 : undefined, q = bd ? bd / 2 : undefined
    if (side && p && !q && side > p) q = Math.sqrt(side * side - p * p)
    if (side && q && !p && side > q) p = Math.sqrt(side * side - q * q)
    const r = p && q ? clamp(q / p, 0.35, 1.5) : 0.6
    return { p: { A: [-3, 0], B: [0, -3 * r], C: [3, 0], D: [0, 3 * r] }, s: 'A-B-C-D-A' }
  }
  if (/[Pp]aralelogram/.test(text)) {
    const ang = Number(text.match(/\\angle A = (\d+)/)?.[1] ?? 60)
    const a = len(L, 'AB') ?? 6, b = len(L, 'AD', 'BC') ?? 4
    const r = clamp(b / a, 0.35, 1.4) * 5
    const D: Pt = [r * Math.cos((ang * Math.PI) / 180), r * Math.sin((ang * Math.PI) / 180)]
    return { p: { A: [0, 0], B: [5, 0], C: [5 + D[0], D[1]], D }, s: 'A-B-C-D-A' }
  }
  if (/[Tt]rapez/.test(text)) {
    let big = len(L, 'AB'), small = len(L, 'CD', 'DC')
    const bases = text.match(/bazele (?:de )?\$?(\d+)\$? ?cm și \$?(\d+)/)
    if (bases) [big, small] = [Math.max(+bases[1], +bases[2]), Math.min(+bases[1], +bases[2])]
    if (big && small && small > big) [big, small] = [small, big]
    const k = big && small ? clamp(small / big, 0.25, 0.85) : 0.55
    const hh = after(text, /înălțimea/)
    const h = big && hh ? clamp(hh / big, 0.25, 0.9) * 6 : 3
    if (/dreptunghic/.test(text)) return { p: { A: [0, 0], B: [6, 0], C: [6 * k, h], D: [0, h] }, s: 'A-B-C-D-A', ra: ['DAB', 'ADC'] }
    const off = (6 - 6 * k) / 2
    return { p: { A: [0, 0], B: [6, 0], C: [off + 6 * k, h], D: [off, h] }, s: 'A-B-C-D-A' }
  }
  return undefined
}

/** The plane figure the statement is about, with the points it defines. */
function flatFor(text: string): Flat | undefined {
  const L = lengths(text)
  const f = quad(text, L) ?? (/[Tt]riunghi/.test(text) ? triangle(text, L) : undefined)
  if (!f) return undefined
  const p = f.p
  const quadShape = 'D' in p
  if (mentions(text).has('O')) {
    if (quadShape) p.O = mid(p.A, p.C)
    else if (/cercului circumscris|cercul circumscris/.test(text)) p.O = circumcentre(p.A, p.B, p.C)
  }
  for (const [m, a, b] of midpoints(text)) if (p[a] && p[b] && !p[m]) p[m] = mid(p[a], p[b])
  for (const [a, d, b, c] of feet(text)) if (p[a] && p[b] && p[c] && !p[d]) p[d] = foot(p[a], p[b], p[c])
  // "înălțimea AD" of a triangle: D on the opposite side
  for (const m of text.matchAll(/înălțimea (?:corespunzătoare )?\$([A-Z])([A-Z])\$/g)) {
    const [a, d] = [m[1], m[2]]
    const others = ['A', 'B', 'C'].filter((x) => x !== a)
    if (p[a] && !p[d] && !quadShape && others.every((x) => p[x])) p[d] = foot(p[a], p[others[0]], p[others[1]])
  }
  // Thales: D ∈ AB and E ∈ AC with DE ∥ BC
  const on = [...text.matchAll(new RegExp(`(${NAME}) \\\\in \\[?(${NAME})(${NAME})\\]?`, 'g'))]
  for (const m of on) {
    const [x, a, b] = [m[1], m[2], m[3]]
    if (p[x] || !p[a] || !p[b]) continue
    const ax = len(L, a + x), ab = len(L, a + b), xb = len(L, x + b)
    const t = ax && ab ? ax / ab : ax && xb ? ax / (ax + xb) : 0.45
    p[x] = [p[a][0] + (p[b][0] - p[a][0]) * clamp(t, 0.15, 0.85), p[a][1] + (p[b][1] - p[a][1]) * clamp(t, 0.15, 0.85)]
  }
  return f
}

function circumcentre(a: Pt, b: Pt, c: Pt): Pt {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]))
  const sq = (q: Pt) => q[0] * q[0] + q[1] * q[1]
  return [(sq(a) * (b[1] - c[1]) + sq(b) * (c[1] - a[1]) + sq(c) * (a[1] - b[1])) / d, (sq(a) * (c[0] - b[0]) + sq(b) * (a[0] - c[0]) + sq(c) * (b[0] - a[0])) / d]
}

function flatFigure(text: string, f: Flat): Fig {
  const known = new Set(Object.keys(f.p))
  const segs = dedupe(named(text, known), [f.s])
  const extra = Object.keys(f.p).filter((n) => !f.s.includes(n))
  const ra = [...(f.ra ?? [])]
  for (const [a, d, b] of feet(text)) if (f.p[a] && f.p[d] && f.p[b]) ra.push(`${a}${d}${b}`)
  const s = [f.s, segs, ...feet(text).filter(([a, d]) => f.p[a] && f.p[d]).map(([a, d]) => `${a}-${d}`)].filter(Boolean).join(' ')
  return plane(f.p, fitWidth(f.p), { s, ra, dot: extra.filter((n) => n === 'O').join(' ') || undefined })
}

/** A width that keeps a plane figure at most about 130 px high and 170 px wide. */
function fitWidth(p: Pts): number {
  const xs = Object.values(p).map((q) => q[0]), ys = Object.values(p).map((q) => q[1])
  const aspect = (Math.max(...ys) - Math.min(...ys) || 1) / (Math.max(...xs) - Math.min(...xs) || 1)
  return Math.round(clamp(130 / aspect, 90, 170))
}

/** "Pe planul pătratului ABCD se ridică perpendiculara AM": the plane figure lying flat, the perpendicular up. */
function raisedFigure(text: string, f: Flat): Fig | undefined {
  const m = text.match(new RegExp(`perpendicular\\w* \\$(${NAME})(${NAME})\\$`)) ?? text.match(/Punctul \$([A-Z])\$, exterior planului/)
  if (!m) return undefined
  const base = { ...f.p }
  if (!base.O && /\$O\$/.test(text)) base.O = 'D' in base ? mid(base.A, base.C) : circumcentre(base.A, base.B, base.C)
  let footName: string, top: string
  if (m.length === 2) [footName, top] = ['O', m[1]]
  else [footName, top] = base[m[1]] && !base[m[2]] ? [m[1], m[2]] : [m[2], m[1]]
  if (!base[footName] || base[top]) return undefined
  const xs = Object.values(base).map((q) => q[0])
  const h = (Math.max(...xs) - Math.min(...xs)) * 0.85
  const p3: Record<string, P3> = Object.fromEntries(Object.entries(base).map(([n, q]) => [n, [q[0], q[1] * 0.9, 0] as P3]))
  p3[top] = [p3[footName][0], p3[footName][1], h]
  const c = 0.354
  const flat: Pts = Object.fromEntries(Object.entries(p3).map(([n, q]) => [n, [q[0] + c * q[1], q[2] + c * q[1]] as Pt]))
  const known = new Set(Object.keys(flat))
  const segs = dedupe([`${footName}-${top}`, ...named(text, known)], [f.s])
  return plane(flat, 170, { s: `${f.s} ${segs}`, dot: base.O ? 'O' : undefined, l: { [top]: 'n' } })
}

/** The figure of a statement, or nothing when it is not understood (or needs none). */
export function figureFor(text: string): Fig | undefined {
  try {
    return drawFigure(text)
  } catch {
    return undefined
  }
}

/** The same, failing loudly: for the tests. */
export function drawFigure(text: string): Fig | undefined {
  {
    if (/planul \$\\alpha\$|îndoaie|în total \d+ muchii|reperul cartezian|vectori|Două drepte|Un unghi are|direct proporționale cu numerele 1, 2, 3/.test(text)) return undefined
    if (/trunchi(?:ul)? de con/.test(text)) return coneFrustum(text)
    if (/\bsfer/.test(text) && !/trunchi/.test(text)) return /cilindru/.test(text) ? cylinder(text, true) : sphere()
    const hasCone = /\bcon(?:ul|ului)?\b/.test(text), hasCyl = /cilindr/.test(text)
    if (hasCone && hasCyl) return undefined
    if (hasCone) return cone(text)
    if (hasCyl) return cylinder(text)
    const body = bodyFor(text)
    if (body) return solidFigure(text, body)
    const f = flatFor(text)
    if (!f) return undefined
    if (/se ridică|exterior planului/.test(text)) return raisedFigure(text, f)
    return flatFigure(text, f)
  }
}
