import { lines } from '../data/lines'
import type { Line } from '../types'
import { runningTrips } from './service'
import { toMinutes } from './time'

export interface Leg {
  line: Line
  tripIndex: number
  fromStopId: string
  toStopId: string
  depart: number
  arrive: number
  /** nº de paragens percorridas (excluindo a de partida) */
  stopCount: number
  fromIndex: number
  toIndex: number
}

export interface Journey {
  id: string
  legs: Leg[]
  depart: number
  arrive: number
  duration: number
}

/** Tempo mínimo de transbordo (min). Não vem do PDF: é uma folga razoável para trocar de autocarro. */
export const MIN_TRANSFER = 2

function legsBetween(line: Line, tripIndex: number, fromId: string, toId: string): Leg | null {
  let best: Leg | null = null
  line.stops.forEach((s, i) => {
    if (s.stopId !== fromId) return
    for (let k = i + 1; k < line.stops.length; k++) {
      if (line.stops[k].stopId !== toId) continue
      const depart = toMinutes(s.times[tripIndex])
      const arrive = toMinutes(line.stops[k].times[tripIndex])
      if (!best || arrive < best.arrive) {
        best = { line, tripIndex, fromStopId: fromId, toStopId: toId, depart, arrive, stopCount: k - i, fromIndex: i, toIndex: k }
      }
      break // primeira ocorrência do destino depois da origem
    }
  })
  return best
}

/** Viagens directas (todas as do dia; o chamador decide o que já passou). */
export function directJourneys(from: string, to: string, weekday: number): Journey[] {
  const out: Journey[] = []
  for (const line of lines) {
    for (const { index } of runningTrips(line, weekday)) {
      const leg = legsBetween(line, index, from, to)
      if (leg) out.push({ id: `${line.id}-${index}`, legs: [leg], depart: leg.depart, arrive: leg.arrive, duration: leg.arrive - leg.depart })
    }
  }
  return out.sort((a, b) => a.depart - b.depart || a.arrive - b.arrive)
}

/** Viagens com um transbordo (linhas diferentes, na mesma paragem). Só devolve as não dominadas por uma directa. */
export function transferJourneys(from: string, to: string, weekday: number, direct: Journey[]): Journey[] {
  const out: Journey[] = []
  const lineA = lines
  for (const a of lineA) {
    const mids = new Set(a.stops.map((s) => s.stopId))
    for (const b of lines) {
      if (b.id === a.id) continue
      const shared = [...mids].filter((id) => id !== from && id !== to && b.stops.some((s) => s.stopId === id))
      for (const { index: ia } of runningTrips(a, weekday)) {
        let best: Journey | null = null
        for (const mid of shared) {
          const l1 = legsBetween(a, ia, from, mid)
          if (!l1) continue
          for (const { index: ib } of runningTrips(b, weekday)) {
            const l2 = legsBetween(b, ib, mid, to)
            if (!l2 || l2.depart < l1.arrive + MIN_TRANSFER) continue
            const j: Journey = {
              id: `${a.id}-${ia}>${b.id}-${ib}@${mid}`,
              legs: [l1, l2],
              depart: l1.depart,
              arrive: l2.arrive,
              duration: l2.arrive - l1.depart,
            }
            if (!best || j.arrive < best.arrive) best = j
          }
        }
        if (best) out.push(best)
      }
    }
  }
  const useful = out.filter((t) => !direct.some((d) => d.depart >= t.depart && d.arrive <= t.arrive))
  // por hora de partida, fica o que chega mais cedo
  const byDep = new Map<number, Journey>()
  for (const j of useful) {
    const cur = byDep.get(j.depart)
    if (!cur || j.arrive < cur.arrive) byDep.set(j.depart, j)
  }
  return [...byDep.values()].sort((a, b) => a.depart - b.depart)
}
