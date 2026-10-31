import { useState } from 'react'
import { db, type Student } from '../db'

export default function StudentForm({ student, onClose, onSaved }: {
  student?: Student
  onClose: () => void
  onSaved: (id: number) => void
}) {
  const [s, setS] = useState<Student>(
    student ?? { name: '', grade: '', goal: '', contact: '', notes: '', createdAt: Date.now() },
  )
  const set = (k: keyof Student) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setS({ ...s, [k]: e.target.value })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!s.name.trim()) return
    const id = await db.students.put({ ...s, name: s.name.trim() })
    onSaved(id)
  }

  return (
    <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={save}>
        <div className="modal-title">{student ? 'Editează elevul' : 'Elev nou'}</div>
        <label className="field">Nume<input autoFocus value={s.name} onChange={set('name')} required /></label>
        <div className="field-row">
          <label className="field">Clasa<input value={s.grade} onChange={set('grade')} placeholder="ex: a XI-a" /></label>
          <label className="field">Obiectiv<input value={s.goal} onChange={set('goal')} placeholder="ex: Bac M1, Evaluare Națională" list="goals" /></label>
        </div>
        <datalist id="goals">
          <option value="Evaluare Națională" />
          <option value="Bacalaureat M1 (mate-info)" />
          <option value="Bacalaureat M2 (științele naturii)" />
          <option value="Olimpiadă" />
          <option value="Admitere facultate" />
          <option value="Recuperare / consolidare" />
        </datalist>
        <label className="field">Contact (părinte / telefon)<input value={s.contact} onChange={set('contact')} /></label>
        <label className="field">Observații<textarea rows={3} value={s.notes} onChange={set('notes')} placeholder="Puncte forte, lacune, stil de învățare…" /></label>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>Renunță</button>
          <button type="submit" className="btn primary">Salvează</button>
        </div>
      </form>
    </div>
  )
}
