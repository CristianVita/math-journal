// Runs both as a web page and inside the Tauri desktop shell; this hides the differences.

export const isDesktop = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

/** A window opened with "Fereastră nouă" (the address says so): no backup, closes without asking. */
export const isExtraWindow = () => typeof location !== 'undefined' && new URLSearchParams(location.search).has('window')

/**
 * Opens the app once more on `page`, for a second screen. Desktop: a new window of the app (label `extra-…`, allowed
 * in `capabilities/default.json`); web: a new tab. Both share the data with this one (`onLocalChange` in `db.ts`).
 */
export async function openWindow(page: string) {
  const url = `index.html?window=1&page=${encodeURIComponent(page)}`
  if (!isDesktop()) {
    window.open(new URL(url, location.href).href, '_blank')
    return
  }
  const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow')
  const win = new WebviewWindow(`extra-${Date.now()}`, { url, title: 'Jurnal Meditații', width: 1200, height: 800, minWidth: 900, minHeight: 600 })
  win.once('tauri://error', (e) => console.error('Fereastra nouă nu s-a deschis', e))
}

/**
 * Save a file chosen by the user. Desktop: native "Save as" dialog; web: regular browser download.
 * Returns false when the user cancelled the dialog.
 */
export async function saveFile(name: string, data: Blob | string): Promise<boolean> {
  if (isDesktop()) {
    const [{ save }, { writeFile, writeTextFile }] = await Promise.all([
      import('@tauri-apps/plugin-dialog'),
      import('@tauri-apps/plugin-fs'),
    ])
    const ext = name.split('.').pop() ?? ''
    const path = await save({ defaultPath: name, filters: ext ? [{ name: ext.toUpperCase(), extensions: [ext] }] : [] })
    if (!path) return false
    if (typeof data === 'string') await writeTextFile(path, data)
    else await writeFile(path, new Uint8Array(await data.arrayBuffer()))
    return true
  }
  const blob = typeof data === 'string' ? new Blob([data], { type: 'text/plain' }) : data
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}
