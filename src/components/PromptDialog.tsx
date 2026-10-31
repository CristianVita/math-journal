import { useRef, useState } from 'react'

// In-app replacement for window.prompt (which is unreliable inside desktop webviews).
export function usePrompt() {
  const [state, setState] = useState<{ title: string; value: string; info: boolean } | null>(null)
  const resolver = useRef<((v: string | null) => void) | null>(null)

  const ask = (title: string, value = '', info = false) =>
    new Promise<string | null>((resolve) => {
      resolver.current = resolve
      setState({ title, value, info })
    })

  const close = (v: string | null) => {
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
          close(state.value)
        }}
      >
        <div className="modal-title">{state.title}</div>
        {!state.info && (
          <input autoFocus value={state.value} onChange={(e) => setState({ ...state, value: e.target.value })} />
        )}
        <div className="modal-actions">
          {!state.info && <button type="button" className="btn" onClick={() => close(null)}>Renunță</button>}
          <button type="submit" className="btn primary" autoFocus={state.info}>OK</button>
        </div>
      </form>
    </div>
  )

  return { ask, dialog }
}
