import { lines } from '../data/lines'
import { getStop, passingsOf } from '../data/network'
import type { Line } from '../types'
import { toMinutes } from './time'
import { runningTrips } from './service'

export interface Departure {
  line: Line
  tripIndex: number
  /** minutos desde as 00:00 */
  minutes: number
  time: string
  /** Paragem seguinte (nome) – dá o sentido de marcha no circuito */
  nextStopId: string | null
  /** dias à frente (0 = hoje) */
  dayOffset: number
}

/** Todas as passagens (partidas) de uma paragem num dia da semana. A última paragem de cada viagem é só chegada, por isso é ignorada. */
export function departuresOnDay(stopId: string, weekday: number, dayOffset = 0): Departure[] {
  const out: Departure[] = []
  for (const { line, index } of passingsOf(stopId)) {
    if (index === line.stops.length - 1) continue
    for (const { index: tripIndex } of runningTrips(line, weekday)) {
      const time = line.stops[index].times[tripIndex]
      out.push({ line, tripIndex, time, minutes: toMinutes(time), nextStopId: line.stops[index + 1].stopId, dayOffset })
    }
  }
  return out.sort((a, b) => a.minutes - b.minutes || a.line.id.localeCompare(b.line.id))
}

/** Próximas partidas a partir de `now` (mesmo dia; se não houver, procura nos dias seguintes). */
export function nextDepartures(stopId: string, now: Date, limit = 6): Departure[] {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const result: Departure[] = []
  for (let offset = 0; offset < 8 && result.length < limit; offset++) {
    const wd = (now.getDay() + offset) % 7
    const day = departuresOnDay(stopId, wd, offset)
    for (const d of day) {
      if (offset === 0 && d.minutes < nowMin) continue
      result.push(d)
      if (result.length >= limit) break
    }
  }
  return result
}

export const allStopsWithService = () => new Set(lines.flatMap((l) => l.stops.map((s) => s.stopId)))
export const stopName = (id: string) => getStop(id).name
