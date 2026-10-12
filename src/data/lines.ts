import { pick } from '../i18n'
import type { Line } from '../types'
import { timetables } from './schedules'
import { shapes } from './shapes'

type L10n = { pt: string; en: string }
interface Meta {
  id: string
  color: string
  colorDark: string
  name: L10n
  shortName: L10n
  /** Resumo do percurso (sem prefixo "Circular") */
  summary: L10n
}

/**
 * Metadados das linhas. As cores são as das barras de cada linha no PDF oficial:
 * Linha Verde #416e48 · Linha Vermelha #c12a2b.
 * `name`, `shortName` e `summary` são getters: devolvem o texto no idioma activo.
 */
const meta: Meta[] = [
  {
    id: 'verde',
    color: '#416e48',
    colorDark: '#8bc34a',
    name: { pt: 'Linha Verde', en: 'Green Line' },
    shortName: { pt: 'Verde', en: 'Green' },
    summary: {
      pt: 'Rodo (R. da Lousada) · Godim · Av. Sacadura Cabral · Câmara Municipal · Estação',
      en: 'Rodo (R. da Lousada) · Godim · Av. Sacadura Cabral · Town Hall · Railway station',
    },
  },
  {
    id: 'vermelha',
    color: '#c12a2b',
    colorDark: '#ff7b7b',
    name: { pt: 'Linha Vermelha', en: 'Red Line' },
    shortName: { pt: 'Vermelha', en: 'Red' },
    summary: {
      pt: 'Estação · Av. Dr. Manuel de Arriaga · Av. Sacadura Cabral · Godim · Rodo (R. da Lousada)',
      en: 'Railway station · Av. Dr. Manuel de Arriaga · Av. Sacadura Cabral · Godim · Rodo (R. da Lousada)',
    },
  },
]

function build(m: Meta): Line {
  const base = { ...timetables[m.id], id: m.id, color: m.color, colorDark: m.colorDark, shape: shapes[m.id] }
  return Object.defineProperties(base, {
    name: { get: () => pick(m.name), enumerable: true },
    shortName: { get: () => pick(m.shortName), enumerable: true },
    summary: { get: () => pick(m.summary), enumerable: true },
  }) as Line
}

export const lines: Line[] = meta.map(build)
export const lineById = (id: string) => lines.find((l) => l.id === id)
