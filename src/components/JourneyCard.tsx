import { ArrowDown, ArrowRightLeft, ChevronDown, Clock3, Repeat } from 'lucide-react'
import { getStop, stopLabel } from '../data/network'
import type { Journey, Leg } from '../utils/planner'
import { MIN_TRANSFER } from '../utils/planner'
import { fromMinutes, formatDuration } from '../utils/time'
import { LineBadge } from './LineBadge'

function LegView({ leg }: { leg: Leg }) {
  const from = getStop(leg.fromStopId)
  const to = getStop(leg.toStopId)
  const via = leg.line.stops.slice(leg.fromIndex + 1, leg.toIndex)
  const next = leg.line.stops[leg.fromIndex + 1]
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <LineBadge line={leg.line} />
        <span className="text-sm text-muted">
          {leg.stopCount} {leg.stopCount === 1 ? 'paragem' : 'paragens'} · circular, segue para {getStop(next.stopId).name}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-4">
        <p className="tnum font-display text-xl font-bold">{fromMinutes(leg.depart)}</p>
        <p className="min-w-0 self-center font-semibold leading-snug">
          {from.name}
          {from.detail && <span className="block text-sm font-normal text-muted">{from.detail}</span>}
        </p>
        <span className="flex justify-center py-1 text-muted" aria-hidden="true"><ArrowDown className="h-4 w-4" /></span>
        <span />
        <p className="tnum font-display text-xl font-bold">{fromMinutes(leg.arrive)}</p>
        <p className="min-w-0 self-center font-semibold leading-snug">
          {to.name}
          {to.detail && <span className="block text-sm font-normal text-muted">{to.detail}</span>}
        </p>
      </div>
      {via.length > 0 && (
        <details className="group mt-3 rounded-xl bg-surface-2 px-3">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold">
            Paragens intermédias ({via.length})
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <ol className="pb-3">
            {via.map((s, i) => (
              <li key={i} className="flex gap-3 py-1 text-sm">
                <span className="tnum w-12 shrink-0 font-semibold">{s.times[leg.tripIndex]}</span>
                <span>{stopLabel(getStop(s.stopId))}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  )
}

export function JourneyCard({ journey, past, index }: { journey: Journey; past: boolean; index: number }) {
  const transfer = journey.legs.length > 1
  return (
    <article aria-label={`Opção ${index}: partida ${fromMinutes(journey.depart)}, chegada ${fromMinutes(journey.arrive)}${past ? ', já passou' : ''}`} className={`rise rounded-2xl border bg-surface p-4 sm:p-5 ${past ? 'border-dashed border-hair opacity-65' : 'border-hair'}`} style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-muted">
          Opção {index}
          {transfer && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-ink">
              <Repeat className="h-3 w-3" aria-hidden="true" /> 1 transbordo
            </span>
          )}
          {past && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-ink">
              <Clock3 className="h-3 w-3" aria-hidden="true" /> Já passou
            </span>
          )}
        </div>
        <p className="text-right">
          <span className="tnum font-display text-2xl font-extrabold">{formatDuration(journey.duration)}</span>
          <span className="sr-only"> de duração</span>
        </p>
      </header>
      <div className="space-y-4">
        {journey.legs.map((leg, i) => (
          <div key={i}>
            {i > 0 && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-primary-soft px-3 py-2.5 text-sm">
                <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p>
                  <strong>Transbordo em {getStop(leg.fromStopId).name}</strong>
                  {getStop(leg.fromStopId).detail ? ` (${getStop(leg.fromStopId).detail})` : ''} — espera de {leg.depart - journey.legs[i - 1].arrive} min (mínimo {MIN_TRANSFER} min).
                </p>
              </div>
            )}
            <LegView leg={leg} />
          </div>
        ))}
      </div>
    </article>
  )
}
