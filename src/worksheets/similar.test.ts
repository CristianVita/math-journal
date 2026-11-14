import { describe, expect, it } from 'vitest'
import { similarForms } from './similar'

const best = (t: string) => similarForms(t, 1)[0]?.gen

describe('a generated kind like a book exercise', () => {
  it('finds the kind of an algebra exercise', () => {
    expect(best('Determinați numerele reale $x$ și $y$, știind că $(2x+y-1)^2+(3x-2y+1)^2=0$.')).toBe('viii-system')
    expect(best('Descompuneți în produs de factori: a) $x^3-2x^2-4x+8$; b) $2(x^2-1)-(x+1)^2$.')).toBe('viii-factoring')
    expect(best('Se consideră funcția $f:\\mathbb{R}\\to\\mathbb{R}$, $f(x)=-2x+4$. Reprezentați grafic funcția $f$.')).toBe('viii-function')
  })

  it('keeps solids with solids and plane figures with plane figures', () => {
    expect(best('O piramidă patrulateră regulată $VABCD$ are latura bazei egală cu $8$ cm și apotema egală cu $5$ cm. Calculați volumul piramidei.')).toMatch(/^viii-/)
    const flat = best('În figura alăturată este reprezentat trapezul $ABCD$, cu $AB\\parallel CD$, $CD=12$ cm și $BC=16$ cm.')
    expect(flat === undefined || flat.startsWith('vii-')).toBe(true)
  })

  // since 13 November 2026 grade VI has parallel lines cut by a secant
  it('finds the parallel lines of grade VI', () => {
    expect(best('În figura alăturată, dreptele paralele $a$ și $b$ sunt tăiate de secanta $c$. Dacă $\\sphericalangle 8=132^\\circ$, atunci $\\sphericalangle 1$ are măsura egală cu:')).toBe('vi-lines-circle')
  })

  it('gives nothing when the app has nothing alike', () => {
    expect(best('Construiți cu rigla și compasul hexagonul stelat și colorați zonele simetrice față de axa verticală.')).toBeUndefined()
  })
})
