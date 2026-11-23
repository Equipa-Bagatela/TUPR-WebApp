import { ShieldCheck } from 'lucide-react'
import { SCHEDULE_CHECKED } from '../data/meta'
import { useT } from '../i18n'
import { parseIsoDate } from '../utils/time'

/** "Horários conferidos em …": data da última verificação contra o sistema de tracking. */
export function ScheduleChecked({ className = '' }: { className?: string }) {
  const { t, locale } = useT()
  const d = parseIsoDate(SCHEDULE_CHECKED)
  if (!d) return null
  return (
    <p className={`flex items-center gap-1.5 text-xs text-muted ${className}`}>
      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ok" aria-hidden="true" />
      {t('checked.text', { date: d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) })}
    </p>
  )
}
