// The "Recapitulare" half of the Modele E.N. page: the book's recap exercises by chapter, with the answers on request,
// taken onto the worksheet one by one or a chapter at a time, or printed with the answers on a last page.
import { useEffect, useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { usePrompt } from '../components/PromptDialog'
import { saveDocx, savePdf, today } from '../export/exportDoc'
import type { SheetItem } from '../worksheets/WorksheetsPage'
import { addSimilar, appendToSheet } from './sheet'
import { figureSvg } from './figure'
import { recapAnswer, recapItemHtml, recapPictures, recapText } from './recap'
import { RECAP8 } from './data/recap8'

const uid = () => Math.random().toString(36).slice(2, 10)
const todayRo = () => new Date().toLocaleDateString('ro-RO')

export default function RecapView({ tabs }: { tabs: ReactNode }) {
  const recap = RECAP8
  const [sectionId, setSectionId] = useState(recap.sections[0].id)
  const section = recap.sections.find((s) => s.id === sectionId) ?? recap.sections[0]
  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []) ?? []
  const [studentId, setStudentId] = useState<number | null>(null)
  const student = students.find((s) => s.id === studentId)
  const [showAns, setShowAns] = useState(false)
  const [withAns, setWithAns] = useState(true)
  const [busy, setBusy] = useState(false)
  const { ask, dialog } = usePrompt()
  const [flash, setFlash] = useState('')
  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(''), 5000)
    return () => clearTimeout(t)
  }, [flash])

  const toSheet = (indexes: number[]) => {
    const made: SheetItem[] = indexes.map((i) => {
      const item = section.items[i]
      return { id: uid(), text: recapText(item), solution: recapAnswer(item), source: { model: `${recap.id}-${section.id}`, n: i + 1 }, grade: 8, figure: item.fig ? figureSvg(item.fig) : undefined }
    })
    appendToSheet(made)
    setFlash(made.length === 1 ? `Exercițiul ${indexes[0] + 1} e pe fișă (pagina Fișe).` : `${made.length} exerciții sunt pe fișă (pagina Fișe).`)
  }

  const exportAs = async (kind: 'pdf' | 'docx') => {
    setBusy(true)
    try {
      const pages = await recapPictures(recap, section, { student: student?.name ?? '', date: todayRo(), answers: withAns })
      const name = `recapitulare-${section.id}-${today()}`
      if (kind === 'pdf') await savePdf(pages, name + '.pdf')
      else await saveDocx(pages, name + '.docx', `${recap.title} — ${section.title}`, true)
    } catch (e) {
      await ask('Exportul nu a reușit: ' + (e as Error).message, '', true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page models">
      <div className="page-head">
        <div>
          {tabs}
          <p className="muted">Exercițiile recapitulative de la finalul culegerii de clasa a VIII-a, pe capitole, cu răspunsurile cărții: luate pe fișă sau tipărite.</p>
        </div>
        <div className="ws-actions">
          <label className="ws-check"><input type="checkbox" checked={withAns} onChange={(e) => setWithAns(e.target.checked)} /> Răspunsurile la final</label>
          <button className="btn" disabled={busy} onClick={() => exportAs('pdf')}>📄 PDF</button>
          <button className="btn" disabled={busy} onClick={() => exportAs('docx')} title="Paginile capitolului, ca imagini, într-un document Word">📝 Word</button>
        </div>
      </div>

      <div className="ws-grid">
        <div className="ws-side">
          <section className="card">
            <label className="field">Elevul (pentru numele de pe foaie)
              <select value={studentId ?? ''} onChange={(e) => setStudentId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">— niciunul —</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <ul className="en-list">
              {recap.sections.map((s) => (
                <li key={s.id}>
                  <button className={'en-list-item' + (s.id === section.id ? ' active' : '')} onClick={() => setSectionId(s.id)}>
                    <span>{s.title}</span>
                    <span className="muted small">{s.items.length} ex.</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="ws-sheet">
          <div className="ws-listbar en-bar">
            <span className="muted small">„Pe fișă” apare când treci cu mouse-ul peste un exercițiu.</span>
            <span className="en-bar-right">
              <label className="ws-check"><input type="checkbox" checked={showAns} onChange={(e) => setShowAns(e.target.checked)} /> Arată răspunsurile</label>
              <button className="btn small" onClick={() => toSheet(section.items.map((_, i) => i))}>Tot capitolul pe fișă</button>
            </span>
          </div>
          {flash && <div className="en-flash">{flash}</div>}
          <div className="ws-paper en-paper">
            <div className="ws-paper-title">{section.title}</div>
            <div className="muted small en-source">{recap.source}</div>
            {section.items.map((item, i) => (
              <div key={i} className="en-row">
                <div dangerouslySetInnerHTML={{ __html: recapItemHtml(item, i + 1, showAns) }} />
                <span className="en-tosheet">
                  <button className="btn small" onClick={() => toSheet([i])} title="Pune exercițiul pe fișa de lucru">Pe fișă</button>
                  <button className="btn small" onClick={() => setFlash(addSimilar(recapText(item)))} title="Pune pe fișă un exercițiu nou, generat, de același fel">Încă unul la fel</button>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      {dialog}
    </div>
  )
}
