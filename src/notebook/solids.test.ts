// The 3D solids: their corners, their hidden edges, and how they are first seen.
import { describe, expect, it } from 'vitest'
import { resolve } from '../geometry/engine'
import { emptyScene, type GObj, type PathObj, type PointObj } from '../geometry/types'
import { defaultView, setSolidView, SOLIDS, solidObjects, type SolidId } from './solids'

const make = (id: SolidId, objects: GObj[] = [], group = 'g') =>
  [...objects, ...solidObjects(id, 0, 0, 6, 6, objects, { color: '#000', group })]
const holderOf = (objects: GObj[]) => objects.find((o): o is PathObj => o.type === 'path' && !!o.frame)!
const edgesOf = (objects: GObj[]) => objects.filter((o): o is PathObj => o.type === 'path' && !o.frame)
const cornersOf = (objects: GObj[]) => objects.filter((o): o is PointObj => o.type === 'point' && !o.hidden)
const at = (objects: GObj[], label: string) => {
  const p = objects.find((o): o is PointObj => o.type === 'point' && o.label === label)
  if (!p) throw new Error('no corner ' + label)
  return resolve({ objects, view: emptyScene().view }).points.get(p.id)!
}

/** Views that see no face edge-on, all around the solid. */
const VIEWS: [number, number][] = []
for (let yaw = -170; yaw <= 170; yaw += 37) for (const pitch of [-71, -40, -13, 17, 44, 80]) VIEWS.push([yaw, pitch])

const LETTERS: Record<SolidId, string> = {
  cube: 'A B C D A′ B′ C′ D′',
  cuboid: 'A B C D A′ B′ C′ D′',
  prism3: 'A B C A′ B′ C′',
  prism4: 'A B C D A′ B′ C′ D′',
  prism6: 'A B C D E F A′ B′ C′ D′ E′ F′',
  cylinder: 'A B A′ B′ O O′',
  cone: 'A B V O',
  sphere: 'A B O',
  tetrahedron: 'A B C V O',
  pyramid3: 'A B C V O',
  pyramid4: 'A B C D V O',
  pyramid6: 'A B C D E F V O',
}

describe('the corners of a solid', () => {
  it.each(SOLIDS.map((s) => s.id))('%s has its lettered corners', (id) => {
    expect(cornersOf(make(id)).map((p) => p.label).join(' ')).toBe(LETTERS[id])
  })

  it('a second solid takes the next free letters', () => {
    const first = make('cube')
    const both = make('pyramid4', first, 'h')
    const labels = cornersOf(both).filter((p) => p.group === 'h').map((p) => p.label)
    expect(labels).toEqual(['E', 'F', 'G', 'H', 'V', 'O'])
  })

  // the bug of November 2026: the points were put next to the corners, not on them
  const corners = SOLIDS.map((s) => s.id).filter((id) => !['cylinder', 'cone', 'sphere'].includes(id))
  it.each(corners)('the corners of %s lie on the ends of its edges, whichever way it is seen', (id) => {
    let objects = make(id)
    for (const [yaw, pitch] of [defaultView(id), ...VIEWS]) {
      objects = setSolidView(objects, holderOf(objects).id, yaw, pitch)
      const ends = edgesOf(objects).flatMap((e) => [e.points[0], e.points[e.points.length - 1]])
      for (const p of cornersOf(objects).filter((c) => c.joins?.length)) {
        const near = Math.min(...ends.map(([x, y]) => Math.hypot(x - p.x, y - p.y)))
        expect(near, `${id} ${p.label} at ${yaw}°, ${pitch}°`).toBeLessThan(1e-9)
      }
    }
  })
})

