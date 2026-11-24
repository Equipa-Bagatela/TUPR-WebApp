import { useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import { useNow } from '../hooks/useNow'
import { getStop, stopById } from '../data/network'
import { useT } from '../i18n'
import { clock } from '../utils/time'
import { NextDepartures } from './DepartureList'
import { FavoriteButton } from './FavoriteButton'
import { StopPicker } from './StopPicker'

const LAST_STOP = 'tupr:last-stop'
const lastStop = () => {
  try {
    const id = localStorage.getItem(LAST_STOP)
    return id && stopById.has(id) ? id : null
  } catch {
    return null
  }
}

/** "Agora" + próximas partidas numa paragem (hora do dispositivo, actualiza sozinha). */
export function NowPanel({ initialStop = 'estacao', limit = 4, heading }: { initialStop?: string; limit?: number; heading?: string }) {
  const { t } = useT()
  const now = useNow(10_000)
  const fav = useFavorites()
  const [stopId, setStopId] = useState<string>(() => fav.stops[0] ?? lastStop() ?? initialStop)
  const choose = (id: string) => {
    setStopId(id)
    try {
      localStorage.setItem(LAST_STOP, id)
    } catch {
      /* ignora */
    }
  }
  return (
    <section aria-labelledby="agora-titulo" className="glass-panel relative z-20 rounded-2xl border border-hair bg-surface p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="agora-titulo" className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{heading ?? t('now.heading')}</h2>
          <p className="mt-1 text-sm font-semibold text-muted">{t('now.now')}</p>
          <p className="tnum font-display text-5xl font-extrabold leading-none text-primary" aria-label={t('now.aria', { time: clock(now) })}>{clock(now)}</p>
        </div>
        <FavoriteButton active={fav.isStopFav(stopId)} onToggle={() => fav.toggleStop(stopId)} label={getStop(stopId).name} />
      </div>
      <StopPicker label={t('stop.one')} value={stopId} onChange={(id) => id && choose(id)} />
      <h3 className="mb-3 mt-6 font-display text-lg font-bold">{t('now.next')}</h3>
      <div aria-live="polite">
        <NextDepartures key={stopId} stopId={stopId} now={now} limit={limit} linkToStop />
      </div>
    </section>
  )
}
