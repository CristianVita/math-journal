// Bodies made of several (asked for on 11 November 2026): glued to a face of another, or put inside it.
import { describe, expect, it } from 'vitest'
import type { GObj, PathObj, PointObj } from '../geometry/types'
import { addInside, glueSolid, removeSolidPart, setSolidView, solidObjects, type SolidId } from './solids'

const make = (id: SolidId, x0: number, group: string, objects: GObj[] = []) => solidObjects(id, x0, 0, x0 + 4, 4, objects, { color: '#000', group })
const holderOf = (objs: GObj[], group: string) => objs.find((o): o is PathObj => o.type === 'path' && !!o.frame && o.group === group)!
const points = (objs: GObj[], group: string) => objs.filter((o): o is PointObj => o.type === 'point' && o.group === group)
const edges = (objs: GObj[], group: string) => objs.filter((o): o is PathObj => o.type === 'path' && !o.frame && o.group === group)
const mean = (ps: PointObj[]) => ({ x: ps.reduce((s, p) => s + p.x, 0) / ps.length, y: ps.reduce((s, p) => s + p.y, 0) / ps.length })

/** Moves the body `group` so that the middle of the points `from` lands on the middle of the points `to`. */
function moveOnto(objs: GObj[], group: string, from: PointObj[], to: PointObj[]): GObj[] {
  const [a, b] = [mean(from), mean(to)]
  const [dx, dy] = [b.x - a.x, b.y - a.y]
  return objs.map((o) => {
    if (o.type === 'path' && o.group === group) return { ...o, points: o.points.map(([x, y]) => [x + dx, y + dy] as [number, number]) }
    if (o.type === 'point' && o.group === group) return { ...o, x: o.x + dx, y: o.y + dy }
    return o
  })
}

describe('a body glued on another', () => {
  it('a pyramid dropped on the top of a cube becomes one body with it, with V above', () => {
    const cube = make('cube', 0, 'c')
    const pyr = make('pyramid4', 10, 'p', cube)
    let all = [...cube, ...pyr]
    const top = points(all, 'c').filter((p) => p.label.endsWith('′'))
    const base = points(all, 'p').filter((p) => /^[A-Z]\d?$/.test(p.label) && p.label !== 'V' && p.label !== 'O')
    all = moveOnto(all, 'p', base, top)
    const glued = glueSolid(all, holderOf(all, 'c').id, holderOf(all, 'p').id)
    expect(glued).not.toBeNull()
    const now = glued!.objects
    // the pyramid's own frame and edges are gone; its corners are on the cube now
    expect(now.some((o) => o.type === 'path' && o.group === 'p')).toBe(false)
    // 12 edges of the cube and 4 lateral edges of the pyramid: the square they share is drawn once
    expect(edges(now, 'c')).toHaveLength(16)
    const labels = points(now, 'c').filter((p) => !p.hidden).map((p) => p.label)
    expect(labels.filter((l) => l === 'V' || l.startsWith('V'))).toHaveLength(1)
    // the corners of the pyramid's base became those of the cube's top: no doubles
    expect(new Set(points(now, 'c').filter((p) => !p.hidden).map((p) => p.at3!.map((c) => c.toFixed(6)).join())).size).toBe(points(now, 'c').filter((p) => !p.hidden).length)
    // turned in space, it stays one body
    const turned = setSolidView(now, holderOf(now, 'c').id, 50, -30)
    expect(edges(turned, 'c')).toHaveLength(16)
  })

  it('a cone dropped on the top of a cylinder shares its circle', () => {
    const cyl = make('cylinder', 0, 'c')
    const cone = make('cone', 10, 'k', cyl)
    let all = [...cyl, ...cone]
    const top = points(all, 'c').filter((p) => p.label.endsWith('′') && !p.hidden)
    const base = points(all, 'k').filter((p) => ['A', 'B', 'C', 'D', 'E', 'F'].some((l) => p.label.startsWith(l)) && !p.hidden)
    all = moveOnto(all, 'k', base, top)
    const glued = glueSolid(all, holderOf(all, 'c').id, holderOf(all, 'k').id)
    expect(glued).not.toBeNull()
    expect(points(glued!.objects, 'c').filter((p) => p.label === 'V')).toHaveLength(1)
  })

  it('is not glued when dropped far away, or on a face of another shape', () => {
    const cube = make('cube', 0, 'c')
    const prism = make('prism3', 30, 't', cube)
    const all = [...cube, ...prism]
    expect(glueSolid(all, holderOf(all, 'c').id, holderOf(all, 't').id)).toBeNull()
  })

  it('a part can be taken away again', () => {
    const cube = make('cube', 0, 'c')
    const pyr = make('pyramid4', 10, 'p', cube)
    let all = [...cube, ...pyr]
    all = moveOnto(all, 'p', points(all, 'p').filter((p) => p.label !== 'V' && p.label !== 'O'), points(all, 'c').filter((p) => p.label.endsWith('′')))
    const glued = glueSolid(all, holderOf(all, 'c').id, holderOf(all, 'p').id)!.objects
    const back = removeSolidPart(glued, holderOf(glued, 'c').id, 0)
    expect(edges(back, 'c')).toHaveLength(12)
    expect(points(back, 'c').some((p) => p.label === 'V')).toBe(false)
  })
})

describe('a body inside another', () => {
  it('the sphere inscribed in a cube touches its faces, and turns with it', () => {
    const cube = make('cube', 0, 'c')
    const out = addInside(cube, holderOf(cube, 'c').id, 'inSphere')
    expect(typeof out).not.toBe('string')
    const now = out as GObj[]
    const frame = holderOf(now, 'c').frame!
    expect(frame.parts).toHaveLength(1)
    expect(frame.parts![0].w).toBeCloseTo(frame.w, 9)
    expect(setSolidView(now, holderOf(now, 'c').id, 40, 10).length).toBeGreaterThan(0)
  })

  it('the sphere circumscribed to a regular pyramid goes through the apex and the base', () => {
    const pyr = make('pyramid4', 0, 'p')
    const now = addInside(pyr, holderOf(pyr, 'p').id, 'outSphere') as GObj[]
    const frame = holderOf(now, 'p').frame!
    const part = frame.parts![0]
    const r = part.w / 2
    const [w, h] = [frame.w, frame.h]
    // apex at (0, h/2, 0); a base corner at (w/2, −h/2, w/2)
    expect(Math.hypot(0, h / 2 - part.at[1], 0)).toBeCloseTo(r, 9)
    expect(Math.hypot(w / 2, -h / 2 - part.at[1], w / 2)).toBeCloseTo(r, 9)
  })

  it('says why a sphere does not fit', () => {
    const cyl = solidObjects('cylinder', 0, 0, 4, 9, [], { color: '#000', group: 'c' })
    expect(typeof addInside(cyl, holderOf(cyl, 'c').id, 'inSphere')).toBe('string')
  })
})
