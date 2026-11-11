import { useEffect, useState } from 'react'
import { backupDue, backupSettings, chooseBackupFolder, daysSinceBackup, saveBackupSettings, writeBackupNow, type BackupSettings } from '../backup'
import { isDesktop } from '../platform'

const EVERY = [
  { days: 1, label: 'în fiecare zi' },
  { days: 7, label: 'o dată pe săptămână' },
  { days: 30, label: 'o dată pe lună' },
]

const when = (days: number | null) =>
  days === null ? 'niciodată' : days === 0 ? 'azi' : days === 1 ? 'ieri' : `acum ${days < 20 ? days : days + ' de'} zile`

/** The current settings, kept in step with changes made elsewhere (an automatic copy, the Backup button). */
export function useBackupSettings() {
  const [s, setS] = useState<BackupSettings>(backupSettings)
  useEffect(() => {
    const update = () => setS(backupSettings())
    window.addEventListener('math-journal:backup', update)
    return () => window.removeEventListener('math-journal:backup', update)
  }, [])
  return s
}

/**
 * The line under the students: when the last backup was, and a warning when it is too old, or when the automatic copy
 * could not be written. In the browser it is the only reminder there is.
 */
export function BackupStatus({ onOpen }: { onOpen: () => void }) {
  const s = useBackupSettings()
  const late = !s.dir && backupDue(s) && s.last !== undefined
  const never = !s.dir && s.last === undefined
  return (
    <button className={'backup-status' + (s.error || late ? ' warn' : '')} onClick={onOpen} title="Setările backup-ului automat">
      {s.error
        ? 'Backup-ul automat nu a reușit'
        : s.dir
          ? `Backup automat · ultimul: ${when(daysSinceBackup(s))}`
          : never
            ? isDesktop() ? 'Backup automat: alege un folder' : 'Niciun backup încă'
            : `Ultimul backup: ${when(daysSinceBackup(s))}${late ? ' — e timpul pentru unul nou' : ''}`}
    </button>
  )
}

export default function BackupPanel({ onClose, onBackupNow }: { onClose: () => void; onBackupNow: () => Promise<void> }) {
  const s = useBackupSettings()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const desktop = isDesktop()

  const choose = async () => {
    const dir = await chooseBackupFolder()
    if (!dir) return
    saveBackupSettings({ ...s, dir, error: undefined })
    setBusy(true)
    try {
      setNote(`Prima copie e în folder: ${await writeBackupNow()}`)
    } catch (e) {
      setNote((e as Error).message)
    }
    setBusy(false)
  }
  const now = async () => {
    setBusy(true)
    try {
      if (desktop && s.dir) setNote(`Am scris ${await writeBackupNow()}`)
      else {
        await onBackupNow()
        setNote('Fișierul de backup a fost salvat.')
      }
    } catch (e) {
      setNote((e as Error).message)
    }
    setBusy(false)
  }

  return (
    <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal small">
        <div className="modal-title">Backup automat</div>
        <p className="modal-detail">
          Toate datele (elevii, ședințele, caietul, tabla și fișele) stau doar pe acest dispozitiv.
          {desktop
            ? ' Alege un folder, de preferat unul sincronizat cu Google Drive sau OneDrive: aplicația pune singură acolo o copie, la pornire sau la închidere, când e timpul.'
            : ' În browser, aplicația nu poate scrie singură într-un folder, dar îți amintește când ultimul backup e prea vechi. În aplicația de desktop, copiile se fac singure.'}
        </p>
        {desktop && (
          <div className="field">
            Folderul
            <div className="insp-row">
              <span className="muted small backup-dir">{s.dir ?? 'neales'}</span>
              <button className="btn small" disabled={busy} onClick={choose}>{s.dir ? 'Schimbă…' : 'Alege folderul…'}</button>
            </div>
          </div>
        )}
        <label className="field">
          {desktop ? 'O copie nouă' : 'Amintește-mi'}
          <select value={s.every} onChange={(e) => saveBackupSettings({ ...s, every: Number(e.target.value) })}>
            {EVERY.map((o) => <option key={o.days} value={o.days}>{o.label}</option>)}
          </select>
        </label>
        {desktop && (
          <label className="field">
            Păstrează
            <select value={s.keep} onChange={(e) => saveBackupSettings({ ...s, keep: Number(e.target.value) })}>
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>ultimele {n} copii</option>)}
            </select>
            <span className="muted small">Copiile mai vechi se șterg din folder. Alte fișiere de acolo nu sunt atinse.</span>
          </label>
        )}
        <p className="muted small">Ultimul backup: {when(daysSinceBackup(s))}{s.last ? ` (${new Date(s.last).toLocaleString('ro-RO')})` : ''}.</p>
        {s.error && <p className="modal-error" role="alert">{s.error}</p>}
        {note && <p className="muted small" role="status">{note}</p>}
        <div className="modal-actions">
          {desktop && s.dir && <button className="btn" disabled={busy} onClick={() => saveBackupSettings({ ...s, dir: undefined, error: undefined })}>Oprește</button>}
          <button className="btn" disabled={busy} onClick={now}>Fă un backup acum</button>
          <button className="btn primary" onClick={onClose}>Gata</button>
        </div>
      </div>
    </div>
  )
}
