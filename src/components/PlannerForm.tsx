import { ArrowDownUp, CalendarDays, Clock, Navigation } from 'lucide-react'
import { useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useT } from '../i18n'
import { nearestStops } from '../utils/geo'
import { clock, isoDate } from '../utils/time'
import { StopPicker } from './StopPicker'

export interface PlanParams {
  from: string
  to: string
  date: string
  time: string
}

export function PlannerForm({ initial, onSubmit, compact = false }: { initial?: Partial<PlanParams>; onSubmit: (p: PlanParams) => void; compact?: boolean }) {
  const { t } = useT()
  const now = new Date()
  const [from, setFrom] = useState<string | null>(initial?.from ?? null)
  const [to, setTo] = useState<string | null>(initial?.to ?? null)
  const [date, setDate] = useState(initial?.date ?? isoDate(now))
  const [time, setTime] = useState(initial?.time ?? clock(now))
  const [touched, setTouched] = useState(false)
  const geo = useGeolocation()
  const [wantNear, setWantNear] = useState(false)

  // Quando a localização chega e foi pedida para a origem, escolhe a paragem mais próxima.
  const [lastPos, setLastPos] = useState(geo.pos)
  if (geo.pos !== lastPos) {
    setLastPos(geo.pos)
    if (wantNear && geo.pos) {
      const n = nearestStops(geo.pos, 1)[0]
      if (n) setFrom(n.stop.id)
      setWantNear(false)
    }
  }
  const useLocation = () => {
    if (geo.pos) {
      const n = nearestStops(geo.pos, 1)[0]
      if (n) setFrom(n.stop.id)
    } else {
      setWantNear(true)
      geo.request()
    }
  }

  const invalid = !from || !to
  const same = from && to && from === to
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (invalid || same) return
    onSubmit({ from: from!, to: to!, date, time })
  }
  const swap = () => {
    setFrom(to)
    setTo(from)
  }
  const today = isoDate(now)
  const tomorrow = isoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1))

  return (
    <form onSubmit={submit} className="space-y-4" noValidate aria-label={t('plan.title')}>
      <div className={`grid gap-3 ${compact ? 'lg:grid-cols-[1fr_auto_1fr]' : 'md:grid-cols-[1fr_auto_1fr]'} items-end`}>
        <StopPicker label={t('plan.from')} value={from} onChange={setFrom} placeholder={t('plan.fromPh')} onUseLocation={useLocation} locating={geo.status === 'loading' && wantNear} />
        <button type="button" onClick={swap} aria-label={t('plan.swap')} className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-hair bg-surface text-primary transition hover:bg-primary-soft active:rotate-180 md:mb-1">
          <ArrowDownUp className="h-5 w-5 md:rotate-90" aria-hidden="true" />
        </button>
        <StopPicker label={t('plan.to')} value={to} onChange={setTo} placeholder={t('plan.toPh')} />
      </div>
      {geo.status === 'denied' && wantNear === false && <p className="text-sm text-muted">{t('loc.deniedShort')}</p>}
      <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
        <div>
          <label htmlFor="plan-date" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-muted" aria-hidden="true" /> {t('plan.date')}
          </label>
          <input id="plan-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="h-14 w-full rounded-xl border border-hair bg-surface px-3 text-base text-ink" />
        </div>
        <div>
          <label htmlFor="plan-time" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
            <Clock className="h-4 w-4 text-muted" aria-hidden="true" /> {t('plan.time')}
          </label>
          <input id="plan-time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="h-14 w-full rounded-xl border border-hair bg-surface px-3 text-base text-ink" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('plan.shortcuts')}>
        {[
          { l: t('plan.today'), on: () => setDate(today), a: date === today },
          { l: t('plan.tomorrow'), on: () => setDate(tomorrow), a: date === tomorrow },
        ].map((b) => (
          <button key={b.l} type="button" onClick={b.on} aria-pressed={b.a} className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${b.a ? 'border-primary bg-primary-soft text-primary' : 'border-hair bg-surface text-ink'}`}>
            {b.l}
          </button>
        ))}
        <button type="button" onClick={() => { setDate(today); setTime(clock(new Date())) }} className="min-h-11 rounded-full border border-hair bg-surface px-4 text-sm font-semibold text-ink">
          {t('plan.nowBtn')}
        </button>
      </div>
      {touched && (invalid || same) && (
        <p role="alert" className="text-sm font-semibold text-bad">
          {invalid ? t('plan.errMissing') : t('plan.errSame')}
        </p>
      )}
      <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-on-primary transition hover:opacity-90 active:scale-[0.99] sm:w-auto sm:min-w-64">
        <Navigation className="h-5 w-5" aria-hidden="true" /> {t('plan.title')}
      </button>
    </form>
  )
}
