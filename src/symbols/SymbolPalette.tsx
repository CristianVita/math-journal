import { useMemo, useState } from 'react'
import katex from 'katex'
import { CATEGORIES, type Sym } from './symbols'
import { insertLatex } from './insert'

const cache = new Map<string, string>()
const render = (tex: string) => {
  if (!cache.has(tex)) cache.set(tex, katex.renderToString(tex, { throwOnError: false }))
  return cache.get(tex)!
}

export default function SymbolPalette({ compact = false }: { compact?: boolean }) {
  const [cat, setCat] = useState(CATEGORIES[0].id)
  const [query, setQuery] = useState('')
  const [wrap, setWrap] = useState(true)
  const [toast, setToast] = useState('')

  const items: Sym[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES.find((c) => c.id === cat)!.items
    return CATEGORIES.flatMap((c) => c.items).filter((i) => i.name.toLowerCase().includes(q) || i.tex.toLowerCase().includes(q))
  }, [cat, query])

  const pick = async (sym: Sym) => {
    const tex = sym.insert ?? sym.tex
    if (insertLatex(tex, wrap)) return
    await navigator.clipboard?.writeText(tex)
    setToast('Copiat: ' + tex)
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className={'palette' + (compact ? ' compact' : '')}>
      <div className="palette-head">
        <input placeholder="Caută simbol (ex: integrală, alfa, paralel)…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="chk" title="Adaugă automat $...$ în jurul simbolului">
          <input type="checkbox" checked={wrap} onChange={(e) => setWrap(e.target.checked)} /> $…$
        </label>
      </div>
      {!query && (
        <div className="palette-tabs">
          {CATEGORIES.map((c) => (
            <button key={c.id} className={'chip' + (c.id === cat ? ' active' : '')} onClick={() => setCat(c.id)}>{c.title}</button>
          ))}
        </div>
      )}
      <div className="palette-grid">
        {items.map((i) => (
          <button
            key={i.tex + i.name}
            className={'sym' + ((i.insert ?? i.tex).length > 14 ? ' wide' : '')}
            title={`${i.name}\n${i.insert ?? i.tex}`}
            // keep focus in the text field so the caret position survives the click
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => pick(i)}
            dangerouslySetInnerHTML={{ __html: render(i.tex) }}
          />
        ))}
        {!items.length && <div className="muted">Niciun simbol găsit.</div>}
      </div>
      <div className="palette-foot muted">
        {toast || 'Click = inserează în câmpul de notițe activ (sau copiază dacă niciun câmp nu e selectat).'}
      </div>
    </div>
  )
}
