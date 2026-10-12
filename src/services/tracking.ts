import type { LatLng } from '../types'

/**
 * Localização em tempo real dos autocarros.
 *
 * Fonte: API pública usada pela página oficial de tracking do TUPR
 * (https://tracking.elevensystems.pt/tupr, © Eleven Systems), que permite pedidos de qualquer origem (CORS *).
 * Endpoint: GET {API}/locations?passengerInfo=true&routeId={1|2}
 *   → [{ id, position: { lat, lon }, status: "ontime" | …, color }]
 *
 * O id de rota da API ('1', '2') é ligado às nossas linhas em ROUTES.
 * Só o estado "ontime" está documentado no código do site oficial; qualquer outro valor é mostrado sem interpretação.
 */
export const TRACKING_API = 'https://tupr.elevensystems.pt/api'
export const TRACKING_PAGE = 'https://tracking.elevensystems.pt/tupr'
const ROUTES: Record<string, string> = { '1': 'verde', '2': 'vermelha' }

export interface Bus {
  id: string
  lineId: string
  position: LatLng
  /** Valor devolvido pela API (ex.: "ontime") */
  status: string
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)

function parse(routeId: string, json: unknown): Bus[] {
  if (!Array.isArray(json)) throw new Error('Resposta inesperada do tracking')
  const out: Bus[] = []
  for (const it of json as Record<string, any>[]) {
    const lat = num(it?.position?.lat)
    const lon = num(it?.position?.lon)
    // descarta posições inválidas ou fora da zona do Peso da Régua
    if (lat === null || lon === null || lat < 41 || lat > 41.4 || lon < -8.1 || lon > -7.5) continue
    out.push({ id: String(it.id), lineId: ROUTES[routeId], position: [lat, lon], status: String(it.status ?? '') })
  }
  return out
}

export async function fetchBuses(signal?: AbortSignal): Promise<Bus[]> {
  const parts = await Promise.all(
    Object.keys(ROUTES).map(async (rid) => {
      const r = await fetch(`${TRACKING_API}/locations?passengerInfo=true&routeId=${rid}`, { signal, cache: 'no-store' })
      if (!r.ok) throw new Error(`Tracking HTTP ${r.status}`)
      return parse(rid, await r.json())
    }),
  )
  return parts.flat()
}
