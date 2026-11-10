// Worksheets for the students: exercises made by the app (grades V–VIII) or kept in one's own bank, put together on a
// sheet with a title, the student and the date, and printed as PDF or Word, with the solutions on separate pages.
import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, readLocal, writeLocal } from '../db'
import MathText from '../components/MathText'
import { usePrompt } from '../components/PromptDialog'
import { saveDocx, savePdf, today } from '../export/exportDoc'
import { GENERATORS, LEVELS, type Grade, type Level } from './generators'
import { seeded } from './tex'
import { sheetPictures } from './worksheetExport'

export const SHEET_KEY = 'math-journal:worksheet'
export const BANK_KEY = 'math-journal:exercises'

/** Where an exercise on the sheet came from: made by a generator (and can be made again), or taken from the bank. */
type Source = { gen: string; level: Level; seed: number; form?: number } | { bank: string } | { own: true }

interface SheetItem { id: string; text: string; solution: string; source: Source; grade?: Grade }
interface Sheet {
  title: string; studentId: number | null; date: string; items: SheetItem[]; space: 0 | 1 | 2; solutions: boolean
  /** fingerprints of the last RECENT exercises made for this sheet, removed ones included, so that none comes again */
  recent?: string[]
}
interface BankItem { id: string; grade: Grade | null; text: string; solution: string; createdAt: number }

const SPACE: Record<Sheet['space'], { label: string; px: number }> = {
  0: { label: 'fără', px: 10 },
  1: { label: 'puțin', px: 90 },
  2: { label: 'mult', px: 200 },
}
const GRADE_NAMES: Record<Grade, string> = { 5: 'a V-a', 6: 'a VI-a', 7: 'a VII-a', 8: 'a VIII-a' }

const uid = () => Math.random().toString(36).slice(2, 10)
const newSeed = () => Math.floor(Math.random() * 2 ** 31)
const todayRo = () => new Date().toLocaleDateString('ro-RO')
const emptySheet = (): Sheet => ({ title: 'Fișă de lucru', studentId: null, date: todayRo(), items: [], space: 1, solutions: true })

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = readLocal(key)
    if (raw) return { ...fallback(), ...JSON.parse(raw) }
  } catch {
    /* unreadable: start afresh */
  }
  return fallback()
}

const make = (genId: string, level: Level, seed: number, form: number): SheetItem | null => {
  const g = GENERATORS.find((x) => x.id === genId)
  if (!g) return null
  const m = g.make(seeded(seed), level, form)
  return { id: uid(), text: m.text, solution: m.solution, source: { gen: genId, level, seed, form }, grade: g.grade }
}

/** How many of the last exercises made for a sheet are never repeated (asked for by the user on 10 November 2026). */
const RECENT = 100

/** A short fingerprint of a statement: the same exercise gives the same one, whatever its spacing. */
function fingerprint(text: string): string {
  let h = 0x811c9dc5
  for (const ch of text.replace(/\s+/g, ' ').trim()) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193)
  return (h >>> 0).toString(36)
}

/**
 * An exercise of a kind whose statement is not among `avoid`: new seeds for the chosen form first, then the other
 * forms. Null when none is found: the kind has no more different exercises at this level, and none is repeated.
 */
function makeFresh(genId: string, level: Level, form: number, avoid: Set<string>, onlyForm = false): SheetItem | null {
  const n = GENERATORS.find((x) => x.id === genId)?.forms(level) ?? 1
  const order = onlyForm ? [form] : [form, ...Array.from({ length: n }, (_, i) => i).filter((i) => i !== form)]
  for (const f of order) {
    for (let tries = 0; tries < (f === form ? 60 : 30); tries++) {
      const item = make(genId, level, newSeed(), f)
      if (!item) return null
      if (!avoid.has(fingerprint(item.text))) return item
    }
  }
  return null
}

/**
 * The next form of a kind for the sheet: one not used yet on it, if there is one, else the one used least.
 * So a sheet of one kind goes through all its forms before any comes again.
 */
