// Automatic backup, asked for on 11 November 2026: everything lives only on this device.
// Desktop: a copy of all the data goes by itself, every few days, into a folder the user chose once (one that
// Google Drive or OneDrive keeps in sync, say), and only the last copies are kept. A web page cannot write into a
// folder by itself, so in the browser the app only reminds the user to make a backup when the last one is old.
import { exportBackup, readLocal, writeLocal } from './db'
import { isDesktop } from './platform'

/** Not in LOCAL_KEYS: a backup restored on another computer should not bring this one's folder with it. */
const KEY = 'math-journal:auto-backup'
const PREFIX = 'jurnal-meditatii-auto-'
const DAY = 24 * 60 * 60 * 1000

export interface BackupSettings {
  /** desktop: the folder the copies go into */
  dir?: string
  /** how many days between two copies (desktop) or before a reminder (browser) */
  every: number
  /** how many automatic copies stay in the folder */
  keep: number
  /** the last backup, automatic or made by hand, as an ISO date */
  last?: string
  /** the last automatic copy that failed, and why */
  error?: string
}

export function backupSettings(): BackupSettings {
  try {
    return { every: 7, keep: 10, ...JSON.parse(readLocal(KEY) ?? '{}') }
  } catch {
    return { every: 7, keep: 10 }
  }
}

export function saveBackupSettings(s: BackupSettings) {
  writeLocal(KEY, JSON.stringify(s))
  window.dispatchEvent(new Event('math-journal:backup'))
}

/** A backup was just made by hand, with the button. */
export function noteBackup() {
  saveBackupSettings({ ...backupSettings(), last: new Date().toISOString(), error: undefined })
}

/** Days since the last backup, or null if there was none. */
export function daysSinceBackup(s = backupSettings(), now = Date.now()): number | null {
  return s.last ? Math.floor((now - Date.parse(s.last)) / DAY) : null
}

/** Whether a new copy is due: never made, or older than `every` days. */
export const backupDue = (s: BackupSettings, now = Date.now()) => !s.last || now - Date.parse(s.last) >= s.every * DAY

/** The name of an automatic copy, sortable by time: jurnal-meditatii-auto-2026-11-11-0915.json */
export function backupName(at: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${PREFIX}${at.getFullYear()}-${p(at.getMonth() + 1)}-${p(at.getDate())}-${p(at.getHours())}${p(at.getMinutes())}.json`
}

/** Of the automatic copies in a folder, the ones beyond the newest `keep`. Other files are never touched. */
export function oldCopies(names: string[], keep: number) {
  return names.filter((n) => n.startsWith(PREFIX) && n.endsWith('.json')).sort().reverse().slice(keep)
}

/** Writes a copy into the chosen folder now, and keeps only the newest ones. Desktop only. */
export async function writeBackupNow(): Promise<string> {
  const s = backupSettings()
  if (!isDesktop() || !s.dir) throw new Error('Nu e ales niciun folder pentru backup.')
  const [{ join }, { writeTextFile, readDir, remove }] = await Promise.all([import('@tauri-apps/api/path'), import('@tauri-apps/plugin-fs')])
  const name = backupName(new Date())
  try {
    await writeTextFile(await join(s.dir, name), await exportBackup())
  } catch (err) {
    const error = `Backup-ul automat nu a putut fi scris în ${s.dir}: ${String((err as Error)?.message ?? err)}`
    saveBackupSettings({ ...s, error })
    throw new Error(error)
  }
  saveBackupSettings({ ...s, last: new Date().toISOString(), error: undefined })
  try {
    const names = (await readDir(s.dir)).filter((e) => e.isFile).map((e) => e.name)
    for (const old of oldCopies(names, s.keep)) await remove(await join(s.dir, old))
  } catch (err) {
    // the copy is written; the old ones simply stay
    console.error('Copiile vechi de backup nu au putut fi șterse', err)
  }
  return name
}

/** On the desktop, with a folder chosen: a copy if one is due. Quiet when nothing is due or there is no folder. */
export async function autoBackup(): Promise<void> {
  const s = backupSettings()
  if (!isDesktop() || !s.dir || !backupDue(s)) return
  try {
    await writeBackupNow()
  } catch (err) {
    console.error(err)
  }
}

/** Asks for the folder (desktop). Returns null if the user cancelled. */
export async function chooseBackupFolder(): Promise<string | null> {
  const { open } = await import('@tauri-apps/plugin-dialog')
  const dir = await open({ directory: true, title: 'Alege folderul pentru backup-ul automat' })
  return typeof dir === 'string' ? dir : null
}
