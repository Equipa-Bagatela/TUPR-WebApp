import { ChevronDown, FilterX } from 'lucide-react'
import { useState } from 'react'
import { DayChips } from '../components/DayChips'
import { LineBadge } from '../components/LineBadge'
import { StopPicker } from '../components/StopPicker'
import { EmptyState, PageHeader } from '../components/ui'
import { lines } from '../data/lines'
import { getStop, stopLabel } from '../data/network'
import { hasServiceOn, runningTrips } from '../utils/service'
import type { Line } from '../types'

function FullTable({ line, day }: { line: Line; day: number }) {
  const cols = runningTrips(line, day)
  return (
    <section aria-labelledby={`t-${line.id}`} className="rise">
      <h3 id={`t-${line.id}`} className="mb-3"><LineBadge line={line} /></h3>
      {/* Desktop: tabela com primeira coluna fixa */}
      <div className="hidden overflow-x-auto rounded-2xl border border-hair bg-surface md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Horários da {line.name}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 min-w-[17rem] bg-surface-2 px-4 py-3 text-left font-bold">Paragem</th>
              {cols.map(({ trip }) => <th key={trip.id} scope="col" className="tnum bg-surface-2 px-3 py-3 text-center font-bold">{trip.departure}</th>)}
            </tr>
          </thead>
          <tbody>
            {line.stops.map((s, i) => {
              const st = getStop(s.stopId)
              return (
                <tr key={i} className="border-t border-hair odd:bg-surface even:bg-bg/60">
                  <th scope="row" className="sticky left-0 bg-inherit px-4 py-2 text-left font-semibold leading-snug">
                    {st.name}{st.detail && <span className="block text-xs font-normal text-muted">{st.detail}</span>}
                  </th>
                  {cols.map(({ index }) => <td key={index} className="tnum px-3 py-2 text-center">{s.times[index]}</td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile: uma viagem por cartão */}
      <ul className="space-y-2.5 md:hidden">
        {cols.map(({ trip, index }) => {
          const first = line.stops[0]
          const last = line.stops[line.stops.length - 1]
          return (
            <li key={trip.id}>
              <details className="group rounded-2xl border border-hair bg-surface px-4">
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3">
                  <span className="tnum font-display text-2xl font-extrabold">{trip.departure}</span>
                  <span className="min-w-0 flex-1 text-sm text-muted">
                    <span className="block truncate">{getStop(first.stopId).name}</span>
                    <span className="tnum block font-semibold text-ink">{first.times[index]} → {last.times[index]}</span>
                  </span>
                  <ChevronDown className="h-5 w-5 text-muted transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <ol className="border-t border-hair py-2">
                  {line.stops.map((s, i) => (
                    <li key={i} className="flex gap-3 py-1.5 text-sm">
                      <span className="tnum w-12 shrink-0 font-bold">{s.times[index]}</span>
                      <span className="leading-snug">{stopLabel(getStop(s.stopId))}</span>
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function StopTimes({ stopId, lineFilter, day }: { stopId: string; lineFilter: string; day: number }) {
  const rows = lines
    .filter((l) => lineFilter === 'all' || l.id === lineFilter)
    .flatMap((line) => line.stops.map((s, i) => ({ line, s, i })).filter(({ s }) => s.stopId === stopId))
  if (rows.length === 0) return <EmptyState title="Esta linha não passa nesta paragem">Escolha “Todas” ou outra linha.</EmptyState>
  return (
    <div className="space-y-5">
      {rows.map(({ line, s, i }) => {
        const trips = runningTrips(line, day)
        const arrivalOnly = i === line.stops.length - 1
        return (
          <section key={line.id + i} className="rise rounded-2xl border border-hair bg-surface p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <LineBadge line={line} />
              {arrivalOnly && <span className="text-sm text-muted">Fim do circuito (hora de chegada)</span>}
              {i === 0 && <span className="text-sm text-muted">Início do circuito</span>}
            </div>
            {/* Desktop: tabela; Mobile: grelha de horas */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <caption className="sr-only">Horas de passagem da {line.name} em {stopLabel(getStop(stopId))}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left">Paragem</th>
                    {trips.map(({ trip }) => <th key={trip.id} scope="col" className="tnum px-3 py-2 text-center text-muted">{trip.departure}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-hair">
                    <th scope="row" className="px-3 py-3 text-left font-semibold">{getStop(stopId).name}</th>
                    {trips.map(({ index }) => <td key={index} className="tnum px-3 py-3 text-center font-bold">{s.times[index]}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <ul className="grid grid-cols-3 gap-2 md:hidden">
              {trips.map(({ index, trip }) => (
                <li key={trip.id} className="tnum rounded-xl bg-surface-2 py-3 text-center font-display text-lg font-bold">{s.times[index]}</li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

export default function Timetables() {
  const today = new Date().getDay()
  const [day, setDay] = useState(hasServiceOn(today) ? today : 1)
  const [lineId, setLineId] = useState('all')
  const [stopId, setStopId] = useState<string | null>(null)
  const reset = () => { setLineId('all'); setStopId(null) }
  const filtered = lineId !== 'all' || stopId !== null
  return (
    <>
      <PageHeader title="Horários" subtitle="Horários oficiais de segunda-feira a sábado. Escolha a linha, a paragem e o dia." />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="space-y-5 rounded-2xl border border-hair bg-surface p-4 sm:p-5">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Linha</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Linha">
              {[{ id: 'all', name: 'Todas' }, ...lines].map((l) => (
                <button key={l.id} role="radio" aria-checked={lineId === l.id} onClick={() => setLineId(l.id)} className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${lineId === l.id ? 'border-primary bg-primary text-on-primary' : 'border-hair bg-surface hover:bg-primary-soft'}`}>
                  {l.name}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="max-w-xl"><StopPicker label="Paragem" value={stopId} onChange={setStopId} placeholder="Todas as paragens" /></div>
          <div>
            <p className="mb-2 text-sm font-semibold">Dia</p>
            <DayChips value={day} onChange={setDay} />
            {day === 6 && <p className="mt-2 text-sm text-muted">Ao sábado não se realizam as viagens das 18:00 e das 19:00.</p>}
          </div>
          {filtered && (
            <button onClick={reset} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary"><FilterX className="h-4 w-4" aria-hidden="true" /> Limpar filtros</button>
          )}
        </div>
        {stopId ? (
          <StopTimes stopId={stopId} lineFilter={lineId} day={day} />
        ) : (
          <div className="space-y-8">
            {lines.filter((l) => lineId === 'all' || l.id === lineId).map((l) => <FullTable key={l.id + day} line={l} day={day} />)}
          </div>
        )}
        <p className="text-sm text-muted">As linhas são circulares: o último horário de cada coluna é a chegada ao ponto de partida. O PDF oficial não refere domingos nem feriados.</p>
      </div>
    </>
  )
}
