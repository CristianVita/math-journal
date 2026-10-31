import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import GeometryBoard from '../geometry/GeometryBoard'
import type { Scene } from '../geometry/types'
import { uid } from '../geometry/engine'
import { db, newSession } from '../db'

/** Free whiteboard; its scene lives in App so other pages (triangle solver) can open figures here. */
export default function BoardPage({ scene, onChange }: { scene: Scene; onChange: (s: Scene) => void }) {
  const [saving, setSaving] = useState(false)
  return (
    <div className="page board-page">
      <div className="page-head">
        <div>
          <h1>Tablă</h1>
          <div className="muted">Construcții geometrice, unghiuri, drepte, figuri și grafice de funcții.</div>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => setSaving(true)} disabled={!scene.objects.length}>Salvează în jurnal</button>
        </div>
      </div>
      <GeometryBoard scene={scene} onChange={onChange} height="calc(100vh - 210px)" />
      {saving && <SaveToSession scene={scene} onClose={() => setSaving(false)} />}
    </div>
  )
}

function SaveToSession({ scene, onClose }: { scene: Scene; onClose: () => void }) {
  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []) ?? []
  const [studentId, setStudentId] = useState<number | ''>('')
  const sessions = useLiveQuery(
    async () => (studentId === '' ? [] : (await db.sessions.where('studentId').equals(studentId).toArray()).sort((a, b) => b.date.localeCompare(a.date))),
    [studentId],
  ) ?? []
  const [sessionId, setSessionId] = useState<number | 'new' | ''>('')
  const [title, setTitle] = useState('Figură de pe tablă')
  const [done, setDone] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (studentId === '' || sessionId === '') return
    const drawing = { id: uid(), title, scene: structuredClone(scene) }
    if (sessionId === 'new') await db.sessions.add({ ...newSession(studentId), drawings: [drawing] })
    else {
      const s = await db.sessions.get(sessionId)
      if (s) await db.sessions.put({ ...s, drawings: [...s.drawings, drawing], updatedAt: Date.now() })
    }
    setDone(true)
    setTimeout(onClose, 900)
  }

  return (
    <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={save}>
        <div className="modal-title">Salvează figura într-o ședință</div>
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
        <label className="field">Titlu<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <div className="modal-actions">
          {done && <span className="save-state ok">✓ Salvat</span>}
          <button type="button" className="btn" onClick={onClose}>Renunță</button>
          <button type="submit" className="btn primary">Salvează</button>
        </div>
      </form>
    </div>
  )
}
