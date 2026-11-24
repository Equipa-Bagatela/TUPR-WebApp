import type { Line } from '../types'
import { runningTrips } from './service'
import { toMinutes } from './time'

export interface NextRun {
  /** "HH:MM" da partida no início do circuito */
  time: string
  /** 0 = hoje, 1 = amanhã, … */
  dayOffset: number
  /** dia da semana dessa partida (0 = domingo) */
  weekday: number
}

export interface RunState {
  /** Há uma viagem prevista a decorrer neste momento (segundo o horário). */
  scheduledNow: boolean
  /** Próxima partida do início do circuito (se não houver nenhuma a decorrer ou a seguir hoje, procura nos dias seguintes). */
  next: NextRun | null
}

/** O que diz o horário sobre uma linha neste momento: a circular ou não, e quando é a próxima partida. */
export function lineRunState(line: Line, now: Date): RunState {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const last = line.stops.length - 1
  const today = runningTrips(line, now.getDay())
  const scheduledNow = today.some(({ index }) => {
    const start = toMinutes(line.stops[0].times[index])
    const end = toMinutes(line.stops[last].times[index])
    return nowMin >= start && nowMin <= end
  })
  for (let offset = 0; offset < 8; offset++) {
    const wd = (now.getDay() + offset) % 7
    const starts = runningTrips(line, wd)
      .map(({ index }) => line.stops[0].times[index])
      .filter((t) => offset > 0 || toMinutes(t) > nowMin)
      .sort()
    if (starts.length) return { scheduledNow, next: { time: starts[0], dayOffset: offset, weekday: wd } }
  }
  return { scheduledNow, next: null }
}

/** A mais próxima de várias partidas (ex.: entre as duas linhas). */
export function earliest(runs: (NextRun | null)[]): NextRun | null {
  return runs.filter((r): r is NextRun => !!r).sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time))[0] ?? null
}
