import { useEffect, useRef, useState } from 'react'
import StudentsSidebar from './journal/StudentsSidebar'
import StudentView from './journal/StudentView'
import SessionEditor from './journal/SessionEditor'
import BoardPage from './pages/BoardPage'
import SymbolsPage from './pages/SymbolsPage'
import TrigPage from './trig/TrigPage'
import CalculusPage from './calculus/CalculusPage'
import NotebookPage from './notebook/NotebookPage'
import WorksheetsPage from './worksheets/WorksheetsPage'
import { emptyScene, type Scene } from './geometry/types'
import { db, flushLocal, localSaveFailed, readLocal, writeLocal } from './db'
import { autoBackup } from './backup'
import './symbols/insert'
import { usePrompt } from './components/PromptDialog'
import { isDesktop } from './platform'

type Page = 'journal' | 'board' | 'notebook' | 'worksheets' | 'trig' | 'calculus' | 'symbols'

const BOARD_KEY = 'math-journal:board'

function loadBoard(): Scene {
  try {
    const raw = readLocal(BOARD_KEY)
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

  useEffect(() => writeLocal(BOARD_KEY, JSON.stringify(board)), [board])

  // desktop app: ask before closing the window. Everything is saved as you go, so the question is only a
  // guard against closing by mistake; after "Închide" it waits a moment for saves still under way.
  const { confirm, dialog } = usePrompt()
  const confirmRef = useRef(confirm)
  confirmRef.current = confirm
  // the automatic backup on the desktop: at the start, then checked every half hour
  useEffect(() => {
    if (!isDesktop()) return
    const first = setTimeout(autoBackup, 5000)
    const every = setInterval(autoBackup, 30 * 60 * 1000)
    return () => {
      clearTimeout(first)
      clearInterval(every)
    }
  }, [])
  useEffect(() => {
    if (!isDesktop()) return
    let unlisten: (() => void) | undefined
    let asking = false
    import('@tauri-apps/api/window').then(async ({ getCurrentWindow }) => {
      const win = getCurrentWindow()
      unlisten = await win.onCloseRequested(async (e) => {
        e.preventDefault()
        if (asking) return
        asking = true
        const close = await confirmRef.current('Închizi aplicația?', 'Închide', false, {
          detail: 'Tot ce ai lucrat — jurnalul, caietul și tabla — e salvat automat. Îl regăsești exact așa data viitoare.',
          cancelLabel: 'Rămân',
        })
        asking = false
        if (!close) return
        // the notebook saves a moment after the last change: let it, then wait for the database
        await new Promise((r) => setTimeout(r, 500))
        await flushLocal()
        // a copy of today's work, if one is due, before the app goes
        await autoBackup()
        if (localSaveFailed()) {
          asking = true
          const anyway = await confirmRef.current('Ultimele modificări din Caiet sau de pe Tablă nu au putut fi salvate.', 'Închide oricum', true, {
            detail: 'Dacă închizi acum, le pierzi. Poți rămâne și face un backup din Jurnal.',
            cancelLabel: 'Rămân',
          })
          asking = false
          if (!anyway) return
        }
        await win.destroy()
      })
    })
    return () => unlisten?.()
  }, [])

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
    { id: 'notebook', label: 'Caiet', icon: '✍️' },
    { id: 'worksheets', label: 'Fișe', icon: '📝' },
    { id: 'trig', label: 'Trigonometrie', icon: '◔' },
    { id: 'calculus', label: 'Calculator', icon: '∂' },
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
                    <li><b>Caiet</b> — scrii liber cu mouse-ul sau cu creionul, ca pe o foaie de matematică sau dictando.</li>
                    <li><b>Fișe</b> — fișe de lucru pentru clasele V–VIII, cu exerciții generate sau scrise de tine, tipărite cu rezolvările separat.</li>
                    <li><b>Trigonometrie</b> — cercul trigonometric interactiv, grafice sin/cos/tg/ctg, rezolvarea oricărui triunghi, formule.</li>
                    <li><b>Calculator</b> — derivate și integrale pas cu pas, integrale definite și improprii, verificarea răspunsului elevului.</li>
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
        {page === 'calculus' && <main className="content full"><CalculusPage /></main>}
        {page === 'notebook' && <main className="content full"><NotebookPage /></main>}
        {page === 'worksheets' && <main className="content full"><WorksheetsPage /></main>}
        {page === 'symbols' && <main className="content full"><SymbolsPage /></main>}
      </div>
      {dialog}
    </div>
  )
}
