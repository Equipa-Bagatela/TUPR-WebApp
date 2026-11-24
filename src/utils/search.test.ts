import { describe, expect, it } from 'vitest'
import { stops } from '../data/stops'
import { matchesTokens, queryTokens, stopHaystack } from './search'

const find = (q: string) => stops.filter((s) => matchesTokens(stopHaystack(s), queryTokens(q))).map((s) => s.id)

describe('pesquisa de paragens', () => {
  it('ignora acentos e maiúsculas', () => {
    expect(find('ESTAÇÃO')).toContain('estacao')
    expect(find('camara')).toContain('v-camara')
  })
  it('percebe inglês', () => {
    expect(find('station')).toContain('estacao')
    expect(find('town hall')).toContain('v-camara')
    expect(find('church')).toContain('igreja-matriz')
    expect(find('bridge')).toContain('ponte')
    expect(find('school')).toContain('jac')
  })
  it('sem correspondência devolve vazio', () => {
    expect(find('xyzzy')).toEqual([])
    expect(find('town')).toEqual([]) // palavra solta que não ajuda
  })
})
