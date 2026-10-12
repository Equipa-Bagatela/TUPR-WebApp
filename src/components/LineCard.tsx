import { ArrowRight, Bus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStop } from '../data/network'
import type { Line } from '../types'
import { toMinutes, formatDuration } from '../utils/time'

export function LineCard({ line }: { line: Line }) {
  const first = line.stops[0]
  const last = line.stops[line.stops.length - 1]
  const dur = toMinutes(last.times[0]) - toMinutes(first.times[0])
  return (
    <Link to={`/linhas/${line.id}`} className="group rise block overflow-hidden rounded-2xl border border-hair bg-surface transition hover:-translate-y-0.5 hover:border-[color:var(--c)]" style={{ ['--c' as string]: `var(--line-${line.id})` }}>
      <div className="flex items-center gap-3 px-5 py-4 text-white" style={{ background: line.color }}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20"><Bus className="h-6 w-6" aria-hidden="true" /></span>
        <h3 className="font-display text-xl font-bold">{line.name}</h3>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-muted">Linha circular</p>
        <p className="mt-1 text-[0.95rem]">{line.summary.replace('Circular: ', '')}</p>
        <p className="mt-3 text-sm text-muted">
          {line.stops.length - 1} paragens · circuito de {formatDuration(dur)} · {line.trips.length} viagens por dia · partida em {getStop(first.stopId).name}
        </p>
        <p className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-bold text-primary">
          Ver horários <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </p>
      </div>
    </Link>
  )
}
