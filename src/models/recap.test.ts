import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { RECAP8 } from './data/recap8'
import { figureSvg, namesUsed } from './figure'
import { recapAnswer, recapText } from './recap'

function formulas(text: string): { tex: string; display: boolean }[] {
  const out: { tex: string; display: boolean }[] = []
  const rest = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { out.push({ tex: t, display: true }); return '' })
  for (const m of rest.matchAll(/\$([^$]+?)\$/g)) out.push({ tex: m[1], display: false })
  return out
}

describe(RECAP8.title, () => {
  it('has the chapters of the book: 19, 20, 10 and 10 exercises', () => {
    expect(RECAP8.sections.map((s) => s.items.length)).toEqual([19, 20, 10, 10])
  })

  for (const section of RECAP8.sections) {
    describe(section.title, () => {
      it('every exercise has an answer, every part too', () => {
        section.items.forEach((item, i) => {
          if (item.parts) for (const [k, p] of item.parts.entries()) expect(p.ans, `${i + 1} ${'abcdefghi'[k]})`).toBeTruthy()
          else expect(item.ans, `${i + 1}`).toBeTruthy()
        })
      })

      it('every formula is valid for KaTeX, with no unpaired $', () => {
        section.items.forEach((item, i) => {
          for (const t of [recapText(item), recapAnswer(item), item.note ?? '']) {
            expect((t.replace(/\$\$/g, '').match(/\$/g) ?? []).length % 2, `${i + 1}: ${t}`).toBe(0)
            for (const f of formulas(t)) expect(() => katex.renderToString(f.tex, { throwOnError: true, displayMode: f.display }), `${i + 1}: ${f.tex}`).not.toThrow()
          }
        })
      })

      it('the figures use only their own points and fit their size', () => {
        section.items.forEach((item, i) => {
          if (!item.fig) return
          for (const n of namesUsed(item.fig)) expect(item.fig.p[n], `${i + 1}: punctul ${n}`).toBeDefined()
          for (const [n, [x, y]] of Object.entries(item.fig.p)) {
            expect(x, `${i + 1}: ${n}`).toBeGreaterThanOrEqual(-0.01)
            expect(x, `${i + 1}: ${n}`).toBeLessThanOrEqual(item.fig.w + 0.01)
            expect(y, `${i + 1}: ${n}`).toBeGreaterThanOrEqual(-0.01)
            expect(y, `${i + 1}: ${n}`).toBeLessThanOrEqual(item.fig.h + 0.01)
          }
          expect(figureSvg(item.fig)).toMatch(/^<svg/)
        })
      })
    })
  }

  it('every geometry problem has a figure', () => {
    for (const s of RECAP8.sections.filter((x) => x.id.startsWith('geo'))) s.items.forEach((it, i) => expect(it.fig, `${s.title} ${i + 1}`).toBeDefined())
  })
})

// ---------- the answers, computed again ----------
const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1e-9)
const r = Math.sqrt

