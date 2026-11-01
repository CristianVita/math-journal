import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, newSession } from '../db'
import StudentForm from './StudentForm'
import { usePrompt } from '../components/PromptDialog'

const fmtDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })

export default function StudentView({ studentId, onOpenSession, onDeleted }: {
  studentId: number
  onOpenSession: (id: number) => void
  onDeleted: () => void
}) {
  const student = useLiveQuery(() => db.students.get(studentId), [studentId])
  const sessions = useLiveQuery(
    () => db.sessions.where('studentId').equals(studentId).toArray().then((l) => l.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)),
    [studentId],
  ) ?? []
  const [editing, setEditing] = useState(false)
  const [topicFilter, setTopicFilter] = useState('')
  const { confirm, dialog } = usePrompt()

  if (!student) return null

  const totalMin = sessions.reduce((s, x) => s + (x.durationMin || 0), 0)
  const withHw = sessions.filter((s) => s.homework.trim())
  const hwDone = withHw.filter((s) => s.homeworkDone).length
  const avgRating = sessions.length ? sessions.reduce((s, x) => s + x.rating, 0) / sessions.length : 0
  const topics = [...new Set(sessions.flatMap((s) => s.topics))]
  const shown = topicFilter ? sessions.filter((s) => s.topics.includes(topicFilter)) : sessions

  const create = async () => onOpenSession(await db.sessions.add(newSession(studentId)))

  const remove = async () => {
    if (!(await confirm(`Ștergi elevul ${student.name} și toate cele ${sessions.length} ședințe ale lui?`, 'Șterge elevul'))) return
    await db.transaction('rw', db.students, db.sessions, async () => {
      await db.sessions.where('studentId').equals(studentId).delete()
      await db.students.delete(studentId)
    })
    onDeleted()
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{student.name}</h1>
          <div className="muted">{[student.grade && `Clasa ${student.grade}`, student.goal, student.contact].filter(Boolean).join(' · ')}</div>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => setEditing(true)}>Editează</button>
          <button className="btn danger" onClick={remove}>Șterge</button>
          <button className="btn primary" onClick={create}>+ Ședință nouă</button>
        </div>
      </div>
      {student.notes && <div className="card note">{student.notes}</div>}

      <div className="stats">
        <div className="stat"><div className="stat-v">{sessions.length}</div><div className="stat-l">ședințe</div></div>
        <div className="stat"><div className="stat-v">{(totalMin / 60).toFixed(1)}</div><div className="stat-l">ore</div></div>
        <div className="stat"><div className="stat-v">{withHw.length ? Math.round((hwDone / withHw.length) * 100) + '%' : '—'}</div><div className="stat-l">teme făcute</div></div>
        <div className="stat"><div className="stat-v">{sessions.length ? avgRating.toFixed(1) : '—'}</div><div className="stat-l">evaluare medie</div></div>
      </div>

      {topics.length > 0 && (
        <div className="chips">
          <button className={'chip' + (!topicFilter ? ' active' : '')} onClick={() => setTopicFilter('')}>Toate</button>
          {topics.map((t) => (
            <button key={t} className={'chip' + (t === topicFilter ? ' active' : '')} onClick={() => setTopicFilter(t)}>{t}</button>
          ))}
        </div>
      )}

      <div className="session-list">
        {shown.map((s) => (
          <button key={s.id} className="session-item" onClick={() => onOpenSession(s.id!)}>
            <div className="session-date">{fmtDate(s.date)} <span className="muted">· {s.durationMin} min</span></div>
            <div className="session-topics">
              {s.topics.map((t) => <span key={t} className="tag">{t}</span>)}
              {!s.topics.length && <span className="muted">fără subiecte</span>}
            </div>
            <div className="session-preview muted">{s.notes.replace(/\$+/g, '').slice(0, 140) || 'Fără notițe'}</div>
            <div className="session-flags">
              <span title="Evaluare">{'★'.repeat(s.rating)}{'☆'.repeat(5 - s.rating)}</span>
              {s.homework.trim() && <span className={'hw ' + (s.homeworkDone ? 'done' : '')}>{s.homeworkDone ? 'temă făcută' : 'temă de verificat'}</span>}
              {s.drawings.length > 0 && <span className="muted">{s.drawings.length} desen(e)</span>}
            </div>
          </button>
        ))}
        {!sessions.length && <div className="empty muted">Nicio ședință încă. Apasă „Ședință nouă” pentru prima intrare în jurnal.</div>}
      </div>
      {editing && <StudentForm student={student} onClose={() => setEditing(false)} onSaved={() => setEditing(false)} />}
      {dialog}
    </div>
  )
}
