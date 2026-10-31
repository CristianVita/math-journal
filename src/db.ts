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

class JournalDB extends Dexie {
  students!: Table<Student, number>
  sessions!: Table<Session, number>

  constructor() {
    super('math-journal')
    this.version(1).stores({
      students: '++id, name',
      sessions: '++id, studentId, date',
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

export async function exportBackup(): Promise<string> {
  const [students, sessions] = await Promise.all([db.students.toArray(), db.sessions.toArray()])
  return JSON.stringify({ app: 'math-journal', version: 1, exportedAt: new Date().toISOString(), students, sessions }, null, 2)
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
}
