// Visual formula editor (MathLive): typing "/" makes a real fraction bar, "^" goes to the exponent,
// and touch devices get a math keyboard. It reports its content as plain text that our parser understands,
// or as LaTeX with format="latex" (the LaTeX scratchpad).
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { MathfieldElement } from 'mathlive'
import { asciiToInput } from '../calculus/expr'

// The KaTeX fonts are already loaded by the app's stylesheet; don't fetch a second copy. No click sounds.
MathfieldElement.fontsDirectory = null
MathfieldElement.soundsDirectory = null

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // React 18 passes props of custom elements through as attributes, so it needs `class`, not `className`
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { placeholder?: string; class?: string }
    }
  }
}

export interface MathInputHandle {
  insert: (latex: string) => void
  focus: () => void
}

interface Props {
  /** Current value as plain text (the same syntax as the text input), e.g. "(x^2+1)/(x-1)". */
  text: string
  /** LaTeX to show when `text` was changed from outside (an example button, a reset). */
  toLatex: (text: string) => string | null
  onChange: (text: string) => void
  placeholder?: string
  /** "input" (default): the calculator's plain-text syntax; "latex": LaTeX, and symbol palette clicks insert here. */
  format?: 'input' | 'latex'
}

const MathInput = forwardRef<MathInputHandle, Props>(function MathInput({ text, toLatex, onChange, placeholder, format = 'input' }, ref) {
  const mfRef = useRef<MathfieldElement | null>(null)
  const lastEmitted = useRef<string | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const formatRef = useRef(format)
  formatRef.current = format

  useImperativeHandle(ref, () => ({
    insert: (latex) => {
      const mf = mfRef.current
      if (!mf) return
      mf.insert(latex, { focus: true, selectionMode: 'placeholder', insertionMode: 'replaceSelection' })
      emit()
    },
    focus: () => mfRef.current?.focus(),
  }))

  const emit = () => {
    const mf = mfRef.current
    if (!mf) return
    const t = formatRef.current === 'latex' ? mf.getValue('latex') : asciiToInput(mf.getValue('ascii-math'))
    lastEmitted.current = t
    onChangeRef.current(t)
  }

  useEffect(() => {
    const mf = mfRef.current
    if (!mf) return
    const configure = () => {
      mf.smartFence = true
      mf.smartSuperscript = true
      // Romanian function names, so typing "tg" or "arctg" becomes an upright function name. This must
      // run once the field is mounted: before that the getter is empty and we would drop the defaults (ln, sin…).
      mf.inlineShortcuts = {
        ...mf.inlineShortcuts,
        tg: '\\operatorname{tg}',
        ctg: '\\operatorname{ctg}',
        arctg: '\\operatorname{arctg}',
        arcctg: '\\operatorname{arcctg}',
      }
    }
    if (mf.isConnected && Object.keys(mf.inlineShortcuts ?? {}).length) configure()
    else mf.addEventListener('mount', configure, { once: true })
    const onInput = () => emit()
    mf.addEventListener('input', onInput)
    return () => {
      mf.removeEventListener('input', onInput)
      mf.removeEventListener('mount', configure)
    }
  }, [])

  // a change that did not come from typing in this field (example button…): show it as a formula
  useEffect(() => {
    const mf = mfRef.current
    if (!mf || text === lastEmitted.current) return
    const latex = text.trim() ? toLatex(text) : ''
    if (latex !== null) mf.setValue(latex, { silenceNotifications: true })
    lastEmitted.current = text
  }, [text, toLatex])

  return (
    <math-field
      ref={(el: HTMLElement | null) => {
        mfRef.current = el as MathfieldElement | null
      }}
      class="math-input"
      placeholder={placeholder}
      data-math={format === 'latex' ? '' : undefined}
    />
  )
})

export default MathInput
