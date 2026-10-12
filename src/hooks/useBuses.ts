import { useSyncExternalStore } from 'react'
import { fetchBuses, type Bus } from '../services/tracking'

export interface BusesState {
  buses: Bus[]
  /** loading = ainda sem 1.ª resposta · ok · error = última tentativa falhou (mantém os últimos dados) */
  status: 'loading' | 'ok' | 'error'
  updatedAt: Date | null
}

const POLL_MS = 10_000
let state: BusesState = { buses: [], status: 'loading', updatedAt: null }
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | null = null
let ctrl: AbortController | null = null

const emit = (s: BusesState) => {
  state = s
  listeners.forEach((l) => l())
}

async function poll(force = false) {
  if (document.hidden && !force) return
  ctrl?.abort()
  ctrl = new AbortController()
  try {
    const buses = await fetchBuses(ctrl.signal)
    emit({ buses, status: 'ok', updatedAt: new Date() })
  } catch (e) {
    if ((e as Error).name === 'AbortError') return
    emit({ ...state, status: 'error' })
  }
}

const onVisible = () => !document.hidden && poll()

function start() {
  poll(true) // a primeira leitura faz-se sempre; as seguintes só com o separador visível
  timer = setInterval(() => poll(), POLL_MS)
  document.addEventListener('visibilitychange', onVisible)
}
function stop() {
  if (timer) clearInterval(timer)
  timer = null
  ctrl?.abort()
  document.removeEventListener('visibilitychange', onVisible)
}

function subscribe(l: () => void) {
  listeners.add(l)
  if (listeners.size === 1) start() // só consulta a API enquanto houver algum componente a mostrar autocarros
  return () => {
    listeners.delete(l)
    if (listeners.size === 0) stop()
  }
}

export const refreshBuses = () => poll(true)

export function useBuses(): BusesState {
  return useSyncExternalStore(subscribe, () => state, () => state)
}
