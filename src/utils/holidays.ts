import type { Key } from '../i18n'

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
export function easter(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const same = (a: Date, m: number, day: number) => a.getMonth() === m - 1 && a.getDate() === day
const sameDate = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

/**
 * Chave de tradução do feriado NACIONAL português nessa data (ou null).
 * Não inclui o feriado municipal do Peso da Régua nem tolerâncias de ponto.
 */
export function nationalHoliday(d: Date): Key | null {
  const fixed: [number, number, Key][] = [
    [1, 1, 'hol.newYear'], [4, 25, 'hol.freedom'], [5, 1, 'hol.labour'], [6, 10, 'hol.portugal'], [8, 15, 'hol.assumption'],
    [10, 5, 'hol.republic'], [11, 1, 'hol.allSaints'], [12, 1, 'hol.restoration'], [12, 8, 'hol.immaculate'], [12, 25, 'hol.christmas'],
  ]
  for (const [m, day, key] of fixed) if (same(d, m, day)) return key
  const e = easter(d.getFullYear())
  if (sameDate(d, addDays(e, -2))) return 'hol.goodFriday'
  if (sameDate(d, e)) return 'hol.easter'
  if (sameDate(d, addDays(e, 60))) return 'hol.corpus'
  return null
}
