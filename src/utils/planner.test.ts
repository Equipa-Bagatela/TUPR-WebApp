import { describe, expect, it } from 'vitest'
import { lines } from '../data/lines'
import { stops } from '../data/stops'
import { directJourneys, transferJourneys } from './planner'
import { nextDepartures, departuresOnDay } from './departures'
import { toMinutes } from './time'

describe('integridade dos dados do PDF', () => {
  it('tem 2 linhas, 12 viagens cada, 39 e 33 paragens', () => {
    expect(lines.map((l) => [l.id, l.trips.length, l.stops.length])).toEqual([['verde', 12, 39], ['vermelha', 12, 33]])
  })
  it('todas as paragens referidas existem e os tempos crescem ao longo do percurso', () => {
    const ids = new Set(stops.map((s) => s.id))
    for (const l of lines) {
      for (const s of l.stops) {
        expect(ids.has(s.stopId)).toBe(true)
        expect(s.times).toHaveLength(12)
      }
      for (let j = 0; j < 12; j++) {
        const col = l.stops.map((s) => toMinutes(s.times[j]))
        for (let i = 1; i < col.length; i++) expect(col[i]).toBeGreaterThan(col[i - 1])
        expect(l.stops[0].times[j]).toBe(l.trips[j].departure)
      }
    }
  })
  it('amostras conferidas à mão com o PDF', () => {
    const v = lines[0]
    const r = lines[1]
    const t = (l: typeof v, id: string, j: number) => l.stops.find((s) => s.stopId === id)!.times[j]
    expect(t(v, 'estacao', 0)).toBe('08:47')
    expect(t(v, 'v-camara', 5)).toBe('13:33')
    expect(t(r, 'estacao', 11)).toBe('19:07')
    expect(r.stops[r.stops.length - 1].times[0]).toBe('08:55')
    expect(v.stops[v.stops.length - 1].times[11]).toBe('19:55')
  })
  it('as viagens das 18:00 e 19:00 não se realizam ao sábado', () => {
    expect(lines[0].trips.filter((t) => t.days === 'mon-fri').map((t) => t.departure)).toEqual(['18:00', '19:00'])
    expect(departuresOnDay('estacao', 6)).toHaveLength(10 + 10)
    expect(departuresOnDay('estacao', 2)).toHaveLength(24)
    expect(departuresOnDay('estacao', 0)).toHaveLength(0)
  })
})

describe('planeador', () => {
  it('Estação → Ponte (Vermelha, directa)', () => {
    const j = directJourneys('estacao', 'ponte', 2)
    expect(j.some((x) => x.legs[0].line.id === 'vermelha' && x.depart === toMinutes('08:07') && x.arrive === toMinutes('08:08'))).toBe(true)
  })
  it('Estação → Câmara exige transbordo', () => {
    expect(directJourneys('estacao', 'v-camara', 2)).toHaveLength(0)
    const t = transferJourneys('estacao', 'v-camara', 2, [])
    expect(t.length).toBeGreaterThan(0)
    expect(t[0].legs).toHaveLength(2)
  })
  it('não usa viagens de sábado às 18h', () => {
    const j = directJourneys('estacao', 'ponte', 6)
    expect(j.some((x) => x.depart >= toMinutes('18:00'))).toBe(false)
  })
})

describe('próximas partidas', () => {
  it('encontra a próxima a partir da hora actual', () => {
    const now = new Date(2026, 9, 12, 14, 24) // segunda-feira
    const n = nextDepartures('estacao', now, 3)
    expect(n.map((d) => d.time)).toEqual(['14:47', '15:07', '15:47'])
  })
  it('depois do último serviço passa para o dia seguinte', () => {
    const now = new Date(2026, 9, 12, 23, 0)
    const n = nextDepartures('estacao', now, 1)
    expect(n[0].dayOffset).toBe(1)
    expect(n[0].time).toBe('08:07')
  })
  it('ao domingo salta para segunda', () => {
    const now = new Date(2026, 9, 11, 10, 0)
    expect(nextDepartures('estacao', now, 1)[0].dayOffset).toBe(1)
  })
})