describe('hidden edges', () => {
  // a convex body seen from a corner: three faces turn away, and the three edges of the far corner are dashed
  it.each(VIEWS)('a cube seen at %i°, %i° has 3 hidden edges', (yaw, pitch) => {
    const cube = make('cube')
    const turned = setSolidView(cube, holderOf(cube).id, yaw, pitch)
    expect(edgesOf(turned).filter((e) => e.dashed)).toHaveLength(3)
  })

  it('a square pyramid, as first drawn, hides the corner at the back and its 3 edges', () => {
    expect(edgesOf(make('pyramid4')).filter((e) => e.dashed)).toHaveLength(3)
  })

  it('the edges of a solid keep their number when it turns', () => {
    const prism = make('prism6')
    const count = edgesOf(prism).length
    for (const [yaw, pitch] of VIEWS) expect(edgesOf(setSolidView(prism, holderOf(prism).id, yaw, pitch))).toHaveLength(count)
  })
})

describe('the outline of a sphere', () => {
  it.each(VIEWS)('is a circle around its center, seen at %i°, %i°', (yaw, pitch) => {
    const sphere = make('sphere')
    const turned = setSolidView(sphere, holderOf(sphere).id, yaw, pitch)
    const o = at(turned, 'O')
    // the outline is the longest of its lines: the full circle
    const outline = edgesOf(turned).sort((a, b) => b.points.length - a.points.length)[0]
    const radii = outline.points.map(([x, y]) => Math.hypot(x - o.x, y - o.y))
    // drawn as short chords, its points between the corners of the chords sit a little inside: 1 − cos(2.5°) of the radius
    expect((Math.max(...radii) - Math.min(...radii)) / Math.max(...radii)).toBeLessThan(1e-3)
  })
})

describe('how each solid is first seen', () => {
  const corners = SOLIDS.map((s) => s.id).filter((id) => !['cylinder', 'cone', 'sphere'].includes(id))
  // the complaint of November 2026: the back face of a pyramid could hardly be told from the rest.
  // Only bodies with flat faces: on a cylinder or a cone the corners on the circle are, rightly, next to the outline.
  it.each(corners)('no corner of %s falls next to an edge it is not on', (id) => {
    const objects = make(id)
    // the edges are kept as many close points: a straight one is the line from its first point to its last
    const edges = edgesOf(objects).map((e) => e.points).filter((pts) => {
      const [[ax, ay], [bx, by]] = [pts[0], pts[pts.length - 1]]
      const length = Math.hypot(bx - ax, by - ay)
      return pts.every(([x, y]) => Math.abs((x - ax) * (by - ay) - (y - ay) * (bx - ax)) / length < 1e-9)
    }).map((pts) => ({ points: [pts[0], pts[pts.length - 1]] }))
    const all = cornersOf(objects)
    const xs = all.map((p) => p.x)
    const ys = all.map((p) => p.y)
    const size = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))
    let closest = Infinity
    for (const p of all.filter((c) => c.joins?.length)) {
      for (const e of edges) {
        const [[ax, ay], [bx, by]] = e.points
        if (Math.hypot(ax - p.x, ay - p.y) < 1e-9 || Math.hypot(bx - p.x, by - p.y) < 1e-9) continue
        const dx = bx - ax
        const dy = by - ay
        const t = Math.max(0, Math.min(1, ((p.x - ax) * dx + (p.y - ay) * dy) / (dx * dx + dy * dy)))
        closest = Math.min(closest, Math.hypot(ax + t * dx - p.x, ay + t * dy - p.y) / size)
      }
    }
    expect(closest).toBeGreaterThan(0.04)
  })

  it('a diagonal of the cube does not seem to run through a corner it does not reach', () => {
    const cube = make('cube')
    const [a, c2, d] = ['A', 'C′', 'D'].map((l) => at(cube, l))
    const dx = c2.x - a.x
    const dy = c2.y - a.y
    const off = Math.abs((d.x - a.x) * dy - (d.y - a.y) * dx) / Math.hypot(dx, dy)
    expect(off / Math.hypot(dx, dy)).toBeGreaterThan(0.05)
  })
})
