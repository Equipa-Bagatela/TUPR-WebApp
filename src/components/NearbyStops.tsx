import { LocateFixed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { linesAtStop } from '../data/network'
import { useGeolocation } from '../hooks/useGeolocation'
import { formatDistance, nearestStops } from '../utils/geo'
import { LineDot } from './LineBadge'
import { Skeleton } from './ui'

/** Botão "Usar a minha localização" + lista de paragens próximas. Funciona sem localização. */
export function NearbyStops({ limit = 3 }: { limit?: number }) {
  const geo = useGeolocation()
  const near = geo.pos ? nearestStops(geo.pos, limit) : []
  return (
    <div>
      {geo.status !== 'granted' && (
        <button type="button" onClick={geo.request} disabled={geo.status === 'loading'} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hair bg-surface px-4 text-sm font-bold text-primary hover:bg-primary-soft disabled:opacity-60">
          <LocateFixed className={`h-5 w-5 ${geo.status === 'loading' ? 'animate-pulse' : ''}`} aria-hidden="true" />
          {geo.status === 'loading' ? 'A obter localização…' : 'Usar a minha localização'}
        </button>
      )}
      <div aria-live="polite">
        {geo.status === 'denied' && <p className="mt-3 text-sm text-muted">Localização não autorizada. Não faz mal — pode pesquisar a paragem pelo nome.</p>}
        {geo.status === 'error' && <p className="mt-3 text-sm text-muted">Não foi possível obter a localização. Tente novamente ou pesquise pelo nome.</p>}
        {geo.status === 'unsupported' && <p className="mt-3 text-sm text-muted">Este dispositivo não suporta localização.</p>}
        {geo.status === 'loading' && <Skeleton className="mt-3 h-16 w-full" />}
      </div>
      {geo.status === 'granted' && (
        <section aria-labelledby="perto-titulo">
          <h3 id="perto-titulo" className="mb-2 flex items-center gap-2 font-display text-lg font-bold">
            <LocateFixed className="h-5 w-5 text-primary" aria-hidden="true" /> Paragens perto de si
          </h3>
          <p className="mb-3 text-sm text-muted">📍 A sua localização · distâncias aproximadas</p>
          <ul className="space-y-2">
            {near.map(({ stop, meters }) => (
              <li key={stop.id}>
                <Link to={`/paragens/${stop.id}`} className="rise flex min-h-14 items-center gap-3 rounded-xl border border-hair bg-surface px-4 py-2.5 hover:bg-primary-soft">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug">{stop.name}</span>
                    {stop.detail && <span className="block truncate text-sm text-muted">{stop.detail}</span>}
                  </span>
                  <span className="flex gap-1">{linesAtStop(stop.id).map((l) => <LineDot key={l.id} line={l} />)}</span>
                  <span className="tnum w-16 text-right text-sm font-bold">{formatDistance(meters)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
