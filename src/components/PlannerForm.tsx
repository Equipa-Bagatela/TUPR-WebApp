import { ArrowDownUp, CalendarDays, Clock, LocateFixed, MapPin, Navigation } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useT } from '../i18n'
import { nearestStops } from '../utils/geo'
import { clock, isoDate, parseIsoDate } from '../utils/time'
import { StopPicker } from './StopPicker'

export interface PlanParams {
  from: string
  to: string
  date: string
  time: string
}

function formatDate(iso: string, locale: string) {
  const d = parseIsoDate(iso)
  return d ? d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--/--/----'
}

/**
 * Campo de data/hora. Em computador é o campo nativo. Em ecrãs tácteis o retângulo é desenhado aqui (texto sempre bem
 * centrado, igual em todos os telemóveis) e o campo nativo fica por cima, invisível, só para abrir o seletor ao tocar.
 */
function PickerBox({ id, type, label, icon, value, onChange, shown }: { id: string; type: 'date' | 'time'; label: string; icon: ReactNode; value: string; onChange: (v: string) => void; shown: string }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-muted">
        {icon} {label}
      </label>
      <div className="dt-box solid relative h-12 rounded-xl border border-hair bg-surface">
        <input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)} className="date-time-field h-full w-full min-w-0 max-w-full rounded-xl bg-transparent px-3 text-base font-semibold text-ink" />
        <span aria-hidden="true" className="dt-text">
          <span className="tnum truncate">{shown}</span>
          {type === 'date' ? <CalendarDays className="h-5 w-5 shrink-0 text-ink" /> : <Clock className="h-5 w-5 shrink-0 text-ink" />}
        </span>
      </div>
    </div>
  )
}

export function PlannerForm({ initial, onSubmit }: { initial?: Partial<PlanParams>; onSubmit: (p: PlanParams) => void }) {
  const { t, locale } = useT()
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
    <form onSubmit={submit} className="space-y-3.5" noValidate aria-label={t('plan.title')}>
      {/* Origem e destino juntos num só cartão, com a linha do percurso à esquerda */}
      <div className="relative z-20 rounded-2xl border border-hair bg-surface md:grid md:grid-cols-2">
        <span aria-hidden="true" className="pointer-events-none absolute left-[1.65rem] top-[1.7rem] h-[3.4rem] border-l-2 border-dotted border-muted/60 md:hidden" />
        <div className="border-b border-hair md:border-b-0 md:border-r">
          <StopPicker
            variant="row"
            label={t('plan.from')}
            value={from}
            onChange={setFrom}
            placeholder={t('plan.fromPh')}
            leading={<span className="block h-3.5 w-3.5 rounded-full border-[3px] border-ok bg-surface" />}
          />
        </div>
        <StopPicker
          variant="row"
          label={t('plan.to')}
          value={to}
          onChange={setTo}
          placeholder={t('plan.toPh')}
          leading={<MapPin className="h-5 w-5 text-bad" aria-hidden="true" />}
        />
        <button
          type="button"
          onClick={swap}
          aria-label={t('plan.swap')}
          className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-hair bg-surface text-primary shadow-sm transition hover:bg-primary-soft active:rotate-180 md:left-1/2 md:right-auto md:-translate-x-1/2"
        >
          <ArrowDownUp className="h-[1.1rem] w-[1.1rem] md:rotate-90" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={useLocation}
        disabled={geo.status === 'loading' && wantNear}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-bold text-primary hover:underline disabled:opacity-60"
      >
        <LocateFixed className={`h-4 w-4 ${geo.status === 'loading' && wantNear ? 'animate-pulse' : ''}`} aria-hidden="true" />
        {geo.status === 'loading' && wantNear ? t('loc.loading') : t('plan.useLocationFrom')}
      </button>
      {geo.status === 'denied' && wantNear === false && <p className="-mt-2 text-sm text-muted">{t('loc.deniedShort')}</p>}

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 max-[339px]:grid-cols-1 md:max-w-xl">
        <PickerBox id="plan-date" type="date" label={t('plan.date')} icon={<CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />} value={date} onChange={setDate} shown={formatDate(date, locale)} />
        <PickerBox id="plan-time" type="time" label={t('plan.time')} icon={<Clock className="h-3.5 w-3.5" aria-hidden="true" />} value={time} onChange={setTime} shown={time || '--:--'} />
      </div>

      {/* atalhos: seletor compacto de três opções */}
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-2 p-1 md:max-w-xl" role="group" aria-label={t('plan.shortcuts')}>
        {[
          { l: t('plan.today'), on: () => setDate(today), a: date === today },
          { l: t('plan.tomorrow'), on: () => setDate(tomorrow), a: date === tomorrow },
        ].map((b) => (
          <button key={b.l} type="button" onClick={b.on} aria-pressed={b.a} className={`min-h-11 rounded-xl text-sm font-bold transition ${b.a ? 'bg-surface text-primary shadow-sm ring-1 ring-hair' : 'text-ink/75 hover:bg-surface/60'}`}>
            {b.l}
          </button>
        ))}
        <button type="button" onClick={() => { setDate(today); setTime(clock(new Date())) }} className="min-h-11 rounded-xl text-sm font-bold text-ink/75 transition hover:bg-surface/60">
          {t('plan.nowBtn')}
        </button>
      </div>

      {touched && (invalid || same) && (
        <p role="alert" className="text-sm font-semibold text-bad">
          {invalid ? t('plan.errMissing') : t('plan.errSame')}
        </p>
      )}
      <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-base font-bold text-on-primary shadow-[0_10px_22px_-10px_rgba(20,60,87,0.7)] transition hover:opacity-90 active:scale-[0.99] md:w-auto md:min-w-64">
        <Navigation className="h-5 w-5" aria-hidden="true" /> {t('plan.title')}
      </button>
    </form>
  )
}
