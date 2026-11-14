// Recap exercises from a book (the final review of grade VIII: algebra and geometry, parts A and B), shown on the
// "Modele E.N." page next to the models, with the book's answers, taken onto the worksheet or printed by chapter
// (13 November 2026, asked for by the user).
import { renderMathMarkdown } from '../components/MathText'
import { A4, pagePictures } from '../worksheets/worksheetExport'
import { figureSvg, type Fig } from './figure'

export interface RecapPart {
  text: string
  /** the result, from the book's answers */
  ans?: string
}

export interface RecapItem {
  text: string
  /** a), b)…; short ones are laid out side by side, as in the book */
  parts?: RecapPart[]
  /** the answer, when the exercise has no parts */
  ans?: string
  /** where the answer differs from the book, and why; shown with the answers */
  note?: string
  fig?: Fig
}

export interface RecapSection {
  id: string
  title: string
  items: RecapItem[]
}

export interface Recap {
  id: string
  title: string
  source: string
  sections: RecapSection[]
}

const LETTERS9 = 'abcdefghi'

/** The exercise as one text, for a worksheet. */
export function recapText(item: RecapItem): string {
  let out = item.text
  if (item.parts) out += '\n\n' + item.parts.map((p, i) => `${LETTERS9[i]}) ${p.text}`).join('\n\n')
  return out
}

/** The answers as one text, for a worksheet. */
export function recapAnswer(item: RecapItem): string {
  if (item.parts?.some((p) => p.ans)) return item.parts.map((p, i) => `${LETTERS9[i]}) ${p.ans ?? '—'}`).join('\n\n')
  return item.ans ? `Răspuns: ${item.ans}` : ''
}
const md = (s: string) => renderMathMarkdown(s)
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/** Parts that are only a short formula go side by side, in two columns, as in the book; words one under another. */
const short = (item: RecapItem) => (item.parts ?? []).every((p) => p.text.length <= 70 && /^\$[^$]+\$[;.]?$/.test(p.text))

export function recapItemHtml(item: RecapItem, n: number, withAnswer = false): string {
  let body = `<div class="en-text">${md(item.text)}</div>`
  if (item.parts) {
    body += `<div class="${short(item) ? 'rc-parts rc-cols' : 'rc-parts'}">${item.parts.map((p, i) =>
      `<div class="rc-part">${md(`${LETTERS9[i]}) ${p.text}`)}</div>`).join('')}</div>`
  }
  if (withAnswer) {
    const ans = item.parts?.some((p) => p.ans)
      ? item.parts.map((p, i) => `${LETTERS9[i]}) ${p.ans ?? '—'}`).join('; ')
      : item.ans ?? ''
    if (ans) body += `<div class="en-answer">${md('**Răspuns:** ' + ans)}${item.note ? `<div class="rc-note">${md('*Față de carte:* ' + item.note)}</div>` : ''}</div>`
  }
  const fig = item.fig ? `<div class="en-fig">${figureSvg(item.fig)}</div>` : ''
  return `<div class="en-item"><span class="en-num">${n}.</span><div class="en-body">${body}</div>${fig}</div>`
}

export interface RecapPrint {
  student: string
  date: string
  answers: boolean
}

/** A chapter on A4 pages, an exercise never cut between two pages; the answers on a page of their own. */
export function layoutRecap(host: HTMLElement, recap: Recap, section: RecapSection, opt: RecapPrint): HTMLElement[] {
  const pages: HTMLElement[] = []
  let body!: HTMLElement
  const avail = A4.h - 2 * A4.margin
  const newPage = () => {
    const page = document.createElement('div')
    page.className = 'ws-print-page en-print'
    Object.assign(page.style, { width: A4.w + 'px', height: A4.h + 'px', padding: A4.margin + 'px' })
    body = document.createElement('div')
    page.appendChild(body)
    host.appendChild(page)
    pages.push(page)
  }
  const place = (html: string) => {
    const el = document.createElement('div')
    el.innerHTML = html
    body.appendChild(el)
    if (body.offsetHeight > avail && body.childElementCount > 1) {
      body.removeChild(el)
      newPage()
      body.appendChild(el)
    }
  }
  newPage()
  place(
    `<div class="ws-print-head"><div class="ws-print-title">${esc(recap.title)} — ${esc(section.title)}</div>` +
    `<div class="ws-print-meta"><span>Nume: ${opt.student ? `<b>${esc(opt.student)}</b>` : '<span class="ws-print-blank"></span>'}</span><span>Data: ${esc(opt.date)}</span></div></div>`,
  )
  section.items.forEach((item, i) => place(recapItemHtml(item, i + 1)))
  if (opt.answers) {
    newPage()
    place(`<div class="ws-print-head"><div class="ws-print-title">Răspunsuri — ${esc(section.title)}</div></div>`)
    for (const [k, it] of section.items.entries()) {
      const a = recapAnswer(it).replace(/^Răspuns: /, '').split('\n\n').join('; ')
      place(`<div class="en-barem-item"><b>${k + 1}.</b> ${md(a || '—')}</div>`)
    }
  }
  return pages
}

export const recapPictures = (recap: Recap, section: RecapSection, opt: RecapPrint) =>
  pagePictures((host) => layoutRecap(host, recap, section, opt))
