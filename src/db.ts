import Dexie, { type Table } from 'dexie'
import type { Scene } from './geometry/types'

export interface Student {
  id?: number
  name: string
  grade: string // clasa, ex: "a XI-a"
  goal: string // ex: "Bacalaureat M1"
  contact: string
  notes: string
  createdAt: number
}

export interface Drawing {
  id: string
  title: string
  scene: Scene
}

export interface Session {
  id?: number
  studentId: number
  date: string // YYYY-MM-DD
  durationMin: number
  topics: string[]
  notes: string // markdown + LaTeX ($...$, $$...$$)
  homework: string
  homeworkDone: boolean
  rating: number // 1–5, cât de bine a mers
  drawings: Drawing[]
  createdAt: number
  updatedAt: number
}

/** The notebook, the board and the instruments, each kept whole as the JSON text it is saved as. */
export interface LocalRecord {
  key: string
  value: string
}

class JournalDB extends Dexie {
  students!: Table<Student, number>
  sessions!: Table<Session, number>
  local!: Table<LocalRecord, string>

  constructor() {
    super('math-journal')
    this.version(1).stores({
      students: '++id, name',
      sessions: '++id, studentId, date',
    })
    // version 2: the notebook and the board leave localStorage, where they could run out of room without a word
    this.version(2).stores({
      students: '++id, name',
      sessions: '++id, studentId, date',
      local: 'key',
    })
  }
}

export const db = new JournalDB()

export function newSession(studentId: number): Session {
  const now = Date.now()
  return {
    studentId,
    date: new Date().toISOString().slice(0, 10),
    durationMin: 60,
    topics: [],
    notes: '',
    homework: '',
    homeworkDone: false,
    rating: 3,
    drawings: [],
    createdAt: now,
    updatedAt: now,
  }
}

// ---------- the notebook, the board and the instruments ----------
// They are read whole, at once, when the app starts, so that the pages can read them as before, without waiting.
// They are written to the database in the background: always the latest version, one write at a time.
// In localStorage there may be two other things, both looked at once, at the next start:
// - under the old keys, what a version of the app from before the database left there. It is taken only if the
//   database has nothing under that key, and never deleted: an older version opened afterwards still finds it,
//   and whatever it saves there cannot overwrite the newer data in the database.
// - under `SPILL`, what a page closed in the middle of a write could not finish (see `spillLocal`): the newest
//   there is, so it is taken back into the database and then deleted.
export const LOCAL_KEYS = ['math-journal:notebook', 'math-journal:board', 'math-journal:board-instruments']
const SPILL = 'math-journal:unsaved:'

const cache = new Map<string, string>()
const dirty = new Map<string, string>()
// being written right now: until the database says it is done, it is not safe either
const inflight = new Map<string, string>()
// the database refused it: kept for `spillLocal`, until a later version of it is written
const unsaved = new Map<string, string>()
let writing: Promise<void> | null = null
let saveError: unknown = null
// without IndexedDB (a private window in some browsers) everything stays in localStorage, as it used to
let fallback = false

/** Reads them all into memory. Called once, before the app is shown. */
export async function loadLocal(): Promise<void> {
  try {
    for (const row of await db.local.toArray()) cache.set(row.key, row.value)
  } catch (err) {
    console.error('IndexedDB indisponibil, Caietul și Tabla rămân în localStorage', err)
    fallback = true
  }
  const read = (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }
  for (const key of LOCAL_KEYS) {
    const spilled = read(SPILL + key)
    const old = read(key)
    // in localStorage only, without the database, the old keys are the data itself
    const value = spilled ?? (fallback || !cache.has(key) ? old : null)
    if (value === null) continue
    cache.set(key, value)
    if (fallback) continue
    try {
      await db.local.put({ key, value })
      if (spilled !== null) localStorage.removeItem(SPILL + key)
    } catch (err) {
      console.error('Nu am putut muta în baza de date', key, err)
    }
  }
}

export function readLocal(key: string): string | null {
  return cache.get(key) ?? null
}

export function writeLocal(key: string, value: string) {
  cache.set(key, value)
  if (fallback) {
    try {
      localStorage.setItem(key, value)
      saveError = null
    } catch (err) {
      saveError = err
    }
    return
  }
  dirty.set(key, value)
  if (writing) return
  writing = (async () => {
    while (dirty.size) {
      const batch = [...dirty].map(([k, v]) => ({ key: k, value: v }))
      for (const [k, v] of dirty) inflight.set(k, v)
      dirty.clear()
      try {
        await db.local.bulkPut(batch)
        saveError = null
        for (const r of batch) unsaved.delete(r.key)
      } catch (err) {
        saveError = err
        for (const r of batch) unsaved.set(r.key, r.value)
        console.error('Salvarea Caietului sau a Tablei nu a reușit', err)
      }
      inflight.clear()
    }
    writing = null
  })()
}

/** Waits for the writes under way. Afterwards, `localSaveFailed` says whether the last one went wrong. */
export function flushLocal(): Promise<void> {
  return writing ?? Promise.resolve()
}

export const localSaveFailed = () => saveError !== null

/** The page is going away and cannot wait for the database: what is not written yet goes to localStorage. */
export function spillLocal() {
  for (const [key, value] of new Map([...unsaved, ...inflight, ...dirty])) {
    try {
      localStorage.setItem(SPILL + key, value)
    } catch {
      /* no room: this last change is lost, as it would have been before */
    }
  }
}

export async function exportBackup(): Promise<string> {
  const [students, sessions] = await Promise.all([db.students.toArray(), db.sessions.toArray()])
  const local: Record<string, string> = {}
  for (const key of LOCAL_KEYS) {
    const value = readLocal(key)
    if (value !== null) local[key] = value
  }
  return JSON.stringify({ app: 'math-journal', version: 2, exportedAt: new Date().toISOString(), students, sessions, local }, null, 2)
}

export async function importBackup(json: string): Promise<void> {
  const data = JSON.parse(json)
  if (data?.app !== 'math-journal') throw new Error('Fișierul nu este un backup Jurnal Meditații.')
  await db.transaction('rw', db.students, db.sessions, async () => {
    await db.students.clear()
    await db.sessions.clear()
    await db.students.bulkAdd(data.students)
    await db.sessions.bulkAdd(data.sessions)
  })
  // a version 1 backup has no notebook or board: what is on this device stays
  for (const key of LOCAL_KEYS) {
    const value = data.local?.[key]
    if (typeof value === 'string') writeLocal(key, value)
  }
  await flushLocal()
  if (localSaveFailed()) throw new Error('Elevii și ședințele au fost restaurate, dar Caietul sau Tabla nu au putut fi salvate.')
}
