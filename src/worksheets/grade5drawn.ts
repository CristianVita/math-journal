// The grade V exercises with drawings (number line, points and angles, shaded parts, charts, tables), from the photos
// of all the workbooks, written by several agents in grade5drawn1.ts… and gathered here (15 November 2026). Their
// kinds join existing ones (`joins`), or the kinds of drawings in DRAWN (generators.ts).
import type { Made } from './generators'
import type { Rng } from './tex'
import * as D1 from './grade5drawn1'
import * as D2 from './grade5drawn2'
import * as D3 from './grade5drawn3'
import * as D4 from './grade5drawn4'
import * as D5 from './grade5drawn5'
import * as D6 from './grade5drawn6'
import * as D7 from './grade5drawn7'

type Form = (rng: Rng) => Made
export interface DrawnKind { id: string; label: string; topic: 'Algebră' | 'Geometrie'; joins?: string; forms: Record<1 | 2 | 3, Form[]> }
export interface DrawnContest { id: string; label: string; forms: Form[] }

const ALL = [D1, D2, D3, D4, D5, D6, D7]
export const KINDS: DrawnKind[] = ALL.flatMap((d) => d.KINDS)
export const CONTEST: DrawnContest[] = ALL.flatMap((d) => d.CONTEST)
