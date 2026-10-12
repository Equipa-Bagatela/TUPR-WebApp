import { stops } from '../data/stops'
import { getLang } from '../i18n'
import type { LatLng, Stop } from '../types'

export function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000
  const rad = (x: number) => (x * Math.PI) / 180
  const dLat = rad(b[0] - a[0])
  const dLng = rad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function nearestStops(pos: LatLng, limit = 5): { stop: Stop; meters: number }[] {
  return stops
    .filter((s) => s.coords)
    .map((stop) => ({ stop, meters: distanceMeters(pos, stop.coords!) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, limit)
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m / 10) * 10} m`
  const v = (m / 1000).toFixed(1)
  return `${getLang() === 'pt' ? v.replace('.', ',') : v} km`
}
