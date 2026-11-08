// Every solid, one by one: its shape, its hidden edges, its real measures, and the lines that only seem to cross.
// When one of these fails, its name says which solid and which property broke.
import { describe, expect, it } from 'vitest'
import { hiddenOnSolid, resolve, solidGaps, trueAngleAt, trueLength } from '../geometry/engine'
import { emptyScene, type GObj, type LineObj, type PathObj, type PointObj } from '../geometry/types'
import { defaultView, setSolidView, SOLIDS, solidObjects, solidPoints, solidStrokes, type SolidId } from './solids'

const view = emptyScene().view
const ALL = SOLIDS.map((s) => s.id)
const ROUND: SolidId[] = ['cylinder', 'cone', 'sphere']
const FLAT = ALL.filter((id) => !ROUND.includes(id))
const PYRAMIDS: SolidId[] = ['tetrahedron', 'pyramid3', 'pyramid4', 'pyramid6']

const board = (id: SolidId) => solidObjects(id, 0, 0, 6, 6, [], { color: '#000', group: 'g' })
const sheet = (id: SolidId) => solidPoints(id, 0, 0, 6, 6, [], { color: '#000', group: 'g', locked: true })
const holderOf = (objects: GObj[]) => objects.find((o): o is PathObj => o.type === 'path' && !!o.frame)!
const edgesOf = (objects: GObj[]) => objects.filter((o): o is PathObj => o.type === 'path' && !o.frame)
const cornersOf = (objects: GObj[]) => objects.filter((o): o is PointObj => o.type === 'point' && !o.hidden)
const idOf = (objects: GObj[], label: string) => {
  const p = objects.find((o): o is PointObj => o.type === 'point' && o.label === label)
  if (!p) throw new Error('no corner ' + label)
  return p.id
}
const segment = (objects: GObj[], a: string, b: string): LineObj =>
  ({ id: a + b, type: 'segment', dep: { kind: 'twoPoints', a: idOf(objects, a), b: idOf(objects, b) }, color: '#000', width: 1 })
const turn = (objects: GObj[], yaw: number, pitch: number) => setSolidView(objects, holderOf(objects).id, yaw, pitch)
const lengthOf = (objects: GObj[], a: string, b: string) =>
  trueLength(objects, resolve({ objects, view }), idOf(objects, a), idOf(objects, b))!
const angleAt = (objects: GObj[], a: string, v: string, b: string) =>
  (trueAngleAt(objects, resolve({ objects, view }), idOf(objects, a), idOf(objects, v), idOf(objects, b))! * 180) / Math.PI
const pairs = <T,>(xs: T[]) => xs.flatMap((a, i) => xs.slice(i + 1).map((b) => [a, b] as const))

const VIEWS: [number, number][] = [[-20, 30], [0, 0], [45, -35], [130, 70], [-160, -80], [77, 12]]

/** Edges of each body with flat faces, by Euler: corners − edges + faces = 2. */
const EDGES: Partial<Record<SolidId, number>> = {
  cube: 12, cuboid: 12, prism3: 9, prism4: 12, prism6: 18, tetrahedron: 6, pyramid3: 6, pyramid4: 8, pyramid6: 12,
}
/** Hidden edges as first drawn: the corner at the back and its edges, or the back of the base. */
const HIDDEN: Record<SolidId, number> = {
  cube: 3, cuboid: 3, prism3: 3, prism4: 3, prism6: 5, tetrahedron: 3, pyramid3: 3, pyramid4: 3, pyramid6: 5,
  cylinder: 1, cone: 1, sphere: 1,
}
const BASE: Record<SolidId, string[]> = {
  cube: ['A', 'B', 'C', 'D'], cuboid: ['A', 'B', 'C', 'D'], prism3: ['A', 'B', 'C'], prism4: ['A', 'B', 'C', 'D'],
  prism6: ['A', 'B', 'C', 'D', 'E', 'F'], tetrahedron: ['A', 'B', 'C'], pyramid3: ['A', 'B', 'C'],
  pyramid4: ['A', 'B', 'C', 'D'], pyramid6: ['A', 'B', 'C', 'D', 'E', 'F'], cylinder: [], cone: [], sphere: [],
}

