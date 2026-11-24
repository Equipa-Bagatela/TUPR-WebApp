import { directJourneys, transferJourneys, type Journey } from './planner'

export type PlanMode = 'depart' | 'arrive'

/** Todas as viagens possíveis (directas e com 1 transbordo) entre duas paragens num dia, por ordem de partida. */
export function planDay(from: string, to: string, date: Date): Journey[] {
  const wd = date.getDay()
  const direct = directJourneys(from, to, wd)
  const transfers = transferJourneys(from, to, wd, direct)
  return [...direct, ...transfers].sort((a, b) => a.depart - b.depart || a.arrive - b.arrive)
}

/** Primeiro dia depois de `date` (até 7 dias) com viagens para este percurso. */
export function nextServiceDay(from: string, to: string, date: Date, maxDays = 7): { date: Date; journeys: Journey[] } | null {
  for (let i = 1; i <= maxDays; i++) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i)
    const journeys = planDay(from, to, d)
    if (journeys.length) return { date: d, journeys }
  }
  return null
}

/** Espera (min) entre as duas viagens de um transbordo; 0 se for directa. */
export const transferWait = (j: Journey) => (j.legs.length > 1 ? j.legs[1].depart - j.legs[0].arrive : 0)
export const LONG_WAIT = 20
const MAIN_COUNT = 5

export interface Ranked {
  /** Opções principais (as mais úteis, por ordem de partida) */
  main: Journey[]
  /** Restantes: esperas longas ou que passam do limite */
  more: Journey[]
  /** id da que chega mais cedo */
  earliest: string | null
  /** id da mais rápida (menor duração) */
  fastest: string | null
  /** só no modo "chegar até": a que parte mais tarde e ainda chega a tempo */
  latest: string | null
}

export function rank(list: Journey[], mode: PlanMode = 'depart'): Ranked {
  if (!list.length) return { main: [], more: [], earliest: null, fastest: null, latest: null }
  const earliest = [...list].sort((a, b) => a.arrive - b.arrive || a.duration - b.duration)[0]
  const fastest = [...list].sort((a, b) => a.duration - b.duration || a.arrive - b.arrive)[0]
  const latest = mode === 'arrive' ? [...list].sort((a, b) => b.depart - a.depart || a.duration - b.duration)[0] : null
  // no modo "chegar até" interessam as que partem mais perto da hora-limite (as últimas); no outro, as primeiras
  const ordered = mode === 'arrive' ? [...list].reverse() : list
  const good = ordered.filter((j) => transferWait(j) <= LONG_WAIT)
  let main = good.slice(0, MAIN_COUNT)
  if (!main.length) main = ordered.slice(0, 3)
  const ids = new Set(main.map((j) => j.id))
  const more = ordered.filter((j) => !ids.has(j.id))
  const byDepart = (a: Journey, b: Journey) => a.depart - b.depart || a.arrive - b.arrive
  return { main: main.sort(byDepart), more: more.sort(byDepart), earliest: earliest.id, fastest: fastest.id, latest: latest?.id ?? null }
}

/** Modo "chegar até às": só as viagens que chegam até à hora indicada. */
export const arrivingBy = (list: Journey[], targetMin: number) => list.filter((j) => j.arrive <= targetMin)
