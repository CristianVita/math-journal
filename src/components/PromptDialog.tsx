import { useRef, useState } from 'react'

export interface PromptField {
  label: string
  value?: string
  placeholder?: string
  hint?: string
}

interface State {
  title: string
  fields: PromptField[]
  values: string[]
  info: boolean
}

// In-app replacement for window.prompt (which is unreliable inside desktop webviews).
export function usePrompt() {
  const [state, setState] = useState<State | null>(null)
  const resolver = useRef<((v: string[] | null) => void) | null>(null)

  /** Several inputs in one dialog; resolves with the values in order, or null when cancelled. */
  const askForm = (title: string, fields: PromptField[]) =>
    new Promise<string[] | null>((resolve) => {
      resolver.current = resolve
      setState({ title, fields, values: fields.map((f) => f.value ?? ''), info: false })
    })

  /** One input (or, with info = true, just a message with OK). */
  const ask = (title: string, value = '', info = false) =>
    new Promise<string | null>((resolve) => {
      resolver.current = (v) => resolve(v ? v[0] : null)
      setState({ title, fields: info ? [] : [{ label: '', value }], values: [value], info })
    })

  const close = (v: string[] | null) => {
    resolver.current?.(v)
    resolver.current = null
    setState(null)
  }

  const dialog = state && (
    <div className="modal-backdrop" onPointerDown={(e) => e.target === e.currentTarget && close(null)}>
      <form
        className="modal small"
        onSubmit={(e) => {
          e.preventDefault()
          close(state.values)
        }}
      >
        <div className="modal-title">{state.title}</div>
        {state.fields.map((f, i) => (
          <label key={i} className="field">
            {f.label}
            <input
              autoFocus={i === 0}
              value={state.values[i]}
              placeholder={f.placeholder}
              onChange={(e) => setState({ ...state, values: state.values.map((v, j) => (j === i ? e.target.value : v)) })}
            />
            {f.hint && <span className="muted small">{f.hint}</span>}
          </label>
        ))}
        <div className="modal-actions">
          {!state.info && <button type="button" className="btn" onClick={() => close(null)}>Renunță</button>}
          <button type="submit" className="btn primary" autoFocus={state.info}>OK</button>
        </div>
      </form>
    </div>
  )

  return { ask, askForm, dialog }
}
