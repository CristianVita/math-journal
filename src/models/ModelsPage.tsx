// "Modele E.N.": the national evaluation models (grade VIII) of the book, and the ones the user adds, shown as in the
// book, printed as a test with the answer key apart, marked as done by a student with the score, and taken
// exercise by exercise onto the worksheet (12 November 2026, asked for by the user).
import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import MathText from '../components/MathText'
import { usePrompt } from '../components/PromptDialog'
import { saveDocx, savePdf, today } from '../export/exportDoc'
import type { SheetItem } from '../worksheets/WorksheetsPage'
import { brokenFormulas, spacedLines, splitExercises } from '../worksheets/fromPhoto'
import { isDesktop } from '../platform'
import katex from 'katex'
import { figureSvg } from './figure'
import { itemHtml, modelPictures, subjectHtml } from './modelExport'
import { BUILTIN, loadOwn, loadResults, saveOwn, saveResults, type EnResult } from './store'
import { answerText, answeredBy, itemText, startsSubject, subjectOf, type EnModel } from './types'
import RecapView from './RecapView'
import { bookItem, bookKey, generateModel, GEN_KINDS, makeItem, seenBy, type GenKind } from './generated'
import { seeded } from '../worksheets/tex'
import { addSimilar, appendToSheet } from './sheet'

const katexCheck = (tex: string, display: boolean) => { katex.renderToString(tex, { throwOnError: true, displayMode: display }) }
const uid = () => Math.random().toString(36).slice(2, 10)
const todayRo = () => new Date().toLocaleDateString('ro-RO')

/** What the free chat is asked, with a photo of a model from a book. */
export const MODEL_PROMPT = `Transcrie modelul de test pentru Evaluarea Națională din poze, exact cum este scris, în limba română.

Reguli:
- Scrie tot răspunsul într-un singur bloc de cod (între \`\`\` și \`\`\`), ca să se poată copia exact.
- Sunt 18 exerciții (Subiectele I, II și III). Separă exercițiile printr-un rând care conține doar ---
- Nu scrie numărul exercițiului, nici punctajele (5p, 2p, 3p) și nici titlurile subiectelor.
- La Subiectele I și II, variantele de răspuns pe un singur rând, după enunț: a) … b) … c) … d) …
- La Subiectul III, subpunctele a) și b), fiecare pe rândul lui.
- Formulele le scrii în LaTeX: $...$ în text și $$...$$ pentru o formulă pe rândul ei. Unghiul se scrie \\sphericalangle, virgula zecimală {,} (de exemplu $2{,}5$).
- Cuvintele, cu diacritice, rămân în afara formulelor; nu folosi \\text{} cu diacritice.
- Unde exercițiul are o figură, scrie [figura din carte] la sfârșitul enunțului.
- Nu rezolva exercițiile și nu adăuga comentarii sau explicații.
- Dacă o parte din poză nu se citește, scrie [ilizibil] în locul ei.`

