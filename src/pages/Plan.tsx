import { ArrowRight, CalendarX2, Eye, EyeOff, Navigation } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FavoriteButton } from '../components/FavoriteButton'
import { JourneyCard } from '../components/JourneyCard'
import { MapBox } from '../components/MapBox'
import { PlannerForm, type PlanParams } from '../components/PlannerForm'
import { EmptyState, PageHeader } from '../components/ui'
import { getStop, stopById } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { useNow } from '../hooks/useNow'
import { useT } from '../i18n'
import { directJourneys, transferJourneys, type Journey } from '../utils/planner'
import { hasServiceOn } from '../utils/service'
import { clock, fromMinutes, isoDate, minutesOfDay, parseIsoDate, toMinutes, weekdayName } from '../utils/time'

export default function Plan() {
  const { t, locale } = useT()
  const [sp, setSp] = useSearchParams()
  const now = useNow(30_000)
  const fav = useFavorites()
  const [showPast, setShowPast] = useState(false)

  const from = sp.get('de')
  const to = sp.get('para')
  const dateStr = sp.get('data') ?? isoDate(new Date())
  const timeStr = sp.get('hora') ?? clock(new Date())
  const date = parseIsoDate(dateStr)
  const valid = !!(from && to && stopById.has(from) && stopById.has(to) && from !== to && date && /^\d\d:\d\d$/.test(timeStr))

  const { journeys, nowMin, isToday } = useMemo(() => {
    if (!valid || !date) return { journeys: [] as Journey[], nowMin: 0, isToday: false }
    const wd = date.getDay()
    const direct = directJourneys(from!, to!, wd)
    const transfers = transferJourneys(from!, to!, wd, direct)
    const all = [...direct, ...transfers].sort((a, b) => a.depart - b.depart || a.arrive - b.arrive)
    return { journeys: all, nowMin: minutesOfDay(now), isToday: isoDate(now) === dateStr }
  }, [valid, from, to, dateStr, date, now])

  const submit = (p: PlanParams) => {
    setShowPast(false)
    setSp({ de: p.from, para: p.to, data: p.date, hora: p.time })
  }

  const selMin = toMinutes(timeStr)
  const isPast = (j: Journey) => j.depart < selMin || (isToday && j.depart < nowMin)
  const upcoming = journeys.filter((j) => !isPast(j))
  const past = journeys.filter(isPast)
  const shown = showPast ? journeys : upcoming
  const route = valid ? { from: from!, to: to! } : null
  const noService = date ? !hasServiceOn(date.getDay()) : false

  return (
    <>
      <PageHeader title={t('plan.title')} subtitle={t('plan.subtitle')}>
        <div className="max-w-4xl">
          <PlannerForm key={`${from}${to}${dateStr}${timeStr}`} compact initial={{ from: from ?? undefined, to: to ?? undefined, date: dateStr, time: timeStr }} onSubmit={submit} />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!valid ? (
          <EmptyState icon={<Navigation className="h-5 w-5" aria-hidden="true" />} title={t('plan.emptyTitle')}>
            {t('plan.emptyText')}
          </EmptyState>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_26rem]">
            <section aria-labelledby="res-titulo" aria-live="polite">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 id="res-titulo" className="flex flex-wrap items-center gap-x-2 text-xl font-bold">
                    <span>{getStop(from!).name}</span>
                    <ArrowRight className="h-5 w-5 text-muted" aria-label={t('plan.toWord')} />
                    <span>{getStop(to!).name}</span>
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {weekdayName(date!.getDay())}, {date!.toLocaleDateString(locale, { day: 'numeric', month: 'long' })} · {t('plan.fromTime', { time: fromMinutes(selMin) })}
                  </p>
                </div>
                {route && <FavoriteButton active={fav.isRouteFav(route)} onToggle={() => fav.toggleRoute(route)} label={`${getStop(from!).name} → ${getStop(to!).name}`} />}
              </div>

              {noService ? (
                <EmptyState icon={<CalendarX2 className="h-5 w-5" aria-hidden="true" />} title={t('plan.noServiceTitle')}>
                  {t('plan.noServiceText')}
                </EmptyState>
              ) : journeys.length === 0 ? (
                <EmptyState title={t('plan.noneTitle')}>{t('plan.noneText')}</EmptyState>
              ) : (
                <>
                  {upcoming.length === 0 && (
                    <div role="status" className="rise mb-4 rounded-2xl bg-surface-2 px-4 py-3.5 text-sm">
                      <p className="font-semibold">{t('plan.noMore', { time: fromMinutes(selMin) })}</p>
                      <p className="text-muted">{t('plan.noMoreHint')}</p>
                    </div>
                  )}
                  <ol className="space-y-4">
                    {shown.map((j, i) => (
                      <li key={j.id}>
                        <JourneyCard journey={j} past={isPast(j)} index={i + 1} />
                      </li>
                    ))}
                  </ol>
                  {past.length > 0 && (
                    <button onClick={() => setShowPast((s) => !s)} className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl border border-hair bg-surface px-4 text-sm font-bold">
                      {showPast ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      {showPast ? t('plan.hidePast') : t('plan.showPast', { n: past.length })}
                    </button>
                  )}
                  <p className="mt-6 text-xs text-muted">{t('plan.transferNote')}</p>
                </>
              )}
            </section>
            <aside aria-label={t('plan.mapAria')} className="lg:sticky lg:top-24 lg:self-start">
              <MapBox height="h-80 lg:h-[26rem]" originId={from} destId={to} label={t('plan.mapLabel')} />
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