describe('shape', () => {
  it.each(FLAT)('%s has as many edges as Euler says, on the board and in the notebook', (id) => {
    expect(edgesOf(board(id))).toHaveLength(EDGES[id]!)
    const joins = cornersOf(sheet(id)).reduce((n, p) => n + (p.joins?.length ?? 0), 0)
    expect(joins / 2).toBe(EDGES[id])
  })

  it.each(ALL)('%s has the same corners in the notebook as on the board', (id) => {
    const a = cornersOf(board(id))
    const b = cornersOf(sheet(id))
    expect(b.map((p) => p.label)).toEqual(a.map((p) => p.label))
    a.forEach((p, i) => {
      expect(b[i].x).toBeCloseTo(p.x, 9)
      expect(b[i].y).toBeCloseTo(p.y, 9)
      expect(b[i].depth).toBeCloseTo(p.depth!, 9)
    })
  })

  it.each(ALL)('%s is drawn in the notebook as ink', (id) => {
    expect(solidStrokes(id, 0, 0, 240, 240).length).toBeGreaterThan(0)
  })

  it.each(ALL)('%s comes back to where it was when turned back to its first view', (id) => {
    const first = board(id)
    const back = turn(turn(first, 77, -40), ...defaultView(id))
    cornersOf(first).forEach((p, i) => {
      expect(cornersOf(back)[i].x).toBeCloseTo(p.x, 9)
      expect(cornersOf(back)[i].y).toBeCloseTo(p.y, 9)
    })
  })
})

describe('hidden edges as first drawn', () => {
  it.each(ALL)('%s', (id) => {
    expect(edgesOf(board(id)).filter((e) => e.dashed)).toHaveLength(HIDDEN[id])
  })

  it.each(FLAT)('%s keeps its number of edges whichever way it turns', (id) => {
    for (const [yaw, pitch] of VIEWS) expect(edgesOf(turn(board(id), yaw, pitch))).toHaveLength(EDGES[id]!)
  })

  // the request of 8 November 2026: the base of these two was seen from too high
  it.each(['tetrahedron', 'pyramid3'] as SolidId[])('the base of %s is seen flattened', (id) => {
    const base = cornersOf(board(id)).filter((p) => BASE[id].includes(p.label))
    const xs = base.map((p) => p.x)
    const ys = base.map((p) => p.y)
    expect((Math.max(...ys) - Math.min(...ys)) / (Math.max(...xs) - Math.min(...xs))).toBeLessThan(0.35)
  })

  it.each(PYRAMIDS)('the apex of %s is above its base, and its foot O inside it', (id) => {
    const objects = board(id)
    const v = cornersOf(objects).find((p) => p.label === 'V')!
    const o = cornersOf(objects).find((p) => p.label === 'O')!
    const base = cornersOf(objects).filter((p) => BASE[id].includes(p.label))
    expect(v.y).toBeGreaterThan(Math.max(...base.map((p) => p.y)))
    expect(o.x).toBeGreaterThan(Math.min(...base.map((p) => p.x)))
    expect(o.x).toBeLessThan(Math.max(...base.map((p) => p.x)))
  })
})

