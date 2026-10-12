import type { Line, Trip } from '../types'

/** 0 = domingo … 6 = sábado (Date.getDay) */
export function tripRunsOn(trip: Trip, weekday: number): boolean {
  if (weekday === 0) return false // o PDF só refere segunda a sábado
  if (trip.days === 'mon-sat') return true
  return weekday >= 1 && weekday <= 5
}
export const hasServiceOn = (weekday: number) => weekday >= 1 && weekday <= 6

export function runningTrips(line: Line, weekday: number) {
  return line.trips.map((trip, index) => ({ trip, index })).filter(({ trip }) => tripRunsOn(trip, weekday))
}

export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}
