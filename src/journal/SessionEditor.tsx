import { useEffect, useRef, useState } from 'react'
import { db, type Drawing, type Session } from '../db'
import MathText from '../components/MathText'
import SymbolPalette from '../symbols/SymbolPalette'
import GeometryBoard from '../geometry/GeometryBoard'
import { emptyScene, type Scene } from '../geometry/types'
import { uid } from '../geometry/engine'
import { usePrompt } from '../components/PromptDialog'

const TOPIC_SUGGESTIONS = [
  'Trigonometrie', 'Cercul trigonometric', 'Ecuații trigonometrice', 'Geometrie plană', 'Vectori', 'Geometrie analitică',
  'Triunghiuri', 'Patrulatere', 'Cerc', 'Funcții', 'Funcția de gradul II', 'Ecuații', 'Inecuații', 'Sisteme de ecuații',
  'Logaritmi', 'Exponențiale', 'Progresii', 'Combinatorică', 'Probabilități', 'Numere complexe', 'Matrici', 'Determinanți',
  'Limite', 'Continuitate', 'Derivate', 'Studiul funcțiilor', 'Primitive', 'Integrale definite', 'Arii și volume',
  'Structuri algebrice', 'Polinoame', 'Șiruri', 'Evaluare Națională', 'Subiecte Bac',
]

