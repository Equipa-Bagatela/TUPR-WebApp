import { ArrowDown, ArrowRightLeft, ChevronDown, Map as MapIcon, Zap } from 'lucide-react'
import { useState } from 'react'
import { getStop, stopLabel } from '../data/network'
import { useT } from '../i18n'
import type { Journey, Leg } from '../utils/planner'
import { MIN_TRANSFER } from '../utils/planner'
import { fromMinutes, formatDuration } from '../utils/time'
import { LineBadge } from './LineBadge'

function LegView({ leg }: { leg: Leg }) {
  const { t } = useT()
  const from = getStop(leg.fromStopId)
  const to = getStop(leg.toStopId)
  const via = leg.line.stops.slice(leg.fromIndex + 1, leg.toIndex)
  const next = leg.line.stops[leg.fromIndex + 1]
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <LineBadge line={leg.line} />
        <span className="text-sm text-muted">
          {t('journey.stops', { count: leg.stopCount })} · {t('journey.circularTo', { name: getStop(next.stopId).name })}
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
            {t('journey.intermediate', { n: via.length })}
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

export type JourneyBadge = 'earliest' | 'fastest' | 'latest'

interface CardProps {
  journey: Journey
  past: boolean
  index: number
  badges?: JourneyBadge[]
  /** Percurso deste cartão está destacado no mapa */
  selected?: boolean
  onSelect?: () => void
  defaultOpen?: boolean
}

const BADGE_KEY = { earliest: 'plan.badgeEarliest', fastest: 'plan.badgeFastest', latest: 'plan.badgeLatest' } as const

/** Cartão de viagem: resumo numa linha (horas, linhas, duração) que se abre para ver as paragens. */
export function JourneyCard({ journey, past, index, badges = [], selected = false, onSelect, defaultOpen = false }: CardProps) {
  const { t } = useT()
  const [open, setOpen] = useState(defaultOpen)
  const transfer = journey.legs.length > 1
  const stopsTotal = journey.legs.reduce((n, l) => n + l.stopCount, 0)
  const panel = `jc-${journey.id}`
  return (
    <article
      aria-label={t('journey.aria', { n: index, dep: fromMinutes(journey.depart), arr: fromMinutes(journey.arrive) }) + (past ? `, ${t('journey.past').toLowerCase()}` : '')}
      className={`rise rounded-2xl border bg-surface transition-shadow hover:shadow-md ${selected ? 'border-primary ring-2 ring-primary/30' : past ? 'border-dashed border-hair' : 'border-hair'} ${past ? 'opacity-65' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pt-3 sm:px-5">
          {badges.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 rounded-full bg-ok/15 px-2.5 py-0.5 text-xs font-bold text-ok">
              <Zap className="h-3 w-3" aria-hidden="true" /> {t(BADGE_KEY[b])}
            </span>
          ))}
        </div>
      )}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panel} className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5">
        <span className="min-w-0 flex-1">
          <span className="tnum block font-display text-[1.35rem] font-extrabold leading-tight">
            {fromMinutes(journey.depart)} <span className="text-muted">→</span> {fromMinutes(journey.arrive)}
          </span>
          <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {journey.legs.map((l, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                {i > 0 && <ArrowRightLeft className="h-3 w-3 text-muted" aria-hidden="true" />}
                <LineBadge line={l.line} size="sm" short />
              </span>
            ))}
            <span className="text-xs text-muted">
              {transfer ? t('journey.oneTransfer') : t('journey.stops', { count: stopsTotal })}
              {past && ` · ${t('journey.past')}`}
            </span>
          </span>
        </span>
        <span className="text-right">
          <span className="tnum block font-display text-2xl font-extrabold leading-none">{formatDuration(journey.duration)}</span>
          <span className="sr-only">{t('journey.duration')}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {onSelect && (
        <div className="px-4 pb-3 sm:px-5">
          <button type="button" onClick={onSelect} aria-pressed={selected} className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold ${selected ? 'border-primary bg-primary-soft text-primary' : 'border-hair text-primary hover:bg-primary-soft'}`}>
            <MapIcon className="h-3.5 w-3.5" aria-hidden="true" /> {selected ? t('journey.onMap') : t('journey.showMap')}
          </button>
        </div>
      )}

      {open && (
        <div id={panel} className="space-y-4 border-t border-hair px-4 py-4 sm:px-5">
          {journey.legs.map((leg, i) => (
            <div key={i}>
              {i > 0 && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-primary-soft px-3 py-2.5 text-sm">
                  <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p>
                    <strong>{t('journey.transferAt', { name: getStop(leg.fromStopId).name })}</strong>
                    {getStop(leg.fromStopId).detail ? ` (${getStop(leg.fromStopId).detail})` : ''} — {t('journey.wait', { wait: leg.depart - journey.legs[i - 1].arrive, min: MIN_TRANSFER })}
                  </p>
                </div>
              )}
              <LegView leg={leg} />
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
