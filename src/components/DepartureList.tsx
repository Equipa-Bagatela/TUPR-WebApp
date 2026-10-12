import { ArrowRight, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStop } from '../data/network'
import { useT } from '../i18n'
import { nextDepartures, type Departure } from '../utils/departures'
import { hasServiceOn } from '../utils/service'
import { formatRelative, weekdayName } from '../utils/time'
import { LineBadge } from './LineBadge'
import { EmptyState } from './ui'

function useDayWord() {
  const { t } = useT()
  return (offset: number, now: Date) => (offset === 0 ? t('time.today') : offset === 1 ? t('time.tomorrow') : weekdayName((now.getDay() + offset) % 7).toLowerCase())
}

export function DepartureRow({ d, now, first, showNext = true }: { d: Departure; now: Date; first?: boolean; showNext?: boolean }) {
  const { t } = useT()
  const dayWord = useDayWord()
  const nextName = d.nextStopId ? getStop(d.nextStopId).name : null
  return (
    <li className={`rise flex items-center gap-4 rounded-2xl border bg-surface px-4 py-3.5 transition-colors ${first ? 'border-primary' : 'border-hair'}`}>
      <div className="min-w-0 flex-1">
        <LineBadge line={d.line} size="sm" />
        {showNext && nextName && <p className="mt-1.5 truncate text-sm text-muted">{t('dep.nextStop', { name: nextName })}</p>}
      </div>
      <div className="text-right">
        <p className="tnum font-display text-2xl font-bold leading-none">{d.time}</p>
        <p className={`mt-1 flex items-center justify-end gap-1.5 text-sm font-semibold ${first && d.dayOffset === 0 ? 'text-ok' : 'text-muted'}`}>
          {first && d.dayOffset === 0 && <span className="live-dot inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />}
          {d.dayOffset === 0 ? formatRelative(d.minutes, now) : dayWord(d.dayOffset, now)}
        </p>
      </div>
    </li>
  )
}

/** Lista das próximas partidas de uma paragem, com estados vazios coerentes com o PDF. */
export function NextDepartures({ stopId, now, limit = 5, linkToStop = false }: { stopId: string; now: Date; limit?: number; linkToStop?: boolean }) {
  const { t } = useT()
  const dayWord = useDayWord()
  const list = nextDepartures(stopId, now, limit)
  if (list.length === 0) return <EmptyState title={t('dep.none')}>{t('dep.noneText')}</EmptyState>
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const far = list[0].dayOffset > 0 || list[0].minutes - nowMin > 120
  return (
    <div>
      {far && (
        <div role="status" className="rise mb-3 flex items-start gap-3 rounded-2xl bg-surface-2 px-4 py-3.5">
          <Moon className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <div>
            <p className="font-semibold">{t('dep.noClose')}</p>
            <p className="text-sm text-muted">
              {!hasServiceOn(now.getDay()) && list[0].dayOffset > 0 ? `${t('dep.sunday')} ` : ''}
              {t('dep.nextIs')} <strong className="tnum text-ink">{list[0].time}</strong> ({dayWord(list[0].dayOffset, now)}).
            </p>
          </div>
        </div>
      )}
      <ul className="space-y-2.5">
        {list.map((d, i) => (
          <DepartureRow key={`${d.line.id}-${d.tripIndex}-${d.dayOffset}`} d={d} now={now} first={i === 0} />
        ))}
      </ul>
      {linkToStop && (
        <Link to={`/paragens/${stopId}`} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          {t('dep.seeAll')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
