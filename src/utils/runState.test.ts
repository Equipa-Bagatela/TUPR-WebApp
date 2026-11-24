import { describe, expect, it } from 'vitest'
import { lines } from '../data/lines'
import { earliest, lineRunState } from './runState'

const verde = lines[0]
const at = (y: number, m: number, d: number, h: number, min: number) => new Date(y, m - 1, d, h, min)

describe('estado de circulação segundo o horário', () => {
  it('a meio de uma viagem: está a circular', () => {
    const s = lineRunState(verde, at(2026, 11, 24, 14, 30)) // terça-feira
    expect(s.scheduledNow).toBe(true)
    expect(s.next).toEqual({ time: '15:00', dayOffset: 0, weekday: 2 })
  })
  it('entre viagens: não circula, a próxima é hoje', () => {
    const s = lineRunState(verde, at(2026, 11, 24, 14, 57))
    expect(s.scheduledNow).toBe(false)
    expect(s.next).toEqual({ time: '15:00', dayOffset: 0, weekday: 2 })
  })
  it('depois da última viagem: a próxima é amanhã às 08:00', () => {
    const s = lineRunState(verde, at(2026, 11, 24, 21, 0))
    expect(s.scheduledNow).toBe(false)
    expect(s.next).toEqual({ time: '08:00', dayOffset: 1, weekday: 3 })
  })
  it('sábado à noite: as viagens das 18:00 e 19:00 não existem; a próxima é segunda', () => {
    const s = lineRunState(verde, at(2026, 11, 28, 18, 30))
    expect(s.scheduledNow).toBe(false)
    expect(s.next).toEqual({ time: '08:00', dayOffset: 2, weekday: 1 })
  })
  it('domingo: sem serviço, a próxima é segunda', () => {
    const s = lineRunState(verde, at(2026, 11, 29, 10, 0))
    expect(s.scheduledNow).toBe(false)
    expect(s.next).toEqual({ time: '08:00', dayOffset: 1, weekday: 1 })
  })
  it('escolhe a partida mais próxima entre linhas', () => {
    const r = earliest([{ time: '08:00', dayOffset: 1, weekday: 3 }, { time: '15:00', dayOffset: 0, weekday: 2 }, null])
    expect(r?.time).toBe('15:00')
  })
})
