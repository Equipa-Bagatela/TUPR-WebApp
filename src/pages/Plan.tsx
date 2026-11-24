import { ArrowRight, CalendarX2, ChevronDown, Eye, EyeOff, Navigation } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FavoriteButton } from '../components/FavoriteButton'
import { HolidayNotice } from '../components/HolidayNotice'
import { JourneyCard, type JourneyBadge } from '../components/JourneyCard'
import { JumpToMap, MAP_SECTION_ID } from '../components/JumpToMap'
import { MapBox } from '../components/MapBox'
import { PlannerForm, type PlanParams } from '../components/PlannerForm'
import { ShareButton } from '../components/ShareButton'
import { EmptyState, PageHeader } from '../components/ui'
import { getStop, stopById } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { useNow } from '../hooks/useNow'
import { useT } from '../i18n'
import { legPath } from '../utils/legPath'
import type { Journey } from '../utils/planner'
import { arrivingBy, nextServiceDay, planDay, rank, type PlanMode } from '../utils/planView'
import { hasServiceOn } from '../utils/service'
import { clock, fromMinutes, isoDate, minutesOfDay, parseIsoDate, toMinutes, weekdayName } from '../utils/time'

export default function Plan() {
  const { t, locale } = useT()
  const [sp, setSp] = useSearchParams()
  const now = useNow(30_000)
  const fav = useFavorites()
  const [showPast, setShowPast] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)

  const from = sp.get('de')
  const to = sp.get('para')
  const dateStr = sp.get('data') ?? isoDate(new Date())
  const timeStr = sp.get('hora') ?? clock(new Date())
  const mode: PlanMode = sp.get('modo') === 'chegar' ? 'arrive' : 'depart'
  const date = parseIsoDate(dateStr)
  const valid = !!(from && to && stopById.has(from) && stopById.has(to) && from !== to && date && /^\d\d:\d\d$/.test(timeStr))
  const selMin = toMinutes(timeStr)

  const view = useMemo(() => {
    const empty = { all: [] as Journey[], list: [] as Journey[], past: [] as Journey[], next: null as Date | null, isToday: false }
    if (!valid || !date) return empty
    const nowMin = minutesOfDay(now)
    const isToday = isoDate(now) === dateStr
    const all = planDay(from!, to!, date)
    const isPast = (j: Journey) => (mode === 'depart' && j.depart < selMin) || (isToday && j.depart < nowMin)
    const past = all.filter(isPast)
    let list = all.filter((j) => !isPast(j))
    if (mode === 'arrive') list = arrivingBy(list, selMin)
    let next: Date | null = null
    if (list.length === 0 && mode === 'depart') {
      const n = nextServiceDay(from!, to!, date)
      if (n) {
        next = n.date
        list = n.journeys
      }
    }
    return { all, list, past, next, isToday }
  }, [valid, from, to, dateStr, date, now, mode, selMin])

  const ranked = useMemo(() => rank(view.list, mode), [view.list, mode])
  const { main, more } = ranked
  const shown = showPast ? [...view.past, ...main] : main
  const visible = showMore ? [...shown, ...more] : shown
  const selected = visible.find((j) => j.id === picked) ?? main[0] ?? null
  const legPaths = useMemo(
    () => (selected ? selected.legs.map((l) => ({ lineId: l.line.id, path: legPath(l.line, l.fromIndex, l.toIndex) })) : undefined),
    [selected],
  )
  const badgesOf = (j: Journey): JourneyBadge[] => {
    const b: JourneyBadge[] = []
    if (mode === 'depart') {
      if (j.id === ranked.earliest) b.push('earliest')
      if (j.id === ranked.fastest && j.id !== ranked.earliest) b.push('fastest')
    } else {
      if (j.id === ranked.latest) b.push('latest')
      if (j.id === ranked.fastest && j.id !== ranked.latest) b.push('fastest')
    }
    return b
  }

  const submit = (p: PlanParams) => {
    setShowPast(false)
    setShowMore(false)
    setPicked(null)
    setSp({ de: p.from, para: p.to, data: p.date, hora: p.time, ...(p.mode === 'arrive' ? { modo: 'chegar' } : {}) })
  }

  const route = valid ? { from: from!, to: to! } : null
  const noService = date ? !hasServiceOn(date.getDay()) : false

  return (
    <>
      <PageHeader title={t('plan.title')} subtitle={t('plan.subtitle')}>
        <div className="max-w-4xl">
          <PlannerForm key={`${from}${to}${dateStr}${timeStr}${mode}`} initial={{ from: from ?? undefined, to: to ?? undefined, date: dateStr, time: timeStr, mode }} onSubmit={submit} />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {!valid ? (
          <EmptyState icon={<Navigation className="h-5 w-5" aria-hidden="true" />} title={t('plan.emptyTitle')}>
            {t('plan.emptyText')}
          </EmptyState>
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1fr_26rem]">
            <section aria-labelledby="res-titulo" aria-live="polite">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h2 id="res-titulo" className="flex flex-wrap items-center gap-x-2 text-xl font-bold">
                    <span>{getStop(from!).name}</span>
                    <ArrowRight className="h-5 w-5 text-muted" aria-label={t('plan.toWord')} />
                    <span>{getStop(to!).name}</span>
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {weekdayName(date!.getDay())}, {date!.toLocaleDateString(locale, { day: 'numeric', month: 'long' })} · {mode === 'arrive' ? t('plan.byTime', { time: fromMinutes(selMin) }) : t('plan.fromTime', { time: fromMinutes(selMin) })}
                  </p>
                </div>
                {route && (
                  <div className="flex shrink-0 gap-2">
                    <ShareButton title={`${getStop(from!).name} → ${getStop(to!).name}`} />
                    <FavoriteButton active={fav.isRouteFav(route)} onToggle={() => fav.toggleRoute(route)} label={`${getStop(from!).name} → ${getStop(to!).name}`} />
                  </div>
                )}
              </div>

              <JumpToMap className="mb-3" />
              {date && <HolidayNotice date={date} />}
              {noService ? (
                <EmptyState icon={<CalendarX2 className="h-5 w-5" aria-hidden="true" />} title={t('plan.noServiceTitle')}>
                  {t('plan.noServiceText')}
                </EmptyState>
              ) : view.all.length === 0 && !view.next ? (
                <EmptyState title={t('plan.noneTitle')}>{t('plan.noneText')}</EmptyState>
              ) : (
                <>
                  {view.next ? (
                    <div role="status" className="rise mb-4 rounded-2xl bg-surface-2 px-4 py-3.5 text-sm">
                      {view.all.length > 0 && <p className="font-semibold">{t('plan.noMore', { time: fromMinutes(selMin) })}</p>}
                      <p className="font-semibold">{t('plan.firstOf', { when: `${weekdayName(view.next.getDay())}, ${view.next.toLocaleDateString(locale, { day: 'numeric', month: 'long' })}` })}</p>
                    </div>
                  ) : (
                    view.list.length === 0 && (
                      <div role="status" className="rise mb-4 rounded-2xl bg-surface-2 px-4 py-3.5 text-sm">
                        <p className="font-semibold">{mode === 'arrive' ? t('plan.noArrive', { time: fromMinutes(selMin) }) : t('plan.noMore', { time: fromMinutes(selMin) })}</p>
                        <p className="text-muted">{mode === 'arrive' ? t('plan.noArriveHint') : t('plan.noMoreHint')}</p>
                      </div>
                    )
                  )}
                  <ol className="space-y-3">
                    {visible.map((j, i) => (
                      <li key={j.id}>
                        <JourneyCard journey={j} past={view.past.includes(j)} index={i + 1} badges={badgesOf(j)} selected={selected?.id === j.id} onSelect={() => setPicked(j.id)} defaultOpen={i === 0 && !showPast} />
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {more.length > 0 && (
                      <button onClick={() => setShowMore((v) => !v)} aria-expanded={showMore} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hair bg-surface px-4 text-sm font-bold">
                        <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} aria-hidden="true" />
                        {showMore ? t('plan.lessOptions') : t('plan.moreOptions', { n: more.length })}
                      </button>
                    )}
                    {view.past.length > 0 && (
                      <button onClick={() => setShowPast((v) => !v)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hair bg-surface px-4 text-sm font-bold">
                        {showPast ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        {showPast ? t('plan.hidePast') : t('plan.showPast', { n: view.past.length })}
                      </button>
                    )}
                  </div>
                  <p className="mt-6 text-xs text-muted">{t('plan.transferNote')}</p>
                </>
              )}
            </section>
            <aside id={MAP_SECTION_ID} aria-label={t('plan.mapAria')} className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <MapBox height="h-80 lg:h-[26rem]" originId={from} destId={to} legPaths={legPaths} label={t('plan.mapLabel')} />
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
