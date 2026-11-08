import { useRef, useState } from 'react'

export interface PromptField {
  label: string
  value?: string
  placeholder?: string
  hint?: string
  /** makes the field a choice instead of a text box */
  options?: { value: string; label: string }[]
  /** show this field only while another field (by index) has the given value (or one of them) */
  showIf?: { field: number; value: string | string[] }
}

interface State {
  title: string
  fields: PromptField[]
  values: string[]
  info: boolean
  /** text of the OK button, red when `danger` */
  okLabel?: string
  danger?: boolean
  /** a line of explanation under the title, and the text of the cancel button */
  detail?: string
  cancelLabel?: string
  /** looks at the values before the dialog closes: a message keeps it open, with the values as they were */
  check?: (values: string[]) => string | null
  error?: string | null
}

// In-app replacement for window.prompt and window.confirm (which are unreliable inside desktop webviews:
// they may return at once without showing anything).
export function usePrompt() {
  const [state, setState] = useState<State | null>(null)
  const resolver = useRef<((v: string[] | null) => void) | null>(null)

  /**
   * Several inputs in one dialog; resolves with the values in order, or null when cancelled.
   * With `check`, a wrong answer is explained inside the dialog, which stays open for it to be put right.
   */
  const askForm = (title: string, fields: PromptField[], check?: (values: string[]) => string | null) =>
    new Promise<string[] | null>((resolve) => {
      resolver.current = resolve
      setState({ title, fields, values: fields.map((f) => f.value ?? ''), info: false, check })
    })

  /** One input (or, with info = true, just a message with OK). */
  const ask = (title: string, value = '', info = false) =>
    new Promise<string | null>((resolve) => {
      resolver.current = (v) => resolve(v ? v[0] : null)
      setState({ title, fields: info ? [] : [{ label: '', value }], values: [value], info })
    })

  /** A yes / no question; resolves true when confirmed. */
  const confirm = (title: string, okLabel = 'Da', danger = true, extra: { detail?: string; cancelLabel?: string } = {}) =>
    new Promise<boolean>((resolve) => {
      resolver.current = (v) => resolve(v !== null)
      setState({ title, fields: [], values: [], info: false, okLabel, danger, ...extra })
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
          const error = state.check?.(state.values) ?? null
          if (error) setState({ ...state, error })
          else close(state.values)
        }}
      >
        <div className="modal-title">{state.title}</div>
        {state.detail && <p className="modal-detail">{state.detail}</p>}
        {state.fields.map((f, i) => {
          if (f.showIf) {
            const v = state.values[f.showIf.field]
            const want = f.showIf.value
            if (Array.isArray(want) ? !want.includes(v) : v !== want) return null
          }
          const set = (val: string) => setState({ ...state, error: null, values: state.values.map((v, j) => (j === i ? val : v)) })
          return (
            <label key={i} className="field">
              {f.label}
              {f.options ? (
                <select autoFocus={i === 0} value={state.values[i]} onChange={(e) => set(e.target.value)}>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input autoFocus={i === 0} value={state.values[i]} placeholder={f.placeholder} onChange={(e) => set(e.target.value)} />
              )}
              {f.hint && <span className="muted small">{f.hint}</span>}
            </label>
          )
        })}
        {state.error && <p className="modal-error" role="alert">{state.error}</p>}
        <div className="modal-actions">
          {!state.info && <button type="button" className="btn" onClick={() => close(null)}>{state.cancelLabel ?? 'Renunță'}</button>}
          <button type="submit" className={'btn primary' + (state.danger ? ' danger-fill' : '')} autoFocus={state.info || !state.fields.length}>
            {state.okLabel ?? 'OK'}
          </button>
        </div>
      </form>
    </div>
  )

  return { ask, askForm, confirm, dialog }
}
