import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, exportBackup, importBackup } from '../db'
import StudentForm from './StudentForm'
import { saveFile } from '../platform'

export default function StudentsSidebar({ selected, onSelect }: { selected?: number; onSelect: (id: number) => void }) {
  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []) ?? []
  const counts = useLiveQuery(async () => {
    const m = new Map<number, number>()
    await db.sessions.each((s) => m.set(s.studentId, (m.get(s.studentId) ?? 0) + 1))
    return m
  }, []) ?? new Map()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = students.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))

  const doExport = async () => {
    await saveFile(`jurnal-meditatii-${new Date().toISOString().slice(0, 10)}.json`, await exportBackup())
  }

  const doImport = async (f: File) => {
    if (!confirm('Importul înlocuiește toate datele actuale cu cele din backup. Continui?')) return
    try {
      await importBackup(await f.text())
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="sidebar-title">Elevi</div>
        <button className="btn primary small" onClick={() => setAdding(true)}>+ Elev</button>
      </div>
      <input className="search" placeholder="Caută elev…" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="student-list">
        {filtered.map((s) => (
          <button key={s.id} className={'student-item' + (s.id === selected ? ' active' : '')} onClick={() => onSelect(s.id!)}>
            <span className="avatar">{s.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</span>
            <span className="student-meta">
              <span className="student-name">{s.name}</span>
              <span className="muted small">{[s.grade && `cls. ${s.grade}`, s.goal].filter(Boolean).join(' · ') || '—'}</span>
            </span>
            <span className="count">{counts.get(s.id!) ?? 0}</span>
          </button>
        ))}
        {!students.length && <div className="empty muted">Niciun elev încă. Adaugă primul elev ca să începi jurnalul.</div>}
      </div>
      <div className="sidebar-foot">
        <button className="btn small" onClick={doExport} title="Salvează toate datele într-un fișier JSON">Backup</button>
        <button className="btn small" onClick={() => fileRef.current?.click()} title="Restaurează dintr-un fișier JSON">Restaurare</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
      </div>
      {adding && (
        <StudentForm
          onClose={() => setAdding(false)}
          onSaved={(id) => {
            setAdding(false)
            onSelect(id)
          }}
        />
      )}
    </aside>
  )
}
