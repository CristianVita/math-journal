import { useEffect, useState } from 'react'
import StudentsSidebar from './journal/StudentsSidebar'
import StudentView from './journal/StudentView'
import SessionEditor from './journal/SessionEditor'
import BoardPage from './pages/BoardPage'
import SymbolsPage from './pages/SymbolsPage'
import TrigPage from './trig/TrigPage'
import { emptyScene, type Scene } from './geometry/types'
import { db } from './db'
import './symbols/insert'

type Page = 'journal' | 'board' | 'trig' | 'symbols'

const BOARD_KEY = 'math-journal:board'

function loadBoard(): Scene {
  try {
    const raw = localStorage.getItem(BOARD_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* storage unavailable: start empty */
  }
  return emptyScene()
}

export default function App() {
  const [page, setPage] = useState<Page>('journal')
  const [studentId, setStudentId] = useState<number>()
  const [sessionId, setSessionId] = useState<number>()
  const [board, setBoard] = useState<Scene>(loadBoard)

  useEffect(() => {
    try {
      localStorage.setItem(BOARD_KEY, JSON.stringify(board))
    } catch {
      /* ignore quota / private mode */
    }
  }, [board])

  // open the first student on start so the journal is never blank when data exists
  useEffect(() => {
    db.students.orderBy('name').first().then((s) => s && setStudentId((cur) => cur ?? s.id))
  }, [])

  const openSession = async (id: number) => {
    const s = await db.sessions.get(id)
    if (s) setStudentId(s.studentId)
    setSessionId(id)
    setPage('journal')
  }

  const NAV: { id: Page; label: string; icon: string }[] = [
    { id: 'journal', label: 'Jurnal', icon: '📓' },
    { id: 'board', label: 'Tablă', icon: '📐' },
    { id: 'trig', label: 'Trigonometrie', icon: '◔' },
    { id: 'symbols', label: 'Simboluri', icon: '∑' },
  ]

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><span className="logo">∫</span> Jurnal Meditații</div>
        <nav>
          {NAV.map((n) => (
            <button key={n.id} className={'nav' + (page === n.id ? ' active' : '')} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="main">
        {page === 'journal' && (
          <>
            <StudentsSidebar selected={studentId} onSelect={(id) => { setStudentId(id); setSessionId(undefined) }} />
            <main className="content">
              {sessionId != null ? (
                <SessionEditor key={sessionId} sessionId={sessionId} onBack={() => setSessionId(undefined)} onDeleted={() => setSessionId(undefined)} />
              ) : studentId != null ? (
                <StudentView studentId={studentId} onOpenSession={openSession} onDeleted={() => setStudentId(undefined)} />
              ) : (
                <div className="welcome">
                  <h1>Bun venit!</h1>
                  <p>Adaugă un elev din bara din stânga, apoi notează fiecare ședință: subiecte, notițe cu formule, construcții geometrice și tema.</p>
                  <ul>
                    <li><b>Tablă</b> — puncte, drepte, segmente, cercuri, poligoane, unghiuri de orice măsură, perpendiculare, paralele, bisectoare, grafice.</li>
                    <li><b>Trigonometrie</b> — cercul trigonometric interactiv, grafice sin/cos/tg/ctg, rezolvarea oricărui triunghi, formule.</li>
                    <li><b>Simboluri</b> — alfabetul grecesc, toate tipurile de integrale și sute de simboluri LaTeX.</li>
                  </ul>
                </div>
              )}
            </main>
          </>
        )}
        {page === 'board' && <main className="content full"><BoardPage scene={board} onChange={setBoard} /></main>}
        {page === 'trig' && (
          <main className="content full">
            <TrigPage onOpenInBoard={(s) => { setBoard(s); setPage('board') }} />
          </main>
        )}
        {page === 'symbols' && <main className="content full"><SymbolsPage /></main>}
      </div>
    </div>
  )
}
