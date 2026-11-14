// The solids that the figures use again and again: their points in space and their faces, for `solid`.
import type { P3, Pt } from '../figure'

export const BOX = "A-B-C-D A'-B'-C'-D' A-B-B'-A' B-C-C'-B' C-D-D'-C' D-A-A'-D'"
/** A rectangular box (or a cube): AB along x, BC into the page, AA′ up. */
export const box = (a: number, b: number, c: number): Record<string, P3> => ({
  A: [0, 0, 0], B: [a, 0, 0], C: [a, b, 0], D: [0, b, 0], "A'": [0, 0, c], "B'": [a, 0, c], "C'": [a, b, c], "D'": [0, b, c],
})

export const PYR4 = 'A-B-C-D A-B-V B-C-V C-D-V D-A-V'
/** A regular quadrilateral pyramid VABCD with the base side l and the height h; O the centre of the base. */
export const pyr4 = (l: number, h: number): Record<string, P3> => ({
  A: [0, 0, 0], B: [l, 0, 0], C: [l, l, 0], D: [0, l, 0], V: [l / 2, l / 2, h], O: [l / 2, l / 2, 0],
})

export const PRISM3 = "A-B-C A'-B'-C' A-B-B'-A' B-C-C'-B' C-A-A'-C'"
/** A regular triangular prism: B in front, A and C at the back, so that no vertex hides behind another. */
export const prism3 = (l: number, h: number): Record<string, P3> => {
  const y = (l * Math.sqrt(3)) / 2
  return { A: [0, y, 0], B: [l / 2, 0, 0], C: [l, y, 0], "A'": [0, y, h], "B'": [l / 2, 0, h], "C'": [l, y, h] }
}

/** A regular tetrahedron as in the book: the base x-y-z with x at the back on the left, y in front, z at the back on
 * the right (so xz is the hidden edge), the apex t. */
export const tetra = (l: number, [x, y, z, t]: string[]): Record<string, P3> => ({
  [x]: [0, (l * Math.sqrt(3)) / 2, 0], [y]: [l / 2, 0, 0], [z]: [l, (l * Math.sqrt(3)) / 2, 0], [t]: [l / 2, l / Math.sqrt(3), l * Math.sqrt(2 / 3)],
})
export const TETRA = (x: string, y: string, z: string, t: string) => `${x}-${y}-${z} ${x}-${y}-${t} ${y}-${z}-${t} ${z}-${x}-${t}`

/** A point on a circle, as in mathematics (y up): `deg` degrees, radius r, centre c. */
export const pol = (deg: number, r = 1, c: Pt = [0, 0]): Pt => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)]
