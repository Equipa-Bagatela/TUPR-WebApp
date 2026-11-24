import { describe, expect, it } from 'vitest'
import { lines } from '../data/lines'
import { getStop } from '../data/network'
import { distanceMeters } from './geo'
import { stopShapeIndexes, legPath } from './legPath'
import { arrivingBy, nextServiceDay, planDay, rank, transferWait } from './planView'
import { toMinutes } from './time'

const terca = new Date(2026, 10, 24) // terça-feira
const sabado = new Date(2026, 10, 28)
const domingo = new Date(2026, 10, 29)

describe('alternativa para outro dia', () => {
  it('depois do domingo a primeira viagem é na segunda', () => {
    const next = nextServiceDay('estacao', 'ponte', domingo)!
    expect(next.date.getDay()).toBe(1)
    expect(next.journeys[0].depart).toBe(toMinutes('08:07'))
  })
  it('sexta → sábado tem serviço', () => {
    expect(nextServiceDay('estacao', 'ponte', new Date(2026, 10, 27))!.date.getDay()).toBe(6)
  })
})

describe('ordenação e etiquetas', () => {
  const dia = planDay('estacao', 'v-camara', terca) // só com transbordo
  it('"mais cedo" e "mais rápida" existem e são viagens do dia', () => {
    const r = rank(dia)
    const ids = dia.map((j) => j.id)
    expect(ids).toContain(r.earliest)
    expect(ids).toContain(r.fastest)
  })
  it('esperas longas ficam em "mais opções" (e, se todas forem longas, mostra só 3)', () => {
    const r = rank(dia)
    const todasLongas = dia.every((j) => transferWait(j) > 20)
    if (todasLongas) expect(r.main).toHaveLength(3)
    else for (const j of r.main) expect(transferWait(j)).toBeLessThanOrEqual(20)
    expect(r.main.length + r.more.length).toBe(dia.length)
    expect(r.main.length).toBeLessThanOrEqual(5)
  })
  it('com opções boas e más, as más vão para "mais opções"', () => {
    const lista = planDay('estacao', 'ponte', terca) // directas: sem espera
    const r = rank(lista)
    expect(r.main.every((j) => transferWait(j) === 0)).toBe(true)
    expect(r.main).toHaveLength(5)
    expect(r.more.length).toBe(lista.length - 5)
  })
  it('modo "chegar até": só as que chegam a tempo e marca a que parte mais tarde', () => {
    const lista = planDay('estacao', 'ponte', terca)
    const alvo = toMinutes('10:30')
    const ok = arrivingBy(lista, alvo)
    expect(ok.every((j) => j.arrive <= alvo)).toBe(true)
    const r = rank(ok, 'arrive')
    const ultima = ok.find((j) => j.id === r.latest)!
    expect(ultima.depart).toBe(Math.max(...ok.map((j) => j.depart)))
  })
  it('no sábado não há viagens depois das 18:00', () => {
    expect(planDay('estacao', 'ponte', sabado).every((j) => j.depart < toMinutes('18:00'))).toBe(true)
  })
})

describe('percurso no mapa', () => {
  for (const line of lines) {
    it(`${line.id}: as paragens seguem o traçado por ordem e perto das posições`, () => {
      const idx = stopShapeIndexes(line)
      for (let i = 1; i < idx.length; i++) expect(idx[i]).toBeGreaterThanOrEqual(idx[i - 1])
      line.stops.forEach((s, i) => {
        const c = getStop(s.stopId).coords!
        expect(distanceMeters(line.shape[idx[i]], c)).toBeLessThan(120)
      })
    })
  }
  it('um troço começa na paragem de origem e acaba na de destino', () => {
    const v = lines[1] // vermelha: estação (3) → ponte (4)
    const p = legPath(v, 3, 4)
    expect(p.length).toBeGreaterThan(1)
    expect(distanceMeters(p[0], getStop('estacao').coords!)).toBeLessThan(120)
    expect(distanceMeters(p[p.length - 1], getStop('ponte').coords!)).toBeLessThan(120)
  })
})