function nextForm(genId: string, level: Level, used: SheetItem[]): number {
  const g = GENERATORS.find((x) => x.id === genId)
  const n = g?.forms(level) ?? 1
  const counts = Array.from({ length: n }, () => 0)
  for (const it of used) {
    if ('gen' in it.source && it.source.gen === genId && it.source.level === level && it.source.form != null && it.source.form < n) counts[it.source.form]++
  }
  const least = Math.min(...counts)
  const choices = counts.flatMap((c, i) => (c === least ? [i] : []))
  return choices[Math.floor(Math.random() * choices.length)]
}

export default function WorksheetsPage() {
  const [sheet, setSheet] = useState<Sheet>(() => load(SHEET_KEY, emptySheet))
  const [bank, setBank] = useState<BankItem[]>(() => load(BANK_KEY, () => ({ items: [] as BankItem[] })).items)
  useEffect(() => writeLocal(SHEET_KEY, JSON.stringify(sheet)), [sheet])
  useEffect(() => writeLocal(BANK_KEY, JSON.stringify({ items: bank })), [bank])
  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []) ?? []
  const student = students.find((s) => s.id === sheet.studentId)
  const { ask, confirm, dialog } = usePrompt()

  // ---------- making exercises ----------
  const [grade, setGrade] = useState<Grade>(8)
  const [level, setLevel] = useState<Level>(1)
  // only the kinds that have exercises at this level: the contest level has kinds of its own
  const ofGrade = useMemo(() => GENERATORS.filter((g) => g.grade === grade && g.forms(level) > 0), [grade, level])
  const [genId, setGenId] = useState<string>('mix')
  const [count, setCount] = useState(5)
  useEffect(() => setGenId((id) => (ofGrade.some((g) => g.id === id) ? id : 'mix')), [ofGrade])

  const generate = async () => {
    if (!ofGrade.length) return
    const made: SheetItem[] = []
    // no exercise comes twice on a sheet (asked for on 10 November 2026), nor one just taken off it with "↻ Altul"
    const avoid = new Set([...(sheet.recent ?? []), ...sheet.items.map((x) => fingerprint(x.text))])
    // every pattern (type and form) of the chosen types at this level, and how often each is on the sheet already:
    // the least used comes next, so that a pattern comes again only after all the others (the user saw the same
    // problem with other numbers twice on a contest sheet, 10 November 2026)
    const patterns = (genId === 'mix' ? ofGrade : ofGrade.filter((g) => g.id === genId))
      .flatMap((g) => Array.from({ length: g.forms(level) }, (_, f) => ({ id: g.id, f, used: 0 })))
    for (const it of sheet.items) {
      if (!('gen' in it.source) || it.source.level !== level) continue
      const src = it.source
      const p = patterns.find((x) => x.id === src.gen && x.f === src.form)
      if (p) p.used++
    }
    for (let i = 0; i < count; i++) {
      let item: SheetItem | null = null
      // the least used patterns first, in random order among equals; one with nothing new left gives its turn
      const order = [...patterns].sort((x, y) => x.used - y.used || Math.random() - 0.5)
      for (const p of order) {
        item = makeFresh(p.id, level, p.f, avoid, true)
        if (item) {
          p.used++
          break
        }
      }
      if (!item) continue
      made.push(item)
      avoid.add(fingerprint(item.text))
    }
    setSheet((s) => ({ ...s, items: [...s.items, ...made], recent: remember(s.recent, made) }))
    if (made.length < count) {
      await ask(`Am adăugat ${made.length} din ${count}: ${genId === 'mix' ? 'tipurile clasei nu mai au' : 'tipul ales nu mai are'}, la acest nivel, alte exerciții diferite de cele de pe fișă, iar exercițiile nu se repetă. Alege alt tip sau alt nivel pentru restul.`, '', true)
    }
  }
  /** The fingerprints of the last RECENT exercises, after adding `made`. */
  const remember = (recent: string[] | undefined, made: SheetItem[]) => [...(recent ?? []), ...made.map((x) => fingerprint(x.text))].slice(-RECENT)

  // ---------- the sheet ----------
  const patchItems = (f: (items: SheetItem[]) => SheetItem[]) => setSheet((s) => ({ ...s, items: f(s.items) }))
  /** Another exercise of the same kind and level, in a different form when there is one. */
  const another = (item: SheetItem) => {
    if (!('gen' in item.source)) return
    const { gen, level: lv, form } = item.source
    const others = sheet.items.filter((x) => x.id !== item.id)
    let f = nextForm(gen, lv, others)
    const n = GENERATORS.find((x) => x.id === gen)?.forms(lv) ?? 1
    if (n > 1 && f === form) f = (f + 1 + Math.floor(Math.random() * (n - 1))) % n
    const avoid = new Set([...(sheet.recent ?? []), ...sheet.items.map((x) => fingerprint(x.text))])
    const next = makeFresh(gen, lv, f, avoid)
    if (!next) return void ask('Tipul acesta nu mai are, la acest nivel, alt exercițiu diferit de cele de pe fișă.', '', true)
    setSheet((s) => ({ ...s, items: s.items.map((x) => (x.id === item.id ? { ...next, id: item.id } : x)), recent: remember(s.recent, [next]) }))
  }
  const clearAll = async () => {
    if (!sheet.items.length) return
    if (await confirm(`Scoți toate cele ${sheet.items.length} exerciții de pe fișă? Titlul, elevul și data rămân; exercițiile din bancă nu se ating.`, 'Golește lista')) {
      setSheet((s) => ({ ...s, items: [], recent: [] }))
    }
  }
  const move = (i: number, d: -1 | 1) => patchItems((items) => {
    const j = i + d
    if (j < 0 || j >= items.length) return items
    const out = [...items]
    ;[out[i], out[j]] = [out[j], out[i]]
    return out
  })
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setOpen((o) => {
    const n = new Set(o)
    if (n.has(id)) n.delete(id)
    else n.add(id)
    return n
  })

  // ---------- the bank ----------
  const [draft, setDraft] = useState<{ id: string | null; grade: Grade | null; text: string; solution: string } | null>(null)
  const [bankGrade, setBankGrade] = useState<Grade | 'all'>('all')
  const shown = bank.filter((b) => bankGrade === 'all' || b.grade === bankGrade)
  const saveDraft = () => {
    if (!draft || !draft.text.trim()) return
    const item: BankItem = { id: draft.id ?? uid(), grade: draft.grade, text: draft.text.trim(), solution: draft.solution.trim(), createdAt: Date.now() }
    setBank((b) => (draft.id ? b.map((x) => (x.id === draft.id ? { ...item, createdAt: x.createdAt } : x)) : [item, ...b]))
    setDraft(null)
  }
  const toBank = (item: SheetItem) => {
    setBank((b) => [{ id: uid(), grade: item.grade ?? null, text: item.text, solution: item.solution, createdAt: Date.now() }, ...b])
  }
  const fromBank = (b: BankItem) => patchItems((items) => [...items, { id: uid(), text: b.text, solution: b.solution, source: { bank: b.id }, grade: b.grade ?? undefined }])

  // ---------- printing ----------
  const [busy, setBusy] = useState(false)
  const exportAs = async (kind: 'pdf' | 'docx') => {
    if (!sheet.items.length) return void (await ask('Fișa este goală: adaugă întâi exerciții.', '', true))
    setBusy(true)
    try {
      const pages = await sheetPictures({
        title: sheet.title, student: student?.name ?? '', date: sheet.date,
        items: sheet.items, space: SPACE[sheet.space].px, solutions: sheet.solutions,
      })
      const name = `fisa-${(sheet.title || 'de-lucru').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${today()}`
      if (kind === 'pdf') await savePdf(pages, name + '.pdf')
      else await saveDocx(pages, name + '.docx', sheet.title, true)
    } catch (e) {
      await ask('Exportul nu a reușit: ' + (e as Error).message, '', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page worksheets">
      <div className="page-head">
        <div>
          <h1>Fișe de lucru</h1>
          <p className="muted">Exerciții generate pentru clasele V–VIII sau scrise de tine, puse pe o fișă și tipărite, cu rezolvările separat.</p>
        </div>
        <div className="ws-actions">
          <button className="btn" disabled={busy} onClick={() => exportAs('pdf')}>📄 PDF</button>
          <button className="btn" disabled={busy} onClick={() => exportAs('docx')} title="Paginile fișei, ca imagini, într-un document Word">📝 Word</button>
          <button className="btn danger" onClick={async () => {
            if (sheet.items.length && !(await confirm('Începi o fișă nouă? Exercițiile de pe fișa actuală se șterg; cele din bancă rămân.', 'Fișă nouă'))) return
            setSheet((s) => ({ ...emptySheet(), studentId: s.studentId }))
          }}>Fișă nouă</button>
        </div>
      </div>

      <div className="ws-grid">
        <div className="ws-side">
          <section className="card">
            <div className="card-title">Generează exerciții</div>
            <div className="ws-form">
              <label className="field">Clasa
                <select value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
                  {([5, 6, 7, 8] as Grade[]).map((g) => <option key={g} value={g}>{GRADE_NAMES[g]}{g === 8 ? ' (Evaluare Națională)' : ''}</option>)}
                </select>
              </label>
              <label className="field">Tipul
                <select value={genId} onChange={(e) => setGenId(e.target.value)}>
                  <option value="mix">Amestec din toată clasa</option>
                  {(['Algebră', 'Geometrie'] as const).map((t) => (
                    <optgroup key={t} label={t}>
                      {ofGrade.filter((g) => g.topic === t).map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
              <div className="field-row">
                <label className="field">Nivelul
                  <select value={level} onChange={(e) => setLevel(Number(e.target.value) as Level)}>
                    {([1, 2, 3, 4] as Level[]).map((l) => <option key={l} value={l}>{LEVELS[l]}</option>)}
                  </select>
                </label>
                <label className="field">Câte
                  <input type="number" min={1} max={RECENT} value={count} onChange={(e) => setCount(Math.max(1, Math.min(RECENT, Number(e.target.value) || 1)))} />
                </label>
              </div>
              <button className="btn primary" onClick={generate}>Adaugă pe fișă</button>
            </div>
          </section>

          <section className="card">
            <div className="ws-bank-head">
              <div className="card-title">Banca mea de exerciții</div>
              <button className="btn small" onClick={() => setDraft({ id: null, grade: grade, text: '', solution: '' })}>+ Exercițiu nou</button>
            </div>
            {draft && (
              <div className="ws-form ws-draft">
                <label className="field">Clasa
                  <select value={draft.grade ?? ''} onChange={(e) => setDraft({ ...draft, grade: e.target.value ? (Number(e.target.value) as Grade) : null })}>
                    <option value="">oricare</option>
                    {([5, 6, 7, 8] as Grade[]).map((g) => <option key={g} value={g}>{GRADE_NAMES[g]}</option>)}
                  </select>
                </label>
                <label className="field">Enunțul (formule între $…$)
                  <textarea rows={3} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} placeholder="Calculați: $\frac{2}{3} + \frac{1}{6}$." />
                </label>
                {draft.text.trim() && <MathText text={draft.text} className="ws-preview" />}
                <label className="field">Rezolvarea (opțional)
                  <textarea rows={3} value={draft.solution} onChange={(e) => setDraft({ ...draft, solution: e.target.value })} />
                </label>
                {draft.solution.trim() && <MathText text={draft.solution} className="ws-preview" />}
                <div className="ws-row">
                  <button className="btn primary small" disabled={!draft.text.trim()} onClick={saveDraft}>Salvează</button>
                  <button className="btn small" onClick={() => setDraft(null)}>Renunță</button>
                </div>
              </div>
            )}
            {bank.length > 0 && (
              <label className="field ws-filter">Arată
                <select value={bankGrade} onChange={(e) => setBankGrade(e.target.value === 'all' ? 'all' : (Number(e.target.value) as Grade))}>
                  <option value="all">toate ({bank.length})</option>
                  {([5, 6, 7, 8] as Grade[]).map((g) => <option key={g} value={g}>clasa {GRADE_NAMES[g]}</option>)}
                </select>
              </label>
            )}
            {!bank.length && !draft && <p className="muted small">Exercițiile pe care le scrii sau le salvezi de pe fișă rămân aici, ca să le folosești și la alți elevi.</p>}
            <ul className="ws-bank">
              {shown.map((b) => (
                <li key={b.id}>
                  <MathText text={b.text} />
                  <div className="ws-row">
                    {b.grade && <span className="ws-tag">cls. {GRADE_NAMES[b.grade]}</span>}
                    <button className="btn small" onClick={() => fromBank(b)}>Pe fișă</button>
                    <button className="btn small" onClick={() => setDraft({ id: b.id, grade: b.grade, text: b.text, solution: b.solution })}>Modifică</button>
                    <button className="btn small danger" onClick={async () => {
                      if (await confirm('Ștergi exercițiul din bancă?', 'Șterge')) setBank((all) => all.filter((x) => x.id !== b.id))
                    }}>Șterge</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="ws-sheet">
          <div className="ws-sheet-meta">
            <label className="field grow">Titlul
              <input value={sheet.title} onChange={(e) => setSheet({ ...sheet, title: e.target.value })} />
            </label>
            <label className="field">Elevul
              <select value={sheet.studentId ?? ''} onChange={(e) => setSheet({ ...sheet, studentId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">— spațiu liber pentru nume —</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <label className="field">Data
              <input value={sheet.date} onChange={(e) => setSheet({ ...sheet, date: e.target.value })} style={{ width: 110 }} />
            </label>
            <label className="field">Spațiu de lucru
              <select value={sheet.space} onChange={(e) => setSheet({ ...sheet, space: Number(e.target.value) as Sheet['space'] })}>
                {([0, 1, 2] as const).map((k) => <option key={k} value={k}>{SPACE[k].label}</option>)}
              </select>
            </label>
            <label className="ws-check"><input type="checkbox" checked={sheet.solutions} onChange={(e) => setSheet({ ...sheet, solutions: e.target.checked })} /> Rezolvările pe pagini separate</label>
          </div>

          {/* stays at the top while the list scrolls, so that a long sheet can be emptied from anywhere */}
          <div className="ws-listbar">
            <span>{sheet.items.length ? `${sheet.items.length} ${sheet.items.length === 1 ? 'exercițiu' : 'exerciții'} pe fișă` : 'Fișa e goală'}</span>
            <button className="btn small danger" disabled={!sheet.items.length} onClick={clearAll}>Golește lista</button>
          </div>
          <div className="ws-paper">
            <div className="ws-paper-title">{sheet.title || 'Fișă de lucru'}</div>
            <div className="ws-paper-meta"><span>Nume: {student ? <b>{student.name}</b> : <span className="ws-blank" />}</span><span>Data: {sheet.date}</span></div>
            {!sheet.items.length && <p className="muted ws-empty">Fișa e goală. Generează exerciții din stânga sau adaugă din banca ta.</p>}
            <ol className="ws-items">
              {sheet.items.map((item, i) => (
                <li key={item.id} className="ws-item">
                  <div className="ws-item-body">
                    <span className="ws-num">{i + 1}.</span>
                    <MathText text={item.text} />
                  </div>
                  <div className="ws-item-tools">
                    {'gen' in item.source && <button className="btn small" onClick={() => another(item)} title="Un alt exercițiu de același fel">↻ Altul</button>}
                    <button className="btn small" onClick={() => toggle(item.id)}>{open.has(item.id) ? 'Ascunde rezolvarea' : 'Rezolvarea'}</button>
                    <button className="btn small" disabled={i === 0} onClick={() => move(i, -1)} title="Mută mai sus" aria-label="Mută mai sus">↑</button>
                    <button className="btn small" disabled={i === sheet.items.length - 1} onClick={() => move(i, 1)} title="Mută mai jos" aria-label="Mută mai jos">↓</button>
                    {!('bank' in item.source) && <button className="btn small" onClick={() => toBank(item)} title="Păstrează exercițiul în banca ta, ca să-l folosești și la alți elevi">În bancă</button>}
                    <button className="btn small danger" onClick={() => patchItems((items) => items.filter((x) => x.id !== item.id))} title="Scoate exercițiul de pe fișă">✕ Scoate</button>
                  </div>
                  {open.has(item.id) && <MathText text={item.solution || '*Fără rezolvare.*'} className="ws-solution" />}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
      {dialog}
    </div>
  )
}
