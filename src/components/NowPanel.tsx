import { useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useNow } from '../hooks/useNow'
import { getStop } from '../data/network'
import { clock } from '../utils/time'
import { NextDepartures } from './DepartureList'
import { FavoriteButton } from './FavoriteButton'
import { StopPicker } from './StopPicker'

/** "Agora" + próximas partidas numa paragem (hora do dispositivo, actualiza sozinha). */
export function NowPanel({ initialStop = 'estacao', limit = 4, heading = 'Agora em Peso da Régua' }: { initialStop?: string; limit?: number; heading?: string }) {
  const now = useNow(10_000)
  const fav = useFavorites()
  const [stopId, setStopId] = useState<string>(fav.stops[0] ?? initialStop)
  return (
    <section aria-labelledby="agora-titulo" className="rounded-2xl border border-hair bg-surface p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="agora-titulo" className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{heading}</h2>
          <p className="mt-1 text-sm font-semibold text-muted">Agora</p>
          <p className="tnum font-display text-5xl font-extrabold leading-none text-primary" aria-label={`Agora são ${clock(now)}`}>{clock(now)}</p>
        </div>
        <FavoriteButton active={fav.isStopFav(stopId)} onToggle={() => fav.toggleStop(stopId)} label={getStop(stopId).name} />
      </div>
      <StopPicker label="Paragem" value={stopId} onChange={(id) => id && setStopId(id)} />
      <h3 className="mb-3 mt-6 font-display text-lg font-bold">Próximo autocarro</h3>
      <div aria-live="polite">
        <NextDepartures key={stopId} stopId={stopId} now={now} limit={limit} linkToStop />
      </div>
    </section>
  )
}
