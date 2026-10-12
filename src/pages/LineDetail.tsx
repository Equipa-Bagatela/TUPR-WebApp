import { Link, useParams } from 'react-router-dom'
import { DayChips } from '../components/DayChips'
import { LiveBuses } from '../components/LiveBuses'
import { MapBox } from '../components/MapBox'
import { Timeline } from '../components/Timeline'
import { EmptyState, PageHeader } from '../components/ui'
import { lineById } from '../data/lines'
import { useNow } from '../hooks/useNow'
import { useT } from '../i18n'
import { hasServiceOn, runningTrips } from '../utils/service'
import { formatDuration, minutesOfDay, toMinutes } from '../utils/time'
import { useEffect, useState } from 'react'

export default function LineDetail() {
  const { t } = useT()
  const { id } = useParams()
  const line = id ? lineById(id) : undefined
  const now = useNow(30_000)
  const [day, setDay] = useState(() => (hasServiceOn(new Date().getDay()) ? new Date().getDay() : 1))
  const [trip, setTrip] = useState<number | null>(null)
  useEffect(() => setTrip(null), [id, day])

  if (!line) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title={t('nf.line')}>
          <Link to="/linhas" className="font-semibold text-primary underline">{t('nf.allLines')}</Link>
        </EmptyState>
      </div>
    )
  }
  const running = runningTrips(line, day)
  const isToday = day === now.getDay()
  const nowMin = minutesOfDay(now)
  // viagem por omissão: a próxima a partir de agora (se hoje), senão a primeira
  const defaultTrip = (isToday ? running.find(({ index }) => toMinutes(line.stops[line.stops.length - 1].times[index]) >= nowMin) : undefined) ?? running[0]
  const sel = trip !== null && running.some((r) => r.index === trip) ? trip : defaultTrip.index
  const dur = toMinutes(line.stops[line.stops.length - 1].times[sel]) - toMinutes(line.stops[0].times[sel])
  const nextIdx = isToday ? line.stops.findIndex((s) => toMinutes(s.times[sel]) >= nowMin) : -1
  const live = isToday && nextIdx > 0 && toMinutes(line.stops[0].times[sel]) <= nowMin

  return (
    <>
      <PageHeader title={line.name} subtitle={`${t('line.circular')}: ${line.summary}`}>
        <div className="h-1.5 w-24 rounded-full" style={{ background: `var(--line-${line.id})` }} aria-hidden="true" />
        <p className="mt-3 text-sm text-muted">
          {t('line.factsShort', { stops: line.stops.length - 1, dur: formatDuration(dur), trips: line.trips.length })} · <Link to="/linhas" className="font-semibold text-primary underline">{t('line.all')}</Link>
        </p>
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <section aria-labelledby="percurso-titulo">
          <h2 id="percurso-titulo" className="mb-4 text-2xl font-bold">{t('line.fullRoute')}</h2>
          <div className="mb-5 space-y-4">
            <DayChips value={day} onChange={setDay} />
            <div>
              <p className="mb-2 text-sm font-semibold">{t('line.departTime')}</p>
              <div role="radiogroup" aria-label={t('line.departTimeAria')} className="flex flex-wrap gap-2">
                {running.map(({ trip: t, index }) => (
                  <button key={t.id} role="radio" aria-checked={index === sel} onClick={() => setTrip(index)} className={`tnum min-h-11 min-w-[4.25rem] rounded-xl border px-3 text-sm font-bold ${index === sel ? 'border-transparent text-white' : 'border-hair bg-surface'}`} style={index === sel ? { background: line.color } : undefined}>
                    {t.departure}
                  </button>
                ))}
              </div>
              {day === 6 && <p className="mt-2 text-sm text-muted">{t('sat.note')}</p>}
            </div>
          </div>
          {live && <p role="status" className="mb-3 rounded-xl bg-primary-soft px-3 py-2 text-sm font-semibold">{t('line.live')}</p>}
          <div className="rounded-2xl border border-hair bg-surface p-4 sm:p-6">
            <Timeline line={line} tripIndex={sel} nextStopIdx={live ? nextIdx : undefined} />
          </div>
        </section>
        <aside aria-label={t('line.mapOf', { name: line.name })} className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <LiveBuses lineIds={[line.id]} compact />
          <MapBox height="h-80 lg:h-[30rem]" lineIds={[line.id]} label={t('line.mapOf', { name: line.name })} />
        </aside>
      </div>
    </>
  )
}
