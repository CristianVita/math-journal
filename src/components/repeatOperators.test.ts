// Which pieces of a formula end with an operation sign, told from what KaTeX really writes.
import { describe, expect, it } from 'vitest'
import katex from 'katex'
import { endSign } from './repeatOperators'

interface Piece { cls: string; text: string }

/** The pieces (`.base`) of a formula with their elements, read from KaTeX's own HTML (there is no DOM in these tests). */
function bases(tex: string): Piece[][] {
  const html = katex.renderToString(tex).split('aria-hidden="true">')[1]
  return html.split('<span class="base">').slice(1).map((b) => {
    const out: Piece[] = []
    let depth = 0
    for (const m of b.matchAll(/<span([^>]*)>|<\/span>|([^<]+)/g)) {
      if (m[0] === '</span>') {
        if (--depth < 0) break
      } else if (m[2] !== undefined) out[out.length - 1].text += m[2]
      else if (depth++ === 0) out.push({ cls: /class="([^"]*)"/.exec(m[1])?.[1] ?? '', text: '' })
    }
    return out
  })
}

const fake = (list: Piece[]): Element => {
  let prev: unknown = null
  for (const p of list) prev = { classList: { contains: (c: string) => p.cls.split(' ').includes(c) }, textContent: p.text, previousElementSibling: prev }
  return { lastElementChild: prev } as unknown as Element
}
const signs = (tex: string) => bases(tex).map((b) => endSign(fake(b), tex)?.textContent ?? '')

describe('the sign a piece of a formula ends with', () => {
  it('the four operations', () => {
    expect(signs('a + b')).toEqual(['+', ''])
    expect(signs('a - b')).toEqual(['−', ''])
    expect(signs('a \\cdot b')).toEqual(['⋅', ''])
    expect(signs('a \\times b')).toEqual(['×', ''])
    expect(signs('a : b')).toEqual([':', ''])
  })
  it('the formula the user showed: b = (√5 + 1)√…', () => {
    expect(signs('b = (\\sqrt{5} + 1)\\sqrt{6 - 2\\sqrt{5}}')).toEqual(['', '+', ''])
  })
  it('not the relations, nor the sign of a negative number, nor the colon of a function or a set', () => {
    expect(signs('a = -b')).toEqual(['', ''])
    expect(signs('a \\le b')).toEqual(['', ''])
    expect(signs('f: \\mathbb{R} \\to \\mathbb{R}').join('')).toBe('')
  })
})
