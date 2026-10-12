import { Crosshair, ExternalLink, RefreshCw, WifiOff } from 'lucide-react'
import { lines } from '../data/lines'
import { refreshBuses, useBuses } from '../hooks/useBuses'
import { useT } from '../i18n'
import { TRACKING_PAGE } from '../services/tracking'
import { clock } from '../utils/time'
import { LineBadge } from './LineBadge'
import { Skeleton } from './ui'

function useBusStatusLabel() {
  const { t } = useT()
  return (s: string) => (s === 'ontime' ? t('bus.onTime') : t('bus.statusOther', { status: s || '—' }))
}

/** Painel "Autocarros em direto": por linha, quantos circulam agora e onde (botão "Localizar"). */
export function LiveBuses({ lineIds, onLocate, compact = false }: { lineIds?: string[]; onLocate?: (busId: string) => void; compact?: boolean }) {
  const { t } = useT()
  const label = useBusStatusLabel()
  const { buses, status, updatedAt } = useBuses()
  const shown = lines.filter((l) => !lineIds || lineIds.includes(l.id))
  return (
    <section aria-labelledby="live-titulo" className="rounded-2xl border border-hair bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 id="live-titulo" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${status === 'error' ? 'bg-bad' : 'live-dot bg-accent'}`} aria-hidden="true" />
          {t('bus.live')}
        </h3>
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
          <ul className="space-y-2" aria-live="polite">
            {shown.map((line) => {
              const mine = buses.filter((b) => b.lineId === line.id)
              return (
                <li key={line.id} className="rounded-xl border border-hair px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <LineBadge line={line} size="sm" />
                    <span className="text-sm font-semibold">{mine.length > 0 ? t('bus.running', { count: mine.length }) : status === 'error' ? t('bus.unknown') : t('bus.none')}</span>
                  </div>
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
