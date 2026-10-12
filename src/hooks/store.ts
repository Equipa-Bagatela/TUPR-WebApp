import { useSyncExternalStore } from 'react'

/** Mini-store partilhada (sem dependências). */
export function createStore<T>(initial: T, opts?: { key?: string; parse?: (raw: unknown) => T }) {
  let state = initial
  if (opts?.key) {
    try {
      const raw = localStorage.getItem(opts.key)
      if (raw) state = opts.parse ? opts.parse(JSON.parse(raw)) : (JSON.parse(raw) as T)
    } catch {
      /* localStorage indisponível ou dados inválidos: usa o valor inicial */
    }
  }
  const listeners = new Set<() => void>()
  const get = () => state
  const set = (next: T | ((s: T) => T)) => {
    state = typeof next === 'function' ? (next as (s: T) => T)(state) : next
    if (opts?.key) {
      try {
        localStorage.setItem(opts.key, JSON.stringify(state))
      } catch {
        /* ignora */
      }
    }
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }
  const use = () => useSyncExternalStore(subscribe, get, get)
  return { get, set, use }
}
