import type { LatLng } from '../types'
import { createStore } from './store'

type Status = 'idle' | 'loading' | 'granted' | 'denied' | 'error' | 'unsupported'
interface Geo {
  status: Status
  pos: LatLng | null
}
// Só em memória: a localização nunca é guardada nem enviada para lado nenhum.
const store = createStore<Geo>({ status: 'idle', pos: null })

export function useGeolocation() {
  const geo = store.use()
  const request = () => {
    if (!('geolocation' in navigator)) return store.set({ status: 'unsupported', pos: null })
    store.set((g) => ({ ...g, status: 'loading' }))
    navigator.geolocation.getCurrentPosition(
      (p) => store.set({ status: 'granted', pos: [p.coords.latitude, p.coords.longitude] }),
      (e) => store.set({ status: e.code === e.PERMISSION_DENIED ? 'denied' : 'error', pos: null }),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 30_000 },
    )
  }
  return { ...geo, request }
}
