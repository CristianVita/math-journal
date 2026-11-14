// A national evaluation model as HTML, the same on the page and on paper: the points in a box, the number, the
// statement, the answers to choose from on one line, the parts of subject III, the figure on the right.
import { renderMathMarkdown } from '../components/MathText'
import { A4, pagePictures } from '../worksheets/worksheetExport'
import { figureSvg } from './figure'
import { LETTERS, SUBJECTS, choicesText, subjectOf, type EnItem, type EnModel } from './types'

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const md = (s: string) => renderMathMarkdown(s)

export function itemHtml(item: EnItem, i: number, withAnswer = false): string {
  const three = subjectOf(i) === 2
  let body = item.text.trim() ? `<div class="en-text">${md(item.text)}</div>` : ''
  if (item.choices) body += `<div class="en-choices">${md(choicesText(item.choices))}</div>`
  for (const [k, p] of (item.parts ?? []).entries()) {
    body += `<div class="en-part"><span class="en-pts">${p.pts}p</span><div class="en-part-text">${md(`${LETTERS[k]}) ${p.text}`)}</div></div>`
  }
  if (withAnswer) {
    const ans = item.choices && item.ans != null
      ? `${LETTERS[item.ans]}) ${item.choices[item.ans]}`
      : (item.parts ?? []).map((p, k) => `${LETTERS[k]}) ${p.ans ?? '—'}`).join('<br>')
    if (ans) body += `<div class="en-answer">${md('**Barem:** ' + ans)}</div>`
  }
  const fig = item.fig ? `<div class="en-fig">${figureSvg(item.fig)}</div>` : ''
  return `<div class="en-item">${three ? '<span class="en-pts en-pts-none"></span>' : '<span class="en-pts">5p</span>'}<span class="en-num">${i + 1}.</span><div class="en-body">${body}</div>${fig}</div>`
}

export const subjectHtml = (s: number, own = false) =>
  `<div class="en-subject"><b>${SUBJECTS[s].title}.</b> <i>${SUBJECTS[s].hint}</i> ${own ? '' : '<i>(30 de puncte)</i>'}</div>`

export interface PrintOptions {
  student: string
  date: string
  /** the answer key on a page of its own, at the end */
  barem: boolean
}

/** The model laid out on A4 pages inside `host`; an exercise is never cut between two pages. */
export function layoutModel(host: HTMLElement, model: EnModel, opt: PrintOptions): HTMLElement[] {
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
  const place = (html: string, keepWithNext = false) => {
    const el = document.createElement('div')
    el.innerHTML = html
    body.appendChild(el)
    if (body.offsetHeight > avail && body.childElementCount > 1) {
      body.removeChild(el)
      // a subject's title never stays alone at the bottom of a page
      const last = body.lastElementChild as HTMLElement | null
      const carry = last?.dataset.keep ? last : null
      if (carry) body.removeChild(carry)
      newPage()
      if (carry) body.appendChild(carry)
      body.appendChild(el)
    }
    if (keepWithNext) el.dataset.keep = '1'
  }

  newPage()
  place(
    `<div class="ws-print-head"><div class="ws-print-title">${esc(model.title)}</div>` +
    `<div class="ws-print-meta"><span>Nume: ${opt.student ? `<b>${esc(opt.student)}</b>` : '<span class="ws-print-blank"></span>'}</span><span>Data: ${esc(opt.date)}</span></div></div>`,
  )
  model.items.forEach((item, i) => {
    if (i % 6 === 0) place(subjectHtml(subjectOf(i), model.own), true)
    place(itemHtml(item, i))
  })
  if (!model.own) place('<div class="en-note">Toate subiectele sunt obligatorii. Se acordă 10 puncte din oficiu. Timp de lucru: 2 ore.</div>')

  if (opt.barem && model.items.some((it) => it.ans != null || it.parts?.some((p) => p.ans))) {
    newPage()
    place(`<div class="ws-print-head"><div class="ws-print-title">Barem — ${esc(model.title)}</div></div>`)
    place(baremHtml(model))
  }
  return pages
}

/** The answer key: subjects I and II as letters in a row, subject III part by part. */
export function baremHtml(model: EnModel): string {
  const grid = (from: number) =>
    `<div class="en-barem-row">${model.items.slice(from, from + 6).map((it, k) =>
      `<span><b>${from + k + 1}.</b> ${it.ans != null ? LETTERS[it.ans] : '—'}</span>`).join('')}</div>`
  const three = model.items.slice(12).map((it, k) =>
    `<div class="en-barem-item"><b>${13 + k}.</b> ${md((it.parts ?? []).map((p, j) => `${LETTERS[j]}) ${p.ans ?? '—'}`).join('; '))}</div>`).join('')
  return `<div class="en-barem"><div class="en-subject"><b>Subiectul I</b></div>${grid(0)}<div class="en-subject"><b>Subiectul II</b></div>${grid(6)}<div class="en-subject"><b>Subiectul III</b></div>${three}</div>`
}

export const modelPictures = (model: EnModel, opt: PrintOptions) => pagePictures((host) => layoutModel(host, model, opt))
