import { Crosshair, ExternalLink, Moon, RefreshCw, TriangleAlert, WifiOff } from 'lucide-react'
import { lines } from '../data/lines'
import { refreshBuses, useBuses } from '../hooks/useBuses'
import { useNow } from '../hooks/useNow'
import { useT } from '../i18n'
import { TRACKING_PAGE } from '../services/tracking'
import { earliest, lineRunState, type NextRun } from '../utils/runState'
import { clock, weekdayName } from '../utils/time'
import { LineBadge } from './LineBadge'
import { Skeleton } from './ui'

function useBusStatusLabel() {
  const { t } = useT()
  return (s: string) => (s === 'ontime' ? t('bus.onTime') : t('bus.statusOther', { status: s || '—' }))
}

/** Painel "Autocarros em direto": por linha, quantos circulam agora e onde (botão "Localizar"). */
export function LiveBuses({ lineIds, onLocate, compact = false, headingLevel = 3 }: { lineIds?: string[]; onLocate?: (busId: string) => void; compact?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3'
  const { t } = useT()
  const label = useBusStatusLabel()
  const { buses, status, updatedAt } = useBuses()
  const now = useNow(30_000)
  const shown = lines.filter((l) => !lineIds || lineIds.includes(l.id))
  const states = new Map(shown.map((l) => [l.id, lineRunState(l, now)]))
  const when = (n: NextRun) => (n.dayOffset === 0 ? t('time.today') : n.dayOffset === 1 ? t('time.tomorrow') : weekdayName(n.weekday).toLowerCase())
  const nextText = (n: NextRun | null) => (n ? t('bus.nextAt', { when: when(n), time: n.time }) : '')
  const noneShown = status === 'ok' && shown.every((l) => !buses.some((b) => b.lineId === l.id))
  const anyScheduled = shown.some((l) => states.get(l.id)?.scheduledNow)
  const soonest = earliest(shown.map((l) => states.get(l.id)?.next ?? null))
  return (
    <section aria-labelledby="live-titulo" className="glass-panel rounded-2xl border border-hair bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Heading id="live-titulo" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${status === 'error' ? 'bg-bad' : noneShown ? 'bg-muted/60' : 'live-dot bg-accent'}`} aria-hidden="true" />
          {t('bus.live')}
        </Heading>
        <div className="flex items-center gap-1 text-xs text-muted">
          {updatedAt && status !== 'error' && <span className="tnum">{t('bus.updated', { time: clock(updatedAt) })}</span>}
          <button onClick={refreshBuses} aria-label={t('bus.refresh')} title={t('bus.refresh')} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface-2">
            <RefreshCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {status === 'loading' && buses.length === 0 ? (
        <div className="space-y-2" aria-busy="true">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <>
          {status === 'error' && (
            <p role="alert" className="mb-3 flex items-start gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-sm">
              <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />
              {buses.length > 0 ? t('bus.errorStale') : t('bus.error')}
            </p>
          )}
          {noneShown && (
            <div role="status" className="rise mb-3 flex items-start gap-3 rounded-xl bg-surface-2 px-3 py-3 text-sm">
              {anyScheduled ? <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden="true" /> : <Moon className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
              <p className="leading-snug">
                <strong>{anyScheduled ? t('bus.noSignal') : now.getDay() === 0 ? t('bus.sundayOff') : t('bus.noneNow')}</strong>{' '}
                {!anyScheduled && nextText(soonest)}
              </p>
            </div>
          )}
          <ul className="space-y-2" aria-live="polite">
            {shown.map((line) => {
              const mine = buses.filter((b) => b.lineId === line.id)
              return (
                <li key={line.id} className="rounded-xl border border-hair px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <LineBadge line={line} size="sm" />
                    <span className="text-sm font-semibold">{mine.length > 0 ? t('bus.running', { count: mine.length }) : status === 'error' ? t('bus.unknown') : states.get(line.id)?.scheduledNow ? t('bus.lineNoSignal') : t('bus.lineIdle')}</span>
                  </div>
                  {mine.length === 0 && status === 'ok' && !states.get(line.id)?.scheduledNow && states.get(line.id)?.next && (
                    <p className="mt-1.5 text-sm text-muted">{nextText(states.get(line.id)!.next)}</p>
                  )}
                  {mine.map((b) => (
                    <div key={b.id} className="mt-2 flex items-center justify-between gap-2 text-sm">
                      <span className={b.status === 'ontime' ? 'font-semibold text-ok' : 'font-semibold text-warn'}>{label(b.status)}</span>
                      {onLocate && (
                        <button onClick={() => onLocate(b.id)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-hair px-3 font-semibold text-primary hover:bg-primary-soft">
                          <Crosshair className="h-4 w-4" aria-hidden="true" /> {t('bus.locate')}
                        </button>
                      )}
                    </div>
                  ))}
                </li>
              )
            })}
          </ul>
        </>
      )}
      {!compact && (
        <p className="mt-3 text-xs text-muted">
          {t('bus.credit')}{' '}
          <a className="inline-flex items-center gap-1 font-semibold text-primary underline" href={TRACKING_PAGE} target="_blank" rel="noopener noreferrer">
            Eleven Systems <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </p>
      )}
    </section>
  )
}
