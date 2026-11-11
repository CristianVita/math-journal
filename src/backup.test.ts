// The automatic backup: when a copy is due, how copies are named, and which old ones go.
import { describe, expect, it } from 'vitest'
import { backupDue, backupName, daysSinceBackup, oldCopies } from './backup'

const DAY = 24 * 60 * 60 * 1000

describe('the automatic backup', () => {
  it('is due when there was none, or when the last one is older than the interval', () => {
    const now = Date.parse('2026-11-11T10:00:00Z')
    expect(backupDue({ every: 7, keep: 10 }, now)).toBe(true)
    expect(backupDue({ every: 7, keep: 10, last: new Date(now - 6 * DAY).toISOString() }, now)).toBe(false)
    expect(backupDue({ every: 7, keep: 10, last: new Date(now - 7 * DAY).toISOString() }, now)).toBe(true)
    expect(backupDue({ every: 1, keep: 10, last: new Date(now - DAY + 1000).toISOString() }, now)).toBe(false)
  })

  it('counts whole days since the last one', () => {
    const now = Date.parse('2026-11-11T10:00:00Z')
    expect(daysSinceBackup({ every: 7, keep: 10 }, now)).toBeNull()
    expect(daysSinceBackup({ every: 7, keep: 10, last: new Date(now - 3.5 * DAY).toISOString() }, now)).toBe(3)
  })

  it('names copies so that they sort by time', () => {
    expect(backupName(new Date(2026, 10, 11, 9, 5))).toBe('jurnal-meditatii-auto-2026-11-11-0905.json')
    const a = backupName(new Date(2026, 8, 30, 23, 59))
    const b = backupName(new Date(2026, 9, 1, 0, 0))
    expect([b, a].sort()).toEqual([a, b])
  })

  it('removes only the oldest automatic copies, never other files', () => {
    const names = [
      'jurnal-meditatii-auto-2026-11-01-0900.json',
      'jurnal-meditatii-auto-2026-11-08-0900.json',
      'jurnal-meditatii-auto-2026-10-25-0900.json',
      'jurnal-meditatii-2026-11-02.json',
      'notes.txt',
    ]
    expect(oldCopies(names, 2)).toEqual(['jurnal-meditatii-auto-2026-10-25-0900.json'])
    expect(oldCopies(names, 10)).toEqual([])
  })
})
