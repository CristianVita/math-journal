// Promise wrapper around the SymPy worker, with a timeout that kills runaway computations.

export interface IntegralStep {
  rule: string
  integrand: string
  variable: string
  result: string | null
  substeps: { field: string; cond?: string; step: IntegralStep }[]
  [field: string]: unknown
}

export interface IntegralResult {
  integrand: string
  steps: IntegralStep
  completeSteps: boolean
  antiderivative: string | null
  antiderivativeSrc?: string
  nonElementary?: boolean | null
  special?: boolean
  verified?: boolean
  a?: string
  b?: string
  definite?: string | null
  numeric?: string | null
  divergent?: boolean
  singular?: string[]
}

type Listener = (status: string, ready: boolean) => void

let worker: Worker | null = null
let seq = 0
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()
const listeners = new Set<Listener>()
let status = ''
let isReady = false

function emit() {
  for (const l of listeners) l(status, isReady)
}

function getWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('./sympyWorker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (e) => {
    const m = e.data
    if (m.type === 'status') {
      status = m.text
      emit()
    } else if (m.type === 'ready') {
      status = ''
      isReady = true
      emit()
    } else if (m.type === 'result') {
      const p = pending.get(m.id)
      pending.delete(m.id)
      if (m.ok) p?.resolve(m.data)
      else p?.reject(new Error(m.error))
    }
  }
  worker.onerror = (e) => {
    status = 'Motorul de calcul nu a putut porni: ' + e.message
    emit()
    for (const p of pending.values()) p.reject(new Error(status))
    pending.clear()
  }
  return worker
}

function reset() {
  worker?.terminate()
  worker = null
  isReady = false
  status = ''
  emit()
}

export function onStatus(l: Listener) {
  listeners.add(l)
  l(status, isReady)
  return () => {
    listeners.delete(l)
  }
}

function call<T>(req: Record<string, unknown>, timeoutMs: number): Promise<T> {
  const id = ++seq
  const w = getWorker()
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id)
      // the worker is stuck inside Python: the only way out is to kill it (next call reloads it)
      reset()
      reject(new Error('Calculul a durat prea mult și a fost oprit.'))
    }, timeoutMs)
    pending.set(id, {
      resolve: (v) => {
        clearTimeout(timer)
        resolve(v as T)
      },
      reject: (e) => {
        clearTimeout(timer)
        reject(e)
      },
    })
    w.postMessage({ id, req })
  })
}

/** Start downloading Pyodide + SymPy early (e.g. when the integral tab opens). */
export function warmUp() {
  // loading can take a while on a slow connection; it is not a runaway computation
  call({ op: 'ping' }, 180_000).catch(() => {})
}

export function integrate(expr: string, v: string, a?: string, b?: string): Promise<IntegralResult> {
  // first call also pays for loading Pyodide, so give it more time
  return call<IntegralResult>({ op: 'integrate', expr, var: v, a: a ?? null, b: b ?? null }, isReady ? 45_000 : 180_000)
}
