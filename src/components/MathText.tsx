import { useMemo } from 'react'
import katex from 'katex'
import { marked } from 'marked'
import { bigFractions } from './bigFractions'

marked.setOptions({ gfm: true, breaks: true })

/** A formula at most this long (in LaTeX) stays on one line with the punctuation after it; a longer one may break. */
const SHORT = 24

/** Markdown with $inline$ and $$display$$ LaTeX. Math is pulled out first so markdown never mangles it. */
export function renderMathMarkdown(src: string): string {
  const math: string[] = []
  const short: boolean[] = []
  const stash = (tex: string, display: boolean) => {
    math.push(katex.renderToString(display ? tex : bigFractions(tex), { throwOnError: false, displayMode: display }))
    short.push(!display && tex.length <= SHORT)
    return `@@M${math.length - 1}@@`
  }
  const prepared = src
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t.trim(), true))
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => stash(t.trim(), true))
    .replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_, pre, t) => pre + stash(t, false))
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => stash(t, false))
  const html = marked.parse(prepared, { async: false }) as string
  return html.replace(/@@M(\d+)@@([,.;:!?)]*)/g, (_, i, after) =>
    after && short[Number(i)] ? `<span style="white-space:nowrap">${math[Number(i)]}${after}</span>` : math[Number(i)] + after)
}

export default function MathText({ text, className = '' }: { text: string; className?: string }) {
  const html = useMemo(() => renderMathMarkdown(text), [text])
  return <div className={'math-text ' + className} dangerouslySetInnerHTML={{ __html: html }} />
}
