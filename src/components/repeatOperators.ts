// A formula that breaks after an operation sign (+, −, ·, :) has the sign written again at the start of the next line,
// as it is done by hand in a Romanian notebook (asked for by the user on 25 November 2026). KaTeX cannot do it: it
// breaks between its `.base` pieces and leaves the sign at the end of the line. So the formulas are looked at after
// they are laid out, and again when their width changes.

const SIGNS = new Set(['+', '-', '−', '⋅', '·', '×', ':', '÷'])

/**
 * The operation sign a piece of a formula ends with, or null. `tex`: the formula as it was written; in f : A → B the
 * colon is not a division.
 */
export function endSign(base: Element, tex: string): Element | null {
  let last = base.lastElementChild
  while (last && (last.classList.contains('mspace') || last.classList.contains('strut'))) last = last.previousElementSibling
  if (!last || !(last.classList.contains('mbin') || last.classList.contains('mrel'))) return null
  const s = last.textContent ?? ''
  if (!SIGNS.has(s)) return null
  return s === ':' && /\\(?:to|rightarrow|mapsto)\b|\\mid/.test(tex) ? null : last
}

const texOf = (html: Element) => html.closest('.katex')?.querySelector('annotation')?.textContent ?? ''

/** Writes the signs again in one formula (its `.katex-html`), for the width it has now. */
function repeatIn(html: Element) {
  html.querySelectorAll(':scope > .base > .rep-op').forEach((x) => x.remove())
  const bases = [...html.children].filter((x) => x.classList.contains('base'))
  const tex = bases.length > 1 ? texOf(html) : ''
  for (let i = 1; i < bases.length; i++) {
    const sign = endSign(bases[i - 1], tex)
    if (!sign) continue
    // on a new line: it starts to the left of where the piece before it ends. One after another, as a sign written
    // again makes its line longer and may move the breaks after it
    if (bases[i].getBoundingClientRect().left >= bases[i - 1].getBoundingClientRect().right - 1) continue
    const again = sign.cloneNode(true) as HTMLElement
    const wrap = document.createElement('span')
    wrap.className = 'rep-op'
    wrap.append(again)
    const strut = bases[i].firstElementChild
    if (strut?.classList.contains('strut')) strut.after(wrap)
    else bases[i].prepend(wrap)
  }
}

/** The formulas that can break: in the text, not on a drawing. */
const formulasIn = (root: ParentNode) => [...root.querySelectorAll('.katex-html')].filter((h) =>
  h.children.length > 1 && !h.closest('.katex-display') && !h.closest('svg'))

/** Writes the signs again in all the formulas of an element that is laid out in the page. */
export function repeatOperators(root: ParentNode) {
  for (const h of formulasIn(root)) repeatIn(h)
}

/** Keeps the signs right everywhere in the page: new formulas, and those whose place changes its width. */
export function watchOperators(root: HTMLElement) {
  const width = new WeakMap<Element, number>()
  const resized = new ResizeObserver((entries) => {
    for (const e of entries) {
      const w = e.contentRect.width
      if (width.get(e.target) === w) continue
      width.set(e.target, w)
      repeatOperators(e.target)
    }
  })
  const seen = new WeakSet<Element>()
  const look = (el: ParentNode) => {
    for (const h of formulasIn(el)) {
      repeatIn(h)
      // the paragraph (or other block) the formula is in: its width says where the lines break
      const block = h.closest('p, li, td, th, div')
      if (block && !seen.has(block)) {
        seen.add(block)
        resized.observe(block)
      }
    }
  }
  new MutationObserver((list) => {
    const added = new Set<Element>()
    for (const m of list) {
      for (const n of m.addedNodes) {
        if (n instanceof HTMLElement && !n.classList.contains('rep-op') && (n.matches('.katex, .katex-html') || n.querySelector('.katex'))) added.add(n.parentElement ?? n)
      }
    }
    for (const el of added) if (el.isConnected) look(el)
  }).observe(root, { childList: true, subtree: true })
  look(root)
  // the widths change once the fonts of the formulas are there
  document.fonts?.addEventListener('loadingdone', () => repeatOperators(root))
}
