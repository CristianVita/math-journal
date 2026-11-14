// The models of the book, the ones the user adds, and which model each student did, with the score.
import { readLocal, writeLocal } from '../db'
import type { EnModel } from './types'
import { M1 } from './data/m1'
import { M2 } from './data/m2'
import { M3 } from './data/m3'
import { M4 } from './data/m4'
import { M5 } from './data/m5'
import { M6 } from './data/m6'
import { M7 } from './data/m7'
import { M8 } from './data/m8'
import { M9 } from './data/m9'
import { M10 } from './data/m10'
import { M11 } from './data/m11'
import { M12 } from './data/m12'
import { M13 } from './data/m13'
import { M14 } from './data/m14'
import { M15 } from './data/m15'
import { M16 } from './data/m16'

export const BUILTIN: EnModel[] = [M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M15, M16]

/** Kept in the database, in LOCAL_KEYS, so they go into the backup. */
export const OWN_KEY = 'math-journal:en-models'
export const RESULTS_KEY = 'math-journal:en-results'

export interface EnResult {
  id: string
  studentId: number
  modelId: string
  /** as written: 12.11.2026 */
  date: string
  /** out of 100, the 10 given points included; empty while not marked */
  score: number | null
}

function read<T>(key: string, field: string): T[] {
  try {
    const raw = readLocal(key)
    if (raw) return JSON.parse(raw)[field] ?? []
  } catch {
    /* unreadable: nothing yet */
  }
  return []
}

export const loadOwn = () => read<EnModel>(OWN_KEY, 'models')
export const saveOwn = (models: EnModel[]) => writeLocal(OWN_KEY, JSON.stringify({ models }))
export const loadResults = () => read<EnResult>(RESULTS_KEY, 'results')
export const saveResults = (results: EnResult[]) => writeLocal(RESULTS_KEY, JSON.stringify({ results }))
