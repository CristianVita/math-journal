// Tracks the last focused text field marked with data-math, so palette clicks know where to insert.
import type { MathfieldElement } from 'mathlive'

let lastField: HTMLTextAreaElement | HTMLInputElement | MathfieldElement | null = null

document.addEventListener('focusin', (e) => {
  const t = e.target as HTMLElement
  if (t.dataset?.math === undefined) return
  if (t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement) lastField = t
  else if (t.tagName === 'MATH-FIELD') lastField = t as MathfieldElement
})

export function hasTarget() {
  return !!lastField && document.contains(lastField)
}

/** True when the caret sits inside an open $...$ in the field, so we should not add more delimiters. */
function caretInMath(value: string, pos: number) {
  const before = value.slice(0, pos).replace(/\\\$/g, '')
  return (before.match(/\$/g)?.length ?? 0) % 2 === 1
}

/** Insert LaTeX at the caret of the last math field. Returns false when there is no field (caller copies instead). */
export function insertLatex(tex: string, wrap: boolean): boolean {
  const el = lastField
  if (!el || !document.contains(el)) return false
  if (!(el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement)) {
    // visual formula editor: it is already math, so never add $...$
    el.insert(tex, { focus: true, selectionMode: 'placeholder', insertionMode: 'replaceSelection' })
    return true
  }
  el.focus()
  const start = el.selectionStart ?? el.value.length
  const text = wrap && !caretInMath(el.value, start) ? `$${tex}$` : tex
  // execCommand keeps the browser undo stack and fires React's onChange
  if (!document.execCommand('insertText', false, text)) {
    const end = el.selectionEnd ?? start
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')!.set!
    setter.call(el, el.value.slice(0, start) + text + el.value.slice(end))
    el.selectionStart = el.selectionEnd = start + text.length
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
  return true
}
