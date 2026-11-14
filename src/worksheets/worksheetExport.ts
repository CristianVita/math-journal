// A worksheet as printed pages: laid out on A4 sheets in the page itself (so that the formulas are measured as they
// will look), cut into pages where an exercise would not fit, then each page drawn to a picture for PDF or Word.
import { renderMathMarkdown } from '../components/MathText'
import type { PageImage } from '../export/exportDoc'

/** A4 at 96 dpi, in CSS pixels, and the margin inside it. */
export const A4 = { w: 794, h: 1123, margin: 56 }

/** `figure`: an SVG drawn beside the statement (an exercise taken from a national evaluation model) */
export interface PrintItem { text: string; solution: string; figure?: string }
export interface PrintSheet {
  title: string
  student: string
  /** as it is written on the sheet: 8.11.2026 */
  date: string
  items: PrintItem[]
  /** room left under each exercise for the student to work in, in pixels */
  space: number
  solutions: boolean
}

const block = (html: string, className: string) => {
  const div = document.createElement('div')
  div.className = className
  div.innerHTML = html
  return div
}

/**
 * The lines of a paragraph (a), b), c)… are lines of one paragraph, kept apart only by <br>) made paragraphs of
 * their own, so that there is room between them: with tall fractions, lines of one paragraph touched (12 November
 * 2026, a sheet from a photo, at the user's request: "more airy").
 */
function splitLines(container: HTMLElement) {
  for (const p of [...container.querySelectorAll('p')]) {
    if (!p.querySelector(':scope > br')) continue
    const parts: Node[][] = [[]]
    for (const node of [...p.childNodes]) {
      if (node.nodeName === 'BR') parts.push([])
      else parts[parts.length - 1].push(node)
    }
    for (const nodes of parts) {
      if (!nodes.some((n) => n.textContent?.trim() || n.nodeType === 1)) continue
      const line = document.createElement('p')
      nodes.forEach((n) => line.appendChild(n))
      p.before(line)
    }
    p.remove()
  }
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/**
 * Lays the sheet out on A4 pages inside `host` (off screen) and returns the pages. An exercise is never cut in two:
 * one that does not fit goes whole on the next page. The solutions, if wanted, start on a page of their own.
 */
export function layoutSheet(host: HTMLElement, sheet: PrintSheet): HTMLElement[] {
  const pages: HTMLElement[] = []
  let body: HTMLElement
  const avail = A4.h - 2 * A4.margin
  const newPage = () => {
    const page = document.createElement('div')
    page.className = 'ws-print-page'
    Object.assign(page.style, { width: A4.w + 'px', height: A4.h + 'px', padding: A4.margin + 'px' })
    body = document.createElement('div')
    body.className = 'ws-print-body'
    page.appendChild(body)
    host.appendChild(page)
    pages.push(page)
  }
  const place = (el: HTMLElement) => {
    body.appendChild(el)
    if (body.offsetHeight > avail && body.childElementCount > 1) {
      body.removeChild(el)
      newPage()
      body.appendChild(el)
    }
  }

  newPage()
  place(block(
    `<div class="ws-print-title">${escape(sheet.title || 'Fișă de lucru')}</div>` +
    `<div class="ws-print-meta"><span>Nume: ${sheet.student ? `<b>${escape(sheet.student)}</b>` : '<span class="ws-print-blank"></span>'}</span><span>Data: ${escape(sheet.date)}</span></div>`,
    'ws-print-head',
  ))
  sheet.items.forEach((item, i) => {
    const el = block(`<div class="ws-print-num">${i + 1}.</div><div class="ws-print-text">${renderMathMarkdown(item.text)}</div>${item.figure ? `<div class="ws-print-fig">${item.figure}</div>` : ''}`, 'ws-print-item')
    splitLines(el)
    el.style.paddingBottom = sheet.space + 'px'
    place(el)
  })

  // exercises from a photo have no solution: they are left out here (keeping the numbers of the others), and with
  // none at all there is no page of solutions (12 November 2026)
  if (sheet.solutions && sheet.items.some((item) => item.solution.trim())) {
    newPage()
    place(block(`<div class="ws-print-title">Rezolvări — ${escape(sheet.title || 'Fișă de lucru')}</div>`, 'ws-print-head'))
    sheet.items.forEach((item, i) => {
      if (!item.solution.trim()) return
      const sol = block(`<div class="ws-print-num">${i + 1}.</div><div class="ws-print-text">${renderMathMarkdown(item.solution)}</div>`, 'ws-print-item solution')
      splitLines(sol)
      place(sol)
    })
  }
  return pages
}

/** The pages as pictures, at twice the size for print. */
export const sheetPictures = (sheet: PrintSheet) => pagePictures((host) => layoutSheet(host, sheet))

/** Pages laid out by `layout` in a hidden place, drawn as pictures at twice the size for print. */
export async function pagePictures(layout: (host: HTMLElement) => HTMLElement[]): Promise<PageImage[]> {
  const { default: html2canvas } = await import('html2canvas')
  const host = document.createElement('div')
  host.className = 'ws-print-host'
  document.body.appendChild(host)
  try {
    // the formulas' fonts must be ready before anything is measured or drawn
    await document.fonts?.ready
    const pages = layout(host)
    const out: PageImage[] = []
    for (const [i, page] of pages.entries()) {
      const canvas = await html2canvas(page, { backgroundColor: '#ffffff', scale: 2, logging: false, width: A4.w, height: A4.h })
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) throw new Error('Pagina nu a putut fi desenată.')
      const dataUrl = canvas.toDataURL('image/png')
      out.push({ title: `Pagina ${i + 1}`, width: A4.w, height: A4.h, blob, png: new Uint8Array(await blob.arrayBuffer()), dataUrl })
    }
    return out
  } finally {
    host.remove()
  }
}
