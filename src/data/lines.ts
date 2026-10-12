import type { Line, LineMeta } from '../types'
import { timetables } from './schedules'
import { shapes } from './shapes'

/**
 * Metadados das linhas. As cores são as das barras de cada linha no PDF oficial:
 * Linha Verde #416e48 · Linha Vermelha #c12a2b.
 */
const meta: LineMeta[] = [
  {
    id: 'verde',
    name: 'Linha Verde',
    shortName: 'Verde',
    color: '#416e48',
    colorDark: '#8bc34a',
    summary: 'Circular: Rodo (R. da Lousada) · Godim · Av. Sacadura Cabral · Câmara Municipal · Estação',
  },
  {
    id: 'vermelha',
    name: 'Linha Vermelha',
    shortName: 'Vermelha',
    color: '#c12a2b',
    colorDark: '#ff7b7b',
    summary: 'Circular: Estação · Av. Dr. Manuel de Arriaga · Av. Sacadura Cabral · Godim · Rodo (R. da Lousada)',
  },
]

export const lines: Line[] = meta.map((m) => ({ ...m, ...timetables[m.id], shape: shapes[m.id] }))
export const lineById = (id: string) => lines.find((l) => l.id === id)
