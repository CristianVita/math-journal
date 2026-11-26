// The title of a worksheet says what is on it, and what is on it belongs under that title.
import { describe, expect, it } from 'vitest'
import { CHAPTERS, bookExercises, chapterForms, chapterOfGen, chaptersOf, fitsChapter } from './chapters'
import { BOOK_CHAPTERS } from './bookChapters'
import { GENERATORS, type Level } from './generators'
import { DEFAULT_TITLE, headAfter, isAutoTitle, titleWhenEmpty } from './sheetTitle'
import { TESTS8 } from './tests8'
import { seeded } from './tex'

const TODAY = '25.11.2026'
const empty = (title = DEFAULT_TITLE, date = '10.11.2026') => ({ title, date, items: [] as unknown[] })
/** Adds exercises under these names, one after another. */
const after = (names: (string | null)[], s = empty()) => names.reduce((sheet, n) => ({ ...sheet, ...headAfter(sheet, n, TODAY), items: [...sheet.items, 1] }), s)

describe('the title of the sheet', () => {
  it.each([...TESTS8.map((t) => t.title), ...CHAPTERS.map((c) => c.title), ...GENERATORS.map((g) => g.label)])('an empty sheet takes the name „%s”', (name) => {
    expect(after([name]).title).toBe(name)
  })

  it('the case the user met: a test, the list emptied, then a chapter', () => {
    const test = after(['Funcții, testul 2'])
    expect(test.title).toBe('Funcții, testul 2')
    // emptied by the new version, or left with the old title by the one before
    for (const title of [titleWhenEmpty(test.title), test.title]) expect(after(['Date, medii, probabilități'], empty(title)).title).toBe('Date, medii, probabilități')
  })

  it('every test, then every chapter on the emptied sheet', () => {
    for (const t of TESTS8) for (const c of CHAPTERS) expect(after([c.title], empty(t.title)).title).toBe(c.title)
  })

  it('a chapter added over a test left on the sheet is no longer that test', () => {
    for (const t of TESTS8) for (const c of CHAPTERS) expect(after([t.title, c.title]).title).toBe(DEFAULT_TITLE)
  })

  it('the same chapter twice keeps its name; a mix, the bank or a photo do not', () => {
    const c = CHAPTERS[3].title
    expect(after([c, c]).title).toBe(c)
    expect(after([c, null]).title).toBe(DEFAULT_TITLE)
    expect(after([null, c]).title).toBe(DEFAULT_TITLE)
    expect(after([null]).title).toBe(DEFAULT_TITLE)
    // once mixed, it stays mixed
    expect(after([CHAPTERS[0].title, c, c]).title).toBe(DEFAULT_TITLE)
  })

  it('a sheet saved under the old name of a chapter still counts as named by the app', () => {
    const now = 'Probleme cu situații reale'
    expect(CHAPTERS.some((c) => c.title === now)).toBe(true)
    const old = { title: 'Probleme cu text', date: TODAY, items: [1] }
    expect(headAfter(old, now, TODAY).title).toBe(now)
    expect(headAfter(old, 'Radicali', TODAY).title).toBe(DEFAULT_TITLE)
    expect(headAfter({ ...old, items: [] }, 'Radicali', TODAY).title).toBe('Radicali')
  })

  it('a title written by the user is never changed', () => {
    const own = 'Pregătire Maria, ședința 4'
    expect(isAutoTitle(own)).toBe(false)
    expect(after([CHAPTERS[0].title, TESTS8[0].title, null], empty(own)).title).toBe(own)
    expect(titleWhenEmpty(own)).toBe(own)
    expect(titleWhenEmpty(TESTS8[0].title)).toBe(DEFAULT_TITLE)
  })

  it('the date of an empty sheet is brought to today, but not a later one, nor that of a sheet with exercises', () => {
    expect(after([null]).date).toBe(TODAY)
    expect(after([null], empty(DEFAULT_TITLE, '30.11.2026')).date).toBe('30.11.2026')
    expect(after([null], empty(DEFAULT_TITLE, '5.1.2027')).date).toBe('5.1.2027')
    expect(after([null], empty(DEFAULT_TITLE, 'joi')).date).toBe('joi')
    expect(headAfter({ title: 'x', date: '10.11.2026', items: [1] }, null, TODAY).date).toBe('10.11.2026')
  })
})