describe('real measures', () => {
  it.each(ALL)('the distances between the corners of %s do not change when it turns', (id) => {
    const first = board(id)
    const labels = cornersOf(first).map((p) => p.label)
    const before = pairs(labels).map(([a, b]) => lengthOf(first, a, b))
    for (const [yaw, pitch] of VIEWS) {
      const turned = turn(first, yaw, pitch)
      pairs(labels).forEach(([a, b], i) => expect(lengthOf(turned, a, b), `${a}${b} at ${yaw}°, ${pitch}°`).toBeCloseTo(before[i], 6))
    }
  })

  it.each(FLAT)('the base of %s is a regular polygon, or a rectangle', (id) => {
    const objects = board(id)
    const base = BASE[id]
    const sides = base.map((a, i) => lengthOf(objects, a, base[(i + 1) % base.length]))
    if (id === 'cuboid') {
      expect(sides[0]).toBeCloseTo(sides[2], 9)
      expect(sides[1]).toBeCloseTo(sides[3], 9)
    } else for (const s of sides) expect(s).toBeCloseTo(sides[0], 9)
    // the corners of a regular polygon: (n − 2)·180° / n
    const n = base.length
    for (let i = 0; i < n; i++) {
      expect(angleAt(objects, base[(i + n - 1) % n], base[i], base[(i + 1) % n])).toBeCloseTo(((n - 2) * 180) / n, 6)
    }
  })

  it.each(PYRAMIDS)('the lateral edges of %s are equal and its height stands at 90° on the base', (id) => {
    const objects = board(id)
    const lateral = BASE[id].map((a) => lengthOf(objects, 'V', a))
    for (const l of lateral) expect(l).toBeCloseTo(lateral[0], 9)
    for (const a of BASE[id]) expect(angleAt(objects, 'V', 'O', a)).toBeCloseTo(90, 6)
  })

  it('every edge of the regular tetrahedron has the same length', () => {
    const objects = board('tetrahedron')
    const all = pairs(['A', 'B', 'C', 'V']).map(([a, b]) => lengthOf(objects, a, b))
    for (const l of all) expect(l).toBeCloseTo(all[0], 9)
  })

  it.each(['cube', 'cuboid', 'prism3', 'prism4', 'prism6'] as SolidId[])('the lateral edges of %s are equal and stand at 90° on the base', (id) => {
    const objects = board(id)
    const lateral = BASE[id].map((a) => lengthOf(objects, a, a + '′'))
    for (const l of lateral) expect(l).toBeCloseTo(lateral[0], 9)
    const [a, b] = BASE[id]
    expect(angleAt(objects, b, a, a + '′')).toBeCloseTo(90, 6)
  })

  it('the cube has all its edges equal', () => {
    const objects = board('cube')
    expect(lengthOf(objects, 'A', 'A′')).toBeCloseTo(lengthOf(objects, 'A', 'B'), 9)
  })

  it('the radii of the cylinder are equal, above and below, and its axis stands at 90°', () => {
    const objects = board('cylinder')
    const r = lengthOf(objects, 'O', 'A')
    expect(lengthOf(objects, 'O', 'B')).toBeCloseTo(r, 9)
    expect(lengthOf(objects, 'O′', 'A′')).toBeCloseTo(r, 9)
    expect(angleAt(objects, 'A', 'O', 'O′')).toBeCloseTo(90, 6)
  })

  it('the generators of the cone are equal and its height stands at 90°', () => {
    const objects = board('cone')
    expect(lengthOf(objects, 'V', 'A')).toBeCloseTo(lengthOf(objects, 'V', 'B'), 9)
    expect(angleAt(objects, 'A', 'O', 'V')).toBeCloseTo(90, 6)
  })

  it('A and B are at the ends of a diameter of the sphere', () => {
    const objects = board('sphere')
    expect(lengthOf(objects, 'O', 'A')).toBeCloseTo(lengthOf(objects, 'O', 'B'), 9)
    expect(lengthOf(objects, 'A', 'B')).toBeCloseTo(2 * lengthOf(objects, 'O', 'A'), 9)
  })
})

describe('lines that only seem to cross', () => {
  /** Every segment between two corners of the body that is not an edge: diagonals, radii, heights. */
  const inside = (objects: GObj[]) => {
    const corners = cornersOf(objects)
    return pairs(corners).filter(([a, b]) => !a.joins?.includes(b.corner!)).map(([a, b]) => segment(objects, a.label, b.label))
  }
  const gapsOf = (objects: GObj[]) => solidGaps({ objects, view }, resolve({ objects, view }), 0.05)

  // the complaint of 8 November 2026: in the notebook, the radii of the hexagonal pyramid's base seemed to meet its lateral edges
  it.each(['board', 'notebook'])('the radii of the hexagonal pyramid are broken behind the lateral edges, on the %s', (where) => {
    const body = where === 'board' ? board('pyramid6') : sheet('pyramid6')
    const objects = [...body, segment(body, 'F', 'C'), segment(body, 'O', 'D'), segment(body, 'F', 'D')]
    const gaps = gapsOf(objects)
    for (const name of ['FC', 'OD', 'FD']) expect(gaps.get(name)?.length, name).toBeGreaterThan(0)
  })

  it.each(FLAT)('the segments inside %s are broken at the same spots in the notebook as on the board', (id) => {
    const onBoard = board(id)
    const onSheet = sheet(id)
    const a = gapsOf([...onBoard, ...inside(onBoard)])
    const b = gapsOf([...onSheet, ...inside(onSheet)])
    for (const s of inside(onBoard)) {
      const sort = (g?: [number, number][]) => [...(g ?? [])].sort((x, y) => x[0] - y[0]).map(([f]) => Math.round(f * 1e6) / 1e6)
      expect(sort(b.get(s.id)), s.id).toEqual(sort(a.get(s.id)))
    }
  })

  it.each(FLAT)('an edge drawn as ink in the notebook is never broken, and %s has no stray gaps', (id) => {
    const onSheet = sheet(id)
    const gaps = gapsOf([...onSheet, ...inside(onSheet)])
    for (const key of gaps.keys()) expect(key.startsWith('edge:'), key).toBe(false)
  })

  // a hidden edge may pass behind a visible one and be broken there, but nothing is in front of a visible edge
  it.each(ALL)('no visible edge of %s is ever broken, whichever way it turns', (id) => {
    for (const [yaw, pitch] of [defaultView(id), ...VIEWS]) {
      const objects = turn(board(id), yaw, pitch)
      const gaps = gapsOf(objects)
      for (const e of edgesOf(objects).filter((x) => !x.dashed)) expect(gaps.has(e.id), `at ${yaw}°, ${pitch}°`).toBe(false)
    }
  })

  it.each(['cube', 'prism4', 'pyramid4'] as SolidId[])('the diagonals of the base of %s meet for real and stay whole where they cross', (id) => {
    const body = board(id)
    const objects = [...body, segment(body, 'A', 'C'), segment(body, 'B', 'D')]
    const r = resolve({ objects, view })
    const gaps = solidGaps({ objects, view }, r, 0.05)
    for (const name of ['AC', 'BD']) {
      const l = r.lines.get(name)!
      const half = Math.hypot(l.b.x - l.a.x, l.b.y - l.a.y) / 2
      for (const [from, to] of gaps.get(name) ?? []) expect(from > half || to < half, `${name} broken at its middle`).toBe(true)
    }
  })
})

