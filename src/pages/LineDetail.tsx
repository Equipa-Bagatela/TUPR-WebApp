import { Link, useParams } from 'react-router-dom'
import { DayChips } from '../components/DayChips'
import { MapBox } from '../components/MapBox'
import { Timeline } from '../components/Timeline'
import { EmptyState, PageHeader } from '../components/ui'
import { lineById } from '../data/lines'
import { useNow } from '../hooks/useNow'
import { hasServiceOn, runningTrips } from '../utils/service'
import { formatDuration, minutesOfDay, toMinutes } from '../utils/time'
import { useEffect, useState } from 'react'

export default function LineDetail() {
  const { id } = useParams()
  const line = id ? lineById(id) : undefined
  const now = useNow(30_000)
  const [day, setDay] = useState(() => (hasServiceOn(new Date().getDay()) ? new Date().getDay() : 1))
  const [trip, setTrip] = useState<number | null>(null)
  useEffect(() => setTrip(null), [id, day])

  if (!line) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Linha não encontrada">
          <Link to="/linhas" className="font-semibold text-primary underline">Ver todas as linhas</Link>
        </EmptyState>
      </div>
    )
  }
  const running = runningTrips(line, day)
  const isToday = day === now.getDay()
  const nowMin = minutesOfDay(now)
  // viagem por omissão: a próxima a partir de agora (se hoje), senão a primeira
  const defaultTrip = (isToday ? running.find(({ index }) => toMinutes(line.stops[line.stops.length - 1].times[index]) >= nowMin) : undefined) ?? running[0]
  const sel = trip !== null && running.some((r) => r.index === trip) ? trip : defaultTrip.index
  const dur = toMinutes(line.stops[line.stops.length - 1].times[sel]) - toMinutes(line.stops[0].times[sel])
  const nextIdx = isToday ? line.stops.findIndex((s) => toMinutes(s.times[sel]) >= nowMin) : -1
  const live = isToday && nextIdx > 0 && toMinutes(line.stops[0].times[sel]) <= nowMin

  return (
    <>
      <PageHeader title={line.name} subtitle={line.summary}>
        <div className="h-1.5 w-24 rounded-full" style={{ background: `var(--line-${line.id})` }} aria-hidden="true" />
        <p className="mt-3 text-sm text-muted">
          {line.stops.length - 1} paragens · circuito de {formatDuration(dur)} · {line.trips.length} viagens por dia · <Link to="/linhas" className="font-semibold text-primary underline">todas as linhas</Link>
        </p>
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <section aria-labelledby="percurso-titulo">
          <h2 id="percurso-titulo" className="mb-4 text-2xl font-bold">Percurso completo</h2>
          <div className="mb-5 space-y-4">
            <DayChips value={day} onChange={setDay} />
            <div>
              <p className="mb-2 text-sm font-semibold">Hora de partida</p>
              <div role="radiogroup" aria-label="Hora de partida da viagem" className="flex flex-wrap gap-2">
                {running.map(({ trip: t, index }) => (
                  <button key={t.id} role="radio" aria-checked={index === sel} onClick={() => setTrip(index)} className={`tnum min-h-11 min-w-[4.25rem] rounded-xl border px-3 text-sm font-bold ${index === sel ? 'border-transparent text-white' : 'border-hair bg-surface'}`} style={index === sel ? { background: line.color } : undefined}>
                    {t.departure}
                  </button>
                ))}
              </div>
              {day === 6 && <p className="mt-2 text-sm text-muted">Ao sábado não se realizam as viagens das 18:00 e das 19:00.</p>}
            </div>
          </div>
          {live && <p role="status" className="mb-3 rounded-xl bg-primary-soft px-3 py-2 text-sm font-semibold">Esta viagem está a decorrer agora — a próxima paragem está assinalada.</p>}
          <div className="rounded-2xl border border-hair bg-surface p-4 sm:p-6">
            <Timeline line={line} tripIndex={sel} nextStopIdx={live ? nextIdx : undefined} />
          </div>
        </section>
        <aside aria-label={`Mapa da ${line.name}`} className="lg:sticky lg:top-24 lg:self-start">
          <MapBox height="h-80 lg:h-[30rem]" lineIds={[line.id]} label={`Mapa da ${line.name}`} />
        </aside>
      </div>
    </>
  )
}
