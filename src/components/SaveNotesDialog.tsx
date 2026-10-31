import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, newSession } from '../db'

/** Append a block of Markdown (with LaTeX) to the notes of a chosen session. */
export default function SaveNotesDialog({ markdown, onClose }: { markdown: string; onClose: () => void }) {
  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []) ?? []
  const [studentId, setStudentId] = useState<number | ''>('')
  const sessions = useLiveQuery(
    async () => (studentId === '' ? [] : (await db.sessions.where('studentId').equals(studentId).toArray()).sort((a, b) => b.date.localeCompare(a.date))),
    [studentId],
  ) ?? []
  const [sessionId, setSessionId] = useState<number | 'new' | ''>('')
  const [done, setDone] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (studentId === '' || sessionId === '') return
    if (sessionId === 'new') await db.sessions.add({ ...newSession(studentId), notes: markdown })
    else {
      const s = await db.sessions.get(sessionId)
      if (s) await db.sessions.put({ ...s, notes: s.notes.trim() ? `${s.notes.trimEnd()}\n\n${markdown}` : markdown, updatedAt: Date.now() })
    }
    setDone(true)
    setTimeout(onClose, 900)
  }

  return (
    <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={save}>
        <div className="modal-title">Adaugă în notițele unei ședințe</div>
        {!students.length && <div className="muted">Adaugă întâi un elev în Jurnal.</div>}
        <label className="field">Elev
          <select value={studentId} onChange={(e) => { setStudentId(e.target.value ? Number(e.target.value) : ''); setSessionId('') }} required>
            <option value="">— alege —</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="field">Ședință
          <select value={sessionId} onChange={(e) => setSessionId(e.target.value === 'new' ? 'new' : e.target.value ? Number(e.target.value) : '')} required disabled={studentId === ''}>
            <option value="">— alege —</option>
            <option value="new">+ Ședință nouă (azi)</option>
            {sessions.map((s) => <option key={s.id} value={s.id}>{s.date} {s.topics.length ? '· ' + s.topics.join(', ') : ''}</option>)}
          </select>
        </label>
        <div className="modal-actions">
          {done && <span className="save-state ok">✓ Adăugat</span>}
          <button type="button" className="btn" onClick={onClose}>Renunță</button>
          <button type="submit" className="btn primary">Adaugă</button>
        </div>
      </form>
    </div>
  )
}
