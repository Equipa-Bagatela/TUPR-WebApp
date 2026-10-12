import { getStop } from '../data/network'
import type { Line } from '../types'

/** Percurso vertical estilo metro/autocarro: horas à esquerda, linha com nós, paragens à direita. */
export function Timeline({ line, tripIndex, nextStopIdx }: { line: Line; tripIndex: number; nextStopIdx?: number }) {
  const last = line.stops.length - 1
  return (
    <ol aria-label={`Percurso da ${line.name}`} className="relative">
      {line.stops.map((s, i) => {
        const stop = getStop(s.stopId)
        const end = i === 0 || i === last
        const isNext = nextStopIdx === i
        return (
          <li key={i} className="relative flex min-h-[3.25rem] gap-3 sm:gap-4" aria-current={isNext ? 'step' : undefined}>
            <span className="tnum w-[3.1rem] shrink-0 pt-2.5 text-right font-display text-[0.95rem] font-bold sm:w-14">{s.times[tripIndex]}</span>
            <span className="relative flex w-5 shrink-0 justify-center" aria-hidden="true">
              {i > 0 && <span className="absolute left-1/2 top-0 h-3.5 w-[5px] -translate-x-1/2" style={{ background: `var(--line-${line.id})` }} />}
              {i < last && <span className="absolute bottom-0 left-1/2 top-3.5 w-[5px] -translate-x-1/2" style={{ background: `var(--line-${line.id})` }} />}
              <span
                className={`relative z-10 mt-2.5 block rounded-full border-[3px] bg-surface ${end ? 'h-5 w-5' : 'h-4 w-4'} ${isNext ? 'live-dot' : ''}`}
                style={{ borderColor: `var(--line-${line.id})`, background: end ? `var(--line-${line.id})` : undefined }}
              />
            </span>
            <span className="min-w-0 flex-1 pb-3 pt-2">
              <span className={`block leading-snug ${end ? 'font-bold' : 'font-semibold'}`}>
                {stop.name}
                {i === 0 && <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-xs font-bold uppercase">Partida</span>}
                {i === last && <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-xs font-bold uppercase">Chegada</span>}
                {isNext && <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-xs font-bold uppercase text-on-primary">Próxima</span>}
              </span>
              {stop.detail && <span className="block text-sm leading-snug text-muted">{stop.detail}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
