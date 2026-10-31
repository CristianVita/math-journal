import { useMemo } from 'react'
import katex from 'katex'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

/** Markdown with $inline$ and $$display$$ LaTeX. Math is pulled out first so markdown never mangles it. */
export function renderMathMarkdown(src: string): string {
  const math: string[] = []
  const stash = (tex: string, display: boolean) => {
    math.push(katex.renderToString(tex, { throwOnError: false, displayMode: display }))
    return `@@M${math.length - 1}@@`
  }
  const prepared = src
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t.trim(), true))
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => stash(t.trim(), true))
    .replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_, pre, t) => pre + stash(t, false))
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => stash(t, false))
  const html = marked.parse(prepared, { async: false }) as string
  return html.replace(/@@M(\d+)@@/g, (_, i) => math[Number(i)])
}

export default function MathText({ text, className = '' }: { text: string; className?: string }) {
  const html = useMemo(() => renderMathMarkdown(text), [text])
  return <div className={'math-text ' + className} dangerouslySetInnerHTML={{ __html: html }} />
}
