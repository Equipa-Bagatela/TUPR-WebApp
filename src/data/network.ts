import { lines } from './lines'
import { stops } from './stops'
import type { Line, Stop } from '../types'

export const stopById = new Map<string, Stop>(stops.map((s) => [s.id, s]))
export const getStop = (id: string): Stop => {
  const s = stopById.get(id)
  if (!s) throw new Error(`Paragem desconhecida: ${id}`)
  return s
}

/** Posições (índices) em que cada linha passa numa paragem */
export interface StopPassing {
  line: Line
  index: number
}
const passings = new Map<string, StopPassing[]>()
for (const line of lines) {
  line.stops.forEach((s, index) => {
    const arr = passings.get(s.stopId) ?? []
    arr.push({ line, index })
    passings.set(s.stopId, arr)
  })
}
export const passingsOf = (stopId: string): StopPassing[] => passings.get(stopId) ?? []
export const linesAtStop = (stopId: string): Line[] => [...new Set(passingsOf(stopId).map((p) => p.line))]

export const stopLabel = (s: Stop) => (s.detail ? `${s.name} (${s.detail})` : s.name)
