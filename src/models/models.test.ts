/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { BUILTIN } from './store'
import { figureSvg, foot, namesUsed } from './figure'
import { LETTERS, itemText } from './types'
import barem from './data/barem.md?raw'

/** Every formula of a text, as KaTeX would get it. */
function formulas(text: string): { tex: string; display: boolean }[] {
  const out: { tex: string; display: boolean }[] = []
  const rest = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { out.push({ tex: t, display: true }); return '' })
  for (const m of rest.matchAll(/\$([^$]+?)\$/g)) out.push({ tex: m[1], display: false })
  return out
}

it("keeps the rear diagonal DC' in Model E.N. 4 clear of B'", () => {
  const { p, d } = BUILTIN.find((model) => model.id === 'en-4')!.items[11].fig!
  expect(d?.split(/\s+/)).toContain("D-C'")
  const [x, y] = foot(p["B'"], p.D, p["C'"])
  expect(Math.hypot(p["B'"][0] - x, p["B'"][1] - y)).toBeGreaterThan(10)
})

for (const model of BUILTIN) {
  describe(model.title, () => {
    const [s2, s3] = model.starts ?? [6, 12]
    it('has 18 exercises (or as many as the book prints, when `starts` says so)', () => {
      expect(model.items).toHaveLength(s3 + 6)
      expect(s3 - s2).toBe(6)
    })

    it('subjects I and II: four choices and the answer; subject III: 2 + 3 points', () => {
      model.items.forEach((item, i) => {
        if (i < s3) {
          expect(item.choices?.length, `exercițiul ${i + 1}`).toBeGreaterThanOrEqual(2)
          expect(item.ans, `exercițiul ${i + 1}`).toBeGreaterThanOrEqual(0)
          expect(item.ans!, `exercițiul ${i + 1}`).toBeLessThan(item.choices!.length)
        } else {
          expect(item.parts?.map((p) => p.pts), `exercițiul ${i + 1}`).toEqual([2, 3])
        }
      })
    })

    it('every formula is valid for KaTeX, with no unpaired $', () => {
      model.items.forEach((item, i) => {
        const texts = [itemText(item), ...(item.parts ?? []).map((p) => p.ans ?? ''), ...(item.choices ?? [])]
        for (const t of texts) {
          expect((t.replace(/\$\$/g, '').match(/\$/g) ?? []).length % 2, `exercițiul ${i + 1}: ${t}`).toBe(0)
          for (const f of formulas(t)) {
            expect(() => katex.renderToString(f.tex, { throwOnError: true, displayMode: f.display }), `exercițiul ${i + 1}: ${f.tex}`).not.toThrow()
          }
        }
      })
    })

    it('subjects I and II answer as the book’s answer key (data/barem.md)', () => {
      const n = model.id.replace('en-', '')
      const line = barem.split('\n').find((l) => l.startsWith(`- **M${n}:**`))
      expect(line, `M${n} în barem.md`).toBeDefined()
      const key = [...line!.matchAll(/\b(\d{1,2})([a-d])\b/g)].map((m) => [Number(m[1]), m[2]] as const)
      expect(key).toHaveLength(s3)
      for (const [k, letter] of key) expect(LETTERS[model.items[k - 1].ans!], `exercițiul ${k}`).toBe(letter)
    })

    it('the figures use only their own points and fit their size', () => {
      model.items.forEach((item, i) => {
        if (!item.fig) return
        for (const n of namesUsed(item.fig)) expect(item.fig.p[n], `exercițiul ${i + 1}: punctul ${n}`).toBeDefined()
        for (const [n, [x, y]] of Object.entries(item.fig.p)) {
          expect(x, `exercițiul ${i + 1}: ${n}`).toBeGreaterThanOrEqual(0)
          expect(x, `exercițiul ${i + 1}: ${n}`).toBeLessThanOrEqual(item.fig.w)
          expect(y, `exercițiul ${i + 1}: ${n}`).toBeGreaterThanOrEqual(0)
          expect(y, `exercițiul ${i + 1}: ${n}`).toBeLessThanOrEqual(item.fig.h)
        }
        expect(figureSvg(item.fig)).toMatch(/^<svg/)
      })
    })
  })
}
