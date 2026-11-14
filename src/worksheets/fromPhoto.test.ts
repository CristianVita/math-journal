// Exercises pasted back from a chat: split right, whatever shape the answer came in.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { PHOTO_PROMPT, brokenFormulas, spacedLines, splitExercises } from './fromPhoto'

const render = (t: string, d: boolean) => katex.renderToString(t, { throwOnError: true, displayMode: d })

describe('exercises from a photo', () => {
  it('splits on --- inside the code block, and keeps the subpoints together', () => {
    const answer = 'Iată transcrierea:\n\n```\nCalculați $\\sqrt{3\\frac{6}{25}}$.\n---\nRezolvați:\na) $x^2 - 4 = 0$\nb) $2^x = 8$\n---\n$$\\frac{1}{2} + \\frac{1}{3}$$\n```\n\nSper că ajută!'
    const ex = splitExercises(answer)
    expect(ex).toHaveLength(3)
    expect(ex[0]).toBe('Calculați $\\sqrt{3\\frac{6}{25}}$.')
    expect(ex[1]).toBe('Rezolvați:\na) $x^2 - 4 = 0$\nb) $2^x = 8$')
    expect(ex[2]).toBe('$$\\frac{1}{2} + \\frac{1}{3}$$')
  })

  it('takes the numbers off, and splits on them when there are no separators', () => {
    const ex = splitExercises('1. Calculați $2 + 3$.\n2) Aflați $x$ din $x + 1 = 4$.\n3. Simplificați $\\frac{6}{8}$.')
    expect(ex).toEqual(['Calculați $2 + 3$.', 'Aflați $x$ din $x + 1 = 4$.', 'Simplificați $\\frac{6}{8}$.'])
    expect(splitExercises('**4.** Calculați $5^2$.')).toEqual(['Calculați $5^2$.'])
  })

  it('turns \\( \\) and \\[ \\] into $ and $$, and leaves out empty parts', () => {
    const ex = splitExercises('Fie \\(f(x) = 2x\\).\n\\[ f(1) + f(2) \\]\n---\n\n---\n')
    expect(ex).toEqual(['Fie $f(x) = 2x$.\n$$f(1) + f(2)$$'])
  })

  it('a subpoint "a)" at the start of a line does not split an exercise', () => {
    expect(splitExercises('Rezolvați:\na) $x = 1$\nb) $x = 2$')).toHaveLength(1)
  })

  it('finds formulas KaTeX cannot draw', () => {
    expect(brokenFormulas('Calculați $\\frac{1}{2}$ și $$\\sqrt{2}$$.', render)).toEqual([])
    expect(brokenFormulas('Calculați $\\frac{1}{$.', render)).toHaveLength(1)
    expect(brokenFormulas('Un $ singur', render)).toEqual(['$ fără pereche'])
  })

  it('spaces the lines of an exercise, but not inside a $$ formula', () => {
    expect(spacedLines('Calculați:\na) $1$\nb) $2$')).toBe('Calculați:\n\na) $1$\n\nb) $2$')
    expect(spacedLines('Fie:\n$$\\begin{cases} x = 1 \\\\\ny = 2 \\end{cases}$$\nAflați')).toBe('Fie:\n\n$$\\begin{cases} x = 1 \\\\\ny = 2 \\end{cases}$$\n\nAflați')
    expect(spacedLines('a)\n\nb)')).toBe('a)\n\nb)')
  })

  it('the instructions ask for what the splitter expects', () => {
    expect(PHOTO_PROMPT).toContain('---')
    expect(PHOTO_PROMPT).toContain('```')
    expect(PHOTO_PROMPT).toContain('\\operatorname{tg}')
  })
})
