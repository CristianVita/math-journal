// A worksheet as printed pages: laid out on A4 sheets in the page itself (so that the formulas are measured as they
// will look), cut into pages where an exercise would not fit, then each page drawn to a picture for PDF or Word.
import { renderMathMarkdown } from '../components/MathText'
import type { PageImage } from '../export/exportDoc'

/** A4 at 96 dpi, in CSS pixels, and the margin inside it. */
export const A4 = { w: 794, h: 1123, margin: 56 }

export interface PrintItem { text: string; solution: string }
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
    const el = block(`<div class="ws-print-num">${i + 1}.</div><div class="ws-print-text">${renderMathMarkdown(item.text)}</div>`, 'ws-print-item')
    el.style.paddingBottom = sheet.space + 'px'
    place(el)
  })

  if (sheet.solutions && sheet.items.length) {
    newPage()
    place(block(`<div class="ws-print-title">Rezolvări — ${escape(sheet.title || 'Fișă de lucru')}</div>`, 'ws-print-head'))
    sheet.items.forEach((item, i) => {
      place(block(`<div class="ws-print-num">${i + 1}.</div><div class="ws-print-text">${renderMathMarkdown(item.solution || '—')}</div>`, 'ws-print-item solution'))
    })
  }
  return pages
}

/** The pages as pictures, at twice the size for print. */
export async function sheetPictures(sheet: PrintSheet): Promise<PageImage[]> {
  const { default: html2canvas } = await import('html2canvas')
  const host = document.createElement('div')
  host.className = 'ws-print-host'
  document.body.appendChild(host)
  try {
    // the formulas' fonts must be ready before anything is measured or drawn
    await document.fonts?.ready
    const pages = layoutSheet(host, sheet)
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
