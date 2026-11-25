// The tests of the grade VIII workbook, and the new algebra forms of grade VIII beyond what generators.test.ts checks.
import { describe, expect, it } from 'vitest'
import { writeFileSync } from 'fs'
import { FORM8, GENERATORS } from './generators'
import { TESTS8, testsOk } from './tests8'
import { seeded } from './tex'

describe('the tests of the grade VIII workbook', () => {
  it('name only kinds and forms that exist, each test once', () => {
    expect(testsOk()).toBe(true)
    expect(new Set(TESTS8.map((t) => t.id)).size).toBe(TESTS8.length)
    expect(TESTS8.length).toBe(20)
  })

  it('a form is found again by its number: the same exercise as the form itself', () => {
    for (const [form, at] of FORM8) {
      const g = GENERATORS.find((x) => x.id === at.gen)!
      expect(g.make(seeded(77), at.level, at.form).text, form.name).toBe(form(seeded(77)).text)
    }
  })

  it('every form checks out on many seeds, and leaves no clumsy writing', () => {
    const dump: string[] = [], bad = new Map<string, string>()
    for (const [form, at] of FORM8) {
      for (let s = 0; s < 300; s++) {
        const m = form(seeded(s * 104729 + 5))
        if (!(m.verify?.() ?? true)) bad.set(form.name, 'verify: ' + m.text)
        for (const t of [m.text, m.solution]) {
          // "+ -3", "- -3", "1x", "+ 0" at the end, a doubled operator
          if (/[+] -|- -|(?<![\d,}^])1x|x\}? [-+] 0(?![\d{,.])|\+ \+|NaN|undefined/.test(t) && !bad.has(form.name)) bad.set(form.name, t)
        }
        if (s < 2) dump.push(`## ${form.name} (${at.gen}, ${at.level})`, m.text, '>>', m.solution, '')
      }
    }
    if (process.env.DUMP8) writeFileSync(process.env.DUMP8, dump.join('\n'))
    expect([...bad].map(([k, v]) => k + ': ' + v)).toEqual([])
  })
})
