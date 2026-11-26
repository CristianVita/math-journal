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
import { M17 } from './data/m17'
import { M18 } from './data/m18'
import { M19 } from './data/m19'
import { M20 } from './data/m20'
import { M21 } from './data/m21'
import { M22 } from './data/m22'
import { M23 } from './data/m23'
import { M40 } from './data/m40'
import { M41 } from './data/m41'
import { M42 } from './data/m42'
import { M43 } from './data/m43'
import { M44 } from './data/m44'
import { M45 } from './data/m45'
import { M46 } from './data/m46'
import { M47 } from './data/m47'
import { M24 } from './data/m24'
import { M25 } from './data/m25'
import { M26 } from './data/m26'
import { M27 } from './data/m27'
import { M28 } from './data/m28'
import { M29 } from './data/m29'
import { M30 } from './data/m30'
import { M31 } from './data/m31'
import { M32 } from './data/m32'
import { M33 } from './data/m33'
import { M34 } from './data/m34'
import { M35 } from './data/m35'
import { M36 } from './data/m36'
import { M37 } from './data/m37'
import { M38 } from './data/m38'
import { M39 } from './data/m39'
import { M48 } from './data/m48'
import { M49 } from './data/m49'
import { M50 } from './data/m50'
import { M51 } from './data/m51'
import { M52 } from './data/m52'
import { M53 } from './data/m53'
import { M54 } from './data/m54'
import { M55 } from './data/m55'
import { M56 } from './data/m56'
import { M57 } from './data/m57'
import { M58 } from './data/m58'
import { M59 } from './data/m59'
import { M60 } from './data/m60'
import { M61 } from './data/m61'
import { M62 } from './data/m62'
import { M63 } from './data/m63'
import { M64 } from './data/m64'
import { M65 } from './data/m65'
import { M66 } from './data/m66'
import { M67 } from './data/m67'
import { M68 } from './data/m68'
import { M69 } from './data/m69'
import { M70 } from './data/m70'
import { M71 } from './data/m71'
import { M72 } from './data/m72'
import { M73 } from './data/m73'
import { M74 } from './data/m74'
import { M75 } from './data/m75'
import { M76 } from './data/m76'
import { M77 } from './data/m77'
import { M78 } from './data/m78'
import { M79 } from './data/m79'
import { M80 } from './data/m80'
import { M81 } from './data/m81'
import { M82 } from './data/m82'
import { M83 } from './data/m83'
import { M84 } from './data/m84'
import { M85 } from './data/m85'
import { M86 } from './data/m86'
import { M87 } from './data/m87'
import { M88 } from './data/m88'
import { M89 } from './data/m89'
import { M90 } from './data/m90'
import { M91 } from './data/m91'
import { M92 } from './data/m92'
import { M93 } from './data/m93'
import { M94 } from './data/m94'
import { M95 } from './data/m95'
import { M96 } from './data/m96'
import { M97 } from './data/m97'
import { M98 } from './data/m98'
import { M99 } from './data/m99'
import { M100 } from './data/m100'
import { M101 } from './data/m101'
import { M102 } from './data/m102'
import { M103 } from './data/m103'
import { M104 } from './data/m104'
import { M105 } from './data/m105'
import { M106 } from './data/m106'
import { M107 } from './data/m107'
import { M108 } from './data/m108'
import { M109 } from './data/m109'
import { M110 } from './data/m110'
import { M111 } from './data/m111'
import { M112 } from './data/m112'
import { M113 } from './data/m113'
import { M114 } from './data/m114'
import { M115 } from './data/m115'
import { M116 } from './data/m116'

const BOOKS: EnModel[] = [M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M15, M16, M17, M18, M19, M20, M21, M22, M23, M40, M41, M42, M43, M44, M45, M46, M47, M24, M25, M26, M27, M28, M29, M30, M31, M32, M33, M34, M35, M36, M37, M38, M39, M48, M49, M50, M51, M52, M53, M54, M55, M56, M57, M58, M59, M60, M61, M62, M63, M64, M65, M66, M67, M68, M69, M70, M71, M72, M73, M74, M75, M76, M77, M78, M79, M80, M81, M82, M83, M84, M85, M86, M87, M88, M89, M90, M91, M92, M93, M94, M95, M96, M97, M98, M99, M100, M101, M102, M103, M104, M105, M106, M107, M108, M109, M110, M111, M112, M113, M114, M115, M116]

/**
 * One name for all of them (asked for by the user on 23 November 2026): Model E.N. 1 … 31, in this order; where each
 * comes from (the book and its own name) is shown under it. The results of the students follow the id, not the name.
 */
const originOf = (m: EnModel, i: number) =>
  i < 9 ? 'culegerea de modele, ' + m.title.replace('Model E.N. ', 'modelul ') : i < 16 ? 'manualul „Matematică. Clasa a VIII-a”, ' + m.title.replace('Testul', 'testul') : 'culegerea ' + m.title.replace('Testul', 'testul')
export const BUILTIN: EnModel[] = BOOKS.map((m, i) => ({ ...m, title: `Model E.N. ${i + 1}`, origin: originOf(m, i) }))

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
