import { describe, expect, it } from 'vitest'
import { easter, nationalHoliday } from './holidays'

describe('feriados nacionais', () => {
  it('calcula a Páscoa', () => {
    expect(easter(2026)).toEqual(new Date(2026, 3, 5))
    expect(easter(2027)).toEqual(new Date(2027, 2, 28))
    expect(easter(2025)).toEqual(new Date(2025, 3, 20))
  })
  it('feriados fixos e móveis', () => {
    expect(nationalHoliday(new Date(2026, 11, 25))).toBe('hol.christmas')
    expect(nationalHoliday(new Date(2026, 3, 25))).toBe('hol.freedom')
    expect(nationalHoliday(new Date(2026, 3, 3))).toBe('hol.goodFriday') // Páscoa a 5 de abril de 2026
    expect(nationalHoliday(new Date(2026, 3, 5))).toBe('hol.easter')
    expect(nationalHoliday(new Date(2026, 5, 4))).toBe('hol.corpus')
  })
  it('dias normais não são feriado', () => {
    expect(nationalHoliday(new Date(2026, 10, 23))).toBeNull()
    expect(nationalHoliday(new Date(2026, 1, 17))).toBeNull() // Carnaval não é feriado oficial
  })
})