export default function ModelsPage() {
  // the generated models before 23 November 2026 were all called "Model generat (date)": they get numbers
  const [own, setOwn] = useState<EnModel[]>(() => {
    let k = 0
    return loadOwn().map((m) => (m.generated ? { ...m, title: `Model generat ${++k}` } : m))
  })
  const [results, setResults] = useState<EnResult[]>(loadResults)
  useEffect(() => saveOwn(own), [own])
  useEffect(() => saveResults(results), [results])
  const models = useMemo(() => [...BUILTIN, ...own], [own])
  const [modelId, setModelId] = useState(models[0]?.id ?? '')
  const model = models.find((m) => m.id === modelId) ?? models[0]
  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []) ?? []
  const [studentId, setStudentId] = useState<number | null>(null)
  const student = students.find((s) => s.id === studentId)
  const [showBarem, setShowBarem] = useState(false)
  const [view, setView] = useState<'models' | 'recap'>('models')
  const { ask, confirm, dialog } = usePrompt()
  const [flash, setFlash] = useState('')
  // in a generated model, another exercise of the same kind takes this one's place; one of a book, another of a book
  // from the same place
  const anotherHere = (i: number) => {
    const it = model?.items[i]
    if (!model || !(it?.gen || it?.book)) return
    const seed = Math.floor(Math.random() * 1e9)
    const next = it.book ? bookItem(i, seeded(seed), it.book.model, model.studentId != null ? seenBy(model.studentId, own, results) : undefined) : makeItem(it.gen!.id, it.gen!.level as 1 | 2 | 3, seed)
    setOwn((o) => o.map((m) => (m.id === model.id ? { ...m, items: m.items.map((x, j) => (j === i ? next : x)) } : m)))
    if (next.book) setFlash(`Exercițiul ${i + 1} e acum din ${next.book.title}, exercițiul ${next.book.n}.`)
  }
  const [genKind, setGenKind] = useState<GenKind>('books')
  const newGenerated = () => {
    const n = Math.max(0, ...own.filter((x) => x.generated).map((x) => Number(x.title.match(/\d+$/)?.[0]) || 0)) + 1
    const seen = studentId != null ? seenBy(studentId, own, results) : undefined
    const m = generateModel(Math.floor(Math.random() * 1e9), new Date(), n, genKind, seen)
    if (studentId != null) m.studentId = studentId
    const again = m.items.filter((it) => it.book && seen?.has(bookKey(it.book.model, it.book.n))).length
    if (again) setFlash(`${student?.name ?? 'Elevul'} a primit deja toate exercițiile din cărți de pe unele locuri: ${again} din model se repetă.`)
    setOwn((o) => [...o, m])
    setModelId(m.id)
  }
  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(''), 5000)
    return () => clearTimeout(t)
  }, [flash])

  const madeFor = (m: EnModel) => (m.studentId != null ? students.find((s) => s.id === m.studentId)?.name : undefined)

  // ---------- results ----------
  const done = (mId: string) => results.filter((r) => r.studentId === studentId && r.modelId === mId)
  const [score, setScore] = useState('')
  const mark = () => {
    if (studentId == null || !model) return
    const n = score.trim() === '' ? null : Number(score.replace(',', '.'))
    if (n != null && !(n >= 10 && n <= 100)) return void ask('Punctajul e între 10 și 100 (cu cele 10 din oficiu). Lasă-l gol dacă nu l-ai corectat încă.', '', true)
    setResults((rs) => [...rs, { id: uid(), studentId, modelId: model.id, date: todayRo(), score: n }])
    setScore('')
  }

  // ---------- onto the worksheet ----------
  const toSheet = (indexes: number[]) => {
    if (!model) return
    const made: SheetItem[] = indexes.map((i) => {
      const item = model.items[i]
      return { id: uid(), text: itemText(item), solution: answerText(item), source: { model: model.id, n: i + 1 }, grade: 8, figure: item.fig ? figureSvg(item.fig) : undefined }
    })
    appendToSheet(made)
    setFlash(made.length === 1 ? `Exercițiul ${indexes[0] + 1} e pe fișă (pagina Fișe).` : `${made.length} exerciții sunt pe fișă (pagina Fișe).`)
  }

  // ---------- printing ----------
  const [busy, setBusy] = useState(false)
  const [withBarem, setWithBarem] = useState(true)
  const exportAs = async (kind: 'pdf' | 'docx') => {
    if (!model) return
    setBusy(true)
    try {
      const pages = await modelPictures(model, { student: student?.name ?? '', date: todayRo(), barem: withBarem })
      const name = `${model.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${today()}`
      if (kind === 'pdf') await savePdf(pages, name + '.pdf')
      else await saveDocx(pages, name + '.docx', model.title, true)
    } catch (e) {
      await ask('Exportul nu a reușit: ' + (e as Error).message, '', true)
    } finally {
      setBusy(false)
    }
  }

  // ---------- adding a model from photos, through the free chat ----------
  const [adding, setAdding] = useState<{ title: string; raw: string; items: string[] } | null>(null)
  const [copied, setCopied] = useState<'yes' | 'no' | null>(null)
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(MODEL_PROMPT)
      setCopied('yes')
    } catch {
      setCopied('no')
    }
  }
  const saveAdded = () => {
    if (!adding?.items.length) return
    const m: EnModel = { id: 'own-' + uid(), title: adding.title.trim() || 'Model E.N.', source: 'adăugat de tine', own: true, items: adding.items.map((text) => ({ text })) }
    setOwn((o) => [...o, m])
    setModelId(m.id)
    setAdding(null)
    setCopied(null)
  }
  const removeOwn = async (m: EnModel) => {
    if (!(await confirm(`Ștergi „${m.title}”? Rezultatele elevilor la el se șterg și ele.`, 'Șterge'))) return
    setOwn((o) => o.filter((x) => x.id !== m.id))
    setResults((rs) => rs.filter((r) => r.modelId !== m.id))
    setModelId(BUILTIN[0]?.id ?? '')
  }

  // the book's recap exercises, on the same page (13 November 2026)
  const tabs = (
    <div className="en-tabs">
      <button className={'en-tab' + (view === 'models' ? ' active' : '')} onClick={() => setView('models')}>Modele E.N.</button>
      <button className={'en-tab' + (view === 'recap' ? ' active' : '')} onClick={() => setView('recap')}>Recapitulare</button>
    </div>
  )
  if (view === 'recap') return <RecapView tabs={tabs} />

  return (
    <div className="page models">
      <div className="page-head">
        <div>
          {tabs}
          <p className="muted">Modele de teste pentru Evaluarea Națională (clasa a VIII-a), ca în culegere: tipărite cu baremul separat, bifate pe elev, sau luate exercițiu cu exercițiu pe fișă.</p>
        </div>
        <div className="ws-actions">
          <label className="ws-check"><input type="checkbox" checked={withBarem} onChange={(e) => setWithBarem(e.target.checked)} /> Baremul la final</label>
          <button className="btn" disabled={busy || !model} onClick={() => exportAs('pdf')}>📄 PDF</button>
          <button className="btn" disabled={busy || !model} onClick={() => exportAs('docx')} title="Paginile modelului, ca imagini, într-un document Word">📝 Word</button>
        </div>
      </div>

      <div className="ws-grid">
        <div className="ws-side">
          <section className="card">
            <label className="field">Elevul
              <select value={studentId ?? ''} onChange={(e) => setStudentId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">— niciunul —</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <ul className="en-list">
              {models.map((m) => {
                const d = done(m.id)
                const last = d[d.length - 1]
                return (
                  <li key={m.id}>
                    <button className={'en-list-item' + (m.id === model?.id ? ' active' : '')} onClick={() => setModelId(m.id)}>
                      <span>{m.title}{m.origin && <span className="en-origin">{m.origin}</span>}{madeFor(m) && <span className="en-origin">pentru {madeFor(m)}</span>}</span>
                      {last && <span className="en-done" title={d.map((r) => `${r.date}${r.score != null ? `: ${r.score} p` : ''}`).join('\n')}>✓ {last.score != null ? `${last.score} p` : last.date}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="card">
            <div className="ws-bank-head">
              <div className="card-title">Model generat</div>
              <button className="btn small primary" onClick={newGenerated}>Generează un model</button>
            </div>
            <label className="field">Exercițiile
              <select value={genKind} onChange={(e) => setGenKind(e.target.value as GenKind)}>
                {GEN_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </label>
            <p className="muted small">
              {genKind === 'books' ? 'Un test nou, ca la Evaluarea Națională: fiecare exercițiu e cel de pe același loc dintr-un model din cărți, ales la întâmplare, cu variantele, punctajele, baremul și figura lui.'
                : genKind === 'mix' ? 'Un test nou, ca la Evaluarea Națională: cam jumătate din exerciții din modelele din cărți (de pe același loc), restul noi, din exercițiile aplicației.'
                : 'Un test nou, ca la Evaluarea Națională, din exercițiile aplicației, cu rezolvările ca barem.'} Rămâne în listă până îl ștergi.
              {genKind !== 'new' && (student ? ` Ocolește exercițiile din cărți primite deja de ${student.name}.` : ' Alege întâi elevul, ca să nu i se repete exercițiile din cărți.')}
            </p>
          </section>

          <section className="card">
            <div className="ws-bank-head">
              <div className="card-title">Adaugă un model</div>
              {!adding && <button className="btn small" onClick={() => setAdding({ title: `Model E.N. ${models.length + 1}`, raw: '', items: [] })}>Începe</button>}
            </div>
            {!adding && <p className="muted small">Din pozele unui model din culegere, prin chatul gratuit claude.ai. Figurile nu se desenează; pentru ele, trimite pozele în conversația cu Claude Code.</p>}
            {adding && (
              <div className="ws-form ws-photo">
                <label className="field">Titlul
                  <input value={adding.title} onChange={(e) => setAdding({ ...adding, title: e.target.value })} />
                </label>
                <ol className="ws-steps">
                  <li>
                    <button className="btn small" onClick={copyPrompt}>{copied === 'yes' ? '✓ Instrucțiuni copiate' : 'Copiază instrucțiunile'}</button>
                    {copied === 'no' && <textarea readOnly rows={4} value={MODEL_PROMPT} onFocus={(e) => e.target.select()} title="Selectează și copiază (Ctrl+C)" />}
                  </li>
                  <li>Deschide {isDesktop() ? <b>claude.ai</b> : <a href="https://claude.ai/new" target="_blank" rel="noreferrer">claude.ai</a>}, atașează pozele modelului și lipește instrucțiunile.</li>
                  <li>Copiază răspunsul și lipește-l aici:</li>
                </ol>
                <textarea rows={4} value={adding.raw} placeholder="Răspunsul din chat…" onChange={(e) => setAdding({ ...adding, raw: e.target.value, items: splitExercises(e.target.value) })} />
                {adding.items.length > 0 && (
                  <p className={'small ' + (adding.items.length === 18 ? 'muted' : 'ws-photo-warn')}>
                    {adding.items.length} {adding.items.length === 1 ? 'exercițiu găsit' : 'exerciții găsite'}{adding.items.length !== 18 ? ' (un model are 18)' : ''}. Verifică-le cu pozele; ce e greșit se corectează în căsuța de sub el.
                  </p>
                )}
                {adding.items.map((t, i) => {
                  const bad = brokenFormulas(t, katexCheck)
                  return (
                    <div key={i} className="ws-photo-item">
                      <div className="ws-row">
                        <span className="ws-num">{i + 1}.</span>
                        <MathText text={spacedLines(t)} className="ws-preview ws-spaced" />
                        <button className="btn small danger" title="Scoate exercițiul" onClick={() => setAdding({ ...adding, items: adding.items.filter((_, j) => j !== i) })}>✕</button>
                      </div>
                      {bad.length > 0 && <div className="ws-photo-warn">O formulă nu se poate afișa: <code>{bad[0]}</code></div>}
                      <textarea rows={Math.min(6, t.split('\n').length + 1)} value={t} onChange={(e) => setAdding({ ...adding, items: adding.items.map((x, j) => (j === i ? e.target.value : x)) })} />
                    </div>
                  )
                })}
                <div className="ws-row">
                  <button className="btn primary small" disabled={!adding.items.length} onClick={saveAdded}>Salvează modelul</button>
                  <button className="btn small" onClick={() => { setAdding(null); setCopied(null) }}>Închide</button>
                </div>
              </div>
            )}
          </section>
        </div>

        {model && (
          <section className="ws-sheet">
            <div className="ws-listbar en-bar">
              {studentId != null ? (
                <span className="en-mark">
                  {student?.name}: punctaj <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="din 100" style={{ width: 70 }} />
                  <button className="btn small primary" onClick={mark}>Notează rezolvat</button>
                </span>
              ) : <span className="muted small">Alege un elev ca să notezi modelul ca rezolvat.</span>}
              <span className="en-bar-right">
                <label className="ws-check"><input type="checkbox" checked={showBarem} onChange={(e) => setShowBarem(e.target.checked)} /> Arată baremul</label>
                <button className="btn small" onClick={() => toSheet(model.items.map((_, i) => i))}>Tot modelul pe fișă</button>
                {model.own && <button className="btn small danger" onClick={() => removeOwn(model)}>Șterge modelul</button>}
              </span>
            </div>
            {flash && <div className="en-flash">{flash}</div>}
            {studentId != null && done(model.id).length > 0 && (
              <div className="en-history">
                {done(model.id).map((r) => (
                  <span key={r.id} className="ws-tag">
                    {r.date}{r.score != null ? ` · ${r.score} p` : ''}
                    <button className="en-x" title="Șterge notarea" onClick={() => setResults((rs) => rs.filter((x) => x.id !== r.id))}>✕</button>
                  </span>
                ))}
              </div>
            )}
            <div className="ws-paper en-paper">
              <div className="ws-paper-title">{model.title}</div>
              <div className="muted small en-source">{model.origin ? `${model.origin} · ` : ''}{model.source}</div>
              {model.items.map((item, i) => (
                <div key={i}>
                  {startsSubject(i, model.starts) && <div dangerouslySetInnerHTML={{ __html: subjectHtml(subjectOf(i, model.starts), model.own, answeredBy(model, subjectOf(i, model.starts))) }} />}
                  <div className="en-row">
                    <div dangerouslySetInnerHTML={{ __html: itemHtml(item, i, showBarem, model.starts) }} />
                    <span className="en-tosheet">
                      <button className="btn small" onClick={() => toSheet([i])} title="Pune exercițiul pe fișa de lucru">Pe fișă</button>
                      <button className="btn small" onClick={() => (model.generated && (item.gen || item.book) ? anotherHere(i) : setFlash(addSimilar(itemText(item))))} title={model.generated && item.book ? 'Schimbă exercițiul cu cel de pe același loc dintr-un alt model din cărți' : model.generated ? 'Schimbă exercițiul cu altul nou, de același fel' : 'Pune pe fișă un exercițiu nou, generat, de același fel'}>Încă unul la fel</button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      {dialog}
    </div>
  )
}
