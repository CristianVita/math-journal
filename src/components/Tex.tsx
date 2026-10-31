import { useMemo } from 'react'
import katex from 'katex'

export function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false, displayMode: display }), [tex, display])
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
