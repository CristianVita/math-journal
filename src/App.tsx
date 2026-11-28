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
import ModelsPage from './models/ModelsPage'
import { emptyScene, type Scene } from './geometry/types'
import { db, flushLocal, localSaveFailed, onLocalChange, readLocal, writeLocal } from './db'
import { autoBackup } from './backup'
import './symbols/insert'
import { usePrompt } from './components/PromptDialog'
import { isDesktop, isExtraWindow, openWindow } from './platform'

type Page = 'journal' | 'board' | 'notebook' | 'worksheets' | 'models' | 'trig' | 'calculus' | 'symbols'

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
  // a window opened with "Fereastră nouă" starts on the page it was opened from
  const [page, setPage] = useState<Page>(() => (new URLSearchParams(location.search).get('page') as Page | null) ?? 'journal')
  const [studentId, setStudentId] = useState<number>()
  const [sessionId, setSessionId] = useState<number>()
  const [board, setBoard] = useState<Scene>(loadBoard)

  useEffect(() => writeLocal(BOARD_KEY, JSON.stringify(board)), [board])
  useEffect(() => onLocalChange(BOARD_KEY, () => setBoard(loadBoard())), [])

  // desktop app: ask before closing the window. Everything is saved as you go, so the question is only a
  // guard against closing by mistake; after "Închide" it waits a moment for saves still under way.
  const { confirm, dialog } = usePrompt()
  const confirmRef = useRef(confirm)
  confirmRef.current = confirm
  // the automatic backup on the desktop: at the start, then checked every half hour
  useEffect(() => {
    // one window does the backup: the main one
    if (!isDesktop() || isExtraWindow()) return
    const first = setTimeout(autoBackup, 5000)
    const every = setInterval(autoBackup, 30 * 60 * 1000)
    return () => {
      clearTimeout(first)
      clearInterval(every)
    }
  }, [])
  useEffect(() => {
    if (!isDesktop()) return
    const unlisteners: Array<() => void> = []
    let disposed = false
    let asking = false
    import('@tauri-apps/api/window').then(async ({ getCurrentWindow, getAllWindows }) => {
      const win = getCurrentWindow()
      const closeWindow = async (quitFromTray = false) => {
        if (asking) return
        asking = true
        try {
          const confirmClose = quitFromTray || !isExtraWindow()
          if (confirmClose && !(await confirmRef.current('Închizi aplicația?', 'Închide', false, {
            detail: 'Tot ce ai lucrat — jurnalul, caietul și tabla — e salvat automat. Îl regăsești exact așa data viitoare.',
            cancelLabel: 'Rămân',
          }))) return

          // The notebook saves a moment after the last change. Give it time, then wait for the database.
          await new Promise((r) => setTimeout(r, 500))
          await flushLocal()
          if (confirmClose) {
            await autoBackup()
            if (localSaveFailed() && !(await confirmRef.current('Ultimele modificări din Caiet sau de pe Tablă nu au putut fi salvate.', 'Închide oricum', true, {
              detail: 'Dacă închizi acum, le pierzi. Poți rămâne și face un backup din Jurnal.',
              cancelLabel: 'Rămân',
            }))) return
          }
          if (quitFromTray) {
            const others = (await getAllWindows()).filter((other) => other.label !== win.label)
            // Request normal closes so secondary windows can flush their own pending saves.
            await Promise.allSettled(others.map((other) => other.close()))
          }
          await win.destroy()
        } finally {
          asking = false
        }
      }
      const listeners = await Promise.all([
        win.onCloseRequested(async (e) => {
          e.preventDefault()
          await closeWindow()
        }),
        win.listen('journal-tray-close', () => void closeWindow(true)),
      ])
      if (disposed) listeners.forEach((unlisten) => unlisten())
      else unlisteners.push(...listeners)
    })
    return () => {
      disposed = true
      unlisteners.forEach((unlisten) => unlisten())
    }
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
    { id: 'models', label: 'Modele E.N.', icon: '🎯' },
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
        <button className="nav new-window" title="Deschide pagina aceasta într-o fereastră nouă (de exemplu pe celălalt ecran)" onClick={() => openWindow(page)}>
          <span className="nav-icon">⧉</span> Fereastră nouă
        </button>
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
                    <li><b>Fișe</b> — fișe de lucru pentru clasele V–XII (la liceu, pe profilurile de Bacalaureat), cu exerciții generate sau scrise de tine, tipărite cu rezolvările separat.</li>
                    <li><b>Modele E.N.</b> — modele de teste pentru Evaluarea Națională, ca în culegere, cu figuri și barem, bifate pe elev.</li>
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
        {page === 'models' && <main className="content full"><ModelsPage /></main>}
        {page === 'symbols' && <main className="content full"><SymbolsPage /></main>}
      </div>
      {dialog}
    </div>
  )
}
