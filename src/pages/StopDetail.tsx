import { MapPinned } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DayChips } from '../components/DayChips'
import { FavoriteButton } from '../components/FavoriteButton'
import { LineBadge } from '../components/LineBadge'
import { MapBox } from '../components/MapBox'
import { NextDepartures } from '../components/DepartureList'
import { EmptyState, PageHeader } from '../components/ui'
import { linesAtStop, passingsOf, stopById } from '../data/network'
import { useFavorites } from '../hooks/useFavorites'
import { useNow } from '../hooks/useNow'
import { departuresOnDay } from '../utils/departures'
import { hasServiceOn } from '../utils/service'

export default function StopDetail() {
  const { id } = useParams()
  const stop = id ? stopById.get(id) : undefined
  const now = useNow(10_000)
  const fav = useFavorites()
  const [day, setDay] = useState(() => (hasServiceOn(new Date().getDay()) ? new Date().getDay() : 1))
  if (!stop) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Paragem não encontrada"><Link to="/paragens" className="font-semibold text-primary underline">Ver todas as paragens</Link></EmptyState>
      </div>
    )
  }
  const ls = linesAtStop(stop.id)
  const all = departuresOnDay(stop.id, day)
  return (
    <>
      <PageHeader title={stop.name} subtitle={stop.detail}>
        <div className="flex flex-wrap items-center gap-3">
          <FavoriteButton active={fav.isStopFav(stop.id)} onToggle={() => fav.toggleStop(stop.id)} label={stop.name} />
          <span className="text-sm font-semibold text-muted">Guardar nos favoritos</span>
          {stop.coords && (
            <Link to={`/mapa?paragem=${stop.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hair px-4 text-sm font-bold text-primary hover:bg-primary-soft">
              <MapPinned className="h-4 w-4" aria-hidden="true" /> Ver no mapa
            </Link>
          )}
          <Link to={`/planear?de=${stop.id}`} className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-on-primary">Partir daqui</Link>
        </div>
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-10">
          <section aria-labelledby="pp">
            <h2 id="pp" className="mb-3 text-2xl font-bold">Próximas partidas</h2>
            <div aria-live="polite"><NextDepartures stopId={stop.id} now={now} limit={6} /></div>
          </section>
          <section aria-labelledby="ll">
            <h2 id="ll" className="mb-3 text-2xl font-bold">Linhas que passam nesta paragem</h2>
            <ul className="flex flex-wrap gap-3">
              {ls.map((l) => (
                <li key={l.id}><Link to={`/linhas/${l.id}`} className="inline-block rounded-full" aria-label={`Ver ${l.name}`}><LineBadge line={l} /></Link></li>
              ))}
            </ul>
            {passingsOf(stop.id).some((p) => p.index === 0 || p.index === p.line.stops.length - 1) && (
              <p className="mt-3 text-sm text-muted">Esta paragem é o início/fim do circuito: a última hora de cada viagem é a chegada e não consta das partidas.</p>
            )}
          </section>
          <section aria-labelledby="dd">
            <h2 id="dd" className="mb-3 text-2xl font-bold">Todos os horários</h2>
            <DayChips value={day} onChange={setDay} />
            <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {all.map((d) => (
                <li key={d.line.id + d.tripIndex} className="rounded-xl border border-hair bg-surface px-2 py-2 text-center">
                  <span className="tnum block font-display text-lg font-bold">{d.time}</span>
                  <span className="block text-xs font-semibold" style={{ color: `var(--line-${d.line.id})` }}>{d.line.shortName}</span>
                </li>
              ))}
            </ul>
            {all.length === 0 && <EmptyState title="Sem partidas neste dia" />}
          </section>
        </div>
        <aside aria-label="Localização da paragem" className="lg:sticky lg:top-24 lg:self-start">
          {stop.coords ? <MapBox height="h-80" highlightStopId={stop.id} label={`Mapa com a paragem ${stop.name}`} /> : <EmptyState title="Sem localização no mapa">Não temos uma posição fiável para esta paragem.</EmptyState>}
          <p className="mt-2 text-xs text-muted">Posição aproximada (OpenStreetMap).</p>
        </aside>
      </div>
    </>
  )
}
