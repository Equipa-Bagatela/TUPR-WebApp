import { Link, useSearchParams } from 'react-router-dom'
import { FavoriteButton } from '../components/FavoriteButton'
import { NearbyStops } from '../components/NearbyStops'
import { NextDepartures } from '../components/DepartureList'
import { PageHeader } from '../components/ui'
import { StopPicker } from '../components/StopPicker'
import { getStop, stopById } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { useNow } from '../hooks/useNow'
import { useT } from '../i18n'
import { clock } from '../utils/time'

export default function Next() {
  const { t } = useT()
  const [sp, setSp] = useSearchParams()
  const now = useNow(10_000)
  const fav = useFavorites()
  const id = sp.get('paragem')
  const stopId = id && stopById.has(id) ? id : null
  const choose = (v: string | null) => (v ? setSp({ paragem: v }, { replace: true }) : setSp({}))
  return (
    <>
      <PageHeader title={t('nav.next')} subtitle={t('next.subtitle')} />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_24rem]">
        <section aria-labelledby="prox-titulo">
          <h2 id="prox-titulo" className="sr-only">{t('next.heading')}</h2>
          <StopPicker label={t('stop.one')} value={stopId} onChange={choose} />
          {fav.stops.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t('fav.stops')}>
              {fav.stops.map((s) => (
                <button key={s} onClick={() => choose(s)} aria-pressed={s === stopId} className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${s === stopId ? 'border-primary bg-primary-soft text-primary' : 'border-hair bg-surface'}`}>
                  ⭐ {getStop(s).name}
                </button>
              ))}
            </div>
          )}
          {stopId && (
            <div className="mt-6" aria-live="polite">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold">{getStop(stopId).name}</h3>
                  {getStop(stopId).detail && <p className="text-sm text-muted">{getStop(stopId).detail}</p>}
                  <p className="tnum mt-1 text-sm font-semibold text-muted">{t('now.now')} {clock(now)}</p>
                </div>
                <FavoriteButton active={fav.isStopFav(stopId)} onToggle={() => fav.toggleStop(stopId)} label={getStop(stopId).name} />
              </div>
              <NextDepartures key={stopId} stopId={stopId} now={now} limit={8} />
              <Link to={`/paragens/${stopId}`} className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">{t('next.seeStop')}</Link>
            </div>
          )}
        </section>
        <aside className="rounded-2xl border border-hair bg-surface p-4 lg:self-start">
          <NearbyStops limit={4} />
          <p className="mt-3 text-sm text-muted">{t('next.noLocation')}</p>
        </aside>
      </div>
    </>
  )
}