describe('the exercises belong under the title', () => {
  it('a chapter takes only kinds of that chapter, at every level', () => {
    for (const c of CHAPTERS) for (const l of [1, 2, 3] as Level[]) {
      const list = chapterForms(c, l)
      for (const f of list) {
        expect(chapterOfGen(f.gen), f.gen).toBe(c.id)
        expect(f.form).toBeLessThan(GENERATORS.find((g) => g.id === f.gen)!.forms(l))
      }
      if (c.gens.length) expect(list.length, `${c.title} ${l}`).toBeGreaterThan(0)
    }
  })

  it('a generated exercise of a chapter keeps to its subject, and every level has enough of them', () => {
    for (const c of CHAPTERS) for (const l of [1, 2, 3] as Level[]) {
      const list = chapterForms(c, l)
      expect(list.length, `${c.title} ${l}`).toBeGreaterThanOrEqual(4)
      let off = 0
      for (const f of list) for (let s = 0; s < 4; s++) if (!fitsChapter(c, GENERATORS.find((g) => g.id === f.gen)!.make(seeded(s * 104729 + 9), l, f.form).text)) off++
      // the page checks each one again when it is made; here only a few may be refused
      expect(off / (list.length * 4), `${c.title} ${l}`).toBeLessThan(0.05)
    }
  })

  it('the book exercises put by hand exist, in chapters that exist', () => {
    const all = new Set(bookExercises().map((b) => `${b.source.model}#${b.source.n}`))
    for (const [k, c] of Object.entries(BOOK_CHAPTERS)) {
      expect(all.has(k), k).toBe(true)
      expect(CHAPTERS.some((x) => x.id === c), c).toBe(true)
    }
  })

  it('the strays the user met, and others like them, are in their own chapter', () => {
    const of = (w: string) => bookExercises().find((b) => b.where === w)!.chapters
    expect(of('Model E.N. 23, ex. 10')).toEqual(['triangles']) // a distance, met under "Radicali"
    expect(of('Model E.N. 4, ex. 1')).toEqual(['numbers']) // a quarter of 8^8, under the solids
    expect(of('Model E.N. 22, ex. 7')).toEqual(['triangles']) // angles with a secant, under the circle
    expect(of('Model E.N. 3, ex. 6')).toEqual(['percent'])
    const solid = (t: string) => chaptersOf(t)
    expect(solid('Un acvariu are forma unui paralelipiped dreptunghic. Calculați volumul.')).toEqual(['solids'])
    expect(solid('O prismă triunghiulară are toate muchiile egale. Aflați aria laterală.')).toEqual(['solids'])
    for (const b of bookExercises()) {
      if (b.chapters.includes('radicals')) expect(b.text, b.where).not.toMatch(/\sphericalangle|\triangle|figura/)
      if (b.chapters.includes('circle')) expect(b.text, b.where).toMatch(/cerc|hexagon|mathcal{C}|înscris|coard|arcul|arcele/i)
      if (b.chapters.includes('function')) expect(b.text, b.where).toMatch(/funcți|reper|axe/)
    }
  })

  const DATA = /medi[aeiu]|\bnot[ae]\b|notel|tabel|grafic|diagram|probabil|sondaj|temperatur|frecven|vizit|bilete|timp|puncte|precipita|promov/i
  it('„Date, medii, probabilități” has only data, means and probabilities (not train journeys or units)', () => {
    const c = CHAPTERS.find((x) => x.id === 'data')!
    for (const l of [1, 2, 3] as Level[]) for (const f of chapterForms(c, l)) for (let s = 0; s < 10; s++) {
      const t = GENERATORS.find((g) => g.id === f.gen)!.make(seeded(s * 7919 + 3), l, f.form).text
      expect(t, `${f.gen} ${l}/${f.form}`).toMatch(DATA)
      expect(t, `${f.gen} ${l}/${f.form}`).not.toMatch(/Transformați|ajunge la|rezultatul în litri|poate transporta|lista de cumpărături/)
    }
    const book = bookExercises().filter((b) => b.chapters.includes('data'))
    for (const b of book) {
      expect(b.text, b.where).toMatch(/medi|\bnot[ae]\b|notel|tabel|grafic|diagram|probabil|temperaturi/i)
      expect(b.text, b.where).not.toMatch(/imaginii funcției|aleile|valoarea raportului/)
    }
    expect(book.length).toBeGreaterThan(20)
  })

  it('each test has the kinds its name says', () => {
    const ALLOWED: Record<string, RegExp> = {
      'Intervale și inecuații': /^viii-(intervals|sets|inequality)$/,
      'Calcul algebric și descompuneri': /^viii-(literal|formulas|factoring|radicals)$/,
      'Fracții algebrice': /^viii-alg-fractions$/,
      // the book's own tests of this chapter have two inequations, squares and a problem among the equations
      'Ecuații de gradul al doilea': /^viii-(quadratic|inequality|formulas|problems)$/,
      'Funcții': /^viii-functions?$/,
      'Evaluare inițială': /^(vi|vii)-|^viii-(inequality|system|problems|sets)$/,
    }
    for (const t of TESTS8) {
      for (const i of t.items) expect(i.gen, t.title).toMatch(ALLOWED[t.group])
      // most of the exercises of an equations test are equations
      if (t.group === 'Ecuații de gradul al doilea') expect(t.items.filter((i) => i.gen === 'viii-quadratic').length * 2).toBeGreaterThan(t.items.length)
    }
  })
})
