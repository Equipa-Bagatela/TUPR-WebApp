import { localeOf, tr } from '../i18n'

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export const fromMinutes = (min: number): string => {
  const h = Math.floor(min / 60) % 24
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
export const pad = (n: number) => String(n).padStart(2, '0')
export const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const parseIsoDate = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}
export const minutesOfDay = (d: Date) => d.getHours() * 60 + d.getMinutes()

/** "13 min", "1h 04" */
export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${pad(m)}`
}

/** Tempo relativo para uma partida: "agora", "em 3 min", "em 1h 04" */
export function formatRelative(departureMin: number, now: Date): string {
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  const diff = Math.ceil(departureMin - nowMin)
  if (diff <= 0) return tr('time.now')
  return tr('time.in', { d: formatDuration(diff) })
}

/** 0 = domingo … 6 = sábado. Nome do dia no idioma actual, com maiúscula inicial. */
export function weekdayName(d: number, style: 'long' | 'short' = 'long'): string {
  const date = new Date(2024, 0, 7 + d) // 7 jan 2024 foi domingo
  const s = date.toLocaleDateString(localeOf(), { weekday: style }).replace('.', '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}
