import { getStop } from '../data/network'
import type { Line, LatLng } from '../types'

const d2 = (a: LatLng, b: LatLng) => {
  const dy = a[0] - b[0]
  const dx = (a[1] - b[1]) * Math.cos((a[0] * Math.PI) / 180)
  return dx * dx + dy * dy
}

const cache = new Map<string, number[]>()

/**
 * Posição de cada paragem ao longo do traçado da linha. O traçado foi construído a passar pelas paragens por ordem,
 * por isso procura-se, paragem a paragem e sempre para a frente, o ponto mais próximo.
 */
export function stopShapeIndexes(line: Line): number[] {
  const hit = cache.get(line.id)
  if (hit) return hit
  const idx: number[] = []
  let cursor = 0
  const window = Math.max(300, Math.ceil((line.shape.length / line.stops.length) * 8))
  for (const s of line.stops) {
    const c = getStop(s.stopId).coords
    if (!c) {
      idx.push(cursor)
      continue
    }
    let best = cursor
    let bd = Infinity
    const end = Math.min(line.shape.length, cursor + window)
    for (let k = cursor; k < end; k++) {
      const d = d2(line.shape[k], c)
      if (d < bd) {
        bd = d
        best = k
      }
    }
    idx.push(best)
    cursor = best
  }
  cache.set(line.id, idx)
  return idx
}

/** Troço do traçado da linha entre duas posições de paragem (índices em `line.stops`). */
export function legPath(line: Line, fromIndex: number, toIndex: number): LatLng[] {
  const idx = stopShapeIndexes(line)
  const a = idx[fromIndex]
  const b = Math.max(idx[toIndex], a + 1)
  return line.shape.slice(a, b + 1)
}
