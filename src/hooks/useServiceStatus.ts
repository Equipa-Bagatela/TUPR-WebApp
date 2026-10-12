import { useEffect, useState } from 'react'
import { fetchServiceStatus } from '../data/service'
import type { ServiceStatus } from '../types'

export function useServiceStatus() {
  const [state, setState] = useState<{ loading: boolean; error: boolean; status: ServiceStatus | null }>({
    loading: true,
    error: false,
    status: null,
  })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: false }))
    fetchServiceStatus()
      .then((status) => alive && setState({ loading: false, error: false, status }))
      .catch(() => alive && setState({ loading: false, error: true, status: null }))
    return () => {
      alive = false
    }
  }, [attempt])
  return { ...state, retry: () => setAttempt((a) => a + 1) }
}
