import { describe, expect, it } from 'vitest'
import { GENERATORS } from './generators'
import { CHAPTERS, bookExercises, chapterOfGen } from './chapters'

describe('chapters', () => {
  it('every kind of grades V–VIII (but the contest ones) is in a chapter', () => {
    for (const g of GENERATORS.filter((x) => x.grade <= 8 && !x.id.includes('contest'))) expect(chapterOfGen(g.id), g.id).toBeDefined()
  })

  it('every exercise of the books is in a chapter, and every chapter has some', () => {
    const book = bookExercises()
    for (const b of book) expect(b.chapters.length, b.where).toBeGreaterThan(0)
    for (const c of CHAPTERS) expect(book.some((b) => b.chapters.includes(c.id)), c.id).toBe(true)
  })

  it('puts the solids where they belong', () => {
    const book = bookExercises()
    const cube = book.find((b) => b.where === 'Testul 1, ex. 18')!
    expect(cube.chapters).toContain('space')
  })
})
