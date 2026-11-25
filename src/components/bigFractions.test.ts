import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { bigFractions } from './bigFractions'
import { renderMathMarkdown } from './MathText'

describe('large fractions in the text', () => {
  it.each([
    ['\\frac{1}{2} + \\frac{3}{4}', '\\dfrac{1}{2} + \\dfrac{3}{4}'],
    ['x^{\\frac{1}{2}} + 2^\\frac12', 'x^{\\frac{1}{2}} + 2^\\frac12'],
    ['a_{\\frac{n}{2}}', 'a_{\\frac{n}{2}}'],
    ['\\frac{\\frac{1}{2}}{3}', '\\dfrac{\\frac{1}{2}}{3}'],
    ['\\frac{1}{\\frac{2}{3} + 1} - \\frac{5}{6}', '\\dfrac{1}{\\frac{2}{3} + 1} - \\dfrac{5}{6}'],
    ['\\sqrt{\\frac{4}{9}} = \\left(\\frac{2}{3}\\right)^{2}', '\\sqrt{\\dfrac{4}{9}} = \\left(\\dfrac{2}{3}\\right)^{2}'],
    ['\\frac12 \\cdot \\frac{3}{4}', '\\dfrac12 \\cdot \\dfrac{3}{4}'],
    ['e^{x} \\frac{1}{2}', 'e^{x} \\dfrac{1}{2}'],
    ['\\dfrac{1}{2} \\tfrac{1}{3} x', '\\dfrac{1}{2} \\tfrac{1}{3} x'],
    ['\\text{frac} 2', '\\text{frac} 2'],
  ])('%s', (tex, want) => {
    expect(bigFractions(tex)).toBe(want)
    expect(() => katex.renderToString(bigFractions(tex), { throwOnError: true })).not.toThrow()
  })

  it('only in a line of text, not in a formula on its own line', () => {
    // KaTeX keeps the LaTeX it drew in the annotation of the MathML
    expect(renderMathMarkdown('Avem $\\frac{1}{2}$.')).toContain('\\dfrac{1}{2}')
    expect(renderMathMarkdown('$$\\frac{1}{2}$$')).not.toContain('dfrac')
  })
})
