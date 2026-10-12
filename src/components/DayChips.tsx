import { useT } from '../i18n'
import { weekdayName } from '../utils/time'

const ORDER = [1, 2, 3, 4, 5, 6] // o PDF só refere segunda a sábado

export function DayChips({ value, onChange, label }: { value: number; onChange: (d: number) => void; label?: string }) {
  const { t } = useT()
  return (
    <div role="radiogroup" aria-label={label ?? t('day.aria')} className="flex flex-wrap gap-2">
      {ORDER.map((d) => {
        const on = d === value
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(d)}
            aria-label={weekdayName(d)}
            className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition ${on ? 'border-primary bg-primary text-on-primary' : 'border-hair bg-surface text-ink hover:bg-primary-soft'}`}
          >
            <span className="sm:hidden" aria-hidden="true">{weekdayName(d, 'short')}</span>
            <span className="hidden sm:inline" aria-hidden="true">{weekdayName(d)}</span>
          </button>
        )
      })}
    </div>
  )
}
