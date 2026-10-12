import { ArrowRight, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStop } from '../data/network'
import { nextDepartures, type Departure } from '../utils/departures'
import { hasServiceOn } from '../utils/service'
import { formatRelative, WEEKDAYS } from '../utils/time'
import { LineBadge } from './LineBadge'
import { EmptyState } from './ui'

const dayWord = (offset: number, now: Date) => (offset === 0 ? 'hoje' : offset === 1 ? 'amanhã' : WEEKDAYS[(now.getDay() + offset) % 7].toLowerCase())

export function DepartureRow({ d, now, first, showNext = true }: { d: Departure; now: Date; first?: boolean; showNext?: boolean }) {
  const nextName = d.nextStopId ? getStop(d.nextStopId).name : null
  return (
    <li className={`rise flex items-center gap-4 rounded-2xl border bg-surface px-4 py-3.5 ${first ? 'border-primary' : 'border-hair'}`}>
      <div className="min-w-0 flex-1">
        <LineBadge line={d.line} size="sm" />
        {showNext && nextName && <p className="mt-1.5 truncate text-sm text-muted">Segue para {nextName}</p>}
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
  const list = nextDepartures(stopId, now, limit)
  if (list.length === 0) return <EmptyState title="Sem partidas">Não há partidas registadas para esta paragem.</EmptyState>
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const far = list[0].dayOffset > 0 || list[0].minutes - nowMin > 120
  return (
    <div>
      {far && (
        <div role="status" className="mb-3 flex items-start gap-3 rounded-2xl bg-surface-2 px-4 py-3.5">
          <Moon className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <div>
            <p className="font-semibold">Não existem partidas próximas.</p>
            <p className="text-sm text-muted">
              {!hasServiceOn(now.getDay()) && list[0].dayOffset > 0 ? 'Hoje é domingo e o horário oficial só refere segunda a sábado. ' : ''}
              Próxima partida: <strong className="tnum text-ink">{list[0].time}</strong> ({dayWord(list[0].dayOffset, now)}).
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
          Ver todos os horários desta paragem <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
