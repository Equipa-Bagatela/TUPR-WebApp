import { WEEKDAYS, WEEKDAYS_SHORT } from '../utils/time'

const ORDER = [1, 2, 3, 4, 5, 6] // o PDF só refere segunda a sábado

export function DayChips({ value, onChange, label = 'Dia da semana' }: { value: number; onChange: (d: number) => void; label?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {ORDER.map((d) => {
        const on = d === value
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(d)}
            aria-label={WEEKDAYS[d]}
            className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition ${on ? 'border-primary bg-primary text-on-primary' : 'border-hair bg-surface text-ink hover:bg-primary-soft'}`}
          >
            <span className="sm:hidden" aria-hidden="true">{WEEKDAYS_SHORT[d]}</span>
            <span className="hidden sm:inline" aria-hidden="true">{WEEKDAYS[d]}</span>
          </button>
        )
      })}
    </div>
  )
}