describe('segments on a solid turn dashed where it hides them', () => {
  const hidden = (objects: GObj[], a: string, b: string) => {
    const s = segment(objects, a, b)
    const all = [...objects, s]
    return hiddenOnSolid(all, resolve({ objects: all, view }), s.id)
  }

  it('on a cube seen from above: the base is hidden, the top is seen, a space diagonal is inside', () => {
    const cube = board('cube')
    expect(hidden(cube, 'A', 'C')).toBe(true)
    expect(hidden(cube, 'A′', 'C′')).toBe(false)
    expect(hidden(cube, 'A', 'C′')).toBe(true)
  })

  it('on a cube seen from below, the other way round', () => {
    const cube = turn(board('cube'), -20, -30)
    expect(hidden(cube, 'A', 'C')).toBe(false)
    expect(hidden(cube, 'A′', 'C′')).toBe(true)
    expect(hidden(cube, 'A', 'C′')).toBe(true)
  })

  it('a segment along an edge is seen as the edge is', () => {
    const cube = board('cube')
    const r = resolve({ objects: cube, view })
    for (const [a, b] of [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'A′'], ['C', 'C′'], ['D', 'D′'], ['A′', 'B′']]) {
      const edge = edgesOf(cube).find((e) => {
        const [p, q] = [e.points[0], e.points[e.points.length - 1]]
        const [pa, pb] = [r.points.get(idOf(cube, a))!, r.points.get(idOf(cube, b))!]
        const near = (u: number[], v: { x: number; y: number }) => Math.hypot(u[0] - v.x, u[1] - v.y) < 1e-6
        return (near(p, pa) && near(q, pb)) || (near(p, pb) && near(q, pa))
      })!
      expect(hidden(cube, a, b), a + b).toBe(!!edge.dashed)
    }
  })

  it.each(PYRAMIDS)('the height VO of %s is inside, so hidden', (id) => {
    expect(hidden(board(id), 'V', 'O')).toBe(true)
  })

  it('on a cylinder seen from above: a radius of the base is hidden, one of the top is seen', () => {
    const c = board('cylinder')
    expect(hidden(c, 'O', 'A')).toBe(true)
    expect(hidden(c, 'O′', 'A′')).toBe(false)
    expect(hidden(c, 'O', 'O′')).toBe(true)
  })

  it('a diameter of a sphere is inside it', () => {
    expect(hidden(board('sphere'), 'A', 'B')).toBe(true)
  })

  it('a generator of a cone is left as drawn', () => {
    expect(hidden(board('cone'), 'V', 'A')).toBeNull()
  })

  it('the same answer in the notebook, where the solid is only its corners', () => {
    const s = sheet('cube')
    expect(hidden(s, 'A', 'C')).toBe(true)
    expect(hidden(s, 'A′', 'C′')).toBe(false)
  })
})

describe('an edge rubbed out of the ink in the notebook', () => {
  it('no longer breaks the lines behind it', () => {
    const body = sheet('pyramid6')
    const objects = [...body, segment(body, 'F', 'C'), segment(body, 'O', 'D')]
    const r = resolve({ objects, view })
    expect(solidGaps({ objects, view }, r, 0.05, () => true).size).toBeGreaterThan(0)
    expect(solidGaps({ objects, view }, r, 0.05, () => false).size).toBe(0)
  })
})
