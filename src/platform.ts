// Runs both as a web page and inside the Tauri desktop shell; this hides the differences.

export const isDesktop = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

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