describe('the answers hold', () => {
  it('algebra A', () => {
    close(-1 / 125 / 0.008 + 7 / 9 + 1 / 9, -1 / 9)
    close((7 / 30 - 1.2) / (29 / 90), -3)
    close((5 * r(3) - 2 * r(5) + r(8 - 2 * r(15)) + 2 / (r(5) + r(3))) / 3, r(3))
    close(r(((r(18) - r(2)) / (r(12) - r(3))) * ((r(48) - r(3)) / (r(18) - r(8)))), r(6))
    for (const x of [-3, 0.5, 2, 7]) {
      close(x ** 3 - 2 * x ** 2 - 4 * x + 8, (x - 2) ** 2 * (x + 2))
      close((2 * x + 1) ** 3 - 8 * x - 4, (2 * x + 1) * (2 * x - 1) * (2 * x + 3))
      close(2 * (x * x - 1) - (x + 1) ** 2, (x + 1) * (x - 3))
      close(x * x + 5 * x + 6 - 2 * (x * x - 4), (x + 2) * (7 - x))
      close((x * x + 2 * x + 2) * (x * x + 2 * x + 6) + 7, (x * x + 2 * x + 4) ** 2 + 3)
    }
    // 8 g): x = -2 is a solution too
    close(Math.abs(-2 + 2) * (4 * 0 - 2 * 3), 0)
    // 19: 13 benches, 21 pupils
    expect(2 * (13 - 3) + 1).toBe(21)
    expect(3 * (13 - 6)).toBe(21)
  })

  it('algebra B', () => {
    close(1 / (1 + r(2)) + 1 / (r(2) + r(3)) + 1 / (r(3) + 2), 1)
    close((r(6 - r(11)) - r(6 + r(11))) / r(2), -1)
    expect(48 ** 2 - 36 ** 2).toBe(1008)
    expect([53 % 7, 53 % 8]).toEqual([4, 5])
    const F = (x: number) => (x ** 3 + x ** 2 - 4 * x - 4) / (x ** 3 - 4 * x)
    for (const x of [-3, 0.5, 5]) close(F(x), 1 + 1 / x)
    let s = 0
    for (let k = 1; k <= 25; k++) s += 3 * k + 6
    expect(s).toBe(1125)
    s = 0
    for (let k = 1; k <= 60; k++) s += 2 * k + 6
    expect(s).toBe(4020)
    close(1080 / (1 / 3 + 1 / 2), 1296)
  })

  it('geometry A', () => {
    // 7 d): the planes B'AC and A'BC'
    const n1 = [24 * r(3), -24, -32 * r(3)]
    const n2 = [-24 * r(3), 24, -32 * r(3)]
    const cos = Math.abs(n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2]) / (n1[0] ** 2 + n1[1] ** 2 + n1[2] ** 2)
    close(r(1 - cos * cos), (4 * r(3)) / 7)
    // 5: the frustum, its volume and the tangent
    close((6 / 3) * (144 * r(3) + 36 * r(3) + r(144 * r(3) * 36 * r(3))), 504 * r(3))
    close(6 / (8 * r(3)), r(3) / 4)
    // 10 b): BN = MN = 3√37, BM = 6√10
    close(0.5 * 6 * r(10) * r(333 - 90), 27 * r(30))
  })

  it('geometry B', () => {
    // 3 b): M the midpoint of CC′, area of MA′B
    const A1 = [0, 0, 12], B = [24, 0, 0], M = [12, 12 * r(3), 6]
    const u = B.map((v, i) => v - A1[i]), w = M.map((v, i) => v - A1[i])
    const c = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]
    close(r(c[0] ** 2 + c[1] ** 2 + c[2] ** 2) / 2, 72 * r(15))
    close(r(24 ** 2 + 6 ** 2), 6 * r(17))
    // 4: the volume gives the side 6√3, the apothem 5
    const l = 6 * r(3)
    close(((l * l * r(3)) / 4) * 4 / 3, 36 * r(3))
    const od = (l * r(3)) / 6
    close(r(od * od + 16), 5)
    close((3 * l * 5) / 2, 45 * r(3))
    close(l / 2 / 5, (3 * r(3)) / 5)
    close((od * 4) / 5, 12 / 5)
    // 2: R + r = 30, R² + r² + Rr = 684
    close(18 * 18 + 12 * 12 + 18 * 12, 684)
    // 7: the frustum
    close(((Math.PI * 6 * r(3)) / 3) * (72 + 162 + 108), 684 * r(3) * Math.PI)
    close((18 * r(3) * 9) / (9 * r(13)), (18 * r(39)) / 13)
    // 10: the frustum, k = 3
    close(Math.PI * (24 + 15) * 15, 585 * Math.PI)
    close(((Math.PI * 12) / 3) * (576 + 225 + 360), 4644 * Math.PI)
  })
})
