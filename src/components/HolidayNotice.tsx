import { CalendarDays } from 'lucide-react'
import { useT } from '../i18n'
import { nationalHoliday } from '../utils/holidays'

/** Aviso quando o dia é feriado nacional: os horários publicados não dizem se há serviço, por isso a app não o afirma. */
export function HolidayNotice({ date }: { date: Date }) {
  const { t } = useT()
  const key = nationalHoliday(date)
  if (!key) return null
  return (
    <div role="status" className="rise mb-3 flex items-start gap-3 rounded-2xl border border-warn/40 bg-surface-2 px-4 py-3">
      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-warn" aria-hidden="true" />
      <p className="text-sm leading-snug">
        <strong>{t('hol.notice', { name: t(key) })}</strong> {t('hol.noticeText')}
      </p>
    </div>
  )
}