export default function SessionEditor({ sessionId, onBack, onDeleted }: {
  sessionId: number
  onBack: () => void
  onDeleted: () => void
}) {
  const [s, setS] = useState<Session | null>(null)
  const [studentName, setStudentName] = useState('')
  const [topicInput, setTopicInput] = useState('')
  const [mode, setMode] = useState<'split' | 'edit' | 'preview'>('split')
  const [palette, setPalette] = useState(true)
  const [openDrawing, setOpenDrawing] = useState<Drawing | null>(null)
  const [saved, setSaved] = useState(true)
  // in-app dialog: window.confirm may return at once without showing anything inside the app's webview
  const { confirm, dialog } = usePrompt()
  const timer = useRef<number>()

  useEffect(() => {
    db.sessions.get(sessionId).then(async (x) => {
      if (!x) return
      setS(x)
      setStudentName((await db.students.get(x.studentId))?.name ?? '')
    })
  }, [sessionId])

  // debounced autosave
  const update = (patch: Partial<Session>) => {
    setS((cur) => {
      if (!cur) return cur
      const next = { ...cur, ...patch, updatedAt: Date.now() }
      setSaved(false)
      clearTimeout(timer.current)
      timer.current = window.setTimeout(() => db.sessions.put(next).then(() => setSaved(true)), 500)
      return next
    })
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  if (!s) return <div className="page muted">Se încarcă…</div>

  const addTopic = (t: string) => {
    const v = t.trim()
    if (v && !s.topics.includes(v)) update({ topics: [...s.topics, v] })
    setTopicInput('')
  }

  const saveDrawing = (d: Drawing) => {
    const exists = s.drawings.some((x) => x.id === d.id)
    update({ drawings: exists ? s.drawings.map((x) => (x.id === d.id ? d : x)) : [...s.drawings, d] })
  }

  const remove = async () => {
    if (!(await confirm('Ștergi această ședință din jurnal?', 'Șterge ședința'))) return
    clearTimeout(timer.current)
    await db.sessions.delete(sessionId)
    onDeleted()
  }

  return (
    <div className="page session-page">
      <div className="page-head">
        <div>
          <button className="link" onClick={onBack}>← {studentName}</button>
          <h1>Ședință</h1>
        </div>
        <div className="actions">
          <span className={'save-state ' + (saved ? 'ok' : '')}>{saved ? '✓ Salvat' : 'Se salvează…'}</span>
          <button className="btn danger" onClick={remove}>Șterge ședința</button>
        </div>
      </div>

      <div className="session-meta card">
        <label className="field">Data<input type="date" value={s.date} onChange={(e) => update({ date: e.target.value })} /></label>
        <label className="field">Durata (min)<input type="number" min={0} step={15} value={s.durationMin} onChange={(e) => update({ durationMin: Number(e.target.value) })} /></label>
        <div className="field">
          Cum a mers
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={'star' + (n <= s.rating ? ' on' : '')} onClick={() => update({ rating: n })}>★</button>
            ))}
          </div>
        </div>
        <div className="field grow">
          Subiecte
          <div className="topics">
            {s.topics.map((t) => (
              <span key={t} className="tag">{t}<button onClick={() => update({ topics: s.topics.filter((x) => x !== t) })}>×</button></span>
            ))}
            <input
              list="topic-suggestions"
              value={topicInput}
              placeholder="Adaugă subiect + Enter"
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTopic(topicInput)
                }
              }}
              onBlur={() => topicInput && addTopic(topicInput)}
            />
            <datalist id="topic-suggestions">{TOPIC_SUGGESTIONS.map((t) => <option key={t} value={t} />)}</datalist>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>Notițe</h2>
        <div className="seg">
          {(['edit', 'split', 'preview'] as const).map((m) => (
            <button key={m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>
              {{ edit: 'Scriere', split: 'Ambele', preview: 'Previzualizare' }[m]}
            </button>
          ))}
        </div>
        <button className={'btn small' + (palette ? ' active' : '')} onClick={() => setPalette(!palette)}>∑ Simboluri</button>
      </div>
      <div className={'notes-area' + (palette ? ' with-palette' : '')}>
        <div className={'notes-editor mode-' + mode}>
          {mode !== 'preview' && (
            <textarea
              data-math
              value={s.notes}
              onChange={(e) => update({ notes: e.target.value })}
              placeholder={'Scrie ce ați lucrat. Formule între $...$ (în rând) sau $$...$$ (separat).\nEx: Am rezolvat $\\sin^2 x + \\cos^2 x = 1$ și\n$$\\int_0^{\\pi} \\sin x\\,dx = 2$$'}
            />
          )}
          {mode !== 'edit' && <MathText className="notes-preview" text={s.notes || '*Previzualizarea apare aici.*'} />}
        </div>
        {palette && <SymbolPalette compact />}
      </div>

      <div className="section-head">
        <h2>Desene și construcții</h2>
        <button className="btn small" onClick={() => setOpenDrawing({ id: uid(), title: `Figura ${s.drawings.length + 1}`, scene: emptyScene() })}>+ Desen nou</button>
      </div>
      <div className="drawings">
        {s.drawings.map((d) => (
          <div key={d.id} className="drawing-card">
            <button className="drawing-thumb" onClick={() => setOpenDrawing(d)} title="Deschide">
              <GeometryBoard scene={d.scene} onChange={() => {}} height={170} readOnly />
            </button>
            <div className="drawing-foot">
              <input value={d.title} onChange={(e) => saveDrawing({ ...d, title: e.target.value })} />
              <button className="link danger" onClick={async () => (await confirm('Ștergi desenul?', 'Șterge desenul')) && update({ drawings: s.drawings.filter((x) => x.id !== d.id) })}>Șterge</button>
            </div>
          </div>
        ))}
        {!s.drawings.length && <div className="empty muted">Niciun desen. Construiește figuri, unghiuri și grafice direct în ședință.</div>}
      </div>

      <div className="section-head"><h2>Temă</h2>
        <label className="chk"><input type="checkbox" checked={s.homeworkDone} onChange={(e) => update({ homeworkDone: e.target.checked })} /> Făcută</label>
      </div>
      <textarea data-math className="homework" rows={3} value={s.homework} onChange={(e) => update({ homework: e.target.value })} placeholder="Exerciții date pentru acasă (poți folosi și formule $...$)" />
      {s.homework.trim() && <MathText className="notes-preview small" text={s.homework} />}

      {openDrawing && (
        <DrawingModal
          drawing={openDrawing}
          onClose={() => setOpenDrawing(null)}
          onSave={(d) => {
            saveDrawing(d)
            setOpenDrawing(null)
          }}
        />
      )}
      {dialog}
    </div>
  )
}

function DrawingModal({ drawing, onClose, onSave }: { drawing: Drawing; onClose: () => void; onSave: (d: Drawing) => void }) {
  const [scene, setScene] = useState<Scene>(drawing.scene)
  const [title, setTitle] = useState(drawing.title)
  return (
    <div className="modal-backdrop">
      <div className="modal huge">
        <div className="modal-head">
          <input className="title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="actions">
            <button className="btn" onClick={onClose}>Renunță</button>
            <button className="btn primary" onClick={() => onSave({ ...drawing, title, scene })}>Salvează în ședință</button>
          </div>
        </div>
        <GeometryBoard scene={scene} onChange={setScene} height="calc(100vh - 190px)" />
      </div>
    </div>
  )
}
