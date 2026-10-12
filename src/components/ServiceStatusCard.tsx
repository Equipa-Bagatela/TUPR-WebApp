import { CircleCheck, CircleOff, TriangleAlert } from 'lucide-react'
import { useServiceStatus } from '../hooks/useServiceStatus'
import { useT } from '../i18n'
import { hasServiceOn } from '../utils/service'
import { Skeleton } from './ui'

export function ServiceStatusCard({ now }: { now: Date }) {
  const { t } = useT()
  const { loading, error, status, retry } = useServiceStatus()
  const noServiceToday = !hasServiceOn(now.getDay())
  return (
    <section aria-labelledby="estado-titulo" className="rounded-2xl border border-hair bg-surface p-4">
      <h3 id="estado-titulo" className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-muted">
        {t('status.heading')}
      </h3>
      {loading ? (
        <div className="flex items-center gap-3" aria-busy="true">
          <Skeleton className="h-10 w-10 !rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
      ) : error || !status ? (
        <div role="alert" className="flex items-center gap-3">
          <TriangleAlert className="h-7 w-7 text-warn" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">{t('status.error')}</p>
            <button onClick={retry} className="min-h-11 text-sm font-semibold text-primary underline">{t('error.retry')}</button>
          </div>
        </div>
      ) : (
        <div className="rise flex items-start gap-3" role="status">
          {status.level === 'normal' ? <CircleCheck className="h-8 w-8 shrink-0 text-ok" aria-hidden="true" /> : status.level === 'disrupted' ? <TriangleAlert className="h-8 w-8 shrink-0 text-warn" aria-hidden="true" /> : <CircleOff className="h-8 w-8 shrink-0 text-bad" aria-hidden="true" />}
          <div>
            <p className="font-display text-lg font-bold leading-tight">{status.title ?? t(`status.${status.level}` as 'status.normal')}</p>
            <p className="text-sm text-muted">{status.message ?? t(`status.${status.level}Msg` as 'status.normalMsg')}</p>
            {noServiceToday && <p className="mt-1 text-sm font-semibold text-warn">{t('status.sundayNote')}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
