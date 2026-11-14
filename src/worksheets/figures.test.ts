import { describe, expect, it } from 'vitest'
import { writeFileSync } from 'fs'
import { GENERATORS, type Level } from './generators'
import { seeded } from './tex'
import { drawFigure } from './figures'
import { figureSvg, namesUsed } from '../models/figure'

const geometry = GENERATORS.filter((g) => g.topic === 'Geometrie')

describe('figures of the generated geometry', () => {
  const misses: string[] = []
  let forms = 0, drawn = 0

  for (const g of geometry) {
    it(`${g.id}: every figure is whole, inside its size, and drawn`, () => {
      for (const level of [1, 2, 3] as Level[]) {
        for (let f = 0; f < g.forms(level); f++) {
          let got = 0
          for (let s = 1; s <= 4; s++) {
            const text = g.make(seeded(s * 7919 + f), level, f).text
            const fig = drawFigure(text)
            if (!fig) continue
            got++
            for (const n of namesUsed(fig)) expect(fig.p[n], `${g.id} ${level}/${f}: ${n} — ${text}`).toBeDefined()
            for (const [n, [x, y]] of Object.entries(fig.p)) {
              expect(Number.isFinite(x) && Number.isFinite(y), `${g.id} ${level}/${f}: ${n} — ${text}`).toBe(true)
              expect(x, `${g.id} ${level}/${f}: ${n}`).toBeGreaterThanOrEqual(-0.5)
              expect(x, `${g.id} ${level}/${f}: ${n}`).toBeLessThanOrEqual(fig.w + 0.5)
              expect(y, `${g.id} ${level}/${f}: ${n}`).toBeGreaterThanOrEqual(-0.5)
              expect(y, `${g.id} ${level}/${f}: ${n}`).toBeLessThanOrEqual(fig.h + 0.5)
            }
            expect(figureSvg(fig)).toMatch(/^<svg/)
          }
          forms++
          if (got) drawn++
          else misses.push(`${g.id} ${level}/${f}: ${g.make(seeded(7919 + f), level, f).text}`)
        }
      }
    })
  }

  it('most grade VIII forms get a figure', () => {
    if (process.env.FIG_MISSES) writeFileSync(process.env.FIG_MISSES, misses.join('\n'))
    expect(drawn / forms, misses.join('\n')).toBeGreaterThan(0.8)
  })
})
