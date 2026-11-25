// Putting exercises from the Modele E.N. page on the worksheet: the book's own, or a generated one like it.
import { readLocal, writeLocal } from '../db'
import { SHEET_KEY, newExercise, type SheetItem } from '../worksheets/WorksheetsPage'
import { matchName, similarForms } from '../worksheets/similar'
import { DEFAULT_TITLE, headAfter } from '../worksheets/sheetTitle'

const todayRo = () => new Date().toLocaleDateString('ro-RO')

/** Adds the exercises at the end of the worksheet (the Fișe page reads it when it opens). */
export function appendToSheet(made: SheetItem[]) {
  let sheet: { items?: SheetItem[]; title?: string; date?: string } = {}
  try {
    sheet = JSON.parse(readLocal(SHEET_KEY) ?? '{}')
  } catch {
    /* unreadable: the worksheet page starts a new one anyway */
  }
  const head = headAfter({ title: sheet.title ?? DEFAULT_TITLE, date: sheet.date ?? todayRo(), items: sheet.items ?? [] }, null, todayRo())
  writeLocal(SHEET_KEY, JSON.stringify({ studentId: null, space: 1, solutions: true, ...sheet, ...head, items: [...(sheet.items ?? []), ...made] }))
}

/**
 * "Încă unul la fel": a generated exercise of the kind most like this statement, put on the sheet. Says what was
 * added, or that the app has no kind like it.
 */
export function addSimilar(text: string): string {
  const m = similarForms(text, 1)[0]
  if (!m) return 'Aplicația nu are un tip de exercițiu asemănător cu acesta.'
  const item = newExercise(m.gen, m.level, m.form)
  if (!item) return 'Aplicația nu are un tip de exercițiu asemănător cu acesta.'
  appendToSheet([item])
  return `Pe fișă: un exercițiu nou de tipul „${matchName(m)}”. Pe pagina Fișe, „↻ Altul” dă încă unul.`
}
