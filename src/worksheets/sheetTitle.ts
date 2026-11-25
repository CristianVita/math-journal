// The title and the date of a worksheet, kept in step with what is put on it (25 November 2026: the title of a test
// stayed on a sheet made afterwards from another chapter). A title written by the user is never touched.
import { CHAPTERS } from './chapters'
import { GENERATORS } from './generators'
import { TESTS8 } from './tests8'

export const DEFAULT_TITLE = 'Fișă de lucru'

const AUTO = new Set([DEFAULT_TITLE, '', ...TESTS8.map((t) => t.title), ...CHAPTERS.map((c) => c.title), ...GENERATORS.map((g) => g.label)])
/** Whether the title was set by the app (or is empty), so that it may change by itself. */
export const isAutoTitle = (title: string) => AUTO.has(title.trim())

/** 10.11.2026 as a number that can be compared; null when it is not written so. */
const dayOf = (s: string) => {
  const m = /^\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*$/.exec(s)
  return m ? Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]) : null
}

interface Head { title: string; date: string; items: unknown[] }

/**
 * The title and date of `sheet` after exercises called `what` are added (a test, a chapter, a kind; null for a mix,
 * the bank, a photo). An empty sheet takes the name, and today's date when its own has passed; a sheet with exercises
 * keeps its name only if the new ones have the same, else it is a plain worksheet.
 */
export function headAfter(sheet: Head, what: string | null, today: string): { title: string; date: string } {
  const name = what ?? DEFAULT_TITLE
  const empty = sheet.items.length === 0
  const [old, now] = [dayOf(sheet.date), dayOf(today)]
  const date = empty && old !== null && now !== null && old < now ? today : sheet.date
  if (!isAutoTitle(sheet.title)) return { title: sheet.title, date }
  return { title: empty || sheet.title === name ? name : DEFAULT_TITLE, date }
}

/** The title of a sheet left without exercises. */
export const titleWhenEmpty = (title: string) => (isAutoTitle(title) ? DEFAULT_TITLE : title)
